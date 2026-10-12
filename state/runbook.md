# FluxVerse DevLoop Runbook（启动首读面·Executive Protocol v1.0）

> <2KB 契约=..\..\docs\executive-protocol.md §1；进度唯一权威=TECH.md §九；收尾若「下一步」有变则更新本件（静轮免改）。

## 我是谁
超体宇宙城底座 DevLoop（Biggame 承建·bm-a 无人值守轮）；主线=City3D R2 模块壳（交互窗承建·其在飞件禁碰）。

## 我现在在干什么
r448 毕（FULL-ROUND 三触发判候轮+P3-002 轮换收件轮·00:15 开工）：c6 dec delta 两行消费（D-20261013-01=本司 F-20261012-01/02/03 三回执收讫+FV-02 腿②死线今日不催·D-20261013-02=C-20261012-01 Phase 0 交卷 executed·均按回执处理零动作·席5 零动作）；**P3-002 第 211 回 PASS+收件**（10-12 当日档 staged 480KB→本轮 pathspec commit 入库=r447 预告兑现·最新入库档推进 10-12）；#6 判①②双假续候+**#8 判假续候**（0 新 City3D commit+8 件未收干+GPU 1%/9312MiB 批间态〔CLOUDWAVE-2 云端波在飞〕·双现未至·**今日 10-13=终判窗日·15:0x 硬触发位**）；计分=编年史数据件 commit 1 分位→末分 r448 00:2x·零分线推 10-14 22:1x（explore#12 P3 死线 10-14 21:0x 严值不变）；tech 队列 16 条全被动维持。详账=TECH §九 r448 行。

## 下一步（队列头）
1. 轮首跑 Tools\devloop\check-fastpath.ps1：判读一律依 stdout `VERDICT:` 行字节（禁读 Exit Code 显示面·r293 假显判例）；FASTPATH=队列取活（state/queue/{main,tech,explore}.md）→提案轨→一行声明；FULL-ROUND=按 mandate（Tools/devloop/iteration_prompt.txt）读序施工。r448 收尾=tech_sha12 传棒 KEEP（§九 open 面：main#8 触发器行〔死线=**今日 10-13 终判窗**：双现即领·窗不至=判负留痕收口·**15:0x 后仍窗不至=当班启 P3 提前笔**（≤21:0x 一分件·r419 先例·禁再判候拖延）〕+main#10 benchmarks 深潜核验位〔10-24〕+explore 被动跟踪族 #112〔新入位·待 10-18 提案窗〕/#110〔年检位维持〕/#108/#107/#106/#105/#103/#101/#99/#98/#97〔r430 首检毕·年检位维持〕/#90/#61+65-68+main#1 归档 10-24+main#2/#3 深扫提案窗 10-18→下轮④查 mismatch=全轮续领·r95 律）。
2. main#8 腿②触发器每轮检（**今日 10-13=终判窗**：main#6 判②收干+GPU 稳定空窗双现即领·窗不至=判负留痕收口·**防空转分支=15:0x 后仍窗不至即当班启 P3 提前笔**〔末分 r448 00:2x 编年史收件 1 分位·24h 零分线推 10-14 22:1x·提前笔余效=explore#12 P3 死线 10-14 21:0x 提前清·照跑不亏·r419 先例〕）；explore#12 P3 下笔死线=10-14 21:0x 板面严值（末笔 r439 22:17·正身 10-14 22:1x·取严不放松·下笔候选=被动跟踪族轻量成件〔#112 已入位待提案窗·#111/#97 已闭卷〕或新扫描条〔#3 禁重扫维持〕）；T-FV-134/141=10-18 周日演化日窗（深扫+**三句式提案正文待交**·证据面=R-20261012-p3003-proposal-appendix.md §A~§F+容量句锚 R-20261012-virtual-event-concurrent-capacity-benchmarks.md §1/§3 一站引用〔r439 增补〕+判据候选=其 §D 三问锁用）。
3. main#5/#7 判③门槛未达（shots 判据帧未入库·交互窗在飞期禁动 City3D）；tech 队列常备=观察位族——**真无活时一行声明合法（禁造活凑数）**。
4. **常设收尾步**：commit 前写 logs/devloop-face-content.json（六键·updated_utc/artifact_utc 留空机器盖戳）→ powershell -NoProfile -ExecutionPolicy Bypass -File Tools\devloop\write-status-face.ps1 → FACE OK 才 commit（禁手写 state/status-face.json·r246）；**板面同步门**=Tools\devloop\check-runbook-sync.ps1（SYNC 才 commit）；**板面-§九 双账门**=Tools\devloop\tasks-board-check.ps1（动板面必过）；**commit pathspec 限定律**=commit 一律 -m 后 -- <本轮路径清单>（防吞交互窗 staged 面）。

## 验收标准（怎么算完成）
实物优先计分（能跑能用=2／文件改动=1／纯记账=0）；动板面后 Tools\devloop\tasks-board-check.ps1 PASS 才 commit；commit=「DevLoop r<N>: …[via bm-a]」；未过门=如实记未完成；等待态=一行声明收轮。
