// FluxVerse T-FV-002 S5b (r179): batch proof for the resident label UI shell.
// Sentinel pattern (r36 style):
//   pass 1: logs/labels.run         -> FluxVerse.ResidentLabelProof.BatchRun   -> logs/labels.done
//   pass 2: logs/labels-reload.run   -> FluxVerse.ResidentLabelProof.ReloadGate -> logs/labels-reload.done
// Sections:
//  A pure-core gates (headless): constants (80x26 canvas, 8px head gap,
//    budget 6, L1 threshold 14.5), StreetTier boundaries, HeadWorld
//    derivation, ScreenPos hand-math golden, PickBudgeted goldens (distance
//    order, slot tie-break, inactive exclusion, all-inactive empty,
//    off-frame / margin exclusion, budget cut, double-run determinism, real
//    L1 framing re-derivation).
//  A2 identity-coupling gates (orphan-face law): 32 roster slots, plateIndex
//    0..31 unique, label file present for every plateIndex.
//  B asset gates: 32 pills forced Sprite+Single+Point+PPU100+no mips, rect
//    80x26; UI pool census == 32 through the adapter's own byte-path loader.
//  C CityScene wiring: the r179 WORLD-PLATE RETIREMENT (00:10 art-fix order
//    4): sweep every root NameTag* GO -> idempotent second sweep -> census
//    law flips to ZERO world plates ever -> EnsureLabelsAdapter (persisted
//    CityLabelsUI root, CityStreetBehavior precedent) -> save -> disk
//    round-trip; camera cross-check (pure ScreenPos vs
//    Camera.WorldToScreenPoint at the L1 street framing); neighbor
//    regressions (residents 32 + shadows 32, robots 8, neon, skyline, bed
//    clip, interior, rig, L0 camera, tilemaps, runtime-only law).
//  D street-tier record shots: four L1 frames (south day/dusk/night + north
//    day) - the zero-floating-plate evidence face. The census is the gate;
//    the uGUI pills themselves are play-mode-only (r16 batch law) - the
//    play visuals are the CEO review face (r25 audio precedent).
//  E pass 2: everything survives an editor restart.
// Fail-loud: any broken assumption throws into the .done report. ASCII only. No 3D.
using System;
using System.Collections.Generic;
using System.IO;
using UnityEngine;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine.SceneManagement;
using UnityEngine.Tilemaps;

namespace FluxVerse
{
    public static class ResidentLabelProof
    {
        static string ProjectRoot { get { return Path.GetDirectoryName(Application.dataPath); } }
        static string RepoRoot { get { return Path.GetDirectoryName(ProjectRoot); } }
        static string RunPath { get { return Path.Combine(RepoRoot, "logs", "labels.run"); } }
        static string DonePath { get { return Path.Combine(RepoRoot, "logs", "labels.done"); } }
        static string ReloadRunPath { get { return Path.Combine(RepoRoot, "logs", "labels-reload.run"); } }
        static string ReloadDonePath { get { return Path.Combine(RepoRoot, "logs", "labels-reload.done"); } }
        static string ScenePath { get { return "Assets/Scenes/CityScene.unity"; } }
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
            finally { if (File.Exists(RunPath)) File.Delete(RunPath); }
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
            finally { if (File.Exists(ReloadRunPath)) File.Delete(ReloadRunPath); }
        }

        static void Chk(bool ok, string what)
        {
            if (!ok) throw new InvalidOperationException("ASSERT FAIL: " + what);
            asserts++;
        }

        static string Prove()
        {
            // ---- A. pure-core gates on the label rules ----
            Chk(ResidentLabelRules.Count == 32, "label count must be 32");
            Chk(ResidentLabelRules.Count == ResidentRules.Count, "label count must mirror the roster");
            Chk(ResidentLabelRules.PxW == 80 && ResidentLabelRules.PxH == 26,
                "pill canvas must be 80x26 (r178 bake)");
            Chk(Math.Abs(ResidentLabelRules.HeadGapPx - 8f) < 1e-5f,
                "HeadGapPx must be 8 (sec.8 baseline law, screen form)");
            Chk(ResidentLabelRules.MaxOnScreen == 6, "budget must be 6 (r42 rationing family)");
            Chk(Math.Abs(ResidentLabelRules.L1Threshold - 14.5f) < 1e-5f,
                "L1 threshold must be 14.5 (r14 L0 20 / L1 9 midpoint)");
            Chk(!ResidentLabelRules.StreetTier(20f), "L0 panorama must carry zero text");
            Chk(!ResidentLabelRules.StreetTier(14.5f), "the exact mid-transition frame stays label-free");
            Chk(ResidentLabelRules.StreetTier(14.4f), "street tier must engage below the midpoint");
            Chk(ResidentLabelRules.StreetTier(9f), "L1 street size 9 must be label tier");
            Chk(ResidentLabelRules.Name(0) == "ResLabel00" && ResidentLabelRules.Name(31) == "ResLabel31",
                "pill naming law ResLabel00..31");
            for (int i = 0; i < ResidentLabelRules.Count; i++)
            {
                Vector2 h = ResidentLabelRules.HeadWorld(i);
                Vector2 r = ResidentRules.Pos(i);
                Chk(Math.Abs(h.x - r.x) < 1e-5f && Math.Abs(h.y - (r.y + ResidentRules.HalfSide)) < 1e-5f,
                    "head law broken at slot " + i + " (body top of the 1.333u seat)");
            }
            // ScreenPos hand-math golden: world (3.25,-7.1), cam (0.5,-5),
            // ortho 9, aspect 16:9, 1920x1080 -> (1125, 414) exactly
            {
                Vector2 sp = ResidentLabelRules.ScreenPos(new Vector2(3.25f, -7.1f),
                    new Vector2(0.5f, -5f), 9f, 16f / 9f, 1920f, 1080f);
                Chk(Math.Abs(sp.x - 1125f) < 0.01f && Math.Abs(sp.y - 414f) < 0.01f,
                    "ScreenPos golden broken: " + sp.x + "," + sp.y);
                Vector2 an = ResidentLabelRules.Anchor(sp);
                Chk(Math.Abs(an.x - sp.x) < 1e-5f && Math.Abs((an.y - sp.y) - 21f) < 1e-5f,
                    "Anchor law broken (gap 8 + half pill 13 = 21px above the head)");
            }
            // FitsScreen margin boundaries
            Chk(ResidentLabelRules.FitsScreen(new Vector2(44f, 30f), 1920f, 1080f),
                "margin-fit anchor (44,30) must fit");
            Chk(!ResidentLabelRules.FitsScreen(new Vector2(43.99f, 30f), 1920f, 1080f),
                "sub-margin anchor must not fit");
            Chk(ResidentLabelRules.FitsScreen(new Vector2(1876f, 1063f), 1920f, 1080f),
                "top-right margin-fit anchor must fit");
            Chk(!ResidentLabelRules.FitsScreen(new Vector2(1876f, 1063.01f), 1920f, 1080f),
                "above-margin anchor must not fit");

            // PickBudgeted goldens (synthetic)
            {
                Vector2[] a = new Vector2[32]; bool[] on = new bool[32];
                for (int i = 0; i < 32; i++) { a[i] = new Vector2(100f, 100f); on[i] = false; }
                // case 1: distance order + budget cut (slots 0..9 march away
                // from the center; all fit; corner anchors are farther)
                for (int i = 0; i < 32; i++) on[i] = true;
                for (int k = 0; k <= 9; k++) a[k] = new Vector2(960f + k * 50f, 540f);
                int[] p1 = ResidentLabelRules.PickBudgeted(a, on, 1920f, 1080f);
                Chk(p1.Length == ResidentLabelRules.MaxOnScreen, "budget cut broken: " + p1.Length);
                for (int k = 0; k < p1.Length; k++)
                    Chk(p1[k] == k, "distance order broken at rank " + k + ": " + p1[k]);
                // case 2: exact tie -> lower roster slot wins
                for (int i = 0; i < 32; i++) { a[i] = new Vector2(100f, 100f); on[i] = false; }
                a[0] = new Vector2(860f, 540f); on[0] = true;    // dist 100
                a[5] = new Vector2(1060f, 540f); on[5] = true;    // dist 100 (tie)
                a[1] = new Vector2(960f, 540f); on[1] = true;    // dist 0
                int[] p2 = ResidentLabelRules.PickBudgeted(a, on, 1920f, 1080f);
                Chk(p2.Length == 3 && p2[0] == 1 && p2[1] == 0 && p2[2] == 5,
                    "tie law broken (center first, then slot order): "
                    + (p2.Length > 0 ? p2[0] + "," + p2[1] + "," + p2[2] : "empty"));
                // case 3: the nearest seat is INACTIVE -> excluded (r124 trio law)
                for (int i = 0; i < 32; i++) { a[i] = new Vector2(100f, 100f); on[i] = false; }
                a[1] = new Vector2(960f, 540f); on[1] = false;   // nearest but hidden
                a[0] = new Vector2(860f, 540f); on[0] = true;    // next nearest
                int[] p3 = ResidentLabelRules.PickBudgeted(a, on, 1920f, 1080f);
                Chk(p3.Length == 1 && p3[0] == 0, "inactive seat must never label: " + p3.Length);
                // case 4: all inactive -> zero labels
                for (int i = 0; i < 32; i++) on[i] = false;
                int[] p4 = ResidentLabelRules.PickBudgeted(a, on, 1920f, 1080f);
                Chk(p4.Length == 0, "all-hidden street must show zero labels: " + p4.Length);
                // case 5: off-frame / sub-margin anchors do not exist
                for (int i = 0; i < 32; i++) { a[i] = new Vector2(100f, 100f); on[i] = false; }
                a[2] = new Vector2(-100f, 540f); on[2] = true;   // fully off-frame
                a[3] = new Vector2(44f, 30f); on[3] = true;      // margin-fit (in)
                a[4] = new Vector2(43f, 30f); on[4] = true;      // sub-margin (out)
                int[] p5 = ResidentLabelRules.PickBudgeted(a, on, 1920f, 1080f);
                Chk(p5.Length == 1 && p5[0] == 3, "frame-fit law broken: len=" + p5.Length);
                // case 6: double-run determinism
                for (int i = 0; i < 32; i++) { a[i] = new Vector2(100f, 100f); on[i] = true; }
                for (int k = 0; k <= 9; k++) a[k] = new Vector2(960f + k * 50f, 540f);
                a[10] = new Vector2(960f, 538f);                  // near-tie noise
                int[] p6a = ResidentLabelRules.PickBudgeted(a, on, 1920f, 1080f);
                int[] p6b = ResidentLabelRules.PickBudgeted(a, on, 1920f, 1080f);
                Chk(p6a.Length == p6b.Length, "determinism broken (length)");
                for (int k = 0; k < p6a.Length; k++)
                    Chk(p6a[k] == p6b[k], "determinism broken at rank " + k);
            }

            // ---- A2. identity-coupling gates (orphan-face law) ----
            ResidentIdentityEntry[] ids = ResidentIdentity.Load(true);
            Chk(ids != null, "roster absent/broken - labels would be orphans (r98 bake must be present)");
            HashSet<int> plateIdx = new HashSet<int>();
            int poolCensus = 0;
            List<Sprite> loaded = new List<Sprite>();
            if (ids != null)
            {
                Chk(ids.Length == 32, "identity slot count != 32: " + ids.Length);
                for (int i = 0; i < ids.Length; i++)
                {
                    ResidentIdentityEntry e = ids[i];
                    Chk(e != null, "identity slot null at " + i);
                    if (e == null) continue;
                    Chk(plateIdx.Add(e.plateIndex), "duplicate plateIndex at slot " + i + ": " + e.plateIndex);
                    string rel = ResidentLabelRules.SpritePath(e.plateIndex);
                    Chk(File.Exists(Path.Combine(Application.dataPath, rel.Substring(7))),
                        "label file missing for slot " + i + ": " + rel);
                }
                // UI pool census through the adapter's OWN byte-path loader
                for (int i = 0; i < ids.Length; i++)
                {
                    Sprite s = ResidentLabelsUI.LoadLabelSprite(ids[i].plateIndex);
                    Chk(s != null, "pool load failed for plateIndex " + ids[i].plateIndex);
                    if (s != null) { poolCensus++; loaded.Add(s); }
                }
                Chk(poolCensus == 32, "UI pool census != 32: " + poolCensus);
            }

            // ---- B. asset gate: importer laws on every pill (idempotent) ----
            for (int i = 0; i < ResidentLabelRules.Count; i++)
            {
                string path = ResidentLabelRules.SpritePath(ids[i].plateIndex);
                Sprite sp = ForceSprite(path);
                Chk(sp != null, "pill sprite failed to load: " + path);
                Chk(Math.Abs(sp.rect.width - ResidentLabelRules.PxW) < 0.5f
                    && Math.Abs(sp.rect.height - ResidentLabelRules.PxH) < 0.5f,
                    "rect != 80x26 at slot " + i + ": " + sp.rect.width + "x" + sp.rect.height);
            }

            // ---- C. CityScene wiring: world-plate retirement + adapter ----
            Scene scene = EditorSceneManager.OpenScene(ScenePath, OpenSceneMode.Single);
            Chk(scene.isLoaded, "CityScene failed to open");
            int swept = SweepWorldTags();
            int sweptAgain = SweepWorldTags();   // idempotency
            Chk(sweptAgain == 0, "retirement sweep is not idempotent: " + sweptAgain);
            Chk(CountWorldTags() == 0, "world plates remain after the sweep: " + CountWorldTags());
            EnsureLabelsAdapter();
            bool saved = EditorSceneManager.SaveScene(scene);
            Chk(saved, "scene save failed");

            Scene reopened = EditorSceneManager.OpenScene(ScenePath, OpenSceneMode.Single);
            Chk(CountWorldTags() == 0, "world plates must never persist (r179 retirement): " + CountWorldTags());
            GameObject adapterGo = GameObject.Find(ResidentLabelsUI.GoName);
            Chk(adapterGo != null, "CityLabelsUI adapter GO lost on disk");
            ResidentLabelsUI adapter = adapterGo != null
                ? adapterGo.GetComponent<ResidentLabelsUI>() : null;
            Chk(adapter != null, "ResidentLabelsUI component unresolved on disk");
            Chk(GameObject.Find(ResidentLabelRules.CanvasName) == null,
                "runtime-only canvas persisted into the scene (r16 law)");
            // neighbor regressions
            int folkKept = CountRootPrefix(ResidentRules.NamePrefix);
            Chk(folkKept == ResidentRules.Count, "r99 residents lost after our save: " + folkKept);
            int shadowKept = CountRootPrefix(ResidentRules.ShadowNamePrefix);
            Chk(shadowKept == ResidentRules.Count, "r87 shadows lost after our save: " + shadowKept);
            int robotsKept = 0;
            foreach (SpriteRenderer sr in UnityEngine.Object.FindObjectsOfType<SpriteRenderer>())
                if (sr.name.StartsWith(RobotRules.NamePrefix)) robotsKept++;
            Chk(robotsKept == 8, "r36 street robots lost after our save: " + robotsKept);
            int neonKept = 0;
            foreach (SpriteRenderer sr in UnityEngine.Object.FindObjectsOfType<SpriteRenderer>())
                if (sr.name.StartsWith(NeonRules.NamePrefix)) neonKept++;
            Chk(neonKept == NeonRules.Count, "r35+r38 neon signs lost after our save: " + neonKept);
            GameObject ambGo = GameObject.Find("CityAmbient");
            CityAmbient amb = ambGo != null ? ambGo.GetComponent<CityAmbient>() : null;
            Chk(amb != null, "CityAmbient lost after save");
            Chk(amb.skylineFar != null && amb.skylineNear != null, "r34 skyline sprites lost after save");
            CityAmbientAudio bed = amb.GetComponent<CityAmbientAudio>();
            Chk(bed != null && bed.noiseBed != null && bed.noiseBed.length > 0f, "r31 bed clip lost after save");
            Chk(UnityEngine.Object.FindObjectsOfType<CityInterior>().Length >= 1, "CityInterior lost after save");
            Chk(UnityEngine.Object.FindObjectsOfType<CityCameraRig>().Length >= 1, "CityCameraRig lost after save");
            GameObject camGo = GameObject.Find("CityCamera");
            Camera cam = camGo != null ? camGo.GetComponent<Camera>() : null;
            Chk(cam != null && cam.orthographic && Math.Abs(cam.orthographicSize - RigMath.L0Size) < 0.01f,
                "L0 camera broken after save");
            Chk(TileCount("Ground") > 0 && TileCount("Water") > 0 && TileCount("Roads") > 0
                && TileCount("CityQUANT") > 0, "tilemap layers emptied by our save");
            Chk(GameObject.Find("SkylineFar") == null && GameObject.Find("AmbientTint") == null,
                "runtime-only visuals persisted into the scene");

            // camera cross-check at the L1 street framing: the pure ScreenPos
            // law vs Camera.WorldToScreenPoint on the live camera (RT 1920x1080)
            {
                RenderTexture rt = new RenderTexture(1920, 1080, 24, RenderTextureFormat.ARGB32);
                cam.targetTexture = rt;
                cam.orthographicSize = RigMath.L1Size;
                Vector2 camPos = new Vector2(0f, -10f);
                cam.transform.position = new Vector3(camPos.x, camPos.y, cam.transform.position.z);
                int cross = 0;
                for (int i = 0; i < ResidentLabelRules.Count; i++)
                {
                    Vector2 head = ResidentLabelRules.HeadWorld(i);
                    Vector2 pure = ResidentLabelRules.ScreenPos(head, camPos, RigMath.L1Size,
                        RigMath.Aspect, cam.pixelWidth, cam.pixelHeight);
                    Vector3 eng = cam.WorldToScreenPoint(new Vector3(head.x, head.y, 0f));
                    Chk(Math.Abs(pure.x - eng.x) < 0.5f && Math.Abs(pure.y - eng.y) < 0.5f,
                        "pure projection != engine projection at slot " + i + ": "
                        + pure.x + "," + pure.y + " vs " + eng.x + "," + eng.y);
                    cross++;
                }
                // real L1 budget re-derivation: the six nearest fitting seats
                Vector2[] anchors = new Vector2[ResidentLabelRules.Count];
                bool[] active = new bool[ResidentLabelRules.Count];
                List<int> fitting = new List<int>();
                for (int i = 0; i < ResidentLabelRules.Count; i++)
                {
                    active[i] = true;
                    Vector2 head = ResidentLabelRules.HeadWorld(i);
                    anchors[i] = ResidentLabelRules.Anchor(ResidentLabelRules.ScreenPos(head, camPos,
                        RigMath.L1Size, RigMath.Aspect, 1920f, 1080f));
                    if (ResidentLabelRules.FitsScreen(anchors[i], 1920f, 1080f)) fitting.Add(i);
                }
                fitting.Sort(delegate (int x, int y)
                {
                    float dx = Dist2(anchors[x], 960f, 540f), dy = Dist2(anchors[y], 960f, 540f);
                    int c = dx.CompareTo(dy);
                    return c != 0 ? c : x.CompareTo(y);
                });
                int expectLen = Math.Min(fitting.Count, ResidentLabelRules.MaxOnScreen);
                List<int> expected = fitting.GetRange(0, expectLen);
                int[] picks = ResidentLabelRules.PickBudgeted(anchors, active, 1920f, 1080f);
                Chk(picks.Length == expected.Count, "real-framing budget count: "
                    + picks.Length + " vs " + expected.Count);
                for (int k = 0; k < picks.Length; k++)
                    Chk(picks[k] == expected[k], "real-framing pick drift at rank " + k
                        + ": " + picks[k] + " vs " + expected[k]);
                cam.targetTexture = null;
                rt.Release();
                UnityEngine.Object.DestroyImmediate(rt);
                cam.orthographicSize = RigMath.L0Size;
                Chk(cross == 32, "cross-check must cover all seats: " + cross);
            }

            // ---- D. street-tier record shots (zero-floating-plate evidence) ----
            Vector3 camPosSaved = cam.transform.position;
            float camSizeSaved = cam.orthographicSize;
            amb.EnsureVisuals();
            cam.orthographicSize = RigMath.L1Size;
            cam.transform.position = new Vector3(0f, -10f, camPosSaved.z);
            amb.ApplyAmbient(AmbientTier.Day);
            Shot(cam, "m1-r179-labels-l1-south-day.png");
            amb.ApplyAmbient(AmbientTier.Dusk);
            Shot(cam, "m1-r179-labels-l1-south-dusk.png");
            amb.ApplyAmbient(AmbientTier.Night);
            Shot(cam, "m1-r179-labels-l1-south-night.png");
            amb.ApplyAmbient(AmbientTier.Day);
            cam.transform.position = new Vector3(0f, 10f, camPosSaved.z);
            Shot(cam, "m1-r179-labels-l1-north-day.png");
            cam.orthographicSize = camSizeSaved;
            cam.transform.position = camPosSaved;
            amb.ApplyAmbient(AmbientTier.Day);

            // release the pool census textures (r23 owned-lifetime law)
            foreach (Sprite s in loaded)
            {
                if (s != null && s.texture != null) UnityEngine.Object.DestroyImmediate(s.texture);
                if (s != null) UnityEngine.Object.DestroyImmediate(s);
            }

            return "asserts=" + asserts
                + " canvas=80x26 budget=6 tier_threshold=14.5"
                + " identity=32coupled plateIndex_unique labels_pool=" + poolCensus + "/32"
                + " scene(saved=" + saved + ",world_tags_swept=" + swept + ",world_tags=0,adapter=persisted,"
                + "neighbors_ok folk32 shadow32 robots8 neon" + NeonRules.Count + ")"
                + " projection=camera_cross32 budget_real=6_nearest"
                + " shots=4";
        }

        static string ReloadProve()
        {
            Scene scene = EditorSceneManager.OpenScene(ScenePath, OpenSceneMode.Single);
            if (!scene.isLoaded) throw new InvalidOperationException("CityScene failed to load");
            Chk(CountWorldTags() == 0, "world plates resurrected across restart: " + CountWorldTags());
            ResidentIdentityEntry[] ids = ResidentIdentity.Load();
            Chk(ids != null && ids.Length == ResidentLabelRules.Count,
                "identity substrate lost after restart (orphan-face law)");
            GameObject adapterGo = GameObject.Find(ResidentLabelsUI.GoName);
            Chk(adapterGo != null && adapterGo.GetComponent<ResidentLabelsUI>() != null,
                "ResidentLabelsUI lost across restart");
            Chk(GameObject.Find(ResidentLabelRules.CanvasName) == null,
                "runtime-only canvas persisted across restart");
            // importer spot check across the restart (three pills)
            string[] spot = { ResidentLabelRules.SpritePath(0), ResidentLabelRules.SpritePath(8),
                             ResidentLabelRules.SpritePath(31) };
            foreach (string p in spot)
            {
                TextureImporter imp = (TextureImporter)TextureImporter.GetAtPath(p);
                Chk(imp != null && imp.textureType == TextureImporterType.Sprite, "importer type lost: " + p);
                Chk(imp.filterMode == FilterMode.Point, "point filter lost: " + p);
                Chk(Math.Abs(imp.spritePixelsPerUnit - ResidentLabelRules.PPU) < 0.01f, "PPU100 lost: " + p);
                Chk(!imp.mipmapEnabled, "mips re-enabled: " + p);
            }
            int folkKept = CountRootPrefix(ResidentRules.NamePrefix);
            Chk(folkKept == ResidentRules.Count, "residents lost across restart: " + folkKept);
            int shadowKept = CountRootPrefix(ResidentRules.ShadowNamePrefix);
            Chk(shadowKept == ResidentRules.Count, "shadows lost across restart: " + shadowKept);
            int robotsKept = 0;
            foreach (SpriteRenderer sr in UnityEngine.Object.FindObjectsOfType<SpriteRenderer>())
                if (sr.name.StartsWith(RobotRules.NamePrefix)) robotsKept++;
            Chk(robotsKept == 8, "street robots lost across restart: " + robotsKept);
            int neonKept = 0;
            foreach (SpriteRenderer sr in UnityEngine.Object.FindObjectsOfType<SpriteRenderer>())
                if (sr.name.StartsWith(NeonRules.NamePrefix)) neonKept++;
            Chk(neonKept == NeonRules.Count, "neon signs lost across restart: " + neonKept);
            GameObject ambGo = GameObject.Find("CityAmbient");
            CityAmbient amb = ambGo != null ? ambGo.GetComponent<CityAmbient>() : null;
            Chk(amb != null && amb.skylineFar != null && amb.skylineNear != null, "r34 skyline lost after restart");
            Chk(UnityEngine.Object.FindObjectsOfType<CityInterior>().Length >= 1, "CityInterior unresolved after restart");
            Chk(UnityEngine.Object.FindObjectsOfType<CityCameraRig>().Length >= 1, "CityCameraRig unresolved after restart");
            Chk(UnityEngine.Object.FindObjectsOfType<CityAmbientAudio>().Length >= 1, "CityAmbientAudio unresolved after restart");
            GameObject behGo = GameObject.Find(CityStreetBehavior.GoName);
            Chk(behGo != null && behGo.GetComponent<CityStreetBehavior>() != null,
                "CityStreetBehavior lost across restart");
            GameObject camGo = GameObject.Find("CityCamera");
            Camera cam = camGo != null ? camGo.GetComponent<Camera>() : null;
            Chk(cam != null && Math.Abs(cam.orthographicSize - RigMath.L0Size) < 0.01f, "L0 camera broken after restart");
            return "reload_gate=OK world_tags=0/0 adapter=resolved canvas_absent=true"
                + " folk=32/32 shadows=32/32 robots=8/8 neon=" + NeonRules.Count + "/" + NeonRules.Count
                + " identity=32 importers=sprite+point+ppu100+nemip"
                + " neighbors=5 cam_L0=" + (cam != null ? cam.orthographicSize.ToString("F1") : "?");
        }

        static float Dist2(Vector2 p, float cx, float cy)
        {
            return (p.x - cx) * (p.x - cx) + (p.y - cy) * (p.y - cy);
        }

        // destroy every root-level NameTag* GO (the r179 world-plate
        // retirement); returns how many it destroyed
        static int SweepWorldTags()
        {
            List<GameObject> doomed = new List<GameObject>();
            foreach (Transform t in UnityEngine.Object.FindObjectsOfType<Transform>())
                if (t.parent == null && t.name.StartsWith(ResidentTagRules.NamePrefix))
                    doomed.Add(t.gameObject);
            for (int i = 0; i < doomed.Count; i++) UnityEngine.Object.DestroyImmediate(doomed[i]);
            return doomed.Count;
        }

        static int CountWorldTags()
        {
            int c = 0;
            foreach (Transform t in UnityEngine.Object.FindObjectsOfType<Transform>())
                if (t.parent == null && t.name.StartsWith(ResidentTagRules.NamePrefix)) c++;
            foreach (SpriteRenderer sr in UnityEngine.Object.FindObjectsOfType<SpriteRenderer>())
                if (sr.name.StartsWith(ResidentTagRules.NamePrefix))
                    throw new InvalidOperationException("a NameTag SpriteRenderer survives the retirement: " + sr.name);
            return c;
        }

        static int CountRootPrefix(string prefix)
        {
            int c = 0;
            foreach (Transform t in UnityEngine.Object.FindObjectsOfType<Transform>())
                if (t.parent == null && t.name.StartsWith(prefix)) c++;
            return c;
        }

        // persisted adapter root (CityStreetBehavior precedent): idempotent,
        // zero serialized fields, the canvas itself stays runtime-only
        static void EnsureLabelsAdapter()
        {
            GameObject go = GameObject.Find(ResidentLabelsUI.GoName);
            if (go == null)
            {
                go = new GameObject(ResidentLabelsUI.GoName);
                go.AddComponent<ResidentLabelsUI>();
                return;
            }
            if (go.GetComponent<ResidentLabelsUI>() == null) go.AddComponent<ResidentLabelsUI>();
        }

        static int TileCount(string layerName)
        {
            GameObject go = GameObject.Find(layerName);
            Tilemap tm = go != null ? go.GetComponent<Tilemap>() : null;
            if (tm == null) return 0;
            int c = 0;
            foreach (Vector3Int p in tm.cellBounds.allPositionsWithin)
                if (tm.GetTile(p) != null) c++;
            return c;
        }

        // forces Sprite + Single + Point + PPU100 + no mips (idempotent). A null
        // importer (pill not yet imported) retries once after an explicit
        // AssetDatabase.Refresh - fail-loud after that.
        static Sprite ForceSprite(string path)
        {
            TextureImporter imp = (TextureImporter)TextureImporter.GetAtPath(path);
            if (imp == null)
            {
                AssetDatabase.Refresh();
                imp = (TextureImporter)TextureImporter.GetAtPath(path);
            }
            if (imp == null) throw new InvalidOperationException("importer missing after refresh: " + path);
            if (imp.textureType != TextureImporterType.Sprite || imp.spriteImportMode != SpriteImportMode.Single
                || imp.filterMode != FilterMode.Point || imp.mipmapEnabled
                || Math.Abs(imp.spritePixelsPerUnit - ResidentLabelRules.PPU) > 0.01f)
            {
                imp.textureType = TextureImporterType.Sprite;
                imp.spriteImportMode = SpriteImportMode.Single;
                imp.filterMode = FilterMode.Point;
                imp.mipmapEnabled = false;
                imp.textureCompression = TextureImporterCompression.Uncompressed;
                imp.npotScale = TextureImporterNPOTScale.None;
                imp.alphaIsTransparency = true;
                imp.spritePixelsPerUnit = ResidentLabelRules.PPU;
                imp.SaveAndReimport();
            }
            if (imp.textureType != TextureImporterType.Sprite || imp.filterMode != FilterMode.Point
                || Math.Abs(imp.spritePixelsPerUnit - ResidentLabelRules.PPU) > 0.01f)
                throw new InvalidOperationException("importer fix did not stick: " + path);
            return AssetDatabase.LoadAssetAtPath<Sprite>(path);
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
            UnityEngine.Object.DestroyImmediate(tex);
            return null;
        }
    }
}
