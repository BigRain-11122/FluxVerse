// FluxVerse P-38(2) r162: hi-bit landmark facades - pure rules table
// (LabsRules/OfficeRules idiom; person/city data stays out - r10 stale-copy
// law). Source law = Tools/city/facades-manifest.json (the r152 sandbox,
// 477 assertions green - single geometry source).
// Family law (manifest law.family): a Facade* sprite overlay that SUPPLANTS
// the tile face - order 3 = the LabsRules.PodOrder building-family tier
// (base tilemaps <= 3 < rim 5 < signs 6 < street 7 < tint 8 < band 9 <
// pulses 10 - the CEO pulse always rides above). Pivot center, GO pos =
// world rect center, localScale 1, natural size = px / PPU (zero resample,
// 48px-tier divisor law r111/r151); NEVER painted into the south tilemaps
// (IdentityProof district derivation and the 40/49/54 tile canon untouched).
// Rect-equality law (manifest law.rect_equality): every mount rect equals
// the southbank-manifest mass world rect BITWISE - zero migration by
// construction. QUANT/GAME_MAIN/MEDIA also equal NeonRules.Buildings[4/5/6]
// (the live mount-host table); GAME_ANNEX is deliberately OUTSIDE that
// table (the r159 A2 off-table verdict) - its equality source is the
// southbank manifest alone.
// Persistence law: static built-city scenery persisted in the scene like
// signs/offices (NeonSigns law); NOT CityAmbient runtime children (r146
// red-chain-3 law). Unlit-window law: skins carry ZERO static lit windows
// (bake gate: avg brightness > 80 only on the accent crown row); the lit
// rate is reserved to the P-38(3) activity heat line (decor ban law).
// r177 landmark swap law (T-FV-002 S4, CEO order 09-26 00:10; source law =
// Tools/city/landmarks-manifest.json swaps - the r176 sandbox, 95 assertions
// green): rows 0/3 host the r175 Shanghai-skyline silhouettes (quant-twist /
// media-pearl) - ASSET PATH SWAP ONLY, name/rect/px/accent identical, zero
// migration by construction; the retired facade-quant/facade-media skins
// stay on disk (P-21(4) discard-trace duty, landmarks-manifest honest_notes).
// Interplay laws (z-map, r155/r158): WindowLight mounts ride the SAME
// order 3 at z -0.5 (toward camera) so human window lights stay ABOVE the
// facades; signs ride order 6 above; rim rides order 5 above the crown.
// ASCII. No 3D.
using UnityEngine;

namespace FluxVerse
{
    public static class FacadeRules
    {
        public const int Count = 4;
        public const int Order = 3;        // building family tier (LabsRules.PodOrder law)
        public const float PPU = 24f;      // office-towers importer row (r151, never assumed)
        public const string NamePrefix = "Facade";
        public const float FrameHalfX = 35.256f;   // static L0 frame: halfW 35.556 - 0.3 margin
        public const float TintFloorY = -16f;      // r51 tint band bottom
        public const float TintCeilY = 15f;        // r51 tint band top

        // accent family names (manifest mounts[].accent; muted five-color law:
        // QUANT gold / GAME cyan / MEDIA flow magenta - never raw saturated)
        public const string AccentGold = "gold";
        public const string AccentCyan = "cyan";
        public const string AccentMagenta = "magenta";

        public struct Fcd
        {
            public string name;             // scene GO name (ASCII)
            public string path;             // project-relative asset path
            public int pxW, pxH;            // tight sprite pixels
            public float x0, y0, x1, y1;    // world rect min/max corners
            public string accent;           // five-color functional family
        }

        static readonly Fcd[] Table = new Fcd[]
        {
            // QUANT twist tower: 120x192 px = 5x8u - the r175 Shanghai-Center
            // twist silhouette (base-wide top-narrow taper, 2.2rad-offset gold
            // helix seam pair, 2x3 micro-window grid, dark plinth; unlit law
            // = gold seams only, 359 px). r177 landmark swap: path only.
            new Fcd { name = "FacadeQUANT", path = "Assets/ArtPacks/office-towers/quant-twist.png",
                      pxW = 120, pxH = 192, x0 = -2f, y0 = -16f, x1 = 3f, y1 = -8f,
                      accent = AccentGold },
            // GAME_MAIN square tower: 120x120 px = 5x5u, muted cyan accent.
            new Fcd { name = "FacadeGAME", path = "Assets/ArtPacks/office-towers/facade-game.png",
                      pxW = 120, pxH = 120, x0 = -23f, y0 = -16f, x1 = -18f, y1 = -11f,
                      accent = AccentCyan },
            // GAME_ANNEX staggered block: 48x72 px = 2x3u, muted cyan accent
            // (1u alley gap to GAME_MAIN; rect is off-table by design).
            new Fcd { name = "FacadeANNEX", path = "Assets/ArtPacks/office-towers/facade-annex.png",
                      pxW = 48, pxH = 72, x0 = -26f, y0 = -16f, x1 = -24f, y1 = -13f,
                      accent = AccentCyan },
            // MEDIA pearl block: 144x144 px = 6x6u, flow magenta accent - the
            // r175 Oriental-Pearl double-sphere silhouette (lower big + upper
            // small sphere, antenna rod, tripod splayed legs, magenta equator
            // deck rings 94 px; unlit law = magenta-only). r177 landmark swap:
            // path only (rect/px/name identical, r152 verdict_change history
            // stays in facades-manifest).
            new Fcd { name = "FacadeMEDIA", path = "Assets/ArtPacks/office-towers/media-pearl.png",
                      pxW = 144, pxH = 144, x0 = 19f, y0 = -14f, x1 = 25f, y1 = -8f,
                      accent = AccentMagenta },
        };

        public static Fcd At(int i) { return Table[i]; }
        public static string Name(int i) { return Table[i].name; }
        public static string Path(int i) { return Table[i].path; }
        public static string Accent(int i) { return Table[i].accent; }
        public static int PxW(int i) { return Table[i].pxW; }
        public static int PxH(int i) { return Table[i].pxH; }
        public static float X0(int i) { return Table[i].x0; }
        public static float Y0(int i) { return Table[i].y0; }
        public static float X1(int i) { return Table[i].x1; }
        public static float Y1(int i) { return Table[i].y1; }
        public static float WorldW(int i) { return Table[i].x1 - Table[i].x0; }
        public static float WorldH(int i) { return Table[i].y1 - Table[i].y0; }

        // sprite pivot = center; GO pos = world rect center (family law)
        public static Vector2 Pos(int i)
        {
            return new Vector2((Table[i].x0 + Table[i].x1) / 2f, (Table[i].y0 + Table[i].y1) / 2f);
        }

        public static Rect WorldRect(int i)
        {
            return new Rect(Table[i].x0, Table[i].y0, WorldW(i), WorldH(i));
        }

        public static bool InFrame(int i)
        {
            return Mathf.Abs(Table[i].x0) <= FrameHalfX && Mathf.Abs(Table[i].x1) <= FrameHalfX;
        }

        public static bool InTintBand(int i)
        {
            return Table[i].y0 >= TintFloorY && Table[i].y1 <= TintCeilY;
        }

        // southbank mass id per mount (rect-equality cross source)
        public static string SouthbankId(int i) { return MassIds[i]; }
        static readonly string[] MassIds = { "QUANT", "GAME_MAIN", "GAME_ANNEX", "MEDIA" };

        // live mount-host index into NeonRules.Buildings (QUANT=4, GAME_MAIN=5,
        // MEDIA=6); ANNEX = -1 (off-table verdict, r159 A2 - equality source is
        // the southbank manifest alone)
        public static int HostBuildingIndex(int i)
        {
            if (i == 0) return 4;
            if (i == 1) return 5;
            if (i == 3) return 6;
            return -1;
        }
    }
}
