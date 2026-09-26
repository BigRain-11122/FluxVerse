// FluxVerse r160 (P-20260925-09 D2): CityWindowLight - thin MonoBehaviour
// adapter of the window-light heat face. SEPARATE FILE LAW (r14): the
// component class must live in <ClassName>.cs or the saved scene reference
// dies across editor sessions. The pure law core (WindowLightRules) owns
// EVERY decision; this adapter only WIRES: it polls world/world-state.json
// READ-ONLY every ~10s (CityAmbient law; world/ is the perceptor's
// single-writer domain) for the live zone activities, takes the tier from
// CityAmbient's EXISTING public field CurrentTier (zero new poll face,
// manifest family law) and the date from the local (Beijing) calendar.
//
// RUNTIME-ONLY FAMILY (r148 rim path): every mount is a runtime child with a
// runtime-built texture - the lit set is LIVE data (date | per-zone activity)
// so nothing can be a baked asset. The scene-persisted root GO carries ZERO
// serialized fields (CityStreetBehavior r124 law); ReleaseMounts() destroys
// every child before any scene save (r146 save-purity law - the disk scene
// never learns runtime states) and the next ApplyState rebuilds it all.
//
// REBUILD-ON (manifest): date | tier | per-zone activity (2dp). Tier
// refreshes through the color channel only (alpha, content-invariant - the
// texture bytes do not depend on tier); the textures rebuild when the
// date|rates key changes. Proof taps: RebuildCount (texture rebuilds) +
// MountCount. Missing/broken state file -> keep current visuals (silent
// degrade, the PROOF fails loud). Pure 2D. ASCII. No 3D.
using System;
using System.IO;
using UnityEngine;

namespace FluxVerse
{
    public class CityWindowLight : MonoBehaviour
    {
        public const string GoName = "CityWindowLight";
        public const float PollIntervalSec = WindowLightRules.PollIntervalSec;

        [Serializable] class WsZone { public string id; public float activity; }
        [Serializable] class WsState { public WsZone[] zones; }

        SpriteRenderer[] mounts;        // 8 runtime children, one per building
        string builtKey;               // date|q|g|m (2dp) - the texture rebuild key
        float qRate = 0f, gRate = 0f, mRate = 0f;
        string curDate = "";
        AmbientTier curTier = AmbientTier.Day;
        float pollTimer = 999f;        // poll on first Update
        CityAmbient amb;

        public int RebuildCount { get; private set; }        // proof tap
        public int MountCount { get { return mounts != null ? mounts.Length : 0; } }
        public string CurrentKey { get { return builtKey; } } // proof tap

        void Update()
        {
            if (amb == null)
            {
                GameObject a = GameObject.Find("CityAmbient");
                if (a != null) amb = a.GetComponent<CityAmbient>();
            }
            pollTimer += Time.deltaTime;
            if (pollTimer < PollIntervalSec) return;
            pollTimer = 0f;
            Poll();
        }

        // play-mode entry: live zones + live tier + Beijing date -> the shared law path
        public void Poll()
        {
            float q = qRate, g = gRate, m = mRate;
            bool ok = ReadZoneRates(out q, out g, out m);
            if (!ok) return;   // keep current visuals: probe-contract silent degrade
            AmbientTier t = amb != null ? amb.CurrentTier : AmbientTier.Night;
            ApplyState(t, q, g, m, DateTime.Now.Date.ToString("yyyy-MM-dd"));
        }

        // the shared law path: play-mode polls and batch proofs both land here
        public void ApplyState(AmbientTier t, float quant, float gaming, float media, string date)
        {
            EnsureMounts();
            qRate = WindowLightRules.Clamp01(quant);
            gRate = WindowLightRules.Clamp01(gaming);
            mRate = WindowLightRules.Clamp01(media);
            curDate = date;
            string key = date + "|" + qRate.ToString("0.00") + "|"
                + gRate.ToString("0.00") + "|" + mRate.ToString("0.00");
            if (key != builtKey)
            {
                builtKey = key;
                RebuildTextures();
                RebuildCount++;
            }
            curTier = t;
            float a = WindowLightRules.AlphaFor(t);
            for (int i = 0; i < mounts.Length; i++)
                mounts[i].color = new Color(1f, 1f, 1f, a);
        }

        // builds the 8 runtime mounts (idempotent: full child sweep first)
        public void EnsureMounts()
        {
            if (mounts != null) return;
            for (int i = transform.childCount - 1; i >= 0; i--)
            {
                Transform c = transform.GetChild(i);
                if (Application.isPlaying) Destroy(c.gameObject);
                else DestroyImmediate(c.gameObject);
            }
            mounts = new SpriteRenderer[WindowLightRules.Count];
            for (int i = 0; i < WindowLightRules.Count; i++)
            {
                GameObject go = new GameObject(WindowLightRules.MountName(i));
                go.transform.SetParent(transform, false);
                SpriteRenderer sr = go.AddComponent<SpriteRenderer>();
                sr.sortingOrder = WindowLightRules.Order;
                go.transform.position = new Vector3(
                    WindowLightRules.CenterX(i), WindowLightRules.CenterY(i), WindowLightRules.Z);
                go.transform.localScale = Vector3.one;   // natural size = px / ppu
                mounts[i] = sr;
            }
            if (builtKey == null) RebuildTextures();   // first build: blank until live data
        }

        // repaints every building texture from the live lit law
        void RebuildTextures()
        {
            if (mounts == null) return;
            for (int i = 0; i < WindowLightRules.Count; i++)
            {
                WindowLightRules.Building b = WindowLightRules.At(i);
                float rate = WindowLightRules.ZoneRateFor(b.zone, qRate, gRate, mRate);
                mounts[i].sprite = BuildTexture(i, b, rate, curDate);
            }
        }

        // one building's lit-window texture (fill warm yellow, core interior rows)
        Sprite BuildTexture(int i, WindowLightRules.Building b, float rate, string date)
        {
            int w = WindowLightRules.PxW(i), h = WindowLightRules.PxH(i);
            Texture2D tex = new Texture2D(w, h, TextureFormat.RGBA32, false);
            tex.filterMode = FilterMode.Point;
            Color clear = new Color(0f, 0f, 0f, 0f);
            for (int y = 0; y < h; y++)
                for (int x = 0; x < w; x++) tex.SetPixel(x, y, clear);
            WindowLightRules.Window[] wins = WindowLightRules.WindowsOf(i);
            for (int k = 0; k < wins.Length; k++)
            {
                // r181 rate law v2: the single call site multiplies BASE_RATE x
                // floor factor into the zone rate before ThresholdFor
                // (duskgold-manifest impl_note - minimal delta, r159 law intact)
                float effRate = WindowLightRules.EffectiveRate(b, wins[k], rate);
                if (!WindowLightRules.LitAt(b.id, date, k, effRate)) continue;
                WindowLightRules.Window win = wins[k];
                int tx0, ty0, tw, th;
                WindowLightRules.TexRectOf(b, win, out tx0, out ty0, out tw, out th);
                for (int r = 0; r < th; r++)
                {
                    int ty = ty0 + r;                       // r = row from window top
                    bool core = WindowLightRules.IsCoreRow(win.h, r);
                    Color c = core ? WindowLightRules.Core : WindowLightRules.Fill;
                    for (int x = 0; x < tw; x++) tex.SetPixel(tx0 + x, ty, c);
                }
            }
            tex.Apply();
            return Sprite.Create(tex, new Rect(0, 0, w, h), new Vector2(0.5f, 0.5f),
                WindowLightRules.Ppu);
        }

        // r146 save-purity law face: destroy every runtime mount child
        public void ReleaseMounts()
        {
            for (int c = transform.childCount - 1; c >= 0; c--)
            {
                Transform ch = transform.GetChild(c);
                if (Application.isPlaying) Destroy(ch.gameObject);
                else DestroyImmediate(ch.gameObject);
            }
            mounts = null;
            builtKey = null;
        }

        // proof tap: the resolved mount renderers (caller guarantees EnsureMounts)
        public SpriteRenderer MountAt(int i) { return mounts != null ? mounts[i] : null; }

        static bool ReadZoneRates(out float quant, out float gaming, out float media)
        {
            quant = 0f; gaming = 0f; media = 0f;
            string projectRoot = Path.GetDirectoryName(Application.dataPath);   // .../City
            string repoRoot = Path.GetDirectoryName(projectRoot);               // .../FluxVerse
            string path = Path.Combine(repoRoot, "world", "world-state.json");
            if (!File.Exists(path)) return false;
            try
            {
                WsState s = JsonUtility.FromJson<WsState>(File.ReadAllText(path));
                if (s == null || s.zones == null) return false;
                bool q = false, g = false, m = false;
                for (int i = 0; i < s.zones.Length; i++)
                {
                    WsZone z = s.zones[i];
                    if (z == null) continue;
                    float a = WindowLightRules.Clamp01(z.activity);
                    if (z.id == "quant") { quant = a; q = true; }
                    else if (z.id == "gaming") { gaming = a; g = true; }
                    else if (z.id == "media") { media = a; m = true; }
                }
                return q && g && m;   // data absent = not verified, keep old visuals
            }
            catch (Exception) { return false; }
        }
    }
}
