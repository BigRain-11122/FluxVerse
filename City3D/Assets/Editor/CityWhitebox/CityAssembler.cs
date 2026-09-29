using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine;
using UnityEngine.Rendering;

// 库内选件装配器（CEO 令 09-28 23:5x「美术库里有大量的ploygon资产，去挑选合适的，快速搭建城市！」）
// 选件律：全部件从 9 包在库挑选（AD-NNN 引用制）·选件清单留痕=审计面·AI/自制生产径=停
// 定标：1格=5m（AD-022 路件 5×5m 与版式格 1:1）·数据源=Tools/city/td-organic-data.txt 运行时直读
// v2（装配 v2 挂账四件）：桥跨干道连通（桥面+护栏）｜水岸过渡（WaterEdge）｜脑塔堆叠+AD-020 天线｜广场铺装（Path 族）
//     +移除 v1 BrainRing 实心盘（r8 环路=脑环·盘压 70 格中央路缺陷修）·Corner 件/桥柱=判据帧后定
public static class CityAssembler
{
    const int Seed = 20260929;
    const float GridM = 5f;                    // 定标锁定：1格=5m（CEO 选件搭建令）
    const float AnchorX = 24f, AnchorY = 45f;  // 2D 中央广场中心=世界原点
    const float CitiesR = 180f;
    static readonly float[] CityAngles = { 0f, 120f, 240f };
    static readonly string[] CityNames = { "QUANT", "MEDIA", "GAME" };

    // AD-NNN Prefab 实锚（选件律=只抽 Prefab·v1 品红判例：Model 无材质指配）
    const string EnvPf = "Assets/lowpoly/01_现代城市生活/AD-022_Scene场景_现代城市_CityPack/PolygonCity/Prefabs/Environments";
    const string ScifiBldPf = "Assets/lowpoly/03_科幻/AD-018_Scene场景_赛博科幻城_SciFiCity/PolygonSciFiCity/Prefabs/Buildings";
    const string SpacePropPf = "Assets/lowpoly/03_科幻/AD-020_Scene场景_太空飞船_SciFiSpace/PolygonSciFiSpace/Prefabs/Props";
    const string VehPf = "Assets/lowpoly/01_现代城市生活/AD-022_Scene场景_现代城市_CityPack/PolygonCity/Prefabs/Vehicles";

    static string FVRoot => Directory.GetParent(Directory.GetParent(Application.dataPath).FullName).FullName;
    static string Staging => Path.Combine(FVRoot, "City3D-staging");
    static string Shots => Path.Combine(Staging, "shots4");

    static readonly List<string> Report = new List<string>();
    static Material _pulseMat;
    static System.Random _rng;

    public static void BatchEntry()
    {
        try { Assemble(); }
        catch (Exception e) { UnityEngine.Debug.LogError("CITY3D_ASSEMBLE_FAIL: " + e); EditorApplication.Exit(1); }
    }

    static void Assemble()
    {
        var sw = Stopwatch.StartNew();
        _rng = new System.Random(Seed);
        Directory.CreateDirectory(Shots);
        Directory.CreateDirectory(Path.Combine(Application.dataPath, "Art/Whitebox"));

        var scene = EditorSceneManager.NewScene(NewSceneSetup.DefaultGameObjects, NewSceneMode.Single);
        var root = new GameObject("AssembledCity");

        // P2 官方基准档（Top1 施工案·AD-022 demo 提取=official-baseline.md·禁猜参）：
        // 默认程序化天空盒+Skybox 环境光+暖白主光 1.2#FFF4D6@仰50/方212+软影强度0.8（官方城 demo 无 Volume 后处理=轻栈实证）
        var light = UnityEngine.Object.FindObjectOfType<Light>();
        if (light != null)
        {
            light.type = LightType.Directional;
            light.transform.rotation = Quaternion.Euler(50f, 212.23f, 0f);
            light.intensity = 1.2f;
            light.color = new Color32(0xFF, 0xF4, 0xD6, 255);
            light.shadows = LightShadows.Soft;
            light.shadowStrength = 0.8f;
        }
        // v6 官方补光档（暗部保有量律：阴影面亮度 0.35-0.45 目标·判据帧 0=crush 判负；AD-048 fill 0.27/AD-015 fill 0.24 家族实证）
        var fillGo = new GameObject("SkyFill_Light"); fillGo.transform.SetParent(root.transform);
        var fill = fillGo.AddComponent<Light>();
        fill.type = LightType.Directional;
        fill.transform.rotation = Quaternion.Euler(38f, 32f, 0f);   // 主光 212° 反向位
        fill.intensity = 0.12f;   // v8 0.25→0.12（官方城 demo 补光=0 基线·0.25 无影灯手术室判例·留 0.12 低语档保暗部）
        fill.color = new Color32(0x99, 0xB0, 0xE7, 255);
        fill.shadows = LightShadows.None;
        var cam = Camera.main;
        cam.clearFlags = CameraClearFlags.Skybox;
        var defSky = AssetDatabase.GetBuiltinExtraResource<Material>("Default-Skybox.mat");
        if (defSky != null) RenderSettings.skybox = defSky;
        RenderSettings.fog = true;                                    // L0 320m 大气透视 PoC（官方城 demo 无雾·赛博城 fog 先例=家族内合法·判据帧双验后定）
        RenderSettings.fogMode = FogMode.ExponentialSquared;
        RenderSettings.fogColor = new Color32(0xA9, 0xC2, 0xD6, 255);
        RenderSettings.fogDensity = 0.0015f;  // v7 定谳（v6 0.004@320m=漂白灾难判例·v5 0.0012 近界·0.0015=远处 ~30% 雾量）
        cam.fieldOfView = 45f;

        // 地面（v7 800m 画布·城核 320m 居中——L0 判据帧世界边缘露底判负修）
        var ground = GameObject.CreatePrimitive(PrimitiveType.Cube);
        ground.name = "Ground"; ground.transform.SetParent(root.transform);
        ground.transform.localScale = new Vector3(800f, 0.2f, 800f);
        ground.transform.position = Vector3.down * 0.1f;
        ground.GetComponent<Renderer>().sharedMaterial = Mat("Ground", new Color32(0xB4, 0xAE, 0xA3, 255), "Universal Render Pipeline/Lit"); // v6 降明度 8（判据帧过曝白判负·浅混凝土+Lit 收影）

        var cells = ParseCells(Path.Combine(FVRoot, "Tools/city/td-organic-data.txt"));
        Report.Add($"cells: ROAD={cells["ROAD"].Count} WATER={cells["WATER"].Count} TREES={cells["TREES"].Count} PLAZA={cells["PLAZA"].Count}");

        // ===== 选件阶段（实测体高分档·清单留痕）=====
        var roadPieces = SelectRoadPieces();          // AD-022 路件族（干道/黄线/护栏变体）
        var buildings = SelectBuildings();            // AD-022 Prefabs 建筑池（实测 bounds 分档）
        var trees = SelectTrees();                    // AD-015 树池
        var hero = SelectHeroStack();                 // AD-018 基座+主塔 / AD-020 天线
        var shore = SelectShorePieces();              // AD-022 WaterEdge 族
        var paths = SelectPathPieces();               // AD-022 Path 族（广场铺装）

        // ===== 铺装阶段 =====
        var roadSet = new HashSet<Vector2>(cells["ROAD"]);
        LayPlaza(root.transform, cells, paths, roadSet);   // 广场铺装先铺（路格让位在后）
        LayRoads(root.transform, cells, roadPieces);      // 路网+桥跨+护栏
        LayWater(root.transform, cells);
        LayShore(root.transform, cells, shore);           // 沙滩底+水岸过渡件
        LayTrees(root.transform, cells, trees);
        PlaceHeroTower(root.transform, hero);
        FillDistricts(root.transform, buildings);
        Report.Add("p0: L_OuterRing 移除（Top1 净空批·调试红圈判负·外环感知网改 Phase 2 风格化件再议）");
        var kit = SelectBridgeKit();                     // v3 桥全套（KitInspect 证据图定谳·Wall=碎石弃用）
        BuildBridgeKit(root.transform, cells, kit);      // Underside 底板+Pillar 中墩+Edge 护栏
        var props = SelectProps();                       // v3 街景道具层（选型表 R-20260929-street-props-selection）
        LayProps(root.transform, cells, props, roadSet); // 数据驱动散布+预算帽 ≤600
        LayStreetLamps(root.transform, roadSet);         // v3.1 路灯三件拼装（灯证据批定谳）
        LaySidewalks(root.transform, cells, roadSet);    // v6 人行道路缘+地面语言层（AD-022 Sidewalk/Grass 族）
        LayParkedCars(root.transform, roadSet);          // v6 停车层（AD-022 Vehicles×8·街面生命感）
        DressRoofs(root.transform);                      // v6 屋顶 dress 层（Roof_Aircon/SatDish/Vents/Billboard·Top1 D2 细节律）
        BuildNightGlow(root.transform);                 // v7 夜帧光池层（路灯地面暖光斑·默认关·夜帧激活）
        LayResidents(root.transform, cells, roadSet);    // v4 L1 行人层（活性 Phase 1·真数据分区活动映射）
        foreach (var wk in Walkers) wk.Advance(wk.GetInstanceID() % 7 * 6f); // 建时确定性散布（免全聚起点·同帧位移证明留 Advance 余量）
        SetupBloom(cam);                                 // v3 bloom（官方默认值律·v3.1 intensity 0.9·五色律窗灯改由 CaptureAll 夜帧换装·v6）
        var cycle = light.gameObject.AddComponent<DayNightCycle>(); // v3.1 日夜色轮三件套（ExecuteAlways·北京时间）
        cycle.sun = light;
        cycle.enabled = false; // P2 判据帧确定性律：捕获期禁北京钟驱动（否则 ExecuteAlways 编辑态 tick 覆写基准档光 rig）——CaptureAll 尾重开=GUI 实检呈实时城光
        Report.Add("daynight_cycle: attached（ExecuteAlways·北京钟驱动仰角/强度/色温+环境光 Flat+天色随动）");
        Report.Add("v2: ring-disc removed (脑环=r8格环路·黄线件标记·修 v1 盘压 70 格中央路)");

        EditorSceneManager.SaveScene(scene, "Assets/Scenes/CityAssembled.unity");
        Report.Add($"scene saved: Assets/Scenes/CityAssembled.unity");
        Report.Add($"assemble_ms={sw.ElapsedMilliseconds}");
        Report.Add("calibration: 1grid=5m locked (CEO 09-28 选件搭建令·AD-022 路件 5x5m 1:1)");

        CaptureAll(cam);
        WriteReport();
        UnityEngine.Debug.Log("CITY3D_ASSEMBLE_DONE");
    }

    // ---------- 选件 ----------
    static GameObject LoadPrefab(string folder, string name)
    {
        var p = $"{folder}/{name}.prefab";
        var go = AssetDatabase.LoadAssetAtPath<GameObject>(p);
        if (go == null) Report.Add($"WARN prefab_missing: {p}");
        return go;
    }

    static RoadFamily SelectRoadPieces()
    {
        var fam = new RoadFamily();
        fam.Straight = LoadPrefab(EnvPf, "SM_Env_Road_01");
        fam.Crossing = LoadPrefab(EnvPf, "SM_Env_Road_Crossing_01");
        fam.Trunk = LoadPrefab(EnvPf, "SM_Env_Road_Lines_01");          // 干道白线
        fam.Ring = LoadPrefab(EnvPf, "SM_Env_Road_YellowLines_01");      // 脑环黄线
        fam.BridgeWall = LoadPrefab(EnvPf, "SM_Env_Bridge_Wall_01");     // 桥护栏
        var wb = fam.BridgeWall != null ? Measure(fam.BridgeWall) : null;
        if (wb != null) fam.WallSize = wb.Value;
        Report.Add($"road_pick: straight={AssetPathOf(fam.Straight)} crossing={AssetPathOf(fam.Crossing)} trunk={AssetPathOf(fam.Trunk)} ring={AssetPathOf(fam.Ring)} bridge_wall={AssetPathOf(fam.BridgeWall)} wall_native={fam.WallSize.x:F1}x{fam.WallSize.y:F1}x{fam.WallSize.z:F1}");
        return fam;
    }

    class RoadFamily { public GameObject Straight; public GameObject Crossing; public GameObject Trunk; public GameObject Ring; public GameObject BridgeWall; public Vector3 WallSize; }

    static ShoreFamily SelectShorePieces()
    {
        var fam = new ShoreFamily
        {
            Straights = new[] { LoadPrefab(EnvPf, "SM_Env_WaterEdge_Straight_01"), LoadPrefab(EnvPf, "SM_Env_WaterEdge_Straight_02"), LoadPrefab(EnvPf, "SM_Env_WaterEdge_Straight_03") },
            Corner = LoadPrefab(EnvPf, "SM_Env_WaterEdge_Corner_01"),
            Rock = LoadPrefab(EnvPf, "SM_Env_WaterEdge_Rock_01")
        };
        var live = fam.Straights.Count(s => s != null);
        Report.Add($"shore_pick: straights_live={live}/3 corner={AssetPathOf(fam.Corner)} rock={AssetPathOf(fam.Rock)}");
        return fam;
    }

    class ShoreFamily { public GameObject[] Straights; public GameObject Corner; public GameObject Rock; }

    static PathFamily SelectPathPieces()
    {
        var fam = new PathFamily
        {
            Straight = LoadPrefab(EnvPf, "SM_Env_Path_Straight_01"),
            Corner = LoadPrefab(EnvPf, "SM_Env_Path_Corner_01"),
            T = LoadPrefab(EnvPf, "SM_Env_Path_T_01"),
            Junction = LoadPrefab(EnvPf, "SM_Env_Path_Junction_01")
        };
        Report.Add($"path_pick: straight={AssetPathOf(fam.Straight)} corner={AssetPathOf(fam.Corner)} t={AssetPathOf(fam.T)} junction={AssetPathOf(fam.Junction)}");
        return fam;
    }

    class PathFamily { public GameObject Straight; public GameObject Corner; public GameObject T; public GameObject Junction; }

    static List<BuildingCand> SelectBuildings()
    {
        var pool = new List<BuildingCand>();
        var guids = AssetDatabase.FindAssets("t:Prefab", new[] { "Assets/lowpoly/01_现代城市生活/AD-022_Scene场景_现代城市_CityPack" });
        int measured = 0;
        foreach (var g in guids)
        {
            if (measured >= 40) break;
            var p = AssetDatabase.GUIDToAssetPath(g);
            var go = AssetDatabase.LoadAssetAtPath<GameObject>(p);
            if (go == null) continue;
            var b = Measure(go);
            if (b == null) continue;
            measured++;
            // 建筑分档：高度 6-40m·占地 6-30m（挑件判据·排除道具/碎片）
            if (b.Value.y >= 6f && b.Value.y <= 45f && Mathf.Max(b.Value.x, b.Value.z) >= 6f && Mathf.Max(b.Value.x, b.Value.z) <= 32f)
                pool.Add(new BuildingCand { Path = p, Size = b.Value, Prefab = go });
        }
        Report.Add($"building_pool: measured={measured} selected={pool.Count} (判据=高6-45m·占地6-32m)");
        foreach (var c in pool) Report.Add($"  pick: {c.Path} {c.Size.x:F0}x{c.Size.y:F0}x{c.Size.z:F0}m");
        return pool;
    }

    class BuildingCand { public string Path; public Vector3 Size; public GameObject Prefab; }

    static List<GameObject> SelectTrees()
    {
        var pool = new List<GameObject>();
        foreach (var g in AssetDatabase.FindAssets("SM_Tree_", new[] { "Assets/lowpoly/00_通用底座/AD-015_Scene场景_自然植被地形_NaturePack" }))
        {
            var go = AssetDatabase.LoadAssetAtPath<GameObject>(AssetDatabase.GUIDToAssetPath(g));
            if (go != null) pool.Add(go);
        }
        Report.Add($"tree_pool: {pool.Count}");
        return pool;
    }

    class HeroComp { public GameObject Podium; public Vector3 PodiumSize; public GameObject Main; public Vector3 MainSize; public GameObject Antenna; public Vector3 AntennaSize; }

    static HeroComp SelectHeroStack()
    {
        var h = new HeroComp();
        // 主塔：AD-018 最高件（≤90m·瘦 footprint）
        float bestH = 0;
        foreach (var g in AssetDatabase.FindAssets("t:Prefab", new[] { ScifiBldPf }))
        {
            var p = AssetDatabase.GUIDToAssetPath(g);
            var go = AssetDatabase.LoadAssetAtPath<GameObject>(p);
            var b = Measure(go);
            if (b == null) continue;
            if (b.Value.y > bestH && b.Value.y <= 90f && Mathf.Max(b.Value.x, b.Value.z) <= 20f) { h.Main = go; bestH = b.Value.y; h.MainSize = b.Value; }
        }
        // 基座：AD-018 宽矮件（10-24m 高·14-34m 占地·最宽者）
        float bestArea = 0;
        foreach (var g in AssetDatabase.FindAssets("t:Prefab", new[] { ScifiBldPf }))
        {
            var p = AssetDatabase.GUIDToAssetPath(g);
            var go = AssetDatabase.LoadAssetAtPath<GameObject>(p);
            var b = Measure(go);
            if (b == null || go == h.Main) continue;
            if (b.Value.y >= 10f && b.Value.y <= 24f && Mathf.Max(b.Value.x, b.Value.z) >= 14f && Mathf.Max(b.Value.x, b.Value.z) <= 34f)
            {
                var area = b.Value.x * b.Value.z;
                if (area > bestArea) { h.Podium = go; bestArea = area; h.PodiumSize = b.Value; }
            }
        }
        // 天线：AD-020 SM_Prop_Antenna_01（v2 挂账件）
        h.Antenna = LoadPrefab(SpacePropPf, "SM_Prop_Antenna_01");
        var ab = h.Antenna != null ? Measure(h.Antenna) : null;
        if (ab != null) h.AntennaSize = ab.Value;
        Report.Add($"hero_stack: main={(h.Main == null ? "NONE" : h.Main.name + " h=" + h.MainSize.y.ToString("F0") + "m")} podium={(h.Podium == null ? "NONE" : h.Podium.name + " " + h.PodiumSize.x.ToString("F0") + "x" + h.PodiumSize.y.ToString("F0") + "x" + h.PodiumSize.z.ToString("F0") + "m")} antenna={(h.Antenna == null ? "NONE" : h.Antenna.name + " native=" + h.AntennaSize.y.ToString("F1") + "m->scale14m")}");
        return h;
    }

    static Vector3? Measure(GameObject go)
    {
        var inst = UnityEngine.Object.Instantiate(go);
        inst.SetActive(false);
        var r = inst.GetComponentsInChildren<Renderer>();
        if (r.Length == 0) { UnityEngine.Object.DestroyImmediate(inst); return null; }
        Bounds b = r[0].bounds; foreach (var rr in r) b.Encapsulate(rr.bounds);
        UnityEngine.Object.DestroyImmediate(inst);
        return b.size;
    }

    // ---------- 铺装 ----------
    static void LayRoads(Transform root, Dictionary<string, List<Vector2>> cells, RoadFamily fam)
    {
        var set = new HashSet<Vector2>(cells["ROAD"]);
        var bridges = new HashSet<Vector2>(cells["BRIDGES"]);
        // 阶梯跨拐角补板：对角相邻桥格的两正交空档补桥面（防水面从角缝漏出=断桥读象判例·四轮）
        var waterSet = new HashSet<Vector2>(cells["WATER"]);
        var fills = new List<Vector2>();
        foreach (var b in bridges.ToArray())
            foreach (var d in new[] { new Vector2(1, 1), new Vector2(1, -1) })
            {
                var diag = b + d;
                if (!bridges.Contains(diag)) continue;
                var f1 = new Vector2(b.x + d.x, b.y);
                var f2 = new Vector2(b.x, b.y + d.y);
                if (waterSet.Contains(f1) && !bridges.Contains(f1) && !fills.Contains(f1)) fills.Add(f1);
                if (waterSet.Contains(f2) && !bridges.Contains(f2) && !fills.Contains(f2)) fills.Add(f2);
            }
        int gapfilled = fills.Count;
        foreach (var f in fills) bridges.Add(f);
        // 桥跨=8 向连通分量（阶梯跨江不断裂）·跨轴向=bbox 主轴
        var spanAxis = new Dictionary<Vector2, bool>(); // true=东西轴向
        var spans = new List<List<Vector2>>();
        var seen = new HashSet<Vector2>();
        foreach (var start in bridges)
        {
            if (seen.Contains(start)) continue;
            var span = new List<Vector2>(); var q = new Queue<Vector2>(); q.Enqueue(start); seen.Add(start);
            float minX = start.x, maxX = start.x, minY = start.y, maxY = start.y;
            while (q.Count > 0)
            {
                var c = q.Dequeue(); span.Add(c);
                for (int dx = -1; dx <= 1; dx++) for (int dy = -1; dy <= 1; dy++)
                {
                    if (dx == 0 && dy == 0) continue;
                    var nb = c + new Vector2(dx, dy);
                    if (bridges.Contains(nb) && !seen.Contains(nb)) { seen.Add(nb); q.Enqueue(nb); }
                }
            }
            foreach (var c in span) { minX = Mathf.Min(minX, c.x); maxX = Mathf.Max(maxX, c.x); minY = Mathf.Min(minY, c.y); maxY = Mathf.Max(maxY, c.y); }
            bool ew = (maxX - minX) >= (maxY - minY);
            foreach (var c in span) spanAxis[c] = ew;
            spans.Add(span);
        }
        int n = 0, cross = 0, trunk = 0, ring = 0, decks = 0;
        foreach (var g in set)
        {
            bool isBridge = bridges.Contains(g);
            bool n_ = set.Contains(g + Vector2.up), s = set.Contains(g + Vector2.down);
            bool e = set.Contains(g + Vector2.right), w = set.Contains(g + Vector2.left);
            int ns = (n_ ? 1 : 0) + (s ? 1 : 0), ew = (e ? 1 : 0) + (w ? 1 : 0);
            GameObject piece; float rotY; float y;
            if (isBridge)
            {
                piece = fam.Trunk; y = 0.6f; rotY = spanAxis[g] ? 90f : 0f; decks++;
            }
            else if (n_ && s && e && w && fam.Crossing != null) { piece = fam.Crossing; rotY = 0f; y = 0f; cross++; }
            else if (Mathf.Abs(RadiusCells(g) - 8f) <= 1.5f && fam.Ring != null) { piece = fam.Ring; rotY = ew > ns ? 90f : 0f; y = 0f; ring++; } // 脑环=数据螺旋环带 r6.5-9.5·黄线（r8 定径仅 21 格碎判例修正）
            else if (RunLen(set, g, true) >= 6 || RunLen(set, g, false) >= 6)
            { piece = fam.Trunk; rotY = RunLen(set, g, true) >= RunLen(set, g, false) ? 90f : 0f; y = 0f; trunk++; } // 长直行≥6 格=干道白线
            else { piece = fam.Straight; rotY = ew > ns ? 90f : 0f; y = 0f; }
            if (piece == null) continue;
            var go = (GameObject)PrefabUtility.InstantiatePrefab(piece, root);
            if (go == null) continue;
            go.transform.position = ToWorld(g, y);
            go.transform.rotation = Quaternion.Euler(0f, rotY, 0f);
            go.isStatic = true; go.name = "Road_" + n;
            n++;
        }
        // 补板落位（fill=纯水格不在 ROAD 集·单独铺防角缝漏水面）
        foreach (var g in fills)
        {
            if (!spanAxis.ContainsKey(g)) continue;
            var go = (GameObject)PrefabUtility.InstantiatePrefab(fam.Trunk, root);
            if (go == null) continue;
            go.transform.position = ToWorld(g, 0.6f);
            go.transform.rotation = Quaternion.Euler(0f, spanAxis[g] ? 90f : 0f, 0f);
            go.isStatic = true; go.name = "RoadFill_" + g.x + "_" + g.y;
            decks++;
        }
        // 桥基座密封底板：每跨 bbox+0.25m 一块深灰底板（藏桥板缝漏蓝判例·增桥体读象）
        int slabs = 0;
        foreach (var span in spans)
        {
            float minX = float.MaxValue, maxX = float.MinValue, minZ = float.MaxValue, maxZ = float.MinValue;
            foreach (var c in span)
            {
                Vector3 w = ToWorld(c, 0f);
                minX = Mathf.Min(minX, w.x - 2.5f); maxX = Mathf.Max(maxX, w.x + 2.5f);
                minZ = Mathf.Min(minZ, w.z - 2.5f); maxZ = Mathf.Max(maxZ, w.z + 2.5f);
            }
            var mesh = new Mesh();
            var verts = new List<Vector3> {
                new Vector3(minX - 0.25f, 0.55f, minZ - 0.25f), new Vector3(maxX + 0.25f, 0.55f, minZ - 0.25f),
                new Vector3(maxX + 0.25f, 0.55f, maxZ + 0.25f), new Vector3(minX - 0.25f, 0.55f, maxZ + 0.25f) };
            mesh.SetVertices(verts);
            mesh.SetTriangles(new List<int> { 0, 1, 2, 0, 2, 3, 0, 2, 1, 0, 3, 2 }, 0);
            mesh.RecalculateNormals(); mesh.RecalculateBounds();
            var sb = new GameObject("L_BridgeBase_" + slabs); sb.transform.SetParent(root);
            sb.AddComponent<MeshFilter>().sharedMesh = mesh;
            sb.AddComponent<MeshRenderer>().sharedMaterial = Mat("BridgeBase", new Color32(0x46, 0x46, 0x4A, 255), "Universal Render Pipeline/Lit"); // 沥青同色化：错缝楔口融整体暗面（砖砌豁口判例）
            slabs++;
        }
        Report.Add($"bridge_base_slabs: {slabs} (seal=板缝防漏蓝+桥体感)");
        // 桥护栏：Phase 2 桥全套承接（Bridge_Wall=曲墙 kit 件·需配 Underside+Pillar 全套编辑器校位·单用两轮=悬浮碎条判例）
        Report.Add($"roads_placed: {n} (crossings={cross} trunk_lines={trunk} ring_yellow={ring} bridge_decks={decks} bridge_gapfill={gapfilled} spans={spans.Count} walls=deferred_phase2)");
        Report.Add("v2_note: 桥全套（Wall 曲墙+Underside+Pillar）=Phase 2 编辑器内逐件校位；本轮=升板跨连通+干道标线");
    }

    static float RadiusCells(Vector2 g) => Mathf.Sqrt((g.x - AnchorX) * (g.x - AnchorX) + (g.y - AnchorY) * (g.y - AnchorY));

    static int RunLen(HashSet<Vector2> set, Vector2 g, bool horiz)
    {
        var d = horiz ? Vector2.right : Vector2.up;
        int len = 1;
        for (var c = g + d; set.Contains(c); c += d) len++;
        for (var c = g - d; set.Contains(c); c -= d) len++;
        return len;
    }

    // 实测 Prefab 水平长轴并归一到 5m（±15% 内视为族原生网格不缩放）
    static float FitLong(GameObject pf, float targetM)
    {
        var b = Measure(pf);
        if (b == null) return 1f;
        float long2D = Mathf.Max(b.Value.x, b.Value.z);
        if (long2D <= 0.01f) return 1f;
        float s = targetM / long2D;
        return Mathf.Abs(s - 1f) < 0.15f ? 1f : s;
    }

    static void LayWater(Transform root, Dictionary<string, List<Vector2>> cells)
    {
        // 平面水（Phase 2 换 InteractiveStylizedWater——本次快速搭建用共享蓝面·2.5 半宽=无缝拼格防缝线判例）
        var mesh = QuadMesh(cells["WATER"], new Color32(0x4F, 0xA0, 0xC8, 255), 2.5f);
        var go = new GameObject("L_Water"); go.transform.SetParent(root.transform);
        go.AddComponent<MeshFilter>().sharedMesh = mesh;
        var wmat = Mat("WaterA", new Color32(0x3E, 0x7F, 0xA8, 255), "Universal Render Pipeline/Lit"); // P2：Unlit→Lit（受光受雾受环境光）·v8 深青蓝（街景「蓝色身份危机」=饱和蓝读作铺装判负）
        if (wmat.HasProperty("_Smoothness")) wmat.SetFloat("_Smoothness", 0.55f);   // v8 0.35→0.55（日光 glint=水可读性）
        var mr = go.AddComponent<MeshRenderer>(); mr.sharedMaterial = wmat;
        Report.Add($"water_quads: {cells["WATER"].Count}");
    }

    // v2 水岸过渡：沙底面 + WaterEdge 直件逐贴水侧铺 + 拐角 Corner 件（判例：缺角=板块缺口漏水）
    static void LayShore(Transform root, Dictionary<string, List<Vector2>> cells, ShoreFamily fam)
    {
        var water = new HashSet<Vector2>(cells["WATER"]);
        var sand = cells["SAND"];
        var sandMesh = QuadMesh(sand, new Color32(0xD8, 0xC9, 0x9E, 255), 2.5f);
        var sg = new GameObject("L_Sand"); sg.transform.SetParent(root.transform);
        sg.AddComponent<MeshFilter>().sharedMesh = sandMesh;
        var smat = Mat("SandA", new Color32(0xD8, 0xC9, 0x9E, 255), "Universal Render Pipeline/Lit"); // P2：Unlit→Lit 同律
        if (smat.HasProperty("_Smoothness")) smat.SetFloat("_Smoothness", 0f);
        sg.AddComponent<MeshRenderer>().sharedMaterial = smat;

        var live = fam.Straights.Where(s => s != null).ToArray();
        float scale = live.Length > 0 ? FitLong(live[0], 5f) : 1f;
        float cornerScale = fam.Corner != null ? FitLong(fam.Corner, 5f) : 1f;
        int edges = 0, corners = 0, rocks = 0, i = 0;
        foreach (var g in sand)
        {
            bool n_ = water.Contains(g + Vector2.up), s = water.Contains(g + Vector2.down);
            bool e = water.Contains(g + Vector2.right), w = water.Contains(g + Vector2.left);
            if (!n_ && !s && !e && !w) { i++; continue; }
            Vector3 c = ToWorld(g, 0f);
            bool gotCorner = false;
            if (live.Length > 0)
            {
                // 正交双贴水侧=Corner 件补拐角（该两侧不再铺直件·余侧照铺）
                bool cNE = n_ && e, cES = e && s, cSW = s && w, cWN = w && n_;
                if ((cNE || cES || cSW || cWN) && fam.Corner != null)
                {
                    Vector3 off = cNE ? new Vector3(2.5f, 0, 2.5f) : cES ? new Vector3(2.5f, 0, -2.5f) : cSW ? new Vector3(-2.5f, 0, -2.5f) : new Vector3(-2.5f, 0, 2.5f);
                    float rotY = cNE ? 0f : cES ? 90f : cSW ? 180f : 270f;
                    var co = (GameObject)PrefabUtility.InstantiatePrefab(fam.Corner, root);
                    if (co != null)
                    {
                        co.transform.position = c + off;
                        co.transform.rotation = Quaternion.Euler(0f, rotY, 0f);
                        if (cornerScale != 1f) co.transform.localScale = Vector3.one * cornerScale;
                        co.isStatic = true; corners++;
                    }
                    gotCorner = true;
                    if (cNE || cWN) n_ = false;
                    if (cNE || cES) e = false;
                    if (cES || cSW) s = false;
                    if (cSW || cWN) w = false;
                }
                if (n_) edges += PlaceEdge(root, live, ref i, scale, c + new Vector3(0, 0, 2.5f), true);
                if (s) edges += PlaceEdge(root, live, ref i, scale, c + new Vector3(0, 0, -2.5f), true);
                if (e) edges += PlaceEdge(root, live, ref i, scale, c + new Vector3(2.5f, 0, 0), false);
                if (w) edges += PlaceEdge(root, live, ref i, scale, c + new Vector3(-2.5f, 0, 0), false);
            }
            if (i % 9 == 0 && !gotCorner && fam.Rock != null)
            {
                var rk = (GameObject)PrefabUtility.InstantiatePrefab(fam.Rock, root);
                if (rk != null)
                {
                    rk.transform.position = c;
                    var rs = FitLong(fam.Rock, 2.2f);
                    if (rs != 1f) rk.transform.localScale = Vector3.one * rs;
                    rk.isStatic = true; rocks++;
                }
            }
            i++;
        }
        Report.Add($"shore: sand_quads={sand.Count} edge_pieces={edges} corners={corners} rocks={rocks} edge_scale={scale:F2}");
    }

    static int PlaceEdge(Transform root, GameObject[] variants, ref int i, float scale, Vector3 pos, bool stripEW)
    {
        var go = (GameObject)PrefabUtility.InstantiatePrefab(variants[i % variants.Length], root);
        if (go == null) return 0;
        go.transform.position = pos;
        go.transform.rotation = Quaternion.Euler(0f, stripEW ? 90f : 0f, 0f);
        if (scale != 1f) go.transform.localScale = Vector3.one * scale;
        go.isStatic = true; i++;
        return 1;
    }

    // v2 广场铺装：Path 族邻接掩码选件（81 格·路格让位防同高互吃）
    static void LayPlaza(Transform root, Dictionary<string, List<Vector2>> cells, PathFamily fam, HashSet<Vector2> roadSet)
    {
        var plaza = new HashSet<Vector2>(cells["PLAZA"]);
        float scale = fam.Straight != null ? FitLong(fam.Straight, 5f) : 1f;
        int junction = 0, t = 0, corner = 0, straight = 0, skipped = 0;
        foreach (var g in plaza)
        {
            if (roadSet.Contains(g)) { skipped++; continue; }
            bool n_ = plaza.Contains(g + Vector2.up), s = plaza.Contains(g + Vector2.down);
            bool e = plaza.Contains(g + Vector2.right), w = plaza.Contains(g + Vector2.left);
            GameObject piece = null; float rotY = 0f;
            if (n_ && s && e && w && fam.Junction != null) { piece = fam.Junction; junction++; }
            else if ((n_ ? 1 : 0) + (s ? 1 : 0) + (e ? 1 : 0) + (w ? 1 : 0) == 3 && fam.T != null)
            { piece = fam.T; rotY = !s ? 0f : !n_ ? 180f : !e ? 270f : 90f; t++; }
            else if (((n_ && e) || (e && s) || (s && w) || (w && n_)) && fam.Corner != null)
            { piece = fam.Corner; rotY = (n_ && e) ? 0f : (e && s) ? 90f : (s && w) ? 180f : 270f; corner++; }
            else if (fam.Straight != null) { piece = fam.Straight; rotY = (e || w) && !(n_ || s) ? 90f : 0f; straight++; }
            if (piece == null) continue;
            var go = (GameObject)PrefabUtility.InstantiatePrefab(piece, root);
            if (go == null) continue;
            go.transform.position = ToWorld(g, 0f);
            go.transform.rotation = Quaternion.Euler(0f, rotY, 0f);
            if (scale != 1f) go.transform.localScale = Vector3.one * scale;
            go.isStatic = true;
        }
        Report.Add($"plaza_tiles: {junction + t + corner + straight} (junction={junction} t={t} corner={corner} straight={straight}) skipped_road_cells={skipped} scale={scale:F2}");
    }

    static void LayTrees(Transform root, Dictionary<string, List<Vector2>> cells, List<GameObject> pool)
    {
        if (pool.Count == 0) return;
        int n = 0;
        foreach (var g in cells["TREES"])
        {
            var go = (GameObject)PrefabUtility.InstantiatePrefab(pool[_rng.Next(pool.Count)], root);
            if (go == null) continue;
            go.transform.position = ToWorld(g, 0f);
            go.transform.rotation = Quaternion.Euler(0f, _rng.Next(4) * 90f, 0f);                      // P3 树体律：变尺度+变朝向（反程序味·Top1 D2）
            go.transform.localScale = Vector3.one * (0.8f + 0.45f * (float)_rng.NextDouble());
            go.isStatic = true; n++;
        }
        Report.Add($"trees_placed: {n}/{cells["TREES"].Count}");
    }

    // v2 脑塔三段堆叠：AD-018 宽基座+主塔+AD-020 天线（14m）+信标呼吸件顶置
    static void PlaceHeroTower(Transform root, HeroComp hero)
    {
        var tower = new GameObject("BrainTower"); tower.transform.SetParent(root.transform);
        float topY = 0f;
        if (hero.Podium != null)
        {
            var pod = (GameObject)PrefabUtility.InstantiatePrefab(hero.Podium, tower.transform);
            if (pod != null)
            {
                pod.transform.position = new Vector3(0, topY, 0);
                pod.isStatic = true;
                topY += hero.PodiumSize.y;
                Report.Add($"tower_podium: {hero.Podium.name} h={hero.PodiumSize.y:F0}m footprint={hero.PodiumSize.x:F0}x{hero.PodiumSize.z:F0}m");
            }
        }
        if (hero.Main != null)
        {
            var t = (GameObject)PrefabUtility.InstantiatePrefab(hero.Main, tower.transform);
            if (t != null)
            {
                t.transform.position = new Vector3(0, topY, 0);
                t.isStatic = true;
                topY += hero.MainSize.y;
                Report.Add($"tower_main: {hero.Main.name} h={hero.MainSize.y:F0}m at_y={topY - hero.MainSize.y:F0}");
            }
        }
        else
        {
            float yBase = topY;
            float[][] tiers = { new[] { 16f, 20f }, new[] { 12f, 18f }, new[] { 9f, 16f }, new[] { 6f, 14f }, new[] { 3.5f, 12f } };
            foreach (var tr in tiers)
            {
                var bx = GameObject.CreatePrimitive(PrimitiveType.Cube);
                bx.transform.SetParent(tower.transform);
                bx.transform.localScale = new Vector3(tr[0], tr[1], tr[0]);
                bx.transform.position = new Vector3(0, yBase + tr[1] / 2f, 0);
                yBase += tr[1];
            }
            topY = yBase;
            Report.Add("tower_main: 白盒塔兜底（AD-018 未寻得合格高件）");
        }
        if (hero.Antenna != null)
        {
            var a = (GameObject)PrefabUtility.InstantiatePrefab(hero.Antenna, tower.transform);
            if (a != null)
            {
                var s = hero.AntennaSize.y > 0.01f ? 14f / hero.AntennaSize.y : 1f;
                a.transform.position = new Vector3(0, topY, 0);
                if (Mathf.Abs(s - 1f) > 0.01f) a.transform.localScale = Vector3.one * s;
                a.isStatic = true;
                topY += 14f;
                Report.Add($"tower_antenna: {hero.Antenna.name} native_h={hero.AntennaSize.y:F1}m scale={s:F2} -> 14m (AD-020)");
            }
        }
        // 信标呼吸件（活性管道贯通件沿用）
        _pulseMat = MakePulseMat();
        var beacon = GameObject.CreatePrimitive(PrimitiveType.Sphere);
        beacon.name = "Beacon"; beacon.transform.SetParent(tower.transform);
        beacon.transform.localScale = Vector3.one * 2.4f;
        beacon.transform.position = new Vector3(0, topY + 3f, 0);
        beacon.GetComponent<Renderer>().sharedMaterial = _pulseMat;
        var bp = beacon.AddComponent<BreathingPulse>();
        bp.jsonlPath = Path.Combine(FVRoot, "world/world-events.jsonl");
        bp.periodSeconds = 600f;
        Report.Add($"tower_beacon: y={topY + 3f:F1} (BreathingPulse 600s)");
    }

    static void FillDistricts(Transform root, List<BuildingCand> pool)
    {
        if (pool.Count == 0) { Report.Add("districts: SKIP（建筑池空）"); return; }
        int placed = 0;
        for (int i = 0; i < CityAngles.Length; i++)
        {
            float a = CityAngles[i] * Mathf.Deg2Rad;
            Vector3 c = new Vector3(Mathf.Cos(a) * CitiesR, 0, Mathf.Sin(a) * CitiesR);
            var district = new GameObject("District_" + CityNames[i]); district.transform.SetParent(root.transform);
            district.transform.position = c;
            // 4x4 槽·24m 间距·确定性选件
            int idx = 0;
            for (int sx = 0; sx < 4; sx++)
            for (int sz = 0; sz < 4; sz++)
            {
                var cand = pool[(_rng.Next(pool.Count) + idx) % pool.Count];
                var go = (GameObject)PrefabUtility.InstantiatePrefab(cand.Prefab, district.transform);
                if (go == null) continue;
                Vector3 slot = new Vector3((sx - 1.5f) * 24f + (_rng.Next(-2, 3)), 0, (sz - 1.5f) * 24f + (_rng.Next(-2, 3)));
                go.transform.localPosition = slot;
                go.transform.localRotation = Quaternion.Euler(0, 90f * _rng.Next(4), 0);
                go.isStatic = true;
                placed++; idx++;
            }
        }
        Report.Add($"districts: 3x16 slots placed={placed}");
    }

    static void MarkOuterRing(Transform root)
    {
        var mesh = RingMesh(240f, 1.2f, new Color32(0xEF, 0x6F, 0x76, 255));
        var go = new GameObject("L_OuterRing"); go.transform.SetParent(root.transform);
        go.AddComponent<MeshFilter>().sharedMesh = mesh;
        go.AddComponent<MeshRenderer>().sharedMaterial = Mat("OuterRingA", new Color32(0xEF, 0x6F, 0x76, 255));
    }

    // ---------- v3 桥全套（KitInspect 证据批定谳·CEO 令 并行施工 09-29）----------
    class BridgeKit { public GameObject Underside; public Vector3 UndersideSize; public GameObject Edge; public Vector3 EdgeSize; }

    static BridgeKit SelectBridgeKit()
    {
        var k = new BridgeKit();
        k.Underside = LoadPrefab(EnvPf, "SM_Env_Bridge_Underside_01");   // 平桥底板（证据=7~8:1 平板·端平可拼）
        k.Edge = LoadPrefab(EnvPf, "SM_Env_Bridge_Edge_01");              // 桥缘护栏（证据=长板+栏线沿长轴·首尾拼）
        var u = k.Underside != null ? Measure(k.Underside) : null; if (u != null) k.UndersideSize = u.Value;
        var e = k.Edge != null ? Measure(k.Edge) : null; if (e != null) k.EdgeSize = e.Value;
        Report.Add($"bridge_kit: underside={k.UndersideSize.x:F1}x{k.UndersideSize.y:F1}x{k.UndersideSize.z:F1}m edge={k.EdgeSize.x:F1}x{k.EdgeSize.y:F1}x{k.EdgeSize.z:F1}m (Wall=碎石岩块弃用·Pillar=低板下无净空挂 Phase 3 高架评估)");
        return k;
    }

    static void BuildBridgeKit(Transform root, Dictionary<string, List<Vector2>> cells, BridgeKit kit)
    {
        if (kit.Underside == null && kit.Edge == null) { Report.Add("bridge_kit: SKIP（件缺）"); return; }
        var bridges = new HashSet<Vector2>(cells["BRIDGES"]);
        // 补板并入（与 LayRoads 同律）
        var waterSet = new HashSet<Vector2>(cells["WATER"]);
        var fills = new List<Vector2>();
        foreach (var b in bridges.ToArray())
            foreach (var d in new[] { new Vector2(1, 1), new Vector2(1, -1) })
            {
                if (!bridges.Contains(b + d)) continue;
                var f1 = new Vector2(b.x + d.x, b.y); var f2 = new Vector2(b.x, b.y + d.y);
                if (waterSet.Contains(f1) && !bridges.Contains(f1) && !fills.Contains(f1)) fills.Add(f1);
                if (waterSet.Contains(f2) && !bridges.Contains(f2) && !fills.Contains(f2)) fills.Add(f2);
            }
        foreach (var f in fills) bridges.Add(f);
        // 跨分量+轴向
        var spanOf = new Dictionary<Vector2, int>();
        var spans = new List<List<Vector2>>();
        var seen = new HashSet<Vector2>();
        foreach (var start in bridges)
        {
            if (seen.Contains(start)) continue;
            var span = new List<Vector2>(); var q = new Queue<Vector2>(); q.Enqueue(start); seen.Add(start);
            float minX = start.x, maxX = start.x, minY = start.y, maxY = start.y;
            while (q.Count > 0)
            {
                var c = q.Dequeue(); span.Add(c);
                for (int dx = -1; dx <= 1; dx++) for (int dy = -1; dy <= 1; dy++)
                {
                    if (dx == 0 && dy == 0) continue;
                    var nb = c + new Vector2(dx, dy);
                    if (bridges.Contains(nb) && !seen.Contains(nb)) { seen.Add(nb); q.Enqueue(nb); }
                }
            }
            foreach (var c in span) { minX = Mathf.Min(minX, c.x); maxX = Mathf.Max(maxX, c.x); minY = Mathf.Min(minY, c.y); maxY = Mathf.Max(maxY, c.y); }
            int id = spans.Count; bool ew = (maxX - minX) >= (maxY - minY);
            foreach (var c in span) spanOf[c] = id;
            spans.Add(span);
            // Underside 梁链：逐格底板·顶平 0.55（底板=桥体厚度读象）
            if (kit.Underside != null)
            {
                float sU = FitLong(kit.Underside, 5f);
                foreach (var c in span)
                {
                    var go = (GameObject)PrefabUtility.InstantiatePrefab(kit.Underside, root);
                    if (go == null) continue;
                    float yU = 0.55f - kit.UndersideSize.y * sU;
                    go.transform.position = ToWorld(c, yU);
                    go.transform.rotation = Quaternion.Euler(0f, ew ? 0f : 90f, 0f);
                    if (sU != 1f) go.transform.localScale = Vector3.one * sU;
                    go.isStatic = true; _kitUnders++;
                }
            }
        }
        // Edge 护栏：桥格外沿逐侧（长侧+桥头端）·长轴归 5m·栏高钳 1.2m·y=桥面
        if (kit.Edge != null)
        {
            float longE = Mathf.Max(kit.EdgeSize.x, kit.EdgeSize.z);
            float sE = (longE > 0.01f && Mathf.Abs(5f / longE - 1f) >= 0.15f) ? 5f / longE : 1f;
            float sEy = kit.EdgeSize.y > 0.01f ? 1.2f / kit.EdgeSize.y : 1f;
            var edgeScale = new Vector3(sE, sEy, sE);
            foreach (var g in bridges)
            {
                bool n_ = bridges.Contains(g + Vector2.up), s = bridges.Contains(g + Vector2.down);
                bool e = bridges.Contains(g + Vector2.right), w = bridges.Contains(g + Vector2.left);
                Vector3 c = ToWorld(g, 0f);
                if (!n_) _kitEdge += PlaceEdgeKit(root, kit.Edge, edgeScale, c + new Vector3(0, 0.6f, 2.5f), true);
                if (!s) _kitEdge += PlaceEdgeKit(root, kit.Edge, edgeScale, c + new Vector3(0, 0.6f, -2.5f), true);
                if (!e) _kitEdge += PlaceEdgeKit(root, kit.Edge, edgeScale, c + new Vector3(2.5f, 0.6f, 0), false);
                if (!w) _kitEdge += PlaceEdgeKit(root, kit.Edge, edgeScale, c + new Vector3(-2.5f, 0.6f, 0), false);
            }
        }
        Report.Add($"bridge_kit_placed: underside_beams={_kitUnders} edge_railings={_kitEdge} spans={spans.Count}");
    }

    static int _kitUnders, _kitEdge;

    static int PlaceEdgeKit(Transform root, GameObject pf, Vector3 scale, Vector3 pos, bool stripEW)
    {
        var go = (GameObject)PrefabUtility.InstantiatePrefab(pf, root);
        if (go == null) return 0;
        go.transform.position = pos;
        go.transform.rotation = Quaternion.Euler(0f, stripEW ? 0f : 90f, 0f);
        if (scale != Vector3.one) go.transform.localScale = scale;
        go.isStatic = true;
        return 1;
    }

    // ---------- v3 街景道具层（选型表 R-20260929-street-props-selection·单件零拼装首期）----------
    const string PropsPf = "Assets/lowpoly/01_现代城市生活/AD-022_Scene场景_现代城市_CityPack/PolygonCity/Prefabs/Props";
    const string NaturePf = "Assets/lowpoly/00_通用底座/AD-015_Scene场景_自然植被地形_NaturePack";

    class PropSet { public GameObject Bench, Trash, Mailbox, Hydrant, Planter, TrafficLight, Cone, BusStop, HotdogStand, Flowers, Bush; }

    static GameObject FindProp(string filter, string folder)
    {
        var guids = AssetDatabase.FindAssets(filter, new[] { folder });
        if (guids.Length == 0) { Report.Add($"WARN prop_missing: {filter}"); return null; }
        return AssetDatabase.LoadAssetAtPath<GameObject>(AssetDatabase.GUIDToAssetPath(guids[0]));
    }

    static PropSet SelectProps()
    {
        var p = new PropSet
        {
            Bench = FindProp("ParkBench_01", PropsPf),
            Trash = FindProp("Trashbin_01", PropsPf),
            Mailbox = FindProp("Mailbox_01", PropsPf),
            Hydrant = FindProp("Hydrant_01", PropsPf),
            Planter = FindProp("Planter_01", PropsPf),
            TrafficLight = FindProp("TrafficLight_01", PropsPf),
            Cone = FindProp("Cone_01", PropsPf),
            BusStop = FindProp("BusStop_01", PropsPf),
            HotdogStand = FindProp("HotdogStand_01", PropsPf),
            Flowers = FindProp("Flowers_01", NaturePf),
            Bush = FindProp("Bush_01", NaturePf)
        };
        int live = new[] { p.Bench, p.Trash, p.Mailbox, p.Hydrant, p.Planter, p.TrafficLight, p.Cone, p.BusStop, p.HotdogStand, p.Flowers, p.Bush }.Count(x => x != null);
        Report.Add($"props_pick: live={live}/11 (AD-022 Props×9+AD-015×2·单件零拼装首期·路灯模块拼装=下批 KitInspect 后)");
        return p;
    }

    static void LayProps(Transform root, Dictionary<string, List<Vector2>> cells, PropSet p, HashSet<Vector2> roadSet)
    {
        // v6 密度升档局部件（选型表 ★ 件直供·P3 D1 密度配比律）
        var picnic = LoadPrefab(PropsPf, "SM_Prop_PicnicTable_01");
        var table = LoadPrefab(PropsPf, "SM_Prop_Table_02");
        var umb = LoadPrefab(PropsPf, "SM_Prop_Umbrella_01");
        var meter = LoadPrefab(PropsPf, "SM_Prop_ParkingMeter_01");
        var manhole = LoadPrefab(PropsPf, "SM_Prop_Manhole_01");
        var signStop = LoadPrefab(PropsPf, "SM_Prop_Sign_Stop_01");
        int placed = 0, benches = 0, trash = 0, others = 0;
        // PLAZA：长椅/垃圾箱/邮筒/餐车/公交站/野餐桌/咖啡座（v6 密度×3）
        int i = 0;
        foreach (var g in cells["PLAZA"])
        {
            if (roadSet.Contains(g)) { i++; continue; }
            Vector3 c = ToWorld(g, 0f);
            if (i % 3 == 0 && p.Bench != null) { placed += P1(root, p.Bench, c + Off(1.2f), R4()); benches++; }
            if (i % 6 == 0 && p.Trash != null) { placed += P1(root, p.Trash, c + Off(1.5f), R4()); trash++; }
            if (i % 12 == 0 && p.Mailbox != null) { placed += P1(root, p.Mailbox, c + Off(1.5f), R4()); others++; }
            if (i % 14 == 0 && i > 0 && picnic != null) { placed += P1(root, picnic, c + Off(1.5f), R4()); others++; }
            if (i % 20 == 0 && i > 0 && table != null && umb != null) { placed += P1(root, table, c + Off(2.0f), R4()); placed += P1(root, umb, c + Off(2.0f) + new Vector3(0.8f, 0, 0.8f), R4()); others += 2; }
            if (i == 40 && p.HotdogStand != null) { placed += P1(root, p.HotdogStand, c + Off(1.0f), R4()); others++; }
            if (i == 7 && p.BusStop != null) { placed += P1(root, p.BusStop, c + Off(1.0f), R4()); others++; }
            i++;
        }
        // 干道：消防栓/花坛/停车计时器/井盖（v6 密度升档）
        var trunk = roadSet.Where(g => RunLen(roadSet, g, true) >= 6 || RunLen(roadSet, g, false) >= 6)
                           .OrderBy(g => g.x).ThenBy(g => g.y).ToList();
        int j = 0;
        foreach (var g in trunk)
        {
            Vector3 c = ToWorld(g, 0f);
            if (j % 12 == 0 && p.Hydrant != null) { placed += P1(root, p.Hydrant, c + new Vector3(2.0f, 0, 1.5f), R4()); others++; }
            if (j % 5 == 0 && p.Planter != null) { placed += P1(root, p.Planter, c + new Vector3(-2.0f, 0, (j % 12 == 0 ? 1.5f : -1.5f)), R4()); others++; }
            if (j % 15 == 0 && j > 0 && meter != null) { placed += P1(root, meter, c + new Vector3(1.6f, 0, -1.8f), R4()); others++; }
            if (j % 24 == 0 && manhole != null) { placed += P1(root, manhole, c + Off(1.2f), R4()); others++; }
            j++;
        }
        // 十字路口：交通灯（帽 40）+ 停车牌点缀
        int tl = 0;
        foreach (var g in roadSet)
        {
            if (tl >= 40) break;
            bool n_ = roadSet.Contains(g + Vector2.up), s = roadSet.Contains(g + Vector2.down);
            bool e = roadSet.Contains(g + Vector2.right), w = roadSet.Contains(g + Vector2.left);
            if (n_ && s && e && w && p.TrafficLight != null && tl % 3 == 0)
            { placed += P1(root, p.TrafficLight, ToWorld(g, 0f) + new Vector3(1.8f, 0, 1.8f), R4()); tl++; others++; }
            else if (n_ && s && e && w)
            { tl++; if (tl % 7 == 0 && signStop != null) { placed += P1(root, signStop, ToWorld(g, 0f) + new Vector3(-1.8f, 0, -1.8f), R4()); others++; } }
        }
        // STARTS：雪糕筒点缀
        foreach (var g in cells["STARTS"])
            if (p.Cone != null) { placed += P1(root, p.Cone, ToWorld(g, 0f) + Off(1.5f), R4()); others++; }
        // PARK：花/灌逐格+野餐桌（v6 密度升档）
        int k = 0;
        foreach (var g in cells["PARK"])
        {
            if (p.Flowers != null || p.Bush != null)
            { placed += P1(root, (k % 3 == 0 && p.Flowers != null) ? p.Flowers : p.Bush, ToWorld(g, 0f) + Off(1.8f), R4()); others++; }
            if (k % 13 == 0 && k > 0 && picnic != null) { placed += P1(root, picnic, ToWorld(g, 0f) + Off(2.2f), R4()); others++; }
            k++;
        }
        Report.Add($"props_placed: {placed} (bench={benches} trash={trash} others={others} · v6 密度×3 升档 · 选型表 R-20260929-street-props-selection §三规则)");
    }

    static int P1(Transform root, GameObject pf, Vector3 pos, int rotQ)
    {
        var go = (GameObject)PrefabUtility.InstantiatePrefab(pf, root);
        if (go == null) return 0;
        go.transform.position = pos;
        go.transform.rotation = Quaternion.Euler(0f, 90f * rotQ, 0f);
        go.isStatic = true;
        return 1;
    }

    static Vector3 Off(float r) => new Vector3((_rng.Next(-100, 101)) / 100f * r, 0, (_rng.Next(-100, 101)) / 100f * r);
    static int R4() => _rng.Next(4);

    // ---------- v3.1 路灯模块拼装（灯证据批定谳：Base=杆/Arm=L 臂/Lights=灯头·bounds 对齐组装）----------
    static int LayStreetLamps(Transform root, HashSet<Vector2> roadSet)
    {
        var pole = LoadPrefab(PropsPf, "SM_Prop_LightPole_Base_01");
        var arm = LoadPrefab(PropsPf, "SM_Prop_LightPole_Arm_01");
        var head = LoadPrefab(PropsPf, "SM_Prop_LightPole_Lights_01");
        if (pole == null || arm == null || head == null) { Report.Add("streetlamps: SKIP（模块缺）"); return 0; }
        var trunk = roadSet.Where(g => RunLen(roadSet, g, true) >= 6 || RunLen(roadSet, g, false) >= 6)
                           .OrderBy(g => (g.x * 73856093f) % 997f + (g.y * 19349663f) % 997f)  // 空间哈希序=全城均匀取灯（判例：x 序取每 4=低 x 偏聚）
                           .ToList();
        int placed = 0, k = 0;
        foreach (var g in trunk)
        {
            if (placed >= 120) break;                     // 预算帽（选型表 §四）
            if (k % 4 != 0) { k++; continue; }
            k++;
            Vector3 c = ToWorld(g, 0f);
            var lampGo = new GameObject("Lamp_" + placed); lampGo.transform.SetParent(root);
            lampGo.transform.position = c + new Vector3(2.2f, 0, 0);   // 路缘侧位
            lampGo.transform.rotation = Quaternion.Euler(0f, (placed % 2 == 0) ? 180f : 0f, 0f); // 交替朝向路心
            var p = (GameObject)PrefabUtility.InstantiatePrefab(pole, lampGo.transform);
            var a = (GameObject)PrefabUtility.InstantiatePrefab(arm, lampGo.transform);
            var h = (GameObject)PrefabUtility.InstantiatePrefab(head, lampGo.transform);
            if (p == null || a == null || h == null) { UnityEngine.Object.DestroyImmediate(lampGo); continue; }
            // bounds 对齐：杆底贴地→臂底=杆顶→灯头挂臂端
            Bounds pb = CalcBounds(p), ab = CalcBounds(a), hb = CalcBounds(h);
            p.transform.localPosition = new Vector3(0, -pb.min.y, 0);
            float poleH = pb.max.y - pb.min.y;
            a.transform.localPosition = new Vector3(0, poleH - ab.min.y, 0);
            h.transform.localPosition = new Vector3(ab.max.x - hb.center.x, ab.center.y - hb.center.y, 0);
            // 灯头 emission 换装（暖白×2.2·自身贴图作 emission map=亮面发光）
            var lampMat = MakeLampHeadMat(h);
            if (lampMat != null)
                foreach (var r in h.GetComponentsInChildren<Renderer>())
                {
                    var mats = r.sharedMaterials;
                    for (int mI = 0; mI < mats.Length; mI++) mats[mI] = lampMat;
                    r.sharedMaterials = mats;
                }
            foreach (var t in lampGo.GetComponentsInChildren<Transform>()) t.gameObject.isStatic = true;
            placed++;
        }
        Report.Add($"streetlamps: {placed}/120 (Base+Arm+Lights 三件拼装·臂端挂灯头·暖白 emission·干道每 4 格交替侧)");
        return placed;
    }

    static Bounds CalcBounds(GameObject go)
    {
        var rs = go.GetComponentsInChildren<Renderer>();
        if (rs.Length == 0) return new Bounds(go.transform.position, Vector3.zero);
        Bounds b = rs[0].bounds; foreach (var r in rs) b.Encapsulate(r.bounds);
        return b;
    }

    static Material _lampHeadMat;
    static Material MakeLampHeadMat(GameObject headPf)
    {
        if (_lampHeadMat != null) return _lampHeadMat;
        Material src = null;
        foreach (var r in headPf.GetComponentsInChildren<Renderer>())
        {
            if (r.sharedMaterial != null) { src = r.sharedMaterial; break; }
        }
        if (src == null) return null;
        var tex = src.HasProperty("_MainTex") ? src.GetTexture("_MainTex") : (src.HasProperty("_BaseMap") ? src.GetTexture("_BaseMap") : null);
        var col = src.HasProperty("_Color") ? src.GetColor("_Color") : (src.HasProperty("_BaseColor") ? src.GetColor("_BaseColor") : Color.white);
        var path = "Assets/Art/Whitebox/LampHead_Night.mat";
        _lampHeadMat = AssetDatabase.LoadAssetAtPath<Material>(path);
        if (_lampHeadMat != null) return _lampHeadMat;
        var m = new Material(Shader.Find("Universal Render Pipeline/Lit")) { name = "LampHead_Night" };
        if (tex != null) m.SetTexture("_BaseMap", tex);
        m.SetColor("_BaseColor", col);
        m.SetFloat("_Smoothness", 0f);
        EnsureEmission(m, tex, new Color(1f, 0.88f, 0.6f) * 2.2f);
        AssetDatabase.CreateAsset(m, path);
        _lampHeadMat = m;
        return m;
    }

    // ---------- v4 L1 行人层（活性 Phase 1·真数据投影=world-state 分区活动值→各区行人密度）----------
    const string CharPf = "Assets/lowpoly/01_现代城市生活/AD-042_Char角色_都市人物_CityCharactersPack/POLYGONCityCharacters/Prefabs";
    static readonly List<ResidentWalker> Walkers = new List<ResidentWalker>();

    static Dictionary<string, int> ParseZoneActivity(string path)
    {
        var d = new Dictionary<string, int>();
        if (!File.Exists(path)) { Report.Add("WARN world-state missing: " + path); return d; }
        var txt = File.ReadAllText(path);
        foreach (Match m in Regex.Matches(txt, "\"id\":\\s*\"(\\w+)\"[\\s\\S]{0,260}?\"activity\":\\s*(\\d+)"))
            d[m.Groups[1].Value] = int.Parse(m.Groups[2].Value);
        return d;
    }

    // 路网 BFS：起→终世界坐标 waypoint 队列
    static List<Vector3> RoadPath(HashSet<Vector2> road, Vector2 from, Vector2 to)
    {
        var prev = new Dictionary<Vector2, Vector2>();
        var seen = new HashSet<Vector2> { from };
        var q = new Queue<Vector2>(); q.Enqueue(from);
        while (q.Count > 0)
        {
            var c = q.Dequeue();
            if (c == to) break;
            foreach (var d in new[] { Vector2.up, Vector2.down, Vector2.left, Vector2.right })
            {
                var nb = c + d;
                if (road.Contains(nb) && !seen.Contains(nb)) { seen.Add(nb); prev[nb] = c; q.Enqueue(nb); }
            }
        }
        if (!seen.Contains(to)) return null;
        var cells = new List<Vector2>();
        var cur = to;
        while (cur != from) { cells.Add(cur); cur = prev[cur]; }
        cells.Add(from);
        cells.Reverse();
        var pts = new List<Vector3>();
        foreach (var c in cells) pts.Add(ToWorld(c, 0f));
        return pts;
    }

    static void LayResidents(Transform root, Dictionary<string, List<Vector2>> cells, HashSet<Vector2> roadSet)
    {
        Walkers.Clear();
        var guids = AssetDatabase.FindAssets("t:Prefab", new[] { CharPf });
        if (guids.Length == 0) { Report.Add("residents: SKIP（AD-042 未寻得）"); return; }
        var figs = new List<GameObject>();
        foreach (var g in guids)
        {
            var go = AssetDatabase.LoadAssetAtPath<GameObject>(AssetDatabase.GUIDToAssetPath(g));
            if (go != null) figs.Add(go);
        }
        var zones = ParseZoneActivity(Path.Combine(FVRoot, "world/world-state.json"));
        // 分区活动→各区行人密度（真数据投影：quant→QUANT/media→MEDIA/gaming→GAME）
        var map = new Dictionary<string, string> { { "quant", "QUANT" }, { "media", "MEDIA" }, { "gaming", "GAME" } };
        int placed = 0;
        for (int i = 0; i < CityNames.Length; i++)
        {
            string zoneKey = map.FirstOrDefault(kv => kv.Value == CityNames[i]).Key;
            int activity = zones.ContainsKey(zoneKey) ? zones[zoneKey] : 1;
            int count = 3 + activity;  // 3-6 人/区·活动值真数据映射
            var districtCenter = new Vector2(AnchorX + CitiesR / GridM * Mathf.Cos(CityAngles[i] * Mathf.Deg2Rad), AnchorY + CitiesR / GridM * Mathf.Sin(CityAngles[i] * Mathf.Deg2Rad));
            for (int w = 0; w < count; w++)
            {
                // 起点=广场环外随机干道格·终点=区中心邻路格（通勤读：中心→各区上班路）
                Vector2 from = NearestRoad(roadSet, new Vector2(AnchorX + 10f * Mathf.Cos(w * 2.4f), AnchorY + 10f * Mathf.Sin(w * 2.4f)));
                Vector2 to = NearestRoad(roadSet, districtCenter + new Vector2(_rng.Next(-4, 5), _rng.Next(-4, 5)));
                var path = RoadPath(roadSet, from, to);
                if (path == null || path.Count < 2) continue;
                var loop = new List<Vector3>(path);
                for (int pI = path.Count - 2; pI >= 0; pI--) loop.Add(path[pI]); // 去程+回程=环形通勤
                var fig = figs[(_rng.Next(figs.Count) + placed) % figs.Count];
                var go = (GameObject)PrefabUtility.InstantiatePrefab(fig, root);
                if (go == null) continue;
                go.name = "Resident_" + CityNames[i] + "_" + w;
                var walker = go.AddComponent<ResidentWalker>();
                walker.traceId = zoneKey + ":activity=" + activity + "/walker" + w;
                walker.BuildRoute(loop);
                Walkers.Add(walker);
                placed++;
            }
            Report.Add($"residents_{CityNames[i]}: {count} (zone={zoneKey} activity={activity} 真数据映射)");
        }
        Report.Add($"residents_total: {placed}（AD-042 {figs.Count} 件确定性选人·waypoint 环形通勤·步速 1.2m/s·编辑态 Advance 可证位移）");
    }

    static Vector2 NearestRoad(HashSet<Vector2> road, Vector2 approx)
    {
        Vector2 best = approx; float bestD = float.MaxValue;
        foreach (var c in road)
        {
            float d = (c - approx).sqrMagnitude;
            if (d < bestD) { bestD = d; best = c; }
        }
        return best;
    }

    // ---------- v3 五色律窗灯（灯光专家 SOP：Emissive_01 直供·材质资产级·禁逐楼改）----------
    static readonly Dictionary<Renderer, Material[]> _dayMats = new Dictionary<Renderer, Material[]>();  // v6 日帧材质还原账（夜帧换装可逆律）

    // v6 公开静态（桥捕获夜帧共用）+可逆换装：夜帧专用五色律窗灯·RestoreDayWindows 回归日材质（存盘态=零发光窗）
    public static void ApplyNightWindows(Transform root)
    {
        _dayMats.Clear();
        var tex = AssetDatabase.LoadAssetAtPath<Texture2D>("Assets/lowpoly/01_现代城市生活/AD-022_Scene场景_现代城市_CityPack/PolygonCity/Textures/Emissive_01.png");
        if (tex == null) { Report.Add("WARN emissive_01 missing"); return; }
        var colors = new Dictionary<string, Color> {
            { "QUANT", new Color(0.94f, 0.81f, 0.25f) },   // 金=资金流
            { "MEDIA", new Color(0.92f, 0.34f, 0.78f) },   // 品红=流量
            { "GAME",  new Color(0.31f, 0.89f, 0.86f) } }; // 青=数据流
        int swapped = 0;
        for (int i = 0; i < CityNames.Length; i++)
        {
            var district = root.Find("District_" + CityNames[i]);
            if (district == null) continue;
            var cache = new Dictionary<Material, Material>();
            foreach (var r in district.GetComponentsInChildren<Renderer>())
            {
                if (!_dayMats.ContainsKey(r)) _dayMats[r] = r.sharedMaterials;   // v6 还原账（换装前原值）
                var mats = r.sharedMaterials; bool ch = false;
                for (int m = 0; m < mats.Length; m++)
                {
                    var s = mats[m];
                    if (s == null || s.name.StartsWith("Night_")) continue;
                    Material variant;
                    if (!cache.TryGetValue(s, out variant))
                    {
                        variant = MakeNightVariant(s, tex, CityNames[i], colors[CityNames[i]]);
                        if (variant == null) continue;
                        cache[s] = variant;
                    }
                    mats[m] = variant; ch = true; swapped++;
                }
                if (ch) { r.sharedMaterials = mats; }
            }
        }
        Report.Add($"night_windows: renderers_materials_swapped={swapped} (五色律: QUANT金/MEDIA品红/GAME青·Emissive_01 直供)");
    }

    // v6 夜帧换装可逆律·日材质回归（CaptureAll/桥 夜帧后必调·存盘零发光窗）
    public static void RestoreDayWindows(Transform root)
    {
        int restored = 0;
        foreach (var kv in _dayMats) { if (kv.Key != null) { kv.Key.sharedMaterials = kv.Value; restored++; } }
        _dayMats.Clear();
        Report.Add($"day_windows_restored: renderers={restored}（日帧回归原生材质）");
    }

    static Material MakeNightVariant(Material src, Texture2D emis, string city, Color tint)
    {
        var name = $"Night_{city}_{src.name}";
        var path = $"Assets/Art/Whitebox/{name}.mat";
        var existing = AssetDatabase.LoadAssetAtPath<Material>(path);
        if (existing != null) { EnsureEmission(existing, emis, tint * 2.8f); return existing; }   // v7 2.2→2.8（bloom headroom）
        var m = new Material(Shader.Find("Universal Render Pipeline/Lit")) { name = name };
        var baseTex = src.HasProperty("_MainTex") ? src.GetTexture("_MainTex") : (src.HasProperty("_BaseMap") ? src.GetTexture("_BaseMap") : null);
        var baseCol = src.HasProperty("_Color") ? src.GetColor("_Color") : (src.HasProperty("_BaseColor") ? src.GetColor("_BaseColor") : Color.white);
        if (baseTex != null) m.SetTexture("_BaseMap", baseTex);
        m.SetColor("_BaseColor", baseCol);
        m.SetFloat("_Smoothness", 0f);
        EnsureEmission(m, emis, tint * 2.8f);
        AssetDatabase.CreateAsset(m, path);
        return m;
    }

    // emission 持久化双保险（判例：EnableKeyword 单用=m_ValidKeywords 空失落灯·shaderKeywords 数组直写+GI 标志+SetDirty 三连）
    static void EnsureEmission(Material m, Texture t, Color c)
    {
        m.SetTexture("_EmissionMap", t);
        m.SetColor("_EmissionColor", c);
        m.shaderKeywords = new[] { "_EMISSION" };
        m.globalIlluminationFlags = MaterialGlobalIlluminationFlags.RealtimeEmissive;
        EditorUtility.SetDirty(m);
    }

    // v3 bloom（官方默认值律：threshold 0.9·scatter 0.7·intensity 显式开）
    static void SetupBloom(Camera cam)
    {
        var cd = cam.GetComponent<UnityEngine.Rendering.Universal.UniversalAdditionalCameraData>();
        if (cd == null) cd = cam.gameObject.AddComponent<UnityEngine.Rendering.Universal.UniversalAdditionalCameraData>();
        cd.renderPostProcessing = true;
        var volGo = new GameObject("GlobalVolume");
        var vol = volGo.AddComponent<UnityEngine.Rendering.Volume>();
        vol.isGlobal = true;
        var profilePath = "Assets/Art/Whitebox/GlobalVolumeProfile.asset";
        var profile = AssetDatabase.LoadAssetAtPath<UnityEngine.Rendering.VolumeProfile>(profilePath);
        if (profile == null)
        {
            profile = ScriptableObject.CreateInstance<UnityEngine.Rendering.VolumeProfile>();
            AssetDatabase.CreateAsset(profile, profilePath);
        }
        UnityEngine.Rendering.Universal.Bloom bloom;
        if (!profile.TryGet(out bloom)) bloom = profile.Add<UnityEngine.Rendering.Universal.Bloom>(true);
        // 强制覆写（判例：profile=持久资产·TryGet 命中旧件后只在创建时设值=旧值永不更新）
        bloom.threshold.Override(0.9f);
        bloom.intensity.Override(1.2f);   // v7 0.9→1.2（夜帧光晕升档·bloom 链批捕获疑断悬案并测）
        bloom.scatter.Override(0.7f);
        vol.sharedProfile = profile;
        Report.Add("bloom: threshold=0.9 intensity=1.2 scatter=0.7 (URP 全局 Volume+相机 postProcessing·v7 夜帧升档)");
    }

    // ---------- v6 P3 层（Top1 施工案·地面语言/车流/屋顶 dress·09-29 CEO 头部Top1令）----------

    // 人行道路缘+地面语言层：路格开敞边铺 Sidewalk 件（实测宽窄分带）+PARK 格 Grass 满铺（L0 读作公园非空地）
    static void LaySidewalks(Transform root, Dictionary<string, List<Vector2>> cells, HashSet<Vector2> roadSet)
    {
        var straight = LoadPrefab(EnvPf, "SM_Env_Sidewalk_Straight_01");
        var grass = LoadPrefab(EnvPf, "SM_Env_Grass_01");
        if (straight == null && grass == null) { Report.Add("sidewalks: SKIP（件缺）"); return; }
        var b = straight != null ? Measure(straight) : null;
        float w = b != null ? Mathf.Min(b.Value.x, b.Value.z) : 5f;
        bool strip = w < 3f;                                  // 窄件=贴边条 / 宽件=满格铺邻格
        float baseRot = (b != null && b.Value.z > b.Value.x) ? 90f : 0f;   // 件原生长轴归正
        var occupied = new HashSet<Vector2>();
        foreach (var k in cells.Keys) foreach (var c in cells[k]) occupied.Add(c);
        int placed = 0, skipped = 0, grassed = 0;
        if (straight != null)
        {
            // v7 建筑足迹避让账（District 子件世界 bounds+2m·人行道禁压楼）
            var blds = new List<UnityEngine.Rect>();
            foreach (var city in CityNames)
            {
                var dis = root.Find("District_" + city);
                if (dis == null) continue;
                foreach (Transform bld in dis.transform)
                {
                    var rs = bld.GetComponentsInChildren<Renderer>();
                    if (rs.Length == 0) continue;
                    var bb = rs[0].bounds;
                    foreach (var r in rs) bb.Encapsulate(r.bounds);
                    blds.Add(UnityEngine.Rect.MinMaxRect(bb.min.x - 2f, bb.min.z - 2f, bb.max.x + 2f, bb.max.z + 2f));
                }
            }
            bool InBld(Vector3 w) { foreach (var rc in blds) if (rc.Contains(new Vector2(w.x, w.z))) return true; return false; }
            foreach (var g in roadSet)
            {
                if (placed >= 400) break;                    // v7 帽 600→400（v6 判据帧蓝铺装淹没路网判负）
                foreach (var d in new[] { Vector2.up, Vector2.down, Vector2.left, Vector2.right })
                {
                    var nb = g + d;
                    if (occupied.Contains(nb) || roadSet.Contains(nb)) { skipped++; continue; }
                    if (placed >= 400) break;
                    Vector3 c3 = ToWorld(g, 0f);
                    Vector3 dir3 = new Vector3(d.x, 0, d.y);
                    Vector3 wp = strip ? c3 + dir3 * 2.5f : c3 + dir3 * 5f;
                    if (InBld(wp)) { skipped++; continue; }   // v7 建筑足迹避让
                    var go = (GameObject)PrefabUtility.InstantiatePrefab(straight, root);
                    if (go == null) continue;
                    go.transform.position = wp;
                    go.transform.rotation = Quaternion.Euler(0f, baseRot + (d.x != 0 ? 90f : 0f), 0f);
                    go.isStatic = true; placed++;
                }
            }
        }
        if (grass != null)
        {
            foreach (var g in cells["PARK"])
            {
                if (roadSet.Contains(g)) continue;
                var go = (GameObject)PrefabUtility.InstantiatePrefab(grass, root);
                if (go == null) continue;
                go.transform.position = ToWorld(g, 0f);
                go.transform.rotation = Quaternion.Euler(0f, 90f * _rng.Next(4), 0f);
                go.isStatic = true; grassed++;
            }
        }
        Report.Add($"sidewalks: placed={placed} skipped_edges={skipped} mode={(strip ? "edge-strip" : "full-tile")} piece_w={w:F2}m | park_grass={grassed}");
    }

    // 停车层：干道缘侧停泊（AD-022 Vehicles×8·确定性选车·空间哈希序防偏聚）
    static void LayParkedCars(Transform root, HashSet<Vector2> roadSet)
    {
        string[] names = { "SM_Veh_Car_Sedan_01", "SM_Veh_Car_Small_01", "SM_Veh_Car_Medium_01", "SM_Veh_Car_Taxi_01", "SM_Veh_Car_Van_01", "SM_Veh_Car_Muscle_01", "SM_Veh_Car_Police_01", "SM_Veh_Car_Ambo_01" };
        var pool = names.Select(n => LoadPrefab(VehPf, n)).Where(x => x != null).ToArray();
        if (pool.Length == 0) { Report.Add("parked_cars: SKIP（件缺）"); return; }
        var trunk = roadSet.Where(g => RunLen(roadSet, g, true) >= 6 || RunLen(roadSet, g, false) >= 6)
                           .OrderBy(g => (g.x * 73856093f) % 997f + (g.y * 19349663f) % 997f).ToList();
        int placed = 0, k = 0;
        foreach (var g in trunk)
        {
            if (placed >= 120) break;                      // v7 80→120（判据帧街面车流密度升档）
            if (k % 4 != 0) { k++; continue; }
            k++;
            bool ew = RunLen(roadSet, g, true) >= RunLen(roadSet, g, false);
            Vector3 c = ToWorld(g, 0f);
            var go = (GameObject)PrefabUtility.InstantiatePrefab(pool[_rng.Next(pool.Length)], root);
            if (go == null) continue;
            float side = (placed % 2 == 0) ? 1f : -1f;
            go.transform.position = c + (ew ? new Vector3(0, 0, side * 1.6f) : new Vector3(side * 1.6f, 0, 0));
            go.transform.rotation = Quaternion.Euler(0f, ew ? (side > 0 ? 0f : 180f) : (side > 0 ? 90f : 270f), 0f);
            go.isStatic = true; placed++;
        }
        Report.Add($"parked_cars: {placed}/120 (Vehicles×{pool.Length}·缘侧 1.6m·v7 密度升档)");
    }

    // 屋顶 dress 层（Top1 D2 细节律：屋顶 clutter=「有人住」vs「沙盘」分水岭·AD-022 屋顶件直供）
    static void DressRoofs(Transform root)
    {
        var ac1 = LoadPrefab(PropsPf, "SM_Prop_Roof_Aircon_01");
        var ac2 = LoadPrefab(PropsPf, "SM_Prop_Roof_Aircon_02");
        var dish = LoadPrefab(PropsPf, "SM_Prop_SatDish_01");
        var vent = LoadPrefab(PropsPf, "SM_Prop_Vents_Straight_01");
        var bbRoof = LoadPrefab(PropsPf, "SM_Prop_Billboard_Roof_01");
        var bbSigns = new[] { "SM_Prop_Billboard_Sign_01", "SM_Prop_Billboard_Sign_02", "SM_Prop_Billboard_Sign_03", "SM_Prop_Billboard_Sign_04", "SM_Prop_Billboard_Sign_05", "SM_Prop_Billboard_Sign_06", "SM_Prop_Billboard_Sign_07" }
                      .Select(n => LoadPrefab(PropsPf, n)).Where(x => x != null).ToArray();
        var bbH = bbRoof != null ? Measure(bbRoof) : null;
        float bbTop = bbH != null ? bbH.Value.y : 3.2f;
        int dressed = 0, boards = 0, blds = 0;
        foreach (var city in CityNames)
        {
            var district = root.Find("District_" + city);
            if (district == null) continue;
            foreach (Transform bld in district.transform)
            {
                blds++;
                var rs = bld.GetComponentsInChildren<Renderer>();
                if (rs.Length == 0) continue;
                var bounds = rs[0].bounds;
                foreach (var r in rs) bounds.Encapsulate(r.bounds);
                float top = bounds.max.y, fx = bounds.size.x, fz = bounds.size.z;
                if (fx < 3f || fz < 3f) continue;              // v7 顶面 ≥3m 判据（4→3·覆盖升档）
                int n = 0;
                foreach (var cand in new[] { ac1, ac2, dish, vent })
                {
                    if (cand == null || n >= 3) continue;          // v7 帽 2→3（判据帧屋顶覆盖不足判负）
                    if (_rng.Next(2) == 0)                          // v7 概率 1/3→1/2
                    {
                        var go = (GameObject)PrefabUtility.InstantiatePrefab(cand, district);
                        if (go == null) continue;
                        go.transform.position = new Vector3(bounds.center.x + (float)((_rng.NextDouble() - 0.5) * 0.5) * fx, top, bounds.center.z + (float)((_rng.NextDouble() - 0.5) * 0.5) * fz);
                        go.transform.rotation = Quaternion.Euler(0f, 90f * _rng.Next(4), 0f);
                        go.isStatic = true; n++; dressed++;
                    }
                }
                if (bbRoof != null && bbSigns.Length > 0 && blds % 6 == 0)
                {
                    var rot = Quaternion.Euler(0f, 90f * _rng.Next(4), 0f);
                    var bgo = (GameObject)PrefabUtility.InstantiatePrefab(bbRoof, district);
                    var sgo = (GameObject)PrefabUtility.InstantiatePrefab(bbSigns[_rng.Next(bbSigns.Length)], district);
                    if (bgo != null && sgo != null)
                    {
                        bgo.transform.position = new Vector3(bounds.center.x, top, bounds.center.z);
                        sgo.transform.position = bgo.transform.position + new Vector3(0f, bbTop, 0f);
                        bgo.transform.rotation = rot; sgo.transform.rotation = rot;
                        bgo.isStatic = true; sgo.isStatic = true; boards++;
                    }
                }
            }
        }
        Report.Add($"roof_dress: buildings={blds} pieces={dressed} billboards={boards} (Roof_Aircon/SatDish/Vents/Billboard_Roof+Sign×7)");
    }

    // ---------- v7 夜帧光池层（Top1 施工案·夜景光源层次第2层：路灯光池·径向贴图程序生成）----------
    static GameObject BuildNightGlow(Transform root)
    {
        var existing = root.Find("NightFX");
        if (existing != null) { existing.gameObject.SetActive(false); return existing.gameObject; }
        // 径向渐变贴图（64×64·alpha=(1-r)^2·程序生成零外部依赖）
        var texPath = "Assets/Art/Whitebox/LampGlow.png";
        var tex = AssetDatabase.LoadAssetAtPath<Texture2D>(texPath);
        if (tex == null)
        {
            var t = new Texture2D(64, 64, TextureFormat.RGBA32, false);
            for (int y = 0; y < 64; y++) for (int x = 0; x < 64; x++)
            {
                float dx = (x - 31.5f) / 31.5f, dy = (y - 31.5f) / 31.5f;
                float a = Mathf.Clamp01(1f - Mathf.Sqrt(dx * dx + dy * dy)); a *= a; a *= 0.32f;   // v8 0.9→0.32（夜帧「暖米色白天感」根因=光池过强把地面刷亮判例）
                t.SetPixel(x, y, new Color(1f, 1f, 1f, a));
            }
            t.Apply();
            File.WriteAllBytes(Path.Combine(Application.dataPath, "Art/Whitebox/LampGlow.png"), t.EncodeToPNG());
            AssetDatabase.ImportAsset(texPath);
            tex = AssetDatabase.LoadAssetAtPath<Texture2D>(texPath);
        }
        var matPath = "Assets/Art/Whitebox/LampGlow.mat";
        var mat = AssetDatabase.LoadAssetAtPath<Material>(matPath);
        if (mat == null)
        {
            mat = new Material(Shader.Find("Universal Render Pipeline/Unlit")) { name = "LampGlow" };
            AssetDatabase.CreateAsset(mat, matPath);
        }
        mat.SetTexture("_BaseMap", tex);
        mat.SetColor("_BaseColor", new Color(1f, 0.72f, 0.4f, 1f));
        mat.SetFloat("_Surface", 1f);                                   // Transparent
        mat.SetFloat("_Blend", 0f);
        mat.EnableKeyword("_SURFACE_TYPE_TRANSPARENT");
        mat.SetOverrideTag("RenderType", "Transparent");
        mat.SetInt("_SrcBlend", (int)UnityEngine.Rendering.BlendMode.SrcAlpha);
        mat.SetInt("_DstBlend", (int)UnityEngine.Rendering.BlendMode.OneMinusSrcAlpha);
        mat.SetInt("_ZWrite", 0);
        mat.renderQueue = 3000;
        EditorUtility.SetDirty(mat);
        // 逐灯铺光斑（Lamp_* 件位投影）
        var parent = new GameObject("NightFX"); parent.transform.SetParent(root);
        int n = 0;
        foreach (Transform ch in root)
        {
            if (!ch.name.StartsWith("Lamp_")) continue;
            var q = GameObject.CreatePrimitive(PrimitiveType.Quad);
            q.name = "Glow_" + ch.name;
            q.transform.SetParent(parent.transform);
            q.transform.position = new Vector3(ch.position.x, 0.13f, ch.position.z);
            q.transform.rotation = Quaternion.Euler(90f, 0f, 0f);
            q.transform.localScale = Vector3.one * 5f;   // v8 7→5m（可数光斑律）
            q.GetComponent<Renderer>().sharedMaterial = mat;
            q.isStatic = true; n++;
        }
        parent.SetActive(false);
        Report.Add($"night_glow: lamp_pools={n} (径向贴图程序生成·Unlit 透明·默认关·夜帧激活)");
        return parent;
    }

    // ---------- 工具 ----------
    static Dictionary<string, List<Vector2>> ParseCells(string path)
    {
        var dict = new Dictionary<string, List<Vector2>> {
            { "ROAD", new List<Vector2>() }, { "WATER", new List<Vector2>() }, { "SAND", new List<Vector2>() },
            { "PLAZA", new List<Vector2>() }, { "PARK", new List<Vector2>() }, { "BRIDGES", new List<Vector2>() },
            { "TREES", new List<Vector2>() }, { "STARTS", new List<Vector2>() } };
        if (!File.Exists(path)) { Report.Add("WARN: td-organic-data not found"); return dict; }
        var re = new Regex(@"(\d+),(\d+)");
        foreach (var line in File.ReadAllLines(path))
        {
            var sp = line.Split(' ')[0];
            if (!dict.ContainsKey(sp)) continue;
            foreach (Match m in re.Matches(line))
                dict[sp].Add(new Vector2(int.Parse(m.Groups[1].Value), int.Parse(m.Groups[2].Value)));
        }
        return dict;
    }

    static Vector3 ToWorld(Vector2 g, float y) => new Vector3((g.x - AnchorX) * GridM, y, (g.y - AnchorY) * GridM);

    static UnityEngine.Object PickAsset(string nameFilter, string folder)
    {
        var guids = AssetDatabase.FindAssets(nameFilter, new[] { folder });
        if (guids.Length == 0) return null;
        var path = AssetDatabase.GUIDToAssetPath(guids[0]);
        return AssetDatabase.LoadAssetAtPath(path, typeof(UnityEngine.Object));
    }

    static string AssetPathOf(UnityEngine.Object o) => o == null ? "NONE" : AssetDatabase.GetAssetPath(o);

    static Mesh QuadMesh(List<Vector2> cells, Color32 c, float half)
    {
        var mesh = new Mesh { indexFormat = IndexFormat.UInt32 };
        if (cells.Count == 0) return mesh;
        var verts = new List<Vector3>(); var tris = new List<int>();
        foreach (var g in cells)
        {
            Vector3 p = ToWorld(g, 0.04f);
            int i0 = verts.Count;
            verts.Add(p + new Vector3(-half, 0, -half)); verts.Add(p + new Vector3(half, 0, -half));
            verts.Add(p + new Vector3(half, 0, half)); verts.Add(p + new Vector3(-half, 0, half));
            tris.AddRange(new[] { i0, i0 + 2, i0 + 1, i0, i0 + 3, i0 + 2 }); // v6 修：单面朝上（原双面绕序半数朝下=RecalculateNormals 法线对翻→水面/沙面暗斑判例·俯视永不见底面）
        }
        mesh.SetVertices(verts); mesh.SetTriangles(tris, 0); mesh.RecalculateNormals(); mesh.RecalculateBounds();
        return mesh;
    }

    static Mesh RingMesh(float radius, float width, Color32 c)
    {
        var mesh = new Mesh();
        var verts = new List<Vector3>(); var tris = new List<int>();
        for (int i = 0; i < 64; i++)
        {
            float a0 = i / 64f * Mathf.PI * 2f, a1 = (i + 1) / 64f * Mathf.PI * 2f;
            int i0 = verts.Count;
            verts.Add(new Vector3(Mathf.Cos(a0) * radius, 0.3f, Mathf.Sin(a0) * radius));
            verts.Add(new Vector3(Mathf.Cos(a0) * (radius + width), 0.3f, Mathf.Sin(a0) * (radius + width)));
            verts.Add(new Vector3(Mathf.Cos(a1) * (radius + width), 0.3f, Mathf.Sin(a1) * (radius + width)));
            verts.Add(new Vector3(Mathf.Cos(a1) * radius, 0.3f, Mathf.Sin(a1) * radius));
            tris.AddRange(new[] { i0, i0 + 2, i0 + 1, i0, i0 + 3, i0 + 2 }); // v6 修：单面朝上（原双面绕序半数朝下=RecalculateNormals 法线对翻→水面/沙面暗斑判例·俯视永不见底面）
        }
        mesh.SetVertices(verts); mesh.SetTriangles(tris, 0); mesh.RecalculateNormals(); mesh.RecalculateBounds();
        return mesh;
    }

    static Material Mat(string name, Color c, string shader = "Universal Render Pipeline/Unlit")
    {
        var path = $"Assets/Art/Whitebox/{name}.mat";
        var existing = AssetDatabase.LoadAssetAtPath<Material>(path);
        if (existing != null)
        {
            // 存在即原地更新（防旧资产缓存吃掉新 shader/色——Ground 判例）
            var want = Shader.Find(shader);
            if (want != null && existing.shader != want) existing.shader = want;
            if (existing.HasProperty("_BaseColor")) existing.SetColor("_BaseColor", c);
            else if (existing.HasProperty("_Color")) existing.SetColor("_Color", c);
            EditorUtility.SetDirty(existing);
            return existing;
        }
        var m = new Material(Shader.Find(shader)) { name = name };
        if (m.HasProperty("_BaseColor")) m.SetColor("_BaseColor", c);
        else if (m.HasProperty("_Color")) m.SetColor("_Color", c);
        AssetDatabase.CreateAsset(m, path);
        return m;
    }

    static Material MakePulseMat()
    {
        var path = "Assets/Art/Whitebox/PulseBeacon.mat";
        var m = AssetDatabase.LoadAssetAtPath<Material>(path);
        if (m == null)
        {
            m = new Material(Shader.Find("Universal Render Pipeline/Lit")) { name = "PulseBeacon" };
            if (m.HasProperty("_BaseColor")) m.SetColor("_BaseColor", new Color(0.9f, 0.95f, 1f));
            m.EnableKeyword("_EMISSION");
            m.SetColor("_EmissionColor", Color.white * 0.15f);
            AssetDatabase.CreateAsset(m, path);
        }
        return m;
    }

    static void CaptureAll(Camera cam)
    {
        var sw = Stopwatch.StartNew();
        Shot(cam, "A_L0_overview.png", 50f, 320f, Vector3.zero);
        Shot(cam, "A_L1_brainring.png", 55f, 110f, new Vector3(0, 20f, 0));
        Shot(cam, "A_L2_street.png", 60f, 24f, new Vector3(180, 6, -34)); // QUANT 城北外向城里看（北排楼群入画）
        Shot(cam, "A_X_bridge.png", 50f, 30f, ToWorld(new Vector2(24f, 26f), 0)); // v2 桥跨全貌（跨外南望·防机位入跨被墙挡判例）
        Shot(cam, "A_X_shore.png", 58f, 16f, ToWorld(new Vector2(56f, 32f), 0));      // v2 长桥段水岸（WaterEdge）
        Shot(cam, "A_X_plaza.png", 50f, 16f, Vector3.zero);                            // v2 广场铺装+脑塔基座
        _pulseMat.SetColor("_EmissionColor", Color.white * 3.5f);
        Shot(cam, "A_breath_on.png", 55f, 110f, new Vector3(0, 40f, 0));
        _pulseMat.SetColor("_EmissionColor", Color.white * 0.05f);
        Shot(cam, "A_breath_off.png", 55f, 110f, new Vector3(0, 40f, 0));
        // v3 夜档判据帧（灯光专家 SOP：主光转夜→窗灯自发光可见即过·俯角=+38 下倾判例[-35=仰角全黑帧实锤]）
        var light = UnityEngine.Object.FindObjectOfType<Light>();
        var dayRot = light.transform.rotation; var dayInt = light.intensity; var dayCol = light.color;
        var dayBg = cam.backgroundColor; var dayClear = cam.clearFlags; var dayFog = RenderSettings.fog;
        var dayFogD = RenderSettings.fogDensity; var dayFogCol = RenderSettings.fogColor;
        var dayAmb = RenderSettings.ambientLight; var dayAmbMode = RenderSettings.ambientMode;
        var rootGo = GameObject.Find("AssembledCity");
        if (rootGo != null) ApplyNightWindows(rootGo.transform);           // v6 夜帧换装（可逆·存盘回归日材质）
        var fillObj = GameObject.Find("SkyFill_Light");
        var fl2 = fillObj != null ? fillObj.GetComponent<Light>() : null;
        var fillDayInt = fl2 != null ? fl2.intensity : 0f;
        var fillDayCol = fl2 != null ? fl2.color : Color.white;
        if (fl2 != null) { fl2.intensity = 0.06f; fl2.color = new Color32(0x2A, 0x35, 0x50, 255); }  // v7 夜帧补光压暗转冷（「白天感」根因修）
        var nfx = rootGo != null ? rootGo.transform.Find("NightFX") : null;
        if (nfx != null) nfx.gameObject.SetActive(true);                    // v7 路灯光池层激活
        RenderSettings.ambientMode = AmbientMode.Flat;
        RenderSettings.ambientLight = new Color(0.05f, 0.06f, 0.11f);
        light.transform.rotation = Quaternion.Euler(38f, 150f, 0f);
        light.intensity = 0.18f;                                            // v7 0.3→0.18（月光档·夜帧地面过亮判负修）
        light.color = new Color32(0xA9, 0xC2, 0xE8, 255);                   // v7 冷月光（暖蓝=昼感判负）
        cam.clearFlags = CameraClearFlags.SolidColor;               // P2：夜帧走实底天（程序化天空盒白昼读法判负）
        cam.backgroundColor = new Color32(0x12, 0x1A, 0x30, 255);
        RenderSettings.fog = true;                                          // v7 夜帧极淡冷雾拉纵深（v6 全关=远近糊成片判负）
        RenderSettings.fogColor = new Color32(0x0E, 0x16, 0x26, 255);
        RenderSettings.fogDensity = 0.0008f;
        Shot(cam, "A_X_night_district.png", 55f, 60f, new Vector3(180f, 0, 0)); // QUANT 城夜景（金窗）
        Shot(cam, "A_X_night_plaza.png", 55f, 40f, new Vector3(0, 10f, 0));     // 广场+脑塔夜景
        light.transform.rotation = dayRot; light.intensity = dayInt; light.color = dayCol;
        cam.backgroundColor = dayBg; cam.clearFlags = dayClear; RenderSettings.fog = dayFog; RenderSettings.fogDensity = dayFogD; RenderSettings.fogColor = dayFogCol;
        RenderSettings.ambientLight = dayAmb; RenderSettings.ambientMode = dayAmbMode;
        if (fl2 != null) { fl2.intensity = fillDayInt; fl2.color = fillDayCol; }
        if (nfx != null) nfx.gameObject.SetActive(false);                  // v7 光池层归关
        if (rootGo != null) RestoreDayWindows(rootGo.transform);          // v6 回归日材质（后续帧+存盘=零发光窗）
        Shot(cam, "A_X_props.png", 62f, 10f, new Vector3(20f, 0f, -15f));      // v3 街景道具近景（长椅/邮筒/公交站区）
        var cyc = light != null ? light.GetComponent<DayNightCycle>() : null;
        if (cyc != null) { cyc.enabled = true; Report.Add("daynight_cycle: re-enabled after capture（判据帧确定性律·GUI 实检=北京钟实时城光）"); }
        Report.Add($"capture_ms={sw.ElapsedMilliseconds}");
    }

    static void Shot(Camera cam, string file, float pitchDeg, float height, Vector3 target)
    {
        if (pitchDeg > 0)
        {
            float d = height / Mathf.Tan(pitchDeg * Mathf.Deg2Rad);
            cam.transform.position = target + new Vector3(0, height, -d);
            cam.transform.LookAt(target);
        }
        else { cam.transform.LookAt(target); }
        const int w = 1920, h = 1080;
        var rt = new RenderTexture(w, h, 24);
        cam.targetTexture = rt;
        cam.Render();
        RenderTexture.active = rt;
        var t = new Texture2D(w, h, TextureFormat.RGB24, false);
        t.ReadPixels(new Rect(0, 0, w, h), 0, 0); t.Apply();
        File.WriteAllBytes(Path.Combine(Shots, file), t.EncodeToPNG());
        cam.targetTexture = null; RenderTexture.active = null;
        rt.Release(); UnityEngine.Object.DestroyImmediate(rt); UnityEngine.Object.DestroyImmediate(t);
    }

    static void WriteReport()
    {
        Report.Add("selection_law: 全部件库内挑选（CEO 令 09-28 选件搭建令）·AI/自制生产径停");
        File.WriteAllLines(Path.Combine(Staging, "assemble-report.md"), Report.ToArray());
        AssetDatabase.Refresh();
    }
}
