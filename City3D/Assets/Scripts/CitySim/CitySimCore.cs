using System;
using System.Collections.Generic;
using UnityEngine;

namespace CitySim
{
    public enum ParcelFunc { RES, OFF, SHOP, CLUB, PUB }

    /// <summary>
    /// 市政仿真核心 v0.1（A 档物理投影层·纯 C#·无 DOTS·无渲染依赖）。
    /// 定谳=功能城市定谳文档 v1.0（CEO 令 2026-09-30 授权 T1 代决）：
    ///  - 数据实体常驻、Mesh 只是可视化载体（CEO 坑1：数据与 Mesh 解耦）；
    ///  - 自建车道图寻路，不用 NavMesh（CEO 坑2：NavMesh 无车道/单向/信号）；
    ///  - 居民生活事实=BigLife 唯一源，本层只做物理求解（通勤行程的车道图解算+拥堵/覆盖统计）。
    /// 参考：Cities: Skylines 自建路网图寻路；GlassBox（建筑=规则·路径运 agent）；CityFlow 蓝图 JSON 思想。
    /// </summary>
    public class CitySimCore
    {
        public enum AgentState { Waiting, Walking, Arrived, Stuck }

        public class SimParcel
        {
            public int id;
            public ParcelFunc func;
            public string district;
            public float cx, cy;      // 格坐标（质心）
            public int cells;
            public int capacity;      // RES=就业人口；其他=岗位数
            public int gateNode = -1; // 最近路格节点
            public bool covered;      // RES 的公共服务覆盖
        }

        public class CommuterAgent
        {
            public int id;
            public int homeParcel, workParcel;
            public float departMin;
            public AgentState state;
            public List<int> path;    // 节点序列
            public int seg;           // 当前所在段：驻于 path[seg]
            public float frac;        // 段内进度 0-1
        }

        public SimBlueprint bp;
        public List<SimParcel> parcels = new List<SimParcel>();
        public List<CommuterAgent> agents = new List<CommuterAgent>();

        // 车道图：节点=路格；邻接=4 邻；cost/容量按件型分级（TRUNK>SEC>ALLEY）
        public int grid;
        public int roadCount;
        public int[] roadX, roadY, roadTier;
        public int[] nodeOfCell;      // cellY*grid+cellX -> node index or -1
        public int[] nodeCellX, nodeCellY, nodeTier;
        public List<int>[] nbr;
        public float[] enterCost;     // 进入该节点的基准代价（tier 越低越快）
        public float[] capacity;      // 节点容量（同格并发 agent 数）
        public int[] occupancy;
        public bool[] closed;

        public float clockMin;        // 仿真钟（当日分钟）
        public int departed, arrived, inTransit, stuck;
        public int seed;
        System.Random rng;

        public const float TIER_COST_0 = 1.0f, TIER_COST_1 = 1.35f, TIER_COST_2 = 1.7f;
        public const float CAP_0 = 4f, CAP_1 = 2.5f, CAP_2 = 2f; // 容量=同格并发 agent 数（白盒演示级定标·瓶颈可见化）
        public const float BASE_SPEED = 6f;      // 格/仿真分钟
        public const float CONGEST_SLOW = 2.0f;  // 拥堵减速系数
        public const float COVERAGE_RADIUS_M = 120f; // 公共服务半径

        public CitySimCore(SimBlueprint blueprint, int simSeed)
        {
            bp = blueprint;
            seed = simSeed;
            rng = new System.Random(simSeed);
            BuildGraph();
            BuildParcels();
        }

        // ---------------- 构建 ----------------

        void BuildGraph()
        {
            grid = bp.grid;
            roadCount = bp.RoadCount;
            roadX = bp.roadX.ToArray(); roadY = bp.roadY.ToArray(); roadTier = bp.roadTier.ToArray();
            nodeOfCell = new int[grid * grid];
            for (int i = 0; i < nodeOfCell.Length; i++) nodeOfCell[i] = -1;
            nodeCellX = new int[roadCount]; nodeCellY = new int[roadCount]; nodeTier = new int[roadCount];
            enterCost = new float[roadCount]; capacity = new float[roadCount];
            occupancy = new int[roadCount]; closed = new bool[roadCount];
            nbr = new List<int>[roadCount];
            for (int n = 0; n < roadCount; n++)
            {
                int cx = roadX[n], cy = roadY[n], t = roadTier[n];
                nodeOfCell[cy * grid + cx] = n;
                nodeCellX[n] = cx; nodeCellY[n] = cy; nodeTier[n] = t;
                enterCost[n] = t == 0 ? TIER_COST_0 : (t == 1 ? TIER_COST_1 : TIER_COST_2);
                capacity[n] = t == 0 ? CAP_0 : (t == 1 ? CAP_1 : CAP_2);
                nbr[n] = new List<int>(4);
            }
            for (int n = 0; n < roadCount; n++)
            {
                int cx = nodeCellX[n], cy = nodeCellY[n];
                TryLink(n, cx, cy + 1); TryLink(n, cx + 1, cy); TryLink(n, cx, cy - 1); TryLink(n, cx - 1, cy);
            }
        }

        void TryLink(int n, int cx, int cy)
        {
            if (cx < 0 || cy < 0 || cx >= grid || cy >= grid) return;
            int m = nodeOfCell[cy * grid + cx];
            if (m >= 0) nbr[n].Add(m);
        }

        void BuildParcels()
        {
            for (int i = 0; i < bp.BlockCount; i++)
            {
                var p = new SimParcel();
                p.id = bp.blockId[i];
                p.district = bp.blockDistrict[i];
                p.func = ParseFunc(bp.blockFunc[i]);
                p.cx = bp.blockCx[i]; p.cy = bp.blockCy[i];
                p.cells = bp.BlockCellCount(i);
                // A 档容量公式（白盒演示级定标）：住=2 就业人口/格；岗=办 0.4/格·商 0.25/格·夜 0.2/格；公=服务设施
                p.capacity = p.func == ParcelFunc.RES ? Mathf.RoundToInt(p.cells * 2f)
                    : p.func == ParcelFunc.OFF ? Mathf.RoundToInt(p.cells * 0.4f)
                    : p.func == ParcelFunc.SHOP ? Mathf.RoundToInt(p.cells * 0.25f)
                    : p.func == ParcelFunc.CLUB ? Mathf.RoundToInt(p.cells * 0.2f) : 0;
                p.gateNode = NearestRoadNode((int)p.cx, (int)p.cy, 8);
                parcels.Add(p);
            }
            // 公共服务覆盖（PUB 半径圆 -> RES 覆盖）
            foreach (var r in parcels)
            {
                if (r.func != ParcelFunc.RES) continue;
                foreach (var s in parcels)
                {
                    if (s.func != ParcelFunc.PUB) continue;
                    float dx = (r.cx - s.cx) * bp.cellM, dy = (r.cy - s.cy) * bp.cellM;
                    if (dx * dx + dy * dy <= COVERAGE_RADIUS_M * COVERAGE_RADIUS_M) { r.covered = true; break; }
                }
            }
        }

        public static ParcelFunc ParseFunc(string s)
        {
            switch (s)
            {
                case "RES": return ParcelFunc.RES;
                case "OFF": return ParcelFunc.OFF;
                case "SHOP": return ParcelFunc.SHOP;
                case "CLUB": return ParcelFunc.CLUB;
                default: return ParcelFunc.PUB;
            }
        }

        int NearestRoadNode(int cx, int cy, int maxRing)
        {
            for (int r = 0; r <= maxRing; r++)
            {
                for (int dy = -r; dy <= r; dy++)
                {
                    for (int intdx = -r; intdx <= r; intdx++)
                    {
                        if (Mathf.Max(Mathf.Abs(intdx), Mathf.Abs(dy)) != r) continue;
                        int x = cx + intdx, y = cy + dy;
                        if (x < 0 || y < 0 || x >= grid || y >= grid) continue;
                        int n = nodeOfCell[y * grid + x];
                        if (n >= 0) return n;
                    }
                }
            }
            return -1;
        }

        // ---------------- 寻路（A*·拥堵感知） ----------------

        public List<int> FindPath(int startNode, int goalNode)
        {
            if (startNode < 0 || goalNode < 0 || closed[startNode] || closed[goalNode]) return null;
            var g = new float[roadCount]; var came = new int[roadCount]; var open = new bool[roadCount];
            for (int i = 0; i < roadCount; i++) { g[i] = float.MaxValue; came[i] = -1; open[i] = false; }
            int gx = nodeCellX[goalNode], gy = nodeCellY[goalNode];
            g[startNode] = 0f; open[startNode] = true;
            while (true)
            {
                int best = -1; float bestF = float.MaxValue;
                for (int n = 0; n < roadCount; n++)
                {
                    if (!open[n]) continue;
                    int dx = Mathf.Abs(nodeCellX[n] - gx), dy = Mathf.Abs(nodeCellY[n] - gy);
                    float f = g[n] + (dx + dy) * TIER_COST_0;
                    if (f < bestF) { bestF = f; best = n; }
                }
                if (best < 0) break;
                if (best == goalNode) return Reconstruct(came, goalNode);
                open[best] = false;
                foreach (int m in nbr[best])
                {
                    if (closed[m]) continue;
                    float cong = capacity[m] > 0 ? Mathf.Min(occupancy[m] / capacity[m], 2f) : 0f;
                    float cost = enterCost[m] * (1f + 1.5f * cong);
                    if (g[best] + cost < g[m])
                    {
                        g[m] = g[best] + cost; came[m] = best; open[m] = true;
                    }
                }
            }
            return null;
        }

        List<int> Reconstruct(int[] came, int goal)
        {
            var path = new List<int>();
            int n = goal;
            while (n >= 0) { path.Add(n); n = came[n]; }
            path.Reverse();
            return path;
        }

        // ---------------- 通勤波（需求源=地块配额；BigLife 行为数据接口位=v0.2 预留） ----------------

        /// 生成早高峰通勤波：每个 RES 地块的就业人口 -> 按引力（岗位/距离）加权选工作地块。
        public void SpawnMorningWave()
        {
            rng = new System.Random(seed);
            agents.Clear();
            var workParcels = parcels.FindAll(p => p.func == ParcelFunc.OFF || p.func == ParcelFunc.SHOP || p.func == ParcelFunc.CLUB);
            if (workParcels.Count == 0) return;
            int id = 0;
            foreach (var home in parcels)
            {
                if (home.func != ParcelFunc.RES) continue;
                int workers = home.capacity;
                for (int w = 0; w < workers; w++)
                {
                    var a = new CommuterAgent();
                    a.id = id++;
                    a.homeParcel = home.id; a.workParcel = PickWork(home, workParcels);
                    a.departMin = 420f + (float)rng.NextDouble() * 90f; // 07:00-08:30 出发
                    a.state = AgentState.Waiting;
                    agents.Add(a);
                }
            }
            departed = 0; arrived = 0; inTransit = 0; stuck = 0; clockMin = 0f;
        }

        int PickWork(SimParcel home, List<SimParcel> workParcels)
        {
            float total = 0f;
            var wgt = new float[workParcels.Count];
            for (int i = 0; i < workParcels.Count; i++)
            {
                var wp = workParcels[i];
                float d = Mathf.Max(1f, Mathf.Abs(wp.cx - home.cx) + Mathf.Abs(wp.cy - home.cy));
                wgt[i] = wp.capacity / d;
                total += wgt[i];
            }
            float r = (float)rng.NextDouble() * total;
            for (int i = 0; i < workParcels.Count; i++)
            {
                r -= wgt[i];
                if (r <= 0f) return workParcels[i].id;
            }
            return workParcels[workParcels.Count - 1].id;
        }

        public SimParcel ParcelById(int id) { return parcels.Find(p => p.id == id); }

        // ---------------- 仿真步进 ----------------

        public void Step(float dtMin)
        {
            clockMin += dtMin;
            for (int i = 0; i < agents.Count; i++)
            {
                var a = agents[i];
                if (a.state == AgentState.Arrived || a.state == AgentState.Stuck) continue;
                if (a.state == AgentState.Waiting)
                {
                    if (clockMin >= a.departMin) StartWalk(a);
                    continue;
                }
                MoveAgent(a, dtMin);
            }
            inTransit = 0; stuck = 0;
            for (int i = 0; i < agents.Count; i++)
            {
                if (agents[i].state == AgentState.Walking) inTransit++;
                else if (agents[i].state == AgentState.Stuck) stuck++;
            }
        }

        void StartWalk(CommuterAgent a)
        {
            var home = ParcelById(a.homeParcel); var work = ParcelById(a.workParcel);
            if (home == null || work == null || home.gateNode < 0 || work.gateNode < 0) return;
            var path = FindPath(home.gateNode, work.gateNode);
            if (path == null || path.Count < 2) return; // 无路=不出行（统计口径如实）
            a.path = path; a.seg = 0; a.frac = 0f; a.state = AgentState.Walking;
            occupancy[path[0]]++; departed++;
        }

        void MoveAgent(CommuterAgent a, float dtMin)
        {
            int node = a.path[a.seg];
            float cong = capacity[node] > 0 ? Mathf.Min(occupancy[node] / capacity[node], 2f) : 0f;
            float speed = BASE_SPEED / (1f + CONGEST_SLOW * cong);
            a.frac += speed * dtMin;
            while (a.frac >= 1f)
            {
                int nxtIdx = a.seg + 1;
                if (nxtIdx >= a.path.Count) { Finish(a); return; }
                int nxt = a.path[nxtIdx];
                if (closed[nxt]) // 前方封闭 -> 从当前节点重路由（CEO 层4 反馈环的最小闭环）
                {
                    var work = ParcelById(a.workParcel);
                    var rep = work != null ? FindPath(a.path[a.seg], work.gateNode) : null;
                    if (rep != null && rep.Count >= 2)
                    {
                        a.path = rep; a.seg = 0; a.frac = 1f - 0.0001f; // 驻点不变·占用账不破
                    }
                    else
                    {
                        a.state = AgentState.Stuck; // 无替代路=滞留（反馈环指标面）
                        a.frac = 1f - 0.0001f;
                    }
                    return;
                }
                occupancy[a.path[a.seg]]--; // 离开当前
                a.seg = nxtIdx; a.frac -= 1f;
                occupancy[nxt]++;            // 进入下一
                if (a.seg >= a.path.Count - 1) { Finish(a); return; }
            }
        }

        void Finish(CommuterAgent a)
        {
            // 抵达=离开路网：释放末节点占用
            occupancy[a.path[a.seg]]--;
            a.state = AgentState.Arrived; arrived++;
            a.frac = 0f;
        }

        public void FastForward(float targetMin, float stepMin = 0.5f)
        {
            while (clockMin < targetMin) Step(stepMin);
        }

        public void SetClosed(int cellX, int cellY, bool value)
        {
            int n = nodeOfCell[cellY * grid + cellX];
            if (n >= 0) closed[n] = value;
        }

        public void CloseBridgeClusterNear(int cellX, int cellY, int radius)
        {
            for (int dy = -radius; dy <= radius; dy++)
                for (int dx = -radius; dx <= radius; dx++)
                {
                    int x = cellX + dx, y = cellY + dy;
                    if (x < 0 || y < 0 || x >= grid || y >= grid) continue;
                    SetClosed(x, y, true);
                }
        }

        // ---------------- 统计 ----------------

        public float Congestion(int node)
        {
            return capacity[node] > 0 ? Mathf.Min(occupancy[node] / capacity[node], 2f) : 0f;
        }

        public List<int> TopCongested(int topN)
        {
            var idx = new List<int>();
            for (int n = 0; n < roadCount; n++) idx.Add(n);
            idx.Sort((x, y) => Congestion(y).CompareTo(Congestion(x)));
            if (idx.Count > topN) idx.RemoveRange(topN, idx.Count - topN);
            return idx;
        }

        public int CoveredResCount()
        {
            int c = 0;
            foreach (var p in parcels) if (p.func == ParcelFunc.RES && p.covered) c++;
            return c;
        }

        public int ResParcelCount()
        {
            int c = 0;
            foreach (var p in parcels) if (p.func == ParcelFunc.RES) c++;
            return c;
        }

        public int ResBlockResidentTotal()
        {
            int c = 0;
            foreach (var p in parcels) if (p.func == ParcelFunc.RES) c += p.capacity;
            return c;
        }

        public void Reset()
        {
            Array.Clear(occupancy, 0, occupancy.Length);
            Array.Clear(closed, 0, closed.Length);
            clockMin = 0f; departed = 0; arrived = 0; inTransit = 0; stuck = 0;
            SpawnMorningWave();
        }
    }
}
