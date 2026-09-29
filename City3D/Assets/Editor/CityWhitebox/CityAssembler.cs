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
public static class CityAssembler
{
    const int Seed = 20260929;
    const float GridM = 5f;                    // 定标锁定：1格=5m（CEO 选件搭建令）
    const float AnchorX = 24f, AnchorY = 45f;  // 2D 中央广场中心=世界原点
    const float CitiesR = 180f;
    static readonly float[] CityAngles = { 0f, 120f, 240f };
    static readonly string[] CityNames = { "QUANT", "MEDIA", "GAME" };

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
        var roadPieces = SelectRoadPieces();          // AD-022 路件族
        var buildings = SelectBuildings();            // AD-022 Prefabs 建筑池（实测 bounds 分档）
        var trees = SelectTrees();                    // AD-015 树池
        var hero = SelectHeroTower();                 // AD-018/020 脑塔件

        // ===== 铺装阶段 =====
        LayRoads(root.transform, cells, roadPieces);
        LayWater(root.transform, cells);
        LayTrees(root.transform, cells, trees);
        BuildBrainRing(root.transform);
        PlaceHeroTower(root.transform, hero);
        FillDistricts(root.transform, buildings);
        MarkOuterRing(root.transform);

        EditorSceneManager.SaveScene(scene, "Assets/Scenes/CityAssembled.unity");
        Report.Add($"scene saved: Assets/Scenes/CityAssembled.unity");
        Report.Add($"assemble_ms={sw.ElapsedMilliseconds}");
        Report.Add("calibration: 1grid=5m locked (CEO 09-28 选件搭建令·AD-022 路件 5x5m 1:1)");

        CaptureAll(cam);
        WriteReport();
        UnityEngine.Debug.Log("CITY3D_ASSEMBLE_DONE");
    }

    // ---------- 选件 ----------
    static RoadFamily SelectRoadPieces()
    {
        var fam = new RoadFamily();
        fam.Straight = PickAsset("SM_Env_Road_01", "Assets/lowpoly");
        fam.Crossing = PickAsset("SM_Env_Road_Crossing", "Assets/lowpoly");
        fam.FallbackStraight = PickAsset("SM_Env_Road_02", "Assets/lowpoly");
        Report.Add($"road_pick: straight={AssetPathOf(fam.Straight)} crossing={AssetPathOf(fam.Crossing)}");
        return fam;
    }

    class RoadFamily { public UnityEngine.Object Straight; public UnityEngine.Object Crossing; public UnityEngine.Object FallbackStraight; }

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

    static GameObject SelectHeroTower()
    {
        // 脑塔=库内高件堆叠：从 AD-018 科幻城挑最高楼 + AD-020 太空挑天线件
        GameObject best = null; float bestH = 0; Vector3 bestSize = Vector3.zero;
        foreach (var g in AssetDatabase.FindAssets("t:Prefab", new[] { "Assets/lowpoly/03_科幻/AD-018_Scene场景_赛博科幻城_SciFiCity" }))
        {
            var p = AssetDatabase.GUIDToAssetPath(g);
            var go = AssetDatabase.LoadAssetAtPath<GameObject>(p);
            var b = Measure(go);
            if (b == null) continue;
            if (b.Value.y > bestH && b.Value.y <= 90f && Mathf.Max(b.Value.x, b.Value.z) <= 20f) { best = go; bestH = b.Value.y; bestSize = b.Value; }
        }
        Report.Add($"hero_tower_pick: {(best == null ? "NONE(白盒塔兜底)" : best.name)} h={bestH:F0}m size={bestSize}");
        return best;
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
        int n = 0, cross = 0;
        foreach (var g in set)
        {
            bool n_ = set.Contains(g + Vector2.up), s = set.Contains(g + Vector2.down);
            bool e = set.Contains(g + Vector2.right), w = set.Contains(g + Vector2.left);
            int ns = (n_ ? 1 : 0) + (s ? 1 : 0), ew = (e ? 1 : 0) + (w ? 1 : 0);
            UnityEngine.Object piece = fam.Straight;
            float rotY = 0f;
            if (n_ && s && e && w && fam.Crossing != null) { piece = fam.Crossing; cross++; } // 严格四邻才十字
            else if (ew > ns) rotY = 90f;                                           // 主轴直行（对角带→阶梯直线化）
            if (piece == null) piece = fam.FallbackStraight;
            if (piece == null) continue;
            var go = (GameObject)PrefabUtility.InstantiatePrefab(piece, root);
            if (go == null) continue;
            go.transform.position = ToWorld(g, 0f);
            go.transform.rotation = Quaternion.Euler(0f, rotY, 0f);
            go.isStatic = true; go.name = "Road_" + n;
            n++;
        }
        Report.Add($"roads_placed: {n} (crossings={cross})");
    }

    static void LayWater(Transform root, Dictionary<string, List<Vector2>> cells)
    {
        // 平面水（Phase 2 换 InteractiveStylizedWater——本次快速搭建用共享蓝面）
        var mesh = QuadMesh(cells["WATER"], new Color32(0x4F, 0xA0, 0xC8, 255), 2.45f);
        var go = new GameObject("L_Water"); go.transform.SetParent(root.transform);
        go.AddComponent<MeshFilter>().sharedMesh = mesh;
        var mr = go.AddComponent<MeshRenderer>(); mr.sharedMaterial = Mat("WaterA", new Color32(0x4F, 0xA0, 0xC8, 255));
        Report.Add($"water_quads: {cells["WATER"].Count}");
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

    static void BuildBrainRing(Transform root)
    {
        var ring = GameObject.CreatePrimitive(PrimitiveType.Cylinder);
        ring.name = "BrainRing"; ring.transform.SetParent(root.transform);
        ring.transform.localScale = new Vector3(80f, 0.3f, 80f);
        ring.GetComponent<Renderer>().sharedMaterial = Mat("PlazaDisc", new Color32(0xED, 0xEA, 0xE2, 0xD6), "Universal Render Pipeline/Lit");
        // 广场格点铺浅色盘面已含圆柱底座——保留 2D PLAZA 格浅面
        var mesh = QuadMesh(new List<Vector2>(), Color.white, 2.5f); // placeholder no-op
    }

    static void PlaceHeroTower(Transform root, GameObject hero)
    {
        var tower = new GameObject("BrainTower"); tower.transform.SetParent(root.transform);
        if (hero != null)
        {
            var go = (GameObject)PrefabUtility.InstantiatePrefab(hero, tower.transform);
            if (go != null)
            {
                var b = Measure(hero);
                if (b != null) go.transform.position = new Vector3(0, 0, 0);
                go.isStatic = true;
                Report.Add("hero_tower_placed: " + go.name + " (AD-018 库内高件·天线=AD-020 件 Phase 1 细化)");
            }
        }
        else
        {
            float yBase = 0f;
            float[][] tiers = { new[] { 16f, 20f }, new[] { 12f, 18f }, new[] { 9f, 16f }, new[] { 6f, 14f }, new[] { 3.5f, 12f } };
            foreach (var t in tiers)
            {
                var bx = GameObject.CreatePrimitive(PrimitiveType.Cube);
                bx.transform.SetParent(tower.transform);
                bx.transform.localScale = new Vector3(t[0], t[1], t[0]);
                bx.transform.position = new Vector3(0, yBase + t[1] / 2f, 0);
                yBase += t[1];
            }
            Report.Add("hero_tower_placed: 白盒塔兜底（AD-018 未寻得合格高件）");
        }
        // 信标呼吸件（活性管道贯通件沿用）
        _pulseMat = MakePulseMat();
        var beacon = GameObject.CreatePrimitive(PrimitiveType.Sphere);
        beacon.name = "Beacon"; beacon.transform.SetParent(tower.transform);
        beacon.transform.localScale = Vector3.one * 2.4f;
        var heroH = hero != null ? (Measure(hero)?.y ?? 80f) : 85f;
        beacon.transform.position = new Vector3(0, heroH + 3f, 0);
        beacon.GetComponent<Renderer>().sharedMaterial = _pulseMat;
        var bp = beacon.AddComponent<BreathingPulse>();
        bp.jsonlPath = Path.Combine(FVRoot, "world/world-events.jsonl");
        bp.periodSeconds = 600f;
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
        Shot(cam, "A_X_bridge.png", 0, 0, ToWorld(new Vector2(23.5f, 30.5f), 0) + Vector3.up * 6f);
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
