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
    /// CitySim v0.2 首件：GAME 城 block3 试点街坊 parcel-driven 模块壳装配（CEO 令 09-30 并行开工令）。
    /// 排型=8 lot 背靠背双排（25×32.5m·CS 路侧 32m 进深律+死核双排律）·门位一律朝街。
    /// v3 判例：Synty 件 pivot=角点非中心（z/y 界[0,+s]实测）——放置一律偏移感知：
    ///   Measure 回 (size, center)·pivotPos = worldCenter - R∘(scale·center)（禁按中心盲摆=墙外飘+悬浮双病根）。
    /// 断言：A1 seed 确定性（双建对账·manifest 剔除根名）·A2 门洞通路（三高穿门 Linecast）·A3 贴线零退线（±0.05m）。
    /// 批模式：-executeMethod CitySim.CitySimShellBuilder.RunAll（fail-loud .done 哨兵·B_ 系判据帧）。
    /// </summary>
    public static class CitySimShellBuilder
    {
        static string CityRoot { get { return Path.GetFullPath(Path.Combine(Application.dataPath, "..")); } }
        static string Staging { get { return Path.GetFullPath(Path.Combine(CityRoot, "..", "City3D-staging")); } }
        static string ShotsDir { get { return Path.Combine(Staging, "shots6"); } }
        static string ScenePath { get { return Path.Combine("Assets", "Scenes", "CitySim_PilotBlock.unity"); } }
        static string DonePath { get { return Path.Combine(Staging, "citysim-shell.done"); } }
        static string ReportPath { get { return Path.Combine(Staging, "citysim-shell-report.md"); } }

        public const int SEED = 20260930;

        // block3 试点几何（blueprint：GAME SHOP·solid rect cells x∈[3,22]×y∈[48,60]·cellM=5·origin=(-160,-160)）
        const float X0 = -145f, Z0 = 80f, Z1 = 145f;
        const float LotW = 25f, LotD = 32.5f;
        const float FacadeTol = 0.05f;
        const int COLS = 4, ROWS = 2;

        // AD-NNN 实锚（运行时解析）·sz=size·ct=pivot 到 bounds 中心的偏移
        static GameObject pfFloor, pfWall, pfWallDoor, pfWallWin, pfCeil, pfUpWall, pfUpWin;
        static Vector3 szFloor, ctFloor, szWall, ctWall, szWallDoor, ctWallDoor, szWallWin, ctWallWin, szCeil, ctCeil, szUpWall, ctUpWall, szUpWin, ctUpWin;

        struct DoorInfo { public float x; public float z; public float outX; public float outZ; } // out=朝街外向（v4 向量化·四向街通用）
        static readonly List<DoorInfo> doors = new List<DoorInfo>();
        static readonly List<Bounds> lotBounds = new List<Bounds>();
        static int instCount;

        [MenuItem("CitySim/4 Build Pilot Shells")]
        public static void Build()
        {
            ResolvePrefabs();
            var scene = EditorSceneManager.NewScene(NewSceneSetup.EmptyScene, NewSceneMode.Single);
            RenderSettings.ambientMode = UnityEngine.Rendering.AmbientMode.Flat;
            RenderSettings.ambientLight = new Color(0.55f, 0.55f, 0.58f, 1f);
            var lightGo = new GameObject("Sun");
            var l = lightGo.AddComponent<Light>();
            l.type = LightType.Directional; l.intensity = 1.3f;
            lightGo.transform.rotation = Quaternion.Euler(52f, -30f, 0f);

            MakeCam("B_L1a", new Vector3(-95f, 110f, 182.5f), new Vector3(55f, 180f, 0f));
            MakeCam("B_L1b", new Vector3(-95f, 110f, 42.5f), new Vector3(55f, 0f, 0f));
            MakeCam("B_L2a", new Vector3(-95f, 24f, 160f), new Vector3(60f, 180f, 0f));
            MakeCam("B_L2b", new Vector3(-160f, 24f, 160f), new Vector3(60f, 205f, 0f));

            var root = new GameObject("PilotShells");
            BuildBlock(root.transform);
            int bridged = BridgePilotMaterials(root);
            EditorSceneManager.SaveScene(scene, ScenePath);
            Debug.Log("[Shell] scene saved: " + ScenePath + " instances=" + instCount + " bridged_mats=" + bridged
                + " | wall=" + szWall.ToString("F2") + " ct=" + ctWall.ToString("F2")
                + " | floor=" + szFloor.ToString("F2") + " door=" + szWallDoor.ToString("F2"));
        }

        // 试点壳材质过桥（复用 URPMaterialBridge.Convert：Standard→URP/Lit·批 A 八包未过桥=品红根因·v1 假阴性判例族）
        static int BridgePilotMaterials(GameObject root)
        {
            int conv = 0, skip = 0, rends = 0;
            foreach (var r in root.GetComponentsInChildren<Renderer>(true))
            {
                rends++;
                var mats = r.sharedMaterials;
                bool changed = false;
                for (int i = 0; i < mats.Length; i++)
                {
                    var m = mats[i];
                    if (m == null) continue;
                    if (m.shader != null && m.shader.name.Contains("Universal Render Pipeline")) { skip++; continue; }
                    var c = URPMaterialBridge.Convert(m);
                    if (c != null) { mats[i] = c; changed = true; conv++; }
                }
                if (changed) { r.sharedMaterials = mats; EditorUtility.SetDirty(r); }
            }
            Debug.Log("[Shell] bridge: renderers=" + rends + " converted=" + conv + " skipped_urp=" + skip);
            return conv;
        }

        // ---------------- 壳装配 ----------------

        static void BuildBlock(Transform parent)
        {
            doors.Clear(); lotBounds.Clear(); instCount = 0;
            for (int row = 0; row < ROWS; row++)
                for (int col = 0; col < COLS; col++)
                {
                    float x0 = X0 + col * LotW, x1 = x0 + LotW;
                    bool frontAtHighZ = row == 0;
                    float zA = frontAtHighZ ? Z1 - LotD : Z0;
                    float zB = frontAtHighZ ? Z1 : Z0 + LotD;
                    BuildLot(parent, row, col, x0, x1, zA, zB, frontAtHighZ, !frontAtHighZ);
                }
        }

        static void BuildLot(Transform parent, int row, int col, float x0, float x1, float zA, float zB, bool frontAtHighZ, bool mixed)
        {
            var lotGo = new GameObject("Lot_r" + row + "c" + col);
            lotGo.transform.SetParent(parent, false);
            var lot = lotGo.transform;
            float zIn = Math.Min(zA, zB), zOut = Math.Max(zA, zB);
            float zFront = frontAtHighZ ? zOut : zIn;
            float zBack = frontAtHighZ ? zIn : zOut;

            // 地板（逐轴铺满：每轴独立 BestN+缩放·适配任意长宽比地板块）
            TileFloor(lot, x0, x1, zIn, zOut, 0f, pfFloor, szFloor, ctFloor);

            // 地面层墙环：临街边（门+窗两翼）·背街边·两侧边
            EdgeX(lot, x0, x1, zFront, 0f, frontAtHighZ, true);
            EdgeX(lot, x0, x1, zBack, 0f, !frontAtHighZ, false);
            EdgeZ(lot, zIn, zOut, x0, 0f, false);
            EdgeZ(lot, zIn, zOut, x1, 0f, false);

            // 首层顶板（前排=屋顶·后排=上层楼板）
            float ceilTop = TileFloor(lot, x0, x1, zIn, zOut, szWall.y, pfCeil, szCeil, ctCeil);

            if (mixed)
            {
                // 上层住宅环（AD-021 UpperFloor·临街边中心=Window 件）+顶帽
                EdgeUpX(lot, x0, x1, zFront, ceilTop, frontAtHighZ, true);
                EdgeUpX(lot, x0, x1, zBack, ceilTop, !frontAtHighZ, false);
                EdgeUpZ(lot, zIn, zOut, x0, ceilTop, false);
                EdgeUpZ(lot, zIn, zOut, x1, ceilTop, false);
                TileFloor(lot, x0, x1, zIn, zOut, ceilTop + szUpWall.y, pfCeil, szCeil, ctCeil);
            }

            var b = new Bounds(); bool first = true;
            foreach (var r in lotGo.GetComponentsInChildren<Renderer>())
            {
                if (first) { b = r.bounds; first = false; } else b.Encapsulate(r.bounds);
            }
            if (!first) lotBounds.Add(b);
        }

        static float TileFloor(Transform lot, float x0, float x1, float zIn, float zOut, float yBase, GameObject pf, Vector3 sz, Vector3 ct)
        {
            float spanX = x1 - x0, spanZ = zOut - zIn;
            int nX = BestN(spanX, sz.x), nZ = BestN(spanZ, sz.z);
            float sx = spanX / (nX * sz.x), szz = spanZ / (nZ * sz.z);
            for (int i = 0; i < nX; i++)
                for (int j = 0; j < nZ; j++)
                {
                    Vector3 wc = new Vector3(x0 + (i + 0.5f) * spanX / nX, yBase + sz.y / 2f, zIn + (j + 0.5f) * spanZ / nZ);
                    PlaceModule(lot, pf, ct, wc, Quaternion.identity, new Vector3(sx, 1f, szz), false);
                }
            return yBase + sz.y;
        }

        // X 向边：outerAtHighZ=外立面朝 +Z·withDoor=临街门位
        static void EdgeX(Transform lot, float x0, float x1, float zEdge, float yBase, bool outerAtHighZ, bool withDoor)
        {
            float span = x1 - x0;
            int n = BestN(span, LongOf(szWall));
            int doorIdx = withDoor ? n / 2 : -1;
            for (int i = 0; i < n; i++)
            {
                GameObject pf; Vector3 s2, c2;
                if (withDoor && i == doorIdx) { pf = pfWallDoor; s2 = szWallDoor; c2 = ctWallDoor; }
                else if (withDoor && Math.Abs(i - doorIdx) == 1) { pf = pfWallWin; s2 = szWallWin; c2 = ctWallWin; }
                else { pf = pfWall; s2 = szWall; c2 = ctWall; }
                float thin2 = Math.Min(s2.x, s2.z);
                float si = (span / n) / LongOf(s2);
                bool longX2 = s2.x >= s2.z;
                Quaternion rot = longX2 ? Quaternion.identity : Quaternion.Euler(0f, 90f, 0f);
                Vector3 scale = longX2 ? new Vector3(si, 1f, 1f) : new Vector3(1f, 1f, si);
                float wcz = outerAtHighZ ? zEdge - thin2 / 2f : zEdge + thin2 / 2f;
                Vector3 wc = new Vector3(x0 + (i + 0.5f) * span / n, yBase + s2.y / 2f, wcz);
                PlaceModule(lot, pf, c2, wc, rot, scale, false);
                if (withDoor && i == doorIdx) doors.Add(new DoorInfo { x = wc.x, z = zEdge, outX = 0f, outZ = outerAtHighZ ? 1f : -1f });
            }
        }

        // Z 向边（侧墙）：xEdge=边线 X·外朝 -X（x0 侧）或 +X（x1 侧）
        static void EdgeZ(Transform lot, float zIn, float zOut, float xEdge, float yBase, bool withDoor)
        {
            float span = zOut - zIn;
            int n = BestN(span, LongOf(szWall));
            bool outerAtLowX = xEdge <= X0 + 0.01f;
            for (int i = 0; i < n; i++)
            {
                float thin2 = Math.Min(szWall.x, szWall.z);
                float si = (span / n) / LongOf(szWall);
                bool longX2 = szWall.x >= szWall.z;
                Quaternion rot = longX2 ? Quaternion.Euler(0f, 90f, 0f) : Quaternion.identity;
                Vector3 scale = longX2 ? new Vector3(si, 1f, 1f) : new Vector3(1f, 1f, si);
                float wcx = outerAtLowX ? xEdge + thin2 / 2f : xEdge - thin2 / 2f;
                Vector3 wc = new Vector3(wcx, yBase + szWall.y / 2f, zIn + (i + 0.5f) * span / n);
                PlaceModule(lot, pfWall, ctWall, wc, rot, scale, false);
            }
        }

        // 上层环（AD-021）
        static void EdgeUpX(Transform lot, float x0, float x1, float zEdge, float yBase, bool outerAtHighZ, bool withWin)
        {
            float span = x1 - x0;
            int n = BestN(span, LongOf(szUpWall));
            int winIdx = withWin ? n / 2 : -1;
            for (int i = 0; i < n; i++)
            {
                GameObject pf; Vector3 s2, c2;
                if (withWin && i == winIdx) { pf = pfUpWin; s2 = szUpWin; c2 = ctUpWin; }
                else { pf = pfUpWall; s2 = szUpWall; c2 = ctUpWall; }
                float thin2 = Math.Min(s2.x, s2.z);
                float si = (span / n) / LongOf(s2);
                bool longX2 = s2.x >= s2.z;
                Quaternion rot = longX2 ? Quaternion.identity : Quaternion.Euler(0f, 90f, 0f);
                Vector3 scale = longX2 ? new Vector3(si, 1f, 1f) : new Vector3(1f, 1f, si);
                float wcz = outerAtHighZ ? zEdge - thin2 / 2f : zEdge + thin2 / 2f;
                Vector3 wc = new Vector3(x0 + (i + 0.5f) * span / n, yBase + s2.y / 2f, wcz);
                PlaceModule(lot, pf, c2, wc, rot, scale, true);
            }
        }

        static void EdgeUpZ(Transform lot, float zIn, float zOut, float xEdge, float yBase, bool withWin)
        {
            float span = zOut - zIn;
            int n = BestN(span, LongOf(szUpWall));
            bool outerAtLowX = xEdge <= X0 + 0.01f;
            for (int i = 0; i < n; i++)
            {
                float thin2 = Math.Min(szUpWall.x, szUpWall.z);
                float si = (span / n) / LongOf(szUpWall);
                bool longX2 = szUpWall.x >= szUpWall.z;
                Quaternion rot = longX2 ? Quaternion.Euler(0f, 90f, 0f) : Quaternion.identity;
                Vector3 scale = longX2 ? new Vector3(si, 1f, 1f) : new Vector3(1f, 1f, si);
                float wcx = outerAtLowX ? xEdge + thin2 / 2f : xEdge - thin2 / 2f;
                Vector3 wc = new Vector3(wcx, yBase + szUpWall.y / 2f, zIn + (i + 0.5f) * span / n);
                PlaceModule(lot, pfUpWall, ctUpWall, wc, rot, scale, true);
            }
        }

        // 偏移感知统一放置：pivot = worldCenter - R∘(scale·ct)（v3 判例修：Synty pivot=角点）
        static GameObject PlaceModule(Transform lot, GameObject pf, Vector3 ct, Vector3 wc, Quaternion rot, Vector3 scale, bool addCollider)
        {
            var go = (GameObject)PrefabUtility.InstantiatePrefab(pf);
            go.transform.SetParent(lot, false);
            Vector3 pivotLocal = new Vector3(scale.x * ct.x, scale.y * ct.y, scale.z * ct.z);
            go.transform.position = wc - rot * pivotLocal;
            go.transform.rotation = rot;
            go.transform.localScale = scale;
            if (addCollider && go.GetComponent<Collider>() == null) EnsureBoxCollider(go);
            instCount++;
            return go;
        }

        static float LongOf(Vector3 s) { return Math.Max(s.x, s.z); }

        static void EnsureBoxCollider(GameObject go)
        {
            var mf = go.GetComponent<MeshFilter>();
            if (mf == null || mf.sharedMesh == null) return;
            var bc = go.AddComponent<BoxCollider>();
            // 凹 MeshCollider×非均匀缩放=PhysX 未定义行为（09-30 城批判例：内存态正常·存盘重烘焙后门洞假封闭·si≠1 四门全中）
            // → 模块件碰撞一律 Box·取 mesh 本地包围盒（Box 随 transform 缩放确定性变形）
            bc.center = mf.sharedMesh.bounds.center;
            bc.size = mf.sharedMesh.bounds.size;
        }

        static int BestN(float span, float len)
        {
            int n = Math.Max(1, Mathf.RoundToInt(span / len));
            float best = Math.Abs(span / (n * len) - 1f);
            for (int k = Math.Max(1, n - 1); k <= n + 1; k++)
            {
                float d = Math.Abs(span / (k * len) - 1f);
                if (d < best) { best = d; n = k; }
            }
            return n;
        }

        // ---------------- 断言（fail-loud） ----------------

        [MenuItem("CitySim/5 Shell SelfCheck")]
        public static void RunSelfCheck()
        {
            ResolvePrefabs();
            EditorSceneManager.OpenScene(ScenePath, OpenSceneMode.Single);
            var root = GameObject.Find("PilotShells");
            if (root == null) throw new Exception("[Shell] scene missing PilotShells: " + ScenePath);

            int fail = 0;
            var sb = new StringBuilder();
            sb.AppendLine("# CitySim Shell 试点街坊自检（闸3 机检·" + DateTime.Now.ToString("yyyy-MM-dd HH:mm") + "）");
            sb.AppendLine("> 溯源=CEO 令 09-30 并行开工令·R2 试点先行·seed=" + SEED + "·8 lot 背靠背双排（25×32.5m）·v3 偏移感知放置");

            // A1 seed 确定性：同 seed 双建 manifest 对账（剔除根对象名）
            var m1 = ManifestOf(root.transform);
            var root2 = new GameObject("PilotShells_B");
            BuildBlock(root2.transform);
            var m2 = ManifestOf(root2.transform);
            bool a1 = m1 == m2;
            sb.AppendLine("| A1 seed 确定性 | 双建 manifest " + (a1 ? "全等" : "不一致") + "（" + m1.Length + " chars） | " + (a1 ? "PASS" : "FAIL") + " |");
            if (!a1)
            {
                fail++;
                var l1 = m1.Split('\n'); var l2 = m2.Split('\n');
                int firstDiff = -1;
                for (int i = 0; i < Math.Min(l1.Length, l2.Length); i++) if (l1[i] != l2[i]) { firstDiff = i; break; }
                sb.AppendLine("  - A1 诊断：首差行=" + firstDiff + "/" + l1.Length);
                if (firstDiff >= 0)
                {
                    sb.AppendLine("  - m1[" + firstDiff + "]=" + l1[firstDiff]);
                    sb.AppendLine("  - m2[" + firstDiff + "]=" + l2[firstDiff]);
                }
            }
            UnityEngine.Object.DestroyImmediate(root2);

            // A2 门洞通路：8 门×3 高穿门出街（起点退 3.5m 防落墙带内）
            int blocked = 0;
            int[] byH = { 0, 0, 0 };
            float[] hs = { 0.8f, 1.2f, 1.6f };
            var hitLog = new StringBuilder();
            foreach (var d in doors)
            {
                for (int hi = 0; hi < hs.Length; hi++)
                {
                    Vector3 inP = new Vector3(d.x - d.outX * 3.5f, hs[hi], d.z - d.outZ * 3.5f);
                    Vector3 outP = new Vector3(d.x + d.outX * 3f, hs[hi], d.z + d.outZ * 3f);
                    RaycastHit hit;
                    if (Physics.Linecast(inP, outP, out hit))
                    {
                        blocked++; byH[hi]++;
                        if (hitLog.Length < 700) hitLog.AppendLine("  - 命中: h=" + hs[hi] + " facadeZ=" + d.z.ToString("F1") + " hitObj=" + (hit.collider != null ? hit.collider.name : "?") + " dist=" + hit.distance.ToString("F2"));
                    }
                }
            }
            bool a2 = blocked == 0 && doors.Count == ROWS * COLS;
            sb.AppendLine("| A2 门洞通路 | 门=" + doors.Count + "/" + (ROWS * COLS) + "·命中=" + blocked + "（分高 0.8:" + byH[0] + "/1.2:" + byH[1] + "/1.6:" + byH[2] + "） | " + (a2 ? "PASS" : "FAIL") + " |");
            if (!a2) { fail++; if (hitLog.Length > 0) sb.Append(hitLog); }

            // A3 贴线零退线：row0 立面 maxZ=145±0.05·row1 立面 minZ=80±0.05
            int offLine = 0;
            var a3log = new StringBuilder();
            for (int i = 0; i < lotBounds.Count; i++)
            {
                bool row0 = i < COLS;
                float edge = row0 ? lotBounds[i].max.z : lotBounds[i].min.z;
                float delta = edge - (row0 ? Z1 : Z0);
                if (Math.Abs(delta) > FacadeTol) { offLine++; a3log.AppendLine("  - lot" + i + (row0 ? "(row0·maxZ) " : "(row1·minZ) ") + "delta=" + delta.ToString("F3") + "m"); }
            }
            bool a3 = offLine == 0 && lotBounds.Count == ROWS * COLS;
            sb.AppendLine("| A3 贴线零退线 | 偏线 lot=" + offLine + "/" + lotBounds.Count + "（±0.05m） | " + (a3 ? "PASS" : "FAIL") + " |");
            if (!a3) { fail++; sb.Append(a3log); }

            sb.AppendLine();
            sb.AppendLine("结论：" + (fail == 0 ? "**三断言全绿**" : ("**" + fail + " 项 FAIL**")) + "·实例总数=" + instCount + "·门=" + doors.Count);
            sb.AppendLine("实测档案：wall=" + szWall.ToString("F2") + "（ct=" + ctWall.ToString("F2") + "）·door=" + szWallDoor.ToString("F2") + "·floor=" + szFloor.ToString("F2") + "·upWall=" + szUpWall.ToString("F2"));
            sb.AppendLine("用量：AD-002=Floor/Wall/Wall_Door/Wall_Window/Ceiling 五件·AD-021=UpperFloor/UpperFloor_Window 两件（mixed 上层）");
            File.WriteAllText(ReportPath, sb.ToString(), Encoding.UTF8);
            Debug.Log("[Shell] selfcheck -> " + ReportPath + " | " + (fail == 0 ? "PASS" : "FAIL x" + fail));
            if (fail > 0) throw new Exception("[Shell] SelfCheck FAIL x" + fail + " -> " + ReportPath);
        }

        static string ManifestOf(Transform root)
        {
            var lines = new List<string>();
            foreach (var t in root.GetComponentsInChildren<Transform>())
            {
                if (t == root) continue; // 剔除根对象（v3 修：根名双建不同致假阴性）
                lines.Add(t.name + "|" + t.position.ToString("F4") + "|" + t.rotation.eulerAngles.ToString("F3") + "|" + t.localScale.ToString("F4"));
            }
            lines.Sort();
            return string.Join("\n", lines.ToArray());
        }

        // ---------------- 判据帧（B_ 系·锁日态=新场景无 DayNightCycle） ----------------

        [MenuItem("CitySim/6 Capture Shell Frames")]
        public static void CaptureFrames()
        {
            EditorSceneManager.OpenScene(ScenePath, OpenSceneMode.Single);
            Directory.CreateDirectory(ShotsDir);
            RenderCam(FindCam("B_L1a"), Path.Combine(ShotsDir, "B_L1_pilotblock_1.jpg"));
            RenderCam(FindCam("B_L1b"), Path.Combine(ShotsDir, "B_L1_pilotblock_2.jpg"));
            RenderCam(FindCam("B_L2a"), Path.Combine(ShotsDir, "B_L2_pilotblock_1.jpg"));
            RenderCam(FindCam("B_L2b"), Path.Combine(ShotsDir, "B_L2_pilotblock_2.jpg"));
            Debug.Log("[Shell] frames -> " + ShotsDir);
        }

        static Camera FindCam(string name)
        {
            var go = GameObject.Find(name);
            if (go == null) throw new Exception("[Shell] camera missing: " + name);
            return go.GetComponent<Camera>();
        }

        static Camera MakeCam(string name, Vector3 pos, Vector3 euler)
        {
            var go = new GameObject(name);
            var cam = go.AddComponent<Camera>();
            cam.fieldOfView = 45f; cam.nearClipPlane = 1f; cam.farClipPlane = 3000f;
            cam.enabled = false;
            cam.clearFlags = CameraClearFlags.SolidColor;
            cam.backgroundColor = new Color(0.10f, 0.12f, 0.16f);
            go.transform.position = pos;
            go.transform.rotation = Quaternion.Euler(euler);
            var cd = go.AddComponent<UnityEngine.Rendering.Universal.UniversalAdditionalCameraData>();
            cd.renderPostProcessing = false;
            return cam;
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
            File.WriteAllBytes(path, tex.EncodeToJPG(88));
            RenderTexture.active = prev;
            cam.targetTexture = null;
            UnityEngine.Object.DestroyImmediate(tex);
            rt.Release();
            UnityEngine.Object.DestroyImmediate(rt);
        }

        // ---------------- 实锚解析与测量（size+pivot 偏移双回） ----------------

        static void ResolvePrefabs()
        {
            GameObject p;
            p = FindPf("SM_Bld_Base_Floor_01", "AD-002_"); Measure(p, out szFloor, out ctFloor); pfFloor = p;
            p = FindPf("SM_Bld_Base_Wall_01", "AD-002_"); Measure(p, out szWall, out ctWall); pfWall = p;
            p = FindPf("SM_Bld_Base_Wall_Door_01", "AD-002_"); Measure(p, out szWallDoor, out ctWallDoor); pfWallDoor = p;
            p = FindPf("SM_Bld_Base_Wall_Window_01", "AD-002_"); Measure(p, out szWallWin, out ctWallWin); pfWallWin = p;
            p = FindPf("SM_Bld_Base_Ceiling_01", "AD-002_"); Measure(p, out szCeil, out ctCeil); pfCeil = p;
            p = FindPf("SM_Bld_House_ExteriorWall_UpperFloor_01", "AD-021_"); Measure(p, out szUpWall, out ctUpWall); pfUpWall = p;
            p = FindPf("SM_Bld_House_ExteriorWall_UpperFloor_Window_01", "AD-021_"); Measure(p, out szUpWin, out ctUpWin); pfUpWin = p;
        }

        static GameObject FindPf(string name, string packMark)
        {
            foreach (string guid in AssetDatabase.FindAssets(name + " t:Prefab"))
            {
                string p = AssetDatabase.GUIDToAssetPath(guid);
                if (p.Contains(packMark)) return AssetDatabase.LoadAssetAtPath<GameObject>(p);
            }
            throw new Exception("[Shell] prefab not found: " + name + " @pack " + packMark);
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
            size = b.size;
            center = b.center - probe; // pivot→bounds 中心偏移（角点 pivot 件非零）
        }

        // ================= 全城装配 V1（CEO 令 09-30「硅基城市全面开工」·R2 rollout·r0-v3 层消费） =================

        static string CityScenePath { get { return Path.Combine("Assets", "Scenes", "CitySim_CityV1.unity"); } }
        static string CityDonePath { get { return Path.Combine(Staging, "citysim-city.done"); } }
        static string CityReportPath { get { return Path.Combine(Staging, "citysim-city-report.md"); } }
        static string CityShotsDir { get { return Path.Combine(Staging, "shots7"); } }

        [Serializable] class V3Hint { public int blockId; public string district; public string blockFunc; public string shell; public string density; public bool mixed; }
        [Serializable] class V3Landmark { public string district; public int blockId; }
        [Serializable] class V3Layer { public List<V3Hint> blockShellHint; public List<V3Landmark> blockLandmark; }

        static GameObject pfRoad, pfRoadCross, pfRoadLines, pfRoadRing, pfAnt, pfHouse, pfHouseWin, pfHouseDoor;
        static Vector3 szRoad, ctRoad, szRoadCross, ctRoadCross, szRoadLines, ctRoadLines, szRoadRing, ctRoadRing;
        static Vector3 szAnt, ctAnt, szHouse, ctHouse, szHouseWin, ctHouseWin, szHouseDoor, ctHouseDoor;

        struct LotRec { public Bounds b; public float line; public bool axisZ; public bool posSide; public int cellOutX; public int cellOutY; }
        static readonly List<LotRec> cityLots = new List<LotRec>();
        static int roadPlaced, bridgeCells, lastRoadHit;

        class CityCtx
        {
            public SimBlueprint bp; public V3Layer layer;
            public HashSet<int> roadSet = new HashSet<int>();
            public int[,] dist; public int grid;
            public Dictionary<int, List<int>> blockCells = new Dictionary<int, List<int>>();
            public HashSet<int> landmarkSet = new HashSet<int>();
        }
        static int Key(int x, int y) { return x * 512 + y; }

        static void ResolveCityPrefabs()
        {
            GameObject p;
            p = FindPf("SM_Env_Road_01", "AD-022_"); Measure(p, out szRoad, out ctRoad); pfRoad = p;
            p = FindPf("SM_Env_Road_Crossing_01", "AD-022_"); Measure(p, out szRoadCross, out ctRoadCross); pfRoadCross = p;
            p = FindPf("SM_Env_Road_Lines_01", "AD-022_"); Measure(p, out szRoadLines, out ctRoadLines); pfRoadLines = p;
            p = FindPf("SM_Env_Road_YellowLines_01", "AD-022_"); Measure(p, out szRoadRing, out ctRoadRing); pfRoadRing = p;
            p = FindPf("SM_Bld_House_ExteriorWall_GroundFloor_01", "AD-021_"); Measure(p, out szHouse, out ctHouse); pfHouse = p;
            p = FindPf("SM_Bld_House_ExteriorWall_GroundFloor_Window_01", "AD-021_"); Measure(p, out szHouseWin, out ctHouseWin); pfHouseWin = p;
            p = FindPf("SM_Bld_House_ExteriorWall_GroundFloor_Door_01", "AD-021_"); Measure(p, out szHouseDoor, out ctHouseDoor); pfHouseDoor = p;
            p = FindPf("SM_Prop_Antenna_01", "AD-020_"); Measure(p, out szAnt, out ctAnt); pfAnt = p;
        }

        static CityCtx LoadCtx()
        {
            var ctx = new CityCtx();
            ctx.bp = SimBlueprint.Load(CitySimDriver.DefaultBlueprintPath());
            if (ctx.bp == null) throw new Exception("[City] blueprint missing");
            string layerPath = Path.Combine(CityRoot, "..", "Tools", "city", "r0-v3-layer.json");
            ctx.layer = JsonUtility.FromJson<V3Layer>(File.ReadAllText(layerPath));
            if (ctx.layer == null || ctx.layer.blockShellHint == null) throw new Exception("[City] r0-v3-layer missing: " + layerPath);
            ctx.grid = ctx.bp.grid;
            for (int i = 0; i < ctx.bp.RoadCount; i++) ctx.roadSet.Add(Key(ctx.bp.roadX[i], ctx.bp.roadY[i]));
            for (int b = 0; b < ctx.bp.BlockCount; b++)
            {
                var cells = new List<int>();
                int s = ctx.bp.blockCellStart[b], e = ctx.bp.blockCellStart[b + 1];
                for (int k = s; k < e; k += 2) cells.Add(Key(ctx.bp.blockCellFlat[k], ctx.bp.blockCellFlat[k + 1]));
                ctx.blockCells[ctx.bp.blockId[b]] = cells;
            }
            foreach (var lm in ctx.layer.blockLandmark) ctx.landmarkSet.Add(lm.blockId);
            // BFS 距离图（路格 0·band 判据=≤6.4 格）
            ctx.dist = new int[ctx.grid, ctx.grid];
            var q = new Queue<int>();
            for (int x = 0; x < ctx.grid; x++) for (int y = 0; y < ctx.grid; y++) ctx.dist[x, y] = 999;
            for (int i = 0; i < ctx.bp.RoadCount; i++) { int x = ctx.bp.roadX[i], y = ctx.bp.roadY[i]; if (ctx.dist[x, y] != 0) { ctx.dist[x, y] = 0; q.Enqueue(x * 512 + y); } }
            while (q.Count > 0)
            {
                int k = q.Dequeue(), x = k / 512, y = k % 512;
                int[] dx4 = { 1, -1, 0, 0 }, dy4 = { 0, 0, 1, -1 };
                for (int d = 0; d < 4; d++)
                {
                    int nx = x + dx4[d], ny = y + dy4[d];
                    if (nx < 0 || ny < 0 || nx >= ctx.grid || ny >= ctx.grid) continue;
                    if (ctx.dist[nx, ny] <= ctx.dist[x, y] + 1) continue;
                    ctx.dist[nx, ny] = ctx.dist[x, y] + 1; q.Enqueue(nx * 512 + ny);
                }
            }
            return ctx;
        }

        [MenuItem("CitySim/7 Build City V1")]
        public static void BuildCity()
        {
            ResolvePrefabs(); ResolveCityPrefabs();
            var ctx = LoadCtx();
            var scene = EditorSceneManager.NewScene(NewSceneSetup.EmptyScene, NewSceneMode.Single);
            RenderSettings.ambientMode = UnityEngine.Rendering.AmbientMode.Flat;
            RenderSettings.ambientLight = new Color(0.55f, 0.55f, 0.58f, 1f);
            var lightGo = new GameObject("Sun");
            var l = lightGo.AddComponent<Light>();
            l.type = LightType.Directional; l.intensity = 1.3f;
            lightGo.transform.rotation = Quaternion.Euler(52f, -30f, 0f);
            MakeCam("C_L0a", new Vector3(0f, 340f, 300f), new Vector3(50f, 180f, 0f));
            MakeCam("C_L0b", new Vector3(300f, 340f, 0f), new Vector3(50f, 270f, 0f));
            MakeCam("C_L1", new Vector3(-102.5f, 110f, 182.5f), new Vector3(55f, 180f, 0f));
            MakeCam("C_L2", new Vector3(-95f, 24f, 160f), new Vector3(60f, 180f, 0f));
            // 全城水底面（程序生成件·单面朝上律）——城基=地块板+路面·缝隙读作运河水系
            var water = GameObject.CreatePrimitive(PrimitiveType.Quad);
            water.name = "WaterPlane";
            water.transform.rotation = Quaternion.Euler(90f, 0f, 0f);
            water.transform.position = new Vector3(0f, -0.35f, 0f);
            water.transform.localScale = new Vector3(340f, 340f, 1f);
            string wmatPath = "Assets/Art/Bridge/CityWater_V1.mat";
            var wmat = AssetDatabase.LoadAssetAtPath<Material>(wmatPath);
            if (wmat == null)
            {
                wmat = new Material(Shader.Find("Universal Render Pipeline/Lit")) { name = "CityWater_V1" };
                wmat.SetColor("_BaseColor", new Color(0.10f, 0.16f, 0.26f));
                wmat.SetFloat("_Smoothness", 0.15f);
                AssetDatabase.CreateAsset(wmat, wmatPath);
            }
            water.GetComponent<Renderer>().sharedMaterial = wmat;
            var root = new GameObject("CityV1");
            BuildCityContent(root.transform, ctx);
            int bridged = BridgePilotMaterials(root); // 批A包判例：robocopy≠URP桥过·不过桥=全城品红
            EditorSceneManager.SaveScene(scene, CityScenePath);
            Debug.Log("[City] scene saved: " + CityScenePath + " instances=" + instCount + " roads=" + roadPlaced + " bridged_mats=" + bridged);
        }

        static void BuildCityContent(Transform root, CityCtx ctx)
        {
            doors.Clear(); cityLots.Clear(); instCount = 0; roadPlaced = 0; bridgeCells = 0;
            LayRoadsCity(root, ctx);
            foreach (var hint in ctx.layer.blockShellHint)
            {
                List<int> cells;
                if (!ctx.blockCells.TryGetValue(hint.blockId, out cells)) continue;
                int x0 = 999, x1 = -1, y0 = 999, y1 = -1;
                foreach (int k in cells) { int cx = k / 512, cy = k % 512; if (cx < x0) x0 = cx; if (cx > x1) x1 = cx; if (cy < y0) y0 = cy; if (cy > y1) y1 = cy; }
                float m = ctx.bp.cellM;
                float wx0 = ctx.bp.originX + x0 * m, wx1 = ctx.bp.originX + (x1 + 1) * m;
                float wz0 = ctx.bp.originZ + y0 * m, wz1 = ctx.bp.originZ + (y1 + 1) * m;
                if (hint.blockFunc == "PUB")
                {
                    // 公共块=铺装广场（band 格逐格 AD-002 Floor 板·2× 缩放铺 5m 格）+地标天线
                    var blockGo = new GameObject("B" + hint.blockId + "_plaza"); blockGo.transform.SetParent(root, false);
                    foreach (int k in cells)
                    {
                        int cx = k / 512, cy = k % 512;
                        if (ctx.dist[cx, cy] > 6) continue;
                        Vector3 c = ctx.bp.CellCenter(cx, cy);
                        PlaceModule(blockGo.transform, pfFloor, ctFloor, new Vector3(c.x, szFloor.y / 2f, c.z), Quaternion.identity, new Vector3(2f, 1f, 2f), false);
                    }
                    if (ctx.landmarkSet.Contains(hint.blockId))
                    {
                        Vector3 cc = ctx.bp.BlockCentroidWorld(FindBlockIndex(ctx, hint.blockId));
                        float s = 14f / Math.Max(0.01f, szAnt.y);
                        PlaceModule(blockGo.transform, pfAnt, ctAnt, new Vector3(cc.x, 14f / 2f, cc.z), Quaternion.identity, new Vector3(s, s, s), false);
                    }
                    continue;
                }
                bool hasN = RowHasRoad(ctx, x0, x1, y1 + 1) || RowHasRoad(ctx, x0, x1, y1 + 2);
                bool hasS = RowHasRoad(ctx, x0, x1, y0 - 1) || RowHasRoad(ctx, x0, x1, y0 - 2);
                bool hasW = ColHasRoad(ctx, y0, y1, x0 - 1) || ColHasRoad(ctx, y0, y1, x0 - 2);
                bool hasE = ColHasRoad(ctx, y0, y1, x1 + 1) || ColHasRoad(ctx, y0, y1, x1 + 2);
                float w = wx1 - wx0, h = wz1 - wz0;
                float dNS = Math.Min(32.5f, h / 2f), dWE = Math.Min(32.5f, w / 2f);
                if (hasN) StripLots(root, ctx, hint, wx0, wx1, wz1 - dNS, wz1, true, true, cells, y1, y1 + 1);
                if (hasS) StripLots(root, ctx, hint, wx0, wx1, wz0, wz0 + dNS, true, false, cells, y0, y0 - 1);
                float midZ0 = wz0 + (hasS ? dNS : 0f), midZ1 = wz1 - (hasN ? dNS : 0f);
                if (hasW && midZ1 - midZ0 >= 20f) StripLots(root, ctx, hint, wx0, wx0 + dWE, midZ0, midZ1, false, false, cells, x0, x0 - 1);
                if (hasE && midZ1 - midZ0 >= 20f) StripLots(root, ctx, hint, wx1 - dWE, wx1, midZ0, midZ1, false, true, cells, x1, x1 + 1);
            }
        }

        static bool RowHasRoad(CityCtx ctx, int xa, int xb, int y) { if (y < 0 || y >= ctx.grid) return false; for (int x = xa; x <= xb; x++) if (ctx.roadSet.Contains(Key(x, y))) return true; return false; }
        static bool ColHasRoad(CityCtx ctx, int ya, int yb, int x) { if (x < 0 || x >= ctx.grid) return false; for (int y = ya; y <= yb; y++) if (ctx.roadSet.Contains(Key(x, y))) return true; return false; }

        static int FindBlockIndex(CityCtx ctx, int blockId) { for (int i = 0; i < ctx.bp.BlockCount; i++) if (ctx.bp.blockId[i] == blockId) return i; return 0; }

        // 街带 lot 切分+壳装配（ax=ax 轴世界范围·bz=z 轴世界范围恒定；axisZ=true=街在 ±Z（lot 沿 X 分）·false=街在 ±X（lot 沿 Z 分）
        // gateCell=strip 临街缘所在块边缘行/列坐标·outCell=路侧邻格坐标（A4 判据用）
        static void StripLots(Transform root, CityCtx ctx, V3Hint hint, float ax0, float ax1, float bz0, float bz1, bool axisZ, bool posSide, List<int> cells, int gateCell, int outCell)
        {
            float spanA = ax1 - ax0, spanB = bz1 - bz0;
            float lotW = hint.blockFunc == "RES" ? 12.5f : 25f;
            bool alongX = axisZ; // lot 长边沿街方向：N/S 街=沿 X 分；W/E 街=沿 Z 分
            float span = alongX ? spanA : spanB;
            int n = Math.Max(1, Mathf.RoundToInt(span / lotW));
            var blockGo = new GameObject("B" + hint.blockId + "_" + (axisZ ? (posSide ? "N" : "S") : (posSide ? "E" : "W")));
            blockGo.transform.SetParent(root, false);
            for (int i = 0; i < n; i++)
            {
                float l0 = span * i / n, l1 = span * (i + 1) / n;
                float lx0, lx1, lz0, lz1;
                if (axisZ) { lx0 = ax0 + l0; lx1 = ax0 + l1; lz0 = bz0; lz1 = bz1; }
                else { lz0 = bz0 + l0; lz1 = bz0 + l1; lx0 = ax0; lx1 = ax1; }
                int midSpanCell = Mathf.RoundToInt(((l0 + l1) / 2f + (axisZ ? ax0 : bz0)) / ctx.bp.cellM - (axisZ ? ctx.bp.originX : ctx.bp.originZ) / ctx.bp.cellM - 0.5f);
                int gateKey = axisZ ? Key(midSpanCell, gateCell) : Key(gateCell, midSpanCell);
                if (!cells.Contains(gateKey)) continue; // 缺口/水缘跳过（notch 空真）
                BuildCityLot(root, ctx, hint, axisZ, posSide, lx0, lx1, lz0, lz1, gateCell, outCell, midSpanCell);
            }
        }

        static void BuildCityLot(Transform root, CityCtx ctx, V3Hint hint, bool axisZ, bool posSide, float lx0, float lx1, float lz0, float lz1, int gateCell, int outCell, int midSpanCell)
        {
            string sideTag = axisZ ? (posSide ? "N" : "S") : (posSide ? "E" : "W");
            var lotGo = new GameObject("Lot_b" + hint.blockId + "_" + sideTag + "_c" + midSpanCell); lotGo.transform.SetParent(root, false);
            var lot = lotGo.transform;
            bool res = hint.blockFunc == "RES";
            float outX = axisZ ? 0f : (posSide ? 1f : -1f), outZ = axisZ ? (posSide ? 1f : -1f) : 0f;
            Vector3 outward = new Vector3(outX, 0f, outZ);
            // 地板（全 lot·前宅后院律=RES 宅环只占临街 16m）
            TileFloorXY(lot, new Vector2(lx0, lz0), new Vector2(lx1, lz1), 0f, pfFloor, szFloor, ctFloor);
            float stripDepth = axisZ ? (lz1 - lz0) : (lx1 - lx0);
            float depth = res ? Math.Min(16f, stripDepth) : stripDepth;
            float rx0, rx1, rz0, rz1;
            if (axisZ) { rx0 = lx0; rx1 = lx1; rz0 = posSide ? lz1 - depth : lz0; rz1 = posSide ? lz1 : lz0 + depth; }
            else { rz0 = lz0; rz1 = lz1; rx0 = posSide ? lx1 - depth : lx0; rx1 = posSide ? lx1 : lx0 + depth; }
            float storyH = res ? szHouse.y : szWall.y;
            bool upRes = res || hint.mixed; // mixed 上层=AD-021 族（试点正法）
            float upH = upRes ? szUpWall.y : szWall.y;
            bool groundCol = res; // AD-021 件无碰撞器=运行时补
            // 四边墙环：临街（门+窗）·背街·两侧
            Vector2 fA, fB, bA, bB, s1A, s1B, s2A, s2B;
            if (axisZ)
            {
                fA = new Vector2(rx0, posSide ? rz1 : rz0); fB = new Vector2(rx1, posSide ? rz1 : rz0);
                bA = new Vector2(rx0, posSide ? rz0 : rz1); bB = new Vector2(rx1, posSide ? rz0 : rz1);
                s1A = new Vector2(rx0, rz0); s1B = new Vector2(rx0, rz1);
                s2A = new Vector2(rx1, rz0); s2B = new Vector2(rx1, rz1);
            }
            else
            {
                fA = new Vector2(posSide ? rx1 : rx0, rz0); fB = new Vector2(posSide ? rx1 : rx0, rz1);
                bA = new Vector2(posSide ? rx0 : rx1, rz0); bB = new Vector2(posSide ? rx0 : rx1, rz1);
                s1A = new Vector2(rx0, rz0); s1B = new Vector2(rx1, rz0);
                s2A = new Vector2(rx0, rz1); s2B = new Vector2(rx1, rz1);
            }
            RingEdge(lot, fA, fB, outward, 0f, hint, true, groundCol);
            RingEdge(lot, bA, bB, -outward, 0f, hint, false, groundCol);
            Vector3 side1Out = axisZ ? new Vector3(-1, 0, 0) : new Vector3(0, 0, -1);
            Vector3 side2Out = axisZ ? new Vector3(1, 0, 0) : new Vector3(0, 0, 1);
            RingEdge(lot, s1A, s1B, side1Out, 0f, hint, false, groundCol);
            RingEdge(lot, s2A, s2B, side2Out, 0f, hint, false, groundCol);
            float ceilTop = TileFloorXY(lot, new Vector2(rx0, rz0), new Vector2(rx1, rz1), storyH, pfCeil, szCeil, ctCeil);
            int stories = 1;
            if (res && hint.density == "high") stories = 2;
            if (hint.blockFunc == "OFF") stories = 2;
            if (hint.mixed) stories = 2;
            for (int st = 1; st < stories; st++)
            {
                bool upCol = upRes;
                UpRingEdge(lot, fA, fB, outward, ceilTop, upRes, true, upCol);
                UpRingEdge(lot, bA, bB, -outward, ceilTop, upRes, false, upCol);
                UpRingEdge(lot, s1A, s1B, side1Out, ceilTop, upRes, false, upCol);
                UpRingEdge(lot, s2A, s2B, side2Out, ceilTop, upRes, false, upCol);
                ceilTop = TileFloorXY(lot, new Vector2(rx0, rz0), new Vector2(rx1, rz1), ceilTop + upH, pfCeil, szCeil, ctCeil);
            }
            var b = new Bounds(); bool first = true;
            foreach (var r in lotGo.GetComponentsInChildren<Renderer>())
            { if (first) { b = r.bounds; first = false; } else b.Encapsulate(r.bounds); }
            if (!first)
            {
                float line = axisZ ? (posSide ? lz1 : lz0) : (posSide ? lx1 : lx0);
                int cellOutX = axisZ ? midSpanCell : outCell;
                int cellOutY = axisZ ? outCell : midSpanCell;
                cityLots.Add(new LotRec { b = b, line = line, axisZ = axisZ, posSide = posSide, cellOutX = cellOutX, cellOutY = cellOutY });
            }
        }

        // 通用 RingEdge：a→b=沿线（XZ 平面 Vector2=世界 x,z）·outward=朝街外向·withDoor=门位中心+窗两翼
        static void RingEdge(Transform lot, Vector2 a, Vector2 b, Vector3 outward, float yBase, V3Hint hint, bool withDoor, bool addCol)
        {
            bool res = hint.blockFunc == "RES";
            GameObject pfM = res ? pfHouse : pfWall; Vector3 szM = res ? szHouse : szWall, ctM = res ? ctHouse : ctWall;
            GameObject pfD = res ? pfHouseDoor : pfWallDoor; Vector3 szD = res ? szHouseDoor : szWallDoor, ctD = res ? ctHouseDoor : ctWallDoor;
            GameObject pfW = res ? pfHouseWin : pfWallWin; Vector3 szW = res ? szHouseWin : szWallWin, ctW = res ? ctHouseWin : ctWallWin;
            GeneralEdge(lot, a, b, outward, yBase, pfM, szM, ctM, withDoor ? pfD : null, szD, ctD, pfW, szW, ctW, withDoor, addCol, withDoor);
        }

        static void UpRingEdge(Transform lot, Vector2 a, Vector2 b, Vector3 outward, float yBase, bool res, bool withWin, bool addCol)
        {
            GameObject pfM = res ? pfUpWall : pfWall; Vector3 szM = res ? szUpWall : szWall, ctM = res ? ctUpWall : ctWall;
            GameObject pfW = res ? pfUpWin : pfWallWin; Vector3 szW = res ? szUpWin : szWallWin, ctW = res ? ctUpWin : ctWallWin;
            GeneralEdge(lot, a, b, outward, yBase, pfM, szM, ctM, null, Vector3.zero, Vector3.zero, pfW, szW, ctW, withWin, addCol, false);
        }

        static void GeneralEdge(Transform lot, Vector2 a, Vector2 b, Vector3 outward, float yBase,
            GameObject pfM, Vector3 szM, Vector3 ctM, GameObject pfD, Vector3 szD, Vector3 ctD, GameObject pfW, Vector3 szW, Vector3 ctW,
            bool withCenter, bool addCol, bool recordDoor)
        {
            Vector2 dir = b - a; float span = dir.magnitude; if (span < 0.01f) return;
            bool edgeAlongX = Math.Abs(dir.x) >= Math.Abs(dir.y);
            int n = BestN(span, LongOf(szM));
            int doorIdx = withCenter ? n / 2 : -1;
            for (int i = 0; i < n; i++)
            {
                GameObject pf; Vector3 s2, c2;
                if (i == doorIdx && pfD != null) { pf = pfD; s2 = szD; c2 = ctD; }
                else if (withCenter && Math.Abs(i - doorIdx) == 1 && pfW != null) { pf = pfW; s2 = szW; c2 = ctW; }
                else { pf = pfM; s2 = szM; c2 = ctM; }
                float thin2 = Math.Min(s2.x, s2.z);
                float si = (span / n) / LongOf(s2);
                bool longX2 = s2.x >= s2.z;
                Quaternion rot = (edgeAlongX == longX2) ? Quaternion.identity : Quaternion.Euler(0f, 90f, 0f);
                Vector3 scale = longX2 ? new Vector3(si, 1f, 1f) : new Vector3(1f, 1f, si);
                float t = (i + 0.5f) * span / n;
                Vector2 mid = a + dir / span * t;
                Vector3 wc = new Vector3(mid.x - outward.x * thin2 / 2f, yBase + s2.y / 2f, mid.y - outward.z * thin2 / 2f);
                PlaceModule(lot, pf, c2, wc, rot, scale, addCol && pf != pfD); // 门件零碰撞器（Box 封门洞·门=通道：射线+NavMesh 穿行正法）
                if (recordDoor && i == doorIdx)
                    doors.Add(new DoorInfo { x = mid.x, z = mid.y, outX = outward.x, outZ = outward.z });
            }
        }

        // 轴自适应地板/顶板（a=(x,z) 或 (z,x) 皆按参数序填世界）
        static float TileFloorXY(Transform lot, Vector2 a, Vector2 b, float yBase, GameObject pf, Vector3 sz, Vector3 ct)
        {
            float spanX = b.x - a.x, spanZ = b.y - a.y;
            int nX = BestN(spanX, sz.x), nZ = BestN(spanZ, sz.z);
            float sx = spanX / (nX * sz.x), szz = spanZ / (nZ * sz.z);
            for (int i = 0; i < nX; i++)
                for (int j = 0; j < nZ; j++)
                {
                    Vector3 wc = new Vector3(a.x + (i + 0.5f) * spanX / nX, yBase + sz.y / 2f, a.y + (j + 0.5f) * spanZ / nZ);
                    PlaceModule(lot, pf, ct, wc, Quaternion.identity, new Vector3(sx, 1f, szz), false);
                }
            return yBase + sz.y;
        }

        // 路件铺设（CityAssembler 正法简化版：桥=Lines@y0.6·四向=Crossing·脑环=YellowLines r14.5-17.5·长直≥6=Lines·余 Straight）
        static void LayRoadsCity(Transform root, CityCtx ctx)
        {
            var roadGo = new GameObject("Roads"); roadGo.transform.SetParent(root, false);
            var bp = ctx.bp;
            for (int i = 0; i < bp.RoadCount; i++)
            {
                int x = bp.roadX[i], y = bp.roadY[i];
                Vector3 c = bp.CellCenter(x, y);
                bool bridge = bp.roadBridge[i] == 1;
                bool n_ = ctx.roadSet.Contains(Key(x, y + 1)), s = ctx.roadSet.Contains(Key(x, y - 1));
                bool e = ctx.roadSet.Contains(Key(x + 1, y)), w = ctx.roadSet.Contains(Key(x - 1, y));
                int ns = (n_ ? 1 : 0) + (s ? 1 : 0), ew = (e ? 1 : 0) + (w ? 1 : 0);
                GameObject piece; float rotY; float py;
                if (bridge) { piece = pfRoadLines; py = 0.6f; rotY = (e || w) ? 90f : 0f; bridgeCells++; }
                else if (n_ && s && e && w) { piece = pfRoadCross; rotY = 0f; py = 0f; }
                else if (Math.Abs(Mathf.Sqrt((x - 32) * (x - 32) + (y - 32) * (y - 32)) - 16f) <= 1.5f) { piece = pfRoadRing; rotY = ew > ns ? 90f : 0f; py = 0f; }
                else if (RunLen(ctx, x, y, true) >= 6 || RunLen(ctx, x, y, false) >= 6) { piece = pfRoadLines; rotY = RunLen(ctx, x, y, true) >= RunLen(ctx, x, y, false) ? 90f : 0f; py = 0f; }
                else { piece = pfRoad; rotY = ew > ns ? 90f : 0f; py = 0f; }
                Vector3 sz = piece == pfRoad ? szRoad : (piece == pfRoadCross ? szRoadCross : (piece == pfRoadLines ? szRoadLines : szRoadRing));
                Vector3 ct = piece == pfRoad ? ctRoad : (piece == pfRoadCross ? ctRoadCross : (piece == pfRoadLines ? ctRoadLines : ctRoadRing));
                Vector3 wc = new Vector3(c.x, py + sz.y / 2f, c.z);
                PlaceModule(roadGo.transform, piece, ct, wc, Quaternion.Euler(0f, rotY, 0f), Vector3.one, false);
                roadPlaced++;
            }
        }

        static int RunLen(CityCtx ctx, int x, int y, bool alongX)
        {
            int len = 1;
            for (int d = 1; d < 8; d++) { if (!ctx.roadSet.Contains(Key(alongX ? x + d : x, alongX ? y : y + d))) break; len++; }
            for (int d = 1; d < 8; d++) { if (!ctx.roadSet.Contains(Key(alongX ? x - d : x, alongX ? y : y - d))) break; len++; }
            return len;
        }

        [MenuItem("CitySim/8 City SelfCheck")]
        public static void CitySelfCheck()
        {
            ResolvePrefabs(); ResolveCityPrefabs();
            var ctx = LoadCtx();
            EditorSceneManager.OpenScene(CityScenePath, OpenSceneMode.Single);
            var root = GameObject.Find("CityV1");
            if (root == null) throw new Exception("[City] scene missing CityV1");
            int fail = 0;
            var sb = new StringBuilder();
            sb.AppendLine("# CitySim 全城 V1 自检（闸3 机检·" + DateTime.Now.ToString("yyyy-MM-dd HH:mm") + "）");
            sb.AppendLine("> 溯源=CEO 令 09-30 全面开工·r0-v3 层消费·seed=" + SEED);
            // A1 seed 确定性
            var m1 = ManifestOf(root.transform);
            var root2 = new GameObject("CityV1_B");
            BuildCityContent(root2.transform, ctx);
            var m2 = ManifestOf(root2.transform);
            bool a1 = m1 == m2;
            sb.AppendLine("| A1 seed 确定性 | 双建 manifest " + (a1 ? "全等" : "不一致") + "（" + m1.Length + " chars） | " + (a1 ? "PASS" : "FAIL") + " |");
            if (!a1) { fail++; var l1 = m1.Split('\n'); var l2 = m2.Split('\n'); int fd = -1; for (int i = 0; i < Math.Min(l1.Length, l2.Length); i++) if (l1[i] != l2[i]) { fd = i; break; } sb.AppendLine("  - 首差行=" + fd + "/" + l1.Length); if (fd >= 0) { sb.AppendLine("  - m1: " + l1[fd]); sb.AppendLine("  - m2: " + l2[fd]); } }
            UnityEngine.Object.DestroyImmediate(root2);
            // A2 门洞通路（全城门×三高·v6：门件零碰撞器+墙窗 Box——凹 Mesh×非均匀缩放伪影根治·建筑遮挡=FAIL·路件分离披露）
            int blocked = 0, roadHit = 0; int[] byH = { 0, 0, 0 }; float[] hs = { 0.8f, 1.2f, 1.6f };
            var a2log = new StringBuilder();
            foreach (var d in doors)
                for (int hi = 0; hi < hs.Length; hi++)
                {
                    Vector3 inP = new Vector3(d.x - d.outX * 3.5f, hs[hi], d.z - d.outZ * 3.5f);
                    Vector3 outP = new Vector3(d.x + d.outX * 3f, hs[hi], d.z + d.outZ * 3f);
                    Vector3 dir = outP - inP; float dist = dir.magnitude;
                    foreach (var h in Physics.RaycastAll(inP, dir / dist, dist))
                    {
                        bool isRoad = false;
                        for (var t = h.collider.transform; t != null; t = t.parent)
                            if (t.name == "Roads") { isRoad = true; break; }
                        if (isRoad) roadHit++; else { blocked++; byH[hi]++; }
                        if (a2log.Length < 1200)
                        {
                            var ht = h.collider.transform;
                            a2log.AppendLine("  - 命中: h=" + hs[hi] + " 门=(" + d.x.ToString("F1") + "," + d.z.ToString("F1") + ") " + (isRoad ? "[路件]" : "[建筑]") + " " + h.collider.name
                                + " dist=" + h.distance.ToString("F2") + " hitPt=" + h.point.ToString("F2")
                                + " tf=" + ht.position.ToString("F1") + " s=" + ht.localScale.ToString("F2"));
                        }
                    }
                }
            lastRoadHit = roadHit;
            bool a2 = blocked == 0 && doors.Count > 0;
            sb.AppendLine("| A2 门洞通路 | 门=" + doors.Count + "·建筑命中=" + blocked + "（0.8:" + byH[0] + "/1.2:" + byH[1] + "/1.6:" + byH[2] + "）·路件命中=" + roadHit + "（道具/栏杆·不判·详录） | " + (a2 ? "PASS" : "FAIL") + " |");
            if (!a2) fail++;
            if (a2log.Length > 0) sb.Append(a2log);
            // A3 贴线零退线 + A4 门面邻路
            int offLine = 0, noRoad = 0;
            foreach (var lotRec in cityLots)
            {
                float edge = lotRec.axisZ ? (lotRec.posSide ? lotRec.b.max.z : lotRec.b.min.z) : (lotRec.posSide ? lotRec.b.max.x : lotRec.b.min.x);
                if (Math.Abs(edge - lotRec.line) > FacadeTol) offLine++;
                if (!ctx.roadSet.Contains(Key(lotRec.cellOutX, lotRec.cellOutY))) noRoad++;
            }
            bool a3 = offLine == 0 && cityLots.Count > 0;
            bool a4 = noRoad == 0 && cityLots.Count > 0;
            sb.AppendLine("| A3 贴线零退线 | 偏线 lot=" + offLine + "/" + cityLots.Count + "（±0.05m） | " + (a3 ? "PASS" : "FAIL") + " |");
            if (!a3) fail++;
            sb.AppendLine("| A4 门面邻路 | 非邻路 lot=" + noRoad + "/" + cityLots.Count + " | " + (a4 ? "PASS" : "FAIL") + " |");
            if (!a4) fail++;
            // A5 路件计数
            bool a5 = roadPlaced == ctx.bp.RoadCount;
            sb.AppendLine("| A5 路件全铺 | pieces=" + roadPlaced + "/" + ctx.bp.RoadCount + "·桥格=" + bridgeCells + " | " + (a5 ? "PASS" : "FAIL") + " |");
            if (!a5) fail++;
            sb.AppendLine();
            sb.AppendLine("结论：" + (fail == 0 ? "**五断言全绿**" : ("**" + fail + " 项 FAIL**")) + "·实例=" + instCount + "·门=" + doors.Count + "·lot=" + cityLots.Count);
            File.WriteAllText(CityReportPath, sb.ToString(), Encoding.UTF8);
            Debug.Log("[City] selfcheck -> " + CityReportPath + " | " + (fail == 0 ? "PASS" : "FAIL x" + fail));
            if (fail > 0) throw new Exception("[City] SelfCheck FAIL x" + fail + " -> " + CityReportPath);
        }

        [MenuItem("CitySim/9 Capture City Frames")]
        public static void CaptureCityFrames()
        {
            EditorSceneManager.OpenScene(CityScenePath, OpenSceneMode.Single);
            Directory.CreateDirectory(CityShotsDir);
            RenderCam(FindCam("C_L0a"), Path.Combine(CityShotsDir, "B_L0_city_1.jpg"));
            RenderCam(FindCam("C_L0b"), Path.Combine(CityShotsDir, "B_L0_city_2.jpg"));
            RenderCam(FindCam("C_L1"), Path.Combine(CityShotsDir, "B_L1_city.jpg"));
            RenderCam(FindCam("C_L2"), Path.Combine(CityShotsDir, "B_L2_city.jpg"));
            Debug.Log("[City] frames -> " + CityShotsDir);
        }

        public static void RunCityAll()
        {
            try
            {
                BuildCity();
                CitySelfCheck();
                CaptureCityFrames();
                File.WriteAllText(CityDonePath, "CitySimCity|" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "|PASS|city-5-green|frames-4|instances=" + instCount + "|lots=" + cityLots.Count + "|doors=" + doors.Count + "|road_hits=" + lastRoadHit, Encoding.UTF8);
                Debug.Log("[City] RunCityAll PASS");
            }
            catch (Exception e)
            {
                File.WriteAllText(CityDonePath, "CitySimCity|" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "|FAIL|" + e.Message.Replace('\n', ' '), Encoding.UTF8);
                Debug.LogError("[City] RunCityAll FAIL: " + e.Message);
                throw;
            }
        }

        // ---------------- 批入口 ----------------

        public static void RunAll()
        {
            try
            {
                Build();
                RunSelfCheck();
                CaptureFrames();
                WriteDone("PASS|shell-3-green|frames-4|instances=" + instCount + "|seed=" + SEED);
                Debug.Log("[Shell] RunAll PASS");
            }
            catch (Exception e)
            {
                WriteDone("FAIL|" + e.Message.Replace('\n', ' '));
                Debug.LogError("[Shell] RunAll FAIL: " + e.Message);
                throw;
            }
        }

        static void WriteDone(string status)
        {
            Directory.CreateDirectory(Staging);
            File.WriteAllText(DonePath, "CitySimShell|" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "|" + status, Encoding.UTF8);
        }
    }
}
