# landmarks-pearl-jinmao.ts — wiring notes for the coordinator (泳道 A)

## Contract (verbatim)

```ts
import { buildOrientalPearl, buildJinmao, type LandmarkRig } from "./city/landmarks-pearl-jinmao";

const rig: LandmarkRig = buildOrientalPearl(); // or buildJinmao()
scene.add(rig.root);        // local origin, ground y=0, north = -Z
rig.update(dt, elapsed);    // once per frame; elapsed in seconds (dt reserved)
```

- `rig.root` is a plain `THREE.Group` — coordinator owns position/rotation/scale.
- Both builders are pure: fresh materials per call (so each instance pulses
  independently); heavy geometries are module-level singletons shared across calls.

## Oriental Pearl — key dimensions (1 unit = 1 m, total height 468)

| Part | Spec |
|---|---|
| 3 legs | 30° inward lean, foot circle r=66 m, tops converge y=110 (r=2.5), Ø9→7.2 m taper |
| tie beams | concrete tubes at y=72 (Ø3 m), bracing legs under the lower sphere |
| lower sphere | Ø50 m, center y=98 (span 73–123) |
| upper sphere | Ø45 m, center y=267 (span 244.5–289.5) |
| space capsule | Ø16 m, center y=344 (span 336–352) |
| core column | Ø6 m, y 95→352, 8 metal fins + 8 cyan seams |
| antenna | Ø1.8→0.28 mast, y 352→468, tip beacon at 468 |

- Footprint: leg pads on r=66 circle → needs clear radius ~70 m.
- Glow: cyan rings (FLOW.data ×1.4, additive) on all three spheres, breathing;
  brain-blue mast with aviation double-blink tip.
- Shadow casters: legs, spheres, core only.

## Jinmao — key dimensions (total height ≈420.5, 88 floors)

| Part | Spec |
|---|---|
| podium | 68×68×26 m box |
| body | 8 setback segments × 42.5 m → top of body y=340; widths 58 m × 0.94^i |
| crown | 5 petal tiers, y 340→~398 (8 petals each, radius 17→6.1, flare 24°→8°) |
| spire | gold rod y 397→419.5, tip sphere at 419.2 (top ≈420.5) |
| corner ridges | capital-gold (×1.35, additive) 4 corner strips per segment bridging
  each setback, plus 4 converging rods body-top→spire (线走通到顶) |

- Footprint: 68×68 m.
- Glow: gold corner ridges + tier rings + spire; crown tip breathes
  (color + scale). Shadow casters: segments + podium only.

## Verification

- `npx tsc --noEmit` in `CityWeb/` → zero errors (strict).
