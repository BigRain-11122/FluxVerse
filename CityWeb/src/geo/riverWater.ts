import * as THREE from "three";
import { Water } from "three/addons/objects/Water.js";
import { projectX, projectZ } from "./projection";

// Official three.js Water (mirror-reflection ocean shader) rigged for the
// Huangpu river ribbon (lane B wave 5 research card #1: real water).
// Skyline reflections come free - Water re-renders the whole scene into its
// mirror render target every frame, so both banks (Lujiazui towers, Bund)
// land in the reflection automatically. Sun glint comes from sunDirection,
// wave sparkle from the procedural normal map below.
//
// The legacy glowing river ribbon in realCity.ts stays in place (the main
// side hides it, nothing is deleted); this mesh covers the exact same
// world footprint and is laid over it.

// SYNC OBLIGATION: byte-for-byte copy of RIVER_CENTERLINE / RIVER_HALF_W
// from ./realCity.ts (they are module-private there and cannot be imported).
// If the river trace or width ever changes in realCity.ts, this copy must be
// updated in the same commit or the water drifts off the channel.
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

export interface RiverWaterRig {
  water: Water;
  update: (dt: number, elapsed: number) => void;
}

// Deterministic PRNG (mulberry32): every reload gets the identical wave
// field, so screenshots stay comparable across builds.
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Smooth (C1) interpolation weight for the value-noise lattice.
function smoothT(t: number): number {
  return t * t * (3 - 2 * t);
}

// Tileable periodic value-noise sample; fx/fy are lattice coordinates and
// lattice indices wrap modulo period, so the octave tiles seamlessly.
function sampleLattice(
  lattice: Float32Array,
  period: number,
  fx: number,
  fy: number
): number {
  const x0 = Math.floor(fx);
  const y0 = Math.floor(fy);
  const xi0 = ((x0 % period) + period) % period;
  const yi0 = ((y0 % period) + period) % period;
  const xi1 = (xi0 + 1) % period;
  const yi1 = (yi0 + 1) % period;
  const sx = smoothT(fx - x0);
  const sy = smoothT(fy - y0);
  const a = lattice[yi0 * period + xi0] * (1 - sx) + lattice[yi0 * period + xi1] * sx;
  const b = lattice[yi1 * period + xi0] * (1 - sx) + lattice[yi1 * period + xi1] * sx;
  return a * (1 - sy) + b * sy;
}

// The official waternormals.jpg is unreachable in the offline file:// build,
// so an equivalent 256x256 normal map is synthesized on a canvas: an fBm
// height field from tileable periodic value noise (octave periods 4..64 all
// divide 256, so RepeatWrapping stays seamless), wrap-around finite
// difference gradients, tangent-space RGB encoding with flat water =
// (128, 128, 255) - exactly what Water's getNoise() expects (it sums 4 taps,
// maps *0.5-1.0 back to signed, then swizzles noise.xzy so R = x-slope,
// G = z-slope, B = up).
function makeWaterNormalTexture(size = 256): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("riverWater: canvas 2d context unavailable");
  const img = ctx.createImageData(size, size);

  const rand = mulberry32(0x41501326);
  const height = new Float32Array(size * size);
  // Octave periods 4,8,16,32,64 (all divide 256): broad swells down to a
  // 4-texel ripple. Amplitude falloff 0.6^k keeps fine sparkle alive.
  for (let k = 0; k < 5; k++) {
    const period = 4 << k;
    const amp = Math.pow(0.6, k);
    const lattice = new Float32Array(period * period);
    for (let i = 0; i < lattice.length; i++) lattice[i] = rand() * 2 - 1;
    for (let y = 0; y < size; y++) {
      const fy = (y / size) * period;
      for (let x = 0; x < size; x++) {
        const fx = (x / size) * period;
        height[y * size + x] += amp * sampleLattice(lattice, period, fx, fy);
      }
    }
  }

  // Height-field gradient -> surface normal; wrap-around differences keep
  // the tile seams continuous. SLOPE is the wave steepness (tuned so the
  // specular sparkle and mirror distortion read as river chop, not storm).
  const SLOPE = 7;
  const data = img.data;
  for (let y = 0; y < size; y++) {
    const ym = (y - 1 + size) % size;
    const yp = (y + 1) % size;
    for (let x = 0; x < size; x++) {
      const xm = (x - 1 + size) % size;
      const xp = (x + 1) % size;
      const gx = (height[y * size + xp] - height[y * size + xm]) * SLOPE;
      const gy = (height[yp * size + x] - height[ym * size + x]) * SLOPE;
      const inv = 1 / Math.sqrt(gx * gx + gy * gy + 1);
      const i = (y * size + x) * 4;
      // R = x-slope, G = z-slope, B = up (Water swizzles noise.xzy).
      data[i] = Math.round((-gx * inv * 0.5 + 0.5) * 255);
      data[i + 1] = Math.round((-gy * inv * 0.5 + 0.5) * 255);
      data[i + 2] = Math.round((inv * 0.5 + 0.5) * 255);
      data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

// 460m-wide ribbon (2 * RIVER_HALF_W) extruded along the Huangpu centerline
// with the same polyline method as the legacy ribbon in realCity.ts
// (central-difference tangents, perpendicular side offsets) so the two
// footprints coincide exactly. The geometry is authored in the LOCAL XY
// plane because Water derives its mirror plane from the mesh's world
// rotation - it transforms local +Z by the mesh matrix - so the mesh itself
// carries rotation.x = -PI/2 (local (x, y, 0) -> world (x, 0, -y)) and the
// reflection plane becomes horizontal.
function buildRiverRibbonGeometry(): THREE.BufferGeometry {
  const cl = RIVER_CENTERLINE.map(([lat, lon]) => ({ x: projectX(lon), z: projectZ(lat) }));
  const pos: number[] = [];
  const norm: number[] = [];
  const uv: number[] = [];
  const idx: number[] = [];
  for (let i = 0; i < cl.length; i++) {
    const a = cl[i];
    const b = cl[Math.min(i + 1, cl.length - 1)];
    const bPrev = cl[Math.max(i - 1, 0)];
    const dx = b.x - bPrev.x;
    const dz = b.z - bPrev.z;
    const len = Math.hypot(dx, dz) || 1;
    const nx = -dz / len;
    const nz = dx / len;
    // world (x, z) -> local (x, -z); the y=0.4 lift lives on the mesh.
    pos.push(a.x + nx * RIVER_HALF_W, -(a.z + nz * RIVER_HALF_W), 0);
    pos.push(a.x - nx * RIVER_HALF_W, -(a.z - nz * RIVER_HALF_W), 0);
    norm.push(0, 0, 1, 0, 0, 1);
    uv.push(i / (cl.length - 1), 0, i / (cl.length - 1), 1);
    if (i < cl.length - 1) {
      const k = i * 2;
      // CCW seen from local +Z (winding survives the proper -PI/2 rotation)
      // so FrontSide faces up toward the camera and the mirror renders.
      idx.push(k, k + 2, k + 1, k + 1, k + 2, k + 3);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute("normal", new THREE.Float32BufferAttribute(norm, 3));
  geo.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
  geo.setIndex(idx);
  return geo;
}

export function buildRiverWater(): RiverWaterRig {
  const water = new Water(buildRiverRibbonGeometry(), {
    textureWidth: 512,
    textureHeight: 512,
    waterNormals: makeWaterNormalTexture(),
    sunDirection: new THREE.Vector3(0.3, 0.8, 0.2).normalize(),
    waterColor: 0x0a1a2a,
    distortionScale: 3.7,
    fog: true,
  });
  water.rotation.x = -Math.PI / 2;
  water.position.y = 0.4;
  water.renderOrder = 2; // legacy ribbon renders at 1; the water overlays it

  return {
    water,
    update: (dt: number, elapsed: number) => {
      // elapsed is part of the rig contract (the main side passes it); the
      // wave clock is cumulative, so only dt is needed here.
      void elapsed;
      water.material.uniforms.time.value += dt * 0.8;
    },
  };
}
