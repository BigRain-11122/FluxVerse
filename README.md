# FluxVerse — 超体宇宙城（FLUX 元宙）

> 定位：**城即集团**——集团经营的实时游戏化镜像：AI 行为实时剧场（CEO 第一需求令原话：「AI所有的行为都要在集团总控里面能看到实时的游戏化的表现」；禁装饰性动画）。
> 概念：**超体宇宙集团是顶层大脑，在城市中心**（CEO 概念令）——超体脑塔居市中心·三城环绕·机器人在街道巡行=机队 AI 劳动。设定全文 = `DESIGN.md`（设定书）。
> 承建：Biggame（AI 游戏公司）·技术 = **团结引擎 1.10.3 原生 2D**（CEO 硬约束原话：「我说了 全部是2D 不碰3D」「游戏是团结引擎原生」）。
> 开线：2026-09-23 CEO 点名 **FluxVerse**，开线五步由集团总控会话走毕——**产品内容在本仓推进，勿在别处重复建设**。
> 架构：感知器独立只读扫描（world-state.json + world-events.jsonl，只读不破跨仓写禁令）→ 引擎侧只读轮询渲染（每 ~10s）；零服务器零预算（MiniGame 红线）；协议草案 = `docs/design/fluxverse-protocol-draft.md`。
> 治理：FluxGroup governance.md §2 登记簿；BRAND §8 locked；对集团层反馈 = 本仓根 HQ-FEEDBACK.md；门禁链同源（X026Gate / EncodingGate / NameCheck 随建随接）。

## 状态（onboarding）

- **M0 收口中**：设定书已立（`DESIGN.md`）· 风格待 CEO 点选（探索稿六式 = `docs/design/fluxverse-styles.html`·1/3/4 为主力）· 数据协议草案 v0.1 已定
- remote 待建：CEO 物理件（GitHub 私库 `BigRain-11122/FluxVerse`，可与 BigStream 一并建），建好后 `git remote add origin … && git push -u`
- M1 起点：团结引擎 2D 工程 + 感知器骨架（快照扫描 → world-state.json）+ 脑塔骨架场景

## 读序

1. 本 README
2. `DESIGN.md` —— 超体宇宙城设定书（概念 / 城市 / 行为映射 / 视觉律 / 里程碑）
3. `docs/design/fluxverse-styles.html` —— 六风格探索稿（CEO 挑选中）
4. `docs/design/fluxverse-protocol-draft.md` —— 数据协议草案 v0.1
