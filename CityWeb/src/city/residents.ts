import * as THREE from "three";
import { mulberry32 } from "../util";
import type { CityData, ResidentEntry, EchoEntry } from "../types";
import type { CityPlan } from "./layout";

// 挂牌居民层（2026-11-26 BigLife 融合）：
// 32 席 census 街面名册由 BigLife 的 city_bridge_export.py 产出（年轮按 id 直读
// 卡面），经 tools/export-city-data.ps1 投影进 window.CITY_DATA.residents。
// 视觉=每人一根发光立柱（高度=年轮字数，颜色=所在城区），顶部小字牌（canvas
// 贴图 sprite，避免字体依赖、file:// 可用）。观察流 echoes = owner→by 的弧线，
// 与 BigLife 侧本市页同语义（A 的事被 B 写了）。
// 禁装饰律：无 residents 数据时整层不生成（不放假人）。

const DISTRICT_COLOR: Record<string, number> = {
  GM: 0xff8c5c, MD: 0xff8c5c,
  QT: 0x4c9aff, OR: 0x4c9aff,
  NS: 0x9d7bff, RV: 0x9d7bff,
  anchors: 0xffd166,
};

export interface ResidentsRig {
  root: THREE.Group;
  update: (dt: number, elapsed: number) => void;
}

function makeLabelSprite(text: string, accent: string): THREE.Sprite {
  const canvas = document.createElement("canvas");
  const pad = 8, fs = 28;
  const ctx0 = canvas.getContext("2d")!;
  ctx0.font = `${fs}px "Microsoft YaHei", sans-serif`;
  const w = Math.min(560, ctx0.measureText(text).width + pad * 2);
  canvas.width = Math.ceil(w);
  canvas.height = fs + pad * 2;
  const ctx = canvas.getContext("2d")!;
  ctx.font = `${fs}px "Microsoft YaHei", sans-serif`;
  ctx.fillStyle = "rgba(8,12,20,0.72)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = accent;
  ctx.lineWidth = 2;
  ctx.strokeRect(1, 1, canvas.width - 2, canvas.height - 2);
  ctx.fillStyle = accent;
  ctx.textBaseline = "middle";
  ctx.fillText(text, pad, canvas.height / 2);
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false });
  const sp = new THREE.Sprite(mat);
  const scale = 0.032;
  sp.scale.set(canvas.width * scale, canvas.height * scale, 1);
  return sp;
}

export function buildResidents(plan: CityPlan, data: CityData): ResidentsRig {
  const root = new THREE.Group();
  const residents: ResidentEntry[] = data.residents ?? [];
  if (!residents.length) return { root, update: () => {} };

  const rng = mulberry32(20261126);
  const byId = new Map<string, THREE.Vector3>();
  const pillars: THREE.Mesh[] = [];
  const group: THREE.Group = root;

  residents.forEach((r, i) => {
    // 落位：按 district 归到对应城区中心附近（确定性抖动）
    const dist = plan.districts.find((d) => d.id === (r.district === "QT" || r.district === "OR" ? "quant"
      : r.district === "GM" || r.district === "MD" ? "gaming" : "media"));
    const cx = dist ? dist.cx : 0;
    const cz = dist ? dist.cz : 0;
    const ang = rng() * Math.PI * 2;
    const rad = 24 + rng() * 46;
    const x = cx + Math.cos(ang) * rad;
    const z = cz + Math.sin(ang) * rad;

    const color = DISTRICT_COLOR[r.district ?? ""] ?? 0xffffff;
    const ringLen = (r.ring ?? "").length;
    const h = 6 + Math.min(26, ringLen * 0.28);

    const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.85 });
    const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.75, h, 6), mat);
    pillar.position.set(x, h / 2, z);
    group.add(pillar);
    pillars.push(pillar);

    // 顶灯
    const lamp = new THREE.Mesh(
      new THREE.SphereGeometry(0.9, 10, 10),
      new THREE.MeshBasicMaterial({ color: r.goal_done != null && r.goal_total != null && r.goal_done >= r.goal_total ? 0x4ade80 : color })
    );
    lamp.position.set(x, h + 0.9, z);
    group.add(lamp);

    // 名牌（年轮首句 + 姓名）
    const short = (r.ring ?? "").replace(/^[「“]/, "").slice(0, 18);
    const label = makeLabelSprite(`${r.name ?? r.id}｜${short}`, `#${color.toString(16).padStart(6, "0")}`);
    label.position.set(x, h + 3.4, z);
    group.add(label);

    byId.set(r.id, new THREE.Vector3(x, h * 0.7, z));
  });

  // 观察流：owner → by 弧线。两级回退——
  //   ① 两端都在 32 席挂牌名单里：点对点精确弧；
  //   ② 否则退化为「城区中心→城区中心」的传播弧（语义仍真：GAME 城的事传到
  //      QUANT 城）。2026-11-26 实锚：观察流覆盖全城 1 万人，32 席里两头恰好
  //      都在名单内的边几乎为零，不做回退则 arcs=0（层等于没画）。
  const echoes: EchoEntry[] = data.echoes ?? [];
  const arcs: THREE.Line[] = [];
  const zoneCenter = (d?: string) => {
    const zone = d === "QT" || d === "OR" ? "quant" : d === "GM" || d === "MD" ? "gaming" : "media";
    const spec = plan.districts.find((x) => x.id === zone);
    return spec ? new THREE.Vector3(spec.cx, 26, spec.cz) : null;
  };
  echoes.slice(0, 24).forEach((e, i) => {
    let a = byId.get(e.owner ?? "");
    let b = byId.get(e.by ?? "");
    if (!a) a = zoneCenter(e.owner_d) ?? undefined;
    if (!b) b = zoneCenter(e.by_d) ?? undefined;
    if (!a || !b) return;
    const mid = new THREE.Vector3().addVectors(a, b).multiplyScalar(0.5);
    mid.y += 18 + (i % 5) * 4;
    const curve = new THREE.QuadraticBezierCurve3(a.clone(), mid, b.clone());
    const geo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(26));
    const line = new THREE.Line(geo, new THREE.LineBasicMaterial({
      color: 0x5dffb0, transparent: true, opacity: 0.5,
    }));
    group.add(line);
    arcs.push(line);
  });

  // 验收探针：让自动化截图能断言居民层真的生成了（不靠肉眼猜远景）。
  (window as unknown as { __CITY_RESIDENTS__?: unknown }).__CITY_RESIDENTS__ = {
    pillars: pillars.length, arcs: arcs.length, slots: residents.length,
  };

  return {
    root,
    update: (_dt: number, elapsed: number) => {      // 呼吸：顶灯轻微呼吸，肉眼可辨（禁装饰律允许：亮度锚真实数据存在）
      const k = 0.82 + 0.18 * Math.sin(elapsed * 1.6);
      pillars.forEach((p, i) => {
        const m = p.material as THREE.MeshBasicMaterial;
        m.opacity = 0.55 + 0.35 * k * (i % 3 === 0 ? 1 : 0.92);
      });
      arcs.forEach((ln, i) => {
        const m = ln.material as THREE.LineBasicMaterial;
        m.opacity = 0.22 + 0.3 * (0.5 + 0.5 * Math.sin(elapsed * 0.9 + i));
      });
    },
  };
}
