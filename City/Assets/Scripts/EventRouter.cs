// FluxVerse P-15 r12 (split r14; gate widened r30; five city-core faces r115
// P-12 slice 4): event router pure logic core — poll/cursor/parse/route.
// CEO_ORDER -> gold glow pulse + five city-core faces (OS round breath, city
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
        // research batch first).
        public static readonly string[] VisualTypes =
        {
            "OS_TICK_START", "OS_TICK_DONE", "GATE_PASS", "GATE_BLOCK", "TRANSFER"
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

        void Dispatch(FluxEvent ev)
        {
            // r115 P-12(4): five city-core types now carry mapped faces (DESIGN 7
            // rows: OS round breath / gate release+intercept / transport band).
            // Every other row still has no visual (M2 work, un-anchored pulses
            // forbidden: every animation anchors a real mapped behavior).
            switch (ev.type)
            {
                case "CEO_ORDER":
                    pulses.Add(new GlowPulse(AnchorPos(), new Color(1f, 0.85f, 0.45f)));   // CEO gold
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
            }
            if (EventSink != null) EventSink(ev);   // P-27 r25: same event, second presenter (audio)
        }

        // proof hook (editor harness): dispatch as if a live event just arrived
        public void TriggerDirect(string type)
        {
            Dispatch(new FluxEvent { type = type, zone = "test" });
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

    // scene adapter CityEventRouter lives in CityEventRouter.cs (SEPARATE FILE LAW, r14)
}
