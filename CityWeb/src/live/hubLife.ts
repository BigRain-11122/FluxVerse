import * as THREE from "three";
import { mulberry32, clamp } from "../util";
import { FLOW } from "../palette";

// CEO order 2026-11-26 "人能进入" (people can enter), next step: 馆里有生命
// (life inside the halls). enterable.ts raises the glass pavilions - shell,
// mezzanine slabs, door gap - and this module fills ONLY their interior
// space: walking figure silhouettes on the three decks, deck-edge breathing
// lights and a breathing glow carpet at the door. It never rebuilds or
// mutates the shell; it receives the same walkable AABBs (EnterableSpec[])
// the walker uses, so every placement derives from {cx, cz, hw, hd} alone
// and stays correct even if the hall count changes.

export interface HubLifeRig {
  root: THREE.Group;
  update: (dt: number, elapsed: number, hour: number) => void;
}

// ---- enterable.ts geometry facts this module must respect (read-only) ----
// shell 60 x 40 x 28 m; interior half extents 29.3 / 19.3 (axis-swapped by
// each hall's snapped yaw); mezzanine slabs BoxGeometry(56, 0.8, 36) centred
// on FLOOR_Y; central elevator column CylinderGeometry(3, 3, 26); 20 m door
// gap on the local +Z face. Specs are world-axis AABBs carrying no yaw, so
// this module works purely in the spec frame - the codebase convention
// (main.ts walk entry puts the player at cz + hd + 6) already treats the
// spec's +Z face as the entrance side, and the door carpet anchors there.
const FLOOR_Y = [6, 14, 22]; // enterable.ts FLOOR_Y: slab centre lines
const SLAB_T = 0.8;          // slab thickness -> walkable face = FLOOR_Y + SLAB_T/2
const SLAB_INSET = 1.3;      // slab edge inset from interior glass (29.3 -> 28, 19.3 -> 18)
const COLUMN_R = 3;          // elevator column radius: figure rings keep off it

// ---- interior life layout, real metres ----
const FIGS_PER_FLOOR = 8;
const FLOORS = FLOOR_Y.length;
const FIGS_PER_HUB = FIGS_PER_FLOOR * FLOORS; // 24 silhouettes per hall
const OMEGA_MIN = 0.1;   // rad/s: slow deck stroll
const OMEGA_MAX = 0.25;
const RADIUS_MIN = 2;    // m: small orbit radius per instance
const RADIUS_MAX = 5;
const EDGE_MARGIN = 1.8; // m: rings stay clear of the deck-edge light bands
const SEED = 7272;       // lane C constant: rebuild-stable interior crowds

// The spec capsule (r = 0.28, length = 1.0 -> 1.56 m tall) is lifted +0.9,
// so its foot sits 0.12 m above the instance origin; lowering the origin by
// the same 0.12 plants the feet exactly ON the slab face (real-metric
// planting, no sinking, no hovering).
const CAP_FOOT = 0.9 - (0.28 + 1.0 / 2); // 0.12

// Hub occupancy by wall-clock hour: full house 07:00-22:00, deep-night
// skeleton crew of 25%. A hall that goes fully dark reads as broken; a
// quiet hall reads as night.
function occupancy(hour: number): number {
  return hour >= 7 && hour < 22 ? 1 : 0.25;
}

// ---- shared geometry module constants: one per shape, all hubs reuse ----
const FIGURE_GEO = new THREE.CapsuleGeometry(0.28, 1.0, 3, 6);
FIGURE_GEO.translate(0, 0.9, 0); // origin at the feet (spec lift)
const STRIP_GEO = new THREE.BoxGeometry(30, 0.25, 1); // deck-edge light band
const MAT_GEO = new THREE.PlaneGeometry(18, 10);      // door glow carpet

interface Figure {
  hub: number;    // owning hub block (contiguous 24-instance run)
  ox: number;     // orbit centre, world X
  oz: number;     // orbit centre, world Z
  y: number;      // instance origin Y (feet planted on the slab face)
  radius: number; // m
  omega: number;  // rad/s
  phase: number;  // rad
}

interface HubBlock {
  start: number;  // first figure index of this hub's contiguous run
  target: number; // visible goal for the current hour band
}

interface HubAnim {
  stripMat: THREE.MeshBasicMaterial; // per-hub material: each hall breathes off-phase
  stripBase: THREE.Color;
  doorMat: THREE.MeshBasicMaterial;
  phase: number;
}

export function buildHubLife(specs: Array<{ cx: number; cz: number; hw: number; hd: number }>): HubLifeRig {
  const root = new THREE.Group();

  if (specs.length === 0) {
    const update = (): void => undefined; // no halls => no interior life
    return { root, update };
  }

  const rng = mulberry32(SEED);

  // ---- interior figures: one InstancedMesh pool, 24 instances per hall ----
  // A single pool (one draw call for every hall's crowd) partitioned into
  // contiguous 24-instance blocks; hiding the surplus under an hour band is
  // then a simple prefix cut per block (same pattern as live/pedestrians.ts).
  const figures: Figure[] = [];
  const blocks: HubBlock[] = [];
  specs.forEach((s, hubIndex) => {
    blocks.push({ start: figures.length, target: 0 });
    // the slab is inset 1.3 m from the interior glass on every side, so the
    // spec bounds minus the inset give the true deck rectangle in world
    // axes - valid for axis-swapped halls too
    const slabHalfX = Math.max(0, s.hw - SLAB_INSET);
    const slabHalfZ = Math.max(0, s.hd - SLAB_INSET);
    for (let f = 0; f < FLOORS; f++) {
      const y = FLOOR_Y[f] + SLAB_T / 2 - CAP_FOOT;
      for (let i = 0; i < FIGS_PER_FLOOR; i++) {
        const radius = RADIUS_MIN + rng() * (RADIUS_MAX - RADIUS_MIN);
        // Orbit centre in polar form so two real-metre constraints hold at
        // once: the whole walking ring stays inside the deck rectangle
        // (d <= dMax(theta)) and the ring's inner edge clears the central
        // elevator column (d >= dMin).
        const theta = rng() * Math.PI * 2;
        const dxMax = Math.max(0, slabHalfX - radius - EDGE_MARGIN);
        const dzMax = Math.max(0, slabHalfZ - radius - EDGE_MARGIN);
        const dMax = Math.min(
          dxMax / Math.max(0.05, Math.abs(Math.cos(theta))),
          dzMax / Math.max(0.05, Math.abs(Math.sin(theta))),
        );
        const dMin = radius + COLUMN_R + 0.8;
        const d = dMax <= dMin ? dMax : dMin + rng() * (dMax - dMin);
        figures.push({
          hub: hubIndex,
          ox: s.cx + Math.cos(theta) * d,
          oz: s.cz + Math.sin(theta) * d,
          y,
          radius,
          omega: OMEGA_MIN + rng() * (OMEGA_MAX - OMEGA_MIN),
          phase: rng() * Math.PI * 2,
        });
      }
    }
  });

  // deep cyan, unlit basic material: a flat silhouette, deliberately NOT
  // glowing - the halls glow, the people inside stay dark shapes
  const figureMat = new THREE.MeshBasicMaterial({ color: 0x1c4a44 });
  const figureMesh = new THREE.InstancedMesh(FIGURE_GEO, figureMat, figures.length);
  figureMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  figureMesh.frustumCulled = false; // the pool spans every hall, every frame
  figureMesh.castShadow = false;    // hub interior life casts no shadows
  root.add(figureMesh);

  const dummy = new THREE.Object3D();
  const hidden = new THREE.Matrix4().makeScale(0, 0, 0); // hide surplus in place
  for (let i = 0; i < figures.length; i++) figureMesh.setMatrixAt(i, hidden); // until first hour tick

  // ---- per-hall ambience: deck breathing lights + door breathing glow ----
  const anims: HubAnim[] = [];
  specs.forEach((s, hubIndex) => {
    const slabHalfX = Math.max(0, s.hw - SLAB_INSET);
    const slabHalfZ = Math.max(0, s.hd - SLAB_INSET);

    // Four light bands per floor hugging the deck edges, lying ON the slab
    // face: two parallel to world X at the +/-Z edges, two parallel to
    // world Z at the +/-X edges. A 30 m band fits every deck edge (edges
    // are 56 m or 36 m), so the frame holds for axis-swapped halls too.
    const stripBase = new THREE.Color(0xffd9a0); // warm white
    const stripMat = new THREE.MeshBasicMaterial({ color: stripBase.clone() });
    for (const fy of FLOOR_Y) {
      const y = fy + SLAB_T / 2 + 0.125; // band bottom exactly on the deck face
      for (const sz of [-1, 1]) {
        const strip = new THREE.Mesh(STRIP_GEO, stripMat);
        strip.position.set(s.cx, y, s.cz + sz * (slabHalfZ - 0.75));
        strip.castShadow = false;
        root.add(strip);
      }
      for (const sx of [-1, 1]) {
        const strip = new THREE.Mesh(STRIP_GEO, stripMat);
        strip.rotation.y = Math.PI / 2; // 30 m run along Z instead of X
        strip.position.set(s.cx + sx * (slabHalfX - 0.75), y, s.cz);
        strip.castShadow = false;
        root.add(strip);
      }
    }

    // Door glow carpet: additive data-cyan plane across the entrance
    // threshold. 18 m wide sits inside the 20 m door gap; centred on the
    // +Z interior face it spills ~5 m onto the street and ~5 m into the
    // hall, so it reads from outside (the 门面) and inside alike, and the
    // walk-mode player (spawned at cz + hd + 6) steps onto it on entry.
    const doorMat = new THREE.MeshBasicMaterial({
      color: FLOW.data.clone(), // 五色律: data cyan 0x5eead4
      transparent: true,
      opacity: 0.25,
      blending: THREE.AdditiveBlending,
      depthWrite: false, // additive glow must not punch holes in the ground
    });
    const mat = new THREE.Mesh(MAT_GEO, doorMat);
    mat.rotation.x = -Math.PI / 2; // flat on the ground
    mat.position.set(s.cx, 0.3, s.cz + s.hd);
    mat.renderOrder = 2; // additive after the transparent glass shell (order 1)
    mat.castShadow = false;
    root.add(mat);

    anims.push({ stripMat, stripBase, doorMat, phase: hubIndex * 1.7 });
  });

  const update = (dt: number, elapsed: number, hour: number): void => {
    void dt; // orbit angle = phase + omega * elapsed: a pure function of
    // wall-clock, so hidden figures keep advancing their rings and equal
    // calls stay bit-identical (same contract as live/pedestrians.ts).
    const occ = occupancy(hour);
    for (const b of blocks) {
      b.target = clamp(Math.round(FIGS_PER_HUB * occ), 0, FIGS_PER_HUB);
    }
    for (let i = 0; i < figures.length; i++) {
      const f = figures[i];
      const b = blocks[f.hub];
      if (i - b.start >= b.target) {
        figureMesh.setMatrixAt(i, hidden); // surplus: zero-scale, pool size fixed
        continue;
      }
      const a = f.phase + f.omega * elapsed;
      dummy.position.set(
        f.ox + Math.cos(a) * f.radius,
        f.y,
        f.oz + Math.sin(a) * f.radius,
      );
      // face the travel tangent of the ring
      dummy.rotation.set(0, Math.atan2(-Math.sin(a), Math.cos(a)), 0);
      dummy.scale.setScalar(1);
      dummy.updateMatrix();
      figureMesh.setMatrixAt(i, dummy.matrix);
    }
    figureMesh.instanceMatrix.needsUpdate = true;

    // Deck lights breathe with the hall's occupant tier (full house -> full
    // warm level, skeleton crew -> dimmed floor), +/-12% sine around that
    // level; the door glow breathes around opacity 0.25 (+/- 0.05).
    for (const a of anims) {
      const level = 0.45 + 0.55 * occ; // night floor: dimmed, never dark
      // 0.45 gain: review - full-brightness washes the interior figures
      // into pure white under bloom; dimmed strips let people read.
      a.stripMat.color.copy(a.stripBase).multiplyScalar(level * (1 + 0.12 * Math.sin(elapsed * 0.8 + a.phase)) * 0.45);
      a.doorMat.opacity = 0.25 + 0.05 * Math.sin(elapsed * 1.2 + a.phase * 0.6);
    }
  };

  return { root, update };
}
