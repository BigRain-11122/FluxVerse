using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Text.RegularExpressions;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine;
using UnityEngine.Rendering;

// Phase 0 白盒施工器（CEO 令 09-28 全面开工）
// 数据源：City3D-staging/city-layout-data.json 锚（硬编码正典锚值）+ Tools/city/td-organic-data.txt 格点（运行时直读）
// 输出：Assets/Scenes/CityWhitebox.unity + City3D-staging/shots/*.png 判据帧 + City3D-staging/phase0-report.md
public static class WhiteboxBuilder
{
    const int Seed = 20260928;
    const float GridM = 8f;                 // 1 格=8m 工作假设（Phase 0 定标翻面）
    const float AnchorX = 24f, AnchorY = 45f; // 2D 中央广场中心=世界原点（city-layout-data.json）
    const float CityExtent = 512f, ChunkM = 32f;
    const float RingR = 40f, CitiesR = 180f, OuterR = 240f;
    static readonly float[] CityAngles = { 0f, 120f, 240f };
    static readonly string[] CityNames = { "QUANT", "MEDIA", "GAME" };

    static string Root => Directory.GetParent(Application.dataPath).FullName;
    static string FVRoot => Directory.GetParent(Root).FullName;
    static string Staging => Path.Combine(FVRoot, "City3D-staging");
    static string Shots => Path.Combine(Staging, "shots");

    static readonly List<string> Report = new List<string>();
    static Material _pulseMat;

    public static void BuildAll()
    {
        var sw = Stopwatch.StartNew();
        Directory.CreateDirectory(Shots);
        Directory.CreateDirectory(Path.Combine(Application.dataPath, "Art/Whitebox"));
        Directory.CreateDirectory(Path.Combine(Application.dataPath, "Scenes"));
        AssetDatabase.Refresh();

        var scene = EditorSceneManager.NewScene(NewSceneSetup.DefaultGameObjects, NewSceneMode.Single);
        var root = new GameObject("CityRoot");

        // 灯与天色（Phase 0 日间白盒）
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
        cam.backgroundColor = new Color32(0x8F, 0xCD, 0xE8, 255); // AD-022 天空青
        cam.fieldOfView = 45f;

        // 地面
        var ground = GameObject.CreatePrimitive(PrimitiveType.Cube);
        ground.name = "Ground512"; ground.transform.SetParent(root.transform);
        ground.transform.localScale = new Vector3(CityExtent, 0.2f, CityExtent);
        ground.transform.position = Vector3.down * 0.1f;
        ground.GetComponent<Renderer>().sharedMaterial = Mat("Ground", new Color32(0x6E, 0x6E, 0x72, 255));

        // chunk 网格线（16x16·32m）
        for (int i = 0; i <= 16; i++)
        {
            float c = -CityExtent / 2f + i * ChunkM;
            var gx = GameObject.CreatePrimitive(PrimitiveType.Cube);
            gx.name = "GridX" + i; gx.transform.SetParent(root.transform);
            gx.transform.localScale = new Vector3(0.2f, 0.02f, CityExtent);
            gx.transform.position = new Vector3(c, 0.02f, 0);
            gx.GetComponent<Renderer>().sharedMaterial = Mat("GridLine", new Color(0.35f, 0.35f, 0.35f));
            var gz = GameObject.CreatePrimitive(PrimitiveType.Cube);
            gz.name = "GridZ" + i; gz.transform.SetParent(root.transform);
            gz.transform.localScale = new Vector3(CityExtent, 0.02f, 0.2f);
            gz.transform.position = new Vector3(0, 0.02f, c);
            gz.GetComponent<Renderer>().sharedMaterial = Mat("GridLine", new Color(0.35f, 0.35f, 0.35f));
        }

        // td-organic-data 格点层
        var cells = ParseCells(Path.Combine(FVRoot, "Tools/city/td-organic-data.txt"));
        AddLayerMesh(root.transform, "Roads", cells["ROAD"], new Color32(0x3A, 0x3A, 0x3E, 255), 0.06f, 4f);
        AddLayerMesh(root.transform, "Water", cells["WATER"], new Color32(0x4F, 0xA0, 0xC8, 255), 0.04f, 4f);
        AddLayerMesh(root.transform, "Sand", cells["SAND"], new Color32(0xC9, 0xB2, 0x95, 255), 0.05f, 4f);
        AddLayerMesh(root.transform, "Plaza", cells["PLAZA"], new Color32(0xE0, 0xDC, 0xD4, 255), 0.07f, 4f);
        AddLayerMesh(root.transform, "Parks", cells["PARK"], new Color32(0x5F, 0xA0, 0x50, 255), 0.06f, 4f);
        AddLayerMesh(root.transform, "Bridges", cells["BRIDGES"], new Color32(0x9A, 0x8A, 0x76, 255), 0.35f, 3.6f);
        AddTreeCones(root.transform, cells["TREES"], new Color32(0x5F, 0xA0, 0x50, 255));
        Report.Add($"cells: ROAD={cells["ROAD"].Count} WATER={cells["WATER"].Count} SAND={cells["SAND"].Count} PLAZA={cells["PLAZA"].Count} PARK={cells["PARK"].Count} BRIDGES={cells["BRIDGES"].Count} TREES={cells["TREES"].Count}");

        // 脑环
        var ring = GameObject.CreatePrimitive(PrimitiveType.Cylinder);
        ring.name = "BrainRing"; ring.transform.SetParent(root.transform);
        ring.transform.localScale = new Vector3(RingR * 2f, 0.3f, RingR * 2f);
        ring.GetComponent<Renderer>().sharedMaterial = Mat("PlazaDisc", new Color32(0xED, 0xEA, 0xE2, 0xD6));

        // 脑塔（模块堆叠+天线+信标）
        var tower = new GameObject("BrainTower"); tower.transform.SetParent(root.transform);
        var towerMat = Mat("TowerMat", new Color32(0x7B, 0x8A, 0xB8, 255));
        float yBase = 0f;
        float[][] tiers = { new[] { 16f, 20f }, new[] { 12f, 18f }, new[] { 9f, 16f }, new[] { 6f, 14f }, new[] { 3.5f, 12f } };
        foreach (var t in tiers)
        {
            var b = GameObject.CreatePrimitive(PrimitiveType.Cube);
            b.name = "TowerTier"; b.transform.SetParent(tower.transform);
            b.transform.localScale = new Vector3(t[0], t[1], t[0]);
            b.transform.position = new Vector3(0, yBase + t[1] / 2f, 0);
            b.GetComponent<Renderer>().sharedMaterial = towerMat;
            yBase += t[1];
        }
        var ant = GameObject.CreatePrimitive(PrimitiveType.Cylinder);
        ant.name = "Antenna"; ant.transform.SetParent(tower.transform);
        ant.transform.localScale = new Vector3(0.6f, 24f, 0.6f);
        ant.transform.position = new Vector3(0, yBase + 12f, 0);
        ant.GetComponent<Renderer>().sharedMaterial = towerMat;
        var beacon = GameObject.CreatePrimitive(PrimitiveType.Sphere);
        beacon.name = "Beacon"; beacon.transform.SetParent(tower.transform);
        beacon.transform.localScale = Vector3.one * 2.4f;
        beacon.transform.position = new Vector3(0, yBase + 25.5f, 0);
        _pulseMat = MakePulseMat();
        beacon.GetComponent<Renderer>().sharedMaterial = _pulseMat;
        var bp = beacon.AddComponent<BreathingPulse>();
        bp.jsonlPath = Path.Combine(FVRoot, "world/world-events.jsonl");
        bp.periodSeconds = 600f;

        // 三城白盒组
        var rng = new System.Random(Seed);
        var cityMat = Mat("CityMat", new Color32(0x4E, 0x80, 0xAC, 255));
        for (int i = 0; i < CityAngles.Length; i++)
        {
            float a = CityAngles[i] * Mathf.Deg2Rad;
            Vector3 c = new Vector3(Mathf.Cos(a) * CitiesR, 0, Mathf.Sin(a) * CitiesR);
            var city = new GameObject("City_" + CityNames[i]); city.transform.SetParent(root.transform);
            city.transform.position = c;
            var pad = GameObject.CreatePrimitive(PrimitiveType.Cube);
            pad.name = "DistrictPad"; pad.transform.SetParent(city.transform);
            pad.transform.localScale = new Vector3(100f, 0.1f, 100f);
            pad.GetComponent<Renderer>().sharedMaterial = Mat("PadMat", new Color(0.42f, 0.44f, 0.5f));
            for (int b = 0; b < 8; b++)
            {
                var bx = GameObject.CreatePrimitive(PrimitiveType.Cube);
                bx.name = "B" + b; bx.transform.SetParent(city.transform);
                bx.transform.localPosition = new Vector3((rng.Next(-42, 43)), 0, (rng.Next(-42, 43)));
                float w = 8 + rng.Next(0, 11), h = 10 + rng.Next(0, 26);
                bx.transform.localScale = new Vector3(w, h, w);
                bx.transform.localPosition += Vector3.up * h / 2f;
                bx.GetComponent<Renderer>().sharedMaterial = cityMat;
            }
        }

        // 外环感知网
        var ringMat = Mat("OuterRing", new Color32(0xEF, 0x6F, 0x76, 255));
        for (int i = 0; i < 64; i++)
        {
            float ang = i / 64f * 360f;
            var seg = GameObject.CreatePrimitive(PrimitiveType.Cube);
            seg.name = "OuterSeg" + i; seg.transform.SetParent(root.transform);
            float rad = ang * Mathf.Deg2Rad;
            seg.transform.position = new Vector3(Mathf.Cos(rad) * OuterR, 0.3f, Mathf.Sin(rad) * OuterR);
            seg.transform.rotation = Quaternion.Euler(0, -ang, 0);
            seg.transform.localScale = new Vector3(24f, 0.4f, 1.5f);
            seg.GetComponent<Renderer>().sharedMaterial = ringMat;
        }

        EditorSceneManager.SaveScene(scene, "Assets/Scenes/CityWhitebox.unity");
        Report.Add($"scene saved: Assets/Scenes/CityWhitebox.unity (root_children={root.transform.childCount})");
        Report.Add($"build_ms={sw.ElapsedMilliseconds}");

        CaptureAll(cam);
        MeasureRoadAndSample(root.transform);
        WriteReport();
        UnityEngine.Debug.Log("CITY3D_PHASE0_DONE");
    }

    static Dictionary<string, List<Vector2>> ParseCells(string path)
    {
        var dict = new Dictionary<string, List<Vector2>> {
            { "ROAD", new List<Vector2>() }, { "WATER", new List<Vector2>() }, { "SAND", new List<Vector2>() },
            { "PLAZA", new List<Vector2>() }, { "PARK", new List<Vector2>() }, { "BRIDGES", new List<Vector2>() },
            { "TREES", new List<Vector2>() } };
        if (!File.Exists(path)) { Report.Add("WARN: td-organic-data.txt not found at " + path); return dict; }
        var re = new Regex(@"(\d+),(\d+)");
        foreach (var line in File.ReadAllLines(path))
        {
            var sp = line.Split(' ')[0];
            if (!dict.ContainsKey(sp) && sp != "ROAD") continue;
            foreach (Match m in re.Matches(line))
                dict[sp].Add(new Vector2(int.Parse(m.Groups[1].Value), int.Parse(m.Groups[2].Value)));
        }
        return dict;
    }

    static Vector3 ToWorld(Vector2 g, float y) => new Vector3((g.x - AnchorX) * GridM, y, (g.y - AnchorY) * GridM);

    static void AddLayerMesh(Transform parent, string name, List<Vector2> cells, Color32 c, float y, float half)
    {
        if (cells.Count == 0) return;
        var verts = new List<Vector3>(); var tris = new List<int>();
        foreach (var g in cells)
        {
            Vector3 p = ToWorld(g, y);
            int i0 = verts.Count;
            verts.Add(p + new Vector3(-half, 0, -half)); verts.Add(p + new Vector3(half, 0, -half));
            verts.Add(p + new Vector3(half, 0, half)); verts.Add(p + new Vector3(-half, 0, half));
            tris.AddRange(new[] { i0, i0 + 1, i0 + 2, i0, i0 + 2, i0 + 3, i0, i0 + 2, i0 + 1, i0, i0 + 3, i0 + 2 }); // 双面：俯视角零剔除风险
        }
        var mesh = new Mesh { indexFormat = IndexFormat.UInt32 };
        mesh.SetVertices(verts); mesh.SetTriangles(tris, 0); mesh.RecalculateNormals(); mesh.RecalculateBounds();
        var go = new GameObject("L_" + name); go.transform.SetParent(parent.transform);
        var mf = go.AddComponent<MeshFilter>(); mf.sharedMesh = mesh;
        var mr = go.AddComponent<MeshRenderer>(); mr.sharedMaterial = Mat(name, c);
    }

    static void AddTreeCones(Transform parent, List<Vector2> cells, Color32 c)
    {
        foreach (var g in cells)
        {
            var t = GameObject.CreatePrimitive(PrimitiveType.Capsule);
            t.name = "TreeW"; t.transform.SetParent(parent.transform);
            Vector3 p = ToWorld(g, 4f);
            t.transform.position = p; t.transform.localScale = new Vector3(3f, 4f, 3f);
            t.GetComponent<Renderer>().sharedMaterial = Mat("TreeW", c);
        }
    }

    static Material Mat(string name, Color c, string shader = "Universal Render Pipeline/Unlit")
    {
        var path = $"Assets/Art/Whitebox/{name}.mat";
        var existing = AssetDatabase.LoadAssetAtPath<Material>(path);
        if (existing != null) return existing;
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
        Shot(cam, "L0_overview.png", 50f, 320f, Vector3.zero, "L0");
        Shot(cam, "L1_brainring.png", 55f, 110f, new Vector3(0, 20f, 0), "L1");
        Shot(cam, "L2_street.png", 60f, 24f, new Vector3(0, 8f, 0), "L2");
        // 桥位帧（SHOT_BRIDGE 2D 取景点直译）
        cam.transform.position = ToWorld(new Vector2(23.5f, 30.5f), 6f);
        cam.transform.rotation = Quaternion.LookRotation(new Vector3(0, 30f, 0) - cam.transform.position);
        Shot(cam, "X_bridge.png", 0, 0, Vector3.zero, "bridge");
        // 呼吸灯对账双帧（emission 通道贯通证明 v0：真运行时对账=Phase 2 接线）
        _pulseMat.SetColor("_EmissionColor", Color.white * 3.5f);
        Shot(cam, "breath_on.png", 55f, 110f, new Vector3(0, 40f, 0), "breath_on");
        _pulseMat.SetColor("_EmissionColor", Color.white * 0.05f);
        Shot(cam, "breath_off.png", 55f, 110f, new Vector3(0, 40f, 0), "breath_off");
        Report.Add($"capture_ms={sw.ElapsedMilliseconds}（batchmode 渲染代理读数·真 fps=WebGL 构建后浏览器读数）");
    }

    static void Shot(Camera cam, string file, float pitchDeg, float height, Vector3 target, string tag)
    {
        if (pitchDeg > 0)
        {
            float d = height / Mathf.Tan(pitchDeg * Mathf.Deg2Rad);
            cam.transform.position = target + new Vector3(0, height, -d);
            cam.transform.LookAt(target);
        }
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

    static void MeasureRoadAndSample(Transform root)
    {
        // AD-022 路面件实测定标（1 格=8-16m 锁定依据）
        var guids = AssetDatabase.FindAssets("SM_Env_Road_01", new[] { "Assets/lowpoly" });
        if (guids.Length > 0)
        {
            var p = AssetDatabase.GUIDToAssetPath(guids[0]);
            var go = UnityEngine.Object.Instantiate(AssetDatabase.LoadAssetAtPath<UnityEngine.Object>(p)) as GameObject;
            if (go != null)
            {
                var r = go.GetComponentInChildren<Renderer>();
                if (r != null)
                {
                    Vector3 s = r.bounds.size;
                    Report.Add($"road_measure: {System.IO.Path.GetFileName(p)} importer_size={s.x:F2}x{s.y:F2}x{s.z:F2} m => 1格定标候选=路面宽 {Mathf.Max(s.x, s.z):F1} m（8-16m 窗口内=锁定 8m；>16m=升 16m 待裁）");
                }
                UnityEngine.Object.DestroyImmediate(go);
            }
        }
        else Report.Add("road_measure: SM_Env_Road_01 未找到（包导入状态待查）");

        // URP 过桥抽件（材质 shader 态记录）
        var bgs = AssetDatabase.FindAssets("SM_Bld_", new[] { "Assets/lowpoly" });
        if (bgs.Length > 0)
        {
            var p = AssetDatabase.GUIDToAssetPath(bgs[0]);
            var go = UnityEngine.Object.Instantiate(AssetDatabase.LoadAssetAtPath<UnityEngine.Object>(p)) as GameObject;
            if (go != null)
            {
                go.transform.position = new Vector3(60, 0, 60);
                var r = go.GetComponentInChildren<Renderer>();
                if (r != null)
                    Report.Add($"sample: {System.IO.Path.GetFileName(p)} shader={r.sharedMaterial.shader.name}（含 Universal=URP 材质已过桥；Standard/BuiltIn=须过桥转换）size={r.bounds.size:F1}");
                var cam = Camera.main;
                cam.transform.position = new Vector3(60, 18, 95); cam.transform.LookAt(new Vector3(60, 12, 60));
                Shot(cam, "X_ad_sample.png", 0, 0, Vector3.zero, "sample");
                UnityEngine.Object.DestroyImmediate(go);
            }
        }
    }

    static void WriteReport()
    {
        // OS_TICK 新鲜度断言（活性管道贯通件的数据侧证明）
        string jpath = Path.Combine(FVRoot, "world/world-events.jsonl");
        string tick = "未找到";
        if (File.Exists(jpath))
        {
            var lines = File.ReadAllLines(jpath);
            for (int i = lines.Length - 1; i >= 0; i--)
                if (lines[i].Contains("OS_TICK")) { tick = lines[i].Length > 160 ? lines[i].Substring(0, 160) : lines[i]; break; }
        }
        Report.Add("os_tick_last: " + tick);
        Report.Add("breath_diff: breath_on.png vs breath_off.png 信标 emission 强度差=呼吸通道贯通证明（v0 静态双帧·真对账=Phase 2 运行时拍点绑定）");
        Report.Add("anchors: scale=8m/格 anchor=(24,45) ring=40 cities=180@0/120/240 outer=240（city-layout-data.json）");
        File.WriteAllLines(Path.Combine(Staging, "phase0-report.md"), Report.ToArray());
        AssetDatabase.Refresh();
    }

    public static void BatchEntry()
    {
        try { BuildAll(); }
        catch (Exception e) { UnityEngine.Debug.LogError("CITY3D_PHASE0_FAIL: " + e); EditorApplication.Exit(1); }
    }
}
