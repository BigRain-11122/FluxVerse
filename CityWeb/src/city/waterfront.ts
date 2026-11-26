import * as THREE from "three";
import { projectX, projectZ } from "../geo/projection";
import { FLOW } from "../palette";
import { mulberry32 } from "../util";

// Waterfront promenade (滨水步道) - the walkable landscaped band along the
// Huangpu WEST bank: Bund stretch + North Bund stretch. Wave-3 lane G.
//
// Why this layer exists: realCity renders the river as a shader ribbon with
// no shore geometry, so from street level the bank reads as a hard void
// between water and buildings. This module adds the human-scale ground
// truth of the waterfront: a raised 12 m stone slab band, a low glowing
// cyan rail at the water edge, warm lamp posts every 55 m, and three
// observation decks that jut out over the river. Everything is placed in
// real meters on the west side of the hand-traced RIVER_CENTERLINE, with
// the walkway center at RIVER_HALF_W + 14 = 244 m from the centerline:
// 14 m inland of the water edge (offset 230), so the promenade never dips
// into the water ribbon, and clear of realCity's bank glow lines
// (offset 227) - the decks alone deliberately reach past them over the
// water. Only slabs and decks cast shadows (lane shadow budget); the rail,
// torus railings and lamps are glow / thin parts and stay shadow-free.

// ---------------------------------------------------------------------------
// River data: VERBATIM COPY from src/geo/realCity.ts, which keeps these
// module-private (not exported). [lat, lon] pairs, hand-traced OSM waterway.
// SYNC OBLIGATION: realCity.ts owns the river. If RIVER_CENTERLINE or
// RIVER_HALF_W changes there, the same commit must update this copy, or the
// promenade drifts off the bank while the water ribbon stays put.
// ---------------------------------------------------------------------------
const RIVER_CENTERLINE: Array<[number, number]> = [
  [31.2180, 121.4890],
  [31.2260, 121.4908],
  [31.2310, 121.4930],
  [31.2340, 121.4965],
  [31.2360, 121.5000],
  [31.2390, 121.5030],
  [31.2430, 121.5018],
  [31.2480, 121.5020],
  [31.2540, 121.5035],
  [31.2600, 121.5065],
  [31.2660, 121.5100],
  [31.2720, 121.5145],
];
const RIVER_HALF_W = 230;

// ---- promenade parameters (real meters) ----
// Span = centerline indices 2..10 (lat 31.2310 -> 31.2660): cl[2] is the
// south end of the Bund (延安东路 latitude), the polyline rounds the sharp
// L-bend corner at cl[5] (64 deg heading change, the Suzhou-Creek-mouth
// corner in game geography) and runs the North Bund front up to cl[10].
// cl[0..1] (South Bund / 十六铺 reach) and cl[11] (Yangpu reach) are outside
// this lane's scope.
const PROM_START = 2;
const PROM_END = 10;
const BANK_OFFSET = RIVER_HALF_W + 14; // walkway center, 14 m inland of the water edge

const WALKWAY_W = 12;
const WALKWAY_H = 0.5;
const WALKWAY_TOP = 0.75; // slab center y = 0.5: raised embankment, clears the water plane (y 0.4)
// Consecutive slabs overlap 8 m (4 m per end) so the splice has no wedge
// hole at the 64 deg L-bend corner (a 12 m strip needs >= 6*tan(32deg)=3.75 m
// per end). 8 m is 1-2.7% of the 292-763 m segment lengths, so the
// one-slab-per-polyline-segment rhythm still reads. Coplanar overlaps share
// one material, so the coincident top faces cannot z-fight visibly.
const JOINT_OVERLAP = 8;

const RAIL_H = 0.6; // low glowing rail height at the water-side edge
const RAIL_T = 0.5; // rail thickness
const RAIL_BASE_OPACITY = 0.6;

const LAMP_SPACING = 55;
const LAMP_RIVERWARD = 4; // posts stand on the slab, 2 m inside the rail
const LAMP_POST_H = 7;

const PLATFORM_W = 40;
const PLATFORM_D = 30;
// Deck center sits 14 m riverward of the walkway line, so the outer half of
// the 30 m depth (15 m) overhangs the water edge - the "向江面突出" reading.
const PLATFORM_PUSH = 14;
const TORUS_R = 24;
const TORUS_TUBE = 0.45;

const BREATH_AMP = 0.08; // +/-8 % opacity breathing on rail + deck railings
const BREATH_HZ = 1.5; // rad/s: ~4.2 s period, calm shoreline pulse

export interface WaterfrontRig {
  root: THREE.Group;
  update: (dt: number, elapsed: number) => void;
}

export function buildWaterfront(): WaterfrontRig {
  const root = new THREE.Group();
  const rng = mulberry32(7788); // lane G constant => rebuild-stable jitter & breath phases

  // ---- west-bank offset polyline (the promenade center line) ----
  const cl = RIVER_CENTERLINE.map(([lat, lon]) => ({ x: projectX(lon), z: projectZ(lat) }));
  const offs: Array<{ x: number; z: number }> = [];
  for (let i = PROM_START; i <= PROM_END; i++) {
    // Neighbor-averaged tangent - the same convention realCity uses for its
    // river ribbon and bank glow lines, so every shore-parallel layer agrees.
    const a = cl[Math.min(i + 1, cl.length - 1)];
    const b = cl[Math.max(i - 1, 0)];
    const dx = a.x - b.x;
    const dz = a.z - b.z;
    const len = Math.hypot(dx, dz) || 1;
    // West (outward, landward) normal = left of the south->north flow.
    // Verified: at the Bund middle latitude this offset lands on the real
    // Bund bank (game x approx -101 m vs real bank approx -95 m), i.e. the
    // promenade faces Lujiazui across the water exactly like the real one.
    const nx = dz / len;
    const nz = -dx / len;
    offs.push({ x: cl[i].x + nx * BANK_OFFSET, z: cl[i].z + nz * BANK_OFFSET });
  }

  // Per-segment lengths of the offset polyline + cumulative arc length.
  const segLen: number[] = [];
  const arcAt: number[] = [0];
  for (let j = 0; j < offs.length - 1; j++) {
    const d = Math.hypot(offs[j + 1].x - offs[j].x, offs[j + 1].z - offs[j].z);
    segLen.push(d);
    arcAt.push(arcAt[j] + d);
  }
  const totalArc = arcAt[arcAt.length - 1]; // ~4463 m of walkable front

  // ---- stone slab band: one box per polyline segment ----
  // One shared unit box scaled per segment: identical rendered footprint to
  // a per-segment Box(len, 0.5, 12) with a single geometry allocation.
  const slabGeo = new THREE.BoxGeometry(1, WALKWAY_H, WALKWAY_W);
  const slabMat = new THREE.MeshStandardMaterial({ color: 0x2c3444, roughness: 0.9 });
  for (let j = 0; j < offs.length - 1; j++) {
    const dx = offs[j + 1].x - offs[j].x;
    const dz = offs[j + 1].z - offs[j].z;
    const slab = new THREE.Mesh(slabGeo, slabMat);
    slab.scale.set(segLen[j] + JOINT_OVERLAP, 1, 1);
    slab.position.set(
      (offs[j].x + offs[j + 1].x) / 2,
      WALKWAY_TOP - WALKWAY_H / 2,
      (offs[j].z + offs[j + 1].z) / 2,
    );
    slab.rotation.y = Math.atan2(-dz, dx); // local +X onto the slab direction
    slab.castShadow = true; // lane rule: only walkway slabs + platforms cast
    slab.receiveShadow = true;
    root.add(slab);
  }

  // ---- low glowing rail at the slab's water-side edge ----
  // Exact segment lengths here (no overlap): additive blending sums in the
  // overlap, so a +8 m pad would double-brighten every joint, while a 0.5 m
  // strip leaves only sub-0.4 m dashes that read as a segmented light chain.
  const railGeo = new THREE.BoxGeometry(1, RAIL_H, RAIL_T);
  const railMat = new THREE.MeshBasicMaterial({
    color: FLOW.data.clone(), // 青色: data cyan is the city's shoreline voice
    transparent: true,
    opacity: RAIL_BASE_OPACITY,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    fog: true,
  });
  for (let j = 0; j < offs.length - 1; j++) {
    const dx = offs[j + 1].x - offs[j].x;
    const dz = offs[j + 1].z - offs[j].z;
    const L = segLen[j] || 1;
    const riverX = -dz / L; // riverward (east) unit, perpendicular to the slab
    const riverZ = dx / L;
    const rail = new THREE.Mesh(railGeo, railMat);
    rail.scale.set(L, 1, 1);
    rail.position.set(
      (offs[j].x + offs[j + 1].x) / 2 + riverX * (WALKWAY_W / 2),
      WALKWAY_TOP + RAIL_H / 2,
      (offs[j].z + offs[j + 1].z) / 2 + riverZ * (WALKWAY_W / 2),
    );
    rail.rotation.y = Math.atan2(-dz, dx);
    root.add(rail);
  }

  // ---- lamp posts every 55 m along the shore (two shared geometries) ----
  const lampCount = Math.floor(totalArc / LAMP_SPACING) + 1;
  const postGeo = new THREE.CylinderGeometry(0.2, 0.3, LAMP_POST_H, 6);
  const headGeo = new THREE.SphereGeometry(0.6, 12, 8);
  const postMat = new THREE.MeshStandardMaterial({ color: 0x141a26, roughness: 0.6, metalness: 0.3 });
  const headMat = new THREE.MeshBasicMaterial({
    // Warm white x1.4: over-bright so ACES + bloom read it as a lit lamp,
    // same trick as realCity's bank glow / island ring.
    color: new THREE.Color(0xffe6c4).multiplyScalar(1.4),
  });
  const posts = new THREE.InstancedMesh(postGeo, postMat, lampCount);
  const heads = new THREE.InstancedMesh(headGeo, headMat, lampCount);
  posts.frustumCulled = false; // the chain spans ~4.4 km along the shore
  heads.frustumCulled = false;
  root.add(posts, heads);

  const dummy = new THREE.Object3D();
  for (let k = 0; k < lampCount; k++) {
    // Locate arc position s on the offset polyline (8 segments, linear scan).
    const s = k * LAMP_SPACING;
    let j = 0;
    while (j < segLen.length - 1 && s > arcAt[j + 1]) j++;
    const L = segLen[j] || 1;
    const f = (s - arcAt[j]) / L;
    const dx = offs[j + 1].x - offs[j].x;
    const dz = offs[j + 1].z - offs[j].z;
    const px = offs[j].x + dx * f - (dz / L) * LAMP_RIVERWARD;
    const pz = offs[j].z + dz * f + (dx / L) * LAMP_RIVERWARD;
    // Shared scale jitter (0.96-1.04) for a hand-placed feel; post and orb
    // use the same draw so the orb stays mounted on the post top.
    const jitter = 0.96 + rng() * 0.08;
    dummy.position.set(px, WALKWAY_TOP + (LAMP_POST_H / 2) * jitter, pz);
    dummy.scale.setScalar(jitter);
    dummy.updateMatrix();
    posts.setMatrixAt(k, dummy.matrix);
    dummy.position.y = WALKWAY_TOP + LAMP_POST_H * jitter + 0.5; // orb nests on the post top
    dummy.updateMatrix();
    heads.setMatrixAt(k, dummy.matrix);
  }

  // ---- three observation decks jutting toward the river ----
  // Anchors as fractional indices on the offset polyline:
  //   1.7  = Bund middle (real 南京东路 gate latitude ~31.2371)
  //   4.25 = Suzhou Creek mouth (real creek/waibaidu latitude 31.2443; the
  //          game river runs ~1.2 km east of the real mouth, so the deck
  //          anchors to the promenade point at the creek's latitude)
  //   6.0  = North Bund middle (~31.254, 国际客运中心 area)
  function samplePromenade(t: number): { x: number; z: number; tx: number; tz: number } {
    const i = Math.max(0, Math.min(offs.length - 2, Math.floor(t)));
    const f = t - i;
    const a = offs[i];
    const b = offs[i + 1];
    const L = segLen[i] || 1;
    const x = a.x + (b.x - a.x) * f;
    const z = a.z + (b.z - a.z) * f;
    const tx = (b.x - a.x) / L;
    const tz = (b.z - a.z) / L;
    if (f < 0.1 && i > 0) {
      // Seated exactly on a vertex (North Bund deck): bisect the joint so the
      // 40 m deck straddles the promenade bend instead of snapping one way.
      const p0 = offs[i - 1];
      const L0 = segLen[i - 1] || 1;
      const bx = (a.x - p0.x) / L0 + tx;
      const bz = (a.z - p0.z) / L0 + tz;
      const bl = Math.hypot(bx, bz) || 1;
      return { x, z, tx: bx / bl, tz: bz / bl };
    }
    return { x, z, tx, tz };
  }

  const platformGeo = new THREE.BoxGeometry(PLATFORM_W, 1, PLATFORM_D); // shared by all 3
  const platformMat = new THREE.MeshStandardMaterial({ color: 0x273346, roughness: 0.9 });
  const torusGeo = new THREE.TorusGeometry(TORUS_R, TORUS_TUBE, 8, 72); // shared by all 3
  // Breathing set: rail + one torus material per deck, each with its own
  // deterministic phase so the pulse travels along the shore.
  const breathMats: Array<{ mat: THREE.MeshBasicMaterial; base: number; phase: number }> = [
    { mat: railMat, base: RAIL_BASE_OPACITY, phase: 0 },
  ];
  const anchors = [1.7, 4.25, 6.0];
  for (const t of anchors) {
    const p = samplePromenade(t);
    const rot = Math.atan2(-p.tz, p.tx);
    const deck = new THREE.Mesh(platformGeo, platformMat);
    // rotation.y = rot maps local +Z (the 30 m axis) onto the riverward
    // normal, so pushing the center riverward tips the outer half over the
    // water. Deck top at y 1.05: one step up from the slab (0.75), bottom at
    // 0.05 so the overhanging half reads as a pier founded in the water.
    deck.position.set(
      p.x + Math.sin(rot) * PLATFORM_PUSH,
      0.55,
      p.z + Math.cos(rot) * PLATFORM_PUSH,
    );
    deck.rotation.y = rot;
    deck.castShadow = true; // lane rule: only walkway slabs + platforms cast
    deck.receiveShadow = true;
    root.add(deck);

    const torusMat = new THREE.MeshBasicMaterial({
      color: FLOW.data.clone(), // 半透明青: semi-transparent cyan railing halo
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      fog: true,
    });
    breathMats.push({ mat: torusMat, base: 0.45, phase: rng() * Math.PI * 2 });
    const halo = new THREE.Mesh(torusGeo, torusMat);
    halo.rotation.x = Math.PI / 2; // ring flat in the deck plane
    // Elliptical halo: 42 x 32 (deck 40 x 30 + 1 m margin) from the radius-24
    // torus, so the rail ring hugs the deck outline.
    halo.scale.set((PLATFORM_W + 2) / (2 * TORUS_R), (PLATFORM_D + 2) / (2 * TORUS_R), 1);
    halo.position.set(0, 1.1, 0); // ~0.6 m above the deck top, parented to it
    deck.add(halo);
  }

  function update(dt: number, elapsed: number): void {
    // dt unused on purpose: breathing is a pure function of elapsed, so
    // equal calls stay bit-identical (same idiom as the pedestrians rig).
    void dt;
    for (const b of breathMats) {
      b.mat.opacity = b.base * (1 + BREATH_AMP * Math.sin(elapsed * BREATH_HZ + b.phase));
    }
  }

  return { root, update };
}
