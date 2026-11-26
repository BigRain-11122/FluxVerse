import * as THREE from "three";
import { FLOW } from "../palette";
import { lerp, mulberry32 } from "../util";

// ============================================================================
// Lujiazui landmark pair (lane B): Shanghai Tower + SWFC, silicon-future skin.
//
// Module contract, wired verbatim by the landmark-lane coordinator:
//   export interface LandmarkRig { root; update(dt, elapsed) }
//   export function buildShanghaiTower(): LandmarkRig
//   export function buildSwfc(): LandmarkRig
//
// Units: 1 unit = 1 m. Local origin sits at ground level (y = 0) in the
// footprint centre, north = -Z, so the coordinator only translates/rotates
// the returned root into the Lujiazui block.
//
// Style law (brainTower.ts baseline): bodies = MeshStandardMaterial, glows =
// MeshBasicMaterial in FLOW functional colors, castShadow only on the big
// structural pieces, and all static geometry shared as module-level
// constants (do NOT traverse-dispose them on scene rebuild).
// ============================================================================

export interface LandmarkRig {
  root: THREE.Group;
  update: (dt: number, elapsed: number) => void;
}

// ---------------------------------------------------------------- shared ----
// One unit box backs every glowing member in both landmarks (54 tower seams
// + 4 SWFC gold bars): per-strip size lives in mesh.scale, so ~60 meshes
// cost a single geometry.
const UNIT_BOX = new THREE.BoxGeometry(1, 1, 1);

// =========================================================== Shanghai Tower =
// 632 m twisting, tapering glass obelisk. Real-world targets: rounded
// triangle footprint ~84 m across, ~120 deg total twist, ~45 m across at top.
const ST_SEGS = 18;                  // stacked skin segments
const ST_SEG_H = 35;                 // 18 x 35 = 630 m shaft + crown halo => 632 m
const ST_BULGE = 0.14;               // r(theta) = R (1 + bulge * cos 3theta)
const ST_R0 = 42 / (1 + ST_BULGE);   // mean radius; corners reach 42 m => 84 m across
const ST_R1 = 22.5 / (1 + ST_BULGE); // top corners reach 22.5 m => 45 m across
const ST_TWIST = (Math.PI * 2) / 3;  // ~120 deg across the whole stack
const ST_STACK_H = ST_SEGS * ST_SEG_H;

// Mean skin radius at height y; the corner lobes sit at (1 + bulge) times it.
const stMeanR = (y: number): number => lerp(ST_R0, ST_R1, y / ST_STACK_H);

// Warp a cylinder into the rounded-triangle section: scaling r by
// 1 + bulge * cos(3 theta) keeps 3-fold symmetry, so the per-segment yaw
// actually reads as a twist (a pure circle would hide the rotation).
function stSkinGeometry(rTop: number, rBottom: number): THREE.CylinderGeometry {
  const geo = new THREE.CylinderGeometry(rTop, rBottom, ST_SEG_H, 72, 1, true);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const z = pos.getZ(i);
    const f = 1 + ST_BULGE * Math.cos(3 * Math.atan2(x, z));
    pos.setX(i, x * f);
    pos.setZ(i, z * f);
  }
  geo.computeVertexNormals();
  return geo;
}

// The tower is fully parametric, so the 18 taper steps are built once and
// shared by every build call (module-level geometry law).
const ST_SKIN_GEOS: THREE.CylinderGeometry[] = [];
for (let i = 0; i < ST_SEGS; i++) {
  ST_SKIN_GEOS.push(
    stSkinGeometry(lerp(ST_R0, ST_R1, (i + 1) / ST_SEGS), lerp(ST_R0, ST_R1, i / ST_SEGS)),
  );
}
const ST_CORE_GEO = new THREE.CylinderGeometry(14, 26, 630, 20); // solid dark core
const ST_CROWN_GEO = new THREE.TorusGeometry(23.5, 1.5, 10, 48); // tip halo

export function buildShanghaiTower(): LandmarkRig {
  const root = new THREE.Group();
  root.name = "landmark-shanghai-tower";
  const rng = mulberry32(0x5f1e21); // fixed seed: same tower on every reload

  // Translucent glass skin (spec: opacity 0.55, metalness 0.6, deep blue
  // 0x14263f) over a solid dark core: the twist must read as a layered glass
  // lantern, not a solid blob. DoubleSide + depthWrite:false lets both shell
  // walls blend over the core without depth-fighting each other.
  const glassMat = new THREE.MeshStandardMaterial({
    color: 0x14263f,
    transparent: true,
    opacity: 0.55,
    metalness: 0.6,
    roughness: 0.22,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  const coreMat = new THREE.MeshStandardMaterial({ color: 0x1c3050, roughness: 0.85, metalness: 0.15 });
  const seamMat = new THREE.MeshBasicMaterial({ color: FLOW.brain.clone().multiplyScalar(1.35) });
  const crownMat = new THREE.MeshBasicMaterial({ color: FLOW.data.clone().multiplyScalar(1.5) });

  // 18 stacked, progressively yawed skin segments: linear taper + 120/18 deg
  // per step. Neighbouring segments share identical boundary circles, so the
  // stack is gap-free while the corner lobes spiral upward.
  for (let i = 0; i < ST_SEGS; i++) {
    const skin = new THREE.Mesh(ST_SKIN_GEOS[i], glassMat);
    skin.position.y = i * ST_SEG_H + ST_SEG_H / 2;
    skin.rotation.y = (i / ST_SEGS) * ST_TWIST;
    skin.castShadow = true; // the skin is the body: full 84 m landmark shadow
    root.add(skin);
  }

  // Inner core column stays straight (the real core barely twists); it gives
  // the glass shell visual depth and anchors the shadow silhouette.
  const core = new THREE.Mesh(ST_CORE_GEO, coreMat);
  core.position.y = ST_STACK_H / 2;
  core.castShadow = true;
  root.add(core);

  // Silicon-future skin: 3 blue-white light seams per segment riding the
  // corner lobes. Each seam rotates WITH its segment, so the stack reads as
  // a helical light band climbing the twist.
  for (let i = 0; i < ST_SEGS; i++) {
    const theta0 = (i / ST_SEGS) * ST_TWIST;
    const y0 = i * ST_SEG_H;
    for (let k = 0; k < 3; k++) {
      const theta = theta0 + (k * Math.PI * 2) / 3;
      const sin = Math.sin(theta);
      const cos = Math.cos(theta);
      const r0 = stMeanR(y0) * (1 + ST_BULGE) + 0.25; // +0.25 keeps the face proud of the glass
      const r1 = stMeanR(y0 + ST_SEG_H) * (1 + ST_BULGE) + 0.25;
      const p0 = new THREE.Vector3(sin * r0, y0, cos * r0);
      const p1 = new THREE.Vector3(sin * r1, y0 + ST_SEG_H, cos * r1);
      const dir = new THREE.Vector3().subVectors(p1, p0);
      const strip = new THREE.Mesh(UNIT_BOX, seamMat);
      // Seeded width jitter: reads as hand-lit architecture, not cloned.
      strip.scale.set(0.85 + 0.3 * rng(), dir.length() + 0.8, 0.55);
      strip.position.copy(p0).add(p1).multiplyScalar(0.5);
      // Frame the strip: local Y along the lobe line, local X tangential,
      // local Z radial, so width/thickness stay stable on all three corners.
      const yAxis = dir.clone().normalize();
      const tangent = new THREE.Vector3(cos, 0, -sin);
      const zAxis = new THREE.Vector3().crossVectors(tangent, yAxis).normalize();
      const xAxis = new THREE.Vector3().crossVectors(yAxis, zAxis);
      strip.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(xAxis, yAxis, zAxis));
      root.add(strip);
    }
  }

  // Tip halo (crown ring): data-cyan breathing beacon; floats just above the
  // last skin ring, closing the tower at exactly 632 m.
  const crown = new THREE.Mesh(ST_CROWN_GEO, crownMat);
  crown.rotation.x = Math.PI / 2;
  crown.position.y = ST_STACK_H + 0.5;
  root.add(crown);

  const baseSeam = seamMat.color.clone();
  const baseCrown = crownMat.color.clone();
  const update = (dt: number, elapsed: number): void => {
    // Two clocks: seams breathe slowly, the crown ring pulses faster, so the
    // tower never reads as frozen. dt stays free for future wiring.
    seamMat.color.copy(baseSeam).multiplyScalar(0.8 + 0.26 * Math.sin(elapsed * 0.9));
    const pulse = 0.62 + 0.5 * Math.sin(elapsed * 1.7);
    crownMat.color.copy(baseCrown).multiplyScalar(pulse);
    crown.scale.setScalar(1 + 0.03 * Math.sin(elapsed * 1.7));
  };

  return { root, update };
}

// ==================================================================== SWFC =
// 492 m "bottle opener". Base 58 m square tapers into the top rectangle; the
// two legs notch apart above y = 436, the cap beam closes the frame at
// 486..492, and the 50 m sky gate remains as the natural cavity between them.
const SW_LEG_TOP = 486; // legs end; beam spans 486..492 (total height 492)
const SW_HOLE_Y0 = 436; // gate floor: hole height = 486 - 436 = 50 m
const SW_BASE = 58;     // base square 58 x 58 m
const SW_TOP_D = 24;    // top rectangle depth (z) => 40 x 24 at the cap
const SW_HALF_W = 29;   // base half width (x)

// East leg elevation (x = east, y = up): outer wall 29 -> 20, gate wall 11,
// notch floor at 15. The 0.3 m centre offset keeps the two legs' touching
// faces from z-fighting down the middle seam.
const SW_LEG_E: ReadonlyArray<readonly [number, number]> = [
  [0.15, 0], [29, 0], [20, SW_LEG_TOP], [11, SW_LEG_TOP], [15, SW_HOLE_Y0], [0.15, SW_HOLE_Y0],
];
// West leg = mirror + reversed order: reversing restores CCW winding so the
// extrude normals still face outward.
const SW_LEG_W: ReadonlyArray<readonly [number, number]> = [
  [-0.15, 0], [-0.15, SW_HOLE_Y0], [-15, SW_HOLE_Y0], [-11, SW_LEG_TOP], [-20, SW_LEG_TOP], [-29, 0],
];

// Extrude the elevation along z, then rescale z around the centre line by a
// height-linear factor (58 m -> 24 m): every face stays planar, so flat
// normals keep the prism crisp.
function swLegGeometry(points: ReadonlyArray<readonly [number, number]>): THREE.ExtrudeGeometry {
  const shape = new THREE.Shape();
  shape.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) shape.lineTo(points[i][0], points[i][1]);
  shape.closePath();
  const geo = new THREE.ExtrudeGeometry(shape, { depth: SW_BASE, bevelEnabled: false });
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const f1 = SW_TOP_D / SW_BASE;
  for (let i = 0; i < pos.count; i++) {
    const f = lerp(1, f1, pos.getY(i) / SW_LEG_TOP);
    pos.setZ(i, (pos.getZ(i) - SW_BASE / 2) * f);
  }
  geo.computeVertexNormals();
  return geo;
}

const SW_LEG_GEO_E = swLegGeometry(SW_LEG_E);
const SW_LEG_GEO_W = swLegGeometry(SW_LEG_W);
const SW_BEAM_GEO = new THREE.BoxGeometry(30, 6, 25);     // cap beam
const SW_STRUT_GEO = new THREE.BoxGeometry(2.4, 56, 7.5); // diagonal across the gate
const SW_BEACON_GEO = new THREE.SphereGeometry(1.5, 14, 10);

export function buildSwfc(): LandmarkRig {
  const root = new THREE.Group();
  root.name = "landmark-swfc";
  const rng = mulberry32(0x3c2d9a); // fixed seed: deterministic trim jitter

  // Material budget: one dark-glass standard for the whole body + two basic
  // glows (gold ring, white beacon).
  const bodyMat = new THREE.MeshStandardMaterial({ color: 0x2c4066, roughness: 0.3, metalness: 0.55 });
  const goldMat = new THREE.MeshBasicMaterial({ color: FLOW.capital.clone().multiplyScalar(1.3) });
  const beaconMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(1.1, 1.1, 1.25) });

  for (const geo of [SW_LEG_GEO_E, SW_LEG_GEO_W]) {
    const leg = new THREE.Mesh(geo, bodyMat);
    leg.castShadow = true;
    root.add(leg);
  }

  // Cap beam bridges the two legs and closes the tower at 492 m.
  const beam = new THREE.Mesh(SW_BEAM_GEO, bodyMat);
  beam.position.y = SW_LEG_TOP + 3;
  beam.castShadow = true;
  root.add(beam);

  // One diagonal strut from the gate's bottom corner (15, 437) up to the
  // opposite top corner (-11, 485): the single most recognizable SWFC line.
  const strut = new THREE.Mesh(SW_STRUT_GEO, bodyMat);
  strut.position.set(2, 461, 0);
  strut.rotation.z = Math.atan2(26, 48);
  strut.castShadow = true;
  root.add(strut);

  // Gold rim loop (capital x1.3) tracing the gate's inner edge: floor, cap,
  // and both sloped sides, sized to the local depth so the loop reads from
  // both street sides of the through-gate.
  const goldBar = (sx: number, sy: number, sz: number, x: number, y: number, rz: number): void => {
    const bar = new THREE.Mesh(UNIT_BOX, goldMat);
    bar.scale.set(sx * (0.95 + 0.1 * rng()), sy, sz); // seeded jitter: hand-set trim
    bar.position.set(x, y, 0);
    bar.rotation.z = rz;
    root.add(bar);
  };
  goldBar(31.2, 1.0, 28.3, 0, SW_HOLE_Y0 + 0.3, 0); // gate floor edge
  goldBar(23.2, 1.0, 24.8, 0, SW_LEG_TOP + 0.3, 0); // just under the cap beam
  goldBar(1.0, 51.4, 26.3, 13, 461, 0.08);          // east sloped side
  goldBar(1.0, 51.4, 26.3, -13, 461, -0.08);        // west sloped side

  // Tip beacon: white light point riding the cap beam.
  const beacon = new THREE.Mesh(SW_BEACON_GEO, beaconMat);
  beacon.position.y = SW_LEG_TOP + 7.2; // 493.2, just clear of the 492 m cap
  root.add(beacon);

  const baseGold = goldMat.color.clone();
  const update = (dt: number, elapsed: number): void => {
    // The money ring breathes slowly (quant pulse); dt reserved for wiring.
    goldMat.color.copy(baseGold).multiplyScalar(0.84 + 0.16 * Math.sin(elapsed * 0.55));
  };

  return { root, update };
}
