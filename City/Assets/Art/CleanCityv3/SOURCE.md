# CleanCityv3 资产来源登记（retention R2 引用面）

- 拷入日期：2026-09-23（DevLoop r9·P-15② 资产接线）
- 源仓（只读兄弟仓）：`gaming/MiniGame/Art Assets/AA-022_SceneBG背景_清洁城市与万圣节动画件_GuttyKreum/CleanCityv3/`
- 拷贝授权：CEO P1 署名令（ledger P-202609-23-15 原文「City 里是美术资产…」——CEO 令即拷贝授权）
- 拷贝范围（844 件）：`Tiles/`（602 件 16×16 单 tile）+ `AnimatedTiles/`（240 件动画帧：旗帜×3 色/喷泉×4 角/树×2）+ `Tilemap/`（Tilemap.png 全集图集 + Tilemappadded.png 加边版）+ `Example.png` / `Example2.png`（成品参照图）
- 排除项：`RPGMakerMV/`、`RPGMakerVXAce/`（48px 重复导出格式）、`Preview.gif`、`CleanCityRPGMakerExample544x416.png`（重复参照）
- 原作者：GuttyKreum（MiniGame 美术资产库 AA-022 包；许可归属随源包，账面见 MiniGame 仓美术清单）
- 路径勘误史：源包曾名「Art Assets/City」，MiniGame U164 正名批后迁移至 AA-022 路径（ledger P-17 ①已修正）
- 工程内引用约定：tile PPU=16 / Point 过滤（P-17 施工参数）——由 `Assets/Editor/CitySkeletonBuilder.cs` 在导入器侧统一设定
