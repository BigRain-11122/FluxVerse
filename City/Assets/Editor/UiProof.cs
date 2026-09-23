// FluxVerse P-18 r22: batch proof for the UI shell slice 1 (sentinel pattern,
// r12-r20 style). Proves, fail-loud:
//  1) PURE TEXTURES: glass gradient + alpha, rim border ring vs transparent
//     center, glow ramp (zero at quad edge, saturated at the widget edge),
//     streak top-left / shadow bottom asymmetry - the GUIAgent style atoms.
//  2) WIDGET BUILD: exact world bounds (14x3 panel, 3.2x1 buttons via the r13
//     localScale law), sorting orders (panel layer < button layer, inner order
//     chain glow<glass<rim<streak<shadow), pure-2D law (SpriteRenderer only -
//     no MeshFilter/MeshRenderer/Camera/Light/Canvas anywhere).
//  3) GLASS ATTENUATION, deterministic: a white test lamp behind the panel is
//     measured DIRECT (>=0.75 with the glass child disabled) vs THROUGH the
//     glass (<=0.45, alpha 0.78 dark glass) - no dependence on what the city
//     looks like behind the panel.
//  4) REAL RENDERS at L0 night (deterministic camera: Advance(0) -> (0,0) size
//     20, byte-reproducible): the cool rim ring gains bright pixels vs the
//     baseline sky ring (thin bright border), the gold accent rim lights warm
//     pixels around the center button, the streak makes the button top half
//     brighter than the bottom half, toggling the glow layers brightens the
//     halo band, and after Release the frame returns to the baseline mean.
//  5) RUNTIME-ONLY LAW + idempotent rebuild: widgets never saved (no SaveScene
//     call anywhere in this proof; rebuilt panel lands on identical bounds).
//     No cross-session reload gate: nothing is persisted, so there is no
//     reload surface to re-resolve (r14 law applies to scene wiring only).
// Sentinels: <repo>/logs/ui.run -> <repo>/logs/ui.done.
// Screenshot: docs/design/m1-r22-uishell.png. Pure 2D. ASCII (encoding law).
// r22 layout fix: the builder paints pavement to world y=15 (tile cells 9..14) while the
// night tint quad tops at +14 - the old ring band bottom strip (y 14.5..15.1) measured that
// 1u untinted bright strip and tripped the quiet-sky gate (7 rows x 203 cols = exactly 1421
// bright samples). All widgets shifted +0.7u (panel center 16.5 -> 17.2) so every gate
// region stays >= 15.2 = genuinely dark night sky.
using System;
using System.IO;
using UnityEngine;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine.SceneManagement;

namespace FluxVerse
{
    public static class UiProof
    {
        static string ProjectRoot { get { return Path.GetDirectoryName(Application.dataPath); } }
        static string RepoRoot { get { return Path.GetDirectoryName(ProjectRoot); } }
        static string SentinelPath { get { return Path.Combine(RepoRoot, "logs", "ui.run"); } }
        static string DonePath { get { return Path.Combine(RepoRoot, "logs", "ui.done"); } }
        static string ScenePath { get { return "Assets/Scenes/CityScene.unity"; } }
        static int asserts;

        // widget layout under test (world units)
        static readonly Vector2 PanelCenter = new Vector2(0f, 17.2f);
        static readonly Vector2 PanelSize = new Vector2(14f, 3f);
        static readonly Vector2 BtnSize = new Vector2(3.2f, 1f);
        static readonly float BtnY = 16.25f;

        [InitializeOnLoadMethod]
        static void Hook()
        {
            if (File.Exists(SentinelPath))
                EditorApplication.delayCall += Run;
        }

        public static void BatchRun() { Run(); }

        static void Run()
        {
            if (!File.Exists(SentinelPath)) return;   // single-shot guard
            try
            {
                string report = Prove();
                File.WriteAllText(DonePath, "OK " + report + " ts=" + DateTime.UtcNow.ToString("o"));
            }
            catch (Exception e)
            {
                File.WriteAllText(DonePath, "FAIL " + e.GetType().Name + ": " + e.Message + " | "
                    + e.StackTrace + " ts=" + DateTime.UtcNow.ToString("o"));
            }
            finally
            {
                if (File.Exists(SentinelPath)) File.Delete(SentinelPath);
            }
        }

        static void Chk(bool ok, string what)
        {
            if (!ok) throw new InvalidOperationException("ASSERT FAIL: " + what);
            asserts++;
        }

        static string Prove()
        {
            // ---------- A. pure texture gates (the GUIAgent style atoms) ----------
            Texture2D glass = UiKit.MakeGlassTex(64, 32);
            Color gTop = glass.GetPixel(2, 31), gBot = glass.GetPixel(2, 0), gMid = glass.GetPixel(32, 16);
            Chk((gTop.r + gTop.g + gTop.b) - (gBot.r + gBot.g + gBot.b) >= 0.03f,
                "glass must lighten toward the top (moonlight gradient)");
            Chk(Mathf.Abs(gMid.a - UiKit.GlassAlpha) < 0.02f,
                "glass center alpha must be " + UiKit.GlassAlpha + ", got " + gMid.a.ToString("F2"));
            Texture2D rim = UiKit.MakeRimTex(64, 32, 4);
            Chk(rim.GetPixel(2, 2).a > 0.8f, "rim border must be near-opaque");
            Chk(rim.GetPixel(32, 16).a < 0.1f, "rim center must be transparent");
            Texture2D glow = UiKit.MakeGlowTex(64, 32, 12f);
            Chk(glow.GetPixel(0, 16).a < 0.02f, "glow must die at the quad edge");
            Chk(glow.GetPixel(6, 16).a > 0.2f, "glow must ramp up toward the widget edge");
            Texture2D streak = UiKit.MakeStreakTex(64, 32);
            Chk(streak.GetPixel(2, 30).a > 0.3f, "streak must live in the top-left");
            Chk(streak.GetPixel(60, 2).a < 0.05f, "streak bottom-right must be empty");
            Texture2D shadow = UiKit.MakeShadowTex(64, 32);
            Chk(shadow.GetPixel(32, 1).a > 0.3f, "shadow must live at the bottom");
            Chk(shadow.GetPixel(32, 30).a < 0.05f, "shadow top must be empty");
            UnityEngine.Object.DestroyImmediate(glass);
            UnityEngine.Object.DestroyImmediate(rim);
            UnityEngine.Object.DestroyImmediate(glow);
            UnityEngine.Object.DestroyImmediate(streak);
            UnityEngine.Object.DestroyImmediate(shadow);

            // ---------- B. deterministic city frame (L0 night) ----------
            EditorSceneManager.OpenScene(ScenePath, OpenSceneMode.Single);
            GameObject camGo = GameObject.Find("CityCamera");
            Chk(camGo != null, "CityCamera missing in CityScene");
            Camera cam = camGo != null ? camGo.GetComponent<Camera>() : null;
            CityCameraRig rig = camGo != null ? camGo.GetComponent<CityCameraRig>() : null;
            Chk(rig != null, "CityCameraRig missing");
            GameObject ambGo = GameObject.Find("CityAmbient");
            CityAmbient amb = ambGo != null ? ambGo.GetComponent<CityAmbient>() : null;
            Chk(amb != null, "CityAmbient missing");
            rig.Advance(0f);                                   // L0 (0,0) size 20, frozen drift
            Chk(Mathf.Abs(rig.SizeNow - 20f) < 0.01f, "must sit at L0 size 20");
            amb.EnsureVisuals();
            amb.ApplyAmbient(AmbientTier.Night);
            amb.ApplyWeather("clear", 0f, 0);
            amb.StepWeather(0.1f);

            // ---------- C. baseline ----------
            float baseStrip; int baseBright, baseWarm;
            Texture2D baseShot = Shot(cam, null);
            BoxStats(baseShot, cam, PanelCenter.x, 17.75f, 6.6f, 0.75f, 2,
                out baseStrip, out baseBright, out baseWarm);
            Chk(baseStrip > 0.02f && baseStrip < 0.5f,
                "baseline sky strip must be dark sky, got " + baseStrip.ToString("F3"));
            float baseRingMean; int baseRingBright, baseRingWarm;
            RingStats(baseShot, cam, PanelCenter, 6.9f, 1.4f, 7.5f, 2f, 2,
                out baseRingMean, out baseRingBright, out baseRingWarm);
            Chk(baseRingBright < 300, "baseline ring must be quiet sky, got " + baseRingBright);

            // ---------- D. panel + lamp: deterministic glass attenuation ----------
            GameObject panel = UiKit.BuildPanel(null, "UiPanel", PanelCenter, PanelSize);
            SpriteRenderer panelGlass = panel.transform.Find("Glass").GetComponent<SpriteRenderer>();
            Bounds gb = panelGlass.bounds;
            Chk(Mathf.Abs(gb.size.x - PanelSize.x) < 0.05f && Mathf.Abs(gb.size.y - PanelSize.y) < 0.05f,
                "panel glass world size must be " + PanelSize.x + "x" + PanelSize.y + ", got "
                + gb.size.x.ToString("F2") + "x" + gb.size.y.ToString("F2"));
            Chk(Mathf.Abs(panel.transform.position.z - UiKit.Depth) < 0.01f,
                "panel must render at the UI depth z=" + UiKit.Depth);

            GameObject lamp = BuildLamp(new Vector2(0f, 17.2f), new Vector2(5f, 1.2f));
            Texture2D lampOnShot = Shot(cam, null);
            float lampThrough; int ltB, ltW;
            BoxStats(lampOnShot, cam, 0f, 17.2f, 2.4f, 0.6f, 2, out lampThrough, out ltB, out ltW);
            Chk(lampThrough <= 0.45f,
                "lamp through the alpha-0.78 glass must be attenuated, got " + lampThrough.ToString("F3"));
            panelGlass.gameObject.SetActive(false);
            Texture2D lampDirectShot = Shot(cam, null);
            float lampDirect; int ldB, ldW;
            BoxStats(lampDirectShot, cam, 0f, 17.2f, 2.4f, 0.6f, 2, out lampDirect, out ldB, out ldW);
            Chk(lampDirect >= 0.75f,
                "lamp direct (glass hidden) must be bright, got " + lampDirect.ToString("F3"));
            panelGlass.gameObject.SetActive(true);
            ReleaseLamp(lamp);
            DestroyShot(lampOnShot);
            DestroyShot(lampDirectShot);

            // ---------- E. buttons + style gates on the real render ----------
            GameObject b1 = UiKit.BuildButton(panel.transform, "BtnCool",
                new Vector2(-4.2f, BtnY), BtnSize, UiKit.CoolRim);
            GameObject b2 = UiKit.BuildButton(panel.transform, "BtnGold",
                new Vector2(0f, BtnY), BtnSize, UiKit.WarmAccent);
            GameObject b3 = UiKit.BuildButton(panel.transform, "BtnGoldDim",
                new Vector2(4.2f, BtnY), BtnSize, new Color(0.80f, 0.62f, 0.22f));

            // E0 pure-2D law + layering
            Renderer[] rends = panel.GetComponentsInChildren<Renderer>(true);
            int srCount = 0;
            for (int i = 0; i < rends.Length; i++)
            {
                Chk(rends[i] is SpriteRenderer, "UI shell must be SpriteRenderer-only (2D law)");
                srCount++;
            }
            Chk(srCount == 3 + 5 * 3, "expected 18 sprites (panel 3 + 3 buttons x 5), got " + srCount);
            Chk(panel.GetComponentsInChildren<MeshFilter>(true).Length == 0
                && panel.GetComponentsInChildren<MeshRenderer>(true).Length == 0
                && panel.GetComponentsInChildren<Camera>(true).Length == 0
                && panel.GetComponentsInChildren<Light>(true).Length == 0
                && panel.GetComponentsInChildren<Canvas>(true).Length == 0,
                "no 3D/canvas components allowed in the UI shell (2D law)");
            int maxPanelOrder = 0, minBtnOrder = 999;
            foreach (SpriteRenderer sr in panel.GetComponentsInChildren<SpriteRenderer>(true))
            {
                // panel-layer children parent DIRECTLY on the root; button layers
                // sit one level deeper (same child names - parent decides the bucket)
                if (sr.transform.parent == panel.transform)
                {
                    if (sr.name == "Rim") maxPanelOrder = Math.Max(maxPanelOrder, sr.sortingOrder);
                }
                else if (sr.name == "Glow") minBtnOrder = Math.Min(minBtnOrder, sr.sortingOrder);
            }
            Chk(maxPanelOrder == UiKit.PanelRimOrder && minBtnOrder == UiKit.ButtonGlowOrder,
                "button layer must sit above the panel layer");
            SpriteRenderer bglass = b2.transform.Find("Glass").GetComponent<SpriteRenderer>();
            Bounds bb = bglass.bounds;
            Chk(Mathf.Abs(bb.size.x - BtnSize.x) < 0.03f && Mathf.Abs(bb.size.y - BtnSize.y) < 0.03f,
                "button glass world size must be " + BtnSize.x + "x" + BtnSize.y + ", got "
                + bb.size.x.ToString("F2") + "x" + bb.size.y.ToString("F2"));

            Texture2D onShot = Shot(cam, "m1-r22-uishell.png");

            // E2 cool rim ring: bright thin border around the panel vs baseline sky
            float onRingMean; int onRingBright, onRingWarm;
            RingStats(onShot, cam, PanelCenter, 6.9f, 1.4f, 7.5f, 2f, 2,
                out onRingMean, out onRingBright, out onRingWarm);
            Chk(onRingBright - baseRingBright >= 250,
                "panel rim must add bright ring pixels (on=" + onRingBright + " base=" + baseRingBright + ")");

            // E3 warm gold accent ring around the center button
            float btnRingMean; int btnRingBright, btnRingWarm;
            RingStats(onShot, cam, new Vector2(0f, BtnY), 1.55f, 0.45f, 1.95f, 0.85f, 2,
                out btnRingMean, out btnRingBright, out btnRingWarm);
            Chk(btnRingWarm >= 60,
                "gold accent rim must light warm pixels (warm px " + btnRingWarm + ")");

            // E4 streak asymmetry: button top half brighter than bottom half
            float topMean, botMean; int tB, tW, bB2, bW2;
            BoxStats(onShot, cam, 0f, BtnY + 0.24f, 1.45f, 0.21f, 2, out topMean, out tB, out tW);
            BoxStats(onShot, cam, 0f, BtnY - 0.24f, 1.45f, 0.21f, 2, out botMean, out bB2, out bW2);
            Chk(topMean - botMean >= 0.02f,
                "streak+shadow must make the button top brighter (top " + topMean.ToString("F3")
                + " vs bottom " + botMean.ToString("F3") + ")");

            // E5 glow toggle: halo band brightens only while the glow layers are on
            foreach (Transform child in panel.GetComponentsInChildren<Transform>(true))
                if (child.name == "Glow") child.gameObject.SetActive(false);
            Texture2D glowOffShot = Shot(cam, null);
            float haloOff, haloOn; int hOffB, hOffW, hOnB, hOnW;
            RingStats(glowOffShot, cam, PanelCenter, 7.05f, 1.5f, 7.45f, 1.95f, 2,
                out haloOff, out hOffB, out hOffW);
            RingStats(onShot, cam, PanelCenter, 7.05f, 1.5f, 7.45f, 1.95f, 2,
                out haloOn, out hOnB, out hOnW);
            Chk(haloOn - haloOff >= 0.02f,
                "glow layers must brighten the halo band (on " + haloOn.ToString("F3")
                + " vs off " + haloOff.ToString("F3") + ")");
            foreach (Transform child in panel.GetComponentsInChildren<Transform>(true))
                if (child.name == "Glow") child.gameObject.SetActive(true);
            DestroyShot(glowOffShot);

            // E6 off returns to baseline (runtime-only: nothing may survive)
            UiKit.Release(panel);
            Chk(GameObject.Find("UiPanel") == null && GameObject.Find("BtnGold") == null,
                "released widgets must leave no scene objects behind");
            Texture2D offShot = Shot(cam, null);
            float offStrip; int oB, oW;
            BoxStats(offShot, cam, PanelCenter.x, 17.75f, 6.6f, 0.75f, 2, out offStrip, out oB, out oW);
            Chk(Mathf.Abs(offStrip - baseStrip) <= 0.015f,
                "frame must return to baseline after Release (off " + offStrip.ToString("F3")
                + " vs base " + baseStrip.ToString("F3") + ")");
            DestroyShot(offShot);
            DestroyShot(baseShot);
            DestroyShot(onShot);

            // ---------- F. idempotent rebuild (r18 lost-line class guard) ----------
            GameObject panel2 = UiKit.BuildPanel(null, "UiPanel2", PanelCenter, PanelSize);
            Bounds gb2 = panel2.transform.Find("Glass").GetComponent<SpriteRenderer>().bounds;
            Chk(Mathf.Abs(gb2.size.x - PanelSize.x) < 0.05f && Mathf.Abs(gb2.size.y - PanelSize.y) < 0.05f,
                "rebuilt panel must land on identical bounds");
            UiKit.Release(panel2);
            Chk(GameObject.Find("UiPanel2") == null, "rebuilt panel must release clean");

            return "asserts=" + asserts
                + " glass(lamp_through=" + lampThrough.ToString("F3") + ",direct=" + lampDirect.ToString("F3") + ")"
                + " rim(bright=" + onRingBright + ",base=" + baseRingBright + ")"
                + " gold_warm=" + btnRingWarm
                + " streak(top=" + topMean.ToString("F3") + ",bot=" + botMean.ToString("F3") + ")"
                + " glow(d=" + (haloOn - haloOff).ToString("F3") + ")"
                + " off(d=" + Mathf.Abs(offStrip - baseStrip).ToString("F3") + ")"
                + " shots=3 reload_gate=N/A_runtime_only_persist_zero"
                + " scene_saved=False";
        }

        static void DestroyShot(Texture2D t) { UnityEngine.Object.DestroyImmediate(t); }

        // 1920x1080 render; ReadPixels row 0 = world bottom (r13 law)
        static Texture2D Shot(Camera cam, string name)
        {
            RenderTexture rt = new RenderTexture(1920, 1080, 24, RenderTextureFormat.ARGB32);
            cam.targetTexture = rt;
            cam.Render();
            RenderTexture.active = rt;
            Texture2D tex = new Texture2D(1920, 1080, TextureFormat.RGBA32, false);
            tex.ReadPixels(new Rect(0, 0, 1920, 1080), 0, 0);
            tex.Apply();
            cam.targetTexture = null;
            RenderTexture.active = null;
            rt.Release();
            UnityEngine.Object.DestroyImmediate(rt);
            if (name != null) File.WriteAllBytes(Path.Combine(RepoRoot, "docs", "design", name), tex.EncodeToPNG());
            return tex;
        }

        // axis-aligned world box mean + bright/warm counts.
        // bright: b>0.45 (rims); warm: b>0.35 && r-b>0.25 (gold accents)
        static void BoxStats(Texture2D tex, Camera cam, float cx, float cy, float hw, float hh,
            int stride, out float mean, out int brightPx, out int warmPx)
        {
            Vector3 cp = cam.transform.position;
            float halfH = cam.orthographicSize, halfW = halfH * (1920f / 1080f);
            int x0 = (int)(((cx - hw - cp.x) / (2f * halfW) + 0.5f) * 1920f);
            int x1 = (int)(((cx + hw - cp.x) / (2f * halfW) + 0.5f) * 1920f);
            int y0 = (int)(((cy - hh - cp.y) / (2f * halfH) + 0.5f) * 1080f);
            int y1 = (int)(((cy + hh - cp.y) / (2f * halfH) + 0.5f) * 1080f);
            double sum = 0; int n = 0; brightPx = 0; warmPx = 0;
            for (int y = y0; y < y1; y += stride)
                for (int x = x0; x < x1; x += stride)
                {
                    if (x < 0 || x >= 1920 || y < 0 || y >= 1080) continue;
                    Color c = tex.GetPixel(x, y);
                    float b = (c.r + c.g + c.b) / 3f, w = c.r - c.b;
                    sum += b; n++;
                    if (b > 0.45f) brightPx++;
                    if (b > 0.35f && w > 0.25f) warmPx++;
                }
            mean = n > 0 ? (float)(sum / n) : 0f;
        }

        // ring band = outer box minus inner box, centered on the widget center
        static void RingStats(Texture2D tex, Camera cam, Vector2 c,
            float inHw, float inHh, float outHw, float outHh, int stride,
            out float mean, out int brightPx, out int warmPx)
        {
            Vector3 cp = cam.transform.position;
            float halfH = cam.orthographicSize, halfW = halfH * (1920f / 1080f);
            int X0 = (int)(((c.x - outHw - cp.x) / (2f * halfW) + 0.5f) * 1920f);
            int X1 = (int)(((c.x + outHw - cp.x) / (2f * halfW) + 0.5f) * 1920f);
            int Y0 = (int)(((c.y - outHh - cp.y) / (2f * halfH) + 0.5f) * 1080f);
            int Y1 = (int)(((c.y + outHh - cp.y) / (2f * halfH) + 0.5f) * 1080f);
            double sum = 0; int n = 0; brightPx = 0; warmPx = 0;
            for (int y = Y0; y < Y1; y += stride)
                for (int x = X0; x < X1; x += stride)
                {
                    if (x < 0 || x >= 1920 || y < 0 || y >= 1080) continue;
                    float wx = cp.x - halfW + (x + 0.5f) / 1920f * 2f * halfW;
                    float wy = cp.y - halfH + (y + 0.5f) / 1080f * 2f * halfH;
                    if (Mathf.Abs(wx - c.x) < inHw && Mathf.Abs(wy - c.y) < inHh) continue;  // inner hole
                    Color col = tex.GetPixel(x, y);
                    float b = (col.r + col.g + col.b) / 3f, w = col.r - col.b;
                    sum += b; n++;
                    if (b > 0.45f) brightPx++;
                    if (b > 0.35f && w > 0.25f) warmPx++;
                }
            mean = n > 0 ? (float)(sum / n) : 0f;
        }

        // proof scaffolding: flat white lamp quad behind the panel glass
        static GameObject BuildLamp(Vector2 center, Vector2 size)
        {
            GameObject go = new GameObject("UiLamp");
            go.transform.position = new Vector3(center.x, center.y, UiKit.Depth);
            SpriteRenderer sr = go.AddComponent<SpriteRenderer>();
            const int S = 4;
            Texture2D tex = new Texture2D(S, S, TextureFormat.RGBA32, false);
            tex.filterMode = FilterMode.Point;
            for (int y = 0; y < S; y++)
                for (int x = 0; x < S; x++) tex.SetPixel(x, y, new Color(1f, 1f, 1f, 1f));
            tex.Apply();
            sr.sprite = Sprite.Create(tex, new Rect(0, 0, S, S), new Vector2(0.5f, 0.5f), 16f);
            sr.sortingOrder = 35;                       // below the panel layers (40+)
            sr.color = new Color(0.92f, 0.92f, 0.92f, 1f);
            Vector3 n = sr.sprite.bounds.size;
            sr.transform.localScale = new Vector3(size.x / n.x, size.y / n.y, 1f);
            return go;
        }

        static void ReleaseLamp(GameObject lamp)
        {
            if (lamp == null) return;
            SpriteRenderer sr = lamp.GetComponent<SpriteRenderer>();
            Texture2D tex = sr != null && sr.sprite != null ? sr.sprite.texture : null;
            UnityEngine.Object.DestroyImmediate(lamp);
            if (tex != null) UnityEngine.Object.DestroyImmediate(tex);
        }
    }
}
