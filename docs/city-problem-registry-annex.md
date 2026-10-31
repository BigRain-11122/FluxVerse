# C-20261017-01 线级附卷·城市城建侧（FluxVerse）

- 线: 城市·城建侧（执行体=FluxVerse DevLoop·bm-a 无人值守轮·主线 City3D R2 模块壳＋`world-public/city-panel.html` 产品面）
- 法源: D-20261017-03／C-20261017-01 §3 六线派单（本司单＝`state/queue/main.md` #8）
- 与姊妹卷边界: 居民侧（年轮/池/相遇/反思/QC/行为/关系/基因）见 `cph4/council/C-20261017-01-线级附卷-城市.md`（BigLife）；本卷只覆盖城建侧，**两卷不重叠**
- 数据口径: 数字一律机器直数（本文 §三 由 `Tools/devloop/problem-registry-census.py` 生成并校验）；叙述行给可复核锚点（轮号/文件名/命令），零转录

## 一、十环节城建侧映射

| # | 环节 | 城建侧现役机制（可复核锚） | 在案问题／实锚 | 本轮动作 |
|---|---|---|---|---|
| 1 | 令接收 | `state/runbook.md` 启动首读（<2KB）＋`Tools/devloop/check-fastpath.ps1` 七查（c7 orders 触发）＋`Tools/devloop/resolve-group-root.ps1` 组根活树解析（r683） | **镜像组根陈旧**（D-20261028-04）：本轮新工具首版按 `..\..` 读到旧镜像 `D:\FluxGroup\cph4\...`（14 条），活树为 `%USERPROFILE%\Desktop\FluxGroup`（18 条）——静默少读 4 条，不会报错 | 普查工具改走 `resolve-group-root.ps1` 同规则（ledger mtime 最新者），并把「组根来源」写进附卷，让选错看得见 |
| 2 | 派单 | `state/queue/{main,tech,explore}.md` 三队列·领走即删行·轮尾补 ≥1 新条 | **队列逾期无可见面**：main#8 死线 10-19 逾期 13 天、main#23（benchmark 刷新）逾期 5 天；面板有「应办令」卡（决策面）却无队列逾期面 | 本卷即 #8 收口；逾期可见面列入候选提案（§四 CC-2） |
| 3 | 执行 | `City3D-staging/r2-ignite.ps1` 批建＋`Tools/devloop/city3d-shots.ps1` 只取景＋`Tools/perceptor/verify.ps1` §2b~§2f 巡检 | main#52 空载复测仍跑不了（`Get-Process Tuanjie` 实读 2 个：gui-agent 编辑器＋Cowork hub）＝共机负载不可控，非代码回归 | 不动（按在册判据等 0 进程窗） |
| 4 | QC | 29 套沙盒 `run-panel-suites.ps1`＋五道 PS 闸＋`node logs/devloop-r702-compile-check.js`＋窄屏取证 `narrow-shot.js` | 「呈报面假绿」族三代收紧（r736→r739→r741→r742）：裸文件名不作路径→实况三行须带真实路径→读数不可信不出图→图必须是那份读数（原子替换＋IHDR 自证） | 无新红（本轮 29 套口径照跑 §六） |
| 5 | 呈报 | 面板三行（当前活／最近实物／下个里程碑）＋`PROOF`/`DUTY`/`SITE` 卡，`file://` 可点 | **产物链接随调用路径拼写翻转**：同一 HEAD 下 tick 重建把 `file:///D:/FluxGroup/...` 改成 `file:///C:/Users/sjs20/Desktop/FluxGroup/...`（13 行 diff／次，本轮 00:31 实测） | 入候选条目 CC-1（判据=两种拼写各重建一次，除时间戳外逐字节一致） |
| 6 | 上链 | pathspec 定向 commit＋`Tools/devloop/tasks-board-check.ps1` 板面-§九 双账门＋`write-fastpath-state.ps1` live check（r737） | PR-05 族（多窗推送竞态）在本司＝单写者结构，低风险；本轮照四 SHA live check | 照常执法 |
| 7 | 问题追溯 | 正身＝集团 `cph4/fleet/PROBLEM-REGISTRY.md`（只读消费）；本司实况＝问题写在 TECH §九「发现债/勘注」行 | **城建侧 PR 在册 0 条**（§三 直数），而 §九 在案债务数十条——「零入册」不是「零问题」；这正是 PR-12（线级环节梳理未做）的城市位缺口 | 本卷＋三条 append-ready 候选（§四），由集团审计收取入册（本司不写正身） |
| 8 | 回访 | 每件带「复跑判据」行＋基准面周期律（`docs/global-benchmarks.md` >7 天刷新） | main#23 逾期未刷（10-27 到期） | 排在 #8 之后（§五 计划） |
| 9 | 记忆 | runbook 历史段＋TECH §九＋`world/world-events-*.jsonl` 编年史＋r739 判例「实况三行必须携带至少一个真实路径」 | 实况面依赖 gitignored `logs/`（r736 已知），新机/清 logs 后面板与沙盒会缺件——r736 已立 main#76 待办 | 不新立（归族 PR-10 认知滞后变体面） |
| 10 | CEO 物理件 | 本司零等待件（无账号/无设备/无预算） | 无 | 零催办 |

## 二、口径说明（为什么城建侧命中只能按城建词判）

集团台账里「城市线」一词同时被居民侧卷使用（例：PR-20261017-13/14 的升格记录写着「城市线附卷立册」）。故本普查的城市城建侧判据只认城建词——`FluxVerse`／`超体宇宙`／`City3D`／`模块壳`／`街区`／`取景`／`场景`——**不认「城市」单词**，避免把居民侧条目误计进来。该判据由自检夹具覆盖（`--self-check` 断言「居民侧条目不命中城建侧」）。

## 三、机器直数

（本节由 `python Tools/devloop/problem-registry-census.py --write` 生成；`--check` 在有漂移时 exit 1）

<!-- CENSUS:BEGIN -->
### 机器直数（`Tools/devloop/problem-registry-census.py`）

数据源：`C:\Users\sjs20\Desktop\FluxGroup\cph4\fleet\PROBLEM-REGISTRY.md`（集团正身·只读）

组根：`C:/Users/sjs20/Desktop/FluxGroup`（活树 desktop 镜像；判据=cph4/evolution-ledger.md 最新）

```
CITY_REGISTRY_SUMMARY: entries=18 city=0 open=7 armed=10 closed=0 open_ceo=1 max_recur=7 recur_ge2=8 field_gaps=0 unknown_status=0
```

全部条目（status · 复发计数 · 城市城建侧命中）：

| 条目 | 标题 | 状态 | 复发 | 城建侧 | 出生地闸 |
|---|---|---|---|---|---|
| PR-20261017-01 | 闲置复发 | armed | 7 | 否 | 有 |
| PR-20261017-02 | 弹窗复发 | armed | 6 | 否 | 有 |
| PR-20261017-03 | 执行落地差 | armed | 4 | 否 | 有 |
| PR-20261017-04 | 规则通胀 | armed | 1 | 否 | 有 |
| PR-20261017-05 | 推送竞态互吞 | armed | 1 | 否 | 有 |
| PR-20261017-06 | CEO 物理件积压 | open-CEO | 1 | 否 | 有 |
| PR-20261017-07 | 会话死=泵停 | open | 2 | 否 | 有 |
| PR-20261017-08 | 质量闸失效 | armed | 1 | 否 | 有 |
| PR-20261017-09 | 同步滞后 | armed | 1 | 否 | 有 |
| PR-20261017-10 | 认知滞后 | open | 1 | 否 | 有 |
| PR-20261017-11 | 同令多窗重复 | armed | 1 | 否 | 有 |
| PR-20261017-12 | 线级环节梳理未做 | open | 1 | 否 | 有 |
| PR-20261017-13 | export 续鲜断链（BigLife 产线） | armed | 4 | 否 | 有 |
| PR-20261017-14 | 前台批取消-续跑双环（BigLife 产线） | armed | 2 | 否 | 有 |
| PR-20261026-01 | 机器心跳 GPU 字段失真与键爆炸（bm-c / bm-a） | open | 3 | 否 | 有 |
| PR-20261027-14 | STARVED-EXEC 假红旗（pausedLite 让路窗） | open | 1 | 否 | 有 |
| PR-20261027-15 | POOL 阻断源不随签发清除（P1 卡停滞 7 日） | open | 1 | 否 | 有 |
| PR-20261027-16 | bm-c 驻卡 LLM 占满生成视觉道（P1 产能冲突） | open | 3 | 否 | 有 |

机械校验：

- 六字段缺项：无
- 未知状态值：无
- armed/closed 缺验证证据：无
- armed/closed 缺出生地闸：无

城建侧在册 0 条：FluxVerse 城建线的问题目前记在本仓 TECH §九（发现债/勘注行）与轮内判例里，未进集团 PR 正身——即「零入册」，不是「零问题」。

<!-- CENSUS:END -->

## 四、待入册候选条目（append-ready·城市城建侧）

> 本司按 D-20260924-05 不写集团台账正身；以下三条按 PR 六字段写好，供集团审计班直接入册或改判。

### CC-1 面板产物链接绑定绝对路径拼写（候选 PR）
- 来源: r743 轮内实测（同一 HEAD 9430b86e 下，tick 于 2026-11-01 00:31 重建面板，`git diff` 13 行全是 `file://` 前缀由 `D:/FluxGroup` 翻成 `C:/Users/sjs20/Desktop/FluxGroup`）
- 复发史·根因: 首录·根因＝工程根只按调用方 cwd 拼写解析，而产品面把绝对 `file://` 写进 HTML；同一棵树两种拼写访问即产生无意义 diff，也让「可点链接」在换盘符/换机器后失效
- 出生地闸: 呈报环节（十环节 #5）·builder 生成链接时缺「拼写无关」判据
- 验证证据: 本轮 diff 实锚（13 行）；既有同类判例 r738 `rel_display()`（树内相对／树外绝对）
- 复发计数: 1
- 状态: open
- 升格记录: 2026-11-01 立册候选；判据＝用两种拼写各重建一次，`world-public/city-panel.html` 除时间戳类字段外逐字节一致

### CC-2 队列逾期件没有可见面（候选 PR）
- 来源: r743 轮首（main#8 十环节附卷死线 10-19，至 11-01 逾期 13 天无人领；main#23 基准刷新 10-27 逾期 5 天）
- 复发史·根因: 首录·根因＝逾期状态只存在于队列 md 的备注字里，轮内不做机械比对，面板也不显示；「有人记得」是唯一防线
- 出生地闸: 派单环节（十环节 #2）·队列条目缺结构化的 due 字段与逾期行
- 验证证据: `state/queue/main.md` #8/#23 两行原文（「死线已过 1 日=在册逾期件未领」）
- 复发计数: 1
- 状态: open
- 升格记录: 2026-11-01 立册候选；判据＝面板出现一行「队列逾期 N 件（最久 D 天）」，且与队列 md 直数一致

### CC-3 城建侧问题未进正身（候选 PR·PR-12 变体）
- 来源: 本卷 §三 直数（城建侧命中 0 条）与本仓 TECH §九 在案债务并存
- 复发史·根因: 与 PR-12「线级环节梳理未做」同源·根因＝本司问题登记落在自家 §九，集团正身靠「有人想起来才抄」
- 出生地闸: 问题追溯环节（十环节 #7）·发现债入册缺强制出口
- 验证证据: 本卷（城市城建侧首份线级附卷）＋普查工具可复算
- 复发计数: 1
- 状态: open
- 升格记录: 2026-11-01 立册候选；判据＝下轮起新发现债当轮出「候选 PR 块或明注不登记理由」二选一，缺一即违例

## 五、已立法≠closed 对照（只对本轮实证过的行下结论）

| 法条 | 本司执行面 | 本轮实证 | 判定 |
|---|---|---|---|
| D-20261028-04 组根解析 | `Tools/devloop/resolve-group-root.ps1`（r683）在役 | 新工具首版按 `..\..` 读到旧镜像 14 条，改走同规则后读到活树 18 条；组根来源已写进本卷 §三 | 执法面已覆盖，**新工具入列须同规则**（本轮已加自检夹具） |
| D-20261028-11 组根扩面（`.Path` 空串／方言） | 本司 `resolve-group-root.ps1` 用 `Get-Item ... LastWriteTimeUtc`，不消费 `.Path` | 本轮未新增 `.Path` 赋值点（普查走 python `os.path`） | 不受影响件，留痕 |
| D-20261028-13 里程碑落帧律 | `city3d-shots.ps1` 六帧 r733（`qa/city3d-shots-20261031-2225/2238-bm-a-*`） | 面板取景卡取到最新帧且未转红（r733 收口行） | 已满足「最新帧 <7 天」 |
| D-20261026-20 复产归位 | 本司 DevLoop 在跑 | 该行属集团侧对本司轮次状态的裁定，本窗不擅断 | **待 HQ 收取面确认**（不在本卷下结论） |

## 六、闸升格轨迹（呈报面假绿族的城市线实例）

1. r736：`Resolve-ArtItems` 只认带目录 token，裸文件名不再当路径（`art_bare` 计）
2. r739：实况三行必须携带至少一个真实路径（否则面板契约不成立）
3. r741：窄屏取证读数不可信就不出图（`VERDICT: SHORT`、exit 2、旧图不动）
4. r742：出图必须是那份读数（旁路件＋`rename` 原子替换＋IHDR 图幅自证）

同族判据每次都是「上一轮的新证据把上一轮的假绿打回」，属 PR-08（质量闸失效）变体面的正向收敛，不新立条目（防 PR-04 台账通胀）。

## 七、本卷自注册验收判据

1. `python Tools/devloop/problem-registry-census.py --self-check` → `SELF_CHECK OK`（含组根活树解析三态、居民侧不误命中城建侧）
2. `python Tools/devloop/problem-registry-census.py --check` → `ANNEX FRESH`（附卷数字与活树正身不漂移）
3. §三 的 `entries=` 等于活树正身实际条目数（本轮 18）；`city=` 归零时必须保留「零入册≠零问题」解读行
4. 本卷在册后 main#8 从队列销行，TECH §九 落指针行；候选三条在 HQ-FEEDBACK 有回执行