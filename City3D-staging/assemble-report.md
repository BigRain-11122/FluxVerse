cells: ROAD=1031 WATER=565 TREES=53 PLAZA=81
road_pick: straight=Assets/lowpoly/01_现代城市生活/AD-022_Scene场景_现代城市_CityPack/PolygonCity/Prefabs/Environments/SM_Env_Road_01.prefab crossing=Assets/lowpoly/01_现代城市生活/AD-022_Scene场景_现代城市_CityPack/PolygonCity/Prefabs/Environments/SM_Env_Road_Crossing_01.prefab trunk=Assets/lowpoly/01_现代城市生活/AD-022_Scene场景_现代城市_CityPack/PolygonCity/Prefabs/Environments/SM_Env_Road_Lines_01.prefab ring=Assets/lowpoly/01_现代城市生活/AD-022_Scene场景_现代城市_CityPack/PolygonCity/Prefabs/Environments/SM_Env_Road_YellowLines_01.prefab bridge_wall=Assets/lowpoly/01_现代城市生活/AD-022_Scene场景_现代城市_CityPack/PolygonCity/Prefabs/Environments/SM_Env_Bridge_Wall_01.prefab wall_native=5.0x4.0x1.3
building_pool: measured=40 selected=5 (判据=高6-45m·占地6-32m)
  pick: Assets/lowpoly/01_现代城市生活/AD-022_Scene场景_现代城市_CityPack/PolygonCity/Prefabs/Buildings/SM_Bld_CityHall_01.prefab 20x9x18m
  pick: Assets/lowpoly/01_现代城市生活/AD-022_Scene场景_现代城市_CityPack/PolygonCity/Prefabs/Buildings/SM_Bld_OfficeOctagon_01.prefab 20x15x20m
  pick: Assets/lowpoly/01_现代城市生活/AD-022_Scene场景_现代城市_CityPack/PolygonCity/Prefabs/Buildings/SM_Bld_OfficeOld_Large_01.prefab 16x25x16m
  pick: Assets/lowpoly/01_现代城市生活/AD-022_Scene场景_现代城市_CityPack/PolygonCity/Prefabs/Buildings/SM_Bld_OfficeOld_Large_02.prefab 16x25x16m
  pick: Assets/lowpoly/01_现代城市生活/AD-022_Scene场景_现代城市_CityPack/PolygonCity/Prefabs/Buildings/SM_Bld_OfficeOld_Large_Base_01.prefab 16x6x16m
tree_pool: 153
hero_stack: main=SM_Bld_Background_Lrg_03 h=42m podium=NONE antenna=SM_Prop_Antenna_01 native=4.7m->scale14m
shore_pick: straights_live=3/3 corner=Assets/lowpoly/01_现代城市生活/AD-022_Scene场景_现代城市_CityPack/PolygonCity/Prefabs/Environments/SM_Env_WaterEdge_Corner_01.prefab rock=Assets/lowpoly/01_现代城市生活/AD-022_Scene场景_现代城市_CityPack/PolygonCity/Prefabs/Environments/SM_Env_WaterEdge_Rock_01.prefab
path_pick: straight=Assets/lowpoly/01_现代城市生活/AD-022_Scene场景_现代城市_CityPack/PolygonCity/Prefabs/Environments/SM_Env_Path_Straight_01.prefab corner=Assets/lowpoly/01_现代城市生活/AD-022_Scene场景_现代城市_CityPack/PolygonCity/Prefabs/Environments/SM_Env_Path_Corner_01.prefab t=Assets/lowpoly/01_现代城市生活/AD-022_Scene场景_现代城市_CityPack/PolygonCity/Prefabs/Environments/SM_Env_Path_T_01.prefab junction=Assets/lowpoly/01_现代城市生活/AD-022_Scene场景_现代城市_CityPack/PolygonCity/Prefabs/Environments/SM_Env_Path_Junction_01.prefab
plaza_tiles: 77 (junction=53 t=15 corner=6 straight=3) skipped_road_cells=4 scale=1.00
bridge_base_slabs: 7 (seal=板缝防漏蓝+桥体感)
roads_placed: 1031 (crossings=418 trunk_lines=294 ring_yellow=54 bridge_decks=128 bridge_gapfill=32 spans=7 walls=deferred_phase2)
v2_note: 桥全套（Wall 曲墙+Underside+Pillar）=Phase 2 编辑器内逐件校位；本轮=升板跨连通+干道标线
water_quads: 565
shore: sand_quads=104 edge_pieces=30 corners=41 rocks=7 edge_scale=0.79
trees_placed: 53/53
tower_main: SM_Bld_Background_Lrg_03 h=42m at_y=0
tower_antenna: SM_Prop_Antenna_01 native_h=4.7m scale=2.98 -> 14m (AD-020)
tower_beacon: y=59.5 (BreathingPulse 600s)
districts: 3x16 slots placed=48
bridge_kit: underside=5.0x0.7x5.0m edge=5.2x3.5x5.0m (Wall=碎石岩块弃用·Pillar=低板下无净空挂 Phase 3 高架评估)
bridge_kit_placed: underside_beams=128 edge_railings=162 spans=7
props_pick: live=11/11 (AD-022 Props×9+AD-015×2·单件零拼装首期·路灯模块拼装=下批 KitInspect 后)
props_placed: 220 (bench=9 trash=7 others=204 · 预算帽 ≤600 ✓ · 选型表 R-20260929-street-props-selection §三规则)
streetlamps: 120/120 (Base+Arm+Lights 三件拼装·臂端挂灯头·暖白 emission·干道每 4 格交替侧)
night_windows: renderers_materials_swapped=48 (五色律: QUANT金/MEDIA品红/GAME青·Emissive_01 直供)
bloom: threshold=0.9 intensity=0.9 scatter=0.7 (URP 全局 Volume+相机 postProcessing·v3.1 调优)
daynight_cycle: attached（ExecuteAlways·北京钟驱动仰角/强度/色温+环境光 Flat+天色随动）
v2: ring-disc removed (脑环=r8格环路·黄线件标记·修 v1 盘压 70 格中央路)
scene saved: Assets/Scenes/CityAssembled.unity
assemble_ms=1237
calibration: 1grid=5m locked (CEO 09-28 选件搭建令·AD-022 路件 5x5m 1:1)
capture_ms=793
selection_law: 全部件库内挑选（CEO 令 09-28 选件搭建令）·AI/自制生产径停
