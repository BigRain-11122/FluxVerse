import * as THREE from "three";
import type { CityPlan } from "../city/layout";
import { FLOW } from "../palette";
import type { CityEvent } from "../types";
import { mulberry32 } from "../util";

// Birth pulse (aliveness law): a real resident birth (NEW_RESIDENT /
// RESIDENT_BIRTH on the world-events bus) is a city-level moment, so each
// event raises one additive light column over the newborn's district center,
// a ground halo spreading under it, and rising spark dots inside the shaft.
// Same discipline as messengers.ts / traffic.ts: strictly event-driven
// pooling - no performance without a real event, pool overflow drops the
// event instead of queueing it (a dropped birth is invisible; a fake or
// delayed one is a lie, and the lie is always worse). All meshes are unlit
// additive glow (MeshBasicMaterial) and never cast shadows.

const POOL_SIZE = 4; // simultaneous births the city can stage at once
const LIFE_S = 4; // one activation lives four seconds
const BASE_OPACITY = 0.9; // column starts here, decays to 0 within LIFE_S
const COLUMN_H = 420; // m, shaft height (real meter scale)
const SPARKS_PER_COLUMN = 20;
const SPARK_MIN_SPEED = 58; // m/s: one to two full loops per 4 s life
const SPARK_MAX_SPEED = 132;
const RING_TUBE = 2; // torus tube radius; lift the ring so it rests on the ground
const RING_START_SCALE = 0.25; // halo opens at ~15 m radius...
const RING_END_SCALE = 1.2; // ...and keeps spreading (~72 m) as it dies
const RING_OPACITY = 0.75;

// Zone -> functional flow color (five-color law): gaming=data cyan,
// quant=capital gold, media=traffic magenta. Missing zone defaults to gaming.
const ZONE_COLOR: Record<string, THREE.Color> = {
  gaming: FLOW.data,
  quant: FLOW.capital,
  media: FLOW.traffic,
};

// Shared module-level geometry: every pooled column/spark/ring re-uses these
// buffers, so activation churn never re-allocates GPU memory.
const COLUMN_GEO = new THREE.CylinderGeometry(6, 10, COLUMN_H, 12, 1, true);
const SPARK_GEO = new THREE.SphereGeometry(1.6);
const RING_GEO = new THREE.TorusGeometry(60, 2, 8, 48);

interface Spark {
  mesh: THREE.Mesh;
  orbitA: number; // fixed azimuth around the column axis
  orbitR: number; // fixed orbit radius, kept inside the tapered shaft wall
  y0: number; // deterministic start height fraction (0..1 of column height)
  speed: number; // m/s upward
}

interface Slot {
  column: THREE.Mesh;
  columnMat: THREE.MeshBasicMaterial;
  ring: THREE.Mesh;
  ringMat: THREE.MeshBasicMaterial;
  sparkMat: THREE.MeshBasicMaterial; // one material shared by this slot's 20 dots
  sparks: Spark[];
  active: boolean;
  age: number;
}

export interface BirthPulseRig {
  root: THREE.Group;
  pushEvent: (e: CityEvent) => void;
  update: (dt: number, elapsed: number) => void;
}

export function buildBirthPulse(plan: CityPlan): BirthPulseRig {
  const root = new THREE.Group();
  // Deterministic spark choreography: same seed => same layout every reload.
  const rng = mulberry32(1135);

  const slots: Slot[] = [];
  for (let i = 0; i < POOL_SIZE; i++) {
    // Per-slot material clones: opacity/color animate per column, so the
    // geometry stays shared while the draw state does not.
    const columnMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0,
      depthWrite: false, // additive glow never occludes, skip depth writes
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide, // open-ended shaft: inner wall adds volume
    });
    const column = new THREE.Mesh(COLUMN_GEO, columnMat);
    column.visible = false;
    root.add(column);

    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const ring = new THREE.Mesh(RING_GEO, ringMat);
    ring.rotation.x = Math.PI / 2; // lie flat on the ground plane
    ring.visible = false;
    root.add(ring);

    const sparkMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const sparks: Spark[] = [];
    for (let j = 0; j < SPARKS_PER_COLUMN; j++) {
      const mesh = new THREE.Mesh(SPARK_GEO, sparkMat);
      mesh.visible = false;
      root.add(mesh);
      sparks.push({
        mesh,
        orbitA: rng() * Math.PI * 2,
        // <= 4.2 so dot (r 1.6) + orbit stays inside the 6 m top wall
        orbitR: 1.5 + rng() * 2.7,
        y0: rng(),
        speed: SPARK_MIN_SPEED + rng() * (SPARK_MAX_SPEED - SPARK_MIN_SPEED),
      });
    }

    slots.push({ column, columnMat, ring, ringMat, sparkMat, sparks, active: false, age: 0 });
  }

  const release = (slot: Slot): void => {
    slot.active = false;
    slot.age = 0;
    slot.column.visible = false;
    slot.ring.visible = false;
    slot.columnMat.opacity = 0;
    slot.ringMat.opacity = 0;
    slot.sparkMat.opacity = 0;
    for (const sp of slot.sparks) sp.mesh.visible = false;
  };

  const pushEvent = (e: CityEvent): void => {
    // Only the two real birth faces of the resident lifecycle become columns.
    if (e.type !== "NEW_RESIDENT" && e.type !== "RESIDENT_BIRTH") return;
    const slot = slots.find((s) => !s.active);
    if (!slot) return; // pool full: drop the event, never queue or block

    let zone = e.zone ?? "gaming";
    if (!ZONE_COLOR[zone]) zone = "gaming"; // unknown district falls back
    const district = plan.districts.find((d) => d.id === zone)
      ?? plan.districts.find((d) => d.id === "gaming");
    if (!district) return; // no anchor point on this plan, nothing to stage
    const col = ZONE_COLOR[zone];

    // Column lands on the district center: 420 m shaft, base on the ground.
    slot.column.position.set(district.cx, COLUMN_H / 2, district.cz);
    slot.columnMat.color.copy(col);
    slot.columnMat.opacity = BASE_OPACITY;
    slot.column.visible = true;

    // Ground halo opens under the same activation, same 4 s clock.
    slot.ring.position.set(district.cx, RING_TUBE, district.cz);
    slot.ring.scale.setScalar(RING_START_SCALE);
    slot.ringMat.color.copy(col);
    slot.ringMat.opacity = RING_OPACITY;
    slot.ring.visible = true;

    // Spark dots start at their deterministic staggered heights.
    slot.sparkMat.color.copy(col).multiplyScalar(1.5); // dots read brighter than the shaft
    slot.sparkMat.opacity = 1;
    for (const sp of slot.sparks) {
      sp.mesh.position.set(
        district.cx + Math.cos(sp.orbitA) * sp.orbitR,
        sp.y0 * COLUMN_H,
        district.cz + Math.sin(sp.orbitA) * sp.orbitR,
      );
      sp.mesh.visible = true;
    }

    slot.active = true;
    slot.age = 0;
  };

  const update = (dt: number, _elapsed: number): void => {
    for (const slot of slots) {
      if (!slot.active) continue;
      slot.age += dt;
      const t = slot.age / LIFE_S;
      if (t >= 1) {
        release(slot);
        continue;
      }
      const fade = 1 - t; // linear 1 -> 0: column opacity 0.9 -> 0 in 4 s
      slot.columnMat.opacity = BASE_OPACITY * fade;
      // Halo rides the same phase: spreading scale, dying opacity.
      slot.ring.scale.setScalar(RING_START_SCALE + (RING_END_SCALE - RING_START_SCALE) * t);
      slot.ringMat.opacity = RING_OPACITY * fade;
      slot.sparkMat.opacity = fade;
      // Dots loop upward along the shaft height (wrap back to the base).
      for (const sp of slot.sparks) {
        let y = sp.mesh.position.y + sp.speed * dt;
        if (y >= COLUMN_H) y -= COLUMN_H;
        sp.mesh.position.y = y;
      }
    }
  };

  return { root, pushEvent, update };
}
