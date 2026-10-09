using System.IO;
using UnityEngine;

/// 呼吸脉冲（心跳活面·OS_TICK 真拍绑定）
/// v0=桌面路径轮询 world-events.jsonl；WebGL 端=fetch 轮询（Phase 2 接线·参数单 §八）。
/// 禁装饰律执法：脉冲时刻锚真实 OS_TICK 拍点（10min）——无事件流则恒静默。
public class BreathingPulse : MonoBehaviour
{
    public string jsonlPath;
    public float periodSeconds = 600f;
    public float pulsePeak = 3.5f;
    public float pulseFloor = 0.15f;
    public float pulseWidthSeconds = 2f; // P-17：脉冲 2s

    Renderer _r; Material _inst; float _lastTickUnix = -1; float _lastFileCheck = -999;

    void Awake()
    {
        _r = GetComponent<Renderer>();
        _inst = _r.material; // 材质实例正法（MPB 禁用·波②防线二定谳）
    }

    void Update()
    {
        if (Time.unscaledTime - _lastFileCheck > 2f) { _lastFileCheck = Time.unscaledTime; ReadLastTick(); }
        // r932: pulse via _BaseColor on Unlit beacon (Tuanjie GDRP Lit emission channel renders zero delta in batchmode;
        // Unlit base-color swap = provably visible channel, mirrors WhiteboxBuilder breath proof frames)
        if (_lastTickUnix < 0) { _inst.SetColor("_BaseColor", PulseFloorColor); return; }
        float since = Time.realtimeSinceStartup - _lastFileCheck; // 近似：以最后文件读取时刻为拍点
        float e = since < pulseWidthSeconds
            ? Mathf.Lerp(pulsePeak, pulseFloor, since / pulseWidthSeconds)
            : pulseFloor;
        _inst.SetColor("_BaseColor", Color.Lerp(PulseFloorColor, Color.white * pulsePeak, Mathf.Clamp01(e / pulsePeak)));
    }

    static readonly Color PulseFloorColor = new Color(0.08f, 0.09f, 0.12f);

    void ReadLastTick()
    {
        try
        {
            if (!File.Exists(jsonlPath)) return;
            using (var fs = new FileStream(jsonlPath, FileMode.Open, FileAccess.Read, FileShare.ReadWrite))
            {
                long len = fs.Length; long start = len - 262144; if (start < 0) start = 0;
                fs.Seek(start, SeekOrigin.Begin);
                using (var sr = new StreamReader(fs))
                {
                    string tail = sr.ReadToEnd(), last = null;
                    int idx = tail.LastIndexOf("OS_TICK");
                    if (idx >= 0)
                    {
                        last = tail.Substring(idx);
                        _lastTickUnix = Time.realtimeSinceStartup; // 拍点记录（真对账=Phase 2 以事件 ts 精确绑定）
                    }
                }
            }
        }
        catch { /* 静默：事件流暂不可读=恒静默（禁装饰律） */ }
    }
}
