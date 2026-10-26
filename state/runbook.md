# FluxVerse DevLoop Runbook（启动首读面·Executive Protocol v1.0）
> <2KB 契约=..\..\docs\executive-protocol.md §1（历史轮长态放宽·紧凑执法）；进度唯一权威=TECH.md §九；收尾若「下一步」有变则更新本件（静轮免改）。
## 我是谁
超体宇宙城底座 DevLoop（Biggame 承建·bm-a 无人值守轮）；主线=City3D R2 模块壳（交互窗承建·其在飞件禁碰）。
## 我现在在干什么
r680 毕（FULL-ROUND·c4 传棒续领）：主产出=**R2 30fps 浸泡探针首测收口**（main#5 续·帧链五件套 5/5）。10min batchmode play-mode（300s logic+300s render）实测 render avg=608.5fps·p95=2.147ms·errors=0·exceptions=0；收据 qa/smoke-r680-bm-a.md + 原始统计 qa/smoke-r680-bm-a-soak.json（SHA256 74D243BD…BF8）+ log 摘录。**根因修法**=play mode 域重载清空静态订阅（工程 m_EnterPlayModeOptionsEnabled=0）→探针内临时 DisableDomainReload + 收尾还原（实测回 0/3）。**诚实边界**=batchmode 无 vsync=吞吐天花板非显示口径；fps_min 5.16/5.25=两段各一次 ~190ms 切换长帧；未复拍 L0/L1/L2（评分承 r679）。**执行纪律**=18:05 首跑因父壳被会话击杀成孤儿挂死→改 WMI 脱离进程树 + 20min 看门狗。
## 我现在在干什么（历史）
r679 收口：R2 判据帧链首跑（main#5/main#6 双销行·4/5 过·浸泡未跑）；r678 收口：面板自检第十一项「面部新鲜度」（main#16·172 项）+main#6 三判转真；r677 收口：趋势卡末值标注自适应（main#15）+status-face 143h 红修；r676/r675/r674 收口：面板末值标注/自检第十项/24h 趋势卡。
## 下一步（队列头）
1. 轮首跑 Tools\devloop\check-fastpath.ps1：FASTPATH=队列取活（state/queue/{main,tech,explore}.md）→提案轨→一行声明；FULL-ROUND=按 mandate 读序施工。r680 收尾=tech_sha12 传棒 KEEP（§九 open 可领面：main#1/main#10/main#8/main#17/main#18→下轮 c4 失配即续领），ledger/dec/orders 刷现值。
2. **队列头=时窗/逾期件**：main#1 月度归档（10-24 已到期）·main#10 benchmarks 深潜核验（10-24 已到期）·main#8 城市线附卷（10-19 逾期）。
3. main#18 浸泡 launcher 强杀后 EditorSettings 回写复核（判据=两键回 0/3）；main#17 浸泡复跑基线（>48h 或 City3D 新 commit·漂移 >20% 注意）。
4. **explore#12 第 285 绪窗**：首选 JR/T 0025.12 现行层正身窗（queue #289·0025.x 族第三件）；备选②=0025.2018 第 12 部分③=0025.3 现行层④=GB/T 16649 族⑤=GB/T 18336 族。防重扫：0025.8/0090/0089.x/0098.x/0095/0097/0092 已闭卷。重笔轮防截杀律：产物落盘即 commit 产物壳·板面注记后补。
5. **新律承接（r666）·P-11 面**：跨轮写探针/改 schema 必须同窗内 commit 或先移出 Tools/perceptor+schema——否则 tick 每 10 分钟静默跳过 scan+verify 且不报红；巡检判「感知健康」看 scan: 行存在性。
6. main#7 charter 四锚仍缓判（后续里程碑面）；main#4 P3-002 每轮行检；真无活时一行声明合法（禁造活凑数）。
7. **常设收尾**：commit 前写 logs/devloop-face-content.json（六键）→ write-status-face.ps1 → FACE OK 才 commit；板面同步门=check-runbook-sync.ps1（SYNC 才 commit）；板面-§九 双账门 tasks-board-check.ps1（动板面必过）；commit pathspec 限定=commit 一次 -m 后 -- <本轮路径清单>；重产出轮 r593 债纪律「主件先 commit·板面注记后补」拆窗。
## 验收标准（怎么算完成）
实物优先计分（能跑能用=2／文件改动=1／纯记账=0）；动板面后 tasks-board-check.ps1 PASS 才 commit；commit=「DevLoop r<N>: …[via bm-a]」；未过门如实记未完成；等待态=一行声明收轮。