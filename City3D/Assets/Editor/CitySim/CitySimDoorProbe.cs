using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine;

namespace CitySim
{
    // 门件截面探针（A2 城批 4 命中归因·CEO 令 09-30 硅基城市全面开工）
    // 三探定谳：城批实形=X-only 非均匀拉伸 → 凹 MeshCollider 非均匀缩放=PhysX 未定义行为（门洞假封闭）复现
    public static class CitySimDoorProbe
    {
        static string Staging
        {
            get
            {
                return Path.GetFullPath(Path.Combine(Directory.GetParent(Application.dataPath).FullName, "..", "City3D-staging"));
            }
        }

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
            size = b.size;
            center = b.center - probe;
        }

        // 截面图：行=沿长轴偏移·列=高度·#=有命中·.=通透·附 0.8 高命中列详情
        // scaleV=三轴独立缩放·boxMode=BoxCollider 对照（尺寸=mesh 本地包围盒·缩放安全律验证）
        static string MapPiece(GameObject pf, Vector3 size, Vector3 ct, Vector3 scaleV, bool boxMode)
        {
            var go = (GameObject)PrefabUtility.InstantiatePrefab(pf);
            go.transform.position = new Vector3(-ct.x * scaleV.x, -ct.y * scaleV.y, -ct.z * scaleV.z);
            go.transform.localScale = scaleV;
            if (boxMode)
            {
                var mf = go.GetComponent<MeshFilter>();
                if (mf != null && mf.sharedMesh != null)
                {
                    var bc = go.AddComponent<BoxCollider>();
                    bc.center = mf.sharedMesh.bounds.center;
                    bc.size = mf.sharedMesh.bounds.size;
                }
            }
            else if (go.GetComponent<Collider>() == null)
            {
                var mf = go.GetComponent<MeshFilter>();
                if (mf != null && mf.sharedMesh != null) go.AddComponent<MeshCollider>().sharedMesh = mf.sharedMesh;
            }
            bool alongX = size.x >= size.z;
            float halfLong = (alongX ? size.x * scaleV.x : size.z * scaleV.z) / 2f;
            float halfThick = (alongX ? size.z * scaleV.z : size.x * scaleV.x) / 2f;
            float[] hs = { 0.3f, 0.8f, 1.2f, 1.6f, 2.0f, 2.6f };
            var sb = new StringBuilder();
            sb.AppendLine("scale=(" + scaleV.x + "," + scaleV.y + "," + scaleV.z + ") collider=" + (boxMode ? "Box" : "Mesh") + " halfLong=" + halfLong.ToString("F2") + " halfThick=" + halfThick.ToString("F2"));
            sb.Append("off\\h ");
            foreach (var h in hs) sb.Append(h.ToString("F1").PadLeft(5));
            sb.AppendLine();
            var hits08 = new List<string>();
            for (float off = -halfLong; off <= halfLong + 0.001f; off += 0.1f)
            {
                float o = (float)Math.Round(off, 1);
                sb.Append(o.ToString("F1").PadLeft(6));
                foreach (var h in hs)
                {
                    Vector3 a = alongX ? new Vector3(o, h, -1f) : new Vector3(-1f, h, o);
                    Vector3 b2 = alongX ? new Vector3(o, h, 1f) : new Vector3(1f, h, o);
                    Vector3 dir = b2 - a;
                    var hits = Physics.RaycastAll(a, dir / dir.magnitude, dir.magnitude);
                    bool hit = hits.Length > 0;
                    sb.Append(hit ? "    #" : "    .");
                    if (hit && Math.Abs(h - 0.8f) < 0.01f)
                    {
                        float md = float.MaxValue; RaycastHit mh = hits[0];
                        foreach (var hh in hits) if (hh.distance < md) { md = hh.distance; mh = hh; }
                        hits08.Add(o.ToString("F1") + "->" + mh.collider.name + " d=" + md.ToString("F2"));
                    }
                }
                sb.AppendLine();
            }
            sb.AppendLine("h0.8 命中列: " + (hits08.Count == 0 ? "无" : string.Join(" · ", hits08.ToArray())));
            UnityEngine.Object.DestroyImmediate(go);
            return sb.ToString();
        }

        // 城场景材质审计（团结引擎 meta 加密挡外部 guid 对账→须编辑器内问路径）
        public static void MatAudit()
        {
            try
            {
                EditorSceneManager.OpenScene("Assets/Scenes/CitySim_CityV1.unity", OpenSceneMode.Single);
                var seen = new Dictionary<Material, int>();
                foreach (var r in UnityEngine.Object.FindObjectsOfType<Renderer>())
                    foreach (var m in r.sharedMaterials)
                        if (m != null) { int c; seen.TryGetValue(m, out c); seen[m] = c + 1; }
                var sb = new StringBuilder();
                sb.AppendLine("# CitySim_CityV1 材质审计（" + DateTime.Now.ToString("yyyy-MM-dd HH:mm") + "）·renderers=" + UnityEngine.Object.FindObjectsOfType<Renderer>().Length);
                foreach (var kv in seen)
                    sb.AppendLine(kv.Value + " x " + kv.Key.name + " | " + AssetDatabase.GetAssetPath(kv.Key) + " | " + (kv.Key.shader != null ? kv.Key.shader.name : "?"));
                File.WriteAllText(Path.Combine(Staging, "citysim-mataudit.md"), sb.ToString(), Encoding.UTF8);
                File.WriteAllText(Path.Combine(Staging, "citysim-mataudit.done"), "MatAudit|" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "|PASS", Encoding.UTF8);
                Debug.Log("[MatAudit] PASS");
            }
            catch (Exception e)
            {
                Directory.CreateDirectory(Staging);
                File.WriteAllText(Path.Combine(Staging, "citysim-mataudit.done"), "MatAudit|" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "|FAIL|" + e.Message.Replace('\n', ' '), Encoding.UTF8);
                Debug.LogError("[MatAudit] FAIL: " + e.Message);
                throw;
            }
        }

        public static void Run()
        {
            try
            {
                EditorSceneManager.NewScene(NewSceneSetup.EmptyScene, NewSceneMode.Single);
                var pfA = FindPf("SM_Bld_House_ExteriorWall_GroundFloor_Door_01", "AD-021_");
                var pfW = FindPf("SM_Bld_House_ExteriorWall_GroundFloor_Window_01", "AD-021_");
                Vector3 szA, ctA, szW, ctW;
                Measure(pfA, out szA, out ctA); Measure(pfW, out szW, out ctW);
                var sb = new StringBuilder();
                sb.AppendLine("# 门件截面探针三探（凹 MeshCollider×非均匀缩放伪影定谳·" + DateTime.Now.ToString("yyyy-MM-dd HH:mm") + "）");
                sb.AppendLine("宅门 size=" + szA.ToString("F3") + " ct=" + ctA.ToString("F3") + "·宅窗 size=" + szW.ToString("F3") + " ct=" + ctW.ToString("F3"));
                sb.AppendLine();
                sb.AppendLine("## 宅门 均匀 s=(1,1,1)·Mesh（基线）"); sb.AppendLine(MapPiece(pfA, szA, ctA, new Vector3(1f, 1f, 1f), false));
                sb.AppendLine("## 宅门 X-only s=(1.0667,1,1)·Mesh（城批块9实形——伪影复现位）"); sb.AppendLine(MapPiece(pfA, szA, ctA, new Vector3(1.0667f, 1f, 1f), false));
                sb.AppendLine("## 宅门 X-only s=(0.9,1,1)·Mesh"); sb.AppendLine(MapPiece(pfA, szA, ctA, new Vector3(0.9f, 1f, 1f), false));
                sb.AppendLine("## 宅门 X-only s=(0.85,1,1)·Mesh"); sb.AppendLine(MapPiece(pfA, szA, ctA, new Vector3(0.85f, 1f, 1f), false));
                sb.AppendLine("## 宅门 X-only s=(1.2,1,1)·Mesh"); sb.AppendLine(MapPiece(pfA, szA, ctA, new Vector3(1.2f, 1f, 1f), false));
                sb.AppendLine("## 宅窗 X-only s=(1.0667,1,1)·Mesh（侧翼窗件伪影查）"); sb.AppendLine(MapPiece(pfW, szW, ctW, new Vector3(1.0667f, 1f, 1f), false));
                sb.AppendLine("## 宅门 X-only s=(1.0667,1,1)·Box（Box 缩放安全律对照——Box 封门洞=门件禁 Box 的证）"); sb.AppendLine(MapPiece(pfA, szA, ctA, new Vector3(1.0667f, 1f, 1f), true));
                sb.AppendLine("## 宅窗 X-only s=(1.0667,1,1)·Box（墙/窗件 Box 正法验证）"); sb.AppendLine(MapPiece(pfW, szW, ctW, new Vector3(1.0667f, 1f, 1f), true));
                Directory.CreateDirectory(Staging);
                File.WriteAllText(Path.Combine(Staging, "citysim-doorprobe.md"), sb.ToString(), Encoding.UTF8);
                File.WriteAllText(Path.Combine(Staging, "citysim-doorprobe.done"), "DoorProbe|" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "|PASS", Encoding.UTF8);
                Debug.Log("[DoorProbe] PASS -> citysim-doorprobe.md");
            }
            catch (Exception e)
            {
                Directory.CreateDirectory(Staging);
                File.WriteAllText(Path.Combine(Staging, "citysim-doorprobe.done"), "DoorProbe|" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "|FAIL|" + e.Message.Replace('\n', ' '), Encoding.UTF8);
                Debug.LogError("[DoorProbe] FAIL: " + e.Message);
                throw;
            }
        }
    }
}
