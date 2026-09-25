// FluxVerse P-38(1) r148 (dusk rim-light layer): pure core - the engine mirror
// of Tools/city/rimlight-manifest.json (the r147 sandbox, 133 assertions green;
// that manifest = the single parameter source for THIS round, LabsRules
// manifest-mirror idiom). First aesthetics-upgrade slice: the art-target-dusk
// hero reads as building TOP edges lit by the horizon glow BEHIND the city
// (r147 first-hand correction: the rim is CENTRIPETAL - it faces the sunset
// band behind the QUANT twist tower, NOT a uniform west side; strength falls
// off with horizontal distance from that band; the outermost buildings fade
// to near-nothing). v0 = roofline strips only (the target image's most stable,
// brightest rim position); vertical glow-facing corner strips are reserved v1.
//   laws mirrored from the manifest (fluxverse-rimlight/0.1):
//   - containment: every roof segment = the top 2 art px INSIDE its building
//     rect - zero floating pixels by construction (r147 sandbox A3).
//   - pixel-art edge: hard top row + 1-step dither decay, no blur, no halo.
//   - tier gate: dusk-only v0 (dawn rim reserved); every other tier = alpha 0.
//   - color: honey orange = AMBIENT channel (dusk tint family), five-color
//     functional law untouched; segments within 1.5u of the glow center take
//     the brighter core color (QUANT roof + brain wedge tip + both shoulders).
//   - render order 5: first free slot above the tilemaps (0..4), below the
//     signs (6) / tint (8) / band (9) / pulses (10) - the CEO pulse stays
//     above the rim (CEO-precedence law, r146 mood gate).
//   - r146 input-clamp note: a multiplicative tint can only dim, so the rim
//     is a NORMAL alpha-blended bright color, never an RGB>1 tint.
// Proof surface: RimLightProof A cross-checks THIS mirror against the
// manifest JSON; RimLightProof B/C gate the wiring census + tier law;
// RimLightProof D gates the render differential census (dusk on-vs-off per
// segment, day/night zero-delta); reload gate re-verifies across a restart.
// ASCII. Pure static core, no MonoBehaviour. No 3D.
using UnityEngine;

namespace FluxVerse
{
    public static class RimLightRules
    {
        public const string Protocol = "fluxverse-rimlight/0.1";
        public const int BakedRound = 147;               // manifest origin (single parameter source)
        public const int SegmentCount = 11;

        // render.order: free slot above tilemaps 0..4, below signs 6 / street 7 /
        // tint 8 / band 9 / pulses 10 / drops 12 (CEO pulse 10 stays above = law)
        public const int SortOrder = 5;

        // art grid: 1 art px = 1/16 u (manifest rect coordinates snap to this grid)
        public const float ArtPx = 1f / 16f;
        public const int RoofArtPx = 2;                 // thickness.roof_art_px
        public const float ThicknessU = 0.125f;          // thickness.world_u (2 art px)
        public const int DitherRows = 2;                 // dither.art_rows length

        // dither.art_rows: [0] = hard TOP row, [1] = 1-step decay below it
        public static float DitherRowAlpha(int rowFromTop)
        {
            if (rowFromTop == 0) return 0.80f;
            return 0.38f;
        }

        // glow.center_x: sunset horizon band behind the QUANT tower (hero position)
        public const float GlowCenterX = 0.5f;

        // color.* (hex refs #FFBE7D main / #FFD9A0 core) - AMBIENT channel
        public static readonly Color MainColor = new Color(1.0f, 0.745f, 0.49f, 1f);
        public static readonly Color CoreColor = new Color(1.0f, 0.851f, 0.627f, 1f);
        public const float CoreMaxDist = 1.5f;          // color.core_max_dist

        // falloff.bands: closed cover, first band whose max_dist covers wins
        public const int FalloffBandCount = 3;
        public static float BandMaxDist(int b)
        {
            if (b == 0) return 10f;
            if (b == 1) return 24f;
            return 99f;
        }
        public static float BandStrength(int b)
        {
            if (b == 0) return 1.0f;
            if (b == 1) return 0.55f;
            return 0.25f;
        }

        // segments (manifest order; rect = [x0, y0, x1, y1] world u, y1-y0 = 2 art px)
        static readonly string[] Ids = {
            "RimQuantTop",        // QUANT twist-tower roof (glow-center hero, core color)
            "RimGameMainTop",     // GAME_MAIN tower roof
            "RimGameAnnexTop",    // GAME_ANNEX low block roof (builder Block, off the sign table)
            "RimMediaTop",        // MEDIA roofline (full-width Block strip, silhouette-faithful)
            "RimNWTop",           // north-west low roof
            "RimNWMidTop",        // north-west-mid low roof
            "RimNEMidTop",        // north-east-mid low roof
            "RimNETop",          // north-east low roof
            "RimBrainTip",        // brain tower wedge tip (row 18 top at 19)
            "RimBrainShoulderW",  // shoulder row 17 exposed west of the tip footprint
            "RimBrainShoulderE"   // shoulder row 17 exposed east of the tip footprint
        };
        static readonly float[,] Rects = {
            { -2.0f, -8.125f,   3.0f, -8.0f  },
            { -23.0f, -11.125f, -18.0f, -11.0f },
            { -26.0f, -13.125f, -25.0f, -13.0f },
            { 19.0f, -8.125f,  25.0f, -8.0f  },
            { -28.0f, 11.875f, -25.0f, 12.0f  },
            { -9.0f, 11.875f,  -6.0f, 12.0f  },
            { 7.0f, 11.875f,  10.0f, 12.0f  },
            { 26.0f, 11.875f,  29.0f, 12.0f  },
            { 0.0f, 18.875f,   1.0f, 19.0f  },
            { -1.0f, 17.875f,   0.0f, 18.0f  },
            { 1.0f, 17.875f,   2.0f, 18.0f  }
        };

        public static string Id(int i) { return Ids[i]; }
        public static float X0(int i) { return Rects[i, 0]; }
        public static float Y0(int i) { return Rects[i, 1]; }
        public static float X1(int i) { return Rects[i, 2]; }
        public static float Y1(int i) { return Rects[i, 3]; }
        public static float CenterX(int i) { return (Rects[i, 0] + Rects[i, 2]) * 0.5f; }
        public static float WidthU(int i) { return Rects[i, 2] - Rects[i, 0]; }
        public static int ArtPxWidth(int i) { return Mathf.RoundToInt(WidthU(i) / ArtPx); }

        // falloff.metric = abs(segment_center_x - glow.center_x)
        public static float DistFor(int i) { return Mathf.Abs(CenterX(i) - GlowCenterX); }

        public static float StrengthForDist(float dist)
        {
            for (int b = 0; b < FalloffBandCount; b++)
                if (dist <= BandMaxDist(b)) return BandStrength(b);
            return BandStrength(FalloffBandCount - 1);
        }
        public static float StrengthFor(int i) { return StrengthForDist(DistFor(i)); }

        // core law: near the glow center the rim takes the brighter core color
        public static bool IsCore(int i) { return DistFor(i) <= CoreMaxDist; }
        public static Color BaseColorFor(int i) { return IsCore(i) ? CoreColor : MainColor; }

        // tier_gate.tiers == ["dusk"] (dusk-only v0; dawn reserved)
        public static bool TierShows(AmbientTier t) { return t == AmbientTier.Dusk; }

        // renderer alpha for segment i: the falloff strength when the tier shows
        // rims, hard zero otherwise (instant switch = ApplyAmbient family law).
        // The per-art-row dither alphas live in the texture; this alpha carries
        // the strength, so effective top-row alpha = dither[0] x strength.
        public static float AlphaFor(int i, AmbientTier t)
        {
            return TierShows(t) ? StrengthFor(i) : 0f;
        }
    }
}
