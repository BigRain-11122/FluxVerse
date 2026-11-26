import * as THREE from "three";

// 五色律 (DESIGN.md §九): 功能色铁律 —— 数据青 / 资金金 / 流量品红 / 警示红 / CEO 纯白.
export const FLOW = {
  data: new THREE.Color(0x5eead4), // gaming artery + windows
  capital: new THREE.Color(0xfbbf24), // quant
  traffic: new THREE.Color(0xf472b6), // media
  warn: new THREE.Color(0xf87171),
  ceo: new THREE.Color(0xffffff),
  brain: new THREE.Color(0x60a5fa),
};

export const ZONE_FLOW: Record<string, THREE.Color> = {
  gaming: FLOW.data,
  quant: FLOW.capital,
  media: FLOW.traffic,
  governance: FLOW.brain,
};

export const ZONE_LABEL: Record<string, string> = {
  gaming: "GAME 城",
  quant: "QUANT 城",
  media: "MEDIA 城",
  governance: "脑塔",
};

export interface PhasePalette {
  skyTop: THREE.Color;
  skyBottom: THREE.Color;
  fog: THREE.Color;
  sunColor: THREE.Color;
  sunIntensity: number;
  hemiSky: THREE.Color;
  hemiGround: THREE.Color;
  hemiIntensity: number;
  windowGain: number; // window brightness multiplier
  starOpacity: number;
  streetGain: number; // resident presence (dust) multiplier
  bodyGain: number; // building body brightness multiplier
  groundColor: THREE.Color;
}

const P = (
  skyTop: number, skyBottom: number, fog: number,
  sunColor: number, sunIntensity: number,
  hemiSky: number, hemiGround: number, hemiIntensity: number,
  windowGain: number, starOpacity: number, streetGain: number,
  bodyGain: number, groundColor: number,
): PhasePalette => ({
  skyTop: new THREE.Color(skyTop),
  skyBottom: new THREE.Color(skyBottom),
  fog: new THREE.Color(fog),
  sunColor: new THREE.Color(sunColor),
  sunIntensity,
  hemiSky: new THREE.Color(hemiSky),
  hemiGround: new THREE.Color(hemiGround),
  hemiIntensity,
  windowGain,
  starOpacity,
  streetGain,
  bodyGain,
  groundColor: new THREE.Color(groundColor),
});

// Keyframes over 24h (Beijing real time). Night -> dawn -> day -> dusk -> night.
const NIGHT = P(0x04060e, 0x0a1220, 0x05080f, 0x8ea6c8, 0.32, 0x1a2436, 0x05070c, 0.5, 1.0, 0.9, 0.12, 0.6, 0x060a12);
const DAWN = P(0x1c2a4c, 0xc98a72, 0x6a5a72, 0xffc9a0, 1.4, 0x3a4a6c, 0x141820, 0.7, 0.6, 0.35, 0.7, 0.9, 0x2c3246);
const DAY = P(0x6f9cd4, 0xc9dbee, 0xa8bcd2, 0xfff2dc, 2.2, 0x84a0c4, 0x394254, 0.78, 0.45, 0.0, 1.0, 1.45, 0x3d4a61);
const DUSK = P(0x2e2750, 0xc2743f, 0x7a4a48, 0xffb36b, 1.5, 0x3c3458, 0x181420, 0.75, 0.85, 0.4, 0.45, 1.0, 0x241f2a);

const KEYS: Array<{ h: number; p: PhasePalette }> = [
  { h: 0, p: NIGHT },
  { h: 4.5, p: NIGHT },
  { h: 6.5, p: DAWN },
  { h: 8.5, p: DAY },
  { h: 16.0, p: DAY },
  { h: 18.0, p: DUSK },
  { h: 20.0, p: NIGHT },
  { h: 24, p: NIGHT },
];

const _c = new THREE.Color();
function mixPalette(a: PhasePalette, b: PhasePalette, t: number): PhasePalette {
  return {
    skyTop: _c.copy(a.skyTop).lerp(b.skyTop, t).clone(),
    skyBottom: _c.copy(a.skyBottom).lerp(b.skyBottom, t).clone(),
    fog: _c.copy(a.fog).lerp(b.fog, t).clone(),
    sunColor: _c.copy(a.sunColor).lerp(b.sunColor, t).clone(),
    sunIntensity: a.sunIntensity + (b.sunIntensity - a.sunIntensity) * t,
    hemiSky: _c.copy(a.hemiSky).lerp(b.hemiSky, t).clone(),
    hemiGround: _c.copy(a.hemiGround).lerp(b.hemiGround, t).clone(),
    hemiIntensity: a.hemiIntensity + (b.hemiIntensity - a.hemiIntensity) * t,
    windowGain: a.windowGain + (b.windowGain - a.windowGain) * t,
    starOpacity: a.starOpacity + (b.starOpacity - a.starOpacity) * t,
    streetGain: a.streetGain + (b.streetGain - a.streetGain) * t,
    bodyGain: a.bodyGain + (b.bodyGain - a.bodyGain) * t,
    groundColor: _c.copy(a.groundColor).lerp(b.groundColor, t).clone(),
  };
}

export function paletteAt(hour: number): PhasePalette {
  for (let i = 0; i < KEYS.length - 1; i++) {
    const k0 = KEYS[i], k1 = KEYS[i + 1];
    if (hour >= k0.h && hour <= k1.h) {
      const t = (hour - k0.h) / (k1.h - k0.h);
      return mixPalette(k0.p, k1.p, t);
    }
  }
  return NIGHT;
}

export function phaseLabel(hour: number): string {
  if (hour >= 5 && hour < 7) return "晨";
  if (hour >= 7 && hour < 17) return "昼";
  if (hour >= 17 && hour < 19.5) return "黄昏";
  return "夜";
}
