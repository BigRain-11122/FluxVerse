// FluxVerse r158 (P-20260925-09): CityLightFx - the light-fx adapter (D3
// bloom/cone/wet tier sweep + D4 star twinkle). Scene-persistent root GO
// "CityLightFx", zero serialized wiring (the mounts persist with their sprite
// refs; this component only drives runtime colors - CityStreetBehavior r124
// law). SEPARATE FILE LAW (r14): MonoBehaviour lives in <ClassName>.cs.
// Tier + weather come from CityAmbient's EXISTING public field CurrentTier
// (zero new poll face, manifest family law); tier changes are picked up by
// change detection, so no other component knows this one exists.
// Update: tier-change sweep (57 mounts, fresh Find per apply = flip-safe
// against any rebuild, r146 law) + 0.5s twinkle accumulator (stars only at
// night; per-star phase = index mod 4).
// Disk boot state (proof-saved): all mounts at the DAY law colors. The first
// live Update applies the real tier before the first rendered frame - the
// saved scene never learns runtime states (r124 disk law).
// Honest degrade: a missing mount GO/renderer skips silently here - the
// PROOF fails loud instead (probe contract). ASCII. No 3D.
using UnityEngine;

namespace FluxVerse
{
    public class CityLightFx : MonoBehaviour
    {
        CityAmbient amb;
        float acc;
        int step;
        AmbientTier lastTier = (AmbientTier)(-99);   // sentinel: force first apply
        bool appliedOnce;

        public int CurrentStep { get { return step; } }
        public AmbientTier CurrentAppliedTier { get { return lastTier; } }

        void Update()
        {
            if (amb == null)
            {
                GameObject a = GameObject.Find("CityAmbient");
                if (a != null) amb = a.GetComponent<CityAmbient>();
            }
            if (amb != null)
            {
                if (!appliedOnce)
                {
                    appliedOnce = true;
                    lastTier = amb.CurrentTier;
                    ApplyState(lastTier, step);
                }
                else if (amb.CurrentTier != lastTier)
                {
                    lastTier = amb.CurrentTier;
                    ApplyState(lastTier, step);
                }
            }
            acc += Time.deltaTime;
            if (acc >= LightFxRules.TwinkleStepSec)
            {
                acc = 0f;
                step++;
                ApplyState(lastTier, step);   // twinkle step; non-star alphas re-assert same law
            }
        }

        // full deterministic sweep (proof pump + play path share this one law):
        // bloom/cone/wet = the family tier alpha; stars = tier alpha x twinkle
        // factor. RGB stays neutral white - every family color is baked into
        // the r157 textures (five-color law lives in the asset, not the tint).
        public void ApplyState(AmbientTier t, int stepIdx)
        {
            lastTier = t;
            for (int i = 0; i < LightFxRules.MountCount; i++)
            {
                GameObject go = GameObject.Find(LightFxRules.Name(i));
                if (go == null) continue;
                SpriteRenderer sr = go.GetComponent<SpriteRenderer>();
                if (sr == null) continue;
                float a = LightFxRules.FamilyOf(i) == LightFxRules.FamilyStars
                    ? LightFxRules.StarMountAlpha(i - LightFxRules.StarsFirst, t, stepIdx)
                    : LightFxRules.AlphaOf(i, t);
                sr.color = new Color(1f, 1f, 1f, a);
            }
        }
    }
}
