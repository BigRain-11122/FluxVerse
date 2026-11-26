// Player life state — the energy / annals / notoriety triangle (P2 lane).
// Canon: CityWeb/docs/player-gameplay-vocation.md
//   §2 源质底稿 — you are not born blank: 3 axes summing 9 points + 1 lifetime brand.
//   §4 生存闭环 — energy is daily fuel, annals are existence length, reputation is
//      social position, and PRIOR RECORD SURVIVES A VOCATION CHANGE (前科保留律).
// Bitburner design adoption: all progression is a handful of plain numbers in one
// serialisable snapshot, and every mutation goes through a rig, so the save file is
// always the truth and a reload can be reconstructed from it alone. No DOM, no
// third-party deps — the whole module runs in Node for tests.

// ---------------------------------------------------------------- constants

export const STORAGE_KEY = "cityweb.life.v1";
/** Bump together with a migration branch in hydrate() — never silently re-use a slot. */
export const SCHEMA_VERSION = 1;

export const ENERGY_MAX = 100;
export const ENERGY_MIN = 0;
/** 100 energy over 72 h ≈ 1.389/h: three days of fuel is the pacing spine of the loop. */
export const ENERGY_DRAIN_PER_HOUR = ENERGY_MAX / 72;
/** Return after a week away and you are not dead, but you are not handed the week back. */
export const OFFLINE_CAP_HOURS = 24;

export const GENOME_POINTS = 9;
export const GENOME_AXIS_MIN = 1;
export const GENOME_AXIS_MAX = 5;
export const GENOME_AXES = 3;

/** 年轮满龄 — at least one full ring before the 异化 (prestige) ritual unlocks. */
export const PRESTIGE_MIN_ANNALS = 1;

export const MS_PER_HOUR = 3_600_000;

/**
 * 底稿烙印池 — exactly 3 ids. Only the id is stored; the effect belongs to the
 * consumer (P1 avatar / P3 vocation / movement) so balance can move without a
 * save migration. Kept here as the single documented list.
 */
export const GENOME_BRANDS = [
  { id: "nightRunner", name: "夜行者", effect: "夜间能量恢复 +20%" },
  { id: "urbanGhost", name: "都市幽灵", effect: "被通缉时移速 +15%" },
  { id: "spotlight", name: "聚光体", effect: "人多处年轮加速" },
] as const;

export type BrandId = typeof GENOME_BRANDS[number]["id"];

// ---------------------------------------------------------------- types

/** 源质底稿：出生带的底稿，不是白纸，也不是锁定命运（canon §2）。 */
export interface GenomeDraft {
  body: number;        // 体魄 1~5
  mind: number;        // 心智 1~5
  resonance: number;   // 共鸣（社交力）1~5
  brand: string;       // 终身烙印 id（见 GENOME_BRANDS），效果留给消费方
}

export interface LifeSnapshot {
  version: 1;
  genome: GenomeDraft;
  energy: number;          // 0~100 日常燃料
  annals: number;          // 年轮（prestige 层）0+
  rep: number;             // 正名声
  wanted: number;          // 负名声（前科保留律：换职业不清零）
  crimes: string[];        // 前科列表（罪名@时间戳）
  vocation: string | null; // 当前职业 id
  lastSeenMs: number;      // 离线补算锚
  createdAtMs: number;
}

export interface LifeStateRig {
  snapshot: LifeSnapshot;
  tick(nowMs: number): void;
  gainEnergy(v: number): void;
  gainAnnals(v: number): void;
  addRep(v: number): void;
  addWanted(v: number, crime?: string): void;
  setVocation(id: string | null): void;
  canPrestige(): boolean;
  prestige(): boolean;
  save(): void;
  reset(): void;
}

// Storage is accessed through this guard so the module never touches DOM types
// directly and stays importable under Node (no localStorage => in-memory only).
interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

// ---------------------------------------------------------------- genome draft

/**
 * Roll a fresh 源质底稿: every axis starts at 1, the remaining 6 points are dropped
 * one at a time into a random axis that is not yet at 5 (total is always 9).
 * `rng` is injected so the birth is reproducible in tests (util.ts mulberry32).
 */
export function rollGenome(rng: () => number): GenomeDraft {
  const axes: [number, number, number] = [GENOME_AXIS_MIN, GENOME_AXIS_MIN, GENOME_AXIS_MIN];
  let pool = GENOME_POINTS - GENOME_AXIS_MIN * GENOME_AXES; // 6

  while (pool > 0) {
    const open: number[] = [];
    for (let i = 0; i < axes.length; i++) if (axes[i] < GENOME_AXIS_MAX) open.push(i);
    if (open.length === 0) break; // defensive: pool always drains before this
    const pick = open[pickIndex(rng, open.length)];
    axes[pick] += 1;
    pool -= 1;
  }

  return {
    body: axes[0],
    mind: axes[1],
    resonance: axes[2],
    brand: GENOME_BRANDS[pickIndex(rng, GENOME_BRANDS.length)].id,
  };
}

// ---------------------------------------------------------------- rig

class LifeRig implements LifeStateRig {
  snapshot: LifeSnapshot;

  constructor(snapshot: LifeSnapshot) {
    this.snapshot = snapshot;
  }

  /**
   * Burn fuel for the elapsed wall-clock time since the last anchor, capped at
   * OFFLINE_CAP_HOURS so a long absence drains a day, not a week. The anchor always
   * advances, so repeated ticks never double-charge the same interval.
   */
  tick(nowMs: number): void {
    const s = this.snapshot;
    const elapsedMs = nowMs - s.lastSeenMs;
    if (!Number.isFinite(nowMs) || elapsedMs <= 0) {
      // Clock going backwards must not mint energy later: keep the later anchor.
      if (Number.isFinite(nowMs) && nowMs > 0) s.lastSeenMs = Math.max(s.lastSeenMs, nowMs);
      return;
    }
    const hours = Math.min(elapsedMs / MS_PER_HOUR, OFFLINE_CAP_HOURS);
    s.energy = clampEnergy(s.energy - hours * ENERGY_DRAIN_PER_HOUR);
    s.lastSeenMs = nowMs;
  }

  gainEnergy(v: number): void {
    if (!Number.isFinite(v)) return;
    this.snapshot.energy = clampEnergy(this.snapshot.energy + v);
  }

  gainAnnals(v: number): void {
    if (!Number.isFinite(v)) return;
    this.snapshot.annals = Math.max(0, round3(this.snapshot.annals + v));
  }

  addRep(v: number): void {
    if (!Number.isFinite(v)) return;
    // 负名声归 wanted: rep never goes below zero, it just cannot sink further.
    this.snapshot.rep = Math.max(0, round3(this.snapshot.rep + v));
  }

  /** Raise notoriety; an optional crime name is appended to the prior-record list. */
  addWanted(v: number, crime?: string): void {
    if (Number.isFinite(v)) this.snapshot.wanted = Math.max(0, round3(this.snapshot.wanted + v));
    if (crime) this.snapshot.crimes.push(`${crime}@${new Date().toISOString()}`);
  }

  /**
   * 前科保留律: changing vocation changes nothing about the record. The wanted
   * rating, the crime list and the reputation all survive — that continuity cost is
   * what makes "living another life" feel real (canon §4).
   */
  setVocation(id: string | null): void {
    this.snapshot.vocation = id;
  }

  canPrestige(): boolean {
    return this.snapshot.energy >= ENERGY_MAX && this.snapshot.annals >= PRESTIGE_MIN_ANNALS;
  }

  /**
   * 异化仪式: one more ring, energy emptied to pay for it. The draft (genome), the
   * social record (rep/wanted/crimes) and the vocation are deliberately preserved.
   */
  prestige(): boolean {
    if (!this.canPrestige()) return false;
    this.snapshot.annals += 1;
    this.snapshot.energy = ENERGY_MIN;
    return true;
  }

  save(): void {
    const store = getStorage();
    if (!store) return; // Node / private mode: keep running from the in-memory draft
    try {
      store.setItem(STORAGE_KEY, JSON.stringify(this.snapshot));
    } catch (err) {
      warn("save failed (quota/security); state kept in memory", err);
    }
  }

  /** 新档: re-roll the draft, wipe the life, keep nothing. */
  reset(): void {
    const now = Date.now();
    this.snapshot = newSnapshot(rollGenome(Math.random), now);
    this.save();
  }
}

// ---------------------------------------------------------------- load / persist

export function loadLifeState(nowMs: number = Date.now()): LifeStateRig {
  const stored = readSnapshot();
  const rig = new LifeRig(stored ?? newSnapshot(rollGenome(Math.random), nowMs));
  // Catch-up happens on load, never in the render loop's first frame: the elapsed
  // span is measured from lastSeenMs, so a refresh mid-session is harmless.
  rig.tick(nowMs);
  // A fresh draft (first visit, corrupt file, future schema) must be persisted now,
  // otherwise the next reload would re-roll a different genome.
  if (!stored) rig.save();
  return rig;
}

function newSnapshot(genome: GenomeDraft, nowMs: number): LifeSnapshot {
  return {
    version: SCHEMA_VERSION,
    genome,
    energy: ENERGY_MAX,
    annals: 0,
    rep: 0,
    wanted: 0,
    crimes: [],
    vocation: null,
    lastSeenMs: nowMs,
    createdAtMs: nowMs,
  };
}

function readSnapshot(): LifeSnapshot | null {
  const store = getStorage();
  if (!store) return null;

  let raw: string | null = null;
  try {
    raw = store.getItem(STORAGE_KEY);
  } catch (err) {
    warn("read failed; starting a fresh draft", err);
    return null;
  }
  if (!raw) return null;

  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch (err) {
    warn("corrupt save; starting a fresh draft", err);
    return null;
  }
  return hydrate(data);
}

/**
 * Structural check of a parsed save. Anything unusable returns null, which the caller
 * treats as "rebuild a fresh draft" — a player never sees a crash from a bad slot.
 * Numeric drift (energy 120, annals -3) is clamped instead of discarded: the life is
 * still the same life.
 */
function hydrate(data: unknown): LifeSnapshot | null {
  if (!isRecord(data)) return null;

  if (data.version !== SCHEMA_VERSION) {
    // TODO(migration): when v2 lands, upgrade v1 here (add fields, rescale energy)
    // instead of dropping the save. v1 is the first persisted schema.
    warn(`schema v${String(data.version)} != v${SCHEMA_VERSION}; rebuilding a fresh draft`);
    return null;
  }

  const g = data.genome;
  if (!isRecord(g) || !isNum(g.body) || !isNum(g.mind) || !isNum(g.resonance)) return null;
  if (!isNum(data.energy) || !isNum(data.annals) || !isNum(data.rep) || !isNum(data.wanted)) return null;
  if (!isNum(data.lastSeenMs) || !isNum(data.createdAtMs)) return null;
  if (data.crimes !== undefined && !Array.isArray(data.crimes)) return null;
  if (data.vocation !== undefined && data.vocation !== null && typeof data.vocation !== "string") return null;

  const genome: GenomeDraft = {
    body: clampAxis(g.body),
    mind: clampAxis(g.mind),
    resonance: clampAxis(g.resonance),
    // Unknown brand ids are kept as-is: a forward-written save keeps its identity,
    // its effect simply resolves to nothing until the pool catches up.
    brand: typeof g.brand === "string" && g.brand ? g.brand : GENOME_BRANDS[0].id,
  };

  return {
    version: SCHEMA_VERSION,
    genome,
    energy: clampEnergy(data.energy),
    annals: Math.max(0, data.annals),
    rep: Math.max(0, data.rep),
    wanted: Math.max(0, data.wanted),
    crimes: Array.isArray(data.crimes) ? data.crimes.filter((c): c is string => typeof c === "string") : [],
    vocation: typeof data.vocation === "string" ? data.vocation : null,
    lastSeenMs: data.lastSeenMs,
    createdAtMs: data.createdAtMs,
  };
}

// ---------------------------------------------------------------- helpers

function getStorage(): StorageLike | null {
  const g = globalThis as unknown as { localStorage?: StorageLike };
  try {
    return g.localStorage ?? null;
  } catch {
    return null; // access itself can throw when storage is disabled by policy
  }
}

function clampEnergy(v: number): number {
  return round3(Math.min(ENERGY_MAX, Math.max(ENERGY_MIN, v)));
}

function clampAxis(v: number): number {
  return Math.min(GENOME_AXIS_MAX, Math.max(GENOME_AXIS_MIN, Math.round(v)));
}

function round3(v: number): number {
  return Math.round(v * 1000) / 1000;
}

/** rng() is contractually [0,1); clamp anyway so a 1.0 never indexes out of bounds. */
function pickIndex(rng: () => number, length: number): number {
  const r = rng();
  const safe = Number.isFinite(r) ? r : 0;
  return Math.min(length - 1, Math.max(0, Math.floor(safe * length)));
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function isNum(v: unknown): v is number {
  return typeof v === "number" && Number.isFinite(v);
}

function warn(message: string, err?: unknown): void {
  if (typeof console !== "undefined" && typeof console.warn === "function") {
    if (err === undefined) console.warn(`[lifeState] ${message}`);
    else console.warn(`[lifeState] ${message}:`, err);
  }
}
