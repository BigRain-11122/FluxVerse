# FluxVerse DevLoop Runbook（启动首读面·Executive Protocol v1.0）

> <2KB 契约=..\..\docs\executive-protocol.md §1；进度唯一权威=TECH.md §九；收尾若「下一步」有变则更新本件（静轮免改）。

## 我是谁
超体宇宙城底座 DevLoop（Biggame 承建·bm-a 无人值守轮）；主线=City3D R2 模块壳（交互窗承建·其在飞件禁碰）。

## 我现在在干什么
r528 毕（FULL-ROUND 续领轮·1 分位）：主产出=**explore#12 第 155 笔：虚拟数字人形象美术作品权属基准件**（R-20261013-virtual-event-digitalhuman-image-artwork-copyright-benchmarks.md v1.0·r526 池③兑现——北互八案案例七正主=某甲/某乙科技诉孙某某+模型网平台著作权权属侵权案：美术作品认定三件〔非真人来源+艺术加工+线条色彩形象设计独特美学选择〕+委托创作合同权属链〔实际制作方约定取得著作权+被许可人独占许可（除发表权署名权）+双主体诉权〕+内部人威胁线〔离职员工盗卖模型=侵权正主〕+平台免责五因素〔440 万粉形象平台仍「难以主动识别」〕+判赔 1.5 万〔甲 1 万/乙 5000·ciplawyer 面〕+二审维持；正身=北京日报北京号 2025-09-26 八案全文转载直取+ciplawyer 判赔分解+r525 §11 三方一致；城内六行=委托创作合同门/库内许可链分立行/独创性留痕行/首发登记行/内部人防护行/平台通知镜像行+J1-J3+坑首录两条；候选池回填=**案例八 AI 陪伴者真人形象人格权案=下一笔顺位**〔20.3 万实锚·正身已随来源①到手〕）。防空转 24h 零分线 10-14 18:0x·48h 节律死线 10-15 18:0x（时戳自纠：初稿预猜 21:5x 已按 face 机戳 18:04 勘正——实测钟律首案预纠）。详账=TECH §九 r528 行。

## 下一步（队列头）
1. 轮首跑 Tools\devloop\check-fastpath.ps1：判读一律依 stdout `VERDICT:` 行字节（禁读 Exit Code 显示面·r293 假显判例）；FASTPATH=队列取活（state/queue/{main,tech,explore}.md）→提案轨→一行声明；FULL-ROUND=按 mandate（Tools/devloop/iteration_prompt.txt）读序施工。r528 收尾=tech_sha12 传棒 KEEP（§九 open 面：main#10 深潜核验位〔10-24〕+main#1 归档窗〔10-24〕+main#2/#3 演化日窗〔10-18〕+explore 被动族长列【#164 r528 数字人形象权属轴↑#163 r527 换脸轴→#162 r526 声音权轴→#161 r525 视频轴→#160 r524 权属轴→#159 r523 内容刑事轴→#158 r522 投标获客轴→…正身=state/queue/explore.md】→下轮④查 mismatch=全轮续领·r95 律）。
2. explore#12 第 156 笔定位=新词族真缺口 grep（候选族=r528 池余项：**案例八 AI 陪伴者真人形象人格权案**〔北互八案案例八·何某案·20.3 万实锚·城 AI 居民人设面禁真人投射正主·正身已在北京日报转载面在档零再采成本〕/案例五唐某某案〔算法检测违约+说明义务·正身同在档·r527 池③升级〕/AI 音乐权属案〔r524 池②维持〕/公证存证〔全零轴维持〕/孙红雷台词声音权案〔判决书正身待直取〕/换脸刑事专项观察位〔维持〕；方法论=rg 逐名短 pattern+数字词族带语境复扫〔r521 坑〕+条号引用禁〔r522 坑〕+对照门必带+无缺口走 r479 终判条款诚实零付笔）；防空转 24h 零分线=10-14 18:0x（末分 r528 18:0x 1 分位）；T-FV-134/141=10-18 周日演化日窗（深扫+三句式提案正文待交·证据面=p3003 附录 §A~§F+资金流红线域族六柱+数据红线域族一柱+投标获客轴+内容刑事轴+AIGC 权属/视频/声音/换脸/数字人形象权属轴+四十二轴锚〔r528 数字人轴+1〕·判据=其 §D 三问锁用）。
3. main#5/#7 判④门槛未达（shots 判据帧未入库·交互窗在飞期禁动 City3D）；tech 队列常备=观察位族——真无活时一行声明合法（禁造活凑数）。
4. **常设收尾步**：commit 前写 logs/devloop-face-content.json（六键名=updated_utc/current_activity/**artifact**/artifact_utc/**milestone**/milestone_eta_utc——r524 近义键致 FAIL 实锚·勿再犯·updated_utc/artifact_utc 留空机器盖戳）→ powershell -NoProfile -ExecutionPolicy Bypass -File Tools\devloop\write-status-face.ps1 → FACE OK 才 commit（禁手写 state/status-face.json·r246）；**板面同步门**=Tools\devloop\check-runbook-sync.ps1（SYNC 才 commit）；**板面-§九 双账门**=Tools\devloop\tasks-board-check.ps1（动板面必过）；**commit pathspec 限定律**=commit 一律 -m 后 -- <本轮路径清单>（防吞交互窗 staged 面）。
## 验收标准（怎么算完成）
实物优先计分（能跑能用=2／文件改动=1／纯记账=0）；动板面后 Tools\devloop\tasks-board-check.ps1 PASS 才 commit；commit=「DevLoop r<N>: …[via bm-a]」；未过门=如实记未完成；等待态=一行声明收轮。
