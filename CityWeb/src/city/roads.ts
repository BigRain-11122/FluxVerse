import * as THREE from "three";
import type { CityPlan } from "./layout";
import { PLAZA_R, OUTER_RING_R } from "./layout";
import { FLOW } from "../palette";

// Roads: dark asphalt strips + glowing flow lines (三条神经主干道),
// brain-ring plaza disc + glow ring, outer perception ring + pylons.
// All glow parts use MeshBasicMaterial (self-lit, bloom picks them up).

export interface RoadsRig {
  root: THREE.Group;
  flowLines: Map<string, THREE.Mesh>; // district -> glow line mesh
  districtRings: THREE.Mesh[]; // per-district boundary rings
  plazaRing: THREE.Mesh;
}

export function buildRoads(plan: CityPlan): RoadsRig {
  const root = new THREE.Group();
  const flowLines = new Map<string, THREE.Mesh>();

  const asphaltMat = new THREE.MeshStandardMaterial({ color: 0x0a0f1a, roughness: 0.94, metalness: 0.0 });

  for (const ar of plan.arteries) {
    const x0 = ar.x0, z0 = ar.z0, x1 = ar.x1, z1 = ar.z1;
    const len = Math.hypot(x1 - x0, z1 - z0);
    const ang = Math.atan2(z1 - z0, x1 - x0);

    // Asphalt strip.
    const road = new THREE.Mesh(new THREE.BoxGeometry(len, 0.12, 11), asphaltMat);
    road.position.set((x0 + x1) / 2, 0.06, (z0 + z1) / 2);
    road.rotation.y = -ang;
    road.receiveShadow = true;
    root.add(road);

    // Center flow line (district flow color).
    const flowColor = FLOW.data.clone();
    if (ar.district === "quant") flowColor.copy(FLOW.capital);
    if (ar.district === "media") flowColor.copy(FLOW.traffic);
    const line = new THREE.Mesh(
      new THREE.BoxGeometry(len, 0.16, 1.8),
      new THREE.MeshBasicMaterial({ color: flowColor }),
    );
    line.position.set((x0 + x1) / 2, 0.24, (z0 + z1) / 2);
    line.rotation.y = -ang;
    root.add(line);
    flowLines.set(ar.district, line);
  }

  // District boundary rings - every district keeps a visible footprint even
  // when dormant/far (fixes the "far city reads as void" composition bug).
  const districtRings: THREE.Mesh[] = [];
  for (const d of plan.districts) {
    const col = FLOW.data.clone();
    if (d.id === "quant") col.copy(FLOW.capital);
    if (d.id === "media") col.copy(FLOW.traffic);
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(78, 0.4, 8, 96),
      new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.9 }),
    );
    ring.rotation.x = Math.PI / 2;
    ring.position.set(d.cx, 0.35, d.cz);
    root.add(ring);
    districtRings.push(ring);
  }

  // Plaza disc + brain ring glow.
  const plaza = new THREE.Mesh(
    new THREE.CylinderGeometry(PLAZA_R, PLAZA_R, 0.25, 64),
    new THREE.MeshStandardMaterial({ color: 0x0c1322, roughness: 0.9 }),
  );
  plaza.position.y = 0.1;
  plaza.receiveShadow = true;
  root.add(plaza);

  const plazaRing = new THREE.Mesh(
    new THREE.TorusGeometry(PLAZA_R - 2, 0.22, 10, 96),
    new THREE.MeshBasicMaterial({ color: FLOW.data.clone() }),
  );
  plazaRing.rotation.x = Math.PI / 2;
  plazaRing.position.y = 0.3;
  root.add(plazaRing);

  // Outer perception ring (thin) + pylons.
  const outerRing = new THREE.Mesh(
    new THREE.TorusGeometry(OUTER_RING_R, 0.5, 8, 160),
    new THREE.MeshBasicMaterial({ color: 0x1c3350 }),
  );
  outerRing.rotation.x = Math.PI / 2;
  outerRing.position.y = 0.4;
  root.add(outerRing);

  const pylonGeo = new THREE.BoxGeometry(1.6, 7, 1.6);
  pylonGeo.translate(0, 3.5, 0);
  const pylonMat = new THREE.MeshStandardMaterial({ color: 0x0e1626, roughness: 0.9 });
  const beaconMat = new THREE.MeshBasicMaterial({ color: 0x2c5480 });
  for (const node of plan.ringNodes) {
    const p = new THREE.Mesh(pylonGeo, pylonMat);
    p.position.set(node.x, 0, node.z);
    p.castShadow = true;
    root.add(p);
    const beacon = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.9, 0.9), beaconMat);
    beacon.position.set(node.x, 7.6, node.z);
    root.add(beacon);
  }

  return { root, flowLines, districtRings, plazaRing };
}
