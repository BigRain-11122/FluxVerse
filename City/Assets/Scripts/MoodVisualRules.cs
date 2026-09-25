// FluxVerse P-71(3) r146 (slice B): mood-visual pure core - the engine mirror
// of Tools/city/mood-visual-manifest.json (the r145 sandbox, 71 assertions
// green; that manifest = the single parameter source for THIS round, LabsRules
// manifest-mirror idiom). The city mood director (MoodDirector.cs, r144
// byte-mirror of BigLife mood_director.py - the LAW SOURCE) drives a
// CLOSED-BAND multiplicative modulation of exactly two existing visual
// channels:
//   1. neon_intensity  - the 17 modulated persistent neon signs (NeonRules
//      table minus the 4-sign MountExempt structure family: the r132 tower
//      crown needles NeonTowerAntM/L/R + the r87 QUANT rooftop lattice
//      NeonAntenna - tower/antenna STRUCTURE, not street mood scenery).
//      Runtime face = sr.color grayscale multiplier, white = neutral.
//   2. breath_peak_scale - EventRouter.BreathGlow per-OS-round ring peak
//      (base 0.8) scaled by the mood row, hard-capped below the CEO pulse
//      MaxAlpha 0.95 (CEO-precedence law: the CEO light is never outranked
//      by ambient choreography; max effective 0.8 x 1.15 = 0.92 < 0.95).
//
// Laws mirrored from the manifest (fluxverse-moodvisual/0.2 - the r146
// re-derivation of the r145 v0.1 sandbox: the up-band rows died to the engine
// physics probe, see render_physics_law):
//   - zero-drift: steady AND somber rows are exactly 1.0 on every channel -
//     the baseline never drifts; somber's visual IS the existing r13 ALERT
//     red band + rain/snow field (linkage without new construction, r143).
//   - render-physics (r146 probe evidence): SpriteRenderer.color RGB > 1 clamps
//     at the render-path input (x2.0 tint moved 0 window pixels while 17970
//     sub-saturated sampled pixels stood in the windows) - a multiplicative
//     tint can ONLY dim. Neon domain = [0.85, 1.0]; lively/festive neon rows
//     = 1.0 (the v0.1 1.10/1.15 up-bands were physically inert = falsified);
//     up-mood energy rides the breath channel (real alpha 0.8 -> 0.92).
//   - grayscale: every value is a single scalar = structurally hue-free
//     (five-color law and every proof-baseline hue untouched).
//   - degrade: mood absent (null / unknown string) => steady row x1.0
//     (MoodDirector null law r144 - honest silence, grandfather face).
//   - bands: neon [0.85, 1.0] (dim-only), breath [0.70, 1.15]; setters clamp,
//     the effective breath peak = min(0.8 x scale, 0.95).
// Proof surface: NeonProof A3 cross-checks THIS table against the manifest
// JSON byte-for-byte; EventRouterProof A6 gates the breath parameterization;
// NeonProof D2 enforces the input-clamp law on the live render path.
// ASCII. Pure static core, no MonoBehaviour. No 3D.
using UnityEngine;

namespace FluxVerse
{
    public static class MoodVisualRules
    {
        public const string Protocol = "fluxverse-moodvisual/0.2";
        public const int BakedRound = 146;                 // manifest origin (v0.2 re-derivation)
        public const int ModulatedCount = 17;             // 21 signs - 4 exempt
        public const int ExemptCount = 4;

        // channel bands (manifest channels.*.band)
        public const float NeonMin = 0.85f, NeonMax = 1.0f;   // dim-only renderable domain (render_physics_law)
        public const float BreathMin = 0.70f, BreathMax = 1.15f;

        // breath peak law (manifest channels.breath_peak_scale)
        public const float BreathBasePeak = 0.8f;         // BreathGlow base peak alpha
        public const float PulseCeiling = 0.95f;          // GlowPulse CEO MaxAlpha precedence

        // the five closed-set mood rows (manifest moods.*), parallel arrays -
        // NeonProof A3 asserts this mirror against the JSON file.
        static readonly string[] MoodNames =
            { "steady", "lively", "festive", "somber", "hushed" };
        static readonly float[] NeonRow = { 1.0f, 1.0f, 1.0f, 1.0f, 0.85f };
        static readonly float[] BreathRow = { 1.0f, 1.15f, 1.10f, 1.0f, 0.70f };

        public static int MoodIndex(string mood)
        {
            if (mood == null) return -1;
            for (int i = 0; i < MoodNames.Length; i++) if (MoodNames[i] == mood) return i;
            return -1;
        }

        // row lookup with the degrade law: unknown / absent mood = steady x1.0
        public static float NeonScaleFor(string mood)
        {
            int i = MoodIndex(mood);
            return i < 0 ? 1.0f : NeonRow[i];
        }

        public static float BreathScaleFor(string mood)
        {
            int i = MoodIndex(mood);
            return i < 0 ? 1.0f : BreathRow[i];
        }

        public static float ClampNeonScale(float v) { return Mathf.Clamp(v, NeonMin, NeonMax); }
        public static float ClampBreathScale(float v) { return Mathf.Clamp(v, BreathMin, BreathMax); }

        // effective breath ring peak = base x scale, never at/above the CEO pulse
        public static float EffectiveBreathPeak(float scale)
        {
            return Mathf.Min(BreathBasePeak * ClampBreathScale(scale), PulseCeiling);
        }

        // grayscale law: the neon carrier tint is one scalar, equal-RGB, opaque
        public static Color NeonTint(float scale)
        {
            return new Color(scale, scale, scale, 1f);
        }

        // is table sign i part of the exempt structure family (never modulated)?
        public static bool IsExemptSign(int i)
        {
            return NeonRules.At(i).mount == NeonRules.MountExempt;
        }

        // table census: modulated sign count (proof asserts == ModulatedCount
        // == manifest channels.neon_intensity.modulated_count)
        public static int ModulatedSignCensus()
        {
            int c = 0;
            for (int i = 0; i < NeonRules.Count; i++) if (!IsExemptSign(i)) c++;
            return c;
        }

        public static int ExemptSignCensus()
        {
            int c = 0;
            for (int i = 0; i < NeonRules.Count; i++) if (IsExemptSign(i)) c++;
            return c;
        }
    }
}
