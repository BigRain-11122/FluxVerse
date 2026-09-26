---
name: fluxverse-city-sandbox
description: FluxVerse 超体宇宙城「布设沙盒轮」门族——City 场景任何新布设/迁移（楼体、席位、檐位、舱体、招牌、街具、光效挂载、新资产落位）落位前的几何可行性机械定谳与断言门施工。Use when a FluxVerse DevLoop/tick round must place, relocate, or re-census anything in the City scene, author a Tools/city/<name>-manifest.json unique geometry source, or run a 布设沙盒断言门. 十五代实证 r103/r111/r123/r137/r141/r147/r154/r157/r159/r169/r170/r176/r186/r188/r189.
---

# FluxVerse 布设沙盒轮（City 布设可行性门族）

城市场景「零迁移纪律 + 唯一几何源」的执行面：新布设先过本门族全绿，才进引擎轮。本技能 = 沙盒轮固定工序 + 门族常量 + PS5.1 陷阱律的跨会话固化（源 = TECH §九 十五代沙盒轮 r103→r189 定谳·建队役 r170+四役 r176/r186/r188/r189）。

## 硬律（每轮先读）

1. **单一几何源**：布设定谳件 = `Tools/city/<name>-manifest.json`（协议 `fluxverse-<name>/0.1`；语义变更必升版本号——r146/r158 两先例）。引擎轮只照 manifest 施工，禁另起几何。
2. **零迁移优先**：先证「不动任何活件」可行；必须迁移时席位最小移动集硬编码入 manifest（r104 move_census 先例），A0 报数。
3. **活表解析禁拷贝**：一切实体坐标从活表/manifest 现场解析（正则表 = `references/active-tables.md`），A0 锚点计数断言（32 席/8 机/8 车/21 招牌/8 楼/6 办公/5 锚/vcols −18,−17,17,18）防表格式漂移静默。
4. **ASCII-only + 显式 UTF8**：harness 禁中文字面量（码位构造或外置 UTF-8 数据件）；读 CJK 件一律 `-Encoding UTF8`。动笔前先读 `references/ps51-traps.md`。
5. **宁红勿假绿**：门禁红 = 先诊断后修，禁暗降阈值；红在 harness 面时先自审门面（r154 A6b 门面首红自证律——三探针：产物独立复算/探针行为指纹/门面括号 bug）。
6. **负结果诚实律**：不可行 = 必要性/充分性如实定谳（r169「2u 资产必要不充分」范式）；规格变更属决策面，呈 CEO（F- 件）裁，禁静默缩规格。

## 工序（六相·单轮 1-2 相·宁小勿大）

**Phase 0 勘定**：读正典（DESIGN 相关节 + TECH §九 对应行/r 系勘定行）+ 资产盘验（IHDR 尺寸直读禁猜路径）。三径判定（直用/自焙/外采）+ 风格闸（r44 律：环境 tint 乘性重映射 + 五色律光色归位 + art-target-dusk 锚；FAIL 回退换件禁静默留）。

**Phase 1 活表 census**：复制 `scripts/sandbox-harness-template.ps1` → `logs/devloop-r<N>-<name>-test.ps1`，填 FILL 段（轮内专属面），跑 A0 + **A0b PSA 高值子集顾问位**（T-FV-125：auto-var 赋值/null 序/BOM 三律自扫·噪音层 grandfather 排除·PSA 模块缺席=可见 note 降级）。锚点计数全绿才继续（表漂移当场 fail-loud）。

**Phase 2 门族推导**：候选件 world rect 过全套物理门（常量与实体几何推导式 = `references/gate-family.md`：L0 框 ±35.256/带界 −16..+15/sec8 立足/整数 y/高度帽/席位 2.2/机 2.0/车 2.8/招牌包络 1.065/牌牌 2.75/檐下共边/MountX 夹持/相异律…）。主障碍集 = 全活源并集（r169 集合式：楼+办公+台面+大道带+在册 manifest 全件+席位×3+檐位×3+机×2+车+招牌+锚点），禁漏类。

**Phase 3 sweep 双径**：**解析净跨法先行**（区间合并求具名最大净跨 = 精确证明）→ 1/6u 格点扫描机械复证（r169 新法：解析法给结构、格点法兜网格洞）。swap 场景（摘除某件重开窗）按需加。

**Phase 4 探针钉版**：负控（已知违例位置必起火 = 门非空转）+ 正控（已知净位必过门）+ 判负窗具名 blocker 探针（r123 起火法：每窗一个具名障碍物探针）+ 光层报告（光效非物理门：晕溢被邻楼遮 = 自然物理，如实报禁静默——r169 A4b）。

**Phase 5 verdict + 照单**：verdict print 块（pass/fail 计数 + 定谳语 + 缺口呈报面）+ manifest `coupled_updates` 施工件清单（引擎轮唯一入参：纯表/证明扩容/截图/台账行）。收尾：TECH §九 一行收口 + 定向 commit。

## 断言纪律

- 双 parse 确定性断言（同件两读字节等）；每个门具名 fail-loud；任一红 `exit 1`。
- harness 留 `logs/`（gitignored·证据摘录进 §九 行）；manifest 入 git = 唯一几何源正典。
- 门族常量改动必随代勘正：先复跑邻接证明面（r51 证明基线漂移律），零静默改值。
- gitignored 路径（logs/·world/）glob/grep 零命中——被忽略档一律 PS 直读（r159b）。
