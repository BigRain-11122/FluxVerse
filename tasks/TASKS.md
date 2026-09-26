# FluxVerse canonical 任务板

> 协议 `fluxverse-tasks/0.1` · 首建 2026-09-26 r173（集团全员无闲令 P-20260925-12 @FluxVerse 建板·72h 窗内·09-28 09:23 周巡任务面首判前）
> **权威分工（单一权威制 r52 不破）**：施工正典=`TECH.md` §九（实况/收口/阻塞唯一权威·每轮先读）；本板=canonical 任务面/审计入口——**薄指针面零叙述**（每行=ID+一句+指针+状态），随 §九 翻面同轮同步，禁在板内复述进度。
> 开单口径（P-20260925-12）：**自可执行+blocked 分列**；blocked-on 单列示、**禁充当在岗面**（禁待命·自主运转令 P-20260926-03：待命态=RED·P0 1h 修正）；常设律=每批收口保 backlog ≥1 自可执行开单。
> 机读口径（patrol-probe v1.1 [TASKS]）：两表 4 列——自可执行表状态列=`open`；blocked 表状态列=`blocked-on:*`（不计在岗）。已收口单即行移除（正典=§九 行·防双账）。

## 一、自可执行开单（在岗面）

| ID | 任务 | 指针/判据 | 状态 |
|---|---|---|---|
| T-FV-118 | 轮首七查机械化只读脚本（fastpath-check.ps1）——会话每轮手查五命令=token 成本+显示面假象不确定族（r163 tick 首查塌并假象/r195 状态档失键勘定/r197 tick 尾捕获吞行·r163「红扫读法以 ReadAllText 归一化直读为准」律已在册）：单件只读脚本七行判读输出（①tick 红扫归一化直读②树豁免③④⑥⑦四 SHA 对表⑤BigStream html 快查）+沙盒断言+轮首实装对照（脚本判读 vs 会话七查一致） | TECH §九 r198 行；判据=沙盒绿（r198 毕 79/79）+下轮轮首脚本/会话双跑判读一致 | open |
| T-FV-119 | r198 新法入双技能 references 律册滚动更新：-match 捕获组=$Matches[1] 裸串（.Value 属性不存在→静默 $null 进 TryParse=恒 false 假静·check-fastpath 心跳连串首版双红实锤）——ps51-traps（sandbox）+ps51-gdi-traps（bake）各一条+安装副本同步+三门烟测复跑 | TECH §九 r198 行⑤；判据=律册行入+安装副本 SHA 同步+烟测复绿（r194 范式） | open |

## 二、blocked 面单列（禁充当在岗）

| ID | 事项 | blocked-on（外部依赖） | 状态 |
|---|---|---|---|
| T-FV-101 | P-16 MEDIA 城注册行 | media/BigStream 出现任一 html 面板 | blocked-on:BigStream |
| T-FV-102 | P-62③ residents 探针转消费端 | BigLife anchor-lines.jsonl 落盘 | blocked-on:BigLife |
| T-FV-103 | P-41 余六型引擎演出映射 | T2 否决窗至 2026-10-01/10-02 | blocked-on:机制窗 |
| T-FV-104 | LAB 三型发射端翻 emitting（孵化舱演出） | BigDomain Phase 1（待机律禁空转） | blocked-on:BigDomain |
| T-FV-105 | AA-034 节庆烟火接线 | 真实事件源（禁装饰动画律） | blocked-on:事件源 |
| T-FV-106 | RV/OR 城区居民身份池开池 | 城区落图 | blocked-on:城区落图 |
| T-FV-107 | P-27⑥ BGM 四档试听校准 | 人耳物理听感 | blocked-on:人耳 |
| T-FV-108 | P-45 直播推流线 | M2 判据过→P2 冻结解除 | blocked-on:M2 |
| T-FV-111 | pod/birth 接缝辉 4px 收紧 re-bake（r187⑤·r190 GATED 保留现态） | CEO 复验批 F-20260926-10 翻面点名 | blocked-on:CEO 复验 |

## 三、翻面律

- 收口同轮同步：§九 行收口 → 本板对应行移除（正典在 §九）；新开单 → 自可执行表加行；blocked 解封 → 移回自可执行表。
- 每批收口自检：自可执行表 ≥1 行（无闲令常设律）；全空=违例即领 §九 新债或勘注收口类小步（r50/r51 先例）。
