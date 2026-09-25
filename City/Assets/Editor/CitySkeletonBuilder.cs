// FluxVerse P-15 r10: static city skeleton builder (one-shot, sentinel-triggered).
// r11 fix: MK() fed ArtRoot-relative sprite paths to AssetDatabase, which only accepts
// project-relative (Assets/...) paths -> ImportAsset logged "does not exist", heal never ran,
// whole catalog failed at first tile (000). All AssetDatabase calls now use ArtRoot-prefixed path.
// Sentinel: <repo>/logs/citybuilder.run -> builds CityScene, saves, screenshots, writes <repo>/logs/citybuilder.done.
// r10 rework: r9 saved scene had Ground/Water/Roads tilemaps EMPTY (Paint-closure tiles came up
// fake-null -> silent skip). Fix class-wide: resolve tiles FRESH via LoadAssetAtPath at every use
// (no long-lived references across NewScene), fail-loud per-layer tile counts in report.
// Tile semantics corrected via labeled contact-sheet + pixel forensics (logs/r10-contact.png):
// 000/001 grass; 191/194 pavement plain/corner (NOT walls); 189 curtain-wall glazing (brain tower);
// 166/284/208 road tiles with lane markings; water_wave_* real water. All paths ASCII. No 3D.
using UnityEngine;
using UnityEngine.SceneManagement;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine.Tilemaps;
using System.IO;

public static class CitySkeletonBuilder
{
    static string ProjectRoot { get { return Path.GetDirectoryName(Application.dataPath); } }
    static string RepoRoot { get { return Path.GetDirectoryName(ProjectRoot); } }
    static string SentinelPath { get { return Path.Combine(RepoRoot, "logs", "citybuilder.run"); } }
    static string DonePath { get { return Path.Combine(RepoRoot, "logs", "citybuilder.done"); } }
    static string ArtRoot { get { return "Assets/Art/CleanCityv3"; } }
    static string TileAssetDir { get { return ArtRoot + "/Tiles_Auto"; } }
    static string ScenePath { get { return "Assets/Scenes/CityScene.unity"; } }

    [InitializeOnLoadMethod]
    static void Hook()
    {
        if (File.Exists(SentinelPath))
            EditorApplication.delayCall += Run;
    }

    static void Run()
    {
        if (!File.Exists(SentinelPath)) return; // single-shot guard
        string report = "";
        try
        {
            report = Build();
            File.WriteAllText(DonePath, "OK " + report + " ts=" + System.DateTime.UtcNow.ToString("o"));
        }
        catch (System.Exception e)
        {
            File.WriteAllText(DonePath, "FAIL " + e.GetType().Name + ": " + e.Message + " | " + e.StackTrace + " ts=" + System.DateTime.UtcNow.ToString("o"));
        }
        finally
        {
            if (File.Exists(SentinelPath)) File.Delete(SentinelPath);
        }
    }

    // batchmode entry: Tuanjie.exe -batchmode -quit -projectPath <City> -executeMethod CitySkeletonBuilder.BatchBuild
    public static void BatchBuild()
    {
        Run();
    }

    static void EnsureCatalog()
    {
        // create-if-missing each tile asset; sprite path -> semantic name (r10 verified picks)
        MK("t_grass_a", "Tiles/GuttyKreum_CleanCity_000.png");
        MK("t_grass_b", "Tiles/GuttyKreum_CleanCity_001.png");
        MK("t_pav_plain", "Tiles/GuttyKreum_CleanCity_191.png");
        MK("t_pav_corner", "Tiles/GuttyKreum_CleanCity_194.png");
        MK("t_road_dash_h", "Tiles/GuttyKreum_CleanCity_284.png");
        MK("t_road_dash_v", "Tiles/GuttyKreum_CleanCity_166.png");
        MK("t_road_line", "Tiles/GuttyKreum_CleanCity_208.png");
        MK("t_wall_gray_a", "Tiles/GuttyKreum_CleanCity_035.png");
        MK("t_wall_gray_b", "Tiles/GuttyKreum_CleanCity_057.png");
        MK("t_wall_gray_c", "Tiles/GuttyKreum_CleanCity_074.png");
        MK("t_wall_glass", "Tiles/GuttyKreum_CleanCity_189.png");
        MK("t_roof_a", "Tiles/GuttyKreum_CleanCity_047.png");
        MK("t_roof_b", "Tiles/GuttyKreum_CleanCity_048.png");
        MK("t_prop_a", "Tiles/GuttyKreum_CleanCity_132.png");
        MK("t_prop_b", "Tiles/GuttyKreum_CleanCity_133.png");
        MK("t_prop_post", "Tiles/GuttyKreum_CleanCity_136.png");
        MK("t_prop_box", "Tiles/GuttyKreum_CleanCity_296.png");
        MK("t_water_0", "Tiles_Extract/water_wave_00.png");
        // r155 (P-20260925-09 W1): the full 8-frame cycle vocabulary - the
        // cycling law ((x*31+y*17+t) mod 8) needs all eight; the static paint
        // below keeps the legacy 4-variant hash as the boot state.
        MK("t_water_1", "Tiles_Extract/water_wave_01.png");
        MK("t_water_2", "Tiles_Extract/water_wave_02.png");
        MK("t_water_3", "Tiles_Extract/water_wave_03.png");
        MK("t_water_4", "Tiles_Extract/water_wave_04.png");
        MK("t_water_5", "Tiles_Extract/water_wave_05.png");
        MK("t_water_6", "Tiles_Extract/water_wave_06.png");
        MK("t_water_7", "Tiles_Extract/water_wave_07.png");
        AssetDatabase.SaveAssets();
    }

    // r155: create-if-missing the four cycle tiles WITHOUT a full build -
    // WaterFxProof calls this so the adapter's serialized frameTiles[8] can
    // be wired (MK is idempotent create-if-missing, r10 vocabulary law).
    public static void EnsureWaterCycleTiles()
    {
        MK("t_water_1", "Tiles_Extract/water_wave_01.png");
        MK("t_water_5", "Tiles_Extract/water_wave_05.png");
        MK("t_water_6", "Tiles_Extract/water_wave_06.png");
        MK("t_water_7", "Tiles_Extract/water_wave_07.png");
        AssetDatabase.SaveAssets();
    }

    static void MK(string name, string spritePath)
    {
        if (!AssetDatabase.IsValidFolder(TileAssetDir))
            AssetDatabase.CreateFolder(ArtRoot, "Tiles_Auto");
        string assetPath = TileAssetDir + "/" + name + ".asset";
        Tile t = AssetDatabase.LoadAssetAtPath<Tile>(assetPath);
        if (t == null)
        {
            t = ScriptableObject.CreateInstance<Tile>();
            AssetDatabase.CreateAsset(t, assetPath);
        }
        Sprite s = AssetDatabase.LoadAssetAtPath<Sprite>(ArtRoot + "/" + spritePath);
        if (s == null)
        {
            // heal: copied-in .meta may be dup-GUID/corrupt or missing (000.png lost its meta in the
            // r10 broken-heal run). Fresh meta -> fresh GUID. NOTE: File I/O needs ABSOLUTE path
            // (editor CWD != project root); AssetDatabase needs the project-relative Assets/ path.
            string absBase = Path.Combine(ProjectRoot, ArtRoot);
            string absPng = Path.Combine(absBase, spritePath);
            string absMeta = absPng + ".meta";
            if (!File.Exists(absPng))
                throw new System.InvalidOperationException("sprite file not on disk: " + spritePath);
            if (File.Exists(absMeta)) File.Delete(absMeta);
            AssetDatabase.ImportAsset(ArtRoot + "/" + spritePath, ImportAssetOptions.ForceSynchronousImport);
            s = AssetDatabase.LoadAssetAtPath<Sprite>(ArtRoot + "/" + spritePath);
        }
        if (s == null) throw new System.InvalidOperationException("sprite missing after reimport heal: " + spritePath);
        t.sprite = s;
        EditorUtility.SetDirty(t);
    }

    // r10 core fix: FRESH resolution at every use. Long-lived Tile references went fake-null in r9
    // (saved scene proved Ground/Water/Roads empty while same-run Block/props tiles persisted).
    static Tile RT(string name)
    {
        Tile t = AssetDatabase.LoadAssetAtPath<Tile>(TileAssetDir + "/" + name + ".asset");
        if (t == null) throw new System.InvalidOperationException("tile resolve failed: " + name);
        return t;
    }

    static void FixImporters()
    {
        foreach (string guid in AssetDatabase.FindAssets("t:Texture2D", new string[] { ArtRoot }))
        {
            string p = AssetDatabase.GUIDToAssetPath(guid);
            TextureImporter ti = AssetImporter.GetAtPath(p) as TextureImporter;
            if (ti == null) continue;
            if (ti.textureType != TextureImporterType.Sprite || ti.spriteImportMode != SpriteImportMode.Single
                || ti.spritePixelsPerUnit != 16 || ti.filterMode != FilterMode.Point || ti.mipmapEnabled)
            {
                ti.textureType = TextureImporterType.Sprite;
                ti.spriteImportMode = SpriteImportMode.Single;
                ti.spritePixelsPerUnit = 16;
                ti.filterMode = FilterMode.Point;
                ti.mipmapEnabled = false;
                ti.SaveAndReimport();
            }
        }
        AssetDatabase.SaveAssets();
    }

    static Tilemap MakeLayer(string name, int order, Color tint)
    {
        GameObject go = new GameObject(name);
        go.transform.SetParent(GetGrid().transform);
        Tilemap tm = go.AddComponent<Tilemap>();
        TilemapRenderer tr = go.AddComponent<TilemapRenderer>();
        tr.sortingOrder = order;
        tr.mode = TilemapRenderer.Mode.Chunk;
        tm.color = tint;
        return tm;
    }

    static Grid _grid;
    static Grid GetGrid()
    {
        if (_grid == null) _grid = new GameObject("CityGrid").AddComponent<Grid>();
        return _grid;
    }

    static void Paint(Tilemap tm, int x0, int x1, int y0, int y1, System.Func<int, int, string> pick)
    {
        for (int y = y0; y <= y1; y++)
            for (int x = x0; x <= x1; x++)
            {
                string n = pick(x, y);
                if (n == null) continue;
                tm.SetTile(new Vector3Int(x, y, 0), RT(n));
            }
    }

    static void Block(Tilemap tm, int x0, int x1, int yBase, int rows, string wallA, string wallB, string roof)
    {
        for (int y = yBase; y < yBase + rows; y++)
            for (int x = x0; x <= x1; x++)
                tm.SetTile(new Vector3Int(x, y, 0),
                    (y == yBase + rows - 1) ? RT(roof) : (((x + y) & 1) == 0 ? RT(wallA) : RT(wallB)));
    }

    static int CountTiles(Tilemap tm)
    {
        int c = 0;
        foreach (Vector3Int p in tm.cellBounds.allPositionsWithin)
            if (tm.GetTile(p) != null) c++;
        return c;
    }

    static string LayerCounts(Tilemap ground, Tilemap water, Tilemap roads, Tilemap cityGame,
        Tilemap cityQuant, Tilemap cityMedia, Tilemap brain, Tilemap props)
    {
        return "G:" + CountTiles(ground) + " W:" + CountTiles(water) + " R:" + CountTiles(roads)
            + " g:" + CountTiles(cityGame) + " q:" + CountTiles(cityQuant) + " m:" + CountTiles(cityMedia)
            + " b:" + CountTiles(brain) + " p:" + CountTiles(props);
    }

    static string Build()
    {
        FixImporters();
        EnsureCatalog();

        // scene: batch -> Single (replaces throwaway untitled boot scene); live editor -> Additive
        bool batch = UnityEditorInternal.InternalEditorUtility.inBatchMode;
        Scene scene = batch
            ? EditorSceneManager.NewScene(NewSceneSetup.EmptyScene, NewSceneMode.Single)
            : EditorSceneManager.NewScene(NewSceneSetup.EmptyScene, NewSceneMode.Additive);
        _grid = null;

        Tilemap ground = MakeLayer("Ground", 0, Color.white);
        Tilemap water = MakeLayer("Water", 1, new Color(0.75f, 0.85f, 1f));
        Tilemap roads = MakeLayer("Roads", 2, Color.white);
        Tilemap cityGame = MakeLayer("CityGAME", 3, new Color(0.20f, 0.92f, 0.86f));   // data cyan
        Tilemap cityQuant = MakeLayer("CityQUANT", 3, new Color(0.98f, 0.75f, 0.20f));  // capital gold
        Tilemap cityMedia = MakeLayer("CityMEDIA", 3, new Color(0.95f, 0.32f, 0.66f)); // flow magenta
        Tilemap brain = MakeLayer("BrainTower", 3, new Color(1f, 1f, 1f));             // CEO pure white
        Tilemap props = MakeLayer("Props", 4, Color.white);

        int X0 = -50, X1 = 50;
        // Huangpu river band (rows -3..2)
        Paint(water, X0, X1, -3, 2, (x, y) => {
            int h = ((x * 31 + y * 17) & 7);
            return h == 0 ? "t_water_2" : (h == 3 ? "t_water_3" : (h == 5 ? "t_water_4" : "t_water_0"));
        });
        // ground: north promenade/grass, south mirrored (191 plain pavement, 194 corner curb, 000/001 grass)
        Paint(ground, X0, X1, 3, 3, (x, y) => "t_pav_corner");
        Paint(ground, X0, X1, 4, 4, (x, y) => "t_pav_plain");
        Paint(ground, X0, X1, 5, 6, (x, y) => ((x & 1) == 0 ? "t_grass_a" : "t_grass_b"));
        Paint(ground, X0, X1, 9, 14, (x, y) => "t_pav_plain");
        Paint(ground, X0, X1, -4, -4, (x, y) => "t_pav_corner");
        Paint(ground, X0, X1, -5, -5, (x, y) => "t_pav_plain");
        Paint(ground, X0, X1, -6, -6, (x, y) => ((x & 1) == 0 ? "t_grass_a" : "t_grass_b"));
        Paint(ground, X0, X1, -16, -9, (x, y) => "t_pav_plain");

        // roads: marked road tiles (284 h-dash / 166 v-dash / 208 solid line), no plain asphalt in pack
        Paint(roads, X0, X1, 7, 7, (x, y) => (x % 2 == 0) ? "t_road_dash_h" : "t_road_dash_v");
        Paint(roads, X0, X1, 8, 8, (x, y) => (x % 2 == 0) ? "t_road_dash_v" : "t_road_dash_h");
        Paint(roads, X0, X1, -8, -8, (x, y) => (x % 2 == 0) ? "t_road_dash_v" : "t_road_dash_h");
        Paint(roads, X0, X1, -7, -7, (x, y) => (x % 2 == 0) ? "t_road_dash_h" : "t_road_dash_v");
        int[] vcols = new int[] { -18, -17, 17, 18 };
        foreach (int cx in vcols)
        {
            Paint(roads, cx, cx, 3, 14, (x, y) => (y % 2 == 0) ? "t_road_dash_v" : "t_road_dash_h");
            Paint(roads, cx, cx, -16, -4, (x, y) => (y % 2 == 0) ? "t_road_dash_v" : "t_road_dash_h");
        }
        foreach (int cx in new int[] { -17, 17 })
        {
            Paint(roads, cx, cx, 7, 8, (x, y) => "t_road_line");
            Paint(roads, cx, cx, -8, -7, (x, y) => "t_road_line");
        }

        // fail-loud: never save another silently-empty paint layer (r9 lesson)
        string counts = LayerCounts(ground, water, roads, cityGame, cityQuant, cityMedia, brain, props);
        int gN = CountTiles(ground), wN = CountTiles(water), rN = CountTiles(roads);
        if (gN == 0 || wN == 0 || rN == 0)
            throw new System.InvalidOperationException("EMPTY PAINT LAYER " + counts);

        // brain tower (r132 tower-v2: wedge-cut cyber data hub, 160px city-unique
        // commanding height; geometry source = Tools/city/tower-v2-manifest.json)
        PaintTower(brain, props);
        // north low-rise
        Block(cityGame, -28, -26, 9, 3, "t_wall_gray_a", "t_wall_gray_b", "t_roof_b");
        Block(cityGame, -9, -7, 9, 3, "t_wall_gray_c", "t_wall_gray_a", "t_roof_b");
        Block(cityMedia, 7, 9, 9, 3, "t_wall_gray_b", "t_wall_gray_c", "t_roof_b");
        Block(cityMedia, 26, 28, 9, 3, "t_wall_gray_a", "t_wall_gray_c", "t_roof_b");
        // south three cities (r104 southbank-manifest geometry: QUANT twist tower
        // 8 rows = 128px landmark band = south-bank commanding height, MEDIA
        // dual-sphere waterside front rank 6 rows, GAME_MAIN rear 5 + staggered
        // GAME_ANNEX 3 = pin formation; all top edges <= -8 = zero road press,
        // zero river soak; X law preserved, vcol roads untouched)
        PaintSouth(cityGame, cityQuant, cityMedia);

        // props (semantic names approximate: 132/133 glow-props, 136 post, 296 box-on-ledge)
        foreach (int x in new int[] { -30, -24, -12, -6, 6, 12, 24, 30 })
            props.SetTile(new Vector3Int(x, 5, 0), RT(((x & 2) == 0) ? "t_prop_a" : "t_prop_b"));
        foreach (int x in new int[] { -28, -22, -10, -4, 4, 10, 22, 28 })
            props.SetTile(new Vector3Int(x, -6, 0), RT(((x & 2) == 0) ? "t_prop_b" : "t_prop_a"));
        foreach (int x in new int[] { -28, -20, -12, 12, 20, 28 })
            props.SetTile(new Vector3Int(x, 3, 0), RT("t_prop_post"));
        foreach (int x in new int[] { -24, -16, -8, 8, 16, 24 })
            props.SetTile(new Vector3Int(x, -4, 0), RT("t_prop_post"));
        foreach (int x in new int[] { -12, 9 }) props.SetTile(new Vector3Int(x, 8, 0), RT("t_prop_box"));
        foreach (int x in new int[] { -10, 14 }) props.SetTile(new Vector3Int(x, -8, 0), RT("t_prop_box"));

        // event-routing anchors (future P-15 r11+; r104 southbank-manifest anchors)
        MakeAnchor("BrainTower", 0.5f, 14f);   // r132 tower-v2: shaft center x, whole-tower mid y
        MakeAnchor("Zone_GAME", -20.5f, -11f);
        MakeAnchor("Zone_QUANT", 0.5f, -12f);
        MakeAnchor("Zone_MEDIA", 22f, -11f);

        // camera: L0 panorama profile (P-17: ortho, size 20, night base)
        GameObject camGo = new GameObject("CityCamera");
        Camera cam = camGo.AddComponent<Camera>();
        cam.orthographic = true;
        cam.orthographicSize = 20f;
        cam.clearFlags = CameraClearFlags.SolidColor;
        cam.backgroundColor = new Color(10f / 255f, 14f / 255f, 26f / 255f);
        cam.transform.position = new Vector3(0f, 0f, -10f);
        cam.nearClipPlane = -50f;   // 2D ortho: allow sprites behind camera origin
        cam.farClipPlane = 100f;

        // fail-loud final: buildings + props must be populated too
        counts = LayerCounts(ground, water, roads, cityGame, cityQuant, cityMedia, brain, props);
        if (CountTiles(brain) == 0 || CountTiles(cityQuant) == 0 || CountTiles(props) == 0)
            throw new System.InvalidOperationException("EMPTY BLOCK LAYER " + counts);

        // save scene
        Directory.CreateDirectory(Path.GetDirectoryName(ScenePath));
        bool saved = EditorSceneManager.SaveScene(scene, ScenePath);
        bool listed = false;
        foreach (var s in EditorBuildSettings.scenes) if (s.path == ScenePath) listed = true;
        if (!listed)
        {
            var list = new System.Collections.Generic.List<EditorBuildSettingsScene>(EditorBuildSettings.scenes);
            list.Add(new EditorBuildSettingsScene(ScenePath, true));
            EditorBuildSettings.scenes = list.ToArray();
        }

        // screenshot (render to texture, no GUI needed)
        string shotPath = Path.Combine(RepoRoot, "docs", "design", "m1-r11-cityskeleton.png");
        RenderTexture rt = new RenderTexture(1920, 1080, 24, RenderTextureFormat.ARGB32);
        cam.targetTexture = rt;
        cam.Render();
        RenderTexture.active = rt;
        Texture2D tex = new Texture2D(1920, 1080, TextureFormat.RGBA32, false);
        tex.ReadPixels(new Rect(0, 0, 1920, 1080), 0, 0);
        tex.Apply();
        File.WriteAllBytes(shotPath, tex.EncodeToPNG());
        cam.targetTexture = null;
        RenderTexture.active = null;
        Object.DestroyImmediate(tex);
        rt.Release();

        if (!batch) EditorSceneManager.CloseScene(scene, true);

        return "saved=" + saved + " " + counts + " shot=" + shotPath;
    }

    static void MakeAnchor(string name, float x, float y)
    {
        GameObject go = new GameObject(name);
        go.transform.position = new Vector3(x, y, 0f);
    }

    // ---- r104 south-bank re-lay (P-69 slice 1+2 merge; geometry source =
    // Tools/city/southbank-manifest.json, the r103 sandbox verdict) ----
    // In-place repaint of the SAVED scene: clears every south cell (y < 3) on the
    // three city layers, re-Blocks per the manifest, repositions the three Zone_
    // anchors. Full BatchBuild (NewScene) would wipe every serialized neighbor
    // (residents/signs/robots/vehicles/rig/interior wiring) and force a complete
    // re-bootstrap; the in-place path keeps the single-writer neighborhood intact
    // and lets each entity proof sweep-rebuild its own family from the rules
    // tables (r90 sign-move precedent).
    static string SouthPath { get { return Path.Combine(RepoRoot, "logs", "south.run"); } }
    static string SouthDonePath { get { return Path.Combine(RepoRoot, "logs", "south.done"); } }

    // batchmode entry: Tuanjie.exe -batchmode -quit -projectPath <City> -executeMethod CitySkeletonBuilder.BatchSouth
    public static void BatchSouth()
    {
        if (!File.Exists(SouthPath))
        {
            File.WriteAllText(SouthDonePath, "SKIP no sentinel ts=" + System.DateTime.UtcNow.ToString("o"));
            return;
        }
        try
        {
            string report = SouthInPlace();
            File.WriteAllText(SouthDonePath, "OK " + report + " ts=" + System.DateTime.UtcNow.ToString("o"));
        }
        catch (System.Exception e)
        {
            File.WriteAllText(SouthDonePath, "FAIL " + e.GetType().Name + ": " + e.Message + " | " + e.StackTrace + " ts=" + System.DateTime.UtcNow.ToString("o"));
        }
        finally
        {
            if (File.Exists(SouthPath)) File.Delete(SouthPath);
        }
    }

    static void PaintSouth(Tilemap cityGame, Tilemap cityQuant, Tilemap cityMedia)
    {
        // QUANT twist tower: cells x -2..2, yBase -16, 8 rows -> world top -8 (128px band)
        Block(cityQuant, -2, 2, -16, 8, "t_wall_gray_b", "t_wall_gray_c", "t_roof_a");
        // GAME_MAIN rear rank: cells x -23..-19, yBase -16, 5 rows -> world top -11
        Block(cityGame, -23, -19, -16, 5, "t_wall_gray_a", "t_wall_gray_a", "t_roof_b");
        // GAME_ANNEX staggered west: cells x -26..-25, yBase -16, 3 rows (1u alley)
        Block(cityGame, -26, -25, -16, 3, "t_wall_gray_a", "t_wall_gray_a", "t_roof_b");
        // MEDIA dual-sphere waterside front rank: cells x 19..24, yBase -14, 6 rows
        Block(cityMedia, 19, 24, -14, 6, "t_wall_gray_b", "t_wall_gray_b", "t_roof_b");
    }

    static int ClearSouth(Tilemap tm)
    {
        int cleared = 0;
        foreach (Vector3Int p in tm.cellBounds.allPositionsWithin)
            if (p.y < 3 && tm.GetTile(p) != null) { tm.SetTile(p, null); cleared++; }
        return cleared;
    }

    static Tilemap TilemapGO(string name)
    {
        GameObject go = GameObject.Find(name);   // tilemap GOs: unique names (no anchor collision)
        Tilemap tm = go != null ? go.GetComponent<Tilemap>() : null;
        if (tm == null) throw new System.InvalidOperationException("tilemap missing: " + name);
        return tm;
    }

    static void MoveAnchor(string name, float x, float y)
    {
        GameObject go = GameObject.Find(name);
        if (go == null) { MakeAnchor(name, x, y); return; }
        go.transform.position = new Vector3(x, y, 0f);
    }

    static int CountSouth(Tilemap tm)
    {
        int c = 0;
        foreach (Vector3Int p in tm.cellBounds.allPositionsWithin)
            if (p.y < 3 && tm.GetTile(p) != null) c++;
        return c;
    }

    static string SouthInPlace()
    {
        Scene scene = EditorSceneManager.OpenScene(ScenePath, OpenSceneMode.Single);
        if (!scene.isLoaded) throw new System.InvalidOperationException("CityScene failed to open");
        Tilemap cityGame = TilemapGO("CityGAME");
        Tilemap cityQuant = TilemapGO("CityQUANT");
        Tilemap cityMedia = TilemapGO("CityMEDIA");
        int cleared = ClearSouth(cityGame) + ClearSouth(cityQuant) + ClearSouth(cityMedia);
        PaintSouth(cityGame, cityQuant, cityMedia);
        MoveAnchor("Zone_QUANT", 0.5f, -12f);
        MoveAnchor("Zone_GAME", -20.5f, -11f);
        MoveAnchor("Zone_MEDIA", 22f, -11f);
        // fail-loud: exact south cell counts per the manifest (40/31/36)
        int q = CountSouth(cityQuant), g = CountSouth(cityGame), m = CountSouth(cityMedia);
        if (q != 40 || g != 31 || m != 36)
            throw new System.InvalidOperationException("SOUTH COUNT DRIFT q=" + q + " g=" + g + " m=" + m);
        bool saved = EditorSceneManager.SaveScene(scene);
        if (!saved) throw new System.InvalidOperationException("scene save failed");
        return "cleared=" + cleared + " south q=" + q + "/g=" + g + "/m=" + m + " saved=" + saved;
    }

    // ---- r132 tower-v2 (P-69 slice-2 tail; geometry source =
    // Tools/city/tower-v2-manifest.json, the r131 sandbox verdict) ----
    // CEO-authored canon tower-brain-design.md v2.0: hard-core cyber data hub,
    // NOT a flower bud. 10 tile rows = 160px city-unique commanding height
    // (> QUANT 128, post-lates-wins canon ruling): data plinth one ring wider
    // than the shaft with exposed pipe boxes, slender glass shaft, two-step
    // wedge cut 3->1 ending in a pale blade tip, thin horizontal data light
    // bands on the Props layer (static v0 - runtime window-light choreography
    // waits out the T2 window per the manifest deferred-faces law).
    static void PaintTower(Tilemap brain, Tilemap props)
    {
        // idempotent: clear any previous tower paint first (the brain layer
        // holds nothing but the tower); safe on a fresh NewScene layer too
        foreach (Vector3Int p in brain.cellBounds.allPositionsWithin)
            if (brain.GetTile(p) != null) brain.SetTile(p, null);
        Block(brain, -2, 2, 9, 2, "t_wall_glass", "t_wall_glass", "t_wall_glass");   // data plinth rows 9..10 (one ring wider)
        Block(brain, -1, 1, 11, 6, "t_wall_glass", "t_wall_glass", "t_wall_glass"); // server-blade shaft rows 11..16
        Block(brain, -1, 1, 17, 1, "t_wall_glass", "t_wall_glass", "t_wall_glass"); // wedge shoulder row 17 (cut step 1)
        Block(brain, 0, 0, 18, 1, "t_roof_a", "t_roof_a", "t_roof_a");             // blade tip row 18 (cut step 2, sharp not flower)
        // data bands on Props (order 4 renders above brain layer 3): full rows
        // 11 + 16 (data-exchange / governance), indicator singles rows 13/15 at
        // the shaft flanks, cooling-pipe boxes on the plinth shoulders
        for (int x = -1; x <= 1; x++)
        {
            props.SetTile(new Vector3Int(x, 11, 0), RT(((x & 1) == 0) ? "t_prop_b" : "t_prop_a"));
            props.SetTile(new Vector3Int(x, 16, 0), RT(((x & 1) == 0) ? "t_prop_a" : "t_prop_b"));
        }
        props.SetTile(new Vector3Int(-1, 13, 0), RT("t_prop_a"));
        props.SetTile(new Vector3Int(1, 13, 0), RT("t_prop_b"));
        props.SetTile(new Vector3Int(-1, 15, 0), RT("t_prop_b"));
        props.SetTile(new Vector3Int(1, 15, 0), RT("t_prop_a"));
        props.SetTile(new Vector3Int(-2, 11, 0), RT("t_prop_box"));
        props.SetTile(new Vector3Int(2, 11, 0), RT("t_prop_box"));
    }

    static string TowerPath { get { return Path.Combine(RepoRoot, "logs", "tower.run"); } }
    static string TowerDonePath { get { return Path.Combine(RepoRoot, "logs", "tower.done"); } }

    // batchmode entry: Tuanjie.exe -batchmode -quit -projectPath <City> -executeMethod CitySkeletonBuilder.BatchTower
    public static void BatchTower()
    {
        if (!File.Exists(TowerPath))
        {
            File.WriteAllText(TowerDonePath, "SKIP no sentinel ts=" + System.DateTime.UtcNow.ToString("o"));
            return;
        }
        try
        {
            string report = TowerInPlace();
            File.WriteAllText(TowerDonePath, "OK " + report + " ts=" + System.DateTime.UtcNow.ToString("o"));
        }
        catch (System.Exception e)
        {
            File.WriteAllText(TowerDonePath, "FAIL " + e.GetType().Name + ": " + e.Message + " | " + e.StackTrace + " ts=" + System.DateTime.UtcNow.ToString("o"));
        }
        finally
        {
            if (File.Exists(TowerPath)) File.Delete(TowerPath);
        }
    }

    // in-place repaint of the SAVED scene (BatchSouth pattern): keeps every
    // serialized neighbor - residents/signs/robots/vehicles/rig/interior
    // wiring - intact; single geometry writer law.
    static string TowerInPlace()
    {
        Scene scene = EditorSceneManager.OpenScene(ScenePath, OpenSceneMode.Single);
        if (!scene.isLoaded) throw new System.InvalidOperationException("CityScene failed to open");
        Tilemap brain = TilemapByNameStrict("BrainTower");
        Tilemap props = TilemapByNameStrict("Props");
        int beforeBrain = CountTiles(brain);
        if (beforeBrain != 18 && beforeBrain != 32)
            throw new System.InvalidOperationException("unexpected pre-paint brain census: " + beforeBrain
                + " (old v1 tower = 18, repainted v2 = 32)");
        PaintTower(brain, props);
        // fail-loud: manifest law - plinth 10 + shaft 18 + shoulder 3 + tip 1 = 32;
        // tower prop cells = 6 band + 4 indicator + 2 pipes = 12 (all inside x -2..2, rows 11..16)
        int b = CountTiles(brain);
        if (b != 32)
            throw new System.InvalidOperationException("TOWER COUNT DRIFT b=" + b + " (expected 32)");
        int towerProps = 0;
        for (int y = 11; y <= 16; y++)
            for (int x = -2; x <= 2; x++)
                if (props.GetTile(new Vector3Int(x, y, 0)) != null) towerProps++;
        if (towerProps != 12)
            throw new System.InvalidOperationException("TOWER PROP DRIFT p=" + towerProps + " (expected 12)");
        // anchor re-anchor (r87 same-name trap law: the BrainTower ANCHOR is a bare
        // root GO, the same-named tilemap is a CityGrid child - root scan only)
        GameObject anchorGO = RootGO("BrainTower");
        if (anchorGO == null) MakeAnchor("BrainTower", 0.5f, 14f);
        else anchorGO.transform.position = new Vector3(0.5f, 14f, 0f);
        bool saved = EditorSceneManager.SaveScene(scene);
        if (!saved) throw new System.InvalidOperationException("scene save failed");
        return "brain " + beforeBrain + "->" + b + " tower_props=12 anchor=(0.5,14) saved=" + saved;
    }

    // r87 same-name law: "BrainTower" names BOTH a root anchor GO and a CityGrid
    // child tilemap GO; GameObject.Find can hand back either. The tilemap lookup
    // discriminates by COMPONENT (anchors carry no Tilemap), the anchor lookup
    // by HIERARCHY (anchors are root GOs, the tilemap is parented under CityGrid).
    static Tilemap TilemapByNameStrict(string name)
    {
        Tilemap[] maps = Object.FindObjectsOfType<Tilemap>();
        foreach (Tilemap tm in maps)
            if (tm != null && tm.name == name) return tm;
        throw new System.InvalidOperationException("tilemap missing: " + name);
    }

    static GameObject RootGO(string name)
    {
        foreach (Transform t in Object.FindObjectsOfType<Transform>())
            if (t.parent == null && t.name == name) return t.gameObject;
        return null;
    }
}
