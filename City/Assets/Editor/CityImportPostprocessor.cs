// FluxVerse asset import pipeline v1 - P-37 slice 1 (CEO order 2026-09-24 ~11:20).
// Policy: set import defaults for imports whose importer is NOT yet configured;
// everything stamped with the MARK is forever respected as manual configuration.
// Deviation from R-20260924-asset-import.md 3.1 (science-judgment notes, r68):
//  1) "fresh-only via meta file absence" is IMPOSSIBLE under the v2 asset
//     database: ADB2 pre-creates the .meta before OnPreprocessTexture runs
//     (trace-proven, runs 5/6) - so the only usable guard is the userData MARK.
//  2) a one-time stock stamp (ImportProof A5b) marks every PRE-pipeline texture
//     under Art/ArtPacks as already-configured, so the pipeline can never
//     rewrite existing stock (residents-crowd is default-valued AND
//     scene-consumed at PPU100 - a rewrite would resize live sprites 4x+).
//     Stock value fixes stay deliberate importer-edit batches (R- 3.2 step 2/3).
//  3) 2022.3 API fixes vs the spec: TextureImporterCompression.Uncompressed (not
//     None); audio loadType/preloadAudioData live in AudioImporter.SampleSettings.
using UnityEditor;
using UnityEngine;

public class CityImportPostprocessor : AssetPostprocessor
{
    // v2 (r126, P-37 2b-A): marks imports whose stock values were re-verified
    // under the compression-effective regime (default-platform TC=0). v1 stamps
    // predating it stay valid "already configured" marks (non-empty userData).
    const string MARK = "fvimport:v2";

    // PPU tiers (world-law constant: residents 48px/24ppu = 2u per r37; default 16)
    public static int PpuFor(string path)
    {
        if (path.StartsWith("Assets/ArtPacks/residents-crowd/")) return 24;
        // r97 batch1 pool: 32px parts @ 24 = 1.33u body (P-69(1) single-source law)
        if (path.StartsWith("Assets/ArtPacks/residents-atlas/")) return 24;
        // r102 office ladder: 48px boards @ 24 = 2u/floor (P-69(1) tile ladder, r101 list)
        if (path.StartsWith("Assets/ArtPacks/office-ladder/")) return 24;
        // r140 lab glass (P-39(1) labs): 48px-cell pods @ 24 = 2u/cell, pods capped 3u (r139)
        if (path.StartsWith("Assets/ArtPacks/lab-glass/")) return 24;
        return 16;
    }

    void OnPreprocessTexture()
    {
        if (!(assetPath.StartsWith("Assets/Art/") || assetPath.StartsWith("Assets/ArtPacks/")))
            return;
        var ti = (TextureImporter)assetImporter;
        if (!string.IsNullOrEmpty(ti.userData)) return;   // already configured - respect manual edits
        ti.textureType = TextureImporterType.Sprite;
        ti.spriteImportMode = SpriteImportMode.Single;   // sheets stay whole until deliberately sliced
        // r99 P-72 slicing: the 9-cell resident atlas is deliberately Multiple
        // (ResidentProof writes the spriteSheet metadata); a blank reimport must
        // never flatten it back to Single and orphan the scene's subsprite refs.
        if (assetPath == "Assets/ArtPacks/residents-atlas/atlas.png")
            ti.spriteImportMode = SpriteImportMode.Multiple;
        ti.filterMode = FilterMode.Point;
        ti.textureCompression = TextureImporterCompression.Uncompressed;
        ti.mipmapEnabled = false;
        ti.npotScale = TextureImporterNPOTScale.None;
        ti.alphaIsTransparency = true;
        ti.spritePixelsPerUnit = PpuFor(assetPath);
        ti.maxTextureSize = 4096;
        ti.userData = MARK;
    }

    void OnPreprocessAudio()
    {
        if (!assetPath.StartsWith("Assets/Audio/")) return;
        var ai = (AudioImporter)assetImporter;
        if (!string.IsNullOrEmpty(ai.userData)) return;
        // 2022.3 API: loadType/preloadAudioData live in AudioImporter.SampleSettings
        // (spec's AudioImporter.defaultLoadType does not exist in this version).
        var s = ai.defaultSampleSettings;
        if (assetPath.StartsWith("Assets/Audio/music/"))  // long BGM: stream from disc, near-zero RAM (A3 cure)
        {
            s.loadType = AudioClipLoadType.Streaming;
            s.preloadAudioData = false;
            ai.loadInBackground = true;
        }
        else                                               // short SFX/ambience: decompressed PCM, preloaded (A4 cure)
        {
            s.loadType = AudioClipLoadType.DecompressOnLoad;
            s.preloadAudioData = true;
            ai.loadInBackground = false;
        }
        ai.defaultSampleSettings = s;
        ai.userData = MARK;
    }
}
