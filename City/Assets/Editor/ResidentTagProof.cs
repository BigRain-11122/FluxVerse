// FluxVerse P-22(2) r40/r99: batch proof for the resident-nameplate layer.
// Sentinel pattern (r36 style):
//   pass 1: logs/tags.run         -> FluxVerse.ResidentTagProof.BatchRun   -> logs/tags.done
//   pass 2: logs/tags-reload.run  -> FluxVerse.ResidentTagProof.ReloadGate -> logs/tags-reload.done
// Sections:
//  A pure-core gates (headless): 32-tag manifest derived from ResidentRules,
//    OffsetY law (body top + 8px gap + half tag), b1 uniform 66x20 canvas
//    (2.75x0.833u - the same-row x-spacing law lives in the r99 seat
//    harness), every tag inside the L0 view AND the tint band, strict
//    rect-clearance vs every other tag, every mounted robot and neon sign.
//  A2 identity-coupling gates (orphan-face law): a plate may only exist over
//    a live roster identity - ResidentIdentity.Load() must yield 32 slots,
//    slot i go == ResidentRules.Name(i), district == law table, layer law
//    (narrative everywhere, anchor on slot 26), plateIndex 0..31 unique.
//  B asset gate: the 32 b1 plates (roster plateIndex -> atlas-row order, r97
//    bake law) forced to Sprite + Single + Point + PPU24 + no mips; rect
//    == 66x20, bounds == 2.75x0.833 world.
//  C CityScene wiring: stale NameTag* sweep -> 32 GOs from the rules (plate
//    sprite per roster) -> idempotent second sweep+build -> save ->
//    disk round-trip; neighbor regressions (residents 32 via root-Transform
//    count - the parts stack carries no Res-prefixed renderer, robots 8,
//    neon 18, skyline, bed clip, interior, rig, L0 camera, tilemaps,
//    runtime-only law).
//  D render gates (dusk anchor + night): per-tag window delta vs a
//    tags-hidden baseline (residents stay visible in both = clean
//    attribution), dusk visibility for every tag, night presence, night
//    luminance < dusk.
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
    public static class ResidentTagProof
    {
        static string ProjectRoot { get { return Path.GetDirectoryName(Application.dataPath); } }
        static string RepoRoot { get { return Path.GetDirectoryName(ProjectRoot); } }
        static string RunPath { get { return Path.Combine(RepoRoot, "logs", "tags.run"); } }
        static string DonePath { get { return Path.Combine(RepoRoot, "logs", "tags.done"); } }
        static string ReloadRunPath { get { return Path.Combine(RepoRoot, "logs", "tags-reload.run"); } }
        static string ReloadDonePath { get { return Path.Combine(RepoRoot, "logs", "tags-reload.done"); } }
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
            // ---- A. pure-core gates on the derived rules ----
            Chk(ResidentTagRules.Count == 32, "tag count must be 32");
            Chk(ResidentTagRules.Count == ResidentRules.Count, "tag count must mirror the manifest");
            Chk(ResidentTagRules.Order == 7, "tag layer order must be 7 (street)");
            Chk(Math.Abs(ResidentTagRules.PPU - 24f) < 1e-5f, "tag PPU must be 24 (r37 divisor law)");
            Chk(ResidentTagRules.PxW == 66 && ResidentTagRules.PxH == 20, "b1 canvas must be 66x20 (r97 bake)");
            Chk(Math.Abs(ResidentTagRules.GapFromHead - 8f / 24f) < 1e-5f,
                "GapFromHead must be 8px/24 (sec.8 nameplate-baseline law)");
            Chk(Math.Abs(ResidentTagRules.OffsetY - (ResidentRules.HalfSide + ResidentTagRules.GapFromHead
                    + ResidentTagRules.PxH / 48f)) < 1e-5f,
                "OffsetY law broken (body top + gap + half tag)");
            Chk(Math.Abs(ResidentTagRules.WorldW - 66f / 24f) < 1e-5f
                && Math.Abs(ResidentTagRules.WorldH - 20f / 24f) < 1e-5f,
                "world size must be 66x20 px @ PPU24 (2.75x0.833u)");
            Chk(ResidentTagRules.Name(0) == "NameTag00" && ResidentTagRules.Name(31) == "NameTag31",
                "GO naming law NameTag00..31");
            for (int i = 0; i < ResidentTagRules.Count; i++)
            {
                Vector2 t = ResidentTagRules.Pos(i);
                Vector2 r = ResidentRules.Pos(i);
                Chk(Math.Abs(t.x - r.x) < 1e-5f, "tag x must derive from resident x at " + i);
                Chk(Math.Abs(t.y - (r.y + ResidentTagRules.OffsetY)) < 1e-5f,
                    "tag y must derive from resident y + OffsetY at " + i);
                float bodyTop = r.y + ResidentRules.HalfSide;
                Chk(Math.Abs((t.y - ResidentTagRules.WorldH / 2f) - (bodyTop + ResidentTagRules.GapFromHead)) < 1e-4f,
                    "headroom gap law at " + i + " (tag must hover 8px above the 1.333u body top)");
                Chk(ResidentTagRules.InView(i, RigMath.L0Size * RigMath.Aspect, RigMath.L0Size),
                    "tag not fully inside the L0 view: " + ResidentTagRules.Name(i));
                Chk(ResidentTagRules.InTintBand(i), "tag escapes the tint band: " + ResidentTagRules.Name(i));
            }
            // tag-vs-tag strict overlap (2.75u-wide b1 plates: same-row seats
            // need >= 2.75u x-gap - enforced in the r99 seat harness, gated here)
            for (int i = 0; i < ResidentTagRules.Count; i++)
                for (int j = i + 1; j < ResidentTagRules.Count; j++)
                {
                    Vector2 a = ResidentTagRules.Pos(i), b = ResidentTagRules.Pos(j);
                    float dx = Mathf.Abs(a.x - b.x), dy = Mathf.Abs(a.y - b.y);
                    Chk(!(dx < ResidentTagRules.WorldW - 1e-4f && dy < ResidentTagRules.WorldH - 1e-4f),
                        "tags overlap: " + ResidentTagRules.Name(i) + " vs " + ResidentTagRules.Name(j)
                        + " (dx=" + dx.ToString("F3") + " dy=" + dy.ToString("F3") + ")");
                }
            // tag-vs-robot strict overlap (robots: 16px @ PPU16 = 1u, center pivot)
            for (int i = 0; i < ResidentTagRules.Count; i++)
            {
                Vector2 t = ResidentTagRules.Pos(i);
                for (int b = 0; b < RobotRules.Count; b++)
                {
                    Vector2 rp = RobotRules.Pos(b);
                    float dx = Mathf.Abs(t.x - rp.x), dy = Mathf.Abs(t.y - rp.y);
                    float sumW = ResidentTagRules.WorldW / 2f + 0.5f;
                    float sumH = ResidentTagRules.WorldH / 2f + 0.5f;
                    Chk(!(dx < sumW - 1e-4f && dy < sumH - 1e-4f),
                        "tag " + ResidentTagRules.Name(i) + " intersects robot " + RobotRules.Name(b)
                        + " (dx=" + dx.ToString("F3") + " dy=" + dy.ToString("F3") + ")");
                }
            }
            // tag-vs-neon strict overlap
            for (int i = 0; i < ResidentTagRules.Count; i++)
            {
                Vector2 t = ResidentTagRules.Pos(i);
                for (int s = 0; s < NeonRules.Count; s++)
                {
                    Vector2 sp = NeonRules.Pos(s);
                    float dx = Mathf.Abs(t.x - sp.x), dy = Mathf.Abs(t.y - sp.y);
                    float sumW = ResidentTagRules.WorldW / 2f + NeonRules.WorldW(s) / 2f;
                    float sumH = ResidentTagRules.WorldH / 2f + NeonRules.WorldH(s) / 2f;
                    Chk(!(dx < sumW - 1e-4f && dy < sumH - 1e-4f),
                        "tag " + ResidentTagRules.Name(i) + " intersects sign " + NeonRules.Name(s));
                }
            }

            // ---- A2. identity-coupling gates (orphan-face law) ----
            ResidentIdentityEntry[] ids = ResidentIdentity.Load(true);
            Chk(ids != null, "roster absent/broken - plates would be orphans (r98 bake must be present)");
            HashSet<int> plates = new HashSet<int>();
            if (ids != null)
            {
                Chk(ids.Length == 32, "identity slot count != 32: " + ids.Length);
                for (int i = 0; i < ids.Length; i++)
                {
                    ResidentIdentityEntry e = ids[i];
                    Chk(e != null, "identity slot null at " + i);
                    if (e == null) continue;
                    Chk(e.go == ResidentRules.Name(i), "identity go misaligned at slot " + i
                        + ": " + e.go + " vs " + ResidentRules.Name(i));
                    Chk(e.district == ResidentIdentity.DistrictOf(i),
                        "identity district misaligned at slot " + i + ": " + e.district);
                    if (i == ResidentIdentity.AnchorSlot)
                        Chk(e.layer == ResidentIdentity.AnchorLayer, "anchor layer marker lost at slot " + i);
                    else
                        Chk(e.layer == ResidentIdentity.NarrativeLayer, "narrative layer marker lost at slot " + i);
                    Chk(!string.IsNullOrEmpty(e.name) && e.name.Length >= 2, "identity name empty at slot " + i);
                    Chk(plates.Add(e.plateIndex), "duplicate plateIndex at slot " + i + ": " + e.plateIndex);
                    Chk(File.Exists(Path.Combine(Application.dataPath,
                        ResidentTagRules.PlatePath(e.plateIndex).Substring(7))),
                        "plate file missing for slot " + i + ": " + ResidentTagRules.PlatePath(e.plateIndex));
                }
            }

            // ---- B. asset gate: importer laws on every b1 plate (idempotent) ----
            for (int i = 0; i < ResidentTagRules.Count; i++)
            {
                string path = ResidentTagRules.PlatePath(ids[i].plateIndex);
                Sprite sp = ForceSprite(path);
                Chk(sp != null, "plate sprite failed to load: " + path);
                Chk(Math.Abs(sp.rect.width - ResidentTagRules.PxW) < 0.5f
                    && Math.Abs(sp.rect.height - ResidentTagRules.PxH) < 0.5f,
                    "rect != 66x20 at " + ResidentTagRules.Name(i) + ": " + sp.rect.width + "x" + sp.rect.height);
                Chk(Math.Abs(sp.bounds.size.x - ResidentTagRules.WorldW) < 0.01f
                    && Math.Abs(sp.bounds.size.y - ResidentTagRules.WorldH) < 0.01f,
                    "natural bounds != 2.75x0.833u (PPU100 shrink disease) at " + ResidentTagRules.Name(i));
            }

            // ---- C. CityScene wiring: sweep -> build -> idempotent -> save ----
            Scene scene = EditorSceneManager.OpenScene(ScenePath, OpenSceneMode.Single);
            Chk(scene.isLoaded, "CityScene failed to open");
            BuildTags(ids);
            BuildTags(ids);   // idempotency
            Chk(CountTags() == ResidentTagRules.Count, "idempotent rebuild count != 32: " + CountTags());
            bool saved = EditorSceneManager.SaveScene(scene);
            Chk(saved, "scene save failed");

            Scene reopened = EditorSceneManager.OpenScene(ScenePath, OpenSceneMode.Single);
            Chk(CountTags() == ResidentTagRules.Count, "persisted tag count != 32: " + CountTags());
            for (int i = 0; i < ResidentTagRules.Count; i++)
            {
                GameObject go = GameObject.Find(ResidentTagRules.Name(i));
                Chk(go != null, "tag missing on disk: " + ResidentTagRules.Name(i));
                SpriteRenderer sr = go != null ? go.GetComponent<SpriteRenderer>() : null;
                Chk(sr != null && sr.sprite != null, "tag sprite lost on disk: " + ResidentTagRules.Name(i));
                if (sr != null && sr.sprite != null)
                {
                    Chk(AssetDatabase.GetAssetPath(sr.sprite) == ResidentTagRules.PlatePath(ids[i].plateIndex),
                        "tag plate drift at " + ResidentTagRules.Name(i) + ": "
                        + AssetDatabase.GetAssetPath(sr.sprite));
                    Chk(sr.sortingOrder == ResidentTagRules.Order, "tag order lost on disk: " + ResidentTagRules.Name(i));
                }
                Vector2 p = ResidentTagRules.Pos(i);
                Chk(Math.Abs(go.transform.position.x - p.x) < 1e-4f
                    && Math.Abs(go.transform.position.y - p.y) < 1e-4f,
                    "tag position lost on disk: " + ResidentTagRules.Name(i));
                Chk(Math.Abs(sr.transform.localScale.x - 1f) < 1e-5f, "tag scale != 1 (native law)");
            }
            // neighbor regressions (residents = root-Transform count: the parts
            // stack carries no Res-prefixed SpriteRenderer on any root)
            int folkKept = 0;
            foreach (Transform t in UnityEngine.Object.FindObjectsOfType<Transform>())
                if (t.parent == null && t.name.StartsWith(ResidentRules.NamePrefix)) folkKept++;
            Chk(folkKept == ResidentRules.Count, "r99 residents lost after our save: " + folkKept);
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

            // ---- D. render gates (dusk anchor, then night) ----
            amb.EnsureVisuals();
            amb.ApplyAmbient(AmbientTier.Dusk);
            SpriteRenderer[] tags = CollectTagRenderers();
            Chk(tags.Length == ResidentTagRules.Count, "renderer collection != 32");
            SetTags(tags, false);
            Texture2D duskBase = Shot(cam, null);
            SetTags(tags, true);
            Texture2D duskOn = Shot(cam, "m1-r99-tags-dusk.png");
            int duskTot = 0; int duskMin = int.MaxValue; string duskWorst = "";
            for (int i = 0; i < ResidentTagRules.Count; i++)
            {
                int n; float lum;
                WinDelta(duskOn, duskBase, cam, i, out n, out lum);
                duskTot += n;
                if (n < duskMin) { duskMin = n; duskWorst = ResidentTagRules.Name(i); }
            }
            Chk(duskTot >= 300, "dusk tag delta too sparse: " + duskTot + "px");
            Chk(duskMin >= 10, "dusk invisible tag " + duskWorst + ": " + duskMin + "px");

            amb.ApplyAmbient(AmbientTier.Night);
            SetTags(tags, false);
            Texture2D nightBase = Shot(cam, null);
            SetTags(tags, true);
            Texture2D nightOn = Shot(cam, "m1-r99-tags-night.png");
            int nightTot = 0; float nightLum = 0f; int nightMin = int.MaxValue; string nightWorst = "";
            for (int i = 0; i < ResidentTagRules.Count; i++)
            {
                int n; float lum;
                WinDelta(nightOn, nightBase, cam, i, out n, out lum);
                nightTot += n; nightLum += lum * n;
                if (n < nightMin) { nightMin = n; nightWorst = ResidentTagRules.Name(i); }
            }
            nightLum = nightTot > 0 ? nightLum / nightTot : 0f;
            float duskLumW = 0f;
            for (int i = 0; i < ResidentTagRules.Count; i++)
            {
                int n; float lum;
                WinDelta(duskOn, duskBase, cam, i, out n, out lum);
                duskLumW += lum * n;
            }
            float duskLum = duskTot > 0 ? duskLumW / duskTot : 0f;
            Chk(nightTot >= 150, "night tag delta too sparse: " + nightTot + "px");
            Chk(nightMin >= 5, "night invisible tag " + nightWorst + ": " + nightMin + "px");
            Chk(nightLum < duskLum, "night tags must sit under dusk (atmosphere law): "
                + nightLum.ToString("F3") + " vs " + duskLum.ToString("F3"));

            UnityEngine.Object.DestroyImmediate(duskBase); UnityEngine.Object.DestroyImmediate(duskOn);
            UnityEngine.Object.DestroyImmediate(nightBase); UnityEngine.Object.DestroyImmediate(nightOn);

            return "asserts=" + asserts
                + " table=32 derived(resident_single_source) canvas=66x20"
                + " identity=32coupled anchor_layer_ok plates=" + plates.Count + "/32"
                + " scene(saved=" + saved + ",32 persisted,neighbors_ok folk32 robots8 neon" + NeonRules.Count + ")"
                + " render(dusk_px=" + duskTot + " worst=" + duskWorst + ":" + duskMin
                + " night_px=" + nightTot + " worst=" + nightWorst + ":" + nightMin
                + " lum dusk=" + duskLum.ToString("F3") + " night=" + nightLum.ToString("F3") + ")"
                + " shots=2";
        }

        static string ReloadProve()
        {
            Scene scene = EditorSceneManager.OpenScene(ScenePath, OpenSceneMode.Single);
            if (!scene.isLoaded) throw new InvalidOperationException("CityScene failed to load");
            Chk(CountTags() == ResidentTagRules.Count, "tag count after editor restart != 32: " + CountTags());
            ResidentIdentityEntry[] ids = ResidentIdentity.Load();
            Chk(ids != null && ids.Length == ResidentTagRules.Count, "identity substrate lost after restart (orphan-face law)");
            for (int i = 0; i < ResidentTagRules.Count; i++)
            {
                GameObject go = GameObject.Find(ResidentTagRules.Name(i));
                Chk(go != null, "tag lost across sessions: " + ResidentTagRules.Name(i));
                SpriteRenderer sr = go != null ? go.GetComponent<SpriteRenderer>() : null;
                Chk(sr != null && sr.sprite != null, "tag sprite unresolved after restart: " + ResidentTagRules.Name(i));
                Chk(sr.sortingOrder == ResidentTagRules.Order, "tag order lost after restart: " + ResidentTagRules.Name(i));
            }
            int folkKept = 0;
            foreach (Transform t in UnityEngine.Object.FindObjectsOfType<Transform>())
                if (t.parent == null && t.name.StartsWith(ResidentRules.NamePrefix)) folkKept++;
            Chk(folkKept == ResidentRules.Count, "residents lost across restart: " + folkKept);
            int robotsKept = 0;
            foreach (SpriteRenderer sr in UnityEngine.Object.FindObjectsOfType<SpriteRenderer>())
                if (sr.name.StartsWith(RobotRules.NamePrefix)) robotsKept++;
            Chk(robotsKept == 8, "street robots lost across restart: " + robotsKept);
            int neonKept = 0;
            foreach (SpriteRenderer sr in UnityEngine.Object.FindObjectsOfType<SpriteRenderer>())
                if (sr.name.StartsWith(NeonRules.NamePrefix)) neonKept++;
            Chk(neonKept == NeonRules.Count, "neon signs lost across restart: " + neonKept);
            // importer spot check across the restart (three b1 plates)
            string[] spot = { ResidentTagRules.PlatePath(0), ResidentTagRules.PlatePath(8), ResidentTagRules.PlatePath(31) };
            foreach (string p in spot)
            {
                TextureImporter imp = (TextureImporter)TextureImporter.GetAtPath(p);
                Chk(imp != null && imp.textureType == TextureImporterType.Sprite, "importer type lost: " + p);
                Chk(imp.filterMode == FilterMode.Point, "point filter lost: " + p);
                Chk(Math.Abs(imp.spritePixelsPerUnit - ResidentTagRules.PPU) < 0.01f, "PPU24 lost: " + p);
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
            return "reload_gate=OK tags=32/32 persisted folk=32/32 robots=8/8 neon=" + NeonRules.Count + "/" + NeonRules.Count
                + " identity=32 residentCoupled"
                + " importers=sprite+point+ppu24+nemip"
                + " skyline=2/2 neighbors=4 cam_L0=" + (cam != null ? cam.orthographicSize.ToString("F1") : "?");
        }

        // sweep every root-level NameTag* GO, then build the 32 from the rules +
        // roster plate (fresh LoadAssetAtPath at every use = r10 fake-null law)
        static void BuildTags(ResidentIdentityEntry[] ids)
        {
            foreach (Transform t in UnityEngine.Object.FindObjectsOfType<Transform>())
                if (t.parent == null && t.name.StartsWith(ResidentTagRules.NamePrefix))
                    UnityEngine.Object.DestroyImmediate(t.gameObject);
            for (int i = 0; i < ResidentTagRules.Count; i++)
            {
                GameObject go = new GameObject(ResidentTagRules.Name(i));
                Vector2 p = ResidentTagRules.Pos(i);
                go.transform.position = new Vector3(p.x, p.y, 0f);
                SpriteRenderer sr = go.AddComponent<SpriteRenderer>();
                sr.sprite = AssetDatabase.LoadAssetAtPath<Sprite>(ResidentTagRules.PlatePath(ids[i].plateIndex));
                if (sr.sprite == null)
                    throw new InvalidOperationException("tag sprite resolve failed: "
                        + ResidentTagRules.PlatePath(ids[i].plateIndex));
                sr.sortingOrder = ResidentTagRules.Order;
            }
        }

        static int CountTags()
        {
            int c = 0;
            foreach (SpriteRenderer sr in UnityEngine.Object.FindObjectsOfType<SpriteRenderer>())
                if (sr.name.StartsWith(ResidentTagRules.NamePrefix)) c++;
            return c;
        }

        static SpriteRenderer[] CollectTagRenderers()
        {
            SpriteRenderer[] tags = new SpriteRenderer[ResidentTagRules.Count];
            for (int i = 0; i < ResidentTagRules.Count; i++)
            {
                GameObject go = GameObject.Find(ResidentTagRules.Name(i));
                if (go == null) throw new InvalidOperationException("tag GO missing for render gate: " + ResidentTagRules.Name(i));
                tags[i] = go.GetComponent<SpriteRenderer>();
            }
            return tags;
        }

        static void SetTags(SpriteRenderer[] tags, bool on)
        {
            foreach (SpriteRenderer sr in tags) sr.gameObject.SetActive(on);
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

        // forces Sprite + Single + Point + PPU24 + no mips (idempotent). A null
        // importer (plate not yet imported) retries once after an explicit
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
                || Math.Abs(imp.spritePixelsPerUnit - ResidentTagRules.PPU) > 0.01f)
            {
                imp.textureType = TextureImporterType.Sprite;
                imp.spriteImportMode = SpriteImportMode.Single;
                imp.filterMode = FilterMode.Point;
                imp.mipmapEnabled = false;
                imp.textureCompression = TextureImporterCompression.Uncompressed;
                imp.npotScale = TextureImporterNPOTScale.None;
                imp.alphaIsTransparency = true;
                imp.spritePixelsPerUnit = ResidentTagRules.PPU;
                imp.SaveAndReimport();
            }
            if (imp.textureType != TextureImporterType.Sprite || imp.filterMode != FilterMode.Point
                || Math.Abs(imp.spritePixelsPerUnit - ResidentTagRules.PPU) > 0.01f)
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

        // per-tag window metric: pixels in the tag rect (+0.3u margin) that
        // differ from the tags-hidden baseline. y=0 = image BOTTOM row (r13 law).
        static void WinDelta(Texture2D on, Texture2D off, Camera cam, int i, out int deltaCount, out float avgLum)
        {
            Vector2 c = ResidentTagRules.Pos(i);
            float hw = ResidentTagRules.WorldW / 2f + 0.3f;
            float hh = ResidentTagRules.WorldH / 2f + 0.3f;
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
