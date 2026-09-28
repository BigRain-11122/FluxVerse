using System;
using System.Collections.Generic;
using System.IO;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine;
using UnityEngine.SceneManagement;

// CEO direct order 2026-09-28 (style pivot): anime repaint build.
// Base map = img2img repainted 64x64 city map (one big sprite, layout locked
// from the v5 pixel map); walkers/player = cut from a 4-character anime sheet.
// Road grid is DATA ONLY (TDWalkLib.RoadCells) - no tilemaps.

public static class TDAnimeBuild
{
    const int N = 64;
    const string ArtDir = "Assets/Art/TDArt";
    const string MapPng = "Assets/Art/TDArt/anime-map.png";
    const string CharPng = "Assets/Art/TDArt/anime-chars.png";
    const string ScenePath = "Assets/Scenes/TopDownDemo.unity";
    const float CamSize = 11.25f;

    static string RepoAbs(params string[] rel)
    {
        var root = Path.GetFullPath(Path.Combine(Application.dataPath, "..", ".."));
        return Path.GetFullPath(Path.Combine(root, Path.Combine(rel)));
    }

    static void EnsureDir()
    {
        if (!AssetDatabase.IsValidFolder(ArtDir))
        {
            if (!AssetDatabase.IsValidFolder("Assets/Art/TDArt"))
                if (!AssetDatabase.IsValidFolder("Assets/Art")) throw new Exception("Assets/Art missing");
            AssetDatabase.CreateFolder("Assets/Art", "TDArt");
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

    // cut one character out of a 4-in-a-row sheet via raw LoadImage (no meta churn)
    static Sprite CutChar(int idx)
    {
        string srcAbs = Path.Combine(Application.dataPath, "Art/TDArt/anime-chars.png");
        if (!File.Exists(srcAbs)) throw new Exception("char sheet missing");
        var sheet = new Texture2D(2, 2);
        if (!sheet.LoadImage(File.ReadAllBytes(srcAbs))) throw new Exception("LoadImage failed chars");
        int fw = sheet.width / 4;
        int inset = 40; // limbs sit near cell boundaries (multimodal check note)
        int sx = idx * fw + (idx == 0 ? 0 : inset);
        int sw = fw - ((idx == 0 ? 0 : inset) + (idx == 3 ? 0 : inset));
        var frame = new Texture2D(sw, sheet.height, TextureFormat.RGBA32, false);
        frame.SetPixels(sheet.GetPixels(sx, 0, sw, sheet.height));
        frame.Apply();
        string outRel = ArtDir + "/char" + idx + ".png";
        File.WriteAllBytes(Path.Combine(Application.dataPath, "Art/TDArt/char" + idx + ".png"), ImageConversion.EncodeToPNG(frame));
        UnityEngine.Object.DestroyImmediate(sheet);
        UnityEngine.Object.DestroyImmediate(frame);
        ImportSprite(outRel, 24, FilterMode.Bilinear);
        var sp = AssetDatabase.LoadAssetAtPath<Sprite>(outRel);
        if (sp == null) throw new Exception("readback fail char" + idx);
        return sp;
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
        var donePath = RepoAbs("logs", "td-anime-r1.done");
        var result = new Dictionary<string, string> { { "result", "PASS" } };
        try
        {
            EnsureDir();
            if (!File.Exists(Path.Combine(Application.dataPath, "Art/TDArt/anime-map.png"))) throw new Exception("anime-map.png not downloaded yet");

            var scene = EditorSceneManager.NewScene(NewSceneSetup.DefaultGameObjects, NewSceneMode.Single);
            var root = new GameObject("TDANIME");
            root.AddComponent<TDBootstrap>();

            // 1. base map: one sprite covering exactly 64x64 world units
            ImportSprite(MapPng, 32, FilterMode.Bilinear); // 2048px / 64u = 32
            var mapSp = AssetDatabase.LoadAssetAtPath<Sprite>(MapPng);
            if (mapSp == null) throw new Exception("map sprite null");
            var mapGo = new GameObject("TD_MapBase");
            mapGo.transform.SetParent(root.transform, false);
            var msr = mapGo.AddComponent<SpriteRenderer>();
            msr.sprite = mapSp;
            msr.sortingOrder = 0;
            // sprite pivot center: place so the map spans (0,0)-(64,64)
            if (Math.Abs(mapSp.bounds.size.x - N) > 0.25f || Math.Abs(mapSp.bounds.size.y - N) > 0.25f)
                throw new Exception("map bounds not 64x64: " + mapSp.bounds.size);
            mapGo.transform.position = new Vector3(N / 2f, N / 2f, 0f);

            // 2. characters
            var chars = new Sprite[4];
            for (int i = 0; i < 4; i++) chars[i] = CutChar(i);

            // 3. walkers (8, two per character variant) + player
            var walkable = TDWalkLib.RoadCells();
            var starts = new[]
            {
                new Vector3Int(3, 14, 0), new Vector3Int(20, 46, 0), new Vector3Int(13, 30, 0), new Vector3Int(54, 20, 0),
                new Vector3Int(30, 14, 0), new Vector3Int(48, 47, 0), new Vector3Int(13, 58, 0), new Vector3Int(60, 46, 0),
            };
            var rng = new System.Random(20260928);
            var wObjs = new List<GameObject>();
            var wPaths = new List<List<Vector3Int>>();
            for (int i = 0; i < starts.Length; i++)
            {
                var go = new GameObject("TD_Walker" + i);
                go.transform.SetParent(root.transform, false);
                var sr = go.AddComponent<SpriteRenderer>();
                sr.sprite = chars[i % 4];
                sr.sortingOrder = 6;
                var ch = chars[i % 4].bounds.size.y; // full-body illustration: fit to 1.8u
                if (ch > 0.001f) go.transform.localScale = new Vector3(1.8f / ch, 1.8f / ch, 1f);
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
            psr.sortingOrder = 7;
            var ph = chars[3].bounds.size.y;
            if (ph > 0.001f) pgo.transform.localScale = new Vector3(1.8f / ph, 1.8f / ph, 1f);
            pgo.AddComponent<TDPlayer>();
            pgo.transform.position = TDWalkLib.CellCenter(new Vector3Int(30, 44, 0));

            // 4. camera
            var camGo = GameObject.Find("Main Camera");
            var cam = camGo != null ? camGo.GetComponent<Camera>() : null;
            if (cam == null) throw new Exception("main camera missing");
            cam.orthographic = true;
            cam.orthographicSize = CamSize;
            cam.clearFlags = CameraClearFlags.SolidColor;
            cam.backgroundColor = new Color32(46, 52, 50, 255);
            cam.transform.position = new Vector3(32f, 36f, -10f);

            if (!EditorSceneManager.SaveScene(scene, ScenePath)) throw new Exception("scene save failed");

            // 5. screenshots: walkers mid-path on the repainted roads
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

            string s1 = Path.Combine(dir, "td-a1-1-street.png");
            cam.orthographicSize = CamSize;
            cam.transform.position = new Vector3(32f, 36.5f, -10f);
            Shot(cam, 1920, 1080, s1);

            string s2 = Path.Combine(dir, "td-a1-2-plaza-t6.png");
            for (int i = 0; i < wObjs.Count; i++) wObjs[i].transform.position = TDWalkLib.PosAt(wPaths[i], t0[i] + 6f);
            Shot(cam, 1920, 1080, s2);

            string s3 = Path.Combine(dir, "td-a1-3-bridge.png");
            for (int i = 0; i < wObjs.Count; i++) wObjs[i].transform.position = TDWalkLib.PosAt(wPaths[i], t0[i]);
            cam.transform.position = new Vector3(42.5f, 20f, -10f);
            Shot(cam, 1920, 1080, s3);

            string s4 = Path.Combine(dir, "td-a1-4-overview.png");
            cam.orthographicSize = 32f;
            cam.transform.position = new Vector3(32f, 32f, -10f);
            Shot(cam, 3072, 3072, s4);

            for (int i = 0; i < wObjs.Count; i++) wObjs[i].transform.position = TDWalkLib.CellCenter(starts[i]);

            // 6. proof
            result["mapBounds"] = mapSp.bounds.size.ToString();
            result["walkableCells"] = walkable.Count.ToString();
            result["walkers"] = wObjs.Count.ToString();
            foreach (var s in new[] { s1, s2, s3, s4 })
            {
                var fi = new FileInfo(s);
                if (!fi.Exists || fi.Length < 20000) throw new Exception("shot too small/missing: " + s);
                result["shot_" + Path.GetFileName(s)] = fi.Length.ToString();
            }
            File.WriteAllText(donePath, Json(result));
            Debug.Log("TDANIME R1 PASS map=" + mapSp.bounds.size + " walkers=8");
        }
        catch (Exception e)
        {
            var msg = e.Message.Replace("\"", "'").Replace("\r", " ").Replace("\n", " ");
            result["result"] = "FAIL";
            result["error"] = msg;
            File.WriteAllText(donePath, Json(result));
            Debug.LogError("TDANIME R1 FAIL: " + msg);
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
