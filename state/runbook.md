# FluxVerse DevLoop Runbook（启动首读面·Executive Protocol v1.0）
> <2KB 契约=..\..\docs\executive-protocol.md §1（历史轮长态放宽·紧凑执法）；进度唯一权威=TECH.md §九；收尾若「下一步」有变则更新本件（静轮免改）。
## 我是谁
超体宇宙城底座 DevLoop（Biggame 承建·bm-a 无人值守轮）；主线=City3D R2 模块壳（交互窗承建·其在飞件禁碰）。
## 我现在在干什么
r684 毕（FULL-ROUND·triggers=5）：主产出=**main#21 销项：CEO 直令行格式盲区 + 组级探针 root 断链同窗拔出**。①`probes/orders_hq.ps1` 双格式正则（旧 `MM-DD ~`／新 `2026-MM-DD HH:Mx`）+ 日期闸（旧日行静默播种、今日行才发事件）——活树 orders 表 423 行旧式 0／新式 247，此前探针恒零匹配；②`scan.ps1` L54 组根命中镜像后 `Get-Item` 赋值使 `$ctx.root` 变空串（DirectoryInfo 无 `.Path`）→ 一切组级探针静默零读却报 OK，改 `Resolve-Path` 保 PathInfo；③`scan.ps1` 加 `governance.ceo_orders_hq_rows` 加性字段。实证：沙盒 18/18（含真台账+真游标副本 T3）、scan 探针全 OK `events +16 quarantined=0`、verify PASS、`hqorder:` 游标 301→547、状态面 `ceo_orders_hq_rows=20`。**诚实边界**：无新增 CEO 可见网页（governance 按受众分离律不进公开快照）；246 键为一次性补种。**T-FV-134 基准刷新（10-27 到期）仍未承载=逾期 2 日如实记。**
## 我现在在干什么（历史）
r683 收口：T-FV-139 月档窗实跑（181 行迁 202609·TECH -21.8%）+main#10 销项。
## 我现在在干什么（历史）
r682 收口：浸泡还原闸基线守卫升级（闸抽成 playmode-settings-guard.ps1 四态+基线正典+ABORT exit 2 拒跑·沙盒 8/8·诚实边界=launcher exit-2 未端到端）；r681 收口：浸泡 launcher 设置残留自愈闸（三强杀径全跳过探针自身还原→预还原+后还原+独立开关三面）；r680 收口：R2 30fps 浸泡探针首测（main#5 续·帧链 5/5·render avg 608.5fps·零错零异常）；r679 收口：R2 判据帧链首跑（main#5/main#6 双销行·4/5 过）；r678 收口：面板自检第十一项「面部新鲜度」（main#16·172 项）+main#6 三判转真。
## 下一步（队列头）
1. 轮首跑 Tools\devloop\check-fastpath.ps1：FASTPATH=队列取活（state/queue/{main,tech,explore}.md）→提案轨→一行声明；FULL-ROUND=按 mandate 读序施工。r684 收尾=tech_sha12 传棒 KEEP（§九 open 可领面：main#8/main#17/main#20/main#22/main#23/main#3→下轮 c4 失配即续领），ledger/dec/orders 刷现值。
2. **队列头=T-FV-134 司级 7 天基准刷新（2026-10-27 到期·已逾期 2 日·main#23）** → main#22 探针静默零读自检（本轮两处盲区的共同掩盖面）→ main#8 城市线附卷（10-19 逾期·≤1 轮工作量）→ main#17 浸泡复跑（窗口 = 首测 10-26 18:36 起 ≥48h 即 10-28 18:36 后，或 City3D 新 commit；漂移 >20% 注意）→ main#20 ABORT 观察位（出现即查改动来源，禁改基线抹平）。
3. **explore#12 第 285 绪窗**：首选 JR/T 0025.12 现行层正身窗（queue #289·0025.x 族第三件）；备选②=0025.2018 第 12 部分③=0025.3 现行层④=GB/T 16649 族⑤=GB/T 18336 族。防重扫：0025.8/0090/0089.x/0098.x/0095/0097/0092 已闭卷。重笔轮防截杀律：产物落盘即 commit 产物壳·板面注记后补。
4. **新律承接（r666）·P-11 面**：跨轮写探针/改 schema 必须同窗内 commit 或先移出 Tools/perceptor+schema——否则 tick 每 10 分钟静默跳过 scan+verify 且不报红；巡检判「感知健康」看 scan: 行存在性。
5. main#7 charter 四锚仍缓判（后续里程碑面）；main#3 T-FV-141 提案位下窗 2026-10-18 已过；main#4 P3-002 每轮行检；真无活时一行声明合法（禁造活凑数）。
6. **归档面新常态（r683）**：§九 已收敛回 30 天窗（1028 行/1.83MB）；每月 1 日月界轮跑 `archive-section9.ps1`（先 -DryRun 后真跑），四门 g1-g4 全绿才算收口。
7. **常设收尾**：commit 前写 logs/devloop-face-content.json（六键）→ write-status-face.ps1 → FACE OK 才 commit；板面同步门=check-runbook-sync.ps1（SYNC 才 commit）；板面-§九 双账门 tasks-board-check.ps1（动板面必过）；commit pathspec 限定=commit 一次 -m 后 -- <本轮路径清单>；重产出轮 r593 债纪律「主件先 commit·板面注记后补」拆窗。
## 验收标准（怎么算完成）
实物优先计分（能跑能用=2／文件改动=1／纯记账=0）；动板面后 tasks-board-check.ps1 PASS 才 commit；commit=「DevLoop r<N>: …[via bm-a]」；未过门如实记未完成；等待态=一行声明收轮。