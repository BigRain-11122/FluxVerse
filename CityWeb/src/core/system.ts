/**
 * core/system.ts — 系统契约（架构 v2 的最小内核）
 *
 * 为什么要有它（2026-11-26 重构依据）：重构前 main.ts 里 11 个模块各用一种
 * update 签名（`update()` / `update(elapsed)` / `update(dt, elapsed)` /
 * `update(dt, elapsed, hour)`），谁先谁后靠书写顺序，想给慢系统降频只能加 if。
 * 结果：加一个系统就要动主循环，主循环越来越像上帝类。
 *
 * 契约只有三件事：**谁（id）、多快（hz）、按什么顺序（order）**。
 * 降频是内建能力，不是每个模块自己写计时器——这是"模拟带宽预算"的落点。
 */

export interface Frame {
  /** 本帧实际步长（秒），已按该系统的 hz 累计 */
  dt: number;
  /** 世界时间（秒），单调递增
   */
  elapsed: number;
  /** 城市小时（0-23 小数），来自昼夜模块 */
  hour: number;
  /** 渲染帧率（用于自适应降级，暂时只记录） */
  fps: number;
}

export type Layer = "world" | "sim" | "live" | "play" | "ui";

export interface System {
  id: string;
  layer: Layer;
  /**
   * 逻辑频率。0/省略 = 跟随渲染帧。
   * 建议：交互与相机 0（跟随渲染）；交通/行人 30；天气/昼夜 2；
   * 统计类（KPI/审计）0.2。降频必须在这里声明，不许模块内部偷偷 setTimeout。
   */
  hz?: number;
  /** 同层内的执行顺序，小的先跑。默认 100。 */
  order?: number;
  /** 是否只在玩家附近需要（供后续"按距离降级"使用，当前仅记录） */
  nearOnly?: boolean;
  update(frame: Frame): void;
  dispose?(): void;
}
