# FluxVerse DevLoop Runbook（启动首读面·Executive Protocol v1.0）

> <2KB 契约=..\..\docs\executive-protocol.md §1；进度唯一权威=TECH.md §九；收尾若「下一步」有变则更新本件（静轮免改）。

## 我是谁
超体宇宙城底座 DevLoop（Biggame 承建·bm-a 无人值守轮）；主线=City3D R2 模块壳（交互窗承建·其在飞件禁碰）。

## 我现在在干什么
r323 毕：explore#14 建筑族成件清 P3 48h 死线连四轮（R-20261011-ad022-bld-pitch-probe.md·AD-022 建筑侧=3 卫星簇〔16×3·簇心半径 180 正三角〕+中心 1 件/簇内 1 单位整数粒度非 5.0 格/Apartment 包内在册 demo 零在场·**Path 5.0 建筑侧判负收口**〔5.0 证据面止于路侧·建筑侧转导入窗 mesh footprint 复核/R2 设计面自定〕·死线滚动 10-13 18:5x）+main#6 R2 判①②双假续候（18:46 实测 0 新 commit+8 件未收干恒定）+P3-002 行检第八十六回 PASS（staged world-events=0）——本轮有实物产出·决策链三步全静。

## 下一步（队列头）
1. 轮首先跑 Tools\devloop\check-fastpath.ps1：**判读一律依 stdout `VERDICT:` 行字节**（FASTPATH=快道改道/FULL-ROUND=全轮/行缺失=手查后备）——**禁读工具 Exit Code 显示面**（r293 判例：-File 形态恒假显 1≠真实码·显示 1≠不可解析）。FASTPATH=队列取活（state/queue/{main,tech,explore}.md）→提案轨→一行声明；FULL-ROUND=按 mandate（Tools/devloop/iteration_prompt.txt）读序施工。r323 收尾=状态档四键全重写清屏（§九 open=时窗件族·队列归 FASTPATH 消费径·r288⑧~r323 先例）→七查静轮即 FASTPATH 队列取活。
2. 时窗件：**explore#12 P3 48h 节律死线滚动位=10-13 18:5x 前**（末笔 r323 成件起算·领任一自可执行调研条〔explore#13 Quaternius 路语法/#15 AD-022 细节件族谱同口径优先〕轻量成件即满足）；T-FV-134 调研深扫+T-FV-141 提案 P3-003（判②滞留面候选在册）=10-18 周日演化日窗；T-FV-139 §九月度归档=10-24 首窗/11-01 月界（EOL 哨兵余半随窗回填=tech#13）。
3. main/tech 近件：main#6 R2 探测一行注记（基线=10-11 02:11 勿再误取 10-10）+P3-002 防御行检（常设·第八十六回 PASS）+main#5/#7 判③门槛未达（shots 判据帧未入库·交互窗在飞期禁动 City3D）/tech 队列常备 16 条（#1 R2 里程碑后领·#13 EOL 余半=归档窗后回填·#14 watchdog 观察位=真发行/月档窗读·#15 codely 显示面厂商跟踪位=codely 升级后复测·#16 CCGS 采用 30 天回访位=11-01 patrol 窗·余=被动观察位）——**可领面近零=真无活时一行声明合法（禁造活凑数）**。
4. **常设收尾步（r247 起改道执法件）**：commit 前刷面=写 logs/devloop-face-content.json（六键·updated_utc/artifact_utc 留空机器盖戳）→ powershell -NoProfile -ExecutionPolicy Bypass -File Tools\devloop\write-status-face.ps1 → FACE OK 才 commit；禁手写 state/status-face.json（r246 future-ts 红根因）；**板面同步门（r272 起）**=Tools\devloop\check-runbook-sync.ps1 轮尾手跑一行判读（SYNC 才 commit·DRIFT=runbook/§九 轮号先对齐再收工）；**commit pathspec 限定律（r320 补位）**=c2 触发轮 commit 一律 -m 消息后 -- <本轮路径清单>（防吞他窗 staged 面）。

## 验收标准（怎么算完成）
实物优先计分（能跑能用=2／文件改动=1／纯记账=0）；门禁=产出面自带门绿（harness/exporter 五门）+动板面后 Tools\devloop\tasks-board-check.ps1 PASS 才 commit；commit=「DevLoop r<N>: …[via bm-a]」；未过门=如实记未完成；等待态=一行声明收轮。
