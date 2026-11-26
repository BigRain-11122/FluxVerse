import * as THREE from "three";
import { projectX, projectZ } from "../geo/projection";
import { FLOW } from "../palette";
import { mulberry32 } from "../util";

// Huangpu river traffic: 10 cargo ships + 3 commuter ferries = the "water is
// alive" layer of the real-geography city. Real meters everywhere (1 unit =
// 1m), driven by the same hand-traced river polyline that realCity.ts turns
// into the glowing water ribbon, so ships sail inside the visible river
// instead of a decorative spline nobody rendered.

// ---------------------------------------------------------------------------
// RIVER_CENTERLINE copy - SYNC DUTY.
// Source: CityWeb/src/geo/realCity.ts `const RIVER_CENTERLINE` (NOT exported
// there; this lane must not edit that file). If realCity.ts ever re-traces
// the river, this array MUST be re-copied verbatim, or ships will sail
// outside the rendered water. Values are [lat, lon] pairs, south -> north.
// ---------------------------------------------------------------------------
const RIVER_CENTERLINE: Array<[number, number]> = [
  [31.2180, 121.4890],
  [31.2260, 121.4908],
  [31.2310, 121.4930],
  [31.2340, 121.4965],
  [31.2360, 121.5000],
  [31.2390, 121.5030],
  [31.2430, 121.5018],
  [31.2480, 121.5020],
  [31.2540, 121.5035],
  [31.2600, 121.5065],
  [31.2660, 121.5100],
  [31.2720, 121.5145],
];
const RIVER_HALF_W = 230; // half width of the rendered water ribbon, meters

export interface ShipsRig {
  root: THREE.Group;
  update: (dt: number, elapsed: number) => void;
}

// ---- counts & budget (GTA6 rule card D3: ship lights <= 20 dynamic points) ----
// 10 cargo mast lights (white) + 10 cargo stern lights (red) = 20 exactly.
// Ferries therefore carry NO lamp points: their lit signature is the unlit
// cyan cabin stripe + teal hull tint, which costs zero of the D3 budget.
const CARGO_COUNT = 10;
const FERRY_COUNT = 3;

// ---- shared module constants (one geometry serves every rebuild) ----
const HULL_GEO = new THREE.BoxGeometry(58, 6, 14); // cargo hull, x = travel axis
const CABIN_GEO = new THREE.BoxGeometry(12, 8, 8); // cargo deckhouse (scaled down for ferries)
const LIGHT_GEO = new THREE.SphereGeometry(1.1, 10, 8); // mast / stern lamp point
const WAKE_GEO = new THREE.BoxGeometry(18, 0.3, 1.2); // wake glow band

const HULL_MAT = new THREE.MeshStandardMaterial({ color: 0x1c2634, roughness: 0.6, metalness: 0.55 });
const CABIN_MAT = new THREE.MeshStandardMaterial({ color: 0x2c3850, roughness: 0.7, metalness: 0.3 });
const MAST_MAT = new THREE.MeshBasicMaterial({ color: FLOW.ceo.clone().multiplyScalar(1.5) }); // spec: white x1.5
const TAIL_MAT = new THREE.MeshBasicMaterial({ color: FLOW.warn }); // navigation stern light, palette red
const STRIPE_MAT = new THREE.MeshBasicMaterial({ color: FLOW.data }); // ferry cabin line: unlit data-cyan
const WAKE_MAT = new THREE.MeshBasicMaterial({
  color: FLOW.data.clone().lerp(FLOW.ceo, 0.45), // "cyan-white" from the FLOW hues
  blending: THREE.AdditiveBlending,
  transparent: true,
  opacity: 0.35,
  depthWrite: false,
});
const FERRY_TINT = FLOW.data.clone().multiplyScalar(0.85); // per-instance hull color -> subtle teal cast

const HIDDEN = new THREE.Matrix4().makeScale(0, 0, 0); // zero-init / parked instances

// ---- vertical anchors, real meters ----
// realCity river surface sits at y = 0.4; the light-bridge decks are
// Box(len, 1.8, 26) centered at y = 7, i.e. deck bottom = 6.1.
//
// Cargo verticals: hull center 0.2 -> 3.2m draft below the 0.4m waterline,
// 2.8m freeboard (loaded river freighter). Deckhouse sits aft like a real
// barge; mast light rides the deckhouse roof, stern light the transom rail.
const CARGO_HULL_Y = 0.2;
const CARGO_HALF_LEN = 29;
const CABIN_LX = -20;
const CABIN_LY = 7.0; // hull top 3.2 + half cabin 4, minus hull center 0.2
const MAST_LX = -20;
const MAST_LY = 12.4; // cabin roof 11.2 + ~1.2 mast clearance
const TAIL_LX = -29.5;
const TAIL_LY = 3.6; // hull top 3.2 + rail

// Ferry verticals: the whole ferry tops out at 5.0m (hull center 0.5 ->
// hull top 3.0, 2.0m cabin). That is UNDER the 6.1m bridge deck bottom, so
// the Bund <-> North Bund shuttle slips beneath the island spokes cleanly -
// something the 11.2m-tall cargo ships cannot do (see lane notes below).
const FERRY_HULL_Y = 0.5;
const FERRY_HALF_LEN = 15;
// "Box(30, 5, 9)" realized as a per-instance scale of the shared hull
// geometry: the spec's single 13-instance hull batch can only carry one
// geometry, so the ferry hull IS the cargo hull scaled to 30x5x9.
const FERRY_HULL_SX = 30 / 58;
const FERRY_HULL_SY = 5 / 6;
const FERRY_HULL_SZ = 9 / 14;
const FERRY_CAB_LX = 1;
const FERRY_CAB_LY = 3.5; // hull top 3.0 + half of the 2.0m cabin
const FERRY_CAB_SX = 16 / 12;
const FERRY_CAB_SY = 2 / 8;
const FERRY_CAB_SZ = 7 / 8;
// Cabin stripe: a thin cyan band 0.4m proud of the hull sides (never
// coplanar -> no z-fight), the ferry's readable night identity.
const STRIPE_LY = 1.3; // world 1.8: upper hull, well above the waterline
const STRIPE_SX = 30.8 / 58;
const STRIPE_SY = 0.7 / 6;
const STRIPE_SZ = 9.6 / 14;

// ---- ferry service: two fixed piers, 6s dwell, reverse ----
const FERRY_SPEED = 5; // ~10 knots, real commuter ferry
const FERRY_DOCK_S = 6; // spec: dwell 6s at each pier before reversing
const FERRY_SOUTH_S = 2300; // arc-length pier on the p3->p4 stretch, off the Bund
const FERRY_NORTH_S = 3700; // arc-length pier on the p6->p7 stretch, off North Bund
const FERRY_LATERALS = [-168, -176, -184]; // three slightly different berths

// ---- wake glow bands (spec: twin bands, additive, y = 0.8) ----
const WAKE_Y = 0.8;
const WAKE_GAP = 9; // 18m box centered 9m behind the stern => band starts AT the stern
const WAKE_SPLIT = 1.5; // port/starboard twin bands

// ---- navigation lanes ----
// The brain-tower data island (r ~131m at the waterline) sits almost exactly
// ON the centerline at the bend apex, so a literal centerline track would
// sail ships straight through a landmark. Lanes at 75% of the half width
// clear the island by 20-40m and read like the real Huangpu bank-hugging
// channel. Keep-right rule: downstream (north, out to the Yangtze) keeps the
// east side, upstream keeps the west, so opposing flows never meet.
// Known tradeoff, accepted with eyes open: the three light bridges are
// radial spokes from the island to the banks, i.e. every passage around the
// island is bridged with only 6.1m clearance. Cargo ships (11m+ tall) must
// cross a deck for 3-5s per spoke (dark hull against dark deck, brief, reads
// as passing under from the aerial camera). Ferries are engineered to fit
// beneath them outright. There is no un-bridged lane: geometry is closed.
const LANE_OFF = RIVER_HALF_W * 0.75; // 172.5m off the centerline
const LANE_JITTER = 14; // per-ship channel position, always outward (extra island margin)

// ---- precomputed river table: arc length + lerp sampling ----
// getPointAt approximation per spec: cumulative chord lengths once at module
// load, then pure linear interpolation at runtime. No CatmullRom object is
// ever built, let alone per frame.
const CENTER = RIVER_CENTERLINE.map(([lat, lon]) => new THREE.Vector2(projectX(lon), projectZ(lat)));
const SEG_U: THREE.Vector2[] = []; // unit tangent per segment
const SEG_N: THREE.Vector2[] = []; // right-hand normal per segment (right of travel)
for (let i = 0; i < CENTER.length - 1; i++) {
  const u = CENTER[i + 1].clone().sub(CENTER[i]).normalize();
  SEG_U.push(u);
  SEG_N.push(new THREE.Vector2(-u.y, u.x));
}
const CUM: number[] = [0]; // cumulative arc length, meters
for (let i = 0; i < CENTER.length - 1; i++) {
  CUM.push(CUM[i] + CENTER[i].distanceTo(CENTER[i + 1]));
}
const RIVER_LEN = CUM[CUM.length - 1];
// Vertex normals = averaged adjacent segment normals: the lateral offset
// swings smoothly around the sharp L-bend instead of snapping, which is what
// carves the island detour into a believable channel arc.
const VTX_N: THREE.Vector2[] = [SEG_N[0]];
for (let i = 1; i < CENTER.length - 1; i++) {
  VTX_N.push(SEG_N[i - 1].clone().add(SEG_N[i]).normalize());
}
VTX_N.push(SEG_N[SEG_N.length - 1]);

// Module-scope sample scratch: zero allocation per frame.
const _samp = { px: 0, pz: 0, ux: 0, uz: 0, nx: 0, nz: 0 };

function sampleRiver(s: number): void {
  let i = 0;
  while (i < CENTER.length - 2 && s > CUM[i + 1]) i++;
  const len = CUM[i + 1] - CUM[i];
  const f = len > 1e-6 ? (s - CUM[i]) / len : 1;
  const a = CENTER[i];
  const b = CENTER[i + 1];
  _samp.px = a.x + (b.x - a.x) * f;
  _samp.pz = a.y + (b.y - a.y) * f;
  _samp.ux = SEG_U[i].x;
  _samp.uz = SEG_U[i].y;
  const na = VTX_N[i];
  const nb = VTX_N[i + 1];
  let nx = na.x + (nb.x - na.x) * f;
  let nz = na.y + (nb.y - na.y) * f;
  const l = Math.hypot(nx, nz) || 1;
  _samp.nx = nx / l;
  _samp.nz = nz / l;
}

interface ShipState {
  s: number; // arc-length position along the centerline, meters
  dir: 1 | -1; // +1 downstream (north, to the Yangtze), -1 upstream
  speed: number; // m/s over ground
  lateral: number; // signed lane offset from the centerline (east = +)
  docked: boolean; // ferry only: dwelling at a pier
  dockTimer: number; // ferry only: seconds left in the dwell
}

export function buildShips(): ShipsRig {
  const root = new THREE.Group();
  const rng = mulberry32(2244); // lane-seed constant => rebuild-stable river

  const TOTAL = CARGO_COUNT + FERRY_COUNT;

  // ---- the six instanced batches (hulls 13 / cabins 13 / stripes 3 / ----
  // ---- white 10 / red 10 / wakes 26 => 6 draw calls total) ----
  const mk = (geo: THREE.BufferGeometry, mat: THREE.Material, count: number): THREE.InstancedMesh => {
    const m = new THREE.InstancedMesh(geo, mat, count);
    m.instanceMatrix.setUsage(THREE.DynamicDrawUsage); // matrices are rewritten every frame
    m.frustumCulled = false; // instances span the whole river each frame
    m.castShadow = false; // spec: shadows fully off for this layer
    return m;
  };
  const hulls = mk(HULL_GEO, HULL_MAT, TOTAL);
  const cabins = mk(CABIN_GEO, CABIN_MAT, TOTAL);
  const stripes = mk(HULL_GEO, STRIPE_MAT, FERRY_COUNT); // stripe = scaled hull geo
  const masts = mk(LIGHT_GEO, MAST_MAT, CARGO_COUNT); // white lamp points (cargo only)
  const tails = mk(LIGHT_GEO, TAIL_MAT, CARGO_COUNT); // red stern lights (cargo only)
  const wakes = mk(WAKE_GEO, WAKE_MAT, TOTAL * 2); // twin bands per ship
  root.add(hulls, cabins, stripes, masts, tails, wakes);

  // Per-instance hull tint: cargo = neutral white (material color), ferries
  // get the teal cast ("overall cyan tone" of the spec). Every instance is
  // set explicitly - the instanceColor buffer zero-fills, so unset = black.
  const white = new THREE.Color(1, 1, 1);
  for (let i = 0; i < TOTAL; i++) hulls.setColorAt(i, white);
  for (let k = 0; k < FERRY_COUNT; k++) hulls.setColorAt(CARGO_COUNT + k, FERRY_TINT);
  if (hulls.instanceColor) hulls.instanceColor.needsUpdate = true;

  // ---- fleets ----
  // 10 cargo: 5 downstream (east lane) + 5 upstream (west lane), speeds
  // 5..9 m/s per spec, each with its own berth inside the lane. Positions
  // spread over the full 6.7km river; wraps happen at the polyline ends,
  // which lie ~3km off the composition center = ships enter from off-map.
  const cargo: ShipState[] = [];
  for (let j = 0; j < CARGO_COUNT; j++) {
    const dir: 1 | -1 = j < 5 ? 1 : -1;
    const out = LANE_OFF + rng() * LANE_JITTER;
    cargo.push({
      s: rng() * RIVER_LEN,
      dir,
      speed: 5 + rng() * 4,
      lateral: dir === 1 ? out : -out,
      docked: false,
      dockTimer: 0,
    });
  }

  // 3 ferries: one shuttle line, west passage, staggered phases so the three
  // never queue behind each other (mid-river N, mid-river S, dwelling south).
  const FERRY_INIT: Array<{ s: number; dir: 1 | -1; docked: boolean; timer: number }> = [
    { s: 2600, dir: 1, docked: false, timer: 0 },
    { s: 3450, dir: -1, docked: false, timer: 0 },
    { s: FERRY_SOUTH_S, dir: 1, docked: true, timer: 3 },
  ];
  const ferries: ShipState[] = FERRY_INIT.map((init, k) => ({
    s: init.s,
    dir: init.dir,
    speed: FERRY_SPEED,
    lateral: FERRY_LATERALS[k],
    docked: init.docked,
    dockTimer: init.timer,
  }));

  // Zero-init every instance so nothing renders garbage before update().
  for (let i = 0; i < TOTAL; i++) {
    hulls.setMatrixAt(i, HIDDEN);
    cabins.setMatrixAt(i, HIDDEN);
  }
  for (let k = 0; k < FERRY_COUNT; k++) stripes.setMatrixAt(k, HIDDEN);
  for (let j = 0; j < CARGO_COUNT; j++) {
    masts.setMatrixAt(j, HIDDEN);
    tails.setMatrixAt(j, HIDDEN);
  }
  for (let i = 0; i < TOTAL * 2; i++) wakes.setMatrixAt(i, HIDDEN);

  const dummy = new THREE.Object3D();

  // One writer for every batch: world position = ship pose + yaw-rotated
  // local offset. T*R*S via Object3D.updateMatrix, like every live module.
  function place(
    mesh: THREE.InstancedMesh, idx: number,
    x: number, z: number, y: number, yaw: number,
    lx: number, lz: number,
    sx: number, sy: number, sz: number,
  ): void {
    const c = Math.cos(yaw);
    const s = Math.sin(yaw);
    dummy.position.set(x + lx * c + lz * s, y, z - lx * s + lz * c);
    dummy.rotation.set(0, yaw, 0);
    dummy.scale.set(sx, sy, sz);
    dummy.updateMatrix();
    mesh.setMatrixAt(idx, dummy.matrix);
  }

  function update(dt: number, _elapsed: number): void {
    // _elapsed unused on purpose: motion is dt-accumulated; the signature
    // stays the shared (dt, elapsed) rig contract.
    for (let j = 0; j < cargo.length; j++) {
      const sh = cargo[j];
      sh.s += sh.dir * sh.speed * dt;
      if (sh.s >= RIVER_LEN) sh.s -= RIVER_LEN; // respawn at the far river end (off-map)
      else if (sh.s < 0) sh.s += RIVER_LEN;
      sampleRiver(sh.s);
      const x = _samp.px + sh.lateral * _samp.nx;
      const z = _samp.pz + sh.lateral * _samp.nz;
      const tangentYaw = Math.atan2(-_samp.uz, _samp.ux); // heading = along the tangent
      // Upstream ships sail bow-first: same tangent, hull rotated 180deg.
      const yaw = sh.dir === 1 ? tangentYaw : tangentYaw + Math.PI;
      place(hulls, j, x, z, CARGO_HULL_Y, yaw, 0, 0, 1, 1, 1);
      place(cabins, j, x, z, CARGO_HULL_Y + CABIN_LY, yaw, CABIN_LX, 0, 1, 1, 1);
      place(masts, j, x, z, CARGO_HULL_Y + MAST_LY, yaw, MAST_LX, 0, 1, 1, 1);
      place(tails, j, x, z, CARGO_HULL_Y + TAIL_LY, yaw, TAIL_LX, 0, 1, 1, 1);
      const back = -(CARGO_HALF_LEN + WAKE_GAP); // wake trails behind the stern
      place(wakes, 2 * j, x, z, WAKE_Y, yaw, back, -WAKE_SPLIT, 1, 1, 1);
      place(wakes, 2 * j + 1, x, z, WAKE_Y, yaw, back, WAKE_SPLIT, 1, 1, 1);
    }

    for (let k = 0; k < ferries.length; k++) {
      const f = ferries[k];
      if (f.docked) {
        f.dockTimer -= dt;
        if (f.dockTimer <= 0) {
          f.docked = false;
          f.dir = f.dir === 1 ? -1 : 1; // leave the pier on the return leg
        }
      } else {
        f.s += f.dir * f.speed * dt;
        if (f.dir === 1 && f.s >= FERRY_NORTH_S) {
          f.s = FERRY_NORTH_S;
          f.docked = true;
          f.dockTimer = FERRY_DOCK_S;
        } else if (f.dir === -1 && f.s <= FERRY_SOUTH_S) {
          f.s = FERRY_SOUTH_S;
          f.docked = true;
          f.dockTimer = FERRY_DOCK_S;
        }
      }
      sampleRiver(f.s);
      const x = _samp.px + f.lateral * _samp.nx;
      const z = _samp.pz + f.lateral * _samp.nz;
      // Double-ended ferry: hull always aligns with the river tangent and
      // simply drives from either end, so no 180deg spin at the pier.
      const yaw = Math.atan2(-_samp.uz, _samp.ux);
      const idx = CARGO_COUNT + k;
      place(hulls, idx, x, z, FERRY_HULL_Y, yaw, 0, 0, FERRY_HULL_SX, FERRY_HULL_SY, FERRY_HULL_SZ);
      place(cabins, idx, x, z, FERRY_HULL_Y + FERRY_CAB_LY, yaw, FERRY_CAB_LX, 0, FERRY_CAB_SX, FERRY_CAB_SY, FERRY_CAB_SZ);
      place(stripes, k, x, z, FERRY_HULL_Y + STRIPE_LY, yaw, 0, 0, STRIPE_SX, STRIPE_SY, STRIPE_SZ);
      const back = -f.dir * (FERRY_HALF_LEN + WAKE_GAP); // wake trails the travel end
      const wl = f.docked ? 0 : 1; // no wake glow while dwelling at a pier
      place(wakes, 2 * idx, x, z, WAKE_Y, yaw, back, -WAKE_SPLIT, wl, 1, 1);
      place(wakes, 2 * idx + 1, x, z, WAKE_Y, yaw, back, WAKE_SPLIT, wl, 1, 1);
    }

    hulls.instanceMatrix.needsUpdate = true;
    cabins.instanceMatrix.needsUpdate = true;
    stripes.instanceMatrix.needsUpdate = true;
    masts.instanceMatrix.needsUpdate = true;
    tails.instanceMatrix.needsUpdate = true;
    wakes.instanceMatrix.needsUpdate = true;
  }

  return { root, update };
}
