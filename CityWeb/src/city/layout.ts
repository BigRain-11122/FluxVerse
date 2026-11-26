import { mulberry32, DEG } from "../util";
import type { CityData } from "../types";

// 一核 · 一环 · 三城 · 一网 (DESIGN.md §三):
// brain tower at origin, brain-ring plaza, three cities at 120 degrees,
// three neural arteries, outer perception ring.

export const SEED = 20260923;
export const CITY_R = 172; // legacy fictional layout (superseded by geo/realCity)
export const DISTRICT_R = 78;
export const PLAZA_R = 130; // brain-island garage ring (robots park here)
export const OUTER_RING_R = 1900; // perception ring, real city scale

export interface DistrictSpec {
  id: string;
  name: string;
  angleDeg: number;
  cx: number;
  cz: number;
}

export interface BuildingSpec {
  x: number;
  z: number;
  w: number;
  d: number;
  h: number;
  district: string; // zone id
  isLandmarkTower?: boolean;
}

export interface ArterySpec {
  district: string;
  angleDeg: number;
  x0: number;
  z0: number;
  x1: number;
  z1: number;
}

export interface MastSpec {
  x: number;
  z: number;
  h: number;
}

export interface CityPlan {
  districts: DistrictSpec[];
  buildings: BuildingSpec[];
  arteries: ArterySpec[];
  masts: MastSpec[]; // MEDIA signal towers
  ringNodes: Array<{ x: number; z: number }>;
}

const DISTRICTS: Array<{ id: string; name: string; angleDeg: number }> = [
  { id: "gaming", name: "GAME 城", angleDeg: 90 },
  { id: "quant", name: "QUANT 城", angleDeg: 210 },
  { id: "media", name: "MEDIA 城", angleDeg: 330 },
];

function districtCenter(angleDeg: number): { cx: number; cz: number } {
  const a = angleDeg * DEG;
  return { cx: Math.cos(a) * CITY_R, cz: -Math.sin(a) * CITY_R };
}

function distToSegment(px: number, pz: number, x0: number, z0: number, x1: number, z1: number): number {
  const dx = x1 - x0, dz = z1 - z0;
  const len2 = dx * dx + dz * dz;
  let t = len2 > 0 ? ((px - x0) * dx + (pz - z0) * dz) / len2 : 0;
  t = Math.max(0, Math.min(1, t));
  const cx = x0 + t * dx, cz = z0 + t * dz;
  return Math.hypot(px - cx, pz - cz);
}

export function buildPlan(data: CityData): CityPlan {
  const rng = mulberry32(SEED);
  const districts: DistrictSpec[] = [];
  const buildings: BuildingSpec[] = [];
  const arteries: ArterySpec[] = [];
  const masts: MastSpec[] = [];
  const ringNodes: Array<{ x: number; z: number }> = [];

  for (const d of DISTRICTS) {
    const { cx, cz } = districtCenter(d.angleDeg);
    districts.push({ id: d.id, name: d.name, angleDeg: d.angleDeg, cx, cz });

    // Artery: plaza edge -> district edge, along the center direction.
    const a = d.angleDeg * DEG;
    const ux = Math.cos(a), uz = -Math.sin(a);
    arteries.push({
      district: d.id,
      angleDeg: d.angleDeg,
      x0: ux * (PLAZA_R + 2),
      z0: uz * (PLAZA_R + 2),
      x1: ux * (CITY_R - DISTRICT_R - 6),
      z1: uz * (CITY_R - DISTRICT_R - 6),
    });
  }

  // Landmarks.
  for (const d of districts) {
    if (d.id === "gaming") {
      buildings.push({ x: d.cx, z: d.cz, w: 9, d: 9, h: 62, district: d.id, isLandmarkTower: true });
    } else if (d.id === "quant") {
      buildings.push({ x: d.cx, z: d.cz, w: 11, d: 11, h: 118, district: d.id, isLandmarkTower: true });
    } else if (d.id === "media") {
      masts.push({ x: d.cx - 10, z: d.cz - 6, h: 66 });
      masts.push({ x: d.cx + 9, z: d.cz + 4, h: 54 });
      masts.push({ x: d.cx - 1, z: d.cz + 12, h: 44 });
    }
  }

  // District building rings.
  const rings = [26, 42, 57, 69];
  for (const d of districts) {
    const artery = arteries.find((ar) => ar.district === d.id)!;
    for (let ri = 0; ri < rings.length; ri++) {
      const r = rings[ri];
      const blockW = 15 - ri * 1.2;
      const count = Math.max(8, Math.floor((2 * Math.PI * r) / blockW));
      for (let bi = 0; bi < count; bi++) {
        const ang = (bi / count) * Math.PI * 2 + rng() * 0.14;
        const rr = r + (rng() - 0.5) * 5;
        const x = d.cx + Math.cos(ang) * rr;
        const z = d.cz + Math.sin(ang) * rr;
        // keep artery corridor clear
        if (distToSegment(x, z, artery.x0, artery.z0, d.cx, d.cz) < 12) continue;
        // keep clear of district landmark core
        if (Math.hypot(x - d.cx, z - d.cz) < 18) continue;

        let h: number;
        if (d.id === "gaming") {
          h = 12 + rng() * 22 + (ri === 1 ? 10 : 0);
        } else if (d.id === "quant") {
          h = 24 + rng() * 34 + (ri >= 2 ? rng() * 26 : 0);
        } else {
          h = 14 + rng() * 28;
        }
        const w = 7 + rng() * 4.5;
        const dd = 7 + rng() * 4.5;
        buildings.push({ x, z, w, d: dd, h, district: d.id });
      }
    }

    // GAME city: eight game towers P01-P08 near the landmark.
    if (d.id === "gaming") {
      for (let i = 0; i < 8; i++) {
        const ang = (i / 8) * Math.PI * 2 + 0.35;
        const rr = 19;
        const x = d.cx + Math.cos(ang) * rr;
        const z = d.cz + Math.sin(ang) * rr;
        if (distToSegment(x, z, artery.x0, artery.z0, d.cx, d.cz) < 12) continue;
        buildings.push({ x, z, w: 8, d: 8, h: 30 + rng() * 18, district: d.id });
      }
    }
  }

  // Outer perception ring nodes (12 pylons).
  for (let i = 0; i < 12; i++) {
    const ang = (i / 12) * Math.PI * 2 + 0.26;
    ringNodes.push({ x: Math.cos(ang) * OUTER_RING_R, z: Math.sin(ang) * OUTER_RING_R });
  }

  return { districts, buildings, arteries, masts, ringNodes };
}
