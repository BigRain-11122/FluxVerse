// FluxVerse P-39 slice (r142): batch proof for the CPH4 Labs block v0.1
// (lab-glass consumption, law = Tools/city/labs-manifest.json, the r141
// 2291-assertion sandbox; provenance = TECH sec.9 P-39 r139..r141 rows).
// Sentinel pattern (r35..r110 style):
//   pass 1: logs/labs.run         -> FluxVerse.LabsProof.BatchRun   -> logs/labs.done
//   pass 2: logs/labs-reload.run -> FluxVerse.LabsProof.ReloadGate -> logs/labs-reload.done
// Sections (C# proof-mirror law r103: every gate mirrors the r141 sandbox):
//  A pure-core gates: 12-entry table == the manifest (world/px/asset/ppu
//    mirror-read straight from labs-manifest.json - single geometry source),
//    family laws (pod order 3 / pipe order 6), px pins, world==px/PPU24,
//    pod integer cells + low-rise cap 12 < offices 13 < brain 19, frame,
//    tint band, river rows, road law (pod never touches a road cell; the
//    run crosses the east avenue ONLY inside the elevated band y>=13 -
//    exactly one crossing segment), band uniformity + far-shore clearance
//    (13.6667 < 14.26) + zone disjointness vs COMMIT river band / TRANSFER
//    street band, chain connectivity (10 contiguous 2u segments, west dock
//    == NeonRules.Buildings[7].x1, east dock == pod east face), stub
//    host-mount (sinks 0.3333 into the pod top, span inside the run + pod),
//    66-pair mutual non-overlap with the single registered stub<->pod
//    host-mount exemption, zero-encroachment census vs every live single
//    source, detector positive controls (the r141 pinned probes), asset
//    pins on disk.
//  B asset gate: Sprite+Single+Point+PPU24+no-mips forced on all 3 lab
//    files (r34 importer-default disease law), rect==manifest px, natural
//    bounds==world size, .meta existence (first editor import, r140 note).
//  C CityScene wiring: live props census 44 (no-tilemap-delta law), live
//    anchor GOs == canon, pod feet-cell pavement re-derivation from the
//    live Ground/Roads/Water tilemaps, avenue road cells under the
//    elevated crossing + the y=10 underfoot road row (detector), stale
//    Lab* sweep -> 12 GOs from the table (fresh LoadAssetAtPath, r10 law)
//    -> idempotent second build -> save -> disk round-trip -> neighbor
//    regressions (neon/robots/residents/tags/vehicles/offices/terraces,
//    skyline, bed, interior, rig, adapters, L0 camera, runtime-only laws).
//  D render gates: day/dusk/night L0 pairs (labs-hidden baselines, clean
//    attribution) with pod/run/stub window deltas + the atmosphere law
//    (night sits under dusk); the L1 labs street view (cam 19,5 - street
//    family |camX|<=30, r138 law). Screenshots: docs/design/
//    m1-r142-labs-{day,dusk,night,l1-north}.png (the dusk shot is the r44
//    harmony evidence; NOTE the r44 mechanical warm-shift face was derived
//    for the AA-016 daytime-flat family - the CPH4-blue glass family
//    carries its own anchor palette, so harmony rides the multimodal frame
//    while the atmosphere law stays gated).
//  E pass 2: everything survives an editor restart (12 persisted, importer
//    settings, neighbors intact).
// Fail-loud: any broken assumption throws into the .done report. ASCII only. No 3D.
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using UnityEngine;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine.SceneManagement;
using UnityEngine.Tilemaps;

namespace FluxVerse
{
    public static class LabsProof
    {
        static string ProjectRoot { get { return Path.GetDirectoryName(Application.dataPath); } }
        static string RepoRoot { get { return Path.GetDirectoryName(ProjectRoot); } }
        static string RunPath { get { return Path.Combine(RepoRoot, "logs", "labs.run"); } }
        static string DonePath { get { return Path.Combine(RepoRoot, "logs", "labs.done"); } }
        static string ReloadRunPath { get { return Path.Combine(RepoRoot, "logs", "labs-reload.run"); } }
        static string ReloadDonePath { get { return Path.Combine(RepoRoot, "logs", "labs-reload.done"); } }
        static string ScenePath { get { return "Assets/Scenes/CityScene.unity"; } }
        static int asserts;

        // anchor canon (CitySkeletonBuilder MakeAnchor calls - live-checked in C;
        // BrainTower (0.5,14) = tower-v2 visual center, r133 canon)
        static readonly Vector2[] AnchorCanon =
        {
            new Vector2(0.5f, 14f),     // BrainTower
            new Vector2(-20.5f, -11f),  // Zone_GAME
            new Vector2(0.5f, -12f),    // Zone_QUANT
            new Vector2(22f, -11f),     // Zone_MEDIA
        };

        // r99 nameplate geometry (ResidentTags law, plate census mirror)
        const float PlateHalfW = 1.375f;    // 66px / PPU24 / 2
        const float PlateOffsetY = 1.4167f; // 0.665 + 8/24 + 10/24
        const float PlateHalfH = 0.41667f;  // 20px / PPU24 / 2

        [InitializeOnLoadMethod]
        static void Hook()
        {
            if (File.Exists(RunPath)) EditorApplication.delayCall += Run;
            if (File.Exists(ReloadRunPath)) EditorApplication.delayCall += ReloadRun;
        }

        public static void BatchRun() { Run(); }
        public static void ReloadGate() { ReloadRun(); }

        static void Run()
        {
            if (!File.Exists(RunPath)) return;   // single-shot guard
            try
            {
                string report = Prove();
                File.WriteAllText(DonePath, "OK " + report + " ts=" + DateTime.UtcNow.ToString("o"));
            }
            catch (Exception e)
            {
                File.WriteAllText(DonePath, "FAIL " + e.GetType().Name + ": " + e.Message + " | " + e.StackTrace
                    + " ts=" + DateTime.UtcNow.ToString("o"));
            }
            finally { if (File.Exists(RunPath)) File.Delete(RunPath); }
        }

        static void ReloadRun()
        {
            if (!File.Exists(ReloadRunPath)) return;
            try
            {
                string report = ReloadProve();
                File.WriteAllText(ReloadDonePath, "OK " + report + " ts=" + DateTime.UtcNow.ToString("o"));
            }
            catch (Exception e)
            {
                File.WriteAllText(ReloadDonePath, "FAIL " + e.GetType().Name + ": " + e.Message + " | " + e.StackTrace
                    + " ts=" + DateTime.UtcNow.ToString("o"));
            }
            finally { if (File.Exists(ReloadRunPath)) File.Delete(ReloadRunPath); }
        }

        static void Chk(bool ok, string what)
        {
            if (!ok) throw new InvalidOperationException("ASSERT FAIL: " + what);
            asserts++;
        }

        static bool Overlap(float ax0, float ay0, float ax1, float ay1, float bx0, float by0, float bx1, float by1)
        {
            return ax0 < bx1 && bx0 < ax1 && ay0 < by1 && by0 < ay1;
        }

        static bool ContainsPoint(float x0, float y0, float x1, float y1, float px, float py)
        {
            return x0 < px && px < x1 && y0 < py && py < y1;
        }

        // ---- manifest mirror helpers (single geometry source law) ----
        static float[] ExtractFloatsAfter(string text, int from, string key, int count)
        {
            int k = text.IndexOf(key, from);
            if (k < 0) throw new InvalidOperationException("manifest key missing: " + key);
            int open = text.IndexOf('[', k);
            int close = text.IndexOf(']', open);
            string inner = text.Substring(open + 1, close - open - 1);
            string[] parts = inner.Split(',');
            if (parts.Length < count) throw new InvalidOperationException("manifest array too short: " + key);
            float[] r = new float[count];
            for (int i = 0; i < count; i++)
                r[i] = float.Parse(parts[i].Trim(), CultureInfo.InvariantCulture);
            return r;
        }

        static string ExtractStringAfter(string text, int from, string key)
        {
            int k = text.IndexOf(key, from);
            if (k < 0) throw new InvalidOperationException("manifest key missing: " + key);
            // the value's opening quote = first quote AFTER the key's closing quote
            int open = text.IndexOf('"', k + key.Length);
            int close = text.IndexOf('"', open + 1);
            return text.Substring(open + 1, close - open - 1);
        }

        // scalar JSON value (ppu is NOT an array key - the next '[' belongs to
        // "cells", so a float[] extraction would silently read the cells array)
        static float ExtractScalarAfter(string text, int from, string key)
        {
            int k = text.IndexOf(key, from);
            if (k < 0) throw new InvalidOperationException("manifest key missing: " + key);
            int colon = text.IndexOf(':', k);
            int comma = text.IndexOf(',', colon);
            string s = text.Substring(colon + 1, comma - colon - 1).Trim();
            return float.Parse(s, CultureInfo.InvariantCulture);
        }

        static string Prove()
        {
            // ---- A0. table == manifest (the r141 sandbox is the single geometry source) ----
            string manifest = File.ReadAllText(Path.Combine(RepoRoot, "Tools", "city", "labs-manifest.json"));
            Chk(manifest.Length > 1000, "labs-manifest.json unreadable");
            int podIdx = LabsRules.PodIndex(), stubIdx = LabsRules.StubIndex();
            Chk(podIdx == 0, "pod must sit at table index 0");
            Chk(stubIdx == LabsRules.Count - 1, "stub must sit at the table tail");
            Chk(LabsRules.Count == 12, "manifest must hold 12 placements");
            Chk(LabsRules.PodCount == 1 && LabsRules.RunCount == 10 && LabsRules.StubCount == 1,
                "family arity law broken (1 pod + 10 run + 1 stub)");
            Chk(LabsRules.PodOrder == 3, "pod must ride the building layer order 3");
            Chk(LabsRules.PipeOrder == 6, "conduit must ride the structure tier order 6 (signs 6 < street 7)");
            Chk(LabsRules.PPU == 24f, "PPU24 divisor law (r140 lab-glass importer row)");
            for (int i = 0; i < LabsRules.Count; i++)
            {
                string id = LabsRules.Name(i);
                int at = manifest.IndexOf("\"name\": \"" + id + "\"");
                Chk(at >= 0, "manifest placement missing: " + id);
                float[] w = ExtractFloatsAfter(manifest, at, "\"world\"", 4);
                Chk(Mathf.Abs(w[0] - LabsRules.X0(i)) < 1e-3f && Mathf.Abs(w[1] - LabsRules.Y0(i)) < 1e-3f
                    && Mathf.Abs(w[2] - LabsRules.X1(i)) < 1e-3f && Mathf.Abs(w[3] - LabsRules.Y1(i)) < 1e-3f,
                    "manifest world rect != table at " + id);
                float[] px = ExtractFloatsAfter(manifest, at, "\"px\"", 2);
                Chk((int)px[0] == LabsRules.PxW(i) && (int)px[1] == LabsRules.PxH(i),
                    "manifest px != table at " + id);
                string asset = ExtractStringAfter(manifest, at, "\"asset\"");
                Chk(asset == LabsRules.Path(i), "manifest asset != table at " + id);
                Chk(LabsRules.Path(i).StartsWith("Assets/ArtPacks/lab-glass/"),
                    "lab path outside the lab-glass pack: " + LabsRules.Path(i));
                float ppu = ExtractScalarAfter(manifest, at, "\"ppu\"");
                Chk(Mathf.Abs(ppu - LabsRules.PPU) < 1e-4f, "manifest ppu != PPU24 at " + id);
            }

            // ---- A1. per-placement geometry laws ----
            for (int i = 0; i < LabsRules.Count; i++)
            {
                string id = LabsRules.Name(i);
                // px pins per family (pack layout drift = fail-loud)
                if (LabsRules.IsPod(i))
                    Chk(LabsRules.PxW(i) == 48 && LabsRules.PxH(i) == 72, "pod frame drift: " + id);
                else if (LabsRules.Family(i) == 1)
                    Chk(LabsRules.PxW(i) == 48 && LabsRules.PxH(i) == 16, "pipe-h frame drift: " + id);
                else
                    Chk(LabsRules.PxW(i) == 16 && LabsRules.PxH(i) == 48, "pipe-v frame drift: " + id);
                // world size == px / PPU24 (5e-4: the 16px pipe body is 2/3u)
                Chk(Mathf.Abs(LabsRules.WorldW(i) - LabsRules.PxW(i) / LabsRules.PPU) < 5e-4f
                    && Mathf.Abs(LabsRules.WorldH(i) - LabsRules.PxH(i) / LabsRules.PPU) < 5e-4f,
                    "world size != px/PPU24 at " + id);
                // frame / tint / river
                Chk(LabsRules.InFrame(i), "placement escapes the static L0 frame: " + id);
                Chk(LabsRules.InTintBand(i), "placement escapes the tint band (r22 edge-band kin): " + id);
                Chk(!Overlap(LabsRules.X0(i), LabsRules.Y0(i), LabsRules.X1(i), LabsRules.Y1(i), -50f, -3f, 50f, 3f),
                    "river rows encroached: " + id);
                if (LabsRules.IsPod(i))
                {
                    float x0 = LabsRules.X0(i), y0 = LabsRules.Y0(i), x1 = LabsRules.X1(i), y1 = LabsRules.Y1(i);
                    // integer cell boundaries (cells -> world law)
                    Chk(Mathf.Abs(x0 - Mathf.Round(x0)) < 1e-5f && Mathf.Abs(y0 - Mathf.Round(y0)) < 1e-5f
                        && Mathf.Abs(x1 - Mathf.Round(x1)) < 1e-5f && Mathf.Abs(y1 - Mathf.Round(y1)) < 1e-5f,
                        "non-integer pod cell boundary: " + id);
                    // labs low-rise law: pod top <= 12 < offices 13 < brain 19
                    Chk(y1 <= LabsRules.PodTopMax + 1e-5f, "pod breaches the labs low-rise cap 12: " + id);
                    Chk(y1 < OfficeRules.NorthCapTop, "pod towers over the office cap 13: " + id);
                    Chk(y1 < OfficeRules.BrainTop, "pod challenges the brain tower (sole commanding): " + id);
                    Chk(y0 >= 9f - 1e-5f, "pod below the north walkway floor: " + id);
                    // buildings never touch road cells (avenue cols 17/18)
                    Chk(!LabsRules.CrossesRoad(i), "pod sits on the east avenue road cells: " + id);
                }
                else if (LabsRules.Family(i) == 1)
                {
                    // run law: every conduit segment lives inside the elevated band
                    Chk(Mathf.Abs(LabsRules.Y0(i) - LabsRules.BandY0) < 1e-4f
                        && Mathf.Abs(LabsRules.Y1(i) - LabsRules.BandY1) < 1e-4f,
                        "run segment leaves the elevated conduit band y 13..13.6667: " + id);
                    Chk(LabsRules.Y1(i) < LabsRules.FarShoreStripY0,
                        "band top clips the r51 far-shore strip (14.26): " + id);
                    // zone disjointness: never the COMMIT river band, never the TRANSFER street band
                    Chk(LabsRules.BandY0 > LabsRules.CommitRiverY1,
                        "conduit dips into the COMMIT cross-river domain: " + id);
                    Chk(LabsRules.BandY0 > LabsRules.TransferStreetY,
                        "conduit dips into the TRANSFER trunk street domain: " + id);
                }
                else
                {
                    // stub law: the host-mount leg ties the band DOWN to the pod -
                    // its top ties the band top, its body descends below the band
                    // floor into the host (sink law asserted in A2); the run-only
                    // band-confinement law never applies to the stub
                    Chk(Mathf.Abs(LabsRules.Y1(i) - LabsRules.BandY1) < 1e-4f,
                        "stub top must tie the band top: " + id);
                    Chk(LabsRules.Y0(i) < LabsRules.BandY0,
                        "stub must descend below the band floor into its host: " + id);
                    Chk(LabsRules.Y1(i) < LabsRules.FarShoreStripY0,
                        "stub top clips the r51 far-shore strip (14.26): " + id);
                }
            }
            // names unique
            for (int i = 0; i < LabsRules.Count; i++)
                for (int j = i + 1; j < LabsRules.Count; j++)
                    Chk(LabsRules.Name(i) != LabsRules.Name(j), "duplicate GO name in the labs table");

            // ---- A2. chain laws (the conduit story: tower dock -> run -> pod) ----
            // west dock: P01 west face flush at the brain-tower east face (B7)
            NeonRules.Building b7 = NeonRules.BuildingAt(7);
            Chk(Mathf.Abs(LabsRules.X0(1) - b7.x1) < 1e-4f,
                "west dock must sit flush at the brain-tower east face x=" + b7.x1);
            Chk(Mathf.Abs(LabsRules.X0(1) - LabsRules.TowerDockX) < 1e-5f, "tower dock off canon");
            Chk(!Overlap(LabsRules.X0(1), LabsRules.Y0(1), LabsRules.X1(1), LabsRules.Y1(1), b7.x0, b7.y0, b7.x1, b7.y1),
                "P01 must dock at the tower face, never overlap it");
            // run contiguity: ten 2u segments, x-contiguous, uniform band
            for (int i = 2; i <= 10; i++)
                Chk(Mathf.Abs(LabsRules.X0(i) - LabsRules.X1(i - 1)) < 1e-5f,
                    "conduit chain broken at " + LabsRules.Name(i));
            for (int i = 1; i <= 10; i++)
                Chk(LabsRules.Family(i) == 1, "run index law broken at " + i);
            // east dock: P10 east face flush at the pod east face, riding the pod roofline
            Chk(Mathf.Abs(LabsRules.X1(10) - LabsRules.X1(podIdx)) < 1e-5f,
                "east dock must sit flush at the pod east face");
            Chk(Mathf.Abs(LabsRules.X0(10) - LabsRules.X0(podIdx)) < 1e-5f,
                "P10 must ride over the pod roofline (x0 == pod x0)");
            // elevated crossing: exactly one run segment crosses the east avenue
            int crossers = 0;
            for (int i = 1; i <= 10; i++) if (LabsRules.CrossesRoad(i)) crossers++;
            Chk(crossers == 1, "exactly one conduit segment may cross the avenue, got " + crossers);
            Chk(LabsRules.CrossesRoad(8), "P08 must be the avenue crossing segment");
            // stub host-mount: sinks 0.3333 into the pod top, span inside run + pod, top == band top
            float stubY0 = LabsRules.Y0(stubIdx), podTop = LabsRules.Y1(podIdx);
            Chk(Mathf.Abs((podTop - stubY0) - LabsRules.StubSink) < 1e-3f,
                "stub must sink 0.3333 into the pod top: sink=" + (podTop - stubY0).ToString("F4"));
            Chk(Mathf.Abs(LabsRules.Y1(stubIdx) - LabsRules.BandY1) < 1e-4f, "stub top must tie the band top");
            Chk(LabsRules.X0(stubIdx) >= LabsRules.X0(10) && LabsRules.X1(stubIdx) <= LabsRules.X1(10),
                "stub x span must sit inside the P10 run span");
            Chk(LabsRules.X0(stubIdx) >= LabsRules.X0(podIdx) && LabsRules.X1(stubIdx) <= LabsRules.X1(podIdx),
                "stub x span must sit inside the pod span (host mount)");
            Chk(!LabsRules.CrossesRoad(stubIdx), "stub must not touch road cells");
            // registered host-mount overlap (the ONLY legal labs-internal overlap)
            Chk(Overlap(LabsRules.X0(stubIdx), LabsRules.Y0(stubIdx), LabsRules.X1(stubIdx), LabsRules.Y1(stubIdx),
                        LabsRules.X0(podIdx), LabsRules.Y0(podIdx), LabsRules.X1(podIdx), LabsRules.Y1(podIdx)),
                "stub must overlap its host pod (host-mount law)");
            // mutual non-overlap for every other pair (66 pairs minus exactly
            // the two REGISTERED stub relations - any other overlap is a red):
            //   (a) stub <-> pod: the host-mount (sinks into the pod top, A2 law)
            //   (b) stub <-> the run segment hosting its x-span: the band
            //       tie-through ("band top flush" - the stub rises THROUGH the
            //       band layer to tie the conduit down to the pod)
            for (int i = 0; i < LabsRules.Count; i++)
                for (int j = i + 1; j < LabsRules.Count; j++)
                {
                    bool stubPair = (i == stubIdx || j == stubIdx);
                    if (stubPair)
                    {
                        int other = i == stubIdx ? j : i;
                        if (other == podIdx) continue;
                        if (other >= 1 && other <= 10
                            && LabsRules.X0(other) <= LabsRules.X0(stubIdx)
                            && LabsRules.X1(stubIdx) <= LabsRules.X1(other)) continue;
                    }
                    Chk(!Overlap(LabsRules.X0(i), LabsRules.Y0(i), LabsRules.X1(i), LabsRules.Y1(i),
                                 LabsRules.X0(j), LabsRules.Y0(j), LabsRules.X1(j), LabsRules.Y1(j)),
                        "two labs placements overlap: " + LabsRules.Name(i) + "<->" + LabsRules.Name(j));
                }

            // ---- A3. zero-encroachment census vs every live single source ----
            for (int i = 0; i < LabsRules.Count; i++)
                LabsCensusOne(LabsRules.X0(i), LabsRules.Y0(i), LabsRules.X1(i), LabsRules.Y1(i), LabsRules.Name(i));

            // detector positive controls (the r141 pinned probes - the quota
            // shortfall root cause must stay LIVE, never silently rotted)
            int resN02 = -1, eaveN01 = -1;
            for (int s = 0; s < ResidentRules.Count; s++) if (ResidentRules.Name(s) == "ResN02") resN02 = s;
            for (int e = 0; e < StreetBehaviorRules.EaveCount; e++)
                if (StreetBehaviorRules.Eave(e).id == "EAVE-N01") eaveN01 = e;
            Chk(resN02 >= 0 && eaveN01 >= 0, "detector fixtures missing from the live tables");
            Vector2 n02 = ResidentRules.Pos(resN02);
            float n02h = ResidentRules.WorldW(resN02) / 2f;
            Chk(Overlap(19f, 9f, 25f, 12f, n02.x - n02h, n02.y - n02h, n02.x + n02h, n02.y + n02h),
                "the 4u east window must be blocked by ResN02 (detector positive)");
            Vector2 ev = StreetBehaviorRules.EavePos(eaveN01);
            float evh = ResidentRules.WorldW(0) / 2f;   // seat-class body 1.333u (r123 law)
            Chk(Overlap(19f, 9f, 25f, 12f, ev.x - evh, ev.y - evh, ev.x + evh, ev.y + evh),
                "the 4u east window must be blocked by EAVE-N01 (detector positive)");
            Chk(Vector2.Distance(new Vector2(22f, 11f), n02) < 2.2f,
                "the halo vise detector must fire at (22,11) - ResN02 2.2 halo");
            Chk(Mathf.Abs(22.3f - ev.x) < 2.75f,
                "the plate-plate detector must fire at x=22.3 - EAVE-N01 tag-tag 2.75 law");
            // A7: far-shore strip re-derivation (r51 disease site)
            int farHits = 0;
            for (int i = 0; i < LabsRules.Count; i++)
                if (Overlap(LabsRules.X0(i), LabsRules.Y0(i), LabsRules.X1(i), LabsRules.Y1(i),
                            -24.44f, 14.26f, 23.70f, 14.74f)) farHits++;
            Chk(farHits == 0, "far-shore strip window touched by a labs placement (A7)");
            // asset pins on disk
            Chk(File.Exists(Path.Combine(ProjectRoot, LabsRules.PodPath)), "pod sprite missing on disk");
            Chk(File.Exists(Path.Combine(ProjectRoot, LabsRules.PipeHPath)), "pipe-h sprite missing on disk");
            Chk(File.Exists(Path.Combine(ProjectRoot, LabsRules.PipeVPath)), "pipe-v sprite missing on disk");

            // ---- B. asset gate: importer laws on all 3 lab files (idempotent) ----
            string[] labFiles = { LabsRules.PodPath, LabsRules.PipeHPath, LabsRules.PipeVPath };
            int[] pinW = { 48, 48, 16 }, pinH = { 72, 16, 48 };
            for (int f = 0; f < labFiles.Length; f++)
            {
                Sprite sp = ForceSprite(labFiles[f]);
                Chk(sp != null, "sprite failed to load: " + labFiles[f]);
                Chk(Mathf.Abs(sp.rect.width - pinW[f]) < 0.5f && Mathf.Abs(sp.rect.height - pinH[f]) < 0.5f,
                    "rect != " + pinW[f] + "x" + pinH[f] + " at " + labFiles[f]);
                Chk(Mathf.Abs(sp.bounds.size.x - pinW[f] / LabsRules.PPU) < 0.01f
                    && Mathf.Abs(sp.bounds.size.y - pinH[f] / LabsRules.PPU) < 0.01f,
                    "natural bounds != world size at " + labFiles[f]);
                Chk(File.Exists(Path.Combine(ProjectRoot, labFiles[f] + ".meta")),
                    ".meta not generated by the first editor import (r140 note 3): " + labFiles[f]);
            }

            // ---- C. CityScene wiring: live census -> sweep -> build -> idempotent -> save ----
            Scene scene = EditorSceneManager.OpenScene(ScenePath, OpenSceneMode.Single);
            Chk(scene.isLoaded, "CityScene failed to open");
            Tilemap props = TilemapByName("Props");
            Chk(props != null, "Props tilemap missing");
            int propCells = 0;
            List<Vector3Int> cells = new List<Vector3Int>();
            foreach (Vector3Int p in props.cellBounds.allPositionsWithin)
                if (props.GetTile(p) != null) { propCells++; cells.Add(p); }
            Chk(propCells == 44, "props cell census != 44 (labs must never paint Props): " + propCells);
            for (int i = 0; i < LabsRules.Count; i++)
                for (int c = 0; c < cells.Count; c++)
                    Chk(!Overlap(LabsRules.X0(i), LabsRules.Y0(i), LabsRules.X1(i), LabsRules.Y1(i),
                                 cells[c].x, cells[c].y, cells[c].x + 1, cells[c].y + 1),
                        "labs " + LabsRules.Name(i) + " clips props cell (" + cells[c].x + "," + cells[c].y + ")");
            // live anchor GOs == canon
            for (int a = 1; a <= 3; a++)
            {
                string nm = a == 1 ? "Zone_GAME" : a == 2 ? "Zone_QUANT" : "Zone_MEDIA";
                GameObject go = GameObject.Find(nm);
                Chk(go != null, "anchor GO missing: " + nm);
                if (go != null)
                    Chk(Mathf.Abs(go.transform.position.x - AnchorCanon[a].x) < 1e-4f
                        && Mathf.Abs(go.transform.position.y - AnchorCanon[a].y) < 1e-4f,
                        "anchor GO off canon: " + nm + " " + go.transform.position.ToString("F2"));
            }
            GameObject brainAnchor = null;
            foreach (GameObject root in scene.GetRootGameObjects())
                if (root.name == "BrainTower" && root.GetComponent<Tilemap>() == null) brainAnchor = root;
            Chk(brainAnchor != null, "BrainTower anchor GO missing (the non-tilemap one)");
            if (brainAnchor != null)
                Chk(Mathf.Abs(brainAnchor.transform.position.x - AnchorCanon[0].x) < 1e-4f
                    && Mathf.Abs(brainAnchor.transform.position.y - AnchorCanon[0].y) < 1e-4f,
                    "BrainTower anchor off canon: " + brainAnchor.transform.position.ToString("F2"));
            // south city tile counts = the no-tilemap-delta law (sprite family)
            int q0 = TileCount("CityQUANT"), g0 = TileCount("CityGAME"), m0 = TileCount("CityMEDIA");
            Chk(q0 == 40 && g0 == 49 && m0 == 54, "south city tile counts off canon pre-build: "
                + q0 + "/" + g0 + "/" + m0);
            // feet-cell pavement re-derivation from the live tilemaps (sec8 kin):
            // every pod cell sits on pavement, never road, never water
            Tilemap ground = TilemapByName("Ground");
            Tilemap roads = TilemapByName("Roads");
            Tilemap water = TilemapByName("Water");
            Chk(ground != null && roads != null && water != null, "base tilemaps missing");
            for (int cx = 21; cx <= 22; cx++)
                for (int cy = 9; cy <= 11; cy++)
                {
                    Vector3Int uc = new Vector3Int(cx, cy, 0);
                    Chk(ground.GetTile(uc) != null, "pod cell off the pavement at " + uc);
                    Chk(roads.GetTile(uc) == null, "pod sits on a road cell at " + uc);
                    Chk(water.GetTile(uc) == null, "pod sits on a water cell at " + uc);
                }
            // the elevated crossing rides above REAL avenue road cells; the
            // y=10 stand family's underfoot row 8 is the north street road
            Chk(roads.GetTile(new Vector3Int(17, 13, 0)) != null && roads.GetTile(new Vector3Int(18, 13, 0)) != null,
                "east avenue road cells missing under the elevated crossing");
            Chk(roads.GetTile(new Vector3Int(17, 8, 0)) != null && roads.GetTile(new Vector3Int(18, 8, 0)) != null,
                "north street road row 8 missing (y=10 underfoot detector)");
            // build (fresh LoadAssetAtPath at every use = r10 fake-null law)
            BuildLabs();
            BuildLabs();   // idempotency: the second sweep+build must land on exactly Count
            Chk(CountLabs() == LabsRules.Count, "idempotent labs rebuild count != table: " + CountLabs());
            for (int i = 0; i < LabsRules.Count; i++)
            {
                GameObject go = GameObject.Find(LabsRules.Name(i));
                Chk(go != null, "labs GO missing pre-save: " + LabsRules.Name(i));
                SpriteRenderer sr = go != null ? go.GetComponent<SpriteRenderer>() : null;
                Chk(sr != null && sr.sprite != null, "labs sprite unresolved pre-save: " + LabsRules.Name(i));
                Chk(sr.sortingOrder == LabsRules.OrderOf(i), "labs order lost: " + LabsRules.Name(i));
                Vector2 p = LabsRules.Pos(i);
                Chk(Mathf.Abs(go.transform.position.x - p.x) < 1e-4f
                    && Mathf.Abs(go.transform.position.y - p.y) < 1e-4f,
                    "labs GO pos != rect center: " + LabsRules.Name(i));
                Chk(Mathf.Abs(go.transform.localScale.x - 1f) < 1e-5f
                    && Mathf.Abs(go.transform.localScale.y - 1f) < 1e-5f,
                    "labs scale != 1 (sprite-family law): " + LabsRules.Name(i));
            }
            bool saved = EditorSceneManager.SaveScene(scene);
            Chk(saved, "scene save failed");

            Scene reopened = EditorSceneManager.OpenScene(ScenePath, OpenSceneMode.Single);
            Chk(CountLabs() == LabsRules.Count, "persisted labs count != table: " + CountLabs());
            int q1 = TileCount("CityQUANT"), g1 = TileCount("CityGAME"), m1 = TileCount("CityMEDIA");
            Chk(q1 == q0 && g1 == g0 && m1 == m0, "no-tilemap-delta law breached by our save: "
                + q1 + "/" + g1 + "/" + m1);
            for (int i = 0; i < LabsRules.Count; i++)
            {
                GameObject go = GameObject.Find(LabsRules.Name(i));
                Chk(go != null, "labs missing on disk: " + LabsRules.Name(i));
                SpriteRenderer sr = go != null ? go.GetComponent<SpriteRenderer>() : null;
                Chk(sr != null && sr.sprite != null, "labs sprite lost on disk: " + LabsRules.Name(i));
                Chk(sr.sortingOrder == LabsRules.OrderOf(i), "labs order lost on disk: " + LabsRules.Name(i));
                Vector2 p = LabsRules.Pos(i);
                Chk(Mathf.Abs(go.transform.position.x - p.x) < 1e-4f
                    && Mathf.Abs(go.transform.position.y - p.y) < 1e-4f,
                    "labs position lost on disk: " + LabsRules.Name(i));
            }
            // neighbor regressions (our save must not drop earlier serialized wiring)
            int neonKept = 0, robotKept = 0, resKept = 0, tagKept = 0, vehKept = 0, offKept = 0, terKept = 0;
            foreach (SpriteRenderer sr in UnityEngine.Object.FindObjectsOfType<SpriteRenderer>())
            {
                if (sr.name.StartsWith(NeonRules.NamePrefix)) neonKept++;
                if (sr.name.StartsWith(RobotRules.NamePrefix)) robotKept++;
                if (sr.name.StartsWith(VehicleRules.NamePrefix)) vehKept++;
                if (sr.name.StartsWith(OfficeRules.NamePrefix)) offKept++;
                if (sr.name.StartsWith(OfficeRules.GroundPrefix)) terKept++;
                if (sr.name.StartsWith("NameTag")) tagKept++;
            }
            foreach (Transform t in UnityEngine.Object.FindObjectsOfType<Transform>())
                if (t.parent == null && t.name.StartsWith(ResidentRules.NamePrefix)
                    && t.name.Length == 6) resKept++;
            Chk(neonKept == NeonRules.Count, "neon signs lost after our save: " + neonKept);
            Chk(robotKept == RobotRules.Count, "robots lost after our save: " + robotKept);
            Chk(resKept == ResidentRules.Count, "residents lost after our save: " + resKept);
            Chk(tagKept == 0, "world nameplates must stay retired after our save (r179 S5b): " + tagKept);
            Chk(vehKept == VehicleRules.Count, "vehicles lost after our save: " + vehKept);
            Chk(offKept == OfficeRules.Count, "offices lost after our save: " + offKept);
            Chk(terKept == OfficeRules.GroundCount, "terraces lost after our save: " + terKept);
            GameObject ambGo = GameObject.Find("CityAmbient");
            CityAmbient amb = ambGo != null ? ambGo.GetComponent<CityAmbient>() : null;
            Chk(amb != null, "CityAmbient lost after save");
            Chk(amb.skylineFar != null && amb.skylineNear != null, "r34 skyline sprites lost after save");
            CityAmbientAudio bed = amb.GetComponent<CityAmbientAudio>();
            Chk(bed != null && bed.noiseBed != null && bed.noiseBed.length > 0f, "r31 bed clip lost after save");
            Chk(UnityEngine.Object.FindObjectsOfType<CityInterior>().Length >= 1, "CityInterior lost after save");
            Chk(UnityEngine.Object.FindObjectsOfType<CityCameraRig>().Length >= 1, "CityCameraRig lost after save");
            Chk(UnityEngine.Object.FindObjectsOfType<CityEventRouter>().Length >= 1, "CityEventRouter lost after save");
            Chk(UnityEngine.Object.FindObjectsOfType<CityBubbles>().Length == 1, "r42 bubbles adapter lost after save");
            Chk(UnityEngine.Object.FindObjectsOfType<CityResidentCard>().Length == 1, "r43 card adapter lost after save");
            GameObject camGo = GameObject.Find("CityCamera");
            Camera cam = camGo != null ? camGo.GetComponent<Camera>() : null;
            Chk(cam != null && cam.orthographic && Mathf.Abs(cam.orthographicSize - RigMath.L0Size) < 0.01f,
                "L0 camera broken after save");
            Chk(TileCount("Ground") > 0 && TileCount("Water") > 0 && TileCount("Roads") > 0,
                "base tilemaps emptied by our save");
            Chk(CountPrefix("BarkBubble") == 0, "BarkBubble persisted (runtime-only law)");
            Chk(CountPrefix("IdentCard") == 0, "IdentCard persisted (runtime-only law)");
            Chk(GameObject.Find("SkylineFar") == null && GameObject.Find("AmbientTint") == null,
                "runtime-only visuals persisted into the scene");

            // ---- D. render gates: day/dusk/night L0 + the L1 labs street view ----
            amb.EnsureVisuals();
            amb.ApplyWeather("clear", 0f, 0);
            amb.StepWeather(0.1f);
            GameObject[] labGos = new GameObject[LabsRules.Count];
            for (int i = 0; i < LabsRules.Count; i++)
            {
                labGos[i] = GameObject.Find(LabsRules.Name(i));
                Chk(labGos[i] != null, "labs GO missing for render gate: " + LabsRules.Name(i));
            }
            int podD = 0, podK = 0, podN = 0, runD = 0, runK = 0, runN = 0, stubD = 0, stubK = 0, stubN = 0;
            float podDuskLum = 0f, podNightLum = 0f, podDayLum = 0f;
            float podDayWarm = 0f, podDuskWarm = 0f;
            // pod window = pod rect; run window = whole conduit x 3..23; stub window = the pod leg
            float runCx = 13f, runCy = (LabsRules.BandY0 + LabsRules.BandY1) / 2f;
            float runHw = 10f + 0.4f, runHh = (LabsRules.BandY1 - LabsRules.BandY0) / 2f + 0.4f;
            float stubCx = 22.5f, stubCy = 12.6667f;
            float stubHw = 0.3333f + 0.4f, stubHh = 1f + 0.4f;
            amb.ApplyAmbient(AmbientTier.Day);
            SetLabs(labGos, false);
            Texture2D dayBase = Shot(cam, null);
            SetLabs(labGos, true);
            Texture2D dayOn = Shot(cam, "m1-r142-labs-day.png");
            RectWinDelta(dayOn, dayBase, cam, out podD, out podDayLum, out podDayWarm,
                LabsRules.Pos(podIdx).x, LabsRules.Pos(podIdx).y,
                LabsRules.WorldW(podIdx) / 2f + 0.4f, LabsRules.WorldH(podIdx) / 2f + 0.4f);
            float lum; float warm;
            RectWinDelta(dayOn, dayBase, cam, out runD, out lum, out warm, runCx, runCy, runHw, runHh);
            RectWinDelta(dayOn, dayBase, cam, out stubD, out lum, out warm, stubCx, stubCy, stubHw, stubHh);
            amb.ApplyAmbient(AmbientTier.Dusk);
            SetLabs(labGos, false);
            Texture2D duskBase = Shot(cam, null);
            SetLabs(labGos, true);
            Texture2D duskOn = Shot(cam, "m1-r142-labs-dusk.png");
            RectWinDelta(duskOn, duskBase, cam, out podK, out podDuskLum, out podDuskWarm,
                LabsRules.Pos(podIdx).x, LabsRules.Pos(podIdx).y,
                LabsRules.WorldW(podIdx) / 2f + 0.4f, LabsRules.WorldH(podIdx) / 2f + 0.4f);
            RectWinDelta(duskOn, duskBase, cam, out runK, out lum, out warm, runCx, runCy, runHw, runHh);
            RectWinDelta(duskOn, duskBase, cam, out stubK, out lum, out warm, stubCx, stubCy, stubHw, stubHh);
            amb.ApplyAmbient(AmbientTier.Night);
            SetLabs(labGos, false);
            Texture2D nightBase = Shot(cam, null);
            SetLabs(labGos, true);
            Texture2D nightOn = Shot(cam, "m1-r142-labs-night.png");
            RectWinDelta(nightOn, nightBase, cam, out podN, out podNightLum, out lum,
                LabsRules.Pos(podIdx).x, LabsRules.Pos(podIdx).y,
                LabsRules.WorldW(podIdx) / 2f + 0.4f, LabsRules.WorldH(podIdx) / 2f + 0.4f);
            RectWinDelta(nightOn, nightBase, cam, out runN, out lum, out warm, runCx, runCy, runHw, runHh);
            RectWinDelta(nightOn, nightBase, cam, out stubN, out lum, out warm, stubCx, stubCy, stubHw, stubHh);
            // visibility gates (provisional thresholds; actuals reported for calibration)
            Chk(podD >= 200, "pod invisible in the day L0 frame: " + podD + "px");
            Chk(runD >= 400, "conduit invisible in the day L0 frame: " + runD + "px");
            Chk(stubD >= 30, "stub invisible in the day L0 frame: " + stubD + "px");
            Chk(podK >= 150, "pod invisible at dusk: " + podK + "px");
            Chk(runK >= 300, "conduit invisible at dusk: " + runK + "px");
            Chk(stubK >= 20, "stub invisible at dusk: " + stubK + "px");
            Chk(podN >= 40, "pod invisible at night: " + podN + "px");
            Chk(runN >= 60, "conduit invisible at night: " + runN + "px");
            Chk(stubN >= 6, "stub invisible at night: " + stubN + "px");
            // atmosphere law: the night tier must sit the glass family under dusk
            Chk(podNightLum < podDuskLum, "pod night must sit under dusk (atmosphere law): "
                + podNightLum.ToString("F3") + " vs " + podDuskLum.ToString("F3"));
            // L1 labs street view (dusk tier = the r44 harmony evidence frame;
            // cam 19,5 - the street family rides |camX| <= 30, r138 law)
            amb.ApplyAmbient(AmbientTier.Dusk);
            Vector3 origPos = cam.transform.position;
            float origSize = cam.orthographicSize;
            cam.orthographicSize = RigMath.L1Size;
            cam.transform.position = new Vector3(19f, 5f, origPos.z);
            SetLabs(labGos, false);
            Texture2D l1Base = Shot(cam, null);
            SetLabs(labGos, true);
            Texture2D l1On = Shot(cam, "m1-r142-labs-l1-north.png");
            int l1Pod, l1Run, l1Stub;
            RectWinDelta(l1On, l1Base, cam, out l1Pod, out lum, out warm,
                LabsRules.Pos(podIdx).x, LabsRules.Pos(podIdx).y,
                LabsRules.WorldW(podIdx) / 2f + 0.4f, LabsRules.WorldH(podIdx) / 2f + 0.4f);
            RectWinDelta(l1On, l1Base, cam, out l1Run, out lum, out warm, runCx, runCy, runHw, runHh);
            RectWinDelta(l1On, l1Base, cam, out l1Stub, out lum, out warm, stubCx, stubCy, stubHw, stubHh);
            Chk(l1Pod >= 400, "pod invisible in the L1 labs street view: " + l1Pod + "px");
            Chk(l1Run >= 400, "conduit invisible in the L1 labs street view: " + l1Run + "px");
            Chk(l1Stub >= 60, "stub invisible in the L1 labs street view: " + l1Stub + "px");
            // restore the camera (scene was saved in section C; no save after renders)
            cam.orthographicSize = origSize;
            cam.transform.position = origPos;

            UnityEngine.Object.DestroyImmediate(dayBase); UnityEngine.Object.DestroyImmediate(dayOn);
            UnityEngine.Object.DestroyImmediate(duskBase); UnityEngine.Object.DestroyImmediate(duskOn);
            UnityEngine.Object.DestroyImmediate(nightBase); UnityEngine.Object.DestroyImmediate(nightOn);
            UnityEngine.Object.DestroyImmediate(l1Base); UnityEngine.Object.DestroyImmediate(l1On);

            return "asserts=" + asserts
                + " table=" + LabsRules.Count + "(pod" + LabsRules.PodCount + "+run" + LabsRules.RunCount
                + "+stub" + LabsRules.StubCount + ")"
                + " census(props=" + propCells + ",south_tiles=" + q0 + "/" + g0 + "/" + m0 + ",anchors=4/4)"
                + " scene(saved=" + saved + "," + LabsRules.Count + " persisted,neon" + neonKept
                + "_robot" + robotKept + "_res" + resKept + "_tag" + tagKept + "_veh" + vehKept
                + "_off" + offKept + "_ter" + terKept + ")"
                + " render(day=" + podD + "/" + runD + "/" + stubD
                + " dusk=" + podK + "/" + runK + "/" + stubK
                + " night=" + podN + "/" + runN + "/" + stubN
                + " lum day=" + podDayLum.ToString("F3") + " dusk=" + podDuskLum.ToString("F3")
                + " night=" + podNightLum.ToString("F3")
                + " warm day=" + podDayWarm.ToString("F3") + " dusk=" + podDuskWarm.ToString("F3")
                + " l1=" + l1Pod + "/" + l1Run + "/" + l1Stub + ")"
                + " shots=4";
        }

        static string ReloadProve()
        {
            Scene scene = EditorSceneManager.OpenScene(ScenePath, OpenSceneMode.Single);
            if (!scene.isLoaded) throw new InvalidOperationException("CityScene failed to load");
            Chk(CountLabs() == LabsRules.Count, "labs count after editor restart != table: " + CountLabs());
            for (int i = 0; i < LabsRules.Count; i++)
            {
                GameObject go = GameObject.Find(LabsRules.Name(i));
                Chk(go != null, "labs lost across sessions: " + LabsRules.Name(i));
                SpriteRenderer sr = go != null ? go.GetComponent<SpriteRenderer>() : null;
                Chk(sr != null && sr.sprite != null, "labs sprite unresolved after restart: " + LabsRules.Name(i));
                Chk(sr.sortingOrder == LabsRules.OrderOf(i), "labs order lost after restart: " + LabsRules.Name(i));
                Vector2 p = LabsRules.Pos(i);
                Chk(Mathf.Abs(go.transform.position.x - p.x) < 1e-4f
                    && Mathf.Abs(go.transform.position.y - p.y) < 1e-4f,
                    "labs position lost across restart: " + LabsRules.Name(i));
            }
            int q = TileCount("CityQUANT"), g = TileCount("CityGAME"), m = TileCount("CityMEDIA");
            Chk(q == 40 && g == 49 && m == 54, "south city tile counts off canon after restart: " + q + "/" + g + "/" + m);
            string[] spot = { LabsRules.PodPath, LabsRules.PipeHPath, LabsRules.PipeVPath };
            foreach (string p in spot)
            {
                TextureImporter imp = (TextureImporter)TextureImporter.GetAtPath(p);
                Chk(imp != null && imp.textureType == TextureImporterType.Sprite, "importer type lost: " + p);
                Chk(imp.filterMode == FilterMode.Point, "point filter lost: " + p);
                Chk(Mathf.Abs(imp.spritePixelsPerUnit - 24f) < 0.01f, "PPU24 lost: " + p);
                Chk(!imp.mipmapEnabled, "mips re-enabled: " + p);
            }
            int neonKept = 0, offKept = 0, terKept = 0, resKept = 0;
            foreach (SpriteRenderer sr in UnityEngine.Object.FindObjectsOfType<SpriteRenderer>())
            {
                if (sr.name.StartsWith(NeonRules.NamePrefix)) neonKept++;
                if (sr.name.StartsWith(OfficeRules.NamePrefix)) offKept++;
                if (sr.name.StartsWith(OfficeRules.GroundPrefix)) terKept++;
            }
            foreach (Transform t in UnityEngine.Object.FindObjectsOfType<Transform>())
                if (t.parent == null && t.name.StartsWith(ResidentRules.NamePrefix)
                    && t.name.Length == 6) resKept++;
            Chk(neonKept == NeonRules.Count, "neon signs lost across restart: " + neonKept);
            Chk(offKept == OfficeRules.Count, "offices lost across restart: " + offKept);
            Chk(terKept == OfficeRules.GroundCount, "terraces lost across restart: " + terKept);
            Chk(resKept == ResidentRules.Count, "residents lost across restart: " + resKept);
            GameObject ambGo = GameObject.Find("CityAmbient");
            CityAmbient amb = ambGo != null ? ambGo.GetComponent<CityAmbient>() : null;
            Chk(amb != null && amb.skylineFar != null && amb.skylineNear != null, "r34 skyline lost after restart");
            Chk(UnityEngine.Object.FindObjectsOfType<CityInterior>().Length >= 1, "CityInterior unresolved after restart");
            Chk(UnityEngine.Object.FindObjectsOfType<CityCameraRig>().Length >= 1, "CityCameraRig unresolved after restart");
            Chk(UnityEngine.Object.FindObjectsOfType<CityBubbles>().Length == 1, "r42 bubbles adapter unresolved after restart");
            Chk(UnityEngine.Object.FindObjectsOfType<CityResidentCard>().Length == 1, "r43 card adapter unresolved after restart");
            GameObject camGo = GameObject.Find("CityCamera");
            Camera cam = camGo != null ? camGo.GetComponent<Camera>() : null;
            Chk(cam != null && Mathf.Abs(cam.orthographicSize - RigMath.L0Size) < 0.01f, "L0 camera broken after restart");
            return "reload_gate=OK labs=" + CountLabs() + "/" + LabsRules.Count
                + " persisted south_tiles=" + q + "/" + g + "/" + m
                + " importers=sprite+point+ppu24+nemip neon=" + neonKept + "/" + NeonRules.Count
                + " offices=" + offKept + "/" + OfficeRules.Count
                + " terraces=" + terKept + "/" + OfficeRules.GroundCount
                + " residents=" + resKept + "/" + ResidentRules.Count
                + " cam_L0=" + (cam != null ? cam.orthographicSize.ToString("F1") : "?");
        }

        // sweep every root-level Lab* GO (pod + pipe families), then build the
        // 12 from the table (fresh LoadAssetAtPath at every use = r10 law)
        static void BuildLabs()
        {
            foreach (Transform t in UnityEngine.Object.FindObjectsOfType<Transform>())
                if (t.parent == null && (t.name.StartsWith(LabsRules.PipeNamePrefix)
                    || t.name.StartsWith(LabsRules.PodNamePrefix)))
                    UnityEngine.Object.DestroyImmediate(t.gameObject);
            for (int i = 0; i < LabsRules.Count; i++)
            {
                GameObject go = new GameObject(LabsRules.Name(i));
                Vector2 p = LabsRules.Pos(i);
                go.transform.position = new Vector3(p.x, p.y, 0f);
                SpriteRenderer sr = go.AddComponent<SpriteRenderer>();
                sr.sprite = AssetDatabase.LoadAssetAtPath<Sprite>(LabsRules.Path(i));
                if (sr.sprite == null)
                    throw new InvalidOperationException("labs sprite resolve failed: " + LabsRules.Path(i));
                sr.sortingOrder = LabsRules.OrderOf(i);
            }
        }

        static int CountLabs()
        {
            int c = 0;
            foreach (SpriteRenderer sr in UnityEngine.Object.FindObjectsOfType<SpriteRenderer>())
                if (sr.name.StartsWith(LabsRules.PodNamePrefix) || sr.name.StartsWith(LabsRules.PipeNamePrefix)) c++;
            return c;
        }

        static void SetLabs(GameObject[] gos, bool on)
        {
            foreach (GameObject go in gos) if (go != null) go.SetActive(on);
        }

        // one labs rect vs every live single source (the r141 census mirror;
        // the pod keeps ResN02 0.333u west and EAVE-N01 1.0u east - zero-move)
        static void LabsCensusOne(float x0, float y0, float x1, float y1, string id)
        {
            for (int b = 0; b < 8; b++)
            {
                NeonRules.Building bb = NeonRules.BuildingAt(b);
                // b==7 tower: the LabPipeH01 dock TOUCHES x=3 exactly - strict
                // overlap is false at a zero-gap touch, so the dock needs no
                // exemption; the exact flush equality is separately asserted in A2
                Chk(!Overlap(x0, y0, x1, y1, bb.x0, bb.y0, bb.x1, bb.y1),
                    "labs " + id + " clips mounting building " + b);
            }
            for (int s = 0; s < ResidentRules.Count; s++)
            {
                Vector2 c = ResidentRules.Pos(s);
                float half = ResidentRules.WorldW(s) / 2f;
                Chk(!Overlap(x0, y0, x1, y1, c.x - half, c.y - half, c.x + half, c.y + half),
                    "labs " + id + " clips resident " + ResidentRules.Name(s));
                Vector2 sc = ResidentRules.ShadowPos(s);
                float shw = ResidentRules.ShadowWorldW / 2f, shh = ResidentRules.ShadowWorldH / 2f;
                Chk(!Overlap(x0, y0, x1, y1, sc.x - shw, sc.y - shh, sc.x + shw, sc.y + shh),
                    "labs " + id + " clips resident shadow " + ResidentRules.Name(s));
                Chk(!Overlap(x0, y0, x1, y1, c.x - PlateHalfW, c.y + PlateOffsetY - PlateHalfH,
                             c.x + PlateHalfW, c.y + PlateOffsetY + PlateHalfH),
                    "labs " + id + " clips nameplate " + ResidentRules.Name(s));
            }
            for (int r = 0; r < RobotRules.Count; r++)
            {
                Vector2 c = RobotRules.Pos(r);
                float half = RobotRules.WorldW(r) / 2f;
                Chk(!Overlap(x0, y0, x1, y1, c.x - half, c.y - half, c.x + half, c.y + half),
                    "labs " + id + " clips robot " + RobotRules.Name(r));
                Vector2 sc = RobotRules.ShadowPos(r);
                float shw = RobotRules.ShadowWorldW / 2f, shh = RobotRules.ShadowWorldH / 2f;
                Chk(!Overlap(x0, y0, x1, y1, sc.x - shw, sc.y - shh, sc.x + shw, sc.y + shh),
                    "labs " + id + " clips robot shadow " + RobotRules.Name(r));
            }
            for (int v = 0; v < VehicleRules.Count; v++)
            {
                float vw = VehicleRules.WorldW(v) / 2f, vh = VehicleRules.WorldH(v);
                float vx = VehicleRules.Pos(v).x, gy = VehicleRules.FeetY(v);
                Chk(!Overlap(x0, y0, x1, y1, vx - vw, gy, vx + vw, gy + vh),
                    "labs " + id + " clips vehicle " + VehicleRules.Name(v));
            }
            for (int g = 0; g < NeonRules.Count; g++)
            {
                Vector2 c = NeonRules.Pos(g);
                float gw = NeonRules.WorldW(g) / 2f, gh = NeonRules.WorldH(g) / 2f;
                Chk(!Overlap(x0, y0, x1, y1, c.x - gw, c.y - gh, c.x + gw, c.y + gh),
                    "labs " + id + " clips neon sign " + NeonRules.Name(g));
            }
            List<InteriorTarget> reg = InteriorRouter.DefaultRegistry();
            for (int w = 0; w < reg.Count; w++)
            {
                Rect rr = reg[w].bounds;
                Chk(!Overlap(x0, y0, x1, y1, rr.xMin, rr.yMin, rr.xMax, rr.yMax),
                    "labs " + id + " clips interior hit rect " + reg[w].zone);
            }
            for (int a = 0; a < AnchorCanon.Length; a++)
                Chk(!ContainsPoint(x0, y0, x1, y1, AnchorCanon[a].x, AnchorCanon[a].y),
                    "labs " + id + " swallows anchor " + a);
            for (int e = 0; e < StreetBehaviorRules.EaveCount; e++)
            {
                Vector2 ep = StreetBehaviorRules.EavePos(e);
                float eh = ResidentRules.WorldW(0) / 2f;   // seat-class body 1.333u (r123 law)
                Chk(!Overlap(x0, y0, x1, y1, ep.x - eh, ep.y - eh, ep.x + eh, ep.y + eh),
                    "labs " + id + " clips eave slot " + StreetBehaviorRules.Eave(e).id);
                Chk(!Overlap(x0, y0, x1, y1, ep.x - PlateHalfW, ep.y + PlateOffsetY - PlateHalfH,
                             ep.x + PlateHalfW, ep.y + PlateOffsetY + PlateHalfH),
                    "labs " + id + " clips eave nameplate " + StreetBehaviorRules.Eave(e).id);
            }
            // the r112 office band + the r138 terrace join the protected set
            for (int o = 0; o < OfficeRules.Count; o++)
                Chk(!Overlap(x0, y0, x1, y1, OfficeRules.X0(o), OfficeRules.Y0(o), OfficeRules.X1(o), OfficeRules.Y1(o)),
                    "labs " + id + " clips office " + OfficeRules.Name(o));
            for (int t = 0; t < OfficeRules.GroundCount; t++)
                Chk(!Overlap(x0, y0, x1, y1, OfficeRules.GroundX0(t), OfficeRules.GroundY0(t),
                             OfficeRules.GroundX1(t), OfficeRules.GroundY1(t)),
                    "labs " + id + " clips terrace " + OfficeRules.GroundName(t));
        }

        static int CountPrefix(string prefix)
        {
            int c = 0;
            foreach (Transform t in UnityEngine.Object.FindObjectsOfType<Transform>())
                if (t.name.StartsWith(prefix)) c++;
            return c;
        }

        static Tilemap TilemapByName(string layerName)
        {
            GameObject go = GameObject.Find(layerName);
            return go != null ? go.GetComponent<Tilemap>() : null;
        }

        static int TileCount(string layerName)
        {
            Tilemap tm = TilemapByName(layerName);
            if (tm == null) return 0;
            int c = 0;
            foreach (Vector3Int p in tm.cellBounds.allPositionsWithin)
                if (tm.GetTile(p) != null) c++;
            return c;
        }

        // forces Sprite + Single + Point + PPU24 + no mips (idempotent, r34 law)
        static Sprite ForceSprite(string path)
        {
            TextureImporter imp = (TextureImporter)TextureImporter.GetAtPath(path);
            if (imp == null) throw new InvalidOperationException("importer missing: " + path);
            if (imp.textureType != TextureImporterType.Sprite || imp.spriteImportMode != SpriteImportMode.Single
                || imp.filterMode != FilterMode.Point || imp.mipmapEnabled
                || Mathf.Abs(imp.spritePixelsPerUnit - 24f) > 0.01f)
            {
                imp.textureType = TextureImporterType.Sprite;
                imp.spriteImportMode = SpriteImportMode.Single;
                imp.filterMode = FilterMode.Point;
                imp.mipmapEnabled = false;
                imp.spritePixelsPerUnit = 24f;
                imp.SaveAndReimport();
            }
            if (imp.textureType != TextureImporterType.Sprite || imp.filterMode != FilterMode.Point
                || Mathf.Abs(imp.spritePixelsPerUnit - 24f) > 0.01f)
                throw new InvalidOperationException("importer fix did not stick: " + path);
            return AssetDatabase.LoadAssetAtPath<Sprite>(path);
        }

        static Texture2D Shot(Camera cam, string name)
        {
            RenderTexture rt = new RenderTexture(1920, 1080, 24, RenderTextureFormat.ARGB32);
            cam.targetTexture = rt;
            cam.Render();
            RenderTexture.active = rt;
            Texture2D tex = new Texture2D(1920, 1080, TextureFormat.RGBA32, false);
            tex.ReadPixels(new Rect(0, 0, 1920, 1080), 0, 0);
            tex.Apply();
            cam.targetTexture = null;
            RenderTexture.active = null;
            rt.Release();
            UnityEngine.Object.DestroyImmediate(rt);
            if (name != null) File.WriteAllBytes(Path.Combine(RepoRoot, "docs", "design", name), tex.EncodeToPNG());
            return tex;
        }

        // rect window metric: pixels in the rect (+0.4u margin) that differ
        // from the labs-hidden baseline. y=0 is the image BOTTOM row (r13 law);
        // windows are clipped to the frame. avgWarm = average (r-b) over the
        // delta pixels (tier-shift evidence, reported for the glass family).
        static void RectWinDelta(Texture2D on, Texture2D off, Camera cam,
            out int deltaCount, out float avgLum, out float avgWarm,
            float cx, float cy, float hw, float hh)
        {
            float halfH = cam.orthographicSize;
            float halfW = halfH * (1920f / 1080f);
            float camX = cam.transform.position.x, camY = cam.transform.position.y;
            int px0 = (int)(((cx - hw - camX) / (2f * halfW) + 0.5f) * 1920f);
            int px1 = (int)(((cx + hw - camX) / (2f * halfW) + 0.5f) * 1920f);
            int py0 = (int)(((cy - hh - camY) / (2f * halfH) + 0.5f) * 1080f);
            int py1 = (int)(((cy + hh - camY) / (2f * halfH) + 0.5f) * 1080f);
            px0 = Math.Max(0, px0); px1 = Math.Min(1919, px1);
            py0 = Math.Max(0, py0); py1 = Math.Min(1079, py1);
            double lum = 0, warm = 0; int n = 0;
            for (int y = py0; y <= py1; y += 3)
                for (int x = px0; x <= px1; x += 3)
                {
                    Color ca = on.GetPixel(x, y);
                    Color cb = off.GetPixel(x, y);
                    float d = Math.Abs(ca.r - cb.r) + Math.Abs(ca.g - cb.g) + Math.Abs(ca.b - cb.b);
                    if (d > 0.06f)
                    {
                        n++;
                        lum += (ca.r + ca.g + ca.b) / 3.0;
                        warm += ca.r - ca.b;
                    }
                }
            deltaCount = n;
            avgLum = n > 0 ? (float)(lum / n) : 0f;
            avgWarm = n > 0 ? (float)(warm / n) : 0f;
        }
    }
}
