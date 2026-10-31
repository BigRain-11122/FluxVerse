# FluxVerse DevLoop Runbook（启动首读面·Executive Protocol v1.0）
> <2KB 契约=..\..\docs\executive-protocol.md §1（历史轮长态放宽·紧凑执法）；进度唯一权威=TECH.md §九；收尾若「下一步」有变则更新本件（静轮免改）。
## 我是谁
超体宇宙城底座 DevLoop（Biggame 承建·bm-a 无人值守轮）；主线=City3D R2 模块壳（交互窗承建）＋CEO 唯一产品面 `world-public/city-panel.html`。
## 我现在在干什么
r723 毕（FULL-ROUND·triggers=1 c4-tech·产品面=街区尺度对照图 `qa/site/r2-scale-20261031-1730-bm-a.png`）：main#61 收口——只读新工具 `Tools/devloop/r2-scale-study.py`（复用 `r2-site-check.py` 的场景解析，尺寸从宅基台反推）把 8 宅按真实资产尺寸在**同一比例**上摆三版：A1 现状 79.8×70.8 m（密度 21.2%）／A2 只压行距 71.1×47.8 m（−40% 用地·资产与排位全不动）／A3 再加门面重排＋无路缘 67.5×43.8 m（−48%）。主矛盾是**行距**：52 m 中心距里只用了 24.8 m，27.2 m 是空地，前场进深 13.6–20.2 m → 街面读不出「街」。顺带量到解剖展示房压进 P07 宅基台 0.55 m（同高共面 z-fighting 风险，另立 main#64）。全程未动场景，`--self-check` 夹具全绿。
## 我现在在干什么（历史）
r721：街区搬到北岸干地，压水 91.7%→0.0%（`CityRebuildR2.Run()` 按 `rehearsal-anchor.txt` 定 (0.3,83.2)，`r2-site-check.py` 改读已建场景 Transform）。r720：面板「运行维护」行印日志归档日更状态。r719：`log-archive-duty.ps1` 让归档每天自跑一次。
## 下一步（队列头）
1. 轮首跑 `Tools\devloop\check-fastpath.ps1`：FASTPATH=队列取活（`state/queue/{main,tech,explore}.md`）→提案轨→一行声明；FULL-ROUND=按 mandate 读序施工。r723 收尾=tech_sha12 传棒 KEEP（§九 open 可领面：main#62/#63/#64/#40/#33/#8/main#23/#51/#20），ledger/dec/orders 刷现值。
2. **队列头=main#62 街面帧机位重定**（人视 1.6-1.8 m·沿街轴向·至少一栋立面占 1/4 宽，出图前后各一帧对照存 `qa/site/`）；接着 main#63 环境光基线入场景体检（verify 读 `m_AmbientMode`）→ main#64 展示房压宅基台 0.55 m（与 main#61 的 A2/A3 布局决定同批落）→ main#40 冻结 fixture 重建 → main#33 状态档写入硬化 → main#8 城市线附卷（10-19 逾期）→ main#23 司级基准刷新（10-27 逾期）→ main#51 `narrow-shot.js` 残页（未复现·债不销）→ main#20 ABORT 观察位。
3. **main#52 空载复测仍跑不了**：`Get-Process Tuanjie` 实读 2 个（gui-agent 编辑器＋Cowork hub）；032 判据 `fps_avg≥486.8` 且 `p95≤2.58ms`。挑 0 进程窗口再跑，禁带载凑数。
4. **面板品质线（r690→r713 常态）**：改模板/builder 后必跑 `build-city-panel.ps1` + `node logs/devloop-r702-compile-check.js` + 四套 PS 闸（`test-city-shot-shape` 11／`test-city-shot-census` 18／`test-city-panel-proof` 17／`test-city-duty` 32）+ 全 **29 套** `powershell -File Tools\devloop\run-panel-suites.ps1`（exit 2=有失败）+ `node Tools/devloop/narrow-shot.js --width 390`（VERDICT 必须 OK）。改面部前先写 `logs/devloop-face-content.json` → `write-status-face.ps1` → 再重建（否则假红）。
   - **取景家族注册表**：只有 `city-`/`city3d-`/`smoke-`/`frame-`/`soak-` 开头的 `qa/` **顶层**图会被取景卡采用；示意图一律放 `qa/site/`（r714 新增），不许冒充城市帧。
5. **explore#12 第 286 绪窗**：首选 JR/T 0025.12 现行层（queue #289）；防重扫 0025.8/0090/0089.x/0098.x/0095/0097/0092 已闭卷。重笔轮产物落盘即 commit·板面注记后补。
6. **新律承接（r666）·P-11 面**：跨轮写探针/改 schema 必须同窗 commit 或先移出 `Tools/perceptor`+`schema`，否则 tick 静默跳过 scan+verify。
7. 真无活时一行声明合法（禁造活）；`main#7` charter 四锚缓判；`main#3` 提案位（周日演化日窗）；`main#4` 每轮 c2 行检；每月 1 日跑 `archive-section9.ps1`（先 -DryRun）。
8. **常设收尾**：`resolve-group-root.ps1` 解析 live 根再算三 sha → 写 `logs/devloop-face-content.json`（六键·路径写完整相对路径）→ `write-status-face.ps1`（FACE OK）→ `check-runbook-sync.ps1`（SYNC）→ 动板面则 `tasks-board-check.ps1`（PASS）→ pathspec 限定 commit → `write-fastpath-state.ps1` 重写状态档。
## 验收标准（怎么算完成）
实物优先计分（能跑能用=2／文件改动=1／纯记账=0）；动板面后 `tasks-board-check.ps1` PASS 才 commit；commit=「DevLoop r<N>: …[via bm-a]」；未过门如实记未完成；等待态=一行声明收轮。