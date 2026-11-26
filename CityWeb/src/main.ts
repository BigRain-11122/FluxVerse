import * as THREE from "three";
import { getCityData, isLive } from "./data";
import { buildRealCity } from "./geo/realCity";
import { buildBrainTower } from "./city/brainTower";
import { buildMasts } from "./city/masts";
import { buildRobots } from "./city/robots";
import { buildResidentsBatched } from "./city/residentsBatched";
import { buildResidents } from "./city/residents";
import { buildOrientalPearl, buildJinmao } from "./city/landmarks-pearl-jinmao";
import { buildShanghaiTower, buildSwfc } from "./city/landmarks-tower-swfc";
import { buildWhiteMagnolia, buildWaibaiduBridge } from "./city/landmarks-northbund";
import { buildSky, DayNight } from "./live/daynight";
import { buildDust } from "./live/dust";
import { Messengers } from "./live/messengers";
import { buildTraffic } from "./live/traffic";
import { buildVehicles } from "./live/vehicles";
import { buildRooftops } from "./city/rooftops";
import { buildRiverReflection } from "./geo/riverReflection";
import { buildSkyTransit } from "./city/skyTransit";
import { buildBlockDetails } from "./city/blockDetails";
import { buildBundRow } from "./city/bundRowBatched"; // BatchedMesh: 183 -> 11 dc
import { buildEnterableHubs } from "./city/enterableBatched"; // BatchedMesh: 88 -> 4 dc
import { WalkController } from "./controls/walkController";
import { buildMetro } from "./city/metroLine";
import { buildStreetSilicon } from "./city/streetSilicon";
import { buildShips } from "./live/ships";
import { buildWaterfront } from "./city/waterfront";
import { buildBirthPulse } from "./live/birthPulse";
import { buildAmbientLife } from "./live/ambientLife";
import { buildHubLife } from "./live/hubLife";
import { buildWeather } from "./live/weather";
import { buildPedestrians } from "./live/pedestrians";
import { buildComposer } from "./render/postfx";
import { CameraRig } from "./controls/cameraRig";
import { createPlayer } from "./player/controller";
import { createWorld } from "./core/world";
import { buildHud } from "./ui/hud";
import { project } from "./geo/projection";
import { buildRealSky } from "./render/realSky";
import { buildRiverWater } from "./geo/riverWater";
import { buildStreetSigns } from "./city/streetSigns";
import { EventBus } from "./core/eventBus";
import { loadLifeState } from "./player/lifeState";
import { buildInteraction, registerResidentDialog } from "./player/interaction";
import { buildSiliconCat } from "./player/formsCat";

function placeLandmark(rig: { root: THREE.Group }, lat: number, lon: number, rotY: number, scale = 1): void {
  const { x, z } = project({ lat, lon });
  rig.root.position.set(x, 0, z);
  rig.root.rotation.y = rotY;
  rig.root.scale.setScalar(scale);
}

function main(): void {
  const data = getCityData();
  const app = document.getElementById("app")!;

  // ---- renderer ----
  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  app.appendChild(renderer.domElement);

  // ---- scene & camera (real-geography scale: 1 unit = 1m, city ~4km wide) ----
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(48, window.innerWidth / window.innerHeight, 0.3, 9000);
  camera.position.set(0, 1600, 1900);

  const sun = new THREE.DirectionalLight(0xfff2dc, 2.2);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.left = -1500;
  sun.shadow.camera.right = 1500;
  sun.shadow.camera.top = 1500;
  sun.shadow.camera.bottom = -1500;
  sun.shadow.camera.far = 4200;
  sun.shadow.bias = -0.0006;
  scene.add(sun);

  const hemi = new THREE.HemisphereLight(0x8aa0c0, 0x2a3242, 0.8);
  scene.add(hemi);

  // ---- sky ----
  const sky = buildSky(); // legacy dome kept compiled but unmounted (realSky owns the dome now)
  const realSky = buildRealSky();
  scene.add(realSky.sky);
  scene.add(realSky.sunSphere);
  scene.add(sky.stars); // star Points stay (night sky, in front of the Sky box)

  // ---- ground (dark silicon base under the whole metro area) ----
  const ground = new THREE.Mesh(
    new THREE.CircleGeometry(3600, 64),
    new THREE.MeshStandardMaterial({ color: 0x060a12, roughness: 0.96, metalness: 0 }),
  );
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  // ---- real-geography city body (Lujiazui + North Bund + river + island) ----
  const real = buildRealCity(data);
  scene.add(real.root);
  const plan = real.plan;

  // ---- brain tower on the river data island ----
  const tower = buildBrainTower();
  tower.root.position.set(real.islandPos.x, 9, real.islandPos.z);
  tower.root.scale.setScalar(2.6);
  scene.add(tower.root);

  // ---- procedural landmarks at their real coordinates ----
  const S = real.landmarkSlots;
  const landmarkRigs: Array<{ update: (dt: number, elapsed: number) => void }> = [];
  const addLandmark = (rig: { root: THREE.Group; update: (dt: number, elapsed: number) => void }, slot: { lat: number; lon: number; rotY: number }): void => {
    placeLandmark(rig, slot.lat, slot.lon, slot.rotY);
    scene.add(rig.root);
    landmarkRigs.push(rig);
  };
  addLandmark(buildOrientalPearl(), S.pearl);
  addLandmark(buildJinmao(), S.jinmao);
  addLandmark(buildShanghaiTower(), S.shanghaiTower);
  addLandmark(buildSwfc(), S.swfc);
  addLandmark(buildWhiteMagnolia(), S.whiteMagnolia);
  addLandmark(buildWaibaiduBridge(), S.waibaidu);

  // ---- living systems ----
  const masts = buildMasts(plan);
  scene.add(masts.root);
  const robots = buildRobots(data);
  robots.root.position.set(real.islandPos.x, 0, real.islandPos.z); // park on the brain island
  scene.add(robots.root);
  // 2026-11-26 合并取舍：远端线为省 draw call 做了静态批（433 → 4），但静态批把矩阵
  // 一次性写死，支持不了「按拍回放」。行为层优先级更高（真人尺子：居民要真的在动），
  // 所以有 agentTurns 时用带回放的渲染器，没有时才用实例化版。
  // P0 待办：把回放并入 residentsBatched（改它的 setMatrixAt 更新路径）后可删掉这个分支。
  const hasTurns = ((data as unknown as { agentTurns?: unknown[] }).agentTurns?.length ?? 0) > 0;
  const residents = hasTurns ? buildResidents(plan, data) : buildResidentsBatched(plan, data);
  scene.add(residents.root);
  const traffic = buildTraffic(plan);
  scene.add(traffic.root);
  const vehicles = buildVehicles(plan);
  scene.add(vehicles.root);
  const rooftops = buildRooftops();
  scene.add(rooftops.root);
  const riverReflection = buildRiverReflection();
  scene.add(riverReflection.root);
  // ---- wave3: silicon city layer (8 lane modules, parallel-built) ----
  const skyTransit = buildSkyTransit(plan);
  scene.add(skyTransit.root);
  const blockDetails = buildBlockDetails(plan);
  scene.add(blockDetails.root);
  // Bund heritage row along the west bank, facing the river.
  const bundRow = buildBundRow();
  const bundAnchor = project({ lat: 31.2390, lon: 121.4868 });
  bundRow.root.position.set(bundAnchor.x, 0, bundAnchor.z);
  bundRow.root.rotation.y = Math.PI;
  scene.add(bundRow.root);
  const metro = buildMetro();
  scene.add(metro.root);
  const hubs = buildEnterableHubs(plan);
  scene.add(hubs.root);
  const streetSilicon = buildStreetSilicon(plan, data);
  scene.add(streetSilicon.root);
  const ships = buildShips();
  scene.add(ships.root);
  const waterfront = buildWaterfront();
  scene.add(waterfront.root);
  // ---- wave4: silicon-life city responses ----
  const birthPulse = buildBirthPulse(plan);
  scene.add(birthPulse.root);
  // Official Water on the Huangpu (wave5 lane B) - the old flat ribbon
  // stays underneath (hidden at daynight level) as a fallback.
  const riverWater = buildRiverWater();
  scene.add(riverWater.water);
  const streetSigns = buildStreetSigns(plan);
  scene.add(streetSigns.root);
  const ambientLife = buildAmbientLife(data);
  scene.add(ambientLife.root);
  const hubLife = buildHubLife(hubs.specs);
  scene.add(hubLife.root);
  const weather = buildWeather(data);
  scene.add(weather.root);
  const pedestrians = buildPedestrians(plan, data);
  scene.add(pedestrians.root);
  const dust = buildDust(plan, data);
  scene.add(dust.points);

  // ---- post processing & HUD ----
  const composer = buildComposer(renderer, scene, camera);
  const hud = buildHud(data);

  // ---- camera rig ----
  const rig = new CameraRig(camera, renderer.domElement, plan);
  rig.onLevelChange = (label) => hud.setCam(label);

  // ---- S1 可走切片（2026-11-26）：玩家接管相机；?play=1 或按 P 开关。 ----
  // 默认关闭，原有浏览/街景模式完全不受影响（零漂移）。碰撞用城市自带 AABB，不引物理引擎。
  const player = createPlayer(plan, camera, renderer.domElement);
  if (new URLSearchParams(location.search).get("play")) player.toggle(true);
  (window as unknown as { __CITY_PLAYER__?: unknown }).__CITY_PLAYER__ = player;

  // ---- 架构 v2 内核：主循环不再认识任何具体模块（cph4/city-architecture-v2.md）----
  // 每个模块只声明「谁 / 多快 / 什么顺序」，降频是内建能力（hz），不是各模块自己写计时器。
  const world = createWorld(plan, data);
  // 合并后（2026-11-26）：远端线的 20+ 系统仍在循环里内联执行，这里只注册"新增模块"，
  // 避免同一模块被跑两遍。P2 会把内联调用逐个搬成 System（cph4/city-architecture-v2.md §六）。
  world.add({ id: "player", layer: "play", order: 10, update: (f) => player.update(f.dt) });
  (window as unknown as { __CITY_WORLD__?: unknown }).__CITY_WORLD__ = world;

  // ---- day/night wiring (real facade shader materials) ----
  const daynight = new DayNight(scene, sun, hemi, sky, data);
  daynight.attachMaterials(null, ground.material as THREE.MeshStandardMaterial);
  daynight.realMats = real.bodyMats;
  daynight.waterMat = real.waterMat;
  for (const fm of real.flowMats) daynight.flowMats.push(fm);
  daynight.dustMat = dust.mat;

  // ---- messengers (event performances) ----
  const messengers = new Messengers(scene, plan, tower, daynight, data.events_tail ?? []);
  messengers.hooks.onEvent = (e) => {
    hud.ticker(e);
    if (e.type === "TRANSFER") traffic.pushEvent(e);
    birthPulse.pushEvent(e); // NEW_RESIDENT/RESIDENT_BIRTH play as city pulses
  };

  // ---- input ----
  // Walk mode (CEO "人能进入" + cityscale law: F free, T jump between hubs).
  const walker = new WalkController(camera, renderer.domElement);
  walker.setColliders(real.colliders);
  walker.setEnterable(hubs.specs);

  // ---- player systems (wave P): typed bus + life state + E-key interaction ----
  const bus = new EventBus<Record<string, unknown>>();
  const life = loadLifeState();
  life.tick(Date.now()); // offline catch-up (Bitburner pattern)
  const interact = buildInteraction(camera, renderer.domElement, {
    // radius gate (4.5m) already restricts reach; keep E live in walk mode
    // AND the R street tour (how the CEO views residents up close).
    enabled: () => true,
  });
  registerResidentDialog(interact, residents.anchors, bus);
  // QA hook: anchors for proximity/dialog probes (coordinator-owned wiring).
  (window as unknown as { __CITY_ANCHORS__?: unknown }).__CITY_ANCHORS__ = residents.anchors;

  // ---- player form pilot (P1): silicon cat entity on the brain island ----
  const silCat = buildSiliconCat(7);
  silCat.root.position.set(real.islandPos.x + 26, 9.2, real.islandPos.z + 14);
  scene.add(silCat.root);
  window.addEventListener("keydown", (ev) => {
    if (ev.key === "0") rig.applyLevel(0, true);
    if (ev.key === "1") rig.applyLevel(1, true);
    if (ev.key === "2") rig.applyLevel(2, true);
    if (ev.key === "3") rig.applyLevel(3, true);
    if (ev.key === "f" || ev.key === "F") {
      // Enter walking AT the nearest hub entrance, FACING the hub: an aerial
      // toggle keeps the old downward heading and lands you staring at
      // empty ground (black street frames).
      if (!walker.enabled() && hubs.specs.length > 0) {
        const cam = camera.position;
        let best = 0, bestD = Infinity;
        hubs.specs.forEach((s, i) => {
          const d = Math.hypot(cam.x - s.cx, cam.z - s.cz);
          if (d < bestD) { bestD = d; best = i; }
        });
        const s = hubs.specs[best];
        cam.set(s.cx, 1.8, s.cz + s.hd + 6);
        camera.lookAt(s.cx, 12, s.cz);
      }
      const on = walker.toggle();
      hud.setCam(on ? "L2 步行" : rig.currentLevel);
      rig.controls.enabled = !on; // orbit yields while walking
    }
    if (ev.key === "t" || ev.key === "T") {
      // teleport cycle between enterable hubs (人尺度律: no 2km hikes)
      if (walker.enabled() && hubs.specs.length > 0) {
        const cam = camera.position;
        let best = 0, bestD = Infinity;
        hubs.specs.forEach((s, i) => {
          const d = Math.hypot(cam.x - s.cx, cam.z - s.cz);
          if (d < bestD) { bestD = d; best = i; }
        });
        const next = hubs.specs[(best + 1) % hubs.specs.length];
        cam.set(next.cx, 1.8, next.cz + next.hd + 6);
        camera.lookAt(next.cx, 12, next.cz);
        hud.setCam("L2 传送 → 馆");
      }
    }
  });

  let downX = 0, downY = 0;
  renderer.domElement.addEventListener("pointerdown", (ev) => {
    downX = ev.clientX; downY = ev.clientY;
  });
  renderer.domElement.addEventListener("pointerup", (ev) => {
    if (Math.hypot(ev.clientX - downX, ev.clientY - downY) > 6) return;
    const ndc = new THREE.Vector2(
      (ev.clientX / window.innerWidth) * 2 - 1,
      -(ev.clientY / window.innerHeight) * 2 + 1,
    );
    const rc = new THREE.Raycaster();
    rc.setFromCamera(ndc, camera);
    const t = -rc.ray.origin.y / rc.ray.direction.y;
    if (t > 0) {
      const p = rc.ray.origin.clone().add(rc.ray.direction.clone().multiplyScalar(t));
      rig.focusDistrictAt(p);
    }
  });

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
  });

  const tickClock = (): void => hud.setClock(new Date(), daynight.label());
  tickClock();
  window.setInterval(tickClock, 1000);

  window.setInterval(() => {
    rig.persist();
    location.reload();
  }, 10 * 60 * 1000);
  window.setInterval(() => rig.persist(), 30000);
  window.addEventListener("beforeunload", () => rig.persist());

  // ---- render loop ----
  const clock = new THREE.Clock();
  (window as unknown as { __cwCamera?: THREE.PerspectiveCamera }).__cwCamera = camera;
  // unified debug handle for QA probes + the cruise recorder (perf card A).
  // THREE passed in: the IIFE bundle has no window.THREE global.
  (window as unknown as { __cityDebug?: unknown }).__cityDebug = { renderer, composer, scene, camera, rig, THREE };
  // perf telemetry: rolling fps + renderer.info every 500ms (perf lane).
  // EffectComposer trap (perf-record-card): autoReset resets info at EVERY
  // internal render pass (bloom), so the HUD would only show the last pass
  // (draw 1). Frame-start manual reset accumulates all passes.
  renderer.info.autoReset = false;
  let frames = 0;
  let lastPerfAt = performance.now();
  window.setInterval(() => {
    const info = renderer.info;
    const now = performance.now();
    const fps = (frames * 1000) / Math.max(1, now - lastPerfAt);
    hud.setPerf(info.render.calls, info.render.triangles, fps);
    frames = 0;
    lastPerfAt = now;
  }, 500);

  // 2026-11-26 CEO「居民形象精细化可视化」：街景巡览。按 R 或调 window.__CITY_STREET__
  // 依次把镜头放到某位居民身旁（人眼高度），屏幕下方显示姓名/职业/年轮首句。
  // 无居民时整段不生效（禁装饰律）。
  let streetIdx = -1;
  const enterStreet = (i?: number): void => {
    const list = residents.anchors;
    if (!list.length) return;
    streetIdx = typeof i === "number" ? ((i % list.length) + list.length) % list.length
                                      : (streetIdx + 1) % list.length;
    const a = list[streetIdx];
    // 街景收起头顶名牌：信息已在底部卡，名牌会挡住人（截图取证）
    residents.setLabels(false);
    rig.applyStreet(a.pos);
    hud.setCam(`居民 ${streetIdx + 1}/${list.length} · ${a.name}`);
    const el = document.getElementById("cw-resident");
    if (el) {
      el.innerHTML = `<b>${a.name}</b>　<span style="color:#8aa0c4">${a.profession}</span><br>`
        + `<span style="color:#dbe7f7">${(a.ring || "（今日暂无年轮）").slice(0, 90)}</span>`;
      el.style.display = "block";
    }
  };
  (window as unknown as { __CITY_STREET__?: (i?: number) => void }).__CITY_STREET__ = enterStreet;
  window.addEventListener("keydown", (e) => {
    if (e.key === "r" || e.key === "R") enterStreet();
  });
  let fpsAvg = 60;
  function animate(): void {
    requestAnimationFrame(animate);
    const dt = Math.min(0.1, clock.getDelta());
    const elapsed = clock.elapsedTime;
    fpsAvg = fpsAvg * 0.9 + (1 / Math.max(dt, 1e-4)) * 0.1;
    // 合并说明（2026-11-26）：远端这条线有 20+ 个系统直接内联在循环里（metro/hubs/
    // ships/waterfront/walker/interact…）。P1 不强行重排它们（P2 再逐个注册成 System），
    // 内核 World 当前只驱动 player 与后续新增模块，避免与内联调用重复执行。
    world.tick({ dt, elapsed, hour: daynight.hour(), fps: fpsAvg });
    daynight.update();
    messengers.update(elapsed);
    robots.update(dt, elapsed);
    residents.update(dt, elapsed);
    traffic.update(dt, elapsed);
    weather.update(dt, elapsed);
    pedestrians.update(dt, elapsed, daynight.hour());
    vehicles.update(dt, elapsed, daynight.hour());
    rooftops.update(dt, elapsed);
    riverReflection.update(dt, elapsed);
    skyTransit.update(dt, elapsed);
    blockDetails.update(dt, elapsed);
    bundRow.update(dt, elapsed);
    metro.update(dt, elapsed);
    hubs.update(dt, elapsed);
    streetSilicon.update(dt, elapsed);
    ships.update(dt, elapsed);
    waterfront.update(dt, elapsed);
    birthPulse.update(dt, elapsed);
    ambientLife.update(dt, elapsed, daynight.hour());
    hubLife.update(dt, elapsed, daynight.hour());
    realSky.update(daynight.hour(), elapsed);
    riverWater.update(dt, elapsed);
    streetSigns.update(dt, elapsed);
    interact.update(dt, elapsed);
    silCat.update(dt, elapsed);
    walker.update(dt);
    for (const lm of landmarkRigs) lm.update(dt, elapsed);
    // Orbit controls overwrite the camera every frame; they must yield
    // entirely while the first-person walker owns it.
    // 2026-11-26：玩家切片（P 键/?play=1）与远端 walker 是两种互斥的第一人称模式。
    if (!player.isOn() && !walker.enabled()) rig.update(dt);
    renderer.info.reset(); // frame-start reset: composer passes accumulate
    composer.render();
    frames++;
  }
  animate();

  console.log(`[CityWeb] real-geography city: footprints=${real.buildingCount} live=${isLive()}`);
}

main();
