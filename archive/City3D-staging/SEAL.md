# 旧城模型资产封存单（SEAL）

> 封存令：CEO 2026-11-26「还是走轻量化路线，以前的模型入库封存」。
> 封存时点：2026-11-26 12:5x（commit 见本目录 git blame）。解封唯一条件：CEO 明令（例：未来要接精细模型时走 FBX→GLB 转换接入 CityWeb）。

## 一、封存范围

| 层 | 位置 | 处置 |
|---|---|---|
| **账面（本目录）** | `archive/City3D-staging/`（git 归档·233 件） | 随城市仓永久入库；只读查阅，不再投入 |
| **模型本体（物理库）** | `D:\FluxGroup\gaming\MiniGame\projects\P3D_Spike\Assets\lowpoly`（4.09 GB·48 包 AD-001~AD-048） | **原地冻结**：零写入零删除（Unity 工程内不落任何封存标记文件）；库即此树，别处不复制 |
| 旧工程 City3D / City | 已删除（2026-11-26·git 历史可考古） | 终态 |

## 二、账面高价值件索引（未来重启时的第一批读件）

- `polygon48-item-catalog.tsv` — 48 包全件名账（~2.6 万条·AD|语义路径）——查件唯一入口
- `polygon48-inventory.tsv` — 48 包分类计数盘存
- `asset-usage-ledger.md` — 跨城用量账（哪些包用多少）
- `library-utilization-map.md` — 库利用率图（未用高价值面）
- `PHASE0-判据帧-过目板.jpg` / `R2-判据帧-过目板.jpg` — 旧城定谳判据帧存证
- 各 `*-report.md` / `citysim-*.md` — 装配/探针报告族（经验留档）

## 三、定谳：CityWeb 走轻量化路线

- 硅基城市 three.js 网面**定谳轻量化**：程序化几何 + InstancedMesh + 共享材质渲染（当前实况：单 draw call 级的城市体量、612KB 零依赖静态件、双击即开）。
- **不接入外部模型资产**（Synty FBX/GLB、云端生成模型均不入）；体积与加载预算优先于模型精细度。
- cph4 技能 `lowpoly-city-3d` 城市技能族与 `docs/lowpoly3d-*.md` 方案族 = 历史参考（资产账目与选型卡逻辑仍可复用），不再是 CityWeb 施工依据。

## 四、解封作业（若未来 CEO 令重启）

1. 读本目录高价值件索引 → 2. P3D_Spike 库按件名账选件 → 3. FBX→GLB（Blender 批处理）→ 4. CityWeb 加载层新增（three.js GLTFLoader + 资产台账接续用量账）→ 5. 体积预算闸：静态件总尺寸 ≤5MB（超出=必须分片或降模）。
