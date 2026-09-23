// FluxVerse P-15 r13: ambient cycle (24h four-tier color wheel) + weather FX, engine side.
// CEO order 18:45: the city joins real 24h time and real Shanghai weather (M1 acceptance item,
// TECH P-15 expansion). Data source: world/world-state.json, READ-ONLY poll every ~10s
// (perceptor scan owns all writes; the engine never writes world/ or any sibling repo).
// Flat reality keys consumed: city_day_phase, beijing_hhmm, weather_kind, weather_code, weather_wind_ms.
// Pure 2D only: sky/tint/band = SpriteRenderer quads; rain/snow = manual recycled sprite field
// (steppable in edit mode for batch proofs, zero shader/material risk). No 3D anywhere.
// Tier bounds mirror probes/clock.ps1 exactly (probe = single source of truth):
//   dawn 5-8, day 9-16, dusk 17-19, night else. Palettes follow DESIGN section 9:
//   dusk = warm purple-gold per art-target-dusk.png; night = deep blue-black (city lights carry
//   the electric cyan); pink/purple only ever ambient sky tint, never a functional light.
// Alert rule mirrors probes/weather.ps1 exactly: wind >= 17.2 m/s (gale family) or heavy WMO
// codes 65,67,75,77,82,95,96,99 -> city-wide red alert band (functional red, five-color law).
// Split follows EventRouter.cs (r12): pure logic cores (AmbientWheel/WeatherRules/WeatherField,
// headless-testable) + CityAmbient thin MonoBehaviour (poll + apply + step).
using System;
using System.IO;
using UnityEngine;

namespace FluxVerse
{
    public enum AmbientTier { Dawn, Day, Dusk, Night }
    public enum WeatherMode { None, Rain, Snow }

    public struct AmbientPalette
    {
        public Color skyTop, skyBottom, tint, camBg;
        public float tintAlpha;
    }

    // pure logic: hour -> tier -> palette (headless-testable)
    public static class AmbientWheel
    {
        public static AmbientTier TierForHour(int h)   // bounds = probes/clock.ps1
        {
            if (h >= 5 && h <= 8) return AmbientTier.Dawn;
            if (h >= 9 && h <= 16) return AmbientTier.Day;
            if (h >= 17 && h <= 19) return AmbientTier.Dusk;
            return AmbientTier.Night;
        }

        public static AmbientTier TierFromName(string name)
        {
            if (!string.IsNullOrEmpty(name))
            {
                if (name == "dawn") return AmbientTier.Dawn;
                if (name == "day") return AmbientTier.Day;
                if (name == "dusk") return AmbientTier.Dusk;
                if (name == "night") return AmbientTier.Night;
            }
            return TierForHour(DateTime.Now.Hour);   // bootstrap when state absent (host runs UTC+8)
        }

        public static AmbientPalette PaletteFor(AmbientTier t)
        {
            AmbientPalette p = new AmbientPalette();
            switch (t)
            {
                case AmbientTier.Dawn:   // cool blue zenith over warm pink horizon
                    p.skyTop = new Color(0.42f, 0.52f, 0.72f);
                    p.skyBottom = new Color(0.98f, 0.68f, 0.52f);
                    p.tint = new Color(1f, 0.72f, 0.55f); p.tintAlpha = 0.08f;
                    break;
                case AmbientTier.Day:    // clean daylight, city tiles at full color
                    p.skyTop = new Color(0.45f, 0.66f, 0.92f);
                    p.skyBottom = new Color(0.78f, 0.87f, 0.96f);
                    p.tint = Color.white; p.tintAlpha = 0f;
                    break;
                case AmbientTier.Dusk:   // art-target-dusk: purple zenith, warm gold horizon
                    p.skyTop = new Color(0.36f, 0.22f, 0.48f);
                    p.skyBottom = new Color(0.98f, 0.58f, 0.32f);
                    p.tint = new Color(1f, 0.62f, 0.42f); p.tintAlpha = 0.22f;
                    break;
                default:                 // night: deep blue-black, cyan comes from city lights
                    p.skyTop = new Color(0.015f, 0.02f, 0.06f);
                    p.skyBottom = new Color(0.05f, 0.09f, 0.20f);
                    p.tint = new Color(0.04f, 0.09f, 0.24f); p.tintAlpha = 0.45f;
                    break;
            }
            p.camBg = p.skyTop;
            return p;
        }
    }

    // pure logic: probe weather values -> FX mode + alert flag (headless-testable)
    public static class WeatherRules
    {
        public static readonly int[] HeavyWmo = { 65, 67, 75, 77, 82, 95, 96, 99 };   // = weather.ps1

        public static WeatherMode ModeForKind(string kind)
        {
            if (kind == "rain" || kind == "thunder") return WeatherMode.Rain;   // thunderstorm rains
            if (kind == "snow") return WeatherMode.Snow;
            return WeatherMode.None;   // clear/cloud/fog/other: no particle field
        }

        public static bool IsAlert(float windMs, int wmoCode)
        {
            if (windMs >= 17.2f) return true;
            foreach (int c in HeavyWmo) if (wmoCode == c) return true;
            return false;
        }
    }

    // pure simulation: recycled drop field (positions/speeds only, no GameObjects -> sandbox-testable)
    public class WeatherField
    {
        public const float XHalf = 36f, YTop = 23f, YBottom = -23f;   // covers ortho-20 view + margin

        public readonly int Count;
        public WeatherMode Mode { get; private set; }
        public float WindX { get; private set; }

        readonly float[] x, y, v, phase;
        readonly System.Random rng;

        public WeatherField(int count, int seed)
        {
            Count = count;
            x = new float[count]; y = new float[count]; v = new float[count]; phase = new float[count];
            rng = new System.Random(seed);
        }

        public void Configure(WeatherMode mode, float windMs)
        {
            Mode = mode;
            WindX = Mathf.Clamp(windMs / 25f, -1.5f, 1.5f) * 12f;   // wind leans the fall
            for (int i = 0; i < Count; i++) Respawn(i, true);
        }

        void Respawn(int i, bool anywhere)
        {
            x[i] = (float)(rng.NextDouble() * 2.0 - 1.0) * XHalf;
            y[i] = anywhere ? (float)(rng.NextDouble() * 2.0 - 1.0) * YTop
                            : YTop + (float)rng.NextDouble() * 3f;
            v[i] = Mode == WeatherMode.Rain ? 30f + (float)rng.NextDouble() * 18f
                                            : 4.5f + (float)rng.NextDouble() * 3.5f;
            phase[i] = (float)rng.NextDouble() * 6.283f;
        }

        public int Step(float dt)   // returns recycles this step (drop crossed the floor)
        {
            int recycled = 0;
            for (int i = 0; i < Count; i++)
            {
                y[i] -= v[i] * dt;
                x[i] += (Mode == WeatherMode.Snow ? Mathf.Sin(phase[i] + y[i] * 0.35f) * 1.2f : WindX) * dt;
                if (y[i] < YBottom) { Respawn(i, false); recycled++; }
            }
            return recycled;
        }

        public Vector3 Pos(int i) { return new Vector3(x[i], y[i], 0f); }
        public float Y(int i) { return y[i]; }
    }

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

        WeatherField field;
        SpriteRenderer sky, tint, band;
        SpriteRenderer[] drops;
        float pollTimer = 999f;      // poll on first Update
        float bandPhase, bandAlpha;
        AmbientTier tier = AmbientTier.Night;
        WeatherMode mode = WeatherMode.None;
        bool alert;

        public AmbientTier CurrentTier { get { return tier; } }
        public WeatherMode CurrentMode { get { return mode; } }
        public bool AlertOn { get { return alert; } }
        public float BandAlpha { get { return bandAlpha; } }

        void Awake() { EnsureVisuals(); }

        void Update()
        {
            pollTimer += Time.deltaTime;
            if (pollTimer >= PollIntervalSec) { pollTimer = 0f; Poll(); }
            StepWeather(Time.deltaTime);
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
            }
            catch (Exception) { /* keep current visuals: probe contract silent degrade */ }
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
            Camera cam = Cam();
            if (cam != null) cam.backgroundColor = p.camBg;
        }

        public void ApplyWeather(string kind, float windMs, int wmoCode)
        {
            if (sky == null) EnsureVisuals();
            mode = WeatherRules.ModeForKind(kind);
            alert = WeatherRules.IsAlert(windMs, wmoCode);
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
            // ambient tint over the CITY band only (painted extent y -16..+14): atmosphere between
            // buildings, sky strips stay pure gradient. Above tilemaps 0..4, below band 9 / pulses 10.
            tint = MakeQuad("AmbientTint", 8, WhiteSprite(), 92f, 30f, -1f);
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
