# FluxVerse DevLoop Runbook（启动首读面·Executive Protocol v1.0）
> <2KB 契约=..\..\docs\executive-protocol.md §1（历史轮长态放宽·紧凑执法）；进度唯一权威=TECH.md §九；收尾若「下一步」有变则更新本件（静轮免改）。
## 我是谁
超体宇宙城底座 DevLoop（Biggame 承建·bm-a 无人值守轮）；主线=City3D R2 模块壳（交互窗承建）＋CEO 唯一产品面 `world-public/city-panel.html`。
## 我现在在干什么
r730 毕（FULL-ROUND·triggers=2 c3/c4·产品面=街面人视帧两侧不再被绿胶囊顶掉，街心与灭点全空）：main#69 收口。先量=新 `StreetProps` 报告行给出 `TreeW size=3.00x8.00x3.00 base_y=-0.02 lane_gap=1.00`（8 m 高、贴路带仅 1 m，街带两侧 14 m 内只有 2 棵）；病灶=机位评分只认物理射线（道具无碰撞体→恒 0）＋立面占比，旧机位 `street_control` 复算 `prop_cover=0.266`（＝r728「顶掉 1/4」的机读数）却与中段机位同分并列，先扫先得落在西端。修法=不改底板也不缩树，加 `PropScreenFrac`（AABB 八角投影累加）+`NearPropPenalty`（<6 m 眼高件）进评分（`-400*prop_cover-300*near_pen`）：新机位 `x=-88.4 lat=0.0 facade=0.382（↑）street_cover=0.281 prop_cover=0.000`。取证 `qa/city3d-shots-20261031-2124-bm-a-*`；健康=`VERIFY PASS`／`props_in_road=0`／`SITE_VERDICT=DRY`／面板 `shots_kb=64 art_missing=0`；场景零改动。
## 我现在在干什么（历史）
r729：展示房回到真 7.5×5.0——Synty 模块 pivot 在 AABB 角落而旧代码按「中心」写 pos，整圈墙/地板系统偏 L/2=1.25 m；改 `AlignRect` 先摆后对齐，`showcase_bounds ... over=(0.00,0.00) PASS`（main#67）。
r728：街面帧从「广场」变回「街」——main#66 收口（A2 行距）。r723 量到前场 13.6–20.2 m 把街拉成广场——房体进深+6 m 路带只占 24.8 m，余下 27.2 m 是空院。改法=行距 52→29 m（`gz` ±26→±14.5，`gx` 门面 22 m 不动，资产/排布/朝向零改动），街区进深 70.8→47.8 m、前场 2.1–8.7 m。判据由 `StreetShot` 同帧输出：`facade 0.306→0.354`（不降反升），新增 `street_cover`（逐屏幕采样射线与 76×6 路带顶面求交的占画面比）`=0.257`（判据 <0.55）。副作用=展示房失去院落净位（`NO_SLOT`），`FindShowcaseSlot` 候选位扩到「排内门面缝·与同排宅基台同 z」，落 13.57 m 的 P06|P07 缝、净距 2.26 m、重叠 0。健康=`block_water=0.0% props_in_road=0`、`VERIFY PASS`、面板 `art_missing=0`、29 套 ALL PASS、390 窄屏 `offenders=0`、六帧 `SHOTS_OK`。
r727：行道树让位路带，街心腾空（`ClearRoadBand`）。r726：展示房按宅基台实况解净位＋取景帧首次拍到门洞。r725：环境光基线入 verify 巡检（`ambient-verdict.ps1`＋§2f）。r724：街面取景卡换真·人视帧（`street_pose` 30.6%）。r723：街区尺度对照图（行距是主矛盾）。r721：街区搬到北岸干地，压水 91.7%→0.0%。r720：「运行维护」行印归档日更状态。r719：归档每天自跑一次。
## 下一步（队列头）
1. 轮首跑 `Tools\devloop\check-fastpath.ps1`：FASTPATH=队列取活（`state/queue/{main,tech,explore}.md`）→提案轨→一行声明；FULL-ROUND=按 mandate 读序施工。
2. **队列头=main#68 底板道具碰撞体面**（让机位遮挡判据与「路带几何普查」同源：重建报告给 `props_with_collider=N/62` 且 N>0，并用夹具位姿证 `blocked=1`／移开回 0；r730 已用几何投影绕过它，碰撞体面仍欠）→ main#71 `prop_cover` 上 verify/面板（现在只在取景报告里）→ main#72 行道树 3×8 m 与 1 m 贴街位的设计判断 → main#70 `r2-scale-study.py` 展示房尺寸改读报告实测行 → main#40 冻结 fixture 重建 → main#33 状态档写入硬化 → main#8 城市线附卷（10-19 逾期）→ main#23 司级基准刷新（10-27 逾期）→ main#51 `narrow-shot.js` 残页（**禁并行跑**，一次一个实例）→ main#20 ABORT 观察位。
3. **main#52 空载复测仍跑不了**：`Get-Process Tuanjie` 实读 2 个（gui-agent 编辑器＋Cowork hub）；032 判据 `fps_avg≥486.8` 且 `p95≤2.58ms`。挑 0 进程窗口再跑，禁带载凑数。
4. **面板品质线（r690→r713 常态）**：改模板/builder 后必跑 `build-city-panel.ps1` + `node logs/devloop-r702-compile-check.js` + 四套 PS 闸（`test-city-shot-shape` 11／`test-city-shot-census` 18／`test-city-panel-proof` 17／`test-city-duty` 32）+ 全 **29 套** `powershell -File Tools\devloop\run-panel-suites.ps1`（exit 2=有失败）+ `node Tools/devloop/narrow-shot.js --width 390`（VERDICT 必须 OK）。改面部前先写 `logs/devloop-face-content.json` → `write-status-face.ps1` → 再重建（否则假红）。
   - **取景家族注册表**：只有 `city-`/`city3d-`/`smoke-`/`frame-`/`soak-` 开头的 `qa/` **顶层**图会被取景卡采用；示意图一律放 `qa/site/`（r714 新增），不许冒充城市帧。
5. **explore#12 第 286 绪窗**：首选 JR/T 0025.12 现行层（queue #289）；防重扫 0025.8/0090/0089.x/0098.x/0095/0097/0092 已闭卷。重笔轮产物落盘即 commit·板面注记后补。
6. **新律承接（r666）·P-11 面**：跨轮写探针/改 schema 必须同窗 commit 或先移出 `Tools/perceptor`+`schema`，否则 tick 静默跳过 scan+verify。
7. 真无活时一行声明合法（禁造活）；`main#7` charter 四锚缓判；`main#3` 提案位（周日演化日窗）；`main#4` 每轮 c2 行检；每月 1 日跑 `archive-section9.ps1`（先 -DryRun）。
8. **常设收尾**：`resolve-group-root.ps1` 解析 live 根再算三 sha → 写 `logs/devloop-face-content.json`（六键·路径写完整相对路径）→ `write-status-face.ps1`（FACE OK）→ `check-runbook-sync.ps1`（SYNC）→ 动板面则 `tasks-board-check.ps1`（PASS）→ pathspec 限定 commit → `write-fastpath-state.ps1` 重写状态档。
## 验收标准（怎么算完成）
实物优先计分（能跑能用=2／文件改动=1／纯记账=0）；动板面后 `tasks-board-check.ps1` PASS 才 commit；commit=「DevLoop r<N>: …[via bm-a]」；未过门如实记未完成；等待态=一行声明收轮。