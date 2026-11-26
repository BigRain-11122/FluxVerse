import * as THREE from "three";
import { mulberry32, clamp } from "../util";
import type { CityPlan } from "../city/layout";

// Bridge traffic = the ambient vehicle layer under C3 corridor discipline:
// cars travel ONLY along the plan's arteries (district center -> river data
// island). Real street geometry is not built yet, so the light bridges ARE
// the road network; uniform scatter over the map is forbidden. Every
// instance is bound to one bridge corridor for its whole life, and volume +
// speed follow the same real-Beijing hour clock the pedestrians project,
// so the whole city reads as one circadian system.

export interface VehiclesRig {
  root: THREE.Group;
  update: (dt: number, elapsed: number, hour: number) => void;
}

// ---- shared module-level constants (all rebuilds reuse one geometry) ----
const COUNT = 300; // C3 hard cap: one InstancedMesh never exceeds 300 cars
const BODY_GEO = new THREE.BoxGeometry(8, 2.2, 4); // truck silhouette, x = travel axis
const HEAD_GEO = new THREE.BoxGeometry(2.5, 0.5, 3.5); // front light bar, shared
const BODY_MAT = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.55, metalness: 0.35 });
const HEAD_MAT = new THREE.MeshBasicMaterial({ color: 0xfff2c0 }); // unlit warm white-yellow = glowing lamp

// realCity light-bridge deck: BoxGeometry(len, 1.8, 26) centered at y = 7,
// so the drivable top surface sits at y = 7.9.
const BODY_Y = 9.05; // 7.9 deck + 1.1 half body + 0.05 clearance (no coplanar z-fight)
const HEAD_LOCAL = new THREE.Matrix4().makeTranslation(2.8, 0.35, 0); // nose at local x=4; bar center 2.8 + half 1.25 = 4.05, 0.05 proud of the face
// Tail light: same bar geometry, mounted at the rear, red. One extra
// InstancedMesh buy "who is coming / who is going" reading from any
// distance (review: static frame had no direction semantics at all).
const TAIL_LOCAL = new THREE.Matrix4().makeTranslation(-2.8, 0.35, 0);
const TAIL_MAT = new THREE.MeshBasicMaterial({ color: 0xff3b30 });
const LANE_OFFSET = 5; // reverse flow sits 5m off the forward lane: staggered, never overlapping
const HIDDEN = new THREE.Matrix4().makeScale(0, 0, 0); // surplus hiding (pedestrians.ts pool discipline)

// Zone car paints: the FLOW hues taken down to deep lacquer. Bright cars
// would outshine the window grid and read as toys, so dark-only.
const ZONE_PAINT: Record<string, number> = {
  gaming: 0x1a3a35, // FLOW.data teal -> shadow teal
  quant: 0x3a321a, // FLOW.capital gold -> shadow brass
  media: 0x3a1a2e, // FLOW.traffic magenta -> shadow wine
};
const DEFAULT_PAINT = 0x1c222b; // unknown district: near-black neutral

// Hour tiers: rush hours run fast and full, the workday calms to 60%, late
// night almost empties the bridges. Speed is constant inside a tier - L0
// look first, no acceleration curves anywhere.
function trafficTier(hour: number): { speed: number; density: number } {
  if ((hour >= 7 && hour < 9) || (hour >= 17 && hour < 19)) return { speed: 60, density: 1.0 };
  if (hour >= 9 && hour < 17) return { speed: 45, density: 0.6 };
  return { speed: 30, density: 0.08 }; // 19:00 - 07:00
}

interface Lane {
  district: string; // paint source (zone id)
  fx: number; fz: number; // district end (artery x1/z1 in realCity semantics)
  dx: number; dz: number; // unit vector district -> island
  len: number; // corridor length in meters
  ox: number; oz: number; // lateral offset applied by the reverse flow
  heading: number; // yaw that points local +x along (dx, dz)
  start: number; // first instance index of this lane's contiguous block
  count: number; // instances assigned to this lane
  target: number; // visible goal for the current hour
}

interface Vehicle {
  lane: number;
  forward: boolean; // true = district -> island, false = island -> district
  progress: number; // 0..1 of the corridor, wraps at the endpoints
  heading: number; // lane heading (+ PI on the reverse flow: rotated 180 deg)
}

export function buildVehicles(plan: CityPlan): VehiclesRig {
  const root = new THREE.Group();

  // Corridors: one per artery, district end -> island end. Degenerate
  // segments are dropped honestly rather than clamped into fake traffic.
  const lanes: Lane[] = [];
  for (const a of plan.arteries) {
    const dx = a.x0 - a.x1;
    const dz = a.z0 - a.z1;
    const len = Math.hypot(dx, dz);
    if (len < 1) continue;
    const ux = dx / len;
    const uz = dz / len;
    lanes.push({
      district: a.district,
      fx: a.x1, fz: a.z1,
      dx: ux, dz: uz, len,
      // either perpendicular side works; one fixed side keeps the two
      // flows staggered by exactly LANE_OFFSET meters
      ox: -uz * LANE_OFFSET, oz: ux * LANE_OFFSET,
      heading: Math.atan2(-uz, ux),
      start: 0, count: 0, target: 0,
    });
  }

  if (lanes.length === 0) {
    const update = (): void => undefined; // no corridors => nothing to drive
    return { root, update };
  }

  const rng = mulberry32(774411); // lane A constant => rebuild-stable traffic

  const bodies = new THREE.InstancedMesh(BODY_GEO, BODY_MAT, COUNT);
  bodies.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  bodies.frustumCulled = false; // instances span every bridge each frame
  bodies.castShadow = false; // L0 perf: dark truck silhouettes, no shadow work
  root.add(bodies);

  const heads = new THREE.InstancedMesh(HEAD_GEO, HEAD_MAT, COUNT);
  heads.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  heads.frustumCulled = false;
  root.add(heads);

  const tails = new THREE.InstancedMesh(HEAD_GEO, TAIL_MAT, COUNT);
  tails.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  tails.frustumCulled = false;
  root.add(tails);

  // Contiguous block per lane (uniform take) so thinning to the hour
  // density is a simple prefix cut, exactly the pedestrians.ts pool
  // discipline. Direction alternates inside the block, so any cut size
  // keeps both flows represented (half forward, half reverse).
  const vehicles: Vehicle[] = [];
  const paint = new THREE.Color();
  let prevLane = -1;
  for (let i = 0; i < COUNT; i++) {
    const li = Math.min(lanes.length - 1, Math.floor((i / COUNT) * lanes.length));
    const lane = lanes[li];
    if (li !== prevLane) {
      lane.start = i;
      prevLane = li;
    }
    lane.count++;
    const forward = lane.count % 2 === 1; // 1st, 3rd, 5th... outbound
    vehicles.push({
      lane: li,
      forward,
      progress: rng(),
      heading: lane.heading + (forward ? 0 : Math.PI),
    });
    paint.setHex(ZONE_PAINT[lane.district] ?? DEFAULT_PAINT);
    bodies.setColorAt(i, paint);
  }
  if (bodies.instanceColor) bodies.instanceColor.needsUpdate = true;

  // Zero-init matrices: all instances start hidden, the first update(hour)
  // reveals the correct density, so nothing pops at a wrong hour.
  for (let i = 0; i < COUNT; i++) {
    bodies.setMatrixAt(i, HIDDEN);
    heads.setMatrixAt(i, HIDDEN);
    tails.setMatrixAt(i, HIDDEN);
  }

  const dummy = new THREE.Object3D();
  const headM = new THREE.Matrix4();

  function update(dt: number, _elapsed: number, hour: number): void {
    // _elapsed unused on purpose: motion is dt-accumulated because the speed
    // tier follows the hour clock; the signature stays the shared
    // (dt, elapsed, hour) rig contract used by every live module.
    const { speed, density } = trafficTier(hour);
    for (const lane of lanes) {
      lane.target = clamp(Math.round(lane.count * density), 0, lane.count);
    }
    for (let i = 0; i < COUNT; i++) {
      const v = vehicles[i];
      const lane = lanes[v.lane];
      // surplus cars keep advancing while hidden, so a density step-up
      // reveals cars already mid-flow instead of frozen at old spots
      v.progress = (v.progress + (dt * speed) / lane.len) % 1;
      if (i - lane.start >= lane.target) {
        bodies.setMatrixAt(i, HIDDEN); // surplus car: zero-scale, pool never fragments
        heads.setMatrixAt(i, HIDDEN);
        tails.setMatrixAt(i, HIDDEN);
        continue;
      }
      const t = v.forward ? v.progress : 1 - v.progress;
      const lx = v.forward ? 0 : lane.ox;
      const lz = v.forward ? 0 : lane.oz;
      dummy.position.set(
        lane.fx + lane.dx * t * lane.len + lx,
        BODY_Y,
        lane.fz + lane.dz * t * lane.len + lz,
      );
      dummy.rotation.set(0, v.heading, 0);
      dummy.scale.setScalar(1);
      dummy.updateMatrix();
      bodies.setMatrixAt(i, dummy.matrix);
      // light bar = body matrix * local nose offset: glued to the travel
      // front for both directions without a second per-car transform chain
      headM.multiplyMatrices(dummy.matrix, HEAD_LOCAL);
      heads.setMatrixAt(i, headM);
      headM.multiplyMatrices(dummy.matrix, TAIL_LOCAL);
      tails.setMatrixAt(i, headM);
    }
    bodies.instanceMatrix.needsUpdate = true;
    heads.instanceMatrix.needsUpdate = true;
    tails.instanceMatrix.needsUpdate = true;
  }

  return { root, update };
}
