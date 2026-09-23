// FluxVerse P-28 last wiring face (r37): batch proof for the street-resident layer
// (residents-crowd pack, OGA-BY 3.0 CraftPix). Sentinel pattern (r36 style):
//   pass 1: logs/resident.run        -> FluxVerse.ResidentProof.BatchRun   -> logs/resident.done
//   pass 2: logs/resident-reload.run -> FluxVerse.ResidentProof.ReloadGate -> logs/resident-reload.done
// Sections:
//  A pure-core gates (ResidentRules, headless): 12-entry manifest, paths under the
//    pack frames/, 12 DISTINCT frame files (one person per mount - r35 clone-row
//    law), exact 2u world size (48px @ PPU24 = P-17 32x32 class), every resident
//    fully inside the L0 view AND the tint band, pairwise spacing >= 2.2u,
//    >= 2.0u from every mounted robot, outside every neon-sign rect expanded by
//    the resident half-extent (1.0u) + 0.4u margin.
//  B asset gate: the 12 consumed frames forced to Sprite + Single + Point + PPU24
//    + no mips (the divisor law for this pack's 48px density; r34 PPU100 speck
//    disease enforced against, idempotent); rect == 48x48, bounds == 2x2 world.
//  C CityScene wiring: stale Res* sweep -> 12 GOs from the table (fresh
//    LoadAssetAtPath per r10 law) -> STAND gate re-derived from the live tilemaps
//    (feet cell = center.y - 1 must hold a Ground pavement or Roads tile - never
//    water/roof/air) -> idempotent second sweep+build -> save -> disk round-trip;
//    r36/r35/r34/r31 neighbor regressions (robots 8 persisted, neon 12 persisted,
//    skyline sprites, bed clip, interior, rig, L0 camera, non-empty tilemaps,
//    runtime-only law).
//  D render gates (real CityScene, dusk anchor + night): per-resident window delta
//    vs a residents-hidden baseline (robots stay visible in BOTH renders = clean
//    attribution), dusk visibility for every resident, night presence under the
//    tint, night luminance < dusk (atmosphere owns the built city; residents are
//    scenery, not light sources).
//  E pass 2: everything survives an editor restart (persisted scene objects +
//    importer settings + exactly 12, zero duplicates).
// Fail-loud: any broken assumption throws into the .done report. ASCII only. No 3D.
using System;
using System.IO;
using UnityEngine;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine.SceneManagement;
using UnityEngine.Tilemaps;

namespace FluxVerse
{
    public static class ResidentProof
    {
        static string ProjectRoot { get { return Path.GetDirectoryName(Application.dataPath); } }
        static string RepoRoot { get { return Path.GetDirectoryName(ProjectRoot); } }
        static string RunPath { get { return Path.Combine(RepoRoot, "logs", "resident.run"); } }
        static string DonePath { get { return Path.Combine(RepoRoot, "logs", "resident.done"); } }
        static string ReloadRunPath { get { return Path.Combine(RepoRoot, "logs", "resident-reload.run"); } }
        static string ReloadDonePath { get { return Path.Combine(RepoRoot, "logs", "resident-reload.done"); } }
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
            // ---- A. pure-core gates on the manifest ----
            Chk(ResidentRules.Count == 12, "manifest must hold 12 residents");
            Chk(ResidentRules.Order == 7, "street layer order must be 7 (signs 6 < street < tint 8)");
            Chk(Math.Abs(ResidentRules.WorldW(0) - 2f) < 1e-5f
                && Math.Abs(ResidentRules.WorldH(0) - 2f) < 1e-5f,
                "48px/PPU24 must be exactly 2x2u (P-17 32x32 class)");
            for (int i = 0; i < ResidentRules.Count; i++)
            {
                ResidentRules.Person p = ResidentRules.At(i);
                Chk(p.name != null && p.name.StartsWith(ResidentRules.NamePrefix), "bad GO name at " + i);
                Chk(p.path.StartsWith("Assets/ArtPacks/residents-crowd/frames/"),
                    "resident path outside the pack frames: " + p.path);
                Chk(ResidentRules.InView(i, RigMath.L0Size * RigMath.Aspect, RigMath.L0Size),
                    "resident not fully inside the L0 view: " + p.name);
                Chk(ResidentRules.InTintBand(i), "resident escapes the tint band (r22 edge-band kin): " + p.name);
            }
            float minDist = float.MaxValue;
            for (int i = 0; i < ResidentRules.Count; i++)
                for (int j = i + 1; j < ResidentRules.Count; j++)
                {
                    float d = Vector2.Distance(ResidentRules.Pos(i), ResidentRules.Pos(j));
                    if (d < minDist) minDist = d;
                }
            Chk(minDist >= 2.2f, "two residents nearer than 2.2u: " + minDist.ToString("F3"));
            int unique = 0;
            for (int i = 0; i < ResidentRules.Count; i++)
            {
                bool seen = false;
                for (int j = 0; j < i; j++) if (ResidentRules.Path(j) == ResidentRules.Path(i)) { seen = true; break; }
                Chk(!seen, "clone row: frame reused at " + ResidentRules.Name(i) + " (r35 free-variety law)");
                if (!seen) unique++;
            }
            Chk(unique == 12, "expected 12 distinct frame files, got " + unique);
            // robot clearance: no resident may crowd a mounted street robot
            for (int i = 0; i < ResidentRules.Count; i++)
            {
                Vector2 rp = ResidentRules.Pos(i);
                for (int b = 0; b < RobotRules.Count; b++)
                {
                    float d = Vector2.Distance(rp, RobotRules.Pos(b));
                    Chk(d >= 2.0f, "resident " + ResidentRules.Name(i) + " crowds robot "
                        + RobotRules.Name(b) + ": " + d.ToString("F3"));
                }
            }
            // neon-sign clearance: no resident may sit inside a mounted sign rect
            // (expanded by the resident half-extent 1.0 + a 0.4u margin)
            for (int i = 0; i < ResidentRules.Count; i++)
            {
                Vector2 rp = ResidentRules.Pos(i);
                for (int s = 0; s < NeonRules.Count; s++)
                {
                    float hw = NeonRules.WorldW(s) / 2f + 1.4f;
                    float hh = NeonRules.WorldH(s) / 2f + 1.4f;
                    float dx = Mathf.Abs(rp.x - NeonRules.Pos(s).x);
                    float dy = Mathf.Abs(rp.y - NeonRules.Pos(s).y);
                    Chk(!(dx < hw && dy < hh), "resident " + ResidentRules.Name(i) + " clips mounted sign "
                        + NeonRules.Name(s));
                }
            }

            // ---- B. asset gate: importer laws on every consumed frame (idempotent) ----
            for (int i = 0; i < ResidentRules.Count; i++)
            {
                Sprite sp = ForceSprite(ResidentRules.Path(i));
                Chk(sp != null, "sprite failed to load: " + ResidentRules.Path(i));
                Chk(Math.Abs(sp.rect.width - ResidentRules.PxSide) < 0.5f
                    && Math.Abs(sp.rect.height - ResidentRules.PxSide) < 0.5f,
                    "rect != 48x48 at " + ResidentRules.Name(i) + ": " + sp.rect.width + "x" + sp.rect.height);
                Chk(Math.Abs(sp.bounds.size.x - 2f) < 0.01f && Math.Abs(sp.bounds.size.y - 2f) < 0.01f,
                    "natural bounds != 2x2u (PPU100 shrink disease) at " + ResidentRules.Name(i));
            }

            // ---- C. CityScene wiring: sweep -> build -> stand gate -> idempotent -> save ----
            Scene scene = EditorSceneManager.OpenScene(ScenePath, OpenSceneMode.Single);
            Chk(scene.isLoaded, "CityScene failed to open");
            BuildResidents();
            BuildResidents();   // idempotency: the second sweep+build must land on exactly 12
            Chk(CountResidents() == 12, "idempotent rebuild count != 12: " + CountResidents());
            // STAND gate, re-derived from the live tilemaps (never from comments):
            // the FEET cell (center.y - 1) must hold a Ground pavement or Roads tile.
            Tilemap ground = TilemapByName("Ground");
            Tilemap roads = TilemapByName("Roads");
            Chk(ground != null && roads != null, "Ground/Roads tilemaps missing");
            for (int i = 0; i < ResidentRules.Count; i++)
            {
                Vector2Int feet = ResidentRules.FeetCellOf(i);
                Vector3Int cell = new Vector3Int(feet.x, feet.y, 0);
                bool onGround = ground.GetTile(cell) != null;
                bool onRoad = roads.GetTile(cell) != null;
                Chk(onGround || onRoad, "resident " + ResidentRules.Name(i) + " floats off street/pavement at feet cell "
                    + cell + " (water/roof/air)");
            }
            bool saved = EditorSceneManager.SaveScene(scene);
            Chk(saved, "scene save failed");

            Scene reopened = EditorSceneManager.OpenScene(ScenePath, OpenSceneMode.Single);
            Chk(CountResidents() == 12, "persisted resident count != 12: " + CountResidents());
            for (int i = 0; i < ResidentRules.Count; i++)
            {
                GameObject go = GameObject.Find(ResidentRules.Name(i));
                Chk(go != null, "resident missing on disk: " + ResidentRules.Name(i));
                SpriteRenderer sr = go.GetComponent<SpriteRenderer>();
                Chk(sr != null && sr.sprite != null, "resident sprite lost on disk: " + ResidentRules.Name(i));
                Chk(sr.sortingOrder == ResidentRules.Order, "resident order lost: " + ResidentRules.Name(i));
                Vector2 p = ResidentRules.Pos(i);
                Chk(Math.Abs(go.transform.position.x - p.x) < 1e-4f
                    && Math.Abs(go.transform.position.y - p.y) < 1e-4f,
                    "resident position lost: " + ResidentRules.Name(i));
                Chk(Math.Abs(sr.transform.localScale.x - 1f) < 1e-5f, "resident scale != 1 (native law)");
            }
            // neighbor regressions (our save must not drop earlier serialized wiring)
            int robotsKept = 0;
            foreach (SpriteRenderer sr in UnityEngine.Object.FindObjectsOfType<SpriteRenderer>())
                if (sr.name.StartsWith(RobotRules.NamePrefix)) robotsKept++;
            Chk(robotsKept == 8, "r36 street robots lost after our save: " + robotsKept);
            int neonKept = 0;
            foreach (SpriteRenderer sr in UnityEngine.Object.FindObjectsOfType<SpriteRenderer>())
                if (sr.name.StartsWith(NeonRules.NamePrefix)) neonKept++;
            Chk(neonKept == 12, "r35 neon signs lost after our save: " + neonKept);
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

            // ---- D. render gates (dusk anchor, then night) ----
            amb.EnsureVisuals();
            amb.ApplyAmbient(AmbientTier.Dusk);
            SpriteRenderer[] folk = CollectResidentRenderers();
            Chk(folk.Length == 12, "renderer collection != 12");
            SetFolk(folk, false);
            Texture2D duskBase = Shot(cam, null);
            SetFolk(folk, true);
            Texture2D duskOn = Shot(cam, "m1-r37-residents-dusk.png");
            int duskTot = 0; int duskMin = int.MaxValue; string duskWorst = "";
            for (int i = 0; i < ResidentRules.Count; i++)
            {
                int n; float lum;
                WinDelta(duskOn, duskBase, cam, i, out n, out lum);
                duskTot += n;
                if (n < duskMin) { duskMin = n; duskWorst = ResidentRules.Name(i); }
            }
            Chk(duskTot >= 120, "dusk resident delta too sparse: " + duskTot + "px");
            Chk(duskMin >= 10, "dusk invisible resident " + duskWorst + ": " + duskMin + "px");

            amb.ApplyAmbient(AmbientTier.Night);
            SetFolk(folk, false);
            Texture2D nightBase = Shot(cam, null);
            SetFolk(folk, true);
            Texture2D nightOn = Shot(cam, "m1-r37-residents-night.png");
            int nightTot = 0; float nightLum = 0f; int nightMin = int.MaxValue; string nightWorst = "";
            for (int i = 0; i < ResidentRules.Count; i++)
            {
                int n; float lum;
                WinDelta(nightOn, nightBase, cam, i, out n, out lum);
                nightTot += n; nightLum += lum * n;
                if (n < nightMin) { nightMin = n; nightWorst = ResidentRules.Name(i); }
            }
            nightLum = nightTot > 0 ? nightLum / nightTot : 0f;
            float duskLumW = 0f;
            for (int i = 0; i < ResidentRules.Count; i++)
            {
                int n; float lum;
                WinDelta(duskOn, duskBase, cam, i, out n, out lum);
                duskLumW += lum * n;
            }
            float duskLum = duskTot > 0 ? duskLumW / duskTot : 0f;
            Chk(nightTot >= 60, "night resident delta too sparse: " + nightTot + "px");
            Chk(nightMin >= 6, "night invisible resident " + nightWorst + ": " + nightMin + "px");
            Chk(nightLum < duskLum, "night residents must sit under dusk (atmosphere law): "
                + nightLum.ToString("F3") + " vs " + duskLum.ToString("F3"));

            UnityEngine.Object.DestroyImmediate(duskBase); UnityEngine.Object.DestroyImmediate(duskOn);
            UnityEngine.Object.DestroyImmediate(nightBase); UnityEngine.Object.DestroyImmediate(nightOn);

            return "asserts=" + asserts
                + " table=12 unique_frames=" + unique
                + " scene(saved=" + saved + ",12 persisted,stand_gate=feet_street/pavement,robots8_kept,neon12_kept,neighbors_ok)"
                + " render(dusk_px=" + duskTot + " worst=" + duskWorst + ":" + duskMin
                + " night_px=" + nightTot + " worst=" + nightWorst + ":" + nightMin
                + " lum dusk=" + duskLum.ToString("F3") + " night=" + nightLum.ToString("F3") + ")"
                + " shots=2";
        }

        static string ReloadProve()
        {
            Scene scene = EditorSceneManager.OpenScene(ScenePath, OpenSceneMode.Single);
            if (!scene.isLoaded) throw new InvalidOperationException("CityScene failed to load");
            Chk(CountResidents() == 12, "resident count after editor restart != 12: " + CountResidents());
            for (int i = 0; i < ResidentRules.Count; i++)
            {
                GameObject go = GameObject.Find(ResidentRules.Name(i));
                Chk(go != null, "resident lost across sessions: " + ResidentRules.Name(i));
                SpriteRenderer sr = go != null ? go.GetComponent<SpriteRenderer>() : null;
                Chk(sr != null && sr.sprite != null, "resident sprite unresolved after restart: " + ResidentRules.Name(i));
                Chk(sr.sortingOrder == ResidentRules.Order, "resident order lost after restart: " + ResidentRules.Name(i));
            }
            int robotsKept = 0;
            foreach (SpriteRenderer sr in UnityEngine.Object.FindObjectsOfType<SpriteRenderer>())
                if (sr.name.StartsWith(RobotRules.NamePrefix)) robotsKept++;
            Chk(robotsKept == 8, "street robots lost across restart: " + robotsKept);
            int neonKept = 0;
            foreach (SpriteRenderer sr in UnityEngine.Object.FindObjectsOfType<SpriteRenderer>())
                if (sr.name.StartsWith(NeonRules.NamePrefix)) neonKept++;
            Chk(neonKept == 12, "neon signs lost across restart: " + neonKept);
            // importer spot check across the restart (three consumed frames)
            string[] spot = {
                "Assets/ArtPacks/residents-crowd/frames/resident_01_idle_f00.png",
                "Assets/ArtPacks/residents-crowd/frames/resident_06_idle_f01.png",
                "Assets/ArtPacks/residents-crowd/frames/resident_10_idle_f00.png" };
            foreach (string p in spot)
            {
                TextureImporter imp = (TextureImporter)TextureImporter.GetAtPath(p);
                Chk(imp != null && imp.textureType == TextureImporterType.Sprite, "importer type lost: " + p);
                Chk(imp.filterMode == FilterMode.Point, "point filter lost: " + p);
                Chk(Math.Abs(imp.spritePixelsPerUnit - ResidentRules.PPU) < 0.01f, "PPU24 lost: " + p);
                Chk(!imp.mipmapEnabled, "mips re-enabled: " + p);
            }
            GameObject ambGo = GameObject.Find("CityAmbient");
            CityAmbient amb = ambGo != null ? ambGo.GetComponent<CityAmbient>() : null;
            Chk(amb != null && amb.skylineFar != null && amb.skylineNear != null, "r34 skyline lost after restart");
            Chk(UnityEngine.Object.FindObjectsOfType<CityInterior>().Length >= 1, "CityInterior unresolved after restart");
            Chk(UnityEngine.Object.FindObjectsOfType<CityCameraRig>().Length >= 1, "CityCameraRig unresolved after restart");
            Chk(UnityEngine.Object.FindObjectsOfType<CityAmbientAudio>().Length >= 1, "CityAmbientAudio unresolved after restart");
            GameObject camGo = GameObject.Find("CityCamera");
            Camera cam = camGo != null ? camGo.GetComponent<Camera>() : null;
            Chk(cam != null && Math.Abs(cam.orthographicSize - RigMath.L0Size) < 0.01f, "L0 camera broken after restart");
            return "reload_gate=OK residents=12/12 persisted robots=8/8 neon=12/12 importers=sprite+point+ppu24+nemip"
                + " skyline=2/2 neighbors=4 cam_L0=" + (cam != null ? cam.orthographicSize.ToString("F1") : "?");
        }

        // sweep every root-level Res* GO, then build the 12 from the manifest
        // (fresh LoadAssetAtPath at every use = r10 fake-null law)
        static void BuildResidents()
        {
            foreach (Transform t in UnityEngine.Object.FindObjectsOfType<Transform>())
                if (t.parent == null && t.name.StartsWith(ResidentRules.NamePrefix))
                    UnityEngine.Object.DestroyImmediate(t.gameObject);
            for (int i = 0; i < ResidentRules.Count; i++)
            {
                GameObject go = new GameObject(ResidentRules.Name(i));
                Vector2 p = ResidentRules.Pos(i);
                go.transform.position = new Vector3(p.x, p.y, 0f);
                SpriteRenderer sr = go.AddComponent<SpriteRenderer>();
                sr.sprite = AssetDatabase.LoadAssetAtPath<Sprite>(ResidentRules.Path(i));
                if (sr.sprite == null)
                    throw new InvalidOperationException("resident sprite resolve failed: " + ResidentRules.Path(i));
                sr.sortingOrder = ResidentRules.Order;
            }
        }

        static int CountResidents()
        {
            int c = 0;
            foreach (SpriteRenderer sr in UnityEngine.Object.FindObjectsOfType<SpriteRenderer>())
                if (sr.name.StartsWith(ResidentRules.NamePrefix)) c++;
            return c;
        }

        static SpriteRenderer[] CollectResidentRenderers()
        {
            SpriteRenderer[] folk = new SpriteRenderer[ResidentRules.Count];
            for (int i = 0; i < ResidentRules.Count; i++)
            {
                GameObject go = GameObject.Find(ResidentRules.Name(i));
                if (go == null) throw new InvalidOperationException("resident GO missing for render gate: " + ResidentRules.Name(i));
                folk[i] = go.GetComponent<SpriteRenderer>();
            }
            return folk;
        }

        // toggle via cached references - GameObject.Find skips INACTIVE objects (r34 law)
        static void SetFolk(SpriteRenderer[] folk, bool on)
        {
            foreach (SpriteRenderer sr in folk) sr.gameObject.SetActive(on);
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

        // forces Sprite + Single + Point + PPU24 + no mips (idempotent). This pack's
        // divisor is 24 (48px -> exactly 2u, the P-17 32x32 world class); scale stays 1
        // = zero resampling. The r34 lesson stands: never trust the importer default.
        static Sprite ForceSprite(string path)
        {
            TextureImporter imp = (TextureImporter)TextureImporter.GetAtPath(path);
            if (imp == null) throw new InvalidOperationException("importer missing: " + path);
            if (imp.textureType != TextureImporterType.Sprite || imp.spriteImportMode != SpriteImportMode.Single
                || imp.filterMode != FilterMode.Point || imp.mipmapEnabled
                || Math.Abs(imp.spritePixelsPerUnit - ResidentRules.PPU) > 0.01f)
            {
                imp.textureType = TextureImporterType.Sprite;
                imp.spriteImportMode = SpriteImportMode.Single;
                imp.filterMode = FilterMode.Point;
                imp.mipmapEnabled = false;
                imp.spritePixelsPerUnit = ResidentRules.PPU;
                imp.SaveAndReimport();
            }
            if (imp.textureType != TextureImporterType.Sprite || imp.filterMode != FilterMode.Point
                || Math.Abs(imp.spritePixelsPerUnit - ResidentRules.PPU) > 0.01f)
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
            return tex;
        }

        // per-resident window metric: pixels in the resident rect (+0.4u margin) that
        // differ from the residents-hidden baseline. Only the residents change between
        // the two renders (robots visible in both) -> clean attribution. y=0 is the
        // image BOTTOM row (r13 ReadPixels law).
        static void WinDelta(Texture2D on, Texture2D off, Camera cam, int i, out int deltaCount, out float avgLum)
        {
            Vector2 c = ResidentRules.Pos(i);
            float hw = ResidentRules.WorldW(i) / 2f + 0.4f;
            float hh = ResidentRules.WorldH(i) / 2f + 0.4f;
            float halfH = cam.orthographicSize;
            float halfW = halfH * (1920f / 1080f);
            float cx = cam.transform.position.x, cy = cam.transform.position.y;
            int px0 = (int)(((c.x - hw - cx) / (2f * halfW) + 0.5f) * 1920f);
            int px1 = (int)(((c.x + hw - cx) / (2f * halfW) + 0.5f) * 1920f);
            int py0 = (int)(((c.y - hh - cy) / (2f * halfH) + 0.5f) * 1080f);
            int py1 = (int)(((c.y + hh - cy) / (2f * halfH) + 0.5f) * 1080f);
            px0 = Math.Max(0, px0); px1 = Math.Min(1919, px1);
            py0 = Math.Max(0, py0); py1 = Math.Min(1079, py1);
            double lum = 0; int n = 0;
            for (int y = py0; y <= py1; y += 2)
                for (int x = px0; x <= px1; x += 2)
                {
                    Color ca = on.GetPixel(x, y);
                    Color cb = off.GetPixel(x, y);
                    float d = Math.Abs(ca.r - cb.r) + Math.Abs(ca.g - cb.g) + Math.Abs(ca.b - cb.b);
                    if (d > 0.06f)
                    {
                        n++;
                        lum += (ca.r + ca.g + ca.b) / 3.0;
                    }
                }
            deltaCount = n;
            avgLum = n > 0 ? (float)(lum / n) : 0f;
        }
    }
}
