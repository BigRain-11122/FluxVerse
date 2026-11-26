import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { mulberry32 } from "../util";
import type { CityData, ResidentEntry, EchoEntry } from "../types";
import type { CityPlan } from "./layout";

// 挂牌居民层 v2-batched（wave6 性能泳道 A · 2026-11-26）。
//
// 审计背景：全城 2944 dc / 614k tri，主 offender = residents.ts 人形模块
// 433 个独立 Mesh（32 居民 × 多部件 + 材质缓存）。本模块是 residents.ts 的
// BatchedMesh 合批版——数据源 / 六 hex 派生算法 / 布局 / 朝向 / 名牌语义
// 与原版逐行同源，仅渲染组织不同（性能卡 #2/#3 条款：同批同材质 1 dc）。
//
// 合批架构：
//   · 每居民全部部件（腿/鞋/躯干/臂/头/发/眼/徽章/配件）烘焙顶点色
//     （six-hex 派生色 + 假光照明暗），mergeGeometries 合并成 1 个几何件；
//   · addGeometry(合并件) + addInstance → 每居民 1 实例，setMatrixAt 一次性
//     写死位置/朝向（静态批：禁每帧重写矩阵）；
//   · 32 居民按 8/批切 4 个 BatchedMesh（合同 ≤4），共享 1 个材质
//     → 人形层 draw call 433 → 4。
//
// 显式取舍（外观 vs 合批）：
//   1. 原版逐部件 emissive = 本色 × 0.32（夜景自发光，residents.ts 实锚）
//     无法进单材质批（Lambert emissive 是材质级 uniform）。合批版改用
//     MeshBasicMaterial + 烘焙顶点色（≈ 100% 自发光，是原版要修的「夜景
//     人形融进背景」问题的强化解），并在顶点色里烘焙固定方向假光照保
//     体积感；眼/徽章 overbright ×1.8 保 L2 特征点。代价：白昼无光照
//     响应（剪影/衣色/徽章色三识别要素保留——规格正典剪影优先律）。
//   2. 原版 per-figure ±0.012 呼吸位移 = 每帧重写矩阵；静态批禁 per-frame
//     矩阵 → 呼吸位移取消（合同条款 6 允许无动画），观察流弧线明暗脉动
//     保留（材质 opacity，非矩阵路径）。
//   3. 名牌 Sprite 32 个不进批（合同条款 4：setLabels 同语义控制显隐）；
//     观察流弧线 24 条保持 Line（不在 433 审计口径内，保外观保真）。

const ZONE_OF_DISTRICT: Record<string, string> = {
  GM: "gaming", MD: "gaming", QT: "quant", OR: "quant",
  NS: "media", RV: "media", anchors: "media",
};
const ZONE_COLOR: Record<string, number> = {
  gaming: 0xff8c5c, quant: 0x4c9aff, media: 0x9d7bff, meta: 0xffd166,
};

export interface ResidentsBatchedAnchor {
  id: string;
  name: string;
  profession: string;
  ring: string;
  pos: THREE.Vector3;
}

export interface ResidentsBatchedRig {
  root: THREE.Group;
  anchors: ResidentsBatchedAnchor[];
  setLabels(visible: boolean): void;
  update: (dt: number, elapsed: number) => void;
}

/// 确定性哈希（与 residents.ts 同源）：同一 cid 永远得到同一组微差参数。
function h32(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
const pick = (n: number, mod: number) => n % mod;

/** 卡面 hex → number；空/非法时用 fallback（保证不出现黑块）。 */
function hexOf(s: string | undefined, fallback: number): number {
  if (!s) return fallback;
  const v = parseInt(s.replace("#", ""), 16);
  return Number.isFinite(v) ? v : fallback;
}

/** 按年龄带定头身比 → 身高（米）。儿童 3.5–4 头身，成人 4.5–5.5 头身。 */
function heightFor(age: number, female: boolean): number {
  const head = 0.26;
  let ratio: number;
  if (age < 12) ratio = 3.6;
  else if (age < 18) ratio = 4.4;
  else if (age < 41) ratio = 5.2;
  else if (age < 56) ratio = 5.0;
  else if (age < 70) ratio = 4.8;
  else ratio = 4.6;
  const base = head * ratio;
  return base * (female ? 0.97 : 1.0);
}

// ---- 顶点色烘焙 ----
// 合同「instanceColor 或 setColorAt」条款说明：本实现每居民 1 实例（合同
// 目标），instance 颜色是实例级 uniform——无法表达一具身体里的六个换装位
// 颜色。six-hex 派生色因此落在**顶点色**（逐部件逐顶点），语义等价：
// 体色仍严格来自卡面，禁随机脸律不变。
const BODY_K = 0.85;   // 体色基准亮度（Basic 自发光，夜景可辨）
const GLOW_K = 1.8;    // 眼/徽章 overbright（伪发光特征点）
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

function spherePart(
  radius: number, x: number, y: number, z: number,
  color: THREE.Color, k: number, shade: boolean,
): THREE.BufferGeometry {
  const g = new THREE.SphereGeometry(radius, 8, 6);
  g.translate(x, y, z);
  paintVertexColor(g, color, k, shade);
  return g;
}

const C = (hex: number, k: number): THREE.Color => new THREE.Color(hex).multiplyScalar(k);

/** 造一个人的合并几何（与 residents.ts buildFigure 同源数学），返回 [几何, 总高]。 */
function buildFigureGeometry(r: ResidentEntry): { geo: THREE.BufferGeometry; h: number } {
  const parts: THREE.BufferGeometry[] = [];
  const n = h32(r.id);
  const age = Number(r.age ?? 30);
  const female = r.gender === "女";
  const child = age < 12;

  const h0 = heightFor(age, female) * (0.96 + (pick(n, 9) / 100));
  const build = pick(n >> 10, 3); // 0 瘦 / 1 中 / 2 壮（第 6 维体型）
  const bodyK = build === 0 ? 0.90 : build === 2 ? 1.12 : 1.0;
  const shoulder = (female ? 0.86 : 1.0) * (0.92 + (pick(n >> 3, 17) / 100)) * bodyK;

  const skin = hexOf(r.skin_c, 0xd9b18a);
  const hair = hexOf(r.hair_c, 0x2b2b30);
  const cloth = hexOf(r.cloth_c, 0x4a6b8a);
  const pant = hexOf(r.pant_c, 0x3a3440);
  const badge = hexOf(r.badge_c, 0x4ade80);
  const eye = hexOf(r.eye_c, 0xffd27a);

  const headH = 0.26, headW = 0.24 * (child ? 1.12 : 1.0);
  const torsoH = h0 * (child ? 0.30 : 0.28);
  const legH = h0 * (child ? 0.30 : 0.42);
  const armH = torsoH * 0.86;

  // 腿 + 鞋
  const legW = 0.12 * (female ? 0.92 : 1.0);
  for (const sx of [-1, 1]) {
    parts.push(boxPart(legW, legH, 0.14, sx * (legW * 0.62), legH / 2, 0, C(pant, 1), BODY_K, true));
    parts.push(boxPart(legW * 1.08, 0.07, 0.19, sx * (legW * 0.62), 0.035, 0.02, C(0x25272e, 1), BODY_K, true));
  }

  // 躯干
  parts.push(boxPart(0.34 * shoulder, torsoH, 0.20 * bodyK, 0, legH + torsoH / 2, 0, C(cloth, 1), BODY_K, true));

  // 臂
  for (const sx of [-1, 1]) {
    parts.push(boxPart(0.085, armH, 0.10, sx * (0.17 * shoulder + 0.045), legH + torsoH - armH / 2 + 0.02, 0, C(cloth, 1), BODY_K, true));
  }

  // 头
  const neck = 0.04;
  const headY = legH + torsoH + neck + headH / 2;
  parts.push(boxPart(headW, headH, 0.22, 0, headY, 0, C(skin, 1), BODY_K, true));

  // 发型剪影（6 变体派生同源：A 顶盖 · B 后披 · C 双辫 · D 丸子 · E 鸭舌 · F 头巾）
  parts.push(boxPart(headW * 1.06, 0.07, 0.23, 0, headY + headH / 2 - 0.02, 0, C(hair, 1), BODY_K, true));
  const longHair = (r.hair_part ?? "hair-short").includes("long");
  const shape = ((longHair ? 3 : 0) + pick(n >> 5, 3)) % 6;
  if (shape === 1) {
    parts.push(boxPart(headW * 1.02, headH * 0.95, 0.075, 0, headY - 0.06, -0.115, C(hair, 1), BODY_K, true));
  } else if (shape === 2) {
    for (const sx of [-1, 1]) {
      parts.push(boxPart(0.055, headH * 1.25, 0.055, sx * (headW * 0.52), headY - 0.10, -0.02, C(hair, 1), BODY_K, true));
    }
  } else if (shape === 3) {
    parts.push(spherePart(0.075, 0, headY + headH / 2 + 0.05, -0.06, C(hair, 1), BODY_K, true));
  } else if (shape === 4) {
    parts.push(boxPart(headW * 1.18, 0.035, 0.13, 0, headY + headH / 2 + 0.01, 0.10, C(hair, 1), BODY_K, true));
  } else if (shape === 5) {
    parts.push(boxPart(headW * 1.16, 0.10, 0.225, 0, headY + headH / 2 - 0.03, -0.01, C(hair, 1), BODY_K, true));
  }

  // 眼（eye_c overbright 伪发光；L2 近景特征点）
  for (const sx of [-1, 1]) {
    parts.push(boxPart(0.035, 0.035, 0.02, sx * 0.05, headY + 0.01, 0.112, C(eye, 1), GLOW_K, false));
  }

  // 徽章（badge_c overbright 伪发光）
  parts.push(boxPart(0.06, 0.06, 0.02, -0.09 * shoulder, legH + torsoH - 0.10, 0.105, C(badge, 1), GLOW_K, false));

  // 配件：faction 派生轮廓差异（远景认人）
  const fac = (r.faction ?? "").toLowerCase();
  if (fac.includes("commuter")) {
    parts.push(boxPart(0.10, 0.14, 0.06, 0.20 * shoulder, legH + 0.16, 0.02, C(0x3b3f4a, 1), BODY_K, true));
  } else if (fac.includes("lilong") || fac.includes("弄堂")) {
    parts.push(boxPart(0.26 * shoulder, 0.30, 0.02, 0, legH + 0.22, 0.106, C(0xe8e2d6, 1), BODY_K, true));
  } else if (fac.includes("compiled")) {
    parts.push(boxPart(0.19, 0.05, 0.02, 0, headY + 0.01, 0.118, C(0x9aa7b8, 1), BODY_K, true));
  } else if (fac.includes("newcomer")) {
    parts.push(boxPart(0.20, 0.22, 0.09, 0, legH + torsoH - 0.12, -0.145, C(0x2f6f5a, 1), BODY_K, true));
  }

  // 全部件 position/normal/uv/index 属性集一致 → merge 不会失配；
  // parts[0] 兜底仅作类型收窄（实际不可达）。
  const merged = mergeGeometries(parts, false);
  const geo = merged ?? parts[0];
  return { geo, h: legH + torsoH + neck + headH };
}

function makeLabelSprite(text: string, accent: string): THREE.Sprite {
  const canvas = document.createElement("canvas");
  const pad = 8, fs = 26;
  const c0 = canvas.getContext("2d")!;
  c0.font = `${fs}px "Microsoft YaHei", sans-serif`;
  const w = Math.min(460, c0.measureText(text).width + pad * 2);
  canvas.width = Math.ceil(w);
  canvas.height = fs + pad * 2;
  const ctx = canvas.getContext("2d")!;
  ctx.font = `${fs}px "Microsoft YaHei", sans-serif`;
  ctx.fillStyle = "rgba(6,10,18,0.70)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = accent;
  ctx.lineWidth = 2;
  ctx.strokeRect(1, 1, canvas.width - 2, canvas.height - 2);
  ctx.fillStyle = accent;
  ctx.textBaseline = "middle";
  ctx.fillText(text, pad, canvas.height / 2);
  const tex = new THREE.CanvasTexture(canvas);
  const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false }));
  const k = 0.013; // 同 residents.ts：名牌不得比人大（截图实锚）
  sp.scale.set(canvas.width * k, canvas.height * k, 1);
  return sp;
}

export function buildResidentsBatched(plan: CityPlan, data: CityData): ResidentsBatchedRig {
  const root = new THREE.Group();
  const residents: ResidentEntry[] = data.residents ?? [];
  if (!residents.length) {
    // 禁装饰律：无数据 = 空 rig 但接口完整（与 residents.ts 同语义）。
    return { root, update: () => {}, anchors: [], setLabels: () => {} };
  }

  // 布局数学与 residents.ts 逐行同源（同 seed 同消费序 → 位置完全一致，
  // 指挥席切 import 后街景巡览锚点不漂移）。
  const rng = mulberry32(20261126);
  const byId = new Map<string, THREE.Vector3>();
  const anchors: ResidentsBatchedAnchor[] = [];
  const labels: THREE.Sprite[] = [];

  interface Entry { geo: THREE.BufferGeometry; m: THREE.Matrix4; }
  const entries: Entry[] = [];

  residents.forEach((r) => {
    const zone = ZONE_OF_DISTRICT[r.district ?? ""] ?? "media";
    const spec = plan.districts.find((d) => d.id === zone);
    const cx = spec ? spec.cx : 0;
    const cz = spec ? spec.cz : 0;
    const ang = rng() * Math.PI * 2;
    const rad = 76 + rng() * 28; // 城区外环带（实锚：不被楼群埋、街景可见）
    const x = cx + Math.cos(ang) * rad;
    const z = cz + Math.sin(ang) * rad;

    const { geo, h } = buildFigureGeometry(r);
    // 朝向：朝城区外（实锚：正脸对街景镜头）。一次性写死矩阵 = 静态批。
    const rotY = Math.atan2(x - cx, z - cz) + (h32(r.id) % 60) / 100 - 0.3;
    const m = new THREE.Matrix4().makeRotationY(rotY).setPosition(x, 0, z);
    entries.push({ geo, m });

    const zoneHex = ZONE_COLOR[zone] ?? 0xffffff;
    const label = makeLabelSprite(
      `${r.name ?? r.id}`, `#${zoneHex.toString(16).padStart(6, "0")}`);
    label.position.set(x, h + 0.72, z);
    root.add(label);
    labels.push(label);

    byId.set(r.id, new THREE.Vector3(x, h * 0.75, z));
    anchors.push({
      id: r.id, name: r.name ?? r.id,
      profession: r.profession ?? "", ring: r.ring ?? "",
      pos: new THREE.Vector3(x, h * 0.5, z),
    });
  });

  // ---- BatchedMesh 分批：32 居民 → 4 批 × 8 实例（合同 ≤4 批 / 每居民 1 实例） ----
  // 单批容量预算：每居民合并件 ≤ ~430 顶点 / ~660 索引（15 盒 + 1 球上限），
  // 预留 640 / 1280 · 人。u16 索引安全（批内 8×640 = 5120 ≤ 65535）。
  const VERT_PER = 640;
  const IDX_PER = 1280;
  const bodyMat = new THREE.MeshBasicMaterial({ vertexColors: true });
  const nBatches = Math.min(4, Math.max(1, entries.length));
  const per = Math.ceil(entries.length / nBatches);
  const batches: THREE.BatchedMesh[] = [];
  for (let b = 0; b < nBatches; b++) {
    const slice = entries.slice(b * per, (b + 1) * per);
    if (!slice.length) continue;
    const batch = new THREE.BatchedMesh(
      slice.length, slice.length * VERT_PER, slice.length * IDX_PER, bodyMat);
    for (const e of slice) {
      const gid = batch.addGeometry(e.geo);
      const iid = batch.addInstance(gid);
      batch.setMatrixAt(iid, e.m);
      e.geo.dispose(); // 数据已拷入批内缓冲，源几何即弃（realCity 同惯例）
    }
    batch.computeBoundingSphere(); // 静态实例：一次计算，此后复用
    root.add(batch);
    batches.push(batch);
  }

  // 观察流弧线（与 residents.ts 同源：点对点，退化城区→城区弧；不在
  // 433 审计口径内，保留 Line 保外观保真）。
  const echoes: EchoEntry[] = data.echoes ?? [];
  const arcs: THREE.Line[] = [];
  const zoneCenter = (d?: string): THREE.Vector3 | null => {
    const z = ZONE_OF_DISTRICT[d ?? ""] ?? "media";
    const s = plan.districts.find((x) => x.id === z);
    return s ? new THREE.Vector3(s.cx, 24, s.cz) : null;
  };
  echoes.slice(0, 24).forEach((e, i) => {
    let a = byId.get(e.owner ?? "");
    let b = byId.get(e.by ?? "");
    if (!a) a = zoneCenter(e.owner_d) ?? undefined;
    if (!b) b = zoneCenter(e.by_d) ?? undefined;
    if (!a || !b) return;
    const mid = new THREE.Vector3().addVectors(a, b).multiplyScalar(0.5);
    mid.y += 14 + (i % 5) * 4;
    const curve = new THREE.QuadraticBezierCurve3(a.clone(), mid, b.clone());
    const geo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(24));
    const line = new THREE.Line(geo, new THREE.LineBasicMaterial({
      color: 0x5dffb0, transparent: true, opacity: 0.45,
    }));
    root.add(line);
    arcs.push(line);
  });

  (window as unknown as { __CITY_RESIDENTS__?: unknown }).__CITY_RESIDENTS__ = {
    figures: entries.length, meshes: batches.length, arcs: arcs.length,
    slots: residents.length, drawCalls: batches.length,
  };

  return {
    root,
    anchors,
    setLabels: (v: boolean) => { labels.forEach((l) => { l.visible = v; }); },
    update: (_dt: number, elapsed: number) => {
      // 呼吸取舍：静态批禁每帧重写矩阵（原版 per-figure ±0.012 位移 =
      // 每帧 433 组矩阵更新）→ 人形呼吸位移取消；观察流弧线明暗脉动
      // 保留（材质 opacity，非矩阵路径）。
      arcs.forEach((ln, i) => {
        const m = ln.material as THREE.LineBasicMaterial;
        m.opacity = 0.18 + 0.26 * (0.5 + 0.5 * Math.sin(elapsed * 0.9 + i));
      });
    },
  };
}
