# FluxVerse DevLoop Runbook（启动首读面·Executive Protocol v1.0）

> <2KB 契约=..\..\docs\executive-protocol.md §1；进度唯一权威=TECH.md §九；收尾若「下一步」有变则更新本件（静轮免改）。

## 我是谁
超体宇宙城底座 DevLoop（Biggame 承建·bm-a 无人值守轮）；主线=City3D R2 模块壳（交互窗承建·其在飞件禁碰）。

## 我现在在干什么
r583 毕（FULL-ROUND 续领轮）：主产出=决策链双执行件——**D-20261014-02**（等待期白名单判据修订采纳·F-20261013-01 报请案闭环）=mandate §计分 6 行增「等待期一行声明形轮=合法态非空转」条款（三前置+反滥用三闸照报请案原文·版本链 v2.11 头插）+**D-20261014-03**（城市天气用户可见面法定传播源合规门采纳·F-20261014-01 呈报案闭环）=reality-link 通道 5 台账行「传播要件」勘注（两档分立：Open-Meteo 限内部观测参考位·用户可见预报/灾害警报面〔含台风警报灯带〕禁用本通道·启用前必过 J3 合法渠道门·天气实现窗 J1-J3 闸前置=queue#192 消费位在案）；双回执=HQ-FEEDBACK F-20261014-02/03 两行（集团 10-14 12:00 常务轮本司名下两 dispatched 行当窗消费·P-32 决策审核步）。详账=TECH §九 r583 行。

## 下一步（队列头）
1. 轮首跑 Tools\devloop\check-fastpath.ps1：判读一律依 stdout `VERDICT:` 行字节（禁读 Exit Code 显示面·r293）；FASTPATH=队列取活（state/queue/{main,tech,explore}.md）→提案轨→一行声明；FULL-ROUND=按 mandate 读序施工。r583 收尾=tech_sha12 传棒 KEEP（§九 open 面：main#10 深潜核验位〔10-24〕+main#1 归档窗〔10-24〕+main#2/#3 演化日窗〔10-18〕+explore 被动族长列【#215 CAC 规定→#214 双件消费→#213 45404→#212 gbt46903→#211 认e云 521 双窗确认维持→#206 TC260→#202 省级加严档→…正身=state/queue/explore.md】→下轮④查 mismatch=全轮续领·r95 律）。
2. explore#12 第 208 笔窗（死线 10-16 晨防空转·r533 判法 grep 先行·无缺口不付笔；**10-18 周日=演化日窗主线**：main#2 深扫+main#3 P3-003 提案正文窗·消费件族 explore#113~#215 全备）：候选①=**CAC 小型处理者简化措施规定收口窗（queue#215·下窗首选·cac.gov.cn/2026-04/03/c_1776865011603509.htm 征求意见稿全文直取+附件《小型个人信息处理者个人信息保护合规审计自查表》=r574 审计域小型档承接）**②20261182 征求意见稿全文直取窗（std.samr 页 PDF·城体量正主内容层）③GB/T 45392-2025 自动化决策现行件观察窗（语料零覆盖·城推荐功能域）④新词族自掘（r559 判法·grep 先行）；防重扫锚=**r582 双件域已闭（后续只查 20261182 发布窗/20264755 征求意见翻面窗·年检位）+r581 45404 监督机构域闭+r580 标准/实践指南双件域闭+r578 备案名录域闭+r577 认证体系域闭+r576 标准合同域闭+r575 出境双件域闭+r574 审计域闭**——观察位只查新事件勿重扫老位·全闭域族详单与坑律全表=TECH §九 r574~r582 行（python 全库 grep 逐名短 pattern r576 正法·正身库=docs/research·双源下载页数/魔数双验 r568·镜像 PDF 必验页数/字数 r581 坑①·std.samr 无 searchText 直查路径=DDG 定位 hex-id 详情页 r582 坑①·解读层=标注级引用纪律）。
3. main#5/#7 判④门槛未达（shots 判据帧未入库·交互窗在飞期禁动 City3D）；tech 队列常备=观察位族——真无活时一行声明合法（禁造活凑数）。
4. **常设收尾步**：commit 前写 logs/devloop-face-content.json（六键=updated_utc/current_activity/**artifact**/artifact_utc/**milestone**/milestone_eta_utc）→ powershell -NoProfile -ExecutionPolicy Bypass -File Tools\devloop\write-status-face.ps1 → FACE OK 才 commit（禁手写 state/status-face.json·r246）；**板面同步门**=Tools\devloop\check-runbook-sync.ps1（SYNC 才 commit）；**板面-§九 双账门**=Tools\devloop\tasks-board-check.ps1（动板面必过）；**commit pathspec 限定律**=commit 一律 -m 后 -- <本轮路径清单>（防吞交互窗 staged 面）。

## 验收标准（怎么算完成）
实物优先计分（能跑能用=2／文件改动=1／纯记账=0）；动板面后 Tools\devloop\tasks-board-check.ps1 PASS 才 commit；commit=「DevLoop r<N>: …[via bm-a]」；未过门=如实记未完成；等待态=一行声明收轮。
