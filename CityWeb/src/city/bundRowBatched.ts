import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { FLOW } from "../palette";
import { mulberry32, DEG } from "../util";

// ============================================================================
// Bund heritage row — wave6 lane B BatchedMesh 合批版（bundRow.ts 的渲染重组）。
//
// 审计背景：wave6 全城实测 2156 dc（居民层已由 lane A 合批 433→4），下一个
// offender = bundRow.ts 外滩排楼：183 个独立 Mesh（23 楼体 + 92 女儿墙条 +
// 46 拱门光 + 5 阁楼 + 5 金字塔尖 + 4 钟面盘 + 8 指针），其中 28 个投影体。
// 本文件把全部静态件烘顶点色后 merge 进 BatchedMesh；禁改 bundRow.ts（原
// 文件保持原样），导出与其逐字同形 —— main.ts 只换 import。
//
// 合批架构（合同 ≤3 批）：
//   楼体批   = 23 楼体 + 5 阁楼 + 5 金字塔尖（MeshBasic + 顶点色假光，
//              castShadow）→ 1 dc（影子通道另 1 dc，原版 28）
//   发光件批 = 92 女儿墙条 + 46 拱门（additive + 顶点色，单材质呼吸）→ 1 dc
//   钟面批   = 4 钟面盘（flat ivory Basic）→ 1 dc
//   指针     = 8 根独立小 Mesh（4 面 × 2 针，共享 1 handMat）→ 8 dc
// 模块 dc：183 → 11；含影子通道 211 → 12。
//
// 布局 / 随机流逐位一致（剪影逐位一致）：mulberry32(5321)，抽取序 =
// 23×w（20–28 m）+ 22×h（30–60 m），楼 #13（index 12）跳过 h 抽取固定
// 68 m；全部部件顶点 = 原版 T·R·S 复合逐件复刻。注意 spire 走
// scale(w·0.3,1,w·0.3) → rotateY(π/4) → translate 链：geometry.scale 经
// applyMatrix4 用逆转置法线（≡ 原版 object normalMatrix），与直建
// ConeGeometry(w·0.3, 18, 4) 的法线倾角不同 —— 保逐位一致必须走前者。
//
// 显式取舍（外观 vs 合批，对齐 residentsBatched 先例）：
//   1. 楼体 MeshStandard(roughness .88/metal .08) → MeshBasic + 顶点色假光
//      （LIGHT_DIR 固定方向近似，BODY_K=0.85 同先例）：失去昼夜太阳响应，
//      石色 0x3a3040 与剪影不变（夜景暗背景下亮度近原值，白昼偏暗）。
//   2. 女儿墙由普通透明 → additive：发光件批单材质的必然代价（blending
//      是材质级 uniform，两个发光件共享一材质）。夜景暗背景下 additive 与
//      原 alpha 混合近同值；顺带免去 138 个透明件的排序问题（可交换）。
//      拱门顶点色补 ×(0.45/0.35) 均值补偿，亮度均值与原版一致；代价 =
//      拱门随女儿墙呼吸同频 ±26% 脉动（原本恒定 0.45）。
//   3. 金字塔尖并入楼体批 → 尖顶开始投影（原版「薄顶不投影」house rule
//      让位 ≤3 批合同；2048² 影图覆盖 ~3000 m，每个尖影仅数 texel）。
//   4. 逐楼视锥剔除 → 整排单包围球（760 m 天际线背板典型整排在视锥内；
//      部分可见时原版 ~120 dc vs 本版恒 11，严格更优）。
//   5. 指针 8 件：任务括注「独立小 Mesh 2 件可接受」按每面 2 针理解；
//      4 面钟楼保剪影必须 8 针（4 面各自的表盘法线不同，矩阵旋转是指针
//      唯一忠实动画路径，不进静态批）。
//
// Module contract, wired verbatim by the coordinator:
//   export interface BundRowRig { root; update(dt, elapsed) }
//   export function buildBundRow(): BundRowRig
//
// Units: 1 unit = 1 m, real metric scale. Local origin = row centre at
// ground level (y = 0); the coordinator owns world placement and yaw.
// Determinism: mulberry32(5321) — identical silhouette on every reload.
// ============================================================================

export interface BundRowRig {
  root: THREE.Group;
  update: (dt: number, elapsed: number) => void;
}

// ---- row layout（与 bundRow.ts 逐字同源） ----------------------------------
const N = 23; // the real Bund reads as 23 historic masses from the river
const CLOCK_IDX = 12; // 0-based: facade #13 = 海关大楼 Customs House clock tower
const TOWERED = [2, 6, 9, 15, 19]; // tower-crowned facades (0-based)
const X0 = -380; // contracted row envelope, metres
const X1 = 380;
const STEP = (X1 - X0) / (N - 1); // 760/22 ≈ 34.5 m centres
const CLOCK_Y = 60; // dial band on the 68 m tower

// ---- 顶点色烘焙（常量与公式对齐 residentsBatched 先例） ---------------------
const TRAFFIC = FLOW.traffic; // media magenta（只读引用，绝不 mutate）
const STONE = new THREE.Color(0x3a3040); // contracted Bund stone
const BODY_K = 0.85; // 同先例 BODY_K：夜景可辨 / 白昼偏亮的折中
// 拱门原色 = traffic×1.25 且原 opacity 恒 0.45；合批后随呼吸均值 0.35 →
// 顶点色补 (0.45/0.35)，亮度均值与原版一致。
const ARCH_K = 1.25 * (0.45 / 0.35);
const LIGHT_DIR = new THREE.Vector3(0.5, 0.8, 0.35).normalize();

/** 假光照顶点色：亮面 = k·(0.62 + 0.38·max(0,N·L))，背光面 62% 保剪影。 */
function paintVertexColor(geo: THREE.BufferGeometry, color: THREE.Color, k: number, shade: boolean): void {
  const nrm = geo.attributes.normal;
  const count = geo.attributes.position.count;
  const arr = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    let f = k;
    if (shade) {
      const d = Math.max(0, nrm.getX(i) * LIGHT_DIR.x + nrm.getY(i) * LIGHT_DIR.y + nrm.getZ(i) * LIGHT_DIR.z);
      f = k * (0.62 + 0.38 * d);
    }
    arr[i * 3] = color.r * f;
    arr[i * 3 + 1] = color.g * f;
    arr[i * 3 + 2] = color.b * f;
  }
  geo.setAttribute("color", new THREE.BufferAttribute(arr, 3));
}

function boxPart(
  w: number, h: number, d: number, x: number, y: number, z: number,
  color: THREE.Color, k: number, shade: boolean,
): THREE.BufferGeometry {
  const g = new THREE.BoxGeometry(w, h, d);
  g.translate(x, y, z);
  paintVertexColor(g, color, k, shade);
  return g;
}

// ---- 共享几何模板（参数与原版逐字一致） ------------------------------------
// 拱门 Torus(4, 0.4, 8, 16, π)：XY 平面上半圆弧，天然垂直朝 +Z（零旋转）。
// 顶点色只烘一次（平移不改色），46 个 clone 各自 translate。
const ARCH_TEMPLATE = new THREE.TorusGeometry(4, 0.4, 8, 16, Math.PI);
paintVertexColor(ARCH_TEMPLATE, TRAFFIC.clone().multiplyScalar(ARCH_K), 1, false);
// 钟面盘 Cylinder(6, 6, 3, 4)，几何级 45° 旋转 → 轴对齐方盘（同原版）。
const PLATE_TEMPLATE = new THREE.CylinderGeometry(6, 6, 3, 4);
PLATE_TEMPLATE.rotateY(Math.PI / 4);
// 指针共享单位盒（同原版「shared Box + per-mesh scale」模式）。
const HAND_BOX = new THREE.BoxGeometry(1, 1, 1);

// ---- 材质预算：5 → 4（楼体 / 发光件 / 钟面 / 指针） --------------------------
const stoneBatchMat = new THREE.MeshBasicMaterial({ vertexColors: true });
const glowMat = new THREE.MeshBasicMaterial({
  vertexColors: true,
  transparent: true,
  opacity: 0.35, // 初值 = 呼吸均值；update() 每帧以原公式接管
  blending: THREE.AdditiveBlending,
  depthWrite: false, // additive 光带不写深度（原 archMat 同款判例）
});
const plateMat = new THREE.MeshBasicMaterial({ color: 0xf7f3e8 }); // floodlit ivory dial
const handMat = new THREE.MeshBasicMaterial({ color: 0x241d2b }); // dark hands

// 一根指针（活体件）：与原版同层级 face group → pivot(z=2.7) → bar(scale/pos)。
// update 旋转 pivot 的 local Z，指针绕表盘中心扫动。
function clockHand(face: THREE.Object3D, len: number, thick: number): THREE.Group {
  const pivot = new THREE.Group();
  pivot.position.z = 2.7; // proud of the plate's front surface (local z = 2.5)
  const bar = new THREE.Mesh(HAND_BOX, handMat);
  bar.scale.set(thick, len, 0.35);
  bar.position.y = len / 2;
  pivot.add(bar);
  face.add(pivot);
  return pivot;
}

// 静态合批：parts merge 成 1 几何 → BatchedMesh 1 实例 + identity 矩阵
// （排布已烘进顶点；静态批禁每帧矩阵重写）。容量按合并件实际计数精确
// 预留；几何数据已拷入批内缓冲 → 源几何即弃（realCity / residentsBatched
// 同惯例）。
function makeBatch(parts: THREE.BufferGeometry[], material: THREE.Material): THREE.BatchedMesh {
  const merged = mergeGeometries(parts, false) ?? parts[0];
  const vCount = merged.attributes.position.count;
  const iCount = merged.index !== null ? merged.index.count : vCount * 2;
  const batch = new THREE.BatchedMesh(1, vCount, iCount, material);
  const gid = batch.addGeometry(merged);
  const iid = batch.addInstance(gid);
  batch.setMatrixAt(iid, new THREE.Matrix4());
  batch.computeBoundingSphere(); // 静态实例：一次计算，此后复用
  merged.dispose();
  for (const g of parts) g.dispose();
  return batch;
}

export function buildBundRow(): BundRowRig {
  const root = new THREE.Group();
  root.name = "bundRowBatched";
  const rng = mulberry32(5321); // contracted seed → 同 seed 同消费序，剪影逐位一致

  const stoneParts: THREE.BufferGeometry[] = []; // 楼体批：body + attic + spire
  const glowParts: THREE.BufferGeometry[] = []; // 发光件批：女儿墙条 + 拱门
  const plateParts: THREE.BufferGeometry[] = []; // 钟面批：4 面盘
  const minutePivots: THREE.Group[] = [];
  const hourPivots: THREE.Group[] = [];

  for (let i = 0; i < N; i++) {
    const x = X0 + i * STEP;
    const w = 20 + rng() * 8; // contracted 20–28 m facade width
    // 楼 #13 固定 68 m 且跳过 h 抽取 → rng 流保持 23×w + 22×h 的简单序。
    const h = i === CLOCK_IDX ? 68 : 30 + rng() * 30;

    // --- 楼体：Box(w, h, 22) @ (x, h/2, 0) ≡ 原版 shared unit box × scale ---
    stoneParts.push(boxPart(w, h, 22, x, h / 2, 0, STONE, BODY_K, true));

    // --- 女儿墙光带：4 薄条封顶（±X 条超宽半条 → 角部恰好覆盖一次） ---
    for (const sz of [-1, 1]) {
      glowParts.push(boxPart(w + 0.5, 0.55, 0.5, x, h + 0.25, sz * 11, TRAFFIC, 1, false));
    }
    for (const sx of [-1, 1]) {
      glowParts.push(boxPart(0.5, 0.55, 21.5, x + (sx * w) / 2, h + 0.25, 0, TRAFFIC, 1, false));
    }

    // --- 街面拱廊：2 半圆光拱/楼 @ (x ± w·0.25, 6, 11.3)（+Z 河面） ---
    for (const off of [-(w * 0.25), w * 0.25]) {
      const arch = ARCH_TEMPLATE.clone();
      arch.translate(x + off, 6, 11.3); // 上半圆弧已垂直朝 +Z，零旋转
      glowParts.push(arch);
    }

    // --- 加冠楼：石阁楼 + 方锥尖（原版 T·R·S 复合逐件复刻） ---
    if (TOWERED.includes(i)) {
      stoneParts.push(boxPart(w * 0.4, 25, 16, x, h + 12.5, 0, STONE, BODY_K, true));
      const spire = new THREE.ConeGeometry(1, 18, 4); // ≡ 原版 shared unit cone
      spire.scale(w * 0.3, 1, w * 0.3); // 逆转置法线 = 原版 normalMatrix（见头部注释）
      spire.rotateY(Math.PI / 4); // 菱形 → 轴对齐方锥
      spire.translate(x, h + 25 + 9, 0);
      paintVertexColor(spire, STONE, BODY_K, true);
      stoneParts.push(spire);
    }

    // --- 海关大楼钟：4 面（盘进钟面批；指针留活体件） ---
    if (i === CLOCK_IDX) {
      const faces: Array<{ yaw: number; wx: number; wz: number }> = [
        { yaw: 0, wx: 0, wz: 11 }, // river front (+Z)
        { yaw: Math.PI / 2, wx: w / 2, wz: 0 }, // east (+X)
        { yaw: Math.PI, wx: 0, wz: -11 }, // land back (−Z)
        { yaw: -Math.PI / 2, wx: -(w / 2), wz: 0 }, // west (−X)
      ];
      for (const f of faces) {
        // 盘：clone（含几何级 45°）→ rotX(π/2) → z=1.0 → rotY(yaw) → 面位
        // = 原版 face group · plate mesh 复合的逐位复刻（0.5 m 嵌墙、
        // 2.5 m 出墙）。
        const plate = PLATE_TEMPLATE.clone();
        plate.rotateX(Math.PI / 2);
        plate.translate(0, 0, 1.0);
        plate.rotateY(f.yaw);
        plate.translate(x + f.wx, CLOCK_Y, f.wz);
        plateParts.push(plate);

        // 指针挂点：face group 仅 yaw（永不镜像）→ 同一 local 旋转，四面
        // 从外侧看皆顺时针。
        const face = new THREE.Group();
        face.position.set(x + f.wx, CLOCK_Y, f.wz);
        face.rotation.y = f.yaw;
        root.add(face);
        minutePivots.push(clockHand(face, 4.8, 0.45)); // 细长，近表盘边缘
        hourPivots.push(clockHand(face, 3.2, 0.6)); // 粗短，经典比例
      }
    }
  }

  // ---- 3 批装配（合同 ≤3：楼体批 / 发光件批 / 钟面批） ----
  const stoneBatch = makeBatch(stoneParts, stoneBatchMat);
  stoneBatch.castShadow = true; // 影子政策：结构石体批整体投影（含 5 尖顶，取舍 3）
  root.add(stoneBatch);

  const glowBatch = makeBatch(glowParts, glowMat);
  root.add(glowBatch);

  const plateBatch = makeBatch(plateParts, plateMat);
  root.add(plateBatch);

  const handMeshes = minutePivots.length + hourPivots.length; // 8 = 4 面 × 2 针

  const update = (_dt: number, elapsed: number): void => {
    // 女儿墙呼吸：原公式逐字保留（材质 opacity 路径，非矩阵；零逐件状态、
    // 零逐帧分配）。发光件批单材质 → 拱门随呼吸同频 ±26% 脉动（取舍 2）。
    const breath = 0.5 + 0.5 * Math.sin(elapsed * 1.3);
    glowMat.opacity = 0.26 + breath * 0.18;

    // 指针实时角：直算自 elapsed（不累计 → hitch/暂停不漂移）。分针
    // 6°/min = 0.1°/s；时针 0.5°/min = 0.0083°/s；负 local-Z 旋转 = 外视
    // 顺时针；elapsed = 0 时双针 12:00。
    const minuteAngle = -elapsed * 0.1 * DEG;
    const hourAngle = -elapsed * 0.0083 * DEG;
    for (const p of minutePivots) p.rotation.z = minuteAngle;
    for (const p of hourPivots) p.rotation.z = hourAngle;
  };

  // 审计钩子（lane A __CITY_RESIDENTS__ 同惯例）：QA 探针可读模块真值。
  (window as unknown as { __CITY_BUND__?: unknown }).__CITY_BUND__ = {
    batches: 3,
    handMeshes,
    sceneDrawCalls: 3 + handMeshes, // 11（影子通道另 +1）
    batchVerts: [
      stoneBatch.geometry.attributes.position.count,
      glowBatch.geometry.attributes.position.count,
      plateBatch.geometry.attributes.position.count,
    ],
  };

  return { root, update };
}
