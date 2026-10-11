# R-20261012 WFC 变体深读：Marian 无限城市生成器 + Merrell「modifying in blocks」惰性生成拆解（explore#1·生长线参考径）

> 溯源四源（web_fetch 4 次零 key 零生成触点·charter §一-3 检索面·r219/r236 先例）：①github.com/marian42/wavefunctioncollapse（页+raw README 双取·MIT·4.9k★/552 fork/295 commits·Unity 工程·topics=procjam/unity/wavefunctioncollapse）②marian42.de/article/wfc/（2019-01-06 一手文全量直取）③boristhebrave.com/2021/10/26/model-synthesis-and-modifying-in-blocks/（Boris The Brave·**Merrell 协助起草自注**「I'm especially grateful to him for his help drafting this post」=二手源带一手校验）④boristhebrave.com/2021/11/08/infinite-modifying-in-blocks/（Infinite MiB·Marian 非确定性实锚）。消费窗=**城市生长线开线时（需 P1 署名·r220 重评条件）**——R2 实现窗消费面=SPEC-INPUT 正身（本件不进·防双头）。

## §1 Marian 无限城市（marian42/wavefunctioncollapse）拆解

**① 语义面**：Unity 工程·~100 个 Blender 手作模块（「The world is generated from a set of ~100 blocks, which I made with Blender」）·walk-through 无 gameplay（「Currently, there is no gameplay, you can only walk around and look at the scenery」）·起源链=Stålberg Bad North talk→procjam 周（「I started working on this when I saw a talk by Oskar Stålberg」——与 r374 Townscaper 谱系同源人物链）·**一手承认学术根**：「Wave Function Collapse is based on Paul Merrel's Model Synthesis」。

**② 模块原型面（邻接表免写工艺）**：ModulePrototype MonoBehaviour 编辑器可视化→邻接表+旋转变体自动生成（「The modules together with lists of allowed neighbors and the rotated variants are created automatically from these」）——**手工 6 方向邻接表免写=与 AD-022 件谱工程同痛点同解**（我方 SPEC-INPUT occ 串=同问题的数据文件解·Marian=组件元数据解·两径互证）。

**③ 连接器三层语法**：6 面各一 connector 编号+水平向 flipped/not flipped/symmetric 三态+垂直向 rotation index 0-3 或 rotationally invariant（「Adjacent modules must have the same connector number. And their symmetry must match (same rotation index vertically, a flipped and not flipped pair horizontally) or they must be symmetric / invariant」）——socket 幂等律=编号对+对称标记对两判据；**其上再叠排除规则层**：连接器匹配仍可禁邻（「There are exclusion rules that allow me to prohibit neighbors that would otherwise be allowed. Some blocks with matching connectors just don't look nice next to each other」）——硬约束（几何合法）+软覆盖（美学禁邻）两段式=与 r339 §9.5 z 序/+ε 律同构的「约束之上再裁决」分层。

**④ 无限化路径判负→定谳（本拆核心发现）**：chunk 接口约束法先败——逐 chunk 生成+相邻 chunk 边界约束，但「whenever a slot is collapsed, the constraint propagation will limit the possibilities even a few slots away… This led to modules being selected within the chunk that would not be allowed when considering the other chunks. When the algorithm would then try to generate the next chunk, it could not find any solution」——**chunk 内选择未考虑跨 chunk 传播=接口死锁结构性病**→**正身=惰性字典 slot 流**（「Instead of using chunks, I store the map in a dictionary that maps a slot position to a slot. It is only populated when needed… only a small area of the map is generated at once, when the player reaches it. Constraints are still propagated outside of this area」——字典按需分配 slot+传播越窗·生成面≠传播面分离）。

**⑤ 无限隧道坑（模块集设计律）**：无配对入口的直隧道件=传播无限分配 slot（「this predetermines an infinite tunnel… I designed the module set to avoid this problem」）——**禁无界延伸件无配对件**=生长线模块集硬设计律。

**⑥ 垂直边界模板法**：顶面 air/底面 solid 约束在无限面不可逐 slot 施（级联触发无限分配）→1×n×1 环绕竖列模板预解（「I solved this by creating a 1×n×1 map… uses world wrapping… Whenever a new slot in the infinite map is created, it is initialized with the module set of the corresponding position in that map」）——**全局边界约束的模板预算技巧**：竖向约束先在有限环绕域内解稳·新 slot 按位继承。

**⑦ 回溯+作者商用判负锚**：白块占位先弃→history 回溯（「some of the history is undone. This works in most cases, but sometimes errors are recognized very late which leads to many steps being backtracked. In rare cases, the slot in which the player is, is regenerated」）+**作者原话判负**：「In my opinion, this limitation makes the WFC approach for infinite worlds unsuitable for commercial games.」——无限 WFC 流=演示级非商用级（一手自评）。

**⑧ 非确定性实锚（Boris ④源）**：惰性近玩家求值序≠固定序→**同 seed 不同果**（「Marian's city generator is not deterministic – even using the same random seed, you'll see different results」）。

## §2 Merrell Model Synthesis（2007 博士论文）+「modifying in blocks」拆解

**① 学术根**：2007 UNC 博士论文·WFC 十年前身（Boris 定位「most of the key ideas come from a paper written a full decade earlier」）·MS 程序=例学邻接→逐格选格→AC4 传播；**根本洞察原话**：「any constraint based solver can be modified to be a constraint based generator via random choice. It seems to be the first paper taking this approach.」

**② MS vs WFC 三差**：MS 线性扫描选格 vs WFC min-entropy 启发式（WFC 增）；MS 3D chunky tiles vs WFC 2D 像素纹理面+**overlapping model**（邻域学习非直邻接·WFC 增）；传播面归因=MS 网站断供数年+「Wave Function Collapse」标题更 catchy+3D 件难设计 C++ 难跑（「Model Synthesis uses 3d tiles, which are quite difficult to design, and C++, which is difficult to get running」）。

**③ 矛盾处置三策递进（大输出规模化谱系）**：**a 全重启**（WFC 原生）——「this approach doesn't scale – as you generate larger and larger outputs, the chances of a contradiction rise, until it's virtually impossible to get a successful run」；**b 回溯**——「retreats to the last good state, and records additional information so we don't re-attempt the same thing twice」·新病=stalling（「a partial solution is unsolvable, but the algorithm doesn't know to backtrack out of it, instead repeatedly exploring variations of the partial solution」）；**c modifying in blocks=折中正身**——「the output area is partitioned into multiple, overlapping blocks. The blocks are then solved one at a time. If a contradiction is reached, only that block needs restarting… the blocks are large enough to avoid any rabbit holes, so you can generate extremely large outputs without any growth in overall failure rate」。

**④ 已知好边界 seeding 法（MiB 核心工艺）**：逐块生成时约束块**全部**边界——已生成侧用真约束+开口侧**固定为已知好 tile 集**（Escheresque=flat bedrock+air·grass 样=纯绿底）（「By fixing all the borders, it ensures that each block is more self contained and easier to extend… The blocks are arranged to overlap each other, so all these fixed borders eventually get overwritten」）+**保底退路**（「in the case that there are too many contradictions / restarts, you can always just give up and fall back to the known good tiles」）——三态自愈=成功/块重试/回退已知好档；**重叠块=固定边界终被覆写**（无污染残留）。

**⑤ 实验账（Boris 复现）**：Escheresque 30x30x10——「Neither WFC with restarts or my own backtracking code stood a chance of scaling」·MiB 可更大（需慷慨块重启参数）·顺序敏感（「sensitive to generation order, preferring certain linear scans to min-entropy」——min-entropy 非普适最优）；性能面=重叠块冗余工作+线性扫描免 min-entropy 全图扫描（「naive WFC can run into trouble with large outputs as it must repeatedly scan for the minimum entropy cell」）。

**⑥ 归属律**：「credit Dr Merrell with many of the insights needed for constraint based generation, in addition to Maxim Gumin for popularizing it」+Townscaper 关联注（评论区）：「Townscaper is using something similar to WFC / Model Synthesis yes」。

**⑦ Infinite MiB（④源）**：WFC 传播无界→格间不独立（「you cannot work out what will be selected for a given cell without evaluating all the preceding cells」）→chunk 化 WFC（已评 chunk 约束入新 chunk）+近玩家惰性求值=**Marian 范式**（「best illustrated in Marian42's excellent city generator」）；**MiB vs 惰性 chunk 分野**=固定线性序（确定）vs 近玩家序（非确定）——确定性需求面两径互斥。

## §3 可摘法 P1-P6（生长线开线消费窗·需 P1）

- **P1 惰性字典流**：近玩家流式生长的正身径=slot 字典按需分配+传播越窗（生成面≠传播面分离）；**chunk 接口约束法判负留痕**（chunk 内选择对相邻未生成 chunk 不可扩展=接口死锁结构性病）。
- **P2 已知好边界 seeding**：外扩新块四面全约束——已生成侧真约束+开口侧已知好 tile 档+失败回退=三态自愈；适配城区外扩/分期开发语义。
- **P3 模块集设计律**：禁无界延伸件无配对件（无限隧道坑）；连接器编号+对称标记+排除规则三层语法=邻接语法参考（与 SPEC-INPUT occ 串互证·两径同问题异解）。
- **P4 矛盾处置三策菜单**：按输出规模分档——重启（小图）/回溯（中图+stalling 风险）/MiB（大图+需已知好底档+线性序偏好）。
- **P5 确定性预注册判据**：Marian 惰性近玩家序=非确定（同 seed 不同果）——**R2/生长线若走确定性 hash 变奏（r207 skyline 先例）与惰性求值序天然冲突**=开线时须预注册（确定性需求 vs 流式需求二选一或分层）。
- **P6 商用判负锚**：Marian 自判无限 WFC「unsuitable for commercial games」——生长线商用面=WFC 族只作局部装饰区/预览区，主径维持 spec 驱动（与 r374 判负留痕「WFC 本体不作街带主径」同向互证·厂商+拆解者双源）。

## §4 对位判读

- **已对齐面（勿重复施工）**：SPEC-INPUT 消费序五步=spec 驱动管线（非 WFC 族·两线分立）；基准面 ②11 模块壳装配约束律（easy tilesets 教训·r236）承本件再证；r374 Townscaper P2 长细物禁 WFC 律+P5 生成装饰分离（本件 P6 同向）；r339 §9.5 z 序/+ε 律（连接器三层语法同构）。
- **增量面**：P1-P6 六法=生长线开线备料（新被动跟踪行 #68）；MiB 已知好边界 seeding+三态自愈=选型池六闸外的生成器工艺面增量。
- **判负留痕面**：chunk 接口约束法（P1）；WFC 无限流商用（P6）；min-entropy 大图扫描性能+非普适（⑤源）；Marian 白块占位错误显示法（⑦弃法）。

## §5 消费窗指针

- **生长线开线时（需 P1 署名）**：消费本件 §3 P1-P6+R-20261012-townscaper-mixed-initiative-teardown §3 三法+基准面 ②11 约束律——六法逐项过闸（确定性 P5 须预注册判据先行）。
- **R2 实现窗**：不消费本件（SPEC-INPUT=R2 输入正身·本件为生长线备料·防双头）。
- 板面跟踪行：explore#68（被动·零施工·开线窗 commit/消息或 TECH 行引用本件即触发消费对账）。
