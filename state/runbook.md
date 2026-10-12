# FluxVerse DevLoop Runbook（启动首读面·Executive Protocol v1.0）

> <2KB 契约=..\..\docs\executive-protocol.md §1；进度唯一权威=TECH.md §九；收尾若「下一步」有变则更新本件（静轮免改）。

## 我是谁
超体宇宙城底座 DevLoop（Biggame 承建·bm-a 无人值守轮）；主线=City3D R2 模块壳（交互窗承建·其在飞件禁碰）。

## 我现在在干什么
r411 毕（本窗补完上轮中断收口）：explore#104 K 线巨屏四态评审拼板成件入库（docs/design/m2-kline-giant-screen-sample-states.png+Tools/city/bake-kline-sample-states.ps1+TECH 行——四态=收盘后/盘中/休市/维护·25 门全绿+多模态终评 9.5/10·与 r410 样张成双件套=QUANT 城巨屏 M2 过目套件齐）；附销账 ledger 转办件 LOGS_OLD（logs>14d 递归轮转 1666→0·对账精确）；main#8 触发器判假续候（死线 10-13）。

## 下一步（队列头）
1. 轮首跑 Tools\devloop\check-fastpath.ps1：判读一律依 stdout `VERDICT:` 行字节（禁读 Exit Code 显示面·r293 假显判例）；FASTPATH=队列取活（state/queue/{main,tech,explore}.md）→提案轨→一行声明；FULL-ROUND=按 mandate（Tools/devloop/iteration_prompt.txt）读序施工。r411 收尾=tech_sha12 传棒 KEEP（§九 open 面=r410 同面：main#8 触发器行〔死线 10-13〕+main#9 提案证据包〔10-18〕+explore 被动跟踪族 #103/#101/#99/#98/#97/#90/#61/65/66/67/68+main#1 归档时窗 10-24+main#2/#3 深扫提案窗 10-18→下轮④查 mismatch=全轮续领·r95 律）。
2. main#8 腿②触发器每轮检：main#6 判②收干+GPU 空窗双现即领（配方五步·判据三条·死线 10-13·窗不至=判负留痕收口）；explore#12 P3 48h 死线=**10-16 15:1x 前出下一笔**（r411 已交卷〔explore#104 四态拼板〕·下笔候选=explore 表被动跟踪族任一轻量成件或新扫描条）；T-FV-134/141=10-18 周日演化日窗（**活动承接三句式提案待交·证据底座=r379~r411 件全链+main#9 证据包整理位**）。
3. main#5/#7 判③门槛未达（shots 判据帧未入库·交互窗在飞期禁动 City3D）；tech 队列常备=观察位族——**真无活时一行声明合法（禁造活凑数）**。
4. **常设收尾步**：commit 前写 logs/devloop-face-content.json（六键·updated_utc/artifact_utc 留空机器盖戳）→ powershell -NoProfile -ExecutionPolicy Bypass -File Tools\devloop\write-status-face.ps1 → FACE OK 才 commit（禁手写 state/status-face.json·r246）；**板面同步门**=Tools\devloop\check-runbook-sync.ps1 一行判读（SYNC 才 commit）；**板面-§九 双账门**=Tools\devloop\tasks-board-check.ps1（动板面必过）；**commit pathspec 限定律**=c2 触发轮 commit 一律 -m 后 -- <本轮路径清单>（防吞交互窗 staged 面）。

## 验收标准（怎么算完成）
实物优先计分（能跑能用=2／文件改动=1／纯记账=0）；动板面后 Tools\devloop\tasks-board-check.ps1 PASS 才 commit；commit=「DevLoop r<N>: …[via bm-a]」；未过门=如实记未完成；等待态=一行声明收轮。
