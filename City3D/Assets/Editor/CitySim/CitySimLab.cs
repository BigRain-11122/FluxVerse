using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine;

namespace CitySim
{
    /// <summary>
    /// CitySimLab 编辑器批量入口（零采购·全本地·批建造 SOP 同构）。
    /// 菜单：CitySim/1 Build Lab（建场景）· 2 SelfCheck（断言）· 3 Capture Frames（S_ 系判据帧）· 0 RunAll。
    /// 批模式：-executeMethod CitySim.CitySimLab.RunAll（fail-loud .done 哨兵）。
    /// </summary>
    public static class CitySimLab
    {
        static string CityRoot { get { return Path.GetFullPath(Path.Combine(Application.dataPath, "..")); } }
        static string Staging { get { return Path.GetFullPath(Path.Combine(CityRoot, "..", "City3D-staging")); } }
        static string ShotsDir { get { return Path.Combine(Staging, "shots5"); } }
        static string ScenePath { get { return Path.Combine("Assets", "Scenes", "CitySimLab.unity"); } }
        static string DonePath { get { return Path.Combine(Staging, "citysim-run.done"); } }

        public const int SEED = 20260930;
        public const float MORNING_MIN = 495f; // 08:15 早高峰中段
        public const float NOON_MIN = 720f;    // 12:00 收口

        // ---------------- 场景 ----------------

        [MenuItem("CitySim/1 Build Lab Scene")]
        public static void BuildScene()
        {
            var scene = EditorSceneManager.NewScene(NewSceneSetup.EmptyScene, NewSceneMode.Single);
            RenderSettings.ambientMode = UnityEngine.Rendering.AmbientMode.Flat;
            RenderSettings.ambientLight = new Color(0.55f, 0.55f, 0.58f, 1f);

            var lightGo = new GameObject("Sun");
            var l = lightGo.AddComponent<Light>();
            l.type = LightType.Directional; l.intensity = 1.3f;
            lightGo.transform.rotation = Quaternion.Euler(52f, -30f, 0f);

            // 相机三档（参数单 §五 同构：L0 总览 50-55°/L1 区景 55°/L2 实体 60°；FOV 45）
            MakeCam("Cam_L0", new Vector3(0f, 340f, 300f), new Vector3(55f, 180f, 0f));
            MakeCam("Cam_L1", new Vector3(-102.5f, 110f, 182.5f), new Vector3(55f, 180f, 0f)); // GAME 商坊=block3
            MakeCam("Cam_L2", new Vector3(0f, 70f, 60f), new Vector3(60f, 180f, 0f));
            MakeCam("Cam_Cov", new Vector3(0f, 430f, 330f), new Vector3(58f, 180f, 0f));

            var driverGo = new GameObject("CitySimDriver");
            var driver = driverGo.AddComponent<CitySimDriver>();
            driver.simSeed = SEED;
            driver.Init(); // 只初始化数据核心；可视化在捕获时按需重建（Mesh=运行时件不入场景存档）

            if (!Directory.Exists(Path.Combine(CityRoot, "Assets", "Scenes")))
                Directory.CreateDirectory(Path.Combine(CityRoot, "Assets", "Scenes"));
            EditorSceneManager.SaveScene(scene, ScenePath);
            Debug.Log("[CitySim] Lab scene built: " + ScenePath);
        }

        static Camera MakeCam(string name, Vector3 pos, Vector3 euler)
        {
            var go = new GameObject(name);
            var cam = go.AddComponent<Camera>();
            cam.fieldOfView = 45f; cam.nearClipPlane = 1f; cam.farClipPlane = 3000f;
            cam.enabled = false; // 按需 Render，不走游戏视图
            cam.clearFlags = CameraClearFlags.SolidColor;
            cam.backgroundColor = new Color(0.10f, 0.12f, 0.16f);
            go.transform.position = pos;
            go.transform.rotation = Quaternion.Euler(euler);
            var cd = go.AddComponent<UnityEngine.Rendering.Universal.UniversalAdditionalCameraData>();
            cd.renderPostProcessing = false; // 白盒判据帧=零后处理确定性
            return cam;
        }

        // ---------------- 断言（闸3 机检·fail-loud） ----------------

        [MenuItem("CitySim/2 SelfCheck")]
        public static void RunSelfCheck()
        {
            var bp = SimBlueprint.Load(CitySimDriver.DefaultBlueprintPath());
            if (bp == null) throw new Exception("[CitySim] blueprint missing: " + CitySimDriver.DefaultBlueprintPath());
            var sb = new StringBuilder();
            sb.AppendLine("# CitySim 自检报告 v0.1（闸3 机检·" + DateTime.Now.ToString("yyyy-MM-dd HH:mm") + "）");
            sb.AppendLine("> 溯源=CEO 令 2026-09-30（T1 代决·A 档物理投影层）·seed=" + SEED + "·R0 数据源=td-organic-r0.json");
            int fail = 0;

            // A1 路网连通性：BFS 单连通分量
            var core = new CitySimCore(bp, SEED);
            var seen = new bool[core.roadCount];
            var queue = new Queue<int>(); queue.Enqueue(0); seen[0] = true; int reach = 1;
            while (queue.Count > 0)
            {
                int n = queue.Dequeue();
                foreach (int m in core.nbr[n]) if (!seen[m]) { seen[m] = true; reach++; queue.Enqueue(m); }
            }
            bool a1 = reach == core.roadCount;
            sb.AppendLine("| A1 路网单连通 | reach=" + reach + "/" + core.roadCount + " | " + (a1 ? "PASS" : "FAIL") + " |");
            if (!a1) fail++;

            // A2 地块门位：每块 8 格内有路
            int noGate = 0;
            foreach (var p in core.parcels) if (p.gateNode < 0) noGate++;
            bool a2 = noGate == 0;
            sb.AppendLine("| A2 地块门位全通 | 无门位块=" + noGate + "/" + core.parcels.Count + " | " + (a2 ? "PASS" : "FAIL") + " |");
            if (!a2) fail++;

            // A3 基线全量通勤：12:00 前全员抵达、零滞留
            core.Reset(); core.FastForward(NOON_MIN);
            bool a3 = core.arrived == core.agents.Count && core.stuck == 0;
            sb.AppendLine("| A3 基线全量通勤 | agents=" + core.agents.Count + " arrived=" + core.arrived + " stuck=" + core.stuck + " @T=" + NOON_MIN + " | " + (a3 ? "PASS" : "FAIL") + " |");
            if (!a3) fail++;

            // A4 确定性：同 seed 双跑对账
            var c1 = new CitySimCore(bp, SEED); c1.Reset(); c1.FastForward(600f);
            var c2 = new CitySimCore(bp, SEED); c2.Reset(); c2.FastForward(600f);
            int t1 = c1.TopCongested(1)[0], t2 = c2.TopCongested(1)[0];
            bool a4 = c1.arrived == c2.arrived && t1 == t2;
            sb.AppendLine("| A4 seed 确定性 | arrived=" + c1.arrived + "/" + c2.arrived + " topCongNode=" + t1 + "/" + t2 + " | " + (a4 ? "PASS" : "FAIL") + " |");
            if (!a4) fail++;

            // A5 改路重路由：封最忙桥格群 -> 无人踩封闭格
            var c3 = new CitySimCore(bp, SEED); c3.Reset(); c3.FastForward(MORNING_MIN);
            int busyBridge = BusiestBridgeNode(c3);
            int usedBaseline = CountPathUse(c3, busyBridge);
            c3.Reset();
            c3.CloseBridgeClusterNear(c3.bp.roadX[busyBridge], c3.bp.roadY[busyBridge], 1);
            c3.FastForward(MORNING_MIN);
            int usedAfter = 0;
            var closedNodes = new HashSet<int>();
            for (int n = 0; n < c3.roadCount; n++) if (c3.closed[n]) closedNodes.Add(n);
            foreach (var a in c3.agents)
                if (a.path != null)
                    foreach (int n in a.path) if (closedNodes.Contains(n)) { usedAfter++; break; }
            bool a5 = usedAfter == 0 && c3.stuck == 0;
            sb.AppendLine("| A5 封桥重路由 | busyBridge=cell(" + c3.bp.roadX[busyBridge] + "," + c3.bp.roadY[busyBridge] + ") 基线穿行=" + usedBaseline + " 封后穿行=" + usedAfter + " stuck=" + c3.stuck + " | " + (a5 ? "PASS" : "FAIL") + " |");
            if (!a5) fail++;

            sb.AppendLine();
            sb.AppendLine("结论：" + (fail == 0 ? "**五断言全绿**" : ("**" + fail + " 项 FAIL**")) + "·供需连锁可验=" + (a3 && a5 ? "是" : "否"));
            sb.AppendLine("覆盖统计：RES 地块公共服务覆盖 " + c3.CoveredResCount() + "/" + c3.ResParcelCount() + "（半径 " + CitySimCore.COVERAGE_RADIUS_M + "m）");
            sb.AppendLine("通勤规模：就业人口 " + c3.ResBlockResidentTotal() + "·agent 全量可见（无统计聚合·白盒演示级）");

            string path = Path.Combine(Staging, "citysim-selfcheck.md");
            File.WriteAllText(path, sb.ToString(), Encoding.UTF8);
            Debug.Log("[CitySim] selfcheck -> " + path + " | " + (fail == 0 ? "PASS" : "FAIL " + fail));
            if (fail > 0) throw new Exception("[CitySim] SelfCheck FAIL x" + fail + " -> " + path);
        }

        static int BusiestBridgeNode(CitySimCore core)
        {
            int best = -1, bestUse = -1;
            for (int n = 0; n < core.roadCount; n++)
            {
                if (core.bp.roadBridge[n] != 1) continue;
                int use = CountPathUse(core, n);
                if (use > bestUse) { bestUse = use; best = n; }
            }
            return best >= 0 ? best : 0;
        }

        static int CountPathUse(CitySimCore core, int node)
        {
            int use = 0;
            foreach (var a in core.agents)
                if (a.path != null && a.path.Contains(node)) use++;
            return use;
        }

        // ---------------- 判据帧（S_ 系） ----------------

        [MenuItem("CitySim/3 Capture Frames")]
        public static void CaptureFrames()
        {
            if (!File.Exists(ScenePath)) BuildScene();
            EditorSceneManager.OpenScene(ScenePath, OpenSceneMode.Single);
            var driver = UnityEngine.Object.FindObjectOfType<CitySimDriver>();
            if (driver == null) throw new Exception("[CitySim] driver missing in lab scene");
            driver.Init();
            driver.BuildVisuals();
            Directory.CreateDirectory(ShotsDir);

            var camL0 = FindCam("Cam_L0");
            var camL1 = FindCam("Cam_L1");
            var camL2 = FindCam("Cam_L2");
            var camCov = FindCam("Cam_Cov");

            // 场景一：基线早高峰 08:15
            driver.ResetAndRunTo(MORNING_MIN);
            driver.AimHudAt(camL0);
            RenderCam(camL0, Path.Combine(ShotsDir, "S_L0_morning.jpg"));
            driver.AimHudAt(camL1);
            RenderCam(camL1, Path.Combine(ShotsDir, "S_L1_gameblock.jpg"));
            AimAt(camL2, driver.core.TopCongested(1)[0], driver);
            RenderCam(camL2, Path.Combine(ShotsDir, "S_L2_congestion.jpg"));
            driver.AimHudAt(camCov);
            RenderCam(camCov, Path.Combine(ShotsDir, "S_L0_coverage.jpg"));
            int baselineTop = driver.core.TopCongested(1)[0];
            float baselineTopCong = driver.core.Congestion(baselineTop);
            int baselineAgents = driver.core.agents.Count;

            // 场景二：封最忙桥格群 -> 重路由对比
            int busyBridge = BusiestBridgeNode(driver.core);
            int usedBaseline = CountPathUse(driver.core, busyBridge);
            driver.core.Reset();
            driver.core.CloseBridgeClusterNear(driver.core.bp.roadX[busyBridge], driver.core.bp.roadY[busyBridge], 1);
            driver.core.FastForward(MORNING_MIN);
            driver.ApplyVisuals();
            int usedAfter = CountPathUse(driver.core, busyBridge);
            driver.AimHudAt(camL0);
            RenderCam(camL0, Path.Combine(ShotsDir, "S_L0_reroute.jpg"));
            AimAt(camL2, driver.core.TopCongested(1)[0], driver);
            RenderCam(camL2, Path.Combine(ShotsDir, "S_L2_reroute_after.jpg"));

            var sb = new StringBuilder();
            sb.AppendLine("# CitySim S_ 系判据帧捕获报告（" + DateTime.Now.ToString("yyyy-MM-dd HH:mm") + "）");
            sb.AppendLine("> 场景一=基线早高峰 T=" + MinToClock(MORNING_MIN) + "；场景二=封桥重路由同钟点对比。");
            sb.AppendLine("基线：agents=" + baselineAgents + " arrived=" + driver.core.arrived + "（封桥后口径） transit=" + driver.core.inTransit + " stuck=" + driver.core.stuck);
            sb.AppendLine("拥堵 TOP1：基线 cell(" + driver.core.nodeCellX[baselineTop] + "," + driver.core.nodeCellY[baselineTop] + ") lvl=" + baselineTopCong.ToString("F2")
                + " -> 封桥后 cell(" + driver.core.nodeCellX[driver.core.TopCongested(1)[0]] + "," + driver.core.nodeCellY[driver.core.TopCongested(1)[0]] + ")");
            sb.AppendLine("封桥格群=cell(" + driver.core.bp.roadX[busyBridge] + "," + driver.core.bp.roadY[busyBridge] + ") r=1·基线穿行 " + usedBaseline + " -> 封后 " + usedAfter + "（重路由生效判据=0）");
            sb.AppendLine("帧：S_L0_morning / S_L1_gameblock / S_L2_congestion / S_L0_coverage / S_L0_reroute / S_L2_reroute_after（JPEG q88）");
            string rp = Path.Combine(Staging, "citysim-capture-report.md");
            File.WriteAllText(rp, sb.ToString(), Encoding.UTF8);
            Debug.Log("[CitySim] frames -> " + ShotsDir + " | report " + rp);
        }

        static void AimAt(Camera cam, int node, CitySimDriver driver)
        {
            var c = driver.core.bp.CellCenter(driver.core.nodeCellX[node], driver.core.nodeCellY[node]);
            cam.transform.position = new Vector3(c.x, 115f, c.z + 95f); // 拉远=拥堵格+周边路网同框
            cam.transform.rotation = Quaternion.Euler(60f, 180f, 0f);
        }

        static Camera FindCam(string name)
        {
            var go = GameObject.Find(name);
            if (go == null) throw new Exception("[CitySim] camera missing: " + name);
            return go.GetComponent<Camera>();
        }

        static string MinToClock(float min)
        {
            return string.Format("{0:00}:{1:00}", Mathf.FloorToInt(min / 60f), Mathf.FloorToInt(min % 60f));
        }

        static void RenderCam(Camera cam, string path)
        {
            int w = 1920, h = 1080;
            var rt = new RenderTexture(w, h, 24);
            cam.targetTexture = rt;
            cam.Render();
            var prev = RenderTexture.active;
            RenderTexture.active = rt;
            var tex = new Texture2D(w, h, TextureFormat.RGB24, false);
            tex.ReadPixels(new Rect(0, 0, w, h), 0, 0);
            tex.Apply();
            File.WriteAllBytes(path, tex.EncodeToJPG(88)); // JPEG q88 证据律
            RenderTexture.active = prev;
            cam.targetTexture = null;
            UnityEngine.Object.DestroyImmediate(tex);
            rt.Release();
            UnityEngine.Object.DestroyImmediate(rt);
        }

        // ---------------- 批入口 ----------------

        public static void RunAll()
        {
            try
            {
                BuildScene();
                RunSelfCheck();
                CaptureFrames();
                WriteDone("PASS|selfcheck-5-green|frames-6|seed=" + SEED);
                Debug.Log("[CitySim] RunAll PASS");
            }
            catch (Exception e)
            {
                WriteDone("FAIL|" + e.Message.Replace('\n', ' '));
                Debug.LogError("[CitySim] RunAll FAIL: " + e.Message);
                throw;
            }
        }

        static void WriteDone(string status)
        {
            Directory.CreateDirectory(Staging);
            File.WriteAllText(DonePath, "CitySimRun|" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "|" + status, Encoding.UTF8);
        }
    }
}
