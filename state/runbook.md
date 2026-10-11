# FluxVerse DevLoop Runbook（启动首读面·Executive Protocol v1.0）

> <2KB 契约=..\..\docs\executive-protocol.md §1；进度唯一权威=TECH.md §九；收尾若「下一步」有变则更新本件（静轮免改）。

## 我是谁
超体宇宙城底座 DevLoop（Biggame 承建·bm-a 无人值守轮）；主线=City3D R2 模块壳（交互窗承建·其在飞件禁碰）。

## 我现在在干什么
r346 毕：explore#38 curb 链簇-空档结构谱成件（R-20261011-ad022-curb-cluster-gap-structure-census.md·own-街归属门五类全账 177 恒等——**合并键模型勘定**=每 (axis,row,dir) 一条 curb 线〔probe17 0.6m cross 单链姊妹拆分 42 实例→35 键·幻影检查 0/29 溶解+合并反铸 4 新空档=实例模型少计·合并=空档普查正模型〕+簇谱 68 簇{单38/双13/三13/四4·簇容上限 4}·68% 车在 n≥2 簇·簇内节拍 med 10.30m+**双种空档**=转角 18/33（med 43m·8 例空档罩路口→净空设计值 40-50m 转角让空窗）vs 街中 15/33（med 25m·20-30m 档主导）+观测包络簇覆盖仅 31%（七成留白）+R2 摆车落段六律〔段位/簇容/转角让空/街中断口/密度/线型〕=r345 律 3 段级展开）+main#6 判①②双假续候（0 新+8 件恒定）+P3-002 第一百零九回 PASS——本轮有实物产出·决策链三步全静。

## 下一步（队列头）
1. 轮首先跑 Tools\devloop\check-fastpath.ps1：**判读一律依 stdout `VERDICT:` 行字节**（FASTPATH=快道改道/FULL-ROUND=全轮/行缺失=手查后备）——**禁读工具 Exit Code 显示面**（r293 判例：-File 形态恒假显 1≠真实码·显示 1≠不可解析）。FASTPATH=队列取活（state/queue/{main,tech,explore}.md）→提案轨→一行声明；FULL-ROUND=按 mandate（Tools/devloop/iteration_prompt.txt）读序施工。r346 收尾=状态档四键全重写清屏（§九 open=时窗件族·队列归 FASTPATH 消费径·r288⑧~r346 先例）→七查静轮即 FASTPATH 队列取活。
2. 时窗件：**explore#12 P3 48h 节律死线滚动位=10-14 00:0x 前**（末笔 r346 成件起算·领任一自可执行调研条〔**#39 curb 转角空档×路口臂数联动谱=r346 新补条优先**（T 口/2 臂/1 臂/0 臂四型让空窗宽度对照·r342 junction 梯度镜像验证）·#13 Quaternius Streets 三方对照〔r338 已闭 Kenney/AD 两侧·三方对照=闭圈件〕·#17 街具自由摆对照〕轻量成件即满足）；T-FV-134 调研深扫+T-FV-141 提案 P3-003（判②滞留面候选在册）=10-18 周日演化日窗；T-FV-139 §九月度归档=10-24 首窗/11-01 月界（EOL 哨兵余半随窗回填=tech#13）。
3. main/tech 近件：main#6 R2 探测一行注记（基线=10-11 02:11 勿再误取 10-10）+P3-002 防御行检（常设·第一百零九回 PASS）+main#5/#7 判③门槛未达（shots 判据帧未入库·交互窗在飞期禁动 City3D）/tech 队列常备 16 条（#1 R2 里程碑后领·#13 EOL 余半=归档窗后回填·#14 watchdog 观察位=真发行/月档窗读·#15 codely 显示面厂商跟踪位=codely 升级后复测·#16 CCGS 采用 30 天回访位=11-01 patrol 窗·余=被动观察位）——**可领面近零=真无活时一行声明合法（禁造活凑数）**。
4. **常设收尾步（r247 起改道执法件）**：commit 前刷面=写 logs/devloop-face-content.json（六键·updated_utc/artifact_utc 留空机器盖戳）→ powershell -NoProfile -ExecutionPolicy Bypass -File Tools\devloop\write-status-face.ps1 → FACE OK 才 commit；禁手写 state/status-face.json（r246 future-ts 红根因）；**板面同步门（r272 起）**=Tools\devloop\check-runbook-sync.ps1 轮尾手跑一行判读（SYNC 才 commit·DRIFT=runbook/§九 轮号先对齐再收工）；**commit pathspec 限定律（r320 补位）**=c2 触发轮 commit 一律 -m 消息后 -- <本轮路径清单>（防吞他窗 staged 面）。

## 验收标准（怎么算完成）
实物优先计分（能跑能用=2／文件改动=1／纯记账=0）；门禁=产出面自带门绿（harness/exporter 五门）+动板面后 Tools\devloop\tasks-board-check.ps1 PASS 才 commit；commit=「DevLoop r<N>: …[via bm-a]」；未过门=如实记未完成；等待态=一行声明收轮。
