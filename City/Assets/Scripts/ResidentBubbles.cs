// FluxVerse P-23(2) r42: bubble-layer pure rules (mounting law only). The r41
// data substrate (ResidentBarks: pool + pick + fact gate + attention budget)
// gets its street face: speech bubbles above the 12 residents' nameplates.
// Pixels are DevLoop-baked by Tools/city/bake-resident-bubbles.ps1 (GDI+,
// moonlight annotation canon, FT-011 12px - the r40 nameplate channel) into
// City/BubbleData/ OUTSIDE Assets/ (the r18 BannerData byte-path law: runtime
// File.ReadAllBytes + LoadImage never touches the importer, so no imported twin
// under Assets/). One texture per UNIQUE pool line (576 - the pick law is
// day-granular, any bucket line can surface on any date, so per-line is the
// only complete set), keyed by ResidentBarks.LineKey = md5(line) first-4-bytes
// hex; the bake and the C# core are separate implementations of the same key
// law, gated 576/576 in ResidentBubbleProof (dual-impl, r39 law).
//
// MOUNTING LAW (single source, derived like the r40 tags - zero duplicated
// coordinates, a future resident move carries its bubble):
//   x        = nameplate x (= resident x)
//   center y = tag top + GapFromTag + half bubble height
// The bake owns a UNIFORM 36 px canvas height (body + tail), so the bubble's
// world height is a constant 1.5 u at PPU 24 - the nameplate divisor, so the
// 12 px CJK glyphs render 0.5 u tall, byte-identical in size to the nameplate
// glyphs: one street type system. Width varies per line; the adapter reads the
// real size from sprite.bounds (never a copied table - the r10 stale-reference
// disease in data form).
//
// Sort order 13: above the weather drops (12) so the city's speech stays
// readable in rain, below the interior-banner band (20..23) and UiKit widgets
// (40..59) - bubbles are street info, not UI chrome. Five-color law untouched:
// the bake's colors are the ambient moonlight annotation channel (info plate,
// never a functional light). Honesty (P-23 law): every mounted bubble is a REAL
// pool line picked through the fact gate - no invented text, no decorative
// loop. Pure 2D. ASCII. No 3D.
using UnityEngine;

namespace FluxVerse
{
    public static class ResidentBubbleRules
    {
        public const float PPU = 24f;             // nameplate density law (r40)
        public const int Order = 13;              // drops 12 < bubbles 13 < banner 20
        public const int PxH = 36;                // uniform bake canvas height
        public const float WorldH = PxH / PPU;    // 1.5 u
        public const float GapFromTag = 0.15f;   // same air law as the plates
        public const string DirName = "BubbleData";
        public const string ManifestName = "manifest.json";
        public const string Prefix = "BarkBubble";   // scene-sweep isolation contract

        // center = tag top + gap + half bubble (tag top = tag center + half tag)
        public static Vector2 Pos(int i)
        {
            Vector2 tag = ResidentTagRules.Pos(i);
            return new Vector2(tag.x, tag.y + ResidentTagRules.WorldH / 2f + GapFromTag + WorldH / 2f);
        }

        // framing: the WIDEST possible line must still keep every bubble fully
        // inside the L0 view (ortho 20, aspect 16:9) with margin, and inside the
        // tint band. r87: the band TOP is +15, not +14 - the r51 tint-quad fix
        // widened the real quad to y -16..+15 (aligning the painted pavement
        // top), and the r87 walkway seats (tower-foot plaza, resident y 11) put
        // the tag+bubble stack top at y+3.82 = 14.82: legal under the +15 quad,
        // impossible under the stale +14 guard. Every lower family keeps its
        // own 14 bound (their objects never reach it); only the tallest stack
        // needs the true ceiling.
        public static bool InView(int i, float worldW, float halfW, float halfH)
        {
            Vector2 p = Pos(i);
            return Mathf.Abs(p.x) + worldW / 2f <= halfW - 0.3f
                && Mathf.Abs(p.y) + WorldH / 2f <= halfH - 0.3f;
        }

        public static bool InTintBand(int i)
        {
            Vector2 p = Pos(i);
            return p.y - WorldH / 2f >= -16f + 0.1f && p.y + WorldH / 2f <= 15f;
        }

        // strict rect overlap (the r40 tag-vs-robot gate: a shared-order pair
        // that touches fails loud here instead of z-fighting in the street).
        public static bool RectsOverlap(Rect a, Rect b)
        {
            const float eps = 1e-4f;
            return !(a.xMin >= b.xMax - eps || b.xMin >= a.xMax - eps
                  || a.yMin >= b.yMax - eps || b.yMin >= a.yMax - eps);
        }
    }
}
