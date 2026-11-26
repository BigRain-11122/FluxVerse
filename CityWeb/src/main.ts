import * as THREE from "three";
import { getCityData, isLive } from "./data";
import { buildRealCity } from "./geo/realCity";
import { buildBrainTower } from "./city/brainTower";
import { buildMasts } from "./city/masts";
import { buildRobots } from "./city/robots";
import { buildResidents } from "./city/residents";
import { buildOrientalPearl, buildJinmao } from "./city/landmarks-pearl-jinmao";
import { buildShanghaiTower, buildSwfc } from "./city/landmarks-tower-swfc";
import { buildWhiteMagnolia, buildWaibaiduBridge } from "./city/landmarks-northbund";
import { buildSky, DayNight } from "./live/daynight";
import { buildDust } from "./live/dust";
import { Messengers } from "./live/messengers";
import { buildTraffic } from "./live/traffic";
import { buildWeather } from "./live/weather";
import { buildPedestrians } from "./live/pedestrians";
import { buildComposer } from "./render/postfx";
import { CameraRig } from "./controls/cameraRig";
import { buildHud } from "./ui/hud";
import { project } from "./geo/projection";

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
  const camera = new THREE.PerspectiveCamera(48, window.innerWidth / window.innerHeight, 2, 9000);
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
  const sky = buildSky();
  scene.add(sky.mesh);
  scene.add(sky.stars);

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
  const residents = buildResidents(plan, data);
  scene.add(residents.root);
  const traffic = buildTraffic(plan);
  scene.add(traffic.root);
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
  };

  // ---- input ----
  window.addEventListener("keydown", (ev) => {
    if (ev.key === "0") rig.applyLevel(0, true);
    if (ev.key === "1") rig.applyLevel(1, true);
    if (ev.key === "2") rig.applyLevel(2, true);
    if (ev.key === "3") rig.applyLevel(3, true);
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
  function animate(): void {
    requestAnimationFrame(animate);
    const dt = Math.min(0.1, clock.getDelta());
    const elapsed = clock.elapsedTime;
    daynight.update();
    messengers.update(elapsed);
    robots.update(dt, elapsed);
    residents.update(dt, elapsed);
    traffic.update(dt, elapsed);
    weather.update(dt, elapsed);
    pedestrians.update(dt, elapsed, daynight.hour());
    for (const lm of landmarkRigs) lm.update(dt, elapsed);
    rig.update(dt);
    composer.render();
  }
  animate();

  console.log(`[CityWeb] real-geography city: footprints=${real.buildingCount} live=${isLive()}`);
}

main();
