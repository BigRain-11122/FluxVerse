// FluxVerse r161 (P-20260925-09): AlbumShot - the four-scene acceptance
// render pass for the CEO album (day/night x water/street, spec S3).
// r181 (T-FV-002 S6b): +2 DUSK hero frames (dusk-water L0 / dusk-street L1)
// +1 variant-A fog diagnostic - the golden-hour quadrant the album never
// had (r174 finding); the S6b census gates measure the dusk-water frame.
// COHERENT per-scene tier apply: every family lands on the SAME tier before
// each shot (ambient palette + fog veil + water fx incl. the rose wash +
// light fx incl. the a75 gold band + window lights at the REAL world-state
// zone rates via the adapter's own Poll path) - the per-family proof shots
// only pull their own family to tier, so the album needs this integration
// pass to exist.
// Read-only law: opens the scene, applies runtime state, shoots, restores
// the camera + window-light mounts, and NEVER saves the scene - the disk
// keeps the day-law boot state (r124/r146 disk law). ASCII. No 3D.
using System;
using System.IO;
using UnityEngine;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine.SceneManagement;

namespace FluxVerse
{
    public static class AlbumShot
    {
        static string ProjectRoot { get { return Path.GetDirectoryName(Application.dataPath); } }
        static string RepoRoot { get { return Path.GetDirectoryName(ProjectRoot); } }
        static string RunPath { get { return Path.Combine(RepoRoot, "logs", "album.run"); } }
        static string DonePath { get { return Path.Combine(RepoRoot, "logs", "album.done"); } }
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
            if (amb == null) throw new InvalidOperationException("CityAmbient component missing");

            GameObject waterGo = GameObject.Find("CityWaterFx");
            if (waterGo == null) throw new InvalidOperationException("CityWaterFx GO missing");
            CityWaterFx water = waterGo.GetComponent<CityWaterFx>();
            if (water == null) throw new InvalidOperationException("CityWaterFx component missing");

            GameObject lightGo = GameObject.Find("CityLightFx");
            if (lightGo == null) throw new InvalidOperationException("CityLightFx GO missing");
            CityLightFx light = lightGo.GetComponent<CityLightFx>();
            if (light == null) throw new InvalidOperationException("CityLightFx component missing");

            GameObject wlGo = GameObject.Find(CityWindowLight.GoName);
            if (wlGo == null) throw new InvalidOperationException("CityWindowLight GO missing");
            CityWindowLight wl = wlGo.GetComponent<CityWindowLight>();
            if (wl == null) throw new InvalidOperationException("CityWindowLight component missing");

            GameObject camGo = GameObject.Find("CityCamera");
            Camera cam = camGo != null ? camGo.GetComponent<Camera>() : null;
            if (cam == null || !cam.orthographic) throw new InvalidOperationException("CityCamera missing");
            Vector3 origPos = cam.transform.position;
            float origSize = cam.orthographicSize;

            const int WaveTick = 2;   // a live phase of the 8-frame cycle (not the boot paint)

            // shot 1: day x water (L0 full view)
            ApplyScene(amb, water, light, wl, AmbientTier.Day, WaveTick);
            Shot(cam, "m1-r161-album-day-water.png");

            // shot 2: day x street (L1 south, r160 D4 camera law)
            cam.orthographicSize = RigMath.L1Size;
            cam.transform.position = new Vector3(0.5f, -5.0f, origPos.z);
            Shot(cam, "m1-r161-album-day-street.png");

            // shot 3: night x water (L0 - reflections + shimmer + window lights)
            ApplyScene(amb, water, light, wl, AmbientTier.Night, WaveTick);
            cam.orthographicSize = origSize;
            cam.transform.position = origPos;
            Shot(cam, "m1-r161-album-night-water.png");

            // shot 4: night x street (L1 south - cones + bloom + window lights)
            cam.orthographicSize = RigMath.L1Size;
            cam.transform.position = new Vector3(0.5f, -5.0f, origPos.z);
            Shot(cam, "m1-r161-album-night-street.png");

            // shot 5: night x water with the WATER FAMILY OFF - the toggle-diff
            // twin of shot 3 (clean attribution of refl+shimmer: same camera,
            // same ambient, foam and wave tiles identical, only refl/shim
            // alpha 0 - the r155 per-mount census method, album-frame twin)
            cam.orthographicSize = origSize;
            cam.transform.position = origPos;
            water.ApplyTier(AmbientTier.Day);   // refl/shim alpha 0, foam stays 1.0
            Shot(cam, "m1-r161-album-night-water-norefl.png");

            // r181 (T-FV-002 S6b, duskgold-manifest.albumshot_dusk): the two
            // DUSK hero frames - the golden-hour quadrant the album never had
            // (r174 finding: the CEO critique "no dusk light" traced to zero
            // dusk frames in the acceptance album). Coherent apply: palette +
            // fog veil + gold band a75 + rose water wash + window lights at
            // the REAL world-state rates through the v2 law (~24 pct lit at
            // the 0.55 dusk alpha = the order's "windows just lighting up").
            ApplyScene(amb, water, light, wl, AmbientTier.Dusk, WaveTick);
            cam.orthographicSize = origSize;
            cam.transform.position = origPos;
            Shot(cam, "m1-r181-dusk-water.png");

            // shot 5b: variant-A fog diagnostic (order 8, above the tint) -
            // the r180 manifest A/B decision procedure rendered ONCE for the
            // record; the law (variant B) restores right after the shot
            GameObject fogA = GameObject.Find(LightFxRules.FogWashName);
            if (fogA != null)
            {
                SpriteRenderer fogAsr = fogA.GetComponent<SpriteRenderer>();
                fogAsr.sortingOrder = 8;                  // full physical fog plane
                fogA.transform.position = new Vector3(fogA.transform.position.x,
                    fogA.transform.position.y, -0.1f);   // above the tint (z 0)
                Shot(cam, "m1-r181-dusk-water-fogA.png");
                fogAsr.sortingOrder = LightFxRules.FogWashOrder;   // restore law B
                fogA.transform.position = new Vector3(fogA.transform.position.x,
                    fogA.transform.position.y, LightFxRules.FogWashZ);
            }

            // dusk x street (L1 south, r160 D4 camera law)
            cam.orthographicSize = RigMath.L1Size;
            cam.transform.position = new Vector3(0.5f, -5.0f, origPos.z);
            Shot(cam, "m1-r181-dusk-street.png");

            // restore in-memory state (scene is NEVER saved here)
            cam.orthographicSize = origSize;
            cam.transform.position = origPos;
            ApplyScene(amb, water, light, wl, AmbientTier.Day, 0);
            wl.ReleaseMounts();
            if (File.Exists(Path.Combine(RepoRoot, "docs", "design", "m1-r161-album-day-water.png"))
                && File.Exists(Path.Combine(RepoRoot, "docs", "design", "m1-r161-album-day-street.png"))
                && File.Exists(Path.Combine(RepoRoot, "docs", "design", "m1-r161-album-night-water.png"))
                && File.Exists(Path.Combine(RepoRoot, "docs", "design", "m1-r161-album-night-street.png"))
                && File.Exists(Path.Combine(RepoRoot, "docs", "design", "m1-r161-album-night-water-norefl.png"))
                && File.Exists(Path.Combine(RepoRoot, "docs", "design", "m1-r181-dusk-water.png"))
                && File.Exists(Path.Combine(RepoRoot, "docs", "design", "m1-r181-dusk-street.png")))
                return "7 album shots rendered (4 scenes + refl twin + 2 dusk heroes + fogA diagnostic), scene NOT saved";
            throw new InvalidOperationException("album shot missing after render");
        }

        // coherent apply: every family lands on the SAME tier before the shot
        static void ApplyScene(CityAmbient amb, CityWaterFx water, CityLightFx light,
            CityWindowLight wl, AmbientTier t, int waveTick)
        {
            amb.ApplyAmbient(t);            // instant settle + EnsureVisuals (r156 law)
            water.EnsureRefs();
            water.ApplyTier(t);             // refl/shim tier alpha, foam stays 1.0
            water.ApplyTick(waveTick);      // live wave phase + foam frame swap
            water.RestoreWobble();         // bank-pinned base positions for the still
            light.ApplyState(t, 0);         // tier alpha law + twinkle step 0
            wl.Poll();                      // REAL world-state zone rates at amb.CurrentTier
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
            File.WriteAllBytes(Path.Combine(RepoRoot, "docs", "design", name), tex.EncodeToPNG());
            UnityEngine.Object.DestroyImmediate(tex);
        }
    }
}
