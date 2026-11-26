import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import type { CityPlan } from "./layout";
import { FLOW, ZONE_FLOW } from "../palette";

// 硅基枢纽馆 · BatchedMesh 合批版（wave6 性能泳道 D · 2026-11-26）。
//
// 审计背景：全城 2156 dc，hubs 馆群（enterable.ts · 3 馆，每馆 19 个独立
// Mesh：玻璃壳板×6 / 基座+夹层板×4 / 灯条×6 / 光柱 / 塔尖 / 信标）是
// pos0 根下的 offender 之一。本模块是 enterable.ts 的合批版——
// EnterableSpec / EnterableRig 契约逐字同形（main.ts 只换 import），落位 /
// 朝向 / 门缝 20m / 呼吸相位节奏逐行照抄原版数学，仅渲染组织不同。
//
// 合批架构（57 独立 Mesh → 4 dc，合同预算 ≤6）：
//   · 壳批 = 透明批（单独 1 批）：玻璃壳板 + 门框（背板 / 侧板×2 / 门框×2 /
//     顶板）烘焙顶点色 0x1a2c46 → merge 成 1 个馆局部几何 → BatchedMesh
//     1 几何 ×每馆 1 实例。材质保留 MeshStandardMaterial transparent
//     （opacity 0.35 / metalness 0.4 / roughness 0.35 / depthWrite false /
//     renderOrder 1 语义原样）——透明件不与不透明件同批。
//   · 板批：基座 + 3 夹层板 + 塔尖（原 deckMat 件全家）烘焙顶点色
//     0x101a2b → merge → BatchedMesh 1 几何 ×3 实例。
//   · 光批：灯条（每馆 6 条 merge 成 1 件）+ 信标 → 不透明 MeshBasic
//     BatchedMesh ×6 实例，颜色全在 setColorAt 实例色。
//   · 柱批：光柱是 AdditiveBlending 透明件——加法混合与不透明光件无法
//     共享材质同批（引擎硬约束），单独 1 批 ×3 实例。
//   呼吸统一走 setColorAt 实例色（BatchedMesh 官方每帧路径：写
//   colorsTexture + needsUpdate；实例矩阵静态写死，禁每帧重写矩阵）。
//
// 显式取舍（外观 vs 合批）：
//   1. 光柱 ±5% 半径脉动 / 信标 0.7–1.3 缩放呼吸原走 mesh.scale（每帧矩阵
//     重写）。本版按合同「呼吸走材质 color」折进实例色亮度：频率 / 相位 /
//     振幅逐项保留，机制由尺寸改为亮度。光柱透明度脉动 0.55±0.1 在
//     AdditiveBlending 下与实例色缩放数学等价（加法贡献 = rgb×a），折算
//     无损。
//   2. 玻璃壳 6 板原为独立透明件（three 按深度逐件排序）；合批后同馆 6 板
//     按几何序渲染，板间重叠处的混合次序差 <1% 亮度，街景不可辨。柱批
//     renderOrder 2 仍在壳批 renderOrder 1 之后（原绘制序保留）。
//   3. 原版阴影标志逐件：基座仅 receiveShadow、夹层板 cast+receive、塔尖
//     仅 cast。批级标志整批一致，取并集 cast+receive：增量 = 贴地基座也
//     投影（影子落在自身正下方，不可见）+ 塔尖也受投影（无物体投其上，
//     无变化）。
//   4. specs / 落位 / 朝向 / 门缝：HUB_OFFSET=340 与同 offset 候选扫掠、
//     yaw 卡轴 snap、swapAxes 半轴互换、DOOR_W=20 逐字照抄——可进性是
//     CEO 令红线，WalkController / hubLife 消费同一 specs 契约，切
//     import 后传送 / 免壳判定 / 门缝零漂移。

export interface EnterableSpec {
  cx: number; cz: number;   // world center
  hw: number; hd: number;   // half extents (walkable interior bounds)
}

export interface EnterableRig {
  root: THREE.Group;
  specs: EnterableSpec[];
  update: (dt: number, elapsed: number) => void;
}

// ---- pavilion proportions: glass hall 60 x 40 x 28 m（与 enterable.ts 逐字同源）----
const SHELL_W = 60;           // local X span
const SHELL_D = 40;           // local Z span, front face at +Z
const SHELL_H = 28;           // wall height
const WALL_T = 0.7;           // shell panel thickness
const DOOR_W = 20;            // front middle gap - the "people can enter" door（CEO 红线，禁改）
const FLOOR_Y = [6, 14, 22];  // interior mezzanine slabs (visual levels)
const HUB_OFFSET = 340;       // district center -> island direction (m), CEO spec

// "open spot" sweep along the island axis: the literal 340m first, the
// neighbours only when a plan building blocks it. The real-geography plan
// carries an empty buildings list, so 340 wins there immediately.
const OFFSET_CANDIDATES = [340, 352, 326, 364, 312, 376, 300, 388];

// walkable interior half extents (inside the WALL_T shell)
const INT_HW = SHELL_W / 2 - WALL_T;
const INT_HD = SHELL_D / 2 - WALL_T;

// ---- shared geometry module constants: one per shape, reused by all hubs ----
const SLAB_GEO = new THREE.BoxGeometry(56, 0.8, 36);      // interior floor slabs
const STRIP_GEO = new THREE.BoxGeometry(50, 0.3, 1.2);    // warm edge light strips
const COLUMN_GEO = new THREE.CylinderGeometry(3, 3, 26);  // elevator light column
const BACK_GEO = new THREE.BoxGeometry(SHELL_W, SHELL_H, WALL_T);
const SIDE_GEO = new THREE.BoxGeometry(WALL_T, SHELL_H, SHELL_D);
const FRONT_GEO = new THREE.BoxGeometry((SHELL_W - DOOR_W) / 2, SHELL_H, WALL_T);
const DECK_GEO = new THREE.BoxGeometry(SHELL_W, WALL_T, SHELL_D); // roof + base share the shape
const SPIRE_GEO = new THREE.CylinderGeometry(0.32, 0.5, 4);
const BEACON_GEO = new THREE.SphereGeometry(1.5, 16, 12);

// ---- 材质基准色（数值与 enterable.ts 逐字同源；静态件外观色烘进顶点色）----
const SHELL_C = new THREE.Color(0x1a2c46);                          // 玻璃壳
const DECK_C = new THREE.Color(0x101a2b);                           // 基座/夹层/塔尖
const STRIP_BASE = new THREE.Color(0xffd9a0).multiplyScalar(1.2);   // above bloom threshold
const COLUMN_BASE = FLOW.data.clone().multiplyScalar(1.6);          // data-cyan overbright
const beaconBaseOf = (districtId: string): THREE.Color =>
  (ZONE_FLOW[districtId] ?? FLOW.data).clone().multiplyScalar(1.5);

/** Island-side direction of a district, read off its artery: both plan
 *  builders (city/layout.ts and geo/realCity.ts) emit arteries whose
 *  (x0, z0) end sits at the island, so the artery is the plan's own island
 *  pointer - no hard-coded island coordinates in this module.（逐字同源） */
function islandDirOf(plan: CityPlan, districtId: string, cx: number, cz: number): { x: number; z: number } {
  const ar = plan.arteries.find((a) => a.district === districtId);
  // no artery (never happens with the current builders): fall back to the
  // world origin, where the legacy layout parks the brain island
  const dx = ar ? ar.x0 - cx : -cx;
  const dz = ar ? ar.z0 - cz : -cz;
  const len = Math.hypot(dx, dz);
  if (len < 1e-6) return { x: 1, z: 0 };
  return { x: dx / len, z: dz / len };
}

/** True when the hub footprint (outer shell + 8m clearance) hits a plan
 *  building - the "open spot" test for the offset sweep.（逐字同源） */
function blockedByBuilding(plan: CityPlan, x: number, z: number): boolean {
  for (const b of plan.buildings) {
    if (Math.abs(x - b.x) < SHELL_W / 2 + 8 + b.w / 2 &&
        Math.abs(z - b.z) < SHELL_D / 2 + 8 + b.d / 2) return true;
  }
  return false;
}

// ---- 顶点色烘焙（静态件：壳板 / 楼板 / 门框）----
// MeshStandardMaterial 的 diffuse = material.color × vertexColor：外观色写进
// 顶点色、材质基色置白 → 合批后 albedo 与原版逐位相同。
function bakeVertexColor(geo: THREE.BufferGeometry, color: THREE.Color): void {
  const count = geo.attributes.position.count;
  const arr = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    arr[i * 3] = color.r;
    arr[i * 3 + 1] = color.g;
    arr[i * 3 + 2] = color.b;
  }
  geo.setAttribute("color", new THREE.BufferAttribute(arr, 3));
}

/** 克隆共享几何并平移到馆局部位置（可选烘焙顶点色；不烘 = 颜色走实例色）。 */
function place(
  base: THREE.BufferGeometry, x: number, y: number, z: number, color?: THREE.Color,
): THREE.BufferGeometry {
  const g = base.clone();
  g.translate(x, y, z);
  if (color) bakeVertexColor(g, color);
  return g;
}

/** merge 收窄：属性集一致的合并不失败，parts[0] 仅作类型兜底（实际不可达）。 */
const mergeParts = (parts: THREE.BufferGeometry[]): THREE.BufferGeometry =>
  mergeGeometries(parts, false) ?? parts[0];

export function buildEnterableHubs(plan: CityPlan): EnterableRig {
  const root = new THREE.Group();
  const specs: EnterableSpec[] = [];

  if (!plan.districts.length) {
    // 禁装饰律：无城区 = 空 rig 但接口完整（residentsBatched 同语义）
    return { root, specs, update: () => {} };
  }

  // ---- 馆局部几何（各馆完全相同 → 1 份几何 + 每馆 1 实例）----
  // 壳批几何：玻璃壳六面。前立面按 DOOR_W 分成左右两扇门框，门缝 20m =
  // 两框之间的空档——与原版 addGlass 六件逐位同位（含门缝，可进性红线）。
  const glassGeo = mergeParts([
    place(BACK_GEO, 0, SHELL_H / 2, -(SHELL_D / 2 - WALL_T / 2), SHELL_C),
    place(SIDE_GEO, -(SHELL_W / 2 - WALL_T / 2), SHELL_H / 2, 0, SHELL_C),
    place(SIDE_GEO, SHELL_W / 2 - WALL_T / 2, SHELL_H / 2, 0, SHELL_C),
    place(FRONT_GEO, -((SHELL_W - DOOR_W) / 2), SHELL_H / 2, SHELL_D / 2 - WALL_T / 2, SHELL_C),
    place(FRONT_GEO, (SHELL_W - DOOR_W) / 2, SHELL_H / 2, SHELL_D / 2 - WALL_T / 2, SHELL_C),
    place(DECK_GEO, 0, SHELL_H - WALL_T / 2, 0, SHELL_C), // roof
  ]);

  // 板批几何：基座（顶面高出地面 6cm，杀地面 z-fighting）+ 三层夹层 + 塔尖
  const deckGeo = mergeParts([
    place(DECK_GEO, 0, 0.06 - WALL_T / 2, 0, DECK_C),
    ...FLOOR_Y.map((fy) => place(SLAB_GEO, 0, fy, 0, DECK_C)),
    place(SPIRE_GEO, 0, SHELL_H + 2, 0, DECK_C),
  ]);

  // 光批几何：每馆 6 根灯条（藏夹层边缘下 0.75m）merge 成 1 件 + 信标 1 件。
  // 不烘顶点色——外观色与呼吸全走 setColorAt 实例色。
  const stripParts: THREE.BufferGeometry[] = [];
  for (const fy of FLOOR_Y) {
    for (const sz of [-1, 1]) {
      stripParts.push(place(STRIP_GEO, 0, fy - 0.75, sz * (SHELL_D / 2 - 3)));
    }
  }
  const stripsGeo = mergeParts(stripParts);
  const beaconGeo = place(BEACON_GEO, 0, SHELL_H + 3.5, 0);
  const columnGeo = place(COLUMN_GEO, 0, 13, 0);

  // ---- 落位 / 朝向 / specs：逐字照抄 enterable.ts（含 340 候选扫掠）----
  interface Placement {
    matrix: THREE.Matrix4;   // 馆变换（平移 + 卡轴朝向），静态写死
    phase: number;           // hubIndex * 2.1（原呼吸相位）
    beaconBase: THREE.Color; // 信标区色 ×1.5（原 beaconMat 色）
  }
  const placements: Placement[] = [];

  plan.districts.forEach((d, hubIndex) => {
    const dir = islandDirOf(plan, d.id, d.cx, d.cz);

    // ---- placement: 340m from the district center toward the island ----
    let px = d.cx + dir.x * HUB_OFFSET;
    let pz = d.cz + dir.z * HUB_OFFSET;
    for (const off of OFFSET_CANDIDATES) {
      const tx = d.cx + dir.x * off;
      const tz = d.cz + dir.z * off;
      if (!blockedByBuilding(plan, tx, tz)) { px = tx; pz = tz; break; }
    }

    // face the island, snapped to a cardinal axis: specs and walk colliders
    // are axis-aligned AABBs, an arbitrary yaw would break that contract -
    // snapping keeps the door island-facing AND the interior bounds exact
    const yawRaw = Math.atan2(dir.x, dir.z); // local +Z -> island direction
    const snap = Math.round(yawRaw / (Math.PI / 2)) * (Math.PI / 2);
    const swapAxes = Math.abs(Math.sin(snap)) > 0.5;

    placements.push({
      matrix: new THREE.Matrix4().makeRotationY(snap).setPosition(px, 0, pz),
      phase: hubIndex * 2.1,
      beaconBase: beaconBaseOf(d.id),
    });

    specs.push({
      cx: px,
      cz: pz,
      hw: swapAxes ? INT_HD : INT_HW,
      hd: swapAxes ? INT_HW : INT_HD,
    });
  });

  const nHubs = placements.length;

  // ---- 壳批（透明批 · 单独 1 批）----
  // 一个玻璃壳材质共享全部馆（原版语义）：透明壳不写深度，否则会把加法
  // 光柱打出洞；不投影——透明壳投不透明影子会黑掉整个可行走内景。
  const shellMat = new THREE.MeshStandardMaterial({
    color: 0xffffff, // 外观色 0x1a2c46 已烘进顶点色
    opacity: 0.35,
    transparent: true,
    metalness: 0.4,
    roughness: 0.35,
    depthWrite: false,
    vertexColors: true,
  });
  const shellBatch = new THREE.BatchedMesh(
    nHubs, glassGeo.attributes.position.count, glassGeo.index!.count, shellMat);
  const glassGid = shellBatch.addGeometry(glassGeo);
  shellBatch.renderOrder = 1; // glass first, additive light column after (order 2)
  for (const p of placements) {
    shellBatch.setMatrixAt(shellBatch.addInstance(glassGid), p.matrix);
  }
  shellBatch.computeBoundingSphere(); // 静态实例：一次计算，此后复用
  root.add(shellBatch);

  // ---- 板批：基座 + 夹层 + 塔尖（castShadow+receiveShadow 并集，取舍 3）----
  const deckMat = new THREE.MeshStandardMaterial({
    color: 0xffffff, // 外观色 0x101a2b 已烘进顶点色
    roughness: 0.85,
    metalness: 0.25,
    vertexColors: true,
  });
  const deckBatch = new THREE.BatchedMesh(
    nHubs, deckGeo.attributes.position.count, deckGeo.index!.count, deckMat);
  const deckGid = deckBatch.addGeometry(deckGeo);
  deckBatch.castShadow = true;
  deckBatch.receiveShadow = true;
  for (const p of placements) {
    deckBatch.setMatrixAt(deckBatch.addInstance(deckGid), p.matrix);
  }
  deckBatch.computeBoundingSphere();
  root.add(deckBatch);

  // ---- 光批（灯条 + 信标）：不透明 MeshBasic，颜色全在实例色 ----
  // maxIndexCount 必须显式传：灯条+球索引和 > 顶点×2 的默认预算。
  const lightMat = new THREE.MeshBasicMaterial();
  const lightBatch = new THREE.BatchedMesh(
    nHubs * 2,
    stripsGeo.attributes.position.count + beaconGeo.attributes.position.count,
    stripsGeo.index!.count + beaconGeo.index!.count,
    lightMat);
  const stripsGid = lightBatch.addGeometry(stripsGeo);
  const beaconGid = lightBatch.addGeometry(beaconGeo);

  // ---- 柱批（单独 1 批）：AdditiveBlending 透明件不能与不透明光件同批 ----
  const columnMat = new THREE.MeshBasicMaterial({
    color: COLUMN_BASE,
    transparent: true,
    opacity: 0.55,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const columnBatch = new THREE.BatchedMesh(
    nHubs, columnGeo.attributes.position.count, columnGeo.index!.count, columnMat);
  const columnGid = columnBatch.addGeometry(columnGeo);
  columnBatch.renderOrder = 2;
  root.add(columnBatch);

  // ---- 实例装配：每馆 灯条×1 / 信标×1 / 光柱×1（初色即原版静态基线）----
  const stripIids: number[] = [];
  const beaconIids: number[] = [];
  const columnIids: number[] = [];
  const white = new THREE.Color();
  placements.forEach((p) => {
    const si = lightBatch.addInstance(stripsGid);
    lightBatch.setMatrixAt(si, p.matrix);
    lightBatch.setColorAt(si, STRIP_BASE); // 初值，update 每帧覆写
    stripIids.push(si);

    const bi = lightBatch.addInstance(beaconGid);
    lightBatch.setMatrixAt(bi, p.matrix);
    lightBatch.setColorAt(bi, p.beaconBase);
    beaconIids.push(bi);

    const ci = columnBatch.addInstance(columnGid);
    columnBatch.setMatrixAt(ci, p.matrix);
    columnBatch.setColorAt(ci, white); // 白 = 材质色 ×0.55 原静态基线
    columnIids.push(ci);
  });
  lightBatch.computeBoundingSphere();
  columnBatch.computeBoundingSphere();
  root.add(lightBatch);

  // 源几何数据已拷入批内缓冲，即弃（residentsBatched 同惯例）
  glassGeo.dispose();
  deckGeo.dispose();
  stripsGeo.dispose();
  beaconGeo.dispose();
  columnGeo.dispose();

  const batches = [shellBatch, deckBatch, lightBatch, columnBatch];
  (window as unknown as { __CITY_ENTERABLE__?: unknown }).__CITY_ENTERABLE__ = {
    hubs: nHubs, batches: batches.length, drawCalls: batches.length,
  };

  const _c = new THREE.Color();
  const update = (dt: number, elapsed: number): void => {
    void dt; // breathing is wall-clock driven (elapsed); dt stays in the contract
    for (let i = 0; i < nHubs; i++) {
      const phase = placements[i].phase;
      // warm strips breathe around their base color（频率 1.6 / 相位 phase——原节奏）
      _c.copy(STRIP_BASE).multiplyScalar(1.15 + 0.25 * Math.sin(elapsed * 1.6 + phase));
      lightBatch.setColorAt(stripIids[i], _c);
      // light column micro pulse: opacity + radius, never a full blink
      // （频率 1.1/1.3、相位 ×0.7/×1——原节奏；Additive 下 rgb×a 等价 → 折
      //   进实例色，±5% 半径脉动按合同同折亮度）
      const op = 0.55 + 0.1 * Math.sin(elapsed * 1.1 + phase * 0.7);
      const cr = 1 + 0.05 * Math.sin(elapsed * 1.3 + phase);
      _c.setScalar((op / 0.55) * cr);
      columnBatch.setColorAt(columnIids[i], _c);
      // crown beacon slow breathing（频率 1.7 / 相位 ×1.3——原节奏；缩放呼吸
      // 按合同折进实例色亮度）
      _c.copy(placements[i].beaconBase)
        .multiplyScalar(1 + 0.3 * (0.5 + 0.5 * Math.sin(elapsed * 1.7 + phase * 1.3)));
      lightBatch.setColorAt(beaconIids[i], _c);
    }
  };

  return { root, specs, update };
}
