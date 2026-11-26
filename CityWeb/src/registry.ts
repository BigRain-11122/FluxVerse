// Module registry: the single coupling ledger of the silicon city.
// Total-coordinator (总管) owns this file. Lanes never import each other;
// this table is where every module meets the wiring layer (docs/parallel-governance.md).
// Adding a lane delivery = one row here + one line in main.ts. Removing = delete both.

export interface ModuleRow {
  id: string;                       // unique, matches the rig build id
  file: string;                     // source path under src/
  build: string;                    // exported builder function name
  update: string;                   // update signature (as wired in main.ts)
  lane: string;                     // origin lane/wave (or "core")
  dcBudget: number;                 // draw-call budget (perf audit gate)
  notes?: string;
}

export const REGISTRY: ModuleRow[] = [
  // ---- core (城市底座) ----
  { id: "realCity", file: "geo/realCity.ts", build: "buildRealCity", update: "(frame)", lane: "core", dcBudget: 6, notes: "OSM footprints+river+island+colliders" },
  { id: "brainTower", file: "city/brainTower.ts", build: "buildBrainTower", update: "(dt,elapsed via messengers)", lane: "core", dcBudget: 8 },
  { id: "masts", file: "city/masts.ts", build: "buildMasts", update: "(via beaconMats)", lane: "core", dcBudget: 4 },
  { id: "realSky", file: "render/realSky.ts", build: "buildRealSky", update: "(hour,elapsed)", lane: "w5-A", dcBudget: 2, notes: "official Sky" },
  { id: "riverWater", file: "geo/riverWater.ts", build: "buildRiverWater", update: "(dt,elapsed)", lane: "w5-B", dcBudget: 2, notes: "official Water" },
  { id: "postfx", file: "render/postfx.ts", build: "buildComposer", update: "(frame)", lane: "core", dcBudget: 11, notes: "bloom passes" },

  // ---- landmarks (w2 lanes, batched w6-C pending) ----
  { id: "pearl+jinmao", file: "city/landmarks-pearl-jinmao.ts", build: "buildOrientalPearl/buildJinmao", update: "(dt,elapsed)", lane: "w2-A", dcBudget: 96, notes: "batch pending w6-C2" },
  { id: "tower+swfc", file: "city/landmarks-tower-swfc.ts", build: "buildShanghaiTower/buildSwfc", update: "(dt,elapsed)", lane: "w2-B", dcBudget: 74, notes: "batch pending w6-C2" },
  { id: "magnolia+bridge", file: "city/landmarks-northbund.ts", build: "buildWhiteMagnolia/buildWaibaiduBridge", update: "(dt,elapsed)", lane: "w2-C", dcBudget: 122, notes: "batch pending w6-C2" },
  { id: "rooftops", file: "city/rooftops.ts", build: "buildRooftops", update: "(dt,elapsed)", lane: "w2-B", dcBudget: 2 },

  // ---- silicon city layer (wave3) ----
  { id: "skyTransit", file: "city/skyTransit.ts", build: "buildSkyTransit", update: "(dt,elapsed)", lane: "w3-A", dcBudget: 30 },
  { id: "streetSilicon", file: "city/streetSilicon.ts", build: "buildStreetSilicon", update: "(dt,elapsed)", lane: "w3-B", dcBudget: 28 },
  { id: "enterableHubs", file: "city/enterableBatched.ts", build: "buildEnterableHubs", update: "(dt,elapsed)", lane: "w6-D", dcBudget: 4 },
  { id: "metroLine", file: "city/metroLine.ts", build: "buildMetro", update: "(dt,elapsed)", lane: "w3-F", dcBudget: 31 },
  { id: "blockDetails", file: "city/blockDetails.ts", build: "buildBlockDetails", update: "(dt,elapsed)", lane: "w3-E", dcBudget: 8 },
  { id: "waterfront", file: "city/waterfront.ts", build: "buildWaterfront", update: "(dt,elapsed)", lane: "w3-G", dcBudget: 24 },
  { id: "bundRow", file: "city/bundRowBatched.ts", build: "buildBundRow", update: "(dt,elapsed)", lane: "w6-B", dcBudget: 12 },
  { id: "streetSigns", file: "city/streetSigns.ts", build: "buildStreetSigns", update: "(dt,elapsed)", lane: "w5-C", dcBudget: 36 },

  // ---- living systems ----
  { id: "residents", file: "city/residentsBatched.ts", build: "buildResidentsBatched", update: "(dt,elapsed)", lane: "w6-A", dcBudget: 8 },
  { id: "hubLife", file: "live/hubLife.ts", build: "buildHubLife", update: "(dt,elapsed,hour)", lane: "w4-C", dcBudget: 8 },
  { id: "vehicles", file: "live/vehicles.ts", build: "buildVehicles", update: "(dt,elapsed,hour)", lane: "w2-A", dcBudget: 3 },
  { id: "traffic", file: "live/traffic.ts", build: "buildTraffic", update: "(dt,elapsed)", lane: "w1-C", dcBudget: 12 },
  { id: "ships", file: "live/ships.ts", build: "buildShips", update: "(dt,elapsed)", lane: "w3-D", dcBudget: 6 },
  { id: "pedestrians", file: "live/pedestrians.ts", build: "buildPedestrians", update: "(dt,elapsed,hour)", lane: "w1-A", dcBudget: 2 },
  { id: "weather", file: "live/weather.ts", build: "buildWeather", update: "(dt,elapsed)", lane: "w1-B", dcBudget: 3 },
  { id: "dust", file: "live/dust.ts", build: "buildDust", update: "(phase)", lane: "core", dcBudget: 1 },
  { id: "messengers", file: "live/messengers.ts", build: "Messengers", update: "(elapsed)", lane: "core", dcBudget: 18 },
  { id: "birthPulse", file: "live/birthPulse.ts", build: "buildBirthPulse", update: "(dt,elapsed)", lane: "w4-B", dcBudget: 8 },
  { id: "ambientLife", file: "live/ambientLife.ts", build: "buildAmbientLife", update: "(dt,elapsed,hour)", lane: "w4-A", dcBudget: 2 },
  { id: "riverReflection", file: "geo/riverReflection.ts", build: "buildRiverReflection", update: "(dt,elapsed)", lane: "w2-C", dcBudget: 3 },
  { id: "robots", file: "city/robots.ts", build: "buildRobots", update: "(dt,elapsed)", lane: "core", dcBudget: 42 },

  // ---- control & ui ----
  { id: "walkController", file: "controls/walkController.ts", build: "WalkController", update: "(dt)", lane: "w3-C", dcBudget: 0 },
  { id: "cameraRig", file: "controls/cameraRig.ts", build: "CameraRig", update: "(dt, orbit only)", lane: "core", dcBudget: 0 },
  { id: "hud", file: "ui/hud.ts", build: "buildHud", update: "(clock/ticker/cam/perf)", lane: "core", dcBudget: 0 },
];

// Total dc budget across the registry (audit target: <= 300 after all lanes batched).
export const TOTAL_DC_BUDGET = REGISTRY.reduce((s, r) => s + r.dcBudget, 0);
