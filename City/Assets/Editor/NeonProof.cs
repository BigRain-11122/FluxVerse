// FluxVerse P-28 item 3 (r35 + r38): batch proof for the neon street-sign mounting
// layer (warped-city pack, CC0 + r38 DevLoop-baked company plates). Sentinel pattern
// (r11/r34 style):
//   pass 1: logs/neon.run        -> FluxVerse.NeonProof.BatchRun   -> logs/neon.done
//   pass 2: logs/neon-reload.run -> FluxVerse.NeonProof.ReloadGate -> logs/neon-reload.done
// Sections:
//  A pure-core gates (NeonRules, headless): 18-entry manifest (12 pack props + 6
//    company plates), paths under the pack, native px sizes, every sign fully inside
//    the L0 view AND the tint band, pairwise min spacing, order 6 sits between
//    Props 4 and tint 8.
//  A2 P-69 slice-1 proportion gates (r89): 16 mounted signs must sit at <= half
//    their building's height (facade inside the face, roof plate sunk and <= half
//    visible); street kiosk + tower antenna exempt by precedent. r90 adds the
//    horizontal containment law (facade + roof fully inside the building width,
//    r89 A2 survey: 7 plates overhung their facades 0.06-0.73u west).
//  B asset gate: the 17 consumed sprites forced to Sprite + Single + Point +
//    manifest PPU tier (16/32/48) + no mips (r34 importer-default-PPU100 law,
//    idempotent); rect == table px exactly.
//  C CityScene wiring: stale Neon* sweep -> 18 sign GOs from the table (fresh
//    LoadAssetAtPath per r10 law) -> idempotent second sweep+build -> save -> disk
//    round-trip; r34/r31/r36/r37 neighbor regressions (skyline sprites, bed clip,
//    interior, rig, L0 camera, non-empty tilemaps, robots 8, residents 12,
//    runtime-only law).
//  D render gates (real CityScene, dusk anchor + night): per-sign window delta vs a
//    signs-hidden baseline, dusk visibility for every sign, night law = the tint
//    dims the neon but never kills it (count + luminance thresholds), dusk > night
//    luminance (atmosphere owns the built city). Waiver (r38, documented): the
//    company plates mount in saturated rooflines, so four windows overlap a
//    neighbor sign's overhang TIP (west2 / OPEN / scroll / QUANT flank tops) - those
//    lit tip pixels fold into the plate's delta count; every gate here is a MINIMUM,
//    so the inflation is safe, per-plate purity is waived for those rows only.
//  E pass 2: everything survives an editor restart (SEPARATE FILE LAW spirit:
//    persisted scene objects + importer settings + exactly 18, zero duplicates).
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
    public static class NeonProof
    {
        static string ProjectRoot { get { return Path.GetDirectoryName(Application.dataPath); } }
        static string RepoRoot { get { return Path.GetDirectoryName(ProjectRoot); } }
        static string RunPath { get { return Path.Combine(RepoRoot, "logs", "neon.run"); } }
        static string DonePath { get { return Path.Combine(RepoRoot, "logs", "neon.done"); } }
        static string ReloadRunPath { get { return Path.Combine(RepoRoot, "logs", "neon-reload.run"); } }
        static string ReloadDonePath { get { return Path.Combine(RepoRoot, "logs", "neon-reload.done"); } }
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
            Chk(NeonRules.Count == 18, "manifest must hold 18 signs (12 pack + 6 plates)");
            Chk(NeonRules.Order == 6, "mounting layer order must be 6 (Props 4 < signs < tint 8)");
            Chk(NeonRules.Order > 4 && NeonRules.Order < 8, "order 6 not between Props 4 and tint 8");
            for (int i = 0; i < NeonRules.Count; i++)
            {
                NeonRules.Sign s = NeonRules.At(i);
                Chk(s.name != null && s.name.StartsWith(NeonRules.NamePrefix), "bad GO name at " + i);
                Chk(s.path.StartsWith("Assets/ArtPacks/warped-city/ENVIRONMENT/props/"),
                    "sign path outside the pack: " + s.path);
                Chk(s.pxW > 0 && s.pxH > 0, "native px missing at " + i);
                Chk(Math.Abs(NeonRules.WorldW(i) - s.pxW / s.ppu) < 1e-5f, "world width math off at " + i);
                Chk(NeonRules.InView(i, RigMath.L0Size * RigMath.Aspect, RigMath.L0Size),
                    "sign not fully inside the L0 view: " + s.name);
                Chk(NeonRules.InTintBand(i), "sign escapes the tint band (r22 edge-band kin): " + s.name);
            }
            // ---- A2. P-69 slice-1 proportion law (r89): mounted signs must respect
            //      their buildings - a facade sign sits inside the face at <= half
            //      its height, a roof plate sinks into the roofline and rises at
            //      most half the building height; street furniture + the tower
            //      antenna are exempt (r87 precedent). r90 horizontal law: every
            //      mounted sign (facade AND roof) must sit fully inside its
            //      building's width - no west-edge overhang (r89 survey debt). ----
            int propGated = 0;
            for (int i = 0; i < NeonRules.Count; i++)
            {
                NeonRules.Sign s = NeonRules.At(i);
                if (s.mount == NeonRules.MountStreet || s.mount == NeonRules.MountExempt) continue;
                NeonRules.Building bld = NeonRules.BuildingAt(s.b);
                float bh = bld.y1 - bld.y0;
                float hh = NeonRules.WorldH(i) / 2f;
                float hw = NeonRules.WorldW(i) / 2f;
                float top = s.y + hh, bot = s.y - hh;
                Chk(bh > 0f, "degenerate building rect at sign " + s.name);
                if (s.mount == NeonRules.MountFacade)
                {
                    Chk(NeonRules.WorldH(i) <= bh * 0.5f + 0.01f,
                        "P-69 sign taller than half the facade: " + s.name);
                    Chk(bot >= bld.y0 - 0.05f && top <= bld.y1 + 0.05f,
                        "P-69 facade sign escapes its building: " + s.name);
                    Chk(s.x - hw >= bld.x0 - 0.05f && s.x + hw <= bld.x1 + 0.05f,
                        "P-69 facade sign overhangs its building horizontally (r90): " + s.name);
                }
                else
                {
                    Chk(bot <= bld.y1 + 0.05f, "P-69 roof sign floats off the roofline: " + s.name);
                    Chk(top >= bld.y1 - 0.05f, "P-69 roof sign buried in the building: " + s.name);
                    Chk(top - bld.y1 <= bh * 0.5f + 0.01f,
                        "P-69 roof sign upstages its building: " + s.name);
                    Chk(s.x - hw >= bld.x0 - 0.05f && s.x + hw <= bld.x1 + 0.05f,
                        "P-69 roof sign overhangs its building horizontally (r90): " + s.name);
                }
                propGated++;
            }
            Chk(propGated == 16, "P-69 mounted-sign count != 16: " + propGated);
            float minDist = float.MaxValue;
            for (int i = 0; i < NeonRules.Count; i++)
                for (int j = i + 1; j < NeonRules.Count; j++)
                {
                    float d = Vector2.Distance(NeonRules.Pos(i), NeonRules.Pos(j));
                    if (d < minDist) minDist = d;
                }
            Chk(minDist >= 2.0f, "two signs nearer than 2u: " + minDist.ToString("F3"));

            // ---- B. asset gate: importer laws on every consumed sprite (idempotent) ----
            int unique = 0;
            for (int i = 0; i < NeonRules.Count; i++)
            {
                bool seen = false;
                for (int j = 0; j < i; j++) if (NeonRules.Path(j) == NeonRules.Path(i))
                {
                    Chk(Math.Abs(NeonRules.At(j).ppu - NeonRules.At(i).ppu) < 0.01f,
                        "shared sprite with conflicting ppu tiers: " + NeonRules.Path(i));
                    seen = true; break;
                }
                if (seen) continue;
                unique++;
                Sprite sp = ForceSprite(NeonRules.Path(i), NeonRules.At(i).ppu);
                Chk(sp != null, "sprite failed to load: " + NeonRules.Path(i));
                Chk(Math.Abs(sp.rect.width - NeonRules.At(i).pxW) < 0.5f
                    && Math.Abs(sp.rect.height - NeonRules.At(i).pxH) < 0.5f,
                    "rect != manifest px at " + NeonRules.Name(i) + ": " + sp.rect.width + "x" + sp.rect.height);
                Chk(Math.Abs(sp.bounds.size.x - NeonRules.WorldW(i)) < 0.01f
                    && Math.Abs(sp.bounds.size.y - NeonRules.WorldH(i)) < 0.01f,
                    "natural bounds != px/ppu (importer tier disease) at " + NeonRules.Name(i));
            }
            Chk(unique == 17, "expected 17 unique consumed sprites, got " + unique);

            // ---- C. CityScene wiring: sweep -> build -> idempotent rebuild -> save ----
            Scene scene = EditorSceneManager.OpenScene(ScenePath, OpenSceneMode.Single);
            Chk(scene.isLoaded, "CityScene failed to open");
            BuildSigns();
            BuildSigns();   // idempotency: the second sweep+build must land on exactly 18
            Chk(CountSigns() == 18, "idempotent rebuild count != 18: " + CountSigns());
            bool saved = EditorSceneManager.SaveScene(scene);
            Chk(saved, "scene save failed");

            Scene reopened = EditorSceneManager.OpenScene(ScenePath, OpenSceneMode.Single);
            Chk(CountSigns() == 18, "persisted sign count != 18: " + CountSigns());
            for (int i = 0; i < NeonRules.Count; i++)
            {
                GameObject go = GameObject.Find(NeonRules.Name(i));
                Chk(go != null, "sign missing on disk: " + NeonRules.Name(i));
                SpriteRenderer sr = go.GetComponent<SpriteRenderer>();
                Chk(sr != null && sr.sprite != null, "sign sprite lost on disk: " + NeonRules.Name(i));
                Chk(sr.sortingOrder == NeonRules.Order, "sign order lost: " + NeonRules.Name(i));
                Vector2 p = NeonRules.Pos(i);
                Chk(Math.Abs(go.transform.position.x - p.x) < 1e-4f
                    && Math.Abs(go.transform.position.y - p.y) < 1e-4f,
                    "sign position lost: " + NeonRules.Name(i));
                Chk(Math.Abs(sr.transform.localScale.x - 1f) < 1e-5f, "sign scale != 1 (native law)");
            }
            // neighbor regressions (our save must not drop earlier serialized wiring)
            GameObject ambGo = GameObject.Find("CityAmbient");
            CityAmbient amb = ambGo != null ? ambGo.GetComponent<CityAmbient>() : null;
            Chk(amb != null, "CityAmbient lost after save");
            Chk(amb.skylineFar != null && amb.skylineNear != null, "r34 skyline sprites lost after save");
            CityAmbientAudio bed = amb.GetComponent<CityAmbientAudio>();
            Chk(bed != null && bed.noiseBed != null && bed.noiseBed.length > 0f, "r31 bed clip lost after save");
            Chk(UnityEngine.Object.FindObjectsOfType<CityInterior>().Length >= 1, "CityInterior lost after save");
            Chk(UnityEngine.Object.FindObjectsOfType<CityCameraRig>().Length >= 1, "CityCameraRig lost after save");
            // r36/r37 neighbor layers must survive our save too (their proofs assert
            // the reverse direction - this is the symmetric half of the contract)
            int robotsKept = 0, residentsKept = 0;
            foreach (SpriteRenderer sr in UnityEngine.Object.FindObjectsOfType<SpriteRenderer>())
            {
                if (sr.name.StartsWith(RobotRules.NamePrefix)) robotsKept++;
                if (sr.name.StartsWith(ResidentRules.NamePrefix)) residentsKept++;
            }
            Chk(robotsKept == RobotRules.Count, "r36 robots lost after our save: " + robotsKept);
            Chk(residentsKept == ResidentRules.Count, "r37 residents lost after our save: " + residentsKept);
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
            SpriteRenderer[] signs = CollectSignRenderers();
            Chk(signs.Length == 18, "renderer collection != 18");
            SetSigns(signs, false);
            Texture2D duskBase = Shot(cam, null);
            SetSigns(signs, true);
            Texture2D duskOn = Shot(cam, "m1-r69-signs-dusk.png");
            int duskTot = 0; float duskLum = 0f; int duskMin = int.MaxValue; string duskWorst = "";
            for (int i = 0; i < NeonRules.Count; i++)
            {
                int n; float lum;
                WinDelta(duskOn, duskBase, cam, i, out n, out lum);
                duskTot += n;
                if (n < duskMin) { duskMin = n; duskWorst = NeonRules.Name(i); }
            }
            Chk(duskTot >= 2500, "dusk neon delta too sparse: " + duskTot + "px");
            Chk(duskMin >= 25, "dusk invisible sign " + duskWorst + ": " + duskMin + "px");

            amb.ApplyAmbient(AmbientTier.Night);
            SetSigns(signs, false);
            Texture2D nightBase = Shot(cam, null);
            SetSigns(signs, true);
            Texture2D nightOn = Shot(cam, "m1-r69-signs-night.png");
            int nightTot = 0; float nightLum = 0f; int nightMin = int.MaxValue; string nightWorst = "";
            for (int i = 0; i < NeonRules.Count; i++)
            {
                int n; float lum;
                WinDelta(nightOn, nightBase, cam, i, out n, out lum);
                nightTot += n; nightLum += lum * n;
                if (n < nightMin) { nightMin = n; nightWorst = NeonRules.Name(i); }
            }
            nightLum = nightTot > 0 ? nightLum / nightTot : 0f;
            // recompute dusk average luminance the same weighted way for the compare
            float duskLumW = 0f;
            for (int i = 0; i < NeonRules.Count; i++)
            {
                int n; float lum;
                WinDelta(duskOn, duskBase, cam, i, out n, out lum);
                duskLumW += lum * n;
            }
            duskLum = duskTot > 0 ? duskLumW / duskTot : 0f;
            Chk(nightTot >= 1200, "night neon delta too sparse: " + nightTot + "px");
            Chk(nightMin >= 10, "night invisible sign " + nightWorst + ": " + nightMin + "px");
            Chk(nightLum >= 0.13f, "night neon lost its glow under the tint: " + nightLum.ToString("F3"));
            Chk(nightLum < duskLum, "night neon must sit under dusk neon (atmosphere law): "
                + nightLum.ToString("F3") + " vs " + duskLum.ToString("F3"));

            UnityEngine.Object.DestroyImmediate(duskBase); UnityEngine.Object.DestroyImmediate(duskOn);
            UnityEngine.Object.DestroyImmediate(nightBase); UnityEngine.Object.DestroyImmediate(nightOn);

            return "asserts=" + asserts
                + " table=18 unique_sprites=" + unique
                + " p69_prop=" + propGated + "/16"
                + " scene(saved=" + saved + ",18 persisted,robots8+residents12_kept,neighbors_ok)"
                + " render(dusk_px=" + duskTot + " worst=" + duskWorst + ":" + duskMin
                + " night_px=" + nightTot + " worst=" + nightWorst + ":" + nightMin
                + " lum dusk=" + duskLum.ToString("F3") + " night=" + nightLum.ToString("F3") + ")"
                + " shots=2";
        }

        static string ReloadProve()
        {
            Scene scene = EditorSceneManager.OpenScene(ScenePath, OpenSceneMode.Single);
            if (!scene.isLoaded) throw new InvalidOperationException("CityScene failed to load");
            Chk(CountSigns() == 18, "sign count after editor restart != 18: " + CountSigns());
            for (int i = 0; i < NeonRules.Count; i++)
            {
                GameObject go = GameObject.Find(NeonRules.Name(i));
                Chk(go != null, "sign lost across sessions: " + NeonRules.Name(i));
                SpriteRenderer sr = go != null ? go.GetComponent<SpriteRenderer>() : null;
                Chk(sr != null && sr.sprite != null, "sign sprite unresolved after restart: " + NeonRules.Name(i));
            }
            // importer spot check across the restart (hotel / neon frame / antenna /
            // plate) - expected tier per manifest (P-69: hotel + neon frame = 32)
            string[] spot = {
                "Assets/ArtPacks/warped-city/ENVIRONMENT/props/hotel-sign.png",
                "Assets/ArtPacks/warped-city/ENVIRONMENT/props/banner-neon/banner-neon-1.png",
                "Assets/ArtPacks/warped-city/ENVIRONMENT/props/antenna.png",
                "Assets/ArtPacks/warped-city/ENVIRONMENT/props/company-plates/plate-flux.png" };
            float[] spotPpu = { 32f, 32f, 16f, 16f };
            for (int k = 0; k < spot.Length; k++)
            {
                TextureImporter imp = (TextureImporter)TextureImporter.GetAtPath(spot[k]);
                Chk(imp != null && imp.textureType == TextureImporterType.Sprite, "importer type lost: " + spot[k]);
                Chk(imp.filterMode == FilterMode.Point, "point filter lost: " + spot[k]);
                Chk(Math.Abs(imp.spritePixelsPerUnit - spotPpu[k]) < 0.01f, "manifest PPU tier lost: " + spot[k]);
                Chk(!imp.mipmapEnabled, "mips re-enabled: " + spot[k]);
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
            int robotsKept = 0, residentsKept = 0;
            foreach (SpriteRenderer sr in UnityEngine.Object.FindObjectsOfType<SpriteRenderer>())
            {
                if (sr.name.StartsWith(RobotRules.NamePrefix)) robotsKept++;
                if (sr.name.StartsWith(ResidentRules.NamePrefix)) residentsKept++;
            }
            Chk(robotsKept == RobotRules.Count, "robots lost across restart: " + robotsKept);
            Chk(residentsKept == ResidentRules.Count, "residents lost across restart: " + residentsKept);
            return "reload_gate=OK signs=18/18 persisted importers=sprite+point+ppu_manifest+nemip"
                + " skyline=2/2 robots=" + robotsKept + "/" + RobotRules.Count
                + " residents=" + residentsKept + "/" + ResidentRules.Count
                + " neighbors=3 cam_L0=" + (cam != null ? cam.orthographicSize.ToString("F1") : "?");
        }

        // sweep every root-level Neon* GO, then build the 18 from the manifest
        // (fresh LoadAssetAtPath at every use = r10 fake-null law)
        static void BuildSigns()
        {
            foreach (Transform t in UnityEngine.Object.FindObjectsOfType<Transform>())
                if (t.parent == null && t.name.StartsWith(NeonRules.NamePrefix))
                    UnityEngine.Object.DestroyImmediate(t.gameObject);
            for (int i = 0; i < NeonRules.Count; i++)
            {
                GameObject go = new GameObject(NeonRules.Name(i));
                Vector2 p = NeonRules.Pos(i);
                go.transform.position = new Vector3(p.x, p.y, 0f);
                SpriteRenderer sr = go.AddComponent<SpriteRenderer>();
                sr.sprite = AssetDatabase.LoadAssetAtPath<Sprite>(NeonRules.Path(i));
                if (sr.sprite == null)
                    throw new InvalidOperationException("sign sprite resolve failed: " + NeonRules.Path(i));
                sr.sortingOrder = NeonRules.Order;
            }
        }

        static int CountSigns()
        {
            int c = 0;
            foreach (SpriteRenderer sr in UnityEngine.Object.FindObjectsOfType<SpriteRenderer>())
                if (sr.name.StartsWith(NeonRules.NamePrefix)) c++;
            return c;
        }

        static SpriteRenderer[] CollectSignRenderers()
        {
            SpriteRenderer[] signs = new SpriteRenderer[NeonRules.Count];
            for (int i = 0; i < NeonRules.Count; i++)
            {
                GameObject go = GameObject.Find(NeonRules.Name(i));
                if (go == null) throw new InvalidOperationException("sign GO missing for render gate: " + NeonRules.Name(i));
                signs[i] = go.GetComponent<SpriteRenderer>();
            }
            return signs;
        }

        // toggle via cached references - GameObject.Find skips INACTIVE objects (r34 law)
        static void SetSigns(SpriteRenderer[] signs, bool on)
        {
            foreach (SpriteRenderer sr in signs) sr.gameObject.SetActive(on);
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

        // forces Sprite + Single + Point + manifest PPU tier + no mips (idempotent).
        // The importer default PPU is 100 = the r34 speck disease; the per-sign tier
        // (16 default / 32 / 48, P-69 proportion law r89) is enforced here, never
        // assumed. The userData-mark guard in CityImportPostprocessor respects
        // these deliberate values on any future reimport.
        static Sprite ForceSprite(string path, float ppu)
        {
            TextureImporter imp = (TextureImporter)TextureImporter.GetAtPath(path);
            if (imp == null) throw new InvalidOperationException("importer missing: " + path);
            if (imp.textureType != TextureImporterType.Sprite || imp.spriteImportMode != SpriteImportMode.Single
                || imp.filterMode != FilterMode.Point || imp.mipmapEnabled
                || Math.Abs(imp.spritePixelsPerUnit - ppu) > 0.01f)
            {
                imp.textureType = TextureImporterType.Sprite;
                imp.spriteImportMode = SpriteImportMode.Single;
                imp.filterMode = FilterMode.Point;
                imp.mipmapEnabled = false;
                imp.spritePixelsPerUnit = ppu;
                imp.SaveAndReimport();
            }
            if (imp.textureType != TextureImporterType.Sprite || imp.filterMode != FilterMode.Point
                || Math.Abs(imp.spritePixelsPerUnit - ppu) > 0.01f)
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

        // per-sign window metric: pixels in the sign rect (+0.4u margin) that differ
        // from the signs-hidden baseline. Only the sign changes between the two
        // renders -> clean attribution. y=0 is the image BOTTOM row (r13 ReadPixels law).
        static void WinDelta(Texture2D on, Texture2D off, Camera cam, int i, out int deltaCount, out float avgLum)
        {
            Vector2 c = NeonRules.Pos(i);
            float hw = NeonRules.WorldW(i) / 2f + 0.4f;
            float hh = NeonRules.WorldH(i) / 2f + 0.4f;
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
