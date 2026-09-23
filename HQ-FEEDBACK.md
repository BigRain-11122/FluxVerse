# FluxVerse → 集团 反馈面（HQ-FEEDBACK）

> evolution.md §7 面制：行级追加，格式 `| F-<日期>-<NN> | 紧急度 | 现象 | 证据 | 建议方向 | 状态 |`。集团层只读收取（周进化轮必扫·未处理超两周自动升级 CEO 待办）。

| ID | 紧急度 | 现象 | 证据 | 建议方向 | 状态 |
|---|---|---|---|---|---|
| F-20260923-01 | P2 | 集团审计转办件 **P-10/P-11（P0）已修复**回执：①P-10 orders_hq 行数位置游标改内容寻址游标（`hqorder:` 键+流去重），多窗插行漏 4 令+retention 双发根除，迁移轮一次性补齐当日未脉冲 24 行（含审计点名漏发 4 令）；②P-11 scan v0.5 单写者锁+tick v1.2 脏树退避（18:27 OS 真轮自动退避实证） | 本仓 commit「DevLoop r6」+TECH §九 r6 两行+沙盒 21 断言/真机 verify PASS 全证 | ①集团台账 P-2026-09-23-10/11 状态 transferred→applied 复核销项；②**进化轮感知面建议接线本反馈面**——evolution-tick-prompt 现仅扫 BigMoney/BigStream 两面，FluxVerse 反馈面未入扫（台账反馈区登记行亦缺本仓） | open（待集团收取） |
| F-20260923-02 | P3 | 集团审计转办件 **P-14（P2 小病三件）已修复**回执：①quarantine 7 天生命周期（scan v0.6 两梯：7d 未动整档清空+行级 ts>7d 修剪·fail-keep）；②github_events media 正则补 Bigmedia；③`.codely-cli/` gitignore 整目录行（轮首 `??` 噪音根除） | 本仓 commit「DevLoop r7」+沙盒 14 断言全绿+真机 scan/verify 双绿（14 探针 OK） | ①台账 P-2026-09-23-14 状态 transferred→applied 复核销项；②**P-15 资产路径勘误呈报**：台账载「gaming/MiniGame/Art Assets/City」已因 MiniGame U164 正名过时，实址=`gaming/MiniGame/Art Assets/AA-022_SceneBG背景_清洁城市与万圣节动画件_GuttyKreum/CleanCityv3`（953 件 1.32MB 与台账数吻合）——建议台账行勘正防下轮认领空跑；③P-15/P-16 已登记 TECH §九（含 Tuanjie 1.10.3=2022.3.62t15 已装就绪面勘明），DevLoop 下轮起分轮认领 | open（待集团收取） |
