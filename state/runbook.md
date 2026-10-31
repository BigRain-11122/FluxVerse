# FluxVerse DevLoop Runbook（启动首读面·Executive Protocol v1.0）
> <2KB 契约=..\..\docs\executive-protocol.md §1（历史轮长态放宽·紧凑执法）；进度唯一权威=TECH.md §九；收尾若「下一步」有变则更新本件（静轮免改）。
## 我是谁
超体宇宙城底座 DevLoop（Biggame 承建·bm-a 无人值守轮）；主线=City3D R2 模块壳（交互窗承建）＋CEO 唯一产品面 `world-public/city-panel.html`。
## 我现在在干什么
r725 毕（FULL-ROUND·triggers=4 c3/c4/c6/c7·产品面=巡检面多一条可读读数）：main#63 收口——环境光基线入场景体检。新增单一判定模块 `Tools/devloop/ambient-verdict.ps1`（判据三条＝mode 非 Trilight／三色全零／intensity ≤ 0，各点名原因与行号；只读场景头 400 行，80 MB 级场景不全读），`verify.ps1` 新 §2f 每 tick 打 `VERIFY HEALTH: ambient: mode=Trilight sky=… equator=… ground=… intensity=1 scene=CityRebuild_R2.unity`，缺档/不可读一律 WARN 不 FAIL。沙盒 `test-verify-ambient.ps1` 22/22；verify 族四套回归全绿（r2-site 18/18·log-archive 22/22·path-census 15/15·probe 6/6）；真机 `VERIFY PASS` exit 0。顺带实证 main#51 新一态：两个 `narrow-shot.js` **并行**会互踩（390 那次量到 clientW=1400 仍打 OK），一次只跑一个实例。
## 我现在在干什么（历史）
r724：街面取景卡换真·人视帧（main#62，机位由判据解出，`street_pose` 30.6%）。r723：街区尺度对照图（main#61，行距是主矛盾）。r721：街区搬到北岸干地，压水 91.7%→0.0%。r720：面板「运行维护」行印归档日更状态。r719：`log-archive-duty.ps1` 让归档每天自跑一次。
## 下一步（队列头）
1. 轮首跑 `Tools\devloop\check-fastpath.ps1`：FASTPATH=队列取活（`state/queue/{main,tech,explore}.md`）→提案轨→一行声明；FULL-ROUND=按 mandate 读序施工。r725 收尾=四 sha 全刷现值（§九 open 可领面：main#64/#65/#66/#40/#33/#8/#23/#51/#52/#20）。
2. **队列头=main#64 展示房压宅基台 0.55 m**（移进最大门面缝或基台让净位，机检贴图元重叠=0，与 main#61 的 A2 同批）→ main#65 底板行道树侵入路带（几何普查，不能靠射线）→ main#66 行距 A2 落地 → main#40 冻结 fixture 重建 → main#33 状态档写入硬化 → main#8 城市线附卷（10-19 逾期）→ main#23 司级基准刷新（10-27 逾期）→ main#51 `narrow-shot.js` 残页（债不销；**禁并行跑**，一次一个实例）→ main#20 ABORT 观察位。
3. **main#52 空载复测仍跑不了**：`Get-Process Tuanjie` 实读 2 个（gui-agent 编辑器＋Cowork hub）；032 判据 `fps_avg≥486.8` 且 `p95≤2.58ms`。挑 0 进程窗口再跑，禁带载凑数。
4. **面板品质线（r690→r713 常态）**：改模板/builder 后必跑 `build-city-panel.ps1` + `node logs/devloop-r702-compile-check.js` + 四套 PS 闸（`test-city-shot-shape` 11／`test-city-shot-census` 18／`test-city-panel-proof` 17／`test-city-duty` 32）+ 全 **29 套** `powershell -File Tools\devloop\run-panel-suites.ps1`（exit 2=有失败）+ `node Tools/devloop/narrow-shot.js --width 390`（VERDICT 必须 OK）。改面部前先写 `logs/devloop-face-content.json` → `write-status-face.ps1` → 再重建（否则假红）。
   - **取景家族注册表**：只有 `city-`/`city3d-`/`smoke-`/`frame-`/`soak-` 开头的 `qa/` **顶层**图会被取景卡采用；示意图一律放 `qa/site/`（r714 新增），不许冒充城市帧。
5. **explore#12 第 286 绪窗**：首选 JR/T 0025.12 现行层（queue #289）；防重扫 0025.8/0090/0089.x/0098.x/0095/0097/0092 已闭卷。重笔轮产物落盘即 commit·板面注记后补。
6. **新律承接（r666）·P-11 面**：跨轮写探针/改 schema 必须同窗 commit 或先移出 `Tools/perceptor`+`schema`，否则 tick 静默跳过 scan+verify。
7. 真无活时一行声明合法（禁造活）；`main#7` charter 四锚缓判；`main#3` 提案位（周日演化日窗）；`main#4` 每轮 c2 行检；每月 1 日跑 `archive-section9.ps1`（先 -DryRun）。
8. **常设收尾**：`resolve-group-root.ps1` 解析 live 根再算三 sha → 写 `logs/devloop-face-content.json`（六键·路径写完整相对路径）→ `write-status-face.ps1`（FACE OK）→ `check-runbook-sync.ps1`（SYNC）→ 动板面则 `tasks-board-check.ps1`（PASS）→ pathspec 限定 commit → `write-fastpath-state.ps1` 重写状态档。
## 验收标准（怎么算完成）
实物优先计分（能跑能用=2／文件改动=1／纯记账=0）；动板面后 `tasks-board-check.ps1` PASS 才 commit；commit=「DevLoop r<N>: …[via bm-a]」；未过门如实记未完成；等待态=一行声明收轮。