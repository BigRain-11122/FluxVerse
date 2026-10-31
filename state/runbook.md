# FluxVerse DevLoop Runbook（启动首读面·Executive Protocol v1.0）
> <2KB 契约=..\..\docs\executive-protocol.md §1（历史轮长态放宽·紧凑执法）；进度唯一权威=TECH.md §九；收尾若「下一步」有变则更新本件（静轮免改）。
## 我是谁
超体宇宙城底座 DevLoop（Biggame 承建·bm-a 无人值守轮）；主线=City3D R2 模块壳（交互窗承建）＋CEO 唯一产品面 `world-public/city-panel.html`。
## 我现在在干什么
r715 毕（FULL-ROUND·triggers=c4 传棒续领·产品面=日志保留策略落地）：`logs/` 只增不减（集团值守台账 10-29 点名 1,786 件 >14d）一次性治愈。新增 `Tools/devloop/archive-logs.ps1`（候选＝14 天前、非 git-tracked、非代码扩展名、非 `*.lock`、非 `_archive`；按月分卷 zip 落 `logs/_archive/`；**删前逐条比 zip 条目长度**，任何一条不符＝整卷不删 exit 2）＋沙盒 `Tools/devloop/test-archive-logs.ps1` **29/29**。真机执行：**2,174 件 / 43.6 MB** 入一卷 `logs-202610-part00-20261031-1543.zip`（压缩 34.7 MB），删后**全量 CRC 复验 2174/2174 bad=0**；`>14d` **2,266 → 92**（92 件全是保护面：57 个 tracked 沙盒脚本＋代码扩展名＋2 枚 lock），零丢失旁证＝近 7 天 tick 7/7／`qa/` 91/91／tracked logs 57/57，面板重建 `PANEL OK art_missing=0 tick=2min`。新债 main#56＝归档未周期化。
## 我现在在干什么（历史）
r714：新增 `Tools/devloop/r2-site-check.py` 纯文本解码场景水面网格，算出街区压水 91.7%＋最近全干落位 83 m（`qa/site/r2-site-20261031-1610-bm-a.png`／`.md`），未动场景。r713：取景改包围盒自适应机位（6 帧重拍，暴露街区落水域→立债 main#54）。r712：面板浸泡行改对基线读数（-32.7%／p95 +56.0%）＋修 `statusface: gate: FAIL`。r711：r710 产物复核上链＋修「跨轮单调」假红。r710：main#17 浸泡复跑＋main#49 六帧取景。
## 下一步（队列头）
1. 轮首跑 `Tools\devloop\check-fastpath.ps1`：FASTPATH=队列取活（`state/queue/{main,tech,explore}.md`）→提案轨→一行声明；FULL-ROUND=按 mandate 读序施工。r715 收尾=tech_sha12 传棒 KEEP（§九 open 可领面：main#55/#23/#40/#33/#8/main#49 残留/#51/#20/#56），ledger/dec/orders 刷现值。
2. **队列头=main#55 `r2-site-check.py` 接进 verify 巡检**（`Tools/perceptor/verify.ps1` §2d 出 `VERIFY HEALTH: r2-site: block_water=…% dry_candidates=…` 一行＋三夹具：干地→绿／压水>50%→WARN 点名／场景缺档→WARN 不抛）。
3. 随后 main#56 归档周期化（接 tick 或每日轮，失败只 WARN）→ main#23 司级 7 天基准刷新（10-27 到期）→ main#40 冻结 fixture 重建 → main#33 状态档写入硬化 → main#8 城市线附卷（10-19 逾期）→ main#51 `narrow-shot.js` 残页（未复现·债不销）→ main#20 ABORT 观察位。
4. **main#52 空载复测仍跑不了**：`Get-Process Tuanjie` 实读 2 个（11:08 gui-agent 编辑器＋11:13 Cowork hub）；032 判据 `fps_avg≥486.8` 且 `p95≤2.58ms`。挑 0 进程窗口再跑，禁带载凑数。
5. **面板品质线（r690→r713 常态）**：改模板/builder 后必跑 `build-city-panel.ps1` + `node logs/devloop-r702-compile-check.js` + 四套 PS 闸（`test-city-shot-shape` 11／`test-city-shot-census` 18／`test-city-panel-proof` 17／`test-city-duty` 21）+ 全 **29 套** `powershell -File Tools\devloop\run-panel-suites.ps1`（exit 2=有失败）+ `node Tools/devloop/narrow-shot.js --width 390`（VERDICT 必须 OK）。改面部前先写 `logs/devloop-face-content.json` → `write-status-face.ps1` → 再重建（否则假红）。
   - **取景家族注册表**：只有 `city-`/`city3d-`/`smoke-`/`frame-`/`soak-` 开头的 `qa/` **顶层**图会被取景卡采用；示意图一律放 `qa/site/`（r714 新增），不许冒充城市帧。
6. **explore#12 第 286 绪窗**：首选 JR/T 0025.12 现行层（queue #289）；防重扫 0025.8/0090/0089.x/0098.x/0095/0097/0092 已闭卷。重笔轮产物落盘即 commit·板面注记后补。
7. **新律承接（r666）·P-11 面**：跨轮写探针/改 schema 必须同窗 commit 或先移出 `Tools/perceptor`+`schema`，否则 tick 静默跳过 scan+verify。
8. 真无活时一行声明合法（禁造活）；`main#7` charter 四锚缓判；`main#3` 提案位（周日演化日窗）；`main#4` 每轮 c2 行检；每月 1 日跑 `archive-section9.ps1`（先 -DryRun）。
9. **常设收尾**：`resolve-group-root.ps1` 解析 live 根再算三 sha → 写 `logs/devloop-face-content.json`（六键·路径写完整相对路径）→ `write-status-face.ps1`（FACE OK）→ `check-runbook-sync.ps1`（SYNC）→ 动板面则 `tasks-board-check.ps1`（PASS）→ pathspec 限定 commit → `write-fastpath-state.ps1` 重写状态档。
## 验收标准（怎么算完成）
实物优先计分（能跑能用=2／文件改动=1／纯记账=0）；动板面后 `tasks-board-check.ps1` PASS 才 commit；commit=「DevLoop r<N>: …[via bm-a]」；未过门如实记未完成；等待态=一行声明收轮。