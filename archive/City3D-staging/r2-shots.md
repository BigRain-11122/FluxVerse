capture_only=1 scene=Assets/Scenes/CityRebuild_R2.unity
houses=8
shots=12
ambient: mode=Trilight sky=(0.34,0.46,0.55) equator=(0.28,0.29,0.28) ground=(0.22,0.20,0.16) intensity=1（背光面纯黑根治=补 ambient probe·main#60）
shot: R2_L0_overview.png
shot: R2_L1_gamedistrict.png
shot: R2_L2_street.png
axis_blockers: clear hits=0/100（main#72）
street_pose: eye=1.7m yaw_off=0.0 lat=0.0 x=-119.7 facade=0.357 street_cover=0.284 prop_cover=0.000 prop_ray=0.464 prop_aabb=0.589 prop_w2=0.172 near_pen=1.03 wall_pen=0.0 blocked=0 cand_ok=1/135 ok
street_props: n=17 nearest5: R2_AD-021_Lamp_01 size=2.28x5.50x2.28 base_y=0.04 lane_gap=0.60 cam_d=3.70m | R2_AD-021_Tree_06 size=5.23x7.50x5.25 base_y=0.04 lane_gap=0.60 cam_d=3.60m | R2_AD-021_Tree_01 size=4.20x6.00x3.57 base_y=0.04 lane_gap=0.96 cam_d=4.51m | TreeW size=3.00x8.00x3.00 base_y=-0.02 lane_gap=1.00 cam_d=7.38m | TreeW size=3.00x8.00x3.00 base_y=-0.02 lane_gap=4.18 cam_d=9.49m
street_control: r728_pose facade=0.354 prop_cover=0.000 prop_ray=0.503 prop_aabb=0.737 near_pen=0.13（对照：旧机位全帧射线被树挡 50%·AABB 投影旧读数 74%（虚高·仅留对照）·main#72）
prop_block_probe: prop=R2_AD-021_Tree_01 house=R2_AD-021_SM_Bld_House_Preset_01 eye=(-124.37,-75.46) blocked=1 removed_blocked=0 PASS（同源自证·main#68）
shot: R2_house_front.png
shot: R2_showcase_front.png
shot: R2_interior_cutaway.png
