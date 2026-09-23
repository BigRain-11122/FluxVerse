// FluxVerse P-15 r12 (split r14): event router pure logic core — poll/cursor/parse/route
// CEO_ORDER -> gold glow pulse, headless-testable. The MonoBehaviour adapter
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
                if (line.IndexOf("\"CEO_ORDER\"", StringComparison.Ordinal) < 0) continue; // cheap gate
                FluxEvent ev = null;
                try { ev = JsonUtility.FromJson<FluxEvent>(line); } catch (Exception) { ev = null; }
                if (ev != null && ev.type == "CEO_ORDER")
                {
                    Dispatch(ev);
                    fired++;
                }
            }
            cursor = lines.Length;
            return fired;
        }

        void Dispatch(FluxEvent ev)
        {
            Vector3? pos = anchorLookup != null ? anchorLookup("BrainTower") : null;
            if (pos == null) pos = new Vector3(0f, 11f, 0f);   // hardcoded fallback = builder anchor
            pulses.Add(new GlowPulse(pos.Value, new Color(1f, 0.85f, 0.45f)));   // CEO gold
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

    // scene adapter CityEventRouter lives in CityEventRouter.cs (SEPARATE FILE LAW, r14)
}
