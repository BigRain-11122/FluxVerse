using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using UnityEditor;
using UnityEditor.Animations;
using UnityEditor.SceneManagement;
using UnityEngine;

namespace CitySim
{
    /// <summary>
    /// 库内居民启用批 R1（CEO 令 2026-10-02「居民你先自己用资产库的，尽量用好，动作也是能用资产库的就配好」）
    /// 职权边界：本件=City3D 工程装配面（census 名册 20 席 → AD-042 库内 19 形体确定性映射 + 骨骼动画接线）；
    ///          六 hex 材质映射/换装契约 = BigLife 总责（O-2026-0929-020）——本件只留消费位不越权立映射法。
    /// 库内事实：AD-042 19/19 空 Animator 零动画（R-20260929-animation-gap 实测）→ 人形动画=已判定真缺口走既判解B
    ///          （generate_motion → Hunyuan FBX·本批 walk/idle 两枚·Humanoid 重定向挂 Synty 骨架）。
    /// 断言：R1 名册可达（T-FV-147 正体）R2 库内形体齐 R3 动画导入 R4 重定向姿势差 R5 生成装配 R6 行走位移 R7 映射确定性 R8 判据帧。
    /// 批模式：-executeMethod CitySim.CitySimResidentsBatch.RunResidentsAll（fail-loud .done 哨兵·B_R1 系判据帧）。
    /// </summary>
    public static class CitySimResidentsBatch
    {
        static string CityRoot { get { return Path.GetFullPath(Path.Combine(Application.dataPath, "..")); } }
        static string Staging { get { return Path.GetFullPath(Path.Combine(CityRoot, "..", "City3D-staging")); } }
        static string ShotsDir { get { return Path.Combine(Staging, "shots8"); } }
        static string ScenePath { get { return Path.Combine("Assets", "Scenes", "CitySim_ResidentsR1.unity"); } }
        static string DonePath { get { return Path.Combine(Staging, "citysim-residents.done"); } }
        static string ReportPath { get { return Path.Combine(Staging, "citysim-residents-report.md"); } }
        static string RosterPath { get { return "Assets/CitySim/residents-street.json"; } }
        static string CtrlPath { get { return "Assets/CitySim/ResidentAnimator.controller"; } }
        static string GroundMatPath { get { return "Assets/CitySim/ResidentsGround_V1.mat"; } }
        const string WalkFbx = "Assets/Motions/res_walk_hunyuan.fbx";
        const string IdleFbx = "Assets/Motions/res_idle_hunyuan.fbx";
        public const int SEED = 20261002;

        // AD-042 都市人物 19 形体（R-20260929-animation-gap 实测清单）
        static readonly string[] Archetypes =
        {
            "Biker", "FastFoodGuy", "FireFighter", "GamerGirl", "Gangster", "Grandma", "Grandpa",
            "HipsterGirl", "HipsterGuy", "Hobo", "Hotdog", "Jock", "Paramedic", "PunkGirl", "PunkGuy",
            "Roadworker", "ShopKeeper", "SummerGirl", "Tourist"
        };

        [Serializable]
        public class RSlot
        {
            public int slot; public string go; public string zone; public string id; public string name;
            public string species; public string gender; public string district; public int age; public string faction;
            public string block; public string profession; public string axis; public string creed; public string layer;
            public string hairPart; public string eyePart; public string pantC; public string skinC; public string hairC;
            public string clothC; public string badgeC; public string eyeC; public string coreC;
            public int plateIndex; public string plateName;
        }
        [Serializable]
        public class Roster { public string protocol; public List<RSlot> slots; }

        static AnimationClip _walkClip, _idleClip;
        static Avatar _charAvatar;
        static readonly Dictionary<string, GameObject> _pfMap = new Dictionary<string, GameObject>();
        static readonly List<RSlot> _slots = new List<RSlot>();
        static readonly List<GameObject> _spawned = new List<GameObject>();
        static readonly List<GameObject> _walkers = new List<GameObject>();

        // ================= 批入口 =================

        public static void RunResidentsAll()
        {
            try
            {
                AssetDatabase.Refresh();
                int fail = 0;
                var sb = new StringBuilder();
                sb.AppendLine("# CitySim 库内居民启用批 R1 自检（闸3 机检·" + DateTime.Now.ToString("yyyy-MM-dd HH:mm") + "）");
                sb.AppendLine("> 溯源=CEO 令 10-02「居民先自己用资产库的·动作也是能用资产库的就配好」·seed=" + SEED
                    + "·census 名册 20 席→AD-042 19 形体确定性映射·Hunyuan walk/idle Humanoid 重定向");
                sb.AppendLine("> 库内事实=R-20260929-animation-gap（AD-042 空 Animator 零动画）→ 人形动画走既判解B=generate_motion（Mixamo 系 FBX）");
                sb.AppendLine("> 职权注记：六 hex 材质映射/换装契约=BigLife 总责（O-2026-0929-020）——本批只做工程装配与动画接线·映射消费位已留（RSlot 六 hex 字段）");

                // R1 名册可达（T-FV-147 正体：20 名有名有职居民被读出）
                LoadRoster();
                bool r1 = _slots.Count == 20;
                var idSet = new HashSet<string>();
                int named = 0, prof = 0;
                foreach (var s in _slots) { if (!string.IsNullOrEmpty(s.id)) idSet.Add(s.id); if (!string.IsNullOrEmpty(s.name)) named++; if (!string.IsNullOrEmpty(s.profession)) prof++; }
                r1 = r1 && idSet.Count == 20 && named == 20 && prof == 20;
                sb.AppendLine("| R1 名册可达 | slots=" + _slots.Count + "/20·唯一 id=" + idSet.Count + "·有名=" + named + "·有职=" + prof + "（" + RosterPath + "） | " + (r1 ? "PASS" : "FAIL") + " |");
                if (!r1) fail++;

                // R2 库内形体齐（AD-042 19/19 实锚）
                int found = 0; var missing = new StringBuilder();
                _pfMap.Clear();
                foreach (var n in Archetypes)
                {
                    try { var pf = FindPf(n, "AD-042_"); _pfMap[n] = pf; found++; }
                    catch (Exception) { missing.Append(n).Append(' '); }
                }
                bool r2 = found == Archetypes.Length;
                sb.AppendLine("| R2 库内形体 | AD-042 实锚 " + found + "/" + Archetypes.Length + (missing.Length > 0 ? "·缺：" + missing : "") + " | " + (r2 ? "PASS" : "FAIL") + " |");
                if (!r2) fail++;

                // R3 动画导入（Hunyuan FBX→Humanoid→clip 提取）
                string r3note = SetupMotions();
                bool r3 = _walkClip != null && _idleClip != null && _walkClip.length > 0.5f && _idleClip.length > 0.5f;
                sb.AppendLine("| R3 动画导入 | " + r3note + " | " + (r3 ? "PASS" : "FAIL") + " |");
                if (!r3) fail++;

                // 形体骨架 Humanoid 化（重定向前置）
                SetupCharacterRig();
                if (_charAvatar == null) { sb.AppendLine("| R0 形体 Avatar | AD-042 Character.fbx Humanoid 化后 Avatar 未取得 | FAIL |"); fail++; }

                // 建装配场景（20 席全生成+控制器+双态接线+材质过桥）
                BuildScene();

                // R5 生成装配
                int bound = 0, modeBound = 0;
                foreach (var go in _spawned)
                {
                    var a = go.GetComponent<Animator>();
                    if (a != null && a.runtimeAnimatorController != null && a.avatar != null) bound++;
                    if (go.GetComponent<ResidentMode>() != null) modeBound++;
                }
                bool r5 = _spawned.Count == 20 && bound == 20 && modeBound == 20;
                sb.AppendLine("| R5 生成装配 | 生成=" + _spawned.Count + "/20·Animator 全绑（ctrl+avatar）=" + bound + "/20·ResidentMode=" + modeBound + "/20·walkers=" + _walkers.Count + " | " + (r5 ? "PASS" : "FAIL") + " |");
                if (!r5) fail++;

                // R4 重定向姿势差（walk clip 半程采样·Synty 骨架真动=重定向活体实证）
                float poseDelta = 0f, idleDelta = 0f;
                if (_walkers.Count > 0)
                {
                    UnityEditor.AnimationMode.StartAnimationMode();
                    try
                    {
                        var probe = _walkers[0];
                        poseDelta = PoseDelta(probe, _walkClip);
                        idleDelta = PoseDelta(probe, _idleClip);
                    }
                    finally { UnityEditor.AnimationMode.StopAnimationMode(); }
                }
                bool r4 = poseDelta > 0.02f;
                sb.AppendLine("| R4 重定向实证 | walk 半程姿势差=" + poseDelta.ToString("F3") + "m（>0.02）·idle 姿势差=" + idleDelta.ToString("F3") + "m（参照值） | " + (r4 ? "PASS" : "FAIL") + " |");
                if (!r4) fail++;

                // R6 行走位移（ResidentWalker 编辑态手动推进 5s）
                float disp = 0f;
                if (_walkers.Count > 0)
                {
                    var w = _walkers[0].GetComponent<ResidentWalker>();
                    Vector3 p0 = _walkers[0].transform.position;
                    for (int i = 0; i < 100; i++) w.Advance(0.05f);
                    disp = Vector3.Distance(p0, _walkers[0].transform.position);
                }
                bool r6 = disp > 4f;
                sb.AppendLine("| R6 行走位移 | 编辑态推进 5.0s 位移=" + disp.ToString("F2") + "m（>4） | " + (r6 ? "PASS" : "FAIL") + " |");
                if (!r6) fail++;

                // R7 映射确定性（生成实体源 prefab 与映射对账·确定性 seed=同居民永远同形体）
                int mismatch = 0;
                for (int i = 0; i < _slots.Count && i < _spawned.Count; i++)
                {
                    var src = PrefabUtility.GetCorrespondingObjectFromSource(_spawned[i]) as GameObject;
                    if (src == null || src != _pfMap[ArchetypeOf(_slots[i].id)]) mismatch++;
                }
                bool r7 = mismatch == 0;
                sb.AppendLine("| R7 映射确定性 | 20 席双算对账不一致=" + mismatch + "（hash(id) mod 19·确定性 seed） | " + (r7 ? "PASS" : "FAIL") + " |");
                if (!r7) fail++;

                // 名册→形体映射表（CEO 审阅面）
                sb.AppendLine();
                sb.AppendLine("## 名册→形体映射（20 席）");
                sb.AppendLine("| slot | census id | 名 | 职业 | 种 | 形体 | 态 |");
                sb.AppendLine("|---|---|---|---|---|---|---|");
                for (int i = 0; i < _slots.Count && i < _spawned.Count; i++)
                {
                    var s = _slots[i];
                    var rm = _spawned[i].GetComponent<ResidentMode>();
                    sb.AppendLine("| " + s.slot + " | " + s.id + " | " + s.name + " | " + s.profession + " | " + s.species
                        + " | " + ArchetypeOf(s.id) + " | " + ((rm != null && rm.walker) ? "行走" : "待机") + " |");
                }
                sb.AppendLine("> 非碳基种（sprite/灵族系）暂借人形体——真 3D 形体=48 包零覆盖已知缺口（animation-gap ③·CC0 填库呈报在册）。");

                // R8 判据帧
                Directory.CreateDirectory(ShotsDir);
                CaptureFrames();
                int frames = Directory.GetFiles(ShotsDir, "B_R1*.jpg").Length;
                bool r8 = frames >= 4;
                sb.AppendLine("| R8 判据帧 | " + frames + "/4 帧 → " + ShotsDir + " | " + (r8 ? "PASS" : "FAIL") + " |");
                if (!r8) fail++;

                sb.AppendLine();
                sb.AppendLine("结论：" + (fail == 0 ? "**八断言全绿**" : ("**" + fail + " 项 FAIL**"))
                    + "·residents=" + _spawned.Count + "·walkers=" + _walkers.Count + "·clips=" + (_walkClip != null ? _walkClip.name : "?") + "/" + (_idleClip != null ? _idleClip.name : "?"));
                File.WriteAllText(ReportPath, sb.ToString(), Encoding.UTF8);
                File.WriteAllText(DonePath, "CitySimResidents|" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "|"
                    + (fail == 0 ? "PASS" : "FAIL") + "|R1-R8-fail=" + fail + "|residents=" + _spawned.Count + "|walkers=" + _walkers.Count
                    + "|walk_len=" + (_walkClip != null ? _walkClip.length.ToString("F2") : "?")
                    + "|idle_len=" + (_idleClip != null ? _idleClip.length.ToString("F2") : "?")
                    + "|pose_delta=" + poseDelta.ToString("F3") + "|frames=" + frames, Encoding.UTF8);
                Debug.Log("[Residents] RunResidentsAll -> " + (fail == 0 ? "PASS" : "FAIL x" + fail) + " report=" + ReportPath);
                if (fail > 0) throw new Exception("[Residents] FAIL x" + fail + " -> " + ReportPath);
            }
            catch (Exception e)
            {
                try { File.WriteAllText(DonePath, "CitySimResidents|" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "|FAIL|" + e.Message.Replace('\n', ' '), Encoding.UTF8); } catch { }
                Debug.LogError("[Residents] FAIL: " + e.Message);
                throw;
            }
        }

        // ================= 名册 =================

        static readonly Dictionary<string, string> _mapCache = new Dictionary<string, string>();

        static void LoadRoster()
        {
            var ta = AssetDatabase.LoadAssetAtPath<TextAsset>(RosterPath);
            if (ta == null) throw new Exception("[Residents] roster TextAsset missing: " + RosterPath);
            var r = JsonUtility.FromJson<Roster>(ta.text);
            _slots.Clear();
            if (r != null && r.slots != null) _slots.AddRange(r.slots);
            if (_slots.Count != 20) throw new Exception("[Residents] roster slots=" + _slots.Count + " != 20 (fail-loud)");
        }

        static int Hash(string s)
        {
            unchecked { int h = 17; foreach (char c in s) h = h * 31 + c; return h & 0x7fffffff; }
        }

        static string ArchetypeOf(string censusId)
        {
            string v;
            if (_mapCache.TryGetValue(censusId, out v)) return v;
            v = Archetypes[Hash(censusId) % Archetypes.Length];
            _mapCache[censusId] = v;
            return v;
        }

        // ================= 动画与骨架 =================

        static string SetupMotions()
        {
            var notes = new List<string>();
            _walkClip = ImportMotionClip(WalkFbx, "walk");
            _idleClip = ImportMotionClip(IdleFbx, "idle");
            notes.Add("walk=" + (_walkClip != null ? (_walkClip.name + "@" + _walkClip.length.ToString("F2") + "s") : "null"));
            notes.Add("idle=" + (_idleClip != null ? (_idleClip.name + "@" + _idleClip.length.ToString("F2") + "s") : "null"));
            return string.Join("·", notes.ToArray());
        }

        static AnimationClip ImportMotionClip(string fbxPath, string tag)
        {
            if (!File.Exists(Path.Combine(CityRoot, fbxPath)))
                throw new Exception("[Residents] motion FBX missing: " + fbxPath + "（按 O 令从 TOS 直链下载到 Assets/Motions/）");
            var mi = (ModelImporter)AssetImporter.GetAtPath(fbxPath);
            mi.animationType = ModelImporterAnimationType.Human;
            bool loopSet = false;
            try
            {
                var settings = mi.clipAnimations;
                if (settings == null || settings.Length == 0) settings = mi.defaultClipAnimations;
                if (settings != null && settings.Length > 0)
                {
                    for (int i = 0; i < settings.Length; i++) settings[i].loopTime = true;
                    mi.clipAnimations = settings;
                    loopSet = true;
                }
            }
            catch (Exception ex) { Debug.LogWarning("[Residents] clip loop import-setting fallback (" + tag + "): " + ex.Message + " → 运行态 ResidentMode 补环兜底"); }
            mi.SaveAndReimport();
            AnimationClip best = null;
            foreach (var o in AssetDatabase.LoadAllAssetsAtPath(fbxPath))
            {
                var c = o as AnimationClip;
                if (c == null || c.name.ToLower().Contains("preview")) continue;
                if (best == null || c.length > best.length) best = c;
            }
            Debug.Log("[Residents] motion " + tag + ": clip=" + (best != null ? best.name : "null") + " loop_import=" + loopSet);
            return best;
        }

        static void SetupCharacterRig()
        {
            // AD-042 共享 Character.fbx（animation-gap 实测 19 prefab 同源骨架）→ Humanoid 化取 Avatar
            foreach (string guid in AssetDatabase.FindAssets("Character t:ModelImporter"))
            {
                string p = AssetDatabase.GUIDToAssetPath(guid);
                if (!p.Contains("AD-042_") || !p.EndsWith("/Character.fbx")) continue;
                var mi = (ModelImporter)AssetImporter.GetAtPath(p);
                if (mi.animationType != ModelImporterAnimationType.Human)
                {
                    mi.animationType = ModelImporterAnimationType.Human;
                    mi.SaveAndReimport();
                }
                foreach (var o in AssetDatabase.LoadAllAssetsAtPath(p))
                {
                    var av = o as Avatar;
                    if (av != null && av.isValid) { _charAvatar = av; Debug.Log("[Residents] char avatar: " + p + " -> " + av.name); return; }
                }
            }
            Debug.LogWarning("[Residents] AD-042 Character.fbx avatar not found by name-scan；回退：prefab Animator 自带 avatar");
        }

        static float PoseDelta(GameObject probe, AnimationClip clip)
        {
            UnityEditor.AnimationMode.SampleAnimationClip(probe, clip, 0.05f);
            var snap0 = SnapTransforms(probe);
            UnityEditor.AnimationMode.SampleAnimationClip(probe, clip, clip.length * 0.5f);
            var snap1 = SnapTransforms(probe);
            float maxDelta = 0f;
            int n = Math.Min(snap0.Count, snap1.Count);
            for (int i = 0; i < n; i++) maxDelta = Math.Max(maxDelta, Vector3.Distance(snap0[i], snap1[i]));
            return maxDelta;
        }

        static List<Vector3> SnapTransforms(GameObject root)
        {
            var list = new List<Vector3>();
            foreach (var t in root.GetComponentsInChildren<Transform>()) list.Add(t.position);
            return list;
        }

        // ================= 场景装配 =================

        static void BuildScene()
        {
            var ctrl = EnsureController();

            var scene = EditorSceneManager.NewScene(NewSceneSetup.EmptyScene, NewSceneMode.Single);
            RenderSettings.ambientMode = UnityEngine.Rendering.AmbientMode.Flat;
            RenderSettings.ambientLight = new Color(0.55f, 0.55f, 0.58f, 1f);
            var lightGo = new GameObject("Sun");
            var l = lightGo.AddComponent<Light>();
            l.type = LightType.Directional; l.intensity = 1.3f;
            lightGo.transform.rotation = Quaternion.Euler(52f, -30f, 0f);

            MakeCam("B_R1a", new Vector3(0f, 30f, 34f), new Vector3(38f, 180f, 0f));   // 总览（南向）
            MakeCam("B_R1b", new Vector3(0f, 6f, 22f), new Vector3(8f, 180f, 0f));     // 待机组近景
            MakeCam("B_R1c", new Vector3(-24f, 7f, 0f), new Vector3(6f, 90f, 0f));    // 行走环侧景
            MakeCam("B_R1d", new Vector3(-14f, 3.2f, -10.5f), new Vector3(2f, 40f, 0f)); // 单人近景

            // 地面（程序生成件·单面朝上律）
            var ground = GameObject.CreatePrimitive(PrimitiveType.Quad);
            ground.name = "ResidentsGround";
            ground.transform.rotation = Quaternion.Euler(90f, 0f, 0f);
            ground.transform.localScale = new Vector3(90f, 90f, 1f);
            var gmat = AssetDatabase.LoadAssetAtPath<Material>(GroundMatPath);
            if (gmat == null)
            {
                gmat = new Material(Shader.Find("Universal Render Pipeline/Lit")) { name = "ResidentsGround_V1" };
                gmat.SetColor("_BaseColor", new Color(0.137f, 0.149f, 0.169f));
                gmat.SetFloat("_Smoothness", 0.1f);
                AssetDatabase.CreateAsset(gmat, GroundMatPath);
            }
            ground.GetComponent<Renderer>().sharedMaterial = gmat;

            _spawned.Clear(); _walkers.Clear();
            var root = new GameObject("ResidentsR1");

            for (int i = 0; i < _slots.Count; i++)
            {
                var s = _slots[i];
                var arch = ArchetypeOf(s.id);
                GameObject pf;
                if (!_pfMap.TryGetValue(arch, out pf)) throw new Exception("[Residents] archetype missing at spawn: " + arch);
                var go = (GameObject)PrefabUtility.InstantiatePrefab(pf);
                go.name = "Res_" + s.slot + "_" + s.id + "_" + s.name;
                go.transform.SetParent(root.transform, false);
                BridgeMaterials(go);

                bool isWalker = (i % 2 == 0); // 10 行走 / 10 待机
                var a = go.GetComponent<Animator>();
                if (a == null) a = go.AddComponent<Animator>();
                a.runtimeAnimatorController = ctrl;
                if (_charAvatar != null) a.avatar = _charAvatar;
                a.applyRootMotion = false;

                var rm = go.AddComponent<ResidentMode>();
                rm.walker = isWalker; rm.censusId = s.id; rm.displayName = s.name; rm.profession = s.profession;

                if (isWalker)
                {
                    var w = go.AddComponent<ResidentWalker>();
                    w.traceId = "roster:" + s.id + ":" + s.zone;
                    var route = RouteLoop(i / (float)Math.Max(1, _slots.Count / 2));
                    w.BuildRoute(route);
                    _walkers.Add(go);
                }
                else
                {
                    int k = i / 2;
                    float jx = (Hash(s.id) % 100) / 100f - 0.5f;
                    float jz = (Hash(s.id + "z") % 100) / 100f - 0.5f;
                    go.transform.position = new Vector3(-18f + (k % 5) * 9f + jx, 0f, 7f + (k / 5) * 4.5f + jz);
                    go.transform.rotation = Quaternion.Euler(0f, 180f, 0f);
                }
                _spawned.Add(go);
            }

            EditorSceneManager.SaveScene(scene, ScenePath);
            AssetDatabase.SaveAssets();
            Debug.Log("[Residents] scene saved: " + ScenePath + " spawned=" + _spawned.Count + " walkers=" + _walkers.Count);
        }

        static AnimatorController EnsureController()
        {
            var ctrl = AssetDatabase.LoadAssetAtPath<AnimatorController>(CtrlPath);
            if (ctrl == null) ctrl = AnimatorController.CreateAnimatorControllerAtPath(CtrlPath);
            bool hasParam = false;
            foreach (var p in ctrl.parameters) if (p.name == "Walking") hasParam = true;
            if (!hasParam) ctrl.AddParameter("Walking", AnimatorControllerParameterType.Bool);

            var sm = ctrl.layers[0].stateMachine;
            AnimatorState idle = null, walk = null;
            foreach (var st in sm.states)
            {
                if (st.state.name == "Idle") idle = st.state;
                if (st.state.name == "Walk") walk = st.state;
            }
            if (idle == null) { idle = sm.AddState("Idle"); idle.motion = _idleClip; sm.defaultState = idle; }
            else if (idle.motion == null) idle.motion = _idleClip;
            if (walk == null) { walk = sm.AddState("Walk"); walk.motion = _walkClip; }
            else if (walk.motion == null) walk.motion = _walkClip;

            bool hasIdleToWalk = false, hasWalkToIdle = false;
            foreach (var t in idle.transitions) if (t.destinationState == walk) hasIdleToWalk = true;
            foreach (var t in walk.transitions) if (t.destinationState == idle) hasWalkToIdle = true;
            if (!hasIdleToWalk)
            {
                var t1 = idle.AddTransition(walk);
                t1.AddCondition(AnimatorConditionMode.If, 0f, "Walking");
                t1.duration = 0.15f; t1.exitTime = 0f;
            }
            if (!hasWalkToIdle)
            {
                var t2 = walk.AddTransition(idle);
                t2.AddCondition(AnimatorConditionMode.IfNot, 0f, "Walking");
                t2.duration = 0.2f; t2.exitTime = 0f;
            }
            EditorUtility.SetDirty(ctrl);
            AssetDatabase.SaveAssets();
            return ctrl;
        }

        // 行走环（±14m 矩形·28 点·每席相位错开）
        static List<Vector3> RouteLoop(float phaseFrac)
        {
            var loop = new List<Vector3>();
            const float S = 14f; const int per = 7;
            for (int k = 0; k < per; k++) loop.Add(new Vector3(-S + (2f * S) * k / (per - 1), 0f, -S));
            for (int k = 1; k < per; k++) loop.Add(new Vector3(S, 0f, -S + (2f * S) * k / (per - 1)));
            for (int k = 1; k < per; k++) loop.Add(new Vector3(S - (2f * S) * k / (per - 1), 0f, S));
            for (int k = 1; k < per; k++) loop.Add(new Vector3(-S, 0f, S - (2f * S) * k / (per - 1)));
            int n = loop.Count;
            int off = (int)(phaseFrac * n) % n;
            var route = new List<Vector3>(n);
            for (int i = 0; i < n; i++) route.Add(loop[(i + off) % n]);
            return route;
        }

        static int BridgeMaterials(GameObject go)
        {
            int conv = 0;
            foreach (var r in go.GetComponentsInChildren<Renderer>(true))
            {
                var mats = r.sharedMaterials;
                bool changed = false;
                for (int i = 0; i < mats.Length; i++)
                {
                    var m = mats[i];
                    if (m == null || m.shader == null) continue;
                    if (m.shader.name.Contains("Universal Render Pipeline")) continue;
                    var c = URPMaterialBridge.Convert(m);
                    if (c != null) { mats[i] = c; changed = true; conv++; }
                }
                if (changed) { r.sharedMaterials = mats; EditorUtility.SetDirty(r); }
            }
            return conv;
        }

        static void CaptureFrames()
        {
            EditorSceneManager.OpenScene(ScenePath, OpenSceneMode.Single);
            RenderCam(FindCam("B_R1a"), Path.Combine(ShotsDir, "B_R1a_residents_overview.jpg"));
            RenderCam(FindCam("B_R1b"), Path.Combine(ShotsDir, "B_R1b_idle_group.jpg"));
            RenderCam(FindCam("B_R1c"), Path.Combine(ShotsDir, "B_R1c_walk_loop.jpg"));
            RenderCam(FindCam("B_R1d"), Path.Combine(ShotsDir, "B_R1d_single.jpg"));
        }

        // ---------------- 基建（ShellBuilder 同款范式） ----------------

        static GameObject FindPf(string name, string packMark)
        {
            foreach (string guid in AssetDatabase.FindAssets(name + " t:Prefab"))
            {
                string p = AssetDatabase.GUIDToAssetPath(guid);
                if (p.Contains(packMark)) return AssetDatabase.LoadAssetAtPath<GameObject>(p);
            }
            throw new Exception("[Residents] prefab not found: " + name + " @pack " + packMark);
        }

        static Camera FindCam(string name)
        {
            var go = GameObject.Find(name);
            if (go == null) throw new Exception("[Residents] camera missing: " + name);
            return go.GetComponent<Camera>();
        }

        static Camera MakeCam(string name, Vector3 pos, Vector3 euler)
        {
            var go = new GameObject(name);
            var cam = go.AddComponent<Camera>();
            cam.fieldOfView = 45f; cam.nearClipPlane = 0.3f; cam.farClipPlane = 3000f;
            cam.enabled = false;
            cam.clearFlags = CameraClearFlags.SolidColor;
            cam.backgroundColor = new Color(0.10f, 0.12f, 0.16f);
            go.transform.position = pos;
            go.transform.rotation = Quaternion.Euler(euler);
            var cd = go.AddComponent<UnityEngine.Rendering.Universal.UniversalAdditionalCameraData>();
            cd.renderPostProcessing = false;
            return cam;
        }

        static void RenderCam(Camera cam, string path)
        {
            int w = 1920, h = 1080;
            var rt = new RenderTexture(w, h, 24);
            cam.targetTexture = rt;
            cam.Render();
            var prev = RenderTexture.active;
            RenderTexture.active = rt;
            var tex = new Texture2D(w, h, TextureFormat.RGB24, false);
            tex.ReadPixels(new Rect(0, 0, w, h), 0, 0);
            tex.Apply();
            File.WriteAllBytes(path, tex.EncodeToJPG(88));
            RenderTexture.active = prev;
            cam.targetTexture = null;
            UnityEngine.Object.DestroyImmediate(tex);
            rt.Release();
            UnityEngine.Object.DestroyImmediate(rt);
        }
    }
}
