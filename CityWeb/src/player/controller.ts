/**
 * player/controller.ts — 第三人称可走切片（S1）
 *
 * 设计取舍（2026-11-26，与 cph4/city-foundation.md 的分层一致）：
 *  · **不引物理引擎**：城市是数据生成的（BuildingSpec 是轴对齐盒子），碰撞直接用
 *    AABB 列表做"分轴推出"即可。Rapier/WASM 会 +2MB，毁掉 818KB 的交付优势。
 *  · **玩家是第 N+1 位居民**：位置/朝向/动作写进同一条轨迹（trace），供 BigLife 侧
 *    在下一批 ingest，进入观察总线与年轮——所以玩家不是旁观者。
 *  · **零侵入**：默认关闭；按 P 或 ?play=1 才接管相机，原有浏览模式完全不变。
 *
 * 判据（可自动验收）：沿街走不掉地、撞墙被挡住、稳定 60fps、包体增量小。
 */
import * as THREE from "three";
import type { CityPlan } from "../city/layout";

export interface PlayerState {
  x: number;
  z: number;
  yaw: number;
  pitch: number;
  speed: number;
  on: boolean;
}

interface Rect {
  x0: number;
  x1: number;
  z0: number;
  z1: number;
}

export interface PlayerRig {
  update: (dt: number) => void;
  toggle: (on?: boolean) => void;
  isOn: () => boolean;
  state: () => PlayerState;
  trace: () => Array<[number, number, number]>;
  /** 只读测试口：某点是否在建筑体内（验收脚本用它断言"没穿墙"） */
  blockedAt: (x: number, z: number) => boolean;
}

const RADIUS = 0.38;
const EYE = 1.62;
const WALK = 3.1;
const RUN = 6.4;
const CAM_DIST = 4.4;
const CAM_HEIGHT = 2.05;

export function createPlayer(plan: CityPlan, camera: THREE.PerspectiveCamera, dom: HTMLElement): PlayerRig {
  // 碰撞体：建筑盒子（轴对齐），留出玩家半径
  const rects: Rect[] = plan.buildings.map((b) => ({
    x0: b.x - b.w / 2 - RADIUS,
    x1: b.x + b.w / 2 + RADIUS,
    z0: b.z - b.d / 2 - RADIUS,
    z1: b.z + b.d / 2 + RADIUS,
  }));

  const spawn = plan.districts[0] ?? { cx: 0, cz: 0 };
  const p = new THREE.Vector3(spawn.cx + 24, 0, spawn.cz + 24);
  let yaw = Math.PI;
  let pitch = -0.06;
  let on = false;
  const keys = new Set<string>();
  const samples: Array<[number, number, number]> = [];
  let sampleClock = 0;

  const blocked = (x: number, z: number): boolean => {
    for (let i = 0; i < rects.length; i++) {
      const r = rects[i];
      if (x > r.x0 && x < r.x1 && z > r.z0 && z < r.z1) return true;
    }
    return false;
  };

  // 分轴推出：先解 X 再解 Z，贴墙滑行而不是卡死
  const move = (dx: number, dz: number): void => {
    if (dx !== 0 && !blocked(p.x + dx, p.z)) p.x += dx;
    if (dz !== 0 && !blocked(p.x, p.z + dz)) p.z += dz;
  };

  const onKey = (e: KeyboardEvent, down: boolean): void => {
    if (!on) return;
    const k = e.key.toLowerCase();
    if ("wasd".includes(k) || k === "shift") {
      if (down) keys.add(k); else keys.delete(k);
      e.preventDefault();
    }
  };
  window.addEventListener("keydown", (e) => {
    if (e.key.toLowerCase() === "p" && !e.repeat) { toggle(); return; }
    onKey(e, true);
  });
  window.addEventListener("keyup", (e) => onKey(e, false));
  window.addEventListener("blur", () => keys.clear());
  dom.addEventListener("click", () => { if (on) dom.requestPointerLock?.(); });
  window.addEventListener("mousemove", (e) => {
    if (!on || document.pointerLockElement !== dom) return;
    yaw -= e.movementX * 0.0026;
    pitch = Math.max(-0.55, Math.min(0.5, pitch - e.movementY * 0.0022));
  });

  const toggle = (want?: boolean): void => {
    on = typeof want === "boolean" ? want : !on;
    if (!on) {
      keys.clear();
      if (document.pointerLockElement === dom) document.exitPointerLock?.();
    }
    (window as unknown as { __PLAYER__?: unknown }).__PLAYER__ = api;
  };

  const state = (): PlayerState => ({
    x: Math.round(p.x * 100) / 100, z: Math.round(p.z * 100) / 100,
    yaw: Math.round(yaw * 1000) / 1000, pitch: Math.round(pitch * 1000) / 1000,
    speed: keys.has("shift") ? RUN : WALK, on,
  });

  const update = (dt: number): void => {
    if (!on) return;
    const sp = (keys.has("shift") ? RUN : WALK) * dt;
    let fwd = 0, side = 0;
    if (keys.has("w")) fwd += 1;
    if (keys.has("s")) fwd -= 1;
    if (keys.has("a")) side -= 1;
    if (keys.has("d")) side += 1;
    if (fwd || side) {
      const len = Math.hypot(fwd, side) || 1;
      const sin = Math.sin(yaw), cos = Math.cos(yaw);
      // 前向 = (-sin, -cos)，右向 = (cos, -sin)
      const dx = ((-sin) * fwd + cos * side) / len * sp;
      const dz = ((-cos) * fwd - sin * side) / len * sp;
      move(dx, dz);
    }
    // 轨迹采样（0.5s 一次）：给 BigLife 侧 ingest，玩家才算"在场"
    sampleClock += dt;
    if (sampleClock >= 0.5) {
      sampleClock = 0;
      samples.push([Math.round(p.x * 10) / 10, Math.round(p.z * 10) / 10, Date.now()]);
      if (samples.length > 2000) samples.shift();
    }
    // 第三人称跟随
    const cx = p.x + Math.sin(yaw) * CAM_DIST;
    const cz = p.z + Math.cos(yaw) * CAM_DIST;
    camera.position.set(cx, EYE + CAM_HEIGHT + Math.sin(pitch) * CAM_DIST * 0.6, cz);
    camera.lookAt(p.x, EYE + 0.35, p.z);
  };

  const api: PlayerRig = { update, toggle, isOn: () => on, state, trace: () => samples.slice(),
                           blockedAt: (x, z) => blocked(x, z) };
  return api;
}
