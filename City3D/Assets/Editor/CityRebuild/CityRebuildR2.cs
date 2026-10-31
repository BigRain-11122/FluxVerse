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

    // 取景刷新（main#17/main#49）：只打开已建好的 CityRebuild_R2 场景重拍判据帧，
    // 不重建、不存盘、不动资产——帧陈旧 17 天的根因是「取景只能靠整城重建」，
    // 服务于此的独立取证入口让面板取景卡可以按需刷新且不产生场景脏面。
    public static void CaptureShots()
    {
        try { RunCapture(); }
        catch (Exception e) { UnityEngine.Debug.LogError("CITY3D_SHOTS_FAIL: " + e); EditorApplication.Exit(1); }
    }

    static void RunCapture()
    {
        Directory.CreateDirectory(Shots);
        var scene = EditorSceneManager.OpenScene("Assets/Scenes/CityRebuild_R2.unity", OpenSceneMode.Single);
        var cam = Camera.main;
        if (cam == null) throw new Exception("no main camera in CityRebuild_R2 scene");
        NormalizeAmbient(); // main#60：取景面同光照（不改场景·不存盘）

        var cityGame = FindDistrict("City_GAME");
        if (cityGame == null) throw new Exception("City_GAME not found");
        var r2root = cityGame.transform.Find("R2_AD-021_District");
        if (r2root == null) throw new Exception("R2_AD-021_District not found (run BatchEntry first)");

        var houses = new List<GameObject>();
        GameObject showcase = null;
        foreach (Transform t in r2root)
        {
            if (t.name.StartsWith("R2_AD-021_SM_Bld_House_Preset_")) houses.Add(t.gameObject);
            else if (t.name == "R2_AD-021_ModularShowcase") showcase = t.gameObject;
        }
        houses.Sort((a, b) => string.CompareOrdinal(a.name, b.name));
        if (houses.Count == 0) throw new Exception("no house presets under R2_AD-021_District");
        if (showcase == null) throw new Exception("modular showcase not found");

        // r713 取景构图：原固定高度/俯角三个 Shot 的实证后果=全景截掉板块南缘、
        // 街区两帧大半是空铺装与水面（r712 面板取景卡上两帧几乎读不出内容）。
        // 改为按主体包围盒自适应取景：距离由包围球与相机视场角反解，
        // 主体无论多大都占满画面；街面帧改真·人视（低机位沿街带看）。
        // 全景框板块本体（Ground512）：框全场景会把板外路网算进去，板块被压成一小块。
        var plate = DeepFind(cityGame.transform.root, "Ground512");
        FitShot(cam, "R2_L0_overview.png", plate != null ? WorldBounds(plate.gameObject) : SceneBounds(), 0f, 52f, 1.03f);
        FitShot(cam, "R2_L1_gamedistrict.png", WorldBounds(r2root.gameObject), 18f, 30f, 1.04f);
        StreetShot(cam, r2root, "R2_L2_street.png");
        HouseFrontShot(cam, houses[0], "R2_house_front.png");
        ShowcaseShots(cam, showcase);

        var lines = new List<string> {
            "capture_only=1 scene=" + scene.path,
            "houses=" + houses.Count,
            "shots=" + Report.Count
        };
        lines.AddRange(Report); // 位姿实测（street_pose 的 facade 占比）必须落盘可审计
        File.WriteAllLines(Path.Combine(Staging, "r2-shots.md"), lines.ToArray());
        UnityEngine.Debug.Log("CITY3D_SHOTS_DONE shots=" + Report.Count);
    }

    // 搬迁预演（main#58）：把整个 R2 街区平移到 r714 算出的全干锚点，只拍三帧对比，
    // 供 main#54 决策「搬/不搬/缩」。**场景一律不存盘**——预演不得改变正典场景，
    // 迁与不迁由 main#54 定。锚点走 City3D-staging/rehearsal-anchor.txt（ASCII "x,z,tag"）。
    public static void RehearsalShots()
    {
        try { RunRehearsal(); }
        catch (Exception e) { UnityEngine.Debug.LogError("CITY3D_REHEARSAL_FAIL: " + e); EditorApplication.Exit(1); }
    }

    static void RunRehearsal()
    {
        Directory.CreateDirectory(Shots);
        var anchorFile = Path.Combine(Staging, "rehearsal-anchor.txt");
        if (!File.Exists(anchorFile)) throw new Exception("anchor file missing: " + anchorFile);
        var raw = File.ReadAllLines(anchorFile)[0].Split(',');
        var inv = System.Globalization.CultureInfo.InvariantCulture;
        float ax = float.Parse(raw[0].Trim(), inv);
        float az = float.Parse(raw[1].Trim(), inv);
        string tag = raw.Length > 2 && raw[2].Trim().Length > 0 ? raw[2].Trim().ToUpperInvariant() : "A";

        var scene = EditorSceneManager.OpenScene("Assets/Scenes/CityRebuild_R2.unity", OpenSceneMode.Single);
        var cam = Camera.main;
        if (cam == null) throw new Exception("no main camera in CityRebuild_R2 scene");
        NormalizeAmbient(); // main#60：预演帧同光照（不改场景·不存盘）
        var cityGame = FindDistrict("City_GAME");
        if (cityGame == null) throw new Exception("City_GAME not found");
        var r2root = cityGame.transform.Find("R2_AD-021_District");
        if (r2root == null) throw new Exception("R2_AD-021_District not found (run BatchEntry first)");

        Vector3 before = r2root.localPosition;
        r2root.localPosition = new Vector3(ax, before.y, az);
        Vector3 world = r2root.position;

        var plate = DeepFind(cityGame.transform.root, "Ground512");
        FitShot(cam, "R2R_" + tag + "_L0_overview.png", plate != null ? WorldBounds(plate.gameObject) : SceneBounds(), 0f, 52f, 1.03f);
        FitShot(cam, "R2R_" + tag + "_L1_gamedistrict.png", WorldBounds(r2root.gameObject), 18f, 30f, 1.04f);
        StreetShot(cam, r2root, "R2R_" + tag + "_L2_street.png");

        r2root.localPosition = before;
        var lines = new List<string> {
            "rehearsal_only=1 scene_not_saved=" + scene.path,
            "anchor_local=(" + ax.ToString("F2", inv) + "," + az.ToString("F2", inv) + ") tag=" + tag,
            "anchor_world=(" + world.x.ToString("F1", inv) + "," + world.z.ToString("F1", inv) + ")",
            "shots=" + Report.Count
        };
        File.WriteAllLines(Path.Combine(Staging, "r2-rehearsal-" + tag + ".md"), lines.ToArray());
        UnityEngine.Debug.Log("CITY3D_REHEARSAL_DONE shots=" + Report.Count + " tag=" + tag);
    }

    // ===== 街区落位锚点（main#54）=====
    static readonly Vector3 DistrictAnchorFallback = new Vector3(0.3f, 0f, 83.2f);
    static string AnchorSource = "fallback";

    // 读 City3D-staging/rehearsal-anchor.txt（首行 "x,z[,tag]"）→ 街区局部落位；
    // 缺档/解析失败一律回落常量（fail-soft：重建不该被一份可选的决策记录拖死）。
    static Vector3 ResolveDistrictAnchor()
    {
        var f = Path.Combine(Staging, "rehearsal-anchor.txt");
        try
        {
            if (File.Exists(f))
            {
                var raw = File.ReadAllLines(f);
                if (raw.Length > 0 && raw[0].Trim().Length > 0)
                {
                    var parts = raw[0].Split(',');
                    var inv = System.Globalization.CultureInfo.InvariantCulture;
                    float x = float.Parse(parts[0].Trim(), inv);
                    float z = float.Parse(parts[1].Trim(), inv);
                    AnchorSource = "anchor:" + (parts.Length > 2 && parts[2].Trim().Length > 0 ? parts[2].Trim().ToUpperInvariant() : "?");
                    return new Vector3(x, 0f, z);
                }
            }
        }
        catch (Exception e) { UnityEngine.Debug.LogWarning("anchor read failed, using fallback: " + e.Message); }
        AnchorSource = "fallback";
        return DistrictAnchorFallback;
    }

    static string F(float v) { return v.ToString("F2", System.Globalization.CultureInfo.InvariantCulture); }

    // ===== 环境光基线（main#60 归因修复）=====
    // 病灶：URP 下 RenderSettings.ambientMode=Skybox 只有在 ambient probe 生成过才有值；批处理构建
    // 从不跑 DynamicGI.UpdateEnvironment()，探针保持全零 → 所有「背光面」只剩直射光 = 纯黑（实测像素
    // (0,0,0)），街面帧右近房朝街那面因此整块黑墙（r713 首帧同病）。
    // 正法：显式给三色半球环境光（天光/地平/地面反弹，色取自本场景实测天空 #90CDEA 与铺装 #A69B7D）
    // 再刷一次探针——物理语义是真实日光下天空与地面的间接光，不是加泛光遮丑。
    static void NormalizeAmbient()
    {
        RenderSettings.ambientMode = UnityEngine.Rendering.AmbientMode.Trilight;
        RenderSettings.ambientSkyColor = new Color(0.34f, 0.46f, 0.55f);
        RenderSettings.ambientEquatorColor = new Color(0.28f, 0.29f, 0.28f);
        RenderSettings.ambientGroundColor = new Color(0.22f, 0.20f, 0.16f);
        RenderSettings.ambientIntensity = 1f;
        try { DynamicGI.UpdateEnvironment(); }
        catch (Exception e) { UnityEngine.Debug.LogWarning("AMBIENT probe update failed: " + e.Message); }
        Report.Add("ambient: mode=Trilight sky=(0.34,0.46,0.55) equator=(0.28,0.29,0.28) ground=(0.22,0.20,0.16) intensity=1"
            + "（背光面纯黑根治=补 ambient probe·main#60）");
        UnityEngine.Debug.Log("AMBIENT OK mode=Trilight");
    }

    static void Run()
    {
        var sw = Stopwatch.StartNew();
        Directory.CreateDirectory(Shots);
        var scene = EditorSceneManager.OpenScene("Assets/Scenes/CityWhitebox.unity", OpenSceneMode.Single);
        var cam = Camera.main;
        if (cam == null) throw new Exception("no main camera in CityWhitebox scene");
        NormalizeAmbient(); // main#60：环境光基线随场景存盘（重建后判据帧与导入引擎同一光照）

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

        // main#54 落位：原落点（局部原点）正好压在湖面——r714 实测街区 84.7x70.7 m 压水 91.7%，
        // 最近全干锚点=城市局部 (0.3, 83.2)（r718 预演出对照图后定谳「搬」）。
        // 锚点正典=City3D-staging/rehearsal-anchor.txt（ASCII "x,z,tag"）——与预演共用一份，
        // 换锚点（A2/A3）只改这份文件再重建；缺档/不可解析回落内置常量并如实记 source。
        var anchor = ResolveDistrictAnchor();
        r2root.transform.localPosition = new Vector3(anchor.x, 0f, anchor.z);
        Report.Add("district_anchor_local=(" + F(anchor.x) + "," + F(anchor.z) + ") source=" + AnchorSource
            + "（原落点压水 91.7%·main#54 搬离湖面）");

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

        // ④b2 底板道具让位路带（main#65）：行道树压在路带中线上，街面帧灭点被树挡死。
        // 树属白盒底板（CityWhitebox 正典不动、且无碰撞体→机位筛选的物理射线看不见它），
        // 所以在已建 R2 场景里按几何把侵入路带的道具推出去，逐件点名记进报告。
        Report.Add(ClearRoadBand(r2root.transform, street));

        // ④c 展示房净位（main#64）：r723 量到它压在 P07 宅基台上 0.55 m、另一侧 0.36 m，
        // 两块台面顶同为 0.055+0.05 → 共面 z-fighting。宅基台 16.27 m 深、门面缝只有 7.31 m，
        // 装不下 7.5×5.0 的展示房，故不再写死坐标：按本期宅基台/路带实况解位——
        // 在「宅基台前缘 ↔ 路带」的空带里取与最大门面缝对齐的落位，朝向路带，
        // 与所有宅基台/路带矩形分离 ≥ 1.0 m（零重叠由几何算出，不靠人眼）。
        Vector3 slotPos; float slotYaw; string slotReport;
        FindShowcaseSlot(r2root.transform, showcase, out slotPos, out slotYaw, out slotReport);
        showcase.transform.localPosition = slotPos;
        showcase.transform.localRotation = Quaternion.Euler(0f, slotYaw, 0f);
        SitOnGround(showcase.transform);
        Report.Add(slotReport);

        // 展示房自己也给一块基台（同宅基台工艺·0.055 底 0.05 厚 → 顶面 0.08 与宅基台齐）
        var sBow = WorldBounds(showcase);
        var sPad = GameObject.CreatePrimitive(PrimitiveType.Cube);
        sPad.name = "R2_AD-021_ShowcasePad";
        sPad.transform.SetParent(r2root.transform, false);
        Vector3 sLp = r2root.transform.InverseTransformPoint(new Vector3(sBow.center.x, 0, sBow.center.z));
        sPad.transform.localPosition = new Vector3(sLp.x, 0.055f, sLp.z);
        sPad.transform.localScale = new Vector3(sBow.size.x + 2.4f, 0.05f, sBow.size.z + 2.4f);
        sPad.GetComponent<Renderer>().sharedMaterial = lotMat;

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

    // ===== 展示房净位解算（main#64）=====
    // 只读本期已摆好的宅基台 + 路带：不写死坐标，行距/门面重排（main#61 A2）落地后
    // 同一段代码自动改解位，避免「搬一次写死一次坐标」的返工。
    struct Rect2 { public float x0, z0, x1, z1; }

    static Rect2 Rect2Of(Bounds b)
    {
        return new Rect2 { x0 = b.min.x, z0 = b.min.z, x1 = b.max.x, z1 = b.max.z };
    }

    // 轴对齐矩形分离距：任一轴分离即取该轴间隙；两轴都相交=重叠返 0。
    static float Rect2Separation(Rect2 a, Rect2 b)
    {
        float dx = Mathf.Max(a.x0 - b.x1, b.x0 - a.x1);
        float dz = Mathf.Max(a.z0 - b.z1, b.z0 - a.z1);
        if (dx <= 0f && dz <= 0f) return 0f;
        return Mathf.Max(dx, dz);
    }

    static void FindShowcaseSlot(Transform root, GameObject showcase,
                                 out Vector3 localPos, out float yaw, out string report)
    {
        const float CLEAR = 1.0f;
        var sb = WorldBounds(showcase);
        float w = sb.size.x, d = sb.size.z;

        var pads = new List<Bounds>();
        Bounds? streetB = null;
        foreach (Transform t in root)
        {
            var r = t.GetComponent<Renderer>();
            if (r == null) continue;
            if (t.name.StartsWith("R2_AD-021_Lot_")) pads.Add(r.bounds);
            else if (t.name == "R2_AD-021_Street") streetB = r.bounds;
        }
        if (pads.Count < 4 || streetB == null) throw new Exception("showcase slot: pads/street missing");
        var street = streetB.Value;

        var rows = new List<List<Bounds>>();
        foreach (var pb in pads.OrderBy(q => q.center.z))
        {
            if (rows.Count == 0 || Mathf.Abs(pb.center.z - rows[rows.Count - 1][0].center.z) > 2f)
                rows.Add(new List<Bounds>());
            rows[rows.Count - 1].Add(pb);
        }

        Rect2 best = new Rect2(); float bestClear = -1f; float bestYaw = 0f; float bestGap = 0f;
        foreach (var row in rows)
        {
            var xs = row.OrderBy(p => p.center.x).ToList();
            // 本排最大门面缝（相邻宅基台之间的净距）中心
            var gapCx = new List<float>();
            var gapW = new List<float>();
            for (int i = 1; i < xs.Count; i++)
            {
                float gw = xs[i].min.x - xs[i - 1].max.x;
                if (gw <= 0f) continue;
                gapCx.Add((xs[i - 1].max.x + xs[i].min.x) * 0.5f);
                gapW.Add(gw);
            }
            gapCx.Add((float)row.Average(p => (double)p.center.x)); // 排中心兜底
            gapW.Add(0f);

            bool northOfStreet = row[0].center.z < street.center.z;
            float padEdge = northOfStreet ? row.Max(p => p.max.z) : row.Min(p => p.min.z);
            float streetEdge = northOfStreet ? street.min.z : street.max.z;
            float yawHere = northOfStreet ? 180f : 0f; // 门洞在模块局部 −Z（BuildShowcase 前侧），转过来朝路带
            float lo = Mathf.Min(padEdge, streetEdge) + d * 0.5f + CLEAR;
            float hi = Mathf.Max(padEdge, streetEdge) - d * 0.5f - CLEAR;
            if (hi < lo) { float mid = (padEdge + streetEdge) * 0.5f; lo = hi = mid; }

            for (int i = 0; i < gapCx.Count; i++)
            {
                float cx = gapCx[i];
                float[] zs = { (lo + hi) * 0.5f, lo, hi };
                foreach (var cz in zs)
                {
                    var cand = new Rect2 { x0 = cx - w * 0.5f, x1 = cx + w * 0.5f, z0 = cz - d * 0.5f, z1 = cz + d * 0.5f };
                    float clear = Rect2Separation(cand, Rect2Of(street));
                    foreach (var p in pads)
                        clear = Mathf.Min(clear, Rect2Separation(cand, Rect2Of(p)));
                    if (clear > bestClear + 0.001f)
                    {
                        bestClear = clear; best = cand; bestYaw = yawHere;
                        bestGap = (i < gapW.Count - 1) ? gapW[i] : 0f;
                    }
                }
            }
        }

        if (bestClear <= 0f)
        {
            // 真解不出来才退回旧位，并大声记一笔（禁静默将就）
            localPos = new Vector3(0f, 0f, 26f);
            yaw = 180f;
            report = "showcase_slot: NO_SLOT（宅基台/路带之间无 ≥1.0 m 净位·退回旧位 0,26）";
            return;
        }

        float wx = (best.x0 + best.x1) * 0.5f, wz = (best.z0 + best.z1) * 0.5f;
        localPos = root.InverseTransformPoint(new Vector3(wx, 0f, wz));
        yaw = bestYaw;
        var inv = System.Globalization.CultureInfo.InvariantCulture;
        report = "showcase_slot: footprint=" + w.ToString("F1", inv) + "x" + d.ToString("F1", inv)
            + "m clear=" + bestClear.ToString("F2", inv) + "m"
            + " gap=" + bestGap.ToString("F2", inv) + "m"
            + " world=(" + wx.ToString("F1", inv) + "," + wz.ToString("F1", inv) + ")"
            + " yaw=" + bestYaw.ToString("F0", inv)
            + "（宅基台/路带矩形分离·重叠=0 由几何解出）";
    }

    // ===== 底板道具让位路带（main#65）=====
    // 病灶（r724 街面帧）：底板行道树立在路带中线上，两根绿色胶囊压在街心挡住灭点。
    // 道具属白盒底板，不归 R2 街区，且没有碰撞体——街面机位筛选用 Physics 射线判遮挡，
    // 对它们一直报 blocked=0，所以「机位解得出好构图」这件事从来没管过树。
    // 正法不碰底板正典（CityWhitebox.unity 原样保留）：在已建 R2 场景里把与路带
    // 相交的道具沿 z 推出去——优先短距离且落位不与其它道具/街区件相撞；解不出净位
    // 也必须让路并标 NO_CLEAR（路带通行优先于道具原位）。数量与位移逐件落报告。
    const float PropMaxSpan = 10f;   // 超过这个跨度是图层/建筑，不是街具
    const float PropClear = 1.0f;    // 道具与路带边缘的最小净距

    static string ClearRoadBand(Transform root, GameObject street)
    {
        var band = Rect2Of(WorldBounds(street));
        var inv = System.Globalization.CultureInfo.InvariantCulture;

        var props = new List<GameObject>();
        var propBounds = new Dictionary<GameObject, Bounds>();
        foreach (var r in UnityEngine.Object.FindObjectsOfType<MeshRenderer>(true))
        {
            var go = r.gameObject;
            if (go.transform.IsChildOf(root)) continue;
            if (propBounds.ContainsKey(go)) continue;
            var b = r.bounds;
            if (b.size.x <= 0.001f || b.size.z <= 0.001f) continue;
            if (b.size.x > PropMaxSpan || b.size.z > PropMaxSpan) continue;
            props.Add(go);
            propBounds[go] = WorldBounds(go);
        }

        // 只要侵入路带的那些；父子同族时只算最外层（避免同一棵树被搬两次）
        var moving = props
            .Where(p => Rect2Separation(Rect2Of(propBounds[p]), band) < PropClear)
            .Where(p => !props.Any(q => q != p && p.transform.IsChildOf(q.transform)))
            .ToList();
        if (moving.Count == 0)
            return "road_props: cleared=0（底板道具无一侵入路带·main#65 修面）";

        var obstacles = new List<Rect2>();
        foreach (Transform t in root)
        {
            var rr = t.GetComponent<Renderer>();
            if (rr != null) obstacles.Add(Rect2Of(rr.bounds));
        }

        var lines = new List<string>();
        foreach (var go in moving)
        {
            var b = propBounds[go];
            float up = band.z1 + PropClear - b.min.z;      // 往 +z 推
            float down = band.z0 - PropClear - b.max.z;    // 往 -z 推（负值）
            float pick = 0f;
            var tries = new[] { up, down, up + 1.5f, down - 1.5f, up + 3f, down - 3f };
            foreach (var dz in tries)
            {
                var movedB = propBounds[go];
                movedB.center += new Vector3(0f, 0f, dz);
                var rect = Rect2Of(movedB);
                if (Rect2Separation(rect, band) < PropClear * 0.99f) continue;
                bool clash = false;
                foreach (var o in obstacles)
                    if (Rect2Separation(rect, o) < PropClear) { clash = true; break; }
                if (!clash)
                    foreach (var other in props)
                    {
                        if (other == go) continue;
                        if (other.transform.IsChildOf(go.transform)) continue;
                        if (Rect2Separation(rect, Rect2Of(propBounds[other])) < PropClear) { clash = true; break; }
                    }
                if (clash) continue;
                pick = dz;
                break;
            }
            if (Mathf.Abs(pick) < 0.001f)
            {
                pick = Mathf.Abs(up) <= Mathf.Abs(down) ? up : down;
                lines.Add(go.name + "(" + pick.ToString("F2", inv) + "m,NO_CLEAR)");
            }
            else lines.Add(go.name + (pick >= 0f ? "+" : "") + pick.ToString("F2", inv) + "m");
            go.transform.position += Vector3.forward * pick;
            var after = propBounds[go];
            after.center += new Vector3(0f, 0f, pick);
            propBounds[go] = after;
        }
        return "road_props: cleared=" + moving.Count + "/" + props.Count
            + " band_z=[" + F(band.z0) + ".." + F(band.z1) + "] moves=" + string.Join(" ", lines.ToArray())
            + "（底板道具不入路带·main#65）";
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
        // 解剖房前脸（门洞可见）——r726 勘正：门洞墙在模块局部 −Z（BuildShowcase 前侧），
        // 相机若挂在 +forward 上拍到的一直是后墙（r713~r725 全部 showcase 帧都是空墙），
        // 故取 −forward 一侧=真·前脸。
        Vector3 front = showcase.transform.position - showcase.transform.forward * (b.size.z * 0.5f + 9f)
            + showcase.transform.right * (b.size.x * 0.45f) + Vector3.up * 4.2f;
        cam.transform.position = front;
        cam.transform.LookAt(c + Vector3.up * 1.5f);
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

    // 深查找（r713）：取景要按名字锁定板块地面件（Ground512）。
    static Transform DeepFind(Transform t, string name)
    {
        if (t.name == name) return t;
        for (int i = 0; i < t.childCount; i++)
        {
            var r = DeepFind(t.GetChild(i), name);
            if (r != null) return r;
        }
        return null;
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

    // 全场景包围盒（r713）：全景帧要的是「整个板块」，此前硬编码 height/pitch
    // 与板块真实尺寸无关——板块一放大就截边，缩小就留一堆空场。
    static Bounds SceneBounds()
    {
        Bounds b = new Bounds(Vector3.zero, Vector3.zero);
        bool any = false;
        foreach (var root in UnityEngine.SceneManagement.SceneManager.GetActiveScene().GetRootGameObjects())
            foreach (var r in root.GetComponentsInChildren<Renderer>(true))
            {
                if (r.GetComponent<Camera>() != null) continue;
                if (!any) { b = r.bounds; any = true; } else b.Encapsulate(r.bounds);
            }
        if (!any) b = new Bounds(Vector3.zero, Vector3.one * 100f);
        return b;
    }

    // 自适应取景（r713）：距离由包围球半径与相机视场角反解（取横竖较窄一轴为准），
    // 保证主体任何尺寸都铺满画面且不裁切。yaw/pitch 只决定看的角度，不再决定远近。
    static void FitShot(Camera cam, string file, Bounds b, float yawDeg, float pitchDeg, float margin)
    {
        // 包围球拟合对平板太保守（512x512 地面的球半径 362，案子拍出来只占半屏），
        // 改为把 8 个角点投影到相机三轴反解最小距离——平铺件也能贴边不裁。
        Vector3 dir = Quaternion.Euler(pitchDeg, yawDeg, 0f) * Vector3.forward; // 相机->主体
        Quaternion rot = Quaternion.LookRotation(dir, Vector3.up);
        Vector3 right = rot * Vector3.right, up = rot * Vector3.up;
        float aspect = (float)ShotW / ShotH;
        float vHalf = cam.fieldOfView * 0.5f * Mathf.Deg2Rad;
        float hHalf = Mathf.Atan(Mathf.Tan(vHalf) * aspect);
        float dist = 0f, halfH = 0.5f, halfW = 0.5f;
        for (int i = 0; i < 8; i++)
        {
            Vector3 p = Vector3.Scale(b.extents, new Vector3(
                (i & 1) == 0 ? -1f : 1f, (i & 2) == 0 ? -1f : 1f, (i & 4) == 0 ? -1f : 1f));
            float along = Vector3.Dot(p, dir);
            float pr = Mathf.Abs(Vector3.Dot(p, right));
            float pu = Mathf.Abs(Vector3.Dot(p, up));
            dist = Mathf.Max(dist, along + pr / Mathf.Tan(hHalf), along + pu / Mathf.Tan(vHalf));
            halfW = Mathf.Max(halfW, pr);
            halfH = Mathf.Max(halfH, pu);
        }
        dist = Mathf.Max(dist * margin, 1f);
        if (cam.orthographic)
        {
            cam.orthographicSize = halfH * margin;
            dist = halfW * 3f + 10f;
        }
        else
        {
            cam.farClipPlane = Mathf.Max(cam.farClipPlane, dist + b.size.magnitude * 3f);
            cam.nearClipPlane = Mathf.Min(cam.nearClipPlane, Mathf.Max(0.05f, dist * 0.01f));
        }
        cam.transform.position = b.center - dir * dist;
        cam.transform.LookAt(b.center);
        RenderShot(cam, file);
    }

    // 街面人视（r724·main#62）：r713 的机位虽然降到了低角度，但眼睛仍在 4 m 以上
    // （target 抬 1.4-3.2 m 再 +2.9 m），拍出来大半是铺装、房子只剩右缘——读不出「走在街上」。
    // 判据（main#62）＝眼高 1.6-1.8 m · 沿街轴向取景 · 画面里至少一栋房立面占 1/4 宽。
    // 做法＝不再硬编码一对眼睛位置：沿街轴扫一小片位姿（三个纵向站位 × 五个横移 × 0-60 度偏角），
    // 用相机投影实测每栋房包围盒的可见横向占比，取「达标且最贴近街轴」的那个位姿；
    // 全扫不达标＝取最优位姿并如实记 note（说明是街区进深问题，不靠改 FOV 凑数）。
    static void StreetShot(Camera cam, Transform root, string file)
    {
        const float eyeH = 1.7f;          // 站立眼高
        const float targetFrac = 0.25f;   // 至少一栋立面占画面 1/4 宽
        var b = WorldBounds(root.gameObject);
        float groundY = b.min.y;
        float streetZ = root.position.z;  // 路带 local z=0 → 街心线

        var houses = new List<GameObject>();
        foreach (Transform t in root)
            if (t.name.StartsWith("R2_AD-021_SM_Bld_House_Preset_")) houses.Add(t.gameObject);
        if (houses.Count == 0) throw new Exception("street shot: no house presets under " + root.name);

        float keepFov = cam.fieldOfView;  // 不改视场角（禁拿 FOV 凑数）

        float bestScore = float.NegativeInfinity, bestFrac = 0f, bestYaw = 0f, bestLat = 0f, bestX = 0f;
        bool bestBlocked = false;
        float[] xs = { b.min.x + 1.5f, Mathf.Lerp(b.min.x, b.max.x, 0.25f), b.center.x, Mathf.Lerp(b.min.x, b.max.x, 0.75f) };
        float[] lats = { 0f, -1.2f, 1.2f, -2.2f, 2.2f, -3f, 3f };
        foreach (float cx in xs)
            foreach (float lat in lats)
                for (int step = 0; step <= 75; step++)
                    for (int sign = -1; sign <= 1; sign += 2)
                    {
                        if (step == 0 && sign > 0) continue; // 0 度只算一次
                        float yawOff = step * sign;
                        Vector3 dir = Quaternion.Euler(-1.5f, 90f + yawOff, 0f) * Vector3.forward;
                        cam.transform.position = new Vector3(cx, groundY + eyeH, streetZ + lat);
                        cam.transform.rotation = Quaternion.LookRotation(dir, Vector3.up);
                        GameObject best;
                        float f = MaxFacadeFrac(cam, houses, out best);
                        bool blocked = best != null && IsBlocked(cam.transform.position, best);
                        // 达标者按「偏角越小越好」排序；被挡/不达标一律降级（先不挡，再比占比）
                        float score = f >= targetFrac ? 1000f - Mathf.Abs(yawOff) : f;
                        if (blocked) score *= 0.5f;
                        if (score > bestScore)
                        {
                            bestScore = score; bestFrac = f; bestYaw = yawOff; bestLat = lat; bestX = cx;
                            bestBlocked = blocked;
                        }
                    }

        Vector3 bestDir = Quaternion.Euler(-1.5f, 90f + bestYaw, 0f) * Vector3.forward;
        cam.fieldOfView = keepFov;
        cam.transform.position = new Vector3(bestX, groundY + eyeH, streetZ + bestLat);
        cam.transform.rotation = Quaternion.LookRotation(bestDir, Vector3.up);
        cam.farClipPlane = Mathf.Max(cam.farClipPlane, b.size.magnitude * 4f);
        RenderShot(cam, file);

        var inv = System.Globalization.CultureInfo.InvariantCulture;
        Report.Add("street_pose: eye=" + eyeH.ToString("F1", inv) + "m yaw_off=" + bestYaw.ToString("F1", inv)
            + " lat=" + bestLat.ToString("F1", inv) + " x=" + bestX.ToString("F1", inv)
            + " facade=" + bestFrac.ToString("F3", inv)
            + " blocked=" + (bestBlocked ? "1" : "0")
            + (bestFrac >= targetFrac ? " ok" : " BELOW_TARGET"));
    }

    // 视线遮挡：从相机往这栋房可见面中心打一条射线，命中「别的东西的渲染体」=看不清立
    // （r724 实测：底板行道树正立在路带中线上，不排除的话最优位姿会选一张被树挡死的图）
    static bool IsBlocked(Vector3 from, GameObject house)
    {
        var hb = WorldBounds(house);
        Vector3 aim = new Vector3(hb.center.x, Mathf.Lerp(hb.min.y, hb.max.y, 0.55f), hb.center.z);
        Vector3 d = aim - from;
        float dist = d.magnitude;
        if (dist < 1f) return false;
        foreach (var hit in Physics.RaycastAll(from, d / dist, dist * 0.97f))
        {
            if (hit.collider == null) continue;
            var t = hit.collider.transform;
            if (t == house.transform || t.IsChildOf(house.transform)) continue;
            if (hit.collider.GetComponent<MeshRenderer>() == null) continue;
            return true;
        }
        return false;
    }

    // 单栋房包围盒在视口里的可见横向占比（八角投影取 x 跨度；完全出框/在相机后方=0）
    static float MaxFacadeFrac(Camera cam, List<GameObject> houses, out GameObject widest)
    {
        widest = null;
        float best = 0f;
        foreach (var h in houses)
        {
            var hb = WorldBounds(h);
            float minX = 2f, maxX = -1f;
            bool inFront = true, inFrameY = false;
            for (int i = 0; i < 8; i++)
            {
                Vector3 p = hb.center + Vector3.Scale(hb.extents, new Vector3(
                    (i & 1) == 0 ? -1f : 1f, (i & 2) == 0 ? -1f : 1f, (i & 4) == 0 ? -1f : 1f));
                Vector3 v = cam.WorldToViewportPoint(p);
                if (v.z <= 0.05f) { inFront = false; break; }
                minX = Mathf.Min(minX, v.x); maxX = Mathf.Max(maxX, v.x);
                if (v.y > -0.1f && v.y < 1.1f) inFrameY = true;
            }
            if (!inFront || !inFrameY) continue;
            float frac = Mathf.Clamp01(maxX) - Mathf.Clamp01(minX);
            if (frac > best) { best = frac; widest = h; }
        }
        return best;
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
