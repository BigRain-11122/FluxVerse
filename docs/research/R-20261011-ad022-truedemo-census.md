# R-20261011 AD-022 真 vendor demo 全景普查（r322/r323 场景归因勘正 + 路建细节三面语法实测）

- **触发**：explore#15 领走（r324）；同时刷新 explore#12 P3 48h 节律死线（末笔 r323 → r324 成件=新末笔·下次死线 10-13 19:0x 前一笔 P3 产出）。
- **口径**：场景 YAML 只读实测·零导入零下载零写 City3D（防双头 r236 定谳合规·交互窗在飞件未触）。**证据面=两场景对照**：①真 vendor demo=`Assets/lowpoly/01_现代城市生活/AD-022_Scene场景_现代城市_CityPack/PolygonCity/Scenes/Demo.unity`（10,192,947B·r322/r323 均未扫过·本件首扫）②`Assets/Scenes/CityAssembled.unity`（**勘正=我方 R0 装配产物·非 vendor demo**·见 §0）。
- **探针**：`.codely-cli/tmp/ad022_detail_probe.py`（CityAssembled 全实例分桶普查）+`.codely-cli/tmp/ad022_true_demo_probe.py`（真 demo 普查·root-parent=fileID 0=恒等判定修正）；gitignored·只读。
- **扫描轮**：DevLoop r324（2026-10-11 19:0x）。
- **勘正指针（r329）**：本件计数面=m_Name 改名标签面（未改名实例结构性不可见）——FE 实锚=总量 160（69 改名+91 未改名·漏 57%）·§2 抬升件 y 谱未含 FE 未改名地下带（−3×45/−6×38/−9×7）；**后续一切 demo 普查一律双面计（改名+未改名）**→R-20261011-ad022-fe-office-label-vs-source.md（原文零删改）。

## 0. 勘误（r322/r323 场景归因勘正·结论修订表）

**CityAssembled.unity=我方 R0 装配产物非 vendor demo**——证据链=City3D-staging/assemble-report.md（09-29 装配回执）计数与本次普查**逐项吻合**：roads_placed=1031↔Road_NNN 1031 件·districts 3×16+hero=49↔建筑 49·plaza_tiles 77（junction 53/T 15/corner 6/straight 3）↔r322「77 路族件」Path 谱完全一致·sidewalks 400/streetlamps 120×3 件/parked_cars 120/trees 53/residents 12/RoadFill 32/bridge underside 128+edge 162/shore corner 41+rock 7+straight 30 全吻合·mtime 09-29 16:07=装配日落盘（回执原文 "scene saved: Assets/Scenes/CityAssembled.unity"）。r322/r323 把该场景当 vendor demo 实测——两件结论按下表修订（两旧件头部已加勘误指针行）：

| 旧结论 | 判定 | 修订（真 demo 实测依据） |
|---|---|---|
| r322「SM_Env_Road demo 零在场·路网=Path 族独任」 | **作废** | 真 demo Road 族主导（§1 谱）——旧判读源=我方 plaza 77 件+我方路件命名 `Road_NNN`（无 SM_ 前缀）逃过 rg 检索 |
| r322「junction 主导密网=AD 语法·生成器词汇应以节点件为主体」 | **作废** | 真 demo 直道主导 77.6%（Road+Bare 582/750·Crossing 仅 42）——我方装配 1031 直道铺线反而贴近 vendor 正法 |
| r322「米制定标 AD 侧常数=5.0」 | **存活+证据升级** | 真 demo 路族 730/750 落 5.0 格+建筑基座 132/158 落 5.0 格——路建双面同格·5.0 证据链以真源闭合 |
| r323「Apartment 包内在册 demo 零在场」 | **翻案** | 真 demo Apartment 全家 440+ 在场=核心族（Corner×92/Roof×86/Stack×73/体×68/Roof_Corner×48/Door×40/Stairs 系 26/Door_Corner×5） |
| r323「demo 建筑侧零 5.0 格证据·建筑侧转 mesh 复核/R2 设计面自定」 | **翻案** | 真 demo 建筑基座件 5.0 格在案（132/158）——建筑落格语法成立·「设计面自定」兜底可撤（mesh footprint 复核仍留导入窗做件缘对齐验证） |
| r323「3 卫星簇 120° 对称=vendor 美术构图」 | **作废** | =我方 districts 3×16 槽位布局（装配回执 districts: 3x16 slots placed=48）·vendor 无此构图 |

## 1. 真 demo 实测数据（Demo.unity·4763 命名 prefab instance 全量·零抽样）

家族普查：**env 2059 / prop 911 / bld 829 / road 751 / veh 170 / veg 40 / other 3**（root-parent=fileID 0 主导 4135 件·本地坐标=世界坐标）。

| 面 | 实测值 |
|---|---|
| 路族 750 | 谱=SM_Env_Road×393+Road_Bare×189+Crossing×42+Lines×30+YellowLines×24+Patch×20+Arrow×20+ParkingLines×18+GrassPath×14——**直道主导 77.6%**·5.0 格 730/750·正交旋转 670/750（free 80=GrassPath/异形件）·x 面值谱主差 5.0（55/91 缺口） |
| 建筑基座件 158 | **5.0 格 132/158**（on2.5=134）·x 值谱主差 5.0（21/54 缺口）——**建筑落格语法在案**（Apartment/Shop/Station/Office 族基座） |
| 建筑抬升件 474 | **y 谱=3.0×115 / 12.0×114 / 9.0×73 / 6.0×44 / 10.5×20 / 7.5×19 / 1.5×17 / 4.5×13——3.0 层高整数倍模块堆叠语法**（3/6/9/12 全在场·Stack/Roof/Floor/Roof_Access 件+嵌套容器栈：OfficeSquare y30.5/FireEscape y−6） |
| 屋顶道具（elevated prop 497） | y 谱 12.5×114（挂 12.0 层顶）/9.5/12.4/15.5/6.5/6.4 次谱——**屋面挂载层语法**（Aircon/SatDish/Vents/Skylight/Washingline/SecurityCamera 族） |
| 街具（ground prop 292） | **零格点自由手摆**（on5.0=1/292·on2.5=2/292）+free 旋转 99/789——vendor 街具不锁格（Hydrant/ParkBench/Trashbin/ParkingMeter/Manhole/Mailbox/Sign/Skip/TrashBag/Couch 全谱在册） |
| 车 170 | 非格点手停·free 旋转 57/170（平行停靠含非正交角） |
| 植被 40 | free 旋转 37/40·自由散布非格点 |
| env 面铺装 1911 | **sidewalk/pavement 5.0 格 1738/1911**+Ocean_Tile/WaterEdge（Pipe/Corner/Rock/Straight）/Street_Divider/Gutter/Grass 族 |
| 容器 | 车 160 共一恒等容器·建筑模块栈件挂建筑容器（非恒等 468 件=嵌套栈） |

## 2. 语义定谳（vendor 语法三面齐·真源定谳）

- **路侧=直道铺线+5.0 格**：r322 的「junction 密网」启示撤回——R2 路网生成器词汇以直道为主体、节点件为辅（我方现行装配法已在正法轨道上）。
- **建筑侧=5.0 格 footprint+3.0 层高模块堆叠**：Apartment 全模块族（体/Stack/Corner/Roof/Roof_Corner/Door/Stairs/FireEscape）=可参数化拼装系统——R2 街区扩展建筑=格对齐+层高 3.0 整数倍+屋顶件封顶；r323「建筑侧无语法保证须设计面自定」判定翻转。
- **细节侧=自由手摆不锁格**：街具/车/植被零格点+free 旋转=vendor「活城感」来源——我方 v6/v7 密度升档的格点化摆法=设计选择（非 vendor 约束）·自由化扰动可作为后续观感调优方向。
- **米制定标终谳**：5.0=路建统一格常数·**3.0=层高模数（新增输入）**——Kenney 1 格×5 缩放混拼律维持（R-20261011-kenney-citykit-assembly-syntax.md §4 判据② AD 侧以真源闭合）。

## 3. 消费与导出

- 消费面=City3D R2 街区扩展（三输入齐：5.0 格+3.0 层高模块+细节自由摆基准）+R-kenney §4 判据②（AD 侧证据链就此真源收口·mesh 件缘对齐复核仍留导入窗）；r322/r323 两旧件头部加勘误指针（历史保全律·原文零删改）。
- 后续件候选（queue/explore 轮尾补条）：①**Apartment 模块栈组合规则细拆**（Stack/Corner/Stairs/Door 每楼拼装表+3.0 层高叠序——R2 建筑生成器直接输入）②真 demo 街具密度基准对我方 v6/v7 格点摆法的自由化对照评估。
