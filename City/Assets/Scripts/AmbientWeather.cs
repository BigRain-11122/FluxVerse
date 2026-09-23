// FluxVerse P-15 r13 (split r14): ambient cycle pure logic cores (24h four-tier color
// wheel + weather FX rules + recycled drop field simulation).
// CEO order 18:45: the city joins real 24h time and real Shanghai weather (M1 acceptance
// item, TECH P-15 expansion). Data source: world/world-state.json, READ-ONLY poll every
// ~10s (perceptor scan owns all writes; the engine never writes world/ or any sibling repo).
// Flat reality keys consumed: city_day_phase, beijing_hhmm, weather_kind, weather_code,
// weather_wind_ms. Pure 2D only. Tier bounds mirror probes/clock.ps1 exactly (probe =
// single source of truth): dawn 5-8, day 9-16, dusk 17-19, night else. Palettes follow
// DESIGN section 9: dusk = warm purple-gold per art-target-dusk.png; night = deep
// blue-black (city lights carry the electric cyan); pink/purple only ever ambient sky
// tint, never a functional light. Alert rule mirrors probes/weather.ps1 exactly:
// wind >= 17.2 m/s (gale family) or heavy WMO codes 65,67,75,77,82,95,96,99 -> city-wide
// red alert band (functional red, five-color law).
// SEPARATE FILE LAW (r14): the MonoBehaviour adapter CityAmbient now lives in
// CityAmbient.cs (a component class must match its .cs file name or the saved scene
// reference dies across editor sessions); this file keeps ONLY headless-testable cores.
using System;
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

    // scene adapter CityAmbient lives in CityAmbient.cs (SEPARATE FILE LAW, r14)
}
