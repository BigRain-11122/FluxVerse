# FluxVerse DevLoop Runbook（启动首读面·Executive Protocol v1.0）
> <2KB 契约=..\..\docs\executive-protocol.md §1（历史轮长态放宽·紧凑执法）；进度唯一权威=TECH.md §九；收尾若「下一步」有变则更新本件（静轮免改）。
## 我是谁
超体宇宙城底座 DevLoop（Biggame 承建·bm-a 无人值守轮）；主线=City3D R2 模块壳（交互窗承建）＋CEO 唯一产品面 `world-public/city-panel.html`。
## 我现在在干什么
r721 毕（FULL-ROUND·triggers=1 c4-tech·产品面=街区搬上干地，面板取景卡直接可见）：main#54 收口——`CityRebuildR2.Run()` 新建 R2 根后按 `City3D-staging/rehearsal-anchor.txt` 定 `localPosition=(0.3, 0, 83.2)`（r714 全干锚点 A1，缺档回落常量并记 `source=fallback`）；`r2-site-check.py` 不再假设「街区在原点」，新增 `district_local_from_scene()` 直读已建场景 Transform（优先级 被测场景→`City3D/Assets/Scenes/CityRebuild_R2.unity`→锚点文件→原点），实测压水 **91.7% → 0.0%**（互校 0.0%、最近干地 0 m），verify §2d 每 tick 转 `VERIFY HEALTH`，面板「街区落位」行转绿。`test-verify-r2-site.ps1` **18/18**（新增 e 组＋live 硬锁翻成干地）+ 新单测 `test-r2-district-local.py` **6/6**；`r2-ignite.ps1` 重建 `R2_EXIT=0 WALL_S=40 SHOTS=5/5`；`city3d-shots.ps1` 重拍 6 帧；全 29 套 ALL PASS、`COMPILE OK`、1400/390 宽 offenders=0，截图 `qa/city-panel-r721-bm-a.png`。
## 我现在在干什么（历史）
r720：面板「运行维护」行印日志归档日更状态（只读日戳，不读 tick 日志）。r719：`log-archive-duty.ps1` 让归档每天自跑一次（`ARCHIVE SUMMARY` 单源＋verify §2e，积压只 WARN）。r718：街区搬迁预演只出图不存盘，A1 压水 0.0%／对照图 `qa/site/r2-reloc-A1-20261031-1612-bm-a-compare.jpg`。r717：面板「街区落位」行印压水 91.7%／最近干地 83 m（判据单源 `Tools/devloop/site-verdict.ps1`）。r716：落位核验接进巡检（verify §2d）。r715：`logs/` 14 天归档落地（2,174 件入 zip）。
## 下一步（队列头）
1. 轮首跑 `Tools\devloop\check-fastpath.ps1`：FASTPATH=队列取活（`state/queue/{main,tech,explore}.md`）→提案轨→一行声明；FULL-ROUND=按 mandate 读序施工。r721 收尾=tech_sha12 传棒 KEEP（§九 open 可领面：main#23/#40/#33/#8/main#49 残留/#51/#20/#60/#61），ledger/dec/orders 刷现值。
2. **队列头=main#23 司级 7 天基准刷新（10-27 到期·已逾期 5 日）**→ main#40 冻结 fixture 重建（面板 r671 现在测的是 10-20 的旧模板）→ main#60 街面帧黑侧墙归因 → main#61 街区尺度复核 → main#33 状态档写入硬化 → main#8 城市线附卷（10-19 逾期）→ main#51 `narrow-shot.js` 残页（未复现·债不销）→ main#20 ABORT 观察位。
3. **main#52 空载复测仍跑不了**：`Get-Process Tuanjie` 实读 2 个（gui-agent 编辑器＋Cowork hub）；032 判据 `fps_avg≥486.8` 且 `p95≤2.58ms`。挑 0 进程窗口再跑，禁带载凑数。
4. **面板品质线（r690→r713 常态）**：改模板/builder 后必跑 `build-city-panel.ps1` + `node logs/devloop-r702-compile-check.js` + 四套 PS 闸（`test-city-shot-shape` 11／`test-city-shot-census` 18／`test-city-panel-proof` 17／`test-city-duty` 32）+ 全 **29 套** `powershell -File Tools\devloop\run-panel-suites.ps1`（exit 2=有失败）+ `node Tools/devloop/narrow-shot.js --width 390`（VERDICT 必须 OK）。改面部前先写 `logs/devloop-face-content.json` → `write-status-face.ps1` → 再重建（否则假红）。
   - **取景家族注册表**：只有 `city-`/`city3d-`/`smoke-`/`frame-`/`soak-` 开头的 `qa/` **顶层**图会被取景卡采用；示意图一律放 `qa/site/`（r714 新增），不许冒充城市帧。
5. **explore#12 第 286 绪窗**：首选 JR/T 0025.12 现行层（queue #289）；防重扫 0025.8/0090/0089.x/0098.x/0095/0097/0092 已闭卷。重笔轮产物落盘即 commit·板面注记后补。
6. **新律承接（r666）·P-11 面**：跨轮写探针/改 schema 必须同窗 commit 或先移出 `Tools/perceptor`+`schema`，否则 tick 静默跳过 scan+verify。
7. 真无活时一行声明合法（禁造活）；`main#7` charter 四锚缓判；`main#3` 提案位（周日演化日窗）；`main#4` 每轮 c2 行检；每月 1 日跑 `archive-section9.ps1`（先 -DryRun）。
8. **常设收尾**：`resolve-group-root.ps1` 解析 live 根再算三 sha → 写 `logs/devloop-face-content.json`（六键·路径写完整相对路径）→ `write-status-face.ps1`（FACE OK）→ `check-runbook-sync.ps1`（SYNC）→ 动板面则 `tasks-board-check.ps1`（PASS）→ pathspec 限定 commit → `write-fastpath-state.ps1` 重写状态档。
## 验收标准（怎么算完成）
实物优先计分（能跑能用=2／文件改动=1／纯记账=0）；动板面后 `tasks-board-check.ps1` PASS 才 commit；commit=「DevLoop r<N>: …[via bm-a]」；未过门如实记未完成；等待态=一行声明收轮。