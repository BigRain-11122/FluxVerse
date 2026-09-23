# FluxVerse 技术基建白皮书 TECH.md v1.0

> 超体宇宙城的技术底座。CEO 基建令（2026-09-23）：「把超体宇宙城市的整个技术底座基建搞扎实，能拓展，能自我更新和迭代，能自动化」
> 本文与 `DESIGN.md`（世界观/城市规划）互补：DESIGN = 城是什么，TECH = 城怎么建、怎么活、怎么长。
> 治理同源：四支柱全部移植集团既有机制（OS 循环 / 门禁 / 登记簿仲裁 / 编码律 / mandate 外置），零发明新制度。

---

## 一、四支柱（基建令逐条落地）

| 基建令要求 | 落地机制 | 状态 |
|---|---|---|
| 搞扎实 | §三 协议宪法 + §四 验证门禁（数据未过门禁不出库） | v1.0 |
| 能拓展 | §二 探针插件 + §三.2 事件登记簿 + §五 拓展检查单 | v1.0 |
| 能自我更新和迭代 | §六 FluxVerseTick（mandate 外置·自领技术债·P1 升级须 CEO） | v1.0 |
| 能自动化 | §七 10 分钟计划任务 + 日志 + 健康检查 | v1.0 |

## 二、探针插件架构（可拓展正体）

**开闭原则：加新数据源 = 向 `probes/` 丢一个新文件，主脚本零改动。**

```
Tools/perceptor/
├── scan.ps1            # 编排主脚本（固定：游标/事件出口/装配/输出·含 reality 装配段 M1.5+按日轮转 r3+单写者锁 v0.5 r6+quarantine 7d 生命周期 v0.6 r7）
├── probes/             # 探针目录（登记即生效·按文件名排序执行）
│   ├── _template.ps1   # 新探针标准模板
│   ├── clock.ps1        # 本地时钟 → 昼夜相位+沪深开闭市钟声 MARKET_OPEN/CLOSE（M1.5 现实链接·纯本地）
│   ├── evolution.ps1   # cph4/evolution-ledger.md → 提案数
│   ├── fleet_machines.ps1 # BigMoney fleet/machines/*.json → fleet 实体+HEARTBEAT
│   ├── fleet_minigame.ps1 # MiniGame 快照 A/B/C 机 → fleet_biggame 实体
│   ├── fleet_tasks.ps1 # fleet/tasks/*.json → tasks
│   ├── fx.ps1          # frankfurter ECB 汇率 → USDCNY+FX_TICK（资金道流量计·M1.5·零 key）
│   ├── git.ps1         # 5 仓 git → COMMIT 事件+zones 活跃度+history
│   ├── github_events.ps1 # GitHub 公共事件 → GITHUB_EVENT（数据道生态脉冲·M1.5·零 key）
│   ├── market.ps1      # akshare 交易日历+510300ETF 日线 → reality.market（fetcher=market_fetch.py·BigMoney 同源链·M1.5·零 key）
│   ├── orders.ps1      # BigMoney fleet orders → CEO_ORDER（quant 面）
│   ├── orders_bs.ps1   # BigStream/orders → CEO_ORDER（media 面）
│   ├── orders_hq.ps1   # 集团台账 docs/orders.md → CEO_ORDER（governance 面·内容寻址游标 hqorder: r6）
│   ├── snapshot.ps1    # MiniGame 自动化快照 → GAME 城活跃脉冲
│   └── weather.ps1     # Open-Meteo 上海 → 天气片段+WEATHER_ALERT（M1.5·零 key）
└── verify.ps1          # 验证门禁（schema+登记簿校验）
```

**探针契约**（写进 `_template.ps1`，违反契约=门禁拒绝）：
1. 只读：绝不写任何兄弟仓；
2. ASCII-only 脚本体，中文只存在于数据；
3. 必须定义 `Probe-<文件名>` 函数，入参 `$ctx`（root/now/cursor/worldDir/事件出口——worldDir r6 增：本仓 world/ 只读数据面），返回 `state` 哈希片段由主脚本装配；
4. 崩溃自限：探针内部 try/catch，失败只降级不阻断全城扫描；
5. 新探针落文件 + 在本文件 §九登记一行。

## 三、协议宪法（扎实正体·版本化）

- 协议标识：`protocol: "fluxverse/0.1"`（state 文件首字段）；
- **schema 演进规则**（向后兼容铁律）：
  - 加字段：任意（消费端忽略未知字段）；
  - 加事件类型：先登记 `schema/events-registry.json` 再产出；
  - 删字段/改语义：**升版本号**（0.1→0.2），引擎按版本适配；
  - 禁止：偷偷改字段含义（= 协议作伪，门禁拦截）。
- **事件登记簿**（`schema/events-registry.json`）：事件类型唯一仲裁面——探针不得产出未登记事件，verify.ps1 按此校验（集团登记簿治理的协议层移植）。

## 四、验证门禁 verify.ps1（扎实正体·数据质量闸机 v0.4·CEO 审计修+r3）

两阶段晋升制：感知器写 `world-state.json.new`，verify **PASS 才原子晋升**为 `world-state.json`；FAIL 则旧 state 原样保留、.new 废弃——「FAIL 阻断不覆盖」逐字为真。
1. state(.new) 可解析 + protocol 版本已登记 + **内字段逐项校验**：zones（id/name/status/activity·必备三 zone）／fleet（id/online/last_seen/cores/current_task）／tasks（id/zone/owner/status）／flows（id/zone）／products（id/line/status·必备三产品）／governance／history；
2. 事件流**自愈**：坏行（不可解析/未登记类型/缺 ts_utc）移入 `world-events.quarantine.jsonl` 并从主流剔除——门禁隔离坏死行，**永不因坏行永久卡死**；
3. **游标增量**：`world/verify-state.txt` 记已验行数，只验新增行——verify 成本 O(增量)，文件再大也不变慢；**游标自检（r3）**：游标越界（轮转/截断后游标>行数）或游标档不可读 → WARN+回零全量重验收敛，永不静默信任坏游标；
4. 写侧双保险（scan v0.3）：事件出产即校验（未登记类型当场隔离·不落主流）+ `ConvertTo-Json -Compress` 全转义；
5. **按日轮转（scan v0.4·r3）**：scan 写事件前若活流跨日——昨日流整体归档 `world/world-events-<YYYYMMDD>.jsonl`（编年史留盘·引擎 L2 回放可读），活流只含当日；同日存档已存在则追加合并不覆盖（时钟回拨安全）；verify 游标自检负责轮转后再收敛；
6. **隔离区 7 天生命周期（scan v0.6·r7·集团审计 P-14）**：quarantine 文件两梯清理——7 天未动整文件清空（mtime 判据=全部内容必过期）+行级 ts_utc>7d 修剪（retention.md R4 垃圾级·期满即清）；**fail-keep**：不可龄行（坏 JSON/缺 ts）永不静默毁证，留待整档陈旧梯收口——隔离区取证价值期内永不清、期满不再无限生长；
7. 退出码：0=PASS（含自愈告警），1=FAIL（仅结构性问题：state 坏/registry 坏；tick 据此报警）。

## 五、拓展检查单（未来已验证可接）

| 未来事件 | 接入方式 | 改动面 |
|---|---|---|
| 新公司仓 / 新业务线开线 | git 探针加 repo 条目 + 主脚本 zones 装配行 | 2 行 |
| 新机队机器 | fleet_machines 探针自动发现（扫 machines/*.json） | 0 行 |
| 新事件类型（RESEARCH/DEPLOY/…） | events-registry 登记 + 探针产出 + 引擎映射表加行 | 3 处 |
| L2 行为总线（思考过程上报） | 新探针 bus.ps1 + 脱敏律先行（T2 立法） | 1 文件 |
| WeChat 参观端 | 协议不变，引擎双构建目标 | 0 行 |
| 大文件互传可视化 | TRANSFER 台账新探针 | 1 文件 |

## 六、FluxVerseTick（自迭代正体·集团同源 OS 循环）

- 形态：10 分钟一轮，`Tools/tick/tick.ps1` 直调，中文 mandate 外置 `Tools/tick/mandate.txt`（编码律：脚本 ASCII，中文在 UTF-8 数据件）；单实例锁=`logs/tick.lock`（15 分钟陈旧接管·CEO 审计修 S1）；**v1.2 脏树退避（r6·集团审计 P-11）**：轮首 `git status` 见 `Tools/perceptor`+`schema` 脏即跳过 scan+verify 本轮——在飞开发轮半成品防 16:57 同型假 FAIL；退避轮照写日志注明理由、exit 0 非失败；scan 侧配套 v0.5 单写者锁（活锁<15min 退避·死 PID/坏锁即接管）；
- 每轮职责（v1.0）：①跑感知器 ②跑验证门禁 ③健康检查（写 logs/）④技术债自领（见 §九 backlog，P0 小步直改，P1+ 记 backlog 待 CEO 署名）；
- **升级须 CEO**：新探针上新事件类型属 T2（7 天否决窗）；改协议版本/动引擎架构属 P1 须署名；
- 反重复铁律：先读后写、复用禁重建、同仓单执行体退避（多窗时先 git status）。

## 七、自动化部署（已点火）

- 计划任务 `FluxVerseTick`：每 10 分钟，无人值守；
- 日志：`logs/tick-YYYYMMDD.log`（gitignored，轮转保留 7 天）；
- 健康指标：每轮 PASS/FAIL + 事件增量数 + fleet 在线数。
- 任务动作=Set-ScheduledTask 注册（PowerShell 模块）；**首次真 OS 轮 2026-09-23 17:19**（r2 修红：注册首日动作串遭 schtasks /tr 引号残废，心跳从未真正点火——新法见 §九）。

## 八、目录全景

```
gaming/FluxVerse/
├── README.md / DESIGN.md / TECH.md      # 门面 / 世界观 / 基建（本文）
├── schema/
│   ├── events-registry.json             # 事件登记簿（协议层仲裁面）
│   └── PROTOCOL.md → 并入本文 §三        # schema 演进规则
├── Tools/
│   ├── perceptor/ (scan.ps1 + probes/ + verify.ps1)
│   ├── tick/ (tick.ps1 + mandate.txt)
│   └── city/ (bake-banner-text.ps1 · 引擎侧烘焙工具·ASCII 律)
├── world/    # 运行时数据（gitignored）
├── logs/     # tick 日志（gitignored）
└── City/     # 团结引擎 2D 工程（M1 点火 r8：Tuanjie 1.10.3 内置 2D 模板·Assets/Packages/ProjectSettings 入库·Library/Temp/Logs gitignored）
```

## 九、技术债 Backlog（tick 自领池·P1+ 须 CEO）

- [P1] watch 模式（本机秒级实时，Windows 文件监听）
- [P1] 引擎工程脚手架（团结引擎 2D 项目·待风格定稿）
- [✅ 2026-09-23·r3] jsonl 按日轮转归档（scan v0.4：跨日活流整体归档 world-events-<日期>.jsonl·同日重档追加合并不覆盖·真机实证 353 行 142KB 转档；并发实证=他窗手动 scan 同窗竞跑零重复零丢·源级游标去重有效）
- [✅ 2026-09-23·r3] verify 游标异常自检（v0.4：游标越界/不可读→WARN+回零全量重验收敛——实证 353>3 警告回零；孤儿旧游标件 world/verify-cursor.txt 已清·现行唯一游标=verify-state.txt）
- [P2] MiniGame 任务面板/BigStream 产出探针
- [P2] HQ-FEEDBACK 感知探针（向上反馈通道可视化）
- [✅ 2026-09-23·r19] 城市美术资产管线概念稿收口（M0 全闭）：黄昏档+夜档概念稿=**真引擎出图** `docs/design/m0-city-concept-{dusk,night}.png`（城市即概念稿——ConceptProof 哨兵批渲染·只读场景零保存·artifact 回读门 15 断言绿：dusk 地平暖 +0.54 与 r13 逐位同源/紫顶 −0.07/夜顶 0.037/双图城市带防空白门 215000·133885 采样 px+多模态四项双绿〔一江两岸完整/暖紫金黄昏/夜蓝黑有灯/零伪影/纯 2D〕；后续美术扩容统一走 P-21 消费链，风格锚=art-target-dusk+1 号高清赛博像素正典）
- [✅ 2026-09-23·r1] 现实链接首批五探针（CEO 新令「要和现实产生链接和互动」·通道台账与视觉映射=docs/research/R-20260923-reality-link.md + DESIGN §十五）：clock/weather/fx/github_events 四针已落地（全零 key·静默降级·游标增量），**market+calendar 一针剩余**（akshare 依赖 BigMoney 同源·交易日历可修 clock 的节假日近似——下轮候选）
- [✅ 2026-09-23·r1] 新事件登记 MARKET_OPEN/MARKET_CLOSE/WEATHER_ALERT（T2·7 天否决窗）——实际登记五型（+FX_TICK/GITHUB_EVENT），否决窗至 2026-09-30
- [新法·已修] **PS5.1 ParseExact 'Z' 陷阱**：格式串含字面 'Z' = .NET 按 UTC 解析后**转本地时**（实证：clock 首版 UTC+8 双重偏移成次日凌晨）——解析 UTC 戳一律剥 Z 再 ParseExact 或用 AdjustToUniversal；未来任何探针吃时间戳适用
- [新法·已修·r2] **schtasks /tr 引号残废陷阱**：OS 任务动作串被转义成 `-File " 路径\ /F`（引号后带空格 + schtasks /F 力 flag 漏进串尾）→ powershell.exe 判非 .ps1 扩展名当场死，exit **-196608**（逐位=任务 LastTaskResult 4294770688）——FluxVerseTick 自 16:17 注册以来**从未点火**，日志 16:17/16:57 两条全是别窗手动跑；修=Set-ScheduledTask 换净动作串 + 17:19 点火实证（13 探针全 OK+gate 双绿）。法：**OS 任务注册/改一律走 PowerShell ScheduledTasks 模块**（DevLoop register_loop_task 同源范式），用 schtasks /tr 后必读回 XML 验动作串
- [P1] 令行通道：指令文件出口→签收关卡→OS 循环消费→回流事件（环B 闭环=数字影子升格真孪生的唯一通道·Kritzinger 2018 判据·署名按 CEO 委托令 O-20260923-1620 分级）
- [P2] Biggame U-登记簿探针（先定位 MiniGame 侧登记簿文件；orders 探针已覆盖面=fleet orders+集团台账+BigStream orders）
- [✅ 2026-09-23·r4] market+calendar 探针（五现实探针收口·M1.5 感知侧全部落地）：**交易日历修 clock 节假日近似**——market.ps1 单写者持 world/market-cal.json（akshare tool_trade_date_hist_sina·覆盖至 2026-12-31），clock.ps1 只读；as_of=当日新鲜才生效（true/false 覆盖 Mon-Fri），stale/缺失→退回近似兜底（已知边缘：凌晨断 tick+节假日 09:30 首轮误钟一轮自愈，OS 循环 24h 在跑即不触发）；**510300 沪深300ETF 日线入 state.reality.market**（BigMoney 同源旗舰标的=regime/evolve/strategies target·30 bars [date,o,h,l,c]·change_pct·is_trading_day·cal_next_trade_date——QUANT 城真K线巨屏数据就绪，引擎侧映射属 M2）；源链实证改序 **TX→Sina→EM**（TX 实测通含当日 in-flight bar·Sina ETF 股票端点当日解析坏死 demjson No value·EM RemoteDisconnected 同 BigMoney 09-21 断连实证——与 BigMoney 顺序不同已在 commit 注明理由：以当日实测为准）；缓存节奏=cal 日更+ETF 30min TTL→10min tick 不打爆源；双绿实证=14 探针全 OK+VERIFY PASS+bars 30 条含当日 4.590；独立逻辑测试 4 例全过（节假日 closed 零钟/stale 回退/补钟 4 连响有序/节后无伪钟）
- [新法·已立·r4] **探针子进程硬顶律**：PS 调外部抓取器（python/akshare 等）一律 `Start-Process -PassThru` + `WaitForExit(毫秒)` + 超时 `Kill()`——akshare 各源无内置超时（BigMoney 实证腾讯级可挂 5min+），无硬顶=一针挂死整轮 tick；配套律：嵌套数据入 state 用 array-of-arrays（标量叶保 ConvertTo-Json -Depth 6 余量·对象套对象有 null 截断险）；探针自测收集器禁 `+=`（scriptblock 域假象·用 ArrayList 方法调用）
- [✅ 2026-09-23·r5] DESIGN 编号残迹+误字收口（r4 呈报两项他窗债·自领）：①双「十四」去重=原「十四、治理挂接」并入城市治理规则章作 14.6（锚点不动：现实链接层仍 §十五，TECH/mandate/R-synthesis 三处引用零改动）；②「秩库」→「私库」误字修复（git log -S 实证=他窗 4198432 引入·README 与 R-synthesis §五在册正字均=私库）；他窗 R-synthesis 17:56 活跃 WIP（对外口径 CEO 纠偏令）按单执行体退避律未卷入
- [P1·并入 M1 验收 18:45] 引擎侧现实节律接线（CEO 令「搭建的城市要有科幻感和赛博感，接入24小时和天气，和现实中的上海接轨」）：clock/weather 探针数据已就绪（state.reality）→引擎侧四档环境色轮（晨/昼/黄昏暖紫金/夜蓝黑青·真实北京时间驱动）+天气粒子（雨/雪/台风全城灯带·Open-Meteo 上海实况）+赛博光效规格达成（五色律/发光三级/霓虹街牌/扫描线/大气透视/水面反射——DESIGN §九+目标图气质对齐）；判据=四档色轮截图×4+天气粒子实证；行情 K 线视觉映射仍留 M2（state.reality.market 数据已备）；规格=BLUEPRINT §五/§六
- [✅ 2026-09-23·r6] 集团审计转办件 **P-10**（P0）收口：orders_hq 行数位置游标→**内容寻址游标**（`hqorder:<time>/<quote前30字>` 键·bsorder 同式·'=' 从键材料剥离防游标行断键）+事件去重——多窗插行位移漏 4 令+retention 行双发根除；**迁移语义=当日未脉冲行一次性补齐**（真机落产 24 脉冲：审计漏发 17:05/17:20/17:25/17:30落地性 4+新令 18:20+日初出生抑制 19——城今日出生·引擎未建零消费端无闪烁爆 issue·流内已发 5 行零重发·未来同日游标意外清零也自限去重）；历史日期行静默种子禁旧史重放；pending 计数改全表 executing 总数（该 state 键原为 scan 装配死面零协议影响）；沙盒 21 断言全绿（迁移 29 键/二轮幂等零新增/插行位移恰发 1/含 = 引文键回环不断/流去重 26-5）+真机迁移落产（流 30 ledger 事件·游标 29 键·ledger_rows 退役）+verify PASS
- [✅ 2026-09-23·r6] 集团审计转办件 **P-11**（P0）收口：**scan v0.5 单写者锁**（tick S1 同式+PID 存活检查：活锁<15min 退避·死 PID/坏锁 fail-open 即接管——17:37/17:42 tick×devloop 双写者同窗竞写实证根除；活锁实证=假锁退避者不动他人锁）+**tick v1.2 脏树退避**（轮首 git status 查 Tools/perceptor+schema 脏即跳过 scan+verify 本轮——审计规格只列 Tools/perceptor，扩入 schema 的理由：半编辑登记簿同型结构性假 FAIL 面；**18:27:01 OS 真轮自动退避实证**+手动复证·退避轮照写日志注明理由 exit 0 非失败）；ctx 增 worldDir+探针模板契约同步；完成回执已落本仓根 HQ-FEEDBACK.md F-20260923-01（evolution §7 面制）
- [P1·待 CEO 署名] 集团审计转办件 **P-12**：DESIGN §七 映射表核心行为零事件源（OS_TICK_START/DONE·GATE_PASS/BLOCK·TASK_CLAIM·TRANSFER 全零发·城会静）——方案=tick/verify 补发轮次与门禁事件+fleet_tasks 登记即发+fleet/transfers 面探针；实施时新事件类型先走 T2 登记 events-registry（7 天否决窗）
- [P1·转 Biggame] 集团审计转办件 **P-13**：GAME 城 U 号令面盲区——Biggame 按其自治法定唯一 U 号台账面后，DevLoop 加 orders_bg 探针（orders/orders_bs/orders_hq 已覆盖 quant/media/governance 三面）
- [✅ 2026-09-23·r7] 集团审计转办件 **P-14**（P2）小病三件收口：①scan v0.6 quarantine 7 天生命周期（retention R4 两梯：文件 7d 未动整体清空+行级 ts>7d 修剪·fail-keep 不可龄行永不静默毁证·PS5.1 Z 律剥 Z 再 ParseExact）②github_events media 正则补 Bigmedia（`'BigStream|Stream|Bigmedia'`·-match 默认不区分大小写·media 域事件不再落 governance 默认）③`.gitignore` `.codely-cli/` 整目录行（原 scheduled_tasks/settings 两行子规则被吸收·轮首 `??` 噪音根除）；沙盒 14 断言全绿（过期行恰删/新鲜行留/坏行留/缺 ts 行留/7d 边界/陈档整清/zone 正则 6 例含无过匹配）+真机 scan+verify 双绿（14 探针 OK）
- [P1·CEO 已署名·进行中 r13·最高优] 集团审计转办件 **P-15 M1 引擎工程点火**（ledger P-2026-09-23-15·CEO 署名 P1 令 ~18:20「立项集团级元宇宙可视化项目，游戏化呈现，City 里是美术资产，开始走流程。优先级最高！」——**明文解除 DevLoop 引擎/美术禁区仅限此件**·认领制先到先得·分轮推进单轮 25min 预算）：①Tuanjie 原生 2D 工程（正交相机/Sprite/Tilemap·禁 3D 铁律）②City 资产接线（**实址勘正 r7：`gaming/MiniGame/Art Assets/AA-022_SceneBG背景_清洁城市与万圣节动画件_GuttyKreum/CleanCityv3`——953 件 1.32MB 与台账数吻合；ledger 载「Art Assets/City」已因 MiniGame U164 正名过时**）③静态城市骨架=北外滩脑塔+黄浦江+陆家嘴三城街区（concept-shanghai 构图）④事件路由器一件（CEO_ORDER 光脉冲先做）⑤判据=编辑器可跑+截图+一件事件驱动动画；**就绪面已勘明 r7：Tuanjie 1.10.3 编辑器（2022.3.62t15）已装于 `C:\Program Files\Tuanjie\Hub\Editor\2022.3.62t15`，MiniGame 三工程 ProjectVersion 实证同版——环境零障碍**；**首轮已收 r8**：工程骨架建成——tuanjie-cli projects create（内置 2D 模板 cn.tuanjie.template.2d@7.0.4）→ City/ 落仓，ProjectVersion=2022.3.62t15 与 MiniGame 三工程同版，SampleScene 正交相机（orthographic: 1）+2D 全家桶（feature.2d/tilemap/physics2d/particlesystem·禁 3D 铁律自检通过），Hub 创建流自动开编辑器（「City - SampleScene - Tuanjie Editor 1.10.3」）=编辑器可跑实证；下轮=②City 资产接线+③静态城市骨架（M1 判据已扩容 24h 四档色轮+天气粒子·71e976a）**；**r9 已执行②③但 25min kill 未提交**：844 件 CleanCityv3 入 City/Assets/Art + 批处理建 CityScene（2324 tileCells）+截图 m1-r9-cityskeleton.png——**重大缺陷已勘明 r10**：保存场景 Ground/Water/Roads 三层 `m_Tiles: {}` 全空（tileCells 2324≈仅建筑+props 证实），根因=Paint 闭包持有的 Tile 引用跨 NewScene 后假 null→`if(t!=null)` 静默跳过整层；**r10 已修**：builder 重构=RT() 逐格 LoadAssetAtPath 新解析（绝禁长命引用）+分层计数 fail-loud（空层即 throw 入 .done）+语义勘正（contact sheet+多模态实证：191/194=人行道〔r9 误当墙=「水塔」真相〕/000-004 真草〔r9 的 024/025 是沥青草过渡〕/189=玻璃幕墙〔正合脑塔〕/166/284/208=带标线道路/水提取件正确）+meta 自愈（拒收图块删 meta 强制重导）；**遗留 r11 已收口②③**：000 类图块「导入拒收」根因勘明=**MK() 把 ArtRoot 相对路径喂给 AssetDatabase**（只认 `Assets/` 起步的项目相对路径——batch-r10.log 444 行 `does not exist` 即 ImportAsset 空操作实证→meta 删除后重导从未发生→catalog 首项 000 即挂全连坐，r10「导入器层拒收」为误诊）；修=AssetDatabase 全调用改 `ArtRoot+"/"+spritePath`（File I/O 绝对路径不动）→meta 自愈真生效（000 无 meta 态重导重建）；重建 50s 全绿：saved=True **全层非空**（G:2121/W:606/R:488/三城 42·40·42/脑塔 18/props 32——r9 空层缺陷根除）+截图 m1-r11-cityskeleton.png 多模态 8 项验图绿（一江两岸+品字形三城+无水方块复现+无渲染空洞）；**r12 已收口④事件路由器一件**：Assets/Scripts/EventRouter.cs=FluxEventRouter 纯逻辑核心（只读轮询 world/world-events.jsonl 每 10s+内存游标+日轮转自愈〔行数<游标→回零·scan v0.4 轮转配套〕+CEO_ORDER→脑塔金色光脉冲〔procedural 径向光晕 SpriteRenderer 纯 2D 零资产依赖〕）+CityEventRouter MonoBehaviour 薄适配（懒初始化+SeekToEnd 零历史重放〔城今日出生同律〕）已入 CityScene 保存=play mode 真跑就绪；Assets/Editor/EventRouterProof.cs 批处理验证器（哨兵式同 r11）；沙盒 3 断言全绿（种子 3 行轮询 0 发〔历史禁重放〕/追发 1 CEO_ORDER 恰 1 脉冲/4s 模拟泄放零残留）+渲染断言绿（pulse_alpha_peak=1.00·**断言勘误一课：脑塔玻璃本底近白〔亮度 0.714〕而 CEO 金亮度 0.767 与之近等→亮度差 0.022 必败首跑；金脉冲对白塔的正确信号=暖色偏移 r−b〔−0.204 蓝调→−0.016 近中性·Δ0.189〕——亮色叠加于白底测色温不测亮度**）+截图 m1-r12-pulse-before/peak.png 双取证+多模态 3 项验图绿（金晕在塔基/城市完整无空洞/纯 2D 像素=禁 3D 自检过）；引擎只读 world/ 零写兄弟仓零；**下轮=M1 判据扩容项（24h 四档色轮+天气粒子·clock/weather 探针数据已就绪）→接 P-16 bigmoney.html 内景接入**；**r13 已收口 M1 判据扩容项（24h 四档色轮+天气粒子·引擎侧现实节律接线毕）**：AmbientWeather.cs=纯逻辑核心（AmbientWheel 四档边界同源 clock.ps1〔dawn5-8/day9-16/dusk17-19/night〕+调色板〔黄昏暖紫金=目标图气质·夜蓝黑+城灯电光青·紫粉仅环境色律遵守〕+WeatherRules 同源 weather.ps1〔wind≥17.2ms 或重 WMO 65/67/75/77/82/95/96/99→全城红警带〕+WeatherField 纯步进粒子场零 GameObject 可沙盒测）+CityAmbient 薄适配（只读轮询 world-state.json 每 10s·reality 扁平键 city_day_phase/beijing_hhmm/weather_kind/weather_code/weather_wind_ms·静默降级·断链回退本机钟）=天空渐变 quad（高 40=视口全渐变域）+城市带 tint（−16..+14 大气层）+程序化雨 140/雪 90 sprite 场+红色警带 sin 脉冲；AmbientProof 沙盒+渲染双取证 **197 断言全绿**（dawn 底暖 +0.35/dusk 底暖 +0.54/塔 day 0.714→night 0.552 夜染实证/雨 +1406 雪 +446 亮像素/警带 alpha 0.134+暖移 +0.273）+7 截图 m1-r13-{dawn,day,dusk,night,rain,snow,alert}.png+多模态验图绿（雨线全城散布/红警带横贯江面/黄昏暖染经 α0.15→0.22 加强后复跑双绿）；CityScene 已存 CityAmbient=play mode 真跑就绪；新法=程序化 Sprite 双陷阱（见新法行）；**r14 已领 P-17②相机双档并顺带勘明修复重大跨轮债**：r12/r13 场景布线（CityEventRouter/CityAmbient）因**MonoBehaviour 文件名律**（见 r14 新法行）跨会话全灭——r13 静默 fallback 五连叠幽灵 CityAmbient GO（HEAD 实测 5 个）、两轮「play mode 真跑就绪」宣称跨会话失效；r14 修复（类迁名匹配文件+幂等场景修复+跨会话 reload gate 10 断言绿）后才真就绪；**下轮=P-16 bigmoney.html 内景接入（引用不复制·L1 街道档视野已就绪）**
- [P1·CEO 令·v0 判据已收口 r17·bigmoney.html 先接一件] 集团审计转办件 **P-16 三司面板接入元宙 L1**（ledger P-2026-09-23-16·CEO 令 ~18:30「各个子公司可视化项目准备接入元宇宙项目，统一开发和管理，总控」·governance §1 集团层拥有表已加行=新可视化项目禁各司另建）：①接入协议落 TECH（L1 内景规范：城内建筑钻取→内景窗）②**引用不复制铁律**（Biggame 像素小镇看板/BigMoney bigmoney.html 禁重绘重建·引擎内嵌复用选型由 M1 工程实证）③统一像素壳层（1 号风 UI 框）归总控、面板数据面各司自治（r13 注：P-18 CEO 裁决已修正=「统一 GUIAgent 风格壳层」·城市世界像素正典不动）④判据=城内点建筑开内景窗见该司实况（先接 bigmoney.html 一件）；**r15 施工（25min kill 断件·r16 已补提交）**：InteriorRouter 纯核（QUANT 块 hit-test→file:/// 实址 URL→冷却门→OpenURL 注入）+CityInterior 适配+InteriorProof 三门（纯逻辑 27 断言/幂等布线/渲染门+跨会话 reload 门）+PS runner——**WebView 选型实证（r15）**：Tuanjie 1.10.3 Windows 独立平台无原生 WebView（managed 扫描仅 androidappview=Android 限定）→v0 等效=OS 默认浏览器窗开实址（引用不复制铁律断言在证明内）+引擎内 GUIAgent 玻璃横幅壳；v1 WebView2 嵌=后续债；**r15 渲染门 FAIL 逐像素勘明（r16 完成诊断）**：uGUI WorldSpace 横幅在批内 Camera.Render 渲染成 **ScreenSpaceOverlay**（renderMode=WorldSpace 赋值需 player-loop 画布更新、批内永不处理——实测横幅 2000×260 **屏幕px** 落屏左下角整条暗带，非世界 20×2.6 落位 (0,-19.35)；两跑数字逐位相同证 r15 锚点修=改错地方，锚点从非根因）；**r16 修=横幅重构为程序化 SpriteRenderer 三层栈**（halo 金晕 20.3×2.9/rim 金框 20.16×2.76/glass 暗玻璃 20×2.6·sortingOrder 20/21/22·z -9·r13 localScale 归一律白片 4px@16ppu）——批内与 play 同路径（r12 脉冲/r13 天空粒子已双实证）；证明 C2 亮/暖像素度量从「带内文字」改「金框环带」（文本层退为后续债：横幅 CJK 文案源=Assets/Data/interior-strings.txt·r17 候选=PS GDI+ 预烘焙 CJK 纹理入引擎）；**r17 证明双绿收口（v0 判据达成：点 QUANT 街区→实址内景窗见 BigMoney 实况）**：三门复跑一次过全绿——①批内 42 断言（暗玻璃带 0.405→0.322 暗化 0.083≥0.04 门·hide 后 0.405 逐位回基线；金框环带 bright=warm=3415px 远超 120/60 双门槛；幂等布线 attached=0·InteriorBanner 零入场景〔运行时律〕）②跨会话 reload 门 9 断言（CityInterior/CameraRig/Ambient 三组件全解析·相机 L0=20·实址 URL 解析 True·sky=144）③edge 实址 live 取证 173KB 非空壳；多模态双验图绿（横幅=暗玻璃带+金色发光框环+城市零空洞；bigmoney.html=真数据面：因子 IC 条形图/净值/6 交易员名册/当日事件日志）；基线与 reload 截图与 r16 提交版逐字节复现=场景稳定性旁证（r16 kill 窗口估算暗化~0.2 偏高——法=提交断言门 0.04·实测 0.083 双余量过）；**L1 内景协议 v0 落位**=城内点 QUANT 街区→file:/// 实址开 bigmoney.html（引用不复制断言在证明内·v0 OpenURL 等效）+引擎内 GUIAgent 暗玻璃金框横幅壳 6s 生命·运行时构造永不入场景；后续债两行=横幅 CJK 文案层（interior-strings.txt 已备·PS GDI+ 预烘焙纹理入引擎=r18 候选）+GAME/MEDIA 城注册行（Biggame 像素小镇看板/BigStream 面板接线后续轮）；**r18 已收口 CJK 文案层**：Tools/city/bake-banner-text.ps1（ASCII 律·CJK 全在 UTF-8 数据件）GDI+ 烘焙 1000×130 透明 PNG（YaHei·自适应字号 42/24px·title 金/note 冷灰）→ City/BannerData/（**Assets 外**：运行时字节路径不走导入器·禁同图双身份）→ CityInterior Text 层（sortingOrder 23·File.ReadAllBytes+LoadImage+显式 Apply·bake ppu 50=20×2.6 与玻璃逐位同域）；证明 55+10 断言双绿（r16 环带门原样 3415 逐位复现·暗化门迁非文字子群 base0.405→on0.325 Δ0.080≥0.03·文字门 text_px 7375=纯 glyph 墨迹 Δ≥300·渲染时内省 8 断言=Text 子件/次序 23/界 20×2.6/纹理背景 alpha 0.00<0.10/标题行有墨）+多模态五项绿（暗玻璃+金框+金标题可读+note 可见+零伪影）；**假根因警示录**：首跑渲染=整块金矩形，两轮误诊（导入器干扰论+Apply 论·两次「修复」后数字逐位不变=改错地方的 r16 定律应验）——真凶=r18 加 Text 层时误删 glass.localScale 行（玻璃塌成 0.25u 小方块=截图中「深色小方块」伪影·金 rim 成面板本体）；法：**改共享构造体后必验既有层完整**（本证明的渲染时内省只看 Text 子件未看 Glass——已由环带 3415 逐位复现兜底捕获）
- [P1·CEO 令·②已收口 r14·③④⑤为参数正典] 集团审计转办件 **P-17 呈现层参数规格 v1**（ledger P-2026-09-23-17·CEO 令 ~18:40「确定好迭代频率，建筑角色比例，摄像机高度啊什么的」）：①资产路径修正已由 r7 勘正（AA-022 CleanCityv3 实址）②**相机双档**=正交 PPU16 point filter·L0 全景档 Size 20（视野 71×40 tiles·一江两岸主城带·镜头缓漂）↔ L1 街道档 Size 9（32×18 tiles·看建筑门脸/机器人/内景窗）·切换 1.2s ease 插值禁瞬跳（r13 相机仍 Size 20 单档=本件主施工面）→**r14 施工收口**：CameraRig.cs 纯核（RigMath smoothstep 零端速缓动+带内 clamp+漂移 48s/37s 双周期 amp 2.5/1.0；RigTween 动靶追踪插值——L0 漂移是活靶、落地无缝=禁瞬跳的构造性保证）+CityCameraRig.cs 适配（左键点世界点→L1 街道·Esc/右键→L0·编辑态批证明与 play 走同一 Advance 核）；CameraProof 沙盒+渲染+跨会话三取证 **60+10 断言双绿**（mid_size=14.50 精确插值中点/quant 街景天空余量 7/0 像素/tower 0/7/回位 L0 天带 164/99 复现/QUANT 金面 warm 0.21/塔面 bri 0.61/漂移回位 (1.26,0.63)=Drift(4.05) 手算吻合）+6 截图 m1-r14-{l0,mid,l1-quant,l1-tower,l0-return,reload}.png+多模态验图绿（两街道档满框街景+金楼+玻璃塔+江带）③比例律=普通建筑 2-4 tile 高/沿街商铺 2 tile/办公楼 4-6 tile/地标 96-160px/街道机器人 16×16 灯流主角/居民 32×32/信使粒子 8px/角色:建筑≈1:4（小角色大城）④迭代频率=开发侧 DevLoop 10min 轮+每日一版（每版判据推进+截图入仓）；运行时侧=事件轮询 10s（TECH 正典）·呼吸灯 10min 拍·日夜真实北京时间·像素动画 10fps·CEO_ORDER 脉冲 2s·commit 粒子穿城 15-30s⑤场景结构=单场景一江两岸大 Tilemap（江 12-15%/北 45%/南 40%·BLUEPRINT §三 施工面）
- [P1·CEO 令·已转办入册待领·与 M1 同线] 集团审计转办件 **P-18 UI 壳层风格正典：GUIAgent 展示风**（ledger P-2026-09-23-18·CEO 令 ~18:55「所有可视化项目以这个美术风格为准，统一开发和风格」+CEO 明示裁决=方案 A：UI 壳层用此风格，城市世界像素正典不动——修正 P-16③）：双层风格正典=①世界层 1 号高清赛博像素+黄昏目标图**不变**（CEO 2D 铁律）②操作层（UI 壳）=GUIAgent 风：水晶质感按钮（2D 拟态=玻璃拟态+高光+发光描边）/柔光高级灰暗部/月光式 LUT 调色（冷蓝暗+暖光点缀）/玻璃拟态面板（半透明+细描边）/立体字（2D 阴影+发光模拟）/克制极简布局——**全部 2D 光效实现禁 3D 不变**③风格源=C:\Agent\gui-agent\GUIAgentUnity（官方演示工程·只读参照学实现禁资产搬运）④判据并入 M1=UI 壳一套（按钮/面板/内景窗框）风格实证截图·三司内景窗壳层一体适用
- [P1·CEO 令·转办入册待领·与 M1 同线] 集团审计转办件 **P-21 城市美术资产库消费+统一风格门禁**（ledger P-2026-09-23-21·CEO 令 ~21:58「我的美术资源库好好利用，但要统一风格」——M1 现仅用 AA-022 单包，库内 47 包 20.5GB 未挖）：①消费链四通道=城内每个美术需求走 S 库→AA-L2 直用（四闸·U121 轻档能用就用·授权闸=用户已全量确认购置合法台账留痕）→L1 参考/img2img→纯生成最后手段；②风格门禁（CEO「统一风格」）=锚 docs/design/art-target-dusk.png+1 号高清赛博像素正典——每件入城一行和谐度自检（色调/线条密度/质感 vs 目标图）+2D 铁律+五色律光色归位·禁卡通/Q 版/写实混入世界层·UI 壳面走 P-18；③来源台账=每包消费一行（AA 标签+一句话+入城日期）落本节资产台账；④弃用留痕义务照库 §七；⑤授权红线=L1 件永禁直入工程（版权）·跨机取件走 R-TRANSIT；城市向候选=AA-016 现代像素城镇全套（L2·16/32/48px+现代室内+人物/头像生成器）/AA-021 室内图块（P-16 内景窗面·L2）/AA-028.39/47-50/51-55 季节城市图块（L2）/AA-028.34/36 城市建筑矢量（L2）/AA-034 Unity 粒子包（节日烟火·CC0 unitypackage 直导）/AA-030/032/037 UI 反馈音效+AA-038 chiptune（引擎 UI 壳/城市场景音·CC0/CC-BY 署名）
- [P1·CEO 令·转办入册待领·M2/CityWatch 线] 集团审计转办件 **P-22 BigLife 万人户籍库消费接线**（ledger P-2026-09-23-22·CEO 令 ~21:30「你专门生产超体元宇宙城市的所有居民，先来一万个」）：①只读消费=BigLife census/export/citizens-light.jsonl（id/name/species/faction/district/block/profession/axis/creed/age——M2 居民姓名身份池+CityWatch 人口统计面板零引擎依赖先行）；②契约=BigLife CODEX §十二（字段变更 T2+7 天否决窗先登记后产出·导出面 R3 可再生）；③诚实律边界=实锚居民与叙事市民分层呈现（CODEX §一·叙事人口在城内呈现须带「叙事层」标识）
- [P1·CEO 令·转办入册待领·与 P-22 同线] 集团审计转办件 **P-23 城市认知面消费接线**（ledger P-2026-09-23-23·CEO 令 ~23:10「你规划好，落地执行，科学执行」——居民大脑五层落地批）：①CityWatch 居民之声 v2=读 BigLife cognition/pools.json+citizens-light.jsonl——城主开观城台→按真实情境（事件>天气>时段契约）抽 3-5 位居民气泡台词（零 LLM 零 token）+点居民→spotlight.py 事实级应答（本地 LLM）；②M2 barks=引擎气泡层消费 pools.json（<24 字·同画面≤2 气泡·注意力配给律）；③诚实律接线=池=情境口气零事实·事实门=真实激活·事实级=聚光灯喂什么说什么
- [P2·转办件·新入册 2026-09-23 23:35] **P-27 音频资产层接线**（ledger P-2026-09-23-27·CEO 令 ~22:47「你这个对话专门寻找超体宇宙城市需要的音乐音效等资产，可以下载免费商用的，也可以去自己生产」——音频资产线首批已落仓：`City/Assets/Audio/` 36 件分层入位[ambience 1/music 4/weather 5/sfx_scifi 16/signature 10]·37.31MB·逐件台账=`City/Assets/Audio/AUDIO-LEDGER.md`·研究正典=`docs/research/R-20260923-audio-assets.md`·许可已逐源验证=7 源 CC0+1 库 CC-BY 3.0·魔数全验 0 坏头）：①事件路由器按 R- §1.1 表挂音（与 DESIGN §七 1:1·事件类型零新增=纯呈现层）；②BGM 四档接 clock city_day_phase+天气层接 weather_kind（M1 既有数据面）；③混音建议=环境 0.5/事件 SFX 0.8/签名 1.0/BGM 0.35（禁盖过城市信息）；④首件判据=CEO_ORDER 触发 `signature/ceo_order_pulse` 引擎实证（与 P-15 光脉冲同事件双呈现）；⑤音频 .meta 由首个编辑器轮导入时生成并定向提交（本批无 .meta=新目录未过引擎属正常态）；⑥署名义务=sfx_scifi 16 件 CC-BY 3.0（credits 模板=AUDIO-LEDGER.md 顶部）；⑦待试听校准=BGM 四档分配与循环接缝（环境音频理解腿未开·R- §五诚实律）——**原 23:08 在飞件 `Tools/audio/synth_sfx.py` 已随本批提交（在飞标记解除·引擎音频施工归本件自领防双领）**
- [P2·转办件·新入册 2026-09-23 23:55] **P-28 城市视觉资产批 2 消费接线**（ledger P-2026-09-23-28·CEO 令 ~23:31「城市还需要什么资产 都去弄」——`City/Assets/ArtPacks/` 六包 334 件已入库：warped-city 霓虹招牌 171/cyber-city 图块 11/parallax-skyline 视差 8/residents-crowd 市民 31/tophat-robot 16×16/ships-ripple 112·本体台账=`City/Assets/ArtPacks/ARTPACKS-LEDGER.md`·正典=`docs/research/R-20260923-city-art-assets.md`·许可 CC0×3/OGA-BY×2/CC-BY×2 已验·八格对比图多模态验图毕）：①风格门禁=世界层入城件过 1 号高清赛博像素+art-target-dusk.png 锚和谐度自检一行结论（parallax 平滑画风与 ships 俯视角两包须过闸：雾化远景/像素化转译/弃用留痕三选一）；②优先接线面=warped 霓虹招牌（§九「霓虹街牌 FLUX/CPH4/公司名」判据面·PSD 源可就地改公司名）+skyline 背景层（大气透视）+tophat-robot 街道机器人变体（16×16 正中 P-17 规格）+residents-crowd 街道 NPC 池（M2·与 P-22 census 同线·池内主力 AA-016.04）；③池内覆盖消费=车辆 AA-016.02/光效 AA-034/字体 FT-011+016（引用不复制）；④施工件走 S 库线@Biggame（BoardForge 工地语法）；⑤图标件 M3 UI 壳期再定；⑥Kenney Watercraft=3D 模型包整包弃（2D 铁律·台账留痕）
- [新法·已立·CityWatch 实战 2026-09-23] **PS5.1 Get-Content ETS 陷阱**：Get-Content 每行携带 ETS 注记属性（PSPath/PSDrive/Provider 对象图），此类 PSObject 喂给 ConvertTo-Json 会把整个 .NET 类型图序列化——**实测每行膨胀 ~2.23MB**（40 行=89MB 载荷/OOM）。法：任何要进 ConvertTo-Json 的行先 `[string]$_` 解包（CityWatch 生成器已按此修）；同族教训=PS5.1 无 BOM UTF-8 脚本体被 GBK 误读（中文只能进数据件）
- [新法·已立·r10 批处理实战 2026-09-23] **批处理编辑器三路径律**：同一资源在 Tuanjie/Unity 批内有三套基准——AssetDatabase API 吃项目相对路径（`Assets/Art/...`）；System.IO（File.Exists/Delete）吃绝对路径且 **编辑器进程 CWD≠项目根**（Start-Process 继承调起方 CWD——r10 实证相对路径 delete 全程空操作）；资源目录内相对引用（ArtRoot 相对）拼绝对路径时必须显式 `ProjectRoot+ArtRoot+子路径`（漏拼 ArtRoot 曾误判「文件不在盘」）。**r11 补证：AssetDatabase 喂目录相对路径（漏 Assets/ 前缀）不抛错只日志 `does not exist`——LoadAssetAtPath 静默 null/ImportAsset 空操作同罪，勿与导入器层故障混淆（P-15 000「拒收」误诊一轮的根因）**。另证：**跨 NewScene 持有 Tile 等 Object 引用会假 null**（r9 三层静默空根因）——批内建场景一律用时即时 LoadAssetAtPath；**拷贝入仓的第三方 .meta 不可信**（CleanCity_000 类被资产库拒收、同批 007 却正常——fresh meta 重导仍未愈，根因在导入器层待查）
- [新法·已立·r13 批处理实战 2026-09-23] **程序化 Sprite 双陷阱**：①SpriteRenderer.localScale=**相对乘数**，Sprite.Create 自然 world 尺寸=像素/PPU——铺全屏 quad 必须按 `sx/sprite.bounds.size` 归一（r13 首跑把 46 直喂 localScale×4 单位自然高=184 巨幕，相机只见渐变中段永不到顶色；tint 缩成 23×11.5 迷你块罩不住城——fail-loud 断言当场捕获，两跑勘明）；②ReadPixels→GetPixel 行序 **y=0=图底**（EncodeToPNG 才翻上-下显示序）——区域取样窗必须按 world-y 换算式 `(row/1080−0.5)×40`（r12 BoxMetrics 公式本正、r13 首版窗上下反装：dawn「底窗」实测 −0.135 实为顶空）；配套视觉律=天空 quad 高=视口 40（可见带达 skyTop/skyBottom 极色）+tint 只罩城市带 −16..+14（天空保持纯渐变，黄昏紫顶不被暖 tint 抵消）
- [新法·已立·r14 批处理实战 2026-09-23] **MonoBehaviour 文件名律（SEPARATE FILE LAW）**：组件类必须住在 `<类名>.cs`——名不匹配时 Tuanjie 批存场景写 embedded class-name stub（m_Script 指场景内 !u!115 块的 m_ClassName），**跨会话重载不解析→GetComponent 返回 null→组件变 Missing script**。实证链：r12/r13 适配类（CityEventRouter@EventRouter.cs·CityAmbient@AmbientWeather.cs）布线全灭——r13 静默 fallback 每跑叠一个幽灵 CityAmbient GO（HEAD 实测 5 个）、两轮「play mode 真跑就绪」跨会话失效；修复三件=①类迁名匹配文件（CityEventRouter.cs/CityAmbient.cs/CityCameraRig.cs，纯核留原文件）②幂等场景修复（删幽灵 GO+`GameObjectUtility.RemoveMonoBehavioursWithMissingScript` 剥死组件——**Missing script 在 GetComponents 枚举为 null，DestroyImmediate(null) 会 NRE**）③**跨会话 reload gate**（第二编辑器会话重开场景断言三组件全解析+冷启渲染——批内绿≠存盘活，r12/r13 缺此门故债静默滚大）
- [新法·已立·r14 渲染断言实战 2026-09-23] **夜景色彩断言律**：CleanCity 资产路面/道路本就是蓝灰像素+夜 tint 加蓝（实测铺装 b−r +0.32·avg 0.40），「只有水是蓝」直觉失效（首版河带分类器量出 837px=整条 tint 带）；稳健变焦度量=**天空带门**（全景视野 40u>城带 31u→必有 ≥9u≈243px 天空分上下两半；街道档 18u 夹在带内→0 天空；只平移不缩放无法同时藏住两半天——几何保证）。夜天空分类阈值=avg<0.13 ∧ b−r<0.18（实测 skyBottom 0.112/0.145 与暗蓝河 0.159/0.220 双余量分离）；另证：**面断言必须框均值**——单像素取样踩中窗暗纹（QUANT 面单点 r−b −0.086 vs 40px 框均值 +0.196）
- [新法·已立·r16 批渲染实战 2026-09-23] **uGUI 批内 ScreenSpaceOverlay 陷阱**：WorldSpace Canvas 的 renderMode 赋值依赖 player-loop 画布更新——批内（-batchmode Camera.Render）永不处理，画布按创建时默认 Overlay 模式渲染，且 RectTransform 尺寸按**屏幕像素**落屏（r15 横幅实证：2000×260 画布px → 屏左下整条 1920×256px 暗带，暗带色 (110,91,49)=glass α0.82+halo α0.16 线性空间混合——全栈真渲染了、只是渲染在错的坐标系）；同批衍生陷阱：**两跑断言数字逐位相同=改的不是根因**（r15 锚点修在错误诊断上白改一轮）；法：**批内取证的 UI 一律走程序化 SpriteRenderer**（r12 脉冲/r13 天空同路径·批内 play 同构），uGUI 仅限 play-mode 交互面使用；像素级诊断法=双截图 signed 通道差分（dRGB 大而亮度差小=色相旋转非变暗·样本逐点 RGB 直接读色可辨混合栈成分）
- [P2] 探针侧中文乱码债：git 探针 commit 摘要为 UTF-8 git 输出被 PS5.1 按 GBK 捕获→事件流 summary 乱码（CityWatch 渲染实证）；修法需按各探针捕获模式定 Console 编码策略（归 DevLoop）；另 market 的 change_pct 字段今日快照 undefined——探针侧核字段（CityWatch 已做兜底计算）

## 十、溯源

- 基建令：CEO 2026-09-23「把超体宇宙城市的整个技术底座基建搞扎实，能拓展，能自我更新和迭代，能自动化」（本会话）；
- 机制同源引用：OS 循环（MiniGameEngineTick/Bigmoney-IterationLoop 范式）· 门禁链（X026Gate 家族）· 登记簿仲裁（BRAND §8/governance §2 范式）· 编码律（集团 PS5.1 实证）。
