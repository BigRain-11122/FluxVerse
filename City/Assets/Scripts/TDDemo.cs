using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Tilemaps;

// TD greybox demo - runtime movement layer (CEO direct order 2026-09-28).
// Walkers: BFS paths over road cells, deterministic seeded target picking.
// Player: WASD/arrow free walk, camera follows with map-bounds clamp.

public static class TDWalkLib
{
    public const int MapSize = 64;

    public static HashSet<Vector3Int> CollectWalkable(Tilemap roads)
    {
        var set = new HashSet<Vector3Int>();
        if (roads == null) return set;
        var b = roads.cellBounds;
        int cells = 0;
        foreach (var c in b.allPositionsWithin)
        {
            cells++;
            if (cells > 50000) break; // r126-style guard
            if (roads.GetTile(c) != null) set.Add(c);
        }
        return set;
    }

    // tileless mode (anime repaint build): the standard 64x64 road grid as data
    public static HashSet<Vector3Int> RoadCells()
    {
        var set = new HashSet<Vector3Int>();
        for (int x = 0; x < 64; x++)
        {
            set.Add(new Vector3Int(x, 14, 0));
            set.Add(new Vector3Int(x, 15, 0));
            set.Add(new Vector3Int(x, 46, 0));
            set.Add(new Vector3Int(x, 47, 0));
        }
        for (int y = 0; y < 64; y++)
        {
            set.Add(new Vector3Int(12, y, 0));
            set.Add(new Vector3Int(13, y, 0));
            set.Add(new Vector3Int(54, y, 0));
            set.Add(new Vector3Int(55, y, 0));
        }
        return set;
    }

    public static List<Vector3Int> Path(HashSet<Vector3Int> walkable, Vector3Int from, Vector3Int to)
    {
        var result = new List<Vector3Int>();
        if (walkable == null || walkable.Count == 0) return result;
        if (!walkable.Contains(from) || !walkable.Contains(to)) return result;
        var prev = new Dictionary<Vector3Int, Vector3Int>();
        var q = new Queue<Vector3Int>();
        q.Enqueue(from);
        prev[from] = from;
        int[] dx = { 1, -1, 0, 0 };
        int[] dy = { 0, 0, 1, -1 };
        while (q.Count > 0)
        {
            var cur = q.Dequeue();
            if (cur == to) break;
            for (int i = 0; i < 4; i++)
            {
                var n = new Vector3Int(cur.x + dx[i], cur.y + dy[i], 0);
                if (walkable.Contains(n) && !prev.ContainsKey(n))
                {
                    prev[n] = cur;
                    q.Enqueue(n);
                }
            }
        }
        if (!prev.ContainsKey(to)) return result;
        var node = to;
        while (node != from)
        {
            result.Add(node);
            node = prev[node];
        }
        result.Add(from);
        result.Reverse();
        return result;
    }

    public static Vector3 CellCenter(Vector3Int c)
    {
        return new Vector3(c.x + 0.5f, c.y + 0.5f, 0f);
    }

    public static Vector3 PosAt(List<Vector3Int> path, float t)
    {
        if (path == null || path.Count == 0) return Vector3.zero;
        if (path.Count == 1) return CellCenter(path[0]);
        float total = path.Count - 1;
        float f = Mathf.Repeat(t, total);
        int i = Mathf.FloorToInt(f);
        float k = f - i;
        return Vector3.Lerp(CellCenter(path[i]), CellCenter(path[i + 1]), k);
    }
}

public class TDBootstrap : MonoBehaviour
{
    void Awake()
    {
        var roadsGo = GameObject.Find("TD_Roads");
        Tilemap roads = roadsGo != null ? roadsGo.GetComponent<Tilemap>() : null;
        var walkable = roads != null ? TDWalkLib.CollectWalkable(roads) : TDWalkLib.RoadCells();
        foreach (var w in Object.FindObjectsOfType<TDWalker>()) w.Init(walkable);
    }
}

public class TDWalker : MonoBehaviour
{
    public Vector3Int startCell;
    public int seed = 1;
    public float speed = 2.0f;

    HashSet<Vector3Int> _walkable;
    List<Vector3Int> _path;
    float _t;
    System.Random _rng;

    public void Init(HashSet<Vector3Int> walkable)
    {
        _walkable = walkable;
        _rng = new System.Random(seed);
        transform.position = TDWalkLib.CellCenter(startCell);
        NewPath();
    }

    void NewPath()
    {
        if (_walkable == null || _walkable.Count == 0) { _path = null; return; }
        var arr = new List<Vector3Int>(_walkable);
        Vector3Int to;
        int guard = 0;
        do { to = arr[_rng.Next(arr.Count)]; guard++; } while (to == CurrentCell() && guard < 20);
        _path = TDWalkLib.Path(_walkable, CurrentCell(), to);
        _t = 0f;
        if (_path == null || _path.Count < 2) _path = null;
    }

    Vector3Int CurrentCell()
    {
        var p = transform.position;
        return new Vector3Int(Mathf.FloorToInt(p.x), Mathf.FloorToInt(p.y), 0);
    }

    void Update()
    {
        if (_path == null || _path.Count < 2) { if (_walkable != null) NewPath(); return; }
        _t += Time.deltaTime * speed;
        transform.position = TDWalkLib.PosAt(_path, _t);
        if (_t >= _path.Count - 1) NewPath();
    }
}

public class TDPlayer : MonoBehaviour
{
    public float speed = 4.0f;

    void Update()
    {
        float dx = Input.GetAxisRaw("Horizontal");
        float dy = Input.GetAxisRaw("Vertical");
        var p = transform.position + new Vector3(dx, dy, 0f) * speed * Time.deltaTime;
        p.x = Mathf.Clamp(p.x, 1f, TDWalkLib.MapSize - 1f);
        p.y = Mathf.Clamp(p.y, 1f, TDWalkLib.MapSize - 1f);
        transform.position = p;
        var cam = Camera.main;
        if (cam != null && cam.orthographic)
        {
            float cs = cam.orthographicSize;
            float cx = Mathf.Clamp(p.x, cs * cam.aspect, TDWalkLib.MapSize - cs * cam.aspect);
            float cy = Mathf.Clamp(p.y, cs, TDWalkLib.MapSize - cs);
            cam.transform.position = new Vector3(cx, cy, -10f);
        }
    }
}
