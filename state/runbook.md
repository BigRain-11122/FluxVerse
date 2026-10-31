# FluxVerse DevLoop Runbook（启动首读面·Executive Protocol v1.0）
> <2KB 契约=..\..\docs\executive-protocol.md §1（历史轮长态放宽·紧凑执法）；进度唯一权威=TECH.md §九；收尾若「下一步」有变则更新本件（静轮免改）。
## 我是谁
超体宇宙城底座 DevLoop（Biggame 承建·bm-a 无人值守轮）；主线=City3D R2 模块壳（交互窗承建）＋CEO 唯一产品面 `world-public/city-panel.html`。
## 我现在在干什么
r714 毕（FULL-ROUND·triggers=c3/c4 传棒续领·产品面=落位诊断）：新增 `Tools/devloop/r2-site-check.py`——纯文本读 `CityWhitebox.unity`，解码场景内建水面网格（`L_Water`，2260 顶点）成精确三角形，再按 `CityRebuildR2.cs` 的 `gx/gz` 算街区真实占地。结论：街区 84.7×70.7 m **压水 91.7%**（点—三角精确复核 90.9%，差 0.9pp），最近**全干落位**＝城市局部 (0.3,83.2)／世界 (−89.6,−72.7)，距现位 83 m（另有 28,274 个候选）。**关键纠正**：水面不是 `td-organic-data.txt` 的 64×64 格网（8m/格映射过去街区 108 格零水格），r713 那条「按 organic 水域格选干地」作废。产物 `qa/site/r2-site-20261031-1610-bm-a.png`／`.md`；本轮**未动场景**（归 City3D 模块壳线）。
## 我现在在干什么（历史）
r713：城市取景改包围盒自适应机位（6 帧重拍，暴露街区落水域→立债 main#54）。r712：面板浸泡行改对基线读数（-32.7%／p95 +56.0%）＋修 `statusface: gate: FAIL`。r711：r710 产物复核上链＋修「跨轮单调」假红。r710：main#17 浸泡复跑＋main#49 六帧取景。
## 下一步（队列头）
1. 轮首跑 `Tools\devloop\check-fastpath.ps1`：FASTPATH=队列取活（`state/queue/{main,tech,explore}.md`）→提案轨→一行声明；FULL-ROUND=按 mandate 读序施工。r714 收尾=tech_sha12 传棒 KEEP（§九 open 可领面：main#23/#40/#52/#53/#55/main#33/#8/main#49 残留/#51/#20），ledger/dec/orders 刷现值。
2. **队列头=main#53 `logs/` 保留策略**（`>14d` 已 2,263 件，集团值守台账连续点名）：保留 7 天 tick 日志＋本轮 `run_*.log` 7 天，其余归档进 `logs/_archive/*.zip`（**不删**），判据 `>14d ≤200` 且 `qa/` 证据帧与近 7 天 tick 零丢失。
3. 随后 main#55 落位核验接 verify（§2d 出 `VERIFY HEALTH: r2-site: …` 一行＋三夹具）→ main#54 落位执行（**等 City3D 模块壳线裁「搬街区 vs 铺基台」**，本轮不出手）→ main#23 司级 7 天基准刷新（10-27 到期）→ main#40 冻结 fixture 重建 → main#33 状态档写入硬化 → main#8 城市线附卷（10-19 逾期）→ main#51 `narrow-shot.js` 残页（未复现·债不销）→ main#20 ABORT 观察位。
4. **main#52 空载复测仍跑不了**：`Get-Process Tuanjie` 实读 2 个（11:08 gui-agent 编辑器＋11:13 Cowork hub）；032 判据 `fps_avg≥486.8` 且 `p95≤2.58ms`。挑 0 进程窗口再跑，禁带载凑数。
5. **面板品质线（r690→r713 常态）**：改模板/builder 后必跑 `build-city-panel.ps1` + `node logs/devloop-r702-compile-check.js` + 四套 PS 闸（`test-city-shot-shape` 11／`test-city-shot-census` 18／`test-city-panel-proof` 17／`test-city-duty` 21）+ 全 **29 套** `powershell -File Tools\devloop\run-panel-suites.ps1`（exit 2=有失败）+ `node Tools/devloop/narrow-shot.js --width 390`（VERDICT 必须 OK）。改面部前先写 `logs/devloop-face-content.json` → `write-status-face.ps1` → 再重建（否则假红）。
   - **取景家族注册表**：只有 `city-`/`city3d-`/`smoke-`/`frame-`/`soak-` 开头的 `qa/` **顶层**图会被取景卡采用；示意图一律放 `qa/site/`（r714 新增），不许冒充城市帧。
6. **explore#12 第 286 绪窗**：首选 JR/T 0025.12 现行层（queue #289）；防重扫 0025.8/0090/0089.x/0098.x/0095/0097/0092 已闭卷。重笔轮产物落盘即 commit·板面注记后补。
7. **新律承接（r666）·P-11 面**：跨轮写探针/改 schema 必须同窗 commit 或先移出 `Tools/perceptor`+`schema`，否则 tick 静默跳过 scan+verify。
8. 真无活时一行声明合法（禁造活）；`main#7` charter 四锚缓判；`main#3` 提案位（周日演化日窗）；`main#4` 每轮 c2 行检；每月 1 日跑 `archive-section9.ps1`（先 -DryRun）。
9. **常设收尾**：`resolve-group-root.ps1` 解析 live 根再算三 sha → 写 `logs/devloop-face-content.json`（六键·路径写完整相对路径）→ `write-status-face.ps1`（FACE OK）→ `check-runbook-sync.ps1`（SYNC）→ 动板面则 `tasks-board-check.ps1`（PASS）→ pathspec 限定 commit → `write-fastpath-state.ps1` 重写状态档。
## 验收标准（怎么算完成）
实物优先计分（能跑能用=2／文件改动=1／纯记账=0）；动板面后 `tasks-board-check.ps1` PASS 才 commit；commit=「DevLoop r<N>: …[via bm-a]」；未过门如实记未完成；等待态=一行声明收轮。