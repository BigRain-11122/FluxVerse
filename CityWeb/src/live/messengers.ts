import * as THREE from "three";
import type { CityPlan } from "../city/layout";
import { ZONE_FLOW } from "../palette";
import type { CityEvent } from "../types";
import type { BrainTowerRig } from "../city/brainTower";
import type { DayNight } from "./daynight";

// 神经活 (aliveness plan §2.2): every performance maps to one REAL event
// from the world-events tail (replayed from load with real timestamps
// shown in the HUD ticker). No decorative animation:
//   COMMIT/GAME_STAGE/GITHUB_EVENT/... zone event -> light messenger flies
//     from the district to the brain tower (信息回流大脑).
//   CEO_ORDER / DECISION_* -> tower crown white flash + vertical beam.
//   OS_TICK_START/DONE -> city breathing pulse (windows envelope).

interface Dot {
  mesh: THREE.Mesh;
  active: boolean;
  t0: number;
  dur: number;
  from: THREE.Vector3;
  ctrl: THREE.Vector3;
  to: THREE.Vector3;
}

export interface MessengerHooks {
  onEvent?: (e: CityEvent, atSec: number) => void;
}

export class Messengers {
  private dots: Dot[] = [];
  private queue: Array<{ e: CityEvent; at: number }> = [];
  private plan: CityPlan;
  private tower: BrainTowerRig;
  private daynight: DayNight;
  private crownPulse = 0;
  private beamT0 = -999;
  hooks: MessengerHooks = {};

  constructor(scene: THREE.Scene, plan: CityPlan, tower: BrainTowerRig, daynight: DayNight, events: CityEvent[]) {
    this.plan = plan;
    this.tower = tower;
    this.daynight = daynight;
    this.tower.beamMat.userData.t0 = -999;

    const geo = new THREE.SphereGeometry(4.2, 10, 8);
    for (let i = 0; i < 18; i++) {
      const mat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.visible = false;
      scene.add(mesh);
      this.dots.push({
        mesh, active: false, t0: 0, dur: 8,
        from: new THREE.Vector3(), ctrl: new THREE.Vector3(), to: new THREE.Vector3(),
      });
    }

    // Schedule the real event tail as a labeled replay (oldest first).
    const tail = events.slice(-42);
    tail.forEach((e, i) => {
      this.queue.push({ e, at: 2.0 + i * 1.85 });
    });
  }

  private spawn(zoneId: string | undefined, elapsed: number): void {
    const dot = this.dots.find((d) => !d.active);
    if (!dot) return;
    const zone = zoneId ?? "governance";
    let from = this.tower.root.position.clone();
    const d = this.plan.districts.find((dd) => dd.id === zone);
    if (d) from = new THREE.Vector3(d.cx, 30, d.cz);
    const to = this.tower.root.position.clone();
    to.y += 150; // crown height at brain-tower scale
    const ctrl = from.clone().lerp(to, 0.5);
    ctrl.y = Math.max(from.y, to.y) + 160;
    dot.active = true;
    dot.t0 = elapsed;
    dot.dur = 8.5;
    dot.from.copy(from);
    dot.ctrl.copy(ctrl);
    dot.to.copy(to);
    const col = ZONE_FLOW[zone] ?? ZONE_FLOW.governance;
    (dot.mesh.material as THREE.MeshBasicMaterial).color.copy(col).multiplyScalar(1.7);
    dot.mesh.visible = true;
  }

  private ceoPulse(elapsed: number): void {
    this.crownPulse = Math.min(1.4, this.crownPulse + 1.0);
    this.beamT0 = elapsed;
  }

  update(elapsed: number): void {
    // Due events.
    while (this.queue.length > 0 && this.queue[0].at <= elapsed) {
      const item = this.queue.shift()!;
      const e = item.e;
      this.hooks.onEvent?.(e, elapsed);
      if (e.type === "CEO_ORDER" || e.type === "DECISION_MADE" || e.type === "DECISION_OVERRULED") {
        this.ceoPulse(elapsed);
      } else if (e.type === "OS_TICK_START" || e.type === "OS_TICK_DONE") {
        this.daynight.breathBoost = Math.min(0.35, this.daynight.breathBoost + 0.22);
      } else if (e.type === "TRANSFER") {
        // TRANSFER plays as a street-level light band (traffic.ts) via the
        // onEvent hook, not as a flying dot - one event, one performance.
      } else {
        this.spawn(e.zone, elapsed);
      }
    }

    // Messenger dots.
    const p = new THREE.Vector3();
    for (const dot of this.dots) {
      if (!dot.active) continue;
      const t = (elapsed - dot.t0) / dot.dur;
      if (t >= 1) {
        dot.active = false;
        dot.mesh.visible = false;
        this.crownPulse = Math.min(0.9, this.crownPulse + 0.25); // arrival blip
        continue;
      }
      const s = t * t * (3 - 2 * t);
      const a = dot.from, b = dot.ctrl, c = dot.to;
      p.set(
        (1 - s) * (1 - s) * a.x + 2 * (1 - s) * s * b.x + s * s * c.x,
        (1 - s) * (1 - s) * a.y + 2 * (1 - s) * s * b.y + s * s * c.y,
        (1 - s) * (1 - s) * a.z + 2 * (1 - s) * s * b.z + s * s * c.z,
      );
      dot.mesh.position.copy(p);
    }

    // Beam + crown + core dynamics.
    const beamAge = elapsed - this.beamT0;
    this.tower.beamMat.opacity = beamAge < 2.4 ? Math.max(0, 1 - beamAge / 2.4) * 0.55 : 0;
    const cp = this.crownPulse;
    this.tower.crownMat.color.setRGB(1.15 + cp * 1.1, 1.15 + cp * 1.1, 1.25 + cp * 1.1);
    this.crownPulse = Math.max(0, this.crownPulse - 0.02);
    const breathe = 0.5 + 0.5 * Math.sin(elapsed * 1.4);
    this.tower.coreMat.color.setRGB(0.38 + 0.1 * breathe, 0.65 + 0.14 * breathe, 1.0 + 0.22 * breathe);
    this.tower.cortexGroup.rotation.y = elapsed * 0.12;
  }
}
