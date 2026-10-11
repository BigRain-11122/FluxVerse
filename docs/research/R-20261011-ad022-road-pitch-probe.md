# R-20261011 AD-022 vendor demo 路件拼装步距实测（City3D R2 米制定标 AD 侧常数落位）

> **勘误指针（r324）**：本件证据面 CityAssembled.unity=我方 R0 装配场景**非 vendor demo**——本件结论修订表见 R-20261011-ad022-truedemo-census.md §0（Road 零在场/junction 密网两项作废·5.0 常数以真源存活·原文零删改）。

- **触发**：explore#14 领走（r322）；同时刷新 explore#12 P3 48h 节律死线（末笔 r321 → 本件 r322 成件=新末笔·下次死线 10-13 18:4x 前）。
- **口径**：场景 YAML 只读实测·零导入零下载零写 City3D（防双头 r236 定谳合规·交互窗在飞件未触）；证据=City3D/Assets/Scenes/CityAssembled.unity（AD-022 vendor demo 整场景·official-baseline.md 在案件·root_objects=4329）prefab instance 修改面全量解析。
- **探针**：`.codely-cli/tmp/ad022_pitch_probe.py`（只读解析器·gitignored·m_Name/m_LocalPosition/m_LocalRotation/m_LocalScale 四通道）。
- **扫描轮**：DevLoop r322（2026-10-11 18:3x）。

## 1. 实测数据（77/77 路族件全量·零抽样）

| 面 | 实测值 |
|---|---|
| 路族件总数 | **77**（全落单容器 Transform 1921515008=恒等变换〔pos 0/rot identity/scale 1〕→ **本地坐标=世界坐标**） |
| **步距（pitch）** | **5.0 世界单位/格**——x 线 11 条（-25..25）相邻差全=5.0（10/10 缺口）·z 线 10 条（-20..25）相邻差全=5.0（9/9 缺口）·全部坐标=5 的整数倍·零非 5 倍数落位 |
| 网格幅面 | 11×10 线阵（50×45 单位 patch） |
| 件型谱 | Junction_01 ×53（68.8%）/T_01 ×15/Corner_01 ×6/Straight_01 ×3——**junction 主导密网**（直道仅 3 件） |
| 旋转 | 正交四向硬约束：quaternion y ∈ {0/-0〔恒等·57〕·±0.7071〔±90°·14〕·1.0〔180°·6〕}——零自由角度 |
| 垂直 | 77/77 全件 y=0 平铺单层·零堆叠语法 |
| 缩放 | 77/77 无 m_LocalScale 修改=默认 1（件即原尺寸·零运行时缩放） |
| Road 族 | SM_Env_Road_{01~03…} **demo 场景零在场**（rg 实测 0 命中）——vendor demo 路网=Path 族独任 |

## 2. 语义定谳（AD 侧拼装语法）

- AD-022 demo 拼装=**5 单位整数格·角对齐·正交四向·单层平铺**——与 Kenney 官方 1 单位格语法（R-20261011-kenney-citykit-assembly-syntax.md §1）**同构**（整数格+90° 正交+单层·仅格常数不同）。
- **米制定标 AD 侧常数=5.0**：Kenney 1 格 ↔ AD 1 格 ⇒ 混拼对齐单常数=导入 scale 5（Kenney 件 ×5 落 AD 格）·场景侧反向 0.2——**§4 判据②（米制定标闸）的 AD 侧前置数据就此落位**。
- junction 密网启示：AD demo 不以直道铺长线（直道仅 3 件）而以 junction 节点件织网——R2 街区扩展若仿 AD 语法，路网生成器词汇应以节点件为主体（与 Kenney 官方 sample 的 straight 铺线法相异·**两语法样本并档供生成器选型**）。

## 3. 消费与导出

- 消费面=City3D R2 街区扩展米制定标（R-20261011-kenney-citykit-assembly-syntax.md §4 判据②·本件=其前置数据件）+街路生成器词汇选型（后续件）；
- **件缘对齐待 mesh 实测**：5.0=件中心距常数（YAML 可测面止于此）·件本体面宽（路缘对路缘零错位判读）=导入窗 mesh 资产复核位；
- 后续件=AD-022 建筑族步距实测（SM_Bld_Apartment 分件 pitch——Path 5.0 的建筑侧对齐验证·queue/explore #15·同口径只读）。
