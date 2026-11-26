import * as THREE from "three";
import { mulberry32 } from "../util";
import { FLOW, ZONE_FLOW } from "../palette";
import type { CityPlan } from "./layout";
import type { CityData } from "../types";

// ============================================================================
// Street silicon dressing layer — wave 3 lane B (CEO order: silicon-ify the
// street surface, deliberately NOT fully realistic). The real-geography base
// (geo/realCity.ts) already carries the district footprints; this module
// clothes the district ring street (the y < 30 m band) with three props:
//
//   1. Neon sign swarm    — 90 vertical shop signs per district hanging on
//                           the street-ring building edge (radius 90-300 m
//                           from the district centre, y 6-26 m, facing the
//                           centre) in the district's flow-colour family.
//                           Brightness tracks zone activity (material.color
//                           x 0.5-1.2) plus a per-sign slow flicker.
//   2. Data pylons       — 16 street-side masts per district: dark-grey hex
//                           shafts in ONE cross-district batch, each capped
//                           by a glowing flow-colour orb; orbs breathe in
//                           groups of three.
//   3. Holo street gates — 2 additive half-torus arches per district
//                           spanning the ring street, each crowned by a
//                           semi-transparent apex light column.
//
// Module contract (verbatim, for the coordinator):
//   export interface StreetSiliconRig { root; update(dt, elapsed) }
//   export function buildStreetSilicon(plan, data)
//
// Units: 1 unit = 1 m in the geo/realCity world (x east, z south). All
// placement randomness flows from ONE mulberry32(8118) stream drawn in
// plan.districts order: same plan + same data => identical streets on every
// reload. Nothing here casts a shadow (the 2048 city shadow map belongs to
// building masses, not street props) and every batch keeps
// frustumCulled = false — these batches scatter across whole districts, so a
// single bounding-sphere cull test would be meaningless (house rule, cf.
// rooftops.ts / realCity merged meshes).
// ============================================================================

export interface StreetSiliconRig {
  root: THREE.Group;
  update: (dt: number, elapsed: number) => void;
}

// ---- shared geometry (module-level constants; allocated once, forever) ----
// 10x5 board, rolled 90 deg per instance into the classic vertical Chinese
// shop-sign silhouette (5 wide x 10 tall) — the HK neon-wall read the CEO
// order asks for ("硅基化" street face, not a flat billboard wall).
const SIGN_GEO = new THREE.PlaneGeometry(10, 5);
// 14 m tapered hex shaft; translate +7 so an instance's position IS its
// ground anchor point (same pattern as rooftops.ts MAST_GEO).
const PYLON_GEO = new THREE.CylinderGeometry(0.5, 0.8, 14, 6);
PYLON_GEO.translate(0, 7, 0);
// Pylon orb. Instanced, so the default 32x16 sphere costs one geometry
// for the whole city regardless of segment count.
const ORB_GEO = new THREE.SphereGeometry(0.9);
// Holo gate: half torus. A torus lives in the XY plane, so a PI arc already
// stands as an arch — feet at local (±24, 0), apex (0, 24). The instance
// only needs a yaw so the arch plane contains the radial direction.
const GATE_GEO = new THREE.TorusGeometry(24, 1.6, 8, 40, Math.PI);
// Apex light column: positioned per gate at local y 30 so it spans 24..36,
// seating its base 1.6 m INTO the apex tube (no floating gap).
const COLUMN_GEO = new THREE.BoxGeometry(0.8, 12, 0.8);

const SEED = 8118;               // brief-pinned stream: one RNG for everything
const SIGNS_PER_DISTRICT = 90;   // brief: ~90 boards per district
const SIGN_SLOTS = 4;            // brief: 4 shared MeshBasicMaterials per district
const PYLONS_PER_DISTRICT = 16;  // brief: 16 masts per district
const GATES_PER_DISTRICT = 2;    // brief: 2 arches per district
const TWO_PI = Math.PI * 2;
const HALF_PI = Math.PI / 2;

// District neon families (brief: gaming = cyan+blue, quant = gold+white,
// media = magenta+pink). Each district owns FOUR material colours: the two
// named flow tones plus "hot" (+40%) twins. The hot pair rides above the
// bloom threshold while the base tones stay under it, so roughly one board
// in two reads as a big neon and the rest as dim signage — 90 identical
// slabs is the failure mode this avoids. All colours are clones: FLOW
// constants are shared singletons and must never be mutated.
function neonFamily(districtId: string): THREE.Color[] {
  if (districtId === "gaming") {
    return [
      FLOW.data.clone(),                      // cyan  (数据青)
      FLOW.brain.clone(),                     // blue  (脑蓝)
      FLOW.data.clone().multiplyScalar(1.4),  // hot cyan
      FLOW.brain.clone().multiplyScalar(1.4), // hot blue
    ];
  }
  if (districtId === "quant") {
    return [
      FLOW.capital.clone(),                    // gold (资金金)
      FLOW.ceo.clone(),                        // white (CEO 纯白)
      FLOW.capital.clone().multiplyScalar(1.4),
      FLOW.ceo.clone().multiplyScalar(1.3),
    ];
  }
  if (districtId === "media") {
    // FLOW.traffic IS the palette's 品红; pink is it tinted toward white.
    const magenta = FLOW.traffic.clone();
    const pink = FLOW.traffic.clone().lerp(FLOW.ceo, 0.45);
    return [
      magenta,
      pink,
      magenta.clone().multiplyScalar(1.4),
      pink.clone().multiplyScalar(1.4),
    ];
  }
  // Unknown district id: derive the same 4-slot family from its zone flow
  // colour so a future district still gets a coherent neon wall.
  const flow = ZONE_FLOW[districtId] ?? FLOW.data;
  const tint = flow.clone().lerp(FLOW.ceo, 0.45);
  return [flow.clone(), tint, flow.clone().multiplyScalar(1.4), tint.clone().multiplyScalar(1.4)];
}

// Zone activity -> sign gain, exactly the brief's 0.5..1.2 window. data is
// a page-load snapshot (window.CITY_DATA), so the gain is resolved once
// here; update() then re-applies it to material.color every frame, which is
// the literal "update scales brightness by zone activity" contract.
function activityGain(data: CityData, districtId: string): number {
  const zone = data.zones.find((z) => z.id === districtId);
  const a = zone ? Math.min(1, Math.max(0, zone.activity)) : 0.5;
  return 0.5 + 0.7 * a;
}

// One InstancedMesh of signs sharing one material colour (a "slot" of the
// district's 4). material.color carries base x activity-gain (rewritten per
// frame by update); instanceColor carries the per-sign flicker factor —
// three.js multiplies both into the final fragment colour.
interface NeonSlot {
  mesh: THREE.InstancedMesh;
  mat: THREE.MeshBasicMaterial;
  base: THREE.Color;
  gain: number; // district activity gain, 0.5..1.2
  flickT: Float32Array; // per-sign flicker period (s), 0.8..2
  flickPhase: Float32Array; // per-sign flicker phase (rad)
  count: number;
}

// One district's orb batch: 16 spheres in six breathing groups (5x3 + 1).
interface OrbSlot {
  mesh: THREE.InstancedMesh;
  groupPhase: Float32Array;
  count: number;
}

// One district's gate pair shares two materials; both shimmer gently.
interface GateTween {
  archMat: THREE.MeshBasicMaterial;
  colMat: THREE.MeshBasicMaterial;
  phase: number;
}

// Per-sign placement + askew parameters, generated once at build.
interface SignSpec {
  x: number;
  y: number;
  z: number;
  yaw: number; // face the district centre
  tiltX: number; // micro pitch component
  tiltZ: number; // micro roll component added to the portrait roll
  flickT: number;
  flickPhase: number;
}

export function buildStreetSilicon(plan: CityPlan, data: CityData): StreetSiliconRig {
  const root = new THREE.Group();
  root.name = "streetSilicon";

  const rng = mulberry32(SEED);
  const neonSlots: NeonSlot[] = [];
  const orbSlots: OrbSlot[] = [];
  const gateTweens: GateTween[] = [];

  // Pylon shafts are identical hardware in every district (one dark-grey
  // material), so they form ONE cross-district InstancedMesh — the brief's
  // cross-district batch case.
  const totalPylons = PYLONS_PER_DISTRICT * plan.districts.length;
  const pylons: THREE.InstancedMesh | null =
    totalPylons > 0
      ? new THREE.InstancedMesh(
          PYLON_GEO,
          new THREE.MeshStandardMaterial({
            color: 0x1a232f, // deep grey: physical street furniture, not glow
            roughness: 0.85,
            metalness: 0.35,
          }),
          totalPylons,
        )
      : null;
  if (pylons) {
    pylons.frustumCulled = false;
    pylons.castShadow = false;
    root.add(pylons);
  }

  // Build-time scratch objects (update() allocates nothing per frame).
  const mtx = new THREE.Matrix4();
  const pos = new THREE.Vector3();
  const quat = new THREE.Quaternion();
  const eul = new THREE.Euler();
  const scl = new THREE.Vector3(1, 1, 1);
  const white = new THREE.Color(1, 1, 1);
  let pylonIdx = 0;

  for (const d of plan.districts) {
    const flow = ZONE_FLOW[d.id] ?? FLOW.data;
    const gain = activityGain(data, d.id);

    // ---- 1. neon sign swarm (90 boards, 4 shared materials) ----
    const family = neonFamily(d.id);
    const buckets: SignSpec[][] = Array.from({ length: SIGN_SLOTS }, () => []);
    for (let i = 0; i < SIGNS_PER_DISTRICT; i++) {
      const a = rng() * TWO_PI;
      const rad = 90 + rng() * 210; // street-ring building edge, 90..300 m
      const y = 6 + rng() * 20; // 6..26 m — the whole sub-30 m street band
      const x = d.cx + Math.cos(a) * rad;
      const z = d.cz + Math.sin(a) * rad;
      // One micro-tilt magnitude (±0.12 rad) split across pitch/roll by a
      // random direction: every board is askew in its own way, and the total
      // tilt never exceeds the spec'd 0.12.
      const delta = (rng() - 0.5) * 0.24;
      const psi = rng() * TWO_PI;
      buckets[i % SIGN_SLOTS].push({
        x,
        y,
        z,
        yaw: Math.atan2(d.cx - x, d.cz - z), // plane normal points at the centre
        tiltX: delta * Math.cos(psi),
        tiltZ: delta * Math.sin(psi),
        flickT: 0.8 + rng() * 1.2, // 0.8..2 s slow-flicker period
        flickPhase: rng() * TWO_PI,
      });
    }
    for (let s = 0; s < SIGN_SLOTS; s++) {
      const specs = buckets[s];
      if (specs.length === 0) continue;
      const mat = new THREE.MeshBasicMaterial({
        // Unlit by design ("无灯光"): neon glass self-emits, so MeshBasic
        // keeps the boards readable at night without any light budget.
        color: family[s].clone(),
        // Vertical shop signs read from both faces; FrontSide would blank
        // half the neon wall from the overview camera (boards face the
        // district centre, the camera sits outside).
        side: THREE.DoubleSide,
        fog: true,
      });
      const mesh = new THREE.InstancedMesh(SIGN_GEO, mat, specs.length);
      const flickT = new Float32Array(specs.length);
      const flickPhase = new Float32Array(specs.length);
      for (let k = 0; k < specs.length; k++) {
        const sp = specs[k];
        // YXZ euler order: portrait roll (with crooked tilt) happens in the
        // sign plane first, then the micro pitch, then the yaw to face the
        // street centre — an XYZ order would smear the roll into world axes.
        eul.set(sp.tiltX, sp.yaw, HALF_PI + sp.tiltZ, "YXZ");
        quat.setFromEuler(eul);
        pos.set(sp.x, sp.y, sp.z);
        mtx.compose(pos, quat, scl);
        mesh.setMatrixAt(k, mtx);
        mesh.setColorAt(k, white); // allocates instanceColor (flicker channel)
        flickT[k] = sp.flickT;
        flickPhase[k] = sp.flickPhase;
      }
      mesh.instanceMatrix.needsUpdate = true;
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
      mesh.frustumCulled = false;
      mesh.castShadow = false;
      root.add(mesh);
      neonSlots.push({ mesh, mat, base: family[s], gain, flickT, flickPhase, count: specs.length });
    }

    // ---- 2. data pylons (16 shafts + 16 orbs) ----
    const orbMat = new THREE.MeshBasicMaterial({
      color: flow.clone().multiplyScalar(1.5), // brief: zone flow colour x1.5
      fog: true,
    });
    const orbs = new THREE.InstancedMesh(ORB_GEO, orbMat, PYLONS_PER_DISTRICT);
    // 16 towers = 6 breathing groups (5 x 3 + a solo tail); one phase each.
    const groupPhase = new Float32Array(Math.ceil(PYLONS_PER_DISTRICT / 3));
    for (let g = 0; g < groupPhase.length; g++) groupPhase[g] = rng() * TWO_PI;
    for (let k = 0; k < PYLONS_PER_DISTRICT; k++) {
      const a = rng() * TWO_PI;
      const rad = 95 + rng() * 195; // curbside band of the same ring street
      const x = d.cx + Math.cos(a) * rad;
      const z = d.cz + Math.sin(a) * rad;
      // Random yaw: hex shafts with identical facet orientation would read
      // as one cloned prop; 48 varied silhouettes read as hand-scattered.
      eul.set(0, rng() * TWO_PI, 0);
      quat.setFromEuler(eul);
      pos.set(x, 0, z);
      mtx.compose(pos, quat, scl);
      if (pylons) pylons.setMatrixAt(pylonIdx++, mtx);
      // Orb caps the shaft: centre at 14.6 seats the 0.9 r ball 0.3 m into
      // the tapered rim instead of floating above it.
      pos.set(x, 14.6, z);
      mtx.compose(pos, quat, scl);
      orbs.setMatrixAt(k, mtx);
      orbs.setColorAt(k, white);
    }
    orbs.instanceMatrix.needsUpdate = true;
    if (orbs.instanceColor) orbs.instanceColor.needsUpdate = true;
    orbs.frustumCulled = false;
    orbs.castShadow = false;
    root.add(orbs);
    orbSlots.push({ mesh: orbs, groupPhase, count: PYLONS_PER_DISTRICT });

    // ---- 3. holo street gates (2 arches + 2 columns) ----
    const archMat = new THREE.MeshBasicMaterial({
      color: flow.clone(),
      blending: THREE.AdditiveBlending, // a hologram adds light, it has no body
      transparent: true,
      opacity: 0.5, // spec-pinned; update shimmers +/-0.04 around it
      depthWrite: false, // additive must never write depth
      fog: true,
    });
    const colMat = new THREE.MeshBasicMaterial({
      color: flow.clone().multiplyScalar(1.6),
      transparent: true, // "半透明" light column
      opacity: 0.55,
      depthWrite: false,
      fog: true,
    });
    const a0 = rng() * TWO_PI;
    for (let g = 0; g < GATES_PER_DISTRICT; g++) {
      // Two gates roughly opposite each other on the ring street. The arch
      // plane contains the RADIAL direction (rotation.y = -ga maps local +X
      // onto the outward radial vector), so its feet straddle the street's
      // radial width and traffic walking the tangential street passes
      // THROUGH the gate — that is what "跨街" (crossing the street) means.
      const ga = a0 + g * Math.PI + (rng() - 0.5) * 0.6;
      const gr = 150 + rng() * 90; // mid-ring band, 150..240 m
      const gate = new THREE.Group();
      // y = 1.6 (tube radius): the feet's tube bottoms rest exactly on the
      // ground plane instead of sinking into it.
      gate.position.set(d.cx + Math.cos(ga) * gr, 1.6, d.cz + Math.sin(ga) * gr);
      gate.rotation.y = -ga;
      const arch = new THREE.Mesh(GATE_GEO, archMat);
      const col = new THREE.Mesh(COLUMN_GEO, colMat);
      col.position.set(0, 30, 0); // local y 24..36 from the apex
      arch.castShadow = false;
      col.castShadow = false;
      arch.frustumCulled = false;
      col.frustumCulled = false;
      gate.add(arch, col);
      root.add(gate);
    }
    gateTweens.push({ archMat, colMat, phase: rng() * TWO_PI });
  }

  if (pylons) pylons.instanceMatrix.needsUpdate = true;

  const update = (dt: number, elapsed: number): void => {
    // 1. Signs: material.color = family colour x activity gain (0.5..1.2),
    //    then instanceColor multiplies a per-sign slow flicker. Each sign
    //    owns a random 0.8-2 s period and phase, so the whole batch's
    //    brightness pattern keeps reshuffling — approximated with elapsed
    //    sines (no timers, no per-frame allocation).
    for (const slot of neonSlots) {
      slot.mat.color.copy(slot.base).multiplyScalar(slot.gain);
      const ic = slot.mesh.instanceColor;
      if (!ic) continue;
      for (let k = 0; k < slot.count; k++) {
        const w = TWO_PI / slot.flickT[k];
        const f = 0.72 + 0.28 * (0.5 + 0.5 * Math.sin(elapsed * w + slot.flickPhase[k]));
        ic.setXYZ(k, f, f, f);
      }
      ic.needsUpdate = true;
    }
    // 2. Pylon orbs breathe in groups of three (shared group phase,
    //    ~4.8 s cycle): groups drift in and out of phase across the street.
    for (const slot of orbSlots) {
      const ic = slot.mesh.instanceColor;
      if (!ic) continue;
      for (let k = 0; k < slot.count; k++) {
        const phase = slot.groupPhase[Math.floor(k / 3)];
        const f = 0.55 + 0.45 * (0.5 + 0.5 * Math.sin(elapsed * 1.3 + phase));
        ic.setXYZ(k, f, f, f);
      }
      ic.needsUpdate = true;
    }
    // 3. Holo gates shimmer around their pinned opacities: a frozen
    //    hologram reads as a plastic loop; a +/-0.04 breath reads as light.
    for (const gt of gateTweens) {
      const s = 0.5 + 0.5 * Math.sin(elapsed * 0.7 + gt.phase);
      gt.archMat.opacity = 0.46 + 0.08 * s;
      const s2 = 0.5 + 0.5 * Math.sin(elapsed * 0.9 + gt.phase + 0.6);
      gt.colMat.opacity = 0.5 + 0.1 * s2;
    }
    // dt stays free for future wiring (house rule, cf. rooftops/pearl rigs).
  };

  return { root, update };
}
