# 活表与解析（Phase 1·布设沙盒轮）

一切实体坐标现场解析、禁拷贝快照。C# 活表在 `City/Assets/Scripts/`，builder 在 `City/Assets/Editor/`。读取一律 `Get-Content … -Raw -Encoding UTF8`。

## C# 活表正则（正典 = r169 harness A0 段·十代沿用）

| 实体 | 源文件 | 正则（PS 单引号原样） | 锚点计数 |
|---|---|---|---|
| 席位 | ResidentRules.cs | `new\s+Person\s*\{\s*name\s*=\s*"(\w+)",\s*x\s*=\s*(-?[\d.]+)f,\s*y\s*=\s*(-?[\d.]+)f` | 32 |
| 机器人 | RobotRules.cs | `new\s+Bot\s*\{\s*name\s*=\s*"(\w+)",\s*path\s*=\s*"[^"]+",\s*frame\s*=\s*\d+,\s*x\s*=\s*(-?[\d.]+)f,\s*y\s*=\s*(-?[\d.]+)f` | 8 |
| 车辆 | VehicleRules.cs | `new\s+Veh\s*\{\s*name\s*=\s*"(\w+)",\s*path\s*=\s*"[^"]+",\s*pxW\s*=\s*(\d+),\s*pxH\s*=\s*(\d+),\s*x\s*=\s*(-?[\d.]+)f,\s*groundY\s*=\s*(-?[\d.]+)f` | 8 |
| 楼体（neon 挂载表） | NeonSigns.cs | `new\s+Building\s*\{\s*x0\s*=\s*(-?[\d.]+)f,\s*y0\s*=\s*(-?[\d.]+)f,\s*x1\s*=\s*(-?[\d.]+)f,\s*y1\s*=\s*(-?[\d.]+)f` | 8 |
| 招牌 | NeonSigns.cs | `new\s+Sign\s*\{\s*name\s*=\s*"(\w+)",\s*path\s*=\s*"[^"]+",\s*pxW\s*=\s*(\d+),\s*pxH\s*=\s*(\d+),\s*x\s*=\s*(-?[\d.]+)f,\s*y\s*=\s*(-?[\d.]+)f,\s*ppu\s*=\s*([\d.]+)f` | 21（豁免族 4：NeonTowerAntM/L/R + NeonAntenna = 结构件非店招） |
| 办公/台面 | OfficeRules.cs | `new\s+Bld\s*\{\s*name\s*=\s*"(\w+)",[^{}]*?x0\s*=\s*(-?[\d.]+)f,\s*y0\s*=\s*(-?[\d.]+)f,\s*x1\s*=\s*(-?[\d.]+)f,\s*y1\s*=\s*(-?[\d.]+)f` | 6（5 楼 + Terrace01） |
| 锚点 | CitySkeletonBuilder.cs | `MakeAnchor\("(\w+)",\s*(-?[\d.]+)f,\s*(-?[\d.]+)f` | 5 |
| props 胞 | CitySkeletonBuilder.cs | `props\.SetTile\(new\s+Vector3Int\((-?\d+),\s*(-?\d+),\s*0\)` | 按 Paint 段自证（带内自由铺装 props 须零假设断言，r169 先例） |
| 大道列 | CitySkeletonBuilder.cs | `vcols\s*=\s*new\s*int\[\]\s*\{\s*(-?\d+),\s*(-?\d+),\s*(-?\d+),\s*(-?\d+)\s*\}` | −18,−17,17,18 |

## 具名 census 锚点断言（A0 补充·防表静默漂移）

- 席位锚：ResN01 (−3.5,11)·ResT01 (4.5,11 荣誉席 r132)·ResN02 (20,11)。
- 楼体锚：B7 脑塔 [−2,9,3,19]（v2.0 r132）；北岸低伏族顶 ≤13。
- 车辆锚：VehicleBusN (12, ground 8)。
- 带锚：北走道 `Paint(ground, …, 9, 14)`；大道 `Paint(roads, cx, cx, 3, 14)`。
- 办公锚：N1/Office03 == [−24,9,−18,13]。

## manifest 族（Tools/city/*.json = 各线唯一几何源）

现役：`southbank / officeband / eaveslots / terraces / tower-v2 / labs / facades / waterfx / lightfx / windowlight / rimlight / mood-visual`。

- 协议 = `fluxverse-<name>/<版本>`；布设条目 `placements[].world = [x0,y0,x1,y1]`；slots/mounts/segments 各线自有节名。
- 语义变更必升版本号（r146 v0.1→v0.2 钳制律·r158 v0.2 z 物理勘正两先例）。
- 新入 census 的实体类（如 labs 12 件）当轮并入主障碍集，并在 harness 内对 manifest 逐位镜像断言。

## 法

1. A0 锚点计数全过才续跑——表漂移/格式变当场 fail-loud，禁「解析空结果静默过」。
2. 每轮活表全重解析（城市随时被邻轮改动——预注册零触面才可复用旧值）。
3. gitignored 路径（logs/·world/）glob/grep 零命中，一律 PS 直读（r159b）。
