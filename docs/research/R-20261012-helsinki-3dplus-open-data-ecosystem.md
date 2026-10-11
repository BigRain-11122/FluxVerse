# R-20261012 · 赫尔辛基 3D+ 开放数据消费生态用例扫描（谁在免费城市模型上赚钱）

> 领条：explore#70（queue/explore.md）·成件轮 r378·2026-10-12。
> 消费面：R-20261012-digital-twin-city-biz-cases.md §2E+§3 规律5 深化（本件=其开放数据线单点深钻）＋BigStream 场景活动承接提案配套证据（10-18 演化日窗三句式）＋explore#8 参观端拆解件双参照口（ZOAN/See3）。
> 取源法注：hel.fi 官方页/1001smartcities/ZOAN 案例页=**全文 fetch**（S1/S2/S9）；其余=search 摘要面（snippet 承重处逐条标注）；Kalasatama PDF=二进制未解文本面（改检索快照引注·§5 回填行）。

## §0 结论（TL;DR）
赫尔辛基 3D+＝全球最长寿开放城市模型（2016-11 建成·€1M 一次性投入·CC BY 4.0·至今 10 年持续运营）：政府投底座不卖底座，**钱全在模型之上的服务层**——①活动承接（ZOAN Virtual Helsinki 30+ 场商业制作：演唱会/双年展/虚拟会议/展览）；②SaaS 分析（Helsync 基于模型做 AI 能耗优化·单源注记）；③运维工具（virtualcitySYSTEMs 2025 承接夜间自动化更新）；④试点付费（Forum Virium 倒贴钱请公司来消费城市数据做实验）。开放模式的本质＝**模型免费=获客成本，标识符=基础设施**（每建筑自带数据库键可挂任意数据流——「可挂载数据流的 ID 比好看的 mesh 值钱」1001smartcities 教训行原义）。对超体宇宙城三启示：**活动承接正证闭合**（同一座城自己的商业层=活动·与瑶台按场次收费互证双源）＋开放面若有先给稳定标识符＋政府侧禁入面维持（卖平台给政府=51WORLD 病）。

## §1 底座面（政府投了什么·怎么活十年）
| 面 | 实锚 | 源 |
|---|---|---|
| 投入 | €1M 一次建成（2016-11 完成·Bentley ContextCapture/OpenCities 栈）；目标=改善市内流程+促智慧城+**作为开放数据共享给市民与公司做研发** | S3/S4（snippet） |
| 双模型 | 语义 CityGML 信息模型（LoD1/LoD2·纹理可选）+高清 reality mesh（航测三角网·点距真实 20cm 内·OBJ/3MX）；**全球首个双模型全城同开的城市** | S1（fetch）/S7 |
| 许可 | 双模型均 **CC BY 4.0**；CityGML 按 4km² 图幅下载；mesh 官方明示用途=「design, network service or **game engine platform**」（游戏引擎平台=官方原文） | S1（fetch） |
| 标识符 | 每建筑自带 GMLID/RATU/VTJ-PRT 数据库键→可挂任意数据流；栈=Cesium+postgreSQL/postGIS+3DCityDB+CityGML 2.0 | S1/S2（fetch） |
| 维持演进 | 手动更新→**2025 转夜间增量自动化**（建筑模型与 2D 底图同步精度/时效·「planners/architects/数字孪生应用始终用最新数据」） | S5（snippet·vc.systems 案例+PDF） |
| 工具面 | Stadi3D 下载器+地图服务直接下载+avoindata 芬兰国家门户分发 | S1/S6 |

## §2 消费生态用例谱（四类·谁在消费什么）

**A. 能源域（最厚消费面·官方自建+商业寄生）**
| 用例 | 实锚 | 判读 |
|---|---|---|
| Energy & Climate Atlas（官方服务面） | 基于双模型的免费浏览器服务：近全城建筑能耗指标估算+**~100 万屋顶/墙面太阳能辐射年/月度计算**+供暖需求模拟（kartta.hel.fi/3d/atlas） | 模型→市民可用的能源决策服务=开放数据最成熟消费形态（Aalto 引为「居民可查自家太阳能潜力」的范例 S2/S8） |
| 供暖脱碳研究 | MDPI 2020：CityGML+Atlas 集成做供暖需求/CO2 情景预测（气候变化情景下） | 研究者零成本消费=政府不用再开一次测绘（S8） |
| Helsync（私营 SaaS） | 基于 Helsinki 3D+ 的 AI 预测性能耗优化软件 | **单源注记**（S13·profwurzer）·开放模型上的商业分析层样本·§5 待第二源 |
| Helsinki Energy Challenge（挑赛触发器） | 2020 市府主办·€1M 奖金·全球 252 队提交 4 队胜（含 Engie 领头 HIVE 联队）·解题=2035 碳中和的供暖脱碳（供暖>全市排放一半·Helen 市能源公司背书） | 政府把「问题+数据」开放给全球解题者=**开放数据的需求侧触发器**（挑赛奖金=政府的生态采购替代形态 S18/S19/S20） |

**B. 地产·物业域**
- Atlas 官方明示用途=「全赫尔辛基地区**能源改造可能性**」→业主/物业的改造决策输入面（S1/S2）。
- ZOAN Virtual Helsinki 城模副本用于「marketing, **real-estate** and other digital solutions」——60 人团队 2016-2019 商业运营（S11·snippet）。

**C. 开发者·厂商域（谁在免费模型上赚钱·核心发现）**
| 主体 | 商业动作 | 源 |
|---|---|---|
| ZOAN（赫尔辛基 VR 工作室） | 2015 起与市政府共创「Virtual Capital of the World」→Virtual Helsinki 平台→**30+ 场商业制作**：Virtual May Day 演唱会（JVG·破纪录）+Amos Rex 虚拟展览+赫尔辛基双年展 Facebook Open Arts VR+Finlandia Hall 虚拟会议+Vallisaari VR——**城模之上的商业层=活动承接（演唱会/展览/会议=按场次制作收入）** | S9（fetch）/S10/S12 |
| virtualcitySYSTEMs | Atlas 平台供应商→2025 夜间自动化更新案例承接商=**卖工具与运维给城市**（模型免费·工具收费的正路样本） | S5 |
| Forum Virium（市创新公司） | Smart Kalasatama 2013-2021 试点平台：**Agile Piloting 付费试点**（市里出钱请公司在真城区做短实验）+Mobility Lab 2023 数字孪生出行试点+交通规划/环境监测双孪生线 | S15/S16/S17 |
| Bentley | €1M 一次项目承包（ContextCapture 时代）→后由 vc.systems 接运维层=**底座建设与运维分家** | S3/S5 |

**D. 研究者·协作域**
- Aalto：Palvelututka（城市服务雷达·API+3D 模型消费·Kalasatama 应用）+Atlas 公民服务范例引注（S2）。
- 5CC+ 六城协作（Hamburg/Helsinki/Prague/Rotterdam/Vienna/Singapore）：2026-05 赫尔辛基办城市建模研讨周=**开放模式的软实力出口**（别城来学）（S20）。

## §3 商业面规律（开放模式的钱从哪来·五律）
1. **模型免费=获客成本，钱在服务层**：四类赚钱主体无一卖模型（ZOAN 卖制作/Helsync 卖分析/vc.systems 卖运维/FVH 卖试点组织力）。
2. **政府不卖模型但持续买服务**：€1M 一次投+Atlas 运营+夜间自动化合同+挑赛奖金+试点付费=政府角色=底座投资人+服务采购人。
3. **生态中介=反向补贴**：Agile Piloting 市里出钱请公司消费城市数据=开放生态的冷启动杠杆（非等生态自长）。
4. **活动层=最高变现密度**：ZOAN 30+ 制作全为活动/展览/会议——虚拟城上被反复验证的商业动作=按场次活动（与 r377 §2F 瑶台按场次收费**双源互证**）。
5. **标识符=基础设施**：数据库键挂载数据流的能力（GMLID/RATU/VTJ-PRT）比 mesh 观感更值钱——「A mesh you can fly through is a picture. A model whose buildings can be joined to other registers is infrastructure」（S2 原句）。

## §4 对超体宇宙城的映射（P3 消费口）
1. **活动承接提案配套证据闭合**：r377 §0 B 端出口排序（活动承接＞参观导览＞驾驶舱皮肤）原本单靠瑶台一源——本件补赫尔辛基正证（同一城模·30+ 场活动制作·市府共创背书）→**三句式提案（10-18 演化日窗）可双源立判据**。
2. **开放面若有·标识符先行**：超体宇宙城对外数据/资产面若开放，参照=先给稳定可挂载标识符（每栋楼/每席位稳定 ID+可挂事件流），非先出好看全景。
3. **政府侧禁入面维持**：开放≠可进政府卖平台（51WORLD 650 天应收警报·r377 §2A）；赫尔辛基自己也是「投底座买服务」形态。
4. **explore#8 参观端拆解双参照**：See3（51Earth 参观端·年收 360 万=预期管理锚）+Virtual Helsinki（活动端·本件 §2C）——拆解件消费口。

## §5 后续待挖（回填行）
| 待挖 | 口 | 判据 |
|---|---|---|
| ZOAN 场单经济深挖（30+ 制作的收费结构：谁买单·单场量级） | S9 媒体面+Slush 报道族 | 收费主体/场次收入任一实数落件 |
| Kalasatama Digital Twins PDF 文本面（hel.fi 静态件二进制未解） | S6 avoindata 数据集页转文本 | 文本面引注替换检索快照 |
| Helsync 第二源（能耗 SaaS 单源存疑） | 芬兰语商业媒体/公司注册面 | 第二源落件或判负注记 |
| Energy Challenge 四胜者商业模式（HIVE 外三队+落地后续） | S18/S19/S20 延伸 | 胜者后续合同/公司实态任一落件 |

## §6 源清单（20 源·A=官方/一手·B=权威转述·C=单源存疑）
- S1 hel.fi Helsinki 3D 官方页（A·**全文 fetch**）
- S2 1001smartcities.org Helsinki 3D+ 项目页（B·**全文 fetch**·9 声明含 Bentley/Aalto 引注链）
- S3 Bentley ESDG 城市级孪生页（B·snippet·€1M/2016-11）
- S4 WGIC Digital Synergy 页（B·snippet·€1M 三用途）
- S5 virtualcitySYSTEMs Helsinki 案例页+2025 参考报告 PDF（B·snippet·夜间增量）
- S6 avoindata.suomi.fi 3D models 数据集页+WFS API（A·snippet）
- S7 hri.fi New generation city models 页（B·snippet·全球首对双模型）
- S8 MDPI 2220-9964-9-10-602 供暖预测论文（B·snippet）
- S9 zoan.com/en/cases/virtual-helsinki（B·**全文 fetch**·30+ 制作清单）
- S10 zoan.com/en/about（C·snippet·Slush 2016）
- S11 jonathanbiz.com Virtual Helsinki 项目页（C·snippet·60 人团队/地产用途）
- S12 unrealengine.com ZOAN spotlight（B·snippet）
- S13 profwurzer.com Helsync 段（**C·单源存疑**·§5 回填行）
- S14 hel.fi Kalasatama Digital Twins PDF（A·snippet·二进制未解文本）
- S15 forumvirium.fi digital-twins+Smart Kalasatama 页（A·snippet）
- S16 testbed.hel.fi Mobility Lab 2023 试点页（A·snippet）
- S17 atlasofurbantech.org Smart Kalasatama（B·snippet）
- S18 smartcitieshub.eu Helsinki Energy Challenge 页（B·snippet）
- S19 solarthermalworld.org 胜者页（B·snippet·252/4 队）
- S20 aec-business.com 5CC+ 赫尔辛基聚会页（B·snippet·2026-05）
