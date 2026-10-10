# FluxVerse P2 技术深耕线队列（queue/tech.md）

> 协议=..\..\docs\self-drive.md §0/§1；P2 技术深耕=挖技术底层（优化现有管线/压 token/做工具/做 benchmark）·每 24h 至少一个技术 commit（§0 节律）。
> 条目律：一行一件；禁「等 CEO 指示/等他司」条目；领走即删行；轮尾补 ≥1 新条。
> 审计口径：常备 ≥10 条；建档=2026-10-11 r237（T-FV-146 收口）。

| # | 待办 | 指针/判据 | 备注 |
|---|---|---|---|
| 1 | docs/_archive/ 反向引用健康演练：§九/HQ-FEEDBACK 历史行旧路径提及→档内可寻性 grep 实证（历史保全不回改·档内字节恒等双证） | docs/_archive/（七件）+rg 双径 | 零改码·判负留痕合法 |
| 2 | tasks-board-check 归档期 fixture 演练：模拟 30 天窗行迁移场景（R1 移除集跨档寻址 docs/archive/tech-section9/*.md 实证） | Tools/devloop/tasks-board-check.ps1 | 10-24 首个非零窗前完成 |
| 3 | 双执法件 ASCII 全字节审计：write-fastpath-state.ps1+check-fastpath.ps1 非 ASCII 字节 grep（抽样升全量） | r163 归一化律族 | 零红=过门 |
| 4 | 烘焙器族 SHA 幂等抽检：Tools/city/bake-*.ps1 抽 3 件双跑比对（确定性旁证续证） | r97/r140 GDI+ 范式 | 抽检不重建 |
| 5 | tick 日志 retention 盘点：logs/ gitignored R3/R4 族分布一行表（56.7MB 面量龄分布） | retention-scan 周测在役 | 纯读盘点零删除 |
| 6 | events-registry 五型 reserved 域对账：LAB 三型/TRANSFER/PROPOSAL 双型 desc 态漂移检查（emitting/reserved 与发射端一致） | schema/events-registry.json | T2 否决窗族后置检查 |
| 7 | City3D 48 包利用率图刷新：R2 模块壳消费后 asset-usage-ledger.md update（工具 item-catalog-gen.ps1 在役） | City3D-staging/asset-usage-ledger.md | R2 里程碑后领 |
| 8 | probes 25 面健康报表：scan.ps1 全探针产出分布+游标健康一行表（纯读·零新增） | Tools/perceptor/scan.ps1 | 备治理窗回访引证 |
| 9 | ps51-gdi-traps 双新律 bake 域适用面判读：vendored 误命中/取件通道两病（r235/r236）在 bake 管线的适用面评估——零适用=判负留痕·有适用=入册+同步 | Tools/skills/fluxverse-bake-pipeline/references/ps51-gdi-traps.md | r242 承件·r214 分布律注记范式 |
| 10 | TECH.md EOL 检出态哨兵：git ls-files --eol（i/lf w/crlf=autocrlf 正常态）10-24 归档窗前复核+归档实跑后双档 w/eol 态一行回填 | TECH §九 r243 基线行+Tools/devloop/archive-section9.ps1 | 态翻转（检出重建/手动转码）即基线再新化 |
| 11 | ps51-gdi-traps 律册滚动第三轮：r244 `*>`+EAP=Stop 子进程 stderr 终错陷阱入册（NativeCommandError 包装升格）+安装副本 SHA 同步+census 重钉+三门烟测复绿 | Tools/skills/fluxverse-bake-pipeline/references/ps51-gdi-traps.md+logs/devloop-r242-rolls-test.ps1 范式 | r244 当轮自中实锚·沙盒正法=Start-Process 双 redirect |
