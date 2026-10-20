# FluxVerse DevLoop Runbook（启动首读面·Executive Protocol v1.0）

> <2KB 契约=..\..\docs\executive-protocol.md §1（历史轮长态放宽·紧凑执法）；进度唯一权威=TECH.md §九；收尾若「下一步」有变则更新本件（静轮免改）。

## 我是谁
超体宇宙城底座 DevLoop（Biggame 承建·bm-a 无人值守轮）；主线=City3D R2 模块壳（交互窗承建·其在飞件禁碰）。

## 我现在在干什么
r674 毕（FULL-ROUND 产品轮·triggers=c2 交互窗在飞件零接触+c4 传棒失配）：**主产出=城市面板「24 小时趋势」折线卡（queue main#11）**——构建器新增 24h 窗口注入 `TREND`（`logs/panel-history.jsonl` 按快照时刻回看 24 小时），卡内提交/渲染/事件三条线各自量纲独立成带（左轴=各带最小/最大值、底部 UTC 起止+跨度+条数、恒定量居中平线），相邻间隔 >15 分钟判断档并以红虚线+提示行计数，覆盖不足 24 小时如实写「记录不足 24 小时：当前覆盖 X 小时」。新桩 DOM 测试 27/27（三条线逐点对账）+ r673 tick 测试 11/11 回归绿；重建 bytes=36708 trend=33；`qa/city-panel-r674.png` 两轮多模态复核（三线清晰/轴标签齐全/自检 9 项通过/零乱码零重叠）。队列 main#11/#12 销行，补 main#13（趋势末点一致自检）。

## 我现在在干什么（历史）
r673 收口（FULL-ROUND 产品轮·triggers=c2+c4+c6）：城市面板自检第九项「tick 覆盖」+ 自检卡说明改九项（新测 11/11）。
r672 收口（FULL-ROUND 产品轮·triggers=c2+c4）：城市面板「跨轮轨迹」+自检第八项「轨迹一致」（SERIES 注入·区间汇总+逐条增量徽标）+benchmarks v1.3 清账。
r671 收口（FULL-ROUND 产品轮）：跨轮对比卡+自检第七项「跨轮单调」（logs/panel-history.jsonl）。
r670 收口（FULL-ROUND 产品轮）：数据自检卡六项。
r669 收口（FULL-ROUND 产品轮）：活动节律卡+60 秒自跟随重载。

## 下一步（队列头）
1. 轮首跑 Tools\devloop\check-fastpath.ps1：FASTPATH=队列取活（state/queue/{main,tech,explore}.md）→提案轨→一行声明；FULL-ROUND=按 mandate 读序施工。r674 收尾=tech_sha12 传棒 KEEP（§九 open 面：main#1〔10-24〕+main#3〔10-18 提案〕+main#10〔10-24〕+main#8〔10-19 城市线附卷·逾期〕+main#13〔趋势末点一致自检·r674 补条〕+queue #289=第 285 绪首选）→下轮④查 mismatch=全轮续领 r95 律。
2. **main#2 benchmarks 已清账（r672 v1.3·下次到期 10-27·深潜 10-24）**；main#11 已交付（r674·24h 趋势卡三判据全过）；main#12 已销行；后续面板面首选=main#13（趋势末点一致自检·r674 判据在条内），次选=explore#12 第 285 绪。
3. **explore#12 第 285 绪窗（48h 钟 ~10-20 16:3x 承）：首选=JR/T 0025.12 现行层正身窗**（queue #289·0025.x 族消费面双点位第三件〔r656 0098.1+r661 0098.2/0089.2 消费锚〕·bzId 待探——cfstc 检索滚出法 r653 同式）；备选②=0025—2018 第 12 部分〔非接触式IC卡支付规范〕正身窗③=0025.3 现行层正身窗④=GB/T 16649 识别卡族观察位⑤=GB/T 18336 族观察位+金融族横向扩面候选池。防重扫锚=0025.8 双版全文级闭卷〔r663+r664〕+0090 全文〔r662〕+0089.x 双部〔r660/r661〕+0098.x 八席〔r649-r659〕+0095/0097〔r651/r652〕+0092 双版〔r653/r654〕。重笔轮防截杀律：产物落盘即 commit 产物壳·板面注记后补。
4. **新律承接（r666）·P-11 族**：跨轮写探针/改 schema 必须同窗落 commit 或先移出 `Tools/perceptor`+`schema`——否则 tick 每 10 分钟静默跳过 scan+verify 且不报红（雪花式静默故障）；巡检判「感知健康」看 `scan:` 行存在性，不看 gate=0。
5. main#5/#7 判④门槛未达（交互窗在飞期禁动 City3D·main#6 每轮一行注记）；main#4 P3-002 每轮行检；OH- 观察位 2 重评随消费窗；真无活时一行声明合法（禁造活凑数）。
6. **常设收尾步**：commit 前写 logs/devloop-face-content.json（六键）→ write-status-face.ps1 → FACE OK 才 commit；板面同步门=check-runbook-sync.ps1（SYNC 才 commit）；板面-§九 双账门=tasks-board-check.ps1（动板面必过）；commit pathspec 限定律=commit 一律 -m 后 -- <本轮路径清单>（防吞交互窗 staged 面）；重产出轮=r593 债纪律「主件先 commit·板面注记后补」拆窗。
## 验收标准（怎么算完成）
实物优先计分（能跑能用=2／文件改动=1／纯记账=0）；动板面后 tasks-board-check.ps1 PASS 才 commit；commit=「DevLoop r<N>: …[via bm-a]」；未过门=如实记未完成；等待态=一行声明收轮。