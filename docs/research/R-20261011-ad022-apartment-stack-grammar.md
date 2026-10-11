# R-20261011 AD-022 Apartment 模块栈组合规则细拆（真 demo 列语法实测·R2 建筑生成器直接输入）

- **触发**：explore#16 领走（r325·r324 轮尾补条）；消费链=R-20261011-ad022-truedemo-census.md §3 候选①。
- **口径**：场景 YAML 只读实测·零导入零下载零写 City3D（防双头 r236 定谳·交互窗在飞件未触）。证据源=`Assets/lowpoly/01_现代城市生活/AD-022_Scene场景_现代城市_CityPack/PolygonCity/Scenes/Demo.unity`（10.19MB）bld 族 829 件全量零抽样。
- **探针**：`.codely-cli/tmp/ad022_apt_stack_probe.py`（族普查+y 谱）+`…_probe2.py`（列聚类+楼簇并查集+样本装配）+`…_probe3.py`（变体隐含高度/台地族/侧挂件）+`…_probe4.py`（FE 排除修正——**FireEscape=逐层着陆件非模块顶标记，隐含高度必须排除 FE 再算**·_10/_12/_28/_34/_52 等误读修正案）；gitignored·只读。
- **扫描轮**：DevLoop r325（2026-10-11 20:0x）。
- **勘正指针（r326）**：§3「+1.5×22 列」→**18 真台地柱**（12 抬门+6 沉门）+4 mod-3.0 计数伪影；§7④ 台地源已闭合=**第三态「门面件变体自带台基」**（非地形台·非独立底座件）→R-20261011-ad022-terrace-source-probe.md（原文零删改）。

## 1. 拼装原子=竖列（column）

同 (x,z) 竖列=堆叠轴（239 列承载 bld 829 件）；列内自下而上槽位恒 3.0 节距。Apartment 件全为 root 直挂（r324「嵌套容器」属 Office 塔族非 Apartment——469 件零父容器）。

## 2. 槽位表（层高模数 3.0 全程恒定·实测 y 谱）

| 槽位 | 件族（数量） | 实测摆位 y | 规则 |
|---|---|---|---|
| 地面槽 | Apartment_Door（41）/Shop（59·混合使用商底）/Shop_Corner（25）/Door_Corner（5）/Station（9） | 门面三台阶变体：**平 0.0×29 / 抬 +1.5×11 / 沉 −1.5×6**（沉门=地下入口层） | 每柱恰 1 件；商底=混合使用 podium（店下楼上） |
| 楼层槽 A | **Apartment_Stack_NN 多层体**（75·一柱一件占多层） | 底 3.0（台地族 1.5） | **编号即高度族**：3F×65 变体（_04.._81 主流名单）/**2F×5（_06/_07/_13/_18/_72）/1F×1（_71）**/顶层无盖×4（_10/_15/_48/_61） |
| 楼层槽 B | Apartment_NN 单层体（68·逐层摆） | 3.0k（0 族）/4.5+3.0k（台地族） | 1F×52 主导；10 变体隐含 2F（缺层 gap 或 2F 变体——导入窗验） |
| 角柱 | Apartment_Corner_NN（110）+Roof_Corner（56） | 逐层 1F：0/3/6/9（台地族 1.5/4.5/7.5）；**可自 2 层起（×3 柱）** | 排端角塔=每层一件堆到顶+Roof_Corner 封 |
| 顶盖槽 | Apartment_Roof_NN（88）/Roof_Corner_NN | 顶层面 9.0/10.5/12.0（主导 67 件）/13.5/15.0 | 体柱顶=Roof·角柱顶=Roof_Corner |
| 屋顶附加 | Roof_Access_NN（21） | **顶面+0.5**（12.5×12 主导） | **零格点自由摆**（2.5 格仅 1/21）·不锁格 |
| 侧挂-消防梯 | FireEscape_NN（69） | 逐层着陆链 2.9/5.9/8.9≈层顶−0.1；3 段跨 6.0×6 列；单挂顶层 9.0×31；**地下 −6.0×7**（Office 塔停车口） | 随层链挂·不占槽位 |
| 街面楼梯 | Apartment_Stairs 系 26（Stairs14+Planter8+Corner4） | y=0·沿街面排布 1 件/5.0 格 | **Planter 伴生 8/21**·成对摆 |

## 3. 两台地族（base 偏移·内部节距不变）

**地面 0.0×192 列（主导）/+1.5×22 列**（x −35..25·z −40..85 连贯街区=抬升台地变体）——台地族全列（门/体/角/顶）整体 +1.5·3.0 节距不变；−1.5 沉门族 6 件（地下入口）。生成器接口=base ∈ {0, +1.5}，槽位公式 y = base + 3.0×slot。

## 4. 列模板 top（实测频次·拼装表正身）

- ×18 `Shop@0 > Stack@3(3F) > Roof@12`——**混合使用 4 层主型**（店底+3 层公寓）
- ×11 `Door@0 > Stack@3(3F) > Roof@12`——公寓门面 4 层
- ×10 `Corner@0 > Corner@3 > Corner@6 > Corner@9 > Roof_Corner@12`——角柱每层 1F 堆叠
- ×9 `Shop@0 > Stack@3 > FE 链 > Roof@12`（FE 侧挂混合型）·×5 `Door@1.5 > Apt@4.5 > Apt@7.5 > Roof@10.5`（台地 3 层型）·×4 `Door_Corner@1.5 > Corner@4.5/7.5 > Roof_Corner@10.5`
- 楼高谱：3-5 层（顶面 9.0/10.5/12.0/13.5/15.0）；**楼高=地面 1F+Σ楼层件+顶面**·3F Stack 一件抵三层

## 5. 横向语法（列→楼→街墙）

体柱 **5.0 间距成排**（实测街墙 block span 40×5/25×32=连排楼共享墙）·角柱居排端·楼簇 65（48 单柱=独栋 Shop/Station·余为 2-26 列楼/排）·Stairs 排沿前街面。Roof_Access 屋面自由摆=「活城感」细节位（承 census §2 细节自由摆定谳）。

## 6. R2 生成器直接输入（伪语法）

```
building(column @5.0 格·承 census 5.0 定标):
  base    = terrace ? 1.5 : 0.0
  ground  = pick{Shop(混合使用) | Door(stoop∈{0,+1.5,−1.5}) | Station} @ base
  floors  = pick{Stack(高度查变体表·3F 主导) | per-floor Apt_NN(1F)} @ base+3.0..(1..n)
  corners = 排端柱: Corner(1F) 逐层 @ base+3.0k（可 floor2 起）
  cap     = Roof | Roof_Corner @ base+3.0×(1+n)
  attach  = FE 逐层链(y_top−0.1·概率挂) | Stairs+Planter 排(沿街面)
  roof    = Roof_Access 自由位 @ cap+0.5（低概率）
```

## 7. 导入窗待验四项（YAML 只证摆位节距·不证枢点/几何）

①**pivot 约定**（底枢 vs 心枢——mesh 导入即验·摆位节距结论不受影响）②**Stack 变体高度表落库**（3F×65/2F×5/1F×1 名单已成·导灰盒即填）③Body 10 变体隐含 2F 判读（缺层 gap vs 2F 变体）④+1.5 台地源（地形台 vs 底座件——地形面探针另查）。

## 8. 消费与导出

消费面=City3D R2 街区扩展建筑生成器（三输入齐：5.0 格〔census〕+**3.0 层高模数+槽位表+变体高度族〔本件新增〕**+街具自由摆基准〔census §2·explore#17 待做〕）；queue/explore #17 街具对照=剩余一条真源细节面。
