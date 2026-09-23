# FluxVerse → 集团 反馈面（HQ-FEEDBACK）

> evolution.md §7 面制：行级追加，格式 `| F-<日期>-<NN> | 紧急度 | 现象 | 证据 | 建议方向 | 状态 |`。集团层只读收取（周进化轮必扫·未处理超两周自动升级 CEO 待办）。

| ID | 紧急度 | 现象 | 证据 | 建议方向 | 状态 |
|---|---|---|---|---|---|
| F-20260923-01 | P2 | 集团审计转办件 **P-10/P-11（P0）已修复**回执：①P-10 orders_hq 行数位置游标改内容寻址游标（`hqorder:` 键+流去重），多窗插行漏 4 令+retention 双发根除，迁移轮一次性补齐当日未脉冲 24 行（含审计点名漏发 4 令）；②P-11 scan v0.5 单写者锁+tick v1.2 脏树退避（18:27 OS 真轮自动退避实证） | 本仓 commit「DevLoop r6」+TECH §九 r6 两行+沙盒 21 断言/真机 verify PASS 全证 | ①集团台账 P-2026-09-23-10/11 状态 transferred→applied 复核销项；②**进化轮感知面建议接线本反馈面**——evolution-tick-prompt 现仅扫 BigMoney/BigStream 两面，FluxVerse 反馈面未入扫（台账反馈区登记行亦缺本仓） | open（待集团收取） |
