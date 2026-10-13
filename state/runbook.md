# FluxVerse DevLoop Runbook（启动首读面·Executive Protocol v1.0）

> <2KB 契约=..\..\docs\executive-protocol.md §1；进度唯一权威=TECH.md §九；收尾若「下一步」有变则更新本件（静轮免改）。

## 我是谁
超体宇宙城底座 DevLoop（Biggame 承建·bm-a 无人值守轮）；主线=City3D R2 模块壳（交互窗承建·其在飞件禁碰）。

## 我现在在干什么
r561 毕（FULL-ROUND 续领轮·1 分位）：主产出=explore#12 第 186 笔——R-20261014-city-weather-forecast-dissemination-compliance-benchmarks.md v1.0（真实天气入城/气象预报传播轴·r560 备选池双候选①兑现·**城本体线两连笔**：三源正身直取=气象法 2016 现行〔22 条统一发布制度+25 条传播要件+收益提取句+38 条罚则 ≤5 万〕+26 号令 2015 现行〔35 号令四部批名单排除双证·传播三要件=最新+署名+不改·逐件带独立罚则〕+27 号令 2020 修订〔备案制+合法渠道+18(一) 举证在用数方〕；**Open-Meteo 现行通道风险位勘注**〔reality-link 通道 5 域外源≠气象台站渠道·F-20261014-01 已呈〕+O-2026-0930-021 天气切片闸前置正主；坑录四=规章修订版坑第四例〔35 号令批名单排除法〕+「最新」法定要件坑+实况/预报两态混读坑+域外源双重坑）。防空转 24h 零分线 10-15 夜窗（末分 r561 10-14 夜窗）·48h 节律死线 10-16 03:0x（第 187 笔）。详账=TECH §九 r561 行。

## 下一步（队列头）
1. 轮首跑 Tools\devloop\check-fastpath.ps1：判读一律依 stdout `VERDICT:` 行字节（禁读 Exit Code 显示面·r293）；FASTPATH=队列取活（state/queue/{main,tech,explore}.md）→提案轨→一行声明；FULL-ROUND=按 mandate 读序施工。r561 收尾=tech_sha12 传棒 KEEP（§九 open 面：main#10 深潜核验位〔10-24〕+main#1 归档窗〔10-24〕+main#2/#3 演化日窗〔10-18〕+explore 被动族长列【#192 r561 气象预报传播轴→#191 r560 证券行情轴→#190 r559 人脸核验轴→…正身=state/queue/explore.md】→下轮④查 mismatch=全轮续领·r95 律）。
2. explore#12 第 187 笔窗（死线 10-16 03:0x·真缺口 grep 先行·无缺口不付笔·r533 判法）：**候选池=备选池②英烈保护轴为首选真缺口候选**（「英烈」全库零命中 r560 预验+r561 复验双证·英烈保护法+烈士名誉荣誉判例域）+新词族自掘面续扫（防重扫锚更新：**r561 气象预报传播域已闭+r560 证券行情展示/投资咨询边界域已闭+r559 人脸识别技术使用域已闭**+弃扫三族记录=杀熟/积分/格式条款+r558 押金/停收/30日公告/重大经营风险四族已闭+r557 弹窗/信息推送/一键关闭/弹出广告四族已闭+r556 退订/商业性信息族已闭+r555 自动续费/连续包月/盲盒/儿童个人信息族已闭+r554 城市复刻/建筑作品轴+r548 七族+f8/f9 域外+商标留观+文化费闭卷；弱族弃扫锚=数据出境/版号）+军事设施保护法禁区条文正身直取窗（低优·r554 snippet 级代偿在册）+r542 判决书直取窗（案号级零结果难点在册）+观察位新事件（r549 三新位：CJEU C-250/25/欧委会咨询 11-03/Getty 听证 2026-11+r551 三触发+文化费 2027 续期窗年检——只查新事件勿重扫老位）；坑律全表=rg 逐名短 pattern+语境行双验+登记语先占+三无噪源+对照门+同姓异案+数额指纹+漏见坑+跨阶段罪名漂移+进行态禁入+磨坊噪源+预定日≠已出+预算级次双变量+规章类必核修订版+samr URL 全路径+候选池条号漂移必正身核+候选池弃扫双验法（r559）+机密面≠许可面双面判读（r560）+域外源双重坑（r561 新沉淀）（详 TECH §九 r546~r561 行）。
3. main#5/#7 判④门槛未达（shots 判据帧未入库·交互窗在飞期禁动 City3D）；tech 队列常备=观察位族——真无活时一行声明合法（禁造活凑数）。
4. **常设收尾步**：commit 前写 logs/devloop-face-content.json（六键=updated_utc/current_activity/**artifact**/artifact_utc/**milestone**/milestone_eta_utc）→ powershell -NoProfile -ExecutionPolicy Bypass -File Tools\devloop\write-status-face.ps1 → FACE OK 才 commit（禁手写 state/status-face.json·r246）；**板面同步门**=Tools\devloop\check-runbook-sync.ps1（SYNC 才 commit）；**板面-§九 双账门**=Tools\devloop\tasks-board-check.ps1（动板面必过）；**commit pathspec 限定律**=commit 一律 -m 后 -- <本轮路径清单>（防吞交互窗 staged 面）。
## 验收标准（怎么算完成）
实物优先计分（能跑能用=2／文件改动=1／纯记账=0）；动板面后 Tools\devloop\tasks-board-check.ps1 PASS 才 commit；commit=「DevLoop r<N>: …[via bm-a]」；未过门=如实记未完成；等待态=一行声明收轮。
