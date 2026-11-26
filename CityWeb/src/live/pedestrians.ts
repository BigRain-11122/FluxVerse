import * as THREE from "three";
import { mulberry32, clamp } from "../util";
import type { CityPlan } from "../city/layout";
import type { CityData } from "../types";

// Street pedestrians = macro projection of the residents' circadian rhythm
// onto the district ring streets (census-scale presence, never individual
// simulation). One fixed InstancedMesh pool; hour band * zone activity
// decides how many silhouettes are scaled in. Same plan + data always
// rebuilds the identical crowd (mulberry32, pure function of elapsed).

export interface PedestriansRig {
  root: THREE.Group;
  update: (dt: number, elapsed: number, hour: number) => void;
}

const COUNT = 360;
const RING_MIN = 20;
const RING_MAX = 68;
const OMEGA_MIN = 0.08; // rad/s around the district center
const OMEGA_MAX = 0.2;
const BOB_AMP = 0.08;

// Street gain by hour: commute peaks full, workday steady, dusk thin,
// night near-empty. Real-beijing clock drives this via update(hour).
function hourGain(hour: number): number {
  if (hour >= 7 && hour < 9) return 1.0;
  if (hour >= 9 && hour < 17) return 0.55;
  if (hour >= 17 && hour < 19) return 1.0;
  if (hour >= 19 && hour < 21) return 0.35;
  return 0.04;
}

interface Walker {
  district: number; // index into blocks
  radius: number;
  phase: number;
  omega: number; // rad/s; random spread = per-walker differential speed
  bobPhase: number;
  bobHz: number;
}

interface DistrictBlock {
  cx: number;
  cz: number;
  activity: number;
  start: number; // first walker index of this district's contiguous block
  count: number; // walkers assigned to this district
  target: number; // visible goal for the current hour
}

export function buildPedestrians(plan: CityPlan, data: CityData): PedestriansRig {
  const root = new THREE.Group();

  if (plan.districts.length === 0) {
    const update = (): void => undefined; // no districts => nothing to project
    return { root, update };
  }

  const rng = mulberry32(20261126); // lane A constant => rebuild-stable assignment

  // Walkers are grouped into one contiguous block per district so that
  // hiding the surplus under target density is a simple prefix cut.
  const blocks: DistrictBlock[] = plan.districts.map((d) => {
    const zone = data.zones.find((z) => z.id === d.id);
    return {
      cx: d.cx,
      cz: d.cz,
      activity: zone ? zone.activity : 0.5, // missing zone => default presence
      start: 0,
      count: 0,
      target: 0,
    };
  });

  const walkers: Walker[] = [];
  let prevBlock = -1;
  for (let i = 0; i < COUNT; i++) {
    const di = Math.min(blocks.length - 1, Math.floor((i / COUNT) * blocks.length));
    if (di !== prevBlock) {
      blocks[di].start = i;
      prevBlock = di;
    }
    blocks[di].count++;
    walkers.push({
      district: di,
      radius: RING_MIN + rng() * (RING_MAX - RING_MIN),
      phase: rng() * Math.PI * 2,
      omega: OMEGA_MIN + rng() * (OMEGA_MAX - OMEGA_MIN),
      bobPhase: rng() * Math.PI * 2,
      bobHz: 5.5 + rng() * 3.0, // gait cadence varies so the crowd never syncs
    });
  }

  // Capsule silhouette, lifted so the instance origin sits at the feet:
  // ~1.8 world units tall, planted on the ground plane.
  const geo = new THREE.CapsuleGeometry(0.32, 1.1, 3, 6);
  geo.translate(0, 0.9, 0);
  const mat = new THREE.MeshStandardMaterial({ color: 0x26374f, roughness: 0.8 });
  const mesh = new THREE.InstancedMesh(geo, mat, COUNT);
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  mesh.frustumCulled = false; // walkers span all three districts every frame
  mesh.castShadow = false; // perf budget: dark silhouettes, no shadow work
  root.add(mesh);

  const dummy = new THREE.Object3D();
  const hidden = new THREE.Matrix4().makeScale(0, 0, 0); // hide surplus in place
  for (let i = 0; i < COUNT; i++) mesh.setMatrixAt(i, hidden); // wait for first hour tick

  function update(dt: number, elapsed: number, hour: number): void {
    // dt unused on purpose: angle = phase + omega * elapsed keeps the crowd
    // a pure function of (elapsed, hour), so equal calls stay bit-identical.
    const gain = hourGain(hour);
    for (const b of blocks) {
      b.target = clamp(Math.round(b.count * gain * b.activity), 0, b.count);
    }
    for (let i = 0; i < COUNT; i++) {
      const w = walkers[i];
      const b = blocks[w.district];
      if (i - b.start >= b.target) {
        mesh.setMatrixAt(i, hidden); // surplus walker: zero-scale, pool size fixed
        continue;
      }
      const a = w.phase + w.omega * elapsed;
      dummy.position.set(
        b.cx + Math.cos(a) * w.radius,
        Math.sin(elapsed * w.bobHz + w.bobPhase) * BOB_AMP, // walking bob
        b.cz + Math.sin(a) * w.radius,
      );
      // face the travel tangent of the ring
      dummy.rotation.set(0, Math.atan2(-Math.sin(a), Math.cos(a)), 0);
      dummy.scale.setScalar(1);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  }

  return { root, update };
}
