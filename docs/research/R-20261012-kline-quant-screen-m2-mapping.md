# R-20261012-kline-quant-screen-m2-mapping.md（行情 K 线 QUANT 城巨屏 M2 视觉映射设计稿 v1.0）

> explore#11 领走成件〔P3 件·2026-10-12 r409〕。**纸面设计稿·零引擎实现**；消费窗=M2（TECH §九 r47 行「行情 K 线映射仍留 M2 原注不动」+DESIGN L156）。
> 源账（全仓内·零 web 零生成触点）：world/world-state.json reality.market 节实测（2026-10-12 13:2x）+world/market-etf.json+world/market-cal.json+DESIGN.md L66/L70/L93/L101/L116/L226/L238+TECH.md L144（r4 market 探针收口）/L202（r74 数据授权行）+City/Assets/Scripts/CityAmbient.cs L45/L283（M1 只读轮询正典）+City/Assets/Editor/AmbientProof.cs（hermetic 证明范式）+City/Assets/Editor/AudioProof.cs L225-226（开收盘钟声 M1 已备）。

## §0 一句话
QUANT 城算力摩天楼「巨型 K 线全息屏」（DESIGN L66 地标定义）M2 落地设计稿：数据面已就绪（本日实测 30 根日线新鲜在库），本件冻结视觉映射语义+引擎消费契约+验收判据，实现窗按单施工。

## §1 数据契约（现状实锚·零新基建）
- **单一源**=world/world-state.json → `reality.market` 节。单写者=Tools/perceptor/probes/market.ps1（含 market-cal.json 交易日历·TECH L144）；引擎侧**只读**——M1 正典先例 CityAmbient.cs：「Polls world/world-state.json READ-ONLY every ~10s (perceptor owns all writes)」（L45·repoRoot 解析 L283）。
- **字段面**〔2026-10-12 13:2x 实测锚〕：`etf_symbol`=510300／`etf_name`=CSI300ETF／`etf_last_date`=2026-10-09／`etf_last_close`=4.385／`etf_change_pct`=-0.09／`etf_fetched_utc`=2026-10-12T05:26:13Z／`bars`=30×[date,o,h,l,c]（2026-08-21→10-09 连续交易日）／`is_trading_day`=true／`cal_next_trade_date`=2026-10-13。
- **粒度定谳=日线**。盘中无新烛（今日烛=收盘后落盘）；**禁编造盘中实时源**（诚实律）。今日「待收烛」=纯轮廓占位（§2.4·不填 OHLC）。盘中分时源扩展=需新探针+T2 登记=非本稿范围（§5 候选位）。
- **freshness 语义**：as_of 当日新鲜才生效；stale/缺失→兜底态（M1 clock 节假日近似同律·TECH L144）。
- **敏感面律**（r74/P-62⑤·TECH L202）：market/fx 行情面在 world-public/city-snapshot.json 白名单**外**——引擎消费必须走仓内 world-state 只读径，**禁走公开快照径**；本屏数据不出城（外售面归 BigCompute·授权边界不变）。

## §2 视觉映射（五色律对齐）
### 2.1 载体与挂载
- 载体=QUANT 城算力摩天楼（上海中心扭塔·**资金金发光**正典 DESIGN L116）立面「巨型 K 线全息屏」（L66）。挂载位=QUANT 摩天楼建成里程碑后主视角立面；R2 阶段预挂=白盒替换件（实现窗自定·验收只锁「屏在楼立面+主视角可读」两条）。
- 屏幅建议：楼体上段 1/3 立面带（读距=主街视角可辨烛形；具体像素位实现窗按楼定型标）。

### 2.2 烛体色律（受众母语优先）
- **红涨青跌（A 股口径——国内受众秒懂·大红大涨=K 线母语）**：阳线（c≥o）=红族（取正典警示红同相）／阴线（c<o）=青族（取正典数据青同相）。烛体=高饱和正典发光级；wick（上下影线）=同相 60% 透明度。
- **色值纪律**：实现窗从 City3D 正典材质族取同相色（**禁新色相**=五色律合规判据）。语义域分置注：屏内红=涨（K 线母语）·光门红脉冲=警示（门禁语义 L93）——同色不同载体语义域分置，屏内禁混警示红做非涨语义。
- **双色双锚**：烛体红青=c vs o（同日）；屏角涨跌幅=`etf_change_pct`（vs 前收·数据自带零计算歧义）。双锚同屏各自明示。

### 2.3 三态机（is_trading_day × 北京时间·数据字段直驱零新探针）
| 态 | 判据 | 屏面 | 城面联动 |
|---|---|---|---|
| 盘中 | is_trading_day=true ∧ 09:30-15:00 | 30 根已完成日线滚动+今日「待收烛」轮廓占位（§2.4） | 开市钟声（AudioProof marketBellOpen·M1 已备）+全城亮灯（L101） |
| 收盘后 | 15:00 后（当日烛已落或待落） | 尾根定格高亮+屏角收盘价/change_pct 高亮 | 收盘钟声（marketBellClose） |
| 休市 | is_trading_day=false | 半暗模式+屏显「休市」+「下一交易日 <cal_next_trade_date>」（L238 正典：开市全亮/休市半暗） | 半暗模式 |

### 2.4 待收烛（诚实占位）
交易日 09:30-15:00：尾根后一格画**半透明轮廓烛**（无实体无影线——数据无今日 OHLC·禁编造）+标注「待收盘」；收盘后数据落盘（~10s 轮询自取）→轮廓烛被真烛替换。

### 2.5 动效与布局
- 滚动=恒速慢滚+0.5% 亮度正弦呼吸（免机械感）；30 根旧→新左→右横排。
- 幅度映射=|change_pct|→巨屏边缘光带强度（阈值带实现窗调参·±2% 起显）。
- 角标区=「CSI300ETF 510300 · <last_close> · <change_pct>%」资金金；底部状态带一行（三态文案·§2.3）。
- 网格=3 条水平参考线（资金金 20% 透明度）。**零成交量柱**（数据无 volume·禁编造）。
- **层次分域**：本稿只锁行情 K 线层；事件滚动层（回测/门禁 G1'/G2→屏滚联动 L93）归 world-events viz 消费端（explore#10·M2 排队面·观察不预建）——两层同屏分域禁混写。

## §3 引擎消费契约（只读轮询·M1 同式）
- 组件位：City3D 新增 `KLineScreenController`（名建议）——**只读 world-state.json ~10s 轮询**（CityAmbient.cs 同式·repoRoot 解析 L283 先例·零写·零第二文件）。
- 降级链（探针契约同律·失败静默降级禁拖垮主循环）：
  - `etf_fetched_utc` stale（>24h）→屏显「行情通道维护中」+最后帧 50% 半透明（诚实律=不编造数据）；
  - `reality.market` 缺失→屏保动画（慢滚留白烛）+一行日志；
  - JSON 坏/读失败→保持上一帧+日志（零 crash 传播）。
- **只读律**：引擎侧零 world/ 写入（单写者铁律·违=判负）。

## §4 M2 验收判据（机械可验）
1. **帧证据 qa/ 三帧**：盘中态（红青烛各 ≥1+尾根日期在帧）·休市态（「休市」字样+半暗基线）·stale 态（维护文案）——多模态四维 ≥8/10（qa-smoke-test-charter 口径·main#5 帧链同族）。
2. **Editor proof harness**（AmbientProof.cs hermetic 先例·注入 probe-shaped 值零 world 读）：30 根渲染数=30·红青判定表断言（真数据样例对：2026-08-21 o4.648/c4.68→红·2026-08-24 o4.678/c4.627→青）·三态切换断言·降级链三路断言。
3. **只读律**：引擎进程写监视=world/ 零写入。
4. **五色律合规**：烛色取自正典材质族（新色相=判负）。

## §5 实现窗回填位（被动族同式·explore#61 律）
| 消费窗 | 动作 | 回填行 |
|---|---|---|
| M2/QUANT 城实现窗开工首跑 | 消费 §2-§4 施工+本表回填一行 | （空） |

- 派生：GDI+ 设计样张位（五色律+30 根真 bars 渲染 M2 视觉评审样张=可看证据·explore#102 轮尾补条在册）——样张过目后再进实现窗（先快后全律）。
- 盘中分时源扩展=非本稿范围（需新探针+T2 登记+授权面）——提案位候选。

## §6 Token 三问
零 LLM/AIGC 触点（纯确定性数据渲染设计·实现亦然）=**L1 直过**。
