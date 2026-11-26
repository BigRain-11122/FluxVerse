// Data contract: window.CITY_DATA is injected by tools/export-city-data.ps1
// (regenerated from world/world-state.json on a schedule, same pattern as
// MiniGame 硅基生命元宇宙-data.js). Shape mirrors the whitelist projection.

export interface CityZone {
  id: "gaming" | "quant" | "media" | string;
  name: string;
  status: string;
  activity: number; // 0..1
}

export interface FleetMachine {
  id: string;
  cores: number;
  online: boolean;
  current_task: string;
}

export interface CityEvent {
  ts_utc: string;
  type: string;
  actor?: string;
  zone?: string;
  summary?: string;
}

export interface StreetBehaviorEntry {
  district?: string;
  present?: number;
  [k: string]: unknown;
}

export interface CityData {
  gen_utc: string;
  protocol?: string;
  zones: CityZone[];
  fleet: FleetMachine[];
  census_total: number;
  reality: {
    city_day_phase: string;
    beijing_hhmm: string;
    weather_kind: string;
    weather_temp_c: string;
    season: string;
    weekday?: string;
  };
  city: {
    games_total?: number;
    games_active?: number;
    commits_total?: number;
    renders_total?: number;
    fleet_online?: number;
  };
  events_tail: CityEvent[];
  street_behavior?: StreetBehaviorEntry[];
}

declare global {
  interface Window {
    CITY_DATA?: CityData;
  }
}
