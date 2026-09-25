// FluxVerse P-75 slice B (r124): street-resident behavior consumption - PURE LAW CORE.
// Sources (single-source law): TECH sec.9 r122 row (the consumption law) +
// Tools/city/eaveslots-manifest.json (r123 sandbox verdict, 365 assertions - the
// eave geometry single source; ResidentProof cross-checks the table below
// against that manifest file every run, OfficeProof r111 pattern).
//
// Data face: world/world-state.json -> state.street_behavior (probe
// street_behavior r121): { ctx, generated_utc, total, visible, nodata,
// seats[32] }, per seat { slot, go, id, state, visible, quirk, recovering }.
// The world/ dir is the perceptor's single-writer domain (P-43 law): this core
// READS ONLY, never writes. The seats are roster-ordered street slots - the
// engine slot index IS the seat index (ResidentRules table).
//
// LAWS (r122 item 1, mirrored verbatim):
//  (b) VISIBILITY - per-seat presence = (visible == 1). FULL re-derive on every
//      apply (no incremental drift - the R3 "same input, same bytes" law's
//      engine-side dual: position and presence are ALWAYS state-derived).
//      Absent section / absent file = GRANDFATHER: all 32 visible, all home
//      (zero regression while BigLife's export is missing). A row whose go
//      name does not match the seat keeps grandfather for that seat (honest
//      degrade on data drift - the coupling key is the GO name).
//  (c) SHELTER - state == "shelter" AND quirk == "umbrella" -> stays at the
//      street HOME position (the street-with-umbrella face, behavior.py law 3);
//      state == "shelter" without umbrella AND a deterministic bucket hit ->
//      candidate for the district eave slot. Capacity 1 per slot: the candidate
//      with the LOWEST roster slot takes it, overflow stays home (r123
//      assignment law). Districts with no slot (QUANT / GAME), the TOWER anchor
//      seat and cross-city VISITOR seats fall back home (honest fallback - no
//      fake shelter for a district with no eave). Any other state restores
//      home. Invisible shelterers stay home (presence law wins).
//  (d) ANCHOR - NO special case: the C-00001 honor seat follows the data face
//      like everyone else (r122 verdict - a permanent-presence override would
//      be decorative and break the honesty law; a CEO flip is one line here).
//
// BUCKET HASH (this core's own law - r122 left the function to the engine
// round): FNV-1a (32-bit offset basis 2166136261, prime 16777619) over the
// census id characters, h % 10 < 3 -> a ~30% deterministic subset. Current
// roster census: 9/32 hits (MEDIA 4: slots 17/18/20/23 - lowest takes the
// slot; NORTH 1: slot 25). behavior.py decides WHO is visible / sheltering;
// this core only derives presence + position. ASCII. Pure 2D. No 3D.
using System;
using System.Collections.Generic;
using System.IO;
using UnityEngine;

namespace FluxVerse
{
    // one street seat's behavior row (mirrors the probe state face)
    [Serializable]
    public class StreetBehaviorSeat
    {
        public int slot;
        public string go;
        public string id;
        public string state;
        public int visible;
        public string quirk;
        public int recovering;
    }

    // the whole street_behavior state section
    [Serializable]
    public class StreetBehaviorSnapshot
    {
        public string ctx;
        public string generated_utc;
        public int total;
        public int visible;
        public int nodata;
        public StreetBehaviorSeat[] seats;
    }

    // pure static law core: parse + derive. No MonoBehaviour.
    public static class StreetBehaviorRules
    {
        public const int Count = 32;                     // == ResidentRules.Count
        public const string ShelterState = "shelter";     // behavior.py STATES member
        public const string UmbrellaQuirk = "umbrella";  // behavior.py QUIRKS member
        public const int BucketMod = 10;
        public const int BucketCut = 3;                   // h % 10 < 3

        // ---- eave slots (r123 manifest: quota MEDIA 1 + NORTH 1, capacity 1) ----
        public struct EaveSlot
        {
            public string id;      // manifest slot id
            public string district; // seat ZONE the slot serves
            public float x, y;     // stand position (seat-class law: body 1.333u)
            public int capacity;
        }

        public const int EaveCount = 2;
        static readonly EaveSlot[] EaveTable = new EaveSlot[]
        {
            new EaveSlot { id = "EAVE-M01", district = "MEDIA", x = 33.5f,    y = -11f, capacity = 1 },
            new EaveSlot { id = "EAVE-N01", district = "NORTH", x = 24.6667f, y = 11f,  capacity = 1 },
        };

        public static EaveSlot Eave(int e) { return EaveTable[e]; }
        public static Vector2 EavePos(int e) { return new Vector2(EaveTable[e].x, EaveTable[e].y); }

        // seat zone -> eave slot index; -1 = no slot (honest home fallback)
        public static int EaveIndexForZone(string zone)
        {
            for (int e = 0; e < EaveCount; e++)
                if (EaveTable[e].district == zone) return e;
            return -1;
        }

        // deterministic bucket hash: FNV-1a over the census id, reduced mod 10
        public static int HashOf(string id)
        {
            if (string.IsNullOrEmpty(id)) return 0;
            uint h = 2166136261u;
            for (int k = 0; k < id.Length; k++)
            {
                h ^= (uint)id[k];
                h *= 16777619u;
            }
            return (int)(h % (uint)BucketMod);
        }

        public static bool BucketHit(string id) { return HashOf(id) < BucketCut; }

        [Serializable]
        class StateFile { public StreetBehaviorSnapshot street_behavior; }

        // whole-state-file parse (unknown fields ignored); null = honest absence
        public static StreetBehaviorSnapshot Parse(string json)
        {
            if (string.IsNullOrEmpty(json)) return null;
            try
            {
                StateFile f = JsonUtility.FromJson<StateFile>(json);
                return f == null ? null : f.street_behavior;
            }
            catch { return null; }
        }

        static string StatePath()
        {
            string projectRoot = Path.GetDirectoryName(Application.dataPath);   // .../City
            string repoRoot = Path.GetDirectoryName(projectRoot);               // .../FluxVerse
            return Path.Combine(repoRoot, "world", "world-state.json");
        }

        // the live perceptor snapshot; null = absent file / absent section
        public static StreetBehaviorSnapshot LoadStateFile()
        {
            string p = StatePath();
            if (!File.Exists(p)) return null;
            return Parse(File.ReadAllText(p));
        }

        // ---- derive: the one law path play mode and proofs both walk ----
        public struct SeatPlan
        {
            public bool visible;    // presence law (b)
            public Vector2 pos;     // home restore / eave relocate (c)
            public int eave;        // eave slot index served, -1 = home
            public bool managed;    // false = grandfather (no matching row)
        }

        public static void Derive(StreetBehaviorSnapshot snap, SeatPlan[] plans)
        {
            if (plans == null || plans.Length != Count)
                throw new InvalidOperationException("plans array must hold exactly " + Count + " seats");
            for (int i = 0; i < Count; i++)
            {
                plans[i].visible = true;
                plans[i].pos = ResidentRules.Pos(i);
                plans[i].eave = -1;
                plans[i].managed = false;
            }
            if (snap == null || snap.seats == null) return;   // grandfather face

            List<int>[] wait = new List<int>[EaveCount];
            for (int e = 0; e < EaveCount; e++) wait[e] = new List<int>();
            for (int r = 0; r < snap.seats.Length; r++)
            {
                StreetBehaviorSeat row = snap.seats[r];
                if (row == null) continue;
                int s = row.slot;
                if (s < 0 || s >= Count) continue;
                if (row.go != ResidentRules.Name(s)) continue;   // drift row -> grandfather
                plans[s].managed = true;
                plans[s].visible = row.visible == 1;
                if (!plans[s].visible) continue;                 // presence law wins
                if (row.state != ShelterState) continue;        // non-shelter restores home
                if (row.quirk == UmbrellaQuirk) continue;       // street-with-umbrella face
                if (!BucketHit(row.id)) continue;               // bucket miss stays home
                int e = EaveIndexForZone(ResidentRules.ZoneOf(s));
                if (e >= 0) wait[e].Add(s);                      // no slot / visitor / tower -> home
            }
            for (int e = 0; e < EaveCount; e++)
            {
                if (wait[e].Count == 0) continue;
                int best = wait[e][0];                          // capacity pick: lowest roster slot
                for (int k = 1; k < wait[e].Count; k++)
                    if (wait[e][k] < best) best = wait[e][k];
                plans[best].pos = EavePos(e);
                plans[best].eave = e;
            }
        }
    }
}
