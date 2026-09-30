# FluxVerse — 超体宇宙城（FLUX 元宙）

> 定位：**城即集团**——集团经营的实时游戏化镜像：AI 行为实时剧场（CEO 第一需求令原话：「AI所有的行为都要在集团总控里面能看到实时的游戏化的表现」；禁装饰性动画）。
> 概念：**超体宇宙集团是顶层大脑，在城市中心**（CEO 概念令）——超体脑塔居市中心·三城环绕·机器人在街道巡行=机队 AI 劳动。设定全文 = `DESIGN.md`（设定书）。
> 承建：硅基城市=集团直属独立载体（O-20260929-031·城市建设属集团·Biggame=受托承建施工位）·技术 = **3D polygon 定谳**（2026-09-29 O-20260929-006「硅基城市抛弃2D像素风格，转型3D polygon」·URP 原生·现役工程=`City3D/`）。〔勘正存档 2026-09-30〕旧「团结引擎 1.10.3 原生 2D」硬约束（CEO 原话「我说了 全部是2D 不碰3D」·2026-09-23）已随 2026-09-28 3D 解禁令（ledger P-2026-09-28-12·明文废止该硬约束）废止——2D 线（`City/`）存史对照不再新产。
> 开线：2026-09-23 CEO 点名 **FluxVerse**，开线五步由集团总控会话走毕——**产品内容在本仓推进，勿在别处重复建设**。
> 架构：感知器独立只读扫描（world-state.json + world-events.jsonl，只读不破跨仓写禁令）→ 引擎侧只读轮询渲染（每 ~10s）；零服务器零预算（MiniGame 红线）；协议草案 = `docs/design/fluxverse-protocol-draft.md`。
> 治理：FluxGroup governance.md §2 登记簿；BRAND §8 locked；对集团层反馈 = 本仓根 HQ-FEEDBACK.md；门禁链同源（X026Gate / EncodingGate / NameCheck 随建随接）。
> 调研面：**FluxVerse·城市前沿调研部**（P-2026-09-26-18 建制·复用正名零新建——产线=`docs/research/` R- 件面制〔每件末尾结论应用表·落点四选一·正典 cph4/research-protocol.md〕+统计面板=`docs/global-benchmarks.md`〔司级 7 天周期律〕+节律=周轮前沿扫描〔任务板 T-FV-134 常设锚〕+基准面刷新轮+hot 24h 速报 F- 行）——消费方 = DESIGN 设定 / TECH 基建 / TECH §九 任务板 / 集团总规收口（U231 块面件 R-20260926-city-block-*）。
> 技能面：`Tools/skills/`（P-2026-09-26-01 集团技能动员令·在册=fluxverse-city-sandbox 布设沙盒门族〔r170〕+fluxverse-bake-pipeline GDI+ 自焙管线〔r171·安装副本 .codely-cli/skills/ gitignored·建队切片全闭〕；会话内置 codely-guide/skill-creator/tuanjie-cli 即用）。

## 状态（r54 勘正·工作项实况唯一权威 = `TECH.md` §九·此处只载门面事实）

> 〔2026-09-30 勘正·O-20260929-006〕美术主线已定谳 **3D polygon**——下列城市实况均为 **2D 线存史档**（不再新产·2026-09-28 解禁 P-2026-09-28-12→09-29 转型 O-20260929-006）；3D 现役正典族=`docs/lowpoly3d-*.md`（九件）+`docs/design-v4-3d-draft.md`+技能 `lowpoly-city-3d`（总控）与四专家；3D 工程实况=`City3D/`（工作项现役台账=重构总案 `docs/lowpoly3d-city-rebuild-plan.md` R0-R6）。

- **M0 全闭**：设定书 v3.1·风格已定案=1 号高清赛博像素（CEO 三裁决 2026-09-23·`DESIGN.md` §九）·概念稿双档 `docs/design/m0-city-concept-{dusk,night}.png`
- **M1 全判据已证（2026-09-24 r26）**：`City/` 团结引擎原生 2D 工程在仓（四档环境色轮+天气粒子+事件路由器+内景窗+相机双档+UI 壳）·M1.5 现实链接感知侧落地（clock/weather/fx/market/github_events 五探针）
- **观城台（停役注记 2026-09-24·P-59③）**：CityWatch 面板停役为观测入口（CEO 唯一观测窗令——唯一指定窗=MiniGame《硅基生命元宇宙.html》）·数据面保留维护（人口普查/居民之声照常产出）；`watch/` 桌面快捷方式安装器已改道直开唯一观测窗（P-26 分发批改道）·引擎城建设本体照建不停（P0 不变）
- **remote**：origin 已推通（`git@github.com:BigRain-11122/FluxVerse.git`·CEO 私库物理件已到位——2026-09-25 起值守轮每班 push 同步城市进度·origin/main=HEAD·r200 勘注）

## 读序

1. 本 README
2. `DESIGN.md` —— 超体宇宙城设定书（概念 / 城市 / 行为映射 / 视觉律 / 里程碑）
3. `TECH.md` —— 技术基建白皮书（探针架构/协议宪法/验证门禁/§九 backlog 唯一权威）
4. `docs/design/fluxverse-styles.html` —— 六风格探索稿（历史探索件·定案=1 号高清赛博像素）
5. `docs/design/fluxverse-protocol-draft.md` —— 数据协议草案 v0.1
