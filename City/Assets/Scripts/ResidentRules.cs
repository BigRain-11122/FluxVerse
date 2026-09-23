// FluxVerse P-28 last wiring face (r37): street-resident pure rules (source pack =
// residents-crowd, OGA-BY 3.0 CraftPix, ledger City/Assets/ArtPacks/ARTPACKS-LEDGER.md,
// credits line already in the ledger header). DESIGN section 5: every city has
// residents ("residents are the shopfront, robots do the real work" - the citizen
// layer makes the streets alive around the machines). P-22 census window: this is
// the SPRITE face; the BigLife citizens-light identity mapping is the M2 face and
// must never be invented here. v0 = STATIC scenery persisted in the scene exactly
// like the robots (r36 static-vs-transient law); walk/idle animation is an M2 face
// (P-12 event sources), never a decorative loop.
// Frame inventory (cut by Tools/city/crop-resident-frames.ps1): 12 residents, one
// consumed idle frame each = 12 DISTINCT files (r35 clone-row law is free here -
// every mount is a different person). Frame picks verified via logs/r37-contact.png
// multimodal pass: I0 is the stable rest pose everywhere except resident 06, whose
// I0 is a mid-stride lean -> I1 picked. Seated residents (07 meditating / 08
// squatting / 10 wheelchair) are natural street scenery, mounted as-is.
// Size law: P-17 pins residents at the 32x32 class = 2u tall in the 16-PPU world.
// This pack ships 48px frames, so the importer PPU for consumed frames is 24
// (48/24 = exactly 2u; localScale stays 1 = zero resampling - the divisor absorbs
// the pack's pixel density, the world law never moves; NOT the PPU100 speck
// disease, which is about the DEFAULT, and the proof enforces 24 here).
// Placement domain (CitySkeletonBuilder geometry): south QUANT plaza pavement rows
// -16..-9, GAME/MEDIA front plazas, south street pavement row -9, north promenade
// row 4, north street road row 7. Feet convention: center y = feetRow + 1 (sprite
// spans [feetRow, feetRow+2]); the proof re-derives "feet stand on a Ground/Roads
// tile" from the LIVE tilemaps instead of trusting this comment (r36 law).
// Sorting law: street layer order 7 = same layer as the robots (signs 6 < street
// 7 < tint 8). Clearance laws enforced in the proof: residents >= 2.2u apart,
// >= 2.0u from every mounted robot, outside every neon-sign rect expanded by the
// resident half-extent (1.0u) + 0.4u margin. Five-color law untouched: pack
// clothing colors are ambient scenery. ASCII. No 3D.
using UnityEngine;

namespace FluxVerse
{
    public static class ResidentRules
    {
        public const int Order = 7;            // street layer: signs 6 < street 7 < tint 8
        public const float PPU = 24f;           // 48px / 24 = 2u tall (P-17 32x32 class law)
        public const int Count = 12;
        public const string NamePrefix = "Res";
        public const int PxSide = 48;           // pack frame density (not the 16px world px)

        public struct Person
        {
            public string name;    // scene GO name (ASCII)
            public string path;    // project-relative asset path (Assets/...)
            public int frame;      // sheet frame index (contact sheet R<n>.I<k>, reporting only)
            public float x, y;     // world center at scale 1 (pivot = center; feet = y-1)
        }

        public static Person At(int i) { return Table[i]; }
        public static string Name(int i) { return Table[i].name; }
        public static string Path(int i) { return Table[i].path; }
        public static Vector2 Pos(int i) { return new Vector2(Table[i].x, Table[i].y); }
        public static float WorldW(int i) { return PxSide / PPU; }
        public static float WorldH(int i) { return PxSide / PPU; }

        // framing: every resident fully inside the L0 view (ortho 20, aspect 16:9) with
        // margin, and inside the tint band y -16..+14 (an untinted sliver would read
        // as the r22 edge-band debt all over again). Half-extent is 1u (2u sprite).
        public static bool InView(int i, float halfW, float halfH)
        {
            Person p = Table[i];
            return Mathf.Abs(p.x) + 1f <= halfW - 0.3f && Mathf.Abs(p.y) + 1f <= halfH - 0.3f;
        }

        public static bool InTintBand(int i)
        {
            Person p = Table[i];
            return p.y - 1f >= -16f + 0.1f && p.y + 1f <= 14f;
        }

        // feet cell: the tilemap cell the sprite bottom edge rests on (center y - 1).
        // Pure math half; the tilemap lookup lives in the proof (editor face).
        public static Vector2Int FeetCellOf(int i)
        {
            Person p = Table[i];
            return new Vector2Int(Mathf.FloorToInt(p.x), Mathf.FloorToInt(p.y - 1f));
        }

        static readonly Person[] Table = new Person[]
        {
            // 0. south QUANT plaza west - green-haired resident, relaxed arms
            new Person { name = "ResQPlazaA",  path = "Assets/ArtPacks/residents-crowd/frames/resident_03_idle_f00.png", frame = 0,  x = -8.0f,  y = -12.0f },
            // 1. south QUANT plaza south-east - wheelchair resident on the flat plaza
            new Person { name = "ResQPlazaB",  path = "Assets/ArtPacks/residents-crowd/frames/resident_10_idle_f00.png", frame = 0,  x = 2.0f,   y = -14.0f },
            // 2. south QUANT plaza tower-side - squatting heart-hat resident by the kiosk
            new Person { name = "ResQPlazaC",  path = "Assets/ArtPacks/residents-crowd/frames/resident_08_idle_f00.png", frame = 0,  x = -3.0f,  y = -13.0f },
            // 3. GAME front plaza west - purple-beanie resident with handbag
            new Person { name = "ResGameFrA",  path = "Assets/ArtPacks/residents-crowd/frames/resident_04_idle_f00.png", frame = 0,  x = -23.0f, y = -14.0f },
            // 4. GAME front plaza east - green-hooded resident
            new Person { name = "ResGameFrB",  path = "Assets/ArtPacks/residents-crowd/frames/resident_12_idle_f00.png", frame = 0,  x = -19.5f, y = -14.0f },
            // 5. MEDIA front plaza east - pink-haired goggled resident
            new Person { name = "ResMediaFrA", path = "Assets/ArtPacks/residents-crowd/frames/resident_09_idle_f00.png", frame = 0,  x = 22.0f,  y = -14.0f },
            // 6. MEDIA front plaza west - hooded pipe-smoker watching the street
            new Person { name = "ResMediaFrB", path = "Assets/ArtPacks/residents-crowd/frames/resident_01_idle_f00.png", frame = 0,  x = 16.5f,  y = -13.0f },
            // 7. south street west pavement - mid-stride resident (I1: upright rest of I0 lean)
            new Person { name = "ResStWest",    path = "Assets/ArtPacks/residents-crowd/frames/resident_06_idle_f01.png", frame = 1,  x = -15.0f, y = -8.0f },
            // 8. south street east pavement - red-capped resident
            new Person { name = "ResStEast",    path = "Assets/ArtPacks/residents-crowd/frames/resident_11_idle_f00.png", frame = 0,  x = 9.0f,   y = -8.0f },
            // 9. north promenade west - seated meditating resident (grass edge behind)
            new Person { name = "ResPromW",     path = "Assets/ArtPacks/residents-crowd/frames/resident_07_idle_f00.png", frame = 0,  x = -9.0f,  y = 5.0f },
            // 10. north promenade center - cloaked resident near the brain-tower axis
            new Person { name = "ResPromC",     path = "Assets/ArtPacks/residents-crowd/frames/resident_02_idle_f00.png", frame = 0,  x = 4.0f,   y = 5.0f },
            // 11. north street - busker with guitar (road row = the performance strip)
            new Person { name = "ResNorthSt",   path = "Assets/ArtPacks/residents-crowd/frames/resident_05_idle_f00.png", frame = 0,  x = -5.0f,  y = 8.0f },
        };
    }
}
