# 浸泡还原闸基线守卫升级 收据（main#19 收口 · r682 · bm-a）

> 来源=queue main#19（r681 自评发现债）+ TECH §九 r681 行⑥
> 落点=Tools/devloop/playmode-settings-guard.ps1（新）· Tools/devloop/r2-soak-playmode-baseline.txt（新）· Tools/devloop/r2-soak.ps1（改）
> 计分口径=能跑/能看实物（2 分）——本件判据=改动后的闸能跑且可证伪（ABORT 不覆盖），非纯文档

## ① 病面（r681 遗留债的具体形状）

r681 的还原闸把「基线」写死为 `0/3`：

```
m_EnterPlayModeOptionsEnabled: 0
m_EnterPlayModeOptions: 3
```

只要当前值不等于 `0/3`，闸就无条件回写。后果：任何人（含交互窗、含未来我们自己的调优）有意改动这两个键，
都会被闸**静默回写**——守护逻辑吃掉合法改动，而且没有任何痕迹。r681 自评即此债。

## ② 改面

| 件 | 性质 | 内容 |
|---|---|---|
| `Tools/devloop/playmode-settings-guard.ps1` | 新增 | 闸逻辑独立成文件：`Get-PlayModeState` / `Get-PlayModeBaseline` / `Restore-PlayModeSettings`；返回首 token 四态 `MISSING` / `CLEAN` / `RESTORED` / `ABORT <detail>` |
| `Tools/devloop/r2-soak-playmode-baseline.txt` | 新增 | 基线正典 `enabled=0` / `options=3`；注释行不参与解析 |
| `Tools/devloop/r2-soak.ps1` | 改 | dot-source 闸件；`-RestoreOnly` 遇 ABORT → exit 2；启动前预还原遇 ABORT → `SOAK_ABORT_SETTINGS` + exit 2 拒跑；收据新增 `settings_base` 键，pre/post 携带 `base=… cur=…` 对照 |

判定规则（写死在闸件里）：

- 当前 == 基线 → `CLEAN`，零写入
- 当前 == 探针自身残留（`1/3`，即 enabled=1 + DisableDomainReload）→ `RESTORED`，回写基线
- 其它任何组合 → `ABORT`，**零写入**，调用方 fail-loud
- 基线文件缺/不可解析 → `ABORT baseline_unreadable`（绝不猜基线）

## ③ 实证

沙盒断言 `logs/devloop-r682-baseline-guard-test.ps1`：**8/8 PASS**

| 用例 | 输入 | 期望 | 实测 |
|---|---|---|---|
| c1-clean | 0/3 | CLEAN | `CLEAN base=0/3 cur=0/3` |
| c1-untouched | 0/3 | 字节恒等 | byte identical |
| c2-residue | 1/3（探针残留） | RESTORED | `RESTORED base=0/3 cur=1/3` |
| c2-back-to-base | 残留后 | 回 0/3 | now=0/3 |
| c3-abort | 0/1（漂移） | ABORT | `ABORT drift base=0/3 cur=0/1` |
| c3-untouched | 0/1 | 不覆盖 | 逐字节未动 |
| c4-no-baseline | 基线缺档 | ABORT | `ABORT baseline_unreadable` |
| c5-missing | 设置缺档 | MISSING | `MISSING` |

真实工程（只读验证，不碰实库）：

```
Tools\devloop\r2-soak.ps1 -RestoreOnly
SETTINGS_CLEAN base=0/3 cur=0/3
rc=0
```

`git status --porcelain -- City3D/ProjectSettings` 零输出 = 零写入。

## ④ 判定

main#19 两条判据全过：

1. 基线被人为改动时 **ABORT 不覆盖** → c3 用例+真实工程 CLEAN 双证
2. **收据带 baseline 键** → `settings_base` 已接线（真浸泡轮会在 `.done` 里出现）

结论：**PASS 收口**。

## ⑤ 诚实边界

- launcher 侧 **exit-2 端到端路径未实跑**：要触发它必须把真实工程设置改成漂移态，违反「不碰实库」纪律。当前只有判定函数层（沙盒 8/8）与 exit 映射的三行代码可审。
- **真浸泡本轮未跑**（main#17 仍候专轮）：City3D 最近提交 2026-10-26 18:36，早于 r680 浸泡窗；「≥48h」与「City3D 新 commit」两条判据本轮均未新达标。
- 首版解析器曾把基线文件注释里的示例串 `enabled=1 options=3` 当正解（得出 base=1/3 → 全部漂移判定），已修为「注释行不参与解析」；该坑本身留档于此。

## ⑥ 指针

- TECH §九 r682 行（正典）
- queue main#19 销行 → 补 main#20（探针收据 ABORT 事件观察位）
- 上游：qa/smoke-r681-bm-a.md §②/§⑤、qa/smoke-r680-bm-a.md（浸泡基线 608.5fps）
- 断言件：logs/devloop-r682-baseline-guard-test.ps1