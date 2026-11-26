import type { CityData } from "./types";

// Mock data only used when window.CITY_DATA is absent (dev server without
// export step). HUD shows a DEMO badge so fake data can never pose as live.
function mock(): CityData {
  return {
    gen_utc: new Date().toISOString(),
    zones: [
      { id: "gaming", name: "FLUX Gaming", status: "active", activity: 0.9 },
      { id: "quant", name: "FLUX Quant", status: "dormant", activity: 0.15 },
      { id: "media", name: "FLUX Media", status: "dormant", activity: 0.4 },
    ],
    fleet: [
      { id: "bm-a", cores: 32, online: true, current_task: "cityweb dev" },
      { id: "bm-b", cores: 16, online: false, current_task: "idle" },
      { id: "bm-c", cores: 32, online: false, current_task: "idle" },
      { id: "BG-A", cores: 16, online: false, current_task: "idle" },
      { id: "BG-B", cores: 8, online: false, current_task: "idle" },
      { id: "BG-C", cores: 16, online: false, current_task: "idle" },
    ],
    census_total: 10114,
    reality: {
      city_day_phase: "night",
      beijing_hhmm: new Date().toTimeString().substring(0, 5),
      weather_kind: "clear",
      weather_temp_c: "16",
      season: "autumn",
    },
    city: { games_total: 34, games_active: 9, commits_total: 47093, renders_total: 105, fleet_online: 1 },
    events_tail: [
      { ts_utc: "", type: "COMMIT", zone: "gaming", summary: "demo data" },
      { ts_utc: "", type: "CEO_ORDER", zone: "governance", summary: "demo data" },
      { ts_utc: "", type: "GAME_STAGE", zone: "gaming", summary: "demo data" },
    ],
  };
}

export function getCityData(): CityData {
  return window.CITY_DATA ?? mock();
}

export function isLive(): boolean {
  return !!window.CITY_DATA;
}
