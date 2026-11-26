import * as THREE from "three";
import { mulberry32 } from "../util";
import { PLAZA_R } from "../city/layout";
import type { CityData, FleetMachine } from "../types";

// 街道机器人 = 机队 AI 具象 (DESIGN 器官表: 血细胞).
// Offline -> parked dim at the brain-ring garage; online -> slow patrol
// along the plaza ring. Position/status strictly mirrors fleet data.

export interface RobotsRig {
  root: THREE.Group;
  update: (dt: number, elapsed: number) => void;
}

interface RobotCar {
  group: THREE.Group;
  machine: FleetMachine;
  slotAngle: number;
  headMat: THREE.MeshBasicMaterial;
}

export function buildRobots(data: CityData): RobotsRig {
  const root = new THREE.Group();
  const rng = mulberry32(90210);
  const cars: RobotCar[] = [];

  const machines = data.fleet.filter((m) => m.cores > 0);
  const bodyGeo = new THREE.BoxGeometry(3.4, 1.3, 1.9);
  const cabinGeo = new THREE.BoxGeometry(1.6, 1.0, 1.5);

  machines.forEach((machine, i) => {
    const slotAngle = (i / Math.max(1, machines.length)) * Math.PI * 2 + 0.4;
    const group = new THREE.Group();

    const bodyColor = new THREE.Color().setHSL(0.6 + rng() * 0.08, 0.25, 0.32);
    const body = new THREE.Mesh(bodyGeo, new THREE.MeshStandardMaterial({ color: bodyColor, roughness: 0.55, metalness: 0.35 }));
    body.position.y = 0.85;
    body.castShadow = true;
    group.add(body);

    const headMat = new THREE.MeshBasicMaterial({ color: 0x223344 });
    const head = new THREE.Mesh(cabinGeo, headMat);
    head.position.set(-0.6, 1.95, 0);
    group.add(head);

    // Task badge light (small glowing dot on top - lights up when machine
    // holds a real current_task).
    const badgeMat = new THREE.MeshBasicMaterial({ color: 0x18242f });
    const badge = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.22, 0.5), badgeMat);
    badge.position.set(0.4, 1.62, 0);
    group.add(badge);

    const r = PLAZA_R + 6;
    group.position.set(Math.cos(slotAngle) * r, 0, Math.sin(slotAngle) * r);
    group.rotation.y = -slotAngle + Math.PI / 2;
    root.add(group);

    cars.push({ group, machine, slotAngle, headMat });
  });

  function update(dt: number, elapsed: number): void {
    for (const car of cars) {
      if (car.machine.online) {
        // patrol the plaza ring slowly
        const a = car.slotAngle + elapsed * 0.05;
        const r = PLAZA_R + 6;
        car.group.position.set(Math.cos(a) * r, 0, Math.sin(a) * r);
        car.group.rotation.y = -a + Math.PI / 2;
        car.headMat.color.setRGB(0.4, 0.95, 0.85); // cyan headlight when online
      } else {
        // parked: idle dim breathing
        const pulse = 0.10 + 0.05 * (0.5 + 0.5 * Math.sin(elapsed * 0.8 + car.slotAngle * 3));
        car.headMat.color.setRGB(pulse, pulse * 1.4, pulse * 1.6);
      }
    }
  }

  return { root, update };
}
