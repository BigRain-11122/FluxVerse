import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { project, projectX, projectZ } from "./projection";
import type { CityData } from "../types";
import { FLOW, ZONE_FLOW } from "../palette";
import type { CityPlan, DistrictSpec, ArterySpec, MastSpec } from "../city/layout";

// Real-geography city: Shanghai Lujiazui + North Bund (CEO order 2026-11-26:
// real prototype, silicon-future skin). Footprints + heights come from OSM
// (tools/fetch-shanghai-buildings.py), landmarks are procedural rigs placed
// at their real coordinates. One merged extrusion mesh for all footprints
// (1 draw call), world-space shader window grid, glowing river ribbon,
// brain-tower data island, light bridges to both banks.

import footprints from "../../data/shanghai-buildings.json";
import northBund from "../../data/shanghai-buildings-nb.json";

interface RawBuilding {
  name: string;
  h: number;
  ring: number[][]; // [lat, lon][]
  region: "lujiazui" | "northbund" | "bund_edge" | "named";
}

// Landmark real coordinates (lat, lon, rotation) - models come from the
// landmark lane modules; this table is the single placement source.
export const LANDMARKS: Record<string, { lat: number; lon: number; rotY: number }> = {
  pearl: { lat: 31.23967, lon: 121.49978, rotY: 0 },
  jinmao: { lat: 31.23745, lon: 121.50585, rotY: 0 },
  shanghaiTower: { lat: 31.23365, lon: 121.50777, rotY: 0 },
  swfc: { lat: 31.23533, lon: 121.50655, rotY: 0 },
  whiteMagnolia: { lat: 31.24865, lon: 121.49005, rotY: 0 },
  waibaidu: { lat: 31.24430, lon: 121.48600, rotY: Math.PI / 2 },
};

// Landmark footprints to skip in the extrusion set (procedural rig replaces
// them; a box duplicate underneath would z-fight and double-silhouette).
const LANDMARK_NAME_RE = /东方明珠|金茂|上海中心|环球金融|白玉兰/;

const REGION_TO_ZONE: Record<string, string> = {
  lujiazui: "quant",
  northbund: "gaming",
  bund_edge: "media",
};

const DISTRICT_LABEL: Record<string, string> = {
  quant: "陆家嘴 · QUANT 城",
  gaming: "北外滩 · GAME 城",
  media: "外滩 · MEDIA 城",
};

// Hand-traced Huangpu centerline: sharp L-bend around the Lujiazui tip (the
// peninsula signature), points from OSM-traced waterway. Width in meters.
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
const ISLAND_R = 118;

const WIN_VERT = `
varying vec3 vWPos;
varying vec3 vWNormal;
#include <common>
#include <fog_pars_vertex>
void main() {
  #include <begin_vertex>
  #include <beginnormal_vertex>
  #include <defaultnormal_vertex>
  vWPos = (modelMatrix * vec4(transformed, 1.0)).xyz;
  vWNormal = normalize(mat3(modelMatrix) * objectNormal);
  vec4 mvPosition = vec4(transformed, 1.0);
  #ifdef USE_INSTANCING
    mvPosition = instanceMatrix * mvPosition;
  #endif
  mvPosition = modelViewMatrix * mvPosition;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`;

const WIN_FRAG = `
uniform vec3 uTint;
uniform float uWinGain;
uniform float uBreath;
uniform float uBodyGain;
uniform float uFloorH;   // district signature: floor spacing (m)
uniform float uWinW;     // district signature: window column spacing (m)
uniform float uWinRate;  // district signature: lit-window probability
varying vec3 vWPos;
varying vec3 vWNormal;
#include <common>
#include <fog_pars_fragment>
float hash12(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}
void main() {
  vec3 col = uTint;
  float side = 1.0 - step(0.5, abs(vWNormal.y)); // side faces only
  // World-space facade grid driven by the district signature (GTA6 rule A1:
  // zones must differ in >=3 readable channels - tint/floor/window rates).
  float h = mix(vWPos.x, vWPos.z, step(abs(vWNormal.x), abs(vWNormal.z)));
  float fy = fract(vWPos.y / uFloorH);
  float fh = fract(h / uWinW);
  float cellOn = step(1.0 - uWinRate, hash12(vec2(floor(h / uWinW) * 0.37 + floor(vWPos.y / uFloorH) * 7.1, floor(h / uWinW) * 3.1)));
  float win = side * step(fy, 0.62) * step(fh, 0.55) * cellOn;
  vec3 emissive = uTint * (uWinGain + uBreath) * (1.35 + 0.65 * hash12(vec2(h, vWPos.y)));
  vec4 diffuseColor = vec4(col * uBodyGain * (0.55 + 0.45 * (1.0 - side)), 1.0);
  diffuseColor.rgb += emissive * win;
  gl_FragColor = diffuseColor;
  #include <fog_fragment>
}`;

// District visual signatures (GTA6 rule A1): >=3 distinguishable channels
// per zone - tint + floor spacing + window column spacing + lit rate.
// Lujiazui = modern glass curtain wall (tight grid, cool tint);
// North Bund = mixed business; Bund edge = historic stone (loose, warm).
const DISTRICT_SIGNATURE: Record<string, { floorH: number; winW: number; winRate: number }> = {
  quant: { floorH: 4.0, winW: 2.4, winRate: 0.5 },     // Lujiazui curtain wall
  gaming: { floorH: 3.4, winW: 3.0, winRate: 0.42 },   // North Bund mixed
  media: { floorH: 4.4, winW: 3.6, winRate: 0.62 },    // Bund heritage stone
};

export interface RealCityRig {
  root: THREE.Group;
  plan: CityPlan;
  bodyMats: Map<string, THREE.ShaderMaterial>; // zone -> facade material
  waterMat: THREE.ShaderMaterial;
  flowMats: THREE.MeshBasicMaterial[]; // bridge edges (day/night gain)
  buildingCount: number;
  landmarkSlots: typeof LANDMARKS;
  islandPos: THREE.Vector3; // brain island world position (river bend)
}

export function buildRealCity(data: CityData): RealCityRig {
  const root = new THREE.Group();

  // ---- district specs from real footprints ----
  const raws: RawBuilding[] = [
    ...((footprints as unknown) as RawBuilding[]),
    ...((northBund.buildings as unknown) as RawBuilding[]),
  ];

  const sum = new Map<string, { x: number; z: number; n: number; hmax: number }>();
  for (const b of raws) {
    const zone = REGION_TO_ZONE[b.region] ?? "quant";
    let s = sum.get(zone);
    if (!s) { s = { x: 0, z: 0, n: 0, hmax: 0 }; sum.set(zone, s); }
    s.n++;
    s.hmax = Math.max(s.hmax, b.h);
    for (const [lat, lon] of b.ring) { s.x += projectX(lon); s.z += projectZ(lat); }
  }
  const districts: DistrictSpec[] = [];
  for (const [zone, s] of sum) {
    districts.push({
      id: zone,
      name: DISTRICT_LABEL[zone] ?? zone,
      angleDeg: 0,
      cx: s.x / (s.n * 4), // ring points averaged then /4 approx centroid
      cz: s.z / (s.n * 4),
    });
  }

  // ---- merged footprint extrusion (1 mesh, 1 material per zone) ----
  const bodyMats = new Map<string, THREE.ShaderMaterial>();
  const zoneGeos = new Map<string, THREE.BufferGeometry[]>();
  let buildingCount = 0;

  for (const b of raws) {
    if (LANDMARK_NAME_RE.test(b.name)) continue; // procedural rig covers it
    const zone = REGION_TO_ZONE[b.region] ?? "quant";
    const pts = b.ring.map(([lat, lon]) => new THREE.Vector2(projectX(lon), -projectZ(lat)));
    if (pts.length < 3) continue;
    const shape = new THREE.Shape(pts);
    let geo: THREE.BufferGeometry;
    try {
      geo = new THREE.ExtrudeGeometry(shape, { depth: b.h, bevelEnabled: false });
    } catch { continue; } // degenerate triangulation: skip honestly
    geo.rotateX(-Math.PI / 2); // extrude +Z -> +Y up; shape y -> -Z world
    geo.translate(0, 0, 0);
    // flat vertex colors: none needed (tint via per-zone material uniform)
    let arr = zoneGeos.get(zone);
    if (!arr) { arr = []; zoneGeos.set(zone, arr); }
    arr.push(geo);
    buildingCount++;
  }

  for (const [zone, geos] of zoneGeos) {
    const merged = mergeGeometries(geos, false);
    if (!merged) continue;
    for (const g of geos) g.dispose();
    const mat = new THREE.ShaderMaterial({
      vertexShader: WIN_VERT,
      fragmentShader: WIN_FRAG,
      // fog:true requires merging UniformsLib.fog or the renderer crashes
      // writing fogDensity.value every frame.
      uniforms: THREE.UniformsUtils.merge([
        THREE.UniformsLib.fog,
        {
          uTint: { value: (ZONE_FLOW[zone] ?? FLOW.data).clone().multiplyScalar(0.55) },
          uWinGain: { value: 1.0 },
          uBreath: { value: 0.0 },
          uBodyGain: { value: 1.0 },
          uFloorH: { value: DISTRICT_SIGNATURE[zone]?.floorH ?? 3.6 },
          uWinW: { value: DISTRICT_SIGNATURE[zone]?.winW ?? 2.9 },
          uWinRate: { value: DISTRICT_SIGNATURE[zone]?.winRate ?? 0.45 },
        },
      ]),
      fog: true,
    });
    const mesh = new THREE.Mesh(merged, mat);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.frustumCulled = false; // single city-scale mesh
    root.add(mesh);
    bodyMats.set(zone, mat);
  }

  // ---- river ribbon ----
  const flowMats: THREE.MeshBasicMaterial[] = []; // all day/night-gated glow mats
  const waterMat = new THREE.ShaderMaterial({
    uniforms: THREE.UniformsUtils.merge([
      THREE.UniformsLib.fog,
      {
        uTime: { value: 0 },
        // Color boost: THREE.Color hex -> linear conversion darkens raw
        // ShaderMaterial output under ACES (water read black=ground, pixel
        // verified); scale so the final sRGB lands on a readable teal-blue.
        uDeep: { value: new THREE.Color(0x1d5a7e).multiplyScalar(3.4) },
        uGlow: { value: new THREE.Color(0x1fb89e).multiplyScalar(2.1) },
      },
    ]),
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }`,
    fragmentShader: `
      uniform float uTime;
      uniform vec3 uDeep;
      uniform vec3 uGlow;
      varying vec2 vUv;
      void main() {
        // River = "lit water band between two bright banks". Body carries a
        // readable teal-blue (not black), sparse flow stripes along the
        // channel, brightest at shorelines. Reflections stay future work.
        float flow = 0.5 + 0.5 * sin((vUv.x * 60.0) - uTime * 0.9 + sin(vUv.y * 5.0) * 0.6);
        float flow2 = 0.5 + 0.5 * sin((vUv.x * 23.0) - uTime * 0.35);
        float bank = smoothstep(0.0, 0.06, vUv.y) * smoothstep(1.0, 0.94, vUv.y);
        float band = smoothstep(0.55, 0.98, flow) * (0.3 + 0.4 * bank);
        vec3 col = uDeep * (0.9 + 0.35 * band + 0.12 * flow2);
        col += uGlow * band * 0.5;
        col += uGlow * (1.0 - bank) * 1.25; // two bright shoreline ribbons
        gl_FragColor = vec4(col, 0.96);
      }`,
    transparent: true,
    fog: false,
  });
  const riverPos: number[] = [];
  const riverUv: number[] = [];
  const riverIdx: number[] = [];
  const cl = RIVER_CENTERLINE.map(([lat, lon]) => ({ x: projectX(lon), z: projectZ(lat) }));
  for (let i = 0; i < cl.length; i++) {
    const a = cl[i];
    const b = cl[Math.min(i + 1, cl.length - 1)];
    const bPrev = cl[Math.max(i - 1, 0)];
    const dx = b.x - bPrev.x;
    const dz = b.z - bPrev.z;
    const len = Math.hypot(dx, dz) || 1;
    const nx = -dz / len;
    const nz = dx / len;
    riverPos.push(a.x + nx * RIVER_HALF_W, 0.4, a.z + nz * RIVER_HALF_W);
    riverPos.push(a.x - nx * RIVER_HALF_W, 0.4, a.z - nz * RIVER_HALF_W);
    riverUv.push(i / (cl.length - 1), 0, i / (cl.length - 1), 1);
    if (i < cl.length - 1) {
      const k = i * 2;
      riverIdx.push(k, k + 1, k + 2, k + 1, k + 3, k + 2);
    }
  }
  const riverGeo = new THREE.BufferGeometry();
  riverGeo.setAttribute("position", new THREE.Float32BufferAttribute(riverPos, 3));
  riverGeo.setAttribute("uv", new THREE.Float32BufferAttribute(riverUv, 2));
  riverGeo.setIndex(riverIdx);
  const river = new THREE.Mesh(riverGeo, waterMat);
  river.renderOrder = 1;
  root.add(river);

  // Bank glow lines: two ribbons tracing the river edges - the single
  // strongest "this is the Huangpu" reading cue from any distance.
  const bankMat = new THREE.MeshBasicMaterial({
    color: FLOW.data.clone().multiplyScalar(1.25), blending: THREE.AdditiveBlending,
    transparent: true, opacity: 0.75, depthWrite: false, fog: true,
  });
  bankMat.userData.flowColor = FLOW.data.clone();
  for (const sideSign of [1, -1]) {
    const bankPos: number[] = [];
    for (let i = 0; i < cl.length; i++) {
      const a = cl[i];
      const b = cl[Math.min(i + 1, cl.length - 1)];
      const bPrev = cl[Math.max(i - 1, 0)];
      const dx = b.x - bPrev.x;
      const dz = b.z - bPrev.z;
      const len = Math.hypot(dx, dz) || 1;
      const nx = -dz / len;
      const nz = dx / len;
      bankPos.push(a.x + nx * (RIVER_HALF_W - 3) * sideSign, 1.2, a.z + nz * (RIVER_HALF_W - 3) * sideSign);
    }
    const bankGeo = new THREE.BufferGeometry();
    bankGeo.setAttribute("position", new THREE.Float32BufferAttribute(bankPos, 3));
    root.add(new THREE.Line(bankGeo, bankMat));
  }
  flowMats.push(bankMat);

  // ---- brain-tower data island: sits IN the river at the bend apex ----
  const ISLAND_LAT = 31.2398, ISLAND_LON = 121.5028;
  const islandPos = new THREE.Vector3(projectX(ISLAND_LON), 0, projectZ(ISLAND_LAT));
  const island = new THREE.Mesh(
    new THREE.CylinderGeometry(ISLAND_R, ISLAND_R + 14, 9, 6),
    new THREE.MeshStandardMaterial({ color: 0x0b1420, roughness: 0.85, metalness: 0.25 }),
  );
  island.position.set(islandPos.x, 4.5, islandPos.z);
  island.receiveShadow = true;
  root.add(island);
  const islandRing = new THREE.Mesh(
    new THREE.TorusGeometry(ISLAND_R - 3, 1.1, 8, 96),
    new THREE.MeshBasicMaterial({ color: FLOW.brain.clone().multiplyScalar(1.5) }),
  );
  islandRing.rotation.x = Math.PI / 2;
  islandRing.position.set(islandPos.x, 9.4, islandPos.z);
  root.add(islandRing);

  // ---- light bridges: island -> each district center ----
  const arteries: ArterySpec[] = [];
  for (const d of districts) {
    const from = new THREE.Vector2(d.cx, d.cz);
    const to = new THREE.Vector2(islandPos.x, islandPos.z);
    const dir = to.clone().sub(from).normalize();
    const start = from.clone().add(dir.clone().multiplyScalar(150));
    const end = to.clone().sub(dir.clone().multiplyScalar(ISLAND_R + 8));
    const len = start.distanceTo(end);
    const mid = start.clone().add(end).multiplyScalar(0.5);
    const ang = Math.atan2(end.y - start.y, end.x - start.x); // note: y=Z axis here

    const deck = new THREE.Mesh(
      new THREE.BoxGeometry(len, 1.8, 26),
      new THREE.MeshStandardMaterial({ color: 0x0c1424, roughness: 0.9 }),
    );
    deck.position.set(mid.x, 7, mid.y);
    deck.rotation.y = -ang;
    root.add(deck);

    const flow = ZONE_FLOW[d.id] ?? FLOW.data;
    const edgeMat = new THREE.MeshBasicMaterial({ color: flow.clone() });
    edgeMat.userData.flowColor = flow.clone();
    for (const side of [-14.5, 14.5]) {
      const edge = new THREE.Mesh(new THREE.BoxGeometry(len, 0.6, 1.4), edgeMat);
      edge.position.set(mid.x, 8.6, mid.y + Math.cos(ang) * side * -1);
      edge.rotation.y = -ang;
      // offset perpendicular: simpler to parent under deck
      edge.position.set(mid.x, 8.6, mid.y);
      root.remove(edge);
      deck.add(edge);
      edge.position.set(0, 0.9, side);
    }
    root.add(deck);
    flowMats.push(edgeMat);

    arteries.push({
      district: d.id,
      angleDeg: 0,
      x0: end.x, z0: end.y,
      x1: start.x, z1: start.y,
    });
  }

  // ---- MEDIA signal masts along the Bund edge ----
  const masts: MastSpec[] = [
    { x: projectX(121.4873), z: projectZ(31.2335), h: 150 },
    { x: projectX(121.4860), z: projectZ(31.2380), h: 130 },
    { x: projectX(121.4850), z: projectZ(31.2420), h: 118 },
  ];

  // ---- perception ring pylons (outer) ----
  const ringNodes: Array<{ x: number; z: number }> = [];
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2 + 0.2;
    ringNodes.push({ x: Math.cos(a) * 1900, z: Math.sin(a) * 1900 });
  }

  const plan: CityPlan = { districts, buildings: [], arteries, masts, ringNodes };

  return { root, plan, bodyMats, waterMat, flowMats, buildingCount, landmarkSlots: LANDMARKS, islandPos };
}
