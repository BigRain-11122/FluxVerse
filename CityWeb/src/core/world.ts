/**
 * core/world.ts — World 容器 + 系统注册表（架构 v2）
 *
 * 两条不变量（重构的核心目的）：
 *  1. **主循环不认识任何具体模块**：main 只交一个 Frame，World 负责按 hz/order 派发。
 *  2. **降频是可声明属性**：hz=30 的系统在一帧 16ms 下被调用约 0.5 次/帧，
 *     World 累计 dt 保证它拿到的是"真实经过的时间"，不是被吃掉的时间。
 *
 * 不做的事：不接管渲染（composer.render 仍在 main）、不接管资源加载、
 * 不做 ECS（我们的实体量级用不到，先保住可读性）。
 */
import type { CityData } from "../types";
import type { CityPlan } from "../city/layout";
import type { Frame, Layer, System } from "./system";

export interface World {
  readonly plan: CityPlan;
  readonly data: CityData;
  add(sys: System): void;
  tick(frame: { dt: number; elapsed: number; hour: number; fps: number }): void;
  /** 按层统计本帧实际执行的系统数（调试/降级依据） */
  stats(): Record<string, number>;
  systems(): System[];
}

interface Slot {
  sys: System;
  acc: number;
}

export function createWorld(plan: CityPlan, data: CityData): World {
  const slots: Slot[] = [];
  const counts: Record<string, number> = {};

  const layerRank: Record<Layer, number> = { world: 0, sim: 1, live: 2, play: 3, ui: 4 };

  return {
    plan,
    data,
    add(sys) {
      if (slots.some((s) => s.sys.id === sys.id)) {
        throw new Error("system id duplicated: " + sys.id);
      }
      slots.push({ sys, acc: 0 });
      slots.sort((a, b) => {
        const la = layerRank[a.sys.layer], lb = layerRank[b.sys.layer];
        if (la !== lb) return la - lb;
        return (a.sys.order ?? 100) - (b.sys.order ?? 100);
      });
    },
    tick({ dt, elapsed, hour, fps }) {
      for (const k of Object.keys(counts)) counts[k] = 0;
      for (const s of slots) {
        const hz = s.sys.hz ?? 0;
        if (hz <= 0) {
          s.sys.update({ dt, elapsed, hour, fps });
          counts[s.sys.layer] = (counts[s.sys.layer] ?? 0) + 1;
          continue;
        }
        s.acc += dt;
        const step = 1 / hz;
        // 一帧最多补一次：避免卡顿后"追帧"把世界一口气推进（确定性优先）
        if (s.acc >= step) {
          const use = s.acc;
          s.acc = 0;
          s.sys.update({ dt: use, elapsed, hour, fps });
          counts[s.sys.layer] = (counts[s.sys.layer] ?? 0) + 1;
        }
      }
    },
    stats: () => ({ ...counts }),
    systems: () => slots.map((s) => s.sys),
  };
}
