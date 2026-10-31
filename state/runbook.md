# FluxVerse DevLoop Runbook（启动首读面·Executive Protocol v1.0）
> <2KB 契约=..\..\docs\executive-protocol.md §1（历史轮长态放宽·紧凑执法）；进度唯一权威=TECH.md §九；收尾若「下一步」有变则更新本件（静轮免改）。
## 我是谁
超体宇宙城底座 DevLoop（Biggame 承建·bm-a 无人值守轮）；主线=City3D R2 模块壳（交互窗承建）＋CEO 唯一产品面 `world-public/city-panel.html`。
## 我现在在干什么
r719 毕（FULL-ROUND·triggers=2 c2-tree/c4-tech·产品面=维护面自动化）：main#56 收口——日志归档从「手动清一次」变成巡检每天自己跑的职责。新件 `Tools/devloop/log-archive-duty.ps1`（`Invoke-LogArchiveDuty`：进程内调归档器，每个日历日至多真跑一次，日戳 `logs/.archive-duty-last-run.txt`，**成功才盖章**→失败当天下一 tick 重试）；`archive-logs.ps1` 增机器行 `ARCHIVE SUMMARY: candidates/archived/remain_archivable/verdict`（单一数字源，零/干跑/失败三路径都写）＋测试钩 `-SimulateVerifyMismatch`；`verify.ps1` 新 §2e 每 tick 一行 `VERIFY HEALTH: log-archive: ran|skipped(...) …`，积压 >200 或没跑完只转 WARN（永不 FAIL、无 FAIL 词根），跳过日不递归扫、积压值标 `(last)`。沙盒 `test-log-archive-duty.ps1` **22/22**、`test-verify-r2-site.ps1` 16/16、`test-verify-path-census.ps1` 15/15。真机首跑 `ran candidates=4 archived=4 remain_archivable=0`，第二跑 `skipped(already-ran-today)`。顺手把 r718 预演留在 `City3D-staging/shots/R2R_A1_*.png` 的三张原帧按先例入仓（止住每轮 c2-tree 假全轮）。
## 我现在在干什么（历史）
r718：街区搬迁预演只出图不存盘，A1 压水 0.0%／对照图 `qa/site/r2-reloc-A1-20261031-1612-bm-a-compare.jpg`（`--offset` 复算口径）。r717：面板「街区落位」行印压水 91.7%／最近干地 83 m（判据单源 `Tools/devloop/site-verdict.ps1`）。r716：落位核验接进巡检（verify §2d）。r715：`logs/` 14 天归档落地（2,174 件入 zip）。
## 下一步（队列头）
1. 轮首跑 `Tools\devloop\check-fastpath.ps1`：FASTPATH=队列取活（`state/queue/{main,tech,explore}.md`）→提案轨→一行声明；FULL-ROUND=按 mandate 读序施工。r719 收尾=tech_sha12 传棒 KEEP（§九 open 可领面：main#59/#54/#23/#40/#33/#8/main#49 残留/#51/#20），ledger/dec/orders 刷现值。
2. **队列头=main#59 面板「运行维护」行**（读 `logs/.archive-duty-last-run.txt` 印「今日已归档 · 积压 N」／缺档＝「今天未跑」，不抢读 tick 日志）→ 随后 main#54 落位修正（决策输入已齐：`qa/site/r2-reloc-A1-20261031-1612-bm-a-compare.jpg` 对照件＋`--offset` 复算口径，归 City3D 模块壳线）→ main#23 司级 7 天基准刷新（10-27 到期）→ main#40 冻结 fixture 重建 → main#33 状态档写入硬化 → main#8 城市线附卷（10-19 逾期）→ main#51 `narrow-shot.js` 残页（未复现·债不销）→ main#20 ABORT 观察位。
3. **main#52 空载复测仍跑不了**：`Get-Process Tuanjie` 实读 2 个（gui-agent 编辑器＋Cowork hub）；032 判据 `fps_avg≥486.8` 且 `p95≤2.58ms`。挑 0 进程窗口再跑，禁带载凑数。
4. **面板品质线（r690→r713 常态）**：改模板/builder 后必跑 `build-city-panel.ps1` + `node logs/devloop-r702-compile-check.js` + 四套 PS 闸（`test-city-shot-shape` 11／`test-city-shot-census` 18／`test-city-panel-proof` 17／`test-city-duty` 21）+ 全 **29 套** `powershell -File Tools\devloop\run-panel-suites.ps1`（exit 2=有失败）+ `node Tools/devloop/narrow-shot.js --width 390`（VERDICT 必须 OK）。改面部前先写 `logs/devloop-face-content.json` → `write-status-face.ps1` → 再重建（否则假红）。
   - **取景家族注册表**：只有 `city-`/`city3d-`/`smoke-`/`frame-`/`soak-` 开头的 `qa/` **顶层**图会被取景卡采用；示意图一律放 `qa/site/`（r714 新增），不许冒充城市帧。
5. **explore#12 第 286 绪窗**：首选 JR/T 0025.12 现行层（queue #289）；防重扫 0025.8/0090/0089.x/0098.x/0095/0097/0092 已闭卷。重笔轮产物落盘即 commit·板面注记后补。
6. **新律承接（r666）·P-11 面**：跨轮写探针/改 schema 必须同窗 commit 或先移出 `Tools/perceptor`+`schema`，否则 tick 静默跳过 scan+verify。
7. 真无活时一行声明合法（禁造活）；`main#7` charter 四锚缓判；`main#3` 提案位（周日演化日窗）；`main#4` 每轮 c2 行检；每月 1 日跑 `archive-section9.ps1`（先 -DryRun）。
8. **常设收尾**：`resolve-group-root.ps1` 解析 live 根再算三 sha → 写 `logs/devloop-face-content.json`（六键·路径写完整相对路径）→ `write-status-face.ps1`（FACE OK）→ `check-runbook-sync.ps1`（SYNC）→ 动板面则 `tasks-board-check.ps1`（PASS）→ pathspec 限定 commit → `write-fastpath-state.ps1` 重写状态档。
## 验收标准（怎么算完成）
实物优先计分（能跑能用=2／文件改动=1／纯记账=0）；动板面后 `tasks-board-check.ps1` PASS 才 commit；commit=「DevLoop r<N>: …[via bm-a]」；未过门如实记未完成；等待态=一行声明收轮。