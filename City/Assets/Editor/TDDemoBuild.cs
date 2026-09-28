using System;
using System.Collections.Generic;
using System.IO;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine;
using UnityEngine.SceneManagement;
using UnityEngine.Tilemaps;

// CEO direct order 2026-09-28 (re-skin pass): assemble the top-down demo slice
// from the REAL art library - CleanCityv3 semantic tiles (Tiles_Auto assets,
// CitySkeletonBuilder vocabulary) + residents-crowd walk frames (cropped at
// build time from unsliced sheets via LoadImage - zero meta churn on packs).
// Deterministic layout, fail-loud asserts, .done sentinel in logs/.

public static class TDDemoBuild
{
    const int N = 64;
    const string TileDir = "Assets/Art/CleanCityv3/Tiles_Auto";
    const string ArtOut = "Assets/Art/TDDemo";
    const string ScenePath = "Assets/Scenes/TopDownDemo.unity";

    static string RepoAbs(params string[] rel)
    {
        var root = Path.GetFullPath(Path.Combine(Application.dataPath, "..", ".."));
        return Path.GetFullPath(Path.Combine(root, Path.Combine(rel)));
    }

    static Tile RT(string name)
    {
        var t = AssetDatabase.LoadAssetAtPath<Tile>(TileDir + "/" + name + ".asset");
        if (t == null) throw new Exception("tile resolve failed: " + name);
        return t;
    }

    // crop one frame from an unsliced residents-crowd sheet without touching
    // the pack meta: raw LoadImage -> GetPixels -> own PNG under TDDemo.
    static Sprite ResidentFrame(int resNum)
    {
        if (!Directory.Exists(ArtOut)) AssetDatabase.CreateFolder("Assets/Art", "TDDemo");
        string srcAbs = Path.Combine(Application.dataPath, "ArtPacks/residents-crowd/" + resNum + "/Walk.png");
        if (!File.Exists(srcAbs)) throw new Exception("sheet missing: resident " + resNum);
        var sheet = new Texture2D(2, 2);
        if (!sheet.LoadImage(File.ReadAllBytes(srcAbs))) throw new Exception("LoadImage failed: resident " + resNum);
        int fw = sheet.height; // assume square frames
        if (sheet.width % fw != 0) throw new Exception("non-square frames: resident " + resNum + " " + sheet.width + "x" + sheet.height);
        var frame = new Texture2D(fw, fw, TextureFormat.RGBA32, false);
        frame.SetPixels(sheet.GetPixels(0, 0, fw, fw));
        frame.Apply();
        string outFile = ArtOut + "/res" + resNum + "_walk0.png";
        File.WriteAllBytes(Path.Combine(Application.dataPath, "Art/TDDemo/res" + resNum + "_walk0.png"), ImageConversion.EncodeToPNG(frame));
        UnityEngine.Object.DestroyImmediate(sheet);
        UnityEngine.Object.DestroyImmediate(frame);
        AssetDatabase.ImportAsset(outFile);
        var imp = AssetImporter.GetAtPath(outFile) as TextureImporter;
        if (imp == null) throw new Exception("importer missing: " + outFile);
        imp.textureType = TextureImporterType.Sprite;
        imp.spriteImportMode = SpriteImportMode.Single;
        imp.spritePixelsPerUnit = 24; // resident seat law (r37)
        imp.filterMode = FilterMode.Point;
        imp.mipmapEnabled = false;
        imp.textureCompression = TextureImporterCompression.Uncompressed;
        imp.SaveAndReimport();
        var sp = AssetDatabase.LoadAssetAtPath<Sprite>(outFile);
        if (sp == null) throw new Exception("readback fail: " + outFile);
        return sp;
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
        var donePath = RepoAbs("logs", "td-demo-r1.done");
        var result = new Dictionary<string, string> { { "result", "PASS" } };
        try
        {
            // 1. semantic tiles from the established city vocabulary
            var gA = RT("t_grass_a"); var gB = RT("t_grass_b");
            var pav = RT("t_pav_plain");
            var roadLine = RT("t_road_line"); var roadDashH = RT("t_road_dash_h"); var roadDashV = RT("t_road_dash_v");
            var wallA = RT("t_wall_gray_a"); var wallB = RT("t_wall_gray_b"); var wallC = RT("t_wall_gray_c"); var glass = RT("t_wall_glass");
            var roofA = RT("t_roof_a"); var roofB = RT("t_roof_b");
            var propA = RT("t_prop_a"); var propB = RT("t_prop_b"); var propPost = RT("t_prop_post"); var propBox = RT("t_prop_box");
            var waterTile = RT("t_water_2"); var waterEdgeTile = RT("t_water_0");
            var walls = new[] { wallA, wallB, wallC };

            // 2. scene
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

            var rng = new System.Random(20260928);
            int ground = 0, water = 0, roads = 0, blocks = 0, props = 0;

            for (int y = 0; y < N; y++)
                for (int x = 0; x < N; x++)
                {
                    tmGround.SetTile(new Vector3Int(x, y, 0), ((x + y) % 9 == 0) ? gB : gA);
                    ground++;
                }
            // river: concrete embankment banks (x39/46), waves inside
            for (int y = 0; y < N; y++)
            {
                tmWater.SetTile(new Vector3Int(39, y, 0), pav); water++;
                tmWater.SetTile(new Vector3Int(46, y, 0), pav); water++;
                for (int x = 40; x <= 45; x++)
                {
                    tmWater.SetTile(new Vector3Int(x, y, 0), (x == 40 || x == 45) ? waterEdgeTile : waterTile);
                    water++;
                }
            }
            // roads: 2-wide, dashes as center stripes; crossings normalized to plain
            for (int x = 0; x < N; x++)
            {
                tmRoads.SetTile(new Vector3Int(x, 14, 0), roadLine); roads++;
                tmRoads.SetTile(new Vector3Int(x, 15, 0), roadDashH); roads++;
                tmRoads.SetTile(new Vector3Int(x, 46, 0), roadLine); roads++;
                tmRoads.SetTile(new Vector3Int(x, 47, 0), roadDashH); roads++;
            }
            for (int y = 0; y < N; y++)
            {
                tmRoads.SetTile(new Vector3Int(12, y, 0), roadLine); roads++;
                tmRoads.SetTile(new Vector3Int(13, y, 0), roadDashV); roads++;
                tmRoads.SetTile(new Vector3Int(54, y, 0), roadLine); roads++;
                tmRoads.SetTile(new Vector3Int(55, y, 0), roadDashV); roads++;
            }
            for (int y = 0; y < N; y++)
                for (int x = 0; x < N; x++)
                {
                    var c = new Vector3Int(x, y, 0);
                    bool h = (y == 14 || y == 15 || y == 46 || y == 47);
                    bool v = (x == 12 || x == 13 || x == 54 || x == 55);
                    if (h && v) tmRoads.SetTile(c, roadLine);
                }

            // building blocks: pavement ring, facade bottom row, roof fill
            var rects = new[]
            {
                new[] { 2, 2, 8, 7 }, new[] { 16, 3, 22, 8 }, new[] { 26, 2, 33, 7 }, new[] { 48, 3, 53, 8 },
                new[] { 2, 18, 8, 22 }, new[] { 16, 18, 22, 23 }, new[] { 48, 18, 53, 23 },
                new[] { 2, 26, 8, 30 }, new[] { 16, 26, 23, 31 }, new[] { 48, 27, 53, 32 },
                new[] { 2, 34, 8, 39 }, new[] { 16, 34, 23, 41 }, new[] { 48, 36, 53, 41 },
                new[] { 2, 50, 8, 55 }, new[] { 16, 50, 22, 56 }, new[] { 26, 50, 33, 56 }, new[] { 48, 50, 53, 55 },
            };
            for (int i = 0; i < rects.Length; i++)
            {
                var r = rects[i];
                for (int y = r[1]; y <= r[3]; y++)
                    for (int x = r[0]; x <= r[2]; x++)
                    {
                        var c = new Vector3Int(x, y, 0);
                        if (tmRoads.GetTile(c) != null) throw new Exception("block overlaps road at " + c);
                        if (tmWater.GetTile(c) != null) throw new Exception("block overlaps water at " + c);
                        bool ring = (x == r[0] || x == r[2] || y == r[1] || y == r[3]);
                        if (ring) tmBlocks.SetTile(c, pav);
                        else if (y == r[3] - 1) // facade row faces the street below
                        {
                            var t = rng.Next(100) < 15 ? glass : walls[rng.Next(3)];
                            tmBlocks.SetTile(c, t);
                        }
                        else tmBlocks.SetTile(c, ((x + y) % 2 == 0) ? roofA : roofB);
                        blocks++;
                    }
            }
            // street props sprinkled on free grass cells
            var propTiles = new[] { propA, propB, propPost, propBox };
            int placed = 0, guard = 0;
            while (placed < 14 && guard < 500)
            {
                guard++;
                var c = new Vector3Int(rng.Next(1, N - 1), rng.Next(1, N - 1), 0);
                if (tmGround.GetTile(c) == null || tmRoads.GetTile(c) != null || tmWater.GetTile(c) != null || tmBlocks.GetTile(c) != null) continue;
                tmBlocks.SetTile(c, propTiles[placed % 4]);
                placed++; props++;
            }

            // 3. residents (real walk frames) + player
            var starts = new[]
            {
                new Vector3Int(3, 14, 0), new Vector3Int(20, 46, 0), new Vector3Int(13, 30, 0), new Vector3Int(54, 20, 0),
                new Vector3Int(30, 14, 0), new Vector3Int(48, 47, 0), new Vector3Int(13, 58, 0), new Vector3Int(60, 46, 0),
            };
            int[] walkerRes = { 1, 2, 3, 4, 5, 6, 9, 11 }; // only these sheets have Walk.png
            for (int i = 0; i < starts.Length; i++)
            {
                var sp = ResidentFrame(walkerRes[i]);
                var go = new GameObject("TD_Walker" + i);
                go.transform.SetParent(root.transform, false);
                var sr = go.AddComponent<SpriteRenderer>();
                sr.sprite = sp;
                sr.sortingOrder = 5;
                var w = go.AddComponent<TDWalker>();
                w.startCell = starts[i];
                w.seed = i * 7 + 3;
                go.transform.position = TDWalkLib.CellCenter(starts[i]);
            }
            var psp = ResidentFrame(10);
            var pgo = new GameObject("TD_Player");
            pgo.transform.SetParent(root.transform, false);
            var psr = pgo.AddComponent<SpriteRenderer>();
            psr.sprite = psp;
            psr.sortingOrder = 6;
            pgo.AddComponent<TDPlayer>();
            pgo.transform.position = TDWalkLib.CellCenter(new Vector3Int(16, 16, 0));

            var camGo = GameObject.Find("Main Camera");
            var cam = camGo != null ? camGo.GetComponent<Camera>() : null;
            if (cam == null) throw new Exception("main camera missing");
            cam.orthographic = true;
            cam.orthographicSize = 33f;
            cam.clearFlags = CameraClearFlags.SolidColor;
            cam.backgroundColor = new Color32(46, 52, 50, 255);
            cam.transform.position = new Vector3(N / 2f, N / 2f, -10f);

            if (!EditorSceneManager.SaveScene(scene, ScenePath)) throw new Exception("scene save failed");

            // 4. screenshots: walkers mid-path (BFS over the semantic road grid)
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
                int g2 = 0;
                do { var arr = new List<Vector3Int>(walkable); to = arr[rng2.Next(arr.Count)]; g2++; } while (to == starts[i] && g2 < 20);
                var path = TDWalkLib.Path(walkable, starts[i], to);
                if (path.Count < 2) path = new List<Vector3Int> { starts[i] };
                wPaths.Add(path);
            }
            float[] t0 = { 0f, 1.7f, 3.4f, 5.1f, 6.8f, 8.5f, 10.2f, 11.9f };
            var poss = new List<Vector3>();
            for (int i = 0; i < wObjs.Count; i++)
            {
                var pos = TDWalkLib.PosAt(wPaths[i], t0[i]);
                wObjs[i].transform.position = pos;
                poss.Add(pos);
            }
            int bestIdx = 0; int bestCnt = -1;
            for (int i = 0; i < poss.Count; i++)
            {
                int cnt = 0;
                for (int j = 0; j < poss.Count; j++)
                    if ((poss[i] - poss[j]).sqrMagnitude < 15f * 15f) cnt++;
                if (cnt > bestCnt) { bestCnt = cnt; bestIdx = i; }
            }

            var dir = RepoAbs("docs", "design");
            if (!Directory.Exists(dir)) throw new Exception("docs/design missing");
            string s1 = Path.Combine(dir, "td-r1-1-overview.png");
            cam.orthographicSize = 33f;
            cam.transform.position = new Vector3(N / 2f, N / 2f, -10f);
            Shot(cam, 1024, 1024, s1);

            string s2 = Path.Combine(dir, "td-r1-2-street.png");
            cam.orthographicSize = 12f;
            cam.transform.position = new Vector3(Mathf.Clamp(poss[bestIdx].x, 21f, 43f), Mathf.Clamp(poss[bestIdx].y, 12f, 52f), -10f);
            Shot(cam, 1280, 720, s2);

            string s3 = Path.Combine(dir, "td-r1-3-street-t6.png");
            for (int i = 0; i < wObjs.Count; i++) wObjs[i].transform.position = TDWalkLib.PosAt(wPaths[i], t0[i] + 6f);
            Shot(cam, 1280, 720, s3);

            for (int i = 0; i < wObjs.Count; i++) wObjs[i].transform.position = TDWalkLib.CellCenter(starts[i]);

            // 5. proof
            result["groundCells"] = ground.ToString();
            result["waterCells"] = water.ToString();
            result["roadCells"] = roads.ToString();
            result["blockCells"] = blocks.ToString();
            result["propCells"] = props.ToString();
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
            Debug.Log("TDDEMO R1 PASS ground=" + ground + " roads=" + roads + " water=" + water + " blocks=" + blocks + " props=" + props + " walkers=8");
        }
        catch (Exception e)
        {
            var msg = e.Message.Replace("\"", "'").Replace("\r", " ").Replace("\n", " ");
            result["result"] = "FAIL";
            result["error"] = msg;
            File.WriteAllText(donePath, Json(result));
            Debug.LogError("TDDEMO R1 FAIL: " + msg);
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
