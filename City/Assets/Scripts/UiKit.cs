// FluxVerse P-18 r22: UiKit - pure procedural builder for the GUIAgent-style UI
// shell (CEO order ~18:55, ledger P-2026-09-23-18, ruling A: UI shell adopts the
// GUIAgent display style, the city world layer keeps its pixel canon). First
// slice: glassmorphism panel + crystal button. ALL 2D light effects, no 3D:
//   Panel  = dark premium glass (moonlight LUT cool darks, semi-transparent)
//            + thin bright rim (xi-miao-bian) + soft outer glow (fa-guang)
//   Button = same glass + accent rim (warm gold = nuan-guang dian-zhui)
//            + top-left highlight streak (gao-guang) + bottom inner shadow
// Procedural SpriteRenderer stacks only - r16 law: a WorldSpace canvas renders
// as ScreenSpaceOverlay in batch mode, so batch-verified UI walks the sprite
// path (renders identically in play mode). Widgets are RUNTIME-ONLY (r13 law):
// built on demand, never saved into a scene. localScale is ALWAYS normalized
// against sprite.bounds.size (r13 law). Scripts ASCII (encoding law).
using System;
using System.Collections.Generic;
using UnityEngine;

namespace FluxVerse
{
    public static class UiKit
    {
        public const float PPU = 32f;
        public const float Depth = -9f;

        // moonlight palette (P-18 2: cool darks + warm accents)
        public static readonly Color GlassTop = new Color(0.06f, 0.085f, 0.13f);
        public static readonly Color GlassBottom = new Color(0.035f, 0.05f, 0.08f);
        public const float GlassAlpha = 0.78f;
        public static readonly Color CoolRim = new Color(0.72f, 0.82f, 0.96f);
        public static readonly Color GlowColor = new Color(0.55f, 0.68f, 0.95f);
        public static readonly Color WarmAccent = new Color(0.92f, 0.76f, 0.35f);
        public static readonly Color StreakColor = new Color(0.82f, 0.90f, 1f);

        // UI shell owns sorting orders 40..59 - above every world layer
        // (banner halo..text = 20..23, weather/alert lower)
        public const int PanelGlowOrder = 40, PanelGlassOrder = 41, PanelRimOrder = 42;
        public const int ButtonGlowOrder = 45, ButtonGlassOrder = 46,
                         ButtonRimOrder = 47, StreakOrder = 48, ShadowOrder = 49;

        // ---- widget builders (runtime-only, caller owns lifetime) ----

        public static GameObject BuildPanel(Transform parent, string name, Vector2 center, Vector2 size)
        {
            GameObject root = new GameObject(name);
            if (parent != null) root.transform.SetParent(parent, false);
            root.transform.position = new Vector3(center.x, center.y, Depth);

            SpriteRenderer glass = Layer(root.transform, "Glass",
                TexturedSprite(MakeGlassTex(TexW(size.x), TexH(size.y))), PanelGlassOrder);
            Fit(glass, size);

            float rimW = RimPx(size) / PPU;
            SpriteRenderer rim = Layer(root.transform, "Rim",
                TexturedSprite(MakeRimTex(TexW(size.x + 2f * rimW), TexH(size.y + 2f * rimW), RimPx(size))),
                PanelRimOrder);
            rim.color = CoolRim;
            Fit(rim, size + new Vector2(2f * rimW, 2f * rimW));

            float range = GlowRange(size);
            SpriteRenderer glow = Layer(root.transform, "Glow",
                TexturedSprite(MakeGlowTex(TexW(size.x + 2f * range), TexH(size.y + 2f * range), range * PPU)),
                PanelGlowOrder);
            glow.color = GlowColor;
            Fit(glow, size + new Vector2(2f * range, 2f * range));
            return root;
        }

        public static GameObject BuildButton(Transform parent, string name, Vector2 center, Vector2 size, Color accent)
        {
            GameObject root = new GameObject(name);
            if (parent != null) root.transform.SetParent(parent, false);
            root.transform.position = new Vector3(center.x, center.y, Depth);

            SpriteRenderer glass = Layer(root.transform, "Glass",
                TexturedSprite(MakeGlassTex(TexW(size.x), TexH(size.y))), ButtonGlassOrder);
            Fit(glass, size);

            float rimW = RimPx(size) / PPU;
            SpriteRenderer rim = Layer(root.transform, "Rim",
                TexturedSprite(MakeRimTex(TexW(size.x + 2f * rimW), TexH(size.y + 2f * rimW), RimPx(size))),
                ButtonRimOrder);
            rim.color = accent;
            Fit(rim, size + new Vector2(2f * rimW, 2f * rimW));

            SpriteRenderer streak = Layer(root.transform, "Streak",
                TexturedSprite(MakeStreakTex(TexW(size.x), TexH(size.y))), StreakOrder);
            streak.color = StreakColor;
            Fit(streak, size);

            SpriteRenderer shadow = Layer(root.transform, "Shadow",
                TexturedSprite(MakeShadowTex(TexW(size.x), TexH(size.y))), ShadowOrder);
            shadow.color = new Color(0f, 0f, 0f, 1f);
            Fit(shadow, size);

            float range = GlowRange(size);
            SpriteRenderer glow = Layer(root.transform, "Glow",
                TexturedSprite(MakeGlowTex(TexW(size.x + 2f * range), TexH(size.y + 2f * range), range * PPU)),
                ButtonGlowOrder);
            glow.color = GlowColor;
            Fit(glow, size + new Vector2(2f * range, 2f * range));
            return root;
        }

        // destroy a widget root and every runtime texture it owns
        public static void Release(GameObject root)
        {
            if (root == null) return;
            List<Texture2D> texs = new List<Texture2D>();
            SpriteRenderer[] srs = root.GetComponentsInChildren<SpriteRenderer>(true);
            for (int i = 0; i < srs.Length; i++)
                if (srs[i].sprite != null && srs[i].sprite.texture != null)
                    texs.Add(srs[i].sprite.texture);
            UnityEngine.Object.DestroyImmediate(root);
            for (int i = 0; i < texs.Count; i++)
                if (texs[i] != null) UnityEngine.Object.DestroyImmediate(texs[i]);
        }

        // ---- procedural textures (pure, deterministic, proof-testable) ----

        public static Texture2D MakeGlassTex(int w, int h)
        {
            Texture2D t = NewTex(w, h, FilterMode.Point);
            for (int y = 0; y < h; y++)
            {
                float k = h > 1 ? (float)y / (h - 1) : 1f;      // y=0 bottom
                Color c = Color.Lerp(GlassBottom, GlassTop, k);
                if (y >= h - 4)                                 // inner top light band
                    c = new Color(c.r + 0.045f, c.g + 0.055f, c.b + 0.07f);
                for (int x = 0; x < w; x++) t.SetPixel(x, y, new Color(c.r, c.g, c.b, GlassAlpha));
            }
            t.Apply();
            return t;
        }

        // white border ring, transparent center - tint via SpriteRenderer.color
        public static Texture2D MakeRimTex(int w, int h, int ringPx)
        {
            Texture2D t = NewTex(w, h, FilterMode.Point);
            for (int y = 0; y < h; y++)
                for (int x = 0; x < w; x++)
                {
                    bool edge = x < ringPx || x >= w - ringPx || y < ringPx || y >= h - ringPx;
                    t.SetPixel(x, y, edge ? new Color(1f, 1f, 1f, 0.95f) : new Color(1f, 1f, 1f, 0f));
                }
            t.Apply();
            return t;
        }

        // glow ramps UP toward the widget edge (peak where the rim sits) and
        // fades to zero at the quad edge - white mask, tint via color
        public static Texture2D MakeGlowTex(int w, int h, float rangePx)
        {
            Texture2D t = NewTex(w, h, FilterMode.Bilinear);
            float peak = rangePx >= 12f ? 0.55f : 0.5f;
            for (int y = 0; y < h; y++)
                for (int x = 0; x < w; x++)
                {
                    float dOuter = Mathf.Min(x, y, w - 1 - x, h - 1 - y);
                    float a = peak * Mathf.Clamp01(dOuter / Mathf.Max(1f, rangePx));
                    t.SetPixel(x, y, new Color(1f, 1f, 1f, a));
                }
            t.Apply();
            return t;
        }

        // top-left diagonal highlight streak (crystal specular), white mask
        public static Texture2D MakeStreakTex(int w, int h)
        {
            Texture2D t = NewTex(w, h, FilterMode.Bilinear);
            for (int y = 0; y < h; y++)
                for (int x = 0; x < w; x++)
                {
                    float nx = w > 1 ? (float)x / (w - 1) : 0f;
                    float nty = h > 1 ? (float)y / (h - 1) : 1f;   // 1 = top
                    float a = Mathf.Max(0f, 1f - (nx + (1f - nty)) / 0.55f) * 0.5f;
                    t.SetPixel(x, y, new Color(1f, 1f, 1f, a));
                }
            t.Apply();
            return t;
        }

        // bottom inner shadow (2D depth cue), white mask (tinted black)
        public static Texture2D MakeShadowTex(int w, int h)
        {
            Texture2D t = NewTex(w, h, FilterMode.Bilinear);
            for (int y = 0; y < h; y++)
                for (int x = 0; x < w; x++)
                {
                    float ny = h > 1 ? (float)y / (h - 1) : 0f;    // 0 = bottom
                    float a = Mathf.Clamp01((0.72f - ny) / 0.28f) * 0.45f;
                    t.SetPixel(x, y, new Color(1f, 1f, 1f, a));
                }
            t.Apply();
            return t;
        }

        // ---- internals ----

        static int TexW(float wu) { return Mathf.Max(8, Mathf.RoundToInt(wu * PPU)); }
        static int TexH(float hu) { return Mathf.Max(8, Mathf.RoundToInt(hu * PPU)); }
        static int RimPx(Vector2 size) { return size.y >= 2f ? 4 : 3; }
        static float GlowRange(Vector2 size) { return size.y >= 2f ? 0.45f : 0.3f; }

        static Texture2D NewTex(int w, int h, FilterMode f)
        {
            Texture2D t = new Texture2D(w, h, TextureFormat.RGBA32, false);
            t.filterMode = f;
            t.wrapMode = TextureWrapMode.Clamp;
            return t;
        }

        static Sprite TexturedSprite(Texture2D tex)
        {
            return Sprite.Create(tex, new Rect(0, 0, tex.width, tex.height),
                new Vector2(0.5f, 0.5f), PPU);
        }

        static SpriteRenderer Layer(Transform parent, string name, Sprite sprite, int order)
        {
            GameObject go = new GameObject(name);
            go.transform.SetParent(parent, false);
            SpriteRenderer sr = go.AddComponent<SpriteRenderer>();
            sr.sprite = sprite;
            sr.sortingOrder = order;
            return sr;
        }

        // r13 law: localScale is RELATIVE to sprite.bounds.size (px/PPU)
        static void Fit(SpriteRenderer sr, Vector2 worldSize)
        {
            Vector3 n = sr.sprite.bounds.size;
            sr.transform.localScale = new Vector3(worldSize.x / n.x, worldSize.y / n.y, 1f);
        }
    }
}
