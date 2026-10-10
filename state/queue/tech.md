# FluxVerse P2 技术深耕线队列（queue/tech.md）

> 协议=..\..\docs\self-drive.md §0/§1；P2 技术深耕=挖技术底层（优化现有管线/压 token/做工具/做 benchmark）·每 24h 至少一个技术 commit（§0 节律）。
> 条目律：一行一件；禁「等 CEO 指示/等他司」条目；领走即删行；轮尾补 ≥1 新条。
> 审计口径：常备 ≥10 条；建档=2026-10-11 r237（T-FV-146 收口）。

| # | 待办 | 指针/判据 | 备注 |
|---|---|---|---|
| 1 | TECH §九 基线复测：r230 基线（613,218B/479 行）已陈——r238 后行数/字节复测落 archive-section9 G1 对账基线（10-24 迁移窗前基线新鲜化） | Tools/devloop/archive-section9.ps1 G1+logs/devloop-r230-measure*.ps1 | 纯读复测·一轮可毕 |
| 2 | docs/_archive/ 反向引用健康演练：§九/HQ-FEEDBACK 历史行旧路径提及→档内可寻性 grep 实证（历史保全不回改·档内字节恒等双证） | docs/_archive/（七件）+rg 双径 | 零改码·判负留痕合法 |
| 3 | check-fastpath 沙盒合并回归：r198 79 断言+r235 15 断言（c5 vendored 过滤）合并跑一轮（历史件保全前提） | logs/devloop-r{198,235}-*.ps1 | 双跑字节同=判据 |
| 4 | tasks-board-check 归档期 fixture 演练：模拟 30 天窗行迁移场景（R1 移除集跨档寻址 docs/archive/tech-section9/*.md 实证） | Tools/devloop/tasks-board-check.ps1 | 10-24 首个非零窗前完成 |
| 5 | 双执法件 ASCII 全字节审计：write-fastpath-state.ps1+check-fastpath.ps1 非 ASCII 字节 grep（抽样升全量） | r163 归一化律族 | 零红=过门 |
| 6 | 烘焙器族 SHA 幂等抽检：Tools/city/bake-*.ps1 抽 3 件双跑比对（确定性旁证续证） | r97/r140 GDI+ 范式 | 抽检不重建 |
| 7 | 技能 references 律册滚动更新：r235 c5 vendored 过滤语义+r236 取件通道两病（web_fetch 后端错路由/LICENSE-only 视图→raw.githubusercontent 正道）入 ps51-traps 册 | T-FV-114 承接族·Tools/skills/*/references/ | 安装副本 SHA 同步随做 |
| 8 | tick 日志 retention 盘点：logs/ gitignored R3/R4 族分布一行表（56.7MB 面量龄分布） | retention-scan 周测在役 | 纯读盘点零删除 |
| 9 | events-registry 五型 reserved 域对账：LAB 三型/TRANSFER/PROPOSAL 双型 desc 态漂移检查（emitting/reserved 与发射端一致） | schema/events-registry.json | T2 否决窗族后置检查 |
| 10 | City3D 48 包利用率图刷新：R2 模块壳消费后 asset-usage-ledger.md update（工具 item-catalog-gen.ps1 在役） | City3D-staging/asset-usage-ledger.md | R2 里程碑后领 |
| 11 | probes 25 面健康报表：scan.ps1 全探针产出分布+游标健康一行表（纯读·零新增） | Tools/perceptor/scan.ps1 | 备治理窗回访引证 |
