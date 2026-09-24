// FluxVerse P-37 r68 slice 1: batch proof for the import pipeline.
// Sentinel pattern (r11 builder style):
//   logs/import.run -> FluxVerse.ImportProof.BatchRun -> logs/import.done
// Sections:
//  A0 PpuFor tier units (pure static, no IO);
//  A1 fresh-stone textures x4 (DeleteAsset+restore = truly fresh import under
//     ADB2: meta is pre-created before preprocess, and settings are RECOVERED
//     from the artifact cache when a meta is deleted - only a full
//     DeleteAsset purge reaches the pipeline, trace-proven runs 2/4/5/6);
//  A2 fresh-stone music copy (Streaming branch, self-cleaning temp asset);
//  A4 scope guard: fresh png outside Art/ArtPacks/Audio stays unstamped;
//  A5b one-time stock stamp: every pre-pipeline texture under Art/ArtPacks
//     gets userData=MARK so the pipeline never rewrites existing stock;
//  A3 no-touch regression: stock stamp changed ONLY the userData line of the
//     three texture keep-metas; the audio keep-meta is byte-stable.
// Fail-loud: any broken assumption throws into the .done report.
// All comments ASCII. No 3D.
using System;
using System.IO;
using System.Text;
using UnityEngine;
using UnityEditor;

namespace FluxVerse
{
    public static class ImportProof
    {
        static string ProjectRoot { get { return Path.GetDirectoryName(Application.dataPath); } }
        static string RepoRoot { get { return Path.GetDirectoryName(ProjectRoot); } }
        static string RunPath { get { return Path.Combine(RepoRoot, "logs", "import.run"); } }
        static string DonePath { get { return Path.Combine(RepoRoot, "logs", "import.done"); } }

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

        static string StripUserDataLine(string meta)
        {
            var sb = new StringBuilder();
            foreach (string ln in meta.Split('\n'))
                if (!ln.TrimStart().StartsWith("userData:")) sb.Append(ln).Append('\n');
            return sb.ToString();
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
            int a0 = 0, a1 = 0, a2 = 0, a3 = 0, a4 = 0, a5 = 0;

            // ---- pre-clean of temp stones left by an aborted proof run ----
            string[] tmps = { "Assets/Audio/music/_p37_stone.ogg", "Assets/_p37_scope_stone.png" };
            foreach (string t in tmps)
            {
                if (File.Exists(AbsOf(t)))
                {
                    AssetDatabase.DeleteAsset(t);
                    if (File.Exists(AbsOf(t)) || File.Exists(AbsOf(t) + ".meta"))
                        throw new InvalidOperationException("pre-clean failed for " + t);
                }
            }

            // ---- A0 tier units (pure) ----
            if (CityImportPostprocessor.PpuFor("Assets/ArtPacks/residents-crowd/1/Idle.png") != 24)
                throw new InvalidOperationException("A0: residents tier must be 24");
            if (CityImportPostprocessor.PpuFor("Assets/ArtPacks/warped-city-2/sheet-environment.png") != 16)
                throw new InvalidOperationException("A0: default tier must be 16");
            if (CityImportPostprocessor.PpuFor("Assets/Art/CleanCityv3/Tiles/t.png") != 16)
                throw new InvalidOperationException("A0: Art tier must be 16");
            a0 = 3;

            // ---- A3 pre-snapshot (before anything this proof does) ----
            string[] keep = {
                "Assets/ArtPacks/residents-crowd/1/Idle.png",
                "Assets/ArtPacks/parallax-skyline/layer-2.png",
                "Assets/Art/CleanCityv3/AnimatedTiles/Flags/Flag_Blue/Frames/Flag_blue1.png",
                "Assets/Audio/music/tt_caves.ogg"
            };
            string[] before = new string[keep.Length];
            for (int i = 0; i < keep.Length; i++) before[i] = MetaText(keep[i]);
            if (before[0].IndexOf("spritePixelsToUnits: 100") < 0)
                throw new InvalidOperationException("A3: residents Idle baseline expected PPU100 (as-audited default)");
            if (before[2].IndexOf("textureCompression: 1") < 0)
                throw new InvalidOperationException("A3: CleanCity baseline expected compression 1 (A2 as-audited)");
            if (before[3].IndexOf("loadType: 2") < 0 || before[3].IndexOf("userData: fvimport:v1") < 0)
                throw new InvalidOperationException("A3: music baseline expected Streaming+stamp (r81 audio stock cured state; pre-r81 as-audited loadType 0 fixed by AudioStockProof)");

            // ---- A1 fresh stones (truly fresh import = DeleteAsset purge + restore) ----
            string[] stones = {
                "Assets/ArtPacks/city-pixel-tileset/city_tileset/city.png",
                "Assets/ArtPacks/city-pixel-tileset/city_tileset/city_bg.png",
                "Assets/ArtPacks/city-icons/icons_city.png",
                "Assets/ArtPacks/warped-city-2/sheet-environment.png"
            };
            foreach (string p in stones)
            {
                // Idempotent short-circuit: a stone already carrying pipeline values
                // (e.g. from a previous green run) is asserted in place - no purge,
                // no GUID churn. Only an uncorrected stone goes through the purge.
                var ti0 = AssetImporter.GetAtPath(p) as TextureImporter;
                bool already = ti0 != null && ti0.userData == "fvimport:v1"
                    && ti0.filterMode == FilterMode.Point
                    && ti0.spritePixelsPerUnit == 16
                    && ti0.textureCompression == TextureImporterCompression.Uncompressed;
                if (!already)
                {
                    byte[] raw = File.ReadAllBytes(AbsOf(p));
                    if (!AssetDatabase.DeleteAsset(p)) throw new InvalidOperationException("A1: DeleteAsset failed " + p);
                    AssetDatabase.Refresh(ImportAssetOptions.ForceSynchronousImport);
                    if (File.Exists(AbsOf(p)) || File.Exists(AbsOf(p) + ".meta"))
                        throw new InvalidOperationException("A1: deletion not flushed after Refresh " + p);
                    File.WriteAllBytes(AbsOf(p), raw);
                    AssetDatabase.ImportAsset(p, ImportAssetOptions.ForceSynchronousImport);
                }
                if (!File.Exists(AbsOf(p) + ".meta"))
                    throw new InvalidOperationException("A1: stone meta missing after import: " + p);
                var ti = AssetImporter.GetAtPath(p) as TextureImporter;
                if (ti == null) throw new InvalidOperationException("A1: not a texture importer: " + p);
                if (ti.textureType != TextureImporterType.Sprite)
                    throw new InvalidOperationException("A1: textureType " + p + " actual=" + ti.textureType);
                if (ti.spriteImportMode != SpriteImportMode.Single) throw new InvalidOperationException("A1: spriteImportMode " + p);
                if (ti.filterMode != FilterMode.Point)
                    throw new InvalidOperationException("A1: filterMode " + p + " actual=" + ti.filterMode
                        + " ud='" + ti.userData + "' comp=" + ti.textureCompression + " ppu=" + ti.spritePixelsPerUnit);
                if (ti.textureCompression != TextureImporterCompression.Uncompressed) throw new InvalidOperationException("A1: compression " + p);
                if (ti.mipmapEnabled) throw new InvalidOperationException("A1: mipmaps on " + p);
                if (ti.npotScale != TextureImporterNPOTScale.None) throw new InvalidOperationException("A1: npot " + p);
                if (!ti.alphaIsTransparency) throw new InvalidOperationException("A1: alpha " + p);
                if (ti.spritePixelsPerUnit != 16) throw new InvalidOperationException("A1: ppu " + p);
                if (ti.userData != "fvimport:v1") throw new InvalidOperationException("A1: mark " + p);
                string mt = MetaText(p);
                if (mt.IndexOf("filterMode: 0") < 0) throw new InvalidOperationException("A1: meta filterMode " + p);
                if (mt.IndexOf("textureCompression: 0") < 0) throw new InvalidOperationException("A1: meta compression " + p);
                if (mt.IndexOf("spritePixelsToUnits: 16") < 0) throw new InvalidOperationException("A1: meta ppu " + p);
                if (mt.IndexOf("userData: fvimport:v1") < 0) throw new InvalidOperationException("A1: meta mark " + p);
                a1 += 13;
            }

            // ---- A2 fresh music stone (Streaming branch, self-cleaning) ----
            string src = "Assets/Audio/music/tt_caves.ogg";
            string dst = "Assets/Audio/music/_p37_stone.ogg";
            File.Copy(AbsOf(src), AbsOf(dst), true);
            AssetDatabase.ImportAsset(dst, ImportAssetOptions.ForceSynchronousImport);
            var ai = AssetImporter.GetAtPath(dst) as AudioImporter;
            if (ai == null) throw new InvalidOperationException("A2: not an audio importer");
            var s = ai.defaultSampleSettings;
            if (s.loadType != AudioClipLoadType.Streaming) throw new InvalidOperationException("A2: loadType not Streaming");
            if (s.preloadAudioData) throw new InvalidOperationException("A2: preload should be off for music");
            if (!ai.loadInBackground) throw new InvalidOperationException("A2: loadInBackground should be on");
            if (ai.userData != "fvimport:v1") throw new InvalidOperationException("A2: mark missing");
            string amt = MetaText(dst);
            if (amt.IndexOf("loadType: 2") < 0) throw new InvalidOperationException("A2: meta loadType");
            if (amt.IndexOf("preloadAudioData: 0") < 0) throw new InvalidOperationException("A2: meta preload");
            var clip = AssetDatabase.LoadAssetAtPath<AudioClip>(dst);
            if (clip == null || clip.length <= 0f) throw new InvalidOperationException("A2: streaming clip not loadable");
            a2 = 7;
            if (!AssetDatabase.DeleteAsset(dst)) throw new InvalidOperationException("A2: cleanup failed");
            if (File.Exists(AbsOf(dst)) || File.Exists(AbsOf(dst) + ".meta"))
                throw new InvalidOperationException("A2: stone still on disk after cleanup");
            a2 = 9;

            // ---- A4 scope guard: fresh png outside Art/ArtPacks/Audio stays unstamped ----
            string scope = "Assets/_p37_scope_stone.png";
            File.Copy(AbsOf(stones[0]), AbsOf(scope), true);
            AssetDatabase.ImportAsset(scope, ImportAssetOptions.ForceSynchronousImport);
            var si = AssetImporter.GetAtPath(scope) as TextureImporter;
            if (si == null) throw new InvalidOperationException("A4: scope stone importer null");
            if (si.userData == "fvimport:v1") throw new InvalidOperationException("A4: pipeline must not stamp non-art assets");
            if (si.filterMode == FilterMode.Point) throw new InvalidOperationException("A4: pipeline must not touch non-art assets");
            a4 = 2;
            if (!AssetDatabase.DeleteAsset(scope)) throw new InvalidOperationException("A4: cleanup failed");
            a4 = 3;

            // ---- A5b one-time stock stamp: existing Art/ArtPacks textures become
            //      "already configured" so the pipeline can never rewrite them ----
            string[] guids = AssetDatabase.FindAssets("t:Texture2D", new[] { "Assets/Art", "Assets/ArtPacks" });
            int seen = 0;
            foreach (string g in guids)
            {
                string ap = AssetDatabase.GUIDToAssetPath(g);
                var ti = AssetImporter.GetAtPath(ap) as TextureImporter;
                if (ti == null) continue;
                seen++;
                if (string.IsNullOrEmpty(ti.userData))
                {
                    ti.userData = "fvimport:v1";
                    ti.SaveAndReimport();
                    if (((TextureImporter)AssetImporter.GetAtPath(ap)).userData != "fvimport:v1")
                        throw new InvalidOperationException("A5b: stamp did not persist " + ap);
                    a5++;
                }
            }
            if (seen < 50) throw new InvalidOperationException("A5b: stock inventory implausibly small seen=" + seen);
            // idempotent verification pass: re-runs on an already-stamped stock are
            // a PASS (stamped=0) as long as nothing remains unstamped.
            int unstamped = 0;
            foreach (string g in AssetDatabase.FindAssets("t:Texture2D", new[] { "Assets/Art", "Assets/ArtPacks" }))
            {
                var ti = AssetImporter.GetAtPath(AssetDatabase.GUIDToAssetPath(g)) as TextureImporter;
                if (ti == null) continue;
                if (string.IsNullOrEmpty(ti.userData)) unstamped++;
            }
            if (unstamped > 0)
                throw new InvalidOperationException("A5b: unstamped stock remains: " + unstamped);

            // ---- A3 post: stamp changed ONLY the userData line of texture metas;
            //      audio meta untouched ----
            for (int i = 0; i < keep.Length; i++)
            {
                string after = MetaText(keep[i]);
                if (i < 3)
                {
                    if (StripUserDataLine(before[i]) != StripUserDataLine(after))
                        throw new InvalidOperationException("A3: stock stamp changed more than userData: " + keep[i]);
                    if (after.IndexOf("userData: fvimport:v1") < 0)
                        throw new InvalidOperationException("A3: expected stamp on " + keep[i]);
                }
                else
                {
                    if (before[i] != after)
                        throw new InvalidOperationException("A3: audio meta rewritten: " + keep[i]);
                }
                a3++;
            }

            return "import a0=" + a0 + " a1=" + a1 + " a2=" + a2 + " a3=" + a3 + " a4=" + a4
                 + " a5stamped=" + a5 + " a5seen=" + seen
                 + " total=" + (a0 + a1 + a2 + a3 + a4) + " stones=" + (stones.Length + 2);
        }
    }
}
