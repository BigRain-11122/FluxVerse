# 硅基生命城市 Lowpoly 3D 施工参数单 v1

> **CEO 令链**：2026-09-28 晚原话「定URP，接下来定城市初始大小，地编方案，是否接入程序化，了解lowpoly在库资产，风格等，准备具体实施 什么摄像机视角，距离等！都要去」——本件=可开工参数全定谳。正典方案=`lowpoly3d-transition-plan.md` v2；数据=在库实查（本日 fbx 族谱+主图多模态）+R-01/02 调研件。

---

## 一 URP 定谳（CEO 令·已裁）

- 城市线=**URP 原生**；A/B 取消，Phase 0 改为「URP 验证跑」。
- **工程落位**：新建 `gaming\FluxVerse\City3D`（URP 原生·Tuanjie 1.10.3）——2D City 工程冻结不动（免 URP 转换破坏遗产材质）；P3D_Spike（内置管线）保留为资产中台/参照工程。
- **资产过桥**：Synty 包内 URP_ExtractMe（部分包在库）+ Tuanjie Render Pipeline Converter 兜底；判据=抽件渲染对比零色差。
- 反例注（在册）：低端 WebGL 设备 shader 未优化时关 SRP Batcher 或更快——验证跑读数把关。

## 二 城市初始大小（定谳）

- **初始核心城=512m×512m**（16×16 chunk·chunk=32m×32m）。
- 结构锚（承接 DESIGN §三 一核一环三城）：脑塔=原点；脑环广场 r≈40m；三城中心 r≈180m·120° 扇形·每城初始 ~100×100m 街区组；外环感知网 r≈240m 边线。
- 判据：L0 单视覆盖全城（§五）+机器人 5 分钟环城尺度感+Phase 0 实测微调（±20%）。
- 扩展：Phase 2→1024×1024m；远期 5000×5000m（CEO 大世界示意·性能预算另立专项）。

## 三 地编方案（定谳）

1. **地面=平面分块**（32m chunk·纯色/渐变图集材质分区：路面/广场/草地/水底），禁 Unity Terrain 高程；微起伏=AD-015 Terrain×26 件点缀。
2. **路网=数据驱动+AD-022 模块路面件**（实测在库：`SM_Env_Road_01/02/03/Arrow/Bare/Crossing/Lines/Median`）。几何律=**8m 网格正交为骨**（Synty 路件实测=固定宽度 90° 正交模块·含人行道）；曲线段=短直段折线逼近（每 8m 段转角 ≤15°）；复杂立交/异形路口=Phase 2 RoadArchitect 评估（过核验闸）。
3. **水系**=平面水 shader（WATER 数据同源）+AD-015 岸线件；倒影=Phase 2。
4. **数据桥**：`Tools/city/td-organic-data.txt`（2D 1 格）→ 3D 版式映射 **1 格=8–16m**（以 AD-022 路面件实测宽对齐定标·Phase 0 锁定）。
5. **窗灯改造件（实测短板确认）**：Synty 窗=几何色块无自发光——夜景点灯（DESIGN 核心视觉）须做 emission 改造材质变体（五色律驱动）；**屋顶补强件**（俯视主视觉短板）=自制/AI 生成径。
6. **灯光基线精化（R-04 落稿·防线二 Bloom 默认值直验✓）**：日夜循环三件套=主光锁 Sun Source 槽旋转+色温曲线（须开 useColorTemperature）+环境光 Source=Color 直写；**只烘 AO+动态物接 Light Probes（烘焙 GI 与动态太阳冲突·禁全城烘焙 GI）**；bloom=Threshold 0.9/Intensity 显式开/Scatter 0.7·性能序=关 HQ Filtering→Downscale Quarter→降 Max Iterations（默认 6）·tonemapping=Neutral；灯预算=每物体 9 灯帽（1 主+8 Additional）·WebGL 按 GLES3 16 保守·窗灯靠 emission 零实光。
7. **地编基线精化（R-03 落稿）**：禁 Terrain 定谳确认（设计律+C 级双源负面+Synty 平面实查）+**高程触发器=±2m 连续起伏才启高程路径**；水系=**InteractiveStylizedWater**（MIT·43★·须开 Depth+Opaque Texture·装前过核验闸；官方 urp-water-system 停 preview 禁装）；地面细节定序=材质分区→路面件自带标线→decal（Screen Space·禁 DBuffer）；大世界=首期全场景进首包+additive 最稳·5000m 走 Addressables 三坑检查表（Content-Encoding/IndexedDB DataCaching/bundle 少而大）+卡顿三律（allowSceneActivation 门控+激活分帧+shader 预热）·WASM 堆上限 2048MB 流送必选。

## 四 程序化接入判定（定谳）

- **结构层=禁程序化**：一核一环三城/路网骨架=设计数据驱动——设定结构不可随机生成。
- **辅助层=接程序化**（三项）：①植被/街道道具散布=PrefabScatterTool（MIT·过核验闸后装）或自写 scatter（seed 确定性）；②窗灯/贴花散布；③Phase 2 扩展区=程序化街区填充（Procedural-City·MIT·参数化参考·结构锚内填充）。
- **判定律**：程序化只做「重复件分布」，不做「城市结构」。

## 五 摄像机规格（定谳·俯视角 3D·透视相机）

| 档 | 用途 | 俯角(对水平面) | 高度带 | FOV |
|---|---|---|---|---|
| L0 总览 | 全城直播 | 50° | 280–400m（标称 320m） | 45° |
| L1 区景 | 城区内景 | 55° | 80–140m（标称 110m） | 45° |
| L2 实体 | 居民/机器人跟拍 | 60° | 16–40m（标称 24m） | 45° |

- 缩放带=高度 16m↔400m 连续平滑（MoveTowards 24/s·TDPlayer 惯例沿承）；边界 clamp 随城市 size 动态（TD 判例）；旋转=默认锁北向（地图读感），L2 跟拍可环绕；**正交模式=备选随时可切**（若要纯地图感）。
- 判据：Phase 0 三档实拍截图组（远/近双轨·U280 帧设计律）验证覆盖与观感，实测微调。

## 六 在库资产实查结论（2026-09-28 实测）

**件型在库确认**：AD-022 城市 325 fbx（Prop×175/Bld×75[含转角公寓族]/Env×65[全套路面件]/Veh×9）｜AD-021 城镇 695（住宅/教堂族）｜AD-002 商场 1965（Prop×1383+**Sign×274 招牌族**）｜AD-035 办公 792（QUANT 城）｜AD-015 自然 227（Tree×87/Rock×30/Terrain×26）｜AD-048 起始 70｜AD-018 科幻城 605（Bld×87+**Sign×80 霓虹**+**背景天际线大楼件**）｜AD-008 夜店 838（MEDIA 城）｜AD-010 粒子 58｜AD-039 3D 图标 520（含 Road 图标）。

**风格双包多模态实查**（预览图直读）：
- AD-022=平涂硬边低模·哑光玩具积木·美式都市符号；主色板=[#4E80AC 警服蓝/#8FCDE8 天空青/#EFBB33 出租黄/#6E6E72 沥青灰/#C9B295 米沙/#5FA050 树绿/#B33A31 车漆红/#EDEDEA 车白]。
- AD-018=Synthwave 赛博紫黄昏+霓虹[青 #4FE3DC/品红 #EA56C8/琥珀黄 #EFCF3]·暗底[#2B2150/#7B5EA8]；背景高楼=低面天际线填充层（空气透视·远景专用）。
- **五色律映射零调色成本**：数据青≈#4FE3DC·资金金≈#EFCF3·流量品红≈#EA56C8·警示红≈#EF6F76·CEO 纯白=#FFFFFF 塔顶光。

**短板三件确认**（实查加重）：窗无自发光（须 emission 改造）／屋顶细节有限（俯视主视觉短板）／路件 90° 正交固定宽（曲线须折线逼近）。

**脑塔=自产权 Hero 件**（预览分析判定「需独立 Hero 建模」）：模块堆叠+天线件+自研发光 Shader/粒子；AI 生成径（generate_3d_model 低模档+decimate 律）或手工堆叠，Phase 1 出首版。

## 七 实施准备清单（点火三步·CEO 一句话即执行）

0. **库内优先律（CEO 令 09-28「一定要好好利用我的lowpoly资产」）**：一切材料选型先查 48 包索引（AD-NNN 引用制）——库内有的禁外部生成/采购；真缺口须挂缺口判定（呈批留痕）才走 AI 生成/CCO 律；脑塔 Hero=库内模块堆叠主径+AI 件对照候选。
1. `tuanjie-cli projects create` 建 City3D（URP）——注意会自动开 GUI 编辑器实例（预热导入交该实例·收工判据=ImportWorker 归零×2+Editor.log 停摆 2 分钟）。
2. robocopy 首批 6 包（AD-048/022/015/042/010/039·梳理 SOP·meta 随行 GUID 稳定）+ URP 材质过桥（抽件对比判据）。
3. Phase 0 验证跑：512m 白盒骨架（脑环+单街区）+L0/L1/L2 三档相机实拍+帧率读数（WebGL 30fps 底线）+双轨截图组+**活性管道贯通件**（白盒脑塔 OS_TICK 呼吸灯·脉冲时刻=事件流拍点对账帧·§八）→ 过 CEO 复验 → Phase 1 全面开工。

## 八 城市活性（CEO 令「重点研究怎么让硅基城市真正的活起来」·正典=`lowpoly3d-aliveness-plan.md`）

1. **总律=真数据投影非模拟**：引擎零行为逻辑，只读消费三流（world-state.json 91KB/10s 轮询·world-events.jsonl 10s 游标增量·citizen-behavior.jsonl 1.3MB/10min 一次载入）；一切演出对应一次真实行为（禁装饰性动画律·P-41 3D 重锚表见正典 §2.2）。
2. **群体律施工红线（波① `R-20260928-alive3d-01`·防线二过）**：禁 Animator+SkinnedMeshRenderer 群体路（SMR 不可 instancing·A）；L1 行人=无骨骼假动画首选（A 级原语）+VAT 顶点动画跃升档（数千级·闸3 实测）；L0 光点 <256 顶点不宜 instancing→单 buffer 合批/CPU 粒子；instancing 单批 1023 上限；AnimationInstancing 判负不采；skinning 坑律措辞修正=双优化失效（多线程+SIMD）非整体失效。
3. **演出载体红线（波②③）**：**VFX Graph 禁入 WebGL 演出面**（硬要求 compute+SSBO·WebGL2 无 compute——System-Requirements 页直证+装机验证 SystemInfo.supportsComputeShaders 兜底）；**运行时 emission/着色脉冲禁用 MaterialPropertyBlock**（URP 下 MPB 掉 SRP Batcher 合批·官方 API 页直证）——正法=少量材质实例（renderer.material）+同 shader variant；一次性脉冲=脚本驱动+ParticleSystem Stop Action 自动回收+**ObjectPool 池化**（高频复用·官方池示例即粒子池）；循环待机件开 Prewarm；移动拖尾（光点过江）=Simulation Space World；粒子预算显式设 Max Particles+Ring Buffer 护栏（粒子 shader 本不走 SRP Batcher）；**街带光流=移动发光条**（Unlit+Additive+GPU Instancing·一 TRANSFER 一实例）；**路径=waypoint 队列插值**（NavMesh 判负·既定路线数据投影⇏寻路）；Splines 包（com.unity.splines·另装·2.5.2 中国档）=艺术曲线备用·装机首验；Timeline=WebGL 无平台限制记载🟡·留多轨复杂编排备用（主径维持脚本驱动）。
4. **待 CEO 裁**：居民 3D 呈现形态 A 低模人形/B 发光生命体/C 混合双态（推荐 C·Phase 2 居民层开工前定谳）——选项详情见正典 §六。
