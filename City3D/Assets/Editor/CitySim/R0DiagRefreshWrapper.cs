using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using UnityEditor;
using UnityEngine;

namespace CitySim
{
    /// <summary>
    /// R0 诊断取证包装入口（bm-a r623·O-20261003-1210 令 3）——零断言线触碰：
    /// Run()=Refresh 先行再调 bm-c 正主 RunR0Diag（分离刷新时序假设·已三跑证伪搜索面）。
    /// RunDirect()=绕 FindAssets 搜索面，按磁盘实存路径直载 dump（bm-c 令 3 要的
    /// animationType 实值/子资产类型清单/Avatar valid·isHuman·映射骨数/骨架骨名全表）。
    /// </summary>
    public static class R0DiagRefreshWrapper
    {
        const string CharFbx =
            "Assets/lowpoly/01_现代城市生活/AD-042_Char角色_都市人物_CityCharactersPack/POLYGONCityCharacters/Models/Character.fbx";

        public static void Run()
        {
            AssetDatabase.Refresh(ImportAssetOptions.ForceSynchronousImport);
            CitySimResidentsBatch.RunR0Diag();
        }

        public static void RunDirect()
        {
            var sb = new StringBuilder();
            string stage = Path.GetFullPath(Path.Combine(Application.dataPath, "..", "..", "City3D-staging"));
            sb.AppendLine("# R0 直载 dump（绕 FindAssets 搜索面·bm-a r623·" + DateTime.Now.ToString("yyyy-MM-dd HH:mm") + "）");
            sb.AppendLine("> 溯源=三跑证伪搜索面（12:40 冷库/12:43 温库/12:47 Refresh 强刷均 found=0）→按磁盘实存路径直载取证；路径=PS 扫描实证（Character.fbx 单数·AD-042 包·meta guid 4a5a8c8f/animationType=3）。");
            try
            {
                if (!File.Exists(Path.Combine(Application.dataPath, CharFbx.Substring("Assets/".Length))))
                {
                    sb.AppendLine("- 磁盘面：文件不存在：" + CharFbx);
                }
                else
                {
                    sb.AppendLine("- 磁盘面：文件在位 " + CharFbx);
                    var mi = (ModelImporter)AssetImporter.GetAtPath(CharFbx);
                    sb.AppendLine("- ModelImporter=" + (mi == null ? "null" : "OK"));
                    if (mi != null)
                    {
                        sb.AppendLine("  animationType=" + mi.animationType + " (int=" + ((int)mi.animationType) + ")");
                        sb.AppendLine("  clipAnimations=" + (mi.clipAnimations == null ? "null" : mi.clipAnimations.Length.ToString())
                            + "  materialImportMode=" + mi.materialImportMode);
                    }
                    sb.AppendLine("  子资产清单（LoadAllAssetsAtPath）：");
                    var all = AssetDatabase.LoadAllAssetsAtPath(CharFbx);
                    int avCount = 0;
                    if (all == null || all.Length == 0) sb.AppendLine("    - (空)");
                    foreach (var o in all)
                    {
                        if (o == null) { sb.AppendLine("    - <null>"); continue; }
                        var av = o as Avatar;
                        string extra = "";
                        if (av != null)
                        {
                            avCount++;
                            int mapped = -1;
                            bool humanOk = false;
                            try { mapped = av.humanDescription.human.Length; } catch (Exception e) { extra += " humanDescription读取异常:" + e.Message; }
                            try { humanOk = av.isHuman; } catch { }
                            extra = "  [AVATAR valid=" + av.isValid + " isHuman=" + humanOk + " mappedBones=" + mapped + "]" + extra;
                        }
                        sb.AppendLine("    - " + o.GetType().Name + " : " + o.name + extra);
                    }
                    sb.AppendLine("  avatar 子资产数=" + avCount);
                    var go = AssetDatabase.LoadAssetAtPath<GameObject>(CharFbx);
                    if (go != null)
                    {
                        var bones = new List<string>();
                        foreach (var t in go.transform.GetComponentsInChildren<Transform>(true)) bones.Add(t.name);
                        sb.AppendLine("  GameObject=OK bone-count=" + bones.Count);
                        sb.AppendLine("  bones=" + string.Join(",", bones.ToArray()));
                        var an = go.GetComponent<Animator>();
                        sb.AppendLine("  组件 Animator=" + (an != null ? ("avatar=" + (an.avatar != null ? an.avatar.name : "null")) : "无"));
                    }
                    else sb.AppendLine("  GameObject=null");
                }
            }
            catch (Exception e)
            {
                sb.AppendLine("- dump 异常：" + e.Message);
            }
            Directory.CreateDirectory(stage);
            File.WriteAllText(Path.Combine(stage, "r0diag-direct-report.md"), sb.ToString(), Encoding.UTF8);
            File.WriteAllText(Path.Combine(stage, "r0diag-direct.done"), "R0DiagDirect|" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "|DONE", Encoding.UTF8);
            Debug.Log("[R0DiagWrapper] direct dump done -> " + stage);
        }
    }
}
