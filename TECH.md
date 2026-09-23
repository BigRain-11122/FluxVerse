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
│   └── tick/ (tick.ps1 + mandate.txt)
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
- [P1] 城市美术资产管线（风格已定案「高清赛博像素」=CEO 附图三裁决 2026-09-23·d021a49·M0 收口；下一步=城市版概念稿黄昏档+夜档）
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
- [P1·CEO 已署名·进行中 r8·最高优] 集团审计转办件 **P-15 M1 引擎工程点火**（ledger P-2026-09-23-15·CEO 署名 P1 令 ~18:20「立项集团级元宇宙可视化项目，游戏化呈现，City 里是美术资产，开始走流程。优先级最高！」——**明文解除 DevLoop 引擎/美术禁区仅限此件**·认领制先到先得·分轮推进单轮 25min 预算）：①Tuanjie 原生 2D 工程（正交相机/Sprite/Tilemap·禁 3D 铁律）②City 资产接线（**实址勘正 r7：`gaming/MiniGame/Art Assets/AA-022_SceneBG背景_清洁城市与万圣节动画件_GuttyKreum/CleanCityv3`——953 件 1.32MB 与台账数吻合；ledger 载「Art Assets/City」已因 MiniGame U164 正名过时**）③静态城市骨架=北外滩脑塔+黄浦江+陆家嘴三城街区（concept-shanghai 构图）④事件路由器一件（CEO_ORDER 光脉冲先做）⑤判据=编辑器可跑+截图+一件事件驱动动画；**就绪面已勘明 r7：Tuanjie 1.10.3 编辑器（2022.3.62t15）已装于 `C:\Program Files\Tuanjie\Hub\Editor\2022.3.62t15`，MiniGame 三工程 ProjectVersion 实证同版——环境零障碍**；**首轮已收 r8**：工程骨架建成——tuanjie-cli projects create（内置 2D 模板 cn.tuanjie.template.2d@7.0.4）→ City/ 落仓，ProjectVersion=2022.3.62t15 与 MiniGame 三工程同版，SampleScene 正交相机（orthographic: 1）+2D 全家桶（feature.2d/tilemap/physics2d/particlesystem·禁 3D 铁律自检通过），Hub 创建流自动开编辑器（「City - SampleScene - Tuanjie Editor 1.10.3」）=编辑器可跑实证；下轮=②City 资产接线+③静态城市骨架（M1 判据已扩容 24h 四档色轮+天气粒子·71e976a）**；**r9 已执行②③但 25min kill 未提交**：844 件 CleanCityv3 入 City/Assets/Art + 批处理建 CityScene（2324 tileCells）+截图 m1-r9-cityskeleton.png——**重大缺陷已勘明 r10**：保存场景 Ground/Water/Roads 三层 `m_Tiles: {}` 全空（tileCells 2324≈仅建筑+props 证实），根因=Paint 闭包持有的 Tile 引用跨 NewScene 后假 null→`if(t!=null)` 静默跳过整层；**r10 已修**：builder 重构=RT() 逐格 LoadAssetAtPath 新解析（绝禁长命引用）+分层计数 fail-loud（空层即 throw 入 .done）+语义勘正（contact sheet+多模态实证：191/194=人行道〔r9 误当墙=「水塔」真相〕/000-004 真草〔r9 的 024/025 是沥青草过渡〕/189=玻璃幕墙〔正合脑塔〕/166/284/208=带标线道路/水提取件正确）+meta 自愈（拒收图块删 meta 强制重导）；**遗留 r11**：CleanCity_000 类图块 sprite 导入拒收根因（fresh meta 重导仍 null→查 batch-r10.log 导入错误行；或降级换 r9 已实证可导入集 007/009/191/194/189/166/284/208）
- [P1·CEO 令·与 P-15 同线推进] 集团审计转办件 **P-16 三司面板接入元宙 L1**（ledger P-2026-09-23-16·CEO 令 ~18:30「各个子公司可视化项目准备接入元宇宙项目，统一开发和管理，总控」·governance §1 集团层拥有表已加行=新可视化项目禁各司另建）：①接入协议落 TECH（L1 内景规范：城内建筑钻取→内景窗）②**引用不复制铁律**（Biggame 像素小镇看板/BigMoney bigmoney.html 禁重绘重建·引擎内嵌复用选型由 M1 工程实证）③统一像素壳层（1 号风 UI 框）归总控、面板数据面各司自治 ④判据=城内点建筑开内景窗见该司实况（先接 bigmoney.html 一件）
- [新法·已立·CityWatch 实战 2026-09-23] **PS5.1 Get-Content ETS 陷阱**：Get-Content 每行携带 ETS 注记属性（PSPath/PSDrive/Provider 对象图），此类 PSObject 喂给 ConvertTo-Json 会把整个 .NET 类型图序列化——**实测每行膨胀 ~2.23MB**（40 行=89MB 载荷/OOM）。法：任何要进 ConvertTo-Json 的行先 `[string]$_` 解包（CityWatch 生成器已按此修）；同族教训=PS5.1 无 BOM UTF-8 脚本体被 GBK 误读（中文只能进数据件）
- [新法·已立·r10 批处理实战 2026-09-23] **批处理编辑器三路径律**：同一资源在 Tuanjie/Unity 批内有三套基准——AssetDatabase API 吃项目相对路径（`Assets/Art/...`）；System.IO（File.Exists/Delete）吃绝对路径且 **编辑器进程 CWD≠项目根**（Start-Process 继承调起方 CWD——r10 实证相对路径 delete 全程空操作）；资源目录内相对引用（ArtRoot 相对）拼绝对路径时必须显式 `ProjectRoot+ArtRoot+子路径`（漏拼 ArtRoot 曾误判「文件不在盘」）。另证：**跨 NewScene 持有 Tile 等 Object 引用会假 null**（r9 三层静默空根因）——批内建场景一律用时即时 LoadAssetAtPath；**拷贝入仓的第三方 .meta 不可信**（CleanCity_000 类被资产库拒收、同批 007 却正常——fresh meta 重导仍未愈，根因在导入器层待查）
- [P2] 探针侧中文乱码债：git 探针 commit 摘要为 UTF-8 git 输出被 PS5.1 按 GBK 捕获→事件流 summary 乱码（CityWatch 渲染实证）；修法需按各探针捕获模式定 Console 编码策略（归 DevLoop）；另 market 的 change_pct 字段今日快照 undefined——探针侧核字段（CityWatch 已做兜底计算）

## 十、溯源

- 基建令：CEO 2026-09-23「把超体宇宙城市的整个技术底座基建搞扎实，能拓展，能自我更新和迭代，能自动化」（本会话）；
- 机制同源引用：OS 循环（MiniGameEngineTick/Bigmoney-IterationLoop 范式）· 门禁链（X026Gate 家族）· 登记簿仲裁（BRAND §8/governance §2 范式）· 编码律（集团 PS5.1 实证）。
