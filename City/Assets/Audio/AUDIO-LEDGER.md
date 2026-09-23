# Audio Ledger — City/Assets/Audio 逐件台账

> 音频资产本体唯一台账（provenance 面）：每件一行=文件/大小/源/许可/用途。研究正典与需求音景图=`docs/research/R-20260923-audio-assets.md`（引用不复制）。
> 获取批：2026-09-23（音频资产线首批·CEO 令 ~22:47「专门寻找音乐音效资产·免费商用下载+自产」）。
> 验证态：许可=源页 License(s) 字段原文逐页抓取（七源 CC0 + 一库 CC-BY 3.0）；完整性=非零字节+音频魔数全验（0 坏头）；**听感未验**（环境音频理解腿未开·待试听校准——诚实律）。

## 署名义务（引擎/发布 credits 必带）

- **sfx_scifi/ 全部 16 件**：`Sci-Fi Sound Effects Library by Little Robot Sound Factory — CC BY 3.0 — opengameart.org/content/sci-fi-sound-effects-library`
- 未来若启用 AA-038 chiptune（MiniGame Art Assets 库内）：`Music by Eric Skiff — CC BY 4.0 — ericskiff.com`
- ambience/ music/ weather/ signature/ = CC0 与自产，零署名义务。

## ambience/（城市底噪与区域氛围）

| 文件 | 大小 | 源 | 许可 | 用途 |
|---|---|---|---|---|
| busy_cyberworld.ogg | 165,118 B | OGA /content/scifi-city-ambient-loop · TinyWorlds（提交 2DPIXX） | CC0 | 全城持续底噪床（赛博城市忙碌氛围） |

## music/（日夜四档 BGM 池 · 随 clock 探针 city_day_phase 轮转）

| 文件 | 大小 | 源 | 许可 | 建议档位（待试听校准） |
|---|---|---|---|---|
| calm_synthwave_421k.mp3 | 18,976,382 B | OGA /content/calm-relax-1-synthwave-421k · cynicmusic（源名 007_Synthwave_421k.mp3） | CC0 | 晨 |
| synth_wave_0.mp3 | 7,682,216 B | OGA /content/synth-wave · Pro Sensory（源名 Synth Wave_0.mp3） | CC0 | 昼/黄昏 |
| loading_loop.wav | 2,195,123 B | OGA /content/loading-screen-loop · HaelDB（源名 TremLoadingloopl.wav） | CC0 | 循环氛围/加载面 |
| midnight_drive.ogg | 229,058 B | OGA /content/midnight-drive · congusbongus | CC0 | 夜 |
| tt_caves.ogg | 1,703,616 B | OGA /content/t-t-free-cyberpunk-pack · tricksntraps（源名 Caves.ogg） | CC0 | 赛博曲池（黄昏候选） |
| tt_currents.ogg | 15,419,836 B | OGA /content/t-t-free-cyberpunk-pack · tricksntraps（源名 Currents.ogg） | CC0 | 赛博曲池（黄昏候选） |
| tt_antimatter.ogg | 重试下载中 | 同上（源名 Anti Matter Magic.ogg·OGA 慢速 300s 超时一次·900s 重试在途） | CC0 | 赛博曲池第三轨（到货补行） |

## weather/（天气层 · weather 探针 weather_kind 驱动）

| 文件 | 大小 | 源 | 许可 | 用途 |
|---|---|---|---|---|
| rain_loop_1.ogg ~ rain_loop_4.ogg | 550,049 / 529,890 / 913,769 / 762,663 B | OGA /content/rain-loopable · Ylmir（源名 1~4.ogg） | CC0 | 雨（四强度递进·3=台风候选主力） |
| wind2.wav | 2,326,195 B | OGA /content/wind1 · Luke.RUSTLTD | CC0 | 风 |

## sfx_scifi/（Sci-Fi Sound Effects Library 精选 16 件 · **CC BY 3.0 须署名见顶部**）

| 文件 | 大小 | 用途（事件映射 R- §1.1） |
|---|---|---|
| Robot_Activated_00.mp3 | 138,716 B | 新机接入/任务认领机器人启动 |
| Robot_Talk_00.mp3 / Robot_Talk_01.mp3 | 59,722 / 54,079 B | 居民台词气泡 blip（RESIDENT_SAY） |
| WarpDrive_00.mp3 | 106,115 B | fleet 大文件互传运输光带 |
| WarpDrive_01.mp3 | 175,705 B | BigStream 发布内容信号波纹/镜头转场候选 |
| Jingle_Win_00.mp3 | 78,530 B | 构建发布/开线封顶 |
| Jingle_Achievement_00.mp3 | 113,639 B | 里程碑达成/城市节日 |
| Laser_00.mp3 / Laser_03.mp3 | 30,883 / 31,510 B | commit 信使数据 blip |
| Menu_Select_00.mp3 / Menu_Select_01.mp3 | 49,691 / 25,867 B | UI 壳科技感备选（主力=AA-030） |
| Alarm_Loop_00.mp3 / Alarm_Loop_01.mp3 | 27,748 / 38,873 B | 警报备用池（主力=signature/s0_red_alert） |
| Ambience_Space_00.mp3 | 361,906 B | 夜档氛围备用 |
| Alien_Language_00.mp3 | 74,608 B | 黑灯区数据断链质感候选 |
| SpaceShip_Engine_Small_Loop_00.mp3 | 129,312 B | 算力楼/机房底噪候选 |

## signature/（自产品牌签名面 · 合成器=Tools/audio/synth_sfx.py 可复现 · 零许可义务）

| 文件 | 大小 | 事件锚（DESIGN §七/§十四） |
|---|---|---|
| ceo_order_pulse.wav | 388,124 B | **CEO_ORDER——品牌第一音**（塔顶纯白光脉冲） |
| fluxverse_motif.wav | 564,524 B | 进化轮提案/立法脉冲；logo/开城仪式 |
| gate_pass.wav / gate_block.wav | 153,512 / 105,884 B | G1'/G2 光门放行/红脉冲拦截 |
| market_bell_open.wav / market_bell_close.wav | 441,044 / 335,204 B | MARKET_OPEN/MARKET_CLOSE 钟声 |
| citywatch_welcome.wav | 299,924 B | CityWatch 城主进城（迎宾线配套） |
| os_breath.wav | 229,364 B | OS 循环呼吸灯一拍 |
| s0_red_alert.wav | 493,960 B | S0 红线警报/台风全城灯带 |
| s1_zone_warning.wav | 287,576 B | S1 分区异常黄光 |

## 引用不复制（库内复用面·不拷贝入仓·按 AA 标签消费）

- AA-030（Kenney UI 反馈 102 件·CC0）：UI 壳点击/确认/错误族主力
- AA-031（Kenney 打击/脚步 132 件·CC0）：街道机器人脚步
- AA-032（Kenney 数字 UI 65 件·CC0）：数字 blip 备选
- AA-033（Kenney Jingles 88 件·CC0）：开线五步/解锁序列
- AA-037（Juhani 复古 512 条·CC0）：GAME 城像素调味
- AA-038（Eric Skiff chiptune 17 曲·**CC-BY 须署名**）：城市节日/GAME 城氛围候选
- 消费通道=Art Assets README §七四通道链+直用台账（MiniGame 仓正典）
