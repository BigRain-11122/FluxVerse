# ambientLife.ts — wave 4 lane A notes

Fixes the two director-review pain points on the dusk cut:
black dusk sky and dead-black far skyline. Read `live/daynight.ts`
(SkyRig + phase system) and `palette.ts` first; this layer only ADDS on
top of the sky and never edits daynight-owned state (fog included —
no second hand on fog, single-owner law).

## What was built

1. **Dusk glow band** — `SphereGeometry(4200, 16, 8, 0, 2π, 0, π/3)` upper
   cap, mesh offset to `(-3000, 0, 0)` (west = -X, per geo/projection.ts).
   Custom `ShaderMaterial`: vertical gradient warm orange `0xff9a5c` at the
   cap rim (horizon side) → transparent at the pole (zenith), plus a slow
   uTime drift shimmer (~90 s period) and an azimuthal unevenness term.
   `AdditiveBlending`, `depthWrite: false`, `fog: false` (sky-level, same
   exemption as the sky dome). Opacity is hour-driven: **1.0 across
   17.0–19.5 h** (= phaseLabel "黄昏"), smooth rise 15.8→17, smooth decay
   19.5→21, hard zero otherwise — dusk-exclusive, daytime sky untouched.
   Mesh hidden entirely (visible=false) outside the window so the draw
   call costs nothing.

2. **Far window constellation** — one `InstancedMesh`, **400 instances** of
   a shared `PlaneGeometry(14, 20)`, scattered on the 600–1500 m ring
   around the three-district cluster at y = 60–160 m (airborne fake
   facades, deliberately NOT hung on real building geometry). Plain
   `MeshBasicMaterial` white-warm `0xdfe8ff`, `fog: true` for depth
   cueing. Per-instance brightness (0.15–0.5 base) lives in
   `instanceColor` and is rewritten per frame: base × sine breathing
   (random phase, 7–20 s periods) × hour gain × zone-activity life scale
   (mean of `data.zones[].activity`, default 0.5). Hour gain: **night 1.0
   / day 0.15**, ramps at dawn 4.5–6.5 and dusk 17–19.5, aligned with the
   phase-palette keyframes so far lights and near facades brighten on the
   same schedule.

## Key decisions

- **DoubleSide on the glow shell.** Spec says "outward-normal additive
  shell, not BackSide". The camera lives INSIDE the 4200 m shell (whole
  city within ~2 km of the offset centre), so pure FrontSide would cull
  every face from inside — the arch would never render. DoubleSide keeps
  the outward-normal convention and actually renders for an inside
  viewer; the gradient is position-based so normal flipping is moot.
- **Gradient in LOCAL space.** The shader reads `position` (pre-offset),
  so the -3000 m west translation can never skew the rim/zenith mapping;
  rim/zenith heights are injected into the GLSL from the same module
  constants that build the geometry (no drift possible).
- **Alpha IS intensity.** Under AdditiveBlending (src.rgb × src.a + dst)
  `gl_FragColor = vec4(uColor, glow)` keeps the designed falloff exactly.
- **Zone activity, not geometry.** `buildAmbientLife(data)` only receives
  CityData, so the far-light life scale reads `data.zones` — an honest
  data-driven touch (busy city ⇒ more far windows lit) with no
  dependency on realCity internals.
- **Camera far plane 9000** (main.ts) comfortably contains the far side
  of the shell (max ~7200 m from origin).
- Determinism: `mulberry32(9421)`, single seed for the whole module.
- Both meshes: `frustumCulled = false` (sky-spanning/horizon-spanning),
  `castShadow = false`. Two draw calls total for the whole layer.

## Not done (by spec)

- **Fog warming** — fog belongs to daynight.ts; implementing it here
  would double-drive one parameter.

## Wiring (coordinator)

```ts
import { buildAmbientLife } from "./live/ambientLife";
const ambient = buildAmbientLife(data);
scene.add(ambient.root);
// per frame, next to the other live rigs:
ambient.update(dt, elapsed, daynight.hour());
```

`tsc --noEmit`: zero errors.
