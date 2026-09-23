// FluxVerse P-22(2) r39: batch proof for the engine resident-identity pool
// (BigLife census identities wired to the 12 r37 street-resident slots).
// Sentinel pattern (r36-r38 style):
//   pass 1: logs/ident.run         -> FluxVerse.ResidentIdentityProof.BatchRun   -> logs/ident.done
//   pass 2: logs/ident-reload.run  -> FluxVerse.ResidentIdentityProof.ReloadGate -> logs/ident-reload.done
// Sections:
//  A law gates: the DistrictOf table is well-formed (QT4/GM3/MD2/NS3, canon
//    codes only) and Count mirrors the sprite manifest.
//  B live-geometry re-derivation (the scene is trusted, comments are not):
//    open CityScene READ-ONLY (never saved), read the painted Water rows and
//    the three city-block x-extents off the LIVE tilemaps, then re-derive the
//    slot->district law: south-bank slots -> nearest city block, north-bank
//    slots -> NS governance shore, and NO feet cell may land in the river.
//    Plus read-only scene integrity (12 residents / 8 robots / neon count)
//    and a scene-not-dirty gate (this proof writes nothing).
//  C data gates: Assets/Data/residents-identity.json parses to 12 entries;
//    slot index / GO name / district match the law tables, ids unique and
//    C-#####, species carbon, layer narrative (CODEX sec.1 honesty law), CJK
//    name, plausible age, core fields non-empty.
//  D census cross-check (dual implementation - the strongest gate): re-run the
//    SELECTION LAW in C# against the BigLife census source (same seed/stride/
//    ordinal-id law, same carbon+age eligibility) and demand 12x9 field
//    equality with the baked file. The PS bake and this C# core are separate
//    implementations; byte agreement proves the law, not just the artifact.
//    Absent source repo -> honest skip note (the bake itself is fail-loud).
//  E file gates: SHA256 recorded for the reload pass, importer .meta present
//    (r25 meta law - first editor pass generates it, it ships in git).
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
            Chk(ResidentIdentity.Count == ResidentRules.Count, "identity count must mirror the sprite manifest");
            int qt = 0, gm = 0, md = 0, ns = 0;
            for (int i = 0; i < ResidentIdentity.Count; i++)
            {
                string d = ResidentIdentity.DistrictOf(i);
                if (d == "QT") qt++; else if (d == "GM") gm++; else if (d == "MD") md++; else if (d == "NS") ns++;
                else Chk(false, "non-canon district code in the law table: " + d);
            }
            Chk(qt == 4 && gm == 3 && md == 2 && ns == 3,
                "district law distribution must be QT4/GM3/MD2/NS3, got QT" + qt + "/GM" + gm + "/MD" + md + "/NS" + ns);

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
            // south-bank extents ONLY: the CityGAME/CityMEDIA layers also carry
            // NORTH low-rise blocks (x -9..-7 / 7..9 / 26..28) - measuring against
            // the whole-layer x-span would swallow south slots into the wrong city
            // (first run: ResQPlazaA got dg=0 from a north low-rise). Same-bank law.
            int qMin, qMax, gMin, gMax, mMin, mMax;
            SouthXExtent(tq, wMin, out qMin, out qMax);
            SouthXExtent(tg, wMin, out gMin, out gMax);
            SouthXExtent(tm, wMin, out mMin, out mMax);
            Chk(qMin <= qMax && gMin <= gMax && mMin <= mMax, "city south-block x-extent empty");

            for (int i = 0; i < ResidentIdentity.Count; i++)
            {
                Vector2Int feet = ResidentRules.FeetCellOf(i);
                Chk(feet.y < wMin || feet.y > wMax,
                    "resident stands in the river band: " + ResidentRules.Name(i));
                if (feet.y < wMin)
                {
                    // south bank: nearest of the three city blocks by horizontal distance
                    int dq = DistX(feet.x, qMin, qMax);
                    int dg = DistX(feet.x, gMin, gMax);
                    int dmm = DistX(feet.x, mMin, mMax);
                    Chk(!(dq == dg || dq == dmm || dg == dmm),
                        "nearest-block tie at " + ResidentRules.Name(i) + " - law needs a judge");
                    string near = (dq < dg && dq < dmm) ? "QT" : (dg < dmm ? "GM" : "MD");
                    Chk(near == ResidentIdentity.DistrictOf(i),
                        "district law drift at " + ResidentRules.Name(i) + ": live geometry says " + near
                        + " (dq" + dq + "/dg" + dg + "/dm" + dmm + ")");
                }
                else
                {
                    Chk(ResidentIdentity.DistrictOf(i) == "NS",
                        "north-bank slot must be NS: " + ResidentRules.Name(i));
                }
            }
            Chk(!scene.isDirty, "identity proof must not dirty the scene");

            // ---- C. data gates ----
            ResidentIdentityEntry[] e = DataGates();

            // ---- D. census cross-check (dual implementation) ----
            string cross = CensusCross(e);

            // ---- E. file gates ----
            Chk(File.Exists(DataPath + ".meta"), "importer meta missing for the identity data (r25 meta law)");
            string sha = Sha256File(DataPath);
            File.WriteAllText(ShaPath, sha);

            return "asserts=" + asserts
                + " law=QT" + qt + "/GM" + gm + "/MD" + md + "/NS" + ns
                + " data=12 unique_ids=12 live_geometry=12 river_stand=0"
                + " census_cross=" + cross
                + " sha256=" + sha.Substring(0, 12)
                + " meta=present scene_clean=true";
        }

        static string ReloadProve()
        {
            Scene scene = EditorSceneManager.OpenScene(ScenePath, OpenSceneMode.Single);
            Chk(scene.isLoaded, "CityScene failed to load (reload pass)");
            SceneIntegrity(scene);

            // fresh-session parse: identical gates, identical file
            ResidentIdentityEntry[] e = DataGates();
            string cross = CensusCross(e);

            Chk(File.Exists(DataPath + ".meta"), "identity meta lost across restart");
            Chk(File.Exists(ShaPath), "pass-1 sha record missing");
            string sha = Sha256File(DataPath);
            Chk(sha == File.ReadAllText(ShaPath).Trim(),
                "identity file changed between passes: " + sha + " vs " + File.ReadAllText(ShaPath).Trim());
            Chk(!scene.isDirty, "reload pass must not dirty the scene");

            return "asserts=" + asserts
                + " data=12 unique_ids=12 census_cross=" + cross
                + " sha_stable=" + sha.Substring(0, 12)
                + " meta=persisted scene_integrity=ok";
        }

        // C: data gates over the parsed pool (used by both passes)
        static ResidentIdentityEntry[] DataGates()
        {
            ResidentIdentity.Unload();
            ResidentIdentityEntry[] e = ResidentIdentity.Load(true);
            Chk(e != null, "identity pool failed to load (missing/broken data file)");
            Chk(File.Exists(DataPath), "identity data file missing on disk");
            HashSet<string> ids = new HashSet<string>();
            for (int i = 0; i < ResidentIdentity.Count; i++)
            {
                ResidentIdentityEntry en = e[i];
                Chk(en != null, "identity entry null at slot " + i);
                Chk(en.slot == i, "slot index drift: entry " + en.slot + " at position " + i);
                Chk(en.go == ResidentRules.Name(i), "GO name drift at slot " + i + ": " + en.go);
                Chk(en.district == ResidentIdentity.DistrictOf(i),
                    "district drift at slot " + i + ": " + en.district + " vs law " + ResidentIdentity.DistrictOf(i));
                Chk(en.id != null && Regex.IsMatch(en.id, @"^C-\d{5}$"), "bad census id at slot " + i + ": " + en.id);
                Chk(ids.Add(en.id), "duplicate identity across slots: " + en.id);
                Chk(en.species == "carbon", "non-carbon identity in a human sprite slot: " + en.id);
                Chk(en.layer == ResidentIdentity.LayerMarker,
                    "honesty marker lost (CODEX sec.1 narrative layer): " + en.id);
                Chk(HasCjk(en.name), "name must carry CJK: " + en.id);
                Chk(!string.IsNullOrEmpty(en.gender), "empty gender: " + en.id);
                Chk(en.age >= 1 && en.age <= 120, "implausible age: " + en.id + " age=" + en.age);
                Chk(!string.IsNullOrEmpty(en.profession), "empty profession: " + en.id);
                Chk(!string.IsNullOrEmpty(en.faction), "empty faction: " + en.id);
                Chk(!string.IsNullOrEmpty(en.block), "empty block: " + en.id);
                Chk((en.axis ?? "").Length <= 30, "axis field suspiciously long: " + en.id);
                Chk((en.creed ?? "").Length <= 200, "creed field suspiciously long: " + en.id);
            }
            return e;
        }

        // D: re-run the selection law in C# against the BigLife census source.
        // Same eligibility (carbon + parseable age), same ordinal-id sort, same
        // seed/stride pick as Tools/city/bake-resident-identity.ps1 - the two
        // implementations must agree on all 12x9 fields or the law is broken.
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
            Regex rxAge = new Regex("\"age\":\\s*\"?\\s*(\\d+)");   // dual-format law (15 int / 7485 quoted)
            Regex rxFac = new Regex("\"faction\":\\s*\"([^\"]*)\"");
            Regex rxBlock = new Regex("\"block\":\\s*\"([^\"]*)\"");
            Regex rxProf = new Regex("\"profession\":\\s*\"([^\"]*)\"");
            Regex rxAxis = new Regex("\"axis\":\\s*\"([^\"]*)\"");
            Regex rxCreed = new Regex("\"creed\":\\s*\"([^\"]*)\"");

            Dictionary<string, Dictionary<string, string>> byId =
                new Dictionary<string, Dictionary<string, string>>();
            Dictionary<string, List<string>> idList = new Dictionary<string, List<string>>();
            foreach (string d in new string[] { "QT", "GM", "MD", "NS" })
            {
                byId[d] = new Dictionary<string, string>();
                idList[d] = new List<string>();
            }

            string[] lines = File.ReadAllLines(census, Encoding.UTF8);
            foreach (string ln in lines)
            {
                Match ms = rxSpec.Match(ln);
                if (!ms.Success || ms.Groups[1].Value != "carbon") continue;
                if (!rxAge.Match(ln).Success) continue;               // age eligibility (nulls are non-carbon reserved seats)
                Match md = rxDist.Match(ln);
                if (!md.Success || !byId.ContainsKey(md.Groups[1].Value)) continue;
                Match mi = rxId.Match(ln);
                if (!mi.Success) continue;
                string d = md.Groups[1].Value;
                if (byId[d].ContainsKey(mi.Groups[1].Value))
                    throw new InvalidOperationException("duplicate census id in district " + d + ": " + mi.Groups[1].Value);
                byId[d][mi.Groups[1].Value] = ln;
                idList[d].Add(mi.Groups[1].Value);
            }
            foreach (string d in idList.Keys)
            {
                Chk(idList[d].Count >= 100, "census district bucket suspiciously small: " + d + "=" + idList[d].Count);
                idList[d].Sort(StringComparer.Ordinal);
            }

            int fields = 0;
            for (int i = 0; i < ResidentIdentity.Count; i++)
            {
                string d = ResidentIdentity.DistrictOf(i);
                string pickId = idList[d][(ResidentIdentity.Seed + i * ResidentIdentity.Stride) % idList[d].Count];
                string ln = byId[d][pickId];
                ResidentIdentityEntry en = e[i];
                Chk(en.id == pickId, "cross id drift at slot " + i + ": baked " + en.id + " vs law " + pickId);
                Chk(en.name == Group(rxName, ln), "cross name drift at slot " + i);
                Chk(en.gender == Group(rxGen, ln), "cross gender drift at slot " + i);
                Chk(en.age == int.Parse(Group(rxAge, ln)), "cross age drift at slot " + i);
                Chk(en.faction == Group(rxFac, ln), "cross faction drift at slot " + i);
                Chk(en.block == Group(rxBlock, ln), "cross block drift at slot " + i);
                Chk(en.profession == Group(rxProf, ln), "cross profession drift at slot " + i);
                Chk((en.axis ?? "") == GroupSoft(rxAxis, ln), "cross axis drift at slot " + i);
                Chk((en.creed ?? "") == GroupSoft(rxCreed, ln), "cross creed drift at slot " + i);
                fields += 9;
            }
            return "12x" + fields / 12;
        }

        // read-only scene sanity: the r37 sprite layer and its r36/r35+r38
        // neighbors are still on disk (identity wiring must never touch them)
        static void SceneIntegrity(Scene scene)
        {
            int residents = 0, robots = 0, neon = 0;
            foreach (SpriteRenderer sr in UnityEngine.Object.FindObjectsOfType<SpriteRenderer>())
            {
                if (sr.name.StartsWith(ResidentRules.NamePrefix)) residents++;
                else if (sr.name.StartsWith(RobotRules.NamePrefix)) robots++;
                else if (sr.name.StartsWith(NeonRules.NamePrefix)) neon++;
            }
            Chk(residents == 12, "street residents lost: " + residents);
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
