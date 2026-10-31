# FluxVerse DevLoop Runbook（启动首读面·Executive Protocol v1.0）
> <2KB 契约=..\..\docs\executive-protocol.md §1（历史轮长态放宽·紧凑执法）；进度唯一权威=TECH.md §九；收尾若「下一步」有变则更新本件（静轮免改）。
## 我是谁
超体宇宙城底座 DevLoop（Biggame 承建·bm-a 无人值守轮）；主线=City3D R2 模块壳（交互窗承建）＋CEO 唯一产品面 `world-public/city-panel.html`。
## 我现在在干什么
r724 毕（FULL-ROUND·triggers=1 c4-tech·产品面=街面取景卡换真·人视帧＋对照图 `qa/site/r2-streetcam-20261031-1738-bm-a.jpg`）：main#62 收口——机位改由判据解出，不再手调：眼高钉 1.7 m，沿街轴扫候选位姿（4 站位×7 横移×0-75° 偏角），用相机投影实测每栋宅包围盒的可见横向占比，取「达标且最贴街轴」的位姿。实测 `street_pose: eye=1.7m yaw_off=0.0 facade=0.306 ok`＝正沿街轴就 30.6% ≥ 25%。视场角不动。重拍 6 帧＋对照图；`r2-shots.md` 现在把位姿实测一并落盘。新发现→main#65：底板行道树立在路带中线上（无碰撞体，射线查不出）。
## 我现在在干什么（历史）
r723：街区尺度对照图（main#61，A2/A3 方案，行距是主矛盾）。r721：街区搬到北岸干地，压水 91.7%→0.0%（`CityRebuildR2.Run()` 按 `rehearsal-anchor.txt` 定 (0.3,83.2)，`r2-site-check.py` 改读已建场景 Transform）。r720：面板「运行维护」行印日志归档日更状态。r719：`log-archive-duty.ps1` 让归档每天自跑一次。
## 下一步（队列头）
1. 轮首跑 `Tools\devloop\check-fastpath.ps1`：FASTPATH=队列取活（`state/queue/{main,tech,explore}.md`）→提案轨→一行声明；FULL-ROUND=按 mandate 读序施工。r724 收尾=tech_sha12 传棒 KEEP（§九 open 可领面：main#63/#64/#65/#66/#40/#33/#8/#23/#51/#52/#20），ledger/dec/orders 刷现值。
2. **队列头=main#63 环境光基线入场景体检**（verify 每 tick 读 `m_AmbientMode` 与三色，非 Trilight 或全零即 WARN 点名）；接着 main#64 展示房压宅基台 0.55 m → main#65 底板行道树侵入路带（几何普查，不能靠射线）→ main#66 行距 A2 落地（与 main#61 同批决定）→ main#40 冻结 fixture 重建 → main#33 状态档写入硬化 → main#8 城市线附卷（10-19 逾期）→ main#23 司级基准刷新（10-27 逾期）→ main#51 `narrow-shot.js` 残页（未复现·债不销）→ main#20 ABORT 观察位。
3. **main#52 空载复测仍跑不了**：`Get-Process Tuanjie` 实读 2 个（gui-agent 编辑器＋Cowork hub）；032 判据 `fps_avg≥486.8` 且 `p95≤2.58ms`。挑 0 进程窗口再跑，禁带载凑数。
4. **面板品质线（r690→r713 常态）**：改模板/builder 后必跑 `build-city-panel.ps1` + `node logs/devloop-r702-compile-check.js` + 四套 PS 闸（`test-city-shot-shape` 11／`test-city-shot-census` 18／`test-city-panel-proof` 17／`test-city-duty` 32）+ 全 **29 套** `powershell -File Tools\devloop\run-panel-suites.ps1`（exit 2=有失败）+ `node Tools/devloop/narrow-shot.js --width 390`（VERDICT 必须 OK）。改面部前先写 `logs/devloop-face-content.json` → `write-status-face.ps1` → 再重建（否则假红）。
   - **取景家族注册表**：只有 `city-`/`city3d-`/`smoke-`/`frame-`/`soak-` 开头的 `qa/` **顶层**图会被取景卡采用；示意图一律放 `qa/site/`（r714 新增），不许冒充城市帧。
5. **explore#12 第 286 绪窗**：首选 JR/T 0025.12 现行层（queue #289）；防重扫 0025.8/0090/0089.x/0098.x/0095/0097/0092 已闭卷。重笔轮产物落盘即 commit·板面注记后补。
6. **新律承接（r666）·P-11 面**：跨轮写探针/改 schema 必须同窗 commit 或先移出 `Tools/perceptor`+`schema`，否则 tick 静默跳过 scan+verify。
7. 真无活时一行声明合法（禁造活）；`main#7` charter 四锚缓判；`main#3` 提案位（周日演化日窗）；`main#4` 每轮 c2 行检；每月 1 日跑 `archive-section9.ps1`（先 -DryRun）。
8. **常设收尾**：`resolve-group-root.ps1` 解析 live 根再算三 sha → 写 `logs/devloop-face-content.json`（六键·路径写完整相对路径）→ `write-status-face.ps1`（FACE OK）→ `check-runbook-sync.ps1`（SYNC）→ 动板面则 `tasks-board-check.ps1`（PASS）→ pathspec 限定 commit → `write-fastpath-state.ps1` 重写状态档。
## 验收标准（怎么算完成）
实物优先计分（能跑能用=2／文件改动=1／纯记账=0）；动板面后 `tasks-board-check.ps1` PASS 才 commit；commit=「DevLoop r<N>: …[via bm-a]」；未过门如实记未完成；等待态=一行声明收轮。