// FluxVerse P-28(3) pool-coverage face (r44) + r93 vehicle systematization
// (P-69 slice-1):
// batch proof for the parked-vehicle layer (AA-016.02 S-library direct-use,
// provenance = TECH sec.9 P-21(3) r44/r45 + P-69 r93 rows). Sentinel pattern (r35..r43 style):
//   pass 1: logs/vehicle.run         -> FluxVerse.VehicleProof.BatchRun   -> logs/vehicle.done
//   pass 2: logs/vehicle-reload.run  -> FluxVerse.VehicleProof.ReloadGate -> logs/vehicle-reload.done
// Sections:
//  A pure-core gates (VehicleRules, headless): 8-entry manifest (r93: the two
//    32x57 avenue front/rear placeholder blocks are retired), paths under
//    Art/Vehicles/frames/, 8 DISTINCT files (r35 free-variety law), world sizes
//    == px/PPU24 exact, every vehicle fully inside the L0 view AND the tint
//    band, r93 vehicle-systematization gates (R-20260924-m1-visual-fix
//    sec.2-1: sedan strip frames pinned 78x36 at aspect >= 2.0 and height
//    <= 1.6u so a sedan never towers over the 1.33u residents; bus pinned
//    115x62 at aspect >= 1.75; retired avenue placeholder paths banned from
//    the table), pairwise vehicle spacing >= 2.6u, clearance vs robots >= 2.6u,
//    vs residents >= 2.8u (r37 spacing family), no overlap with any mounted
//    neon-sign rect expanded by 0.4u (r35 law), street-layer order 7.
//  B asset gate: the 10 consumed frames forced to Sprite + Single + Point +
//    PPU24 + no mips (r34 importer-default-PPU disease law, PPU24 variant);
//    rect == manifest px, bounds == manifest world size (r37 zero-floating kin).
//  C CityScene wiring: stale Vehicle* sweep -> 8 GOs from the table (fresh
//    LoadAssetAtPath per r10 law) -> FEET stand gate re-derived from the live
//    tilemaps (Street class = Roads cell at the feet point, Plaza class =
//    Ground pavement cell - never water/roof/air) -> idempotent second
//    sweep+build -> save -> disk round-trip; neighbor regressions (r35/r38
//    neon, r36 robots, r37 residents, r40 nameplates, r34 skyline, r31 bed,
//    r17 interior, r14 rig, r42 bubbles adapter, r43 card adapter, runtime-only
//    law for BarkBubble*/IdentCard* mounts).
//  D render gates (real CityScene, dusk anchor + night): per-vehicle window
//    delta vs a vehicles-hidden baseline (clean attribution), dusk visibility
//    for every vehicle, night presence under the tint, night luminance < dusk
//    (atmosphere owns the built city; parked paint is scenery, not light).
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
    public static class VehicleProof
    {
        static string ProjectRoot { get { return Path.GetDirectoryName(Application.dataPath); } }
        static string RepoRoot { get { return Path.GetDirectoryName(ProjectRoot); } }
        static string RunPath { get { return Path.Combine(RepoRoot, "logs", "vehicle.run"); } }
        static string DonePath { get { return Path.Combine(RepoRoot, "logs", "vehicle.done"); } }
        static string ReloadRunPath { get { return Path.Combine(RepoRoot, "logs", "vehicle-reload.run"); } }
        static string ReloadDonePath { get { return Path.Combine(RepoRoot, "logs", "vehicle-reload.done"); } }
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
            Chk(VehicleRules.Count == 8, "manifest must hold 8 vehicles (r93: two avenue placeholder blocks retired)");
            Chk(VehicleRules.Order == 7, "street layer order must be 7 (signs 6 < street < tint 8)");
            Chk(VehicleRules.PPU == 24f, "PPU24 divisor law (r37 density law)");
            int unique = 0;
            for (int i = 0; i < VehicleRules.Count; i++)
            {
                VehicleRules.Veh v = VehicleRules.At(i);
                Chk(v.name != null && v.name.StartsWith(VehicleRules.NamePrefix), "bad GO name at " + i);
                Chk(v.path.StartsWith("Assets/Art/Vehicles/frames/"),
                    "vehicle path outside the frames dir: " + v.path);
                Chk(v.pxW > 0 && v.pxH > 0, "bad px size at " + v.name);
                Chk(v.path != "Assets/Art/Vehicles/frames/vehicle-car-up.png"
                    && v.path != "Assets/Art/Vehicles/frames/vehicle-car-down.png",
                    "retired avenue placeholder block back in the table (r93 law): " + v.name);
                // r93 systematization gates (R- sec.2-1: elongated side views with
                // wheels; pack-measured pins catch any strip-layout drift)
                bool sedan = v.name == "VehicleCarW" || v.name == "VehicleCarQE" || v.name == "VehicleCarE";
                bool bus = v.name == "VehicleBusN";
                float aspect = (float)v.pxW / (float)v.pxH;
                if (sedan)
                {
                    Chk(v.pxW == 78 && v.pxH == 36, "sedan frame drift (pack strip layout changed): " + v.name
                        + " " + v.pxW + "x" + v.pxH);
                    Chk(aspect >= 2.0f, "sedan not elongated (r93 side-view law, retired singles were 1.65): "
                        + v.name + " aspect=" + aspect.ToString("F2"));
                    Chk(VehicleRules.WorldH(i) <= 1.6f, "sedan towers over the 1.33u residents (r93 law): "
                        + v.name + " h=" + VehicleRules.WorldH(i).ToString("F2"));
                }
                if (bus)
                {
                    Chk(v.pxW == 115 && v.pxH == 62, "bus frame drift (pack sheet layout changed): " + v.name
                        + " " + v.pxW + "x" + v.pxH);
                    Chk(aspect >= 1.75f, "bus not elongated (r93 law): aspect=" + aspect.ToString("F2"));
                }
                Chk(Math.Abs(VehicleRules.WorldW(i) - v.pxW / 24f) < 1e-5f
                    && Math.Abs(VehicleRules.WorldH(i) - v.pxH / 24f) < 1e-5f,
                    "world size != px/PPU24 at " + v.name);
                Chk(VehicleRules.InView(i, RigMath.L0Size * RigMath.Aspect, RigMath.L0Size),
                    "vehicle not fully inside the L0 view: " + v.name);
                Chk(VehicleRules.InTintBand(i), "vehicle escapes the tint band (r22 edge-band kin): " + v.name);
                bool seen = false;
                for (int j = 0; j < i; j++) if (VehicleRules.Path(j) == VehicleRules.Path(i)) { seen = true; break; }
                Chk(!seen, "clone row: file reused at " + VehicleRules.Name(i) + " (r35 free-variety law)");
                if (!seen) unique++;
            }
            Chk(unique == 8, "expected 8 distinct frame files, got " + unique);
            // vehicle-vs-vehicle spacing (center distance law)
            for (int i = 0; i < VehicleRules.Count; i++)
                for (int j = i + 1; j < VehicleRules.Count; j++)
                {
                    float d = Vector2.Distance(VehicleRules.Pos(i), VehicleRules.Pos(j));
                    Chk(d >= 2.6f, "two vehicles nearer than 2.6u: " + VehicleRules.Name(i) + "<->"
                        + VehicleRules.Name(j) + " = " + d.ToString("F3"));
                }
            // clearance vs street robots (fleet avatars)
            for (int i = 0; i < VehicleRules.Count; i++)
                for (int r = 0; r < RobotRules.Count; r++)
                {
                    float d = Vector2.Distance(VehicleRules.Pos(i), RobotRules.Pos(r));
                    Chk(d >= 2.6f, "vehicle " + VehicleRules.Name(i) + " too near robot "
                        + RobotRules.Name(r) + ": " + d.ToString("F3"));
                }
            // clearance vs residents (census identities)
            for (int i = 0; i < VehicleRules.Count; i++)
                for (int p = 0; p < ResidentRules.Count; p++)
                {
                    float d = Vector2.Distance(VehicleRules.Pos(i), ResidentRules.Pos(p));
                    Chk(d >= 2.8f, "vehicle " + VehicleRules.Name(i) + " too near resident "
                        + ResidentRules.Name(p) + ": " + d.ToString("F3"));
                }
            // mounted neon-sign rects (r35 law: no vehicle inside a sign rect + 0.4u)
            for (int i = 0; i < VehicleRules.Count; i++)
            {
                Vector2 c = VehicleRules.Pos(i);
                float hw = VehicleRules.WorldW(i) / 2f, hh = VehicleRules.WorldH(i) / 2f;
                for (int s = 0; s < NeonRules.Count; s++)
                {
                    float shw = NeonRules.WorldW(s) / 2f + 0.4f, shh = NeonRules.WorldH(s) / 2f + 0.4f;
                    float dx = Mathf.Abs(c.x - NeonRules.Pos(s).x);
                    float dy = Mathf.Abs(c.y - NeonRules.Pos(s).y);
                    Chk(!(dx < hw + shw && dy < hh + shh), "vehicle " + VehicleRules.Name(i)
                        + " clips mounted sign " + NeonRules.Name(s));
                }
            }

            // ---- B. asset gate: importer laws on every consumed frame (idempotent) ----
            for (int i = 0; i < VehicleRules.Count; i++)
            {
                Sprite sp = ForceSprite(VehicleRules.Path(i));
                Chk(sp != null, "sprite failed to load: " + VehicleRules.Path(i));
                Chk(Math.Abs(sp.rect.width - VehicleRules.PxW(i)) < 0.5f
                    && Math.Abs(sp.rect.height - VehicleRules.PxH(i)) < 0.5f,
                    "rect != manifest px at " + VehicleRules.Name(i) + ": " + sp.rect.width + "x" + sp.rect.height);
                Chk(Math.Abs(sp.bounds.size.x - VehicleRules.WorldW(i)) < 0.01f
                    && Math.Abs(sp.bounds.size.y - VehicleRules.WorldH(i)) < 0.01f,
                    "natural bounds != manifest world size at " + VehicleRules.Name(i));
            }

            // ---- C. CityScene wiring: sweep -> build -> feet gate -> idempotent -> save ----
            Scene scene = EditorSceneManager.OpenScene(ScenePath, OpenSceneMode.Single);
            Chk(scene.isLoaded, "CityScene failed to open");
            BuildVehicles();
            BuildVehicles();   // idempotency: the second sweep+build must land on exactly Count
            Chk(CountVehicles() == VehicleRules.Count, "idempotent rebuild count != table: " + CountVehicles());
            // FEET stand gate, re-derived from the live tilemaps (never comments):
            // Street class feet cell must hold a Roads tile; Plaza class a Ground tile.
            Tilemap ground = TilemapByName("Ground");
            Tilemap roads = TilemapByName("Roads");
            Chk(ground != null && roads != null, "Ground/Roads tilemaps missing");
            for (int i = 0; i < VehicleRules.Count; i++)
            {
                Vector2Int fc = VehicleRules.FeetCell(i);
                Vector3Int cell = new Vector3Int(fc.x, fc.y, 0);
                bool onGround = ground.GetTile(cell) != null;
                bool onRoad = roads.GetTile(cell) != null;
                if (VehicleRules.IsStreet(i))
                    Chk(onRoad, "street vehicle " + VehicleRules.Name(i) + " feet off the roadbed at cell "
                        + cell + " (water/roof/air)");
                else
                    Chk(onGround, "plaza vehicle " + VehicleRules.Name(i) + " feet off the pavement at cell "
                        + cell + " (water/roof/air)");
                // wheels exactly on the ground line (r37 zero-floating law)
                GameObject go = GameObject.Find(VehicleRules.Name(i));
                Chk(go != null, "vehicle GO missing pre-save: " + VehicleRules.Name(i));
                Chk(Math.Abs(go.transform.position.y - VehicleRules.FeetY(i) - VehicleRules.WorldH(i) / 2f) < 1e-4f,
                    "vehicle not standing on its ground line: " + VehicleRules.Name(i));
            }
            bool saved = EditorSceneManager.SaveScene(scene);
            Chk(saved, "scene save failed");

            Scene reopened = EditorSceneManager.OpenScene(ScenePath, OpenSceneMode.Single);
            Chk(CountVehicles() == VehicleRules.Count, "persisted vehicle count != table: " + CountVehicles());
            for (int i = 0; i < VehicleRules.Count; i++)
            {
                GameObject go = GameObject.Find(VehicleRules.Name(i));
                Chk(go != null, "vehicle missing on disk: " + VehicleRules.Name(i));
                SpriteRenderer sr = go.GetComponent<SpriteRenderer>();
                Chk(sr != null && sr.sprite != null, "vehicle sprite lost on disk: " + VehicleRules.Name(i));
                Chk(sr.sortingOrder == VehicleRules.Order, "vehicle order lost: " + VehicleRules.Name(i));
                Vector2 p = VehicleRules.Pos(i);
                Chk(Math.Abs(go.transform.position.x - p.x) < 1e-4f
                    && Math.Abs(go.transform.position.y - p.y) < 1e-4f,
                    "vehicle position lost: " + VehicleRules.Name(i));
                Chk(Math.Abs(sr.transform.localScale.x - 1f) < 1e-5f, "vehicle scale != 1 (native law)");
            }
            // neighbor regressions (our save must not drop earlier serialized wiring)
            int neonKept = 0, robotKept = 0, resKept = 0, tagKept = 0;
            foreach (SpriteRenderer sr in UnityEngine.Object.FindObjectsOfType<SpriteRenderer>())
            {
                if (sr.name.StartsWith(NeonRules.NamePrefix)) neonKept++;
                if (sr.name.StartsWith(RobotRules.NamePrefix)) robotKept++;
                if (sr.name.StartsWith("NameTag")) tagKept++;
            }
            // r99: residents are parent GOs with a child parts stack - no root
            // SpriteRenderer - so the count walks root Transforms (r40 family)
            foreach (Transform t in UnityEngine.Object.FindObjectsOfType<Transform>())
                if (t.parent == null && t.name.StartsWith(ResidentRules.NamePrefix)
                    && t.name.Length == 6) resKept++;
            Chk(neonKept == NeonRules.Count, "r35+r38 neon signs lost after our save: " + neonKept);
            Chk(robotKept == RobotRules.Count, "r36 robots lost after our save: " + robotKept);
            Chk(resKept == ResidentRules.Count, "r99 residents lost after our save: " + resKept);
            Chk(tagKept == 0, "world nameplates must stay retired after our save (r179 S5b): " + tagKept);
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
            GameObject camGo = GameObject.Find("CityCamera");
            Camera cam = camGo != null ? camGo.GetComponent<Camera>() : null;
            Chk(cam != null && cam.orthographic && Math.Abs(cam.orthographicSize - RigMath.L0Size) < 0.01f,
                "L0 camera broken after save");
            Chk(TileCount("Ground") > 0 && TileCount("Water") > 0 && TileCount("Roads") > 0
                && TileCount("CityQUANT") > 0, "tilemap layers emptied by our save");
            Chk(CountPrefix("BarkBubble") == 0, "BarkBubble persisted (runtime-only law)");
            Chk(CountPrefix("IdentCard") == 0, "IdentCard persisted (runtime-only law)");
            Chk(GameObject.Find("SkylineFar") == null && GameObject.Find("AmbientTintS") == null
                && GameObject.Find("AmbientTintN") == null && GameObject.Find("AmbientTintRiver") == null,
                "runtime-only visuals persisted into the scene");

            // ---- D. render gates (dusk anchor, then night) ----
            amb.EnsureVisuals();
            amb.ApplyAmbient(AmbientTier.Dusk);
            SpriteRenderer[] veh = CollectVehicleRenderers();
            Chk(veh.Length == VehicleRules.Count, "renderer collection != table");
            SetVehicles(veh, false);
            Texture2D duskBase = Shot(cam, null);
            SetVehicles(veh, true);
            Texture2D duskOn = Shot(cam, "m1-r69-vehicles-dusk.png");
            int duskTot = 0; int duskMin = int.MaxValue; string duskWorst = "";
            for (int i = 0; i < VehicleRules.Count; i++)
            {
                int n; float lum;
                WinDelta(duskOn, duskBase, cam, i, out n, out lum);
                duskTot += n;
                if (n < duskMin) { duskMin = n; duskWorst = VehicleRules.Name(i); }
            }
            Chk(duskTot >= 400, "dusk vehicle delta too sparse: " + duskTot + "px");
            Chk(duskMin >= 40, "dusk invisible vehicle " + duskWorst + ": " + duskMin + "px");

            amb.ApplyAmbient(AmbientTier.Night);
            SetVehicles(veh, false);
            Texture2D nightBase = Shot(cam, null);
            SetVehicles(veh, true);
            Texture2D nightOn = Shot(cam, "m1-r69-vehicles-night.png");
            int nightTot = 0; float nightLum = 0f; int nightMin = int.MaxValue; string nightWorst = "";
            for (int i = 0; i < VehicleRules.Count; i++)
            {
                int n; float lum;
                WinDelta(nightOn, nightBase, cam, i, out n, out lum);
                nightTot += n; nightLum += lum * n;
                if (n < nightMin) { nightMin = n; nightWorst = VehicleRules.Name(i); }
            }
            nightLum = nightTot > 0 ? nightLum / nightTot : 0f;
            float duskLumW = 0f;
            for (int i = 0; i < VehicleRules.Count; i++)
            {
                int n; float lum;
                WinDelta(duskOn, duskBase, cam, i, out n, out lum);
                duskLumW += lum * n;
            }
            float duskLum = duskTot > 0 ? duskLumW / duskTot : 0f;
            Chk(nightTot >= 100, "night vehicle delta too sparse: " + nightTot + "px");
            Chk(nightMin >= 8, "night invisible vehicle " + nightWorst + ": " + nightMin + "px");
            Chk(nightLum < duskLum, "night vehicles must sit under dusk (atmosphere law): "
                + nightLum.ToString("F3") + " vs " + duskLum.ToString("F3"));

            UnityEngine.Object.DestroyImmediate(duskBase); UnityEngine.Object.DestroyImmediate(duskOn);
            UnityEngine.Object.DestroyImmediate(nightBase); UnityEngine.Object.DestroyImmediate(nightOn);

            return "asserts=" + asserts
                + " table=" + VehicleRules.Count + " unique_files=" + unique
                + " scene(saved=" + saved + "," + VehicleRules.Count + " persisted,feet_gate=roads/pavement,neon" + NeonRules.Count
                + "_kept,neighbors_ok)"
                + " render(dusk_px=" + duskTot + " worst=" + duskWorst + ":" + duskMin
                + " night_px=" + nightTot + " worst=" + nightWorst + ":" + nightMin
                + " lum dusk=" + duskLum.ToString("F3") + " night=" + nightLum.ToString("F3") + ")"
                + " shots=2";
        }

        static string ReloadProve()
        {
            Scene scene = EditorSceneManager.OpenScene(ScenePath, OpenSceneMode.Single);
            if (!scene.isLoaded) throw new InvalidOperationException("CityScene failed to load");
            Chk(CountVehicles() == VehicleRules.Count, "vehicle count after editor restart != table: " + CountVehicles());
            for (int i = 0; i < VehicleRules.Count; i++)
            {
                GameObject go = GameObject.Find(VehicleRules.Name(i));
                Chk(go != null, "vehicle lost across sessions: " + VehicleRules.Name(i));
                SpriteRenderer sr = go != null ? go.GetComponent<SpriteRenderer>() : null;
                Chk(sr != null && sr.sprite != null, "vehicle sprite unresolved after restart: " + VehicleRules.Name(i));
                Chk(sr.sortingOrder == VehicleRules.Order, "vehicle order lost after restart: " + VehicleRules.Name(i));
            }
            int neonKept = 0;
            foreach (SpriteRenderer sr in UnityEngine.Object.FindObjectsOfType<SpriteRenderer>())
                if (sr.name.StartsWith(NeonRules.NamePrefix)) neonKept++;
            Chk(neonKept == NeonRules.Count, "neon signs lost across restart: " + neonKept);
            // importer spot check across the restart (mirrored sedan / sedan /
            // bus / cart / sign - all live table files, r93 set)
            string[] spot = {
                "Assets/Art/Vehicles/frames/vehicle-car2-w.png",
                "Assets/Art/Vehicles/frames/vehicle-car2-e.png",
                "Assets/Art/Vehicles/frames/vehicle-bus2-r.png",
                "Assets/Art/Vehicles/frames/vehicle-cart-food.png",
                "Assets/Art/Vehicles/frames/vehicle-stop-sign.png" };
            foreach (string p in spot)
            {
                TextureImporter imp = (TextureImporter)TextureImporter.GetAtPath(p);
                Chk(imp != null && imp.textureType == TextureImporterType.Sprite, "importer type lost: " + p);
                Chk(imp.filterMode == FilterMode.Point, "point filter lost: " + p);
                Chk(Math.Abs(imp.spritePixelsPerUnit - 24f) < 0.01f, "PPU24 lost: " + p);
                Chk(!imp.mipmapEnabled, "mips re-enabled: " + p);
            }
            GameObject ambGo = GameObject.Find("CityAmbient");
            CityAmbient amb = ambGo != null ? ambGo.GetComponent<CityAmbient>() : null;
            Chk(amb != null && amb.skylineFar != null && amb.skylineNear != null, "r34 skyline lost after restart");
            Chk(UnityEngine.Object.FindObjectsOfType<CityInterior>().Length >= 1, "CityInterior unresolved after restart");
            Chk(UnityEngine.Object.FindObjectsOfType<CityCameraRig>().Length >= 1, "CityCameraRig unresolved after restart");
            Chk(UnityEngine.Object.FindObjectsOfType<CityAmbientAudio>().Length >= 1, "CityAmbientAudio unresolved after restart");
            Chk(UnityEngine.Object.FindObjectsOfType<CityBubbles>().Length == 1, "r42 bubbles adapter unresolved after restart");
            Chk(UnityEngine.Object.FindObjectsOfType<CityResidentCard>().Length == 1, "r43 card adapter unresolved after restart");
            GameObject camGo = GameObject.Find("CityCamera");
            Camera cam = camGo != null ? camGo.GetComponent<Camera>() : null;
            Chk(cam != null && Math.Abs(cam.orthographicSize - RigMath.L0Size) < 0.01f, "L0 camera broken after restart");
            return "reload_gate=OK vehicles=" + CountVehicles() + "/" + VehicleRules.Count + " persisted neon=" + NeonRules.Count + "/" + NeonRules.Count
                + " importers=sprite+point+ppu24+nemip"
                + " skyline=2/2 neighbors=6 cam_L0=" + (cam != null ? cam.orthographicSize.ToString("F1") : "?");
        }

        // sweep every root-level Vehicle* GO, then build the 10 from the manifest
        // (fresh LoadAssetAtPath at every use = r10 fake-null law)
        static void BuildVehicles()
        {
            foreach (Transform t in UnityEngine.Object.FindObjectsOfType<Transform>())
                if (t.parent == null && t.name.StartsWith(VehicleRules.NamePrefix))
                    UnityEngine.Object.DestroyImmediate(t.gameObject);
            for (int i = 0; i < VehicleRules.Count; i++)
            {
                GameObject go = new GameObject(VehicleRules.Name(i));
                Vector2 p = VehicleRules.Pos(i);
                go.transform.position = new Vector3(p.x, p.y, 0f);
                SpriteRenderer sr = go.AddComponent<SpriteRenderer>();
                sr.sprite = AssetDatabase.LoadAssetAtPath<Sprite>(VehicleRules.Path(i));
                if (sr.sprite == null)
                    throw new InvalidOperationException("vehicle sprite resolve failed: " + VehicleRules.Path(i));
                sr.sortingOrder = VehicleRules.Order;
            }
        }

        static int CountVehicles()
        {
            int c = 0;
            foreach (SpriteRenderer sr in UnityEngine.Object.FindObjectsOfType<SpriteRenderer>())
                if (sr.name.StartsWith(VehicleRules.NamePrefix)) c++;
            return c;
        }

        static int CountPrefix(string prefix)
        {
            int c = 0;
            foreach (Transform t in UnityEngine.Object.FindObjectsOfType<Transform>())
                if (t.name.StartsWith(prefix)) c++;
            return c;
        }

        static SpriteRenderer[] CollectVehicleRenderers()
        {
            SpriteRenderer[] veh = new SpriteRenderer[VehicleRules.Count];
            for (int i = 0; i < VehicleRules.Count; i++)
            {
                GameObject go = GameObject.Find(VehicleRules.Name(i));
                if (go == null) throw new InvalidOperationException("vehicle GO missing for render gate: " + VehicleRules.Name(i));
                veh[i] = go.GetComponent<SpriteRenderer>();
            }
            return veh;
        }

        // toggle via cached references - GameObject.Find skips INACTIVE objects (r34 law)
        static void SetVehicles(SpriteRenderer[] veh, bool on)
        {
            foreach (SpriteRenderer sr in veh) sr.gameObject.SetActive(on);
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

        // forces Sprite + Single + Point + PPU24 + no mips (idempotent). The importer
        // default PPU is 100 = the r34 speck disease; the PPU24 density divisor
        // (r37 law) is enforced here, never assumed.
        static Sprite ForceSprite(string path)
        {
            TextureImporter imp = (TextureImporter)TextureImporter.GetAtPath(path);
            if (imp == null) throw new InvalidOperationException("importer missing: " + path);
            if (imp.textureType != TextureImporterType.Sprite || imp.spriteImportMode != SpriteImportMode.Single
                || imp.filterMode != FilterMode.Point || imp.mipmapEnabled
                || Math.Abs(imp.spritePixelsPerUnit - 24f) > 0.01f)
            {
                imp.textureType = TextureImporterType.Sprite;
                imp.spriteImportMode = SpriteImportMode.Single;
                imp.filterMode = FilterMode.Point;
                imp.mipmapEnabled = false;
                imp.spritePixelsPerUnit = 24f;
                imp.SaveAndReimport();
            }
            if (imp.textureType != TextureImporterType.Sprite || imp.filterMode != FilterMode.Point
                || Math.Abs(imp.spritePixelsPerUnit - 24f) > 0.01f)
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

        // per-vehicle window metric: pixels in the vehicle rect (+0.4u margin) that
        // differ from the vehicles-hidden baseline. Only the vehicles change between
        // the two renders -> clean attribution. y=0 is the image BOTTOM row (r13 law).
        static void WinDelta(Texture2D on, Texture2D off, Camera cam, int i, out int deltaCount, out float avgLum)
        {
            Vector2 c = VehicleRules.Pos(i);
            float hw = VehicleRules.WorldW(i) / 2f + 0.4f;
            float hh = VehicleRules.WorldH(i) / 2f + 0.4f;
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
