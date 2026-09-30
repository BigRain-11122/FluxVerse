using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine;

namespace CitySim
{
    // Kit 件测量探针（V2 陆家嘴批引擎准备·CEO 令 O-2026-0930-012）
    // 测 AD-022 塔楼族（Office/Apartment Stack/Spire/Station）+AD-020 备料件的尺寸/枢轴——三件套堆叠装配设计数据件
    public static class CitySimKitProbe
    {
        static string Staging
        {
            get
            {
                return Path.GetFullPath(Path.Combine(Directory.GetParent(Application.dataPath).FullName, "..", "City3D-staging"));
            }
        }

        static Vector3 Measure(GameObject pf, out Vector3 center)
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
            center = b.center - probe;
            return b.size;
        }

        static IEnumerable<GameObject> PackPrefabs(string packMark, string prefix)
        {
            foreach (string guid in AssetDatabase.FindAssets(prefix + " t:Prefab"))
            {
                string p = AssetDatabase.GUIDToAssetPath(guid);
                if (p.Contains(packMark)) yield return AssetDatabase.LoadAssetAtPath<GameObject>(p);
            }
        }

        public static void Run()
        {
            try
            {
                EditorSceneManager.NewScene(NewSceneSetup.EmptyScene, NewSceneMode.Single);
                var sb = new StringBuilder();
                sb.AppendLine("# Kit 塔楼族测量（V2 陆家嘴批·" + DateTime.Now.ToString("yyyy-MM-dd HH:mm") + "）");
                string[][] groups = new string[][]
                {
                    // AD-022 城市包：Office 族（OfficeRound/Square/Base/Roof）+ Apartment 模块套件 + 地标件
                    new string[] { "AD-022_", "SM_Bld_Office" },
                    new string[] { "AD-022_", "SM_Bld_Apartment" },
                    new string[] { "AD-022_", "SM_Bld_Spire" },
                    new string[] { "AD-022_", "SM_Bld_Station" },
                    new string[] { "AD-022_", "SM_Bld_Water_Tower" },
                    // AD-020 太空：Bld 空间站件（实验区/超现实备料）
                    new string[] { "AD-020_", "SM_Bld_" },
                };
                int n = 0;
                foreach (var g in groups)
                {
                    sb.AppendLine();
                    sb.AppendLine("## " + g[1] + "* @ " + g[0]);
                    foreach (var pf in PackPrefabs(g[0], g[1]))
                    {
                        Vector3 ct;
                        Vector3 sz = Measure(pf, out ct);
                        sb.AppendLine(pf.name + ": size=(" + sz.x.ToString("F3") + "," + sz.y.ToString("F3") + "," + sz.z.ToString("F3") + ") ct=(" + ct.x.ToString("F3") + "," + ct.y.ToString("F3") + "," + ct.z.ToString("F3") + ")");
                        n++;
                    }
                }
                sb.AppendLine();
                sb.AppendLine("计：distinct " + n + " 件");
                Directory.CreateDirectory(Staging);
                File.WriteAllText(Path.Combine(Staging, "citysim-kitprobe.md"), sb.ToString(), Encoding.UTF8);
                File.WriteAllText(Path.Combine(Staging, "citysim-kitprobe.done"), "KitProbe|" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "|PASS|" + n, Encoding.UTF8);
                Debug.Log("[KitProbe] PASS " + n + " -> citysim-kitprobe.md");
            }
            catch (Exception e)
            {
                Directory.CreateDirectory(Staging);
                File.WriteAllText(Path.Combine(Staging, "citysim-kitprobe.done"), "KitProbe|" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "|FAIL|" + e.Message.Replace('\n', ' '), Encoding.UTF8);
                Debug.LogError("[KitProbe] FAIL: " + e.Message);
                throw;
            }
        }
    }
}
