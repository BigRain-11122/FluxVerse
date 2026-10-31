ambient: mode=Trilight sky=(0.34,0.46,0.55) equator=(0.28,0.29,0.28) ground=(0.22,0.20,0.16) intensity=1（背光面纯黑根治=补 ambient probe·main#60）
whitebox_removed=8（City_GAME B0-B7·v2 幂等重建）
district_anchor_local=(0.30,83.20) source=anchor:A1（原落点压水 91.7%·main#54 搬离湖面）
houses=8（AD-021 官方 Preset 01-08·4x2·门朝城心·行距 29 m/main#66 A2）
module_measure: straight 2.50x0.20xH3.94 · door 2.50x0.20 · corner 0.24x0.24 · floor 2.50x2.50
showcase_stairs: prefab 1.50x4.00xH3.00m（AABB 实测·pivot 偏移不靠猜）
showcase_fit[R2_AD-021_Stairs]: AABB 1.50x4.00m move=(-0.44,-2.74)m -> x[2.11..3.61] z[-1.64..2.36] 内壁±(3.61/2.36)
showcase_bounds: 7.50x5.00m vs nominal 7.5x5.0m over=(0.00,0.00)m PASS（判据 ≤0.6m·main#67）
showcase: 模块壳拼装 3x2 段（L=2.50m footprint=7.5x5.0m）+地板 3x2+楼梯+内墙·无顶=剖面展示（走进建筑 v2 真证面）
mat_bridge: converted=56 missing_filled=0（实例级·prefab 资产零触碰）
pad_recolor: DistrictPad → R2_Pavement 暖混凝土（v1 蓝灰误读水面修正）
road_props: cleared=1/62 band_z=[-75.68..-69.68] moves=TreeW-6.18m（底板道具不入路带·main#65）
props_with_collider=62/62 added=0 preexisting=62 missing=0 mismatch=0 disabled=0（底板道具碰撞面·尺寸对渲染盒差 ≤0.05m·main#68） sample=TreeW×1 | TreeW×1 | TreeW×1 PASS
showcase_slot: footprint=7.5x5.0m clear=3.03m gap=13.57m world=(-111.5,-87.2) yaw=180（宅基台/路带矩形分离·重叠=0 由几何解出）
lots=8+street=1（宅基台 0.08 顶·路带两排间·整体抬升 0.08 治漂浮）
colliders_added=30
measure R2_AD-021_SM_Bld_House_Preset_01: 6.4x5.8x8.9 m
measure R2_AD-021_SM_Bld_House_Preset_02: 5.7x4.1x5.7 m
measure R2_AD-021_SM_Bld_House_Preset_03: 13.9x6.5x13.9 m
door_probe[showcase] PASS clear=5.90m（扇形5点×双向·≥1.8m=门洞可通）
preset_door_note: 官方 Preset=单体组合 Mesh（无门件子节点）→门洞机检归解剖房承载·preset 街面层不承担走进建筑判据（如实标注）
shot: R2_L0_overview.png
shot: R2_L1_gamedistrict.png
shot: R2_L2_street.png
shot: R2_house_front.png
shot: R2_showcase_front.png
shot: R2_interior_cutaway.png
scene_saved=Assets/Scenes/CityRebuild_R2.unity（CityWhitebox.unity 原样保留）
elapsed_ms=1344
