// FluxVerse r160 (P-20260925-09 D2): batch proof for the window-light engine
// round (WindowLightRules.cs mirror of Tools/city/windowlight-manifest.json -
// the r159 sandbox, 48 checks green, single parameter source). Sentinel
// pattern (r34):
//   pass 1: logs/windowlight.run        -> FluxVerse.WindowLightProof.BatchRun   -> logs/windowlight.done
//   pass 2: logs/windowlight-reload.run -> FluxVerse.WindowLightProof.ReloadGate -> logs/windowlight-reload.done
// Sections:
//  A manifest mirror (headless): protocol/baked_round, 8 buildings vs the
//    rules table + geometry derivation (rect == cells x rows), census 334
//    (per-building == expected), window containment + tint band + zero roof
//    windows, family rect law (art windows / plank slits / rhythm band),
//    7 mounted rects vs the LIVE NeonRules.Buildings rows (annex table-out),
//    tier map + warm-yellow color law + order/z/ppu, FNV golden vectors
//    (logs/devloop-r159-fnv-vectors.txt) + standard FNV vectors, lit-law
//    battery (monotone subsets, rate 0 / 1.0, determinism, cross-day
//    variety), zone-rate law incl. the north 'city' mean.
//  B scene build: adapter Ensure (CityWindowLight GO, zero serialized
//    fields, r124 law), mount sweep + idempotent x2, census 8, wiring
//    (position/order/z/scale-1/natural bounds == building rect).
//  C law battery: night apply -> per-building TEXTURE lit census vs the
//    proof-local FNV recompute (every window px fill/core color, unlit
//    transparent, core-row law, non-transparent census == lit art px) +
//    tier x4 alpha law (content invariant, rebuild count stable) +
//    rebuild-on (date flip -> rebuild + lit set changes; rate flip ->
//    rebuild + strict superset; same key -> zero rebuilds) + 'city' mean
//    face on the north strip.
//  D render gates (clean attribution - only the mount family toggles):
//    night per-building census (>= art-px x10), dusk presence, day
//    zero-leak (exact 0), L1 south street shot; 4 record shots.
//  E restore + save: day law, ReleaseMounts (r146 save-purity law - the
//    disk scene never learns the runtime children), census 0, SaveScene.
//  F pass 2 reload: adapter resolves, ZERO children on disk + zero global
//    WindowLight* census, full rebuild from disk state, night lit census +
//    alpha law re-applied, single-adapter census (r14 ghost check),
//    neighbors resolved, L0 camera intact.
// Fail-loud: any broken assumption throws into the .done report. ASCII. No 3D.
using System;
using System.IO;
using UnityEngine;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine.SceneManagement;

namespace FluxVerse
{
    public static class WindowLightProof
    {
        static string ProjectRoot { get { return Path.GetDirectoryName(Application.dataPath); } }
        static string RepoRoot { get { return Path.GetDirectoryName(ProjectRoot); } }
        static string RunPath { get { return Path.Combine(RepoRoot, "logs", "windowlight.run"); } }
        static string DonePath { get { return Path.Combine(RepoRoot, "logs", "windowlight.done"); } }
        static string ReloadRunPath { get { return Path.Combine(RepoRoot, "logs", "windowlight-reload.run"); } }
        static string ReloadDonePath { get { return Path.Combine(RepoRoot, "logs", "windowlight-reload.done"); } }
        static string ScenePath { get { return "Assets/Scenes/CityScene.unity"; } }
        static string ManifestPath { get { return Path.Combine(RepoRoot, "Tools", "city", "windowlight-manifest.json"); } }
        static string VectorsPath { get { return Path.Combine(RepoRoot, "logs", "devloop-r159-fnv-vectors.txt"); } }
        static int asserts;

        // ---- manifest model ----
        [Serializable] class MTier { public double day; public double dawn; public double dusk; public double night; }
        [Serializable] class MRect { public int x; public int y; public int w; public int h; }
        [Serializable] class MFamily { public string mode; public MRect[] rects; public int windows_per_cell; }
        [Serializable] class MFamilies
        {
            public MFamily t_wall_gray_a; public MFamily t_wall_gray_b; public MFamily t_wall_gray_c;
        }
        [Serializable] class MLaws
        {
            public MTier tier_alpha; public int[] fill_rgb; public int[] core_rgb;
            public int order; public double z; public int ppu; public string hash;
            public string zone_rate; public string rebuild_on;
        }
        [Serializable] class MBld
        {
            public string id; public string zone; public int[] cells_x; public int y_base;
            public int rows; public string wall_a; public string wall_b; public string roof;
            public float[] rect; public int expected_windows;
        }
        [Serializable] class MRoot
        {
            public string protocol; public int baked_round;
            public MLaws laws; public MFamilies window_families; public MBld[] buildings;
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
            MRoot m = JsonUtility.FromJson<MRoot>(File.ReadAllText(ManifestPath));
            if (m == null || m.laws == null || m.window_families == null
                || m.window_families.t_wall_gray_a == null
                || m.window_families.t_wall_gray_b == null
                || m.window_families.t_wall_gray_c == null
                || m.buildings == null || m.buildings.Length != 8)
                throw new InvalidOperationException("windowlight manifest unparseable: " + ManifestPath);
            return m;
        }

        // ---- proof-local FNV + lit law (independent recompute, PS mirror) ----
        static uint PFnv(string s)
        {
            uint h = 2166136261u;
            for (int i = 0; i < s.Length; i++) { h ^= (uint)(s[i] & 0xFF); h *= 16777619u; }
            return h;
        }
        static uint PThreshold(float rate) { return (uint)Math.Floor((double)rate * 10000.0 + 0.5); }
        static bool PLit(string bid, string date, int widx, float rate)
        { return PFnv(bid + "|" + date + "|" + widx) % 10000u < PThreshold(rate); }

        static bool[] LitSet(int b, float rate, string date)
        {
            WindowLightRules.Window[] w = WindowLightRules.WindowsOf(b);
            bool[] set = new bool[w.Length];
            for (int i = 0; i < w.Length; i++) set[i] = PLit(WindowLightRules.At(b).id, date, i, rate);
            return set;
        }
        static int LitCount(bool[] s) { int n = 0; for (int i = 0; i < s.Length; i++) if (s[i]) n++; return n; }
        static bool Subset(bool[] small, bool[] big)
        {
            for (int i = 0; i < small.Length; i++) if (small[i] && !big[i]) return false;
            return true;
        }

        // ---- A. manifest mirror (headless) ----
        static void MirrorGate(MRoot m)
        {
            Chk(m.protocol == WindowLightRules.Protocol, "protocol mismatch: " + m.protocol);
            Chk(m.baked_round == WindowLightRules.BakedRound, "baked_round mismatch");

            // tier alpha closed set
            Chk(m.laws.tier_alpha.day == 0 && m.laws.tier_alpha.dawn == 0
                && m.laws.tier_alpha.dusk == 0.55 && m.laws.tier_alpha.night == 1.0,
                "tier alpha row day/dawn 0 dusk 0.55 night 1.0");
            Chk(WindowLightRules.AlphaFor(AmbientTier.Day) == 0f, "day alpha 0");
            Chk(WindowLightRules.AlphaFor(AmbientTier.Dawn) == 0f, "dawn alpha 0");
            Chk(Eq(WindowLightRules.AlphaFor(AmbientTier.Dusk), 0.55f, 1e-6f), "dusk alpha 0.55");
            Chk(Eq(WindowLightRules.AlphaFor(AmbientTier.Night), 1f, 1e-6f), "night alpha 1.0");

            // warm-yellow color law (city-core sec.VI human windows, not a five-color functional color)
            Chk(m.laws.fill_rgb[0] == 255 && m.laws.fill_rgb[1] == 212 && m.laws.fill_rgb[2] == 130,
                "fill rgb 255,212,130");
            Chk(m.laws.core_rgb[0] == 255 && m.laws.core_rgb[1] == 236 && m.laws.core_rgb[2] == 180,
                "core rgb 255,236,180");
            Chk(WindowLightRules.Fill.r > WindowLightRules.Fill.g
                && WindowLightRules.Fill.g > WindowLightRules.Fill.b, "fill warm order r>g>b");
            Chk(WindowLightRules.Core.g > WindowLightRules.Fill.g, "core interior brighter than fill");

            // render constants
            Chk(m.laws.order == WindowLightRules.Order && m.laws.order == 3, "order 3");
            Chk(Math.Abs(m.laws.z - WindowLightRules.Z) < 1e-6 && m.laws.z == -0.5, "z -0.5");
            Chk(m.laws.z > -1.0 && m.laws.z < 0.0, "z toward camera within (-1,0)");
            Chk(m.laws.ppu == (int)WindowLightRules.Ppu && m.laws.ppu == 16, "ppu 16");

            // family rect law: gray_c art windows == gray_a rhythm; gray_b plank slits
            MFamilies f = m.window_families;
            Chk(f.t_wall_gray_c.rects.Length == 2 && f.t_wall_gray_c.windows_per_cell == 2,
                "gray_c 2 art windows");
            Chk(f.t_wall_gray_a.rects.Length == 2 && f.t_wall_gray_a.windows_per_cell == 2,
                "gray_a 2 rhythm windows");
            Chk(f.t_wall_gray_b.rects.Length == 4 && f.t_wall_gray_b.windows_per_cell == 4,
                "gray_b 4 slits");
            for (int i = 0; i < 2; i++)
            {
                MRect a = f.t_wall_gray_a.rects[i], c = f.t_wall_gray_c.rects[i];
                Chk(a.x == c.x && a.y == c.y && a.w == c.w && a.h == c.h,
                    "gray_a rhythm == gray_c art window " + i);
                Chk(c.w == 2 && c.h == 8 && c.y == 5 && (c.x == 7 || c.x == 10),
                    "gray_c art window rect " + i + " (x7/x10, band y5, 2x8)");
            }
            for (int i = 0; i < 4; i++)
            {
                MRect b2 = f.t_wall_gray_b.rects[i];
                Chk(b2.w == 1 && b2.h == 8 && b2.y == 5 && b2.x == 2 + i * 4,
                    "gray_b plank-slit rect " + i + " (x2/6/10/14, band y5, 1x8)");
            }

            // buildings vs the rules table + census + geometry derivation
            int total = 0;
            int quant = 0, gaming = 0, media = 0, city = 0;
            for (int i = 0; i < 8; i++)
            {
                MBld b = m.buildings[i];
                WindowLightRules.Building r = WindowLightRules.At(i);
                Chk(b.id == r.id, "building " + i + " id order vs rules table");
                Chk(b.zone == r.zone, b.id + " zone");
                if (b.zone == "quant") quant++; else if (b.zone == "gaming") gaming++;
                else if (b.zone == "media") media++; else if (b.zone == "city") city++;
                else Chk(false, b.id + " zone outside closed set");
                Chk(b.cells_x[0] == r.cx0 && b.cells_x[1] == r.cx1, b.id + " cells_x");
                Chk(b.y_base == r.yBase && b.rows == r.rows, b.id + " y_base/rows");
                Chk(b.wall_a == r.wallA && b.wall_b == r.wallB && b.roof == r.roof,
                    b.id + " wall/roof tiles");
                Chk(Eq(b.rect[0], r.x0, 1e-5f) && Eq(b.rect[1], r.y0, 1e-5f)
                    && Eq(b.rect[2], r.x1, 1e-5f) && Eq(b.rect[3], r.y1, 1e-5f),
                    b.id + " rect vs rules");
                // geometry derivation: rect == cells span x rows, anchored at (cells_x0, y_base)
                Chk(Eq(b.rect[2] - b.rect[0], (b.cells_x[1] - b.cells_x[0] + 1), 1e-5f),
                    b.id + " rect width != cells span");
                Chk(Eq(b.rect[3] - b.rect[1], b.rows, 1e-5f), b.id + " rect height != rows");
                Chk(Eq(b.rect[0], b.cells_x[0], 1e-5f) && Eq(b.rect[1], b.y_base, 1e-5f),
                    b.id + " rect anchor");
                // census: per-building == manifest expected (the PS sandbox's own law)
                int census = WindowLightRules.WindowCountOf(i);
                Chk(census == b.expected_windows, b.id + " census " + census
                    + " != expected " + b.expected_windows);
                total += census;
                // containment + tint band + zero roof windows
                WindowLightRules.Window[] wins = WindowLightRules.WindowsOf(i);
                foreach (WindowLightRules.Window w in wins)
                {
                    float wx0, wy0, wx1, wy1;
                    WindowLightRules.WorldRectOf(r, w, out wx0, out wy0, out wx1, out wy1);
                    Chk(wx0 >= r.x0 - 1e-5f && wx1 <= r.x1 + 1e-5f && wy0 >= r.y0 - 1e-5f
                        && wy1 <= r.y1 + 1e-5f, b.id + " window outside the building rect");
                    Chk(wy0 >= -16f - 1e-5f && wy1 <= 15f + 1e-5f,
                        b.id + " window outside the tint band -16..15");
                    Chk(w.cy <= r.yBase + r.rows - 2, b.id + " window in a roof row");
                    Chk(w.ay >= 5 && (w.ay + w.h) <= 13, b.id + " window outside band y5..12");
                }
            }
            Chk(quant == 1 && gaming == 2 && media == 1 && city == 4, "zone split 1/2/1/4");
            Chk(total == 334, "total windows == 334, got " + total);

            // 7 mounted rects == the LIVE NeonRules.Buildings rows (annex table-out)
            int matched = 0; bool annexPresent = false;
            for (int i = 0; i < 8; i++)
            {
                WindowLightRules.Building r = WindowLightRules.At(i);
                bool hit = false;
                for (int k = 0; k < 8; k++)
                {
                    NeonRules.Building nb = NeonRules.BuildingAt(k);
                    if (Eq(nb.x0, r.x0, 1e-4f) && Eq(nb.y0, r.y0, 1e-4f)
                        && Eq(nb.x1, r.x1, 1e-4f) && Eq(nb.y1, r.y1, 1e-4f)) hit = true;
                }
                if (hit) matched++;
                if (r.id == "WLGameAnnex" && hit) annexPresent = true;
            }
            Chk(matched == 7, "7 mounted rects must equal NeonRules.Buildings rows: " + matched);
            Chk(!annexPresent, "WLGameAnnex must stay table-out (Buildings rows are 8)");

            // FNV golden vectors (the r159 sandbox pinned these - C# build parity)
            Chk(File.Exists(VectorsPath), "fnv vectors file missing");
            string[] lines = File.ReadAllLines(VectorsPath);
            Chk(lines.Length == 5, "fnv vectors must be 5 lines, got " + lines.Length);
            foreach (string ln in lines)
            {
                int sp = ln.LastIndexOf(' ');
                Chk(sp > 0, "vector line malformed: " + ln);
                string key = ln.Substring(0, sp);
                uint val = uint.Parse(ln.Substring(sp + 1));
                Chk(WindowLightRules.Fnv1a(key) == val,
                    "fnv golden vector drift: " + key + " got " + WindowLightRules.Fnv1a(key));
                Chk(PFnv(key) == val, "proof-local fnv drift: " + key);
            }
            // standard FNV-1a vectors
            Chk(PFnv("") == 2166136261u, "fnv empty-basis");
            Chk(PFnv("a") == 3826002220u, "fnv 'a'");
            Chk(PFnv("foobar") == 3214735720u, "fnv 'foobar'");

            // lit-law battery on WLQuant
            int qi = WindowLightRules.IndexOf("WLQuant");
            bool[] s25 = LitSet(qi, 0.25f, "2026-09-25");
            bool[] s50 = LitSet(qi, 0.50f, "2026-09-25");
            bool[] s75 = LitSet(qi, 0.75f, "2026-09-25");
            bool[] s100 = LitSet(qi, 1.0f, "2026-09-25");
            bool[] s0 = LitSet(qi, 0.0f, "2026-09-25");
            Chk(Subset(s25, s50) && Subset(s50, s75) && Subset(s75, s100),
                "lit set monotone 0.25<=0.5<=0.75<=1.0");
            Chk(LitCount(s0) == 0, "rate 0 -> zero lit");
            Chk(LitCount(s100) == 106, "rate 1.0 -> full census 106, got " + LitCount(s100));
            bool[] s50b = LitSet(qi, 0.50f, "2026-09-25");
            for (int i = 0; i < s50.Length; i++) Chk(s50[i] == s50b[i], "lit determinism widx=" + i);
            bool[] s50d2 = LitSet(qi, 0.50f, "2026-09-26");
            bool differ = false;
            for (int i = 0; i < s50.Length; i++) if (s50[i] != s50d2[i]) differ = true;
            Chk(differ, "date seed must give cross-day variety");
            // threshold law spot checks (round-half-up)
            Chk(WindowLightRules.ThresholdFor(0f) == 0u
                && WindowLightRules.ThresholdFor(0.55f) == 5500u
                && WindowLightRules.ThresholdFor(1f) == 10000u
                && WindowLightRules.ThresholdFor(0.4f) == 4000u
                && WindowLightRules.ThresholdFor(0.33f) == 3300u, "threshold law floor(r*10000+0.5)");

            // zone-rate law incl. the north 'city' mean
            Chk(Eq(WindowLightRules.ZoneRateFor("quant", 0.7f, 0.1f, 0.2f), 0.7f, 1e-6f), "quant direct");
            Chk(Eq(WindowLightRules.ZoneRateFor("gaming", 0.7f, 0.1f, 0.2f), 0.1f, 1e-6f), "gaming direct");
            Chk(Eq(WindowLightRules.ZoneRateFor("media", 0.7f, 0.1f, 0.2f), 0.2f, 1e-6f), "media direct");
            Chk(Eq(WindowLightRules.ZoneRateFor("city", 1f, 0f, 0f), 0.33f, 1e-6f), "city mean 1/3 -> 0.33");
            Chk(Eq(WindowLightRules.ZoneRateFor("city", 1f, 1f, 1f), 1f, 1e-6f), "city mean of ones");
        }

        // ---- C helpers: texture lit census vs the proof-local recompute ----
        static int LitArtPx(int b, float rate, string date)
        {
            WindowLightRules.Building bl = WindowLightRules.At(b);
            WindowLightRules.Window[] wins = WindowLightRules.WindowsOf(b);
            int px = 0;
            for (int k = 0; k < wins.Length; k++)
                if (PLit(bl.id, date, k, rate)) px += wins[k].w * wins[k].h;
            return px;
        }

        // reads the built texture: every lit window fully painted (fill + core rows),
        // every unlit window fully transparent; returns the non-transparent census
        static int TextureCensus(int b, float rate, string date)
        {
            WindowLightRules.Building bl = WindowLightRules.At(b);
            WindowLightRules.Window[] wins = WindowLightRules.WindowsOf(b);
            Texture2D tex = adapter.MountAt(b).sprite.texture;
            Chk(tex.width == WindowLightRules.PxW(b) && tex.height == WindowLightRules.PxH(b),
                bl.id + " texture px " + tex.width + "x" + tex.height);
            int litPx = 0;
            for (int k = 0; k < wins.Length; k++)
            {
                WindowLightRules.Window w = wins[k];
                int tx0, ty0, tw, th;
                WindowLightRules.TexRectOf(bl, w, out tx0, out ty0, out tw, out th);
                bool lit = PLit(bl.id, date, k, rate);
                for (int r = 0; r < th; r++)
                {
                    for (int x = 0; x < tw; x++)
                    {
                        Color c = tex.GetPixel(tx0 + x, ty0 + r);
                        if (lit)
                        {
                            Color want = WindowLightRules.IsCoreRow(w.h, r)
                                ? WindowLightRules.Core : WindowLightRules.Fill;
                            Chk(Eq(c.r, want.r, 0.004f) && Eq(c.g, want.g, 0.004f)
                                && Eq(c.b, want.b, 0.004f) && c.a > 0.99f,
                                bl.id + " window " + k + " px color drift (row " + r + ")");
                            litPx++;
                        }
                        else
                        {
                            Chk(c.a < 0.01f, bl.id + " unlit window " + k + " leaked px");
                        }
                    }
                }
            }
            return litPx;
        }

        static CityWindowLight adapter;
        static GameObject[] mountCache = new GameObject[WindowLightRules.Count];

        static string Prove()
        {
            // ---- A. manifest mirror + law recompute (headless) ----
            MirrorGate(LoadManifest());

            // ---- B. scene build: adapter + runtime mounts (idempotent x2) ----
            Scene scene = EditorSceneManager.OpenScene(ScenePath, OpenSceneMode.Single);
            if (!scene.isLoaded) throw new InvalidOperationException("CityScene failed to load");
            adapter = EnsureAdapter();
            for (int sweep = 0; sweep < 2; sweep++)
            {
                adapter.ReleaseMounts();
                adapter.EnsureMounts();
                Chk(Census() == WindowLightRules.Count,
                    "mount census after sweep " + sweep + " (idempotent x2)");
                for (int i = 0; i < WindowLightRules.Count; i++) AssertWiring(i);
            }
            CacheMounts();

            // ---- C. law battery ----
            const string D1 = "2026-09-25";
            const string D2 = "2026-09-26";
            int baseRebuilds = adapter.RebuildCount;
            adapter.ApplyState(AmbientTier.Night, 1f, 1f, 1f, D1);
            Chk(adapter.RebuildCount == baseRebuilds + 1, "first apply must rebuild once");
            int[] artPx = new int[WindowLightRules.Count];
            int litTotal = 0;
            for (int i = 0; i < WindowLightRules.Count; i++)
            {
                int tc = TextureCensus(i, 1f, D1);
                artPx[i] = LitArtPx(i, 1f, D1);
                Chk(tc == artPx[i], WindowLightRules.At(i).id
                    + " texture lit px " + tc + " != law " + artPx[i]);
                int cells = (WindowLightRules.At(i).cx1 - WindowLightRules.At(i).cx0 + 1)
                    * (WindowLightRules.At(i).rows - 1);
                Chk(artPx[i] == cells * 32, WindowLightRules.At(i).id
                    + " rate-1.0 art px must equal wall cells x 32: " + artPx[i]);
                litTotal += tc;
            }
            Chk(litTotal == 3616, "all-lit art px == 113 wall cells x 32: " + litTotal);

            // C2 tier x4: alpha law + content invariance (zero rebuilds on tier flips)
            int rebuilds = adapter.RebuildCount;
            int nightQ = LitCount(LitSet(0, 1f, D1));
            foreach (AmbientTier t in new AmbientTier[] {
                AmbientTier.Day, AmbientTier.Dawn, AmbientTier.Dusk, AmbientTier.Night })
            {
                adapter.ApplyState(t, 1f, 1f, 1f, D1);
                float law = WindowLightRules.AlphaFor(t);
                for (int i = 0; i < WindowLightRules.Count; i++)
                {
                    SpriteRenderer sr = adapter.MountAt(i);
                    Chk(Eq(sr.color.a, law, 1e-5f), "tier " + t + " alpha law " + WindowLightRules.At(i).id);
                    Chk(Eq(sr.color.r, 1f, 1e-5f) && Eq(sr.color.g, 1f, 1e-5f)
                        && Eq(sr.color.b, 1f, 1e-5f), "tier " + t + " rgb white");
                }
            }
            Chk(adapter.RebuildCount == rebuilds,
                "tier flips must NOT rebuild textures (content-invariant alpha channel)");
            Chk(LitCount(LitSet(0, 1f, D1)) == nightQ, "lit set unchanged across tier battery");

            // C3 rebuild-on: same key -> zero rebuilds; date flip -> rebuild + set change;
            // rate flip -> rebuild + strict superset; north 'city' mean face
            rebuilds = adapter.RebuildCount;
            adapter.ApplyState(AmbientTier.Night, 1f, 1f, 1f, D1);
            Chk(adapter.RebuildCount == rebuilds, "same-key re-apply must not rebuild");
            adapter.ApplyState(AmbientTier.Night, 0.5f, 0.5f, 0.5f, D1);
            Chk(adapter.RebuildCount == rebuilds + 1, "rate flip must rebuild");
            adapter.ApplyState(AmbientTier.Night, 0.5f, 0.5f, 0.5f, D2);
            Chk(adapter.RebuildCount == rebuilds + 2, "date flip must rebuild");
            bool dayDiffer = false;
            bool[] a50 = LitSet(0, 0.5f, D1), b50 = LitSet(0, 0.5f, D2);
            for (int i = 0; i < a50.Length; i++) if (a50[i] != b50[i]) dayDiffer = true;
            Chk(dayDiffer, "date flip must change the WLQuant lit set at rate 0.5");
            Chk(TextureCensus(0, 0.5f, D2) == LitArtPx(0, 0.5f, D2),
                "texture follows the date flip (rebuild actually repaints)");
            adapter.ApplyState(AmbientTier.Night, 0.5f, 1f, 0.5f, D2);
            Chk(adapter.RebuildCount == rebuilds + 3, "gaming rate flip must rebuild");
            bool[] g50 = LitSet(1, 0.5f, D2), g100 = LitSet(1, 1f, D2);
            Chk(Subset(g50, g100) && LitCount(g100) > LitCount(g50),
                "GAME_MAIN rate 0.5 -> 1.0 must be a strict superset growth");
            // north 'city' mean: all-zero two zones -> 0.33 strip face
            adapter.ApplyState(AmbientTier.Night, 1f, 0f, 0f, D2);
            Chk(Eq(WindowLightRules.ZoneRateFor("city", 1f, 0f, 0f), 0.33f, 1e-6f), "city mean recompute");
            int nwCensus = TextureCensus(4, 0.33f, D2);
            Chk(nwCensus == LitArtPx(4, 0.33f, D2), "north strip texture == city-mean law");

            // ---- D. render gates (mount family toggles alone - clean attribution) ----
            adapter.ApplyState(AmbientTier.Night, 1f, 1f, 1f, D1);
            GameObject ambGo = GameObject.Find("CityAmbient");
            Chk(ambGo != null, "CityAmbient GO missing");
            CityAmbient amb = ambGo.GetComponent<CityAmbient>();
            Chk(amb != null, "CityAmbient component unresolved");
            amb.ApplyAmbient(AmbientTier.Night);
            GameObject camGo = GameObject.Find("CityCamera");
            Camera cam = camGo != null ? camGo.GetComponent<Camera>() : null;
            Chk(cam != null && cam.orthographic, "CityCamera missing");
            Vector3 origPos = cam.transform.position;
            float origSize = cam.orthographicSize;

            // D1 night per-building census (>= art px x 10 screen px)
            Texture2D nightOn = Shot(cam, "m1-r160-windowlight-night.png");
            SetMountsActive(false);
            Texture2D nightOff = Shot(cam, null);
            SetMountsActive(true);
            int nightSum = 0;
            for (int i = 0; i < WindowLightRules.Count; i++)
            {
                WindowLightRules.Building b = WindowLightRules.At(i);
                int lit;
                RectDelta(nightOn, nightOff, cam, b.x0 - 0.15f, b.y0 - 0.15f,
                    b.x1 + 0.15f, b.y1 + 0.15f, out lit);
                nightSum += lit;
                // L0 screen law: 27 px/u -> each 1/16u art px ~= 2.85 screen px;
                // gate = 1.8 x art px (measured ratio ~2.2, 20% headroom)
                Chk(lit >= artPx[i] * 1.8, "night census low at " + b.id
                    + ": px=" + lit + " gate=" + (artPx[i] * 1.8));
            }
            UnityEngine.Object.DestroyImmediate(nightOn);
            UnityEngine.Object.DestroyImmediate(nightOff);

            // D2 dusk presence (alpha 0.55 still visible through the dusk tint)
            amb.ApplyAmbient(AmbientTier.Dusk);
            adapter.ApplyState(AmbientTier.Dusk, 1f, 1f, 1f, D1);
            Texture2D duskOn = Shot(cam, "m1-r160-windowlight-dusk.png");
            SetMountsActive(false);
            Texture2D duskOff = Shot(cam, null);
            SetMountsActive(true);
            int duskSum = 0;
            for (int i = 0; i < WindowLightRules.Count; i++)
            {
                WindowLightRules.Building b = WindowLightRules.At(i);
                int lit;
                RectDelta(duskOn, duskOff, cam, b.x0 - 0.15f, b.y0 - 0.15f,
                    b.x1 + 0.15f, b.y1 + 0.15f, out lit);
                duskSum += lit;
                Chk(lit >= artPx[i] * 1.0, "dusk census low at " + b.id
                    + ": px=" + lit + " gate=" + artPx[i]);
            }
            UnityEngine.Object.DestroyImmediate(duskOn);
            UnityEngine.Object.DestroyImmediate(duskOff);

            // D3 day zero-leak (alpha 0 = exact zero delta on every building)
            amb.ApplyAmbient(AmbientTier.Day);
            adapter.ApplyState(AmbientTier.Day, 1f, 1f, 1f, D1);
            Texture2D dayOn = Shot(cam, "m1-r160-windowlight-day.png");
            SetMountsActive(false);
            Texture2D dayOff = Shot(cam, null);
            SetMountsActive(true);
            int dayLeak = 0;
            for (int i = 0; i < WindowLightRules.Count; i++)
            {
                WindowLightRules.Building b = WindowLightRules.At(i);
                int lit;
                RectDelta(dayOn, dayOff, cam, b.x0 - 0.15f, b.y0 - 0.15f,
                    b.x1 + 0.15f, b.y1 + 0.15f, out lit);
                dayLeak += lit;
                Chk(lit == 0, "day leaked at " + b.id + ": " + lit);
            }
            UnityEngine.Object.DestroyImmediate(dayOn);
            UnityEngine.Object.DestroyImmediate(dayOff);

            // D4 L1 south street shot (QUANT + MEDIA facades at street zoom)
            amb.ApplyAmbient(AmbientTier.Night);
            adapter.ApplyState(AmbientTier.Night, 1f, 1f, 1f, D1);
            cam.orthographicSize = RigMath.L1Size;
            cam.transform.position = new Vector3(0.5f, -5.0f, origPos.z);
            Texture2D l1On = Shot(cam, "m1-r160-windowlight-l1-south.png");
            SetMountsActive(false);
            Texture2D l1Off = Shot(cam, null);
            SetMountsActive(true);
            int l1Q;
            WindowLightRules.Building bq = WindowLightRules.At(0);
            RectDelta(l1On, l1Off, cam, bq.x0 - 0.15f, bq.y0 - 0.15f,
                bq.x1 + 0.15f, bq.y1 + 0.15f, out l1Q);
            Chk(l1Q >= 2000, "L1 south QUANT census: " + l1Q);
            UnityEngine.Object.DestroyImmediate(l1On);
            UnityEngine.Object.DestroyImmediate(l1Off);
            cam.orthographicSize = origSize;
            cam.transform.position = origPos;

            // ---- E. restore + save (disk never learns the runtime children) ----
            adapter.ApplyState(AmbientTier.Day, 1f, 1f, 1f, D1);
            adapter.ReleaseMounts();
            Chk(adapter.transform.childCount == 0, "adapter still has children after ReleaseMounts");
            Chk(Census() == 0, "global WindowLight* census must be 0 before save");
            // r162 (r146 save-purity law): the CITY AMBIENT family is runtime-only
            // too and must never ride this save - this proof's tier renders
            // created it, and the r162 pipeline order (neon BEFORE windowlight)
            // left no healing save after us: the leaked family froze a night
            // tint into the disk scene and broke the ambient D1 blend gate.
            amb.ReleaseVisuals();
            Chk(amb.transform.childCount == 0,
                "CityAmbient children not released before the save: " + amb.transform.childCount);
            EditorSceneManager.MarkSceneDirty(scene);
            Chk(EditorSceneManager.SaveScene(scene), "SaveScene failed");

            return "asserts=" + asserts
                + " mirror(8bld+census334+fnv5+litlaw) night_px_sum=" + nightSum
                + " dusk_px_sum=" + duskSum + " day_leak=" + dayLeak
                + " l1_quant=" + l1Q
                + " shots=4 saved=cityscene adapter=blank_children";
        }

        static string ReloadProve()
        {
            Scene scene = EditorSceneManager.OpenScene(ScenePath, OpenSceneMode.Single);
            if (!scene.isLoaded) throw new InvalidOperationException("CityScene failed to load");
            Chk(UnityEngine.Object.FindObjectsOfType<CityWindowLight>().Length == 1,
                "CityWindowLight census != 1 (r14 ghost disease)");
            GameObject adGo = GameObject.Find(CityWindowLight.GoName);
            Chk(adGo != null, "CityWindowLight GO missing after restart");
            adapter = adGo.GetComponent<CityWindowLight>();
            Chk(adapter != null, "CityWindowLight component unresolved after restart");
            Chk(adapter.transform.childCount == 0,
                "runtime mounts persisted into the disk scene (r146 red-chain)");
            Chk(Census() == 0, "global WindowLight* census on disk must be 0");
            // full rebuild from disk state + the night law re-applied
            adapter.ApplyState(AmbientTier.Night, 1f, 1f, 1f, "2026-09-25");
            Chk(Census() == WindowLightRules.Count, "rebuild census after restart");
            for (int i = 0; i < WindowLightRules.Count; i++)
            {
                AssertWiring(i);
                int tc = TextureCensus(i, 1f, "2026-09-25");
                Chk(tc == LitArtPx(i, 1f, "2026-09-25"),
                    WindowLightRules.At(i).id + " reload lit census " + tc);
                SpriteRenderer sr = adapter.MountAt(i);
                Chk(Eq(sr.color.a, 1f, 1e-4f), WindowLightRules.At(i).id + " night alpha after restart");
            }
            Chk(UnityEngine.Object.FindObjectsOfType<CityInterior>().Length >= 1, "CityInterior unresolved");
            Chk(UnityEngine.Object.FindObjectsOfType<CityCameraRig>().Length >= 1, "CityCameraRig unresolved");
            Chk(UnityEngine.Object.FindObjectsOfType<CityAmbientAudio>().Length >= 1, "CityAmbientAudio unresolved");
            Chk(UnityEngine.Object.FindObjectsOfType<CityWaterFx>().Length >= 1, "CityWaterFx unresolved");
            Chk(UnityEngine.Object.FindObjectsOfType<CityLightFx>().Length >= 1, "CityLightFx unresolved");
            Chk(UnityEngine.Object.FindObjectsOfType<CityStreetBehavior>().Length >= 1, "CityStreetBehavior unresolved");
            GameObject camGo = GameObject.Find("CityCamera");
            Camera cam = camGo != null ? camGo.GetComponent<Camera>() : null;
            Chk(cam != null && Math.Abs(cam.orthographicSize - RigMath.L0Size) < 0.01f,
                "L0 camera broken after restart");
            return "reload_gate=OK mounts=8 adapter=resolved disk_children=0 rebuilt=night_law"
                + " lit_windows=334 art_px=3616 neighbors=6 cam_L0=" + cam.orthographicSize.ToString("F1");
        }

        // ---- helpers ----

        static CityWindowLight EnsureAdapter()
        {
            GameObject go = GameObject.Find(CityWindowLight.GoName);
            if (go == null)
            {
                go = new GameObject(CityWindowLight.GoName);
                go.AddComponent<CityWindowLight>();
            }
            CityWindowLight a = go.GetComponent<CityWindowLight>();
            Chk(a != null, "CityWindowLight component failed to resolve (r14 stub disease)");
            return a;
        }

        static int Census()
        {
            int c = 0;
            Transform[] all = UnityEngine.Object.FindObjectsOfType<Transform>();
            for (int i = 0; i < all.Length; i++)
                if (all[i] != null && all[i].name.StartsWith(WindowLightRules.MountPrefix)) c++;
            return c;
        }

        static void AssertWiring(int i)
        {
            GameObject go = GameObject.Find(WindowLightRules.MountName(i));
            Chk(go != null, WindowLightRules.MountName(i) + " not found");
            SpriteRenderer sr = go.GetComponent<SpriteRenderer>();
            Chk(sr != null, WindowLightRules.MountName(i) + " has no renderer");
            Chk(sr.sortingOrder == WindowLightRules.Order,
                WindowLightRules.MountName(i) + " order != 3");
            Vector3 p = go.transform.position;
            Chk(Eq(p.x, WindowLightRules.CenterX(i), 1e-4f), WindowLightRules.MountName(i) + " x");
            Chk(Eq(p.y, WindowLightRules.CenterY(i), 1e-4f), WindowLightRules.MountName(i) + " y");
            Chk(Eq(p.z, WindowLightRules.Z, 1e-4f), WindowLightRules.MountName(i) + " z");
            Vector3 sc = go.transform.localScale;
            Chk(Math.Abs(sc.x - 1f) < 1e-4f && Math.Abs(sc.y - 1f) < 1e-4f,
                WindowLightRules.MountName(i) + " scale != 1 (natural-size law)");
            Chk(go.transform.parent == adapter.transform,
                WindowLightRules.MountName(i) + " must be an adapter child (runtime family)");
            Chk(sr.sprite != null, WindowLightRules.MountName(i) + " sprite missing");
            Vector3 bs = sr.sprite.bounds.size;
            Chk(Eq(bs.x, WindowLightRules.At(i).x1 - WindowLightRules.At(i).x0, 1e-4f)
                && Eq(bs.y, WindowLightRules.At(i).y1 - WindowLightRules.At(i).y0, 1e-4f),
                WindowLightRules.MountName(i) + " bounds != building rect");
        }

        // r34 law: Find skips INACTIVE objects - cache then toggle through the cache
        static void CacheMounts()
        {
            for (int i = 0; i < WindowLightRules.Count; i++)
            {
                GameObject go = GameObject.Find(WindowLightRules.MountName(i));
                Chk(go != null, "mount not found for cache: " + WindowLightRules.MountName(i));
                mountCache[i] = go;
            }
        }

        static void SetMountsActive(bool on)
        {
            for (int i = 0; i < mountCache.Length; i++)
            {
                if (mountCache[i] == null)
                    throw new InvalidOperationException("mount cache empty at " + i);
                mountCache[i].SetActive(on);
            }
        }

        // world-rect window delta census (clean attribution: only the mounts toggle)
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
