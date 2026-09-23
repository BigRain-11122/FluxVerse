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
├── scan.ps1            # 编排主脚本（固定：游标/事件出口/装配/输出）
├── probes/             # 探针目录（登记即生效·按文件名排序执行）
│   ├── _template.ps1   # 新探针标准模板
│   ├── evolution.ps1   # cph4/evolution-ledger.md → 提案数
│   ├── fleet_machines.ps1 # fleet/machines/*.json → fleet 实体+HEARTBEAT
│   ├── fleet_tasks.ps1 # fleet/tasks/*.json → tasks
│   ├── git.ps1         # 5 仓 git → COMMIT 事件+zones 活跃度+history
│   ├── orders.ps1      # fleet/orders/*.md → CEO_ORDER
│   └── snapshot.ps1    # MiniGame 自动化快照 → GAME 城活跃脉冲
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

## 四、验证门禁 verify.ps1（扎实正体·数据质量闸机）

每次产出后校验，**FAIL 即阻断当轮**（旧 state 保留不覆盖）：
1. world-state.json 可解析 + protocol 版本已登记；
2. zones/fleet/tasks/products 数组结构完整、必填字段在位；
3. world-events.jsonl 每行可解析 + type 在登记簿内；
4. 时间戳格式合法；
5. 退出码：0=PASS，1=FAIL（tick 据此决定是否上轮日志报警）。

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

- 形态：10 分钟一轮，`Tools/tick/tick.ps1` 直调，中文 mandate 外置 `Tools/tick/mandate.txt`（编码律：脚本 ASCII，中文在 UTF-8 数据件）；
- 每轮职责（v1.0）：①跑感知器 ②跑验证门禁 ③健康检查（写 logs/）④技术债自领（见 §九 backlog，P0 小步直改，P1+ 记 backlog 待 CEO 署名）；
- **升级须 CEO**：新探针上新事件类型属 T2（7 天否决窗）；改协议版本/动引擎架构属 P1 须署名；
- 反重复铁律：先读后写、复用禁重建、同仓单执行体退避（多窗时先 git status）。

## 七、自动化部署（已点火）

- 计划任务 `FluxVerseTick`：每 10 分钟，无人值守；
- 日志：`logs/tick-YYYYMMDD.log`（gitignored，轮转保留 7 天）；
- 健康指标：每轮 PASS/FAIL + 事件增量数 + fleet 在线数。

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
- [P2] jsonl 按日轮转归档
- [P2] MiniGame 任务面板/BigStream 产出探针
- [P2] HQ-FEEDBACK 感知探针（向上反馈通道可视化）
- [P1] 风格定稿 → 城市美术资产管线

## 十、溯源

- 基建令：CEO 2026-09-23「把超体宇宙城市的整个技术底座基建搞扎实，能拓展，能自我更新和迭代，能自动化」（本会话）；
- 机制同源引用：OS 循环（MiniGameEngineTick/Bigmoney-IterationLoop 范式）· 门禁链（X026Gate 家族）· 登记簿仲裁（BRAND §8/governance §2 范式）· 编码律（集团 PS5.1 实证）。
