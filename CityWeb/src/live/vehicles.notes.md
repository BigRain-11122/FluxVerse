# vehicles.ts — design notes (bridge traffic lane A)

Ambient bridge traffic under C3 corridor discipline. `buildVehicles(plan)`
returns `{ root, update(dt, elapsed, hour) }` exactly per the module contract.
Real roads are not built yet, so the light bridges (plan.arteries, district
end x1/z1 -> island end x0/z0) are the only road network — no scatter.

## Core decisions

- **Two InstancedMeshes, 300 instances each.** Body = shared module-level
  `BoxGeometry(8, 2.2, 4)` truck silhouette; front light bar = shared
  `BoxGeometry(2.5, 0.5, 3.5)` + one `MeshBasicMaterial` (0xfff2c0,
  unlit = glowing). The bar matrix is `bodyMatrix * HEAD_LOCAL` (local
  translation 2.8/0.35/0), so it is glued 0.05m proud of the nose for both
  travel directions with zero extra per-car state.
- **Corridor-bound instances.** Each car gets one artery for life; position
  is `from + dir * t * len` with `t = progress` (forward, district->island)
  or `t = 1 - progress` (reverse, island->district), wrapping `progress % 1`
  at the endpoints. Speed is a pure hour tier: rush 60 m/s / density 1.0
  (7–9, 17–19), workday 45 / 0.6 (9–17), late night 30 / 0.08 (else).
  Constant speed inside a tier — L0 look, no acceleration curves.
- **Bidirectional stagger.** Direction alternates inside each lane's
  contiguous instance block (half forward, half reverse). Reverse instances
  rotate 180° in Y and sit 5m off the forward lane (perpendicular offset),
  so the two flows never overlap on the 26m deck.
- **Prefix-cut density hiding.** Lanes own contiguous instance blocks
  (uniform take, pedestrians.ts discipline); per-lane
  `target = round(count * density)` and the surplus gets a cached zero-scale
  matrix — `mesh.count` is never touched, the pool can never fragment.
  Hidden cars still advance their progress so a density step-up reveals
  cars already mid-flow.
- **Zero-init matrices.** All instances start hidden; the first
  `update(hour)` reveals the correct density.
- **Dark zone paints via instanceColor.** One white `MeshStandardMaterial`
  (roughness 0.55, metalness 0.35); per-instance hex:
  gaming 0x1a3a35 / quant 0x3a321a / media 0x3a1a2e (FLOW hues shadowed to
  deep lacquer — bright cars would outshine the window grid), unknown
  district falls back to 0x1c222b.
- **Deck height.** realCity bridge deck top = 7.9 (Box(len,1.8,26) at
  y=7); body center 9.05 (0.05 anti-z-fight clearance), light bar 9.4.
- **Performance.** Two draw calls total, `DynamicDrawUsage`,
  `frustumCulled = false` (instances span all bridges every frame — a stale
  geometry bounding sphere would miscull), `castShadow` off.
- **Determinism.** All randomness is `mulberry32(774411)` consumed in a
  fixed order at build time; motion is dt-accumulated because the speed
  tier follows the hour clock (elapsed is kept only for the shared rig
  signature).

## Integration

Not wired into main.ts by this lane (hard constraint: no existing-file
edits). Suggested wiring for the integrator, next to pedestrians:

```ts
import { buildVehicles } from "./live/vehicles";
const vehicles = buildVehicles(plan);
scene.add(vehicles.root);
// in animate():
vehicles.update(dt, elapsed, daynight.hour());
```
