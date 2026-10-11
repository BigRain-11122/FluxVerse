# R-20261011 AD-022 Props 域全景「标签 vs 源谱」盘点（explore#24·五域盘点 Props 件）

- **触发**：explore#24 领走（r332·r331 轮尾补条优先）；消费链=R-20261011-ad022-shopinterior-props-label-vs-source.md §4（Props 域全景副产物收口）+probe7 复用链（guid2p 全树直改）。
- **口径**：同 r328~r331 四面只读实测（pack 目录+场景 YAML+fbx 二进制）·零导入零下载零写 City3D（交互窗在飞件未触·r236 定谳）；y=property override 本地值。
- **探针**：`.codely-cli/tmp/ad022_props_panorama_probe8.py`（probe7 直改：**SRC=Props 目录枚举**〔非手列〕+**dir 过滤**〔hit[1]=="Props"·寄居自动捕获〕+per-stem 联合包络〔多阵源口径债清〕+§E 174 全谱差集+§F 三分闭包+§G 反向寄居核·gitignored·只读）。
- **扫描轮**：DevLoop r332（2026-10-11 20:2x）。

## 1. 定谳总表：Props 域全息账（1233 实例/174 源谱·Buildings 38 干同型收官件）

| 面 | 实测 | 对照 |
|---|---|---|
| demo 实例 | **1233=ren 911+unren 322**（改名率 73.9%） | r331 §4 速记 1233 ✓ |
| 在场族/源 | **89 族/119 源** | r331 速记 87 族 → **勘正+2** |
| 源谱分母 | 174 源/**115 族**（五域=Buildings 76/Props 174/Environments 65/Characters 9/Vehicles 9） | Buildings 38 干闭合同型 |
| 零实例源 | **55（31.6%）** | r331 速记 87 → **勘正**（174−87「恰对半」=族/源混计算术巧合·真账 174−119=55） |
| 三分闭包 | **全在场族 75/部分在场 14/全缺席 26**（=115 机械核） | 零变体族 40=14 部分+26 全缺席 |
| 寄居件 | **双向零**：Props 目录 174/174 全 SM_Prop_* 命名+反向标签核 0 行 | r331 §4「Water_Tower 型寄居」假说在 Props 域关负 |

- **r331 §4 勘正指针两处**（原文零删改）：「87 源族在场」→89；「87 零实例源恰对半」→55——速记把在场族数当零源数直减所致，以本件 §F 机械实测为准。零用率 31.6%=街具 24%（r330）与 ShopInterior 73%（r331）之间的域间位。

## 2. 标签语义域级定谳：逐摆位序号计数（判死链终态·911/911 全员锚）

- **911/911 改名实例 label-num≠src-num 全员成立**——Props 域改名标签=**逐摆位序号计数**（instance counter）非变体号，与 Buildings 域「变体身份标签」**两态并存**（同 demo 双惯例）。
- 证据族：Aircon 143 改名全源 _01 标签跑 2..169（缺口 29-41/43-49/52-56=编辑器删件序列痕）·Manhole 35 改名全源 _02 标签 3..37 零缺口·Trashbin 36 改名标签 2..37（谱仅 01/02 两变体）。
- 两类计数习惯并存：**唯一计数族**（Aircon/PlanterWindow 3..99/LightPole_Base 2..61/SidewalkPoles 2..30/Trashbin）vs **批内复用族**（Barrier 2×1+3×4+4×4·Cone 2-5×1+6-10×4·Vents_Straight 2/3/4×7·Power_Cables 8×7+9×8+11×9+12×9）——编辑器复制增量行为按族成习惯·非全局律。
- **起号纪律链（r328~r331 四态）在 Props 域终结**：「源谱数+1」「上一在场实例号+1」诸读法全不适用——标签为摆位伪号·变体身份在标签面零承载。r331 §3「Shelf_04 标签 vs _03 源」同名陷阱非首例特例=**本域常态**（Cone 标签 2 撞零实例源 Cone_02·CardboardBox 标签 3/6/9 撞零源 02/03 等）——**查源唯一正法=guid 反查（probe §B 法）全域终谳**。
- 34/89 在场族 ren=0（两习惯）：**组装件套件族**（LightPole_Arm/Box/CrossButton/CrossLights/Lights 全 unren）+**一次性摆位留原名族**（LargeSign 14 型+单字招牌 9 型+Poster/Vents_Transition/BusStop/HotdogStand/Pipe_Preset/ShopInterior_Table）。

## 3. 挂装语法带（y 谱五带分层——R2 生成器直用底表）

- **贴地带 y≈0**：街道家具主流（Barrier/Cone/Hydrant/Mailbox/Manhole/SidewalkPoles/Trashbin/ParkBench/PicnicTable/Skip/Sidewalk_Panel）。
- **沉降带 y=-0.1 恒值**（11 实例·TrashBag/Newspaper/Pipe_Small/CardboardBox/Sidewalk_Panel/Skip/ParkBench）=设计常数·下沉 10cm 家具层；LightPole_Base 另有 -0.18×17 沉降子集（灯基微沉位）。
- **窗带挂装（3.0 模数+0.4 缘·逐层差恒 3.0）**：Aircon 主带 3.1-3.6/6.4-6.7/9.0-9.6（≈112/144=78%·窗式空调逐层带）+次带 4.6-5.1/7.6-8.1（≈26/144=18% 中位带）+顶层 11.0/12.1×2；PlanterWindow 同梯 3.08-3.59/6.4/9.5；**Window 装饰窗全梯 3/3.5·6/6.5·9/9.5·12/12.5 双位/层**——立面挂装带=楼层线+0.4 缘窗位（story 3.0 与 r329 FE/Office 模数精确咬合）。
- **屋顶带 12.4/12.5/15.5**（4/5 层顶·次级 11.008/9.5=3 层顶）：Roof_Aircon 38/SatDish 21/Vents_Exhaust·Corner/Skylight/Table/Couch 17/PotPlant/PowerBox/Door/Window/Planter/Billboard_Roof 12。
- **高层锚双咬合**：Sign_Attachment 33.47×2+33.48=**模块塔 Roof@33.5 顶缘咬合**（r329 竖摞列 3.5+9k+Roof 封顶账）·LargeSign_Soda y=38.86=**单体塔 38.36 顶+0.5 咬合**（r329 单体谱最高件）——塔顶招牌语法两建径双验首例。
- **灯杆组装件套件**：20 套全件灯组（Base+Arm+Box+CrossButton+CrossLights+Lights×2=每套 7 件·Lights 40=20×2 双灯）vs 简装基座 71（91−20 推算）——R2 灯杆生成=两档（全件十字灯组/简装基座）·组装件成员摆位不改名=套件语法。

## 4. mesh 侧（fbx 165 可析+异常清单）

- **h 桶**：<0.5=33/0.5-1=49/1-2=42/2-3=22/3-4=7/4+=12 → **75.2%≤2m 人尺度**——Props=街道家具尺度域（vs 塔族竖摞域两态）。
- **真实最高件**：Billboard_Pole 6.90/LightPole_Base 6.48/LargeSign_Guitar 6.38/Lollypop 6.36/Bottle 5.82/Soda 5.60——高件全=杆/招牌族（挂装面承载）；**Police_Baton_01 h=60.53（y −42.4..+18.1）=异常包络离群源**（0.5m 警棍 60m 包络=蒙皮/绑定姿势类 fbx 数据异常）——R2 引用黑名单首件（clamp/弃用）。
- **居中枢点源 46/174=26%**（neg-y 包络·ATM/LargeSign 全系等）——与贴地枢点两态并存·R2 摆位规则按枢点惯例分流（地面族 y=0 直摆 vs 居中族 y=h/2 抬摆表）。
- **8 件 prefab-only（无 Models fbx·网格引用他处）**：Burger/CardboardBox×4/Pipe_Preset×3——其中 CardboardBox 4 变体 7 实例在场+Pipe_Preset _03 在场（y=9.5 高位）·源谱≠使用谱在无独立 fbx 子域同样成立；1 件 no-array（Sign_Bustop_01·fbx 在但零 d/f Vertices 阵）；3 件多阵（BusStop_01/SecurityCamera_Arm_01/Skylight_01=双 mesh 组合·联合包络口径）。

## 5. 零实例差集（55 源·R2 选件增量池）

- **全缺席 26 族**：**Pipe_Part 组装 kit 4 型**（Connect/Corner/Straight/T 管道搭建件全搁置·配 Pipe_Preset 01/02 零用+Pipe_Small 6 实例的半用态）·**TrafficLight×3（城市 demo 零红绿灯=R2 街口布设最大候选增量）**·Paper×5·招牌五型（Sign_Stop/Arrow/Bar/Entrance/FireDepartment）·Deckchair/Umbrella/Pallet/SmartPhone/Soda×3/Police_Baton/Light_Attachment/Vents_Wide/LargeSign_Beer·Donut·Icecream/ShopInterior_Cafe·Chair·Display。
- **部分缺席 14 族 15 变体**：CardboardBox 02/03·Cone_02·Door_01·Newspaper_01·Pipe_Preset 01/02·Power_Cables_02·ShopInterior_Desk_01/Shelf 01/02/04·SidewalkPoles_02·Sidewalk_Panel 03/05·Sign_Attachment_01·Sign_GiveWay 01/02·TrashBag_02·Washingline_04。
- **源谱≠使用谱第五波**（Buildings 三波+ShopInterior 第四波后）：零用率 31.6% 域间位·但零用谱价值面为五波最高（TrafficLight/Pipe_Part kit/招牌族=成套可用增量·非零散件）。

## 6. 消费与导出

- **R2 生成器输入面四件**：①挂装带表（§3 五带）=Props 摆位语法参数化底表；②枢点两态规则（§4 居中 46 源 h/2 抬摆）；③异常源黑名单（Police_Baton clamp 首件）；④零实例池=选件增量面（选件查谱勿抄 demo·r330/r331 判承）。
- probe8 入复用链（**SRC 目录枚举+dir 过滤+联合包络+三分闭包+反向寄居核=五域盘点正典形**·probe5/6/7 并档）。
- r331 §4 勘正指针两处（§1）+起号纪律链终结注（§2）——原文零删改。
- **导入窗验增位**：TrafficLight 一帧（街口红绿灯=零用谱最高价值件）+Pipe_Part kit 四连接件一帧（搭建语法验证）。

## 7. 队列去向

- explore#24 领走删行；P3 48h 死线滚动位：末笔=r332（20:2x）·**下次死线=10-13 20:2x**；
- 轮尾补 **#25=Environments 域全景「标签 vs 源谱」盘点**（65 源谱·probe8 直改·五域盘点倒数第二件——Buildings 76/Props 174 已闭·Characters 9/Vehicles 9 微域并窗收尾）+#17 街具自由摆对照维持。
