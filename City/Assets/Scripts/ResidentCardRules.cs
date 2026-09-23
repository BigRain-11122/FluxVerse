// FluxVerse P-22(2) r43: click-spotlight identity card - pure rules (hit law +
// card geometry + orders + lifecycle constants). The r40 nameplate window's
// remaining face: click a street resident -> their BigLife census identity
// floats as a GUIAgent glass card (the L1 drill of DESIGN sec.8 "look -> check
// -> command"; the CityWatch spotlight face r28 owns the HTML side, this owns
// the street side). Content pixels are DevLoop-baked by
// Tools/city/bake-resident-cards.ps1 from the SAME identity file the proof
// couples against (Assets/Data/residents-identity.json, r39) - one texture per
// resident in City/CardData/ OUTSIDE Assets/ (r18 BannerData byte-path law).
//
// HIT LAW: a click belongs to the resident whose person+nameplate rect it lands
// in - x within +-HitHalfW of the sprite center (the 2u body is 1u half-width;
// the nameplate above is 0.96u half-width, so 1.15u covers both with margin),
// y from feet (center -1) to the tag top (+~1.98, rounded to +2.0). Clicking
// the nameplate = clicking the person (users aim at the head). First-match
// wins in slot order = deterministic. Robots sit >= 2.0u away (r37 clearance
// law) and bubbles mount ABOVE the hit top (+2.88), so neither can steal a
// click - the proof gates both negatives.
//
// CARD GEOMETRY: canvas 168x136 px at PPU 24 = 7.0 x 5.6667 world units,
// matching the UiKit.BuildGlassPanel shell 1:1 (the bake is glyphs-only with
// transparent margins - the shell provides the glass). UI shell band orders
// 40..43 (UiKit canon: above every world layer - banner 20..23, street 13,
// weather 12): glow 40 < rim 41 < glass 42 < text 43 (the r23 banner law
// shifted into the UI band). The card is a UI artifact, NOT street scenery:
// it hugs the CURRENT camera view top (like the r23 banner hugs the bottom),
// so it never fights the tint band (-16..+14) or the L0 frame - the proof
// gates the position against the live camera instead of InTintBand/InView.
//
// GO naming: prefix "IdentCard" - deliberately NOT "Res" (ResidentProof sweeps
// root Res* GOs, the r40 prefix-isolation contract; also not NameTag/BarkBubble/
// Robot/Neon - every layer proof owns its own prefix).
// Lifecycle: LifeSec 8 (five CJK rows read slower than the r23 banner's one
// line); a miss click or a second resident click swaps/dismisses. ASCII.
// Pure 2D. No 3D.
using UnityEngine;

namespace FluxVerse
{
    public static class ResidentCardRules
    {
        public const float PPU = 24f;                // nameplate density law (r40)
        public const int PxW = 168, PxH = 136;       // uniform bake canvas
        public const float WorldW = PxW / PPU;      // 7.0u
        public const float WorldH = PxH / PPU;      // 5.6667u
        public const int OrderGlow = 40, OrderRim = 41, OrderGlass = 42, OrderText = 43;
        public const string DirName = "CardData";
        public const string ManifestName = "manifest.json";
        public const string Prefix = "IdentCard";   // sweep-isolation contract (r40 law)
        public const float LifeSec = 8f;
        public const float HitHalfW = 1.15f;         // body half (1u) + plate margin
        public const float HitTop = 2.0f;           // head top (1u) + nameplate (~0.98u)
        public const float TopMargin = 0.5f;        // air below the view top edge

        // person+nameplate rect hit test; first-match wins (deterministic)
        public static int HitTest(Vector2 w)
        {
            for (int i = 0; i < ResidentRules.Count; i++)
            {
                Vector2 p = ResidentRules.Pos(i);
                if (Mathf.Abs(w.x - p.x) <= HitHalfW && w.y >= p.y - 1f && w.y <= p.y + HitTop)
                    return i;
            }
            return -1;
        }

        // camera-anchored top-center (UI band artifact - hugs the live view top
        // the way the r23 banner hugs the bottom; works at L0 and L1 alike)
        public static Vector2 CardPos(Vector2 camPos, float halfH)
        {
            return new Vector2(camPos.x, camPos.y + halfH - TopMargin - WorldH / 2f);
        }

        public static string FileName(int slot) { return "card-res-" + slot.ToString("00") + ".png"; }
    }
}
