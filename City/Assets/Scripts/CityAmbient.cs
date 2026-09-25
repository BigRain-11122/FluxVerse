// FluxVerse r14: CityAmbient - thin MonoBehaviour adapter of the ambient cycle (r13 logic).
// SEPARATE FILE LAW (r14): MonoBehaviour classes must live in a <ClassName>.cs file or the
// serialized scene reference breaks across editor sessions (Tuanjie writes embedded
// class-name stubs for mismatched names which do not re-resolve; GetComponent returned
// null on reload and r13's fallback silently stacked 5 ghost CityAmbient objects).
// Logic cores (AmbientWheel / WeatherRules / WeatherField) stay in AmbientWeather.cs.
// r146 (P-71(3) slice B): the mood-visual face rides this same poll - the
// city mood director (MoodDirector.cs, r144 mirror of BigLife
// mood_director.py) derives the five-state mood from the SAME world inputs
// CityBubbles reads (beijing clock + weather_kind + 24h event density +
// WEATHER_ALERT - an INDEPENDENT same-path read, zero coupling), then
// MoodVisualRules maps it onto two closed-band channels: the 17 modulated
// neon signs (grayscale runtime tint, exempt structure family untouched)
// and the router breath peak (BreathPeakScale). RestoreMoodNeutral() is the
// r124 runtime law face: neutral white + scale 1.0 before any scene save.
// Polls world/world-state.json READ-ONLY every ~10s (perceptor owns all writes).
// Pure 2D: sky/tint/band = SpriteRenderer quads; rain/snow = recycled sprite field.
using System;
using System.IO;
using System.Text.RegularExpressions;
using UnityEngine;

namespace FluxVerse
{
    // scene component: polls world-state.json read-only and drives all ambient visuals
    public class CityAmbient : MonoBehaviour
    {
        public const float PollIntervalSec = 10f;
        const int RainDrops = 140, SnowDrops = 90;

        [Serializable] class StateFile { public Reality reality; }
        [Serializable] class Reality
        {
            public string city_day_phase, beijing_hhmm, weather_kind, weather_code, weather_wind_ms;
        }

        // P-28 item 2 (r34): parallax silhouette sprites (scene-wired serialized fields;
        // unwired = silent degrade per the probe contract - no skyline, no exceptions)
        public Sprite skylineFar, skylineNear;

        WeatherField field;
        SpriteRenderer sky, tint, band;
        SpriteRenderer skylineFarR, skylineNearR;
        SpriteRenderer[] drops;
        float pollTimer = 999f;      // poll on first Update
        float bandPhase, bandAlpha;
        AmbientTier tier = AmbientTier.Night;
        WeatherMode mode = WeatherMode.None;
        bool alert;
        string curMood;               // r146: applied mood name (null = neutral / not yet polled)

        // r146: independent stream read (CityBubbles same-path law - identical
        // regexes, single backward pass, ts-unparseable lines never count)
        static readonly Regex MoodTypeRx = new Regex("\"type\":\"([A-Z_]+)\"");
        static readonly Regex MoodTsRx = new Regex("\"ts_utc\":\"([^\"]+)\"");

        public AmbientTier CurrentTier { get { return tier; } }
        public WeatherMode CurrentMode { get { return mode; } }
        public bool AlertOn { get { return alert; } }
        public float BandAlpha { get { return bandAlpha; } }
        public float WindMs { get; private set; }   // r31: read-only for the ambient bed adapter
        public string CurrentMood { get { return curMood; } }   // r146 proof tap

        void Awake() { EnsureVisuals(); }

        void Update()
        {
            pollTimer += Time.deltaTime;
            if (pollTimer >= PollIntervalSec) { pollTimer = 0f; Poll(); }
            StepWeather(Time.deltaTime);
            SyncSkyline();
        }

        // reads the perceptor snapshot (read-only); silent-degrade on any file trouble
        public void Poll()
        {
            try
            {
                StateFile sf = JsonUtility.FromJson<StateFile>(File.ReadAllText(StatePath()));
                if (sf == null || sf.reality == null) return;
                Reality r = sf.reality;
                int h = ParseHour(r.beijing_hhmm);
                AmbientTier t = h >= 0 ? AmbientWheel.TierForHour(h)
                                       : AmbientWheel.TierFromName(r.city_day_phase);
                ApplyAmbient(t);
                ApplyWeather(r.weather_kind, ParseFloat(r.weather_wind_ms), (int)ParseFloat(r.weather_code));
                ApplyMoodVisual(DeriveMoodFromWorld());   // r146: same poll, mood-visual face
            }
            catch (Exception) { /* keep current visuals: probe contract silent degrade */ }
        }

        // r146 (P-71(3) slice B): derive the city mood from the world inputs -
        // the same files CityBubbles reads, read INDEPENDENTLY (zero coupling,
        // deterministic same-input-same-output). Null = mood absent (calendar
        // null / file trouble) = the steady row downstream (degrade law).
        public string DeriveMoodFromWorld()
        {
            try
            {
                StateFile sf = JsonUtility.FromJson<StateFile>(File.ReadAllText(StatePath()));
                if (sf == null || sf.reality == null) return null;
                string hhmm = sf.reality.beijing_hhmm;
                int h, m;
                if (string.IsNullOrEmpty(hhmm) || !ParseHourMin(hhmm, out h, out m)) return null;
                string repo = Path.GetDirectoryName(Path.GetDirectoryName(Application.dataPath));
                int density; bool alertHit;
                ReadStreamFacts(Path.Combine(repo, "world", "world-events.jsonl"), out density, out alertHit);
                DateTime bj = DateTime.Now.Date + new TimeSpan(h, m, 0);
                MoodState st = MoodDirector.DeriveState(bj, density, MoodDirector.DenseDefault,
                    alertHit, sf.reality.weather_kind, MoodDirector.LoadCalendar());
                return st != null ? st.Mood : null;
            }
            catch (Exception) { return null; }
        }

        // r146: apply the mood row to both channels (the proof calls this
        // directly with a pinned mood; the live poll feeds DeriveMoodFromWorld).
        // Neon channel = the 17 modulated table signs (fresh Find per apply =
        // flip-safe against any rebuild; exempt structure family never touched);
        // breath channel = the persistent CityEventRouter's core scale. Missing
        // GOs degrade silently here - the PROOF fails loud instead.
        public void ApplyMoodVisual(string moodName)
        {
            float neon = MoodVisualRules.NeonScaleFor(moodName);
            float breath = MoodVisualRules.BreathScaleFor(moodName);
            curMood = moodName;
            Color moodTint = MoodVisualRules.NeonTint(neon);
            for (int i = 0; i < NeonRules.Count; i++)
            {
                if (MoodVisualRules.IsExemptSign(i)) continue;
                GameObject go = GameObject.Find(NeonRules.Name(i));
                if (go == null) continue;
                SpriteRenderer sr = go.GetComponent<SpriteRenderer>();
                if (sr == null) continue;
                sr.color = moodTint;
            }
            CityEventRouter cer = FindEventRouter();
            if (cer != null) cer.Core.BreathPeakScale = breath;
        }

        // r124 runtime law: restore neutral white signs + baseline breath scale
        // before any scene save - the saved scene never learns runtime mood.
        public void RestoreMoodNeutral()
        {
            for (int i = 0; i < NeonRules.Count; i++)
            {
                if (MoodVisualRules.IsExemptSign(i)) continue;
                GameObject go = GameObject.Find(NeonRules.Name(i));
                if (go == null) continue;
                SpriteRenderer sr = go.GetComponent<SpriteRenderer>();
                if (sr != null) sr.color = Color.white;
            }
            CityEventRouter cer = FindEventRouter();
            if (cer != null) cer.Core.BreathPeakScale = 1f;
            curMood = null;
        }

        static CityEventRouter FindEventRouter()
        {
            GameObject go = GameObject.Find("CityEventRouter");
            return go != null ? go.GetComponent<CityEventRouter>() : null;
        }

        // r146 (r23 owned-lifetime law face): destroy every runtime visual child.
        // All ambient visuals (sky/skyline/tint/band/drops) are runtime-only
        // children by the r13/r25 law - nothing is ever serialized - so ANY child
        // on disk is stale contamination (the r146 red-chain: a restore-save once
        // persisted EnsureVisuals children into CityScene). Proofs call this
        // before any scene save; EnsureVisuals() rebuilds everything after it.
        public void ReleaseVisuals()
        {
            for (int i = transform.childCount - 1; i >= 0; i--)
            {
                Transform c = transform.GetChild(i);
                if (Application.isPlaying) Destroy(c.gameObject);
                else DestroyImmediate(c.gameObject);
            }
            sky = null; tint = null; band = null;
            skylineFarR = null; skylineNearR = null;
            drops = null;
            field = null;
        }

        // r146: 24h event density + WEATHER_ALERT hit from the live stream
        // (CityBubbles.ReadStream mirror - backward pass, rotation-safe, the
        // perceptor owns writes). Mood_director.py read_world law: a line with
        // an unparseable ts never counts - data absent cannot be verified.
        static void ReadStreamFacts(string streamPath, out int density, out bool alertHit)
        {
            density = 0; alertHit = false;
            if (!File.Exists(streamPath)) return;
            string[] lines;
            try { lines = File.ReadAllLines(streamPath); }
            catch (Exception) { return; }
            DateTime cut = DateTime.UtcNow.AddHours(-24.0);
            for (int i = lines.Length - 1; i >= 0; i--)
            {
                string ln = lines[i];
                if (string.IsNullOrEmpty(ln)) continue;
                if (TsInWindow(ln, cut))
                {
                    density++;
                    if (!alertHit && MoodTypeRx.Match(ln).Groups[1].Value == "WEATHER_ALERT") alertHit = true;
                }
            }
        }

        static bool TsInWindow(string line, DateTime cut)
        {
            Match m = MoodTsRx.Match(line);
            if (!m.Success) return false;
            DateTime t;
            if (!DateTime.TryParseExact(m.Groups[1].Value, "yyyy-MM-dd'T'HH:mm:ss'Z'",
                    System.Globalization.CultureInfo.InvariantCulture,
                    System.Globalization.DateTimeStyles.AssumeUniversal, out t))
                return false;
            return t >= cut;
        }

        static bool ParseHourMin(string hhmm, out int h, out int m)
        {
            h = 0; m = 0;
            int sep = hhmm.IndexOf(':');
            if (sep <= 0) return false;
            return int.TryParse(hhmm.Substring(0, sep), out h) && int.TryParse(hhmm.Substring(sep + 1), out m);
        }

        static string StatePath()
        {
            string projectRoot = Path.GetDirectoryName(Application.dataPath);   // .../City
            string repoRoot = Path.GetDirectoryName(projectRoot);               // .../FluxVerse
            return Path.Combine(repoRoot, "world", "world-state.json");
        }

        static int ParseHour(string hhmm)
        {
            if (string.IsNullOrEmpty(hhmm)) return -1;
            int sep = hhmm.IndexOf(':');
            if (sep <= 0) return -1;
            int h; return int.TryParse(hhmm.Substring(0, sep), out h) ? h : -1;
        }

        static float ParseFloat(string s)
        {
            float v; return float.TryParse(s, out v) ? v : 0f;
        }

        public void ApplyAmbient(AmbientTier t)
        {
            if (sky == null) EnsureVisuals();
            tier = t;
            AmbientPalette p = AmbientWheel.PaletteFor(t);
            sky.sprite = SkySprite(t);
            tint.color = new Color(p.tint.r, p.tint.g, p.tint.b, p.tintAlpha);
            if (skylineFarR != null) skylineFarR.color = SkylineRules.FogFar(t);
            if (skylineNearR != null) skylineNearR.color = SkylineRules.FogNear(t);
            Camera cam = Cam();
            if (cam != null) cam.backgroundColor = p.camBg;
        }

        // P-28 (r34): silhouettes track 0.9 x camera (subtle parallax). Y stays glued
        // to the world horizon (a distant skyline does not sink when the camera drops).
        public void SyncSkyline()
        {
            if (skylineFarR == null && skylineNearR == null) return;
            Camera cam = Cam();
            float fx = cam != null ? SkylineRules.FollowFactor * cam.transform.position.x : 0f;
            if (skylineFarR != null)
            {
                Vector3 p = skylineFarR.transform.position;
                skylineFarR.transform.position = new Vector3(fx, p.y, p.z);
            }
            if (skylineNearR != null)
            {
                Vector3 p = skylineNearR.transform.position;
                skylineNearR.transform.position = new Vector3(fx, p.y, p.z);
            }
        }

        public void ApplyWeather(string kind, float windMs, int wmoCode)
        {
            if (sky == null) EnsureVisuals();
            mode = WeatherRules.ModeForKind(kind);
            alert = WeatherRules.IsAlert(windMs, wmoCode);
            WindMs = windMs;
            field.Configure(mode, windMs);
            SyncDrops();
        }

        public void StepWeather(float dt)
        {
            if (sky == null) EnsureVisuals();
            if (mode != WeatherMode.None)
            {
                field.Step(dt);
                SyncDrops();
            }
            bandPhase += dt * 2.6f;
            float target = alert ? 0.10f + 0.13f * (0.5f + 0.5f * Mathf.Sin(bandPhase)) : 0f;
            bandAlpha = Mathf.Lerp(bandAlpha, target, Mathf.Clamp01(dt * 4f));
            band.color = new Color(1f, 0.12f, 0.08f, bandAlpha);
        }

        // builds every visual lazily (nothing persisted in the scene asset; runtime children only)
        public void EnsureVisuals()
        {
            if (sky != null) return;
            // sky backdrop: behind every tilemap (builder sorting orders 0..4). Quad height = 40 =
            // exactly the ortho-20 vertical view, so the visible band shows the FULL gradient
            // (zenith color truly reached at the top edge; camBg = skyTop covers any later drift).
            sky = MakeQuad("AmbientSky", -10, SkySprite(tier), 92f, 40f, 0f);
            sky.transform.SetParent(transform, false);
            // P-28 item 2 (r34): parallax silhouettes behind every tilemap, in front of
            // the sky (orders -9/-8). Runtime-constructed like every ambient visual;
            // unwired sprites stay silent. Integer x2 scale = point-filter law (r29 gate).
            if (skylineFar != null)
            {
                skylineFarR = SkylineQuad("SkylineFar", SkylineRules.FarOrder, skylineFar,
                    SkylineRules.FarTopRow, SkylineRules.FarContentTopY, SkylineRules.FogFar(tier));
                skylineFarR.transform.SetParent(transform, false);
            }
            if (skylineNear != null)
            {
                skylineNearR = SkylineQuad("SkylineNear", SkylineRules.NearOrder, skylineNear,
                    SkylineRules.NearTopRow, SkylineRules.NearContentTopY, SkylineRules.FogNear(tier));
                skylineNearR.transform.SetParent(transform, false);
            }
            // ambient tint over the CITY band only - the PAINTED extent (y -16..+15): the
            // builder paves to world +15 (tile cells to 14), so a 30u quad topping at +14
            // left a 1u full-width untinted bright strip at the far shore on every tinted
            // tier (r22 finding; fixed by the r51 pilot, TECH sec.9 debt line). Atmosphere
            // between buildings, sky strips stay pure gradient. Above tilemaps 0..4, below
            // band 9 / pulses 10.
            tint = MakeQuad("AmbientTint", 8, WhiteSprite(), 92f, 31f, -0.5f);
            tint.transform.SetParent(transform, false);
            // city-wide alert band (gale / severe WMO): functional red, river level
            band = MakeQuad("AmbientAlertBand", 9, WhiteSprite(), 92f, 4f, 0f);
            band.transform.SetParent(transform, false);
            band.color = new Color(1f, 0.12f, 0.08f, 0f);
            // weather drop field: front of everything (above event pulses for depth feel)
            drops = new SpriteRenderer[RainDrops];
            for (int i = 0; i < drops.Length; i++)
            {
                GameObject go = new GameObject("AmbientDrop" + i);
                go.transform.SetParent(transform, false);
                SpriteRenderer sr = go.AddComponent<SpriteRenderer>();
                sr.sortingOrder = 12;
                drops[i] = sr;
                go.SetActive(false);
            }
            field = new WeatherField(RainDrops, 20260923);
            ApplyAmbient(tier);
            SyncDrops();
        }

        void SyncDrops()
        {
            int active = mode == WeatherMode.Rain ? drops.Length : (mode == WeatherMode.Snow ? SnowDrops : 0);
            for (int i = 0; i < drops.Length; i++)
            {
                bool on = i < active;
                if (drops[i].gameObject.activeSelf != on) drops[i].gameObject.SetActive(on);
                if (!on) continue;
                if (mode == WeatherMode.Rain)
                {
                    drops[i].sprite = StreakSprite();
                    drops[i].color = new Color(0.70f, 0.85f, 1f, 0.55f);   // ambient rain, cyan-white
                    drops[i].transform.position = field.Pos(i);
                    float lean = -Mathf.Atan2(field.WindX, 45f) * Mathf.Rad2Deg;
                    drops[i].transform.rotation = Quaternion.Euler(0f, 0f, lean);
                    drops[i].transform.localScale = new Vector3(1.6f, 1.6f, 1f);
                }
                else
                {
                    drops[i].sprite = DotSprite();
                    drops[i].color = new Color(0.95f, 0.97f, 1f, 0.85f);   // snow
                    drops[i].transform.position = field.Pos(i);
                    drops[i].transform.rotation = Quaternion.identity;
                    drops[i].transform.localScale = new Vector3(1.6f, 1.6f, 1f);
                }
            }
        }

        static Camera Cam()
        {
            GameObject c = GameObject.Find("CityCamera");
            return c == null ? null : c.GetComponent<Camera>();
        }

        static SpriteRenderer MakeQuad(string name, int order, Sprite sprite, float sx, float sy, float yOff)
        {
            GameObject go = new GameObject(name);
            go.transform.position = new Vector3(0f, yOff, 0f);
            SpriteRenderer sr = go.AddComponent<SpriteRenderer>();
            sr.sprite = sprite;
            sr.sortingOrder = order;
            Vector3 n = sprite.bounds.size;   // natural world size: scale must be RELATIVE
            go.transform.localScale = new Vector3(sx / n.x, sy / n.y, 1f);
            return sr;
        }

        // P-28 (r34): skyline quad - integer x2 scale (point law), center solved so the
        // measured first content row lands exactly at contentTopY (geometry in SkylineRules)
        static SpriteRenderer SkylineQuad(string name, int order, Sprite sprite, int topRow, float contentTopY, Color fog)
        {
            GameObject go = new GameObject(name);
            SpriteRenderer sr = go.AddComponent<SpriteRenderer>();
            sr.sprite = sprite;
            sr.sortingOrder = order;
            sr.color = fog;
            go.transform.localScale = new Vector3(SkylineRules.Scale, SkylineRules.Scale, 1f);
            go.transform.position = new Vector3(0f, SkylineRules.QuadCenterY(topRow, contentTopY), 0f);
            return sr;
        }

        static Sprite _white;
        static Sprite WhiteSprite()
        {
            if (_white != null) return _white;
            const int S = 4;
            Texture2D tex = new Texture2D(S, S, TextureFormat.RGBA32, false);
            tex.filterMode = FilterMode.Point;
            for (int y = 0; y < S; y++)
                for (int x = 0; x < S; x++) tex.SetPixel(x, y, new Color(1f, 1f, 1f, 1f));
            tex.Apply();
            _white = Sprite.Create(tex, new Rect(0, 0, S, S), new Vector2(0.5f, 0.5f), 16f);
            return _white;
        }

        static Sprite _streak;
        static Sprite StreakSprite()   // 3x14 vertical rain streak, tapered ends
        {
            if (_streak != null) return _streak;
            const int W = 3, H = 14;
            Texture2D tex = new Texture2D(W, H, TextureFormat.RGBA32, false);
            tex.filterMode = FilterMode.Point;
            for (int y = 0; y < H; y++)
                for (int x = 0; x < W; x++)
                {
                    float ay = Mathf.Sin((y + 0.5f) / H * Mathf.PI);              // taper ends
                    float ax = 1f - Mathf.Abs((x + 0.5f) - W * 0.5f) / (W * 0.5f); // bright center
                    tex.SetPixel(x, y, new Color(1f, 1f, 1f, ay * ax));
                }
            tex.Apply();
            _streak = Sprite.Create(tex, new Rect(0, 0, W, H), new Vector2(0.5f, 0.5f), 16f);
            return _streak;
        }

        static Sprite _dot;
        static Sprite DotSprite()   // 5x5 soft snow dot
        {
            if (_dot != null) return _dot;
            const int S = 5;
            Texture2D tex = new Texture2D(S, S, TextureFormat.RGBA32, false);
            tex.filterMode = FilterMode.Point;
            for (int y = 0; y < S; y++)
                for (int x = 0; x < S; x++)
                {
                    float dx = (x + 0.5f) / S * 2f - 1f, dy = (y + 0.5f) / S * 2f - 1f;
                    float a = Mathf.Clamp01(1.15f - Mathf.Sqrt(dx * dx + dy * dy));
                    tex.SetPixel(x, y, new Color(1f, 1f, 1f, a));
                }
            tex.Apply();
            _dot = Sprite.Create(tex, new Rect(0, 0, S, S), new Vector2(0.5f, 0.5f), 16f);
            return _dot;
        }

        static readonly Sprite[] _skyCache = new Sprite[4];
        static Sprite SkySprite(AmbientTier t)   // vertical gradient, one per tier (cached)
        {
            int idx = (int)t;
            if (_skyCache[idx] != null) return _skyCache[idx];
            AmbientPalette p = AmbientWheel.PaletteFor(t);
            const int W = 8, H = 64;
            Texture2D tex = new Texture2D(W, H, TextureFormat.RGBA32, false);
            tex.wrapMode = TextureWrapMode.Clamp;
            tex.filterMode = FilterMode.Bilinear;
            for (int y = 0; y < H; y++)
            {
                Color c = Color.Lerp(p.skyBottom, p.skyTop, y / (float)(H - 1));   // y=0 bottom row
                for (int x = 0; x < W; x++) tex.SetPixel(x, y, c);
            }
            tex.Apply();
            _skyCache[idx] = Sprite.Create(tex, new Rect(0, 0, W, H), new Vector2(0.5f, 0.5f), 16f);
            return _skyCache[idx];
        }
    }
}
