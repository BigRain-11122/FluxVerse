import * as THREE from "three";
import { clamp } from "../util";

// First-person street walker (CEO order 2026-11-26 "人能进入"): toggle() drops
// the camera to eye height and takes ownership of it, WASD walks the ground
// plane at city scale, mouse drag looks around, and a pedestrian circle
// pushed out of AABB colliders keeps the walker out of buildings - except
// inside enterable hubs, whose shell colliders are exempted so a player who
// stepped through the door gap is not shoved back out.

export interface WalkCollider { cx: number; cz: number; hw: number; hd: number; }

/** Structural twin of city/enterable's EnterableSpec, kept local so the
 *  controls layer never imports from the city layer. */
export type EnterableSpecLike = { cx: number; cz: number; hw: number; hd: number };

const EYE_H = 1.8;        // fixed eye height (m) - no vertical movement, by design
const PED_R = 1.4;        // pedestrian collision circle radius (m)
const WALK_SPEED = 22;    // m/s - city blocks are 100s of meters at this scale
const RUN_SPEED = 55;     // m/s with Shift held
const BOUND_R = 2400;     // hard keep-inside radius around the city core (m)
const PITCH_LIMIT = 1.35; // rad, just short of straight up / straight down
const LOOK_SENS = 0.0022; // rad per dragged pixel
const MAX_STEP = 1.0;     // m per collision sub-step: no wall tunneling on a 100ms stall frame

const KEY_FORWARD = "KeyW";
const KEY_BACK = "KeyS";
const KEY_RIGHT = "KeyD";
const KEY_LEFT = "KeyA";
const KEY_SPRINT: ReadonlyArray<string> = ["ShiftLeft", "ShiftRight"];

export class WalkController {
  private camera: THREE.PerspectiveCamera;
  private dom: HTMLElement;
  private colliders: WalkCollider[] = [];
  private enterables: EnterableSpecLike[] = [];
  private on = false;
  private yaw = 0;
  private pitch = 0;
  private px = 0;
  private pz = 0;
  private keys = new Set<string>();
  private dragging = false;
  private lastX = 0;
  private lastY = 0;
  // full camera pose snapshot: position + quaternion is everything the
  // camera needs to resume its previous view (an orbit rig's own target is
  // the rig's business, not the walker's)
  private savedPos = new THREE.Vector3();
  private savedQuat = new THREE.Quaternion();

  constructor(camera: THREE.PerspectiveCamera, dom: HTMLElement) {
    this.camera = camera;
    this.dom = dom;
    // listeners live for the page lifetime, but input is consumed only
    // while enabled ("键盘监听 window，enabled 才消费" - same gate for mouse)
    this.dom.addEventListener("mousedown", (ev) => this.onMouseDown(ev));
    window.addEventListener("mousemove", (ev) => this.onMouseMove(ev));
    window.addEventListener("mouseup", () => { this.dragging = false; });
    window.addEventListener("keydown", (ev) => this.onKeyDown(ev));
    window.addEventListener("keyup", (ev) => this.keys.delete(ev.code));
    // lost focus mid-walk => phantom held keys; clear the whole table
    window.addEventListener("blur", () => { this.keys.clear(); this.dragging = false; });
  }

  setColliders(list: WalkCollider[]): void {
    this.colliders = list.slice();
  }

  setEnterable(list: EnterableSpecLike[]): void {
    this.enterables = list.slice();
  }

  toggle(): boolean {
    this.on = !this.on;
    this.keys.clear();
    this.dragging = false;
    if (this.on) {
      // record the current camera pose; restored on the next toggle so the
      // orbit view resumes exactly where it left off
      this.savedPos.copy(this.camera.position);
      this.savedQuat.copy(this.camera.quaternion);
      // keep x/z, drop the camera to eye height; inherit the current heading
      this.px = this.camera.position.x;
      this.pz = this.camera.position.z;
      const dir = new THREE.Vector3();
      this.camera.getWorldDirection(dir);
      this.yaw = Math.atan2(-dir.x, -dir.z);
      this.pitch = clamp(Math.asin(clamp(dir.y, -1, 1)), -PITCH_LIMIT, PITCH_LIMIT);
      this.camera.rotation.order = "YXZ";
      this.camera.position.set(this.px, EYE_H, this.pz);
      this.applyLook();
    } else {
      // restore the recorded pose so the outside camera continues untouched
      this.camera.position.copy(this.savedPos);
      this.camera.quaternion.copy(this.savedQuat);
    }
    return this.on;
  }

  enabled(): boolean {
    return this.on;
  }

  update(dt: number): boolean {
    if (!this.on) return false;

    // ---- movement: WASD on the yaw plane (pitch never affects travel) ----
    const fx = -Math.sin(this.yaw), fz = -Math.cos(this.yaw); // camera forward on XZ
    const rx = Math.cos(this.yaw), rz = -Math.sin(this.yaw);  // camera right on XZ
    let mx = 0, mz = 0;
    if (this.keys.has(KEY_FORWARD)) { mx += fx; mz += fz; }
    if (this.keys.has(KEY_BACK)) { mx -= fx; mz -= fz; }
    if (this.keys.has(KEY_RIGHT)) { mx += rx; mz += rz; }
    if (this.keys.has(KEY_LEFT)) { mx -= rx; mz -= rz; }
    const len = Math.hypot(mx, mz);
    if (len > 1e-6) {
      const sprint = KEY_SPRINT.some((k) => this.keys.has(k));
      const speed = sprint ? RUN_SPEED : WALK_SPEED;
      const dx = (mx / len) * speed * dt;
      const dz = (mz / len) * speed * dt;
      // sub-step long displacements (55 m/s on a stuttered 100ms frame moves
      // 5.5m): resolve collision at <= 1m chunks so the circle can never
      // jump clean over a thin shell wall
      const steps = Math.max(1, Math.ceil(Math.hypot(dx, dz) / MAX_STEP));
      for (let s = 0; s < steps; s++) {
        this.px += dx / steps;
        this.pz += dz / steps;
        this.resolveCollisions();
      }
    } else {
      this.resolveCollisions();
    }

    // ---- hard boundary: the playable city is a 2400m disc ----
    const dist = Math.hypot(this.px, this.pz);
    if (dist > BOUND_R) {
      this.px = (this.px / dist) * BOUND_R;
      this.pz = (this.pz / dist) * BOUND_R;
    }

    this.camera.position.set(this.px, EYE_H, this.pz);
    this.applyLook();
    return true;
  }

  private applyLook(): void {
    // YXZ euler: yaw around Y, pitch around X - the standard FPS order
    this.camera.rotation.set(this.pitch, this.yaw, 0);
  }

  private onMouseDown(ev: MouseEvent): void {
    if (!this.on) return;
    this.dragging = true;
    this.lastX = ev.clientX;
    this.lastY = ev.clientY;
    // walking mode owns the pointer: kill text-selection drags
    ev.preventDefault();
  }

  private onMouseMove(ev: MouseEvent): void {
    if (!this.on || !this.dragging) return;
    const dx = ev.clientX - this.lastX;
    const dy = ev.clientY - this.lastY;
    this.lastX = ev.clientX;
    this.lastY = ev.clientY;
    this.yaw -= dx * LOOK_SENS;
    this.pitch = clamp(this.pitch - dy * LOOK_SENS, -PITCH_LIMIT, PITCH_LIMIT);
  }

  private onKeyDown(ev: KeyboardEvent): void {
    // record only the codes we actually consume, and only while enabled
    if (!this.on) return;
    if (ev.code === KEY_FORWARD || ev.code === KEY_BACK ||
        ev.code === KEY_LEFT || ev.code === KEY_RIGHT ||
        KEY_SPRINT.includes(ev.code)) {
      this.keys.add(ev.code);
    }
  }

  /** Circle-vs-AABB per-axis push-out, X axis first then Z, two passes:
   *  the first correction can land the circle inside a neighbouring
   *  collider, the second settles it (standard iterative resolution). */
  private resolveCollisions(): void {
    // reverse exemption: while standing inside a hub interior, colliders
    // whose AABB overlaps that interior are skipped - the player who walked
    // in through the door gap must not be pushed back out by the hall shell
    let hub: EnterableSpecLike | null = null;
    for (const h of this.enterables) {
      if (Math.abs(this.px - h.cx) <= h.hw && Math.abs(this.pz - h.cz) <= h.hd) {
        hub = h;
        break;
      }
    }

    for (let pass = 0; pass < 2; pass++) {
      for (const c of this.colliders) {
        if (hub && this.overlapsHub(c, hub)) continue;
        // --- X axis first ---
        if (this.pz + PED_R > c.cz - c.hd && this.pz - PED_R < c.cz + c.hd) {
          if (this.px < c.cx && this.px + PED_R > c.cx - c.hw) this.px = c.cx - c.hw - PED_R;
          else if (this.px >= c.cx && this.px - PED_R < c.cx + c.hw) this.px = c.cx + c.hw + PED_R;
        }
        // --- then Z, re-tested against the corrected X ---
        if (this.px + PED_R > c.cx - c.hw && this.px - PED_R < c.cx + c.hw) {
          if (this.pz < c.cz && this.pz + PED_R > c.cz - c.hd) this.pz = c.cz - c.hd - PED_R;
          else if (this.pz >= c.cz && this.pz - PED_R < c.cz + c.hd) this.pz = c.cz + c.hd + PED_R;
        }
      }
    }
  }

  private overlapsHub(c: WalkCollider, h: EnterableSpecLike): boolean {
    return Math.abs(c.cx - h.cx) <= c.hw + h.hw && Math.abs(c.cz - h.cz) <= c.hd + h.hd;
  }
}
