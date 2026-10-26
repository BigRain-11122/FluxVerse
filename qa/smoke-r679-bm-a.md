# R2 判据帧链首跑收据（main#5 · r679 · bm-a）

> 法源=docs/qa-r2-frame-map.md（r250 预置件）§三/§四 + ..\..\docs\qa-smoke-test-charter.md
> 帧来源=**库内帧消费**（§四.2 首选径·零编辑器成本；库内 867b59e 帧集即最新态，City3D 工作树零脏）
> 计分口径=实物优先（能看/能用=2）·本件产物=三帧 qa 副本（SHA256 与库内逐个等同）+ 本收据

## ① 帧链五件套逐项判定

| # | 件 | 判定 | 实证 |
|---|---|---|---|
| 1 | L0 全景帧 | **PASS** | qa/smoke-r679-bm-a-L0.png（110787B·SHA256 同源）·地面/街区可见·非黑屏 |
| 2 | L1 街区帧 | **PASS** | qa/smoke-r679-bm-a-L1.png（215431B）·模块壳结构可辨（宅体/路带/地块台） |
| 3 | L2 街道帧 | **PASS** | qa/smoke-r679-bm-a-L2.png（220069B）·宅门朝向与地块落位可辨 |
| 4 | 30fps 浸泡 | **未跑（如实记）** | 见 ⑤·**禁宣称**·未产出 fps 数据 |
| 5 | 多模态评审 | **PASS（3/3 帧 ≥8）** | 见 ⑥ 逐帧分 |

## ② charter 7 条映射判定（照 §二 映射表执行）

| # | charter 条目 | 本件判定 | 依据 |
|---|---|---|---|
| 1 | 编辑器能打开·Scene 不报错 | **PASS（指针制）** | r2-ignite .done 回执 exit_code=0·CITY3D_R2_DONE marker·shots 5/5（a7383446 收史） |
| 2 | Game 视图地面可见（非黑屏） | **PASS** | L0 帧中心带亮度采样非纯黑·多模态「街区/地面可见」过 |
| 3 | 黄浦江（蓝色水面层） | **R2 不判·归全城重建里程碑** | L0 帧南/东侧见蓝色水面面层，但 R2 试点未建江道系统，不据此判过（诚实律：观测≠判定） |
| 4 | 白玉兰脑塔（北岸制高点） | **R2 不判·归全城重建里程碑** | R2 无该资产 |
| 5 | ≥5 居民 prefab 非全空 | **R2 不判·归居民线里程碑** | R2 试点未生成居民 |
| 6 | 昼→黄昏→夜变色 | **R2 不判·归环境档里程碑** | R2 单光照档 |
| 7 | 跑 10 分钟无 Unity 报错 | **未跑（如实记）** | 浸泡探针本轮未执行（本件范围·禁宣称） |

缓判四条=R2 模块壳试点的既定范围外（非缺陷）。charter 红灯规则：未跑项按「未完成」记，不假过、不沉默。

## ③ 三判判真时点

- 判①（City3D 新 commit≠0 since r241 基线）：**成立**·a7383446（2026-10-24 12:14:18 +0800）触及 City3D 域 7 条路径
- 判②（r2-ignite 在飞件收干）：**成立**·同提交收史 r2-ignite.{done,stdout}+shots/R2_interior_cutwall.png+PulseBeacon.mat 族；今日 `git status --porcelain -- City3D City3D-staging` 零脏
- 判③（shots 判据帧在库）：**成立**·`git ls-files City3D-staging/shots` = 14 帧 tracked，含 R2_ 七帧
- 首判真入册=**r678**（2026-10-26）；本件（r679）为判真后首跑

## ④ 指针

- 帧集正身=commit **867b59e**（2026-10-11 00:26:47·R2 modular pilot 3-iter·O-20261011-0003）
- 测量/构建正典=City3D-staging/r2-report.md（module_measure/lots=8+street=1/colliders=30/door_probe PASS clear=8.00m）
- 批跑 harness+回执=City3D-staging/r2-ignite.ps1 + r2-ignite.done（exit_code=0·wall_s=23·shots 5/5）
- 过目板=City3D-staging/shots/R2-判据帧-过目板.jpg
- 本件产物=qa/smoke-r679-bm-a-{L0,L1,L2}.png + 本收据 + qa/smoke-r679-bm-a.log

## ⑤ fps 数据（avg/min/p95）

**N/A — 浸泡未跑。** 30fps 浸泡（10min play-mode 帧间隔采样）本轮**未执行**，无 avg/min/p95 可报。
不跑的理由（如实）：本件为 10 分钟无人值守轮；浸泡探针需新建 C# Editor harness 并以 batchmode play-mode 承载 10min+重建余量，超出单轮预算且 batchmode play-mode 为本仓未实测路径。
下一轮路径（已预注册，照 §四.3）：① 首选 batchmode play-mode 首测（Unity Test Framework PlayMode 批跑同机制作可行性锚·看门狗 ≥20min·Start-Process 双 redirect 剥离句柄）；② fallback=编辑器循环渲染时代理指标，**收据必须标「代理」**；③ 再 fallback=GUI 面人工辅助，收据注明。

## ⑥ 多模态逐帧评分（判据五面：非黑屏／结构可辨／零渲染伪影／零品红 missing-shader／帧间同世界一致）

| 帧 | 得分 | 逐面 |
|---|---|---|
| L0 全景 | **9/10** | 五面全过。俯视街区结构清晰（路网/地块/中央塔/广场）；边界红虚线与网格为设计件非伪影；天空与水面分层正确 |
| L1 街区 | **8/10** | 五面全过。模块壳宅体 8 座+路带+地块台可辨；扣分=地块台外露背景色（浅蓝天），地坪连续性在低机位略失依托 |
| L2 街道 | **8/10** | 五面全过。宅门朝向/地块台/立面材质清晰可读；同上扣分=地块外无地面覆盖，近景背景色占比高 |

- **帧间同世界一致**：三帧同一天空色/同一路面材质/同一宅体材质族，判一致（PASS）。
- **范围注记（非缺陷）**：R2 试点只建 lots=8+street=1（r2-report 明载·宅基台 0.08 抬高），地块之间无全域地坪——故 L1/L2 见浅蓝天色为背景直露，属试点既定范围；全域地坪连续覆盖归全城重建里程碑面。
- **零品红**：三帧无 magenta missing-shader 面。
- **诚实边界**：本轮为库内帧消费，未复拍；帧代表 867b59e 时点状态，不代表交互窗后续改动后状态。

## 门禁与收口

- 本件不动 City3D 工程（零接触防双头·r236 定谳维持）
- Token 三问=**L1**（确定性脚本+既有多模态通道·零新 LLM 触点·零 AIGC 生成）
- scan/verify 由 FluxVerseTick 每 10 分钟照跑；板面-§九 双账门 commit 前跑 tasks-board-check.ps1