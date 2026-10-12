# FluxVerse DevLoop Runbook（启动首读面·Executive Protocol v1.0）

> <2KB 契约=..\..\docs\executive-protocol.md §1；进度唯一权威=TECH.md §九；收尾若「下一步」有变则更新本件（静轮免改）。

## 我是谁
超体宇宙城底座 DevLoop（Biggame 承建·bm-a 无人值守轮）；主线=City3D R2 模块壳（交互窗承建·其在飞件禁碰）。

## 我现在在干什么
r419 毕（explore 线 P3 产出轮·explore#110 51WORLD 港股披露面终验回填成件=确认缺席定谳〔R-20261012-51meet-second-sample-scan.md v1.1 §7〕）：P3 48h 时钟重置（末笔 r419 18:3x·下次严值 10-14 17:0x·r320~r419 一百轮连翻）；main#8 触发器判假续候（判② 8 件未收干+GPU 1%/10.5G 非空窗·**死线 10-13=明日终判窗**）；#4 P3-002 第 182 回 PASS/#6 判①②双假（0 新 City3D commit+8 件未收干恒定）；决策链三步零新件（c3/c6 静·c7 令扫零本司直令）。详账=TECH §九 r419 行。

## 下一步（队列头）
1. 轮首跑 Tools\devloop\check-fastpath.ps1：判读一律依 stdout `VERDICT:` 行字节（禁读 Exit Code 显示面·r293 假显判例）；FASTPATH=队列取活（state/queue/{main,tech,explore}.md）→提案轨→一行声明；FULL-ROUND=按 mandate（Tools/devloop/iteration_prompt.txt）读序施工。r419 收尾=tech_sha12 传棒 KEEP（§九 open 面：main#8 触发器行〔死线 10-13——**10-13 当日轮=终判窗**：双现即领·窗不至=判负留痕收口〕+main#9 提案证据包〔10-18〕+explore 被动跟踪族 #110〔首检毕 r419·年检位维持〕/#108/#107/#106/#105/#103/#101/#99/#98/#97/#90/#61+65-68+main#1 归档 10-24+main#2/#3 深扫提案窗 10-18→下轮④查 mismatch=全轮续领·r95 律）。
2. main#8 腿②触发器每轮检（**死线 10-13 当日轮=终判窗**：main#6 判②收干+GPU 空窗双现即领·窗不至=判负留痕收口）；explore#12 P3 48h 死线=10-14 17:0x 前出下一笔（末笔 r419 #110 回填成件·下笔候选=被动跟踪族轻量成件或新扫描条〔#3 禁重扫维持〕）；T-FV-134/141=10-18 周日演化日窗（**三句式提案待交**·现象句消费 explore#107 §0+成本句消费 #106 §4+报价单国内锚消费 #108 源件+第二样本对照消费 #109 源件〔r419 资本面坐实句已回填其 §5.4〕）。
3. main#5/#7 判③门槛未达（shots 判据帧未入库·交互窗在飞期禁动 City3D）；tech 队列常备=观察位族——**真无活时一行声明合法（禁造活凑数）**。
4. **常设收尾步**：commit 前写 logs/devloop-face-content.json（六键·updated_utc/artifact_utc 留空机器盖戳）→ powershell -NoProfile -ExecutionPolicy Bypass -File Tools\devloop\write-status-face.ps1 → FACE OK 才 commit（禁手写 state/status-face.json·r246）；**板面同步门**=Tools\devloop\check-runbook-sync.ps1（SYNC 才 commit）；**板面-§九 双账门**=Tools\devloop\tasks-board-check.ps1（动板面必过）；**commit pathspec 限定律**=commit 一律 -m 后 -- <本轮路径清单>（防吞交互窗 staged 面）。

## 验收标准（怎么算完成）
实物优先计分（能跑能用=2／文件改动=1／纯记账=0）；动板面后 Tools\devloop\tasks-board-check.ps1 PASS 才 commit；commit=「DevLoop r<N>: …[via bm-a]」；未过门=如实记未完成；等待态=一行声明收轮。
