// FluxVerse P-27 r25 (first audio wire): event type -> clip key pure core.
// R-20260923-audio-assets.md section 1.1 row "CEO order" only for v0 (P-27 item 4
// first-entry gate): CEO_ORDER -> signature/ceo_order_pulse, the brand first sound,
// fired by the SAME dispatch as the r12 gold glow pulse = dual presentation.
// Pure logic, zero GameObject/AudioSource: headless-testable; the CityEventRouter
// adapter owns the real player delegate. Honesty law (R- 1.1): every sound must
// anchor a real event -- unmapped type = silent, never a fallback jingle.
// Volume canon (P-27 item 3): signature layer 1.0. All comments ASCII. No 3D.
using System;
using System.Collections.Generic;

namespace FluxVerse
{
    public class FluxAudioRouter
    {
        public const float SignatureVolume = 1.0f;   // P-27 item 3 mixing canon: signature 1.0
        public const string CeoOrderClip = "Assets/Audio/signature/ceo_order_pulse.wav";

        // R- 1.1 mapping table. v0 = first entry only; one line per future row
        // (future rows also need the FluxEventRouter.PollOnce cheap-gate widened).
        static readonly Dictionary<string, string> map = new Dictionary<string, string>
        {
            { "CEO_ORDER", CeoOrderClip },
        };

        readonly Action<string, float> player;   // (assetPath, volume)
        public int Plays { get; private set; }

        public FluxAudioRouter(Action<string, float> player)
        {
            this.player = player;
        }

        public static string SoundFor(string type)
        {
            string p;
            return map.TryGetValue(type, out p) ? p : null;
        }

        // wired as FluxEventRouter.EventSink; unmapped = silent (honesty law)
        public void OnEvent(FluxEvent ev)
        {
            if (ev == null) return;
            string path = SoundFor(ev.type);
            if (path == null) return;
            if (player != null) player(path, SignatureVolume);
            Plays++;
        }
    }
}
