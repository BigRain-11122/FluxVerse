# FluxVerse DevLoop Runbook（启动首读面·Executive Protocol v1.0）

> <2KB 契约=..\..\docs\executive-protocol.md §1；进度唯一权威=TECH.md §九；收尾若「下一步」有变则更新本件（静轮免改）。

## 我是谁
超体宇宙城底座 DevLoop（Biggame 承建·bm-a 无人值守轮）；主线=City3D R2 模块壳（交互窗承建·其在飞件禁碰）。

## 我现在在干什么
r560 毕（FULL-ROUND 续领轮·1 分位）：主产出=explore#12 第 185 笔——R-20261014-city-securities-data-display-consulting-benchmarks.md v1.0（证券行情展示/投资咨询边界轴·r559 候选池新词族自掘面续扫第二笔·**城本体线**：正身①证监会〔2012〕40 号荐股软件规定九条 verbatim〔gov.cn 公报直取·现行版=2020-10-30 修订〔2020〕66 号·neris 现行有效实锚·delta 未逐字核验=注记级留痕〕——第一条豁免句=信息汇总+历史统计非荐股软件安全港〔K 线屏正主〕+第二条间接获利也算+第七条刑事移送；正身②sseinfo 行情许可经营面〔Level-1/Level-2/指数编制三族价目表〕；坑录四=规章修订版坑第三例+机密面≠许可面双面判读坑〔reality-link L56 勘注升级〕+许可主体名坑〔上证所信息网络≠交易所本体〕+公报公文条号格式坑；M2 K 线屏实现窗 explore#103 闸前置正主）。防空转 24h 零分线 10-15 03:3x（末分 r560 10-14 03:3x）·48h 节律死线 10-16 03:0x（第 186 笔）。详账=TECH §九 r560 行。

## 下一步（队列头）
1. 轮首跑 Tools\devloop\check-fastpath.ps1：判读一律依 stdout `VERDICT:` 行字节（禁读 Exit Code 显示面·r293）；FASTPATH=队列取活（state/queue/{main,tech,explore}.md）→提案轨→一行声明；FULL-ROUND=按 mandate 读序施工。r560 收尾=tech_sha12 传棒 KEEP（§九 open 面：main#10 深潜核验位〔10-24〕+main#1 归档窗〔10-24〕+main#2/#3 演化日窗〔10-18〕+explore 被动族长列【#191 r560 证券行情轴→#190 r559 人脸核验轴→#189 r558 押金/停收轴→…正身=state/queue/explore.md】→下轮④查 mismatch=全轮续领·r95 律）。
2. explore#12 第 186 笔窗（死线 10-16 03:0x·真缺口 grep 先行·无缺口不付笔·r533 判法）：**候选池=新词族自掘面续扫**（防重扫锚更新：**r560 证券行情展示/投资咨询边界域已闭+r559 人脸识别技术使用域已闭**+弃扫三族记录=杀熟/积分/格式条款+r558 押金/停收/30日公告/重大经营风险四族已闭+r557 弹窗/信息推送/一键关闭/弹出广告四族已闭+r556 退订/商业性信息族已闭+r555 自动续费/连续包月/盲盒/儿童个人信息族已闭+r554 城市复刻/建筑作品轴+r548 七族+f8/f9 域外+商标留观+文化费闭卷；弱族弃扫锚=数据出境/版号；**备选池双候选 r560 已预验**=气象预报传播轴〔真天气源接 O-20260930-021 承重·「气象」全库零命中〕+英烈保护轴〔「英烈」全库零命中〕）+军事设施保护法禁区条文正身直取窗（低优·r554 snippet 级代偿在册）+r542 判决书直取窗（案号级零结果难点在册）+观察位新事件（r549 三新位：CJEU C-250/25/欧委会咨询 11-03/Getty 听证 2026-11+r551 三触发+文化费 2027 续期窗年检——只查新事件勿重扫老位〔10-14 00:27 已维持〕）；坑律全表=rg 逐名短 pattern+语境行双验+登记语先占+三无噪源+对照门+同姓异案+数额指纹+漏见坑+跨阶段罪名漂移+进行态禁入+磨坊噪源+预定日≠已出+预算级次双变量+规章类必核修订版+samr URL 全路径+候选池条号漂移必正身核+候选池弃扫双验法（r559）+机密面≠许可面双面判读（r560 新沉淀）（详 TECH §九 r546~r560 行）。
3. main#5/#7 判④门槛未达（shots 判据帧未入库·交互窗在飞期禁动 City3D）；tech 队列常备=观察位族——真无活时一行声明合法（禁造活凑数）。
4. **常设收尾步**：commit 前写 logs/devloop-face-content.json（六键=updated_utc/current_activity/**artifact**/artifact_utc/**milestone**/milestone_eta_utc）→ powershell -NoProfile -ExecutionPolicy Bypass -File Tools\devloop\write-status-face.ps1 → FACE OK 才 commit（禁手写 state/status-face.json·r246）；**板面同步门**=Tools\devloop\check-runbook-sync.ps1（SYNC 才 commit）；**板面-§九 双账门**=Tools\devloop\tasks-board-check.ps1（动板面必过）；**commit pathspec 限定律**=commit 一律 -m 后 -- <本轮路径清单>（防吞交互窗 staged 面）。
## 验收标准（怎么算完成）
实物优先计分（能跑能用=2／文件改动=1／纯记账=0）；动板面后 Tools\devloop\tasks-board-check.ps1 PASS 才 commit；commit=「DevLoop r<N>: …[via bm-a]」；未过门=如实记未完成；等待态=一行声明收轮。
