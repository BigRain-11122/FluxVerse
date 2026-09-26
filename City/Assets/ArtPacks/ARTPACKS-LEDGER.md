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

## lab-glass（10 件·本仓自焙·r140 P-39① 预置+r168 D-20260926-02 remedy 2u 档扩）——集团自产件

- 内容：**CPH4 Labs 实验区玻璃设施八件**（DESIGN §十六 16.3 视觉令——超体蓝〔CPH4 64,196,255 主谱锚=脑深层蓝·r139 ③〕玻璃拟态五原子〔半透明渐变 alpha 85..150 带+发光描边+外发光晕+高光斜条+暗冷基座·P-18 同技法入世界层〕+白大褂区洁净冷光·红灯仅 FAIL 语义禁入静态件）——孵化舱群 3（lab-pod-tall 48×72=2×3u·lab-pod-mid 48×48=2×2u·lab-pod-wide 96×48=4×2u 双舱+中支柱流光点）+居民诞生站 lab-birth 96×72=4×3u（中央出生舱+仪器墙 2×4 窗格+出生墙 15 卡槽三亮位〔最近出生卡滚动语义〕）+城市未来沙盘台 lab-sandbox 96×48=4×2u（桌面微缩城六楼+最高楼天线〔孤立白像素=设计件〕+全息光带）+数据管道段 3（lab-pipe-h 48×16／lab-pipe-v 16×48／lab-pipe-node 16×16·流光窗格段=西行入塔「研究结论回流治理层」语义件）——舱体 ≤3u 低伏律（r139 ②·顶 ≤12<办公 13<脑塔 19）。
- 来源：**本仓自焙**（`Tools/city/bake-lab-glass.ps1` GDI+ 程序化·零外采零第三方许可义务）——确定性双跑 SHA256 幂等（pod-tall 76D288CED89F／pod-mid 6EB250327031／pod-wide 3C74F195C6C6／birth 4D9D747FF1BE／sandbox 8D990ABF185A／pipe-h EF03FACC2C3C／pipe-v B73796407809／node F5B2666A42E3）+带位自检四门（透明角×8·超体蓝 lit 计数 332/236/502/476/40/48/48/16·玻璃带 1271/752/1648/1211·8 件互异）全绿+4× 拼图多模态抽验 8/8 可辨零缺陷（logs/devloop-r140-sheet.ps1）。
- 消费实况（r140 预置）：**引擎布设待 r141 布设沙盒轮**（labs-manifest.json 唯一几何源·落位窗双案终裁 r139 ②）→r142 引擎轮 LabsRules 精灵族 GO（OfficeRules 先例）；.meta 随首个编辑器轮导入生成（P-27⑤ 先例·CityImportPostprocessor PPU 表已增 lab-glass→24 行）。
- 消费实况（r142 引擎落地）：**实验区首件 12 布设入城（1 舱+檐上管道带）**——`LabsRules.cs` 纯表 12 布设（LabPodTall01 [21,9,23,12]=r141 labs-manifest L1 零迁移〔ResN02 站舱西 0.333 街景位·EAVE-N01 东 1.0u〕+LabPipeH01..H10 檐上带 [3,13,23,13.6667] 西端脑塔东面 x3 平接〔B7 dock·研究结论回流治理层语义〕+LabPipeV01 挂舱顶〔入顶 0.333·带顶平齐·host-mount〕）；精灵族 LabPod* GO order 3+LabPipe* order 6（NeonAntenna r87 结构层先例·signs 6<street 7<tint 8）零 tilemap 笔触（城层 40/49/54+props 44 前后不动证）+LabsProof 门（表=manifest 镜像读/普查全活源/立足胞 pavement 重推导/链连通/相异律/重载门）+四截图 docs/design/m1-r142-labs-*.png；.meta 本轮首导（P-27⑤ 先例·ForceSprite 幂等执法）；余 4 件配额缺口（pod-mid/pod-wide/birth/sandbox 留盘未消费）=F-20260925-12 CEO 呈报面（席位 trade 三径在册）。
- 增量（r168·D-20260926-02 remedy 候选③缩宽资产线·P-39 施工序第一段）：**2u 档两件自焙**=lab-birth-2u 48×72=2×3u（紧凑诞生站：玻璃舱+出生墙 2×5 十卡槽三亮位——4u 版 15 槽的紧凑档·滚动语义同归时态接线轮）+lab-sandbox-2u 48×48=2×2u（紧凑沙盘台：全息光带+微缩城四楼+最高楼天线）——r141 东窗净宽 3.33u 对 4u 件全灭·D-02「诞生站+沙盘先行」两件先补（数据腿 r164/r165 已备）；确定性双跑 SHA 幂等（birth-2u 95D3B19864B0／sandbox-2u 1DD4420097CD）+**存量 8 件 SHA 与 r140 提交版逐位同**（烘焙器存量段代码零触碰旁证）+沙盒断言门 logs/devloop-r168-lab2u-test.ps1（A0 烘焙器 ASCII 审计/A1 盘 census+IHDR 尺寸/A2 存量 8 对 r140 记录/A3 新件 SHA 钉+2u 宽度律 48px@PPU24+10 互异/A4 角透明/A5 独立 lit·glass 复核 280·872/18）全绿；.meta 随下个编辑器轮首导（P-27⑤·导入器 lab-glass→24 行已在册零新行）；布设沙盒轮（施工序第二段·r141 harness 2u 几何重普查）待领。

## canopies/（3 件·AA-016.02 裁切衍生自焙·r149 入仓）

- 内容：**雨天檐下骑楼/遮棚资产线首产**（D-20260925-09 径 B 条纹篷裁切自焙·r135 三径清单推荐径兑现）——canopy-green 91×30／canopy-orange 91×30／canopy-brown 88×36 三色条纹篷独立 sprite（源=Market_Small storefront 条纹篷带**零重采样裁切**+整条边饰 trim〔半截条纹端裁除律〕+合成 1px 框环〔c1 主色 45% 调暗=每色系自含框〕）；48px 档@PPU24=3.79×1.25u／3.67×1.5u（沿街店面篷·深度为源件真容）。
- 来源：**AA-016.02 S 库 L2 裁切衍生**（`Tools/city/bake-canopies.ps1` GDI+ 确定性烘焙·源只读〔src-count 12/12 前后不变〕·CJK 源路径外置 `Tools/city/canopy-sources.txt`〔r53 编码律〕）——授权链承 AA-016（2026-09-22 用户全量确认购置合法+U121 轻档 M1/M2 研发期）·裁切+自焙框环=衍生件零新许可义务。
- 确定性：端到端复焙逐字节同（报告 hash 同+三件 SHA 稳：green 89AEBECD1A3F／orange D60721848D0C／brown E6AD7867613B）+fail-loud 门全绿（w 80..170／h 16..48／裁后污染 ≤0.5%／中行交替 ≥8／双 compose 幂等／三件互异）；12 源全检出=3 色系（绿 82,151,96／橙 242,178,43／棕 145,102,98·双画布 offset 族 pair-dup 证据=logs/devloop-r149-canopybake.txt）。
- 风格闸（r135 ③ 随行）：AA-016 日间平涂系入城走 r44 车辆同律——环境 tint 乘性重映射+五色律光色归位（QUANT 金/GAME 青/MEDIA 品红随落位轮）；多模态 4× 台架 3/3 绿（条纹规整〔中行机械证=6px 均匀 pitch 14+1 条·「宽白条」=视觉误读定谳〕／框环闭合／零污染／可独立使用·棕框偏褐=自含框设计律）。
- 消费实况（r149 预置）：**落位施工待 CEO 品字复验**（D-09③·F-20260925-03）后布设沙盒轮（配额=QUANT/GAME 各 ≥2 檐下位·D-09②·r123 槽位门族全套）——伞道具缺口维持（r122(e)·CG 配件槽零命中 r135）；.meta 随首个编辑器轮导入生成（P-27⑤ 先例·CityImportPostprocessor PPU 表已增 canopies→24 行）。

## office-towers/（18 件·AA-016.02 裁切 11+本仓自焙 7·r151 预置+r152 MEDIA 第四皮+r175 地标三剪影）

- 内容：**hi-bit 立面双径资产**（r150 货源定谳 B/C 兑现·r152 挂载矩阵定谳）——①3×3 族直采 11 件 144×144px@PPU24=6×6u：tower-glass-31..37 玻璃方塔 7〔顶带+格栅基座·**k37 直用候选 r152 勘正撤销→黄昏重映射留观池**（近白 43.8%+预演贴纸读=明度轴穿帮·见 facades-manifest verdict_change）〕+tower-mid-39..42 三开间中楼 4〔**k41=源表字节级精确重复 k39**·DUP_OF 普查留痕 r149 pair-dup 同律〕；②微窗皮自焙 4 件：facade-quant 120×192=5×8u（金 accent）／facade-game 120×120=5×5u（青 accent）／facade-annex 48×72=2×3u（青 accent）／**facade-media 144×144=6×6u（品红 accent·r152）**——规则微窗格 2×3px+8px 楼层带+冠线 accent+暗基带·**窗灯中性面**（静态零亮窗=禁装饰律·点亮率归 P-38③ 热力线）。
- 来源：直采 11=**AA-016.02 S 库 L2 裁切衍生**（`Tools/city/crop-office-towers.ps1` 零重采样·源路径承 landmark-sheets.txt〔r53 律〕·源只读 size+mtime 双不动·紧框门 11/11 零 trim〔occ=1×10+0.914×1〕·双跑 SHA 稳·distinct 10/11〔源内精确对 1〕）——授权链承 AA-016（2026-09-22 用户全量确认购置合法+U121 轻档 M1/M2 研发期）零新许可义务；自焙 4=**本仓 GDI+**（`Tools/city/bake-facade-skin.ps1` r140 范式·双跑 SHA 稳 17DD5EB3AF73／B5307D95A363／D22B8E620D43／**A72D1CC7566D（r152 media）**·像素类普查门+未亮窗律门〔>80 亮度唯 accent 冠线〕+全不透明门）零外采零许可义务。
- 风格闸（r151 锚预演·r44 律三轴）：**三轮定谳**——首焙近黑底 FAIL（dusk tint 下棕调）→紫移 v1 仍 FAIL→根因律=**dusk tint α0.22 恒加 (56,35,24)=任何底 r≥56 硬底·近黑底结构性到不了锚紫族**→正解=皮面自带锚族基值（art-target-dusk 未亮楼体实测 bins 40,40,80／48,48,88／56,56,104 采样定色）→终判三轴全 PASS+**实境贴合绿**（皮贴现城 QUANT/GAME/ANNEX 塔位合成图）；C 组 11 件三轴同过但 **r152 补测明度轴=玻璃族近白大板在黄昏锚下读作正午日光贴纸（k37 近白 43.8%/k31 51.7%·多模态定谳「巨大面光源」=负面清单「全亮窗灯」精神面穿帮）→直用径撤销·黄昏重映射候选线**（明度压中低+蓝紫镜面 hue+mullion 分格）；预演证据=logs/devloop-r151-tower-preview.{py,png}+r152 盘级普查。
- 消费实况（r152 布设沙盒毕）：**挂载矩阵定谳=`Tools/city/facades-manifest.json`**（四挂载 rect=southbank 逐位零迁移·QUANT/GAME_MAIN/ANNEX/MEDIA 全自焙皮径·order 3 建筑族档）+断言门 logs/devloop-r152-facades-test.ps1 477 断言全绿→r153 引擎轮已毕（r162 落地）；.meta 随首个编辑器轮导入生成（P-27⑤ 先例·CityImportPostprocessor PPU 表已增 office-towers→24 行）。
- 消费实况（r177 地标换装引擎轮毕·00:10 美术整改令 T-FV-002 S4）：**三剪影全数入城**=quant-twist→FacadeRules row 0（FacadeQUANT 位）+media-pearl→row 3（FacadeMEDIA 位）〔asset 路径换装·rect/px/名零改〕+brain-crown→BrainCrownRules 纯表（脑塔 tip 区 [-0.5,18,1.5,19]·order 3）；facade-quant/facade-media 退役留盘（P-21④ 弃置留痕义·git 史内为 r176 前倒影之源）；倒影重源 r176（refl-quant/refl-media 改切三剪影顶 72px·bake-water-fx r176 模式·新 SHA D5E099FF1233/098E58F50129）；.meta 三件随本轮首编辑器导入生成（P-27⑤·office-towers→24 行覆盖零新行）；正典=Tools/city/landmarks-manifest.json（r176 沙盒 95 断言）+BrainCrownProof 177 断言（r177）+FacadeProof 480 断言重跑全绿。
- 增量（r175·00:10 美术整改令 S2 地标自焙预置轮·T-FV-002 施工序兑现 r174 勘定单）：**上海天际线三剪影自焙 3 件**=quant-twist 120×192=5×8u（底宽顶收双缘弧线+2×3 微窗格+暗基带+**金螺旋 seam 非对称 helix 对**〔v2：镜像相位=打褶读·判后改 2.2 rad 相位差=单交反行旋转读〕·QUANT 金沿 seam·青白 hero 光=脑塔 CEO 专属不破戒）+media-pearl 144×144=6×6u（竖轴+下大上小双球+三叉外撇腿+天线杆+球面微窗+品红双赤道甲板线）+brain-crown 48×24=2×1u（白玉兰花苞冠·tip 区 world y18..19 换形不外增高度·双萼片缝=超体蓝 lit 谱〔r140 谱锚〕）；三件=alpha 精灵换装面（facade 族 order 3·twist/pearl rect 包络逐位=facades-manifest QUANT/MEDIA 位·S3 布设沙盒轮领·冠锚 tip 区）；确定性双跑 SHA 幂等（twist D713172B83C3／pearl 325E701ABFD6／crown D0CDC03794A0）+钉版 census 门（gold 359·magenta 94·frame 256·rim 888·lit 43）+存量 4 皮 SHA 逐位同（烘焙器前后卫门）+六面门 31/31 绿（A0-A6·logs/devloop-r175-landmark-test.ps1）+**风格闸两轮多模态全 PASS**（首轮 twist seam=pleat 读→改案 v2 复判 helix 单交反行确认·pearl/crown 首轮即过·四轴和谐+实位贴合绿·台架 logs/devloop-r175-landmark-preview.{py,png}）；.meta 随首个编辑器轮导入（P-27⑤·office-towers→24 导入器行现役零新行）；Token 三问=L1（确定性 GDI+ 零生成触点）。

## water-fx/（15 件·本仓自焙·r154 P-20260925-09 水面效果预置）——集团自产件

- 内容：**水面六件资产面（规格 R-20260925-water-daynight §一 W1-W5 的烘焙半·r153 施工序 r154 段兑现）**——①**倒影 4**（W2·夜档必显）：facades/ refl-quant 120×72／refl-game 120×72／refl-media 144×72=facade 皮顶 72px 裁切+raw ARGB 竖翻〔r93 零重采样律〕+暗化 60%〔×0.4〕——**镜像语义律=物体近水缘落岸线**（楼顶冠线贴 y−3 岸·深处递降）；refl-tower 80×48=**真材 tile 合成**（tower-v2-manifest 下 3u：基座 5 胞×2 行玻璃 189+塔身行+发光带 props 132/133 overlay·预镜像布局〔基座在岸缘〕×0.4）；②**三色碎光 3**（W4）：shimmer-gold/cyan/magenta 24×40（五色律家族 tint=城层色 QUANT 250,191,51／GAME 51,235,219／MEDIA 242,82,168·确定性逐列光束 run+sparkle 向白 60% 混+深水 glint）；③**泡沫帧 8**（W3 v0）：foam-n-0..3／foam-s-0..3 1600×2（北条 solid 行在上=贴 y3 岸线·南条 solid 行在下=贴 y−3；疏密两行=堤岸渐变 v0·与水帒帧同步微动）。
- 来源：**双源衍生+本仓自焙**——facade 倒影=r151/152 自焙皮只读裁切（零新许可义务）；塔倒影=CleanCityv3 真材 tile 合成（授权链承 AA-022）；碎光/泡沫=纯程序化 GDI+（零外采零许可义务）。`Tools/city/bake-water-fx.ps1`：双跑 SHA 幂等+安装幂等（stale 拒写）+源只读门（size+mtime 双不动）——SHAs：refl-quant C007613EFAE7／refl-game 2A4F1867B936／refl-media 4BA113444F98／refl-tower 18E50A1808F2〔发光带 overlay 241px〕／shimmer F5C8F17E294A·3ACD9C79AF82·34DABFC734AA／foam 8 帧互异（E20819997BAD·D46F552FBFA0·61B225476CBD·F11BE5A3FA60·823C5B64E312·6EC7FB2233DA·0DA235C34CB1·5EFD4B66CEA1）。
- 定谳面：**`Tools/city/waterfx-manifest.json`**（唯一几何/法源）——水带实锚=builder L225（cells x −50..50·rows −3..2·静铺 hash h=(x·31+y·17)&7）+**帧径终裁=tilemap SetTile 八帒错相循环**（8 帧全在库现役仅 4 注册·idx=((x·31+y·17+t) mod 8)·2fps 雨 4fps·census 恒等 606·quad 帧动画判负=大纹面+tint/证明基线族重推导·4 帧降级 fallback 在册）+12 挂载 rect 双源对表（塔=tower-v2 whole·南三城=facades-manifest x 跨逐位·碎光锚=NeonSigns 表 6 件活表交叉）+render 律（order 2=水 1 上 tint 8 下〔倒影吃黄昏/夜 tint 如城具〕·tier alpha day0/dusk0.55/night1·wobble 1px 雨 2px·泡沫恒显）+碎光**外对选位律**（每城最外招牌对=零重叠构造·Bigmoney/Biggame 中心位省略=冠线倒影承载·诚注在册）+COMMIT 过江光点叠静态条=物理合法注记（r114 律只绑 COMMIT↔TRANSFER）；断言门 logs/devloop-r154-waterfx-test.ps1 **27 断言全绿**（含全 15 件逐字节独立复算——门面 A6b 首红自证=门面自身括号 bug〔($c*16)+($px)*4 漏整组 *4〕·三探针定谳盘上件从头正确：宁红勿假绿+复算独立双面机制实证案例）。
- 消费实况（**r155 引擎接线毕**）：15 件全数入城——WaterFxRules 纯表+CityWaterFx 场景持久适配器（12 挂载=倒影 4+碎光 6+泡沫 2·WaterFxProof 幂等扫建存盘·serialized frameTiles[8]/foamSprites[8] 场景自携=运行时零 Resources 依赖）+builder +4 MK 行（t_water_1/5/6/7 循环词汇·CitySkeletonBuilder.EnsureWaterCycleTiles 公共接线）+WaterFxProof 1487 断言（census 恒等 606×10 tick/夜档逐挂载差分 census·day_leak=0/重载门）；.meta 15+2 目录随 r155 首个编辑器轮导入生成并定向提交（P-27⑤ 先例·CityImportPostprocessor PPU 表 water-fx/facades→24 行·父目录默认 16 档——同窗首导 canopies/office-towers 批 meta 一并入册）。

## light-fx/（24 件·本仓自焙·r157 P-20260925-09 日夜线 D3 光感+D4 天象预置）——集团自产件

- 内容：**光感/天象五家族资产面（规格 R-20260925-water-daynight §二 3/4 的烘焙半）**——①**招牌 bloom 16 件**（17 店招挂载=21 招牌−4 豁免结构族〔NeonAntenna+三塔针〕：椭圆阶梯晕 a165/120/75×半径 0.45/0.75/0.92+棋盘 dither 环 a40=像素式柔光·px 律=招世界尺寸 ×1.7/×1.6×16 预焙精确 px·QuantL/R 双子共享 bloom-quant.png〔16 件服 17 挂载·r149 pair-dup 同律〕·五色族色焙入〔金/青/品红/琥珀/teal/白蓝/深蓝〕·全部默认 PPU16 档自然尺寸零重采样）；②**街灯锥光斑 lamp-pool 40×24@PPU16=2.5×1.5u**（暖琥珀 255,205,130 椭圆池 a130/100/65+dither 35·12 挂载=builder t_prop_post 12 柱〔136 帧多模态定谳=灯柱臂朝东→池心=柱位+1.5·北 promenade row 4/南 row −5〕·136 红灯头=信号词汇不焙入环境池〔五色律红=警示专属〕）；③**湿路反光 6 件**（80/96/48×32=路带 2u·基面竖向 sheen 55→25+**去规律化竖纹**〔hash 律 (x²·31+x·7) mod 11<2·亮度 +16..30·滚动路面零摩尔纹〕+5px 边缘渐隐 0.25..1.0·南三城 rect=Buildings 4/5/6 北三低楼=1/2/3 逐位·vcol 零重叠构造·五色族色焙入）；④**星点 star-point 3×3**（心 a255 白青+十字 a120·22 挂载 1/16 网格点位·夜档 twinkle 0.5s 四步〔100/55/25/55〕）；⑤地平线带=**运行时渐变 quad 族零焙件**（CityAmbient EnsureVisuals 家·晨昏专·skyBottom 族色）。
- 来源：**本仓 GDI+ 程序化自焙**（`Tools/city/bake-light-fx.ps1`·manifest 驱动单源 `Tools/city/lightfx-manifest.json`·NeonSigns 活表 regex 单源零硬拷·双跑 SHA 幂等+24 件互异+fail-loud 门 G1-G4）——零外采零许可义务；**风格闸三轮定谳**（r140 4× 拼图多模态抽验 logs/devloop-r157-lightfx-sheet.png）：bloom/锥/星首判全绿·湿条首判负〔硬矩形边+周期网格感〕→v2 边缘渐隐+行带软化仍判负〔竖纹等距周期律=滚动摩尔纹根·不融于半 alpha〕→**v3 竖纹 hash 去规律化+横带全清+边淡出 5px=合格**〔「竖纹有机·无横向纹·边缘软过渡·1x 低 alpha 渲染无显形」·r111 FAIL 回退禁静默留律执法〕。
- 定谳面：**`Tools/city/lightfx-manifest.json`**（唯一几何/法源）——五家族挂载账（bloom 17/锥 12/湿 6/星 22/带 2）+**零触窗工程**（AmbientProof 天顶窗 y19.04/远岸条窗 y14.26+SkylineProof 剪影带 y15.4..16.6+CameraProof x=13 列〔带开 1.25u 网格隙·星点 exclusion 同律〕+塔区 x16 ±56=零触构造·邻接证明零重锚预注册）+层级律（bloom order6 z−0.4=招牌后〔signs z0 同序 z 分层 r155 律〕·锥 order4 z0.5=props 上街具下·湿 order2 z0.15=路面上下城层·星 order−9 z−0.5=FarOrder 活表交叉=远天际线后景深正读·带 order−9 z−1.0=星后=落日辉光物理位）+tier alpha 闭集（bloom 20/45/80/100·锥 0/40/80/100〔日=灯灭诚实律〕·湿 0/15/40/60·星夜专+twinkle·带晨昏专 35/50·r156 blend 骑乘）+honest 注记七条；断言门 logs/devloop-r157-lightfx-test.ps1 **20 检查全绿**（双 parse 确定性+ASCII 双审+活表四源交叉〔NeonSigns 招牌表/Buildings 表/builder 灯柱数组/AmbientWeather FarOrder+skyBottom〕+px 律独立复算〔floor(v+0.5) 原语〕+IHDR+GDI+ 像素质检+互异 SHA+pre-editor 零 meta 诚实态）。
- 消费实况（r157 预置）：**引擎接线待 r158 引擎轮**（coupled_updates 清单在 manifest：LightFxRules 纯表+CityLightFx 场景持久适配器〔r124/r155 范式·10s poll·tier alpha 扫+星 twinkle 累计器〕+CityAmbient 地平线带运行时 quad〔EnsureVisuals/ReleaseVisuals·r146 红链3 存盘纯度律〕+LightFxProof〔幂等/census/tier/渲染差分〔夜可见+日零漏〕/重载〕+邻接证明复跑〔r51 漂移律〕+四截图 §三 复扫贡献+真机 scan+verify 双绿）；.meta 随首个编辑器轮导入生成（P-27⑤ 先例·PPU 默认 16 档零 PpuFor 新行）。
- 消费实况（r158 引擎落地）：57 挂载入 CityScene（bloom 17/锥 12/湿 6/星 22 场景持久·日律存盘）+**manifest v0.2 z 物理勘正**——本节上文与 manifest v0.1 的 z 全系反号（CityCamera 实勘 z −10 朝 +z=**z 越小越近相机越上层**·r155 水线正典同判）：v0.2 正值=bloom +0.40..0.432 招牌后（同族 0.002 步进=r119 平局律·Bigmoney 冠晕×QUANT 双翼真重叠）/锥 −0.5 props 上/湿 −0.15 路面上（**反号则整条被 Roads tilemap 挡死=勘正的实证面**）/星 +0.5 远天际线后/带 +1.0 全 −9 族最深；资产零触碰（z 不在烘焙件内）·几何/order/alpha 全承 v0.1；.meta 首导随本轮管线（P-27⑤）。

## resident-labels/（32 件·本仓自焙·r178 00:10 美术整改令 T-FV-002 S5 UI 标签预置）——集团自产件

- 内容：**居民 UI 名牌 32 件**（整改令第④件「居民名牌从世界层迁 UI 壳层」的资产半）=label-res-00..31.png 统一 80×26 胶囊（frame 内缩 (2,2)-(77,23)=76×22·radius 11 完美胶囊）——**GUIAgent 操作层月光五原子**（P-18/r22 UiKit 同谱）：暗玻璃竖向渐变体 α200〔(14,20,38)→(24,34,58)〕+细亮冷蓝描边 (108,160,255) α235+蓝紫外发光晕 13 偏移族 α38〔r97 plates 律〕+斜向高光条 α60+底部内阴影 α150；文字=FT-011 12px 点原三 pass bevel（glow→shadow→fill·r24/r97 律·fill 202,214,230 月光注记色正典）。
- 来源：**本仓 GDI+ 程序化自焙**（`Tools/city/bake-resident-ui-labels.ps1`·ASCII 律·CJK 全数据透传）——源=街面名册正典 `Assets/Data/residents-street.json` plateName（身份单一数据源 r99 律·plateIndex 0..31 双射·r97 atlas 行序律承继）+字体 FT-011 Fusion Pixel 12px（OFL 参考不复制通道·r40 律）；**Tuanjie 无 CJK 像素字路径→uGUI 标签池挂预焙 PNG=正解**；确定性=烘焙内双跑 SHA256 幂等+32 件互异（roster plateName 零重名实测）+源只读门（名册+字体 size/mtime 双不动自证）；SHA12 族=label-res-00 5FACD771422F／01 A5DB4F910A08／13 CE48AE8F56DA／31 EDAEABC95C9D（全 32 在烘焙器 SHA12 块）。
- 验证门（r178）：harness logs/devloop-r178-uilabels-test.ps1 **22 断言全绿**（A0 双 ASCII 审计/A1 名册 32+plateIndex 双射+锚席律+IHDR 80×26×32+pre-editor 零 meta 诚实态/A2-A3 外部双跑字节同+32 SHA 互异/A4 角透明 α==0×32/A5 独立复算非信任打印〔glass≥300·stroke≥140·glow≥60·textLit≥60 全 32〕/A6 源只读+日志 go 集对名册全等+name-w 界 10..62+锚名 24..30）——**门面首红自证案例**=textLit 首版 α≥200 阈被玻璃体 α200 吞没（864 恒等=豆腐门失效）→改 α≥250 唯文字 fill 面·textLit 79..197 随字形覆盖变化=判别力恢复（r154 门面首红律执法）。
- 风格闸（多模态 8×4 接触图 logs/devloop-r178-label-sheet.png）：32/32 结构完整/零豆腐零截断/三原子在场/零溢出/风格统一五面绿——「华D」疑点=12px OCR 误读（载荷真值=华红·r27 小字律）；**两 authored-alpha 备注**=外发光晕偏淡（α38 承 plates 律·克制极简布局 P-18 正典读法）+高光条斜度弱读（14→58/6→50 斜带在 80×26 尺度读作顶光）——salience v1 升格候选随 S7 并排图册 CEO 复验面（r158 ⑥ 同式诚实注记）。
- 消费实况（r178 预置）：**引擎接线待 S5b 引擎轮**（施工面=ResidentTags 世界层 32 牌退役〔三件套→两件套体+影〕+NEW ResidentLabelsUI〔uGUI ScreenSpaceOverlay Canvas·L1 街景档 only·≤6 同屏=屏幕距离确定性排序·8px 头顶律随迁屏幕空间 WorldToScreenPoint〕+TagProof 转型 LabelProof〔世界牌 census==0+UI 池 census==32+选择律纯核金对·uGUI 批内不可渲染=r16 律→play 视觉=CEO 复验面〕+city-core §八 8px 基准行随迁+邻接证明 census 门族重锚〔Resident/StreetBehavior/Labs/Bubble 牌面门随迁〕）+四截图 L1 街景帧（世界零漂浮牌=整改④可证面）；.meta 随首个编辑器轮导入生成（P-27⑤·CityImportPostprocessor PpuFor 表已增 resident-labels→100 行=UI 1:1 canvas px 档·世界 PPU 律不适用于 UI 壳件）。
