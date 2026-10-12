# R-20261013-inworld-ads-measurement-proof-of-play-benchmarks

> explore#12 第 116 笔领走件（r489·10-13 晨窗 07:5x·提前 ~48h 落账=10-15 07:2x 死线减负）；缺口实证=85 件 R-2026101x 语料**词族①「第三方监测|监播|播证|播放证明|效果度量|曝光验证|填充率|fill rate|measurement|Quividi|AdMobilize」零命中**+**词族②「监播|播证|播放证明|上刊|到达率|触达|人流|播后报告|proof.?of.?play」5 件命中全=定价件侧注**（r452 §口径边界「人流口径≠观看口径（宣称面未审计）」/r453 §CPM 口径边界「未审计·仅作上界参照」/r486 触达=毛潜口径侧注/izitravel+r392 触达=免费层经济学侧注——**零专件覆盖·且 r452/r453 两件自己挂着的「未审计」悬置注=度量轴被定价件点名未补**）；判据（explore#12）=真缺口 grep 双词族实证+四源 fetch 直取实数带落件。r489。
> 消费面=P3-004 城内品牌空间/广告位候选提案（10-18 窗）效果度量轴+P3-003 报价单播证承诺面；对位件=r455 合规轴（义务面）+r488 结案交付物（数据报告层）——本件=**信任/度量面**，三轴合=P3-004 证据链闭环。

## §1 基准谱：线下 DOOH 的信任产业链（四源直取）

| 源 | 定谳句 | 实数/标准 |
|---|---|---|
| OAAA（美国户外广告行业协会·2019-05-10 官方博客） | DOOH 播证报告现状=「variable」——从全手工耗时到全自动透明之间**全部档位并存**；**「Self-verification（媒体方自证）仍是现行生态大面」**；行业协会诉求=「independently verified playout is essential」+全球单一独立度量源才能与数字平台同语言交易；「没有独立可验的播证数据，曝光数再多也无意义」 | DOOH Primer=五大行业协会合编 PoP 全球最佳实践框架 |
| Outsmart Playout Reporting Standard v2.0（英国 OOH 业共享 Playout 数据仓标准·via nextdooh 2026-06 专文） | 播证=「screen business 的收据」；行业问题不是有没有而是「**能否过审计**」；**合同面=比法律更强（多数付费 DOOH 活动把播放报告写为结算前提/billing condition）**；Spot Level 粒度=单屏单次播放一行·**禁月度总量冒充** | 必填字段族：StartTime/EndTime（ISO-8601 UTC）/FrameId/CreativeId/AccountId/OrderId/LineId；可选 CampaignId/PoNumber（对账用）；**曝光数刻意不入必填（播放≠曝光·分立报告）**；文件级信任三查=禁重复/禁重叠时间戳/禁未来日期；英国仓流程误差 7 天内回补 vs 运营误差（屏黑）=买卖双方自理面 |
| 摩报 mobill.cn（国内第三方监播·中广协数智户外委员会理事·参与监测标准制定） | 服务谱=投前媒介策略/投中第三方监测/投后效果评估/媒体价值评估（资源方招标底价）四件套；核心话术=「**以独立核验数据取代媒体方自报**·挽回异常投放损失」——**监播产业存在的原因=媒体方自证不可信**（r452/r453「宣称面未审计」的产业级解药面） | 自建库：256 机场/1848 高铁站/11922 高速收费站/53 城地铁/598 城公交/10 万写字楼/80 万社区·11 亿人口 36 标签；10000+ 监测员/AI 图像识别实时监播；实案=某童鞋品牌百万级点位全链路监播+某城市地铁资源评估→招标底价→标的 100% 成交 |
| Quividi（DOOH 受众度量厂商·2006 起·月测 20 亿次曝光·80 国 800+ 客户） | 线下「ground truth 观众核验」=**video/Lidar/mmWave 传感器采购项**（「an option, never a prerequisite」·「scale without a sensor rollout」=能不上传感器就不上）；播放→曝光的桥=**impression multiplier**（「1 play × IM 3.4 = 3.4 impressions」·从真人流/停留时长建模）——播放侧可证、**观看侧要传感器或模型** | 受众数据要「method and confidence stated」（方法与置信度声明）才可卖钱 |

**谱系定谳**：线下 DOOH 信任链=三段采购——①播证（平台功能/合同结算前提）②第三方监播（摩报类·治媒体方自证）③观众核验（传感器/模型·播放→曝光换算）——r452「日均人流 80 万宣称」类数字在这条链上=第②③段缺位时的**未审计宣称**（这正是我方定价件只能标「量级参照」的根因）。

## §2 城内位的对位定谳：数字原生双证位

| 面 | 线下 DOOH | 城内位（超体宇宙城） |
|---|---|---|
| 播证（播了没有） | 平台功能+行业推独立验证（OAAA：自证仍大面） | **原生免费**——每次播放=服务器事件行（FrameId/时间戳/时长/完成态天然在库）·Spot Level 出厂即达 Outsmart 粒度·禁重复/重叠/未来日期三查可程序化预检 |
| 第三方监播 | 采购项（摩报四件套·监测员/AI 图像识别） | **免采购**——「独立核验取代媒体方自报」的服务器日志原生满足（可开放只读日志=审计面零成本） |
| 观看核验（有人看没有） | 传感器/模型采购项（Quividi 摄像头/Lidar·或宣称面不审） | **免传感器**——虚拟相机即传感器：在场玩家数=运行时精确计数（「scale without a sensor rollout」的极限形态） |
| 结算前提 | 合同面 billing condition | 同律可用（播证报告=结案交付物数据报告层 r488 §2 同源） |

**消费三句（P3-004 提案窗正文直取）**：
1. **播证原生句**：城内广告位每次播放自动生成 Spot Level 播证行（媒体/位/起止 UTC 时间戳/实播时长/完成态），报价单承诺「播证随投放出厂自带·零第三方监播采购项」——线下要另购监播才有的信任面，城内出厂标配（对位询价黑箱 r417 第五源之后的第二差异化卖点）。
2. **双证分立句**：播放数与曝光数分立双列（Outsmart「曝光不入必填」同律）——播放侧日志原生+曝光侧在场计数原生，**双证皆实测口径**；禁把播放数当曝光数卖（见 §3 红线）。
3. **报告同源句**：播后报告并入结案交付物数据报告层（r488 §2/§3 同源同判据=指标集 ⊇ 验收判据集）——广告位投放与活动承接共用一套结案报告语法，B 端一张报告看全。

## §3 红线句

**「播证经济不是宣称经济」**——城内位的可信度全部来自可审计原生日志；任何报价句用「等价线下人流」（r452/r453 宣称面）换算冒充城内曝光=判负（未审计宣称面=线下监播产业存在的原因·城内卖点恰是它的反面）。配套双界铁律：**播放 ≠ 观看**（nextdooh/arsa 双源同判：play 只证播了不证有人看）——城内以在场计数补观看侧，仍须双列分立报告。

## §4 判据候选 J1-J3（提案窗验收）

- **J1 播证原生门**：P3-004 提案报价单含「每播放一行·Spot Level 播证」承诺段且零第三方监播采购项（grep 模板=正文含 播证|proof-of-play 字段清单 ≥1 处）。
- **J2 播放/曝光分立门**：播后报告模板含播放数/曝光数双列分立（禁互换冒充·与 J1 同 grep 面）。
- **J3 异常自曝门**：停播/短放/故障自报先行于买家发现（英国仓 7 天回补窗同构·「report the duration actually rendered, not scheduled」直取）。

## §5 消费回填行（提案窗引用后回填一行）

- [ ] 待回填：10-18 深扫窗/P3-004 提案窗 commit/消息面引用本件 ≥1 处（§2 三句+§4 J1-J3 随引）。

## §6 源清单（fetch 直取·2026-10-13）

1. OAAA blog「Measurement, Standards, and the Current State of Proof of Play in DOOH」https://oaaa.org/blog-posts/measurement-standards-and-the-current-state-of-proof-of-play-in-dooh/（2019-05-10·行业协会正身）
2. nextdooh「Proof of Play: What Advertisers Expect in a DOOH Report」https://nextdooh.com/articles/proof-of-play-explained（2026-06-12 更新 2026-09-18·含 Outsmart Standard v2.0 字段族全文转述）
3. 摩报 https://www.mobill.cn/（国内第三方监播四件套+实案两枚）
4. Quividi https://www.quividi.com/（传感器经济学+impression multiplier 机理）

**坑首录**：broadsign.com/blog/proof-of-play 与 en.wikipedia.org/wiki/Digital_out-of-home 双 404（Wikipedia 正确条目名=Outdoor advertising·redirect 可达）；十目监测/CTR 检索命中未取（摩报已足国内面·三源纪律满足后不增token）。
