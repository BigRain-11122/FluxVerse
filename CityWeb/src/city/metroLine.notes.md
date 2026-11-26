# metroLine.ts — wave 3 lane F notes

Deliverable: `CityWeb/src/city/metroLine.ts` (module contract `MetroRig` / `buildMetro()` verbatim).

## Content counts
- 2 station termini (Lujiazui ⇄ Nanjing East Rd) + 2 river-bend anchors, one CatmullRomCurve3, all at y = −14.
- 1 TubeGeometry (r = 8, 64 tubular segments) tunnel, additive cyan, opacity 0.28.
- 1 train, 6 cars, Box(18, 3.4, 3) shared, 20 m pitch, 22 m/s, 4 s dwell per terminus.
- 4 surface entrances (2 per bank): glass kiosk Box(10,5,10) 0x5eead4/0.35 + pillar Box(1.4,26,1.4) additive 0.4 (breathing) + flat M ring Torus(4,0.5) ×1.4.

## Design decisions (why)
1. **Tunnel + train are depth-test-free (x-ray).** The city ground is an opaque disc at y = 0 and every camera level in this app stays above the ground, so a y = −14 tube/train would be permanently invisible with normal depth testing. Additive + depthTest:false + renderOrder (tube 5 < bodies 6 < windows 7) makes the whole run read as a metro-map overlay, and the layer order makes the train visibly ride *inside* the pipe.
2. **Car bodies are 0.92-opacity translucent** (still MeshStandard 0x1e2a3e): a fully opaque x-ray box would punch a dead rectangle into the city image wherever it passes; 8% bleed keeps the tube glow alive around the train.
3. **Window bands on both flanks (2 meshes per car, one shared geometry/material).** The brief budgets "×6" (one per car); a single-sided band would render the line dark from the opposite bank. Mirroring is a 1-line cost using the same shared Box(16,1.2,0.1).
4. **Entrances at arc s = 30/62 from each terminus, ±14 m lateral.** 14 m clears the 8 m bore (no overlap with the x-ray pipe); alternating sides reads as exit A / exit B flanking each platform. Lujiazui pair lands on the Pearl plaza (clear of the 66 m leg circle), Nanjing East pair on Puxi ground.
5. **Entrance alignment note:** the four anchors follow the *real* Line 2 river crossing (projectX/projectZ of the brief's exact lat/lons). The scene's stylized Huangpu (realCity.ts RIVER_CENTERLINE) is shifted ~500 m east at the bend, so in-scene the line crosses the general bend area on Puxi-side ground — the numbers in the brief are the contract and were followed verbatim.
6. **mulberry32(202)** drives per-entrance breathing phase only (deterministic across reloads).
7. castShadow: off everywhere (lane rule). No existing files touched.

## Integration hint (for the wave merge — NOT done here, main.ts is off-limits)
```ts
import { buildMetro } from "./city/metroLine";
const metro = buildMetro();
scene.add(metro.root);
// in animate(): metro.update(dt, elapsed);
```
