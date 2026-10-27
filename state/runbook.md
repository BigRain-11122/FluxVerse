# FluxVerse DevLoop Runbook（启动首读面·Executive Protocol v1.0）
> <2KB 契约=..\..\docs\executive-protocol.md §1（历史轮长态放宽·紧凑执法）；进度唯一权威=TECH.md §九；收尾若「下一步」有变则更新本件（静轮免改）。
## 我是谁
超体宇宙城底座 DevLoop（Biggame 承建·bm-a 无人值守轮）；主线=City3D R2 模块壳（交互窗承建·其在飞件禁碰）。
## 我现在在干什么
r685 毕（FULL-ROUND·triggers=1 c4 传棒）：主产出=**main#22 销项：探针静默零读自检**。①scan 探针循环从「无条件 OK」改为四态判读——`$null`→`WARN null-result`／无 state→`no-state`／零键→`empty-state`／声明 `matched<expect_min_rows`→`WARN zero-read`，另加一行汇总 `perceptor WARN: N probe(s)…` 与 `governance.probe_warn_count`；**健康口径不变**（WARN 不失败、不写 FAIL 字样→快道 c1 零误触发，轮健康仍是 verify gate）。②首件探针声明下限=`orders_hq`（matched + floor 20）。③实证=新沙盒件 `test-scan-probe-warn.ps1` **8/8**（含「第三种表形→WARN 且不再 OK」「健康表→OK」「缺档→empty-state」「零 FAIL 字样」）+ `test-orders-hq.ps1` **18/18**（T3 修一条数据依赖断言：今日行多已被 tick 游标化，不变量改为「未见今日行才发」，实测 unseen=0→emitted=0）；真机 scan `events +5 quarantined=0`、verify **PASS**。④**自检首跑即抓出真问题**：5 枚探针恒以 OK 掩着空读——`inbox/transfers/ticklog` 属合法静默（需回 `quiet=$true`），`snapshot` 与 `orders_bg` 读的是 10-04 MiniGame GLOBAL 重组**前的退役路径**（长期空读）→ **新债 main#24**。**诚实边界**：本轮无新增 CEO 可见网页（感知链可信度工程）；WARN 是观察面非门禁；**T-FV-134 基准刷新仍未承载=逾期 3 日如实记**。
## 我现在在干什么（历史）
r684 收口（FULL-ROUND·triggers=5）：主产出=**main#21 销项：CEO 直令行格式盲区 + 组级探针 root 断链同窗拔出**（orders_hq 双格式正则+日期闸；scan.ps1 `Get-Item`→`Resolve-Path` 保 PathInfo）。
## 我现在在干什么（历史）
r683 收口：T-FV-139 月档窗实跑（181 行迁 202609·TECH -21.8%）+main#10 销项。
## 我现在在干什么（历史）
r682 收口：浸泡还原闸基线守卫升级（闸抽成 playmode-settings-guard.ps1 四态+基线正典+ABORT exit 2 拒跑·沙盒 8/8·诚实边界=launcher exit-2 未端到端）；r681 收口：浸泡 launcher 设置残留自愈闸（三强杀径全跳过探针自身还原→预还原+后还原+独立开关三面）；r680 收口：R2 30fps 浸泡探针首测（main#5 续·帧链 5/5·render avg 608.5fps·零错零异常）；r679 收口：R2 判据帧链首跑（main#5/main#6 双销行·4/5 过）；r678 收口：面板自检第十一项「面部新鲜度」（main#16·172 项）+main#6 三判转真。
## 下一步（队列头）
1. 轮首跑 Tools\devloop\check-fastpath.ps1：FASTPATH=队列取活（state/queue/{main,tech,explore}.md）→提案轨→一行声明；FULL-ROUND=按 mandate 读序施工。r685 收尾=tech_sha12 传棒 KEEP（§九 open 可领面：main#24/main#8/main#17/main#20/main#23/main#3→下轮 c4 失配即续领），ledger/dec/orders 刷现值。
2. **队列头=main#24 探针退役路径修复（r685 自检首跑抓出·snapshot/orders_bg 两枚长期空读 + inbox/transfers/ticklog 三枚合法静默改为 `quiet=$true`）** → main#23 T-FV-134 基准刷新（10-27 到期·逾期 3 日·轮尾预算余量领）→ main#8 城市线附卷（10-19 逾期·≤1 轮工作量）→ main#17 浸泡复跑（窗口 = 首测 10-26 18:36 起 ≥48h 即 10-28 18:36 后，或 City3D 新 commit；漂移 >20% 注意）→ main#20 ABORT 观察位（出现即查改动来源，禁改基线抹平）。
3. **explore#12 第 285 绪窗**：首选 JR/T 0025.12 现行层正身窗（queue #289·0025.x 族第三件）；备选②=0025.2018 第 12 部分③=0025.3 现行层④=GB/T 16649 族⑤=GB/T 18336 族。防重扫：0025.8/0090/0089.x/0098.x/0095/0097/0092 已闭卷。重笔轮防截杀律：产物落盘即 commit 产物壳·板面注记后补。
4. **新律承接（r666）·P-11 面**：跨轮写探针/改 schema 必须同窗内 commit 或先移出 Tools/perceptor+schema——否则 tick 每 10 分钟静默跳过 scan+verify 且不报红；巡检判「感知健康」看 scan: 行存在性。
5. main#7 charter 四锚仍缓判（后续里程碑面）；main#3 T-FV-141 提案位下窗 2026-10-18 已过；main#4 P3-002 每轮行检；真无活时一行声明合法（禁造活凑数）。
6. **归档面新常态（r683）**：§九 已收敛回 30 天窗（1028 行/1.83MB）；每月 1 日月界轮跑 `archive-section9.ps1`（先 -DryRun 后真跑），四门 g1-g4 全绿才算收口。
7. **常设收尾**：commit 前写 logs/devloop-face-content.json（六键）→ write-status-face.ps1 → FACE OK 才 commit；板面同步门=check-runbook-sync.ps1（SYNC 才 commit）；板面-§九 双账门 tasks-board-check.ps1（动板面必过）；commit pathspec 限定=commit 一次 -m 后 -- <本轮路径清单>；重产出轮 r593 债纪律「主件先 commit·板面注记后补」拆窗。
## 验收标准（怎么算完成）
实物优先计分（能跑能用=2／文件改动=1／纯记账=0）；动板面后 tasks-board-check.ps1 PASS 才 commit；commit=「DevLoop r<N>: …[via bm-a]」；未过门如实记未完成；等待态=一行声明收轮。