// FluxVerse P-27 r25 (first audio wire) -> r30 (rows batch 2): batch proof for the
// event-type -> clip table. Sentinel pattern (r11 builder style):
//   pass 1: logs/audio.run            -> FluxVerse.AudioProof.BatchRun   -> logs/audio.done
//   pass 2: logs/audio-reload.run     -> FluxVerse.AudioProof.ReloadGate  -> logs/audio-reload.done
// Sections:
//  A pure-core sandbox in the throwaway boot scene (nothing saved):
//    A1 map rows + volume canon + silent law (7 live rows; unmapped stay unmapped),
//    A2 fake-player capture with per-row volumes,
//    A3 dual-presentation chain on a sandbox stream (history law now covers a mapped
//       non-CEO type), A3b mixed-type poll: COMMIT/MARKET_OPEN/RESIDENT_SAY fire the
//       sink but spawn ZERO pulses (visual law: only CEO_ORDER has a mapped visual),
//    A4 null-sink regression (r12 pulse-only baselines stay intact when unwired),
//    A5 all 7 real clip assets load (CEO keeps synth spec 2.2s; others >0),
//    A6 real adapter wiring in edit mode: ResolveClip all 7, TriggerDirect(COMMIT)
//       = sink-only (no pulse), TriggerDirect(CEO_ORDER) = pulse+play, play-mode-only
//       mixer law (no CityAudio GO), pulse drain, zero residue.
//  B CityScene wiring: all 7 serialized clip fields wired + saved + disk round-trip,
//    neighbor wiring regression (CityInterior/CityCameraRig/CityAmbient + L0 camera).
// Pass 2 re-proves persistence in a SECOND editor session (r14 SEPARATE FILE LAW gate).
// Fail-loud: any broken assumption throws into the .done report. All comments ASCII. No 3D.
using System;
using System.Collections.Generic;
using System.IO;
using UnityEngine;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine.SceneManagement;

namespace FluxVerse
{
    public static class AudioProof
    {
        static string ProjectRoot { get { return Path.GetDirectoryName(Application.dataPath); } }
        static string RepoRoot { get { return Path.GetDirectoryName(ProjectRoot); } }
        static string RunPath { get { return Path.Combine(RepoRoot, "logs", "audio.run"); } }
        static string DonePath { get { return Path.Combine(RepoRoot, "logs", "audio.done"); } }
        static string ReloadRunPath { get { return Path.Combine(RepoRoot, "logs", "audio-reload.run"); } }
        static string ReloadDonePath { get { return Path.Combine(RepoRoot, "logs", "audio-reload.done"); } }
        static string SandboxPath { get { return Path.Combine(RepoRoot, "logs", "audio-sandbox.jsonl"); } }
        static string ScenePath { get { return "Assets/Scenes/CityScene.unity"; } }

        [InitializeOnLoadMethod]
        static void Hook()
        {
            if (File.Exists(RunPath)) EditorApplication.delayCall += Run;
            if (File.Exists(ReloadRunPath)) EditorApplication.delayCall += ReloadRun;
        }

        public static void BatchRun() { Run(); }
        public static void ReloadGate() { ReloadRun(); }

        static void Run()
        {
            if (!File.Exists(RunPath)) return;   // single-shot guard
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
                if (File.Exists(RunPath)) File.Delete(RunPath);
            }
        }

        static void ReloadRun()
        {
            if (!File.Exists(ReloadRunPath)) return;
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
            // ---- A1 mapping + volume canon + silent law (r30: 7 live rows) ----
            if (FluxAudioRouter.SoundFor("CEO_ORDER") != FluxAudioRouter.CeoOrderClip)
                throw new InvalidOperationException("CEO_ORDER row missing from map");
            if (FluxAudioRouter.SoundFor("COMMIT") != FluxAudioRouter.CommitClip)
                throw new InvalidOperationException("COMMIT row missing from map");
            if (FluxAudioRouter.SoundFor("TASK_CLAIM") != FluxAudioRouter.TaskClaimClip)
                throw new InvalidOperationException("TASK_CLAIM row missing from map");
            if (FluxAudioRouter.SoundFor("MARKET_OPEN") != FluxAudioRouter.MarketOpenClip)
                throw new InvalidOperationException("MARKET_OPEN row missing from map");
            if (FluxAudioRouter.SoundFor("MARKET_CLOSE") != FluxAudioRouter.MarketCloseClip)
                throw new InvalidOperationException("MARKET_CLOSE row missing from map");
            if (FluxAudioRouter.SoundFor("WEATHER_ALERT") != FluxAudioRouter.WeatherAlertClip)
                throw new InvalidOperationException("WEATHER_ALERT row missing from map");
            if (FluxAudioRouter.SoundFor("RESIDENT_SAY") != FluxAudioRouter.ResidentTalkClip)
                throw new InvalidOperationException("RESIDENT_SAY row missing from map");
            if (FluxAudioRouter.VolumeFor("CEO_ORDER") != 1.0f || FluxAudioRouter.VolumeFor("MARKET_OPEN") != 1.0f
                || FluxAudioRouter.VolumeFor("MARKET_CLOSE") != 1.0f || FluxAudioRouter.VolumeFor("WEATHER_ALERT") != 1.0f)
                throw new InvalidOperationException("signature volume canon != 1.0 (P-27 item 3)");
            if (FluxAudioRouter.VolumeFor("COMMIT") != 0.8f || FluxAudioRouter.VolumeFor("TASK_CLAIM") != 0.8f
                || FluxAudioRouter.VolumeFor("RESIDENT_SAY") != 0.8f)
                throw new InvalidOperationException("sfx volume canon != 0.8 (P-27 item 3)");
            // silent law: no live event source = no row (P-12 pending types + tick noise types)
            if (FluxAudioRouter.SoundFor("FX_TICK") != null) throw new InvalidOperationException("silent law broken: FX_TICK mapped");
            if (FluxAudioRouter.SoundFor("GITHUB_EVENT") != null) throw new InvalidOperationException("silent law broken: GITHUB_EVENT mapped");
            if (FluxAudioRouter.SoundFor("HEARTBEAT") != null) throw new InvalidOperationException("silent law broken: HEARTBEAT mapped");
            if (FluxAudioRouter.SoundFor("GATE_PASS") != null) throw new InvalidOperationException("silent law broken: GATE_PASS mapped (P-12 pending)");
            if (FluxAudioRouter.SoundFor("OS_TICK_START") != null) throw new InvalidOperationException("silent law broken: OS_TICK_START mapped (P-12 pending)");
            if (FluxAudioRouter.MappedTypes.Count != 7) throw new InvalidOperationException("map row count=" + FluxAudioRouter.MappedTypes.Count);

            // ---- A2 fake-player capture with per-row volumes ----
            List<string> played = new List<string>();
            List<float> playedVol = new List<float>();
            FluxAudioRouter fake = new FluxAudioRouter(delegate (string p, float v) { played.Add(p); playedVol.Add(v); });
            fake.OnEvent(new FluxEvent { type = "CEO_ORDER", zone = "quant" });
            fake.OnEvent(new FluxEvent { type = "COMMIT", zone = "gaming" });
            fake.OnEvent(new FluxEvent { type = "MARKET_OPEN", zone = "quant" });
            fake.OnEvent(new FluxEvent { type = "FX_TICK" });
            fake.OnEvent(null);
            if (played.Count != 3) throw new InvalidOperationException("player calls=" + played.Count + " (expected 3 mapped of 5 fed)");
            if (played[0] != FluxAudioRouter.CeoOrderClip || played[1] != FluxAudioRouter.CommitClip
                || played[2] != FluxAudioRouter.MarketOpenClip)
                throw new InvalidOperationException("player order wrong: " + played[0] + "|" + played[1] + "|" + played[2]);
            if (playedVol[0] != 1.0f || playedVol[1] != 0.8f || playedVol[2] != 1.0f)
                throw new InvalidOperationException("player volumes wrong: " + playedVol[0] + "/" + playedVol[1] + "/" + playedVol[2]);
            if (fake.Plays != 3) throw new InvalidOperationException("Plays counter=" + fake.Plays);

            // ---- A3 dual presentation on a sandbox stream (logs/, never touches world/) ----
            if (File.Exists(SandboxPath)) File.Delete(SandboxPath);
            File.WriteAllText(SandboxPath,
                "{\"ts_utc\":\"2026-09-24T01:00:00Z\",\"type\":\"RESIDENT_SAY\",\"summary\":\"seed noise (mapped type in history: must NOT fire)\"}\n" +
                "{\"ts_utc\":\"2026-09-24T01:01:00Z\",\"type\":\"CEO_ORDER\",\"zone\":\"quant\",\"summary\":\"seed (history, must NOT fire)\"}\n" +
                "{\"ts_utc\":\"2026-09-24T01:02:00Z\",\"type\":\"FX_TICK\",\"summary\":\"seed noise\"}\n");
            FluxAudioRouter a2 = new FluxAudioRouter(delegate (string p, float v) { played.Add(p); playedVol.Add(v); });
            FluxEventRouter r = new FluxEventRouter(SandboxPath, n => new Vector3(0f, 11f, 0f));
            r.SeekToEnd();
            r.EventSink = a2.OnEvent;
            int basePlayed = played.Count;
            int f0 = r.PollOnce();
            if (f0 != 0) throw new InvalidOperationException("history replayed: fired=" + f0);
            File.AppendAllText(SandboxPath,
                "{\"ts_utc\":\"2026-09-24T01:03:00Z\",\"type\":\"CEO_ORDER\",\"zone\":\"quant\",\"summary\":\"live order (must fire)\"}\n" +
                "{\"ts_utc\":\"2026-09-24T01:04:00Z\",\"type\":\"FX_TICK\",\"summary\":\"appended noise\"}\n");
            int f1 = r.PollOnce();
            if (f1 != 1) throw new InvalidOperationException("append detection broken: fired=" + f1);
            if (r.PulseCount != 1) throw new InvalidOperationException("light presenter missing: pulses=" + r.PulseCount);
            if (played.Count - basePlayed != 1) throw new InvalidOperationException("audio presenter missing: plays=" + (played.Count - basePlayed));
            r.Tick(0.25f);   // advance to pulse peak
            if (r.LastPulseAlpha < 0.5f) throw new InvalidOperationException("pulse alpha peak too low: " + r.LastPulseAlpha.ToString("F3"));
            r.Tick(4.0f);    // drain (2.4s life)
            if (r.PulseCount != 0) throw new InvalidOperationException("pulse leak: " + r.PulseCount);
            if (GameObject.Find("EventPulse") != null) throw new InvalidOperationException("pulse GO residue in boot scene");

            // ---- A3b mixed-type poll: sink fires, ZERO new pulses (visual law, r30) ----
            File.AppendAllText(SandboxPath,
                "{\"ts_utc\":\"2026-09-24T01:05:00Z\",\"type\":\"COMMIT\",\"zone\":\"gaming\",\"summary\":\"commit blip\"}\n" +
                "{\"ts_utc\":\"2026-09-24T01:06:00Z\",\"type\":\"MARKET_OPEN\",\"zone\":\"quant\",\"summary\":\"open bell\"}\n" +
                "{\"ts_utc\":\"2026-09-24T01:07:00Z\",\"type\":\"GITHUB_EVENT\",\"summary\":\"unmapped noise\"}\n" +
                "{\"ts_utc\":\"2026-09-24T01:08:00Z\",\"type\":\"RESIDENT_SAY\",\"summary\":\"resident talk\"}\n");
            int f3 = r.PollOnce();
            if (f3 != 3) throw new InvalidOperationException("mixed poll fired=" + f3 + " (expected 3: COMMIT/MARKET_OPEN/RESIDENT_SAY)");
            if (r.PulseCount != 0)
                throw new InvalidOperationException("visual law broken: non-CEO event spawned pulse (" + r.PulseCount + ")");
            if (played.Count - basePlayed != 4)
                throw new InvalidOperationException("mixed poll audio plays=" + (played.Count - basePlayed) + " (expected 4 total)");
            if (played[basePlayed + 1] != FluxAudioRouter.CommitClip || playedVol[basePlayed + 1] != 0.8f)
                throw new InvalidOperationException("COMMIT row wrong: " + played[basePlayed + 1] + " vol=" + playedVol[basePlayed + 1]);
            if (played[basePlayed + 2] != FluxAudioRouter.MarketOpenClip || playedVol[basePlayed + 2] != 1.0f)
                throw new InvalidOperationException("MARKET_OPEN row wrong: " + played[basePlayed + 2] + " vol=" + playedVol[basePlayed + 2]);
            if (played[basePlayed + 3] != FluxAudioRouter.ResidentTalkClip || playedVol[basePlayed + 3] != 0.8f)
                throw new InvalidOperationException("RESIDENT_SAY row wrong: " + played[basePlayed + 3] + " vol=" + playedVol[basePlayed + 3]);

            // ---- A4 null-sink regression (unwired = pulse-only for CEO, nothing for others) ----
            FluxEventRouter r2 = new FluxEventRouter(SandboxPath, n => new Vector3(0f, 11f, 0f));
            r2.SeekToEnd();
            File.AppendAllText(SandboxPath,
                "{\"ts_utc\":\"2026-09-24T01:09:00Z\",\"type\":\"CEO_ORDER\",\"zone\":\"media\",\"summary\":\"second order (no sink)\"}\n" +
                "{\"ts_utc\":\"2026-09-24T01:10:00Z\",\"type\":\"COMMIT\",\"zone\":\"quant\",\"summary\":\"commit (no sink)\"}\n");
            int f2 = r2.PollOnce();
            if (f2 != 2 || r2.PulseCount != 1)
                throw new InvalidOperationException("null-sink regression broken: fired=" + f2 + " pulses=" + r2.PulseCount + " (CEO=1 pulse, COMMIT=0)");
            r2.Tick(4.0f);
            if (r2.PulseCount != 0) throw new InvalidOperationException("null-sink pulse leak");

            // ---- A5 all 7 real clip assets (CEO keeps synth spec 2.2s; others >0) ----
            Dictionary<string, AudioClip> clips = new Dictionary<string, AudioClip>();
            string[] allPaths = new string[] {
                FluxAudioRouter.CeoOrderClip, FluxAudioRouter.CommitClip, FluxAudioRouter.TaskClaimClip,
                FluxAudioRouter.MarketOpenClip, FluxAudioRouter.MarketCloseClip,
                FluxAudioRouter.WeatherAlertClip, FluxAudioRouter.ResidentTalkClip };
            foreach (string p in allPaths)
            {
                AudioClip c = AssetDatabase.LoadAssetAtPath<AudioClip>(p);
                if (c == null) throw new InvalidOperationException("clip asset missing/unimported: " + p);
                if (c.length <= 0f) throw new InvalidOperationException("clip zero length: " + p);
                clips[p] = c;
            }
            AudioClip ceoClip = clips[FluxAudioRouter.CeoOrderClip];
            if (ceoClip.length < 2.0f || ceoClip.length > 2.4f)
                throw new InvalidOperationException("CEO clip duration off synth spec 2.2s: " + ceoClip.length.ToString("F3"));

            // ---- A6 real adapter wiring, edit mode (boot scene, nothing saved) ----
            GameObject tmp = new GameObject("TmpRouter");
            CityEventRouter cr = tmp.AddComponent<CityEventRouter>();
            cr.ceoOrderPulse = clips[FluxAudioRouter.CeoOrderClip];
            cr.commitBlip = clips[FluxAudioRouter.CommitClip];
            cr.taskClaimSfx = clips[FluxAudioRouter.TaskClaimClip];
            cr.marketBellOpen = clips[FluxAudioRouter.MarketOpenClip];
            cr.marketBellClose = clips[FluxAudioRouter.MarketCloseClip];
            cr.weatherAlert = clips[FluxAudioRouter.WeatherAlertClip];
            cr.residentTalk = clips[FluxAudioRouter.ResidentTalkClip];
            foreach (string p in allPaths)
                if (cr.ResolveClip(p) == null) throw new InvalidOperationException("ResolveClip failed on wired path: " + p);
            if (cr.ResolveClip("Assets/Audio/signature/gate_pass.wav") != null)
                throw new InvalidOperationException("ResolveClip returned a clip for unwired path");
            if (cr.PlayClipAsset(FluxAudioRouter.CommitClip, 0.8f))
                throw new InvalidOperationException("edit-mode play must return false (play-mode-only law)");
            if (GameObject.Find("CityAudio") != null)
                throw new InvalidOperationException("runtime-only law broken: mixer GO in edit mode");
            cr.Core.TriggerDirect("COMMIT");   // sink-only row: audio fires, NO pulse (visual law)
            if (cr.Core.PulseCount != 0) throw new InvalidOperationException("adapter COMMIT dispatch spawned a pulse (visual law)");
            if (cr.AudioPlays != 1) throw new InvalidOperationException("adapter COMMIT dispatch: sink chain dead (AudioPlays=" + cr.AudioPlays + ")");
            cr.Core.TriggerDirect("CEO_ORDER");   // full real chain: dispatch -> pulse + sink -> player
            if (cr.Core.PulseCount != 1) throw new InvalidOperationException("adapter CEO dispatch: pulse missing");
            if (cr.AudioPlays != 2) throw new InvalidOperationException("adapter CEO dispatch: AudioPlays=" + cr.AudioPlays);
            if (GameObject.Find("CityAudio") != null)
                throw new InvalidOperationException("runtime-only law broken after dispatch: mixer GO in edit mode");
            cr.Core.Tick(4.0f);
            if (cr.Core.PulseCount != 0) throw new InvalidOperationException("adapter pulse leak");
            UnityEngine.Object.DestroyImmediate(tmp);
            if (GameObject.Find("TmpRouter") != null || GameObject.Find("EventPulse") != null)
                throw new InvalidOperationException("boot-scene residue after cleanup");

            // ---- B CityScene wiring (all 7 fields) + save + disk round-trip ----
            Scene scene = EditorSceneManager.OpenScene(ScenePath, OpenSceneMode.Single);
            GameObject routerGo = GameObject.Find("CityEventRouter");
            if (routerGo == null) throw new InvalidOperationException("CityEventRouter GO missing in CityScene");
            CityEventRouter router = routerGo.GetComponent<CityEventRouter>();
            if (router == null) throw new InvalidOperationException("CityEventRouter component unresolved (r14 stub disease)");
            router.ceoOrderPulse = clips[FluxAudioRouter.CeoOrderClip];
            router.commitBlip = clips[FluxAudioRouter.CommitClip];
            router.taskClaimSfx = clips[FluxAudioRouter.TaskClaimClip];
            router.marketBellOpen = clips[FluxAudioRouter.MarketOpenClip];
            router.marketBellClose = clips[FluxAudioRouter.MarketCloseClip];
            router.weatherAlert = clips[FluxAudioRouter.WeatherAlertClip];
            router.residentTalk = clips[FluxAudioRouter.ResidentTalkClip];
            bool saved = EditorSceneManager.SaveScene(scene);   // persist BEFORE any transient dispatch
            Scene reopened = EditorSceneManager.OpenScene(ScenePath, OpenSceneMode.Single);
            GameObject routerGo2 = GameObject.Find("CityEventRouter");
            CityEventRouter router2 = routerGo2 != null ? routerGo2.GetComponent<CityEventRouter>() : null;
            if (!saved || router2 == null) throw new InvalidOperationException("scene save failed");
            foreach (string p in allPaths)
                if (router2.ResolveClip(p) == null) throw new InvalidOperationException("clip not persisted to disk: " + p);
            if (router2.ceoOrderPulse.length < 2.0f) throw new InvalidOperationException("persisted CEO clip wrong length");
            if (GameObject.Find("CityAudio") != null) throw new InvalidOperationException("mixer GO leaked into saved scene");
            // neighbor wiring regression: our save must not drop any r13-r17 wiring
            if (UnityEngine.Object.FindObjectsOfType<CityInterior>().Length < 1) throw new InvalidOperationException("CityInterior lost after save");
            if (UnityEngine.Object.FindObjectsOfType<CityCameraRig>().Length < 1) throw new InvalidOperationException("CityCameraRig lost after save");
            if (UnityEngine.Object.FindObjectsOfType<CityAmbient>().Length < 1) throw new InvalidOperationException("CityAmbient lost after save");
            GameObject camGo = GameObject.Find("CityCamera");
            Camera cam = camGo != null ? camGo.GetComponent<Camera>() : null;
            if (cam == null || !cam.orthographic) throw new InvalidOperationException("CityCamera broken after save");
            if (Math.Abs(cam.orthographicSize - 20f) > 0.01f) throw new InvalidOperationException("L0 camera size drift: " + cam.orthographicSize);

            if (File.Exists(SandboxPath)) File.Delete(SandboxPath);   // clean sandbox evidence file
            return "map=7rows vol(sig1.0/sfx0.8) sandbox(f0=" + f0 + ",f1=" + f1 + ",f3mixed=" + f3
                + ",f2=" + f2 + ",dual=pulse1+play1,mixed=3plays0pulse,alpha=peak_ok,drained) nullsink_ok"
                + " clips(7/7 loaded,ceo=" + ceoClip.length.ToString("F2") + "s)"
                + " adapter(editsilent=true,commit=sink-only-no-pulse,ceo=dual,no_mixer_go=true)"
                + " scene(saved=" + saved + ",reopen_wired=7clips,cam_L0=" + cam.orthographicSize.ToString("F1") + ")";
        }

        static string ReloadProve()
        {
            Scene scene = EditorSceneManager.OpenScene(ScenePath, OpenSceneMode.Single);
            if (!scene.isLoaded) throw new InvalidOperationException("CityScene failed to load");
            GameObject routerGo = GameObject.Find("CityEventRouter");
            CityEventRouter router = routerGo != null ? routerGo.GetComponent<CityEventRouter>() : null;
            if (router == null) throw new InvalidOperationException("CityEventRouter missing/unresolved after editor restart (r14 stub disease)");
            string[] allPaths = new string[] {
                FluxAudioRouter.CeoOrderClip, FluxAudioRouter.CommitClip, FluxAudioRouter.TaskClaimClip,
                FluxAudioRouter.MarketOpenClip, FluxAudioRouter.MarketCloseClip,
                FluxAudioRouter.WeatherAlertClip, FluxAudioRouter.ResidentTalkClip };
            foreach (string p in allPaths)
            {
                AudioClip c = router.ResolveClip(p);
                if (c == null) throw new InvalidOperationException("clip lost across sessions: " + p);
                if (c.length <= 0f) throw new InvalidOperationException("clip zero length after restart: " + p);
            }
            if (router.ceoOrderPulse.length < 2.0f || router.ceoOrderPulse.length > 2.4f)
                throw new InvalidOperationException("persisted CEO clip length off spec: " + router.ceoOrderPulse.length.ToString("F3"));
            if (UnityEngine.Object.FindObjectsOfType<CityInterior>().Length < 1) throw new InvalidOperationException("CityInterior unresolved after restart");
            if (UnityEngine.Object.FindObjectsOfType<CityCameraRig>().Length < 1) throw new InvalidOperationException("CityCameraRig unresolved after restart");
            if (UnityEngine.Object.FindObjectsOfType<CityAmbient>().Length < 1) throw new InvalidOperationException("CityAmbient unresolved after restart");
            GameObject camGo = GameObject.Find("CityCamera");
            Camera cam = camGo != null ? camGo.GetComponent<Camera>() : null;
            if (cam == null || Math.Abs(cam.orthographicSize - 20f) > 0.01f) throw new InvalidOperationException("L0 camera broken after restart");
            if (GameObject.Find("CityAudio") != null) throw new InvalidOperationException("mixer GO persisted into scene (runtime-only law broken)");
            if (router.Core == null) throw new InvalidOperationException("core build failed after restart");
            if (router.AudioPlays != 0) throw new InvalidOperationException("AudioPlays not zero at cold start");
            return "reload_gate=OK component=resolved clips=7/7 ceo=" + router.ceoOrderPulse.length.ToString("F2")
                + "s neighbors=3 cam_L0=" + cam.orthographicSize.ToString("F1") + " no_mixer_go core=poll-ready";
        }
    }
}
