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
//  D runtime law gate (r144: the 310-vector pre-bake is RETIRED - the mood
//    dimension carries live event density and cannot be pre-baked): the pick
//    law is recomputed HERE over the FULL pool - every roster id x 12 canon
//    contexts x 2 dates, in-proof formula independent of PickFrom.
//  E law gates: pick determinism; unknown id/ctx -> honest null; draw.py
//    fallback-axis law (in-memory file); <24-char runtime guard (in-memory);
//    corrupt-file degrade -> null.
//  F context derivation gates (fact gate): events priority chain > weather >
//    clock; every clock tier; weekend overlay only on the clock tier; the
//    fact-gate source mirror (event/weather/clock, r144 out-src overload).
//  M mood mirror gates (r144, python mood_director.py = the law source):
//    calendar parse/rejection laws; 13 golden derive-state cases (python
//    injected, all five states + 05:00/05:01 boundary + three priority
//    flips); python WEIGHTS/SPOTLIGHT table golden; 90 golden lottery pairs
//    (seed law "<id>|<date>||<mood>"); fact-gate keep; zero-drift steady;
//    determinism + selection-domain battery; somber fact-bucket-weak.
//  G budget gates: <=2 speakers, roster subset, deterministic, rotates across
//    slots (>=2 distinct sets over slots 0..5).
//  H file gates: SHA256 recorded for the reload pass; importer .meta present
//    for pool + mood calendar (r25 meta law).
//  Pass 2: fresh session - parse again, law replay again, SHA stability vs
//  pass 1, metas persisted. Scene-free proof (v0 data slice owns no visuals).
// ASCII only (CJK as \u escapes). No 3D.
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
        static string CalendarPath { get { return Path.Combine(Application.dataPath, MoodDirector.CalendarRelPath); } }
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

            // ---- D. runtime law gate (r144: vectors pre-bake retired - the
            // mood dimension carries live event density and cannot be
            // pre-baked; the law is recomputed here over the FULL pool) ----
            // every roster id x 12 canon contexts x 2 dates: expected =
            // bucket[md5("id|date|ctx") first-4-digest-bytes big-endian %
            // len], computed by this in-proof formula (independent of
            // PickFrom), compared against the C# pick byte-for-byte.
            string[] lawDates = new string[] { "2026-09-24", "2027-01-01" };
            int lawChecked = 0;
            foreach (BarkResidentRef lr in f.residents)
            {
                foreach (string lctx in ResidentBarks.ContextCanon)
                {
                    string[] bucket = ResidentBarks.BucketFor(f, lr.id, lctx);
                    Chk(bucket != null && bucket.Length > 0, "law bucket absent: " + lr.id + "/" + lctx);
                    foreach (string ldate in lawDates)
                    {
                        string key = lr.id + "|" + ldate + "|" + lctx;
                        byte[] h;
                        using (MD5 md5 = MD5.Create()) h = md5.ComputeHash(Encoding.UTF8.GetBytes(key));
                        uint v = ((uint)h[0] << 24) | ((uint)h[1] << 16) | ((uint)h[2] << 8) | (uint)h[3];
                        string expect = bucket[(int)(v % (uint)bucket.Length)];
                        string got = ResidentBarks.PickFrom(f, lr.id, ldate, lctx);
                        Chk(got != null && got == expect, "pick law drift for " + key +
                            " got=[" + got + "] want=[" + expect + "]");
                        lawChecked++;
                    }
                }
            }
            Chk(lawChecked == ResidentBarks.RosterCount * 12 * 2,
                "law coverage must be 31x12x2, got " + lawChecked);

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
            // fact-gate source mirror (r144 out-src overload, draw.py law)
            string srcOut;
            Chk(ResidentBarks.DeriveContext(new string[] { "MARKET_OPEN" }, "", wed10, out srcOut) == "market_open"
                && srcOut == "event", "fact-gate src must read event on the events tier");
            Chk(ResidentBarks.DeriveContext(null, "rain", wed10, out srcOut) == "rain"
                && srcOut == "weather", "fact-gate src must read weather on the weather tier");
            Chk(ResidentBarks.DeriveContext(null, "", wed10, out srcOut) == "morning"
                && srcOut == "clock", "fact-gate src must read clock on the clock tier");
            Chk(ResidentBarks.DeriveContext(null, "", sat10, out srcOut) == "weekend"
                && srcOut == "clock", "weekend overlay must keep src==clock (draw.py law)");

            // ---- M. mood mirror gates (r144; python mood_director.py is the
            // law source - golden values were computed BY the python module
            // with injected cases and embedded here; evidence
            // logs/devloop-r144-golden.py + logs/devloop-r144-golden.json) ----

            // M1 calendar laws: parse, law-source rejection, festival hits
            MoodCalRow[] rows = MoodDirector.LoadCalendar(true);
            Chk(rows != null && rows.Length >= 5, "mood calendar must parse with sourced rows");
            for (int i = 0; i < rows.Length; i++)
                Chk(!string.IsNullOrEmpty(rows[i].date) && !string.IsNullOrEmpty(rows[i].source),
                    "calendar row without a law-source pointer: " + i);
            MoodCalRow hit = MoodDirector.HitFestival(new DateTime(2026, 10, 1, 12, 0, 0), rows);
            Chk(hit != null && hit.name == "\u56fd\u5e86\u8282", "10-01 must hit the National Day calendar row");
            MoodCalRow[] yr = new MoodCalRow[] { new MoodCalRow { date = "2026-05-01", name = "t", source = "s" } };
            Chk(MoodDirector.HitFestival(new DateTime(2026, 5, 1, 9, 0, 0), yr) != null,
                "YYYY-MM-DD row must hit its own year");
            Chk(MoodDirector.HitFestival(new DateTime(2027, 5, 1, 9, 0, 0), yr) == null,
                "YYYY-MM-DD row must miss other years");
            Chk(MoodDirector.ParseCalendar("{\"festivals\":[{\"date\":\"01-01\",\"name\":\"x\"}]}") == null,
                "calendar row without a source must be rejected (no invented holidays)");
            Chk(MoodDirector.ParseCalendar("{\"festivals\":[{\"date\":\"01-02\",\"name\":\"y\",\"source\":\" \"}]}") == null,
                "blank source must be rejected");
            Chk(MoodDirector.ParseCalendar("not json") == null, "corrupt calendar must parse null");
            Chk(MoodDirector.DeriveState(DateTime.Now, 0, 12, false, "", null) == null,
                "absent calendar rows must yield a null mood (honest degrade)");

            // M2 golden derive-state battery (13 python-injected cases: five
            // states, the 05:00/05:01 boundary, three priority flips, a
            // custom density threshold)
            string[] dgAt = new string[] { "2026-09-23 14:30", "2026-09-23 14:30", "2026-09-23 02:00",
                "2026-09-23 02:00", "2026-09-23 05:00", "2026-09-23 05:01", "2026-10-01 12:00",
                "2026-10-01 12:00", "2026-10-01 12:00", "2026-09-23 14:30", "2026-10-01 12:00",
                "2026-10-01 12:00", "2026-09-23 14:30" };
            int[] dgEv = new int[] { 0, 12, 12, 0, 0, 0, 0, 0, 0, 11, 999, 0, 5 };
            int[] dgDense = new int[] { 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 5 };
            bool[] dgAlert = new bool[] { false, false, false, false, false, false, false,
                true, false, false, false, true, false };
            string[] dgWx = new string[] { "", "", "", "", "", "", "", "", "typhoon", "", "", "clear", "" };
            string[] dgMood = new string[] { "steady", "lively", "lively", "hushed", "hushed", "steady",
                "festive", "somber", "somber", "steady", "festive", "somber", "lively" };
            string[] dgSource = new string[] { "baseline", "density:12>=12", "density:12>=12",
                "night-window", "night-window", "baseline", "calendar:\u56fd\u5e86\u8282",
                "event:WEATHER_ALERT", "weather:typhoon", "baseline", "calendar:\u56fd\u5e86\u8282",
                "event:WEATHER_ALERT", "density:5>=5" };
            int[] dgSpot = new int[] { 40, 40, 40, 24, 24, 40, 40, 32, 32, 40, 40, 32, 40 };
            for (int i = 0; i < dgAt.Length; i++)
            {
                DateTime at = DateTime.ParseExact(dgAt[i], "yyyy-MM-dd HH:mm",
                    System.Globalization.CultureInfo.InvariantCulture);
                MoodState st = MoodDirector.DeriveState(at, dgEv[i], dgDense[i], dgAlert[i], dgWx[i], rows);
                Chk(st != null, "derive golden: null state at case " + i);
                Chk(st.Mood == dgMood[i], "derive golden mood drift at " + dgAt[i] + ": "
                    + st.Mood + " want " + dgMood[i]);
                Chk(st.Source == dgSource[i], "derive golden source drift at " + dgAt[i] + ": " + st.Source);
                Chk(st.SpotlightMax == dgSpot[i], "derive golden spotlight drift at " + dgAt[i]);
                Chk(st.EngineV == MoodDirector.EngineV, "engine version law at " + dgAt[i]);
            }

            // M3 python WEIGHTS / SPOTLIGHT table golden (sorted key order)
            string[][] wtb = new string[][] { new string[] { }, new string[] { "market_open" },
                new string[] { "festival", "market_open" }, new string[] { "market_open", "night" },
                new string[] { "night" } };
            double[][] wtv = new double[][] { new double[] { }, new double[] { 2.0 },
                new double[] { 2.0, 2.0 }, new double[] { 0.5, 2.0 }, new double[] { 2.0 } };
            int[] wsp = new int[] { 40, 40, 40, 32, 24 };
            for (int i = 0; i < MoodDirector.Moods.Length; i++)
            {
                string mood = MoodDirector.Moods[i];
                string[] wb = MoodDirector.WeightBucketsOf(mood);
                double[] wv = MoodDirector.WeightValuesOf(mood);
                Chk(wb.Length == wtb[i].Length && wv.Length == wtb[i].Length,
                    "weights table arity drift: " + mood);
                for (int k = 0; k < wb.Length; k++)
                {
                    Chk(wb[k] == wtb[i][k], "weights key drift: " + mood + " " + wb[k]);
                    Chk(wv[k] == wtv[i][k], "weights value drift: " + mood + "/" + wb[k]);
                    Chk(wv[k] >= MoodDirector.WMin && wv[k] <= MoodDirector.WMax,
                        "weights out of the closed band: " + mood + "/" + wb[k]);
                    Chk(System.Array.IndexOf(ResidentBarks.ContextCanon, wb[k]) >= 0,
                        "weights key not a canon context: " + wb[k]);
                }
                Chk(MoodDirector.SpotlightMaxOf(mood) == wsp[i], "spotlight table drift: " + mood);
                Chk(MoodDirector.SpotlightMaxOf(mood) >= MoodDirector.SpotMin
                    && MoodDirector.SpotlightMaxOf(mood) <= MoodDirector.SpotTop,
                    "spotlight out of band: " + mood);
            }

            // M4 golden lottery battery (90 python pairs; iteration order =
            // mood x ctx x seed, ids C-00001/2/3, dates 2026-09-25/26/
            // 2026-10-01; the seed law "<id>|<date>||<mood>" - the EMPTY
            // slot segment is the draw.py barks-tier law, pinned separately)
            Chk(CityBubbles.MoodSeed("C-00001", "2026-09-25", "festive") == "C-00001|2026-09-25||festive",
                "mood seed law must read <id>|<date>||<mood>");
            string[] gmCtx = new string[] { "morning", "dusk", "night", "weekend", "market_open", "festival" };
            string[] gmId = new string[] { "C-00001", "C-00002", "C-00003" };
            string[] gmDate = new string[] { "2026-09-25", "2026-09-26", "2026-10-01" };
            string[] lotteryGolden = new string[] {
                // steady (python golden agrees with the zero-drift law)
                "morning","morning","morning", "dusk","dusk","dusk", "night","night","night",
                "weekend","weekend","weekend", "market_open","market_open","market_open",
                "festival","festival","festival",
                // lively
                "market_open","market_open","market_open", "market_open","market_open","market_open",
                "market_open","market_open","market_open", "market_open","market_open","market_open",
                "market_open","market_open","market_open", "market_open","market_open","market_open",
                // festive
                "festival","festival","market_open", "festival","festival","market_open",
                "festival","festival","market_open", "festival","festival","market_open",
                "market_open","market_open","festival", "festival","festival","market_open",
                // somber
                "night","morning","night", "night","dusk","night", "night","night","night",
                "night","weekend","night", "night","market_open","night", "night","festival","night",
                // hushed
                "morning","night","night", "dusk","night","night", "night","night","night",
                "weekend","night","night", "market_open","night","night", "festival","night","night" };
            Chk(lotteryGolden.Length == MoodDirector.Moods.Length * gmCtx.Length * gmId.Length,
                "lottery golden arity must be 5x6x3");
            int gi = 0;
            foreach (string mood in MoodDirector.Moods)
            {
                MoodState gst = MoodFor(mood, rows);
                Chk(gst != null && gst.Mood == mood, "golden mood construct drifted: " + mood);
                for (int c = 0; c < gmCtx.Length; c++)
                    for (int s = 0; s < gmId.Length; s++)
                    {
                        string seed = CityBubbles.MoodSeed(gmId[s], gmDate[s], mood);
                        string want = lotteryGolden[gi++];
                        string got = MoodDirector.MoodCtxLottery(gmCtx[c], MoodDirector.SrcClock, gst, seed);
                        Chk(got == want, "lottery golden drift: mood=" + mood + " ctx=" + gmCtx[c]
                            + " seed=" + seed + " got=" + got + " want=" + want);
                    }
            }

            // M5 law battery (python --qc port): fact-gate keep, null state,
            // zero-drift steady, determinism + selection domain, fact-bucket
            // weak floor, deep-night boundary
            MoodState festSt = MoodFor("festive", rows);
            Chk(MoodDirector.MoodCtxLottery("morning", "event", festSt, "gk") == "morning",
                "fact gate: event src must never re-roll");
            Chk(MoodDirector.MoodCtxLottery("morning", "weather", festSt, "gk") == "morning",
                "fact gate: weather src must never re-roll");
            Chk(MoodDirector.MoodCtxLottery("morning", "manual", festSt, "gk") == "morning",
                "fact gate: manual src must never re-roll");
            Chk(MoodDirector.MoodCtxLottery("morning", MoodDirector.SrcClock, null, "gk") == "morning",
                "null state must keep the fact ctx");
            MoodState steadySt = MoodFor("steady", rows);
            for (int c = 0; c < ResidentBarks.ContextCanon.Length; c++)
                Chk(MoodDirector.MoodCtxLottery(ResidentBarks.ContextCanon[c], MoodDirector.SrcClock,
                    steadySt, "k" + c) == ResidentBarks.ContextCanon[c], "steady must never re-roll");
            foreach (string mood in MoodDirector.Moods)
            {
                MoodState gst = MoodFor(mood, rows);
                string[] up = MoodDirector.WeightBucketsOf(mood);
                double[] upv = MoodDirector.WeightValuesOf(mood);
                for (int i = 0; i < 20; i++)
                {
                    string seed = "C-" + i.ToString("D5") + "|2026-09-23||" + mood;
                    string a = MoodDirector.MoodCtxLottery("morning", MoodDirector.SrcClock, gst, seed);
                    string b = MoodDirector.MoodCtxLottery("morning", MoodDirector.SrcClock, gst, seed);
                    Chk(a == b, "lottery determinism broke: " + mood + "#" + i);
                    bool inDomain = a == "morning";
                    for (int u = 0; u < up.Length; u++)
                        if (up[u] != "morning" && upv[u] > 1.0 && a == up[u]) inDomain = true;
                    Chk(inDomain, "lottery escaped the candidate domain: " + mood + " -> " + a);
                }
            }
            MoodState somberSt = MoodFor("somber", rows);
            for (int i = 0; i < 10; i++)
            {
                string s2 = MoodDirector.MoodCtxLottery("market_open", MoodDirector.SrcClock, somberSt, "seed-" + i);
                Chk(s2 == "market_open" || s2 == "night",
                    "somber fact-bucket weak law (0.5 floor): " + s2);
            }
            Chk(MoodDirector.DeepNight(new DateTime(2026, 9, 23, 5, 0, 0)), "05:00 must sit in deep night");
            Chk(!MoodDirector.DeepNight(new DateTime(2026, 9, 23, 5, 1, 0)), "05:01 must leave deep night");

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
            Chk(File.Exists(CalendarPath), "mood calendar must be present (Data/mood-calendar.json, r144)");
            Chk(File.Exists(CalendarPath + ".meta"), "calendar .meta missing (r25 meta law)");

            return "asserts=" + asserts + " lines=" + lineTotal + " law_recomputed=" + lawChecked
                + " mood_golden=13+90" + " sha=" + sha.Substring(0, 16);
        }

        // construct a REAL MoodState for a given mood (derive inputs mirror
        // the python golden driver); the caller re-asserts the mood - the
        // construct never bypasses DeriveState.
        static MoodState MoodFor(string mood, MoodCalRow[] rows)
        {
            switch (mood)
            {
                case "steady": return MoodDirector.DeriveState(new DateTime(2026, 9, 23, 14, 30, 0), 0, 12, false, "", rows);
                case "lively": return MoodDirector.DeriveState(new DateTime(2026, 9, 23, 14, 30, 0), 12, 12, false, "", rows);
                case "festive": return MoodDirector.DeriveState(new DateTime(2026, 10, 1, 12, 0, 0), 0, 12, false, "", rows);
                case "somber": return MoodDirector.DeriveState(new DateTime(2026, 10, 1, 12, 0, 0), 0, 12, true, "", rows);
                default: return MoodDirector.DeriveState(new DateTime(2026, 9, 23, 2, 0, 0), 0, 12, false, "", rows);
            }
        }

        static string ReloadProve()
        {
            asserts = 0;
            ResidentBarksFile f = ResidentBarks.Load(true);
            Chk(f != null && f.residents != null && f.residents.Length == ResidentBarks.RosterCount,
                "fresh-session parse must hold the 31-seat narrative roster");
            MoodCalRow[] rows = MoodDirector.LoadCalendar(true);
            Chk(rows != null && rows.Length >= 5, "fresh-session mood calendar parse");
            Chk(MoodDirector.HitFestival(new DateTime(2026, 10, 1, 12, 0, 0), rows) != null,
                "fresh-session calendar 10-01 hit");
            int lawOk = 0;
            foreach (BarkResidentRef r in f.residents)
                foreach (string ctx in ResidentBarks.ContextCanon)
                {
                    string got = ResidentBarks.PickFrom(f, r.id, "2026-09-24", ctx);
                    Chk(got != null, "reload pick law absent: " + r.id + "/" + ctx);
                    lawOk++;
                }
            string sha = Sha256File(DataPath);
            string prev = File.Exists(ShaPath) ? File.ReadAllText(ShaPath).Trim() : "";
            Chk(prev == sha, "SHA stability broke across sessions: " + prev + " vs " + sha);
            Chk(File.Exists(DataPath + ".meta"), "pool json .meta must persist");
            Chk(File.Exists(Path.Combine(Application.dataPath, MoodDirector.CalendarRelPath) + ".meta"),
                "calendar .meta must persist");
            return "asserts=" + asserts + " law_replayed=" + lawOk + " sha_stable=" + sha.Substring(0, 16);
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
