// FluxVerse P-16 r15/r16: CityInterior - thin MonoBehaviour adapter of the interior
// window. SEPARATE FILE LAW (r14): component class must live in <ClassName>.cs or
// the saved scene reference dies across editor sessions. Pure core (InteriorRouter)
// stays in InteriorWindow.cs. Play mode: left-click a registered building -> the
// company's live panel opens in the OS browser window (v0 equivalent - Tuanjie
// 1.10.3 has no native WebView on the Windows target; see InteriorWindow.cs header)
// AND the in-engine GUIAgent-glass banner confirms it. The banner is RUNTIME-ONLY
// (r13 law): created on demand, never saved into the scene.
//
// r16 PIVOT - the banner is a procedural SpriteRenderer stack, NOT a uGUI canvas:
// r15 measured (pixel-diff on the proof shots) that a WorldSpace Canvas renders
// as ScreenSpaceOverlay in batch-mode Camera.Render() - the renderMode=WorldSpace
// assignment needs a player-loop canvas update that batch mode never runs, so the
// "world-space" banner landed as a 2000x260 SCREEN-px strip at the bottom-left of
// the screen instead of a 20x2.6 world panel. Procedural sprites are the
// r12/r13-proven path (event pulse, weather field, sky gradient) and render
// identically in batch proofs and play mode.
//
// r23 (P-18 slice 2) - the banner shell is the GUIAgent canon: the UiKit recipe
// (dark glass gradient + thin cool rim + blue-violet outer glow) via
// UiKit.BuildGlassPanel, in the banner sorting band (Glow 20 / Glass 22 / Rim
// 21, Text 23). Warm accent = the baked gold CJK text. Hide = UiKit.Release,
// which owns every runtime texture the stack generated.
// Banner text (r18): CJK copy lives in the UTF-8 data file
// Assets/Data/interior-strings.txt; Tools/city/bake-banner-text.ps1 pre-bakes the
// glyphs into Assets/Data/interior-banner-text.png (GDI+ - no CJK font asset in
// the engine) and the banner loads it as a runtime sprite layer (sortingOrder 23).
// Pure 2D: flat sprites, ortho camera, no 3D. Scripts ASCII (encoding law).
using System;
using System.IO;
using UnityEngine;

namespace FluxVerse
{
    public class CityInterior : MonoBehaviour
    {
        public const float BannerLifeSec = 6f;
        public const float BannerWidth = 20f;
        public const float BannerHeight = 2.6f;

        InteriorRouter core;
        Camera cam;
        GameObject banner;
        float bannerLeft;

        public InteriorRouter Core
        {
            get
            {
                if (core == null)
                {
                    // <group root>/quant/bigmoney/... from <repo>/City/Assets (4 levels up)
                    string groupRoot = Application.dataPath;
                    for (int i = 0; i < 4; i++) groupRoot = Path.GetDirectoryName(groupRoot);
                    core = new InteriorRouter(groupRoot, Application.OpenURL, InteriorRouter.DefaultCooldownSec);
                    core.AddDefaultRegistry();
                }
                return core;
            }
        }

        void Update()
        {
            if (Application.isPlaying && Input.GetMouseButtonDown(0))
            {
                Camera c = EnsureCam();
                if (c == null) return;
                Vector3 p = c.ScreenToWorldPoint(Input.mousePosition);
                Vector2 w = new Vector2(p.x, p.y);
                InteriorTarget t = Core.Hit(w);
                if (Core.Open(w, Time.realtimeSinceStartup))
                    ShowBanner(t != null ? t.zone : null, t != null ? t.company : null);
            }
            StepBanner(Time.deltaTime);
        }

        // explicit edit-mode alias for proofs (same Advance/StepNow pattern as CityCameraRig)
        public void StepBanner(float dt)
        {
            if (banner == null) return;
            bannerLeft -= dt;
            Camera c = EnsureCam();
            if (c != null)
            {
                // hug the bottom of whatever view the camera holds (L0 or L1)
                Vector3 cp = c.transform.position;
                banner.transform.position = new Vector3(cp.x, cp.y - c.orthographicSize + BannerHeight * 0.5f + 0.35f, -9f);
            }
            if (bannerLeft <= 0f) HideBanner();
        }

        public void ShowBanner(string zone, string company)
        {
            if (banner == null) BuildBanner();
            banner.SetActive(true);
            bannerLeft = BannerLifeSec;
        }

        public void HideBanner()
        {
            if (banner == null) return;
            // r23: UiKit.Release destroys the banner GO AND every runtime texture
            // the stack owns (UiKit procedural textures + the baked text texture).
            // The pre-r23 code destroyed only the GO, so every show/hide cycle
            // leaked textures - once BuildBanner started generating fresh
            // per-instance textures this had to become an owned-lifetime release.
            UiKit.Release(banner);
            banner = null;
        }

        public bool BannerVisible { get { return banner != null && banner.activeSelf; } }

        // ---- banner construction (runtime-only, NEVER saved - r13 law) ----
        // Procedural sprite stack (r16): 4px white sprite @16ppu = 0.25u natural
        // size; localScale must be RELATIVE to sprite.bounds.size (r13 law) or the
        // panel lands at the wrong world size.
        void BuildBanner()
        {
            banner = new GameObject("InteriorBanner");

            // r23 (P-18 slice 2): the shell is now the GUIAgent canon recipe via
            // UiKit - dark glass gradient + cool thin rim + blue-violet outer glow
            // (replaces the r16 flat-tint halo/rim/glass stack). The banner keeps
            // its own sorting band 20..23 (UiKit widgets own 40..59); the warm
            // accent moves to the baked gold CJK text (moonlight LUT: cool body,
            // warm accent). UiKit.Release on hide owns every texture made here.
            UiKit.BuildGlassPanel(banner.transform, "Shell", Vector2.zero,
                new Vector2(BannerWidth, BannerHeight), 20, 22, 21);

            // r18 CJK text layer: pre-baked by Tools/city/bake-banner-text.ps1 (GDI+
            // glyph rasterization - the engine has no CJK font asset). Runtime bytes
            // path (File.ReadAllBytes + LoadImage): no asset-import dependency, so
            // batch proofs and play mode load the identical pixels. Silent degrade
            // when the bake is absent (the proof fails loud instead).
            Sprite text = BannerTextSprite();
            if (text != null)
            {
                SpriteRenderer txt = MakeSprite(banner.transform, "Text", text, 23);
                txt.transform.localScale = Vector3.one;   // natural 20x2.6 via bake ppu 50
            }

            banner.transform.position = new Vector3(0f, 0f, -9f);   // in front of the z=0 city
        }

        // 1000x130 bake @ 50px/u -> 20x2.6 world units (exactly the glass size).
        // r18 notes baked into this loader:
        //  a) the PNG lives in City/BannerData/ OUTSIDE Assets/ - the runtime
        //     bytes path never touches the importer, so the bake must not grow an
        //     imported twin under Assets/ (TextureImporter meta noise). The r18
        //     "solid gold quad" regression was NOT the importer - it was a lost
        //     glass localScale line during the text-layer edit (the misdiagnosis
        //     walk is on record in TECH §九 so the class is not re-learned).
        //  b) explicit Apply() after LoadImage - deterministic upload, batch and
        //     play render the identical pixels.
        static Sprite BannerTextSprite()
        {
            string path = Path.Combine(
                Path.GetDirectoryName(Application.dataPath), "BannerData", "interior-banner-text.png");
            if (!File.Exists(path)) return null;
            Texture2D tex = new Texture2D(2, 2, TextureFormat.RGBA32, false);
            if (!tex.LoadImage(File.ReadAllBytes(path)))
            {
                UnityEngine.Object.Destroy(tex);
                return null;
            }
            tex.filterMode = FilterMode.Point;
            tex.Apply(false, false);
            return Sprite.Create(tex, new Rect(0, 0, tex.width, tex.height), new Vector2(0.5f, 0.5f), 50f);
        }

        static SpriteRenderer MakeSprite(Transform parent, string name, Sprite sprite, int order)
        {
            GameObject go = new GameObject(name);
            go.transform.SetParent(parent, false);
            SpriteRenderer sr = go.AddComponent<SpriteRenderer>();
            sr.sprite = sprite;
            sr.sortingOrder = order;
            return sr;
        }

        // (r23) WhiteSprite retired with the r16 flat-tint layers - the banner
        // shell now renders UiKit procedural textures and the text layer the bake.

        Camera EnsureCam()
        {
            if (cam == null) cam = GetComponent<Camera>();
            return cam;
        }
    }
}
