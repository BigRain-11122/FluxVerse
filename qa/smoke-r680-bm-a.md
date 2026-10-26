# R2 30fps 浸泡探针首测收据（main#5 续 · r680 · bm-a）

> 法源=docs/qa-r2-frame-map.md §三.4/§四.3（30fps 浸泡+charter⑦ 同跑双收）+ ..\..\docs\qa-smoke-test-charter.md
> 载具=R2SoakProbe（City3D/Assets/Editor/CityRebuild/R2SoakProbe.cs）+ Tools/devloop/r2-soak.ps1
> 计分口径=能跑/能用实物（2）·本件产物=一次真实 10 分钟 batchmode play-mode 浸泡的原始统计 JSON + 本收据 + log 摘录

## ① 帧链五件套逐项判定

| # | 件 | 判定 | 实证 |
|---|---|---|---|
| 1 | L0 全景帧 | **PASS** | qa/smoke-r679-bm-a-L0.png（r679 已交付） |
| 2 | L1 街区帧 | **PASS** | qa/smoke-r679-bm-a-L1.png（r679 已交付） |
| 3 | L2 街道帧 | **PASS** | qa/smoke-r679-bm-a-L2.png（r679 已交付） |
| 4 | 30fps 浸泡 | **PASS（本件）** | 10min play-mode 实测·render avg **608.5fps**·p95 dt 2.147ms·errors=0/exceptions=0（见 ⑤） |
| 5 | 多模态评审 | **PASS（3/3 ≥8）** | r679 逐帧 9/8/8 分（本件未改场景，不重复评分） |

帧链五件套=**5/5 齐**（此前 4/5，本轮补齐件 4）。

## ② charter 7 条映射判定

| # | charter 条目 | 本件判定 | 依据 |
|---|---|---|---|
| 1 | 编辑器能打开·Scene 不报错 | **PASS** | batchmode 打开 CityRebuild_R2.unity·日志零 error CS/Exception·exit_code=0 |
| 2 | Game 视图地面可见（非黑屏） | **PASS** | L0 帧（r679）+ 本件 render 段 18.2 万帧真实绘制零渲染异常 |
| 3 | 黄浦江（蓝色水面层） | **R2 不判·归全城重建里程碑** | R2 试点未建江道系统 |
| 4 | 白玉兰脑塔（北岸制高点） | **R2 不判·归全城重建里程碑** | R2 无该资产 |
| 5 | ≥5 居民 prefab 非全空 | **R2 不判·归居民线里程碑** | R2 试点未生成居民 |
| 6 | 昼→黄昏→夜变色 | **R2 不判·归环境档里程碑** | R2 单光照档 |
| 7 | 跑 10 分钟无 Unity 报错 | **PASS（本件）** | 330s logic + 300s render 连续 play-mode·errors=0·exceptions=0·first_errors=[] |

缓判四条=R2 试点既定范围外（非缺陷·照 r679 口径）。

## ③ 三判判真时点（承 r678/r679·不变）

- 判①：成立（a7383446 2026-10-24 12:14:18 触及 City3D 域）
- 判②：成立（City3D/City3D-staging 除本轮新增探针两件外零脏）
- 判③：成立（shots 14 帧 tracked，R2_ 七帧）
- 首判真=r678；帧链首跑=r679；**浸泡首测=r680（本件）**

## ④ 指针

- 原始统计=qa/smoke-r680-bm-a-soak.json（636B·SHA256 `74D243BD02BBF37F77AE2AB80B8657EFC2C5A4567B909151FB9FF50D42FB2BF8`）
- 完整编辑器日志=City3D-staging/r2-soak.log（gitignored·本件摘录见 qa/smoke-r680-bm-a.log）
- 探针=C0 见上；launcher=Tools/devloop/r2-soak.ps1（GUI 占用自检+20min 看门狗+.done fail-loud 回执）
- 场景=City3D/Assets/Scenes/CityRebuild_R2.unity·编辑器=Tuanjie 2022.3.62t15
- 运行环境：batchmode（图形设备已初始化；**不是** -nographics）·`-executeMethod R2SoakProbe.BatchEntry`

## ⑤ fps 数据（avg / min / p95）

| 段 | 时长 | 帧数 | fps_avg | dt_p50 | dt_p95 | dt_max | fps_min | 最慢 p95 折算 |
|---|---|---|---|---|---|---|---|---|
| logic（无强渲染） | 300s | 1,895,175 | **6317.248** | 0.135ms | 0.260ms | 193.651ms | 5.164 | 3849fps |
| render（每 tick Camera.Render→1280×720） | 300s | 182,561 | **608.536** | 1.573ms | 2.147ms | 190.465ms | 5.250 | 465.9fps |

- **判定口径（诚实标注）**：batchmode play-mode **不锁垂直同步、不设 targetFrameRate**，上表是**吞吐天花板**，不是显示器口径的实时 fps。charter④ 的「avg ≥30fps」在任何解释下均过门（render 段 avg 608.5）。
- **fps_min 的成因（不掩盖）**：两段各出现且仅出现一次 ~190ms 长帧（dt_max 193.7/190.5ms），与段切换/首帧建 RT 同刻；其余 18.2 万帧中 p95 仅 2.1ms。它是**一次性切换成本**，不是持续卡顿——但按实测记录，不粉饰。
- **浸泡时长**：logic 300s + render 300s = 600s（10 分钟）+ 启动 18s，wall_s=618。
- **零错误**：errors=0，exceptions=0，first_errors=[]。

## ⑥ 多模态逐帧评分（承 r679·本轮未复拍）

| 帧 | 得分 | 说明 |
|---|---|---|
| L0 全景 | 9/10 | r679 已判 |
| L1 街区 | 8/10 | r679 已判 |
| L2 街道 | 8/10 | r679 已判 |

本件不改场景、不产新帧，评分不重复执行（禁刷分）。scene 与 r679 消费帧同源（867b59e 帧集），本轮仅新增运行期证据。

## 机制发现（本轮根因与修法）

- **病面**：18:05 的首跑在进入 play mode 后永久挂死（日志停在 `Loading mode Default`，无 PHASE 日志）。
- **根因**：工程 `m_EnterPlayModeOptionsEnabled: 0`（域重载启用）。`EditorApplication.EnterPlaymode()` 触发**域重载**，探针的静态状态与 `EditorApplication.update` 订阅全部被清空 → 之后再无 tick，连「进入 play mode 超时」分支都不会执行。
- **修法**：`BatchEntry` 内临时置 `EditorSettings.enterPlayModeOptionsEnabled=true` + `enterPlayModeOptions=DisableDomainReload`，收尾 `RestorePlayModeOptions()` 还原；另加首 tick/进入 play 两条日志（`CITY3D_SOAK_TICK first` / `CITY3D_SOAK_PLAY entered`）便于机检。修后冒烟 15s+15s 通过，正测 10min 通过。
- **残留债**：若进程被强杀而非走 Finish/Fail，`EditorSettings` 的临时值会留在工程里（本轮实测已还原为 0/3；launcher 的 watchdog 走 Kill 属强杀面）。已在 TECH §九记债：launcher 超时分支应在 Kill 后复核并回写设置。

## 门禁与收口

- GUI 占用自检：运行前 `GUI_ALREADY_CLOSED`（无交互窗编辑器占用，未杀任何 GUI 进程）
- 脱离 CLI 进程树：WMI `Win32_Process.Create` 启动 launcher（会话/工具链重启不连坐），看门狗 20min 全程存活
- Token 三问=**L1**（纯确定性 C# 采样 + PS 壳·零 LLM/AIGC 触点）
- scan/verify 由 FluxVerseTick 每 10 分钟照跑；板面-§九 双账门 commit 前跑 tasks-board-check.ps1