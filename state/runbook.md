# FluxVerse DevLoop Runbook（启动首读面·Executive Protocol v1.0）

> <2KB 契约=..\..\docs\executive-protocol.md §1（历史轮长态放宽·紧凑执法）；进度唯一权威=TECH.md §九；收尾若「下一步」有变则更新本件（静轮免改）。

## 我是谁
超体宇宙城底座 DevLoop（Biggame 承建·bm-a 无人值守轮）；主线=City3D R2 模块壳（交互窗承建·其在飞件禁碰）。

## 我现在在干什么
r677 毕（FULL-ROUND 产品轮·triggers=c1 面部陈旧 143h+c2 编年史两档 staged+c3/c6/c7 三面 SHA 变〔零 @FluxVerse 新件〕）：**主产出=城市面板趋势卡「末值标注自适应」（queue main#15 销行）**——右侧留白按最长末值位数动态算（≤5 位沿用 44px 像素级不变，6/7 位自动加宽），六位以上大数不再贴右缘；新测 28/28、十套面板测试合计 160 项全绿；重建 bytes=55928；`qa/city-panel-r677.png` 复核=三条末值标注均在卡内+十项自检全通过，`qa/city-panel-r677-fixture7d.png` 七位夹具标注 1234567 完整在框且该夹具的「趋势末点」自检如实报 1 项注意。**红修**=status-face 陈旧 143h→面部全量重写（FACE OK）+新鲜度门复验 fresh age_h=0。治理留痕=F-20261026-01（10-23 起 tick 自恢复但 orders 无复产口令行）。

## 我现在在干什么（历史）
r676 收口：城市面板趋势卡「末值标注」（main#14·18/18 新测·132 项）。
r675 收口：面板自检第十项「趋势末点」+四套旧测试硬编码项数根治（15/15·114 项）。
r674 收口：城市面板「24 小时趋势」三带折线卡（main#11·27/27 新测·bytes=36708）。
r673 收口：城市面板自检第九项「tick 覆盖」+自检卡说明改九项（新测 11/11）。
r672 收口：城市面板「跨轮轨迹」+自检第八项「轨迹一致」+benchmarks v1.3 清账。

## 下一步（队列头）
1. 轮首跑 Tools\devloop\check-fastpath.ps1：FASTPATH=队列取活（state/queue/{main,tech,explore}.md）→提案轨→一行声明；FULL-ROUND=按 mandate 读序施工。r677 收尾=四键全重写（§九 open 面：main#1 归档〔10-24 已到期〕+main#3〔10-18 提案〕+main#8〔10-19 城市线附卷·逾期〕+main#10〔benchmarks 深潜 10-24 已到期〕+queue #289=第 285 绪首选·无自家可续领链不传棒）。
2. **面板面下一条=main#16 自检第十一项「面部新鲜度」**（把车道静默搬到面板可见面）；时窗/逾期件优先序=main#1 月度归档（已到期）>main#10 benchmarks 深潜核验（已到期）>main#8 附卷（逾期）。
3. **explore#12 第 285 绪窗（48h 钟 ~10-20 16:3x 承）：首选=JR/T 0025.12 现行层正身窗**（queue #289·0025.x 族消费面双点位第三件〔r656 0098.1+r661 0098.2/0089.2 消费锚〕·bzId 待探——cfstc 检索滚出法 r653 同式）；备选②=0025—2018 第 12 部分〔非接触式IC卡支付规范〕正身窗③=0025.3 现行层正身窗④=GB/T 16649 识别卡族观察位⑤=GB/T 18336 族观察位+金融族横向扩面候选池。防重扫锚=0025.8 双版全文级闭卷〔r663+r664〕+0090 全文〔r662〕+0089.x 双部〔r660/r661〕+0098.x 八席〔r649-r659〕+0095/0097〔r651/r652〕+0092 双版〔r653/r654〕。重笔轮防截杀律：产物落盘即 commit 产物壳·板面注记后补。
4. **新律承接（r666）·P-11 族**：跨轮写探针/改 schema 必须同窗落 commit 或先移出 `Tools/perceptor`+`schema`——否则 tick 每 10 分钟静默跳过 scan+verify 且不报红（雪花式静默故障）；巡检判「感知健康」看 `scan:` 行存在性，不看 gate=0。
5. main#5/#7 判④门槛未达（交互窗在飞期禁动 City3D·main#6 每轮一行注记）；main#4 P3-002 每轮行检；OH- 观察位 2 重评随消费窗；真无活时一行声明合法（禁造活凑数）。
6. **常设收尾步**：commit 前写 logs/devloop-face-content.json（六键）→ write-status-face.ps1 → FACE OK 才 commit；板面同步门=check-runbook-sync.ps1（SYNC 才 commit）；板面-§九 双账门=tasks-board-check.ps1（动板面必过）；commit pathspec 限定律=commit 一律 -m 后 -- <本轮路径清单>（防吞交互窗 staged 面）；重产出轮=r593 债纪律「主件先 commit·板面注记后补」拆窗。
## 验收标准（怎么算完成）
实物优先计分（能跑能用=2／文件改动=1／纯记账=0）；动板面后 tasks-board-check.ps1 PASS 才 commit；commit=「DevLoop r<N>: …[via bm-a]」；未过门=如实记未完成；等待态=一行声明收轮。