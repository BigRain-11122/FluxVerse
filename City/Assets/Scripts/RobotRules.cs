// FluxVerse P-28 remaining wiring face (r36): street-robot pure rules (source pack =
// tophat-robot, CC-BY 3.0 Nelson Yiap, ledger City/Assets/ArtPacks/ARTPACKS-LEDGER.md,
// credits line already in the ledger header). DESIGN section 2 organ table: robots
// walking the streets = the fleet's AI labor made visible ("blood cells = street
// robots"); P-17 item 3 pins the spec at 16x16 = exactly this pack. v0 = STATIC
// standing scenery persisted in the scene like the tilemaps and the neon signs
// (r35 static-vs-transient boundary); the walking animation itself is an M2 face
// (P-12 event sources / P-22 census identity pool), never a decorative loop.
// Frame inventory (sheet cut by Tools/city/crop-robot-frames.ps1, 16 slots): F00/F08
// standing, F05/F07 leg-together, F01/F04/F06/F12 stride steps; 8 slots are EMPTY
// (the author's mirror column was never filled - all poses face right). Each robot
// mounts a DISTINCT usable frame = the r35 free-variety law (no clone row).
// Placement domain (CitySkeletonBuilder geometry): south QUANT plaza pavement rows
// -16..-9, south street rows -8..-7 and north street rows 7..8 (roads layer), north
// promenade row 4; the proof re-derives "stands on a Ground/Roads tile cell" from
// the live tilemaps instead of trusting this comment. Sorting law: street layer
// order 7 = above mounting signs 6, below the ambient tint 8. Scale law: native
// PPU16, scale 1 -> zero resampling (r34 importer law enforced in the proof).
// Five-color law untouched: pack teal/gray/orange is ambient scenery. ASCII. No 3D.
using UnityEngine;

namespace FluxVerse
{
    public static class RobotRules
    {
        public const int Order = 7;            // street layer: signs 6 < robots 7 < tint 8
        public const float PPU = 16f;           // world law (r13); importer enforced, never assumed
        public const int Count = 8;
        public const string NamePrefix = "Robot";
        public const int PxSide = 16;           // P-17 item 3: 16x16 street robot

        public struct Bot
        {
            public string name;    // scene GO name (ASCII)
            public string path;    // project-relative asset path (Assets/...)
            public int frame;      // sheet frame index (contact sheet F##, reporting only)
            public float x, y;     // world center at scale 1 (sprite pivot = center)
        }

        public static Bot At(int i) { return Table[i]; }
        public static string Name(int i) { return Table[i].name; }
        public static string Path(int i) { return Table[i].path; }
        public static Vector2 Pos(int i) { return new Vector2(Table[i].x, Table[i].y); }
        public static float WorldW(int i) { return PxSide / PPU; }
        public static float WorldH(int i) { return PxSide / PPU; }

        // framing: every robot fully inside the L0 view (ortho 20, aspect 16:9) with
        // margin, and inside the tint band y -16..+14 (an untinted sliver would read
        // as the r22 edge-band debt all over again)
        public static bool InView(int i, float halfW, float halfH)
        {
            Bot b = Table[i];
            float hw = PxSide / (PPU * 2f), hh = PxSide / (PPU * 2f);
            return Mathf.Abs(b.x) + hw <= halfW - 0.3f && Mathf.Abs(b.y) + hh <= halfH - 0.3f;
        }

        public static bool InTintBand(int i)
        {
            Bot b = Table[i];
            float hh = PxSide / (PPU * 2f);
            return b.y - hh >= -16f + 0.1f && b.y + hh <= 14f;
        }

        // a world point stands on a walkable cell only if the Ground (pavement) or
        // Roads tilemap holds a tile there - water, roofs, building interiors and
        // empty sky all fail. Pure math half (cell derivation); the tilemap lookup
        // lives in the proof (editor face).
        public static Vector2Int CellOf(int i)
        {
            Bot b = Table[i];
            return new Vector2Int(Mathf.FloorToInt(b.x), Mathf.FloorToInt(b.y));
        }

        static readonly Bot[] Table = new Bot[]
        {
            // 0. south QUANT plaza, west side - standing idle frame
            new Bot { name = "RobotPlazaW",  path = "Assets/ArtPacks/tophat-robot/frames/robot_f00.png", frame = 0,  x = -5.5f,  y = -11.5f },
            // 1. south QUANT plaza, east side - standing idle twin frame
            new Bot { name = "RobotPlazaE",  path = "Assets/ArtPacks/tophat-robot/frames/robot_f08.png", frame = 8,  x = 5.5f,   y = -13.5f },
            // 2. south QUANT plaza, tower front center - leg-together pose
            new Bot { name = "RobotPlazaS",  path = "Assets/ArtPacks/tophat-robot/frames/robot_f05.png", frame = 5,  x = -0.5f,  y = -14.5f },
            // 3. south street west stretch (between GAME and QUANT) - stride step
            new Bot { name = "RobotStWest",  path = "Assets/ArtPacks/tophat-robot/frames/robot_f04.png", frame = 4,  x = -12.5f, y = -7.5f },
            // 4. south street east stretch (between QUANT and MEDIA) - opposite-phase stride
            new Bot { name = "RobotStEast",  path = "Assets/ArtPacks/tophat-robot/frames/robot_f06.png", frame = 6,  x = 12.5f,  y = -7.5f },
            // 5. GAME city front plaza - leg-together pose
            new Bot { name = "RobotGameFr",  path = "Assets/ArtPacks/tophat-robot/frames/robot_f07.png", frame = 7,  x = -21.5f, y = -11.5f },
            // 6. MEDIA city front plaza - stride step
            new Bot { name = "RobotMediaFr", path = "Assets/ArtPacks/tophat-robot/frames/robot_f01.png", frame = 1,  x = 21.5f,  y = -11.5f },
            // 7. north promenade east (pavement row 4) - wide stride
            new Bot { name = "RobotPromE",   path = "Assets/ArtPacks/tophat-robot/frames/robot_f12.png", frame = 12, x = 14.5f,  y = 4.5f },
        };
    }
}
