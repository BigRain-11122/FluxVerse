// FluxVerse P-15 r12 (split r14; gate widened r30; five city-core faces r115
// P-12 slice 4; canon faces r116 P-41 slice 1; task faces r117 P-41 slice 2):
// event router pure logic core — poll/cursor/parse/route.
// CEO_ORDER -> WHITE ANTENNA pulse (r116 canon map: middle-antenna white light
// pulse; five-color law CEO=pure white, replacing the r12 gold that belonged
// to the funds family) + five city-core faces (OS round breath, city
// verify gate, fleet transport band), headless-testable. The MonoBehaviour adapter
// CityEventRouter now lives in CityEventRouter.cs (SEPARATE FILE LAW, r14: a component
// class must match its .cs file name or the saved scene reference dies across editor
// sessions). Routing row 1 (mandate: one piece first): CEO_ORDER -> gold light pulse on
// BrainTower anchor. Live rule: SeekToEnd at start — only events arriving AFTER engine
// start pulse; history is never replayed. Rotation self-heal: active stream archives
// daily (scan v0.4). If line count < cursor -> cursor=0 (fresh file holds at most a few
// post-midnight lines; documented replay, no deep-history replay).
using System;
using System.Collections.Generic;
using System.IO;
using UnityEngine;

namespace FluxVerse
{
    [Serializable]
    public class FluxEvent
    {
        public string ts_utc;
        public string type;
        public string actor;
        public string repo;
        public string zone;
        public string summary;
    }

    public class FluxEventRouter
    {
        public const float PollIntervalSec = 10f;

        readonly string streamPath;
        readonly Func<string, Vector3?> anchorLookup;
        readonly List<GlowPulse> pulses = new List<GlowPulse>();
        readonly List<TransientFx> fx = new List<TransientFx>();   // r115 P-12(4): breath/gate/band faces
        BreathGlow breath;          // r115: one per OS round (START ramps in, DONE ramps out)
        long cursor;          // stream lines already consumed
        float pollTimer;

        // optional presenter tap (P-27 r25): fired on every dispatched event, after the pulse.
        // null = no-op, so every r12/r13 baseline (pulse-only) stays bit-identical when unwired.
        public Action<FluxEvent> EventSink;

        public FluxEventRouter(string streamPath, Func<string, Vector3?> anchorLookup)
        {
            this.streamPath = streamPath;
            this.anchorLookup = anchorLookup;
        }

        public void SeekToEnd()
        {
            cursor = CountLines();
        }

        public int PulseCount { get { return pulses.Count; } }

        // r115 P-12(4) proof taps
        public int EffectsCount { get { return fx.Count; } }
        public bool BreathAlive { get { return breath != null; } }
        public float BreathAlpha { get { return breath != null ? breath.Alpha : 0f; } }

        public float LastPulseAlpha
        {
            get { return pulses.Count > 0 ? pulses[pulses.Count - 1].Alpha : 0f; }
        }

        public void Tick(float dt)
        {
            pollTimer += dt;
            if (pollTimer >= PollIntervalSec)
            {
                pollTimer = 0f;
                PollOnce();
            }
            for (int i = pulses.Count - 1; i >= 0; i--)
                if (!pulses[i].Advance(dt))
                    pulses.RemoveAt(i);
            for (int i = fx.Count - 1; i >= 0; i--)
                if (!fx[i].Advance(dt))
                    fx.RemoveAt(i);
            if (breath != null && !breath.Advance(dt))
                breath = null;
        }

        // r30 (P-27 rows batch 2): cheap gate widened from the single CEO_ORDER token to
        // every routed type -- visual row (CEO_ORDER) + all FluxAudioRouter map keys, so
        // gate and map can never drift (single source of truth = MappedTypes).
        // r115 (P-12 slice 4): the five stream-live city-core types join the gate too --
        // they carry engine faces but NO audio rows (r30 three-intersection law: R- 1.1
        // has no clip rows for these types, so they stay silent; sound needs a new
        // research batch first). COMMIT stays OUT of this list: it is audio-mapped
        // (Laser_00, r30) and reached the gate through the map long before its r116
        // canon visual face (river stream); the reload gate keeps asserting every
        // VisualTypes member stays audio-silent. r117 (P-41 slice 2): TASK_DONE
        // joins the list (windows-down face, no audio row). TASK_CLAIM stays OUT
        // with COMMIT: audio-mapped (Robot_Activated_00, r30) it reached the gate
        // through the map long ago; its r117 windows face rides the same dispatch.
        public static readonly string[] VisualTypes =
        {
            "OS_TICK_START", "OS_TICK_DONE", "GATE_PASS", "GATE_BLOCK", "TRANSFER", "TASK_DONE"
        };

        static readonly string[] gateTokens = BuildGateTokens();

        static string[] BuildGateTokens()
        {
            var set = new HashSet<string> { "CEO_ORDER" };
            foreach (string k in FluxAudioRouter.MappedTypes) set.Add(k);
            foreach (string k in VisualTypes) set.Add(k);
            string[] arr = new string[set.Count];
            set.CopyTo(arr);
            return arr;
        }

        static bool GatePass(string line)
        {
            for (int i = 0; i < gateTokens.Length; i++)
                if (line.IndexOf("\"" + gateTokens[i] + "\"", StringComparison.Ordinal) >= 0) return true;
            return false;
        }

        static bool IsVisualType(string type)
        {
            for (int i = 0; i < VisualTypes.Length; i++)
                if (VisualTypes[i] == type) return true;
            return false;
        }

        static bool IsRoutedType(string type)
        {
            return type == "CEO_ORDER" || FluxAudioRouter.SoundFor(type) != null || IsVisualType(type);
        }

        // returns number of routed events this poll; silent-degrade on any file trouble
        public int PollOnce()
        {
            if (!File.Exists(streamPath)) return 0;
            string[] lines;
            try { lines = File.ReadAllLines(streamPath); }
            catch (Exception) { return 0; }   // mid-rotation swap etc: skip this cycle
            if (lines.Length < cursor) cursor = 0;   // daily rotation detected
            int fired = 0;
            for (long i = cursor; i < lines.Length; i++)
            {
                string line = lines[i];
                if (string.IsNullOrEmpty(line)) continue;
                if (!GatePass(line)) continue; // cheap gate (r30: multi-token, parse only routed lines)
                FluxEvent ev = null;
                try { ev = JsonUtility.FromJson<FluxEvent>(line); } catch (Exception) { ev = null; }
                if (ev != null && IsRoutedType(ev.type))
                {
                    Dispatch(ev);
                    fired++;
                }
            }
            cursor = lines.Length;
            return fired;
        }

        Vector3 AnchorPos()
        {
            Vector3? pos = anchorLookup != null ? anchorLookup("BrainTower") : null;
            return pos != null ? pos.Value : new Vector3(0f, 11f, 0f);   // hardcoded fallback = builder anchor
        }

        // r115 P-12(4): the city's own verify gate anchors at the brain-tower foot
        // (governance face, registry zone hint on the GATE_PASS row) -- NOT the
        // BigMoney quant gatechain (that emitter stays reserved to its own owner).
        Vector3 GatePos()
        {
            return AnchorPos() + new Vector3(0f, -3f, 0f);
        }

        // r116 P-41 slice 1: brain-tower middle-antenna spot (canon map "middle
        // antenna white light pulse"). v0: the tower has no physical antennas yet
        // (tower-brain v2.0 rebuild is a separate slice), so the pulse floats just
        // above the roofline -- tower tiles rows 9..14, anchor (0,11) -> roof y=15.
        // Single geometry source for the proof (derive-don't-copy, r99 law); the
        // v2.0 rebuild re-anchors here to its physical middle antenna.
        public static Vector3 AntennaPos(Vector3 anchorPos)
        {
            return anchorPos + new Vector3(0f, 4.3f, 0f);
        }

        Vector3 AntennaPos()
        {
            Vector3 a = AnchorPos();
            return AntennaPos(a);
        }

        void Dispatch(FluxEvent ev)
        {
            // r115 P-12(4): five city-core types now carry mapped faces (DESIGN 7
            // rows: OS round breath / gate release+intercept / transport band).
            // r116 P-41 slice 1: COMMIT gains its canon face (river-crossing data
            // stream) -- first audio-mapped type to also carry a visual. Every
            // other row still has no visual (M2 work, un-anchored pulses
            // forbidden: every animation anchors a real mapped behavior).
            switch (ev.type)
            {
                case "CEO_ORDER":
                    // r116 P-41 slice 1: canon face = middle-antenna WHITE pulse
                    // (five-color law: CEO pure white; the r12 gold belonged to
                    // the funds family and misassigned the CEO color slot).
                    pulses.Add(new GlowPulse(AntennaPos(), new Color(1f, 1f, 1f)));
                    break;
                case "OS_TICK_START":               // one breath per OS round, long envelope
                    if (breath == null) breath = new BreathGlow(AnchorPos());
                    breath.RampIn();
                    break;
                case "OS_TICK_DONE":
                    if (breath != null) breath.RampOut();
                    break;
                case "GATE_PASS":                   // release particle stream at the gate
                    fx.Add(new GateFlow(GatePos()));
                    break;
                case "GATE_BLOCK":                  // red intercept band (ALERT r13 family)
                    fx.Add(new BandFlash(GatePos(), new Color(1f, 0.22f, 0.16f), 8f, 1.1f, 12, "GateBlockBand"));
                    break;
                case "TRANSFER":                    // street light band, distinctness law below
                    fx.Add(new TransferBand());
                    break;
                case "COMMIT":                      // r116 P-41 slice 1: canon river stream
                    fx.Add(new CommitStream(ev.zone));
                    break;
                case "TASK_CLAIM":                 // r117 P-41 slice 2: zone building windows up + robot out
                    fx.Add(new TaskClaimFace(ev.zone));
                    break;
                case "TASK_DONE":                  // r117: robot home + windows down + one pulse
                    fx.Add(new TaskDoneFace(ev.zone));
                    break;
            }
            if (EventSink != null) EventSink(ev);   // P-27 r25: same event, second presenter (audio)
        }

        // proof hook (editor harness): dispatch as if a live event just arrived
        public void TriggerDirect(string type)
        {
            Dispatch(new FluxEvent { type = type, zone = "test" });
        }

        // r117: zone-aware proof hook (the task faces are zone-driven)
        public void TriggerDirect(string type, string zone)
        {
            Dispatch(new FluxEvent { type = type, zone = zone });
        }

        long CountLines()
        {
            try { return File.ReadAllLines(streamPath).Length; }
            catch (Exception) { return 0; }
        }
    }

    public class GlowPulse
    {
        const float Life = 2.4f;
        const float PeakAt = 0.25f;
        const float MaxAlpha = 0.95f;

        readonly GameObject go;
        readonly SpriteRenderer sr;
        readonly Color color;
        float t;

        public float Alpha { get; private set; }

        public GlowPulse(Vector3 pos, Color c)
        {
            color = c;
            go = new GameObject("EventPulse");
            go.transform.position = pos;
            sr = go.AddComponent<SpriteRenderer>();
            sr.sprite = GlowSprite();
            sr.sortingOrder = 10;   // above every tilemap layer (builder orders 0..4)
            sr.color = new Color(c.r, c.g, c.b, 0f);
            go.transform.localScale = new Vector3(0.8f, 0.8f, 1f);
        }

        public bool Advance(float dt)
        {
            t += dt;
            float a, scale;
            if (t < PeakAt)
            {
                float k = t / PeakAt;
                a = Mathf.SmoothStep(0f, 1f, k);
                scale = Mathf.Lerp(0.8f, 1.7f, k);
            }
            else if (t < Life)
            {
                float k = (t - PeakAt) / (Life - PeakAt);
                a = 1f - k * k;                     // ease-in fade
                scale = Mathf.Lerp(1.7f, 3.4f, k);
            }
            else
            {
                a = 0f;
                scale = 3.4f;
            }
            Alpha = a;
            sr.color = new Color(color.r, color.g, color.b, MaxAlpha * a);
            go.transform.localScale = new Vector3(scale, scale, 1f);
            if (t >= Life)
            {
                Kill();
                return false;
            }
            return true;
        }

        void Kill()
        {
            if (Application.isPlaying) UnityEngine.Object.Destroy(go);
            else UnityEngine.Object.DestroyImmediate(go);
        }

        static Sprite _glow;

        // procedural radial glow (no asset import dependency): white core -> soft transparent edge
        // r115: shared radial sprite for the sibling face classes (breath/gate dots)
        internal static Sprite SharedGlow() { return GlowSprite(); }

        static Sprite GlowSprite()
        {
            if (_glow != null) return _glow;
            const int S = 64;
            Texture2D tex = new Texture2D(S, S, TextureFormat.RGBA32, false);
            tex.filterMode = FilterMode.Bilinear;
            for (int y = 0; y < S; y++)
                for (int x = 0; x < S; x++)
                {
                    float dx = (x + 0.5f) / S * 2f - 1f;
                    float dy = (y + 0.5f) / S * 2f - 1f;
                    float r = Mathf.Sqrt(dx * dx + dy * dy);
                    float a = Mathf.Clamp01(1f - r);
                    a = a * a * (3f - 2f * a);      // smoothstep shaping: bright core, soft rim
                    tex.SetPixel(x, y, new Color(1f, 1f, 1f, a));
                }
            tex.Apply();
            _glow = Sprite.Create(tex, new Rect(0, 0, S, S), new Vector2(0.5f, 0.5f), 32f);   // 64px @32ppu = 2 world units
            return _glow;
        }
    }

    // r115 (P-12 slice 4): transient presenter base -- effects live in the
    // router's fx list, advance every Tick, destroy themselves on death
    // (edit mode: DestroyImmediate, batch-safe; play mode: Destroy).
    public abstract class TransientFx
    {
        public abstract bool Advance(float dt);
        protected static void KillGo(GameObject go)
        {
            if (go == null) return;
            if (Application.isPlaying) UnityEngine.Object.Destroy(go);
            else UnityEngine.Object.DestroyImmediate(go);
        }
    }

    // OS round breath (OS_TICK_START ramp-in / OS_TICK_DONE ramp-out): a long
    // envelope halo on the brain tower -- one breathe per 10-min city round,
    // tower-brain v2.0 data-band feel. Lucy blue = brain-tower light family
    // (DESIGN 9: super-body blue belongs to the brain tower).
    public class BreathGlow
    {
        const float PeakAlpha = 0.8f;       // visible breathe, still below the CEO pulse (0.95)
        const float RampInPerSec = 0.55f;  // ~1.8s breath-in
        const float RampOutPerSec = 0.85f; // ~1.2s breath-out

        readonly GameObject go;
        readonly SpriteRenderer sr;
        readonly Color color;
        float alpha;    // normalized 0..1 state (proof-visible)
        float target;   // 1 while the round runs, 0 once it ends
        float t;

        public float Alpha { get { return alpha; } }

        public BreathGlow(Vector3 pos)
        {
            color = new Color(0.36f, 0.65f, 1f);
            go = new GameObject("TowerBreath");
            go.transform.position = pos + new Vector3(0f, 0.3f, 0f);
            sr = go.AddComponent<SpriteRenderer>();
            sr.sprite = BreathSprite();
            sr.sortingOrder = 9;
            sr.color = new Color(color.r, color.g, color.b, 0f);
            // r115 v3: ring sprite (data-band feel, tower-brain v2.0) - v1 disc at 2.6
            // tucked inside the white glass and v2 disc at 3.6 tinted the tower but the
            // rim still read as tower self-glow (multimodal); a RING arc beyond the
            // silhouette is visible in any static frame (visibility law, r110).
            go.transform.localScale = new Vector3(3.6f, 3.6f, 1f);   // ~7.2u, ring at ~2.2u
        }

        public void RampIn() { target = 1f; }
        public void RampOut() { target = 0f; }

        static Sprite _breath;

        // soft ring + faint core: ring peak at r=0.62 (arc rides just past the tower
        // silhouette), core disc 0.45 tints the glass. Native 96px @48ppu = 2u.
        static Sprite BreathSprite()
        {
            if (_breath != null) return _breath;
            const int S = 96;
            Texture2D tex = new Texture2D(S, S, TextureFormat.RGBA32, false);
            tex.filterMode = FilterMode.Bilinear;
            for (int y = 0; y < S; y++)
                for (int x = 0; x < S; x++)
                {
                    float dx = (x + 0.5f) / S * 2f - 1f;
                    float dy = (y + 0.5f) / S * 2f - 1f;
                    float r = Mathf.Sqrt(dx * dx + dy * dy);
                    float ring = Mathf.Clamp01(1f - Mathf.Abs(r - 0.62f) / 0.30f);
                    ring = ring * ring * (3f - 2f * ring);
                    float core = Mathf.Clamp01(1f - r) * 0.45f;
                    tex.SetPixel(x, y, new Color(1f, 1f, 1f, Mathf.Max(ring, core)));
                }
            tex.Apply();
            _breath = Sprite.Create(tex, new Rect(0, 0, S, S), new Vector2(0.5f, 0.5f), 48f);
            return _breath;
        }

        public bool Advance(float dt)
        {
            t += dt;
            float rate = target > alpha ? RampInPerSec : RampOutPerSec;
            alpha = Mathf.MoveTowards(alpha, target, rate * dt);
            float renderAlpha;
            if (target >= 1f && alpha >= 0.999f)
            {
                // hold phase: gentle deterministic breathe (render-only, state stays 1)
                renderAlpha = 0.85f + 0.15f * Mathf.Sin(t * 0.9f);
            }
            else renderAlpha = alpha;
            sr.color = new Color(color.r, color.g, color.b, PeakAlpha * renderAlpha);
            if (target <= 0f && alpha <= 0.0001f)
            {
                Kill();
                return false;
            }
            return true;
        }

        void Kill()
        {
            if (Application.isPlaying) UnityEngine.Object.Destroy(go);
            else UnityEngine.Object.DestroyImmediate(go);
        }
    }

    // GATE_PASS: release particle stream at the city gate (brain-tower foot) --
    // 8 cyan dots sweep east across the gate line, staggered, ~3s total
    // (DESIGN 7 "gate release particle flow"). Data cyan = verify face.
    public class GateFlow : TransientFx
    {
        const int DotCount = 8;
        const float DelayStep = 0.26f;
        const float Life = 0.9f;
        const float X0 = -1.7f, X1 = 1.7f;

        class Dot { public GameObject go; public SpriteRenderer sr; public float delay; }

        readonly Dot[] dots = new Dot[DotCount];
        readonly Vector3 basePos;
        readonly Color color = new Color(0.30f, 0.95f, 1f);
        float t;

        public GateFlow(Vector3 pos)
        {
            basePos = pos;
            for (int i = 0; i < DotCount; i++)
            {
                GameObject go = new GameObject("GateDot");
                go.transform.position = pos;
                SpriteRenderer sr = go.AddComponent<SpriteRenderer>();
                sr.sprite = GlowPulse.SharedGlow();
                sr.sortingOrder = 11;
                sr.color = new Color(color.r, color.g, color.b, 0f);
                go.transform.localScale = new Vector3(0.42f, 0.42f, 1f);   // ~0.84u dot
                dots[i] = new Dot { go = go, sr = sr, delay = i * DelayStep };
            }
        }

        public override bool Advance(float dt)
        {
            t += dt;
            bool any = false;
            for (int i = 0; i < dots.Length; i++)
            {
                Dot d = dots[i];
                if (d.go == null) continue;
                float local = t - d.delay;
                if (local < 0f) { any = true; continue; }
                if (local >= Life) { KillGo(d.go); d.go = null; continue; }
                float k = local / Life;
                d.sr.color = new Color(color.r, color.g, color.b, 0.9f * Mathf.Sin(k * Mathf.PI));
                d.go.transform.position = new Vector3(
                    Mathf.Lerp(X0, X1, k) + basePos.x, basePos.y, basePos.z);
                any = true;
            }
            return any;
        }
    }

    // soft band sprite shared by the band faces (flat streak, vertical falloff)
    internal static class CityFxBands
    {
        static Sprite band;

        // 64x16 white band, soft top/bottom edges (native 2u x 0.5u at 32ppu)
        internal static Sprite Get()
        {
            if (band != null) return band;
            const int W = 64, H = 16;
            Texture2D tex = new Texture2D(W, H, TextureFormat.RGBA32, false);
            tex.filterMode = FilterMode.Bilinear;
            for (int y = 0; y < H; y++)
            {
                float dy = (y + 0.5f) / H * 2f - 1f;
                float a = Mathf.Clamp01(1f - Mathf.Abs(dy));
                a = a * a * (3f - 2f * a);
                for (int x = 0; x < W; x++) tex.SetPixel(x, y, new Color(1f, 1f, 1f, a));
            }
            tex.Apply();
            band = Sprite.Create(tex, new Rect(0, 0, W, H), new Vector2(0.5f, 0.5f), 32f);
            return band;
        }
    }

    // GATE_BLOCK: red intercept band at the city gate -- ALERT r13 red-band
    // family, the gate slams shut for one beat (DESIGN 7 "red pulse intercept").
    public class BandFlash : TransientFx
    {
        const float Life = 1.4f;
        const float PeakAlpha = 0.85f;

        readonly GameObject go;
        readonly SpriteRenderer sr;
        readonly Color color;
        float t;

        public BandFlash(Vector3 pos, Color c, float widthU, float heightU, int sortOrder, string goName)
        {
            color = c;
            go = new GameObject(goName);
            go.transform.position = pos;
            sr = go.AddComponent<SpriteRenderer>();
            sr.sprite = CityFxBands.Get();
            sr.sortingOrder = sortOrder;
            sr.color = new Color(c.r, c.g, c.b, 0f);
            go.transform.localScale = new Vector3(widthU / 2f, heightU * 2f, 1f);   // native 2u x 0.5u
        }

        public override bool Advance(float dt)
        {
            t += dt;
            float a = t >= Life ? 0f : Mathf.Sin(Mathf.Clamp01(t / Life) * Mathf.PI);
            sr.color = new Color(color.r, color.g, color.b, PeakAlpha * a);
            if (t >= Life) { KillGo(go); return false; }
            return true;
        }
    }

    // TRANSFER: fleet bulk-transfer light band sweeping along the south trunk
    // avenue, ~3s (DESIGN 7 "transport light band across the city").
    // DISTINCTNESS LAW (r114): COMMIT's canon face is a river-crossing data
    // stream (P-41 slice 1, still reserved) -- this band is a STREET band SOUTH
    // of the water rows. The two geometry domains must never overlap: BandY
    // stays in the south trunk rows (-8..-7 per the r101 survey), far below the
    // water band (rows -3..2). EventRouterProof asserts it.
    public class TransferBand : TransientFx
    {
        public const float BandY = -7.5f;   // south trunk avenue center (street band)
        const float X0 = -30f, X1 = 30f;
        const float Life = 3.0f;
        const float PeakAlpha = 0.7f;

        readonly GameObject go;
        readonly SpriteRenderer sr;
        readonly Color color = new Color(0.30f, 0.95f, 1f);   // data cyan
        float t;

        public TransferBand()
        {
            go = new GameObject("TransferBand");
            go.transform.position = new Vector3(X0, BandY, 0f);
            sr = go.AddComponent<SpriteRenderer>();
            sr.sprite = CityFxBands.Get();
            sr.sortingOrder = 5;    // street level: above tilemaps (0..4), below neon/sign faces
            sr.color = new Color(color.r, color.g, color.b, 0f);
            go.transform.localScale = new Vector3(11f / 2f, 0.9f * 2f, 1f);   // 11u x 0.9u
        }

        public override bool Advance(float dt)
        {
            t += dt;
            float k = Mathf.Clamp01(t / Life);
            float a = 1f;
            if (k < 0.10f) a = k / 0.10f;
            else if (k > 0.85f) a = (1f - k) / 0.15f;
            sr.color = new Color(color.r, color.g, color.b, PeakAlpha * a);
            go.transform.position = new Vector3(Mathf.Lerp(X0, X1, k), BandY, 0f);
            if (t >= Life) { KillGo(go); return false; }
            return true;
        }
    }

    // COMMIT (r116 P-41 slice 1): data-messenger stream crossing the river,
    // south bank -> north bank (CEO canon map: "south->north data light stream
    // across the river"; DESIGN 7: a commit is a data messenger running to the
    // brain ring). Cyan messenger dots climb the water lane toward the tower.
    // Full-span bright chain: 14 dots at 0.69u spacing bridge the whole 9.2u
    // crossing -- the 7-dot first pass read as a partial comet hovering over
    // the north bank in a static frame (r116 red chain: multimodal judged it
    // "not bank-to-bank"); mid-flight the light now spans bank to bank. Core
    // runs a brighter cyan to survive the day-phase worst case (water
    // luminance ~0.49). Lane follows the event's zone down the three nerve
    // trunk arteries (gaming -> GAME lane, media -> MEDIA lane, rest ->
    // central tower axis). DISTINCTNESS LAW (r114/r115): this face owns the
    // RIVER domain, the TransferBand owns the street rows -- the two vertical
    // spans never overlap (EventRouterProof asserts it).
    public class CommitStream : TransientFx
    {
        public const float Y0 = -4.6f;   // south bank launch line (above street rows)
        public const float Y1 = 4.6f;    // north bank arrival (brain-ring side)
        const int DotCount = 14;         // full-span chain: 13x0.12s spacing ~= 9.0u of light
        const float DelayStep = 0.12f;
        const float DotLife = 1.6f;

        class Dot { public GameObject go; public SpriteRenderer sr; public float delay; }

        readonly Dot[] dots = new Dot[DotCount];
        readonly float laneX;
        readonly Color color = new Color(0.52f, 0.98f, 1f);   // bright data cyan (five-color law, day-water contrast)
        float t;

        public CommitStream(string zone)
        {
            laneX = LaneX(zone);
            for (int i = 0; i < DotCount; i++)
            {
                GameObject go = new GameObject("CommitDot");
                go.transform.position = new Vector3(laneX, Y0, 0f);
                SpriteRenderer sr = go.AddComponent<SpriteRenderer>();
                sr.sprite = GlowPulse.SharedGlow();
                sr.sortingOrder = 11;
                sr.color = new Color(color.r, color.g, color.b, 0f);
                go.transform.localScale = new Vector3(0.55f, 0.55f, 1f);   // ~1.1u messenger dot
                dots[i] = new Dot { go = go, sr = sr, delay = i * DelayStep };
            }
        }

        // nerve trunk lane per zone: three arteries radiate from the tower
        // (DESIGN 3); quant/governance/unknown ride the central tower axis.
        public static float LaneX(string zone)
        {
            if (zone == "gaming") return -21f;
            if (zone == "media") return 21f;
            return 0f;
        }

        public override bool Advance(float dt)
        {
            t += dt;
            bool any = false;
            for (int i = 0; i < dots.Length; i++)
            {
                Dot d = dots[i];
                if (d.go == null) continue;
                float local = t - d.delay;
                if (local < 0f) { any = true; continue; }
                if (local >= DotLife) { KillGo(d.go); d.go = null; continue; }
                float k = local / DotLife;
                d.sr.color = new Color(color.r, color.g, color.b, 0.9f * Mathf.Sin(k * Mathf.PI));
                d.go.transform.position = new Vector3(laneX, Mathf.Lerp(Y0, Y1, k), 0f);
                any = true;
            }
            return any;
        }
    }

    // r117 (P-41 slice 2): TASK_CLAIM / TASK_DONE canon faces (CEO canon map:
    // claim = "the zone's own building lights up + a robot walks out"; done =
    // "robot goes home + windows go dark + one light pulse"). Fleet tasks all
    // carry zone "quant" today (fleet_tasks probe domain), so the live face
    // rides the QUANT twist tower; gaming/media map to their own towers for
    // future task sources. Geometry derives from the r103 southbank-manifest
    // footprints (single geometry source; the proof re-reads the manifest and
    // asserts containment). Window dots carry the zone light-family color
    // (five-color law: QUANT gold / GAME cyan / MEDIA magenta); the robot is a
    // bright data-cyan lamp dot (street-robot head-lamp semantics, v0 -- a
    // physical walking sprite is M2 polish).
    public static class TaskLights
    {
        // world rects [x0,y0,x1,y1] = southbank-manifest.json masses (r103)
        public static readonly float[] QuantRect = { -2f, -16f, 3f, -8f };
        public static readonly float[] GameRect = { -23f, -16f, -18f, -11f };
        public static readonly float[] MediaRect = { 19f, -14f, 25f, -8f };

        public static float[] RectFor(string zone)
        {
            if (zone == "gaming") return GameRect;
            if (zone == "media") return MediaRect;
            return QuantRect;   // quant + governance/unknown: fleet home city (probe zone law)
        }

        public static Color WindowColor(string zone)
        {
            if (zone == "gaming") return new Color(0.30f, 0.95f, 1f);   // GAME cyan
            if (zone == "media") return new Color(1f, 0.30f, 0.70f);    // MEDIA magenta
            return new Color(1f, 0.80f, 0.30f);                          // QUANT gold
        }

        public static void GridFor(float[] rect, out int cols, out int rows)
        {
            cols = Mathf.Max(3, Mathf.RoundToInt((rect[2] - rect[0]) / 1.3f));
            rows = Mathf.Max(2, Mathf.RoundToInt((rect[3] - rect[1]) / 1.8f));
        }

        static Sprite square;

        // r117 red-chain 1: the first pass used soft radial glow dots -- on the
        // gold QUANT tower the multimodal judge read the face as uniform tower
        // tone (r115 breath v1/v2 same family). Pixel windows are CRISP solid
        // blocks: 16x16 solid core + 1px rim, native 0.5u at 32ppu (scale 1).
        // A hard edge survives any static frame (visibility law, r110).
        internal static Sprite WindowSprite()
        {
            if (square != null) return square;
            const int S = 16;
            Texture2D tex = new Texture2D(S, S, TextureFormat.RGBA32, false);
            tex.filterMode = FilterMode.Point;   // pixel law: crisp edges, no soft blend
            for (int y = 0; y < S; y++)
                for (int x = 0; x < S; x++)
                {
                    bool rim = x == 0 || y == 0 || x == S - 1 || y == S - 1;
                    tex.SetPixel(x, y, new Color(1f, 1f, 1f, rim ? 0.35f : 1f));
                }
            tex.Apply();
            square = Sprite.Create(tex, new Rect(0, 0, S, S), new Vector2(0.5f, 0.5f), 32f);
            return square;
        }
    }

    // TASK_CLAIM: the zone building's windows light up in a staggered ramp and
    // a robot lamp dot walks out the front door onto the avenue (canon
    // "windows up / robot out"). Envelope: per-window ramp 0.6s / hold to 2.4s
    // / fade to 3.0s, stagger 0.05s; robot walk 1.2s then fades.
    public class TaskClaimFace : TransientFx
    {
        const float StaggerStep = 0.05f;
        const float RampSec = 0.6f;
        const float HoldSec = 2.4f;
        const float FadeSec = 3.0f;
        const float RobotDelay = 0.10f;
        const float RobotMoveSec = 1.2f;
        const float RobotIngress = 2.6f;   // door -> avenue walk distance

        class Window { public SpriteRenderer sr; public float delay; }
        readonly Window[] windows;
        readonly GameObject parent;
        readonly GameObject robotGo;
        readonly SpriteRenderer robotSr;
        readonly Color winColor;
        readonly Color robotColor = new Color(0.52f, 0.98f, 1f);   // data-cyan lamp (dot family)
        readonly float doorX, frontY;
        readonly float life;
        float t;

        public TaskClaimFace(string zone)
        {
            float[] rect = TaskLights.RectFor(zone);
            winColor = TaskLights.WindowColor(zone);
            doorX = (rect[0] + rect[2]) * 0.5f;
            frontY = rect[3];
            parent = new GameObject("TaskClaim");
            int cols, rows; TaskLights.GridFor(rect, out cols, out rows);
            float ux0 = rect[0] + 0.55f, uy0 = rect[1] + 0.55f;
            float uw = (rect[2] - rect[0]) - 1.1f, uh = (rect[3] - rect[1]) - 1.1f;
            windows = new Window[cols * rows];
            for (int j = 0; j < rows; j++)
                for (int i = 0; i < cols; i++)
                {
                    GameObject go = new GameObject("TaskWindow");
                    go.transform.parent = parent.transform;
                    go.transform.position = new Vector3(
                        ux0 + (i + 0.5f) * uw / cols, uy0 + (j + 0.5f) * uh / rows, 0f);
                    SpriteRenderer sr = go.AddComponent<SpriteRenderer>();
                    sr.sprite = TaskLights.WindowSprite();
                    sr.sortingOrder = 9;   // above the ambient tint (8), neon-face level
                    sr.color = new Color(winColor.r, winColor.g, winColor.b, 0f);
                    go.transform.localScale = new Vector3(1f, 1f, 1f);   // crisp 0.5u pixel window
                    windows[j * cols + i] = new Window { sr = sr, delay = (j * cols + i) * StaggerStep };
                }
            robotGo = new GameObject("TaskRobot");
            robotGo.transform.parent = parent.transform;
            robotGo.transform.position = new Vector3(doorX, frontY - 0.5f, 0f);
            robotSr = robotGo.AddComponent<SpriteRenderer>();
            robotSr.sprite = TaskLights.WindowSprite();
            robotSr.sortingOrder = 11;
            robotSr.color = new Color(robotColor.r, robotColor.g, robotColor.b, 0f);
            robotGo.transform.localScale = new Vector3(1.33f, 1.33f, 1f);   // ~0.67u = street-robot size (P-17)
            life = windows[windows.Length - 1].delay + FadeSec + 0.2f;
        }

        public override bool Advance(float dt)
        {
            t += dt;
            for (int i = 0; i < windows.Length; i++)
            {
                float local = t - windows[i].delay;
                float a;
                if (local <= 0f) a = 0f;
                else if (local < RampSec) a = Mathf.SmoothStep(0f, 1f, local / RampSec);
                else if (local < HoldSec) a = 1f;
                else if (local < FadeSec) a = 1f - (local - HoldSec) / (FadeSec - HoldSec);
                else a = 0f;
                windows[i].sr.color = new Color(winColor.r, winColor.g, winColor.b, 0.85f * a);
            }
            float rLocal = t - RobotDelay;
            float rA = 0f;
            if (rLocal > 0f)
            {
                float k = Mathf.Clamp01(rLocal / RobotMoveSec);
                robotGo.transform.position = new Vector3(doorX,
                    Mathf.Lerp(frontY - 0.5f, frontY + RobotIngress, k), 0f);
                rA = Mathf.Min(1f, rLocal / 0.15f);
                if (rLocal > RobotMoveSec) rA = Mathf.Max(0f, 1f - (rLocal - RobotMoveSec) / 0.5f);
            }
            robotSr.color = new Color(robotColor.r, robotColor.g, robotColor.b, 0.95f * rA);
            if (t >= life) { KillGo(parent); return false; }
            return true;
        }
    }

    // TASK_DONE: the reverse face -- the windows still lit from the work
    // session hold half a beat, then dim out in a staggered sweep (canon
    // "windows go dark"), the robot lamp dot walks home through the front
    // door, and one light pulse fires on the building (canon "light pulse").
    public class TaskDoneFace : TransientFx
    {
        const float WinStartAlpha = 0.85f;
        const float HoldSec = 0.5f;      // all windows stay lit this long first
        const float OffStep = 0.05f;
        const float OffFade = 0.4f;
        const float RobotDelay = 0.05f;
        const float RobotMoveSec = 1.2f;
        const float RobotIngress = 2.6f;
        const float PulseLife = 1.5f;
        const float Life = 2.6f;

        class Window { public SpriteRenderer sr; public float delay; }
        readonly Window[] windows;
        readonly GameObject parent;
        readonly GameObject robotGo;
        readonly SpriteRenderer robotSr;
        readonly GameObject pulseGo;
        readonly SpriteRenderer pulseSr;
        readonly Color winColor;
        readonly Color robotColor = new Color(0.52f, 0.98f, 1f);
        readonly float doorX, frontY, pulseY;
        float t;

        public TaskDoneFace(string zone)
        {
            float[] rect = TaskLights.RectFor(zone);
            winColor = TaskLights.WindowColor(zone);
            doorX = (rect[0] + rect[2]) * 0.5f;
            frontY = rect[3];
            pulseY = (rect[1] + rect[3]) * 0.5f;
            parent = new GameObject("TaskDone");
            int cols, rows; TaskLights.GridFor(rect, out cols, out rows);
            float ux0 = rect[0] + 0.55f, uy0 = rect[1] + 0.55f;
            float uw = (rect[2] - rect[0]) - 1.1f, uh = (rect[3] - rect[1]) - 1.1f;
            windows = new Window[cols * rows];
            for (int j = 0; j < rows; j++)
                for (int i = 0; i < cols; i++)
                {
                    GameObject go = new GameObject("TaskWindow");
                    go.transform.parent = parent.transform;
                    go.transform.position = new Vector3(
                        ux0 + (i + 0.5f) * uw / cols, uy0 + (j + 0.5f) * uh / rows, 0f);
                    SpriteRenderer sr = go.AddComponent<SpriteRenderer>();
                    sr.sprite = TaskLights.WindowSprite();
                    sr.sortingOrder = 9;
                    sr.color = new Color(winColor.r, winColor.g, winColor.b, WinStartAlpha);
                    go.transform.localScale = new Vector3(1f, 1f, 1f);
                    windows[j * cols + i] = new Window { sr = sr, delay = HoldSec + (j * cols + i) * OffStep };
                }
            robotGo = new GameObject("TaskRobot");
            robotGo.transform.parent = parent.transform;
            robotGo.transform.position = new Vector3(doorX, frontY + RobotIngress, 0f);
            robotSr = robotGo.AddComponent<SpriteRenderer>();
            robotSr.sprite = TaskLights.WindowSprite();
            robotSr.sortingOrder = 11;
            robotSr.color = new Color(robotColor.r, robotColor.g, robotColor.b, 0.95f);
            robotGo.transform.localScale = new Vector3(1.33f, 1.33f, 1f);
            pulseGo = new GameObject("TaskPulse");
            pulseGo.transform.parent = parent.transform;
            pulseGo.transform.position = new Vector3(doorX, pulseY, 0f);
            pulseSr = pulseGo.AddComponent<SpriteRenderer>();
            pulseSr.sprite = GlowPulse.SharedGlow();
            pulseSr.sortingOrder = 10;
            pulseSr.color = new Color(winColor.r, winColor.g, winColor.b, 0f);
            pulseGo.transform.localScale = new Vector3(0.75f, 0.75f, 1f);   // ~1.5u pulse
        }

        public override bool Advance(float dt)
        {
            t += dt;
            for (int i = 0; i < windows.Length; i++)
            {
                float local = t - windows[i].delay;
                float a = local <= 0f ? 1f : Mathf.Max(0f, 1f - local / OffFade);
                windows[i].sr.color = new Color(winColor.r, winColor.g, winColor.b, WinStartAlpha * a);
            }
            float rLocal = t - RobotDelay;
            if (rLocal > 0f)
            {
                float k = Mathf.Clamp01(rLocal / RobotMoveSec);
                robotGo.transform.position = new Vector3(doorX,
                    Mathf.Lerp(frontY + RobotIngress, frontY - 0.5f, k), 0f);
                float rA = Mathf.Min(1f, rLocal / 0.15f);
                if (rLocal > RobotMoveSec) rA = Mathf.Max(0f, 1f - (rLocal - RobotMoveSec) / 0.35f);
                robotSr.color = new Color(robotColor.r, robotColor.g, robotColor.b, 0.95f * rA);
            }
            float pA = t >= PulseLife ? 0f : Mathf.Sin(t / PulseLife * Mathf.PI);
            pulseSr.color = new Color(winColor.r, winColor.g, winColor.b, 0.75f * pA);
            if (t >= Life) { KillGo(parent); return false; }
            return true;
        }
    }

    // scene adapter CityEventRouter lives in CityEventRouter.cs (SEPARATE FILE LAW, r14)
}
