// FluxVerse P-28 item 2 (r34): batch proof for the parallax skyline background layer
// (parallax-skyline pack, OGA-BY 3.0). Sentinel pattern (r11/r31 style):
//   pass 1: logs/skyline.run        -> FluxVerse.SkylineProof.BatchRun  -> logs/skyline.done
//   pass 2: logs/skyline-reload.run -> FluxVerse.SkylineProof.ReloadGate -> logs/skyline-reload.done
// Sections:
//  A pure-core gates (SkylineRules, headless):
//    A1 fog law: dusk fog product is mauve (pink-purple), spread-compressed vs the
//       pack's native rose; day haze lighter than dusk; night fog dark + blue-lean;
//       FogNear == FogFar x 0.85 exactly (depth cue),
//    A2 no-loop coverage law: the single non-tiled quad spans the view at every
//       camera position (L0 drift extremes +-2.5 @ half-view 35.556; L1 focus
//       extremes +-34 @ half-view 16); razor-margin print at the L0 extreme,
//    A3 geometry: quad centers solved so the measured first content row lands
//       exactly at the planned peek heights (+19 far / +17.5 near).
//  B asset gate: layer-2/layer-3 importers forced to Sprite + Point filter
//    (r29 law 1, idempotent), sprites load at 576x324, natural bounds 36x20.25.
//  C CityScene wiring: serialized skylineFar/skylineNear wired + saved + disk
//    round-trip; r31 bed wiring regression; runtime-only law (no skyline GO persisted).
//  D render gates (real CityScene, dusk anchor tier): silhouette strip visible above
//    the +15 roofline (delta vs skyline-hidden baseline), mauve character on the
//    rendered strip, night fog darkening, drift-extreme coverage (no gap at the
//    thinnest right edge), follow factor 0.9 position law.
//  E pass 2: everything above survives an editor restart (SEPARATE FILE LAW gate).
// Fail-loud: any broken assumption throws into the .done report. ASCII comments. No 3D.
using System;
using System.IO;
using UnityEngine;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine.SceneManagement;

namespace FluxVerse
{
    public static class SkylineProof
    {
        static string ProjectRoot { get { return Path.GetDirectoryName(Application.dataPath); } }
        static string RepoRoot { get { return Path.GetDirectoryName(ProjectRoot); } }
        static string RunPath { get { return Path.Combine(RepoRoot, "logs", "skyline.run"); } }
        static string DonePath { get { return Path.Combine(RepoRoot, "logs", "skyline.done"); } }
        static string ReloadRunPath { get { return Path.Combine(RepoRoot, "logs", "skyline-reload.run"); } }
        static string ReloadDonePath { get { return Path.Combine(RepoRoot, "logs", "skyline-reload.done"); } }
        static string ScenePath { get { return "Assets/Scenes/CityScene.unity"; } }
        const string FarPath = "Assets/ArtPacks/parallax-skyline/layer-2.png";
        const string NearPath = "Assets/ArtPacks/parallax-skyline/layer-3.png";
        static int asserts;

        [InitializeOnLoadMethod]
        static void Hook()
        {
            if (File.Exists(RunPath)) EditorApplication.delayCall += Run;
            if (File.Exists(ReloadRunPath)) EditorApplication.delayCall += ReloadRun;
        }

        public static void BatchRun() { Run(); }
        public static void ReloadGate() { ReloadRun(); }

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
                File.WriteAllText(DonePath, "FAIL " + e.GetType().Name + ": " + e.Message + " | " + e.StackTrace
                    + " ts=" + DateTime.UtcNow.ToString("o"));
            }
            finally
            {
                if (File.Exists(RunPath)) File.Delete(RunPath);
            }
        }

        static void ReloadRun()
        {
            if (!File.Exists(ReloadRunPath)) return;
            try
            {
                string report = ReloadProve();
                File.WriteAllText(ReloadDonePath, "OK " + report + " ts=" + DateTime.UtcNow.ToString("o"));
            }
            catch (Exception e)
            {
                File.WriteAllText(ReloadDonePath, "FAIL " + e.GetType().Name + ": " + e.Message + " | " + e.StackTrace
                    + " ts=" + DateTime.UtcNow.ToString("o"));
            }
            finally
            {
                if (File.Exists(ReloadRunPath)) File.Delete(ReloadRunPath);
            }
        }

        static void Chk(bool ok, string what)
        {
            if (!ok) throw new InvalidOperationException("ASSERT FAIL: " + what);
            asserts++;
        }

        static string Prove()
        {
            // ---- A1. fog law on the pure cores (law 2: desaturated mauve fog band) ----
            Color native = new Color(0.94f, 0.58f, 0.63f);   // pack dominant rose (240,147,161)
            float nativeSpread = native.r - native.g;
            Color duskFog = SkylineRules.FogFar(AmbientTier.Dusk);
            Color duskProd = new Color(native.r * duskFog.r, native.g * duskFog.g, native.b * duskFog.b);
            Chk(duskProd.r - duskProd.g > 0.02f, "dusk product lost its rose kinship: "
                + duskProd.r.ToString("F3") + "/" + duskProd.g.ToString("F3"));
            Chk(duskProd.b - duskProd.g > 0.01f, "dusk product not purple-leaning: "
                + duskProd.b.ToString("F3") + "/" + duskProd.g.ToString("F3"));
            Chk((duskProd.r - duskProd.g) < nativeSpread * 0.75f, "fog did not compress the r-g spread: "
                + (duskProd.r - duskProd.g).ToString("F3") + " vs " + nativeSpread.ToString("F3"));
            Chk((duskProd.r - duskProd.b) < 0.15f, "dusk product still pink not mauve: "
                + (duskProd.r - duskProd.b).ToString("F3"));
            Color dayFog = SkylineRules.FogFar(AmbientTier.Day);
            float duskLum = (duskFog.r + duskFog.g + duskFog.b) / 3f;
            float dayLum = (dayFog.r + dayFog.g + dayFog.b) / 3f;
            Chk(dayLum > duskLum, "day haze must be lighter than dusk fog");
            Color nightFog = SkylineRules.FogFar(AmbientTier.Night);
            float nightLum = (nightFog.r + nightFog.g + nightFog.b) / 3f;
            Chk(nightLum < 0.15f, "night fog too bright: " + nightLum.ToString("F3"));
            Chk(nightFog.b >= nightFog.r, "night fog must lean blue");
            Color nearF = SkylineRules.FogNear(AmbientTier.Dusk);
            Chk(Math.Abs(nearF.r - duskFog.r * 0.85f) < 1e-5f && Math.Abs(nearF.g - duskFog.g * 0.85f) < 1e-5f
                && Math.Abs(nearF.b - duskFog.b * 0.85f) < 1e-5f, "FogNear != FogFar x 0.85");

            // ---- A2. no-loop coverage law (law 4: never tiled -> must span every cam pos) ----
            float l0Half = RigMath.L0Size * RigMath.Aspect;   // 35.556
            float l1Half = RigMath.L1Size * RigMath.Aspect;   // 16
            Chk(SkylineRules.Covers(2.5f, l0Half), "L0 drift +x extreme uncovered");
            Chk(SkylineRules.Covers(-2.5f, l0Half), "L0 drift -x extreme uncovered");
            Chk(SkylineRules.Covers(34f, l1Half), "L1 focus +x extreme uncovered");
            Chk(SkylineRules.Covers(-34f, l1Half), "L1 focus -x extreme uncovered");
            float razor = (SkylineRules.FollowFactor * 2.5f + SkylineRules.SourceW * SkylineRules.Texel * 0.5f)
                - (2.5f + l0Half);
            Chk(razor > 0.15f, "L0 extreme razor margin too thin: " + razor.ToString("F4"));

            // ---- A3. geometry: measured content rows land at the planned peek heights ----
            float farC = SkylineRules.QuadCenterY(SkylineRules.FarTopRow, SkylineRules.FarContentTopY);
            float nearC = SkylineRules.QuadCenterY(SkylineRules.NearTopRow, SkylineRules.NearContentTopY);
            Chk(Math.Abs(farC - 6.375f) < 1e-4f, "far center Y off hand math: " + farC.ToString("F4"));
            Chk(Math.Abs(nearC - 7.125f) < 1e-4f, "near center Y off hand math: " + nearC.ToString("F4"));
            float halfH = SkylineRules.SourceH * SkylineRules.Texel * 0.5f;   // 20.25
            float farTopContent = farC + halfH - SkylineRules.FarTopRow * SkylineRules.Texel;
            Chk(Math.Abs(farTopContent - SkylineRules.FarContentTopY) < 1e-4f, "far content top not at +19");
            float nearTopContent = nearC + halfH - SkylineRules.NearTopRow * SkylineRules.Texel;
            Chk(Math.Abs(nearTopContent - SkylineRules.NearContentTopY) < 1e-4f, "near content top not at +17.5");

            // ---- A4. silent-degrade law: unwired sprites = no skyline, no exceptions ----
            GameObject tmpAmb = new GameObject("TmpAmbNull");
            CityAmbient bare = tmpAmb.AddComponent<CityAmbient>();
            bare.EnsureVisuals();
            Chk(GameObject.Find("SkylineFar") == null && GameObject.Find("SkylineNear") == null,
                "unwired sprites must stay silent (no skyline quads)");
            UnityEngine.Object.DestroyImmediate(tmpAmb);
            Chk(GameObject.Find("TmpAmbNull") == null, "sandbox residue after cleanup");

            // ---- B. asset gate: importers forced to Sprite + Point (law 1, idempotent) ----
            Sprite farS = ForceSprite(FarPath);
            Sprite nearS = ForceSprite(NearPath);
            Chk(farS != null && nearS != null, "silhouette sprites failed to load");
            Chk(Math.Abs(farS.rect.width - 576f) < 0.5f && Math.Abs(farS.rect.height - 324f) < 0.5f,
                "far sprite not 576x324: " + farS.rect.width + "x" + farS.rect.height);
            Chk(Math.Abs(nearS.rect.width - 576f) < 0.5f && Math.Abs(nearS.rect.height - 324f) < 0.5f,
                "near sprite not 576x324: " + nearS.rect.width + "x" + nearS.rect.height);
            Chk(Math.Abs(farS.bounds.size.x - 36f) < 0.01f && Math.Abs(farS.bounds.size.y - 20.25f) < 0.01f,
                "far natural bounds not 36x20.25 (PPU16): " + farS.bounds.size.ToString("F3"));

            // ---- C. CityScene wiring + save + disk round-trip ----
            Scene scene = EditorSceneManager.OpenScene(ScenePath, OpenSceneMode.Single);
            GameObject ambGo = GameObject.Find("CityAmbient");
            Chk(ambGo != null, "CityAmbient GO missing in CityScene");
            CityAmbient amb = ambGo.GetComponent<CityAmbient>();
            Chk(amb != null, "CityAmbient component unresolved (r14 stub disease)");
            amb.skylineFar = farS;
            amb.skylineNear = nearS;
            bool saved = EditorSceneManager.SaveScene(scene);
            Chk(saved, "scene save failed");
            Scene reopened = EditorSceneManager.OpenScene(ScenePath, OpenSceneMode.Single);
            GameObject ambGo2 = GameObject.Find("CityAmbient");
            CityAmbient amb2 = ambGo2 != null ? ambGo2.GetComponent<CityAmbient>() : null;
            Chk(amb2 != null, "CityAmbient lost after save");
            Chk(amb2.skylineFar != null && amb2.skylineNear != null, "skyline sprites not persisted to disk");
            Chk(Math.Abs(amb2.skylineFar.rect.width - 576f) < 0.5f, "persisted far sprite wrong size");
            Chk(GameObject.Find("SkylineFar") == null, "skyline GO leaked into the saved scene (runtime-only law)");
            // r31 bed wiring regression (our save must not drop earlier serialized wiring)
            CityAmbientAudio bed = amb2.GetComponent<CityAmbientAudio>();
            Chk(bed != null, "CityAmbientAudio lost after save (r31 regression)");
            Chk(bed.noiseBed != null && bed.noiseBed.length > 0f, "bed noise clip lost after save");
            Chk(UnityEngine.Object.FindObjectsOfType<CityInterior>().Length >= 1, "CityInterior lost after save");
            Chk(UnityEngine.Object.FindObjectsOfType<CityCameraRig>().Length >= 1, "CityCameraRig lost after save");
            GameObject camGo = GameObject.Find("CityCamera");
            Camera cam = camGo != null ? camGo.GetComponent<Camera>() : null;
            Chk(cam != null && cam.orthographic, "CityCamera broken after save");
            Chk(Math.Abs(cam.orthographicSize - RigMath.L0Size) < 0.01f, "L0 size drift after save");

            // ---- D. render gates on the reopened scene (transient visuals, never saved) ----
            amb2.EnsureVisuals();
            GameObject farGo = GameObject.Find("SkylineFar");
            GameObject nearGo = GameObject.Find("SkylineNear");
            Chk(farGo != null && nearGo != null, "skyline quads not built from wired sprites");
            SpriteRenderer farR = farGo.GetComponent<SpriteRenderer>();
            SpriteRenderer nearR = nearGo.GetComponent<SpriteRenderer>();
            Chk(farR.sortingOrder == SkylineRules.FarOrder && nearR.sortingOrder == SkylineRules.NearOrder,
                "skyline sorting orders wrong: " + farR.sortingOrder + "/" + nearR.sortingOrder);
            Chk(farGo.transform.parent == amb2.transform, "far quad not parented to CityAmbient");

            // D1 dusk anchor tier: baseline (quads hidden) vs skyline-on
            amb2.ApplyAmbient(AmbientTier.Dusk);
            SetSkylineActive(farR, nearR, false);
            Texture2D baseDusk = Shot(cam, null);
            SetSkylineActive(farR, nearR, true);
            Texture2D duskShot = Shot(cam, "m1-r34-skyline-dusk.png");
            float duskR, duskG, duskB; int duskN, duskTot;
            BandDelta(duskShot, baseDusk, cam, -24f, 24f, 15.4f, 16.6f, out duskN, out duskTot, out duskR, out duskG, out duskB);
            float duskFrac = duskN / (float)Math.Max(1, duskTot);
            Chk(duskN >= 3000, "dusk silhouette strip too sparse: px=" + duskN + "/" + duskTot);
            Chk(duskFrac >= 0.28f, "dusk silhouette coverage fraction low: " + duskFrac.ToString("F3"));
            Chk(duskR - duskG > 0.02f, "rendered strip lost rose kinship: d=" + (duskR - duskG).ToString("F3"));
            Chk(duskB - duskG > 0.01f, "rendered strip not purple-leaning: d=" + (duskB - duskG).ToString("F3"));
            float duskSilLum = (duskR + duskG + duskB) / 3f;

            // D2 night tier: silhouette still visible, fog darkens it hard
            amb2.ApplyAmbient(AmbientTier.Night);
            SetSkylineActive(farR, nearR, false);
            Texture2D baseNight = Shot(cam, null);
            SetSkylineActive(farR, nearR, true);
            Texture2D nightShot = Shot(cam, "m1-r34-skyline-night.png");
            float nR, nG, nB; int nN, nTot;
            BandDelta(nightShot, baseNight, cam, -24f, 24f, 15.4f, 16.6f, out nN, out nTot, out nR, out nG, out nB);
            float nightSilLum = (nR + nG + nB) / 3f;
            Chk(nN >= 3000, "night silhouette strip too sparse: px=" + nN + "/" + nTot);
            Chk(nightSilLum < duskSilLum * 0.35f, "night fog did not darken the skyline: "
                + nightSilLum.ToString("F3") + " vs " + duskSilLum.ToString("F3"));

            // D3 drift-extreme coverage + follow factor (0.9 x cam position law)
            Vector3 origPos = cam.transform.position;
            cam.transform.position = new Vector3(2.5f, origPos.y, origPos.z);
            amb2.SyncSkyline();
            Chk(Math.Abs(farR.transform.position.x - 2.25f) < 1e-3f, "follow law broken: far x="
                + farR.transform.position.x.ToString("F4"));
            SetSkylineActive(farR, nearR, false);
            Texture2D baseEdge = Shot(cam, null);
            SetSkylineActive(farR, nearR, true);
            Texture2D edgeShot = Shot(cam, null);
            int eN, eTot; float eR, eG, eB;
            BandDelta(edgeShot, baseEdge, cam, 20f, 33f, 15.4f, 16.4f, out eN, out eTot, out eR, out eG, out eB);
            Chk(eN >= 800, "silhouette gap at drift extreme (thinnest edge): px=" + eN + "/" + eTot);
            cam.transform.position = origPos;
            amb2.SyncSkyline();
            Chk(Math.Abs(farR.transform.position.x - SkylineRules.FollowFactor * origPos.x) < 1e-3f,
                "follow did not restore with the camera");

            // cleanup in-memory evidence (scene itself was saved back in C, before any quad existed)
            UnityEngine.Object.DestroyImmediate(baseDusk);
            UnityEngine.Object.DestroyImmediate(duskShot);
            UnityEngine.Object.DestroyImmediate(baseNight);
            UnityEngine.Object.DestroyImmediate(nightShot);
            UnityEngine.Object.DestroyImmediate(baseEdge);
            UnityEngine.Object.DestroyImmediate(edgeShot);

            return "asserts=" + asserts
                + " fog(dusk_mauve,day>dusk,night=" + nightLum.ToString("F3") + ")"
                + " cover(razor=" + razor.ToString("F3") + "u,L0/L1 extremes ok)"
                + " geom(farC=" + farC.ToString("F3") + ",nearC=" + nearC.ToString("F3") + ")"
                + " assets(sprite+point,576x324)"
                + " scene(saved=" + saved + ",sprites persisted,bed_regression_ok)"
                + " render(dusk_px=" + duskN + "/" + duskTot + " frac=" + duskFrac.ToString("F2")
                + " mauve(r-g=" + (duskR - duskG).ToString("F3") + ",b-g=" + (duskB - duskG).ToString("F3") + ")"
                + " night_px=" + nN + " lum=" + nightSilLum.ToString("F3") + "vs" + duskSilLum.ToString("F3")
                + " edge_px=" + eN + "/" + eTot + " follow_x=" + farR.transform.position.x.ToString("F2") + ")"
                + " shots=2";
        }

        static string ReloadProve()
        {
            Scene scene = EditorSceneManager.OpenScene(ScenePath, OpenSceneMode.Single);
            if (!scene.isLoaded) throw new InvalidOperationException("CityScene failed to load");
            GameObject ambGo = GameObject.Find("CityAmbient");
            CityAmbient amb = ambGo != null ? ambGo.GetComponent<CityAmbient>() : null;
            Chk(amb != null, "CityAmbient missing/unresolved after editor restart (r14 stub disease)");
            Chk(amb.skylineFar != null && amb.skylineNear != null, "skyline sprites lost across sessions");
            Chk(Math.Abs(amb.skylineFar.rect.width - 576f) < 0.5f, "far sprite wrong size after restart");
            Chk(Math.Abs(amb.skylineNear.rect.height - 324f) < 0.5f, "near sprite wrong size after restart");
            TextureImporter imp = (TextureImporter)TextureImporter.GetAtPath(FarPath);
            Chk(imp != null && imp.textureType == TextureImporterType.Sprite,
                "importer type not persisted as Sprite: " + (imp == null ? "null" : imp.textureType.ToString()));
            Chk(imp.filterMode == FilterMode.Point, "point filter law not persisted: " + imp.filterMode);
            Chk(Math.Abs(imp.spritePixelsPerUnit - 16f) < 0.01f, "PPU16 law not persisted: " + imp.spritePixelsPerUnit);
            Chk(GameObject.Find("SkylineFar") == null && GameObject.Find("SkylineNear") == null,
                "skyline GOs persisted into scene (runtime-only law broken)");
            Chk(UnityEngine.Object.FindObjectsOfType<CityInterior>().Length >= 1, "CityInterior unresolved after restart");
            Chk(UnityEngine.Object.FindObjectsOfType<CityCameraRig>().Length >= 1, "CityCameraRig unresolved after restart");
            Chk(UnityEngine.Object.FindObjectsOfType<CityAmbientAudio>().Length >= 1, "CityAmbientAudio unresolved after restart");
            GameObject camGo = GameObject.Find("CityCamera");
            Camera cam = camGo != null ? camGo.GetComponent<Camera>() : null;
            Chk(cam != null && Math.Abs(cam.orthographicSize - RigMath.L0Size) < 0.01f, "L0 camera broken after restart");
            return "reload_gate=OK sprites=2/2 persisted importers=sprite+point no_skyline_go neighbors=3 cam_L0="
                + cam.orthographicSize.ToString("F1");
        }

        // forces Sprite + Point + PPU16 on a silhouette importer (idempotent) and returns
        // the sprite. r34 first-run catch: importer default PPU is 100, which shrinks the
        // natural bounds to 5.76x3.24u and the x2 quad to a speck - the 16-PPU world law
        // (r13) must be enforced here, not assumed.
        static Sprite ForceSprite(string path)
        {
            TextureImporter imp = (TextureImporter)TextureImporter.GetAtPath(path);
            if (imp == null) throw new InvalidOperationException("importer missing: " + path);
            if (imp.textureType != TextureImporterType.Sprite || imp.filterMode != FilterMode.Point
                || imp.mipmapEnabled || Math.Abs(imp.spritePixelsPerUnit - 16f) > 0.01f)
            {
                imp.textureType = TextureImporterType.Sprite;
                imp.filterMode = FilterMode.Point;
                imp.mipmapEnabled = false;
                imp.spritePixelsPerUnit = 16f;
                imp.SaveAndReimport();
            }
            if (imp.textureType != TextureImporterType.Sprite || imp.filterMode != FilterMode.Point
                || Math.Abs(imp.spritePixelsPerUnit - 16f) > 0.01f)
                throw new InvalidOperationException("importer fix did not stick: " + path);
            return AssetDatabase.LoadAssetAtPath<Sprite>(path);
        }

        // toggles via cached renderer references - GameObject.Find skips INACTIVE objects
        // (r34 second-run catch: Find-based toggle left the quads hidden in both shots,
        // delta=0 = the classic "changed nothing and the numbers agreed" trap)
        static void SetSkylineActive(SpriteRenderer farR, SpriteRenderer nearR, bool on)
        {
            if (farR == null || nearR == null)
                throw new InvalidOperationException("skyline renderers missing for toggle");
            farR.gameObject.SetActive(on);
            nearR.gameObject.SetActive(on);
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
            if (name != null) File.WriteAllBytes(Path.Combine(RepoRoot, "docs", "design", name), tex.EncodeToPNG());
            return tex;
        }

        // silhouette metric: pixels in a world-band that differ from the baseline shot
        // (clean attribution: only the skyline quads change between the two renders)
        static void BandDelta(Texture2D a, Texture2D b, Camera cam,
            float wx0, float wx1, float wy0, float wy1,
            out int deltaCount, out int totalSamples, out float avgR, out float avgG, out float avgB)
        {
            float halfH = cam.orthographicSize;
            float halfW = halfH * (1920f / 1080f);
            float cx = cam.transform.position.x, cy = cam.transform.position.y;
            int px0 = (int)(((wx0 - cx) / (2f * halfW) + 0.5f) * 1920f);
            int px1 = (int)(((wx1 - cx) / (2f * halfW) + 0.5f) * 1920f);
            int py0 = (int)(((wy0 - cy) / (2f * halfH) + 0.5f) * 1080f);
            int py1 = (int)(((wy1 - cy) / (2f * halfH) + 0.5f) * 1080f);
            px0 = Math.Max(0, px0); px1 = Math.Min(1919, px1);
            py0 = Math.Max(0, py0); py1 = Math.Min(1079, py1);
            double sr = 0, sg = 0, sb = 0; int n = 0, tot = 0;
            for (int y = py0; y <= py1; y += 2)
                for (int x = px0; x <= px1; x += 2)
                {
                    Color ca = a.GetPixel(x, y);
                    Color cb = b.GetPixel(x, y);
                    float d = Math.Abs(ca.r - cb.r) + Math.Abs(ca.g - cb.g) + Math.Abs(ca.b - cb.b);
                    tot++;
                    if (d > 0.06f) { sr += ca.r; sg += ca.g; sb += ca.b; n++; }
                }
            deltaCount = n; totalSamples = tot;
            int nn = Math.Max(1, n);
            avgR = (float)(sr / nn); avgG = (float)(sg / nn); avgB = (float)(sb / nn);
        }
    }
}
