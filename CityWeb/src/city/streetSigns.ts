import * as THREE from "three";
import { Text } from "troika-three-text";
import { mulberry32, clamp } from "../util";
import { FLOW } from "../palette";
import type { CityPlan } from "./layout";

// ============================================================================
// Street signs layer — wave 5 lane C: Latin/numeric SDF signage on the ring
// streets (换轮子调研卡 · 文字双轨的拉丁/数字轨). Rendered with
// troika-three-text SDF glyphs; CJK signage stays on the canvas-texture
// track, so the two wheels never fight over the same pixels.
//
// Module contract, wired verbatim by the coordinator:
//   export interface StreetSignsRig { root; update(dt, elapsed) }
//   export function buildStreetSigns(plan: CityPlan): StreetSignsRig
//
// What lands in the scene, per plan.districts entry (everything is placed
// district-relative, so the module serves both the legacy 120-degree
// layout and the real-geography realCity plan):
//   6 Latin sign boards — one troika Text (default font, fontSize 4..7 m,
//   white / warm white, outlineWidth 0.12 m) over a shared dark
//   translucent backing board (PlaneGeometry(标牌宽+1, 高+1)). Boards hang
//   upright on the district ring street: radius 90..300 m, y 8..20 m,
//   board normal facing the district centre (朝街心), so the text reads
//   from the plaza and from the artery.
//
// Runtime notes (verified against troika-three-text 0.54 dist):
//   - Text extends THREE.Mesh at runtime; its default material is a
//     transparent MeshBasicMaterial derived per instance, so a plain
//     material.opacity write is live (three syncs the basic shader's
//     opacity uniform) — no shader work needed for the breathing.
//   - With outlineWidth > 0 the material getter returns the
//     multi-material pair [outline, fill]; update() collects and breathes
//     both layers.
//   - First sync() walks the typr worker; under file:// troika falls back
//     to the main thread automatically (research card verified) — no
//     offline branch needed here. Default font, default flow.
//
// Units: 1 unit = 1 m, y up, ground contact at y = 0 (house convention).
// Determinism: one mulberry32(3344) seeded per build => the same sign
// field on every reload, same discipline as layout.ts / blockDetails.ts.
// ============================================================================

export interface StreetSignsRig {
  root: THREE.Group;
  update: (dt: number, elapsed: number) => void;
}

// ---- content pool: the mandated six plus matching Latin/numeric extras ----
const SIGN_TEXT_POOL: ReadonlyArray<string> = [
  "LUJIAZUI FINANCE",
  "NORTH BUND",
  "THE BUND",
  "STATION 2",
  "METRO LINE 2",
  "FLUX DISTRICT",
  "PUDONG AVE",
  "GATE 7",
  "FLUX LOOP 12",
  "TRANSIT HUB 4",
];

// ---- spec constants ----
const SEED = 3344;
const SIGNS_PER_DISTRICT = 6;
const RING_R_MIN = 90; // street-ring band, m, district-relative
const RING_R_MAX = 300;
const SIGN_Y_MIN = 8; // hang-height band, m
const SIGN_Y_MAX = 20;
const FONT_SIZE_MIN = 4; // m
const FONT_SIZE_MAX = 7;
const OUTLINE_W = 0.12; // m, spec-exact
const SIGN_W = 40; // board design width, m — the widest pool line at the
// minimum 4 m font ("LUJIAZUI FINANCE" ≈ 33 m of real Roboto advances)
// clears it with margin.
const SIGN_H = 9; // board design height, m — fits one 7 m line incl. ascender
const GLYPH_EM = 0.62; // conservative mean advance per pool glyph (em):
// Roboto caps/digits/spaces average ≈ 0.55..0.61, so estimates overshoot.
const ANGLE_JITTER = 0.3; // rad of ring-spacing sway per board
const RADIUS_JITTER = 28; // m of ring-radius sway per board (±14)

// ---- shared backing board (module-level, allocated once, forever) ----
// Spec: 牌后衬底 = 共享 PlaneGeometry(标牌宽+1, 高+1) + 深色半透明
// MeshBasicMaterial. One geometry + one material for every sign in the city.
const BACKING_GEO = new THREE.PlaneGeometry(SIGN_W + 1, SIGN_H + 1);
const BACKING_MAT = new THREE.MeshBasicMaterial({
  color: 0x0b1420, // house dark-shell tone (realCity island / bridge deck)
  transparent: true,
  opacity: 0.6,
  side: THREE.DoubleSide, // readable from behind the ring too
  depthWrite: false, // translucent shell house rule (cf. blockDetails glass)
});

// ---- glyph colours: 白 (palette FLOW.ceo pure white) / 暖白 ----
// troika copies the value into a fresh material Color (verified: `colorObj
// .set(color)`), so sharing the palette instance is safe.
const TEXT_COLORS: ReadonlyArray<THREE.Color> = [
  FLOW.ceo,
  new THREE.Color(0xffeecf),
];

// ---- breathing law: ±5% opacity, one field-wide phase ----
const TEXT_OPACITY_BASE = 0.95; // keeps 0.95 ± 0.05 inside [0.90, 1.00]
const BREATH_PERIOD = 8; // seconds per cycle — deliberately slow
const BREATH_AMP = 0.05; // ±5%, spec-exact

export function buildStreetSigns(plan: CityPlan): StreetSignsRig {
  const root = new THREE.Group();
  root.name = "streetSigns";
  const rng = mulberry32(SEED);

  // Every troika material layer of every sign (outline + fill), collected
  // once here so update() never re-reads the getter per frame.
  const textMats: THREE.MeshBasicMaterial[] = [];

  plan.districts.forEach((d, di) => {
    // One ring per district: base radius 104..286, so the ±14 m sway of
    // the six boards keeps the whole field inside the 90..300 m band.
    const ringR = RING_R_MIN + 14 + rng() * (RING_R_MAX - RING_R_MIN - 28);
    const phase = rng() * Math.PI * 2;

    for (let si = 0; si < SIGNS_PER_DISTRICT; si++) {
      // Pool rotation by district: 6 distinct strings per district,
      // neighbouring districts shifted through the pool.
      const str = SIGN_TEXT_POOL[(di * SIGNS_PER_DISTRICT + si) % SIGN_TEXT_POOL.length];
      const a = phase + (si / SIGNS_PER_DISTRICT) * Math.PI * 2 + (rng() - 0.5) * ANGLE_JITTER;
      const r = ringR + (rng() - 0.5) * RADIUS_JITTER;
      const y = SIGN_Y_MIN + rng() * (SIGN_Y_MAX - SIGN_Y_MIN);

      const holder = new THREE.Group();
      holder.position.set(d.cx + Math.cos(a) * r, y, d.cz + Math.sin(a) * r);
      // Non-camera lookAt points local +Z (board normal / troika text
      // front) at the district centre; the target rides the board's own y
      // so the hang stays yaw-only upright.
      holder.lookAt(d.cx, y, d.cz);
      root.add(holder);

      // Backing board behind the glyphs: shared geometry + shared
      // material, one mesh per sign, 0.4 m behind the text plane, drawn
      // before the glyphs.
      const board = new THREE.Mesh(BACKING_GEO, BACKING_MAT);
      board.position.z = -0.4;
      board.renderOrder = 1;
      holder.add(board);

      // SDF glyph plane. Font size fits the fixed board: the fit estimate
      // uses the conservative GLYPH_EM, and a ≤5% deterministic shrink
      // keeps even the tightest line clear of the maxWidth wrap guard.
      const label = new Text();
      label.text = str;
      const fit = (SIGN_W - 6) / (GLYPH_EM * str.length);
      const shrink = 0.95 + rng() * 0.05;
      label.fontSize = Math.max(FONT_SIZE_MIN, clamp(fit, FONT_SIZE_MIN, FONT_SIZE_MAX) * shrink);
      label.color = rng() < 0.55 ? TEXT_COLORS[0] : TEXT_COLORS[1];
      label.outlineWidth = OUTLINE_W;
      label.maxWidth = SIGN_W - 4; // wrap guard, never reached by the pool
      label.anchorX = "center";
      label.anchorY = "middle";
      label.frustumCulled = false; // empty bounds until the first async sync
      label.renderOrder = 2; // glyphs after the backing board
      holder.add(label);
      label.sync();

      // outlineWidth > 0 => the getter returns [outline, fill]; keep both.
      const m = label.material;
      if (Array.isArray(m)) {
        textMats.push(...m);
      } else {
        textMats.push(m);
      }
    }
  });

  const update = (dt: number, elapsed: number): void => {
    // Sign text slow-breathes ±5% opacity around a 0.95 base: troika's
    // materials are transparent MeshBasicMaterial-derived, so a plain
    // opacity write reaches the basic shader's opacity uniform. One
    // field-wide phase (same "whole grid pulses together" rationale as
    // the blockDetails lamp field). Allocation-free in-place writes.
    const breath = 1 + BREATH_AMP * Math.sin((elapsed / BREATH_PERIOD) * Math.PI * 2);
    for (const m of textMats) m.opacity = TEXT_OPACITY_BASE * breath;
    // dt stays free for future wiring (house rule, cf. blockDetails.ts).
  };

  return { root, update };
}
