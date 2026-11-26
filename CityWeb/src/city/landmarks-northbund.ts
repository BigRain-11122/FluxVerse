import * as THREE from "three";
import { FLOW } from "../palette";
import { mulberry32, DEG } from "../util";

// ────────────────────────────────────────────────────────────────────────────
// 北外滩地标精修 lane C — two hand-tuned procedural landmarks for the
// Suzhou-Creek-mouth / North-Bund skyline, wearing the silicon-future skin
// (dark standard-material bodies + FLOW functional-color emissives), the same
// recipe brainTower.ts already proves at L0 camera distance.
//
//   buildWhiteMagnolia()   上海白玉兰广场 — 320 m North-Bund supertall:
//     tapered square shaft (55 m → 32 m edge, y 12–270) + 5-petal magnolia
//     corona flaring from y ≈ 271 to y ≈ 320; traffic-magenta corner light
//     prisms, a mid-tower halo collar, breathing petal glow, crown pulse.
//
//   buildWaibaiduBridge()  外白渡桥 — 104 m two-span through steel truss:
//     2 × 52 m spans, 11 m truss depth, deck at y = 10 (navigable clearance
//     below), 8 X-braced panels per span per side, portal frames at both
//     ends; data-cyan glowing chord rails + capital-gold lamp bands.
//
// Unit = 1 m. Local origin at ground y = 0; bridge spans along +X.
// ────────────────────────────────────────────────────────────────────────────

export interface LandmarkRig {
  root: THREE.Group;
  update: (dt: number, elapsed: number) => void;
}

// Shared material budget — deliberately tight (3 standard bodies + 4 emissive
// basics for BOTH landmarks) so two landmarks cost less than one naive block.
// All emissives are module singletons; update() drives colour / intensity,
// never clones, so the rigs stay allocation-free per frame.
const darkBodyMat = new THREE.MeshStandardMaterial({
  color: 0x22344e, roughness: 0.85, metalness: 0.15,
});
const petalMat = new THREE.MeshStandardMaterial({
  color: 0x2c4268, roughness: 0.4, metalness: 0.45,
  emissive: FLOW.traffic, emissiveIntensity: 0.22,
});
const steelMat = new THREE.MeshStandardMaterial({
  color: 0x2a3850, roughness: 0.6, metalness: 0.45,
});

const trafficEdgeMat = new THREE.MeshBasicMaterial({ color: FLOW.traffic.clone().multiplyScalar(1.25) });
const trafficCrownMat = new THREE.MeshBasicMaterial({ color: FLOW.traffic.clone().multiplyScalar(1.35) });
const dataChordMat = new THREE.MeshBasicMaterial({ color: FLOW.data.clone().multiplyScalar(1.3) });
const capitalLampMat = new THREE.MeshBasicMaterial({ color: FLOW.capital.clone().multiplyScalar(1.2) });

export function buildWhiteMagnolia(): LandmarkRig {
  const root = new THREE.Group();
  root.name = "whiteMagnolia";
  const rng = mulberry32(11326); // fixed seed → identical plaza on every reload

  const PODIUM_H = 12;   // podium 0–12 m
  const SHAFT_TOP = 270; // petals take over from here
  const EDGE_BOT = 55;   // shaft edge at base (m)
  const EDGE_TOP = 32;   // shaft edge at top (m)

  // Podium — a wide dark plinth so the 320 m shaft does not stab the ground.
  const podium = new THREE.Mesh(new THREE.BoxGeometry(64, PODIUM_H, 64), darkBodyMat);
  podium.position.y = PODIUM_H / 2;
  podium.castShadow = true;
  root.add(podium);

  // Tapered square shaft: a 4-gon cylinder yawed 45° is the cheapest
  // axis-aligned square prism with a true linear taper; square edge e maps
  // to circumradius e / √2.
  const shaft = new THREE.Mesh(
    new THREE.CylinderGeometry(EDGE_TOP / Math.SQRT2, EDGE_BOT / Math.SQRT2, SHAFT_TOP - PODIUM_H, 4, 1),
    darkBodyMat,
  );
  shaft.rotation.y = Math.PI / 4;
  shaft.position.y = (PODIUM_H + SHAFT_TOP) / 2;
  shaft.castShadow = true;
  root.add(shaft);

  // Four corner light prisms (traffic magenta). The shaft tapers, so each
  // corner line runs from (±27.5, ±27.5) at the shaft base to (±16, ±16) at
  // the top: one slanted thin box joins the two points exactly, and all four
  // corners share a single geometry (identical by symmetry).
  const cB = EDGE_BOT / 2;
  const cT = EDGE_TOP / 2;
  const up = new THREE.Vector3(0, 1, 0);
  const cornerLen = Math.hypot(SHAFT_TOP - PODIUM_H, (cB - cT) * Math.SQRT2);
  const cornerGeo = new THREE.BoxGeometry(1.2, cornerLen, 1.2);
  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) {
      const prism = new THREE.Mesh(cornerGeo, trafficEdgeMat);
      const dir = new THREE.Vector3(sx * (cT - cB), SHAFT_TOP - PODIUM_H, sz * (cT - cB));
      prism.quaternion.setFromUnitVectors(up, dir.normalize());
      prism.position.set((sx * (cB + cT)) / 2, (PODIUM_H + SHAFT_TOP) / 2, (sz * (cB + cT)) / 2);
      root.add(prism);
    }
  }

  // Mid-tower halo collar (塔腰光环) at y = 140: the torus radius follows the
  // interpolated corner circumradius so the ring threads the tapering
  // corners instead of floating loose of the silhouette.
  const haloY = 140;
  const taperT = (haloY - PODIUM_H) / (SHAFT_TOP - PODIUM_H);
  const halo = new THREE.Mesh(
    new THREE.TorusGeometry((EDGE_BOT + (EDGE_TOP - EDGE_BOT) * taperT) / Math.SQRT2 + 0.4, 0.9, 8, 48),
    trafficEdgeMat,
  );
  halo.rotation.x = Math.PI / 2;
  halo.position.y = haloY;
  root.add(halo);

  // Crown calyx — a dark block the petals erupt from, hiding the seam
  // between the shaft top and the corona.
  const calyx = new THREE.Mesh(new THREE.BoxGeometry(30, 7, 30), darkBodyMat);
  calyx.position.y = 273.5;
  root.add(calyx);

  // Magnolia corona — 5 petals (a real magnolia crown count; 4 reads as a
  // pinwheel, 6 as a gear). Each petal is an extruded 2D leaf outline; the
  // holder yaw fans them around the tower axis and rotation.x leans each
  // petal outward, so the corona flares open (外翻) rather than forming a
  // closed cone. Deterministic ±5% jitter on length/width/lean keeps the
  // crown organic — five identical clones would read as a revolve.
  const PETALS = 5;
  for (let i = 0; i < PETALS; i++) {
    const L = 52 + rng() * 4;             // petal length 52–56 m → tips y ≈ 314–320
    const W = 12 + rng() * 2.5;           // petal max half-width 12–14.5 m
    const lean = (29 + rng() * 5) * DEG;  // outward flare 29–34°

    const holder = new THREE.Group();
    holder.rotation.y = (i / PETALS) * Math.PI * 2 + 0.35;
    holder.position.y = 271;
    root.add(holder);

    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.quadraticCurveTo(W, L * 0.22, W * 0.55, L * 0.6);
    shape.quadraticCurveTo(W * 0.28, L * 0.88, 0, L);
    shape.quadraticCurveTo(-W * 0.28, L * 0.88, -W * 0.55, L * 0.6);
    shape.quadraticCurveTo(-W, L * 0.22, 0, 0);
    const petal = new THREE.Mesh(
      new THREE.ExtrudeGeometry(shape, { depth: 2.4, bevelEnabled: false, curveSegments: 12 }),
      petalMat,
    );
    petal.rotation.x = lean;
    petal.position.z = 6; // pivot off-axis so petal bases emerge from the calyx walls
    holder.add(petal);

    // Inner-edge glow rib riding each petal face (the breathing magenta
    // inner edge of the corona). Child of the petal so it inherits the lean.
    const rib = new THREE.Mesh(new THREE.BoxGeometry(0.9, L * 0.78, 0.5), trafficCrownMat);
    rib.position.set(0, L * 0.58, 3.0);
    petal.add(rib);
  }

  // Crown pulse heart + ring, both traffic magenta, both driven by the same
  // sharpened pulse in update() so the corona beats as one organ.
  const crownCore = new THREE.Mesh(new THREE.IcosahedronGeometry(4.2, 1), trafficCrownMat);
  crownCore.position.y = 291;
  root.add(crownCore);
  const crownRing = new THREE.Mesh(new THREE.TorusGeometry(7.5, 0.55, 8, 40), trafficCrownMat);
  crownRing.rotation.x = Math.PI / 2;
  crownRing.position.y = 287;
  root.add(crownRing);

  let pulse = 0; // dt-smoothed pulse state (the crown "heartbeat")
  const update = (dt: number, elapsed: number): void => {
    // Petal breath: slow whole-corona swell driven purely through material
    // colour/intensity — zero per-mesh state, zero allocations per frame.
    const breath = 0.5 + 0.5 * Math.sin(elapsed * 1.6);
    trafficCrownMat.color.copy(FLOW.traffic).multiplyScalar(1.1 + breath * 0.55);
    petalMat.emissiveIntensity = 0.18 + breath * 0.3;

    // Crown pulse: sin³ gives a hard attack / soft tail; dt-smoothing keeps
    // the beat stable under frame-time jitter instead of a lazy sine wobble.
    const target = Math.pow(Math.max(0, Math.sin(elapsed * 2.3 + 0.8)), 3);
    pulse += (target - pulse) * Math.min(1, dt * 9);
    crownCore.scale.setScalar(0.85 + pulse * 0.45);
    crownRing.scale.setScalar(0.9 + pulse * 0.28);

    // Corner prisms + halo shimmer on a slower counter-phase lane so the
    // tower never strobes as a whole (two-clock discipline, as brainTower
    // separates core / belt rhythms).
    const shimmer = 0.5 + 0.5 * Math.sin(elapsed * 0.7 + 2.1);
    trafficEdgeMat.color.copy(FLOW.traffic).multiplyScalar(1.0 + shimmer * 0.4);
  };

  return { root, update };
}

export function buildWaibaiduBridge(): LandmarkRig {
  const root = new THREE.Group();
  root.name = "waibaiduBridge";
  const rng = mulberry32(21204); // fixed seed → identical bridge every reload

  const SPAN = 52;     // one truss span
  const SPANS = 2;     // two spans = 104 m total (外白渡桥 ≈ 104 m)
  const TOTAL = SPAN * SPANS;
  const DECK_TOP = 10; // deck surface; ~8.5 m navigable clearance below
  const DECK_T = 1.5;
  const DECK_W = 14;
  const TRUSS_H = 11;  // truss depth (chord centreline to centreline)
  const PANEL = 6.5;   // 52 / 6.5 = 8 panels per span
  const SIDE = 6.6;    // truss planes ride just inside the deck edge
  const BOT = DECK_TOP + 0.4; // bottom chord level
  const TOP = BOT + TRUSS_H;  // top chord level

  // Deck — one long dark slab; the only big shadow caster of the span.
  const deck = new THREE.Mesh(new THREE.BoxGeometry(TOTAL, DECK_T, DECK_W), steelMat);
  deck.position.y = DECK_TOP - DECK_T / 2;
  deck.castShadow = true;
  root.add(deck);

  // Shared truss geometries: the ~120 meshes below reuse exactly 3 box
  // geometries, which is what keeps a 64-brace bridge cheap.
  const chordGeo = new THREE.BoxGeometry(SPAN, 1.0, 1.0);
  const vertGeo = new THREE.BoxGeometry(0.7, TRUSS_H, 0.7);
  const diagLen = Math.hypot(PANEL, TRUSS_H);
  const diagGeo = new THREE.BoxGeometry(diagLen, 0.55, 0.55);
  // The brief sketches the X braces at ±45°, but with a 6.5 m panel and an
  // 11 m truss depth a literal 45° bar would overshoot the node grid; the
  // true panel-diagonal angle ±59.4° (= atan(11 / 6.5)) lands every brace on
  // a chord node and reads as the same X lattice from L0 distance.
  const diagAngle = Math.atan2(TRUSS_H, PANEL);

  for (let s = 0; s < SPANS; s++) {
    const x0 = -TOTAL / 2 + s * SPAN; // span start: -52, then 0
    const cx = x0 + SPAN / 2;
    for (const z of [-SIDE, SIDE]) {
      // Top + bottom structural chords.
      for (const y of [BOT, TOP]) {
        const chord = new THREE.Mesh(chordGeo, steelMat);
        chord.position.set(cx, y, z);
        root.add(chord);
      }
      // Verticals at every 6.5 m node (9 per span-side); the node shared by
      // the two spans at mid-river is built once only.
      for (let k = 0; k <= SPAN / PANEL; k++) {
        if (s === 1 && k === 0) continue;
        const v = new THREE.Mesh(vertGeo, steelMat);
        v.position.set(x0 + k * PANEL, (BOT + TOP) / 2, z);
        root.add(v);
      }
      // X diagonal braces — 8 crossing pairs per span-side, one per panel.
      for (let k = 0; k < SPAN / PANEL; k++) {
        const xc = x0 + (k + 0.5) * PANEL;
        for (const sign of [1, -1]) {
          const d = new THREE.Mesh(diagGeo, steelMat);
          d.position.set(xc, (BOT + TOP) / 2, z);
          d.rotation.z = sign * diagAngle;
          root.add(d);
        }
      }
    }
  }

  // Portal frames at both ends (门式塔架, deliberately taller than the truss
  // so the bridge reads as a gate across the creek mouth). Deterministic
  // height jitter breaks the mirror-twin perfection of the two ends.
  for (const sx of [-1, 1]) {
    const ph = 17.5 + rng() * 1.5;
    const px = sx * (TOTAL / 2 - 0.5);
    for (const z of [-SIDE, SIDE]) {
      const post = new THREE.Mesh(new THREE.BoxGeometry(1.8, ph, 1.8), steelMat);
      post.position.set(px, DECK_TOP - 1 + ph / 2, z);
      post.castShadow = true;
      root.add(post);
    }
    const beam = new THREE.Mesh(new THREE.BoxGeometry(2.4, 2.4, SIDE * 2 + 2.2), steelMat);
    beam.position.set(px, DECK_TOP - 1 + ph - 1.2, 0);
    beam.castShadow = true;
    root.add(beam);
  }

  // Piers & abutments from the ground up to the deck underside: one centre
  // pier at the span joint (mid-river) + two bank abutments near the ends.
  const pierGeo = new THREE.BoxGeometry(5.5, DECK_TOP - DECK_T, 12);
  for (const px of [0, -(TOTAL / 2) + 3.0, TOTAL / 2 - 3.0]) {
    const pier = new THREE.Mesh(pierGeo, darkBodyMat);
    pier.position.set(px, (DECK_TOP - DECK_T) / 2, 0);
    pier.castShadow = true;
    root.add(pier);
  }

  // Data-cyan chord light rails (上下弦青色发光条): thin emissive straps
  // hugging the structural chords at both levels; from L0 they draw the two
  // glowing datum lines that make the truss legible at night.
  const chordGlowGeo = new THREE.BoxGeometry(TOTAL, 0.4, 0.4);
  for (const z of [-SIDE - 0.75, SIDE + 0.75]) {
    for (const y of [BOT, TOP]) {
      const rail = new THREE.Mesh(chordGlowGeo, dataChordMat);
      rail.position.set(0, y, z);
      root.add(rail);
    }
  }

  // Capital-gold lamp bands along both deck edges (桥面两侧金色灯带) — the
  // car-stream light of the traffic flow (static geometry; update() only
  // breathes the colour).
  const lampGeo = new THREE.BoxGeometry(TOTAL, 0.5, 0.5);
  for (const z of [-(DECK_W / 2 + 0.25), DECK_W / 2 + 0.25]) {
    const lamp = new THREE.Mesh(lampGeo, capitalLampMat);
    lamp.position.set(0, DECK_TOP + 0.3, z);
    root.add(lamp);
  }

  const update = (_dt: number, elapsed: number): void => {
    // 微呼吸 — the lamp bands breathe ±15% around capital gold so the deck
    // edges never read as dead plastic rails; the data rails shimmer on a
    // slower counter-phase lane (two-clock discipline, same as the tower).
    const breath = 0.5 + 0.5 * Math.sin(elapsed * 1.1);
    capitalLampMat.color.copy(FLOW.capital).multiplyScalar(0.95 + breath * 0.3);
    const shimmer = 0.5 + 0.5 * Math.sin(elapsed * 0.5 + 2.6);
    dataChordMat.color.copy(FLOW.data).multiplyScalar(1.05 + shimmer * 0.3);
  };

  return { root, update };
}
