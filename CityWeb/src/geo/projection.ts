// Geographic projection: real Shanghai lat/lon -> local meters.
// Equirectangular around the composition origin (Huangpu bend apex between
// Lujiazui and North Bund). North = -Z, East = +X, 1 unit = 1 meter.

export const ORIGIN_LAT = 31.2430;
export const ORIGIN_LON = 121.4950;

const M_PER_DEG_LAT = 110540;
const M_PER_DEG_LON = 111320 * Math.cos(ORIGIN_LAT * (Math.PI / 180)); // ~95,335

export interface GeoPoint {
  lat: number;
  lon: number;
}

export function projectX(lon: number): number {
  return (lon - ORIGIN_LON) * M_PER_DEG_LON;
}

export function projectZ(lat: number): number {
  return -(lat - ORIGIN_LAT) * M_PER_DEG_LAT;
}

export function project(p: GeoPoint): { x: number; z: number } {
  return { x: projectX(p.lon), z: projectZ(p.lat) };
}
