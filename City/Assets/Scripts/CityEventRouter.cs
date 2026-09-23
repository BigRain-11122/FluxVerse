// FluxVerse r14: CityEventRouter - thin MonoBehaviour adapter of the event router (r12 logic).
// SEPARATE FILE LAW (r14): MonoBehaviour classes must live in a <ClassName>.cs file or the
// serialized scene reference breaks across editor sessions (Tuanjie writes embedded
// class-name stubs for mismatched names which do not re-resolve; the r12-saved component
// came back as a missing script on reload). Logic core (FluxEventRouter + GlowPulse)
// stays in EventRouter.cs. Polls world/world-events.jsonl READ-ONLY every ~10s.
// r25 (P-27 first wire): also taps the same dispatch into FluxAudioRouter (CEO_ORDER ->
// signature/ceo_order_pulse). The mixer GameObject is runtime-only (UiKit law: never saved
// into the scene); audio plays in play mode only, edit/batch modes stay silent.
using System.IO;
using UnityEngine;

namespace FluxVerse
{
    // thin scene component: saved into CityScene by the repair proof; play mode runs the loop for real
    public class CityEventRouter : MonoBehaviour
    {
        // wired into CityScene by AudioProof (r25 CEO row; r30 P-27 rows batch 2);
        // R-20260923-audio-assets.md 1.1 rows whose event types are live-emitted
        public AudioClip ceoOrderPulse;
        public AudioClip commitBlip;        // COMMIT        -> sfx_scifi/Laser_00
        public AudioClip taskClaimSfx;      // TASK_CLAIM    -> sfx_scifi/Robot_Activated_00
        public AudioClip marketBellOpen;    // MARKET_OPEN   -> signature/market_bell_open
        public AudioClip marketBellClose;  // MARKET_CLOSE  -> signature/market_bell_close
        public AudioClip weatherAlert;     // WEATHER_ALERT -> signature/s0_red_alert
        public AudioClip residentTalk;     // RESIDENT_SAY  -> sfx_scifi/Robot_Talk_00

        FluxEventRouter core;
        FluxAudioRouter audioCore;   // not 'audio': hides deprecated Component.audio (CS0108)

        public FluxEventRouter Core
        {
            get
            {
                if (core == null)
                {
                    // <repo>/world/world-events.jsonl from <repo>/City/Assets
                    string repoRoot = Path.GetDirectoryName(Path.GetDirectoryName(Application.dataPath));
                    core = new FluxEventRouter(Path.Combine(repoRoot, "world", "world-events.jsonl"), FindAnchor);
                    core.SeekToEnd();
                    audioCore = new FluxAudioRouter(delegate (string p, float v) { PlayClipAsset(p, v); });   // void-wrap (CS0407 law)
                    core.EventSink = audioCore.OnEvent;   // same dispatch -> glow pulse + sound (dual)
                }
                return core;
            }
        }

        static Vector3? FindAnchor(string name)
        {
            GameObject a = GameObject.Find(name);
            return a == null ? (Vector3?)null : a.transform.position;
        }

        void Update()
        {
            Core.Tick(Time.deltaTime);
        }

        // proof tap: count of events the sink chain routed into the player delegate
        public int AudioPlays { get { return audioCore != null ? audioCore.Plays : 0; } }

        // asset path -> wired clip; unwired path = null (silent-degrade, honesty law)
        public AudioClip ResolveClip(string assetPath)
        {
            if (assetPath == FluxAudioRouter.CeoOrderClip) return ceoOrderPulse;
            if (assetPath == FluxAudioRouter.CommitClip) return commitBlip;
            if (assetPath == FluxAudioRouter.TaskClaimClip) return taskClaimSfx;
            if (assetPath == FluxAudioRouter.MarketOpenClip) return marketBellOpen;
            if (assetPath == FluxAudioRouter.MarketCloseClip) return marketBellClose;
            if (assetPath == FluxAudioRouter.WeatherAlertClip) return weatherAlert;
            if (assetPath == FluxAudioRouter.ResidentTalkClip) return residentTalk;
            return null;
        }

        // player delegate for FluxAudioRouter; returns false when nothing played
        // (missing clip, or edit/batch mode where the runtime mixer must not spawn)
        public bool PlayClipAsset(string assetPath, float vol)
        {
            AudioClip clip = ResolveClip(assetPath);
            if (clip == null) return false;
            if (!Application.isPlaying) return false;   // play-mode-only (runtime-only GO law)
            EnsureAudioSource().PlayOneShot(clip, vol);
            return true;
        }

        AudioSource EnsureAudioSource()
        {
            GameObject go = GameObject.Find("CityAudio");
            if (go == null)
            {
                go = new GameObject("CityAudio");       // runtime-only, never saved (UiKit law)
                go.transform.position = Vector3.zero;
            }
            AudioSource s = go.GetComponent<AudioSource>();
            if (s == null) s = go.AddComponent<AudioSource>();
            s.playOnAwake = false;
            return s;
        }
    }
}
