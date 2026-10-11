# FluxVerse DevLoop Runbook（启动首读面·Executive Protocol v1.0）

> <2KB 契约=..\..\docs\executive-protocol.md §1；进度唯一权威=TECH.md §九；收尾若「下一步」有变则更新本件（静轮免改）。

## 我是谁
超体宇宙城底座 DevLoop（Biggame 承建·bm-a 无人值守轮）；主线=City3D R2 模块壳（交互窗承建·其在飞件禁碰）。

## 我现在在干什么
r291 毕：tech#2 EOL 检出态哨兵复核半收口（autocrlf=true+TECH.md i/lf w/crlf 基线态恒定·全库索引面恒 i/lf=态翻转零触发·新观察面=City3D-staging/{official-baseline.md,r0diagd-run.ps1} w/mixed 2 件留档）；余半=10-24/11-01 归档实跑后回填（tech 队列#14）。main#6 判①②双假续候一行注记（8 件未收干恒定）。

## 下一步（队列头）
1. 轮首先跑 Tools\devloop\check-fastpath.ps1：FASTPATH=队列取活（state/queue/{main,tech,explore}.md）→提案轨→一行声明；FULL-ROUND=按 mandate（Tools/devloop/iteration_prompt.txt）读序施工。r291 收尾=状态档四键全重写清屏（§九 open=时窗件族·队列归 FASTPATH 消费径·r288⑧/r289⑨/r290⑧ 同判）→七查静轮即 FASTPATH 队列取活。
2. 时窗件：T-FV-134 调研深扫+T-FV-141 提案 P3-003（判②滞留面候选在册）=10-18 周日演化日窗；T-FV-139 §九月度归档=10-24 首窗/11-01 月界（EOL 哨兵余半随窗回填=tech#14）。
3. main/tech 近件：main#6 R2 探测一行注记（基线=10-11 02:11 勿再误取 10-10）+P3-002 防御行检（常设·第五十四轮 PASS）/tech 队列常备 14 条（#1 R2 里程碑后领·#14 EOL 余半=归档窗后回填·余=被动观察位）——**可领面近零=真无活时一行声明合法（禁造活凑数）**。
4. **常设收尾步（r247 起改道执法件）**：commit 前刷面=写 logs/devloop-face-content.json（六键·updated_utc/artifact_utc 留空机器盖戳）→ powershell -NoProfile -ExecutionPolicy Bypass -File Tools\devloop\write-status-face.ps1 → FACE OK 才 commit；禁手写 state/status-face.json（r246 future-ts 红根因）；**板面同步门（r272 起）**=Tools\devloop\check-runbook-sync.ps1 轮尾手跑一行判读（SYNC 才 commit·DRIFT=runbook/§九 轮号先对齐再收工）。

## 验收标准（怎么算完成）
实物优先计分（能跑能用=2／文件改动=1／纯记账=0）；门禁=产出面自带门绿（harness/exporter 五门）+动板面后 Tools\devloop\tasks-board-check.ps1 PASS 才 commit；commit=「DevLoop r<N>: …[via bm-a]」；未过门=如实记未完成；等待态=一行声明收轮。
