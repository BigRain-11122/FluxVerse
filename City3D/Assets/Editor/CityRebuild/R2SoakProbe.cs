using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Globalization;
using System.IO;
using System.Text;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine;

// R2 soak probe (main#5 tier-1 path: batchmode play-mode frame sampling).
// Two phases per run:
//   LOGIC  : play mode, no forced render -> editor play-loop tick rate
//   RENDER : play mode + one Camera.Render() into a 1280x720 RenderTexture per tick
//            -> loop rate including real GPU draw of the R2 scene
// Both are UNCAPPED (no vsync / no targetFrameRate in batchmode), so the fps numbers are a
// throughput CEILING, not display-capped realtime fps. The receipt must say so.
// Entry: -executeMethod R2SoakProbe.BatchEntry  (do NOT pass -quit; this exits by itself)
// Env: SOAK_LOGIC_SEC / SOAK_RENDER_SEC / SOAK_OUT_DIR
public static class R2SoakProbe
{
    const string ScenePath = "Assets/Scenes/CityRebuild_R2.unity";
    const int RenderW = 1280;
    const int RenderH = 720;
    const double PlayEnterTimeoutSec = 120.0;
    const int WarmupFrames = 10;

    static readonly Stopwatch Sw = Stopwatch.StartNew();
    static string FVRoot { get { return Directory.GetParent(Directory.GetParent(Application.dataPath).FullName).FullName; } }
    static string OutDir
    {
        get
        {
            var e = Environment.GetEnvironmentVariable("SOAK_OUT_DIR");
            return string.IsNullOrEmpty(e) ? Path.Combine(FVRoot, "qa") : e;
        }
    }

    static int LogicSec { get { return EnvInt("SOAK_LOGIC_SEC", 180); } }
    static int RenderSec { get { return EnvInt("SOAK_RENDER_SEC", 180); } }

    enum Phase { Booting, Logic, Render, Finished }

    static Phase _phase = Phase.Booting;
    static double _phaseStart;
    static double _lastTick;
    static int _warmup;
    static int _logicFrames;
    static int _renderFrames;
    static readonly List<double> _logicDt = new List<double>();
    static readonly List<double> _renderDt = new List<double>();
    static int _errCount;
    static int _excCount;
    static readonly List<string> _firstErrors = new List<string>();
    static Camera _cam;
    static RenderTexture _rt;
    static bool _exited;
    static bool _firstTickLogged;
    static bool _prevOptEnabled;
    static EnterPlayModeOptions _prevOpt;

    static int EnvInt(string name, int fallback)
    {
        var v = Environment.GetEnvironmentVariable(name);
        int n;
        if (!string.IsNullOrEmpty(v) && int.TryParse(v, NumberStyles.Integer, CultureInfo.InvariantCulture, out n) && n > 0) return n;
        return fallback;
    }

    public static void BatchEntry()
    {
        try
        {
            Directory.CreateDirectory(OutDir);
            // Play-mode entry reloads the domain by default, which wipes every static field AND
            // the EditorApplication.update subscription installed below. The 2026-10-26 18:06 run
            // proved it: the log stopped right at play-mode entry and the probe never ticked.
            // Keep the domain alive for the soak and restore the project value when we finish.
            _prevOptEnabled = EditorSettings.enterPlayModeOptionsEnabled;
            _prevOpt = EditorSettings.enterPlayModeOptions;
            EditorSettings.enterPlayModeOptionsEnabled = true;
            EditorSettings.enterPlayModeOptions = EnterPlayModeOptions.DisableDomainReload;
            Application.runInBackground = true;
            Application.logMessageReceived += OnLog;
            UnityEngine.Debug.Log("CITY3D_SOAK_START scene=" + ScenePath + " logic_sec=" + LogicSec + " render_sec=" + RenderSec);
            EditorSceneManager.OpenScene(ScenePath, OpenSceneMode.Single);
            _cam = Camera.main;
            if (_cam == null) throw new Exception("no main camera in " + ScenePath);
            EditorApplication.update += Tick;
            EditorApplication.EnterPlaymode();
        }
        catch (Exception e)
        {
            Fail(e);
        }
    }

    static void OnLog(string cond, string stack, LogType type)
    {
        if (type == LogType.Error || type == LogType.Exception || type == LogType.Assert)
        {
            if (type == LogType.Exception) _excCount++; else _errCount++;
            if (_firstErrors.Count < 10) _firstErrors.Add(type + ": " + Trunc(cond, 200));
        }
    }

    static string Trunc(string s, int n) { return s == null ? "" : (s.Length <= n ? s : s.Substring(0, n)); }

    static void Tick()
    {
        if (_exited) return;
        try
        {
            double now = Sw.Elapsed.TotalSeconds;
            if (!_firstTickLogged)
            {
                _firstTickLogged = true;
                UnityEngine.Debug.Log("CITY3D_SOAK_TICK first t=" + F(now) + " playing=" + EditorApplication.isPlaying);
            }
            if (_phase == Phase.Booting)
            {
                if (!EditorApplication.isPlaying) { if (now > PlayEnterTimeoutSec) Fail(new Exception("play_mode_not_entered_within_" + PlayEnterTimeoutSec + "s")); return; }
                if (_warmup < WarmupFrames) { if (_warmup == 0) UnityEngine.Debug.Log("CITY3D_SOAK_PLAY entered t=" + F(now)); _warmup++; _lastTick = now; return; }
                _phase = Phase.Logic;
                _phaseStart = now;
                _lastTick = now;
                UnityEngine.Debug.Log("CITY3D_SOAK_PHASE logic");
                return;
            }

            double dt = now - _lastTick;
            _lastTick = now;
            if (dt <= 0) return;

            if (_phase == Phase.Logic)
            {
                _logicDt.Add(dt); _logicFrames++;
                if (now - _phaseStart >= LogicSec) StartRender(now);
            }
            else if (_phase == Phase.Render)
            {
                RenderOnce();
                _renderDt.Add(dt); _renderFrames++;
                if (now - _phaseStart >= RenderSec) Finish();
            }
        }
        catch (Exception e)
        {
            Fail(e);
        }
    }

    static void StartRender(double now)
    {
        _phase = Phase.Render;
        _phaseStart = now;
        _rt = new RenderTexture(RenderW, RenderH, 24, RenderTextureFormat.Default);
        _rt.Create();
        _cam.targetTexture = _rt;
        UnityEngine.Debug.Log("CITY3D_SOAK_PHASE render " + RenderW + "x" + RenderH);
    }

    static void RenderOnce()
    {
        if (_cam == null || _rt == null) return;
        _cam.Render();
    }

    static void Finish()
    {
        if (_exited) return;
        _exited = true;
        try
        {
            if (_cam != null) _cam.targetTexture = null;
            if (_rt != null) { _rt.Release(); UnityEngine.Object.DestroyImmediate(_rt); }

            var sb = new StringBuilder();
            sb.Append("{\n");
            sb.Append("  \"probe\": \"R2SoakProbe\",\n");
            sb.Append("  \"ts_utc\": \"" + DateTime.UtcNow.ToString("yyyy-MM-ddTHH:mm:ssZ", CultureInfo.InvariantCulture) + "\",\n");
            sb.Append("  \"scene\": \"" + ScenePath + "\",\n");
            sb.Append("  \"mode\": \"batchmode_playmode_uncapped\",\n");
            sb.Append("  \"render_target\": \"" + RenderW + "x" + RenderH + "\",\n");
            sb.Append("  \"logic\": " + Stat(_logicDt, _logicFrames) + ",\n");
            sb.Append("  \"render\": " + Stat(_renderDt, _renderFrames) + ",\n");
            sb.Append("  \"errors\": " + _errCount + ",\n");
            sb.Append("  \"exceptions\": " + _excCount + ",\n");
            sb.Append("  \"first_errors\": [");
            for (int i = 0; i < _firstErrors.Count; i++)
            {
                if (i > 0) sb.Append(", ");
                sb.Append("\"" + Esc(_firstErrors[i]) + "\"");
            }
            sb.Append("]\n}\n");

            var path = Path.Combine(OutDir, "r2-soak-" + DateTime.UtcNow.ToString("yyyyMMdd-HHmmss", CultureInfo.InvariantCulture) + ".json");
            File.WriteAllText(path, sb.ToString(), new UTF8Encoding(false));
            UnityEngine.Debug.Log("CITY3D_SOAK_JSON " + path);
            UnityEngine.Debug.Log("CITY3D_SOAK_DONE logic_fps_avg=" + Fps(_logicDt) + " render_fps_avg=" + Fps(_renderDt) + " errors=" + _errCount + " exceptions=" + _excCount);
            Application.logMessageReceived -= OnLog;
            EditorApplication.update -= Tick;
            RestorePlayModeOptions();
            EditorApplication.Exit(_errCount == 0 && _excCount == 0 ? 0 : 1);
        }
        catch (Exception e)
        {
            UnityEngine.Debug.LogError("CITY3D_SOAK_FAIL: " + e);
            EditorApplication.Exit(1);
        }
    }

    // Percentile helper: 1-based linear interpolation on a sorted copy.
    static double Pct(List<double> sorted, double p)
    {
        if (sorted.Count == 0) return 0.0;
        if (sorted.Count == 1) return sorted[0];
        double pos = (sorted.Count - 1) * p;
        int lo = (int)Math.Floor(pos);
        int hi = Math.Min(lo + 1, sorted.Count - 1);
        double frac = pos - lo;
        return sorted[lo] * (1 - frac) + sorted[hi] * frac;
    }

    static string Stat(List<double> dt, int frames)
    {
        if (dt.Count == 0) return "{\"frames\": 0}";
        var sorted = new List<double>(dt);
        sorted.Sort();
        double sum = 0; foreach (var d in sorted) sum += d;
        double avg = sum / sorted.Count;
        double p50 = Pct(sorted, 0.50);
        double p95 = Pct(sorted, 0.95);
        double max = sorted[sorted.Count - 1];
        double min = sorted[0];
        var sb = new StringBuilder();
        sb.Append("{");
        sb.Append("\"frames\": " + frames + ", ");
        sb.Append("\"dt_avg_ms\": " + Ms(avg) + ", ");
        sb.Append("\"dt_p50_ms\": " + Ms(p50) + ", ");
        sb.Append("\"dt_p95_ms\": " + Ms(p95) + ", ");
        sb.Append("\"dt_max_ms\": " + Ms(max) + ", ");
        sb.Append("\"dt_min_ms\": " + Ms(min) + ", ");
        sb.Append("\"fps_avg\": " + F(1.0 / avg) + ", ");
        sb.Append("\"fps_min\": " + F(1.0 / max) + ", ");
        sb.Append("\"fps_p95_slow\": " + F(1.0 / p95));
        sb.Append("}");
        return sb.ToString();
    }

    static string Ms(double s) { return F(s * 1000.0); }
    static string F(double v) { return v.ToString("0.###", CultureInfo.InvariantCulture); }
    static string Fps(List<double> dt)
    {
        if (dt.Count == 0) return "0";
        double sum = 0; foreach (var d in dt) sum += d;
        return F(dt.Count / sum);
    }

    static string Esc(string s)
    {
        return s == null ? "" : s.Replace("\\", "\\\\").Replace("\"", "\\\"").Replace("\r", " ").Replace("\n", " ");
    }

    static void RestorePlayModeOptions()
    {
        try
        {
            EditorSettings.enterPlayModeOptionsEnabled = _prevOptEnabled;
            EditorSettings.enterPlayModeOptions = _prevOpt;
        }
        catch { }
    }

    static void Fail(Exception e)
    {
        if (_exited) return;
        _exited = true;
        try
        {
            UnityEngine.Debug.LogError("CITY3D_SOAK_FAIL: " + e);
            Application.logMessageReceived -= OnLog;
            EditorApplication.update -= Tick;
            RestorePlayModeOptions();
            EditorApplication.Exit(1);
        }
        catch { }
    }
}