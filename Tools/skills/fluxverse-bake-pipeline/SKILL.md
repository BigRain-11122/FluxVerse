---
name: fluxverse-bake-pipeline
description: FluxVerse 超体宇宙城「GDI+ 自焙管线」——City 一切程序化资产（影子/名牌/身份卡/气泡/发光体/玻璃舱/篷面/立面皮/水象/光效/倒影翻转/裁切镜像）烘焙前的配方勘定、确定性烘焙器施工、fail-loud 验证门与多模态风格闸。Use when a FluxVerse DevLoop/tick round must bake, crop, mirror, or re-bake any City asset (new ArtPacks/Data png, plates, cards, glows, facades, water-fx, light-fx), add a PpuFor importer row, or run a 烘焙断言门. 十二代实证 r87/r97/r113/r140/r149/r151/r154/r157/r168/r175/r185/r188.
---

# FluxVerse 烘焙轮（GDI+ 确定性自焙管线）

城市场景一切程序化资产的生产正道（外采判负/直用不适时的第三径）：GDI+ 确定性烘焙 + SHA 幂等门 + fail-loud 自检 + 多模态风格闸。本技能 = 烘焙轮固定工序 + 配方族 + PS5.1/GDI+ 陷阱律的跨会话固化（源 = TECH §九 十二代烘焙轮 r87→r188 定谳·三役 r175/r185/r188）。

## 硬律（每轮先读）

1. **确定性铁律**：同输入必同输出字节——烘焙器双跑 SHA256 逐位同（幂等门）；GDI+ 全确定性可证（r24 bevel 三层律实证）；任何随机源/时间戳禁入烘焙体。对已提交件重跑必须 SHA 同（stale 拒写·r132 ALREADY CURRENT 先例）；改配方=全件重焙+记录帧随引擎轮重拍。
2. **fail-loud 门电池**：in-script 自检（尺寸界/角透明/带位计数/互异/双跑）+ harness 独立复算（**非信任烘焙打印**——r168 A5 律：lit/glass/像素带一律盘上独立重数）。任一门红即 exit 1，禁暗降阈值；红在 harness 面时先自审门面（r154 门面首红自证律：产物独立复算/探针行为指纹/门面括号 bug 三探针）。
3. **ASCII-only + CJK 外置**：烘焙器脚本体纯 ASCII（$PSScriptRoot 自定位·r163 自愈律）·中文路径/文案外置 UTF-8 数据件（r53 显式读律：Get-Content/Select-String 对 CJK 件一律 -Encoding UTF8）·像素测量 [math]::Floor(v+0.5) 唯一正舍入（r157 银行家舍入律）。动笔前先读 `references/ps51-gdi-traps.md`。
4. **风格闸三轮**：入城件过 art-target-dusk 锚和谐度（色调/密度/质感/**明度四轴**——r152 k37 判负教训：违例恰在未覆盖轴）·FAIL 回退换件禁静默留（r111 律）·台架 4× 拼图 + 1x 低 alpha 双读（r157 周期律纹理教训）。判据与三轮范式 = `references/style-gate.md`。
5. **接线三件**：CityImportPostprocessor.PpuFor 行（新包缺即加·r97 先例·48px 胞默认 →24）+ ARTPACKS-LEDGER 自产/消费节 + .meta 留首个编辑器轮导入（P-27⑤·pre-editor 零 meta=诚实态勿手写）。
6. **消费前自证**：烘焙件入引擎前先盘验（IHDR 直读禁猜路径）·PPU 分档预演（L0 27px/u → PPU24 最优；PPU48=L1 档 shimmer 险·r150⑤）·比例门最稳取舍进布设沙盒轮（city-sandbox 技能面）。

## 工序（六相·单轮 1-2 相·宁小勿大）

**Phase 0 配方勘定**：盘验源资产（尺寸/连通域/带结构·估禁直采）→ 三径判定（直用/自焙/外采·S 库四闸+U121 轻档）→ PPU 分档与尺寸界预演（世界 u=px/ppu）→ 色谱锚定（五色律功能色/art-target-dusk 采样 bins）。

**Phase 1 烘焙器施工**：`Tools/city/bake-<name>.ps1`（配方族与 in-script 门 = `references/bake-recipes.md`）——GDI+ 绘制面 + stale 拒写 + 源只读门（size+mtime 双不动自证）+ 自检门全带。

**Phase 2 验证门**：复制 `scripts/bake-harness-template.ps1` → `logs/devloop-r<N>-<name>-test.ps1`，填 FILL 段，跑六面：A0 烘焙器 ASCII 审计+**A0b PSA 高值子集顾问位**（T-FV-125：auto-var 赋值/null 序/BOM 三律·噪音层 grandfather 排除表声明在 psa-advisor 头注·PSA 模块缺席=可见 note 降级） / A1 盘 census+IHDR / A2 SHA 钉（存量对 r 前提交版·新件本轮钉版）/ A3 双跑幂等+件间互异 / A4 角透明像素门 / A5 独立复算（lit/glass/带位盘上重数）。全绿才继续。

**Phase 3 风格闸**：4× 拼图多模态判（三轮定谳范式：首判负→改案→复判·FAIL 回退换件）→ 入世界层件加锚合成图预演（皮件贴现城实位合成·贴纸感判负·r151 C 组先例）。

**Phase 4 入库接线**：产件落 `City/Assets/ArtPacks/<pkg>/` 或 `Assets/Data/` + PpuFor 行 + ARTPACKS-LEDGER 节 + （消费布设）转 city-sandbox 布设沙盒轮。

**Phase 5 verdict + 收口**：verdict print（门计数+SHA12 族+缺口呈报面）+ TECH §九 一行收口（SHA12 族+门计数入行）+ 定向 commit。

## 断言纪律

- harness 留 `logs/`（gitignored·证据摘录进 §九 行）；烘焙器与产件入 git 正典。
- gitignored 路径（logs/·world/）glob/grep 零命中——被忽略档一律 PS 直读（r159b）。
- 像素门禁混两套行序：GDI/纹理 y=0=图底 vs PNG 盘读 y=0=顶——两式换算必须镜像翻转（r160 律）。
- 新法回写：每轮首红若为全新陷阱 → 修法入 `references/ps51-gdi-traps.md`（带 r 号溯源）。
