using System;
using System.Collections.Generic;
using System.IO;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine;
using UnityEngine.SceneManagement;
using UnityEngine.Tilemaps;

// CEO direct order 2026-09-28 (~15:00): assemble the 2D map IN THE ENGINE with
// real tiles - not a baked image. Ground/water/roads are real Tile assets on
// Tilemaps (neighbor-mask autotile selection, bridges included); buildings,
// trees and the clock tower are individual sprites with Y-sort; walkers,
// player and wheel-zoom camera reuse the TDDemo runtime.

public static class TDTileCityBuild
{
    const int N = 64;
    const string TileDir = "Assets/Art/TDTiles";
    const string ObjDir = "Assets/Art/TDObjects";
    const string CharDir = "Assets/Art/TDArt";
    const string ScenePath = "Assets/Scenes/TopDownTileCity.unity";
    const float CamSize = 11.25f;

    static string RepoAbs(params string[] rel)
    {
        var root = Path.GetFullPath(Path.Combine(Application.dataPath, "..", ".."));
        return Path.GetFullPath(Path.Combine(root, Path.Combine(rel)));
    }

    static void EnsureDir(string rel)
    {
        string cur = "";
        foreach (var p in rel.Split('/'))
        {
            cur = cur.Length == 0 ? p : cur + "/" + p;
            if (!AssetDatabase.IsValidFolder(cur))
            {
                var parent = cur.Substring(0, cur.LastIndexOf('/'));
                var leaf = cur.Substring(cur.LastIndexOf('/') + 1);
                if (!AssetDatabase.IsValidFolder(parent)) throw new Exception("parent missing: " + parent);
                AssetDatabase.CreateFolder(parent, leaf);
            }
        }
    }

    static void ImportSprite(string path, int ppu, FilterMode fm)
    {
        AssetDatabase.ImportAsset(path);
        var imp = AssetImporter.GetAtPath(path) as TextureImporter;
        if (imp == null) throw new Exception("importer missing: " + path);
        imp.textureType = TextureImporterType.Sprite;
        imp.spriteImportMode = SpriteImportMode.Single;
        imp.spritePixelsPerUnit = ppu;
        imp.filterMode = fm;
        imp.mipmapEnabled = false;
        imp.textureCompression = TextureImporterCompression.Uncompressed;
        imp.SaveAndReimport();
    }

    static HashSet<Vector3Int> ParseCells(string line, int skip)
    {
        var set = new HashSet<Vector3Int>();
        var toks = line.Split(' ');
        for (int i = skip; i < toks.Length; i++)
        {
            if (toks[i].Length < 3) continue;
            var p = toks[i].Split(',');
            set.Add(new Vector3Int(int.Parse(p[0]), int.Parse(p[1]), 0));
        }
        return set;
    }

    static Vector3Int ParseOne(string line)
    {
        var p = line.Split(' ')[1].Split(',');
        return new Vector3Int(int.Parse(p[0]), int.Parse(p[1]), 0);
    }

    static Vector3 ParseShot(string line)
    {
        var t = line.Split(' ');
        return new Vector3(float.Parse(t[1]), float.Parse(t[2]), 0f);
    }

    static string RoadTileName(int m, bool bridge, bool ew)
    {
        if (bridge) return ew ? "bridge_H" : "bridge_V";
        switch (m)
        {
            case 0: return "road_dot";
            case 1: return "road_end_N";
            case 2: return "road_end_E";
            case 4: return "road_end_S";
            case 8: return "road_end_W";
            case 3: return "road_c_NE";
            case 6: return "road_c_SE";
            case 12: return "road_c_SW";
            case 9: return "road_c_NW";
            case 5: return "road_V";
            case 10: return "road_H";
            case 7: return "road_T_W";
            case 11: return "road_T_S";
            case 13: return "road_T_E";
            case 14: return "road_T_N";
            default: return "road_cross";
        }
    }

    // soft ellipse at the feet, offset southwest (light NE) - view discipline v1
    static void AttachShadow(GameObject host, Sprite sp, float charScale)
    {
        var go = new GameObject("Shadow");
        go.transform.SetParent(host.transform, false);
        var sr = go.AddComponent<SpriteRenderer>();
        sr.sprite = sp;
        sr.color = new Color(0f, 0f, 0f, 0.30f);
        go.transform.localScale = new Vector3(1.0f / (sp.bounds.size.x * charScale), 0.5f / (sp.bounds.size.y * charScale), 1f);
        go.transform.localPosition = new Vector3(-0.18f / charScale, -0.82f / charScale, 0f);
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
        var donePath = RepoAbs("logs", "td-tilecity-r1.done");
        var result = new Dictionary<string, string> { { "result", "PASS" } };
        try
        {
            EnsureDir("Assets/Art/TDTiles");
            EnsureDir("Assets/Art/TDObjects");
            EnsureDir("Assets/Scenes");

            // 1. layout data (organic street network + zones, python-generated)
            var dataPath = RepoAbs("Tools", "city", "td-organic-data.txt");
            if (!File.Exists(dataPath)) throw new Exception("layout data missing");
            var road = new HashSet<Vector3Int>();
            var bridges = new HashSet<Vector3Int>();
            var water = new HashSet<Vector3Int>();
            var sand = new HashSet<Vector3Int>();
            var plaza = new HashSet<Vector3Int>();
            var park = new HashSet<Vector3Int>();
            var treeCells = new HashSet<Vector3Int>();
            var starts = new List<Vector3Int>();
            var player = new Vector3Int(19, 52, 0);
            var shotPlaza = new Vector3(24.5f, 45.5f, 0f);
            var shotStreet = new Vector3(16.5f, 31.5f, 0f);
            var shotBridge = new Vector3(23.5f, 30.5f, 0f);
            foreach (var raw in File.ReadAllLines(dataPath))
            {
                var line = raw.Trim();
                if (line.StartsWith("ROAD ")) road = ParseCells(line, 1);
                else if (line.StartsWith("STARTS ")) starts = new List<Vector3Int>(ParseCells(line, 1));
                else if (line.StartsWith("PLAYER ")) player = ParseOne(line);
                else if (line.StartsWith("BRIDGES ")) bridges = ParseCells(line, 2);
                else if (line.StartsWith("WATER ")) water = ParseCells(line, 2);
                else if (line.StartsWith("SAND ")) sand = ParseCells(line, 2);
                else if (line.StartsWith("PLAZA ")) plaza = ParseCells(line, 2);
                else if (line.StartsWith("PARK ")) park = ParseCells(line, 2);
                else if (line.StartsWith("TREES ")) treeCells = ParseCells(line, 2);
                else if (line.StartsWith("SHOT_PLAZA ")) shotPlaza = ParseShot(line);
                else if (line.StartsWith("SHOT_STREET ")) shotStreet = ParseShot(line);
                else if (line.StartsWith("SHOT_BRIDGE ")) shotBridge = ParseShot(line);
            }
            if (road.Count < 300 || starts.Count != 8 || water.Count < 100)
                throw new Exception("layout data parse bad road=" + road.Count + " starts=" + starts.Count + " water=" + water.Count);

            // 2. real Tile assets from the cel tileset
            var manifest = RepoAbs("Tools", "city", "td-tileset-manifest.txt");
            if (!File.Exists(manifest)) throw new Exception("tile manifest missing");
            var tiles = new Dictionary<string, Tile>();
            foreach (var n0 in File.ReadAllLines(manifest))
            {
                var n = n0.Trim();
                if (n.Length == 0) continue;
                var png = TileDir + "/" + n + ".png";
                if (!File.Exists(Path.Combine(Application.dataPath, "Art/TDTiles", n + ".png")))
                    throw new Exception("tile png missing: " + n);
                ImportSprite(png, 32, FilterMode.Point);
                var sp = AssetDatabase.LoadAssetAtPath<Sprite>(png);
                if (sp == null) throw new Exception("tile sprite null: " + n);
                var assetPath = TileDir + "/Tile_" + n + ".asset";
                var t = AssetDatabase.LoadAssetAtPath<Tile>(assetPath);
                if (t == null)
                {
                    t = ScriptableObject.CreateInstance<Tile>();
                    AssetDatabase.CreateAsset(t, assetPath);
                }
                t.sprite = sp;
                EditorUtility.SetDirty(t);
                tiles[n] = t;
            }
            AssetDatabase.SaveAssets();
            if (tiles.Count < 25) throw new Exception("tiles incomplete: " + tiles.Count);

            // 3. object sprites (AI pieces, sliced clean)
            Func<string, Sprite> loadObj = (rel) =>
            {
                if (!File.Exists(Path.Combine(Application.dataPath, rel.Substring("Assets/".Length))))
                    throw new Exception("object missing: " + rel);
                ImportSprite(rel, 32, FilterMode.Bilinear);
                var s = AssetDatabase.LoadAssetAtPath<Sprite>(rel);
                if (s == null) throw new Exception("object sprite null: " + rel);
                return s;
            };
            var bldg = new Sprite[8];
            for (int i = 0; i < 8; i++) bldg[i] = loadObj(ObjDir + "/bldg" + i + ".png");
            var treeS = new Sprite[4];
            for (int i = 0; i < 4; i++) treeS[i] = loadObj(ObjDir + "/tree" + i + ".png");
            var towerSp = loadObj(ObjDir + "/tower0.png");
            var shadowSp = loadObj(CharDir + "/char-shadow.png");
            var chars = new Sprite[4];
            for (int i = 0; i < 4; i++) chars[i] = loadObj(CharDir + "/char" + i + ".png");

            // 4. scene: Grid -> Tilemaps (Tilemap MUST be a Grid child)
            var scene = EditorSceneManager.NewScene(NewSceneSetup.DefaultGameObjects, NewSceneMode.Single);
            var root = new GameObject("TDTILECITY");
            root.AddComponent<TDBootstrap>();

            var gridGo = new GameObject("TDT_Grid");
            gridGo.transform.SetParent(root.transform, false);
            gridGo.AddComponent<Grid>();

            var groundGo = new GameObject("Ground");
            groundGo.transform.SetParent(gridGo.transform, false);
            var ground = groundGo.AddComponent<Tilemap>();
            var groundR = groundGo.AddComponent<TilemapRenderer>();
            groundR.sortingOrder = 0;

            var roadsGo = new GameObject("TD_Roads"); // TDBootstrap derives walkable from this tilemap
            roadsGo.transform.SetParent(gridGo.transform, false);
            var roads = roadsGo.AddComponent<Tilemap>();
            var roadsR = roadsGo.AddComponent<TilemapRenderer>();
            roadsR.sortingOrder = 1;

            // 5. paint ground cell by cell
            int painted = 0;
            for (int x = 0; x < N; x++)
            {
                for (int y = 0; y < N; y++)
                {
                    var c = new Vector3Int(x, y, 0);
                    string g;
                    if (water.Contains(c)) g = ((x + y) & 1) == 0 ? "water1" : "water2";
                    else if (sand.Contains(c)) g = "sand";
                    else if (plaza.Contains(c)) g = "plaza";
                    else if (park.Contains(c)) g = "parkgrass";
                    else g = ((x * 7 + y * 13) & 1) == 0 ? "grass1" : "grass2";
                    ground.SetTile(c, tiles[g]);
                    painted++;
                }
            }

            // 6. paint roads with neighbor-mask autotiles (bridges over water)
            int roadPainted = 0;
            foreach (var c in road)
            {
                int m = 0;
                if (road.Contains(new Vector3Int(c.x, c.y + 1, 0))) m |= 1;
                if (road.Contains(new Vector3Int(c.x + 1, c.y, 0))) m |= 2;
                if (road.Contains(new Vector3Int(c.x, c.y - 1, 0))) m |= 4;
                if (road.Contains(new Vector3Int(c.x - 1, c.y, 0))) m |= 8;
                bool ew = (m & 2) != 0 || (m & 8) != 0;
                roads.SetTile(c, tiles[RoadTileName(m, bridges.Contains(c), ew)]);
                roadPainted++;
            }

            // 7. buildings on street-front land (Y-sorted sprite objects)
            var blocked = new HashSet<Vector3Int>(water);
            blocked.UnionWith(road);
            blocked.UnionWith(plaza);
            blocked.UnionWith(park);
            var cands = new List<Vector3Int>();
            for (int x = 0; x < N; x++)
                for (int y = 0; y < N; y++)
                {
                    var c = new Vector3Int(x, y, 0);
                    if (blocked.Contains(c)) continue;
                    bool nearRoad = false;
                    for (int dx = -2; dx <= 2 && !nearRoad; dx++)
                        for (int dy = -2; dy <= 2 && !nearRoad; dy++)
                            if (road.Contains(new Vector3Int(x + dx, y + dy, 0))) { nearRoad = true; break; }
                    if (nearRoad) cands.Add(c);
                }
            var rng = new System.Random(20260928);
            for (int i = cands.Count - 1; i > 0; i--)
            {
                int j = rng.Next(i + 1);
                var tmp = cands[i]; cands[i] = cands[j]; cands[j] = tmp;
            }
            var used = new HashSet<Vector3Int>();
            int bldgPlaced = 0;
            foreach (var c in cands)
            {
                if (bldgPlaced >= 130) break;
                // 3x3 footprint must be free land; anchors end up >=3 apart (1-cell alleys)
                bool ok = true;
                for (int dx = -1; dx <= 1 && ok; dx++)
                    for (int dy = -1; dy <= 1 && ok; dy++)
                    {
                        var f = new Vector3Int(c.x + dx, c.y + dy, 0);
                        if (f.x < 0 || f.y < 0 || f.x >= N || f.y >= N || blocked.Contains(f) || used.Contains(f)) ok = false;
                    }
                if (!ok) continue;
                for (int dx = -1; dx <= 1; dx++)
                    for (int dy = -1; dy <= 1; dy++)
                        used.Add(new Vector3Int(c.x + dx, c.y + dy, 0));
                var go = new GameObject("Bldg" + bldgPlaced);
                go.transform.SetParent(root.transform, false);
                var sr = go.AddComponent<SpriteRenderer>();
                var sp0 = bldg[bldgPlaced % 8];
                sr.sprite = sp0;
                float jit = 0.9f + 0.25f * (float)rng.NextDouble();
                float scale = (2.7f * jit) / sp0.bounds.size.y;
                go.transform.localScale = new Vector3(scale, scale, 1f);
                go.transform.position = new Vector3(c.x + 0.5f, c.y + 1.3f, 0f);
                sr.sortingOrder = 512 - c.y;
                bldgPlaced++;
            }

            // 8. trees (data cells + park fill) and clock tower
            int treePlaced = 0;
            Action<Vector3Int> placeTree = (c) =>
            {
                var go = new GameObject("Tree" + treePlaced);
                go.transform.SetParent(root.transform, false);
                var sr = go.AddComponent<SpriteRenderer>();
                var sp0 = treeS[treePlaced % 4];
                sr.sprite = sp0;
                float jit = 0.85f + 0.3f * (float)rng.NextDouble();
                float scale = (1.5f * jit) / sp0.bounds.size.y;
                go.transform.localScale = new Vector3(scale, scale, 1f);
                go.transform.position = new Vector3(c.x + 0.5f, c.y + 0.95f, 0f);
                sr.sortingOrder = 512 - c.y;
                treePlaced++;
            };
            var treeArr = new List<Vector3Int>(treeCells);
            treeArr.Sort((a, b) => (a.x * 64 + a.y).CompareTo(b.x * 64 + b.y));
            foreach (var c in treeArr) placeTree(c);
            var parkArr = new List<Vector3Int>(park);
            parkArr.Sort((a, b) => (a.x * 64 + a.y).CompareTo(b.x * 64 + b.y));
            int pk = 0;
            foreach (var c in parkArr)
            {
                if ((pk++ & 1) == 0) placeTree(c);
            }

            var tw = new GameObject("ClockTower");
            tw.transform.SetParent(root.transform, false);
            var tsr = tw.AddComponent<SpriteRenderer>();
            tsr.sprite = towerSp;
            float ts = 4.3f / towerSp.bounds.size.y;
            tw.transform.localScale = new Vector3(ts, ts, 1f);
            tw.transform.position = new Vector3(24.5f, 46.6f, 0f);
            tsr.sortingOrder = 512 - 44;

            // 9. walkers + player (reuse TDDemo runtime, wheel-zoom camera)
            var walkable = road;
            var wObjs = new List<GameObject>();
            var wPaths = new List<List<Vector3Int>>();
            for (int i = 0; i < starts.Count; i++)
            {
                var go = new GameObject("TD_Walker" + i);
                go.transform.SetParent(root.transform, false);
                var sr = go.AddComponent<SpriteRenderer>();
                sr.sprite = chars[i % 4];
                var ch = chars[i % 4].bounds.size.y;
                var sc = 1.8f / ch;
                go.transform.localScale = new Vector3(sc, sc, 1f);
                AttachShadow(go, shadowSp, sc);
                var w = go.AddComponent<TDWalker>();
                w.startCell = starts[i];
                w.seed = i * 7 + 3;
                w.speed = 2.0f;
                go.transform.position = TDWalkLib.CellCenter(starts[i]);
                wObjs.Add(go);
            }
            var pgo = new GameObject("TD_Player");
            pgo.transform.SetParent(root.transform, false);
            var psr = pgo.AddComponent<SpriteRenderer>();
            psr.sprite = chars[3];
            var ph = chars[3].bounds.size.y;
            var psc = 1.8f / ph;
            pgo.transform.localScale = new Vector3(psc, psc, 1f);
            AttachShadow(pgo, shadowSp, psc);
            pgo.AddComponent<TDPlayer>();
            pgo.transform.position = TDWalkLib.CellCenter(player);

            // 10. camera
            var camGo = GameObject.Find("Main Camera");
            var cam = camGo != null ? camGo.GetComponent<Camera>() : null;
            if (cam == null) throw new Exception("main camera missing");
            cam.orthographic = true;
            cam.orthographicSize = CamSize;
            cam.clearFlags = CameraClearFlags.SolidColor;
            cam.backgroundColor = new Color32(46, 52, 50, 255);
            cam.transform.position = new Vector3(20f, 46f, -10f);

            if (!EditorSceneManager.SaveScene(scene, ScenePath)) throw new Exception("scene save failed");

            // 11. six proof shots (batch cam.aspect unreliable -> explicit 1920/1080 clamp)
            Func<float, float, float, Vector3> shotPos = (x, y, size) => new Vector3(
                Mathf.Clamp(x, size * (1920f / 1080f), (float)N - size * (1920f / 1080f)),
                Mathf.Clamp(y, size, (float)N - size), -10f);
            for (int i = 0; i < wObjs.Count; i++)
            {
                Vector3Int to;
                int g = 0;
                do { var arr = new List<Vector3Int>(walkable); to = arr[rng.Next(arr.Count)]; g++; } while (to == starts[i] && g < 20);
                var path = TDWalkLib.Path(walkable, starts[i], to);
                if (path.Count < 2) path = new List<Vector3Int> { starts[i] };
                wPaths.Add(path);
            }
            float[] t0 = { 0f, 1.7f, 3.4f, 5.1f, 6.8f, 8.5f, 10.2f, 11.9f };
            for (int i = 0; i < wObjs.Count; i++) wObjs[i].transform.position = TDWalkLib.PosAt(wPaths[i], t0[i]);

            var dir = RepoAbs("docs", "design");
            if (!Directory.Exists(dir)) throw new Exception("docs/design missing");

            string s1 = Path.Combine(dir, "td-t1-1-street.png");
            cam.orthographicSize = CamSize;
            cam.transform.position = shotPos(shotStreet.x, shotStreet.y, CamSize);
            Shot(cam, 1920, 1080, s1);

            string s2 = Path.Combine(dir, "td-t1-2-plaza.png");
            for (int i = 0; i < wObjs.Count; i++) wObjs[i].transform.position = TDWalkLib.PosAt(wPaths[i], t0[i] + 6f);
            cam.transform.position = shotPos(shotPlaza.x, shotPlaza.y, CamSize);
            Shot(cam, 1920, 1080, s2);

            string s3 = Path.Combine(dir, "td-t1-3-bridge.png");
            for (int i = 0; i < wObjs.Count; i++) wObjs[i].transform.position = TDWalkLib.PosAt(wPaths[i], t0[i]);
            cam.transform.position = shotPos(shotBridge.x, shotBridge.y, CamSize);
            Shot(cam, 1920, 1080, s3);

            string s4 = Path.Combine(dir, "td-t1-4-overview.png");
            cam.orthographicSize = 32f;
            cam.transform.position = new Vector3(32f, 32f, -10f);
            Shot(cam, 3072, 3072, s4);

            string s5 = Path.Combine(dir, "td-t1-5-zoom-near.png");
            var ppos = pgo.transform.position;
            cam.orthographicSize = 4.5f;
            cam.transform.position = shotPos(ppos.x, ppos.y, 4.5f);
            Shot(cam, 1920, 1080, s5);

            string s6 = Path.Combine(dir, "td-t1-6-zoom-far.png");
            cam.orthographicSize = 18f;
            cam.transform.position = shotPos(ppos.x, ppos.y, 18f);
            Shot(cam, 1920, 1080, s6);
            cam.orthographicSize = CamSize;

            for (int i = 0; i < wObjs.Count; i++) wObjs[i].transform.position = TDWalkLib.CellCenter(starts[i]);

            // 12. proof
            result["groundTiles"] = painted.ToString();
            result["roadTiles"] = roadPainted.ToString();
            result["tileAssets"] = tiles.Count.ToString();
            result["buildings"] = bldgPlaced.ToString();
            result["trees"] = treePlaced.ToString();
            result["walkableCells"] = walkable.Count.ToString();
            foreach (var s in new[] { s1, s2, s3, s4, s5, s6 })
            {
                var fi = new FileInfo(s);
                if (!fi.Exists || fi.Length < 20000) throw new Exception("shot too small/missing: " + s);
                result["shot_" + Path.GetFileName(s)] = fi.Length.ToString();
            }
            if (bldgPlaced < 60) throw new Exception("too few buildings: " + bldgPlaced);
            File.WriteAllText(donePath, Json(result));
            Debug.Log("TDTILECITY R1 PASS ground=" + painted + " roads=" + roadPainted + " bldg=" + bldgPlaced + " trees=" + treePlaced);
        }
        catch (Exception e)
        {
            var msg = e.Message.Replace("\"", "'").Replace("\r", " ").Replace("\n", " ");
            result["result"] = "FAIL";
            result["error"] = msg;
            File.WriteAllText(donePath, Json(result));
            Debug.LogError("TDTILECITY R1 FAIL: " + msg);
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
