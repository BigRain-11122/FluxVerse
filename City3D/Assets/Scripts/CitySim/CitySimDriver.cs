using System;
using System.Collections.Generic;
using System.IO;
using UnityEngine;

namespace CitySim
{
    /// <summary>
    /// CitySimLab 可视化驱动（Mesh 层）：仿真核心数据 -> 白盒可视化。
    /// 数据实体常驻（CitySimCore），本件只做渲染载体（CEO 坑1 解耦律）。
    /// 判据帧系=S_（sim 功能白盒帧·定谳文档 v1.0 登记）。
    /// </summary>
    public class CitySimDriver : MonoBehaviour
    {
        public string blueprintPath = "";
        public int simSeed = 20260930;
        public float simMinutesPerRealSecond = 2f; // play 模式速率

        [NonSerialized] public CitySimCore core;

        Transform visRoot;
        readonly List<Renderer> roadRenderers = new List<Renderer>();
        readonly List<Transform> agentCubes = new List<Transform>();
        readonly Dictionary<ParcelFunc, Material> blockMats = new Dictionary<ParcelFunc, Material>();
        Material[] congMats;   // 0..6 绿->红
        Material agentMat;
        TextMesh hud;
        float lastApply = -999f;

        public static string DefaultBlueprintPath()
        {
            string root = Path.GetFullPath(Path.Combine(Application.dataPath, "..")); // City3D
            return Path.Combine(root, "Assets", "CitySim", "citysim-blueprint.json");
        }

        // ---------------- 初始化 ----------------

        public void Init()
        {
            if (core != null) return;
            string p = string.IsNullOrEmpty(blueprintPath) ? DefaultBlueprintPath() : blueprintPath;
            var bp = SimBlueprint.Load(p);
            if (bp == null) throw new Exception("[CitySim] blueprint not found: " + p);
            core = new CitySimCore(bp, simSeed);
            core.SpawnMorningWave();
        }

        public void ResetAndRunTo(float targetMin)
        {
            Init();
            core.Reset();
            core.FastForward(targetMin);
            ApplyVisuals();
        }

        public void RunTo(float targetMin)
        {
            Init();
            core.FastForward(targetMin);
            ApplyVisuals();
        }

        // ---------------- 可视化构建 ----------------

        public void BuildVisuals()
        {
            Init();
            ClearVisuals();
            visRoot = new GameObject("SimLabVisuals").transform;

            BuildMaterials();
            BuildGround();
            BuildBlocks();
            BuildRoads();
            BuildAgents();
            BuildRings();
            BuildHud();
            ApplyVisuals();
        }

        void BuildMaterials()
        {
            var shader = Shader.Find("Universal Render Pipeline/Lit");
            if (shader == null) shader = Shader.Find("Standard");
            blockMats[ParcelFunc.RES] = MakeMat(shader, new Color32(0x5F, 0xA0, 0x50, 255));   // 住=树绿
            blockMats[ParcelFunc.OFF] = MakeMat(shader, new Color32(0x4E, 0x80, 0xAC, 255));  // 办=警服蓝
            blockMats[ParcelFunc.SHOP] = MakeMat(shader, new Color32(0xEF, 0xBB, 0x33, 255)); // 商=出租黄
            blockMats[ParcelFunc.CLUB] = MakeMat(shader, new Color32(0xEA, 0x56, 0xC8, 255));// 夜=品红
            blockMats[ParcelFunc.PUB] = MakeMat(shader, new Color32(0xED, 0xED, 0xEA, 255)); // 公=车白
            congMats = new Material[7];
            congMats[0] = MakeMat(shader, new Color32(0x6E, 0x6E, 0x72, 255)); // 沥青灰=通畅
            congMats[1] = MakeMat(shader, new Color32(0x58, 0xA0, 0x5C, 255));
            congMats[2] = MakeMat(shader, new Color32(0x9A, 0xCD, 0x5A, 255));
            congMats[3] = MakeMat(shader, new Color32(0xEF, 0xCF, 0x3F, 255)); // 金
            congMats[4] = MakeMat(shader, new Color32(0xEF, 0x83, 0x33, 255));
            congMats[5] = MakeMat(shader, new Color32(0xEF, 0x6F, 0x76, 255)); // 警示红
            congMats[6] = MakeMat(shader, new Color32(0xD7, 0x26, 0x3D, 255));
            agentMat = MakeMat(shader, new Color32(0x4F, 0xE3, 0xDC, 255));    // 数据流青
        }

        Material MakeMat(Shader sh, Color c)
        {
            var m = new Material(sh);
            if (m.HasProperty("_BaseColor")) m.SetColor("_BaseColor", c);
            else if (m.HasProperty("_Color")) m.SetColor("_Color", c);
            return m;
        }

        void BuildGround()
        {
            float size = bp().grid * bp().cellM;
            var go = GameObject.CreatePrimitive(PrimitiveType.Plane);
            go.name = "Ground";
            go.transform.SetParent(visRoot);
            go.transform.position = new Vector3(0f, -0.05f, 0f);
            go.transform.localScale = new Vector3(size / 10f, 1f, size / 10f);
            var sh = Shader.Find("Universal Render Pipeline/Lit"); if (sh == null) sh = Shader.Find("Standard");
            go.GetComponent<Renderer>().sharedMaterial = MakeMat(sh, new Color32(0x2A, 0x2E, 0x33, 255));
        }

        void BuildBlocks()
        {
            var b = bp();
            for (int i = 0; i < b.BlockCount; i++)
            {
                var parcel = core.parcels[i];
                float h = parcel.func == ParcelFunc.OFF ? 9f
                    : parcel.func == ParcelFunc.RES ? 4f
                    : parcel.func == ParcelFunc.SHOP ? 5f
                    : parcel.func == ParcelFunc.CLUB ? 5.5f : 3f;
                var mesh = BuildBlockMesh(i, h);
                var go = new GameObject("Block_" + parcel.id + "_" + parcel.func);
                go.transform.SetParent(visRoot);
                go.AddComponent<MeshFilter>().sharedMesh = mesh;
                go.AddComponent<MeshRenderer>().sharedMaterial = blockMats[parcel.func];
            }
        }

        Mesh BuildBlockMesh(int blockIndex, float h)
        {
            var b = bp();
            var verts = new List<Vector3>(1024); var tris = new List<int>(1536);
            int start = b.blockCellStart[blockIndex], end = b.blockCellStart[blockIndex + 1];
            for (int i = start; i < end; i += 2)
            {
                var c = b.CellCenter(b.blockCellFlat[i], b.blockCellFlat[i + 1]);
                float s = b.cellM * 0.98f;
                AddBox(verts, tris, c, s, h);
            }
            var mesh = new Mesh();
            mesh.SetVertices(verts); mesh.SetTriangles(tris, 0);
            mesh.RecalculateNormals(); mesh.RecalculateBounds();
            return mesh;
        }

        static void AddBox(List<Vector3> v, List<int> t, Vector3 center, float size, float h)
        {
            float s2 = size * 0.5f;
            int n = v.Count;
            // 顶面
            v.Add(center + new Vector3(-s2, h, -s2)); v.Add(center + new Vector3(-s2, h, s2));
            v.Add(center + new Vector3(s2, h, s2)); v.Add(center + new Vector3(s2, h, -s2));
            t.Add(n); t.Add(n + 1); t.Add(n + 2); t.Add(n); t.Add(n + 2); t.Add(n + 3);
            // 四侧（白盒读形用，省底面；绕序=法线朝外）
            int q = v.Count;
            v.Add(center + new Vector3(-s2, 0, -s2)); v.Add(center + new Vector3(-s2, 0, s2));
            v.Add(center + new Vector3(s2, 0, s2)); v.Add(center + new Vector3(s2, 0, -s2));
            t.Add(q + 0); t.Add(q + 1); t.Add(n + 1); t.Add(q + 0); t.Add(n + 1); t.Add(n + 0);   // -X 侧
            t.Add(q + 2); t.Add(q + 3); t.Add(n + 3); t.Add(q + 2); t.Add(n + 3); t.Add(n + 2);   // +X 侧
            t.Add(q + 1); t.Add(q + 2); t.Add(n + 2); t.Add(q + 1); t.Add(n + 2); t.Add(n + 1);   // +Z 侧
            t.Add(q + 3); t.Add(q + 0); t.Add(n + 0); t.Add(q + 3); t.Add(n + 0); t.Add(n + 3);   // -Z 侧
        }

        void BuildRoads()
        {
            var b = bp();
            var proto = GameObject.CreatePrimitive(PrimitiveType.Cube);
            var mesh = proto.GetComponent<MeshFilter>().sharedMesh;
            GameObject.DestroyImmediate(proto);
            roadRenderers.Clear();
            var go0 = new GameObject("Roads"); go0.transform.SetParent(visRoot);
            for (int n = 0; n < core.roadCount; n++)
            {
                var go = new GameObject("R" + n);
                go.transform.SetParent(go0.transform);
                go.AddComponent<MeshFilter>().sharedMesh = mesh;
                var r = go.AddComponent<MeshRenderer>();
                var c = b.CellCenter(core.nodeCellX[n], core.nodeCellY[n]);
                go.transform.position = new Vector3(c.x, 0.12f, c.z);
                go.transform.localScale = new Vector3(b.cellM * 0.94f, 0.24f, b.cellM * 0.94f);
                r.sharedMaterial = congMats[0];
                roadRenderers.Add(r);
            }
        }

        void BuildAgents()
        {
            agentCubes.Clear();
            var proto = GameObject.CreatePrimitive(PrimitiveType.Cube);
            var mesh = proto.GetComponent<MeshFilter>().sharedMesh;
            GameObject.DestroyImmediate(proto);
            var root = new GameObject("Agents"); root.transform.SetParent(visRoot);
            for (int i = 0; i < core.agents.Count; i++)
            {
                var go = new GameObject("A" + i);
                go.transform.SetParent(root.transform);
                go.AddComponent<MeshFilter>().sharedMesh = mesh;
                var r = go.AddComponent<MeshRenderer>();
                r.sharedMaterial = agentMat;
                go.transform.localScale = new Vector3(2.0f, 2.0f, 2.0f);
                agentCubes.Add(go.transform);
            }
        }

        void BuildRings()
        {
            var root = new GameObject("ServiceRings"); root.transform.SetParent(visRoot);
            foreach (var p in core.parcels)
            {
                if (p.func != ParcelFunc.PUB) continue;
                var go = new GameObject("Ring_" + p.id);
                go.transform.SetParent(root.transform);
                var lr = go.AddComponent<LineRenderer>();
                lr.positionCount = 49;
                lr.widthMultiplier = 1.2f;
                lr.material = blockMats[ParcelFunc.RES];
                float rad = CitySimCore.COVERAGE_RADIUS_M;
                var c = bp().CellCenter((int)p.cx, (int)p.cy);
                for (int i = 0; i <= 48; i++)
                {
                    float a = i / 48f * Mathf.PI * 2f;
                    lr.SetPosition(i, new Vector3(c.x + Mathf.Cos(a) * rad, 14f, c.z + Mathf.Sin(a) * rad));
                }
            }
        }

        void BuildHud()
        {
            var go = new GameObject("HudText");
            go.transform.SetParent(visRoot);
            go.transform.position = new Vector3(0f, 30f, 142f); // 城南暗地面带上=白字对比度区
            hud = go.AddComponent<TextMesh>();
            hud.fontSize = 40;
            hud.characterSize = 2.2f;
            hud.anchor = TextAnchor.MiddleCenter;
            var font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            if (font != null) hud.font = font;
            hud.color = Color.white;
        }

        // ---------------- 可视化应用 ----------------

        public void ApplyVisuals()
        {
            if (visRoot == null) BuildVisuals();
            var b = bp();
            // 道路拥堵热力（7 桶材质·sharedMaterial 换装=合批友好；cong 0→灰·0.17 起绿→1 红）
            for (int n = 0; n < roadRenderers.Count; n++)
            {
                float cong = core.Congestion(n);
                int lvl = Mathf.Clamp(Mathf.FloorToInt(cong * 6f), 0, 6);
                roadRenderers[n].sharedMaterial = congMats[lvl];
            }
            // agent 位置
            for (int i = 0; i < core.agents.Count && i < agentCubes.Count; i++)
            {
                var a = core.agents[i];
                var tr = agentCubes[i];
                Vector3 pos;
                if (a.state == CitySimCore.AgentState.Walking)
                {
                    Vector3 p0 = b.CellCenter(core.nodeCellX[a.path[a.seg]], core.nodeCellY[a.path[a.seg]]);
                    int nxt = Mathf.Min(a.seg + 1, a.path.Count - 1);
                    Vector3 p1 = b.CellCenter(core.nodeCellX[nxt], core.nodeCellY[nxt]);
                    pos = Vector3.Lerp(p0, p1, a.frac) + new Vector3(0f, 1.7f, 0f);
                }
                else
                {
                    int pid = a.state == CitySimCore.AgentState.Arrived ? a.workParcel : a.homeParcel;
                    var parcel = core.ParcelById(pid);
                    pos = parcel != null
                        ? b.CellCenter((int)parcel.cx, (int)parcel.cy) + new Vector3(0f, 1.7f, 0f)
                        : new Vector3(0f, 1.7f, 0f);
                }
                tr.position = pos;
                tr.gameObject.SetActive(true);
            }
            // HUD
            if (hud != null)
            {
                var top = core.TopCongested(1);
                string topStr = top.Count > 0
                    ? string.Format("cell({0},{1}) lvl {2:F2}", core.nodeCellX[top[0]], core.nodeCellY[top[0]], core.Congestion(top[0]))
                    : "n/a";
                hud.text = string.Format(
                    "CitySimLab v0.1  T={0:00}:{1:00}  departed={2} arrived={3} transit={4} stuck={5}\nRES-PUB coverage {6}/{7}   TOP-CONG {8}",
                    Mathf.FloorToInt(core.clockMin / 60f), Mathf.FloorToInt(core.clockMin % 60f),
                    core.departed, core.arrived, core.inTransit, core.stuck,
                    core.CoveredResCount(), core.ResParcelCount(), topStr);
            }
            lastApply = Time.realtimeSinceStartup;
        }

        public void AimHudAt(Camera cam)
        {
            if (hud == null || cam == null) return;
            hud.transform.LookAt(cam.transform.position);
            hud.transform.Rotate(0f, 180f, 0f); // TextMesh 面向 +Z，LookAt 后须翻 Y 否则镜像（本帧判例）
        }

        // ---------------- play 模式驱动（交互观察用） ----------------

        void Update()
        {
            if (!Application.isPlaying) return;
            if (core == null) { Init(); BuildVisuals(); }
            core.Step(simMinutesPerRealSecond * Time.deltaTime);
            if (Time.realtimeSinceStartup - lastApply > 0.2f) ApplyVisuals();
        }

        void OnGUI()
        {
            if (!Application.isPlaying || core == null) return;
            GUI.Label(new Rect(16f, 16f, 1200f, 60f),
                string.Format("CitySimLab  T={0:00}:{1:00}  departed={2} arrived={3} transit={4} stuck={5}  coverage={6}/{7}",
                    Mathf.FloorToInt(core.clockMin / 60f), Mathf.FloorToInt(core.clockMin % 60f),
                    core.departed, core.arrived, core.inTransit, core.stuck,
                    core.CoveredResCount(), core.ResParcelCount()));
        }

        // ---------------- 清理 ----------------

        public void ClearVisuals()
        {
            roadRenderers.Clear(); agentCubes.Clear();
            var old = transform.Find("SimLabVisuals");
            if (old != null) GameObject.DestroyImmediate(old.gameObject);
            // SimLabVisuals 建在根级（非本组件子级）
            var sceneRoot = UnityEngine.SceneManagement.SceneManager.GetActiveScene().GetRootGameObjects();
            foreach (var go in sceneRoot)
                if (go.name == "SimLabVisuals") { GameObject.DestroyImmediate(go); break; }
        }

        SimBlueprint bp() { return core.bp; }
    }
}
