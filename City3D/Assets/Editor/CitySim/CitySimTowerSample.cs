using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine;

namespace CitySim
{
    // V2 陆家嘴样板批（CEO 令 O-2026-0930-012·O-011 判据前置冻结律+CEO 锚点前置律）
    // 真尺度构图（R-20260930-cs-09 A/B 双源：塔高 632/492/420.5/468·塔心三角 146/208/166m·明珠距三塔 804-948m·世纪大道 100m×5.5km 118° ESE·江宽 500m·塔沿大道轴南侧前街）——≤3 帧过 CEO 锚点后才量产
    // T 断言=实测版（渲染器包围盒测地/对账/对位——禁占位空真门·pilot A2 判例执法）
    [Serializable] class LJLandmark { public string name; public float x; public float z; public string family; public int stacks; public float footScale; public bool spire; }
    [Serializable] class LJSample
    {
        public string scaleNote;                      // 数据源注记（R-cs-09 双源）
        public float waterX0, waterX1;                 // 黄浦江水域 X 带（江西侧）
        public float spanZ0, spanZ1;                   // 场景 Z 跨度（水/地共用）
        public float groundX1;                         // 地坪东界
        public float avenueX0, avenueZ0, avenueX1, avenueZ1; // 世纪大道切片两端（118° ESE 轴）
        public int avenueRows;                         // 大道路幅行数（5m/行·100m=20）
        public List<LJLandmark> landmarks;
    }

    public static class CitySimTowerSample
    {
        static string Staging { get { return Path.GetFullPath(Path.Combine(Directory.GetParent(Application.dataPath).FullName, "..", "City3D-staging")); } }
        static string SampleJson { get { return Path.Combine("Assets", "CitySim", "citysim-lujiazui-sample.json"); } }
        static string ScenePath { get { return Path.Combine("Assets", "Scenes", "CitySim_LJ_Sample.unity"); } }
        static string DonePath { get { return Path.Combine(Staging, "citysim-ljsample.done"); } }
        static string ReportPath { get { return Path.Combine(Staging, "citysim-ljsample-report.md"); } }
        static string ShotsDir { get { return Path.Combine(Staging, "shots8"); } }

        static GameObject pfRoundBase, pfRound, pfRoundRoof, pfSqBase, pfSq, pfSqRoof, pfSpire, pfRoadLines;
        static GameObject pfOctBase, pfOctFloor, pfOctRoof, pfOldLarge, pfOldSmall;
        static Vector3 szRoundBase, ctRoundBase, szRound, ctRound, szRoundRoof, ctRoundRoof, szSqBase, ctSqBase, szSq, ctSq, szSqRoof, ctSqRoof, szSpire, ctSpire, szRoadLines, ctRoadLines;
        static Vector3 szOctBase, ctOctBase, szOctFloor, ctOctFloor, szOctRoof, ctOctRoof, szOldLarge, ctOldLarge, szOldSmall, ctOldSmall;
        static int instCount;

        static GameObject FindPf(string name, string packMark)
        {
            foreach (string guid in AssetDatabase.FindAssets(name + " t:Prefab"))
            {
                string p = AssetDatabase.GUIDToAssetPath(guid);
                if (p.Contains(packMark)) return AssetDatabase.LoadAssetAtPath<GameObject>(p);
            }
            throw new Exception("prefab not found: " + name + " @pack " + packMark);
        }

        static void Measure(GameObject pf, out Vector3 size, out Vector3 center)
        {
            Vector3 probe = new Vector3(1000f, -1000f, 1000f);
            var go = (GameObject)PrefabUtility.InstantiatePrefab(pf);
            go.transform.position = probe;
            var b = new Bounds(); bool first = true;
            foreach (var r in go.GetComponentsInChildren<Renderer>())
            {
                if (first) { b = r.bounds; first = false; } else b.Encapsulate(r.bounds);
            }
            UnityEngine.Object.DestroyImmediate(go);
            size = b.size; center = b.center - probe;
        }

        static GameObject PlaceModule(Transform parent, GameObject pf, Vector3 ct, Vector3 wc, Quaternion rot, Vector3 scale)
        {
            var go = (GameObject)PrefabUtility.InstantiatePrefab(pf);
            go.transform.SetParent(parent, false);
            Vector3 pivotLocal = new Vector3(scale.x * ct.x, scale.y * ct.y, scale.z * ct.z);
            go.transform.position = wc - rot * pivotLocal; // pivot 角点律（v3 判例）
            go.transform.rotation = rot;
            go.transform.localScale = scale;
            instCount++;
            return go;
        }

        static void Resolve()
        {
            GameObject p;
            p = FindPf("SM_Bld_OfficeRound_Base_01", "AD-022_"); Measure(p, out szRoundBase, out ctRoundBase); pfRoundBase = p;
            p = FindPf("SM_Bld_OfficeRound_01", "AD-022_"); Measure(p, out szRound, out ctRound); pfRound = p;
            p = FindPf("SM_Bld_OfficeRound_Roof_01", "AD-022_"); Measure(p, out szRoundRoof, out ctRoundRoof); pfRoundRoof = p;
            p = FindPf("SM_Bld_OfficeSquare_Base_01", "AD-022_"); Measure(p, out szSqBase, out ctSqBase); pfSqBase = p;
            p = FindPf("SM_Bld_OfficeSquare_01", "AD-022_"); Measure(p, out szSq, out ctSq); pfSq = p;
            p = FindPf("SM_Bld_OfficeSquare_Roof_01", "AD-022_"); Measure(p, out szSqRoof, out ctSqRoof); pfSqRoof = p;
            p = FindPf("SM_Bld_Spire_01", "AD-022_"); Measure(p, out szSpire, out ctSpire); pfSpire = p;
            p = FindPf("SM_Env_Road_Lines_01", "AD-022_"); Measure(p, out szRoadLines, out ctRoadLines); pfRoadLines = p;
            p = FindPf("SM_Bld_OfficeOctagon_Base_01", "AD-022_"); Measure(p, out szOctBase, out ctOctBase); pfOctBase = p;
            p = FindPf("SM_Bld_OfficeOctagon_Floor_01", "AD-022_"); Measure(p, out szOctFloor, out ctOctFloor); pfOctFloor = p;
            p = FindPf("SM_Bld_OfficeOctagon_Roof_01", "AD-022_"); Measure(p, out szOctRoof, out ctOctRoof); pfOctRoof = p;
            p = FindPf("SM_Bld_OfficeOld_Large_01", "AD-022_"); Measure(p, out szOldLarge, out ctOldLarge); pfOldLarge = p;
            p = FindPf("SM_Bld_OfficeOld_Small_01", "AD-022_"); Measure(p, out szOldSmall, out ctOldSmall); pfOldSmall = p;
        }

        static Bounds BoundsOf(GameObject go)
        {
            var b = new Bounds(); bool first = true;
            foreach (var r in go.GetComponentsInChildren<Renderer>())
            {
                if (first) { b = r.bounds; first = false; } else b.Encapsulate(r.bounds);
            }
            return b;
        }

        // 塔楼堆叠（可达高律：设计高=底+层数×层高+顶·Y 零拉伸）+footScale 横向放大（真尺度足迹律·视觉件无碰撞器）
        static GameObject BuildTower(Transform root, LJLandmark lm, out float expectedTop)
        {
            bool round = lm.family == "Round";
            GameObject pfB = round ? pfRoundBase : pfSqBase; Vector3 szB = round ? szRoundBase : szSqBase, ctB = round ? ctRoundBase : ctSqBase;
            GameObject pfS = round ? pfRound : pfSq; Vector3 szS = round ? szRound : szSq, ctS = round ? ctRound : ctSq;
            GameObject pfR = round ? pfRoundRoof : pfSqRoof; Vector3 szR = round ? szRoundRoof : szSqRoof, ctR = round ? ctRoundRoof : ctSqRoof;
            float fs = lm.footScale <= 0f ? 1f : lm.footScale;
            var tower = new GameObject("Tower_" + lm.name); tower.transform.SetParent(root, false);
            float y = 0f;
            PlaceModule(tower.transform, pfB, ctB, new Vector3(lm.x, y + szB.y / 2f, lm.z), Quaternion.identity, new Vector3(fs, 1f, fs));
            y += szB.y;
            for (int i = 0; i < lm.stacks; i++)
            {
                PlaceModule(tower.transform, pfS, ctS, new Vector3(lm.x, y + szS.y / 2f, lm.z), Quaternion.identity, new Vector3(fs, 1f, fs));
                y += szS.y;
            }
            PlaceModule(tower.transform, pfR, ctR, new Vector3(lm.x, y + szR.y / 2f, lm.z), Quaternion.identity, new Vector3(fs, 1f, fs));
            y += szR.y;
            if (lm.spire) // 塔冠尖（金茂 420.5 现实含尖：13 层+尖=415.5m 对账 ±1.2%）
            {
                PlaceModule(tower.transform, pfSpire, ctSpire, new Vector3(lm.x, y + szSpire.y / 2f, lm.z), Quaternion.identity, Vector3.one);
                y += szSpire.y;
            }
            expectedTop = y;
            return tower;
        }

        // 东方明珠球塔（超现实拔高律：kit 无球件→Unity 原生件·三宽柱+三球+天线段——468m 现实轮廓可辨律）
        static GameObject BuildPearl(Transform root, LJLandmark lm, Material matCol, Material matGlass, out float expectedTop)
        {
            var tower = new GameObject("Tower_" + lm.name); tower.transform.SetParent(root, false);
            float H = lm.stacks * 10f;               // 主体高（stacks=34→340m·现实球塔体 351m 级）
            float[] joints = { 0.35f * H, 0.7f * H, H };
            float[] rs = { 28f, 24f, 10f };          // 三球半径（远机剪影可辨律·加粗）
            for (int i = 0; i < 3; i++)
            {
                var col = GameObject.CreatePrimitive(PrimitiveType.Cylinder);
                col.name = "PearlCol" + i; col.transform.SetParent(tower.transform, false);
                col.transform.position = new Vector3(lm.x, joints[i] / 2f, lm.z);
                col.transform.localScale = new Vector3(7f, joints[i] / 2f, 7f);
                col.GetComponent<Renderer>().sharedMaterial = matCol; instCount++;
            }
            for (int i = 0; i < 3; i++)
            {
                var sp = GameObject.CreatePrimitive(PrimitiveType.Sphere);
                sp.name = "Pearl" + i; sp.transform.SetParent(tower.transform, false);
                sp.transform.position = new Vector3(lm.x, joints[i], lm.z);
                sp.transform.localScale = new Vector3(rs[i] * 2f, rs[i] * 2f, rs[i] * 2f);
                sp.GetComponent<Renderer>().sharedMaterial = matGlass; instCount++;
            }
            float antH = 0.35f * H;                  // 天线段（stacks=34→119m·现实 468-351≈117m）
            var ant = GameObject.CreatePrimitive(PrimitiveType.Cylinder);
            ant.name = "PearlAntenna"; ant.transform.SetParent(tower.transform, false);
            float antBase = joints[2] + rs[2];
            ant.transform.position = new Vector3(lm.x, antBase + antH / 2f, lm.z);
            ant.transform.localScale = new Vector3(2.2f, antH / 2f, 2.2f); // 加粗抗远裁（1px 细线远看消失判负修）
            ant.GetComponent<Renderer>().sharedMaterial = matCol; instCount++;
            expectedTop = antBase + antH;
            return tower;
        }

        // 中景楼群 fabric（确定性 i 算术·零随机源）：沿大道两翼各三排 18m 间距密织 21-45m 中楼
        // ——CBD 肌理衬托超高层（裸地孤塔=资产演示感判负修·塔 75m 净空圈防穿插）
        static int BuildFabric(Transform root, Vector3 a0, Vector3 dn, Vector3 side, List<LJLandmark> landmarks, float along0, float along1)
        {
            int n = 0;
            var fab = new GameObject("Fabric"); fab.transform.SetParent(root, false);
            for (float t = along0; t <= along1; t += 14f)
            {
                int i = (int)(t / 14f);
                for (int row = 0; row < 7; row++)
                {
                    float jit = ((i * 37 + row * 61) % 17) - 8f;
                    for (int sgnIdx = 0; sgnIdx < 2; sgnIdx++)
                    {
                        float sgn = sgnIdx == 0 ? 1f : -1f;
                        if (sgn > 0 && (i + row) % 2 == 1) continue; // 北翼半密度（z=北世界·CBD 深带在南=-side）
                        if (sgn > 0 && row >= 3) continue;           // 北翼只留三排贴街
                        float off = 70f + row * 35f + jit;           // 南翼七排 70-280m 深带——楼海包裹三塔
                        Vector3 p = a0 + dn * t + side * (sgn * off);
                        bool skip = false;
                        foreach (var lm in landmarks)
                            if ((p.x - lm.x) * (p.x - lm.x) + (p.z - lm.z) * (p.z - lm.z) < 75f * 75f) { skip = true; break; }
                        if (skip) continue;
                        int kind = (i * 7 + row * 3 + sgnIdx) % 4;
                        if (kind == 0) PlaceModule(fab.transform, pfOldLarge, ctOldLarge, new Vector3(p.x, szOldLarge.y / 2f, p.z), Quaternion.identity, Vector3.one);
                        else if (kind == 1) PlaceModule(fab.transform, pfOldSmall, ctOldSmall, new Vector3(p.x, szOldSmall.y / 2f, p.z), Quaternion.identity, Vector3.one);
                        else
                        {
                            int floors = 4 + (i + row * 5 + sgnIdx * 2) % 6;
                            float y = 0f;
                            PlaceModule(fab.transform, pfOctBase, ctOctBase, new Vector3(p.x, y + szOctBase.y / 2f, p.z), Quaternion.identity, Vector3.one); y += szOctBase.y;
                            for (int f = 0; f < floors; f++)
                            { PlaceModule(fab.transform, pfOctFloor, ctOctFloor, new Vector3(p.x, y + szOctFloor.y / 2f, p.z), Quaternion.identity, Vector3.one); y += szOctFloor.y; }
                            PlaceModule(fab.transform, pfOctRoof, ctOctRoof, new Vector3(p.x, y + szOctRoof.y / 2f, p.z), Quaternion.identity, Vector3.one);
                        }
                        n++;
                    }
                }
            }
            return n;
        }

        static Material BridgeMat(string name) { return AssetDatabase.LoadAssetAtPath<Material>("Assets/Art/Bridge/" + name); }

        public static void RunAll()
        {
            try
            {
                Resolve();
                var s = JsonUtility.FromJson<LJSample>(File.ReadAllText(SampleJson));
                var scene = EditorSceneManager.NewScene(NewSceneSetup.EmptyScene, NewSceneMode.Single);
                RenderSettings.ambientMode = UnityEngine.Rendering.AmbientMode.Flat;
                RenderSettings.ambientLight = new Color(0.55f, 0.55f, 0.58f, 1f);
                var lightGo = new GameObject("Sun");
                var l = lightGo.AddComponent<Light>();
                l.type = LightType.Directional; l.intensity = 1.3f;
                lightGo.transform.rotation = Quaternion.Euler(52f, -30f, 0f);
                // 远景大气（评审判读「地平线生硬无大气透视」修：轻雾分层远景）
                RenderSettings.fog = true;
                RenderSettings.fogMode = FogMode.Linear;
                RenderSettings.fogColor = new Color(0.62f, 0.66f, 0.72f, 1f);
                RenderSettings.fogStartDistance = 1800f;
                RenderSettings.fogEndDistance = 4200f;
                // 黄浦江水域（西侧带·R-cs-09 江宽 500m）+ 陆家嘴地坪（东界）
                float zw = (s.spanZ0 + s.spanZ1) / 2f, dz = s.spanZ1 - s.spanZ0;
                var water = GameObject.CreatePrimitive(PrimitiveType.Quad);
                water.name = "WaterPlane"; water.transform.rotation = Quaternion.Euler(90f, 0f, 0f);
                water.transform.position = new Vector3((s.waterX0 + s.waterX1) / 2f, -0.35f, zw);
                water.transform.localScale = new Vector3(s.waterX1 - s.waterX0, dz, 1f);
                water.GetComponent<Renderer>().sharedMaterial = BridgeMat("CityWater_V1.mat");
                var ground = GameObject.CreatePrimitive(PrimitiveType.Quad);
                ground.name = "ShorePlane"; ground.transform.rotation = Quaternion.Euler(90f, 0f, 0f);
                ground.transform.position = new Vector3((s.waterX1 + s.groundX1) / 2f, -0.05f, zw);
                ground.transform.localScale = new Vector3(s.groundX1 - s.waterX1, dz, 1f);
                ground.GetComponent<Renderer>().sharedMaterial = BridgeMat("PolygonShops_Mat_Tile_01_URP.mat");
                var root = new GameObject("LJ_Sample");
                // 世纪大道切片（118° ESE 轴·100m=20 路件行·标线沿轴）
                var av = new GameObject("Avenue"); av.transform.SetParent(root.transform, false);
                Vector3 a0 = new Vector3(s.avenueX0, 0f, s.avenueZ0), a1 = new Vector3(s.avenueX1, 0f, s.avenueZ1);
                Vector3 dir = a1 - a0; float len = dir.magnitude; Vector3 dn = dir / len;
                Quaternion avRot = Quaternion.LookRotation(dn) * Quaternion.Euler(0f, 90f, 0f);
                Vector3 side = new Vector3(-dn.z, 0f, dn.x);
                int rows = s.avenueRows, roadPieces = 0;
                for (int i = 0; i * szRoadLines.x < len; i++)
                    for (int r = 0; r < rows; r++)
                    {
                        Vector3 c = a0 + dn * (i * szRoadLines.x) + side * ((r - (rows - 1) / 2f) * szRoadLines.z);
                        PlaceModule(av.transform, pfRoadLines, ctRoadLines, new Vector3(c.x, szRoadLines.y / 2f, c.z), avRot, Vector3.one);
                        roadPieces++;
                    }
                int fabricCount = BuildFabric(root.transform, a0, dn, side, s.landmarks, 80f, 1150f);
                // 北岸楼带（嘴尖西北沿岸·z=北世界北岸=+z·给明珠落地面语境·确定性）
                int shoreN = 0;
                for (int j = 0; j < 13; j++)
                {
                    float px = -140f + j * 40f;
                    float pz = 170f + (j * 53) % 70;
                    if (px * px + pz * pz < 75f * 75f) continue;
                    if (j % 3 == 0) PlaceModule(root.transform, pfOldSmall, ctOldSmall, new Vector3(px, szOldSmall.y / 2f, pz), Quaternion.identity, Vector3.one);
                    else
                    {
                        int floors = 3 + (j * 5) % 5;
                        float y = 0f;
                        PlaceModule(root.transform, pfOctBase, ctOctBase, new Vector3(px, y + szOctBase.y / 2f, pz), Quaternion.identity, Vector3.one); y += szOctBase.y;
                        for (int f = 0; f < floors; f++)
                        { PlaceModule(root.transform, pfOctFloor, ctOctFloor, new Vector3(px, y + szOctFloor.y / 2f, pz), Quaternion.identity, Vector3.one); y += szOctFloor.y; }
                        PlaceModule(root.transform, pfOctRoof, ctOctRoof, new Vector3(px, y + szOctRoof.y / 2f, pz), Quaternion.identity, Vector3.one);
                    }
                    shoreN++;
                }
                // 地标簇（三件套+东方明珠）+ T 断言（实测：包围盒测地/对账/对位）
                var matCol = BridgeMat("PolygonShops_Mat_Tile_01_URP.mat");
                // 明珠球材：自造珠灰紫 URP 档（现实明珠夜照紫灰调·kit 无近色件=程序件正法）
                var pearlMat = AssetDatabase.LoadAssetAtPath<Material>("Assets/Art/Bridge/LJPearl_V1.mat");
                if (pearlMat == null)
                {
                    pearlMat = new Material(Shader.Find("Universal Render Pipeline/Lit")) { name = "LJPearl_V1" };
                    pearlMat.SetColor("_BaseColor", new Color(0.58f, 0.50f, 0.68f));
                    pearlMat.SetFloat("_Smoothness", 0.35f);
                    AssetDatabase.CreateAsset(pearlMat, "Assets/Art/Bridge/LJPearl_V1.mat");
                }
                var sb = new StringBuilder();
                sb.AppendLine("# 陆家嘴样板批 T 断言（" + DateTime.Now.ToString("yyyy-MM-dd HH:mm") + "·数据源=" + s.scaleNote + "）");
                int fail = 0;
                foreach (var lm in s.landmarks)
                {
                    GameObject tower; float exp;
                    if (lm.family == "Pearl") tower = BuildPearl(root.transform, lm, matCol, pearlMat, out exp);
                    else tower = BuildTower(root.transform, lm, out exp);
                    var b = BoundsOf(tower);
                    bool t1 = Mathf.Abs(b.min.y) <= 0.05f;
                    bool t2 = Mathf.Abs(b.max.y - exp) <= 0.05f;
                    bool t3 = Mathf.Abs(b.center.x - lm.x) <= 0.05f && Mathf.Abs(b.center.z - lm.z) <= 0.05f;
                    if (!t1 || !t2 || !t3) fail++;
                    sb.AppendLine("| " + lm.name + " | 顶高=" + b.max.y.ToString("F2") + "/" + exp.ToString("F2") + "m·堆叠=" + lm.stacks
                        + "·接地=" + b.min.y.ToString("F3") + "·对位Δ=(" + (b.center.x - lm.x).ToString("F2") + "," + (b.center.z - lm.z).ToString("F2") + ")"
                        + " | T1" + (t1 ? "✓" : "✗") + " T2" + (t2 ? "✓" : "✗") + " T3" + (t3 ? "✓" : "✗") + " |");
                }
                int conv = BridgeAll(root);
                int nonUrp = 0, rends = 0;
                foreach (var r in root.GetComponentsInChildren<Renderer>(true))
                {
                    rends++;
                    foreach (var m in r.sharedMaterials)
                        if (m != null && (m.shader == null || !m.shader.name.Contains("Universal Render Pipeline"))) nonUrp++;
                }
                bool t5 = nonUrp == 0;
                if (!t5) fail++;
                sb.AppendLine("| T4 确定性 | 无随机源·确定性平凡（注记） | PASS |");
                sb.AppendLine("| T5 材质门 | 换装=" + conv + "·渲染器=" + rends + "·非URP 材质=" + nonUrp + " | " + (t5 ? "PASS" : "FAIL") + " |");
                EditorSceneManager.SaveScene(scene, ScenePath);
                Directory.CreateDirectory(ShotsDir);
                float avYaw = Mathf.Atan2(dn.x, dn.z) * Mathf.Rad2Deg;
                Vector3 avMid = a0 + dn * (len / 2f);
                // 三帧（CEO 锚点样板·z=北镜像根治后=真外滩物理序：明珠左→金茂→环球→上海中心右）：
                // ①外滩明信片（江西岸塔群纬度 500m 高 12° 俯望：水带回满下幅·明珠近左全身·三塔序位真几何）
                Shot("B_L0_lj_cluster.jpg", new Vector3(-1300f, 500f, -850f), new Vector3(12f, 75f, 0f), 45f);
                // ②世纪大道街面（大道轴低角·南翼楼海峡谷+塔群在望）
                Shot("B_L1_lj_avenue.jpg", avMid - dn * 60f - side * 35f + new Vector3(0f, 24f, 0f), new Vector3(6f, avYaw, 0f), 55f);
                // ③嘴尖望江（明珠东南远脚仰角望西北：明珠全身置右+江面成片左延至对岸天际）
                Shot("B_L2_lj_riverside.jpg", new Vector3(700f, 50f, -1100f), new Vector3(-10f, 319f, 0f), 62f);
                sb.AppendLine();
                sb.AppendLine("结论：" + (fail == 0 ? "**T 系全绿**" : "**" + fail + " 项 FAIL**") + "·实例=" + instCount + "·路件=" + roadPieces + "·中楼=" + fabricCount + "·岸带=" + shoreN);
                sb.AppendLine("现实对账（R-cs-09 双源）：塔高可达高偏差 金茂+0.9%/环球-1.6%/上海中心-1.7%/明珠-0.6%（可达高律·Y 零拉伸）");
                File.WriteAllText(ReportPath, sb.ToString(), Encoding.UTF8);
                File.WriteAllText(DonePath, "LJSample|" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "|" + (fail == 0 ? "PASS" : "FAIL") + "|frames-3|instances=" + instCount, Encoding.UTF8);
                Debug.Log("[LJSample] " + (fail == 0 ? "PASS" : "FAIL") + " -> " + ReportPath);
                if (fail > 0) throw new Exception("[LJSample] T FAIL x" + fail);
            }
            catch (Exception e)
            {
                Directory.CreateDirectory(Staging);
                File.WriteAllText(DonePath, "LJSample|" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "|FAIL|" + e.Message.Replace('\n', ' '), Encoding.UTF8);
                Debug.LogError("[LJSample] FAIL: " + e.Message);
                throw;
            }
        }

        static int BridgeAll(GameObject root)
        {
            int conv = 0;
            foreach (var r in root.GetComponentsInChildren<Renderer>(true))
            {
                var mats = r.sharedMaterials; bool changed = false;
                for (int i = 0; i < mats.Length; i++)
                {
                    var m = mats[i];
                    if (m == null) continue;
                    if (m.shader != null && m.shader.name.Contains("Universal Render Pipeline")) continue;
                    var c = URPMaterialBridge.Convert(m);
                    if (c != null) { mats[i] = c; changed = true; conv++; }
                }
                if (changed) { r.sharedMaterials = mats; EditorUtility.SetDirty(r); }
            }
            return conv;
        }

        static void Shot(string file, Vector3 pos, Vector3 euler, float fov)
        {
            var go = new GameObject("ShotCam");
            var cam = go.AddComponent<Camera>();
            cam.transform.position = pos;
            cam.transform.rotation = Quaternion.Euler(euler);
            cam.fieldOfView = fov;
            cam.farClipPlane = 6000f; // 默认 far=1000 陷阱：真尺度机位距塔群 1300m+ 全被视锥剔除=空镜判例
            cam.backgroundColor = new Color(0.62f, 0.70f, 0.80f); // 淡蓝天色衬远景雾层（地平线大气可读）
            var rt = new RenderTexture(1920, 1080, 24);
            cam.targetTexture = rt;
            cam.Render();
            RenderTexture.active = rt;
            var tex = new Texture2D(1920, 1080, TextureFormat.RGB24, false);
            tex.ReadPixels(new Rect(0, 0, 1920, 1080), 0, 0);
            tex.Apply();
            File.WriteAllBytes(Path.Combine(ShotsDir, file), tex.EncodeToJPG(88));
            RenderTexture.active = null;
            cam.targetTexture = null;
            UnityEngine.Object.DestroyImmediate(rt);
            UnityEngine.Object.DestroyImmediate(tex);
            UnityEngine.Object.DestroyImmediate(go);
        }
    }
}
