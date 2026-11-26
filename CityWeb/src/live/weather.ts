import * as THREE from "three";
import { mulberry32 } from "../util";
import type { CityData } from "../types";

// Real weather from the city data plane (reality.weather_kind) picks the
// single particle system that runs. Honest law: clear/cloud sky means no
// weather, so no particle renders at all - nothing decorative.

export interface WeatherRig {
  root: THREE.Group;
  update: (dt: number, elapsed: number) => void;
}

// One constant seed => any two builds of the same data are bit-identical.
const SEED = 6606;

// Shared activity box: 820 x 230 x 820, centered on the origin.
const XZ = 410;
const Y_MIN = -115;
const Y_RANGE = 230;

const RAIN_COUNT = 2400;
const SNOW_COUNT = 900;
const WIND_COUNT = 500;

const RAIN_FALL = 55;  // streak speed, m/s
const SNOW_FALL = 7;   // lazy descent, m/s
const SNOW_SWAY = 2.0; // sway gain; integrated sine stays bounded
const SNOW_FREQ = 0.8; // sway rate, rad/s
const WIND_FLOW = 30;  // fixed +x stream speed, m/s
const WIND_JITTER = 4; // vertical jitter gain
const WIND_FREQ = 2.3; // jitter rate, rad/s

interface System {
  points: THREE.Points;
  pos: Float32Array;    // same buffer as the position attribute
  attr: THREE.BufferAttribute;
  phases: Float32Array; // per-point sine phase so particles stay out of sync
}

function buildSystem(
  count: number,
  size: number,
  color: number,
  opacity: number,
  rng: () => number,
): System {
  const pos = new Float32Array(count * 3);
  const phases = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    const j = i * 3;
    pos[j] = (rng() * 2 - 1) * XZ;
    pos[j + 1] = Y_MIN + rng() * Y_RANGE;
    pos[j + 2] = (rng() * 2 - 1) * XZ;
    phases[i] = rng() * Math.PI * 2;
  }
  const attr = new THREE.BufferAttribute(pos, 3);
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", attr);
  const mat = new THREE.PointsMaterial({
    color, size, sizeAttenuation: true,
    transparent: true, opacity, depthWrite: false, fog: true,
  });
  const points = new THREE.Points(geo, mat);
  points.frustumCulled = false; // positions mutate every frame; skip sphere tests
  return { points, pos, attr, phases };
}

export function buildWeather(data: CityData): WeatherRig {
  const rng = mulberry32(SEED);
  const rain = buildSystem(RAIN_COUNT, 0.35, 0x6f87a8, 0.45, rng);
  const snow = buildSystem(SNOW_COUNT, 0.9, 0xdfe8f4, 0.75, rng);
  const wind = buildSystem(WIND_COUNT, 0.3, 0x9fb4cc, 0.3, rng);

  const root = new THREE.Group();
  root.add(rain.points, snow.points, wind.points);

  // Plain boolean visibility: only the kind from the data plane ever shows.
  const kind = (data.reality.weather_kind || "").toLowerCase();
  rain.points.visible = kind === "rain";
  snow.points.visible = kind === "snow";
  wind.points.visible = kind === "wind";

  const update = (dt: number, elapsed: number): void => {
    if (kind === "rain") {
      // Rain keeps x/z forever, so only the y slot is rewritten per frame.
      const p = rain.pos;
      for (let i = 0; i < RAIN_COUNT; i++) {
        const j = i * 3 + 1;
        let y = p[j] - RAIN_FALL * dt;
        if (y < Y_MIN) y += Y_RANGE; // past the floor => back to the ceiling
        p[j] = y;
      }
      rain.attr.needsUpdate = true;
    } else if (kind === "snow") {
      const p = snow.pos;
      for (let i = 0; i < SNOW_COUNT; i++) {
        const j = i * 3;
        let y = p[j + 1] - SNOW_FALL * dt;
        if (y < Y_MIN) y += Y_RANGE;
        p[j + 1] = y;
        // Sine drift on x: phase unique per flake, driven by elapsed.
        let x = p[j] + Math.sin(elapsed * SNOW_FREQ + snow.phases[i]) * SNOW_SWAY * dt;
        if (x > XZ) x -= XZ * 2; else if (x < -XZ) x += XZ * 2;
        p[j] = x;
      }
      snow.attr.needsUpdate = true;
    } else if (kind === "wind") {
      const p = wind.pos;
      for (let i = 0; i < WIND_COUNT; i++) {
        const j = i * 3;
        let x = p[j] + WIND_FLOW * dt;
        if (x > XZ) x -= XZ * 2; // wrap the stream; it keeps flowing +x
        p[j] = x;
        // Slight vertical jitter, out of phase per particle.
        p[j + 1] += Math.sin(elapsed * WIND_FREQ + wind.phases[i]) * WIND_JITTER * dt;
      }
      wind.attr.needsUpdate = true;
    }
    // clear / cloud / unknown: nothing visible, nothing to move.
  };

  return { root, update };
}
