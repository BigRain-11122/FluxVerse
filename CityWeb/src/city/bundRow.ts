import * as THREE from "three";
import { FLOW } from "../palette";
import { mulberry32, DEG } from "../util";

// ============================================================================
// Bund heritage row — wave 3 lane H (MEDIA-district skyline backdrop).
//
// The 外滩万国建筑博览群 (the Bund's "museum of world architecture") recast
// as a silicon-city river wall: 23 historic stone facades standing in one
// rank along local +X, every facade looking at the river (local +Z). The
// rank is the MEDIA district's horizon silhouette, so all glow on it wears
// FLOW.traffic magenta — the media functional colour of the five-colour law.
//
// What lands in the scene:
//   * 23 stone bodies (w 20–28 m, h 30–60 m, 22 m deep, colour 0x3a3040),
//     bays at ≈34.5 m centres covering the full −380…+380 m envelope;
//   * 5 facades crowned with stone attics + square-pyramid spires, so the
//     skyline reads as the real Bund's crowned masses instead of a flat comb;
//   * facade #13 = the Customs House clock tower: a fixed 68 m body with
//     four shared-geometry clock faces whose hands are driven straight from
//     `elapsed` at real clock rates (minute 6°/min, hour 0.5°/min);
//   * a magenta cornice light ring (女儿墙) breathing on every roofline;
//   * 2 additive half-torus arch lights per facade (46 in total) forming the
//     street arcade light band along the river front.
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

// ---- row layout (module constants) -----------------------------------------
const N = 23; // the real Bund reads as 23 historic masses from the river
const CLOCK_IDX = 12; // 0-based: facade #13 = 海关大楼 Customs House clock tower
// Five tower-crowned facades, hand-scattered so no two crowns neighbour each
// other and none sits on the clock tower (index 12 is reserved for the clock).
const TOWERED = [2, 6, 9, 15, 19];
const X0 = -380; // contracted row envelope, metres
const X1 = 380;
// 23 bays across the full 760 m envelope → 760/22 ≈ 34.5 m centres: the
// nearest even rhythm that fills the contracted span, inside the brief's
// "~33 m" tolerance.
const STEP = (X1 - X0) / (N - 1);
const CLOCK_Y = 60; // dial band on the 68 m tower: 8.5 m dial, clear of the 68 m cornice

// ---- shared geometry (module singletons, allocated once and forever) ------
// One unit box carries every box in this module — bodies, attics, cornice
// strips, clock hands — because they differ only in scale. This is the
// contracted "shared Box + per-mesh scale" pattern: 23 differently
// proportioned facades ride a single BoxGeometry allocation.
const UNIT_BOX = new THREE.BoxGeometry(1, 1, 1);
// Arcade arch: Torus(4, 0.4, 8, 16, PI) exactly as contracted. A torus arc
// of π lives in the XY plane as the UPPER semicircle, so it is already a
// vertical half-arch facing +Z — position it and it stands on its spring
// line with zero rotation.
const ARCH_GEO = new THREE.TorusGeometry(4, 0.4, 8, 16, Math.PI);
// Clock dial plate: Cylinder(6, 6, 3, 4) exactly as contracted. A 4-gon
// section is a diamond by default; baking one 45° spin at geometry level
// turns it into an axis-aligned square (edge 6·√2 ≈ 8.49 m) that mounts
// flush and square on the tower walls. All four faces share this one plate.
const CLOCK_PLATE_GEO = new THREE.CylinderGeometry(6, 6, 3, 4);
CLOCK_PLATE_GEO.rotateY(Math.PI / 4);
// Square-pyramid spire: unit 4-gon cone with the contracted 18 m height; a
// per-tower XZ scale of w·0.3 reproduces Cone(w·0.3, 18, 4) exactly.
const SPIRE_GEO = new THREE.ConeGeometry(1, 18, 4);

// ---- material budget: 5 materials for the whole rank ----------------------
const stoneMat = new THREE.MeshStandardMaterial({
  color: 0x3a3040, // contracted Bund stone — the historic silhouette colour
  roughness: 0.88, // weathered granite: no specular bling on a backdrop row
  metalness: 0.08,
});
const parapetMat = new THREE.MeshBasicMaterial({
  color: FLOW.traffic, // media magenta per the five-colour law
  transparent: true,
  opacity: 0.35, // contracted faint cornice glow; update() breathes around it
});
const archMat = new THREE.MeshBasicMaterial({
  color: FLOW.traffic.clone().multiplyScalar(1.25), // slight HDR push for additive + bloom
  transparent: true,
  opacity: 0.45, // contracted
  blending: THREE.AdditiveBlending,
  depthWrite: false, // additive light bands never write depth (sorting artefacts)
});
const plateMat = new THREE.MeshBasicMaterial({ color: 0xf7f3e8 }); // lit ivory dial — the real clock is floodlit at night
const handMat = new THREE.MeshBasicMaterial({ color: 0x241d2b }); // contracted dark hands, always legible on the ivory dial

// One clock hand: shared unit box scaled to (thick, len, 0.35), offset so the
// pivot sits at the hand's tail = the dial centre; rotating the returned pivot
// about its local Z sweeps the hand around the face.
function clockHand(face: THREE.Object3D, len: number, thick: number): THREE.Group {
  const pivot = new THREE.Group();
  pivot.position.z = 2.7; // proud of the plate's front surface at local z = 2.5
  const bar = new THREE.Mesh(UNIT_BOX, handMat);
  bar.scale.set(thick, len, 0.35);
  bar.position.y = len / 2;
  pivot.add(bar);
  face.add(pivot);
  return pivot;
}

export function buildBundRow(): BundRowRig {
  const root = new THREE.Group();
  root.name = "bundRow";
  const rng = mulberry32(5321); // contracted seed → the same row every reload

  const minutePivots: THREE.Group[] = [];
  const hourPivots: THREE.Group[] = [];

  for (let i = 0; i < N; i++) {
    const x = X0 + i * STEP;
    const w = 20 + rng() * 8; // contracted 20–28 m facade width
    // Facade #13 keeps its contracted fixed height of 68 m and skips the h
    // draw — the landmark is exempt from the 30–60 m band and the rng stream
    // stays a simple, reviewable sequence (23 w draws + 22 h draws).
    const h = i === CLOCK_IDX ? 68 : 30 + rng() * 30;

    // --- historic stone body: shared unit box scaled to (w, h, 22) ---
    const body = new THREE.Mesh(UNIT_BOX, stoneMat);
    body.scale.set(w, h, 22);
    body.position.set(x, h / 2, 0);
    body.castShadow = true; // shadow policy: only the stone 楼体 casts
    root.add(body);

    // --- cornice light ring (女儿墙): 4 thin strips capping the roofline ---
    // The ±X strips overshoot by the strip width so each corner is covered
    // exactly once — no double-bright corner where strips would overlap.
    for (const sz of [-1, 1]) {
      const strip = new THREE.Mesh(UNIT_BOX, parapetMat);
      strip.scale.set(w + 0.5, 0.55, 0.5);
      strip.position.set(x, h + 0.25, sz * 11);
      root.add(strip);
    }
    for (const sx of [-1, 1]) {
      const strip = new THREE.Mesh(UNIT_BOX, parapetMat);
      strip.scale.set(0.5, 0.55, 21.5);
      strip.position.set(x + (sx * w) / 2, h + 0.25, 0);
      root.add(strip);
    }

    // --- street arcade: 2 half-arch lights per facade on the river front ---
    for (const off of [-(w * 0.25), w * 0.25]) {
      const arch = new THREE.Mesh(ARCH_GEO, archMat);
      // The torus arc already stands vertical facing +Z; y = 6 is the
      // contracted spring line (feet at 6 m, crown at 10 m), and z rides
      // 0.1 m into the wall so the glow reads surface-mounted, not floating.
      arch.position.set(x + off, 6, 11.3);
      root.add(arch);
    }

    // --- crowned facades: stone attic + square-pyramid spire ---
    if (TOWERED.includes(i)) {
      const attic = new THREE.Mesh(UNIT_BOX, stoneMat);
      attic.scale.set(w * 0.4, 25, 16); // contracted attic box
      attic.position.set(x, h + 12.5, 0);
      attic.castShadow = true; // part of the stone mass
      root.add(attic);

      const spire = new THREE.Mesh(SPIRE_GEO, stoneMat);
      spire.scale.set(w * 0.3, 1, w * 0.3); // contracted Cone(w·0.3, 18, 4)
      spire.rotation.y = Math.PI / 4; // diamond → axis-aligned pyramid over the attic
      spire.position.set(x, h + 25 + 9, 0);
      root.add(spire); // ornament cap: no shadow (house rule for thin tops)
    }

    // --- Customs House clock: four faces on facade #13 ---
    if (i === CLOCK_IDX) {
      // One face per wall. Each face group only yaws (never mirrors), so the
      // same local hand rotation reads clockwise from outside every wall.
      const faces: Array<{ yaw: number; wx: number; wz: number }> = [
        { yaw: 0, wx: 0, wz: 11 }, // river front (+Z)
        { yaw: Math.PI / 2, wx: w / 2, wz: 0 }, // east (+X)
        { yaw: Math.PI, wx: 0, wz: -11 }, // land back (−Z)
        { yaw: -Math.PI / 2, wx: -(w / 2), wz: 0 }, // west (−X)
      ];
      for (const f of faces) {
        const face = new THREE.Group();
        face.position.set(x + f.wx, CLOCK_Y, f.wz);
        face.rotation.y = f.yaw; // local +Z of the group = outward wall normal
        root.add(face);

        const plate = new THREE.Mesh(CLOCK_PLATE_GEO, plateMat);
        plate.rotation.x = Math.PI / 2; // cylinder axis (local Y) → wall normal (local Z)
        plate.position.z = 1.0; // 0.5 m embedded, 2.5 m proud of the wall
        face.add(plate);

        minutePivots.push(clockHand(face, 4.8, 0.45)); // slim, reaches near the dial edge
        hourPivots.push(clockHand(face, 3.2, 0.6)); // chunkier — the classic proportions
      }
    }
  }

  const update = (_dt: number, elapsed: number): void => {
    // Cornice breathing: one shared material drives all 92 strips — a slow
    // whole-rank swell around the contracted 0.35 mean, zero per-mesh state
    // and zero allocations per frame.
    const breath = 0.5 + 0.5 * Math.sin(elapsed * 1.3);
    parapetMat.opacity = 0.26 + breath * 0.18;

    // Clock hands at real clock angular rates, computed straight from
    // `elapsed` each frame (contracted: never accumulate — a hitch or a
    // pause therefore cannot drift the dial). Minute: 6°/min = 0.1°/s;
    // hour: 0.5°/min = 0.0083°/s. Negative local-Z rotation = clockwise as
    // seen from outside the face; the face groups are yawed, never mirrored,
    // so all four dials agree. Both hands start at 12:00 when elapsed = 0.
    const minuteAngle = -elapsed * 0.1 * DEG;
    const hourAngle = -elapsed * 0.0083 * DEG;
    for (const p of minutePivots) p.rotation.z = minuteAngle;
    for (const p of hourPivots) p.rotation.z = hourAngle;
  };

  return { root, update };
}
