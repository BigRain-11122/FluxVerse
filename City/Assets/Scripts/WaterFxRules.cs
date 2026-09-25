// FluxVerse r155 (P-20260925-09 water & daynight CEO order 09-25 ~18:00,
// spec R-20260925-water-daynight.md): pure rules table for the water-fx line
// (W1 frame cycle / W2 reflections / W3 foam / W4 shimmer / W5 rain law).
// Source law = Tools/city/waterfx-manifest.json (the r154 sandbox+asset bake,
// 27 assertions green; single geometry source - OfficeRules/LabsRules idiom,
// person/city data stays out per the r10 stale-copy law).
// Band law: builder live anchor cells x -50..50 rows -3..2 -> 6 x 101 = 606
// painted cells; the SetTile sweep swaps VARIANTS only, never adds/removes
// cells (census identity). The saved scene keeps the builder's static paint
// hash as the boot state; the cycling law rewrites the full band on the
// adapter's first tick (manifest frame_cycle.first_tick).
// Frame law (W1): at water tick t, cell (x,y) shows frame
// ((x*31 + y*17 + t) mod 8) - the builder's spatial hash becomes the per-cell
// phase offset (31 mod 8 = 7 -> neighbors mostly anti-phase, staggered
// wavefront). Fallback = mod 4 over the legacy registered set t_water_0/2/3/4
// (stays legal if a cycle tile ever fails to import).
// Tier law (W2 night must show): refl + shimmer alpha day/dawn 0, dusk 0.55,
// night 1.0; foam is the bank line - always 1.0. Dawn has no manifest row and
// maps to the day family (sunrise glow: no reflection band) - honest note in
// the TECH r155 row, proof gates the closed map.
// Wobble law (W5): x offset sequence [0, +1/16, -1/16, 0] world u per water
// tick (1 art px @ ppu16); rain doubles it. Foam stays pinned to the bank.
// Sibling render order (manifest sibling_order water < refl < shimmer < foam):
// one sorting order 2 (above the Water tilemap 1, below street 7 / tint 8 -
// reflections receive the dusk/night tint like all city furniture; the Roads
// tilemap also sits at order 2, zero spatial overlap), distinct z so the
// same-order tie never falls to load order (r119 law): smaller z = on top.
// GAME_ANNEX reflection omitted v0 (spec W2 scope = three cities, manifest
// honest_notes). ASCII. No 3D.
using UnityEngine;

namespace FluxVerse
{
    public static class WaterFxRules
    {
        public const string Protocol = "fluxverse-waterfx/0.1";
        public const int BakedRound = 154;

        // ---- water band (builder live anchor) ----
        public const int CellX0 = -50, CellX1 = 50, RowY0 = -3, RowY1 = 2;
        public const int CensusBaseline = 606;   // (101 cells) x (6 rows)

        // ---- W1 frame cycle ----
        public const int FrameSlots = 8;          // t_water_0 .. t_water_7
        public const int FallbackFrames = 4;      // legacy registered set
        public const float TickSec = 0.5f;        // 2 fps
        public const float TickSecRain = 0.25f;   // 4 fps (W5)

        public static string FrameTileName(int slot) { return "t_water_" + slot; }

        public static int FrameSlotFor(int x, int y, int t)
        {
            return (((x * 31 + y * 17 + t) % FrameSlots) + FrameSlots) % FrameSlots;
        }

        // fallback: mod 4 over the registered vocabulary t_water_0/2/3/4
        public static int FallbackSlotFor(int x, int y, int t)
        {
            int f = (((x * 31 + y * 17 + t) % FallbackFrames) + FallbackFrames) % FallbackFrames;
            return f == 0 ? 0 : (f == 1 ? 2 : (f == 2 ? 3 : 4));
        }

        // ---- tier alpha (W2; scope = refl + shimmer; foam = bank line) ----
        public const float AlphaDay = 0f;
        public const float AlphaDawn = 0f;      // day family (no manifest row - honest note)
        public const float AlphaDusk = 0.55f;
        public const float AlphaNight = 1f;
        public const float FoamAlpha = 1f;

        public static float TierAlpha(AmbientTier t)
        {
            switch (t)
            {
                case AmbientTier.Dusk: return AlphaDusk;
                case AmbientTier.Night: return AlphaNight;
                default: return AlphaDay;   // Day + Dawn
            }
        }

        // ---- W3 foam ----
        public const int FoamFrames = 4;         // foam frame = water tick mod 4

        public static string FoamAssetPath(bool north, int frame)
        {
            return "Assets/ArtPacks/water-fx/foam-" + (north ? "n" : "s") + "-" + frame + ".png";
        }

        // ---- W5 wobble ----
        public const float WobbleStepU = 0.0625f;   // 1 art px @ ppu16

        public static float WobbleOffset(int tick, bool rain)
        {
            int i = ((tick % 4) + 4) % 4;
            float o = i == 0 ? 0f : (i == 1 ? WobbleStepU : (i == 2 ? -WobbleStepU : 0f));
            return rain ? o * 2f : o;
        }

        // ---- render family law ----
        public const int SortOrder = 2;          // above Water tilemap (1), below street 7 / tint 8
        public const float ReflZ = 0.3f;          // deepest (below shimmer, below foam)
        public const float ShimmerZ = 0.2f;
        public const float FoamZ = 0.1f;          // smallest z = on top (r119 tie law)

        // ---- mount table (12 = 4 refl + 6 shimmer + 2 foam) ----
        public const int MountCount = 12;
        public const int ReflCount = 4, ShimCount = 6, FoamCount = 2;
        public const int FamilyRefl = 0, FamilyShim = 1, FamilyFoam = 2;
        public const string NamePrefix = "WaterFx";

        public struct Mount
        {
            public string name;             // scene GO name (ASCII)
            public string path;            // project-relative asset path
            public int pxW, pxH;           // tight sprite pixels
            public float ppu;              // importer tier
            public float x0, y0, x1, y1;   // world rect min/max corners
            public int family;             // Family* constant
            public string sign;            // shimmer: mounting sign GO name ("" otherwise)
            public int foamBase;            // foam: sprite index base (0 = north, 4 = south)
        }

        static readonly Mount[] Table = new Mount[]
        {
            // W2 reflections - mirror semantics: the object edge nearest the
            // water lands on the bank line (roof crown at the bank edge).
            new Mount { name = "WaterFxReflTower", path = "Assets/ArtPacks/water-fx/refl-tower.png",
                        pxW = 80, pxH = 48, ppu = 16f, x0 = -2f, y0 = 0f, x1 = 3f, y1 = 3f,
                        family = FamilyRefl, sign = "", foamBase = 0 },
            new Mount { name = "WaterFxReflQuant", path = "Assets/ArtPacks/water-fx/facades/refl-quant.png",
                        pxW = 120, pxH = 72, ppu = 24f, x0 = -2f, y0 = -3f, x1 = 3f, y1 = 0f,
                        family = FamilyRefl, sign = "", foamBase = 0 },
            new Mount { name = "WaterFxReflGame", path = "Assets/ArtPacks/water-fx/facades/refl-game.png",
                        pxW = 120, pxH = 72, ppu = 24f, x0 = -23f, y0 = -3f, x1 = -18f, y1 = 0f,
                        family = FamilyRefl, sign = "", foamBase = 0 },
            new Mount { name = "WaterFxReflMedia", path = "Assets/ArtPacks/water-fx/facades/refl-media.png",
                        pxW = 144, pxH = 72, ppu = 24f, x0 = 19f, y0 = -3f, x1 = 25f, y1 = 0f,
                        family = FamilyRefl, sign = "", foamBase = 0 },
            // W4 shimmer - the outermost sign pair per city (overlap-free by
            // construction: 1.5u mounts centered on sign x, neighbor signs
            // > 1.5u apart at the outer pair). Center plates NeonBigmoney /
            // NeonBiggame omitted - their glow is carried by the refl crown.
            new Mount { name = "WaterFxShimGameW", path = "Assets/ArtPacks/water-fx/shimmer-cyan.png",
                        pxW = 24, pxH = 40, ppu = 16f, x0 = -23.25f, y0 = -3f, x1 = -21.75f, y1 = -0.5f,
                        family = FamilyShim, sign = "NeonGameWest", foamBase = 0 },
            new Mount { name = "WaterFxShimGameE", path = "Assets/ArtPacks/water-fx/shimmer-cyan.png",
                        pxW = 24, pxH = 40, ppu = 16f, x0 = -20.45f, y0 = -3f, x1 = -18.95f, y1 = -0.5f,
                        family = FamilyShim, sign = "NeonGameWest2", foamBase = 0 },
            new Mount { name = "WaterFxShimQuantW", path = "Assets/ArtPacks/water-fx/shimmer-gold.png",
                        pxW = 24, pxH = 40, ppu = 16f, x0 = -2.2f, y0 = -3f, x1 = -0.7f, y1 = -0.5f,
                        family = FamilyShim, sign = "NeonQuantL", foamBase = 0 },
            new Mount { name = "WaterFxShimQuantE", path = "Assets/ArtPacks/water-fx/shimmer-gold.png",
                        pxW = 24, pxH = 40, ppu = 16f, x0 = 0.7f, y0 = -3f, x1 = 2.2f, y1 = -0.5f,
                        family = FamilyShim, sign = "NeonQuantR", foamBase = 0 },
            new Mount { name = "WaterFxShimMediaE", path = "Assets/ArtPacks/water-fx/shimmer-magenta.png",
                        pxW = 24, pxH = 40, ppu = 16f, x0 = 19.45f, y0 = -3f, x1 = 20.95f, y1 = -0.5f,
                        family = FamilyShim, sign = "NeonMediaEast", foamBase = 0 },
            new Mount { name = "WaterFxShimMediaR", path = "Assets/ArtPacks/water-fx/shimmer-magenta.png",
                        pxW = 24, pxH = 40, ppu = 16f, x0 = 21.65f, y0 = -3f, x1 = 23.15f, y1 = -0.5f,
                        family = FamilyShim, sign = "NeonMediaRoof", foamBase = 0 },
            // W3 foam - 1px bank line + sparse bubble row (embankment gradient
            // v0), 4 frames synced to the water tick; foam is bank-pinned.
            new Mount { name = "WaterFxFoamN", path = "Assets/ArtPacks/water-fx/foam-n-0.png",
                        pxW = 1600, pxH = 2, ppu = 16f, x0 = -50f, y0 = 2.875f, x1 = 50f, y1 = 3f,
                        family = FamilyFoam, sign = "", foamBase = 0 },
            new Mount { name = "WaterFxFoamS", path = "Assets/ArtPacks/water-fx/foam-s-0.png",
                        pxW = 1600, pxH = 2, ppu = 16f, x0 = -50f, y0 = -3f, x1 = 50f, y1 = -2.875f,
                        family = FamilyFoam, sign = "", foamBase = 4 },
        };

        public static Mount At(int i) { return Table[i]; }
        public static string Name(int i) { return Table[i].name; }
        public static string Path(int i) { return Table[i].path; }
        public static int PxW(int i) { return Table[i].pxW; }
        public static int PxH(int i) { return Table[i].pxH; }
        public static int FamilyOf(int i) { return Table[i].family; }
        public static string SignOf(int i) { return Table[i].sign; }
        public static int FoamBase(int i) { return Table[i].foamBase; }
        public static float X0(int i) { return Table[i].x0; }
        public static float Y0(int i) { return Table[i].y0; }
        public static float X1(int i) { return Table[i].x1; }
        public static float Y1(int i) { return Table[i].y1; }
        public static float WorldW(int i) { return Table[i].x1 - Table[i].x0; }
        public static float WorldH(int i) { return Table[i].y1 - Table[i].y0; }
        public static float CenterX(int i) { return (Table[i].x0 + Table[i].x1) * 0.5f; }
        public static float CenterY(int i) { return (Table[i].y0 + Table[i].y1) * 0.5f; }

        public static float ZOf(int i)
        {
            return Table[i].family == FamilyRefl ? ReflZ
                 : (Table[i].family == FamilyShim ? ShimmerZ : FoamZ);
        }

        // natural-size law: sprite world size = px / ppu == the rect (scale 1)
        public static bool NaturalSizeMatches(int i, Sprite s)
        {
            float w = s.rect.width / Table[i].ppu, h = s.rect.height / Table[i].ppu;
            return Mathf.Abs(w - WorldW(i)) < 1e-4f && Mathf.Abs(h - WorldH(i)) < 1e-4f;
        }

        // index finders (single-family invariants asserted by the proof)
        public static int FoamIndexOf(bool north)
        {
            for (int i = 0; i < MountCount; i++)
                if (Table[i].family == FamilyFoam && (north ? Table[i].y0 > 0f : Table[i].y0 < 0f)) return i;
            return -1;
        }
    }
}
