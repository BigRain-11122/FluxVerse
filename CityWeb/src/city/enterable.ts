import * as THREE from "three";
import type { CityPlan } from "./layout";
import { FLOW, ZONE_FLOW } from "../palette";

// CEO order 2026-11-26 "人能进入": a city you can only look at is a diorama.
// Every district gets one 硅基枢纽馆 (silicon hub pavilion) - a glass hall
// with a 20m door gap in the front wall, three lit mezzanine slabs, a cyan
// elevator light column and a breathing crown beacon. specs[] exposes the
// walkable interior AABBs so WalkController can exempt the hall from shell
// colliders once the player is inside (entered through the door gap).

export interface EnterableSpec {
  cx: number; cz: number;   // world center
  hw: number; hd: number;   // half extents (walkable interior bounds)
}

export interface EnterableRig {
  root: THREE.Group;
  specs: EnterableSpec[];
  update: (dt: number, elapsed: number) => void;
}

// ---- pavilion proportions: glass hall 60 x 40 x 28 m ----
const SHELL_W = 60;           // local X span
const SHELL_D = 40;           // local Z span, front face at +Z
const SHELL_H = 28;           // wall height
const WALL_T = 0.7;           // shell panel thickness
const DOOR_W = 20;            // front middle gap - the "people can enter" door
const FLOOR_Y = [6, 14, 22];  // interior mezzanine slabs (visual levels)
const HUB_OFFSET = 340;       // district center -> island direction (m), CEO spec

// "open spot" sweep along the island axis: the literal 340m first, the
// neighbours only when a plan building blocks it. The real-geography plan
// carries an empty buildings list, so 340 wins there immediately.
const OFFSET_CANDIDATES = [340, 352, 326, 364, 312, 376, 300, 388];

// walkable interior half extents (inside the WALL_T shell)
const INT_HW = SHELL_W / 2 - WALL_T;
const INT_HD = SHELL_D / 2 - WALL_T;

// ---- shared geometry module constants: one per shape, reused by all hubs ----
const SLAB_GEO = new THREE.BoxGeometry(56, 0.8, 36);      // interior floor slabs
const STRIP_GEO = new THREE.BoxGeometry(50, 0.3, 1.2);    // warm edge light strips
const COLUMN_GEO = new THREE.CylinderGeometry(3, 3, 26);  // elevator light column
const BACK_GEO = new THREE.BoxGeometry(SHELL_W, SHELL_H, WALL_T);
const SIDE_GEO = new THREE.BoxGeometry(WALL_T, SHELL_H, SHELL_D);
const FRONT_GEO = new THREE.BoxGeometry((SHELL_W - DOOR_W) / 2, SHELL_H, WALL_T);
const DECK_GEO = new THREE.BoxGeometry(SHELL_W, WALL_T, SHELL_D); // roof + base share the shape
const SPIRE_GEO = new THREE.CylinderGeometry(0.32, 0.5, 4);
const BEACON_GEO = new THREE.SphereGeometry(1.5, 16, 12);

interface HubAnim {
  stripBase: THREE.Color;
  stripMat: THREE.MeshBasicMaterial;
  columnMat: THREE.MeshBasicMaterial;
  columnMesh: THREE.Mesh;
  beaconMesh: THREE.Mesh;
  phase: number;
}

/** Island-side direction of a district, read off its artery: both plan
 *  builders (city/layout.ts and geo/realCity.ts) emit arteries whose
 *  (x0, z0) end sits at the island, so the artery is the plan's own island
 *  pointer - no hard-coded island coordinates in this module. */
function islandDirOf(plan: CityPlan, districtId: string, cx: number, cz: number): { x: number; z: number } {
  const ar = plan.arteries.find((a) => a.district === districtId);
  // no artery (never happens with the current builders): fall back to the
  // world origin, where the legacy layout parks the brain island
  const dx = ar ? ar.x0 - cx : -cx;
  const dz = ar ? ar.z0 - cz : -cz;
  const len = Math.hypot(dx, dz);
  if (len < 1e-6) return { x: 1, z: 0 };
  return { x: dx / len, z: dz / len };
}

/** True when the hub footprint (outer shell + 8m clearance) hits a plan
 *  building - the "open spot" test for the offset sweep. */
function blockedByBuilding(plan: CityPlan, x: number, z: number): boolean {
  for (const b of plan.buildings) {
    if (Math.abs(x - b.x) < SHELL_W / 2 + 8 + b.w / 2 &&
        Math.abs(z - b.z) < SHELL_D / 2 + 8 + b.d / 2) return true;
  }
  return false;
}

export function buildEnterableHubs(plan: CityPlan): EnterableRig {
  const root = new THREE.Group();
  const specs: EnterableSpec[] = [];
  const anims: HubAnim[] = [];

  // one glass shell material shared by all hubs: a transparent shell must
  // not write depth, or it punches holes into the additive light column
  const shellMat = new THREE.MeshStandardMaterial({
    color: 0x1a2c46,
    opacity: 0.35,
    transparent: true,
    metalness: 0.4,
    roughness: 0.35,
    depthWrite: false,
  });
  // interior decks (base + mezzanines) are solid, not glass: a glass floor
  // on the world ground plane would z-fight, and solid decks read as floors
  const deckMat = new THREE.MeshStandardMaterial({ color: 0x101a2b, roughness: 0.85, metalness: 0.25 });

  plan.districts.forEach((d, hubIndex) => {
    const dir = islandDirOf(plan, d.id, d.cx, d.cz);

    // ---- placement: 340m from the district center toward the island ----
    let px = d.cx + dir.x * HUB_OFFSET;
    let pz = d.cz + dir.z * HUB_OFFSET;
    for (const off of OFFSET_CANDIDATES) {
      const tx = d.cx + dir.x * off;
      const tz = d.cz + dir.z * off;
      if (!blockedByBuilding(plan, tx, tz)) { px = tx; pz = tz; break; }
    }

    // face the island, snapped to a cardinal axis: specs and walk colliders
    // are axis-aligned AABBs, an arbitrary yaw would break that contract -
    // snapping keeps the door island-facing AND the interior bounds exact
    const yawRaw = Math.atan2(dir.x, dir.z); // local +Z -> island direction
    const snap = Math.round(yawRaw / (Math.PI / 2)) * (Math.PI / 2);
    const swapAxes = Math.abs(Math.sin(snap)) > 0.5;

    const hub = new THREE.Group();
    hub.position.set(px, 0, pz);
    hub.rotation.y = snap;
    root.add(hub);

    const addGlass = (geo: THREE.BufferGeometry, x: number, y: number, z: number): void => {
      const m = new THREE.Mesh(geo, shellMat);
      m.position.set(x, y, z);
      m.renderOrder = 1; // glass first, additive light column after (order 2)
      // no castShadow on purpose: a transparent shell casting an opaque
      // shadow would black out the whole walkable interior
      hub.add(m);
    };

    // ---- shell: closed six-face box, front face split by the door gap ----
    addGlass(BACK_GEO, 0, SHELL_H / 2, -(SHELL_D / 2 - WALL_T / 2));
    addGlass(SIDE_GEO, -(SHELL_W / 2 - WALL_T / 2), SHELL_H / 2, 0);
    addGlass(SIDE_GEO, SHELL_W / 2 - WALL_T / 2, SHELL_H / 2, 0);
    addGlass(FRONT_GEO, -((SHELL_W - DOOR_W) / 2), SHELL_H / 2, SHELL_D / 2 - WALL_T / 2);
    addGlass(FRONT_GEO, (SHELL_W - DOOR_W) / 2, SHELL_H / 2, SHELL_D / 2 - WALL_T / 2);
    addGlass(DECK_GEO, 0, SHELL_H - WALL_T / 2, 0); // roof

    // base deck: top sits 6cm above the world ground (kills z-fighting with
    // the ground plane); opaque so the walk-in floor reads solid
    const base = new THREE.Mesh(DECK_GEO, deckMat);
    base.position.set(0, 0.06 - WALL_T / 2, 0);
    base.receiveShadow = true;
    hub.add(base);

    // ---- interior: three mezzanine slabs + warm edge light strips ----
    const stripBase = new THREE.Color(0xffd9a0).multiplyScalar(1.2); // above bloom threshold
    const stripMat = new THREE.MeshBasicMaterial({ color: stripBase.clone() });
    for (const fy of FLOOR_Y) {
      const slab = new THREE.Mesh(SLAB_GEO, deckMat);
      slab.position.set(0, fy, 0);
      slab.castShadow = true;
      slab.receiveShadow = true;
      hub.add(slab);
      for (const sz of [-1, 1]) {
        const strip = new THREE.Mesh(STRIP_GEO, stripMat);
        // tucked just under the slab edge: reads as floor-edge glow from
        // street level (eye height 1.8m) looking up
        strip.position.set(0, fy - 0.75, sz * (SHELL_D / 2 - 3));
        hub.add(strip);
      }
    }

    // ---- central light column (elevator shaft, additive data-cyan) ----
    const columnMat = new THREE.MeshBasicMaterial({
      color: FLOW.data.clone().multiplyScalar(1.6),
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const column = new THREE.Mesh(COLUMN_GEO, columnMat);
    column.position.set(0, 13, 0);
    column.renderOrder = 2;
    hub.add(column);

    // ---- crown beacon: zone-coded color, breathing scale ----
    const spire = new THREE.Mesh(SPIRE_GEO, deckMat);
    spire.position.set(0, SHELL_H + 2, 0);
    spire.castShadow = true;
    hub.add(spire);
    const beaconMat = new THREE.MeshBasicMaterial({
      color: (ZONE_FLOW[d.id] ?? FLOW.data).clone().multiplyScalar(1.5),
    });
    const beacon = new THREE.Mesh(BEACON_GEO, beaconMat);
    beacon.position.set(0, SHELL_H + 3.5, 0);
    hub.add(beacon);

    specs.push({
      cx: px,
      cz: pz,
      hw: swapAxes ? INT_HD : INT_HW,
      hd: swapAxes ? INT_HW : INT_HD,
    });
    anims.push({ stripBase, stripMat, columnMat, columnMesh: column, beaconMesh: beacon, phase: hubIndex * 2.1 });
  });

  const update = (dt: number, elapsed: number): void => {
    void dt; // breathing is wall-clock driven (elapsed); dt stays in the contract
    for (const a of anims) {
      // warm strips breathe around their base color
      a.stripMat.color.copy(a.stripBase).multiplyScalar(1.15 + 0.25 * Math.sin(elapsed * 1.6 + a.phase));
      // light column micro pulse: opacity + radius, never a full blink
      a.columnMat.opacity = 0.55 + 0.1 * Math.sin(elapsed * 1.1 + a.phase * 0.7);
      const cr = 1 + 0.05 * Math.sin(elapsed * 1.3 + a.phase);
      a.columnMesh.scale.set(cr, 1, cr);
      // crown beacon slow breathing
      a.beaconMesh.scale.setScalar(1 + 0.3 * (0.5 + 0.5 * Math.sin(elapsed * 1.7 + a.phase * 1.3)));
    }
  };

  return { root, specs, update };
}
