# FluxVerse canonical 任务板

> 协议 `fluxverse-tasks/0.1` · 首建 2026-09-26 r173（集团全员无闲令 P-20260925-12 @FluxVerse 建板·72h 窗内·09-28 09:23 周巡任务面首判前）
> **权威分工（单一权威制 r52 不破）**：施工正典=`TECH.md` §九（实况/收口/阻塞唯一权威·每轮先读）；本板=canonical 任务面/审计入口——**薄指针面零叙述**（每行=ID+一句+指针+状态），随 §九 翻面同轮同步，禁在板内复述进度。
> 开单口径（P-20260925-12）：**自可执行+blocked 分列**；blocked-on 单列示、**禁充当在岗面**（禁待命·自主运转令 P-20260926-03：待命态=RED·P0 1h 修正）；常设律=每批收口保 backlog ≥1 自可执行开单。
> 机读口径（patrol-probe v1.1 [TASKS]）：两表 4 列——自可执行表状态列=`open`；blocked 表状态列=`blocked-on:*`（不计在岗）。已收口单即行移除（正典=§九 行·防双账）。

## 一、自可执行开单（在岗面）

| ID | 任务 | 指针/判据 | 状态 |
|---|---|---|---|
| T-FV-135 | AmbientWeather.TierForHour bootstrap 边界对齐（r217 新发现债：clock.ps1 相位边界已修 -lt 8/17/20（正典 §二 后写者新·r217）·引擎 bootstrap 兜底仍持旧界 -le 8/16/19——state 在位=零消费休眠路径·非现行病但正典一致性债） | 指针=TECH §九 r217 行债注+《硅基城市时间与节律正典》§二/§七.4 三处一致性律；施工=一行对齐+AmbientProof 纯核边界断言随改+单 pass 证明跑绿（编辑器预算轮） | open |
| T-FV-134 | 调研部周轮前沿扫描（research-dept-charter §3 节律律·常设节律锚）：每周日演化日窗内领一轮——web_fetch 定向直查 ≥1 主题（扫描面=城市孪生/2D 引擎/程序化生成/数字孪生可视化业务前沿）·产出=R- 件或 global-benchmarks 刷新行·hot=F- 行 24h 速报·零发现=台账观察位注记行 | 源=..\..\docs\research-dept-charter.md §一-3/§四（patrol 判据=调研部台账 >7 天无新增且无观察位注记=黄牌）；执行留痕=TECH §九 对应行；**首扫毕 2026-09-27 r219（Omniverse+Siemens 双源·基准面 v1.1 刷新·两 M 债核销）·下窗=2026-10-04 周日** | open |

## 二、blocked 面单列（禁充当在岗）

| ID | 事项 | blocked-on（外部依赖） | 状态 |
|---|---|---|---|
| T-FV-101 | P-16 MEDIA 城注册行 | media/BigStream 出现任一 html 面板 | blocked-on:BigStream |
| T-FV-102 | P-62③ residents 探针转消费端 | BigLife anchor-lines.jsonl 落盘 | blocked-on:BigLife |
| T-FV-103 | P-41 余六型引擎演出映射 | T2 否决窗至 2026-10-01/10-02 | blocked-on:机制窗 |
| T-FV-104 | LAB 三型发射端翻 emitting（孵化舱演出） | BigDomain Phase 1（待机律禁空转） | blocked-on:BigDomain |
| T-FV-105 | AA-034 节庆烟火接线 | 真实事件源（禁装饰动画律） | blocked-on:事件源 |
| T-FV-106 | RV/OR 城区居民身份池开池 | 城区落图 | blocked-on:城区落图 |
| T-FV-107 | P-27⑥ BGM 四档试听校准 | 人耳物理听感 | blocked-on:人耳 |
| T-FV-108 | P-45 直播推流线 | M2 判据过→P2 冻结解除 | blocked-on:M2 |
| T-FV-111 | pod/birth 接缝辉 4px 收紧 re-bake（r187⑤·r190 GATED 保留现态） | CEO 复验批 F-20260926-10 翻面点名 | blocked-on:CEO 复验 |
| T-FV-132 | P-20260926-05 时间层令余面=真互动三证复扫（时间证 world-state 面毕 r217·天气证待真实雨天〔雨涟漪/檐下/湿反光现役〕·节律证待 BigLife citizen-now）+四季色板微调切片（autumn 已机读透出 state.season·色轮基线重锚 churn 面） | BigLife citizen-now 导出面（09-29 同窗）+真实雨天窗+CEO 复验批（F-10/F-17·D-20260926-03 复验裁定前零动作）——数据腿毕正典=TECH §九 r217 行 | blocked-on:外部窗 |
| T-FV-130 | P-20260926-06 机队基地统一令迁移后本仓验收（DevLoop/Tick 任务注册+桌面 .lnk 指向逐线复验·r208⑤ 注记面） | 他窗迁移执行（窗 ≤2026-09-29 12:00·本仓 CWD 迁移风险面） | blocked-on:他窗迁移 |

## 三、翻面律

- 收口同轮同步：§九 行收口 → 本板对应行移除（正典在 §九）；新开单 → 自可执行表加行；blocked 解封 → 移回自可执行表。
- 每批收口自检：自可执行表 ≥1 行（无闲令常设律）；全空=违例即领 §九 新债或勘注收口类小步（r50/r51 先例）。
