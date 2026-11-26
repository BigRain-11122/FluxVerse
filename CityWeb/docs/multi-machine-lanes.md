# 多机多池并行开发宪章 v1（CEO 令 2026-11-26「多台机器多个算力池一起来，还不会乱」）

> 本件=CityWeb 多机协作宪法。前置：`parallel-governance.md`（单机总管制）+ `city-module-map.md`（7 域 41 模块）。
> 本件补齐：**22 条细粒度泳道 × 5 台机器 × 4 个算力池** 的分工、认领、合并、租约与防乱机制。

## 一、5 台机器 × 4 算力池（能力表）

| 机器（CEO 叫法） | 节点 | 硬件 | 算力池 | 能干什么 |
|---|---|---|---|---|
| **公司生产力机** | bm-a | 4070S 12G / 94G RAM / 32C | **POOL-INTEG**（总管+渲染+QA） | 集成/合并/真机 GPU 录屏/headed Chrome 审片 |
| **传家宝** | bm-b | 8G VRAM / 24G RAM / 16C | **POOL-BUILD**（构建验证） | tsc/build/冒烟/四门回归 |
| **小钢炮** | bm-c | 3070 16G / 24G RAM / 32C | **POOL-ASSET**（资产烘焙） | 程序化资产烘焙/贴图/动物 body plan 试烧 |
| **算力大脑** | bm-d | 双 CPU（单路可用） | **POOL-CPU**（数据重活） | OSM 全量管线/量化切片/大文件处理 |
| **MacBook 主控台** | bm-m | macOS | **POOL-REVIEW**（审阅） | 跨平台验收/第二双眼睛 |

**池与泳道匹配律**：泳道声明所需能力（caps: node/tsc/python/chrome/gpu），机器注册时声明自身能力——**匹配才认领**，这从结构上杜绝「机器干不了却占坑」。

**关键红线（机队法直承）**：
- 一切远程执行任务 S4U 注册，**禁 InteractiveToken**（黑窗判例）；wscript //B 静默壳。
- 每机 CPU 合计 ≤ 物理核−2；GPU 重活让路 AutoYield（bm-a 工作日 09:00-19:00）。
- 不杀他线进程；清锁前验零持锁者。
- 忠诚律：每机只改 **自己认领泳道的文件域**，跨域写入=自动作废（CI 检查 git diff 的文件前缀）。

## 二、22 条细粒度泳道（对齐 7 域）

| ID | 域 | 泳道 | 文件域（独占） | caps |
|---|---|---|---|---|
| A1 | 底座 | OSM 阶段1 全量管线（3808 栋→量化切片） | `tools/osm-stage1-*.py` `data/slices/*` | python,net |
| A2 | 底座 | 合批收尾（地标 C2 续+剩余 offender） | `src/city/*Batched.ts` | node,tsc |
| A3 | 底座 | 交付体积（pako 切片压缩/build 链扩展） | `tools/build-static.mjs` | node |
| A4 | 底座 | 存档+事件（saveSystem/PLAYER_ACTION 注册） | `src/core/*` | node,tsc |
| B1 | 建造 | 切片加载器（realCity 数据源切 slice） | `src/geo/sliceLoader.ts` | node,tsc |
| B2 | 建造 | 内环街网/道路带 | `src/city/streetGrid.ts` | node,tsc |
| B3 | 建造 | 可进入建筑扩容（馆→商圈 3 座） | `src/city/enterableExpansion.ts` | node,tsc |
| C1 | 美术 | 硅基外壳材质库（化身/动物/楼共用） | `src/art/siliconShell.ts` | node,tsc |
| C2 | 美术 | 后期增强（SSAA/色调分级） | `src/render/postfxPro.ts` | node,tsc,chrome |
| C3 | 美术 | 事件粒子（出生/警报粒） | `src/live/eventParticles.ts` | node,tsc |
| C4 | 美术 | UI 视觉（玩家/职业/对话面板皮肤） | `src/ui/theme.ts` | node,tsc |
| D1 | 智能体 | 居民对话语料/剧本（32 席） | `src/agents/dialogCorpus.ts` | node |
| D2 | 智能体 | 居民关系网（echoes→社交图） | `src/agents/socialGraph.ts` | node,tsc |
| D3 | 智能体 | 动物/宠物 NPC（procedural-animals 复用） | `src/agents/animalNpcs.ts` | node,gpu |
| E1 | 玩家 | 化身捏造 UI（源质三轴） | `src/player/creator.ts` | node,tsc |
| E2 | 玩家 | 生命数值接线（lifeState→HUD 面板） | `src/ui/lifePanel.ts` | node,tsc |
| E3 | 玩家 | 交互接线（interaction→main 接线件） | 归总管（不许泳道） | — |
| E4 | 玩家 | 职业分化台（四城） | `src/player/vocationDesk.ts` | node,tsc |
| E5 | 玩家 | 异化形态（狗/鸟/机器人 body plan） | `src/player/forms*.ts` | node,gpu |
| F1 | 玩法 | 通缉/前科状态机 | `src/gameplay/warrant.ts` | node,tsc |
| F2 | 玩法 | 委托系统（锚真实 TASK 事件） | `src/gameplay/quests.ts` | node,tsc |
| F3 | 玩法 | 犯罪-追捕事件链 | `src/gameplay/pursuit.ts` | node,tsc |
| G1 | 运维 | 泳道板/claim/runner（本件） | `lane-board.json` `tools/lane-*.ps1` | node |
| G2 | 运维 | CI 闸自动化（任务注册） | `tools/ci-gate.ps1` | node |
| G3 | 运维 | 巡航录屏（headed 真机） | `tools/cityweb_cruise_record.py` | chrome,gpu |

## 三、不乱的六个机制（缺一即乱）

1. **泳道板=唯一任务源**（`CityWeb/lane-board.json`，git 同步全机）：机器只看板，不自行发明活。
2. **认领+租约**：`lane-claim.ps1 claim` 把泳道写给机器，带 `lease_until`（默认 4h）。租约到期未续=自动回 open（别人可接，**防机器死了占坑**）。
3. **分支隔离**：每条泳道推 `lane/<id>` 分支，**禁直推 main**；main 只有总管（POOL-INTEG）合并。
4. **文件域独占**：CI 校验提交 diff 必须落在泳道声明的文件前缀内，越界=拒收。
5. **四门通行**：每机推送前自跑 tsc/build/冒烟/offender 四门，红=不推（在本地修）。
6. **心跳**：每机每 10 分钟写 `machines[]` 行的 last_seen（同 fleet machines 心跳范式）；总管看板判活。

## 四、执行协议（机器侧一条命令）

```
# 机器注册（每机一次）
powershell -File CityWeb/tools/lane-claim.ps1 -Action register -Machine bm-b -Caps "node,tsc"

# 领活并干（runner 自动：pull→claim→worktree→codely -p→四门→推 lane/<id>→release）
powershell -File CityWeb/tools/lane-runner.ps1 -Machine bm-b

# 看板
powershell -File CityWeb/tools/lane-claim.ps1 -Action list
```

**总管合并流**（bm-a）：`lane/<id>` 推上来 → 四门复跑 → `git merge`/checkout 引入 → registry 加行 → 接线 main.ts → 推 main → 板标 done。

## 五、防乱判例（今日实战沉淀）

- 两窗同改 main.ts 冲突（三次）→ main.ts 独占律已立法
- 工作树被清导致未提交集成面丢失 → **泳道收完立即推分支**，禁裸挂
- tick 运行时快照与合并打架 → stash push/drop 隔离
- 泳道超期（C2 两连败）→ 勘察/实施分离续派 + 租约到期回收

## 六、与集团机队的关系

- 心跳/任务卡沿用集团范式（machines/*.json 心跳、S4U、VBS 静默），但**泳道板是 CityWeb 自己的**（本仓 git），不污染 BigMoney fleet。
- 跨司红线：city 线机器上的活只读集团仓；写只写 FluxVerse 仓。
