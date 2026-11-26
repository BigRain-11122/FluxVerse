# riverReflection — wave 2 lane C notes

D3 rule card: 江面反射 = 天际线第二层构图；预算 512–1024px，只反射 T1 塔+灯光层，禁整城反射。

## What this is

- **Fake "mirrored light band" reflection** — no `THREE.Reflector`, no second render pass.
- 120 vertical additive strips (60 per bank) standing on the water 30–80m in from each bank,
  colored by the nearest district flow color:
  - east / Lujiazui bank = gold `0xfbbf24` (FLOW.capital),
  - west bank south of lat 31.2445 (Suzhou Creek / Waibaidu line) = Bund magenta `0xf472b6` (FLOW.traffic),
  - west bank north of the split = North Bund cyan `0x5eead4` (FLOW.data).
- Cost: **1 shared PlaneGeometry(3.2, 14) + 3 MeshBasicMaterial + 3 draw calls**
  (3 `InstancedMesh`, one per color segment, 120 instances total: 60 gold east bank,
  30 magenta + 30 cyan west bank — split at lat 31.2445).

## Design decisions (why)

- **InstancedMesh instead of 120 Mesh objects.** The spec fixes 3 shared materials (by color
  segment) AND per-strip brightness 0.10–0.22 AND per-strip opacity breathing with random phase.
  Per-strip `material.opacity` is impossible with 3 shared materials; per-instance
  `instanceColor` is the three.js answer. Under `AdditiveBlending` a color scale is
  mathematically identical to an opacity scale (contribution = rgb × a), so instanceColor IS
  the per-strip opacity — and it is also strictly cheaper (3 draw calls vs 120).
- **One breathing frequency (0.9 rad/s) + random phase** — a single shimmer traveling along the
  shore instead of mechanical lockstep.
- **Inner-corner clamp at the L-bend** — a parallel offset placed near the bend joint (Lujiazui
  tip) sits closer to the *adjacent* river segment than to its own, which would push one strip
  ~90m off the bank instead of ≤80m. Each strip is checked against the whole polyline and
  pushed back out to the band's inner edge (≥150m off the centerline), so the 30–80m bank
  inset holds everywhere. Verified headlessly: all 120 strips are 149.5–200.5m off the
  centerline, y=0.6, tilt within ±0.06 rad, brightness 0.10–0.22.
- **`renderOrder = 2`** — realCity's water ribbon is `renderOrder = 1`; the bands composite
  additively on top of the ribbon. The original water shader is untouched.
- **`STRIP_GEO` pre-translated +7 in Y** — the geometry origin sits at the strip's foot, so
  instance `y = 0.6` anchors the foot exactly on the water and the strip rises 14m.
- **`RIVER_CENTERLINE` / `RIVER_HALF_W` duplicated verbatim** from `realCity.ts` (private
  consts there; lane C is forbidden to edit existing files). Keep the two copies in sync if the
  trace is ever re-traced.
- All randomness from `mulberry32(31415)` — deterministic, same city on every reload.

## Integration (coordinator / main.ts)

```ts
import { buildRiverReflection } from "./geo/riverReflection";

const reflection = buildRiverReflection();
scene.add(reflection.root);
// in the frame loop, next to the other rigs:
reflection.update(dt, elapsed);
```

No other wiring needed. Verified with `npx tsc --noEmit` (zero errors) in
`_wt-w2-c/CityWeb`.
