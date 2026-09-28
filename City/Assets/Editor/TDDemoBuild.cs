using System;
using System.Collections.Generic;
using System.IO;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine;
using UnityEngine.SceneManagement;
using UnityEngine.Tilemaps;

// CEO direct order 2026-09-28 (aesthetics r3): densify buildings (row-house
// packing, taller commercial), riverside promenade with tree line, bridge
// approach + assert, shop canopies, parked cars + food carts (static street
// furniture - moving vehicles stay event-driven per r44 law).

public static class TDDemoBuild
{
    const int N = 64;
    const string TileDir = "Assets/Art/CleanCityv3/Tiles_Auto";
    const string ArtOut = "Assets/Art/TDDemo";
    const string ScenePath = "Assets/Scenes/TopDownDemo.unity";
    const float CamSize = 11.25f; // 1080p -> 48px/16px tile = 3x integer

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

    static Sprite LoadSprite(string rel)
    {
        return AssetDatabase.LoadAssetAtPath<Sprite>(rel);
    }

    static Sprite ResidentFrame(int resNum)
    {
        if (!Directory.Exists(ArtOut)) AssetDatabase.CreateFolder("Assets/Art", "TDDemo");
        string srcAbs = Path.Combine(Application.dataPath, "ArtPacks/residents-crowd/" + resNum + "/Walk.png");
        if (!File.Exists(srcAbs)) throw new Exception("sheet missing: resident " + resNum);
        var sheet = new Texture2D(2, 2);
        if (!sheet.LoadImage(File.ReadAllBytes(srcAbs))) throw new Exception("LoadImage failed: resident " + resNum);
        int fw = sheet.height;
        if (sheet.width % fw != 0) throw new Exception("non-square frames: resident " + resNum);
        var frame = new Texture2D(fw, fw, TextureFormat.RGBA32, false);
        frame.SetPixels(sheet.GetPixels(0, 0, fw, fw));
        frame.Apply();
        File.WriteAllBytes(Path.Combine(Application.dataPath, "Art/TDDemo/res" + resNum + "_walk0.png"), ImageConversion.EncodeToPNG(frame));
        UnityEngine.Object.DestroyImmediate(sheet);
        UnityEngine.Object.DestroyImmediate(frame);
        AssetDatabase.ImportAsset(ArtOut + "/res" + resNum + "_walk0.png");
        var imp = AssetImporter.GetAtPath(ArtOut + "/res" + resNum + "_walk0.png") as TextureImporter;
        if (imp == null) throw new Exception("importer missing res" + resNum);
        imp.textureType = TextureImporterType.Sprite;
        imp.spriteImportMode = SpriteImportMode.Single;
        imp.spritePixelsPerUnit = 24;
        imp.filterMode = FilterMode.Point;
        imp.mipmapEnabled = false;
        imp.textureCompression = TextureImporterCompression.Uncompressed;
        imp.SaveAndReimport();
        var sp = AssetDatabase.LoadAssetAtPath<Sprite>(ArtOut + "/res" + resNum + "_walk0.png");
        if (sp == null) throw new Exception("readback fail res" + resNum);
        return sp;
    }

    static Sprite FirstFrame(string relDir)
    {
        var abs = Path.Combine(Application.dataPath, relDir);
        if (!Directory.Exists(abs)) return null;
        var files = Directory.GetFiles(abs, "*.png");
        if (files.Length == 0) return null;
        Array.Sort(files, StringComparer.Ordinal);
        return AssetDatabase.LoadAssetAtPath<Sprite>("Assets/" + relDir + "/" + Path.GetFileName(files[0]));
    }

    static GameObject MakeSpriteGo(string name, Sprite sp, int order, Transform parent, Vector3 pos, float worldU)
    {
        var go = new GameObject(name);
        go.transform.SetParent(parent, false);
        var sr = go.AddComponent<SpriteRenderer>();
        sr.sprite = sp;
        sr.sortingOrder = order;
        var h = sp.bounds.size.y;
        if (h > 0.0001f) go.transform.localScale = new Vector3(worldU / h, worldU / h, 1f);
        go.transform.position = pos;
        return go;
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
        var donePath = RepoAbs("logs", "td-demo-r5.done");
        var result = new Dictionary<string, string> { { "result", "PASS" } };
        try
        {
            var gA = RT("t_grass_a"); var gB = RT("t_grass_b");
            var pav = RT("t_pav_plain");
            var roadLine = RT("t_road_line"); var roadDashH = RT("t_road_dash_h"); var roadDashV = RT("t_road_dash_v");
            var wallA = RT("t_wall_gray_a"); var wallB = RT("t_wall_gray_b"); var wallC = RT("t_wall_gray_c"); var glass = RT("t_wall_glass");
            var roofA = RT("t_roof_a"); var roofB = RT("t_roof_b");
            var propA = RT("t_prop_a"); var propB = RT("t_prop_b"); var propPost = RT("t_prop_post"); var propBox = RT("t_prop_box");
            var waterFrames = new Tile[8];
            for (int i = 0; i < 8; i++) waterFrames[i] = RT("t_water_" + i);

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
            int ground = 0, sidewalk = 0, water = 0, roads = 0, buildingCols = 0, props = 0, canopies = 0, cars = 0;

            // calm two-tone grass (patchy, not camo noise)
            for (int y = 0; y < N; y++)
                for (int x = 0; x < N; x++)
                {
                    tmGround.SetTile(new Vector3Int(x, y, 0), (((x + y * 3) % 13) == 0) ? gB : gA);
                    ground++;
                }

            // river + continuous promenade banks + pier stubs
            for (int y = 0; y < N; y++)
            {
                for (int x = 40; x <= 45; x++)
                {
                    tmWater.SetTile(new Vector3Int(x, y, 0), waterFrames[(x * 31 + y * 17) % 8]);
                    water++;
                }
                tmWater.SetTile(new Vector3Int(39, y, 0), (y % 2 == 0) ? pav : RT("t_pav_corner")); water++; // west promenade
                tmWater.SetTile(new Vector3Int(46, y, 0), (y % 2 == 0) ? pav : RT("t_pav_corner")); water++; // east promenade
                if (y % 7 == 3) { tmWater.SetTile(new Vector3Int(40, y, 0), pav); water++; } // pier stub
                if (y % 9 == 5) { tmWater.SetTile(new Vector3Int(45, y, 0), pav); water++; }
            }

            // sidewalks flanking roads (river cells already promenade)
            foreach (var ry in new[] { 13, 16, 45, 48 })
                for (int x = 0; x < N; x++)
                {
                    var c = new Vector3Int(x, ry, 0);
                    if (tmWater.GetTile(c) != null) continue;
                    tmGround.SetTile(c, pav); sidewalk++;
                }
            foreach (var cx in new[] { 11, 14, 53, 56 })
                for (int y = 0; y < N; y++)
                {
                    var c = new Vector3Int(cx, y, 0);
                    if (tmWater.GetTile(c) != null) continue;
                    tmGround.SetTile(c, pav); sidewalk++;
                }

            // roads (bridges cross the river - asserted below)
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
            int bridgeTiles = 0;
            for (int y = 0; y < N; y++)
                for (int x = 0; x < N; x++)
                {
                    bool h = (y == 14 || y == 15 || y == 46 || y == 47);
                    bool v = (x == 12 || x == 13 || x == 54 || x == 55);
                    if (h && v) tmRoads.SetTile(new Vector3Int(x, y, 0), roadLine);
                    if ((h) && x >= 40 && x <= 45 && tmRoads.GetTile(new Vector3Int(x, y, 0)) != null) bridgeTiles++;
                }
            if (bridgeTiles != 24) throw new Exception("bridge tiles != 24: " + bridgeTiles);

            // districts: north residential (grass gardens), mid commercial (taller),
            // south mixed (pav lots)
            var rects = new[]
            {
                // zone-filling lots, flush to sidewalks (v4 density pass)
                new[] { 2, 2, 10, 12 }, new[] { 15, 2, 22, 12 }, new[] { 26, 2, 37, 12 }, new[] { 48, 2, 52, 12 },
                new[] { 2, 17, 10, 26 }, new[] { 15, 17, 22, 26 }, new[] { 26, 17, 37, 26 }, new[] { 48, 17, 52, 26 },
                new[] { 2, 28, 10, 44 }, new[] { 15, 28, 23, 44 }, new[] { 26, 28, 38, 32 }, new[] { 48, 28, 52, 44 },
                new[] { 2, 50, 10, 62 }, new[] { 15, 50, 22, 62 }, new[] { 26, 50, 37, 62 }, new[] { 48, 50, 52, 62 },
            };
            var canopySprites = new[]
            {
                LoadSprite("Assets/ArtPacks/canopies/canopy-brown.png"),
                LoadSprite("Assets/ArtPacks/canopies/canopy-green.png"),
                LoadSprite("Assets/ArtPacks/canopies/canopy-orange.png"),
            };
            for (int i = 0; i < rects.Length; i++)
            {
                var r = rects[i];
                bool north = r[3] < 14;
                bool south = r[1] > 47;
                bool mid = !north && !south;
                if (!north) // lot pavement base (residential keeps grass gardens)
                    for (int y = r[1]; y <= r[3]; y++)
                        for (int x = r[0]; x <= r[2]; x++)
                            tmGround.SetTile(new Vector3Int(x, y, 0), pav);
                int d = 3; // uniform band depth: 2 roof rows + facade
                var wallSet = north ? new[] { wallA, wallB } : (south ? new[] { wallC, wallC, wallA } : new[] { wallB, wallC, wallC });
                var roofSet = north ? (i % 2 == 0 ? roofA : roofB) : (south ? roofB : roofA);
                int yi = r[1] + 1;
                while (yi + d - 1 <= r[3] - 1)
                {
                    int x = r[0] + 1;
                    while (x <= r[2] - 1)
                    {
                        int space = (r[2] - 1) - x + 1;
                        if (space < 2) break;
                        int w = new[] { 2, 3, 4, 3, 2 }[rng.Next(5)];
                        if (w > space) w = space;
                        if (w < 2) break;
                        var facade = (mid && rng.Next(100) < 30) ? glass : wallSet[rng.Next(wallSet.Length)];
                        var roof = (rng.Next(100) < 15) ? (roofSet == roofA ? roofB : roofA) : roofSet;
                        for (int bx = x; bx < x + w; bx++)
                        {
                            for (int by = 0; by < d; by++)
                            {
                                var c = new Vector3Int(bx, yi + by, 0);
                                if (tmRoads.GetTile(c) != null || tmWater.GetTile(c) != null) throw new Exception("bldg overlaps at " + c);
                                tmBlocks.SetTile(c, by == d - 1 ? facade : roof);
                            }
                            buildingCols++;
                        }
                        // shop canopy over commercial facades
                        if (mid && rng.Next(100) < 40 && canopySprites[canopies % 3] != null)
                        {
                            var csp = canopySprites[canopies % 3];
                            var cpos = new Vector3(x + w / 2f + 0.5f, yi + d - 1 + 0.15f, 0f);
                            MakeSpriteGo("TD_Canopy" + canopies, csp, 4, root.transform, cpos, w - 0.2f);
                            canopies++;
                        }
                        x += w + (rng.Next(100) < 25 ? 1 : 0); // row-house packing, sparse alleys
                    }
                    yi += d + 1;
                }
                // garden props in residential yards
                if (north)
                {
                    for (int g = 0; g < 2; g++)
                    {
                        var gc = new Vector3Int(rng.Next(r[0], r[2] + 1), rng.Next(r[1], r[3] + 1), 0);
                        if (tmRoads.GetTile(gc) != null || tmBlocks.GetTile(gc) != null || tmWater.GetTile(gc) != null) continue;
                        tmBlocks.SetTile(gc, g == 0 ? propB : propA); props++;
                    }
                }
            }

            // bridge heads: lamp posts at both ends of both road bridges (visual anchors)
            foreach (var lc2 in new[]
            {
                new Vector3Int(39, 13, 0), new Vector3Int(46, 13, 0), new Vector3Int(39, 16, 0), new Vector3Int(46, 16, 0),
                new Vector3Int(39, 45, 0), new Vector3Int(46, 45, 0), new Vector3Int(39, 48, 0), new Vector3Int(46, 48, 0),
            })
            {
                tmBlocks.SetTile(lc2, propPost); props++;
            }

            // riverside plaza (26..38 x 34..42)
            for (int y = 34; y <= 42; y++)
                for (int x = 26; x <= 38; x++)
                    tmGround.SetTile(new Vector3Int(x, y, 0), pav);
            var fUL = FirstFrame("Art/CleanCityv3/AnimatedTiles/Fountain_UL");
            var fUR = FirstFrame("Art/CleanCityv3/AnimatedTiles/Fountain_UR");
            var fBL = FirstFrame("Art/CleanCityv3/AnimatedTiles/Fountain_BL");
            var fBR = FirstFrame("Art/CleanCityv3/AnimatedTiles/Fountain_BR");
            int fountains = 0;
            if (fUL != null && fUR != null && fBL != null && fBR != null)
            {
                MakeSpriteGo("TD_FountainUL", fUL, 4, root.transform, TDWalkLib.CellCenter(new Vector3Int(31, 38, 0)), 1f);
                MakeSpriteGo("TD_FountainUR", fUR, 4, root.transform, TDWalkLib.CellCenter(new Vector3Int(32, 38, 0)), 1f);
                MakeSpriteGo("TD_FountainBL", fBL, 4, root.transform, TDWalkLib.CellCenter(new Vector3Int(31, 37, 0)), 1f);
                MakeSpriteGo("TD_FountainBR", fBR, 4, root.transform, TDWalkLib.CellCenter(new Vector3Int(32, 37, 0)), 1f);
                fountains = 4;
            }
            var tree1 = FirstFrame("Art/CleanCityv3/AnimatedTiles/Tree1");
            var tree2 = FirstFrame("Art/CleanCityv3/AnimatedTiles/Tree2");
            int trees = 0;
            if (tree1 != null && tree2 != null)
            {
                foreach (var tc in new[] { new Vector3Int(27, 36, 0), new Vector3Int(37, 38, 0), new Vector3Int(28, 41, 0), new Vector3Int(36, 35, 0) })
                {
                    MakeSpriteGo("TD_TreeP" + trees, trees % 2 == 0 ? tree1 : tree2, 4, root.transform, TDWalkLib.CellCenter(tc), 2.2f);
                    trees++;
                }
                int[] bankYs = { 8, 18, 24, 28, 52, 58 };
                foreach (var by in bankYs)
                {
                    foreach (var tc in new[] { new Vector3Int(38, by, 0), new Vector3Int(47, by, 0) })
                    {
                        if (tmRoads.GetTile(tc) != null || tmBlocks.GetTile(tc) != null) continue;
                        MakeSpriteGo("TD_TreeB" + trees, trees % 2 == 0 ? tree1 : tree2, 4, root.transform, TDWalkLib.CellCenter(tc), 2.2f);
                        trees++;
                    }
                }
            }
            foreach (var lc in new[] { new Vector3Int(11, 13, 0), new Vector3Int(14, 13, 0), new Vector3Int(11, 16, 0), new Vector3Int(14, 16, 0), new Vector3Int(26, 34, 0), new Vector3Int(38, 42, 0) })
            {
                if (tmWater.GetTile(lc) != null) continue;
                tmBlocks.SetTile(lc, propPost); props++;
            }
            foreach (var bc in new[] { new Vector3Int(29, 40, 0), new Vector3Int(35, 40, 0), new Vector3Int(29, 36, 0) })
            {
                tmBlocks.SetTile(bc, propBox); props++;
            }

            // street furniture: parked cars on plaza south edge + food carts
            var carSprites = new[]
            {
                LoadSprite("Assets/Art/Vehicles/frames/vehicle-car-l.png"),
                LoadSprite("Assets/Art/Vehicles/frames/vehicle-car-r2.png"),
                LoadSprite("Assets/Art/Vehicles/frames/vehicle-camper-r.png"),
                LoadSprite("Assets/Art/Vehicles/frames/vehicle-bus-r.png"),
            };
            int ci = 0;
            foreach (var cc in new[] { new Vector3Int(28, 42, 0), new Vector3Int(32, 42, 0), new Vector3Int(36, 42, 0), new Vector3Int(24, 43, 0) })
            {
                var sp = carSprites[ci % carSprites.Length];
                ci++;
                if (sp == null) continue;
                var cw = sp.bounds.size.x; var ch = sp.bounds.size.y;
                var go = new GameObject("TD_Car" + cars);
                go.transform.SetParent(root.transform, false);
                var sr = go.AddComponent<SpriteRenderer>();
                sr.sprite = sp;
                sr.sortingOrder = 5;
                go.transform.position = TDWalkLib.CellCenter(cc) + new Vector3(0f, 0.2f, 0f);
                go.transform.localScale = Vector3.one; // native (r44 street furniture law)
                cars++;
            }
            var cartFood = LoadSprite("Assets/Art/Vehicles/frames/vehicle-cart-food.png");
            var cartFruit = LoadSprite("Assets/Art/Vehicles/frames/vehicle-cart-fruit.png");
            if (cartFood != null) { MakeSpriteGo("TD_CartFood", cartFood, 5, root.transform, TDWalkLib.CellCenter(new Vector3Int(29, 38, 0)), 1.6f); cars++; }
            if (cartFruit != null) { MakeSpriteGo("TD_CartFruit", cartFruit, 5, root.transform, TDWalkLib.CellCenter(new Vector3Int(35, 37, 0)), 1.6f); cars++; }

            // residents + player
            var starts = new[]
            {
                new Vector3Int(3, 14, 0), new Vector3Int(20, 46, 0), new Vector3Int(13, 30, 0), new Vector3Int(54, 20, 0),
                new Vector3Int(30, 14, 0), new Vector3Int(48, 47, 0), new Vector3Int(13, 58, 0), new Vector3Int(60, 46, 0),
            };
            int[] walkerRes = { 1, 2, 3, 4, 5, 6, 9, 11 };
            for (int i = 0; i < starts.Length; i++)
            {
                var sp = ResidentFrame(walkerRes[i]);
                var go = new GameObject("TD_Walker" + i);
                go.transform.SetParent(root.transform, false);
                var sr = go.AddComponent<SpriteRenderer>();
                sr.sprite = sp;
                sr.sortingOrder = 6;
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
            psr.sortingOrder = 7;
            pgo.AddComponent<TDPlayer>();
            pgo.transform.position = TDWalkLib.CellCenter(new Vector3Int(30, 44, 0));

            var camGo = GameObject.Find("Main Camera");
            var cam = camGo != null ? camGo.GetComponent<Camera>() : null;
            if (cam == null) throw new Exception("main camera missing");
            cam.orthographic = true;
            cam.orthographicSize = CamSize;
            cam.clearFlags = CameraClearFlags.SolidColor;
            cam.backgroundColor = new Color32(46, 52, 50, 255);
            cam.transform.position = new Vector3(32f, 36f, -10f);

            if (!EditorSceneManager.SaveScene(scene, ScenePath)) throw new Exception("scene save failed");

            // screenshots
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
            for (int i = 0; i < wObjs.Count; i++) wObjs[i].transform.position = TDWalkLib.PosAt(wPaths[i], t0[i]);

            var dir = RepoAbs("docs", "design");
            if (!Directory.Exists(dir)) throw new Exception("docs/design missing");

            string s1 = Path.Combine(dir, "td-r5-1-street.png");
            cam.orthographicSize = CamSize;
            cam.transform.position = new Vector3(32f, 36.5f, -10f);
            Shot(cam, 1920, 1080, s1);

            string s2 = Path.Combine(dir, "td-r5-2-plaza-t6.png");
            for (int i = 0; i < wObjs.Count; i++) wObjs[i].transform.position = TDWalkLib.PosAt(wPaths[i], t0[i] + 6f);
            Shot(cam, 1920, 1080, s2);

            string s3 = Path.Combine(dir, "td-r5-3-bridge.png");
            for (int i = 0; i < wObjs.Count; i++) wObjs[i].transform.position = TDWalkLib.PosAt(wPaths[i], t0[i]);
            cam.orthographicSize = CamSize;
            cam.transform.position = new Vector3(42.5f, 20f, -10f);
            Shot(cam, 1920, 1080, s3);

            string s4 = Path.Combine(dir, "td-r5-4-overview.png");
            cam.orthographicSize = 32f;
            cam.transform.position = new Vector3(32f, 32f, -10f);
            Shot(cam, 3072, 3072, s4);

            for (int i = 0; i < wObjs.Count; i++) wObjs[i].transform.position = TDWalkLib.CellCenter(starts[i]);

            // proof
            result["groundCells"] = ground.ToString();
            result["sidewalkCells"] = sidewalk.ToString();
            result["waterCells"] = water.ToString();
            result["roadCells"] = roads.ToString();
            result["bridgeTiles"] = bridgeTiles.ToString();
            result["buildingCols"] = buildingCols.ToString();
            result["propCells"] = props.ToString();
            result["canopies"] = canopies.ToString();
            result["streetVehicles"] = cars.ToString();
            result["trees"] = trees.ToString();
            result["fountainQuads"] = fountains.ToString();
            result["walkers"] = wObjs.Count.ToString();
            foreach (var s in new[] { s1, s2, s3, s4 })
            {
                var fi = new FileInfo(s);
                if (!fi.Exists || fi.Length < 8000) throw new Exception("shot too small/missing: " + s);
                result["shot_" + Path.GetFileName(s)] = fi.Length.ToString();
            }
            if (ground != N * N) throw new Exception("ground count mismatch");
            if (buildingCols < 140) throw new Exception("building density below target: " + buildingCols);
            if (canopies < 5 || cars < 4) throw new Exception("street furniture below target");
            if (sidewalk < 300 || roads < 400 || water < 500) throw new Exception("layer counts below expectation");
            if (trees < 14 || fountains != 4) throw new Exception("greenery/fountain missing");
            File.WriteAllText(donePath, Json(result));
            Debug.Log("TDDEMO R3 PASS sidewalk=" + sidewalk + " bldgCols=" + buildingCols + " canopies=" + canopies + " cars=" + cars + " trees=" + trees);
        }
        catch (Exception e)
        {
            var msg = e.Message.Replace("\"", "'").Replace("\r", " ").Replace("\n", " ");
            result["result"] = "FAIL";
            result["error"] = msg;
            File.WriteAllText(donePath, Json(result));
            Debug.LogError("TDDEMO R3 FAIL: " + msg);
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
