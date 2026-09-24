// FluxVerse P-69 slice-1 single-source law (r99): the 32-seat street-resident
// table. The r37 residents-crowd 12-seat face (48px @ PPU24 = 2u) retires; the
// P-68 batch1 roster (32 census-derived residents, group production line
// fa7d951) takes the street. CEO proportion order (P-69, 2026-09-24 ~20:45)
// pins the single-source class at 32x32 = 1.333u; the atlas divisor stays 24
// (32/24 = 1.333u, world law never moves; NOT the PPU100 speck disease - the
// importer PpuFor row enforces 24 for residents-atlas).
//
// DATA SPLIT (single-source law): this file owns ONLY the seat geometry (GO
// name + world position - the sec.8 whitelist design). EVERYTHING per-person
// (identity/parts/plateIndex/palette) lives in Assets/Data/residents-street.json
// (r98 bake: atlas manifest + batch1 manifest + BigLife census three-source
// join) consumed via ResidentIdentity - no person data is copied into C#
// (the r10 stale-copy disease is structurally impossible).
//
// Mount law (P-72 paper-doll): parent GO holds NO renderer; each body is a
// child-SpriteRenderer stack cut from the 9-cell atlas (pant -> skin -> cloth
// -> badge -> hair -> eyes; sprite species = the being-glow companion, r97),
// tinted per-roster, all children at street order 7 with a deterministic
// same-order z stack (pant deepest, eyes closest - Unity sorts equal-order
// sprites by camera distance). Empty atlas cells (cloth/badge in the group
// line v0.1: color fields shipped, shapes not yet drawn) mount harmlessly -
// the stack is future-proof against the production line filling them.
//
// Placement (sec.8 NPC grounding whitelist, city-core-design sec.8): south
// QUANT/GAME/MEDIA plazas (pavement rows -16..-9), south street south
// sidewalk (feet cell -10), north walkway (tower-foot plaza), one anchor
// honor seat flanking the brain tower (C-00001, r73 law), five cross-city
// visitors on the south street (seat != identity claim, r96 law). Every
// seat passed the r99 sandbox harness (logs/devloop-r99-seat-test.ps1,
// 4167 assertions) before this table was committed.
// ASCII. Pure 2D. No 3D.
using UnityEngine;

namespace FluxVerse
{
    public static class ResidentRules
    {
        public const int Order = 7;            // street layer: signs 6 < street 7 < tint 8
        public const float PPU = 24f;           // atlas divisor (32px -> 1.333u, P-69 class law)
        public const int Count = 32;
        public const string NamePrefix = "Res";
        public const int PxSide = 32;           // P-69 single-source class (r96 law)
        public const float HalfSide = PxSide / (PPU * 2f);   // 0.6667u half extent

        // ---- parts stack (P-72: one atlas, nine cells, tint per roster) ----
        public const string AtlasPath = "Assets/ArtPacks/residents-atlas/atlas.png";
        public const string BeingGlowPath = "Assets/ArtPacks/residents-atlas/being-glow.png";
        public static readonly string[] PartStack =
            { "pant", "skin", "cloth", "badge", "hair", "eyes" };
        public const float PartZStep = 0.05f;   // equal-order z stack: pant deepest, eyes on top

        // ---- grounding shadow (r97 bake: 32x8 @ PPU24 = 1.333x0.333u) ----
        public const string ShadowNamePrefix = "ShadowRes";
        public const int ShadowOrder = 5;        // Props 4 < shadows 5 < signs 6
        public const int ShadowPxW = 32;
        public const int ShadowPxH = 8;
        public const string ShadowPath =
            "Assets/ArtPacks/residents-crowd/shadows/shadow-res32.png";
        public const float ShadowDropY = 0.06f;  // shadow center sits this far BELOW the feet line

        // ---- zone law (IdentityProof re-derives the district face from this) ----
        public const int QuantCount = 9, GameCount = 7, MediaCount = 8,
            NorthCount = 2, TowerCount = 1, VisitorCount = 5;
        public static string ZoneOf(int i)
        {
            if (i < QuantCount) return "QUANT";
            if (i < QuantCount + GameCount) return "GAME";
            if (i < QuantCount + GameCount + MediaCount) return "MEDIA";
            if (i < QuantCount + GameCount + MediaCount + NorthCount) return "NORTH";
            if (i == QuantCount + GameCount + MediaCount + NorthCount) return "TOWER";
            return "VISITOR";
        }

        public struct Person
        {
            public string name;    // scene GO name (ASCII)
            public float x, y;     // world center (pivot = center; feet = y - HalfSide)
        }

        public static Person At(int i) { return Table[i]; }
        public static string Name(int i) { return Table[i].name; }
        public static Vector2 Pos(int i) { return new Vector2(Table[i].x, Table[i].y); }
        public static float WorldW(int i) { return PxSide / PPU; }
        public static float WorldH(int i) { return PxSide / PPU; }

        // ---- framing: fully inside the L0 view (ortho 20, aspect 16:9) with
        // margin, and inside the tint band y -16..+14 (r22 edge-band kin) ----
        public static bool InView(int i, float halfW, float halfH)
        {
            Person p = Table[i];
            return Mathf.Abs(p.x) + HalfSide <= halfW - 0.3f && Mathf.Abs(p.y) + HalfSide <= halfH - 0.3f;
        }

        public static bool InTintBand(int i)
        {
            Person p = Table[i];
            return p.y - HalfSide >= -16f + 0.1f && p.y + HalfSide <= 14f;
        }

        // ---- sec.8 cell derivation: the sprite spans [y-HalfSide, y+HalfSide]
        // squared; integer-y seats land on exactly two body rows (the proof
        // asserts integer y for that reason). FeetCellOf carries the OLD law's
        // semantics for district/river derivation: x = the CENTER column
        // (floor(x) - which city block the seat belongs to), y = the lower
        // body row. The stand gate walks ColLo..ColHi x RowLo..RowHi itself. ----
        public static int RowLo(int i) { return Mathf.FloorToInt(Table[i].y - HalfSide); }
        public static int RowHi(int i) { return Mathf.CeilToInt(Table[i].y + HalfSide) - 1; }
        public static int ColLo(int i) { return Mathf.FloorToInt(Table[i].x - HalfSide); }
        public static int ColHi(int i) { return Mathf.CeilToInt(Table[i].x + HalfSide) - 1; }
        public static Vector2Int FeetCellOf(int i)
        {
            return new Vector2Int(Mathf.FloorToInt(Table[i].x), RowLo(i));
        }

        public static string ShadowName(int i) { return ShadowNamePrefix + i.ToString("00"); }
        public static Vector2 ShadowPos(int i)
        {
            Person p = Table[i];
            return new Vector2(p.x, p.y - HalfSide - ShadowDropY);   // below the feet line
        }
        public static float ShadowWorldW { get { return ShadowPxW / PPU; } }
        public static float ShadowWorldH { get { return ShadowPxH / PPU; } }

        static readonly Person[] Table = new Person[]
        {
            // QUANT 9 (south QUANT plaza + plaza-edge pavement)
            new Person { name = "ResQ01", x = -8.0f,  y = -12.0f },
            new Person { name = "ResQ02", x = -3.0f,  y = -13.0f },
            new Person { name = "ResQ03", x = 2.0f,   y = -14.0f },
            new Person { name = "ResQ04", x = -2.0f,  y = -10.0f },
            new Person { name = "ResQ05", x = -6.0f,  y = -9.0f },
            new Person { name = "ResQ06", x = 0.0f,   y = -11.0f },
            new Person { name = "ResQ07", x = 10.0f,  y = -14.0f },
            new Person { name = "ResQ08", x = -10.0f, y = -13.0f },
            new Person { name = "ResQ09", x = -5.0f,  y = -14.0f },
            // GAME 7 (GAME front plaza + west mid-stretch)
            new Person { name = "ResG01", x = -23.0f, y = -14.0f },
            new Person { name = "ResG02", x = -19.5f, y = -14.0f },
            new Person { name = "ResG03", x = -15.0f, y = -14.0f },
            new Person { name = "ResG04", x = -14.0f, y = -12.0f },
            new Person { name = "ResG05", x = -12.0f, y = -14.0f },
            new Person { name = "ResG06", x = -14.5f, y = -9.0f },
            new Person { name = "ResG07", x = -19.0f, y = -10.0f },
            // MEDIA 8 (MEDIA front plaza + east mid-stretch)
            new Person { name = "ResM01", x = 23.5f,  y = -14.0f },
            new Person { name = "ResM02", x = 15.5f,  y = -14.0f },
            new Person { name = "ResM03", x = 28.0f,  y = -13.0f },
            new Person { name = "ResM04", x = 25.0f,  y = -12.0f },
            new Person { name = "ResM05", x = 12.5f,  y = -11.0f },
            new Person { name = "ResM06", x = 16.0f,  y = -11.0f },
            new Person { name = "ResM07", x = 30.0f,  y = -11.0f },
            new Person { name = "ResM08", x = 23.0f,  y = -10.0f },
            // NORTH 2 (north walkway, tower-foot plaza)
            new Person { name = "ResN01", x = -3.5f,  y = 11.0f },
            new Person { name = "ResN02", x = 20.0f,  y = 11.0f },
            // TOWER 1 (anchor honor seat flanking the brain tower, C-00001)
            new Person { name = "ResT01", x = 3.5f,   y = 11.0f },
            // VISITOR 5 (cross-city visitors on the south street sidewalk)
            new Person { name = "ResV01", x = -10.5f, y = -9.0f },
            new Person { name = "ResV02", x = 9.5f,   y = -9.0f },
            new Person { name = "ResV03", x = 15.0f,  y = -9.0f },
            new Person { name = "ResV04", x = -27.5f, y = -9.0f },
            new Person { name = "ResV05", x = 26.0f,  y = -9.0f },
        };
    }
}
