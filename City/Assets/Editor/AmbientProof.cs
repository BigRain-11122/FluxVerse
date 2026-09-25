// FluxVerse P-15 r13: batch proof harness for the ambient cycle + weather FX (sentinel pattern,
// r11/r12 style). Proves, fail-loud, the M1 acceptance expansion item (CEO order 18:45):
//  1) PURE LOGIC on headless cores: tier bounds (mirror probes/clock.ps1), palette character
//     (dusk warm-gold horizon + purple zenith, night deep blue-black, day untinted), weather
//     rules (kind->mode, gale/heavy-WMO alert = probes/weather.ps1), field recycle simulation.
//  2) FOUR TIER SCREENSHOTS from the real CityScene (hours 6/12/18/23 injected into the pure
//     wheel): region pixel gates per tier + brain-tower day-vs-night tint gate.
//  3) WEATHER PARTICLES rendered on the night tier: rain / snow delta-brightness gates vs the
//     night baseline + alert band (thunder + gale wind) delta-warmth gate at river level.
//  4) CityScene saved with CityAmbient wired - play mode polls world-state.json for real.
// Sentinel: <repo>/logs/ambient.run -> proof -> <repo>/logs/ambient.done (OK/FAIL report).
// Hermetic: no world/ reads; the proof injects probe-shaped values directly (live weather today
// is cloud - particle visuals must still be provable regardless of the current sky).
// All comments ASCII. No 3D. Screenshots: <repo>/docs/design/m1-r13-*.png
using System;
using System.IO;
using UnityEngine;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine.SceneManagement;

namespace FluxVerse
{
    public static class AmbientProof
    {
        static string ProjectRoot { get { return Path.GetDirectoryName(Application.dataPath); } }
        static string RepoRoot { get { return Path.GetDirectoryName(ProjectRoot); } }
        static string SentinelPath { get { return Path.Combine(RepoRoot, "logs", "ambient.run"); } }
        static string DonePath { get { return Path.Combine(RepoRoot, "logs", "ambient.done"); } }
        static string ScenePath { get { return "Assets/Scenes/CityScene.unity"; } }
        static int asserts;

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

        static void Chk(bool ok, string what)
        {
            if (!ok) throw new InvalidOperationException("ASSERT FAIL: " + what);
            asserts++;
        }

        static string Prove()
        {
            // ---- A1. tier bounds (mirror probes/clock.ps1 exactly) ----
            Chk(AmbientWheel.TierForHour(5) == AmbientTier.Dawn, "hour 5 must be dawn");
            Chk(AmbientWheel.TierForHour(8) == AmbientTier.Dawn, "hour 8 must be dawn");
            Chk(AmbientWheel.TierForHour(9) == AmbientTier.Day, "hour 9 must be day");
            Chk(AmbientWheel.TierForHour(16) == AmbientTier.Day, "hour 16 must be day");
            Chk(AmbientWheel.TierForHour(17) == AmbientTier.Dusk, "hour 17 must be dusk");
            Chk(AmbientWheel.TierForHour(19) == AmbientTier.Dusk, "hour 19 must be dusk");
            Chk(AmbientWheel.TierForHour(20) == AmbientTier.Night, "hour 20 must be night");
            Chk(AmbientWheel.TierForHour(23) == AmbientTier.Night, "hour 23 must be night");
            Chk(AmbientWheel.TierForHour(2) == AmbientTier.Night, "hour 2 must be night");
            Chk(AmbientWheel.TierFromName("dusk") == AmbientTier.Dusk, "name dusk must map");
            Chk(AmbientWheel.TierFromName("night") == AmbientTier.Night, "name night must map");

            // ---- A2. palette character (DESIGN section 9) ----
            AmbientPalette dawnP = AmbientWheel.PaletteFor(AmbientTier.Dawn);
            Chk(dawnP.skyBottom.r - dawnP.skyBottom.b > 0.15f, "dawn horizon must be warm");
            Chk(dawnP.skyTop.b - dawnP.skyTop.r > 0.05f, "dawn zenith must be cool blue");
            AmbientPalette dayP = AmbientWheel.PaletteFor(AmbientTier.Day);
            Chk(dayP.tintAlpha == 0f, "day must not tint the city");
            Chk(dayP.skyBottom.b - dayP.skyBottom.r > 0.02f, "day sky must be blue");
            AmbientPalette duskP = AmbientWheel.PaletteFor(AmbientTier.Dusk);
            Chk(duskP.skyBottom.r - duskP.skyBottom.b > 0.3f, "dusk horizon must be warm gold");
            Chk(duskP.skyTop.b - duskP.skyTop.r > 0.05f, "dusk zenith must be purple (ambient only)");
            Chk(duskP.tintAlpha > 0f && duskP.tint.r > duskP.tint.b, "dusk tint must be warm");
            AmbientPalette nightP = AmbientWheel.PaletteFor(AmbientTier.Night);
            Chk((nightP.skyTop.r + nightP.skyTop.g + nightP.skyTop.b) / 3f < 0.06f, "night sky deep");
            Chk(nightP.skyTop.b > nightP.skyTop.r, "night sky blue-dominant");
            Chk(nightP.tintAlpha >= 0.3f, "night must tint the city");
            Chk(nightP.tint.b > nightP.tint.r, "night tint blue-black");

            // ---- A3. weather rules (mirror probes/weather.ps1 exactly) ----
            Chk(WeatherRules.ModeForKind("rain") == WeatherMode.Rain, "rain kind -> rain");
            Chk(WeatherRules.ModeForKind("thunder") == WeatherMode.Rain, "thunder kind -> rain");
            Chk(WeatherRules.ModeForKind("snow") == WeatherMode.Snow, "snow kind -> snow");
            Chk(WeatherRules.ModeForKind("clear") == WeatherMode.None, "clear kind -> none");
            Chk(WeatherRules.ModeForKind("cloud") == WeatherMode.None, "cloud kind -> none");
            Chk(WeatherRules.ModeForKind("fog") == WeatherMode.None, "fog kind -> none");
            Chk(WeatherRules.IsAlert(17.2f, 0), "gale threshold 17.2 must alert");
            Chk(WeatherRules.IsAlert(25f, 3), "gale wind over cloud must alert");
            Chk(!WeatherRules.IsAlert(7.4f, 3), "today's real weather must NOT alert");
            Chk(WeatherRules.IsAlert(5f, 95), "WMO 95 must alert");
            Chk(WeatherRules.IsAlert(5f, 65), "WMO 65 must alert");
            Chk(!WeatherRules.IsAlert(5f, 64), "WMO 64 must not alert");
            Chk(!WeatherRules.IsAlert(5f, 98), "WMO 98 must not alert");

            // ---- A4. field recycle simulation (headless) ----
            WeatherField f = new WeatherField(140, 7);
            f.Configure(WeatherMode.Rain, 6f);
            int rec = 0;
            for (int i = 0; i < 300; i++) rec += f.Step(0.05f);
            Chk(rec > 0, "rain field must recycle");
            for (int i = 0; i < f.Count; i++) Chk(f.Y(i) >= WeatherField.YBottom, "rain drop below floor");
            f.Configure(WeatherMode.Snow, 2f);
            rec = 0;
            for (int i = 0; i < 3000; i++) rec += f.Step(0.05f);
            Chk(rec > 0, "snow field must recycle");

            // ---- B. real scene: wire the persistent component, save BEFORE any transient visual ----
            Scene scene = EditorSceneManager.OpenScene(ScenePath, OpenSceneMode.Single);
            GameObject ambGo = GameObject.Find("CityAmbient");
            CityAmbient amb = ambGo != null ? ambGo.GetComponent<CityAmbient>() : null;
            if (amb == null)
            {
                ambGo = new GameObject("CityAmbient");
                amb = ambGo.AddComponent<CityAmbient>();
            }
            bool saved = EditorSceneManager.SaveScene(scene);   // persist wiring only
            Chk(saved, "scene save failed");
            GameObject camGo = GameObject.Find("CityCamera");
            Chk(camGo != null, "CityCamera missing in CityScene");
            Camera cam = camGo.GetComponent<Camera>();
            Chk(cam != null, "CityCamera has no Camera component");
            amb.EnsureVisuals();   // transient runtime children (never saved)

            // ---- C. four-tier color wheel: injected hours, region pixel gates ----
            // NOTE: ReadPixels/GetPixel texture rows are BOTTOM-UP (row 0 = bottom of image;
            // PNG export flips for display). World y at row R = (R/1080 - 0.5) * 40.
            // So "horizon (bottom sky)" = rows 20..120. "Zenith (top sky)" = rows 1054..1079:
            // r51 baseline recalibration - the r13 window (rows 960..1060) went stale at r34
            // when the parallax silhouettes (SkylineRules, content top y +19 = row 1053)
            // legally grew into it: their dusk fog-multiply reads warm rose and diluted the
            // purple average to -0.019 (HEAD-verified identical before and after the r51
            // pilot tint fix - a pre-existing stale baseline, not a pilot regression). The
            // zenith gates prove the SKY GRADIENT, so the window now sits above the
            // silhouette content top in pure sky (the skyline keeps its own fog gates in
            // SkylineProof). The law-tie below fails loud if the spires ever grow taller.
            float zenY0 = (1054 / 1080f - 0.5f) * 40f;
            Chk(zenY0 > SkylineRules.FarContentTopY,
                "zenith window must clear the silhouette content top");
            Texture2D dawnShot, dayShot, duskShot, nightShot;
            float b, w;
            amb.ApplyAmbient(AmbientWheel.TierForHour(6));   // dawn 06:00
            amb.StepWeather(0.1f);
            dawnShot = Shot(cam, "m1-r13-dawn.png");
            RegionAvg(dawnShot, 0, 20, 1920, 120, out b, out w);
            Chk(w > 0.10f, "dawn horizon not warm enough on screen: " + w.ToString("F3"));
            float dawnBotWarm = w;
            RegionAvg(dawnShot, 0, 1054, 1920, 1079, out b, out w);
            Chk(w < -0.05f, "dawn zenith not cool on screen: " + w.ToString("F3"));

            amb.ApplyAmbient(AmbientWheel.TierForHour(12));   // day 12:00
            amb.StepWeather(0.1f);
            dayShot = Shot(cam, "m1-r13-day.png");
            RegionAvg(dayShot, 0, 1054, 1920, 1079, out b, out w);
            Chk(b > 0.50f, "day sky too dark on screen: " + b.ToString("F3"));
            Chk(w < -0.05f, "day sky not blue on screen: " + w.ToString("F3"));

            amb.ApplyAmbient(AmbientWheel.TierForHour(18));   // dusk 18:00 (art-target tier)
            amb.StepWeather(0.1f);
            duskShot = Shot(cam, "m1-r13-dusk.png");
            RegionAvg(duskShot, 0, 20, 1920, 120, out b, out w);
            Chk(w > 0.25f, "dusk horizon not warm gold on screen: " + w.ToString("F3"));
            float duskBotWarm = w;
            RegionAvg(duskShot, 0, 1054, 1920, 1079, out b, out w);
            Chk(w < -0.05f, "dusk zenith not purple on screen: " + w.ToString("F3"));

            amb.ApplyAmbient(AmbientWheel.TierForHour(23));   // night 23:00
            amb.StepWeather(0.1f);
            nightShot = Shot(cam, "m1-r13-night.png");
            RegionAvg(nightShot, 0, 1054, 1920, 1079, out b, out w);
            Chk(b < 0.12f, "night sky too bright on screen: " + b.ToString("F3"));
            Chk(w < -0.02f, "night sky not blue-dominant: " + w.ToString("F3"));

            // tint gate: the near-white brain tower must visibly darken at night vs day
            float dayTowerBri, dayTowerWarm, nightTowerBri, nightTowerWarm;
            BoxMetrics(dayShot, cam, 0f, 11.5f, out dayTowerBri, out dayTowerWarm);
            BoxMetrics(nightShot, cam, 0f, 11.5f, out nightTowerBri, out nightTowerWarm);
            Chk(nightTowerBri < dayTowerBri - 0.05f, "night tint did not darken the city: d="
                + (dayTowerBri - nightTowerBri).ToString("F3"));

            // ---- C2. r51 pilot gates (TECH sec.9 r22 debt: paving-vs-tint 1u offset) ----
            // (a) GEOMETRY: the tint quad must cover the painted band exactly - bottom -16,
            //     top +15 (the builder paves to +15; a 30u quad topping at +14 left the top
            //     paved row untinted = the night far-shore bright strip).
            SpriteRenderer tintR = GameObject.Find("AmbientTint").GetComponent<SpriteRenderer>();
            Bounds tb = tintR.bounds;
            Chk(tb.min.y <= -15.9f, "tint must cover the band bottom -16, got " + tb.min.y.ToString("F2"));
            Chk(Mathf.Abs(tb.max.y - 15f) <= 0.05f,
                "tint top must sit at the painted +15, got " + tb.max.y.ToString("F2"));
            // (b) RENDER: the far-shore strip window (rows 925..938 = world y 14.26..14.74,
            //     x 300..1600 = well inside the painted map, no sky/edge leak) must darken
            //     at night vs day by the tint amount - untinted it stayed day-bright (the
            //     r22 proof failure: 1421 bright samples in a supposedly quiet night band).
            float dayStripB, dayStripW, nightStripB, nightStripW;
            RegionAvg(dayShot, 300, 925, 1600, 938, out dayStripB, out dayStripW);
            RegionAvg(nightShot, 300, 925, 1600, 938, out nightStripB, out nightStripW);
            Chk(dayStripB - nightStripB >= 0.05f,
                "night far-shore strip not tinted (r51 pilot): d=" + (dayStripB - nightStripB).ToString("F3"));

            // ---- D. weather particles + alert band, all on the night tier (best contrast) ----
            int nightBase = CountBright(nightShot, 100, 300, 1820, 800, 0.30f);
            amb.ApplyWeather("rain", 6f, 61);
            Chk(amb.CurrentMode == WeatherMode.Rain && !amb.AlertOn, "rain apply state wrong");
            for (int i = 0; i < 20; i++) amb.StepWeather(0.5f);
            Texture2D rainShot = Shot(cam, "m1-r13-rain.png");
            int rainN = CountBright(rainShot, 100, 300, 1820, 800, 0.30f);
            Chk(rainN - nightBase > 80, "rain particles not visible: d=" + (rainN - nightBase));

            amb.ApplyWeather("snow", 2f, 71);
            Chk(amb.CurrentMode == WeatherMode.Snow, "snow apply state wrong");
            for (int i = 0; i < 20; i++) amb.StepWeather(0.5f);
            Texture2D snowShot = Shot(cam, "m1-r13-snow.png");
            int snowN = CountBright(snowShot, 100, 300, 1820, 800, 0.30f);
            Chk(snowN - nightBase > 80, "snow particles not visible: d=" + (snowN - nightBase));

            amb.ApplyWeather("thunder", 25f, 95);   // typhoon-family: rain + city alert band
            Chk(amb.CurrentMode == WeatherMode.Rain && amb.AlertOn, "alert apply state wrong");
            for (int i = 0; i < 20; i++) amb.StepWeather(0.5f);
            Chk(amb.BandAlpha > 0.08f, "alert band alpha too low: " + amb.BandAlpha.ToString("F3"));
            Texture2D alertShot = Shot(cam, "m1-r13-alert.png");
            float baseWarm, alertWarm, bb, bw;
            RegionAvg(nightShot, 0, 510, 1920, 570, out bb, out baseWarm);
            RegionAvg(alertShot, 0, 510, 1920, 570, out bw, out alertWarm);
            Chk(alertWarm - baseWarm > 0.04f, "alert band not red-visible: d=" + (alertWarm - baseWarm).ToString("F3"));
            int alertN = CountBright(alertShot, 100, 300, 1820, 800, 0.30f);
            Chk(alertN - nightBase > 80, "storm rain enhancement not visible: d=" + (alertN - nightBase));

            // ---- E. r156 D1: tier-flip palette blend (the hard-cut "feel" defect) ----
            // Pure-core golden gates (headless), then the adapter on the live scene:
            // mid-blend values must be exact palette lerps, the rendered zenith must
            // sit strictly BETWEEN the settled anchors, and the settle must swap back
            // to the cached tier sprite (content-identical by construction = no pop).
            Chk(AmbientBlend.BlendSeconds >= 2f && AmbientBlend.BlendSeconds <= 4f,
                "blend duration must sit in the 2-4s spec band (r153 D1)");
            Chk(Mathf.Abs(RigMath.EaseInOut(0.5f) - 0.5f) < 1e-4f,
                "r14 easing midpoint must be exactly 0.5 (zero-end-velocity smoothstep)");
            AmbientPalette d1NightP = AmbientWheel.PaletteFor(AmbientTier.Night);
            AmbientPalette d1DuskP = AmbientWheel.PaletteFor(AmbientTier.Dusk);
            AmbientBlend d1Core = new AmbientBlend();
            d1Core.Begin(d1DuskP, d1NightP, AmbientBlend.BlendSeconds);
            AmbientPalette d1Mid = d1Core.Advance(AmbientBlend.BlendSeconds * 0.5f);
            Chk(d1Core.Active, "half-way pump must leave the core blend active");
            Chk(ColorNear(d1Mid.tint, Color.Lerp(d1DuskP.tint, d1NightP.tint, 0.5f), 1e-3f), "core mid tint must be the palette lerp");
            Chk(Mathf.Abs(d1Mid.tintAlpha - (d1DuskP.tintAlpha + d1NightP.tintAlpha) * 0.5f) < 1e-3f, "core mid tintAlpha must be the lerp midpoint");
            Chk(ColorNear(d1Mid.skyTop, Color.Lerp(d1DuskP.skyTop, d1NightP.skyTop, 0.5f), 1e-3f), "core mid skyTop must be the palette lerp");
            Chk(ColorNear(d1Mid.skyBottom, Color.Lerp(d1DuskP.skyBottom, d1NightP.skyBottom, 0.5f), 1e-3f), "core mid skyBottom must be the palette lerp");
            Chk(ColorNear(d1Mid.camBg, Color.Lerp(d1DuskP.camBg, d1NightP.camBg, 0.5f), 1e-3f), "core mid camBg must be the palette lerp");
            // monotonic law: dusk -> night DARKENS the zenith, strictly, until the snap
            d1Core.Begin(d1DuskP, d1NightP, AmbientBlend.BlendSeconds);
            float d1Prev = (d1DuskP.skyTop.r + d1DuskP.skyTop.g + d1DuskP.skyTop.b) / 3f;
            bool d1Mono = true;
            for (int i = 0; i < 10; i++)
            {
                AmbientPalette sp = d1Core.Advance(0.25f);
                float bri = (sp.skyTop.r + sp.skyTop.g + sp.skyTop.b) / 3f;
                if (bri > d1Prev + 1e-5f) d1Mono = false;
                d1Prev = bri;
            }
            Chk(d1Mono, "blend samples must be monotonically darkening dusk->night");
            Chk(!d1Core.Active, "10 x 0.25s pumps must complete the 2.5s blend");
            Chk(ColorNear(d1Core.Advance(0f).skyTop, d1NightP.skyTop, 1e-5f), "completed blend must snap to the target palette");

            // adapter gates on the live scene
            amb.ApplyWeather("clear", 5f, 3);
            for (int i = 0; i < 10; i++) amb.StepWeather(0.5f);   // decay the alert band
            Chk(amb.BandAlpha < 0.01f, "alert band must decay before the D1 gates");
            amb.ApplyAmbient(AmbientTier.Night);
            amb.StepWeather(0.1f);
            Texture2D d1NightAnchor = ShotMem(cam);
            float d1NightZen, d1W1; RegionAvg(d1NightAnchor, 0, 1054, 1920, 1079, out d1NightZen, out d1W1);
            amb.ApplyAmbient(AmbientTier.Dusk);
            amb.StepWeather(0.1f);
            Texture2D d1DuskAnchor = ShotMem(cam);
            float d1DuskZen, d1W2; RegionAvg(d1DuskAnchor, 0, 1054, 1920, 1079, out d1DuskZen, out d1W2);
            Chk(d1DuskZen > d1NightZen + 0.10f,
                "D1 anchors must be far apart for the between-ness gate: d=" + (d1DuskZen - d1NightZen).ToString("F3"));
            SpriteRenderer d1Tint = GameObject.Find("AmbientTint").GetComponent<SpriteRenderer>();
            amb.TransitionAmbient(AmbientTier.Night);
            Chk(amb.BlendActive, "dusk->night flip must start an eased blend");
            amb.StepAmbient(AmbientBlend.BlendSeconds * 0.5f);
            Chk(amb.BlendActive, "half-way StepAmbient pump must keep the blend active");
            Color d1ExpTint = Color.Lerp(d1DuskP.tint, d1NightP.tint, 0.5f);
            float d1ExpA = (d1DuskP.tintAlpha + d1NightP.tintAlpha) * 0.5f;
            Chk(ColorNear(d1Tint.color, new Color(d1ExpTint.r, d1ExpTint.g, d1ExpTint.b, d1ExpA), 2e-3f),
                "mid-blend tint quad must be the palette lerp: " + d1Tint.color.ToString("F3"));
            Chk(ColorNear(cam.backgroundColor, Color.Lerp(d1DuskP.camBg, d1NightP.camBg, 0.5f), 2e-3f),
                "mid-blend camBg must be the palette lerp");
            Texture2D d1MidShot = Shot(cam, "m1-r156-d1-transition.png");   // evidence: the cross-fade frame
            float d1MidZen, d1W3; RegionAvg(d1MidShot, 0, 1054, 1920, 1079, out d1MidZen, out d1W3);
            float d1Span = d1DuskZen - d1NightZen;
            Chk(d1MidZen > d1NightZen + 0.25f * d1Span && d1MidZen < d1DuskZen - 0.25f * d1Span,
                "mid-blend zenith must sit strictly between the anchors: n=" + d1NightZen.ToString("F3")
                + " m=" + d1MidZen.ToString("F3") + " d=" + d1DuskZen.ToString("F3"));
            int d1Guard = 0;
            while (amb.BlendActive && d1Guard++ < 20) amb.StepAmbient(1f);
            Chk(!amb.BlendActive, "blend must settle inside the guard pumps");
            Chk(amb.CurrentSkySprite == CityAmbient.CachedSkyFor(AmbientTier.Night),
                "settle must swap back to the cached tier sprite (content-identical, zero pop)");
            Chk(ColorNear(d1Tint.color, new Color(d1NightP.tint.r, d1NightP.tint.g, d1NightP.tint.b, d1NightP.tintAlpha), 1e-4f),
                "settled blend state must equal the instant-apply state (parity law)");
            // re-flip mid-flight: the new blend must start from the CURRENT mid palette
            amb.TransitionAmbient(AmbientTier.Dusk);
            Chk(amb.BlendActive, "night->dusk must start a blend");
            amb.StepAmbient(0.6f);
            amb.TransitionAmbient(AmbientTier.Night);
            Chk(amb.BlendActive, "mid-blend re-flip must restart from the current palette");
            d1Guard = 0;
            while (amb.BlendActive && d1Guard++ < 20) amb.StepAmbient(1f);
            Chk(ColorNear(d1Tint.color, new Color(d1NightP.tint.r, d1NightP.tint.g, d1NightP.tint.b, d1NightP.tintAlpha), 1e-4f),
                "re-flipped blend must settle at the night palette");
            amb.TransitionAmbient(AmbientTier.Night);   // settled at night: near-equal path
            Chk(!amb.BlendActive, "same-tier transition must be a no-op settle");
            amb.ApplyAmbient(AmbientTier.Dusk);          // instant primitive must stay instant
            Chk(!amb.BlendActive, "ApplyAmbient must never start a blend");
            Chk(ColorNear(d1Tint.color, new Color(d1DuskP.tint.r, d1DuskP.tint.g, d1DuskP.tint.b, d1DuskP.tintAlpha), 1e-4f),
                "ApplyAmbient must apply the target palette immediately");
            amb.ApplyAmbient(AmbientTier.Night);        // canonical close: settled night

            // cleanup in-memory evidence textures
            UnityEngine.Object.DestroyImmediate(dawnShot);
            UnityEngine.Object.DestroyImmediate(dayShot);
            UnityEngine.Object.DestroyImmediate(duskShot);
            UnityEngine.Object.DestroyImmediate(nightShot);
            UnityEngine.Object.DestroyImmediate(rainShot);
            UnityEngine.Object.DestroyImmediate(snowShot);
            UnityEngine.Object.DestroyImmediate(alertShot);
            UnityEngine.Object.DestroyImmediate(d1NightAnchor);
            UnityEngine.Object.DestroyImmediate(d1DuskAnchor);
            UnityEngine.Object.DestroyImmediate(d1MidShot);

            return "asserts=" + asserts
                + " tiers(dawn_bot_warm=" + dawnBotWarm.ToString("F2")
                + ", dusk_bot_warm=" + duskBotWarm.ToString("F2") + ")"
                + " tower(day_bri=" + dayTowerBri.ToString("F3") + ", night_bri=" + nightTowerBri.ToString("F3") + ")"
                + " farshore(tint_top=" + tb.max.y.ToString("F2") + ", day_bri=" + dayStripB.ToString("F3")
                + ", night_bri=" + nightStripB.ToString("F3") + ")"
                + " weather(base=" + nightBase + ", rain+" + (rainN - nightBase)
                + ", snow+" + (snowN - nightBase) + ", alert_rain+" + (alertN - nightBase)
                + ", band_alpha=" + amb.BandAlpha.ToString("F3")
                + ", band_warm_d=" + (alertWarm - baseWarm).ToString("F3") + ")"
                + " d1(blend_s=" + AmbientBlend.BlendSeconds.ToString("F1")
                + ", zen_n=" + d1NightZen.ToString("F3") + ", zen_m=" + d1MidZen.ToString("F3")
                + ", zen_d=" + d1DuskZen.ToString("F3") + ", settle=cache-swap)"
                + " scene_saved=" + saved + " shots=8";
        }

        static Texture2D Shot(Camera cam, string name)
        {
            Texture2D tex = ShotMem(cam);
            File.WriteAllBytes(Path.Combine(RepoRoot, "docs", "design", name), tex.EncodeToPNG());
            return tex;
        }

        // r156 D1: render WITHOUT writing a file (in-memory anchors for the between-ness gate)
        static Texture2D ShotMem(Camera cam)
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
            return tex;
        }

        // r156 D1: per-channel tolerance compare (blend golden values)
        static bool ColorNear(Color a, Color b, float e)
        {
            return Mathf.Abs(a.r - b.r) <= e && Mathf.Abs(a.g - b.g) <= e
                && Mathf.Abs(a.b - b.b) <= e && Mathf.Abs(a.a - b.a) <= e;
        }

        // average brightness + warmth (r-b) over a screen rectangle (stride-sampled)
        static void RegionAvg(Texture2D tex, int x0, int y0, int x1, int y1, out float brightness, out float warmth)
        {
            double sumBri = 0, sumWarm = 0; int n = 0;
            for (int y = y0; y < y1; y += 4)
                for (int x = x0; x < x1; x += 4)
                {
                    Color c = tex.GetPixel(x, y);
                    sumBri += (c.r + c.g + c.b) / 3.0; sumWarm += c.r - c.b; n++;
                }
            int nn = System.Math.Max(1, n);
            brightness = (float)(sumBri / nn);
            warmth = (float)(sumWarm / nn);
        }

        // count sampled pixels above a brightness threshold (particle visibility metric)
        static int CountBright(Texture2D tex, int x0, int y0, int x1, int y1, float thr)
        {
            int n = 0;
            for (int y = y0; y < y1; y += 2)
                for (int x = x0; x < x1; x += 2)
                {
                    Color c = tex.GetPixel(x, y);
                    if ((c.r + c.g + c.b) / 3f > thr) n++;
                }
            return n;
        }

        // average luminance + warmth (r-b) in a 40px-radius box around a world position (ortho)
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
