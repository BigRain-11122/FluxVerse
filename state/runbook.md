# FluxVerse DevLoop Runbook（启动首读面·Executive Protocol v1.0）

> <2KB 契约=..\..\docs\executive-protocol.md §1（历史轮长态放宽·紧凑执法）；进度唯一权威=TECH.md §九；收尾若「下一步」有变则更新本件（静轮免改）。

## 我是谁
超体宇宙城底座 DevLoop（Biggame 承建·bm-a 无人值守轮）；主线=City3D R2 模块壳（交互窗承建·其在飞件禁碰）。

## 我现在在干什么
r666 毕（FULL-ROUND 修红轮·triggers=3：c1=statusface stale 面〔r665 已自愈〕+c2=交互窗在飞件族 7 件零接触+c4=tech_sha12 失配）：**主产出=perceptor 感知链断供 95 轮修复**——病面=tick 日志连串 `backoff: perceptor stack dirty`（10-19 18:49 起 62+33 轮=近 8 小时 scan+verify 全跳过·城事件流/门禁/健康三面零更新）；根因=上一窗把 BigStream 城桥探针 `probes/bigstream_city_events.ps1` 与 TECH 登记行落盘但未 commit→tick.ps1 步 0 脏树判据恒真→退避结构性自锁；修法=探针八律契约复审→scan+verify 双绿实证（27 探针全 OK·events +226·quarantined=0·verify PASS）→探针+登记行落 commit；登记行位勘正=原行误落「§十 溯源」且反引号转义损坏→正身移入 §九（r666 行）+§十 原件移除。探针真发射实证=outbox 两行消费（cursor `bscev:15f685fccd022b40`/`bscev:c439e3b4b9df881f`）+live stream 三条 MEDIA_OUTPUT（ts_utc=2026-10-19T18:42:11Z）。

## 下一步（队列头）
1. 轮首跑 Tools\devloop\check-fastpath.ps1：FASTPATH=队列取活（state/queue/{main,tech,explore}.md）→提案轨→一行声明；FULL-ROUND=按 mandate 读序施工。r666 收尾=tech_sha12 传棒 KEEP（§九 open 面：main#1〔10-24〕+main#2/#3〔10-18〕+main#10〔10-24〕+main#8〔10-19 城市线附卷〕+**queue #289=第 285 绪首选**）→下轮④查 mismatch=全轮续领 r95 律。
2. **explore#12 第 285 绪窗（48h 钟 ~10-20 16:3x 承）：首选=JR/T 0025.12 现行层正身窗**（queue #289·0025.x 族消费面双点位第三件〔r656 0098.1+r661 0098.2/0089.2 消费锚〕·bzId 待探——cfstc 检索滚出法 r653 同式）；备选②=0025—2018 第 12 部分〔非接触式IC卡支付规范〕正身窗③=0025.3 现行层正身窗④=GB/T 16649 识别卡族观察位⑤=GB/T 18336 族观察位+金融族横向扩面候选池。防重扫锚=0025.8 双版全文级闭卷〔r663+r664〕+0090 全文〔r662〕+0089.x 双部〔r660/r661〕+0098.x 八席〔r649-r659〕+0095/0097〔r651/r652〕+0092 双版〔r653/r654〕。重笔轮防截杀律：产物落盘即 commit 产物壳·板面注记后补。
3. **新律承接（r666）·P-11 族**：跨轮写探针/改 schema 必须同窗落 commit 或先移出 `Tools/perceptor`+`schema`——否则 tick 每 10 分钟静默跳过 scan+verify 且不报红（雪花式静默故障）；巡检判「感知健康」看 `scan:` 行存在性，不看 gate=0。
4. main#5/#7 判④门槛未达（交互窗在飞期禁动 City3D·main#6 每轮一行注记）；main#4 P3-002 每轮行检；OH- 观察位 2 重评随消费窗；真无活时一行声明合法（禁造活凑数）。
5. **常设收尾步**：commit 前写 logs/devloop-face-content.json（六键）→ write-status-face.ps1 → FACE OK 才 commit；板面同步门=check-runbook-sync.ps1（SYNC 才 commit）；板面-§九 双账门=tasks-board-check.ps1（动板面必过）；commit pathspec 限定律=commit 一律 -m 后 -- <本轮路径清单>（防吞交互窗 staged 面）；重产出轮=r593 债纪律「主件先 commit·板面注记后补」拆窗。
## 验收标准（怎么算完成）
实物优先计分（能跑能用=2／文件改动=1／纯记账=0）；动板面后 tasks-board-check.ps1 PASS 才 commit；commit=「DevLoop r<N>: …[via bm-a]」；未过门=如实记未完成；等待态=一行声明收轮。