import * as THREE from "three";
import { mulberry32 } from "../util";
import type { CityPlan } from "../city/layout";
import type { CityData } from "../types";

// L0 resident presence: Points cloud spread over the three districts.
// Density follows the real population scale (census.total scaled to a
// renderable sample) and the time-of-day street gain from the phase
// palette. Honest macro projection, no individual simulation.

export interface DustRig {
  points: THREE.Points;
  mat: THREE.PointsMaterial;
}

export function buildDust(plan: CityPlan, data: CityData): DustRig {
  const rng = mulberry32(4242);
  const total = data.census_total || 10000;
  const SAMPLE = 620;
  const positions = new Float32Array(SAMPLE * 3);

  for (let i = 0; i < SAMPLE; i++) {
    const d = plan.districts[Math.floor(rng() * plan.districts.length)];
    const ang = rng() * Math.PI * 2;
    const r = 16 + rng() * 58;
    positions[i * 3] = d.cx + Math.cos(ang) * r;
    positions[i * 3 + 1] = 1.6 + rng() * 13;
    positions[i * 3 + 2] = d.cz + Math.sin(ang) * r;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const mat = new THREE.PointsMaterial({
    color: 0x7de8d8, size: 1.7, sizeAttenuation: true,
    transparent: true, opacity: 0.4, depthWrite: false,
    blending: THREE.AdditiveBlending, fog: true,
  });
  const points = new THREE.Points(geo, mat);
  points.frustumCulled = false;
  return { points, mat };
}
