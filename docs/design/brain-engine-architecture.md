# 脑塔 ↔ 团结引擎 架构设计 v1.0
> 控制端=超体大脑（CPH4 Labs/脑塔）·施工端=团结引擎（Unity）
> 核心：脑塔发令，Unity 施工，中间是 world-events 总线

## 一、一句话架构

**脑塔是大脑（决策+感知），Unity 是身体（渲染+动作），world-events.jsonl 是神经。**

```
┌─────────────┐     发令/事件      ┌─────────────┐
│  脑塔(控制端) │ ──────────────→ │ Unity(施工端) │
│  CPH4 Labs   │                  │  团结引擎1.10 │
│  决策轮/夜轮  │ ←────────────── │  2D渲染/事件  │
│  探针/台账    │     状态回传      │  机器行为     │
└──────┬──────┘                  └──────┬──────┘
       │                                │
       └──────── world-events.jsonl ────┘
                    (神经总线)
```

## 二、脑塔（控制端）做什么

| 职能 | 产出什么 | 写到哪 |
|---|---|---|
| 感知 | 真实时间/天气/行情/git/机队状态 | world-state.json |
| 决策 | CEO 令/决策轮拍板/夜轮自愈 | world-events.jsonl (CEO_ORDER/DECISION/NIGHT_ROUND) |
| 规划 | 新建筑提案/新街区/新居民 | world-events.jsonl (PROPOSAL/APPROVED) |
| 指挥 | 派工/转办/验收 | world-events.jsonl (TASK_CLAIM/TASK_DONE) |
| 错误 | E0-E3 告警 | world-events.jsonl (ALERT) |

**脑塔不直接碰 Unity 场景**——它只写事件，Unity 自己消费事件。

## 三、Unity（施工端）做什么

| 职能 | 怎么消费 |
|---|---|
| 渲染 | 2D 俯视角高清像素场景（北外滩+陆家嘴+黄浦江） |
| 事件映射 | 读 world-events.jsonl → 每个事件映射成一个视觉演出（光脉冲/建筑长出/窗灯亮灭/机器人走动） |
| 心跳 | 每 10 分钟 Tick 一次：读新事件→更新场景→写状态回传 |
| 状态回传 | 当前渲染状态/帧率/异常→world-state.json |
| 施工 | DevLoop 建城（新建筑/新街区/新光效） |

**Unity 不做决策**——它只按事件演出。没有事件=没有动画（禁装饰律）。

## 四、事件总线协议（world-events.jsonl）

每条事件一行 JSON，格式：

```json
{"ts":"2026-09-24T15:30:00+08:00","type":"CEO_ORDER","source":"orders","payload":{"id":"O-20260924-1530","msg":"开直播线"},"city_action":"tower_pulse_white"}
```

| 事件类型 | 脑塔产出 | Unity 演出 |
|---|---|---|
| CEO_ORDER | CEO 下令 | 脑塔中间天线白光脉冲 |
| DECISION | 决策轮拍板 | 脑塔切顶蓝绿闪 |
| TASK_CLAIM | 机队领任务 | 对应建筑窗灯亮/机器人出门 |
| TASK_DONE | 任务完成 | 机器人回家/窗灯灭/光脉冲 |
| COMMIT | git 提交 | 南岸→北岸数据光流过江 |
| BACKTEST | 回测完成 | QUANT 扭塔金色脉冲 |
| DEPLOY | 游戏上线 | GAME 方塔群青色闪 |
| NEW_RESIDENT | 新居民入城 | 基座广场多一个光点 |
| ALERT | 错误告警 | 对应建筑红带闪 |
| NIGHT_ROUND | 夜轮跑完 | 脑塔数据带从下往上扫 |

## 五、数据流方向（单向律）

```
脑塔 → 事件 → Unity 演出 → 状态回传 → 脑塔
 (写)    (读)    (渲染)      (写)        (读)
```

- **脑塔写事件，Unity 读事件**——单向，禁 Unity 写事件回脑塔
- **Unity 写状态，脑塔读状态**——单向，禁脑塔直接读 Unity 内存
- 中间只有两个文件：world-events.jsonl（事件流）+ world-state.json（当前状态）
- 两阶段晋升：新事件先写 .new → verify 通过 → 晋升正式（防坏事件入城）

## 六、施工分工

| 谁 | 做什么 |
|---|---|
| CPH4 Labs（脑塔） | 规划/决策/写事件/验收 |
| FluxVerse-DevLoop（Unity 施工队） | 建城/建建筑/建事件映射/修 bug |
| FluxVerseTick（心跳） | 10 分钟轮：读新事件→推 Unity→写状态 |
| CEO | 看查令/四输入面/终裁 |

## 七、纪律

- 脑塔不碰 Unity 场景文件——只写事件
- Unity 不做决策——只按事件演出
- 没有事件=没有动画（禁装饰律）
- 一切视觉必须对应真实事件（诚实律）
- 两阶段晋升防坏事件入城（已建成）
