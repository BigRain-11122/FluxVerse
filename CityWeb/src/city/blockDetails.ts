import * as THREE from "three";
import { mulberry32 } from "../util";
import { FLOW } from "../palette";
import type { CityPlan } from "./layout";

// ============================================================================
// Block details layer — wave 3 lane E: street trees, street lamps, bus
// shelters and data benches, so the street level carries furniture besides
// buildings and people.
//
// Module contract, wired verbatim by the coordinator:
//   export interface BlockDetailsRig { root; update(dt, elapsed) }
//   export function buildBlockDetails(plan: CityPlan): BlockDetailsRig
//
// What lands in the scene, per plan.districts entry (everything is placed
// district-relative, so the module works for both the legacy 120-degree
// layout and the real-geography realCity plan):
//   90 street trees  — trunk + crown InstancedMesh pair, random scatter
//   60 street lamps  — pole + bulb pair, three evenly-staggered ring loops
//    8 bus shelters  — glass box + roof + additive magenta sign column
//   24 data benches  — tangent-aligned boxes along the ring street
// All pieces sit in the 90..320 m ring-street band around the district
// centre (spec): outside the legacy building rings (buildings stop ~77 m
// from centre) and past the artery corridor tip (~84 m short of centre),
// so no corridor-clearance tests are needed at runtime.
//
// Batching: exactly 8 InstancedMeshes => 8 draw calls for the whole layer,
// 7 materials (house budget <= 10). Style law (brainTower.ts): bodies are
// MeshStandardMaterial, glows are MeshBasicMaterial.
//
// Units: 1 unit = 1 m, y up, ground contact at y = 0 (same convention as
// the roads.ts pylons). Determinism: one mulberry32(6161) seeded per build
// => the same furniture on every reload, same discipline as layout.ts.
// ============================================================================

export interface BlockDetailsRig {
  root: THREE.Group;
  update: (dt: number, elapsed: number) => void;
}

// ---- shared geometry (module-level constants; allocated once, forever) ----
// Trunks, poles and boxes are pre-translated so an instance's position IS
// its ground contact point; only the crown and the bulb ride explicit
// heights (they stack on top of their carrier's scaled height).
const TRUNK_H = 4.2; // trunk local height, keep in sync with TRUNK_GEO
const TRUNK_GEO = new THREE.CylinderGeometry(0.35, 0.5, TRUNK_H, 6);
TRUNK_GEO.translate(0, 2.1, 0); // base at local y = 0
const CROWN_GEO = new THREE.IcosahedronGeometry(2.2, 0);
const POLE_H = 9; // pole local height, keep in sync with POLE_GEO
const POLE_GEO = new THREE.CylinderGeometry(0.18, 0.26, POLE_H, 6);
POLE_GEO.translate(0, 4.5, 0); // base at local y = 0
const BULB_GEO = new THREE.SphereGeometry(0.55, 8, 6);
const GLASS_GEO = new THREE.BoxGeometry(6, 3, 14);
GLASS_GEO.translate(0, 1.5, 0); // glass walls span y 0..3
const ROOF_GEO = new THREE.BoxGeometry(6.5, 0.4, 15);
ROOF_GEO.translate(0, 3.2, 0); // roof rests on the glass top: y 3.0..3.4
const SIGN_GEO = new THREE.BoxGeometry(0.7, 5, 0.7);
SIGN_GEO.translate(0, 2.5, 0); // sign column spans y 0..5
const BENCH_GEO = new THREE.BoxGeometry(4, 0.9, 1.4);
BENCH_GEO.translate(0, 0.45, 0); // seat surface at y = 0.9, sitting height

// ---- spec constants ----
const SEED = 6161;
const TREES_PER_DISTRICT = 90;
const LAMPS_PER_DISTRICT = 60;
const STOPS_PER_DISTRICT = 8;
const BENCHES_PER_DISTRICT = 24;

// Ring-band radii (m, district-relative). The overall band is 90..320;
// trees use the spec's 95..310 random scatter, lamps ride three fixed
// loops, shelters a mid-band ring, benches a 98..305 scatter.
const TREE_R_MIN = 95;
const TREE_R_MAX = 310;
const TREE_SCALE_MIN = 0.8;
const TREE_SCALE_MAX = 1.3;
const BENCH_R_MIN = 98;
const BENCH_R_MAX = 305;
const STOP_R = 132;
const LAMP_LOOPS: ReadonlyArray<number> = [112, 178, 244]; // 3 loops x 20 lamps

// Lamp glow base: warm white pushed 1.3x into HDR territory so the ACES +
// bloom chain renders a lit point instead of flat beige geometry (same
// trick as rooftops.ts beacons). update() breathes it by +-10%.
const LAMP_BASE = new THREE.Color(0xffd9a0).multiplyScalar(1.3);
const LAMP_BREATH_PERIOD = 9; // seconds per breath cycle — deliberately slow
const LAMP_BREATH_AMP = 0.1; // +-10% around the base

const Y_AXIS = new THREE.Vector3(0, 1, 0);

export function buildBlockDetails(plan: CityPlan): BlockDetailsRig {
  const root = new THREE.Group();
  root.name = "blockDetails";
  const rng = mulberry32(SEED);

  const districts = plan.districts;
  const treeCount = districts.length * TREES_PER_DISTRICT;
  const lampCount = districts.length * LAMPS_PER_DISTRICT;
  const stopCount = districts.length * STOPS_PER_DISTRICT;
  const benchCount = districts.length * BENCHES_PER_DISTRICT;

  // ---- materials: 7 of the <= 10 budget ----
  // trunk: dark bark brown, dead matte.
  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x2a2018, roughness: 0.95, metalness: 0.0 });
  // crown: ink green, flat-shaded so the detail-0 icosahedron reads as a
  // faceted low-poly canopy instead of a smooth blob — matches the city's
  // lowpoly silhouette language.
  const crownMat = new THREE.MeshStandardMaterial({ color: 0x1c4a34, roughness: 0.9, metalness: 0.0, flatShading: true });
  // one shared dark street metal for BOTH lamp poles and shelter roofs
  // (spec calls both 深灰) — saves a material slot and unifies the street
  // hardware family.
  const metalMat = new THREE.MeshStandardMaterial({ color: 0x22262e, roughness: 0.7, metalness: 0.35 });
  // bulb: self-lit basic material, HDR warm white (see LAMP_BASE).
  const bulbMat = new THREE.MeshBasicMaterial({ color: LAMP_BASE });
  // shelter glass: translucent data-cyan shell (FLOW.data === 0x5eead4).
  // DoubleSide + depthWrite:false is the house pattern for translucent
  // shells (cf. landmarks-tower-swfc notes): both glass walls show through
  // each other and it never punches a depth hole into later transparents.
  const glassMat = new THREE.MeshBasicMaterial({
    color: FLOW.data,
    transparent: true,
    opacity: 0.3,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  // sign column: additive magenta beacon (FLOW.traffic === 品红 0xf472b6),
  // the flow-colour law's "traffic" lane, marking the stop from afar.
  const signMat = new THREE.MeshBasicMaterial({
    color: FLOW.traffic,
    transparent: true,
    opacity: 0.5,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  // bench: quiet deep-navy block, reads as street furniture at night.
  const benchMat = new THREE.MeshStandardMaterial({ color: 0x233048, roughness: 0.85, metalness: 0.05 });

  // ---- batches: 8 InstancedMeshes, one per geometry ----
  const trunks = new THREE.InstancedMesh(TRUNK_GEO, trunkMat, treeCount);
  const crowns = new THREE.InstancedMesh(CROWN_GEO, crownMat, treeCount);
  const poles = new THREE.InstancedMesh(POLE_GEO, metalMat, lampCount);
  const bulbs = new THREE.InstancedMesh(BULB_GEO, bulbMat, lampCount);
  const glass = new THREE.InstancedMesh(GLASS_GEO, glassMat, stopCount);
  const roofs = new THREE.InstancedMesh(ROOF_GEO, metalMat, stopCount);
  const signs = new THREE.InstancedMesh(SIGN_GEO, signMat, stopCount);
  const benchMesh = new THREE.InstancedMesh(BENCH_GEO, benchMat, benchCount);
  trunks.name = "blockTreesTrunks";
  crowns.name = "blockTreesCrowns";
  poles.name = "blockLampPoles";
  bulbs.name = "blockLampBulbs";
  glass.name = "blockStopGlass";
  roofs.name = "blockStopRoofs";
  signs.name = "blockStopSigns";
  benchMesh.name = "blockBenches";

  // Static batch: instance matrices are written exactly once here and never
  // touched again — the only animated state is the lamp material colour.
  const mtx = new THREE.Matrix4();
  const pos = new THREE.Vector3();
  const quat = new THREE.Quaternion();
  const scl = new THREE.Vector3();
  const put = (
    mesh: THREE.InstancedMesh, i: number,
    x: number, y: number, z: number, yaw: number, s: number,
  ): void => {
    pos.set(x, y, z);
    quat.setFromAxisAngle(Y_AXIS, yaw);
    scl.setScalar(s);
    mtx.compose(pos, quat, scl);
    mesh.setMatrixAt(i, mtx);
  };

  let ti = 0; // tree instance cursor
  let li = 0; // lamp instance cursor
  let si = 0; // shelter instance cursor
  let bi = 0; // bench instance cursor
  const lampsPerLoop = LAMPS_PER_DISTRICT / LAMP_LOOPS.length; // 60 / 3 = 20

  for (const d of districts) {
    // --- street trees: random scatter on the ring band ---
    // One rng() triple (angle, radius, scale) + yaw per tree; the band is
    // sparse (90 trees over ~270,000 m^2 of annulus), so tree-vs-tree
    // collisions are rare enough to ignore at street scale.
    for (let k = 0; k < TREES_PER_DISTRICT; k++, ti++) {
      const a = rng() * Math.PI * 2;
      const r = TREE_R_MIN + rng() * (TREE_R_MAX - TREE_R_MIN);
      const x = d.cx + Math.cos(a) * r;
      const z = d.cz + Math.sin(a) * r;
      const s = TREE_SCALE_MIN + rng() * (TREE_SCALE_MAX - TREE_SCALE_MIN);
      const yaw = rng() * Math.PI * 2; // crown silhouette variety (trunk is radial)
      put(trunks, ti, x, 0, z, yaw, s);
      // Crown centroid rides the scaled trunk top: 4.2*s, so the canopy
      // spans 2.0*s..6.4*s and swallows the trunk's upper end — a proper
      // lollipop street tree, 5.1..8.3 m tall across the scale range.
      put(crowns, ti, x, TRUNK_H * s, z, yaw, s);
    }

    // --- street lamps: three concentric loops, evenly staggered ---
    // Real street lighting reads as regular rows, not confetti: each loop
    // spaces its 20 poles evenly in angle, and loop n is phase-shifted by
    // 1/3 of that spacing so the three loops never share a radial ray.
    for (let loop = 0; loop < LAMP_LOOPS.length; loop++) {
      const r0 = LAMP_LOOPS[loop];
      for (let j = 0; j < lampsPerLoop; j++, li++) {
        const a = ((j + loop / LAMP_LOOPS.length) / lampsPerLoop) * Math.PI * 2 + (rng() - 0.5) * 0.08;
        const r = r0 + (rng() - 0.5) * 12;
        const x = d.cx + Math.cos(a) * r;
        const z = d.cz + Math.sin(a) * r;
        put(poles, li, x, 0, z, 0, 1);
        // Bulb centre at the pole tip: sphere spans 8.45..9.55, capping the
        // 9 m pole like a lamp head.
        put(bulbs, li, x, POLE_H, z, 0, 1);
      }
    }

    // --- bus shelters: 8 evenly around a mid-band ring ---
    // The shelter's 14 m long axis (+z) rides the ring tangent (yaw = -a),
    // so the glass wall faces the street it serves. Sign column anchors
    // the shelter's street-side end: local (3.6, 5.9) sits just outside the
    // 3 m glass wall and under the 7.5 m roof half-length, rotated to world
    // by the same yaw.
    for (let j = 0; j < STOPS_PER_DISTRICT; j++, si++) {
      const a = (j / STOPS_PER_DISTRICT) * Math.PI * 2 + (rng() - 0.5) * 0.2;
      const r = STOP_R + (rng() - 0.5) * 16;
      const x = d.cx + Math.cos(a) * r;
      const z = d.cz + Math.sin(a) * r;
      const yaw = -a;
      put(glass, si, x, 0, z, yaw, 1);
      put(roofs, si, x, 0, z, yaw, 1);
      const ox = 3.6, oz = 5.9;
      const sx = x + ox * Math.cos(a) - oz * Math.sin(a);
      const sz = z + ox * Math.sin(a) + oz * Math.cos(a);
      put(signs, si, sx, 0, sz, 0, 1);
    }

    // --- data benches: random scatter, long axis hugging the tangent ---
    // Tangent alignment (yaw = -a - pi/2 puts the 4 m +x axis on the ring
    // tangent) plus a +-0.3 rad sway keeps benches reading as street-side
    // seating instead of random litter.
    for (let j = 0; j < BENCHES_PER_DISTRICT; j++, bi++) {
      const a = rng() * Math.PI * 2;
      const r = BENCH_R_MIN + rng() * (BENCH_R_MAX - BENCH_R_MIN);
      const x = d.cx + Math.cos(a) * r;
      const z = d.cz + Math.sin(a) * r;
      const yaw = -a - Math.PI / 2 + (rng() - 0.5) * 0.6;
      put(benchMesh, bi, x, 0, z, yaw, 1);
    }
  }

  // Upload all static matrices once; the batches span hundreds of metres
  // each, so a single bounding-sphere cull test is meaningless (same
  // discipline as rooftops.ts / realCity's merged mesh).
  const batches = [trunks, crowns, poles, bulbs, glass, roofs, signs, benchMesh];
  for (const b of batches) {
    b.instanceMatrix.needsUpdate = true;
    b.frustumCulled = false;
  }

  // Shadow budget (house rule, cf. rooftops.ts): only the big canopy-area
  // pieces cast — tree crowns and shelter roofs. Trunks, poles, benches and
  // the 0.7 m sign columns are sub-pixel on the city shadow map. Tree
  // shadows still land on the roads because the asphalt already receives.
  crowns.castShadow = true;
  roofs.castShadow = true;

  root.add(trunks, crowns, poles, bulbs, glass, roofs, signs, benchMesh);

  const update = (dt: number, elapsed: number): void => {
    // Lamp field slow-breathes +-10% around the 1.3x warm-white base: one
    // shared material => the whole grid pulses together, reading as a
    // gentle grid-load hum. Per-lamp phases would cost per-frame
    // instanceColor rewrites for a +-10% swing nobody resolves at street
    // scale, so the field breathes as one. Allocation-free: colour is
    // mutated in place, never re-created.
    const breath = 1 + LAMP_BREATH_AMP * Math.sin((elapsed / LAMP_BREATH_PERIOD) * Math.PI * 2);
    bulbMat.color.copy(LAMP_BASE).multiplyScalar(breath);
    // dt stays free for future wiring (house rule, cf. rooftops.ts).
  };

  return { root, update };
}
