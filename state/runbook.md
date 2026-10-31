# FluxVerse DevLoop Runbook（启动首读面·Executive Protocol v1.0）
> <2KB 契约=..\..\docs\executive-protocol.md §1（历史轮长态放宽·紧凑执法）；进度唯一权威=TECH.md §九；收尾若「下一步」有变则更新本件（静轮免改）。
## 我是谁
超体宇宙城底座 DevLoop（Biggame 承建·bm-a 无人值守轮）；主线=City3D R2 模块壳（交互窗承建）＋CEO 唯一产品面 `world-public/city-panel.html`。
## 我现在在干什么
r716 毕（FULL-ROUND·triggers=c4 传棒续领·产品面=落位核验接进巡检）：r714 测出的「街区压水 91.7%」不再是一份手跑死报告——每 10 分钟由 verify 自己播报。`Tools/devloop/r2-site-check.py` 增 `--no-artifacts`（只出摘要行、不出图、不依赖 Pillow，否则一天 144 张图埋掉 `qa/site/`）＋`--scene`/`--rebuild` 夹具开关，终判抽成 `report_verdict()`；`Tools/perceptor/verify.ps1` 新增 §2d 解析既有 `block_water_coverage=`／`dry_candidates=`／`SITE_VERDICT=` 行，每 tick 打 `VERIFY HEALTH: r2-site: block_water=…% dry_candidates=…`，压水 >50% 与互校 `INCONSISTENT` 翻 `VERIFY WARN` 点名，**场景/脚本/python 缺失一律 WARN 不 FAIL**、输出零 `FAIL` 词根、子进程硬顶 120 s。真机：`VERIFY WARN: r2-site: block_water=91.7% dry_candidates=28274`（与 r714 逐位同）·verify PASS·整轮 2 s；沙盒 `Tools/devloop/test-verify-r2-site.ps1` **16/16**（跑真 verify.ps1×三夹具：干地→HEALTH／压水→WARN／缺档→WARN 且 exit 0 不抛）；`test-verify-path-census` 15/15、`test-city-shot-census` 18/18 回归绿。夹具手写 Unity YAML 时反哺两处真工具约束：`m_DataSize*3` 窗口不填白会吃到 `m_IndexFormat` 的十六进制字母、精确互校按三角最小角分桶故大三角查不到（真场景 2,260 小三角无恙）。诚实边界：只做观测，街区仍在压水上，搬不搬归 main#54。
## 我现在在干什么（历史）
r715：`logs/` 保留策略落地——`Tools/devloop/archive-logs.ps1`（14 天前、非 tracked、非代码扩展名；zip 归档；删前逐条比长度，任一不符整卷不删 exit 2）＋沙盒 29/29；真机 **2,174 件 / 43.6 MB** 入 `logs-202610-part00-20261031-1543.zip`，删后 CRC 复验 2174/2174 bad=0，`>14d` **2,266 → 92**（全保护面）。新债 main#56＝归档未周期化。
## 下一步（队列头）
1. 轮首跑 `Tools\devloop\check-fastpath.ps1`：FASTPATH=队列取活（`state/queue/{main,tech,explore}.md`）→提案轨→一行声明；FULL-ROUND=按 mandate 读序施工。r716 收尾=tech_sha12 传棒 KEEP（§九 open 可领面：main#57/#23/#40/#33/#8/main#49 残留/#51/#20/#56），ledger/dec/orders 刷现值。
2. **队列头=main#57 面板「落位」行**：builder（`Resolve-CityProof` 面）调 `r2-site-check.py --no-artifacts` 取同一判据，把「压水 91.7%｜最近干地 83 m」印到城市取景卡，压水红标、读数缺失不崩；**禁在 builder 里另写阈值**。改完跑 `test-city-panel-proof.ps1`＋全 29 套＋390 `narrow-shot.js`。
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