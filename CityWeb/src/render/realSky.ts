import * as THREE from "three";
import { Sky } from "three/addons/objects/Sky.js";

// ============================================================================
// Official Sky dome — wave 5 lane A. Research-card item 1: replace the
// hand-rolled gradient dome (daynight.ts buildSky, topColor/bottomColor
// lerp) with three.js' official physical Sky (Preetham analytic daylight
// model, examples/jsm/objects/Sky.js). Cure for the review defect
// 「天空死黑无黄昏渐变」: with the sun hanging low at dusk, turbidity 10 +
// rayleigh 2.6 makes the atmosphere scatter warm orange across the
// horizon by itself — no hand-painted gradient, no extra tint.
//
// Module contract, wired verbatim by the coordinator (this file never
// mounts itself; daynight.ts / main.ts are NOT touched by this lane —
// they stay daynight.ts territory):
//   export interface RealSkyRig { sky; sunSphere; update(hour, elapsed) }
//   export function buildRealSky(): RealSkyRig
// The coordinator swaps scene.add(sky.mesh, sky.stars) for
// scene.add(realSky.sky, realSky.sunSphere) and calls
// realSky.update(daynight.hour(), elapsed) in the frame loop. The old
// star Points (radius 820, transparent pass, sky writes no depth) still
// read through in front of this sky box.
//
// Units: 1 unit = 1 m, y up, East = +X (per geo/projection.ts), hence
// South = +Z, West = -X — the sun arc runs east -> south -> west, the
// path a northern-hemisphere (Beijing) sun actually takes, continuing
// under the horizon through north at solar midnight. Camera far is 9000
// (main.ts), so the 8000 m sun disc and the 9000-scaled sky box both
// sit inside the frustum. Determinism: update() is a pure function of
// (hour, elapsed) — no randomness, no per-frame allocation.
// ============================================================================

export interface RealSkyRig {
  sky: Sky;
  sunSphere: THREE.Mesh;   // visible sun disc (MeshBasic white, r=30, far 8000)
  update: (hour: number, elapsed: number) => void;
}

// Sky box scale. The official demo uses 450000; at city scale (camera
// far 9000) 9000 keeps the box behind every piece of geometry while the
// shader still pins it to the far plane (gl_Position.z = w).
const SKY_SCALE = 9000;

// Day look — hazy warm city air. Night look — drop to clear air so the
// star layer reads (spec: 夜段 turbidity/rayleigh 渐降到 1.2/0.6 星空清晰).
const DAY_TURBIDITY = 10;
const DAY_RAYLEIGH = 2.6;
const NIGHT_TURBIDITY = 1.2;
const NIGHT_RAYLEIGH = 0.6;

// Mie constants per spec, held fixed day and night.
const MIE_COEFFICIENT = 0.005;
const MIE_DIRECTIONAL_G = 0.8;

// Sun path (spec): 06:00 at the horizon -> 12:00 at 62° -> 18:00 back at
// the horizon, then a smooth dip to -20° at solar midnight.
const DAY_START_H = 6;
const DAY_END_H = 18;
const NOON_ELEV_DEG = 62;
const NIGHT_ELEV_DEG = -20;

// Visible sun disc: r=30 m at 8000 m distance ≈ 0.43° angular size (the
// real sun is 0.53°), so the disc reads true from any district.
const SUN_DISC_R = 30;
const SUN_DISTANCE = 8000;

// The official Sky shader (r187) ships procedural clouds with constructor
// default coverage 0.4. Days keep the official default; the night ramp
// fades coverage to 0 so clouds never occlude the star layer (星空清晰).
const DAY_CLOUD_COVERAGE = 0.4;

export function buildRealSky(): RealSkyRig {
  const sky = new Sky();
  sky.scale.setScalar(SKY_SCALE);

  const u = sky.material.uniforms;
  u.turbidity.value = DAY_TURBIDITY;
  u.rayleigh.value = DAY_RAYLEIGH;
  u.mieCoefficient.value = MIE_COEFFICIENT;
  u.mieDirectionalG.value = MIE_DIRECTIONAL_G;

  const sunSphere = new THREE.Mesh(
    new THREE.SphereGeometry(SUN_DISC_R, 16, 12),
    new THREE.MeshBasicMaterial({ color: 0xffffff, fog: false })
  );
  // fog:false — the scene fog is FogExp2 and would swallow a white disc
  // 8 km out; depth stays on so city geometry can still occlude the sun.

  // Reused scratch vector — update() allocates nothing per frame.
  const sunDir = new THREE.Vector3();

  const update = (hour: number, elapsed: number): void => {
    const h = ((hour % 24) + 24) % 24;

    // --- sun elevation ---
    const dayT = (h - DAY_START_H) / (DAY_END_H - DAY_START_H); // 0..1 daytime
    let elevDeg: number;
    if (dayT >= 0 && dayT <= 1) {
      elevDeg = NOON_ELEV_DEG * Math.sin(Math.PI * dayT);
    } else {
      // 0 at 18:00, 0.5 at 24:00, 1 at 06:00 — smooth dip to -20° and back.
      const nightFrac = ((h - DAY_END_H + 24) % 24) / 12;
      elevDeg = NIGHT_ELEV_DEG * Math.sin(Math.PI * nightFrac);
    }

    // --- sun azimuth: east(+X) 06:00 -> south(+Z) noon -> west(-X) 18:00,
    // continuing under the horizon through north(-Z) at midnight ---
    const azRad = (Math.PI * (h - DAY_START_H)) / 12;
    const elevRad = THREE.MathUtils.degToRad(elevDeg);
    const horiz = Math.cos(elevRad);
    sunDir.set(horiz * Math.cos(azRad), Math.sin(elevRad), horiz * Math.sin(azRad));

    // Official example convention: sunPosition is the unit direction (the
    // shader normalizes it internally; the vSunfade term expects ~1 length).
    u.sunPosition.value.copy(sunDir);
    sunSphere.position.copy(sunDir).multiplyScalar(SUN_DISTANCE);

    // --- night ramp: 0 at the horizon, 1 at the -20° floor ---
    const nightF = THREE.MathUtils.clamp(-elevDeg / -NIGHT_ELEV_DEG, 0, 1);
    u.turbidity.value = DAY_TURBIDITY + (NIGHT_TURBIDITY - DAY_TURBIDITY) * nightF;
    u.rayleigh.value = DAY_RAYLEIGH + (NIGHT_RAYLEIGH - DAY_RAYLEIGH) * nightF;
    u.cloudCoverage.value = DAY_CLOUD_COVERAGE * (1 - nightF);
    // Official cloud evolution clock — without advancing it, the r187 cloud
    // layer is a frozen stamp; elapsed (seconds) lets it billow at the
    // official cloudSpeed.
    u.time.value = elapsed;

    // Sun disc below the horizon = night: hide it.
    sunSphere.visible = elevDeg > 0;
  };

  return { sky, sunSphere, update };
}
