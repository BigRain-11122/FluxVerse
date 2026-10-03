using System;
using System.Collections.Generic;
using System.IO;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine;
using UnityEngine.SceneManagement;
using UnityEngine.Tilemaps;

// Quality sample (CEO order 2026-09-28 ~15:3x, ledger P-2026-09-28-10):
// twin 32x32 blocks, left = current baseline techniques, right = research-wave
// quality prescriptions (shore foam/wet rings, clustered trees with contact
// shadows, calmer solid-road markings, dusk multiply tint + window lights).
// Deterministic (seeded like TDTileCityBuild), Built-in pipeline only.

public static class TDQualitySampleBuild
{
    const int BW = 32;          // block width/height
    const int GAP = 2;          // divider between blocks
    const int H = 32;
    const int RIGHT_X = BW + GAP; // 34
    const string TileDir = "Assets/Art/TDTiles";
    const string ObjDir = "Assets/Art/TDObjects";
    const string CharDir = "Assets/Art/TDArt";
    const string ScenePath = "Assets/Scenes/TDQualitySample.unity";

    static string RepoAbs(params string[] rel)
    {
        var root = Path.GetFullPath(Path.Combine(Application.dataPath, "..", ".."));
        return Path.GetFullPath(Path.Combine(root, Path.Combine(rel)));
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

    static int WaterCenter(int xLocal)
    {
        return 8 + (int)Math.Round(2.0 * Math.Sin(xLocal / 4.5));
    }

    static int RoadX(int yLocal)
    {
        return 16 + (int)Math.Round(3.0 * Math.Sin(yLocal / 3.5));
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

    static string SolidRoadName(int m)
    {
        switch (m)
        {
            case 5: return "roadS_V";
            case 10: return "roadS_H";
            case 15: return "roadS_cross";
            case 3: return "roadS_c_NE";
            default: return null; // fall back to base tile
        }
    }

    static string CornerSuffix(bool n, bool e, bool s, bool w)
    {
        if (n && e) return "c_NE";
        if (n && w) return "c_NW";
        if (s && e) return "c_SE";
        if (s && w) return "c_SW";
        return null;
    }

    static void AttachGroundShadow(GameObject host)
    {
        var sp = AssetDatabase.LoadAssetAtPath<Sprite>(CharDir + "/char-shadow.png");
        if (sp == null) throw new Exception("char-shadow sprite missing");
        var go = new GameObject("Shadow");
        go.transform.SetParent(host.transform, false);
        var sr = go.AddComponent<SpriteRenderer>();
        sr.sprite = sp;
        sr.color = new Color(0f, 0f, 0f, 0.40f);
        sr.sortingOrder = 5; // above Ground(0)/Roads(1), below all actors
        float s = 1.2f / sp.bounds.size.x;
        go.transform.localScale = new Vector3(s, s * 0.62f, 1f);
        go.transform.localPosition = new Vector3(0.08f, -0.40f, 0f);
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
        var donePath = RepoAbs("logs", "td-quality-sample.done");
        var result = new Dictionary<string, string> { { "result", "FAIL" } };
        try
        {
            // ---- 1. tiles: base manifest + quality manifest -> real Tile assets ----
            var tiles = new Dictionary<string, Tile>();
            Action<string> loadManifest = (manifestRel) =>
            {
                var path = RepoAbs("Tools", "city", manifestRel);
                if (!File.Exists(path)) throw new Exception("manifest missing: " + manifestRel);
                foreach (var n0 in File.ReadAllLines(path))
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
            };
            loadManifest("td-tileset-manifest.txt");
            loadManifest("td-quality-manifest.txt");
            AssetDatabase.SaveAssets();
            if (tiles.Count < 45) throw new Exception("tiles incomplete: " + tiles.Count);

            // ---- 2. object/fx sprites ----
            Func<string, int, FilterMode, Sprite> loadSprite = (rel, ppu, fm) =>
            {
                if (!File.Exists(Path.Combine(Application.dataPath, rel.Substring("Assets/".Length))))
                    throw new Exception("sprite missing: " + rel);
                ImportSprite(rel, ppu, fm);
                var s = AssetDatabase.LoadAssetAtPath<Sprite>(rel);
                if (s == null) throw new Exception("sprite null: " + rel);
                return s;
            };
            var bldg = new Sprite[8];
            for (int i = 0; i < 8; i++) bldg[i] = loadSprite(ObjDir + "/bldg" + i + ".png", 32, FilterMode.Bilinear);
            var treeS = new Sprite[4];
            for (int i = 0; i < 4; i++) treeS[i] = loadSprite(ObjDir + "/tree" + i + ".png", 32, FilterMode.Bilinear);
            var towerSp = loadSprite(ObjDir + "/tower0.png", 32, FilterMode.Bilinear);
            var winSp = loadSprite(TileDir + "/winlight.png", 32, FilterMode.Bilinear);
            var glowMag = loadSprite(TileDir + "/glow_magenta.png", 32, FilterMode.Bilinear);
            var glowCyn = loadSprite(TileDir + "/glow_cyan.png", 32, FilterMode.Bilinear);
            var tintSp = loadSprite(TileDir + "/tint_white.png", 32, FilterMode.Point);
            var tintShader = Shader.Find("Flux/TintMultiply");
            if (tintShader == null) throw new Exception("Flux/TintMultiply shader missing");
            var addShader = Shader.Find("Legacy Shaders/Particles/Additive");
            if (addShader == null) throw new Exception("Legacy additive shader missing");

            // ---- 3. layout sets (identical twins; right block gets quality painting) ----
            var water = new HashSet<Vector3Int>();
            var sand = new HashSet<Vector3Int>();
            var road = new HashSet<Vector3Int>();
            var plaza = new HashSet<Vector3Int>();
            foreach (var ox in new[] { 0, RIGHT_X })
            {
                for (int x = 0; x < BW; x++)
                {
                    int yc = WaterCenter(x);
                    for (int y = yc - 1; y <= yc + 1; y++) water.Add(new Vector3Int(ox + x, y, 0));
                    sand.Add(new Vector3Int(ox + x, yc - 2, 0));
                    sand.Add(new Vector3Int(ox + x, yc + 2, 0));
                }
                for (int y = 0; y < H - 1; y++)
                {
                    int x = RoadX(y);
                    road.Add(new Vector3Int(ox + x, y, 0));
                    int x2 = RoadX(y + 1);
                    if (x2 > x) for (int k = x + 1; k <= x2; k++) road.Add(new Vector3Int(ox + k, y, 0));
                    else if (x2 < x) for (int k = x - 1; k >= x2; k--) road.Add(new Vector3Int(ox + k, y, 0));
                }
                int xr = RoadX(H - 1);
                road.Add(new Vector3Int(ox + xr, H - 1, 0));
                for (int px = 23; px <= 27; px++)
                    for (int py = 20; py <= 24; py++)
                        plaza.Add(new Vector3Int(ox + px, py, 0));
            }

            bool IsLand(Vector3Int c) { return !water.Contains(c); }
            bool IsWater(Vector3Int c) { return water.Contains(c); }

            // ---- 4. scene + grid layers (Tilemap MUST be Grid child) ----
            var scene = EditorSceneManager.NewScene(NewSceneSetup.DefaultGameObjects, NewSceneMode.Single);
            var root = new GameObject("TDQUALITY");
            var gridGo = new GameObject("TQ_Grid");
            gridGo.transform.SetParent(root.transform, false);
            gridGo.AddComponent<Grid>();

            var groundGo = new GameObject("Ground");
            groundGo.transform.SetParent(gridGo.transform, false);
            var ground = groundGo.AddComponent<Tilemap>();
            groundGo.AddComponent<TilemapRenderer>().sortingOrder = 0;

            var roadsGo = new GameObject("TD_Roads");
            roadsGo.transform.SetParent(gridGo.transform, false);
            var roads = roadsGo.AddComponent<Tilemap>();
            roadsGo.AddComponent<TilemapRenderer>().sortingOrder = 1;

            // ---- 5. paint ground: baseline left, quality right (shore rings) ----
            int foamUsed = 0, wetUsed = 0;
            for (int x = 0; x < 2 * BW + GAP; x++)
            {
                for (int y = 0; y < H; y++)
                {
                    var c = new Vector3Int(x, y, 0);
                    bool quality = x >= RIGHT_X;
                    if (water.Contains(c))
                    {
                        string g;
                        if (quality)
                        {
                            bool n = IsLand(new Vector3Int(x, y + 1, 0)) && y + 1 < H || (y + 1 >= H);
                            bool s = (y - 1 >= 0) && IsLand(new Vector3Int(x, y - 1, 0)) || (y - 1 < 0);
                            bool e = IsLand(new Vector3Int(x + 1, y, 0));
                            bool w = x - 1 >= 0 && IsLand(new Vector3Int(x - 1, y, 0));
                            int dirs = (n ? 1 : 0) + (s ? 1 : 0) + (e ? 1 : 0) + (w ? 1 : 0);
                            if (dirs == 0) g = ((x + y) & 1) == 0 ? "water1" : "water2";
                            else if (dirs == 1) g = n ? "foam_N" : s ? "foam_S" : e ? "foam_E" : "foam_W";
                            else
                            {
                                var cs = CornerSuffix(n, e, s, w);
                                g = cs != null ? "foam_" + cs : (((x + y) & 1) == 0 ? "water1" : "water2");
                            }
                            if (g.StartsWith("foam")) foamUsed++;
                        }
                        else g = ((x + y) & 1) == 0 ? "water1" : "water2";
                        ground.SetTile(c, tiles[g]);
                    }
                    else if (sand.Contains(c))
                    {
                        string g;
                        if (quality)
                        {
                            bool n = (y + 1 < H) && IsWater(new Vector3Int(x, y + 1, 0));
                            bool s = (y - 1 >= 0) && IsWater(new Vector3Int(x, y - 1, 0));
                            bool e = IsWater(new Vector3Int(x + 1, y, 0));
                            bool w = (x - 1 >= 0) && IsWater(new Vector3Int(x - 1, y, 0));
                            int dirs = (n ? 1 : 0) + (s ? 1 : 0) + (e ? 1 : 0) + (w ? 1 : 0);
                            if (dirs == 0) g = "sand";
                            else if (dirs == 1) g = n ? "wet_N" : s ? "wet_S" : e ? "wet_E" : "wet_W";
                            else
                            {
                                var cs = CornerSuffix(n, e, s, w);
                                g = cs != null ? "wet_" + cs : "sand";
                            }
                            if (g.StartsWith("wet")) wetUsed++;
                        }
                        else g = "sand";
                        ground.SetTile(c, tiles[g]);
                    }
                    else if (plaza.Contains(c)) ground.SetTile(c, tiles["plaza"]);
                    else ground.SetTile(c, tiles[((x * 7 + y * 13) & 1) == 0 ? "grass1" : "grass2"]);
                }
            }

            // ---- 6. roads: baseline dashed left, solid-calmer right, bridges over water ----
            int solidUsed = 0;
            foreach (var c in road)
            {
                int m = 0;
                if (road.Contains(new Vector3Int(c.x, c.y + 1, 0))) m |= 1;
                if (road.Contains(new Vector3Int(c.x + 1, c.y, 0))) m |= 2;
                if (road.Contains(new Vector3Int(c.x, c.y - 1, 0))) m |= 4;
                if (road.Contains(new Vector3Int(c.x - 1, c.y, 0))) m |= 8;
                bool ew = (m & 2) != 0 || (m & 8) != 0;
                bool bridge = water.Contains(c);
                string name = RoadTileName(m, bridge, ew);
                bool quality = c.x >= RIGHT_X;
                if (quality && !bridge)
                {
                    var solid = SolidRoadName(m);
                    if (solid != null) { name = solid; solidUsed++; }
                }
                roads.SetTile(c, tiles[name]);
            }

            // ---- 7. trees: left = lone singles (incl. the waterfront flaw), right = clusters + shadows ----
            int treePlaced = 0;
            Action<Vector3Int, bool> placeTree = (c, withShadow) =>
            {
                var go = new GameObject("Tree" + treePlaced);
                go.transform.SetParent(root.transform, false);
                var sr = go.AddComponent<SpriteRenderer>();
                var sp0 = treeS[treePlaced % 4];
                sr.sprite = sp0;
                float scale = 1.5f / sp0.bounds.size.y;
                go.transform.localScale = new Vector3(scale, scale, 1f);
                go.transform.position = new Vector3(c.x + 0.5f, c.y + 0.95f, 0f);
                sr.sortingOrder = 512 - c.y;
                if (withShadow) AttachGroundShadow(go);
                treePlaced++;
            };
            // baseline singles (left block); (14,10) sits ON the sand touching water = the flaw
            var flawC = new Vector3Int(14, WaterCenter(14) + 2, 0);
            foreach (var c in new[] { new Vector3Int(4, 26, 0), new Vector3Int(10, 20, 0),
                     new Vector3Int(15, 4, 0), new Vector3Int(24, 28, 0), new Vector3Int(28, 12, 0), flawC })
                placeTree(c, false);
            // quality clusters (right block, all >=3 cells from water)
            foreach (var c in new[] { new Vector3Int(RIGHT_X + 6, 24, 0), new Vector3Int(RIGHT_X + 7, 25, 0),
                     new Vector3Int(RIGHT_X + 6, 26, 0), new Vector3Int(RIGHT_X + 8, 25, 0),
                     new Vector3Int(RIGHT_X + 12, 29, 0), new Vector3Int(RIGHT_X + 16, 2, 0),
                     new Vector3Int(RIGHT_X + 25, 16, 0) })
                placeTree(c, true);

            // ---- 8. buildings: left 2 plain; right 3 with window lights + one sign glow ----
            var rng = new System.Random(20260928);
            Func<Vector3Int, bool, Vector3> placeBldg = (anchor, quality) =>
            {
                var c = anchor;
                for (int attempt = 0; attempt < 8; attempt++)
                {
                    bool ok = true;
                    for (int dx = -1; dx <= 1 && ok; dx++)
                        for (int dy = -1; dy <= 1 && ok; dy++)
                        {
                            var f = new Vector3Int(c.x + dx, c.y + dy, 0);
                            if (water.Contains(f) || sand.Contains(f) || road.Contains(f) || plaza.Contains(f)) ok = false;
                        }
                    if (ok) break;
                    c = new Vector3Int(c.x + 2, c.y, 0);
                }
                var go = new GameObject("Bldg" + c.x);
                go.transform.SetParent(root.transform, false);
                var sr = go.AddComponent<SpriteRenderer>();
                var sp0 = bldg[(c.x / 2) % 8];
                sr.sprite = sp0;
                float scale = (2.7f * (0.95f + 0.2f * (float)rng.NextDouble())) / sp0.bounds.size.y;
                go.transform.localScale = new Vector3(scale, scale, 1f);
                var pos = new Vector3(c.x + 0.5f, c.y + 1.3f, 0f);
                go.transform.position = pos;
                int order = 512 - c.y;
                sr.sortingOrder = order;
                if (quality)
                {
                    var winMat = new Material(addShader);
                    Action<float, float> addWin = (ox, oy) =>
                    {
                        var wg = new GameObject("WinLight");
                        wg.transform.SetParent(root.transform, false);
                        var wr = wg.AddComponent<SpriteRenderer>();
                        wr.sprite = winSp;
                        wr.material = winMat;
                        wr.color = new Color(1f, 1f, 1f, 1f);
                        wg.transform.localScale = new Vector3(1.15f, 1.15f, 1f);
                        wg.transform.position = new Vector3(pos.x + ox, pos.y + oy, 0f);
                        wr.sortingOrder = order + 1;
                    };
                    addWin(-0.45f, 0.55f);
                    addWin(0.35f, 0.75f);
                    addWin(0.0f, 0.25f);
                }
                return pos;
            };
            placeBldg(new Vector3Int(4, 18, 0), false);
            placeBldg(new Vector3Int(19, 18, 0), false);
            var b1 = placeBldg(new Vector3Int(RIGHT_X + 4, 18, 0), true);
            placeBldg(new Vector3Int(RIGHT_X + 10, 18, 0), true);
            placeBldg(new Vector3Int(RIGHT_X + 24, 18, 0), true);

            // sign glow above right-block building 1; cyan glow at the plaza tower
            var glowMat = new Material(addShader);
            Action<Sprite, Vector3, float, int> addGlow = (sp, p, sc, order) =>
            {
                var g = new GameObject("Glow");
                g.transform.SetParent(root.transform, false);
                var gr = g.AddComponent<SpriteRenderer>();
                gr.sprite = sp;
                gr.material = glowMat;
                gr.color = new Color(1f, 1f, 1f, 0.9f);
                g.transform.localScale = new Vector3(sc, sc, 1f);
                g.transform.position = p;
                gr.sortingOrder = order;
            };
            addGlow(glowMag, new Vector3(b1.x + 0.7f, b1.y + 1.9f, 0f), 2.0f, 513);

            var towerGo = new GameObject("Tower");
            towerGo.transform.SetParent(root.transform, false);
            var tr = towerGo.AddComponent<SpriteRenderer>();
            tr.sprite = towerSp;
            float ts = 1.9f / towerSp.bounds.size.y;
            towerGo.transform.localScale = new Vector3(ts, ts, 1f);
            var tpos = new Vector3(RIGHT_X + 25.5f, 22.95f, 0f);
            towerGo.transform.position = tpos;
            tr.sortingOrder = 512 - 22;
            addGlow(glowCyn, new Vector3(tpos.x, tpos.y + 0.9f, 0f), 1.6f, 512 - 22 + 2);

            // ---- 9. dusk tint (multiply, full-frame) ----
            var tintGo = new GameObject("DuskTint");
            tintGo.transform.SetParent(root.transform, false);
            var tintR = tintGo.AddComponent<SpriteRenderer>();
            tintR.sprite = tintSp;
            tintR.material = new Material(tintShader);
            tintR.color = new Color(0.95f, 0.70f, 0.62f, 1f); // warm gold dusk multiply
            tintR.sortingOrder = 2000;
            tintGo.SetActive(false);

            // ---- 10. camera + four registered shots ----
            var cam = Camera.main;
            if (cam == null) throw new Exception("main camera missing");
            cam.orthographic = true;
            cam.backgroundColor = new Color(0.10f, 0.11f, 0.15f, 1f);
            cam.transform.position = new Vector3(0, 0, -10f);
            var designDir = RepoAbs("docs", "design");
            Directory.CreateDirectory(designDir);

            Action<float, float, float, string> frame = (cx, cy, size, file) =>
            {
                cam.transform.position = new Vector3(cx, cy, -10f);
                cam.orthographicSize = size;
                float w = size * 2f * (16f / 9f), h = size * 2f;
                tintGo.transform.position = new Vector3(cx, cy, 0f);
                tintGo.transform.localScale = new Vector3(w / tintSp.bounds.size.x, h / tintSp.bounds.size.y, 1f);
                Shot(cam, 1280, 720, Path.Combine(designDir, file));
            };

            frame(33f, 16.5f, 19f, "td-qs-1-day.png");          // both blocks, day
            frame(46f, 9.5f, 5f, "td-qs-5-shore.png");          // near: right-block shore rings, day
            tintGo.SetActive(true);                              // dusk frames
            frame(33f, 16.5f, 19f, "td-qs-2-dusk.png");          // both blocks, dusk
            frame(42f, 19f, 6f, "td-qs-6-lights.png");           // near dusk: window lights + glows
            tintGo.SetActive(false);
            frame(RoadX(17) + 0.5f, 17f, 18f, "td-qs-3-far-base.png");      // baseline road, far zoom
            frame(RIGHT_X + RoadX(17) + 0.5f, 17f, 18f, "td-qs-4-far-quality.png"); // solid road, far zoom

            // ---- 11. save + sentinel ----
            if (!EditorSceneManager.SaveScene(scene, ScenePath)) throw new Exception("scene save failed");
            result["result"] = "PASS";
            result["tiles"] = "" + tiles.Count;
            result["foam"] = "" + foamUsed;
            result["wet"] = "" + wetUsed;
            result["solidRoad"] = "" + solidUsed;
            result["trees"] = "" + treePlaced;
            var sum = new List<string>();
            foreach (var kv in result) sum.Add(kv.Key + "=" + kv.Value);
            Debug.Log("TDQS_BUILD_OK " + string.Join(" ", sum));
        }
        catch (Exception ex)
        {
            result["error"] = ex.Message;
            Debug.LogError("TDQS_BUILD_FAIL " + ex.Message);
            throw;
        }
        finally
        {
            var lines = new List<string>();
            foreach (var kv in result) lines.Add(kv.Key + "=" + kv.Value);
            File.WriteAllLines(donePath, lines);
        }
    }
}
