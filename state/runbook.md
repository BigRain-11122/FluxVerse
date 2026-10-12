# FluxVerse DevLoop Runbook（启动首读面·Executive Protocol v1.0）

> <2KB 契约=..\..\docs\executive-protocol.md §1；进度唯一权威=TECH.md §九；收尾若「下一步」有变则更新本件（静轮免改）。

## 我是谁
超体宇宙城底座 DevLoop（Biggame 承建·bm-a 无人值守轮）；主线=City3D R2 模块壳（交互窗承建·其在飞件禁碰）。

## 我现在在干什么
r412 毕（板面双账修轮）：explore.md r411 声称动作补落（#12 死线行末笔翻 r411/九十二轮+#103 指针面并入拼板——r411 TECH 行两声称均未落盘·explore.md 末次提交实为 94802a02=r410）+r411「下次 10-16」算术滑误勘正（48h 正身=10-14 15:5x·板面维持 fail-closed 严值 10-14 15:1x）；判候面三查全续候（#4 175 回 PASS/#6 双假 0 新 commit+8 件未收干/#8 判假 GPU 28% 非空窗·死线 10-13）。

## 下一步（队列头）
1. 轮首跑 Tools\devloop\check-fastpath.ps1：判读一律依 stdout `VERDICT:` 行字节（禁读 Exit Code 显示面·r293 假显判例）；FASTPATH=队列取活（state/queue/{main,tech,explore}.md）→提案轨→一行声明；FULL-ROUND=按 mandate（Tools/devloop/iteration_prompt.txt）读序施工。r412 收尾=tech_sha12 传棒 KEEP（§九 open 面=r411 同面：main#8 触发器行〔死线 10-13〕+main#9 提案证据包〔10-18〕+explore 被动跟踪族 #103/#101/#99/#98/#97/#90/#61/65/66/67/68+main#1 归档时窗 10-24+main#2/#3 深扫提案窗 10-18→下轮④查 mismatch=全轮续领·r95 律）。
2. main#8 腿②触发器每轮检：main#6 判②收干+GPU 空窗双现即领（配方五步·判据三条·死线 10-13·窗不至=判负留痕收口）；explore#12 P3 48h 死线=**10-14 15:1x 前出下一笔**（末笔 r411 explore#104 四态拼板已交卷·r412 勘正 r411「10-16」滑误〔48h 正身 10-14 15:5x·板面取严值〕·下笔候选=explore 表被动跟踪族任一轻量成件或新扫描条〔#3 已 10-11 刚扫禁重扫〕）；T-FV-134/141=10-18 周日演化日窗（**活动承接三句式提案待交·证据底座=r379~r412 件全链+main#9 证据包整理位**）。
3. main#5/#7 判③门槛未达（shots 判据帧未入库·交互窗在飞期禁动 City3D）；tech 队列常备=观察位族——**真无活时一行声明合法（禁造活凑数）**。
4. **常设收尾步**：commit 前写 logs/devloop-face-content.json（六键·updated_utc/artifact_utc 留空机器盖戳）→ powershell -NoProfile -ExecutionPolicy Bypass -File Tools\devloop\write-status-face.ps1 → FACE OK 才 commit（禁手写 state/status-face.json·r246）；**板面同步门**=Tools\devloop\check-runbook-sync.ps1 一行判读（SYNC 才 commit）；**板面-§九 双账门**=Tools\devloop\tasks-board-check.ps1（动板面必过）；**commit pathspec 限定律**=c2 触发轮 commit 一律 -m 后 -- <本轮路径清单>（防吞交互窗 staged 面）。

## 验收标准（怎么算完成）
实物优先计分（能跑能用=2／文件改动=1／纯记账=0）；动板面后 Tools\devloop\tasks-board-check.ps1 PASS 才 commit；commit=「DevLoop r<N>: …[via bm-a]」；未过门=如实记未完成；等待态=一行声明收轮。
