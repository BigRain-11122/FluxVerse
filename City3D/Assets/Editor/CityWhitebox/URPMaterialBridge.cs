using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine;
using UnityEngine.Rendering;
using UnityEngine.Rendering.Universal;

// URP 材质过桥器（Synty Prefab Built-in Standard→URP Lit 逐渲染器换装）+ shadowDistance 调大（俯视高机位丢影坑律·P3D spike 在册）
public static class URPMaterialBridge
{
    static readonly Dictionary<Material, Material> Cache = new Dictionary<Material, Material>();
    static int _converted, _skipped, _renderers;

    public static void BatchEntry()
    {
        try { Bridge(); }
        catch (Exception e) { UnityEngine.Debug.LogError("CITY3D_BRIDGE_FAIL: " + e); EditorApplication.Exit(1); }
    }

    static void Bridge()
    {
        var sw = Stopwatch.StartNew();
        Directory.CreateDirectory(Path.Combine(Application.dataPath, "Art/Bridge"));

        // v8 判据帧确定性律（根因修）：DayNightCycle 编辑态 tick 会在分钟级材质转换期把光 rig 覆写成北京钟实况
        // ——v3.1 起 B_ 系日帧全是午后循环态非官方基准档。开场即禁，桥毕再开（GUI 实检=实时城光）。
        var cyc0 = UnityEngine.Object.FindObjectOfType<DayNightCycle>();
        if (cyc0 != null) cyc0.enabled = false;

        // 1) shadowDistance 调大（当前 URP 资产）
        var urp = GraphicsSettings.currentRenderPipeline as UniversalRenderPipelineAsset;
        if (urp != null)
        {
            urp.shadowDistance = 600f;
            urp.supportsHDR = true; // v3 bloom 前置（HDR 依赖）
            var so = new SerializedObject(urp);
            var sp = so.FindProperty("m_MainLightShadowsSupported");
            if (sp != null) sp.boolValue = true;
            so.ApplyModifiedPropertiesWithoutUndo();
            EditorUtility.SetDirty(urp);
            AssetDatabase.SaveAssets();
            UnityEngine.Debug.Log($"BRIDGE: shadowDistance -> {urp.shadowDistance} mainLightShadows -> {(sp != null ? "ON" : "prop?")}");
        }

        // 2) 开装配场景·逐渲染器换装
        var scene = EditorSceneManager.OpenScene("Assets/Scenes/CityAssembled.unity", OpenSceneMode.Single);
        foreach (var r in UnityEngine.Object.FindObjectsOfType<Renderer>())
        {
            _renderers++;
            var mats = r.sharedMaterials;
            var changed = false;
            for (int i = 0; i < mats.Length; i++)
            {
                var m = mats[i];
                if (m == null) continue;
                if (m.shader != null && m.shader.name.Contains("Universal Render Pipeline")) { _skipped++; continue; }
                var conv = Convert(m);
                if (conv != null) { mats[i] = conv; changed = true; _converted++; }
            }
            if (changed) { r.sharedMaterials = mats; EditorUtility.SetDirty(r); }
        }
        EditorSceneManager.SaveScene(scene);

        // 3) 重出判据帧
        var cam = Camera.main;
        if (cam != null) Capture(cam);

        UnityEngine.Debug.Log($"CITY3D_BRIDGE_DONE renderers={_renderers} converted={_converted} skipped_urp={_skipped} ms={sw.ElapsedMilliseconds}");
        AssetDatabase.SaveAssets();
    }

    public static Material Convert(Material src) // v0.2 试点批升 public：CitySimShellBuilder 复用（免重造轮律）
    {
        if (Cache.TryGetValue(src, out var cached)) return cached;
        var name = string.IsNullOrEmpty(src.name) ? "mat" + Guid.NewGuid().ToString("N").Substring(0, 6) : src.name;
        var path = $"Assets/Art/Bridge/{name}_URP.mat";
        var existing = AssetDatabase.LoadAssetAtPath<Material>(path);
        if (existing != null) { Cache[src] = existing; return existing; }

        var m = new Material(Shader.Find("Universal Render Pipeline/Lit")) { name = name + "_URP" };
        // 平涂贴图/颜色搬运（Standard -> URP Lit）
        if (src.HasProperty("_MainTex"))
        {
            var tex = src.GetTexture("_MainTex");
            if (tex != null) m.SetTexture("_BaseMap", tex);
            if (src.HasProperty("_Color")) m.SetColor("_BaseColor", src.GetColor("_Color"));
            else m.SetColor("_BaseColor", Color.white);
        }
        else if (src.HasProperty("_Color"))
        {
            m.SetColor("_BaseColor", src.GetColor("_Color"));
        }
        m.SetFloat("_Smoothness", 0f);
        if (src.IsKeywordEnabled("_EMISSION") || (src.HasProperty("_EmissionColor") && src.GetColor("_EmissionColor").maxColorComponent > 0.01f))
        {
            m.EnableKeyword("_EMISSION");
            if (src.HasProperty("_EmissionColor")) m.SetColor("_EmissionColor", src.GetColor("_EmissionColor"));
        }
        AssetDatabase.CreateAsset(m, path);
        Cache[src] = m;
        return m;
    }

    static void Capture(Camera cam)
    {
        var shots = Path.Combine(Directory.GetParent(Directory.GetParent(Application.dataPath).FullName).FullName, "City3D-staging", "shots3");
        Directory.CreateDirectory(shots);
        var cyc = UnityEngine.Object.FindObjectOfType<DayNightCycle>();
        if (cyc != null) cyc.enabled = false;   // v6 判据帧确定性律（桥捕获期同禁北京钟）
        var rootGo = GameObject.Find("AssembledCity");
        Shot(cam, Path.Combine(shots, "B_L0_overview.png"), 50f, 320f, Vector3.zero);
        Shot(cam, Path.Combine(shots, "B_L1_brainring.png"), 55f, 110f, new Vector3(0, 20f, 0));
        Shot(cam, Path.Combine(shots, "B_L2_street.png"), 60f, 24f, new Vector3(180, 6, -34)); // QUANT 城街景
        // v2 三特写（与 Assemble A_X_* 同机位·锚(24,45)·1格=5m 换算）
        Shot(cam, Path.Combine(shots, "B_X_bridge.png"), 50f, 30f, new Vector3(0f, 0f, -95f)); // 桥跨全貌（跨外南望·防机位入跨判例）
        Shot(cam, Path.Combine(shots, "B_X_shore.png"), 58f, 16f, new Vector3(160f, 0f, -65f));       // 长桥段水岸 WaterEdge
        Shot(cam, Path.Combine(shots, "B_X_plaza.png"), 50f, 16f, Vector3.zero);                      // 广场铺装+脑塔堆叠
        // v3 夜档呈审帧（五色律窗灯+bloom 可见判据·俯角+38 下倾）
        var light = UnityEngine.Object.FindObjectOfType<Light>();
        if (light != null)
        {
            var dayRot = light.transform.rotation; var dayInt = light.intensity; var dayCol = light.color;
            var dayBg = cam.backgroundColor; var dayClear = cam.clearFlags; var dayFog = RenderSettings.fog;
            var dayFogD = RenderSettings.fogDensity; var dayFogCol = RenderSettings.fogColor;
            var dayShad = light.shadowStrength;
            var fillObj = GameObject.Find("SkyFill_Light");
            var fl2 = fillObj != null ? fillObj.GetComponent<Light>() : null;
            var fillDayInt = fl2 != null ? fl2.intensity : 0f;
            var fillDayCol = fl2 != null ? fl2.color : Color.white;
            if (fl2 != null) { fl2.intensity = 0.06f; fl2.color = new Color32(0x2A, 0x35, 0x50, 255); }  // v7 夜帧补光压暗转冷
            var nfx = rootGo != null ? rootGo.transform.Find("NightFX") : null;
            if (nfx != null) nfx.gameObject.SetActive(true);                    // v7 路灯光池层激活
            light.transform.rotation = Quaternion.Euler(38f, 150f, 0f);
            light.intensity = 0.18f;                                             // v7 月光档
            light.color = new Color32(0xA9, 0xC2, 0xE8, 255);                     // v7 冷月光
            light.shadowStrength = 0.95f;                                              // v6 夜帧阴影提亮保剪影
            cam.clearFlags = CameraClearFlags.SolidColor;                              // v6 夜帧实底天（程序化天空盒白昼读法判负）
            cam.backgroundColor = new Color32(0x12, 0x1A, 0x30, 255);
            RenderSettings.fog = true;                                                // v7 夜帧极淡冷雾
            RenderSettings.fogColor = new Color32(0x0E, 0x16, 0x26, 255);
            RenderSettings.fogDensity = 0.0008f;
            if (rootGo != null) CityAssembler.ApplyNightWindows(rootGo.transform);    // v6 五色律窗灯（桥夜帧自换装·可逆）
            Shot(cam, Path.Combine(shots, "B_X_night_district.png"), 55f, 60f, new Vector3(180f, 0, 0)); // QUANT 夜景金窗
            Shot(cam, Path.Combine(shots, "B_X_night_plaza.png"), 55f, 40f, new Vector3(0, 10f, 0));
            Shot(cam, Path.Combine(shots, "B_X_night_street.png"), 60f, 26f, new Vector3(90f, 0, 0));    // QUANT 引道街灯近景
            if (rootGo != null) CityAssembler.RestoreDayWindows(rootGo.transform);    // v6 回归日材质
            if (nfx != null) nfx.gameObject.SetActive(false);                   // v7 光池层归关
            if (fl2 != null) { fl2.intensity = fillDayInt; fl2.color = fillDayCol; }
            light.transform.rotation = dayRot; light.intensity = dayInt; light.color = dayCol; light.shadowStrength = dayShad;
            cam.backgroundColor = dayBg; cam.clearFlags = dayClear; RenderSettings.fog = dayFog; RenderSettings.fogDensity = dayFogD; RenderSettings.fogColor = dayFogCol;
        }
        Shot(cam, Path.Combine(shots, "B_X_props.png"), 62f, 10f, new Vector3(20f, 0f, -15f)); // 街景道具近景
        // v4 行人位移证明（活性判据律：两帧同机位·2.5s 推进·位移可辨=居民在动）
        var walkers = UnityEngine.Object.FindObjectsOfType<ResidentWalker>();
        Shot(cam, Path.Combine(shots, "B_X_walkers_t0.png"), 55f, 60f, new Vector3(0f, 0f, 0f));
        foreach (var wk in walkers) wk.Advance(2.5f);
        Shot(cam, Path.Combine(shots, "B_X_walkers_t2.png"), 55f, 60f, new Vector3(0f, 0f, 0f));
        if (cyc != null) cyc.enabled = true;   // v6 捕获毕重开（GUI 实检=北京钟实时城光）
        UnityEngine.Debug.Log("BRIDGE: shots3 captured");
    }

    static void Shot(Camera cam, string file, float pitchDeg, float height, Vector3 target)
    {
        float d = height / Mathf.Tan(pitchDeg * Mathf.Deg2Rad);
        cam.transform.position = target + new Vector3(0, height, -d);
        cam.transform.LookAt(target);
        const int w = 1920, h = 1080;
        var rt = new RenderTexture(w, h, 24);
        cam.targetTexture = rt;
        cam.Render();
        RenderTexture.active = rt;
        var t = new Texture2D(w, h, TextureFormat.RGB24, false);
        t.ReadPixels(new Rect(0, 0, w, h), 0, 0); t.Apply();
        File.WriteAllBytes(file, t.EncodeToPNG());
        cam.targetTexture = null; RenderTexture.active = null;
        rt.Release(); UnityEngine.Object.DestroyImmediate(rt); UnityEngine.Object.DestroyImmediate(t);
    }
}
