// FluxVerse P-16 r15: batch proof harness for the interior window (sentinel pattern,
// r12/r13/r14 style) + idempotent scene wiring + cross-session reload gate. Proves,
// fail-loud:
//  1) PURE LOGIC on the headless core (recorder opener): registry hit-test (QUANT
//     block in / tower row out / GAME-MEDIA unregistered), bounds edges, URL
//     resolution at the SOURCE repo (file:/// + reference-not-copy law: url must
//     NOT point inside FluxVerse/City), missing-file silent degrade, cooldown
//     gating, non-hit click no-op, live-data dependency chain (dashboard_status.js
//     + panel sprites exist in the sibling repo).
//  2) ADAPTER INTEGRATION on the REAL machine layout: CityInterior.Core resolves
//     the group root 4 levels up from Assets and finds bigmoney.html there.
//  3) SCENE WIRING idempotent: CityInterior attached to CityCamera, scene saved
//     BEFORE any banner exists (r14 save-before-motion law), no InteriorBanner
//     GO ever saved (runtime-only law, r13).
//  4) REAL RENDERS from CityScene at L1 street level (Zone_QUANT focus): baseline
//     vs banner-on gates - dark glass darkens the banner band, the gold rim ring
//     around the glass produces bright+warm pixels, hide returns to baseline.
//     (r16: banner = procedural SpriteRenderer stack, NOT uGUI - a WorldSpace
//     canvas renders as ScreenSpaceOverlay in batch mode; TECH new-law r16.)
//  5) RELOAD GATE (logs/interior-reload.run): a SECOND editor session re-opens the
//     saved scene and asserts CityInterior RESOLVES (the r14 gate law: batch-green
//     is not save-green), camera stays L0 20, one cold render.
// The live panel itself is rendered headlessly by the PS runner (msedge --headless
// --screenshot of the file:/// URL -> docs/design/m1-r15-bigmoney-live.png).
// Sentinels: <repo>/logs/interior.run -> <repo>/logs/interior.done;
//            <repo>/logs/interior-reload.run -> <repo>/logs/interior-reload.done.
// Screenshots: docs/design/m1-r15-{l1-quant,interior-banner,reload}.png. No 3D.
using System;
using System.Collections.Generic;
using System.IO;
using UnityEngine;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine.SceneManagement;

namespace FluxVerse
{
    public static class InteriorProof
    {
        static string ProjectRoot { get { return Path.GetDirectoryName(Application.dataPath); } }
        static string RepoRoot { get { return Path.GetDirectoryName(ProjectRoot); } }
        static string GroupRoot { get { return Path.GetDirectoryName(Path.GetDirectoryName(RepoRoot)); } }
        static string SentinelPath { get { return Path.Combine(RepoRoot, "logs", "interior.run"); } }
        static string DonePath { get { return Path.Combine(RepoRoot, "logs", "interior.done"); } }
        static string ReloadSentinelPath { get { return Path.Combine(RepoRoot, "logs", "interior-reload.run"); } }
        static string ReloadDonePath { get { return Path.Combine(RepoRoot, "logs", "interior-reload.done"); } }
        static string ScenePath { get { return "Assets/Scenes/CityScene.unity"; } }
        static int asserts;

        [InitializeOnLoadMethod]
        static void Hook()
        {
            if (File.Exists(SentinelPath))
                EditorApplication.delayCall += Run;
            if (File.Exists(ReloadSentinelPath))
                EditorApplication.delayCall += ReloadGateRun;
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
                File.WriteAllText(DonePath, "FAIL " + e.GetType().Name + ": " + e.Message + " | " + e.StackTrace
                    + " ts=" + DateTime.UtcNow.ToString("o"));
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

        public static void ReloadGateRun()
        {
            if (!File.Exists(ReloadSentinelPath)) return;   // single-shot guard
            try
            {
                asserts = 0;
                string report = ReloadProve();
                File.WriteAllText(ReloadDonePath, "OK " + report + " ts=" + DateTime.UtcNow.ToString("o"));
            }
            catch (Exception e)
            {
                File.WriteAllText(ReloadDonePath, "FAIL " + e.GetType().Name + ": " + e.Message + " | "
                    + e.StackTrace + " ts=" + DateTime.UtcNow.ToString("o"));
            }
            finally
            {
                if (File.Exists(ReloadSentinelPath)) File.Delete(ReloadSentinelPath);
            }
        }

        // ---- second-session gate: saved scene must re-resolve CityInterior ----
        static string ReloadProve()
        {
            Scene scene = EditorSceneManager.OpenScene(ScenePath, OpenSceneMode.Single);
            GameObject camGo = GameObject.Find("CityCamera");
            Chk(camGo != null, "reload: CityCamera missing");
            CityInterior interior = camGo != null ? camGo.GetComponent<CityInterior>() : null;
            Chk(interior != null, "reload: CityInterior did not resolve (SEPARATE FILE LAW broken?)");
            Camera cam = camGo != null ? camGo.GetComponent<Camera>() : null;
            Chk(cam != null && Mathf.Abs(cam.orthographicSize - 20f) < 0.01f,
                "reload: camera must stay at L0 size 20");
            CityCameraRig rig = camGo != null ? camGo.GetComponent<CityCameraRig>() : null;
            Chk(rig != null, "reload: CityCameraRig did not resolve");
            CityAmbient amb = null;
            GameObject ambGo = GameObject.Find("CityAmbient");
            Chk(ambGo != null, "reload: CityAmbient GO missing");
            if (ambGo != null) amb = ambGo.GetComponent<CityAmbient>();
            Chk(amb != null, "reload: CityAmbient did not resolve");
            int bannerCount = 0;
            foreach (GameObject root in scene.GetRootGameObjects())
                if (root.name == "InteriorBanner") bannerCount++;
            Chk(bannerCount == 0, "reload: InteriorBanner must never be saved into the scene (runtime-only law)");
            // adapter really resolves the live panel on this machine
            string url = interior.Core.ResolveUrl(interior.Core.Hit(new Vector2(0f, -2f)));
            Chk(url != null && url.EndsWith("bigmoney.html", StringComparison.Ordinal),
                "reload: adapter core must resolve bigmoney.html from the real group layout");
            // cold-start visuals + one render as live evidence (gate is read-only)
            amb.EnsureVisuals();
            amb.ApplyAmbient(AmbientTier.Night);
            amb.ApplyWeather("clear", 0f, 0);
            amb.StepWeather(0.1f);
            rig.Advance(0f);
            Texture2D shot = Shot(cam, "m1-r15-reload.png");
            int skyTop = SkyRowsPx(shot, cam, 13f, true);
            Chk(skyTop >= 60 && skyTop <= 200, "reload: top sky strip out of range: " + skyTop);
            DestroyShot(shot);
            return "asserts=" + asserts + " sky=" + skyTop + " shots=1 url_resolved=True";
        }

        static string Prove()
        {
            // ---------- A. pure logic on a headless core with a recorder opener ----------
            List<string> opened = new List<string>();
            InteriorRouter r = new InteriorRouter(GroupRoot, delegate (string u) { opened.Add(u); }, 8f);
            r.AddDefaultRegistry();

            // A1 registry: v0 = exactly one target (P-16: connect bigmoney.html first)
            InteriorTarget qt = r.Hit(new Vector2(0f, -2f));
            Chk(qt != null && qt.zone == "QUANT" && qt.company == "BigMoney",
                "QUANT block center must hit the BigMoney target");
            Chk(qt.panelRelPath.EndsWith("bigmoney.html", StringComparison.Ordinal),
                "target panel must be bigmoney.html");

            // A2 bounds edges (mirror of builder block: cells x -2..2, y -9..8)
            Chk(r.Hit(new Vector2(-2.4f, -9.4f)) != null, "SW corner (inside margin) must hit");
            Chk(r.Hit(new Vector2(-2.7f, 0f)) == null, "west of the block must miss");
            Chk(r.Hit(new Vector2(0f, 8.9f)) != null, "top row of the block must hit");
            Chk(r.Hit(new Vector2(0f, 9.1f)) == null, "tower row above must miss (no bleed)");
            Chk(r.Hit(new Vector2(-21f, -5f)) == null, "GAME city must be unregistered in v0");
            Chk(r.Hit(new Vector2(21f, -5f)) == null, "MEDIA city must be unregistered in v0");
            Chk(r.Hit(new Vector2(0f, 11f)) == null, "brain tower click must miss");
            Chk(r.Hit(new Vector2(30f, -15f)) == null, "river click must miss");

            // A3 URL resolution at the SOURCE repo (reference-not-copy law)
            string url = r.ResolveUrl(qt);
            Chk(url != null && url.StartsWith("file:///", StringComparison.Ordinal),
                "panel URL must be a file:/// URL");
            Chk(url != null && url.Contains("quant/bigmoney/bigmoney.html"),
                "URL must point into the BigMoney source repo");
            Chk(url == null || url.IndexOf("FluxVerse/City", StringComparison.Ordinal) < 0,
                "URL must NOT point inside the City project (copy-forbidden law)");

            // A4 live-data chain: the panel's own dependencies exist in the sibling repo
            string bm = Path.Combine(GroupRoot, "quant", "bigmoney");
            Chk(File.Exists(Path.Combine(bm, "results", "dashboard_status.js")),
                "panel data file results/dashboard_status.js must exist (live data)");
            Chk(File.Exists(Path.Combine(bm, "monitor", "assets", "slime.png")),
                "panel sprite monitor/assets/slime.png must exist");

            // A5 missing-file silent degrade (probe contract: degrade, never throw)
            InteriorRouter broken = new InteriorRouter(GroupRoot, delegate (string u) { opened.Add(u); }, 8f);
            broken.AddTarget(new InteriorTarget
            {
                zone = "GHOST", company = "X", panelRelPath = "quant/bigmoney/does_not_exist.html",
                bounds = new Rect(-1f, -1f, 2f, 2f)
            });
            Chk(broken.ResolveUrl(broken.Hit(Vector2.zero)) == null, "missing panel must resolve null");
            int beforeCalls = opened.Count;
            Chk(!broken.Open(Vector2.zero, 1f), "open of a missing panel must return false");
            Chk(opened.Count == beforeCalls, "missing panel must NOT fire the opener");

            // A6 open dispatch + per-zone cooldown
            Chk(r.Open(new Vector2(0f, -2f), 10f), "open on a hit with live file must succeed");
            Chk(opened.Count == 1 && opened[0] == url, "opener must receive exactly the resolved URL");
            Chk(!r.Open(new Vector2(0f, -2f), 13f), "second open inside the cooldown window must be gated");
            Chk(opened.Count == 1, "cooldown-gated open must not fire");
            Chk(r.Open(new Vector2(0f, -2f), 18.05f), "open after the cooldown window must succeed");
            Chk(opened.Count == 2, "post-cooldown open must fire once more");
            Chk(r.LastUrl.EndsWith("bigmoney.html", StringComparison.Ordinal), "LastUrl must track the panel");

            // A7 non-hit click no-op
            Chk(!r.Open(new Vector2(30f, -15f), 100f), "river click must not open anything");
            Chk(opened.Count == 2, "non-hit click must not fire the opener");

            // ---------- B. scene wiring: idempotent, saved BEFORE any banner exists ----------
            Scene scene = EditorSceneManager.OpenScene(ScenePath, OpenSceneMode.Single);
            GameObject camGo = GameObject.Find("CityCamera");
            Chk(camGo != null, "CityCamera missing in CityScene");
            CityInterior interior = camGo != null ? camGo.GetComponent<CityInterior>() : null;
            int attached = 0;
            if (interior == null) { interior = camGo.AddComponent<CityInterior>(); attached = 1; }
            Chk(interior != null, "CityInterior failed to attach");
            int interiorCount = camGo.GetComponents<CityInterior>().Length;
            Chk(interiorCount == 1, "exactly one CityInterior expected, got " + interiorCount);
            int bannerSaved = 0;
            foreach (GameObject root in scene.GetRootGameObjects())
                if (root.name == "InteriorBanner") bannerSaved++;
            Chk(bannerSaved == 0, "no InteriorBanner may exist at save time (runtime-only law)");
            bool saved = EditorSceneManager.SaveScene(scene);
            Chk(saved, "scene save failed");

            // ---------- C. real renders at L1 street level (Zone_QUANT focus) ----------
            Camera cam = camGo.GetComponent<Camera>();
            CityCameraRig rig = camGo.GetComponent<CityCameraRig>();
            Chk(rig != null, "CityCameraRig missing on CityCamera");
            GameObject ambGo = GameObject.Find("CityAmbient");
            CityAmbient amb = ambGo != null ? ambGo.GetComponent<CityAmbient>() : null;
            Chk(amb != null, "CityAmbient missing");
            amb.EnsureVisuals();
            amb.ApplyAmbient(AmbientTier.Night);                 // live tier at 21:xx Beijing
            amb.ApplyWeather("clear", 0f, 0);
            amb.StepWeather(0.1f);
            rig.Advance(0f);                                     // adopt persisted profile
            rig.FocusOn(new Vector2(0f, -12f));                  // drill down to QUANT street
            for (int i = 0; i < 27; i++) rig.Advance(0.05f);      // 1.35s > 1.2s switch
            Chk(Mathf.Abs(rig.SizeNow - 9f) < 0.01f, "must land at L1 size 9");
            float baseBri, baseWarm;
            Texture2D l1Shot = Shot(cam, "m1-r15-l1-quant.png");  // street view, no banner
            BannerMetrics(l1Shot, cam, out baseBri, out baseWarm);
            Chk(baseBri > 0.08f, "baseline banner band must show city (bri " + baseBri.ToString("F3") + ")");

            // C2 banner on (r16 sprite stack): dark glass darkens the band; the gold
            // rim ring (halo/rim strips OUTSIDE the glass) makes bright+warm pixels.
            interior.ShowBanner("QUANT", "BigMoney");
            Chk(interior.BannerVisible, "banner must be visible after ShowBanner");
            interior.StepBanner(0.05f);                           // position it at the view bottom
            Texture2D bannerShot = Shot(cam, "m1-r15-interior-banner.png");
            float bri, warm; int brightPx, warmPx;
            BannerMetrics(bannerShot, cam, out bri, out warm);
            Chk(baseBri - bri >= 0.04f,
                "dark glass must darken the banner band (base " + baseBri.ToString("F3")
                + " -> " + bri.ToString("F3") + ")");
            RingMetrics(bannerShot, cam, out brightPx, out warmPx);
            Chk(brightPx >= 120, "gold rim must light the banner frame (bright px " + brightPx + ")");
            Chk(warmPx >= 60, "warm gold rim pixels missing (warm px " + warmPx + ")");

            // C3 banner off: band returns to baseline
            interior.HideBanner();
            Chk(!interior.BannerVisible, "banner must hide");
            Texture2D offShot = Shot(cam, null);
            float offBri, offWarm;
            BannerMetrics(offShot, cam, out offBri, out offWarm);
            Chk(Mathf.Abs(offBri - baseBri) <= 0.02f,
                "band must return to baseline after hide (off " + offBri.ToString("F3")
                + " vs base " + baseBri.ToString("F3") + ")");
            DestroyShot(offShot);
            DestroyShot(l1Shot);
            DestroyShot(bannerShot);

            return "asserts=" + asserts + " attached=" + attached + " scene_saved=" + saved
                + " band(base=" + baseBri.ToString("F3") + ",on=" + bri.ToString("F3")
                + ",off=" + offBri.ToString("F3") + ")"
                + " px(bright=" + brightPx + ",warm=" + warmPx + ")"
                + " opens=" + opened.Count + " url=" + (url == null ? "null" : "ok")
                + " shots=3 reload_gate=pass2";
        }

        static void DestroyShot(Texture2D t) { UnityEngine.Object.DestroyImmediate(t); }

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

        // banner band = the strip the banner occupies: world center (camX, camY-9+1.65)
        // half extents 9.5u x 1.1u (banner 20x2.6). Bright px = brightness>0.55 (gold
        // title glyphs + rim); warm px = r-b>0.25 AND bright (GUIAgent gold accents).
        static void BannerMetrics(Texture2D tex, Camera cam,
            out float brightness, out float warmth, out int brightPx, out int warmPx)
        {
            Vector3 cp = cam.transform.position;
            float wy = cp.y - cam.orthographicSize + CityInterior.BannerHeight * 0.5f + 0.35f;
            float halfWu = 9.5f, halfHu = 1.1f;
            float halfH = cam.orthographicSize, halfW = halfH * (1920f / 1080f);
            int x0 = (int)(((cp.x - halfWu - cp.x) / (2f * halfW) + 0.5f) * 1920f);
            int x1 = (int)(((cp.x + halfWu - cp.x) / (2f * halfW) + 0.5f) * 1920f);
            int y0 = (int)(((wy - halfHu - cp.y) / (2f * halfH) + 0.5f) * 1080f);
            int y1 = (int)(((wy + halfHu - cp.y) / (2f * halfH) + 0.5f) * 1080f);
            double sumBri = 0, sumWarm = 0; int n = 0; brightPx = 0; warmPx = 0;
            for (int y = y0; y < y1; y += 2)
                for (int x = x0; x < x1; x += 2)
                {
                    if (x < 0 || x >= 1920 || y < 0 || y >= 1080) continue;
                    Color c = tex.GetPixel(x, y);
                    float b = (c.r + c.g + c.b) / 3f, w = c.r - c.b;
                    sumBri += b; sumWarm += w; n++;
                    if (b > 0.55f) brightPx++;
                    if (b > 0.40f && w > 0.25f) warmPx++;
                }
            int nn = System.Math.Max(1, n);
            brightness = (float)(sumBri / nn);
            warmth = (float)(sumWarm / nn);
        }

        static void BannerMetrics(Texture2D tex, Camera cam, out float brightness, out float warmth)
        {
            int bp, wp;
            BannerMetrics(tex, cam, out brightness, out warmth, out bp, out wp);
        }

        // r16: the gold treatment lives OUTSIDE the glass - the rim strip at half
        // extents (10.0..10.08, 1.3..1.38) plus the halo wash beyond. Sample the
        // ring annulus (outer 10.25 x 1.55 minus inner 9.95 x 1.25 around the
        // banner center) and count bright/warm gold pixels there.
        static void RingMetrics(Texture2D tex, Camera cam, out int brightPx, out int warmPx)
        {
            Vector3 cp = cam.transform.position;
            float wy = cp.y - cam.orthographicSize + CityInterior.BannerHeight * 0.5f + 0.35f;
            float halfH = cam.orthographicSize, halfW = halfH * (1920f / 1080f);
            brightPx = 0; warmPx = 0;
            for (int y = 0; y < 1080; y += 2)
            {
                // ReadPixels row y = world bottom-up (r13 law)
                float wpy = cp.y - halfH + (y + 0.5f) / 1080f * 2f * halfH;
                float dy = Mathf.Abs(wpy - wy);
                if (dy >= 1.55f) continue;                        // outside the halo vertically
                for (int x = 0; x < 1920; x += 2)
                {
                    float wpx = cp.x - halfW + (x + 0.5f) / 1920f * 2f * halfW;
                    float dx = Mathf.Abs(wpx - cp.x);
                    if (dx >= 10.25f) continue;                  // outside the halo horizontally
                    if (dx < 9.95f && dy < 1.25f) continue;      // inside the glass fill
                    Color c = tex.GetPixel(x, y);
                    float b = (c.r + c.g + c.b) / 3f, w = c.r - c.b;
                    if (b > 0.55f) brightPx++;
                    if (b > 0.40f && w > 0.25f) warmPx++;
                }
            }
        }

        // night sky metric (r14 law: dark + not blue-dominant rows, worldX=13 free column)
        static int SkyRowsPx(Texture2D tex, Camera cam, float worldX, bool topHalf)
        {
            float halfH = cam.orthographicSize;
            float halfW = halfH * (1920f / 1080f);
            int cx = (int)(((worldX - cam.transform.position.x) / (2f * halfW) + 0.5f) * 1920f);
            if (cx < 1 || cx >= 1919) return 0;
            int y0 = topHalf ? 540 : 0, y1 = topHalf ? 1080 : 540;
            int n = 0;
            for (int y = y0; y < y1; y++)
            {
                Color c = tex.GetPixel(cx, y);
                if ((c.r + c.g + c.b) / 3f < 0.13f && c.b - c.r < 0.18f) n++;
            }
            return n;
        }
    }
}
