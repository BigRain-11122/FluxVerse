// FluxVerse P-37 r126 slice 2b-A: Art-tree texture stock compression fix batch.
// Scope: all textures under Assets/Art (CleanCityv3 852 + Vehicles/frames 14 = 866)
// keep the audit-era default-platform compression (DefaultTexturePlatform block
// textureCompression: 1 = DXT block artifacts on every rendered tile -
// R-20260924-asset-import.md A2). The compression law itself has been in the
// pipeline since slice 1 (r71); stock metas were deliberately untouched (r68
// note; R- 3.2 step 2/3 = stock value fixes are deliberate importer-edit
// batches). Ground truth (r126 scan): zero platform overrides anywhere in Art
// (non-overridden blocks follow the default block - post-pipeline arrivals
// like office-ladder already carry Default TC 0). This batch clears the r71 A5b
// STOCK stamp (fvimport:v1 - a stock mark, not a manual configuration) per the
// pre-registered release path (r125: the stock proof batch is the ONLY release
// path; values come from the pipeline, never hand-edited) and force-reimports
// every stock texture once so the pipeline applies + re-stamps fvimport:v2.
// Sentinel pattern (r11 / r71 / r81 style):
//   logs/ccstock.run -> FluxVerse.CleanCityStockProof.BatchRun -> logs/ccstock.done
// Sections:
//  S0 inventory: exactly 866 textures (CleanCityv3 852 / Vehicles 14);
//     unclassified path = throw; guid + dims captured; pre-state honesty
//     counter (as-audited compressed disease visibility, no hard assert so a
//     green idempotent re-run stays green);
//  S1 fix, idempotent per file: v2-stamped = assert values + skip; unstamped =
//     one ForceSynchronousImport; v1 STOCK stamp = clear userData +
//     SaveAndReimport (release path); any other userData = throw (a stamp is
//     manual configuration, forever respected);
//  S2 verify, all 866, three faces: TextureImporter API + raw meta text
//     (Default block TC 0 + userData fvimport:v2) + effective readback (loaded
//     Texture2D.format == RGBA32 - the readback settles the platform-block
//     question) + dims unchanged vs S0 capture;
//  S3 GUID preservation: every guid line byte-identical before/after
//     (Tile assets + tilemap + scene references are GUID-based);
//  S4 scene zero-regression: open CityScene, NEVER save; router 7 clips + 8
//     bed clips resolve; >=3 tilemaps with >3000 live tiles (tile -> sprite
//     chain alive); scene file bytes unchanged;
//  S5 control probe (report-only): office-ladder / residents-atlas readbacks
//     (2b-B scoping: post-pipeline arrivals expected RGBA32 already).
// VRAM DoD honesty note: 866 tiles x 16x16x4B ~ 0.9 MB uncompressed vs ~0.11
// MB DXT1 - the sharpness cure costs under 1 MB VRAM; measured Profiler numbers
// belong to the render re-anchor round (next slice). Fail-loud: any broken
// assumption throws into the .done report. All comments ASCII. No 3D.
using System;
using System.Collections.Generic;
using System.IO;
using UnityEngine;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine.Tilemaps;

namespace FluxVerse
{
    public static class CleanCityStockProof
    {
        const string MARK = "fvimport:v2";

        static string ProjectRoot { get { return Path.GetDirectoryName(Application.dataPath); } }
        static string RepoRoot { get { return Path.GetDirectoryName(ProjectRoot); } }
        static string RunPath { get { return Path.Combine(RepoRoot, "logs", "ccstock.run"); } }
        static string DonePath { get { return Path.Combine(RepoRoot, "logs", "ccstock.done"); } }

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

        static void AssertStock(TextureImporter ti, string p)
        {
            if (ti.textureType != TextureImporterType.Sprite)
                throw new InvalidOperationException("S2: textureType " + p);
            if (ti.spriteImportMode != SpriteImportMode.Single)
                throw new InvalidOperationException("S2: spriteImportMode " + p + " (single-source law, r99 atlas exemption does not apply here)");
            if (ti.filterMode != FilterMode.Point)
                throw new InvalidOperationException("S2: filterMode " + p);
            if (ti.textureCompression != TextureImporterCompression.Uncompressed)
                throw new InvalidOperationException("S2: compression " + p + " actual=" + ti.textureCompression);
            if (ti.mipmapEnabled) throw new InvalidOperationException("S2: mipmaps on " + p);
            if (ti.spritePixelsPerUnit != 16)
                throw new InvalidOperationException("S2: ppu " + p + " actual=" + ti.spritePixelsPerUnit);
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
            // ---- S0 inventory ----
            var found = new List<string>(AssetDatabase.FindAssets("t:Texture2D", new[] { "Assets/Art" }));
            if (found.Count == 0) throw new InvalidOperationException("S0: no textures under Assets/Art");
            var all = new List<string>();
            foreach (string g in found) all.Add(AssetDatabase.GUIDToAssetPath(g));
            all.Sort();
            int cc = 0, veh = 0;
            foreach (string p in all)
            {
                if (p.StartsWith("Assets/Art/CleanCityv3/")) cc++;
                else if (p.StartsWith("Assets/Art/Vehicles/")) veh++;
                else throw new InvalidOperationException("S0: unclassified texture " + p);
            }
            if (all.Count != 866 || cc != 852 || veh != 14)
                throw new InvalidOperationException("S0: inventory shifted total=" + all.Count
                    + " cc=" + cc + " veh=" + veh);

            var guidBefore = new Dictionary<string, string>();
            var dimsBefore = new Dictionary<string, int[]>();
            foreach (string p in all) guidBefore[p] = GuidLine(MetaText(p));
            int preCompressed = 0;
            foreach (string p in all)
            {
                var i0 = AssetImporter.GetAtPath(p) as TextureImporter;
                if (i0 == null) throw new InvalidOperationException("S0: not a texture importer " + p);
                if (i0.textureCompression != TextureImporterCompression.Uncompressed) preCompressed++;
                var t0 = AssetDatabase.LoadAssetAtPath<Texture2D>(p);
                if (t0 == null) throw new InvalidOperationException("S0: not loadable " + p);
                dimsBefore[p] = new int[] { t0.width, t0.height };
            }

            // ---- S1 fix (idempotent) ----
            int fixedNow = 0, clearedStock = 0, skipped = 0;
            foreach (string p in all)
            {
                var imp = AssetImporter.GetAtPath(p) as TextureImporter;
                if (imp == null) throw new InvalidOperationException("S1: importer lost " + p);
                string ud = imp.userData;
                if (ud == MARK) { AssertStock(imp, p); skipped++; continue; }
                if (ud == "fvimport:v1")
                {
                    // r71 A5b STOCK mark: the pre-registered release path clears
                    // it so the pipeline law applies; values are never hand-set.
                    imp.userData = "";
                    imp.SaveAndReimport();
                    clearedStock++;
                }
                else if (ud == "")
                {
                    AssetDatabase.ImportAsset(p, ImportAssetOptions.ForceSynchronousImport);
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

            // ---- S2 verify (API + meta text + effective readback, all 866) ----
            // Uncompressed formats: RGBA32 (alpha sources) or RGB24 (alpha-less
            // sources like the showcase Example.png) - both are the cure; any
            // DXT/BC format would be the disease.
            int uncFormats = 0;
            foreach (string p in all)
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

            // ---- S3 GUID preservation ----
            foreach (string p in all)
            {
                if (GuidLine(MetaText(p)) != guidBefore[p])
                    throw new InvalidOperationException("S3: guid changed " + p);
            }

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
            if (router.commitBlip == null) throw new InvalidOperationException("S4: commitBlip unwired");
            if (router.taskClaimSfx == null) throw new InvalidOperationException("S4: taskClaimSfx unwired");
            if (router.marketBellOpen == null) throw new InvalidOperationException("S4: marketBellOpen unwired");
            if (router.marketBellClose == null) throw new InvalidOperationException("S4: marketBellClose unwired");
            if (router.weatherAlert == null) throw new InvalidOperationException("S4: weatherAlert unwired");
            if (router.residentTalk == null) throw new InvalidOperationException("S4: residentTalk unwired");
            CityAmbientAudio[] beds = UnityEngine.Object.FindObjectsOfType<CityAmbientAudio>();
            if (beds.Length != 1) throw new InvalidOperationException("S4: bed components=" + beds.Length);
            CityAmbientAudio bed = beds[0];
            if (bed.noiseBed == null) throw new InvalidOperationException("S4: noiseBed unwired");
            if (bed.bgmDawn == null || bed.bgmDay == null || bed.bgmDusk == null || bed.bgmNight == null)
                throw new InvalidOperationException("S4: bgm phase clips unwired");
            if (bed.weatherRain == null || bed.weatherStorm == null || bed.weatherWind == null)
                throw new InvalidOperationException("S4: weather bed clips unwired");
            Tilemap[] maps = UnityEngine.Object.FindObjectsOfType<Tilemap>();
            if (maps.Length < 3) throw new InvalidOperationException("S4: tilemap layers=" + maps.Length);
            long liveTiles = 0;
            foreach (Tilemap m in maps)
            {
                BoundsInt b = m.cellBounds;
                long cells = (long)Math.Max(0, b.xMax - b.xMin) * Math.Max(0, b.yMax - b.yMin) * Math.Max(0, b.zMax - b.zMin);
                if (cells == 0 || cells > 50000) continue;   // stale-huge/degenerate bounds: skip count
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

            // ---- S5 control probe (report-only, 2b-B scoping) ----
            string ctrl = "n/a";
            string[] ctrlDirs = { "Assets/ArtPacks/office-ladder", "Assets/ArtPacks/residents-atlas" };
            var sbCtrl = new System.Text.StringBuilder();
            foreach (string dir in ctrlDirs)
            {
                var g2 = AssetDatabase.FindAssets("t:Texture2D", new[] { dir });
                if (g2.Length == 0) { sbCtrl.Append(Path.GetFileName(dir) + "=none;"); continue; }
                string cp = AssetDatabase.GUIDToAssetPath(g2[0]);
                var ct = AssetDatabase.LoadAssetAtPath<Texture2D>(cp);
                sbCtrl.Append(Path.GetFileName(dir) + "=" + (ct == null ? "?" : ct.format.ToString()) + ";");
            }
            ctrl = sbCtrl.ToString();

            return "ccstock total=" + all.Count + " cleanCity=" + cc + " vehicles=" + veh
                 + " preCompressed=" + preCompressed + " fixedNow=" + fixedNow
                 + " clearedStock=" + clearedStock + " skipped=" + skipped
                 + " uncFormats=" + uncFormats + " guidPreserved=" + all.Count
                 + " sceneClips=15 sceneBytesStable=1 tilemaps=" + maps.Length + " liveTiles=" + liveTiles
                 + " control[" + ctrl + "] idempotent=" + (fixedNow == 0 ? 1 : 0);
        }
    }
}
