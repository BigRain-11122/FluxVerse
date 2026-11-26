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
  // 2026-11-26 BigLife 融合：32 席挂牌居民（年轮按 id 直读卡面）与观察流传播边。
  // 由 tools/export-city-data.ps1 从 world-public/city-bridge.json 投影；
  // 缺省时居民层不生成（禁装饰律：不放假人）。
  residents?: ResidentEntry[];
  echoes?: EchoEntry[];
}

export interface ResidentEntry {
  id: string;
  name?: string;
  district?: string;
  profession?: string;
  ring?: string;
  goal_done?: number | null;
  goal_total?: number | null;
}

export interface EchoEntry {
  owner?: string;
  by?: string;
  day?: string;
  frag?: string;
  // 2026-11-26：两端城区（GM/QT/...），用于「城区→城区」退化弧
  owner_d?: string;
  by_d?: string;
}

declare global {
  interface Window {
    CITY_DATA?: CityData;
  }
}
