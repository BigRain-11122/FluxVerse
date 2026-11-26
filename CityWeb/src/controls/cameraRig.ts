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
    // minDistance 4: street level must reach 1.7m residents (30m floor
    // clamps the street tween back out - people stay dots).
    // maxDistance 3600: real-geography city is ~4km wide.
    this.controls.minDistance = 4;
    this.controls.maxDistance = 3600;
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
      // overview shifted +X so the Lujiazui supertall cluster (Shanghai
      // Tower/SWFC) stays in frame - it was cut at the right edge.
      { name: "L0 总览", pos: new THREE.Vector3(240, 1750, 2150), target: new THREE.Vector3(180, 90, 0) },
    ];
    for (const d of this.plan.districts) {
      const dir = new THREE.Vector3(d.cx, 0, d.cz).normalize();
      lv.push({
        name: `L1 ${d.name}`,
        pos: new THREE.Vector3(d.cx - dir.x * 640, 700, d.cz - dir.z * 640),
        target: new THREE.Vector3(d.cx, 90, d.cz),
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
    if (best >= 0 && bestD < 900) this.applyLevel(best + 1, true);
  }

  /// 2026-11-26 CEO「居民形象精细化可视化」：原有 L0(400m)/L1(120m) 两档，
  /// 1.7m 的居民在楼群里等于看不见（一拉近就钻楼）。这里单独给一个**街景档**
  /// （人眼高度 6.5m，距目标 26m 斜切），不进 levels() 数组——避免打乱既有的
  /// 点击聚焦索引（levels 里 district 的 i+1 映射）。
  applyStreet(world: THREE.Vector3, dist = 6.5, height = 1.95): void {
    this.fromPos.copy(this.camera.position);
    this.fromTarget.copy(this.controls.target);
    // 2026-11-26 实锚：原来用「世界原点→居民」当朝向，对城区另一侧的居民会
    // 把相机放进楼里（截图取证：满屏金色墙面）。改成**背向最近城区中心**取景：
    // 相机退到居民外侧（城区外圈），看向居民与背后的城区。
    let cx = 0, cz = 0, bestD = Infinity;
    for (const d of this.plan.districts) {
      const dd = Math.hypot(world.x - d.cx, world.z - d.cz);
      if (dd < bestD) { bestD = dd; cx = d.cx; cz = d.cz; }
    }
    let ox = world.x - cx, oz = world.z - cz;
    const len = Math.hypot(ox, oz) || 1;
    ox /= len; oz /= len;                 // 单位外法向（背离城区中心）
    this.toPos.set(world.x + ox * dist, height, world.z + oz * dist);
    this.toTarget.set(world.x, 1.8, world.z);
    this.tween = 0.0001;
    this.onLevelChange?.("L2 街景");
  }
}
