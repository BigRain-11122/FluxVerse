import * as THREE from "three";
import type { CityPlan } from "../city/layout";
import { FLOW } from "../palette";
import type { CityEvent } from "../types";

// TRANSFER light bands: a real big-file transfer (district -> brain) plays as
// one street-level light flow running down that district's artery toward the
// brain ring. Strictly event-driven pooling, same discipline as the
// messengers: no performance without a real event, no decorative constant
// traffic, pool overflow drops the event instead of queueing it.

const POOL_SIZE = 12;
const BAND_SPEED = 38; // world units per second along the artery
const BAND_Y = 0.35; // hugs the road surface
const ACTIVE_OPACITY = 0.85;

const ZONE_COLOR: Record<string, THREE.Color> = {
  gaming: FLOW.data,
  quant: FLOW.capital,
  media: FLOW.traffic,
};

interface Band {
  mesh: THREE.Mesh;
  mat: THREE.MeshBasicMaterial;
  active: boolean;
  progress: number; // 0..1 along from -> to
  len: number; // segment length, cached for speed -> progress conversion
  from: THREE.Vector3;
  to: THREE.Vector3;
}

export interface TrafficRig {
  root: THREE.Group;
  pushEvent: (e: CityEvent) => void;
  update: (dt: number, elapsed: number) => void;
}

export function buildTraffic(plan: CityPlan): TrafficRig {
  const root = new THREE.Group();

  // One shared box; one material clone per band so each ride can carry its
  // own district flow color without touching the others.
  const geo = new THREE.BoxGeometry(4.2, 0.22, 0.22);
  const bands: Band[] = [];
  for (let i = 0; i < POOL_SIZE; i++) {
    const mat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.visible = false;
    root.add(mesh);
    bands.push({
      mesh, mat, active: false, progress: 0, len: 1,
      from: new THREE.Vector3(), to: new THREE.Vector3(),
    });
  }

  const release = (band: Band): void => {
    band.active = false;
    band.mat.opacity = 0;
    band.mesh.visible = false;
  };

  const pushEvent = (e: CityEvent): void => {
    if (e.type !== "TRANSFER") return; // only file transfers become bands
    const band = bands.find((b) => !b.active);
    if (!band) return; // pool full: drop the event, never queue or block

    let zone = e.zone ?? "gaming";
    if (!ZONE_COLOR[zone]) zone = "gaming"; // unknown district falls back
    const artery = plan.arteries.find((a) => a.district === zone);
    if (!artery) return;

    // Ride the artery district-end -> brain-ring end: transfers flow inward.
    band.from.set(artery.x1, BAND_Y, artery.z1);
    band.to.set(artery.x0, BAND_Y, artery.z0);
    band.len = band.from.distanceTo(band.to);
    if (band.len < 1e-4) return; // degenerate segment, nothing to animate

    band.progress = 0;
    band.active = true;
    // Point the box's long (x) axis along the travel direction.
    band.mesh.rotation.y = Math.atan2(-(artery.z0 - artery.z1), artery.x0 - artery.x1);
    band.mat.color.copy(ZONE_COLOR[zone]);
    band.mat.opacity = ACTIVE_OPACITY;
    band.mesh.visible = true;
    band.mesh.position.copy(band.from);
  };

  const update = (dt: number, _elapsed: number): void => {
    for (const band of bands) {
      if (!band.active) continue;
      band.progress += (dt * BAND_SPEED) / band.len;
      if (band.progress >= 1) {
        release(band);
        continue;
      }
      band.mesh.position.copy(band.from).lerp(band.to, band.progress);
    }
  };

  return { root, pushEvent, update };
}
