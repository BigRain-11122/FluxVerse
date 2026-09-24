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
