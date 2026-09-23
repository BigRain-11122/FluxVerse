# R-20260923-audio-assets — FluxVerse 音频资产线 v1.0

> 溯源：CEO 令 2026-09-23 ~22:47「你这个对话专门寻找超体宇宙城市需要的音乐音效等资产，可以下载免费商用的，也可以去自己生产。」
> 定位：FluxVerse **音频层第一正典**——需求音景图 / 来源与许可台账 / 自产签名轨道 / 消费接线 / 迭代路线。资产本体逐件台账=`City/Assets/Audio/AUDIO-LEDGER.md`（引用不复制）。
> 乘势：同窗 CEO 资源倾斜令 ~23:02「所有资源倾斜超体宇宙城市的搭建」——本线即城建系列音面部。

---

## §一 需求面（音景地图）

### 1.1 事件 SFX——与 DESIGN §七 映射表 1:1（声音=动画的耳朵版，同受「禁装饰」律：每个声音必须锚定真实事件源）

| 真实行为（§七 事件源） | 城市表现 | 声音 | 来源 |
|---|---|---|---|
| git commit | 信使过江入脑塔 | 数据 blip 短促 | AA-032（laser/数字族）或 `sfx_scifi/Laser_00` |
| 任务认领 | 机器人驶向城区 | 机器人启动+移动 | `sfx_scifi/Robot_Activated_00` + AA-031 脚步族 |
| OS 循环起止 | 城区呼吸灯一拍 | 低频软脉冲 | `signature/os_breath` |
| 写代码 | 光砖堆叠生长 | 轻点击/砖落 | AA-030 click 族 |
| 回测 / 门禁 G1'/G2 | 光门放行 / 红脉冲拦截 | 上行五度 / 低双脉冲拦截 | `signature/gate_pass` / `signature/gate_block` |
| 进化轮提案/立法 | 脑塔脉冲+晶片裁决 | 主题动机短句 | `signature/fluxverse_motif` |
| **CEO 令** | 塔顶光脉冲 | **品牌第一音=纯白光脉冲** | `signature/ceo_order_pulse` |
| 构建发布 | 游戏楼窗灯全亮 | 上扬 jingle | `sfx_scifi/Jingle_Win_00` + AA-033 池 |
| BigStream 发布内容 | 信号塔波纹广播 | 扫频传播音 | `sfx_scifi/WarpDrive_01` |
| 新机接入 / 退役 | 机器人空降 / 熄灯 | 启动音 / 静默 | `sfx_scifi/Robot_Activated_00` / 无（熄灯无声=克制） |
| 开线五步 | 脚手架逐层点亮 | jingle 序列 | AA-033（胜利/解锁族） |
| fleet 大文件互传 | 运输光带穿城 | 引擎过境 | `sfx_scifi/WarpDrive_00` |
| 开市 / 收盘 | 钟声+全城亮灯 | 双击钟 / 单击落钟 | `signature/market_bell_open` / `market_bell_close` |
| 台风/极端天气 | 全城警报灯带 | 警报汽笛 | `signature/s0_red_alert`（雨雪层增强由 weather 面叠加） |
| S0 红线警报 | 全城红灯带 | 同警报（最高优先） | `signature/s0_red_alert`；备用池 `sfx_scifi/Alarm_Loop_00/01` |
| S1 分区异常 | 黄光呼吸 | 双音软警示 | `signature/s1_zone_warning` |
| 黑灯区（数据断 30min） | 城区自暗 | 信号异质感 | `sfx_scifi/Alien_Language_00`（断链候选） |
| 居民台词 RESIDENT_SAY | 头顶气泡 | 机器人话音 blip | `sfx_scifi/Robot_Talk_00/01` |
| CityWatch 城主进城 | 轮值居民欢迎线 | 迎宾上行琶音 | `signature/citywatch_welcome` |
| 城市节日（月度节点） | 节日仪式 | 芯片乐 | AA-038（CC-BY 须署名 Eric Skiff·ericskiff.com）|

### 1.2 环境层（日夜四档 BGM + 城市底噪 + 天气）

- **底噪（持续床）**：`busy_cyberworld.ogg`——赛博城市忙碌氛围（OGA「Scifi City - Ambient Loop」·CC0）；备用=`SpaceShip_Engine_Small_Loop_00`（算力楼机房感）+ `Ambience_Space_00`（夜空氛围）。
- **四档 BGM（随 clock 探针 city_day_phase 轮转·DESIGN §九）**：晨=`calm_synthwave_421k.mp3`（Calm Relax 1·CC0）；昼=`synth_wave_0.mp3` 或 `loading_loop.wav`；黄昏=tt 赛博曲池（Caves/Currents/Anti Matter Magic 三选一）；夜=`midnight_drive.ogg`（Midnight Drive·CC0）。**分配为语义推断，待试听校准（§五）**。
- **天气层**：雨=`rain_loop_1~4.ogg` 四强度（OGA Rain pack·CC0）；风=`wind2.wav`；台风=雨层增强+s0 警报（同 §1.1）。

### 1.3 UI 壳层（GUIAgent 水晶风·P-18）

- 主力=**AA-030**（Kenney UI 反馈族 102 件·CC0·L2 直用通道已开）——click/select/confirm/error/switch 全覆盖；科技感备选=`sfx_scifi/Menu_Select_00/01`。

### 1.4 GAME 城像素调味（可选）

- AA-037 复古 512 条（CC0·Juhani）+ AA-038 chiptune 17 曲（CC-BY·署名义务）——GAME 城方塔群入城仪式/像素街区氛围候选。

## §二 来源与许可台账（诚实律：逐源证据）

### 2.1 已采纳·OGA CC0（许可证据=源页 `License(s): CC0` 字段原文，2026-09-23 逐页抓取）

| 资产 | 作者（源页 Author 字段） | OGA 页 | 落位 |
|---|---|---|---|
| busy_cyberworld.ogg | TinyWorlds（提交人 2DPIXX） | /content/scifi-city-ambient-loop | ambience/ |
| midnight_drive.ogg | congusbongus | /content/midnight-drive | music/（夜档） |
| loading_loop.wav（源名 TremLoadingloopl.wav） | HaelDB | /content/loading-screen-loop | music/（循环） |
| calm_synthwave_421k.mp3（源名 007_Synthwave_421k.mp3） | cynicmusic | /content/calm-relax-1-synthwave-421k | music/（晨档） |
| synth_wave_0.mp3（源名 Synth Wave_0.mp3） | Pro Sensory | /content/synth-wave | music/（昼/黄昏候选） |
| tt_caves.ogg / tt_currents.ogg（源名 Currents.ogg）/ tt_antimatter.ogg（源名 Anti Matter Magic.ogg） | tricksntraps | /content/t-t-free-cyberpunk-pack | music/（赛博曲池） |
| wind2.wav | Luke.RUSTLTD | /content/wind1 | weather/ |
| rain_loop_1~4.ogg（源名 1~4.ogg） | Ylmir | /content/rain-loopable | weather/ |

### 2.2 已采纳·CC-BY 3.0（**署名义务**）

| 资产 | 作者 | 义务写法（游戏 credits 必带） |
|---|---|---|
| Sci-Fi Sound Effects Library 精选 16 件（Alarm/Ambience/Jingle/Laser/Menu/Robot/Engine/Warp 族） | Little Robot Sound Factory | `Sci-Fi Sound Effects Library by Little Robot Sound Factory, CC BY 3.0 (opengameart.org/content/sci-fi-sound-effects-library)` |

- 全库 42MB 仅入仓精选 16 件（防仓膨胀·全库可按源 URL 再拉=R3 可再生）；源= /content/sci-fi-sound-effects-library。

### 2.3 自产（品牌签名面·零许可义务）

- 10 件 signature/*（§三）——工具 `Tools/audio/synth_sfx.py` 随仓可复现（确定性合成）。

### 2.4 已否决/搁置源（诚实律留痕）

| 源 | 判定 | 证据 |
|---|---|---|
| Pixabay（音乐+音效） | **暂不用**——反爬 403，许可条款无法验证 | 两条搜索路径 HTTP 403 实测 |
| FreePD | **已死源**——2025 年永久关站 | 站方关闭公告原文 |
| Mixkit | **搁置**——许可正文 JS 模态抓取不到，未验毕不用 | /license/ 页仅按钮标记无正文 |
| Kenney sci-fi-sounds/interface | 不绕下载流（JS 门控无直链）；UI/数字/jingle 已有 AA-030/032/033 同厂池 | 页面无 zip href 实测 |
| Lines of Code（Trevor Lentz） | 暂不启用——CC-BY-SA 3.0 传染面复杂（GAME 城候选） | 源页 License(s) 字段 |
| 本环境音频理解腿 | **不可用**——两路验证均失败，与 AA 库 README「层3 待环境启用」记录一致 | ceo_order_pulse/busy_cyberworld 双试失败 |

## §三 自产轨道（签名面铁律：授权池禁当签名面→城市签名音全自产）

- **工具**：`Tools/audio/synth_sfx.py`（Python 3.14+numpy 实测·确定性·L1 零 token·ASCII 体）
- **设计律**：超体蓝白意象——CEO 纯白=干净正弦（无锯齿毛刺）；超体蓝=柔光高音泛音；克制极简（短时长/低响度/无轰头）

| 件 | 意象 | 合成规格 | 时长 |
|---|---|---|---|
| ceo_order_pulse | **品牌第一音**：塔顶纯白光脉冲 | 大三和弦正弦簇+sub 低频体+高光泛音衰减 | 2.2s |
| fluxverse_motif | 城市主题动机（logo/开城） | 四音上行琶音（E5→A5→C#6→E6）+开放五度 pad | 3.2s |
| gate_pass / gate_block | G1'/G2 光门放行/拦截 | 上行五度扫频+闪音 / 低频双脉冲 | 0.9s / 0.6s |
| citywatch_welcome | 城主进塔（CityWatch 迎宾配套） | C 大调上行琶音+暖 pad | 1.7s |
| market_bell_open / close | 开市/收盘钟（§七 钟声正典） | 加法合成不谐和钟（双击 A5 / 单击 E5） | 2.5s / 1.9s |
| s0_red_alert | S0 红线警报/台风全城灯带 | 双周期正弦汽笛扫频（660↔990Hz） | 2.8s |
| s1_zone_warning | S1 分区异常黄光 | 双音软警示 ×2 | 1.6s |
| os_breath | OS 循环呼吸灯一拍 | 正弦包络低频脉冲（220+110Hz） | 1.3s |

## §四 落位与消费接线

- **落位**：`City/Assets/Audio/{ambience,music,weather,sfx_scifi,signature}/` + `AUDIO-LEDGER.md`（逐件本体台账：文件/大小/源/许可/用途）。
- **引擎消费=转办件 P-27**（进化台账·DevLoop 自领池，P2）：①事件路由器按 §1.1 表挂音（事件类型零新增=纯呈现层）；②BGM 四档接 `state.reality.city_day_phase`（clock 探针·M1 已有）；③天气层接 `weather_kind`；④建议混音分层=环境 0.5 / 事件 SFX 0.8 / 签名音 1.0 / BGM 0.35（禁盖过城市信息）；⑤首件判据=CEO_ORDER 事件触发 ceo_order_pulse 引擎实证（与 P-15 光脉冲同事件双呈现）；⑥音频 .meta 由 DevLoop 编辑器轮首导入时生成并随手定向提交（本批提交无 .meta=引擎未跑新目录属正常态）。
- **AA 库消费**（引用不复制·P-21 四通道链）：AA-030/031/032/033/037/038 按 §1.1/1.4 消费；AA-038 启用时 credits 署名义务同 2.2 格式。
- **跨司边界**：居民语音 TTS=BigLife 台词/聚光灯已产文本层（P-23 消费接线），语音合成面=跨司 v3 提案制（§六）。

## §五 验证与诚实边界（存疑即标）

- **已验 ✓**：①许可=7 源页 `License(s): CC0` 字段原文逐页抓取+CC-BY 3.0 库页；②文件完整性=非零字节+音频头+大小清单（AUDIO-LEDGER.md）；③rain 包 4 loop 解包清点；④自产 10 件合成输出实测（时长/字节数打印）。
- **未验 🟡（待试听）**：听感/循环接缝/BGM 四档分配——本环境音频理解腿不可用（§2.4），分配按来源语义命名推断；**校准面**=CEO 或后续轮试听，或 CityWatch 增音频试听页（v2）；合成件按包络设计保证无爆音（attack/release/fade 构造性保证）但未经人工听验。
- 诚实边界：本批不宣称「音景已调优」——只宣称「资产已就位+许可已验毕+接线规格已定」。

## §六 迭代路线

- **v1（本批）**：需求音景图+许可台账+39 件入仓（13 CC0 环境乐/4 雨/1 风+16 CC-BY 科幻精选+10 自产签名）+P-27 转办。
- **v2**：试听校准（四档定稿+循环接缝修剪+响度统一）+CityWatch 音频试听面+参观端（M4）音频规范（脱敏同律）。
- **v3+**：居民语音 TTS（BigLife 台词层→本地 TTS·跨司提案制）；城市节日曲启用 AA-038；Sonniss GDC 大包挖掘（30GB+·P2 批·免费商用已证）；Incompetech(CC-BY 4.0)/freesound CC0/OGA 深挖扩池。
- **新源纪律**：任何新源先过 §2.4 式「许可证据→否决留痕」闸，未验毕不入仓。
