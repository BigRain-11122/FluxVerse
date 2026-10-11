# FluxVerse DevLoop Runbook（启动首读面·Executive Protocol v1.0）

> <2KB 契约=..\..\docs\executive-protocol.md §1；进度唯一权威=TECH.md §九；收尾若「下一步」有变则更新本件（静轮免改）。

## 我是谁
超体宇宙城底座 DevLoop（Biggame 承建·bm-a 无人值守轮）；主线=City3D R2 模块壳（交互窗承建·其在飞件禁碰）。

## 我现在在干什么
r289 毕：tech#2 probes 25 面健康报表交付（scan 25/25 OK+verify PASS+游标零 stale=**治理窗引证全绿基线**·docs/probes-health-report-20261011.md）+main#6 判①基线勘正（**r241=10-11 02:11 非 10-10**·867b59e=00:26 存量维持·判②③同候）。下轮候选=tech 队列 14 条（#14 fleet_tasks unknown 归因=报表伴生可领位·#2 EOL 哨兵 10-24 前复核）。

## 下一步（队列头）
1. 轮首先跑 Tools\devloop\check-fastpath.ps1：FASTPATH=队列取活（state/queue/{main,tech,explore}.md）→提案轨→一行声明；FULL-ROUND=按 mandate（Tools/devloop/iteration_prompt.txt）读序施工。r289 收尾=状态档四键全重写清屏（§九 open=时窗件族·队列归 FASTPATH 消费径·r288 ⑧ 同判）→七查静轮即 FASTPATH 队列取活。
2. 时窗件：T-FV-134 调研深扫+T-FV-141 提案 P3-003（判②滞留面候选在册）=10-18 周日演化日窗；T-FV-139 §九月度归档=10-24 首窗/11-01 月界。
3. main/tech 近件：main#6 R2 探测一行注记（r289 注记毕：判①②③假续候·**基线=10-11 02:11 勿再误取 10-10**）+P3-002 防御行检（常设·第五十二轮 PASS）/tech 队列常备 14 条（#14 unknown 归因/#2 EOL 哨兵可领·#13 vendored 哨兵=被动位）。
4. **常设收尾步（r247 起改道执法件）**：commit 前刷面=写 logs/devloop-face-content.json（六键·updated_utc/artifact_utc 留空机器盖戳）→ powershell -NoProfile -ExecutionPolicy Bypass -File Tools\devloop\write-status-face.ps1 → FACE OK 才 commit；禁手写 state/status-face.json（r246 future-ts 红根因）；**板面同步门（r272 起）**=Tools\devloop\check-runbook-sync.ps1 轮尾手跑一行判读（SYNC 才 commit·DRIFT=runbook/§九 轮号先对齐再收工）。

## 验收标准（怎么算完成）
实物优先计分（能跑能用=2／文件改动=1／纯记账=0）；门禁=产出面自带门绿（harness/exporter 五门）+动板面后 Tools\devloop\tasks-board-check.ps1 PASS 才 commit；commit=「DevLoop r<N>: …[via bm-a]」；未过门=如实记未完成；等待态=一行声明收轮。

