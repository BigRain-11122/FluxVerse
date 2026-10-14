# FluxVerse DevLoop Runbook（启动首读面·Executive Protocol v1.0）

> <2KB 契约=..\..\docs\executive-protocol.md §1；进度唯一权威=TECH.md §九；收尾若「下一步」有变则更新本件（静轮免改）。

## 我是谁
超体宇宙城底座 DevLoop（Biggame 承建·bm-a 无人值守轮）；主线=City3D R2 模块壳（交互窗承建·其在飞件禁碰）。

## 我现在在干什么
r585 毕（FULL-ROUND 续领轮·triggers=3）：主产出=explore#12 第 209 笔——**CAC 简化措施规定定版翻面窗兑现**（queue#217 定版窗年检命中+queue#216 附件双表直取顺带闭·同窗双扣）：R-20261014-cac-small-processor-simplified-measures-regulation-benchmarks.md **v1.0→v1.1**（§十一 定版翻面节）——令第25号（网信办+公安部联合·2026-09-01 施行=v1.0「等定版窗」判态勘误·成稿时已施行 45 天）+定版八处实质 diff（民法典删/未成年人专门规则新/显著方式硬要求/**敏感推定机制废除·单独同意恢复**/平台豁免收紧+两款/无主观过错应当档+初次违法可以档/**21 条监督检查+信用档案公示全新**/停服主动删除先置）+条文重编号表（敏感条并入 7 条起 -1·总 22 恒）+计数方式官方正身收口（答记者问问 3 verbatim）+附件双表 PDF 直链 live（222,771B/10 页/6,729 字·自查表 24 项三态+评估表 5×3=城审计/PIA 物料模板正身）+junhe 两观察点翻面核+J1-J3 修订+坑 5-7+来源 4+回编 5。queue#216/#217 双行删。详账=TECH §九 r585 行。

## 下一步（队列头）
1. 轮首跑 Tools\devloop\check-fastpath.ps1：判读一律依 stdout `VERDICT:` 行字节（禁读 Exit Code 显示面·r293）；FASTPATH=队列取活（state/queue/{main,tech,explore}.md）→提案轨→一行声明；FULL-ROUND=按 mandate 读序施工。r585 收尾=tech_sha12 传棒 KEEP（§九 open 面：main#10 深潜核验位〔10-24〕+main#1 归档窗〔10-24〕+main#2/#3 演化日窗〔10-18〕+explore 被动族长列【#214 双件消费→#213 45404→…正身=state/queue/explore.md】→下轮④查 mismatch=全轮续领·r95 律）。
2. explore#12 第 210 笔窗（48h 钟重置 10-16 12:4x·r533 判法 grep 先行·无缺口不付笔）：候选①=**20261182 小型处理者指南征求意见稿全文直取窗**（std.samr 计划页**现活链**=https://std.samr.gov.cn/gb/search/gbDetailed?id=3AA8CAD0C99708EDE06397BE0A0AB8A1——r582 旧 id 4C30DC…+旧路 /gbSearch/ 双 404=轮换坑；页附件位征求意见稿.pdf+编制说明.pdf·下载页数/魔数双验 r568+镜像页数/字数 r581；意见窗=活窗城可提交意见）②=CAC 简化措施规定**定版后施行观察窗三候**（配套细则/执法首案/信用档案首案·新登记位）③=45404 监督机构域闭后新事件位；防重扫锚=**简化措施域 v1.1 已闭（现行态+附件双表+计数口径全收口——后续只查施行后三候）**+r582 双件域闭（20261182/20264755 年检位）+r581 45404 域闭+r580 标准/实践指南双件域闭+r578 备案名录域闭+r577 认证体系域闭+r576 标准合同域闭+r575 出境双件域闭+r574 审计域闭——观察位只查新事件勿重扫老位·全闭域族详单与坑律全表=TECH §九 r574~r585 行（python 全库 grep 逐名短 pattern r576 正法·双源下载页数/魔数双验 r568·镜像 PDF 必验页数/字数 r581 坑①·解读层=标注级引用纪律）。
3. main#5/#7 判④门槛未达（shots 判据帧未入库·交互窗在飞期禁动 City3D）；tech 队列常备=观察位族——真无活时一行声明合法（禁造活凑数）。
4. **常设收尾步**：commit 前写 logs/devloop-face-content.json（六键=updated_utc/current_activity/**artifact**/artifact_utc/**milestone**/milestone_eta_utc）→ powershell -NoProfile -ExecutionPolicy Bypass -File Tools\devloop\write-status-face.ps1 → FACE OK 才 commit（禁手写 state/status-face.json·r246）；**板面同步门**=Tools\devloop\check-runbook-sync.ps1（SYNC 才 commit）；**板面-§九 双账门**=Tools\devloop\tasks-board-check.ps1（动板面必过）；**commit pathspec 限定律**=commit 一律 -m 后 -- <本轮路径清单>（防吞交互窗 staged 面）。

## 验收标准（怎么算完成）
实物优先计分（能跑能用=2／文件改动=1／纯记账=0）；动板面后 Tools\devloop\tasks-board-check.ps1 PASS 才 commit；commit=「DevLoop r<N>: …[via bm-a]」；未过门=如实记未完成；等待态=一行声明收轮。
