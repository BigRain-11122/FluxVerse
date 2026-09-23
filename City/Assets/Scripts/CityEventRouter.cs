// FluxVerse r14: CityEventRouter - thin MonoBehaviour adapter of the event router (r12 logic).
// SEPARATE FILE LAW (r14): MonoBehaviour classes must live in a <ClassName>.cs file or the
// serialized scene reference breaks across editor sessions (Tuanjie writes embedded
// class-name stubs for mismatched names which do not re-resolve; the r12-saved component
// came back as a missing script on reload). Logic core (FluxEventRouter + GlowPulse)
// stays in EventRouter.cs. Polls world/world-events.jsonl READ-ONLY every ~10s.
using System.IO;
using UnityEngine;

namespace FluxVerse
{
    // thin scene component: saved into CityScene by the repair proof; play mode runs the loop for real
    public class CityEventRouter : MonoBehaviour
    {
        FluxEventRouter core;

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
    }
}
