# R-20260923-city-art-assets — 城市视觉资产线 批 2 v1.0

> 溯源：CEO 令 2026-09-23 ~23:31「城市还需要什么资产 都去弄」（音频批 1 同线扩面令·同日 23:02 资源倾斜令城建系列最高优先）。
> 定位：城市**非音频资产**（美术/光效/道具/居民/载具/环境）外采正典——缺口清点/池内覆盖判定/来源许可台账/落位/消费接线。视觉资产本体台账=`City/Assets/ArtPacks/ARTPACKS-LEDGER.md`；音频面见 `R-20260923-audio-assets.md`（姊妹件）。
> 纪律：反重复铁律先行——AA 池/FT 字库已覆盖的**不外采**；新源一律过「许可证据→否决留痕」闸（与音频批同法）。

---

## §一 缺口清点与池内覆盖判定（反重复·已核实）

| 需求面 | 判定 | 依据 |
|---|---|---|
| 街道车辆 | **池内已覆盖·不采** | AA-016.02 现代室外 `Vehicles_16x16/32x32`（Cars+Buses 动画帧·L2 直用候选）实测在库 |
| 中英文字体/霓虹字 | **池内已覆盖·不采** | FT-011 缝合像素（简中 5 语像素·OFL·像素游戏中文第一选择）+FT-016 PressStart2P（拉丁像素）+FT-010 得意黑——授权随行律照 FT 库 |
| 光效/辉光叠加 | **池内已覆盖·不采** | AA-034 Kenney 粒子包 193 张 PNG（circle/flash/dot/smoke/spark/trace 双底版·透明底版可作 2D 辉光叠加）实测清点 |
| 居民人形精灵 | 池内主力（AA-016.04 现代人物生成器+AA-028.2105141 四向角色 98 产品）+**外采补充池**（residents-of-city·见 §二） | M2/M5 万居民 NPC 池需量大使池 |
| 街道机器人 | **外采**（池内 AA-001.17 robot 头像=L1 解包禁直入） | tophat-robot 16×16 |
| 赛博街景/霓虹招牌 | **外采**（池内无霓虹件——AA-016 现代/AA-022 CleanCity 均为日常城市风） | warped-city + cyber-city |
| 远景天际线（大气透视层） | **外采**（r13 天空渐变已有，视差楼宇层强化纵深） | city-parallax 8 层 |
| 江面船只 | **外采**（黄浦江生活感；池内无） | watercraft-kit + ships-ripple |
| 施工/脚手架 | **不外采**——转 S 库线：MiniGame BoardForge 已有工地语法（脚手架三姿态+塔吊），DevLoop 走 S 库采纳通道（引用不复制）或程序化 | P-28 内注明 |
| 游戏图标 | 暂缓——UI 壳（M3）走 GUIAgent 风格正典自建，届时再定外采 | P-18 |
| 云 sprite | 不采——r13 程序化天空+视差层已足 | — |

## §二 已采纳源与许可台账（逐源证据=源页许可图标精确探测 2026-09-23）

| 资产 | 作者 | 许可 | OGA 页 | 落位 |
|---|---|---|---|---|
| Warped City（赛博城市环境+精灵+图块） | ansimuz | **CC0** | /content/warped-city | ArtPacks/warped-city/ |
| Cyber City（赛博城市+精灵模板） | warlloyd | **CC0** | /content/cyber-city | ArtPacks/cyber-city/ |
| City Parallax 8 层（远景楼宇视差） | CraftPix.net 2D Game Assets | **OGA-BY 3.0**（署名） | /content/city-parallax-background-with-buildings-pixel-art | ArtPacks/parallax-skyline/ |
| Residents of the City（城市居民群像 sheets） | CraftPix.net 2D Game Assets | **OGA-BY 3.0**（署名） | /content/residents-of-the-city-pixel-art-sprite-sheets | ArtPacks/residents-crowd/ |
| Watercraft Kit（船只套件） | Kenney | **CC0** | /content/watercraft-kit | ArtPacks/watercraft/ |
| Ships with ripple（水面涟漪动效船） | chabull | **CC-BY**（署名） | /content/ships-with-ripple-effect | ArtPacks/ships-ripple/ |
| Stylish Top-Hat Robot 16×16（街道机器人动画 sheet） | Nelson Yiap | **CC-BY**（署名） | /content/stylish-top-hat-robot-16x16-animated-spritesheet | ArtPacks/tophat-robot/ |

音频补批（并入 AUDIO-LEDGER）：Crickets loopable 夜蟋蟀（**CC0**·Wolfgang_·/content/crickets-ambient-noise-loopable）→ Audio/weather/；Neon Transit 赛博 BGM（**CC-BY**·Alexandr Zhelanov·/content/neon-transit）→ Audio/music/。

## §三 署名义务（引擎/发布 credits 必带·与 AUDIO-LEDGER 并列）

- `City Parallax Background & Residents of the City by CraftPix.net (OGA-BY 3.0, opengameart.org)`
- `Ships with ripple effect by chabull (CC BY 3.0, opengameart.org)`
- `Top-Hat Robot by Nelson Yiap (CC BY 3.0, opengameart.org)`
- warped-city / cyber-city / watercraft = CC0 零义务。

## §四 落位与消费接线

- **落位**：`City/Assets/ArtPacks/<pack>/`（与 DevLoop 施工区 `Assets/Art/` 分离——外采包=原料库，DevLoop 按 P-21 四通道链精选消费入场景）；本体台账=`City/Assets/ArtPacks/ARTPACKS-LEDGER.md`（逐件源/许可/用途·同 AUDIO-LEDGER 范式）。
- **引擎消费=转办件 P-28**（与 P-21/P-27 同线·DevLoop 自领池）：①风格门禁=世界层入城件过 1 号高清赛博像素+art-target-dusk.png 锚和谐度自检（一行结论），禁卡通/Q 版混入；②优先接线面=parallax 8 层→远景大气透视层（M1 赛博光效规格「大气透视」直接可用）、warped/cyber city→霓虹街牌与南岸街景补充（DESIGN §九「霓虹街牌 FLUX/CPH4/公司名」判据面）、tophat-robot→街道机器人 16×16 补充变体、watercraft/ships-ripple→黄浦江江面生活感（M2）、residents-crowd→M2 NPC 池/BigLife census 消费（与 P-22 同线）；③施工件走 S 库线@Biggame（BoardForge 工地语法·引用不复制）；④.icons/meta 同 P-27 律（编辑器轮生成）。
- **AA/FT 池内覆盖消费**（引用不复制）：车辆=AA-016.02、光效=AA-034、字体=FT-011/016/010——DevLoop 按 P-21/FT 库通道消费，本批不拷贝。

## §五 验证与诚实边界

- **已验 ✓**：许可=7 源页许可图标精确探测（CC0×3/OGA-BY×2/CC-BY×2·零 SA）+池内覆盖三项实测清点（AA-016.02 车辆目录/AA-034 193 PNG/FT-011 缝合像素在册）。
- **验图承诺**：视觉件入仓前全部过 `analyze_multimedia` 图像腿（内容/风格/规格目检）——与音频不同，图像腿本环境**可用**（CityWatch/多模态验图同法）。
- **存疑即标 🟡**：各包「像素密度/色板与目标图和谐度」最终裁定归 DevLoop 入城时逐件自检（本批只验内容真实性与格式完整性）。

## §六 迭代路线

- v2：施工件 S 库裁定、UI 图标定夺（M3 前夜）、居民池扩容（BigLife 万民 ID→sprite 映射策略=P-22 扩展件）。
- 滚动纪律：每个 M 里程碑前夜清点缺口→先池内后外采→许可闸→台账→P-XX 转办。

## 结论应用表

| 结论 | 落点 | 状态 |
|---|---|---|
| 六包 334 件入库+风格闸法（锚 art-target-dusk） | ①任务单 P-28（r29 parallax/ships 双闸闭·r34 skyline 接线·r44 车辆入城——余面 §九 行在册） | 接线中 |
| Kenney Watercraft 3D 模型包整包弃 | ④判负留痕（2D 铁律·ARPACKS-LEDGER 台账在案） | 已闭环 |
| 池内覆盖消费（车辆 AA-016.02/光效 AA-034/字体 FT 族·引用不复制） | ②P-21/P-28 消费链行已吸收（r44 车辆实证） | 已闭环 |


> 补表溯源：2026-09-24 r77 存量补表批（P-2026-09-24-65·正典 cph4/research-protocol.md §二）——落点按 TECH §九 在册消费实况回写；接线中项随对应任务线自领。
