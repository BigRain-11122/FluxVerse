# FLUX 元宙 · 数据协议草案 v0.1

> 状态：DRAFT（M1 前置设计件·AI 自主推进）· 2026-09-23
> 原则：感知器只读采集（不破跨仓写禁令）· 引擎侧只读渲染（零服务器合规）· 悬置裁决见 §8

---

## 一、文件族

| 文件 | 角色 | 更新方 | 节律 |
|---|---|---|---|
| `world-state.json` | 世界快照（全量实体当前态） | 感知器 | 10min / watch 触发 |
| `world-events.jsonl` | 追加式事件流（直播数据源） | 感知器 | watch 秒级 / 10min |
| `world-state-public.json` | 参观模式脱敏面 | 感知器 | M4 起 |
| `world-events-public.jsonl` | 参观模式事件 | 感知器 | M4 起 |

## 二、world-state.json schema（草案）

```json
{
  "protocol": "fluxverse/0.1",
  "ts_utc": "2026-09-23T07:30:00Z",
  "zones": [
    { "id": "gaming", "name": "FLUX Gaming", "status": "active", "activity": 0.42 },
    { "id": "quant",  "name": "FLUX Quant",  "status": "active", "activity": 0.87 },
    { "id": "media",  "name": "FLUX Media",  "status": "onboarding", "activity": 0.12 }
  ],
  "fleet": [
    { "id": "bm-a", "machine": "DASHENG", "cores": 32, "online": true,
      "companies": ["bigmoney", "biggame"], "current_task": "..." }
  ],
  "tasks": [
    { "id": "T-2026-09-23-01", "zone": "quant", "owner": "bm-b", "status": "claimed" }
  ],
  "flows": [
    { "id": "data",    "zone": "gaming" },
    { "id": "capital", "zone": "quant"  },
    { "id": "traffic", "zone": "media"  }
  ],
  "products": [
    { "id": "minigame", "line": "gaming", "status": "active" },
    { "id": "bigmoney", "line": "quant",  "status": "active" },
    { "id": "bigstream", "line": "media", "status": "onboarding" }
  ],
  "governance": {
    "ceo_orders_pending": [],
    "evolution": { "next_tick": "SUN 09:17", "open_proposals": 2 }
  },
  "history": { "commits_total": 0, "first_commit": "", "last_commit": "" }
}
```

## 三、world-events.jsonl 事件 schema

每行一个事件：`{"ts_utc","type","actor","repo","zone","summary","data?"}`

| type | 含义 | 2D 游戏表现 |
|---|---|---|
| COMMIT | git 提交（任意仓） | 粒子飞向协议晶片层 |
| PUSH / PULL | 多机 git 同步 | 数据光带（机间） |
| TASK_CLAIM / TASK_DONE | 任务认领/完成 | 无人机飞向任务点 / 标签弹出 |
| HEARTBEAT | 机队心跳 | 机柜灯流 |
| OS_TICK_START / OS_TICK_DONE | OS 循环轮起止 | 分区呼吸灯一拍 |
| GATE_PASS / GATE_BLOCK | 门禁通过/拦截 | 光门放行粒子 / 红脉冲拦截 |
| EVOLUTION_PROPOSE / EVOLUTION_LAW | 进化轮提案/立法 | 奇点脉冲射出提案光束 |
| CEO_ORDER | CEO 令（O-*/U-*/开工令） | 指挥核心光脉冲射向分区 |
| DEPLOY | 构建/发布产物 | 世界立方体点亮旋转 |
| CONTENT_PUBLISH | 内容发布（BigStream） | 信号塔波纹 |
| MACHINE_JOIN / MACHINE_RETIRE | 新机接入/退役 | 无人机入场 / 熄灯离场 |
| LINE_OPEN / LINE_CLOSE | 开线/收线五步 | 分区轮廓逐层点亮/暗化 |
| TRANSFER | fleet 大文件互传 | 轨道坞运输光带 |

## 四、感知器数据源（全部只读）

| 源 | 信号 → 事件 |
|---|---|
| 各仓 git log（含 FleetGroup） | → COMMIT / PUSH |
| BigMoney fleet/ 心跳台账 + inbox | → HEARTBEAT / TASK_* / TRANSFER |
| MiniGame 自动化快照.md + OS 轮日志 | → OS_TICK_* / GATE_* / DEPLOY |
| BigMoney OS 循环日志（bm-a/bm-b 侧） | → OS_TICK_* / GATE_* |
| cph4/evolution-ledger.md | → EVOLUTION_* |
| docs/orders.md + 各司令牌台账 | → CEO_ORDER |
| 任务板（job_list / fleet tasks / MiniGame 任务面板） | → TASK_* |
| 各线 README / 登记簿变化 | → LINE_* / 产品状态 |

## 五、实时性（解 A 默认 · B 开关预留）

- **本机（bm-a 侧行为）**：文件 watch → **秒级**
- **异机（bm-b）**：git 轮询节律 → **10min**（解 B = Tailscale 同步后秒级，协议不变只换传输层）
- **游戏侧**：每 ~10s 读 jsonl 增量（游标=已读行数），打开时全量加载 state

## 六、脱敏律（L2 预埋）

- **L1**（被动事件·V1）：只含 id/状态/摘要行，无内容载荷
- **L2**（行为总线·待 T2 立法）：只报「行为摘要+状态」——**禁** prompt 原文 / 文件内容 / 含密钥参数
- **公开面**（M4 参观）：再过滤仓位/财务数字/机队内部代号

## 七、引擎侧实现要点（2D·团结引擎原生）

- 事件路由器：读 jsonl 增量 → 按映射表触发 2D 动画（粒子/光效/灯流/波纹）
- 实体池：state 驱动（分区/机柜/无人机/立方体的位相与亮度），event 驱动瞬时动画
- 回放模式：游标重置到历史行 → 时间轴拖动 = 编年史回放
- 相机：2D 正交，集团总览图 ↔ 分区内景图 = 场景切换

## 八、开放问题（挂 CEO 裁决）

1. 实时方案 A（分层实时·默认）vs B（Tailscale 装机授权）
2. L2 行为总线立法（T2 进化轮提案·脱敏律按 §六）
3. 元宙优先级 vs B/C 商业线（建议 A 机侧起步）
4. 风格编号（2D 约束下 1/3/4 主力）
5. 命名（候选 FluxVerse·不注册不开工）
