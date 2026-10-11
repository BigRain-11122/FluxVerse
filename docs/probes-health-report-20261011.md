# Perceptor 探针 25 面健康报表（2026-10-11·r289）

> 来源=tech 队列 #2（r237 T-FV-146 建档·r289 领走）；用途=10-16 治理窗回访引证；方法=scan.ps1 v0.7 实跑一次+verify.ps1 门+world/perceptor-state.txt 全量读判（纯读零新增探针/脚本）。

## 一、探针状态分布（scan 实跑 2026-10-11 ~13:1x）

**25/25 OK · 0 FAIL · quarantined=0 · events +5 · fleet=7 · tasks=183 · verify=VERIFY PASS**（state 提升门绿）。

全席清单（按 scan 输出序）：bigstream_output / census / clock / decisions / evolution / fleet_machines / fleet_minigame / fleet_tasks / fx / git / github_events / hq_feedback / inbox / market / minigame_tasks / orders / orders_bg / orders_bs / orders_hq / residents / snapshot / street_behavior / ticklog / transfers / weather。

## 二、当日事件流产出分布（world/world-events.jsonl 实测）

live_stream_lines=**1561**（当日档）；类型分布：

| type | lines | type | lines |
|---|---|---|---|
| COMMIT | 536 | HQ_FEEDBACK | 7 |
| GITHUB_EVENT | 435 | DECISION_MADE | 6 |
| GAME_STAGE | 212 | RESIDENT_SAY | 6 |
| HEARTBEAT | 127 | CEO_ORDER | 1 |
| OS_TICK_START / GATE_PASS / OS_TICK_DONE | 77 ×3 | | |

## 三、游标健康一行表（world/perceptor-state.txt 实测判读）

| 游标族 | 样本键值（截录） | 新鲜度判 |
|---|---|---|
| clock | clock_mkt_day=2026-10-11 / rank=5 | 当日=新鲜 |
| ticklog | ticklog:20261011=12:46:02（历史日键 20260929~20261010 齐全） | 当日=新鲜·日键连续无缺档 |
| fleet | bm-a=02:52:16+08 / bm-b=02:23:24+08 / bm-c=02:34:58（均 10-11） | 当日=新鲜 |
| bgfleet | BG-A=12:37:16 GPU_DRAFT_OK / BG-C=11:46:41 GPU_DRAFT_OK / BG-B=11:51:25 **GPU_COMFY_MISSING** | 当日=新鲜；BG-B 状态旗=设备态如实（Comfy 缺装面·非探针病） |
| res（居民/机留言） | bm-a ts=10-10T21:56Z / bm-b=10-10T22:06Z / BG-A=10-11T04:46Z / BG-B=10-10T20:06Z / BG-C=10-10T21:16Z | ≤24h 内=新鲜 |
| repo | fluxverse / minigame / bigmoney / bigstream 四仓 sha 全在位 | 在位=健康 |
| 外源标记 | github_last_id / fx_usdcny_last=6.6921 / census:frontier | 在位=健康 |
| 消费去重族 | bgorder/hqorder/bsorder/order/hqfb/decision/prop/propap/task/transfer/bsout/mgtp/res（=1 型标记·计数即消费账） | 单调在册=健康（不判新鲜） |

**判读**：全族新鲜，零 stale（>48h 无推进游标=0）；quarantine=0；单写者锁零占用残留。

## 四、观察项（非病·备案）

1. `task:T-2026-09-30-134-P1=|unknown`、`task:T-2026-10-06-173-P1=|unknown`（owner 空+态 unknown 双条）——fleet_tasks 探针对两票据记 unknown 态；源侧缺字段 vs 探针侧解析缺口待归因（已入 tech 队列新条）。**→ 归因毕（r290·tech#14）**：源侧 id 约定漂移（两票 `id` 字段无 `-P1` 后缀）×首扫瞬态（半写/缺字段期首扫落 BaseName 键）→ 票据后补 id 后探针改走无后缀现役键（`task:T-2026-09-30-134=bm-c|claimed`/`task:T-2026-10-06-173=bm-a|done` 在位正确）→ 旧键成**孤儿游标**（键名不再产出=永不再比对）。非现役源侧缺字段（现状三字段齐·解析实测通）·非探针解析缺陷（35KB 大票亦通·身份忠实 `$t.id`=正确行为）。去留定谳=**留档不清**（无害死重 3 行/124KB·15 条现役 -P1 键不可误伤）。
2. `task:T-2026-10-02-148-P1=|open`（owner 空·态 open）——票据开面无主·源侧实况如实反映。**→ 归因勘正（r290）**：同族孤儿键（148 早期无 id 首扫落 `|open` 键→后补 id 键漂移）·现役态=`task:T-2026-10-02-148=bm-b|claimed`——「源侧实况如实反映」初判为误·修正留痕。
3. `bgfleet:BG-DEL-SWEEP-ADJUDICATED=|`——BG-DEL 退役机扫除裁决标记行（r 早期裁决件·预期内）。

## 五、结论

**25 面 OK/零隔离/verify PASS/游标零 stale=治理窗引证全绿基线**；本报表由 scan+verify 双绿背书，re-run 法=同队列指针（Tools/perceptor/scan.ps1 + verify.ps1 + world/perceptor-state.txt 读判）。
