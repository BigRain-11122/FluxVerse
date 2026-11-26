# landmarks-northbund.notes — 北外滩地标泳道 C

New file: `CityWeb/src/city/landmarks-northbund.ts` (isolated lane; no existing files touched).

## Module contract (verbatim, for wiring)
```ts
export interface LandmarkRig {
  root: THREE.Group;
  update: (dt: number, elapsed: number) => void;
}
export function buildWhiteMagnolia(): LandmarkRig
export function buildWaibaiduBridge(): LandmarkRig
```

## Key dimensions (1 unit = 1 m, local origin, ground y = 0, bridge spans +X)

**White Magnolia Plaza (320 m):**
- Podium 64×12×64 (y 0–12); tapered square shaft edge 55→32 m, y 12–270 (4-gon cylinder, yaw 45°).
- 4 corner traffic prisms: 1.2 m slanted thin boxes running the full corner line (27.5→16 half-edge).
- Traffic halo collar: torus at y=140, radius = interpolated corner circumradius (+0.4).
- Crown: calyx 30×7×30 at y=273.5 + **5 petals** (ExtrudeGeometry leaf outline), L 52–56 m, lean 29–34°, base y=271 → tips y ≈ 314–320; each petal carries an inner glow rib (traffic magenta).
- Crown pulse: icosahedron core (y=291) + torus ring (y=287), driven by one sin³ pulse.

**Waibaidu Bridge (104 m):**
- **2 spans × 52 m** along X; deck 104×1.5×14, deck top y=10 (≈8.5 m clearance below); truss depth 11 m (chords y 10.4 / 21.4, planes z=±6.6).
- 8 panels/span/side @ 6.5 m pitch → 9 verticals + 8 X-brace pairs per span-side = **64 braces + 34 verticals**, all reusing 3 shared box geometries.
- Portal frames at x=±51.5, posts to y≈26.5–28 (taller than truss top 21.4), with top cross beams.
- Piers: centre x=0 (mid-river joint) + abutments x=±49, 5.5×8.5×12 up to deck underside.
- Glow: 4 data-cyan chord rails (full 104 m, hugging chords) + 2 capital-gold lamp bands at deck edges.

## Design deviation (flagged honestly)
Brief asked for X braces "rotated ±45°"; with a 6.5 m panel × 11 m truss depth, a literal 45° bar misses the node grid, so braces use the true panel-diagonal angle **±59.4° = atan(11/6.5)** — every brace lands on a chord node and the X silhouette is identical at L0.

## Material budget
- 3 shared MeshStandardMaterial: `darkBodyMat` / `petalMat` / `steelMat`.
- 4 MeshBasicMaterial emissive singletons: `trafficEdgeMat`, `trafficCrownMat` (tower), `dataChordMat`, `capitalLampMat` (bridge). Animation is colour/intensity driven — zero per-frame allocations.
- castShadow only on big parts: podium, shaft, deck, portal posts+beams, piers.

## update() behaviour
- Magnolia: petal breath (traffic colour + emissiveIntensity), sharpened crown pulse (sin³, dt-smoothed; core scale 0.85–1.30), slow corner/halo shimmer.
- Bridge: lamp-band micro-breath ±15% (capital), chord shimmer on slow counter-phase (data).

## Wiring hints
- Tower: place `root` at the North Bund plot; no scale/rotation needed.
- Bridge: spans local +X — rotate `root` to cross the Suzhou Creek mouth; y=0 sits on the ground/water plane.
- Call `rig.update(dt, elapsed)` from the main loop next to `robots.update(dt, elapsed)`.
- Seeds: `mulberry32(11326)` (tower petals), `mulberry32(21204)` (bridge portals) — deterministic on reload.
