# R-20261012 · 微信小游戏 3D 性能上限案例集（团结 WeChat 分发面参考）

> 领条：explore#9（queue/explore.md）·成件轮 r376·2026-10-12。
> 消费面：R-20261012-r2-block-expansion-selection-pool-final.md §1 **G3 包体预算闸**校准输入＋O-023 roadmap M0-M5 性能分层（explore#7 关联）＋City3D R2 后续 WeChat 提审包体预演底数。
> 源（8 源·官方 5）：①微信开放文档·性能优化总览（developers.weixin.qq.com/minigame/dev/guide/game-engine/unity-webgl-transform/Design/PerfOptimization.html）②同·Unity 游戏接入指南五阶段（…/Design/Guide.html）③同·Unity/团结引擎适配首页（…/unity-webgl-transform.html）④团结官方 UOS 微信小游戏示例页（uos.unity.cn/docs/upr/minigame.html）⑤Unite 上海 2024「WebGL 平台的性能限制与解决方案」深讲（pps43.github.io/posts/unite2024_wechatminigame/）⑥Cocos Creator 3.8 官方·iOS 微信小游戏内存与性能优化指南（docs.cocos.com/creator/3.8/manual/zh/editor/publish/wechat-ios-optimize.html）⑦搜狐 TMT 2025-07·诛仙/天龙团结引擎报道（sohu.com/a/909902877_120188377）⑧团结引擎官方手册·微信小游戏（docs.unity.cn/cn/tuanjiemanual/Manual/weixinminigame.html）。
> 取源法注：官方「性能评估标准」数值表为图片面（总览页 §二内嵌·文本解析不可达）＝本件已知盲区·已转 explore 新条跟踪。

## §0 结论（TL;DR）
3D 上微信小游戏＝**成熟可行路**（团结 WeixinMiniGame 专属目标平台·Unity 工程免重写零成本转换），但天花板由**内存**而非算力决定：iOS 普通模式 JSCore 无 JIT（官方水族馆基准 iPhone 11 Pro Max 仅 13fps）→ 高性能模式切 WebKit 内核带 JIT 后 **49fps（3.7×）**＝**iOS 高性能模式=3D 小游戏生死开关**（MP 后台「生产提效包」申请·game.json `iOSHighPerformance:true`）。内存硬线＝iOS 2G RAM 机型 **1G**/3G RAM 机型 **1.4G**（超线系统杀进程·Cocos 官方口径），Unite 2024 现场建议休闲 3D **整包预留 ≤256MB**。对 City3D：lowpoly 静态城＝对路型（蒙皮短板天然不咬合·合批/draw call 才是主战场）；R2 选型池 G3 闸以「AB 单包 ≤2MB·资源请求并发 ≤20·贴图 maxsize ≤1024 无 mipmap·字体压缩前 ≤4MB」官方口径校准。

## §1 平台硬约束层（官方口径汇总）
| 维度 | 硬数 | 源 |
|---|---|---|
| 包体四值 | 主包 ≤4M／总 ≤30M／单普通分包不限／独立分包 ≤4M（本仓 benchmarks 在册口径同） | 在册+r219 |
| iOS 内存线 | 2G RAM 机型 1G·3G RAM 机型 1.4G·超线杀进程 | ⑥Cocos 官方引微信口径 |
| 休闲 3D 预算 | 整包预留 ≤256MB（现场建议） | ⑤Unite 2024 |
| 内存大头三件 | WASM 加载编译 **370MB**＋堆内存空隙 90MB＋模拟文件系统 60MB（Unity WebGL 原版实测） | ⑤Unite 2024 |
| 基础库常驻 | ~70M 不可优化 | ⑥Cocos 官方 |
| JIT 面 | iOS 普通=JSCore 无 JIT·高性能=WebKit 有 JIT；Android=V8 恒有 JIT | ⑤⑥ |
| 水族馆基准 | iPhone 11 Pro Max：高性能 49fps vs 普通 13fps | ⑥引微信官方文档 |
| socket | 禁原生 Socket→UnityWebRequest/WebSocket（微信 SDK 补 UDP） | ②⑤ |
| 本地缓存 | 资源缓存 200MB·可申请 1GB；JS 模拟 FS 切断写入 IndexedDB | ⑤ |
| 资源纪律 | AB 单包 ≤2MB·请求并发 ≤20·贴图 ≤1024 且尽量无 mipmap 不可写·字体压缩前 ≤4MB·音频强制单声道 | ①官方总览 |
| 渲染 API | WebGL1／WebGL2（转换工具勾选·beta）；无 compute shader（Unity WebGL 技术限制·团结在改） | ①⑤ |
| 失焦降频 | 页面失焦/不可见强制 1FPS（Web 固有·城市常驻挂机设计须避开依赖后台帧） | ⑤ |

## §2 引擎分发面（团结/Unity WebGL 转换路线·City3D 同栈）
1. **五阶段官方流程**（②）：兼容性评估→项目转换→平台能力接入→体验调优→发布监控；转换工具勾 WebGL2.0(beta) 导出 /minigame 包 + /webgl 资源目录上 CDN+域名白名单。阶段一有官方「成功转换案例」手册页（案例清单正源·文本面下轮跟踪）。
2. **WASM 代码分包**（①②）：wasm 拆 2 件＝首包（小·先跑）+延迟包（主逻辑）——**同时降内存与脚本编译时间**；Unity 导出原版 wasm 需整件先载，分包后首场景秒级呈现可行。
3. **压缩纹理工具**（①②）：纹理从 bundle 分离·CDN 按 GPU 支持格式（ASTC/ETC 系）按需下载——减包体+减内存+GPU 硬解更快；重度游戏官方点名必做（City3D 城市贴图族适用）。
4. **AutoStreaming/UOS CDN**（④）：团结编辑器 AutoStreaming Editor 自动收 Build 场景/AB 标签/Resources/Addressable 引用资源→流式化+占位图生成；UOS CDN（Unity 官方·蓝云运营）托管资源，Unity 中国域名（a.unity.cn 等）须入白名单；**团结转换 SDK 正源=gitee.com/wechat-minigame/minigame-tuanjie-transform-sdk**（r219 勘正同源再证）。
5. **团结两条技术路线**（⑤·Unite 2024 官方口径）：
   - 路线一·改进 Unity WebGL（IL2CPP 改进）：包体降至原版 **80%**；global-metadata 延迟加载（14MB 文件原吃 60+MB 内存→优化后 30MB·实测用量占很小部分）；generic 表 HashMap→数组省 20% 初始化时间；WebAssembly **SIMD** 重写 UnityMath；GPU Skinning（transform feedback·不可与 SIMD 蒙皮共用）；粒子 Dynamic VBO 池；shader 变体只解压 blob 表头按需加载；内存对齐 16B→4B；InstanceID 紧凑结构。
   - 路线二·DotnetRuntime（WebCIL）：包体 **60%**·内存省 20%（demo 口径·复杂项目更多）·构建快·代码热更新·代价 FrameTime +5%。
   - 配套：Managed stripping **Extreme**（函数级剔除·Experimental·⑧）。
6. **启动留客件**（①②）：封面图/视频+文案+进度条样式+封面自动隐藏时机＝官方承认的加载期过渡方案（City3D 首屏大资源载入期必配）；预下载利用 Loader 期 CPU 密集但网络空闲的窗口拉资源。

## §3 案例集（3D 实锚·按证据强度排序）
| 案例 | 类型 | 实锚 | 源 |
|---|---|---|---|
| 官方水族馆 benchmark | 3D 基准 | iPhone 11 Pro Max 高性能 49fps/普通 13fps | ⑥引官方 |
| Boat Attack（URP 3D 赛艇示例） | 团结官方转换案例 | **首包 11.15MB** 转换实录（团结 1.2.0·官方开发笔记） | ④+搜索摘要 |
| 《不服咱碰碰》 | 团结官方示例工程 | WeixinMiniGame 示例正身（UOS 托管全流程） | ④ |
| 《诛仙手游》小游戏 | 商用 MMORPG 大游戏转小 | **2024 年底正式上线**（完美世界·团结引擎） | ⑦ |
| 《天龙八部2》小游戏 | 商用·备测中 | 项目启动到首次真机运行 **~4 个月**（2025 备测） | ⑦ |
| 生态规模 | 平台面 | 团结引擎开发者约 1 万名；1.4.0 微信 build target 升级为小游戏平台（多子平台+Build Profile 一键多配置）；1.5.0 增抖音小游戏 | ⑦⑧ |
| （参照·非团结）Cocos iOS 生态 | 同平台异引擎 | ASTC 纹理内存比 PNG 小 >50%（文件反而更大→远程分包）；双通道音频实例 ~20M；中文 TTF 加载后 ≥10M→建议系统字/Bitmap/SDF；动态合批 iOS 建议禁用换 ASTC | ⑥ |

判读：**重 3D（MMORPG 级）已被团结-微信路线跑通上线**（诛仙），4 个月首真机=大项目节奏锚；轻 3D（lowpoly 城市观赏/玩法型）在官方案例带（Boat Attack 11.15MB 首包=水面+树+URP 后处理级场景）以下，**风险面在内存纪律而非可行性**。

## §4 性能上限定标→City3D 消费转化
1. **G3 包体预算闸校准**（直接回填选型池）：街区扩展 AB 按**单包 ≤2MB** 切分（超 2MB 件拆包或走流式）；纹理档贴图 maxsize **≤1024**、关 mipmap、禁可写；字体全城共享单件 ≤4MB（压缩前）；音频单声道强制。选型池四件（Quaternius/Kenney 等）以「需重绘/压缩后是否仍超 AB 线」复判 G3。
2. **内存水位表**（R2 全城场景预算建议）：iOS 安全线取 3G 机型 1.4G×安全系数→**游戏侧峰值目标 ≤800MB**；扣基础库 70M+WASM 编译与堆（团结优化后显著低于原版 370+90+60 口径·具体值 R3 实测填）→**场景+资源+逻辑目标 ≤400MB 起步档**（保守·后续按真机 profiling 上调）。
3. **机型策略**：iOS 必开高性能模式（MP 申请+game.json 开关·iOSHighPerformance:true）；中低端限帧防发烫（官方点名）；**失焦 1FPS=挂机型设计禁**（城市离线收益一律走「回来结算」型·与 U360 离线蛋同路）。
4. **蒙皮/合批**：lowpoly 静态城无蒙皮重负→团结 SIMD/GPU Skinning 改进非主战场；主战场=draw call 合批（G6 闸同口径）+压缩纹理工具+AB 切分三件。
5. **提审预演**（R2 里程碑后）：转换工具勾 WebGL2.0(beta)+Development Build+Auto connect Profiler 走通 /minigame+/webgl 双目录；UOS 或自有 CDN 白名单；封面图/进度条配置；WASM 分包=首场景（城市一屏）+延迟包（街区扩展逻辑）预演。
6. **风险留痕**：官方性能评估标准数值表=图片面文本不可达（§0 盲区注）；Unity WebGL 无 compute shader（若 R2+ 用 GPU instancing 类特性须先验证 WebGL2 下行为）——两项均已转 explore 新条。

## §5 消费判据（回填表）
| 消费位 | 动作 | 判据 | 状态 |
|---|---|---|---|
| R2 选型池 G3 闸 | 以 §4.1 官方口径复判四件 AB 预算 | 超线件记录拆包方案一行 | 待 R2 实现窗消费（explore#65 被动族） |
| R2 内存水位 | §4.2 预算表入 City3D R2 提审预演件 | 峰值 ≤800MB 目标线在案 | 待交互窗收干后接线 |
| O-023 M0-M5（explore#7） | 本件 §1 表=性能分层基础口径 | 分层表引用本件 §1 | explore#7 领走时引用 |
| WeChat 提审预演 | §4.5 五步走通转换工具首跑 | /minigame 包在微信开发者工具打开跑通 | R2 里程碑后自可执行 |
| 官方标准表+案例页跟踪 | 新条已入 queue/explore.md | 文本面可达时补 §1 数值行 | explore 新条 |

> 版本：v1.0 r376 成件；勘误/扩证改头部版本号并在 §5 追行。
