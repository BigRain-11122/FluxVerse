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

    // r156 (P-20260925-09 D1): tier-flip palette blend core. The wheel's hard cut was the
    // "feel" defect (r153 finding: ApplyAmbient -> PaletteFor = instant switch, zero lerp).
    // The PLAY path (CityAmbient.TransitionAmbient) eases the five-value family
    // (skyTop / skyBottom / tint rgb / tintAlpha / camBg) over BlendSeconds with the r14
    // zero-end-velocity smoothstep; ApplyAmbient stays the instant settle primitive (boot
    // build + the 53 proof call sites + tier-gated families). One Advance core serves
    // play (Update) and proof (StepAmbient pumps) - the CameraRig law.
    public class AmbientBlend
    {
        public const float BlendSeconds = 2.5f;   // spec band 2-4s (r153 D1)

        AmbientPalette from, to;
        float elapsed, seconds = BlendSeconds;

        public bool Active { get; private set; }

        public void Begin(AmbientPalette f, AmbientPalette t, float dur)
        {
            from = f; to = t; elapsed = 0f;
            seconds = Mathf.Max(0.0001f, dur);
            Active = true;
        }

        public void End() { Active = false; }

        // one step; returns the blended palette, snapping to the target at completion
        public AmbientPalette Advance(float dt)
        {
            if (!Active) return to;
            elapsed += dt;
            float k = Mathf.Clamp01(elapsed / seconds);
            if (k >= 1f) { Active = false; return to; }
            float s = RigMath.EaseInOut(k);   // r14 easing: zero velocity at both ends
            AmbientPalette p = new AmbientPalette();
            p.skyTop = Color.Lerp(from.skyTop, to.skyTop, s);
            p.skyBottom = Color.Lerp(from.skyBottom, to.skyBottom, s);
            p.tint = Color.Lerp(from.tint, to.tint, s);
            p.tintAlpha = Mathf.Lerp(from.tintAlpha, to.tintAlpha, s);
            p.camBg = Color.Lerp(from.camBg, to.camBg, s);
            return p;
        }

        public float Progress01 { get { return Mathf.Clamp01(elapsed / seconds); } }
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

    // P-28 item 2 (r34): parallax skyline pure rules. Source pack = parallax-skyline
    // (OGA-BY 3.0, ledger in City/Assets/ArtPacks/ARTPACKS-LEDGER.md). The r29 style
    // gate passed the pack conditionally with five laws, all enforced here:
    //   1 point filter + INTEGER scale only (x2 at PPU 16 -> texel 0.125u),
    //   2 fog desaturation tint into the anchor pink-purple fog band (per tier),
    //   3 only the 2 farthest pale silhouette layers (near-black layers rejected),
    //   4 no seamless-loop claim -> the single quad is never tiled/repeated, so its
    //     width must cover every camera position (Covers gate below),
    //   5 five-color law untouched: silhouettes are AMBIENT scenery (pink/purple
    //     is a legal ambient sky color per DESIGN section 9, never a functional light).
    // Pink/purple stays ambient-only; geometry mirrors the measured pack content rows
    // (r33 survey + r34 PS re-measure: layer-2 rows 61..234, layer-3 rows 79..323).
    public static class SkylineRules
    {
        public const float FollowFactor = 0.9f;          // parallax: tracks 0.9 x camera
        public const int FarOrder = -9, NearOrder = -8;  // between AmbientSky -10 and tilemaps 0..4
        public const float Scale = 2f;                    // law 1: integer multiple only
        public const float PPU = 16f;
        public const float Texel = Scale / PPU;           // 0.125u per source texel
        public const float SourceW = 576f, SourceH = 324f;
        public const int FarTopRow = 61, FarBotRow = 234;      // layer-2 measured content rows
        public const int NearTopRow = 79, NearBotRow = 323;    // layer-3 measured content rows
        public const float FarContentTopY = 19f;         // far spires peek 4u above the +15 roofline
        public const float NearContentTopY = 17.5f;      // near skyline plateaus lower (depth stack)
        public const float RoofY = 15f;                 // painted band top edge (r22 survey)

        // quad center Y so the content (first opaque row) lands exactly at contentTopY
        public static float QuadCenterY(int topRow, float contentTopY)
        {
            float quadTop = contentTopY + topRow * Texel;
            return quadTop - (SourceH * Texel) * 0.5f;
        }

        // law 4 gate: non-looping quad must span the view at every camera position
        public static bool Covers(float camX, float halfView)
        {
            float half = SourceW * Texel * 0.5f;   // 36u
            float cx = camX * FollowFactor;
            return (cx - half) <= (camX - halfView) && (camX + halfView) <= (cx + half);
        }

        // law 2: per-tier fog multiplier on the pack's native rose (240,147,161)/255.
        // Multiplication compresses the r-g spread (desaturation) and can only darken,
        // which is exactly "recede into fog". r208 (T-FV-122 S4, batch-2 order item 4
        // "far buildings lean blue, more fog"): dusk re-authors the mauve band into a
        // BLUE-PURPLE HAZE - the product on the rose base goes b-r +0.11 (the blue lean
        // of the order word) and the r-g spread compresses to ~0.44x native (was
        // ~0.69x = the "more fog" half). Single source law: LightFxRules.FogWashColor()
        // rides this same constant (r181), re-pinned in lightfx-manifest v0.4.
        public static Color FogFar(AmbientTier t)
        {
            switch (t)
            {
                case AmbientTier.Dawn: return new Color(0.86f, 0.72f, 0.80f);  // dusty rose haze
                case AmbientTier.Day:  return new Color(0.85f, 0.88f, 0.98f);  // pale cool haze
                case AmbientTier.Dusk: return new Color(0.50f, 0.54f, 0.92f);  // r208 blue-purple haze band
                default:               return new Color(0.10f, 0.10f, 0.18f);  // dark blue mass
            }
        }

        // near layer = slightly heavier fog-darkening (nearer silhouette reads as the
        // denser mass; classic depth cue for dark aerial perspective)
        public static Color FogNear(AmbientTier t) { return FogFar(t) * 0.85f; }
    }

    // r206 (T-FV-122 S2b, batch-2 order 09-26 ~15:20 item 1): the tint band
    // splits into THREE blocks. The r13 single quad covered -16..+15 with one
    // alpha; in LINEAR color space (r205 forensics: ProjectSettings
    // m_ActiveColorSpace=1) the warm dusk tint (1,0.62,0.42 @ a0.22) over the
    // dark blue-purple water reads ROSE (measured hue 319 vs the order door
    // [220,280] - the "pink-brick texture" critique root). The batch-2 order
    // text ("water semi-transparent blue-purple") is the later CEO word and
    // overturns the r13 coverage domain (r202 sec.6a compliant-change family).
    // LAW: the RIVER block mirrors the water world rect EXACTLY (WaterFxRules
    // cells x -50..50 rows -3..2) and carries alpha ONLY AT NIGHT (the night
    // tint is blue-family: water stays in-door, r205 measured 233/67; dusk and
    // dawn read the authored blue-purple, r205 probe preview 239/92). The two
    // CITY blocks keep the four-tier wheel law untouched (r51 pilot bottom
    // -16 / painted top +15, 92u family width). Seams are flush by constant:
    // S top == river bottom == -3, river top == N bottom == +3.
    public static class TintBandRules
    {
        public const string NameS = "AmbientTintS", NameN = "AmbientTintN", NameRiver = "AmbientTintRiver";
        public const int Order = 8;                 // the legacy tint family slot (above street 7, below band 9)

        // south city block (paved band below the water)
        public const float CityW = 92f;              // legacy family width: x -46..+46 (L1 |camX|<=30 law consumer)
        public const float Sy0 = -16f, Sy1 = -3f;    // r51 pilot bottom law / flush with the water south edge
        public const float SyH = Sy1 - Sy0;          // 13
        public const float SyCy = (Sy0 + Sy1) * 0.5f;

        // north city block (painted band up to the r51 +15 top)
        public const float Ny0 = 3f, Ny1 = 15f;
        public const float NyH = Ny1 - Ny0;          // 12
        public const float NyCy = (Ny0 + Ny1) * 0.5f;

        // river block = the water world rect exactly (single source = WaterFxRules)
        public const float Rx0 = WaterFxRules.CellX0;                // -50
        public const float Rx1 = WaterFxRules.CellX1 + 1f;           // +51 (cells x -50..50)
        public const float Ry0 = WaterFxRules.RowY0;                 // -3
        public const float Ry1 = WaterFxRules.RowY1 + 1f;             // +3 (rows -3..2)
        public const float RiverW = Rx1 - Rx0;                        // 101
        public const float RiverH = Ry1 - Ry0;                        // 6
        public const float RiverCx = (Rx0 + Rx1) * 0.5f;              // +0.5 (MakeQuad centers at x0)
        public const float RiverCy = (Ry0 + Ry1) * 0.5f;              // 0

        // the S2b river alpha law: night carries the wheel alpha, dusk/dawn/day exempt
        public static float RiverAlphaFor(AmbientTier t)
        {
            return t == AmbientTier.Night ? AmbientWheel.PaletteFor(t).tintAlpha : 0f;
        }
    }

    // scene adapter CityAmbient lives in CityAmbient.cs (SEPARATE FILE LAW, r14)
}
