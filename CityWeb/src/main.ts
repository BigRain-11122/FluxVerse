import * as THREE from "three";
import { getCityData, isLive } from "./data";
import { buildPlan } from "./city/layout";
import { buildBuildings } from "./city/buildings";
import { buildRoads } from "./city/roads";
import { buildBrainTower } from "./city/brainTower";
import { buildMasts } from "./city/masts";
import { buildRobots } from "./city/robots";
import { buildSky, DayNight } from "./live/daynight";
import { buildDust } from "./live/dust";
import { Messengers } from "./live/messengers";
import { buildTraffic } from "./live/traffic";
import { buildWeather } from "./live/weather";
import { buildPedestrians } from "./live/pedestrians";
import { buildComposer } from "./render/postfx";
import { CameraRig } from "./controls/cameraRig";
import { buildHud } from "./ui/hud";
import { ZONE_FLOW } from "./palette";

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

  // ---- scene & camera ----
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 2600);
  camera.position.set(0, 400, 430);

  const sun = new THREE.DirectionalLight(0xfff2dc, 2.2);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.left = -420;
  sun.shadow.camera.right = 420;
  sun.shadow.camera.top = 420;
  sun.shadow.camera.bottom = -420;
  sun.shadow.camera.far = 1600;
  sun.shadow.bias = -0.0006;
  scene.add(sun);

  const hemi = new THREE.HemisphereLight(0x8aa0c0, 0x2a3242, 0.8);
  scene.add(hemi);

  // ---- sky ----
  const sky = buildSky();
  scene.add(sky.mesh);
  scene.add(sky.stars);

  // ---- ground ----
  const ground = new THREE.Mesh(
    new THREE.CircleGeometry(1000, 64),
    new THREE.MeshStandardMaterial({ color: 0x060a12, roughness: 0.96, metalness: 0 }),
  );
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  const grid = new THREE.GridHelper(660, 66, 0x16233c, 0x0b1424);
  (grid.material as THREE.Material).transparent = true;
  (grid.material as THREE.Material).opacity = 0.5;
  grid.position.y = 0.02;
  scene.add(grid);

  // ---- city ----
  const plan = buildPlan(data);
  const buildings = buildBuildings(plan, data);
  scene.add(buildings.root);
  const roads = buildRoads(plan);
  scene.add(roads.root);
  const tower = buildBrainTower();
  scene.add(tower.root);
  const masts = buildMasts(plan);
  scene.add(masts.root);
  const robots = buildRobots(data);
  scene.add(robots.root);
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

  // ---- day/night wiring ----
  const daynight = new DayNight(scene, sun, hemi, sky, data);
  daynight.attachMaterials(
    buildings.bodyMesh.material as THREE.MeshStandardMaterial,
    ground.material as THREE.MeshStandardMaterial,
  );
  for (const [zoneId, im] of buildings.windowMeshes) {
    const mat = im.material as THREE.MeshBasicMaterial;
    mat.userData.flowColor = (ZONE_FLOW[zoneId] ?? ZONE_FLOW.governance).clone();
    daynight.windowMats.set(zoneId, mat);
  }
  for (const [zoneId, line] of roads.flowLines) {
    const mat = line.material as THREE.MeshBasicMaterial;
    mat.userData.flowColor = mat.color.clone();
    daynight.flowMats.push(mat);
  }
  for (const ring of roads.districtRings) {
    const mat = ring.material as THREE.MeshBasicMaterial;
    mat.userData.flowColor = mat.color.clone();
    daynight.flowMats.push(mat);
  }
  const plazaMat = roads.plazaRing.material as THREE.MeshBasicMaterial;
  plazaMat.userData.flowColor = ZONE_FLOW.governance.clone();
  daynight.flowMats.push(plazaMat);
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

  // click-to-focus (distinguish from orbit drag)
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

  // ---- HUD clock ----
  const tickClock = (): void => hud.setClock(new Date(), daynight.label());
  tickClock();
  window.setInterval(tickClock, 1000);

  // ---- auto refresh: pick up the next tick's data every 10 min ----
  window.setInterval(() => {
    rig.persist();
    location.reload();
  }, 10 * 60 * 1000);
  window.setInterval(() => rig.persist(), 30000);
  window.addEventListener("beforeunload", () => rig.persist());

  // ---- render loop ----
  const clock = new THREE.Clock();
  // expose camera for QA scripts (street-level regression shots)
  (window as unknown as { __cwCamera?: THREE.PerspectiveCamera }).__cwCamera = camera;
  function animate(): void {
    requestAnimationFrame(animate);
    const dt = Math.min(0.1, clock.getDelta());
    const elapsed = clock.elapsedTime;
    daynight.update();
    messengers.update(elapsed);
    robots.update(dt, elapsed);
    traffic.update(dt, elapsed);
    weather.update(dt, elapsed);
    pedestrians.update(dt, elapsed, daynight.hour());
    rig.update(dt);
    composer.render();
  }
  animate();

  // mark live provenance in console for debugging
  console.log(`[CityWeb] buildings=${buildings.buildingCount} windows=${buildings.windowCount} live=${isLive()}`);
}

main();
