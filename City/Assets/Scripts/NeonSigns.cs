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
//   QUANT tower x -2..2 (rows y -9..-2), GAME west x -24..-19, MEDIA east
//   x 19..24 (rows y -9..-6), QUANT plaza pavement rows y -16..-9.
// Sorting law: mounting layer order 6 = above Props 4, below the ambient tint 8 -
// the atmosphere owns the built city; functional lights (alert band 9, event
// pulses 10) punch above it. Scale law: native PPU16, scale 1 everywhere -> zero
// resampling, point filter, no integer-scale debate at all. Five-color law
// untouched: pack neon pink/teal is AMBIENT scenery (DESIGN section 9: pink only
// ever ambient), never a functional light. ASCII comments. No 3D.
using UnityEngine;

namespace FluxVerse
{
    public static class NeonRules
    {
        public const int Order = 6;            // mounting layer: Props 4 < signs 6 < tint 8
        public const float PPU = 16f;           // world law (r13); importer enforced, never assumed
        public const int Count = 18;
        public const string NamePrefix = "Neon";

        public struct Sign
        {
            public string name;    // scene GO name (ASCII)
            public string path;    // project-relative asset path (Assets/...)
            public int pxW, pxH;   // native sprite pixels (asset gate)
            public float x, y;     // world center at scale 1 (sprite pivot = center)
        }

        public static Sign At(int i) { return Table[i]; }
        public static string Name(int i) { return Table[i].name; }
        public static string Path(int i) { return Table[i].path; }
        public static Vector2 Pos(int i) { return new Vector2(Table[i].x, Table[i].y); }
        public static float WorldW(int i) { return Table[i].pxW / PPU; }
        public static float WorldH(int i) { return Table[i].pxH / PPU; }

        // framing: every sign fully inside the L0 view (ortho 20, aspect 16:9) with
        // margin, and inside the tint band y -16..+14 (an untinted sign sliver would
        // read as the r22 edge-band debt all over again)
        public static bool InView(int i, float halfW, float halfH)
        {
            Sign s = Table[i];
            float hw = s.pxW / (PPU * 2f), hh = s.pxH / (PPU * 2f);
            return Mathf.Abs(s.x) + hw <= halfW - 0.3f && Mathf.Abs(s.y) + hh <= halfH - 0.3f;
        }

        public static bool InTintBand(int i)
        {
            Sign s = Table[i];
            float hh = s.pxH / (PPU * 2f);
            return s.y - hh >= -16f + 0.1f && s.y + hh <= 14f;
        }

        static readonly Sign[] Table = new Sign[]
        {
            // 0. rooftop plate on the NW low-rise (hotel) - legs sink 0.2u into the roof
            new Sign { name = "NeonHotel",     path = "Assets/ArtPacks/warped-city/ENVIRONMENT/props/hotel-sign.png",                 pxW = 68, pxH = 35, x = -27.0f,  y = 12.85f },
            // 1. GAME west facade (block x -24..-19): vertical neon, full block height
            new Sign { name = "NeonGameWest",  path = "Assets/ArtPacks/warped-city/ENVIRONMENT/props/banner-neon/banner-neon-1.png",   pxW = 19, pxH = 48, x = -22.5f,  y = -7.5f },
            // 2. GAME west facade 2nd slot: parallelogram neon, bracket overhang by design
            new Sign { name = "NeonGameWest2", path = "Assets/ArtPacks/warped-city/ENVIRONMENT/props/banner-side/banner-side-1.png",   pxW = 19, pxH = 76, x = -19.7f,  y = -7.1f },
            // 3. MEDIA east facade (block x 19..24)
            new Sign { name = "NeonMediaEast", path = "Assets/ArtPacks/warped-city/ENVIRONMENT/props/banner-neon/banner-neon-2.png",   pxW = 19, pxH = 48, x = 20.2f,   y = -7.5f },
            // 4. MEDIA east parapet: horizontal shop sign sitting on the roofline (top edge -5)
            new Sign { name = "NeonMediaRoof", path = "Assets/ArtPacks/warped-city/ENVIRONMENT/props/banner-sushi/banner-sushi-1.png",  pxW = 36, pxH = 13, x = 22.4f,   y = -4.59f },
            // 5/6. QUANT tower flanks (tower x -2..2, rows y -9..-2), mid-facade
            new Sign { name = "NeonQuantL",    path = "Assets/ArtPacks/warped-city/ENVIRONMENT/props/banner-neon/banner-neon-3.png",   pxW = 19, pxH = 48, x = -1.45f,  y = -5.5f },
            new Sign { name = "NeonQuantR",    path = "Assets/ArtPacks/warped-city/ENVIRONMENT/props/banner-neon/banner-neon-4.png",   pxW = 19, pxH = 48, x = 1.45f,   y = -5.5f },
            // 7. NE low-rise facade: narrow hanging scroll (fits the 3-row block)
            new Sign { name = "NeonNEScroll",  path = "Assets/ArtPacks/warped-city/ENVIRONMENT/props/banner-scroll/banner-scroll-1.png", pxW = 13, pxH = 47, x = 27.0f,   y = 10.5f },
            // 8. north GAME mid low-rise: orange OPEN door sign
            new Sign { name = "NeonNOpen",     path = "Assets/ArtPacks/warped-city/ENVIRONMENT/props/banner-open.png",                 pxW = 14, pxH = 44, x = -8.0f,   y = 10.4f },
            // 9. north MEDIA mid low-rise: neon frame reuse (distinct flicker phase = free variety)
            new Sign { name = "NeonNMids",     path = "Assets/ArtPacks/warped-city/ENVIRONMENT/props/banner-neon/banner-neon-1.png",   pxW = 19, pxH = 48, x = 8.0f,    y = 10.4f },
            // 10. QUANT plaza street kiosk: monitor face standing on the pavement
            new Sign { name = "NeonKiosk",     path = "Assets/ArtPacks/warped-city/ENVIRONMENT/props/monitorface/monitor-face-1.png",  pxW = 21, pxH = 18, x = 4.5f,    y = -10.6f },
            // 11. QUANT rooftop lattice antenna: rises from the roof edge (-2) to +4 against the sky
            new Sign { name = "NeonAntenna",   path = "Assets/ArtPacks/warped-city/ENVIRONMENT/props/antenna.png",                     pxW = 22, pxH = 96, x = 0.0f,    y = 1.0f },
            // 12. brain-tower facade header: group brand FLUX (CEO white core, superbody-blue glow)
            new Sign { name = "NeonFlux",      path = "Assets/ArtPacks/warped-city/ENVIRONMENT/props/company-plates/plate-flux.png",      pxW = 44, pxH = 20, x = 0.0f,    y = 12.75f },
            // 13. brain-tower facade below the brand: CPH4 evolution-engine plate (deep-layer blue)
            new Sign { name = "NeonCPH4",      path = "Assets/ArtPacks/warped-city/ENVIRONMENT/props/company-plates/plate-cph4.png",      pxW = 44, pxH = 20, x = 0.0f,    y = 10.5f },
            // 14. GAME west roofline standing plate (data cyan; legs sink 0.125u into the roof)
            new Sign { name = "NeonBiggame",   path = "Assets/ArtPacks/warped-city/ENVIRONMENT/props/company-plates/plate-biggame.png",   pxW = 68, pxH = 28, x = -22.6f,  y = -4.25f },
            // 15. QUANT tower facade crown under the roof edge: capital gold
            new Sign { name = "NeonBigmoney",  path = "Assets/ArtPacks/warped-city/ENVIRONMENT/props/company-plates/plate-bigmoney.png",  pxW = 76, pxH = 20, x = 0.0f,    y = -3.3f },
            // 16. north-east MEDIA low-rise rooftop: flow magenta (clear of the scroll tip between the legs)
            new Sign { name = "NeonBigstream", path = "Assets/ArtPacks/warped-city/ENVIRONMENT/props/company-plates/plate-bigstream.png", pxW = 84, pxH = 28, x = 27.0f,   y = 12.75f },
            // 17. north-west-mid low-rise rooftop: BIGLIFE residents company (warm amber, ambient)
            new Sign { name = "NeonBiglife",   path = "Assets/ArtPacks/warped-city/ENVIRONMENT/props/company-plates/plate-biglife.png",   pxW = 68, pxH = 28, x = -8.0f,   y = 12.75f },
        };
    }
}
