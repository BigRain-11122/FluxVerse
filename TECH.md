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
├── scan.ps1            # 编排主脚本（固定：游标/事件出口/装配/输出·含 reality 装配段 M1.5+按日轮转 r3）
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
│   ├── orders_hq.ps1   # 集团台账 docs/orders.md → CEO_ORDER（governance 面）
│   ├── snapshot.ps1    # MiniGame 自动化快照 → GAME 城活跃脉冲
│   └── weather.ps1     # Open-Meteo 上海 → 天气片段+WEATHER_ALERT（M1.5·零 key）
└── verify.ps1          # 验证门禁（schema+登记簿校验）
```

**探针契约**（写进 `_template.ps1`，违反契约=门禁拒绝）：
1. 只读：绝不写任何兄弟仓；
2. ASCII-only 脚本体，中文只存在于数据；
3. 必须定义 `Probe-<文件名>` 函数，入参 `$ctx`（root/now/cursor/事件出口），返回 `state` 哈希片段由主脚本装配；
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
6. 退出码：0=PASS（含自愈告警），1=FAIL（仅结构性问题：state 坏/registry 坏；tick 据此报警）。

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

- 形态：10 分钟一轮，`Tools/tick/tick.ps1` 直调，中文 mandate 外置 `Tools/tick/mandate.txt`（编码律：脚本 ASCII，中文在 UTF-8 数据件）；单实例锁=`logs/tick.lock`（15 分钟陈旧接管·CEO 审计修 S1）；
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
└── （未来）City/ 团结引擎 2D 工程
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

## 十、溯源

- 基建令：CEO 2026-09-23「把超体宇宙城市的整个技术底座基建搞扎实，能拓展，能自我更新和迭代，能自动化」（本会话）；
- 机制同源引用：OS 循环（MiniGameEngineTick/Bigmoney-IterationLoop 范式）· 门禁链（X026Gate 家族）· 登记簿仲裁（BRAND §8/governance §2 范式）· 编码律（集团 PS5.1 实证）。
