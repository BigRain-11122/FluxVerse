# FluxVerse 城市美术池（硅基城市场景道·SDXL 生产任务池）

> 协议 `fluxverse-city-art-pool/0.1` · 首建 2026-09-27 r218（P-2026-09-26-19 轮办② @FluxVerse-DevLoop 切片·CEO 令 2026-09-26 ~23:2x「尽快测出来适合生产硅基城市，高效高质稳定输出」·台账行点名）
> 配方正典=集团实测件 `cph4/research/R-20260926-sdxl-city-production.md` §五（配方 v1：13 例参数网格+后处理链 4 版+同 seed 复现双测+多模态盲评 8 次一手定谳）——本池**照抄禁自造**；产线纪律=MiniGame《本地生图产线规范.md》v2（只读引用·跨仓写禁）。
> 生产面=C 机 3070 16GB txt2imgx 专用产线（bm-a 4070S=共享卡白窗竞态 15-25 倍差实测·测试台与净窗补产位·**禁独立量产面**）；产出物入 AA 登记制+本仓 ARTPACKS-LEDGER 来源台账（P-21 律）+入城过 r44 和谐度四轴风格门禁。

## 一、定位与入池律

- **本池=城市场景族美术生产单一下单面**：场景族需求（背景/氛围层/环境带/天空族）→ 本池挂配方 v1 字段 → 翻面后以 txt2imgx 工单派 C 机产线 → 三 Gate 验收 → AA 登记入城。
- **入池律（消费驱动·禁提前造）**：只收 TECH §九/打磨池/任务板在册场景族美术需求；每项带 blocked-on 状态；CEO 复验翻面/需求窗开即下单。
- **非场景族不收**（既有正典维持）：道具/立绘/图标族走产线既有道与自焙线——手持伞=r210/r213 判自焙优先（M2 运动线）·前后视车帧=r93 后采债·门 tile=S 库采集线（r202 判负 16px 带零增益）——三缺口判读见 `cph4/oss-harvest/OH-20260926-fluxverse.md` 切片 2。
- **复现 SOP**：seed+全参数入工单 manifest（像素级回溯）；资产「选定即落盘」双保险（正本即落盘件·禁依赖再生）；**复现判据比像素勿比文件字节**（ComfyUI 把 workflow 织进 PNG tEXt——同 seed 文件 sha 异而像素零漂移实测·R- §四）。

## 二、配方 v1（下单正典·照抄 R- §五）

| 件 | 定谳 |
|---|---|
| 模型 | sd_xl_base_1.0 + pixel-art-xl LoRA @0.8（头图/宣传级）·0.5-0.6（批量）；裸跑+后处理=下限档（可选） |
| **宽幅字段**（分辨率） | **1344×768**（16:9 主力·官方 bucket）/ 1216×832（近方）/ **1536×640**（超宽横幅·官方 bucket 同族推断未实测）；总像素 ≤1MP 律；txt2imgx 工单 w/h 直填（产线 §三 字段全表） |
| 参数 | dpmpp_2m + karras · cfg 6.0 · **steps 20（量产）/ 28（终稿）**；普通 CLIPTextEncode（官方 bucket 下够用·宽幅显式条件非必需实证） |
| 提示词结构 | 风格核（"pixel art" 句首+dithering+limited palette+clean pixel clusters）+黄昏城市语汇（pink purple sunset sky/orange horizon glow/lit windows/cyan glowing tower）+构图结构锚（river axis midline+落日位+制高塔楼配重）——产线 §四 胜者句式/禁微指令/引擎渲染元素不入美术工单同律 |
| **负基线**（产线 §四.7 原文照抄） | 像素风带 soft gradients / anti-aliasing / 3d render / photorealistic / depth of field / bokeh / cinematic lighting / film grain / painterly / sprite sheet / multiple characters + 类负面；**负面词透传律**（任何生成通道禁硬编码轻负面——旧批 3D 渗漏实录） |
| 后处理 | **v2 链**：中值滤波 3×3 → BOX 降采样 ÷4 → 32 色 MEDIANCUT → 孤立点众数清理（窗 3×3·≥7/9 保边）→ ×4 NEAREST；Bayer 受控抖动=风味选项（天空/水面区收益） |
| **审核链**（三 Gate 沿产线正典不重建） | Gate1 书写自检（字段全/卡2 结构/负基线在位/宽幅档对）+ Gate2 启发式（DraftAudit_C 生成后自动跑）+ **Gate3 专家四维盲评**（风格/构图/细节/匹配 1-10·PASS=均分≥7 且任维≥5 且风格≥6·风格锚=真网格/有限色板·对 art-target-dusk） |
| 选优纪律 | 每单 2-3 seed best-of-N（同 seed 构图骨架稳定·细节层重摇）；少步模型禁交付（Lightning=侦察道专用） |

## 三、在册队列

| ID | 需求 | 溯源 | 状态 | 下单草案 |
|---|---|---|---|---|
| POOL-001 | **天空云层带 v1**（dusk/dawn 档·sky quad 族云层 sprite·切片入 CityAmbient EnsureVisuals 家族·r146 红链3 存盘纯度律随行） | r184⑤ 诚实弱读四面已呈 F-20260926-10 + 打磨池 A5（r195 单一清单面） | blocked-on:CEO 复验批 F-20260926-10 翻面点名（churn 防护律 r150⑥·复验批在飞勿动现态） | 1536×640 超宽档·steps 28（头图级）·LoRA 0.8·prompt=风格核+黄昏天空语汇+横贯云层带构图锚·3 seed best-of·Gate3 过线后切片入城 |

## 四、判据与验收

- **首件判据（回访=09-28 巡检班·ledger P-19 行）**：池在册+配方 v1 三件齐（宽幅字段/负基线/Gate3 复用）+首项下单草案就绪（翻面即派 C 机产线）。
- **生产验收链**：Gate3 PASS≥7（vs art-target-dusk 风格锚）→ AA 登记制入册 → ARTPACKS-LEDGER 来源台账行（P-21④ 弃用留痕义务同律）→ 入城 r44 和谐度四轴（色调/密度/质感/明度——k37 明度轴判负教训 r152）→ TECH §九 来源台账行。
- **诚实边界**：1536×640 未实测（同族 bucket 推断）；中景细节类资产锁版待 v3 链（区域感知 dither）；赛博城市 LoRA 四候选侦察轮待 CEO（R- §六）；产出节奏随 CEO 复验批翻面（禁提前生产）。

## 五、验证声明

2026-09-27 执行——本池=配方 v1 接线件（零新生成：bm-a 共享卡禁独立量产·生产待 CEO 复验翻面后派 C 机产线）；配方/负基线/工单字段全为只读引用（R- 件 §五 + 产线规范 §三/§四.7/§五 原文照抄禁自造）；三 Gate 沿产线正典不重建（跨仓零写）；首项 POOL-001=在册需求备料（r184⑤/打磨池 A5 溯源·非新发明）。
