// FluxVerse P-22(2) r39/r99: batch proof for the engine resident-identity pool
// (the 32-seat street roster wired to the P-68 batch1 census identities).
// Sentinel pattern (r36-r38 style):
//   pass 1: logs/ident.run         -> FluxVerse.ResidentIdentityProof.BatchRun   -> logs/ident.done
//   pass 2: logs/ident-reload.run  -> FluxVerse.ResidentIdentityProof.ReloadGate -> logs/ident-reload.done
// Sections:
//  A law gates: the DistrictOf table is well-formed (QT9/GM7/MD8/NS2 + one
//    empty anchor slot + OR4/RV1 visitors - canon codes only) and Count
//    mirrors the seat manifest; zone law mirrors ResidentRules.ZoneOf.
//  B live-geometry re-derivation (the scene is trusted, comments are not):
//    open CityScene READ-ONLY (never saved), read the painted Water rows and
//    the three city-block x-extents off the LIVE tilemaps, then re-derive the
//    seat law: city seats -> nearest south block (MINIMAL-TIE law, r99
//    refinement of the r39 any-tie gate: only the winner must be unique - a
//    tie between two losers never picks a district); north seats -> NS; the
//    TOWER anchor seat -> north bank, tower flank (|x| <= 5), empty district;
//    VISITOR seats -> the south street sidewalk row (feet row -10) with their
//    REAL home districts OR/RV (seat != identity claim, r96 law); and NO feet
//    row may land in the river. Plus read-only scene integrity (32 residents
//    by root-Transform count - the parts stack carries no root renderer -
//    8 robots, neon count) and a scene-not-dirty gate (writes nothing).
//  C data gates: Assets/Data/residents-street.json parses to 32 entries; slot
//    index / GO name / district / zone match the law tables; ids unique and
//    C-#####; species carbon/silicon/sprite; layer law (narrative everywhere,
//    anchor on slot 26 - CODEX sec.1 + P-58); CJK name; age law (slot 26 =
//    -1 census-null, others 1..120); plateIndex 0..31 unique; parts/palette
//    laws; core fields non-empty.
//  D census cross-check (dual implementation - the strongest gate): look
//    every slot's id up in the BigLife census source and demand field
//    equality (name/gender/age/faction/block/profession/species/district/
//    axis/creed). The SELECTION law belongs to the group production line
//    (r84 note) - this gate proves the roster is census-true per id, not a
//    local re-implementation of the pick. Absent source repo -> honest skip.
//  E file gates: SHA256 recorded for the reload pass, importer .meta present.
//  Pass 2: fresh editor session - data gates + census cross again, SHA
//    stability vs pass 1, scene integrity, meta persisted. Fail-loud.
// ASCII only. No 3D.
using System;
using System.Collections.Generic;
using System.IO;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;
using UnityEngine;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine.SceneManagement;
using UnityEngine.Tilemaps;

namespace FluxVerse
{
    public static class ResidentIdentityProof
    {
        static string ProjectRoot { get { return Path.GetDirectoryName(Application.dataPath); } }
        static string RepoRoot { get { return Path.GetDirectoryName(ProjectRoot); } }
        static string RunPath { get { return Path.Combine(RepoRoot, "logs", "ident.run"); } }
        static string DonePath { get { return Path.Combine(RepoRoot, "logs", "ident.done"); } }
        static string ReloadRunPath { get { return Path.Combine(RepoRoot, "logs", "ident-reload.run"); } }
        static string ReloadDonePath { get { return Path.Combine(RepoRoot, "logs", "ident-reload.done"); } }
        static string ShaPath { get { return Path.Combine(RepoRoot, "logs", "ident-sha.txt"); } }
        static string DataPath { get { return Path.Combine(Application.dataPath, ResidentIdentity.DataRelPath); } }
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
            // ---- A. law-table gates ----
            Chk(ResidentIdentity.Count == ResidentRules.Count, "identity count must mirror the seat manifest");
            int qt = 0, gm = 0, md = 0, ns = 0, empty = 0, or = 0, rv = 0;
            for (int i = 0; i < ResidentIdentity.Count; i++)
            {
                string d = ResidentIdentity.DistrictOf(i);
                if (d == "QT") qt++; else if (d == "GM") gm++; else if (d == "MD") md++;
                else if (d == "NS") ns++; else if (d == "") empty++;
                else if (d == "OR") or++; else if (d == "RV") rv++;
                else Chk(false, "non-canon district code in the law table: " + d);
                string z = ResidentRules.ZoneOf(i);
                Chk(z == "QUANT" || z == "GAME" || z == "MEDIA" || z == "NORTH" || z == "TOWER" || z == "VISITOR",
                    "non-canon zone code at slot " + i + ": " + z);
            }
            Chk(qt == 9 && gm == 7 && md == 8 && ns == 2 && empty == 1 && or == 4 && rv == 1,
                "district law distribution must be QT9/GM7/MD8/NS2/anchor1/OR4/RV1, got QT" + qt
                + "/GM" + gm + "/MD" + md + "/NS" + ns + "/empty" + empty + "/OR" + or + "/RV" + rv);

            // ---- B. live-geometry re-derivation (read-only scene) ----
            Scene scene = EditorSceneManager.OpenScene(ScenePath, OpenSceneMode.Single);
            Chk(scene.isLoaded, "CityScene failed to load");
            SceneIntegrity(scene);

            Tilemap water = TilemapByName("Water");
            Chk(water != null, "Water tilemap missing");
            int wMin = int.MaxValue, wMax = int.MinValue;
            foreach (Vector3Int p in water.cellBounds.allPositionsWithin)
                if (water.GetTile(p) != null)
                { wMin = Math.Min(wMin, p.y); wMax = Math.Max(wMax, p.y); }
            Chk(wMin <= wMax, "water layer painted extent empty");

            Tilemap tq = TilemapByName("CityQUANT");
            Tilemap tg = TilemapByName("CityGAME");
            Tilemap tm = TilemapByName("CityMEDIA");
            Chk(tq != null && tg != null && tm != null, "city block tilemaps missing");
            // south-bank extents ONLY (the layers also carry north low-rises)
            int qMin, qMax, gMin, gMax, mMin, mMax;
            SouthXExtent(tq, wMin, out qMin, out qMax);
            SouthXExtent(tg, wMin, out gMin, out gMax);
            SouthXExtent(tm, wMin, out mMin, out mMax);
            Chk(qMin <= qMax && gMin <= gMax && mMin <= mMax, "city south-block x-extent empty");

            for (int i = 0; i < ResidentIdentity.Count; i++)
            {
                string zone = ResidentRules.ZoneOf(i);
                int feetY = ResidentRules.FeetCellOf(i).y;
                Chk(feetY < wMin || feetY > wMax,
                    "resident stands in the river band: " + ResidentRules.Name(i));
                if (zone == "QUANT" || zone == "GAME" || zone == "MEDIA")
                {
                    Chk(feetY < wMin, "city seat must be south bank: " + ResidentRules.Name(i));
                    int feetX = ResidentRules.FeetCellOf(i).x;
                    int dq = DistX(feetX, qMin, qMax);
                    int dg = DistX(feetX, gMin, gMax);
                    int dmm = DistX(feetX, mMin, mMax);
                    // minimal-tie law (r99): only the WINNER must be unique
                    int min = Math.Min(dq, Math.Min(dg, dmm));
                    int winners = (dq == min ? 1 : 0) + (dg == min ? 1 : 0) + (dmm == min ? 1 : 0);
                    Chk(winners == 1, "nearest-block minimal tie at " + ResidentRules.Name(i)
                        + " - the law needs a unique winner");
                    string near = dq == min ? "QT" : (dg == min ? "GM" : "MD");
                    Chk(near == ResidentIdentity.DistrictOf(i),
                        "district law drift at " + ResidentRules.Name(i) + ": live geometry says " + near);
                }
                else if (zone == "NORTH")
                {
                    Chk(feetY > wMax, "north seat must be north bank: " + ResidentRules.Name(i));
                    Chk(ResidentIdentity.DistrictOf(i) == "NS", "north seat must be NS: " + ResidentRules.Name(i));
                }
                else if (zone == "TOWER")
                {
                    Chk(feetY > wMax, "anchor seat must be north bank: " + ResidentRules.Name(i));
                    Chk(Mathf.Abs(ResidentRules.Pos(i).x) <= 5f,
                        "anchor seat must flank the brain tower (|x| <= 5): " + ResidentRules.Name(i));
                    Chk(ResidentIdentity.DistrictOf(i) == "",
                        "anchor seat claims no district (r73 honor-seat law): " + ResidentRules.Name(i));
                }
                else
                {
                    Chk(feetY == -10, "visitor seat must stand on the south street sidewalk row (feet -10): "
                        + ResidentRules.Name(i) + " feet=" + feetY);
                    Chk(ResidentIdentity.DistrictOf(i) == "OR" || ResidentIdentity.DistrictOf(i) == "RV",
                        "visitor seat must carry its REAL home district OR/RV (seat != identity claim, r96 law): "
                        + ResidentRules.Name(i));
                }
            }
            Chk(!scene.isDirty, "identity proof must not dirty the scene");

            // ---- C. data gates ----
            ResidentIdentityEntry[] e = DataGates();

            // ---- D. census cross-check (dual implementation, by id) ----
            string cross = CensusCross(e);

            // ---- E. file gates ----
            Chk(File.Exists(DataPath + ".meta"), "importer meta missing for the roster data (r25 meta law)");
            string sha = Sha256File(DataPath);
            File.WriteAllText(ShaPath, sha);

            return "asserts=" + asserts
                + " law=QT" + qt + "/GM" + gm + "/MD" + md + "/NS" + ns + "/anchor" + empty + "/OR" + or + "/RV" + rv
                + " data=32 unique_ids=32 live_geometry=32 river_stand=0"
                + " census_cross=" + cross
                + " sha256=" + sha.Substring(0, 12)
                + " meta=present scene_clean=true";
        }

        static string ReloadProve()
        {
            Scene scene = EditorSceneManager.OpenScene(ScenePath, OpenSceneMode.Single);
            Chk(scene.isLoaded, "CityScene failed to load (reload pass)");
            SceneIntegrity(scene);

            ResidentIdentityEntry[] e = DataGates();
            string cross = CensusCross(e);

            Chk(File.Exists(DataPath + ".meta"), "roster meta lost across restart");
            Chk(File.Exists(ShaPath), "pass-1 sha record missing");
            string sha = Sha256File(DataPath);
            Chk(sha == File.ReadAllText(ShaPath).Trim(),
                "identity file changed between passes: " + sha + " vs " + File.ReadAllText(ShaPath).Trim());
            Chk(!scene.isDirty, "reload pass must not dirty the scene");

            return "asserts=" + asserts
                + " data=32 unique_ids=32 census_cross=" + cross
                + " sha_stable=" + sha.Substring(0, 12)
                + " meta=persisted scene_integrity=ok";
        }

        // C: data gates over the parsed roster (used by both passes)
        static ResidentIdentityEntry[] DataGates()
        {
            ResidentIdentity.Unload();
            ResidentIdentityEntry[] e = ResidentIdentity.Load(true);
            Chk(e != null, "identity pool failed to load (missing/broken data file)");
            Chk(File.Exists(DataPath), "identity data file missing on disk");
            HashSet<string> ids = new HashSet<string>();
            HashSet<int> plates = new HashSet<int>();
            for (int i = 0; i < ResidentIdentity.Count; i++)
            {
                ResidentIdentityEntry en = e[i];
                Chk(en != null, "identity entry null at slot " + i);
                Chk(en.slot == i, "slot index drift: entry " + en.slot + " at position " + i);
                Chk(en.go == ResidentRules.Name(i), "GO name drift at slot " + i + ": " + en.go);
                Chk(en.district == ResidentIdentity.DistrictOf(i),
                    "district drift at slot " + i + ": " + en.district + " vs law " + ResidentIdentity.DistrictOf(i));
                Chk(en.zone == ResidentRules.ZoneOf(i), "zone drift at slot " + i + ": " + en.zone);
                Chk(en.id != null && Regex.IsMatch(en.id, @"^C-\d{5}$"), "bad census id at slot " + i + ": " + en.id);
                Chk(ids.Add(en.id), "duplicate identity across slots: " + en.id);
                Chk(en.species == "carbon" || en.species == "silicon" || en.species == "sprite",
                    "non-canon species at slot " + i + ": " + en.species);
                if (i == ResidentIdentity.AnchorSlot)
                {
                    Chk(en.layer == ResidentIdentity.AnchorLayer, "anchor layer marker lost at slot " + i);
                    Chk(en.age == -1, "anchor seat age must be -1 (census null, undisclosed)");
                }
                else
                {
                    Chk(en.layer == ResidentIdentity.NarrativeLayer,
                        "honesty marker lost (CODEX sec.1 narrative layer) at slot " + i);
                    Chk(en.age >= 1 && en.age <= 120, "implausible age at slot " + i + ": " + en.age);
                }
                Chk(HasCjk(en.name), "name must carry CJK at slot " + i + ": " + en.name);
                Chk(!string.IsNullOrEmpty(en.gender), "empty gender at slot " + i);
                Chk(!string.IsNullOrEmpty(en.profession), "empty profession at slot " + i);
                Chk(!string.IsNullOrEmpty(en.faction), "empty faction at slot " + i);
                Chk(!string.IsNullOrEmpty(en.block), "empty block at slot " + i);
                Chk((en.axis ?? "").Length <= 30, "axis field suspiciously long at slot " + i);
                Chk((en.creed ?? "").Length <= 200, "creed field suspiciously long at slot " + i);
                Chk(plates.Add(en.plateIndex), "duplicate plateIndex at slot " + i + ": " + en.plateIndex);
                Chk(en.plateIndex >= 0 && en.plateIndex < ResidentIdentity.Count, "plateIndex out of range at slot " + i);
                Chk(!string.IsNullOrEmpty(en.plateName), "empty plateName at slot " + i);
                Chk(en.hairPart == "hair-short" || en.hairPart == "hair-long", "bad hairPart at slot " + i);
                if (en.species == "sprite")
                {
                    Chk(en.eyePart == "being", "sprite row must mount being at slot " + i);
                    Chk(!string.IsNullOrEmpty(en.coreC), "sprite row missing coreC at slot " + i);
                }
                else
                {
                    Chk(en.eyePart == "eyes-dot" || en.eyePart == "eyes-led", "bad eyePart at slot " + i);
                    Chk(!string.IsNullOrEmpty(en.skinC) && !string.IsNullOrEmpty(en.clothC)
                        && !string.IsNullOrEmpty(en.pantC), "palette missing at slot " + i);
                }
            }
            return e;
        }

        // D: per-id field equality against the BigLife census source. The
        // selection law belongs to the group production line (r84) - this gate
        // proves every roster slot is census-true, field by field.
        static string CensusCross(ResidentIdentityEntry[] e)
        {
            string groupRoot = Application.dataPath;
            for (int i = 0; i < 4; i++) groupRoot = Path.GetDirectoryName(groupRoot);
            string census = Path.Combine(groupRoot, "life", "BigLife", "census", "export", "citizens-light.jsonl");
            if (!File.Exists(census)) return "skipped(no-source-repo)";

            Regex rxSpec = new Regex("\"species\":\\s*\"([^\"]*)\"");
            Regex rxDist = new Regex("\"district\":\\s*\"([^\"]*)\"");
            Regex rxId = new Regex("\"id\":\\s*\"(C-\\d{5})\"");
            Regex rxName = new Regex("\"name\":\\s*\"([^\"]*)\"");
            Regex rxGen = new Regex("\"gender\":\\s*\"([^\"]*)\"");
            // age is census-scriped PER SPECIES: carbon "NN 岁" / silicon
            // "编译纪 NN 年" / sprite "第 NN 数据季" / anchor seat JSON null
            // (with an age_note explaining the non-disclosure). Capture the
            // whole VALUE first (null | quoted | bare) - an unbounded prefix
            // skip would leak across the field boundary into later digits
            // (first red: the anchor line's age_note/brain_digest digits).
            Regex rxAgeRaw = new Regex("\"age\":\\s*(null|\"[^\"]*\"|\\d+)");
            Regex rxFac = new Regex("\"faction\":\\s*\"([^\"]*)\"");
            Regex rxBlock = new Regex("\"block\":\\s*\"([^\"]*)\"");
            Regex rxProf = new Regex("\"profession\":\\s*\"([^\"]*)\"");
            Regex rxAxis = new Regex("\"axis\":\\s*\"([^\"]*)\"");
            Regex rxCreed = new Regex("\"creed\":\\s*\"([^\"]*)\"");

            Dictionary<string, string> byId = new Dictionary<string, string>();
            string[] lines = File.ReadAllLines(census, Encoding.UTF8);
            foreach (string ln in lines)
            {
                Match mi = rxId.Match(ln);
                if (!mi.Success) continue;
                if (byId.ContainsKey(mi.Groups[1].Value))
                    throw new InvalidOperationException("duplicate census id: " + mi.Groups[1].Value);
                byId[mi.Groups[1].Value] = ln;
            }
            Chk(byId.Count >= 10000, "census source suspiciously small: " + byId.Count);

            int fields = 0;
            for (int i = 0; i < ResidentIdentity.Count; i++)
            {
                ResidentIdentityEntry en = e[i];
                string ln;
                Chk(byId.TryGetValue(en.id, out ln), "roster id not in census at slot " + i + ": " + en.id);
                if (ln == null) continue;
                Chk(en.species == Group(rxSpec, ln), "cross species drift at slot " + i);
                Chk(en.district == GroupSoft(rxDist, ln), "cross district drift at slot " + i);
                Chk(en.name == Group(rxName, ln), "cross name drift at slot " + i);
                Chk(en.gender == Group(rxGen, ln), "cross gender drift at slot " + i);
                Match ma = rxAgeRaw.Match(ln);
                if (i == ResidentIdentity.AnchorSlot)
                    Chk(ma.Success && ma.Groups[1].Value == "null",
                        "anchor seat census age must be null (undisclosed) at slot " + i);
                else
                {
                    Chk(ma.Success && ma.Groups[1].Value != "null",
                        "census age missing at slot " + i);
                    Match md = Regex.Match(ma.Groups[1].Value, "\\d+");
                    Chk(md.Success && en.age == int.Parse(md.Value), "cross age drift at slot " + i);
                }
                Chk(en.faction == Group(rxFac, ln), "cross faction drift at slot " + i);
                Chk(en.block == Group(rxBlock, ln), "cross block drift at slot " + i);
                Chk(en.profession == Group(rxProf, ln), "cross profession drift at slot " + i);
                Chk((en.axis ?? "") == GroupSoft(rxAxis, ln), "cross axis drift at slot " + i);
                Chk((en.creed ?? "") == GroupSoft(rxCreed, ln), "cross creed drift at slot " + i);
                fields += 10;
            }
            return "32x" + fields / 32;
        }

        // read-only scene sanity: the r99 sprite layer and its neighbors are on
        // disk (identity wiring must never touch them)
        static void SceneIntegrity(Scene scene)
        {
            int residents = 0, robots = 0, neon = 0;
            foreach (Transform t in UnityEngine.Object.FindObjectsOfType<Transform>())
                if (t.parent == null && t.name.StartsWith(ResidentRules.NamePrefix) && t.name.Length == 6) residents++;
            foreach (SpriteRenderer sr in UnityEngine.Object.FindObjectsOfType<SpriteRenderer>())
            {
                if (sr.name.StartsWith(RobotRules.NamePrefix)) robots++;
                else if (sr.name.StartsWith(NeonRules.NamePrefix)) neon++;
            }
            Chk(residents == ResidentRules.Count, "street residents lost: " + residents);
            Chk(robots == 8, "street robots lost: " + robots);
            Chk(neon == NeonRules.Count, "neon signs lost: " + neon + " vs canon " + NeonRules.Count);
        }

        static string Group(Regex rx, string line)
        {
            Match m = rx.Match(line);
            if (!m.Success) throw new InvalidOperationException("census field missing: " + rx);
            return m.Groups[1].Value;
        }

        static string GroupSoft(Regex rx, string line)
        {
            Match m = rx.Match(line);
            return m.Success ? m.Groups[1].Value : "";
        }

        static bool HasCjk(string s)
        {
            if (string.IsNullOrEmpty(s)) return false;
            foreach (char c in s) if (c >= '\u4E00' && c <= '\u9FFF') return true;
            return false;
        }

        static Tilemap TilemapByName(string layerName)
        {
            GameObject go = GameObject.Find(layerName);
            return go != null ? go.GetComponent<Tilemap>() : null;
        }

        // painted x-extent of a tilemap's SOUTH-BANK tiles only (rows below the
        // river band) - cellBounds can over-allocate, and layers mix banks.
        static void SouthXExtent(Tilemap tm, int riverMinRow, out int minX, out int maxX)
        {
            minX = int.MaxValue; maxX = int.MinValue;
            foreach (Vector3Int p in tm.cellBounds.allPositionsWithin)
                if (p.y < riverMinRow && tm.GetTile(p) != null)
                { minX = Math.Min(minX, p.x); maxX = Math.Max(maxX, p.x); }
        }

        static int DistX(int x, int minX, int maxX)
        {
            if (x >= minX && x <= maxX) return 0;
            return Math.Min(Math.Abs(x - minX), Math.Abs(x - maxX));
        }

        static string Sha256File(string path)
        {
            using (SHA256 sha = SHA256.Create())
            {
                byte[] hash = sha.ComputeHash(File.ReadAllBytes(path));
                StringBuilder sb = new StringBuilder();
                foreach (byte b in hash) sb.Append(b.ToString("x2"));
                return sb.ToString();
            }
        }
    }
}
