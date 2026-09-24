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
// r87 P-69 slice-3 seat law (city-core-design sec.8 NPC grounding whitelist):
// every seat now stands with the UNDERFOOT cell (the tile whose top edge the
// feet line touches = feet cell - 1) on GROUND pavement (never grass/road/water)
// and BOTH body cells (feet cell, feet cell + 1) free of Roads/Water/building
// tiles - the proof re-derives all of this from the LIVE tilemaps. Placement
// domain: south QUANT/GAME/MEDIA plazas (pavement rows -16..-9), south street
// south sidewalk (feet cell -10: 1 row clear of the road band -8..-7 so the
// 2u body never reads "in the lane" - the r37 street seats had their torso
// over the road dashes), north walkway (feet cell 9: the rows 9..14 block
// pavement between the low-rises and the brain tower - tower-foot plaza, the
// ONLY north spot a 2u body clears the full-width grass rows 5..6; the old
// promenade seats at center y 5 had torso in the bushes = r45 defect).
// Feet convention (unchanged): center y = feetY + 1 (sprite spans
// [feetY, feetY+2]); underfoot cell row = feetY - 1.
// Grounding shadow (sec.8 check 3): every seat carries a ShadowRes* ellipse
// (bake-ground-shadows.ps1, 48x12 @ PPU24 = 2.0x0.5u native) at order 5, its
// center 0.10u below the feet line - the contact shadow the r34/r45 casts
// lacked; prefix ShadowRes is deliberately NOT the Res prefix so the Resident
// sweep/rebuild law owns it via its own sweep (sweep-isolation family).
// Sorting law: street layer order 7 = same layer as the robots (signs 6 < street
// 7 < tint 8); shadows 5 = above Props 4, below signs 6. Clearance laws enforced
// in the proof: residents >= 2.2u apart, >= 2.0u from every mounted robot,
// outside every neon-sign rect expanded by the resident half-extent (1.0u)
// + 0.4u margin. Five-color law untouched: pack clothing colors are ambient
// scenery. ASCII. No 3D.
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

        // grounding-shadow constants (r87 P-69 slice 3, sec.8 check 3)
        public const string ShadowNamePrefix = "ShadowRes";
        public const int ShadowOrder = 5;        // Props 4 < shadows 5 < signs 6
        public const int ShadowPxW = 48;         // 48x12 @ PPU24 = 2.0 x 0.5u native
        public const int ShadowPxH = 12;
        public const string ShadowPath =
            "Assets/ArtPacks/residents-crowd/shadows/shadow-res.png";
        public const float ShadowDropY = 0.10f;  // shadow center sits this far BELOW the feet line

        public static string ShadowName(int i) { return ShadowNamePrefix + i.ToString("00"); }
        public static Vector2 ShadowPos(int i)
        {
            Person p = Table[i];
            return new Vector2(p.x, p.y - 1f - ShadowDropY);   // feet at y-1, blob below it
        }
        public static float ShadowWorldW { get { return ShadowPxW / PPU; } }
        public static float ShadowWorldH { get { return ShadowPxH / PPU; } }

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

        // feet cell: the cell the sprite bottom edge lands INSIDE (center y - 1) =
        // the LOWER BODY cell. The tile visually UNDERFOOT (whose top edge the feet
        // line rests on) is one row below: underfoot = feet cell - 1 (r87 sec.8
        // naming; the proof gates BOTH - underfoot must be Ground pavement, the two
        // body cells must be clear of Roads/Water/buildings).
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
            // 5. MEDIA front plaza east - pink-haired goggled resident (r87 move:
            //    x 22 -> 23.5 - the 8px nameplate gap (sec.8) put the plate into the
            //    RobotMediaFr rect at the old seat; 1.5u east re-clears the pair)
            new Person { name = "ResMediaFrA", path = "Assets/ArtPacks/residents-crowd/frames/resident_09_idle_f00.png", frame = 0,  x = 23.5f,  y = -14.0f },
            // 6. MEDIA front plaza west - hooded pipe-smoker watching the street
            //    (r87 move: x 16.5 -> 15.5 clears the vertical-avenue road column
            //    17 - the sprite edge hung over the avenue, sec.8 sidewalk-only law)
            new Person { name = "ResMediaFrB", path = "Assets/ArtPacks/residents-crowd/frames/resident_01_idle_f00.png", frame = 0,  x = 15.5f,  y = -13.0f },
            // 7. south street south sidewalk, west stretch (between GAME and QUANT)
            //    - mid-stride resident (I1: upright rest of I0 lean); r87 move:
            //    feet cell -10 (was -9 = torso over the road dashes, sec.8 fix)
            new Person { name = "ResStWest",    path = "Assets/ArtPacks/residents-crowd/frames/resident_06_idle_f01.png", frame = 1,  x = -14.5f, y = -9.0f },
            // 8. south street south sidewalk, east stretch - red-capped resident
            //    (r87 move: same one-row-south law as slot 7)
            new Person { name = "ResStEast",    path = "Assets/ArtPacks/residents-crowd/frames/resident_11_idle_f00.png", frame = 0,  x = 9.0f,   y = -9.0f },
            // 9. north walkway, west of the brain-tower axis - seated meditating
            //    resident (r87 move: promenade seat had torso in the grass bushes,
            //    sec.8 greenbelt ban; tower-foot plaza = whitelisted ground)
            new Person { name = "ResPromW",     path = "Assets/ArtPacks/residents-crowd/frames/resident_07_idle_f00.png", frame = 0,  x = -3.5f, y = 11.0f },
            // 10. north walkway, east of the brain-tower axis - cloaked resident
            //     (r87 move: same promenade-greenbelt fix as slot 9)
            new Person { name = "ResPromC",     path = "Assets/ArtPacks/residents-crowd/frames/resident_02_idle_f00.png", frame = 0,  x = 4.5f,  y = 11.0f },
            // 11. north walkway, east stretch between the MEDIA low-rises - busker
            //     with guitar (r87 moves: the old road-row-7 seat WAS the sec.8
            //     lane-standing defect the CEO screenshot caught; first walkway
            //     pick x 12.5 crowded VehicleBusN (1.78u < 2.8) -> x 20 open stretch)
            new Person { name = "ResNorthSt",   path = "Assets/ArtPacks/residents-crowd/frames/resident_05_idle_f00.png", frame = 0,  x = 20.0f,  y = 11.0f },
        };
    }
}
