// FluxVerse P-23(2) r42: batch proof for the street bubble layer (the render
// slice closing P-23). Sentinel pattern (r36/r40/r41 style):
//   pass 1: logs/bubbles.run         -> FluxVerse.ResidentBubbleProof.BatchRun   -> logs/bubbles.done
//   pass 2: logs/bubbles-reload.run  -> FluxVerse.ResidentBubbleProof.ReloadGate -> logs/bubbles-reload.done
// Sections:
//  A pure-rule gates: constants, Pos derived from the nameplate top (single
//    source, zero copied coordinates), every resident's bubble inside the tint
//    band, and - r110 MountX law - a WIDEST manifest-width bubble clamped to
//    the static L0 window stays fully in view at every seat, while seats
//    already inside the horizon never move.
//  B bake-manifest gates (dual implementation): manifest parses (1080 entries
//    at the v1.8 water level; the count is derived from the pool, never pinned -
//    r109 bake law), unique keys, ppu24/pxH36/padX12); every pool line
//    (residents-barks.json,
//    re-collected here) has an entry whose key == ResidentBarks.LineKey(line)
//    BYTE-FOR-BYTE (the PS bake and the C# core are separate implementations
//    of the same md5 law - agreement proves the law, r39 pattern) and whose
//    file exists; manifest set == pool set exactly.
//  C byte-path gates: every manifest texture loads via CityBubbles.LoadBubbleSprite
//    (File.ReadAllBytes+LoadImage, r18 BannerData law), natural bounds ==
//    manifest w/24 x 1.5u, point filter; 3 spot files get deep pixel gates
//    (text band lit / tail column / frame corners / dark-glass interior /
//    transparent outside).
//  D mount-law gates (pure, today real): per each of the 12 canon contexts the
//    budgeted speaker set applies the rank-head-wins overlap policy and stays
//    <=2 and strictly non-overlapping, deterministic across recomputes; the
//    morning context runs all 32 slots and must rotate >=3 distinct speakers.
//  E CityScene wiring: CityBubbles component on its own GO, idempotent, saved,
//    reloaded from disk, neighbors intact (r31-r40 regressions), ZERO
//    persisted BarkBubble* (runtime-only law).
//  F render gates (real CityScene, dusk + night): bubbles mounted through the
//    adapter == the law's expected set (coupling gate), per-bubble window
//    deltas vs a released baseline, night luminance < dusk (atmosphere law),
//    release-clean returns to baseline, screenshots saved for the multimodal
//    face; final disk reopen still has zero BarkBubble*.
//  G degrade gates: fake dir / bogus key / unknown ctx -> honest silence.
//  H mood-face gates (r144): mood mount through the adapter - festive
//    injected state, per-speaker weighted lottery pick reproduced from the
//    law (seed = id|date||mood), domain stays {fact, festival, market_open},
//    <=2 rationing; null mood = the pre-mood fact-ctx law.
// Fail-loud: any broken assumption throws into the .done report. ASCII. No 3D.
using System;
using System.Collections.Generic;
using System.IO;
using System.Security.Cryptography;
using UnityEngine;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine.SceneManagement;
using UnityEngine.Tilemaps;

namespace FluxVerse
{
    [Serializable] class BubbleManifestEntry
    {
        public string key; public string file; public int w; public int chars; public string line;
    }
    [Serializable] class BubbleManifest
    {
        public string law; public int ppu; public int pxH; public int padX; public string font;
        public BubbleManifestEntry[] files;
    }

    public static class ResidentBubbleProof
    {
        static string ProjectRoot { get { return Path.GetDirectoryName(Application.dataPath); } }
        static string RepoRoot { get { return Path.GetDirectoryName(ProjectRoot); } }
        static string RunPath { get { return Path.Combine(RepoRoot, "logs", "bubbles.run"); } }
        static string DonePath { get { return Path.Combine(RepoRoot, "logs", "bubbles.done"); } }
        static string ReloadRunPath { get { return Path.Combine(RepoRoot, "logs", "bubbles-reload.run"); } }
        static string ReloadDonePath { get { return Path.Combine(RepoRoot, "logs", "bubbles-reload.done"); } }
        static string ShaPath { get { return Path.Combine(RepoRoot, "logs", "bubbles-sha.txt"); } }
        static string ScenePath { get { return "Assets/Scenes/CityScene.unity"; } }
        static string BubbleDir { get { return Path.Combine(ProjectRoot, "BubbleData"); } }
        static int asserts;

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
                File.WriteAllText(DonePath, "FAIL " + e.GetType().Name + ": " + e.Message + " | " + e.StackTrace
                    + " ts=" + DateTime.UtcNow.ToString("o"));
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
                File.WriteAllText(ReloadDonePath, "FAIL " + e.GetType().Name + ": " + e.Message + " | " + e.StackTrace
                    + " ts=" + DateTime.UtcNow.ToString("o"));
            }
            finally { if (File.Exists(ReloadRunPath)) File.Delete(ReloadRunPath); }
        }

        static void Chk(bool ok, string what)
        {
            if (!ok) throw new InvalidOperationException("ASSERT FAIL: " + what);
            asserts++;
        }

        // ---- shared law helpers ----

        static string ManifestPath() { return Path.Combine(BubbleDir, "manifest.json"); }

        static BubbleManifest LoadManifest()
        {
            if (!File.Exists(ManifestPath())) throw new InvalidOperationException("manifest missing: " + ManifestPath());
            BubbleManifest m = JsonUtility.FromJson<BubbleManifest>(File.ReadAllText(ManifestPath(), System.Text.Encoding.UTF8));
            if (m == null || m.files == null || m.files.Length == 0)
                throw new InvalidOperationException("manifest unparsable/empty");
            return m;
        }

        // unique pool lines + the roster id->street-index map, from the live data
        static void CollectPool(ResidentBarksFile f, HashSet<string> lines, Dictionary<string, int> roster)
        {
            for (int a = 0; a < f.axes.Length; a++)
            {
                BarkAxis ax = f.axes[a];
                if (ax == null || ax.contexts == null) continue;
                for (int c = 0; c < ax.contexts.Length; c++)
                {
                    BarkBucket b = ax.contexts[c];
                    if (b == null || b.lines == null) continue;
                    for (int i = 0; i < b.lines.Length; i++) lines.Add(b.lines[i]);
                }
            }
            for (int r = 0; r < f.residents.Length; r++)
                if (f.residents[r] != null) roster[f.residents[r].id] = f.residents[r].slot;
        }

        class Mounted
        {
            public string id; public string line; public int idx; public Vector2 center; public float w, h;
        }

        // proof-local replica of the adapter policy (rank order, strict-overlap
        // drop) using manifest widths - gates the LAW on real data; the adapter
        // coupling is gated separately in section F.
        static List<Mounted> ExpectedSet(ResidentBarksFile f, Dictionary<string, int> widthByKey,
            Dictionary<string, int> roster, string date, string ctx, int slot)
        {
            List<Mounted> set = new List<Mounted>();
            List<Rect> rects = new List<Rect>();
            string[] ids = ResidentBarks.BudgetedSpeakersFrom(f, date, ctx, slot);
            for (int k = 0; k < ids.Length; k++)
            {
                string line = ResidentBarks.PickFrom(f, ids[k], date, ctx);
                if (string.IsNullOrEmpty(line)) continue;
                int idx; if (!roster.TryGetValue(ids[k], out idx)) continue;
                string key = ResidentBarks.LineKey(line);
                int wpx;
                if (key == null || !widthByKey.TryGetValue(key, out wpx))
                    throw new InvalidOperationException("picked line has no manifest width: ctx=" + ctx + " id=" + ids[k]);
                float w = wpx / ResidentBubbleRules.PPU;
                Vector2 c = ResidentBubbleRules.Pos(idx);
                c.x = ResidentBubbleRules.MountX(idx, w, RigMath.L0Size * RigMath.Aspect);
                Rect r = new Rect(c.x - w / 2f, c.y - ResidentBubbleRules.WorldH / 2f, w, ResidentBubbleRules.WorldH);
                bool clash = false;
                for (int j = 0; j < rects.Count; j++)
                    if (ResidentBubbleRules.RectsOverlap(r, rects[j])) { clash = true; break; }
                if (clash) continue;
                rects.Add(r);
                set.Add(new Mounted { id = ids[k], line = line, idx = idx, center = c, w = w, h = ResidentBubbleRules.WorldH });
            }
            return set;
        }

        // ---- pass 1 ----

        static string Prove()
        {
            DateTime now = DateTime.Now;
            string today = now.ToString("yyyy-MM-dd");
            int slotNow = (now.Hour * 60 + now.Minute) / 45;

            // ---- A. pure-rule gates ----
            Chk(Math.Abs(ResidentBubbleRules.PPU - 24f) < 1e-5f, "PPU must be 24 (nameplate density law)");
            Chk(ResidentBubbleRules.Order == 13, "order must be 13 (drops 12 < bubbles 13 < banner 20)");
            Chk(ResidentBubbleRules.PxH == 36 && Math.Abs(ResidentBubbleRules.WorldH - 1.5f) < 1e-5f,
                "uniform canvas law 36px = 1.5u");
            Chk(Math.Abs(ResidentBubbleRules.GapFromTag - 0.15f) < 1e-5f, "gap law 0.15u");
            Chk(ResidentBubbleRules.Prefix == "BarkBubble", "GO prefix law");
            for (int i = 0; i < ResidentRules.Count; i++)
            {
                Vector2 p = ResidentBubbleRules.Pos(i);
                Vector2 tag = ResidentTagRules.Pos(i);
                float tagTop = tag.y + ResidentTagRules.WorldH / 2f;
                Chk(Math.Abs(p.x - tag.x) < 1e-5f, "bubble x must derive from the nameplate at " + i);
                Chk(Math.Abs((p.y - ResidentBubbleRules.WorldH / 2f) - (tagTop + ResidentBubbleRules.GapFromTag)) < 1e-4f,
                    "tail must hover GapFromTag above the plate top at " + i);
                Chk(ResidentBubbleRules.InTintBand(i), "bubble escapes the tint band at " + i);
            }

            // ---- B. manifest gates (dual implementation, pool-count keys) ----
            BubbleManifest m = LoadManifest();
            Chk(m.law == "resident-bubble-bake/1", "manifest law tag");
            Chk(m.ppu == 24 && m.pxH == 36 && m.padX == 12, "manifest canvas law ppu24/pxH36/padX12");
            Dictionary<string, int> widthByKey = new Dictionary<string, int>();
            Dictionary<string, string> lineByKey = new Dictionary<string, string>();
            int maxW = 0;
            foreach (BubbleManifestEntry e in m.files)
            {
                Chk(e != null && !string.IsNullOrEmpty(e.key) && !string.IsNullOrEmpty(e.line), "manifest entry shape");
                Chk(e.file == "bark-" + e.key + ".png", "manifest file name law: " + e.file);
                Chk(e.chars == e.line.Length, "manifest chars law");
                Chk(e.w >= 64 && e.w <= 344, "manifest width bounds: " + e.w);   // bake law: fmtW<=320 + 2*padX12
                Chk(File.Exists(Path.Combine(BubbleDir, e.file)), "texture absent: " + e.file);
                string ck = ResidentBarks.LineKey(e.line);
                Chk(ck != null && ck == e.key, "dual-impl key law: C# LineKey != bake key for a pool line");
                if (!widthByKey.ContainsKey(e.key)) { widthByKey[e.key] = e.w; lineByKey[e.key] = e.line; }
                else Chk(false, "duplicate manifest key: " + e.key);
                if (e.w > maxW) maxW = e.w;
                Chk(!System.Text.RegularExpressions.Regex.IsMatch(e.line, "[0-9]"), "digit in a pool line (honesty law)");
            }
            ResidentBarksFile f = ResidentBarks.Load(true);
            Chk(f != null, "barks substrate absent (r41 data must be present)");
            HashSet<string> pool = new HashSet<string>();
            Dictionary<string, int> roster = new Dictionary<string, int>();
            CollectPool(f, pool, roster);
            Chk(pool.Count > 0, "pool empty");
            Chk(m.files.Length == pool.Count, "manifest entries != unique pool lines (v1.8 water level): "
                + m.files.Length + " vs " + pool.Count);
            Chk(roster.Count == ResidentBarks.RosterCount, "roster != " + ResidentBarks.RosterCount
                + " narrative street seats: " + roster.Count);
            foreach (string line in pool)
                Chk(lineByKey.ContainsKey(ResidentBarks.LineKey(line)), "pool line missing from manifest bake");
            foreach (BubbleManifestEntry e in m.files)
                Chk(pool.Contains(e.line), "manifest line not in pool (bake/pool drift)");
            // widest-line framing (r110 MountX law): a widest bubble CLAMPED to
            // the static L0 window stays fully in view at every seat; seats
            // already inside the horizon keep their exact seat x (the clamp
            // never moves a bubble that already fits). InView remains the
            // seat-level horizon classifier (raw seat position).
            float widest = maxW / ResidentBubbleRules.PPU;
            float halfW0 = RigMath.L0Size * RigMath.Aspect;
            int displaced = 0;
            for (int i = 0; i < ResidentRules.Count; i++)
            {
                float mx = ResidentBubbleRules.MountX(i, widest, halfW0);
                Chk(Math.Abs(mx) + widest / 2f <= halfW0 - 0.29f,
                    "clamped widest bubble escapes the L0 view at " + i);
                if (ResidentBubbleRules.InView(i, widest, halfW0, RigMath.L0Size))
                    Chk(mx == ResidentBubbleRules.Pos(i).x, "clamp displaced an in-view seat at " + i);
                else displaced++;
            }

            // ---- C. byte-path gates (all manifest keys + deep pixel spots) ----
            int loaded = 0;
            List<string> keysSorted = new List<string>(widthByKey.Keys);
            keysSorted.Sort(StringComparer.Ordinal);
            foreach (string key in keysSorted)
            {
                Sprite sp = CityBubbles.LoadBubbleSprite(BubbleDir, key);
                Chk(sp != null, "byte load failed: " + key);
                if (sp == null) continue;
                int wpx = widthByKey[key];
                Chk(Math.Abs(sp.bounds.size.x - wpx / 24f) < 0.02f && Math.Abs(sp.bounds.size.y - 1.5f) < 0.02f,
                    "natural bounds != manifest size at " + key);
                Chk(sp.texture.filterMode == FilterMode.Point, "point filter lost at " + key);
                loaded++;
            }
            Chk(loaded == m.files.Length, "loaded != manifest count: " + loaded + " vs " + m.files.Length);
            // deep pixel gates on 3 spots (first/middle/last by ordinal key)
            string[] spots = { keysSorted[0], keysSorted[keysSorted.Count / 2], keysSorted[keysSorted.Count - 1] };
            foreach (string key in spots)
            {
                Sprite sp = CityBubbles.LoadBubbleSprite(BubbleDir, key);
                Chk(sp != null, "spot load failed: " + key);
                Texture2D t = sp.texture;
                // PNG row order is top-down, but texture GetPixel row 0 is the
                // BOTTOM (r13 law): read via ty = H-1-pngY or every gate lands
                // on the flipped half (first run caught the corners in the tail).
                int W = t.width, H = t.height, cx = W / 2;
                int lit = 0;
                for (int py = 8; py <= 14; py += 2)
                    for (int x = 2; x < W - 2; x += 4)
                        if (t.GetPixel(x, H - 1 - py).a >= 0.78f) lit++;
                Chk(lit >= 8, "spot text band not lit (tofu suspect) at " + key + ": " + lit);
                int tail = 0;
                for (int py = 29; py <= 34; py++) if (t.GetPixel(cx, H - 1 - py).a >= 0.39f) tail++;
                Chk(tail >= 3, "spot tail missing at " + key + ": " + tail);
                Chk(t.GetPixel(0, H - 1).a >= 0.78f && t.GetPixel(W - 1, H - 1).a >= 0.78f
                    && t.GetPixel(0, H - 1 - 27).a >= 0.78f && t.GetPixel(W - 1, H - 1 - 27).a >= 0.78f,
                    "spot frame corners missing at " + key);
                Chk(t.GetPixel(3, H - 1 - 20).a >= 0.39f, "spot dark-glass interior missing at " + key);
                Chk(t.GetPixel(0, H - 1 - 30).a == 0f, "spot transparency leak at " + key);
                UnityEngine.Object.DestroyImmediate(t);
            }

            // ---- D. mount-law gates (real data, all 12 contexts + 32 slots) ----
            foreach (string ctx in ResidentBarks.ContextCanon)
            {
                List<Mounted> set = ExpectedSet(f, widthByKey, roster, today, ctx, 0);
                List<Mounted> again = ExpectedSet(f, widthByKey, roster, today, ctx, 0);
                Chk(set.Count >= 1 && set.Count <= ResidentBarks.MaxBubblesPerScreen,
                    "mounted count out of law for ctx " + ctx + ": " + set.Count);
                Chk(set.Count == again.Count, "policy not deterministic for ctx " + ctx);
                for (int i = 0; i < set.Count; i++) Chk(set[i].line == again[i].line, "policy order drift at " + ctx);
                for (int i = 0; i < set.Count; i++)
                    for (int j = i + 1; j < set.Count; j++)
                        Chk(!ResidentBubbleRules.RectsOverlap(
                            new Rect(set[i].center.x - set[i].w / 2f, set[i].center.y - set[i].h / 2f, set[i].w, set[i].h),
                            new Rect(set[j].center.x - set[j].w / 2f, set[j].center.y - set[j].h / 2f, set[j].w, set[j].h)),
                            "policy leaked an overlapping pair at " + ctx);
            }
            HashSet<string> rot = new HashSet<string>();
            for (int s = 0; s < 32; s++)
            {
                List<Mounted> set = ExpectedSet(f, widthByKey, roster, today, "morning", s);
                Chk(set.Count >= 1 && set.Count <= ResidentBarks.MaxBubblesPerScreen, "slot " + s + " count out of law");
                foreach (Mounted mb in set) rot.Add(mb.id);
            }
            Chk(rot.Count >= 3, "45-min slots do not rotate the voices: " + rot.Count);

            // ---- E. CityScene wiring (idempotent) + neighbor regressions ----
            Scene scene = EditorSceneManager.OpenScene(ScenePath, OpenSceneMode.Single);
            Chk(scene.isLoaded, "CityScene failed to open");
            EnsureWired();
            EnsureWired();   // idempotency
            Chk(UnityEngine.Object.FindObjectsOfType<CityBubbles>().Length == 1, "CityBubbles count != 1 after wiring");
            bool saved = EditorSceneManager.SaveScene(scene);
            Chk(saved, "scene save failed");
            Scene reopened = EditorSceneManager.OpenScene(ScenePath, OpenSceneMode.Single);
            CityBubbles cb = UnityEngine.Object.FindObjectsOfType<CityBubbles>().Length > 0
                ? UnityEngine.Object.FindObjectsOfType<CityBubbles>()[0] : null;
            Chk(cb != null, "CityBubbles lost on disk round-trip");
            Chk(CountPrefix(ResidentBubbleRules.Prefix) == 0, "BarkBubble persisted into the saved scene (runtime-only law)");
            NeighborRegressions();

            // ---- F. render gates (dusk + night, adapter coupling) ----
            GameObject ambGo = GameObject.Find("CityAmbient");
            CityAmbient amb = ambGo != null ? ambGo.GetComponent<CityAmbient>() : null;
            Chk(amb != null, "CityAmbient missing for render gates");
            amb.EnsureVisuals();
            GameObject camGo = GameObject.Find("CityCamera");
            Camera cam = camGo != null ? camGo.GetComponent<Camera>() : null;
            Chk(cam != null, "CityCamera missing for render gates");

            List<Mounted> exp = ExpectedSet(f, widthByKey, roster, today, "morning", slotNow);
            Chk(exp.Count >= 1, "expected set empty for the render slot");

            amb.ApplyAmbient(AmbientTier.Dusk);
            cb.Release();
            Texture2D duskBase = Shot(cam, null);
            cb.Refresh(today, "morning", slotNow);
            Chk(cb.BubbleCount == exp.Count, "adapter count != law count: " + cb.BubbleCount + " vs " + exp.Count);
            for (int i = 0; i < exp.Count; i++)
            {
                Chk(cb.MountedLine(i) == exp[i].line, "adapter line != law line at " + i + " (coupling)");
                Rect mr = cb.MountedRect(i);
                Chk(Math.Abs(mr.xMin - (exp[i].center.x - exp[i].w / 2f)) < 1e-3f
                    && Math.Abs(mr.yMin - (exp[i].center.y - ResidentBubbleRules.WorldH / 2f)) < 1e-3f
                    && Math.Abs(mr.width - exp[i].w) < 1e-3f,
                    "adapter mount rect != law rect at " + i + " (MountX coupling)");
            }
            Texture2D duskOn = Shot(cam, "m1-r110-bubbles-dusk.png");
            int duskTot = 0; float duskLum = 0f;
            int duskMin = int.MaxValue; string duskWorst = "";
            for (int i = 0; i < exp.Count; i++)
            {
                int n; float lum;
                WinDelta(duskOn, duskBase, cam, exp[i].center, exp[i].w, exp[i].h, out n, out lum);
                duskTot += n; duskLum += lum * n;
                if (n < duskMin) { duskMin = n; duskWorst = exp[i].id; }
            }
            duskLum = duskTot > 0 ? duskLum / duskTot : 0f;
            Chk(duskTot >= 400, "dusk bubble delta too sparse: " + duskTot);
            Chk(duskMin >= 100, "dusk invisible bubble " + duskWorst + ": " + duskMin);

            amb.ApplyAmbient(AmbientTier.Night);
            cb.Release();
            Texture2D nightBase = Shot(cam, null);
            cb.Refresh(today, "morning", slotNow);
            Chk(cb.BubbleCount == exp.Count, "adapter count drifted at night");
            Texture2D nightOn = Shot(cam, "m1-r110-bubbles-night.png");
            int nightTot = 0; float nightLum = 0f;
            int nightMin = int.MaxValue; string nightWorst = "";
            for (int i = 0; i < exp.Count; i++)
            {
                int n; float lum;
                WinDelta(nightOn, nightBase, cam, exp[i].center, exp[i].w, exp[i].h, out n, out lum);
                nightTot += n; nightLum += lum * n;
                if (n < nightMin) { nightMin = n; nightWorst = exp[i].id; }
            }
            nightLum = nightTot > 0 ? nightLum / nightTot : 0f;
            Chk(nightTot >= 200, "night bubble delta too sparse: " + nightTot);
            Chk(nightMin >= 50, "night invisible bubble " + nightWorst + ": " + nightMin);
            Chk(nightLum < duskLum, "night bubbles must sit under dusk (atmosphere law): "
                + nightLum.ToString("F3") + " vs " + duskLum.ToString("F3"));

            // release-clean: the layer must leave the frame exactly as it found it
            // (ambient is Night here - compare against the NIGHT baseline, not the
            // dusk one, or the whole window measures the tier tint instead)
            cb.Release();
            Chk(cb.BubbleCount == 0, "release did not clear the mounted set");
            Texture2D clean = Shot(cam, null);
            int cleanTot = 0;
            for (int i = 0; i < exp.Count; i++)
            {
                int n; float lum;
                WinDelta(clean, nightBase, cam, exp[i].center, exp[i].w, exp[i].h, out n, out lum);
                cleanTot += n;
            }
            Chk(cleanTot <= 40, "release-clean residual delta: " + cleanTot);
            UnityEngine.Object.DestroyImmediate(duskBase); UnityEngine.Object.DestroyImmediate(duskOn);
            UnityEngine.Object.DestroyImmediate(nightBase); UnityEngine.Object.DestroyImmediate(nightOn);
            UnityEngine.Object.DestroyImmediate(clean);

            // runtime objects were created in-memory only: reopen from disk and
            // re-gate the saved scene (never saved after section F renders)
            Scene finalScene = EditorSceneManager.OpenScene(ScenePath, OpenSceneMode.Single);
            Chk(finalScene.isLoaded, "final reopen failed");
            Chk(CountPrefix(ResidentBubbleRules.Prefix) == 0, "BarkBubble leaked into the saved scene after renders");
            Chk(UnityEngine.Object.FindObjectsOfType<CityBubbles>().Length == 1, "CityBubbles lost after renders");

            // ---- G. degrade gates (honest silence) ----
            Chk(CityBubbles.LoadBubbleSprite(Path.Combine(BubbleDir, "no-such-dir"), "00000000") == null,
                "fake dir must load null");
            Chk(CityBubbles.LoadBubbleSprite(BubbleDir, "ffffffff") == null, "bogus key must load null");
            Chk(ResidentBarks.LineKey(null) == null && ResidentBarks.LineKey("") == null, "LineKey null law");
            GameObject tmp = new GameObject("BubbleDegradeProbe");
            try
            {
                CityBubbles silent = tmp.AddComponent<CityBubbles>();
                silent.Refresh(today, "nonexistent_ctx", 0);   // unknown bucket: pick -> null -> silence
                Chk(silent.BubbleCount == 0, "unknown ctx must mount nothing (honest silence)");
            }
            finally { UnityEngine.Object.DestroyImmediate(tmp); }

            // ---- H. mood-face gates (r144 adapter wiring: per-speaker
            // weighted lottery + seed law + honest absence) ----
            GameObject moodGo = new GameObject("BubbleMoodProbe");
            try
            {
                CityBubbles mb = moodGo.AddComponent<CityBubbles>();
                MoodCalRow[] rows = MoodDirector.LoadCalendar(true);
                Chk(rows != null, "mood calendar must parse for the mood-face gate");
                MoodState festive = MoodDirector.DeriveState(
                    new DateTime(2026, 10, 1, 12, 0, 0), 0, 12, false, "clear", rows);
                Chk(festive != null && festive.Mood == "festive", "injected festive state for the mood gate");
                mb.Refresh("2026-10-01", "morning", 0, festive);
                Chk(mb.BubbleCount >= 1, "mood mount must mount at least one speaker");
                Chk(mb.BubbleCount <= ResidentBarks.MaxBubblesPerScreen,
                    "mood mount must respect the <=2 rationing law");
                for (int i = 0; i < mb.BubbleCount; i++)
                {
                    string id = mb.MountedId(i);
                    Chk(id != null, "mood mount must expose its speaker id");
                    string wantCtx = MoodDirector.MoodCtxLottery("morning", MoodDirector.SrcClock, festive,
                        CityBubbles.MoodSeed(id, "2026-10-01", "festive"));
                    Chk(wantCtx == "morning" || wantCtx == "festival" || wantCtx == "market_open",
                        "festive lottery escaped its candidate domain: " + wantCtx);
                    string wantLine = ResidentBarks.PickFrom(f, id, "2026-10-01", wantCtx);
                    Chk(wantLine != null && wantLine == mb.MountedLine(i),
                        "mood mount line != per-speaker lottery pick at " + i + " (useCtx=" + wantCtx + ")");
                }
                // null mood = the pre-mood law: the fact-gate ctx stands
                mb.Release();
                mb.Refresh("2026-10-01", "morning", 0, null);
                Chk(mb.BubbleCount >= 1, "null-mood mount must still mount the fact ctx");
                for (int i = 0; i < mb.BubbleCount; i++)
                {
                    string id = mb.MountedId(i);
                    string wantLine = ResidentBarks.PickFrom(f, id, "2026-10-01", "morning");
                    Chk(wantLine != null && wantLine == mb.MountedLine(i),
                        "null-mood mount must use the fact ctx at " + i);
                }
            }
            finally { UnityEngine.Object.DestroyImmediate(moodGo); }

            // ---- sha record for the reload gate ----
            string maniSha = Sha256File(ManifestPath());
            File.WriteAllText(ShaPath, "manifest=" + maniSha + " entries=" + m.files.Length);

            return "asserts=" + asserts
                + " manifest=" + m.files.Length + " dual_impl_keys=" + m.files.Length + "/" + pool.Count
                + " widest_px=" + maxW + " mountx_displaced_seats=" + displaced
                + " bytes_loaded=" + loaded + " point_ok"
                + " mount(policy_ok ctx=12 slots=32 rotation=" + rot.Count + ")"
                + " scene(saved=" + saved + ",runtime_only_law_ok,neighbors_ok)"
                + " render(dusk_px=" + duskTot + " min=" + duskMin + " night_px=" + nightTot
                + " min=" + nightMin + " lum dusk=" + duskLum.ToString("F3") + " night=" + nightLum.ToString("F3")
                + " clean=" + cleanTot + ")"
                + " shots=2 slot=" + slotNow + " speakers=" + exp.Count;
        }

        // ---- pass 2 ----

        static string ReloadProve()
        {
            Scene scene = EditorSceneManager.OpenScene(ScenePath, OpenSceneMode.Single);
            if (!scene.isLoaded) throw new InvalidOperationException("CityScene failed to load");
            CityBubbles[] all = UnityEngine.Object.FindObjectsOfType<CityBubbles>();
            Chk(all.Length == 1 && all[0] != null, "CityBubbles unresolved after editor restart: " + all.Length);
            CityBubbles cb = all[0];
            Chk(cb.BubbleCount == 0, "fresh session must start with zero bubbles");
            Chk(CountPrefix(ResidentBubbleRules.Prefix) == 0, "BarkBubble persisted across restart (runtime-only law)");
            NeighborRegressions();

            // manifest + key law stable across sessions (fresh parse, no cache)
            ResidentBarksFile f = ResidentBarks.Load(true);
            Chk(f != null, "barks substrate lost after restart");
            DateTime now = DateTime.Now;
            Dictionary<string, int> roster = new Dictionary<string, int>();
            HashSet<string> pool = new HashSet<string>();
            CollectPool(f, pool, roster);
            BubbleManifest m = LoadManifest();
            Chk(m.files.Length == pool.Count, "manifest entries != pool after restart: "
                + m.files.Length + " vs " + pool.Count);
            int keyOk = 0;
            Dictionary<string, int> widthByKey = new Dictionary<string, int>();
            foreach (BubbleManifestEntry e in m.files)
            {
                if (e == null) continue;
                Chk(ResidentBarks.LineKey(e.line) == e.key, "key law drifted after restart: " + e.key);
                widthByKey[e.key] = e.w;
                keyOk++;
            }
            Chk(keyOk == m.files.Length, "key law gates after restart: " + keyOk + "/" + m.files.Length);
            string[] shaLines = File.Exists(ShaPath) ? File.ReadAllLines(ShaPath) : new string[0];
            Chk(shaLines.Length == 1 && shaLines[0].StartsWith("manifest="), "sha record missing");
            Chk(("manifest=" + Sha256File(ManifestPath()) + " entries=" + m.files.Length) == shaLines[0],
                "manifest bytes drifted across sessions");

            // spot byte loads after restart (first/mid/last)
            List<string> keysSorted = new List<string>(widthByKey.Keys);
            keysSorted.Sort(StringComparer.Ordinal);
            string[] spots = { keysSorted[0], keysSorted[keysSorted.Count / 2], keysSorted[keysSorted.Count - 1] };
            foreach (string key in spots)
            {
                Sprite sp = CityBubbles.LoadBubbleSprite(BubbleDir, key);
                Chk(sp != null, "spot byte load failed after restart: " + key);
                if (sp != null)
                {
                    Chk(Math.Abs(sp.bounds.size.x - widthByKey[key] / 24f) < 0.02f
                        && Math.Abs(sp.bounds.size.y - 1.5f) < 0.02f, "spot bounds after restart: " + key);
                    UnityEngine.Object.DestroyImmediate(sp.texture);
                }
            }

            // adapter alive after restart: a refresh through the persisted
            // component mounts the same law set (data path + rules resolve)
            List<Mounted> exp = ExpectedSet(f, widthByKey, roster, now.ToString("yyyy-MM-dd"), "morning",
                (now.Hour * 60 + now.Minute) / 45);
            cb.Release();
            cb.Refresh(now.ToString("yyyy-MM-dd"), "morning", (now.Hour * 60 + now.Minute) / 45);
            Chk(cb.BubbleCount == exp.Count, "adapter count != law count after restart: "
                + cb.BubbleCount + " vs " + exp.Count);
            for (int i = 0; i < exp.Count; i++)
            {
                Chk(cb.MountedLine(i) == exp[i].line, "adapter line drift after restart at " + i);
                Rect mr = cb.MountedRect(i);
                Chk(Math.Abs(mr.xMin - (exp[i].center.x - exp[i].w / 2f)) < 1e-3f,
                    "adapter rect drift after restart at " + i + " (MountX coupling)");
            }
            cb.Release();
            Chk(cb.BubbleCount == 0, "release broken after restart");

            GameObject camGo = GameObject.Find("CityCamera");
            Camera cam = camGo != null ? camGo.GetComponent<Camera>() : null;
            Chk(cam != null && Math.Abs(cam.orthographicSize - RigMath.L0Size) < 0.01f, "L0 camera broken after restart");
            return "reload_gate=OK manifest=" + m.files.Length + " keys=" + m.files.Length + "/" + m.files.Length
                + " sha_stable spots=3/3"
                + " adapter_coupling=" + exp.Count + " runtime_only=0_persisted cam_L0="
                + (cam != null ? cam.orthographicSize.ToString("F1") : "?");
        }

        // ---- wiring + neighbors ----

        static void EnsureWired()
        {
            if (UnityEngine.Object.FindObjectsOfType<CityBubbles>().Length > 0) return;
            GameObject go = new GameObject("CityBubbles");
            go.transform.position = Vector3.zero;
            go.AddComponent<CityBubbles>();
        }

        static int CountPrefix(string prefix)
        {
            int c = 0;
            foreach (Transform t in UnityEngine.Object.FindObjectsOfType<Transform>())
                if (t.name.StartsWith(prefix)) c++;
            return c;
        }

        static void NeighborRegressions()
        {
            int folkKept = 0;
            foreach (Transform t in UnityEngine.Object.FindObjectsOfType<Transform>())
                if (t.parent == null && t.name.StartsWith(ResidentRules.NamePrefix) && t.name.Length == 6) folkKept++;
            Chk(folkKept == ResidentRules.Count, "r99 residents lost: " + folkKept);
            int robotsKept = 0;
            foreach (SpriteRenderer sr in UnityEngine.Object.FindObjectsOfType<SpriteRenderer>())
                if (sr.name.StartsWith(RobotRules.NamePrefix)) robotsKept++;
            Chk(robotsKept == 8, "r36 street robots lost: " + robotsKept);
            int neonKept = 0;
            foreach (SpriteRenderer sr in UnityEngine.Object.FindObjectsOfType<SpriteRenderer>())
                if (sr.name.StartsWith(NeonRules.NamePrefix)) neonKept++;
            Chk(neonKept == NeonRules.Count, "r35+r38 neon signs lost: " + neonKept);
            int tagsKept = 0;
            foreach (SpriteRenderer sr in UnityEngine.Object.FindObjectsOfType<SpriteRenderer>())
                if (sr.name.StartsWith(ResidentTagRules.NamePrefix)) tagsKept++;
            Chk(tagsKept == 0, "world nameplates must stay retired (r179 S5b): " + tagsKept);
            GameObject ambGo = GameObject.Find("CityAmbient");
            CityAmbient amb = ambGo != null ? ambGo.GetComponent<CityAmbient>() : null;
            Chk(amb != null, "CityAmbient lost");
            Chk(amb.skylineFar != null && amb.skylineNear != null, "r34 skyline sprites lost");
            CityAmbientAudio bed = amb.GetComponent<CityAmbientAudio>();
            Chk(bed != null && bed.noiseBed != null && bed.noiseBed.length > 0f, "r31 bed clip lost");
            Chk(UnityEngine.Object.FindObjectsOfType<CityInterior>().Length >= 1, "CityInterior lost");
            Chk(UnityEngine.Object.FindObjectsOfType<CityCameraRig>().Length >= 1, "CityCameraRig lost");
            GameObject camGo = GameObject.Find("CityCamera");
            Camera cam = camGo != null ? camGo.GetComponent<Camera>() : null;
            Chk(cam != null && cam.orthographic && Math.Abs(cam.orthographicSize - RigMath.L0Size) < 0.01f,
                "L0 camera broken");
            Chk(TileCount("Ground") > 0 && TileCount("Water") > 0 && TileCount("Roads") > 0
                && TileCount("CityQUANT") > 0, "tilemap layers emptied");
            Chk(GameObject.Find("SkylineFar") == null && GameObject.Find("AmbientTintS") == null
                && GameObject.Find("AmbientTintN") == null && GameObject.Find("AmbientTintRiver") == null,
                "runtime-only visuals persisted into the scene");
        }

        static int TileCount(string layerName)
        {
            GameObject go = GameObject.Find(layerName);
            Tilemap tm = go != null ? go.GetComponent<Tilemap>() : null;
            if (tm == null) return 0;
            int c = 0;
            foreach (Vector3Int p in tm.cellBounds.allPositionsWithin)
                if (tm.GetTile(p) != null) c++;
            return c;
        }

        // ---- render helpers (r40 law: RT shot + window delta) ----

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

        // window metric: pixels in the bubble rect (+0.3u margin) that differ
        // from the released baseline. Only the bubbles change between renders
        // (residents + plates stay visible in both) -> clean attribution.
        static void WinDelta(Texture2D on, Texture2D off, Camera cam, Vector2 c, float w, float h,
            out int deltaCount, out float avgLum)
        {
            float hw = w / 2f + 0.3f, hh = h / 2f + 0.3f;
            float halfH = cam.orthographicSize;
            float halfW = halfH * (1920f / 1080f);
            float cx = cam.transform.position.x, cy = cam.transform.position.y;
            int px0 = (int)(((c.x - hw - cx) / (2f * halfW) + 0.5f) * 1920f);
            int px1 = (int)(((c.x + hw - cx) / (2f * halfW) + 0.5f) * 1920f);
            int py0 = (int)(((c.y - hh - cy) / (2f * halfH) + 0.5f) * 1080f);
            int py1 = (int)(((c.y + hh - cy) / (2f * halfH) + 0.5f) * 1080f);
            px0 = Math.Max(0, px0); px1 = Math.Min(1919, px1);
            py0 = Math.Max(0, py0); py1 = Math.Min(1079, py1);
            double lum = 0; int n = 0;
            for (int y = py0; y <= py1; y += 2)
                for (int x = px0; x <= px1; x += 2)
                {
                    Color ca = on.GetPixel(x, y);
                    Color cb = off.GetPixel(x, y);
                    float d = Math.Abs(ca.r - cb.r) + Math.Abs(ca.g - cb.g) + Math.Abs(ca.b - cb.b);
                    if (d > 0.06f)
                    {
                        n++;
                        lum += (ca.r + ca.g + ca.b) / 3.0;
                    }
                }
            deltaCount = n;
            avgLum = n > 0 ? (float)(lum / n) : 0f;
        }

        static string Sha256File(string path)
        {
            using (SHA256 s = SHA256.Create())
                return BitConverter.ToString(s.ComputeHash(File.ReadAllBytes(path))).Replace("-", "").ToLower();
        }
    }
}
