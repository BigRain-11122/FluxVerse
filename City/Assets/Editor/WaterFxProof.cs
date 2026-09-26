// FluxVerse r155 (P-20260925-09): batch proof for the water-fx engine round
// (WaterFxRules.cs mirror of Tools/city/waterfx-manifest.json - the r154
// sandbox+asset bake = single geometry source). Sentinel pattern (r34):
//   pass 1: logs/waterfx.run        -> FluxVerse.WaterFxProof.BatchRun  -> logs/waterfx.done
//   pass 2: logs/waterfx-reload.run -> FluxVerse.WaterFxProof.ReloadGate -> logs/waterfx-reload.done
// Sections:
//  A manifest mirror (headless): every law in WaterFxRules cross-checked
//    against the JSON (protocol/band/frame law+fallback/tier map/wobble/
//    orders-z/12 mount rows: paths, px, ppu, rects) + independent recompute
//    of the frame law + LIVE shimmer sign cross-check (mount center == sign
//    x in the NeonRules table, sign never the exempt family).
//  B scene build (persisted mounts - OfficeProof idempotent sweep idiom):
//    destroy any stale WaterFx* GOs, build the 12 mounts natural-size at
//    order 2 with distinct z (sibling law), wire the CityWaterFx adapter
//    (frameTiles[8] via CitySkeletonBuilder.EnsureWaterCycleTiles +
//    foamSprites[8]), census 12 + 1.
//  C law battery: census identity 606 across 10 cycling ticks (SetTile swaps
//    variants only) + per-cell law spot checks + foam frame sync + tier
//    alpha map (day/dawn 0, dusk 0.55, night 1.0, foam 1.0 always) + wobble
//    sequence normal/rain + restore.
//  D render gates (BandDiffCensus precedent, clean attribution - only the
//    mounts toggle between frames): night per-mount lit census (W2 night
//    must show), dusk presence, day zero-leak on foam-trimmed refl/shim
//    windows + day foam presence; 4 record shots (day/night/l1-south/
//    l1-north).
//  E restore + save: wobble restore, day-law alphas, foam frame-0, static
//    paint hash restore (the disk scene never learns runtime states, r124
//    law), census re-check, SaveScene.
//  F pass 2 reload: 12 mounts persist, adapter resolves with 8+8 serialized
//    refs, disk = day law + law positions + static paint, tier law re-apply,
//    neighbors resolve. Fail-loud: any broken assumption throws into the
//    .done report. ASCII. No 3D.
using System;
using System.IO;
using UnityEngine;
using UnityEngine.Tilemaps;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine.SceneManagement;

namespace FluxVerse
{
    public static class WaterFxProof
    {
        static string ProjectRoot { get { return Path.GetDirectoryName(Application.dataPath); } }
        static string RepoRoot { get { return Path.GetDirectoryName(ProjectRoot); } }
        static string RunPath { get { return Path.Combine(RepoRoot, "logs", "waterfx.run"); } }
        static string DonePath { get { return Path.Combine(RepoRoot, "logs", "waterfx.done"); } }
        static string ReloadRunPath { get { return Path.Combine(RepoRoot, "logs", "waterfx-reload.run"); } }
        static string ReloadDonePath { get { return Path.Combine(RepoRoot, "logs", "waterfx-reload.done"); } }
        static string ScenePath { get { return "Assets/Scenes/CityScene.unity"; } }
        static string ManifestPath { get { return Path.Combine(RepoRoot, "Tools", "city", "waterfx-manifest.json"); } }
        static string TileAssetDir { get { return "Assets/Art/CleanCityv3/Tiles_Auto"; } }
        static int asserts;

        // ---- manifest model (JsonUtility mirror of waterfx-manifest.json) ----
        [Serializable] class MBand { public int[] cells; public float[] world; public int bank_north_row; public int bank_south_row; }
        [Serializable] class MFrame { public string verdict; public string sequence; public string index_law; public float rate_fps; public float rate_rain_fps; public string census_identity; public string first_tick; public string fallback; }
        [Serializable] class MRefl { public string id; public string asset; public int[] px; public int ppu; public float[] rect; public string bank; }
        [Serializable] class MColors { public int[] gold; public int[] cyan; public int[] magenta; public string law; }
        [Serializable] class MShimLaw { public int[] size; public int ppu; public float[] world_size; public string mount_law; public string omitted; public MColors colors; }
        [Serializable] class MShim { public string id; public string asset; public float[] rect; public string sign; public float sign_x; public string color; public string family; }
        [Serializable] class MFoam { public string id; public string[] assets; public float[] rect; public string solid_row; public string bank; }
        [Serializable] class MFoamLaw { public int[] px; public int ppu; public float[] world_size; public int frames; public string sync; public string solid_row; }
        [Serializable] class MTier { public float day; public float dusk; public float night; public string scope; public float foam; }
        [Serializable] class MWobble { public int amp_art_px; public string law; public string scope; }
        [Serializable] class MRender { public int order; public string order_law; public string sibling_order; public MTier tier_alpha; public MWobble wobble; public string rain_law; public string night_must_show; }
        [Serializable] class MWashTier { public double day; public double dawn; public double dusk; public double night; }
        [Serializable] class MWashLaw
        {
            public string family; public string geometry; public int[] color_rgb;
            public MWashTier tier_alpha; public int order; public double z;
            public string z_law; public string wobble; public string acceptance;
        }
        [Serializable] class MWash { public string id; public float[] rect; }
        [Serializable] class MWashSec { public MWashLaw law; public MWash[] mounts; }
        [Serializable] class MRoot
        {
            public string protocol; public int baked_round;
            public MBand water_band; public MFrame frame_cycle;
            public MRefl[] reflections; public MShim[] shimmer; public MShimLaw shimmer_law;
            public MFoam[] foam; public MFoamLaw foam_law; public MRender render_laws;
            public MWashSec warm_wash;
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
            if (m == null || m.reflections == null || m.reflections.Length == 0
                || m.shimmer == null || m.foam == null
                || m.warm_wash == null || m.warm_wash.law == null || m.warm_wash.mounts == null)
                throw new InvalidOperationException("waterfx manifest unparseable: " + ManifestPath);
            return m;
        }

        // deterministic per-cell law sample set (corners + mids, both banks)
        static readonly int[] SampleX = new int[] { -50, -33, -2, 0, 17, 50, 50, -50 };
        static readonly int[] SampleY = new int[] { -3, 1, -3, 0, -1, 2, -3, 2 };

        // ---- A. manifest mirror (every WaterFxRules law vs the JSON source) ----
        static void MirrorGate(MRoot m)
        {
            Chk(m.protocol == WaterFxRules.Protocol, "protocol mismatch: " + m.protocol);
            Chk(m.baked_round == WaterFxRules.BakedRound, "baked_round mismatch");
            Chk(m.water_band != null && m.water_band.cells != null && m.water_band.cells.Length == 4,
                "band cells arity");
            Chk(m.water_band.cells[0] == WaterFxRules.CellX0 && m.water_band.cells[1] == WaterFxRules.CellX1
                && m.water_band.cells[2] == WaterFxRules.RowY0 && m.water_band.cells[3] == WaterFxRules.RowY1,
                "band cells != rules table");
            int bandCells = (m.water_band.cells[1] - m.water_band.cells[0] + 1)
                          * (m.water_band.cells[3] - m.water_band.cells[2] + 1);
            Chk(bandCells == WaterFxRules.CensusBaseline,
                "census baseline math: " + bandCells + " != " + WaterFxRules.CensusBaseline);

            // frame cycle: rates + law recompute + fallback recompute
            Chk(Eq(1f / WaterFxRules.TickSec, m.frame_cycle.rate_fps, 1e-4f), "tick sec vs rate_fps");
            Chk(Eq(1f / WaterFxRules.TickSecRain, m.frame_cycle.rate_rain_fps, 1e-4f), "rain tick sec vs rate_rain_fps");
            for (int s = 0; s < SampleX.Length; s++)
                for (int t = 0; t < 16; t++)
                {
                    int x = SampleX[s], y = SampleY[s];
                    int law = (((x * 31 + y * 17 + t) % 8) + 8) % 8;   // independent recompute
                    Chk(WaterFxRules.FrameSlotFor(x, y, t) == law,
                        "frame law recompute x=" + x + " y=" + y + " t=" + t);
                    int f = (((x * 31 + y * 17 + t) % 4) + 4) % 4;
                    int fs = f == 0 ? 0 : (f == 1 ? 2 : (f == 2 ? 3 : 4));
                    Chk(WaterFxRules.FallbackSlotFor(x, y, t) == fs,
                        "fallback law recompute x=" + x + " y=" + y + " t=" + t);
                }
            Chk(WaterFxRules.FrameTileName(5) == "t_water_5", "frame tile name map");

            // tier alpha map (closed map: day/dawn 0, dusk 0.55, night 1.0)
            Chk(Eq(m.render_laws.tier_alpha.day, WaterFxRules.TierAlpha(AmbientTier.Day), 1e-5f), "day alpha");
            Chk(Eq(m.render_laws.tier_alpha.dusk, WaterFxRules.TierAlpha(AmbientTier.Dusk), 1e-5f), "dusk alpha");
            Chk(Eq(m.render_laws.tier_alpha.night, WaterFxRules.TierAlpha(AmbientTier.Night), 1e-5f), "night alpha");
            Chk(Eq(WaterFxRules.TierAlpha(AmbientTier.Night), 1f, 1e-6f), "W2 night must show = alpha 1.0");
            Chk(Eq(WaterFxRules.TierAlpha(AmbientTier.Dawn), 0f, 1e-6f), "dawn = day family (honest note)");
            Chk(Eq(m.render_laws.tier_alpha.foam, WaterFxRules.FoamAlpha, 1e-5f), "foam alpha 1.0");
            Chk(m.render_laws.tier_alpha.scope.Contains("refl + shimmer"), "tier scope");

            // wobble: amp art px -> world step + rain doubling text
            Chk(m.render_laws.wobble.amp_art_px == 1, "wobble amp art px");
            Chk(Eq(WaterFxRules.WobbleStepU, m.render_laws.wobble.amp_art_px / 16f, 1e-6f),
                "wobble step != 1 art px @ ppu16");
            Chk(m.render_laws.rain_law.Contains("4 fps") && m.render_laws.rain_law.Contains("2"),
                "rain law text (fps 2->4, wobble 1->2)");

            // render order + sibling z law
            Chk(m.render_laws.order == WaterFxRules.SortOrder, "render order != 2");
            Chk(m.render_laws.sibling_order.Contains("water < refl < shimmer < foam"), "sibling order text");
            Chk(WaterFxRules.ReflZ > WaterFxRules.ShimmerZ && WaterFxRules.ShimmerZ > WaterFxRules.FoamZ,
                "z sibling law (smaller z = on top)");

            // reflections: 4 rows byte-for-byte
            Chk(m.reflections.Length == WaterFxRules.ReflCount, "refl count");
            for (int i = 0; i < m.reflections.Length; i++)
            {
                MRefl r = m.reflections[i];
                int ri = i;   // table rows 0..3 = refl family in manifest order
                Chk(r.id != null && ("WaterFx" + r.id) == WaterFxRules.Name(ri), "refl " + i + " id");
                Chk(r.asset == WaterFxRules.Path(ri), "refl " + i + " asset path");
                Chk(r.px[0] == WaterFxRules.PxW(ri) && r.px[1] == WaterFxRules.PxH(ri), "refl " + i + " px");
                Chk(r.ppu == (int)(WaterFxRules.At(ri).ppu), "refl " + i + " ppu");
                Chk(Eq(r.rect[0], WaterFxRules.X0(ri), 1e-5f) && Eq(r.rect[1], WaterFxRules.Y0(ri), 1e-5f)
                    && Eq(r.rect[2], WaterFxRules.X1(ri), 1e-5f) && Eq(r.rect[3], WaterFxRules.Y1(ri), 1e-5f),
                    "refl " + i + " rect");
                Chk(WaterFxRules.FamilyOf(ri) == WaterFxRules.FamilyRefl, "refl " + i + " family");
            }

            // shimmer: 6 rows + LIVE sign cross-check + family colors
            Chk(m.shimmer.Length == WaterFxRules.ShimCount, "shim count");
            Chk(m.shimmer_law.size[0] == 24 && m.shimmer_law.size[1] == 40 && m.shimmer_law.ppu == 16,
                "shim law size/ppu");
            Chk(Eq(m.shimmer_law.world_size[0], 1.5f, 1e-5f) && Eq(m.shimmer_law.world_size[1], 2.5f, 1e-5f),
                "shim law world size");
            Chk(m.shimmer_law.colors.gold[0] == 250 && m.shimmer_law.colors.gold[1] == 191
                && m.shimmer_law.colors.gold[2] == 51, "gold tint");
            Chk(m.shimmer_law.colors.cyan[0] == 51 && m.shimmer_law.colors.cyan[1] == 235
                && m.shimmer_law.colors.cyan[2] == 219, "cyan tint");
            Chk(m.shimmer_law.colors.magenta[0] == 242 && m.shimmer_law.colors.magenta[1] == 82
                && m.shimmer_law.colors.magenta[2] == 168, "magenta tint");
            for (int i = 0; i < m.shimmer.Length; i++)
            {
                MShim s = m.shimmer[i];
                int si = WaterFxRules.ReflCount + i;   // table rows 4..9
                Chk(("WaterFx" + s.id) == WaterFxRules.Name(si), "shim " + i + " id");
                Chk(s.asset == WaterFxRules.Path(si), "shim " + i + " asset");
                Chk(Eq(s.rect[0], WaterFxRules.X0(si), 1e-5f) && Eq(s.rect[1], WaterFxRules.Y0(si), 1e-5f)
                    && Eq(s.rect[2], WaterFxRules.X1(si), 1e-5f) && Eq(s.rect[3], WaterFxRules.Y1(si), 1e-5f),
                    "shim " + i + " rect");
                Chk(Eq(WaterFxRules.CenterX(si), s.sign_x, 1e-4f), "shim " + i + " mount not centered on sign x");
                Chk(s.sign == WaterFxRules.SignOf(si), "shim " + i + " sign name");
                // LIVE cross-check: the sign must exist in the NeonRules table,
                // never the exempt structure family, and sit at sign_x.
                int idx = -1;
                for (int n = 0; n < NeonRules.Count; n++) if (NeonRules.Name(n) == s.sign) { idx = n; break; }
                Chk(idx >= 0, "shim " + i + " sign not in NeonRules: " + s.sign);
                Chk(NeonRules.At(idx).mount != NeonRules.MountExempt,
                    "shim " + i + " sign is exempt structure: " + s.sign);
                Chk(Eq(NeonRules.Pos(idx).x, s.sign_x, 1e-4f),
                    "shim " + i + " sign x drift vs NeonRules: " + s.sign);
                Chk((s.color == "gold" && s.family == "QUANT")
                    || (s.color == "cyan" && s.family == "GAME")
                    || (s.color == "magenta" && s.family == "MEDIA"),
                    "shim " + i + " color/family pairing");
            }

            // foam: 2 strips + law + asset name cross-check
            Chk(m.foam.Length == WaterFxRules.FoamCount, "foam count");
            Chk(m.foam_law.px[0] == 1600 && m.foam_law.px[1] == 2 && m.foam_law.ppu == 16,
                "foam law px/ppu");
            Chk(Eq(m.foam_law.world_size[0], 100f, 1e-5f) && Eq(m.foam_law.world_size[1], 0.125f, 1e-5f),
                "foam law world size");
            Chk(m.foam_law.frames == WaterFxRules.FoamFrames, "foam frames");
            Chk(m.foam_law.sync.Contains("mod 4"), "foam sync law text");
            for (int i = 0; i < m.foam.Length; i++)
            {
                MFoam f = m.foam[i];
                int fi = WaterFxRules.ReflCount + WaterFxRules.ShimCount + i;   // rows 10..11
                bool north = f.bank == "north";
                Chk(("WaterFx" + f.id) == WaterFxRules.Name(fi), "foam " + i + " id");
                Chk(f.assets.Length == WaterFxRules.FoamFrames, "foam " + i + " frame count");
                for (int fr = 0; fr < f.assets.Length; fr++)
                    Chk(WaterFxRules.FoamAssetPath(north, fr).EndsWith(f.assets[fr]),
                        "foam " + i + " frame " + fr + " asset name");
                Chk(Eq(f.rect[0], WaterFxRules.X0(fi), 1e-5f) && Eq(f.rect[1], WaterFxRules.Y0(fi), 1e-5f)
                    && Eq(f.rect[2], WaterFxRules.X1(fi), 1e-5f) && Eq(f.rect[3], WaterFxRules.Y1(fi), 1e-5f),
                    "foam " + i + " rect");
                Chk(WaterFxRules.FoamBase(fi) == (north ? 0 : 4), "foam " + i + " sprite base");
            }

            // r181 warm wash (v0.2 manifest, duskgold-manifest.water_warm_wash)
            Chk(m.warm_wash.mounts.Length == WaterFxRules.WashCount, "wash mount count");
            Chk(m.warm_wash.law.color_rgb[0] == 255 && m.warm_wash.law.color_rgb[1] == 128
                && m.warm_wash.law.color_rgb[2] == 152, "wash rose rgb 255,128,152");
            Chk(Eq(WaterFxRules.WashTint.r, 1f, 1e-5f)
                && Eq(WaterFxRules.WashTint.g, 128f / 255f, 1e-5f)
                && Eq(WaterFxRules.WashTint.b, 152f / 255f, 1e-5f), "wash tint vs rules");
            Chk(Math.Abs(m.warm_wash.law.tier_alpha.dusk - WaterFxRules.WashAlphaFor(AmbientTier.Dusk)) < 1e-5,
                "wash dusk alpha 0.45");
            Chk(Math.Abs(m.warm_wash.law.tier_alpha.day) < 1e-6
                && Math.Abs(m.warm_wash.law.tier_alpha.dawn) < 1e-6
                && Math.Abs(m.warm_wash.law.tier_alpha.night) < 1e-6, "wash day/dawn/night zero");
            Chk(WaterFxRules.WashAlphaFor(AmbientTier.Day) == 0f
                && WaterFxRules.WashAlphaFor(AmbientTier.Dawn) == 0f
                && WaterFxRules.WashAlphaFor(AmbientTier.Night) == 0f, "wash closed set vs rules");
            Chk(m.warm_wash.law.order == WaterFxRules.SortOrder, "wash order 2");
            Chk(Math.Abs(m.warm_wash.law.z - WaterFxRules.WashZ) < 1e-6, "wash z 0.35");
            Chk(WaterFxRules.WashZ > WaterFxRules.ReflZ,
                "wash must be the DEEPEST of the order-2 family (refl 0.3 nearer = on top)");
            Chk(m.warm_wash.law.z_law.Contains("deepest"), "wash z_law text");
            float[] wrr = m.warm_wash.mounts[0].rect;
            Chk(Eq(wrr[0], WaterFxRules.WashX0, 1e-5f) && Eq(wrr[1], WaterFxRules.WashY0, 1e-5f)
                && Eq(wrr[2], WaterFxRules.WashX1, 1e-5f) && Eq(wrr[3], WaterFxRules.WashY1, 1e-5f),
                "wash rect vs rules");
            Chk(("WaterFx" + m.warm_wash.mounts[0].id) == WaterFxRules.WashName, "wash mount name");
        }

        static string Prove()
        {
            // ---- A. manifest mirror + law recompute (headless) ----
            MRoot m = LoadManifest();
            MirrorGate(m);

            // ---- B. scene build: persisted mounts + adapter wiring ----
            Scene scene = EditorSceneManager.OpenScene(ScenePath, OpenSceneMode.Single);
            if (!scene.isLoaded) throw new InvalidOperationException("CityScene failed to load");
            SweepStaleMounts();   // idempotent law (OfficeProof idiom)
            for (int i = 0; i < WaterFxRules.MountCount; i++) BuildMount(i);
            CityWaterFx adapter = EnsureAdapter();
            CitySkeletonBuilder.EnsureWaterCycleTiles();
            WireAdapter(adapter);
            Chk(MountCensus() == WaterFxRules.MountCount, "mount census after build");
            for (int i = 0; i < WaterFxRules.MountCount; i++) AssertMountWiring(i);
            CacheMounts();   // all 12 active here - the only safe Find moment (r34 law)
            adapter.EnsureRefs();
            Chk(adapter.frameTiles.Length == WaterFxRules.FrameSlots, "adapter frame tile arity");
            for (int s = 0; s < WaterFxRules.FrameSlots; s++)
                Chk(adapter.frameTiles[s] != null, "frame tile slot " + s + " unwired");
            for (int s = 0; s < 8; s++)
                Chk(adapter.foamSprites[s] != null, "foam sprite slot " + s + " unwired");

            GameObject waterGo = GameObject.Find("Water");
            Chk(waterGo != null, "Water tilemap GO missing");
            Tilemap water = waterGo.GetComponent<Tilemap>();
            Chk(water != null, "Water GO has no Tilemap");

            // ---- C. law battery ----
            // C1 census identity across cycling ticks + per-cell law spot checks
            int c0 = CountTiles(water);
            Chk(c0 == WaterFxRules.CensusBaseline, "boot census: " + c0);
            Chk(CountBandTiles(water) == WaterFxRules.CensusBaseline, "band census vs bounds census");
            for (int t = 0; t < 10; t++)
            {
                adapter.ApplyTick(t);
                int c = CountTiles(water);
                Chk(c == WaterFxRules.CensusBaseline, "census identity broke at tick " + t + ": " + c);
                for (int s = 0; s < SampleX.Length; s++)
                {
                    int x = SampleX[s], y = SampleY[s];
                    TileBase tb = water.GetTile(new Vector3Int(x, y, 0));
                    Chk(tb != null && tb.name == WaterFxRules.FrameTileName(WaterFxRules.FrameSlotFor(x, y, t)),
                        "cell law x=" + x + " y=" + y + " t=" + t + " tile=" + (tb == null ? "null" : tb.name));
                }
                int fr = ((t % WaterFxRules.FoamFrames) + WaterFxRules.FoamFrames) % WaterFxRules.FoamFrames;
                int fn = WaterFxRules.FoamIndexOf(true), fsx = WaterFxRules.FoamIndexOf(false);
                Chk(GameObject.Find(WaterFxRules.Name(fn)).GetComponent<SpriteRenderer>().sprite.name
                    == "foam-n-" + fr, "foam-n frame at tick " + t);
                Chk(GameObject.Find(WaterFxRules.Name(fsx)).GetComponent<SpriteRenderer>().sprite.name
                    == "foam-s-" + fr, "foam-s frame at tick " + t);
            }
            // C2 tier alpha map (closed census: rgb white, alpha per family law)
            TierBattery(adapter, AmbientTier.Day);
            TierBattery(adapter, AmbientTier.Dawn);
            TierBattery(adapter, AmbientTier.Dusk);
            TierBattery(adapter, AmbientTier.Night);
            // r181: the runtime warm wash joined on the first tier apply
            Chk(MountCensus() == WaterFxRules.MountCount + WaterFxRules.WashCount,
                "live mount census 13 after the tier battery (12 persisted + 1 runtime wash)");
            GameObject washGo = GameObject.Find(WaterFxRules.WashName);
            Chk(washGo != null, "warm wash missing after ApplyTier");
            Chk(washGo.transform.parent == adapter.transform, "warm wash must be an adapter child");
            SpriteRenderer washSr = washGo.GetComponent<SpriteRenderer>();
            Chk(washSr != null, "warm wash has no renderer");
            Chk(washSr.sortingOrder == WaterFxRules.SortOrder, "warm wash order 2");
            Vector3 wp = washGo.transform.position;
            Chk(Eq(wp.x, WaterFxRules.WashCenterX(), 1e-4f), "warm wash x");
            Chk(Eq(wp.y, WaterFxRules.WashCenterY(), 1e-4f), "warm wash y");
            Chk(Eq(wp.z, WaterFxRules.WashZ, 1e-5f), "warm wash z 0.35 (deepest of order 2)");
            Vector3 wbs = washSr.bounds.size;
            Chk(Eq(wbs.x, WaterFxRules.WashX1 - WaterFxRules.WashX0, 1e-3f)
                && Eq(wbs.y, WaterFxRules.WashY1 - WaterFxRules.WashY0, 1e-3f),
                "warm wash bounds == the band (relative-scale quad)");
            // C3 wobble sequence (normal + rain) + restore
            for (int t = 0; t < 4; t++)
            {
                adapter.ApplyWobble(t, false);
                float expect = t == 0 ? 0f : (t == 1 ? WaterFxRules.WobbleStepU : (t == 2 ? -WaterFxRules.WobbleStepU : 0f));
                AssertWobble(expect, "normal t=" + t);
            }
            for (int t = 0; t < 4; t++)
            {
                adapter.ApplyWobble(t, true);
                float expect = t == 0 ? 0f : (t == 1 ? WaterFxRules.WobbleStepU * 2f : (t == 2 ? -WaterFxRules.WobbleStepU * 2f : 0f));
                AssertWobble(expect, "rain t=" + t);
            }
            adapter.RestoreWobble();
            AssertWobble(0f, "restore");

            // ---- D. render gates ----
            GameObject camGo = GameObject.Find("CityCamera");
            Camera cam = camGo != null ? camGo.GetComponent<Camera>() : null;
            Chk(cam != null && cam.orthographic, "CityCamera missing");
            Vector3 origPos = cam.transform.position;
            float origSize = cam.orthographicSize;

            // D1 night must-show (W2): mounts-on vs all-off baseline
            adapter.ApplyTier(AmbientTier.Night);
            Texture2D nightOn = Shot(cam, "m1-r155-water-night.png");
            SetMountsActive(false);
            Texture2D nightOff = Shot(cam, null);
            SetMountsActive(true);
            int[] nightPx = new int[WaterFxRules.MountCount];
            for (int i = 0; i < WaterFxRules.MountCount; i++)
            {
                int lit, tot; 
                WindowDelta(nightOn, nightOff, cam, i, false, out lit, out tot);
                nightPx[i] = lit;
                int gate = i < WaterFxRules.ReflCount ? 300
                         : (i < WaterFxRules.ReflCount + WaterFxRules.ShimCount ? 100 : 1000);
                Chk(lit >= gate, "night lit census low at " + WaterFxRules.Name(i)
                    + ": px=" + lit + " gate=" + gate);
            }
            int heroIdx = 1;   // ReflQuant - the QUANT river front hero
            Chk(nightPx[heroIdx] >= 500, "night QUANT refl hero floor 500: " + nightPx[heroIdx]);
            UnityEngine.Object.DestroyImmediate(nightOn);
            UnityEngine.Object.DestroyImmediate(nightOff);

            // D2 dusk presence (alpha 0.55 - the mid band is alive, no gate tightening)
            adapter.ApplyTier(AmbientTier.Dusk);
            Texture2D duskOn = Shot(cam, null);
            SetMountsActive(false);
            Texture2D duskOff = Shot(cam, null);
            SetMountsActive(true);
            for (int i = 0; i < WaterFxRules.ReflCount; i++)
            {
                int lit, tot;
                WindowDelta(duskOn, duskOff, cam, i, false, out lit, out tot);
                Chk(lit >= 150, "dusk refl census low at " + WaterFxRules.Name(i) + ": px=" + lit);
            }
            // D2b r181: the dusk rose wash (clean attribution - only the wash
            // toggles; mounts stay constant in both frames so they cancel)
            GameObject washD2 = GameObject.Find(WaterFxRules.WashName);
            Chk(washD2 != null, "warm wash missing at the dusk gate");
            washD2.SetActive(false);
            Texture2D duskOffWash = Shot(cam, null);
            washD2.SetActive(true);
            int washLit;
            BandDelta(duskOn, duskOffWash, cam, WaterFxRules.WashX0, WaterFxRules.WashY0,
                WaterFxRules.WashX1, WaterFxRules.WashY1, out washLit);
            Chk(washLit >= 200000, "dusk warm wash census low: " + washLit);
            UnityEngine.Object.DestroyImmediate(duskOffWash);
            UnityEngine.Object.DestroyImmediate(duskOn);
            UnityEngine.Object.DestroyImmediate(duskOff);

            // D3 day zero-leak (refl/shim alpha 0 - trimmed of the foam strip) + foam presence
            adapter.ApplyTier(AmbientTier.Day);
            Texture2D dayOn = Shot(cam, "m1-r155-water-day.png");
            SetMountsActive(false);
            Texture2D dayOff = Shot(cam, null);
            SetMountsActive(true);
            for (int i = 0; i < WaterFxRules.ReflCount + WaterFxRules.ShimCount; i++)
            {
                int lit, tot;
                WindowDelta(dayOn, dayOff, cam, i, true, out lit, out tot);
                Chk(lit == 0, "day leaked reflection pixels at " + WaterFxRules.Name(i) + ": " + lit);
            }
            for (int i = WaterFxRules.ReflCount + WaterFxRules.ShimCount; i < WaterFxRules.MountCount; i++)
            {
                int lit, tot;
                WindowDelta(dayOn, dayOff, cam, i, false, out lit, out tot);
                Chk(lit >= 1000, "day foam census low at " + WaterFxRules.Name(i) + ": px=" + lit);
            }
            // r181: wash day zero-leak (alpha 0 = exact-zero delta)
            GameObject washD3 = GameObject.Find(WaterFxRules.WashName);
            washD3.SetActive(false);
            Texture2D dayOffWash = Shot(cam, null);
            washD3.SetActive(true);
            int washDayLeak;
            BandDelta(dayOn, dayOffWash, cam, WaterFxRules.WashX0, WaterFxRules.WashY0,
                WaterFxRules.WashX1, WaterFxRules.WashY1, out washDayLeak);
            Chk(washDayLeak == 0, "day warm wash zero-leak: " + washDayLeak);
            UnityEngine.Object.DestroyImmediate(dayOffWash);
            UnityEngine.Object.DestroyImmediate(dayOn);
            UnityEngine.Object.DestroyImmediate(dayOff);

            // D4 L1 street shots (night tier - reflections readable at street zoom)
            adapter.ApplyTier(AmbientTier.Night);
            cam.orthographicSize = RigMath.L1Size;
            cam.transform.position = new Vector3(0.5f, -5.0f, origPos.z);
            Texture2D l1sOn = Shot(cam, "m1-r155-water-l1-south.png");
            SetMountsActive(false);
            Texture2D l1sOff = Shot(cam, null);
            SetMountsActive(true);
            int l1Lit, l1Tot;
            WindowDelta(l1sOn, l1sOff, cam, heroIdx, false, out l1Lit, out l1Tot);
            Chk(l1Lit >= 300, "L1 south QUANT refl census: " + l1Lit);
            UnityEngine.Object.DestroyImmediate(l1sOn);
            UnityEngine.Object.DestroyImmediate(l1sOff);
            cam.transform.position = new Vector3(0.5f, 4.5f, origPos.z);
            Texture2D l1nOn = Shot(cam, "m1-r155-water-l1-north.png");
            SetMountsActive(false);
            Texture2D l1nOff = Shot(cam, null);
            SetMountsActive(true);
            WindowDelta(l1nOn, l1nOff, cam, 0, false, out l1Lit, out l1Tot);
            Chk(l1Lit >= 300, "L1 north tower refl census: " + l1Lit);
            UnityEngine.Object.DestroyImmediate(l1nOn);
            UnityEngine.Object.DestroyImmediate(l1nOff);
            cam.orthographicSize = origSize;
            cam.transform.position = origPos;

            // ---- E. restore + save (disk never learns runtime states) ----
            adapter.RestoreWobble();
            adapter.ApplyTier(AmbientTier.Day);
            adapter.SetFoamFrame(WaterFxRules.FoamIndexOf(true), 0);
            adapter.SetFoamFrame(WaterFxRules.FoamIndexOf(false), 0);
            RestoreStaticPaint(water);
            Chk(CountTiles(water) == WaterFxRules.CensusBaseline, "census after static restore");
            adapter.ReleaseWash();   // r181: the runtime wash must NOT ride the save
            Chk(GameObject.Find(WaterFxRules.WashName) == null,
                "warm wash still alive after ReleaseWash");
            Chk(MountCensus() == WaterFxRules.MountCount, "mount census before save");
            EditorSceneManager.MarkSceneDirty(scene);
            Chk(EditorSceneManager.SaveScene(scene), "SaveScene failed");

            return "asserts=" + asserts
                + " mirror(v0.2+wash, band=606, frames=8+4fallback, mounts=12+1wash)"
                + " census_identity=10ticks"
                + " night_px=[" + string.Join(",", Array.ConvertAll(nightPx, x => x.ToString())) + "]"
                + " dusk_wash=" + washLit
                + " day_leak=0 wash_day_leak=0 l1_south_quant_north_tower_gates=pass"
                + " shots=4 saved=cityscene";
        }

        static string ReloadProve()
        {
            Scene scene = EditorSceneManager.OpenScene(ScenePath, OpenSceneMode.Single);
            if (!scene.isLoaded) throw new InvalidOperationException("CityScene failed to load");
            Chk(MountCensus() == WaterFxRules.MountCount, "mount census after restart");
            Chk(GameObject.Find(WaterFxRules.WashName) == null,
                "runtime warm wash persisted into the disk scene (r146 red-chain)");
            GameObject adGo = GameObject.Find("CityWaterFx");
            Chk(adGo != null, "CityWaterFx GO missing after restart");
            CityWaterFx adapter = adGo.GetComponent<CityWaterFx>();
            Chk(adapter != null, "CityWaterFx component unresolved after restart (r14 stub disease)");
            for (int s = 0; s < WaterFxRules.FrameSlots; s++)
                Chk(adapter.frameTiles[s] != null, "frame tile slot " + s + " lost across restart");
            for (int s = 0; s < 8; s++)
                Chk(adapter.foamSprites[s] != null, "foam sprite slot " + s + " lost across restart");
            // disk state = day law + law positions + static paint (boot state)
            for (int i = 0; i < WaterFxRules.MountCount; i++)
            {
                GameObject go = GameObject.Find(WaterFxRules.Name(i));
                Chk(go != null, WaterFxRules.Name(i) + " missing after restart");
                SpriteRenderer sr = go.GetComponent<SpriteRenderer>();
                Chk(sr != null, WaterFxRules.Name(i) + " renderer lost");
                float lawA = WaterFxRules.FamilyOf(i) == WaterFxRules.FamilyFoam
                    ? WaterFxRules.FoamAlpha : WaterFxRules.TierAlpha(AmbientTier.Day);
                Chk(Eq(sr.color.a, lawA, 1e-4f), WaterFxRules.Name(i) + " disk alpha != day law");
                Chk(Eq(sr.color.r, 1f, 1e-4f) && Eq(sr.color.g, 1f, 1e-4f) && Eq(sr.color.b, 1f, 1e-4f),
                    WaterFxRules.Name(i) + " disk rgb != neutral white");
                Vector3 p = go.transform.position;
                Chk(Eq(p.x, WaterFxRules.CenterX(i), 1e-4f), WaterFxRules.Name(i) + " x != law (wobble persisted?)");
                Chk(Eq(p.y, WaterFxRules.CenterY(i), 1e-4f), WaterFxRules.Name(i) + " y != law");
                Chk(Eq(p.z, WaterFxRules.ZOf(i), 1e-4f), WaterFxRules.Name(i) + " z != family law");
                Chk(sr.sortingOrder == WaterFxRules.SortOrder, WaterFxRules.Name(i) + " order != 2");
            }
            int fn = WaterFxRules.FoamIndexOf(true), fsx = WaterFxRules.FoamIndexOf(false);
            Chk(GameObject.Find(WaterFxRules.Name(fn)).GetComponent<SpriteRenderer>().sprite.name == "foam-n-0",
                "foam-n disk sprite != frame 0");
            Chk(GameObject.Find(WaterFxRules.Name(fsx)).GetComponent<SpriteRenderer>().sprite.name == "foam-s-0",
                "foam-s disk sprite != frame 0");
            GameObject waterGo = GameObject.Find("Water");
            Tilemap water = waterGo != null ? waterGo.GetComponent<Tilemap>() : null;
            Chk(water != null, "Water tilemap missing after restart");
            Chk(CountTiles(water) == WaterFxRules.CensusBaseline, "water census after restart");
            AssertStaticPaint(water);
            // tier law re-apply after restart
            adapter.EnsureRefs();
            adapter.ApplyTier(AmbientTier.Night);
            for (int i = 0; i < WaterFxRules.MountCount; i++)
            {
                SpriteRenderer sr = GameObject.Find(WaterFxRules.Name(i)).GetComponent<SpriteRenderer>();
                float lawA = WaterFxRules.FamilyOf(i) == WaterFxRules.FamilyFoam
                    ? WaterFxRules.FoamAlpha : WaterFxRules.TierAlpha(AmbientTier.Night);
                Chk(Eq(sr.color.a, lawA, 2e-3f), WaterFxRules.Name(i) + " night law lost after restart");
            }
            // r181: the runtime wash rebuilt from the first tier apply (night law 0)
            GameObject washRe = GameObject.Find(WaterFxRules.WashName);
            Chk(washRe != null, "warm wash not rebuilt after restart");
            SpriteRenderer washReSr = washRe.GetComponent<SpriteRenderer>();
            Chk(Eq(washReSr.color.a, WaterFxRules.WashAlphaFor(AmbientTier.Night), 1e-4f),
                "warm wash night alpha lost after restart");
            Chk(Eq(washReSr.color.r, WaterFxRules.WashTint.r, 1e-5f)
                && Eq(washReSr.color.g, WaterFxRules.WashTint.g, 1e-5f)
                && Eq(washReSr.color.b, WaterFxRules.WashTint.b, 1e-5f),
                "warm wash rose tint lost after restart");
            Chk(MountCensus() == WaterFxRules.MountCount + WaterFxRules.WashCount,
                "live census 13 after the restart rebuild");
            Chk(UnityEngine.Object.FindObjectsOfType<CityInterior>().Length >= 1, "CityInterior unresolved after restart");
            Chk(UnityEngine.Object.FindObjectsOfType<CityCameraRig>().Length >= 1, "CityCameraRig unresolved after restart");
            Chk(UnityEngine.Object.FindObjectsOfType<CityAmbientAudio>().Length >= 1, "CityAmbientAudio unresolved after restart");
            Chk(UnityEngine.Object.FindObjectsOfType<CityAmbient>().Length >= 1, "CityAmbient unresolved after restart");
            GameObject camGo = GameObject.Find("CityCamera");
            Camera cam = camGo != null ? camGo.GetComponent<Camera>() : null;
            Chk(cam != null && Math.Abs(cam.orthographicSize - RigMath.L0Size) < 0.01f,
                "L0 camera broken after restart");
            return "reload_gate=OK mounts=12+1wash adapter=8+8 disk=day_law census=606 static_paint=1"
                + " wash_rebuilt=night_law neighbors=4 cam_L0=" + cam.orthographicSize.ToString("F1");
        }

        // ---- helpers ----

        static void SweepStaleMounts()
        {
            Transform[] all = UnityEngine.Object.FindObjectsOfType<Transform>();
            for (int i = 0; i < all.Length; i++)
            {
                Transform t = all[i];
                if (t == null || !t.name.StartsWith(WaterFxRules.NamePrefix)) continue;
                UnityEngine.Object.DestroyImmediate(t.gameObject);
            }
        }

        static int MountCensus()
        {
            int c = 0;
            Transform[] all = UnityEngine.Object.FindObjectsOfType<Transform>();
            for (int i = 0; i < all.Length; i++)
                if (all[i] != null && all[i].name.StartsWith(WaterFxRules.NamePrefix)) c++;
            return c;
        }

        static void BuildMount(int i)
        {
            Sprite s = AssetDatabase.LoadAssetAtPath<Sprite>(WaterFxRules.Path(i));
            Chk(s != null, "sprite import failed (fresh import should pass the postprocessor): " + WaterFxRules.Path(i));
            Chk((int)s.rect.width == WaterFxRules.PxW(i) && (int)s.rect.height == WaterFxRules.PxH(i),
                "sprite px mismatch at " + WaterFxRules.Name(i) + ": " + (int)s.rect.width + "x" + (int)s.rect.height);
            Chk(WaterFxRules.NaturalSizeMatches(i, s),
                "natural size != rect at " + WaterFxRules.Name(i) + " (ppu tier wrong?)");
            GameObject go = new GameObject(WaterFxRules.Name(i));
            SpriteRenderer sr = go.AddComponent<SpriteRenderer>();
            sr.sprite = s;
            sr.sortingOrder = WaterFxRules.SortOrder;
            sr.color = new Color(1f, 1f, 1f, WaterFxRules.FamilyOf(i) == WaterFxRules.FamilyFoam
                ? WaterFxRules.FoamAlpha : WaterFxRules.TierAlpha(AmbientTier.Day));   // build at the day law (disk state)
            go.transform.position = new Vector3(WaterFxRules.CenterX(i), WaterFxRules.CenterY(i), WaterFxRules.ZOf(i));
        }

        static void AssertMountWiring(int i)
        {
            GameObject go = GameObject.Find(WaterFxRules.Name(i));
            Chk(go != null, WaterFxRules.Name(i) + " not found after build");
            SpriteRenderer sr = go.GetComponent<SpriteRenderer>();
            Chk(sr != null, WaterFxRules.Name(i) + " has no renderer");
            Chk(sr.sortingOrder == WaterFxRules.SortOrder, WaterFxRules.Name(i) + " order != 2");
            Vector3 p = go.transform.position;
            Chk(Eq(p.x, WaterFxRules.CenterX(i), 1e-4f), WaterFxRules.Name(i) + " x != center");
            Chk(Eq(p.y, WaterFxRules.CenterY(i), 1e-4f), WaterFxRules.Name(i) + " y != center");
            Chk(Eq(p.z, WaterFxRules.ZOf(i), 1e-4f), WaterFxRules.Name(i) + " z != family law");
            Vector3 sc = go.transform.localScale;
            Chk(Math.Abs(sc.x - 1f) < 1e-4f && Math.Abs(sc.y - 1f) < 1e-4f,
                WaterFxRules.Name(i) + " scale != 1 (natural-size build law)");
            Vector3 bs = sr.sprite.bounds.size;
            Chk(Eq(bs.x, WaterFxRules.WorldW(i), 1e-4f) && Eq(bs.y, WaterFxRules.WorldH(i), 1e-4f),
                WaterFxRules.Name(i) + " bounds != rect");
        }

        static CityWaterFx EnsureAdapter()
        {
            GameObject go = GameObject.Find("CityWaterFx");
            if (go == null)
            {
                go = new GameObject("CityWaterFx");
                go.AddComponent<CityWaterFx>();
            }
            CityWaterFx a = go.GetComponent<CityWaterFx>();
            Chk(a != null, "CityWaterFx component failed to resolve on its own GO (r14 stub disease)");
            return a;
        }

        static void WireAdapter(CityWaterFx a)
        {
            for (int s = 0; s < WaterFxRules.FrameSlots; s++)
                a.frameTiles[s] = AssetDatabase.LoadAssetAtPath<Tile>(
                    TileAssetDir + "/" + WaterFxRules.FrameTileName(s) + ".asset");
            for (int f = 0; f < WaterFxRules.FoamFrames; f++)
            {
                a.foamSprites[f] = AssetDatabase.LoadAssetAtPath<Sprite>(WaterFxRules.FoamAssetPath(true, f));
                a.foamSprites[WaterFxRules.FoamFrames + f] =
                    AssetDatabase.LoadAssetAtPath<Sprite>(WaterFxRules.FoamAssetPath(false, f));
            }
            EditorUtility.SetDirty(a);
        }

        static void TierBattery(CityWaterFx a, AmbientTier t)
        {
            a.ApplyTier(t);
            for (int i = 0; i < WaterFxRules.MountCount; i++)
            {
                SpriteRenderer sr = GameObject.Find(WaterFxRules.Name(i)).GetComponent<SpriteRenderer>();
                float lawA = WaterFxRules.FamilyOf(i) == WaterFxRules.FamilyFoam
                    ? WaterFxRules.FoamAlpha : WaterFxRules.TierAlpha(t);
                Chk(Eq(sr.color.a, lawA, 1e-5f), WaterFxRules.Name(i) + " alpha != law at tier " + t);
                Chk(Eq(sr.color.r, 1f, 1e-5f) && Eq(sr.color.g, 1f, 1e-5f) && Eq(sr.color.b, 1f, 1e-5f),
                    WaterFxRules.Name(i) + " rgb != white at tier " + t);
            }
            // r181: the wash carries the rose tint + its own tier law
            GameObject wgo = GameObject.Find(WaterFxRules.WashName);
            Chk(wgo != null, "warm wash missing at tier " + t);
            SpriteRenderer wsr = wgo.GetComponent<SpriteRenderer>();
            Chk(Eq(wsr.color.a, WaterFxRules.WashAlphaFor(t), 1e-5f),
                WaterFxRules.WashName + " alpha != law at tier " + t);
            Chk(Eq(wsr.color.r, WaterFxRules.WashTint.r, 1e-5f)
                && Eq(wsr.color.g, WaterFxRules.WashTint.g, 1e-5f)
                && Eq(wsr.color.b, WaterFxRules.WashTint.b, 1e-5f),
                WaterFxRules.WashName + " rgb != rose tint at tier " + t);
        }

        static void AssertWobble(float expect, string tag)
        {
            for (int i = 0; i < WaterFxRules.MountCount; i++)
            {
                if (WaterFxRules.FamilyOf(i) == WaterFxRules.FamilyFoam) continue;
                GameObject go = GameObject.Find(WaterFxRules.Name(i));
                float x = go.transform.position.x;
                Chk(Eq(x, WaterFxRules.CenterX(i) + expect, 1e-5f),
                    WaterFxRules.Name(i) + " wobble x off (" + tag + "): " + x);
            }
        }

        static void SetMountsActive(bool on)
        {
            // r34 law: GameObject.Find cannot see INACTIVE objects - cache the
            // 12 refs once (right after the build, all active) and toggle
            // through the cache, or the re-activate pass silently no-ops and
            // every later render pair collapses to zero-delta (first-red).
            for (int i = 0; i < mountCache.Length; i++)
            {
                if (mountCache[i] == null)
                    throw new InvalidOperationException("mount cache empty at " + i + " - CacheMounts not called");
                mountCache[i].SetActive(on);
            }
        }

        static GameObject[] mountCache = new GameObject[WaterFxRules.MountCount];

        static void CacheMounts()
        {
            for (int i = 0; i < WaterFxRules.MountCount; i++)
            {
                GameObject go = GameObject.Find(WaterFxRules.Name(i));
                Chk(go != null, "mount not found for cache: " + WaterFxRules.Name(i));
                mountCache[i] = go;
            }
        }

        static int CountTiles(Tilemap tm)
        {
            int c = 0;
            BoundsInt b = tm.cellBounds;
            foreach (Vector3Int p in b.allPositionsWithin)
                if (tm.GetTile(p) != null) c++;
            return c;
        }

        static int CountBandTiles(Tilemap tm)
        {
            int c = 0;
            for (int x = WaterFxRules.CellX0; x <= WaterFxRules.CellX1; x++)
                for (int y = WaterFxRules.RowY0; y <= WaterFxRules.RowY1; y++)
                    if (tm.GetTile(new Vector3Int(x, y, 0)) != null) c++;
            return c;
        }

        // builder static law (boot state): h=((x*31+y*17)&7) over the legacy set
        static string StaticTileName(int x, int y)
        {
            int h = ((x * 31 + y * 17) & 7);
            return h == 0 ? "t_water_2" : (h == 3 ? "t_water_3" : (h == 5 ? "t_water_4" : "t_water_0"));
        }

        static void RestoreStaticPaint(Tilemap water)
        {
            for (int x = WaterFxRules.CellX0; x <= WaterFxRules.CellX1; x++)
                for (int y = WaterFxRules.RowY0; y <= WaterFxRules.RowY1; y++)
                {
                    Tile t = AssetDatabase.LoadAssetAtPath<Tile>(TileAssetDir + "/" + StaticTileName(x, y) + ".asset");
                    Chk(t != null, "static law tile missing: " + StaticTileName(x, y));
                    water.SetTile(new Vector3Int(x, y, 0), t);
                }
        }

        static void AssertStaticPaint(Tilemap water)
        {
            for (int s = 0; s < SampleX.Length; s++)
            {
                TileBase tb = water.GetTile(new Vector3Int(SampleX[s], SampleY[s], 0));
                Chk(tb != null && tb.name == StaticTileName(SampleX[s], SampleY[s]),
                    "static paint law broke at x=" + SampleX[s] + " y=" + SampleY[s]);
            }
        }

        // r181: world-rect band delta census (the wash quad has no mount-table
        // row - explicit rect, family 0.06 threshold)
        static void BandDelta(Texture2D on, Texture2D off, Camera cam,
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

        // per-mount window delta census. trimFoam = clamp the window out of
        // the foam strip (the day zero-leak windows: foam is lawfully visible
        // at day and overlaps the refl/shim bank edge by design).
        static void WindowDelta(Texture2D on, Texture2D off, Camera cam, int i, bool trimFoam,
            out int litPx, out int totalSamples)
        {
            float halfH = cam.orthographicSize;
            float halfW = halfH * (1920f / 1080f);
            float cx = cam.transform.position.x, cy = cam.transform.position.y;
            float wx0 = WaterFxRules.X0(i) - 0.15f, wx1 = WaterFxRules.X1(i) + 0.15f;
            float wy0 = WaterFxRules.Y0(i) - 0.15f, wy1 = WaterFxRules.Y1(i) + 0.15f;
            if (trimFoam)
            {
                if (WaterFxRules.Y0(i) >= 0f) wy1 = Mathf.Min(wy1, 2.85f);
                else wy0 = Mathf.Max(wy0, -2.85f);
            }
            int px0 = (int)(((wx0 - cx) / (2f * halfW) + 0.5f) * 1920f);
            int px1 = (int)(((wx1 - cx) / (2f * halfW) + 0.5f) * 1920f);
            int py0 = (int)(((wy0 - cy) / (2f * halfH) + 0.5f) * 1080f);
            int py1 = (int)(((wy1 - cy) / (2f * halfH) + 0.5f) * 1080f);
            px0 = Math.Max(0, px0); px1 = Math.Min(1919, px1);
            py0 = Math.Max(0, py0); py1 = Math.Min(1079, py1);
            int n = 0, tot = 0;
            for (int y = py0; y <= py1; y++)
                for (int x = px0; x <= px1; x++)
                {
                    Color ca = on.GetPixel(x, y), cb = off.GetPixel(x, y);
                    float d = Math.Abs(ca.r - cb.r) + Math.Abs(ca.g - cb.g) + Math.Abs(ca.b - cb.b);
                    tot++;
                    if (d > 0.06f) n++;
                }
            litPx = n; totalSamples = tot;
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
    }
}
