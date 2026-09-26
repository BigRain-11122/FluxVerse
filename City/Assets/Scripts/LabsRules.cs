// FluxVerse P-39 slice (r142+r187): CPH4 Labs physical embodiment - pure rules table
// (OfficeRules idiom; person/city data stays out - the r10 stale-copy law).
// Source law = Tools/city/labs-manifest.json v0.2 (r141 sandbox 2291 green +
// r186 1u-drop sandbox 99 green; quota ledger: 3 of 5 facility pieces stand -
// pod + birth-1u + sandbox-1u, all zero-move; the two incubation shells stay
// open with Phase-1-gated performance, D-20260926-06 candidate iv).
// Family law (manifest law.sprite_family): the incubator pod is a LabPod*
// building-family GO at sorting order 3; the conduit run + stub are LabPipe*
// structure-class GOs at order 6 (signs 6 < street 7 < tint 8 - the
// NeonAntenna r87 exempt precedent for above-roofline structure). Pivot
// center, GO pos = world rect center, localScale 1; NEVER painted into
// CityGAME/CityQUANT/CityMEDIA tilemaps (IdentityProof district derivation
// and every sec8 feet cell stay untouched).
// Zero-move law (manifest law.zero_move): 1 pod + the conduit with ZERO
// seat/robot/vehicle/sign/eave-slot moves - the pod's street life stays:
// ResN02 stands 0.333u west of the pod, EAVE-N01 keeps 1.0u east.
// Conduit law (manifest law.pipe_band / pipe_crossing): elevated band
// y 13.0..13.6667; west end flush at the brain-tower east face x=3.0 (the
// B7 dock - "research conclusions flow back to the governance layer"); east
// end flush at the pod east face x=23.0; the stub mounts the pod roof
// (sinks 0.3333 into the pod top, sign-mounting precedent) and ties the
// band down to the incubator; the run crosses the east avenue road cells
// (vcols 17/18) ONLY inside the elevated band (box-on-ledge precedent) -
// buildings and stand cells still never touch road cells.
// Zone disjointness (manifest law.zone_disjointness): the band never meets
// the COMMIT cross-river stream (river band Y -4.6..+4.6, r116 canon) nor
// the TRANSFER trunk street band (y -7.5, r114 canon).
// Low-rise law (manifest law.low_rise): pod top 12.0 < offices 13 < brain
// 19 - the block reads by its glass-glow, never by height; band top 13.6667
// stays under the r51 far-shore strip (y 14.26..14.74) and inside the tint
// band. Stock = Assets/ArtPacks/lab-glass/ (r140 8-piece self-bake + r168 2u
// pair + r185 1u pair); the table consumes pod-tall 1 + pipe-h 10 + pipe-v 1
// + birth-1u 1 + sandbox-1u 1. The r186 1u drops ride the r169 certified
// slots S5 (pod-east-face flush, 1x3u) and S4 (B1 east face flush, 1x2u).
// ASCII. No 3D.
using UnityEngine;

namespace FluxVerse
{
    public static class LabsRules
    {
        public const int PodOrder = 3;       // building family: base tilemaps <= 3 < props 4
        public const int PipeOrder = 6;       // mounting/structure tier: signs 6 < street 7 < tint 8
        public const float PPU = 24f;         // lab-glass divisor (r140 importer row, never assumed)
        public const int PodCount = 1;
        public const int RunCount = 10;
        public const int StubCount = 1;
        public const int BirthCount = 1;     // r186 1u drop 1/2 (D-20260926-06 candidate iv)
        public const int SandboxCount = 1;    // r186 1u drop 2/2
        public const int Count = PodCount + RunCount + StubCount + BirthCount + SandboxCount;
        public const string PodNamePrefix = "LabPod";
        public const string PipeNamePrefix = "LabPipe";
        public const string BirthNamePrefix = "LabBirth";
        public const string SandboxNamePrefix = "LabSandbox";

        public const string PodPath = "Assets/ArtPacks/lab-glass/lab-pod-tall.png";
        public const string PipeHPath = "Assets/ArtPacks/lab-glass/lab-pipe-h.png";
        public const string PipeVPath = "Assets/ArtPacks/lab-glass/lab-pipe-v.png";
        public const string BirthPath = "Assets/ArtPacks/lab-glass/lab-birth-1u.png";
        public const string SandboxPath = "Assets/ArtPacks/lab-glass/lab-sandbox-1u.png";

        // band laws (the r141 sandbox is the mirror of these constants)
        public const float PodTopMax = 12f;          // labs low-rise cap: every building-family top <= 12
        public const float SandboxTopMax = 11f;     // r186 S4 slot pin: the sandbox top 11 (2u on base 9)
        public const float BandY0 = 13f;             // elevated conduit band floor
        public const float BandY1 = 13.6667f;        // elevated conduit band top (16px pipe body)
        public const float FarShoreStripY0 = 14.26f; // r51 far-shore strip window floor
        public const float FrameHalfX = 35.256f;     // static L0 frame: halfW 35.556 - 0.3 margin
        public const float TintFloorY = -16f;
        public const float TintCeilY = 15f;
        public const float TowerDockX = 3f;          // west end flush at the brain-tower east face
        public const float StubSink = 0.3333f;      // stub sinks into the pod top (host-mount)
        public const float CommitRiverY1 = 4.6f;     // COMMIT cross-river stream top (r116 canon)
        public const float TransferStreetY = -7.5f;   // TRANSFER trunk street band (r114 canon)
        public const float RoadWestX = 17f;           // east avenue road cells (vcols 17/18)
        public const float RoadEastX = 19f;

        // family codes: 0 = pod, 1 = pipe run, 2 = pipe stub, 3 = birth, 4 = sandbox
        public const int FamBirth = 3;
        public const int FamSandbox = 4;

        public struct Lab
        {
            public string name;             // scene GO name (ASCII)
            public string path;             // project-relative asset path
            public int pxW, pxH;            // tight sprite pixels
            public float x0, y0, x1, y1;    // world rect min/max corners
            public int family;              // 0 = pod, 1 = pipe run, 2 = pipe stub
        }

        static readonly Lab[] Table = new Lab[]
        {
            // L1: the labs' first physical presence - incubator pod #1 (tall
            // glass pod, dormant-honest face) in the B3 west front field, across
            // the east avenue from the bus stop. ResN02 stands 0.333u west.
            new Lab { name = "LabPodTall01", path = PodPath, pxW = 48, pxH = 72,
                      x0 = 21f, y0 = 9f, x1 = 23f, y1 = 12f, family = 0 },
            // P01..P10: the conduit run - west end docks at the brain-tower east
            // face x=3, ten contiguous 2u segments, east end flush at the pod
            // east face x=23 (P10 rides over the pod roofline).
            new Lab { name = "LabPipeH01", path = PipeHPath, pxW = 48, pxH = 16,
                      x0 = 3f, y0 = BandY0, x1 = 5f, y1 = BandY1, family = 1 },
            new Lab { name = "LabPipeH02", path = PipeHPath, pxW = 48, pxH = 16,
                      x0 = 5f, y0 = BandY0, x1 = 7f, y1 = BandY1, family = 1 },
            new Lab { name = "LabPipeH03", path = PipeHPath, pxW = 48, pxH = 16,
                      x0 = 7f, y0 = BandY0, x1 = 9f, y1 = BandY1, family = 1 },
            new Lab { name = "LabPipeH04", path = PipeHPath, pxW = 48, pxH = 16,
                      x0 = 9f, y0 = BandY0, x1 = 11f, y1 = BandY1, family = 1 },
            new Lab { name = "LabPipeH05", path = PipeHPath, pxW = 48, pxH = 16,
                      x0 = 11f, y0 = BandY0, x1 = 13f, y1 = BandY1, family = 1 },
            new Lab { name = "LabPipeH06", path = PipeHPath, pxW = 48, pxH = 16,
                      x0 = 13f, y0 = BandY0, x1 = 15f, y1 = BandY1, family = 1 },
            new Lab { name = "LabPipeH07", path = PipeHPath, pxW = 48, pxH = 16,
                      x0 = 15f, y0 = BandY0, x1 = 17f, y1 = BandY1, family = 1 },
            new Lab { name = "LabPipeH08", path = PipeHPath, pxW = 48, pxH = 16,
                      x0 = 17f, y0 = BandY0, x1 = 19f, y1 = BandY1, family = 1 },
            new Lab { name = "LabPipeH09", path = PipeHPath, pxW = 48, pxH = 16,
                      x0 = 19f, y0 = BandY0, x1 = 21f, y1 = BandY1, family = 1 },
            new Lab { name = "LabPipeH10", path = PipeHPath, pxW = 48, pxH = 16,
                      x0 = 21f, y0 = BandY0, x1 = 23f, y1 = BandY1, family = 1 },
            // PV1: the pod-to-conduit leg - mounts the pod roof (sinks 0.3333
            // into the pod top y=12, rises to the band top) and ties the run
            // down to the incubator pod (sign-mounting precedent).
            new Lab { name = "LabPipeV01", path = PipeVPath, pxW = 16, pxH = 48,
                      x0 = 22.1667f, y0 = 11.6667f, x1 = 22.8333f, y1 = BandY1, family = 2 },
            // L2 (r186 S5, D-20260926-06 candidate iv drop 1/2): the resident
            // birth station, 1u variant (24x72 native redraw, r185 - upper
            // glass cabin + lower 2x5 six-slot birth wall, two lit card
            // positions = display backlight hardware). Sits flush between the
            // L1 pod east face x=23 and the EAVE-N01 body west edge x=24 -
            // the ONLY 1x3u position in that stretch (r169 certified): new
            // life arrives where strategies are hatched. Rolling card
            // semantics wire with the M2 temporal round (census state leg
            // live r165) - statics never bake dead numbers (stale honesty law).
            new Lab { name = "LabBirth01", path = BirthPath, pxW = 24, pxH = 72,
                      x0 = 23f, y0 = 9f, x1 = 24f, y1 = 12f, family = FamBirth },
            // L3 (r186 S4, drop 2/2): the city-future sand table, 1u variant
            // (24x48 native redraw - holo band + two-building micro city +
            // tallest antenna). Pins the B1-face-flush end of the r169 S4
            // position family - the governor's model table at the brain's
            // side. Proposals state face wires with the M2 temporal round
            // (evolution state leg live r164).
            new Lab { name = "LabSandbox01", path = SandboxPath, pxW = 24, pxH = 48,
                      x0 = -6f, y0 = 9f, x1 = -5f, y1 = 11f, family = FamSandbox },
        };

        public static Lab At(int i) { return Table[i]; }
        public static string Name(int i) { return Table[i].name; }
        public static string Path(int i) { return Table[i].path; }
        public static int PxW(int i) { return Table[i].pxW; }
        public static int PxH(int i) { return Table[i].pxH; }
        public static float X0(int i) { return Table[i].x0; }
        public static float Y0(int i) { return Table[i].y0; }
        public static float X1(int i) { return Table[i].x1; }
        public static float Y1(int i) { return Table[i].y1; }
        public static float WorldW(int i) { return Table[i].x1 - Table[i].x0; }
        public static float WorldH(int i) { return Table[i].y1 - Table[i].y0; }
        public static int Family(int i) { return Table[i].family; }
        public static int OrderOf(int i) { return IsBuilding(i) ? PodOrder : PipeOrder; }
        public static bool IsPod(int i) { return Table[i].family == 0; }
        // building-family: pod + birth + sandbox (sorting order 3, street-face
        // laws; the pipe families ride the structure tier instead)
        public static bool IsBuilding(int i)
        {
            return Table[i].family == 0 || Table[i].family == FamBirth || Table[i].family == FamSandbox;
        }
        public static bool IsPipe(int i) { return Table[i].family == 1 || Table[i].family == 2; }
        // any labs-family scene GO name (the sweep/census consumers, r187)
        public static bool IsLabsName(string n)
        {
            return n.StartsWith(PodNamePrefix) || n.StartsWith(PipeNamePrefix)
                || n.StartsWith(BirthNamePrefix) || n.StartsWith(SandboxNamePrefix);
        }

        // sprite pivot = center; GO pos = world rect center (family law)
        public static Vector2 Pos(int i)
        {
            return new Vector2((Table[i].x0 + Table[i].x1) / 2f, (Table[i].y0 + Table[i].y1) / 2f);
        }

        public static Rect WorldRect(int i)
        {
            return new Rect(Table[i].x0, Table[i].y0, WorldW(i), WorldH(i));
        }

        public static bool InFrame(int i)
        {
            return Mathf.Abs(Table[i].x0) <= FrameHalfX && Mathf.Abs(Table[i].x1) <= FrameHalfX;
        }

        public static bool InTintBand(int i)
        {
            return Table[i].y0 >= TintFloorY && Table[i].y1 <= TintCeilY;
        }

        // index finders (single-family invariants asserted by the proof)
        public static int PodIndex()
        {
            for (int i = 0; i < Count; i++) if (Table[i].family == 0) return i;
            return -1;
        }

        public static int StubIndex()
        {
            for (int i = 0; i < Count; i++) if (Table[i].family == 2) return i;
            return -1;
        }

        // does the rect cross the east avenue road band [17,19]? (strict open)
        public static bool CrossesRoad(int i)
        {
            return Table[i].x0 < RoadEastX && RoadWestX < Table[i].x1;
        }
    }
}
