import * as THREE from "three";
import type { CityPlan } from "./layout";
import { FLOW, ZONE_FLOW } from "../palette";
import { mulberry32 } from "../util";

// Sky silicon layer — wave 3 lane A (CEO order 2026-11-26: silicon-ify the
// real-geography city, deliberately not fully realistic). The geo base
// (Lujiazui + North Bund + L-bend Huangpu + brain island) already reads as a
// city; this module adds the AIRBORNE silicon infrastructure above it:
//   1. three transit tubes arcing district center -> river island,
//   2. the QUANT/Lujiazui holo K-line board (DESIGN canon: capital gold),
//   3. one floating data ring per district with light columns.
// Nothing here casts shadows: the sun shadow-frustum budget stays with the
// buildings, and sky silhouettes would need a huge map for no payoff.

export interface SkyTransitRig {
  root: THREE.Group;
  update: (dt: number, elapsed: number) => void;
}

// ---- shared geometry (module constants: the whole sky layer reuses these) ----
const HOOP_GEO = new THREE.TorusGeometry(7, 0.9);        // transit tube glow hoops
const DATA_RING_GEO = new THREE.TorusGeometry(70, 2.2, 8, 64);
const POD_GEO = new THREE.CapsuleGeometry(2.6, 6);       // capsule transit cabin
const LAMP_GEO = new THREE.SphereGeometry(0.5, 8, 6);    // pod headlight dot
const COLUMN_GEO = new THREE.BoxGeometry(1.2, 60, 1.2);  // data-ring light column
const KLINE_GEO = new THREE.PlaneGeometry(300, 110);     // holo K-line board

const UP = new THREE.Vector3(0, 1, 0);
const FWD = new THREE.Vector3(0, 0, 1); // torus hole axis: hoop encircles the tube tangent
const _tan = new THREE.Vector3();       // per-frame scratch (zero alloc in update)

const POD_SPEED = 90;    // m/s cruise along the tube (CEO-ordered)
const HOOP_SPACING = 60; // one glow hoop every 60m of tube
const RING_SPIN = 0.1;   // rad/s data-ring self rotation
const KLINE_Y = 280;     // board altitude over the QUANT district center

// Bake a flat color into a geometry as vertex colors: tubes and light columns
// then share ONE additive material while keeping per-district flow colors.
// The material budget (<=8) is the scarce resource here, geometry is not.
function paintVertexColors(geo: THREE.BufferGeometry, color: THREE.Color): THREE.BufferGeometry {
  const n = geo.attributes.position.count;
  const arr = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    arr[i * 3 + 0] = color.r;
    arr[i * 3 + 1] = color.g;
    arr[i * 3 + 2] = color.b;
  }
  geo.setAttribute("color", new THREE.BufferAttribute(arr, 3));
  return geo;
}

interface TubeRig {
  curve: THREE.CatmullRomCurve3;
  len: number; // precomputed arc length (m): the divisor for progress += dt*speed/len
  pods: Array<{ mesh: THREE.Mesh; progress: number }>;
}

// ---- holo K-line shaders (a screen, not a surface: no lighting at all) ----
const KLINE_VERT = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const KLINE_FRAG = /* glsl */ `
uniform float uTime;
uniform vec3 uGold;
uniform vec3 uRed;
varying vec2 vUv;

// Sin-chain pseudo market index. Deterministic in x, so advancing uTime pans
// the whole chart sideways like a live feed (silicon fiction, not realism).
float quote(float x) {
  return 0.5
    + 0.20 * sin(x * 0.9 + sin(x * 0.31) * 2.0)  // macro trend
    + 0.10 * sin(x * 2.7 + 1.3)
    + 0.05 * sin(x * 7.1 + 4.0)
    + 0.03 * sin(x * 15.7 + 2.6);                // micro ticks
}

void main() {
  // fine grid floor: thin lines on the fract cell edges
  vec2 cell = fract(vUv * vec2(24.0, 9.0));
  vec2 edge = min(cell, 1.0 - cell);
  float grid = 1.0 - smoothstep(0.0, 0.045, min(edge.x, edge.y));

  // the scrolling polyline: gold main line, red on falling segments
  float x = (vUv.x + uTime * 0.07) * 16.0;
  float y = quote(x);
  float dy = quote(x + 0.35) - quote(x);
  vec3 lineCol = mix(uRed, uGold, step(0.0, dy));

  float d = abs(vUv.y - y);
  float line = 1.0 - smoothstep(0.006, 0.018, d); // crisp stroke
  float halo = 1.0 - smoothstep(0.0, 0.11, d);    // holo bleed under it

  // soft edges: a 300x110m board reads as a projection, not a hard slab
  float fade = smoothstep(0.0, 0.05, vUv.x) * smoothstep(1.0, 0.95, vUv.x)
             * smoothstep(0.0, 0.07, vUv.y) * smoothstep(1.0, 0.93, vUv.y);

  vec3 col = uGold * 0.20 * grid + lineCol * (line * 1.9 + halo * 0.30);
  float alpha = clamp(grid * 0.45 + line + halo * 0.28, 0.0, 1.0);
  gl_FragColor = vec4(col, alpha * fade);
}
`;

export function buildSkyTransit(plan: CityPlan): SkyTransitRig {
  const rng = mulberry32(5150); // fixed seed: same sky on every reload
  const root = new THREE.Group();
  root.name = "sky-transit";

  // ---- shared materials: 7 total (budget <= 8) ----
  // tubeMat serves the tubes AND the data-ring light columns via baked
  // vertex colors, so the additive semi-transparent look costs one slot.
  const tubeMat = new THREE.MeshBasicMaterial({
    vertexColors: true,
    blending: THREE.AdditiveBlending,
    transparent: true,
    opacity: 0.22,
    depthWrite: false,
  });
  const podMat = new THREE.MeshBasicMaterial({ color: 0x1a2433 }); // dark hull; unlit reads fine at 140m+
  const lampMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(0xfff2cc).multiplyScalar(2.2) }); // HDR dot for bloom

  const tubes: TubeRig[] = [];
  const ringHolders: THREE.Group[] = [];
  let klineMat: THREE.ShaderMaterial | null = null;

  for (const d of plan.districts) {
    const flow = ZONE_FLOW[d.id] ?? FLOW.data;
    // flow x1.3 glow, shared by the tube hoops and the district data ring
    const flowGlowMat = new THREE.MeshBasicMaterial({ color: flow.clone().multiplyScalar(1.3) });

    // Island-side artery terminus (real layout: brain-island edge; legacy
    // layout: plaza edge — both are the data hub). Fallback: world origin.
    const art = plan.arteries.find((a) => a.district === d.id);
    const ix = art ? art.x0 : 0;
    const iz = art ? art.z0 : 0;
    const span = Math.hypot(ix - d.cx, iz - d.cz);

    // ---- 1. sky transit tube: district center -> island, arched ----
    if (span > 200) {
      const peak = 140 + rng() * 30;   // CEO band: apex 140~170m over the river
      const yStart = 104 + rng() * 16; // launch height above the district center
      const yEnd = 76 + rng() * 12;    // arrival height above the island edge
      const mx = (t: number) => d.cx + (ix - d.cx) * t;
      const mz = (t: number) => d.cz + (iz - d.cz) * t;
      // Control points ride the artery corridor (the center->island line
      // contains the artery segment in both layouts) and arch over the river.
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(mx(0.0), yStart, mz(0.0)),
        new THREE.Vector3(mx(0.28), peak - 18, mz(0.28)),
        new THREE.Vector3(mx(0.5), peak, mz(0.5)),
        new THREE.Vector3(mx(0.72), peak - 18, mz(0.72)),
        new THREE.Vector3(mx(1.0), yEnd, mz(1.0)),
      ]);
      const len = curve.getLength(); // precompute the arc-length table for *At()

      const tubeGeo = new THREE.TubeGeometry(curve, 48, 6, 8, false);
      paintVertexColors(tubeGeo, flow);
      root.add(new THREE.Mesh(tubeGeo, tubeMat));

      // glow hoops every ~60m, hole axis aligned to the tangent.
      // Perf lane: one InstancedMesh per district tube (hoops share geometry;
      // per-instance color replaces the per-district material clone).
      const nHoops = Math.max(2, Math.round(len / HOOP_SPACING));
      const hoopMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const hoopInst = new THREE.InstancedMesh(HOOP_GEO, hoopMat, nHoops);
      const hoopM = new THREE.Matrix4();
      const hoopQ = new THREE.Quaternion();
      const hoopS = new THREE.Vector3(1, 1, 1);
      const hoopP = new THREE.Vector3();
      for (let i = 0; i < nHoops; i++) {
        const t = i / nHoops;
        hoopP.copy(curve.getPointAt(t));
        hoopQ.setFromUnitVectors(FWD, curve.getTangentAt(t, _tan));
        hoopM.compose(hoopP, hoopQ, hoopS);
        hoopInst.setMatrixAt(i, hoopM);
        hoopInst.setColorAt(i, flow.clone().multiplyScalar(1.3));
      }
      hoopInst.instanceMatrix.needsUpdate = true;
      if (hoopInst.instanceColor) hoopInst.instanceColor.needsUpdate = true;
      root.add(hoopInst);

      // 3 capsule pods cycling district -> island, headlight at the nose
      const pods: Array<{ mesh: THREE.Mesh; progress: number }> = [];
      for (let i = 0; i < 3; i++) {
        const pod = new THREE.Mesh(POD_GEO, podMat);
        const lamp = new THREE.Mesh(LAMP_GEO, lampMat);
        lamp.position.set(0, 5.9, 0); // +Y local = travel direction (capsule nose)
        pod.add(lamp);
        root.add(pod);
        pods.push({ mesh: pod, progress: i / 3 + rng() * 0.05 });
      }
      tubes.push({ curve, len, pods });
    }

    // ---- 2. holo K-line board: QUANT / Lujiazui only (DESIGN canon) ----
    if (d.id === "quant") {
      klineMat = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uGold: { value: FLOW.capital.clone() }, // 0xfbbf24 main line
          uRed: { value: FLOW.warn.clone() },     // falling segments: 警示红
        },
        vertexShader: KLINE_VERT,
        fragmentShader: KLINE_FRAG,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide,
      });
      const board = new THREE.Mesh(KLINE_GEO, klineMat);
      board.position.set(d.cx, KLINE_Y, d.cz);
      // plane normal (+Z) swings toward the river island
      board.rotation.y = Math.atan2(ix - d.cx, iz - d.cz);
      root.add(board);
    }

    // ---- 3. floating data ring over the district center ----
    const holder = new THREE.Group();
    holder.position.set(d.cx, 380 + rng() * 50, d.cz); // altitude band 380~430m
    const torus = new THREE.Mesh(DATA_RING_GEO, flowGlowMat);
    torus.rotation.x = Math.PI / 2; // flat halo: hole axis vertical
    holder.add(torus);
    // 4 vertical light columns hanging from the ring toward the city surface.
    // One vertex-painted clone per district (the flow color differs) so all
    // 12 columns share the single additive tube material (半透明, in budget).
    const columnGeo = paintVertexColors(COLUMN_GEO.clone(), flow);
    for (let k = 0; k < 4; k++) {
      const a = (k / 4) * Math.PI * 2 + Math.PI / 4;
      const column = new THREE.Mesh(columnGeo, tubeMat);
      column.position.set(Math.cos(a) * 70, -30, Math.sin(a) * 70); // top on the ring plane, drops 60m
      holder.add(column);
    }
    root.add(holder);
    ringHolders.push(holder);
  }

  const update = (dt: number, elapsed: number): void => {
    // pods slide along their tubes at 90 m/s and wrap at the island terminus
    for (const tube of tubes) {
      for (const pod of tube.pods) {
        pod.progress = (pod.progress + (dt * POD_SPEED) / tube.len) % 1;
        tube.curve.getPointAt(pod.progress, pod.mesh.position);
        tube.curve.getTangentAt(pod.progress, _tan);
        pod.mesh.quaternion.setFromUnitVectors(UP, _tan); // capsule axis on the tangent
      }
    }
    // data rings slowly self-rotate (the orbiting pillars make it visible)
    for (const holder of ringHolders) holder.rotation.y += dt * RING_SPIN;
    // the market feed scrolls
    if (klineMat) klineMat.uniforms.uTime.value = elapsed;
  };

  return { root, update };
}
