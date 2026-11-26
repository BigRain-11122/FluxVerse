import * as THREE from "three";
import { paletteAt, phaseLabel } from "../palette";
import type { CityData } from "../types";
import type { PhasePalette } from "../palette";

// Real Beijing time drives the whole lighting cycle (clock probe source of
// truth; local machine clock advances it between data refreshes).

const SKY_VERT = `
varying vec3 vPos;
void main() {
  vPos = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

const SKY_FRAG = `
uniform vec3 topColor;
uniform vec3 bottomColor;
uniform float offset;
uniform float exponent;
varying vec3 vPos;
void main() {
  float h = normalize(vPos + vec3(0.0, offset, 0.0)).y;
  float t = pow(max(h, 0.0), exponent);
  gl_FragColor = vec4(mix(bottomColor, topColor, t), 1.0);
}`;

export interface SkyRig {
  mesh: THREE.Mesh;
  uniforms: { topColor: { value: THREE.Color }; bottomColor: { value: THREE.Color }; offset: { value: number }; exponent: { value: number } };
  stars: THREE.Points;
  starMat: THREE.PointsMaterial;
}

export function buildSky(): SkyRig {
  const uniforms = {
    topColor: { value: new THREE.Color(0x04060e) },
    bottomColor: { value: new THREE.Color(0x0a1220) },
    offset: { value: 120 },
    exponent: { value: 0.7 },
  };
  const mat = new THREE.ShaderMaterial({
    uniforms, vertexShader: SKY_VERT, fragmentShader: SKY_FRAG,
    side: THREE.BackSide, depthWrite: false, fog: false,
  });
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(880, 24, 16), mat);
  mesh.frustumCulled = false;

  // Stars (visible at night).
  const count = 900;
  const positions = new Float32Array(count * 3);
  const rngState = 1234567;
  let s = rngState;
  const rand = () => { s = (s * 1103515245 + 12345) & 0x7fffffff; return s / 0x7fffffff; };
  for (let i = 0; i < count; i++) {
    const theta = rand() * Math.PI * 2;
    const phi = Math.acos(rand() * 0.85 + 0.1);
    const r = 820;
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = Math.abs(r * Math.cos(phi));
    positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
  }
  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const starMat = new THREE.PointsMaterial({
    color: 0xcfe0ff, size: 1.6, sizeAttenuation: false,
    transparent: true, opacity: 0.9, depthWrite: false, fog: false,
  });
  const stars = new THREE.Points(starGeo, starMat);
  stars.frustumCulled = false;

  return { mesh, uniforms, stars, starMat };
}

export class DayNight {
  private baseHour: number;
  private basePerf: number;
  private sun: THREE.DirectionalLight;
  private hemi: THREE.HemisphereLight;
  private sky: SkyRig;
  private scene: THREE.Scene;
  private data: CityData;
  private bodyMat: THREE.MeshStandardMaterial | null = null;
  private groundMat: THREE.MeshStandardMaterial | null = null;
  private fog: THREE.FogExp2;
  breathBoost = 0; // decaying envelope set by OS_TICK performances
  zoneGain: Map<string, number> = new Map();
  windowMats: Map<string, THREE.MeshBasicMaterial> = new Map();
  flowMats: THREE.MeshBasicMaterial[] = [];
  dustMat: THREE.PointsMaterial | null = null;

  constructor(scene: THREE.Scene, sun: THREE.DirectionalLight, hemi: THREE.HemisphereLight, sky: SkyRig, data: CityData) {
    this.scene = scene;
    this.sun = sun;
    this.hemi = hemi;
    this.sky = sky;
    this.data = data;
    const hhmm = data.reality.beijing_hhmm || "12:00";
    const [h, m] = hhmm.split(":").map((x) => parseInt(x, 10) || 0);
    this.baseHour = h + m / 60;
    this.basePerf = performance.now();
    this.fog = new THREE.FogExp2(0x05080f, 0.0007);
    scene.fog = this.fog;
    for (const z of data.zones) {
      this.zoneGain.set(z.id, 0.45 + 0.55 * Math.min(1, Math.max(0, z.activity)));
    }
  }

  attachMaterials(bodyMat: THREE.MeshStandardMaterial, groundMat: THREE.MeshStandardMaterial): void {
    this.bodyMat = bodyMat;
    this.groundMat = groundMat;
  }

  hour(): number {
    const elapsedH = (performance.now() - this.basePerf) / 3600000;
    return (this.baseHour + elapsedH) % 24;
  }

  label(): string {
    return phaseLabel(this.hour());
  }

  update(): void {
    const hour = this.hour();
    const p: PhasePalette = paletteAt(hour);

    // Sky + fog.
    this.sky.uniforms.topColor.value.copy(p.skyTop);
    this.sky.uniforms.bottomColor.value.copy(p.skyBottom);
    this.fog.color.copy(p.fog);
    this.sky.starMat.opacity = p.starOpacity;

    // Sun / moon direction.
    const dayT = (hour - 6) / 12; // 0..1 across daytime
    let sx: number, sy: number, sz: number;
    if (dayT >= 0 && dayT <= 1) {
      sx = Math.cos(Math.PI * (1 - dayT)) * 500;
      sy = Math.max(40, Math.sin(Math.PI * dayT) * 500);
      sz = 220;
    } else {
      sx = -300; sy = 420; sz = -260; // moon
    }
    this.sun.position.set(sx, sy, sz);
    this.sun.color.copy(p.sunColor);
    this.sun.intensity = p.sunIntensity;

    this.hemi.color.copy(p.hemiSky);
    this.hemi.groundColor.copy(p.hemiGround);
    this.hemi.intensity = p.hemiIntensity;

    // Windows: day/night gain x zone activity + breath envelope.
    const breath = this.breathBoost;
    for (const [zoneId, mat] of this.windowMats) {
      const zone = this.zoneGain.get(zoneId) ?? 0.5;
      const gain = p.windowGain * zone + breath;
      const flow = mat.userData.flowColor as THREE.Color;
      mat.color.copy(flow).multiplyScalar(Math.max(0.10, gain));
    }
    // Artery flow lines glow more at night.
    for (const fm of this.flowMats) {
      const flow = fm.userData.flowColor as THREE.Color;
      fm.color.copy(flow).multiplyScalar(0.55 + 0.85 * p.windowGain + breath * 0.5);
    }
    // Body + ground follow the phase so daytime reads as daytime.
    this.bodyMat?.color.setScalar(p.bodyGain);
    this.groundMat?.color.copy(p.groundColor);
    if (this.dustMat) {
      this.dustMat.opacity = 0.5 * p.streetGain;
    }
    this.breathBoost = Math.max(0, this.breathBoost - 0.0035);
  }
}
