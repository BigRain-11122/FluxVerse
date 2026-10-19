# FluxVerse DevLoop Runbook（启动首读面·Executive Protocol v1.0）

> <2KB 契约=..\..\docs\executive-protocol.md §1（历史轮长态放宽·紧凑执法）；进度唯一权威=TECH.md §九；收尾若「下一步」有变则更新本件（静轮免改）。

## 我是谁
超体宇宙城底座 DevLoop（Biggame 承建·bm-a 无人值守轮）；主线=City3D R2 模块壳（交互窗承建·其在飞件禁碰）。

## 我现在在干什么
r670 毕（FULL-ROUND 产品轮·triggers=c2 交互窗在飞件 8 件零接触+c4 传棒失配）：**主产出=城市面板「数据自检」卡**——六项全部由页内数据推导（必备节齐全/事件窗口与跨度/声明分区覆盖（声明外分区如实列出）/时间顺序/未来时间（阈值 快照+5 分钟）/快照龄），异常以「注意」如实露出、顶部徽标汇总 N 项通过/N 项注意。实证=重建 `PANEL OK bytes=21229`、桩 DOM 双样本渲染测试 8/8 PASS（真实快照 6 项通过；坏夹具 3 项注意=逆序/未来时间/时间不可解析）、无头 Edge 截图 qa/city-panel-r670.png 卡面六行在屏、覆盖行口径修正「声明分区 3/3 · 另有 governance」（首版 4/3 误读已修）。

## 我现在在干什么（历史）
r669 收口（FULL-ROUND 产品轮）：城市面板 v3=活动节律卡（近 12 小时逐时事件柱，锚=快照 ts_utc）+页面 60 秒自动重载；实证 bytes=18405、node 校验、qa/city-panel-r669.png、桩 DOM 9/9 PASS。
r668 收口（FULL-ROUND 产品轮·triggers=c2+c3/c4/c7）：**城市面板信息密度升级**——事件分布卡（按分区/按类型两族柱条，只统计窗口内 50 条）+事件尾流分区筛选 chips（全部/各分区计数，点击过滤并改标题计数 N/50）；实证重建 bytes=16295、node --check 通过、截图 qa/city-panel-r668.png、桩 DOM 11/11 PASS。
r666 收口（FULL-ROUND 修红轮·triggers=3）：**perceptor 感知链断供 95 轮修复**——病面=tick 连串 `backoff: perceptor stack dirty`（近 8 小时 scan+verify 全跳过）；根因=上一窗探针件落盘未 commit→步 0 脏树判据恒真（P-11 结构性自锁）；修法=探针契约复审+scan/verify 双绿+同窗 commit；判「感知健康」看 `scan:` 行存在性不看 gate=0。

## 下一步（队列头）
1. 轮首跑 Tools\devloop\check-fastpath.ps1：FASTPATH=队列取活（state/queue/{main,tech,explore}.md）→提案轨→一行声明；FULL-ROUND=按 mandate 读序施工。r670 收尾=tech_sha12 传棒 KEEP（§九 open 面：main#1〔10-24〕+main#2 benchmarks **已到期 10-18 待刷新轮**+main#3〔10-18〕+main#10〔10-24〕+main#8〔10-19 城市线附卷〕+queue #289=第 285 绪首选）→下轮④查 mismatch=全轮续领 r95 律。
2. **explore#12 第 285 绪窗（48h 钟 ~10-20 16:3x 承）：首选=JR/T 0025.12 现行层正身窗**（queue #289·0025.x 族消费面双点位第三件〔r656 0098.1+r661 0098.2/0089.2 消费锚〕·bzId 待探——cfstc 检索滚出法 r653 同式）；备选②=0025—2018 第 12 部分〔非接触式IC卡支付规范〕正身窗③=0025.3 现行层正身窗④=GB/T 16649 识别卡族观察位⑤=GB/T 18336 族观察位+金融族横向扩面候选池。防重扫锚=0025.8 双版全文级闭卷〔r663+r664〕+0090 全文〔r662〕+0089.x 双部〔r660/r661〕+0098.x 八席〔r649-r659〕+0095/0097〔r651/r652〕+0092 双版〔r653/r654〕。重笔轮防截杀律：产物落盘即 commit 产物壳·板面注记后补。
3. **新律承接（r666）·P-11 族**：跨轮写探针/改 schema 必须同窗落 commit 或先移出 `Tools/perceptor`+`schema`——否则 tick 每 10 分钟静默跳过 scan+verify 且不报红（雪花式静默故障）；巡检判「感知健康」看 `scan:` 行存在性，不看 gate=0。
4. main#5/#7 判④门槛未达（交互窗在飞期禁动 City3D·main#6 每轮一行注记）；main#4 P3-002 每轮行检；OH- 观察位 2 重评随消费窗；真无活时一行声明合法（禁造活凑数）。
5. **常设收尾步**：commit 前写 logs/devloop-face-content.json（六键）→ write-status-face.ps1 → FACE OK 才 commit；板面同步门=check-runbook-sync.ps1（SYNC 才 commit）；板面-§九 双账门=tasks-board-check.ps1（动板面必过）；commit pathspec 限定律=commit 一律 -m 后 -- <本轮路径清单>（防吞交互窗 staged 面）；重产出轮=r593 债纪律「主件先 commit·板面注记后补」拆窗。
## 验收标准（怎么算完成）
实物优先计分（能跑能用=2／文件改动=1／纯记账=0）；动板面后 tasks-board-check.ps1 PASS 才 commit；commit=「DevLoop r<N>: …[via bm-a]」；未过门=如实记未完成；等待态=一行声明收轮。