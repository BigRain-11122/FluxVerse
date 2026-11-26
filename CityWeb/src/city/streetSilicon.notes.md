# streetSilicon.notes — 波次 3 泳道 B（街头硅基装饰层）

New file: `CityWeb/src/city/streetSilicon.ts` (isolated lane; no existing
files touched).

## Module contract (verbatim, for wiring)
```ts
export interface StreetSiliconRig {
  root: THREE.Group;
  update: (dt: number, elapsed: number) => void;
}
export function buildStreetSilicon(plan: CityPlan, data: CityData): StreetSiliconRig
```

## What it draws (all real metres, 1 unit = 1 m, geo/realCity world)
- **Neon sign swarm — 90 boards per district (270 total), 12 InstancedMeshes**
  - Shared `PlaneGeometry(10, 5)`; each instance is rolled 90° (z) into the
    vertical shop-sign silhouette (5 wide × 10 tall).
  - Placement: radius 90–300 m from the district centre (random angle),
    y 6–26 m, plane normal facing the district centre ("朝街心").
  - 4 shared `MeshBasicMaterial`s per district (unlit, `fog: true`,
    `DoubleSide`), colours from the district flow family:
    gaming = 青(FLOW.data)+蓝(FLOW.brain), quant = 金(FLOW.capital)+白
    (FLOW.ceo), media = 品红(FLOW.traffic)+粉(traffic→white lerp 0.45).
  - Micro-tilt: one random magnitude ±0.12 rad per board, split across
    pitch/roll by a random direction (total never exceeds 0.12).
- **Data pylons — 16 per district (48 total)**
  - Shafts: shared `CylinderGeometry(0.5, 0.8, 14, 6)` translated +7
    (instance position = ground anchor), deep-grey `MeshStandardMaterial`
    0x1a232f, **one cross-district InstancedMesh** (48 instances, 1 draw
    call). Random yaw per shaft so the hex facets don't clone-align.
  - Orbs: shared `SphereGeometry(0.9)` at shaft top (centre y 14.6),
    `MeshBasicMaterial` = zone flow colour ×1.5, one InstancedMesh per
    district; per-instance `instanceColor` breathing in groups of three
    (6 groups/district, ~4.8 s cycle, shared group phase).
- **Holo street gates — 2 per district (6 total)**
  - Shared `TorusGeometry(24, 1.6, 8, 40, Math.PI)`; the PI arc stands as
    an arch (feet local ±24, apex 24). `rotation.y = -angle` puts the arch
    plane on the radial direction, so the feet straddle the ring street's
    width ("跨街") and tangential traffic passes through.
  - `MeshBasicMaterial` Additive, flow colour, opacity 0.5, depthWrite off.
  - Apex light column: shared `BoxGeometry(0.8, 12, 0.8)` at local y 30
    (spans 24–36, seats 1.6 m into the apex tube), semi-transparent
    (opacity 0.55) flow colour ×1.6.
- Gate groups sit at y = 1.6 so the tube feet rest exactly on the ground.

## Judgment calls (flagged honestly)
- **"4 色 / 4 materials" read per-district**: the brief names 2 tones per
  district (青+蓝 / 金+白 / 品红+粉) but pins 4 shared MeshBasicMaterials —
  implemented as 4 material colours per district: the two named tones plus
  hot (+40%) twins. The hot pair clears the bloom threshold (UnrealBloomPass
  threshold 0.55 under ACES), so one board in two reads as a big neon while
  the rest read as dim signage.
- **Flicker via instanceColor**: "整批重排亮度" with per-sign random 0.8–2 s
  periods/phases needs per-instance brightness; instanceColor multiplies
  material.color in the fragment (three r187 fragment prefix defines
  USE_COLOR when instancingColor is set), so material.color keeps the
  activity gain (0.5–1.2) while instanceColor carries the flicker.
  270 setXYZ + 3 buffer uploads per frame ≈ 3 KB — negligible.
- **DoubleSide on signs**: boards face the district centre, the overview
  camera sits outside the districts; FrontSide would blank half the neon
  wall from the overview. Real shop signs are double-faced glass anyway.
- **Gate shimmer ±0.04 around the pinned 0.5**: a frozen hologram reads as
  a plastic loop; the gentle sine breath keeps it "光" rather than "贴图".
- **Sign scatter may intersect buildings**: the realCity plan exposes only
  district centroids (plan.buildings is empty for the geo city), so signs
  cannot wall-snap; the spec's radius/y random + silicon aesthetic (CEO:
  "不完全写实") accepts floating/holo boards. DoubleSide keeps them visible
  from both sides.
- **Zone activity is a page-load snapshot** (window.CITY_DATA), so the
  0.5–1.2 gain is resolved once at build and re-applied by update() every
  frame — the literal "update 按 activity 调 material.color" contract.

## update() behaviour
- Signs: `mat.color = family × activityGain` + per-instance flicker factor
  0.72–1.00 (`sin(elapsed × 2π/T + φ)`, T ∈ 0.8–2 s).
- Orbs: group breathing 0.55–1.00 (`sin(elapsed × 1.3 + groupPhase)`).
- Gates: opacity shimmer around the pinned values.
- `dt` reserved for future wiring (house rule, cf. rooftops rig).
- Zero per-frame allocations; `frustumCulled = false` and `castShadow =
  false` on every mesh (street props stay off the 2048 city shadow map).

## Wiring hint (coordinator — NOT done here, existing files are untouchable)
```ts
import { buildStreetSilicon } from "./city/streetSilicon";
const streetSilicon = buildStreetSilicon(real.plan, data); // plan from buildRealCity
scene.add(streetSilicon.root);
// in animate(): streetSilicon.update(dt, elapsed);
```

## Performance
- 28 draw calls total: 12 sign batches + 1 cross-district pylon shaft batch
  + 3 orb batches + 12 gate meshes (6 arch + 6 column).
- 22 materials, 5 shared module-level geometries; instance matrices are
  static (written once at build); only instanceColor buffers (15 × ~1 KB)
  and 9 opacity floats change per frame.
