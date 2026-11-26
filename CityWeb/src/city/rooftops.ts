import * as THREE from "three";

// ============================================================================
// Rooftop antenna + aviation-beacon batch — wave 2 lane B (project
// ROOFTOP_OFFICE_RE). GTA6 rules card:
//   B4 — spires/antennas are NOT counted into building height, but must be
//        added as a separate pass, and only on T1/T2 (tall) towers.
//   B5 — flat-roof parapet walls: DEFERRED on purpose; this wave's geometry
//        budget is reserved for the reflection wave (see rooftops.notes.md).
//
// Module contract, wired verbatim by the coordinator:
//   export interface RooftopsRig { root; update(dt, elapsed) }
//   export function buildRooftops(): RooftopsRig
//
// What lands in the scene: 16 hand-placed rooftop masts — the six landmark
// rig tops (Shanghai Tower 632 / SWFC 492 / Oriental Pearl 468 / Jinmao
// 420.5 / White Magnolia crown / Waibaidu north portal) plus the ten 200 m+
// Lujiazui extrusion roofs — drawn as exactly two InstancedMeshes (one mast
// batch, one beacon batch), i.e. 2 draw calls for the whole skyline set.
//
// Units: 1 unit = 1 m in the geo/realCity.ts world (x east, z south, north
// = -Z). All positions below are baked constants, computed OFFLINE with the
// same equirectangular projection as geo/projection.ts (origin 31.2430 N /
// 121.4950 E): landmark rows project the realCity LANDMARKS lat/lon table,
// the ten tower rows are the ring centroids of the 200 m+ Lujiazui entries
// in data/shanghai-buildings.json. The runtime pays zero projection math.
// ============================================================================

export interface RooftopsRig {
  root: THREE.Group;
  update: (dt: number, elapsed: number) => void;
}

// ---- shared geometry (module-level constants; allocated once, forever) ----
// 26 m tapered pole, 0.9 m foot -> 0.4 m tip: reads as an engineered mast,
// not a dowel. translate(+13) puts the base at local y = 0, so an instance's
// position IS the rooftop attachment point.
const MAST_GEO = new THREE.CylinderGeometry(0.4, 0.9, 26, 6);
MAST_GEO.translate(0, 13, 0);
const MAST_TOP = 26; // mast tip height above its base; keep in sync with MAST_GEO
// 1.1 m sphere capping the pole tip: the shared fixture of every beacon.
const BEACON_GEO = new THREE.SphereGeometry(1.1, 8, 6);

// Aviation double flash: ONE 0.6 s interval carries TWO sin>0 pulses
// (0.15 s lit / 0.15 s dark, twice -> 4*pi per interval). A plain 2*pi sine
// would only single-flash; the doubled carrier gives the classic
// obstruction-light "blink-blink ... blink-blink" cadence.
const BEACON_INTERVAL = 0.6;

interface AntennaSpot {
  x: number; // m, east of the composition origin
  z: number; // m, south of the origin (north = -Z)
  roofY: number; // attachment height (rooftop / rig top) — NOT the mast tip (B4)
}

// The hand table. Landmark rows: x/z project the realCity LANDMARKS slots
// and roofY is the rig's real top (except where flagged below). Lujiazui
// rows: x/z are ring centroids, roofY is the OSM height h, which is exactly
// the extrusion roof of geo/realCity.ts. Every centroid was verified
// point-in-polygon against its own footprint, and against every other
// footprint (no overlaps), offline before baking.
const ANTENNAS: ReadonlyArray<AntennaSpot> = [
  // ---- six landmark tops (procedural rigs, tallest first) ----
  { x: 1215.4, z: 1033.5, roofY: 632 }, // 上海中心大厦 Shanghai Tower: halo ring closes the shaft at 632; the pole threads the ring's open centre, 2 m above the solid core top
  { x: 1110.3, z: 847.8, roofY: 492 }, // 上海环球金融中心 SWFC: +11 m off centre (rig yaw is 0) so the pole clears the rig's own white cap beacon and still stands on the 492 m cap beam (beam spans x ±15)
  { x: 454.9, z: 368.1, roofY: 468 }, // 东方明珠 Oriental Pearl: grows straight out of the rig's glowing mast-tip ball at 468
  { x: 1032.7, z: 613.5, roofY: 420.5 }, // 金茂大厦 Jinmao: lands on the gold spire tip ball (centre 419.2, r 1.5 x scale 0.9-1.2) — grounded at every breathe phase
  { x: -471.1, z: -624.6, roofY: 295 }, // 上海白玉兰广场 White Magnolia: crown-heart top; petals flare OUTWARD to ~314-320 at radius ~30, so a 320 centre base would float in open air — mast tip + beacon reach 321, the petal crown height
  { x: -856.6, z: -195.2, roofY: 27.7 }, // 外白渡桥 Waibaidu: taller north portal beam top (bridge rig's mulberry32(21204) draws 17.5+0.84/1.16 -> 18.66 m post, beam top 27.66); local (+51.5, 0) under the rig's pi/2 yaw -> world (0, -51.5)
  // ---- ten 200 m+ Lujiazui roofs (ring centroids, roof = data height h) ----
  { x: 261.4, z: 432.7, roofY: 259.9 }, // 国金中心二期 IFC Tower 2
  { x: 1000.7, z: 19.2, roofY: 256 }, // 工银大厦 ICBC Tower
  { x: 175.9, z: 490.6, roofY: 249.9 }, // 汇丰银行大楼 HSBC Building
  { x: 377.3, z: 757.6, roofY: 238 }, // 太平金融大厦 Taiping Finance Tower
  { x: 1101.2, z: 28.6, roofY: 238 }, // 国寿中心大厦 China Life Center
  { x: 659.7, z: -143.8, roofY: 230 }, // 招商银行上海大厦 CMB Shanghai Tower
  { x: 880.8, z: -137.1, roofY: 216 }, // 农银大厦 ABC Tower
  { x: 973.6, z: -154.9, roofY: 216 }, // 建行大厦 CCB Tower
  { x: 996.7, z: 731.5, roofY: 210 }, // 21世纪大厦 21st Century Tower
  { x: 391.8, z: 862.0, roofY: 200 }, // 金砖大厦
];

export function buildRooftops(): RooftopsRig {
  const root = new THREE.Group();
  root.name = "rooftops";

  // Material budget: 1 standard for all poles + 1 basic for all beacons.
  // The beacon colour is the only animated state (one shared material -> the
  // whole batch blinks in lockstep, exactly how a city's obstruction lights
  // read from afar), so update() stays allocation-free per frame.
  const mastMat = new THREE.MeshStandardMaterial({
    color: 0x1c2836, // deep antenna grey: disappears against the skyline
    roughness: 0.8, // matte galvanised steel, not chrome
    metalness: 0.3,
  });
  const beaconMat = new THREE.MeshBasicMaterial({ color: 0xff4444 });

  const masts = new THREE.InstancedMesh(MAST_GEO, mastMat, ANTENNAS.length);
  const beacons = new THREE.InstancedMesh(BEACON_GEO, beaconMat, ANTENNAS.length);

  // Static batch: instance matrices are written exactly once and never
  // touched again — beacons animate through material colour, not matrices.
  const mtx = new THREE.Matrix4();
  for (let i = 0; i < ANTENNAS.length; i++) {
    const a = ANTENNAS[i];
    mtx.makeTranslation(a.x, a.roofY, a.z);
    masts.setMatrixAt(i, mtx);
    mtx.makeTranslation(a.x, a.roofY + MAST_TOP, a.z);
    beacons.setMatrixAt(i, mtx);
  }
  masts.instanceMatrix.needsUpdate = true;
  beacons.instanceMatrix.needsUpdate = true;

  // Both batches span the whole ~2 km city, so a single bounding-sphere
  // cull test is meaningless — same discipline as realCity's merged mesh.
  masts.frustumCulled = false;
  beacons.frustumCulled = false;
  // 0.4-0.9 m poles cast sub-pixel shadows on the 2048 city shadow map;
  // the house rule reserves castShadow for big structural pieces only.
  root.add(masts, beacons);

  const update = (dt: number, elapsed: number): void => {
    // Double flash: sin>0 on the doubled carrier -> two 0.15 s pulses per
    // 0.6 s interval (see BEACON_INTERVAL above).
    const lit = Math.sin((elapsed / BEACON_INTERVAL) * Math.PI * 4) > 0;
    // HDR red (>1 linear) so the ACES + bloom chain renders a hot point;
    // the dark state stays a dim ember instead of dead black.
    if (lit) beaconMat.color.setRGB(3.2, 0.5, 0.5);
    else beaconMat.color.setRGB(0.35, 0.06, 0.06);
    // dt stays free for future wiring (house rule, cf. pearl landmark).
  };

  return { root, update };
}
