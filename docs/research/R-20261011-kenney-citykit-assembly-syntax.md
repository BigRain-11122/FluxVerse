# R-20261011 Kenney City Kit 四件族拼装语法拆解（City3D R2 街区扩展选型前置）

- **触发**：explore#13 领走（r320 派生件·导入前纸面对照）；同时刷新 explore#12 P3 48h 节律死线（末笔 r320 → 本件 r321 成件=新末笔·下次死线 10-13 轮）。
- **口径**：纯纸面零下载（不取 zip 不导入）；证据=Kenney 官方 Starter-Kit-City-Builder 仓（KenneyNL/Starter-Kit-City-Builder·Godot 4.6·代码 MIT/资产 CC0）+ kenney.nl/OGA/itch 三源详情页 + 本仓 City3D AD-022 件名谱实勘。
- **扫描轮**：DevLoop r321（2026-10-11 18:3x）。

## 1. 官方拼装语法（权威实锚=官方 Starter Kit 源码）

官方城市建造模板用 City Kit 族件实拼，其代码/场景文件给出拼装语法的机器级定义：

| 语法要素 | 官方实锚（builder.gd / main.tscn 原文） | 语义 |
|---|---|---|
| **网格** | `cell_size = Vector3(1, 1, 1)` + `cell_center_x/y/z = false` | **1×1 单位整数格·角对齐**（非中心对齐） |
| **放置吸附** | `Vector3(round(world_position.x), 0, round(world_position.z))` | 世界坐标 round 到整数 → 一件占恰一格 |
| **旋转** | `rotate_y(deg_to_rad(90))` + `get_orthogonal_index_from_basis` | **90° 正交四向**（无自由角度） |
| **垂直** | 放置层恒 y=0；预览件 `position.y += 0.25` | **平铺单层城**（无垂直堆叠语法） |
| **建筑覆盖** | building-small-a~d / building-garage 全部单格件 | **整楼=1 格**（无楼层分件） |
| **贴图** | 全家共用单张 `Textures/colormap.png`（10KB 图集） | **单材质单贴图面**（合批/包体极友好） |

官方件名谱（models/ 13 件=官方选定的最小拼装集）：
- 路族 5 型：`road-straight` / `road-corner` / `road-split`(T) / `road-intersection`(十字) / `road-straight-lightposts`（直道+灯杆复合变体）；
- 地块族 5 型：`pavement` / `pavement-fountain` / `grass` / `grass-trees` / `grass-trees-tall`；
- 建筑族 5 型：`building-small-a~d` ×4 + `building-garage`。

**路网拓扑完备性**：straight/corner/T/十字四拓扑即封全部平面路网形态——官方用 4+1 型即拼出整城（sample map 在仓）。

## 2. 四件族对照表（kenney.nl 现值·全 CC0·含变体贴图）

| 件族 | 版本史 | 件数 | 内容 | 官方兼容声明（原文） |
|---|---|---|---|---|
| **City Kit (Roads)** | 1.0(2021)→2.0 优化扩容→**2.1 路标+红绿灯** | **90** | 路面/护栏/高速/灯杆/施工栏/路标/红绿灯 | 基件——其余三族皆声明与它兼容 |
| **City Kit (Commercial)** | 1.0(2021)→2.0 全重制→2.1 修 skyscraper E | **50** | 商业楼/Skyscraper/雨棚/楼件/招牌 | "buildings **compatible with the previously released City Kit (Roads)**" |
| **City Kit (Suburban)** | 1.0(2020)→2.0 全重制 | **40** | 住宅/围栏/树/车道 | 同上（"fences, trees and driveways"） |
| **City Kit (Industrial)** | 1.0(**2025 新件**)→2.0 光伏/风能+更多 | **40** | 厂房/仓库/新能源 | 同上（OGA 2.0 包 5Mb·35+ objects） |

- **跨件族语法统一**=三建筑族各自官方声明兼容 Roads 基件网格 → **全族共享同一 1 单位格拼装语法**（四件可同城混拼，Kenney 官方口径）。
- 旧版口径差记录：itch 侧 Roads v1.1=65+ 件/2.3MB、Suburban v1=35+ 件（poly.pizza bundle=2022 v1 时代件名谱 Low Building/Low Wide/Skyscraper/Small/Large Building）——**引用件名/件数一律以 kenney.nl v2.x 现值为准**，防混版。
- Commercial v2.0 全重制后件名谱未公开列出（官方 demo 用 building-small 系命名）——导入窗以包内实名为准。

## 3. 与 City3D 现行底座（AD-022 CityPack）适配性对照

现行城市实况（City3D-staging/official-baseline.md 在案）：R1 城=**AD-022 vendor demo 整场景直用**（root_objects=4329·SM_Bld_/SM_Env_ 件族）；City3D/Assets/lowpoly 与 P3D spike 同源 AD 包族。

| 对照面 | Kenney City Kit 族 | AD-022（Synty 式 PolygonCity 克隆·件名谱本仓实勘） | 拼装兼容判读 |
|---|---|---|---|
| 路网拓扑词汇 | road-{straight,corner,split,intersection} | SM_Env_Path_{Straight,Corner,T,Junction} + SM_Env_Road_{01~03,Arrow,Bare,Crossing,Lines,Median} | **同构**（4 拓扑词汇一一对应·概念零迁移成本） |
| 建筑拼装语法 | 整楼单格·无垂直堆叠 | SM_Bld_Apartment_{01~03}×{Corner,Door,Roof,Stack,Stairs} 分件=**底/中/顶垂直分层生长** | **异构**（Kenney=乐高整砖·AD=分层积木；Kenney 楼不可拆层·AD 楼可逐层长高） |
| 贴图/材质面 | 单 colormap.png 图集（全家一材质） | 分件多材质（Synty 图集风） | Kenney 合批面占优（drawcall/包体友好） |
| 美术风格 | 平涂块状 lowpoly（chunky） | Synty 面状 lowpoly（faceted） | **同框混拼=风格断裂风险**（须帧级闸·见 §4 判据①） |
| 许可证 | CC0（免署名商用） | 已购 AD 商用包（在库） | 双方皆可商用·零风险差 |
| 米制 | 官方=1 单位格（GridMap 1×1×1）·glTF 米制待实测 | **demo 路件步距已实测=5.0 单位格**（R-20261011-ad022-road-pitch-probe.md·r322·正交四向单层） | AD 侧已定·Kenney glTF 米制留导入窗（对齐单常数=5·见 §4 判据②） |

## 4. R2 街区扩展选型建议（判据先行·≤3 问机械可验）

- **场景 A（纯 AD-022 扩展）**：风格连续零混搭风险；缺工业/新能源/路标红绿灯内容（AD-022 无对应件族）。
- **场景 B（Kenney Industrial+Roads 补内容）**：Industrial 40 件（厂房/仓库/光伏/风能）+ Roads 90 件（路标/红绿灯/护栏）正中缺口；代价=混风格。
- **选型三判据（导入窗执行·全机械可验）**：
  1. **风格同框闸**：Kenney 件与 AD-022 件同帧渲染截图 → 多模态锐评「一城统一感」≥8 才过（<8=判负退场景 A）；
  2. **米制定标闸**：单导入 scale 常数下 Kenney 路面宽度与 AD-022 路件步距对齐（路缘对路缘零错位·错位=常数再定标一次过；AD 侧基准 5.0 已实测=R-20261011-ad022-road-pitch-probe.md）；
  3. **合批实证闸**：混拼帧 drawcall 实读对 AD-022 基线非恶化（恶化=colormap 优势失效·查材质断裂点）。
- **导入窗步骤**（零下载约束解除时）：下载 v2.x 包 → asset-usage-ledger.md 登记（48 包图存档 tech#1 同窗）→ 米制定标 → 三判据 → 入街区扩展批次。

## 5. 消费与导出口径

- 本轮纯纸面零导入（explore#13 口径·零许可证风险零包体污染）；
- 消费面=City3D R2 街区扩展（交互窗 R2 里程碑落地后·main#5 判据链取证窗同窗）+ 48 包利用率图（asset-audit 接线判据·tech#1）；
- Quaternius Modular Streets（r320 记录的 Roads 二比一的另一侧）拼装语法未拆解——留后续件，本件先闭合 Kenney 侧。
