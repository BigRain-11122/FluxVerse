# ArtPacks Ledger — City/Assets/ArtPacks 逐包台账

> 城市视觉外采资产本体唯一台账（provenance 面）：每包=来源/许可/件数/用途/验图结论。研究正典与缺口判定=`docs/research/R-20260923-city-art-assets.md`（引用不复制）。
> 获取批：2026-09-23 批 2（CEO 令 ~23:31「城市还需要什么资产 都去弄」·音频批 1 姊妹批）。
> 验证态：许可=7 源页许可图标精确探测（CC0×3/OGA-BY×2/CC-BY×2·零 SA）+池内覆盖三项实测；完整性=PNG/GIF 魔数全扫 306 件零坏（19 个 GIF 为合法 GIF8 魔数）；**视觉验图已做**（八格对比图多模态分析 2026-09-23·结论入各包行）；watercraft kit=3D 模型包违反 2D 铁律**整包弃用留痕**。

## 署名义务（引擎/发布 credits 必带）

- OGA-BY 3.0：`City Parallax Background & Residents of the City by CraftPix.net (OGA-BY 3.0, opengameart.org)`
- CC-BY 3.0：`Ships with ripple effect by chabull` · `Top-Hat Robot by Nelson Yiap`（均 opengameart.org）
- warped-city / cyber-city = CC0 零义务。

## warped-city/（171 件·CC0·ansimuz·/content/warped-city）

- 内容：**赛博城市环境全套**——霓虹招牌系列（banner-neon×4 帧/banner-coke/sushi/scroll/big/side/arrow/floor/hotel-sign·全带 preview GIF）、环境背景（skyline-a/b·near-buildings-bg·buildings-bg）、道具（antenna/control-box/monitorface）、玩家/无人机/炮塔精灵全套、PSD 源件（banner 可改公司名——FLUX/CPH4/公司名牌就地重制）、三张总表 sheet-01-sprites/02-environment/03-tiles。
- **验图：适配度=高**（完整赛博横版街景·霓虹+都市一体·多模态定「可直接定美术基调」）；⚠️ 注 1=环境总表内嵌 "SCREENSHOT" 演示占位字样（DevLoop 消费时裁掉）；⚠️ 注 2=八格对比中曾见「糊」为**验图台架双线性缩放伪影**——源件原生像素实测（banner-neon 19×48·hotel-sign 68×35）零污染。
- 用途：DESIGN §九「霓虹街牌 FLUX/CPH4/公司名」判据面主力 + 大气透视背景层 + 街道机器人补充（drone）。
- **消费实况（r35 首批入城 11 件）**：hotel-sign（北岸 NW 楼顶 HOTEL 牌）+banner-neon×4 帧（GAME 西/MEDIA 东/QUANT 双 flank/北岸中楼·各挂不同帧=免费闪烁相位差）+banner-side-1（GAME 西第二槽·平行四边形霓虹）+banner-sushi-1（MEDIA 东女儿墙横牌）+banner-scroll-1（北岸 NE 楼窄挂轴）+banner-open（北岸 GAME 中楼 OPEN 门牌）+monitor-face-1（QUANT 广场街亭屏）+antenna（QUANT 塔顶格构天线）——落位表=City/Assets/Scripts/NeonSigns.cs（NeonRules 单一正典）·场景持久化 12 位（NeonSign* GO·sortingOrder 6=Props 4 与 tint 8 之间）·NeonProof 双会话 189 断言绿+多模态双图绿（m1-r35-neon-{dusk,night}.png）·夜律实测=霓虹在夜 tint 下暗而不灭（lum dusk 0.504→night 0.282）；**banner-coke 未消费弃用留痕**（真实品牌 pastiche 与 FluxVerse 自有公司叙事冲突·公司名牌走重制债）；**r38 公司名牌债收口**：`ENVIRONMENT/props/company-plates/` 6 件 DevLoop 自产烘焙牌入城（FLUX/CPH4 脑塔玻璃立面双挂+BIGGAME GAME 西楼顶站牌+BIGMONEY QUANT 塔冠+BIGSTREAM 北东 MEDIA 矮楼顶+BIGLIFE 北中西矮楼顶·`Tools/city/bake-company-plates.ps1` GDI+ 确定性烘焙·SHA256 重烘焙幂等实证）——**PSD 就地改路线废弃留痕**（工具链无 Photoshop·诚实律改自产径）；字体=池内 FT-016 PressStart2P（**OFL 1.1**·MiniGame Font Assets 只读消费引用不复制·.ttf 永不入本仓·烘焙字模=OFL use 合法·RFN 只绑改字体再分发零涉及）；光色律归位=FLUX 纯白+超体蓝晕〔塔正典〕/CPH4 超体蓝/BIGGAME 数据青/BIGMONEY 资金金/BIGSTREAM 流量品红/BIGLIFE 暖琥珀（环境通道·非功能光·五色律零改动）；挂装=NeonRules 18 行单一正典（NeonProof 275 断言双会话绿+RobotProof/ResidentProof 18 矩形净空门回归绿〔297+506〕·多模态双图 5/5 绿 m1-r38-plates-{dusk,night}.png·夜律=暗而不灭 lum dusk 0.543→night 0.338）。

## cyber-city/（11 件·CC0·warlloyd·/content/cyber-city）

- 内容：city.png 图块集（混凝土板/紫青砖墙/反光玻璃窗/人行道/路面）+ 角色精灵（$Yakuza1-3/Boss/lady）。
- **验图：适配度=高**（现代都市 tile 直接可铺·配色已霓虹紫青系）。
- 用途：南岸三城建筑墙面补充 tile 池 + 街头角色点缀。

## parallax-skyline/（8 件·OGA-BY 3.0·CraftPix·/content/city-parallax-background-with-buildings-pixel-art）

- 内容：layer-1~7 视差层 + composite-preview 全景合成图。
- **验图：适配度=中**——层次结构适合远景视差，色调偏粉紫日落。
- **风格闸判定（r29 三选一收口）=条件过闸·仅作 L0 远景雾化层**。r29 复验勘正前判：**画风实为硬边像素**（composite 最近邻预览+layer-3 直验双证——阶梯锯齿零抗锯齿、窗点单像素阵；前判「平滑矢量/数字绘」系验图台架双线性缩放伪影误读，与 warped-city 注 2 同罪），「像素化转译」径作废。过闸附五条律：①point filter+整数倍缩放（非整数/双线性=硬边糊死）；②雾化降饱和 tint 并入锚图粉紫雾带（原包高饱和玫粉会压前景可读性）；③只取最远 2-3 剪影层（淡粉低对比层），近黑前景层弃（与暗色 tile 黏连难分）；④左右边缘构图不对称=禁无缝循环声明（循环须先镜像/重制）；⑤五色律与世界层像素正典零改动。
- 用途：远景天际线大气透视层（P-28② 接线面·雾化处理后入城）。
- **消费实况（r34 首件入城）**：layer-2（远·淡粉剪影）+ layer-3（近·鲑红剪影）两件入城=CityAmbient 序列化 sprite 双字段（场景布线 r34·SkylineProof 双会话 48 断言绿）；五条律全落位=PPU16+point+×2 整数缩放（law①·首跑实证导入器默认 PPU100 显微陷阱已修）/四档雾化乘色入锚图粉紫带（law②·dusk 实测 r−g 0.240 b−g 0.134）/只取最远两层（law③·layer-4 起弃）/单张不循环覆盖门 Covers 全相机位（law④·L0 极值余量 0.194u）/五色律零改动（law⑤·粉紫=环境色通道）；layer-1（云底）/layer-4~7（暗前景/合成底）未消费留池。

## residents-crowd/（31 件·OGA-BY 3.0·CraftPix·/content/residents-of-the-city-pixel-art-sprite-sheets）

- 内容：编号居民 sprite sheets（10/11/12… 每人 Idle/Walk/Special 帧·48×48 步幅 4 帧）。
- **验图：适配度=中高**（真像素·现代市民生态含轮椅市民等多样性）——服装为日常现代风非赛博（居民=日常人+机器人才是赛博，符合世界观：城是现实投影）。
- 用途：M2 街道 NPC 池/BigLife census 万民→sprite 映射补充池（与 P-22 同线·池内主力仍 AA-016.04+AA-028.2105141）。
- **消费实况（r37 首批入城 12 件）**：`Tools/city/crop-resident-frames.ps1` 全 idle 帧确定性裁切（12 居民·R1 6 帧/其余 4 帧=50 件入 frames/·多模态选帧=11 人 I0 静息姿·R6 I0 跨步倾身改选 I1；R7 冥想坐/R8 蹲坐/R10 轮椅=自然坐态布景直用）；居民入城正典=`City/Assets/Scripts/ResidentRules.cs`（ResidentRules 单一正典·street 层 order 7 与机器人同层〔signs 6<street 7<tint 8〕·**尺寸律=导入器 PPU24**〔48px/24=恰好 2u=P-17 居民 32×32 级世界律·localScale 1 零重采样——除数吸收包像素密度·世界律永不动·r34 PPU100 显微病在导入器执法非假设〕）；落位 12 席=QUANT 广场 3+GAME/MEDIA 前广场各 2+南街两侧人行道 2+北滨步道 2+北街 1+MEDIA 前西 1（**落位门=活 tilemap 再推导 FEET cell**〔中心 y−1 必 Ground 铺装或 Roads·r36 STAND 门律〕·居民间距≥2.2u·离机器人≥2.0u·霓虹矩形+半幅 1.0+0.4 净空）；ResidentProof 双会话一次过全绿=**434 断言**+reload 门（12/12 持久·robots 8/neon 12 保全·importer sprite+point+PPU24+nemip 跨重启）+渲染门（dusk_px=1431 worst 73·夜差分像素集与 r36 乘法 tint 同构律 lum 0.484→0.282 城暗我暗零发光）+多模态双图绿（黄昏 12/12 着地零浮空零裁切〔两处「偏小」疑点=灯柱道具+相机漂移坐标误差·导入器门 rect 48×48/bounds 2×2u 逐位排除〕·夜图 12/12 可读剪影零伪影·m1-r37-residents-{dusk,night}.png）；v0=静态布景（r36 静-transient 边界律·行走/待机动画=M2 事件驱动面·**BigLife census 身份映射=P-22② M2 窗口即开**）；**Walk/Special sheets 未消费留池**（M2 行走动画面+特色姿态候选）；OGA-BY 3.0 署名=本文件署名段既有行（City Parallax Background & Residents of the City by CraftPix.net）；**r40 nameplates/ 子目录（DevLoop 自产叠加·非包件·包本体 31 件不变）**：plate-res-00..11.png 12 件居民名牌入城（P-22② 呈现层切片①·名字源=BigLife census 身份池非本包·字体=FT-011 Fusion Pixel 12px zh_hans OFL 1.1 MiniGame Font Assets 只读引用不复制〔.ttf 永不入本仓·烘焙字模=OFL use 合法〕·月光注记通道色〔框暗钢蓝/字苍白冷/晕冷蓝·环境件非功能光〕·r24 bevel 律·SHA256 重烘焙幂等）——落位表=`City/Assets/Scripts/ResidentTags.cs`（ResidentTagRules 派生单源·NameTag* GO·street order 7·PPU24 除数律）·ResidentTagProof 双会话 636 断言绿+多模态四验绿（m1-r40-tags-{dusk,night}.png）·OGA-BY 署名义务不涉自产叠加件（署名面仍=既有 CraftPix 行）。

## tophat-robot/（1 件·CC-BY 3.0·Nelson Yiap·/content/stylish-top-hat-robot-16x16-animated-spritesheet）

- 内容：robot_sheet_16x16.png（64×64=4×4 帧格·16×16/帧·动画全帧）。
- **验图：适配度=中高**（16×16 正中 P-17 街道机器人规格；台架糊影同为缩放伪影·源件原生）。
- 用途：街道机器人变体池（灯流主角的形态候选）。
- **消费实况（r36 首批入城 8 帧）**：Tools/city/crop-robot-frames.ps1 全帧 16 切入 frames/robot_f00..f15.png（确定性裁帧留痕：实勘 8 可用帧=F00/F08 站立+F05/F07 并腿+F01/F04/F06/F12 迈步·余 8 槽为作者未填的镜像空帧·全右向）；8 机器人入城=City/Assets/Scripts/RobotRules.cs（RobotRules 单一正典·street 层 order 7=signs 6 与 tint 8 之间·native PPU16+scale 1 零重采样·每机独立帧=r35 克隆行禁律）——场景持久化 8 位（Robot* GO·南广场 3+南街 2+城前 2+北 promenade 1·**落位门=从活 tilemap 再推导**〔Ground pavement ∨ Roads cell·禁信注释信场景〕）；RobotProof 双会话 249+reload 断言全绿+渲染门（dusk_px=672 worst 81·夜 lum 0.478→0.280=乘性 tint 下差分像素集同构）+多模态双图绿（m1-r36-robots-{dusk,night}.png·8/8 着地零浮空城市完好零伪影）；v0=静态布景（巡行动画属 M2 事件驱动面·禁装饰性动画）；CC-BY 3.0 署名=本文件署名段既有行（Top-Hat Robot by Nelson Yiap）。

## ships-ripple/（112 件·CC-BY 3.0·chabull·/content/ships-with-ripple-effect）

- 内容：水面单位精灵（ship_big 系列含 destroyed 态/water_units.json 动画配置/涟漪动效件）+ images/sprites/ 解包展开（嵌套 zip 已展开）。
- **验图：适配度=低**（多模态判定：俯视 RTS 视角与横版街景冲突·战争烟雾题材偏离）——🟡 留观池：仅取其船体配色/结构为重绘参考，或远期 M4 俯视地图端复用；直接入世界层**不过风格闸**。
- 用途：黄浦江江面生活感候选素材（需要侧视重绘——DevLoop 定夺）。

## warped-city-2/（1 件·CC0·ansimuz·/content/warped-city-2·批 3 补 2026-09-24）

- 内容：sheet-environment.png（38.4KB 赛博街区环境拼合图——霓虹红粉+青三色·LIFE/R UNIT 招牌·远景天际线层）。
- **验图：适配度=高·零污染**（多模态：纯像素·无水印无 SCREENSHOT 残留·调色统一——与 warped-city 同作者续作）。
- 用途：赛博街区环境参考+素材。

## city-pixel-tileset/（3 件·CC0·software_atelier·/content/city-pixel-tileset·批 3 补 2026-09-24）

- 内容：city.png+city_bg.png 图块+license.txt（包内随行）。
- 用途：城市图块补充池。

## city-icons/（1 件·CC0·thekingphoenix·/content/city-icons·批 3 补 2026-09-24）

- 内容：icons_city.png 图标 sheet。
- 用途：L3/L4 UI 城市图标候选（M3 UI 壳期）。

## modern-city-extension/（1 件·CC0·rubberduck·/content/modern-city-extension·批 4 补 2026-09-24）

- 内容：city_extension_facade_kit.png（896×736·中高密立面 kit：5-6 层楼带[可循环加高]/多配色金属壁板+砖檐/多规格窗+玻璃门+卷帘/三色玻璃幕墙格材质[蓝/紫/黄]/虚构企业招牌件）。
- **验图：适配度=中高**——写字楼立面底料+材质库合格（P-38 ②「关键地标 hi-bit 立面」前置料）；⚠️ 白天低饱和原色，入城须调色（压暗+蓝紫偏移+暖窗灯·R-hd-pixel 配方）；异形地标轮廓（扭塔/球体）无现成件=须自绘轮廓+本包材质贴图；JVBot Inc. 招牌=内置内容非水印，用时替换。
- 用途：P-38 ② 关键地标与办公楼立面施工底料（DevLoop 自领时消费）。
- **反重复对照补课（2026-09-24·池内实查后补记）**：池内 AA-016.02 48px 档实测有 **986 件建筑面**（Generic_Building 成品整楼[如 Condo 144×576 四层楼]+Floor_Modular 系）——**判=互补非冗余**：本 kit 补的是量产产能（多配色墙带/柱件变宽/首层门/顶檐/外机/招牌模块），池内件留作成品点景/主楼生态位；⚠️ 两注记：①Floor_Modular 文件夹实取样为 ATM/Grate 类道具混装，其「楼带循环件」存在性由 DevLoop 消费时核验；②密度差（池内胖像素 vs 本 kit 1px 级细节）——同屏 1:1 混排会一粗一细，**本 kit 楼建议置中远景弱化**。

## 已验弃用/否决（诚实律留痕）

| 项 | 判定 | 依据 |
|---|---|---|
| Kenney Watercraft Kit | **整包弃用** | 3D 模型包（FBX/GLB/OBJ）违反 CEO 2D 铁律——PNG 仅为 3D 贴图与预览 |
| 池内已覆盖面（不外采） | 车辆=AA-016.02·光效=AA-034（193 PNG 实测）·字体=FT-011 缝合像素/FT-016/FT-010·居民主力=AA-016.04+AA-028.2105141 | R-city-art §一覆盖判定 |
| 施工/脚手架 | 不外采——S 库线@Biggame（BoardForge 工地语法·引用不复制） | P-28 注 |
| 云 sprite | 不采——程序化天空+视差层已足 | — |
| 游戏图标 | 暂缓——M3 UI 壳期再定 | P-18 正典 |

## 引用不复制（池内消费面·DevLoop 走 P-21/FT 通道）

AA-016.02 车辆 / AA-034 光效粒子 193 PNG / FT-011 缝合像素（霓虹中文招牌字）· FT-016 PressStart2P（拉丁像素）· FT-010 得意黑（标题冲击感）。


## residents-atlas/（4 件·集团自产·cph4/research/sprites-20260924/atlas·fa7d951 定版只读拷贝·r97 入仓）

- 内容：**批 1 居民部件图集正体**——atlas.png 128×96 九宫（skin/cloth/pant/hair-short/hair-long/eyes-led/eyes-dot/badge/being·32×32 部件掩膜·白=主色位/灰 210=影位）+layout.json（9 rect）+manifest.jsonl（32 行调色身份：id/name/species/skin/hair/cloth/eye/badge）+being-glow.png（DevLoop 伴生件·bake-being-glow.ps1：白 RGB 带 reference alpha 70/150/225/245+sparks #F5EFFF——atlas being 胞为不透明灰阶带〔集团产线律=alpha 于 remap 期注入〕而引擎 SpriteRenderer tint 无法灰阶→alpha 重映射·伴生件=切片染 core 即得精确带）。
- 来源：**集团产线自产**（bake-residents.ps1+atlas-residents.ps1·BigLife census 只读确定性派生·P-68 批 1/P-72 部件化正典·CEO 图集浪费纠正令 09-24 ~21:10）——非外采件·零外部许可义务；身份数据契约=BigLife CODEX §十二（导出面在册）。
- **零 per-resident 图件律**（CEO 令正体）：32 只个体 PNG 径已由 fa7d951 设计性作废（勿消费 batch1/manifest.json 的 file 字段）；伴生件 36 件同批落位=名牌 b1 组 32（residents-crowd/nameplates/plate-res-b1-*.png·66×20 画布·CJK 主名形律）+接地影子 shadow-res32.png（residents-crowd/shadows/·32×8@PPU24=1.33×0.33u·对 1.33u 身）。
- 消费实况（r97 预置）：**引擎挂装待 r98**——ResidentRules 32 席表+部件栈挂装+ResidentProof 证明门（见 TECH §九 r97 行）；.meta 随首个编辑器轮导入生成（P-27⑤ 先例·CityImportPostprocessor PPU 表已增 residents-atlas→24 行）。

## office-ladder/（74 件 S 库直采+1 件 r112 自焙镜像·AA-016.02 Modern_Exteriors 48x48·r102 入仓）

- 内容：**P-69① tile 阶梯办公层货源**（r101 施工件清单③④兑现）——整栋单体 11 件三档体：Condo_4_11=5×3 格（240×144px=10×6u）／Condo_4_16·19·20·21=6×3（288×144=12×6u）／Condo_3_10·11·12+Condo_4_23=3×3（144×144=6×6u）／Condo_4_24=3×2（144×96=6×4u）／Condo_3_5=5×2（240×96=10×4u）+楼层板族 63 件（Ground_Floor_Condo_Modular_1..24=1×3 48×144／Middle_Floor_Modular_1..30=1×4 48×192／Roof_Modular_1..9=1×6 48×288·r101 连通域实测全单连通板）；共 74 件 73,203B。
- 来源：**AA-016.02 S 库 L2 直用**（MiniGame Art Assets 只读拷贝零改动·源目录计数前后不变 109/343 实证）——授权闸=2026-09-22 用户全量确认购置合法在册+U121 轻档（M1/M2=S0-S2 研发期）·四闸+P-21 消费链在册·非新采购零新许可义务。
- 风格闸（r101 ⑦ 随行）：AA-016 日间平涂系入城走 r44 车辆同律——环境 tint 乘性重映射（r13 四档色轮罩城带）+五色律光色归位（QUANT 金/GAME 青/MEDIA 品红）引擎施工轮随证；48px@PPU24=2u/层（P-17 办公楼 4-6 tile=2-3 层判据）。
- 消费实况（r102 预置）：**引擎布设待 r103 编辑器施工轮**（r101 预算表：南岸分区重排+扭塔制高+双球滨水前排+方塔群后列成阵=③清单三档体复用成阵+楼层板组装补办公层）；.meta 随首个编辑器轮导入生成（P-27⑤ 先例·CityImportPostprocessor PPU 表已增 office-ladder→24 行）。
- 消费实况（r112 引擎落地）：**街面办公带 v1 五楼入城**——`OfficeRules.cs` 纯表 5 布设（E1 南岸东外 [29,-16,35,-12]＋北岸 N3/N1/N2/N4 走道排 y[9,13]·全 Condo_4_24 三档体 6×4u@PPU24·零迁移零普查违例=r111 officeband-manifest 逐位）+镜像变体 1 资产 2 消费（N2/N4=`ME_..._Condo_4_24_mirror.png`·`Tools/city/bake-office-mirror.ps1` 自焙=raw ARGB 列翻转零重采样〔r93 律〕·sha12=270B561E1BC1·双跑确定性）；精灵族 Office* GO order 3·零 tilemap 笔触（城层计数 40/49/54 前后不变证）；风格闸随证=暖移（day .128→dusk .263）+夜暗（.364<.531）双绿（r44 律·黄昏 tint=α0.22 暖金叠加非乘暗）；包 74→75 件；楼层板族 63 件仍待 v2 阶梯装配切片。
- 消费实况（r138 引擎落地）：**Ground 台面 1 布设入城（楼层板族首件消费）**——`OfficeRules.cs` Ground 台表 1 行（Terrace01 西框角 [−35,−33]×[−16,−10]=r137 terraces-manifest T1·零迁移·ResG07 0.833u/camper 2.542u 让位在册）·精灵族 Terrace* GO order 3 零 tilemap 笔触（南城层 40/49/54 不动）；**变体勘正（manifest asset_family 授权兑现）**：Modular_1 实测无门（底部=招牌带+封死基座·r136 接触表「每模块一门」对该变体判负）→暗列普查 24 变体后换钉 **Modular_22**（拱顶落地门·暗列 y63..143=81px=3.375u≥2.0u=1.5× 律·门槛+气窗齐）；门面 L1 证据=docs/design/m1-r138-terrace-l1-west.png；楼层板族余 62 件未消费（Middle/Roof=留观池 r136③）。

## tower-antennas（r132 脑塔 v2.0 三针天线）——集团自产件

- 内容：**脑塔 v2.0 楔尖三天线针**（tower-v2-manifest antennas law——中间=CEO 面壁者位最粗最高·纯白常亮；两侧=机队心跳针）——mid 4×14px（0.25×0.875u@16ppu）+side 2×9px（0.125×0.5625u）两件
- 来源：**本仓自焙**（`Tools/city/bake-tower-antennas.ps1` GDI+ 程序化白针·零外采零第三方许可义务·确定性双跑 SHA256 稳：mid 9A15DBE98370/side CFF920F5A169）
- 消费实况（r132 引擎落地）：`NeonSigns.cs` 表 21 行（NeonTowerAntM/L/R·MountExempt 豁免族=r87 天线先例——招牌框架律不适用，NeonProof 针族门〔楔尖 x 域 [0,1]·中间严格最高最宽·顶 ≤19.9 帧边距律〕执法）

## lab-glass（8 件·本仓自焙·r140 P-39① 实验区静态件预置）——集团自产件

- 内容：**CPH4 Labs 实验区玻璃设施八件**（DESIGN §十六 16.3 视觉令——超体蓝〔CPH4 64,196,255 主谱锚=脑深层蓝·r139 ③〕玻璃拟态五原子〔半透明渐变 alpha 85..150 带+发光描边+外发光晕+高光斜条+暗冷基座·P-18 同技法入世界层〕+白大褂区洁净冷光·红灯仅 FAIL 语义禁入静态件）——孵化舱群 3（lab-pod-tall 48×72=2×3u·lab-pod-mid 48×48=2×2u·lab-pod-wide 96×48=4×2u 双舱+中支柱流光点）+居民诞生站 lab-birth 96×72=4×3u（中央出生舱+仪器墙 2×4 窗格+出生墙 15 卡槽三亮位〔最近出生卡滚动语义〕）+城市未来沙盘台 lab-sandbox 96×48=4×2u（桌面微缩城六楼+最高楼天线〔孤立白像素=设计件〕+全息光带）+数据管道段 3（lab-pipe-h 48×16／lab-pipe-v 16×48／lab-pipe-node 16×16·流光窗格段=西行入塔「研究结论回流治理层」语义件）——舱体 ≤3u 低伏律（r139 ②·顶 ≤12<办公 13<脑塔 19）。
- 来源：**本仓自焙**（`Tools/city/bake-lab-glass.ps1` GDI+ 程序化·零外采零第三方许可义务）——确定性双跑 SHA256 幂等（pod-tall 76D288CED89F／pod-mid 6EB250327031／pod-wide 3C74F195C6C6／birth 4D9D747FF1BE／sandbox 8D990ABF185A／pipe-h EF03FACC2C3C／pipe-v B73796407809／node F5B2666A42E3）+带位自检四门（透明角×8·超体蓝 lit 计数 332/236/502/476/40/48/48/16·玻璃带 1271/752/1648/1211·8 件互异）全绿+4× 拼图多模态抽验 8/8 可辨零缺陷（logs/devloop-r140-sheet.ps1）。
- 消费实况（r140 预置）：**引擎布设待 r141 布设沙盒轮**（labs-manifest.json 唯一几何源·落位窗双案终裁 r139 ②）→r142 引擎轮 LabsRules 精灵族 GO（OfficeRules 先例）；.meta 随首个编辑器轮导入生成（P-27⑤ 先例·CityImportPostprocessor PPU 表已增 lab-glass→24 行）。
- 消费实况（r142 引擎落地）：**实验区首件 12 布设入城（1 舱+檐上管道带）**——`LabsRules.cs` 纯表 12 布设（LabPodTall01 [21,9,23,12]=r141 labs-manifest L1 零迁移〔ResN02 站舱西 0.333 街景位·EAVE-N01 东 1.0u〕+LabPipeH01..H10 檐上带 [3,13,23,13.6667] 西端脑塔东面 x3 平接〔B7 dock·研究结论回流治理层语义〕+LabPipeV01 挂舱顶〔入顶 0.333·带顶平齐·host-mount〕）；精灵族 LabPod* GO order 3+LabPipe* order 6（NeonAntenna r87 结构层先例·signs 6<street 7<tint 8）零 tilemap 笔触（城层 40/49/54+props 44 前后不动证）+LabsProof 门（表=manifest 镜像读/普查全活源/立足胞 pavement 重推导/链连通/相异律/重载门）+四截图 docs/design/m1-r142-labs-*.png；.meta 本轮首导（P-27⑤ 先例·ForceSprite 幂等执法）；余 4 件配额缺口（pod-mid/pod-wide/birth/sandbox 留盘未消费）=F-20260925-12 CEO 呈报面（席位 trade 三径在册）。

## canopies/（3 件·AA-016.02 裁切衍生自焙·r149 入仓）

- 内容：**雨天檐下骑楼/遮棚资产线首产**（D-20260925-09 径 B 条纹篷裁切自焙·r135 三径清单推荐径兑现）——canopy-green 91×30／canopy-orange 91×30／canopy-brown 88×36 三色条纹篷独立 sprite（源=Market_Small storefront 条纹篷带**零重采样裁切**+整条边饰 trim〔半截条纹端裁除律〕+合成 1px 框环〔c1 主色 45% 调暗=每色系自含框〕）；48px 档@PPU24=3.79×1.25u／3.67×1.5u（沿街店面篷·深度为源件真容）。
- 来源：**AA-016.02 S 库 L2 裁切衍生**（`Tools/city/bake-canopies.ps1` GDI+ 确定性烘焙·源只读〔src-count 12/12 前后不变〕·CJK 源路径外置 `Tools/city/canopy-sources.txt`〔r53 编码律〕）——授权链承 AA-016（2026-09-22 用户全量确认购置合法+U121 轻档 M1/M2 研发期）·裁切+自焙框环=衍生件零新许可义务。
- 确定性：端到端复焙逐字节同（报告 hash 同+三件 SHA 稳：green 89AEBECD1A3F／orange D60721848D0C／brown E6AD7867613B）+fail-loud 门全绿（w 80..170／h 16..48／裁后污染 ≤0.5%／中行交替 ≥8／双 compose 幂等／三件互异）；12 源全检出=3 色系（绿 82,151,96／橙 242,178,43／棕 145,102,98·双画布 offset 族 pair-dup 证据=logs/devloop-r149-canopybake.txt）。
- 风格闸（r135 ③ 随行）：AA-016 日间平涂系入城走 r44 车辆同律——环境 tint 乘性重映射+五色律光色归位（QUANT 金/GAME 青/MEDIA 品红随落位轮）；多模态 4× 台架 3/3 绿（条纹规整〔中行机械证=6px 均匀 pitch 14+1 条·「宽白条」=视觉误读定谳〕／框环闭合／零污染／可独立使用·棕框偏褐=自含框设计律）。
- 消费实况（r149 预置）：**落位施工待 CEO 品字复验**（D-09③·F-20260925-03）后布设沙盒轮（配额=QUANT/GAME 各 ≥2 檐下位·D-09②·r123 槽位门族全套）——伞道具缺口维持（r122(e)·CG 配件槽零命中 r135）；.meta 随首个编辑器轮导入生成（P-27⑤ 先例·CityImportPostprocessor PPU 表已增 canopies→24 行）。

## office-towers/（15 件·AA-016.02 裁切 11+本仓自焙 4·r151 预置+r152 MEDIA 第四皮）

- 内容：**hi-bit 立面双径资产**（r150 货源定谳 B/C 兑现·r152 挂载矩阵定谳）——①3×3 族直采 11 件 144×144px@PPU24=6×6u：tower-glass-31..37 玻璃方塔 7〔顶带+格栅基座·**k37 直用候选 r152 勘正撤销→黄昏重映射留观池**（近白 43.8%+预演贴纸读=明度轴穿帮·见 facades-manifest verdict_change）〕+tower-mid-39..42 三开间中楼 4〔**k41=源表字节级精确重复 k39**·DUP_OF 普查留痕 r149 pair-dup 同律〕；②微窗皮自焙 4 件：facade-quant 120×192=5×8u（金 accent）／facade-game 120×120=5×5u（青 accent）／facade-annex 48×72=2×3u（青 accent）／**facade-media 144×144=6×6u（品红 accent·r152）**——规则微窗格 2×3px+8px 楼层带+冠线 accent+暗基带·**窗灯中性面**（静态零亮窗=禁装饰律·点亮率归 P-38③ 热力线）。
- 来源：直采 11=**AA-016.02 S 库 L2 裁切衍生**（`Tools/city/crop-office-towers.ps1` 零重采样·源路径承 landmark-sheets.txt〔r53 律〕·源只读 size+mtime 双不动·紧框门 11/11 零 trim〔occ=1×10+0.914×1〕·双跑 SHA 稳·distinct 10/11〔源内精确对 1〕）——授权链承 AA-016（2026-09-22 用户全量确认购置合法+U121 轻档 M1/M2 研发期）零新许可义务；自焙 4=**本仓 GDI+**（`Tools/city/bake-facade-skin.ps1` r140 范式·双跑 SHA 稳 17DD5EB3AF73／B5307D95A363／D22B8E620D43／**A72D1CC7566D（r152 media）**·像素类普查门+未亮窗律门〔>80 亮度唯 accent 冠线〕+全不透明门）零外采零许可义务。
- 风格闸（r151 锚预演·r44 律三轴）：**三轮定谳**——首焙近黑底 FAIL（dusk tint 下棕调）→紫移 v1 仍 FAIL→根因律=**dusk tint α0.22 恒加 (56,35,24)=任何底 r≥56 硬底·近黑底结构性到不了锚紫族**→正解=皮面自带锚族基值（art-target-dusk 未亮楼体实测 bins 40,40,80／48,48,88／56,56,104 采样定色）→终判三轴全 PASS+**实境贴合绿**（皮贴现城 QUANT/GAME/ANNEX 塔位合成图）；C 组 11 件三轴同过但 **r152 补测明度轴=玻璃族近白大板在黄昏锚下读作正午日光贴纸（k37 近白 43.8%/k31 51.7%·多模态定谳「巨大面光源」=负面清单「全亮窗灯」精神面穿帮）→直用径撤销·黄昏重映射候选线**（明度压中低+蓝紫镜面 hue+mullion 分格）；预演证据=logs/devloop-r151-tower-preview.{py,png}+r152 盘级普查。
- 消费实况（r152 布设沙盒毕）：**挂载矩阵定谳=`Tools/city/facades-manifest.json`**（四挂载 rect=southbank 逐位零迁移·QUANT/GAME_MAIN/ANNEX/MEDIA 全自焙皮径·order 3 建筑族档）+断言门 logs/devloop-r152-facades-test.ps1 477 断言全绿→**r153 引擎轮待领**（FacadeRules 纯表+证明扩容+四截图 §三 复扫+r44 实境和谐随证）；.meta 随首个编辑器轮导入生成（P-27⑤ 先例·CityImportPostprocessor PPU 表已增 office-towers→24 行）。
