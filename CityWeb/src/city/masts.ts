import * as THREE from "three";
import type { CityPlan } from "./layout";
import { FLOW } from "../palette";

// MEDIA 城 信号塔阵 - signal masts with magenta beacon rings.

export interface MastsRig {
  root: THREE.Group;
  beaconMats: THREE.MeshBasicMaterial[];
}

export function buildMasts(plan: CityPlan): MastsRig {
  const root = new THREE.Group();
  const beaconMats: THREE.MeshBasicMaterial[] = [];

  const mastMat = new THREE.MeshStandardMaterial({ color: 0x141f33, roughness: 0.75, metalness: 0.3 });

  for (const m of plan.masts) {
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.9, m.h, 8), mastMat);
    pole.position.set(m.x, m.h / 2, m.z);
    pole.castShadow = true;
    root.add(pole);

    const beaconMat = new THREE.MeshBasicMaterial({ color: FLOW.traffic.clone().multiplyScalar(1.4) });
    const beacon = new THREE.Mesh(new THREE.TorusGeometry(1.5, 0.28, 8, 24), beaconMat);
    beacon.rotation.x = Math.PI / 2;
    beacon.position.set(m.x, m.h * 0.82, m.z);
    root.add(beacon);
    beaconMats.push(beaconMat);

    const tip = new THREE.Mesh(new THREE.SphereGeometry(0.7, 12, 10), beaconMat);
    tip.position.set(m.x, m.h, m.z);
    root.add(tip);
  }

  return { root, beaconMats };
}
