# FluxVerse P2 技术深耕线队列（queue/tech.md）

> 协议=..\..\docs\self-drive.md §0/§1；P2 技术深耕=挖技术底层（优化现有管线/压 token/做工具/做 benchmark）·每 24h 至少一个技术 commit（§0 节律）。
> 条目律：一行一件；禁「等 CEO/等他司」条目；领走即删行；轮尾补 ≥1 新条。
> 审计口径：常备 ≥10 条；建档=2026-10-11 r237（T-FV-146 收口）。
> r279 注：原三门烟测件（r170/r171/r192·gitignored）已随 r274 logs 轮转清出——常设门引用一律走 tracked 席位（r279-rolls 已入册）；本队列旧行中的烟测引用语义由该席承载。

| # | 待办 | 指针/判据 | 备注 |
|---|---|---|---|
| 1 | City3D 48 包利用率图刷新：R2 模块壳消费后 asset-usage-ledger.md update（工具 item-catalog-gen.ps1 在役） | City3D-staging/asset-usage-ledger.md | R2 里程碑后领 |
| 2 | probes 25 面健康报表：scan.ps1 全探针产出分布+游标健康一行表（纯读·零新增） | Tools/perceptor/scan.ps1 | 备治理窗回访引证 |
| 3 | ps51-gdi-traps 双新律 bake 域适用面判读：vendored 误命中/取件通道两病（r235/r236）在 bake 管线的适用面评估——零适用=判负留痕·有适用=入册+同步 | Tools/skills/fluxverse-bake-pipeline/references/ps51-gdi-traps.md | r242 承件·r214 分布律注记范式 |
| 4 | TECH.md EOL 检出态哨兵：git ls-files --eol（i/lf w/crlf=autocrlf 正常态）10-24 归档窗前复核+归档实跑后双档 w/eol 态一行回填 | TECH §九 r243 基线行+Tools/devloop/archive-section9.ps1 | 态翻转（检出重建/手动转码）即基线再新化 |
| 5 | tick.ps1 2>&1 双位 EAP=Stop 前置硬化（29 号律预防位：L124/L135 子进程捕获现零暴露〔EAP=Continue+try/catch〕——若 tick 未来改 EAP=Stop 即活化→双 redirect 换装+tick harness 复跑） | Tools/tick/tick.ps1+TECH §九 r246 行②+ps51-gdi-traps 29 号 | 重评条件=tick 改 EAP=Stop |
| 6 | r233 沙盒复跑判读口径（常设·零施工）：fx2 两断言（fx2-exit2/fx2-r2-caught）=预存自指腐豁免非回归——ghost 键 T-FV-999 全库唯一提及=r233 收口行自身→R2 token 在场永豁免（r248 定谳·mentions=1 实证）；R2 ghost 能力现证=r246 演练 a5 隔离负控单证在役（r248 A3 真账面负控已自指腐豁免=r259 判负·999 同型·根治位=r266 a3root-v2 已闭） | TECH §九 r248 行③④+logs/devloop-r248-r1fix-test.ps1 A3 | 复跑 35/37 两红=按本行判读勿再归因·沙盒保全律历史件零改 |
| 7 | ollama-watchdog 生产观察位（被动·零施工）：读 logs/ollama-watchdog-receipt.jsonl——首真发行=重启段 live 补证+§九 注记呈报；零行=健康态 | logs/ollama-watchdog-receipt.jsonl+TECH §九 r274 行 | r274 装机承件·r276 读=2 行 dryrun（01:00Z p503=3 abort callers-present·零真发）健康态·首 dryrun 活动在档 |
| 8 | resolve-repo 公共件采用面巡逻（被动·零施工）：新 wrapper/沙盒自定位是否走公共件一行采用律——rg 新增 harness 的 Split-Path 层级手算=漂移点名+§九 注记；Tools 存量 22 处零迁移维持 | Tools/devloop/resolve-repo.ps1+TECH §九 r275 行④（四案实锚） | r275 落地承件·r276 巡逻=第五案当轮自中（抽检 harness 首版双层跳·fail-loud 自证后修单层）·logs 固定一层族维持手算先例（r274 同式） |
| 9 | 归档首实窗后反向引用演练复跑位：T-FV-139 首非零窗（2026-11-01 月界）§九 aged 行外迁入月档后——r277 三面法复跑（档在盘/字节恒等/提及→档可寻）+G3 F- 行 r 号跨档寻址门复证 | docs/archive/tech-section9/*.md+Tools/devloop/archive-section9.ps1（r277 演练三面法=TECH §九 r277 行①） | r277 演练承件·窗后领 |
| 10 | registry reserved 型发射端落位跟踪（被动·零施工）：LAB 三型发射端随 BigDomain Phase 1 孵化舱唤醒落位时 desc 翻 emitting 对账+city_action 引擎消费面接线核验——基线=r277 对账零漂移（五型+伴查 RESIDENT_BIRTH 全一致） | schema/events-registry.json+Tools/perceptor/probes/（r277 对账=TECH §九 r277 行②） | r277 对账承件·落位轮领 |
| 11 | r279-rolls 席位 bake 模板 machinery 门扩位候选：现 A 门只跑 sandbox 模板（pass=9）；r171 A 门义=bake 模板样本态直跑（ALL GREEN PASS=15）——扩位进 r279-rolls（bakers 变量加 bake 模板直跑段）或独立席·领走即定 | logs/devloop-r279-rolls-test.ps1 A 段+Tools/skills/fluxverse-bake-pipeline/scripts/bake-harness-template.ps1 | r279 席位承件·FAM-TOTAL 随扩位重钉（family-seats.txt exp 列） |
| 12 | 烘焙幂等抽检轮转位批 5：bake-* 余 11 件轮换抽 3（四批累计 12 件〔r276 批1 being-glow/ground-shadows/banner-text+r278 批2 canopies/water-tiles/resident-street+r279 批3 lab-glass/lab-digits/office-mirror+r280 批4 tower-antennas/landmark-silhouettes/company-plates〕——批 5 候选=居民 UI 族余件〔resident-cards/resident-plates/resident-ui-labels〕或光效族〔light-fx/water-fx/skyline-far〕·多目录件先勘 Save 径禁猜 r276 律·live 源件〔barks/bubbles/cards 消费 BigLife 活池〕先核源漂移面=r278 resident-street 族先例） | logs/devloop-r276/r278/r279/r280-bake-idem-test.ps1（reproduce-pre+idem 双跑+树洁终门范式） | 抽检不重建·余 11 件账=city-greetings/facade-skin/light-fx/resident-barks/resident-bubbles/resident-cards/resident-identity/resident-plates/resident-ui-labels/skyline-far/water-fx |
