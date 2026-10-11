# R-20261011 AD-022 街具小族「标签 vs 源谱」扫尾（explore#22·Buildings prefab 域盘点机械全闭合·38 干定谳）

- **触发**：explore#22 领走（r330·r329 轮尾补条优先）；消费链=R-20261011-ad022-fe-office-label-vs-source.md §1/§5（probe5 直承+「余街具另条」收口）+R-20261011-ad022-apartment-stack-grammar.md §24（楼簇 48 单柱=独栋 Shop/Station 外证）+R-20261011-ad022-truedemo-census.md §2（双面计律执法）。
- **口径**：同 r328/r329 三面只读实测（pack 目录+场景 YAML+fbx 二进制）·零导入零下载零写 City3D（交互窗在飞件未触·r236 定谳）；y=property override 本地值。
- **探针**：`.codely-cli/tmp/ad022_street_probe6.py`（probe5 结构 KEYS 直改〔街具 21 源〕+新增 §E 零实例源差集核·gitignored·只读）。
- **扫描轮**：DevLoop r330（2026-10-11 19:5x）。

## 1. 定谳总表：街具六名义族八 stem 全息账（21 源件）

| 族（stem） | Models 源谱 | demo 实例账（双面计） | 改名标签 |
|---|---|---|---|
| Shop | _01..06（6 件·**每件双 Vertices 阵=体+檐部小件**·体 h=3.00/3.30/3.08/3.17/3.00/3.00） | **65=59 改名+6 未改名**（未改名=01..06 每源一件） | `Shop_07..65`（59 连号零缺·**起 07=6 源+1 ✓**） |
| Shop_Corner | _01/02（2 件·h=3.00 双 mesh） | **27=25 改名+2 未改名** | `Shop_Corner_03..27`（25 号·起 03=2 源+1 ✓） |
| Shop_Cover | _01..05（5 件·**负 y 包络垂帘族** h=0.30/1.20/1.76/0.66/0.68） | **11=3 改名+8 未改名**（改名全=源 _05·未改名 _05×5 主复用 8/11） | `Shop_Cover_06/08/09`（缺 07·**全挂 _05**） |
| Station | _01/02/03（3 件·h=8.58/8.58/5.74） | **12=9 改名+3 未改名**（未改名=01..02/03 各一） | `Station_05..13`（9 连号·**起 05=3 源+2 偏离**） |
| CityHall | _01（1 件·h=8.75·**6508 verts 族内最重单体**） | **1=全未改名**（y0 孤件） | 零改名 |
| Spire/Cover(Bld)/Water_Tower | Spire_01（h=21.31·49 verts 细高针）/Cover_01/02（负 y h1.07/0.97）/Prop_Water_Tower_01（h=5.51·**Prop 域件寄居 Buildings prefab 域**） | **全零实例**（§E 差集核） | — |

- **零实例源 5 件**：Shop_Cover_04+Spire_01+Bld_Cover_01/02+Water_Tower_01——源谱≠使用谱第三波实锚（承 r329 Round 高身/Square _03/_04·「demo 在场≠包内可用谱」反面向：**demo 缺席≠包内缺件**·R2 地标/水塔选件须查 Models 谱勿抄 demo）。
- SM_Prop_ShopInterior_* 11 件=Props 域（不在 Buildings prefab 域）·零入本次盘点域·另条（队列 #23）。

## 2. mesh 级新据（全地面族+檐篷挂件层+起号纪律新态）

- **街具=全 y≈0 地面直摆族**（Shop/Shop_Corner/Station/CityHall 改名+未改名全 y0·零竖摞零抬升）——与塔族（Base+竖摞）两态并存=「地面带贴地街墙」语法；grammar §24「48 单柱独栋」外证收口（Shop/Station 为主体）。
- **Shop_Cover=檐篷挂件层**：挂位 y=2.5/3.0/3.5=店铺体 h3.0 顶缘带·负 y 包络=垂帘下探锚（-0.149..-0.682）·Cover_05 复用主力（8/11）·Cover_04 零用——**挂件族与 FE 侧挂链（层顶−0.1）同型语义：挂件选择=观感件非结构件**。
- **起号纪律第三态**：Shop 起 07（6 源+1 ✓）/Corner 起 03（2 源+1 ✓）守「源谱数+1」律·**Station 起 05（3 源+2）偏离**（与 FE 起 02 同列·作者手写惯非硬律再证）；Cover_06/08/09 缺 07=删件痕（Stack 缺 36/38/80 同型）。
- **Shop 双 mesh 组合件**（体+檐部小件 6/6 全有）=Office Base 双 Vertices 阵同型（导入窗拆件验位族扩员）·街具体高 h3.0 与层高模数 3.0 同构（一层店面对齐 3.0 模数·R2 街墙贴地带天然对齐）。

## 3. Buildings prefab 域盘点机械闭合（38 干定谳）

- **机械实测=38 stem 干**（Buildings prefab 目录去尾号聚类）：r328 面 11 干（Apartment 10+Roof_Access）+r329 面 19 干（FE+Office 五塔族）+本轮 8 干（Shop/Shop_Corner/Shop_Cover/Station/CityHall/Spire/Cover/Water_Tower）=**38/38 全闭合零余**。
- **r329「31 族」口径勘正**：名义族计数（Apartment 系并族+Office 塔族粗分）≠机械 stem 干——以 38 干为准入册（r329 原文零删改·本行即勘正指针）；「塔族盘点全闭合」表述收窄为「Buildings prefab 域盘点机械全闭合」。

## 4. 消费与导出

- **R2 生成器输入面**：街墙带=Shop 6 源+Corner 2 源贴地直摆（h3.0 对齐层高模数·y0 恒）+Cover 檐篷件挂店顶缘 y3.0±0.5（观感层低概率·Cover_05 主选）+Station/CityHall=地标独栋位（y0 孤件语法）+**Spire/Water_Tower=包内备件 demo 零示范**（选件查 Models 谱·生成器默认不含·地标专项窗再议）；
- 「按变体号查表」全线判死第三证（起号偏离+就地复用+零实例源）·r329 §5 判读链维持；
- **导入窗验增位**：Shop 双 mesh 拆件一帧（体/檐部）+Cover 垂帘负 y 锚一帧（挂件枢点）；
- probe6 入复用链（KEYS 参数化+§E 零实例差集核=后续族盘点直改即用·probe5 §5 复用面并档）。

## 5. 队列去向

- explore#22 领走删行；轮尾补 #23=ShopInterior Props 族域盘点（Props prefab 域 guid2p 扩展·probe6 直改）+既有 #17 街具自由摆对照（Cover 挂件自由摆新据可对照）维持；
- P3 48h 死线滚动位：末笔=r330（19:5x）·下次死线=10-13 19:5x。
