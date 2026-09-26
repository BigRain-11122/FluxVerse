// FluxVerse r158 (P-20260925-09): batch proof for the light-fx engine round
// (LightFxRules.cs mirror of Tools/city/lightfx-manifest.json v0.2 - the r157
// sandbox+asset bake = single geometry source; v0.2 = the r158 z-physics
// re-anchor, camera z -10 -> smaller z = nearer = on top). Sentinel pattern
// (r34):
//   pass 1: logs/lightfx.run        -> FluxVerse.LightFxProof.BatchRun   -> logs/lightfx.done
//   pass 2: logs/lightfx-reload.run -> FluxVerse.LightFxProof.ReloadGate -> logs/lightfx-reload.done
// Sections:
//  A manifest mirror (headless): every law cross-checked against the JSON
//    (protocol v0.2 / orders + z physics map / four tier alpha maps / bloom
//    17 rows vs the LIVE NeonRules sign table incl. the px-law recompute /
//    twin share / cone 12 rows vs the post arrays / wet 6 rows vs the
//    NeonRules.Buildings spans + vcol zero-overlap / star field: band,
//    exclusions, min pairwise 28, twinkle law recompute / horizon: geometry,
//    camera-column gap center 13.0, proof-window zero-touch, skyBottom color
//    family, tier map, blend-ride law).
//  B scene build (persisted mounts, OfficeProof idempotent sweep idiom):
//    sweep stale LightFx* GOs, build the 57 mounts natural-size at the
//    family order/z, day-law colors, census 57 - twice (idempotent x2),
//    adapter Ensure, cache mounts + horizon quads.
//  C law battery: tier alpha sweep x4 (closed family map, rgb white) +
//    twinkle determinism x8 steps (stars follow the phase law, non-star
//    families steady) + LIVE geometry census (cone posts +1.5, star grid,
//    wet spans) + horizon battery on CityAmbient (instant law x4 tiers,
//    D1 blend ride dusk->night monotonic decay + settle + mid-flip restart).
//  D render gates (clean attribution - only the toggled family moves):
//    night per-mount lit census (bloom/cone/wet) + star-field aggregate +
//    dusk presence + horizon dusk diff (quads toggled) + day zero-leak
//    (cone/wet/stars exact 0) + bloom day presence + L1 south street shot.
//  E restore + save: day law, CityAmbient.ReleaseVisuals (r146 save-purity
//    law - the disk scene never learns runtime children), census, SaveScene.
//  F pass 2 reload: 57 mounts persist with sprites, adapter resolves, disk
//    = day law + law positions + family order/z, CityAmbient ZERO children
//    on disk (horizon quads are runtime-only), tier law re-apply, neighbors.
// Fail-loud: any broken assumption throws into the .done report. ASCII. No 3D.
using System;
using System.IO;
using System.Text.RegularExpressions;
using UnityEngine;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine.SceneManagement;

namespace FluxVerse
{
    public static class LightFxProof
    {
        static string ProjectRoot { get { return Path.GetDirectoryName(Application.dataPath); } }
        static string RepoRoot { get { return Path.GetDirectoryName(ProjectRoot); } }
        static string RunPath { get { return Path.Combine(RepoRoot, "logs", "lightfx.run"); } }
        static string DonePath { get { return Path.Combine(RepoRoot, "logs", "lightfx.done"); } }
        static string ReloadRunPath { get { return Path.Combine(RepoRoot, "logs", "lightfx-reload.run"); } }
        static string ReloadDonePath { get { return Path.Combine(RepoRoot, "logs", "lightfx-reload.done"); } }
        static string ScenePath { get { return "Assets/Scenes/CityScene.unity"; } }
        static string ManifestPath { get { return Path.Combine(RepoRoot, "Tools", "city", "lightfx-manifest.json"); } }
        static int asserts;

        // ---- manifest model (JsonUtility mirror; star points parsed by regex
        //      because JsonUtility cannot do int[][]) ----
        [Serializable] class MTierPct { public int day; public int dawn; public int dusk; public int night; }
        [Serializable] class MBloomLaw
        {
            public string mounts; public string px_law; public string texture_law; public string z_law;
            public string excluded; public string twin_law; public MTierPct tier_alpha_pct;
        }
        [Serializable] class MBloom { public string sign; public string asset; public int[] px; public float x; public float y; public int[] color; }
        [Serializable] class MBloomSec { public MBloomLaw law; public MBloom[] mounts; }
        [Serializable] class MPoolY16 { public int north; public int south; }
        [Serializable] class MConeLaw
        {
            public string posts_source; public MPoolY16 pool_y16; public string pool_band_law;
            public string texture; public string color_note; public string z_law;
            public int order; public float z; public MTierPct tier_alpha_pct;
            public string asset; public int[] px;
        }
        [Serializable] class MConeM { public string id; public int x16; public int y16; }
        [Serializable] class MConeSec { public MConeLaw law; public MConeM[] mounts; }
        [Serializable] class MWetLaw
        {
            public string bands; public string mounts; public string texture_law;
            public string vcol_zero_overlap; public string z_law;
            public int order; public float z; public MTierPct tier_alpha_pct;
        }
        [Serializable] class MWet { public string id; public string asset; public int[] px; public float[] rect; public int[] color; }
        [Serializable] class MWetSec { public MWetLaw law; public MWet[] mounts; }
        [Serializable] class MStarLaw
        {
            public int count; public string asset; public int[] px; public string texture_law;
            public string band; public string x_band; public string exclusions; public string snap;
            public string occlusion; public string twinkle; public MTierPct tier_alpha_pct;
        }
        [Serializable] class MStarSec { public MStarLaw law; }
        [Serializable] class MColors { public int[] dusk; public int[] dawn; public string law; }
        [Serializable] class MHorLaw
        {
            public string family; public string geometry; public string band_law; public string gradient;
            public string z_law; public string blend_ride; public MColors colors;
            public int order; public float z; public MTierPct tier_alpha_pct;
        }
        [Serializable] class MBand { public string id; public int[] x16; public int[] y16; }
        [Serializable] class MHorSec { public MHorLaw law; public MBand[] mounts; }
        [Serializable] class MFogM { public string id; public float[] rect; }
        [Serializable] class MFogLaw
        {
            public string family; public string geometry; public int[] color_rgb;
            public string color_source; public MTierPct tier_alpha_pct;
            public int order; public float z; public string z_law; public string purpose;
        }
        [Serializable] class MFogSec { public MFogLaw law; public MFogM[] mounts; }
        [Serializable] class MRoot
        {
            public string protocol; public int baked_round;
            public MBloomSec bloom; public MConeSec lamp_cones; public MWetSec wet_roads;
            public MStarSec stars; public MHorSec horizon_band; public MFogSec depth_fog_wash;
            public string token_gate;
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
            if (m == null || m.bloom == null || m.bloom.mounts == null || m.lamp_cones == null
                || m.lamp_cones.mounts == null || m.wet_roads == null || m.wet_roads.mounts == null
                || m.horizon_band == null || m.horizon_band.law == null
                || m.depth_fog_wash == null || m.depth_fog_wash.law == null)
                throw new InvalidOperationException("lightfx manifest unparseable: " + ManifestPath);
            return m;
        }

        static string RawManifest() { return File.ReadAllText(ManifestPath); }

        // star points: regex over the points array only (JsonUtility cannot do
        // int[][]; the stars law text itself carries bracketed pairs like
        // [-56,56] / [3,3] that must NOT count).
        static int[][] ParseStarPoints(string json)
        {
            int a = json.IndexOf("\"points\"");
            int b = json.IndexOf("\"horizon_band\"");
            if (a < 0 || b < 0 || b <= a) throw new InvalidOperationException("star points section not found");
            string seg = json.Substring(a, b - a);
            MatchCollection ms = Regex.Matches(seg, @"\[\s*(-?\d+)\s*,\s*(-?\d+)\s*\]");
            int[][] pts = new int[ms.Count][];
            for (int i = 0; i < ms.Count; i++)
                pts[i] = new int[] { int.Parse(ms[i].Groups[1].Value), int.Parse(ms[i].Groups[2].Value) };
            return pts;
        }

        // ---- A. manifest mirror (every LightFxRules law vs the JSON source) ----
        static void MirrorGate(MRoot m, string json, int[][] starPts)
        {
            Chk(m.protocol == LightFxRules.Protocol, "protocol mismatch: " + m.protocol);
            Chk(m.protocol == "fluxverse-lightfx/0.3", "protocol must be the r181 v0.3 salience+fog round");
            Chk(m.baked_round == LightFxRules.BakedRound, "baked_round mismatch");

            // z physics map (r158 v0.2): camera z -10 -> smaller z = on top.
            // bloom behind signs (+), cone over props (-), wet over roads (-),
            // stars behind skyline (+), horizon deepest of order -9 (largest).
            Chk(LightFxRules.ZBloomBase > 0f, "bloom z must be BEHIND the sign plane (z 0)");
            Chk(Eq(LightFxRules.ZOf(LightFxRules.BloomFirst), 0.40f, 1e-5f), "bloom z base 0.40");
            Chk(Eq(LightFxRules.ZOf(LightFxRules.BloomFirst + 1) - LightFxRules.ZOf(LightFxRules.BloomFirst),
                LightFxRules.BloomZStep, 1e-6f), "bloom intra-family z step (r119 tie law)");
            Chk(LightFxRules.ZCone < 0f, "cone z must be IN FRONT of the Props tilemap (z 0)");
            Chk(LightFxRules.ZWet < 0f, "wet z must be IN FRONT of the Roads tilemap (z 0)");
            Chk(LightFxRules.ZStars > 0f, "stars z must be BEHIND the far skyline (z 0)");
            Chk(LightFxRules.HorizonZ > LightFxRules.ZStars,
                "horizon must be the DEEPEST of the order -9 family");
            Chk(json.Contains("\"z_physics\""), "render_laws.z_physics note missing");
            Chk(json.Contains("\"cone\": [4, -0.5]") && json.Contains("\"wet\": [2, -0.15]")
                && json.Contains("\"stars\": [-9, 0.5]") && json.Contains("\"horizon\": [-9, 1.0]"),
                "order_map z values != v0.2 physics");
            Chk(m.bloom.law.z_law.Contains("r158 physics law"), "bloom z_law physics text");
            Chk(m.lamp_cones.law.z_law.Contains("r158 physics law"), "cone z_law physics text");
            Chk(m.wet_roads.law.z_law.Contains("r158 physics law"), "wet z_law physics text");
            Chk(m.stars.law.occlusion.Contains("r158 physics law"), "stars occlusion physics text");
            Chk(m.horizon_band.law.z_law.Contains("r158 physics law"), "horizon z_law physics text");

            // tier alpha maps (closed families; manifest pct / 100)
            Chk(m.bloom.law.tier_alpha_pct.day == 20 && m.bloom.law.tier_alpha_pct.dawn == 45
                && m.bloom.law.tier_alpha_pct.dusk == 80 && m.bloom.law.tier_alpha_pct.night == 100,
                "bloom tier pct row");
            Chk(Eq(LightFxRules.BloomAlphaFor(AmbientTier.Day), 0.20f, 1e-6f), "bloom day alpha");
            Chk(Eq(LightFxRules.BloomAlphaFor(AmbientTier.Dawn), 0.45f, 1e-6f), "bloom dawn alpha");
            Chk(Eq(LightFxRules.BloomAlphaFor(AmbientTier.Dusk), 0.80f, 1e-6f), "bloom dusk alpha");
            Chk(Eq(LightFxRules.BloomAlphaFor(AmbientTier.Night), 1f, 1e-6f), "bloom night alpha");
            Chk(m.lamp_cones.law.tier_alpha_pct.day == 0 && m.lamp_cones.law.tier_alpha_pct.dawn == 40
                && m.lamp_cones.law.tier_alpha_pct.dusk == 80 && m.lamp_cones.law.tier_alpha_pct.night == 100,
                "cone tier pct row");
            Chk(Eq(LightFxRules.ConeAlphaFor(AmbientTier.Day), 0f, 1e-6f), "cone day alpha");
            Chk(Eq(LightFxRules.ConeAlphaFor(AmbientTier.Dawn), 0.40f, 1e-6f), "cone dawn alpha");
            Chk(Eq(LightFxRules.ConeAlphaFor(AmbientTier.Dusk), 0.80f, 1e-6f), "cone dusk alpha");
            Chk(Eq(LightFxRules.ConeAlphaFor(AmbientTier.Night), 1f, 1e-6f), "cone night alpha");
            Chk(m.wet_roads.law.tier_alpha_pct.day == 0 && m.wet_roads.law.tier_alpha_pct.dawn == 15
                && m.wet_roads.law.tier_alpha_pct.dusk == 40 && m.wet_roads.law.tier_alpha_pct.night == 60,
                "wet tier pct row");
            Chk(Eq(LightFxRules.WetAlphaFor(AmbientTier.Day), 0f, 1e-6f), "wet day alpha");
            Chk(Eq(LightFxRules.WetAlphaFor(AmbientTier.Dawn), 0.15f, 1e-6f), "wet dawn alpha");
            Chk(Eq(LightFxRules.WetAlphaFor(AmbientTier.Dusk), 0.40f, 1e-6f), "wet dusk alpha");
            Chk(Eq(LightFxRules.WetAlphaFor(AmbientTier.Night), 0.60f, 1e-6f), "wet night alpha");
            Chk(m.stars.law.tier_alpha_pct.day == 0 && m.stars.law.tier_alpha_pct.dawn == 0
                && m.stars.law.tier_alpha_pct.dusk == 0 && m.stars.law.tier_alpha_pct.night == 100,
                "stars tier pct row");
            Chk(Eq(LightFxRules.StarAlphaFor(AmbientTier.Night), 1f, 1e-6f)
                && LightFxRules.StarAlphaFor(AmbientTier.Day) == 0f
                && LightFxRules.StarAlphaFor(AmbientTier.Dawn) == 0f
                && LightFxRules.StarAlphaFor(AmbientTier.Dusk) == 0f, "stars night-only law");
            Chk(Eq(LightFxRules.TwinkleStepSec, 0.5f, 1e-6f), "twinkle step sec");

            // twinkle law independent recompute (local steps table, phase law)
            int[] steps = new int[] { 100, 55, 25, 55 };
            for (int idx = 0; idx < LightFxRules.StarCount; idx++)
                for (int s = 0; s < 8; s++)
                {
                    float law = steps[((s + idx) % 4 + 4) % 4] / 100f;
                    Chk(Eq(LightFxRules.TwinkleFactor(idx, s), law, 1e-6f),
                        "twinkle law recompute idx=" + idx + " s=" + s);
                    Chk(Eq(LightFxRules.StarMountAlpha(idx, AmbientTier.Night, s), law, 1e-6f),
                        "star mount alpha night recompute idx=" + idx + " s=" + s);
                    Chk(LightFxRules.StarMountAlpha(idx, AmbientTier.Day, s) == 0f,
                        "star mount alpha day zero idx=" + idx + " s=" + s);
                }

            // ---- bloom: 17 rows vs the LIVE NeonRules sign table ----
            Chk(m.bloom.mounts.Length == LightFxRules.BloomCount, "bloom count");
            int nonExempt = 0;
            for (int n = 0; n < NeonRules.Count; n++)
                if (NeonRules.At(n).mount != NeonRules.MountExempt) nonExempt++;
            Chk(nonExempt == LightFxRules.BloomCount, "NeonRules non-exempt census == 17");
            for (int i = 0; i < m.bloom.mounts.Length; i++)
            {
                MBloom b = m.bloom.mounts[i];
                int ri = LightFxRules.BloomFirst + i;
                int s = LightFxRules.BloomSignIdx(ri);
                Chk(b.sign == NeonRules.Name(s), "bloom " + i + " sign vs NeonRules order");
                Chk(b.sign == NeonRules.At(s).name, "bloom " + i + " sign live name");
                Chk(NeonRules.At(s).mount != NeonRules.MountExempt,
                    "bloom " + i + " sign must never be the exempt family");
                Chk(b.asset == LightFxRules.Path(ri), "bloom " + i + " asset path");
                // independent px-law recompute from the LIVE sign table
                int pw = (int)Math.Floor(NeonRules.WorldW(s) * 1.7f * 16f + 0.5f);
                int ph = (int)Math.Floor(NeonRules.WorldH(s) * 1.6f * 16f + 0.5f);
                Chk(b.px[0] == pw && b.px[1] == ph,
                    "bloom " + i + " px law recompute: manifest " + b.px[0] + "x" + b.px[1]
                    + " vs law " + pw + "x" + ph);
                Chk(b.px[0] == LightFxRules.PxW(ri) && b.px[1] == LightFxRules.PxH(ri),
                    "bloom " + i + " px vs rules table");
                Chk(Eq(b.x, LightFxRules.CenterX(ri), 1e-5f) && Eq(b.y, LightFxRules.CenterY(ri), 1e-5f),
                    "bloom " + i + " mount center != sign center");
                Chk(Eq(b.x, NeonRules.Pos(s).x, 1e-5f) && Eq(b.y, NeonRules.Pos(s).y, 1e-5f),
                    "bloom " + i + " center drift vs live sign: " + b.sign);
                Chk(Eq(LightFxRules.WorldW(ri), b.px[0] / 16f, 1e-5f), "bloom " + i + " natural width");
                Chk(Eq(LightFxRules.WorldH(ri), b.px[1] / 16f, 1e-5f), "bloom " + i + " natural height");
                Chk(b.color != null && b.color.Length == 3, "bloom " + i + " color arity");
            }
            // twin share law: QuantL/R share bloom-quant.png; 16 unique assets serve 17 mounts
            Chk(LightFxRules.Path(LightFxRules.BloomFirst + 5) == LightFxRules.Path(LightFxRules.BloomFirst + 6),
                "twin law: QuantL/R must share bloom-quant.png");
            var set = new System.Collections.Generic.HashSet<string>();
            for (int i = 0; i < LightFxRules.BloomCount; i++) set.Add(LightFxRules.Path(LightFxRules.BloomFirst + i));
            Chk(set.Count == 16, "twin law: 16 unique assets serve 17 mounts, got " + set.Count);
            Chk(m.bloom.law.twin_law.Contains("bloom-quant.png"), "twin law text");
            Chk(m.bloom.law.excluded.Contains("NeonTowerAntM"), "excluded family text");

            // ---- cones: 12 rows vs the post arrays ----
            Chk(m.lamp_cones.mounts.Length == LightFxRules.ConeCount, "cone count");
            Chk(m.lamp_cones.law.pool_y16.north == 67 && m.lamp_cones.law.pool_y16.south == -69,
                "cone pool y16 (67 / -69)");
            Chk(Eq(LightFxRules.ConeNorthY, 67f / 16f, 1e-6f) && Eq(LightFxRules.ConeSouthY, -69f / 16f, 1e-6f),
                "cone y law");
            Chk(m.lamp_cones.law.posts_source.Contains("row 3") && m.lamp_cones.law.posts_source.Contains("row -4"),
                "cone posts source text");
            // the post x-arrays live in the sources provenance line (builder quote)
            Chk(json.Contains("x {-28,-20,-12,12,20,28}"), "cone north posts provenance");
            Chk(json.Contains("x {-24,-16,-8,8,16,24}"), "cone south posts provenance");
            for (int i = 0; i < m.lamp_cones.mounts.Length; i++)
            {
                MConeM c = m.lamp_cones.mounts[i];
                int ri = LightFxRules.ConeFirst + i;
                Chk(("LightFx" + c.id) == LightFxRules.Name(ri), "cone " + i + " id");
                Chk(Eq(LightFxRules.CenterX(ri), c.x16 / 16f, 1e-5f), "cone " + i + " x16 center");
                Chk(Eq(LightFxRules.CenterY(ri), c.y16 / 16f, 1e-5f), "cone " + i + " y16 center");
                bool north = i < 6;
                int post = north ? LightFxRules.ConeNorthX[i] : LightFxRules.ConeSouthX[i - 6];
                Chk(Eq(LightFxRules.CenterX(ri), post + LightFxRules.ConePoolEastOfCell, 1e-5f),
                    "cone " + i + " pool = post + 1.5 east");
                Chk(c.y16 == (north ? 67 : -69), "cone " + i + " y16 row law");
                Chk(Eq(LightFxRules.CenterY(ri), north ? LightFxRules.ConeNorthY : LightFxRules.ConeSouthY, 1e-6f),
                    "cone " + i + " y law");
                Chk(LightFxRules.PxW(ri) == 40 && LightFxRules.PxH(ri) == 24, "cone " + i + " pool px");
                Chk(Eq(LightFxRules.WorldW(ri), 2.5f, 1e-5f) && Eq(LightFxRules.WorldH(ri), 1.5f, 1e-5f),
                    "cone " + i + " pool world size");
                // band law: halfH 0.75 bleeds a half row onto the curb/post foot row
                Chk(Eq(LightFxRules.Y0(ri), LightFxRules.CenterY(ri) - 0.75f, 1e-6f), "cone " + i + " halfH");
            }
            Chk(m.lamp_cones.law.asset == "Assets/ArtPacks/light-fx/lamp-pool.png", "cone asset");
            Chk(m.lamp_cones.law.color_note.Contains("red"), "cone five-color note text");

            // ---- wet: 6 rows vs the LIVE NeonRules.Buildings spans ----
            Chk(m.wet_roads.mounts.Length == LightFxRules.WetCount, "wet count");
            for (int i = 0; i < m.wet_roads.mounts.Length; i++)
            {
                MWet w = m.wet_roads.mounts[i];
                int ri = LightFxRules.WetFirst + i;
                Chk(("LightFx" + w.id) == LightFxRules.Name(ri), "wet " + i + " id");
                Chk(w.asset == LightFxRules.Path(ri), "wet " + i + " asset");
                Chk(w.px[0] == LightFxRules.PxW(ri) && w.px[1] == 32,
                    "wet " + i + " px = span*16 x 32");
                Chk(Eq(w.rect[0], LightFxRules.X0(ri), 1e-5f) && Eq(w.rect[1], LightFxRules.Y0(ri), 1e-5f)
                    && Eq(w.rect[2], LightFxRules.X1(ri), 1e-5f) && Eq(w.rect[3], LightFxRules.Y1(ri), 1e-5f),
                    "wet " + i + " rect");
                Chk(Eq(LightFxRules.WorldW(ri), w.px[0] / 16f, 1e-5f), "wet " + i + " natural width");
                // LIVE cross-check: south strips = Buildings 4/5/6 spans at y [-8,-6];
                // north strips = Buildings 1/2/3 spans at y [7,9]
                int b = i < 3 ? 4 + i : 1 + (i - 3);
                NeonRules.Building bl = NeonRules.BuildingAt(b);
                Chk(Eq(w.rect[0], bl.x0, 1e-5f) && Eq(w.rect[2], bl.x1, 1e-5f),
                    "wet " + i + " span != Buildings[" + b + "] live span");
                if (i < 3)
                    Chk(Eq(w.rect[1], -8f, 1e-5f) && Eq(w.rect[3], -6f, 1e-5f), "wet " + i + " south band");
                else
                    Chk(Eq(w.rect[1], 7f, 1e-5f) && Eq(w.rect[3], 9f, 1e-5f), "wet " + i + " north band");
                // vcol zero-overlap: never cover the avenue cells [-18,-17] / [17,18]
                bool hitWest = w.rect[0] < -17f && w.rect[2] > -18f;
                bool hitEast = w.rect[0] < 18f && w.rect[2] > 17f;
                Chk(!hitWest && !hitEast, "wet " + i + " covers a vcol avenue cell");
                Chk(w.color != null && w.color.Length == 3, "wet " + i + " color arity");
            }

            // ---- stars: field law ----
            Chk(m.stars.law.count == LightFxRules.StarCount, "star count");
            Chk(starPts.Length == LightFxRules.StarCount, "star points parsed: " + starPts.Length);
            for (int i = 0; i < starPts.Length; i++)
            {
                int ri = LightFxRules.StarsFirst + i;
                Chk(LightFxRules.Name(ri) == "LightFxStar" + i.ToString("00"), "star " + i + " name");
                Chk(LightFxRules.StarX16At(i) == starPts[i][0] && LightFxRules.StarY16At(i) == starPts[i][1],
                    "star " + i + " grid vs manifest");
                Chk(starPts[i][1] >= LightFxRules.StarBandY16Lo && starPts[i][1] <= LightFxRules.StarBandY16Hi,
                    "star " + i + " y band 271..301");
                Chk(starPts[i][0] >= LightFxRules.StarX16Lo && starPts[i][0] <= LightFxRules.StarX16Hi,
                    "star " + i + " x band");
                Chk(Math.Abs(starPts[i][0]) > LightFxRules.StarTowerZoneX16,
                    "star " + i + " inside the tower exclusion zone");
                Chk(!(starPts[i][0] >= LightFxRules.StarGapX16Lo && starPts[i][0] <= LightFxRules.StarGapX16Hi),
                    "star " + i + " inside the camera census gap");
                Chk(Eq(LightFxRules.CenterX(ri), starPts[i][0] / 16f, 1e-6f), "star " + i + " center x snap");
                Chk(Eq(LightFxRules.CenterY(ri), starPts[i][1] / 16f, 1e-6f), "star " + i + " center y snap");
                Chk(LightFxRules.PxW(ri) == 3 && LightFxRules.PxH(ri) == 3, "star " + i + " px");
            }
            for (int i = 0; i < starPts.Length; i++)
                for (int j = i + 1; j < starPts.Length; j++)
                {
                    int dx = starPts[i][0] - starPts[j][0], dy = starPts[i][1] - starPts[j][1];
                    int d2 = dx * dx + dy * dy;
                    Chk(d2 >= LightFxRules.StarMinPairDist16 * LightFxRules.StarMinPairDist16,
                        "star pair " + i + "/" + j + " min distance 28 grid units");
                }
            Chk(m.stars.law.twinkle.Contains("[100, 55, 25, 55]") && m.stars.law.twinkle.Contains("0.5s"),
                "twinkle text");

            // ---- horizon band: geometry + zero-touch + color family + blend law ----
            Chk(m.horizon_band.mounts.Length == LightFxRules.HorizonCount, "horizon count");
            Chk(Eq(LightFxRules.HorizonY0, 268f / 16f, 1e-6f) && Eq(LightFxRules.HorizonY1, 302f / 16f, 1e-6f),
                "horizon y16 band");
            Chk(LightFxRules.HorizonY0 > 16.6f, "horizon must clear the SkylineProof census band (16.6)");
            Chk(LightFxRules.HorizonY1 < 19.04f, "horizon must clear the AmbientProof zenith window (19.04)");
            for (int i = 0; i < LightFxRules.HorizonCount; i++)
            {
                MBand b = m.horizon_band.mounts[i];
                Chk(b.x16[0] / 16f == LightFxRules.HorizonX0(i) && b.x16[1] / 16f == LightFxRules.HorizonX1(i),
                    "horizon " + i + " x16 span");
            }
            float gapMid = (LightFxRules.HorizonX0(1) + LightFxRules.HorizonX1(0)) * 0.5f;
            Chk(Eq(gapMid, 13.0f, 0.01f), "camera census gap must center on x=13: " + gapMid);
            Chk(Eq(LightFxRules.HorizonX1(0) - LightFxRules.HorizonX0(0)
                + LightFxRules.HorizonX1(1) - LightFxRules.HorizonX0(1) + (LightFxRules.HorizonX0(1) - LightFxRules.HorizonX1(0)),
                92f, 0.01f), "horizon 92u tint-quad width law");
            Color duskC = AmbientWheel.PaletteFor(AmbientTier.Dusk).skyBottom;
            Color dawnC = AmbientWheel.PaletteFor(AmbientTier.Dawn).skyBottom;
            Chk(Math.Abs(m.horizon_band.law.colors.dusk[0] - duskC.r * 255f) < 0.6f
                && Math.Abs(m.horizon_band.law.colors.dusk[1] - duskC.g * 255f) < 0.6f
                && Math.Abs(m.horizon_band.law.colors.dusk[2] - duskC.b * 255f) < 0.6f,
                "horizon dusk color = AmbientWheel skyBottom family");
            Chk(Math.Abs(m.horizon_band.law.colors.dawn[0] - dawnC.r * 255f) < 0.6f
                && Math.Abs(m.horizon_band.law.colors.dawn[1] - dawnC.g * 255f) < 0.6f
                && Math.Abs(m.horizon_band.law.colors.dawn[2] - dawnC.b * 255f) < 0.6f,
                "horizon dawn color = AmbientWheel skyBottom family");
            Chk(Eq(LightFxRules.HorizonAlphaFor(AmbientTier.Dawn), 0.35f, 1e-6f), "horizon dawn alpha");
            Chk(Eq(LightFxRules.HorizonAlphaFor(AmbientTier.Dusk), 0.85f, 1e-6f),
                "horizon dusk alpha (r184 closure 50 -> 75 -> 85, gate +4.0 unchanged)");
            Chk(LightFxRules.HorizonAlphaFor(AmbientTier.Day) == 0f
                && LightFxRules.HorizonAlphaFor(AmbientTier.Night) == 0f, "horizon day/night zero");
            Chk(m.horizon_band.law.tier_alpha_pct.day == 0 && m.horizon_band.law.tier_alpha_pct.dawn == 35
                && m.horizon_band.law.tier_alpha_pct.dusk == 85 && m.horizon_band.law.tier_alpha_pct.night == 0,
                "horizon tier pct row (r184 dusk 85)");
            Chk(m.horizon_band.law.family.Contains("ReleaseVisuals"), "horizon family law text");
            Chk(m.horizon_band.law.blend_ride.Contains("D1 blend"), "horizon blend_ride text");
            Chk(LightFxRules.HorizonOrder == -9 && Eq(LightFxRules.HorizonZ, 1.0f, 1e-6f),
                "horizon order/z");

            // ---- r181 depth fog wash: geometry + color family + tier law + variant B order ----
            Chk(m.depth_fog_wash.mounts.Length == 1, "fog wash mount count");
            Chk(m.depth_fog_wash.law.color_rgb[0] == 158 && m.depth_fog_wash.law.color_rgb[1] == 148
                && m.depth_fog_wash.law.color_rgb[2] == 199, "fog color rgb 158,148,199");
            Color fogC = LightFxRules.FogWashColor();
            float halfQ = 0.5f / 255f;  // 255-quantization half-step: 0.62f -> 158 etc.
            Chk(Eq(fogC.r, 158f / 255f, halfQ) && Eq(fogC.g, 148f / 255f, halfQ)
                && Eq(fogC.b, 199f / 255f, halfQ),
                "fog color single source = SkylineRules.FogFar(Dusk) mauve family");
            Chk(Eq(fogC.r, SkylineRules.FogFar(AmbientTier.Dusk).r, 1e-6f)
                && Eq(fogC.g, SkylineRules.FogFar(AmbientTier.Dusk).g, 1e-6f)
                && Eq(fogC.b, SkylineRules.FogFar(AmbientTier.Dusk).b, 1e-6f),
                "fog color accessor parity");
            Chk(m.depth_fog_wash.law.tier_alpha_pct.day == 0 && m.depth_fog_wash.law.tier_alpha_pct.dawn == 0
                && m.depth_fog_wash.law.tier_alpha_pct.dusk == 25
                && m.depth_fog_wash.law.tier_alpha_pct.night == 0, "fog tier pct row");
            Chk(Eq(LightFxRules.FogWashAlphaFor(AmbientTier.Dusk), 0.25f, 1e-6f), "fog dusk alpha 0.25");
            Chk(LightFxRules.FogWashAlphaFor(AmbientTier.Day) == 0f
                && LightFxRules.FogWashAlphaFor(AmbientTier.Dawn) == 0f
                && LightFxRules.FogWashAlphaFor(AmbientTier.Night) == 0f, "fog day/dawn/night zero");
            Chk(LightFxRules.FogWashOrder == 4 && Eq(LightFxRules.FogWashZ, -0.1f, 1e-6f),
                "fog variant B order 4 z -0.1 (the '4.5' slot)");
            Chk(LightFxRules.FogWashOrder < RimLightRules.SortOrder,
                "fog must sit BELOW the rim order (variant B: zero rim coupling)");
            Chk(LightFxRules.FogWashOrder > 3, "fog must sit ABOVE the order-3 facade family");
            float[] fr = m.depth_fog_wash.mounts[0].rect;
            Chk(Eq(fr[0], LightFxRules.FogWashX0, 1e-5f) && Eq(fr[1], LightFxRules.FogWashY0, 1e-5f)
                && Eq(fr[2], LightFxRules.FogWashX1, 1e-5f) && Eq(fr[3], LightFxRules.FogWashY1, 1e-5f),
                "fog rect vs rules");
            Chk(LightFxRules.FogWashY1 < 14.26f,
                "fog top edge must clear the AmbientProof far-shore window (14.26)");
            Chk(LightFxRules.FogWashName == "AmbientFogWash", "fog mount name");
            Chk(m.depth_fog_wash.law.z_law.Contains("variant B"), "fog variant text");

            // render family map
            Chk(LightFxRules.OrderOf(LightFxRules.BloomFirst) == 6, "order map bloom");
            Chk(LightFxRules.OrderOf(LightFxRules.ConeFirst) == 4, "order map cone");
            Chk(LightFxRules.OrderOf(LightFxRules.WetFirst) == 2, "order map wet");
            Chk(LightFxRules.OrderOf(LightFxRules.StarsFirst) == -9, "order map stars");
        }

        static string Prove()
        {
            // ---- A. manifest mirror + law recompute (headless) ----
            MRoot m = LoadManifest();
            string json = RawManifest();
            int[][] starPts = ParseStarPoints(json);
            MirrorGate(m, json, starPts);

            // ---- B. scene build: persisted mounts + adapter (idempotent x2) ----
            Scene scene = EditorSceneManager.OpenScene(ScenePath, OpenSceneMode.Single);
            if (!scene.isLoaded) throw new InvalidOperationException("CityScene failed to load");
            for (int sweep = 0; sweep < 2; sweep++)
            {
                SweepStaleMounts();   // idempotent law (OfficeProof idiom)
                for (int i = 0; i < LightFxRules.MountCount; i++) BuildMount(i);
                Chk(MountCensus() == LightFxRules.MountCount,
                    "mount census after build sweep " + sweep + " (idempotent x2)");
            }
            CityLightFx adapter = EnsureAdapter();
            for (int i = 0; i < LightFxRules.MountCount; i++) AssertMountWiring(i);
            CacheMounts();   // all 57 active here - the only safe Find moment (r34 law)

            GameObject ambGo = GameObject.Find("CityAmbient");
            Chk(ambGo != null, "CityAmbient GO missing");
            CityAmbient amb = ambGo.GetComponent<CityAmbient>();
            Chk(amb != null, "CityAmbient component unresolved (r14 stub disease)");
            amb.ApplyAmbient(AmbientTier.Day);   // builds the runtime family incl. the horizon quads
            for (int i = 0; i < LightFxRules.HorizonCount; i++)
            {
                GameObject h = GameObject.Find(LightFxRules.HorizonName(i));
                Chk(h != null, "horizon quad missing after EnsureVisuals: " + LightFxRules.HorizonName(i));
                Chk(h.transform.parent == amb.transform, "horizon quad not a CityAmbient child");
                Chk(h.GetComponent<SpriteRenderer>().sortingOrder == LightFxRules.HorizonOrder,
                    "horizon order");
                Chk(Eq(h.transform.position.z, LightFxRules.HorizonZ, 1e-5f), "horizon z");
            }
            CacheHorizon();
            // r181: the fog wash quad joins the same runtime family
            GameObject fogGo = GameObject.Find(LightFxRules.FogWashName);
            Chk(fogGo != null, "fog wash quad missing after EnsureVisuals");
            Chk(fogGo.transform.parent == amb.transform, "fog wash not a CityAmbient child");
            SpriteRenderer fogSr = fogGo.GetComponent<SpriteRenderer>();
            Chk(fogSr != null, "fog wash has no renderer");
            Chk(fogSr.sortingOrder == LightFxRules.FogWashOrder, "fog order 4 (variant B)");
            Vector3 fp = fogGo.transform.position;
            Chk(Eq(fp.x, (LightFxRules.FogWashX0 + LightFxRules.FogWashX1) * 0.5f, 1e-4f), "fog x center");
            Chk(Eq(fp.y, (LightFxRules.FogWashY0 + LightFxRules.FogWashY1) * 0.5f, 1e-4f), "fog y center");
            Chk(Eq(fp.z, LightFxRules.FogWashZ, 1e-5f), "fog z -0.1");
            Vector3 fbs = fogSr.bounds.size;
            Chk(Eq(fbs.x, LightFxRules.FogWashX1 - LightFxRules.FogWashX0, 1e-3f)
                && Eq(fbs.y, LightFxRules.FogWashY1 - LightFxRules.FogWashY0, 1e-3f),
                "fog bounds == the world band (relative-scale quad)");
            Chk(Eq(amb.CurrentFogAlpha, 0f, 1e-6f), "day fog alpha must be zero after EnsureVisuals");
            CacheFog();

            // ---- C. law battery ----
            // C1 tier alpha sweep x4 (closed family map; rgb stays white)
            TierBattery(adapter, AmbientTier.Day);
            TierBattery(adapter, AmbientTier.Dawn);
            TierBattery(adapter, AmbientTier.Dusk);
            TierBattery(adapter, AmbientTier.Night);

            // C2 twinkle determinism x8 steps at night (stars phase-law, families steady)
            int[] steps = new int[] { 100, 55, 25, 55 };
            for (int s = 0; s < 8; s++)
            {
                adapter.ApplyState(AmbientTier.Night, s);
                for (int k = 0; k < LightFxRules.StarCount; k++)
                {
                    int ri = LightFxRules.StarsFirst + k;
                    SpriteRenderer sr = mountCache[ri].GetComponent<SpriteRenderer>();
                    float law = steps[((s + k) % 4 + 4) % 4] / 100f;
                    Chk(Eq(sr.color.a, law, 1e-5f), "twinkle step " + s + " star " + k + " alpha");
                }
                for (int ri = 0; ri < LightFxRules.StarsFirst; ri++)
                {
                    SpriteRenderer sr = mountCache[ri].GetComponent<SpriteRenderer>();
                    Chk(Eq(sr.color.a, LightFxRules.AlphaOf(ri, AmbientTier.Night), 1e-5f),
                        "twinkle step " + s + " disturbed family " + LightFxRules.Name(ri));
                }
            }

            // C3 LIVE geometry census: cone posts +1.5, star grid centers
            for (int i = 0; i < LightFxRules.ConeCount; i++)
            {
                int ri = LightFxRules.ConeFirst + i;
                bool north = i < 6;
                int post = north ? LightFxRules.ConeNorthX[i] : LightFxRules.ConeSouthX[i - 6];
                Vector3 p = mountCache[ri].transform.position;
                Chk(Eq(p.x, post + 1.5f, 1e-5f), "cone live x " + LightFxRules.Name(ri));
                Chk(Eq(p.y, north ? 67f / 16f : -69f / 16f, 1e-5f), "cone live y " + LightFxRules.Name(ri));
            }
            for (int k = 0; k < LightFxRules.StarCount; k++)
            {
                int ri = LightFxRules.StarsFirst + k;
                Vector3 p = mountCache[ri].transform.position;
                Chk(Eq(p.x, LightFxRules.StarX16At(k) / 16f, 1e-6f), "star live x snap");
                Chk(Eq(p.y, LightFxRules.StarY16At(k) / 16f, 1e-6f), "star live y snap");
            }

            // C4 horizon battery: instant law x4 + D1 blend ride (never hard-cuts)
            HorizonBattery(amb);

            // ---- D. render gates ----
            GameObject camGo = GameObject.Find("CityCamera");
            Camera cam = camGo != null ? camGo.GetComponent<Camera>() : null;
            Chk(cam != null && cam.orthographic, "CityCamera missing");
            Vector3 origPos = cam.transform.position;
            float origSize = cam.orthographicSize;

            // D1 night must-show: mounts-on vs all-off baseline (clean attribution)
            amb.ApplyAmbient(AmbientTier.Night);
            adapter.ApplyState(AmbientTier.Night, 0);
            Texture2D nightOn = Shot(cam, "m1-r158-lightfx-night.png");
            SetMountsActive(false);
            Texture2D nightOff = Shot(cam, null);
            SetMountsActive(true);
            int[] nightPx = new int[LightFxRules.MountCount];
            for (int i = 0; i < LightFxRules.MountCount; i++)
            {
                int lit;
                MountDelta(nightOn, nightOff, cam, i, out lit);
                nightPx[i] = lit;
                if (i < LightFxRules.BloomFirst + LightFxRules.BloomCount)
                {
                    int gate = i == LightFxRules.BloomFirst + 14 ? 500 : 40;   // Bigmoney hero
                    Chk(lit >= gate, "night bloom census low at " + LightFxRules.Name(i)
                        + ": px=" + lit + " gate=" + gate);
                }
                else if (i < LightFxRules.ConeFirst + LightFxRules.ConeCount)
                    Chk(lit >= 200, "night cone census low at " + LightFxRules.Name(i) + ": px=" + lit);
                else if (i < LightFxRules.WetFirst + LightFxRules.WetCount)
                    Chk(lit >= 150, "night wet census low at " + LightFxRules.Name(i) + ": px=" + lit);
            }
            // star field aggregate (individual occlusion by skyline spires is
            // depth-correct by law - the field gates in aggregate)
            int starLit;
            RectDelta(nightOn, nightOff, cam, -34f, 16.9375f, 33.5625f, 18.8125f, out starLit);
            Chk(starLit >= 40, "night star field aggregate census: " + starLit);
            UnityEngine.Object.DestroyImmediate(nightOn);
            UnityEngine.Object.DestroyImmediate(nightOff);

            // D2 dusk presence (mount families + horizon glow - separate diffs)
            amb.ApplyAmbient(AmbientTier.Dusk);
            adapter.ApplyState(AmbientTier.Dusk, 0);
            Texture2D duskOn = Shot(cam, "m1-r158-lightfx-dusk.png");
            SetMountsActive(false);
            Texture2D duskOffMounts = Shot(cam, null);   // horizon on in both = cancels
            SetMountsActive(true);
            for (int i = 0; i < LightFxRules.MountCount; i++)
            {
                int lit;
                MountDelta(duskOn, duskOffMounts, cam, i, out lit);
                if (i < LightFxRules.BloomFirst + LightFxRules.BloomCount)
                    Chk(lit >= 25, "dusk bloom census low at " + LightFxRules.Name(i) + ": px=" + lit);
                else if (i < LightFxRules.ConeFirst + LightFxRules.ConeCount)
                    Chk(lit >= 100, "dusk cone census low at " + LightFxRules.Name(i) + ": px=" + lit);
                else if (i < LightFxRules.WetFirst + LightFxRules.WetCount)
                    Chk(lit >= 60, "dusk wet census low at " + LightFxRules.Name(i) + ": px=" + lit);
            }
            int duskStarLit;
            RectDelta(duskOn, duskOffMounts, cam, -34f, 16.9375f, 33.5625f, 18.8125f, out duskStarLit);
            Chk(duskStarLit == 0, "dusk star zero-leak: " + duskStarLit);
            SetHorizonActive(false);
            Texture2D duskOffHorizon = Shot(cam, null);
            SetHorizonActive(true);
            int horLit = 0, horPart;
            for (int i = 0; i < LightFxRules.HorizonCount; i++)
            {
                RectDelta(duskOn, duskOffHorizon, cam,
                    LightFxRules.HorizonX0(i), LightFxRules.HorizonY0,
                    LightFxRules.HorizonX1(i), LightFxRules.HorizonY1, out horPart);
                horLit += horPart;
            }
            Chk(horLit >= 800, "dusk horizon glow census: " + horLit);
            // D2b r181: the depth fog veil (clean attribution - only the fog
            // toggles; the adapter families stay constant in both frames)
            SetFogActive(false);
            Texture2D duskOffFog = Shot(cam, null);
            SetFogActive(true);
            int fogLit;
            FogDelta(duskOn, duskOffFog, cam, out fogLit);
            Chk(fogLit >= 150000, "dusk fog veil census low: " + fogLit);
            UnityEngine.Object.DestroyImmediate(duskOffFog);
            // fog day + night zero-leak (alpha 0 = identical frames, exact zero)
            foreach (AmbientTier zt in new AmbientTier[] { AmbientTier.Day, AmbientTier.Night })
            {
                amb.ApplyAmbient(zt);
                Texture2D zOn = Shot(cam, null);
                SetFogActive(false);
                Texture2D zOff = Shot(cam, null);
                SetFogActive(true);
                int zLeak;
                FogDelta(zOn, zOff, cam, out zLeak);
                Chk(zLeak == 0, zt + " fog zero-leak: " + zLeak);
                UnityEngine.Object.DestroyImmediate(zOn);
                UnityEngine.Object.DestroyImmediate(zOff);
            }
            amb.ApplyAmbient(AmbientTier.Dusk);   // restore the section tier
            UnityEngine.Object.DestroyImmediate(duskOn);
            UnityEngine.Object.DestroyImmediate(duskOffMounts);
            UnityEngine.Object.DestroyImmediate(duskOffHorizon);

            // D3 day: TWO clean diffs - the wide bloom halos lawfully glow at
            // day (alpha 0.20) and the MediaRoof halo overlaps the WetMedia
            // window, so each family toggles alone for its own attribution.
            amb.ApplyAmbient(AmbientTier.Day);
            adapter.ApplyState(AmbientTier.Day, 0);
            Texture2D dayOn = Shot(cam, "m1-r158-lightfx-day.png");
            SetBloomActive(false);
            Texture2D dayBloomOff = Shot(cam, null);
            SetBloomActive(true);
            for (int i = 0; i < LightFxRules.BloomCount; i++)
            {
                int lit;
                MountDelta(dayOn, dayBloomOff, cam, LightFxRules.BloomFirst + i, out lit);
                Chk(lit >= 10, "day bloom presence low at " + LightFxRules.Name(i) + ": " + lit);
            }
            SetNonBloomActive(false);
            Texture2D dayNonBloomOff = Shot(cam, null);
            SetNonBloomActive(true);
            for (int i = LightFxRules.ConeFirst; i < LightFxRules.MountCount; i++)
            {
                int lit;
                MountDelta(dayOn, dayNonBloomOff, cam, i, out lit);
                Chk(lit == 0, "day leaked at " + LightFxRules.Name(i) + ": " + lit);
            }
            UnityEngine.Object.DestroyImmediate(dayOn);
            UnityEngine.Object.DestroyImmediate(dayBloomOff);
            UnityEngine.Object.DestroyImmediate(dayNonBloomOff);

            // D4 L1 south street shot (cones + wet readable at street zoom)
            amb.ApplyAmbient(AmbientTier.Night);
            adapter.ApplyState(AmbientTier.Night, 0);
            cam.orthographicSize = RigMath.L1Size;
            cam.transform.position = new Vector3(0.5f, -5.0f, origPos.z);
            Texture2D l1On = Shot(cam, "m1-r158-lightfx-l1-south.png");
            SetMountsActive(false);
            Texture2D l1Off = Shot(cam, null);
            SetMountsActive(true);
            int coneSouth = 0, part;
            for (int i = 0; i < 6; i++)
            {
                MountDelta(l1On, l1Off, cam, LightFxRules.ConeFirst + 6 + i, out part);
                coneSouth += part;
            }
            Chk(coneSouth >= 200, "L1 south cone aggregate census: " + coneSouth);
            int wetQ;
            MountDelta(l1On, l1Off, cam, LightFxRules.WetFirst, out wetQ);
            Chk(wetQ >= 80, "L1 south WetQuant census: " + wetQ);
            UnityEngine.Object.DestroyImmediate(l1On);
            UnityEngine.Object.DestroyImmediate(l1Off);
            cam.orthographicSize = origSize;
            cam.transform.position = origPos;

            // ---- E. restore + save (disk never learns runtime states) ----
            adapter.ApplyState(AmbientTier.Day, 0);
            amb.ReleaseVisuals();   // r146 save-purity law: zero runtime children on disk
            Chk(amb.transform.childCount == 0, "CityAmbient still has children after ReleaseVisuals");
            Chk(MountCensus() == LightFxRules.MountCount, "mount census before save");
            EditorSceneManager.MarkSceneDirty(scene);
            Chk(EditorSceneManager.SaveScene(scene), "SaveScene failed");

            return "asserts=" + asserts
                + " mirror(v0.3 salience+fog, bloom17-live-signs, cone12-posts, wet6-buildings, stars22, horizon2_a75, fog1_vB)"
                + " night_px_sum=" + SumPx(nightPx)
                + " star_field=" + starLit
                + " dusk_horizon=" + horLit
                + " dusk_fog=" + fogLit
                + " day_leak=0 fog_day_night_leak=0 l1_cones=" + coneSouth
                + " shots=4 saved=cityscene";
        }

        static string ReloadProve()
        {
            Scene scene = EditorSceneManager.OpenScene(ScenePath, OpenSceneMode.Single);
            if (!scene.isLoaded) throw new InvalidOperationException("CityScene failed to load");
            Chk(MountCensus() == LightFxRules.MountCount, "mount census after restart");
            GameObject adGo = GameObject.Find("CityLightFx");
            Chk(adGo != null, "CityLightFx GO missing after restart");
            CityLightFx adapter = adGo.GetComponent<CityLightFx>();
            Chk(adapter != null, "CityLightFx component unresolved after restart (r14 stub disease)");
            for (int i = 0; i < LightFxRules.MountCount; i++)
            {
                GameObject go = GameObject.Find(LightFxRules.Name(i));
                Chk(go != null, LightFxRules.Name(i) + " missing after restart");
                SpriteRenderer sr = go.GetComponent<SpriteRenderer>();
                Chk(sr != null && sr.sprite != null, LightFxRules.Name(i) + " sprite lost across restart");
                float lawA = LightFxRules.FamilyOf(i) == LightFxRules.FamilyStars
                    ? LightFxRules.StarMountAlpha(i - LightFxRules.StarsFirst, AmbientTier.Day, 0)
                    : LightFxRules.AlphaOf(i, AmbientTier.Day);
                Chk(Eq(sr.color.a, lawA, 1e-4f), LightFxRules.Name(i) + " disk alpha != day law");
                Chk(Eq(sr.color.r, 1f, 1e-4f) && Eq(sr.color.g, 1f, 1e-4f) && Eq(sr.color.b, 1f, 1e-4f),
                    LightFxRules.Name(i) + " disk rgb != neutral white");
                Vector3 p = go.transform.position;
                Chk(Eq(p.x, LightFxRules.CenterX(i), 1e-4f), LightFxRules.Name(i) + " x != law");
                Chk(Eq(p.y, LightFxRules.CenterY(i), 1e-4f), LightFxRules.Name(i) + " y != law");
                Chk(Eq(p.z, LightFxRules.ZOf(i), 1e-4f), LightFxRules.Name(i) + " z != family law");
                Chk(sr.sortingOrder == LightFxRules.OrderOf(i), LightFxRules.Name(i) + " order != family law");
                Vector3 sc = go.transform.localScale;
                Chk(Math.Abs(sc.x - 1f) < 1e-4f && Math.Abs(sc.y - 1f) < 1e-4f,
                    LightFxRules.Name(i) + " scale != 1 (natural-size law)");
            }
            // disk purity: the horizon quads are runtime-only - NOTHING persists
            GameObject stale = GameObject.Find("AmbientHorizonWest");
            Chk(stale == null, "runtime horizon quads persisted into the disk scene (r146 red-chain)");
            GameObject ambGo = GameObject.Find("CityAmbient");
            Chk(ambGo != null, "CityAmbient GO missing after restart");
            CityAmbient amb = ambGo.GetComponent<CityAmbient>();
            Chk(amb != null, "CityAmbient unresolved after restart");
            Chk(amb.transform.childCount == 0,
                "CityAmbient has " + amb.transform.childCount + " children on disk (r146 law)");
            // tier law re-apply after restart (rebuilds the runtime family)
            amb.ApplyAmbient(AmbientTier.Dusk);
            for (int i = 0; i < LightFxRules.HorizonCount; i++)
            {
                GameObject h = GameObject.Find(LightFxRules.HorizonName(i));
                Chk(h != null, "horizon quad not rebuilt on boot: " + LightFxRules.HorizonName(i));
                SpriteRenderer hsr = h.GetComponent<SpriteRenderer>();
                Chk(Eq(hsr.color.a, LightFxRules.HorizonAlphaFor(AmbientTier.Dusk), 1e-4f), "horizon dusk alpha lost after restart");
                Color sc2 = AmbientWheel.PaletteFor(AmbientTier.Dusk).skyBottom;
                Chk(Eq(hsr.color.r, sc2.r, 1e-3f) && Eq(hsr.color.g, sc2.g, 1e-3f)
                    && Eq(hsr.color.b, sc2.b, 1e-3f), "horizon dusk color lost after restart");
            }
            // r181: the fog wash rebuilds with the same boot law
            GameObject fogRe = GameObject.Find(LightFxRules.FogWashName);
            Chk(fogRe != null, "fog wash not rebuilt on boot");
            SpriteRenderer fogReSr = fogRe.GetComponent<SpriteRenderer>();
            Chk(Eq(fogReSr.color.a, 0.25f, 1e-4f), "fog dusk alpha lost after restart");
            Color fcl2 = LightFxRules.FogWashColor();
            Chk(Eq(fogReSr.color.r, fcl2.r, 1e-3f) && Eq(fogReSr.color.g, fcl2.g, 1e-3f)
                && Eq(fogReSr.color.b, fcl2.b, 1e-3f), "fog color lost after restart");
            adapter.ApplyState(AmbientTier.Night, 0);
            for (int i = 0; i < LightFxRules.MountCount; i++)
            {
                SpriteRenderer sr = GameObject.Find(LightFxRules.Name(i)).GetComponent<SpriteRenderer>();
                float lawA = LightFxRules.FamilyOf(i) == LightFxRules.FamilyStars
                    ? LightFxRules.StarMountAlpha(i - LightFxRules.StarsFirst, AmbientTier.Night, 0)
                    : LightFxRules.AlphaOf(i, AmbientTier.Night);
                Chk(Eq(sr.color.a, lawA, 2e-3f), LightFxRules.Name(i) + " night law lost after restart");
            }
            Chk(UnityEngine.Object.FindObjectsOfType<CityInterior>().Length >= 1, "CityInterior unresolved");
            Chk(UnityEngine.Object.FindObjectsOfType<CityCameraRig>().Length >= 1, "CityCameraRig unresolved");
            Chk(UnityEngine.Object.FindObjectsOfType<CityAmbientAudio>().Length >= 1, "CityAmbientAudio unresolved");
            Chk(UnityEngine.Object.FindObjectsOfType<CityWaterFx>().Length >= 1, "CityWaterFx unresolved");
            GameObject camGo = GameObject.Find("CityCamera");
            Camera cam = camGo != null ? camGo.GetComponent<Camera>() : null;
            Chk(cam != null && Math.Abs(cam.orthographicSize - RigMath.L0Size) < 0.01f,
                "L0 camera broken after restart");
            return "reload_gate=OK mounts=57 adapter=resolved disk=day_law ambient_children=0"
                + " horizon_rebuilt=dusk_law fog_rebuilt=dusk_law night_law=pass neighbors=5 cam_L0="
                + cam.orthographicSize.ToString("F1");
        }

        // ---- helpers ----

        static int SumPx(int[] a)
        {
            int s = 0;
            for (int i = 0; i < a.Length; i++) s += a[i];
            return s;
        }

        static void SweepStaleMounts()
        {
            Transform[] all = UnityEngine.Object.FindObjectsOfType<Transform>();
            for (int i = 0; i < all.Length; i++)
            {
                Transform t = all[i];
                if (t == null || !t.name.StartsWith(LightFxRules.NamePrefix)) continue;
                UnityEngine.Object.DestroyImmediate(t.gameObject);
            }
        }

        static int MountCensus()
        {
            int c = 0;
            Transform[] all = UnityEngine.Object.FindObjectsOfType<Transform>();
            for (int i = 0; i < all.Length; i++)
                if (all[i] != null && all[i].name.StartsWith(LightFxRules.NamePrefix)) c++;
            return c;
        }

        static void BuildMount(int i)
        {
            Sprite s = AssetDatabase.LoadAssetAtPath<Sprite>(LightFxRules.Path(i));
            Chk(s != null, "sprite import failed (fresh import should pass the postprocessor): " + LightFxRules.Path(i));
            Chk((int)s.rect.width == LightFxRules.PxW(i) && (int)s.rect.height == LightFxRules.PxH(i),
                "sprite px mismatch at " + LightFxRules.Name(i) + ": "
                + (int)s.rect.width + "x" + (int)s.rect.height);
            Chk(LightFxRules.NaturalSizeMatches(i, s),
                "natural size != rect at " + LightFxRules.Name(i) + " (ppu tier wrong?)");
            GameObject go = new GameObject(LightFxRules.Name(i));
            SpriteRenderer sr = go.AddComponent<SpriteRenderer>();
            sr.sprite = s;
            sr.sortingOrder = LightFxRules.OrderOf(i);
            float a = LightFxRules.FamilyOf(i) == LightFxRules.FamilyStars
                ? LightFxRules.StarMountAlpha(i - LightFxRules.StarsFirst, AmbientTier.Day, 0)
                : LightFxRules.AlphaOf(i, AmbientTier.Day);   // build at the day law (disk state)
            sr.color = new Color(1f, 1f, 1f, a);
            go.transform.position = new Vector3(LightFxRules.CenterX(i), LightFxRules.CenterY(i),
                LightFxRules.ZOf(i));
        }

        static void AssertMountWiring(int i)
        {
            GameObject go = GameObject.Find(LightFxRules.Name(i));
            Chk(go != null, LightFxRules.Name(i) + " not found after build");
            SpriteRenderer sr = go.GetComponent<SpriteRenderer>();
            Chk(sr != null, LightFxRules.Name(i) + " has no renderer");
            Chk(sr.sortingOrder == LightFxRules.OrderOf(i),
                LightFxRules.Name(i) + " order != family law");
            Vector3 p = go.transform.position;
            Chk(Eq(p.x, LightFxRules.CenterX(i), 1e-4f), LightFxRules.Name(i) + " x != center");
            Chk(Eq(p.y, LightFxRules.CenterY(i), 1e-4f), LightFxRules.Name(i) + " y != center");
            Chk(Eq(p.z, LightFxRules.ZOf(i), 1e-4f), LightFxRules.Name(i) + " z != family law");
            Vector3 sc = go.transform.localScale;
            Chk(Math.Abs(sc.x - 1f) < 1e-4f && Math.Abs(sc.y - 1f) < 1e-4f,
                LightFxRules.Name(i) + " scale != 1 (natural-size build law)");
            Vector3 bs = sr.sprite.bounds.size;
            Chk(Eq(bs.x, LightFxRules.WorldW(i), 1e-4f) && Eq(bs.y, LightFxRules.WorldH(i), 1e-4f),
                LightFxRules.Name(i) + " bounds != rect");
        }

        static CityLightFx EnsureAdapter()
        {
            GameObject go = GameObject.Find("CityLightFx");
            if (go == null)
            {
                go = new GameObject("CityLightFx");
                go.AddComponent<CityLightFx>();
            }
            CityLightFx a = go.GetComponent<CityLightFx>();
            Chk(a != null, "CityLightFx component failed to resolve on its own GO (r14 stub disease)");
            return a;
        }

        static void TierBattery(CityLightFx a, AmbientTier t)
        {
            a.ApplyState(t, 0);
            for (int i = 0; i < LightFxRules.MountCount; i++)
            {
                SpriteRenderer sr = mountCache[i].GetComponent<SpriteRenderer>();
                float lawA = LightFxRules.FamilyOf(i) == LightFxRules.FamilyStars
                    ? LightFxRules.StarMountAlpha(i - LightFxRules.StarsFirst, t, 0)
                    : LightFxRules.AlphaOf(i, t);
                Chk(Eq(sr.color.a, lawA, 1e-5f), LightFxRules.Name(i) + " alpha != law at tier " + t);
                Chk(Eq(sr.color.r, 1f, 1e-5f) && Eq(sr.color.g, 1f, 1e-5f) && Eq(sr.color.b, 1f, 1e-5f),
                    LightFxRules.Name(i) + " rgb != white at tier " + t);
            }
        }

        // C4: instant law x4 tiers + the D1 blend ride (dusk -> night -> dusk)
        // r181: the fog wash rides the identical law path (asserted alongside)
        static void HorizonBattery(CityAmbient amb)
        {
            amb.ApplyAmbient(AmbientTier.Dusk);
            float lawDusk = LightFxRules.HorizonAlphaFor(AmbientTier.Dusk);   // r184: single-source (no re-pin on future alpha closure)
            AssertHorizon(amb, AmbientTier.Dusk, lawDusk);
            AssertFog(amb, AmbientTier.Dusk, 0.25f);
            amb.ApplyAmbient(AmbientTier.Dawn);
            AssertHorizon(amb, AmbientTier.Dawn, 0.35f);
            AssertFog(amb, AmbientTier.Dawn, 0f);
            amb.ApplyAmbient(AmbientTier.Day);
            AssertHorizon(amb, AmbientTier.Day, 0f);
            AssertFog(amb, AmbientTier.Day, 0f);
            amb.ApplyAmbient(AmbientTier.Night);
            AssertHorizon(amb, AmbientTier.Night, 0f);
            AssertFog(amb, AmbientTier.Night, 0f);

            // blend ride: dusk -> night eases (never hard-cuts), monotonic, settles
            amb.ApplyAmbient(AmbientTier.Dusk);   // settle at the law alpha
            amb.TransitionAmbient(AmbientTier.Night);
            Chk(amb.BlendActive, "blend not active after dusk->night transition");
            Chk(Eq(amb.CurrentHorizonAlpha, lawDusk, 1e-4f), "blend start must hold the current value");
            Chk(Eq(amb.CurrentFogAlpha, 0.25f, 1e-4f), "fog blend start must hold the current value");
            amb.StepAmbient(0.625f);   // k = 0.25
            float mid = amb.CurrentHorizonAlpha;
            Chk(mid > 0f && mid < lawDusk, "mid-blend horizon alpha not in (0, " + lawDusk + "): " + mid);
            float midFog = amb.CurrentFogAlpha;
            Chk(midFog > 0f && midFog < 0.25f, "mid-blend fog alpha not in (0, 0.25): " + midFog);
            float prev = mid;
            for (int i = 0; i < 3; i++)
            {
                amb.StepAmbient(0.625f);
                Chk(amb.CurrentHorizonAlpha <= prev + 1e-6f,
                    "horizon alpha not monotonic during the blend: " + amb.CurrentHorizonAlpha + " vs " + prev);
                Chk(amb.CurrentFogAlpha <= midFog + 1e-6f,
                    "fog alpha not monotonic during the blend");
                prev = amb.CurrentHorizonAlpha;
                midFog = amb.CurrentFogAlpha;
            }
            amb.StepAmbient(1.5f);   // cross the 2.5s window
            Chk(!amb.BlendActive, "blend should be settled");
            Chk(Eq(amb.CurrentHorizonAlpha, 0f, 1e-5f), "settled horizon alpha != night 0");
            Chk(Eq(amb.CurrentFogAlpha, 0f, 1e-5f), "settled fog alpha != night 0");
            // mid-window re-flip from the CURRENT value (r156 restart law)
            amb.TransitionAmbient(AmbientTier.Dusk);
            amb.StepAmbient(0.3f);
            Chk(amb.BlendActive, "re-flip blend not active");
            amb.StepAmbient(3.0f);
            Chk(Eq(amb.CurrentHorizonAlpha, lawDusk, 1e-5f), "settled back to dusk law alpha");
            Chk(Eq(amb.CurrentFogAlpha, 0.25f, 1e-5f), "fog settled back to dusk 0.25");
            amb.ApplyAmbient(AmbientTier.Dusk);   // leave a settled state
        }

        // r181: fog tier law face (constant mauve rgb + tier alpha)
        static void AssertFog(CityAmbient amb, AmbientTier t, float lawA)
        {
            if (fogCache == null)
                throw new InvalidOperationException("fog cache empty - CacheFog not called");
            SpriteRenderer sr = fogCache.GetComponent<SpriteRenderer>();
            Chk(Eq(sr.color.a, lawA, 1e-4f), "fog alpha != law " + lawA + " at tier " + t);
            Color fc = LightFxRules.FogWashColor();
            Chk(Eq(sr.color.r, fc.r, 1e-3f) && Eq(sr.color.g, fc.g, 1e-3f)
                && Eq(sr.color.b, fc.b, 1e-3f), "fog color != mauve family at tier " + t);
        }

        static void AssertHorizon(CityAmbient amb, AmbientTier t, float lawA)
        {
            for (int i = 0; i < LightFxRules.HorizonCount; i++)
            {
                SpriteRenderer sr = horizonCache[i].GetComponent<SpriteRenderer>();
                Chk(Eq(sr.color.a, lawA, 1e-4f),
                    "horizon " + i + " alpha != law " + lawA + " at tier " + t);
                Color pal = AmbientWheel.PaletteFor(t).skyBottom;
                Chk(Eq(sr.color.r, pal.r, 1e-3f) && Eq(sr.color.g, pal.g, 1e-3f)
                    && Eq(sr.color.b, pal.b, 1e-3f),
                    "horizon " + i + " color != palette skyBottom family at tier " + t);
            }
        }

        static GameObject[] mountCache = new GameObject[LightFxRules.MountCount];
        static GameObject[] horizonCache = new GameObject[LightFxRules.HorizonCount];
        static GameObject fogCache;   // r181: the single fog wash quad

        static void CacheMounts()
        {
            for (int i = 0; i < LightFxRules.MountCount; i++)
            {
                GameObject go = GameObject.Find(LightFxRules.Name(i));
                Chk(go != null, "mount not found for cache: " + LightFxRules.Name(i));
                mountCache[i] = go;
            }
        }

        static void CacheHorizon()
        {
            for (int i = 0; i < LightFxRules.HorizonCount; i++)
            {
                GameObject go = GameObject.Find(LightFxRules.HorizonName(i));
                Chk(go != null, "horizon not found for cache: " + LightFxRules.HorizonName(i));
                horizonCache[i] = go;
            }
        }

        static void CacheFog()
        {
            GameObject go = GameObject.Find(LightFxRules.FogWashName);
            Chk(go != null, "fog wash not found for cache");
            fogCache = go;
        }

        // r34 law: GameObject.Find cannot see INACTIVE objects - toggle through
        // the caches, or the re-activate pass silently no-ops and every later
        // render pair collapses to zero-delta (r155 first-red law).
        static void SetFogActive(bool on)
        {
            if (fogCache == null)
                throw new InvalidOperationException("fog cache empty - CacheFog not called");
            fogCache.SetActive(on);
        }

        static void SetMountsActive(bool on)
        {
            for (int i = 0; i < mountCache.Length; i++)
            {
                if (mountCache[i] == null)
                    throw new InvalidOperationException("mount cache empty at " + i + " - CacheMounts not called");
                mountCache[i].SetActive(on);
            }
        }

        static void SetHorizonActive(bool on)
        {
            for (int i = 0; i < horizonCache.Length; i++)
            {
                if (horizonCache[i] == null)
                    throw new InvalidOperationException("horizon cache empty at " + i);
                horizonCache[i].SetActive(on);
            }
        }

        // family-scoped toggles for the day-section clean attribution
        static void SetBloomActive(bool on)
        {
            for (int i = LightFxRules.BloomFirst; i < LightFxRules.BloomFirst + LightFxRules.BloomCount; i++)
                mountCache[i].SetActive(on);
        }

        static void SetNonBloomActive(bool on)
        {
            for (int i = LightFxRules.ConeFirst; i < LightFxRules.MountCount; i++)
                mountCache[i].SetActive(on);
        }

        // per-mount window delta census (mount rect + 0.15u margin)
        static void MountDelta(Texture2D on, Texture2D off, Camera cam, int i, out int litPx)
        {
            RectDelta(on, off, cam,
                LightFxRules.X0(i) - 0.15f, LightFxRules.Y0(i) - 0.15f,
                LightFxRules.X1(i) + 0.15f, LightFxRules.Y1(i) + 0.15f, out litPx);
        }

        // world-rect window delta census (clean attribution: only the toggled
        // family moves between the frames)
        static void RectDelta(Texture2D on, Texture2D off, Camera cam,
            float wx0, float wy0, float wx1, float wy1, out int litPx)
        {
            float halfH = cam.orthographicSize;
            float halfW = halfH * (1920f / 1080f);
            float cx = cam.transform.position.x, cy = cam.transform.position.y;
            int px0 = (int)(((wx0 - cx) / (2f * halfW) + 0.5f) * 1920f);
            int px1 = (int)(((wx1 - cx) / (2f * halfW) + 0.5f) * 1920f);
            int py0 = (int)(((wy0 - cy) / (2f * halfH) + 0.5f) * 1080f);
            int py1 = (int)(((wy1 - cy) / (2f * halfH) + 0.5f) * 1080f);
            px0 = Math.Max(0, px0); px1 = Math.Min(1919, px1);
            py0 = Math.Max(0, py0); py1 = Math.Min(1079, py1);
            int n = 0;
            for (int y = py0; y <= py1; y++)
                for (int x = px0; x <= px1; x++)
                {
                    Color ca = on.GetPixel(x, y), cb = off.GetPixel(x, y);
                    float d = Math.Abs(ca.r - cb.r) + Math.Abs(ca.g - cb.g) + Math.Abs(ca.b - cb.b);
                    if (d > 0.06f) n++;
                }
            litPx = n;
        }

        // r181 fog veil census: DEDICATED 0.02 threshold - the 0.25-alpha
        // veil under the 0.22 tint blends at ~0.12, so the mean veil delta
        // (~0.04) sits UNDER the family 0.06 census line; 0.02 is the
        // documented fog law (a law note, not a silent gate cut - the day and
        // night zero-leak gates stay exact-zero at ANY threshold).
        static void FogDelta(Texture2D on, Texture2D off, Camera cam, out int litPx)
        {
            float halfH = cam.orthographicSize;
            float halfW = halfH * (1920f / 1080f);
            float cx = cam.transform.position.x, cy = cam.transform.position.y;
            int px0 = (int)(((LightFxRules.FogWashX0 - cx) / (2f * halfW) + 0.5f) * 1920f);
            int px1 = (int)(((LightFxRules.FogWashX1 - cx) / (2f * halfW) + 0.5f) * 1920f);
            int py0 = (int)(((LightFxRules.FogWashY0 - cy) / (2f * halfH) + 0.5f) * 1080f);
            int py1 = (int)(((LightFxRules.FogWashY1 - cy) / (2f * halfH) + 0.5f) * 1080f);
            px0 = Math.Max(0, px0); px1 = Math.Min(1919, px1);
            py0 = Math.Max(0, py0); py1 = Math.Min(1079, py1);
            int n = 0;
            for (int y = py0; y <= py1; y++)
                for (int x = px0; x <= px1; x++)
                {
                    Color ca = on.GetPixel(x, y), cb = off.GetPixel(x, y);
                    float d = Math.Abs(ca.r - cb.r) + Math.Abs(ca.g - cb.g) + Math.Abs(ca.b - cb.b);
                    if (d > 0.02f) n++;
                }
            litPx = n;
        }

        static Texture2D Shot(Camera cam, string name)
        {
            RenderTexture rt = new RenderTexture(1920, 1080, 24, RenderTextureFormat.ARGB32);
            cam.targetTexture = rt;
            cam.Render();
            RenderTexture.active = rt;
            Texture2D tex = new Texture2D(1920, 1080, TextureFormat.ARGB32, false);
            tex.ReadPixels(new Rect(0, 0, 1920, 1080), 0, 0);
            tex.Apply();
            cam.targetTexture = null;
            RenderTexture.active = null;
            rt.Release();
            UnityEngine.Object.DestroyImmediate(rt);
            if (name != null) File.WriteAllBytes(Path.Combine(RepoRoot, "docs", "design", name), tex.EncodeToPNG());
            return tex;
        }
    }
}
