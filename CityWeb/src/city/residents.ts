import * as THREE from "three";
import { mulberry32 } from "../util";
import type { CityData, ResidentEntry, EchoEntry } from "../types";
import type { CityPlan } from "./layout";

// 挂牌居民层 v2（2026-11-26 CEO「居民形象加入 three.js 生成，每个人都要有自己的特征」）。
//
// 规格正典：life/BigLife/docs/RESIDENT-FIGURE-SPEC-v1.md
//   · 主特征严格来自卡面（六 hex 换装位 + 性别/年龄/发型/瞳型）——禁随机脸，
//     随机脸 = 没有可辨识特征；
//   · 次级微差由 hash(cid) 确定性派生（身高 ±4% / 肩宽 ±8% / 朝向 / 配件），
//     专门用来打破"20 人同发型、23 人同裤色"的撞车；
//   · 头身比 4.5–5.5（儿童 3.5–4），色块 ≤6，剪影优先。
//
// 验收：tools 侧 resident_figure_check.py 断言 A/B/C 三条（来源/撞脸/确定性）。

const ZONE_OF_DISTRICT: Record<string, string> = {
  GM: "gaming", MD: "gaming", QT: "quant", OR: "quant",
  NS: "media", RV: "media", anchors: "media",
};
const ZONE_COLOR: Record<string, number> = {
  gaming: 0xff8c5c, quant: 0x4c9aff, media: 0x9d7bff, meta: 0xffd166,
};

export interface ResidentAnchor {
  id: string;
  name: string;
  profession: string;
  ring: string;
  /// 行为层（共用技术底座 v1）：当前地点（语义键）与本拍动作，用于街景卡与调试
  place: string;
  act: string;
  pos: THREE.Vector3;
}

export interface ResidentsRig {
  root: THREE.Group;
  update: (dt: number, elapsed: number) => void;
  anchors: ResidentAnchor[];
  /// 街景模式下隐藏头顶名牌（信息已在底部居民卡，名牌会挡住身体）
  setLabels: (v: boolean) => void;
}

/** 确定性哈希：同一 cid 永远得到同一组微差参数。 */
function h32(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
const pick = (n: number, mod: number) => n % mod;

/** 材质缓存：同色复用，32 人 × 6 色块不至于生成上百个 material。
 *  2026-11-26 实锚：夜景下纯 Lambert 的人形几乎融进背景（截图取证），
 *  低模夜景的通行做法是给角色**自发光**（emissive = 本色 × 0.32），
 *  不增加任何光源开销，也让"每个人衣服/头发颜色不同"这个特征在夜里可辨。 */
const matCache = new Map<number, THREE.MeshLambertMaterial>();
function lambert(hex: number, emissive = 0): THREE.MeshLambertMaterial {
  const key = hex * 1000 + emissive;
  let m = matCache.get(key);
  if (!m) {
    m = new THREE.MeshLambertMaterial({ color: hex });
    const e = emissive || new THREE.Color(hex).multiplyScalar(0.32).getHex();
    m.emissive = new THREE.Color(e);
    matCache.set(key, m);
  }
  return m;
}

/** 卡面 hex → number；空/非法时用 fallback（保证不出现黑块）。 */
function hexOf(s: string | undefined, fallback: number): number {
  if (!s) return fallback;
  const v = parseInt(s.replace("#", ""), 16);
  return Number.isFinite(v) ? v : fallback;
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
  const k = 0.013;  // 2026-11-26：0.026 时名牌比人还大，把身体全遮住（截图取证）
  sp.scale.set(canvas.width * k, canvas.height * k, 1);
  return sp;
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

/** 造一个人形，返回 [group, 高]。全部几何按规格 §三，色块 ≤6。 */
function buildFigure(r: ResidentEntry): { g: THREE.Group; h: number } {
  const g = new THREE.Group();
  const n = h32(r.id);
  const age = Number(r.age ?? 30);
  const female = r.gender === "女";
  const child = age < 12;

  // 身高：卡面年龄定档 + cid 微差 ±4%
  const h0 = heightFor(age, female) * (0.96 + (pick(n, 9) / 100));
  // 体型档（2026-11-26 验收驱动）：5 维特征向量实测最小距离只有 1（存在两人只差
  // 一项），加"体型"作为第 6 维——影响肩宽与躯干厚度，远景剪影可辨。
  const build = pick(n >> 10, 3); // 0 瘦 / 1 中 / 2 壮
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
    const leg = new THREE.Mesh(new THREE.BoxGeometry(legW, legH, 0.14), lambert(pant));
    leg.position.set(sx * (legW * 0.62), legH / 2, 0);
    g.add(leg);
    const shoe = new THREE.Mesh(new THREE.BoxGeometry(legW * 1.08, 0.07, 0.19), lambert(0x25272e));
    shoe.position.set(sx * (legW * 0.62), 0.035, 0.02);
    g.add(shoe);
  }

  // 躯干
  const torso = new THREE.Mesh(
    new THREE.BoxGeometry(0.34 * shoulder, torsoH, 0.20 * bodyK), lambert(cloth));
  torso.position.set(0, legH + torsoH / 2, 0);
  g.add(torso);

  // 臂
  for (const sx of [-1, 1]) {
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.085, armH, 0.10), lambert(cloth));
    arm.position.set(sx * (0.17 * shoulder + 0.045), legH + torsoH - armH / 2 + 0.02, 0);
    g.add(arm);
  }

  // 头 + 发 + 眼
  const neck = 0.04;
  const headY = legH + torsoH + neck + headH / 2;
  const head = new THREE.Mesh(new THREE.BoxGeometry(headW, headH, 0.22), lambert(skin));
  head.position.set(0, headY, 0);
  g.add(head);

  // 发型剪影（2026-11-26 调研定谳）：低模场景里远距离能识别的只有三样——
  // 发型剪影 / 衣色 / 徽章色。卡面 hair_part 只有 short|long 两种，20 人同款，
  // 所以按 (hair_part, faction, cid) 派生 6 种剪影变体（仍确定性，不是随机）：
  //   A 顶盖 · B 顶盖+后披 · C 顶盖+双辫 · D 丸子头 · E 鸭舌帽 · F 头巾
  const longHair = (r.hair_part ?? "hair-short").includes("long");
  const shape = ((longHair ? 3 : 0) + pick(n >> 5, 3)) % 6; // 0..5
  const capMesh = new THREE.Mesh(new THREE.BoxGeometry(headW * 1.06, 0.07, 0.23), lambert(hair));
  capMesh.position.set(0, headY + headH / 2 - 0.02, 0);
  g.add(capMesh);
  if (shape === 1) {
    const back = new THREE.Mesh(new THREE.BoxGeometry(headW * 1.02, headH * 0.95, 0.075), lambert(hair));
    back.position.set(0, headY - 0.06, -0.115);
    g.add(back);
  } else if (shape === 2) {
    for (const sx of [-1, 1]) {
      const braid = new THREE.Mesh(new THREE.BoxGeometry(0.055, headH * 1.25, 0.055), lambert(hair));
      braid.position.set(sx * (headW * 0.52), headY - 0.10, -0.02);
      g.add(braid);
    }
  } else if (shape === 3) {
    const bun = new THREE.Mesh(new THREE.SphereGeometry(0.075, 8, 6), lambert(hair));
    bun.position.set(0, headY + headH / 2 + 0.05, -0.06);
    g.add(bun);
  } else if (shape === 4) {
    const brim = new THREE.Mesh(new THREE.BoxGeometry(headW * 1.18, 0.035, 0.13), lambert(hair));
    brim.position.set(0, headY + headH / 2 + 0.01, 0.10);
    g.add(brim);
  } else if (shape === 5) {
    const scarf = new THREE.Mesh(new THREE.BoxGeometry(headW * 1.16, 0.10, 0.225), lambert(hair));
    scarf.position.set(0, headY + headH / 2 - 0.03, -0.01);
    g.add(scarf);
  }

  // 眼（eye_c 发光；L2 近景才明显，符合剪影优先判据）
  for (const sx of [-1, 1]) {
    const e = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.035, 0.02), lambert(eye, eye));
    e.position.set(sx * 0.05, headY + 0.01, 0.112);
    g.add(e);
  }

  // 徽章（胸前，badge_c）
  const bd = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 0.02), lambert(badge, badge));
  bd.position.set(-0.09 * shoulder, legH + torsoH - 0.10, 0.105);
  g.add(bd);

  // 配件：按 faction 派生轮廓差异（远景靠这个认人）
  const fac = (r.faction ?? "").toLowerCase();
  if (fac.includes("commuter")) {
    const bag = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.14, 0.06), lambert(0x3b3f4a));
    bag.position.set(0.20 * shoulder, legH + 0.16, 0.02);
    g.add(bag);
  } else if (fac.includes("lilong") || fac.includes("弄堂")) {
    const apron = new THREE.Mesh(new THREE.BoxGeometry(0.26 * shoulder, 0.30, 0.02), lambert(0xe8e2d6));
    apron.position.set(0, legH + 0.22, 0.106);
    g.add(apron);
  } else if (fac.includes("compiled")) {
    const frame = new THREE.Mesh(new THREE.BoxGeometry(0.19, 0.05, 0.02), lambert(0x9aa7b8));
    frame.position.set(0, headY + 0.01, 0.118);
    g.add(frame);
  } else if (fac.includes("newcomer")) {
    const pack = new THREE.Mesh(new THREE.BoxGeometry(0.20, 0.22, 0.09), lambert(0x2f6f5a));
    pack.position.set(0, legH + torsoH - 0.12, -0.145);
    g.add(pack);
  }

  return { g, h: legH + torsoH + neck + headH };
}

export function buildResidents(plan: CityPlan, data: CityData): ResidentsRig {
  const root = new THREE.Group();
  const residents: ResidentEntry[] = data.residents ?? [];
  if (!residents.length) return { root, update: () => {}, anchors: [], setLabels: () => {} };

  const rng = mulberry32(20261126);
  const byId = new Map<string, THREE.Vector3>();
  const figures: THREE.Group[] = [];
  const anchors: ResidentAnchor[] = [];
  const labels: THREE.Sprite[] = [];
  let meshCount = 0;

  residents.forEach((r) => {
    const zone = ZONE_OF_DISTRICT[r.district ?? ""] ?? "media";
    const spec = plan.districts.find((d) => d.id === zone);
    const cx = spec ? spec.cx : 0;
    const cz = spec ? spec.cz : 0;
    const ang = rng() * Math.PI * 2;
    // 2026-11-26 实锚：原来 rad 18-70（城区中心附近）→ 人被楼群埋住，街景镜头
    // 拉近直接钻进楼里（截图取证）。改到城区外环带 76-104（DISTRICT_R=78），
    // 既在城区内又不与塔楼重叠——街景能看见人，也能看见背后的城市。
    const rad = 76 + rng() * 28;
    const x = cx + Math.cos(ang) * rad;
    const z = cz + Math.sin(ang) * rad;

    const { g, h } = buildFigure(r);
    // 2026-11-26 共用技术底座 v1（cph4/city-foundation.md）：居民按 BigLife 行动闭环
    // 给的 place 站位，不再随机撒在外环带。place 是语义键，本仓负责映射到坐标——
    // 同区同地点的人聚到同一角度扇区，相遇才看得出"这两个人在一起"。
    // 没有 place（旧数据/行为层未接）时保持原随机站位：零漂移，不拿占位坐标冒充。
    let tx = x;
    let tz = z;
    if (r.place) {
      const pa = ((h32(`${r.district ?? ""}|${r.place}`) % 7200) / 7200) * Math.PI * 2;
      const rr = 82 + (h32(r.id) % 12);                    // 同地点错开半径，不重叠
      const ja = (((h32(r.id + "|a") % 100) / 100) - 0.5) * 0.10;  // 扇区内小偏移
      tx = cx + Math.cos(pa + ja) * rr;
      tz = cz + Math.sin(pa + ja) * rr;
    }
    g.position.set(tx, 0, tz);
    // 朝向：**朝城区外**（2026-11-26 实锚：原先朝中心，而街景相机从外圈朝内拍
    // → 观众永远看到后脑勺，眼睛和胸前徽章全被挡住，"每个人都有自己的特征"
    // 等于白做）。朝外站着，正脸对镜头。
    g.rotation.y = Math.atan2(tx - cx, tz - cz) + (h32(r.id) % 60) / 100 - 0.3;
    root.add(g);
    figures.push(g);
    meshCount += g.children.length;

    const zoneHex = ZONE_COLOR[zone] ?? 0xffffff;
    const label = makeLabelSprite(
      `${r.name ?? r.id}`, `#${zoneHex.toString(16).padStart(6, "0")}`);
    label.position.set(tx, h + 0.72, tz);
    root.add(label);
    labels.push(label);

    byId.set(r.id, new THREE.Vector3(tx, h * 0.75, tz));
    anchors.push({
      id: r.id, name: r.name ?? r.id,
      profession: r.profession ?? "", ring: r.ring ?? "",
      place: r.place ?? "", act: r.act_label ?? "",
      pos: new THREE.Vector3(tx, h * 0.5, tz),
    });
  });

  // 观察流：点对点，两端不在挂牌名单时退化为城区→城区弧（首跑实锚）
  const echoes: EchoEntry[] = data.echoes ?? [];
  const arcs: THREE.Line[] = [];
  const zoneCenter = (d?: string) => {
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
    figures: figures.length, meshes: meshCount, arcs: arcs.length,
    slots: residents.length,
  };

  return {
    root,
    anchors,
    setLabels: (v: boolean) => { labels.forEach((l) => { l.visible = v; }); },
    update: (_dt: number, elapsed: number) => {
      // 呼吸/微动：整体轻微起伏 + 弧线明暗（不引骨骼，WebGL 蒙皮判负）
      figures.forEach((f, i) => {
        f.position.y = Math.sin(elapsed * 1.1 + i) * 0.012;
      });
      arcs.forEach((ln, i) => {
        const m = ln.material as THREE.LineBasicMaterial;
        m.opacity = 0.18 + 0.26 * (0.5 + 0.5 * Math.sin(elapsed * 0.9 + i));
      });
    },
  };
}
