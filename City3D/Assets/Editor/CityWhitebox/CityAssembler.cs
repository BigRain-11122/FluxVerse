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

    static string FVRoot => Directory.GetParent(Directory.GetParent(Application.dataPath).FullName).FullName;
    static string Staging => Path.Combine(FVRoot, "City3D-staging");
    static string Shots => Path.Combine(Staging, "shots2");

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

        var light = UnityEngine.Object.FindObjectOfType<Light>();
        if (light != null)
        {
            light.type = LightType.Directional;
            light.transform.rotation = Quaternion.Euler(50f, -30f, 0f);
            light.intensity = 1.15f;
            light.shadows = LightShadows.Soft;
        }
        var cam = Camera.main;
        cam.clearFlags = CameraClearFlags.SolidColor;
        cam.backgroundColor = new Color32(0x8F, 0xCD, 0xE8, 255);
        cam.fieldOfView = 45f;

        // 地面（512m 城域画布·版本核心=320m 居中）
        var ground = GameObject.CreatePrimitive(PrimitiveType.Cube);
        ground.name = "Ground"; ground.transform.SetParent(root.transform);
        ground.transform.localScale = new Vector3(512f, 0.2f, 512f);
        ground.transform.position = Vector3.down * 0.1f;
        ground.GetComponent<Renderer>().sharedMaterial = Mat("Ground", new Color32(0xC2, 0xBD, 0xB3, 255), "Universal Render Pipeline/Lit"); // 浅混凝土色+Lit 收影（防与路件沥青灰同色互吃）

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
        MarkOuterRing(root.transform);
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
        var mr = go.AddComponent<MeshRenderer>(); mr.sharedMaterial = Mat("WaterA", new Color32(0x4F, 0xA0, 0xC8, 255));
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
        sg.AddComponent<MeshRenderer>().sharedMaterial = Mat("SandA", new Color32(0xD8, 0xC9, 0x9E, 255));

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

    // ---------- 工具 ----------
    static Dictionary<string, List<Vector2>> ParseCells(string path)
    {
        var dict = new Dictionary<string, List<Vector2>> {
            { "ROAD", new List<Vector2>() }, { "WATER", new List<Vector2>() }, { "SAND", new List<Vector2>() },
            { "PLAZA", new List<Vector2>() }, { "PARK", new List<Vector2>() }, { "BRIDGES", new List<Vector2>() },
            { "TREES", new List<Vector2>() } };
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
            tris.AddRange(new[] { i0, i0 + 1, i0 + 2, i0, i0 + 2, i0 + 3, i0, i0 + 2, i0 + 1, i0, i0 + 3, i0 + 2 });
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
            tris.AddRange(new[] { i0, i0 + 1, i0 + 2, i0, i0 + 2, i0 + 3, i0, i0 + 2, i0 + 1, i0, i0 + 3, i0 + 2 });
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
