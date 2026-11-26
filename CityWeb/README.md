# CityWeb — 硅基城市 three.js 网面

> CEO 令 2026-11-26「硅基城市 按照之前的构思，用 three.js 的框架，拉齐环境和工具，好好调研后，开始生产，把以前的城市干掉不用了」。
> 本工程=硅基城市的 three.js 渲染面。旧 Unity `City3D/` 与 2D `City/` 已废弃（git 历史可考古）；数据面（perceptor/tick/world）原样继承——城市是同一具超体，换了身体。

## 现役交付（双击即开，零服务器）

```
CityWeb/dist/index.html   <- CEO 观赏入口（file:// 直接打开）
CityWeb/dist/city.js      <- esbuild IIFE 打包（含 three.js，本地文件引用）
CityWeb/dist/city-data.js <- 每轮 tick 数据导出（window.CITY_DATA sidecar）
```

- 数据来源：`world/world-state.json` + `world-public/city-snapshot.json`（verify 门禁后的晋升面），由 `tools/export-city-data.ps1` 白名单投影为 `city-data.js`（直承 MiniGame 硅基生命元宇宙 data.js 模式——file:// 友好、无 CORS、无服务器）。
- 页面每 10 分钟自动整页重载取新数据（相机位置 localStorage 保持），与 FluxVerseTick 10 分钟节奏同拍。
- 无 `city-data.js` 时自动降级演示数据并打 DEMO 徽（假数据永不冒充实况）。

## 开发

```
npm install
npm run dev          # Vite 热更新（127.0.0.1:5183）
npm run build        # esbuild IIFE -> dist/city.js（静态交付件）
npm run export-data  # 手动跑一次数据导出（平时由计划任务跑）
```

## 架构（一屏）

| 模块 | 职责 |
|---|---|
| `src/city/layout.ts` | 一核一环三城一网版式（确定性 seed=20260923，每次重载同城市） |
| `src/city/buildings.ts` | 城市建筑 InstancedMesh 主体 + 分区自发光窗阵（MeshBasicMaterial×分区，日夜/活跃度调制） |
| `src/city/brainTower.ts` | 超体脑塔五层（塔基/中枢/发光核心/皮层晶片/CEO 光点）+ 令脉冲光束 |
| `src/city/roads.ts` | 三条神经主干道（数据青/资金金/流量品红五色律）+ 脑环广场 + 外环感知网 |
| `src/city/robots.ts` | 街道机器人=机队具象（offline 停靠微光/online 巡行） |
| `src/live/daynight.ts` | 真实北京时间 24h 光照曲线（clock 探针同源）驱动天色/雾/阳光/窗灯/星光 |
| `src/live/messengers.ts` | 神经活：事件→演出严格一一对应（COMMIT=光信使入脑塔 / CEO_ORDER=白脉冲 / OS_TICK=呼吸） |
| `src/live/dust.ts` | L0 居民在场宏观投影（Points，密度=真实人口×时辰） |
| `src/ui/hud.ts` | 观测窗 HUD（硅基生命元宇宙.html 同视觉语系） |

## 诚实边界（v1）

- 事件演出=载入时回放最近 42 条真实事件（HUD 标注「真实事件回放」+原始时间戳）；会话内新事件需等 10 分钟重载（file:// 无 fetch）。
- 居民光尘=宏观密度投影，非个体模拟（万人≠全显，L1 行人流/L2 跟拍为后续 Phase）。
- K 线屏动画为后续 Phase。

## 路线定谳（CEO 令 2026-11-26「走轻量化路线」）

- **轻量化=正身**：程序化几何 + InstancedMesh + 共享材质，禁接外部模型资产（Synty/GLB/云端生成一律不入）——体积与加载预算优先于精细度。
- 旧模型库已封存：账面=`archive/City3D-staging/`（含 SEAL.md 封存单与件名账），本体=P3D_Spike lowpoly 主树原地冻结；解封唯一条件=CEO 明令。
