import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import type { CityPlan } from "../city/layout";
import { smoothstep, clamp } from "../util";

// Camera: L0 overview <-> L1 district focus (keys 0/1/2/3 or click a
// district). Free orbit always available; smooth 1.4s tween between levels.

export interface CameraLevel {
  name: string;
  pos: THREE.Vector3;
  target: THREE.Vector3;
}

export class CameraRig {
  controls: OrbitControls;
  camera: THREE.PerspectiveCamera;
  private tween = 0; // 0..1, 0 = idle
  private fromPos = new THREE.Vector3();
  private fromTarget = new THREE.Vector3();
  private toPos = new THREE.Vector3();
  private toTarget = new THREE.Vector3();
  private plan: CityPlan;
  currentLevel = "L0";
  onLevelChange: ((label: string) => void) | null = null;

  constructor(camera: THREE.PerspectiveCamera, dom: HTMLElement, plan: CityPlan) {
    this.camera = camera;
    this.plan = plan;
    this.controls = new OrbitControls(camera, dom);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.minDistance = 30;
    this.controls.maxDistance = 900;
    this.controls.maxPolarAngle = Math.PI * 0.485;
    this.controls.target.set(0, 12, 0);

    // restore persisted camera (auto-reload friendliness)
    try {
      const saved = localStorage.getItem("cityweb.cam");
      if (saved) {
        const s = JSON.parse(saved);
        if (s.p && s.t) {
          camera.position.fromArray(s.p);
          this.controls.target.fromArray(s.t);
        }
      } else {
        this.applyLevel(0, false);
      }
    } catch {
      this.applyLevel(0, false);
    }
  }

  levels(): CameraLevel[] {
    const lv: CameraLevel[] = [
      { name: "L0 总览", pos: new THREE.Vector3(0, 400, 430), target: new THREE.Vector3(0, 10, 0) },
    ];
    for (const d of this.plan.districts) {
      const dir = new THREE.Vector3(d.cx, 0, d.cz).normalize();
      lv.push({
        name: `L1 ${d.name}`,
        pos: new THREE.Vector3(d.cx - dir.x * 60, 120, d.cz - dir.z * 60),
        target: new THREE.Vector3(d.cx, 22, d.cz),
      });
    }
    return lv;
  }

  applyLevel(index: number, tween: boolean): void {
    const lv = this.levels();
    const clamped = clamp(index, 0, lv.length - 1);
    const level = lv[clamped];
    this.currentLevel = clamped === 0 ? "L0" : `L1·${this.plan.districts[clamped - 1].name}`;
    this.onLevelChange?.(this.currentLevel);
    if (!tween) {
      this.camera.position.copy(level.pos);
      this.controls.target.copy(level.target);
      this.controls.update();
      return;
    }
    this.fromPos.copy(this.camera.position);
    this.fromTarget.copy(this.controls.target);
    this.toPos.copy(level.pos);
    this.toTarget.copy(level.target);
    this.tween = 0.0001;
  }

  update(dt: number): void {
    if (this.tween > 0) {
      this.tween = Math.min(1, this.tween + dt / 1.4);
      const s = smoothstep(this.tween);
      this.camera.position.lerpVectors(this.fromPos, this.toPos, s);
      this.controls.target.lerpVectors(this.fromTarget, this.toTarget, s);
      if (this.tween >= 1) this.tween = 0;
    }
    this.controls.update();
  }

  persist(): void {
    try {
      localStorage.setItem(
        "cityweb.cam",
        JSON.stringify({ p: this.camera.position.toArray(), t: this.controls.target.toArray() }),
      );
    } catch { /* ignore */ }
  }

  focusDistrictAt(world: THREE.Vector3): void {
    // click focus: nearest district
    let best = -1, bestD = Infinity;
    this.plan.districts.forEach((d, i) => {
      const dist = Math.hypot(world.x - d.cx, world.z - d.cz);
      if (dist < bestD) { bestD = dist; best = i; }
    });
    if (best >= 0 && bestD < 220) this.applyLevel(best + 1, true);
  }
}
