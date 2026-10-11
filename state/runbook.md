# FluxVerse DevLoop Runbook（启动首读面·Executive Protocol v1.0）

> <2KB 契约=..\..\docs\executive-protocol.md §1；进度唯一权威=TECH.md §九；收尾若「下一步」有变则更新本件（静轮免改）。

## 我是谁
超体宇宙城底座 DevLoop（Biggame 承建·bm-a 无人值守轮）；主线=City3D R2 模块壳（交互窗承建·其在飞件禁碰）。

## 我现在在干什么
r275 毕：tech#10 wrapper repo 自定位公共件落地（Tools/devloop/resolve-repo.ps1=.git 锚定上溯替代层级手算·direct/dot-source 双契约·沙盒 25/25 全绿·第四案沙盒锚点当轮自中自修=$PSCommandPath 文件路径欠跳→FATAL 响亮死零散件·现役 wrapper 顺扫 22 处现值全对零迁移）；main#6 注记=判① City3D 今晨 1 新 commit 首破 0·判② r2-ignite 在飞未收干（main#5 续候）。下轮候选=tech#10 watchdog 观察位〔读回执 jsonl〕/tech#1 反向引用演练/tech#2 烘焙幂等抽检/tech#3 registry 对账。

## 下一步（队列头）
1. 轮首先跑 Tools\devloop\check-fastpath.ps1：FASTPATH=队列取活（state/queue/{main,tech,explore}.md）→提案轨→一行声明；FULL-ROUND=按 mandate（Tools/devloop/iteration_prompt.txt）读序施工。
2. 时窗件：T-FV-134 调研深扫+T-FV-141 提案 P3-003（判②滞留面候选在册）=10-18 周日演化日窗；T-FV-139 §九月度归档=10-24 首窗/11-01 月界。
3. main/tech 近件：main#6 R2 探测一行注记（判② 阻塞维持·判① 已首破 0·判真即领 main#5 首跑照 docs/qa-r2-frame-map.md 执行）/tech 队列常备可领（#10 watchdog 观察位/#1 反向引用演练/#2 烘焙幂等抽检/#3 registry 对账/#11 resolve-repo 采用面巡逻 等）/P3-002 防御行检（常设）。
4. **常设收尾步（r247 起改道执法件）**：commit 前刷面=写 logs/devloop-face-content.json（六键·updated_utc/artifact_utc 留空机器盖戳）→ powershell -NoProfile -ExecutionPolicy Bypass -File Tools\devloop\write-status-face.ps1 → FACE OK 才 commit；禁手写 state/status-face.json（r246 future-ts 红根因）；**板面同步门（r272 起）**=Tools\devloop\check-runbook-sync.ps1 轮尾手跑一行判读（SYNC 才 commit·DRIFT=runbook/§九 轮号先对齐再收工）。

## 验收标准（怎么算完成）
实物优先计分（能跑能用=2／文件改动=1／纯记账=0）；门禁=产出面自带门绿（harness/exporter 五门）+动板面后 Tools\devloop\tasks-board-check.ps1 PASS 才 commit；commit=「DevLoop r<N>: …[via bm-a]」；未过门=如实记未完成；等待态=一行声明收轮。
