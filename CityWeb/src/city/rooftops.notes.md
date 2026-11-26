# rooftops.notes — 波次 2 泳道 B（楼顶天线批，项目 ROOFTOP_OFFICE_RE）

New file: `CityWeb/src/city/rooftops.ts` (isolated lane; no existing files touched).

## Module contract (verbatim, for wiring)
```ts
export interface RooftopsRig {
  root: THREE.Group;
  update: (dt: number, elapsed: number) => void;
}
export function buildRooftops(): RooftopsRig
```

## What it draws
- **16 rooftop antennas = exactly 2 InstancedMeshes (2 draw calls)**
  - Mast batch: shared `CylinderGeometry(0.4, 0.9, 26, 6)` (translate y+13 → base at instance origin), `MeshStandardMaterial` deep grey `0x1c2836`.
  - Beacon batch: shared `SphereGeometry(1.1, 8, 6)` at each mast tip, `MeshBasicMaterial` red `0xff4444`.
- **B5 女儿墙延后** — flat-roof parapets are deferred; this wave's geometry budget stays reserved for the reflection wave.

## Coordinate table source (hardcoded, zero runtime projection)
Landmark rows project the `realCity.ts` LANDMARKS lat/lon through the same
equirectangular constants as `geo/projection.ts` (origin 31.2430 N / 121.4950 E);
the ten tower rows are ring centroids of the 200 m+ Lujiazui entries in
`data/shanghai-buildings.json` (region=lujiazui, h ≥ 200, excluding the three
landmark footprints already replaced by procedural rigs — exactly ten exist:
259.9/256/249.9/238/238/230/216/216/210/200). All values were computed offline
with node, each centroid verified point-in-polygon inside its own roof, and all
16 spots checked against every other footprint (no overlaps; landmark slots sit
in clean air).

## Judgment calls (flagged honestly)
- **SWFC +11 m off centre** (1110.3 vs slot 1099.3): the rig already owns a
  white beacon at the cap-beam centre (y 493.2); the offset keeps the red
  aviation beacon visually distinct while still standing on the 492 m cap beam
  (beam spans local x ±15, rig yaw 0).
- **White Magnolia base 295, not 320**: the rig's petals flare OUTWARD from
  y≈271 to tips ≈314–320 at radius ~30 m; a 320 m centre base would float ~25 m
  above the crown heart (top ≈295 at pulse scale). Mast tip + beacon land at
  321 ≈ the petal crown. The brief's "320" is the tower top, and the beacon
  does top out there.
- **Waibaidu (bridge) = 6th landmark slot**: mounted on the TALLER north portal
  (bridge rig's own `mulberry32(21204)` first two draws give posts 18.34 m /
  18.66 m; the taller portal's beam top = 27.66 m). Local (+51.5, 0) under the
  rig's π/2 yaw maps to world (0, −51.5). Reads as a creek-mouth gate signal
  mast; the 16-count keeps the brief's "六地标 + 十座 200m+".
- **Shanghai Tower 632**: crown halo top = 632; the pole threads the ring's
  open centre 2 m above the solid core top (630).
- **Jinmao 420.5**: grounded on the gold tip ball (centre 419.2, r 1.5 × scale
  0.9–1.2 → top 420.55–421.0) — sits on it at every breathe phase.
- **mulberry32(20711) NOT used**: the table is hand-baked and the masts are
  standardized hardware (aviation masts are engineered, not random) — the
  brief's "（若用）" branch. No runtime randomness anywhere in this module.
- Beacon red is the spec-pinned aviation red (0xff4444 / setRGB 1.6,0.3,0.3),
  deliberately NOT FLOW.warn: an obstruction light is a real-world signal
  colour, brighter than the functional-flow red.

## update() behaviour
- Double flash, elapsed-driven: `Math.sin((elapsed / 0.6) * Math.PI * 4) > 0`
  → two 0.15 s pulses per 0.6 s interval.
- Colour switch: `setRGB(1.6, 0.3, 0.3)` lit / `setRGB(0.3, 0.05, 0.05)` dark
  (linear HDR red; ACES tone mapping + UnrealBloomPass threshold 0.55 turn it
  into a hot point).
- `dt` reserved for future wiring (house rule, cf. pearl landmark).

## Wiring hint (coordinator — NOT done here, existing files are untouchable)
```ts
import { buildRooftops } from "./city/rooftops";
const rooftops = buildRooftops();
scene.add(rooftops.root);
// in animate(): rooftops.update(dt, elapsed);
```

## Performance
- 2 draw calls, 2 shared geometries (6-gon cylinder + low-poly sphere),
  2 materials; instance matrices written once (StaticDrawUsage default);
  `frustumCulled = false` (city-scale batch); no shadows (0.4–0.9 m poles are
  sub-pixel on the 2048 city shadow map).
