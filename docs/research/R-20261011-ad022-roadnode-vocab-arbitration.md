# R-20261011 AD-022 路口词汇仲裁输入——街层贴接法 vs 节点件法（R2 路网生成器词汇表裁定前置）

> **〔r339 勘正指针〕**本件 §1 表「Patch 1.0×1.02」为 raw fbx 口径；prefab 子节点 scale=(2.198/0.290/3.477) 应用后**有效足迹=2.20×3.55m·y 包络=−0.275..−0.135（沉面）**——分类结论（非满格件·≤5m 格件谱位不变）稳·数值面以 R-20261011-ad022-marking-occupation-syntax.md §2 为准。原文零删改（历史保全律）。

- **触发**：explore#30 领走（r338）；同时刷新 explore#12 P3 48h 节律死线（末笔 r337 → r338 成件=新末笔·**下次死线 10-13 21:3x 前一笔 P3 产出**）。
- **口径**：纯纸面+只读探针（prefab guid 引用计数+FBX 顶点包络+装配回执对源）；零导入零下载零写 City3D（防双头 r236 定谳合规·交互窗在飞件未触）。
- **探针**：`.codely-cli/tmp/ad022_path_vert_probe.py`（Path 四件顶点包络·r337 vert_dump 探针族直改）+guid 计数直读（Select-String `*.prefab.meta`→Demo.unity 引用）；gitignored·只读。
- **扫描轮**：DevLoop r338（2026-10-11 21:3x）。
- **对象**：R2 路网生成器节点词汇决策面——Kenney 式专用节点件法 vs vendor 贴接法（r337 §5 立题）。

## 0. 前件勘正（r337 §5 两处·本件主发现之一）

1. **「我方 R0 装配（CityAssembled·Kenney 件）」勘正=AD-022 Path 族件**——铁证=City3D-staging/assemble-report.md `path_pick` 四行逐字：plaza_tiles 77 件全部指 `AD-022_.../Prefabs/Environments/SM_Env_Path_{Straight,Corner,T,Junction}_01.prefab`，零 Kenney 件（selection_law=全部件库内挑选·AD 包族）。
2. **「AD-022 vendor 无专用节点件」勘正=kit 级不成立**——Path 族四件（Straight/Corner/T/Junction）即 kit 自带节点件族；正解=**Road 族（街层）无节点件 + kit 节点件词汇仅存在于步道尺度且 demo 零在用**（r333 Environments 域已定「Path 族谱系级全缺席=冗余谱」·本件 guid 计数 0 引用+文本 0 命中双证再确认）。
3. 由勘正推论：r337「两 kit 语法根本分野（Kenney 有·vendor 无）」框架塌缩——**同一 AD-022 kit 内两法并存**（Road 直道族 vs Path 节点族），分野真实轴=「街层 vs 步道层」×「在库 vs 在用」。

## 1. kit 词汇两族实锚（尺度分野=仲裁第一输入）

| 族 | 件数 | 尺度（顶点包络实测·r335 §底表同源） | 节点件 | demo 在用 |
|---|---|---|---|---|
| Road 族（街层） | 16 件 | 标准路片 13 件全等 **5.000×5.000m** 角枢轴（r335）+ParkingLines 10×5+Patch 1.0×1.02 | **零**（r337 §4） | 744 件·77.6% 直道主导 |
| Path 族（步道层） | 4 件 | Straight **2.5×5.0**（2.5m 宽半格条=步道宽正身 r335）/Corner 3.75×3.75/T 5.0×3.75/**Junction 5.0×5.0=四臂 X 满格**·全族 h=0.17m 微抬 | **四拓扑全**（含 kit 唯一 X 件） | **0**（guid 0+文本 0·r333 冗余谱定谳同向） |

**几何判语**：Path 节点件宽 2.5/3.75m vs 街面 tile 5.0m——节点件法若用于街层需 ×2 缩放（破坏 1grid=5m CEO 定标+纹理密度）=**结构性错配**；反之 Road 直道法在步道层同错配（5m 路面当步道=断面双型 r335 律 7 直接矛盾：步道带宽 2.5m 正身）。**两法不可互换·各安其层=几何定谳**。

## 2. 三方实操先例对照（仲裁第二输入=权威证据）

| 实操方 | 层 | 方法 | 规模 | 权威面 |
|---|---|---|---|---|
| vendor demo（作者自选） | 街层 | **贴接法**：直道 5m 正交对接+T 分解律（X=0）+Crossing/标线标记装饰 | 路族 744 件·Crossing 43（~5.8%） | **kit 内有节点件而作者街层弃用**=设计意图实锚（最强证据：作者面对两法选了贴接） |
| vendor demo | 步行层 | Sidewalk 族铺装（1204+件 5.0 格）·Path 族零用 | — | 作者步行层也弃用 Path（三弃：街层/步行层皆不用） |
| 我方 R0（CityAssembled） | 街层 | **贴接法**：Road_01 直道+Lines/YellowLines 标线 | 1031 件 | r324 已判「贴近 vendor 正法」 |
| 我方 R0 | plaza 层 | **节点件法**：Path junction 53/T 15/corner 6/straight 3 | 77 件 | 我方自选（kit 内合法）·**无 vendor demo 先例**=视觉验收面在 R0 呈报史+CEO 复验 |
| Kenney City Kit（导入窗外·r321） | 街层 | **节点件法**：road-{straight,corner,split,intersection} 1×1 格（×5 定标后） | 官方 sample 城 | 唯一街尺度节点件在库候选·三判据门（r321 §4 风格/定标/合批）后有效 |

**我方 R0 标记密度校准注记（新发现债）**：R0 crossings=418/1031（**40.5%**）vs vendor 43/744（**5.8%**）——R0 装配器把 Crossing_01 当路面纹理变体撒布（road_pick 直道对=Road_01+Crossing_01），远超 vendor 标记语法（r337 §2：T 口格位 22/43+路段中 17/43）。两读法=①R0 网格语法（矩形网格 X/T 格位中心 tile=我方语法·无 vendor 权威）②校准缺口（R2 应回归 vendor 语法带）——**留给 R2 生成器裁定窗决策·本件只立证不计罪**。

## 3. 仲裁输入（三案对照·裁定本体归 R2 生成器词汇表窗）

| 面 | 案 A=街层贴接法（vendor 正法） | 案 B=街层节点件法 | 案 C=Kenney 专用件法 |
|---|---|---|---|
| 几何 | 直道 5m 正交对接·半径 0·转角=对角位邻件 | **kit 内无街尺度节点件**（Path 2.5m 错配）=本案在 AD-022 内不可行 | road-intersection/split/corner（×5 定标后 5m 格） |
| demo 权威 | 744 件规模实证·作者自选 | 零 | 零（我仓未导入） |
| 我方实操 | R0 1031 件已走 | R0 plaza 层 77 件（仅步道层可行） | 无 |
| 标记族兼容 | Crossing/Lines/Arrow 语法原生成立 | 步道纹理件吃车道标记=语义冲突 | Kenney 自带路标族（r321 §2 Roads 2.1） |
| X 口表达 | T 并置（vendor 原生）或 X 格位中心 tile（R0 网格语法） | 不可行 | road-intersection 件原生 |
| 结论 | **街层正身** | **街层判负**（尺度错配·仅步道层合法） | 导入窗合法候选（本件不禁·风格闸后） |

**建议（分层正解·供 R2 词汇表窗裁定）**：街层=贴接法（vendor 权威+R0 双证）·步道/plaza 层=Path 节点件法（R0 已实操维持）·X 口=预注册径选择（默认 vendor T 并置；保 R0 网格语法=grid-X 带声明；Kenney intersection=导入窗第三径）·Path_Junction=步道层 X 专用件保留。

## 4. R2 生成器词汇表裁定判据（≤3 问·机械可验·预注册）

1. **尺度对齐**：街层词汇候选件 bbox=5.0±0.1m@scale 1.0（Path 族 2.5/3.75 不过=结构性排除；Kenney 件须过 ×5 定标闸=r321 判据②）。
2. **拓扑覆盖**：生成器单测枚举 {straight, corner, T, X} 四拓扑逐项断言件映射存在；X 映射须声明语法族（T 并置 / X 格位中心 tile / Kenney 件——三径任一·预注册留痕）。
3. **标记语法带**：Crossing/标线摆位落在预注册带内——vendor-T 带（T 口格位+路段中·占比 ~5-10%）或 grid-X 带（R0 网格语法·占比随网格率）·跨带=设计 override 留痕（R0 40.5% 实测=带外·裁定窗须显式认领或改带）。

## 5. 消费与导出（应用表）

- **落点①任务单输入**：City3D R2 路网生成器词汇表（交互窗 R2 里程碑面）——本件=裁定输入非裁定本体；判据三条随词汇表窗预注册。
- **落点②判负留痕**：节点件法用于街层（尺度错配）判负；「我方装配=Kenney 件」表述判负（r337 §5 勘正·前件头部已加指针行）。
- **落点③勘误指针**：R-20261011-ad022-crossing-node-placement-census.md 头部加勘正指针（历史保全·原文零删改）。
- explore#12 死线滚动（末笔=r338）；新条候补=标记族占格语法细拆（Lines/Arrow/YellowLines/Patch/ParkingLines demo 摆位谱=r337 §3 标记族邻接谱续件·R2 标记层输入）。
