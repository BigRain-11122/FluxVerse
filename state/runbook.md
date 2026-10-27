# FluxVerse DevLoop Runbook（启动首读面·Executive Protocol v1.0）
> <2KB 契约=..\..\docs\executive-protocol.md §1（历史轮长态放宽·紧凑执法）；进度唯一权威=TECH.md §九；收尾若「下一步」有变则更新本件（静轮免改）。
## 我是谁
超体宇宙城底座 DevLoop（Biggame 承建·bm-a 无人值守轮）；主线=City3D R2 模块壳（交互窗承建·其在飞件禁碰）。
## 我现在在干什么
r690 毕（FULL-ROUND·triggers=1 c4 传棒·产品面优先轮）：主产出=**main#28 销项：面板「最近实物」变成可点实物**——`build-city-panel.ps1` 在构建时用 ASCII 正则取出 artifact 里的路径 token，逐条 `Test-Path` 并算好 `file:///` 绝对 URL（命中给 url／未命中只给 exists=false），页面侧**零猜路径**，只按 token 顺序把原文切片替换成 `<a class="artlink">` 或 `…<em>未找到</em>`，其余散文照旧 esc 转义。新增自检第 13 项「实况路径」对账承诺：全命中=绿／有缺失=注意并点名／闭零路径也注意。实证=`PANEL OK bytes=63988 art=5 art_missing=0`＋自检 **13/13**＋新沙盒 `logs/devloop-r690-panel-artifact-test.js` **15/15**＋旧 10 套面板测试 **187 断言零回归**＋`node --check` 零错＋全页截图 `qa/city-panel-r690-bm-a.png`（1400×3400·5 个文件名高亮可点）。**诚实边界=只做「最近实物」一行（当前活／里程碑仍纯散文·main#29 续）；路径只证存在不证内容；T-FV-134 基准刷新（10-27 到期）仍未承载=逾期 2 日。**
## 我现在在干什么（历史）
r689 收口：main#27 面板三处品质手术（24h 假 0 谷根治=写侧 `c<=0` 不 append＋读侧剔除计 `HIST.dropped`＋单调全窗扫描；持平折叠＋自检第 11 项；三行满宽；截图 `qa/city-panel-r689-bm-a.png`）。r688 收口：main#26 路径普查接进 verify 健康行（`VERIFY HEALTH: probe-path-census: …`·WARN 不失败闸·沙盒 15/15）。r687 收口：main#25 探针路径存活普查（26 探针/55 路径/52 存在/0 未解释死路径·沙盒 6/6）。r686 收口：main#24 两枚长期空读探针修好＋`quiet` 第三形态（26 枚探针零 WARN）。r685 收口：main#22 探针静默零读自检（scan 四态 WARN＋声明式 `expect_min_rows`）。r684 收口：main#21 CEO 直令行格式盲区＋组级探针 root 断链。r683 收口：T-FV-139 月档窗实跑。r682/r681/r680/r679/r678 收口：浸泡闸基线守卫／launcher 残留自愈／R2 30fps 浸泡首测／判据帧链／面部新鲜度第 11 项。
## 下一步（队列头）
1. 轮首跑 Tools\devloop\check-fastpath.ps1：FASTPATH=队列取活（state/queue/{main,tech,explore}.md）→提案轨→一行声明；FULL-ROUND=按 mandate 读序施工。r690 收尾=tech_sha12 传棒 KEEP（§九 open 可领面：main#29/main#23/main#8/main#17/main#20/main#3→下轮 c4 失配即续领），ledger/dec/orders 刷现值。
2. **队列头=main#23 T-FV-134 司级 7 天基准刷新**（10-27 到期·**逾期 2 日**·轮尾预算余量领·**产品面硬下限下优先给能看的东西**）→ main#8 城市线附卷（10-19 逾期·≤1 轮工作量）→ main#17 浸泡复跑（首测 10-26 18:36 起 ≥48h＝10-28 18:36 后，或 City3D 新 commit；漂移 >20% 注意）→ main#20 ABORT 观察位（出现即查改动来源，禁改基线抹平）。
3. **面板品质线（r690 新常态）**：`world-public/city-panel.html` 是本司唯一 CEO 可直接打开的产品面（`file://`）——改模板后必跑 `build-city-panel.ps1` 重建 + `node --check` 取 script 段 + `node logs/devloop-r690-panel-artifact-test.js` + 旧 10 套面板测试 + 全页截图（无头 Edge：`--headless=new --user-data-dir=<temp> --window-size=1400,3400 --screenshot`，共用 profile 会静默复用旧进程导致同字节旧图）入 `qa/`；自检 **13 项**须全绿；`file://` 协议在浏览器 MCP 被禁，取证一律走无头 Edge。
4. **explore#12 第 285 绪窗**：首选 JR/T 0025.12 现行层正身窗（queue #289·0025.x 族第三件）；备选②=0025.2018 第 12 部分③=0025.3 现行层④=GB/T 16649 族⑤=GB/T 18336 族。防重扫：0025.8/0090/0089.x/0098.x/0095/0097/0092 已闭卷。重笔轮防截杀律：产物落盘即 commit 产物壳·板面注记后补。
5. **新律承接（r666）·P-11 面**：跨轮写探针/改 schema 必须同窗内 commit 或先移出 Tools/perceptor+schema——否则 tick 每 10 分钟静默跳过 scan+verify 且不报红；巡检判「感知健康」看 scan: 行存在性。
6. main#7 charter 四锚仍缓判（后续里程碑面）；main#3 T-FV-141 提案位（周日演化日窗）；main#4 P3-002 每轮行检；真无活时一行声明合法（禁造活凑数）。
7. **归档面新常态（r683）**：§九 已收敛回 30 天窗；每月 1 日月界轮跑 `archive-section9.ps1`（先 -DryRun 后真跑），四门 g1-g4 全绿才算收口。
8. **常设收尾**：commit 前写 logs/devloop-face-content.json（六键）→ write-status-face.ps1 → FACE OK 才 commit；板面同步门=check-runbook-sync.ps1（SYNC 才 commit）；板面-§九 双账门 tasks-board-check.ps1（动板面必过）；commit pathspec 限定=commit 一次 -m 后 -- <本轮路径清单>；重产出轮 r593 债纪律「主件先 commit·板面注记后补」拆窗。
## 验收标准（怎么算完成）
实物优先计分（能跑能用=2／文件改动=1／纯记账=0）；动板面后 tasks-board-check.ps1 PASS 才 commit；commit=「DevLoop r<N>: …[via bm-a]」；未过门如实记未完成；等待态=一行声明收轮。