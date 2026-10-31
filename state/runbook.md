# FluxVerse DevLoop Runbook（启动首读面·Executive Protocol v1.0）
> <2KB 契约=..\..\docs\executive-protocol.md §1（历史轮长态放宽·紧凑执法）；进度唯一权威=TECH.md §九；收尾若「下一步」有变则更新本件（静轮免改）。
## 我是谁
超体宇宙城底座 DevLoop（Biggame 承建·bm-a 无人值守轮）；主线=City3D R2 模块壳（交互窗承建）＋CEO 唯一产品面 `world-public/city-panel.html`。
## 我现在在干什么
r727 毕（FULL-ROUND·triggers=1 c4-tech·产品面=街面人视帧的街心腾空，行道树退成两侧门廊）：main#65 收口——先量后治。`r2-site-check.py` 新增名字无关的几何普查（任何跨度 ≤10 m、与 `R2_AD-021_Street` 76×6 m 路带相交的底板网格），改前 `props_in_road=1 prop_area=9.00m2`（TreeW 整棵 3×3 立在街心）；新 `CityRebuildR2.ClearRoadBand()` 只在已建 R2 场景里把道具沿 z 推出路带（短距离优先、与路带净距 ≥1.0 m、不与其它道具/街区件相撞），`moves=TreeW-6.18m`，重建后 `props_in_road=0`。白盒底板 `CityWhitebox.unity` 零改动。接线=`site-verdict.ps1` 解析＋`verify.ps1 §2d` 健康行 `props_in_road=`（>0 转 WARN）＋面板「街区落位」行新列（`PANEL OK … site_props=0`）。沙盒 `test-road-props.py` 11/11、`test-verify-r2-site` 23/23、面板 29 套 ALL PASS、390 窄屏 `offenders=0`、六帧 `SHOTS_OK`、`VERIFY PASS`。
## 我现在在干什么（历史）
r726：展示房按宅基台实况解净位＋取景帧首次拍到门洞。r725：环境光基线入 verify 巡检（`ambient-verdict.ps1`＋§2f）。r724：街面取景卡换真·人视帧（`street_pose` 30.6%）。r723：街区尺度对照图（行距是主矛盾）。r721：街区搬到北岸干地，压水 91.7%→0.0%。r720：「运行维护」行印归档日更状态。r719：归档每天自跑一次。
## 下一步（队列头）
1. 轮首跑 `Tools\devloop\check-fastpath.ps1`：FASTPATH=队列取活（`state/queue/{main,tech,explore}.md`）→提案轨→一行声明；FULL-ROUND=按 mandate 读序施工。
2. **队列头=main#66 行距 A2 落地**（街感天花板：前场 13.6–20.2 m 把街拉成广场；改 `gz` 行距 52→29 m 后同一 `city3d-shots.ps1` 复拍，判据=街两侧立面对夹、`facade` 占比不降、铺装占画面 <55%）→ main#67 展示房楼梯跑出墙外（bounds 9.1×8.8 vs 7.5×5.0）→ main#68 底板道具碰撞体面（让机位遮挡判据能看见它们）→ main#40 冻结 fixture 重建 → main#33 状态档写入硬化 → main#8 城市线附卷（10-19 逾期）→ main#23 司级基准刷新（10-27 逾期）→ main#51 `narrow-shot.js` 残页（**禁并行跑**，一次一个实例）→ main#20 ABORT 观察位。
3. **main#52 空载复测仍跑不了**：`Get-Process Tuanjie` 实读 2 个（gui-agent 编辑器＋Cowork hub）；032 判据 `fps_avg≥486.8` 且 `p95≤2.58ms`。挑 0 进程窗口再跑，禁带载凑数。
4. **面板品质线（r690→r713 常态）**：改模板/builder 后必跑 `build-city-panel.ps1` + `node logs/devloop-r702-compile-check.js` + 四套 PS 闸（`test-city-shot-shape` 11／`test-city-shot-census` 18／`test-city-panel-proof` 17／`test-city-duty` 32）+ 全 **29 套** `powershell -File Tools\devloop\run-panel-suites.ps1`（exit 2=有失败）+ `node Tools/devloop/narrow-shot.js --width 390`（VERDICT 必须 OK）。改面部前先写 `logs/devloop-face-content.json` → `write-status-face.ps1` → 再重建（否则假红）。
   - **取景家族注册表**：只有 `city-`/`city3d-`/`smoke-`/`frame-`/`soak-` 开头的 `qa/` **顶层**图会被取景卡采用；示意图一律放 `qa/site/`（r714 新增），不许冒充城市帧。
5. **explore#12 第 286 绪窗**：首选 JR/T 0025.12 现行层（queue #289）；防重扫 0025.8/0090/0089.x/0098.x/0095/0097/0092 已闭卷。重笔轮产物落盘即 commit·板面注记后补。
6. **新律承接（r666）·P-11 面**：跨轮写探针/改 schema 必须同窗 commit 或先移出 `Tools/perceptor`+`schema`，否则 tick 静默跳过 scan+verify。
7. 真无活时一行声明合法（禁造活）；`main#7` charter 四锚缓判；`main#3` 提案位（周日演化日窗）；`main#4` 每轮 c2 行检；每月 1 日跑 `archive-section9.ps1`（先 -DryRun）。
8. **常设收尾**：`resolve-group-root.ps1` 解析 live 根再算三 sha → 写 `logs/devloop-face-content.json`（六键·路径写完整相对路径）→ `write-status-face.ps1`（FACE OK）→ `check-runbook-sync.ps1`（SYNC）→ 动板面则 `tasks-board-check.ps1`（PASS）→ pathspec 限定 commit → `write-fastpath-state.ps1` 重写状态档。
## 验收标准（怎么算完成）
实物优先计分（能跑能用=2／文件改动=1／纯记账=0）；动板面后 `tasks-board-check.ps1` PASS 才 commit；commit=「DevLoop r<N>: …[via bm-a]」；未过门如实记未完成；等待态=一行声明收轮。