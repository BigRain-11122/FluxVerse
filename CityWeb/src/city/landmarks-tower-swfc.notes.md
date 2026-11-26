# landmarks-tower-swfc.notes.md（陆家嘴地标精修 · 泳道 B）

## 接线契约（逐字）
- `import { buildShanghaiTower, buildSwfc, type LandmarkRig } from "./city/landmarks-tower-swfc";`
- `buildShanghaiTower(): LandmarkRig` / `buildSwfc(): LandmarkRig`
- 每帧 `rig.update(dt, clock.elapsedTime)`；`rig.root` 直接 `scene.add` 后自行平移/旋转放置。
- 本地原点在足迹中心、地面 y=0、面北=-Z；SWFC 开孔法线沿 ±Z（正对北/南向）。

## 关键尺寸
### 上海中心 buildShanghaiTower
- 总高 632m：18 段 × 35m = 630m 塔身 + 冠环（中心 y=630.5，管径 1.5 → 顶 632.0）。
- 底截面 84m（角到角）→ 顶部 45m；圆角三角 r(θ)=R(1+0.14·cos3θ)，72 边。
- 扭转：每段绕 y 递进 120°/18 ≈ 6.67°，顶段累计 ≈113°（整体约 120°）。
- 外皮 MeshStandardMaterial：0x14263f / opacity 0.55 / metalness 0.6 / DoubleSide / depthWrite:false；内核实体柱 r 26→14（直柱，不扭转）。
- 光缝 54 条（18 段 × 3，骑在三角角点上，随段旋转 → 螺旋光带），FLOW.brain×1.35；冠环 FLOW.data×1.5。
- update：冠环脉冲（1.7 rad/s，亮度+缩放）+ 光缝呼吸（0.9 rad/s）。

### 环球金融中心 buildSwfc
- 总高 492m（帽梁顶）；双腿 + 帽梁 + 一根斜撑（识别性斜杆：门洞底角 (15,437) → 顶角 (-11,485)）。
- 开孔：y 436→486 = 高 50m，底宽 30m → 顶宽 22m（下宽上窄梯形），孔洞由双腿凹口+帽梁自然成型。
- 收分：底 58×58 方形 → 顶 40×24 矩形（z 向线性收分，所有面保持平面）。
- 金色发光环 FLOW.capital×1.3：4 条带（孔底边、帽梁下、两侧斜边）贯穿建筑进深，双侧可视；塔尖白光点 y≈493.2。
- update：金环慢呼吸（0.55 rad/s）。

## 资源纪律
- 材质预算：上海中心 2×Standard + 2×Basic；SWFC 1×Standard + 2×Basic。
- castShadow 只开主体大件：ST 18 皮段+内核柱；SWFC 双腿+帽梁+斜撑。光缝/金环/冠环/白点均不投影。
- 几何全部为模块级常量（含 54 光缝 + 4 金环条共用的 UNIT_BOX）；**场景重建时请勿对本模块几何做 traverse dispose**，否则二次 build 会渲染空壳。
- 随机源：mulberry32(0x5f1e21)（ST 光缝宽度抖动）、mulberry32(0x3c2d9a)（SWFC 金环条厚度抖动）——固定种子，每次 reload 一致。
