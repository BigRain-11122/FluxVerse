// FluxVerse r31 (P-27 item 2): CityAmbientAudio - ambient bed adapter (four-tier BGM
// by city_day_phase + weather layer + always-on city noise). SEPARATE FILE LAW (r14):
// a component class must live in <ClassName>.cs or the saved scene reference dies
// across editor sessions (Tuanjie writes embedded class-name stubs that never
// re-resolve). Pure core = FluxAmbientBed (AudioRouter.cs, headless-testable).
// State source = the CityAmbient component on the same GameObject (tier/mode/alert/
// wind read-only getters; same 10s world-state poll, no second file read).
// Play-mode-only law (UiKit runtime law): the loop-bed GameObject is constructed at
// runtime and NEVER saved into the scene; in edit/batch mode ApplyBed updates the
// selection state only and stays silent (bed proofs run in edit mode on that state).
// Unwired clip field = that layer stays silent (honesty law, never a fallback
// jingle). Audible verification = play mode (batch has no audio device, r25 honesty
// boundary); listening calibration = P-27 item 6 v2. Pure 2D. All comments ASCII.
using UnityEngine;

namespace FluxVerse
{
    public class CityAmbientAudio : MonoBehaviour
    {
        public AudioClip noiseBed;                              // ambience/busy_cyberworld
        public AudioClip bgmDawn, bgmDay, bgmDusk, bgmNight;    // music x4 by day phase
        public AudioClip weatherRain;                           // rain_loop_2 (moderate)
        public AudioClip weatherStorm;                          // rain_loop_3 (gale/severe)
        public AudioClip weatherWind;                            // wind2 (dry Beaufort 6+)

        public string CurrentBgm { get; private set; }        // resolved path, "" = silent
        public string CurrentWeather { get { return currentWeather; } }
        public bool BedActive { get { return bgmSrc != null; } }

        string currentWeather = "";
        AudioSource bgmSrc, noiseSrc, weatherSrc;
        string appliedBgm, appliedWeather;   // null sentinels: never equal a real selection
        CityAmbient ambient;

        public AudioClip ResolveClip(string assetPath)
        {
            if (assetPath == FluxAmbientBed.NoiseBedClip) return noiseBed;
            if (assetPath == FluxAmbientBed.BgmDawnClip) return bgmDawn;
            if (assetPath == FluxAmbientBed.BgmDayClip) return bgmDay;
            if (assetPath == FluxAmbientBed.BgmDuskClip) return bgmDusk;
            if (assetPath == FluxAmbientBed.BgmNightClip) return bgmNight;
            if (assetPath == FluxAmbientBed.WeatherRainClip) return weatherRain;
            if (assetPath == FluxAmbientBed.WeatherStormClip) return weatherStorm;
            if (assetPath == FluxAmbientBed.WeatherWindClip) return weatherWind;
            return null;
        }

        // single selection path for play mode AND edit-mode proofs (proof calls this
        // directly with the same signature; Update only feeds it from CityAmbient)
        public void ApplyBed(AmbientTier tier, WeatherMode mode, bool alert, float windMs)
        {
            CurrentBgm = ResolveOrNull(FluxAmbientBed.BgmFor(tier));
            currentWeather = ResolveOrNull(FluxAmbientBed.WeatherFor(mode, alert, windMs));
            if (!Application.isPlaying) return;   // edit/batch: selection state only (silent law)
            EnsureBed();
            if (CurrentBgm != appliedBgm)
            {
                SetLoop(bgmSrc, CurrentBgm, FluxAmbientBed.BgmVolume);
                appliedBgm = CurrentBgm;
            }
            if (CurrentWeather != appliedWeather)
            {
                SetLoop(weatherSrc, CurrentWeather, FluxAmbientBed.AmbientVolume);
                appliedWeather = CurrentWeather;
            }
        }

        void Update()
        {
            if (!Application.isPlaying) return;
            if (ambient == null) ambient = FindObjectOfType<CityAmbient>();
            if (ambient == null) return;   // no state source yet: stay silent (honesty)
            ApplyBed(ambient.CurrentTier, ambient.CurrentMode, ambient.AlertOn, ambient.WindMs);
        }

        string ResolveOrNull(string assetPath)
        {
            if (string.IsNullOrEmpty(assetPath)) return "";
            return ResolveClip(assetPath) != null ? assetPath : "";   // unwired = silent
        }

        void EnsureBed()
        {
            if (bgmSrc != null) return;
            GameObject go = new GameObject("CityAmbientAudio");   // runtime-only, never saved
            go.transform.position = Vector3.zero;
            bgmSrc = AddSource(go, FluxAmbientBed.BgmVolume);
            noiseSrc = AddSource(go, FluxAmbientBed.AmbientVolume);
            weatherSrc = AddSource(go, FluxAmbientBed.AmbientVolume);
            if (noiseBed != null)   // always-on city noise floor starts with the bed
            {
                noiseSrc.clip = noiseBed;
                noiseSrc.Play();
            }
        }

        static AudioSource AddSource(GameObject go, float vol)
        {
            AudioSource s = go.AddComponent<AudioSource>();
            s.playOnAwake = false;
            s.loop = true;
            s.volume = vol;
            return s;
        }

        void SetLoop(AudioSource s, string assetPath, float vol)
        {
            if (s == null) return;
            if (string.IsNullOrEmpty(assetPath)) { s.Stop(); s.clip = null; return; }
            AudioClip c = ResolveClip(assetPath);
            if (c == null) { s.Stop(); s.clip = null; return; }
            s.clip = c;
            s.volume = vol;
            s.Play();
        }
    }
}
