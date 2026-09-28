# 硅基生命城市 Lowpoly 3D 美术转型全盘方案

> **CEO 令锚定（2026-09-28）**：原话「全面转型lowplay 3D风格，把相关方案，规划，技术，资产等全部弄好，还有对应skill等，github的知识，工具等」+ 定语令「我说的是硅基生命城市美术风格」。
> **法令变更注记**：旧令「全部是2D 不碰3D」（2026-09-23·DESIGN.md 头部原话立法）就**硅基生命城市美术面**由本令解除（同源 CEO·新令驭旧令）；「游戏是团结引擎原生」「高科技元宇宙风格」「AI 所有的行为都要在集团总控里面能看到实时的游戏化的表现」三正典**不变**。本件=该令的全盘架构面（先全盘后局部律）。v1.1=调研证据并入（R-02 落稿·防线二双承重直验✓）。

---

## 〇 定位与红线速览

1. **转什么**：City 工程视觉层 2D→**lowpoly 3D（俯视角）**；**不转**：world 数据层（world/*.jsonl+探针链）/治理闭环/行为脚本语义/参观端合规律——数据与行为面全平移。
2. **红线①（许可·L1）**：48 包=Synty POLYGON 淘宝转售来源，无有效商业授权（`俯视角3D资产_POLYGON48包全景梳理.md` §〇 红线①）——**禁入交付链/提审包/商用面**；原型探索/风格验证/规格研究=完全合规。商业化前置=正版采购 gate（首批 6-10 包·$10-30/包·梳理 §七 待 CEO 裁）。
3. **红线②（敏感面）**：城市任何 UI/参观端界面**禁金融行情视觉**（界面敏感面律）；QUANT 城表现 3D 化沿用「中性金屏」判例，禁 K 线元素。
4. **红线③（AIGC）**：AI 生成 3D 资产入参观端 → 开门帧显著 AIGC 标识（合规律硬判据）。
5. **正典链**：DESIGN.md（世界观/器官表不变）+ TECH.md（技术底座不变）互文；DESIGN §九 视觉律（2D 像素）由本件 §二 承接升维——**DESIGN v4 视觉律改版待批**（Phase 0 判据帧后一并呈，不抢跑改设定书）。

---

## 一 现状盘点（2026-09-28 实测）

- **2D 遗产（冻结留档·不删）**：City 五场景（CityScene / TopDownDemo / TopDownTileCity / TDQualitySample / SampleScene）+ M1 系证据图 r9~r189；TD 判例链（瓦片真拼接 SOP/有机布局/切片律）**数据面复用**——`Tools/city/td-organic-layout.py` 的路网/水系/广场格数据直接转 3D 版式驱动。
- **行为层（平移复用·42 个 C#）**：EventRouter/CityEventRouter（事件总线）、MoodDirector（情绪）、NeonSigns/CityWindowLight/RimLight（光效语义）、Resident*（居民卡/标签/气泡）、VehicleRules（车流）、CityWaterFx/LightFx（水光粒子）、RobotRules（机器人）、Labs*（实验区）、CameraRig/CityCameraRig（相机）——3D 转型=视觉载体替换+行为层接线保留。
- **数据层（不动）**：world/（market-clock-weather-census-git 探针面·TECH.md 底座）——城市血肉仍由真实实况驱动。
- **资产底座（✓ 就绪）**：P3D_Spike 中台工程（`MiniGame/projects/P3D_Spike`·1.10.3·内置管线）48 包 4.05GB/13.7 万件全量导入零错误、GUID 稳定——**点开即用**；lowpoly 库九大风格类·AD-001~048·引用法「AD-NNN+一句话」。
- **SiliconToon v0.1**（P3D r2·二次元线自研渲染首弹）=并道不同轨（toon 描边≠flat 平涂），渲染技术积累互供不混线。

---

## 二 风格定谳与视觉规格

- **定谳**：Synty POLYGON 平涂低模族（48 包同风格、跨包混搭零违和——梳理 §〇 实测）；相机=俯视角 3D（倾斜 45–60°），与 2D TD 遗产视线连续性最短。
- **光色五色律延续**：数据青/资金金/流量品红/警示红/CEO 纯白 → 3D 自发光（emission 窗灯/霓虹/地标光晕）；超体蓝归脑塔与实验区。
- **昼夜色轮延续**：环境光随真实北京时间轮转（clock 探针同源·黄昏暖紫/夜蓝黑档）。
- **材质律（R-02·A×2 双证）**：flat 材质=「一张共享渐变图集」路（Synty 仓内实测+Kaykit 官方页同构）——换色=挪 UV，同图集跨包混搭零违和；备选=纯色材质（SRP Batcher 下多材质近乎免费）；顶点色路待证。
- **俯视角已知短板与正法**（梳理 §四 实测）：顶面细节弱→补屋顶道具/贴花；阔叶树冠遮挡→细高树种或遮挡淡出；平涂材质对直射光敏感→**斜定向光+烘焙 AO**；角色俯视辨识→头饰配色+描边。
- **缺口三件**（梳理 §五）：人形动画→**generate_motion 出 Mixamo-rig FBX**（版权最干净·解B）；屋顶补强件→自制/AI 生成径；HUD/UI→沿用 2D 库通道（AA 系）+ U284 母版 SOP。

---

## 三 技术选型（判据先行·不拍脑袋）

1. **渲染管线=Phase 0 A/B 实测定谳（证据天平倾向 URP）**：
   - **A 内置管线**：唯一优势=零转换（P3D_Spike 已实证 48 包 13.7 万件导入零错、Synty 材质直用、贴图极小合批友好）；
   - **B URP（证据倾向）**：SRP Batcher 官方兼容表 **Built-in:No·URP:Yes**（Unity 2022.3 Manual·防线二直验✓）+CPU 提速 **1.2x–4x**（Unity 官方博客·Boat Attack 实测×2.13）——城市场景=「海量同款材质」=SRP Batcher 受益型；**WebGL 参观端 CPU(WebAssembly)=瓶颈**（Unity 官方手册）→提速在参观端更承重；Synty 部分包自带 URP_ExtractMe 转换桥；二次元线 URP 经验在册（P-17）。官方反例注：低端设备 shader 未优化时关 SRP Batcher 或更快→保留 A/B 实测定谳；
   - **判据**：同街区切片 A/B 双跑——帧率（WebGL 端 30fps@1080p 底线）+ 窗灯/霓虹发光观感 + 转换成本。数据呈报后 CEO 一句话定谳（花钱决策律：本地验证后再投转换工）。
2. **相机**：俯视角 3D 透视；CityCameraRig 改造复用；L0 总览→L1 区景→L2 实体跟拍=相机预设位三档（DESIGN §八 看查令三态连续性）。
3. **装配律**：**数据驱动延续**——3D 摆放脚本读 td-organic-data 同源数据（路网/水系/桥/广场/树点位），Synty 模块化建筑=拼图装配（程序化+手工混合）；引用一律 AD-NNN。
4. **性能预算框架**：单件几十~两千面（梳理 §三）；合批=静态合批+GPU instancing 优先；WebGL 端 draw call/三角形预算数=Phase 0 实测填入（SRP Batcher 数字=R-02 已供：CPU 1.2x-4x 口径）。
5. **光照（R-02 证据版）**：斜定向光+烘焙 AO（梳理判据·平涂对直射敏感）；渐变天空盒+环境光取天空盒色（转主光即得晨昏——与昼夜色轮天然对接）；**静态城烘焙化、实时光仅留动态件与角色**（R-02·推测级·样区验证收口）；窗灯=emission；水面反射=Phase 2 简化方案。
6. **WebGL 参观端七坑（R-02·Unity 2022.3 官方手册）**：CPU(WebAssembly)=瓶颈面／无多线程+skinning 双优化失效（角色动画贵）／后台标签节流 1fps（须挂钟时间兜底）／Exception support=None／帧率交浏览器节律／音频走 Web Audio 基础功能（FMOD 依赖线程不可用）／**Chrome Autoplay=BGM 需用户交互后播（参观端首坑·开门帧交互即解）**。

---

## 四 资产三径（生产/交付分治）

| 径 | 用途 | 状态 | 判据/门槛 |
|---|---|---|---|
| L1 库（AD-NNN·P3D_Spike） | 原型/风格验证/规格研究 | ✓ 即用 | 禁入交付链；商业化 gate=正版采购 |
| 正版采购（Synty 官网/Asset Store） | 参观端/商业面 | ⏳ 待 CEO 裁 | 首批 6-10 包·$10-30/包·只购验证用得上的包 |
| CC0（TJ search_asset_lib·Kenney/Kaykit/Quaternius 3D） | **可入交付链**的城市件/补充件 | ✓ 通道实测在册；许可双官方直证（Kenney FAQ+Kaykit 页·商用零署名·R-02） | 零许可风险；**城市向新发现=KayKit City Builder Bits + Quaternius Downtown City MegaKit（300+ 城市模块·CC0）** |
| AI 生成（generate_3d_model rodin/tripo 低模档 + generate_motion） | 缺口件/自产权件 | ✓ 通道在册 | 收件三查（U282）；**decimate 律：AI 档上限 2-2.5 万面≫Synty 量级，入城前必减面至几百~2 千面**（R-02）；参观端 AIGC 标识 |

**区→包映射表（每格 AD-NNN+一句话·引用法合规）**：
- 脑塔+实验区（脑环/晶片）＝AD-006 科幻世界+AD-018 科幻城市（霓虹 Sign×80）+AD-020 太空（飞船塔件）——CEO 纯白塔顶+超体蓝光晕为自产改造件
- GAME 城＝AD-022 城市包（俯视街区主力）+AD-002 商场+AD-021 城镇+AD-035 办公+AD-042 都市人物
- QUANT 城＝AD-035 办公楼+AD-037 银行（Heist）——行情屏走「中性金屏」自制件（敏感面律）
- MEDIA 城＝AD-008 夜店（灯光件）+AD-018 霓虹招牌
- 植被/水系/地形＝AD-015 自然包；白盒底座＝AD-048+AD-025；反馈层＝AD-010 粒子+AD-039 3D 图标
- 街道机器人（血细胞）＝AD-042 人物件改造+AI 生成径补

---

## 五 实施路线图（Phase+判据+验收）

| Phase | 内容 | 判据/验收 |
|---|---|---|
| **0 spike**（1 个夜窗） | P3D_Spike 内起步 6 包（AD-048+022+015+042+010+039）拼一个街区切片；A/B 管线双跑 | 帧率读数（30fps 底线）+远/近双轨判据截图组（U280 帧设计律）+导入零错误 → 过 CEO 复验 |
| **1 城市骨架** | City 新建 3D 主场景；数据驱动装配（路网/水系复用）；脑塔+三城白盒（AD-048）；行为层首批接线（呼吸灯/commit 信使/机器人） | 行为映射表（DESIGN §七）逐条点亮可验；六词终验 |
| **2 血肉填充** | 分区 Synty 化（§四映射表）；窗灯/霓虹/水光/粒子；居民 3D 化（AD-042+generate_motion）；L1/L2 相机位 | 实况驱动抽查（真 commit→信使可见）；性能预算达标 |
| **3 参观端** | WebGL 构建+AIGC 标识+敏感面自检；**正版采购 gate 在此 Phase 前执行**；WebGL 七坑逐项过闸（§三.6） | 合规判据全绿；CEO 验收 |

每 Phase 收口=定向提交+证据图组（JPEG q88 律）+轮终验。

---

## 六 合规与法令

- 法令变更：09-23「全部是2D」城市美术面解除（本件头部锚定）；DESIGN.md v4 视觉律升维**待批**（Phase 0 后呈）。
- L1 许可 gate（§四表）；AIGC 标识（合规律）；界面敏感面律；静默律（一切新计划任务静默注册）。

---

## 七 GitHub 知识与工具面（调研件指针）

- `C:\Users\sjs20\Desktop\FluxGroup\cph4\research\R-20260928-lowpoly3d-city-tools-01.md`——**已落稿**（52 行·A 级双证·判负留痕）。**工具箱速览**（装前一律过核验闸）：路网=**RoadArchitect**（MIT·364★·2026-09-27 仍提交·防线二直验✓）+Unity Splines 官方底座（许可待证）；程序化摆放=PrefabScatterTool（MIT·PM Git 直装）；城生成参考=Procedural-City（MIT·参数化街区+Perlin 楼高）；**合批/LOD=Unity 内置即正解**（官方优先级链：SRP Batcher+静态合批→GPU instancing→动态合批）；draw call 预算=社区 C 级起步值（<100-200/帧）·终值机队实测定标
- `C:\Users\sjs20\Desktop\FluxGroup\cph4\research\R-20260928-lowpoly3d-city-tools-02.md`——**已落稿**（42 行·A 级源 8·三态断言 15确认/3推测/3待证；防线二双承重直验✓：SRP Batcher 官方兼容表+Kenney/Kaykit CC0 双源）
- GitHub MCP 通道已配（PAT 未设=CEO 物理件，设后 API 配额解锁）；**今日 API 匿名配额已实证打满**——调研一律走网页检索径（已执行·两波全程 GitHub API 零调用）。

---

## 八 待裁项（呈 CEO·三件）

1. **正版采购预案授权**（触发=Phase 3 前）——零成本前置验证路径=Phase 0-2 全程 L1 库合规使用，采购只在商用 gate 执行。
2. **管线 A/B 定谳**：Phase 0 实测数据呈报后一句话裁（**证据现倾向 B·URP**；A 唯一优势=零转换）。
3. **DESIGN.md v4 视觉律升维**：Phase 0 判据帧过目后批。

---

*配套技能：`.codely-cli/skills/lowpoly-city-3d/SKILL.md`（装配 SOP/引用法/坑律/判据速查）。本方案落档 2026-09-28·执行主体=FluxVerse 车道。v1.1 修订=调研证据并入（同日）。*
