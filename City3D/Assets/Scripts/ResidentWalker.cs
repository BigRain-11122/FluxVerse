using System.Collections.Generic;
using UnityEngine;

// L1 行人（城市活性 Phase 1·CEO 令「重点研究怎么让硅基城市真正的活起来」）
// 群体律 A 级原语=无骨骼假动画（SMR 群体判负·L1 首选）；路径=waypoint 队列插值（NavMesh 判负·数据投影⇏寻路）
// 真数据投影：路线分布=world-state.json 分区活动值（城分区活动→各区行人密度·禁装饰性动画律）
// 编辑态 Advance 可手动推进（判据帧位移证明）；运行态 Update 自驱
public class ResidentWalker : MonoBehaviour
{
    public List<Vector3> route = new List<Vector3>(); // 世界坐标 waypoint 队列（首尾闭合=环形通勤）
    public float speed = 1.2f;                       // m/s 步速
    public string traceId;                           // 真数据溯源标记（zone:activity→walker 编号）

    int _idx;
    float _t;
    Vector3 _last, _next;

    public void BuildRoute(List<Vector3> r)
    {
        route = r;
        if (route == null || route.Count == 0) return;
        _idx = 0; _t = 0f;
        _last = route[0];
        _next = route.Count > 1 ? route[1] : route[0];
        transform.position = _last;
    }

    public void Advance(float dt)
    {
        if (route == null || route.Count < 2) return;
        float seg = Vector3.Distance(_last, _next);
        _t += dt * speed / Mathf.Max(0.01f, seg);
        while (_t >= 1f)
        {
            _t -= 1f;
            _idx++;
            if (_idx >= route.Count - 1) _idx = 0; // 环形循环
            _last = route[_idx];
            _next = route[_idx + 1];
        }
        Vector3 pos = Vector3.Lerp(_last, _next, _t);
        Vector3 dir = _next - _last;
        if (dir.sqrMagnitude > 0.001f) transform.rotation = Quaternion.LookRotation(dir);
        transform.position = pos;
    }

    void Update() => Advance(Time.deltaTime);
}
