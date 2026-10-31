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
        // main#66（A2 行距）：行距 52 → 29 m。r723 实测前场 13.6–20.2 m 把街拉成广场
        // （房体进深只占 18.8 m + 6 m 路带 = 24.8 m，余下 27.2 m 是空院），
        // 缩行距后前场 2.1–8.7 m、街区进深 70.8 → 47.8 m，资产与排布/朝向零改动。
        float[] gx = { -33f, -11f, 11f, 33f };
        float[] gz = { -14.5f, 14.5f };
        var houses = new List<GameObject>();
        int idx = 0;
        foreach (var nm in presetNames)
        {
            var pf = LoadPrefab(nm);
            if (pf == null) throw new Exception("prefab missing: " + nm);
            var go = (GameObject)PrefabUtility.InstantiatePrefab(pf);
            go.name = "R2_AD-021_" + nm;
            go.transform.SetParent(r2root.transform, false);
            int row = idx / 4, col = idx % 4; idx++;
            go.transform.localPosition = new Vector3(gx[col], 0, gz[row]);
            go.transform.localRotation = Quaternion.Euler(0, gz[row] > 0 ? 180f : 0f, 0f);
            SitOnGround(go.transform);
            houses.Add(go);
        }
        Report.Add("houses=" + houses.Count + "（AD-021 官方 Preset 01-08·4x2·门朝城心·行距 29 m/main#66 A2）");

        // ② 模块解剖房（走进建筑真证·无顶剖面展示位=前排中缺）
        var showcase = BuildShowcase(r2root.transform, new Vector3(0f, 0f, 14.5f)); // 行距 29 m 后与北排对齐（位姿由 FindShowcaseSlot 实况解）

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

        // ④b3 底板道具碰撞面（main#68）：机位遮挡判据问的是 Physics，而底板道具一个碰撞体都没有，
        // 于是同一批件在「路带几何普查」里数得清、在「机位遮挡」里永远看不见。
        // 不碰底板正典（CityWhitebox 原样保留）：在已建 R2 场景里给每件道具补一条世界轴对齐盒，
        // 幂等（已有碰撞面即跳过），逐件用 collider.bounds 对渲染包围盒复核后落报告。
        Report.Add(AddPropColliders(r2root.transform));

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

        // ④d 街面行道树与街具（main#72）：近树列=要（判断与判据见 DressStreet 头注）——
        // 底板占位胶囊在本场景隐身，换 ithappy Megacity 真树与路灯；底板正典零触碰。
        Report.Add(DressStreet(r2root.transform, street));

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

        // main#67：Synty 墙/地模块的 pivot 在 AABB 角落（非中心），旧代码按「中心」写 pos，
        // 整圈墙与地板因此系统性外偏 L/2（WorldBounds 量到 9.0x7.5 对 7.5x5.0，楼梯只是最显眼那截）。
        // 改为「先摆后按实测 AABB 对齐格位」：位置全由几何解出，pivot 在哪都不猜。
        float straightYaw = mStraight.RunAlongX ? 0f : 90f;
        // 前侧（-Z）：中段换门洞墙·厚度朝室内 +z
        for (int i = 0; i < nX; i++)
        {
            bool isDoor = (nX >= 3) ? (i == nX / 2) : (i == 0);
            var pf = isDoor ? doorWall : straight;
            var w = Place(root.transform, pf, "Wall" + (isDoor ? "Door" : "Front") + i, Vector3.zero, 0f, straightYaw);
            AlignRect(w, -halfX + L * i, -halfZ, false, false);
        }
        for (int i = 0; i < nX; i++)
        {
            var w = Place(root.transform, straight, "WallBack" + i, Vector3.zero, 0f, straightYaw);
            AlignRect(w, -halfX + L * i, halfZ, false, true); // 厚度朝室内 −z
        }
        for (int i = 0; i < nZ; i++) // 侧墙 nZ 段（前后墙端点咬合·零重叠）
        {
            var wl = Place(root.transform, straight, "WallL" + i, Vector3.zero, 0f, straightYaw + 90f);
            AlignRect(wl, -halfX, -halfZ + L * i, false, false); // 左墙厚度朝 +x
            var wr = Place(root.transform, straight, "WallR" + i, Vector3.zero, 0f, straightYaw + 90f);
            AlignRect(wr, halfX, -halfZ + L * i, true, false);   // 右墙厚度朝 −x
        }
        // 角柱×4（0.24m 装饰柱·角点内侧贴齐）
        AlignRect(Place(root.transform, corner, "CornerFN", Vector3.zero, 0f, 0f), -halfX, -halfZ, false, false);
        AlignRect(Place(root.transform, corner, "CornerFS", Vector3.zero, 0f, 90f), halfX, -halfZ, true, false);
        AlignRect(Place(root.transform, corner, "CornerBS", Vector3.zero, 0f, 180f), halfX, halfZ, true, true);
        AlignRect(Place(root.transform, corner, "CornerBN", Vector3.zero, 0f, 270f), -halfX, halfZ, false, true);

        // 室内地板（格位逐块对齐）
        int fX = Math.Max(1, (int)Mathf.Ceil((nX * L) / Math.Max(0.5f, mFloor.sx)));
        int fZ = Math.Max(1, (int)Mathf.Ceil((nZ * L) / Math.Max(0.5f, mFloor.sz)));
        for (int a = 0; a < fX; a++)
            for (int b = 0; b < fZ; b++)
            {
                var fl = Place(root.transform, floor, "Floor" + a + "_" + b, new Vector3(0f, 0.01f, 0f), 0f, 0f);
                AlignRect(fl, -halfX + mFloor.sx * a, -halfZ + mFloor.sz * b, false, false);
            }

        // 楼梯（后角）+内墙（中隔）
        // main#67：此前按 (halfX-1.2, halfZ-1.4) 的经验偏移摆楼梯，但该 prefab 的 pivot
        // 不在 AABB 中心，一段台阶挂到墙外（WorldBounds 量到 9.1x8.8 对 7.5x5.0）。
        // 改为「实测 AABB + 收进围合体内壁」：位置由几何解算，pivot 在哪都不猜。
        if (stairs != null)
        {
            var mStairs = MeasureRun(stairs);
            Report.Add($"showcase_stairs: prefab {mStairs.sx:F2}x{mStairs.sz:F2}xH{mStairs.h:F2}m（AABB 实测·pivot 偏移不靠猜）");
            var st = Place(root.transform, stairs, "Stairs", new Vector3(halfX - 1.2f, 0.01f, halfZ - 1.4f), 0f, 180f, 0f);
            FitInsideWalls(st, halfX, halfZ, 0.14f);
        }
        if (iwall != null)
        {
            var miw = MeasureRun(iwall);
            var iw = Place(root.transform, iwall, "InteriorWall", Vector3.zero, 0f, miw.RunAlongX ? 0f : 90f);
            AlignRect(iw, -miw.Run * 0.5f, halfZ - L * 0.5f, false, false); // 横隔墙·厚度朝室内
        }

        // 室内点灯（治剖面死黑·暖光读出室内）
        var lgo = new GameObject("R2_AD-021_InteriorLight");
        lgo.transform.SetParent(root.transform, false);
        lgo.transform.localPosition = new Vector3(0f, 2.6f, 0f);
        var lt = lgo.AddComponent<Light>();
        lt.type = LightType.Point; lt.range = 7f; lt.intensity = 0.9f; lt.color = new Color32(0xFF, 0xD9, 0x9E, 255);

        SitOnGround(root.transform);
        // main#67 机检行：拼装体整体 AABB 必须贴住名义 footprint——任何附属件（楼梯等）
        // 伸出围合体即在此翻 FAIL，不必等到取景帧肉眼发现。
        var lb = LocalRect(root.transform, root);
        float overX = Mathf.Max(0f, Mathf.Max(-halfX - lb.x0, lb.x1 - halfX));
        float overZ = Mathf.Max(0f, Mathf.Max(-halfZ - lb.z0, lb.z1 - halfZ));
        Report.Add($"showcase_bounds: {lb.x1 - lb.x0:F2}x{lb.z1 - lb.z0:F2}m vs nominal {nX * L:F1}x{nZ * L:F1}m over=({overX:F2},{overZ:F2})m {(overX <= 0.6f && overZ <= 0.6f ? "PASS" : "FAIL")}（判据 ≤0.6m·main#67）");
        if (overX > 0.6f || overZ > 0.6f)
            foreach (Transform ct in root.transform)
            {
                var cr = LocalRect(root.transform, ct.gameObject);
                float ox = Mathf.Max(0f, Mathf.Max(-halfX - cr.x0, cr.x1 - halfX));
                float oz = Mathf.Max(0f, Mathf.Max(-halfZ - cr.z0, cr.z1 - halfZ));
                if (ox > 0.05f || oz > 0.05f)
                    Report.Add($"showcase_over_child: {ct.name} rect x[{cr.x0:F2}..{cr.x1:F2}] z[{cr.z0:F2}..{cr.z1:F2}] over=({ox:F2},{oz:F2})");
            }
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

            // 行距 29 m（main#66 A2）后院落只剩 ~3.4 m 深，塞不下 8.8 m 进深的展示房——
            // 增加「排内门面缝」候选：与同排宅基台同 z 轴落位（门仍朝路带），
            // 缝宽由几何判据把关（与所有宅基台/路带分离 ≥ CLEAR）。
            float rowCz = (float)row.Average(p => (double)p.center.z);
            for (int i = 0; i < gapCx.Count; i++)
            {
                float cx = gapCx[i];
                float[] zs = { (lo + hi) * 0.5f, lo, hi, rowCz };
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
            localPos = new Vector3(0f, 0f, 14.5f);
            yaw = 180f;
            report = "showcase_slot: NO_SLOT（宅基台/路带之间无 ≥1.0 m 净位·退回旧位 0,14.5）";
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
        var seen = new HashSet<GameObject>();
        foreach (var r in UnityEngine.Object.FindObjectsOfType<MeshRenderer>(true))
        {
            var go = r.gameObject;
            if (!seen.Add(go)) continue;                       // 多材质件只算一件
            if (!IsPropMesh(go, r.bounds, root)) continue;      // 判据与 PropUniverse 同源（main#68）
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

    // ===== 底板道具集合与碰撞面（main#68）=====
    // 判据单点：路带让位（main#65）与碰撞面补齐（main#68）必须看同一批件，
    // 否则「普查说 0」与「射线永远看不见」继续各说各话。
    static bool IsPropMesh(GameObject go, Bounds b, Transform root)
    {
        if (go == null) return false;
        if (go.transform.IsChildOf(root)) return false;
        if (b.size.x <= 0.001f || b.size.z <= 0.001f) return false;
        if (b.size.x > PropMaxSpan || b.size.z > PropMaxSpan) return false;
        return true;
    }

    // 底板道具全集（每件一条：GO + 世界包围盒），判据只此一处。
    static List<KeyValuePair<GameObject, Bounds>> PropUniverse(Transform root)
    {
        var list = new List<KeyValuePair<GameObject, Bounds>>();
        var seen = new HashSet<GameObject>();
        foreach (var r in UnityEngine.Object.FindObjectsOfType<MeshRenderer>(true))
        {
            var go = r.gameObject;
            if (!seen.Add(go)) continue;
            if (!IsPropMesh(go, r.bounds, root)) continue;
            list.Add(new KeyValuePair<GameObject, Bounds>(go, WorldBounds(go)));
        }
        return list;
    }

    // 给每件底板道具补一条碰撞盒：挂在道具下的无渲染子件，世界轴对齐、尺寸＝渲染包围盒，
    // 因此不依赖 pivot 在哪也不受父级旋转影响（父级非等比缩放用倒数抵消）。
    // 幂等：已有碰撞面（自带或本函数早先补过）即跳过；复核用 collider.bounds 对渲染盒比差。
    const string PropColliderName = "R2_AD-021_PropCollider";
    const float PropColliderTol = 0.05f;

    static string AddPropColliders(Transform root)
    {
        var props = PropUniverse(root);
        int added = 0, have = 0, mismatch = 0, missing = 0, off = 0;
        var inv = System.Globalization.CultureInfo.InvariantCulture;
        var lines = new List<string>();
        foreach (var kv in props)
        {
            var go = kv.Key;
            var b = kv.Value;
            var existing = go.GetComponentInChildren<Collider>(true);
            if (existing != null)
            {
                have++;
                if (lines.Count < 3)
                    lines.Add(go.name + "×" + Mathf.Max(1, go.GetComponentsInChildren<Collider>(true).Length));
                continue;
            }
            var h = new GameObject(PropColliderName);
            h.transform.SetParent(go.transform, false);
            h.transform.position = b.center;
            h.transform.rotation = Quaternion.identity;
            var ls = go.transform.lossyScale;
            h.transform.localScale = new Vector3(
                Mathf.Abs(ls.x) < 1e-4f ? 1f : 1f / ls.x,
                Mathf.Abs(ls.y) < 1e-4f ? 1f : 1f / ls.y,
                Mathf.Abs(ls.z) < 1e-4f ? 1f : 1f / ls.z);
            var bc = h.AddComponent<BoxCollider>();
            bc.center = Vector3.zero;
            bc.size = b.size;
            added++;
        }
        Physics.SyncTransforms();   // 同帧建完立刻给下面的射线判据用

        foreach (var kv in props)
        {
            var go = kv.Key;
            var b = kv.Value;
            var col = go.GetComponentInChildren<Collider>(true);
            if (col == null) { missing++; continue; }
            var cb = col.bounds;
            if ((cb.center - b.center).magnitude > PropColliderTol || (cb.size - b.size).magnitude > PropColliderTol)
            {
                mismatch++;
                if (lines.Count < 6)
                    lines.Add(go.name + " box=" + F(cb.size.x) + "x" + F(cb.size.y) + "x" + F(cb.size.z)
                        + " render=" + F(b.size.x) + "x" + F(b.size.y) + "x" + F(b.size.z));
            }
        }
        foreach (var kv in props)
            if (kv.Key.GetComponentInChildren<Collider>(true) != null &&
                !kv.Key.GetComponentInChildren<Collider>(true).enabled) off++;

        return "props_with_collider=" + (props.Count - missing) + "/" + props.Count
            + " added=" + added + " preexisting=" + have + " missing=" + missing
            + " mismatch=" + mismatch + " disabled=" + off
            + "（底板道具碰撞面·尺寸对渲染盒差 ≤" + F(PropColliderTol) + "m·main#68）"
            + (lines.Count > 0 ? " sample=" + string.Join(" | ", lines.ToArray()) : "")
            + (mismatch > 0 ? " MISMATCH" : " PASS");
    }

    // ===== 街面行道树与街具（main#72）=====
    // 设计判断定谳：**街面帧要近处树列**——一条两侧光秃的街读不出尺度与生活气；
    // r730/r731 的「机位绕开树」只是绕过病灶，一旦构图需要近树就重新糊脸。
    // 但底板正典的树是 3x8 m 绿色胶囊占位件（CityWhitebox.unity 一律不动），近景一眼是色块。
    // 正法＝不碰底板：在已建 R2 场景里把街道走廊的占位树隐身，换成 ithappy Megacity
    // 真树 prefab（高度按目标 6.0/6.75/7.5 m 三档归一，冠幅按 x/z 收到 ≤0.7×高），
    // 两侧错列、路缘退距 2.6 m、间距 14 m；再按 26 m 间距补路灯（与树位错开半格）。
    // 摆完按实测 AABB 补一次「冠幅不越路缘」外推（minGap 0.6 m，见 PlaceStreetDress 内注）。
    // 判据（main#72）：灭点窗（画面中央 10%x10%）被街具挡住的占比 ≤ 0.08，
    // 且街具 AABB 与路带净距 ≥ 0.6 m、props_in_road = 0 三保持；
    // 中央 20% 窗的遮挡比落 prop_w2 作参考（近树列本来就会占住画面两侧，不算遮挡本义）。
    const string PropPackRoot = "Assets/ithappy/Megacity/Prefabs/Props/";
    static readonly string[] TreeSpecies = { "tree_012", "tree_016", "tree_013", "tree_017" };

    static bool IsStreetDress(string name)
    {
        return name.StartsWith("R2_AD-021_Tree_") || name.StartsWith("R2_AD-021_Lamp_");
    }

    static GameObject LoadPrefabAt(string assetPath)
    {
        return AssetDatabase.LoadAssetAtPath<GameObject>(assetPath);
    }

    // 实例根 → 目标高度归一 → 冠幅收窄 → 落地 → 材质桥 → 碰撞面。返回实高实宽供报告。
    static string PlaceStreetDress(Transform root, GameObject pf, string name,
                                   Vector3 worldPos, float yaw, float targetH, float groundY,
                                   Rect2 band = default(Rect2), float minGap = 0f)
    {
        var inv = System.Globalization.CultureInfo.InvariantCulture;
        if (pf == null) return "missing:" + name;
        var go = (GameObject)PrefabUtility.InstantiatePrefab(pf);
        go.name = name;
        go.transform.SetParent(root, false);
        go.transform.position = worldPos;
        go.transform.rotation = Quaternion.Euler(0f, yaw, 0f);
        var b0 = WorldBounds(go);
        float k = (b0.size.y > 0.01f && targetH > 0.01f) ? targetH / b0.size.y : 1f;
        go.transform.localScale = go.transform.localScale * k;
        // 冠幅上限：资产原始比例里最宽的几株冠幅 9.4 m > 街宽 6 m（6.75 m 高的树配 9.4 m 冠＝
        // 一棵横着长的灌木），街道尺度上读不出行道树。按「冠幅 ≤ 0.8×目标高」收——
        // 只压 x/z（等比收会把 tree_017 从 7.5 m 压到 3.4 m，变成灌木；竖着保高度才像树）。
        var b1 = WorldBounds(go);
        float maxW = 0.7f * targetH;
        float wd = Mathf.Max(b1.size.x, b1.size.z);
        if (maxW > 0.01f && wd > maxW)
        {
            float kxz = maxW / wd;
            go.transform.localScale = new Vector3(go.transform.localScale.x * kxz,
                go.transform.localScale.y, go.transform.localScale.z * kxz);
            b1 = WorldBounds(go);
        }
        go.transform.position += Vector3.up * (groundY - b1.min.y);

        // 路缘净距守卫（main#72）：写 pos 时按「路缘退 2.6 m」算，但 prefab 的 pivot 不在
        // 包围盒中心、缩放又是绕 pivot 做的，收冠幅后 AABB 会整体内移——实测 Tree_06 的
        // lane_gap 掉到 0.01 m（冠幅压在路缘线上、伸到车道上方）。这里按「实测 AABB 与路带
        // 的净距」补一次外推，保证冠幅不越路缘；只动 z（街道沿 x 走）。
        if (minGap > 0f)
        {
            var rb = Rect2Of(WorldBounds(go));
            float dz = 0f;
            float bandC = (band.z0 + band.z1) * 0.5f;
            float goC = (rb.z0 + rb.z1) * 0.5f;
            if (goC >= bandC) { float gap = rb.z0 - band.z1; if (gap < minGap) dz = minGap - gap; }
            else { float gap = band.z0 - rb.z1; if (gap < minGap) dz = -(minGap - gap); }
            if (dz != 0f) go.transform.position += new Vector3(0f, 0f, dz);
        }

        int bridged = 0;
        foreach (var r in go.GetComponentsInChildren<MeshRenderer>(true))
        {
            var mats = r.sharedMaterials;
            bool changed = false;
            for (int i = 0; i < mats.Length; i++)
            {
                var m = mats[i];
                if (m == null) { mats[i] = FallbackMat(); changed = true; continue; }
                if (m.shader != null && m.shader.name.Contains("Universal Render Pipeline")) continue;
                mats[i] = URPMaterialBridge.Convert(m); bridged++; changed = true;
            }
            if (changed) { r.sharedMaterials = mats; EditorUtility.SetDirty(r); }
        }

        if (go.GetComponentsInChildren<Collider>(true).Length == 0)
        {
            var bb = WorldBounds(go);
            var h = new GameObject(PropColliderName);
            h.transform.SetParent(go.transform, false);
            h.transform.position = bb.center;
            h.transform.rotation = Quaternion.identity;
            var ls = go.transform.lossyScale;
            h.transform.localScale = new Vector3(
                Mathf.Abs(ls.x) < 1e-4f ? 1f : 1f / ls.x,
                Mathf.Abs(ls.y) < 1e-4f ? 1f : 1f / ls.y,
                Mathf.Abs(ls.z) < 1e-4f ? 1f : 1f / ls.z);
            var bc = h.AddComponent<BoxCollider>();
            bc.center = Vector3.zero;
            bc.size = bb.size;
        }
        var bf = WorldBounds(go);
        return "h=" + bf.size.y.ToString("F2", inv) + " w=" + bf.size.x.ToString("F2", inv) + " bridged=" + bridged;
    }

    static string DressStreet(Transform root, GameObject street)
    {
        if (street == null) return "street_dress: skipped reason=no_street（main#72）";
        var band = Rect2Of(WorldBounds(street));
        float groundY = WorldBounds(street).max.y;
        const float curbGap = 2.6f, treeSpacing = 14f, lampSpacing = 26f;
        var inv = System.Globalization.CultureInfo.InvariantCulture;

        // ① 占位树隐身（底板不动·只在本场景关掉；重建每次从 CityWhitebox 起跑＝幂等）
        // 侧向 40 m 而不是 14 m：r733 首帧量到街轴上仍有远端胶囊立在灭点正中，
        // 按「街道走廊」整段收起占位树。
        // 范围＝全场景（不止街带）：r733 首帧在灭点正中量到一根远处绿柱，40 m 侧向窗收不到它。
        // 底板占位树场景内一共就那几根，本场景已经有真树列，留着的唯一后果就是地平线上几根绿胶囊。
        int hidden = 0;
        var hiddenNames = new List<string>();
        foreach (var r in UnityEngine.Object.FindObjectsOfType<MeshRenderer>(true))
        {
            var go = r.gameObject;
            if (go == null || !go.activeSelf) continue;
            if (go.transform.IsChildOf(root)) continue;                            // 自家街具不动
            if (go.name.IndexOf("Tree", System.StringComparison.OrdinalIgnoreCase) < 0) continue;
            if (r.bounds.size.y < 2f) continue;
            go.SetActive(false);
            hidden++;
            if (hiddenNames.Count < 4) hiddenNames.Add(go.name);
        }

        // ② 两排真树（错位半格：两侧不同 x，避免正对成对像仪仗）
        var placed = new List<string>();
        int trees = 0;
        for (int side = -1; side <= 1; side += 2)
        {
            float z = side > 0 ? band.z1 + curbGap : band.z0 - curbGap;
            float x0 = band.x0 + 4f + (side > 0 ? treeSpacing * 0.5f : 0f);
            for (float x = x0; x <= band.x1 - 4f; x += treeSpacing)
            {
                string sp = TreeSpecies[trees % TreeSpecies.Length];
                float targetH = 6.0f + (trees % 3) * 0.75f;
                var info = PlaceStreetDress(root, LoadPrefabAt(PropPackRoot + sp + ".prefab"),
                    "R2_AD-021_Tree_" + (trees + 1).ToString("D2", inv),
                    new Vector3(x, 0f, z), (trees * 137) % 360, targetH, groundY, band, 0.6f);
                if (!info.StartsWith("missing")) trees++;
                if (placed.Count < 6) placed.Add(sp + "@" + F(x) + "/" + F(z) + " " + info);
            }
        }

        // ③ 路灯（贴路缘 1.2 m·18 m 一档·与树位错半格）
        int lamps = 0;
        for (int side = -1; side <= 1; side += 2)
        {
            float z = side > 0 ? band.z1 + 1.2f : band.z0 - 1.2f;
            float x0 = band.x0 + 6f + (side > 0 ? lampSpacing * 0.5f : 0f);
            for (float x = x0; x <= band.x1 - 6f; x += lampSpacing)
            {
                var info = PlaceStreetDress(root, LoadPrefabAt(PropPackRoot + "lamp_post_001.prefab"),
                    "R2_AD-021_Lamp_" + (lamps + 1).ToString("D2", inv),
                    new Vector3(x, 0f, z), side > 0 ? 180f : 0f, 5.5f, groundY, band, 0.6f);
                if (!info.StartsWith("missing")) lamps++;
            }
        }

        Physics.SyncTransforms();   // 新街具同帧要对下面的机位射线判据可见

        // 诊断列：街轴上仍立着的底板高件（自家街具除外），用于定位灭点里的残件
        var left = new List<string>();
        foreach (var kv in StreetProps(root, street, 120f))
        {
            var go = kv.Key;
            if (go == null || !go.activeSelf) continue;
            if (kv.Value.size.y < 2f) continue;
            if (go.name.StartsWith("R2_AD-021_")) continue;
            Vector3 c = kv.Value.center;
            left.Add(go.name + "@(" + F(c.x) + "," + F(c.z) + ") h=" + F(kv.Value.size.y));
            if (left.Count >= 6) break;
        }

        // 实测路缘净距（main#72 判据）：所有街具 AABB 与路带的最小净距，判据 ≥0.6 m。
        // 写 pos 的「路缘退距」只是意图书面值，真值必须从摆完的包围盒量回来。
        float curbMin = float.MaxValue;
        foreach (Transform t in root)
            if (IsStreetDress(t.name))
                curbMin = Mathf.Min(curbMin, Rect2Separation(Rect2Of(WorldBounds(t.gameObject)), band));

        return "street_dress: trees=" + trees + " lamps=" + lamps + " hidden_placeholders=" + hidden
            + " curb_gap=" + F(curbGap) + " tree_spacing=" + F(treeSpacing) + " lamp_spacing=" + F(lampSpacing)
            + " ground_y=" + F(groundY)
            + " curb_min_gap=" + (curbMin == float.MaxValue ? "n/a" : F(curbMin))
            + (hiddenNames.Count > 0 ? " hidden=" + string.Join("|", hiddenNames.ToArray()) : "")
            + (placed.Count > 0 ? " sample=" + string.Join(" · ", placed.ToArray()) : "")
            + (left.Count > 0 ? " leftover=" + string.Join(" · ", left.ToArray()) : " leftover=0")
            + "（main#72 近树列=要·真树替占位·底板正典零触碰）";
    }

    // ===== 遮挡判据夹具自证（main#68）=====
    // 同一个 IsBlocked 判据：机位放到「某件道具正后方、正对某栋房」的位姿必须报 blocked=1；
    // 再把该道具碰撞面临时关掉（＝把道具移走）必须回到 0。两条读数同一帧、同一函数给出，
    // 这样「判据看得见道具」不靠口头声明。
    static string PropBlockProbe(List<KeyValuePair<GameObject, Bounds>> props, List<GameObject> houses, float groundY)
    {
        if (props.Count == 0) return "prop_block_probe: skipped reason=no_props（main#68）";
        if (houses.Count == 0) return "prop_block_probe: skipped reason=no_houses（main#68）";
        string why = "no_pair";
        int tried = 0;
        foreach (var kv in props.Take(30))
        {
            var go = kv.Key;
            var cols = go.GetComponentsInChildren<Collider>(true);
            if (cols.Length == 0) { why = "no_collider"; continue; }
            foreach (var h in houses)
            {
                var hb = WorldBounds(h);
                Vector3 aim = new Vector3(hb.center.x, Mathf.Lerp(hb.min.y, hb.max.y, 0.55f), hb.center.z);
                Vector3 d = aim - kv.Value.center;
                if (d.magnitude < 4f) { why = "too_close"; continue; }
                d.Normalize();
                Vector3 eye = kv.Value.center - d * 3f;
                eye.y = groundY + 1.7f;
                if (!IsBlocked(eye, h)) { why = "not_blocked"; continue; }
                tried++;
                foreach (var c in cols) c.enabled = false;
                bool after = IsBlocked(eye, h);
                foreach (var c in cols) c.enabled = true;
                if (after) { why = "other_blocker"; continue; }
                return "prop_block_probe: prop=" + go.name + " house=" + h.name
                    + " eye=(" + F(eye.x) + "," + F(eye.z) + ") blocked=1 removed_blocked=0 PASS（同源自证·main#68）";
            }
        }
        return "prop_block_probe: NOT_FOUND why=" + why + " tried=" + tried + "（main#68·夹具未解出·如实标注）";
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

    static GameObject Place(Transform parent, GameObject pf, string name, Vector3 localPos, float pitch, float yaw, float yOffset = 0f)
    {
        var go = (GameObject)PrefabUtility.InstantiatePrefab(pf);
        go.name = "R2_AD-021_" + name;
        go.transform.SetParent(parent, false);
        go.transform.localPosition = localPos + Vector3.up * yOffset;
        go.transform.localRotation = Quaternion.Euler(pitch, yaw, 0f);
        return go;
    }

    // 某物件 AABB 在 frame 局部 XZ 轴上的矩形（main#67：附属件的 pivot 不可信，
    // 一律按实测 AABB 算它在围合体里的真实占位）。
    static Rect2 LocalRect(Transform frame, GameObject go)
    {
        var b = WorldBounds(go);
        var r = new Rect2 { x0 = float.MaxValue, z0 = float.MaxValue, x1 = float.MinValue, z1 = float.MinValue };
        for (int i = 0; i < 4; i++)
        {
            float wx = (i & 1) == 0 ? b.min.x : b.max.x;
            float wz = (i & 2) == 0 ? b.min.z : b.max.z;
            var lp = frame.InverseTransformPoint(new Vector3(wx, b.center.y, wz));
            r.x0 = Mathf.Min(r.x0, lp.x); r.x1 = Mathf.Max(r.x1, lp.x);
            r.z0 = Mathf.Min(r.z0, lp.z); r.z1 = Mathf.Max(r.z1, lp.z);
        }
        return r;
    }

    // 把物件的实测 AABB 在 frame 局部坐标里对齐到目标线：xIsMax/zIsMax 选择拿 min 角还是 max 角去贴
    // （main#67：模块件 pivot 在角落，只有按 AABB 对齐才不会整圈外偏）。
    static void AlignRect(GameObject go, float tX, float tZ, bool xIsMax, bool zIsMax)
    {
        var frame = go.transform.parent;
        var r = LocalRect(frame, go);
        float dx = (xIsMax ? tX - r.x1 : tX - r.x0);
        float dz = (zIsMax ? tZ - r.z1 : tZ - r.z0);
        if (dx != 0f || dz != 0f) go.transform.position += frame.TransformVector(new Vector3(dx, 0f, dz));
    }

    // 把物件整体平移到「±halfX / ±halfZ 内壁内」的最小位移（只平移、不旋转不缩放）。
    static void FitInsideWalls(GameObject go, float halfX, float halfZ, float inset)
    {
        var frame = go.transform.parent;
        var r = LocalRect(frame, go);
        float dx = 0f, dz = 0f;
        if (r.x1 > halfX - inset) dx = (halfX - inset) - r.x1;
        else if (r.x0 < -halfX + inset) dx = (-halfX + inset) - r.x0;
        if (r.z1 > halfZ - inset) dz = (halfZ - inset) - r.z1;
        else if (r.z0 < -halfZ + inset) dz = (-halfZ + inset) - r.z0;
        if (dx != 0f || dz != 0f) go.transform.position += frame.TransformVector(new Vector3(dx, 0f, dz));
        var n = LocalRect(frame, go);
        Report.Add($"showcase_fit[{go.name}]: AABB {r.x1 - r.x0:F2}x{r.z1 - r.z0:F2}m move=({dx:F2},{dz:F2})m -> x[{n.x0:F2}..{n.x1:F2}] z[{n.z0:F2}..{n.z1:F2}] 内壁±({halfX - inset:F2}/{halfZ - inset:F2})");
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

        // main#69：底板道具（行道树等白盒件）无碰撞体，物理射线永远报 blocked=0，
        // 于是机位求解从来不管它们——r728 街面帧左右各被 3 m 级绿胶囊顶掉约 1/4。
        // 这里按几何把它们纳入罚项（尺寸实测随报告落盘），不改底板正典也不动机位判据本义。
        GameObject streetGo = null;
        foreach (Transform t in root)
            if (t.name == "R2_AD-021_Street") { streetGo = t.gameObject; break; }
        var props = streetGo != null ? StreetProps(root, streetGo) : new List<KeyValuePair<GameObject, Bounds>>();
        Rect2 bandRect = streetGo != null ? Rect2Of(WorldBounds(streetGo)) : new Rect2();

        float bestFrac = 0f, bestYaw = 0f, bestLat = 0f, bestX = 0f;
        float bestPropCov = 0f, bestNear = 0f, bestRay = 1f, bestWall = 0f, bestFallback = float.MinValue;
        bool bestBlocked = false, bestOk = false;
        // main#72 位姿求解改成「先过硬判据、再按遮挡字典序取优」：
        // 旧版是加权总分，r733 连着两次被罚项互相抵消带偏——一次拐去贴着墙拍立面（facade=1.000、
        // 街面 0%），一次拐到 30 度偏角把整条街晾在画外。加权总分在这种多目标上不可解释，
        // 换成可审计的字典序：硬判据（沿街轴向 ±8 度 · 街面占比 ≥0.12 · 立面 ≥0.25 · 不被挡 ·
        // 不贴墙）筛出候选，再取「全帧射线遮挡最小」，同分取偏角更小、再取横移更小。
        // 候选按「拍摄意图优先」排好再逐个判：站在街心偏西、正对街轴 —— 这是街面帧的正身。
        // 不在候选里挑「遮挡最少」的，因为最少遮挡的位置必然是街口（街上没东西可看），
        // r733 实测就是这么选到街尾、把树列全甩在身后（prop_ray=0.000）。正序＝意图，判据＝门槛。
        float[] xs = new float[9];
        for (int i = 0; i < xs.Length; i++)
            xs[i] = Mathf.Lerp(bandRect.x0 + 8f, bandRect.x1 - 8f, i / (float)(xs.Length - 1));
        float[] lats = { 0f, 1.2f, -1.2f };
        float[] yaws = { 0f, 4f, -4f, 8f, -8f };
        int qualified = 0, candTotal = xs.Length * lats.Length * yaws.Length;
        bool picked = false;
        foreach (float cx in xs)
            foreach (float lat in lats)
                foreach (float yawOff in yaws)
                {
                    if (picked) continue;
                    Vector3 dir = Quaternion.Euler(-1.5f, 90f + yawOff, 0f) * Vector3.forward;
                    cam.transform.position = new Vector3(cx, groundY + eyeH, streetZ + lat);
                    cam.transform.rotation = Quaternion.LookRotation(dir, Vector3.up);
                    GameObject best;
                    float f = MaxFacadeFrac(cam, houses, out best);
                    bool blocked = best != null && IsBlocked(cam.transform.position, best);
                    float propCov = PropScreenFrac(cam, props);
                    float propRay = PropRayFrac(cam, props);
                    float nearPen = NearPropPenalty(cam, props);
                    float wallPen = WallHugPenalty(cam, houses);
                    float cv = StreetCoverFrac(cam, root, 24, 14);

                    bool ok = !blocked && wallPen <= 0f && f >= targetFrac && cv >= 0.12f;
                    if (ok) qualified++;
                    if (ok && !bestOk)
                    {
                        // 首个过硬门槛的候选就是定案（候选顺序＝拍摄意图），后续不再覆盖
                        bestOk = true; picked = true;
                        bestFrac = f; bestYaw = yawOff; bestLat = lat; bestX = cx;
                        bestBlocked = blocked; bestPropCov = propCov; bestNear = nearPen;
                        bestRay = propRay; bestWall = wallPen;
                    }
                    else if (!ok && !bestOk)
                    {
                        // 全候选都不合格时才用「立面占比 + 街面占比」挑个最好看的，并如实记 NO_QUALIFYING
                        float fb = f + Mathf.Min(cv, 0.4f) * 0.3f;
                        if (fb > bestFallback)
                        {
                            bestFallback = fb;
                            bestFrac = f; bestYaw = yawOff; bestLat = lat; bestX = cx;
                            bestBlocked = blocked; bestPropCov = propCov; bestNear = nearPen;
                            bestRay = propRay; bestWall = wallPen;
                        }
                    }
                }

        Vector3 bestDir = Quaternion.Euler(-1.5f, 90f + bestYaw, 0f) * Vector3.forward;
        cam.fieldOfView = keepFov;
        cam.transform.position = new Vector3(bestX, groundY + eyeH, streetZ + bestLat);
        cam.transform.rotation = Quaternion.LookRotation(bestDir, Vector3.up);
        cam.farClipPlane = Mathf.Max(cam.farClipPlane, b.size.magnitude * 4f);
        RenderShot(cam, file);

        float cover = StreetCoverFrac(cam, root);
        // 判据改基（main#72）：`prop_cover` 现在报「灭点窗（画面中央 10%x10%）被街具挡住的占比」
        // ——这才是 r728 那条「树顶掉灭点」的本义（近树列是设计决定，树在画面两侧不算遮挡）。
        // 整帧射线比落 `prop_ray`；旧 AABB 八角投影落 `prop_aabb`，只作对照——镜头站在树冠
        // 之下时它会打满 0.9，与画面差两个数量级，不能拿来判构图。
        float axisCov = PropRayFrac(cam, props, 10, 10, 0.45f, 0.55f, 0.45f, 0.55f);   // vanishing-point window (criterion)
        float axisWide = PropRayFrac(cam, props, 16, 12, 0.40f, 0.60f, 0.40f, 0.60f);  // central 20% window (reference)
        Report.Add(AxisBlockers(cam, props));   // main#72 诊断：灭点窗被哪几件挡住（名字/距离/横向偏距）
        

        var inv = System.Globalization.CultureInfo.InvariantCulture;
        Report.Add("street_pose: eye=" + eyeH.ToString("F1", inv) + "m yaw_off=" + bestYaw.ToString("F1", inv)
            + " lat=" + bestLat.ToString("F1", inv) + " x=" + bestX.ToString("F1", inv)
            + " facade=" + bestFrac.ToString("F3", inv)
            + " street_cover=" + (cover < 0f ? "n/a" : cover.ToString("F3", inv))
            + " prop_cover=" + axisCov.ToString("F3", inv)
            + " prop_ray=" + bestRay.ToString("F3", inv)
            + " prop_aabb=" + bestPropCov.ToString("F3", inv)
            + " prop_w2=" + axisWide.ToString("F3", inv)
            
            + " near_pen=" + bestNear.ToString("F2", inv)
            + " wall_pen=" + bestWall.ToString("F1", inv)
            + " blocked=" + (bestBlocked ? "1" : "0")
            + " cand_ok=" + qualified + "/" + candTotal
            + (bestOk ? " ok" : " NO_QUALIFYING")
            + (cover >= 0f && cover >= 0.55f ? " PAVEMENT_HIGH" : ""));
        // main#69 量面：近街道具逐件尺寸 + 到街心垂距（判「缩体量/退距离」用），只读不施工
        var camPos = cam.transform.position;
        var nearLines = new List<string>();
        foreach (var kv in props.OrderBy(k => (k.Value.center - camPos).magnitude).Take(5))
        {
            var pb = kv.Value;
            float gx = Mathf.Max(0f, Mathf.Max(pb.min.x - camPos.x, camPos.x - pb.max.x));
            float gz = Mathf.Max(0f, Mathf.Max(pb.min.z - camPos.z, camPos.z - pb.max.z));
            nearLines.Add(kv.Key.name + " size=" + F(pb.size.x) + "x" + F(pb.size.y) + "x" + F(pb.size.z)
                + " base_y=" + F(pb.min.y - groundY) + " lane_gap=" + F(Rect2Separation(Rect2Of(pb), bandRect))
                + " cam_d=" + F(Mathf.Sqrt(gx * gx + gz * gz)) + "m");
        }
        Report.Add("street_props: n=" + props.Count + " nearest5: " + string.Join(" | ", nearLines.ToArray()));

        // 阴性/对照读数（main#69）：r728 的旧机位（街区西端 x=min+1.5、lat=1.2、正偏角）
        // 在这里重算一遍——同一帧里近树罚项到底多重，靠数字而不是靠感觉。
        if (props.Count > 0)
        {
            cam.transform.position = new Vector3(b.min.x + 1.5f, groundY + eyeH, streetZ + 1.2f);
            cam.transform.rotation = Quaternion.LookRotation(Quaternion.Euler(-1.5f, 90f, 0f) * Vector3.forward, Vector3.up);
            GameObject ctl;
            float ctlFacade = MaxFacadeFrac(cam, houses, out ctl);
            float ctlCov = PropScreenFrac(cam, props);
            float ctlRay = PropRayFrac(cam, props);
            float ctlAxis = PropRayFrac(cam, props, 10, 10, 0.45f, 0.55f, 0.45f, 0.55f);
            float ctlNear = NearPropPenalty(cam, props);
            Report.Add("street_control: r728_pose facade=" + ctlFacade.ToString("F3", inv)
                + " prop_cover=" + ctlAxis.ToString("F3", inv)
                + " prop_ray=" + ctlRay.ToString("F3", inv)
                + " prop_aabb=" + ctlCov.ToString("F3", inv)
                + " near_pen=" + ctlNear.ToString("F2", inv)
                + "（对照：旧机位全帧射线被树挡 "
                + (ctlRay * 100f).ToString("F0", inv) + "%·AABB 投影旧读数 "
                + (ctlCov * 100f).ToString("F0", inv) + "%（虚高·仅留对照）·main#72）");
        }

        // main#68 自证：遮挡判据现在看得见底板道具（碰撞面由 AddPropColliders 补齐）——
        // 同一帧给出「挡=1 / 移开=0」两条读数，阴性对照在所难免地同源。
        Report.Add(PropBlockProbe(props, houses, groundY));
    }

    // 铺装占画面比（main#66 判据）：逐屏幕采样射线与路带顶面求交，落在 76x6 路带内的
    // 采样点占比＝该帧里「脚下是街」的面积比（1.0 = 整帧铺装，广场感来源）。
    // 相机站在路带上时近角必然在身后，包围盒投影法会整体失效（实测 n/a），
    // 故用射线法：视线在地平线以上永不命中，天然给出 0。
    // 注意：不做遮挡判定（地上物件当前无碰撞体，main#68 才补）＝上界读数。
    static float StreetCoverFrac(Camera cam, Transform root, int nx = 64, int ny = 36)
    {
        Transform street = null;
        foreach (Transform t in root)
            if (t.name == "R2_AD-021_Street") { street = t; break; }
        if (street == null) return -1f;
        var b = WorldBounds(street.gameObject);
        float y = b.max.y;
        int hits = 0;
        for (int iy = 0; iy < ny; iy++)
        {
            float vy = (iy + 0.5f) / ny;
            for (int ix = 0; ix < nx; ix++)
            {
                float vx = (ix + 0.5f) / nx;
                var r = cam.ViewportPointToRay(new Vector3(vx, vy, 0f));
                if (Mathf.Abs(r.direction.y) < 1e-5f) continue;
                float t = (y - r.origin.y) / r.direction.y;
                if (t <= 0f) continue;
                Vector3 p = r.origin + r.direction * t;
                if (p.x >= b.min.x && p.x <= b.max.x && p.z >= b.min.z && p.z <= b.max.z) hits++;
            }
        }
        return (float)hits / (nx * ny);
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
            if (hit.collider.GetComponentInParent<MeshRenderer>() == null) continue;
            return true;
        }
        return false;
    }

    // 近街道具集合（main#69）：R2 街区之外、跨度 ≤10 m、站在街带两侧 14 m 内的白盒道具。
    // 只读，替身仍是底板正典原件（不缩不挪），供机位求解算遮挡与量尺寸。
    static List<KeyValuePair<GameObject, Bounds>> StreetProps(Transform root, GameObject street,
                                                             float lateral = 14f, float maxSpan = 10f)
    {
        var band = Rect2Of(WorldBounds(street));
        var list = new List<KeyValuePair<GameObject, Bounds>>();
        var seen = new HashSet<GameObject>();

        // 本街区自己种的行道树/路灯（main#72）也算近街道具：机位遮挡判据必须看得见它们，
        // 否则「新种的树没人管」＝r728 的近树顶脸问题换个来源复发。
        // 只认实例根（子网格件按根计数一次），跨重建（CaptureShots 重开场景）同样成立。
        foreach (Transform t in root)
            if (IsStreetDress(t.name))
                list.Add(new KeyValuePair<GameObject, Bounds>(t.gameObject, WorldBounds(t.gameObject)));
        foreach (var r in UnityEngine.Object.FindObjectsOfType<MeshRenderer>(true))
        {
            var go = r.gameObject;
            if (go.transform.IsChildOf(root)) continue;
            if (!seen.Add(go)) continue;
            var b = r.bounds;
            if (b.size.x <= 0.001f || b.size.z <= 0.001f) continue;
            if (b.size.x > maxSpan || b.size.z > maxSpan) continue;
            if (b.size.y < 0.5f) continue;                                  // 地面/铺装片不是街具
            if (Rect2Separation(Rect2Of(b), band) > lateral) continue;
            list.Add(new KeyValuePair<GameObject, Bounds>(go, b));
        }
        return list;
    }

    // 道具吃掉的画面面积比：AABB 八角投影成屏幕矩形，裁进视口后累加（相机后方/很近的
    // 大件按「有角在背后」跳过＝不会把镜头内的树误报成全屏）。这是上界读数，用作罚项即可。
    static float PropScreenFrac(Camera cam, List<KeyValuePair<GameObject, Bounds>> props)
    {
        float sum = 0f;
        Vector3 cp = cam.transform.position;
        foreach (var kv in props)
        {
            var b = kv.Value;
            if ((b.center - cp).magnitude > 20f) continue;
            float minX = 2f, maxX = -1f, minY = 2f, maxY = -1f;
            bool ok = true;
            for (int i = 0; i < 8; i++)
            {
                Vector3 p = b.center + Vector3.Scale(b.extents, new Vector3(
                    (i & 1) == 0 ? -1f : 1f, (i & 2) == 0 ? -1f : 1f, (i & 4) == 0 ? -1f : 1f));
                Vector3 v = cam.WorldToViewportPoint(p);
                if (v.z <= 0.05f) { ok = false; break; }
                minX = Mathf.Min(minX, v.x); maxX = Mathf.Max(maxX, v.x);
                minY = Mathf.Min(minY, v.y); maxY = Mathf.Max(maxY, v.y);
            }
            if (!ok) continue;
            float w = Mathf.Clamp01(maxX) - Mathf.Clamp01(minX);
            float h = Mathf.Clamp01(maxY) - Mathf.Clamp01(minY);
            if (w <= 0f || h <= 0f) continue;
            sum += w * h;
        }
        return Mathf.Min(sum, 0.9f);
    }

    // 射线实测遮挡比（main#72 判据改基）：逐屏幕采样视线与道具 AABB 求交，
    // 命中任一近街道具的采样点占比＝该帧里「画面被街上物件吃掉」的真实面积比。
    // 默认整帧；传 u0/u1/v0/v1 可只看一个窗口（判定用灭点窗）。
    // 为什么不用 AABB 八角投影（PropScreenFrac）：镜头站在树冠之下时投影法把整块树冠矩形
    // 算满——实测对照行打出 0.900（90% 画面），帧里树只占边缘一角，读数与画面差两个数量级，
    // 会把机位搜索推向「贴墙」而不是「街上」。投影法保留为参考列（prop_aabb）。
    static float PropRayFrac(Camera cam, List<KeyValuePair<GameObject, Bounds>> props, int nx = 24, int ny = 14,
                             float u0 = 0f, float u1 = 1f, float v0 = 0f, float v1 = 1f)
    {
        if (props.Count == 0) return 0f;
        var boxes = new List<Bounds>();
        Vector3 cp = cam.transform.position;
        foreach (var kv in props)
            if ((kv.Value.center - cp).magnitude <= 45f) boxes.Add(kv.Value);
        if (boxes.Count == 0) return 0f;
        int hits = 0;
        for (int iy = 0; iy < ny; iy++)
            for (int ix = 0; ix < nx; ix++)
            {
                float u = u0 + (u1 - u0) * (ix + 0.5f) / nx;
                float v = v0 + (v1 - v0) * (iy + 0.5f) / ny;
                var r = cam.ViewportPointToRay(new Vector3(u, v, 0f));
                if (RayHitsAnyBox(r.origin, r.direction, boxes, 45f)) hits++;
            }
        return (float)hits / (nx * ny);
    }

    // 灭点窗归因（main#72）：判据只给一个百分比，修的时候不知道挡路的是哪一件。
    // 这里用与判据同一套采样（10x10 · u/v 0.45~0.55）打视线，按「首个命中件」计数，
    // 输出 top4（名字 + 命中数 + 最近命中距离 + 该件中心到街轴的横向偏距）。
    static string AxisBlockers(Camera cam, List<KeyValuePair<GameObject, Bounds>> props)
    {
        if (props.Count == 0) return "axis_blockers: none（main#72）";
        var boxes = new List<Bounds>();
        var names = new List<string>();
        Vector3 cp = cam.transform.position;
        foreach (var kv in props)
            if ((kv.Value.center - cp).magnitude <= 45f) { boxes.Add(kv.Value); names.Add(kv.Key.name); }
        if (boxes.Count == 0) return "axis_blockers: none_in_range（main#72）";
        var hits = new int[boxes.Count];
        var nearest = new float[boxes.Count];
        for (int i = 0; i < nearest.Length; i++) nearest[i] = float.MaxValue;
        int total = 0;
        for (int iy = 0; iy < 10; iy++)
            for (int ix = 0; ix < 10; ix++)
            {
                float u = 0.45f + 0.1f * (ix + 0.5f) / 10f;
                float v = 0.45f + 0.1f * (iy + 0.5f) / 10f;
                var r = cam.ViewportPointToRay(new Vector3(u, v, 0f));
                float t;
                int bi = FirstBoxHit(r.origin, r.direction, boxes, 45f, out t);
                if (bi < 0) continue;
                hits[bi]++; total++;
                if (t < nearest[bi]) nearest[bi] = t;
            }
        if (total == 0) return "axis_blockers: clear hits=0/100（main#72）";
        var order = Enumerable.Range(0, boxes.Count).OrderByDescending(i => hits[i]).Take(4);
        var parts = new List<string>();
        foreach (int i in order)
        {
            if (hits[i] == 0) continue;
            var b = boxes[i];
            float lat = Mathf.Abs(b.center.z - cp.z);   // 相机沿 +x 看，横向偏距取 z
            parts.Add(names[i] + " hits=" + hits[i] + "/100 t=" + nearest[i].ToString("F1",
                System.Globalization.CultureInfo.InvariantCulture)
                + "m h=" + b.size.y.ToString("F1", System.Globalization.CultureInfo.InvariantCulture)
                + " lat=" + lat.ToString("F1", System.Globalization.CultureInfo.InvariantCulture)
                + "m span_z=" + b.size.z.ToString("F1", System.Globalization.CultureInfo.InvariantCulture) + "m");
        }
        return "axis_blockers: blocked=" + total + "/100 " + string.Join(" | ", parts.ToArray()) + "（main#72）";
    }

    // 返回首个命中盒的入口距离（slab 法；同一套判定语义与 RayHitsAnyBox 一致）。
    static int FirstBoxHit(Vector3 o, Vector3 d, List<Bounds> boxes, float maxT, out float bestT)
    {
        bestT = float.MaxValue;
        int best = -1;
        for (int bi = 0; bi < boxes.Count; bi++)
        {
            var b = boxes[bi];
            float tmin = 0f, tmax = maxT;
            bool ok = true;
            for (int axis = 0; axis < 3; axis++)
            {
                float ov = axis == 0 ? o.x : axis == 1 ? o.y : o.z;
                float dv = axis == 0 ? d.x : axis == 1 ? d.y : d.z;
                float lo = axis == 0 ? b.min.x : axis == 1 ? b.min.y : b.min.z;
                float hi = axis == 0 ? b.max.x : axis == 1 ? b.max.y : b.max.z;
                if (Mathf.Abs(dv) < 1e-6f) { if (ov < lo || ov > hi) { ok = false; break; } continue; }
                float t1 = (lo - ov) / dv, t2 = (hi - ov) / dv;
                if (t1 > t2) { var tt = t1; t1 = t2; t2 = tt; }
                if (t1 > tmin) tmin = t1;
                if (t2 < tmax) tmax = t2;
                if (tmin > tmax) { ok = false; break; }
            }
            if (!ok) continue;
            if (tmin < bestT) { bestT = tmin; best = bi; }
        }
        return best;
    }

    // 射线 vs 世界轴对齐盒（slab 法）：只判「视线会不会落到街上的实体」，不做遮挡排序
    // （房子不在 props 里，故被房子挡住的那部分树会被少数几次，对判构图足够）。
    static bool RayHitsAnyBox(Vector3 o, Vector3 d, List<Bounds> boxes, float maxT)
    {
        foreach (var b in boxes)
        {
            float tmin = 0f, tmax = maxT;
            bool ok = true;
            for (int axis = 0; axis < 3; axis++)
            {
                float ov = axis == 0 ? o.x : axis == 1 ? o.y : o.z;
                float dv = axis == 0 ? d.x : axis == 1 ? d.y : d.z;
                float lo = axis == 0 ? b.min.x : axis == 1 ? b.min.y : b.min.z;
                float hi = axis == 0 ? b.max.x : axis == 1 ? b.max.y : b.max.z;
                if (Mathf.Abs(dv) < 1e-6f) { if (ov < lo || ov > hi) { ok = false; break; } continue; }
                float t1 = (lo - ov) / dv, t2 = (hi - ov) / dv;
                if (t1 > t2) { var tt = t1; t1 = t2; t2 = tt; }
                if (t1 > tmin) tmin = t1;
                if (t2 < tmax) tmax = t2;
                if (tmin > tmax) { ok = false; break; }
            }
            if (ok) return true;
        }
        return false;
    }

    // 贴墙罚项（main#72）：机位离最近一栋房的水平净距过近时，画面读成「一堵墙」而不是「街」。
    // r733 首跑实测：投影遮挡读数把搜索推到街区西端一栋房的墙前（facade=1.000、街面 0%），
    // 数字达标、画面全是墙面。故对机位贴墙直接重罚。
    static float WallHugPenalty(Camera cam, List<GameObject> houses, float safe = 4f)
    {
        Vector3 cp = cam.transform.position;
        float best = float.MaxValue;
        foreach (var h in houses)
        {
            var r = Rect2Of(WorldBounds(h));
            float dx = Mathf.Max(0f, Mathf.Max(r.x0 - cp.x, cp.x - r.x1));
            float dz = Mathf.Max(0f, Mathf.Max(r.z0 - cp.z, cp.z - r.z1));
            float d = Mathf.Sqrt(dx * dx + dz * dz);
            if (d < best) best = d;
        }
        if (best >= safe) return 0f;
        return (safe - best) * 400f;
    }

    // 「贴着镜头站」罚项：机位与眼高以上道具的水平净距 <6 m 就越近越罚——
    // 3 m 级胶囊树在 2-3 m 处即便是侧后方也会顶掉画面两缘，这是投影法测不到的部分。
    static float NearPropPenalty(Camera cam, List<KeyValuePair<GameObject, Bounds>> props)
    {
        Vector3 cp = cam.transform.position;
        float pen = 0f;
        foreach (var kv in props)
        {
            var b = kv.Value;
            if (b.max.y <= cp.y - 0.4f) continue;   // 低于视线的街具（矮墩/长椅）不罚
            float dx = Mathf.Max(0f, Mathf.Max(b.min.x - cp.x, cp.x - b.max.x));
            float dz = Mathf.Max(0f, Mathf.Max(b.min.z - cp.z, cp.z - b.max.z));
            float d = Mathf.Sqrt(dx * dx + dz * dz);
            if (d >= 6f) continue;
            pen += (6f - d) / 6f * (b.size.y >= 2f ? 1f : 0.5f);
        }
        return Mathf.Min(pen, 1.5f);
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
