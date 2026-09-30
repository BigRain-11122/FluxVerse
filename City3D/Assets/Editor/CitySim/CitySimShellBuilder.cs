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

        struct DoorInfo { public float x; public float z; public bool streetAtHighZ; }
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
                if (withDoor && i == doorIdx) doors.Add(new DoorInfo { x = wc.x, z = zEdge, streetAtHighZ = outerAtHighZ });
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
            if (addCollider && go.GetComponent<Collider>() == null) EnsureMeshCollider(go);
            instCount++;
            return go;
        }

        static float LongOf(Vector3 s) { return Math.Max(s.x, s.z); }

        static void EnsureMeshCollider(GameObject go)
        {
            var mf = go.GetComponent<MeshFilter>();
            if (mf == null || mf.sharedMesh == null) return;
            var mc = go.AddComponent<MeshCollider>();
            mc.sharedMesh = mf.sharedMesh;
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
                    Vector3 inP = new Vector3(d.x, hs[hi], d.streetAtHighZ ? d.z - 3.5f : d.z + 3.5f);
                    Vector3 outP = new Vector3(d.x, hs[hi], d.streetAtHighZ ? d.z + 3f : d.z - 3f);
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
