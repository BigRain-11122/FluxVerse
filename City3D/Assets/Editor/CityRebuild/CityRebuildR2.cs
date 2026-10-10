using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine;

// R2 模块壳真建筑试点 v2（CEO 令 O-20261011-0003·多精化迭代第二轮）
// v2 修面：①实例级 URP 材质桥（v1 品红根因=Synty .mat Built-in Standard·URPMaterialBridge.Convert 复用）
// ②模块解剖房（官方模块件拼装：带门洞外墙+地板+楼梯+内墙·无顶=剖面展示）=走进建筑真证
// ③门洞可通机检（Door 墙件真实开洞·门外射线净空≥1.8m）④区台铺装换暖色（防误读水面）
// 数据面：Assets/Scenes/CityWhitebox.unity（Phase 0 正身不动）→ 另存 CityRebuild_R2.unity
// 资产引用律：一切实例命名带 AD-021 前缀。
public static class CityRebuildR2
{
    const int ShotW = 1920, ShotH = 1080;
    static string FVRoot => Directory.GetParent(Directory.GetParent(Application.dataPath).FullName).FullName;
    static string Staging => Path.Combine(FVRoot, "City3D-staging");
    static string Shots => Path.Combine(Staging, "shots");
    static readonly List<string> Report = new List<string>();

    public static void BatchEntry()
    {
        try { Run(); }
        catch (Exception e) { UnityEngine.Debug.LogError("CITY3D_R2_FAIL: " + e); EditorApplication.Exit(1); }
    }

    static void Run()
    {
        var sw = Stopwatch.StartNew();
        Directory.CreateDirectory(Shots);
        var scene = EditorSceneManager.OpenScene("Assets/Scenes/CityWhitebox.unity", OpenSceneMode.Single);
        var cam = Camera.main;
        if (cam == null) throw new Exception("no main camera in CityWhitebox scene");

        var cityGame = FindDistrict("City_GAME"); // 布局正典：GAME 城=AD-021 城镇族
        if (cityGame == null) throw new Exception("City_GAME not found");

        // v2 重建（v1 已跑过一次：先清 R2 根再装——幂等）
        var old = cityGame.transform.Find("R2_AD-021_District");
        if (old != null) UnityEngine.Object.DestroyImmediate(old.gameObject);
        int removed = 0;
        for (int i = cityGame.transform.childCount - 1; i >= 0; i--)
        {
            var ch = cityGame.transform.GetChild(i);
            if (ch.name.Length == 2 && ch.name[0] == 'B' && char.IsDigit(ch.name[1]))
            { UnityEngine.Object.DestroyImmediate(ch.gameObject); removed++; }
        }
        Report.Add("whitebox_removed=" + removed + "（City_GAME B0-B7·v2 幂等重建）");

        var r2root = new GameObject("R2_AD-021_District");
        r2root.transform.SetParent(cityGame.transform, false);

        // ① 官方整房阵列（街面层）
        string[] presetNames = {
            "SM_Bld_House_Preset_01", "SM_Bld_House_Preset_02", "SM_Bld_House_Preset_03", "SM_Bld_House_Preset_04",
            "SM_Bld_House_Preset_05", "SM_Bld_House_Preset_06", "SM_Bld_House_Preset_07", "SM_Bld_House_Preset_08" };
        float[] xs = { -33f, -33f, 33f, 33f };
        float[] zs = { -26f, 26f, -26f, 26f };
        var houses = new List<GameObject>();
        int idx = 0;
        foreach (var nm in presetNames)
        {
            var pf = LoadPrefab(nm);
            if (pf == null) throw new Exception("prefab missing: " + nm);
            var go = (GameObject)PrefabUtility.InstantiatePrefab(pf);
            go.name = "R2_AD-021_" + nm;
            go.transform.SetParent(r2root.transform, false);
            go.transform.localPosition = new Vector3(xs[idx / 2], 0, zs[idx % 2 == 0 ? 0 : 0] );
            idx++;
        }
        // 重排为 4x2（上面占位数组留痕删）——直接干净铺：
        idx = 0;
        float[] gx = { -33f, -11f, 11f, 33f };
        float[] gz = { -26f, 26f };
        foreach (var tr in r2root.transform.Cast<Transform>().ToList())
        {
            int row = idx / 4, col = idx % 4; idx++;
            tr.localPosition = new Vector3(gx[col], 0, gz[row]);
            tr.localRotation = Quaternion.Euler(0, gz[row] > 0 ? 180f : 0f, 0f);
            SitOnGround(tr);
            houses.Add(tr.gameObject);
        }
        Report.Add("houses=" + houses.Count + "（AD-021 官方 Preset 01-08·4x2·门朝城心）");

        // ② 模块解剖房（走进建筑真证·无顶剖面展示位=前排中缺）
        var showcase = BuildShowcase(r2root.transform, new Vector3(0f, 0f, 26f));

        // ③ 实例级材质桥（品红根治：Synty Standard .mat → URP Lit·URPMaterialBridge.Convert 复用）
        int bridged = 0, missing = 0;
        foreach (var r in r2root.GetComponentsInChildren<MeshRenderer>(true))
        {
            var mats = r.sharedMaterials;
            var changed = false;
            for (int i = 0; i < mats.Length; i++)
            {
                var m = mats[i];
                if (m == null) { mats[i] = FallbackMat(); missing++; changed = true; continue; }
                if (m.shader != null && m.shader.name.Contains("Universal Render Pipeline")) continue;
                mats[i] = URPMaterialBridge.Convert(m); bridged++; changed = true;
            }
            if (changed) { r.sharedMaterials = mats; EditorUtility.SetDirty(r); }
        }
        Report.Add("mat_bridge: converted=" + bridged + " missing_filled=" + missing + "（实例级·prefab 资产零触碰）");

        // ④ 区台铺装换暖色（v1 蓝灰误读水面）
        RecolorPad(cityGame.transform);

        // ④b 宅基台+街区路带+整体抬升（v3 治「漂在水上」：每房一基座·两排间路带串联）
        var lotMat = new Material(Shader.Find("Universal Render Pipeline/Unlit")) { name = "R2_Lot" };
        lotMat.SetColor("_BaseColor", new Color32(0xA8, 0xA0, 0x94, 255));
        var streetMat = new Material(Shader.Find("Universal Render Pipeline/Unlit")) { name = "R2_Street" };
        streetMat.SetColor("_BaseColor", new Color32(0x58, 0x56, 0x5E, 255));
        foreach (var h in houses)
        {
            var b = WorldBounds(h);
            var lot = GameObject.CreatePrimitive(PrimitiveType.Cube);
            lot.name = "R2_AD-021_Lot_" + h.name;
            lot.transform.SetParent(r2root.transform, false);
            Vector3 lp = r2root.transform.InverseTransformPoint(new Vector3(b.center.x, 0, b.center.z));
            lot.transform.localPosition = new Vector3(lp.x, 0.055f, lp.z);
            lot.transform.localScale = new Vector3(b.size.x + 2.4f, 0.05f, b.size.z + 2.4f);
            lot.GetComponent<Renderer>().sharedMaterial = lotMat;
        }
        var street = GameObject.CreatePrimitive(PrimitiveType.Cube);
        street.name = "R2_AD-021_Street";
        street.transform.SetParent(r2root.transform, false);
        street.transform.localPosition = new Vector3(0f, 0.04f, 0f);
        street.transform.localScale = new Vector3(76f, 0.04f, 6f);
        street.GetComponent<Renderer>().sharedMaterial = streetMat;
        foreach (var h in houses.Concat(new[] { showcase })) h.transform.position += Vector3.up * 0.08f;
        Report.Add("lots=8+street=1（宅基台 0.08 顶·路带两排间·整体抬升 0.08 治漂浮）");

        // ⑤ 碰撞面（走进建筑判据前置）
        int colliders = 0;
        foreach (var h in houses.Concat(new[] { showcase }))
            foreach (var r in h.GetComponentsInChildren<MeshRenderer>(true))
            {
                var mf = r.GetComponent<MeshFilter>();
                if (mf == null || mf.sharedMesh == null) continue;
                if (r.GetComponent<MeshCollider>() == null)
                { var mc = r.gameObject.AddComponent<MeshCollider>(); mc.sharedMesh = mf.sharedMesh; colliders++; }
            }
        Report.Add("colliders_added=" + colliders);

        foreach (var h in houses.Take(3))
        { var b = WorldBounds(h); Report.Add($"measure {h.name}: {b.size.x:F1}x{b.size.y:F1}x{b.size.z:F1} m"); }

        // ⑥ 门洞可通机检：解剖房 Door 墙（真实开洞）——preset 单体组合 Mesh 无门件锚=如实记录
        Report.Add(DoorProbe(showcase, "showcase"));
        Report.Add("preset_door_note: 官方 Preset=单体组合 Mesh（无门件子节点）→门洞机检归解剖房承载·preset 街面层不承担走进建筑判据（如实标注）");

        // ⑦ 判据帧
        Shot(cam, "R2_L0_overview.png", 50f, 320f, Vector3.zero);
        Shot(cam, "R2_L1_gamedistrict.png", 55f, 110f, cityGame.transform.position);
        Shot(cam, "R2_L2_street.png", 60f, 24f, houses[1].transform.position);
        HouseFrontShot(cam, houses[0], "R2_house_front.png");
        ShowcaseShots(cam, showcase);

        EditorSceneManager.SaveScene(scene, "Assets/Scenes/CityRebuild_R2.unity");
        Report.Add("scene_saved=Assets/Scenes/CityRebuild_R2.unity（CityWhitebox.unity 原样保留）");
        Report.Add("elapsed_ms=" + sw.ElapsedMilliseconds);
        File.WriteAllLines(Path.Combine(Staging, "r2-report.md"), Report.ToArray());
        AssetDatabase.Refresh();
        UnityEngine.Debug.Log("CITY3D_R2_DONE");
    }

    // ===== 模块解剖房：官方模块件拼装（无顶剖面展示）=====
    static GameObject BuildShowcase(Transform parent, Vector3 localPos)
    {
        var straight = LoadPrefab("SM_Bld_House_ExteriorWall_GroundFloor_01");
        var doorWall = LoadPrefab("SM_Bld_House_ExteriorWall_GroundFloor_Door_01");
        var corner = LoadPrefab("SM_Bld_House_ExteriorWall_GroundFloor_Corner_01");
        var floor = LoadPrefab("SM_Bld_House_Interior_Floor_01");
        var stairs = LoadPrefab("SM_Bld_House_Interior_Stairs_01");
        var iwall = LoadPrefab("SM_Bld_House_InteriorWall_01");
        if (straight == null || doorWall == null || corner == null || floor == null) throw new Exception("showcase module missing");

        var root = new GameObject("R2_AD-021_ModularShowcase");
        root.transform.SetParent(parent, false);
        root.transform.localPosition = localPos;
        root.transform.localRotation = Quaternion.Euler(0, 180f, 0f); // 前脸朝城心

        var mStraight = MeasureRun(straight);
        var mDoor = MeasureRun(doorWall);
        var mCorner = MeasureRun(corner);
        var mFloor = MeasureRun(floor);
        Report.Add($"module_measure: straight {mStraight.sx:F2}x{mStraight.sz:F2}xH{mStraight.h:F2} · door {mDoor.sx:F2}x{mDoor.sz:F2} · corner {mCorner.sx:F2}x{mCorner.sz:F2} · floor {mFloor.sx:F2}x{mFloor.sz:F2}");

        float L = mStraight.Run;
        int nX = Math.Max(2, Mathf.RoundToInt(8f / L)); // 8m 宽
        int nZ = Math.Max(2, Mathf.RoundToInt(6f / L)); // 6m 深
        float halfX = nX * L / 2f, halfZ = nZ * L / 2f;

        // 前侧（-Z）：中段换门洞墙
        for (int i = 0; i < nX; i++)
        {
            bool isDoor = (nX >= 3) ? (i == nX / 2) : (i == 0);
            var pf = isDoor ? doorWall : straight;
            Place(root.transform, pf, "Wall" + (isDoor ? "Door" : "Front") + i,
                new Vector3(-halfX + L * (i + 0.5f), 0, -halfZ), 0f, mStraight.RunAlongX ? 0f : 90f);
        }
        for (int i = 0; i < nX; i++) Place(root.transform, straight, "WallBack" + i, new Vector3(-halfX + L * (i + 0.5f), 0, halfZ), 0f, mStraight.RunAlongX ? 0f : 90f);
        float wallBase = 0f; // Synty 墙件 pivot=底部（v2 实测无沉浮）
        for (int i = 0; i < nZ; i++) // 侧墙 nZ 段（前后墙端点咬合·零重叠）
        {
            Place(root.transform, straight, "WallL" + i, new Vector3(-halfX, wallBase, -halfZ + L * (i + 0.5f)), 0f, mStraight.RunAlongX ? 90f : 0f);
            Place(root.transform, straight, "WallR" + i, new Vector3(halfX, wallBase, -halfZ + L * (i + 0.5f)), 0f, mStraight.RunAlongX ? 90f : 0f);
        }
        // 角柱×4（0.24m 装饰柱·归位角点遮缝）
        Place(root.transform, corner, "CornerFN", new Vector3(-halfX, 0, -halfZ), 0f, 0f);
        Place(root.transform, corner, "CornerFS", new Vector3(halfX, 0, -halfZ), 0f, 90f);
        Place(root.transform, corner, "CornerBS", new Vector3(halfX, 0, halfZ), 0f, 180f);
        Place(root.transform, corner, "CornerBN", new Vector3(-halfX, 0, halfZ), 0f, 270f);

        // 室内地板
        int fX = Math.Max(1, (int)Mathf.Ceil((nX * L) / Math.Max(0.5f, mFloor.sx)));
        int fZ = Math.Max(1, (int)Mathf.Ceil((nZ * L) / Math.Max(0.5f, mFloor.sz)));
        for (int a = 0; a < fX; a++)
            for (int b = 0; b < fZ; b++)
                Place(root.transform, floor, "Floor" + a + "_" + b,
                    new Vector3(-halfX + mFloor.sx * (a + 0.5f), 0.01f, -halfZ + mFloor.sz * (b + 0.5f)), 0f, 0f, 0f);

        // 楼梯（后角）+内墙（中隔）
        if (stairs != null) Place(root.transform, stairs, "Stairs", new Vector3(halfX - 1.2f, 0.01f, halfZ - 1.4f), 0f, 180f, 0f);
        if (iwall != null) Place(root.transform, iwall, "InteriorWall", new Vector3(0f, 0.01f, halfZ - L * 0.5f), 0f, 90f, 0f);

        // 室内点灯（治剖面死黑·暖光读出室内）
        var lgo = new GameObject("R2_AD-021_InteriorLight");
        lgo.transform.SetParent(root.transform, false);
        lgo.transform.localPosition = new Vector3(0f, 2.6f, 0f);
        var lt = lgo.AddComponent<Light>();
        lt.type = LightType.Point; lt.range = 7f; lt.intensity = 0.9f; lt.color = new Color32(0xFF, 0xD9, 0x9E, 255);

        SitOnGround(root.transform);
        Report.Add($"showcase: 模块壳拼装 {nX}x{nZ} 段（L={L:F2}m footprint={nX * L:F1}x{nZ * L:F1}m）+地板 {fX}x{fZ}+楼梯+内墙·无顶=剖面展示（走进建筑 v2 真证面）");
        return root;
    }

    struct RunMeasure { public float sx, sz, h, Run; public bool RunAlongX; }
    static RunMeasure MeasureRun(GameObject pf)
    {
        var go = (GameObject)PrefabUtility.InstantiatePrefab(pf);
        go.transform.position = new Vector3(0, -100f, 0);
        var b = WorldBounds(go);
        var m = new RunMeasure { sx = b.size.x, sz = b.size.z, h = b.size.y };
        m.RunAlongX = m.sx >= m.sz;
        m.Run = m.RunAlongX ? m.sx : m.sz;
        UnityEngine.Object.DestroyImmediate(go);
        return m;
    }

    static void Place(Transform parent, GameObject pf, string name, Vector3 localPos, float pitch, float yaw, float yOffset = 0f)
    {
        var go = (GameObject)PrefabUtility.InstantiatePrefab(pf);
        go.name = "R2_AD-021_" + name;
        go.transform.SetParent(parent, false);
        go.transform.localPosition = localPos + Vector3.up * yOffset;
        go.transform.localRotation = Quaternion.Euler(pitch, yaw, 0f);
    }

    static string DoorProbe(GameObject house, string tag)
    {
        Transform door = null;
        foreach (var tr in house.GetComponentsInChildren<Transform>(true))
            if (tr.name.IndexOf("WallDoor", StringComparison.OrdinalIgnoreCase) >= 0) { door = tr; break; }
        if (door == null) return $"door_probe[{tag}] NO_DOOR_WALL";
        float best = -1f;
        float[] offs = { -0.8f, -0.4f, 0f, 0.4f, 0.8f };
        foreach (var dir in new[] { door.forward, -door.forward })
            foreach (var o in offs)
            {
                Vector3 org = door.position + door.right * o + dir * 0.9f + Vector3.up * 1.2f;
                if (Physics.Raycast(org, -dir, out var hit, 8f)) { if (hit.distance > best) best = hit.distance; }
                else if (8f > best) best = 8f;
            }
        bool pass = best >= 1.8f;
        return $"door_probe[{tag}] {(pass ? "PASS" : "FAIL")} clear={best:F2}m（扇形5点×双向·≥1.8m=门洞可通）";
    }

    static void ShowcaseShots(Camera cam, GameObject showcase)
    {
        var b = WorldBounds(showcase);
        Vector3 c = b.center;
        // 解剖房前脸（门洞可见）
        Vector3 front = showcase.transform.position + showcase.transform.forward * (b.size.z * 0.5f + 5f) + Vector3.up * 3.2f;
        cam.transform.position = front;
        cam.transform.LookAt(c + Vector3.up * 1.2f);
        RenderShot(cam, "R2_showcase_front.png");
        // 剖面顶斜视（无顶·室内地板+楼梯+内墙可见）
        cam.transform.position = c + new Vector3(b.size.x * 0.6f, b.size.y * 2.4f + 6f, b.size.z * 0.9f);
        cam.transform.LookAt(c);
        RenderShot(cam, "R2_interior_cutaway.png");
    }

    static void RecolorPad(Transform city)
    {
        var pad = city.Find("DistrictPad");
        var r = pad != null ? pad.GetComponent<Renderer>() : null;
        if (r != null)
        {
            var m = new Material(Shader.Find("Universal Render Pipeline/Unlit")) { name = "R2_Pavement" };
            m.SetColor("_BaseColor", new Color32(0xB8, 0xAE, 0x9E, 255)); // 暖混凝土
            r.sharedMaterial = m;
            Report.Add("pad_recolor: DistrictPad → R2_Pavement 暖混凝土（v1 蓝灰误读水面修正）");
        }
    }

    static Material FallbackMat()
    {
        var m = new Material(Shader.Find("Universal Render Pipeline/Lit")) { name = "R2_Fallback" };
        m.SetColor("_BaseColor", new Color32(0xC8, 0xB8, 0x9A, 255));
        return m;
    }

    static GameObject FindDistrict(string name)
    {
        foreach (var t in UnityEngine.Object.FindObjectsOfType<Transform>())
            if (t.name == name && (t.parent == null || t.parent.name == "CityRoot")) return t.gameObject;
        return null;
    }

    static GameObject LoadPrefab(string name)
    {
        var guids = AssetDatabase.FindAssets(name, new[] { "Assets/lowpoly/01_现代城市生活" });
        foreach (var g in guids)
        {
            var p = AssetDatabase.GUIDToAssetPath(g);
            if (Path.GetFileNameWithoutExtension(p) == name && p.EndsWith(".prefab"))
                return AssetDatabase.LoadAssetAtPath<GameObject>(p);
        }
        return null;
    }

    static void SitOnGround(Transform t)
    {
        var b = WorldBounds(t.gameObject);
        t.position += Vector3.up * (0f - b.min.y);
    }

    static Bounds WorldBounds(GameObject go)
    {
        var b = new Bounds(go.transform.position, Vector3.zero);
        bool any = false;
        foreach (var r in go.GetComponentsInChildren<Renderer>())
        { if (!any) { b = r.bounds; any = true; } else b.Encapsulate(r.bounds); }
        if (!any) b = new Bounds(go.transform.position, Vector3.one);
        return b;
    }

    static void HouseFrontShot(Camera cam, GameObject house, string file)
    {
        var b = WorldBounds(house);
        Vector3 c = b.center;
        float d = Mathf.Max(b.size.x, b.size.z) * 1.35f + 6f;
        Vector3 dir = new Vector3(c.x - house.transform.position.x, 0, c.z - house.transform.position.z).normalized;
        if (dir.sqrMagnitude < 0.01f) dir = Vector3.back;
        cam.transform.position = c + dir * d + Vector3.up * (b.size.y * 0.55f + 2.5f);
        cam.transform.LookAt(c + Vector3.up * b.size.y * 0.18f);
        RenderShot(cam, file);
    }

    static void Shot(Camera cam, string file, float pitchDeg, float height, Vector3 target)
    {
        float d = height / Mathf.Tan(pitchDeg * Mathf.Deg2Rad);
        cam.transform.position = target + new Vector3(0, height, -d);
        cam.transform.LookAt(target);
        RenderShot(cam, file);
    }

    static void RenderShot(Camera cam, string file)
    {
        var rt = new RenderTexture(ShotW, ShotH, 24);
        cam.targetTexture = rt;
        cam.Render();
        RenderTexture.active = rt;
        var t = new Texture2D(ShotW, ShotH, TextureFormat.RGB24, false);
        t.ReadPixels(new Rect(0, 0, ShotW, ShotH), 0, 0); t.Apply();
        File.WriteAllBytes(Path.Combine(Shots, file), t.EncodeToPNG());
        cam.targetTexture = null; RenderTexture.active = null;
        rt.Release(); UnityEngine.Object.DestroyImmediate(rt); UnityEngine.Object.DestroyImmediate(t);
        Report.Add("shot: " + file);
    }
}
