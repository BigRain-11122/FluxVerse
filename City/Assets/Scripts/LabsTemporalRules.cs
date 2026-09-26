// FluxVerse P-39 slice (r189): CPH4 Labs temporal wiring - PURE LAW CORE.
// Source law (single-source law, OfficeRules/LabsRules idiom):
// Tools/city/labs-temporal-manifest.json (r188 labdigits bake 17-green +
// labstemporal sandbox 70-green + style gate 4x PASS; provenance = TECH
// sec.9 P-39 r164..r188 rows). The proof mirror-reads every constant
// against that manifest file each run - this table never drifts alone.
//
// D-02 STALE HONESTY LAW (the temporal round's constitution): the digits
// strip carries GLYPHS ONLY - every displayed value (population total,
// open proposals, the six wall slots) is read LIVE from
// world/world-state.json each poll. A number baked into a sprite would go
// stale = fake state (manifest rejected.baked_wall_numbers). Displays are
// emitted light: constant alpha, zero tier modulation (the sign family
// law, manifest rejected.tier_alpha_on_readouts) - the ambient tint plane
// still shades them like every world object.
//
// DATA FACE (probes r164/r165): state.census { total, wall[ top-15 cards,
// wall[0] = newest = highest id ] } + state.governance.evolution
// { open_proposals }. Grandfather (manifest poll.grandfather): census
// section missing -> birth readout hidden + every wall overlay off;
// evolution section missing -> sandbox readout hidden. The facility
// sprites stay as authored - honest absence, never fake numbers.
// The incubator stays STANDBY until T-FV-104 (LAB_INCUBATE_* reserved).
// ASCII. Pure 2D. No 3D.
using System;
using System.IO;
using UnityEngine;

namespace FluxVerse
{
    // one census wall card row (public-whitelist fields only, probe r165)
    [Serializable]
    public class TemporalWallCard
    {
        public string id;
        public string name;
        public string species;
        public string district;
        public string profession;
    }

    // the temporal snapshot the adapter consumes (two independent legs)
    public class TemporalSnapshot
    {
        public bool hasCensus;
        public long censusTotal;        // live population total
        public int wallCount;           // live wall card count (top-15)
        public string newestCardId;     // wall[0].id (report face)
        public bool hasEvolution;
        public long openProposals;      // live open proposals count
    }

    // pure static law core: constants + art->world + parse + derive.
    // No MonoBehaviour. Person/city data stays out (r10 stale-copy law).
    public static class LabsTemporalRules
    {
        public const string ManifestPath = "Tools/city/labs-temporal-manifest.json";
        public const string Protocol = "fluxverse-labstemporal/0.1";

        // ---- digits strip (r188 bake; glyphs only, never values) ----
        public const string DigitsPath = "Assets/ArtPacks/lab-glass/lab-digits.png";
        public const int DigitsPxW = 80;             // 10 glyph cells
        public const int DigitsPxH = 10;
        public const int CellW = 7;                  // glyph cell px
        public const int CellH = 10;
        public const int Pitch = 8;                  // cell advance px (1px gap)
        public const float PPU = 24f;                // lab-glass divisor law
        public const string DigitsSha12 = "A73F354E5F14";   // r188 bake pin
        public static readonly Color OnColor = new Color(200f / 255f, 240f / 255f, 255f / 255f, 235f / 255f);
        public static readonly Color OffColor = new Color(50f / 255f, 90f / 255f, 140f / 255f, 70f / 255f);

        // ---- readout row law (center-anchored, live width) ----
        public const int OverlayOrder = 6;           // mounting tier: signs 6 < street 7
        public const float BackingZ = 0.30f;         // greater z = farther (r158 z physics)
        public const float DigitsZ = 0.28f;          // smaller z = closer = on top of the backing
        public const float OverlayZ = -0.5f;         // wall/pulse overlays sit in front of the glass
        public const float BackingPadX = 0.06f;
        public const float BackingPadY = 0.05f;
        public static readonly Color BackingColor = new Color(10f / 255f, 18f / 255f, 34f / 255f, 150f / 255f);

        // ---- L2 birth station (half-alive: wall + total always on) ----
        public const float BirthX0 = 23f, BirthY0 = 9f, BirthX1 = 24f, BirthY1 = 12f;
        public const int BirthCanvasPx = 24, BirthPxPerUnit = 24;   // 24x72 art = 1x3u
        public static readonly Vector2 BirthReadoutCenter = new Vector2(23.5f, 14.1f);
        public const int BirthMaxDigits = 6;
        // the 6-digit cap backing (mount swept vs band/street/star in the r188 gate)
        public static readonly Rect BirthCapBacking = new Rect(22.4608f, 13.8417f, 2.0783f, 0.5167f);

        // wall slots: slot i <-> census.wall[i] (wall[0] = newest, r165 frontier law)
        public const int WallSlotCount = 6;
        public const float WallNewestAlpha = 235f / 255f;   // slot 0 = the newest card, brightest
        public const float WallLitAlpha = 160f / 255f;      // every older lit slot
        // art px rects on the 24x72 birth canvas (r185 bake canon: inner lit
        // core 3x2 px per 5x4 slot, cols 7/13 rows 48/53/58 - reading order
        // row-major from the top-left newest slot)
        public static readonly int[,] WallSlotArt =
        {
            { 8, 49, 10, 50 }, { 14, 49, 16, 50 },
            { 8, 54, 10, 55 }, { 14, 54, 16, 55 },
            { 8, 59, 10, 60 }, { 14, 59, 16, 60 },
        };

        // ceremony (RESIDENT_BIRTH): cabin-print pulse - chamber glow + the
        // newest card slot burst. TriggerDirect in proof, live tail in play.
        public const string CeremonyEvent = "RESIDENT_BIRTH";
        public const string CeremonyActionRef = "birth_station_cabin_print";
        public static readonly int[] ChamberArt = { 5, 8, 18, 43 };
        public const float CeremonyPeakAlpha = 220f / 255f;
        public const float BurstPeakAlpha = 1f;              // 255 - the newest slot burst
        public const float CeremonyDuration = 2.5f;

        // ---- L3 sandbox (the only LIVE face - city future) ----
        public const float SbxC0 = -6f, SbxY0 = 9f, SbxX1 = -5f, SbxY1 = 11f;
        public const int SbxCanvasPx = 24, SbxPxPerUnit = 24;    // 24x48 art = 1x2u
        public static readonly Vector2 SbxReadoutCenter = new Vector2(-5.4f, 11.4f);
        public const int SbxMaxDigits = 3;
        public static readonly Rect SbxCapBacking = new Rect(-5.9392f, 11.1417f, 1.0783f, 0.5167f);
        public const string PulseNewEvent = "PROPOSAL_NEW";
        public const string PulseNewActionRef = "sandbox_model_lights_up";
        public static readonly int[] HoloArt = { 8, 6, 15, 13 };     // hologram projector band
        public const float PulseNewPeakAlpha = 180f / 255f;
        public const string PulseAppliedEvent = "PROPOSAL_APPLIED";
        public const string PulseAppliedActionRef = "sandbox_district_lights_canon";
        public static readonly int[,] BlockArt = { { 7, 18, 13, 29 }, { 15, 15, 21, 29 } };  // both mini-city blocks
        public const float PulseAppliedPeakAlpha = 160f / 255f;
        public const float PulseDuration = 2.5f;

        // ---- L1 incubator (standby law - Phase 1 gated, T-FV-104) ----
        public const bool IncubatorStandby = true;
        public const int IncubatorPulseCount = 0;         // LAB_INCUBATE_* stay reserved

        // ---- poll law (CityStreetBehavior r124 precedent) ----
        public const float PollIntervalSec = 10f;
        public const int PulseEventCount = 3;

        // ---- art -> world (manifest art_to_world law) ----
        // birth: wx0 = X0 + ax0/24; wx1 = X0 + (ax1+1)/24; wyTop = Y1 - ay0/24; wyBot = Y1 - (ay1+1)/24
        public static Rect ArtToWorldBirth(int ax0, int ay0, int ax1, int ay1)
        {
            float wx0 = BirthX0 + ax0 / (float)BirthPxPerUnit;
            float wx1 = BirthX0 + (ax1 + 1) / (float)BirthPxPerUnit;
            float wyTop = BirthY1 - ay0 / (float)BirthPxPerUnit;
            float wyBot = BirthY1 - (ay1 + 1) / (float)BirthPxPerUnit;
            return new Rect(wx0, wyBot, wx1 - wx0, wyTop - wyBot);
        }

        // sandbox: same divisor law on the 24x48 canvas, base rect [-6,9,-5,11]
        public static Rect ArtToWorldSandbox(int ax0, int ay0, int ax1, int ay1)
        {
            float wx0 = SbxC0 + ax0 / (float)SbxPxPerUnit;
            float wx1 = SbxC0 + (ax1 + 1) / (float)SbxPxPerUnit;
            float wyTop = SbxY1 - ay0 / (float)SbxPxPerUnit;
            float wyBot = SbxY1 - (ay1 + 1) / (float)SbxPxPerUnit;
            return new Rect(wx0, wyBot, wx1 - wx0, wyTop - wyBot);
        }

        public static Rect WallSlotRect(int i) { Rect r = ArtToWorldBirth(WallSlotArt[i, 0], WallSlotArt[i, 1], WallSlotArt[i, 2], WallSlotArt[i, 3]); return r; }
        public static Rect ChamberRect() { return ArtToWorldBirth(ChamberArt[0], ChamberArt[1], ChamberArt[2], ChamberArt[3]); }
        public static Rect HoloRect() { return ArtToWorldSandbox(HoloArt[0], HoloArt[1], HoloArt[2], HoloArt[3]); }
        public static Rect BlockRect(int b) { return ArtToWorldSandbox(BlockArt[b, 0], BlockArt[b, 1], BlockArt[b, 2], BlockArt[b, 3]); }

        // ---- readout row derive (live width, never pinned) ----
        public static float SpanPxOf(int ndigits) { return ndigits * Pitch - 1f; }

        // the backing rect for a LIVE digit count (row width derives from
        // the live value - dynamic sizing, no pinned width)
        public static Rect BackingRectOf(Vector2 center, int ndigits)
        {
            float rowW = SpanPxOf(ndigits) / PPU;
            float h = CellH / PPU;
            return new Rect(center.x - rowW / 2f - BackingPadX, center.y - h / 2f - BackingPadY,
                rowW + 2f * BackingPadX, h + 2f * BackingPadY);
        }

        // digit count of a live value, capped; an over-cap value keeps its
        // low-order cap digits (still a live read, never a fake overflow)
        public static int DigitCountOf(long value, int cap)
        {
            int n = 1;
            long v = value >= 0 ? value : 0;
            while (v >= 10) { v /= 10; n++; }
            return n > cap ? cap : n;
        }

        // the k-th digit (left to right, 0-based) of the clamped value
        public static int DigitAt(long value, int ndigits, int k)
        {
            long mod = 1;
            for (int c = 0; c < ndigits; c++) mod *= 10;
            long kept = (value >= 0 ? value : 0) % mod;   // low-order ndigits
            long scale = 1;
            for (int c = 0; c < ndigits - 1 - k; c++) scale *= 10;
            return (int)((kept / scale) % 10);
        }

        // wall lit law: slot i lights iff census.wall[i] exists; the count
        // saturates at the six slots (top-15 wall >= 6 today, live gate)
        public static int WallLitCountOf(int wallCount)
        {
            return wallCount < 0 ? 0 : (wallCount > WallSlotCount ? WallSlotCount : wallCount);
        }

        // ---- state file parse (world/ is the perceptor's single-writer
        // domain, P-43 law: this core READS ONLY, never writes) ----
        [Serializable] class WsCensus { public long total; public TemporalWallCard[] wall; }
        [Serializable] class WsEvolution { public long applied; public long open_proposals; public long total; }
        [Serializable] class WsGovernance { public WsEvolution evolution; }
        [Serializable] class WsStateFile { public WsCensus census; public WsGovernance governance; }

        public static string StatePath()
        {
            string projectRoot = Path.GetDirectoryName(Application.dataPath);   // .../City
            string repoRoot = Path.GetDirectoryName(projectRoot);               // .../FluxVerse
            return Path.Combine(repoRoot, "world", "world-state.json");
        }

        // whole-file parse; null = absent file / broken json (honest absence)
        public static TemporalSnapshot Parse(string json)
        {
            if (string.IsNullOrEmpty(json)) return null;
            try
            {
                WsStateFile f = JsonUtility.FromJson<WsStateFile>(json);
                if (f == null) return null;
                TemporalSnapshot s = new TemporalSnapshot();
                if (f.census != null)
                {
                    s.hasCensus = true;
                    s.censusTotal = f.census.total;
                    s.wallCount = f.census.wall != null ? f.census.wall.Length : 0;
                    if (f.census.wall != null && f.census.wall.Length > 0 && f.census.wall[0] != null)
                        s.newestCardId = f.census.wall[0].id;
                }
                if (f.governance != null && f.governance.evolution != null)
                {
                    s.hasEvolution = true;
                    s.openProposals = f.governance.evolution.open_proposals;
                }
                return s;
            }
            catch { return null; }
        }

        // the live perceptor snapshot; null = absent/unreadable file
        public static TemporalSnapshot LoadStateFile()
        {
            string p = StatePath();
            if (!File.Exists(p)) return null;
            try { return Parse(File.ReadAllText(p)); }
            catch { return null; }
        }

        // digit row world rect of a single glyph slot (position k, 0-based left)
        public static Vector2 DigitCenterOf(Vector2 center, int ndigits, int k)
        {
            float rowW = SpanPxOf(ndigits) / PPU;
            float leftX = center.x - rowW / 2f;
            return new Vector2(leftX + (k * Pitch + CellW / 2f) / PPU, center.y);
        }
    }
}
