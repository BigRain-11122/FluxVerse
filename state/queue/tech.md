# FluxVerse P2 技术深耕线队列（queue/tech.md）

> 协议=..\..\docs\self-drive.md §0/§1；P2 技术深耕=挖技术底层（优化现有管线/压 token/做工具/做 benchmark）·每 24h 至少一个技术 commit（§0 节律）。
> 条目律：一行一件；禁「等 CEO/等他司」条目；领走即删行；轮尾补 ≥1 新条。
> 审计口径：常备 ≥10 条；建档=2026-10-11 r237（T-FV-146 收口）。
> r279 注：原三门烟测件（r170/r171/r192·gitignored）已随 r274 logs 轮转清出——常设门引用一律走 tracked 席位（r279-rolls 已入册）；本队列旧行中的烟测引用语义由该席承载。

| # | 待办 | 指针/判据 | 备注 |
|---|---|---|---|
| 1 | City3D 48 包利用率图刷新：R2 模块壳消费后 asset-usage-ledger.md update（工具 item-catalog-gen.ps1 在役） | City3D-staging/asset-usage-ledger.md | R2 里程碑后领 |
| 2 | probes 25 面健康报表：scan.ps1 全探针产出分布+游标健康一行表（纯读·零新增） | Tools/perceptor/scan.ps1 | 备治理窗回访引证 |
| 3 | TECH.md EOL 检出态哨兵：git ls-files --eol（i/lf w/crlf=autocrlf 正常态）10-24 归档窗前复核+归档实跑后双档 w/eol 态一行回填 | TECH §九 r243 基线行+Tools/devloop/archive-section9.ps1 | 态翻转（检出重建/手动转码）即基线再新化 |
| 4 | tick.ps1 2>&1 双位 EAP=Stop 前置硬化（29 号律预防位：L124/L135 子进程捕获现零暴露〔EAP=Continue+try/catch〕——若 tick 未来改 EAP=Stop 即活化→双 redirect 换装+tick harness 复跑） | Tools/tick/tick.ps1+TECH §九 r246 行②+ps51-gdi-traps 29 号 | 重评条件=tick 改 EAP=Stop |
| 5 | r233 沙盒复跑判读口径（常设·零施工）：fx2 两断言（fx2-exit2/fx2-r2-caught）=预存自指腐豁免非回归——ghost 键 T-FV-999 全库唯一提及=r233 收口行自身→R2 token 在场永豁免（r248 定谳·mentions=1 实证）；R2 ghost 能力现证=r246 演练 a5 隔离负控单证在役（r248 A3 真账面负控已自指腐豁免=r259 判负·999 同型·根治位=r266 a3root-v2 已闭） | TECH §九 r248 行③④+logs/devloop-r248-r1fix-test.ps1 A3 | 复跑 35/37 两红=按本行判读勿再归因·沙盒保全律历史件零改 |
| 6 | ollama-watchdog 生产观察位（被动·零施工）：读 logs/ollama-watchdog-receipt.jsonl——首真发行=重启段 live 补证+§九 注记呈报；零行=健康态 | logs/ollama-watchdog-receipt.jsonl+TECH §九 r274 行 | r274 装机承件·r276 读=2 行 dryrun（01:00Z p503=3 abort callers-present·零真发）健康态·首 dryrun 活动在档 |
| 7 | resolve-repo 公共件采用面巡逻（被动·零施工）：新 wrapper/沙盒自定位是否走公共件一行采用律——rg 新增 harness 的 Split-Path 层级手算=漂移点名+§九 注记；Tools 存量 22 处零迁移维持 | Tools/devloop/resolve-repo.ps1+TECH §九 r275 行④（四案实锚） | r275 落地承件·r276 巡逻=第五案当轮自中（抽检 harness 首版双层跳·fail-loud 自证后修单层）·logs 固定一层族维持手算先例（r274 同式） |
| 8 | 归档首实窗后反向引用演练复跑位：T-FV-139 首非零窗（2026-11-01 月界）§九 aged 行外迁入月档后——r277 三面法复跑（档在盘/字节恒等/提及→档可寻）+G3 F- 行 r 号跨档寻址门复证 | docs/archive/tech-section9/*.md+Tools/devloop/archive-section9.ps1（r277 演练三面法=TECH §九 r277 行①） | r277 演练承件·窗后领 |
| 9 | registry reserved 型发射端落位跟踪（被动·零施工）：LAB 三型发射端随 BigDomain Phase 1 孵化舱唤醒落位时 desc 翻 emitting 对账+city_action 引擎消费面接线核验——基线=r277 对账零漂移（五型+伴查 RESIDENT_BIRTH 全一致） | schema/events-registry.json+Tools/perceptor/probes/（r277 对账=TECH §九 r277 行②） | r277 对账承件·落位轮领 |
| 10 | bake-city-greetings 护栏活性复证位（被动·零施工）：回访窗/月档复跑实弹一次=REFUSED 断言（正典 sha 前后恒等·r283 承件 T1）；-Force 覆写径=正典换代（greetings 文案更新令）时才启用——禁裸跑 | logs/devloop-r283-greetings-guard-test.ps1+watch/greetings.json | r283 落地承件（tech#13 旧行领走·护栏四验 18/18 毕） |
| 11 | barks 活池契约水位探测位（被动·零施工）：BigLife 活池 18/桶超 barks 契约门 v1.8=4..15（r284 探针 gate-refused 实锚·正典 residents-barks.json sha12 4E679765751E 零触碰）——池自停且消费线决策后 gate bump 15→18+re-bake（barks json+bubbles 1296 行+引擎 BarksProof 桶门联动=消费轮非抽检轮）；探测=pool bucket max 一行 census | Tools/city/bake-resident-barks.ps1 桶门段（4..15 contract v1.8）+logs/devloop-r284-bake-idem.json | r284 批 7 终批承件·烘焙幂等轮转池已清（20 runnable 复现+3 判负全账=§九 r276~r284 行）·重评条件=BigLife 池自停/消费令 |
| 12 | r279-rolls A3 段负控沙盒回访位（被动·零施工）：坏模板三注入（n1 篡改/n2 塌缩/n3 假绿）已落地 55/55 全绿（r286）——回访窗若 bake-harness-template.ps1 改版（FILL 结构/verdict 行/门面数变动）即 splice 锚漂移面：先看 a3-*-splice-applied 三断言（fail-loud 指红）再重锚 | logs/devloop-r279-rolls-test.ps1 A3 段+Tools/skills/fluxverse-bake-pipeline/scripts/bake-harness-template.ps1 | r286 落地承件·splice-applied=锚漂移哨兵（r235 教训执法面） |
| 13 | family-run 全族复跑触发律（被动·零施工）：席位扩位（exp/断言数变更）或席位文件改动后=领位轮必跑全族复跑——-Only 单席入族首证≠跨席钉面验证（r287 实锚：r285/r286 两轮 -Only 后 r212 A4 跨席精确钉腐未曝·全族跑首曝+下界化根治）；触发=下次 seats/断言扩位 | Tools/devloop/family-run.ps1+TECH §九 r287 行 | r287 承件（tech#14 复证位领走毕）·r212 A4 已下界化（-ge 32）根治=本条为扩位纪律位非病位 |
| 14 | vendored 接收树前置哨兵（被动·零施工·r288 判负伴生位）：bake 输入路径域（ArtPacks 源目录/canopy-sources.txt 钉定源/docs\residents）若出现 vendored 载荷接收树（node_modules/data\assets/点目录族）即重触发 r288 两病判读——探测=三树族 ls 零在场一行注记 | TECH §九 r288 行②③+Tools/skills/fluxverse-bake-pipeline/references/ps51-gdi-traps.md | r288 判负承件·tech#3 闭环伴生位（判负=两病 bake 域零适用·载荷接收树零在场） |
