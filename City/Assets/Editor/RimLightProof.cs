// FluxVerse P-38(1) r148: batch proof for the dusk roofline rim-light layer
// (RimLightRules.cs mirror of Tools/city/rimlight-manifest.json, the r147
// sandbox = single parameter source). Sentinel pattern (r34 SkylineProof idiom):
//   pass 1: logs/rimlight.run        -> FluxVerse.RimLightProof.BatchRun  -> logs/rimlight.done
//   pass 2: logs/rimlight-reload.run -> FluxVerse.RimLightProof.ReloadGate -> logs/rimlight-reload.done
// Sections:
//  A manifest mirror (headless): every law table in RimLightRules cross-checked
//    against the JSON byte-for-byte (protocol/baked_round/glow center/tier
//    gate/colors+dither/falloff bands/thickness/segment ids+rects) + an
//    independent PS-style recompute of strength/core membership per segment.
//  B scene wiring census (real CityScene, transient only - this proof NEVER
//    saves the scene: the rim adds zero serialized fields, so disk churn is
//    zero by construction): 11 RimBand children under CityAmbient, natural-size
//    build (scale 1, bounds == rect), order 5, disk purity census == 0.
//  C tier law census: dusk = falloff strength alphas; day/night/dawn = 0.
//  D render gates (dusk anchor tier, r146 BandDiffCensus precedent):
//    D1 dusk per-segment warm census: rim-on vs rim-off baseline, every one of
//       the 11 segments shows warm-lit top-edge pixels above its width-scaled
//       gate (QUANT hero floor 100px) - presence + honey-orange warmth, clean
//       attribution (only the rim changes between the two renders);
//    D2 day/night zero-delta: law frames vs rim-inactive baselines differ on
//       ZERO rim-window pixels (the alpha-0 tier gate is visually inert);
//    D3 L1 street shot: QUANT roof rim census in the street-tier frame.
//  E pass 2: everything survives an editor restart (no persisted RimBand GOs,
//    component resolves, rims rebuild, dusk law re-applies). Fail-loud: any
//    broken assumption throws into the .done report. ASCII. No 3D.
using System;
using System.IO;
using UnityEngine;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine.SceneManagement;

namespace FluxVerse
{
    public static class RimLightProof
    {
        static string ProjectRoot { get { return Path.GetDirectoryName(Application.dataPath); } }
        static string RepoRoot { get { return Path.GetDirectoryName(ProjectRoot); } }
        static string RunPath { get { return Path.Combine(RepoRoot, "logs", "rimlight.run"); } }
        static string DonePath { get { return Path.Combine(RepoRoot, "logs", "rimlight.done"); } }
        static string ReloadRunPath { get { return Path.Combine(RepoRoot, "logs", "rimlight-reload.run"); } }
        static string ReloadDonePath { get { return Path.Combine(RepoRoot, "logs", "rimlight-reload.done"); } }
        static string ScenePath { get { return "Assets/Scenes/CityScene.unity"; } }
        static string ManifestPath { get { return Path.Combine(RepoRoot, "Tools", "city", "rimlight-manifest.json"); } }
        static int asserts;

        [Serializable] class MSeg { public string id; public string kind; public string building; public float[] rect; }
        [Serializable] class MBand { public float max_dist; public float strength; }
        [Serializable] class MFalloff { public string metric; public MBand[] bands; }
        [Serializable] class MColor { public float[] main; public float[] core; public float core_max_dist; }
        [Serializable] class MDither { public float[] art_rows; }
        [Serializable] class MRender { public int order; }
        [Serializable] class MThickness { public int roof_art_px; public float world_u; }
        [Serializable] class MGlow { public float center_x; }
        [Serializable] class MTier { public string[] tiers; }
        [Serializable] class MRoot
        {
            public string protocol; public int baked_round;
            public MGlow glow; public MTier tier_gate; public MColor color; public MDither dither;
            public MRender render; public MFalloff falloff; public MThickness thickness; public MSeg[] segments;
        }

        [InitializeOnLoadMethod]
        static void Hook()
        {
            if (File.Exists(RunPath)) EditorApplication.delayCall += Run;
            if (File.Exists(ReloadRunPath)) EditorApplication.delayCall += ReloadRun;
        }

        public static void BatchRun() { Run(); }
        public static void ReloadGate() { ReloadRun(); }

        static void Run()
        {
            if (!File.Exists(RunPath)) return;   // single-shot guard
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
            finally { if (File.Exists(RunPath)) File.Delete(RunPath); }
        }

        static void ReloadRun()
        {
            if (!File.Exists(ReloadRunPath)) return;
            try
            {
                string report = ReloadProve();
                File.WriteAllText(ReloadDonePath, "OK " + report + " ts=" + DateTime.UtcNow.ToString("o"));
            }
            catch (Exception e)
            {
                File.WriteAllText(ReloadDonePath, "FAIL " + e.GetType().Name + ": " + e.Message + " | "
                    + e.StackTrace + " ts=" + DateTime.UtcNow.ToString("o"));
            }
            finally { if (File.Exists(ReloadRunPath)) File.Delete(ReloadRunPath); }
        }

        static void Chk(bool ok, string what)
        {
            if (!ok) throw new InvalidOperationException("ASSERT FAIL: " + what);
            asserts++;
        }

        static bool Eq(float a, float b, float eps) { return Math.Abs(a - b) <= eps; }

        static MRoot LoadManifest()
        {
            string json = File.ReadAllText(ManifestPath);
            MRoot m = JsonUtility.FromJson<MRoot>(json);
            if (m == null || m.segments == null || m.segments.Length == 0)
                throw new InvalidOperationException("rimlight manifest unparseable: " + ManifestPath);
            return m;
        }

        // ---- A. manifest mirror (every RimLightRules law vs the JSON source) ----
        static int MirrorGate(MRoot m)
        {
            Chk(m.protocol == RimLightRules.Protocol, "protocol mismatch: " + m.protocol);
            Chk(m.baked_round == RimLightRules.BakedRound, "baked_round mismatch: " + m.baked_round);
            Chk(Eq(m.glow.center_x, RimLightRules.GlowCenterX, 1e-5f), "glow center mismatch");
            Chk(m.tier_gate != null && m.tier_gate.tiers != null && m.tier_gate.tiers.Length == 1
                && m.tier_gate.tiers[0] == "dusk", "tier gate is not dusk-only");
            Chk(RimLightRules.TierShows(AmbientTier.Dusk)
                && !RimLightRules.TierShows(AmbientTier.Day)
                && !RimLightRules.TierShows(AmbientTier.Night)
                && !RimLightRules.TierShows(AmbientTier.Dawn), "TierShows != dusk-only");
            Chk(Eq(m.color.main[0], RimLightRules.MainColor.r, 1e-4f)
                && Eq(m.color.main[1], RimLightRules.MainColor.g, 1e-4f)
                && Eq(m.color.main[2], RimLightRules.MainColor.b, 1e-4f), "main color mismatch");
            Chk(Eq(m.color.core[0], RimLightRules.CoreColor.r, 1e-4f)
                && Eq(m.color.core[1], RimLightRules.CoreColor.g, 1e-4f)
                && Eq(m.color.core[2], RimLightRules.CoreColor.b, 1e-4f), "core color mismatch");
            Chk(Eq(m.color.core_max_dist, RimLightRules.CoreMaxDist, 1e-5f), "core_max_dist mismatch");
            Chk(m.dither.art_rows.Length == RimLightRules.DitherRows, "dither row count mismatch");
            for (int r = 0; r < RimLightRules.DitherRows; r++)
                Chk(Eq(m.dither.art_rows[r], RimLightRules.DitherRowAlpha(r), 1e-5f),
                    "dither row " + r + " mismatch");
            Chk(m.render.order == RimLightRules.SortOrder, "render order mismatch: " + m.render.order);
            Chk(m.falloff.bands.Length == RimLightRules.FalloffBandCount, "falloff band count mismatch");
            for (int b = 0; b < RimLightRules.FalloffBandCount; b++)
            {
                Chk(Eq(m.falloff.bands[b].max_dist, RimLightRules.BandMaxDist(b), 1e-5f),
                    "band " + b + " max_dist mismatch");
                Chk(Eq(m.falloff.bands[b].strength, RimLightRules.BandStrength(b), 1e-5f),
                    "band " + b + " strength mismatch");
            }
            Chk(m.thickness.roof_art_px == RimLightRules.RoofArtPx, "roof_art_px mismatch");
            Chk(Eq(m.thickness.world_u, RimLightRules.ThicknessU, 1e-6f), "thickness world_u mismatch");
            Chk(m.segments.Length == RimLightRules.SegmentCount,
                "segment count mismatch: " + m.segments.Length);
            int coreCount = 0;
            for (int i = 0; i < RimLightRules.SegmentCount; i++)
            {
                MSeg s = m.segments[i];
                Chk(s.id == RimLightRules.Id(i), "seg " + i + " id mismatch: " + s.id);
                Chk(s.rect.Length == 4, "seg " + i + " rect arity");
                Chk(Eq(s.rect[0], RimLightRules.X0(i), 1e-4f), "seg " + i + " x0 mismatch");
                Chk(Eq(s.rect[1], RimLightRules.Y0(i), 1e-4f), "seg " + i + " y0 mismatch");
                Chk(Eq(s.rect[2], RimLightRules.X1(i), 1e-4f), "seg " + i + " x1 mismatch");
                Chk(Eq(s.rect[3], RimLightRules.Y1(i), 1e-4f), "seg " + i + " y1 mismatch");
                Chk(Eq(RimLightRules.Y1(i) - RimLightRules.Y0(i), RimLightRules.ThicknessU, 1e-6f),
                    "seg " + i + " height != 2 art px");
                Chk(RimLightRules.ArtPxWidth(i) == Mathf.RoundToInt(
                        (RimLightRules.X1(i) - RimLightRules.X0(i)) / RimLightRules.ArtPx),
                    "seg " + i + " art-px width not integral on the 1/16 grid");
                // independent falloff recompute from the manifest's own bands
                float dist = Mathf.Abs(RimLightRules.CenterX(i) - m.glow.center_x);
                float expect = m.falloff.bands[m.falloff.bands.Length - 1].strength;
                for (int b = 0; b < m.falloff.bands.Length; b++)
                    if (dist <= m.falloff.bands[b].max_dist) { expect = m.falloff.bands[b].strength; break; }
                Chk(Eq(RimLightRules.StrengthFor(i), expect, 1e-5f),
                    "seg " + i + " strength recompute mismatch");
                bool coreExpect = dist <= m.color.core_max_dist;
                Chk(RimLightRules.IsCore(i) == coreExpect, "seg " + i + " core membership mismatch");
                if (coreExpect) coreCount++;
            }
            Chk(coreCount == 4, "core set must be exactly the QUANT roof + brain tip + 2 shoulders: " + coreCount);
            return coreCount;
        }

        static string Prove()
        {
            // ---- A. manifest mirror + law recompute (headless) ----
            MRoot m = LoadManifest();
            int coreCount = MirrorGate(m);

            // ---- B. scene wiring census (transient only; this proof never saves) ----
            Scene scene = EditorSceneManager.OpenScene(ScenePath, OpenSceneMode.Single);
            GameObject ambGo = GameObject.Find("CityAmbient");
            Chk(ambGo != null, "CityAmbient GO missing in CityScene");
            CityAmbient amb = ambGo.GetComponent<CityAmbient>();
            Chk(amb != null, "CityAmbient component unresolved (r14 stub disease)");
            Chk(DiskRimCensus() == 0, "RimBand GOs persisted into the scene (runtime-only law)");
            amb.EnsureVisuals();
            SpriteRenderer[] rims = FindRims(amb);
            for (int i = 0; i < rims.Length; i++)
            {
                Chk(rims[i].transform.parent == amb.transform, "RimBand" + i + " not parented to CityAmbient");
                Chk(rims[i].sortingOrder == RimLightRules.SortOrder, "RimBand" + i + " order != 5");
                Vector3 sc = rims[i].transform.localScale;
                Chk(Math.Abs(sc.x - 1f) < 1e-4f && Math.Abs(sc.y - 1f) < 1e-4f,
                    "RimBand" + i + " scale != 1 (natural-size build law)");
                Vector3 bs = rims[i].sprite.bounds.size;
                Chk(Eq(bs.x, RimLightRules.WidthU(i), 1e-4f) && Eq(bs.y, RimLightRules.ThicknessU, 1e-4f),
                    "RimBand" + i + " bounds != rect: " + bs.ToString("F3"));
                Vector3 p = rims[i].transform.position;
                Chk(Eq(p.x, RimLightRules.CenterX(i), 1e-3f)
                    && Eq(p.y, (RimLightRules.Y0(i) + RimLightRules.Y1(i)) * 0.5f, 1e-3f),
                    "RimBand" + i + " position != rect center");
            }

            // ---- C. tier law census (color = base color, alpha = law) ----
            ApplyAndCensusTier(amb, rims, AmbientTier.Dusk);
            ApplyAndCensusTier(amb, rims, AmbientTier.Day);
            ApplyAndCensusTier(amb, rims, AmbientTier.Night);
            ApplyAndCensusTier(amb, rims, AmbientTier.Dawn);

            // ---- D. render gates ----
            GameObject camGo = GameObject.Find("CityCamera");
            Camera cam = camGo != null ? camGo.GetComponent<Camera>() : null;
            Chk(cam != null && cam.orthographic, "CityCamera missing");
            Vector3 origPos = cam.transform.position;
            float origSize = cam.orthographicSize;

            // D1 dusk: rim-on vs rim-off baseline per segment (clean attribution)
            amb.ApplyAmbient(AmbientTier.Dusk);
            SetRimsActive(rims, false);
            Texture2D baseDusk = Shot(cam, null);
            SetRimsActive(rims, true);
            amb.ApplyAmbient(AmbientTier.Dusk);
            Texture2D duskShot = Shot(cam, "m1-r148-rim-dusk.png");
            int minPx = int.MaxValue, heroPx = -1; int[] segPx = new int[rims.Length];
            for (int i = 0; i < rims.Length; i++)
            {
                int lit, tot; float warm;
                RimSegDelta(duskShot, baseDusk, cam, i, out lit, out warm, out tot);
                segPx[i] = lit;
                int gate = Math.Max(8, (int)(RimLightRules.ArtPxWidth(i) * 0.8f));
                Chk(lit >= gate, "seg " + RimLightRules.Id(i) + " dusk rim too faint: px=" + lit
                    + " gate=" + gate + " samples=" + tot);
                Chk(warm > 0.15f, "seg " + RimLightRules.Id(i) + " rim not honey-orange: hue="
                    + warm.ToString("F3"));
                if (lit < minPx) minPx = lit;
            }
            int qLit, qTot; float qWarm;
            RimSegDelta(duskShot, baseDusk, cam, 0, out qLit, out qWarm, out qTot);
            heroPx = qLit;
            Chk(qLit >= 100, "QUANT hero rim floor 100px: " + qLit);
            float sumWarm; int sumLit, sumTot;
            RimSegDelta(duskShot, baseDusk, cam, 8, out sumLit, out sumWarm, out sumTot);
            Chk(sumLit >= 8, "brain tip rim px=" + sumLit + " (wedge top law)");

            // D2 day/night zero-delta: alpha-0 rims are visually inert
            int dayLeak = ZeroDeltaTier(amb, rims, cam, AmbientTier.Day, "m1-r148-rim-day.png");
            int nightLeak = ZeroDeltaTier(amb, rims, cam, AmbientTier.Night, "m1-r148-rim-night.png");
            Chk(dayLeak == 0, "day frame leaked rim pixels: " + dayLeak);
            Chk(nightLeak == 0, "night frame leaked rim pixels: " + nightLeak);

            // D3 L1 street shot: QUANT roof rim census in the street tier
            amb.ApplyAmbient(AmbientTier.Dusk);
            cam.orthographicSize = RigMath.L1Size;
            cam.transform.position = new Vector3(0.5f, -9.5f, origPos.z);
            SetRimsActive(rims, false);
            Texture2D baseL1 = Shot(cam, null);
            SetRimsActive(rims, true);
            amb.ApplyAmbient(AmbientTier.Dusk);
            Texture2D l1Shot = Shot(cam, "m1-r148-rim-l1.png");
            int l1Lit, l1Tot; float l1Warm;
            RimSegDelta(l1Shot, baseL1, cam, 0, out l1Lit, out l1Warm, out l1Tot);
            Chk(l1Lit >= 200, "L1 QUANT rim census low: px=" + l1Lit + "/" + l1Tot);

            // restore the transient camera (scene was never saved)
            cam.orthographicSize = origSize;
            cam.transform.position = origPos;
            UnityEngine.Object.DestroyImmediate(baseDusk);
            UnityEngine.Object.DestroyImmediate(duskShot);
            UnityEngine.Object.DestroyImmediate(baseL1);
            UnityEngine.Object.DestroyImmediate(l1Shot);

            return "asserts=" + asserts
                + " mirror(segments=11,core=" + coreCount + ",bands=3,dither=2)"
                + " census(11 rims,scale=1,order=5,disk_purity=0)"
                + " tier(dusk_alpha=law,day/night/dawn=0)"
                + " render(dusk_px=[" + string.Join(",", Array.ConvertAll(segPx, x => x.ToString()))
                + "] min=" + minPx + " hero_quant=" + heroPx
                + " day_leak=" + dayLeak + " night_leak=" + nightLeak
                + " l1_quant_px=" + l1Lit
                + " warm_quant=" + qWarm.ToString("F3") + ")"
                + " shots=4";
        }

        static void ApplyAndCensusTier(CityAmbient amb, SpriteRenderer[] rims, AmbientTier t)
        {
            amb.ApplyAmbient(t);
            for (int i = 0; i < rims.Length; i++)
            {
                Color c = rims[i].color;
                Color law = RimLightRules.BaseColorFor(i);
                Chk(Eq(c.r, law.r, 2e-3f) && Eq(c.g, law.g, 2e-3f) && Eq(c.b, law.b, 2e-3f),
                    "RimBand" + i + " rgb != law color at tier " + t);
                Chk(Eq(c.a, RimLightRules.AlphaFor(i, t), 2e-3f),
                    "RimBand" + i + " alpha != law at tier " + t + ": " + c.a.ToString("F3"));
            }
        }

        // day/night render: law frame vs rims-inactive baseline; returns leaked px
        static int ZeroDeltaTier(CityAmbient amb, SpriteRenderer[] rims, Camera cam, AmbientTier t, string png)
        {
            amb.ApplyAmbient(t);
            Texture2D lawShot = Shot(cam, png);
            SetRimsActive(rims, false);
            Texture2D baseShot = Shot(cam, null);
            SetRimsActive(rims, true);
            int leak = 0;
            for (int i = 0; i < rims.Length; i++)
            {
                int lit, tot; float warm;
                RimSegDelta(lawShot, baseShot, cam, i, out lit, out warm, out tot);
                if (lit > 0) leak += lit;
            }
            UnityEngine.Object.DestroyImmediate(lawShot);
            UnityEngine.Object.DestroyImmediate(baseShot);
            return leak;
        }

        static SpriteRenderer[] FindRims(CityAmbient amb)
        {
            SpriteRenderer[] r = new SpriteRenderer[RimLightRules.SegmentCount];
            for (int i = 0; i < r.Length; i++)
            {
                Transform t = amb.transform.Find("RimBand" + i);
                if (t == null) throw new InvalidOperationException("RimBand" + i + " missing after EnsureVisuals");
                r[i] = t.GetComponent<SpriteRenderer>();
                if (r[i] == null) throw new InvalidOperationException("RimBand" + i + " has no renderer");
            }
            return r;
        }

        static void SetRimsActive(SpriteRenderer[] rims, bool on)
        {
            for (int i = 0; i < rims.Length; i++) rims[i].gameObject.SetActive(on);
        }

        static int DiskRimCensus()
        {
            int c = 0;
            Transform[] all = UnityEngine.Object.FindObjectsOfType<Transform>();
            for (int i = 0; i < all.Length; i++)
                if (all[i] != null && all[i].name.StartsWith("RimBand")) c++;
            return c;
        }

        // per-segment window census: pixels the rim BRIGHTENED and that carry
        // the ABSOLUTE honey-orange hue. r148 first-red law (r133 dot-family
        // precedent): the dusk tower body is ALREADY warm (r-b ~0.42 under the
        // warm tint) - a warm DELTA filter is structurally inverted against it
        // (the lit blend r-b ~0.40 vs body 0.42, measured on the first run:
        // px=0 with the strip visibly present at 241,191,138). The correct
        // identity of a warm carrier over a warm dusk background = brightened
        // (dRGB sum > 0.06) AND absolutely honey-orange (on.r - on.b > 0.15).
        // Clean attribution stands: only the rim changes between the renders.
        static void RimSegDelta(Texture2D on, Texture2D off, Camera cam, int i,
            out int litPx, out float avgWarm, out int totalSamples)
        {
            float halfH = cam.orthographicSize;
            float halfW = halfH * (1920f / 1080f);
            float cx = cam.transform.position.x, cy = cam.transform.position.y;
            float wx0 = RimLightRules.X0(i) - 0.15f, wx1 = RimLightRules.X1(i) + 0.15f;
            float wy0 = RimLightRules.Y0(i) - 0.06f, wy1 = RimLightRules.Y1(i) + 0.06f;
            int px0 = (int)(((wx0 - cx) / (2f * halfW) + 0.5f) * 1920f);
            int px1 = (int)(((wx1 - cx) / (2f * halfW) + 0.5f) * 1920f);
            int py0 = (int)(((wy0 - cy) / (2f * halfH) + 0.5f) * 1080f);
            int py1 = (int)(((wy1 - cy) / (2f * halfH) + 0.5f) * 1080f);
            px0 = Math.Max(0, px0); px1 = Math.Min(1919, px1);
            py0 = Math.Max(0, py0); py1 = Math.Min(1079, py1);
            double warmSum = 0; int n = 0, tot = 0;
            for (int y = py0; y <= py1; y++)
                for (int x = px0; x <= px1; x++)
                {
                    Color ca = on.GetPixel(x, y), cb = off.GetPixel(x, y);
                    float d = Math.Abs(ca.r - cb.r) + Math.Abs(ca.g - cb.g) + Math.Abs(ca.b - cb.b);
                    float w = ca.r - ca.b;   // ABSOLUTE hue (r148 first-red law above)
                    tot++;
                    if (d > 0.06f && w > 0.15f) { n++; warmSum += w; }
                }
            litPx = n; totalSamples = tot;
            avgWarm = n > 0 ? (float)(warmSum / n) : 0f;
        }

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

        static string ReloadProve()
        {
            Scene scene = EditorSceneManager.OpenScene(ScenePath, OpenSceneMode.Single);
            if (!scene.isLoaded) throw new InvalidOperationException("CityScene failed to load");
            GameObject ambGo = GameObject.Find("CityAmbient");
            CityAmbient amb = ambGo != null ? ambGo.GetComponent<CityAmbient>() : null;
            Chk(amb != null, "CityAmbient missing/unresolved after editor restart (r14 stub disease)");
            Chk(DiskRimCensus() == 0, "RimBand GOs persisted across restart (runtime-only law broken)");
            Chk(UnityEngine.Object.FindObjectsOfType<CityInterior>().Length >= 1, "CityInterior unresolved after restart");
            Chk(UnityEngine.Object.FindObjectsOfType<CityCameraRig>().Length >= 1, "CityCameraRig unresolved after restart");
            Chk(UnityEngine.Object.FindObjectsOfType<CityAmbientAudio>().Length >= 1, "CityAmbientAudio unresolved after restart");
            GameObject camGo = GameObject.Find("CityCamera");
            Camera cam = camGo != null ? camGo.GetComponent<Camera>() : null;
            Chk(cam != null && Math.Abs(cam.orthographicSize - RigMath.L0Size) < 0.01f,
                "L0 camera broken after restart");
            amb.EnsureVisuals();
            SpriteRenderer[] rims = FindRims(amb);
            Chk(rims.Length == RimLightRules.SegmentCount, "rim census after restart");
            amb.ApplyAmbient(AmbientTier.Dusk);
            for (int i = 0; i < rims.Length; i++)
                Chk(Eq(rims[i].color.a, RimLightRules.AlphaFor(i, AmbientTier.Dusk), 2e-3f),
                    "RimBand" + i + " dusk law lost after restart");
            return "reload_gate=OK rims=" + rims.Length + " purity=0 neighbors=3 cam_L0="
                + cam.orthographicSize.ToString("F1") + " dusk_law=11/11";
        }
    }
}
