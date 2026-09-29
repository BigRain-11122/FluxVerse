using System;
using UnityEngine;
using UnityEngine.Rendering;

// 日夜色轮三件套（灯光专家技能 v3·CEO 令 并行施工 09-29）
// ①主定向光按真实北京时间旋转+强度/色温曲线驱动 ②环境光 Flat 直写曲线 ③相机背景天色随动
// [ExecuteAlways]=编辑态即效（场景光=当前北京时间实况）·运行态同源（System.DateTime 本机即北京时间）
[ExecuteAlways]
public class DayNightCycle : MonoBehaviour
{
    [Tooltip("主定向光（空=自动找场景 Directional）")]
    public Light sun;
    [Tooltip("方位角固定（度）——影子方向稳定 NW-SE 与既有判据帧一致")]
    public float azimuth = -30f;

    // 关键帧（钟点, 仰角度, 强度, 光色）——北京昼夜参考·Inspector 可调
    // 夜 0/24h -30° | 晨 5h -10° | 日出 7h +10° 暖 | 正午 12h 62° 白 | 黄昏 17h 20° 暖金 | 暮 19h -5° 暖紫 | 夜 21h -25°
    static readonly float[] KHour  = { 0f, 5f, 7f, 12f, 17f, 19f, 21f, 24f };
    static readonly float[] KElev  = { -30f, -10f, 10f, 62f, 20f, -5f, -25f, -30f };
    static readonly float[] KInt   = { 0.00f, 0.05f, 0.60f, 1.15f, 0.80f, 0.25f, 0.05f, 0.00f };
    static readonly Color[] KColor =
    {
        new Color(0.10f, 0.15f, 0.30f), new Color(0.30f, 0.25f, 0.40f), new Color(1.00f, 0.70f, 0.50f),
        new Color(1f, 1f, 1f),          new Color(1.00f, 0.75f, 0.55f), new Color(0.50f, 0.35f, 0.50f),
        new Color(0.15f, 0.20f, 0.40f), new Color(0.10f, 0.15f, 0.30f)
    };
    static readonly Color NightSky = new Color32(0x12, 0x1A, 0x30, 255);
    static readonly Color DaySky   = new Color32(0x8F, 0xCD, 0xE8, 255);

    void Update()
    {
        if (sun == null) sun = FindObjectOfType<Light>();
        if (sun == null) return;
        var now = DateTime.Now; // bm-a=Asia/Shanghai 北京时间
        float h = now.Hour + now.Minute / 60f;
        int i = 0;
        while (i < KHour.Length - 2 && h >= KHour[i + 1]) i++;
        float t = Mathf.Clamp01((h - KHour[i]) / Mathf.Max(0.01f, KHour[i + 1] - KHour[i]));
        float elev = Mathf.Lerp(KElev[i], KElev[i + 1], t);
        float inten = Mathf.Lerp(KInt[i], KInt[i + 1], t);
        var col = Color.Lerp(KColor[i], KColor[i + 1], t);

        sun.transform.rotation = Quaternion.Euler(elev, azimuth, 0f);
        sun.intensity = inten;
        sun.color = col;
        sun.shadows = LightShadows.Soft;

        // ②环境光 Flat 直写（夜不至于全黑·昼不过曝）
        RenderSettings.ambientMode = AmbientMode.Flat;
        RenderSettings.ambientLight = col * Mathf.Lerp(0.10f, 0.42f, Mathf.Clamp01(inten / 1.15f));

        // ③相机背景天色随动（昼蓝天↔夜深蓝）
        var cam = Camera.main;
        if (cam != null && cam.clearFlags == CameraClearFlags.SolidColor)
            cam.backgroundColor = Color.Lerp(NightSky, DaySky, Mathf.Clamp01(inten / 1.15f));
    }
}
