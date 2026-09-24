// FluxVerse P-69 slice (r112): street office band v1 - pure rules table
// (VehicleRules idiom; person/city data stays out - the r10 stale-copy law).
// Source law = Tools/city/officeband-manifest.json (r111 sandbox, 1072
// assertions green) + docs/design/city-core-design.md sec.5 proportion law:
// street-front mid-rise condos 4u tall fill the P-17 office 4-6 tile gap with
// ZERO landmark competition (every building shorter than QUANT 8u / MEDIA 6u
// / brain 6u) and ZERO moves of any earlier family (the r103 move_census was
// a south-bank re-lay; this band only fills open windows).
// Stock = Assets/ArtPacks/office-ladder/ (r102 direct-copy pack, 74 stock png
// from the MiniGame S-library AA-016.02 tier; PPU24 divisor = 2u per 48px
// floor, r37 law family). Condo_4_24 = a 3x2-cell 144x96 single-component
// block (r101 survey evidence) = 6x4u at PPU24.
// Mirror variety (r93 pixel-exact mirror law): N2/N4 consume the pre-baked
// horizontal mirror ME_..._Condo_4_24_mirror.png (Tools/city/bake-office-mirror
// .ps1, raw ARGB column flip, zero resampling) because the sprite-family law
// pins localScale 1 - no runtime flips, no resample ever.
// Sprite-family law: buildings are Office* GOs at sorting order 3 (above every
// base tilemap 0..3 that they never geometrically share a cell with, below
// props 4 / signs 6 / street 7 / tint 8), pivot center, GO pos = world rect
// center. They are NEVER painted into CityGAME/CityQUANT/CityMEDIA tilemaps:
// IdentityProof district derivation and every sec8 feet cell stay untouched
// (r103-4 condo-law correction). ASCII. No 3D.
using UnityEngine;

namespace FluxVerse
{
    public static class OfficeRules
    {
        public const int Order = 3;            // building layer: base tilemaps <= 3 < props 4
        public const float PPU = 24f;          // office-ladder divisor (r102 importer row, never assumed)
        public const int Count = 5;
        public const string NamePrefix = "Office";

        public const string SrcPath = "Assets/ArtPacks/office-ladder/ME_Singles_Generic_Building_48x48_Condo_4_24.png";
        public const string MirrorPath = "Assets/ArtPacks/office-ladder/ME_Singles_Generic_Building_48x48_Condo_4_24_mirror.png";

        // r111 band laws (the sandbox is the mirror of these constants)
        public const float NorthCapTop = 13f;   // north low-rise cap: every north top edge <= 13
        public const float BrainTop = 15f;      // brain tower top edge (r101 survey canon) - sole north commanding height
        public const float SouthTopMax = -8f;   // south office tops stay below the street canopy line
        public const float FrameHalfX = 35.256f;// static L0 frame: halfW 35.556 - 0.3 margin (seat/robot/sign law family)
        public const float TintFloorY = -16f;   // r51 tint band bottom
        public const float TintCeilY = 15f;     // r51 tint band top

        public struct Bld
        {
            public string name;    // scene GO name (ASCII)
            public string path;    // project-relative asset path (original or pre-baked mirror)
            public int pxW, pxH;   // tight sprite pixels (144x96 pin)
            public float x0, y0;   // world rect min corner (integer cell boundaries)
            public float x1, y1;   // world rect max corner
            public bool mirror;    // r93 pixel-exact mirror file consumed
            public bool north;    // bank: true = north walkway rows 9..12, false = south band rows -16..-13
        }

        static readonly Bld[] Table = new Bld[]
        {
            // E1: south east-outer street-front office closing the east frame below
            // MEDIA; ResM07/ResM03 stand clear in front (0.33u+ gaps, r111 census)
            new Bld { name = "Office01", path = SrcPath,    pxW = 144, pxH = 96, x0 = 29f,   y0 = -16f, x1 = 35f,   y1 = -12f, mirror = false, north = false },
            // N3: north west-outer office, 1u gap to Buildings[0] (NW low-rise)
            new Bld { name = "Office02", path = SrcPath,    pxW = 144, pxH = 96, x0 = -35f,  y0 = 9f,   x1 = -29f,  y1 = 13f,  mirror = false, north = true },
            // N1: north west-central office fronting the vcol -18 road
            new Bld { name = "Office03", path = SrcPath,    pxW = 144, pxH = 96, x0 = -24f,  y0 = 9f,   x1 = -18f,  y1 = 13f,  mirror = false, north = true },
            // N2: north central office fronting the vcol -17 road (mirrored variant)
            new Bld { name = "Office04", path = MirrorPath, pxW = 144, pxH = 96, x0 = -16f,  y0 = 9f,   x1 = -10f,  y1 = 13f,  mirror = true,  north = true },
            // N4: north east-outer office; REGISTERED side adjacency - west face
            // touches NeonRules.Buildings[3] east face at x=29 with zero gap
            // (impossible east under the frame law, r111 registered exemption)
            new Bld { name = "Office05", path = MirrorPath, pxW = 144, pxH = 96, x0 = 29f,   y0 = 9f,   x1 = 35f,   y1 = 13f,  mirror = true,  north = true },
        };

        public static Bld At(int i) { return Table[i]; }
        public static string Name(int i) { return Table[i].name; }
        public static string Path(int i) { return Table[i].path; }
        public static int PxW(int i) { return Table[i].pxW; }
        public static int PxH(int i) { return Table[i].pxH; }
        public static float X0(int i) { return Table[i].x0; }
        public static float Y0(int i) { return Table[i].y0; }
        public static float X1(int i) { return Table[i].x1; }
        public static float Y1(int i) { return Table[i].y1; }
        public static float WorldW(int i) { return Table[i].x1 - Table[i].x0; }
        public static float WorldH(int i) { return Table[i].y1 - Table[i].y0; }
        public static bool IsNorth(int i) { return Table[i].north; }
        public static bool IsMirror(int i) { return Table[i].mirror; }

        // sprite pivot = center; GO pos = world rect center
        public static Vector2 Pos(int i)
        {
            return new Vector2((Table[i].x0 + Table[i].x1) / 2f, (Table[i].y0 + Table[i].y1) / 2f);
        }

        public static Rect WorldRect(int i)
        {
            return new Rect(Table[i].x0, Table[i].y0, WorldW(i), WorldH(i));
        }

        // the rect sits fully inside the static L0 frame margin law
        public static bool InFrame(int i)
        {
            return Mathf.Abs(Table[i].x0) <= FrameHalfX && Mathf.Abs(Table[i].x1) <= FrameHalfX;
        }

        // the rect sits fully inside the r51 tint band (an untinted sliver would
        // read as the r22 edge-band debt all over again)
        public static bool InTintBand(int i)
        {
            return Table[i].y0 >= TintFloorY && Table[i].y1 <= TintCeilY;
        }
    }
}
