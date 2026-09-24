// FluxVerse P-23(2) r41/r107: batch proof for the engine resident-barks pool
// (BigLife cognition layer-2 line pool baked for the 31 NARRATIVE street
// residents - the street canon r98/r107 roster; the one anchor seat never
// barks).
// Sentinel pattern (r39/r40 style):
//   pass 1: logs/barks.run         -> FluxVerse.ResidentBarksProof.BatchRun   -> logs/barks.done
//   pass 2: logs/barks-reload.run  -> FluxVerse.ResidentBarksProof.ReloadGate -> logs/barks-reload.done
// Sections:
//  A canon gates: context canon is the 12 draw.py keys, unique, in order;
//    <24-char law; <=2 bubbles law; fallback axis non-empty.
//  B data gates: pool parses; axis count == roster unique-axis count; every
//    axis carries exactly the 12 canon contexts in order; buckets 4..15
//    lines (BigLife layer-2 contract v1.8 water level); every line 4..24
//    chars, zero digits, non-blank; whole-pool line uniqueness (zero-dup
//    audit contract re-gated); roster = the 31 NARRATIVE street seats in
//    street slot order with EXACTLY ONE hole at the anchor slot 26, unique
//    C-##### ids, axes present in the pool.
//  C identity coupling (orphan-face law, street canon): the bark roster IS
//    the residents-street.json NARRATIVE subset - slot/id/axis equality per
//    street slot, layer==narrative on every barking seat, exactly ONE anchor
//    seat in the street file and it never carries a bark.
//  D vectors gate (dual implementation - the strongest gate): 310 baked law
//    vectors (31 residents x 5 contexts x 2 dates; PS md5 law over the real
//    pool; live-verified == python draw.py 12/12 on 2026-09-24) must be
//    reproduced byte-for-byte by the C# Pick; every vector line must live
//    inside its own C# bucket.
//  E law gates: pick determinism; unknown id/ctx -> honest null; draw.py
//    fallback-axis law (in-memory file); <24-char runtime guard (in-memory);
//    corrupt-file degrade -> null.
//  F context derivation gates (fact gate): events priority chain > weather >
//    clock; every clock tier; weekend overlay only on the clock tier.
//  G budget gates: <=2 speakers, roster subset, deterministic, rotates across
//    slots (>=2 distinct sets over slots 0..5).
//  H file gates: SHA256 recorded for the reload pass; importer .meta present
//    for both data files (r25 meta law).
//  Pass 2: fresh session - parse again, vectors again, SHA stability vs pass
//  1, metas persisted. Scene-free proof (v0 data slice owns no visuals).
// ASCII only. No 3D.
using System;
using System.Collections.Generic;
using System.IO;
using System.Security.Cryptography;
using System.Text;
using UnityEngine;
using UnityEditor;

namespace FluxVerse
{
    public static class ResidentBarksProof
    {
        static string RepoRoot { get { return Path.GetDirectoryName(Path.GetDirectoryName(Application.dataPath)); } }
        static string RunPath { get { return Path.Combine(RepoRoot, "logs", "barks.run"); } }
        static string DonePath { get { return Path.Combine(RepoRoot, "logs", "barks.done"); } }
        static string ReloadRunPath { get { return Path.Combine(RepoRoot, "logs", "barks-reload.run"); } }
        static string ReloadDonePath { get { return Path.Combine(RepoRoot, "logs", "barks-reload.done"); } }
        static string ShaPath { get { return Path.Combine(RepoRoot, "logs", "barks-sha.txt"); } }
        static string DataPath { get { return Path.Combine(Application.dataPath, ResidentBarks.DataRelPath); } }
        static string VectorsPath { get { return Path.Combine(Application.dataPath, ResidentBarks.VectorsRelPath); } }
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
            asserts = 0;

            // ---- A. canon gates ----
            Chk(ResidentBarks.ContextCanon.Length == 12, "context canon must hold 12 keys");
            for (int i = 0; i < ResidentBarks.ContextCanon.Length; i++)
                for (int j = i + 1; j < ResidentBarks.ContextCanon.Length; j++)
                    Chk(ResidentBarks.ContextCanon[i] != ResidentBarks.ContextCanon[j], "context canon has a duplicate key");
            Chk(ResidentBarks.MaxLineChars == 24, "<24-char engine law must be 24");
            Chk(ResidentBarks.MaxBubblesPerScreen == 2, "attention rationing must be 2 bubbles max");
            Chk(ResidentBarks.FallbackAxis.Length > 0, "fallback axis constant must be non-empty");

            // ---- B. data gates ----
            ResidentBarksFile f = ResidentBarks.Load(true);
            Chk(f != null, "barks data file must parse");
            Chk(f.axes != null && f.residents != null, "barks file must carry both faces");
            HashSet<string> rosterAxes = new HashSet<string>();
            for (int i = 0; i < f.residents.Length; i++)
            {
                BarkResidentRef r = f.residents[i];
                Chk(r != null, "roster entry null at " + i);
                // street-slot law (r107): entry i holds street slot i below the
                // anchor seat and slot i+1 above it - strictly ascending with
                // EXACTLY ONE hole at the anchor slot, 31 narrative seats.
                int expectSlot = (i < ResidentIdentity.AnchorSlot) ? i : i + 1;
                Chk(r.slot == expectSlot, "roster street-slot order drift at " + i + ": " + r.slot);
                Chk(r.id != null && System.Text.RegularExpressions.Regex.IsMatch(r.id, "^C-\\d{5}$"),
                    "bad census id at street slot " + r.slot + ": " + r.id);
                Chk(!string.IsNullOrEmpty(r.axis), "roster axis empty at street slot " + r.slot);
                rosterAxes.Add(r.axis);
            }
            Chk(f.residents.Length == ResidentBarks.RosterCount,
                "roster must hold the 31 narrative street seats, got " + f.residents.Length);
            Chk(f.axes.Length == rosterAxes.Count, "axis count must equal the roster's unique-axis count (" +
                f.axes.Length + " vs " + rosterAxes.Count + ")");
            HashSet<string> seenLine = new HashSet<string>();
            int lineTotal = 0;
            foreach (BarkAxis ax in f.axes)
            {
                Chk(ax != null && !string.IsNullOrEmpty(ax.axis), "axis entry null/empty");
                Chk(rosterAxes.Contains(ax.axis), "pool axis not used by any resident: " + ax.axis);
                Chk(ax.contexts != null && ax.contexts.Length == 12, "axis must hold 12 contexts: " + ax.axis);
                for (int c = 0; c < ax.contexts.Length; c++)
                {
                    BarkBucket b = ax.contexts[c];
                    Chk(b != null && b.ctx == ResidentBarks.ContextCanon[c],
                        "context canon order drift in axis " + ax.axis + " at " + c);
                    Chk(b.lines != null && b.lines.Length >= 4 && b.lines.Length <= 15,
                        "bucket out of 4..15 (BigLife layer-2 contract v1.8): " + ax.axis + "/" + b.ctx);
                    foreach (string ln in b.lines)
                    {
                        Chk(!string.IsNullOrEmpty(ln) && ln.Trim().Length > 0, "blank line in " + ax.axis + "/" + b.ctx);
                        Chk(ln.Length >= 4 && ln.Length <= ResidentBarks.MaxLineChars,
                            "line out of 4..24 chars in " + ax.axis + "/" + b.ctx + " len=" + ln.Length);
                        bool digit = false;
                        foreach (char ch in ln) if (ch >= '0' && ch <= '9') { digit = true; break; }
                        Chk(!digit, "digit inside a pool line (zero-number law) in " + ax.axis + "/" + b.ctx);
                        Chk(seenLine.Add(ln), "duplicate pool line (zero-dup law): " + ln);
                        lineTotal++;
                    }
                }
            }
            Chk(lineTotal >= 100, "suspiciously small pool: " + lineTotal + " lines");

            // ---- C. identity coupling (orphan-face law, street canon r107) ----
            ResidentIdentityEntry[] idents = ResidentIdentity.Load(true);
            Chk(idents != null, "street identity file must parse for the coupling gate");
            Chk(idents.Length == ResidentIdentity.Count, "street identity must hold 32 seats");
            int anchorSeats = 0;
            for (int i = 0; i < idents.Length; i++)
            {
                Chk(idents[i] != null && idents[i].slot == i, "street identity slot self-order drift at " + i);
                if (idents[i].layer == ResidentIdentity.AnchorLayer) anchorSeats++;
            }
            Chk(anchorSeats == 1, "street identity must carry exactly ONE anchor seat, got " + anchorSeats);
            Chk(idents[ResidentIdentity.AnchorSlot] != null &&
                idents[ResidentIdentity.AnchorSlot].layer == ResidentIdentity.AnchorLayer,
                "anchor-seat law: street slot " + ResidentIdentity.AnchorSlot + " must be the anchor");
            for (int i = 0; i < f.residents.Length; i++)
            {
                BarkResidentRef r = f.residents[i];
                ResidentIdentityEntry e = idents[r.slot];
                Chk(e != null, "bark street slot out of range: " + r.slot);
                Chk(e.id == r.id && e.axis == r.axis,
                    "bark roster != street identity at street slot " + r.slot +
                    " (a bark may only ride a live census identity)");
                Chk(e.layer == ResidentIdentity.NarrativeLayer,
                    "bark roster carries a non-narrative seat at street slot " + r.slot);
            }

            // ---- D. vectors gate (dual implementation) ----
            BarkVectorsFile vf = JsonUtility.FromJson<BarkVectorsFile>(File.ReadAllText(VectorsPath, Encoding.UTF8));
            Chk(vf != null && vf.vectors != null, "vectors file must parse");
            Chk(vf.vectors.Length == ResidentBarks.RosterCount * 5 * 2,
                "vectors must hold " + (ResidentBarks.RosterCount * 5 * 2) + " (31 ids x 5 ctx x 2 dates), got " +
                (vf.vectors == null ? -1 : vf.vectors.Length));
            HashSet<string> vecKeys = new HashSet<string>();
            foreach (BarkVector v in vf.vectors)
            {
                Chk(v != null && !string.IsNullOrEmpty(v.id) && !string.IsNullOrEmpty(v.date) &&
                    !string.IsNullOrEmpty(v.ctx) && !string.IsNullOrEmpty(v.line), "vector with an empty field");
                string k = v.id + "|" + v.date + "|" + v.ctx;
                Chk(vecKeys.Add(k), "duplicate vector key: " + k);
                string got = ResidentBarks.PickFrom(f, v.id, v.date, v.ctx);
                Chk(got != null && got == v.line, "C# pick != PS/python vector for " + k +
                    " got=[" + got + "] want=[" + v.line + "]");
                string[] bucket = ResidentBarks.BucketFor(f, v.id, v.ctx);
                bool inBucket = false;
                if (bucket != null) foreach (string ln in bucket) if (ln == v.line) { inBucket = true; break; }
                Chk(inBucket, "vector line not inside its C# bucket: " + k);
            }

            // ---- E. law gates ----
            string pick1 = ResidentBarks.Pick(f.residents[0].id, "2026-09-24", "morning");
            string pick2 = ResidentBarks.Pick(f.residents[0].id, "2026-09-24", "morning");
            Chk(pick1 != null && pick1 == pick2, "pick determinism broke");
            Chk(ResidentBarks.PickFrom(f, "C-99999", "2026-09-24", "morning") == null, "unknown id must yield null");
            Chk(ResidentBarks.PickFrom(f, f.residents[0].id, "2026-09-24", "no_such_ctx") == null, "unknown ctx must yield null");

            // fallback-axis law (in-memory, draw.py mirror)
            ResidentBarksFile ff = new ResidentBarksFile();
            BarkAxis fb = new BarkAxis(); fb.axis = ResidentBarks.FallbackAxis;
            BarkBucket fbb = new BarkBucket(); fbb.ctx = "morning"; fbb.lines = new string[] { "fb-a", "fb-b", "fb-c", "fb-d" };
            fb.contexts = new BarkBucket[] { fbb };
            ff.axes = new BarkAxis[] { fb };
            ff.residents = new BarkResidentRef[] { new BarkResidentRef { slot = 0, id = "C-00001", axis = "ghost" } };
            string fbPick = ResidentBarks.PickFrom(ff, "C-00001", "2026-09-24", "morning");
            Chk(fbPick != null && (fbPick == "fb-a" || fbPick == "fb-b" || fbPick == "fb-c" || fbPick == "fb-d"),
                "fallback-axis law broke (missing axis must fall to the default axis bucket)");
            // <24-char runtime guard (in-memory 25-char line)
            ResidentBarksFile fl = new ResidentBarksFile();
            BarkAxis flx = new BarkAxis(); flx.axis = "guard";
            BarkBucket flb = new BarkBucket(); flb.ctx = "morning";
            flb.lines = new string[] { "aaaaaaaaaaaaaaaaaaaaaaaaa" };   // 25 chars
            flx.contexts = new BarkBucket[] { flb };
            fl.axes = new BarkAxis[] { flx };
            fl.residents = new BarkResidentRef[] { new BarkResidentRef { slot = 0, id = "C-00002", axis = "guard" } };
            Chk(ResidentBarks.PickFrom(fl, "C-00002", "2026-09-24", "morning") == null,
                "25-char line must be refused by the runtime guard");
            // corrupt-file degrade
            string tmp = Path.Combine(RepoRoot, "logs", "barks-degrade.tmp");
            File.WriteAllText(tmp, "{ this is not json");
            Chk(ResidentBarks.LoadFrom(tmp) == null, "corrupt file must parse to null (honest degrade)");
            Chk(ResidentBarks.LoadFrom(Path.Combine(RepoRoot, "logs", "no-such-file.json")) == null,
                "missing file must parse to null (honest degrade)");
            File.Delete(tmp);

            // ---- F. context derivation gates (fact gate port) ----
            DateTime wed10 = new DateTime(2026, 9, 23, 10, 0, 0);   // Wednesday
            DateTime sat10 = new DateTime(2026, 9, 26, 10, 0, 0);   // Saturday
            DateTime sat03 = new DateTime(2026, 9, 26, 3, 0, 0);     // Saturday small hours
            Chk(ResidentBarks.DeriveContext(new string[] { "CEO_ORDER", "MARKET_OPEN" }, "", wed10) == "ceo_order",
                "event chain: CEO_ORDER must win");
            Chk(ResidentBarks.DeriveContext(new string[] { "MARKET_OPEN" }, "", wed10) == "market_open",
                "event chain: MARKET_OPEN second");
            Chk(ResidentBarks.DeriveContext(new string[] { "MARKET_CLOSE", "WEATHER_ALERT" }, "", wed10) == "market_close",
                "event chain: MARKET_CLOSE third");
            Chk(ResidentBarks.DeriveContext(new string[] { "WEATHER_ALERT" }, "", wed10) == "typhoon",
                "event chain: WEATHER_ALERT fourth (typhoon bucket, draw.py law)");
            Chk(ResidentBarks.DeriveContext(new string[] { "COMMIT" }, "rain", wed10) == "rain",
                "unknown event types must not block the weather tier");
            Chk(ResidentBarks.DeriveContext(null, "snow", wed10) == "coldsnap", "weather snow -> coldsnap");
            Chk(ResidentBarks.DeriveContext(null, "wind", wed10) == "typhoon", "weather wind -> typhoon");
            Chk(ResidentBarks.DeriveContext(null, "drizzle", wed10) == "rain", "weather drizzle -> rain");
            Chk(ResidentBarks.DeriveContext(null, "rain", sat10) == "rain", "weather must beat the clock (no weekend overlay)");
            Chk(ResidentBarks.DeriveContext(null, "fog", wed10) == "morning",
                "unknown weather kind must fall through to the clock tier");
            Chk(ResidentBarks.DeriveContext(null, "", new DateTime(2026, 9, 23, 5, 0, 0)) == "morning", "clock 05 -> morning");
            Chk(ResidentBarks.DeriveContext(null, "", new DateTime(2026, 9, 23, 11, 0, 0)) == "morning", "clock 11 -> morning");
            Chk(ResidentBarks.DeriveContext(null, "", new DateTime(2026, 9, 23, 12, 0, 0)) == "morning", "clock 12 -> morning");
            Chk(ResidentBarks.DeriveContext(null, "", new DateTime(2026, 9, 23, 15, 0, 0)) == "dusk", "clock 15 -> dusk");
            Chk(ResidentBarks.DeriveContext(null, "", new DateTime(2026, 9, 23, 17, 0, 0)) == "dusk", "clock 17 -> dusk");
            Chk(ResidentBarks.DeriveContext(null, "", new DateTime(2026, 9, 23, 19, 0, 0)) == "night", "clock 19 -> night");
            Chk(ResidentBarks.DeriveContext(null, "", new DateTime(2026, 9, 23, 3, 0, 0)) == "night", "clock 03 -> night");
            Chk(ResidentBarks.DeriveContext(null, "", sat10) == "weekend", "weekend overlay: Saturday morning -> weekend");
            Chk(ResidentBarks.DeriveContext(null, "", sat03) == "weekend",
                "weekend overlay covers the night tier too (draw.py overlays morning/dusk/night)");
            Chk(ResidentBarks.DeriveContext(null, "", wed10) == "morning", "weekday morning stays morning");

            // ---- G. budget gates ----
            string[][] sets = new string[6][];
            HashSet<string> rosterIds = new HashSet<string>();
            foreach (BarkResidentRef r in f.residents) rosterIds.Add(r.id);
            for (int s = 0; s < 6; s++)
            {
                string[] a = ResidentBarks.BudgetedSpeakersFrom(f, "2026-09-24", "morning", s);
                string[] b = ResidentBarks.BudgetedSpeakersFrom(f, "2026-09-24", "morning", s);
                Chk(a.Length == b.Length, "budget determinism broke (length) at slot " + s);
                for (int i = 0; i < a.Length; i++) Chk(a[i] == b[i], "budget determinism broke at slot " + s);
                Chk(a.Length <= ResidentBarks.MaxBubblesPerScreen, "budget exceeds the <=2 law at slot " + s);
                foreach (string id in a) Chk(rosterIds.Contains(id), "budget picked a non-roster id: " + id);
                sets[s] = a;
            }
            int distinct = 0;
            for (int i = 0; i < 6; i++)
                for (int j = i + 1; j < 6; j++)
                {
                    bool same = sets[i].Length == sets[j].Length;
                    if (same) for (int k = 0; k < sets[i].Length; k++) if (sets[i][k] != sets[j][k]) { same = false; break; }
                    if (!same) { distinct++; break; }
                }
            Chk(distinct >= 1, "budget must rotate speakers across slots (all 6 slots identical)");

            // ---- H. file gates ----
            string sha = Sha256File(DataPath);
            File.WriteAllText(ShaPath, sha);
            Chk(File.Exists(DataPath + ".meta"), "pool json .meta missing (r25 meta law)");
            Chk(File.Exists(VectorsPath + ".meta"), "vectors json .meta missing (r25 meta law)");

            return "asserts=" + asserts + " lines=" + lineTotal + " vectors=" + vf.vectors.Length + " sha=" + sha.Substring(0, 16);
        }

        static string ReloadProve()
        {
            asserts = 0;
            ResidentBarksFile f = ResidentBarks.Load(true);
            Chk(f != null && f.residents != null && f.residents.Length == ResidentBarks.RosterCount,
                "fresh-session parse must hold the 31-seat narrative roster");
            BarkVectorsFile vf = JsonUtility.FromJson<BarkVectorsFile>(File.ReadAllText(VectorsPath, Encoding.UTF8));
            Chk(vf != null && vf.vectors != null && vf.vectors.Length == ResidentBarks.RosterCount * 5 * 2,
                "fresh-session vectors parse");
            int vecOk = 0;
            foreach (BarkVector v in vf.vectors)
            {
                string got = ResidentBarks.PickFrom(f, v.id, v.date, v.ctx);
                Chk(got != null && got == v.line, "reload vector drift for " + v.id + "|" + v.date + "|" + v.ctx);
                vecOk++;
            }
            string sha = Sha256File(DataPath);
            string prev = File.Exists(ShaPath) ? File.ReadAllText(ShaPath).Trim() : "";
            Chk(prev == sha, "SHA stability broke across sessions: " + prev + " vs " + sha);
            Chk(File.Exists(DataPath + ".meta"), "pool json .meta must persist");
            Chk(File.Exists(VectorsPath + ".meta"), "vectors json .meta must persist");
            return "asserts=" + asserts + " vectors_replayed=" + vecOk + " sha_stable=" + sha.Substring(0, 16);
        }

        static string Sha256File(string path)
        {
            using (SHA256 s = SHA256.Create())
            {
                byte[] h = s.ComputeHash(File.ReadAllBytes(path));
                StringBuilder sb = new StringBuilder();
                foreach (byte b in h) sb.Append(b.ToString("x2"));
                return sb.ToString();
            }
        }
    }
}
