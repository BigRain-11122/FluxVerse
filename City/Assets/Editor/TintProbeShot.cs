// FluxVerse r205 (T-FV-122 S2 acceptance forensics): TintProbeShot - the
// dusk-water attribution probe. The r204 census3 blue-purple door measured
// the coherent dusk hero water band at hue 319 / lum 124.5 (door [220,280] /
// [25,110]) while day/night read 245/233 in-band; the row profile shows the
// warm shift is uniform over the band and the per-channel day->dusk transfer
// fit (R slope 0.487) proves an extra alpha-flattening warm composite rides
// the authored AmbientTint (1,0.62,0.42 @ a0.22). Static code enumeration
// exonerated every named family (lightfx geometry disjoint / waterfx 12-mount
// table white / scene has zero orphan quads / tile assets white / pulses
// transient), so this probe renders the attribution EMPIRICALLY in ONE
// editor session, four shots, scene NEVER saved:
//   shot1 dusk full            - the baseline repro (tint on, water a0.92)
//   shot2 dusk tint-off        - AmbientTint a=0 (tint contribution alone)
//   shot3 dusk water-reveal    - water tilemap a=0.15 (under-layer + tint)
//   shot4 dusk water-reveal no-tint - the pure under-layer photo
// Also logs the ACTUAL runtime colors (tint quad + water tilemap renderer)
// to the done report - verifying a0.22 / a0.92 against the code constants.
// Mirrors AlbumShot's coherent ApplyScene (same public calls, r161 law).
// ASCII. No 3D. Read-only on disk: outputs go to logs/ (diagnostics, not
// acceptance evidence).
using System;
using System.IO;
using UnityEngine;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine.SceneManagement;
using UnityEngine.Tilemaps;

namespace FluxVerse
{
    public static class TintProbeShot
    {
        static string ProjectRoot { get { return Path.GetDirectoryName(Application.dataPath); } }
        static string RepoRoot { get { return Path.GetDirectoryName(ProjectRoot); } }
        static string RunPath { get { return Path.Combine(RepoRoot, "logs", "tintprobe.run"); } }
        static string DonePath { get { return Path.Combine(RepoRoot, "logs", "tintprobe.done"); } }
        static string ScenePath { get { return "Assets/Scenes/CityScene.unity"; } }

        [InitializeOnLoadMethod]
        static void Hook()
        {
            if (File.Exists(RunPath)) EditorApplication.delayCall += Run;
        }

        public static void BatchRun() { Run(); }

        static void Run()
        {
            if (!File.Exists(RunPath)) return;   // single-shot guard
            try
            {
                string report = Prove();
                File.WriteAllText(DonePath, "OK " + report + " ts=" + DateTime.UtcNow.ToString("o"));
            }
            catch (Exception e)
            {
                File.WriteAllText(DonePath, "FAIL " + e.GetType().Name + ": " + e.Message + " | "
                    + e.StackTrace + " ts=" + DateTime.UtcNow.ToString("o"));
            }
            finally { if (File.Exists(RunPath)) File.Delete(RunPath); }
        }

        static string Prove()
        {
            Scene scene = EditorSceneManager.OpenScene(ScenePath, OpenSceneMode.Single);
            if (!scene.isLoaded) throw new InvalidOperationException("CityScene failed to load");

            GameObject ambGo = GameObject.Find("CityAmbient");
            if (ambGo == null) throw new InvalidOperationException("CityAmbient GO missing");
            CityAmbient amb = ambGo.GetComponent<CityAmbient>();

            GameObject waterGo = GameObject.Find("CityWaterFx");
            if (waterGo == null) throw new InvalidOperationException("CityWaterFx GO missing");
            CityWaterFx water = waterGo.GetComponent<CityWaterFx>();

            GameObject lightGo = GameObject.Find("CityLightFx");
            if (lightGo == null) throw new InvalidOperationException("CityLightFx GO missing");
            CityLightFx light = lightGo.GetComponent<CityLightFx>();

            GameObject wlGo = GameObject.Find(CityWindowLight.GoName);
            if (wlGo == null) throw new InvalidOperationException("CityWindowLight GO missing");
            CityWindowLight wl = wlGo.GetComponent<CityWindowLight>();

            GameObject camGo = GameObject.Find("CityCamera");
            Camera cam = camGo != null ? camGo.GetComponent<Camera>() : null;
            if (cam == null || !cam.orthographic) throw new InvalidOperationException("CityCamera missing");
            Vector3 origPos = cam.transform.position;
            float origSize = cam.orthographicSize;

            // coherent dusk apply (AlbumShot.ApplyScene mirror, r161 law)
            const int WaveTick = 2;
            amb.ApplyAmbient(AmbientTier.Dusk);
            water.EnsureRefs();
            water.ApplyTier(AmbientTier.Dusk);
            water.ApplyTick(WaveTick);
            water.RestoreWobble();
            light.ApplyState(AmbientTier.Dusk, 0);
            wl.Poll();
            CityLabsTemporal tmp = CityLabsTemporal.EnsureRoot();
            tmp.Poll();

            // the actual runtime colors (verify against WaterFxRules/AmbientWheel).
            // r206 S2b: the tint band is THREE blocks (TintBandRules) - the dusk
            // river alpha is 0 BY LAW now, so this probe's tint-off shot isolates
            // the CITY blocks' contribution; the river block color is logged as
            // the law face (alpha 0 at dusk = the S2b exemption live).
            string[] tintNames = new string[] { TintBandRules.NameS, TintBandRules.NameN, TintBandRules.NameRiver };
            SpriteRenderer[] tintSrs = new SpriteRenderer[tintNames.Length];
            Color[] tintC0 = new Color[tintNames.Length];
            for (int i = 0; i < tintNames.Length; i++)
            {
                GameObject tintGo = GameObject.Find(tintNames[i]);
                if (tintGo == null) throw new InvalidOperationException(tintNames[i] + " quad missing");
                tintSrs[i] = tintGo.GetComponent<SpriteRenderer>();
                tintC0[i] = tintSrs[i].color;
            }
            GameObject waterTileGo = GameObject.Find("Water");
            if (waterTileGo == null) throw new InvalidOperationException("Water tilemap GO missing");
            Tilemap waterTm = waterTileGo.GetComponent<Tilemap>();
            if (waterTm == null) throw new InvalidOperationException("Water tilemap component missing");
            Color waterC0 = waterTm.color;

            // shot 1: baseline dusk (tint on, water a0.92)
            Shot(cam, "r205-tintprobe-dusk-full.png");

            // shot 2: tint off (all three blocks)
            for (int i = 0; i < tintSrs.Length; i++)
                tintSrs[i].color = new Color(tintC0[i].r, tintC0[i].g, tintC0[i].b, 0f);
            Shot(cam, "r205-tintprobe-dusk-notint.png");

            // shot 4: water reveal + tint off (pure under-layer)
            waterTm.color = new Color(1f, 1f, 1f, 0.15f);
            Shot(cam, "r205-tintprobe-dusk-under-notint.png");

            // shot 3: water reveal + tint on (under-layer under the tint)
            for (int i = 0; i < tintSrs.Length; i++) tintSrs[i].color = tintC0[i];
            Shot(cam, "r205-tintprobe-dusk-under-tint.png");

            // restore every runtime state (scene NEVER saved)
            waterTm.color = waterC0;
            water.ApplyTick(0);
            amb.ApplyAmbient(AmbientTier.Day);
            water.ApplyTier(AmbientTier.Day);
            light.ApplyState(AmbientTier.Day, 0);
            wl.ReleaseMounts();
            CityLabsTemporal tmp2 = CityLabsTemporal.EnsureRoot();
            tmp2.ReleaseMounts();
            cam.orthographicSize = origSize;
            cam.transform.position = origPos;

            string report = "tintN_color=" + tintC0[1].r.ToString("0.000") + "," + tintC0[1].g.ToString("0.000")
                + "," + tintC0[1].b.ToString("0.000") + " alpha=" + tintC0[1].a.ToString("0.000")
                + " river_alpha=" + tintC0[2].a.ToString("0.000") + " (S2b dusk law: 0)"
                + " water_color=" + waterC0.r.ToString("0.000") + "," + waterC0.g.ToString("0.000")
                + "," + waterC0.b.ToString("0.000") + " alpha=" + waterC0.a.ToString("0.000")
                + " shots=4 (full/notint/under-tint/under-notint) scene_not_saved";
            return report;
        }

        static void Shot(Camera cam, string name)
        {
            RenderTexture rt = new RenderTexture(1920, 1080, 24, RenderTextureFormat.ARGB32);
            cam.targetTexture = rt;
            cam.Render();
            RenderTexture.active = rt;
            Texture2D tex = new Texture2D(1920, 1080, TextureFormat.ARGB32, false);
            tex.ReadPixels(new Rect(0, 0, 1920, 1080), 0, 0);
            tex.Apply();
            cam.targetTexture = null;
            RenderTexture.active = null;
            rt.Release();
            UnityEngine.Object.DestroyImmediate(rt);
            File.WriteAllBytes(Path.Combine(RepoRoot, "logs", name), tex.EncodeToPNG());
            UnityEngine.Object.DestroyImmediate(tex);
        }
    }
}
