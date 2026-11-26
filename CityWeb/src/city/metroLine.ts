import * as THREE from "three";
import { projectX, projectZ } from "../geo/projection";
import { FLOW } from "../palette";
import { mulberry32, clamp } from "../util";

// ────────────────────────────────────────────────────────────────────────────
// Metro Line 2, cross-river run (wave 3 lane F): 陆家嘴 ⇄ 南京东路, the
// silicon-city reading of the real Line 2 tunnel under the Huangpu bend.
// Three layers, one rig, all real meters:
//
//   1. Tunnel — CatmullRom tube sunk at y = -14 through four real-alignment
//      anchors (station termini + two river-bend points).
//   2. Train — a 6-car chain (20 m pitch) shuttling between the termini at
//      22 m/s with a 4 s dwell at each end.
//   3. Entrances — 4 street-level glass kiosks (2 per bank), each with a
//      breathing light pillar and a flat glowing M ring, marking where the
//      line touches the surface.
//
// Rendering note (why the tunnel + train ignore the depth test): the city
// ground is an opaque disc at y = 0, so anything living at y = -14 is fully
// occluded from every camera this app offers (all camera levels stay above
// the ground). The tube and the cars therefore drop depthTest and blend
// additively/transparently over the whole scene — the classic metro-map
// x-ray reveal. Explicit renderOrder stacks the layers: tunnel glow (5) <
// car bodies (6) < window bands (7), so the train visibly rides INSIDE the
// pipe and the lit windows stay on top.
// ────────────────────────────────────────────────────────────────────────────

export interface MetroRig {
  root: THREE.Group;
  update: (dt: number, elapsed: number) => void;
}

// Real Line 2 alignment anchors (lat/lon). Lujiazui terminus sits by the
// Oriental Pearl, Nanjing East Road terminus ~1.2 km inland on the Puxi
// side; the two mid anchors trace the river bend. Projected once at module
// load — projection is pure, so module-level evaluation is deterministic.
const ANCHOR_LUJIAZUI = { lat: 31.2397, lon: 121.4998 };
const ANCHOR_MID_RIVER = { lat: 31.2418, lon: 121.4975 };
const ANCHOR_RIVER_HEART = { lat: 31.2432, lon: 121.4952 };
const ANCHOR_NANJING_E = { lat: 31.2405, lon: 121.4878 };

const TUNNEL_Y = -14; // tube centerline: under the river bed, below the banks
const TUNNEL_R = 8; // bored-tunnel radius (16 m bore)
const TUBE_SEGMENTS = 64; // tubular segments along the ~1.4 km run
const TUBE_RADIAL = 12; // cross-section smoothness

const CAR_COUNT = 6; // six-car train, real Line 2 stock length
const CAR_PITCH = 20; // car-center spacing: 18 m body + 2 m gap
const TRAIN_SPEED = 22; // m/s cruise
const DWELL_S = 4; // terminus dwell, seconds

// The run: station termini are the curve ends; arc-length parameter t of
// getPointAt() is measured 0 = Lujiazui -> 1 = Nanjing East Road.
const LINE = new THREE.CatmullRomCurve3([
  new THREE.Vector3(projectX(ANCHOR_LUJIAZUI.lon), TUNNEL_Y, projectZ(ANCHOR_LUJIAZUI.lat)),
  new THREE.Vector3(projectX(ANCHOR_MID_RIVER.lon), TUNNEL_Y, projectZ(ANCHOR_MID_RIVER.lat)),
  new THREE.Vector3(projectX(ANCHOR_RIVER_HEART.lon), TUNNEL_Y, projectZ(ANCHOR_RIVER_HEART.lat)),
  new THREE.Vector3(projectX(ANCHOR_NANJING_E.lon), TUNNEL_Y, projectZ(ANCHOR_NANJING_E.lat)),
]);
const LINE_LEN = LINE.getLength(); // ~1.4 km; drives all s <-> u conversions

// Entrance placement: arc distance from the near terminus + lateral side.
// 14 m lateral clears the 8 m tunnel bore, so the kiosks never overlap the
// x-ray pipe; alternating sides reads as two station exits flanking the
// line (exit A / exit B around each platform).
const ENTRANCE_LATERAL = 14;
const ENTRANCE_DEFS: Array<{ s: number; side: 1 | -1 }> = [
  { s: 30, side: 1 }, // Lujiazui bank pair
  { s: 62, side: -1 },
  { s: LINE_LEN - 30, side: -1 }, // Nanjing East Road bank pair
  { s: LINE_LEN - 62, side: 1 },
];

// ---- shared geometry singletons (rebuilds reuse one buffer each) ----
const TUNNEL_GEO = new THREE.TubeGeometry(LINE, TUBE_SEGMENTS, TUNNEL_R, TUBE_RADIAL, false);
const CAR_GEO = new THREE.BoxGeometry(18, 3.4, 3); // 18 m body, 3.4 m tall, 3 m wide
const WINDOW_GEO = new THREE.BoxGeometry(16, 1.2, 0.1); // window light band
const KIOSK_GEO = new THREE.BoxGeometry(10, 5, 10); // glass entrance hall
const PILLAR_GEO = new THREE.BoxGeometry(1.4, 26, 1.4); // entrance beacon column
const M_RING_GEO = new THREE.TorusGeometry(4, 0.5, 10, 48); // flat ground M mark

// ---- x-ray material family (tunnel + train, see header note) ----
const TUNNEL_MAT = new THREE.MeshBasicMaterial({
  color: FLOW.data.clone(), // data cyan = the gaming-artery line color
  transparent: true, opacity: 0.28,
  blending: THREE.AdditiveBlending,
  depthWrite: false, depthTest: false, fog: false,
});
const CAR_MAT = new THREE.MeshStandardMaterial({
  color: 0x1e2a3e, // deep navy stock livery
  roughness: 0.55, metalness: 0.3,
  // slightly translucent so the additive tube glow behind the train still
  // reads through the body — a fully opaque x-ray box would punch a dead
  // rectangle into the city image wherever the train passes
  transparent: true, opacity: 0.92,
  depthWrite: false, depthTest: false, fog: false,
});
const WINDOW_MAT = new THREE.MeshBasicMaterial({
  color: FLOW.data.clone().multiplyScalar(1.5), // lit window band, cyan
  blending: THREE.AdditiveBlending, transparent: true,
  depthWrite: false, depthTest: false, fog: false,
});

// ---- surface entrance materials (honest depth, above ground) ----
const KIOSK_MAT = new THREE.MeshStandardMaterial({
  color: 0x5eead4, // = FLOW.data hex, kept literal per spec
  transparent: true, opacity: 0.35,
  roughness: 0.2, metalness: 0.05,
  depthWrite: false, // glass shell: never occlude the pillar inside it
});
const M_RING_MAT = new THREE.MeshBasicMaterial({
  color: FLOW.data.clone().multiplyScalar(1.4),
  blending: THREE.AdditiveBlending, transparent: true, opacity: 0.9,
  depthWrite: false, fog: false,
});
const PILLAR_BASE = new THREE.MeshBasicMaterial({
  color: FLOW.data.clone().lerp(FLOW.ceo, 0.5), // cyan-white beacon (青白)
  blending: THREE.AdditiveBlending, transparent: true, opacity: 0.4,
  depthWrite: false, fog: false,
});

export function buildMetro(): MetroRig {
  const root = new THREE.Group();
  root.name = "metroLine2";
  const rng = mulberry32(202); // fixed seed => same entrance phases every reload

  // ---- 1. tunnel pipe ----
  const tunnel = new THREE.Mesh(TUNNEL_GEO, TUNNEL_MAT);
  tunnel.renderOrder = 5; // under the train layers, over the water/ground
  root.add(tunnel);

  // ---- 2. train: 6 cars, window bands mirrored to both sides ----
  // The brief budgets one Box(16,1.2,0.1) light band per car; mounting it on
  // BOTH flanks (one shared geometry + one shared material) keeps the lit
  // windows readable from either bank — a single-sided band would render
  // half the run as dead dark cars.
  const cars: THREE.Mesh[] = [];
  for (let i = 0; i < CAR_COUNT; i++) {
    const car = new THREE.Mesh(CAR_GEO, CAR_MAT);
    car.renderOrder = 6;
    for (const side of [-1, 1]) {
      const strip = new THREE.Mesh(WINDOW_GEO, WINDOW_MAT);
      strip.position.set(0, 0.5, side * 1.55); // 1.5 m half-width + 0.05 proud
      strip.renderOrder = 7;
      car.add(strip);
    }
    root.add(car);
    cars.push(car);
  }

  // ---- 3. surface entrances: 2 per bank, flanking each terminus ----
  interface Entrance {
    pillarMat: THREE.MeshBasicMaterial;
    phase: number;
  }
  const entrances: Entrance[] = [];
  const p = new THREE.Vector3();
  const tan = new THREE.Vector3();
  for (const def of ENTRANCE_DEFS) {
    const u = clamp(def.s / LINE_LEN, 0, 1);
    LINE.getPointAt(u, p);
    LINE.getTangentAt(u, tan);
    // horizontal normal: all anchors share y = -14 so tangents are level,
    // and (-t.z, t.x) is a unit perpendicular in the XZ plane
    const nx = -tan.z;
    const nz = tan.x;
    const g = new THREE.Group();
    g.position.set(
      p.x + nx * ENTRANCE_LATERAL * def.side,
      0, // entrances live at street level, not at the tunnel depth
      p.z + nz * ENTRANCE_LATERAL * def.side,
    );
    g.rotation.y = Math.atan2(-tan.z, tan.x); // kiosk faces the line

    const kiosk = new THREE.Mesh(KIOSK_GEO, KIOSK_MAT);
    kiosk.position.y = 2.5; // 5 m hall sitting on the y = 0 ground
    g.add(kiosk);

    const ring = new THREE.Mesh(M_RING_GEO, M_RING_MAT);
    ring.rotation.x = Math.PI / 2; // torus default is XY; flatten to XZ
    ring.position.y = 0.55; // tube bottom clears the ground disc, no z-fight
    g.add(ring);

    // pillar material is cloned per entrance so the breathing phase can be
    // staggered kiosk-to-kiosk (a shared material would pulse in lockstep)
    const pillarMat = PILLAR_BASE.clone();
    const pillar = new THREE.Mesh(PILLAR_GEO, pillarMat);
    pillar.position.y = 13; // 26 m column rising through the kiosk roof
    g.add(pillar);

    root.add(g);
    entrances.push({ pillarMat, phase: rng() * Math.PI * 2 });
  }

  // ---- shuttle state machine ----
  // s = arc position (m) of car 0's center. Bounded by
  //   S_MIN = 100  -> car 5 center at the Lujiazui platform (train fully in)
  //   S_MAX = LINE_LEN -> car 0 center at the Nanjing East platform
  // so every car parameter stays inside [0, 1]: no curve extrapolation.
  const S_MIN = (CAR_COUNT - 1) * CAR_PITCH;
  const S_MAX = LINE_LEN;
  let s = S_MIN;
  let dir = 1; // +1 outbound (Lujiazui -> Nanjing East), -1 return
  let dwell = DWELL_S; // parked at the Lujiazui platform on load, then departs

  function update(dt: number, elapsed: number): void {
    // stop-and-go: burn the dwell first, then advance; clamp at the terminus,
    // arm the dwell, and flip direction for the next leg
    if (dwell > 0) {
      dwell -= dt;
    } else {
      s += dir * TRAIN_SPEED * dt;
      if (dir > 0 && s >= S_MAX) {
        s = S_MAX;
        dwell = DWELL_S;
        dir = -1;
      } else if (dir < 0 && s <= S_MIN) {
        s = S_MIN;
        dwell = DWELL_S;
        dir = 1;
      }
    }

    // place the chain: car i trails car 0 by i * 20 m of arc length, each
    // car oriented along its own tangent (getPointAt is arc-uniform, so the
    // 20 m pitch is true meters everywhere on the curve)
    for (let i = 0; i < CAR_COUNT; i++) {
      const u = clamp((s - i * CAR_PITCH) / LINE_LEN, 0, 1);
      LINE.getPointAt(u, p);
      LINE.getTangentAt(u, tan);
      cars[i].position.set(p.x, TUNNEL_Y, p.z);
      cars[i].rotation.y = Math.atan2(-tan.z, tan.x);
    }

    // entrance beacon breathing: 0.4 +/- 0.14 opacity around the spec base,
    // phase-shifted per kiosk so the four beacons ripple along the line
    for (const e of entrances) {
      e.pillarMat.opacity = 0.4 + 0.14 * (0.5 + 0.5 * Math.sin(elapsed * 1.3 + e.phase));
    }
  }

  return { root, update };
}
