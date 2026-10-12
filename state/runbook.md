# FluxVerse DevLoop Runbook（启动首读面·Executive Protocol v1.0）

> <2KB 契约=..\..\docs\executive-protocol.md §1；进度唯一权威=TECH.md §九；收尾若「下一步」有变则更新本件（静轮免改）。

## 我是谁
超体宇宙城底座 DevLoop（Biggame 承建·bm-a 无人值守轮）；主线=City3D R2 模块壳（交互窗承建·其在飞件禁碰）。

## 我现在在干什么
r416 毕（explore 线 P3 产出轮·断班收编）：国内活动承办价格带扫描成件=docs/research/R-20261012-china-event-production-pricing-scan.md v1.0（10-18 提案报价单国内锚：四层价格谱+成本三账〔人员 42-45% 恒最大头+保障合规 20% 条款清单〕+定义边界句〔承接物=城内 world-events 事件非独立会议平台〕）+explore#12 死线翻 r416（下次 10-14 16:2x 严值）+轮尾补条 #108/#109（51Meet 第二样本=下笔候选位）。判候面 #4 179 回 PASS/#6 双假（0 新 City3D commit+8 件未收干）/#8 判假（GPU 28%/11.3G 非空窗·死线 10-13=明日到期）。r416 内容三件上班落盘后断在收尾链——本班收编补 face/同步门/双账门/状态档/commit。

## 下一步（队列头）
1. 轮首跑 Tools\devloop\check-fastpath.ps1：判读一律依 stdout `VERDICT:` 行字节（禁读 Exit Code 显示面·r293 假显判例）；FASTPATH=队列取活（state/queue/{main,tech,explore}.md）→提案轨→一行声明；FULL-ROUND=按 mandate（Tools/devloop/iteration_prompt.txt）读序施工。r416 收尾=tech_sha12 传棒 KEEP（§九 open 面：main#8 触发器行〔死线 10-13〕+main#9 提案证据包〔10-18〕+explore 被动跟踪族 #109/#108/#107/#106/#105/#103/#101/#99/#98/#97/#90/#61+65-68+main#1 归档 10-24+main#2/#3 深扫提案窗 10-18→下轮④查 mismatch=全轮续领·r95 律）。
2. main#8 腿②触发器每轮检（**死线 10-13=明日到期**：main#6 判②收干+GPU 空窗双现即领·窗不至=判负留痕收口）；explore#12 P3 48h 死线=**10-14 16:2x 前出下一笔**（末笔 r416 已交卷·下笔候选=#109 51Meet 或被动跟踪族轻量成件〔#3 已 10-11 刚扫禁重扫〕）；T-FV-134/141=10-18 周日演化日窗（**三句式提案待交**·现象句消费 explore#107 §0+成本句消费 #106 §4+报价单国内锚消费 #108 源件）。
3. main#5/#7 判③门槛未达（shots 判据帧未入库·交互窗在飞期禁动 City3D）；tech 队列常备=观察位族——**真无活时一行声明合法（禁造活凑数）**。
4. **常设收尾步**：commit 前写 logs/devloop-face-content.json（六键·updated_utc/artifact_utc 留空机器盖戳）→ powershell -NoProfile -ExecutionPolicy Bypass -File Tools\devloop\write-status-face.ps1 → FACE OK 才 commit（禁手写 state/status-face.json·r246）；**板面同步门**=Tools\devloop\check-runbook-sync.ps1（SYNC 才 commit）；**板面-§九 双账门**=Tools\devloop\tasks-board-check.ps1（动板面必过）；**commit pathspec 限定律**=commit 一律 -m 后 -- <本轮路径清单>（防吞交互窗 staged 面）。

## 验收标准（怎么算完成）
实物优先计分（能跑能用=2／文件改动=1／纯记账=0）；动板面后 Tools\devloop\tasks-board-check.ps1 PASS 才 commit；commit=「DevLoop r<N>: …[via bm-a]」；未过门=如实记未完成；等待态=一行声明收轮。
