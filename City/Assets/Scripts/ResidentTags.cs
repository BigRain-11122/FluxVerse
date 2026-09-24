// FluxVerse P-22(2) r40: presentation slice 1 - resident nameplates (pure rules).
// The r39 substrate (ResidentIdentity: BigLife census-light identity pool baked
// into Assets/Data/residents-identity.json) gets its first street-facing visual:
// every one of the 12 r37 street residents carries a small nameplate floating
// above the head. The plate pixels are DevLoop-baked by
// Tools/city/bake-resident-plates.ps1 (pool font FT-011 Fusion Pixel 12px zh_hans,
// OFL 1.1, reference-not-copy - same license channel as the r38 FT-016 plates)
// from the SAME identity file this core's proof couples against - a plate can
// never exist without its census identity (orphan-face law, fail-loud in proof).
//
// GO naming: "NameTag00..11" - deliberately NOT the "Res" prefix, because
// ResidentProof sweeps/rebuilds every root Res* GO (r37 idempotence sweep);
// a Res-prefixed tag would be destroyed by the resident rebuild law. Prefix
// isolation is the idempotence contract between layer proofs (Robot/Neon/Res
// each own their prefix; tags own NameTag).
//
// Position law (single source of truth): the tag DERIVES from ResidentRules -
// same x, y = resident y + OffsetY where OffsetY = half the resident (1u = top
// of the 2u sprite) + GapFromHead + half the tag. Zero duplicated coordinates
// means a future resident move automatically carries its nameplate (drift-proof
// by construction; the alternative - a copied table - is the r10 stale-reference
// disease in data form).
//
// Size law: plate 46x20 px at PPU 24 -> 1.917x0.833 world units. The divisor 24
// follows the residents' own density law (r37: 48px sprites @ PPU24 = 2u) so a
// 12px glyph renders 0.5u tall - proportionate to a 2u person's head; scale
// stays 1 = zero resampling, importer enforced (PPU100 speck disease, r34).
//
// Colors: baked pixels are the P-18 moonlight annotation channel (dim cool steel
// frame / pale cool core / faint blue halo) - AMBIENT scenery, five-color law
// untouched: nameplates are info plates, not neon, never functional lights.
// Honesty law (CODEX sec.1): the identity file carries layer:"narrative" on
// every slot; the CityWatch panel owns the human-readable marker (r27), the
// street face shows the narrative-citizen name itself (P-22 sanctioned face).
//
// Tight-clearance note (derived, gated in proof): two slots stand right beside
// mounted robots - ResGameFrA/RobotGameFr (x margin 0.042u) and
// ResMediaFrA/RobotMediaFr (y margin 0.017u above the robot's hat). Both clear
// STRICTLY (no rect intersection); the proof gates strict overlap so future
// table edits that push a tag INTO a robot fail loud instead of z-fighting at
// the shared street order. ASCII. Pure 2D. No 3D.
using UnityEngine;

namespace FluxVerse
{
    public static class ResidentTagRules
    {
        public const int Order = 7;            // street layer: signs 6 < street 7 < tint 8
        public const float PPU = 24f;           // residents' own density divisor (r37 law)
        public const int Count = 12;            // == ResidentRules.Count
        public const string NamePrefix = "NameTag";
        public const int PxW = 46;              // uniform canvas (longest name = 40px tight)
        public const int PxH = 20;
        // r87 P-69 slice-3 nameplate-baseline law (city-core-design sec.8): the tag
        // bottom edge must hover a CONSTANT 8px above the head - in this pack's own
        // 24px/u density that is 8/24 = 0.3333u (was 0.15u; the r14-l1 screenshot's
        // uneven "39px vs 70px" reading was sprite-content variance, but the letter
        // of the law is now 8px and the proof pins it).
        public const float GapFromHead = 8f / 24f; // air between the 2u sprite top and the tag

        // head top (1u) + gap + half tag height
        public const float OffsetY = 1f + GapFromHead + PxH / (2f * PPU);   // 1.75

        public static string Name(int i) { return NamePrefix + i.ToString("00"); }
        public static string Path(int i)
        {
            return "Assets/ArtPacks/residents-crowd/nameplates/plate-res-" + i.ToString("00") + ".png";
        }
        public static Vector2 Pos(int i)
        {
            Vector2 r = ResidentRules.Pos(i);
            return new Vector2(r.x, r.y + OffsetY);
        }
        public static float WorldW { get { return PxW / PPU; } }   // 1.9167u
        public static float WorldH { get { return PxH / PPU; } }   // 0.8333u

        // framing: every tag fully inside the L0 view (ortho 20, aspect 16:9) with
        // margin, and inside the tint band y -16..+14 (untinted sliver = r22 debt)
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
