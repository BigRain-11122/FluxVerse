// FluxVerse P-28(3) pool-coverage face (r44) + vertical-avenue facings (r45):
// parked-vehicle pure rules (source
// pack = MiniGame S-library AA-016.02 modern exteriors, 16x16-singles tier at
// ~48px native density; S-library direct-use chain, license gate pre-cleared
// 2026-09-22, consumption provenance = TECH sec.9 P-21(3) r44/r45 ledger lines).
// Street-life demand per DESIGN organ table: the roads layer is built and
// walked by robots (fleet avatars) and residents (census identities); parked
// cars / one bus / vendor carts / a bus-stop sign are static street furniture.
// v0 = STATIC parked scenery persisted in the scene (r35/r36 static-vs-transient
// boundary law); driving/parking animation is an M2 event-driven face, never a
// decorative loop. Frame files are tight-cropped by Tools/city/crop-vehicle-frames.ps1
// (the singles ship asymmetric transparent padding; tight crop = symmetric pivot
// so the ground-line math below is exact - r37 zero-floating law).
// Scale law: PPU24 divisor absorbs the pack's pixel density (r37 residents
// precedent - the divisor moves, the world law never does). Sizes: car 2.54x1.54u
// (side) / 1.33x2.38u (avenue rear/front), camper 3.92x2.33u, bus 4.63x2.58u,
// carts 1.83x2.0u / 2.0x2.29u, stop sign 0.63x1.54u - all under the 2.8u resident
// line (P-17 small-props canon; the >=3.3u tall singles were gate-rejected,
// disposal recorded in TECH P-21 row).
// Placement law: FEET ON THE GROUND LINE - Street class parks on the vertical
// middle of the 2-row road band (south street rows -8/-7 -> ground y = -7,
// north street rows 7/8 -> ground y = +8), or centered across a 2-wide vertical
// avenue (CitySkeletonBuilder vcols -18/-17 and 17/18 -> center x = +-17.5,
// feet cell lands on the west column of each pair by FloorToInt law), so the
// feet cell is a Roads tile; Plaza class (carts, stop sign) stands on Ground
// pavement cells. The proof re-derives the feet cell from the live tilemaps,
// never from this comment.
// r45 traffic-side law: the two vertical avenues read as a two-way pair in the
// city plan (east avenue = northbound lane, west = southbound), so the east car
// faces up (rear view, Car_Up) and the west car faces down (front view, Car_Down)
// - the same right-hand-traffic side a CEO reads off a real city map.
// Clearance law: center distance >= 2.6u to every robot, >= 2.8u to every
// resident (r37 spacing family), >= 2.6u between vehicles, and no overlap with
// any mounted neon-sign rect expanded by 0.4u (r35 law). Sorting: street layer
// order 7 = same as robots/residents (signs 6 < street 7 < tint 8). Five-color
// law untouched: vehicle paint is ambient scenery. ASCII. No 3D.
using UnityEngine;

namespace FluxVerse
{
    public static class VehicleRules
    {
        public const int Order = 7;            // street layer: signs 6 < street 7 < tint 8
        public const float PPU = 24f;           // density divisor (r37 law); importer enforced, never assumed
        public const int Count = 10;
        public const string NamePrefix = "Vehicle";

        public struct Veh
        {
            public string name;    // scene GO name (ASCII)
            public string path;    // project-relative asset path (Assets/...)
            public int pxW, pxH;   // tight-cropped sprite pixels
            public float x;        // world center x
            public float groundY;  // the ground line the wheels/feet stand on
            public bool street;   // true = parked on a Roads cell, false = Ground pavement
        }

        public static Veh At(int i) { return Table[i]; }
        public static string Name(int i) { return Table[i].name; }
        public static string Path(int i) { return Table[i].path; }
        public static float PxW(int i) { return Table[i].pxW; }
        public static float PxH(int i) { return Table[i].pxH; }
        public static float WorldW(int i) { return Table[i].pxW / PPU; }
        public static float WorldH(int i) { return Table[i].pxH / PPU; }
        public static Vector2 Pos(int i) { return new Vector2(Table[i].x, Table[i].groundY + WorldH(i) / 2f); }
        public static float FeetY(int i) { return Table[i].groundY; }
        public static bool IsStreet(int i) { return Table[i].street; }

        // framing: every vehicle fully inside the L0 view (ortho 20, aspect 16:9)
        // with margin, and inside the tint band y -16..+14 (an untinted sliver
        // would read as the r22 edge-band debt all over again)
        public static bool InView(int i, float halfW, float halfH)
        {
            Veh v = Table[i];
            float hw = WorldW(i) / 2f, hh = WorldH(i) / 2f;
            Vector2 c = Pos(i);
            return Mathf.Abs(c.x) + hw <= halfW - 0.3f && Mathf.Abs(c.y) + hh <= halfH - 0.3f;
        }

        public static bool InTintBand(int i)
        {
            float top = Pos(i).y + WorldH(i) / 2f;
            return FeetY(i) >= -16f + 0.1f && top <= 14f;
        }

        // the tile cell the feet point stands in (parking slot law)
        public static Vector2Int FeetCell(int i)
        {
            return new Vector2Int(Mathf.FloorToInt(Table[i].x), Mathf.FloorToInt(FeetY(i)));
        }

        static readonly Veh[] Table = new Veh[]
        {
            // 0. south street, west stretch in front of GAME - parked sedan (faces
            // west); x sits clear of the r38 BIGGAME roof plate (proof-caught clip)
            new Veh { name = "VehicleCarW",     path = "Assets/Art/Vehicles/frames/vehicle-car-l.png",     pxW = 61,  pxH = 37, x = -26.6f, groundY = -7.0f,  street = true },
            // 1. south street, east of the QUANT tower front - second color (faces east)
            new Veh { name = "VehicleCarQE",    path = "Assets/Art/Vehicles/frames/vehicle-car-r2.png",    pxW = 61,  pxH = 37, x = 5.5f,   groundY = -7.0f,  street = true },
            // 2. south street, east stretch toward MEDIA - third color (faces east)
            new Veh { name = "VehicleCarE",     path = "Assets/Art/Vehicles/frames/vehicle-car-r.png",     pxW = 61,  pxH = 37, x = 16.0f,  groundY = -7.0f,  street = true },
            // 3. south street, far west - parked camper van (the street's big-west silhouette)
            new Veh { name = "VehicleCamperW",  path = "Assets/Art/Vehicles/frames/vehicle-camper-r.png",  pxW = 94,  pxH = 56, x = -30.5f, groundY = -7.0f,  street = true },
            // 4. north street, east side - the bus (rows 7/8 band, ground line +8)
            new Veh { name = "VehicleBusN",     path = "Assets/Art/Vehicles/frames/vehicle-bus-r.png",      pxW = 111, pxH = 62, x = 12.0f,  groundY = 8.0f,   street = true },
            // 5. QUANT plaza, east edge - street-food cart (pavement class)
            new Veh { name = "VehicleCartQ",    path = "Assets/Art/Vehicles/frames/vehicle-cart-food.png",  pxW = 44,  pxH = 48, x = 7.5f,   groundY = -12.5f, street = false },
            // 6. GAME front plaza, west edge - fruit/flower cart (pavement class)
            new Veh { name = "VehicleCartG",   path = "Assets/Art/Vehicles/frames/vehicle-cart-fruit.png", pxW = 48,  pxH = 55, x = -25.5f, groundY = -13.0f, street = false },
            // 7. north street, south sidewalk east of the bus - bus-stop sign
            // (pavement class; x clear of the north neon banner row, proof-caught)
            new Veh { name = "VehicleStopN",    path = "Assets/Art/Vehicles/frames/vehicle-stop-sign.png",  pxW = 15,  pxH = 37, x = 16.5f,  groundY = 9.0f,   street = false },
            // 8. east vertical avenue (cols 17/18, MEDIA side) - sedan facing
            // north, rear view; two-way-pair northbound lane (r45 traffic-side
            // law), centered across the 2-wide avenue
            new Veh { name = "VehicleCarAveE",  path = "Assets/Art/Vehicles/frames/vehicle-car-up.png",     pxW = 32,  pxH = 57, x = 17.5f,  groundY = -10.0f, street = true },
            // 9. west vertical avenue (cols -18/-17, GAME side) - sedan facing
            // south, front view; southbound lane; sits clear of the NeonGameWest2
            // banner rect and the ResStWest pavement resident (proof-gated)
            new Veh { name = "VehicleCarAveW",  path = "Assets/Art/Vehicles/frames/vehicle-car-down.png",   pxW = 32,  pxH = 57, x = -17.5f, groundY = -11.5f, street = true },
        };
    }
}
