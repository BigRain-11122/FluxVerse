# R-20261012 Quaternius Modular Streets Pack 拼装语法拆解（Kenney Roads 二比一的另一侧·City3D R2 街区扩展选型前置）

- **触发**：explore#13 领走（r321 轮尾补条·导入前纸面对照·零下载；Kenney 件 §5「留后续件」就此闭合）；同窗刷新 explore#12 P3 48h 节律死线（末笔 r368 → 本件 r369 成件=新末笔·下次死线 10-14 06:0x 前）。
- **口径**：纯纸面零下载（不取 zip 不导入）；证据=quaternius.com 官方包页（现值+Wayback 2018 存档双读）+ OGA/itch 双镜像页 + poly.pizza 实名分件 1 件 + 官方预览图多模态枚举（24 实例）+ 本仓 AD-022 实勘族件三锚。
- **扫描轮**：DevLoop r369（2026-10-12 06:0x）。

## 1. 官方拼装语法（证据级声明：页文本+预览图判读——无 Kenney 式官方 demo 源码实锚，弱一级）

| 语法要素 | 官方实锚（页文本/预览判读） | 语义 |
|---|---|---|
| **件数/形态** | 官方页 Models=**25**·March 2018·OGA 2018-03-30 | 25 件城市街道模块集 |
| **动画/贴图** | Wayback 2018 存档「Animated No·Textured No」（现页模板徽章「Textured」为模板件伪信号·以存档为准） | **零动画·零贴图=顶点色/纯色材质平涂**（合批/包体极友好·与 Kenney colormap 异路同果） |
| **格式** | FBX / OBJ / Blend（官方页·itch 同文） | 三格式全给（OBJ 文本面=导入窗米制可直读·比 Kenney glTF 快一步） |
| **网格/对齐** | 预览图判读：路/地块件全数统一**方形地块足迹**·等距斜排布·路面恒 2 车道等宽+虚线中线·corner/十字/桥面与直道**端对端齐平**·桥高=高架路段同高 | **方形 tile 拼装**（角对齐判读·绝对米制=导入窗实测——官方无 cell size 声明） |
| **垂直语法** | 预览图判读：地面路网之外有**高架路/桥（旱桥/水桥/跨线 overpass/S 坡道桥×2）**族——路面下方可穿越 | **双层城语法**（三方对照中唯一带垂直路网者） |
| **许可证** | CC0（quaternius.com+OGA+itch 三源一致） | 免署名商用·与 Kenney 同级 |

**包体**：ModularStreetPackbyQuaternius.zip=**3.6 MB**（itch）/ **3.8 MB**（OGA 双镜像微差=打包器差·同源）。

## 2. 件名谱（25 件谱·预览图多模态枚举 24 实例+实名锚 1 件）

预览图（quaternius.com/assets/images/fullres/modularstreets.jpg）24 实例判读谱，三类族：

- **路/地块族（16 实例）**：空地块·水面地块·直道×2（疑似变体或重复展示）·角道·S 曲线坡道·高架直段（带落差端）·旱桥·水桥·跨线 overpass（下穿垂直路）·S 坡道桥（水面）·S 坡道桥（地面）·素十字×2·斑马线十字×2；
- **街具族（8 件）**：路灯单头/双头/三头×3·STOP 牌·禁停牌（P 加红斜杠）·三角警示牌（素面）·红绿灯横臂式/立柱式×2（OGA 标签 bridge/signs/traffic 与判读全互证）。

**计数对账**：广告 25 vs 判读 24 实例——3 组疑似重复对（直道×2/素十字×2/斑马十字×2）若为变体则 24 型俱在，若为重复展示则 21 型可见+4 件未入预览——**终判=导入窗以包内实名为准**（Kenney Commercial v2.0 同律先例·本件不猜名）。
**实名锚**：`Street Straight`（poly.pizza/m/UA4axT3nIQ·FBX/GLTF·CC0·2024-03-17 上传=官方再分发实名件）——官方命名族=「Street <型>」式判读成立但仅此一件过验。

## 3. 三方对照表（Quaternius Modular Streets × Kenney City Kit Roads × AD-022）

| 对照面 | Quaternius Modular Streets (2018·25 件) | Kenney City Kit Roads (v2.1·90 件) | AD-022（Synty 式·本仓实勘） | 拼装兼容判读 |
|---|---|---|---|---|
| 路网拓扑词汇 | 直/角/十字（素+斑马）/S 坡道——**预览判读无 T 字件**（终判=导入窗） | road-{straight,corner,split(T),intersection} 四拓扑齐 | SM_Env_Path_{Straight,Corner,T,Junction}+SM_Env_Road_{01~03,Arrow,Bare,Crossing,Lines,Median}（素面/标记双带语义·§16 系在册） | **T 拓扑疑似缺位**=词汇表对齐风险位（缺 T=生成器词汇缺角·见 §4 判据④） |
| 垂直语法 | **双层城**（高架/桥/overpass 跨线） | 单层平铺（builder.gd 恒 y=0·官方源码实锚） | 正交四向单层（r322 实测） | Quaternius 独有面=立交/跨河场景唯一解 |
| 地块语义 | 路+空地块+水面块**同格一体**（路网与地形同族拼） | 路面与 pavement/grass 分件分族 | pave 格+素面/标记双带（R-20261012-ad022-r2-spec-input.md 38 行输入件在册） | 三方各异构·Quaternius=最接近「一块一世界」积木式 |
| 网格米制 | 方形地块足迹（预览判读·绝对值导入窗实测） | 1×1×1 单位格（官方源码） | **5.0 单位步距**（R-20261011-ad022-road-pitch-probe.md·r322） | 对齐单常数=5 基准不变·Quaternius 侧定标=导入窗一次过 |
| 贴图/材质 | 零贴图顶点色平涂 | 单 colormap.png 图集 | Synty 式分件材质 | Kenney 合批占优同判·Quaternius 顶点色=Unity/Godot 染色改造最易 |
| 街具谱 | 灯杆×3+标牌×3+红绿灯×2=8 件独立件 | 灯杆复合进直道变体+护栏/路标/红绿灯族 90 件 | 在库 vendor 件为准 | Quaternius 街具独立件=可混入 AD 城的单点采样位 |
| 美术风格 | 块状平涂 chunky lowpoly | 平涂块状 lowpoly（同族） | Synty 面状 faceted | **Quaternius≈Kenney 同族；二者与 AD-022 同框混拼=风格断裂风险同判**（帧级闸·沿用 Kenney 件判据①） |
| 许可证 | CC0 | CC0 | 已购 AD 商用包 | 三方皆商用零风险 |
| 证据级 | 页文本+预览判读（**弱一级**·无官方 demo 源码） | 官方 Starter Kit 源码（机器级） | 本仓实勘（机器级） | 选型时以证据级差计入置信度 |

## 4. R2 街区扩展选型位差（对 Kenney 件 §4 场景 B 的补面）

- **Quaternius 街包优势面**：①立交/跨水双层语法（Kenney 与 AD-022 双双缺位的唯一解）；②水面块（一江两岸总构图〔city-core-design §1〕的轻量水面语法候选）；③OBJ 文本格式（米制可纸面直读）。
- **劣势面**：2018 老包（7 年件·Quaternius 现役线已迭代至 Downtown City MegaKit 315+ 件·Unity/Godot/Unreal 项目级包=若走 Quaternius 路线优先评估新件）；25 件 vs Kenney Roads 90 件内容量小；T 拓扑疑缺位。
- **选型判据（导入窗执行·沿用 Kenney 件三闸+新增一闸·全机械可验）**：
  1. 风格同框闸：与 AD-022 同帧渲染多模态锐评 ≥8（同 Kenney 判据①）；
  2. 米制定标闸：OBJ 文本直读路宽/地块边长 → 对齐 AD 5.0 步距常数（一次定标）；
  3. 合批实证闸：混拼帧 drawcall 对基线非恶化（顶点色优势验证）；
  4. **T 拓扑完备闸（新）**：包内实名谱若缺 T 字件=该包不可独立承担生成器路网词汇（只可作立交/水面点缀件入城——降档用法定谳）。

## 5. 消费与导出口径

- 本轮纯纸面零导入（explore#13 口径·零许可证风险零包体污染）；Quaternius 侧拼装语法就此闭合——Kenney 件 §5「留后续件」销账，**Kenney Roads 二比一对照两侧全闭合**。
- 消费面=City3D R2 街区扩展选型（Kenney 件 §4 同窗备选池第二件）+ explore#17 真 demo 街具密度对照（本件街具谱 8 件为输入）+ 48 包利用率图（asset-audit 接线判据·tech#1 同窗）。
- 下次死线滚动：explore#12 末笔=r369（本件）·下次 10-14 06:0x 前。

## 应用表（P-2026-09-24-65 落点四选一）

| 落点 | 内容 | 状态 |
|---|---|---|
| 任务单 | explore#17 街具密度对照条输入（本件 §2 街具谱 8 件）；导入窗任务=R2 街区扩展包实名谱终判（§2 计数对账+§4 判据④） | 已挂 |
| 法文修改 | 本件与 Kenney 件 §4 合成「R2 街区扩展选型判据池」——无 board/法文改动（纯备料） | 零改 |
| 决策呈报 | 无超权面（选型留导入窗·不呈 CEO） | 零 |
| 判负留痕 | 证据级差如实标注（Quaternius 侧弱一级·T 拓扑疑缺位待终判） | 在件 |
