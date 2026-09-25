// FluxVerse P-15 r12: batch proof harness for the event router (sentinel pattern, r11 builder style).
// r115 (P-12 slice 4) extension: proves the five city-core engine faces.
// r116 (P-41 slice 1) extension: canon faces -- CEO_ORDER WHITE ANTENNA pulse (brightness
//     up + warmth NEUTRAL over the roofline; the gold family is the explicit fail line)
//     + COMMIT river-crossing stream (lane law + river/street distinctness + water-box
//     render gate).
// Proves, fail-loud:
//  A. stream logic end-to-end on a SANDBOX file under logs/ (never touches world/ — engine reads world only):
//     seed 3 lines -> SeekToEnd -> poll=0 (no history replay); append 1 CEO_ORDER + 1 noise -> poll fires exactly 1;
//     4s simulated time drains every pulse (edit mode -> DestroyImmediate, no leaks).
//  A2. five-type sandbox (r115): OS_TICK_START/DONE breath state machine (ramp-in 2s / ramp-out dead),
//     GATE_PASS dot-flow lifetime (~2.7s), GATE_BLOCK band (1.4s), TRANSFER band (3.0s), GO leak sweep.
//  A3. COMMIT sandbox (r116): river-stream face spawns in fx (ZERO glow pulses, r30 pulse-list law),
//     lane law, distinctness law (river vs street domains), ~3.16s lifetime, leak sweep.
//  B. real scene: wire the persistent router, save. C. CEO_ORDER -> WHITE ANTENNA pulse RENDERS over
//     the tower top (r116 canon law: brightness up + warmth neutral; gold family = fail). C2. the four
//     r115 faces each RENDER with a metric gate (r12 box law):
//     breath = blue (warmth NEGATIVE shift) over the tower; gate flow = brightness up at the tower foot;
//     gate block = red (warmth positive shift); transfer band = brightness+cool shift on the south trunk,
//     plus the DISTINCTNESS law (street band south of the water rows, COMMIT's river stream stays apart).
//     C2e (r116): COMMIT river stream renders in the water box (brightness delta + cyan core-pixel census).
//  D. no presenter GO survives (runtime-only law, nothing saved).
//  Pass 2 (separate editor session) = ReloadGate: cross-session scene persistence (r14 stub disease law).
// Sentinel: <repo>/logs/eventrouter.run -> proof -> <repo>/logs/eventrouter.done (OK/FAIL report).
//           <repo>/logs/eventrouter-reload.run -> <repo>/logs/eventrouter-reload.done
// All comments ASCII. No 3D. Shots: docs/design/m1-r116-p41-ceo-{before,white}.png
//           + m1-r115-p12-{breath,gatepass,gateblock,transfer}.png + m1-r116-p41-commit.png
using System;
using System.IO;
using UnityEngine;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine.SceneManagement;

namespace FluxVerse
{
    public static class EventRouterProof
    {
        static string ProjectRoot { get { return Path.GetDirectoryName(Application.dataPath); } }
        static string RepoRoot { get { return Path.GetDirectoryName(ProjectRoot); } }
        static string SentinelPath { get { return Path.Combine(RepoRoot, "logs", "eventrouter.run"); } }
        static string DonePath { get { return Path.Combine(RepoRoot, "logs", "eventrouter.done"); } }
        static string ReloadRunPath { get { return Path.Combine(RepoRoot, "logs", "eventrouter-reload.run"); } }
        static string ReloadDonePath { get { return Path.Combine(RepoRoot, "logs", "eventrouter-reload.done"); } }
        static string SandboxPath { get { return Path.Combine(RepoRoot, "logs", "eventrouter-sandbox.jsonl"); } }
        static string ScenePath { get { return "Assets/Scenes/CityScene.unity"; } }

        static readonly string[] LeakNames = { "EventPulse", "TowerBreath", "GateDot", "GateBlockBand", "TransferBand", "CommitDot" };

        [InitializeOnLoadMethod]
        static void Hook()
        {
            if (File.Exists(SentinelPath)) EditorApplication.delayCall += Run;
            if (File.Exists(ReloadRunPath)) EditorApplication.delayCall += ReloadRun;
        }

        public static void BatchRun() { Run(); }
        public static void ReloadGate() { ReloadRun(); }

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

        static void ReloadRun()
        {
            if (!File.Exists(ReloadRunPath)) return;   // single-shot guard
            try
            {
                string report = ReloadProve();
                File.WriteAllText(ReloadDonePath, "OK " + report + " ts=" + DateTime.UtcNow.ToString("o"));
            }
            catch (Exception e)
            {
                File.WriteAllText(ReloadDonePath, "FAIL " + e.GetType().Name + ": " + e.Message + " | " + e.StackTrace
                    + " ts=" + DateTime.UtcNow.ToString("o"));
            }
            finally
            {
                if (File.Exists(ReloadRunPath)) File.Delete(ReloadRunPath);
            }
        }

        static string Prove()
        {
            // ---- A. sandbox stream logic (runs in the throwaway boot scene, nothing saved) ----
            if (File.Exists(SandboxPath)) File.Delete(SandboxPath);
            File.WriteAllText(SandboxPath,
                "{\"ts_utc\":\"2026-09-23T10:00:00Z\",\"type\":\"RESIDENT_SAY\",\"summary\":\"seed noise\"}\n" +
                "{\"ts_utc\":\"2026-09-23T10:01:00Z\",\"type\":\"CEO_ORDER\",\"zone\":\"quant\",\"summary\":\"seed order (history, must NOT fire)\"}\n" +
                "{\"ts_utc\":\"2026-09-23T10:02:00Z\",\"type\":\"FX_TICK\",\"summary\":\"seed noise\"}\n");
            FluxEventRouter sandbox = new FluxEventRouter(SandboxPath, n => new Vector3(0f, 11f, 0f));
            sandbox.SeekToEnd();
            int f0 = sandbox.PollOnce();
            if (f0 != 0) throw new InvalidOperationException("history replayed: SeekToEnd broken, fired=" + f0);
            File.AppendAllText(SandboxPath,
                "{\"ts_utc\":\"2026-09-23T10:03:00Z\",\"type\":\"CEO_ORDER\",\"zone\":\"media\",\"summary\":\"appended live order (must fire)\"}\n" +
                "{\"ts_utc\":\"2026-09-23T10:04:00Z\",\"type\":\"FX_TICK\",\"summary\":\"appended noise\"}\n");
            int f1 = sandbox.PollOnce();
            if (f1 != 1) throw new InvalidOperationException("append detection broken: expected 1, fired=" + f1);
            if (sandbox.PulseCount != 1) throw new InvalidOperationException("pulse spawn broken: count=" + sandbox.PulseCount);
            for (int i = 0; i < 40; i++) sandbox.Tick(0.1f);   // 4.0s simulated > 2.4s life
            if (sandbox.PulseCount != 0) throw new InvalidOperationException("pulse leak: " + sandbox.PulseCount + " not destroyed");

            // ---- A2. five-type sandbox (r115 P-12 slice 4) ----
            File.AppendAllText(SandboxPath,
                "{\"ts_utc\":\"2026-09-23T10:05:00Z\",\"type\":\"OS_TICK_START\",\"summary\":\"round opens (breath in)\"}\n" +
                "{\"ts_utc\":\"2026-09-23T10:06:00Z\",\"type\":\"FX_TICK\",\"summary\":\"noise\"}\n");
            int f2 = sandbox.PollOnce();
            if (f2 != 1) throw new InvalidOperationException("START poll fired=" + f2 + " (expected 1)");
            if (!sandbox.BreathAlive) throw new InvalidOperationException("OS_TICK_START did not spawn the breath");
            for (int i = 0; i < 20; i++) sandbox.Tick(0.1f);   // 2.0s ramp-in
            if (sandbox.BreathAlpha < 0.99f)
                throw new InvalidOperationException("breath ramp-in stuck: alpha=" + sandbox.BreathAlpha.ToString("F3"));

            File.AppendAllText(SandboxPath,
                "{\"ts_utc\":\"2026-09-23T10:07:00Z\",\"type\":\"GATE_PASS\",\"summary\":\"gate ok\"}\n" +
                "{\"ts_utc\":\"2026-09-23T10:08:00Z\",\"type\":\"FX_TICK\",\"summary\":\"noise\"}\n");
            int f3 = sandbox.PollOnce();
            if (f3 != 1) throw new InvalidOperationException("GATE_PASS poll fired=" + f3 + " (expected 1)");
            if (sandbox.EffectsCount != 1) throw new InvalidOperationException("GATE_PASS face count=" + sandbox.EffectsCount);
            for (int i = 0; i < 8; i++) sandbox.Tick(0.1f);    // 0.8s: flow still alive
            if (sandbox.EffectsCount != 1) throw new InvalidOperationException("gate flow died early");
            for (int i = 0; i < 25; i++) sandbox.Tick(0.1f);   // +2.5s: flow drained (2.72s total)
            if (sandbox.EffectsCount != 0) throw new InvalidOperationException("gate flow leak: " + sandbox.EffectsCount);

            File.AppendAllText(SandboxPath,
                "{\"ts_utc\":\"2026-09-23T10:09:00Z\",\"type\":\"GATE_BLOCK\",\"summary\":\"gate fail\"}\n" +
                "{\"ts_utc\":\"2026-09-23T10:10:00Z\",\"type\":\"TRANSFER\",\"summary\":\"leg landed\"}\n" +
                "{\"ts_utc\":\"2026-09-23T10:11:00Z\",\"type\":\"HEARTBEAT\",\"summary\":\"unrouted noise\"}\n");
            int f4 = sandbox.PollOnce();
            if (f4 != 2) throw new InvalidOperationException("BLOCK+TRANSFER poll fired=" + f4 + " (expected 2)");
            if (sandbox.EffectsCount != 2) throw new InvalidOperationException("block+transfer face count=" + sandbox.EffectsCount);
            for (int i = 0; i < 16; i++) sandbox.Tick(0.1f);   // 1.6s: band dead (1.4s), transfer alive (3.0s)
            if (sandbox.EffectsCount != 1) throw new InvalidOperationException("band flash lifetime wrong: " + sandbox.EffectsCount);
            for (int i = 0; i < 20; i++) sandbox.Tick(0.1f);   // +2.0s: transfer drained
            if (sandbox.EffectsCount != 0) throw new InvalidOperationException("transfer band leak: " + sandbox.EffectsCount);

            File.AppendAllText(SandboxPath,
                "{\"ts_utc\":\"2026-09-23T10:12:00Z\",\"type\":\"OS_TICK_DONE\",\"summary\":\"round ends (breath out)\"}\n");
            int f5 = sandbox.PollOnce();
            if (f5 != 1) throw new InvalidOperationException("DONE poll fired=" + f5 + " (expected 1)");
            for (int i = 0; i < 16; i++) sandbox.Tick(0.1f);   // 1.6s ramp-out
            if (sandbox.BreathAlive) throw new InvalidOperationException("breath survived OS_TICK_DONE");

            // ---- A3. COMMIT canon face sandbox (r116 P-41 slice 1) ----
            File.AppendAllText(SandboxPath,
                "{\"ts_utc\":\"2026-09-23T10:13:00Z\",\"type\":\"COMMIT\",\"zone\":\"gaming\",\"summary\":\"commit in game city\"}\n" +
                "{\"ts_utc\":\"2026-09-23T10:14:00Z\",\"type\":\"FX_TICK\",\"summary\":\"noise\"}\n");
            int f6 = sandbox.PollOnce();
            if (f6 != 1) throw new InvalidOperationException("COMMIT poll fired=" + f6 + " (expected 1)");
            if (sandbox.PulseCount != 0)
                throw new InvalidOperationException("COMMIT must not spawn a glow pulse (pulse-list law, r30)");
            if (sandbox.EffectsCount != 1)
                throw new InvalidOperationException("COMMIT face count=" + sandbox.EffectsCount + " (expected 1)");
            if (CommitStream.LaneX("gaming") != -21f || CommitStream.LaneX("media") != 21f
                || CommitStream.LaneX("quant") != 0f || CommitStream.LaneX("governance") != 0f)
                throw new InvalidOperationException("commit lane law broken (three nerve trunk arteries)");
            // distinctness law (r114): the river domain and the street band never overlap
            if (CommitStream.Y0 <= -6.5f)
                throw new InvalidOperationException("commit stream dips into the street band domain: Y0=" + CommitStream.Y0.ToString("F2"));
            if (CommitStream.Y1 < 3.5f)
                throw new InvalidOperationException("commit stream must clear the water band: Y1=" + CommitStream.Y1.ToString("F2"));
            if (TransferBand.BandY >= CommitStream.Y0)
                throw new InvalidOperationException("street/river domains overlap: bandY=" + TransferBand.BandY.ToString("F2"));
            for (int i = 0; i < 38; i++) sandbox.Tick(0.1f);   // 3.8s > 3.16s stream life
            if (sandbox.EffectsCount != 0) throw new InvalidOperationException("commit stream leak: " + sandbox.EffectsCount);

            foreach (string n in LeakNames)
                if (GameObject.Find(n) != null) throw new InvalidOperationException("boot-scene GO residue: " + n);

            // ---- B. real scene: wire the persistent router, save ----
            Scene scene = EditorSceneManager.OpenScene(ScenePath, OpenSceneMode.Single);
            GameObject routerGo = GameObject.Find("CityEventRouter");
            CityEventRouter router = routerGo != null ? routerGo.GetComponent<CityEventRouter>() : null;
            if (router == null)
            {
                routerGo = new GameObject("CityEventRouter");
                router = routerGo.AddComponent<CityEventRouter>();
            }
            bool routerSaved = EditorSceneManager.SaveScene(scene);   // persist wiring BEFORE transient pulses

            GameObject anchor = GameObject.Find("BrainTower");
            if (anchor == null) throw new InvalidOperationException("BrainTower anchor missing in CityScene");
            GameObject camGo = GameObject.Find("CityCamera");
            if (camGo == null) throw new InvalidOperationException("CityCamera missing in CityScene");
            Camera cam = camGo.GetComponent<Camera>();
            if (cam == null) throw new InvalidOperationException("CityCamera has no Camera component");

            // ---- C. CEO_ORDER canon face rendered (r116 P-41 slice 1): before vs pulse-peak ----
            // metric: BRIGHTNESS over the roofline + NEUTRAL warmth. The canon face is a
            // WHITE pulse on the middle antenna (five-color law: CEO pure white); the r12
            // gold face (warm shift +0.199) is the explicit fail family -- a warm reading
            // above 0.06 means the gold regression came back or the color slot broke.
            Vector3 antenna = FluxEventRouter.AntennaPos(anchor.transform.position);
            Texture2D before = Shot(cam, "m1-r116-p41-ceo-before.png", true);
            float beforeBri, beforeWarm;
            BoxMetrics(before, cam, antenna.x, antenna.y, out beforeBri, out beforeWarm, 40);
            router.Core.TriggerDirect("CEO_ORDER");   // dispatch as if a live CEO_ORDER just arrived
            router.Core.Tick(0.24f);                  // advance to alpha peak (peak-at 0.25s)
            Texture2D peak = Shot(cam, "m1-r116-p41-ceo-white.png", true);
            float peakBri, peakWarm;
            BoxMetrics(peak, cam, antenna.x, antenna.y, out peakBri, out peakWarm, 40);
            float alpha = router.Core.LastPulseAlpha;
            UnityEngine.Object.DestroyImmediate(before);
            UnityEngine.Object.DestroyImmediate(peak);
            float warmDelta = peakWarm - beforeWarm;
            float briDelta = peakBri - beforeBri;
            if (alpha < 0.9f) throw new InvalidOperationException("pulse alpha peak too low: " + alpha.ToString("F3"));
            if (briDelta < 0.25f) throw new InvalidOperationException("white pulse not visible over the roofline: bri delta=" + briDelta.ToString("F3"));
            if (peakWarm > 0.06f) throw new InvalidOperationException("CEO pulse not white (gold family?): warm=" + peakWarm.ToString("F3") + " delta=" + warmDelta.ToString("F3"));
            for (int i = 0; i < 30; i++) router.Core.Tick(0.1f);   // drain CEO pulse (2.4s life) before C2 baselines

            // ---- C2. four new faces rendered with metric gates (r115 P-12 slice 4) ----
            // Face router = sandbox stream + REAL scene anchor lookup: TriggerDirect is the
            // same dispatch path, but the live world stream can never poll mid-measurement
            // (a real tick round appending lines mid-proof would spawn un-anchored extras).
            FluxEventRouter face = new FluxEventRouter(SandboxPath, delegate (string n)
            {
                GameObject a = GameObject.Find(n);
                return a == null ? (Vector3?)null : a.transform.position;
            });
            face.SeekToEnd();
            Vector3 anchorPos = anchor.transform.position;
            Vector3 gatePos = new Vector3(anchorPos.x, anchorPos.y - 3f, 0f);

            // C2a breath: Lucy-blue halo rises over the brain tower (warmth shifts NEGATIVE)
            Texture2D b0 = Shot(cam, null, false);
            float b0Bri, b0Warm; BoxMetrics(b0, cam, anchorPos.x, anchorPos.y + 0.3f, out b0Bri, out b0Warm, 40);
            face.TriggerDirect("OS_TICK_START");
            for (int i = 0; i < 20; i++) face.Tick(0.1f);   // 2.0s ramp-in
            if (face.BreathAlpha < 0.99f)
                throw new InvalidOperationException("breath ramp broken in scene: " + face.BreathAlpha.ToString("F3"));
            Texture2D b1 = Shot(cam, "m1-r115-p12-breath.png", true);
            float b1Bri, b1Warm; BoxMetrics(b1, cam, anchorPos.x, anchorPos.y + 0.3f, out b1Bri, out b1Warm, 40);
            float breathWarmDelta = b1Warm - b0Warm;
            if (breathWarmDelta > -0.04f)
                throw new InvalidOperationException("breath not visible over tower (blue shift): delta=" + breathWarmDelta.ToString("F3"));
            UnityEngine.Object.DestroyImmediate(b0);
            UnityEngine.Object.DestroyImmediate(b1);
            face.TriggerDirect("OS_TICK_DONE");
            for (int i = 0; i < 16; i++) face.Tick(0.1f);
            if (face.BreathAlive) throw new InvalidOperationException("breath survived DONE in scene test");

            // C2b gate release stream: cyan dots crossing the gate box brighten the tower foot
            Texture2D g0 = Shot(cam, null, false);
            float g0Bri, g0Warm; BoxMetrics(g0, cam, gatePos.x, gatePos.y, out g0Bri, out g0Warm, 30);
            face.TriggerDirect("GATE_PASS");
            for (int i = 0; i < 10; i++) face.Tick(0.1f);   // 1.0s: mid-flow, three dots inside the box
            Texture2D g1 = Shot(cam, "m1-r115-p12-gatepass.png", true);
            float g1Bri, g1Warm; BoxMetrics(g1, cam, gatePos.x, gatePos.y, out g1Bri, out g1Warm, 30);
            float gateBriDelta = g1Bri - g0Bri;
            if (gateBriDelta < 0.03f)
                throw new InvalidOperationException("gate release stream not visible: delta=" + gateBriDelta.ToString("F3"));
            UnityEngine.Object.DestroyImmediate(g0);
            UnityEngine.Object.DestroyImmediate(g1);
            for (int i = 0; i < 30; i++) face.Tick(0.1f);   // drain (3.0s > 2.72s flow life)
            if (face.EffectsCount != 0) throw new InvalidOperationException("gate flow leak in scene: " + face.EffectsCount);

            // C2c gate block: red intercept band flashes warm at the gate
            Texture2D r0 = Shot(cam, null, false);
            float r0Bri, r0Warm; BoxMetrics(r0, cam, gatePos.x, gatePos.y, out r0Bri, out r0Warm, 40);
            face.TriggerDirect("GATE_BLOCK");
            for (int i = 0; i < 5; i++) face.Tick(0.1f);   // 0.5s: near band peak
            Texture2D r1 = Shot(cam, "m1-r115-p12-gateblock.png", true);
            float r1Bri, r1Warm; BoxMetrics(r1, cam, gatePos.x, gatePos.y, out r1Bri, out r1Warm, 40);
            float blockWarmDelta = r1Warm - r0Warm;
            if (blockWarmDelta < 0.06f)
                throw new InvalidOperationException("gate block red band not visible: delta=" + blockWarmDelta.ToString("F3"));
            UnityEngine.Object.DestroyImmediate(r0);
            UnityEngine.Object.DestroyImmediate(r1);
            for (int i = 0; i < 12; i++) face.Tick(0.1f);   // drain (1.7s > 1.4s life)
            if (face.EffectsCount != 0) throw new InvalidOperationException("block band leak in scene");

            // C2d transfer band: sweeps the south trunk; DISTINCTNESS law first (r114) --
            // street band south of the water rows, COMMIT's river-crossing stream stays apart.
            if (TransferBand.BandY > -4f || TransferBand.BandY < -10f)
                throw new InvalidOperationException("distinctness law broken: BandY=" + TransferBand.BandY.ToString("F2")
                    + " left the south street rows (water band = rows -3..2)");
            Texture2D t0 = Shot(cam, null, false);
            float t0Bri, t0Warm; BoxMetrics(t0, cam, 0f, TransferBand.BandY, out t0Bri, out t0Warm, 30);
            face.TriggerDirect("TRANSFER");
            for (int i = 0; i < 15; i++) face.Tick(0.1f);   // 1.5s: band crossing the frame center
            Texture2D t1 = Shot(cam, "m1-r115-p12-transfer.png", true);
            float t1Bri, t1Warm; BoxMetrics(t1, cam, 0f, TransferBand.BandY, out t1Bri, out t1Warm, 30);
            float transBriDelta = t1Bri - t0Bri;
            float transCoolDelta = t0Warm - t1Warm;
            if (transBriDelta < 0.04f)
                throw new InvalidOperationException("transfer band not visible: delta=" + transBriDelta.ToString("F3"));
            if (transCoolDelta < 0.02f)
                throw new InvalidOperationException("transfer band not cyan: cool delta=" + transCoolDelta.ToString("F3"));
            UnityEngine.Object.DestroyImmediate(t0);
            UnityEngine.Object.DestroyImmediate(t1);
            for (int i = 0; i < 20; i++) face.Tick(0.1f);   // drain (3.5s > 3.0s life)
            if (face.EffectsCount != 0) throw new InvalidOperationException("transfer band leak in scene");

            // C2e commit stream (r116): the dense dot chain crosses the river at
            // the central lane. Visibility = brightness delta over the water box;
            // CYAN identity = core-pixel census -- the warmth delta over the
            // already-blue day water is structurally weak (water r-b ~ -0.35 vs
            // cyan -0.48, measured 0.007), so identity is asserted on the dots'
            // own rendered pixels, not the shift.
            Texture2D c0 = Shot(cam, null, false);
            float c0Bri, c0Warm; BoxMetrics(c0, cam, 0f, 0.5f, out c0Bri, out c0Warm, 40);
            int c0Cyan = CyanCensus(c0, cam, 0f, 0.5f, 40);
            face.TriggerDirect("COMMIT");   // zone "test" -> central lane x=0
            for (int i = 0; i < 15; i++) face.Tick(0.1f);   // 1.5s: mid-flight, 5 dots in the water box
            Texture2D c1 = Shot(cam, "m1-r116-p41-commit.png", true);
            float c1Bri, c1Warm; BoxMetrics(c1, cam, 0f, 0.5f, out c1Bri, out c1Warm, 40);
            int c1Cyan = CyanCensus(c1, cam, 0f, 0.5f, 40);
            float commitBriDelta = c1Bri - c0Bri;
            int commitCyanCore = c1Cyan - c0Cyan;
            if (commitBriDelta < 0.02f)
                throw new InvalidOperationException("commit stream not visible over the water: delta=" + commitBriDelta.ToString("F3"));
            if (commitCyanCore < 60)
                throw new InvalidOperationException("commit stream not cyan: core pixels=" + commitCyanCore + " (need 60+)");
            UnityEngine.Object.DestroyImmediate(c0);
            UnityEngine.Object.DestroyImmediate(c1);
            for (int i = 0; i < 36; i++) face.Tick(0.1f);   // drain (3.6s > 3.16s stream life)
            if (face.EffectsCount != 0) throw new InvalidOperationException("commit stream leak in scene: " + face.EffectsCount);

            // ---- D. leak sweep: nothing presenter-ish survives in the open scene ----
            foreach (string n in LeakNames)
                if (GameObject.Find(n) != null) throw new InvalidOperationException("scene GO residue: " + n);
            if (File.Exists(SandboxPath)) File.Delete(SandboxPath);   // clean sandbox evidence file
            return "sandbox(f0=" + f0 + ",f1=" + f1 + ",f2=" + f2 + ",f3=" + f3 + ",f4=" + f4 + ",f5=" + f5 + ",f6=" + f6 + ",leaks=0)"
                + " router_saved=" + routerSaved
                + " anchor=(" + anchorPos.x.ToString("F1") + "," + anchorPos.y.ToString("F1") + ")"
                + " ceo(alpha " + alpha.ToString("F2") + ", warm=" + peakWarm.ToString("F3") + " (white law <=0.06), bri d=" + briDelta.ToString("F3") + ")"
                + " breath(warm d=" + breathWarmDelta.ToString("F3") + ")"
                + " gatepass(bri d=" + gateBriDelta.ToString("F3") + ")"
                + " gateblock(warm d=" + blockWarmDelta.ToString("F3") + ")"
                + " transfer(bri d=" + transBriDelta.ToString("F3") + ", cool d=" + transCoolDelta.ToString("F3")
                    + ", bandY=" + TransferBand.BandY.ToString("F1") + ")"
                + " commit(bri d=" + commitBriDelta.ToString("F3") + ", cyan core=" + commitCyanCore + ")"
                + " shots=7";
        }

        static string ReloadProve()
        {
            // cross-session persistence (r14 stub disease law): fresh editor session,
            // cold scene open, everything wired resolves, zero runtime GOs persisted.
            Scene scene = EditorSceneManager.OpenScene(ScenePath, OpenSceneMode.Single);
            if (!scene.isLoaded) throw new InvalidOperationException("CityScene failed to load");
            GameObject routerGo = GameObject.Find("CityEventRouter");
            if (routerGo == null) throw new InvalidOperationException("reload: CityEventRouter GO missing");
            CityEventRouter router = routerGo.GetComponent<CityEventRouter>();
            if (router == null) throw new InvalidOperationException("reload: CityEventRouter component did not resolve (r14 stub disease)");
            GameObject anchor = GameObject.Find("BrainTower");
            if (anchor == null) throw new InvalidOperationException("reload: BrainTower anchor missing");
            GameObject camGo = GameObject.Find("CityCamera");
            if (camGo == null) throw new InvalidOperationException("reload: CityCamera missing");
            Camera cam = camGo.GetComponent<Camera>();
            if (cam == null) throw new InvalidOperationException("reload: CityCamera has no Camera component");
            foreach (string n in LeakNames)
                if (GameObject.Find(n) != null) throw new InvalidOperationException("reload: runtime GO persisted into scene: " + n);

            // cold render smoke: the saved city renders non-black from a cold start
            Texture2D shot = Shot(cam, null, false);
            float bri, warm; BoxMetrics(shot, cam, 0f, 0f, out bri, out warm, 200);
            UnityEngine.Object.DestroyImmediate(shot);
            if (bri <= 0.01f) throw new InvalidOperationException("reload: cold render black, bri=" + bri.ToString("F3"));

            // five routed types resolve from the persisted wiring (pure static face, no spawn)
            foreach (string t in FluxEventRouter.VisualTypes)
                if (FluxAudioRouter.SoundFor(t) != null)
                    throw new InvalidOperationException("reload: visual type " + t + " must stay audio-silent (r30 law)");
            return "reload_ok router=resolved anchor=(" + anchor.transform.position.x.ToString("F1")
                + "," + anchor.transform.position.y.ToString("F1") + ") cam_size=" + cam.orthographicSize.ToString("F1")
                + " cold_bri=" + bri.ToString("F3") + " visual_types=" + FluxEventRouter.VisualTypes.Length;
        }

        static Texture2D Shot(Camera cam, string name, bool save)
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
            if (save && name != null)
                File.WriteAllBytes(Path.Combine(RepoRoot, "docs", "design", name), tex.EncodeToPNG());
            return tex;
        }

        // average luminance + warmth (r-b) in a box around a world position (ortho projection);
        // radius in pixels (r115: parameterized - face boxes are 30px, smoke box 200px)
        static void BoxMetrics(Texture2D tex, Camera cam, float wx, float wy, out float brightness, out float warmth, int radius)
        {
            float halfH = cam.orthographicSize;
            float halfW = halfH * (1920f / 1080f);
            int cx = (int)(((wx - cam.transform.position.x) / (2f * halfW) + 0.5f) * 1920f);
            int cy = (int)(((wy - cam.transform.position.y) / (2f * halfH) + 0.5f) * 1080f);
            double sumBri = 0, sumWarm = 0; int n = 0;
            for (int y = cy - radius; y <= cy + radius; y += 4)
                for (int x = cx - radius; x <= cx + radius; x += 4)
                {
                    if (x < 0 || x >= 1920 || y < 0 || y >= 1080) continue;
                    Color c = tex.GetPixel(x, y);
                    sumBri += (c.r + c.g + c.b) / 3f;
                    sumWarm += c.r - c.b;
                    n++;
                }
            int nn = System.Math.Max(1, n);
            brightness = (float)(sumBri / nn);
            warmth = (float)(sumWarm / nn);
        }

        // r116 C2e: count cyan-core pixels (bright + strongly cool) in the same
        // projection box, step 2 -- identity census for the commit dots. Texture
        // space note: ReadPixels rows run bottom-up (r13 law), same as BoxMetrics.
        static int CyanCensus(Texture2D tex, Camera cam, float wx, float wy, int radius)
        {
            float halfH = cam.orthographicSize;
            float halfW = halfH * (1920f / 1080f);
            int cx = (int)(((wx - cam.transform.position.x) / (2f * halfW) + 0.5f) * 1920f);
            int cy = (int)(((wy - cam.transform.position.y) / (2f * halfH) + 0.5f) * 1080f);
            int count = 0;
            for (int y = cy - radius; y <= cy + radius; y += 2)
                for (int x = cx - radius; x <= cx + radius; x += 2)
                {
                    if (x < 0 || x >= 1920 || y < 0 || y >= 1080) continue;
                    Color c = tex.GetPixel(x, y);
                    float bri = (c.r + c.g + c.b) / 3f;
                    if (bri > 0.62f && (c.r - c.b) < -0.22f) count++;
                }
            return count;
        }
    }
}
