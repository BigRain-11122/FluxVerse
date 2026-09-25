// FluxVerse P-71(3) r144: city mood director engine-side mirror - pure core.
// Byte-mirrors BigLife Tools/mood_director.py v1.0 (the LAW SOURCE; python
// contract = BigLife cognition/MOOD-DIRECTOR.md v1.0, T-20260924-16c): the
// director only shifts BUCKET SELECTION on the clock tier (weighted lottery,
// draw.py L301-303 law) - fact-gate contexts (event/weather) and individual
// personas are never rewritten. mood = f(date, time-of-day, event density),
// closed five-state set, priority somber > festive > lively > hushed >
// steady (negative signal first). Zero LLM, pure deterministic md5.
//
// Mirror deltas vs python (science-judgment notes, commit-referenced):
//   - python load_calendar() sys.exit's on a bad row (fail loud at the
//     source). The engine core returns null instead: the runtime face
//     reads null as "mood absent" and keeps the fact-gate context (honest
//     silence, pre-mood law); the PROOF fails loud on the calendar.
//   - python m_int() builds an arbitrary-precision int then takes % 100000;
//     C# reduces the 16 digest bytes big-endian incrementally
//     (acc*256+b) mod 100000 - the same residue, no BigInteger. Both are
//     golden-pair gated against python output in ResidentBarksProof M.
//
// Law (byte-mirrors mood_director.py):
//   - derive_state inputs: at (minute-granular), events (24h density),
//     dense_at (threshold, default 12), alert (WEATHER_ALERT inside 24h),
//     weather_kind, calendar rows (festival law-source rows only).
//   - deep-night window 00:00-05:00, the 05:00 minute INCLUDED.
//   - festival rows: MM-DD hit every year, YYYY-MM-DD own year only; a row
//     without a law-source pointer is rejected (no invented holidays).
//   - mood_ctx_lottery: only on src=="clock" with non-empty weights.
//     Candidates = fact bucket FIRST (weight floored at 0.5, default 1.0)
//     then every upweighted bucket (w > 1.0) in sorted key order; roll =
//     md5("mood-lottery|<seed>") mod 100000 / 100000.0 * total, cumulative
//     pick - same seed => same bucket forever, winning domain stays inside
//     {fact bucket} + upweighted set (python selection-domain law).
//
// Data: Assets/Data/mood-calendar.json (read-only copy of BigLife
// cognition/mood-calendar.json, r97 copy pattern; re-copy on calendar
// updates). ASCII source law. Pure 2D. No 3D.
using System;
using System.IO;
using System.Security.Cryptography;
using System.Text;
using UnityEngine;

namespace FluxVerse
{
    [Serializable]
    public class MoodCalRow
    {
        public string date;    // MM-DD (yearly) or YYYY-MM-DD (own year)
        public string name;    // festival name (defaults to date)
        public string source; // law-source pointer (required - no invention)
    }

    [Serializable]
    public class MoodCalendarFile
    {
        public int v;
        public string note;
        public MoodCalRow[] festivals;
    }

    public class MoodState
    {
        public string At;             // "yyyy-MM-dd HH:mm" (minute-granular)
        public string Mood;          // steady/lively/festive/somber/hushed
        public string Source;        // derivation trace
        public int EventDensity;
        public int DenseAt;
        public int SpotlightMax;     // mood-driven spotlight ceiling [24,40]
        public string[] WeightBuckets;   // ordinal-sorted key order
        public double[] WeightValues;    // parallel to WeightBuckets
        public string EngineV;
    }

    // pure static core: calendar parse + state derivation + weighted
    // lottery. No MonoBehaviour (nothing wires into the scene).
    public static class MoodDirector
    {
        public const string CalendarRelPath = "Data/mood-calendar.json";
        public const int DenseDefault = 12;                 // lively threshold (python DENSE_DEFAULT)
        public const int SpotMin = 24, SpotTop = 40;        // spotlight float band, never above 40
        public const double WMin = 0.5, WMax = 2.0;         // weight multiplier closed band
        public const string SrcClock = "clock";
        public const string EngineV = "v1.0";

        public static readonly string[] Moods = new string[]
        { "steady", "lively", "festive", "somber", "hushed" };

        static readonly string[] SomberKinds = new string[] { "typhoon", "gale", "storm" };

        // per-mood context-bucket weight tables (python WEIGHTS mirror;
        // pairs held in sorted key order - python dict(sorted(...))).
        // steady = empty (zero drift, the baseline never re-rolls).
        static readonly string[][] WBuckets = new string[][]
        {
            new string[] { },
            new string[] { "market_open" },
            new string[] { "festival", "market_open" },
            new string[] { "market_open", "night" },
            new string[] { "night" }
        };
        static readonly double[][] WValues = new double[][]
        {
            new double[] { },
            new double[] { 2.0 },
            new double[] { 2.0, 2.0 },
            new double[] { 0.5, 2.0 },
            new double[] { 2.0 }
        };
        static readonly int[] SpotlightCeil = new int[] { 40, 40, 40, 32, 24 };

        static MoodCalRow[] cache;

        static int MoodIndex(string mood)
        {
            for (int i = 0; i < Moods.Length; i++) if (Moods[i] == mood) return i;
            return -1;
        }

        public static int SpotlightMaxOf(string mood)
        { int i = MoodIndex(mood); return i < 0 ? SpotTop : SpotlightCeil[i]; }

        public static string[] WeightBucketsOf(string mood)
        { int i = MoodIndex(mood); return i < 0 ? new string[0] : (string[])WBuckets[i].Clone(); }

        public static double[] WeightValuesOf(string mood)
        { int i = MoodIndex(mood); return i < 0 ? new double[0] : (double[])WValues[i].Clone(); }

        // parse Assets/Data/mood-calendar.json with the python rejection law
        // (every row must carry date + non-blank law source). Null = honest
        // absence: the runtime keeps the fact-gate context; the PROOF fails
        // loud on a missing/defective calendar.
        public static MoodCalRow[] LoadCalendar(bool force = false)
        {
            if (cache != null && !force) return cache;
            string path = Path.Combine(Application.dataPath, CalendarRelPath);
            MoodCalRow[] rows = ParseCalendar(File.Exists(path)
                ? File.ReadAllText(path, Encoding.UTF8) : null);
            if (rows != null) cache = rows;
            return rows;
        }

        // text-parameterized parse (proof / degrade face). Null on any defect.
        public static MoodCalRow[] ParseCalendar(string json)
        {
            if (string.IsNullOrEmpty(json)) return null;
            MoodCalendarFile f = null;
            try { f = JsonUtility.FromJson<MoodCalendarFile>(json); }
            catch { return null; }
            if (f == null || f.festivals == null) return null;
            MoodCalRow[] rows = new MoodCalRow[f.festivals.Length];
            for (int i = 0; i < f.festivals.Length; i++)
            {
                MoodCalRow r = f.festivals[i];
                if (r == null) return null;
                string date = (r.date ?? "").Trim();
                string src = (r.source ?? "").Trim();
                string name = (r.name ?? "").Trim();
                if (date.Length == 0 || src.Length == 0) return null;   // no invented holidays
                rows[i] = new MoodCalRow { date = date, source = src,
                    name = name.Length > 0 ? name : date };
            }
            return rows;
        }

        public static void Unload() { cache = null; }

        // festival hit (python hit_festival): MM-DD rows fire every year,
        // YYYY-MM-DD rows only their own year. First hit wins.
        public static MoodCalRow HitFestival(DateTime at, MoodCalRow[] rows)
        {
            if (rows == null) return null;
            string md = at.ToString("MM-dd", System.Globalization.CultureInfo.InvariantCulture);
            string full = at.ToString("yyyy-MM-dd", System.Globalization.CultureInfo.InvariantCulture);
            for (int i = 0; i < rows.Length; i++)
            {
                MoodCalRow r = rows[i];
                if (r == null || string.IsNullOrEmpty(r.date)) continue;
                if (r.date == full || r.date == md) return r;
            }
            return null;
        }

        // deep-night window 00:00-05:00, the 05:00 minute included
        // (MOOD-DIRECTOR.md sec 4.6 boundary).
        public static bool DeepNight(DateTime at)
        {
            return at.Hour < 5 || (at.Hour == 5 && at.Minute == 0);
        }

        // mood = f(date, time-of-day, event density) - python derive_state.
        // Null when the calendar rows are absent (honest-degrade delta).
        public static MoodState DeriveState(DateTime at, int events, int denseAt, bool alert,
            string weatherKind, MoodCalRow[] rows)
        {
            if (rows == null) return null;
            if (denseAt < 1) denseAt = 1;   // python CLI gate: dense_at valid domain >= 1
            string mood, source;
            if (alert) { mood = "somber"; source = "event:WEATHER_ALERT"; }
            else if (!string.IsNullOrEmpty(weatherKind) && Array.IndexOf(SomberKinds, weatherKind) >= 0)
            { mood = "somber"; source = "weather:" + weatherKind; }
            else
            {
                MoodCalRow fest = HitFestival(at, rows);
                if (fest != null) { mood = "festive"; source = "calendar:" + fest.name; }
                else if (events >= denseAt) { mood = "lively"; source = "density:" + events + ">=" + denseAt; }
                else if (DeepNight(at)) { mood = "hushed"; source = "night-window"; }
                else { mood = "steady"; source = "baseline"; }
            }
            int mi = MoodIndex(mood);
            return new MoodState
            {
                At = at.ToString("yyyy-MM-dd HH:mm", System.Globalization.CultureInfo.InvariantCulture),
                Mood = mood,
                Source = source,
                EventDensity = events,
                DenseAt = denseAt,
                SpotlightMax = SpotlightCeil[mi],
                WeightBuckets = WBuckets[mi],
                WeightValues = WValues[mi],
                EngineV = EngineV
            };
        }

        // weighted bucket re-roll - python mood_ctx_lottery. Only on the
        // clock tier with live weights; fact-gate contexts never move; the
        // winning bucket stays inside the fact bucket's own candidate set.
        public static string MoodCtxLottery(string ctx, string src, MoodState st, string seedKey)
        {
            if (st == null || src != SrcClock ||
                st.WeightBuckets == null || st.WeightBuckets.Length == 0)
                return ctx;
            // fact bucket first: its own weight (default 1.0) floored at WMin
            double factW = 1.0;
            for (int i = 0; i < st.WeightBuckets.Length; i++)
                if (st.WeightBuckets[i] == ctx) { factW = st.WeightValues[i]; break; }
            if (factW < WMin) factW = WMin;
            // upweighted others, in the state's sorted key order
            int n = 1;
            for (int i = 0; i < st.WeightBuckets.Length; i++)
                if (st.WeightBuckets[i] != ctx && st.WeightValues[i] > 1.0) n++;
            if (n == 1) return ctx;   // nothing upweighted besides the fact
            string[] candB = new string[n];
            double[] candW = new double[n];
            candB[0] = ctx; candW[0] = factW;
            int k = 1;
            for (int i = 0; i < st.WeightBuckets.Length; i++)
                if (st.WeightBuckets[i] != ctx && st.WeightValues[i] > 1.0)
                { candB[k] = st.WeightBuckets[i]; candW[k] = st.WeightValues[i]; k++; }
            double total = 0.0;
            for (int i = 0; i < n; i++) total += candW[i];
            // roll = (md5("mood-lottery|<seed>") mod 100000) / 100000.0 * total
            long res = 0;
            using (MD5 md5 = MD5.Create())
            {
                byte[] h = md5.ComputeHash(Encoding.UTF8.GetBytes("mood-lottery|" + seedKey));
                for (int i = 0; i < h.Length; i++) res = (res * 256 + h[i]) % 100000;
            }
            double roll = (double)res / 100000.0 * total;
            double acc = 0.0;
            for (int i = 0; i < n; i++)
            {
                acc += candW[i];
                if (roll < acc) return candB[i];
            }
            return ctx;
        }
    }
}
