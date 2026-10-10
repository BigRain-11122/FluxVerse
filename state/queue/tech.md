# FluxVerse P2 技术深耕线队列（queue/tech.md）

> 协议=..\..\docs\self-drive.md §0/§1；P2 技术深耕=挖技术底层（优化现有管线/压 token/做工具/做 benchmark）·每 24h 至少一个技术 commit（§0 节律）。
> 条目律：一行一件；禁「等 CEO 指示/等他司」条目；领走即删行；轮尾补 ≥1 新条。
> 审计口径：常备 ≥10 条；建档=2026-10-11 r237（T-FV-146 收口）。

| # | 待办 | 指针/判据 | 备注 |
|---|---|---|---|
| 1 | docs/_archive/ 反向引用健康演练：§九/HQ-FEEDBACK 历史行旧路径提及→档内可寻性 grep 实证（历史保全不回改·档内字节恒等双证） | docs/_archive/（七件）+rg 双径 | 零改码·判负留痕合法 |
| 2 | 烘焙器族 SHA 幂等抽检：Tools/city/bake-*.ps1 抽 3 件双跑比对（确定性旁证续证） | r97/r140 GDI+ 范式 | 抽检不重建 |
| 3 | tick 日志 retention 盘点：logs/ gitignored R3/R4 族分布一行表（56.7MB 面量龄分布） | retention-scan 周测在役 | 纯读盘点零删除 |
| 4 | events-registry 五型 reserved 域对账：LAB 三型/TRANSFER/PROPOSAL 双型 desc 态漂移检查（emitting/reserved 与发射端一致） | schema/events-registry.json | T2 否决窗族后置检查 |
| 5 | City3D 48 包利用率图刷新：R2 模块壳消费后 asset-usage-ledger.md update（工具 item-catalog-gen.ps1 在役） | City3D-staging/asset-usage-ledger.md | R2 里程碑后领 |
| 6 | probes 25 面健康报表：scan.ps1 全探针产出分布+游标健康一行表（纯读·零新增） | Tools/perceptor/scan.ps1 | 备治理窗回访引证 |
| 7 | ps51-gdi-traps 双新律 bake 域适用面判读：vendored 误命中/取件通道两病（r235/r236）在 bake 管线的适用面评估——零适用=判负留痕·有适用=入册+同步 | Tools/skills/fluxverse-bake-pipeline/references/ps51-gdi-traps.md | r242 承件·r214 分布律注记范式 |
| 8 | TECH.md EOL 检出态哨兵：git ls-files --eol（i/lf w/crlf=autocrlf 正常态）10-24 归档窗前复核+归档实跑后双档 w/eol 态一行回填 | TECH §九 r243 基线行+Tools/devloop/archive-section9.ps1 | 态翻转（检出重建/手动转码）即基线再新化 |
| 9 | tick.ps1 2>&1 双位 EAP=Stop 前置硬化（29 号律预防位：L124/L135 子进程捕获现零暴露〔EAP=Continue+try/catch〕——若 tick 未来改 EAP=Stop 即活化→双 redirect 换装+tick harness 复跑） | Tools/tick/tick.ps1+TECH §九 r246 行②+ps51-gdi-traps 29 号 | 重评条件=tick 改 EAP=Stop |
| 10 | r233 沙盒复跑判读口径（常设·零施工）：fx2 两断言（fx2-exit2/fx2-r2-caught）=预存自指腐豁免非回归——ghost 键 T-FV-999 全库唯一提及=r233 收口行自身→R2 token 在场永豁免（r248 定谳·mentions=1 实证）；R2 ghost 能力由 r246 演练 a5 隔离负控+r248 A3 真账面 rot-proof 负控（ghost id=T-FV-899）双证无恙 | TECH §九 r248 行③④+logs/devloop-r248-r1fix-test.ps1 A3 | 复跑 35/37 两红=按本行判读勿再归因·沙盒保全律历史件零改 |
| 11 | harness 第七席收编候选：r248-r1fix-test（tasks-board-check R1 修法代际沙盒 20 断言·rot-proof A3 负控 ghost id=T-FV-899·盘上未入库）对当前 board-check 回归复跑 | logs/devloop-r248-r1fix-test.ps1+r255/r257/r258 收编范式（git add -f）+tech#10 判读口径 | 判据=复跑 exit 0 才收编+eol 表在案+RED=0；红=判负留痕（r233 自指腐前科判读=tech#10 常设行） |
