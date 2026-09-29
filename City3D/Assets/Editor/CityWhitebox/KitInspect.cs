using System;
using System.Collections.Generic;
using System.IO;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine;

// KitInspect：未知库内件证据批（并行施工令 09-29）——单件实例化+多角度截图落盘
// 用途：桥全套 kit 件（Wall 曲墙/Underside/Pillar/Edge/Support）+ Corner 件旋转验证——看图定校位参数
public static class KitInspect
{
    const string EnvPf = "Assets/lowpoly/01_现代城市生活/AD-022_Scene场景_现代城市_CityPack/PolygonCity/Prefabs/Environments";
    static string Staging => Path.Combine(Directory.GetParent(Directory.GetParent(Application.dataPath).FullName).FullName, "City3D-staging", "kit-shots");

    public static void BatchEntry()
    {
        try { Inspect(); }
        catch (Exception e) { UnityEngine.Debug.LogError("KITINSPECT_FAIL: " + e); EditorApplication.Exit(1); }
    }

    static void Inspect()
    {
        Directory.CreateDirectory(Staging);
        var targets = new[] {
            "SM_Env_Bridge_Wall_01", "SM_Env_Bridge_Underside_01", "SM_Env_Bridge_Pillar_01",
            "SM_Env_Bridge_Edge_01", "SM_Env_Bridge_Support_01",
            "SM_Env_WaterEdge_Corner_01", "SM_Env_WaterEdge_Corner_02",
            "SM_Env_Path_Corner_01", "SM_Env_Path_T_01"
        };
        var scene = EditorSceneManager.NewScene(NewSceneSetup.EmptyScene, NewSceneMode.Single);
        var light = new GameObject("L"); var lr = light.AddComponent<Light>();
        lr.type = LightType.Directional; lr.transform.rotation = Quaternion.Euler(50f, -30f, 0f); lr.intensity = 1.15f;
        lr.shadows = LightShadows.Soft;

        var go = new GameObject("CameraRig");
        var cam = go.AddComponent<Camera>();
        cam.clearFlags = CameraClearFlags.SolidColor;
        cam.backgroundColor = new Color32(0x9A, 0xC4, 0xDD, 255);
        cam.fieldOfView = 45f;

        int shot = 0;
        foreach (var name in targets)
        {
            var pf = AssetDatabase.LoadAssetAtPath<GameObject>($"{EnvPf}/{name}.prefab");
            if (pf == null) { UnityEngine.Debug.Log($"KITINSPECT_MISSING: {name}"); continue; }
            var inst = (GameObject)PrefabUtility.InstantiatePrefab(pf);
            if (inst == null) continue;
            inst.transform.position = Vector3.zero;
            inst.transform.rotation = Quaternion.identity;
            // 材质过桥（kit 件=Built-in Standard→URP Lit 免品红证据图）
            foreach (var r in inst.GetComponentsInChildren<Renderer>())
            {
                var mats = r.sharedMaterials;
                for (int i = 0; i < mats.Length; i++)
                {
                    var m = mats[i];
                    if (m == null || (m.shader != null && m.shader.name.Contains("Universal Render Pipeline"))) continue;
                    var tex = m.HasProperty("_MainTex") ? m.GetTexture("_MainTex") : null;
                    var col = m.HasProperty("_Color") ? m.GetColor("_Color") : Color.white;
                    var um = new Material(Shader.Find("Universal Render Pipeline/Lit")) { name = "kit_inspect" };
                    if (tex != null) um.SetTexture("_BaseMap", tex);
                    um.SetColor("_BaseColor", col);
                    um.SetFloat("_Smoothness", 0f);
                    mats[i] = um;
                }
                r.sharedMaterials = mats;
            }
            // 相机适配包围盒
            var rends = inst.GetComponentsInChildren<Renderer>();
            Bounds b = rends[0].bounds; foreach (var r in rends) b.Encapsulate(r.bounds);
            float radius = Mathf.Max(b.size.x, b.size.y, b.size.z);
            float dist = radius * 1.6f + 1f;
            Vector3 center = b.center;
            // 三视角：俯 60° 全身 / 平视 10° / 侧平视（绕 90°）
            Shot(cam, $"{shot:D2}_{name}_top.png", center + new Vector3(0, dist * 0.87f, -dist * 0.5f), center);
            Shot(cam, $"{shot:D2}_{name}_front.png", center + new Vector3(0, radius * 0.15f, -dist), center);
            Shot(cam, $"{shot:D2}_{name}_side.png", center + new Vector3(dist, radius * 0.15f, 0), center);
            shot++;
            UnityEngine.Object.DestroyImmediate(inst);
        }
        UnityEngine.Debug.Log($"KITINSPECT_DONE shots={shot * 3}");
    }

    static void Shot(Camera cam, string file, Vector3 pos, Vector3 lookAt)
    {
        const int w = 960, h = 720;
        cam.transform.position = pos;
        cam.transform.LookAt(lookAt);
        var rt = new RenderTexture(w, h, 24);
        cam.targetTexture = rt; cam.Render();
        RenderTexture.active = rt;
        var t = new Texture2D(w, h, TextureFormat.RGB24, false);
        t.ReadPixels(new Rect(0, 0, w, h), 0, 0); t.Apply();
        File.WriteAllBytes(Path.Combine(Staging, file), t.EncodeToPNG());
        cam.targetTexture = null; RenderTexture.active = null;
        rt.Release(); UnityEngine.Object.DestroyImmediate(rt); UnityEngine.Object.DestroyImmediate(t);
    }
}
