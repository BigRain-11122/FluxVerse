// FluxVerse P-28 remaining wiring face (r36): batch proof for the street-robot layer
// (tophat-robot pack, CC-BY 3.0 Nelson Yiap). Sentinel pattern (r35 style):
//   pass 1: logs/robot.run        -> FluxVerse.RobotProof.BatchRun   -> logs/robot.done
//   pass 2: logs/robot-reload.run -> FluxVerse.RobotProof.ReloadGate -> logs/robot-reload.done
// Sections:
//  A pure-core gates (RobotRules, headless): 8-entry manifest, paths under the pack
//    frames/, 8 DISTINCT frame files (no clone row), native 16x16 px, every robot
//    fully inside the L0 view AND the tint band, pairwise spacing, street-layer
//    order 7 between signs 6 and tint 8, neon-sign clearance (r35 mounted rects).
//  B asset gate: the 8 consumed frames forced to Sprite + Single + Point + PPU16 +
//    no mips (r34 importer-default-PPU100 law, idempotent); rect == 16x16, bounds
//    == 1x1 world units.
//  C CityScene wiring: stale Robot* sweep -> 8 GOs from the table (fresh
//    LoadAssetAtPath per r10 law) -> STAND gate re-derived from the live tilemaps
//    (Ground pavement or Roads cell under every robot - never water/roof/air) ->
//    idempotent second sweep+build -> save -> disk round-trip; r35/r34/r31
//    neighbor regressions (neon signs persisted per NeonRules.Count, skyline sprites, bed clip, interior,
//    rig, L0 camera, non-empty tilemaps, runtime-only law).
//  D render gates (real CityScene, dusk anchor + night): per-robot window delta vs
//    a robots-hidden baseline (clean attribution), dusk visibility for every robot,
//    night presence under the tint, night luminance < dusk (atmosphere owns the
//    built city; robots are scenery, not light sources - no never-die glow law).
//  E pass 2: everything survives an editor restart (persisted scene objects +
//    importer settings + exactly 8, zero duplicates).
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
    public static class RobotProof
    {
        static string ProjectRoot { get { return Path.GetDirectoryName(Application.dataPath); } }
        static string RepoRoot { get { return Path.GetDirectoryName(ProjectRoot); } }
        static string RunPath { get { return Path.Combine(RepoRoot, "logs", "robot.run"); } }
        static string DonePath { get { return Path.Combine(RepoRoot, "logs", "robot.done"); } }
        static string ReloadRunPath { get { return Path.Combine(RepoRoot, "logs", "robot-reload.run"); } }
        static string ReloadDonePath { get { return Path.Combine(RepoRoot, "logs", "robot-reload.done"); } }
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
            Chk(RobotRules.Count == 8, "manifest must hold 8 robots");
            Chk(RobotRules.Order == 7, "street layer order must be 7 (signs 6 < robots < tint 8)");
            Chk(RobotRules.Order > 6 && RobotRules.Order < 8, "order 7 not between signs 6 and tint 8");
            for (int i = 0; i < RobotRules.Count; i++)
            {
                RobotRules.Bot b = RobotRules.At(i);
                Chk(b.name != null && b.name.StartsWith(RobotRules.NamePrefix), "bad GO name at " + i);
                Chk(b.path.StartsWith("Assets/ArtPacks/tophat-robot/frames/"),
                    "robot path outside the pack frames: " + b.path);
                Chk(b.frame >= 0 && b.frame <= 15, "frame index out of sheet range at " + i);
                Chk(Math.Abs(RobotRules.WorldW(i) - 1f) < 1e-5f
                    && Math.Abs(RobotRules.WorldH(i) - 1f) < 1e-5f, "16px/PPU16 must be exactly 1x1u at " + i);
                Chk(RobotRules.InView(i, RigMath.L0Size * RigMath.Aspect, RigMath.L0Size),
                    "robot not fully inside the L0 view: " + b.name);
                Chk(RobotRules.InTintBand(i), "robot escapes the tint band (r22 edge-band kin): " + b.name);
            }
            float minDist = float.MaxValue;
            for (int i = 0; i < RobotRules.Count; i++)
                for (int j = i + 1; j < RobotRules.Count; j++)
                {
                    float d = Vector2.Distance(RobotRules.Pos(i), RobotRules.Pos(j));
                    if (d < minDist) minDist = d;
                }
            Chk(minDist >= 2.0f, "two robots nearer than 2u: " + minDist.ToString("F3"));
            int unique = 0;
            for (int i = 0; i < RobotRules.Count; i++)
            {
                bool seen = false;
                for (int j = 0; j < i; j++) if (RobotRules.Path(j) == RobotRules.Path(i)) { seen = true; break; }
                Chk(!seen, "clone row: frame reused at " + RobotRules.Name(i) + " (r35 free-variety law)");
                if (!seen) unique++;
            }
            Chk(unique == 8, "expected 8 distinct frame files, got " + unique);
            // neon-sign clearance: no robot may sit inside a mounted sign rect
            // (expanded by the robot half-extent 0.5 + a 0.4u margin)
            for (int i = 0; i < RobotRules.Count; i++)
            {
                Vector2 rp = RobotRules.Pos(i);
                for (int s = 0; s < NeonRules.Count; s++)
                {
                    float hw = NeonRules.WorldW(s) / 2f + 0.9f;
                    float hh = NeonRules.WorldH(s) / 2f + 0.9f;
                    float dx = Mathf.Abs(rp.x - NeonRules.Pos(s).x);
                    float dy = Mathf.Abs(rp.y - NeonRules.Pos(s).y);
                    Chk(!(dx < hw && dy < hh), "robot " + RobotRules.Name(i) + " clips mounted sign "
                        + NeonRules.Name(s));
                }
            }

            // ---- B. asset gate: importer laws on every consumed frame (idempotent) ----
            for (int i = 0; i < RobotRules.Count; i++)
            {
                Sprite sp = ForceSprite(RobotRules.Path(i));
                Chk(sp != null, "sprite failed to load: " + RobotRules.Path(i));
                Chk(Math.Abs(sp.rect.width - RobotRules.PxSide) < 0.5f
                    && Math.Abs(sp.rect.height - RobotRules.PxSide) < 0.5f,
                    "rect != 16x16 at " + RobotRules.Name(i) + ": " + sp.rect.width + "x" + sp.rect.height);
                Chk(Math.Abs(sp.bounds.size.x - 1f) < 0.01f && Math.Abs(sp.bounds.size.y - 1f) < 0.01f,
                    "natural bounds != 1x1u (PPU100 shrink disease) at " + RobotRules.Name(i));
            }

            // ---- C. CityScene wiring: sweep -> build -> stand gate -> idempotent -> save ----
            Scene scene = EditorSceneManager.OpenScene(ScenePath, OpenSceneMode.Single);
            Chk(scene.isLoaded, "CityScene failed to open");
            BuildRobots();
            BuildRobots();   // idempotency: the second sweep+build must land on exactly 8
            Chk(CountRobots() == 8, "idempotent rebuild count != 8: " + CountRobots());
            // STAND gate, re-derived from the live tilemaps (never from comments):
            // the cell under every robot must hold a Ground pavement or Roads tile.
            Tilemap ground = TilemapByName("Ground");
            Tilemap roads = TilemapByName("Roads");
            Chk(ground != null && roads != null, "Ground/Roads tilemaps missing");
            for (int i = 0; i < RobotRules.Count; i++)
            {
                Vector3 w = RobotRules.Pos(i);
                Vector3Int cell = ground.WorldToCell(w);
                bool onGround = ground.GetTile(cell) != null;
                bool onRoad = roads.GetTile(cell) != null;
                Chk(onGround || onRoad, "robot " + RobotRules.Name(i) + " floats off street/pavement at cell "
                    + cell + " (water/roof/air)");
            }
            bool saved = EditorSceneManager.SaveScene(scene);
            Chk(saved, "scene save failed");

            Scene reopened = EditorSceneManager.OpenScene(ScenePath, OpenSceneMode.Single);
            Chk(CountRobots() == 8, "persisted robot count != 8: " + CountRobots());
            for (int i = 0; i < RobotRules.Count; i++)
            {
                GameObject go = GameObject.Find(RobotRules.Name(i));
                Chk(go != null, "robot missing on disk: " + RobotRules.Name(i));
                SpriteRenderer sr = go.GetComponent<SpriteRenderer>();
                Chk(sr != null && sr.sprite != null, "robot sprite lost on disk: " + RobotRules.Name(i));
                Chk(sr.sortingOrder == RobotRules.Order, "robot order lost: " + RobotRules.Name(i));
                Vector2 p = RobotRules.Pos(i);
                Chk(Math.Abs(go.transform.position.x - p.x) < 1e-4f
                    && Math.Abs(go.transform.position.y - p.y) < 1e-4f,
                    "robot position lost: " + RobotRules.Name(i));
                Chk(Math.Abs(sr.transform.localScale.x - 1f) < 1e-5f, "robot scale != 1 (native law)");
            }
            // neighbor regressions (our save must not drop earlier serialized wiring)
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

            // ---- D. render gates (dusk anchor, then night) ----
            amb.EnsureVisuals();
            amb.ApplyAmbient(AmbientTier.Dusk);
            SpriteRenderer[] bots = CollectBotRenderers();
            Chk(bots.Length == 8, "renderer collection != 8");
            SetBots(bots, false);
            Texture2D duskBase = Shot(cam, null);
            SetBots(bots, true);
            Texture2D duskOn = Shot(cam, "m1-r36-robots-dusk.png");
            int duskTot = 0; int duskMin = int.MaxValue; string duskWorst = "";
            for (int i = 0; i < RobotRules.Count; i++)
            {
                int n; float lum;
                WinDelta(duskOn, duskBase, cam, i, out n, out lum);
                duskTot += n;
                if (n < duskMin) { duskMin = n; duskWorst = RobotRules.Name(i); }
            }
            Chk(duskTot >= 60, "dusk robot delta too sparse: " + duskTot + "px");
            Chk(duskMin >= 8, "dusk invisible robot " + duskWorst + ": " + duskMin + "px");

            amb.ApplyAmbient(AmbientTier.Night);
            SetBots(bots, false);
            Texture2D nightBase = Shot(cam, null);
            SetBots(bots, true);
            Texture2D nightOn = Shot(cam, "m1-r36-robots-night.png");
            int nightTot = 0; float nightLum = 0f; int nightMin = int.MaxValue; string nightWorst = "";
            for (int i = 0; i < RobotRules.Count; i++)
            {
                int n; float lum;
                WinDelta(nightOn, nightBase, cam, i, out n, out lum);
                nightTot += n; nightLum += lum * n;
                if (n < nightMin) { nightMin = n; nightWorst = RobotRules.Name(i); }
            }
            nightLum = nightTot > 0 ? nightLum / nightTot : 0f;
            float duskLumW = 0f;
            for (int i = 0; i < RobotRules.Count; i++)
            {
                int n; float lum;
                WinDelta(duskOn, duskBase, cam, i, out n, out lum);
                duskLumW += lum * n;
            }
            float duskLum = duskTot > 0 ? duskLumW / duskTot : 0f;
            Chk(nightTot >= 20, "night robot delta too sparse: " + nightTot + "px");
            Chk(nightMin >= 3, "night invisible robot " + nightWorst + ": " + nightMin + "px");
            Chk(nightLum < duskLum, "night robots must sit under dusk (atmosphere law): "
                + nightLum.ToString("F3") + " vs " + duskLum.ToString("F3"));

            UnityEngine.Object.DestroyImmediate(duskBase); UnityEngine.Object.DestroyImmediate(duskOn);
            UnityEngine.Object.DestroyImmediate(nightBase); UnityEngine.Object.DestroyImmediate(nightOn);

            return "asserts=" + asserts
                + " table=8 unique_frames=" + unique
                + " scene(saved=" + saved + ",8 persisted,stand_gate=street/pavement,neon" + NeonRules.Count + "_kept,neighbors_ok)"
                + " render(dusk_px=" + duskTot + " worst=" + duskWorst + ":" + duskMin
                + " night_px=" + nightTot + " worst=" + nightWorst + ":" + nightMin
                + " lum dusk=" + duskLum.ToString("F3") + " night=" + nightLum.ToString("F3") + ")"
                + " shots=2";
        }

        static string ReloadProve()
        {
            Scene scene = EditorSceneManager.OpenScene(ScenePath, OpenSceneMode.Single);
            if (!scene.isLoaded) throw new InvalidOperationException("CityScene failed to load");
            Chk(CountRobots() == 8, "robot count after editor restart != 8: " + CountRobots());
            for (int i = 0; i < RobotRules.Count; i++)
            {
                GameObject go = GameObject.Find(RobotRules.Name(i));
                Chk(go != null, "robot lost across sessions: " + RobotRules.Name(i));
                SpriteRenderer sr = go != null ? go.GetComponent<SpriteRenderer>() : null;
                Chk(sr != null && sr.sprite != null, "robot sprite unresolved after restart: " + RobotRules.Name(i));
                Chk(sr.sortingOrder == RobotRules.Order, "robot order lost after restart: " + RobotRules.Name(i));
            }
            int neonKept = 0;
            foreach (SpriteRenderer sr in UnityEngine.Object.FindObjectsOfType<SpriteRenderer>())
                if (sr.name.StartsWith(NeonRules.NamePrefix)) neonKept++;
            Chk(neonKept == NeonRules.Count, "neon signs lost across restart: " + neonKept);
            // importer spot check across the restart (standing / together / stride)
            string[] spot = {
                "Assets/ArtPacks/tophat-robot/frames/robot_f00.png",
                "Assets/ArtPacks/tophat-robot/frames/robot_f05.png",
                "Assets/ArtPacks/tophat-robot/frames/robot_f12.png" };
            foreach (string p in spot)
            {
                TextureImporter imp = (TextureImporter)TextureImporter.GetAtPath(p);
                Chk(imp != null && imp.textureType == TextureImporterType.Sprite, "importer type lost: " + p);
                Chk(imp.filterMode == FilterMode.Point, "point filter lost: " + p);
                Chk(Math.Abs(imp.spritePixelsPerUnit - 16f) < 0.01f, "PPU16 lost: " + p);
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
            return "reload_gate=OK robots=8/8 persisted neon=" + NeonRules.Count + "/" + NeonRules.Count
                + " importers=sprite+point+ppu16+nemip"
                + " skyline=2/2 neighbors=4 cam_L0=" + (cam != null ? cam.orthographicSize.ToString("F1") : "?");
        }

        // sweep every root-level Robot* GO, then build the 8 from the manifest
        // (fresh LoadAssetAtPath at every use = r10 fake-null law)
        static void BuildRobots()
        {
            foreach (Transform t in UnityEngine.Object.FindObjectsOfType<Transform>())
                if (t.parent == null && t.name.StartsWith(RobotRules.NamePrefix))
                    UnityEngine.Object.DestroyImmediate(t.gameObject);
            for (int i = 0; i < RobotRules.Count; i++)
            {
                GameObject go = new GameObject(RobotRules.Name(i));
                Vector2 p = RobotRules.Pos(i);
                go.transform.position = new Vector3(p.x, p.y, 0f);
                SpriteRenderer sr = go.AddComponent<SpriteRenderer>();
                sr.sprite = AssetDatabase.LoadAssetAtPath<Sprite>(RobotRules.Path(i));
                if (sr.sprite == null)
                    throw new InvalidOperationException("robot sprite resolve failed: " + RobotRules.Path(i));
                sr.sortingOrder = RobotRules.Order;
            }
        }

        static int CountRobots()
        {
            int c = 0;
            foreach (SpriteRenderer sr in UnityEngine.Object.FindObjectsOfType<SpriteRenderer>())
                if (sr.name.StartsWith(RobotRules.NamePrefix)) c++;
            return c;
        }

        static SpriteRenderer[] CollectBotRenderers()
        {
            SpriteRenderer[] bots = new SpriteRenderer[RobotRules.Count];
            for (int i = 0; i < RobotRules.Count; i++)
            {
                GameObject go = GameObject.Find(RobotRules.Name(i));
                if (go == null) throw new InvalidOperationException("robot GO missing for render gate: " + RobotRules.Name(i));
                bots[i] = go.GetComponent<SpriteRenderer>();
            }
            return bots;
        }

        // toggle via cached references - GameObject.Find skips INACTIVE objects (r34 law)
        static void SetBots(SpriteRenderer[] bots, bool on)
        {
            foreach (SpriteRenderer sr in bots) sr.gameObject.SetActive(on);
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

        // forces Sprite + Single + Point + PPU16 + no mips (idempotent). The importer
        // default PPU is 100 = the r34 speck disease; the 16-PPU world law (r13) is
        // enforced here, never assumed.
        static Sprite ForceSprite(string path)
        {
            TextureImporter imp = (TextureImporter)TextureImporter.GetAtPath(path);
            if (imp == null) throw new InvalidOperationException("importer missing: " + path);
            if (imp.textureType != TextureImporterType.Sprite || imp.spriteImportMode != SpriteImportMode.Single
                || imp.filterMode != FilterMode.Point || imp.mipmapEnabled
                || Math.Abs(imp.spritePixelsPerUnit - 16f) > 0.01f)
            {
                imp.textureType = TextureImporterType.Sprite;
                imp.spriteImportMode = SpriteImportMode.Single;
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

        // per-robot window metric: pixels in the robot rect (+0.4u margin) that differ
        // from the robots-hidden baseline. Only the robots change between the two
        // renders -> clean attribution. y=0 is the image BOTTOM row (r13 ReadPixels law).
        static void WinDelta(Texture2D on, Texture2D off, Camera cam, int i, out int deltaCount, out float avgLum)
        {
            Vector2 c = RobotRules.Pos(i);
            float hw = RobotRules.WorldW(i) / 2f + 0.4f;
            float hh = RobotRules.WorldH(i) / 2f + 0.4f;
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
