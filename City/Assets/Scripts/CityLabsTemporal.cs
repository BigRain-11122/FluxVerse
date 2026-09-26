// FluxVerse P-39 slice (r189): CityLabsTemporal - thin MonoBehaviour
// adapter of the labs temporal face (L2 birth station half-alive readout +
// six-slot rolling wall + birth ceremony; L3 sandbox live readout + the
// two proposal pulses; L1 incubator stays standby dark - T-FV-104).
// SEPARATE FILE LAW (r14): the component class lives in <ClassName>.cs or
// the saved scene reference dies across editor sessions. The pure law core
// (LabsTemporalRules) owns EVERY decision; this adapter only WIRES:
// 10s poll of world/world-state.json READ-ONLY (CityAmbient law; world/ is
// the perceptor's single-writer domain, P-43) + world-events.jsonl tail
// cursor (seek-to-end at first poll - history never replays, r25 law;
// daily rotation: line count < cursor -> cursor 0, r3 self-check law).
// Zero serialized fields -> the scene-persisted root GO survives
// everything (CityStreetBehavior r124 precedent; the proof creates it
// idempotently and saves once).
//
// RUNTIME-ONLY FAMILY (r148 law): backing quads, digit rows, wall
// overlays and pulse overlays are runtime children carrying runtime
// sprites - the live values are STATE data, nothing here can be a baked
// asset (D-02 stale honesty law). ReleaseMounts() destroys every child
// before any scene save (r146 disk-purity law). Digit rows slice the
// lab-digits strip at runtime - one Sprite.Create per glyph position
// (residents-atlas r99 precedent; byte-path load, r18 law: no importer
// dependency). Mount names LabTmp* - outside every LabsRules.IsLabsName
// prefix, so the neighbor census sweeps stay zero-touch.
//
// Grandfather (manifest poll.grandfather): census section missing ->
// birth readout hidden + all wall overlays off; evolution section missing
// -> sandbox readout hidden. Facility sprites stay as authored - honest
// absence, never fake numbers. The ceremony NEVER runs on a timer - it
// waits for a real RESIDENT_BIRTH on the stream (D-02). Proofs drive the
// same law paths: ApplyState + TriggerPulse + Step (r115 TriggerDirect
// precedent). Pure 2D. ASCII. No 3D.
using System;
using System.IO;
using System.Text.RegularExpressions;
using UnityEngine;

namespace FluxVerse
{
    public class CityLabsTemporal : MonoBehaviour
    {
        public const string GoName = "CityLabsTemporal";
        public const float PollIntervalSec = LabsTemporalRules.PollIntervalSec;
        const string MountPrefix = "LabTmp";

        // one pulse overlay's live state (proof taps read peak/remaining)
        public class PulseMount
        {
            public SpriteRenderer sr;
            public float peak;        // manifest peak alpha
            public float remaining;   // seconds left on the pulse
            public float duration;    // manifest duration
        }

        SpriteRenderer birthBacking, sbxBacking;
        SpriteRenderer[] birthDigits, sbxDigits;      // cap-sized pools
        SpriteRenderer[] wallSlots;                    // 6
        PulseMount chamber, burst, holo, block0, block1;
        Sprite[] digitSprites;                        // 10 glyph cache
        Texture2D digitsTex, solidTex;
        float pollTimer = 999f;      // poll on first Update
        int eventsCursor = -1;       // -1 = seek-to-end pending (r25 law)
        long birthValue, sbxValue;
        int birthShown, sbxShown;    // live digit counts (0 = face hidden)

        // ---- proof taps ----
        public long BirthValue { get { return birthValue; } }
        public int BirthDigits { get { return birthShown; } }
        public bool BirthVisible { get { return birthShown > 0; } }
        public long SbxValue { get { return sbxValue; } }
        public int SbxDigits { get { return sbxShown; } }
        public bool SbxVisible { get { return sbxShown > 0; } }
        public int WallLit { get; private set; }
        public int EventsCursorTap { get { return eventsCursor; } }
        public SpriteRenderer BirthBackingTap { get { return birthBacking; } }
        public SpriteRenderer SbxBackingTap { get { return sbxBacking; } }
        public SpriteRenderer BirthDigitTap(int k) { return birthDigits != null && k < birthDigits.Length ? birthDigits[k] : null; }
        public SpriteRenderer SbxDigitTap(int k) { return sbxDigits != null && k < sbxDigits.Length ? sbxDigits[k] : null; }
        public SpriteRenderer WallTap(int i) { return wallSlots != null && i < wallSlots.Length ? wallSlots[i] : null; }
        public PulseMount ChamberTap { get { return chamber; } }
        public PulseMount BurstTap { get { return burst; } }
        public PulseMount HoloTap { get { return holo; } }
        public PulseMount BlockTap(int b) { return b == 0 ? block0 : block1; }

        void Update()
        {
            pollTimer += Time.deltaTime;
            if (pollTimer >= PollIntervalSec) { pollTimer = 0f; Poll(); }
            Step(Time.deltaTime);   // pulse decay - the shared law path
        }

        // play-mode entry: live state + live event tail -> the shared law path
        public void Poll()
        {
            ApplyState(LabsTemporalRules.LoadStateFile());
            ReadEventTail();
        }

        // the shared law path: play-mode polls and batch proofs both land
        // here. null snap / missing section = that leg's grandfather face.
        public void ApplyState(TemporalSnapshot snap)
        {
            EnsureMounts();
            // leg 1: birth station (census)
            if (snap != null && snap.hasCensus)
            {
                birthValue = snap.censusTotal;
                BuildRow(true, birthValue);
                int lit = LabsTemporalRules.WallLitCountOf(snap.wallCount);
                WallLit = lit;
                for (int i = 0; i < LabsTemporalRules.WallSlotCount; i++)
                {
                    bool on = i < lit;
                    wallSlots[i].enabled = on;
                    if (on) wallSlots[i].color = new Color(LabsTemporalRules.OnColor.r,
                        LabsTemporalRules.OnColor.g, LabsTemporalRules.OnColor.b,
                        i == 0 ? LabsTemporalRules.WallNewestAlpha : LabsTemporalRules.WallLitAlpha);
                }
            }
            else
            {
                birthValue = 0; birthShown = 0; WallLit = 0;
                birthBacking.enabled = false;
                for (int k = 0; k < birthDigits.Length; k++) birthDigits[k].enabled = false;
                for (int i = 0; i < wallSlots.Length; i++) wallSlots[i].enabled = false;
            }
            // leg 2: sandbox (governance.evolution) - independent grandfather
            if (snap != null && snap.hasEvolution)
            {
                sbxValue = snap.openProposals;
                BuildRow(false, sbxValue);
            }
            else
            {
                sbxValue = 0; sbxShown = 0;
                sbxBacking.enabled = false;
                for (int k = 0; k < sbxDigits.Length; k++) sbxDigits[k].enabled = false;
            }
        }

        // builds one live digit row (backing + glyph positions from the
        // LIVE digit count - row width derives from the value, never pinned)
        void BuildRow(bool birth, long value)
        {
            int cap = birth ? LabsTemporalRules.BirthMaxDigits : LabsTemporalRules.SbxMaxDigits;
            Vector2 center = birth ? LabsTemporalRules.BirthReadoutCenter : LabsTemporalRules.SbxReadoutCenter;
            SpriteRenderer backing = birth ? birthBacking : sbxBacking;
            SpriteRenderer[] digits = birth ? birthDigits : sbxDigits;
            int n = LabsTemporalRules.DigitCountOf(value, cap);
            if (birth) birthShown = n; else sbxShown = n;
            Rect br = LabsTemporalRules.BackingRectOf(center, n);
            backing.enabled = true;
            backing.transform.position = new Vector3(br.center.x, br.center.y, LabsTemporalRules.BackingZ);
            backing.transform.localScale = new Vector3(br.width, br.height, 1f);
            for (int k = 0; k < digits.Length; k++)
            {
                if (k >= n) { digits[k].enabled = false; continue; }
                int d = LabsTemporalRules.DigitAt(value, n, k);
                Sprite sp = DigitSprite(d);
                if (sp == null) { digits[k].enabled = false; continue; }   // honest degrade; PROOF fails loud
                digits[k].sprite = sp;
                Vector2 c = LabsTemporalRules.DigitCenterOf(center, n, k);
                digits[k].transform.position = new Vector3(c.x, c.y, LabsTemporalRules.DigitsZ);
                digits[k].enabled = true;
            }
        }

        // ---- pulses (event-driven, never a timer) ----
        // proof hook (r115 TriggerDirect precedent): dispatch as if a live
        // pulse event just arrived. LAB_INCUBATE_* = reserved -> no-op
        // (incubator standby law, manifest incubator.standby).
        public void TriggerPulse(string eventType)
        {
            EnsureMounts();
            if (eventType == LabsTemporalRules.CeremonyEvent)
            {
                Fire(chamber, LabsTemporalRules.ChamberRect(), LabsTemporalRules.CeremonyPeakAlpha);
                Fire(burst, LabsTemporalRules.WallSlotRect(0), LabsTemporalRules.BurstPeakAlpha);
            }
            else if (eventType == LabsTemporalRules.PulseNewEvent)
            {
                Fire(holo, LabsTemporalRules.HoloRect(), LabsTemporalRules.PulseNewPeakAlpha);
            }
            else if (eventType == LabsTemporalRules.PulseAppliedEvent)
            {
                Fire(block0, LabsTemporalRules.BlockRect(0), LabsTemporalRules.PulseAppliedPeakAlpha);
                Fire(block1, LabsTemporalRules.BlockRect(1), LabsTemporalRules.PulseAppliedPeakAlpha);
            }
            // anything else (incl. every LAB_INCUBATE_* face): standby no-op
        }

        void Fire(PulseMount m, Rect worldRect, float peakAlpha)
        {
            m.peak = peakAlpha;
            m.remaining = m.duration;
            m.sr.transform.position = new Vector3(worldRect.center.x, worldRect.center.y, LabsTemporalRules.OverlayZ);
            m.sr.transform.localScale = new Vector3(worldRect.width, worldRect.height, 1f);
            ApplyPulse(m);
        }

        // pulse decay - the shared law path: play-mode Update and the batch
        // proof Step() both land here (linear fade over the manifest duration)
        public void Step(float dt)
        {
            Decay(chamber, dt); Decay(burst, dt); Decay(holo, dt);
            Decay(block0, dt); Decay(block1, dt);
        }

        void Decay(PulseMount m, float dt)
        {
            if (m == null || m.sr == null || m.remaining <= 0f) return;
            m.remaining -= dt;
            if (m.remaining < 0f) m.remaining = 0f;
            ApplyPulse(m);
        }

        void ApplyPulse(PulseMount m)
        {
            bool on = m.remaining > 0f;
            m.sr.enabled = on;
            m.sr.color = new Color(LabsTemporalRules.OnColor.r, LabsTemporalRules.OnColor.g,
                LabsTemporalRules.OnColor.b, m.peak * (m.remaining / m.duration));
        }

        // ---- event stream tail (cursor law) ----
        static string EventsPath()
        {
            string projectRoot = Path.GetDirectoryName(Application.dataPath);
            string repoRoot = Path.GetDirectoryName(projectRoot);
            return Path.Combine(repoRoot, "world", "world-events.jsonl");
        }

        void ReadEventTail()
        {
            string path = EventsPath();
            if (!File.Exists(path)) return;
            string[] lines;
            try { lines = File.ReadAllLines(path); }
            catch (Exception) { return; }   // torn mid-rewrite: next poll self-heals
            if (eventsCursor < 0) eventsCursor = lines.Length;        // seek-to-end (r25 law)
            else if (eventsCursor > lines.Length) eventsCursor = 0;   // daily rotation (r3 law)
            for (int i = eventsCursor; i < lines.Length; i++)
            {
                Match m = TypeRx.Match(lines[i]);
                if (!m.Success) continue;
                string t = m.Groups[1].Value;
                if (t == LabsTemporalRules.CeremonyEvent
                    || t == LabsTemporalRules.PulseNewEvent
                    || t == LabsTemporalRules.PulseAppliedEvent)
                    TriggerPulse(t);
            }
            eventsCursor = lines.Length;
        }

        static readonly Regex TypeRx = new Regex("\"type\":\"([A-Z_]+)\"");

        // ---- mounts (runtime-only, r148 law) ----
        // idempotent: full child sweep first, then the fixed mount set.
        // Mount count is a table constant: 2 backings + 6+3 digit pools +
        // 6 wall slots + 5 pulse mounts.
        public void EnsureMounts()
        {
            if (birthBacking != null) return;
            for (int i = transform.childCount - 1; i >= 0; i--)
            {
                Transform c = transform.GetChild(i);
                if (Application.isPlaying) Destroy(c.gameObject);
                else DestroyImmediate(c.gameObject);
            }
            birthBacking = Quad(MountPrefix + "BirthBacking");
            sbxBacking = Quad(MountPrefix + "SbxBacking");
            birthBacking.color = LabsTemporalRules.BackingColor;
            sbxBacking.color = LabsTemporalRules.BackingColor;
            birthBacking.enabled = false;
            sbxBacking.enabled = false;
            birthDigits = new SpriteRenderer[LabsTemporalRules.BirthMaxDigits];
            sbxDigits = new SpriteRenderer[LabsTemporalRules.SbxMaxDigits];
            for (int k = 0; k < birthDigits.Length; k++) birthDigits[k] = Quad(MountPrefix + "BirthD" + k);
            for (int k = 0; k < sbxDigits.Length; k++) sbxDigits[k] = Quad(MountPrefix + "SbxD" + k);
            wallSlots = new SpriteRenderer[LabsTemporalRules.WallSlotCount];
            for (int i = 0; i < wallSlots.Length; i++)
            {
                wallSlots[i] = Quad(MountPrefix + "Wall" + i);
                Rect r = LabsTemporalRules.WallSlotRect(i);
                wallSlots[i].transform.position = new Vector3(r.center.x, r.center.y, LabsTemporalRules.OverlayZ);
                wallSlots[i].transform.localScale = new Vector3(r.width, r.height, 1f);
                wallSlots[i].enabled = false;
            }
            chamber = NewPulse(MountPrefix + "PulseChamber", LabsTemporalRules.CeremonyDuration);
            burst = NewPulse(MountPrefix + "PulseBurst", LabsTemporalRules.CeremonyDuration);
            holo = NewPulse(MountPrefix + "PulseHolo", LabsTemporalRules.PulseDuration);
            block0 = NewPulse(MountPrefix + "PulseBlock0", LabsTemporalRules.PulseDuration);
            block1 = NewPulse(MountPrefix + "PulseBlock1", LabsTemporalRules.PulseDuration);
        }

        PulseMount NewPulse(string name, float duration)
        {
            PulseMount m = new PulseMount();
            m.sr = Quad(name);
            m.duration = duration;
            m.remaining = 0f;
            m.sr.enabled = false;
            return m;
        }

        SpriteRenderer Quad(string name)
        {
            GameObject go = new GameObject(name);
            go.transform.SetParent(transform, false);
            SpriteRenderer sr = go.AddComponent<SpriteRenderer>();
            sr.sprite = SolidSprite();
            sr.sortingOrder = LabsTemporalRules.OverlayOrder;
            return sr;
        }

        // r146 save-purity law face: destroy every runtime mount child +
        // every runtime texture (r23 owned-lifetime law - no leak cycles)
        public void ReleaseMounts()
        {
            for (int c = transform.childCount - 1; c >= 0; c--)
            {
                Transform ch = transform.GetChild(c);
                if (Application.isPlaying) Destroy(ch.gameObject);
                else DestroyImmediate(ch.gameObject);
            }
            birthBacking = null; sbxBacking = null; birthDigits = null; sbxDigits = null;
            wallSlots = null;
            chamber = null; burst = null; holo = null; block0 = null; block1 = null;
            if (digitSprites != null) { for (int d = 0; d < digitSprites.Length; d++) if (digitSprites[d] != null) Kill(digitSprites[d]); }
            digitSprites = null;
            if (_solid != null) { Kill(_solid); _solid = null; }
            if (solidTex != null) { Kill(solidTex); solidTex = null; }
            if (digitsTex != null) { Kill(digitsTex); digitsTex = null; }
            birthValue = 0; sbxValue = 0; birthShown = 0; sbxShown = 0; WallLit = 0;
        }

        // 4x4 white @ 4ppu = the 1u solid quad (EventRouter glow kin);
        // ONE shared sprite instance - mount cycles must not leak (r23 law)
        Sprite _solid;
        Sprite SolidSprite()
        {
            if (_solid != null) return _solid;
            solidTex = new Texture2D(4, 4, TextureFormat.RGBA32, false);
            solidTex.filterMode = FilterMode.Point;
            Color w = Color.white;
            for (int y = 0; y < 4; y++) for (int x = 0; x < 4; x++) solidTex.SetPixel(x, y, w);
            solidTex.Apply(false, false);
            _solid = Sprite.Create(solidTex, new Rect(0, 0, 4, 4), new Vector2(0.5f, 0.5f), 4f);
            return _solid;
        }

        // one glyph sprite per digit VALUE, sliced from the strip (r99
        // precedent). Byte-path load (r18 law): identical pixels in batch
        // and play, zero importer dependency. Null on any absence.
        Sprite DigitSprite(int d)
        {
            if (d < 0 || d > 9) return null;
            if (digitSprites == null)
            {
                digitSprites = new Sprite[10];
                string path = Path.Combine(Path.GetDirectoryName(Application.dataPath),
                    LabsTemporalRules.DigitsPath);
                if (!File.Exists(path)) return null;
                Texture2D tex = new Texture2D(2, 2, TextureFormat.RGBA32, false);
                if (!tex.LoadImage(File.ReadAllBytes(path)))
                {
                    Kill(tex);
                    return null;
                }
                tex.filterMode = FilterMode.Point;
                tex.Apply(false, false);
                digitsTex = tex;
            }
            if (digitSprites[d] == null)
                digitSprites[d] = Sprite.Create(digitsTex,
                    new Rect(d * LabsTemporalRules.Pitch, 0, LabsTemporalRules.CellW, LabsTemporalRules.CellH),
                    new Vector2(0.5f, 0.5f), LabsTemporalRules.PPU);
            return digitSprites[d];
        }

        static void Kill(UnityEngine.Object o)
        {
            if (o == null) return;
            if (Application.isPlaying) UnityEngine.Object.Destroy(o);
            else UnityEngine.Object.DestroyImmediate(o);
        }

        // find-or-create the scene root (proof + AlbumShot entry; the proof
        // saves it once - zero serialized fields survive everything, r124)
        public static CityLabsTemporal EnsureRoot()
        {
            GameObject go = GameObject.Find(GoName);
            CityLabsTemporal c = go != null ? go.GetComponent<CityLabsTemporal>() : null;
            if (c != null) return c;
            if (go == null)
            {
                go = new GameObject(GoName);
                go.transform.position = Vector3.zero;
            }
            return go.AddComponent<CityLabsTemporal>();
        }
    }
}
