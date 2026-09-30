# 硅基城市·功能城市定谳 v1.0 —— 数据仿真层 × 几何生成层四层架构

> 溯源=CEO 令 2026-09-30 三连：①调研令「效果很糟糕，进度也很慢…你打算如何在引擎进行大规模的地形编辑和城市建设？还有灯光，物件，角色，植被…先去调研」②功能城市框架令（对标都市天际线/Trafficity/CityFlow：**城市=数据仿真层（功能逻辑）+3D 几何生成层（外观）；AI 只做规划+校验，不直接生成 Mesh；Unity 用地块/路网/Agent 实现城市真运转**）③「你自己决定，我只要结果。减少成本，提高效率，本地化能力体系建设」＝T1 代决授权（本件即执法）。

## 〇 成熟方案调研实锤（2026-09-30·诚实律全查证）

| 作品/工具 | 实锤 | 可抄点 |
|---|---|---|
| Cities: Skylines 1（2015·CO） | Unity；自建路网图寻路（**全程不用 NavMesh**）；统计聚合+按需实例化扛百万人口 | 需求分层；路网图寻路；服务车辆池化 |
| Cities: Skylines 2（2023·CO） | Unity；仿真系统=**ECS+Burst Job**（modding 文档直证 TrafficFlowSystem·**C 级源码级共识·A 级官方表述待证〔R-20260930-cs-02〕**）；多核寻路/重路由/换道；网络模型=节点+边（贝塞尔）+车道+组合截面 | 网络数据模型 |
| SimCity 2013 GlassBox | 建筑=规则引擎（产耗资源）+路径运 agent+分区（GDC 2012·功能城市圣杯）；开源复刻=**federicodangelo/MultiAgentSimulation（纯 C#·Unity·直接移植）**+OpenGlassBox（C++） | 最该抄的源码（与 512m 城同量级） |
| Trafficity | 实锤=Onramp Games indie·2026-11 上市（聚焦交通·网格自由路网） | 形态参考，无源码 |
| CityFlow | 实锤=**C++/Python 强化学习交通仿真器**（Apache-2.0·1021★）非 Unity 件 | roadnet/flow 蓝图 JSON schema 思想 |
| Unity 侧同构 | DOTS Traffic City（资产）/Junxions（indie·junxions.com） | DOTS 路线可行性印证 |
| 付费插件核验 | Urban Architect Pro/Standard、Road Constructor、Gaia Pro 均在售付费件 | **零采购**（范式自研+48 包建筑生成·库=唯一源律；Gaia 与禁 Terrain 定谳冲突） |

**CEO 四坑全数成立并已立法执法**：①Mesh 与业务数据绑死 ②NavMesh 做城市交通 ③一次性生成全城 ④AI 直接生成几何。

## 一 T1 代决三项（CEO 授权「你自己决定」·2026-09-30）

| # | 决 | 定谳 | 理由 |
|---|---|---|---|
| 1 | 仿真深度 | **A 档物理投影层先行**（车道图+通勤 agent+服务覆盖+拥堵统计）；B 档经营闭环（供需/断供/降级废弃）后置待 CEO 令 | 单真相安全：居民生活事实=BigLife 唯一源不破；物理域 BigLife 本无仿真零冲突 |
| 2 | 采购 | **零采购**：范式自研=本地化能力体系；源码参考=CityFlow（Apache-2.0）+MultiAgentSimulation（装前核验闸） | 减成本+付费件生成的楼≠Synty 风（买来还得重做） |
| 3 | 首坊 | **GAME 城商业坊=block 3**（90×100m·325 格·R0 数据） | 通勤+商业客流+服务覆盖三环最丰富 |

## 二 四层架构（CEO 框架 × 我方正典融合）

| 层 | 落法 | 现状 |
|---|---|---|
| 层1 AI 规划 | R0 版式数据升维→**地块实体 schema**；AI 输出 JSON 蓝图+机检校验（连通/覆盖/城建律） | R0 已全绿收口（97a8f59）；契约件=`citysim-blueprint.json`（Tools/city/citysim-from-r0.py 生成） |
| 层2 市政仿真 | **CitySimCore**（纯 C#·无 DOTS·热点后升 Job）：车道图（节点=路格·件型分级 cost/容量）+A* 拥堵感知寻路+通勤 agent（引力模型）+服务覆盖+拥堵统计 | v0.1 本批实装 |
| 层3 几何生成 | CitySimDriver 白盒可视化→R2+ **CityAssembler 升格 parcel-driven**（地块功能×繁荣度→选型卡+模块壳 kit） | v0.1 白盒；v0.2 接建筑生成 |
| 层4 反馈闭环 | 改路→重路由（最小闭环）→仿真指标→AI 重规划 diff→定向重建（落 OS 循环/值守轮） | SetClosed 实装；自动化 v0.3 |

**双真相防线（A 档执法细则）**：生活/社会事实（居民身份/作息/行为）=BigLife 唯一源（投影律不变）；物理市政域（交通流/服务覆盖/管网）=引擎仿真层求解；通勤需求源 v0.1=地块配额公式，v0.2=BigLife census/behavior 空间锚点（重构总案 §四派单已在册）。

## 三 判据帧系登记

- **S_ 系**=sim 功能白盒帧（`City3D-staging/shots5/`·JPEG q88·与 A_/B_ 系并行）：S_L0_morning／S_L1_gameblock／S_L2_congestion／S_L0_coverage／S_L0_reroute／S_L2_reroute_after
- 断言五条（闸3 机检·fail-loud·`citysim-selfcheck.md`）：A1 路网单连通／A2 地块门位全通／A3 基线全量通勤零滞留／A4 seed 确定性／A5 封桥重路由零踩封闭格
- **判据=供需连锁可验**：早高峰拥堵热力可见＋封桥后重路由生效＋覆盖统计如实。

## 四 施工序

| 版 | 内容 | 判据 |
|---|---|---|
| v0.1（本批） | 白盒功能闭环：CitySimCore+CitySimLab+断言×5+S_ 帧×6 | 五断言全绿+帧组过目检 |
| v0.2 | BigLife 数据面接线（需求源换真数据）+parcel-driven 建筑生成接 R2 模块壳 | census↔agent 对账 |
| v0.3 | 反馈闭环自动化（值守轮）+全城铺开+WebGL 预算闸3 | 拥堵→重规划 diff 闭环帧 |

- **观感线并行不互卡**：示范街坊穿衣线（Polybrush+官方 demo 抄方）另批装备。
- **性能路线（V1.1 修正·R-20260930-cs-05 Unity 官方源）**：512m 城 agent 百级=普通 C# 足够（CSL1 先例）；**WebGL 单 C# 线程**（官方原句：System.Threading 不支持·须单线程跑）→**Job 并行升档在 WebGL 主路径无收益·升档第一优先=算法降频/事件驱动**（CullingGroup 屏外降频=官方通道）；ECS 仅「agent 万级+非 WebGL 目标」双条件立项（CSL2 先例）——仿真与渲染已解耦，升档不翻工。
- v0.1 全量 agent 可见（164 就业人口·白盒演示级）；城市扩容后再启用 CSL 式统计聚合+按需实例化。

## 五 归口与派单

- 本批=**FluxVerse 主体**施工（CitySim 核心+Lab+帧+本件）；
- v0.2 仿真层深化=**@CPH4 Labs**（技术底座·新增派单面）；数据面=**@BigLife**（census/behavior 空间锚点·重构总案派单行已有）；
- 归档：`citysim-blueprint.json`=层1→层2 契约件（审计副本 City3D-staging/）；源码参考件（CityFlow/MultiAgentSimulation）引入时过核验闸。
## 六 CS 程度验收判据 V1（CEO 令 2026-09-30「你必须做到都市天际线的那种程度」=质量门·机器可验·R0-R6 每阶段过对应 G 项才推进）

- **G1 结构**：城建律机检八项+CS 15 律机检子集全绿（贴线 100%/进深 32m 帽/密度分轨壳映射/街坊配额对账/服务覆盖走路网 Dijkstra）〔R-20260930-cs-01〕
- **G2 活性**：通勤零滞留+拥堵热力+昼夜双态窗灯+夜生活聚集+交通脉搏——判据帧对账（09:00/22:00 双帧+事件帧·时刻表驱动非智能体）〔R-20260930-cs-03〕
- **G3 生活（超越 CS 面）**：试点街坊门洞可通机检+三锚点居民流+室内光池帧
- **G4 可读**：L0 身份帧生人可读（一核一环三城一网·五闸判据）
- **G5 性能**：WebGL 30fps 底线（**每阶段验收前置·不「先发布后优化」**〔R-20260930-cs-02 律 10〕）

- 更新记录：V1.0 立档（2026-09-30·调研实锤+T1 代决三项+四层架构+S_ 帧系+施工序）；V1.1（CEO 令 09-30 CS 程度令+并行开工令：§六 判据 V1 落档+性能路线 WebGL 修正+CSL2 证据分级注记〔cs-01/02/03/05 四件增量接线〕）。
