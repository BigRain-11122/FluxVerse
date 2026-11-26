/**
 * CityWeb slice consumer (lane B1) - the file:// data channel.
 *
 * Why this exists: in the shipped build the page is opened from disk, so the
 * origin is opaque and fetch/XHR/module imports are all blocked. A classic
 * <script src> still executes, so lane A1 emits every slice as a
 * self-registering script (JSONP style). It supports two registration paths:
 *
 *   // 1. callback path - taken when a consumer already installed the hook
 *   window.__citySlice("core", { gen_utc, count, bbox, buildings:[...] })
 *   // 2. registry path - taken when no hook existed at script load time
 *   (window.__citySlices = window.__citySlices || {})["core"] = payload
 *
 * This module owns the consumer side. It installs the callback eagerly at
 * module evaluation (so a slice script that loads AFTER this module still
 * takes the callback path) and also reads the shared registry (so a slice
 * that loaded BEFORE this module is not lost). Both paths stay lazy: the raw
 * int-E5 rings are only decoded on the first getCoreBuildings() call, then a
 * typed copy is kept and the raw arrays are dropped so the page never holds
 * two copies of ~100k coordinate pairs.
 *
 * No fetch, no DOM reads (only window property access), and no throw when
 * window is absent (Node/tests) - callers get null / present:false instead.
 */
import * as THREE from "three";

export interface SliceBuilding { name: string; h: number; ring: Array<[number, number]>; }
export interface SliceStatus { present: boolean; id: string; genUtc: string; count: number; bytesHint: string; }

type SliceCallback = (id: string, payload: unknown) => void;
type Bbox = [number, number, number, number]; // [minLat, minLon, maxLat, maxLon]

declare global {
  interface Window {
    /** Registry path: slice scripts write `__citySlices[<id>] = payload`. */
    __citySlices?: Record<string, unknown>;
    /** Callback path used by the emitted slice scripts (note the dunders). */
    __citySlice?: SliceCallback;
    /** Contract alias; some hosts expose the same hook without dunders. */
    citySlice?: SliceCallback;
    /** QA/log probe written by installSliceReporter(). */
    __CITY_SLICE__?: Record<string, unknown>;
  }
}

const CORE_ID = "core";
/** Slice coordinates are integer degrees * 1e5 (int32-safe, ~1.1 m grid). */
const E5 = 1e5;
/** Plausibility window: OSM junk (0 m sheds, 999 m placeholders) is dropped. */
const MIN_H = 3;
const MAX_H = 700;
const CAPTURE_MARK = "__fluxSliceCapture";

interface RawSlicePayload {
  id?: unknown;
  gen_utc?: unknown;
  count?: unknown;
  bbox?: unknown;
  buildings?: unknown;
}

interface DecodedSlice {
  id: string;
  genUtc: string;
  kept: number;
  total: number;
  skipped: number;
  bytes: number;
  bbox: Bbox | null;
  sig: string;
  buildings: SliceBuilding[];
}

let decoded: DecodedSlice | null = null;
let pending: RawSlicePayload | null = null;
let reporterInstalled = false;

function getWindow(): Window | null {
  // Why: the same module runs under Node (tsc/vm tests); never touch an
  // undeclared global there, just report "no channel" to the caller.
  return typeof window === "undefined" ? null : window;
}

function isRawPayload(v: unknown): v is RawSlicePayload {
  if (typeof v !== "object" || v === null) return false;
  const o = v as Record<string, unknown>;
  return Array.isArray(o.buildings) || typeof o.count === "number";
}

function isFiniteNumber(v: unknown): v is number {
  return typeof v === "number" && Number.isFinite(v);
}

function rawSignature(p: RawSlicePayload): string {
  const gen = typeof p.gen_utc === "string" ? p.gen_utc : "";
  const count = isFiniteNumber(p.count) ? p.count : -1;
  const len = Array.isArray(p.buildings) ? p.buildings.length : -1;
  return `${gen}|${count}|${len}`;
}

function toBbox(v: unknown): Bbox | null {
  if (!Array.isArray(v) || v.length < 4) return null;
  const [a, b, c, d] = v as unknown[];
  if (!isFiniteNumber(a) || !isFiniteNumber(b) || !isFiniteNumber(c) || !isFiniteNumber(d)) return null;
  return [a, b, c, d];
}

function formatBytes(n: number): string {
  if (!isFiniteNumber(n) || n <= 0) return "unknown";
  if (n < 1024) return `${n}B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)}KB`;
  return `${(n / (1024 * 1024)).toFixed(2)}MB`;
}

/**
 * Decode one payload into the typed form realCity expects. Skipped entries are
 * counted, not silently dropped: a slice that loses most of its buildings has
 * to be visible in QA, not just smaller on screen.
 */
function decodePayload(p: RawSlicePayload): DecodedSlice {
  let bytes = 0;
  try {
    // Measured once, before release: the exact serialized size is the only
    // honest "bytesHint" available on a channel with no HTTP headers.
    bytes = JSON.stringify(p).length;
  } catch {
    bytes = 0; // cyclic/frozen oddities: fall back to "unknown"
  }

  const genUtc = typeof p.gen_utc === "string" ? p.gen_utc : "";
  const claimed = isFiniteNumber(p.count) ? p.count : 0;
  const list: unknown[] = Array.isArray(p.buildings) ? (p.buildings as unknown[]) : [];
  const buildings: SliceBuilding[] = [];
  let skipped = 0;

  for (const entry of list) {
    const b = (typeof entry === "object" && entry !== null ? entry : {}) as Record<string, unknown>;
    const ringRaw: unknown[] = Array.isArray(b["r"]) ? (b["r"] as unknown[]) : [];
    const ring: Array<[number, number]> = [];

    for (const pt of ringRaw) {
      if (!Array.isArray(pt) || pt.length < 2) continue;
      const pair = pt as unknown[];
      const latE5 = pair[0];
      const lonE5 = pair[1];
      if (!isFiniteNumber(latE5) || !isFiniteNumber(lonE5)) continue;
      const lat = latE5 / E5;
      const lon = lonE5 / E5;
      // Why the range guard: a single bad int still divides into a number, so
      // only a geographic range check catches truncated/garbage coordinates.
      if (lat < -90 || lat > 90 || lon < -180 || lon > 180) continue;
      ring.push([lat, lon]);
    }

    const h = isFiniteNumber(b["h"]) ? (b["h"] as number) : Number.NaN;
    if (ring.length < 3 || !(h >= MIN_H && h <= MAX_H)) {
      skipped++;
      continue;
    }
    const name = typeof b["n"] === "string" ? (b["n"] as string).trim() : "";
    buildings.push({ name, h, ring });
  }

  return {
    id: typeof p.id === "string" && p.id.length > 0 ? (p.id as string) : CORE_ID,
    genUtc,
    kept: buildings.length,
    total: claimed > 0 ? claimed : list.length,
    skipped,
    bytes,
    bbox: toBbox(p.bbox),
    sig: rawSignature(p),
    buildings,
  };
}

/** Pop the next undecoded payload: callback capture first, then the registry. */
function pullRaw(): RawSlicePayload | null {
  if (pending) {
    const p = pending;
    pending = null;
    return p;
  }
  const box = getWindow()?.__citySlices;
  if (!box) return null;
  const candidate = box[CORE_ID];
  return isRawPayload(candidate) ? candidate : null;
}

/**
 * Drop every reference to the raw payload. The slice script's arrays are the
 * biggest transient allocation in the app (1721 rings ~ 100k pairs), so they
 * must not survive alongside the typed copy.
 */
function releaseRaw(p: RawSlicePayload): void {
  if (pending === p) pending = null;
  const box = getWindow()?.__citySlices;
  if (box && box[CORE_ID] === p) box[CORE_ID] = undefined;
  try {
    p.buildings = undefined;
  } catch {
    // Frozen payload (tightened host object): the typed copy still exists.
  }
}

function captureCore(id: string, payload: unknown): void {
  if (id !== CORE_ID || !isRawPayload(payload)) return;
  pending = payload;
  if (reporterInstalled) writeReporter();
}

function installCallbackHook(): void {
  const w = getWindow();
  if (!w) return;

  for (const key of ["__citySlice", "citySlice"] as const) {
    const prev = w[key];
    if (prev && (prev as unknown as Record<string, unknown>)[CAPTURE_MARK] === true) continue; // already ours
    const hook: SliceCallback = (id: string, payload: unknown) => {
      captureCore(id, payload);
      if (prev) {
        try {
          prev(id, payload); // never break another consumer's handler
        } catch {
          /* foreign handler errors are not ours to propagate */
        }
      }
    };
    (hook as unknown as Record<string, unknown>)[CAPTURE_MARK] = true;
    w[key] = hook;
  }
}

export function hasCoreSlice(): boolean {
  if (decoded || pending) return true;
  const box = getWindow()?.__citySlices;
  return !!box && isRawPayload(box[CORE_ID]);
}

export function getCoreBuildings(): SliceBuilding[] | null {
  const raw = pullRaw();
  if (raw) {
    try {
      // Re-decode only when the generation actually changed, so repeated
      // callers pay nothing and hot-reload "new slice" still wins.
      if (!decoded || decoded.sig !== rawSignature(raw)) {
        decoded = decodePayload(raw);
        if (reporterInstalled) writeReporter();
      }
    } catch {
      // A malformed payload must not crash the render loop; report absence.
      decoded = null;
    } finally {
      releaseRaw(raw);
    }
  }
  return decoded ? decoded.buildings : null;
}

export function sliceStatus(): SliceStatus {
  const present = hasCoreSlice();
  if (decoded) {
    return {
      present,
      id: decoded.id,
      genUtc: decoded.genUtc,
      count: decoded.kept,
      bytesHint: formatBytes(decoded.bytes),
    };
  }
  // Not decoded yet: report the payload's own claim without paying the decode.
  const raw = pending ?? (() => {
    const c = getWindow()?.__citySlices?.[CORE_ID];
    return isRawPayload(c) ? c : null;
  })();
  return {
    present,
    id: CORE_ID,
    genUtc: raw && typeof raw.gen_utc === "string" ? raw.gen_utc : "",
    count: raw && isFiniteNumber(raw.count) ? raw.count : 0,
    // Two distinct honest states: a payload exists but is not decoded yet
    // ("unmeasured"), versus no channel data at all ("unknown").
    bytesHint: raw ? "unmeasured" : "unknown",
  };
}

/** Entries rejected by the [3,700] height / <3-point ring rules. */
export function sliceSkipCount(): number {
  return decoded ? decoded.skipped : 0;
}

/** Payload bbox [minLat, minLon, maxLat, maxLon] for QA sanity checks. */
export function sliceBbox(): Bbox | null {
  return decoded ? decoded.bbox : null;
}

function writeReporter(): void {
  const w = getWindow();
  if (!w) return;
  const st = sliceStatus();
  w.__CITY_SLICE__ = {
    present: st.present,
    id: st.id,
    genUtc: st.genUtc,
    count: st.count,
    bytesHint: st.bytesHint,
    decoded: !!decoded,
    kept: decoded ? decoded.kept : 0,
    total: decoded ? decoded.total : st.count,
    skipped: sliceSkipCount(),
    bbox: sliceBbox(),
    at: new Date().toISOString(),
  };
}

/** Expose the slice state on window.__CITY_SLICE__ for QA probes and logging. */
export function installSliceReporter(): void {
  reporterInstalled = true;
  writeReporter();
}

// Install at module evaluation, not on first call: the slice <script> decides
// between the callback and registry paths purely by whether the hook exists
// when it runs, so waiting would silently push us onto the registry path.
installCallbackHook();

// THREE is part of the frozen contract for this module signature; keep the
// namespace import so future slice geometry helpers can use it without a
// second import churn (tree-shaken when unused).
void THREE;
