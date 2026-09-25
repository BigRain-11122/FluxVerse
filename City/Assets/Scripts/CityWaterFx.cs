// FluxVerse r155 (P-20260925-09): CityWaterFx - the water-fx adapter (W1
// frame cycle + W2 reflection/shimmer tier alpha + W3 foam frames + W5
// wobble/rain). Scene-persistent root GO "CityWaterFx", zero serialized
// wiring beyond the two asset arrays (CityStreetBehavior r124 precedent:
// the perceptor owns every write, this component never writes any file).
// SEPARATE FILE LAW (r14): MonoBehaviour lives in <ClassName>.cs.
// Serialized refs (assigned once by WaterFxProof, then carried by the scene):
//   frameTiles[8]  = Tile assets t_water_0..t_water_7 (builder vocabulary)
//   foamSprites[8] = foam-n-0..3 (base 0) + foam-s-0..3 (base 4)
// Update: 0.5s accumulator (0.25s in rain) -> full-band SetTile sweep (swaps
// VARIANTS only - census identity 606) + foam frame swap + refl/shimmer
// wobble. Tier + weather are handed by CityAmbient's EXISTING public fields
// (CurrentTier / CurrentMode - zero new poll face, manifest family law);
// tier changes are picked up by change detection, so no other component
// knows this one exists.
// Disk boot state (proof-saved): mounts at the day law (refl/shim alpha 0,
// foam 1.0) + builder static paint hash. The first live Update applies the
// real tier before the first rendered frame - the saved scene never learns
// runtime states (r124 disk law); wobble positions likewise re-derive from
// WaterFxRules every apply (flip-safe fresh Find, r146 law).
// Honest degrade: a missing tile/sprite/GO skips silently here - the PROOF
// fails loud instead (probe contract). ASCII. No 3D.
using UnityEngine;
using UnityEngine.Tilemaps;

namespace FluxVerse
{
    public class CityWaterFx : MonoBehaviour
    {
        public Tile[] frameTiles = new Tile[WaterFxRules.FrameSlots];
        public Sprite[] foamSprites = new Sprite[8];

        Tilemap water;
        CityAmbient amb;
        float acc;
        int tick = -1;                       // -1 -> first tick = full-band rewrite (first_tick law)
        AmbientTier lastTier = (AmbientTier)(-99);   // sentinel: force first apply
        bool appliedOnce;

        public int CurrentTick { get { return tick; } }

        void Update()
        {
            EnsureRefs();
            if (amb != null && !appliedOnce)
            {
                appliedOnce = true;
                lastTier = amb.CurrentTier;
                ApplyTier(lastTier);
            }
            else if (amb != null && amb.CurrentTier != lastTier)
            {
                lastTier = amb.CurrentTier;
                ApplyTier(lastTier);
            }
            bool rain = amb != null && amb.CurrentMode == WeatherMode.Rain;
            float tickSec = rain ? WaterFxRules.TickSecRain : WaterFxRules.TickSec;
            acc += Time.deltaTime;
            if (water != null && acc >= tickSec)
            {
                acc = 0f;
                tick++;
                ApplyTick(tick);
                ApplyWobble(tick, rain);
            }
        }

        // resolve the water band tilemap + the ambient tier/weather source
        public void EnsureRefs()
        {
            if (water == null)
            {
                GameObject w = GameObject.Find("Water");
                if (w != null) water = w.GetComponent<Tilemap>();
            }
            if (amb == null)
            {
                GameObject a = GameObject.Find("CityAmbient");
                if (a != null) amb = a.GetComponent<CityAmbient>();
            }
        }

        // full-band SetTile sweep: swaps tile variants only, never adds or
        // removes cells (census identity). Eight-frame law when the whole
        // vocabulary imported; mod-4 fallback over the legacy set otherwise.
        public void ApplyTick(int t)
        {
            if (water == null) return;
            bool eight = HasEightFrames();
            for (int x = WaterFxRules.CellX0; x <= WaterFxRules.CellX1; x++)
                for (int y = WaterFxRules.RowY0; y <= WaterFxRules.RowY1; y++)
                {
                    int slot = eight ? WaterFxRules.FrameSlotFor(x, y, t)
                                     : WaterFxRules.FallbackSlotFor(x, y, t);
                    Tile tile = frameTiles != null && slot < frameTiles.Length ? frameTiles[slot] : null;
                    if (tile == null) continue;   // honest degrade, never crash the band
                    water.SetTile(new Vector3Int(x, y, 0), tile);
                }
            int f = ((t % WaterFxRules.FoamFrames) + WaterFxRules.FoamFrames) % WaterFxRules.FoamFrames;
            int fn = WaterFxRules.FoamIndexOf(true);
            int fs = WaterFxRules.FoamIndexOf(false);
            if (fn >= 0) SetFoamFrame(fn, f);
            if (fs >= 0) SetFoamFrame(fs, f);
        }

        public void SetFoamFrame(int i, int f)
        {
            GameObject go = GameObject.Find(WaterFxRules.Name(i));
            if (go == null) return;
            SpriteRenderer sr = go.GetComponent<SpriteRenderer>();
            if (sr == null) return;
            int baseIdx = WaterFxRules.FoamBase(i);
            Sprite s = foamSprites != null && baseIdx + f < foamSprites.Length ? foamSprites[baseIdx + f] : null;
            if (s != null) sr.sprite = s;
        }

        // tier alpha: refl + shimmer follow the tier law, foam = bank line 1.0
        public void ApplyTier(AmbientTier t)
        {
            float a = WaterFxRules.TierAlpha(t);
            for (int i = 0; i < WaterFxRules.MountCount; i++)
            {
                GameObject go = GameObject.Find(WaterFxRules.Name(i));
                if (go == null) continue;
                SpriteRenderer sr = go.GetComponent<SpriteRenderer>();
                if (sr == null) continue;
                float alpha = WaterFxRules.FamilyOf(i) == WaterFxRules.FamilyFoam
                    ? WaterFxRules.FoamAlpha : a;
                sr.color = new Color(1f, 1f, 1f, alpha);
            }
        }

        // wobble: refl + shimmer mounts slide +-amp along x; foam stays
        // bank-pinned. Positions re-derive from the table every apply.
        public void ApplyWobble(int t, bool rain)
        {
            float off = WaterFxRules.WobbleOffset(t, rain);
            for (int i = 0; i < WaterFxRules.MountCount; i++)
            {
                if (WaterFxRules.FamilyOf(i) == WaterFxRules.FamilyFoam) continue;
                GameObject go = GameObject.Find(WaterFxRules.Name(i));
                if (go == null) continue;
                Vector3 p = go.transform.position;
                go.transform.position = new Vector3(WaterFxRules.CenterX(i) + off, p.y, p.z);
            }
        }

        // restore every wobbled mount to its law position (proof save face)
        public void RestoreWobble()
        {
            for (int i = 0; i < WaterFxRules.MountCount; i++)
            {
                if (WaterFxRules.FamilyOf(i) == WaterFxRules.FamilyFoam) continue;
                GameObject go = GameObject.Find(WaterFxRules.Name(i));
                if (go == null) continue;
                Vector3 p = go.transform.position;
                go.transform.position = new Vector3(WaterFxRules.CenterX(i), p.y, p.z);
            }
        }

        bool HasEightFrames()
        {
            if (frameTiles == null || frameTiles.Length < WaterFxRules.FrameSlots) return false;
            for (int i = 0; i < WaterFxRules.FrameSlots; i++)
                if (frameTiles[i] == null) return false;
            return true;
        }
    }
}
