// FluxVerse P-23(2) r41: engine-side resident barks pool - pure data core.
// M2 barks window (ledger P-2026-09-23-23 face 2): the engine bubble layer
// consumes the BigLife cognition layer-2 line pool. This v0 slice is the DATA
// substrate; the r42 render slice (CityBubbles + ResidentBubbleRules) mounts
// it through Pick/DeriveContext/BudgetedSpeakers + LineKey.
//
// Data flow: Tools/city/bake-resident-barks.ps1 (deterministic PS bake,
// fail-loud gates) writes Assets/Data/residents-barks.json (6 used axes x 12
// contexts x up to 15 lines per the BigLife layer-2 contract v1.8 + the
// 31-seat NARRATIVE id->axis roster in street slot order - the single anchor
// seat, layer=anchor, is honestly excluded and never barks, r106/r107 law).
// The r41/r107 pre-baked law-vectors file is RETIRED (r144): the mood face
// carries live event density and cannot be pre-baked - the law is now
// recomputed at proof time over the FULL pool (runtime md5, 31x12x2) and
// the mood mirror is golden-pair gated against python mood_director.py
// (ResidentBarksProof D/M sections, r41 dual-impl pattern continues).
//
// Law (byte-mirrors BigLife Tools/draw.py):
//   - bucket routing: resident axis -> axes[<axis>][ctx]; empty bucket falls
//     back to the default axis (draw.py law), else honest null.
//   - pick (barks tier, day-granular): seed = md5("id|date|ctx"),
//     index = uint(first 4 digest bytes) % bucket length. Same
//     (id, date, ctx) => byte-identical line forever.
//   - context derivation (fact gate): real events > real weather > clock.
//     events: CEO_ORDER > MARKET_OPEN > MARKET_CLOSE > WEATHER_ALERT (the
//     last maps to the typhoon bucket - draw.py). weather: rain/storm/
//     drizzle/shower -> rain | snow/sleet -> coldsnap | typhoon/gale/wind ->
//     typhoon. clock: 05-10 morning, 17-18 dusk, >=19/<5 night, else
//     morning(<15)/dusk; weekend overlay only when the clock tier decided.
//   - attention rationing: at most MaxBubblesPerScreen bubbles on screen per
//     tick; BudgetedSpeakers ranks all roster ids by md5("id|date|b<slot>|ctx")
//     and takes the head - deterministic, rotates across slots.
//
// Honesty (cognition README): pool lines carry SITUATIONAL TONE ONLY - zero
// facts, zero digits (bake gate), and the fact gate is that a context bucket
// is only ever reached through REAL data (events/weather/clock that the
// adapter derives from the live world state). Missing/broken data file ->
// Load() returns null; every face reads null as "barks absent this build"
// and stays silent - the PROOF fails loud instead. Pure 2D. ASCII. No 3D.
using System;
using System.IO;
using System.Security.Cryptography;
using System.Text;
using UnityEngine;

namespace FluxVerse
{
    [Serializable]
    public class BarkBucket
    {
        public string ctx;        // canon context key
        public string[] lines;    // pool lines (<=24 chars, zero digits)
    }

    [Serializable]
    public class BarkAxis
    {
        public string axis;       // thought axis (CJK from data)
        public BarkBucket[] contexts;
    }

    [Serializable]
    public class BarkResidentRef
    {
        public int slot;          // street slot 0..31 (anchor 26 never present)
        public string id;         // census id C-#####
        public string axis;       // this resident's thought axis
    }

    [Serializable]
    public class ResidentBarksFile
    {
        public BarkAxis[] axes;
        public BarkResidentRef[] residents;
    }

    // pure static core: pool parse + selection law + context derivation +
    // attention budget. No MonoBehaviour (v0 slice wires nothing into the
    // scene; SEPARATE FILE LAW n/a).
    public static class ResidentBarks
    {
        public const string DataRelPath = "Data/residents-barks.json";
        public const int MaxLineChars = 24;                       // <24-char engine law (cognition README acceptance 2)
        public const int MaxBubblesPerScreen = 2;                 // attention rationing (P-23 spec)
        public const int RosterCount = 31;                        // street NARRATIVE seats (r107): the 32-seat roster
                                                                   // minus the anchor slot 26 (no axis, honest silence)

        // draw.py CONTEXTS canon order - never reorder (bucket routing key)
        public static readonly string[] ContextCanon = new string[]
        {
            "morning", "dusk", "night", "weekend", "rain", "typhoon",
            "heatwave", "coldsnap", "market_open", "market_close", "ceo_order", "festival"
        };

        // draw.py default-axis fallback (CJK kept as escapes: ASCII source law)
        public const string FallbackAxis = "\u70df\u706b";

        static ResidentBarksFile cache;

        public static bool Loaded { get { return cache != null; } }

        // parse Assets/Data/residents-barks.json. Null = honest absence
        // (missing file / bad JSON / wrong roster count) - never a throw.
        public static ResidentBarksFile Load(bool force = false)
        {
            if (cache != null && !force) return cache;
            string path = Path.Combine(Application.dataPath, DataRelPath);
            if (!File.Exists(path)) return null;
            ResidentBarksFile f = LoadFrom(path);
            if (f == null || f.residents == null || f.residents.Length != RosterCount) return null;
            cache = f;
            return cache;
        }

        // path-parameterized parse (proof/degrade face). Null on any defect.
        public static ResidentBarksFile LoadFrom(string path)
        {
            if (string.IsNullOrEmpty(path) || !File.Exists(path)) return null;
            ResidentBarksFile f = null;
            try { f = JsonUtility.FromJson<ResidentBarksFile>(File.ReadAllText(path, Encoding.UTF8)); }
            catch { return null; }
            return f;
        }

        public static void Unload() { cache = null; }

        // bucket routing: id -> resident axis -> axes[<axis>][ctx], with the
        // draw.py default-axis fallback. Null when the roster/file/bucket is
        // absent (honest degrade).
        public static string[] BucketFor(ResidentBarksFile f, string id, string ctx)
        {
            if (f == null || f.residents == null || f.axes == null) return null;
            BarkResidentRef r = null;
            for (int i = 0; i < f.residents.Length; i++)
                if (f.residents[i] != null && f.residents[i].id == id) { r = f.residents[i]; break; }
            if (r == null) return null;
            string[] b = AxisBucket(f, r.axis, ctx);
            if (b != null && b.Length > 0) return b;
            return AxisBucket(f, FallbackAxis, ctx);   // draw.py fallback-axis law
        }

        static string[] AxisBucket(ResidentBarksFile f, string axis, string ctx)
        {
            for (int a = 0; a < f.axes.Length; a++)
            {
                BarkAxis ax = f.axes[a];
                if (ax == null || ax.axis != axis || ax.contexts == null) continue;
                for (int c = 0; c < ax.contexts.Length; c++)
                    if (ax.contexts[c] != null && ax.contexts[c].ctx == ctx)
                        return ax.contexts[c].lines;
            }
            return null;
        }

        // pick law (barks tier): md5("id|date|ctx") first 4 digest bytes as
        // big-endian uint mod bucket length. Byte-identical to draw.py.
        // Null = honest absence (no data / unknown id / unknown ctx /
        // line violates the <24-char law - the bake gates it, this guards it).
        public static string Pick(string id, string date, string ctx)
        {
            return PickFrom(Load(), id, date, ctx);
        }

        public static string PickFrom(ResidentBarksFile f, string id, string date, string ctx)
        {
            if (f == null || string.IsNullOrEmpty(id) || string.IsNullOrEmpty(date) ||
                string.IsNullOrEmpty(ctx)) return null;
            string[] bucket = BucketFor(f, id, ctx);
            if (bucket == null || bucket.Length == 0) return null;
            string key = id + "|" + date + "|" + ctx;
            using (MD5 md5 = MD5.Create())
            {
                byte[] h = md5.ComputeHash(Encoding.UTF8.GetBytes(key));
                uint v = ((uint)h[0] << 24) | ((uint)h[1] << 16) | ((uint)h[2] << 8) | (uint)h[3];
                string line = bucket[(int)(v % (uint)bucket.Length)];
                if (string.IsNullOrEmpty(line)) return null;
                if (line.Length > MaxLineChars) return null;   // runtime guard, <24-char law
                return line;
            }
        }

        // r42 render slice: line -> bubble texture key = md5(line) first 4
        // digest bytes as 8 lowercase hex - the SAME law the PS bake keys its
        // City/BubbleData/bark-<key>.png files by (single source; the proof
        // gates all 576 keys byte-for-byte against the bake manifest).
        public static string LineKey(string line)
        {
            if (string.IsNullOrEmpty(line)) return null;
            return BarkHash(line);
        }

        // context derivation port (draw.py derive_context): the FACT GATE -
        // real events > real weather > real clock. recentEventTypes = the
        // types of the most recent world events (the adapter polls the tail,
        // draw.py reads the last 15 lines); weatherKind = world-state reality
        // weather_kind; localNow = the city's real local time (Beijing).
        public static string DeriveContext(string[] recentEventTypes, string weatherKind, DateTime localNow)
        {
            string src;
            return DeriveContext(recentEventTypes, weatherKind, localNow, out src);
        }

        // fact-gate source mirror (r144, draw.py returns (ctx, src)): src =
        // "event" / "weather" / "clock". The weekend overlay keeps
        // src=="clock" (python law) - the mood lottery may therefore re-roll
        // a weekend ctx too (draw.py L301 gate is src, not ctx).
        public static string DeriveContext(string[] recentEventTypes, string weatherKind, DateTime localNow, out string src)
        {
            // events (fixed priority chain, draw.py if/elif order)
            if (recentEventTypes != null)
            {
                bool ceo = false, mo = false, mc = false, wa = false;
                for (int i = 0; i < recentEventTypes.Length; i++)
                {
                    string t = recentEventTypes[i];
                    if (t == "CEO_ORDER") ceo = true;
                    else if (t == "MARKET_OPEN") mo = true;
                    else if (t == "MARKET_CLOSE") mc = true;
                    else if (t == "WEATHER_ALERT") wa = true;
                }
                if (ceo) { src = "event"; return "ceo_order"; }
                if (mo) { src = "event"; return "market_open"; }
                if (mc) { src = "event"; return "market_close"; }
                if (wa) { src = "event"; return "typhoon"; }
            }
            // weather
            if (!string.IsNullOrEmpty(weatherKind))
            {
                string k = weatherKind;
                if (k == "rain" || k == "storm" || k == "drizzle" || k == "shower") { src = "weather"; return "rain"; }
                if (k == "snow" || k == "sleet") { src = "weather"; return "coldsnap"; }
                if (k == "typhoon" || k == "gale" || k == "wind") { src = "weather"; return "typhoon"; }
            }
            // clock (weekend overlay only on this tier - reaching here means
            // neither events nor weather decided, mirroring draw.py src=="clock")
            src = "clock";
            int hour = localNow.Hour;
            string ctx;
            if (hour >= 5 && hour < 11) ctx = "morning";
            else if (hour >= 17 && hour < 19) ctx = "dusk";
            else if (hour >= 19 || hour < 5) ctx = "night";
            else ctx = (hour < 15) ? "morning" : "dusk";
            int pyWeekday = ((int)localNow.DayOfWeek + 6) % 7;   // python weekday: Mon=0..Sun=6
            if (pyWeekday >= 5 && (ctx == "morning" || ctx == "dusk" || ctx == "night"))
                return "weekend";                                  // src stays "clock" (draw.py law)
            return ctx;
        }

        // attention rationing: which roster ids may bark this tick - at most
        // MaxBubblesPerScreen on screen. Deterministic per (date, ctx, slot):
        // rank ids by md5("id|date|b<slot>|ctx") ascending (ordinal tie-break
        // by id) and take the head. Slots rotate the voices across the day.
        public static string[] BudgetedSpeakers(string date, string ctx, int slot)
        {
            ResidentBarksFile f = Load();
            if (f == null || f.residents == null || f.residents.Length == 0) return new string[0];
            return BudgetedSpeakersFrom(f, date, ctx, slot);
        }

        public static string[] BudgetedSpeakersFrom(ResidentBarksFile f, string date, string ctx, int slot)
        {
            int n = f.residents.Length;
            string[] keys = new string[n];
            string[] ids = new string[n];
            for (int i = 0; i < n; i++)
            {
                ids[i] = f.residents[i].id;
                keys[i] = BarkHash(f.residents[i].id + "|" + date + "|b" + slot + "|" + ctx) + "|" + ids[i];
            }
            Array.Sort(keys, ids, StringComparer.Ordinal);
            int take = Math.Min(MaxBubblesPerScreen, n);
            string[] outIds = new string[take];
            Array.Copy(ids, outIds, take);
            return outIds;
        }

        static string BarkHash(string key)
        {
            using (MD5 md5 = MD5.Create())
            {
                byte[] h = md5.ComputeHash(Encoding.UTF8.GetBytes(key));
                const string hex = "0123456789abcdef";
                char[] c = new char[8];
                for (int i = 0; i < 4; i++)
                {
                    c[i * 2] = hex[h[i] >> 4];
                    c[i * 2 + 1] = hex[h[i] & 0xF];
                }
                return new string(c);
            }
        }
    }
}
