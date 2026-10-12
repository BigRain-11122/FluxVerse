# R-20261012 · 4K 母版 + 2K/1K 自适应分级参考调研（性能分层 perf tiers 预注册配套）

> 领位：explore 队列 #7（O-023 roadmap M2 配套·runbook 点名下笔候选）·成件轮 r406。
> 令源：O-2026-0930-023 城市产品化令（4K 母版律+自适应 2K/1K+Steam 思路）·roadmap 正身=docs/_archive/city-pc-productization-roadmap.md（§二 三档定义表·§六 性能档预注册）。
> 判据落件：①Unity 官方 tier 实现路径（每档一 URP Asset+QualitySettings）②分辨率自适应两路（RenderScale 手动档 vs 系统 DRS）③标杆设置面拆解（C:S 系·roadmap §二.2 点名标杆=C:S I 设置面）④M2 三档矩阵预注册建议表（与 Phase 0 基线 b6b0a17 合流位）。
> Token 三问=**L1**（web 调研零生成触点·零 API 零 GPU——CEO 让路令 O-20261012-1115 纯 CPU/web 职合规）。

## §0 源账

| # | 源 | 通道 | 级 |
|---|---|---|---|
| S1 | Unity URP 16.0.6「Control URP Quality settings through code」 | web_fetch 全文直取 | ✅ |
| S2 | Unity 6000.4 URP Asset 手册 Quality 节 | 检索摘要 | 🔶 |
| S2b | Unity 6000.4 shadow cascades 页（S2 同域重定向落点） | web_fetch 直取 | ✅ |
| S3 | Unity 2021.3 Manual「Dynamic Resolution」 | web_fetch 全文直取 | ✅ |
| S4 | Unity 6000.3「Introduction to runtime performance scaling」 | 检索摘要 | 🔶 |
| S5 | URP API 15.0.7「Property renderScale」 | 检索摘要 | 🔶 |
| S6 | switchbladegaming C:S2 设置页（实测抓回=PCGamingWiki 特性表形态） | web_fetch 直取 | ✅（特性表级） |
| S7 | GamerTweak「Best Cities Skylines 2 Graphics Settings」逐项表 | web_fetch 直取 | ✅ |
| S8 | Reddit r/CitiesSkylines2 设置清单帖 | 检索摘要 | 🔶（辅助） |

**盲区注记（诚实律）**：①Unity Canvas Scaler 官方页未取（UI scale 面 roadmap §三.3 已定案=ScaleWithScreenSize 4K 设计基准+U184 共病清单·本件不重复立法只引用）；②C:S I 原版设置面全谱未直取（fpshq 页实测=显卡排行面·Steam 社区指南 login 墙·cs2.paradoxwikis JS 墙——C:S 系设置面以 S6/S7 的 C:S2 谱系承接，roadmap 点名 C:S I 的「分辨率+画质档」两层语义在 C:S2 同构成立）；③Tuanjie 2022.3 PC 端图形 API 默认态未取官方文档实证（§2 DRS 判读以保守口径写）。

## §1 Unity 官方 tier 实现路径（S1 全文直取）

**tier 正身=Project Quality levels+每档绑一个 URP Asset**：

- 每档一个 URP Asset（Create > Rendering > URP Asset），Project Settings > Quality 逐档指派（「Each quality level uses a URP Asset to control many of the specific graphics settings」「URP 3D Sample has this configuration by default」——S1 verbatim）。
- 运行时切换=`QualitySettings.SetQualityLevel(int)`（index=Quality 列表位·顶层=0；只数目标平台 enabled 档——S1 verbatim「This index only counts quality levels which you specified as enabled for the target platform」）。
- **官方启动自动分档范式（与我 roadmap §二.3「启动检测→默认档推荐」同构）**=S1 示例逐字：`switch (SystemInfo.graphicsMemorySize) { case <= 2048: SetQualityLevel(1); case <= 4096: SetQualityLevel(2); default: SetQualityLevel(0); }`——显存 2GB 线/4GB 线两刀分三档。
- 档外微调面=`GraphicsSettings.currentRenderPipeline as UniversalRenderPipelineAsset` 取当前 Asset 改 setter 属性（「fine tune performance on devices that doesn't perfectly match any quality level」）。
- **官方切换警告**：「only change Quality settings and URP Asset settings at runtime at points where performance is not essential, such as during loading screens or on static menus」——档位切换=主菜单/加载屏专用操作（临时显著性能冲击）→**设置面改档后重载场景/黑屏一拍再应用**=官方背书的交互形态。
- URP Asset 档差异官方语义（S2 🔶）：「These settings control the quality level of the URP. This is where you can make performance better on lower-end hardware or make graphics look better on higher-end hardware. If you want to have different settings for different hardware, you can configure these settings across multiple URP Assets」。

## §2 分辨率自适应两路：手动 RenderScale 档 vs 系统 DRS

**路 A（档位矩阵轴·正身路径）=URP Asset renderScale**：

- 语义（S5 🔶官方 API）：「renderScale: Specifies the render scale which scales the render target resolution used by this UniversalRenderPipelineAsset」——渲染分辨率 vs 屏幕分辨率的乘数，URP 全管线缩放。
- 每档 URP Asset 各持一个 renderScale 值=档位矩阵的一根轴（配合 §1 SetQualityLevel 切换零额外代码）。

**路 B（帧率反馈闭环·条件受限）=系统 Dynamic Resolution（S3 全文）**：

- 机制：GPU-bound 帧率将跌时逐步缩渲染分辨率保帧率（「If scaled gradually, dynamic resolution can be almost unnoticeable」）——Camera allowDynamicResolution+`ScalableBufferManager` 控 width/height scale，作用于该相机全部 render target（MRT 含）。
- **平台硬门（本件关键判据）**：S3 verbatim 支持平台清单=「Windows Standalone (**DirectX 12 only**)」——**Windows 桌面 DX11 下系统 DRS 不可用**。Tuanjie 2022.3 PC 默认图形 API 未实证（§0③）→保守判读：**M2 三档矩阵以路 A（手动 renderScale 档）为正身**；路 B 若 Tuanjie PC build 走 DX12 可作为「自动档」增强位（帧率目标反馈=load 档内微调·与设置面手动档并存）——M2 实现窗首跑 `SystemInfo.graphicsDeviceType` 实测定谳（判据一条·零成本）。
- 标杆侧证（S6）：C:S2 设置面把「Dynamic Resolution Scale Quality」做成用户档内开关（AMD CAS 90% 等·S8 同族）——引擎自实现 DRS=业界正身（非 Unity 系统面）；我方 M2=先手动档（矩阵轴）后自动档（增强位）同序。

**UI scale 层（引用不立法）**：roadmap §三.3 已定案=控件按 4K 设计基准铸+CanvasScaler ScaleWithScreenSize 随档缩放+U184 共病清单+真机点验——本件不重复。

## §3 C:S 系标杆设置面拆解（S6 特性表+S7 逐项推荐）

**两层语义（roadmap §二.2 点名标杆的现役形态）**：分辨率档（1080p/1440p/4K 输出）与画质档（预设+逐项）分立——我方 roadmap 三档表同构。

**C:S2 AA 预设谱（S6）**：FXAA/SMAA/TAA 三法各带 Low/Medium/High 档；高保真升档=FSR 1+DLSS 3.1（无原生 DLAA）；VSync=On/Off 二态；60 FPS/120+ FPS 目标档位。

**C:S2 性能向逐项推荐表（S7·22 项名值对·成本降序判读）**：

| 成本带 | 设置项 | 推荐值 |
|---|---|---|
| 先关（近零视觉损） | Fog/Volumetrics/Depth of Field/Motion Blur/DRS | Disabled |
| 降档（视觉损可控） | AA=FXAA Low·Clouds=Low·AO=Low·Shadow=Low | Low/Disabled |
| 中档 | GI/Reflections/Terrain/LOD/Animation | Medium |
| **保高档** | **Texture Quality** | **High** |

- **业界信号（S7 核心读点）**：性能向档里纹理仍保 High=纹理降档「省得少、糊得快」的业界共识——4K 母版纹理（roadmap §二.1）全档常开+降档走 Mipmap/流送（内存面）而非视觉档位面。
- **城规模联动轴的业界正身**：C:S2 独立档「Traffic Simulation Accuracy」（S6 检索面/S8）=模拟精度与画质分立分档——与 roadmap §六.4「城市规模（街区数/居民数/粒子）与档位联动」完全同构→**我方三档矩阵应含「城规模/模拟密度」第四轴**（居民 walker 数上限/粒子预算），不只渲染轴。

## §4 我方 M2 三档矩阵预注册建议表（与 Phase 0 基线合流位）

> 判读基础：Phase 0 三档实拍（b6b0a17·512m 白盒+相机三档）=现行基线输入（roadmap §三.3/§五.M0）；**具体数值带=Phase 0 帧率读数落地后定谳**（roadmap §六.1 判据锚·本表为参数轴预注册非终值）。

| 参数轴（实现位） | 标准 4K 3840×2160 | 均衡 2K 2560×1440 | 轻量 1K 1920×1080 |
|---|---|---|---|
| QualitySettings.SetQualityLevel | 档 0 | 档 1 | 档 2 |
| URP Asset（每档一 Asset·S1 范式） | 4K_HQ | 2K_MQ | 1K_LQ |
| renderScale（S5 轴） | 1.0 | 1.0 | 0.85（档内 GPU 减载备轴） |
| 阴影 maxDistance/级联（S2b 谱） | 150m/4 级联 | 100m/2 | 60m/1（无级联） |
| MSAA | 4× | 2× | 关（S7 FXAA 档备选） |
| 后处理族（S7 成本带同序） | 全开 | AO 降/体积雾关 | 仅 bloom/色彩 |
| 纹理（4K 母版律） | 满档 | 满档 | 满档（S7 业界信号·内存面另走流送） |
| LOD bias（QualitySettings 轴·S4 🔶） | 1.0 | 1.0-1.25 | 1.5（远裁早出） |
| 城规模联动轴（S3 §3 同构） | 街区/居民/粒子预算满 | 预算 ×0.7 | 预算 ×0.4 |
| UI scale（roadmap §三.3 引用） | 100% | 随档 | 随档 |

- **启动探测（S1 官方范式直引）**：`SystemInfo.graphicsMemorySize` 2GB/4GB 双刀+屏幕分辨率检测（Screen.currentResolution）→默认档推荐+手选覆盖（roadmap §二.3 全量承接·零新法）。
- **切换时机（S1 警告承接）**：设置面改档=主菜单态应用+场景重载（禁 in-scene 热切）。
- **帧率判据带（roadmap §六.3 引用不重复）**：4K=中端独显可玩下限/2K=主流流畅/1K=核显底线机不炸——M2 起每包三档帧率读数硬门（C:S II 反面教材=性能档禁拖 M4 后·roadmap §六.2）。

## §5 映射与后继

- **M2 实现窗直接输入**=§4 矩阵表（参数轴全谱+每档一 URP Asset 工程布局+启动探测两刀）——M2 排产时逐轴落 URP Asset 三件套+QualitySettings 三档配置+设置面接线（分辨率/画质/音量三件=roadmap §一.4）。
- **zoom 两端判据帧联动**：4K 档近端/远端判据帧（O-024）在 4K_HQ Asset 下注册；1K 档复跑同镜=档间观感衰减带取证（五闸预注册素材·roadmap §二.4）。
- **DX12 实测位（§2 判据）**=M2 首跑 `SystemInfo.graphicsDeviceType` 一行→路 B（DRS 自动档）开否定谳。
- **被动跟踪条回填**：explore 队列轮尾补「M2 三档矩阵实现窗消费跟踪」（本件 §4 引用判据·explore#61 同式）。

——r406 成件·源账 8（直取 5/摘要 3）·盲区 3 注记在案。
