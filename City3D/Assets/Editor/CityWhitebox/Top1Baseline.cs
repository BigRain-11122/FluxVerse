using UnityEngine;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine.Rendering;
using System.IO;
using System.Text;

// P1 官方基准档提取（Top1 施工案 09-29·CEO 令）：逐包开本地 demo 场景提取灯光/雾/环境光/后处理 Volume 全参数
// 参数权威通道=本地 48 包 demo（R-20260929-city-top1-01：City Pack v1.12.0 "Added lighting and post processing" 直读）·禁网络猜参
public static class Top1Baseline
{
    static readonly (string ad, string path)[] Scenes =
    {
        ("AD-022 CityPack 现代城市", "Assets/lowpoly/01_现代城市生活/AD-022_Scene场景_现代城市_CityPack/PolygonCity/Scenes/Demo.unity"),
        ("AD-018 SciFiCity 赛博城",  "Assets/lowpoly/03_科幻/AD-018_Scene场景_赛博科幻城_SciFiCity/PolygonSciFiCity/Scenes/Demo.unity"),
        ("AD-015 Nature 植被地形",   "Assets/lowpoly/00_通用底座/AD-015_Scene场景_自然植被地形_NaturePack/PolygonNature/Scenes/DemoScene_01.unity"),
        ("AD-048 Starter 起始包",   "Assets/lowpoly/00_通用底座/AD-048_Scene场景_起始基础包_StarterPack/PolygonStarter/Scenes/Demo.unity"),
    };

    public static void BaselineEntry()
    {
        try { Run(); }
        catch (System.Exception e) { Debug.LogError("TOP1_BASELINE_FAIL: " + e); EditorApplication.Exit(1); }
    }

    static void Run()
    {
        var sb = new StringBuilder();
        sb.AppendLine("# 官方基准档（Top1 施工案 P1·本地 demo 提取·R-city-top1-01 参数权威通道）");
        string projRoot = Path.GetFullPath(Path.Combine(Application.dataPath, ".."));
        string staging = Path.Combine(projRoot, "../City3D-staging");
        Directory.CreateDirectory(staging);

        foreach (var (ad, path) in Scenes)
        {
            string full = Path.Combine(Application.dataPath, path.Substring("Assets/".Length));
            sb.AppendLine($"\n## {ad}");
            if (!File.Exists(full)) { sb.AppendLine($"- MISSING: {path}"); continue; }
            var scene = EditorSceneManager.OpenScene(path, OpenSceneMode.Single);
            DumpRenderSettings(sb);
            DumpLights(sb);
            DumpVolumes(sb, projRoot);
            DumpCameras(sb);
            var go = scene.GetRootGameObjects();
            sb.AppendLine($"- root_objects={go.Length}");
        }

        // 项目管线资产上下文
        var urp = GraphicsSettings.defaultRenderPipeline as UnityEngine.Rendering.Universal.UniversalRenderPipelineAsset;
        if (urp != null) sb.AppendLine($"\n# ProjectURP asset={AssetDatabase.GetAssetPath(urp)} shadowDistance={urp.shadowDistance} msaa={urp.msaaSampleCount} hdr={(urp.supportsHDR?"on":"off")}");

        File.WriteAllText(Path.Combine(staging, "official-baseline.md"), sb.ToString());
        Debug.Log("TOP1_BASELINE_DONE");
    }

    static void DumpRenderSettings(StringBuilder sb)
    {
        sb.AppendLine($"- ambientMode={RenderSettings.ambientMode} ambientLight={Hex(RenderSettings.ambientLight)} ambientSky={Hex(RenderSettings.ambientSkyColor)} ambientEquator={Hex(RenderSettings.ambientEquatorColor)} ambientGround={Hex(RenderSettings.ambientGroundColor)} ambientInt={RenderSettings.ambientIntensity}");
        sb.AppendLine($"- fog={RenderSettings.fog} mode={RenderSettings.fogMode} color={Hex(RenderSettings.fogColor)} density={RenderSettings.fogDensity} linStart={RenderSettings.fogStartDistance} linEnd={RenderSettings.fogEndDistance}");
        sb.AppendLine($"- skybox={(RenderSettings.skybox ? AssetDatabase.GetAssetPath(RenderSettings.skybox) : "null")}");
        if (RenderSettings.sun != null) sb.AppendLine($"- sun={RenderSettings.sun.name} rot={RenderSettings.sun.transform.rotation.eulerAngles} intensity={RenderSettings.sun.intensity} color={Hex(RenderSettings.sun.color)} shadows={RenderSettings.sun.shadows} shadowStrength={RenderSettings.sun.shadowStrength} bounceIntensity={RenderSettings.sun.bounceIntensity}");
    }

    static void DumpLights(StringBuilder sb)
    {
        int n = 0;
        foreach (var l in Object.FindObjectsOfType<Light>())
        {
            n++;
            if (n > 12) { sb.AppendLine($"- lights... total>12 (capped)"); break; }
            sb.AppendLine($"- light[{n}] name={l.name} type={l.type} rot={l.transform.rotation.eulerAngles} intensity={l.intensity} color={Hex(l.color)} range={l.range} spot={l.spotAngle} shadows={l.shadows} strength={l.shadowStrength} layer={l.gameObject.layer} renderMode={l.renderMode}");
        }
        if (n == 0) sb.AppendLine("- lights: NONE");
    }

    static void DumpVolumes(StringBuilder sb, string projRoot)
    {
        var vols = Object.FindObjectsOfType<Volume>(true);
        if (vols.Length == 0) { sb.AppendLine("- volumes: NONE"); return; }
        int i = 0;
        foreach (var v in vols)
        {
            i++;
            string profilePath = v.sharedProfile ? AssetDatabase.GetAssetPath(v.sharedProfile) : "null";
            sb.AppendLine($"- volume[{i}] name={v.name} isGlobal={v.isGlobal} weight={v.weight} priority={v.priority} profile={profilePath}");
            if (!v.sharedProfile) continue;
            foreach (var c in v.sharedProfile.components)
            {
                sb.AppendLine($"  - comp={c.GetType().Name} active={c.active}");
                var so = new SerializedObject(c);
                var it = so.GetIterator();
                bool enter = true;
                while (it.Next(enter))
                {
                    enter = false;
                    if (it.name == "m_Name" || it.name.StartsWith("m_")) continue;
                    string val;
                    switch (it.propertyType)
                    {
                        case SerializedPropertyType.Float: val = it.floatValue.ToString("0.###"); break;
                        case SerializedPropertyType.Integer: val = it.intValue.ToString(); break;
                        case SerializedPropertyType.Boolean: val = it.boolValue.ToString(); break;
                        case SerializedPropertyType.Color: val = Hex(it.colorValue); break;
                        case SerializedPropertyType.Enum: val = it.enumNames[it.enumValueIndex]; break;
                        case SerializedPropertyType.ObjectReference: val = it.objectReferenceValue ? it.objectReferenceValue.name : "null"; break;
                        case SerializedPropertyType.Vector2: val = it.vector2Value.ToString(); break;
                        case SerializedPropertyType.Vector3: val = it.vector3Value.ToString(); break;
                        default: val = "(" + it.propertyType + ")"; break;
                    }
                    bool overridden = false;
                    var op = so.FindProperty(it.propertyPath + ".m_OverrideState");
                    if (op != null) overridden = op.boolValue;
                    sb.AppendLine($"    - {it.propertyPath} = {val}{(overridden ? " [OVR]" : "")}");
                }
            }
        }
    }

    static void DumpCameras(StringBuilder sb)
    {
        int i = 0;
        foreach (var cam in Object.FindObjectsOfType<Camera>(true))
        {
            i++;
            if (i > 4) break;
            var add = cam.GetComponent<UnityEngine.Rendering.Universal.UniversalAdditionalCameraData>();
            sb.AppendLine($"- cam[{i}] name={cam.name} fov={cam.fieldOfView} clear={cam.clearFlags} bg={Hex(cam.backgroundColor)} depth={cam.depth} postProcessing={(add != null ? add.renderPostProcessing.ToString() : "n/a")}");
            var t = cam.transform;
            sb.AppendLine($"    pos={t.position} rot={t.rotation.eulerAngles}");
        }
        if (i == 0) sb.AppendLine("- cameras: NONE");
    }

    static string Hex(Color c) { return $"#{ColorUtility.ToHtmlStringRGB(c)}({c.r:0.###},{c.g:0.###},{c.b:0.###})"; }
}
