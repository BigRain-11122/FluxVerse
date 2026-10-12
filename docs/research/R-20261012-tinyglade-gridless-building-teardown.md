# R-20261012 Tiny Glade gridless 建筑玩具拆解（竞品拆解·P3 explore 线·r413）

> 拆解对象=Tiny Glade（Pounce Light·2024-09-23 上 Steam·$15·gridless 城堡/村庄 diorama 建造玩具）。
> 定位=**Townscaper 拆解（R-20261012-townscaper-mixed-initiative-teardown.md）的姊妹件**——「微型建筑玩具」双件配对（Olof Gustafsson 单人件→Pounce Light 双人件），供 R2 模块壳设计窗并读消费。
> 源账：**web_fetch 直取 5**〔S1 GameDiscoverCo 创始人 Q&A 全文/S2 shapes.inc building-tools 机制页/S3 官方 pouncelight.games info 页/S4 80.lv 墙生成器报道/S5 CozyWiki 词条（嵌开发者访谈原文）〕+**检索摘要面 3**〔S6 hbeau tiny-docs 社区逆向文档/S7 GameDiscoverCo 转载件（gameindustrylibrary 同文）+GameSensor 档/S8 SteamDB 页面描述〕——摘要面未直取全文处逐处如实注。

## §0 结论速览（三句式）

1. **现象**：两人瑞典微型团队（Anastasia Opara+Tomasz Stachowiak）以 Rust+魔改 Bevy+自研 Vulkan compute 渲染层，两年开发期后 $15 买断制上线，**首月 616,000 份+上线日 10,000+ CCU+1,375,441 愿望单+97% 好评**——「程序化细节替玩家把粗糙意图装饰成精致成品」的 gridless 建筑玩具完成品类级验证。
2. **判读**：其可迁移内核不是美术风格而是**「意图解释器」范式**——玩家只做极简手势（拖墙/画路/叠压建筑），系统即时解释为成品（画路穿墙→自动开拱门·拖建筑相叠→无缝合并·装饰全系统代撒）；对 R2 模块壳的直接启示=**模块接缝的视觉消化靠装饰自动化层，输入面极简化而复杂度全部内置于解释器侧**。
3. **消费位**：R2 街区/生成器设计窗（与 Townscaper §3 三法配对成「微型建筑玩具拆解双件」）+10-18 演化日窗提案的变现谱系对照面（纯玩具买断 vs 我方活动承办双端点）。

## §1 商业面（S1 直取 verbatim 为主）

- **销量/愿望单**：「616,000 copies sold in less than a month, pretty much guaranteeing Tiny Glade is selling a million or two over time」+「launched with a mindblowing 1,375,441 Steam wishlists」（S1 创始人自晒 Steam 后台）；「the big spike at ~20k [daily additions] around May 2024 is Steam Next Fest」（S1）+「Top 10 appearance in June's Next Fest」+「after a two-year dev period」（S1）。
- **活跃结构**：「10,000+ CCU on launch, and >1,000 CCU even now」+「the big DAU number compared to CCU - ~30x, versus 8-10x for stickier titles」+「97% Positive in user reviews」+「the median time played of just 1 hour 4 minutes」（S1）；转载面 34,000 日活/1,000 CCU 稳态（S7 摘要·与 S1 全文一致）；美国市场占 32%（S7 gameindustrylibrary 摘要）。
- **支付结构判读**：「at its heart, a gorgeous software toy. It doesn't have in-game goals - it's a sandbox. The people who bought it love it, and want to support it」（S1 verbatim）——**median 64 分钟游玩+97% 好评=「为玩具付费非为进度付费」的正身证据**；低时长不被视为负（「We don't really see low play time as a negative here」S1）。
- **受众带自证**：「Interested in freeform town/city builders, like Townscaper and Dorfromantik. Delighted by cozy games with more abstract goals, like Unpacking. Fans of medieval city-builders, like Banished and Manor Lords」（S1 官方受众画像三条 verbatim）。
- 诚实注：GameSensor 档「released on July 31, 2024」与 S1/S2 双源 9-23 矛盾→该档弃用不入主结论。

## §2 技术面

- **语言/引擎栈**：「Tiny Glade is written in the Rust programming language, and uses hundreds of open source 'crates'. Notably, it relies on the ECS, scheduling and a few other thingamabobs from the Bevy engine. On the more traditional side, it uses FMOD for audio」（S3 官方 info 页 verbatim）；「a custom Vulkan-based renderer built for the compute-shader work Bevy couldn't yet do」（S5 词条）；「we're still using a modified version of Bevy to this day. Technically, at the base level we have the framework called the ECS」（S5 嵌访谈）。
- **渲染自研动因**：「Anastasia's prototype was using Bevy for everything, including rendering, but eventually, our needs outscaled what Bevy could provide at the time, as the need for the project was to have prettier graphics and better procedural generation on the GPU」（S5 verbatim）——**程序化生成前置于 GPU**是其建筑系统实时性的技术底座；官方 info 页挂 in-house 渲染技术 talk（S3 链 jusWW2pPnA0·未取视频内容如实注）。
- **起源链**：墙生成器周末项目→「Procedural Artist at Embark Studios Anastasia Opara continues the development of her procedural wall generator... adding new features like archways and paths, experimenting with uneven terrain」（S4 80.lv 早期报道）；「During the early days of Tiny Glade, I was still working full-time at Embark Studios... I was waking up at 4 AM just so I could get something done before the actual work started at 9」（S5 嵌访谈 verbatim）——**拱门/路径/起伏地形自墙生成器期即为核心特性族**（非上线前补丁式追加）。
- **资产双轨制**：「Many of Tiny Glade's built-in meshes are stored as JSON files containing arrays of points... Exceptions include buildings, roofs, and some other objects that are generated procedurally」（S6 社区逆向文档·摘要面）——**静态杂物=数据资产（可 mod 替换）/建筑与屋顶=运行时生成**的双轨边界，与其 v1.16 Workshop modding 面一致（「Add clutter meshes, Replace built-in assets -- meshes, textures, configs」S3 verbatim：mod 只及资产轨不及生成轨）。

## §3 设计法三法（R2 模块壳消费主位·与 Townscaper §3 并读）

- **L1 意图解释器（vs 参数面板）**：「a sophisticated procedural system that interprets player intent; for example, drawing a path through a wall will automatically generate an archway, while dragging a building into another will create seamless [merge]」（S2·末句源文截断如实注）——输入面=极简手势，复杂度全部内置解释器侧；对 R2 生成器输入门禁件（r2-spec-input 38 行自检）的对照启示：**面向玩家的生成器接口候选=「手势级输入+解释器兜底」而非「参数级输入」**（我方生成器为离线管线·此法主要供后续任何玩家可编辑面预留）。
- **L2 gridless 化学反应**：「Explore gridless building chemistry as the game adorns your glades with procedural detail. No management, combat or goals」（S8 SteamDB 官方描述·摘要面）——组合件互反应（墙+路→拱门·建筑相叠→合并）而非网格拼装；Townscaper P1 连接约束律的「松散化」进阶：**连接约束从网格拓扑解耦为碰撞/邻近解释**。
- **L3 装饰自动化层**：ivy/草/灯全系统代撒（S8「adorns your glades with procedural detail」）——**模块拼接缝的视觉消化交由装饰层**：R2 模块化城市块两大视觉破绽（同模块重复感+接缝裸露）的姊妹解法=Townscaper P5「生成装饰分离律」+本件「装饰即缝的遮蔽层」；落地位=装饰散布后置于生成管线尾段（生成装饰分离·两件同结论）。

## §4 消费校准与提案映射

- **R2 模块壳设计窗**：§3 L1-L3 与 Townscaper §3 三法（P1 连接约束/P3 recipe 优先级/P5 生成装饰分离）配对并读成六法池；生成器实现窗消费面已在 explore#67（Townscaper）+本件新跟踪行（explore#105）双位挂账。
- **10-18 提案映射（活动承办经济学的对照端点）**：Tiny Glade=「纯玩具买断」端（$15·median 64min·97% 好评=为作品感付费）vs ZOAN 虚拟赫尔辛基=「活动承办」端（r386 单场 €1M 量级）——**无目标沙盒的支付意愿来自「作品感/支持感」非时长**，为提案的风险面提供「若城内活动承办不振·玩具化买断/装饰包是何种退路」的参照带。
- **过程可见律同构（本司机制面）**：「the game was rarely not viral... every single video (or demo) that the game has ever put out, from early viral Tweets to the Future Games Show 2023 trailer and beyond, screams 'this'll be so fun to build things in, play me!'」（S1 verbatim）——两年期 WIP 视频持续发布=「过程可看性即营销资产」的竞品级正身证据（与我司 CEO 过程可见律同构·硅基窗/取证明线的行业先例锚）。
- **小团队可建性先例**：两人×两年×自研渲染栈=微型团队完成「品类验证级产品」的工程先例（对 P1 署名面无直接动作·仅可建性参照）。

## §5 回填行

〔设计窗/生成器实现窗开工时回填一行：三法消费结论+是否采纳判读+指针回本件〕
