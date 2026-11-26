# pedestrians.ts — design notes (swarm lane A)

Macro street-crowd projection for the three districts. `buildPedestrians(plan, data)`
returns `{ root, update(dt, elapsed, hour) }` exactly per the module contract.

## Core decisions

- **Fixed pool, matrix-scale hiding.** One `InstancedMesh` of 360 capsules,
  `mesh.count` is never touched. Surplus walkers get a cached zero-scale
  matrix (`makeScale(0,0,0)`); visibility is therefore purely an
  instance-matrix concern and the pool can never fragment.
- **Contiguous per-district blocks.** District assignment is
  `floor(i * districts.length / COUNT)` (uniform take, exact 120/120/120 for
  the current plan). Contiguity makes "hide the surplus" a prefix cut, and
  per-district target `round(count * hourGain * activity)` thins low-activity
  districts independently.
- **Pure function of elapsed.** `angle = phase + omega * elapsed` (no dt
  accumulation), so two builds driven with the same `(elapsed, hour)` calls
  produce bit-identical instance matrices. All randomness is
  `mulberry32(20261126)` consumed in a fixed order at build time.
- **Unsigned omega 0.08–0.2 rad/s.** Spec-literal angular speed; the random
  spread across walkers is the differential speed (overtaking on shared
  rings). Matches the unidirectional plaza patrol already used by robots.ts.
- **Zero-init matrices.** All instances start hidden; the first
  `update(hour)` reveals the correct density, so nothing pops in at a wrong
  hour before the first tick.
- **Performance.** Single draw call, shared dark `MeshStandardMaterial`
  (0x26374f, roughness 0.8, no emissive), `castShadow` off,
  `DynamicDrawUsage`, `frustumCulled = false` (instances move across the
  whole city each frame, a stale bounding sphere would miscull).

## Hour gain table

| band | gain |
| --- | --- |
| 07–09, 17–19 (rush) | 1.0 |
| 09–17 (workday) | 0.55 |
| 19–21 (dusk) | 0.35 |
| else (late night) | 0.04 |

Zone activity comes from `data.zones` matched by district id, default 0.5.
