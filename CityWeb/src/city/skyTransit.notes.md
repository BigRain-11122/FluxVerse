# skyTransit.notes — 波次 3 泳道 A（空中硅基层）

New file: `CityWeb/src/city/skyTransit.ts` (isolated lane; no existing files touched).

## Module contract (verbatim, for wiring)
```ts
export interface SkyTransitRig {
  root: THREE.Group;
  update: (dt: number, elapsed: number) => void;
}
export function buildSkyTransit(plan: CityPlan): SkyTransitRig
```

## What it draws
1. **空中交通管廊 ×3**（每城区 1 条）— CatmullRomCurve3, 5 control points on the
   artery corridor (district center → island, i.e. artery x1/z1 → x0/z0 line),
   apex `140 + rng()*30` m. `TubeGeometry(curve, 48, 6, 8, false)`, one shared
   additive vertex-colored material (opacity 0.22, depthWrite false, district
   flow color baked per-geometry). Glow hoops `TorusGeometry(7, 0.9)` every
   ~60 m (`round(len/60)`), hole axis on `getTangentAt`. 3 capsule pods per
   tube (`CapsuleGeometry(2.6, 6)`, hull 0x1a2433, headlight sphere 0.5 at the
   +Y nose) sliding `progress += dt*90/len` via `getPointAt`/`getTangentAt`
   (arc table precomputed via `curve.getLength()`).
2. **全息 K 线屏**（QUANT/陆家嘴区专属）— `PlaneGeometry(300, 110)` at
   `(cx, 280, cz)`, `rotation.y = atan2(islandX-cx, islandZ-cz)` so the normal
   faces the brain island. Raw `ShaderMaterial` (no lighting): fract grid
   floor (24×9 cells, dim gold) + one horizontally scrolling polyline
   (sin-chain `quote(x)`, `x = (uv.x + uTime*0.07)*16`), gold 0xfbbf24 main
   line, red falling segments via local `dy` sign. Transparent + Additive +
   DoubleSide, `depthWrite:false`; `update` drives `uniforms.uTime = elapsed`.
3. **浮空数据环**（每城区 1 个）— `TorusGeometry(70, 2.2, 8, 64)` flat halo at
   `380 + rng()*50` m over the district center, flow color ×1.3
   (品红 media / 金 quant / 青 gaming), holder `rotation.y += dt*0.1`; 4
   vertical light columns `BoxGeometry(1.2, 60, 1.2)` hanging from the ring
   (top on the ring plane, radius 70, 45° offsets) toward the city surface,
   sharing the additive tube material.

## Judgment calls (flagged honestly)
- **Island direction = artery x0/z0**: verified in `geo/realCity.ts`
  (`x0: end.x` where `end` is the island-edge point); legacy layout has the
  same semantics (plaza edge). Tube control points ride the center→island
  line, which contains the artery segment in both layouts.
- **Vertex-color baking**: tubes + light columns share ONE additive material;
  the district flow color is baked as a `color` attribute (tube geometry is
  unique per curve anyway; columns get one painted clone per district, 4
  meshes share it). Keeps the material count at **7 ≤ 8**.
- **Data-ring "自转" reads through the pillars**: a flat symmetric torus
  spinning alone is invisible, so the whole holder (torus + columns) rotates
  — the columns orbit at 0.1 rad/s (~63 s/rev), which is the visible motion.
- **K-line red = FLOW.warn (0xf87171 警示红)**, the palette's canonical red;
  gold = FLOW.capital (0xfbbf24) exactly as ordered. Shader outputs linear
  values; OutputPass (ACES + sRGB) + UnrealBloomPass threshold 0.55 turn the
  ×1.9 line into a hot stroke (same convention as the river shader).
- **Headlight = warm white ×2.2 HDR**, not district flow color: a lamp should
  read as a lamp; the district color already lives on the tube and hoops.
- **Tube vs supertall clipping** (Lujiazui 200m+, 白玉兰 320m vs apex 140–170m):
  accepted per CEO order "硅基化、不完全写实" — additive glow conduits through
  towers read as intentional sci-fi layering, and the apex band is spec-pinned.
- **`span ≤ 200` guard**: a degenerate district (no resolvable island
  direction) skips the tube but still gets its data ring; rng draw order
  stays deterministic for the real plan.
- **rng(5150) draws**: per district → tube apex / launch / arrival heights,
  pod phase jitter, data-ring altitude.
- **castShadow 全关** (default false, never enabled) — the 2048px city shadow
  map budget stays with the buildings.

## Wiring hint (coordinator — NOT done here, existing files are untouchable)
```ts
import { buildSkyTransit } from "./city/skyTransit";
const skyTransit = buildSkyTransit(plan); // plan = buildRealCity(...).plan
scene.add(skyTransit.root);
// in animate(): skyTransit.update(dt, elapsed);
```

## Performance
- 7 materials (budget ≤8); 6 module-level shared geometries + 3 per-curve tube
  geometries + 3 painted column clones per build.
- ~80 meshes ≈ 80 draw calls, all tiny (hoop 12×48 tris, capsule 8-seg).
- update(): 9 × (getPointAt + getTangentAt) against the cached 200-division
  arc table + 3 group rotations + one uniform write; zero allocations
  (scratch `_tan`, positions written in place).
