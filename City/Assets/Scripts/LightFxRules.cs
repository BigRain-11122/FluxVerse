// FluxVerse r158 (P-20260925-09 D3 light-sense trio + D4 restrained sky,
// CEO order 09-25 ~18:00, spec R-20260925-water-daynight.md sec2 item3/4):
// pure rules table for the light-fx line. Source law =
// Tools/city/lightfx-manifest.json (the r157 sandbox + 24-asset bake, 20
// checks green; single geometry source - WaterFxRules/OfficeRules idiom).
// Z PHYSICS LAW (r158, manifest v0.2): CityCamera sits at z -10 looking +z
// (scene-verified), so SMALLER z = nearer = renders ON TOP within one
// sortingOrder (the r155 water line authored it correctly). The r157 sandbox
// authored the z map under the inverted convention; the engine round
// re-anchors every z sign to the physically verified law: bloom +0.40.. sits
// BEHIND its host sign (z 0), cone -0.5 over the post foot, wet -0.15 over
// the road surface, stars +0.5 behind the far skyline (z 0), horizon +1.0
// deepest of the order -9 family. Without the flip the wet strips render
// behind the Roads tilemap (same order 2, z 0) = invisible (the make-or-break
// case that exposed the inversion).
// Families = 57 mounts: bloom 17 halos (one per shop sign, the 4 MountExempt
// structure rows out; NeonQuantL/R twins share bloom-quant.png - 16 files
// serve 17 mounts, r149 pair-dup precedent) + 12 lamp cones + 6 wet strips +
// 22 stars. Bloom px derive from the LIVE NeonRules sign table (px law:
// round-half-up(world size * 1.7 / * 1.6 * 16), r157 banker's-rounding law),
// cone geometry derives from the builder lamp-post arrays, wet rects mirror
// the NeonRules.Buildings spans - the proof recomputes everything against
// the manifest and the live tables (stale-copy law r10).
// Tier alpha (manifest tier_alpha_pct / 100): bloom day .20 / dawn .45 /
// dusk .80 / night 1; cone 0 / .40 / .80 / 1; wet 0 / .15 / .40 / .60; stars
// night-only 1 (twinkle multiplies). Horizon band = the CityAmbient family
// (alpha dawn .35 / dusk .75 (r181 v0.3 salience promotion, duskgold-manifest)
// / day+night 0; color = AmbientWheel skyBottom). Depth fog wash = the second
// CityAmbient family (r181 v0.3, duskgold-manifest.depth_fog_wash): one
// dusk-only mauve veil over the north bank, variant B tile-city-only.
// Star twinkle: steps [100,55,25,55] x 0.5s (2s cycle), per-star phase =
// index mod 4. ASCII. No 3D.
using System;
using UnityEngine;

namespace FluxVerse
{
    public static class LightFxRules
    {
        public const string Protocol = "fluxverse-lightfx/0.3";
        public const int BakedRound = 184;
        public const string NamePrefix = "LightFx";

        // ---- families ----
        public const int FamilyBloom = 0, FamilyCone = 1, FamilyWet = 2, FamilyStars = 3;
        public const int BloomCount = 17, ConeCount = 12, WetCount = 6, StarCount = 22;
        public const int MountCount = 57;                       // 17 + 12 + 6 + 22
        public const int BloomFirst = 0, ConeFirst = 17, WetFirst = 29, StarsFirst = 35;

        // ---- render orders + z (r158 physics law: smaller z = on top) ----
        public const int OrderBloom = 6;    public const float ZBloomBase = 0.40f;
        public const int OrderCone = 4;     public const float ZCone = -0.5f;
        public const int OrderWet = 2;      public const float ZWet = -0.15f;
        public const int OrderStars = -9;   public const float ZStars = 0.5f;
        // bloom intra-family step (r119 tie law): the wide halos overlap
        // (Bigmoney crown x the QUANT flank pair) so no two blooms share one z
        public const float BloomZStep = 0.002f;

        public static int OrderOf(int i)
        {
            int f = Table[i].family;
            return f == FamilyBloom ? OrderBloom : (f == FamilyCone ? OrderCone
                 : (f == FamilyWet ? OrderWet : OrderStars));
        }

        public static float ZOf(int i)
        {
            int f = Table[i].family;
            if (f == FamilyBloom) return ZBloomBase + (i - BloomFirst) * BloomZStep;
            if (f == FamilyCone) return ZCone;
            if (f == FamilyWet) return ZWet;
            return ZStars;
        }

        // ---- tier alpha maps (manifest tier_alpha_pct / 100) ----
        public static float BloomAlphaFor(AmbientTier t)
        {
            switch (t)
            {
                case AmbientTier.Day: return 0.20f;
                case AmbientTier.Dawn: return 0.45f;
                case AmbientTier.Dusk: return 0.80f;
                default: return 1.00f;
            }
        }

        public static float ConeAlphaFor(AmbientTier t)
        {
            switch (t)
            {
                case AmbientTier.Day: return 0f;
                case AmbientTier.Dawn: return 0.40f;
                case AmbientTier.Dusk: return 0.80f;
                default: return 1.00f;
            }
        }

        public static float WetAlphaFor(AmbientTier t)
        {
            switch (t)
            {
                case AmbientTier.Day: return 0f;
                case AmbientTier.Dawn: return 0.15f;
                case AmbientTier.Dusk: return 0.40f;
                default: return 0.60f;
            }
        }

        // stars: night-only (the twinkle multiplies)
        public static float StarAlphaFor(AmbientTier t)
        { return t == AmbientTier.Night ? 1f : 0f; }

        public static float AlphaOf(int i, AmbientTier t)
        {
            int f = Table[i].family;
            return f == FamilyBloom ? BloomAlphaFor(t)
                 : (f == FamilyCone ? ConeAlphaFor(t)
                 : (f == FamilyWet ? WetAlphaFor(t) : StarAlphaFor(t)));
        }

        // ---- star twinkle ----
        public const float TwinkleStepSec = 0.5f;
        public static readonly int[] TwinkleSteps = new int[] { 100, 55, 25, 55 };

        public static float TwinkleFactor(int starIdx, int step)
        {
            int s = (((step + starIdx) % 4) + 4) % 4;   // phase = index mod 4
            return TwinkleSteps[s] / 100f;
        }

        public static float StarMountAlpha(int starIdx, AmbientTier t, int step)
        {
            return StarAlphaFor(t) * TwinkleFactor(starIdx, step);
        }

        // ---- bloom px law (round-half-up; r157 banker's-rounding law) ----
        public static int BloomPxW(int signIdx)
        { return (int)Math.Floor(NeonRules.WorldW(signIdx) * 1.7f * 16f + 0.5f); }

        public static int BloomPxH(int signIdx)
        { return (int)Math.Floor(NeonRules.WorldH(signIdx) * 1.6f * 16f + 0.5f); }

        // ---- lamp-cone geometry (builder t_prop_post arrays = source) ----
        public const int ConeNorthRow = 3, ConeSouthRow = -4;
        public static readonly int[] ConeNorthX = new int[] { -28, -20, -12, 12, 20, 28 };
        public static readonly int[] ConeSouthX = new int[] { -24, -16, -8, 8, 16, 24 };
        public const int ConePxW = 40, ConePxH = 24;            // 2.5 x 1.5u @PPU16
        public const float ConePoolEastOfCell = 1.5f;           // head arm faces east
        public const float ConeNorthY = 67f / 16f;               // 4.1875
        public const float ConeSouthY = -69f / 16f;              // -4.3125

        // ---- horizon band (CityAmbient family, no baked asset) ----
        public const int HorizonCount = 2;
        public const int HorizonOrder = -9;
        public const float HorizonZ = 1.0f;                      // deepest of order -9
        public const float HorizonY0 = 268f / 16f;               // 16.75
        public const float HorizonY1 = 302f / 16f;               // 18.875
        // r181 v0.3 (duskgold-manifest.horizon_band_salience): dusk 50 -> 75 -
        // the golden glow read faint at dusk (r158 honest note; the sky_low
        // census 320deg pink-mauve = "purple only no gold" critique root).
        // r184 closure: 75 -> 85 - the faithful-baseline census measured
        // +3.11 < the +4.0 gate (the authored top-fade ramp dilutes the
        // full-window mean); blend is linear in delta-alpha, gate unchanged.
        public const float HorizonAlphaDawn = 0.35f, HorizonAlphaDusk = 0.85f;

        public static float HorizonX0(int i) { return i == 0 ? -736f / 16f : 218f / 16f; }
        public static float HorizonX1(int i) { return i == 0 ? 198f / 16f : 736f / 16f; }

        public static string HorizonName(int i)
        { return i == 0 ? "AmbientHorizonWest" : "AmbientHorizonEast"; }

        public static float HorizonAlphaFor(AmbientTier t)
        {
            if (t == AmbientTier.Dawn) return HorizonAlphaDawn;
            if (t == AmbientTier.Dusk) return HorizonAlphaDusk;
            return 0f;   // day + night: the glow is a sunrise/sunset phenomenon
        }

        public static Color HorizonColorFor(AmbientTier t)
        { return AmbientWheel.PaletteFor(t).skyBottom; }

        // ---- depth fog wash (r181 v0.3, duskgold-manifest.depth_fog_wash) ----
        // Census-gated and TRIGGERED (r180 delta 7.0 < 12.0): one runtime quad
        // veiling the far (north) bank - atmospheric perspective, the
        // "far/near read as one flat sheet" defect. CityAmbient family
        // (EnsureVisuals/ReleaseVisuals + tier/blend ride, horizon-band
        // precedent). VARIANT B (manifest decision procedure): tile-city-only
        // fog - zero RimLight/Neon/Robot coupling (variant A order 8 would
        // veil rim 5 / signs 6 / street 7 too = a strictly larger coupling
        // surface). The manifest's "order 4.5" slot is realized with the int
        // sortingOrder 4 + z -0.1: nearer than the Props tilemap (z 0, same
        // order) = renders above it; above the order-3 facades / labs /
        // windowlights; below rim 5 / signs 6 / street 7 / tint 8 (r158
        // physics law: smaller z = nearer = on top). The order-4 lamp cones
        // (z -0.5) sit above the fog - zero visual overlap (cones y 4.2,
        // fog band y 8..14). Alpha dusk-only; color = the skyline mauve fog
        // family single source.
        public const string FogWashName = "AmbientFogWash";
        public const int FogWashOrder = 4;
        public const float FogWashZ = -0.1f;
        public const float FogWashX0 = -36f, FogWashY0 = 8f, FogWashX1 = 36f, FogWashY1 = 14f;
        public const float FogAlphaDusk = 0.25f;   // r183: 15 -> 25 - c4 near-miss closure (alpha 15 measured delta 11.1 < gate 12.0; linear lift ~0.27 lum/alpha-unit, gate unchanged)

        public static float FogWashAlphaFor(AmbientTier t)
        {
            return t == AmbientTier.Dusk ? FogAlphaDusk : 0f;   // day/dawn/night zero
        }

        // single source = the skyline mauve fog family (SkylineRules.FogFar
        // dusk = 0.62/0.58/0.78 = rgb 158,148,199 per the manifest)
        public static Color FogWashColor()
        { return SkylineRules.FogFar(AmbientTier.Dusk); }

        // ---- star field (1/16 art grid, r147 snap law) ----
        static readonly int[] StarX16 = new int[]
        {
            -544, -499, -456, -409, -365, -319, -273, -229, -186, -141, -96,
            95, 137, 175, 245, 288, 331, 376, 422, 467, 507, 537
        };
        static readonly int[] StarY16 = new int[]
        {
            297, 273, 291, 271, 296, 277, 288, 281, 301, 272, 293,
            276, 299, 280, 295, 274, 288, 279, 297, 275, 293, 284
        };
        public const int StarBandY16Lo = 271, StarBandY16Hi = 301;
        public const int StarX16Lo = -544, StarX16Hi = 537;
        public const int StarTowerZoneX16 = 56;                  // |x16| <= 56 excluded
        public const int StarGapX16Lo = 198, StarGapX16Hi = 218; // CameraProof x=13 column
        public const int StarMinPairDist16 = 28;                 // 1.75u

        public static int StarX16At(int i) { return StarX16[i]; }
        public static int StarY16At(int i) { return StarY16[i]; }

        // ---- mount table ----
        public struct Mount
        {
            public string name;             // scene GO name (ASCII)
            public string path;            // project-relative asset path
            public int pxW, pxH;           // tight sprite pixels
            public float ppu;              // importer tier (16 default)
            public float x0, y0, x1, y1;   // world rect
            public int family;             // Family* constant
        }

        // bloom rows: live NeonRules sign index + asset leaf (twin share law:
        // QuantL/R both point at bloom-quant.png). Sign order mirrors the
        // manifest mounts (proof cross-checks row-by-row).
        static readonly int[] BloomSign = new int[]
        { 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 13, 14, 15, 16, 17 };
        static readonly string[] BloomLeaf = new string[]
        {
            "bloom-hotel", "bloom-gamewest", "bloom-gamewest2", "bloom-mediaeast",
            "bloom-mediaroof", "bloom-quant", "bloom-quant", "bloom-nescroll",
            "bloom-nopen", "bloom-nmids", "bloom-kiosk", "bloom-flux",
            "bloom-cph4", "bloom-biggame", "bloom-bigmoney", "bloom-bigstream",
            "bloom-biglife"
        };
        public static int BloomSignIdx(int i) { return BloomSign[i - BloomFirst]; }

        // wet rows: manifest id + asset leaf + rect (mirrors NeonRules.Buildings spans)
        static readonly string[] WetId = new string[]
        { "WetQuant", "WetGame", "WetMedia", "WetNorthW", "WetNorthM", "WetNorthE" };
        static readonly string[] WetLeaf = new string[]
        { "wet-quant", "wet-game", "wet-media", "wet-nw", "wet-nm", "wet-ne" };
        static readonly float[] WetR = new float[]
        {
            -2f, -8f,  3f, -6f,
            -23f, -8f, -18f, -6f,
            19f, -8f, 25f, -6f,
            -9f, 7f, -6f, 9f,
            7f, 7f, 10f, 9f,
            26f, 7f, 29f, 9f
        };

        static readonly Mount[] Table = BuildTable();

        static Mount[] BuildTable()
        {
            Mount[] t = new Mount[MountCount];
            // bloom: derived from the live sign table (center = sign center;
            // px = the 1.7x/1.6x law; rect = center +- world/2)
            for (int i = 0; i < BloomCount; i++)
            {
                int s = BloomSign[i];
                NeonRules.Sign sg = NeonRules.At(s);
                int pw = BloomPxW(s), ph = BloomPxH(s);
                float w = pw / 16f, h = ph / 16f;
                t[BloomFirst + i] = new Mount
                {
                    name = "LightFxBloom" + sg.name.Substring(4),
                    path = "Assets/ArtPacks/light-fx/" + BloomLeaf[i] + ".png",
                    pxW = pw, pxH = ph, ppu = 16f,
                    x0 = sg.x - w * 0.5f, y0 = sg.y - h * 0.5f,
                    x1 = sg.x + w * 0.5f, y1 = sg.y + h * 0.5f,
                    family = FamilyBloom
                };
            }
            // cones: pool center = post cell + 1.5 east, y16 67 / -69
            for (int i = 0; i < ConeNorthX.Length; i++)
            {
                float cx = ConeNorthX[i] + ConePoolEastOfCell;
                t[ConeFirst + i] = new Mount
                {
                    name = "LightFxConeN0" + (i + 1),
                    path = "Assets/ArtPacks/light-fx/lamp-pool.png",
                    pxW = ConePxW, pxH = ConePxH, ppu = 16f,
                    x0 = cx - 1.25f, y0 = ConeNorthY - 0.75f,
                    x1 = cx + 1.25f, y1 = ConeNorthY + 0.75f,
                    family = FamilyCone
                };
            }
            for (int i = 0; i < ConeSouthX.Length; i++)
            {
                float cx = ConeSouthX[i] + ConePoolEastOfCell;
                t[ConeFirst + 6 + i] = new Mount
                {
                    name = "LightFxConeS0" + (i + 1),
                    path = "Assets/ArtPacks/light-fx/lamp-pool.png",
                    pxW = ConePxW, pxH = ConePxH, ppu = 16f,
                    x0 = cx - 1.25f, y0 = ConeSouthY - 0.75f,
                    x1 = cx + 1.25f, y1 = ConeSouthY + 0.75f,
                    family = FamilyCone
                };
            }
            // wet: rect literals (NeonRules.Buildings spans; proof cross-checks)
            for (int i = 0; i < WetCount; i++)
            {
                float x0 = WetR[i * 4], y0 = WetR[i * 4 + 1], x1 = WetR[i * 4 + 2], y1 = WetR[i * 4 + 3];
                t[WetFirst + i] = new Mount
                {
                    name = "LightFx" + WetId[i],
                    path = "Assets/ArtPacks/light-fx/" + WetLeaf[i] + ".png",
                    pxW = (int)Math.Floor((x1 - x0) * 16f + 0.5f), pxH = 32,
                    ppu = 16f, x0 = x0, y0 = y0, x1 = x1, y1 = y1,
                    family = FamilyWet
                };
            }
            // stars: 1/16 grid centers
            for (int i = 0; i < StarCount; i++)
            {
                float cx = StarX16[i] / 16f, cy = StarY16[i] / 16f;
                t[StarsFirst + i] = new Mount
                {
                    name = "LightFxStar" + i.ToString("00"),
                    path = "Assets/ArtPacks/light-fx/star-point.png",
                    pxW = 3, pxH = 3, ppu = 16f,
                    x0 = cx - 0.09375f, y0 = cy - 0.09375f,
                    x1 = cx + 0.09375f, y1 = cy + 0.09375f,
                    family = FamilyStars
                };
            }
            return t;
        }

        public static Mount At(int i) { return Table[i]; }
        public static string Name(int i) { return Table[i].name; }
        public static string Path(int i) { return Table[i].path; }
        public static int PxW(int i) { return Table[i].pxW; }
        public static int PxH(int i) { return Table[i].pxH; }
        public static float Ppu(int i) { return Table[i].ppu; }
        public static int FamilyOf(int i) { return Table[i].family; }
        public static float X0(int i) { return Table[i].x0; }
        public static float Y0(int i) { return Table[i].y0; }
        public static float X1(int i) { return Table[i].x1; }
        public static float Y1(int i) { return Table[i].y1; }
        public static float WorldW(int i) { return Table[i].x1 - Table[i].x0; }
        public static float WorldH(int i) { return Table[i].y1 - Table[i].y0; }
        public static float CenterX(int i) { return (Table[i].x0 + Table[i].x1) * 0.5f; }
        public static float CenterY(int i) { return (Table[i].y0 + Table[i].y1) * 0.5f; }

        // natural-size law: sprite world size = px / ppu == the rect (scale 1)
        public static bool NaturalSizeMatches(int i, Sprite s)
        {
            float w = s.rect.width / Table[i].ppu, h = s.rect.height / Table[i].ppu;
            return Mathf.Abs(w - WorldW(i)) < 1e-4f && Mathf.Abs(h - WorldH(i)) < 1e-4f;
        }
    }
}
