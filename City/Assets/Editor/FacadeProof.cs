// FluxVerse r162 (P-38 gap 2, P-20260924-38 CEO research order 09-24 ~11:35):
// hi-bit landmark facade engine proof - OfficeProof/LabsProof family.
// Law source = Tools/city/facades-manifest.json (the r152 sandbox, 477
// assertions green - single geometry source) mirrored by FacadeRules.cs.
//
// pass 1: logs/facades.run         -> FluxVerse.FacadeProof.BatchRun    -> logs/facades.done
// pass 2: logs/facades-reload.run  -> FluxVerse.FacadeProof.ReloadGate  -> logs/facades-reload.done
//
// Gates:
//  A0  manifest mirror: 4 mounts x (id/asset/px/rect/accent) vs the table,
//      law.ppu scalar, order chain (facade 3 < rim 5 < signs 6), rect
//      equality vs NeonRules.Buildings[4/5/6] (ANNEX stays off-table - the
//      r159 A2 verdict) and vs southbank-manifest masses (bitwise).
//  A1  unlit-window disk census: every skin's near-white opaque px == 0
//      (min channel >= 150; the r152 A9 census re-run in-proof; bake gate
//      owns avg>80-accent-only, this owns the render-facing zero-leak face)
//      + tight px dims pin (pack drift = fail-loud).
//  A2  idempotent build x2 + GO gates (root level, sprite resolved, order 3,
//      pos == rect center, scale 1, natural size = px/PPU via sr.bounds).
//  A3  zero-overlap census vs every MOBILE/STANDING live source (residents
//      32 x body/shadow/plate, robots 8 x body/shadow, vehicles 8, eave
//      slots 2, anchors 4, offices 5, terrace 1, labs 12, north buildings
//      + brain) - signs/interior/window-light overlays are excluded BY
//      DESIGN (they ride orders 6/-0.5-z ABOVE the facades; NeonProof A2
//      owns sign mount legality).
//  B   save + reopen + persisted gates + neighbor regressions (the r104
//      law: our save must keep every earlier serialized wiring).
//  C   render diff census (r148 rim law): facades on/off at day/dusk/night
//      L0 + L1-south street view; per-mount floor = 15% of the tight-rect
//      27px/u sample grid (min 60); r44 harmony (dusk must WARM the skins,
//      night under dusk); L1-south shows QUANT only (out-of-frame = exact 0).
//      Screenshots: m1-r162-facades-{day,dusk,night,l1-south}.png.
//
// The skins carry ZERO static lit windows (unlit law) - the lit rate belongs
// to the P-38(3) activity heat line (WindowLight, order 3 z -0.5 = above
// the facades; the tile-art window census vs the facade micro-grid is the
// registered r162 debt row, never silently absorbed). ASCII. No 3D.
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine;
using UnityEngine.SceneManagement;
using UnityEngine.Tilemaps;

namespace FluxVerse
{
    public static class FacadeProof
    {
        static string ProjectRoot { get { return Path.GetDirectoryName(Application.dataPath); } }
        static string RepoRoot { get { return Path.GetDirectoryName(ProjectRoot); } }
        static string RunPath { get { return Path.Combine(RepoRoot, "logs", "facades.run"); } }
        static string DonePath { get { return Path.Combine(RepoRoot, "logs", "facades.done"); } }
        static string ReloadRunPath { get { return Path.Combine(RepoRoot, "logs", "facades-reload.run"); } }
        static string ReloadDonePath { get { return Path.Combine(RepoRoot, "logs", "facades-reload.done"); } }
        static string ScenePath { get { return "Assets/Scenes/CityScene.unity"; } }
        static int asserts;

        // r104 zone anchors (OfficeProof canon family - point-containment law)
        static readonly Vector2[] AnchorCanon =
        {
            new Vector2(0.5f, 14f),      // BrainTower (tower-v2 visual center)
            new Vector2(-20.5f, -11f),   // Zone_GAME
            new Vector2(0.5f, -12f),     // Zone_QUANT
            new Vector2(22f, -11f),      // Zone_MEDIA
        };

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

        static bool Overlap(float ax0, float ay0, float ax1, float ay1, float bx0, float by0, float bx1, float by1)
        {
            return ax0 < bx1 && bx0 < ax1 && ay0 < by1 && by0 < ay1;
        }

        static bool ContainsPoint(float x0, float y0, float x1, float y1, float px, float py)
        {
            return x0 < px && px < x1 && y0 < py && py < y1;
        }

        // ---- manifest mirror helpers (LabsProof single-geometry-source law) ----
        static float[] ExtractFloatsAfter(string text, int from, string key, int count)
        {
            int k = text.IndexOf(key, from);
            if (k < 0) throw new InvalidOperationException("manifest key missing: " + key);
            int open = text.IndexOf('[', k);
            int close = text.IndexOf(']', open);
            string inner = text.Substring(open + 1, close - open - 1);
            string[] parts = inner.Split(',');
            if (parts.Length < count) throw new InvalidOperationException("manifest array too short: " + key);
            float[] r = new float[count];
            for (int i = 0; i < count; i++)
                r[i] = float.Parse(parts[i].Trim(), CultureInfo.InvariantCulture);
            return r;
        }

        static string ExtractStringAfter(string text, int from, string key)
        {
            int k = text.IndexOf(key, from);
            if (k < 0) throw new InvalidOperationException("manifest key missing: " + key);
            int open = text.IndexOf('"', k + key.Length);
            int close = text.IndexOf('"', open + 1);
            return text.Substring(open + 1, close - open - 1);
        }

        static float ExtractScalarAfter(string text, int from, string key)
        {
            int k = text.IndexOf(key, from);
            if (k < 0) throw new InvalidOperationException("manifest key missing: " + key);
            int colon = text.IndexOf(':', k);
            // a scalar can sit at the END of its object (no trailing comma) -
            // stop at the first terminator, never scan past the closing brace
            int end = colon + 1;
            while (end < text.Length)
            {
                char ch = text[end];
                if (ch == ',' || ch == '}' || ch == '\n' || ch == '\r') break;
                end++;
            }
            string s = text.Substring(colon + 1, end - colon - 1).Trim();
            return float.Parse(s, CultureInfo.InvariantCulture);
        }

        static string Prove()
        {
            // open the city scene FIRST: the builds below modify the live scene
            // (the r138 OfficeProof order law - OpenScene after build = discard)
            Scene scene = EditorSceneManager.OpenScene(ScenePath, OpenSceneMode.Single);
            if (!scene.isLoaded) throw new InvalidOperationException("CityScene failed to load");

            // ---- A0. table == manifest (the r152 sandbox is the single geometry source) ----
            string manifest = File.ReadAllText(Path.Combine(RepoRoot, "Tools", "city", "facades-manifest.json"));
            Chk(manifest.Length > 1000, "facades-manifest.json unreadable");
            Chk(FacadeRules.Count == 4, "manifest must hold 4 mounts");
            Chk(FacadeRules.Order == 3 && FacadeRules.Order == LabsRules.PodOrder
                && FacadeRules.Order == OfficeRules.Order,
                "facade must ride the building family order 3 (LabsRules.PodOrder law)");
            Chk(FacadeRules.Order < RimLightRules.SortOrder && RimLightRules.SortOrder < NeonRules.Order,
                "order chain broken (facade 3 < rim 5 < signs 6)");
            Chk(FacadeRules.PPU == 24f, "PPU24 divisor law (r151 office-towers importer row)");
            float mppu = ExtractScalarAfter(manifest, 0, "\"ppu\"");
            Chk(Mathf.Abs(mppu - FacadeRules.PPU) < 1e-4f, "manifest law.ppu != PPU24");
            for (int i = 0; i < FacadeRules.Count; i++)
            {
                string id = FacadeRules.Name(i);
                int at = manifest.IndexOf("\"id\": \"" + id + "\"");
                Chk(at >= 0, "manifest mount missing: " + id);
                float[] r = ExtractFloatsAfter(manifest, at, "\"rect\"", 4);
                Chk(Mathf.Abs(r[0] - FacadeRules.X0(i)) < 1e-3f && Mathf.Abs(r[1] - FacadeRules.Y0(i)) < 1e-3f
                    && Mathf.Abs(r[2] - FacadeRules.X1(i)) < 1e-3f && Mathf.Abs(r[3] - FacadeRules.Y1(i)) < 1e-3f,
                    "manifest rect != table at " + id);
                float[] px = ExtractFloatsAfter(manifest, at, "\"px\"", 2);
                Chk((int)px[0] == FacadeRules.PxW(i) && (int)px[1] == FacadeRules.PxH(i),
                    "manifest px != table at " + id);
                string asset = ExtractStringAfter(manifest, at, "\"asset\"");
                Chk(asset == FacadeRules.Path(i), "manifest asset != table at " + id);
                Chk(FacadeRules.Path(i).StartsWith("Assets/ArtPacks/office-towers/"),
                    "facade path outside the office-towers pack: " + FacadeRules.Path(i));
                string accent = ExtractStringAfter(manifest, at, "\"accent\"");
                Chk(accent == FacadeRules.Accent(i), "manifest accent != table at " + id);
                // world size == px / PPU24 (natural size law)
                Chk(Mathf.Abs(FacadeRules.WorldW(i) - FacadeRules.PxW(i) / FacadeRules.PPU) < 5e-4f
                    && Mathf.Abs(FacadeRules.WorldH(i) - FacadeRules.PxH(i) / FacadeRules.PPU) < 5e-4f,
                    "world size != px/PPU24 at " + id);
                Chk(FacadeRules.InFrame(i), "mount escapes the static L0 frame: " + id);
                Chk(FacadeRules.InTintBand(i), "mount escapes the tint band (no sticker edge law): " + id);
                // rect equality vs the live mount-host table (NeonRules.Buildings)
                int host = FacadeRules.HostBuildingIndex(i);
                if (host >= 0)
                {
                    NeonRules.Building b = NeonRules.BuildingAt(host);
                    Chk(Mathf.Abs(FacadeRules.X0(i) - b.x0) < 1e-5f
                        && Mathf.Abs(FacadeRules.Y0(i) - b.y0) < 1e-5f
                        && Mathf.Abs(FacadeRules.X1(i) - b.x1) < 1e-5f
                        && Mathf.Abs(FacadeRules.Y1(i) - b.y1) < 1e-5f,
                        "mount rect != live host building " + host + " at " + id);
                }
                else
                {
                    // ANNEX off-table verdict (r159 A2): no Buildings row may match
                    for (int b = 0; b < 8; b++)
                    {
                        NeonRules.Building bb = NeonRules.BuildingAt(b);
                        Chk(!(Mathf.Abs(FacadeRules.X0(i) - bb.x0) < 1e-5f
                              && Mathf.Abs(FacadeRules.Y0(i) - bb.y0) < 1e-5f
                              && Mathf.Abs(FacadeRules.X1(i) - bb.x1) < 1e-5f
                              && Mathf.Abs(FacadeRules.Y1(i) - bb.y1) < 1e-5f),
                            "ANNEX rect must stay off the NeonRules.Buildings table (r159 A2): row " + b);
                    }
                }
            }
            // rect equality vs southbank masses (bitwise, zero migration by construction)
            string south = File.ReadAllText(Path.Combine(RepoRoot, "Tools", "city", "southbank-manifest.json"));
            Chk(south.Length > 1000, "southbank-manifest.json unreadable");
            for (int i = 0; i < FacadeRules.Count; i++)
            {
                int at = south.IndexOf("\"id\": \"" + FacadeRules.SouthbankId(i) + "\"");
                Chk(at >= 0, "southbank mass missing: " + FacadeRules.SouthbankId(i));
                float[] w = ExtractFloatsAfter(south, at, "\"world\"", 4);
                Chk(Mathf.Abs(w[0] - FacadeRules.X0(i)) < 1e-5f && Mathf.Abs(w[1] - FacadeRules.Y0(i)) < 1e-5f
                    && Mathf.Abs(w[2] - FacadeRules.X1(i)) < 1e-5f && Mathf.Abs(w[3] - FacadeRules.Y1(i)) < 1e-5f,
                    "mount rect != southbank mass at " + FacadeRules.SouthbankId(i));
            }

            // ---- A1. unlit-window disk census + tight px pin (r152 A9 re-run) ----
            for (int i = 0; i < FacadeRules.Count; i++)
            {
                string abs = Path.Combine(ProjectRoot, FacadeRules.Path(i).Replace('/', Path.DirectorySeparatorChar));
                Texture2D t = LoadPng(abs);
                Chk(t != null, "facade skin unreadable: " + FacadeRules.Name(i));
                if (t == null) continue;
                Chk(t.width == FacadeRules.PxW(i) && t.height == FacadeRules.PxH(i),
                    "skin dims drift (pack edit?): " + FacadeRules.Name(i)
                    + " " + t.width + "x" + t.height);
                int nearWhite = 0;
                for (int y = 0; y < t.height; y++)
                    for (int x = 0; x < t.width; x++)
                    {
                        Color c = t.GetPixel(x, y);
                        if (c.a > 0.5f)
                        {
                            float m = Mathf.Min(c.r, Mathf.Min(c.g, c.b));
                            if (m >= 150f / 255f) nearWhite++;
                        }
                    }
                Chk(nearWhite == 0, "unlit-window law breach at " + FacadeRules.Name(i)
                    + ": near-white opaque px=" + nearWhite + " (min-channel >= 150)");
                UnityEngine.Object.DestroyImmediate(t);
            }

            // ---- A2. idempotent build + GO gates ----
            int q0 = TileCount("CityQUANT"), g0 = TileCount("CityGAME"), m0 = TileCount("CityMEDIA");
            Chk(q0 == 40 && g0 == 49 && m0 == 54, "south city tile counts off canon pre-build: "
                + q0 + "/" + g0 + "/" + m0);
            BuildFacades();
            BuildFacades();   // idempotency: the second sweep+build must land on exactly Count
            Chk(CountFacades() == FacadeRules.Count, "idempotent rebuild count != table: " + CountFacades());
            for (int i = 0; i < FacadeRules.Count; i++)
            {
                GameObject go = GameObject.Find(FacadeRules.Name(i));
                Chk(go != null, "facade GO missing pre-save: " + FacadeRules.Name(i));
                SpriteRenderer sr = go.GetComponent<SpriteRenderer>();
                Chk(sr != null && sr.sprite != null, "facade sprite unresolved pre-save: " + FacadeRules.Name(i));
                Chk(sr.sortingOrder == FacadeRules.Order, "facade order lost: " + FacadeRules.Name(i));
                Vector2 p = FacadeRules.Pos(i);
                Chk(Mathf.Abs(go.transform.position.x - p.x) < 1e-4f
                    && Mathf.Abs(go.transform.position.y - p.y) < 1e-4f,
                    "facade GO pos != rect center: " + FacadeRules.Name(i));
                Chk(Mathf.Abs(go.transform.localScale.x - 1f) < 1e-5f
                    && Mathf.Abs(go.transform.localScale.y - 1f) < 1e-5f,
                    "facade scale != 1 (natural size law): " + FacadeRules.Name(i));
                Chk(Mathf.Abs(sr.bounds.size.x - FacadeRules.WorldW(i)) < 5e-4f
                    && Mathf.Abs(sr.bounds.size.y - FacadeRules.WorldH(i)) < 5e-4f,
                    "facade natural size != px/PPU24: " + FacadeRules.Name(i) + " "
                    + sr.bounds.size.ToString("F3"));
                Chk(Mathf.Abs(sr.sprite.rect.width - FacadeRules.PxW(i)) < 0.5f
                    && Mathf.Abs(sr.sprite.rect.height - FacadeRules.PxH(i)) < 0.5f,
                    "facade sprite px drift: " + FacadeRules.Name(i));
            }

            // ---- A3. zero-overlap census vs mobile/standing live sources ----
            // own-zone anchor allowance: QUANT tower center = Zone_QUANT (canon
            // slot 2), MEDIA block = Zone_MEDIA (slot 3); GAME/ANNEX hold none
            for (int i = 0; i < FacadeRules.Count; i++)
            {
                int allowedAnchor = -1;
                if (FacadeRules.Name(i) == "FacadeQUANT") allowedAnchor = 2;
                if (FacadeRules.Name(i) == "FacadeMEDIA") allowedAnchor = 3;
                CensusMobile(FacadeRules.X0(i), FacadeRules.Y0(i), FacadeRules.X1(i), FacadeRules.Y1(i),
                    FacadeRules.Name(i), allowedAnchor);
            }

            // ---- B. save + reopen + persisted gates + neighbor regressions ----
            bool saved = EditorSceneManager.SaveScene(scene);
            Chk(saved, "scene save failed");

            Scene reopened = EditorSceneManager.OpenScene(ScenePath, OpenSceneMode.Single);
            Chk(CountFacades() == FacadeRules.Count, "persisted facade count != table: " + CountFacades());
            int q1 = TileCount("CityQUANT"), g1 = TileCount("CityGAME"), m1 = TileCount("CityMEDIA");
            Chk(q1 == q0 && g1 == g0 && m1 == m0, "no-tilemap-delta law breached by our save: "
                + q1 + "/" + g1 + "/" + m1);
            for (int i = 0; i < FacadeRules.Count; i++)
            {
                GameObject go = GameObject.Find(FacadeRules.Name(i));
                Chk(go != null, "facade missing on disk: " + FacadeRules.Name(i));
                SpriteRenderer sr = go != null ? go.GetComponent<SpriteRenderer>() : null;
                Chk(sr != null && sr.sprite != null, "facade sprite lost on disk: " + FacadeRules.Name(i));
                Chk(sr.sortingOrder == FacadeRules.Order, "facade order lost on disk: " + FacadeRules.Name(i));
                Vector2 p = FacadeRules.Pos(i);
                Chk(Mathf.Abs(go.transform.position.x - p.x) < 1e-4f
                    && Mathf.Abs(go.transform.position.y - p.y) < 1e-4f,
                    "facade position lost on disk: " + FacadeRules.Name(i));
                Chk(Mathf.Abs(sr.sprite.rect.width - FacadeRules.PxW(i)) < 0.5f
                    && Mathf.Abs(sr.sprite.rect.height - FacadeRules.PxH(i)) < 0.5f,
                    "persisted facade sprite rect drift: " + FacadeRules.Name(i));
            }
            int neonKept = 0, robotKept = 0, resKept = 0, tagKept = 0, vehKept = 0, labKept = 0, offKept = 0, terKept = 0;
            foreach (SpriteRenderer sr in UnityEngine.Object.FindObjectsOfType<SpriteRenderer>())
            {
                if (sr.name.StartsWith(NeonRules.NamePrefix)) neonKept++;
                if (sr.name.StartsWith(RobotRules.NamePrefix)) robotKept++;
                if (sr.name.StartsWith(VehicleRules.NamePrefix)) vehKept++;
                if (sr.name.StartsWith("NameTag")) tagKept++;
                if (sr.name.StartsWith(OfficeRules.NamePrefix)) offKept++;
                if (sr.name.StartsWith(OfficeRules.GroundPrefix)) terKept++;
                if (sr.name.StartsWith(LabsRules.PipeNamePrefix) || sr.name.StartsWith(LabsRules.PodNamePrefix)) labKept++;
            }
            foreach (Transform t in UnityEngine.Object.FindObjectsOfType<Transform>())
                if (t.parent == null && t.name.StartsWith(ResidentRules.NamePrefix)
                    && t.name.Length == 6) resKept++;
            Chk(neonKept == NeonRules.Count, "neon signs lost after our save: " + neonKept);
            Chk(robotKept == RobotRules.Count, "robots lost after our save: " + robotKept);
            Chk(resKept == ResidentRules.Count, "r99 residents lost after our save: " + resKept);
            Chk(tagKept == 0, "world nameplates must stay retired after our save (r179 S5b): " + tagKept);
            Chk(vehKept == VehicleRules.Count, "r93 vehicles lost after our save: " + vehKept);
            Chk(offKept == OfficeRules.Count, "offices lost after our save: " + offKept);
            Chk(terKept == OfficeRules.GroundCount, "terrace lost after our save: " + terKept);
            Chk(labKept == LabsRules.Count, "r142 labs lost after our save: " + labKept);
            GameObject ambGo = GameObject.Find("CityAmbient");
            CityAmbient amb = ambGo != null ? ambGo.GetComponent<CityAmbient>() : null;
            Chk(amb != null, "CityAmbient lost after save");
            Chk(amb.skylineFar != null && amb.skylineNear != null, "r34 skyline sprites lost after save");
            CityAmbientAudio bed = amb.GetComponent<CityAmbientAudio>();
            Chk(bed != null && bed.noiseBed != null && bed.noiseBed.length > 0f, "r31 bed clip lost after save");
            Chk(UnityEngine.Object.FindObjectsOfType<CityInterior>().Length >= 1, "CityInterior lost after save");
            Chk(UnityEngine.Object.FindObjectsOfType<CityCameraRig>().Length >= 1, "CityCameraRig lost after save");
            Chk(UnityEngine.Object.FindObjectsOfType<CityEventRouter>().Length >= 1, "CityEventRouter lost after save");
            Chk(UnityEngine.Object.FindObjectsOfType<CityBubbles>().Length == 1, "r42 bubbles adapter lost after save");
            Chk(UnityEngine.Object.FindObjectsOfType<CityResidentCard>().Length == 1, "r43 card adapter lost after save");
            Chk(UnityEngine.Object.FindObjectsOfType<CityWindowLight>().Length == 1, "r160 windowlight adapter lost after save");
            Chk(UnityEngine.Object.FindObjectsOfType<CityWaterFx>().Length == 1, "r155 waterfx adapter lost after save");
            Chk(UnityEngine.Object.FindObjectsOfType<CityLightFx>().Length == 1, "r158 lightfx adapter lost after save");
            Chk(UnityEngine.Object.FindObjectsOfType<CityStreetBehavior>().Length == 1, "r124 street-behavior adapter lost after save");
            GameObject camGo = GameObject.Find("CityCamera");
            Camera cam = camGo != null ? camGo.GetComponent<Camera>() : null;
            Chk(cam != null && cam.orthographic && Math.Abs(cam.orthographicSize - RigMath.L0Size) < 0.01f,
                "L0 camera broken after save");
            Chk(TileCount("Ground") > 0 && TileCount("Water") > 0 && TileCount("Roads") > 0,
                "base tilemaps emptied by our save");
            Chk(CountPrefix("BarkBubble") == 0, "BarkBubble persisted (runtime-only law)");
            Chk(CountPrefix("IdentCard") == 0, "IdentCard persisted (runtime-only law)");
            Chk(GameObject.Find("SkylineFar") == null && GameObject.Find("AmbientTint") == null,
                "runtime-only visuals persisted into the scene");

            // ---- C. render gates: day/dusk/night L0 + L1-south street view ----
            amb.EnsureVisuals();
            amb.ApplyWeather("clear", 0f, 0);
            amb.StepWeather(0.1f);
            GameObject[] fcdGos = new GameObject[FacadeRules.Count];
            for (int i = 0; i < FacadeRules.Count; i++)
            {
                fcdGos[i] = GameObject.Find(FacadeRules.Name(i));
                Chk(fcdGos[i] != null, "facade GO missing for render gate: " + FacadeRules.Name(i));
            }
            float dayLum = 0f, duskLum = 0f, nightLum = 0f;
            float dayWarm = 0f, duskWarm = 0f;
            int dayTot = 0, duskTot = 0, nightTot = 0;
            int dayMin = int.MaxValue, duskMin = int.MaxValue, nightMin = int.MaxValue;
            string dayWorst = "", duskWorst = "", nightWorst = "";
            amb.ApplyAmbient(AmbientTier.Day);
            SetFacades(fcdGos, false);
            Texture2D dayBase = Shot(cam, null);
            SetFacades(fcdGos, true);
            Texture2D dayOn = Shot(cam, "m1-r162-facades-day.png");
            for (int i = 0; i < FacadeRules.Count; i++)
            {
                int n; float lum, warm;
                FacadeWinDelta(dayOn, dayBase, cam, i, out n, out lum, out warm);
                dayTot += n; dayLum += lum * n; dayWarm += warm * n;
                Chk(n >= FacadeFloor(i), "facade invisible in the day L0 frame at "
                    + FacadeRules.Name(i) + ": " + n + "px (floor " + FacadeFloor(i) + ")");
                if (n < dayMin) { dayMin = n; dayWorst = FacadeRules.Name(i); }
            }
            dayLum = dayTot > 0 ? dayLum / dayTot : 0f;
            dayWarm = dayTot > 0 ? dayWarm / dayTot : 0f;
            amb.ApplyAmbient(AmbientTier.Dusk);
            SetFacades(fcdGos, false);
            Texture2D duskBase = Shot(cam, null);
            SetFacades(fcdGos, true);
            Texture2D duskOn = Shot(cam, "m1-r162-facades-dusk.png");
            for (int i = 0; i < FacadeRules.Count; i++)
            {
                int n; float lum, warm;
                FacadeWinDelta(duskOn, duskBase, cam, i, out n, out lum, out warm);
                duskTot += n; duskLum += lum * n; duskWarm += warm * n;
                Chk(n >= FacadeFloor(i), "facade invisible at dusk at "
                    + FacadeRules.Name(i) + ": " + n + "px (floor " + FacadeFloor(i) + ")");
                if (n < duskMin) { duskMin = n; duskWorst = FacadeRules.Name(i); }
            }
            duskLum = duskTot > 0 ? duskLum / duskTot : 0f;
            duskWarm = duskTot > 0 ? duskWarm / duskTot : 0f;
            amb.ApplyAmbient(AmbientTier.Night);
            SetFacades(fcdGos, false);
            Texture2D nightBase = Shot(cam, null);
            SetFacades(fcdGos, true);
            Texture2D nightOn = Shot(cam, "m1-r162-facades-night.png");
            for (int i = 0; i < FacadeRules.Count; i++)
            {
                int n; float lum, warm;
                FacadeWinDelta(nightOn, nightBase, cam, i, out n, out lum, out warm);
                nightTot += n; nightLum += lum * n;
                Chk(n >= FacadeFloor(i), "facade invisible at night at "
                    + FacadeRules.Name(i) + ": " + n + "px (floor " + FacadeFloor(i) + ")");
                if (n < nightMin) { nightMin = n; nightWorst = FacadeRules.Name(i); }
            }
            nightLum = nightTot > 0 ? nightLum / nightTot : 0f;
            // r44 harmony laws (the skins must sit UNDER the ambient wheel like
            // the city: dusk warms them, night sits them under dusk - never raw)
            Chk(duskWarm > dayWarm + 0.02f, "harmony law: the dusk overlay must warm the facades (r-b shift "
                + dayWarm.ToString("F3") + " -> " + duskWarm.ToString("F3") + ")");
            Chk(nightLum < duskLum, "night facades must sit under dusk (atmosphere law): "
                + nightLum.ToString("F3") + " vs " + duskLum.ToString("F3"));

            // L1-south street view (r160 D4 camera law (0.5,-5)): QUANT is the
            // only mount in frame; GAME/ANNEX/MEDIA must read exact-zero deltas
            Vector3 origPos = cam.transform.position;
            float origSize = cam.orthographicSize;
            cam.orthographicSize = RigMath.L1Size;
            cam.transform.position = new Vector3(0.5f, -5f, origPos.z);
            SetFacades(fcdGos, false);
            Texture2D l1Base = Shot(cam, null);
            SetFacades(fcdGos, true);
            Texture2D l1On = Shot(cam, "m1-r162-facades-l1-south.png");
            int l1Quant = 0;
            for (int i = 0; i < FacadeRules.Count; i++)
            {
                int n; float lum, warm;
                FacadeWinDelta(l1On, l1Base, cam, i, out n, out lum, out warm);
                if (FacadeRules.Name(i) == "FacadeQUANT")
                {
                    l1Quant = n;
                    Chk(n >= FacadeL1Floor(i), "QUANT facade invisible in the L1-south street view: "
                        + n + "px (floor " + FacadeL1Floor(i) + ")");
                }
                else
                {
                    Chk(n == 0, "out-of-frame law at L1-south: " + FacadeRules.Name(i) + " moved " + n + "px");
                }
            }
            // restore the camera (scene was saved in section B; no save after renders)
            cam.orthographicSize = origSize;
            cam.transform.position = origPos;

            UnityEngine.Object.DestroyImmediate(dayBase); UnityEngine.Object.DestroyImmediate(dayOn);
            UnityEngine.Object.DestroyImmediate(duskBase); UnityEngine.Object.DestroyImmediate(duskOn);
            UnityEngine.Object.DestroyImmediate(nightBase); UnityEngine.Object.DestroyImmediate(nightOn);
            UnityEngine.Object.DestroyImmediate(l1Base); UnityEngine.Object.DestroyImmediate(l1On);

            return "asserts=" + asserts
                + " table=" + FacadeRules.Count
                + " census(south_tiles=" + q0 + "/" + g0 + "/" + m0 + ")"
                + " scene(saved=" + saved + ",4 persisted,neon" + neonKept
                + "_robot" + robotKept + "_res" + resKept + "_tag" + tagKept + "_veh" + vehKept
                + "_off" + offKept + "_ter" + terKept + "_lab" + labKept + ")"
                + " render(day_px=" + dayTot + " worst=" + dayWorst + ":" + dayMin
                + " dusk_px=" + duskTot + " worst=" + duskWorst + ":" + duskMin
                + " night_px=" + nightTot + " worst=" + nightWorst + ":" + nightMin
                + " lum day=" + dayLum.ToString("F3") + " dusk=" + duskLum.ToString("F3")
                + " night=" + nightLum.ToString("F3")
                + " warm day=" + dayWarm.ToString("F3") + " dusk=" + duskWarm.ToString("F3")
                + " l1south_quant=" + l1Quant + ")"
                + " unlit(near_white=0x4)"
                + " shots=4";
        }

        static string ReloadProve()
        {
            Scene scene = EditorSceneManager.OpenScene(ScenePath, OpenSceneMode.Single);
            if (!scene.isLoaded) throw new InvalidOperationException("CityScene failed to load");
            Chk(CountFacades() == FacadeRules.Count, "facade count after editor restart != table: " + CountFacades());
            for (int i = 0; i < FacadeRules.Count; i++)
            {
                GameObject go = GameObject.Find(FacadeRules.Name(i));
                Chk(go != null, "facade lost across sessions: " + FacadeRules.Name(i));
                SpriteRenderer sr = go != null ? go.GetComponent<SpriteRenderer>() : null;
                Chk(sr != null && sr.sprite != null, "facade sprite unresolved after restart: " + FacadeRules.Name(i));
                Chk(sr.sortingOrder == FacadeRules.Order, "facade order lost after restart: " + FacadeRules.Name(i));
                Vector2 p = FacadeRules.Pos(i);
                Chk(Mathf.Abs(go.transform.position.x - p.x) < 1e-4f
                    && Mathf.Abs(go.transform.position.y - p.y) < 1e-4f,
                    "facade position lost across restart: " + FacadeRules.Name(i));
            }
            int q = TileCount("CityQUANT"), g = TileCount("CityGAME"), m = TileCount("CityMEDIA");
            Chk(q == 40 && g == 49 && m == 54, "south city tile counts off canon after restart: " + q + "/" + g + "/" + m);
            for (int i = 0; i < FacadeRules.Count; i++)
            {
                TextureImporter imp = (TextureImporter)TextureImporter.GetAtPath(FacadeRules.Path(i));
                Chk(imp != null && imp.textureType == TextureImporterType.Sprite, "importer type lost: " + FacadeRules.Path(i));
                Chk(imp.filterMode == FilterMode.Point, "point filter lost: " + FacadeRules.Path(i));
                Chk(Mathf.Abs(imp.spritePixelsPerUnit - 24f) < 0.01f, "PPU24 lost: " + FacadeRules.Path(i));
                Chk(!imp.mipmapEnabled, "mips re-enabled: " + FacadeRules.Path(i));
            }
            int neonKept = 0;
            foreach (SpriteRenderer sr in UnityEngine.Object.FindObjectsOfType<SpriteRenderer>())
                if (sr.name.StartsWith(NeonRules.NamePrefix)) neonKept++;
            Chk(neonKept == NeonRules.Count, "neon signs lost across restart: " + neonKept);
            GameObject ambGo = GameObject.Find("CityAmbient");
            CityAmbient amb = ambGo != null ? ambGo.GetComponent<CityAmbient>() : null;
            Chk(amb != null && amb.skylineFar != null && amb.skylineNear != null, "r34 skyline lost after restart");
            Chk(UnityEngine.Object.FindObjectsOfType<CityInterior>().Length >= 1, "CityInterior unresolved after restart");
            Chk(UnityEngine.Object.FindObjectsOfType<CityCameraRig>().Length >= 1, "CityCameraRig unresolved after restart");
            Chk(UnityEngine.Object.FindObjectsOfType<CityBubbles>().Length == 1, "r42 bubbles adapter unresolved after restart");
            Chk(UnityEngine.Object.FindObjectsOfType<CityResidentCard>().Length == 1, "r43 card adapter unresolved after restart");
            Chk(UnityEngine.Object.FindObjectsOfType<CityWindowLight>().Length == 1, "r160 windowlight adapter unresolved after restart");
            GameObject camGo = GameObject.Find("CityCamera");
            Camera cam = camGo != null ? camGo.GetComponent<Camera>() : null;
            Chk(cam != null && Math.Abs(cam.orthographicSize - RigMath.L0Size) < 0.01f, "L0 camera broken after restart");
            return "reload_gate=OK facades=" + CountFacades() + "/" + FacadeRules.Count
                + " persisted south_tiles=" + q + "/" + g + "/" + m
                + " importers=sprite+point+ppu24+nemip neon=" + neonKept + "/" + NeonRules.Count
                + " neighbors=6 cam_L0=" + (cam != null ? cam.orthographicSize.ToString("F1") : "?");
        }

        // sweep every root-level Facade* GO, then build the 4 from the table
        // (fresh LoadAssetAtPath at every use = r10 fake-null law)
        static void BuildFacades()
        {
            foreach (Transform t in UnityEngine.Object.FindObjectsOfType<Transform>())
                if (t.parent == null && t.name.StartsWith(FacadeRules.NamePrefix))
                    UnityEngine.Object.DestroyImmediate(t.gameObject);
            for (int i = 0; i < FacadeRules.Count; i++)
            {
                GameObject go = new GameObject(FacadeRules.Name(i));
                Vector2 p = FacadeRules.Pos(i);
                go.transform.position = new Vector3(p.x, p.y, 0f);
                SpriteRenderer sr = go.AddComponent<SpriteRenderer>();
                sr.sprite = AssetDatabase.LoadAssetAtPath<Sprite>(FacadeRules.Path(i));
                if (sr.sprite == null)
                    throw new InvalidOperationException("facade sprite resolve failed: " + FacadeRules.Path(i));
                sr.sortingOrder = FacadeRules.Order;
            }
        }

        static int CountFacades()
        {
            int c = 0;
            foreach (SpriteRenderer sr in UnityEngine.Object.FindObjectsOfType<SpriteRenderer>())
                if (sr.name.StartsWith(FacadeRules.NamePrefix)) c++;
            return c;
        }

        static void SetFacades(GameObject[] gos, bool on)
        {
            foreach (GameObject go in gos) if (go != null) go.SetActive(on);
        }

        // one facade rect vs every MOBILE/STANDING live source. Signs (order 6),
        // interior hit rects and window-light overlays are excluded BY DESIGN:
        // they ride above the facades (order/z law) and their mount legality is
        // owned by NeonProof A2 / InteriorRouter tables. allowedAnchor: the one
        // zone anchor that lives INSIDE its own tower by design (QUANT tower
        // center = Zone_QUANT, MEDIA block = Zone_MEDIA; the r103 anchor canon) -
        // a tower overlay containing its own zone marker is the identity law,
        // FOREIGN anchors stay point-free (the OfficeProof swallow law).
        static void CensusMobile(float x0, float y0, float x1, float y1, string id, int allowedAnchor)
        {
            // north buildings + brain tower (rows 0-3, 7) - the south hosts 4/5/6
            // are covered by the A0 rect-equality law instead
            int[] northRows = { 0, 1, 2, 3, 7 };
            for (int n = 0; n < northRows.Length; n++)
            {
                NeonRules.Building b = NeonRules.BuildingAt(northRows[n]);
                Chk(!Overlap(x0, y0, x1, y1, b.x0, b.y0, b.x1, b.y1),
                    "facade " + id + " clips north building row " + northRows[n]);
            }
            for (int s = 0; s < ResidentRules.Count; s++)
            {
                Vector2 c = ResidentRules.Pos(s);
                float half = ResidentRules.WorldW(s) / 2f;
                Chk(!Overlap(x0, y0, x1, y1, c.x - half, c.y - half, c.x + half, c.y + half),
                    "facade " + id + " clips resident " + ResidentRules.Name(s));
                // plates/shadows are DELIBERATELY unchecked: the r152 sandbox A8
                // zero-migration census is ground-anchored BODIES only (seat
                // squares); the r104 street furniture (floating nameplates, feet
                // shadows) pre-dates the overlay and rides order 7 above it.
            }
            for (int r = 0; r < RobotRules.Count; r++)
            {
                Vector2 c = RobotRules.Pos(r);
                float half = RobotRules.WorldW(r) / 2f;
                Chk(!Overlap(x0, y0, x1, y1, c.x - half, c.y - half, c.x + half, c.y + half),
                    "facade " + id + " clips robot " + RobotRules.Name(r));
            }
            for (int v = 0; v < VehicleRules.Count; v++)
            {
                float vw = VehicleRules.WorldW(v) / 2f, vh = VehicleRules.WorldH(v);
                float vx = VehicleRules.Pos(v).x, gy = VehicleRules.FeetY(v);
                Chk(!Overlap(x0, y0, x1, y1, vx - vw, gy, vx + vw, gy + vh),
                    "facade " + id + " clips vehicle " + VehicleRules.Name(v));
            }
            for (int e = 0; e < StreetBehaviorRules.EaveCount; e++)
            {
                Vector2 ep = StreetBehaviorRules.EavePos(e);
                float eh = ResidentRules.WorldW(0) / 2f;   // seat-class body 1.333u (r123 law)
                Chk(!Overlap(x0, y0, x1, y1, ep.x - eh, ep.y - eh, ep.x + eh, ep.y + eh),
                    "facade " + id + " clips eave slot " + StreetBehaviorRules.Eave(e).id);
            }
            for (int a = 0; a < AnchorCanon.Length; a++)
                if (a != allowedAnchor)
                    Chk(!ContainsPoint(x0, y0, x1, y1, AnchorCanon[a].x, AnchorCanon[a].y),
                        "facade " + id + " swallows foreign anchor " + a);
            for (int o = 0; o < OfficeRules.Count; o++)
                Chk(!Overlap(x0, y0, x1, y1, OfficeRules.X0(o), OfficeRules.Y0(o),
                             OfficeRules.X1(o), OfficeRules.Y1(o)),
                    "facade " + id + " clips office " + OfficeRules.Name(o));
            for (int t = 0; t < OfficeRules.GroundCount; t++)
            {
                Vector2 tc = OfficeRules.GroundPos(t);
                float tw = OfficeRules.GroundWorldW(t) / 2f, th = OfficeRules.GroundWorldH(t) / 2f;
                Chk(!Overlap(x0, y0, x1, y1, tc.x - tw, tc.y - th, tc.x + tw, tc.y + th),
                    "facade " + id + " clips terrace " + OfficeRules.GroundName(t));
            }
            for (int l = 0; l < LabsRules.Count; l++)
                Chk(!Overlap(x0, y0, x1, y1, LabsRules.X0(l), LabsRules.Y0(l),
                             LabsRules.X1(l), LabsRules.Y1(l)),
                    "facade " + id + " clips lab mount " + LabsRules.Name(l));
        }

        static int CountPrefix(string prefix)
        {
            int c = 0;
            foreach (Transform t in UnityEngine.Object.FindObjectsOfType<Transform>())
                if (t.name.StartsWith(prefix)) c++;
            return c;
        }

        static Tilemap TilemapByName(string layerName)
        {
            GameObject go = GameObject.Find(layerName);
            return go != null ? go.GetComponent<Tilemap>() : null;
        }

        static int TileCount(string layerName)
        {
            Tilemap tm = TilemapByName(layerName);
            if (tm == null) return 0;
            int c = 0;
            foreach (Vector3Int p in tm.cellBounds.allPositionsWithin)
                if (tm.GetTile(p) != null) c++;
            return c;
        }

        static Texture2D LoadPng(string absPath)
        {
            byte[] bytes = File.ReadAllBytes(absPath);
            Texture2D t = new Texture2D(2, 2, TextureFormat.RGBA32, false);
            if (!t.LoadImage(bytes)) { UnityEngine.Object.DestroyImmediate(t); return null; }
            return t;
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

        // per-mount floor at the L0 grid (27 px/u): the facade must change at
        // least 15% of its tight-rect sample grid vs the tile art it supplants
        // (min 60 - the r152 477-assertion sandbox owns the geometry, this
        // owns the visible-face floor).
        static int FacadeFloor(int i)
        {
            int cols = (int)(FacadeRules.WorldW(i) * 27f / 3f);
            int rows = (int)(FacadeRules.WorldH(i) * 27f / 3f);
            return Math.Max(60, (int)(cols * rows * 0.15f));
        }

        // L1 street floor (60 px/u): 10% of the tight-rect sample grid
        static int FacadeL1Floor(int i)
        {
            int cols = (int)(FacadeRules.WorldW(i) * 60f / 3f);
            int rows = (int)(FacadeRules.WorldH(i) * 60f / 3f);
            return Math.Max(200, (int)(cols * rows * 0.10f));
        }

        // per-mount window metric (WinDelta family, r111 law): pixels in the
        // facade rect (+0.4u margin) that differ from the facades-hidden
        // baseline. y=0 is the image BOTTOM row (r13 law); windows are clipped
        // to the frame (out-of-frame = 0).
        static void FacadeWinDelta(Texture2D on, Texture2D off, Camera cam, int i,
            out int deltaCount, out float avgLum, out float avgWarm)
        {
            Vector2 c = FacadeRules.Pos(i);
            float hw = FacadeRules.WorldW(i) / 2f + 0.4f;
            float hh = FacadeRules.WorldH(i) / 2f + 0.4f;
            float halfH = cam.orthographicSize;
            float halfW = halfH * (1920f / 1080f);
            float cx = cam.transform.position.x, cy = cam.transform.position.y;
            int px0 = (int)(((c.x - hw - cx) / (2f * halfW) + 0.5f) * 1920f);
            int px1 = (int)(((c.x + hw - cx) / (2f * halfW) + 0.5f) * 1920f);
            int py0 = (int)(((c.y - hh - cy) / (2f * halfH) + 0.5f) * 1080f);
            int py1 = (int)(((c.y + hh - cy) / (2f * halfH) + 0.5f) * 1080f);
            px0 = Math.Max(0, px0); px1 = Math.Min(1919, px1);
            py0 = Math.Max(0, py0); py1 = Math.Min(1079, py1);
            double lum = 0, warm = 0; int n = 0;
            for (int y = py0; y <= py1; y += 3)
                for (int x = px0; x <= px1; x += 3)
                {
                    Color ca = on.GetPixel(x, y);
                    Color cb = off.GetPixel(x, y);
                    float d = Math.Abs(ca.r - cb.r) + Math.Abs(ca.g - cb.g) + Math.Abs(ca.b - cb.b);
                    if (d > 0.06f)
                    {
                        n++;
                        lum += (ca.r + ca.g + ca.b) / 3.0;
                        warm += ca.r - ca.b;
                    }
                }
            deltaCount = n;
            avgLum = n > 0 ? (float)(lum / n) : 0f;
            avgWarm = n > 0 ? (float)(warm / n) : 0f;
        }
    }
}
