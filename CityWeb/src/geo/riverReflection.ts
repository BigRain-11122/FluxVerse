import * as THREE from "three";
import { projectX, projectZ } from "./projection";
import { mulberry32 } from "../util";
import { FLOW } from "../palette";

// Huangpu river reflection layer (GTA6 rule card D3: the river reflection is
// the skyline's SECOND composition layer; budget 512-1024px, reflect only the
// T1 towers + light layer, never the whole city).
//
// Method - "mirrored light band" (fake reflection): no THREE.Reflector, no
// second render pass. Two bands of vertical additive strips stand on the
// water 30-80m in from each bank, mirroring the nearest shore glow in that
// river section's district flow color. The whole layer costs 1 shared
// geometry + 3 materials + 3 draw calls (3 InstancedMeshes / 120 strip
// instances) - a fraction of one real reflection render at 512px.
//
// The layer is an independent overlay: realCity's water shader is untouched,
// the strips composite additively ON TOP of the river ribbon (renderOrder 2
// vs the ribbon's 1).

export interface ReflectionRig {
  root: THREE.Group;
  update: (dt: number, elapsed: number) => void;
}

// River trace + width, copied VERBATIM from realCity.ts (RIVER_CENTERLINE /
// RIVER_HALF_W are private consts there and lane C must not edit existing
// files). Keep the two copies in sync if the trace is ever re-traced.
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
const RIVER_HALF_W = 230;

// West bank now mirrors a single warm magenta band for its whole length
// (review 2026-11-26: the cyan district core has no lit waterfront source,
// so its segment read as source-less decoration).

const PER_SIDE = 60; // strips per bank -> 120 total (spec budget)
const INSET_MIN = 30; // meters INTO the river from the bank edge
const INSET_MAX = 80;
const BASE_MIN = 0.10; // per-strip brightness range
const BASE_MAX = 0.22;
const TILT_MAX = 0.06; // rad of wave-speckle lean around the strip's width axis
const WATER_Y = 0.6; // strip foot height on the water (ribbon surface sits at 0.4)
const BREATH_AMP = 0.15; // +/-15% opacity breathing
const BREATH_SPEED = 0.9; // rad/s: one shared frequency + random phases = shimmer

// One shared strip geometry for every build and every segment (module-level
// budget). PlaneGeometry(3.2, 14) pre-translated +7 so the local origin sits
// at the strip's FOOT: an instance at y = 0.6 anchors the foot exactly on the
// water and the strip rises 14m - the mirrored "second skyline" cut.
const STRIP_GEO = new THREE.PlaneGeometry(3.2, 14);
STRIP_GEO.translate(0, 7, 0);

// Color segments (D3 card): south/east bank = Lujiazui gold, north-west =
// North Bund cyan, Bund section = magenta. Values are exactly the district
// FLOW colors (palette is the single source; cloned because palette
// singletons must never be mutated by a rig).
const GOLD = FLOW.capital.clone(); // 0xfbbf24
const CYAN = FLOW.data.clone(); // 0x5eead4
const MAGENTA = FLOW.traffic.clone(); // 0xf472b6

interface StripSpec {
  x: number;
  z: number;
  heading: number; // yaw: strip width axis follows the local river tangent
  tilt: number; // pitch around that width axis (wave-speckle lean)
  base: number; // brightness 0.10..0.22
  phase: number; // breathing phase offset (random)
}

type SegmentId = "gold" | "cyan" | "magenta";

const SEGMENTS: Array<{ id: SegmentId; color: THREE.Color }> = [
  { id: "gold", color: GOLD },
  { id: "cyan", color: CYAN },
  { id: "magenta", color: MAGENTA },
];

export function buildRiverReflection(): ReflectionRig {
  const rng = mulberry32(31415);
  const root = new THREE.Group();

  // Centerline in world meters (1 unit = 1m) + cumulative arc length.
  const cl = RIVER_CENTERLINE.map(([lat, lon]) => ({
    lat,
    x: projectX(lon),
    z: projectZ(lat),
  }));
  const cum: number[] = [0];
  for (let i = 0; i < cl.length - 1; i++) {
    cum.push(cum[i] + Math.hypot(cl[i + 1].x - cl[i].x, cl[i + 1].z - cl[i].z));
  }
  const total = cum[cum.length - 1];

  // Sample position / unit tangent / latitude at arc length s (piecewise
  // linear - strips are 3.2m wide, segment joints just read as river bends).
  const sample = (s: number) => {
    let i = 0;
    while (i < cl.length - 2 && s > cum[i + 1]) i++;
    const segLen = cum[i + 1] - cum[i];
    const u = segLen > 0 ? (s - cum[i]) / segLen : 0;
    const dx = cl[i + 1].x - cl[i].x;
    const dz = cl[i + 1].z - cl[i].z;
    const len = Math.hypot(dx, dz) || 1;
    return {
      x: cl[i].x + dx * u,
      z: cl[i].z + dz * u,
      lat: cl[i].lat + (cl[i + 1].lat - cl[i].lat) * u,
      tx: dx / len,
      tz: dz / len,
    };
  };

  // Nearest point on the centerline polyline (world XZ). Only needed for the
  // inner-corner clamp below: at the L-bend around the Lujiazui tip, a
  // parallel offset placed near the joint sits closer to the ADJACENT segment
  // than to its own, so the band edge has to be enforced against the whole
  // polyline, not just the placement segment.
  const nearestOnCenterline = (x: number, z: number): { px: number; pz: number } => {
    let best = Infinity;
    let px = 0;
    let pz = 0;
    for (let i = 0; i < cl.length - 1; i++) {
      const ax = cl[i].x;
      const az = cl[i].z;
      const dx = cl[i + 1].x - ax;
      const dz = cl[i + 1].z - az;
      const l2 = dx * dx + dz * dz || 1;
      const t = Math.min(1, Math.max(0, ((x - ax) * dx + (z - az) * dz) / l2));
      const qx = ax + dx * t;
      const qz = az + dz * t;
      const dd = (x - qx) * (x - qx) + (z - qz) * (z - qz);
      if (dd < best) {
        best = dd;
        px = qx;
        pz = qz;
      }
    }
    return { px, pz };
  };

  // ---- layout: 60 strips per bank, even arc-length spacing + jitter ----
  const bands: Record<SegmentId, StripSpec[]> = { gold: [], cyan: [], magenta: [] };
  for (const sideSign of [1, -1]) {
    // +1 = east bank (Lujiazui side: the trace flows NNE, so the left normal
    // of the flow direction faces east); -1 = west bank (Puxi: Bund then
    // North Bund going north).
    for (let k = 0; k < PER_SIDE; k++) {
      const s = ((k + rng()) / PER_SIDE) * total;
      const p = sample(s);
      const nx = -p.tz; // left normal of the flow direction
      const nz = p.tx;
      const inset = INSET_MIN + rng() * (INSET_MAX - INSET_MIN);
      const d = (RIVER_HALF_W - inset) * sideSign;
      let x = p.x + nx * d;
      let z = p.z + nz * d;
      // Inner-corner clamp: keep the strip inside the 30-80m band off the
      // bank (>= 150m off the CENTERLINE = <= 80m off the bank) even where
      // the L-bend pulls the parallel offset toward the adjacent segment.
      const near = nearestOnCenterline(x, z);
      const vx = x - near.px;
      const vz = z - near.pz;
      const vd = Math.hypot(vx, vz);
      const minD = RIVER_HALF_W - INSET_MAX;
      if (vd < minD && vd > 1e-6) {
        x = near.px + (vx / vd) * minD;
        z = near.pz + (vz / vd) * minD;
      }
      // West bank: the Bund section mirrors magenta; the North Bund stretch
      // ALSO mirrors magenta-tinted warm light - the cyan district core sits
      // ~600m inland with no lit waterfront of its own, so a cyan strip band
      // has no visible source mother-image and reads as decoration (review
      // 2026-11-26). Warm white-magenta carries the actual bank lighting.
      const seg: SegmentId =
        sideSign > 0 ? "gold" : "magenta";
      bands[seg].push({
        x,
        z,
        // Yaw that puts the strip's local +X on the tangent (t_x, t_z).
        heading: Math.atan2(-p.tz, p.tx),
        tilt: (rng() * 2 - 1) * TILT_MAX,
        base: BASE_MIN + rng() * (BASE_MAX - BASE_MIN),
        phase: rng() * Math.PI * 2,
      });
    }
  }

  // ---- one InstancedMesh per color segment (3 draw calls, 3 materials) ----
  const dummy = new THREE.Object3D();
  dummy.rotation.order = "YXZ"; // yaw first, then pitch around the yawed X
  const tmp = new THREE.Color();
  const rigs: Array<{
    mesh: THREE.InstancedMesh;
    bases: Float32Array;
    phases: Float32Array;
  }> = [];

  for (const seg of SEGMENTS) {
    const strips = bands[seg.id];
    // ONE shared MeshBasicMaterial per color segment ("1 material group, 3
    // materials by segment" budget). Additive + no depth write: strips GLOW
    // ON TOP of the river ribbon instead of cutting holes in it.
    const mat = new THREE.MeshBasicMaterial({
      color: seg.color,
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide, // the band must read from both banks
      fog: true, // far strips fade into the river haze with everything else
    });
    const mesh = new THREE.InstancedMesh(STRIP_GEO, mat, strips.length);
    const bases = new Float32Array(strips.length);
    const phases = new Float32Array(strips.length);
    for (let i = 0; i < strips.length; i++) {
      const sp = strips[i];
      dummy.position.set(sp.x, WATER_Y, sp.z);
      // YXZ: yaw aligns the width axis with the river tangent, then the
      // pitch leans the strip around that local axis - across the water like
      // a wave speckle, not around a world axis.
      dummy.rotation.set(sp.tilt, sp.heading, 0);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      bases[i] = sp.base;
      phases[i] = sp.phase;
      // Brightness lives in instanceColor: under AdditiveBlending a color
      // scale IS a per-instance opacity (contribution = rgb * a), so
      // per-strip brightness 0.10-0.22 and per-strip opacity breathing both
      // work with only 3 shared materials.
      tmp.setScalar(sp.base);
      mesh.setColorAt(i, tmp);
    }
    mesh.instanceMatrix.needsUpdate = true;
    mesh.frustumCulled = false; // one band spans the whole ~6km channel
    mesh.renderOrder = 2; // after the water ribbon (renderOrder 1)
    root.add(mesh);
    rigs.push({ mesh, bases, phases });
  }

  const update = (dt: number, elapsed: number): void => {
    // Micro-breath: every strip's opacity (= its instanceColor scale) swings
    // +/-15% around its base on one shared sine frequency with a random
    // phase - a static-feeling light band with a living shimmer traveling
    // along the shore. 120 sin() calls + one buffer upload per segment.
    for (const r of rigs) {
      for (let i = 0; i < r.bases.length; i++) {
        const g =
          r.bases[i] * (1 + BREATH_AMP * Math.sin(elapsed * BREATH_SPEED + r.phases[i]));
        tmp.setScalar(g);
        r.mesh.setColorAt(i, tmp);
      }
      if (r.mesh.instanceColor) r.mesh.instanceColor.needsUpdate = true;
    }
  };

  return { root, update };
}
