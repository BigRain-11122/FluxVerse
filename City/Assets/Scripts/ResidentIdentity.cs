// FluxVerse P-22(2) r39: engine-side resident identity pool - pure data core.
// The 12 street residents (ResidentRules sprite face, r37) get real BigLife
// census identities (citizens-light.jsonl - the CODEX sec.12 contracted export
// face, read-only). This is the M2 identity pool substrate the r37 window
// opened; the PRESENTATION faces (nameplates, P-23(2) barks) consume this core
// in later slices - this file owns no visuals by design.
//
// Data flow: Tools/city/bake-resident-identity.ps1 (deterministic PS bake,
// district law + carbon filter + seed/stride selection) writes
// Assets/Data/residents-identity.json; this core parses it with JsonUtility
// (UTF-8 CJK strings parse fine; the file carries layer:"narrative" on every
// entry - CODEX sec.1 honesty law: census citizens are the narrative layer and
// every consumer inherits the marker by construction).
//
// Slot -> home district law (CODEX sec.3 spatial canon): the census districts
// ARE the city districts (QT=QUANT / GM=GAME / MD=MEDIA / NS=north governance
// shore / RV=river+light bridge / OR=outer perception ring). Street slots:
//   0-2 QUANT plaza -> QT | 3-4 GAME front plaza -> GM | 5-6 MEDIA front -> MD
//   7 south street west -> GM | 8 south street east -> QT
//   9-10 north promenade + 11 north street -> NS
// RV and OR have NO street slots in the visible frame (the river is a pure
// water band, the outer ring is off-frame) - they join when their visuals
// land; identities are never invented for districts with no ground.
// ResidentIdentityProof re-derives this table from the LIVE tilemaps.
//
// Degrade law (honest absence): missing/broken data file -> Load() returns
// null; runtime faces read null as "identity absent this build" and stay
// silent - the PROOF fails loud instead. Pure 2D. ASCII. No 3D.
using System;
using System.IO;
using UnityEngine;

namespace FluxVerse
{
    // one street slot's census identity (mirrors the baked JSON fields)
    [Serializable]
    public class ResidentIdentityEntry
    {
        public int slot;          // 0..11 == ResidentRules index
        public string go;         // scene GO name == ResidentRules.Name(slot)
        public string district;   // home district (CODEX sec.3)
        public string id;         // census id C-#####
        public string name;       // CJK name
        public string species;    // always "carbon" for the human sprite slots
        public string gender;
        public int age;           // bare int (dual-format census law, see bake)
        public string faction;
        public string block;      // home block inside the district
        public string profession;
        public string axis;       // thought axis ("" when the citizen has none)
        public string creed;      // short creed line
        public string layer;      // honesty law: always "narrative"
    }

    [Serializable]
    public class ResidentIdentityFile
    {
        public ResidentIdentityEntry[] slots;
    }

    // pure static core: district law + data-file parse. No MonoBehaviour (the
    // v0 slice wires nothing into the scene; SEPARATE FILE LAW n/a).
    public static class ResidentIdentity
    {
        public const int Count = 12;                       // == ResidentRules.Count
        public const int Seed = 20260924;                  // P-22(2) window-open date (fixed: a committed roster must not churn daily)
        public const int Stride = 1999;                    // CityWatch voice-face prime (selection-law family)
        public const string LayerMarker = "narrative";      // CODEX sec.1
        public const string DataRelPath = "Data/residents-identity.json";

        static readonly string[] DistrictTable = new string[]
        {
            "QT", "QT", "QT",      // 0-2 south QUANT plaza
            "GM", "GM",            // 3-4 GAME front plaza
            "MD", "MD",            // 5-6 MEDIA front plaza
            "GM",                  // 7 south street west (nearest GAME block)
            "QT",                  // 8 south street east (nearest QUANT block)
            "NS", "NS", "NS"       // 9-10 north promenade, 11 north street
        };

        public static string DistrictOf(int i) { return DistrictTable[i]; }

        static ResidentIdentityEntry[] loaded;

        public static bool Loaded { get { return loaded != null; } }

        // parse Assets/Data/residents-identity.json. Null = honest absence
        // (missing file / bad JSON / wrong slot count) - never a throw.
        public static ResidentIdentityEntry[] Load(bool force = false)
        {
            if (loaded != null && !force) return loaded;
            string path = Path.Combine(Application.dataPath, DataRelPath);
            if (!File.Exists(path)) return null;
            ResidentIdentityFile f = null;
            try { f = JsonUtility.FromJson<ResidentIdentityFile>(File.ReadAllText(path)); }
            catch { return null; }
            if (f == null || f.slots == null || f.slots.Length != Count) return null;
            loaded = f.slots;
            return loaded;
        }

        public static ResidentIdentityEntry At(int i)
        {
            ResidentIdentityEntry[] a = Load();
            if (a == null) return null;
            return (i >= 0 && i < a.Length) ? a[i] : null;
        }

        public static void Unload() { loaded = null; }
    }
}
