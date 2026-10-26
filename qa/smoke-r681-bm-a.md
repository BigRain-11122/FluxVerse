# 浸泡 launcher 设置残留自愈闸 收据（main#18 收口 · r681 · bm-a）

> 法源=queue main#18（r680 发现债）+ docs/qa-r2-frame-map.md §三.4/§四.3
> 载具=Tools/devloop/r2-soak.ps1（launcher）+ City3D/Assets/Editor/CityRebuild/R2SoakProbe.cs（探针）
> 计分口径=能跑/能用实物（2）·本件产物=launcher 内建自愈闸（含独立修复开关）+ 三径实证

## ① 病面（r680 遗留债的具体形制）

探针为让 play mode 保住静态订阅，在 `BatchEntry` 内临时写工程设置：

| 键 | 基线 | 浸泡期临时值 |
|---|---|---|
| `m_EnterPlayModeOptionsEnabled` | 0 | 1 |
| `m_EnterPlayModeOptions` | 3 | 1（DisableDomainReload） |

还原只在 `Finish`/`Fail` 的 `RestorePlayModeOptions()` 里发生。**任一路径在还原前被强杀即留污染**：

1. launcher 看门狗 20min 超时 → `$proc.Kill()`；
2. launcher 自身被外部杀（会话/工具链重启连坐）；
3. 人工 `taskkill`。

残留后果=工程全域**域重载关闭**：此后任何会话（含交互窗）进 play mode 都不再重载域，静态状态跨次残留——排查成本极高且症状与「代码没生效」同形。

## ② 改面（本轮代码改动）

`Tools/devloop/r2-soak.ps1` 新增 `Restore-PlayModeSettings`（正则回写两键 → 0/3，UTF8 无 BOM 原编码写回）并三处接线：

| 位置 | 行为 | 输出行 |
|---|---|---|
| 参数 `-RestoreOnly` | 单件修复并退出（**不需要编辑器存在**，抢救面） | `SETTINGS_CLEAN` / `SETTINGS_RESTORED` / `SETTINGS_MISSING`(exit 1) |
| 启动编辑器前 | 上一轮残留先清，保证每跑必有干净基线 | `SOAK_PRE_SETTINGS_RESTORED`（仅改动时打印） |
| 进程退出后（**含超时 Kill 径**） | 报告前先还原——正是探针自身还原不会触发的分支 | `SOAK_POST_SETTINGS_RESTORED` / `SOAK_SETTINGS_CLEAN` |

收据 `.done` 新增 `settings_pre` / `settings_post` 两键（fail-loud 可核）。

## ③ 实证（三径，全部实跑）

| # | 径 | 命令 | 结果 |
|---|---|---|---|
| A | 干净面 | `r2-soak.ps1 -RestoreOnly` | `SETTINGS_CLEAN`·exit=0·文件零改动 |
| B | 污染面 | 人工置 1/1 → `-RestoreOnly` | `SETTINGS_RESTORED`·exit=0·两键实测回 `0` / `3` |
| C | 无损性 | `git status --porcelain -- City3D/ProjectSettings/EditorSettings.asset` | **零输出**（restore 后与 HEAD 逐字节一致）·长度 1107→1107 |

静态检查：`Parser::ParseFile` 零语法错；脚本本体纯 ASCII（仅保留既有 UTF-8 BOM 前缀，无中文）；`-RestoreOnly` 走参数早退，不触碰 GUI 占用自检与进程启动分支。

## ④ 判定

- **main#18 PASS 收口**：判据「资产两键回 0/3」满足，且从「人工事后修」升格为**可复用自愈闸**（预还原 + 后还原 + 独立开关三面）。
- 风险等级下降：强杀残留从「需人发现 + 手工改 YAML」降为「下一跑自动清 / 一条命令即修」。

## ⑤ 诚实边界

- 本轮**未跑真浸泡**（main#17 触发条件=City3D 新 commit 或 ≥48h，当前两条均未到），故「后还原」只在 A/B/C 三径与超时分支代码路径上验证，**未被真实 Kill 事件触发过**。
- 下次浸泡轮（main#17）须核收据 `settings_pre` / `settings_post` 两键与 `SOAK_POST_SETTINGS_*` 输出行；若真出现强杀，收据应记为 `RESTORED` 而非 `CLEAN`。

## ⑥ 指针
- launcher=Tools/devloop/r2-soak.ps1（本轮改动面，155 行）
- 探针=City3D/Assets/Editor/CityRebuild/R2SoakProbe.cs L79-L82 写 / L265-L270 还原
- 资产=City3D/ProjectSettings/EditorSettings.asset（L26-L27 两键）
- Token 三问=**L1**（纯确定性文本回写·零 LLM/AIGC 触点）