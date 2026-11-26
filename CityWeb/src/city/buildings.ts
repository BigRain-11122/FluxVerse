import * as THREE from "three";
import type { CityPlan, BuildingSpec } from "./layout";
import { mulberry32 } from "../util";
import { ZONE_FLOW } from "../palette";
import type { CityData } from "../types";

// Buildings: one InstancedMesh for all bodies (instanceColor = dark
// body variants) + one InstancedMesh of emissive window quads per district
// (MeshBasicMaterial => self-lit; per-district material so day/night and
// zone activity modulate whole districts cheaply).

const bodyGeo = new THREE.BoxGeometry(1, 1, 1);
bodyGeo.translate(0, 0.5, 0);

const winGeo = new THREE.BoxGeometry(1.05, 0.62, 0.1);

export interface BuildingsRig {
  root: THREE.Group;
  bodyMesh: THREE.InstancedMesh;
  windowMeshes: Map<string, THREE.InstancedMesh>;
  buildingCount: number;
  windowCount: number;
}

interface WindowSpec {
  x: number; z: number; y: number; face: 0 | 1 | 2 | 3; // +z -z +x -x
  scale: number;
  district: string;
}

function buildingWindows(b: BuildingSpec, rng: () => number, out: WindowSpec[]): void {
  const floors = Math.max(2, Math.floor(b.h / 4.6));
  const faceDefs: Array<{ nx: number; nz: number; face: 0 | 1 | 2 | 3; w: number }> = [
    { nx: 0, nz: 1, face: 0, w: b.w },
    { nx: 0, nz: -1, face: 1, w: b.w },
    { nx: 1, nz: 0, face: 2, w: b.d },
    { nx: -1, nz: 0, face: 3, w: b.d },
  ];
  for (const f of faceDefs) {
    const cols = Math.max(1, Math.floor(f.w / 2.6));
    if (cols < 1) continue;
    for (let fl = 0; fl < floors; fl++) {
      for (let c = 0; c < cols; c++) {
        if (rng() > 0.55) continue; // ~55% windows lit (deterministic)
        const u = (c + 0.5) / cols - 0.5;
        const y = 3.0 + fl * 4.6;
        if (y > b.h - 1.5) continue;
        out.push({
          x: b.x + f.nx * (f.face === 0 || f.face === 1 ? b.d / 2 + 0.02 : b.w / 2 + 0.02) + (f.nx === 0 ? u * f.w : 0),
          z: b.z + f.nz * (f.face === 0 || f.face === 1 ? b.d / 2 + 0.02 : b.w / 2 + 0.02) + (f.nz === 0 ? u * f.w : 0),
          y,
          face: f.face,
          scale: 0.85 + rng() * 0.3,
          district: b.district,
        });
      }
    }
  }
}

export function buildBuildings(plan: CityPlan, data: CityData): BuildingsRig {
  const rng = mulberry32(7717);
  const root = new THREE.Group();

  // ---- bodies ----
  const bodyMat = new THREE.MeshStandardMaterial({ roughness: 0.88, metalness: 0.06 });
  const n = plan.buildings.length;
  const bodyMesh = new THREE.InstancedMesh(bodyGeo, bodyMat, n);
  bodyMesh.castShadow = true;
  bodyMesh.receiveShadow = true;
  const m = new THREE.Matrix4();
  const bodyColor = new THREE.Color();
  const base = new THREE.Color(0x101a2c);
  for (let i = 0; i < n; i++) {
    const b = plan.buildings[i];
    m.makeScale(b.w, b.h, b.d);
    m.setPosition(b.x, 0, b.z);
    bodyMesh.setMatrixAt(i, m);
    const v = 0.75 + rng() * 0.5;
    bodyColor.copy(base).multiplyScalar(v);
    if (b.isLandmarkTower) bodyColor.set(0x18263e);
    bodyMesh.setColorAt(i, bodyColor);
  }
  bodyMesh.instanceMatrix.needsUpdate = true;
  if (bodyMesh.instanceColor) bodyMesh.instanceColor.needsUpdate = true;
  root.add(bodyMesh);

  // ---- windows ----
  const winSpecs: WindowSpec[] = [];
  for (const b of plan.buildings) buildingWindows(b, rng, winSpecs);

  const windowMeshes = new Map<string, THREE.InstancedMesh>();
  const m4 = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const pos = new THREE.Vector3();
  const scl = new THREE.Vector3();
  const wc = new THREE.Color();
  const rotY = [0, Math.PI, Math.PI / 2, -Math.PI / 2];

  for (const d of plan.districts) {
    const specs = winSpecs.filter((s) => s.district === d.id);
    const mat = new THREE.MeshBasicMaterial({ color: ZONE_FLOW[d.id]?.clone() ?? new THREE.Color(0xffffff) });
    const im = new THREE.InstancedMesh(winGeo, mat, Math.max(1, specs.length));
    let k = 0;
    for (const s of specs) {
      q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), rotY[s.face]);
      pos.set(s.x, s.y, s.z);
      scl.set(s.scale, s.scale, s.scale);
      m4.compose(pos, q, scl);
      im.setMatrixAt(k, m4);
      const dim = 0.55 + rng() * 0.45;
      wc.setRGB(dim, dim, dim);
      im.setColorAt(k, wc);
      k++;
    }
    im.count = k;
    im.instanceMatrix.needsUpdate = true;
    if (im.instanceColor) im.instanceColor.needsUpdate = true;
    windowMeshes.set(d.id, im);
    root.add(im);
  }

  return { root, bodyMesh, windowMeshes, buildingCount: n, windowCount: winSpecs.length };
}
