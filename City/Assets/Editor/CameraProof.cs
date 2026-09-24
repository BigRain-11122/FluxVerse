// FluxVerse P-17 r14: batch proof harness for the dual-mode camera rig (sentinel pattern,
// r12/r13 style) + scene repair + cross-session reload gate. Proves, fail-loud:
//  1) PURE LOGIC on headless cores: smoothstep easing (bounds / monotonic / zero velocity at
//     both ends = no hard cut), focus clamping into the painted band (Zone anchors table),
//     L0 drift (bounded, periodic), tween simulation (midpoint, completion, first-step-from-
//     rest tiny, moving-target chase, retarget restarts from current).
//  2) SCENE REPAIR (SEPARATE FILE LAW fix): the r12/r13 adapters lived in mismatched .cs
//     files, so their saved scene references never re-resolved - every batch session saw
//     missing scripts (r13's silent fallback stacked 5 ghost CityAmbient GOs; r14's first
//     run NRE'd on GetComponent). Repair = delete the ghosts + dead camera components,
//     re-attach fresh (classes now in name-matched files), save BEFORE any motion.
//  3) REAL RENDERS from CityScene: L0 panorama sky-strip gates (view 40u > band 31u ->
//     sky always visible), mid-flight interpolation gate (size strictly between 20 and 9
//     at t=0.6s - hard cuts impossible), L1 street gates at Zone_QUANT and BrainTower
//     (sky-free frame = true zoom, QUANT gold face warmth, tower-face brightness), L0
//     return gate (size 20 + live drift + panorama sky restored).
//  4) RELOAD GATE (sentinel logs/reload.run): a SECOND editor session re-opens the saved
//     scene and asserts all three components RESOLVE (the gate r12/r13 never ran - that
//     is how the dead wiring went unnoticed), plus one cold-start render.
// Sentinels: <repo>/logs/camera.run -> <repo>/logs/camera.done;
//            <repo>/logs/reload.run -> <repo>/logs/reload.done (OK/FAIL reports).
// Screenshots: <repo>/docs/design/m1-r14-{l0,mid,l1-quant,l1-tower,l0-return,reload}.png
// Night tier + clear weather injected (matches the live 21:xx Beijing tier); ambient visual
// quads are runtime-only (r13 law) so the proof calls EnsureVisuals like AmbientProof did.
// All comments ASCII. No 3D.
using System;
using System.IO;
using UnityEngine;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine.SceneManagement;

namespace FluxVerse
{
    public static class CameraProof
    {
        static string ProjectRoot { get { return Path.GetDirectoryName(Application.dataPath); } }
        static string RepoRoot { get { return Path.GetDirectoryName(ProjectRoot); } }
        static string SentinelPath { get { return Path.Combine(RepoRoot, "logs", "camera.run"); } }
        static string DonePath { get { return Path.Combine(RepoRoot, "logs", "camera.done"); } }
        static string ReloadSentinelPath { get { return Path.Combine(RepoRoot, "logs", "reload.run"); } }
        static string ReloadDonePath { get { return Path.Combine(RepoRoot, "logs", "reload.done"); } }
        static string ScenePath { get { return "Assets/Scenes/CityScene.unity"; } }
        static int asserts;

        [InitializeOnLoadMethod]
        static void Hook()
        {
            if (File.Exists(SentinelPath))
                EditorApplication.delayCall += Run;
            if (File.Exists(ReloadSentinelPath))
                EditorApplication.delayCall += ReloadGateRun;
        }

        public static void BatchRun() { Run(); }

        static void Run()
        {
            if (!File.Exists(SentinelPath)) return;   // single-shot guard
            try
            {
                string report = Prove();
                File.WriteAllText(DonePath, "OK " + report + " ts=" + DateTime.UtcNow.ToString("o"));
            }
            catch (Exception e)
            {
                File.WriteAllText(DonePath, "FAIL " + e.GetType().Name + ": " + e.Message + " | " + e.StackTrace
                    + " ts=" + DateTime.UtcNow.ToString("o"));
            }
            finally
            {
                if (File.Exists(SentinelPath)) File.Delete(SentinelPath);
            }
        }

        static void Chk(bool ok, string what)
        {
            if (!ok) throw new InvalidOperationException("ASSERT FAIL: " + what);
            asserts++;
        }

        // ---- second-session gate: the saved scene must re-resolve ALL components ----
        public static void ReloadGateRun()
        {
            if (!File.Exists(ReloadSentinelPath)) return;   // single-shot guard
            try
            {
                asserts = 0;
                string report = ReloadProve();
                File.WriteAllText(ReloadDonePath, "OK " + report + " ts=" + DateTime.UtcNow.ToString("o"));
            }
            catch (Exception e)
            {
                File.WriteAllText(ReloadDonePath, "FAIL " + e.GetType().Name + ": " + e.Message + " | "
                    + e.StackTrace + " ts=" + DateTime.UtcNow.ToString("o"));
            }
            finally
            {
                if (File.Exists(ReloadSentinelPath)) File.Delete(ReloadSentinelPath);
            }
        }

        static string ReloadProve()
        {
            Scene scene = EditorSceneManager.OpenScene(ScenePath, OpenSceneMode.Single);
            GameObject ambGo = GameObject.Find("CityAmbient");
            Chk(ambGo != null, "reload: CityAmbient GO missing");
            CityAmbient amb = ambGo != null ? ambGo.GetComponent<CityAmbient>() : null;
            Chk(amb != null, "reload: CityAmbient component did not resolve (name-law fix failed)");
            GameObject routerGo = GameObject.Find("CityEventRouter");
            Chk(routerGo != null, "reload: CityEventRouter GO missing");
            CityEventRouter router = routerGo != null ? routerGo.GetComponent<CityEventRouter>() : null;
            Chk(router != null, "reload: CityEventRouter component did not resolve");
            GameObject camGo = GameObject.Find("CityCamera");
            Chk(camGo != null, "reload: CityCamera missing");
            CityCameraRig rig = camGo != null ? camGo.GetComponent<CityCameraRig>() : null;
            Chk(rig != null, "reload: CityCameraRig component did not resolve");
            Camera cam = camGo != null ? camGo.GetComponent<Camera>() : null;
            Chk(cam != null && Mathf.Abs(cam.orthographicSize - 20f) < 0.01f,
                "reload: camera must stay at L0 size 20");
            int ambCount = 0;
            foreach (GameObject root in scene.GetRootGameObjects())
                if (root.name == "CityAmbient") ambCount++;
            Chk(ambCount == 1, "reload: exactly one CityAmbient expected, got " + ambCount);
            // cold-start visuals + one render as live evidence (no re-save: gate is read-only)
            amb.EnsureVisuals();
            amb.ApplyAmbient(AmbientTier.Night);
            amb.ApplyWeather("clear", 0f, 0);
            amb.StepWeather(0.1f);
            rig.Advance(0f);
            Texture2D shot = Shot(cam, "m1-r14-reload.png");
            int rTop = SkyRowsPx(shot, cam, 13f, true);
            int rBot = SkyRowsPx(shot, cam, 13f, false);
            Chk(rTop >= 100 && rTop <= 180, "reload: top sky strip out of range: " + rTop);
            Chk(rBot >= 80 && rBot <= 140, "reload: bottom sky strip out of range: " + rBot);
            DestroyShot(shot);
            return "asserts=" + asserts + " sky=" + rTop + "/" + rBot + " shots=1";
        }

        static bool V2Eq(Vector2 a, Vector2 b, float eps)
        {
            return Mathf.Abs(a.x - b.x) <= eps && Mathf.Abs(a.y - b.y) <= eps;
        }

        static string Prove()
        {
            // ---- A1. easing: bounds, midpoint, symmetry, monotonic, zero end velocity ----
            Chk(RigMath.EaseInOut(0f) == 0f, "ease(0) must be 0");
            Chk(RigMath.EaseInOut(1f) == 1f, "ease(1) must be 1");
            Chk(Mathf.Abs(RigMath.EaseInOut(0.5f) - 0.5f) < 1e-5f, "ease(0.5) must be 0.5");
            Chk(Mathf.Abs(RigMath.EaseInOut(0.25f) + RigMath.EaseInOut(0.75f) - 1f) < 1e-4f,
                "ease must be symmetric");
            float prev = -1f; bool mono = true; 
            for (int i = 0; i <= 20; i++)
            {
                float v = RigMath.EaseInOut(i / 20f);
                if (v < prev - 1e-6f) mono = false;
                prev = v;
            }
            Chk(mono && RigMath.EaseInOut(1f) - RigMath.EaseInOut(0f) > 0.99f, "ease must be monotonic rise");
            Chk(RigMath.EaseInOut(0.03f) < 0.003f, "ease must start from rest (no launch jump)");
            Chk(RigMath.EaseInOut(0.97f) > 0.997f, "ease must land softly (no landing cut)");

            // ---- A2. spec constants (P-17: L0 size 20, L1 size 9, 1.2s switch) ----
            Chk(RigMath.L0Size == 20f, "L0 panorama size must be 20");
            Chk(RigMath.L1Size == 9f, "L1 street size must be 9");
            Chk(RigMath.SwitchSeconds == 1.2f, "switch duration must be 1.2s");

            // ---- A3. focus clamping into the painted band (Zone anchor table) ----
            Chk(V2Eq(RigMath.ClampFocus(new Vector2(0f, -12f), 9f, 16f), new Vector2(0f, -7f), 1e-4f),
                "Zone_QUANT anchor must clamp to (0,-7)");
            Chk(V2Eq(RigMath.ClampFocus(new Vector2(0f, 11f), 9f, 16f), new Vector2(0f, 5f), 1e-4f),
                "BrainTower anchor must clamp to (0,5)");
            Chk(V2Eq(RigMath.ClampFocus(new Vector2(-21.5f, -10f), 9f, 16f), new Vector2(-21.5f, -7f), 1e-4f),
                "Zone_GAME anchor must clamp to (-21.5,-7)");
            Chk(V2Eq(RigMath.ClampFocus(new Vector2(60f, 30f), 9f, 16f), new Vector2(34f, 5f), 1e-4f),
                "far NE click must clamp into the band corner");
            Chk(V2Eq(RigMath.ClampFocus(new Vector2(-60f, -30f), 9f, 16f), new Vector2(-34f, -7f), 1e-4f),
                "far SW click must clamp into the band corner");
            Chk(V2Eq(RigMath.ClampFocus(new Vector2(10f, 0f), 9f, 16f), new Vector2(10f, 0f), 1e-4f),
                "inside-band click must stay put");

            // ---- A4. L0 drift: starts at rest, bounded, x-periodic ----
            Chk(V2Eq(RigMath.DriftOffset(0f), Vector2.zero, 1e-5f), "drift must start at center");
            bool bounded = true;
            for (float t = 0f; t < 100f; t += 0.37f)
            {
                Vector2 d = RigMath.DriftOffset(t);
                if (Mathf.Abs(d.x) > RigMath.DriftAmpX + 1e-4f || Mathf.Abs(d.y) > RigMath.DriftAmpY + 1e-4f)
                    bounded = false;
            }
            Chk(bounded, "drift must stay inside its amplitude box");
            Chk(Mathf.Abs(RigMath.DriftOffset(48f).x) < 1e-4f, "drift x must be 48s-periodic");
            Chk(RigMath.DriftOffset(9.25f).y > 0.99f, "drift y quarter period must peak");

            // ---- A5. tween simulation: midpoint, completion, no-jump, moving target ----
            RigTween tw = new RigTween();
            tw.Snap(Vector2.zero, 20f);
            tw.MoveTo(new Vector2(0f, -7f), 9f, 1.2f);
            Chk(tw.Moving, "tween must report moving after MoveTo");
            tw.Step(0.6f);
            Chk(Mathf.Abs(tw.Size - 14.5f) < 0.01f, "tween midpoint size must be 14.5");
            Chk(Mathf.Abs(tw.Pos.y + 3.5f) < 0.01f, "tween midpoint pos must be halfway");
            Chk(tw.Moving, "tween must still move at half time");
            tw.Step(0.6f);
            Chk(!tw.Moving, "tween must finish at duration");
            Chk(Mathf.Abs(tw.Size - 9f) < 1e-4f, "tween must land exactly on target size");
            Chk(V2Eq(tw.Pos, new Vector2(0f, -7f), 1e-4f), "tween must land exactly on target pos");
            // first step from rest must be tiny (hard cut impossible at transition start)
            RigTween tw2 = new RigTween();
            tw2.Snap(Vector2.zero, 20f);
            tw2.MoveTo(new Vector2(34f, -7f), 9f, 1.2f);
            tw2.Step(0.05f);
            Chk(Vector2.Distance(tw2.Pos, Vector2.zero) < 0.3f,
                "first 50ms from rest must barely move (start-continuity gate)");
            // moving-target chase: retarget mid-flight, land on the LIVE target
            RigTween tw3 = new RigTween();
            tw3.Snap(Vector2.zero, 20f);
            tw3.MoveTo(new Vector2(10f, 0f), 9f, 1.2f);
            for (int i = 0; i < 24; i++) { tw3.ToPos = new Vector2(12f, 0f); tw3.Step(0.05f); }
            Chk(V2Eq(tw3.Pos, new Vector2(12f, 0f), 0.01f),
                "tween must land on the live (moved) target - L0 drift chase");
            // retarget restarts from current state, never teleports
            tw3.MoveTo(new Vector2(0f, 0f), 20f, 1.2f);
            tw3.Step(0.05f);
            Chk(Vector2.Distance(tw3.Pos, new Vector2(12f, 0f)) < 0.3f,
                "second MoveTo must start from current pos (no teleport)");

            // ---- B. scene repair + wiring (SEPARATE FILE LAW fix), saved BEFORE any motion ----
            // r51 NON-DESTRUCTIVE repair: the r14 routine deleted the CityAmbient /
            // CityEventRouter roots unconditionally and rebuilt bare ones. Correct in the
            // r14 era (nothing was serialized on those GOs yet), but r25/r31/r34 later grew
            // serialized wiring onto them (event-router clips, ambient audio bed + 8 clips,
            // skyline sprite fields) - the first post-r31 run of this proof destroyed the
            // bed wiring on save and the SkylineProof r31 regression caught it. Ghosts now
            // mean DUPLICATES and dead shells only; the healthy first-born keeps every
            // serialized field. The camera keeps the same conservatism: only missing-script
            // stubs and the rig (rebuilt fresh below) are stripped, never unknown future
            // serialized components.
            Scene scene = EditorSceneManager.OpenScene(ScenePath, OpenSceneMode.Single);
            int ghosts = 0;
            GameObject ambGo = null, routerGo = null;
            foreach (GameObject root in scene.GetRootGameObjects())   // snapshot array
            {
                if (root.name != "CityAmbient" && root.name != "CityEventRouter") continue;
                bool dead = GameObjectUtility.GetMonoBehavioursWithMissingScriptCount(root) > 0;
                bool dup = (root.name == "CityAmbient" && ambGo != null)
                        || (root.name == "CityEventRouter" && routerGo != null);
                if (dead || dup)
                { ghosts++; UnityEngine.Object.DestroyImmediate(root); }
                else if (root.name == "CityAmbient") ambGo = root;
                else routerGo = root;
            }
            GameObject camGo = GameObject.Find("CityCamera");
            Chk(camGo != null, "CityCamera missing in CityScene");
            Camera cam = camGo.GetComponent<Camera>();
            Chk(cam != null, "CityCamera has no Camera component");
            int stripped = 0;
            int missing = GameObjectUtility.GetMonoBehavioursWithMissingScriptCount(camGo);
            if (missing > 0)   // dead references enumerate as null - use the proper API
            {
                GameObjectUtility.RemoveMonoBehavioursWithMissingScript(camGo);
                stripped += missing;
            }
            Component[] comps = camGo.GetComponents<Component>();
            foreach (Component c in comps)
                if (c is CityCameraRig)
                { UnityEngine.Object.DestroyImmediate(c); stripped++; }
            CityCameraRig rig = camGo.AddComponent<CityCameraRig>();
            Chk(rig != null, "CityCameraRig failed to attach");
            if (ambGo == null) { ambGo = new GameObject("CityAmbient"); }
            CityAmbient amb = ambGo.GetComponent<CityAmbient>();
            if (amb == null) amb = ambGo.AddComponent<CityAmbient>();
            Chk(amb != null, "CityAmbient failed to attach");
            if (routerGo == null) { routerGo = new GameObject("CityEventRouter"); }
            CityEventRouter router = routerGo.GetComponent<CityEventRouter>();
            if (router == null) router = routerGo.AddComponent<CityEventRouter>();
            Chk(router != null, "CityEventRouter failed to attach");
            int ambCount = 0;
            foreach (GameObject root in scene.GetRootGameObjects())
                if (root.name == "CityAmbient") ambCount++;
            Chk(ambCount == 1, "exactly one CityAmbient must remain, got " + ambCount);
            bool saved = EditorSceneManager.SaveScene(scene);   // persist repair + wiring only
            Chk(saved, "scene save failed");
            amb.EnsureVisuals();                                 // runtime-only quads (r13 law)
            amb.ApplyAmbient(AmbientTier.Night);                 // live tier at 21:xx Beijing
            amb.ApplyWeather("clear", 0f, 0);
            amb.StepWeather(0.1f);

            // ---- C1. L0 panorama render: both sky strips visible (view 40u > band 31u) ----
            rig.Advance(0f);                                     // adopt persisted profile
            Chk(rig.Level == CamLevel.L0Panorama, "rig must boot at L0");
            Chk(Mathf.Abs(rig.SizeNow - 20f) < 0.01f, "boot size must be L0 20");
            Texture2D l0Shot = Shot(cam, "m1-r14-l0.png");
            int s0top = SkyRowsPx(l0Shot, cam, 13f, true);
            int s0bot = SkyRowsPx(l0Shot, cam, 13f, false);
            Chk(s0top >= 100 && s0top <= 180, "L0 top sky strip out of range: " + s0top + " (expect ~135)");
            Chk(s0bot >= 80 && s0bot <= 140, "L0 bottom sky strip out of range: " + s0bot + " (expect ~108)");

            // ---- C2. focus Zone_QUANT: mid-flight gate, then street-level gates ----
            rig.FocusOn(new Vector2(0f, -12f));                  // Zone_QUANT anchor
            Chk(rig.Level == CamLevel.L1Street, "FocusOn must switch to L1");
            for (int i = 0; i < 12; i++) rig.Advance(0.05f);     // 0.6s = half of 1.2s
            Chk(rig.PosNow.y > -4.2f && rig.PosNow.y < -2.8f,
                "mid-flight pos must be near halfway: " + rig.PosNow.y.ToString("F2"));
            float midSize = rig.SizeNow;
            Chk(midSize > 10f && midSize < 19f,
                "mid-flight size must be strictly between 20 and 9: " + midSize.ToString("F2"));
            Texture2D midShot = Shot(cam, "m1-r14-mid.png");      // in-flight evidence
            for (int i = 0; i < 15; i++) rig.Advance(0.05f);      // finish the 1.2s
            Chk(Mathf.Abs(rig.SizeNow - 9f) < 0.01f, "L1 size must land at 9");
            Chk(V2Eq(rig.PosNow, new Vector2(0f, -7f), 0.01f),
                "L1 center must be the clamped anchor: " + rig.PosNow.ToString("F2"));
            Texture2D l1Shot = Shot(cam, "m1-r14-l1-quant.png");
            int s1top = SkyRowsPx(l1Shot, cam, 13f, true);
            int s1bot = SkyRowsPx(l1Shot, cam, 13f, false);
            Chk(s1top <= 30, "L1 street view must fill the frame with city (top sky: " + s1top + ")");
            Chk(s1bot <= 30, "L1 street view must fill the frame with city (bottom sky: " + s1bot + ")");
            float quantBri, quantWarm;
            BoxMetrics(l1Shot, cam, 0f, -5.5f, out quantBri, out quantWarm);
            Chk(quantWarm > 0.10f, "QUANT gold face missing in street view: " + quantWarm.ToString("F3"));
            DestroyShot(midShot);

            // ---- C3. focus BrainTower: street view of the tower face ----
            rig.FocusOn(new Vector2(0f, 11f));                    // BrainTower anchor
            for (int i = 0; i < 27; i++) rig.Advance(0.05f);
            Chk(Mathf.Abs(rig.SizeNow - 9f) < 0.01f, "retarget must land at L1 size again");
            Chk(V2Eq(rig.PosNow, new Vector2(0f, 5f), 0.01f), "tower focus must clamp to (0,5)");
            Texture2D l1Tower = Shot(cam, "m1-r14-l1-tower.png");
            int s2top = SkyRowsPx(l1Tower, cam, 13f, true);
            int s2bot = SkyRowsPx(l1Tower, cam, 13f, false);
            Chk(s2top <= 30, "tower street view must be sky-free (top: " + s2top + ")");
            Chk(s2bot <= 30, "tower street view must be sky-free (bottom: " + s2bot + ")");
            float towerBri, towerWarm;
            BoxMetrics(l1Tower, cam, 0f, 12f, out towerBri, out towerWarm);
            Chk(towerBri > 0.30f, "brain tower face missing in street view: " + towerBri.ToString("F3"));
            DestroyShot(l1Tower);

            // ---- C4. back to L0: eased return onto the LIVE drift, panorama restored ----
            rig.BackToL0();
            for (int i = 0; i < 27; i++) rig.Advance(0.05f);
            Chk(rig.Level == CamLevel.L0Panorama, "BackToL0 must return to L0");
            Chk(Mathf.Abs(rig.SizeNow - 20f) < 0.01f, "return must land at size 20");
            Chk(V2Eq(rig.PosNow, rig.DriftTargetNow, 0.02f),
                "L0 pos must equal the live drift target (seamless chase)");
            Chk(rig.PosNow.magnitude > 0.5f, "drift must have carried the camera off-center");
            Texture2D l0Back = Shot(cam, "m1-r14-l0-return.png");
            int s3top = SkyRowsPx(l0Back, cam, 13f, true);
            int s3bot = SkyRowsPx(l0Back, cam, 13f, false);
            Chk(s3top >= 100 && s3top <= 180, "returned panorama top sky strip: " + s3top);
            Chk(s3bot >= 80 && s3bot <= 140, "returned panorama bottom sky strip: " + s3bot);
            DestroyShot(l0Back);

            DestroyShot(l0Shot);
            DestroyShot(l1Shot);

            return "asserts=" + asserts
                + " repair(ghosts=" + ghosts + ", cam_stripped=" + stripped + ")"
                + " sky(l0=" + s0top + "/" + s0bot + ", quant=" + s1top + "/" + s1bot
                + ", tower=" + s2top + "/" + s2bot + ", ret=" + s3top + "/" + s3bot + ")"
                + " mid_size=" + midSize.ToString("F2")
                + " faces(quant_warm=" + quantWarm.ToString("F2")
                + ", tower_bri=" + towerBri.ToString("F2") + ")"
                + " l0_return_pos=" + rig.PosNow.ToString("F2")
                + " scene_saved=" + saved + " shots=5 reload_gate=pass2";
        }

        static void DestroyShot(Texture2D t) { UnityEngine.Object.DestroyImmediate(t); }

        static Texture2D Shot(Camera cam, string name)
        {
            RenderTexture rt = new RenderTexture(1920, 1080, 24, RenderTextureFormat.ARGB32);
            cam.targetTexture = rt;
            cam.Render();
            RenderTexture.active = rt;
            Texture2D tex = new Texture2D(1920, 1080, TextureFormat.RGBA32, false);
            tex.ReadPixels(new Rect(0, 0, 1920, 1080), 0, 0);
            tex.Apply();
            cam.targetTexture = null;
            RenderTexture.active = null;
            rt.Release();
            UnityEngine.Object.DestroyImmediate(rt);
            File.WriteAllBytes(Path.Combine(RepoRoot, "docs", "design", name), tex.EncodeToPNG());
            return tex;
        }

        // ZOOM PROOF METRIC: count sky rows in one screen half (worldX=13 = building-free
        // column). Night sky = dark (avg < 0.13) and NOT blue-dominant (b-r < 0.18) -
        // measured from real renders: skyBottom 0.112/0.145, skyTop 0.033/0.047, while the
        // dark-blue river is 0.159/0.220 and every paved surface is brighter than 0.13.
        // Geometry makes this a sound zoom gate: panorama view is 40u tall vs the 31u
        // painted band, so >= 9u (243px) of sky is ALWAYS visible at size 20 (some half
        // keeps >= 100px); the street view is 18u, clamped inside the band -> 0 sky.
        // A camera that pans without zooming cannot pass both halves <= 30.
        static int SkyRowsPx(Texture2D tex, Camera cam, float worldX, bool topHalf)
        {
            float halfH = cam.orthographicSize;
            float halfW = halfH * (1920f / 1080f);
            int cx = (int)(((worldX - cam.transform.position.x) / (2f * halfW) + 0.5f) * 1920f);
            if (cx < 1 || cx >= 1919) return 0;
            int y0 = topHalf ? 540 : 0, y1 = topHalf ? 1080 : 540;   // tex row 0 = view bottom
            int n = 0;
            for (int y = y0; y < y1; y++)
            {
                Color c = tex.GetPixel(cx, y);
                if ((c.r + c.g + c.b) / 3f < 0.13f && c.b - c.r < 0.18f) n++;
            }
            return n;
        }

        // average luminance + warmth (r-b) in a 40px-radius box around a world position (ortho)
        static void BoxMetrics(Texture2D tex, Camera cam, float wx, float wy, out float brightness, out float warmth)
        {
            float halfH = cam.orthographicSize;
            float halfW = halfH * (1920f / 1080f);
            int cx = (int)(((wx - cam.transform.position.x) / (2f * halfW) + 0.5f) * 1920f);
            int cy = (int)(((wy - cam.transform.position.y) / (2f * halfH) + 0.5f) * 1080f);
            double sumBri = 0, sumWarm = 0; int n = 0;
            for (int y = cy - 40; y <= cy + 40; y += 4)
                for (int x = cx - 40; x <= cx + 40; x += 4)
                {
                    if (x < 0 || x >= 1920 || y < 0 || y >= 1080) continue;
                    Color c = tex.GetPixel(x, y);
                    sumBri += (c.r + c.g + c.b) / 3.0;
                    sumWarm += c.r - c.b;
                    n++;
                }
            int nn = System.Math.Max(1, n);
            brightness = (float)(sumBri / nn);
            warmth = (float)(sumWarm / nn);
        }
    }
}
