import * as THREE from "three";
import { mulberry32, smoothstep } from "../util";
import type { CityData } from "../types";

// ============================================================================
// Ambient life layer — wave 4 lane A. Fixes the two pain points the
// director flagged on the dusk cut:
//   1) dusk sky reads as pure black above the skyline: a huge additive
//      warm-orange gradient arch now hangs over the WESTERN horizon,
//      hour-gated to 17-19.5h only. The sky itself stays daynight.ts
//      territory — this layer only ADDS on top of the SkyRig and never
//      touches its uniforms.
//   2) the far skyline reads as dead-black silhouettes: a 400-instance
//      constellation of fake far window quads on the 600-1500 m ring
//      around the three-district cluster. It deliberately does NOT hang
//      on the real building geometry — the far horizon is a light layer,
//      one draw call, so it never fights the realCity facade shaders.
// Fog warming is intentionally NOT implemented here: fog has exactly one
// owner (daynight.ts + phase palette); a second hand on it would be a
// double-driven parameter.
//
// Module contract, wired verbatim by the coordinator:
//   export interface AmbientLifeRig { root; update(dt, elapsed, hour) }
//   export function buildAmbientLife(data: CityData): AmbientLifeRig
//
// Units: 1 unit = 1 m, y up, origin = river-bend composition centre
// (East = +X per geo/projection.ts, so west = -X). Determinism:
// mulberry32(9421) => identical glow jitter and window constellation on
// every reload, same discipline as layout.ts.
// ============================================================================

export interface AmbientLifeRig {
  root: THREE.Group;
  update: (dt: number, elapsed: number, hour: number) => void;
}

// ---- shared geometry (module-level constants; allocated once, forever) ----
// Dusk glow arch: upper cap of a 4200 m sphere (60° of polar angle), so
// the rim sits at local y = 2100 and the pole at local y = 4200. The
// shader gradient is position-based in LOCAL space, immune to the mesh's
// -3000 m west offset.
const GLOW_R = 4200;
const GLOW_THETA = Math.PI / 3; // top cap only ("仅上半")
const GLOW_RIM_Y = GLOW_R * Math.cos(GLOW_THETA); // 2100 m, horizon side
const GLOW_ZEN_Y = GLOW_R; // 4200 m, zenith side
const GLOW_GEO = new THREE.SphereGeometry(GLOW_R, 16, 8, 0, Math.PI * 2, 0, GLOW_THETA);
const GLOW_COLOR = 0xff9a5c; // horizon warm orange (spec)
const GLOW_WEST_X = -3000; // arch centre pushed 3000 m west of the origin

// Glow hour envelope (spec): full 1.0 across 17.0-19.5h (= phaseLabel
// "黄昏"), ramping up from late afternoon and decaying into night, hard
// zero in daylight — the band is dusk-exclusive, daytime sky untouched.
const GLOW_RISE_START = 15.8;
const GLOW_FULL_START = 17.0;
const GLOW_FULL_END = 19.5;
const GLOW_FALL_END = 21.0;

// Far window constellation: 400 airborne facade slabs, one shared quad.
const WIN_COUNT = 400;
const WIN_PLANE_W = 14; // m, one shared 14x20 quad = one far facade slab
const WIN_PLANE_H = 20;
const WIN_GEO = new THREE.PlaneGeometry(WIN_PLANE_W, WIN_PLANE_H);
const WIN_RING_MIN = 600; // real meters, outer ring around the 3 districts
const WIN_RING_MAX = 1500;
const WIN_Y_MIN = 60; // floating fake facades, 60-160 m altitude
const WIN_Y_MAX = 160;
const WIN_COLOR = 0xdfe8ff; // white-warm base tint (spec)
const WIN_BASE_MIN = 0.15; // per-instance base brightness band (spec)
const WIN_BASE_MAX = 0.5;
const WIN_DAY_GAIN = 0.15; // hour target: night 1.0 / day 0.15 (spec)
// Window hour ramps aligned with the phase-palette keyframes (NIGHT->DAWN
// keys at 4.5/6.5, DUSK key at 18, "黄昏" label 17-19.5) so far lights and
// near facades brighten on the same schedule.
const WIN_DAWN_START = 4.5;
const WIN_DAWN_END = 6.5;
const WIN_DUSK_START = 17.0;
const WIN_DUSK_END = 19.5;

const GLOW_VERT = `
varying vec3 vPos;
void main() {
  vPos = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

// Local-space height drives the gradient: 0 at the cap rim (horizon side,
// warm orange) -> 1 at the pole (zenith, transparent). Rim/zenith heights
// are injected from the geometry constants so shader and geometry can
// never drift apart. Under AdditiveBlending (src.rgb * src.a + dst) the
// alpha channel IS the intensity, so vec4(color, glow) keeps the falloff
// exactly as designed.
const GLOW_FRAG = `
uniform vec3 uColor;
uniform float uOpacity; // hour envelope: 1 in dusk window, 0 in daylight
uniform float uTime;
varying vec3 vPos;
void main() {
  float t = clamp((vPos.y - ${GLOW_RIM_Y.toFixed(1)}) / ${(GLOW_ZEN_Y - GLOW_RIM_Y).toFixed(1)}, 0.0, 1.0);
  float falloff = pow(1.0 - t, 1.8); // hot at the horizon, gone at zenith
  // Slow drift shimmer (~90 s period) via two crossed low-frequency waves.
  float drift = 0.88 + 0.12 * sin(uTime * 0.07 + vPos.x * 0.0007 + vPos.z * 0.0005);
  // Uneven brightness along the arc so it reads as sky, not as a tube.
  float az = atan(vPos.z, vPos.x);
  float arc = 0.9 + 0.1 * sin(az * 3.0 + uTime * 0.05);
  float glow = falloff * drift * arc * uOpacity * 0.55;
  gl_FragColor = vec4(uColor, glow);
}`;

// Dusk glow band opacity: 1.0 across 17.0-19.5h, smooth rise from late
// afternoon, smooth decay into night, hard zero outside — the arch exists
// only at dusk, so the daytime sky keeps its clean phase-palette read.
function duskGlow(hour: number): number {
  if (hour < GLOW_RISE_START || hour > GLOW_FALL_END) return 0;
  if (hour < GLOW_FULL_START) return smoothstep((hour - GLOW_RISE_START) / (GLOW_FULL_START - GLOW_RISE_START));
  if (hour <= GLOW_FULL_END) return 1;
  return 1 - smoothstep((hour - GLOW_FULL_END) / (GLOW_FALL_END - GLOW_FULL_END));
}

// Far window gain: 0.15 flat by day, 1.0 at night, ramps at dawn/dusk.
function windowHourGain(hour: number): number {
  let night: number;
  if (hour >= WIN_DUSK_END || hour < WIN_DAWN_START) night = 1;
  else if (hour < WIN_DAWN_END) night = 1 - smoothstep((hour - WIN_DAWN_START) / (WIN_DAWN_END - WIN_DAWN_START));
  else if (hour < WIN_DUSK_START) night = 0;
  else night = smoothstep((hour - WIN_DUSK_START) / (WIN_DUSK_END - WIN_DUSK_START));
  return WIN_DAY_GAIN + (1 - WIN_DAY_GAIN) * night;
}

export function buildAmbientLife(data: CityData): AmbientLifeRig {
  const root = new THREE.Group();
  const rng = mulberry32(9421); // lane seed => rebuild-stable placement

  // ---- 1) dusk glow band: additive warm arch over the western horizon ----
  // Spec: outward-normal additive shell (NOT BackSide). The camera lives
  // INSIDE the 4200 m shell (the whole city sits within ~2 km of the
  // -3000 m offset centre), so a FrontSide shell would cull every face
  // from inside; DoubleSide keeps the outward-normal convention while
  // actually rendering for an inside viewer. Additive + depthWrite:false
  // means the arch glows ON TOP of the sky dome (opaque, no depth write)
  // and never punches holes in real geometry.
  const glowMat = new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: new THREE.Color(GLOW_COLOR) },
      uOpacity: { value: 0 },
      uTime: { value: 0 },
    },
    vertexShader: GLOW_VERT,
    fragmentShader: GLOW_FRAG,
    side: THREE.DoubleSide,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    fog: false, // sky-level element, same fog exemption as the sky dome
  });
  const glowMesh = new THREE.Mesh(GLOW_GEO, glowMat);
  glowMesh.position.set(GLOW_WEST_X, 0, 0); // west horizon (East = +X)
  glowMesh.frustumCulled = false; // spans the whole sky; culling misfires
  glowMesh.castShadow = false;
  glowMesh.visible = false; // until the first update opens the dusk window
  root.add(glowMesh);

  // ---- 2) far window constellation: 400 fake facades on the outer ring ----
  // Airborne (60-160 m) facade slabs on the 600-1500 m ring around the
  // three-district cluster: far-horizon window light that does not depend
  // on the real building geometry, so the distant skyline glows even where
  // the realCity mesh has nothing to hang windows on. Brightness lives in
  // instanceColor (multiplies the white-warm material tint), rewritten per
  // frame with the breathing sine.
  const winMat = new THREE.MeshBasicMaterial({
    color: WIN_COLOR,
    side: THREE.DoubleSide, // walk mode can end up outside the ring
    fog: true, // real depth cueing into the dusk haze, like real geometry
  });
  const winMesh = new THREE.InstancedMesh(WIN_GEO, winMat, WIN_COUNT);
  const winBase = new Float32Array(WIN_COUNT);
  const winPhase = new Float32Array(WIN_COUNT);
  const winSpeed = new Float32Array(WIN_COUNT);
  const dummy = new THREE.Object3D();
  const tmp = new THREE.Color();
  for (let i = 0; i < WIN_COUNT; i++) {
    const ang = rng() * Math.PI * 2;
    const r = WIN_RING_MIN + (WIN_RING_MAX - WIN_RING_MIN) * rng();
    const x = Math.cos(ang) * r;
    const z = Math.sin(ang) * r;
    const y = WIN_Y_MIN + (WIN_Y_MAX - WIN_Y_MIN) * rng();
    dummy.position.set(x, y, z);
    // Yaw the quad toward the composition origin (the viewer's city) with
    // a random jitter so the ring never reads as a perfect cylinder.
    dummy.rotation.set(0, Math.atan2(-x, -z) + (rng() - 0.5) * 0.9, 0);
    dummy.updateMatrix();
    winMesh.setMatrixAt(i, dummy.matrix);
    winBase[i] = WIN_BASE_MIN + (WIN_BASE_MAX - WIN_BASE_MIN) * rng();
    winPhase[i] = rng() * Math.PI * 2;
    winSpeed[i] = 0.3 + 0.5 * rng(); // 7-20 s breathing periods
    tmp.setScalar(winBase[i]);
    winMesh.setColorAt(i, tmp);
  }
  winMesh.instanceMatrix.needsUpdate = true;
  if (winMesh.instanceColor) winMesh.instanceColor.needsUpdate = true;
  winMesh.frustumCulled = false; // the ring spans the whole horizon
  winMesh.castShadow = false;
  root.add(winMesh);

  // Zone activity (data, not geometry) scales the far-light life: a busy
  // city leaves more distant windows on. Missing zones default to 0.5.
  let act = 0.5;
  if (data.zones.length > 0) {
    let sum = 0;
    for (const z of data.zones) sum += Math.min(1, Math.max(0, z.activity));
    act = sum / data.zones.length;
  }
  const lifeScale = 0.7 + 0.5 * act; // 0.7..1.2

  const update = (dt: number, elapsed: number, hour: number): void => {
    // Dusk arch: hour envelope drives opacity, elapsed drives the slow
    // drift shimmer; fully hidden outside the dusk window so the draw
    // call costs nothing at night/day.
    const g = duskGlow(hour);
    glowMat.uniforms.uOpacity.value = g;
    glowMat.uniforms.uTime.value = elapsed;
    glowMesh.visible = g > 0.001;

    // Far windows: base brightness x slow sine breathing (random phase and
    // speed per instance) x hour gain x city-life scale. 400 sin() calls
    // and one ~4.8 KB instanceColor upload per frame.
    const gain = windowHourGain(hour) * lifeScale;
    for (let i = 0; i < WIN_COUNT; i++) {
      const breath = 0.72 + 0.28 * Math.sin(elapsed * winSpeed[i] + winPhase[i]);
      tmp.setScalar(winBase[i] * breath * gain);
      winMesh.setColorAt(i, tmp);
    }
    if (winMesh.instanceColor) winMesh.instanceColor.needsUpdate = true;
  };

  return { root, update };
}
