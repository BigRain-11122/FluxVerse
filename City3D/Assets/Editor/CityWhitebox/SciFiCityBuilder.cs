using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine;
using UnityEngine.Rendering;

// 赛博硅基城 v1（CEO 令 2026-09-29「基于赛博城改造硅基城市·另存一份·用里面的资产合理使用·居民用 polygon 角色」）
// 结构=我方版式数据（td-organic-data）｜资产=AD-018 SciFi City 全家桶（建筑/路/人行道/Market 灯串/Hologram 招牌/悬浮车）+居民=AD-018 20 角色+AD-042 19 角色
// 自包含批：建城→Built-in→URP 过桥→存盘→日/夜判据帧。原城 CityAssembled.unity 零触碰（另存律）。
public static class SciFiCityBuilder
{
    const int Seed = 9029;
    const float GridM = 5f;
    const string SFPf = "Assets/lowpoly/03_科幻/AD-018_Scene场景_赛博科幻城_SciFiCity/PolygonSciFiCity/Prefabs";
    const string Chars42Pf = "Assets/lowpoly/01_现代城市生活/AD-042_Char角色_都市人物_CityCharactersPack/POLYGONCityCharacters/Prefabs";
    const string ScenePath = "Assets/Scenes/CitySciFi.unity";
    static System.Random _rng;
    static readonly List<string> Report = new List<string>();
    static readonly string[] CityNames = { "QUANT", "MEDIA", "GAME" };
    static Material _glowMat;
    static readonly Dictionary<Renderer, Material[]> _dayMats = new Dictionary<Renderer, Material[]>();
    static readonly Dictionary<Renderer, Material> _groundMats = new Dictionary<Renderer, Material>();

    public static void BatchEntry()
    {
        try { Build(); }
        catch (Exception e) { Debug.LogError("SCIFICITY_FAIL: " + e); EditorApplication.Exit(1); }
    }

    static void Build()
    {
        var sw = System.Diagnostics.Stopwatch.StartNew();
        _rng = new System.Random(Seed);
        string fvRoot = Directory.GetParent(Directory.GetParent(Application.dataPath).FullName).FullName;
        string staging = Path.Combine(fvRoot, "City3D-staging");
        string shots = Path.Combine(staging, "scifi-shots");
        Directory.CreateDirectory(shots);

        var scene = EditorSceneManager.NewScene(NewSceneSetup.DefaultGameObjects, NewSceneMode.Single);
        var root = new GameObject("SciFiSiliconCity");

        // —— 光 rig=AD-018 官方基准档（official-baseline.md 直取·禁猜参）：白光 1.0@仰62/方233+软影 0.8+赛博雾 #723F4F@0.005 exp² —— 
        var light = UnityEngine.Object.FindObjectOfType<Light>();
        light.type = LightType.Directional;
        light.transform.rotation = Quaternion.Euler(61.76f, 232.99f, 0f);
        light.intensity = 1.0f;
        light.color = Color.white;
        light.shadows = LightShadows.Soft;
        light.shadowStrength = 0.8f;
        var fillGo = new GameObject("SkyFill_Light"); fillGo.transform.SetParent(root.transform);
        var fill = fillGo.AddComponent<Light>();
        fill.type = LightType.Directional; fill.transform.rotation = Quaternion.Euler(38f, 53f, 0f);
        fill.intensity = 0.12f; fill.color = new Color32(0x99, 0xB0, 0xE7, 255); fill.shadows = LightShadows.None;
        RenderSettings.fog = true; RenderSettings.fogMode = FogMode.ExponentialSquared;
        RenderSettings.fogColor = new Color32(0x72, 0x3F, 0x4F, 255); RenderSettings.fogDensity = 0.0006f;  // v3 0.0011→0.0006（320m 俯视洗白判负再降·赛博色保底）
        var defSky = AssetDatabase.GetBuiltinExtraResource<Material>("Default-Skybox.mat");
        if (defSky != null) RenderSettings.skybox = defSky;
        var cam = Camera.main;
        cam.clearFlags = CameraClearFlags.Skybox; cam.fieldOfView = 45f;

        // —— 地面（暗科幻混凝土·800m 画布）——
        var ground = GameObject.CreatePrimitive(PrimitiveType.Cube);
        ground.name = "SF_Ground"; ground.transform.SetParent(root.transform);
        ground.transform.localScale = new Vector3(800f, 0.2f, 800f);
        ground.transform.position = Vector3.down * 0.1f;
        ground.GetComponent<Renderer>().sharedMaterial = Mat("SFGround", new Color32(0x3A, 0x3E, 0x46, 255), "Universal Render Pipeline/Lit");

        var cells = ParseCells(Path.Combine(fvRoot, "Tools/city/td-organic-data.txt"));
        var roadSet = new HashSet<Vector2>(cells["ROAD"]);
        Report.Add($"cells: ROAD={cells["ROAD"].Count} WATER={cells["WATER"].Count} PLAZA={cells["PLAZA"].Count} PARK={cells["PARK"].Count} TREES={cells["TREES"].Count}");

        var road = new RoadFam { Main = Load("SM_Env_Road_YellowLines_01_SF"), Sec = Load("SM_Env_Road_Lines_01_SF"), Cross = Load("SM_Env_Road_Crossing_01_SF") };
        var walk = Load("SM_Env_Sidewalk_Straight_01_SF");
        var plazaTile = Load("SM_Env_Ground_Tile_01");
        var graffiti = new[] { "SM_Env_Graffiti_Ground_01", "SM_Env_Graffiti_Ground_02", "SM_Env_Graffiti_Ground_03", "SM_Env_Graffiti_Ground_04", "SM_Env_Graffiti_Ground_05" }.Select(Load).Where(x => x != null).ToArray();

        int bldsPlaced = 0;
        LayRoads(root.transform, cells, road);
        LayWater(root.transform, cells);
        LayPlaza(root.transform, cells, plazaTile, graffiti, roadSet);
        bldsPlaced = LayDistricts(root.transform);
        PlaceHero(root.transform);
        LaySidewalks(root.transform, cells, roadSet, walk, root.transform);
        int lamps = LayStreetProps(root.transform, cells, roadSet);
        int cars = LayHoverCars(root.transform, roadSet);
        LayMarket(root.transform, cells, roadSet);
        int walkers = LayResidents(root.transform, cells, roadSet);
        BuildGlowPools(root.transform);
        SetupBloom(cam);

        EditorSceneManager.SaveScene(scene, ScenePath);
        ConvertMaterials();
        EditorSceneManager.SaveScene(scene, ScenePath);
        Report.Add($"scene saved+converted: {ScenePath}");
        Report.Add($"districts_blds={bldsPlaced} lamps={lamps} hover_cars={cars} residents={walkers}");
        Report.Add($"build_ms={sw.ElapsedMilliseconds}");

        CaptureAll(cam, root.transform, shots, light);
        File.WriteAllLines(Path.Combine(staging, "scifi-build-report.md"), Report.ToArray());
        Debug.Log("SCIFICITY_DONE");
    }

    // ---------- 铺装层 ----------
    class RoadFam { public GameObject Main, Sec, Cross; public Vector3 MainSize, SecSize; }
    static GameObject Load(string name) => LoadPrefab(SFPf, name);

    static void LayRoads(Transform root, Dictionary<string, List<Vector2>> cells, RoadFam fam)
    {
        if (fam.Main == null || fam.Sec == null) { Report.Add("roads: SKIP（件缺）"); return; }
        var ms = Measure(fam.Main); var ss = Measure(fam.Sec);
        float mainS = ms.HasValue ? Fit(fam.Main, GridM) : 1f;
        float secS = ss.HasValue ? Fit(fam.Sec, GridM) : 1f;
        var roads = new HashSet<Vector2>(cells["ROAD"]);
        int n = 0;
        foreach (var g in roads)
        {
            bool ew = RunLen(roads, g, true) >= RunLen(roads, g, false);
            bool cross = roads.Contains(g + Vector2.up) && roads.Contains(g + Vector2.down) && roads.Contains(g + Vector2.left) && roads.Contains(g + Vector2.right);
            GameObject piece = cross && fam.Cross != null ? fam.Cross : (RunLen(roads, g, ew ? true : false) >= 4 ? fam.Main : fam.Sec);
            float s = (piece == fam.Main ? mainS : (piece == fam.Cross ? mainS : secS));
            var go = (GameObject)PrefabUtility.InstantiatePrefab(piece, root);
            if (go == null) continue;
            go.transform.position = ToWorld(g, 0f);
            go.transform.rotation = Quaternion.Euler(0f, cross ? 90f * _rng.Next(4) : (ew ? 90f : 0f), 0f);
            if (s != 1f) go.transform.localScale = Vector3.one * s;
            go.isStatic = true; n++;
        }
        Report.Add($"roads: {n} (YellowLines 干道+Lines 支路+Crossing 路口·AD-018 _SF 族)");
    }

    static void LayWater(Transform root, Dictionary<string, List<Vector2>> cells)
    {
        var mesh = QuadMesh(cells["WATER"], 2.5f);
        var go = new GameObject("SF_Water"); go.transform.SetParent(root);
        go.AddComponent<MeshFilter>().sharedMesh = mesh;
        var m = Mat("SFWater", new Color32(0x2E, 0x6E, 0x96, 255), "Universal Render Pipeline/Lit");
        if (m.HasProperty("_Smoothness")) m.SetFloat("_Smoothness", 0.55f);
        go.AddComponent<MeshRenderer>().sharedMaterial = m;
        Report.Add($"water: quads={cells["WATER"].Count}（深青蓝·单面朝上律）");
    }

    static void LayPlaza(Transform root, Dictionary<string, List<Vector2>> cells, GameObject tile, GameObject[] graffiti, HashSet<Vector2> roadSet)
    {
        if (tile == null) { Report.Add("plaza: SKIP（件缺）"); return; }
        float s = Fit(tile, GridM);
        int n = 0, g4 = 0, i = 0;
        foreach (var g in cells["PLAZA"])
        {
            if (roadSet.Contains(g)) { i++; continue; }
            var go = (GameObject)PrefabUtility.InstantiatePrefab(tile, root);
            if (go == null) { i++; continue; }
            go.transform.position = ToWorld(g, 0f);
            go.transform.rotation = Quaternion.Euler(0f, 90f * _rng.Next(4), 0f);
            if (s != 1f) go.transform.localScale = Vector3.one * s;
            go.isStatic = true; n++;
            if (graffiti.Length > 0 && i % 6 == 0)
            {
                var gr = (GameObject)PrefabUtility.InstantiatePrefab(graffiti[_rng.Next(graffiti.Length)], root);
                if (gr != null) { gr.transform.position = ToWorld(g, 0.02f) + new Vector3(1.2f, 0, 1.2f); gr.transform.rotation = Quaternion.Euler(0f, 90f * _rng.Next(4), 0f); gr.isStatic = true; g4++; }
            }
            i++;
        }
        Report.Add($"plaza: tiles={n} graffiti={g4}（AD-018 Ground_Tile+涂鸦 decal·地面语言律）");
    }

    // ---------- 分区建筑（AD-018 实测分档：Large 干线/Background_Med 中景/Background_Small 外景）----------
    static int LayDistricts(Transform root)
    {
        string[] large = { "SM_Bld_Large_01", "SM_Bld_Large_02", "SM_Bld_Large_03", "SM_Bld_Large_04", "SM_Bld_Large_05", "SM_Bld_Large_06" };
        string[] med = { "SM_Bld_Background_Med_01", "SM_Bld_Background_Med_02", "SM_Bld_Background_Med_03", "SM_Bld_Background_Med_04", "SM_Bld_Background_Med_05", "SM_Bld_Background_Med_06", "SM_Bld_Background_Med_07", "SM_Bld_Background_Med_08", "SM_Bld_Background_Med_09" };
        string[] small = { "SM_Bld_Background_Small_01", "SM_Bld_Background_Small_02", "SM_Bld_Background_Small_03", "SM_Bld_Background_Small_04", "SM_Bld_Advanced_01", "SM_Bld_Advanced_02", "SM_Bld_Industrial_01", "SM_Bld_FoodHole_01", "SM_Bld_Chopshop_01", "SM_Bld_Bank_01" };
        var poolL = large.Select(Load).Where(x => x != null).ToArray();
        var poolM = med.Select(Load).Where(x => x != null).ToArray();
        var poolS = small.Select(Load).Where(x => x != null).ToArray();
        int placed = 0;
        for (int c = 0; c < CityNames.Length; c++)
        {
            var district = new GameObject("District_" + CityNames[c]); district.transform.SetParent(root);
            float ang = (90f + c * 120f) * Mathf.Deg2Rad;
            district.transform.position = new Vector3(Mathf.Cos(ang) * 180f, 0f, Mathf.Sin(ang) * 180f);
            for (int sx = 0; sx < 4; sx++) for (int sz = 0; sz < 4; sz++)
            {
                float ring = Mathf.Max(Mathf.Abs(sx - 1.5f), Mathf.Abs(sz - 1.5f));      // 0=内环 1.5=外环
                var pool = ring < 0.6f ? poolL : (ring < 1.1f ? poolM : poolS);
                if (pool.Length == 0) pool = poolM.Length > 0 ? poolM : poolS;
                var pf = pool[_rng.Next(pool.Length)];
                var go = (GameObject)PrefabUtility.InstantiatePrefab(pf, district.transform);
                if (go == null) continue;
                go.transform.localPosition = new Vector3((sx - 1.5f) * 26f + _rng.Next(-3, 4), 0f, (sz - 1.5f) * 26f + _rng.Next(-3, 4));
                go.transform.localRotation = Quaternion.Euler(0f, 90f * _rng.Next(4), 0f);
                go.isStatic = true; placed++;
            }
        }
        Report.Add($"districts: 3x16 placed={placed}（Large 内环/Med 中环/Small+商户外环·内密外疏梯度律）");
        return placed;
    }

    static void PlaceHero(Transform root)
    {
        var tower = new GameObject("BrainTower"); tower.transform.SetParent(root);
        var pod = Load("SM_Bld_LandingPad_01");
        var main1 = Load("SM_Bld_Large_01"); var main2 = Load("SM_Bld_Advanced_01");
        float y = 0f;
        foreach (var pf in new[] { pod, main1, main2 })
        {
            if (pf == null) continue;
            var go = (GameObject)PrefabUtility.InstantiatePrefab(pf, tower.transform);
            if (go == null) continue;
            var b = Measure(pf) ?? Vector3.one;
            go.transform.position = new Vector3(0f, y, 0f);
            go.transform.rotation = Quaternion.Euler(0f, 90f * _rng.Next(4), 0f);
            go.isStatic = true; y += b.y;
        }
        var ant = LoadPrefab("Assets/lowpoly/03_科幻/AD-020_Scene场景_太空飞船_SciFiSpace/PolygonSciFiSpace/Prefabs/Props", "SM_Prop_Antenna_01");
        if (ant != null)
        {
            var go = (GameObject)PrefabUtility.InstantiatePrefab(ant, tower.transform);
            var b = Measure(ant) ?? Vector3.one;
            float s = b.y > 0.01f ? 14f / b.y : 1f;
            if (go != null) { go.transform.position = new Vector3(0f, y, 0f); if (Mathf.Abs(s - 1f) > 0.01f) go.transform.localScale = Vector3.one * s; go.isStatic = true; }
        }
        Report.Add("hero: LandingPad+Large+Advanced+AD-020 天线 14m（三段式读法：基座→塔身→冠部雏形）");
    }

    static void LaySidewalks(Transform root, Dictionary<string, List<Vector2>> cells, HashSet<Vector2> roadSet, GameObject walk, Transform rootT)
    {
        if (walk == null) { Report.Add("sidewalks: SKIP（件缺）"); return; }
        var blds = new List<Rect>();
        foreach (var city in CityNames)
        {
            var dis = rootT.Find("District_" + city);
            if (dis == null) continue;
            foreach (Transform bld in dis.transform)
            {
                var rs = bld.GetComponentsInChildren<Renderer>();
                if (rs.Length == 0) continue;
                var bb = rs[0].bounds; foreach (var r in rs) bb.Encapsulate(r.bounds);
                blds.Add(Rect.MinMaxRect(bb.min.x - 2f, bb.min.z - 2f, bb.max.x + 2f, bb.max.z + 2f));
            }
        }
        bool InBld(Vector3 w) { foreach (var rc in blds) if (rc.Contains(new Vector2(w.x, w.z))) return true; return false; }
        var occupied = new HashSet<Vector2>();
        foreach (var k in cells.Keys) foreach (var c in cells[k]) occupied.Add(c);
        float s = Fit(walk, GridM);
        int placed = 0, i = 0;
        foreach (var g in roadSet)
        {
            if (placed >= 400) break;
            foreach (var d in new[] { Vector2.up, Vector2.down, Vector2.left, Vector2.right })
            {
                if (placed >= 400) break;
                var nb = g + d;
                if (occupied.Contains(nb) || roadSet.Contains(nb)) continue;
                Vector3 wp = ToWorld(g, 0f) + new Vector3(d.x, 0, d.y) * GridM;
                if (InBld(wp)) continue;
                var go = (GameObject)PrefabUtility.InstantiatePrefab(walk, root);
                if (go == null) continue;
                go.transform.position = wp;
                go.transform.rotation = Quaternion.Euler(0f, d.x != 0 ? 90f : 0f, 0f);
                if (s != 1f) go.transform.localScale = Vector3.one * s;
                go.isStatic = true; placed++;
            }
            i++;
        }
        Report.Add($"sidewalks: {placed}（SF 人行道+建筑足迹避让律）");
    }

    static int LayStreetProps(Transform root, Dictionary<string, List<Vector2>> cells, HashSet<Vector2> roadSet)
    {
        var lamp = Load("SM_Prop_Streetlight_01");
        var bench = Load("SM_Prop_Bench_01");
        var bin = Load("SM_Prop_Rubbish_Bin_01");
        var vend = Load("SM_Prop_VendingMachine_01");
        var adPillar = Load("SM_Prop_Advertisement_Pillar_01");
        var holo = new[] { "SM_Prop_Hologram_Bottle_01", "SM_Prop_Hologram_Pizza_01", "SM_Prop_Hologram_Noodles_01", "SM_Prop_Hologram_Burger_03" }.Select(Load).Where(x => x != null).ToArray();
        var cables = Load("SM_Prop_Cables_01");
        var trunk = roadSet.Where(g => RunLen(roadSet, g, true) >= 6 || RunLen(roadSet, g, false) >= 6)
                           .OrderBy(g => (g.x * 73856093f) % 997f + (g.y * 19349663f) % 997f).ToList();
        int lamps = 0, k = 0, others = 0;
        foreach (var g in trunk)
        {
            if (lamps >= 120) break;
            if (k % 4 != 0) { k++; continue; } k++;
            if (lamp != null)
            {
                var lg = new GameObject("SF_Lamp_" + lamps); lg.transform.SetParent(root);
                lg.transform.position = ToWorld(g, 0f) + new Vector3(2.2f, 0, 0);
                lg.transform.rotation = Quaternion.Euler(0f, lamps % 2 == 0 ? 180f : 0f, 0f);
                var lp = (GameObject)PrefabUtility.InstantiatePrefab(lamp, lg.transform);
                if (lp != null) { lp.transform.localPosition = Vector3.zero; lp.isStatic = true; }
                lamps++;
            }
            if (bench != null && k % 5 == 0) { Place(root, bench, ToWorld(g, 0f) + new Vector3(-2.0f, 0, 1.5f), R4()); others++; }
            if (bin != null && k % 7 == 0) { Place(root, bin, ToWorld(g, 0f) + new Vector3(1.8f, 0, -1.8f), R4()); others++; }
            if (vend != null && k % 11 == 0) { Place(root, vend, ToWorld(g, 0f) + new Vector3(-1.8f, 0, -1.6f), R4()); others++; }
            if (adPillar != null && k % 13 == 0) { Place(root, adPillar, ToWorld(g, 0f) + new Vector3(2.0f, 0, -2.0f), R4()); others++; }
            if (holo.Length > 0 && k % 9 == 0) { Place(root, holo[_rng.Next(holo.Length)], ToWorld(g, 0f) + new Vector3(-2.0f, 0, 2.0f), R4()); others++; }
            if (cables != null && k % 16 == 0)
            {
                bool ew = RunLen(roadSet, g, true) >= RunLen(roadSet, g, false);
                var cg = Place(root, cables, ToWorld(g, 6.5f), ew ? 0 : 90);
                if (cg != null) cg.transform.localScale = new Vector3(1f, 1f, 1.4f);
                others++;
            }
        }
        Report.Add($"street: lamps={lamps}/120 +props={others}（Streetlight/长椅/垃圾桶/贩卖机/广告柱/Hologram 招牌/跨街电缆·成组律：灯与件同格异位）");
        return lamps;
    }

    static int LayHoverCars(Transform root, HashSet<Vector2> roadSet)
    {
        string[] names = { "SM_Veh_Future_Taxi_01", "SM_Veh_Hover_Bike_01", "SM_Veh_Classic_01_Hover", "SM_Veh_Retro_01_Hover", "SM_Veh_Future_01", "SM_Veh_Future_Cop_01", "SM_Veh_Garbage_01_Hover", "SM_Veh_Hoverboard_01", "SM_Veh_Hoverboard_02", "SM_Veh_Armored_Truck_01_Hover" };
        var pool = names.Select(Load).Where(x => x != null).ToArray();
        if (pool.Length == 0) { Report.Add("hover_cars: SKIP"); return 0; }
        var trunk = roadSet.Where(g => RunLen(roadSet, g, true) >= 6 || RunLen(roadSet, g, false) >= 6)
                           .OrderBy(g => (g.x * 19349663f) % 997f + (g.y * 73856093f) % 997f).ToList();
        int placed = 0, k = 0;
        foreach (var g in trunk)
        {
            if (placed >= 100) break;
            if (k % 4 != 0) { k++; continue; } k++;
            bool ew = RunLen(roadSet, g, true) >= RunLen(roadSet, g, false);
            float side = placed % 2 == 0 ? 1f : -1f;
            var go = Place(root, pool[_rng.Next(pool.Length)], ToWorld(g, 0f) + (ew ? new Vector3(0, 0, side * 1.6f) : new Vector3(side * 1.6f, 0, 0)), ew ? (side > 0 ? 0 : 180) : (side > 0 ? 90 : 270));
            if (go != null) placed++;
        }
        Report.Add($"hover_cars: {placed}/100（AD-018 悬浮车族·含 Hover 变体=赛博城身份件）");
        return placed;
    }

    static void LayMarket(Transform root, Dictionary<string, List<Vector2>> cells, HashSet<Vector2> roadSet)
    {
        var cover = new[] { "SM_Prop_MarketCover_01", "SM_Prop_MarketCover_02", "SM_Prop_MarketCover_03", "SM_Prop_MarketCover_04", "SM_Prop_MarketCover_05" }.Select(Load).Where(x => x != null).ToArray();
        var table = Load("SM_Prop_MarketTable_01");
        var lights = Load("SM_Prop_MarketLights_01");
        if (cover.Length == 0) { Report.Add("market: SKIP（件缺）"); return; }
        int n = 0, i = 0;
        foreach (var g in cells["PLAZA"])
        {
            if (roadSet.Contains(g)) { i++; continue; }
            if (i % 5 == 0 && i > 0)
            {
                Vector3 c = ToWorld(g, 0f);
                Place(root, cover[_rng.Next(cover.Length)], c, R4());
                if (table != null) Place(root, table, c + new Vector3(1.6f, 0, 0), R4());
                if (lights != null) Place(root, lights, c + new Vector3(-1.6f, 0, 1.6f), R4());
                n++;
            }
            i++;
        }
        Report.Add($"market: stalls={n}（MarketCover+Table+Lights 三件组·AD-018 街市签名）");
    }

    // ---------- 居民（CEO 令：polygon 角色接入——AD-018 赛博 20+AD-042 都市 19）----------
    static int LayResidents(Transform root, Dictionary<string, List<Vector2>> cells, HashSet<Vector2> roadSet)
    {
        string[] sfNames = { "Character_CyberPunk_Male_01", "Character_Cyber_Female_01", "Character_Cyber_Male_01", "Character_Android_Female_01", "Character_Hacker_Female_01", "Character_CyborgNinja_01", "Character_Robot_01", "Character_Cop_01", "Character_Rich_Male_01", "Character_Rich_Female_01", "Character_Augmented_Male_01", "Character_Medical_Male_01", "Character_Garbage_Male_01", "Character_Junky_Male_01", "Character_Junky_Female_01", "Character_Muscle_Male_01", "Character_Monk_Male_01", "Character_Alien_Male_01", "Character_Alien_Male_02", "Character_Hologram_Female_01" };
        var pool = new List<GameObject>();
        foreach (var n in sfNames) { var p = LoadPrefab(SFPf + "/Characters", n); if (p != null) pool.Add(p); }
        foreach (var f in Directory.GetFiles(Chars42Pf, "*.prefab")) { var p = AssetDatabase.LoadAssetAtPath<GameObject>(f); if (p != null) pool.Add(p); }
        if (pool.Count == 0) { Report.Add("residents: SKIP（池空）"); return 0; }
        // 真数据密度：world-state.json 分区活动值（活性正典·与主城同源）
        int perDistrict = 8;
        int walkers = 0;
        for (int c = 0; c < CityNames.Length; c++)
        {
            var roadCells = roadSet.Where(g => Vector2.Distance(g, Vector2.zero) < 200f).OrderBy(g => (g.x * 73856093f) % 997f + (g.y * 19349663f) % 997f).ToList();
            if (roadCells.Count < 8) continue;
            for (int w = 0; w < perDistrict; w++)
            {
                var pf = pool[(_rng.Next(pool.Count) + w) % pool.Count];
                var go = (GameObject)PrefabUtility.InstantiatePrefab(pf, root);
                if (go == null) continue;
                int start = _rng.Next(roadCells.Count);
                var wp = go.AddComponent<ResidentWalker>();
                var route = new List<Vector3>();
                for (int r = 0; r < 6 && r < roadCells.Count; r++) route.Add(ToWorld(roadCells[(start + r * 5) % roadCells.Count], 0f));
                wp.BuildRoute(route);                       // 正法=BuildRoute 初始化 _last/_next（直赋 route=Advance 失步判例预防）
                if (wp.route.Count > 0) wp.Advance(w * 3.1f);
                go.transform.position = wp.route[Mathf.Min(w, wp.route.Count - 1)];
                walkers++;
            }
        }
        Report.Add($"residents: {walkers}（池={pool.Count}：AD-018 赛博 {Math.Min(20, sfNames.Length)}+AD-042 都市·环形通勤 ResidentWalker·CEO 令 polygon 角色接入）");
        return walkers;
    }

    // ---------- 夜光池（灯位投影·v2 自产强档贴图 0.7 alpha——0.32 弱档在暗地面上不可读判负）----------
    static void BuildGlowPools(Transform root)
    {
        var texPath = "Assets/Art/Whitebox/LampGlowSF.png";
        var tex = AssetDatabase.LoadAssetAtPath<Texture2D>(texPath);
        if (tex == null)
        {
            var t = new Texture2D(64, 64, TextureFormat.RGBA32, false);
            for (int y = 0; y < 64; y++) for (int x = 0; x < 64; x++)
            {
                float dx = (x - 31.5f) / 31.5f, dy = (y - 31.5f) / 31.5f;
                float a = Mathf.Clamp01(1f - Mathf.Sqrt(dx * dx + dy * dy)); a *= a; a *= 0.7f;
                t.SetPixel(x, y, new Color(1f, 1f, 1f, a));
            }
            t.Apply();
            File.WriteAllBytes(Path.Combine(Application.dataPath, "Art/Whitebox/LampGlowSF.png"), t.EncodeToPNG());
            AssetDatabase.ImportAsset(texPath);
            tex = AssetDatabase.LoadAssetAtPath<Texture2D>(texPath);
        }
        var matPath = "Assets/Art/Whitebox/LampGlowSF.mat";
        _glowMat = AssetDatabase.LoadAssetAtPath<Material>(matPath);
        if (_glowMat == null)
        {
            _glowMat = new Material(Shader.Find("Universal Render Pipeline/Unlit")) { name = "LampGlowSF" };
            AssetDatabase.CreateAsset(_glowMat, matPath);
        }
        _glowMat.SetTexture("_BaseMap", tex);
        _glowMat.SetColor("_BaseColor", new Color(1f, 0.68f, 0.36f, 1f));
        _glowMat.SetFloat("_Surface", 1f); _glowMat.SetFloat("_Blend", 0f);
        _glowMat.EnableKeyword("_SURFACE_TYPE_TRANSPARENT");
        _glowMat.SetOverrideTag("RenderType", "Transparent");
        _glowMat.SetInt("_SrcBlend", (int)UnityEngine.Rendering.BlendMode.SrcAlpha);
        _glowMat.SetInt("_DstBlend", (int)UnityEngine.Rendering.BlendMode.OneMinusSrcAlpha);
        _glowMat.SetInt("_ZWrite", 0);
        _glowMat.renderQueue = 3010;
        EditorUtility.SetDirty(_glowMat);
        var parent = new GameObject("NightFX"); parent.transform.SetParent(root);
        int n = 0;
        foreach (Transform ch in root)
        {
            if (!ch.name.StartsWith("SF_Lamp_")) continue;
            var q = GameObject.CreatePrimitive(PrimitiveType.Quad);
            q.name = "Glow_" + ch.name; q.transform.SetParent(parent.transform);
            q.transform.position = new Vector3(ch.position.x, 0.3f, ch.position.z);   // v3 0.13→0.3（光池埋在路件顶面下=夜帧全灭根因·主城 v8 同案）
            q.transform.rotation = Quaternion.Euler(90f, 0f, 0f);
            q.transform.localScale = Vector3.one * 6f;
            q.GetComponent<Renderer>().sharedMaterial = _glowMat;
            q.isStatic = true; n++;
        }
        parent.SetActive(false);
        Report.Add($"night_glow: pools={n}（Streetlight 位·v2 强档 0.7 alpha·夜帧激活）");
    }

    static void SetupBloom(Camera cam)
    {
        var cd = cam.GetComponent<UnityEngine.Rendering.Universal.UniversalAdditionalCameraData>();
        if (cd == null) cd = cam.gameObject.AddComponent<UnityEngine.Rendering.Universal.UniversalAdditionalCameraData>();
        cd.renderPostProcessing = true;
        var volGo = new GameObject("GlobalVolume");
        var vol = volGo.AddComponent<UnityEngine.Rendering.Volume>(); vol.isGlobal = true;
        var profile = AssetDatabase.LoadAssetAtPath<UnityEngine.Rendering.VolumeProfile>("Assets/Art/Whitebox/GlobalVolumeProfile.asset");
        if (profile == null) { profile = ScriptableObject.CreateInstance<UnityEngine.Rendering.VolumeProfile>(); AssetDatabase.CreateAsset(profile, "Assets/Art/Whitebox/SciFiVolumeProfile.asset"); }
        vol.sharedProfile = profile;
        UnityEngine.Rendering.Universal.Bloom bloom;
        if (!profile.TryGet(out bloom)) bloom = profile.Add<UnityEngine.Rendering.Universal.Bloom>(true);
        bloom.threshold.Override(0.9f); bloom.intensity.Override(1.2f); bloom.scatter.Override(0.7f);
        Report.Add("bloom: threshold=0.9 intensity=1.2 scatter=0.7（复用全局 profile·夜帧光晕档）");
    }

    // ---------- 判据帧捕获（日+夜双档·夜=地面近黑换装律 v9）----------
    static void CaptureAll(Camera cam, Transform root, string shots, Light light)
    {
        Shot(cam, Path.Combine(shots, "S_L0_overview.jpg"), 50f, 320f, Vector3.zero);
        Shot(cam, Path.Combine(shots, "S_L1_brainring.jpg"), 55f, 110f, new Vector3(0, 20f, 0));
        Shot(cam, Path.Combine(shots, "S_L2_street.jpg"), 60f, 24f, new Vector3(180, 6, -34));
        // 夜档（赛博城=夜本命）：地面/水近黑换装+月光+光池+雾冷调
        var dayRot = light.transform.rotation; var dayInt = light.intensity; var dayCol = light.color;
        var dayFog = RenderSettings.fog; var dayFogD = RenderSettings.fogDensity; var dayFogCol = RenderSettings.fogColor;
        var dayClear = cam.clearFlags;
        var fill = GameObject.Find("SkyFill_Light").GetComponent<Light>();
        var fillI = fill.intensity; var fillC = fill.color;
        foreach (var r in root.GetComponentsInChildren<Renderer>())
        {
            if (r.name == "SF_Ground" || r.name == "SF_Water") _groundMats[r] = r.sharedMaterial;
        }
        var gnd = GameObject.Find("SF_Ground").GetComponent<Renderer>();
        var wtr = GameObject.Find("SF_Water").GetComponent<Renderer>();
        gnd.sharedMaterial = Mat("SFNightGround", new Color32(0x20, 0x22, 0x28, 255), "Universal Render Pipeline/Lit");   // v2 律：暗≠黑（近黑连乘月光=黑场判负→中暗档）
        wtr.sharedMaterial = Mat("SFNightWater", new Color32(0x18, 0x2E, 0x42, 255), "Universal Render Pipeline/Lit");
        light.transform.rotation = Quaternion.Euler(38f, 150f, 0f);
        light.intensity = 0.6f; light.color = new Color32(0xA9, 0xC2, 0xE8, 255);          // v3 0.4→0.6（赛博建筑低反照率×暗天=剪影零对比修）
        fill.intensity = 0.09f; fill.color = new Color32(0x2A, 0x35, 0x50, 255);
        var dayAmbMode = RenderSettings.ambientMode; var dayAmb = RenderSettings.ambientLight;
        RenderSettings.ambientMode = AmbientMode.Flat; RenderSettings.ambientLight = new Color(0.07f, 0.09f, 0.13f);   // v3：暗面保有量（剪影与天空分离）
        RenderSettings.fog = true; RenderSettings.fogColor = new Color32(0x14, 0x1B, 0x2C, 255); RenderSettings.fogDensity = 0.0006f;
        cam.clearFlags = CameraClearFlags.SolidColor; cam.backgroundColor = new Color32(0x1A, 0x24, 0x38, 255);
        var nfx = root.Find("NightFX"); if (nfx != null) nfx.gameObject.SetActive(true);
        Shot(cam, Path.Combine(shots, "S_X_night_district.jpg"), 55f, 60f, new Vector3(180f, 0, 0));
        Shot(cam, Path.Combine(shots, "S_X_night_market.jpg"), 58f, 14f, ToWorld(new Vector2(6f, 6f), 0));
        if (nfx != null) nfx.gameObject.SetActive(false);
        gnd.sharedMaterial = _groundMats.ContainsKey(gnd) ? _groundMats[gnd] : gnd.sharedMaterial;
        wtr.sharedMaterial = _groundMats.ContainsKey(wtr) ? _groundMats[wtr] : wtr.sharedMaterial;
        light.transform.rotation = dayRot; light.intensity = dayInt; light.color = dayCol;
        fill.intensity = fillI; fill.color = fillC;
        RenderSettings.fog = dayFog; RenderSettings.fogDensity = dayFogD; RenderSettings.fogColor = dayFogCol;
        RenderSettings.ambientMode = dayAmbMode; RenderSettings.ambientLight = dayAmb;
        cam.clearFlags = dayClear;
        Shot(cam, Path.Combine(shots, "S_X_market_day.jpg"), 58f, 14f, ToWorld(new Vector2(6f, 6f), 0));
        var walkers = UnityEngine.Object.FindObjectsOfType<ResidentWalker>();
        Shot(cam, Path.Combine(shots, "S_X_walkers_t0.jpg"), 55f, 40f, new Vector3(0f, 0f, 0f));
        foreach (var wk in walkers) wk.Advance(2.5f);
        Shot(cam, Path.Combine(shots, "S_X_walkers_t2.jpg"), 55f, 40f, new Vector3(0f, 0f, 0f));
        Report.Add("shots: 8（日3+夜2+市场1+行人位移2·另存城判据帧首套）");
    }

    // ---------- Built-in→URP 材质过桥（CityAssembler Convert 同律内联）----------
    static void ConvertMaterials()
    {
        var cache = new Dictionary<Material, Material>();
        int converted = 0, skipped = 0;
        foreach (var r in UnityEngine.Object.FindObjectsOfType<Renderer>())
        {
            var mats = r.sharedMaterials; bool ch = false;
            for (int i = 0; i < mats.Length; i++)
            {
                var m = mats[i];
                if (m == null) continue;
                if (m.shader != null && m.shader.name.Contains("Universal Render Pipeline")) { skipped++; continue; }
                if (!cache.TryGetValue(m, out var conv))
                {
                    var name = string.IsNullOrEmpty(m.name) ? "mat" + _rng.Next(999999).ToString() : m.name;
                    var path = $"Assets/Art/Bridge/{name}_URP.mat";
                    var existing = AssetDatabase.LoadAssetAtPath<Material>(path);
                    if (existing != null) { cache[m] = existing; conv = existing; }
                    else
                    {
                        var nm = new Material(Shader.Find("Universal Render Pipeline/Lit")) { name = name + "_URP" };
                        if (m.HasProperty("_MainTex"))
                        {
                            var tex = m.GetTexture("_MainTex");
                            if (tex != null) nm.SetTexture("_BaseMap", tex);
                            nm.SetColor("_BaseColor", m.HasProperty("_Color") ? m.GetColor("_Color") : Color.white);
                        }
                        else if (m.HasProperty("_Color")) nm.SetColor("_BaseColor", m.GetColor("_Color"));
                        nm.SetFloat("_Smoothness", 0f);
                        if (m.IsKeywordEnabled("_EMISSION") || (m.HasProperty("_EmissionColor") && m.GetColor("_EmissionColor").maxColorComponent > 0.01f))
                        {
                            nm.EnableKeyword("_EMISSION");
                            if (m.HasProperty("_EmissionColor")) nm.SetColor("_EmissionColor", m.GetColor("_EmissionColor"));
                        }
                        AssetDatabase.CreateAsset(nm, path); cache[m] = nm; conv = nm;
                    }
                }
                mats[i] = conv; ch = true; converted++;
            }
            if (ch) { r.sharedMaterials = mats; EditorUtility.SetDirty(r); }
        }
        Report.Add($"bridge: converted={converted} skipped_urp={skipped}（Built-in→URP 内联过桥·同 URPMaterialBridge 律）");
    }

    // ---------- 工具（CityAssembler 同律复刻）----------
    static GameObject LoadPrefab(string folder, string name)
    {
        var guids = AssetDatabase.FindAssets(name, new[] { folder });
        if (guids.Length == 0) return null;
        return AssetDatabase.LoadAssetAtPath<GameObject>(AssetDatabase.GUIDToAssetPath(guids[0]));
    }
    static Dictionary<string, List<Vector2>> ParseCells(string path)
    {
        var dict = new Dictionary<string, List<Vector2>> { { "ROAD", new List<Vector2>() }, { "WATER", new List<Vector2>() }, { "SAND", new List<Vector2>() }, { "PLAZA", new List<Vector2>() }, { "PARK", new List<Vector2>() }, { "BRIDGES", new List<Vector2>() }, { "TREES", new List<Vector2>() }, { "STARTS", new List<Vector2>() } };
        if (!File.Exists(path)) { Report.Add("WARN: td-organic-data 缺"); return dict; }
        var re = new Regex(@"(\d+),(\d+)");
        foreach (var line in File.ReadAllLines(path))
        {
            var sp = line.Split(' ')[0];
            if (!dict.ContainsKey(sp)) continue;
            foreach (Match m in re.Matches(line)) dict[sp].Add(new Vector2(int.Parse(m.Groups[1].Value), int.Parse(m.Groups[2].Value)));
        }
        return dict;
    }
    static float AnchorX => 64f; static float AnchorY => 64f;
    static Vector3 ToWorld(Vector2 g, float y) => new Vector3((g.x - AnchorX) * GridM, y, (g.y - AnchorY) * GridM);
    static int RunLen(HashSet<Vector2> set, Vector2 g, bool horiz)
    {
        var d = horiz ? Vector2.right : Vector2.up;
        int len = 1;
        for (var c = g + d; set.Contains(c); c += d) len++;
        for (var c = g - d; set.Contains(c); c -= d) len++;
        return len;
    }
    static Vector3? Measure(GameObject go)
    {
        var r = go.GetComponentsInChildren<Renderer>();
        if (r.Length == 0) return null;
        var b = r[0].bounds; foreach (var x in r) b.Encapsulate(x.bounds);
        return b.size;
    }
    static float Fit(GameObject pf, float targetM)
    {
        var b = Measure(pf);
        if (b == null) return 1f;
        float long2D = Mathf.Max(b.Value.x, b.Value.z);
        if (long2D <= 0.01f) return 1f;
        float s = targetM / long2D;
        return Mathf.Abs(s - 1f) < 0.15f ? 1f : s;
    }
    static Material Mat(string name, Color c, string shader)
    {
        var path = $"Assets/Art/Whitebox/{name}.mat";
        var existing = AssetDatabase.LoadAssetAtPath<Material>(path);
        if (existing != null)
        {
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
    static GameObject Place(Transform root, GameObject pf, Vector3 pos, int rotQ)
    {
        var go = (GameObject)PrefabUtility.InstantiatePrefab(pf, root);
        if (go == null) return null;
        go.transform.position = pos; go.transform.rotation = Quaternion.Euler(0f, 90f * rotQ, 0f); go.isStatic = true;
        return go;
    }
    static int R4() => _rng.Next(4);
    static Mesh QuadMesh(List<Vector2> cells, float half)
    {
        var mesh = new Mesh { indexFormat = UnityEngine.Rendering.IndexFormat.UInt32 };
        if (cells.Count == 0) return mesh;
        var verts = new List<Vector3>(); var tris = new List<int>();
        foreach (var g in cells)
        {
            Vector3 p = ToWorld(g, 0.04f);
            int i0 = verts.Count;
            verts.Add(p + new Vector3(-half, 0, -half)); verts.Add(p + new Vector3(half, 0, -half));
            verts.Add(p + new Vector3(half, 0, half)); verts.Add(p + new Vector3(-half, 0, half));
            tris.AddRange(new[] { i0, i0 + 2, i0 + 1, i0, i0 + 3, i0 + 2 });   // 单面朝上律（v8 判例）
        }
        mesh.SetVertices(verts); mesh.SetTriangles(tris, 0); mesh.RecalculateNormals(); mesh.RecalculateBounds();
        return mesh;
    }
    static void Shot(Camera cam, string file, float pitchDeg, float height, Vector3 target)
    {
        float d = height / Mathf.Tan(pitchDeg * Mathf.Deg2Rad);
        cam.transform.position = target + new Vector3(0, height, -d);
        cam.transform.LookAt(target);
        const int w = 1920, h = 1080;
        var rt = new RenderTexture(w, h, 24);
        cam.targetTexture = rt; cam.Render();
        RenderTexture.active = rt;
        var t = new Texture2D(w, h, TextureFormat.RGB24, false);
        t.ReadPixels(new Rect(0, 0, w, h), 0, 0); t.Apply();
        File.WriteAllBytes(file, t.EncodeToJPG(88));
        cam.targetTexture = null; RenderTexture.active = null;
        rt.Release(); UnityEngine.Object.DestroyImmediate(rt); UnityEngine.Object.DestroyImmediate(t);
    }
}
