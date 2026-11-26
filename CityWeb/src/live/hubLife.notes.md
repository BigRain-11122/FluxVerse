# hubLife.ts — wave 4 lane C notes

馆内生命层 (interior life) for the enterable glass halls. This lane was
build-only: enterable.ts and main.ts were NOT touched.

## Wiring (for the integration lane)

```ts
import { buildHubLife } from "./live/hubLife";
// after `const hubs = buildEnterableHubs(plan)`:
const hubLife = buildHubLife(hubs.specs);
scene.add(hubLife.root);
// in animate(), next to pedestrians/vehicles:
hubLife.update(dt, elapsed, daynight.hour());
```

## Contents per hall (real metres)

- 24 figure silhouettes (8 per deck, feet planted on the y=6/14/22 slab
  faces), one shared InstancedMesh pool for all halls; slow 2-5 m radius
  orbits at 0.1-0.25 rad/s, deterministic via mulberry32(7272).
- 12 deck-edge light bands (4 per floor) breathing ±12% around 0xffd9a0,
  brightness level tied to the hall's occupant tier.
- 1 additive cyan (FLOW.data) door carpet 18×10 m at y=0.3 on the spec +Z
  face, opacity 0.25 ± 0.05 breathing.

## Hour density

07:00–22:00 full house (24/hall); 22:00–07:00 deep-night 25% (6/hall).
Surplus instances are hidden via zero-scale; the orbit angle is a pure
function of elapsed, so hidden figures keep advancing their rings.

## Conventions relied on (why it works without yaw)

- Specs are world AABBs with no orientation; main.ts already treats the
  spec +Z face as the entrance side (walk entry spawns at cz + hd + 6), so
  the door carpet anchors to that same face.
- The deck footprint in world axes = spec bounds inset 1.3 m on every side
  (enterable.ts slabs are 56×36 m inside the 29.3/19.3 m interior halves),
  so figure rings and light bands stay on the slabs regardless of yaw snap.
- Figure rings also clear the central 3 m elevator column and the light
  bands (1.8 m edge margin) so nothing clips while walking inside.
