# blockDetails.ts — 波次 3 泳道 E 街区细节层 notes

## 契约（逐字）
```ts
export interface BlockDetailsRig {
  root: THREE.Group;
  update: (dt: number, elapsed: number) => void;
}
export function buildBlockDetails(plan: CityPlan): BlockDetailsRig
```

## 四类件（每城区，数量随 plan.districts 缩放）
- 行道树 90 棵：trunk `CylinderGeometry(0.35,0.5,4.2,6)` translate y+2.1 + crown `IcosahedronGeometry(2.2,0)`，两个 InstancedMesh；随机散布半径 95~310，scale 0.8~1.3（trunk/crown 同 s，冠心 4.2·s）。
- 街灯 60 盏：pole `CylinderGeometry(0.18,0.26,9,6)` translate y+4.5 + bulb `SphereGeometry(0.55,8,6)`；三环 112/178/244 各 20 盏，环间相位错开 1/3 间距；update 灯点全局慢呼吸 ±10%（9 s 周期，1±0.1·sin(2π·elapsed/9)）。
- 公交站亭 8 座：glass `Box(6,3,14)` MeshBasic FLOW.data(=0x5eead4) op 0.3 DoubleSide depthWrite:false + roof `Box(6.5,0.4,15)` 深灰（与灯杆共用 metal 材质）+ 站牌光柱 `Box(0.7,5,0.7)` FLOW.traffic(=品红 0xf472b6) Additive op 0.5 depthWrite:false；均布 r≈132，长轴贴环切向（yaw=-a），站牌柱在亭端 local(3.6, 5.9)。
- 数据长椅 24 条：`Box(4,0.9,1.4)` 0x233048，散布 98~305，长轴贴切向 ±0.3 rad 摆动。

## 批次与材质预算
- 8 个 InstancedMesh = 8 draw call（trunk/crown/pole/bulb/glass/roof/sign/bench 各一）。
- 材质 7 个（≤10）：trunk 0x2a2018 / crown 0x1c4a34 flatShading / metal 0x22262e（灯杆+顶板共用）/ bulb MeshBasic 0xffd9a0×1.3 / glass / sign / bench 0x233048。
- castShadow 仅 crown 与 shelter roof（房屋规则：小件不上影子贴图）；全部 frustumCulled=false（整批跨数百米，单包围球剔除会整批弹出）。

## 布点律（全部城区相对坐标，plan 无关：legacy 与 realCity 两套 CityPlan 均可用）
- 环街带 90~320 m；legacy 楼群止于中心 ~77 m、动脉走廊止于离中心 ~84 m，故 90 m 起步天然避让，无需运行时避让测试。
- mulberry32(6161) 每 build 播种一次 => 重载同域。

## 验证
- `npx tsc --noEmit`（CityWeb）零错，2026-11-26。
