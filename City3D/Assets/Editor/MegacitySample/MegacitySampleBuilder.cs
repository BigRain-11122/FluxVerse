using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine;
using UnityEngine.Rendering;

// AD-049 Megacity 快样装配器（CEO 令 2026-10-08「1008 增量包…尤其是硅基城市的搭建！能用就用！」）
// 调用律：AD-049 Prefab 实锚+运行时 Measure 实测分档+seed 确定性；材质过桥=URPMaterialBridge.Convert 复用（零重复律·Synty 同法判例）
// 光 rig=CityAssembler P2 官方基准档复刻（无 DayNightCycle 挂载=判据帧确定性）；夜帧=同源夜景配方单帧
public static class MegacitySampleBuilder
{
    const int Seed = 20261008;
    const string Pf = "Assets/ithappy/Megacity/Prefabs";
    const string TrafficCarsPf = "Assets/ithappy/Megacity/Traffic/Prefabs/Cars/Cars";
    const string TrafficVehPf = "Assets/ithappy/Megacity/Traffic/Prefabs/Cars/Vehicles";

    static string FVRoot => Directory.GetParent(Directory.GetParent(Application.dataPath).FullName).FullName;
    static string Staging => Path.Combine(FVRoot, "City3D-staging");
    static string Shots => Path.Combine(Staging, "megacity-shots");

    static readonly List<string> Report = new List<string>();
    static int _missing, _placed;
    static System.Random _rng;

    public static void BatchEntry()
    {
        try { Run(); }
        catch (Exception e) { UnityEngine.Debug.LogError("MEGACITY_SAMPLE FAIL: " + e); EditorApplication.Exit(1); }
    }

    static void Run()
    {
        var sw = Stopwatch.StartNew();
        _rng = new System.Random(Seed);
        Directory.CreateDirectory(Shots);
        var scene = EditorSceneManager.NewScene(NewSceneSetup.DefaultGameObjects, NewSceneMode.Single);
        var root = new GameObject("MegacitySample");

        // ===== 光 rig（官方基准档复刻）=====
        var light = UnityEngine.Object.FindObjectOfType<Light>();
        light.type = LightType.Directional;
        light.transform.rotation = Quaternion.Euler(50f, 212.23f, 0f);
        light.intensity = 1.2f;
        light.color = new Color32(0xFF, 0xF4, 0xD6, 255);
        light.shadows = LightShadows.Soft;
        light.shadowStrength = 0.8f;
        var fillGo = new GameObject("SkyFill_Light"); fillGo.transform.SetParent(root.transform);
        var fill = fillGo.AddComponent<Light>();
        fill.type = LightType.Directional;
        fill.transform.rotation = Quaternion.Euler(38f, 32f, 0f);
        fill.intensity = 0.12f;
        fill.color = new Color32(0x99, 0xB0, 0xE7, 255);
        fill.shadows = LightShadows.None;
        var cam = Camera.main;
        cam.clearFlags = CameraClearFlags.Skybox;
        var packSky = AssetDatabase.LoadAssetAtPath<Material>("Assets/ithappy/Megacity/Skyboxes/Skybox_5.mat");
        if (packSky != null && packSky.shader != null) { RenderSettings.skybox = packSky; Report.Add("skybox: AD-049 自带 Skybox_5（包原生观感）"); }
        else { RenderSettings.skybox = AssetDatabase.GetBuiltinExtraResource<Material>("Default-Skybox.mat"); Report.Add("skybox: default procedural"); }
        RenderSettings.fog = true;
        RenderSettings.fogMode = FogMode.ExponentialSquared;
        RenderSettings.fogColor = new Color32(0xA9, 0xC2, 0xD6, 255);
        RenderSettings.fogDensity = 0.0015f;
        cam.fieldOfView = 45f;

        // ===== 地面（独立材质件·防串主城 Whitebox 资产）=====
        var ground = GameObject.CreatePrimitive(PrimitiveType.Cube);
        ground.name = "Ground"; ground.transform.SetParent(root.transform);
        ground.transform.localScale = new Vector3(900f, 0.2f, 900f);
        ground.transform.position = Vector3.down * 0.1f;
        ground.GetComponent<Renderer>().sharedMaterial = MakeMat("MegaGround", new Color32(0xB4, 0xAE, 0xA3, 255));

        // ===== 路基测量（件面实测·禁猜参）=====
        var roadS = MeasureSize(Pf + "/Landscape/Roads", "road_001");
        var jctS = MeasureSize(Pf + "/Landscape/Roads", "road_junction_001");
        if (roadS == Vector3.zero || jctS == Vector3.zero)
        { UnityEngine.Debug.LogError("MEGACITY_SAMPLE FAIL: road pieces missing"); EditorApplication.Exit(1); return; }
        float L = Mathf.Max(roadS.x, roadS.z), W = Mathf.Min(roadS.x, roadS.z);
        float roadRot = roadS.z > roadS.x ? 90f : 0f;   // 长轴归 X
        float jL = Mathf.Max(jctS.x, jctS.z), jW = Mathf.Min(jctS.x, jctS.z);
        float jctRot = jctS.z > jctS.x ? 90f : 0f;
        float roadTop = roadS.y;                         // 贴地后路面顶高
        Report.Add($"road_001: {roadS.x:F2}x{roadS.y:F2}x{roadS.z:F2} L={L:F1} W={W:F1} top={roadTop:F2}");
        Report.Add($"road_junction_001: {jctS.x:F2}x{jctS.y:F2}x{jctS.z:F2} jL={jL:F1}");

        // ===== 主干道：中央路口+东西各 7 节 =====
        Place(Pf + "/Landscape/Roads", "road_junction_001", Vector3.zero, jctRot, root.transform);
        const int Per = 7;
        for (int i = 0; i < Per; i++)
        {
            float x = jL / 2f + L / 2f + i * L + 0.02f;
            Place(Pf + "/Landscape/Roads", "road_001", new Vector3(x, 0f, 0f), roadRot, root.transform);
            Place(Pf + "/Landscape/Roads", "road_001", new Vector3(-x, 0f, 0f), roadRot, root.transform);
        }
        float avenueHalf = jL / 2f + Per * L;
        // 斑马线（路口西侧·贴路面顶）
        Place(Pf + "/Landscape/Roads", "pedestrian_crossing_001", new Vector3(-(jL / 2f + 6f), roadTop, 0f), roadS.z > roadS.x ? 0f : 90f, root.transform);

        // ===== 建筑双排（北=商务天际线·南=生活面）=====
        string bld = Pf + "/Buildings";
        string[] northRow = {
            "Skyscrapers/skyscraper_001", "Skyscrapers/skyscraper_003", "Business center/business_center_001",
            "Business center/business_center_004", "Skyscrapers/skyscraper_005", "Business center/casino_001",
            "Government/railway_station_001", "Skyscrapers/skyscraper_008",
        };
        string[] southRow = {
            "Residental/elite_residental_building_001", "Shopping/mall_001", "Shopping/supermarket_001",
            "Shopping/cinema_001", "Residental/residental_building_001", "Shopping/coffee_shop_001",
            "Shopping/gym_001", "Residental/residental_building_004",
        };
        float sidewalk = 3.5f;
        float leftN = -avenueHalf + 8f;
        foreach (var n in northRow)
        {
            var s = MeasureSize(bld, n);
            if (s == Vector3.zero) continue;
            Place(bld, n, new Vector3(leftN + s.x / 2f, 0f, W / 2f + sidewalk + s.z / 2f), 180f, root.transform);
            leftN += s.x + 3f;
        }
        float leftS = -avenueHalf + 10f;
        foreach (var n in southRow)
        {
            var s = MeasureSize(bld, n);
            if (s == Vector3.zero) continue;
            Place(bld, n, new Vector3(leftS + s.x / 2f, 0f, -(W / 2f + sidewalk + s.z / 2f)), 0f, root.transform);
            leftS += s.x + 3f;
        }

        // ===== 地标对景（东=埃菲尔塔·西=摩天轮）=====
        Place(bld, "Skyscrapers/eiffel_tower_001", new Vector3(avenueHalf + 40f, 0f, 0f), 0f, root.transform);
        Place(Pf + "/Leisure", "ferris_wheeel_001", new Vector3(-(avenueHalf + 45f), 0f, -20f), 0f, root.transform);

        // ===== 街景道具层（成组律：灯/座/站/牌按街排布）=====
        string props = Pf + "/Props";
        for (int i = 0; i <= 10; i++)
        {
            float x = -avenueHalf + 8f + i * (2f * avenueHalf - 16f) / 10f;
            bool north = i % 2 == 0;
            Place(props, "lamp_post_001", new Vector3(x, 0f, north ? W / 2f + 2f : -(W / 2f + 2f)), north ? 0f : 180f, root.transform);
            if (i == 3) Place(props, "bench_001", new Vector3(x + 2f, 0f, W / 2f + 2.4f), 180f, root.transform);
            if (i == 7) Place(props, "bench_001", new Vector3(x + 2f, 0f, -(W / 2f + 2.4f)), 0f, root.transform);
        }
        Place(props, "bus_stop_001", new Vector3(24f, 0f, W / 2f + 2.5f), 180f, root.transform);
        Place(props, "bus_stop_002", new Vector3(-38f, 0f, -(W / 2f + 2.5f)), 0f, root.transform);
        Place(props, "billboard_001", new Vector3(60f, 0f, W / 2f + 3f), 180f, root.transform);
        Place(props, "billboard_002", new Vector3(-64f, 0f, -(W / 2f + 3f)), 0f, root.transform);
        Place(props, "advertising_001", new Vector3(-20f, 0f, W / 2f + 2.6f), 180f, root.transform);
        Place(props, "hydrant_001", new Vector3(14f, 0f, W / 2f + 1.8f), 0f, root.transform);
        Place(props, "trash_001", new Vector3(18f, 0f, W / 2f + 1.8f), 0f, root.transform);
        Place(props, "phone_booth_001", new Vector3(-30f, 0f, -(W / 2f + 2.2f)), 0f, root.transform);
        // 路口红绿灯四角
        float c = jW / 2f + 1.6f;
        Place(Pf + "/Landscape/Roads", "traffic_light_001", new Vector3(c, 0f, c), 180f, root.transform);
        Place(Pf + "/Landscape/Roads", "traffic_light_002", new Vector3(-c, 0f, c), 180f, root.transform);
        Place(Pf + "/Landscape/Roads", "traffic_light_003", new Vector3(c, 0f, -c), 0f, root.transform);
        Place(Pf + "/Landscape/Roads", "traffic_light_001", new Vector3(-c, 0f, -c), 0f, root.transform);
        // 喷泉（东端塔前小广场）
        Place(props, "fountain_001", new Vector3(avenueHalf + 12f, 0f, 0f), 0f, root.transform);
        // 绿植散布（seed 确定性·建筑后排）
        string[] bushes = { "bush_001", "bush_002", "bush_003", "bush_004", "bush_005" };
        string[] trees = { "tree_012", "tree_013", "palm_001" };
        for (int i = 0; i < 10; i++)
        {
            float x = -avenueHalf * 0.85f + (float)_rng.NextDouble() * avenueHalf * 1.7f;
            float zOff = W / 2f + 9f + (float)_rng.NextDouble() * 6f;
            bool north = _rng.NextDouble() > 0.5;
            string name = _rng.NextDouble() > 0.45 ? trees[_rng.Next(trees.Length)] : bushes[_rng.Next(bushes.Length)];
            Place(props, name, new Vector3(x, 0f, north ? zOff : -zOff), _rng.Next(4) * 90f, root.transform);
        }

        // ===== 车流层（静态摆位·交通系统接入=下批）=====
        var cars = new[] {
            Tuple.Create(TrafficCarsPf, "car_001"), Tuple.Create(TrafficCarsPf, "car_003"),
            Tuple.Create(TrafficCarsPf, "car_006"), Tuple.Create(TrafficVehPf, "bus_001"),
            Tuple.Create(TrafficCarsPf, "car_009"), Tuple.Create(TrafficCarsPf, "car_012"),
            Tuple.Create(TrafficCarsPf, "car_015"), Tuple.Create(TrafficVehPf, "fire_truck_001"),
        };
        float laneOff = W * 0.22f;
        for (int i = 0; i < cars.Length; i++)
        {
            var folder = cars[i].Item1; var name = cars[i].Item2;
            var s = MeasureSize(folder, name);
            if (s == Vector3.zero) continue;
            bool north = i % 2 == 0;
            float along = LongAxisRot(folder, name);              // 车体定向=最大 mesh 投票（防影子面片/子件干扰 renderer bounds 判例）
            float x = -avenueHalf * 0.62f + i * (avenueHalf * 1.24f / cars.Length);
            Place(folder, name, new Vector3(x, roadTop, north ? laneOff : -laneOff), north ? along + 180f : along, root.transform);
        }

        // ===== 材质过桥（URPMaterialBridge.Convert 复用·零重复律）=====
        int bridged = 0, keptUrp = 0, brokenShader = 0;
        foreach (var r in root.GetComponentsInChildren<Renderer>(true))
        {
            if (r is ParticleSystemRenderer) continue;
            var mats = r.sharedMaterials; var changed = false;
            for (int i = 0; i < mats.Length; i++)
            {
                var m = mats[i];
                if (m == null) { brokenShader++; continue; }
                if (m.shader == null || !m.shader.name.Contains("Universal Render Pipeline"))
                {
                    var conv = URPMaterialBridge.Convert(m);
                    if (conv != null) { mats[i] = conv; changed = true; bridged++; }
                }
                else keptUrp++;
            }
            if (changed) { r.sharedMaterials = mats; EditorUtility.SetDirty(r); }
        }
        Report.Add($"bridge: converted={bridged} kept_urp={keptUrp} broken_shader={brokenShader}");

        // ===== 判据帧捕获（三档+特写+夜景单帧）=====
        EditorSceneManager.SaveScene(scene, "Assets/Scenes/CityMegacity_Sample.unity");
        CaptureAll(cam, light, fill, avenueHalf, W);

        Report.Add($"placed={_placed} missing={_missing}");
        Report.Add($"total_ms={sw.ElapsedMilliseconds}");
        Report.Add("selection_law: 全部件 AD-049 库内 Prefab 实锚（CEO 令 10-08 能用就用）·云端生成径停");
        if (_missing > 0)
        {
            UnityEngine.Debug.LogError("MEGACITY_SAMPLE FAIL missing_prefabs=" + _missing);
            EditorApplication.Exit(1); return;
        }
        File.WriteAllLines(Path.Combine(Staging, "megacity-sample-report.md"), Report.ToArray(), System.Text.Encoding.UTF8);
        File.WriteAllText(Path.Combine(Staging, "megacity-sample.done"), $"RUN PASS placed={_placed} bridged={bridged} ms={sw.ElapsedMilliseconds}");
        UnityEngine.Debug.Log("MEGACITY_SAMPLE PASS placed=" + _placed + " bridged=" + bridged);
    }

    // ---------- 选件与实测 ----------
    static GameObject LoadPrefab(string folder, string name)
    {
        var p = $"{folder}/{name}.prefab";
        var go = AssetDatabase.LoadAssetAtPath<GameObject>(p);
        if (go == null) { Report.Add("WARN prefab_missing: " + p); _missing++; }
        return go;
    }

    static Bounds MeasureBounds(GameObject go)
    {
        var b = default(Bounds); bool first = true;
        foreach (var r in go.GetComponentsInChildren<Renderer>())
        {
            if (r is ParticleSystemRenderer) continue;
            if (first) { b = r.bounds; first = false; }
            else b.Encapsulate(r.bounds);
        }
        return b;
    }

    static Vector3 MeasureSize(string folder, string name)
    {
        var pf = LoadPrefab(folder, name);
        if (pf == null) return Vector3.zero;
        var go = (GameObject)PrefabUtility.InstantiatePrefab(pf);
        var b = MeasureBounds(go);
        UnityEngine.Object.DestroyImmediate(go);
        return b.size;
    }

    // 车体定向：最大体积 mesh 的本地包围盒投票（renderer bounds 会被影子面片/挂件拉偏判例）
    static float LongAxisRot(string folder, string name)
    {
        var pf = LoadPrefab(folder, name);
        if (pf == null) return 0f;
        Bounds best = default(Bounds); float bestVol = -1f;
        foreach (var mf in pf.GetComponentsInChildren<MeshFilter>())
        {
            var m = mf.sharedMesh; if (m == null) continue;
            var b = m.bounds; var vol = b.size.x * b.size.y * b.size.z;
            if (vol > bestVol) { bestVol = vol; best = b; }
        }
        if (bestVol < 0f) return 0f;
        return best.size.z > best.size.x ? 90f : 0f;
    }

    // 对齐律：贴地（min.y=0）+ bounds 中心 XZ 对位（防偏轴 pivot 坑）
    static GameObject Place(string folder, string name, Vector3 pos, float rotY, Transform parent)
    {
        var pf = LoadPrefab(folder, name);
        if (pf == null) return null;
        var go = (GameObject)PrefabUtility.InstantiatePrefab(pf);
        go.transform.SetParent(parent);
        go.transform.rotation = Quaternion.Euler(0f, rotY, 0f);
        var b = MeasureBounds(go);
        go.transform.position += new Vector3(pos.x - b.center.x, pos.y - b.min.y, pos.z - b.center.z);
        _placed++;
        Report.Add($"place: {name} size={b.size.x:F1}x{b.size.y:F1}x{b.size.z:F1} at=({go.transform.position.x:F0},{go.transform.position.z:F0}) rot={rotY:F0}");
        return go;
    }

    static Material MakeMat(string name, Color c)
    {
        Directory.CreateDirectory(Path.Combine(Application.dataPath, "Art/MegacitySample"));
        var path = $"Assets/Art/MegacitySample/{name}.mat";
        var m = AssetDatabase.LoadAssetAtPath<Material>(path);
        if (m == null) { m = new Material(Shader.Find("Universal Render Pipeline/Lit")) { name = name }; AssetDatabase.CreateAsset(m, path); }
        if (m.HasProperty("_BaseColor")) m.SetColor("_BaseColor", c);
        EditorUtility.SetDirty(m);
        return m;
    }

    // ---------- 判据帧 ----------
    static void CaptureAll(Camera cam, Light light, Light fill, float avenueHalf, float W)
    {
        var sw = Stopwatch.StartNew();
        Shot(cam, "M_L0_overview.png", 50f, 320f, new Vector3(0f, 0f, 0f));
        Shot(cam, "M_L1_avenue.png", 55f, 110f, new Vector3(0f, 0f, 0f));
        Shot(cam, "M_L2_street.png", 60f, 24f, new Vector3(avenueHalf * 0.25f, 0f, 0f));
        Shot(cam, "M_X_eiffel.png", 42f, 70f, new Vector3(avenueHalf + 40f, 0f, 0f));
        Shot(cam, "M_X_ferris.png", 45f, 55f, new Vector3(-(avenueHalf + 45f), 0f, -20f));
        Shot(cam, "M_X_props.png", 62f, 10f, new Vector3(0f, 0f, W / 2f + 2f));
        // 夜景单帧（CityAssembler 夜档配方同源）
        var dayRot = light.transform.rotation; var dayInt = light.intensity; var dayCol = light.color;
        var dayClear = cam.clearFlags; var dayFog = RenderSettings.fog; var dayFogD = RenderSettings.fogDensity; var dayFogCol = RenderSettings.fogColor;
        var dayAmb = RenderSettings.ambientLight; var dayAmbMode = RenderSettings.ambientMode;
        var fillInt = fill.intensity; var fillCol = fill.color;
        RenderSettings.ambientMode = AmbientMode.Flat;
        RenderSettings.ambientLight = new Color(0.05f, 0.06f, 0.11f);
        light.transform.rotation = Quaternion.Euler(38f, 150f, 0f);
        light.intensity = 0.18f;
        light.color = new Color32(0xA9, 0xC2, 0xE8, 255);
        cam.clearFlags = CameraClearFlags.SolidColor;
        cam.backgroundColor = new Color32(0x12, 0x1A, 0x30, 255);
        RenderSettings.fog = true;
        RenderSettings.fogColor = new Color32(0x0E, 0x16, 0x26, 255);
        RenderSettings.fogDensity = 0.0008f;
        fill.intensity = 0.06f; fill.color = new Color32(0x2A, 0x35, 0x50, 255);
        Shot(cam, "M_X_night_avenue.png", 55f, 70f, new Vector3(0f, 0f, 0f));
        light.transform.rotation = dayRot; light.intensity = dayInt; light.color = dayCol;
        cam.clearFlags = dayClear; RenderSettings.fog = dayFog; RenderSettings.fogDensity = dayFogD; RenderSettings.fogColor = dayFogCol;
        RenderSettings.ambientLight = dayAmb; RenderSettings.ambientMode = dayAmbMode;
        fill.intensity = fillInt; fill.color = fillCol;
        Report.Add($"capture_ms={sw.ElapsedMilliseconds}");
    }

    static void Shot(Camera cam, string file, float pitchDeg, float height, Vector3 target)
    {
        float d = height / Mathf.Tan(pitchDeg * Mathf.Deg2Rad);
        cam.transform.position = target + new Vector3(0f, height, -d);
        cam.transform.LookAt(target);
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
}
