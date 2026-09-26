// FluxVerse P-75 slice B (r124): CityStreetBehavior - thin MonoBehaviour adapter
// of the street-resident behavior face. SEPARATE FILE LAW (r14): the component
// class must live in <ClassName>.cs or the saved scene reference dies across
// editor sessions. The pure law core (StreetBehaviorRules) owns EVERY decision;
// this adapter only WIRES: it polls world/world-state.json READ-ONLY every
// ~10s (CityAmbient law; world/ is the perceptor's single-writer domain) and
// applies the derived plan to the 32 street seats. Zero serialized fields ->
// the scene-persisted root GO survives everything; ResidentProof creates it
// idempotently (CityAmbient precedent).
//
// FULL RE-DERIVE per apply (r122 law b): presence (SetActive) and position are
// ALWAYS state-derived - never incremental, never sticky. The seat is the
// body+shadow DUO (r179 S5b: the nameplate face moved to the UI shell,
// ResidentLabelsUI - a hidden body with a floating shadow would be a ghost
// face; the LABEL inherits the trio law on the UI side: hidden seat -> no
// label). Positions: home = ResidentRules table (restore on any non-shelter
// state), eave = the r123 manifest slots (shelter law). Shadow derives from
// the feet line - the single-source formula, evaluated at the live position.
//
// CACHE LAW: GameObject.Find skips INACTIVE objects (r34 law), so references
// resolve ONCE on the first apply while the scene still holds every seat
// scene-default active; later ticks reuse the cache - a hidden seat still
// restores. Proofs drive ApplyState directly: the same path Poll() walks
// (r115 TriggerDirect precedent). Missing/broken state file -> ApplyState(null)
// -> grandfather face (all visible, all home) - honest absence, the PROOF
// fails loud instead. Pure 2D. ASCII. No 3D.
using UnityEngine;

namespace FluxVerse
{
    public class CityStreetBehavior : MonoBehaviour
    {
        public const string GoName = "CityStreetBehavior";
        public const float PollIntervalSec = 10f;   // CityAmbient polling law

        GameObject[] roots;
        Transform[] bodies;
        GameObject[] shadows;
        float pollTimer = 999f;      // poll on first Update

        void Update()
        {
            pollTimer += Time.deltaTime;
            if (pollTimer < PollIntervalSec) return;
            pollTimer = 0f;
            Poll();
        }

        // play-mode entry: read the live perceptor snapshot, then the shared law path
        public void Poll()
        {
            ApplyState(StreetBehaviorRules.LoadStateFile());
        }

        // the shared law path: play-mode polls and batch proofs both land here.
        // null snap = grandfather face (all 32 visible, all home).
        public void ApplyState(StreetBehaviorSnapshot snap)
        {
            EnsureCache();
            StreetBehaviorRules.SeatPlan[] plans =
                new StreetBehaviorRules.SeatPlan[StreetBehaviorRules.Count];
            StreetBehaviorRules.Derive(snap, plans);
            for (int i = 0; i < StreetBehaviorRules.Count; i++)
            {
                GameObject root = roots[i];
                if (root == null) continue;   // honest degrade; the PROOF fails loud
                bool vis = plans[i].visible;
                if (root.activeSelf != vis) root.SetActive(vis);
                if (shadows[i] != null && shadows[i].activeSelf != vis)
                    shadows[i].SetActive(vis);
                if (!vis) continue;           // hidden duo: position irrelevant, keep home
                Vector3 p = new Vector3(plans[i].pos.x, plans[i].pos.y, 0f);
                bodies[i].position = p;
                if (shadows[i] != null)
                    shadows[i].transform.position = new Vector3(p.x,
                        p.y - ResidentRules.HalfSide - ResidentRules.ShadowDropY, 0f);
            }
        }

        // resolve every seat reference once (cache law - see file header)
        void EnsureCache()
        {
            if (roots != null) return;
            roots = new GameObject[StreetBehaviorRules.Count];
            bodies = new Transform[StreetBehaviorRules.Count];
            shadows = new GameObject[StreetBehaviorRules.Count];
            for (int i = 0; i < StreetBehaviorRules.Count; i++)
            {
                GameObject r = GameObject.Find(ResidentRules.Name(i));
                if (r == null) continue;
                roots[i] = r;
                bodies[i] = r.transform;
                GameObject sh = GameObject.Find(ResidentRules.ShadowName(i));
                if (sh != null) shadows[i] = sh;
            }
        }
    }
}
