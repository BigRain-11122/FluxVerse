# weather.ts — lane B notes

Weather particles driven by the city data plane. Nothing decorative:
`data.reality.weather_kind` (string) picks the single active system;
`clear` / `cloud` / unknown values leave all three hidden.

## Wiring (module contract)

```ts
import { buildWeather } from "./live/weather";

const weather = buildWeather(data);          // data = window.CITY_DATA
scene.add(weather.root);
// in the animate loop, next to robots.update(dt, elapsed):
weather.update(dt, elapsed);
```

## Systems (all under `weather.root`, plain `points.visible` switching)

| kind  | points | size | color    | opacity | motion per frame |
|-------|--------|------|----------|---------|------------------|
| rain  | 2400   | 0.35 | 0x6f87a8 | 0.45    | y -= 55*dt, wrap floor->ceiling; x/z untouched (y-only write) |
| snow  | 900    | 0.9  | 0xdfe8f4 | 0.75    | y -= 7*dt; x += sin(elapsed*0.8 + phase_i)*2.0*dt |
| wind  | 500    | 0.3  | 0x9fb4cc | 0.30    | x += 30*dt, wrap at +/-410; y += sin(elapsed*2.3 + phase_i)*4*dt |

- Activity box: 820 x 230 x 820 centered on origin (x/z +/-410, y -115..115).
- All materials: sizeAttenuation true, transparent, depthWrite false, fog true.
- All randomness from `mulberry32(6606)` — two builds are bit-identical.
- All Points have `frustumCulled = false` (positions mutate every frame).
- Inactive systems skip their update loop entirely (single if/else chain).
