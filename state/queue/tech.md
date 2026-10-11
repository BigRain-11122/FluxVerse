# FluxVerse P2 技术深耕线队列（queue/tech.md）

> 协议=..\..\docs\self-drive.md §0/§1；P2 技术深耕=挖技术底层（优化现有管线/压 token/做工具/做 benchmark）·每 24h 至少一个技术 commit（§0 节律）。
> 条目律：一行一件；禁「等 CEO/等他司」条目；领走即删行；轮尾补 ≥1 新条。
> 审计口径：常备 ≥10 条；建档=2026-10-11 r237（T-FV-146 收口）。

| # | 待办 | 指针/判据 | 备注 |
|---|---|---|---|
| 1 | 烘焙幂等抽检轮转位：bake-* 23 件轮换抽 3 件双跑（r276 已抽 being-glow/ground-shadows/banner-text·r277 队列重号后首位——下批候选=写 JSON 族〔resident-street/barks〕或多目录族〔canopies/water-tiles〕·多目录件先 Select-String 勘 Save 径禁猜） | logs/devloop-r276-bake-idem-test.ps1（17 门范式：reproduce-pre+idem 双跑+树洁终门） | r276 承件·抽检不重建 |
| 2 | City3D 48 包利用率图刷新：R2 模块壳消费后 asset-usage-ledger.md update（工具 item-catalog-gen.ps1 在役） | City3D-staging/asset-usage-ledger.md | R2 里程碑后领 |
| 3 | probes 25 面健康报表：scan.ps1 全探针产出分布+游标健康一行表（纯读·零新增） | Tools/perceptor/scan.ps1 | 备治理窗回访引证 |
| 4 | ps51-gdi-traps 双新律 bake 域适用面判读：vendored 误命中/取件通道两病（r235/r236）在 bake 管线的适用面评估——零适用=判负留痕·有适用=入册+同步 | Tools/skills/fluxverse-bake-pipeline/references/ps51-gdi-traps.md | r242 承件·r214 分布律注记范式 |
| 5 | TECH.md EOL 检出态哨兵：git ls-files --eol（i/lf w/crlf=autocrlf 正常态）10-24 归档窗前复核+归档实跑后双档 w/eol 态一行回填 | TECH §九 r243 基线行+Tools/devloop/archive-section9.ps1 | 态翻转（检出重建/手动转码）即基线再新化 |
| 6 | tick.ps1 2>&1 双位 EAP=Stop 前置硬化（29 号律预防位：L124/L135 子进程捕获现零暴露〔EAP=Continue+try/catch〕——若 tick 未来改 EAP=Stop 即活化→双 redirect 换装+tick harness 复跑） | Tools/tick/tick.ps1+TECH §九 r246 行②+ps51-gdi-traps 29 号 | 重评条件=tick 改 EAP=Stop |
| 7 | r233 沙盒复跑判读口径（常设·零施工）：fx2 两断言（fx2-exit2/fx2-r2-caught）=预存自指腐豁免非回归——ghost 键 T-FV-999 全库唯一提及=r233 收口行自身→R2 token 在场永豁免（r248 定谳·mentions=1 实证）；R2 ghost 能力现证=r246 演练 a5 隔离负控单证在役（r248 A3 真账面负控已自指腐豁免=r259 判负·999 同型·根治位=r266 a3root-v2 已闭） | TECH §九 r248 行③④+logs/devloop-r248-r1fix-test.ps1 A3 | 复跑 35/37 两红=按本行判读勿再归因·沙盒保全律历史件零改 |
| 8 | ollama-watchdog 生产观察位（被动·零施工）：读 logs/ollama-watchdog-receipt.jsonl——首真发行=重启段 live 补证+§九 注记呈报；零行=健康态 | logs/ollama-watchdog-receipt.jsonl+TECH §九 r274 行 | r274 装机承件·r276 读=2 行 dryrun（01:00Z p503=3 abort callers-present·零真发）健康态·首 dryrun 活动在档 |
| 9 | resolve-repo 公共件采用面巡逻（被动·零施工）：新 wrapper/沙盒自定位是否走公共件一行采用律——rg 新增 harness 的 Split-Path 层级手算=漂移点名+§九 注记；Tools 存量 22 处零迁移维持 | Tools/devloop/resolve-repo.ps1+TECH §九 r275 行④（四案实锚） | r275 落地承件·r276 巡逻=第五案当轮自中（抽检 harness 首版双层跳·fail-loud 自证后修单层）·logs 固定一层族维持手算先例（r274 同式） |
| 10 | 归档首实窗后反向引用演练复跑位：T-FV-139 首非零窗（2026-11-01 月界）§九 aged 行外迁入月档后——r277 三面法复跑（档在盘/字节恒等/提及→档可寻）+G3 F- 行 r 号跨档寻址门复证 | docs/archive/tech-section9/*.md+Tools/devloop/archive-section9.ps1（r277 演练三面法=TECH §九 r277 行①） | r277 演练承件·窗后领 |
| 11 | registry reserved 型发射端落位跟踪（被动·零施工）：LAB 三型发射端随 BigDomain Phase 1 孵化舱唤醒落位时 desc 翻 emitting 对账+city_action 引擎消费面接线核验——基线=r277 对账零漂移（五型+伴查 RESIDENT_BIRTH 全一致） | schema/events-registry.json+Tools/perceptor/probes/（r277 对账=TECH §九 r277 行②） | r277 对账承件·落位轮领 |
