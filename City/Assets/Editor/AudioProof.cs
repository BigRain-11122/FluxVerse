// FluxVerse P-27 r25: batch proof for the first audio wire (CEO_ORDER -> signature/ceo_order_pulse,
// same dispatch as the r12 gold glow = dual presentation). Sentinel pattern (r11 builder style):
//   pass 1: logs/audio.run            -> FluxVerse.AudioProof.BatchRun   -> logs/audio.done
//   pass 2: logs/audio-reload.run     -> FluxVerse.AudioProof.ReloadGate  -> logs/audio-reload.done
// Sections:
//  A pure-core sandbox in the throwaway boot scene (nothing saved):
//    A1 map/volume/silent-law (v0 = CEO row only), A2 fake-player capture,
//    A3 dual-presentation chain on a sandbox stream (1 CEO_ORDER -> 1 pulse + 1 play call),
//    A4 null-sink regression (r12 pulse-only baselines stay intact when unwired),
//    A5 real clip asset load (synth spec: _silence(2.2) -> ~2.2s stereo),
//    A6 real adapter wiring in edit mode: sink chain live (AudioPlays), ResolveClip,
//       play-mode-only mixer law (no CityAudio GO), pulse drain, zero residue.
//  B CityScene wiring: ceoOrderPulse serialized field wired + saved + disk round-trip,
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
            // ---- A1 mapping + volume canon + silent law ----
            if (FluxAudioRouter.SoundFor("CEO_ORDER") != FluxAudioRouter.CeoOrderClip)
                throw new InvalidOperationException("CEO_ORDER row missing from map");
            if (FluxAudioRouter.SoundFor("FX_TICK") != null) throw new InvalidOperationException("silent law broken: FX_TICK mapped");
            if (FluxAudioRouter.SoundFor("GATE_PASS") != null) throw new InvalidOperationException("silent law broken: GATE_PASS mapped (v0 = CEO row only)");
            if (FluxAudioRouter.SoundFor("RESIDENT_SAY") != null) throw new InvalidOperationException("silent law broken: RESIDENT_SAY mapped");
            if (FluxAudioRouter.SignatureVolume != 1.0f) throw new InvalidOperationException("signature volume canon != 1.0 (P-27 item 3)");

            // ---- A2 fake-player capture ----
            List<string> played = new List<string>();
            List<float> playedVol = new List<float>();
            FluxAudioRouter fake = new FluxAudioRouter(delegate (string p, float v) { played.Add(p); playedVol.Add(v); });
            fake.OnEvent(new FluxEvent { type = "CEO_ORDER", zone = "quant" });
            fake.OnEvent(new FluxEvent { type = "FX_TICK" });
            fake.OnEvent(null);
            if (played.Count != 1 || played[0] != FluxAudioRouter.CeoOrderClip)
                throw new InvalidOperationException("player calls=" + played.Count + " (expected exactly 1 CEO row)");
            if (playedVol[0] != 1.0f) throw new InvalidOperationException("player volume=" + playedVol[0]);
            if (fake.Plays != 1) throw new InvalidOperationException("Plays counter=" + fake.Plays);

            // ---- A3 dual presentation on a sandbox stream (logs/, never touches world/) ----
            if (File.Exists(SandboxPath)) File.Delete(SandboxPath);
            File.WriteAllText(SandboxPath,
                "{\"ts_utc\":\"2026-09-24T01:00:00Z\",\"type\":\"RESIDENT_SAY\",\"summary\":\"seed noise\"}\n" +
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

            // ---- A4 null-sink regression (unwired = pulse-only, r12 baseline law) ----
            FluxEventRouter r2 = new FluxEventRouter(SandboxPath, n => new Vector3(0f, 11f, 0f));
            r2.SeekToEnd();
            File.AppendAllText(SandboxPath,
                "{\"ts_utc\":\"2026-09-24T01:05:00Z\",\"type\":\"CEO_ORDER\",\"zone\":\"media\",\"summary\":\"second order (no sink)\"}\n");
            int f2 = r2.PollOnce();
            if (f2 != 1 || r2.PulseCount != 1) throw new InvalidOperationException("null-sink regression broken: fired=" + f2 + " pulses=" + r2.PulseCount);
            r2.Tick(4.0f);
            if (r2.PulseCount != 0) throw new InvalidOperationException("null-sink pulse leak");

            // ---- A5 real clip asset (synth spec: 2.2s, stereo 16-bit) ----
            AudioClip clip = AssetDatabase.LoadAssetAtPath<AudioClip>(FluxAudioRouter.CeoOrderClip);
            if (clip == null) throw new InvalidOperationException("clip asset missing/unimported: " + FluxAudioRouter.CeoOrderClip);
            if (clip.length < 2.0f || clip.length > 2.4f)
                throw new InvalidOperationException("clip duration off synth spec 2.2s: " + clip.length.ToString("F3"));
            if (clip.channels < 1) throw new InvalidOperationException("clip channels=" + clip.channels);

            // ---- A6 real adapter wiring, edit mode (boot scene, nothing saved) ----
            GameObject tmp = new GameObject("TmpRouter");
            CityEventRouter cr = tmp.AddComponent<CityEventRouter>();
            cr.ceoOrderPulse = clip;
            if (cr.ResolveClip(FluxAudioRouter.CeoOrderClip) != clip)
                throw new InvalidOperationException("ResolveClip failed on wired path");
            if (cr.ResolveClip("Assets/Audio/signature/gate_pass.wav") != null)
                throw new InvalidOperationException("ResolveClip returned a clip for unwired path");
            if (cr.PlayClipAsset(FluxAudioRouter.CeoOrderClip, 1.0f))
                throw new InvalidOperationException("edit-mode play must return false (play-mode-only law)");
            if (GameObject.Find("CityAudio") != null)
                throw new InvalidOperationException("runtime-only law broken: mixer GO in edit mode");
            cr.Core.TriggerDirect("CEO_ORDER");   // full real chain: dispatch -> pulse + sink -> player
            if (cr.Core.PulseCount != 1) throw new InvalidOperationException("adapter dispatch: pulse missing");
            if (cr.AudioPlays != 1) throw new InvalidOperationException("adapter dispatch: sink chain dead (AudioPlays=" + cr.AudioPlays + ")");
            if (GameObject.Find("CityAudio") != null)
                throw new InvalidOperationException("runtime-only law broken after dispatch: mixer GO in edit mode");
            cr.Core.Tick(4.0f);
            if (cr.Core.PulseCount != 0) throw new InvalidOperationException("adapter pulse leak");
            UnityEngine.Object.DestroyImmediate(tmp);
            if (GameObject.Find("TmpRouter") != null || GameObject.Find("EventPulse") != null)
                throw new InvalidOperationException("boot-scene residue after cleanup");

            // ---- B CityScene wiring + save + disk round-trip ----
            Scene scene = EditorSceneManager.OpenScene(ScenePath, OpenSceneMode.Single);
            GameObject routerGo = GameObject.Find("CityEventRouter");
            if (routerGo == null) throw new InvalidOperationException("CityEventRouter GO missing in CityScene");
            CityEventRouter router = routerGo.GetComponent<CityEventRouter>();
            if (router == null) throw new InvalidOperationException("CityEventRouter component unresolved (r14 stub disease)");
            router.ceoOrderPulse = clip;
            bool saved = EditorSceneManager.SaveScene(scene);   // persist BEFORE any transient dispatch
            Scene reopened = EditorSceneManager.OpenScene(ScenePath, OpenSceneMode.Single);
            GameObject routerGo2 = GameObject.Find("CityEventRouter");
            CityEventRouter router2 = routerGo2 != null ? routerGo2.GetComponent<CityEventRouter>() : null;
            if (!saved || router2 == null) throw new InvalidOperationException("scene save failed");
            if (router2.ceoOrderPulse == null) throw new InvalidOperationException("ceoOrderPulse not persisted to disk");
            if (router2.ceoOrderPulse.length < 2.0f) throw new InvalidOperationException("persisted clip wrong length");
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
            return "map=1row(CEO_ORDER) vol=1.0 sandbox(f0=" + f0 + ",f1=" + f1 + ",f2=" + f2
                + ",dual=pulse1+play1,alpha=" + "peak_ok,drained) nullsink_ok"
                + " clip(len=" + clip.length.ToString("F2") + "s,ch=" + clip.channels + ")"
                + " adapter(editsilent=true,sink_live=1,no_mixer_go=true)"
                + " scene(saved=" + saved + ",reopen_wired=true,cam_L0=" + cam.orthographicSize.ToString("F1") + ")";
        }

        static string ReloadProve()
        {
            Scene scene = EditorSceneManager.OpenScene(ScenePath, OpenSceneMode.Single);
            if (!scene.isLoaded) throw new InvalidOperationException("CityScene failed to load");
            GameObject routerGo = GameObject.Find("CityEventRouter");
            CityEventRouter router = routerGo != null ? routerGo.GetComponent<CityEventRouter>() : null;
            if (router == null) throw new InvalidOperationException("CityEventRouter missing/unresolved after editor restart (r14 stub disease)");
            if (router.ceoOrderPulse == null) throw new InvalidOperationException("ceoOrderPulse clip lost across sessions");
            if (router.ceoOrderPulse.length < 2.0f || router.ceoOrderPulse.length > 2.4f)
                throw new InvalidOperationException("persisted clip length off spec: " + router.ceoOrderPulse.length.ToString("F3"));
            if (UnityEngine.Object.FindObjectsOfType<CityInterior>().Length < 1) throw new InvalidOperationException("CityInterior unresolved after restart");
            if (UnityEngine.Object.FindObjectsOfType<CityCameraRig>().Length < 1) throw new InvalidOperationException("CityCameraRig unresolved after restart");
            if (UnityEngine.Object.FindObjectsOfType<CityAmbient>().Length < 1) throw new InvalidOperationException("CityAmbient unresolved after restart");
            GameObject camGo = GameObject.Find("CityCamera");
            Camera cam = camGo != null ? camGo.GetComponent<Camera>() : null;
            if (cam == null || Math.Abs(cam.orthographicSize - 20f) > 0.01f) throw new InvalidOperationException("L0 camera broken after restart");
            if (GameObject.Find("CityAudio") != null) throw new InvalidOperationException("mixer GO persisted into scene (runtime-only law broken)");
            if (router.Core == null) throw new InvalidOperationException("core build failed after restart");
            if (router.AudioPlays != 0) throw new InvalidOperationException("AudioPlays not zero at cold start");
            return "reload_gate=OK component=resolved clip=" + router.ceoOrderPulse.length.ToString("F2")
                + "s neighbors=3 cam_L0=" + cam.orthographicSize.ToString("F1") + " no_mixer_go core=poll-ready";
        }
    }
}
