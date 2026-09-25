// FluxVerse P-23(2) r42 / r144: CityBubbles - thin MonoBehaviour adapter of
// the street bubble layer. SEPARATE FILE LAW (r14): the component class must
// live in <ClassName>.cs or the saved scene reference dies across editor
// sessions. The pure faces stay split: ResidentBarks (r41 data core:
// pool/pick/fact gate/budget) + ResidentBubbleRules (r42 mounting law) +
// MoodDirector (r144 mood mirror). This adapter only WIRES: poll
// world/world-state.json + world/world-events.jsonl READ-ONLY every ~10s
// (perceptor owns all writes), derive the context through the draw.py fact
// gate (events tail > weather > clock), then on the CLOCK tier apply the
// city mood director (mood = f(date, time, 24h event density); each
// budgeted speaker rolls its own use-ctx through the weighted lottery,
// draw.py L301-303 law - fact-gate contexts never move), budget the
// speakers (<=2 on screen), then mount their bubbles above the nameplates.
//
// RUNTIME-ONLY LAW (r13/r25): every bubble GO and every loaded texture is a
// runtime child of this component - NEVER saved into the scene. The proof
// gates zero persisted BarkBubble* objects after save and reload. Bubbles are
// rebuilt only when the (date, ctx, slot) triple changes (draw.py slot law:
// 45-minute slots, 32/day) - the swap is the real clock speaking, not a
// decorative loop (DESIGN section 7 honesty law).
//
// OVERLAP POLICY (attention rationing, deterministic): BudgetedSpeakers ranks
// the roster by md5 and yields at most MaxBubblesPerScreen ids in rank order;
// the adapter mounts each in order and DROPS any later speaker whose bubble
// rect would strictly overlap an already-mounted one (widest legal line is
// 13 u - two far-apart residents may still be picked together, two neighbors
// may not; rank head always wins, the tail yields). No invented fallback.
//
// Honesty degrade (probe contract): missing BubbleData texture, missing/broken
// barks file, unreadable world state -> that face stays silent; the PROOF
// fails loud instead. Pure 2D (flat sprites, ortho camera). ASCII. No 3D.
using System;
using System.Collections.Generic;
using System.IO;
using System.Text.RegularExpressions;
using UnityEngine;

namespace FluxVerse
{
    public class CityBubbles : MonoBehaviour
    {
        public const float PollIntervalSec = 10f;
        const int TailEvents = 15;   // draw.py law: the fact gate reads the last 15 stream lines
        static readonly Regex TypeRx = new Regex("\"type\":\"([A-Z_]+)\"");
        static readonly Regex TsRx = new Regex("\"ts_utc\":\"([^\"]+)\"");

        [Serializable] class StateFile { public Reality reality; }
        [Serializable] class Reality { public string beijing_hhmm, weather_kind; }

        readonly List<GameObject> mounted = new List<GameObject>();
        readonly List<string> mountedIds = new List<string>();
        readonly List<string> mountedLines = new List<string>();
        readonly List<Rect> mountedRects = new List<Rect>();
        readonly Dictionary<string, Sprite> spriteCache = new Dictionary<string, Sprite>();
        string lastDate, lastCtx, lastMood;
        int lastSlot = -1;
        float pollTimer = 999f;      // poll on first Update

        public int BubbleCount { get { return mounted.Count; } }
        public string CurrentCtx { get { return lastCtx; } }

        void Update()
        {
            pollTimer += Time.deltaTime;
            if (pollTimer >= PollIntervalSec) { pollTimer = 0f; PollFromWorld(); }
        }

        // reality link: world-state (Beijing clock + weather) + events stream ->
        // draw.py fact gate -> ctx (+ src); on the clock tier the mood director
        // (24h density + alert + calendar) may re-roll each speaker's bucket.
        public void PollFromWorld()
        {
            try
            {
                string repo = Path.GetDirectoryName(Path.GetDirectoryName(Application.dataPath));
                StateFile sf = JsonUtility.FromJson<StateFile>(
                    File.ReadAllText(Path.Combine(repo, "world", "world-state.json")));
                if (sf == null || sf.reality == null) return;
                string hhmm = sf.reality.beijing_hhmm;
                if (string.IsNullOrEmpty(hhmm)) return;
                int h, m;
                if (!ParseHhmm(hhmm, out h, out m)) return;
                string[] types; int density; bool alert;
                ReadStream(Path.Combine(repo, "world", "world-events.jsonl"), out types, out density, out alert);
                DateTime bj = DateTime.Now.Date + new TimeSpan(h, m, 0);
                string src;
                string ctx = ResidentBarks.DeriveContext(types, sf.reality.weather_kind, bj, out src);
                MoodState mood = null;
                if (src == MoodDirector.SrcClock)
                    mood = MoodDirector.DeriveState(bj, density, MoodDirector.DenseDefault, alert,
                        sf.reality.weather_kind, MoodDirector.LoadCalendar());
                Refresh(DateTime.Now.ToString("yyyy-MM-dd"), ctx, (h * 60 + m) / 45, mood);
            }
            catch (Exception) { /* keep current bubbles: probe contract silent degrade */ }
        }

        // draw.py barks-tier mood seed law (L301-303 with slot=None):
        // "<id>|<date>||<mood>" - the empty slot segment is the barks tier,
        // NOT a bug; the proof pins the exact string against python goldens.
        public static string MoodSeed(string id, string date, string mood)
        {
            return id + "|" + date + "||" + mood;
        }

        // rebuild when the (date, ctx, slot, mood) quad moves; mounts the
        // budgeted speakers in rank order under the strict-overlap drop
        // policy. mood == null = the pre-mood law (fact-gate ctx stands).
        public void Refresh(string date, string ctx, int slot) { Refresh(date, ctx, slot, null); }

        // mood-aware mount (r144): mood != null implies the caller's fact
        // gate decided src == "clock" (adapter law) - each speaker rolls its
        // own use-ctx through the weighted lottery before picking its line.
        public void Refresh(string date, string ctx, int slot, MoodState mood)
        {
            string moodName = mood != null ? mood.Mood : null;
            if (date == lastDate && ctx == lastCtx && slot == lastSlot && moodName == lastMood) return;
            ClearMounted();
            lastDate = date; lastCtx = ctx; lastSlot = slot; lastMood = moodName;
            ResidentBarksFile f = ResidentBarks.Load();
            if (f == null) return;   // barks absent this build: silent (proof fails loud)
            string[] ids = ResidentBarks.BudgetedSpeakersFrom(f, date, ctx, slot);
            for (int k = 0; k < ids.Length; k++)
            {
                string useCtx = ctx;
                if (mood != null)
                    useCtx = MoodDirector.MoodCtxLottery(ctx, MoodDirector.SrcClock, mood,
                        MoodSeed(ids[k], date, mood.Mood));
                string line = ResidentBarks.PickFrom(f, ids[k], date, useCtx);
                if (string.IsNullOrEmpty(line)) continue;
                int idx = RosterIndex(f, ids[k]);
                if (idx < 0) continue;
                Sprite sp = SpriteFor(line);
                if (sp == null) continue;   // bubble texture absent: honest silence
                Vector2 c = ResidentBubbleRules.Pos(idx);
                c.x = ResidentBubbleRules.MountX(idx, sp.bounds.size.x, RigMath.L0Size * RigMath.Aspect);
                Rect r = new Rect(c.x - sp.bounds.size.x / 2f, c.y - sp.bounds.size.y / 2f,
                    sp.bounds.size.x, sp.bounds.size.y);
                bool clash = false;
                for (int j = 0; j < mountedRects.Count; j++)
                    if (ResidentBubbleRules.RectsOverlap(r, mountedRects[j])) { clash = true; break; }
                if (clash) continue;   // rank head wins, the tail speaker yields
                GameObject go = new GameObject(ResidentBubbleRules.Prefix + k.ToString("00"));
                go.transform.SetParent(transform, false);
                go.transform.position = new Vector3(c.x, c.y, 0f);
                go.transform.localScale = Vector3.one;   // natural size: px / PPU24
                SpriteRenderer sr = go.AddComponent<SpriteRenderer>();
                sr.sprite = sp;
                sr.sortingOrder = ResidentBubbleRules.Order;
                mounted.Add(go); mountedIds.Add(ids[k]); mountedLines.Add(line); mountedRects.Add(r);
            }
        }

        public string MountedLine(int k) { return k >= 0 && k < mountedLines.Count ? mountedLines[k] : null; }
        public string MountedId(int k) { return k >= 0 && k < mountedIds.Count ? mountedIds[k] : null; }
        public Rect MountedRect(int k) { return k >= 0 && k < mountedRects.Count ? mountedRects[k] : new Rect(); }

        // destroy mounted GOs + every cached texture (r23 owned-lifetime law:
        // byte-loaded sprites are ours, hide/refresh cycles must not leak).
        public void Release()
        {
            ClearMounted();
            foreach (Sprite s in spriteCache.Values) if (s != null) Kill(s.texture);
            spriteCache.Clear();
            lastDate = null; lastCtx = null; lastSlot = -1; lastMood = null;
        }

        void ClearMounted()
        {
            for (int i = 0; i < mounted.Count; i++) if (mounted[i] != null) Kill(mounted[i]);
            mounted.Clear(); mountedIds.Clear(); mountedLines.Clear(); mountedRects.Clear();
        }

        Sprite SpriteFor(string line)
        {
            string key = ResidentBarks.LineKey(line);
            if (string.IsNullOrEmpty(key)) return null;
            Sprite cached;
            if (spriteCache.TryGetValue(key, out cached)) return cached;
            Sprite sp = LoadBubbleSprite(BubbleDir(), key);
            if (sp == null) return null;
            spriteCache[key] = sp;
            return sp;
        }

        static string BubbleDir()
        {
            return Path.Combine(Path.GetDirectoryName(Application.dataPath), ResidentBubbleRules.DirName);
        }

        // byte-path loader (r18 BannerData law): File.ReadAllBytes + LoadImage,
        // point filter, PPU24, explicit Apply - batch proofs and play mode load
        // identical pixels; no importer dependency. Null on any absence.
        public static Sprite LoadBubbleSprite(string dir, string key)
        {
            if (string.IsNullOrEmpty(dir) || string.IsNullOrEmpty(key)) return null;
            string path = Path.Combine(dir, "bark-" + key + ".png");
            if (!File.Exists(path)) return null;
            Texture2D tex = new Texture2D(2, 2, TextureFormat.RGBA32, false);
            if (!tex.LoadImage(File.ReadAllBytes(path)))
            {
                Kill(tex);
                return null;
            }
            tex.filterMode = FilterMode.Point;
            tex.Apply(false, false);
            return Sprite.Create(tex, new Rect(0, 0, tex.width, tex.height),
                new Vector2(0.5f, 0.5f), ResidentBubbleRules.PPU);
        }

        // roster id -> ResidentRules index (r41 law: roster slot == street slot)
        static int RosterIndex(ResidentBarksFile f, string id)
        {
            for (int i = 0; i < f.residents.Length; i++)
                if (f.residents[i] != null && f.residents[i].id == id) return f.residents[i].slot;
            return -1;
        }

        // single backward pass over the active event stream (the perceptor
        // owns writes; the stream rotates daily - scan v0.4, so the active
        // file IS the 24h window's live face): tail-15 event types for the
        // fact gate + the 24h density count + the WEATHER_ALERT hit for the
        // mood mirror (mood_director.py read_world law: ts-unparseable lines
        // never count - data absent cannot be verified, no guessing).
        static void ReadStream(string streamPath, out string[] types, out int density, out bool alert)
        {
            types = null; density = 0; alert = false;
            if (!File.Exists(streamPath)) return;
            string[] lines;
            try { lines = File.ReadAllLines(streamPath); }
            catch (Exception) { return; }
            List<string> t = new List<string>();
            int taken = 0;
            DateTime cut = DateTime.UtcNow.AddHours(-24.0);
            for (int i = lines.Length - 1; i >= 0; i--)
            {
                string ln = lines[i];
                if (string.IsNullOrEmpty(ln)) continue;
                if (TsInWindow(ln, cut))
                {
                    density++;
                    if (!alert && TypeRx.Match(ln).Groups[1].Value == "WEATHER_ALERT") alert = true;
                }
                if (taken < TailEvents)
                {
                    taken++;
                    Match mt = TypeRx.Match(ln);
                    if (mt.Success) t.Add(mt.Groups[1].Value);
                }
            }
            types = t.Count > 0 ? t.ToArray() : null;
        }

        static bool TsInWindow(string line, DateTime cut)
        {
            Match m = TsRx.Match(line);
            if (!m.Success) return false;
            DateTime t;
            if (!DateTime.TryParseExact(m.Groups[1].Value, "yyyy-MM-dd'T'HH:mm:ss'Z'",
                    System.Globalization.CultureInfo.InvariantCulture,
                    System.Globalization.DateTimeStyles.AssumeUniversal, out t))
                return false;
            return t >= cut;
        }

        static bool ParseHhmm(string hhmm, out int h, out int m)
        {
            h = 0; m = 0;
            int sep = hhmm.IndexOf(':');
            if (sep <= 0) return false;
            return int.TryParse(hhmm.Substring(0, sep), out h) && int.TryParse(hhmm.Substring(sep + 1), out m);
        }

        static void Kill(UnityEngine.Object o)
        {
            if (o == null) return;
            if (Application.isPlaying) UnityEngine.Object.Destroy(o);
            else UnityEngine.Object.DestroyImmediate(o);
        }
    }
}
