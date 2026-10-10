# FluxVerse DevLoop Runbook（启动首读面·Executive Protocol v1.0）

> <2KB 契约=..\..\docs\executive-protocol.md §1；进度唯一权威=TECH.md §九；收尾若「下一步」有变则更新本件（静轮免改）。

## 我是谁
超体宇宙城底座 DevLoop（Biggame 承建·bm-a 无人值守轮）；主线=City3D R2 模块壳（交互窗承建·其在飞件禁碰）。

## 我现在在干什么
r254 毕：tech#11 export 五门负控沙盒 65 断言全绿（七毒注入全拦截+last-good 字节保全+S1 fail-soft）+**首跑即逮 exporter 空段 G2 假报潜伏缺陷当轮根治**（Get-Val return 管线 unwrap 空数组→Assert-List 假报 null element→安静日空事件尾必永阻 export；根治=三列表段直读）+四 harness 回归 130 断言全绿（r69 三断言重定基）。现无在飞件，下轮 FASTPATH=队列取活（c2 树脏在=FULL-ROUND 照常）。

## 下一步（队列头）
1. 轮首先跑 Tools\devloop\check-fastpath.ps1：FASTPATH=队列取活（state/queue/{main,tech,explore}.md）→提案轨→一行声明；FULL-ROUND=按 mandate（Tools/devloop/iteration_prompt.txt）读序施工。
2. 时窗件：T-FV-134 调研深扫+T-FV-141 提案 P3-003（判②滞留面候选在册）=10-18 周日演化日窗；T-FV-139 §九月度归档=10-24 首窗/11-01 月界。
3. main/tech 近件：main#6 R2 探测一行注记（判③已成立·实操阻塞位=①②·判真即领 main#5 首跑照 docs/qa-r2-frame-map.md 执行）/tech 队列常备可领（#1 反向引用演练/#2 烘焙幂等抽检/#3 retention 盘点/#4 registry 对账/#11 harness 收编对齐 r80/r239 入库 等）/P3-002 防御行检（常设）。
4. **常设收尾步（r247 起改道执法件）**：commit 前刷面=写 logs/devloop-face-content.json（六键·updated_utc/artifact_utc 留空机器盖戳）→ powershell -NoProfile -ExecutionPolicy Bypass -File Tools\devloop\write-status-face.ps1 → FACE OK 才 commit；禁手写 state/status-face.json（r246 future-ts 红根因）。

## 验收标准（怎么算完成）
实物优先计分（能跑能用=2／文件改动=1／纯记账=0）；门禁=产出面自带门绿（harness/exporter 五门）+动板面后 Tools\devloop\tasks-board-check.ps1 PASS 才 commit；commit=「DevLoop r<N>: …[via bm-a]」；未过门=如实记未完成；等待态=一行声明收轮。
