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
  // 外形特征（2026-11-26 CEO「每个人都要有自己的特征」）：来自卡面六 hex 换装位
  // + 性别/年龄/发型/瞳型。three.js 侧按这些字段搭几何体，禁随机脸——
  // 随机生成的脸等于没有特征（看不出是谁）。
  gender?: string;
  age?: number;
  hair_part?: string;
  eye_part?: string;
  skin_c?: string;
  hair_c?: string;
  cloth_c?: string;
  pant_c?: string;
  badge_c?: string;
  eye_c?: string;
  faction?: string;
  // 行为层（2026-11-26 共用技术底座 v1：cph4/city-foundation.md §三）：
  // 语义在 BigLife（Tools/city_agents.py 的行动闭环），几何在本仓。
  // place 只能是 cph4/city-foundation/places.json 里声明过的名字；
  // act 只取 work|move|seek|rest|wait；with 是本拍同地点搭话的居民 id。
  // 缺失时本仓关闭行为层（居民按原样站位），绝不拿占位动作冒充"在动"。
  place?: string;
  act?: string;
  act_label?: string;
  with?: string;
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
