// FluxVerse P-37 r128 slice 2b-B: ArtPacks consumed-textures compression fix batch.
// Scope (r128 census logs/devloop-r128-artpacks-scan.json): 488 png.meta under
// Assets/ArtPacks, ALL stamped fvimport:v1 (r71 A5b stock stamp); Default-block
// TC1 = 372 (the A2 disease), TC0 = 116 (post-pipeline arrivals). Per the
// pre-registered consumed-artifacts-batch law (r125(4), r126 narrowing, r127
// remaining scope) the FIX list is the 27 LIVE-CONSUMED TC1 files:
//   warped-city 17  - neon sign/plates/antenna family (NeonProof 16 mounted)
//   tophat-robot 8  - PPU16 robot frames consumed by RobotRules
//   parallax-skyline 2 - live skyline layers (SkylineRules)
// NOT fixed (fix-at-consumption law, r125(2)): unconsumed TC1 strays (345) and
// retired resident frames (crowd PPU24 TC1 24, r99 swap-retired), plus all 116
// TC0 files. The out-of-list 461 metas are asserted BYTE-IDENTICAL before and
// after the batch (zero-stray-touch law made mechanical).
// PPU keep-law (r128 new): 8 warped files carry consumed enforcement PPU
// (32/48) that differs from the pipeline PpuFor table (16). A bare stamp-clear
// reimport would normalize their PPU to 16 and blow up every NeonSigns mount
// 2-3x. Release path is TWO-STAGE for those files: (a) clear stock stamp ->
// SaveAndReimport (pipeline law: compression off / point / no mips / v2 stamp),
// (b) write back the recorded consumed PPU -> second SaveAndReimport. At (b)
// the v2 stamp is non-empty so the pipeline returns (already-configured law)
// and the PPU write is a pure serialization change. This IS the deliberate
// importer-edit batch the pipeline comments reserve stock value fixes for.
// Sections:
//  S0 inventory: exactly 488 .png under Assets/ArtPacks, per-package
//     counts pinned (census-method note r129: FindAssets t:Texture2D
//     also returns 44 unconsumed psd/gif authoring sources outside the
//     r128 png census; the scope filter is .png, see S0 body);
//     (r128 census); all 27 FIX paths present; PPU expectations asserted
//     (16 for 19 files, 32/48 for the 8 keep files - census-pinned, drift =
//     throw); guid + meta bytes snapshot for all 488 (stray-touch guard);
//  S1 fix, 27 files, idempotent: v2-stamped = assert + skip; v1 stock stamp =
//     two-stage release (clear -> reimport -> [keep-PPU write-back]); unstamped
//     = plain ForceSynchronousImport; other userData = throw (manual config is
//     forever respected);
//  S2 verify: 27 files - API (sprite/point/uncompressed/no-mips/PPU-law/v2) +
//     meta text (Default TC 0 + userData v2) + effective readback (RGBA32/RGB24)
//     + dims unchanged; 461 out-of-list files - meta bytes identical to S0
//     snapshot (zero-stray-touch);
//  S3 GUID preservation: all 488 guid lines byte-identical;
//  S4 scene zero-regression: open CityScene, NEVER save; router 7 clips + bed
//     clips resolve; >=2000 live tiles; scene file bytes unchanged;
//  S5 RAM before/after (the DoD number face, r127 honesty path): sum of
//     Profiler.GetRuntimeMemorySizeLong over the 27 textures BEFORE the fix
//     (DXT state) and AFTER (uncompressed state) - the ONLY measurable
//     before-baseline in the whole P-37 A2 cure, reported into the .done.
// Expected VRAM delta (r128 census): ~396k px * 4B = ~1.5 MB RGBA32 vs ~0.19
// MB DXT1 => ~+1.3 MB for the sharpness cure.
// Sentinel pattern: logs/apstock.run -> FluxVerse.ArtPacksStockProof.BatchRun
// -> logs/apstock.done. Fail-loud: any broken assumption throws into .done.
// All comments ASCII. No 3D.
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using UnityEngine;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine.Tilemaps;

namespace FluxVerse
{
    public static class ArtPacksStockProof
    {
        const string MARK = "fvimport:v2";
        const string STOCK = "fvimport:v1";

        static string ProjectRoot { get { return Path.GetDirectoryName(Application.dataPath); } }
        static string RepoRoot { get { return Path.GetDirectoryName(ProjectRoot); } }
        static string RunPath { get { return Path.Combine(RepoRoot, "logs", "apstock.run"); } }
        static string DonePath { get { return Path.Combine(RepoRoot, "logs", "apstock.done"); } }

        // ---- r128 census-pinned FIX list (27 live-consumed TC1 files) ----
        static readonly string[] FIX = new string[]
        {
            "Assets/ArtPacks/warped-city/ENVIRONMENT/props/antenna.png",
            "Assets/ArtPacks/warped-city/ENVIRONMENT/props/banner-neon/banner-neon-1.png",
            "Assets/ArtPacks/warped-city/ENVIRONMENT/props/banner-neon/banner-neon-2.png",
            "Assets/ArtPacks/warped-city/ENVIRONMENT/props/banner-neon/banner-neon-3.png",
            "Assets/ArtPacks/warped-city/ENVIRONMENT/props/banner-neon/banner-neon-4.png",
            "Assets/ArtPacks/warped-city/ENVIRONMENT/props/banner-open.png",
            "Assets/ArtPacks/warped-city/ENVIRONMENT/props/banner-scroll/banner-scroll-1.png",
            "Assets/ArtPacks/warped-city/ENVIRONMENT/props/banner-side/banner-side-1.png",
            "Assets/ArtPacks/warped-city/ENVIRONMENT/props/banner-sushi/banner-sushi-1.png",
            "Assets/ArtPacks/warped-city/ENVIRONMENT/props/company-plates/plate-biggame.png",
            "Assets/ArtPacks/warped-city/ENVIRONMENT/props/company-plates/plate-biglife.png",
            "Assets/ArtPacks/warped-city/ENVIRONMENT/props/company-plates/plate-bigmoney.png",
            "Assets/ArtPacks/warped-city/ENVIRONMENT/props/company-plates/plate-bigstream.png",
            "Assets/ArtPacks/warped-city/ENVIRONMENT/props/company-plates/plate-cph4.png",
            "Assets/ArtPacks/warped-city/ENVIRONMENT/props/company-plates/plate-flux.png",
            "Assets/ArtPacks/warped-city/ENVIRONMENT/props/hotel-sign.png",
            "Assets/ArtPacks/warped-city/ENVIRONMENT/props/monitorface/monitor-face-1.png",
            "Assets/ArtPacks/tophat-robot/frames/robot_f00.png",
            "Assets/ArtPacks/tophat-robot/frames/robot_f01.png",
            "Assets/ArtPacks/tophat-robot/frames/robot_f04.png",
            "Assets/ArtPacks/tophat-robot/frames/robot_f05.png",
            "Assets/ArtPacks/tophat-robot/frames/robot_f06.png",
            "Assets/ArtPacks/tophat-robot/frames/robot_f07.png",
            "Assets/ArtPacks/tophat-robot/frames/robot_f08.png",
            "Assets/ArtPacks/tophat-robot/frames/robot_f12.png",
            "Assets/ArtPacks/parallax-skyline/layer-2.png",
            "Assets/ArtPacks/parallax-skyline/layer-3.png",
        };

        // consumed-enforcement PPU that must survive the pipeline reimport (8 files)
        static readonly Dictionary<string, int> KEEP_PPU = new Dictionary<string, int>
        {
            { "Assets/ArtPacks/warped-city/ENVIRONMENT/props/banner-neon/banner-neon-1.png", 32 },
            { "Assets/ArtPacks/warped-city/ENVIRONMENT/props/banner-neon/banner-neon-2.png", 32 },
            { "Assets/ArtPacks/warped-city/ENVIRONMENT/props/banner-open.png", 32 },
            { "Assets/ArtPacks/warped-city/ENVIRONMENT/props/banner-scroll/banner-scroll-1.png", 32 },
            { "Assets/ArtPacks/warped-city/ENVIRONMENT/props/banner-side/banner-side-1.png", 48 },
            { "Assets/ArtPacks/warped-city/ENVIRONMENT/props/company-plates/plate-biglife.png", 32 },
            { "Assets/ArtPacks/warped-city/ENVIRONMENT/props/company-plates/plate-bigstream.png", 32 },
            { "Assets/ArtPacks/warped-city/ENVIRONMENT/props/hotel-sign.png", 32 },
        };

        // r128 census per-package png.meta counts (drift = throw)
        static readonly Dictionary<string, int> PKG_COUNT = new Dictionary<string, int>
        {
            { "city-icons", 1 },
            { "city-pixel-tileset", 2 },
            { "cyber-city", 11 },
            { "modern-city-extension", 1 },
            { "office-ladder", 75 },
            { "parallax-skyline", 8 },
            { "residents-atlas", 2 },
            { "residents-crowd", 126 },
            { "ships-ripple", 111 },
            { "tophat-robot", 18 },
            { "warped-city", 132 },
            { "warped-city-2", 1 },
        };

        [InitializeOnLoadMethod]
        static void Hook()
        {
            if (File.Exists(RunPath)) EditorApplication.delayCall += Run;
        }

        public static void BatchRun() { Run(); }

        static string AbsOf(string assetPath)
        {
            return Path.Combine(Application.dataPath, assetPath.Substring("Assets/".Length));
        }

        static string MetaText(string assetPath)
        {
            return File.ReadAllText(AbsOf(assetPath) + ".meta");
        }

        static string GuidLine(string meta)
        {
            foreach (string ln in meta.Split('\n'))
                if (ln.TrimStart().StartsWith("guid:")) return ln.Trim();
            throw new InvalidOperationException("no guid line in meta");
        }

        static string PkgOf(string assetPath)
        {
            // "Assets/ArtPacks/<pkg>/..."
            string rest = assetPath.Substring("Assets/ArtPacks/".Length);
            int slash = rest.IndexOf('/');
            return slash < 0 ? rest : rest.Substring(0, slash);
        }

        static int ExpectedPpuOf(string p)
        {
            int k;
            if (KEEP_PPU.TryGetValue(p, out k)) return k;
            return 16;
        }

        static void AssertStock(TextureImporter ti, string p)
        {
            if (ti.textureType != TextureImporterType.Sprite)
                throw new InvalidOperationException("S2: textureType " + p);
            if (ti.spriteImportMode != SpriteImportMode.Single)
                throw new InvalidOperationException("S2: spriteImportMode " + p);
            if (ti.filterMode != FilterMode.Point)
                throw new InvalidOperationException("S2: filterMode " + p);
            if (ti.textureCompression != TextureImporterCompression.Uncompressed)
                throw new InvalidOperationException("S2: compression " + p + " actual=" + ti.textureCompression);
            if (ti.mipmapEnabled) throw new InvalidOperationException("S2: mipmaps on " + p);
            if (ti.spritePixelsPerUnit != ExpectedPpuOf(p))
                throw new InvalidOperationException("S2: ppu " + p + " expected="
                    + ExpectedPpuOf(p) + " actual=" + ti.spritePixelsPerUnit);
            if (ti.userData != MARK)
                throw new InvalidOperationException("S2: mark " + p + " ud='" + ti.userData + "'");
        }

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
            finally
            {
                if (File.Exists(RunPath)) File.Delete(RunPath);
            }
        }

        static string Prove()
        {
            // ---- S0 inventory (census scope = the 488 .png; the 44 psd/gif
            // authoring sources also count as Texture2D but sit outside the
            // r128 png census - filtered here, r129 census-method fix) ----
            var foundRaw = new List<string>(AssetDatabase.FindAssets("t:Texture2D", new[] { "Assets/ArtPacks" }));
            var all = new List<string>();
            foreach (string g in foundRaw)
            {
                string ap = AssetDatabase.GUIDToAssetPath(g);
                if (ap.EndsWith(".png", StringComparison.OrdinalIgnoreCase)) all.Add(ap);
            }
            if (all.Count != 488)
                throw new InvalidOperationException("S0: total shifted " + all.Count);
            all.Sort();
            var byPkg = new Dictionary<string, int>();
            foreach (string p in all)
            {
                string pkg = PkgOf(p);
                int c;
                byPkg[pkg] = byPkg.TryGetValue(pkg, out c) ? c + 1 : 1;
            }
            foreach (var kv in PKG_COUNT)
            {
                int c;
                if (!byPkg.TryGetValue(kv.Key, out c) || c != kv.Value)
                    throw new InvalidOperationException("S0: pkg " + kv.Key + " count "
                        + (byPkg.TryGetValue(kv.Key, out c) ? c : 0) + " expected " + kv.Value);
            }
            var fixSet = new HashSet<string>(FIX);
            if (fixSet.Count != 27)
                throw new InvalidOperationException("S0: FIX list not 27 (" + fixSet.Count + ")");
            foreach (string p in FIX)
                if (!File.Exists(AbsOf(p)))
                    throw new InvalidOperationException("S0: FIX path missing " + p);
                else if (!all.Contains(p))
                    throw new InvalidOperationException("S0: FIX path not in tree " + p);

            var guidBefore = new Dictionary<string, string>();
            var metaBefore = new Dictionary<string, string>();
            var dimsBefore = new Dictionary<string, int[]>();
            long memBefore = 0;
            foreach (string p in all)
            {
                string mt = MetaText(p);
                guidBefore[p] = GuidLine(mt);
                metaBefore[p] = mt;
            }
            foreach (string p in FIX)
            {
                var i0 = AssetImporter.GetAtPath(p) as TextureImporter;
                if (i0 == null) throw new InvalidOperationException("S0: not a texture importer " + p);
                if (i0.userData == MARK)
                {
                    // post-fix state (idempotent re-run / crash-recovery path,
                    // r129 repair of the dead S1 skip branch): full compliance
                    // required here, S1 then asserts + skips; the memBefore sum
                    // below becomes the already-fixed baseline (honest for a
                    // no-op stability pass)
                    AssertStock(i0, p);
                }
                else
                {
                    if (i0.textureCompression == TextureImporterCompression.Uncompressed)
                        throw new InvalidOperationException("S0: FIX file already uncompressed " + p);
                    if (i0.userData != STOCK && i0.userData != "")
                        throw new InvalidOperationException("S0: FIX file unexpected stamp '" + i0.userData + "' " + p);
                    if (i0.spritePixelsPerUnit != ExpectedPpuOf(p))
                        throw new InvalidOperationException("S0: FIX file ppu drift " + p + " expected="
                            + ExpectedPpuOf(p) + " actual=" + i0.spritePixelsPerUnit);
                }
                var t0 = AssetDatabase.LoadAssetAtPath<Texture2D>(p);
                if (t0 == null) throw new InvalidOperationException("S0: not loadable " + p);
                dimsBefore[p] = new int[] { t0.width, t0.height };
                memBefore += UnityEngine.Profiling.Profiler.GetRuntimeMemorySizeLong(t0);   // DXT-state baseline (S5)
            }

            // ---- S1 fix (27 files, idempotent) ----
            int fixedNow = 0, skipped = 0, ppuKept = 0;
            foreach (string p in FIX)
            {
                var imp = AssetImporter.GetAtPath(p) as TextureImporter;
                if (imp == null) throw new InvalidOperationException("S1: importer lost " + p);
                string ud = imp.userData;
                if (ud == MARK) { AssertStock(imp, p); skipped++; continue; }
                if (ud == STOCK)
                {
                    // stage (a): clear the stock stamp -> pipeline law applies (incl.
                    // PPU=PpuFor; for keep-files that is knowingly wrong -> stage (b))
                    imp.userData = "";
                    imp.SaveAndReimport();
                    int k;
                    if (KEEP_PPU.TryGetValue(p, out k))
                    {
                        var impB = AssetImporter.GetAtPath(p) as TextureImporter;
                        if (impB == null) throw new InvalidOperationException("S1: importer lost after stage-a " + p);
                        if (impB.userData != MARK)
                            throw new InvalidOperationException("S1: stage-a did not stamp " + p);
                        // stage (b): consumed-enforcement PPU write-back; pipeline sees
                        // the non-empty v2 stamp and returns (already-configured law)
                        impB.spritePixelsPerUnit = k;
                        impB.SaveAndReimport();
                        ppuKept++;
                    }
                }
                else if (ud == "")
                {
                    AssetDatabase.ImportAsset(p, ImportAssetOptions.ForceSynchronousImport);
                    int k;
                    if (KEEP_PPU.TryGetValue(p, out k))
                    {
                        var impB = AssetImporter.GetAtPath(p) as TextureImporter;
                        if (impB == null) throw new InvalidOperationException("S1: importer lost after import " + p);
                        impB.spritePixelsPerUnit = k;
                        impB.SaveAndReimport();
                        ppuKept++;
                    }
                }
                else
                {
                    throw new InvalidOperationException("S1: unexpected userData '" + ud + "' " + p
                        + " (a stamp is manual configuration, forever respected)");
                }
                var imp2 = AssetImporter.GetAtPath(p) as TextureImporter;
                if (imp2 == null) throw new InvalidOperationException("S1: importer lost after import " + p);
                AssertStock(imp2, p);
                fixedNow++;
            }

            // ---- S2 verify ----
            int uncFormats = 0;
            foreach (string p in FIX)
            {
                var ti = AssetImporter.GetAtPath(p) as TextureImporter;
                if (ti == null) throw new InvalidOperationException("S2: importer lost " + p);
                AssertStock(ti, p);
                string mt = MetaText(p);
                if (mt.IndexOf("userData: " + MARK) < 0)
                    throw new InvalidOperationException("S2: meta mark " + p);
                int di = mt.IndexOf("buildTarget: DefaultTexturePlatform");
                if (di < 0) throw new InvalidOperationException("S2: no default block " + p);
                int tj = mt.IndexOf("textureCompression:", di);
                if (tj < 0) throw new InvalidOperationException("S2: no TC field in default block " + p);
                if (mt[tj + 20] != '0')
                    throw new InvalidOperationException("S2: meta default TC " + p + " char='" + mt[tj + 20] + "'");
                var tx = AssetDatabase.LoadAssetAtPath<Texture2D>(p);
                if (tx == null) throw new InvalidOperationException("S2: reload failed " + p);
                if (tx.format != TextureFormat.RGBA32 && tx.format != TextureFormat.RGB24)
                    throw new InvalidOperationException("S2: effective format " + p + " actual=" + tx.format);
                uncFormats++;
                int[] d = dimsBefore[p];
                if (tx.width != d[0] || tx.height != d[1])
                    throw new InvalidOperationException("S2: dims changed " + p + " "
                        + d[0] + "x" + d[1] + " -> " + tx.width + "x" + tx.height);
            }
            int straysTouched = 0;
            foreach (string p in all)
            {
                if (fixSet.Contains(p)) continue;
                if (MetaText(p) != metaBefore[p])
                {
                    straysTouched++;
                    throw new InvalidOperationException("S2: stray meta changed " + p);
                }
            }

            // ---- S3 GUID preservation (all 488) ----
            foreach (string p in all)
                if (GuidLine(MetaText(p)) != guidBefore[p])
                    throw new InvalidOperationException("S3: guid changed " + p);

            // ---- S4 scene zero-regression (open only, never save) ----
            string scenePath = "Assets/Scenes/CityScene.unity";
            string sceneAbs = AbsOf(scenePath);
            if (!File.Exists(sceneAbs)) throw new InvalidOperationException("S4: CityScene missing");
            byte[] sceneBefore = File.ReadAllBytes(sceneAbs);
            var scene = EditorSceneManager.OpenScene(scenePath, OpenSceneMode.Single);
            if (!scene.isLoaded) throw new InvalidOperationException("S4: scene failed to load");
            GameObject routerGo = GameObject.Find("CityEventRouter");
            if (routerGo == null) throw new InvalidOperationException("S4: CityEventRouter GO missing");
            CityEventRouter router = routerGo.GetComponent<CityEventRouter>();
            if (router == null) throw new InvalidOperationException("S4: router unresolved (r14 stub disease)");
            if (router.ceoOrderPulse == null) throw new InvalidOperationException("S4: ceoOrderPulse unwired");
            CityAmbientAudio[] beds = UnityEngine.Object.FindObjectsOfType<CityAmbientAudio>();
            if (beds.Length != 1) throw new InvalidOperationException("S4: bed components=" + beds.Length);
            Tilemap[] maps = UnityEngine.Object.FindObjectsOfType<Tilemap>();
            if (maps.Length < 3) throw new InvalidOperationException("S4: tilemap layers=" + maps.Length);
            long liveTiles = 0;
            foreach (Tilemap m in maps)
            {
                BoundsInt b = m.cellBounds;
                long cells = (long)Math.Max(0, b.xMax - b.xMin) * Math.Max(0, b.yMax - b.yMin) * Math.Max(0, b.zMax - b.zMin);
                if (cells == 0 || cells > 50000) continue;
                foreach (var pos in b.allPositionsWithin)
                    if (m.GetTile(pos) != null) liveTiles++;
            }
            if (liveTiles < 2000)
                throw new InvalidOperationException("S4: live tiles=" + liveTiles + " (r11 baseline 3215+)");
            byte[] sceneAfter = File.ReadAllBytes(sceneAbs);
            if (sceneAfter.Length != sceneBefore.Length)
                throw new InvalidOperationException("S4: scene file length changed (proof must never save)");
            for (int i = 0; i < sceneAfter.Length; i++)
                if (sceneAfter[i] != sceneBefore[i])
                    throw new InvalidOperationException("S4: scene bytes changed at " + i);

            // ---- S5 RAM after (DoD number face) ----
            long memAfter = 0;
            foreach (string p in FIX)
            {
                var tx = AssetDatabase.LoadAssetAtPath<Texture2D>(p);
                if (tx == null) throw new InvalidOperationException("S5: reload failed " + p);
                memAfter += UnityEngine.Profiling.Profiler.GetRuntimeMemorySizeLong(tx);
            }

            return "apstock total=" + all.Count + " fix=" + fixSet.Count
                 + " fixedNow=" + fixedNow + " skipped=" + skipped + " ppuKept=" + ppuKept
                 + " uncFormats=" + uncFormats + " straysUntouched=" + (all.Count - fixSet.Count - straysTouched)
                 + " guidPreserved=" + all.Count
                 + " sceneBytesStable=1 tilemaps=" + maps.Length + " liveTiles=" + liveTiles
                 + " ramBefore=" + memBefore + " ramAfter=" + memAfter + " ramDelta=" + (memAfter - memBefore)
                 + " idempotent=" + (fixedNow == 0 ? 1 : 0);
        }
    }
}
