# layout-report — 版式映射核对表+包路径盘点（Phase 0 白盒施工输入）

> 溯源：CEO 令 09-28「全面开工lowpoly…全量并行」地图线首件。**本件=A2 调研员中途死亡后主会话自 termination summary 回收代产**（诚实律：A2 实测读取=td-organic-data.txt 语义+48 包索引六包条目；ROAD/WATER 完整格点列表未转写——源件运行时直读，引用不复制律）。
> 消费方：白盒 EditorScript（job 19）+robocopy（job 18）。

## 一 结构锚对齐核对表（2D→3D）

| 项 | 2D 源（64×64 格） | 3D 映射（1 格=8m 工作假设） | 状态 |
|---|---|---|---|
| 定标 | 64 格 | 64×8=**512m——与初始城判据 1:1 吻合**（A2 实测发现） | 🟡 Phase 0 以 AD-022 路件实测宽锁定 |
| 脑环 | 中央广场 PLAZA 81 格（x19-29,y40-50） | 世界原点(0,0,0)=脑塔位·r≈40m 脑环广场 | 🟡 初锚方案（广场中心≈(24,45) 为锚） |
| 路网 | ROAD_COUNT 1031（有机对角带·2-4 格宽） | 8m 正交骨+短直段折线逼近（≤15°/8m） | ✓ 源数据在·脚本直读 |
| 水系 | WATER 565（对角大水带 NW→SE）+SAND 104 岸带 | 平面水带+岸线件 | ✓ 同上 |
| 桥 | BRIDGES 96 跨点 | AD-022 桥件族（白盒=桥板占位） | ✓ 同上 |
| 公园 | PARK 78 两片（x10-18,y51-58 / x35-41,y6-12） | AD-015 植被散布锚区 | ✓ 同上 |
| 树点 | TREES 53 | AD-015 树件点位 | ✓ 同上 |
| 三城 | （2D 无三城显式区划） | **canon 结构锚**：r=180m 120° 扇形·各区 100×100m | 🟡 方位待 DESIGN 对齐 |
| 取景点 | SHOT_PLAZA/STREET/BRIDGE | 相机判据帧候选机位直译 | ✓ |
| 出生点 | STARTS 8+PLAYER | Phase 2 居民流出生点位候选 | ✓ |

## 二 白盒脚本参数清单（job 19 施工面）

- 地面=512×512m 单平面·16×16 chunk 分区（Phase 0 白盒单色）；脑塔=原点白盒柱+emission 呼吸脉冲（OS_TICK 对账）；脑环=r40 圆盘；三城=三组 100×100m 白盒街区组（角度 0/120/240·🟡 待核）；外环=r240 边线；相机三档 L0 50°/320m·L1 55°/110m·L2 60°/24m（FOV 45）；判据帧=L0 全城+L1 脑环+L2 街景+SHOT_BRIDGE 桥位四帧+呼吸灯对账帧。
- 数据源=`Tools/city/td-organic-data.txt` 运行时直读（**禁硬编码格点**·映射公式=city-layout-data.json anchor_transform）。

## 三 6 包源路径盘点（robocopy 用·job 18）

**主源（推荐）=P3D_Spike 已进驻全 48 包**（本日主会话实测九大风格类目录在）：
`C:\Users\sjs20\Desktop\FluxGroup\gaming\MiniGame\projects\P3D_Spike\Assets\lowpoly\{风格类}\{AD-NNN 包目录}`

| 包 | 风格类 | 体量 | entries/prefab/fbx |
|---|---|---|---|
| AD-048 起始（白盒底座） | 00_通用底座 | 5MB | 158/58/70 |
| AD-022 城市（俯视街区·路面件+325 fbx） | 01_现代城市生活 | 15MB | 728/335/325 |
| AD-015 自然（植被地形） | 00_通用底座 | 61MB | 654/225/227 |
| AD-042 都市人物 | 01_现代城市生活 | 4MB | 52/19/1 |
| AD-010 粒子特效 | 07_特效与图标 | 8MB | 337/180/58 |
| AD-039 图标 | 07_特效与图标 | 17MB | 1080/520/520 |

- 副源=48 包主库 `Art Assets\lowpoly\{风格类}\{AD-NNN_类别码_描述_官方包}\{PolygonXXX}`（索引件载·物理根路径未直验⬜——robocopy 用主源即可）。
- robocopy 律：`.meta` 随行（GUID 稳定）；包目录整树拷入 `City3D\Assets\lowpoly\`；拷后以编辑器 refresh 收导入。

## 四 验证声明

- A2 实测读取 2 件（td-organic-data.txt 语义层+48 包索引六包条目）后死亡；本件数据=其 termination summary 回收（语义/计数可信）——ROAD 1031/WATER 565 完整格点未逐格核验（⬜：运行时脚本直读源件为准，无复制转写即无转写误差）。
- 1 格=8m 定标=工作假设（Phase 0 实测翻面）；三城方位=🟡 待 DESIGN 对齐。
