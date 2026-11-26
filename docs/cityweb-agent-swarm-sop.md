# CityWeb Agent Swarm SOP v1 — 并行 agent 开发波次作业法

> 溯源：CEO 令 2026-11-26「我看过很多短视频 agent并行开发城市的视频，去调研技术框架，落地使用」。
> 调研结论（GitHub 实查 2026-11-26）：该类视频的底层框架=**git worktree 隔离 + 每 agent 独立会话 + 派单 + 合并闸**（vibe-kanban 28.8k⭐ / ruflo 82.4k⭐ / claude-squad 8.9k⭐ / BMAD-METHOD 55.8k⭐ 全是此模式的封装）。GUI 编排器与本仓「零弹窗+S4U+静默」纪律冲突，不引入；本集团既有 prechange 工作树机制即同构正法，本 SOP 把它定型为城市线可复用波次。

## 一、角色

| 角色 | 承担 | 职责 |
|---|---|---|
| 指挥席（会话本体） | 本 SOP 执行者 | 拆泳道、建工作树、派单、合并、验证门、推送、清理 |
| 泳道 agent（后台子代理） | 每泳道 1 个 | 只在指定工作树内产模块，自验 tsc，自提交 |

## 二、波次五步（每次波次照抄）

1. **拆泳道**：把需求拆成 2-4 条**文件不相交**的泳道。铁律：agent 只产「新模块文件+可选 notes.md」，**禁止碰 main.ts 等共享接线文件**——接线永远归指挥席（这是零合并冲突的根）。
2. **建泳道工作树**：`python Tools/fleet/prechange.py --worktree city-<lane>`（FluxVerse 仓内）；依赖共享用 junction（`New-Item -ItemType Junction -Path <lane>\CityWeb\node_modules -Target _wt-<集成树>\CityWeb\node_modules`）——零重复安装。
3. **派单**：每泳道一个后台 subagent，prompt 必须自包含：工作树绝对路径、只读参考文件清单、**模块契约签名**（接口+构建函数，逐字精确）、行为规格、硬约束（只准新建哪些文件/禁碰他人/tsc 零错/commit 消息/报告字段）。
4. **合并闸（指挥席）**：泳道完成后在集成树（_wt-cityweb）逐泳道 `git checkout <lane-sha> -- <files>` 引入 → 接线 main.ts → `npx tsc --noEmit` → `node tools/build-static.mjs` → `python qa\smoke_v1.py`（file:// 实测+截图）→ 导演席审片。任一环红=当场打回该泳道（不连坐其他泳道）。
5. **收尾**：集成树 commit → `push origin HEAD:main` → 主树 `git merge --ff-only origin/main` → `git worktree remove _wt-city-* --force`（junction 先删）→ 交付地址给 CEO。

## 三、本仓专属红线（继承集团法条）

- **每轮改动前 prechange**；泳道树天然满足隔离要求。
- **S4U/零弹窗**：泳道 agent 的验证命令全部 CLI 内完成，禁 GUI。
- **诚实律**：agent 模块必须数据驱动（真实字段/真实事件），禁常开装饰动画；无数据=隐藏。
- **确定性律**：一切随机走 mulberry32 固定 seed——同数据同城市。
- **禁互踩**：泳道 agent 的工作树外路径一律只读；报告带 commit sha 供指挥席核对。

## 四、第一波实证（2026-11-26）

- 泳道 A `src/live/pedestrians.ts`（行人流=作息小时×城区活跃度投影）
- 泳道 B `src/live/weather.ts`（天气粒子=weather_kind 三态）
- 泳道 C `src/live/traffic.ts`（TRANSFER 光带=事件池化演出）
- 三 agent 并行完成→指挥席接线合并→tsc/build/smoke/审片→单 commit 上链。
