// FluxVerse r160 (P-20260925-09 D2 window-light heat, CEO order 09-25 ~18:00,
// spec R-20260925-water-daynight.md sec2 item2): pure rules table for the
// window-light line. Source law = Tools/city/windowlight-manifest.json (the
// r159 sandbox, 48 checks green - single parameter source; OfficeRules /
// LabsRules idiom). Night window lit-rate = each company's LIVE activity from
// world-state zones[] (scan floors gaming 0.5 / media 0.4 upstream; live
// values observed 1.0) - ZERO static baked numbers (stale honesty law).
//
// WINDOW LAW (r159): every cell's face type is the Block() paving law -
// top row = roof (zero windows), walls alternate wallA/wallB by
// (cell_x + cell_y) & 1. gray_c = ART windows (glass px 77,146,239 in
// GuttyKreum_CleanCity_074: two 2x8 windows x7/x10, band y5..12, mullion
// rows y6-7 inside); gray_a = the eave tile (zero glass px, sandbox-proven)
// so windows are RHYTHM-DRAWN at the exact gray_c positions (one city-wide
// window rhythm law); gray_b = plank wall with 1px vertical slits on the
// plank-face centers x2/6/10/14 (seams x0/4/8/12, sandbox-proven), same band.
//
// LIT LAW v2 (r181, duskgold-manifest.windowlight_rate_v2 - the r180 S6a
// parameter source; the v1 face lit 100 pct of windows at the live activity
// 1.0 = the art-spec "all-lit windows are fake" violation, LIVE at census):
// lit iff fnv1a32(bid|date|widx) mod 10000 < floor(effective_rate*10000+0.5)
// where effective_rate = BASE_RATE(0.30) * Clamp01(zone activity) *
// floor_factor. floor_factor = linear per wall row bottom->top 1.0->0.6
// (denser low, sparser high - the art-target window rhythm); wallRows==1 ->
// factor 1.0. ThresholdFor / Fnv / widx enumeration law UNCHANGED (r159);
// the adapter multiplies BASE_RATE * factor at the single LitAt call site.
// Band check (r180 PS sweep, proof re-pins): overall lit fraction at
// activity 1.0 lands in [0.20, 0.30] every calendar date (5-date pinned
// 0.2305..0.2605). date = the Beijing calendar date (day-stable, cross-day
// variety, same-input-same-output per day - draw.py family). widx = window
// scan order: row-major cells (cy outer, cx inner) then family rect order.
// Zone rate: QUANT->quant, GAME_MAIN+ANNEX->gaming, MEDIA->media; the four
// north historical facades = 'city' = round(mean(quant,gaming,media), 2)
// (the strip belongs to no single company). Excluded by design: brain tower
// (superbody-blue CEO family), office band (v1 candidate), labs (glow).
//
// RENDER: order 3 with z -0.5 = the same-order z-toward-camera trick (r155
// water / r158 light-fx family): renders ABOVE the order-3 city tilemaps at
// z 0, below props 4 / signs 6 / street 7 / tint 8. Tier alpha closed set
// day/dawn 0, dusk 0.55, night 1.0 (r155 water family). Colors bake into the
// runtime texture (fill warm yellow / core bright interior, five-color law
// untouched - human windows are the warm-yellow family, city-core sec.VI);
// the sprite color stays neutral white carrying only the tier alpha.
// ASCII. No 3D.
using System;
using UnityEngine;

namespace FluxVerse
{
    public static class WindowLightRules
    {
        public const string Protocol = "fluxverse-windowlight/0.2";
        public const int BakedRound = 181;
        public const string MountPrefix = "WindowLight";
        public const int Order = 3;
        public const float Z = -0.5f;
        public const float Ppu = 16f;
        public const float PollIntervalSec = 10f;   // CityAmbient polling law

        // ---- tier alpha (manifest laws.tier_alpha) ----
        public static float AlphaFor(AmbientTier t)
        {
            if (t == AmbientTier.Dusk) return 0.55f;
            if (t == AmbientTier.Night) return 1.0f;
            return 0f;   // day + dawn: human windows are an evening phenomenon
        }

        // ---- colors (manifest laws.fill_rgb / core_rgb) ----
        public static readonly Color Fill = new Color(255f / 255f, 212f / 255f, 130f / 255f, 1f);
        public static readonly Color Core = new Color(255f / 255f, 236f / 255f, 180f / 255f, 1f);
        public const int CoreMinH = 6;   // h >= 6 windows get the middle 2 rows in core

        // ---- window families (manifest window_families, art px in the 16px cell) ----
        public struct WinRect { public int ax, ay, w, h; }

        static readonly WinRect[] FamGrayC = new WinRect[]
        {
            new WinRect { ax = 7, ay = 5, w = 2, h = 8 },
            new WinRect { ax = 10, ay = 5, w = 2, h = 8 }
        };
        // gray_a rhythm law: identical positions to the gray_c ART windows
        static readonly WinRect[] FamGrayA = FamGrayC;
        static readonly WinRect[] FamGrayB = new WinRect[]
        {
            new WinRect { ax = 2, ay = 5, w = 1, h = 8 },
            new WinRect { ax = 6, ay = 5, w = 1, h = 8 },
            new WinRect { ax = 10, ay = 5, w = 1, h = 8 },
            new WinRect { ax = 14, ay = 5, w = 1, h = 8 }
        };

        public const string FamGrayAName = "t_wall_gray_a";
        public const string FamGrayBName = "t_wall_gray_b";
        public const string FamGrayCName = "t_wall_gray_c";

        static WinRect[] FamilyFor(string tile)
        {
            if (tile == FamGrayBName) return FamGrayB;
            if (tile == FamGrayCName) return FamGrayC;
            return FamGrayA;   // gray_a + anything unknown degrades to the rhythm
        }

        // ---- buildings (manifest buildings[]; rect = world [x0,y0,x1,y1]) ----
        public struct Building
        {
            public string id; public string zone;
            public int cx0, cx1;           // cells_x span (inclusive)
            public int yBase, rows;
            public string wallA, wallB, roof;
            public float x0, y0, x1, y1;
            public int expectedWindows;
        }

        static readonly Building[] Table = new Building[]
        {
            new Building { id = "WLQuant", zone = "quant", cx0 = -2, cx1 = 2,
                yBase = -16, rows = 8, wallA = FamGrayBName, wallB = FamGrayCName,
                roof = "t_roof_a", x0 = -2f, y0 = -16f, x1 = 3f, y1 = -8f, expectedWindows = 106 },
            new Building { id = "WLGameMain", zone = "gaming", cx0 = -23, cx1 = -19,
                yBase = -16, rows = 5, wallA = FamGrayAName, wallB = FamGrayAName,
                roof = "t_roof_b", x0 = -23f, y0 = -16f, x1 = -18f, y1 = -11f, expectedWindows = 40 },
            new Building { id = "WLGameAnnex", zone = "gaming", cx0 = -26, cx1 = -25,
                yBase = -16, rows = 3, wallA = FamGrayAName, wallB = FamGrayAName,
                roof = "t_roof_b", x0 = -26f, y0 = -16f, x1 = -24f, y1 = -13f, expectedWindows = 8 },
            new Building { id = "WLMedia", zone = "media", cx0 = 19, cx1 = 24,
                yBase = -14, rows = 6, wallA = FamGrayBName, wallB = FamGrayBName,
                roof = "t_roof_b", x0 = 19f, y0 = -14f, x1 = 25f, y1 = -8f, expectedWindows = 120 },
            new Building { id = "WLNw", zone = "city", cx0 = -28, cx1 = -26,
                yBase = 9, rows = 3, wallA = FamGrayAName, wallB = FamGrayBName,
                roof = "t_roof_b", x0 = -28f, y0 = 9f, x1 = -25f, y1 = 12f, expectedWindows = 18 },
            new Building { id = "WLNwMid", zone = "city", cx0 = -9, cx1 = -7,
                yBase = 9, rows = 3, wallA = FamGrayCName, wallB = FamGrayAName,
                roof = "t_roof_b", x0 = -9f, y0 = 9f, x1 = -6f, y1 = 12f, expectedWindows = 12 },
            new Building { id = "WLNeMid", zone = "city", cx0 = 7, cx1 = 9,
                yBase = 9, rows = 3, wallA = FamGrayBName, wallB = FamGrayCName,
                roof = "t_roof_b", x0 = 7f, y0 = 9f, x1 = 10f, y1 = 12f, expectedWindows = 18 },
            new Building { id = "WLNe", zone = "city", cx0 = 26, cx1 = 28,
                yBase = 9, rows = 3, wallA = FamGrayAName, wallB = FamGrayCName,
                roof = "t_roof_b", x0 = 26f, y0 = 9f, x1 = 29f, y1 = 12f, expectedWindows = 12 }
        };

        public const int Count = 8;
        public const int TotalWindows = 334;   // 106+40+8+120+18+12+18+12 (proof re-derives)

        public static Building At(int i) { return Table[i]; }
        public static int IndexOf(string id)
        {
            for (int i = 0; i < Count; i++) if (Table[i].id == id) return i;
            return -1;
        }
        public static string MountName(int i) { return MountPrefix + Table[i].id; }

        public static float CenterX(int i) { return (Table[i].x0 + Table[i].x1) * 0.5f; }
        public static float CenterY(int i) { return (Table[i].y0 + Table[i].y1) * 0.5f; }
        public static int PxW(int i) { return (int)Math.Floor((Table[i].x1 - Table[i].x0) * 16f + 0.5f); }
        public static int PxH(int i) { return (int)Math.Floor((Table[i].y1 - Table[i].y0) * 16f + 0.5f); }

        // ---- window enumeration (widx law: row-major cells, family rect order) ----
        public struct Window
        {
            public int cx, cy;        // cell (world cell coords)
            public int ax, ay, w, h;   // art px inside the 16px cell (ay from tile top)
        }

        // enumerates every window of building i in the canonical widx order
        public static Window[] WindowsOf(int i)
        {
            Building b = Table[i];
            WinRect[] fa = FamilyFor(b.wallA), fb = FamilyFor(b.wallB);
            int wallRows = b.rows - 1;             // top row = roof, zero windows
            int cells = (b.cx1 - b.cx0 + 1) * wallRows;
            int total = 0;
            for (int cy = b.yBase; cy <= b.yBase + b.rows - 2; cy++)
                for (int cx = b.cx0; cx <= b.cx1; cx++)
                    total += (((cx + cy) & 1) == 0) ? fa.Length : fb.Length;
            Window[] list = new Window[total];
            int k = 0;
            for (int cy = b.yBase; cy <= b.yBase + b.rows - 2; cy++)
                for (int cx = b.cx0; cx <= b.cx1; cx++)
                {
                    WinRect[] fam = (((cx + cy) & 1) == 0) ? fa : fb;
                    for (int r = 0; r < fam.Length; r++)
                    {
                        Window w = new Window();
                        w.cx = cx; w.cy = cy;
                        w.ax = fam[r].ax; w.ay = fam[r].ay; w.w = fam[r].w; w.h = fam[r].h;
                        list[k++] = w;
                    }
                }
            return list;
        }

        public static int WindowCountOf(int i) { return WindowsOf(i).Length; }

        // window world rect (manifest rect_math)
        public static void WorldRectOf(Building b, Window w,
            out float wx0, out float wy0, out float wx1, out float wy1)
        {
            wx0 = w.cx + w.ax / 16f;
            wx1 = w.cx + (w.ax + w.w) / 16f;
            wy1 = (w.cy + 1) - w.ay / 16f;                 // top
            wy0 = (w.cy + 1) - (w.ay + w.h) / 16f;         // bottom
        }

        // ---- FNV-1a 32 (standard; golden vectors pin the C# build) ----
        public static uint Fnv1a(string s)
        {
            uint h = 2166136261u;
            for (int i = 0; i < s.Length; i++)
            {
                h ^= (uint)(s[i] & 0xFF);   // ASCII domain
                h *= 16777619u;
            }
            return h;
        }

        public static uint ThresholdFor(float rate)
        { return (uint)Math.Floor(rate * 10000.0 + 0.5); }   // round-half-up (r157 law)

        public static bool LitAt(string bid, string date, int widx, float rate)
        {
            return Fnv1a(bid + "|" + date + "|" + widx) % 10000u < ThresholdFor(rate);
        }

        // ---- rate law v2 (duskgold-manifest.windowlight_rate_v2, r180/r181) ----
        public const float BaseRate = 0.30f;   // law constant; activity stays LIVE
        public static float FloorFactor(Building b, Window w)
        {
            int wallRows = b.rows - 1;                 // top row = roof, zero windows
            if (wallRows <= 1) return 1f;
            float rowFromBottom = w.cy - b.yBase;      // 0 = bottom wall row
            return 1f - 0.4f * (rowFromBottom / (wallRows - 1));
        }

        // the single law entry the adapter feeds LitAt (v2: rate is EFFECTIVE)
        public static float EffectiveRate(Building b, Window w, float zoneRate)
        {
            return BaseRate * Clamp01(zoneRate) * FloorFactor(b, w);
        }

        // ---- zone rates (manifest zone_rate law) ----
        public static float Round2(float v) { return (float)Math.Round(v, 2); }

        public static float ZoneRateFor(string zone, float quant, float gaming, float media)
        {
            if (zone == "quant") return Round2(quant);
            if (zone == "gaming") return Round2(gaming);
            if (zone == "media") return Round2(media);
            return Round2((quant + gaming + media) / 3f);   // north 'city' mean
        }

        public static float Clamp01(float v) { return v < 0f ? 0f : (v > 1f ? 1f : v); }

        // ---- texture px mapping (building sprite, y=0 bottom row) ----
        // cell (cx,cy) block: tx0 = (cx - b.cx0) * 16, rows (cy - yBase) * 16 ..
        // window art rows ay..ay+h-1 (top-down) map to bottom-up rows
        // blockBottom + (16 - ay - h) .. blockBottom + (15 - ay)
        public static void TexRectOf(Building b, Window w,
            out int tx0, out int ty0, out int tw, out int th)
        {
            tw = w.w; th = w.h;
            tx0 = (w.cx - b.cx0) * 16 + w.ax;
            int blockBottom = (w.cy - b.yBase) * 16;
            ty0 = blockBottom + (16 - w.ay - w.h);
        }

        // core-row law: h >= 6 windows carry the middle 2 rows in core color
        public static bool IsCoreRow(int h, int rowFromTop)
        {
            if (h < CoreMinH) return false;
            int start = (h - 2) / 2;
            return rowFromTop >= start && rowFromTop < start + 2;
        }
    }
}
