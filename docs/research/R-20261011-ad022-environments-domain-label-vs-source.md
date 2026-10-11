# R-20261011 AD-022 Environments 域全景「标签 vs 源谱」盘点（explore#25·五域盘点倒数第二件）

- **触发**：explore#25 领走（r333·r332 轮尾补条优先）；消费链=R-20261011-ad022-props-domain-label-vs-source.md §7（probe8 正典形直用）+五域盘点倒数第二件（Buildings 76/Props 174 已闭·Characters 9/Vehicles 9 微域并窗收尾）。
- **口径**：同 r328~r332 五面只读实测（pack 目录+场景 YAML+fbx 二进制）·零导入零下载零写 City3D（交互窗在飞件未触·r236 定谳）；y=property override 本地值。
- **探针**：`.codely-cli/tmp/ad022_env_panorama_probe9.py`（probe8 直改：SRC=Environments 目录枚举〔非手列〕+dir 过滤〔hit[1]=="Environments"〕+per-stem 联合包络+§E 65 全谱差集+§F 三分闭包+§G 反向寄居核〔SM_Env_ 标签〕·gitignored·只读）。
- **扫描轮**：DevLoop r333（2026-10-11 20:2x~20:3x）。

## 1. 定谳总表：Environments 域全息账（2895 实例/65 源谱·46 谱族）

| 面 | 实测 | 对照 |
|---|---|---|
| demo 实例 | **2895=ren 2850+unren 45**（改名率 98.4%） | r332 §7 分母预告 65 ✓ |
| 在场族/源 | **40 族/55 源** | — |
| 源谱分母 | 65 源/**46 谱族**（五域=76/174/65/9/9 全验） | 分母机械验实 ✓ |
| 零实例源 | **10（15.4%）** | 五域零用谱带最低位（街具 24%/Props 31.6%/ShopInterior 73%） |
| 三分闭包 | **全在场族 37/部分在场 3/全缺席 6**（=46 机械核 ✓） | Path 族+Road_Median=谱系级缺席 |
| 寄居件 | **双向零**：Environments 目录 65/65 全 SM_Env_* 命名+反向标签核 0 行 | 域纯净度与 Props 同态 |

- 改名率 98.4%（2850/2895）vs Props 73.9%——**铺装族几乎全改名=地面系统是复制铺贴主战场**（Sidewalk 618+Sidewalk_Straight 586+Road 394 三巨头=1598 件=55.2% 域量）。
- **未改名 45 件=源变体级原件锚位惯例**（40 族中 38 族留 1-3 件·WaterEdge_Straight _01/_02/_03 各 1·Tree/Sidewalk_Corner/Street_Divider 双源各 1；Cloud/Road_YellowLines 两族零未改名全改名=例外二族）——vs Props 组装件套件族+一次性摆位留原名族两习惯（第三态）。

## 2. 标签语义域级定谳：摆位序号计数第二域证（2850/2850 全员锚）

- **2850/2850 改名实例 label-num≠src-num 全员成立**——Environments 加入 Props 态（逐摆位序号计数非变体号）；**三域定谳：Buildings=变体身份标签唯一异态 / Props+Environments=摆位序号两域连证**（Characters/Vehicles 微域收官即五域终谳）。
- 证据族：Bridge_Edge 45 改名全源 _01 标签 2..46 零缺口+Bridge_Underside 同梯 45（**桥=46 节段 Edge+Underside 1:1 配对语法**）·Flower 71 改名全源 _01 标签 2..72 零缺口·Road 393 改名跨源 _02/_03 序号无视变体切换（变体身份零承载第三证）·WaterEdge_Straight 199 改名跨源 _01/_02/_03·Sidewalk_Corner 30 改名混源 _01/_02。
- 起号混合态（2/3/4 皆现·Cloud 起 4·Road 起 3·多数起 2）——摆位伪号+编辑器删件痕双证：Ocean_Tile miss 32..110 大段（水面补丁删除序列）+Sidewalk miss 257..272 连续 16（块删痕）+Road_Lines miss 21..39 大段。
- 查源唯一正法=guid 反查全域终谳维持（probe §B 法·r332 §2 判死链承接·变体号查表四证后第五域同判）。

## 3. 挂装语法带（y 谱七带——R2 地面系统直用底表）

- **铺装零平面 y=0**（2846/2895=98.3%）：Road/Sidewalk/Ocean/GrassPath/围栏全族——地面系统=零平高铺贴（vs Props 贴地带+沉降带微差态）。
- **路缘沉降包络 -0.23..0.07**（fbx 恒同：Sidewalk_Corner/Dip/Dip_Corner/Grate/Merger/Straight 全族）——路缘石 h=0.30 物理高度常数（Grate_02 浅型 -0.069 例外档）。
- **树地形跟随带 ±0.5**（Tree ren: -0.5×2+0×31+0.5×7）——树=地形起伏跟随微带（铺装零平非跟随·树独跟随=草地/路缘咬合面）。
- **花坛微高带 0.098~0.145**（Flower 71 件三恒值 0.1×33/0.145×31/0.14×6）——花床抬升 10-14.5cm 台。
- **桥下结构带 -3.5**（Bridge_Support 7 件恒值）——桥体=Edge+Underside 表层 0+Support 深梁 -3.5+Wall 双件 0+Pillar 4 件 0 五件套。
- **水岸三阶剖面**：表面墙 0（WaterEdge_Straight fbx 包络下探 -5.24..+1.26·199 件全 0）/排水管 -1.5（WaterEdge_Pipe 20 件恒值）/护底岩 -5（WaterEdge_Rock 51 件改名恒 -5·原件 _01 留 0）——R2 水系模块垂直剖面底表。
- **云天带 67.4~87.6**（Cloud 10 件全改名·八离散值 67.4/74.5/75/78.6/80.5/83.5/84/87.6）——天幕装饰挂装带五域首见（vs Props 屋顶带 12-15.5·两带分层）。
- **背景板与孤例**：Skyline 1 件未改名 y=-5.7（联合包络 0..42.29 藏四阵=**背景板族四高度档 24.97/29.65/34.12/42.29 内嵌**）+Ocean_Tile 原件 _01 y=-4（改名 148 件全 0=水面补丁位）+Road_ParkingLines 改名 1 件 y=-11 孤例（地下层标记疑似位·导入窗验增位）。

## 4. mesh 侧（fbx 65 全析·五域最干净域）

- **h 桶**：<0.5=38（58.5%）/0.5-1=1/1-2=4/2-3=3/3-4=4/4+=15 → **平面贴片域**（三态分立终谳：Buildings 竖摞域/Props 人尺度家具域/Environments 平面贴片域）。
- **4+ 高件 15 源三分类**：结构高件=树 2（4.21/4.68）+水岸 5（5.43-6.50）+地铁口 2（5.66/10.11）；天幕装饰高=云 3（16.5-19.8）；**异常/选阵 3=Flower_01+Ocean_Tile_01+Skyline_01**（见下）。
- **异常包络黑名单 1→3 件扩容（R2 引用面）**：Flower_01（49 顶点 y=-1.76..15.39 h=17.15=离群顶点型·与 Police_Baton_01 同病）+Ocean_Tile_01（441 顶点 h=43.34 而 149 实例全 y=0 铺贴=离群顶点第二件·水面平铺与 43m 包络矛盾实锚）+Skyline_01（非异常但**四阵选高度档**·摆位须选阵非 clamp）——黑名单规则=clamp（Flower/Ocean_Tile）+选阵（Skyline）。
- **多阵 2 源**：Skyline_01（4 阵）+SubwayEntrance_01（2 阵=地上入口 h2.42+**地下竖井 -6.43..3.68 h10.11 双段结构**）——地铁口=地上 2.4m 门头+地下 6.4m 竖井一体件·R2 摆位按地上段对齐。
- **零 prefab-only·零 no-array**（65/65 fbx 全析）=五域最干净域；neg-y 包络 37/65=56.9%（路缘/桥/水岸下探面·vs Props 26% 居中族两态）。

## 5. 零实例差集（10 源·R2 选件增量池）

- **Path 族 5 源谱系级全缺席**：Path_Corner/Junction/Straight/T+GrassPath_Junction——泥土小径贴族 demo 全弃（vs GrassPath 族半用在用=公园径与铺装径二分·纯 Path=冗余谱定谳）。
- **Road_Median 2 变体全缺席**：中央分隔带贴零用——R2 街道断面谱增量候选（YellowLines 在用·Median 未用=断面谱选件空间）。
- **变体级部分缺席 3 族**：Road_01（demo 用 _02/_03 首变体弃）+Road_Lines_01（用 _02）+Sidewalk_Straight_02（用 _01）——变体级选件再证·源谱≠使用谱第六波（谱系级+变体级双形态）。
- 五域零用谱带全息：Buildings 街具 24%/Props 31.6%/ShopInterior 73%/**Environments 15.4%=五域最低**——地面系统对源谱利用率最高=设计核心位定谳。

## 6. 消费与导出

- **R2 生成器输入面四件**：①地面铺装语法四层（零平+路缘 -0.23 沉降+树 ±0.5 跟随+花坛微高）=地面摆位规则底表；②水岸三阶剖面+桥五件套配对语法（Edge+Underside 1:1/Support -3.5/Pillar/Wall）=水系桥模块底表；③异常黑名单 3 件（clamp×2+选阵×1）；④零实例池（Path 冗余谱弃用确认+Median 断面增量候选）。
- probe9 入复用链（probe5/6/7/8/9 并档·五域盘点正典形第二用即验·目录枚举+dir 过滤参数化稳定）。
- 导入窗验增位：SubwayEntrance 地下竖井一帧（双段结构）+Road_Median 一帧（断面谱）——归 R2 里程碑批（交互窗在飞期禁动 City3D·r236 定谳维持）。

## 7. 队列去向

- explore#25 领走删行；P3 48h 死线滚动位：末笔=r333（20:3x）·**下次死线=10-13 20:3x**；
- 轮尾补 **#26=Characters/Vehicles 微域并窗盘点**（9+9 源谱·probe9 双跑或 dir 过滤双连·五域盘点收官件——五域全息账 333 源终谳出册）+#17 街具自由摆对照维持。
