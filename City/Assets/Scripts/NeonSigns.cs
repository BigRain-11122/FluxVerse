// FluxVerse P-28 item 3 (r35): neon street-sign pure rules (source pack = warped-city,
// CC0 ansimuz, ledger City/Assets/ArtPacks/ARTPACKS-LEDGER.md). DESIGN section 9 base
// visual law: "neon street signs (FLUX/CPH4/company names) + street data-duct light
// lines". r35 wired the pack's EXISTING neon props onto the built facades; r38 closes
// the recorded debt with six DevLoop-baked company plates (bake-company-plates.ps1,
// pool font FT-016 PressStart2P OFL, reference-not-copy) living in the pack's
// company-plates/ subfolder: FLUX + CPH4 headers on the brain-tower glass facade
// (group brand above the evolution engine - tower five-layer canon), BIGGAME standing
// on the GAME west roofline, BIGMONEY crown plate under the QUANT tower roof,
// BIGSTREAM standing on the north-east MEDIA low-rise, BIGLIFE standing on the
// north-west-mid low-rise. Plate colors follow the five-color placement law
// (CEO white / superbody blue / data cyan / capital gold / flow magenta; BIGLIFE amber =
// ambient scenery channel, never a functional light). Pure static manifest = single
// source of truth for the scene wiring (NeonProof builds the scene objects from this
// table; RobotProof/ResidentProof consume the same rects for their clearance gates).
// No MonoBehaviour on purpose: signs are STATIC built-city scenery persisted in the
// scene exactly like the tilemaps (runtime-only law applies to transient visuals
// such as pulses/banners/skyline quads, r12/r16/r34). Placement mirrors the
// CitySkeletonBuilder geometry it mounts on:
//   north low-rises x -28..-26 / -9..-7 / 7..9 / 26..28 (tile rows y 9..11),
//   QUANT tower x -2..2 (rows y -16..-9), GAME_MAIN x -23..-19 (rows y -16..-12)
//   + GAME_ANNEX x -26..-25 (rows y -16..-14), MEDIA east x 19..24 (rows y -14..-9),
//   QUANT plaza pavement rows y -16..-9 (r104 southbank-manifest re-anchors).
// Sorting law: mounting layer order 6 = above Props 4, below the ambient tint 8 -
// the atmosphere owns the built city; functional lights (alert band 9, event
// pulses 10) punch above it. Scale law: localScale stays 1 everywhere -> zero
// resampling, point filter; world size comes from a PER-SIGN importer PPU tier
// (P-69 slice 1 proportion law, 2026-09-24 r89: oversized signs render at
// PPU32/PPU48 = half/third world height - the r37 PPU24 tier mechanism applied
// to signs, never a transform scale; NeonProof B enforces the manifest tier on
// every consumed sprite and the A2 gate asserts sign height <= half the mounting
// building, no escape past the facade top or roofline). Five-color law
// untouched: pack neon pink/teal is AMBIENT scenery (DESIGN section 9: pink only
// ever ambient), never a functional light. ASCII comments. No 3D.
using UnityEngine;

namespace FluxVerse
{
    public static class NeonRules
    {
        public const int Order = 6;            // mounting layer: Props 4 < signs 6 < tint 8
        public const float PPU = 16f;           // default world law (r13); per-sign ppu tier overrides
        public const int Count = 21;   // r132: +3 tower-v2 antenna needles (exempt family)
        public const string NamePrefix = "Neon";

        // P-69 slice 1 mount types: facade sign sits inside the building face at
        // <= half its height; roof plate sinks into the roofline and rises at
        // most half the building height; street furniture stands on the pavement
        // band; exempt = tower antenna structure (r87 precedent, not a shop sign).
        public const int MountFacade = 0, MountRoof = 1, MountStreet = 2, MountExempt = 3;

        public struct Sign
        {
            public string name;    // scene GO name (ASCII)
            public string path;    // project-relative asset path (Assets/...)
            public int pxW, pxH;   // native sprite pixels (asset gate)
            public float x, y;     // world center at scale 1 (sprite pivot = center)
            public float ppu;      // importer tier for THIS sprite (world law r13 per-asset)
            public int mount;      // Mount* constant above
            public int b;          // mounting building index into Buildings, -1 = none
        }

        // mounting buildings (world rects mirroring the CitySkeletonBuilder Block()
        // calls - the one geometry source; cell span [x0..x1] x [y0..y1-1] becomes
        // world rect [x0, x1+1] x [y0, y1]). The NeonProof A2 gate reads these.
        public struct Building { public float x0, y0, x1, y1; }
        static readonly Building[] Buildings = new Building[]
        {
            new Building { x0 = -28f, y0 = 9f,   x1 = -25f, y1 = 12f },  // 0 NW low-rise (3u)
            new Building { x0 = -9f,  y0 = 9f,   x1 = -6f,  y1 = 12f },  // 1 NW-mid low-rise (3u)
            new Building { x0 = 7f,   y0 = 9f,   x1 = 10f,  y1 = 12f },  // 2 NE-mid low-rise (3u)
            new Building { x0 = 26f,  y0 = 9f,   x1 = 29f,  y1 = 12f },  // 3 NE low-rise (3u)
            new Building { x0 = -2f,  y0 = -16f, x1 = 3f,   y1 = -8f },   // 4 QUANT tower (8u, r104 southbank)
            new Building { x0 = -23f, y0 = -16f, x1 = -18f, y1 = -11f },  // 5 GAME_MAIN (5u, r104 southbank)
            new Building { x0 = 19f,  y0 = -14f, x1 = 25f,  y1 = -8f },   // 6 MEDIA east (6u, r104 southbank)
            new Building { x0 = -2f,  y0 = 9f,   x1 = 3f,   y1 = 19f },  // 7 brain tower v2.0 (10u plinth-to-tip, r132)
        };
        public static Building BuildingAt(int i) { return Buildings[i]; }

        public static Sign At(int i) { return Table[i]; }
        public static string Name(int i) { return Table[i].name; }
        public static string Path(int i) { return Table[i].path; }
        public static Vector2 Pos(int i) { return new Vector2(Table[i].x, Table[i].y); }
        public static float WorldW(int i) { return Table[i].pxW / Table[i].ppu; }
        public static float WorldH(int i) { return Table[i].pxH / Table[i].ppu; }

        // framing: every sign fully inside the L0 view (ortho 20, aspect 16:9) with
        // margin, and inside the tint band y -16..+14 (an untinted sign sliver would
        // read as the r22 edge-band debt all over again)
        public static bool InView(int i, float halfW, float halfH)
        {
            Sign s = Table[i];
            float hw = s.pxW / (s.ppu * 2f), hh = s.pxH / (s.ppu * 2f);
            return Mathf.Abs(s.x) + hw <= halfW - 0.3f && Mathf.Abs(s.y) + hh <= halfH - 0.3f;
        }

        public static bool InTintBand(int i)
        {
            Sign s = Table[i];
            float hh = s.pxH / (s.ppu * 2f);
            return s.y - hh >= -16f + 0.1f && s.y + hh <= 14f;
        }

        static readonly Sign[] Table = new Sign[]
        {
            // 0. rooftop plate on the NW low-rise (hotel) - legs sink 0.2u into the roof
            new Sign { name = "NeonHotel",     path = "Assets/ArtPacks/warped-city/ENVIRONMENT/props/hotel-sign.png",                 pxW = 68, pxH = 35, x = -26.9f,  y = 12.347f, ppu = 32f, mount = MountRoof, b = 0 },
            // 1. GAME west facade (GAME_MAIN x -23..-19): vertical neon mid-facade (r104 y-reanchor)
            new Sign { name = "NeonGameWest",  path = "Assets/ArtPacks/warped-city/ENVIRONMENT/props/banner-neon/banner-neon-1.png",   pxW = 19, pxH = 48, x = -22.5f,  y = -13.5f, ppu = 32f, mount = MountFacade, b = 5 },
            // 2. GAME west facade 2nd slot: parallelogram neon, third-height tier (r104 y-reanchor)
            new Sign { name = "NeonGameWest2", path = "Assets/ArtPacks/warped-city/ENVIRONMENT/props/banner-side/banner-side-1.png",   pxW = 19, pxH = 76, x = -19.7f,  y = -13.5f, ppu = 48f, mount = MountFacade, b = 5 },
            // 3. MEDIA east facade (block x 19..24, rows y -14..-9; r104 y-reanchor)
            new Sign { name = "NeonMediaEast", path = "Assets/ArtPacks/warped-city/ENVIRONMENT/props/banner-neon/banner-neon-2.png",   pxW = 19, pxH = 48, x = 20.2f,   y = -11.0f, ppu = 32f, mount = MountFacade, b = 6 },
            // 4. MEDIA east parapet: horizontal shop sign sitting on the roofline (bottom edge -8, r104)
            new Sign { name = "NeonMediaRoof", path = "Assets/ArtPacks/warped-city/ENVIRONMENT/props/banner-sushi/banner-sushi-1.png",  pxW = 36, pxH = 13, x = 22.4f,   y = -7.59375f, ppu = 16f, mount = MountRoof, b = 6 },
            // 5/6. QUANT tower flanks (tower x -2..2, rows y -16..-9), mid-facade (r104 y-reanchor)
            new Sign { name = "NeonQuantL",    path = "Assets/ArtPacks/warped-city/ENVIRONMENT/props/banner-neon/banner-neon-3.png",   pxW = 19, pxH = 48, x = -1.45f,  y = -12.5f, ppu = 16f, mount = MountFacade, b = 4 },
            new Sign { name = "NeonQuantR",    path = "Assets/ArtPacks/warped-city/ENVIRONMENT/props/banner-neon/banner-neon-4.png",   pxW = 19, pxH = 48, x = 1.45f,   y = -12.5f, ppu = 16f, mount = MountFacade, b = 4 },
            // 7. NE low-rise facade: narrow hanging scroll (fits the 3-row block)
            new Sign { name = "NeonNEScroll",  path = "Assets/ArtPacks/warped-city/ENVIRONMENT/props/banner-scroll/banner-scroll-1.png", pxW = 13, pxH = 47, x = 27.0f,   y = 10.3f, ppu = 32f, mount = MountFacade, b = 3 },
            // 8. north GAME mid low-rise: orange OPEN door sign
            new Sign { name = "NeonNOpen",     path = "Assets/ArtPacks/warped-city/ENVIRONMENT/props/banner-open.png",                 pxW = 14, pxH = 44, x = -8.0f,   y = 10.3f, ppu = 32f, mount = MountFacade, b = 1 },
            // 9. north MEDIA mid low-rise: neon frame reuse (distinct flicker phase = free variety)
            new Sign { name = "NeonNMids",     path = "Assets/ArtPacks/warped-city/ENVIRONMENT/props/banner-neon/banner-neon-1.png",   pxW = 19, pxH = 48, x = 8.0f,    y = 10.5f, ppu = 32f, mount = MountFacade, b = 2 },
            // 10. QUANT plaza street kiosk: monitor face standing on the pavement
            //     (r104: stepped south to clear the east corridor the relocated
            //     seats need - the old (4.5,-10.6) spot sat inside every candidate
            //     stand cell between the tower and the cart)
            new Sign { name = "NeonKiosk",     path = "Assets/ArtPacks/warped-city/ENVIRONMENT/props/monitorface/monitor-face-1.png",  pxW = 21, pxH = 18, x = 4.2f,    y = -15.0f, ppu = 16f, mount = MountStreet, b = -1 },
            // 11. QUANT rooftop lattice antenna: rises from the roof edge (-8) to -3 against the sky (r104)
            new Sign { name = "NeonAntenna",   path = "Assets/ArtPacks/warped-city/ENVIRONMENT/props/antenna.png",                     pxW = 22, pxH = 96, x = 0.0f,    y = -6.0f, ppu = 16f, mount = MountExempt, b = -1 },
            // 12. brain-tower facade header: group brand FLUX (CEO white core, superbody-blue glow)
            new Sign { name = "NeonFlux",      path = "Assets/ArtPacks/warped-city/ENVIRONMENT/props/company-plates/plate-flux.png",      pxW = 44, pxH = 20, x = 0.5f,    y = 12.75f, ppu = 16f, mount = MountFacade, b = 7 },
            // 13. brain-tower facade below the brand: CPH4 evolution-engine plate (deep-layer blue)
            new Sign { name = "NeonCPH4",      path = "Assets/ArtPacks/warped-city/ENVIRONMENT/props/company-plates/plate-cph4.png",      pxW = 44, pxH = 20, x = 0.5f,    y = 10.5f, ppu = 16f, mount = MountFacade, b = 7 },
            // 14. GAME west roofline standing plate (data cyan; legs sink 0.125u into the roof; r104 x/y-reanchor)
            new Sign { name = "NeonBiggame",   path = "Assets/ArtPacks/warped-city/ENVIRONMENT/props/company-plates/plate-biggame.png",   pxW = 68, pxH = 28, x = -20.5f,  y = -10.25f, ppu = 16f, mount = MountRoof, b = 5 },
            // 15. QUANT tower facade crown under the roof edge: capital gold (r104 y-reanchor)
            new Sign { name = "NeonBigmoney",  path = "Assets/ArtPacks/warped-city/ENVIRONMENT/props/company-plates/plate-bigmoney.png",  pxW = 76, pxH = 20, x = 0.5f,    y = -10.3f, ppu = 16f, mount = MountFacade, b = 4 },
            // 16. north-east MEDIA low-rise rooftop: flow magenta (clear of the scroll tip between the legs)
            new Sign { name = "NeonBigstream", path = "Assets/ArtPacks/warped-city/ENVIRONMENT/props/company-plates/plate-bigstream.png", pxW = 84, pxH = 28, x = 27.5f,   y = 12.3125f, ppu = 32f, mount = MountRoof, b = 3 },
            // 17. north-west-mid low-rise rooftop: BIGLIFE residents company (warm amber, ambient)
            new Sign { name = "NeonBiglife",   path = "Assets/ArtPacks/warped-city/ENVIRONMENT/props/company-plates/plate-biglife.png",   pxW = 68, pxH = 28, x = -7.9f,   y = 12.3125f, ppu = 32f, mount = MountRoof, b = 1 },
            // 18/19/20. r132 tower-v2 antenna needles (tower-v2-manifest antennas
            // law; v2.0 canon three-needle crown): middle = CEO throne pin, strictly
            // tallest and widest, pure white always-on; flanks = fleet heartbeat
            // pins. Self-baked pixel needles (Tools/city/bake-tower-antennas.ps1,
            // zero external art) at the default 16ppu tier -> mid 4x14px = 0.25x0.875u,
            // side 2x9px = 0.125x0.5625u. Exempt class = tower structure, not a shop
            // sign (r87 antenna precedent): the sign framing/spacing laws do not
            // apply, NeonProof carries its own needle-family gates (tip x-span
            // [0,1], middle dominance, tops <= 19.9 frame margin).
            new Sign { name = "NeonTowerAntM", path = "Assets/ArtPacks/tower-antennas/tower-antenna-mid.png",  pxW = 4, pxH = 14, x = 0.5f,  y = 19.44f,  ppu = 16f, mount = MountExempt, b = -1 },
            new Sign { name = "NeonTowerAntL", path = "Assets/ArtPacks/tower-antennas/tower-antenna-side.png", pxW = 2, pxH = 9,  x = 0.15f, y = 19.275f, ppu = 16f, mount = MountExempt, b = -1 },
            new Sign { name = "NeonTowerAntR", path = "Assets/ArtPacks/tower-antennas/tower-antenna-side.png", pxW = 2, pxH = 9,  x = 0.85f, y = 19.275f, ppu = 16f, mount = MountExempt, b = -1 },
        };
    }
}
