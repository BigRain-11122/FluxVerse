import * as THREE from "three";
import { FLOW } from "../palette";
import { mulberry32 } from "../util";

// Lujiazui landmark pair (silicon-future skin): Oriental Pearl 468m +
// Jinmao Tower 420.5m. 1 unit = 1m. Each model is built at its local origin
// with ground at y=0 and faces north (-Z); placement/rotation belongs to the
// coordinator, not this module.

export interface LandmarkRig {
  root: THREE.Group;
  update: (dt: number, elapsed: number) => void;
}

// FLOW colors are shared singletons — always clone before boosting brightness.
const CYAN_RING = FLOW.data.clone().multiplyScalar(1.4); // pearl sphere rings
const CYAN_SEAM = FLOW.data.clone().multiplyScalar(1.15); // pearl core seams
const BLUE_MAST = FLOW.brain.clone().multiplyScalar(1.4);
const BLUE_TIP = FLOW.brain.clone().multiplyScalar(1.9);
const GOLD_LINE = FLOW.capital.clone().multiplyScalar(1.35); // jinmao ridges
const GOLD_SPIRE = FLOW.capital.clone().multiplyScalar(1.5);
const GOLD_TIP = FLOW.capital.clone().multiplyScalar(2.0);

// Big geometries live at module level so repeated builds share buffers.
const GEO_BOX = new THREE.BoxGeometry(1, 1, 1); // universal slab, scaled per use
const GEO_P_COLUMN = new THREE.CylinderGeometry(3.6, 4.6, 1, 12); // scaled in Y
const GEO_P_FOOT = new THREE.CylinderGeometry(5.6, 6.6, 2, 12);
const GEO_P_TIE = new THREE.CylinderGeometry(1.5, 1.5, 1, 10); // scaled in Y
const GEO_P_CORE = new THREE.CylinderGeometry(3, 3, 1, 16); // scaled in Y
const GEO_P_LOWER = new THREE.SphereGeometry(25, 32, 20);
const GEO_P_UPPER = new THREE.SphereGeometry(22.5, 28, 18);
const GEO_P_CAPSULE = new THREE.SphereGeometry(8, 20, 14);
const GEO_P_MAST = new THREE.CylinderGeometry(0.14, 0.9, 116, 8);
const GEO_P_TIP = new THREE.SphereGeometry(1.5, 12, 10);
const GEO_P_RING_L = new THREE.TorusGeometry(25, 0.7, 8, 48);
const GEO_P_RING_U = new THREE.TorusGeometry(22.5, 0.6, 8, 44);
const GEO_P_RING_C = new THREE.TorusGeometry(8, 0.4, 8, 32);
const GEO_J_RING = new THREE.TorusGeometry(17, 0.5, 8, 40); // scaled per tier
const GEO_J_SPIRE = new THREE.CylinderGeometry(0.22, 1.5, 22.5, 8);
const GEO_J_TIP = new THREE.SphereGeometry(1.5, 12, 10);

export function buildOrientalPearl(): LandmarkRig {
  const rng = mulberry32(0x0ea12);
  const root = new THREE.Group();
  const up = new THREE.Vector3(0, 1, 0);

  // Body budget = 3 standard materials: concrete legs / deep hull / core metal.
  const matConcrete = new THREE.MeshStandardMaterial({ color: 0x2c3f5c, roughness: 0.9, metalness: 0.1 });
  const matHull = new THREE.MeshStandardMaterial({ color: 0x22334f, roughness: 0.55, metalness: 0.35 });
  const matMetal = new THREE.MeshStandardMaterial({ color: 0x48628a, roughness: 0.3, metalness: 0.85 });
  // Glow pieces: additive cyan rings/seams + plain brain-blue mast/tip.
  const matRing = new THREE.MeshBasicMaterial({
    color: CYAN_RING.clone(), blending: THREE.AdditiveBlending, transparent: true, depthWrite: false,
  });
  const matSeam = new THREE.MeshBasicMaterial({
    color: CYAN_SEAM.clone(), blending: THREE.AdditiveBlending, transparent: true, depthWrite: false,
  });
  const matMast = new THREE.MeshBasicMaterial({ color: BLUE_MAST.clone() });
  const matTip = new THREE.MeshBasicMaterial({ color: BLUE_TIP.clone() });

  // Three legs lean in 30 deg: feet on a 66m circle, tops converge at y=110
  // inside the lower sphere. Horizontal run 63.5m over 110m = tan(30deg).
  const FOOT_R = 66;
  const TOP_R = 2.5;
  const TOP_Y = 110;
  const feet: THREE.Vector3[] = [];
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI * 2 + Math.PI / 6;
    const foot = new THREE.Vector3(Math.cos(a) * FOOT_R, 0, Math.sin(a) * FOOT_R);
    const top = new THREE.Vector3(Math.cos(a) * TOP_R, TOP_Y, Math.sin(a) * TOP_R);
    feet.push(foot);
    const dir = top.clone().sub(foot);
    const col = new THREE.Mesh(GEO_P_COLUMN, matConcrete);
    col.scale.y = dir.length();
    col.quaternion.setFromUnitVectors(up, dir.normalize());
    col.position.copy(foot).add(top).multiplyScalar(0.5);
    col.castShadow = true;
    root.add(col);
    const pad = new THREE.Mesh(GEO_P_FOOT, matConcrete);
    pad.position.set(foot.x, 1, foot.z);
    root.add(pad);
  }

  // Tie beams brace the legs just under the lower sphere, like the real
  // cross tubes at y~70.
  const TIE_Y = 72;
  const tieR = FOOT_R - (FOOT_R - TOP_R) * (TIE_Y / TOP_Y);
  for (let i = 0; i < 3; i++) {
    const a0 = Math.atan2(feet[i].z, feet[i].x);
    const a1 = Math.atan2(feet[(i + 1) % 3].z, feet[(i + 1) % 3].x);
    const p0 = new THREE.Vector3(Math.cos(a0) * tieR, TIE_Y, Math.sin(a0) * tieR);
    const p1 = new THREE.Vector3(Math.cos(a1) * tieR, TIE_Y, Math.sin(a1) * tieR);
    const d = p1.clone().sub(p0);
    const tie = new THREE.Mesh(GEO_P_TIE, matConcrete);
    tie.scale.y = d.length();
    tie.quaternion.setFromUnitVectors(up, d.normalize());
    tie.position.copy(p0).add(p1).multiplyScalar(0.5);
    root.add(tie);
  }

  // Spheres: deep silicon hull, one cyan glow ring each.
  const lower = new THREE.Mesh(GEO_P_LOWER, matHull);
  lower.position.y = 98;
  lower.castShadow = true;
  root.add(lower);
  const upper = new THREE.Mesh(GEO_P_UPPER, matHull);
  upper.position.y = 267;
  upper.castShadow = true;
  root.add(upper);
  const capsule = new THREE.Mesh(GEO_P_CAPSULE, matHull);
  capsule.position.y = 344;
  capsule.castShadow = true;
  root.add(capsule);

  const rings: Array<{ mesh: THREE.Mesh; phase: number }> = [];
  const addRing = (geo: THREE.BufferGeometry, y: number): void => {
    const ring = new THREE.Mesh(geo, matRing);
    ring.rotation.x = Math.PI / 2; // torus default lies in XY; flatten to XZ
    ring.position.y = y;
    root.add(ring);
    rings.push({ mesh: ring, phase: rng() * Math.PI * 2 });
  };
  addRing(GEO_P_RING_L, 98);
  addRing(GEO_P_RING_U, 267);
  addRing(GEO_P_RING_C, 344);

  // Central core: dark shaft + metal fins with cyan light seams between.
  const CORE_Y0 = 95;
  const CORE_Y1 = 352;
  const coreH = CORE_Y1 - CORE_Y0;
  const coreY = (CORE_Y0 + CORE_Y1) / 2;
  const core = new THREE.Mesh(GEO_P_CORE, matHull);
  core.scale.y = coreH;
  core.position.y = coreY;
  core.castShadow = true;
  root.add(core);
  for (let k = 0; k < 8; k++) {
    const phi = (k / 8) * Math.PI * 2 + Math.PI / 8;
    const fin = new THREE.Mesh(GEO_BOX, matMetal);
    fin.scale.set(0.65, coreH, 1.2);
    fin.position.set(Math.cos(phi) * 3.55, coreY, Math.sin(phi) * 3.55);
    fin.rotation.y = Math.PI / 2 - phi; // local +Z aligns radially
    root.add(fin);
    const sPhi = phi + Math.PI / 8;
    const seam = new THREE.Mesh(GEO_BOX, matSeam);
    seam.scale.set(0.22, coreH, 0.34);
    seam.position.set(Math.cos(sPhi) * 3.95, coreY, Math.sin(sPhi) * 3.95);
    seam.rotation.y = Math.PI / 2 - sPhi;
    root.add(seam);
  }

  // Antenna: glowing brain-blue mast from capsule top (352) to 468 + beacon.
  const mast = new THREE.Mesh(GEO_P_MAST, matMast);
  mast.position.y = 352 + 58;
  root.add(mast);
  const tip = new THREE.Mesh(GEO_P_TIP, matTip);
  tip.position.y = 468;
  root.add(tip);

  const update = (dt: number, elapsed: number): void => {
    // Rings breathe together (shared material) with a per-ring phase wobble.
    const breath = 0.72 + 0.28 * Math.sin(elapsed * 1.4);
    matRing.color.copy(CYAN_RING).multiplyScalar(breath);
    for (const r of rings) {
      r.mesh.scale.setScalar(1 + 0.02 * Math.sin(elapsed * 1.4 + r.phase));
    }
    matSeam.color.copy(CYAN_SEAM).multiplyScalar(0.55 + 0.45 * Math.sin(elapsed * 2.1));
    // Aviation-style double blink on the mast tip.
    const t = elapsed % 2.4;
    const lit = t < 0.12 || (t > 0.26 && t < 0.38);
    matTip.color.copy(BLUE_TIP).multiplyScalar(lit ? 1.0 : 0.08);
    tip.scale.setScalar(lit ? 1.25 : 0.85);
    matMast.color.copy(BLUE_MAST).multiplyScalar(0.85 + 0.15 * Math.sin(elapsed * 0.9));
  };

  return { root, update };
}

export function buildJinmao(): LandmarkRig {
  const rng = mulberry32(0x4d00d);
  const root = new THREE.Group();
  const up = new THREE.Vector3(0, 1, 0);

  // Body budget = 2 standard materials; glow = capital gold basics.
  const matBody = new THREE.MeshStandardMaterial({ color: 0x2a3c5e, roughness: 0.72, metalness: 0.28 });
  const matCrown = new THREE.MeshStandardMaterial({ color: 0x3a5078, roughness: 0.3, metalness: 0.85 });
  const matGold = new THREE.MeshBasicMaterial({
    color: GOLD_LINE.clone(), blending: THREE.AdditiveBlending, transparent: true, depthWrite: false,
  });
  const matSpire = new THREE.MeshBasicMaterial({
    color: GOLD_SPIRE.clone(), blending: THREE.AdditiveBlending, transparent: true, depthWrite: false,
  });
  const matTip = new THREE.MeshBasicMaterial({ color: GOLD_TIP.clone() });

  // Podium grounds the setback shaft.
  const PODIUM = 68;
  const PODIUM_H = 26;
  const podium = new THREE.Mesh(GEO_BOX, matBody);
  podium.scale.set(PODIUM, PODIUM_H, PODIUM);
  podium.position.y = PODIUM_H / 2;
  podium.castShadow = true;
  root.add(podium);

  const goldCorner = (x: number, z: number, y: number, h: number, s: number): void => {
    const strip = new THREE.Mesh(GEO_BOX, matGold);
    strip.scale.set(s, h, s);
    strip.position.set(x, y, z);
    root.add(strip);
  };
  for (let sx = -1; sx <= 1; sx += 2) {
    for (let sz = -1; sz <= 1; sz += 2) {
      goldCorner(sx * (PODIUM / 2 - 0.1), sz * (PODIUM / 2 - 0.1), PODIUM_H / 2, PODIUM_H + 1.5, 1.4);
    }
  }

  // 8 setback segments x 42.5m = 340m body (88 floors), 6% narrower each.
  const SEG_N = 8;
  const SEG_H = 42.5;
  const W0 = 58;
  const BODY_TOP = 340;
  for (let i = 0; i < SEG_N; i++) {
    const w = W0 * Math.pow(0.94, i);
    const half = w / 2;
    const y = SEG_H / 2 + i * SEG_H;
    const seg = new THREE.Mesh(GEO_BOX, matBody);
    seg.scale.set(w, SEG_H, w);
    seg.position.y = y;
    seg.castShadow = true;
    root.add(seg);
    // Gold ridges on the four corners bridge each setback ledge so the lines
    // read continuous from podium to crown.
    for (let sx = -1; sx <= 1; sx += 2) {
      for (let sz = -1; sz <= 1; sz += 2) {
        goldCorner(sx * (half - 0.1), sz * (half - 0.1), y, SEG_H + 2.2, 1.1);
      }
    }
  }
  const topHalf = (W0 * Math.pow(0.94, SEG_N - 1)) / 2;

  // Crown: five shrinking petal tiers (pagoda feel) bound by gold rings.
  for (let i = 0; i < 5; i++) {
    const baseY = BODY_TOP + i * 11.5;
    const r = 17 * (1 - 0.16 * i);
    const flare = 0.4 - 0.06 * i + (rng() - 0.5) * 0.05;
    const petalH = 12.5 + (rng() - 0.5) * 0.8;
    const chord = 2 * r * Math.sin(Math.PI / 8) * 1.28; // overlap closes gaps
    for (let k = 0; k < 8; k++) {
      const phi = (k / 8) * Math.PI * 2 + Math.PI / 8 + (rng() - 0.5) * 0.04;
      const pivot = new THREE.Group();
      pivot.position.y = baseY;
      pivot.rotation.y = phi;
      const petal = new THREE.Mesh(GEO_BOX, matCrown);
      petal.scale.set(chord, petalH, 0.8);
      // Shift outward so the rotated petal foot lands on the tier ring and
      // the top flares past it.
      petal.position.set(
        r + (petalH / 2) * Math.sin(flare),
        (petalH / 2) * Math.cos(flare),
        0,
      );
      petal.rotation.z = -flare; // tip the top outward
      pivot.add(petal);
      root.add(pivot);
    }
    const ring = new THREE.Mesh(GEO_J_RING, matGold);
    ring.rotation.x = Math.PI / 2;
    ring.scale.setScalar(r / 17);
    ring.position.y = baseY + 1;
    root.add(ring);
  }

  // Corner ridges converge into the spire so the gold lines reach the top.
  for (let sx = -1; sx <= 1; sx += 2) {
    for (let sz = -1; sz <= 1; sz += 2) {
      const a = new THREE.Vector3(sx * topHalf, BODY_TOP, sz * topHalf);
      const b = new THREE.Vector3(sx * 3.2, 397.5, sz * 3.2);
      const d = b.clone().sub(a);
      const rod = new THREE.Mesh(GEO_BOX, matGold);
      rod.scale.set(0.7, d.length(), 0.7);
      rod.quaternion.setFromUnitVectors(up, d.normalize());
      rod.position.copy(a).add(b).multiplyScalar(0.5);
      root.add(rod);
    }
  }

  // Spire 397 -> 419.5 + breathing tip => total ~420.5m.
  const spire = new THREE.Mesh(GEO_J_SPIRE, matSpire);
  spire.position.y = 397 + 22.5 / 2;
  root.add(spire);
  const tip = new THREE.Mesh(GEO_J_TIP, matTip);
  tip.position.y = 419.2;
  root.add(tip);

  const update = (dt: number, elapsed: number): void => {
    // Crown gold breath: tip swells, spire and ridges shimmer behind it.
    const breathe = 0.5 + 0.5 * Math.sin(elapsed * 1.1);
    matTip.color.copy(GOLD_TIP).multiplyScalar(1.0 + 0.9 * breathe);
    tip.scale.setScalar(0.9 + 0.3 * breathe);
    matSpire.color.copy(GOLD_SPIRE).multiplyScalar(0.8 + 0.35 * Math.sin(elapsed * 1.1 + 0.7));
    matGold.color.copy(GOLD_LINE).multiplyScalar(0.88 + 0.16 * Math.sin(elapsed * 0.8 + 2.1));
  };

  return { root, update };
}
