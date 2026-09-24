// FluxVerse P-22(2) r40/r99: resident nameplates (pure rules).
// The r99 32-seat swap carries the b1 plate batch (r97 bake): 32 pre-baked
// plates by Tools/city/bake-resident-plates.ps1 (b1 mode) from the SAME street
// roster the proofs couple against (Assets/Data/residents-street.json) - a
// plate can never exist without its roster identity (orphan-face law,
// fail-loud in proof). Plate index = the roster's plateIndex (atlas-row order,
// r97 law) - NOT the slot index; the proof resolves it via ResidentIdentity so
// this file carries no per-person copy.
//
// GO naming: "NameTag00..31" - deliberately NOT the "Res" prefix, because
// ResidentProof sweeps/rebuilds every root Res* GO; prefix isolation is the
// idempotence contract between layer proofs.
//
// Position law (single source of truth): the tag DERIVES from ResidentRules -
// same x, y = resident y + OffsetY where OffsetY = half the resident (the
// 1.333u body top) + GapFromHead + half the tag. The 8px-above-the-head
// baseline (city-core-design sec.8) is expressed in the pack's own 24px/u
// density: 8/24 = 0.3333u.
//
// Size law: b1 uniform canvas 66x20 px at PPU 24 -> 2.75x0.833 world units
// (r97: the longest registered CJK name runs 57px + margin; registered names
// are never cut - honesty law). The 2.75u plate width sets the same-row seat
// spacing law (>= 2.75u x-gap) the r99 seat harness enforces.
// Colors: baked pixels are the P-18 moonlight annotation channel - AMBIENT
// scenery, five-color law untouched. ASCII. Pure 2D. No 3D.
using UnityEngine;

namespace FluxVerse
{
    public static class ResidentTagRules
    {
        public const int Order = 7;            // street layer: signs 6 < street 7 < tint 8
        public const float PPU = 24f;           // residents' own density divisor (r37 law)
        public const int Count = 32;            // == ResidentRules.Count
        public const string NamePrefix = "NameTag";
        public const int PxW = 66;              // b1 uniform canvas (r97 bake)
        public const int PxH = 20;
        // sec.8 nameplate-baseline law: the tag bottom hovers a CONSTANT 8px
        // above the head (this pack's 24px/u density -> 0.3333u).
        public const float GapFromHead = 8f / 24f;

        // body top (0.6667u) + gap + half tag height
        public const float OffsetY = ResidentRules.HalfSide + GapFromHead + PxH / (2f * PPU);   // 1.4167

        public static string Name(int i) { return NamePrefix + i.ToString("00"); }

        // plate file by the roster's atlas-row plateIndex (proof resolves via
        // ResidentIdentity.At(i).plateIndex; 0..31 unique - gated in proof)
        public static string PlatePath(int plateIndex)
        {
            return "Assets/ArtPacks/residents-crowd/nameplates/plate-res-b1-"
                + plateIndex.ToString("00") + ".png";
        }

        public static Vector2 Pos(int i)
        {
            Vector2 r = ResidentRules.Pos(i);
            return new Vector2(r.x, r.y + OffsetY);
        }
        public static float WorldW { get { return PxW / PPU; } }   // 2.75u
        public static float WorldH { get { return PxH / PPU; } }   // 0.8333u

        // framing: every tag fully inside the L0 view (ortho 20, aspect 16:9)
        // with margin, and inside the tint band y -16..+14 (r22 debt family)
        public static bool InView(int i, float halfW, float halfH)
        {
            Vector2 p = Pos(i);
            return Mathf.Abs(p.x) + WorldW / 2f <= halfW - 0.3f
                && Mathf.Abs(p.y) + WorldH / 2f <= halfH - 0.3f;
        }

        public static bool InTintBand(int i)
        {
            Vector2 p = Pos(i);
            return p.y - WorldH / 2f >= -16f + 0.1f && p.y + WorldH / 2f <= 14f;
        }
    }
}
