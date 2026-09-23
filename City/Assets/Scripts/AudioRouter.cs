// FluxVerse P-27 r25 (first wire) -> r30 (rows batch 2): event type -> clip pure core.
// R-20260923-audio-assets.md section 1.1 mapping table. v0 (r25) = CEO_ORDER only;
// r30 widens to every row whose event type is ACTUALLY EMITTED by the live stream
// (registry + world-events.jsonl type census) AND whose clip sits in the pack:
//   COMMIT->Laser_00, TASK_CLAIM->Robot_Activated_00, MARKET_OPEN/CLOSE->bells,
//   WEATHER_ALERT->s0_red_alert, RESIDENT_SAY->Robot_Talk_00.
// Rows with no live event source yet stay OUT (honesty law: sound anchors a real
// event, never decoration): OS_TICK/GATE_*/TRANSFER/MACHINE_* are P-12 pending.
// Volume canon (P-27 item 3): signature layer 1.0, event-SFX layer 0.8.
// r31 (P-27 item 2): FluxAmbientBed appended - four-tier BGM by city_day_phase +
// weather layer by weather_kind + always-on city noise bed (same volume canon family).
// Pure logic, zero GameObject/AudioSource: headless-testable; the CityEventRouter
// adapter owns the real player delegate. Unmapped type = silent, never a fallback
// jingle. All comments ASCII. No 3D.
using System;
using System.Collections.Generic;

namespace FluxVerse
{
    public class FluxAudioRouter
    {
        public const float SignatureVolume = 1.0f;   // P-27 item 3 mixing canon: signature 1.0
        public const float SfxVolume = 0.8f;         // P-27 item 3 mixing canon: event SFX 0.8

        public const string CeoOrderClip     = "Assets/Audio/signature/ceo_order_pulse.wav";
        public const string CommitClip       = "Assets/Audio/sfx_scifi/Laser_00.mp3";
        public const string TaskClaimClip    = "Assets/Audio/sfx_scifi/Robot_Activated_00.mp3";
        public const string MarketOpenClip    = "Assets/Audio/signature/market_bell_open.wav";
        public const string MarketCloseClip  = "Assets/Audio/signature/market_bell_close.wav";
        public const string WeatherAlertClip = "Assets/Audio/signature/s0_red_alert.wav";
        public const string ResidentTalkClip = "Assets/Audio/sfx_scifi/Robot_Talk_00.mp3";

        class Row
        {
            public readonly string Path;
            public readonly float Vol;
            public Row(string p, float v) { Path = p; Vol = v; }
        }

        // R- 1.1 mapping table, one row per live event type (single source of truth:
        // FluxEventRouter's cheap gate reads MappedTypes so gate and map can never drift).
        static readonly Dictionary<string, Row> map = new Dictionary<string, Row>
        {
            { "CEO_ORDER",     new Row(CeoOrderClip,     SignatureVolume) },
            { "COMMIT",        new Row(CommitClip,       SfxVolume) },
            { "TASK_CLAIM",    new Row(TaskClaimClip,    SfxVolume) },
            { "MARKET_OPEN",   new Row(MarketOpenClip,   SignatureVolume) },
            { "MARKET_CLOSE",  new Row(MarketCloseClip,  SignatureVolume) },
            { "WEATHER_ALERT", new Row(WeatherAlertClip, SignatureVolume) },
            { "RESIDENT_SAY",  new Row(ResidentTalkClip, SfxVolume) },
        };

        readonly Action<string, float> player;   // (assetPath, volume)
        public int Plays { get; private set; }

        public FluxAudioRouter(Action<string, float> player)
        {
            this.player = player;
        }

        public static ICollection<string> MappedTypes { get { return map.Keys; } }

        public static string SoundFor(string type)
        {
            Row r;
            return map.TryGetValue(type, out r) ? r.Path : null;
        }

        public static float VolumeFor(string type)
        {
            Row r;
            return map.TryGetValue(type, out r) ? r.Vol : 0f;
        }

        // wired as FluxEventRouter.EventSink; unmapped = silent (honesty law)
        public void OnEvent(FluxEvent ev)
        {
            if (ev == null) return;
            Row r;
            if (!map.TryGetValue(ev.type, out r)) return;
            if (player != null) player(r.Path, r.Vol);
            Plays++;
        }
    }

    // r31 (P-27 item 2): ambient bed pure core - four-tier BGM by city_day_phase +
    // weather layer + always-on city noise. Mapping = R-20260923-audio-assets.md
    // section 1.2 (semantic inference; listening calibration = P-27 item 6 v2).
    // Volume canon (P-27 item 3): BGM 0.35 (never covers city information),
    // ambient/environment layer 0.5. Tier tracks: dawn=calm_synthwave, day=synth_wave_0,
    // dusk=tt_caves (smallest of the cyber pool; pool rotation/crossfade = v2),
    // night=midnight_drive. Weather: rain=rain_loop_2, gale/severe alert enhances to
    // rain_loop_3; snow = silence (no snow asset in the pack - honesty law, never a
    // substitute jingle); dry wind >= 10.8 m/s (Beaufort 6 strong-breeze family) =
    // wind2 layer. Headless-testable; the CityAmbientAudio adapter owns the players.
    public static class FluxAmbientBed
    {
        public const float BgmVolume = 0.35f;     // P-27 item 3: BGM below city info
        public const float AmbientVolume = 0.5f;  // P-27 item 3: ambient/weather layer

        public const string NoiseBedClip   = "Assets/Audio/ambience/busy_cyberworld.ogg";
        public const string BgmDawnClip    = "Assets/Audio/music/calm_synthwave_421k.mp3";
        public const string BgmDayClip     = "Assets/Audio/music/synth_wave_0.mp3";
        public const string BgmDuskClip    = "Assets/Audio/music/tt_caves.ogg";
        public const string BgmNightClip   = "Assets/Audio/music/midnight_drive.ogg";
        public const string WeatherRainClip  = "Assets/Audio/weather/rain_loop_2.ogg";
        public const string WeatherStormClip = "Assets/Audio/weather/rain_loop_3.ogg";
        public const string WeatherWindClip  = "Assets/Audio/weather/wind2.wav";

        public const float WindLayerMs = 10.8f;   // Beaufort 6 lower bound

        public static string BgmFor(AmbientTier t)
        {
            switch (t)
            {
                case AmbientTier.Dawn: return BgmDawnClip;
                case AmbientTier.Day:  return BgmDayClip;
                case AmbientTier.Dusk: return BgmDuskClip;
                default:               return BgmNightClip;
            }
        }

        public static string WeatherFor(WeatherMode mode, bool alert, float windMs)
        {
            if (mode == WeatherMode.Rain) return alert ? WeatherStormClip : WeatherRainClip;
            if (mode == WeatherMode.Snow) return null;   // no snow asset: silence (honesty)
            if (windMs >= WindLayerMs) return WeatherWindClip;
            return null;
        }
    }
}
