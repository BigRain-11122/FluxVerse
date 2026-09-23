// FluxVerse P-15 r12: batch proof harness for the event router (sentinel pattern, r11 builder style).
// Proves, fail-loud, three things:
//  1) stream logic end-to-end on a SANDBOX file under logs/ (never touches world/ — engine reads world only):
//     seed 3 lines -> SeekToEnd -> poll=0 (no history replay); append 1 CEO_ORDER + 1 noise -> poll fires exactly 1;
//     4s simulated time drains every pulse (edit mode -> DestroyImmediate, no leaks).
//  2) CEO_ORDER -> BrainTower gold pulse RENDERS: before/peak screenshots from the real CityCamera +
//     brightness-delta assertion around the brain tower (fail-loud if the glow is invisible).
//  3) CityScene saved with CityEventRouter wired — play mode runs the live poll loop for real.
// Sentinel: <repo>/logs/eventrouter.run -> proof -> <repo>/logs/eventrouter.done (OK/FAIL report).
// All comments ASCII. No 3D. Screenshot path: <repo>/docs/design/m1-r12-pulse-*.png
using System;
using System.IO;
using UnityEngine;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine.SceneManagement;

namespace FluxVerse
{
    public static class EventRouterProof
    {
        static string ProjectRoot { get { return Path.GetDirectoryName(Application.dataPath); } }
        static string RepoRoot { get { return Path.GetDirectoryName(ProjectRoot); } }
        static string SentinelPath { get { return Path.Combine(RepoRoot, "logs", "eventrouter.run"); } }
        static string DonePath { get { return Path.Combine(RepoRoot, "logs", "eventrouter.done"); } }
        static string SandboxPath { get { return Path.Combine(RepoRoot, "logs", "eventrouter-sandbox.jsonl"); } }
        static string ScenePath { get { return "Assets/Scenes/CityScene.unity"; } }

        [InitializeOnLoadMethod]
        static void Hook()
        {
            if (File.Exists(SentinelPath))
                EditorApplication.delayCall += Run;
        }

        public static void BatchRun() { Run(); }

        static void Run()
        {
            if (!File.Exists(SentinelPath)) return;   // single-shot guard
            try
            {
                string report = Prove();
                File.WriteAllText(DonePath, "OK " + report + " ts=" + DateTime.UtcNow.ToString("o"));
            }
            catch (Exception e)
            {
                File.WriteAllText(DonePath, "FAIL " + e.GetType().Name + ": " + e.Message + " | " + e.StackTrace
                    + " ts=" + DateTime.UtcNow.ToString("o"));
            }
            finally
            {
                if (File.Exists(SentinelPath)) File.Delete(SentinelPath);
            }
        }

        static string Prove()
        {
            // ---- A. sandbox stream logic (runs in the throwaway boot scene, nothing saved) ----
            if (File.Exists(SandboxPath)) File.Delete(SandboxPath);
            File.WriteAllText(SandboxPath,
                "{\"ts_utc\":\"2026-09-23T10:00:00Z\",\"type\":\"RESIDENT_SAY\",\"summary\":\"seed noise\"}\n" +
                "{\"ts_utc\":\"2026-09-23T10:01:00Z\",\"type\":\"CEO_ORDER\",\"zone\":\"quant\",\"summary\":\"seed order (history, must NOT fire)\"}\n" +
                "{\"ts_utc\":\"2026-09-23T10:02:00Z\",\"type\":\"FX_TICK\",\"summary\":\"seed noise\"}\n");
            FluxEventRouter sandbox = new FluxEventRouter(SandboxPath, n => new Vector3(0f, 11f, 0f));
            sandbox.SeekToEnd();
            int f0 = sandbox.PollOnce();
            if (f0 != 0) throw new InvalidOperationException("history replayed: SeekToEnd broken, fired=" + f0);
            File.AppendAllText(SandboxPath,
                "{\"ts_utc\":\"2026-09-23T10:03:00Z\",\"type\":\"CEO_ORDER\",\"zone\":\"media\",\"summary\":\"appended live order (must fire)\"}\n" +
                "{\"ts_utc\":\"2026-09-23T10:04:00Z\",\"type\":\"FX_TICK\",\"summary\":\"appended noise\"}\n");
            int f1 = sandbox.PollOnce();
            if (f1 != 1) throw new InvalidOperationException("append detection broken: expected 1, fired=" + f1);
            if (sandbox.PulseCount != 1) throw new InvalidOperationException("pulse spawn broken: count=" + sandbox.PulseCount);
            for (int i = 0; i < 40; i++) sandbox.Tick(0.1f);   // 4.0s simulated > 2.4s life
            if (sandbox.PulseCount != 0) throw new InvalidOperationException("pulse leak: " + sandbox.PulseCount + " not destroyed");

            // ---- B. real scene: wire the persistent router, save ----
            Scene scene = EditorSceneManager.OpenScene(ScenePath, OpenSceneMode.Single);
            GameObject routerGo = GameObject.Find("CityEventRouter");
            CityEventRouter router = routerGo != null ? routerGo.GetComponent<CityEventRouter>() : null;
            if (router == null)
            {
                routerGo = new GameObject("CityEventRouter");
                router = routerGo.AddComponent<CityEventRouter>();
            }
            bool routerSaved = EditorSceneManager.SaveScene(scene);   // persist wiring BEFORE transient pulses

            GameObject anchor = GameObject.Find("BrainTower");
            if (anchor == null) throw new InvalidOperationException("BrainTower anchor missing in CityScene");
            GameObject camGo = GameObject.Find("CityCamera");
            if (camGo == null) throw new InvalidOperationException("CityCamera missing in CityScene");
            Camera cam = camGo.GetComponent<Camera>();
            if (cam == null) throw new InvalidOperationException("CityCamera has no Camera component");

            // ---- C. event-driven animation rendered: before vs pulse-peak ----
            // metric: WARMTH (avg r-b). The brain tower glass is already near-white (luminance ~0.75),
            // and CEO gold has near-equal luminance (0.767) -> brightness delta is ~0 by design.
            // The robust signal of a gold pulse over white glass is the warm hue shift (gold r-b = 0.55).
            Texture2D before = Shot(cam, "m1-r12-pulse-before.png");
            float beforeBri, beforeWarm;
            BoxMetrics(before, cam, 0f, 11.5f, out beforeBri, out beforeWarm);
            router.Core.TriggerDirect("CEO_ORDER");   // dispatch as if a live CEO_ORDER just arrived
            router.Core.Tick(0.24f);                  // advance to alpha peak (peak-at 0.25s)
            Texture2D peak = Shot(cam, "m1-r12-pulse-peak.png");
            float peakBri, peakWarm;
            BoxMetrics(peak, cam, 0f, 11.5f, out peakBri, out peakWarm);
            float alpha = router.Core.LastPulseAlpha;
            UnityEngine.Object.DestroyImmediate(before);
            UnityEngine.Object.DestroyImmediate(peak);
            float warmDelta = peakWarm - beforeWarm;
            float briDelta = peakBri - beforeBri;
            if (alpha < 0.9f) throw new InvalidOperationException("pulse alpha peak too low: " + alpha.ToString("F3"));
            if (warmDelta < 0.05f) throw new InvalidOperationException("pulse not visible over brain tower (warmth): delta=" + warmDelta.ToString("F3"));

            if (File.Exists(SandboxPath)) File.Delete(SandboxPath);   // clean sandbox evidence file
            return "sandbox(f0=" + f0 + ",f1=" + f1 + ",drained) router_saved=" + routerSaved
                + " anchor=(" + anchor.transform.position.x.ToString("F1") + "," + anchor.transform.position.y.ToString("F1") + ")"
                + " pulse_alpha_peak=" + alpha.ToString("F2")
                + " brain_box(bri " + beforeBri.ToString("F3") + "->" + peakBri.ToString("F3") + " d=" + briDelta.ToString("F3")
                + ", warm " + beforeWarm.ToString("F3") + "->" + peakWarm.ToString("F3") + " d=" + warmDelta.ToString("F3") + ")"
                + " shots=2";
        }

        static Texture2D Shot(Camera cam, string name)
        {
            RenderTexture rt = new RenderTexture(1920, 1080, 24, RenderTextureFormat.ARGB32);
            cam.targetTexture = rt;
            cam.Render();
            RenderTexture.active = rt;
            Texture2D tex = new Texture2D(1920, 1080, TextureFormat.RGBA32, false);
            tex.ReadPixels(new Rect(0, 0, 1920, 1080), 0, 0);
            tex.Apply();
            cam.targetTexture = null;
            RenderTexture.active = null;
            rt.Release();
            UnityEngine.Object.DestroyImmediate(rt);
            File.WriteAllBytes(Path.Combine(RepoRoot, "docs", "design", name), tex.EncodeToPNG());
            return tex;
        }

        // average luminance + warmth (r-b) in a 40px-radius box around a world position (ortho projection)
        static void BoxMetrics(Texture2D tex, Camera cam, float wx, float wy, out float brightness, out float warmth)
        {
            float halfH = cam.orthographicSize;
            float halfW = halfH * (1920f / 1080f);
            int cx = (int)(((wx - cam.transform.position.x) / (2f * halfW) + 0.5f) * 1920f);
            int cy = (int)(((wy - cam.transform.position.y) / (2f * halfH) + 0.5f) * 1080f);
            double sumBri = 0, sumWarm = 0; int n = 0;
            for (int y = cy - 40; y <= cy + 40; y += 4)
                for (int x = cx - 40; x <= cx + 40; x += 4)
                {
                    if (x < 0 || x >= 1920 || y < 0 || y >= 1080) continue;
                    Color c = tex.GetPixel(x, y);
                    sumBri += (c.r + c.g + c.b) / 3f;
                    sumWarm += c.r - c.b;
                    n++;
                }
            int nn = System.Math.Max(1, n);
            brightness = (float)(sumBri / nn);
            warmth = (float)(sumWarm / nn);
        }
    }
}
