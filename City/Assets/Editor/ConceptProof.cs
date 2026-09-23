// FluxVerse DevLoop r19: M0 concept renders - dusk-tier + night-tier city concept art from the
// REAL engine skeleton (DESIGN section 13 last open item; style anchor = art-target-dusk.png +
// hi-res cyber pixel canon, DESIGN section 9). Closes M0 with engine-shot evidence instead of a
// separate mockup: the shipped city IS the concept.
// Pass: open CityScene READ-ONLY (no scene save - zero persistence side effects), drive the
// CityAmbient transient visuals to the dusk / night tiers (r13 proven entry points), render two
// 1920x1080 shots to docs/design/m0-city-concept-{dusk,night}.png, then ARTIFACT gates: reload
// the PNG bytes and region-metric the artifact itself (dusk horizon warm gold + purple zenith;
// night deep blue-dominant zenith; anti-blank city-presence floor on both).
// Sentinel: logs/concept.run -> proof -> logs/concept.done (r11/r12 single-shot pattern).
// All comments ASCII. No 3D. Runtime-only visuals never saved into the scene.
using System;
using System.IO;
using UnityEngine;
using UnityEditor;
using UnityEditor.SceneManagement;

namespace FluxVerse
{
    public static class ConceptProof
    {
        static string ProjectRoot { get { return Path.GetDirectoryName(Application.dataPath); } }
        static string RepoRoot { get { return Path.GetDirectoryName(ProjectRoot); } }
        static string SentinelPath { get { return Path.Combine(RepoRoot, "logs", "concept.run"); } }
        static string DonePath { get { return Path.Combine(RepoRoot, "logs", "concept.done"); } }
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
            EditorSceneManager.OpenScene(ScenePath, OpenSceneMode.Single);
            GameObject ambGo = GameObject.Find("CityAmbient");
            Chk(ambGo != null, "CityAmbient missing in CityScene (r13 wiring lost)");
            CityAmbient amb = ambGo.GetComponent<CityAmbient>();
            Chk(amb != null, "CityAmbient component missing (r13 wiring lost)");
            GameObject camGo = GameObject.Find("CityCamera");
            Chk(camGo != null, "CityCamera missing in CityScene");
            Camera cam = camGo.GetComponent<Camera>();
            Chk(cam != null, "CityCamera has no Camera component");
            Chk(System.Math.Abs(cam.orthographicSize - 20f) < 0.01f, "camera not at the L0 Size 20 concept frame");
            amb.EnsureVisuals();   // transient runtime children, never saved

            // ---- tier 1: dusk 18:00 (art-target tier) ----
            amb.ApplyWeather("clear", 0f, 0);   // concept frame = clean city, no weather FX
            amb.ApplyAmbient(AmbientWheel.TierForHour(18));
            amb.StepWeather(0.1f);
            string duskPath = Path.Combine(RepoRoot, "docs", "design", "m0-city-concept-dusk.png");
            Shot(cam, duskPath);
            Chk(new FileInfo(duskPath).Length > 50000, "dusk PNG suspiciously small");

            // ---- tier 2: night 23:00 ----
            amb.ApplyAmbient(AmbientWheel.TierForHour(23));
            amb.StepWeather(0.1f);
            string nightPath = Path.Combine(RepoRoot, "docs", "design", "m0-city-concept-night.png");
            Shot(cam, nightPath);
            Chk(new FileInfo(nightPath).Length > 50000, "night PNG suspiciously small");

            // ---- artifact gates: reload the PNG bytes and metric the ARTIFACT itself ----
            float b, w;
            Texture2D dusk = Load(duskPath);
            Chk(dusk.width == 1920 && dusk.height == 1080, "dusk PNG wrong resolution");
            RegionAvg(dusk, 0, 20, 1920, 120, out b, out w);
            Chk(w > 0.25f, "dusk horizon not warm gold (artifact): " + w.ToString("F3"));
            float duskBotWarm = w;
            RegionAvg(dusk, 0, 960, 1920, 1060, out b, out w);
            Chk(w < -0.05f, "dusk zenith not purple (artifact): " + w.ToString("F3"));
            float duskTopCool = w;
            int duskCity = CountBright(dusk, 100, 300, 1820, 800, 0.30f);
            Chk(duskCity > 200, "dusk city band looks blank: " + duskCity);

            Texture2D night = Load(nightPath);
            Chk(night.width == 1920 && night.height == 1080, "night PNG wrong resolution");
            RegionAvg(night, 0, 960, 1920, 1060, out b, out w);
            Chk(b < 0.12f, "night zenith too bright (artifact): " + b.ToString("F3"));
            Chk(w < -0.02f, "night zenith not blue-dominant (artifact): " + w.ToString("F3"));
            float nightTopBri = b;
            int nightCity = CountBright(night, 100, 300, 1820, 800, 0.30f);
            Chk(nightCity > 200, "night city band looks blank: " + nightCity);

            UnityEngine.Object.DestroyImmediate(dusk);
            UnityEngine.Object.DestroyImmediate(night);

            return "asserts=" + asserts
                + " dusk(bot_warm=" + duskBotWarm.ToString("F2") + ", top_cool=" + duskTopCool.ToString("F2")
                + ", city_px=" + duskCity + ")"
                + " night(top_bri=" + nightTopBri.ToString("F3") + ", city_px=" + nightCity + ")"
                + " scene_saved=false shots=2";
        }

        static Texture2D Load(string path)
        {
            Texture2D tex = new Texture2D(2, 2);
            if (!tex.LoadImage(File.ReadAllBytes(path)))
                throw new InvalidOperationException("PNG reload failed: " + path);
            return tex;
        }

        static void Shot(Camera cam, string absPath)
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
            File.WriteAllBytes(absPath, tex.EncodeToPNG());
            UnityEngine.Object.DestroyImmediate(tex);
        }

        // average brightness + warmth (r-b) over a screen rectangle (stride-sampled; rows are
        // BOTTOM-UP: row 0 = image bottom - same convention as the r12/r13 metric laws)
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

        // count sampled pixels above a brightness threshold (city-presence / anti-blank metric)
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
    }
}
