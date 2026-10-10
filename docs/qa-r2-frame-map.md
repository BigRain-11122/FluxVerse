# R2 判据帧链映射草稿（main#5 预置件）

> 领走=main 队列#7（r250·r249 补位件）·法源=..\..\docs\qa-smoke-test-charter.md（集团 v1.0·FluxVerse 7 条清单+截图要求）→ r235 定谳「7 条清单+截图面归 R2 主线判据帧链〔L0/L1/L2+30fps+多模态〕·charter 本体在册不动」。
> 消费时机=main#6 三判判真（①City3D 新 commit≠0 since r241 基线 02:11 + ②r2-ignite 在飞件收干〔untracked 归零/入库〕 + ③shots 判据帧在库）→ main#5 首跑照本件执行；判真前=零 City3D 接触（r236 防双头定谳）。
> **判③已于 867b59e（2026-10-11 00:26:47）成立**（6 帧+过目板入库·git ls-files 实证——r249 行误记「未入库」·r250 §九 行回正）；现行合取实操阻塞位=①②。

## 一、现状实锚（867b59e·R2 3-iter·O-20261011-0003 交互窗）

- 库内判据帧集（City3D-staging/shots/·main#5 消费正身）：R2_L0_overview.png / R2_L1_gamedistrict.png / R2_L2_street.png / R2_house_front.png / R2_interior_cutaway.png / R2_showcase_front.png + R2-判据帧-过目板.jpg
- 配套正典：r2-report.md（模块测量 straight 2.50x0.20xH3.94/door/corner/floor+门洞机检 clear=8.00m+mat_bridge converted=56+lots=8/street=1+colliders 30）·r2-ignite.ps1（批跑 harness：GUI 先关→batchmode BatchEntry→DONE marker+5 帧断言·15min 看门狗）·CityRebuild_R2.unity+CityRebuildR2.cs（v2 幂等重建）
- .done 回执（2026-10-11T00:21:35+08:00）：exit_code=0·wall_s=23·log_done_marker=true·shots 5/5
- 在飞未收干 8 件（判②面·交互窗域禁碰）：r2-ignite.{done,stdout.txt}+shots/R2_interior_cutwall.png+PulseBeacon.mat M+Window_Glass_Opaque_URP.mat+meta+CityRebuild.meta+ithappy.meta
- r2-ignite.log=gitignored 面不在库——收据引用 log 时以盘上件指针+关键行摘录为证

## 二、charter 7 条 → R2 证据映射表

| # | charter 条目 | R2 判定 | 证据件（main#5 产出） | 机械判据 |
|---|---|---|---|---|
| 1 | 编辑器能打开，Scene 不报错 | **判** | r2-ignite 复跑 log+新 .done 回执 | log 含 CITY3D_R2_DONE·零 error CS/Exception 行·exit_code=0 |
| 2 | Game 视图地面可见（非黑屏） | **判** | qa/smoke-rNNN-bm-a-L0.png（L0 帧消费/复拍） | 帧中心带亮度采样非纯黑+多模态「地面/街区可见」过 |
| 3 | 黄浦江（蓝色水面层） | **缓判**（R2 模块壳试点无江面=全城重建里程碑面） | —（收据如实记） | 后续里程碑 commit 触发开判 |
| 4 | 白玉兰脑塔（北岸制高点） | **缓判**（同上） | — | 同上 |
| 5 | ≥5 居民 prefab 非全空 | **缓判**（居民线后续里程碑） | — | 同上 |
| 6 | 昼→黄昏→夜变色 | **缓判**（环境档后续里程碑） | — | 同上 |
| 7 | 跑 10 分钟无 Unity 报错 | **判**（浸泡探针） | qa/smoke-rNNN-bm-a.log | 10min 浸泡尾扫描零 Exception/零 error CS |

- 截图要求映射：俯视全景→L0 帧（判）；黄昏→缓判（环境档面）；居民走动→缓判（居民线面）。
- 诚实律：缓判≠跳过——qa 收据逐条记「R2 不判·归 <里程碑名>」；禁假过禁缺项沉默（charter 红灯规则）。

## 三、R2 帧链五件套（main#5 判定面·预注册「L0/L1/L2+30fps+多模态」）

1. **L0 全景帧**：城市总览（街区+路面 R2_Pavement+8 宅基）——判 charter②+「模块壳街区在画面」
2. **L1 街区帧**：game district 段——判「模块壳结构可辨（直段/门段/角段/地板）」
3. **L2 街道帧**：街带+宅门朝向——判「lots/street 落位+门朝城心」
4. **30fps 浸泡**：10min play-mode 帧间隔采样（与 charter⑦ 同跑双收）——avg ≥30fps·avg/min/p95 入回执；**首跑验证面**=batchmode play-mode 路径（Unity Test Framework PlayMode 批跑同机制=可行性锚·本仓未实测）→fallback=编辑器循环渲染时代理指标（收据如实标注「代理」）→再 fallback=GUI 面人工辅助（收据注明）
5. **多模态评审**：三帧逐帧锐评（非黑屏/结构可辨/零渲染伪影/零品红 missing-shader/帧间同世界一致）≥8/10 过门

## 四、main#5 首跑配方（判真后照跑）

1. 三判复跑（main#6 机械式）确认判真。
2. 帧来源二选一：**优先消费库内帧**（判真=树静·867b59e 帧集即最新态·零编辑器成本）；交互窗新 commit（判①路径）→ 复跑 `powershell -NoProfile -ExecutionPolicy Bypass -File City3D-staging/r2-ignite.ps1`（幂等重建·23s 实测）复拍。
3. 浸泡探针=独立 harness（r2-ignite 同式：GUI 先关+batchmode+DONE marker+**看门狗 ≥20min**〔浸泡 10min+重建余量〕+.done 回执 fail-loud）——C# 侧 EditorApplication.EnterPlaymode+update 帧间隔采样+ExitPlaymode+Exit(0)；**长任务纪律=Start-Process 双 redirect 剥离句柄**（29 号律·`*>` 禁面）——交互窗域外自建于 City3D/Assets/Editor（判真后解禁）。
4. 装配 qa/（机后缀命名律=D-20261008-06）：qa/smoke-rNNN-bm-a-{L0,L1,L2}.png + qa/smoke-rNNN-bm-a.log（浸泡 log 摘录/指针）+ qa/smoke-rNNN-bm-a.md（收据）。
5. 收据六段式：①帧链五件套逐项判定 ②charter 7 条映射判定（判/缓判+缓判归面）③三判判真时点 ④指针（867b59e/r2-report/.done）⑤fps avg/min/p95 ⑥多模态逐帧分。
6. 门禁：tasks-board-check PASS+scan/verify 双绿（tick 自跑面）→ pathspec commit（qa/ 新件+TECH §九 行）。

## 五、已知坑与注记

- **帧集双名注记**：库内含 R2_interior_cutaway.png；harness 断言表期望 R2_interior_cutwall.png（在飞未入库·.done shots 5/5 依赖它在场）——main#5 消费库内 6 帧集为正身；cutwall 收干与否归判②与交互窗自决。
- **判①基线勘正**：867b59e（00:26:47）前于 r241 基线（02:11）=存量非新件（r244 勘正口径）——三判实操阻塞位=判②；若交互窗长静不收干→判②滞留面候选=P3-003 提案面（10-18 演化日窗·判据先立 ≤3 问）。
- Token 三问=L1（main#5 全链确定性脚本+既有多模态通道零新 LLM 触点）。
