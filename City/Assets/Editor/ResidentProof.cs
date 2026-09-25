// FluxVerse r99: batch proof for the 32-seat street-resident layer (P-68
// batch1 roster swap, P-69 slice-1 single-source class). Sentinel pattern
// (r36 style):
//   pass 1: logs/resident.run        -> FluxVerse.ResidentProof.BatchRun   -> logs/resident.done
//   pass 2: logs/resident-reload.run -> FluxVerse.ResidentProof.ReloadGate -> logs/resident-reload.done
// Sections:
//  A pure-core + roster gates: 32-entry seat manifest (Res[QGMNTV]NN unique,
//    zone quotas Q9/G7/M8/N2/T1/V5), exact 1.333u world size (32px @ PPU24,
//    P-69 class), every seat inside the L0 view AND the tint band, pairwise
//    spacing >= 2.2u, >= 2.0u from every robot, outside every neon rect
//    expanded by the resident half-extent + 0.4; shadow law (32x8 contact
//    ellipse under the feet line); roster coupling via ResidentIdentity
//    (go-name alignment, species/parts/palette/plateIndex/layer laws - the
//    r98 street JSON is the single per-person source; no person data lives
//    in C#).
//  B asset gate: the 9-cell atlas forced to Sprite + Multiple + named 32x32
//    rects (Unity bottom-left coords derived from the packer's GDI top-left
//    layout) + Point + PPU24 + no mips; being-glow companion + shadow-res32
//    under the same divisor law. Cloth/badge cells are EMPTY in the group
//    line v0.1 (color fields shipped, shapes not yet drawn) - mounted
//    harmlessly, content never gated here (group-line domain).
//  C CityScene wiring: stale root Res*/ShadowRes* sweep -> 32 parents (NO
//    renderer on the root) each with a child SpriteRenderer stack cut from
//    the atlas (pant deepest -> eyes on top, equal street order 7, z-step
//    stack) + 32 shadows -> sec.8 stand gate re-derived from the LIVE
//    tilemaps x32 (underfoot pavement non-grass non-road, body cells clear
//    of Roads/Water/buildings) -> idempotent second sweep+build -> save ->
//    disk round-trip (children/sprites/tints/z survive) -> neighbor
//    regressions (robots 8, neon 18, skyline, bed, interior, rig, L0 camera,
//    tilemaps, runtime-only law).
//  D render gates (dusk anchor + night): per-seat window delta vs a
//    residents-hidden baseline (robots visible in both = clean attribution),
//    dusk visibility for every seat, night presence under the tint, night
//    luminance < dusk. Plus the r99 record set: L0 day + night, L1 south +
//    north (R-20260924-m1-visual-fix sec.3 four-shot family) - carried LIVE
//    since r124: the record set renders the current street_behavior face.
//  F street-behavior consumption (P-75 slice B, r124 work order): eave table
//    mirror census vs Tools/city/eaveslots-manifest.json (r123 geometry
//    source), sec.8 live-tilemap stand gate at both eave positions, eave
//    clearance re-derivation (seat 2.2 / robot 2.0 / neon envelopes / L0
//    frame / tint band / bubble ceiling), synthetic rain relocation
//    round-trip (capacity pick + overflow / umbrella / no-slot / visitor /
//    bucket-miss all home, body+shadow+plate trio travels together),
//    anchor-follows-data, grandfather restore, live-file smoke.
//  E pass 2: everything survives an editor restart (parents + children +
//    shadows + nameplates + the behavior adapter persisted, importer laws,
//    exactly 32, zero duplicates).
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

        static Color HexColor(string hex)
        {
            if (string.IsNullOrEmpty(hex)) return Color.white;
            string h = hex.StartsWith("#") ? hex.Substring(1) : hex;
            if (h.Length != 6) throw new InvalidOperationException("bad palette hex: " + hex);
            return new Color(
                Convert.ToInt32(h.Substring(0, 2), 16) / 255f,
                Convert.ToInt32(h.Substring(2, 2), 16) / 255f,
                Convert.ToInt32(h.Substring(4, 2), 16) / 255f, 1f);
        }

        static bool ColorEq(Color a, Color b)
        {
            return Mathf.Abs(a.r - b.r) < 0.01f && Mathf.Abs(a.g - b.g) < 0.01f
                && Mathf.Abs(a.b - b.b) < 0.01f;
        }

        static string Prove()
        {
            // ---- A. pure-core gates on the manifest ----
            Chk(ResidentRules.Count == 32, "manifest must hold 32 residents");
            Chk(ResidentRules.Order == 7, "street layer order must be 7 (signs 6 < street < tint 8)");
            Chk(Math.Abs(ResidentRules.WorldW(0) - 32f / 24f) < 1e-4f
                && Math.Abs(ResidentRules.WorldH(0) - 32f / 24f) < 1e-4f,
                "32px/PPU24 must be exactly 1.333x1.333u (P-69 single-source class)");
            int q = 0, g = 0, m = 0, n = 0, t = 0, v = 0;
            for (int i = 0; i < ResidentRules.Count; i++)
            {
                ResidentRules.Person p = ResidentRules.At(i);
                Chk(p.name != null && p.name.Length == 6 && p.name.StartsWith(ResidentRules.NamePrefix),
                    "bad GO name at " + i + ": " + p.name);
                char zc = p.name[3];
                Chk("QGMNTV".IndexOf(zc) >= 0, "bad zone letter at " + i + ": " + p.name);
                int nn; int.TryParse(p.name.Substring(4), out nn);
                Chk(nn >= 1 && nn <= 99, "bad GO ordinal at " + i);
                for (int j = 0; j < i; j++)
                    Chk(ResidentRules.Name(j) != p.name, "duplicate GO name at " + i + ": " + p.name);
                switch (ResidentRules.ZoneOf(i))
                {
                    case "QUANT": q++; break;
                    case "GAME": g++; break;
                    case "MEDIA": m++; break;
                    case "NORTH": n++; break;
                    case "TOWER": t++; break;
                    default: v++; break;
                }
                Chk(ResidentRules.InView(i, RigMath.L0Size * RigMath.Aspect, RigMath.L0Size),
                    "resident not fully inside the L0 view: " + p.name);
                Chk(ResidentRules.InTintBand(i), "resident escapes the tint band (r22 edge-band kin): " + p.name);
                // integer-y law: every seat lands on exactly two body rows
                Chk(Mathf.Abs(p.y - Mathf.Round(p.y)) < 1e-5f, "non-integer y breaks the two-row body law: " + p.name);
                Chk(ResidentRules.RowHi(i) == ResidentRules.RowLo(i) + 1,
                    "body must span exactly two rows at " + p.name);
            }
            Chk(q == ResidentRules.QuantCount && g == ResidentRules.GameCount && m == ResidentRules.MediaCount
                && n == ResidentRules.NorthCount && t == ResidentRules.TowerCount && v == ResidentRules.VisitorCount,
                "zone quota drift: Q" + q + "/G" + g + "/M" + m + "/N" + n + "/T" + t + "/V" + v);
            float minDist = float.MaxValue;
            for (int i = 0; i < ResidentRules.Count; i++)
                for (int j = i + 1; j < ResidentRules.Count; j++)
                {
                    float d = Vector2.Distance(ResidentRules.Pos(i), ResidentRules.Pos(j));
                    if (d < minDist) minDist = d;
                }
            Chk(minDist >= 2.2f, "two residents nearer than 2.2u: " + minDist.ToString("F3"));
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
            for (int i = 0; i < ResidentRules.Count; i++)
            {
                Vector2 rp = ResidentRules.Pos(i);
                for (int s = 0; s < NeonRules.Count; s++)
                {
                    float hw = NeonRules.WorldW(s) / 2f + ResidentRules.HalfSide + 0.4f;
                    float hh = NeonRules.WorldH(s) / 2f + ResidentRules.HalfSide + 0.4f;
                    float dx = Mathf.Abs(rp.x - NeonRules.Pos(s).x);
                    float dy = Mathf.Abs(rp.y - NeonRules.Pos(s).y);
                    Chk(!(dx < hw && dy < hh), "resident " + ResidentRules.Name(i) + " clips mounted sign "
                        + NeonRules.Name(s));
                }
            }
            // shadow law (r97 bake): prefix sweep-isolation, native size, per-seat derivation
            Chk(ResidentRules.ShadowNamePrefix != ResidentRules.NamePrefix
                && !ResidentRules.ShadowNamePrefix.StartsWith(ResidentRules.NamePrefix)
                && !ResidentRules.ShadowNamePrefix.StartsWith(RobotRules.NamePrefix)
                && !ResidentRules.ShadowNamePrefix.StartsWith(NeonRules.NamePrefix)
                && ResidentRules.ShadowNamePrefix != ResidentTagRules.NamePrefix,
                "shadow prefix must be sweep-isolated from every owned prefix (r40 law)");
            Chk(ResidentRules.ShadowOrder == 5, "shadow order must be 5 (Props 4 < shadows 5 < signs 6)");
            Chk(ResidentRules.ShadowPxW == 32 && ResidentRules.ShadowPxH == 8,
                "shadow canvas must be 32x8 (1.333x0.333u @ PPU24 native)");
            Chk(Math.Abs(ResidentRules.ShadowWorldW - 32f / 24f) < 1e-4f
                && Math.Abs(ResidentRules.ShadowWorldH - 8f / 24f) < 1e-4f,
                "shadow world size must be 1.333x0.333u (zero-resampling law)");
            for (int i = 0; i < ResidentRules.Count; i++)
            {
                Vector2 sp = ResidentRules.ShadowPos(i);
                Vector2 rp = ResidentRules.Pos(i);
                Chk(Math.Abs(sp.x - rp.x) < 1e-5f
                    && Math.Abs(sp.y - (rp.y - ResidentRules.HalfSide - ResidentRules.ShadowDropY)) < 1e-5f,
                    "shadow must derive from the resident feet line at " + ResidentRules.Name(i));
                Chk(sp.y < rp.y - ResidentRules.HalfSide, "shadow center must sit below the feet line at "
                    + ResidentRules.Name(i) + " (contact-shadow law)");
            }

            // ---- A2. roster coupling (the r98 street JSON is the person source) ----
            ResidentIdentityEntry[] roster = ResidentIdentity.Load(true);
            Chk(roster != null, "street roster absent/broken (r98 bake must be present)");
            Chk(roster.Length == ResidentRules.Count, "roster slot count != manifest");
            HashSet<int> plates = new HashSet<int>();
            int sprites = 0;
            for (int i = 0; i < roster.Length; i++)
            {
                ResidentIdentityEntry e = roster[i];
                Chk(e != null, "roster slot null at " + i);
                if (e == null) continue;
                Chk(e.slot == i, "roster slot index drift at " + i);
                Chk(e.go == ResidentRules.Name(i), "roster go misaligned at " + i + ": " + e.go);
                Chk(e.district == ResidentIdentity.DistrictOf(i), "roster district misaligned at " + i);
                Chk(e.species == "carbon" || e.species == "silicon" || e.species == "sprite",
                    "non-canon species at " + i + ": " + e.species);
                Chk(e.hairPart == "hair-short" || e.hairPart == "hair-long", "bad hairPart at " + i);
                Chk(plates.Add(e.plateIndex), "duplicate plateIndex: " + e.plateIndex);
                Chk(e.plateIndex >= 0 && e.plateIndex < ResidentRules.Count, "plateIndex out of 0..31 at " + i);
                if (e.species == "sprite")
                {
                    sprites++;
                    Chk(e.eyePart == "being", "sprite row must mount being at " + i);
                    Chk(!string.IsNullOrEmpty(e.coreC), "sprite row missing coreC at " + i);
                    Chk(string.IsNullOrEmpty(e.skinC) && string.IsNullOrEmpty(e.clothC)
                        && string.IsNullOrEmpty(e.pantC), "sprite row palette law (empty mount sheet) at " + i);
                }
                else
                {
                    Chk(e.eyePart == "eyes-dot" || e.eyePart == "eyes-led", "bad eyePart at " + i);
                    Chk(!string.IsNullOrEmpty(e.skinC) && !string.IsNullOrEmpty(e.clothC)
                        && !string.IsNullOrEmpty(e.pantC), "palette missing at " + i);
                }
                if (i == ResidentIdentity.AnchorSlot)
                    Chk(e.layer == ResidentIdentity.AnchorLayer, "anchor seat must carry the anchor layer marker");
                else
                    Chk(e.layer == ResidentIdentity.NarrativeLayer, "narrative layer marker lost at " + i);
            }
            Chk(sprites >= 1, "the roster must carry at least one sprite-species seat (species variety law)");

            // ---- B. asset gate ----
            Dictionary<string, Sprite> cells = ForceAtlas();
            Chk(cells.Count == 9, "atlas must expose 9 named cells, got " + cells.Count);
            foreach (string k in new string[] { "skin", "cloth", "pant", "hair-short", "hair-long",
                    "eyes-led", "eyes-dot", "badge", "being" })
                Chk(cells.ContainsKey(k), "atlas cell missing: " + k);
            foreach (KeyValuePair<string, Sprite> kv in cells)
            {
                Chk(Math.Abs(kv.Value.rect.width - 32f) < 0.5f && Math.Abs(kv.Value.rect.height - 32f) < 0.5f,
                    "atlas cell rect != 32x32: " + kv.Key + " " + kv.Value.rect);
                Chk(Math.Abs(kv.Value.bounds.size.x - 32f / 24f) < 0.01f
                    && Math.Abs(kv.Value.bounds.size.y - 32f / 24f) < 0.01f,
                    "atlas cell natural bounds != 1.333u (PPU drift): " + kv.Key);
            }
            Sprite being = ForceSingle(ResidentRules.BeingGlowPath, 32, 32);
            Sprite shadow = ForceSingle(ResidentRules.ShadowPath, ResidentRules.ShadowPxW, ResidentRules.ShadowPxH);
            Chk(Math.Abs(shadow.bounds.size.x - ResidentRules.ShadowWorldW) < 0.01f
                && Math.Abs(shadow.bounds.size.y - ResidentRules.ShadowWorldH) < 0.01f,
                "shadow natural bounds != 1.333x0.333u (PPU table drift)");

            // ---- C. CityScene wiring: sweep -> build -> stand gate -> idempotent -> save ----
            Scene scene = EditorSceneManager.OpenScene(ScenePath, OpenSceneMode.Single);
            Chk(scene.isLoaded, "CityScene failed to open");
            BuildResidents(cells, being, shadow);
            BuildResidents(cells, being, shadow);   // idempotency: second sweep+build lands on the same set
            Chk(CountParents() == ResidentRules.Count, "idempotent rebuild count != 32: " + CountParents());
            Chk(CountShadows() == ResidentRules.Count, "idempotent shadow rebuild count != 32: " + CountShadows());
            // sec.8 stand gate, re-derived from the LIVE tilemaps (r87 law, 32 seats):
            // underfoot cell (feet row - 1) must hold GROUND pavement that is not
            // grass and not a road cell; EVERY body cell (rows RowLo..RowHi across
            // cols ColLo..ColHi) must be clear of Roads / Water / city / brain tiles.
            Tilemap ground = TilemapLayer("Ground");
            Tilemap roads = TilemapLayer("Roads");
            Tilemap water = TilemapLayer("Water");
            Tilemap gGame = TilemapLayer("CityGAME");
            Tilemap gQuant = TilemapLayer("CityQUANT");
            Tilemap gMedia = TilemapLayer("CityMEDIA");
            Tilemap brain = TilemapLayer("BrainTower");
            Chk(ground != null && roads != null && water != null && gGame != null
                && gQuant != null && gMedia != null && brain != null, "stand-gate tilemaps missing");
            for (int i = 0; i < ResidentRules.Count; i++)
            {
                int rowLo = ResidentRules.RowLo(i), rowHi = ResidentRules.RowHi(i);
                int colLo = ResidentRules.ColLo(i), colHi = ResidentRules.ColHi(i);
                for (int col = colLo; col <= colHi; col++)
                {
                    Vector3Int uc = new Vector3Int(col, rowLo - 1, 0);
                    TileBase ut = ground.GetTile(uc);
                    Chk(ut != null, "resident " + ResidentRules.Name(i) + " underfoot cell off the "
                        + "pavement at " + uc + " (air/water)");
                    Chk(roads.GetTile(uc) == null, "resident " + ResidentRules.Name(i)
                        + " underfoot on a road cell at " + uc + " (sec.8 sidewalk-only law)");
                    string utName = ut != null ? ut.name : "";
                    Chk(utName != "t_grass_a" && utName != "t_grass_b",
                        "resident " + ResidentRules.Name(i) + " stands on the greenbelt at "
                        + uc + " (sec.8 greenbelt ban)");
                    for (int row = rowLo; row <= rowHi; row++)
                    {
                        Vector3Int bc = new Vector3Int(col, row, 0);
                        Chk(roads.GetTile(bc) == null, "resident " + ResidentRules.Name(i)
                            + " body over a road lane at " + bc + " (sec.8 lane ban)");
                        Chk(water.GetTile(bc) == null, "resident " + ResidentRules.Name(i)
                            + " body over water at " + bc + " (sec.8 water ban)");
                        Chk(gGame.GetTile(bc) == null && gQuant.GetTile(bc) == null
                            && gMedia.GetTile(bc) == null && brain.GetTile(bc) == null,
                            "resident " + ResidentRules.Name(i) + " body over a building tile at "
                            + bc + " (sec.8 no-in-building law)");
                    }
                }
            }
            // per-seat wiring gates (children + tints + z stack against the roster)
            WiringGates(roster, cells);
            EnsureStreetBehaviorAdapter();   // r124: persisted adapter GO (idempotent)
            bool saved = EditorSceneManager.SaveScene(scene);
            Chk(saved, "scene save failed");

            Scene reopened = EditorSceneManager.OpenScene(ScenePath, OpenSceneMode.Single);
            Chk(CountParents() == ResidentRules.Count, "persisted parent count != 32: " + CountParents());
            Chk(CountShadows() == ResidentRules.Count, "persisted shadow count != 32: " + CountShadows());
            WiringGates(roster, cells);   // everything survives the disk round-trip
            // r124: the behavior adapter resolves across the save (r14 component law)
            GameObject behGo = GameObject.Find(CityStreetBehavior.GoName);
            Chk(behGo != null, "CityStreetBehavior GO lost after save");
            CityStreetBehavior beh = behGo != null
                ? behGo.GetComponent<CityStreetBehavior>() : null;
            Chk(beh != null, "CityStreetBehavior component unresolved after save");
            int tagsKept = 0;
            foreach (Transform tg in UnityEngine.Object.FindObjectsOfType<Transform>())
                if (tg.parent == null && tg.name.StartsWith(ResidentTagRules.NamePrefix)) tagsKept++;
            Chk(tagsKept == ResidentTagRules.Count,
                "nameplates lost after our save: " + tagsKept);
            // neighbor regressions (our save must not drop earlier serialized wiring)
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
            GameObject[] folk = CollectParents();
            Chk(folk.Length == ResidentRules.Count, "parent collection != 32");
            SetFolk(folk, false);
            Texture2D duskBase = Shot(cam, null);
            SetFolk(folk, true);
            Texture2D duskOn = Shot(cam, "m1-r99-residents-dusk.png");
            int duskTot = 0; int duskMin = int.MaxValue; string duskWorst = "";
            for (int i = 0; i < ResidentRules.Count; i++)
            {
                int dn; float dl;
                WinDelta(duskOn, duskBase, cam, i, out dn, out dl);
                duskTot += dn;
                if (dn < duskMin) { duskMin = dn; duskWorst = ResidentRules.Name(i); }
            }
            Chk(duskTot >= 240, "dusk resident delta too sparse: " + duskTot + "px");
            Chk(duskMin >= 10, "dusk invisible resident " + duskWorst + ": " + duskMin + "px");

            amb.ApplyAmbient(AmbientTier.Night);
            SetFolk(folk, false);
            Texture2D nightBase = Shot(cam, null);
            SetFolk(folk, true);
            Texture2D nightOn = Shot(cam, "m1-r99-residents-night.png");
            int nightTot = 0; float nightLum = 0f; int nightMin = int.MaxValue; string nightWorst = "";
            for (int i = 0; i < ResidentRules.Count; i++)
            {
                int dn; float dl;
                WinDelta(nightOn, nightBase, cam, i, out dn, out dl);
                nightTot += dn; nightLum += dl * dn;
                if (dn < nightMin) { nightMin = dn; nightWorst = ResidentRules.Name(i); }
            }
            nightLum = nightTot > 0 ? nightLum / nightTot : 0f;
            float duskLumW = 0f;
            for (int i = 0; i < ResidentRules.Count; i++)
            {
                int dn; float dl;
                WinDelta(duskOn, duskBase, cam, i, out dn, out dl);
                duskLumW += dl * dn;
            }
            float duskLum = duskTot > 0 ? duskLumW / duskTot : 0f;
            Chk(nightTot >= 120, "night resident delta too sparse: " + nightTot + "px");
            Chk(nightMin >= 6, "night invisible resident " + nightWorst + ": " + nightMin + "px");
            Chk(nightLum < duskLum, "night residents must sit under dusk (atmosphere law): "
                + nightLum.ToString("F3") + " vs " + duskLum.ToString("F3"));

            // ---- D2. r104 record set (R- sec.3 four-shot family): L0 night + day,
            // L1 south + north. r124 (r122 item 4): the rescan carries the LIVE
            // street_behavior face - the night window's visible seats are the
            // provable face. Restored to grandfather right after: in-session
            // state only, the scene on disk never learns runtime moves.
            StreetBehaviorSnapshot live = StreetBehaviorRules.LoadStateFile();
            int liveVisible = -1; string liveCtx = "absent";
            beh.ApplyState(live);
            if (live != null && live.seats != null)
            {
                liveCtx = live.ctx;
                liveVisible = 0;
                foreach (StreetBehaviorSeat row in live.seats)
                    if (row != null && row.visible == 1) liveVisible++;
            }
            Shot(cam, "m1-r104-south-night.png");
            amb.ApplyAmbient(AmbientTier.Day);
            Shot(cam, "m1-r104-south-day.png");
            Vector3 camPosSaved = cam.transform.position;
            float camSizeSaved = cam.orthographicSize;
            cam.orthographicSize = RigMath.L1Size;
            cam.transform.position = new Vector3(0f, -10f, camPosSaved.z);
            Shot(cam, "m1-r104-south-l1-south.png");
            cam.transform.position = new Vector3(0f, 10f, camPosSaved.z);
            Shot(cam, "m1-r104-south-l1-north.png");
            cam.orthographicSize = camSizeSaved;
            cam.transform.position = camPosSaved;

            // ---- D2b. r132 tower record set (r131 item-7 shot plan): the same
            // sec.3 four views re-shot post tower-v2 wedge-cut reshape, under
            // the same live street_behavior face as the r104 set above.
            amb.ApplyAmbient(AmbientTier.Night);
            Shot(cam, "m1-r132-tower-night.png");
            amb.ApplyAmbient(AmbientTier.Day);
            Shot(cam, "m1-r132-tower-day.png");
            cam.orthographicSize = RigMath.L1Size;
            cam.transform.position = new Vector3(0f, -10f, camPosSaved.z);
            Shot(cam, "m1-r132-tower-l1-south.png");
            cam.transform.position = new Vector3(0f, 10f, camPosSaved.z);
            Shot(cam, "m1-r132-tower-l1-north.png");
            cam.orthographicSize = camSizeSaved;
            cam.transform.position = camPosSaved;
            beh.ApplyState(null);   // grandfather restore - record set done

            // ---- F. street-behavior consumption gates (P-75 slice B, r124) ----
            int fEaveReloc = 0; string fMediaPick = "-", fNorthPick = "-";
            {
                // seat trio references - resolved while every seat is active
                // (GameObject.Find skips inactive objects, r34 law)
                GameObject[] shads = new GameObject[ResidentRules.Count];
                GameObject[] plats = new GameObject[ResidentRules.Count];
                for (int i = 0; i < ResidentRules.Count; i++)
                {
                    shads[i] = GameObject.Find(ResidentRules.ShadowName(i));
                    plats[i] = GameObject.Find(ResidentTagRules.Name(i));
                    Chk(shads[i] != null, "shadow missing for the F gates: " + ResidentRules.ShadowName(i));
                    Chk(plats[i] != null, "plate missing for the F gates: " + ResidentTagRules.Name(i));
                }

                // F0 manifest mirror census: the C# eave table must mirror
                // Tools/city/eaveslots-manifest.json bit for bit (r123 source)
                EaveManifestFile mf = JsonUtility.FromJson<EaveManifestFile>(
                    File.ReadAllText(Path.Combine(RepoRoot, "Tools", "city", "eaveslots-manifest.json")));
                Chk(mf != null && mf.slots != null
                    && mf.slots.Length == StreetBehaviorRules.EaveCount,
                    "eaveslots manifest unreadable / slot count != table");
                for (int e = 0; e < StreetBehaviorRules.EaveCount; e++)
                {
                    StreetBehaviorRules.EaveSlot es = StreetBehaviorRules.Eave(e);
                    Chk(mf.slots[e].id == es.id, "eave id drift at " + e + ": " + mf.slots[e].id);
                    Chk(mf.slots[e].district == es.district, "eave district drift at " + e);
                    Chk(mf.slots[e].capacity == es.capacity, "eave capacity drift at " + e);
                    Chk(Math.Abs(mf.slots[e].x - es.x) < 1e-4f && Math.Abs(mf.slots[e].y - es.y) < 1e-4f,
                        "eave position drift vs manifest at " + es.id);
                    Chk(StreetBehaviorRules.EaveIndexForZone(es.district) == e,
                        "zone routing must map " + es.district + " to eave " + e);
                }
                Chk(StreetBehaviorRules.EaveIndexForZone("QUANT") == -1
                    && StreetBehaviorRules.EaveIndexForZone("GAME") == -1
                    && StreetBehaviorRules.EaveIndexForZone("TOWER") == -1
                    && StreetBehaviorRules.EaveIndexForZone("VISITOR") == -1,
                    "no-slot zones must route home (honest fallback law)");

                // F1 sec.8 stand gate at both eave positions - the identical law
                // the 32 home seats walk, re-derived from the LIVE tilemaps
                Tilemap groundF = TilemapLayer("Ground");
                Tilemap roadsF = TilemapLayer("Roads");
                Tilemap waterF = TilemapLayer("Water");
                Tilemap gGameF = TilemapLayer("CityGAME");
                Tilemap gQuantF = TilemapLayer("CityQUANT");
                Tilemap gMediaF = TilemapLayer("CityMEDIA");
                Tilemap brainF = TilemapLayer("BrainTower");
                Chk(groundF != null && roadsF != null && waterF != null && gGameF != null
                    && gQuantF != null && gMediaF != null && brainF != null,
                    "eave stand-gate tilemaps missing");
                for (int e = 0; e < StreetBehaviorRules.EaveCount; e++)
                    StandGateAt(StreetBehaviorRules.EavePos(e),
                        StreetBehaviorRules.Eave(e).id,
                        groundF, roadsF, waterF, gGameF, gQuantF, gMediaF, brainF);

                // F2 clearance re-derivation at both eave positions (r99 family)
                for (int e = 0; e < StreetBehaviorRules.EaveCount; e++)
                {
                    Vector2 ep = StreetBehaviorRules.EavePos(e);
                    string eid = StreetBehaviorRules.Eave(e).id;
                    Chk(Mathf.Abs(ep.x) + ResidentRules.HalfSide <= RigMath.L0Size * RigMath.Aspect - 0.3f
                        && Mathf.Abs(ep.y) + ResidentRules.HalfSide <= RigMath.L0Size - 0.3f,
                        "eave escapes the L0 frame: " + eid);
                    Chk(ep.y - ResidentRules.HalfSide >= -16f + 0.1f
                        && ep.y + ResidentRules.HalfSide <= 14f,
                        "eave escapes the tint band: " + eid);
                    Chk(ep.y + ResidentTagRules.OffsetY + ResidentTagRules.WorldH / 2f
                        + ResidentBubbleRules.GapFromTag + ResidentBubbleRules.WorldH / 2f <= 15f,
                        "eave bubble stack breaks the +15 ceiling: " + eid);
                    for (int i = 0; i < ResidentRules.Count; i++)
                        Chk(Vector2.Distance(ep, ResidentRules.Pos(i)) >= 2.2f,
                            "eave " + eid + " crowds seat " + ResidentRules.Name(i));
                    for (int b = 0; b < RobotRules.Count; b++)
                        Chk(Vector2.Distance(ep, RobotRules.Pos(b)) >= 2.0f,
                            "eave " + eid + " crowds robot " + RobotRules.Name(b));
                    for (int s = 0; s < NeonRules.Count; s++)
                    {
                        float hw = NeonRules.WorldW(s) / 2f + ResidentRules.HalfSide + 0.4f;
                        float hh = NeonRules.WorldH(s) / 2f + ResidentRules.HalfSide + 0.4f;
                        float dx = Mathf.Abs(ep.x - NeonRules.Pos(s).x);
                        float dy = Mathf.Abs(ep.y - NeonRules.Pos(s).y);
                        Chk(!(dx < hw && dy < hh),
                            "eave " + eid + " clips mounted sign " + NeonRules.Name(s));
                    }
                }

                // F3 synthetic rain: every shelter-law branch in one apply. The
                // bucket members resolve from the ROSTER ids (no hardcoded ids).
                List<int> mediaBucket = new List<int>();
                List<int> northBucket = new List<int>();
                for (int i = 0; i < ResidentRules.Count; i++)
                {
                    if (!StreetBehaviorRules.BucketHit(roster[i].id)) continue;
                    string z = ResidentRules.ZoneOf(i);
                    if (z == "MEDIA") mediaBucket.Add(i);
                    else if (z == "NORTH") northBucket.Add(i);
                }
                Chk(mediaBucket.Count >= 2,
                    "MEDIA bucket must hold >= 2 members for the capacity gate: " + mediaBucket.Count);
                Chk(northBucket.Count >= 1,
                    "NORTH bucket must hold >= 1 member: " + northBucket.Count);
                int mediaPick = mediaBucket[0], northPick = northBucket[0];
                fMediaPick = ResidentRules.Name(mediaPick);
                fNorthPick = ResidentRules.Name(northPick);
                fEaveReloc = 2;

                Dictionary<int, string> umbrellaQ = new Dictionary<int, string>();
                umbrellaQ[0] = StreetBehaviorRules.UmbrellaQuirk;   // ResQ01 street-with-umbrella
                HashSet<int> hidden = new HashSet<int>();
                hidden.Add(ResidentIdentity.AnchorSlot);            // anchor follows data
                hidden.Add(3);                                       // generic hidden seat
                beh.ApplyState(BuildSynthetic(roster, StreetBehaviorRules.ShelterState, umbrellaQ, hidden));

                // relocated trio: body + shadow + plate travel together
                Vector2 eM = StreetBehaviorRules.EavePos(0);
                Vector2 eN = StreetBehaviorRules.EavePos(1);
                Chk(AtPlan(folk[mediaPick].transform, eM),
                    "MEDIA pick must sit at EAVE-M01: " + fMediaPick);
                Chk(AtPlan(folk[northPick].transform, eN),
                    "NORTH pick must sit at EAVE-N01: " + fNorthPick);
                Chk(shads[mediaPick].activeSelf
                    && AtPlan(shads[mediaPick].transform,
                        new Vector2(eM.x, eM.y - ResidentRules.HalfSide - ResidentRules.ShadowDropY)),
                    "MEDIA pick shadow must follow to the eave");
                Chk(shads[northPick].activeSelf
                    && AtPlan(shads[northPick].transform,
                        new Vector2(eN.x, eN.y - ResidentRules.HalfSide - ResidentRules.ShadowDropY)),
                    "NORTH pick shadow must follow to the eave");
                Chk(plats[mediaPick].activeSelf
                    && AtPlan(plats[mediaPick].transform, new Vector2(eM.x, eM.y + ResidentTagRules.OffsetY)),
                    "MEDIA pick plate must follow to the eave");
                Chk(plats[northPick].activeSelf
                    && AtPlan(plats[northPick].transform, new Vector2(eN.x, eN.y + ResidentTagRules.OffsetY)),
                    "NORTH pick plate must follow to the eave");
                // capacity-1: overflow members stay home
                foreach (int s in mediaBucket)
                    if (s != mediaPick)
                        Chk(AtPlan(folk[s].transform, ResidentRules.Pos(s)),
                            "overflow member must stay home: " + ResidentRules.Name(s));
                // umbrella / no-slot / visitor / bucket-miss / every other seat:
                // visible + home (honest fallback); hidden seats hide the trio
                for (int i = 0; i < ResidentRules.Count; i++)
                {
                    if (i == mediaPick || i == northPick) continue;
                    if (hidden.Contains(i))
                    {
                        Chk(!folk[i].activeSelf,
                            "hidden seat must follow the data face: " + ResidentRules.Name(i));
                        Chk(!shads[i].activeSelf && !plats[i].activeSelf,
                            "hidden trio law (shadow+plate) at " + ResidentRules.Name(i));
                        continue;
                    }
                    Chk(folk[i].activeSelf,
                        "fallback seat must stay visible: " + ResidentRules.Name(i));
                    Chk(AtPlan(folk[i].transform, ResidentRules.Pos(i)),
                        "fallback law broken (must be home): " + ResidentRules.Name(i));
                }

                // F4 restore round-trip: plain work state, then grandfather
                beh.ApplyState(BuildSynthetic(roster, "work", null, null));
                for (int i = 0; i < ResidentRules.Count; i++)
                {
                    Chk(folk[i].activeSelf, "work-state restore visibility at " + ResidentRules.Name(i));
                    Chk(AtPlan(folk[i].transform, ResidentRules.Pos(i)),
                        "work-state restore home at " + ResidentRules.Name(i));
                }
                beh.ApplyState(null);
                for (int i = 0; i < ResidentRules.Count; i++)
                {
                    Chk(folk[i].activeSelf, "grandfather visibility at " + ResidentRules.Name(i));
                    Chk(AtPlan(folk[i].transform, ResidentRules.Pos(i)),
                        "grandfather home at " + ResidentRules.Name(i));
                    Chk(shads[i].activeSelf && AtPlan(shads[i].transform, ResidentRules.ShadowPos(i)),
                        "grandfather shadow at " + ResidentRules.Name(i));
                    Chk(plats[i].activeSelf && AtPlan(plats[i].transform, ResidentTagRules.Pos(i)),
                        "grandfather plate at " + ResidentRules.Name(i));
                }

                // F5 live-file smoke: the real state file drives the same invariant
                // (active-seat count == grandfather-inclusive visible rows)
                if (live != null && live.seats != null)
                {
                    beh.ApplyState(live);
                    bool[] covered = new bool[ResidentRules.Count];
                    int expect = 0;
                    foreach (StreetBehaviorSeat row in live.seats)
                    {
                        if (row == null || row.slot < 0 || row.slot >= ResidentRules.Count) continue;
                        if (row.go != ResidentRules.Name(row.slot)) continue;
                        covered[row.slot] = true;
                        if (row.visible == 1) expect++;
                    }
                    for (int i = 0; i < ResidentRules.Count; i++)
                        if (!covered[i]) expect++;
                    int act = 0;
                    for (int i = 0; i < ResidentRules.Count; i++)
                        if (folk[i].activeSelf) act++;
                    Chk(act == expect, "live face active count != visible rows: " + act + " vs " + expect);
                    beh.ApplyState(null);
                }
            }

            UnityEngine.Object.DestroyImmediate(duskBase); UnityEngine.Object.DestroyImmediate(duskOn);
            UnityEngine.Object.DestroyImmediate(nightBase); UnityEngine.Object.DestroyImmediate(nightOn);

            return "asserts=" + asserts
                + " table=32 zones=Q" + q + "/G" + g + "/M" + m + "/N" + n + "/T" + t + "/V" + v
                + " roster=32coupled sprites=" + sprites + " plates=" + plates.Count + "/32"
                + " scene(saved=" + saved + ",32+32shadow+tags" + tagsKept + "+adapter persisted,"
                + "stand_gate=sec8_underfoot_pavement+body_clear,"
                + "robots8_kept,neon" + NeonRules.Count + "_kept,neighbors_ok)"
                + " render(dusk_px=" + duskTot + " worst=" + duskWorst + ":" + duskMin
                + " night_px=" + nightTot + " worst=" + nightWorst + ":" + nightMin
                + " lum dusk=" + duskLum.ToString("F3") + " night=" + nightLum.ToString("F3") + ")"
                + " streetbeh(manifest_mirror=2,sec8_eave=2/2,relocate=" + fMediaPick
                + "+EAVE-M01/" + fNorthPick + "+EAVE-N01,relocated=" + fEaveReloc
                + ",live_face=" + liveVisible + " ctx=" + liveCtx + ")"
                + " shots=6";
        }

        static string ReloadProve()
        {
            Scene scene = EditorSceneManager.OpenScene(ScenePath, OpenSceneMode.Single);
            if (!scene.isLoaded) throw new InvalidOperationException("CityScene failed to load");
            Chk(CountParents() == ResidentRules.Count, "resident count after editor restart != 32: " + CountParents());
            Chk(CountShadows() == ResidentRules.Count, "shadow count after editor restart != 32: " + CountShadows());
            ResidentIdentityEntry[] roster = ResidentIdentity.Load(true);
            Chk(roster != null && roster.Length == ResidentRules.Count, "roster lost after restart");
            Dictionary<string, Sprite> cells = LoadAtlasCells();
            Chk(cells.Count == 9, "atlas cells lost after restart: " + cells.Count);
            WiringGates(roster, cells);
            int robotsKept = 0;
            foreach (SpriteRenderer sr in UnityEngine.Object.FindObjectsOfType<SpriteRenderer>())
                if (sr.name.StartsWith(RobotRules.NamePrefix)) robotsKept++;
            Chk(robotsKept == 8, "street robots lost across restart: " + robotsKept);
            int neonKept = 0;
            foreach (SpriteRenderer sr in UnityEngine.Object.FindObjectsOfType<SpriteRenderer>())
                if (sr.name.StartsWith(NeonRules.NamePrefix)) neonKept++;
            Chk(neonKept == NeonRules.Count, "neon signs lost across restart: " + neonKept);
            // importer spot check across the restart (atlas + companion + shadow)
            TextureImporter imp = (TextureImporter)TextureImporter.GetAtPath(ResidentRules.AtlasPath);
            Chk(imp != null && imp.textureType == TextureImporterType.Sprite, "atlas importer type lost");
            Chk(imp.spriteImportMode == SpriteImportMode.Multiple, "atlas Multiple mode lost");
            Chk(imp.filterMode == FilterMode.Point, "atlas point filter lost");
            Chk(Math.Abs(imp.spritePixelsPerUnit - ResidentRules.PPU) < 0.01f, "atlas PPU24 lost");
            Chk(!imp.mipmapEnabled, "atlas mips re-enabled");
            foreach (string p in new string[] { ResidentRules.BeingGlowPath, ResidentRules.ShadowPath })
            {
                TextureImporter bp = (TextureImporter)TextureImporter.GetAtPath(p);
                Chk(bp != null && bp.textureType == TextureImporterType.Sprite, "importer type lost: " + p);
                Chk(bp.filterMode == FilterMode.Point, "point filter lost: " + p);
                Chk(Math.Abs(bp.spritePixelsPerUnit - ResidentRules.PPU) < 0.01f, "PPU24 lost: " + p);
                Chk(!bp.mipmapEnabled, "mips re-enabled: " + p);
            }
            GameObject ambGo = GameObject.Find("CityAmbient");
            CityAmbient amb = ambGo != null ? ambGo.GetComponent<CityAmbient>() : null;
            Chk(amb != null && amb.skylineFar != null && amb.skylineNear != null, "r34 skyline lost after restart");
            Chk(UnityEngine.Object.FindObjectsOfType<CityInterior>().Length >= 1, "CityInterior unresolved after restart");
            Chk(UnityEngine.Object.FindObjectsOfType<CityCameraRig>().Length >= 1, "CityCameraRig unresolved after restart");
            Chk(UnityEngine.Object.FindObjectsOfType<CityAmbientAudio>().Length >= 1, "CityAmbientAudio unresolved after restart");
            GameObject behGoR = GameObject.Find(CityStreetBehavior.GoName);
            Chk(behGoR != null && behGoR.GetComponent<CityStreetBehavior>() != null,
                "CityStreetBehavior lost across restart");
            int tagsKeptR = 0;
            foreach (Transform t in UnityEngine.Object.FindObjectsOfType<Transform>())
                if (t.parent == null && t.name.StartsWith(ResidentTagRules.NamePrefix)) tagsKeptR++;
            Chk(tagsKeptR == ResidentTagRules.Count,
                "nameplates lost across restart: " + tagsKeptR);
            GameObject camGo = GameObject.Find("CityCamera");
            Camera cam = camGo != null ? camGo.GetComponent<Camera>() : null;
            Chk(cam != null && Math.Abs(cam.orthographicSize - RigMath.L0Size) < 0.01f, "L0 camera broken after restart");
            return "reload_gate=OK residents=32/32 persisted shadows=32/32 tags=" + tagsKeptR
                + "/32 adapter=resolved children_resolved robots=8/8 neon="
                + NeonRules.Count + "/" + NeonRules.Count
                + " importers=atlas_multiple9+point+ppu24+nemip"
                + " skyline=2/2 neighbors=4 cam_L0=" + (cam != null ? cam.orthographicSize.ToString("F1") : "?");
        }

        // expected child plan for a roster slot: (partName, spriteName, colorHex, z)
        struct PartPlan { public string part, sprite, hex; public float z; }
        static PartPlan[] PlanFor(ResidentIdentityEntry e)
        {
            if (e.species == "sprite")
                return new PartPlan[] { new PartPlan { part = "being", sprite = "being-glow", hex = e.coreC, z = 0f } };
            string[] stack = ResidentRules.PartStack;   // pant..eyes (6)
            string[] hexes = { e.pantC, e.skinC, e.clothC, e.badgeC, e.hairC, e.eyeC };
            string[] sprites = { "pant", "skin", "cloth", "badge",
                e.hairPart, e.eyePart };
            PartPlan[] plan = new PartPlan[stack.Length];
            for (int k = 0; k < stack.Length; k++)
                plan[k] = new PartPlan { part = stack[k], sprite = sprites[k], hex = hexes[k],
                    z = -(stack.Length - 1 - k) * ResidentRules.PartZStep };
            return plan;
        }

        // wiring gates: parent position, child plan (names/sprites/tints/z), shadow law
        static void WiringGates(ResidentIdentityEntry[] roster, Dictionary<string, Sprite> cells)
        {
            for (int i = 0; i < ResidentRules.Count; i++)
            {
                GameObject go = GameObject.Find(ResidentRules.Name(i));
                Chk(go != null, "resident missing on disk: " + ResidentRules.Name(i));
                if (go == null) continue;
                Vector2 p = ResidentRules.Pos(i);
                Chk(Math.Abs(go.transform.position.x - p.x) < 1e-4f
                    && Math.Abs(go.transform.position.y - p.y) < 1e-4f,
                    "resident position lost: " + ResidentRules.Name(i));
                Chk(go.GetComponent<SpriteRenderer>() == null,
                    "root must carry no renderer (parts-stack law): " + ResidentRules.Name(i));
                PartPlan[] plan = PlanFor(roster[i]);
                float lastZ = float.MinValue;
                for (int k = 0; k < plan.Length; k++)
                {
                    Transform c = go.transform.Find(plan[k].part);
                    Chk(c != null, "child part missing at " + ResidentRules.Name(i) + ": " + plan[k].part);
                    if (c == null) continue;
                    SpriteRenderer sr = c.GetComponent<SpriteRenderer>();
                    Chk(sr != null && sr.sprite != null, "child sprite lost at "
                        + ResidentRules.Name(i) + "/" + plan[k].part);
                    if (sr == null || sr.sprite == null) continue;
                    Chk(sr.sprite.name == plan[k].sprite, "child sprite drift at "
                        + ResidentRules.Name(i) + "/" + plan[k].part + ": " + sr.sprite.name);
                    if (plan[k].sprite != "being-glow")
                        Chk(cells.ContainsKey(plan[k].sprite) && sr.sprite == cells[plan[k].sprite],
                            "child sprite is not the atlas cell at " + ResidentRules.Name(i) + "/" + plan[k].part);
                    Chk(sr.sortingOrder == ResidentRules.Order, "child order lost at "
                        + ResidentRules.Name(i) + "/" + plan[k].part);
                    Chk(ColorEq(sr.color, HexColor(plan[k].hex)), "child tint drift at "
                        + ResidentRules.Name(i) + "/" + plan[k].part);
                    Chk(Math.Abs(c.localPosition.z - plan[k].z) < 1e-5f, "child z drift at "
                        + ResidentRules.Name(i) + "/" + plan[k].part);
                    Chk(c.localPosition.z > lastZ, "z stack must rise with the mount order at "
                        + ResidentRules.Name(i));
                    lastZ = c.localPosition.z;
                    Chk(Math.Abs(c.localPosition.x) < 1e-5f && Math.Abs(c.localPosition.y) < 1e-5f,
                        "child must sit on the parent origin at " + ResidentRules.Name(i));
                    Chk(Math.Abs(sr.transform.localScale.x - 1f) < 1e-5f, "child scale != 1 (native law)");
                }
                GameObject sgo = GameObject.Find(ResidentRules.ShadowName(i));
                Chk(sgo != null, "shadow missing on disk: " + ResidentRules.ShadowName(i));
                SpriteRenderer ssr = sgo != null ? sgo.GetComponent<SpriteRenderer>() : null;
                Chk(ssr != null && ssr.sprite != null, "shadow sprite lost on disk: " + ResidentRules.ShadowName(i));
                if (ssr != null && ssr.sprite != null)
                {
                    Chk(ssr.sortingOrder == ResidentRules.ShadowOrder, "shadow order lost: " + ResidentRules.ShadowName(i));
                    Chk(ssr.sprite.name == "shadow-res32", "shadow sprite drift: " + ssr.sprite.name);
                    Vector2 sp = ResidentRules.ShadowPos(i);
                    Chk(Math.Abs(sgo.transform.position.x - sp.x) < 1e-4f
                        && Math.Abs(sgo.transform.position.y - sp.y) < 1e-4f,
                        "shadow position lost: " + ResidentRules.ShadowName(i));
                }
            }
        }

        // sweep every root-level Res* AND ShadowRes* GO, then build the 32 bodies
        // (parent + child parts stack) + 32 shadows from the table + roster
        // (fresh LoadAssetAtPath at every use = r10 fake-null law)
        static void BuildResidents(Dictionary<string, Sprite> cells, Sprite being, Sprite shadow)
        {
            foreach (Transform tr in UnityEngine.Object.FindObjectsOfType<Transform>())
            {
                // r104: destroying a parent also destroys its parts-stack children,
                // which stay in this snapshot - a destroyed Transform must be
                // skipped BEFORE any member access (MissingReferenceException law)
                if (tr == null) continue;
                if (tr.parent == null && (tr.name.StartsWith(ResidentRules.NamePrefix)
                    || tr.name.StartsWith(ResidentRules.ShadowNamePrefix)))
                    UnityEngine.Object.DestroyImmediate(tr.gameObject);
            }
            ResidentIdentityEntry[] roster = ResidentIdentity.Load(true);
            if (roster == null || roster.Length != ResidentRules.Count)
                throw new InvalidOperationException("roster unavailable for the build");
            for (int i = 0; i < ResidentRules.Count; i++)
            {
                GameObject go = new GameObject(ResidentRules.Name(i));
                Vector2 p = ResidentRules.Pos(i);
                go.transform.position = new Vector3(p.x, p.y, 0f);
                PartPlan[] plan = PlanFor(roster[i]);
                for (int k = 0; k < plan.Length; k++)
                {
                    GameObject c = new GameObject(plan[k].part);
                    c.transform.SetParent(go.transform, false);
                    c.transform.localPosition = new Vector3(0f, 0f, plan[k].z);
                    SpriteRenderer sr = c.AddComponent<SpriteRenderer>();
                    sr.sprite = plan[k].sprite == "being-glow" ? being : cells[plan[k].sprite];
                    if (sr.sprite == null)
                        throw new InvalidOperationException("part sprite resolve failed: "
                            + ResidentRules.Name(i) + "/" + plan[k].part);
                    sr.sortingOrder = ResidentRules.Order;
                    sr.color = HexColor(plan[k].hex);
                }
            }
            for (int i = 0; i < ResidentRules.Count; i++)
            {
                GameObject go = new GameObject(ResidentRules.ShadowName(i));
                Vector2 p = ResidentRules.ShadowPos(i);
                go.transform.position = new Vector3(p.x, p.y, 0f);
                SpriteRenderer sr = go.AddComponent<SpriteRenderer>();
                sr.sprite = shadow;
                if (sr.sprite == null)
                    throw new InvalidOperationException("shadow sprite resolve failed: " + ResidentRules.ShadowPath);
                sr.sortingOrder = ResidentRules.ShadowOrder;
            }
        }

        static int CountParents()
        {
            int c = 0;
            foreach (Transform t in UnityEngine.Object.FindObjectsOfType<Transform>())
                if (t.parent == null && t.name.StartsWith(ResidentRules.NamePrefix)
                    && t.name.Length == 6) c++;
            return c;
        }

        static int CountShadows()
        {
            int c = 0;
            foreach (Transform t in UnityEngine.Object.FindObjectsOfType<Transform>())
                if (t.parent == null && t.name.StartsWith(ResidentRules.ShadowNamePrefix)) c++;
            return c;
        }

        static GameObject[] CollectParents()
        {
            GameObject[] folk = new GameObject[ResidentRules.Count];
            for (int i = 0; i < ResidentRules.Count; i++)
            {
                GameObject go = GameObject.Find(ResidentRules.Name(i));
                if (go == null) throw new InvalidOperationException("resident GO missing for render gate: " + ResidentRules.Name(i));
                folk[i] = go;
            }
            return folk;
        }

        // toggle via cached references - GameObject.Find skips INACTIVE objects (r34 law)
        static void SetFolk(GameObject[] folk, bool on)
        {
            foreach (GameObject go in folk) go.SetActive(on);
        }

        // ---- r124 helpers (P-75 slice B) ----

        // idempotent scene wiring of the behavior adapter: a legit persisted root
        // GO with zero serialized fields (CityAmbient precedent, r14 component law)
        static void EnsureStreetBehaviorAdapter()
        {
            GameObject go = GameObject.Find(CityStreetBehavior.GoName);
            if (go == null)
            {
                go = new GameObject(CityStreetBehavior.GoName);
                go.AddComponent<CityStreetBehavior>();
            }
            if (go.GetComponent<CityStreetBehavior>() == null)
                throw new InvalidOperationException("adapter component must resolve pre-save");
        }

        // transform sits at the plan position within 1e-4
        static bool AtPlan(Transform t, Vector2 p)
        {
            return t != null && Mathf.Abs(t.position.x - p.x) < 1e-4f
                && Mathf.Abs(t.position.y - p.y) < 1e-4f;
        }

        // sec.8 stand gate parameterized for the eave slot positions - the 32-seat
        // loop above walks the identical law at the home coordinates
        static void StandGateAt(Vector2 pos, string who, Tilemap ground, Tilemap roads,
            Tilemap water, Tilemap gGame, Tilemap gQuant, Tilemap gMedia, Tilemap brain)
        {
            int rowLo = Mathf.FloorToInt(pos.y - ResidentRules.HalfSide);
            int rowHi = Mathf.CeilToInt(pos.y + ResidentRules.HalfSide) - 1;
            int colLo = Mathf.FloorToInt(pos.x - ResidentRules.HalfSide);
            int colHi = Mathf.CeilToInt(pos.x + ResidentRules.HalfSide) - 1;
            for (int col = colLo; col <= colHi; col++)
            {
                Vector3Int uc = new Vector3Int(col, rowLo - 1, 0);
                TileBase ut = ground.GetTile(uc);
                Chk(ut != null, who + " underfoot cell off the pavement at " + uc);
                Chk(roads.GetTile(uc) == null, who + " underfoot on a road cell at " + uc);
                string utName = ut != null ? ut.name : "";
                Chk(utName != "t_grass_a" && utName != "t_grass_b",
                    who + " stands on the greenbelt at " + uc);
                for (int row = rowLo; row <= rowHi; row++)
                {
                    Vector3Int bc = new Vector3Int(col, row, 0);
                    Chk(roads.GetTile(bc) == null, who + " body over a road lane at " + bc);
                    Chk(water.GetTile(bc) == null, who + " body over water at " + bc);
                    Chk(gGame.GetTile(bc) == null && gQuant.GetTile(bc) == null
                        && gMedia.GetTile(bc) == null && brain.GetTile(bc) == null,
                        who + " body over a building tile at " + bc);
                }
            }
        }

        // synthetic snapshot builder: every seat covered (defaultState), optional
        // per-slot quirk overrides + hidden set - the probe's state face verbatim
        static StreetBehaviorSnapshot BuildSynthetic(ResidentIdentityEntry[] roster,
            string defaultState, Dictionary<int, string> quirks, HashSet<int> hidden)
        {
            StreetBehaviorSnapshot s = new StreetBehaviorSnapshot();
            s.ctx = "synthetic";
            s.generated_utc = "";
            s.total = ResidentRules.Count;
            s.nodata = 0;
            s.seats = new StreetBehaviorSeat[ResidentRules.Count];
            int vis = 0;
            for (int i = 0; i < ResidentRules.Count; i++)
            {
                StreetBehaviorSeat r = new StreetBehaviorSeat();
                r.slot = i;
                r.go = ResidentRules.Name(i);
                r.id = roster[i].id;
                r.state = defaultState;
                r.quirk = quirks != null && quirks.ContainsKey(i) ? quirks[i] : "";
                r.visible = hidden != null && hidden.Contains(i) ? 0 : 1;
                r.recovering = 0;
                s.seats[i] = r;
                if (r.visible == 1) vis++;
            }
            s.visible = vis;
            return s;
        }

        // r123 manifest mirror (minimal - the census needs the slot fields only)
        [Serializable] class EaveManifestSlot
        {
            public string id; public string district; public int capacity;
            public float x; public float y;
        }
        [Serializable] class EaveManifestFile { public EaveManifestSlot[] slots; }

        static Tilemap TilemapLayer(string layerName)
        {
            foreach (Tilemap tm in UnityEngine.Object.FindObjectsOfType<Tilemap>())
                if (tm.name == layerName) return tm;
            return null;
        }

        static int TileCount(string layerName)
        {
            Tilemap tm = TilemapLayer(layerName);
            if (tm == null) return 0;
            int c = 0;
            foreach (Vector3Int p in tm.cellBounds.allPositionsWithin)
                if (tm.GetTile(p) != null) c++;
            return c;
        }

        // atlas cell layout (packer GDI top-left rows 0/32/64 on 128x128) ->
        // Unity sprite rects (bottom-left origin, 32x32 cells, center pivot)
        static readonly string[] CellNames =
            { "skin", "cloth", "pant", "hair-short", "hair-long", "eyes-led", "eyes-dot", "badge", "being" };
        static Rect CellRect(string name)
        {
            int gx = 0, gy = 0;
            switch (name)
            {
                case "skin": gx = 0; gy = 0; break;
                case "cloth": gx = 32; gy = 0; break;
                case "pant": gx = 64; gy = 0; break;
                case "hair-short": gx = 96; gy = 0; break;
                case "hair-long": gx = 0; gy = 32; break;
                case "eyes-led": gx = 32; gy = 32; break;
                case "eyes-dot": gx = 64; gy = 32; break;
                case "badge": gx = 96; gy = 32; break;
                case "being": gx = 0; gy = 64; break;
            }
            return new Rect(gx, 128 - gy - 32, 32, 32);
        }

        static Dictionary<string, Sprite> LoadAtlasCells()
        {
            Dictionary<string, Sprite> map = new Dictionary<string, Sprite>();
            foreach (UnityEngine.Object o in AssetDatabase.LoadAllAssetsAtPath(ResidentRules.AtlasPath))
            {
                Sprite s = o as Sprite;
                if (s != null) map[s.name] = s;
            }
            return map;
        }

        // true when the importer already carries the nine named cells
        static bool AtlasCellsNamed(TextureImporter imp)
        {
            Dictionary<string, Sprite> live = LoadAtlasCells();
            if (live.Count != CellNames.Length) return false;
            foreach (string k in CellNames)
                if (!live.ContainsKey(k)) return false;
            foreach (KeyValuePair<string, Sprite> kv in live)
                if (kv.Value.rect != CellRect(kv.Key)) return false;
            return true;
        }

        // r99: writes the nine named 32x32 cell rects into the importer. NEW LAW:
        // this Tuanjie fork spells Unity's TextureImporter.spriteSheet as
        // `spritesheet` (all lowercase, reflection-probed 2026-09-25 - CS1061
        // on the upstream spelling is the tell, not a missing feature).
        static void WriteAtlasCells(TextureImporter imp)
        {
            SpriteMetaData[] meta = new SpriteMetaData[CellNames.Length];
            for (int k = 0; k < CellNames.Length; k++)
                meta[k] = new SpriteMetaData { name = CellNames[k], rect = CellRect(CellNames[k]),
                    alignment = 9, pivot = new Vector2(0.5f, 0.5f) };
            imp.spritesheet = meta;
        }

        // forces Sprite + Multiple + the nine named 32x32 cells + Point + PPU24 +
        // no mips (idempotent; the postprocessor exempts this file from Single).
        // r99 note: this Tuanjie fork does not expose Unity's
        // TextureImporter.spriteSheet - WriteAtlasCells carries the slicing
        // implementation for this engine's real API (see logs/atlas-api-probe.txt).
        static Dictionary<string, Sprite> ForceAtlas()
        {
            TextureImporter imp = (TextureImporter)TextureImporter.GetAtPath(ResidentRules.AtlasPath);
            if (imp == null)
            {
                AssetDatabase.Refresh();
                imp = (TextureImporter)TextureImporter.GetAtPath(ResidentRules.AtlasPath);
            }
            if (imp == null) throw new InvalidOperationException("atlas importer missing after refresh: " + ResidentRules.AtlasPath);
            bool dirty = imp.textureType != TextureImporterType.Sprite
                || imp.spriteImportMode != SpriteImportMode.Multiple
                || imp.filterMode != FilterMode.Point
                || imp.mipmapEnabled
                || Math.Abs(imp.spritePixelsPerUnit - ResidentRules.PPU) > 0.01f
                || !AtlasCellsNamed(imp);
            if (dirty)
            {
                imp.textureType = TextureImporterType.Sprite;
                imp.spriteImportMode = SpriteImportMode.Multiple;
                imp.filterMode = FilterMode.Point;
                imp.mipmapEnabled = false;
                imp.textureCompression = TextureImporterCompression.Uncompressed;
                imp.npotScale = TextureImporterNPOTScale.None;
                imp.alphaIsTransparency = true;
                imp.spritePixelsPerUnit = ResidentRules.PPU;
                imp.maxTextureSize = 4096;
                WriteAtlasCells(imp);
                imp.SaveAndReimport();
            }
            Dictionary<string, Sprite> cells = LoadAtlasCells();
            if (cells.Count != 9)
                throw new InvalidOperationException("atlas does not expose 9 cells after fix: " + cells.Count);
            return cells;
        }

        // forces Sprite + Single + Point + PPU24 + no mips (idempotent) and pins
        // the natural pixel rect (the divisor law; scale stays 1 = zero resampling)
        static Sprite ForceSingle(string path, int pxW, int pxH)
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
                || Math.Abs(imp.spritePixelsPerUnit - ResidentRules.PPU) > 0.01f)
            {
                imp.textureType = TextureImporterType.Sprite;
                imp.spriteImportMode = SpriteImportMode.Single;
                imp.filterMode = FilterMode.Point;
                imp.mipmapEnabled = false;
                imp.textureCompression = TextureImporterCompression.Uncompressed;
                imp.npotScale = TextureImporterNPOTScale.None;
                imp.alphaIsTransparency = true;
                imp.spritePixelsPerUnit = ResidentRules.PPU;
                imp.SaveAndReimport();
            }
            Sprite sp = AssetDatabase.LoadAssetAtPath<Sprite>(path);
            if (sp == null) throw new InvalidOperationException("sprite failed to load: " + path);
            if (Math.Abs(sp.rect.width - pxW) > 0.5f || Math.Abs(sp.rect.height - pxH) > 0.5f)
                throw new InvalidOperationException("rect != " + pxW + "x" + pxH + " at " + path
                    + ": " + sp.rect.width + "x" + sp.rect.height);
            return sp;
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

        // per-resident window metric: pixels in the resident rect (+0.4u margin)
        // that differ from the residents-hidden baseline. Only the residents
        // change between the renders (robots visible in both) -> clean
        // attribution. y=0 is the image BOTTOM row (r13 ReadPixels law).
        static void WinDelta(Texture2D on, Texture2D off, Camera cam, int i, out int deltaCount, out float avgLum)
        {
            Vector2 c = ResidentRules.Pos(i);
            float hw = ResidentRules.HalfSide + 0.4f;
            float hh = ResidentRules.HalfSide + 0.4f;
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
