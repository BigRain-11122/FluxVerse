// FluxVerse P-22(2) r99: engine-side resident identity pool - pure data core.
// The r39 substrate (12 census identities, seed/stride pick) is retired by the
// P-68 batch1 roster: the 32 street residents are census-derived by the GROUP
// production line (cph4 fa7d951 bake-residents.ps1 -> batch1/manifest.json ->
// atlas manifest), and the r98 bake (Tools/city/bake-resident-street.ps1)
// three-source-joined them into Assets/Data/residents-street.json. That file
// is now the SINGLE identity substrate: this core parses it directly and the
// old residents-identity.json twin (a copied-table disease) is gone.
//
// Selection law: OWNED BY THE GROUP PRODUCTION LINE (not re-implemented here).
// The proof's census cross-check verifies every slot's fields against the
// BigLife census source BY ID (field equality per id) - the law is "the roster
// is census-true", no local pick logic exists to drift.
//
// District law (CODEX sec.3 spatial canon + r96/r98 refinements):
//   QT=QUANT / GM=GAME / MD=MEDIA / NS=north governance shore for the city
//   seats; the TOWER anchor seat (C-00001) carries an EMPTY district (honor
//   seat, r73 law); VISITOR seats carry their REAL home districts (OR outer
//   perception ring / RV river-lightbridge) while STANDING on the south
//   street - seat != identity claim (r96 law).
//
// Honesty law (CODEX sec.1): layer = "narrative" on every census-derived
// slot; the anchor seat (C-00001, human-origin disclosure P-58) carries
// layer = "anchor". Age -1 = census null (undisclosed, the anchor seat).
//
// Degrade law (honest absence): missing/broken data file -> Load() returns
// null; runtime faces read null as "identity absent this build" and stay
// silent - the PROOF fails loud instead. Pure 2D. ASCII. No 3D.
using System;
using System.IO;
using UnityEngine;

namespace FluxVerse
{
    // one street slot's full record (mirrors the baked street-JSON fields)
    [Serializable]
    public class ResidentIdentityEntry
    {
        public int slot;          // 0..31 == ResidentRules index
        public string go;         // scene GO name == ResidentRules.Name(slot)
        public string zone;      // seat zone (QUANT/GAME/MEDIA/NORTH/TOWER/VISITOR)
        public string district;   // home district ("" on the anchor seat)
        public string id;         // census id C-#####
        public string name;       // CJK name
        public string species;    // carbon / silicon / sprite
        public string gender;
        public int age;           // -1 = census null (anchor seat, undisclosed)
        public string faction;
        public string block;      // home block inside the district
        public string profession;
        public string axis;       // thought axis ("" when the citizen has none)
        public string creed;      // short creed line
        public string layer;      // honesty law: "narrative", anchor seat = "anchor"
        public string hairPart;   // hair-short / hair-long
        public string eyePart;    // eyes-dot / eyes-led / being (sprite species)
        public string pantC;      // palette (hex "#RRGGBB"; sprite rows: empty)
        public string skinC;
        public string hairC;
        public string clothC;
        public string badgeC;
        public string eyeC;
        public string coreC;      // sprite core tint (sprite rows: only this set)
        public int plateIndex;    // b1 nameplate atlas-row order (r97 bake law)
        public string plateName;  // plate glyph text (leading-CJK-segment law)
    }

    [Serializable]
    public class ResidentIdentityFile
    {
        public ResidentIdentityEntry[] slots;
    }

    // pure static core: district law + data-file parse. No MonoBehaviour.
    public static class ResidentIdentity
    {
        public const int Count = 32;                       // == ResidentRules.Count
        public const string NarrativeLayer = "narrative";  // CODEX sec.1
        public const string AnchorLayer = "anchor";        // P-58 human-origin disclosure
        public const int AnchorSlot = 26;                  // C-00001 tower-flank honor seat
        public const string DataRelPath = "Data/residents-street.json";

        // slot -> home district (the anchor seat claims none; visitors claim
        // their real home districts - the SEAT zone never overrides identity)
        static readonly string[] DistrictTable = new string[]
        {
            "QT", "QT", "QT", "QT", "QT", "QT", "QT", "QT", "QT",   // 0-8  QUANT plaza
            "GM", "GM", "GM", "GM", "GM", "GM", "GM",               // 9-15 GAME
            "MD", "MD", "MD", "MD", "MD", "MD", "MD", "MD",         // 16-23 MEDIA
            "NS", "NS",                                            // 24-25 north walkway
            "",                                                    // 26 TOWER anchor (empty)
            "OR", "OR", "OR", "OR", "RV"                            // 27-31 visitors (real homes)
        };

        public static string DistrictOf(int i) { return DistrictTable[i]; }

        static ResidentIdentityEntry[] loaded;

        public static bool Loaded { get { return loaded != null; } }

        // parse Assets/Data/residents-street.json. Null = honest absence
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
