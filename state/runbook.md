# FluxVerse DevLoop Runbook（启动首读面·Executive Protocol v1.0）

> <2KB 契约=..\..\docs\executive-protocol.md §1（历史轮长态放宽·紧凑执法）；进度唯一权威=TECH.md §九；收尾若「下一步」有变则更新本件（静轮免改）。

## 我是谁
超体宇宙城底座 DevLoop（Biggame 承建·bm-a 无人值守轮）；主线=City3D R2 模块壳（交互窗承建·其在飞件禁碰）。

## 我现在在干什么
r678 毕（FASTPATH 七静改道→队列取活·main#16）：**主产出=城市面板自检第十一项「面部新鲜度」（queue main#16 销行）**——页内直读 status-face 龄，>24h 标注意并写「面部陈旧 N 小时」，把「车道静默」从 tick 日志搬到面板可见面；新测 12/12、十一套面板测试合计 172 项全绿；重建 bytes=56641；qa/city-panel-r678.png 复核=11 项通过+末行面部 2.9 小时前，qa/city-panel-r678-fixture-stale-face.png 复核=1 项注意「面部陈旧 30.0 小时」。**判候变化**=main#6 三判转真（City3D 工作树零脏+8 件已由 a7383446 收史+shots 14 帧 tracked 含 R2 六帧）→main#5 判据帧链首跑解锁。顺手根治 r675 硬编码 10 行数。

## 我现在在干什么（历史）
r677 收口：城市面板趋势卡「末值标注自适应」（main#15·28/28 新测·160 项）+status-face 143h 红修。
r676 收口：城市面板趋势卡「末值标注」（main#14·18/18 新测·132 项）。
r675 收口：面板自检第十项「趋势末点」+四套旧测试硬编码项数根治（15/15·114 项）。
r674 收口：城市面板「24 小时趋势」三带折线卡（main#11·27/27 新测·bytes=36708）。
r673 收口：城市面板自检第九项「tick 覆盖」+自检卡说明改九项（新测 11/11）。
r672 收口：城市面板「跨轮轨迹」+自检第八项「轨迹一致」+benchmarks v1.3 清账。

## 下一步（队列头）
1. 轮首跑 Tools\\devloop\\check-fastpath.ps1：FASTPATH=队列取活（state/queue/{main,tech,explore}.md）→提案轨→一行声明；FULL-ROUND=按 mandate 读序施工。r678 收尾=tech_sha12 传棒 KEEP（§九 open 可领行=main#5 已解锁→下轮 c4 失配即续领），ledger/dec/orders 刷现值。
2. **队列头=main#5 R2 判据帧链首跑**（r678 判真解锁）：照 docs/qa-r2-frame-map.md §三/§四——优先消费库内 867b59e 帧集（零编辑器成本）→qa/smoke-r678-bm-a-{L0,L1,L2}.png+log+md 六段式收据；**30fps 浸泡=本件范围·未跑·禁宣称**（batchmode play-mode 首次可行性锚，fallback 收据须标「代理」）。
3. 时窗/逾期件优先序=main#1 月度归档（已到期）>main#10 benchmarks 深潜核验（已到期）>main#8 附卷（逾期）。
4. **explore#12 第 285 绪窗**：首选=JR/T 0025.12 现行层正身窗（queue #289·0025.x 族第三件）；备选②=0025—2018 第 12 部分③=0025.3 现行层④=GB/T 16649 族⑤=GB/T 18336 族。防重扫锚=0025.8/0090/0089.x/0098.x/0095/0097/0092 已闭卷。重笔轮防截杀律：产物落盘即 commit 产物壳·板面注记后补。
5. **新律承接（r666）·P-11 族**：跨轮写探针/改 schema 必须同窗落 commit 或先移出 Tools/perceptor+schema——否则 tick 每 10 分钟静默跳过 scan+verify 且不报红；巡检判「感知健康」看 scan: 行存在性。
6. main#7 charter 四锚仍缓判（后续里程碑面）；main#4 P3-002 每轮行检；真无活时一行声明合法（禁造活凑数）。
7. **常设收尾步**：commit 前写 logs/devloop-face-content.json（六键）→ write-status-face.ps1 → FACE OK 才 commit；板面同步门=check-runbook-sync.ps1（SYNC 才 commit）；板面-§九 双账门=tasks-board-check.ps1（动板面必过）；commit pathspec 限定律=commit 一律 -m 后 -- <本轮路径清单>；重产出轮=r593 债纪律「主件先 commit·板面注记后补」拆窗。
## 验收标准（怎么算完成）
实物优先计分（能跑能用=2／文件改动=1／纯记账=0）；动板面后 tasks-board-check.ps1 PASS 才 commit；commit=「DevLoop r<N>: …[via bm-a]」；未过门=如实记未完成；等待态=一行声明收轮。