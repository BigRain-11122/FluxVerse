using System;
using System.Collections.Generic;
using System.IO;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine;
using UnityEngine.SceneManagement;
using UnityEngine.Tilemaps;

// CEO direct order 2026-09-28: quick top-down greybox demo slice (64x64) -
// morandi low-sat palette, roads / river / blocks, 8 BFS walkers, 3 screenshots.
// Deterministic layout, fail-loud asserts, .done sentinel in logs/.

public static class TDDemoBuild
{
    const int N = 64;
    const int TilePx = 16;
    const int Ppu = 16;
    static readonly string ArtPath = "Assets/Art/TDDemo";
    static readonly string ScenePath = "Assets/Scenes/TopDownDemo.unity";

    static string Abs(params string[] rel)
    {
        var root = Path.GetFullPath(Path.Combine(Application.dataPath, ".."));
        return Path.GetFullPath(Path.Combine(root, Path.Combine(rel)));
    }

    // repo root = City/../.. (docs/design, logs)
    static string RepoAbs(params string[] rel)
    {
        var root = Path.GetFullPath(Path.Combine(Application.dataPath, "..", ".."));
        return Path.GetFullPath(Path.Combine(root, Path.Combine(rel)));
    }

    static Color32 Hex(string h)
    {
        float r = Convert.ToInt32(h.Substring(0, 2), 16);
        float g = Convert.ToInt32(h.Substring(2, 2), 16);
        float b = Convert.ToInt32(h.Substring(4, 2), 16);
        return new Color32((byte)r, (byte)g, (byte)b, 255);
    }

    static Color32 Darken(Color32 c, float k)
    {
        return new Color32((byte)(c.r * k), (byte)(c.g * k), (byte)(c.b * k), 255);
    }

    // ---- deterministic 16x16 PNG art -------------------------------------------------

    static string MakePng(string name, Color32 baseC, bool ring)
    {
        if (!Directory.Exists(ArtPath)) AssetDatabase.CreateFolder("Assets/Art", "TDDemo");
        var tex = new Texture2D(TilePx, TilePx, TextureFormat.RGBA32, false);
        var edge = Darken(baseC, 0.72f);
        for (int y = 0; y < TilePx; y++)
        {
            for (int x = 0; x < TilePx; x++)
            {
                bool isEdge = ring && (x < 1 || y < 1 || x >= TilePx - 1 || y >= TilePx - 1);
                tex.SetPixel(x, y, isEdge ? edge : baseC);
            }
        }
        tex.Apply();
        var file = ArtPath + "/" + name + ".png";
        File.WriteAllBytes(Abs("Assets", "Art", "TDDemo", name + ".png"), ImageConversion.EncodeToPNG(tex));
        UnityEngine.Object.DestroyImmediate(tex);
        AssetDatabase.ImportAsset(file);
        var imp = AssetImporter.GetAtPath(file) as TextureImporter;
        if (imp == null) throw new Exception("importer missing: " + file);
        imp.textureType = TextureImporterType.Sprite;
        imp.spriteImportMode = SpriteImportMode.Single;
        imp.spritePixelsPerUnit = Ppu;
        imp.filterMode = FilterMode.Point;
        imp.mipmapEnabled = false;
        imp.textureCompression = TextureImporterCompression.Uncompressed;
        imp.SaveAndReimport();
        // r37-style readback assert
        var t2 = AssetDatabase.LoadAssetAtPath<Texture2D>(file);
        var sp = AssetDatabase.LoadAssetAtPath<Sprite>(file);
        if (t2 == null || sp == null) throw new Exception("readback fail sprite/tex: " + file);
        if (imp.spritePixelsPerUnit != Ppu || imp.filterMode != FilterMode.Point) throw new Exception("readback fail ppu/filter: " + file);
        return file;
    }

    static Tile MakeTile(string name, Sprite sprite, Dictionary<string, Tile> cache)
    {
        var file = ArtPath + "/" + name + ".asset";
        var t = AssetDatabase.LoadAssetAtPath<Tile>(file);
        if (t == null)
        {
            t = ScriptableObject.CreateInstance<Tile>();
            AssetDatabase.CreateAsset(t, file);
        }
        t.sprite = sprite;
        t.colliderType = Tile.ColliderType.None;
        EditorUtility.SetDirty(t);
        cache[name] = t;
        return t;
    }

    static Tilemap MakeTm(string goName, int order, Transform parent)
    {
        var go = new GameObject(goName);
        go.transform.SetParent(parent, false);
        var tm = go.AddComponent<Tilemap>();
        var tr = go.AddComponent<TilemapRenderer>();
        tr.sortingOrder = order;
        return tm;
    }

    static int FillRect(Tilemap tm, int x0, int y0, int x1, int y1, Tile t)
    {
        int n = 0;
        for (int y = y0; y <= y1; y++)
            for (int x = x0; x <= x1; x++) { tm.SetTile(new Vector3Int(x, y, 0), t); n++; }
        return n;
    }

    static void Shot(Camera cam, int w, int h, string file)
    {
        var rt = new RenderTexture(w, h, 24);
        cam.targetTexture = rt;
        RenderTexture.active = rt;
        cam.Render();
        var tex = new Texture2D(w, h, TextureFormat.RGBA32, false);
        tex.ReadPixels(new Rect(0, 0, w, h), 0, 0);
        tex.Apply();
        File.WriteAllBytes(file, ImageConversion.EncodeToPNG(tex));
        cam.targetTexture = null;
        RenderTexture.active = null;
        rt.Release();
        UnityEngine.Object.DestroyImmediate(tex);
    }

    public static void Build()
    {
        var donePath = RepoAbs("logs", "td-demo-r0.done");
        var result = new Dictionary<string, string> { { "result", "PASS" } };
        try
        {
            // 1. palette + sprites (morandi low-saturation)
            var names = new Dictionary<string, Color32>
            {
                { "gA", Hex("8B9A7E") }, { "gB", Hex("86957A") },
                { "bank", Hex("C2B49A") }, { "waterEdge", Hex("7D97A5") }, { "waterDeep", Hex("6F8A9B") },
                { "road", Hex("B8B0A3") },
                { "block1", Hex("C7B9A5") }, { "block2", Hex("BFA8A0") }, { "block3", Hex("A9ABA6") }, { "roof", Hex("8F8778") },
                { "dot1", Hex("CDA094") }, { "dot2", Hex("A3B18A") }, { "dot3", Hex("B5A8C9") },
                { "dot4", Hex("B5A86B") }, { "dot5", Hex("8FA8A3") },
                { "player", Hex("B8A24A") },
            };
            var ringed = new HashSet<string> { "dot1", "dot2", "dot3", "dot4", "dot5", "player", "roof" };
            var sprites = new Dictionary<string, Sprite>();
            foreach (var kv in names)
            {
                MakePng(kv.Key, kv.Value, ringed.Contains(kv.Key));
                sprites[kv.Key] = AssetDatabase.LoadAssetAtPath<Sprite>(ArtPath + "/" + kv.Key + ".png");
                if (sprites[kv.Key] == null) throw new Exception("sprite null " + kv.Key);
            }

            // 2. tile assets
            var tiles = new Dictionary<string, Tile>();
            foreach (var k in new[] { "gA", "gB", "bank", "waterEdge", "waterDeep", "road", "block1", "block2", "block3", "roof" })
                MakeTile("tile-" + k, sprites[k], tiles);
            AssetDatabase.SaveAssets();

            // 3. scene
            var scene = EditorSceneManager.NewScene(NewSceneSetup.DefaultGameObjects, NewSceneMode.Single);
            var root = new GameObject("TDDEMO");
            root.AddComponent<TDBootstrap>();

            var gridGo = new GameObject("TD_Grid");
            var grid = gridGo.AddComponent<Grid>();
            gridGo.transform.SetParent(root.transform, false);
            if (grid.cellSize != new Vector3(1f, 1f, 1f)) throw new Exception("grid cellSize != 1");

            var tmGround = MakeTm("TD_Ground", 0, gridGo.transform);
            var tmWater = MakeTm("TD_Water", 1, gridGo.transform);
            var tmRoads = MakeTm("TD_Roads", 2, gridGo.transform);
            var tmBlocks = MakeTm("TD_Blocks", 3, gridGo.transform);

            int ground = 0, water = 0, roads = 0, blocks = 0;
            for (int y = 0; y < N; y++)
                for (int x = 0; x < N; x++)
                {
                    tmGround.SetTile(new Vector3Int(x, y, 0), ((x + y) % 9 == 0) ? tiles["tile-gB"] : tiles["tile-gA"]);
                    ground++;
                }
            // river: banks at x=39/46, water 40..45
            for (int y = 0; y < N; y++)
            {
                tmWater.SetTile(new Vector3Int(39, y, 0), tiles["tile-bank"]); water++;
                tmWater.SetTile(new Vector3Int(46, y, 0), tiles["tile-bank"]); water++;
                for (int x = 40; x <= 45; x++)
                {
                    tmWater.SetTile(new Vector3Int(x, y, 0), (x == 40 || x == 45) ? tiles["tile-waterEdge"] : tiles["tile-waterDeep"]);
                    water++;
                }
            }
            // roads: 2-wide, H at y14/15 and y46/47, V at x12/13 and x54/55 (cross river = bridges)
            for (int x = 0; x < N; x++)
            {
                tmRoads.SetTile(new Vector3Int(x, 14, 0), tiles["tile-road"]); roads++;
                tmRoads.SetTile(new Vector3Int(x, 15, 0), tiles["tile-road"]); roads++;
                tmRoads.SetTile(new Vector3Int(x, 46, 0), tiles["tile-road"]); roads++;
                tmRoads.SetTile(new Vector3Int(x, 47, 0), tiles["tile-road"]); roads++;
            }
            for (int y = 0; y < N; y++)
            {
                tmRoads.SetTile(new Vector3Int(12, y, 0), tiles["tile-road"]); roads++;
                tmRoads.SetTile(new Vector3Int(13, y, 0), tiles["tile-road"]); roads++;
                tmRoads.SetTile(new Vector3Int(54, y, 0), tiles["tile-road"]); roads++;
                tmRoads.SetTile(new Vector3Int(55, y, 0), tiles["tile-road"]); roads++;
            }

            // building footprints (deterministic list; must not touch roads/water/banks)
            var rects = new[]
            {
                new[] { 2, 2, 8, 7 }, new[] { 16, 3, 22, 8 }, new[] { 26, 2, 33, 7 }, new[] { 48, 3, 53, 8 },
                new[] { 2, 18, 8, 22 }, new[] { 16, 18, 22, 23 }, new[] { 48, 18, 53, 23 },
                new[] { 2, 26, 8, 30 }, new[] { 16, 26, 23, 31 }, new[] { 48, 27, 53, 32 },
                new[] { 2, 34, 8, 39 }, new[] { 16, 34, 23, 41 }, new[] { 48, 36, 53, 41 },
                new[] { 2, 50, 8, 55 }, new[] { 16, 50, 22, 56 }, new[] { 26, 50, 33, 56 }, new[] { 48, 50, 53, 55 },
            };
            var blockTiles = new[] { tiles["tile-block1"], tiles["tile-block2"], tiles["tile-block3"] };
            var rng = new System.Random(20260928);
            for (int i = 0; i < rects.Length; i++)
            {
                var r = rects[i];
                for (int y = r[1]; y <= r[3]; y++)
                    for (int x = r[0]; x <= r[2]; x++)
                    {
                        var c = new Vector3Int(x, y, 0);
                        if (tmRoads.GetTile(c) != null) throw new Exception("block overlaps road at " + c);
                        if (tmWater.GetTile(c) != null) throw new Exception("block overlaps water at " + c);
                        var t = rng.Next(100) < 20 ? tiles["tile-roof"] : blockTiles[i % 3];
                        tmBlocks.SetTile(c, t);
                        blocks++;
                    }
            }

            // walkers (8) + player
            var starts = new[]
            {
                new Vector3Int(3, 14, 0), new Vector3Int(20, 46, 0), new Vector3Int(13, 30, 0), new Vector3Int(54, 20, 0),
                new Vector3Int(30, 14, 0), new Vector3Int(48, 47, 0), new Vector3Int(13, 58, 0), new Vector3Int(60, 46, 0),
            };
            var dotSprites = new[] { sprites["dot1"], sprites["dot2"], sprites["dot3"], sprites["dot4"], sprites["dot5"] };
            var walkerPaths = new List<List<Vector3Int>>();
            for (int i = 0; i < starts.Length; i++)
            {
                var go = new GameObject("TD_Walker" + i);
                go.transform.SetParent(root.transform, false);
                var sr = go.AddComponent<SpriteRenderer>();
                sr.sprite = dotSprites[i % dotSprites.Length];
                sr.sortingOrder = 5;
                var w = go.AddComponent<TDWalker>();
                w.startCell = starts[i];
                w.seed = i * 7 + 3;
                go.transform.position = TDWalkLib.CellCenter(starts[i]);
            }
            var pgo = new GameObject("TD_Player");
            pgo.transform.SetParent(root.transform, false);
            var psr = pgo.AddComponent<SpriteRenderer>();
            psr.sprite = sprites["player"];
            psr.sortingOrder = 6;
            pgo.AddComponent<TDPlayer>();
            pgo.transform.position = TDWalkLib.CellCenter(new Vector3Int(16, 16, 0));

            // camera
            var camGo = GameObject.Find("Main Camera");
            var cam = camGo != null ? camGo.GetComponent<Camera>() : null;
            if (cam == null) throw new Exception("main camera missing");
            cam.orthographic = true;
            cam.orthographicSize = 33f;
            cam.clearFlags = CameraClearFlags.SolidColor;
            cam.backgroundColor = Hex("39423D");
            cam.transform.position = new Vector3(N / 2f, N / 2f, -10f);

            if (!EditorSceneManager.SaveScene(scene, ScenePath)) throw new Exception("scene save failed");

            // 4. screenshots (editor-time render, walkers placed mid-path via BFS)
            var walkable = TDWalkLib.CollectWalkable(tmRoads);
            result["walkableRoadCells"] = walkable.Count.ToString();
            var rng2 = new System.Random(20260928);
            var wObjs = new List<GameObject>();
            var wPaths = new List<List<Vector3Int>>();
            for (int i = 0; i < starts.Length; i++)
            {
                var go = root.transform.Find("TD_Walker" + i).gameObject;
                wObjs.Add(go);
                Vector3Int to;
                int guard = 0;
                do { var arr = new List<Vector3Int>(walkable); to = arr[rng2.Next(arr.Count)]; guard++; } while (to == starts[i] && guard < 20);
                var path = TDWalkLib.Path(walkable, starts[i], to);
                if (path.Count < 2) path = new List<Vector3Int> { starts[i] };
                wPaths.Add(path);
            }
            float[] t0 = { 0f, 1.7f, 3.4f, 5.1f, 6.8f, 8.5f, 10.2f, 11.9f };
            var cx = 0f; var cy = 0f;
            for (int i = 0; i < wObjs.Count; i++)
            {
                var pos = TDWalkLib.PosAt(wPaths[i], t0[i]);
                wObjs[i].transform.position = pos;
                cx += pos.x; cy += pos.y;
            }
            cx /= wObjs.Count; cy /= wObjs.Count;

            var dir = RepoAbs("docs", "design");
            if (!Directory.Exists(dir)) throw new Exception("docs/design missing");
            string s1 = Path.Combine(dir, "td-r0-1-overview.png");
            cam.orthographicSize = 33f;
            cam.transform.position = new Vector3(N / 2f, N / 2f, -10f);
            Shot(cam, 1024, 1024, s1);

            // pick the walker position with most neighbors within 15u as street cam center
            var poss = new List<Vector3>();
            for (int i = 0; i < wObjs.Count; i++) poss.Add(wObjs[i].transform.position);
            int bestIdx = 0; int bestCnt = -1;
            for (int i = 0; i < poss.Count; i++)
            {
                int cnt = 0;
                for (int j = 0; j < poss.Count; j++)
                    if ((poss[i] - poss[j]).sqrMagnitude < 15f * 15f) cnt++;
                if (cnt > bestCnt) { bestCnt = cnt; bestIdx = i; }
            }
            string s2 = Path.Combine(dir, "td-r0-2-street.png");
            cam.orthographicSize = 12f;
            cam.transform.position = new Vector3(Mathf.Clamp(poss[bestIdx].x, 21f, 43f), Mathf.Clamp(poss[bestIdx].y, 12f, 52f), -10f);
            var camStreet = cam.transform.position;
            Shot(cam, 1280, 720, s2);

            string s3 = Path.Combine(dir, "td-r0-3-street-t6.png");
            for (int i = 0; i < wObjs.Count; i++) wObjs[i].transform.position = TDWalkLib.PosAt(wPaths[i], t0[i] + 6f);
            Shot(cam, 1280, 720, s3);

            // reset in-memory walker transforms (scene file already saved clean)
            for (int i = 0; i < wObjs.Count; i++) wObjs[i].transform.position = TDWalkLib.CellCenter(starts[i]);

            // 5. proof
            result["groundCells"] = ground.ToString();
            result["waterCells"] = water.ToString();
            result["roadCells"] = roads.ToString();
            result["blockCells"] = blocks.ToString();
            result["walkers"] = wObjs.Count.ToString();
            foreach (var s in new[] { s1, s2, s3 })
            {
                var fi = new FileInfo(s);
                if (!fi.Exists || fi.Length < 8000) throw new Exception("shot too small/missing: " + s);
                result["shot_" + Path.GetFileName(s)] = fi.Length.ToString();
            }
            if (ground != N * N) throw new Exception("ground count mismatch");
            if (roads < 400 || water < 500 || blocks < 600) throw new Exception("layer counts below expectation");
            File.WriteAllText(donePath, Json(result));
            Debug.Log("TDDEMO PASS ground=" + ground + " roads=" + roads + " water=" + water + " blocks=" + blocks + " walkers=8");
        }
        catch (Exception e)
        {
            var msg = e.Message.Replace("\"", "'").Replace("\r", " ").Replace("\n", " ");
            result["result"] = "FAIL";
            result["error"] = msg;
            File.WriteAllText(donePath, Json(result));
            Debug.LogError("TDDEMO FAIL: " + msg);
            throw;
        }
    }

    static string Json(Dictionary<string, string> d)
    {
        var parts = new List<string>();
        foreach (var kv in d) parts.Add("\"" + kv.Key + "\":\"" + kv.Value + "\"");
        return "{" + string.Join(",", parts.ToArray()) + "}";
    }
}
