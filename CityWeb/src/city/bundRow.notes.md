# bundRow.notes.md — wave 3 lane H implementation notes

## Contract
- `buildBundRow(): BundRowRig` — `{ root: THREE.Group; update(dt, elapsed) }`.
- Local frame: row along local X, facades face +Z (river). Units = metres.
- Envelope: x −380…+380, ground y = 0. Coordinator owns world placement + yaw.
- Determinism: `mulberry32(5321)`; draw order = 23× w (20–28), 22× h (30–60);
  facade #13 (index 12) skips the h draw and is fixed at 68 m.

## Layout decision (spacing)
23 bays across the full contracted ±380 m envelope → 760/22 ≈ 34.5 m centres.
The x-range is stated without a tolerance in the brief, the spacing with "~",
so the full span wins and 34.5 m sits inside the "~33 m" tolerance.

## Facade population
- 23 stone bodies: shared `BoxGeometry(1,1,1)` scaled to (w, h, 22), colour 0x3a3040.
- Tower-crowned indices (0-based): 2, 6, 9, 15, 19 — scattered, none adjacent,
  none on the clock tower. Attic Box(w·0.4, 25, 16) + spire = shared
  `ConeGeometry(1,18,4)` scaled (w·0.3, 1, w·0.3) ≡ contracted Cone(w·0.3, 18, 4),
  yawed 45° so the pyramid faces align with the attic.
- Cornice light (女儿墙): 4 thin strips per roofline, shared material
  (FLOW.traffic, opacity 0.35). X-strips overshoot by one strip width so
  corners are covered exactly once (no overlap hot-spot). Breathing in
  update(): opacity 0.26…0.44 around the 0.35 mean.
- Arcade: 2 half-torus arches per facade (46 total) at x = ±w·0.25, spring
  line y = 6, tube 0.1 m into the front wall; additive magenta, opacity 0.45,
  depthWrite false.

## Clock tower (facade #13, Customs House)
- Body fixed 68 m (exempt from the 30–60 band), same stone material.
- Dial: shared `CylinderGeometry(6,6,3,4)`, geometry pre-spun 45° →
  axis-aligned 8.49 m square plate, one mesh per wall (4 total), centred at
  y = 60 (clear of the 68 m cornice ring).
- Hands: two per face (8 total) — shared unit box scaled (0.45, 4.8, 0.35)
  minute / (0.6, 3.2, 0.35) hour, each on a pivot at the dial centre.
- update() sets pivot rotation straight from `elapsed` (no accumulation):
  minute 0.1°/s (6°/min), hour 0.0083°/s (0.5°/min). Negative local-Z
  rotation = clockwise from outside; face groups are yawed (never mirrored),
  so all four dials turn clockwise. Hands start at 12:00 at elapsed = 0.

## Shadow policy (castShadow only on 楼体)
Shadow casters = the 23 stone bodies + the 5 stone attics (structural stone
mass). Spires, cornice strips, arch lights, dial plates and hands never cast
(house rule: big structural pieces only).

## Budget
4 geometries (unit box, arch torus, dial cylinder, unit cone), 5 materials,
≈183 meshes, 13 groups. All animated state lives in shared materials /
pivot rotations → allocation-free per frame. `dt` is intentionally unused
(clock and breath are pure functions of `elapsed`).
