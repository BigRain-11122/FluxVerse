# R-20261012 Townscaper mixed-initiative 拆解（authored 壳+自动补全两径·R2 模块壳对标）

> 领走=explore#2（state/queue/explore.md）·对标位=基准面 ②标准行 11（模块壳装配约束律·r236 立）。
> 性质=纯调研零实现零引擎预算；Token 三问=**L1**（web_fetch 定向直查零生成触点零 key）。
> 一手源=Game Developer《How Townscaper Works: A Story Four Games in the Making》（Tommy Thompson·2022-04-06·**含对 Oskar Stålberg 本人访谈原话**）——通道病如实标注：原站 403→Wayback 2024 存档全量 42,672 字符三段直取全文；XR AI Spotlight 访谈（substack·2024-11-12）付费墙未取如实标注；Stålberg X 一手注记（2021-12「unstructured talk」视频帖）与五场演讲（Konsoll 2018/2021·EPC2018·IndieCade 2019·SGA 2021）在 Game Developer 文末链在册（视频稿非文本可直取·以访谈文原话承载）。

## §1 四作谱系（机制演进链·一手源拆解）

Townscaper = Stålberg 十年同题四作的终局（原话「I feel like I've kind of been working on the same thing for the past ten years or so… releasing the intermediate steps of your project because you learn a lot from getting into the shipping mindset」——**中间态交付律**：每作=可发布小件+发布心态倒逼换眼自审）：

1. **Brick Block**（The Division 任职期原型·城市工具反思）：固定 5×5×7 格·marching-cubes 式**角件装配**·**连接约束**（新胞必邻既有面·禁悬空）·核心哲学原话「**what's important is what happens when things change**」——材料交界/墙角/屋顶转角=美术着力点·平铺砖墙本身无趣·**交界处艺术评论律**；大方格重复病→大格化留题。
2. **Bad North**（2018·Raw Fury）：岛级 WFC（ bespoke 实现·cf. Merrell Model Synthesis 2007）——300+ Maya 手作 tile·**边扫描自动派生邻接**；种子=水底天顶；**禁同 tile 相邻/禁镜像相邻**（反程序感）·双胞 tile 破格感；**navigability 启发式**（后补：tile 自知出入口边·假定 tile 内互通·不可达区一律=森林=视觉可读性律「visually obvious that you can't go there」）·软硬约束+失败整重启·合并 mesh 省 draw call·**长细物弱项**（墙/管类 tileset「bad in and of themselves and fail often」）·存档种子清单方案亲弃（「if you're going to do generation, do proper generation」）。
3. **Night Call**（2019·巴黎真实路网）：任意拓扑→**四边形重网格**（any graph can be on a quadrilateral graph）·skew 容差大（「you can skew the pieces like quite a lot before it starts to become a problem」）·直角约束悖论的解=**tile 标准化才有手作感→标准化需直角→四边格重网格替直角**（原话链在册）。
4. **Townscaper**（2020）：hex→两次切四边形→**点松弛**=非周期确定性不规则四边格（Red Blob/Amit Patel hex 启发）·**角段 tile**（非整栋块·贴不规则胞）·**实时 WFC=生成与装饰分离**（先塌缩可能空间后装饰=「block 先现 detail 后补」·结构越大延迟越长=连通区重评代价）·增删块全连通区约束重评·**fail-silent 允许**（「allowed to fail silently…occasionally you will see loose hanging steel structures that aren't properly connected」=长细物弱项裸露面）·窗=**stencil buffer 后切**（防半窗/角窗边案）·~500 tile 全手作。

## §2 mixed-initiative 两径定谳（原话锚）

- **定义（文）**：「mixed-initiative AI system: the player gives input to where the game needs to expand the structure, and the system assesses the current shape, identifies what prebuilt chunks of architecture are valid for that space and then injects them into the game world」——玩家=扩张意图（放/删/配色三输入）·系统=现状评估+合法模块检索+注入。
- **两径正名**：authored 壳（500 手作 tile 池）+自动补全（约束求解装配）——与我方 R2「authored kit 选型池（六闸）+确定性生成器（SPEC-INPUT）」**同构**；差异面=我方生成器确定性 band-run·Townscaper 实时约束塌缩（两法各证见 §3 P2）。
- **garden 律（recipe 机制原话）**：「I assign priority to all the different modules, and the garden modules are super high priority, but the only edge of garden pieces I have is where they end up next to a wall. So basically, unless you build an entirely enclosed area, there's no way to place the garden pieces at all」——**超高优先+唯一边约束**=围合即花园的玩家可学规则；「It doesn't matter how big it is you're building, it still works」=规则规模无关性。
- **大小形分工哲学（核心原话）**：「**I want the user to feel like they're in control of the large shapes. But then I get to play around with a lot of things on the small shapes**」——大形可预测（花园必现于围合区·玩家可复现 recipes）·小形自由变（园内矮墙走向/颜色分界等）。
- **换皮成本锚（判负证）**：主题重做=「somewhere in the region of 500 tiles」·「I don't want to spend two months doing the same thing again with the Japanese twist」·低 ornament 密度=远距可读性+玩家投射空间（「abstract representation」让玩家自补细节）双重收益。

## §3 六条可摘法（→ 我方消费面映射）

| 法 | Townscaper 实锚 | 我方消费面 |
|---|---|---|
| **P1 连接约束律** | Brick Block 新胞必邻既有面 | union 网络连通门候选（R2 生成器实现窗）；与 §16.9 FILLER 互补律同源互证 |
| **P2 长细物禁 WFC 律** | 「WFC is pretty bad for long, thin things…those tiles might fail quite often」+fail-silent 悬空钢架代价 | **band-run 连跑律（§16.7）第三方权威背书**——R2 街带走确定性连跑不走约束求解的独立实证；WFC 族仅围合区填充未来可选 |
| **P3 recipe 优先级+边界律** | garden 超高优先+唯一邻墙边=围合即现 | 城市情绪导演层（P-71③ 零档）候选实现法——R2 围合区地标时刻（围合即庭院/霓虹签名）可复现彩蛋机制 |
| **P4 大形可预测/小形自由** | 大形玩家可控+小形系统自由 | **r373 freepose 三问判据同一哲学的厂商实证互证**（自由旋转 15-35%/聚簇 30-50%/on5.0≤10%=小形自由·宏观结构确定性不变） |
| **P5 生成/装饰分离** | 实时塌缩先·装饰延迟后（结构越大延迟越长） | R2 生成器实现窗装饰层后置步候选（街具/窗/招牌=bake 后置·生成主结构先行） |
| **P6 skew 容差** | 四边格形变后模块仍服帖（「skew quite a lot」） | 不规则格/有机感改造容差依据（R2 若走格形变·vendor kit 件容差在册） |

## §4 与 R2 现状对位（判读·零施工）

- **已对齐面（勿重复施工）**：band-run 连跑律=P2 正解（在册 §16.7）；SPEC-INPUT 38 行 JSON=生成器输入约束面（r367/r368）；六闸选型池=authored 壳池法（r372）；freepose M1-M4=P4 同源（r373）。
- **增量面（实现窗消费候选）**：P3 recipe 律（围合区地标时刻——P-71③ 情绪导演层可抄法）；P5 装饰分离（R2 街区生成若走实时/增量改动=性能律）；P1 连接约束（生成器连通性门）。
- **不采纳面（判负留痕）**：WFC 约束求解本体不作 R2 街带主径（长细弱项+band-run 已定谳）；换皮多主题线判负（500 tile 成本锚+我方高饱和赛博像素单主题锚+低 ornament 远距可读性律同向）。

## §5 应用表（P-2026-09-24-65 律·落点四选一）

| 落点 | 内容 | 判据 |
|---|---|---|
| **任务单** | 新增 explore#67 被动跟踪条：R2 街区/生成器实现窗开工时消费本件 §3 P1/P3/P5 三法+果回填本件 §5 | 实现窗 commit/消息或 TECH 行引用本件（#61/#65/#66 同式） |
| 互证注记 | P4↔r373 freepose 三问判据（哲学互证）；P2↔§16.7 band-run 律（权威背书）——两处注记不重复立法 | 在册即满足 |
| 判负留痕 | 多主题换皮线判负（500 tile 成本锚+单主题锚） | 本节即留痕 |

## §6 源通道账

| 源 | 通道 | 状态 |
|---|---|---|
| Game Developer 访谈拆解文（Tommy Thompson·含 Stålberg 原话·四作谱系全链） | 原站 403→Wayback 2024 存档三段全量直取（42,672 字符） | ✅ 全取 |
| XR AI Spotlight 访谈（2024-11-12） | substack 付费墙 | ⬜ 未取（如实标注·不引据） |
| Stålberg 演讲五场+unstructured talk 视频 | Game Developer 文末链在册（视频稿非文本直取） | ⬜ 以访谈文原话承载 |
| DuckDuckGo 检索定位 | search 工具 | ✅ 10 命中 |

零 key：全表零付费 API；robots/ToS：公开页 web_fetch 合规（R-20260923-academic 方法节在册）。
