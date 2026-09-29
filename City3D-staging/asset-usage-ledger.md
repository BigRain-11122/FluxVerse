# 跨城资产用量账 + 利用率定谳（两城在用件全录·资产利用律查用账）
> 溯源=CEO 令 2026-09-29「你还要学，怎么把我的资产库有的资源，最大化利用好，不要重复干」·执法件=`docs/lowpoly3d-asset-law.md` §一 开工三查闸之「查用账」
> 数据源=CityAssembler.cs / SciFiCityBuilder.cs 代码实锚（2026-09-29 直读）+assemble-report.md+scifi-build-report.md（原始日志层）·可用基数=`polygon48-item-catalog.tsv`（26,144 件·磁盘实查对账全绿）
> 更新律=每城建批收工时 report→本账登记一步完成（律 §三）·本账=策展视图·原始报告=日志层禁删

## 〇 总判（利用率定谳·2026-09-29 实况·批 A 后更新）
- **全库 26,144 prefab（48 包）·两城合计在用 distinct ≈150 件 ≈ 0.6%**（批 A 后可用面已扩）
- **在役包 9→17（2026-09-29 批 A 进城·T1 代决执行）**：原 9（AD-048/015/025/022/042/018/020/010/039）+批 A 八包（AD-002/008/021/023/024/029/035/037·robocopy 33,234 件逐包对账 8/8 OK）——**室内系统四包（002/008/021/035）=R2 模块壳装配硬依赖已就位**；批 B 三包（AD-001/007/027）随 Phase 2
- **主城资产岛定量实锤**：建筑 5 种/76 可用（6.6%）×159 栋复读——城建律「资产岛」根因即此（重构 R2 以 Apartment 模块套件+四系统根治）
- 赛博城深挖示范：25 种建筑/61 件 distinct（AD-018 用至 12.5%）——同律换件即得多样性
- 重复求解实锤：雾距/光池两案两城各中一次（同案同根因）——判例已归位（律 §一查例闸），禁三犯
- **最大未挖宝=AD-022 Apartment 模块化套件 23 件（官方拼装正法·两城零调用）**：Stack/Stairs/Door/Roof/Corner 全在库——拼装变楼正是资产岛解药（R-05 乐高律）

## 一 主城 CityAssembled.unity 在用件（49 件+tree pool）
| 用途 | 件（AD-022 除注明外） | 实测/备注 |
|---|---|---|
| 路网 | SM_Env_Road_01 / Road_Crossing_01 / Road_Lines_01（干道）/ Road_YellowLines_01（环） | 1 格=5m 锁定（CEO 09-28 选件令）·1031 片 |
| 桥 | SM_Env_Bridge_Wall_01 / Bridge_Underside_01 / Bridge_Edge_01 | wall 原生 5.0×4.0×1.3m |
| 岸线 | SM_Env_WaterEdge_Straight_01/02/03 / Corner_01 / Rock_01 | edge_scale=0.79 |
| 人行/园径 | SM_Env_Sidewalk_Straight_01 + Path_Straight/Corner/T/Junction_01 | sidewalk 400 片+park 草地 |
| 建筑 ×5（159 栋复读） | CityHall_01（20×9×18m）/ OfficeOctagon_01（20×15×20）/ OfficeOld_Large_01/02（16×25×16）/ OfficeOld_Large_Base_01（16×6×16） | 池 measured=40（kitinspect 量过·勿重量） |
| 脑塔 | SM_Bld_Background_Lrg_03（h42m）+ SM_Prop_Antenna_01（AD-020·原生 4.7m→scale 2.98=14m） | 塔顶信标 y=59.5 |
| 路灯 ×120 | LightPole_Base_01+Arm_01+Lights_01 三件组（模块化拼装范式首例） | 暖白 emission |
| 道具 | Manhole_01 / ParkingMeter_01 / Sign_Stop_01 / Table_02 / Billboard_Sign_01~07 / Billboard_Roof_01 / Roof_Aircon_01/02 / SatDish_01 / Vents_Straight_01 + AD-015×2（PicnicTable_01 / Umbrella_01） | 成组律·459 件 |
| 车 ×120 | SM_Veh_Car_Ambo/Medium/Muscle/Police/Sedan/Small/Taxi/Van_01（8 型独色） | 缘侧 1.6m |
| 树 | AD-015 Tree 族（pool 153 量过·53 落位） | SM_Tree_ 前缀动态选 |
| 居民 ×12 | AD-042 人模 19 件池确定性选人 | waypoint 环形通勤 |
| 夜面 | 光池 120（程序生成·非库件）+窗 emission=Emissive_01 直供（159 渲染器可逆换装） | 五色律按城分配 |

## 二 赛博城 CitySciFi.unity 在用件（61 件+角色池）
| 用途 | 件（AD-018 除注明外） | 备注 |
|---|---|---|
| 路网 | Road_Lines_01_SF / YellowLines_01_SF / Crossing_01_SF / Sidewalk_Straight_01_SF | 8m 网格同律 |
| 地面语言 | Ground_Tile_01 + Graffiti_Ground_01~05（decal） | 77 tiles+14 涂鸦 |
| 建筑 ×25 型（48 栋） | Large_01~06 / Advanced_01/02 / LandingPad_01 / Bank_01 / Chopshop_01 / FoodHole_01 / Industrial_01 / Background_Med_01~09 / Background_Small_01~04 | 内密外疏梯度 |
| 脑塔 | LandingPad+Large+Advanced 三段式+AD-020 Antenna_01（14m） | 基座→塔身→冠部读法 |
| 街面 | Streetlight_01 / Bench_01 / Rubbish_Bin_01 / VendingMachine_01 / Advertisement_Pillar_01 / Cables_01（跨街电缆）/ Hologram_Bottle/Burger/Noodles/Pizza_01（招牌） | 成组律·灯与件同格异位 |
| 街市 ×15 | MarketCover_01~05+MarketTable_01+MarketLights_01 三件组 | 街市签名 |
| 悬浮车 ×100 | Veh_Future_01 / Future_Cop_01 / Future_Taxi_01 / Armored_Truck_01_Hover / Classic_01_Hover / Garbage_01_Hover / Hover_Bike_01 / Hoverboard_01/02 / Retro_01_Hover | Hover 变体=身份件 |
| 居民 ×24 | 池 39=AD-018 赛博 20+AD-042 都市 19 双池 | ResidentWalker 环形通勤 |
| 水面 | quads 程序生成（单面朝上律·QuadMesh 绕序判例） | 非库件 |

## 三 在役包利用率表（可用=件名账实查 · 在用=本账 §一§二 distinct）
| 包 | 可用 | 在用 | 利用率 | 状态判语 |
|---|---|---|---|---|
| AD-022 城市包 | 335 | 49 | **14.6%** | 建筑 5/76=资产岛根因·Apartment 模块套件 23 件零调用 |
| AD-018 科幻城 | 648 | 61+20 角色 | ~12.5% | 两城中深挖最佳·仍余 500+ 件 |
| AD-015 自然 | 225 | ~10（2 道具+树/岩 pool） | ~4% | Tree pool 量过可复用 |
| AD-020 太空 | 662 | 1（天线） | **0.2%** | Ship×64+Bld×125 全未动=脑塔冠/实验区备用矿 |
| AD-042 都市人物 | 19 | 19 池全启 | 100% | 满用（唯一满用包） |
| AD-048 起始白盒 | 58 | ~10（白盒底座） | ~17% | 使命即白盒·正常 |
| AD-025 白盒原型 | 488 | 0 | 0% | 在城零调用·或退回中台省 13MB 工程体积 |
| AD-010 粒子 | 180 | 0 | 0% | 待活性演出线进场（演出 3D 重锚） |
| AD-039 图标 | 520 | 0 | 0% | 待 UI 烘焙/拾取物线进场 |

## 四 未用高价值面（下批扩容查账即得·禁再浏览发现）
1. **AD-022 Apartment 模块化套件 23 件**（Apartment_01~03 基座+Door×5+Roof×8+Stack×3+Stairs×5+Corner 变体）——官方拼装正法（R-05 A 证「Modular sections easy to piece together」）：Stack 拼高/Corner 收转角/Stairs 加贴线细节，模块组合=建筑多样性主径，直接根治主城资产岛
2. **AD-022 商店面 16 件**（Shop_01~06+Shop_Corner×2+Shop_Cover×5+ShopFront 族）——GAME 城商业街贴线主材（城建律 ⑪门面朝街）
3. **AD-022 地标件**：Spire_01（尖塔）+Station_01~03（车站）+Water_Tower_01——节点地标库（城建律 ⑤接入三条件）
4. **AD-022 Office 族 12 件未用**（OfficeRound×4+OfficeSquare×4+Base/Roof/小 Office×6）——QUANT 城肌理备件
5. AD-020：Ship×64（飞船内构=脑塔冠部备料）+Bld×125（空间站件=实验区晶片层备料）
6. 下批候选进城 5 包（索引 §八 5.施工态标记）：AD-021 围栏/独栋社区+AD-001 末世风 207 建筑+AD-002 店面招牌 1383+AD-029 街区夜店霓虹+AD-035 屋顶 ducting——按城建律施工需要呈批 robocopy（禁一次全进·Phase 分批律）

## 五 测量复用账（量过的不重量·律 §四）
- 1 grid=5m 锁定（AD-022 路件实测·CEO 09-28 令）｜Building wall 原生 5.0×4.0×1.3m｜Antenna_01 原生 4.7m（scale 2.98→14m）
- 主城建筑池 measured=40（尺寸档 6-45m 高/6-32m 占地·选 5）｜树 pool=153 量毕｜赛博水 quads 单面朝上律
- kitinspect/lampinspect 日志=测量原始层（staging 留档）·本账只录结论值

## 六 组合配方复用（demo=老师·矿在库）
- AD-022/018/021 三包 demo 深读结论=索引 §八（纪律五律/夜景配方/痕迹叙事）·帧账=`MiniGame/projects/P3D_Spike/P3D_Spike-staging/demo-study/`（156 帧·79 场景）·余 6 在役包 demo=按需开采（律 §二深挖法：用到再挖·挖毕落账）
- 已验证成组配方：路灯三件组（主城）/街市三件组（赛博）/MarketCover 变体五连（赛博）——新组装配方照此登记
