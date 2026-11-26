import * as THREE from "three";
import { FLOW } from "../palette";

// 超体脑塔 (DESIGN.md §四): five layers bottom-up ——
// 塔基编年史 / 中枢枢纽 / 脑深层发光核心 / 大脑皮层晶片 / 塔顶 CEO 指令光点.

export interface BrainTowerRig {
  root: THREE.Group;
  coreMat: THREE.MeshBasicMaterial; // pulsing blue core
  crownMat: THREE.MeshBasicMaterial; // CEO white light point
  cortexGroup: THREE.Group; // rotating crystal slabs
  beamMat: THREE.MeshBasicMaterial; // CEO order beam (opacity animated)
  beam: THREE.Mesh;
  crown: THREE.Mesh;
}

export function buildBrainTower(): BrainTowerRig {
  const root = new THREE.Group();

  // 塔基 - chronicle archive base.
  const base = new THREE.Mesh(
    new THREE.CylinderGeometry(13, 15, 7, 8),
    new THREE.MeshStandardMaterial({ color: 0x121e33, roughness: 0.85, metalness: 0.15 }),
  );
  base.position.y = 3.5;
  base.castShadow = true;
  root.add(base);

  // 中枢枢纽 - hub node.
  const hub = new THREE.Mesh(
    new THREE.CylinderGeometry(9, 11, 13, 8),
    new THREE.MeshStandardMaterial({ color: 0x16263f, roughness: 0.8, metalness: 0.2 }),
  );
  hub.position.y = 13.5;
  hub.castShadow = true;
  root.add(hub);

  // 脑深层 - glowing core sphere.
  const coreMat = new THREE.MeshBasicMaterial({ color: FLOW.brain.clone().multiplyScalar(1.6) });
  const core = new THREE.Mesh(new THREE.IcosahedronGeometry(5.2, 1), coreMat);
  core.position.y = 26.5;
  root.add(core);

  // Cortex ring shafts - three tapering segments so the tower reads as a
  // tower silhouette, not a blob.
  const shaftMat = new THREE.MeshStandardMaterial({ color: 0x1a2c4a, roughness: 0.7, metalness: 0.3 });
  const segments: Array<[number, number, number, number]> = [
    [5.6, 4.8, 10, 32.5],  // bottom radius, top radius, height, y-center
    [4.8, 4.0, 10, 42.5],
    [4.0, 3.1, 10, 52.5],
  ];
  for (const [r0, r1, h, y] of segments) {
    const seg = new THREE.Mesh(new THREE.CylinderGeometry(r1, r0, h, 8), shaftMat);
    seg.position.y = y;
    seg.castShadow = true;
    root.add(seg);
  }

  // Glowing belt rings between shaft segments - vertical lantern structure
  // so the tower silhouette reads from L0 overview.
  const beltMat = new THREE.MeshBasicMaterial({ color: FLOW.brain.clone().multiplyScalar(1.3) });
  for (const y of [32.5, 42.5, 52.5]) {
    const belt = new THREE.Mesh(new THREE.TorusGeometry(4.9, 0.34, 8, 32), beltMat);
    belt.rotation.x = Math.PI / 2;
    belt.position.y = y;
    root.add(belt);
  }

  // 大脑皮层 - three rotating crystal slabs (orbit the upper shaft).
  const cortexGroup = new THREE.Group();
  cortexGroup.position.y = 46;
  const cortexMat = new THREE.MeshStandardMaterial({
    color: 0x2a4a72, roughness: 0.35, metalness: 0.5,
    emissive: FLOW.data, emissiveIntensity: 0.55,
  });
  for (let i = 0; i < 3; i++) {
    const slab = new THREE.Mesh(new THREE.BoxGeometry(10.5, 14, 1.2), cortexMat);
    slab.position.set(Math.cos((i / 3) * Math.PI * 2) * 6.6, 0, Math.sin((i / 3) * Math.PI * 2) * 6.6);
    slab.rotation.y = (i / 3) * Math.PI * 2;
    cortexGroup.add(slab);
  }
  root.add(cortexGroup);

  // 塔顶 - CEO light point.
  const crownMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(1.15, 1.15, 1.25) });
  const crown = new THREE.Mesh(new THREE.SphereGeometry(2.0, 18, 14), crownMat);
  crown.position.y = 61.5;
  root.add(crown);

  // CEO order beam (hidden until an order lands).
  const beamMat = new THREE.MeshBasicMaterial({
    color: FLOW.ceo, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false,
  });
  const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 2.4, 300, 12, 1, true), beamMat);
  beam.position.y = 160;
  root.add(beam);

  return { root, coreMat, crownMat, cortexGroup, beamMat, beam, crown };
}
