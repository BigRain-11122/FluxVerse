// FluxVerse r177 (T-FV-002 S4, CEO order 09-26 00:10 art rectification):
// brain-tower magnolia-bud crown - pure rules table (FacadeRules family
// idiom; person/city data stays out - r10 stale-copy law). Source law =
// Tools/city/landmarks-manifest.json crown node (the r176 sandbox, 95
// assertions green - single geometry source; BrainCrownProof mirrors it).
// Family law: static built-city scenery persisted in the scene like
// signs/offices/facades (NeonSigns law); NOT CityAmbient runtime children
// (r146 red-chain-3 law). order 3 = the building family tier
// (LabsRules.PodOrder law), z 0 tilemap plane; rim 5 and signs 6 ride ABOVE
// by law (pre-registered interplay, r169 A4b report law - the dusk rim
// band over the bud top is intended stacking, never gated here).
// Reshape-only law (r174 note 5a): the crown lands INSIDE the tip zone with
// ZERO added height - canvas top 19.0 == tower top 19.0 < zenith floor
// 19.04 (r131 A10 law). Containment law: the crown rect is CONTAINED in
// NeonRules.Buildings[7] whole [-2,9,3,19] (tower-ornament identity law -
// containment is the gate, disjointness would be a bug). Tint exemption
// (r132 tint_band_note): the crown sits ABOVE the r51 tint ceiling +15 =
// by-design tower-top glow zone; FacadeRules.InTintBand is NOT a crown gate.
// Unlit law (r175 bake gate): bright > 80 only on the two converging sepal
// ridges in Lucy-blue (43 px, 96/160/255 - the r140 spectral anchor); the
// crown carries zero static lit windows (lit rate = P-38(3) heat line).
// Needle law: the side antenna needles dip 0.006u into the canvas zone over
// TRANSPARENT columns only; the mid needle lands on the bud tip where the
// lit ridges converge (NeonRules.NeonTowerAntM/L/R, order 6 above).
// ASCII. No 3D.
using UnityEngine;

namespace FluxVerse
{
    public static class BrainCrownRules
    {
        public const int Count = 1;
        public const int Order = 3;        // building family tier (LabsRules.PodOrder law)
        public const float Z = 0f;         // tilemap plane (facade family z-tie idiom)
        public const float PPU = 24f;      // office-towers importer row (r151, never assumed)
        public const string NamePrefix = "BrainCrown";
        public const string Name = "BrainCrown";
        public const string Path = "Assets/ArtPacks/office-towers/brain-crown.png";
        public const int PxW = 48;         // 2u at PPU24 (natural size law, zero resample)
        public const int PxH = 24;         // 1u
        public const float X0 = -0.5f;     // canvas centered on the tip cell x-center (x0.5)
        public const float Y0 = 18f;       // tip zone floor == shoulder row top plane
        public const float X1 = 1.5f;
        public const float Y1 = 19f;       // == tower top (reshape-only, zero added height)
        public const float PosX = 0.5f;    // rect center (pivot center law)
        public const float PosY = 18.5f;

        // host tower row (containment source, NeonRules.Buildings[7])
        public const int HostBuildingIndex = 7;
        // r131 A10 zenith floor: the crown top must stay strictly under it
        public const float ZenithFloor = 19.04f;

        // r175 bake census pins (pack edit = fail-loud in BrainCrownProof A1)
        public const int OpaquePx = 602;
        public const int LitPx = 43;       // bright > 80 = the Lucy-blue sepal ridges only
        // grounding pin: bud base rows (image bottom, world y~18.04..18.08)
        // opaque span = world x [-0.25, 1.25] (px 6..41 of 48)
        public const int BaseRowPx0 = 6;
        public const int BaseRowPx1 = 41;
        // bud tip pin: image top row (world y~18.96..19) opaque span =
        // px 21..26 -> world [0.375, 0.625]; the side-needle x-bands
        // (world [0.0875,0.2125] / [0.7875,0.9125] = px 14..17 / 31..33)
        // must sit over TRANSPARENT columns there (zero needle occlusion)
        public const int TipRowPx0 = 21;
        public const int TipRowPx1 = 26;

        public static Vector2 Pos() { return new Vector2(PosX, PosY); }
        public static float WorldW() { return X1 - X0; }
        public static float WorldH() { return Y1 - Y0; }
        public static Rect WorldRect() { return new Rect(X0, Y0, WorldW(), WorldH()); }
    }
}
