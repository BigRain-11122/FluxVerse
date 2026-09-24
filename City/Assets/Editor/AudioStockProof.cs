// FluxVerse P-37 r81 slice 2: deliberate audio stock value-fix batch proof.
// Scope: the 41 stock clips under Assets/Audio keep audit-era values
// (music loadType 0 = whole-decoded-PCM resident memory bomb; SFX
// preloadAudioData off = first-play disk stall - R-20260924-asset-import.md
// A3/A4). Slice 1 landed the pipeline (CityImportPostprocessor.OnPreprocessAudio)
// but stock metas were deliberately left untouched (r68 note, R- 3.2 step 2/3
// = stock value fixes are deliberate importer-edit batches). This batch
// force-reimports every stock clip once so the pipeline applies + stamps.
// Sentinel pattern (r11 builder / r71 ImportProof style):
//   logs/audiostock.run -> FluxVerse.AudioStockProof.BatchRun -> logs/audiostock.done
// Sections:
//  S0 inventory: exactly 41 clips (music 8 / ambience 1 / sfx_scifi 16 /
//     signature 10 / weather 6); unclassified path = throw; guid captured;
//  S1 fix, idempotent per clip: stamped-and-correct = skip; unstamped =
//     one ForceImport (OnPreprocessAudio guard sees empty userData and
//     applies); stamped-but-wrong = throw (pipeline law: a stamp is manual
//     configuration, forever respected);
//  S2 verify, all 41, two faces: AudioImporter API + raw meta text
//     (music: loadType 2 Streaming / preload off / loadInBackground on;
//      others: loadType 0 DecompressOnLoad / preload on / bg off);
//  S3 GUID preservation: every guid line byte-identical before/after
//     (scene serialized references are GUID-based = structural no-break);
//  S4 scene zero-regression: open CityScene, NEVER save; the 7 serialized
//     event clips + 8 bed clips must all resolve; scene file bytes unchanged;
//  S5 streaming smoke: a cured music clip still loads (length > 0).
// RAM DoD honesty note: batch has no audio device (r25 law); play-mode RAM
// numbers belong to the play-mode face (P-27 item 6 listening round). The
// loadType flip is the structural cure per official semantics: Streaming
// decodes from disc, near-zero resident PCM (8 tracks x ~15MB ogg).
// Fail-loud: any broken assumption throws into the .done report.
// All comments ASCII. No 3D.
using System;
using System.Collections.Generic;
using System.IO;
using UnityEngine;
using UnityEditor;
using UnityEditor.SceneManagement;

namespace FluxVerse
{
    public static class AudioStockProof
    {
        const string MARK = "fvimport:v1";

        static string ProjectRoot { get { return Path.GetDirectoryName(Application.dataPath); } }
        static string RepoRoot { get { return Path.GetDirectoryName(ProjectRoot); } }
        static string RunPath { get { return Path.Combine(RepoRoot, "logs", "audiostock.run"); } }
        static string DonePath { get { return Path.Combine(RepoRoot, "logs", "audiostock.done"); } }

        [InitializeOnLoadMethod]
        static void Hook()
        {
            if (File.Exists(RunPath)) EditorApplication.delayCall += Run;
        }

        public static void BatchRun() { Run(); }

        static string AbsOf(string assetPath)
        {
            return Path.Combine(Application.dataPath, assetPath.Substring("Assets/".Length));
        }

        static string MetaText(string assetPath)
        {
            return File.ReadAllText(AbsOf(assetPath) + ".meta");
        }

        static string GuidLine(string meta)
        {
            foreach (string ln in meta.Split('\n'))
                if (ln.TrimStart().StartsWith("guid:")) return ln.Trim();
            throw new InvalidOperationException("no guid line in meta");
        }

        static bool IsMusic(string p) { return p.StartsWith("Assets/Audio/music/"); }

        static void AssertValues(AudioImporter ai, string p)
        {
            var s = ai.defaultSampleSettings;
            if (IsMusic(p))
            {
                if (s.loadType != AudioClipLoadType.Streaming)
                    throw new InvalidOperationException("S2 music loadType " + p + " actual=" + s.loadType);
                if (s.preloadAudioData) throw new InvalidOperationException("S2 music preload on " + p);
                if (!ai.loadInBackground) throw new InvalidOperationException("S2 music bg off " + p);
            }
            else
            {
                if (s.loadType != AudioClipLoadType.DecompressOnLoad)
                    throw new InvalidOperationException("S2 sfx loadType " + p + " actual=" + s.loadType);
                if (!s.preloadAudioData) throw new InvalidOperationException("S2 sfx preload off " + p);
                if (ai.loadInBackground) throw new InvalidOperationException("S2 sfx bg on " + p);
            }
            if (ai.userData != MARK)
                throw new InvalidOperationException("S2 mark " + p + " ud='" + ai.userData + "'");
        }

        static void AssertMeta(string p)
        {
            string mt = MetaText(p);
            if (mt.IndexOf("userData: fvimport:v1") < 0)
                throw new InvalidOperationException("S2 meta mark " + p);
            if (IsMusic(p))
            {
                if (mt.IndexOf("loadType: 2") < 0) throw new InvalidOperationException("S2 meta loadType " + p);
                if (mt.IndexOf("preloadAudioData: 0") < 0) throw new InvalidOperationException("S2 meta preload " + p);
                if (mt.IndexOf("loadInBackground: 1") < 0) throw new InvalidOperationException("S2 meta bg " + p);
            }
            else
            {
                if (mt.IndexOf("loadType: 0") < 0) throw new InvalidOperationException("S2 meta loadType " + p);
                if (mt.IndexOf("preloadAudioData: 1") < 0) throw new InvalidOperationException("S2 meta preload " + p);
                if (mt.IndexOf("loadInBackground: 0") < 0) throw new InvalidOperationException("S2 meta bg " + p);
            }
        }

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

        static string Prove()
        {
            // ---- S0 inventory ----
            var found = new List<string>(AssetDatabase.FindAssets("t:AudioClip", new[] { "Assets/Audio" }));
            if (found.Count == 0) throw new InvalidOperationException("S0: no audio under Assets/Audio");
            var all = new List<string>();
            foreach (string g in found) all.Add(AssetDatabase.GUIDToAssetPath(g));
            all.Sort();
            int music = 0, ambience = 0, scifi = 0, signature = 0, weather = 0;
            foreach (string p in all)
            {
                if (p.StartsWith("Assets/Audio/music/")) music++;
                else if (p.StartsWith("Assets/Audio/ambience/")) ambience++;
                else if (p.StartsWith("Assets/Audio/sfx_scifi/")) scifi++;
                else if (p.StartsWith("Assets/Audio/signature/")) signature++;
                else if (p.StartsWith("Assets/Audio/weather/")) weather++;
                else throw new InvalidOperationException("S0: unclassified audio " + p);
            }
            if (all.Count != 41 || music != 8 || ambience != 1 || scifi != 16 || signature != 10 || weather != 6)
                throw new InvalidOperationException("S0: inventory shifted total=" + all.Count
                    + " m=" + music + " amb=" + ambience + " sci=" + scifi + " sig=" + signature + " wx=" + weather);

            var guidBefore = new Dictionary<string, string>();
            foreach (string p in all) guidBefore[p] = GuidLine(MetaText(p));

            // pre-state honesty counter (as-audited disease visibility; no hard
            // assertion so a green re-run stays idempotent)
            int preMusicStreaming = 0;
            foreach (string p in all)
            {
                var ai0 = AssetImporter.GetAtPath(p) as AudioImporter;
                if (IsMusic(p) && ai0 != null && ai0.defaultSampleSettings.loadType == AudioClipLoadType.Streaming)
                    preMusicStreaming++;
            }

            // ---- S1 fix (idempotent) ----
            int fixedNow = 0, skipped = 0;
            foreach (string p in all)
            {
                var ai = AssetImporter.GetAtPath(p) as AudioImporter;
                if (ai == null) throw new InvalidOperationException("S1: not an audio importer " + p);
                if (!string.IsNullOrEmpty(ai.userData))
                {
                    AssertValues(ai, p);   // stamped = manual config: must already be right, else throw
                    skipped++;
                    continue;
                }
                AssetDatabase.ImportAsset(p, ImportAssetOptions.ForceSynchronousImport);
                var ai2 = AssetImporter.GetAtPath(p) as AudioImporter;
                if (ai2 == null) throw new InvalidOperationException("S1: importer lost " + p);
                AssertValues(ai2, p);
                fixedNow++;
            }

            // ---- S2 verify (API + meta text, all 41) ----
            foreach (string p in all)
            {
                var ai = AssetImporter.GetAtPath(p) as AudioImporter;
                AssertValues(ai, p);
                AssertMeta(p);
            }

            // ---- S3 GUID preservation ----
            foreach (string p in all)
            {
                if (GuidLine(MetaText(p)) != guidBefore[p])
                    throw new InvalidOperationException("S3: guid changed " + p);
            }

            // ---- S4 scene zero-regression (open only, never save) ----
            string scenePath = "Assets/Scenes/CityScene.unity";
            string sceneAbs = AbsOf(scenePath);
            if (!File.Exists(sceneAbs)) throw new InvalidOperationException("S4: CityScene missing");
            byte[] sceneBefore = File.ReadAllBytes(sceneAbs);
            var scene = EditorSceneManager.OpenScene(scenePath, OpenSceneMode.Single);
            if (!scene.isLoaded) throw new InvalidOperationException("S4: scene failed to load");
            GameObject routerGo = GameObject.Find("CityEventRouter");
            if (routerGo == null) throw new InvalidOperationException("S4: CityEventRouter GO missing");
            CityEventRouter router = routerGo.GetComponent<CityEventRouter>();
            if (router == null) throw new InvalidOperationException("S4: router unresolved (r14 stub disease)");
            if (router.ceoOrderPulse == null) throw new InvalidOperationException("S4: ceoOrderPulse unwired");
            if (router.commitBlip == null) throw new InvalidOperationException("S4: commitBlip unwired");
            if (router.taskClaimSfx == null) throw new InvalidOperationException("S4: taskClaimSfx unwired");
            if (router.marketBellOpen == null) throw new InvalidOperationException("S4: marketBellOpen unwired");
            if (router.marketBellClose == null) throw new InvalidOperationException("S4: marketBellClose unwired");
            if (router.weatherAlert == null) throw new InvalidOperationException("S4: weatherAlert unwired");
            if (router.residentTalk == null) throw new InvalidOperationException("S4: residentTalk unwired");
            CityAmbientAudio[] beds = UnityEngine.Object.FindObjectsOfType<CityAmbientAudio>();
            if (beds.Length != 1) throw new InvalidOperationException("S4: bed components=" + beds.Length);
            CityAmbientAudio bed = beds[0];
            if (bed.noiseBed == null) throw new InvalidOperationException("S4: noiseBed unwired");
            if (bed.bgmDawn == null || bed.bgmDay == null || bed.bgmDusk == null || bed.bgmNight == null)
                throw new InvalidOperationException("S4: bgm phase clips unwired");
            if (bed.weatherRain == null || bed.weatherStorm == null || bed.weatherWind == null)
                throw new InvalidOperationException("S4: weather bed clips unwired");
            byte[] sceneAfter = File.ReadAllBytes(sceneAbs);
            if (sceneAfter.Length != sceneBefore.Length)
                throw new InvalidOperationException("S4: scene file length changed (proof must never save)");
            for (int i = 0; i < sceneAfter.Length; i++)
                if (sceneAfter[i] != sceneBefore[i])
                    throw new InvalidOperationException("S4: scene bytes changed at " + i);

            // ---- S5 streaming smoke ----
            var clip = AssetDatabase.LoadAssetAtPath<AudioClip>("Assets/Audio/music/tt_caves.ogg");
            if (clip == null || clip.length <= 0f) throw new InvalidOperationException("S5: streaming clip not loadable");

            return "audiostock total=" + all.Count + " music=" + music + " ambience=" + ambience
                 + " scifi=" + scifi + " signature=" + signature + " weather=" + weather
                 + " preMusicStreaming=" + preMusicStreaming + " fixedNow=" + fixedNow + " skipped=" + skipped
                 + " guidPreserved=" + all.Count + " sceneClips=15 sceneBytesStable=1"
                 + " streamingSmoke=1 idempotent=" + (fixedNow == 0 ? 1 : 0);
        }
    }
}
