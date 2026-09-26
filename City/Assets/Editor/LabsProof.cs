// FluxVerse P-39 slice (r142+r187): batch proof for the CPH4 Labs block v0.2
// (lab-glass consumption, law = Tools/city/labs-manifest.json v0.2 - the r141
// 2291-assertion sandbox + the r186 1u-drop sandbox 99; provenance = TECH
// sec.9 P-39 r139..r186 rows).
// Sentinel pattern (r35..r110 style):
//   pass 1: logs/labs.run         -> FluxVerse.LabsProof.BatchRun   -> logs/labs.done
//   pass 2: logs/labs-reload.run -> FluxVerse.LabsProof.ReloadGate -> logs/labs-reload.done
// Sections (C# proof-mirror law r103: every gate mirrors the r141/r186 sandboxes):
//  A pure-core gates: 14-entry table == the manifest v0.2 (world/px/asset/ppu
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
//    attribution) with pod/run/stub/birth/sandbox window deltas + the
//    atmosphere law (night sits under dusk, every glass piece); the L1 labs
//    street view (cam 19,5 - street family |camX|<=30, r138 law) + the
//    unsaved sandbox west L1 delta pair (cam -5.5,5 - the S4 piece sits
//    outside the east street frame). Screenshots: docs/design/
//    m1-r187-labs1u-{day,dusk,night,l1-north}.png (the dusk shot is the r44
//    harmony evidence; NOTE the r44 mechanical warm-shift face was derived
//    for the AA-016 daytime-flat family - the CPH4-blue glass family
//    carries its own anchor palette, so harmony rides the multimodal frame
//    while the atmosphere law stays gated).
//  D-temporal (r189): the live temporal faces render in every L0 tier
//    (baseline = grandfather ApplyState(null), ON = the live state):
//    readout window deltas + the L1 temporal street frame (cam 19,6 - the
//    r187 street view lifted 1u so the floating readout sits inside the
//    18u L1 frame) carrying the ceremony TriggerDirect frame. Shots:
//    docs/design/m1-r189-temporal-{day,dusk,night,l1-north}.png. The
//    constant-alpha readouts sit under the ambient tint like every world
//    object (D-02 emitted-light law - zero tier modulation).
//  F temporal laws (r189, manifest = Tools/city/labs-temporal-manifest.json
//    - the r188 bake 17 + sandbox 70 single source): F0 table==manifest
//    mirror (digits strip law, row law, birth/sandbox readouts, wall slots,
//    ceremony/pulse rects+alphas, incubator standby, poll trio, art->world
//    hand pins); F1 digits asset gate (importer + .meta first import P-27v
//    + the 10-glyph px truth table 28/8/26/26/18/26/30/14/34/30 + gap
//    transparency + on/off color pins); F2 adapter root law (zero public
//    fields, single root); F3 readout census on the LIVE state file
//    (census.total + governance.evolution.open_proposals, live digit
//    counts, cap containment, z/order laws); F4 wall overlay law (live +
//    synthetic saturation + null grandfather with facilities untouched);
//    F5 pulse TriggerDirect trio + linear decay + LAB_INCUBATE_* standby
//    no-op (T-FV-104); F6 mounts released before any save (r146 law).
//  E pass 2: everything survives an editor restart (14 persisted, importer
//    settings, neighbors intact + the temporal root + zero LabTmp mounts).
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

        // scalar whose value may end an object ('}' before any ',' - e.g. the
        // pulse duration_s tails); the temporal manifest uses both shapes
        static float ExtractScalarT(string text, int from, string key)
        {
            int k = text.IndexOf(key, from);
            if (k < 0) throw new InvalidOperationException("manifest key missing: " + key);
            int colon = text.IndexOf(':', k);
            int comma = text.IndexOf(',', colon);
            int brace = text.IndexOf('}', colon);
            int end = (comma >= 0 && (brace < 0 || comma < brace)) ? comma : brace;
            if (end < 0) throw new InvalidOperationException("manifest scalar terminator missing: " + key);
            string s = text.Substring(colon + 1, end - colon - 1).Trim();
            return float.Parse(s, CultureInfo.InvariantCulture);
        }

        // nested int-rect list: "key": [[a,b,c,d], ...] - count rects, strict ints
        static int[][] ExtractRectListAfter(string text, int from, string key, int count)
        {
            int k = text.IndexOf(key, from);
            if (k < 0) throw new InvalidOperationException("manifest key missing: " + key);
            int open = text.IndexOf('[', k);
            int[][] r = new int[count][];
            for (int i = 0; i < count; i++)
            {
                int ro = text.IndexOf('[', open + 1);
                int rc = text.IndexOf(']', ro);
                if (ro < 0 || rc < 0) throw new InvalidOperationException("manifest rect list truncated: " + key);
                string[] parts = text.Substring(ro + 1, rc - ro - 1).Split(',');
                if (parts.Length < 4) throw new InvalidOperationException("manifest rect too short: " + key);
                r[i] = new int[4];
                for (int j = 0; j < 4; j++)
                    r[i][j] = int.Parse(parts[j].Trim(), CultureInfo.InvariantCulture);
                open = rc;
            }
            return r;
        }

        static string Prove()
        {
            // ---- A0. table == manifest (the r141 sandbox is the single geometry source) ----
            string manifest = File.ReadAllText(Path.Combine(RepoRoot, "Tools", "city", "labs-manifest.json"));
            Chk(manifest.Length > 1000, "labs-manifest.json unreadable");
            int podIdx = LabsRules.PodIndex(), stubIdx = LabsRules.StubIndex();
            Chk(podIdx == 0, "pod must sit at table index 0");
            Chk(stubIdx == 11, "stub must sit at index 11 (the r186 1u drops append at the tail)");
            Chk(LabsRules.Count == 14, "manifest v0.2 must hold 14 placements");
            Chk(LabsRules.PodCount == 1 && LabsRules.RunCount == 10 && LabsRules.StubCount == 1
                && LabsRules.BirthCount == 1 && LabsRules.SandboxCount == 1,
                "family arity law broken (1 pod + 10 run + 1 stub + 1 birth + 1 sandbox)");
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
                else if (LabsRules.Family(i) == 2)
                    Chk(LabsRules.PxW(i) == 16 && LabsRules.PxH(i) == 48, "pipe-v frame drift: " + id);
                else if (LabsRules.Family(i) == LabsRules.FamBirth)
                    Chk(LabsRules.PxW(i) == 24 && LabsRules.PxH(i) == 72,
                        "birth-1u frame drift (24x72 native redraw, r185): " + id);
                else
                    Chk(LabsRules.PxW(i) == 24 && LabsRules.PxH(i) == 48,
                        "sandbox-1u frame drift (24x48 native redraw, r185): " + id);
                // world size == px / PPU24 (5e-4: the 16px pipe body is 2/3u)
                Chk(Mathf.Abs(LabsRules.WorldW(i) - LabsRules.PxW(i) / LabsRules.PPU) < 5e-4f
                    && Mathf.Abs(LabsRules.WorldH(i) - LabsRules.PxH(i) / LabsRules.PPU) < 5e-4f,
                    "world size != px/PPU24 at " + id);
                // frame / tint / river
                Chk(LabsRules.InFrame(i), "placement escapes the static L0 frame: " + id);
                Chk(LabsRules.InTintBand(i), "placement escapes the tint band (r22 edge-band kin): " + id);
                Chk(!Overlap(LabsRules.X0(i), LabsRules.Y0(i), LabsRules.X1(i), LabsRules.Y1(i), -50f, -3f, 50f, 3f),
                    "river rows encroached: " + id);
                if (LabsRules.IsBuilding(i))
                {
                    float x0 = LabsRules.X0(i), y0 = LabsRules.Y0(i), x1 = LabsRules.X1(i), y1 = LabsRules.Y1(i);
                    // integer cell boundaries (cells -> world law)
                    Chk(Mathf.Abs(x0 - Mathf.Round(x0)) < 1e-5f && Mathf.Abs(y0 - Mathf.Round(y0)) < 1e-5f
                        && Mathf.Abs(x1 - Mathf.Round(x1)) < 1e-5f && Mathf.Abs(y1 - Mathf.Round(y1)) < 1e-5f,
                        "non-integer labs building cell boundary: " + id);
                    // labs low-rise law: building top <= 12 < offices 13 < brain 19
                    Chk(y1 <= LabsRules.PodTopMax + 1e-5f, "labs building breaches the low-rise cap 12: " + id);
                    if (LabsRules.Family(i) == LabsRules.FamSandbox)
                        Chk(y1 <= LabsRules.SandboxTopMax + 1e-5f,
                            "sandbox breaches its 11.0 slot pin (r186 S4): " + id);
                    Chk(y1 < OfficeRules.NorthCapTop, "labs building towers over the office cap 13: " + id);
                    Chk(y1 < OfficeRules.BrainTop, "labs building challenges the brain tower (sole commanding): " + id);
                    Chk(y0 >= 9f - 1e-5f, "labs building below the north walkway floor: " + id);
                    // buildings never touch road cells (avenue cols 17/18)
                    Chk(!LabsRules.CrossesRoad(i), "labs building sits on the east avenue road cells: " + id);
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
            // r186 1u drops: flush-pinned slot faces (the r169 certified slots)
            int birthIdx = -1, sbxIdx = -1;
            for (int i = 0; i < LabsRules.Count; i++)
            {
                if (LabsRules.Name(i) == "LabBirth01") birthIdx = i;
                else if (LabsRules.Name(i) == "LabSandbox01") sbxIdx = i;
            }
            Chk(birthIdx >= 0 && sbxIdx >= 0, "the r186 1u drops are missing from the table");
            Chk(LabsRules.Family(birthIdx) == LabsRules.FamBirth
                && LabsRules.Family(sbxIdx) == LabsRules.FamSandbox,
                "1u drop family law broken (birth/sandbox)");
            Chk(Mathf.Abs(LabsRules.X0(birthIdx) - LabsRules.X1(podIdx)) < 1e-5f,
                "birth west face must sit flush at the pod east face (S5: pod-face-to-eave 1.000u)");
            float eaveBodyWest = StreetBehaviorRules.EavePos(eaveN01).x - ResidentRules.WorldW(0) / 2f;
            Chk(Mathf.Abs(LabsRules.X1(birthIdx) - eaveBodyWest) < 1e-4f,
                "birth east face must sit flush at the EAVE-N01 body west edge x=24.0");
            bool b1Dock = false;
            for (int b = 0; b < 8; b++)
                if (Mathf.Abs(NeonRules.BuildingAt(b).x1 - LabsRules.X0(sbxIdx)) < 1e-4f) b1Dock = true;
            Chk(b1Dock, "sandbox west face must sit flush at the B1 east face x=-6 (S4 face-flush pin)");
            Chk(File.Exists(Path.Combine(ProjectRoot, LabsRules.BirthPath)), "birth-1u sprite missing on disk");
            Chk(File.Exists(Path.Combine(ProjectRoot, LabsRules.SandboxPath)), "sandbox-1u sprite missing on disk");
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

            // ---- B. asset gate: importer laws on all 5 lab files (idempotent) ----
            string[] labFiles = { LabsRules.PodPath, LabsRules.PipeHPath, LabsRules.PipeVPath,
                                   LabsRules.BirthPath, LabsRules.SandboxPath };
            int[] pinW = { 48, 48, 16, 24, 24 }, pinH = { 72, 16, 48, 72, 48 };
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
                    CheckPavement(ground, roads, water, cx, cy, "pod");
            // r186 1u drops: birth column [23] rows 9..11, sandbox column [-6] rows 9..10
            for (int cy = 9; cy <= 11; cy++) CheckPavement(ground, roads, water, 23, cy, "birth-1u");
            for (int cy = 9; cy <= 10; cy++) CheckPavement(ground, roads, water, -6, cy, "sandbox-1u");
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
            // r189: the temporal adapter root joins the scene's permanent
            // citizens BEFORE the save (zero serialized fields - r124 law);
            // its LabTmp* mounts are runtime-only and stay off the disk
            // (r146 law - asserted post-reopen + in the reload gate)
            CityLabsTemporal tmpRoot = CityLabsTemporal.EnsureRoot();
            Chk(tmpRoot != null && GameObject.Find(CityLabsTemporal.GoName) != null,
                "CityLabsTemporal root failed to create pre-save");
            System.Reflection.FieldInfo[] pubFields = typeof(CityLabsTemporal)
                .GetFields(System.Reflection.BindingFlags.Public | System.Reflection.BindingFlags.Instance);
            Chk(pubFields.Length == 0,
                "CityLabsTemporal must hold zero public fields (r124 serialized-purity law): " + pubFields.Length);
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
            Chk(GameObject.Find("SkylineFar") == null && GameObject.Find("AmbientTintS") == null
                && GameObject.Find("AmbientTintN") == null && GameObject.Find("AmbientTintRiver") == null,
                "runtime-only visuals persisted into the scene");
            Chk(UnityEngine.Object.FindObjectsOfType<CityLabsTemporal>().Length == 1,
                "r189 temporal adapter lost after our save");
            Chk(CountPrefix("LabTmp") == 0,
                "LabTmp runtime mounts persisted into the disk scene (r146 disk-purity law)");

            // ---- F0. temporal table == the r188 manifest (single source law) ----
            string tman = File.ReadAllText(Path.Combine(RepoRoot, "Tools", "city",
                "labs-temporal-manifest.json"));
            Chk(tman.Length > 1000, "labs-temporal-manifest.json unreadable");
            Chk(ExtractStringAfter(tman, 0, "\"protocol\"") == LabsTemporalRules.Protocol,
                "temporal manifest protocol != table");
            int dg = tman.IndexOf("\"digits\"");
            Chk(dg > 0, "manifest digits section missing");
            Chk(ExtractStringAfter(tman, dg, "\"asset\"") == LabsTemporalRules.DigitsPath,
                "manifest digits asset != table");
            float[] dpx = ExtractFloatsAfter(tman, dg, "\"px\"", 2);
            Chk((int)dpx[0] == LabsTemporalRules.DigitsPxW && (int)dpx[1] == LabsTemporalRules.DigitsPxH,
                "manifest digits px != 80x10 table");
            Chk(Mathf.Abs(ExtractScalarT(tman, dg, "\"ppu\"") - LabsTemporalRules.PPU) < 1e-4f,
                "manifest digits ppu != PPU24");
            float[] cell = ExtractFloatsAfter(tman, dg, "\"cell_px\"", 2);
            Chk((int)cell[0] == LabsTemporalRules.CellW && (int)cell[1] == LabsTemporalRules.CellH,
                "manifest cell_px != 7x10 table");
            Chk(Mathf.Abs(ExtractScalarT(tman, dg, "\"pitch_px\"") - LabsTemporalRules.Pitch) < 1e-4f,
                "manifest pitch_px != 8");
            float[] dwh = ExtractFloatsAfter(tman, dg, "\"digit_world_wh\"", 2);
            Chk(Mathf.Abs(dwh[0] - LabsTemporalRules.CellW / LabsTemporalRules.PPU) < 5e-4f
                && Mathf.Abs(dwh[1] - LabsTemporalRules.CellH / LabsTemporalRules.PPU) < 5e-4f,
                "manifest digit_world_wh != cell/PPU24");
            float[] onc = ExtractFloatsAfter(tman, dg, "\"on_color\"", 4);
            Chk(Mathf.Abs(onc[0] / 255f - LabsTemporalRules.OnColor.r) < 1e-3f
                && Mathf.Abs(onc[1] / 255f - LabsTemporalRules.OnColor.g) < 1e-3f
                && Mathf.Abs(onc[2] / 255f - LabsTemporalRules.OnColor.b) < 1e-3f
                && Mathf.Abs(onc[3] / 255f - LabsTemporalRules.OnColor.a) < 1e-3f,
                "manifest on_color != table: [" + onc[0] + "," + onc[1] + "," + onc[2] + "," + onc[3]
                + "] vs [" + LabsTemporalRules.OnColor.r + "," + LabsTemporalRules.OnColor.g
                + "," + LabsTemporalRules.OnColor.b + "," + LabsTemporalRules.OnColor.a + "]");
            float[] ofc = ExtractFloatsAfter(tman, dg, "\"off_color\"", 4);
            Chk(Mathf.Abs(ofc[0] / 255f - LabsTemporalRules.OffColor.r) < 1e-3f
                && Mathf.Abs(ofc[1] / 255f - LabsTemporalRules.OffColor.g) < 1e-3f
                && Mathf.Abs(ofc[2] / 255f - LabsTemporalRules.OffColor.b) < 1e-3f
                && Mathf.Abs(ofc[3] / 255f - LabsTemporalRules.OffColor.a) < 1e-3f,
                "manifest off_color != table");
            Chk(ExtractStringAfter(tman, dg, "\"sha12\"") == LabsTemporalRules.DigitsSha12,
                "manifest digits sha12 != the r188 bake pin");
            int rl = tman.IndexOf("\"readout_row_law\"");
            Chk(rl > dg, "manifest readout_row_law missing");
            Chk(tman.Substring(rl, 60).Contains("\"center_anchored\": true"),
                "row law must stay center-anchored");
            Chk(tman.Contains("\"span_px\": \"ndigits * 8 - 1\""), "span law text drifted");
            Chk(LabsTemporalRules.SpanPxOf(1) == 7f && LabsTemporalRules.SpanPxOf(6) == 47f,
                "span law broken (ndigits*8-1)");
            float[] pad = ExtractFloatsAfter(tman, rl, "\"backing_pad\"", 2);
            Chk(Mathf.Abs(pad[0] - LabsTemporalRules.BackingPadX) < 1e-5f
                && Mathf.Abs(pad[1] - LabsTemporalRules.BackingPadY) < 1e-5f,
                "manifest backing_pad != table");
            float[] bcol = ExtractFloatsAfter(tman, rl, "\"backing_color\"", 4);
            Chk(Mathf.Abs(bcol[0] / 255f - LabsTemporalRules.BackingColor.r) < 1e-3f
                && Mathf.Abs(bcol[1] / 255f - LabsTemporalRules.BackingColor.g) < 1e-3f
                && Mathf.Abs(bcol[2] / 255f - LabsTemporalRules.BackingColor.b) < 1e-3f
                && Mathf.Abs(bcol[3] / 255f - LabsTemporalRules.BackingColor.a) < 1e-3f,
                "manifest backing_color != table");
            Chk(Mathf.Abs(ExtractScalarT(tman, rl, "\"backing_order\"") - LabsTemporalRules.OverlayOrder) < 1e-4f,
                "manifest backing_order != 6");
            Chk(Mathf.Abs(ExtractScalarT(tman, rl, "\"backing_z\"") - LabsTemporalRules.BackingZ) < 1e-5f,
                "manifest backing_z != 0.30");
            Chk(Mathf.Abs(ExtractScalarT(tman, rl, "\"digits_order\"") - LabsTemporalRules.OverlayOrder) < 1e-4f,
                "manifest digits_order != 6");
            Chk(Mathf.Abs(ExtractScalarT(tman, rl, "\"digits_z\"") - LabsTemporalRules.DigitsZ) < 1e-5f,
                "manifest digits_z != 0.28");
            // birth section (scoped past rl: art_to_world carries "birth"/
            // "sandbox" mapping KEYS before the readout_row_law section)
            int bi = tman.IndexOf("\"birth\"", rl);
            Chk(bi > rl, "manifest birth section missing");
            float[] brect = ExtractFloatsAfter(tman, bi, "\"rect\"", 4);
            Chk(Mathf.Abs(brect[0] - LabsTemporalRules.BirthX0) < 1e-4f
                && Mathf.Abs(brect[1] - LabsTemporalRules.BirthY0) < 1e-4f
                && Mathf.Abs(brect[2] - LabsTemporalRules.BirthX1) < 1e-4f
                && Mathf.Abs(brect[3] - LabsTemporalRules.BirthY1) < 1e-4f,
                "manifest birth rect != table");
            int brd = tman.IndexOf("\"readout\"", bi);
            Chk(brd > bi, "manifest birth readout missing");
            Chk(ExtractStringAfter(tman, brd, "\"value_path\"") == "state.census.total",
                "birth value path must be state.census.total");
            float[] bctr = ExtractFloatsAfter(tman, brd, "\"center\"", 2);
            Chk(Mathf.Abs(bctr[0] - LabsTemporalRules.BirthReadoutCenter.x) < 1e-4f
                && Mathf.Abs(bctr[1] - LabsTemporalRules.BirthReadoutCenter.y) < 1e-4f,
                "manifest birth readout center != (23.5, 14.1)");
            Chk(Mathf.Abs(ExtractScalarT(tman, brd, "\"max_digits\"") - LabsTemporalRules.BirthMaxDigits) < 1e-4f,
                "manifest birth max_digits != 6");
            float[] capb = ExtractFloatsAfter(tman, brd, "\"cap_backing_rect\"", 4);
            Chk(Mathf.Abs(capb[0] - LabsTemporalRules.BirthCapBacking.xMin) < 1e-3f
                && Mathf.Abs(capb[1] - LabsTemporalRules.BirthCapBacking.yMin) < 1e-3f
                && Mathf.Abs(capb[2] - LabsTemporalRules.BirthCapBacking.xMax) < 1e-3f
                && Mathf.Abs(capb[3] - LabsTemporalRules.BirthCapBacking.yMax) < 1e-3f,
                "manifest birth cap backing != table");
            Rect capDerived = LabsTemporalRules.BackingRectOf(LabsTemporalRules.BirthReadoutCenter,
                LabsTemporalRules.BirthMaxDigits);
            Chk(Mathf.Abs(capDerived.xMin - LabsTemporalRules.BirthCapBacking.xMin) < 1e-3f
                && Mathf.Abs(capDerived.yMin - LabsTemporalRules.BirthCapBacking.yMin) < 1e-3f
                && Mathf.Abs(capDerived.width - LabsTemporalRules.BirthCapBacking.width) < 1e-3f
                && Mathf.Abs(capDerived.height - LabsTemporalRules.BirthCapBacking.height) < 1e-3f,
                "derived cap backing != manifest cap rect (row law drift)");
            int ws = tman.IndexOf("\"wall_slots\"", bi);
            Chk(ws > brd, "manifest wall_slots missing");
            Chk(Mathf.Abs(ExtractScalarT(tman, ws, "\"overlay_order\"") - LabsTemporalRules.OverlayOrder) < 1e-4f,
                "wall overlay_order != 6");
            Chk(Mathf.Abs(ExtractScalarT(tman, ws, "\"overlay_z\"") - LabsTemporalRules.OverlayZ) < 1e-5f,
                "wall overlay_z != -0.5");
            int[][] slotRects = ExtractRectListAfter(tman, ws, "\"slot_art_rects\"", 6);
            for (int i = 0; i < 6; i++)
                Chk(slotRects[i][0] == LabsTemporalRules.WallSlotArt[i, 0]
                    && slotRects[i][1] == LabsTemporalRules.WallSlotArt[i, 1]
                    && slotRects[i][2] == LabsTemporalRules.WallSlotArt[i, 2]
                    && slotRects[i][3] == LabsTemporalRules.WallSlotArt[i, 3],
                    "manifest wall slot " + i + " art rect != table");
            int ce = tman.IndexOf("\"ceremony\"", bi);
            Chk(ce > ws, "manifest ceremony missing");
            Chk(ExtractStringAfter(tman, ce, "\"event\"") == LabsTemporalRules.CeremonyEvent,
                "manifest ceremony event != RESIDENT_BIRTH");
            Chk(ExtractStringAfter(tman, ce, "\"city_action_ref\"") == LabsTemporalRules.CeremonyActionRef,
                "manifest ceremony action ref != table");
            float[] chamArt = ExtractFloatsAfter(tman, ce, "\"chamber_art_rect\"", 4);
            Chk((int)chamArt[0] == LabsTemporalRules.ChamberArt[0]
                && (int)chamArt[1] == LabsTemporalRules.ChamberArt[1]
                && (int)chamArt[2] == LabsTemporalRules.ChamberArt[2]
                && (int)chamArt[3] == LabsTemporalRules.ChamberArt[3],
                "manifest chamber art rect != table");
            Chk(Mathf.Abs(ExtractScalarT(tman, ce, "\"peak_alpha\"") / 255f
                - LabsTemporalRules.CeremonyPeakAlpha) < 1e-4f, "manifest ceremony peak != 220");
            Chk(Mathf.Abs(ExtractScalarT(tman, ce, "\"newest_slot_burst_alpha\"") / 255f
                - LabsTemporalRules.BurstPeakAlpha) < 1e-5f, "manifest burst peak != 255");
            Chk(Mathf.Abs(ExtractScalarT(tman, ce, "\"duration_s\"")
                - LabsTemporalRules.CeremonyDuration) < 1e-4f, "manifest ceremony duration != 2.5");
            // sandbox section (scoped past ce: same art_to_world key hazard)
            int si = tman.IndexOf("\"sandbox\"", ce);
            Chk(si > ce, "manifest sandbox section missing");
            float[] srect = ExtractFloatsAfter(tman, si, "\"rect\"", 4);
            Chk(Mathf.Abs(srect[0] - LabsTemporalRules.SbxC0) < 1e-4f
                && Mathf.Abs(srect[1] - LabsTemporalRules.SbxY0) < 1e-4f
                && Mathf.Abs(srect[2] - LabsTemporalRules.SbxX1) < 1e-4f
                && Mathf.Abs(srect[3] - LabsTemporalRules.SbxY1) < 1e-4f,
                "manifest sandbox rect != table");
            int srd = tman.IndexOf("\"readout\"", si);
            Chk(srd > si, "manifest sandbox readout missing");
            Chk(ExtractStringAfter(tman, srd, "\"value_path\"") == "state.governance.evolution.open_proposals",
                "sandbox value path must be state.governance.evolution.open_proposals");
            float[] sctr = ExtractFloatsAfter(tman, srd, "\"center\"", 2);
            Chk(Mathf.Abs(sctr[0] - LabsTemporalRules.SbxReadoutCenter.x) < 1e-4f
                && Mathf.Abs(sctr[1] - LabsTemporalRules.SbxReadoutCenter.y) < 1e-4f,
                "manifest sandbox readout center != (-5.4, 11.4)");
            Chk(Mathf.Abs(ExtractScalarT(tman, srd, "\"max_digits\"") - LabsTemporalRules.SbxMaxDigits) < 1e-4f,
                "manifest sandbox max_digits != 3");
            float[] scap = ExtractFloatsAfter(tman, srd, "\"cap_backing_rect\"", 4);
            Chk(Mathf.Abs(scap[0] - LabsTemporalRules.SbxCapBacking.xMin) < 1e-3f
                && Mathf.Abs(scap[1] - LabsTemporalRules.SbxCapBacking.yMin) < 1e-3f
                && Mathf.Abs(scap[2] - LabsTemporalRules.SbxCapBacking.xMax) < 1e-3f
                && Mathf.Abs(scap[3] - LabsTemporalRules.SbxCapBacking.yMax) < 1e-3f,
                "manifest sandbox cap backing != table");
            int spn = tman.IndexOf("\"pulses\"", si);
            Chk(spn > srd, "manifest sandbox pulses missing");
            Chk(ExtractStringAfter(tman, spn, "\"event\"") == LabsTemporalRules.PulseNewEvent,
                "first sandbox pulse != PROPOSAL_NEW");
            Chk(ExtractStringAfter(tman, spn, "\"city_action_ref\"") == LabsTemporalRules.PulseNewActionRef,
                "PROPOSAL_NEW action ref != table");
            float[] holoArt = ExtractFloatsAfter(tman, spn, "\"art_rect\"", 4);
            Chk((int)holoArt[0] == LabsTemporalRules.HoloArt[0]
                && (int)holoArt[1] == LabsTemporalRules.HoloArt[1]
                && (int)holoArt[2] == LabsTemporalRules.HoloArt[2]
                && (int)holoArt[3] == LabsTemporalRules.HoloArt[3],
                "manifest holo band art rect != table");
            Chk(Mathf.Abs(ExtractScalarT(tman, spn, "\"peak_alpha\"") / 255f
                - LabsTemporalRules.PulseNewPeakAlpha) < 1e-4f, "PROPOSAL_NEW peak != 180");
            int ap = tman.IndexOf("\"" + LabsTemporalRules.PulseAppliedEvent + "\"", spn);
            Chk(ap > spn, "PROPOSAL_APPLIED pulse missing");
            Chk(ExtractStringAfter(tman, ap, "\"city_action_ref\"") == LabsTemporalRules.PulseAppliedActionRef,
                "PROPOSAL_APPLIED action ref != table");
            int[][] blkArt = ExtractRectListAfter(tman, ap, "\"art_rects\"", 2);
            for (int b = 0; b < 2; b++)
                Chk(blkArt[b][0] == LabsTemporalRules.BlockArt[b, 0]
                    && blkArt[b][1] == LabsTemporalRules.BlockArt[b, 1]
                    && blkArt[b][2] == LabsTemporalRules.BlockArt[b, 2]
                    && blkArt[b][3] == LabsTemporalRules.BlockArt[b, 3],
                    "manifest district block " + b + " art rect != table");
            Chk(Mathf.Abs(ExtractScalarT(tman, ap, "\"peak_alpha\"") / 255f
                - LabsTemporalRules.PulseAppliedPeakAlpha) < 1e-4f, "PROPOSAL_APPLIED peak != 160");
            Chk(Mathf.Abs(ExtractScalarT(tman, si, "\"overlay_z\"") - LabsTemporalRules.OverlayZ) < 1e-5f,
                "sandbox overlay_z != -0.5");
            // incubator: standby + zero pulses + facility identity (the pod)
            int ic = tman.IndexOf("\"incubator\"");
            Chk(ic > si, "manifest incubator section missing");
            float[] irect = ExtractFloatsAfter(tman, ic, "\"rect\"", 4);
            Chk(Mathf.Abs(irect[0] - LabsRules.X0(podIdx)) < 1e-4f
                && Mathf.Abs(irect[1] - LabsRules.Y0(podIdx)) < 1e-4f
                && Mathf.Abs(irect[2] - LabsRules.X1(podIdx)) < 1e-4f
                && Mathf.Abs(irect[3] - LabsRules.Y1(podIdx)) < 1e-4f,
                "manifest incubator rect != the L1 pod placement (facility identity law)");
            int sb = tman.IndexOf("\"standby\"", ic);
            Chk(sb > ic && sb < ic + 200 && tman.Substring(sb, 24).Contains("true"),
                "incubator standby law missing (D-02)");
            int icp = tman.IndexOf("\"pulses\"", ic);
            Chk(icp > ic, "incubator pulses key missing");
            int ico = tman.IndexOf('[', icp);
            Chk(ico > 0 && tman.IndexOf(']', ico) == ico + 1,
                "incubator pulses must stay empty (T-FV-104 standby reservation)");
            // poll law
            int po = tman.IndexOf("\"poll\"");
            Chk(po > ic, "manifest poll section missing");
            Chk(Mathf.Abs(ExtractScalarT(tman, po, "\"interval_s\"")
                - LabsTemporalRules.PollIntervalSec) < 1e-4f, "poll interval != 10s");
            int pev = tman.IndexOf("\"pulse_events\"", po);
            Chk(pev > po, "poll pulse_events missing");
            Chk(tman.Substring(pev, 200).Contains("\"RESIDENT_BIRTH\"")
                && tman.Substring(pev, 200).Contains("\"PROPOSAL_NEW\"")
                && tman.Substring(pev, 200).Contains("\"PROPOSAL_APPLIED\""),
                "poll pulse event trio missing");
            Chk(LabsTemporalRules.PulseEventCount == 3, "pulse event count law broken");
            // art->world hand pins (the r188 sandbox gate's hand-recompute,
            // now the C# table law)
            Rect s0w = LabsTemporalRules.WallSlotRect(0);
            Chk(Mathf.Abs(s0w.xMin - 23.3333f) < 1e-3f && Mathf.Abs(s0w.yMin - 9.875f) < 1e-3f
                && Mathf.Abs(s0w.xMax - 23.4583f) < 1e-3f && Mathf.Abs(s0w.yMax - 9.9583f) < 1e-3f,
                "wall slot0 world rect off the r188 hand pin");
            Rect chW = LabsTemporalRules.ChamberRect();
            Chk(Mathf.Abs(chW.xMin - 23.2083f) < 1e-3f && Mathf.Abs(chW.yMin - 10.1667f) < 1e-3f
                && Mathf.Abs(chW.xMax - 23.7917f) < 1e-3f && Mathf.Abs(chW.yMax - 11.6667f) < 1e-3f,
                "chamber world rect off the r188 hand pin");
            Rect hoW = LabsTemporalRules.HoloRect();
            Chk(Mathf.Abs(hoW.xMin - (-5.6667f)) < 1e-3f && Mathf.Abs(hoW.yMin - 10.4167f) < 1e-3f
                && Mathf.Abs(hoW.xMax - (-5.3333f)) < 1e-3f && Mathf.Abs(hoW.yMax - 10.75f) < 1e-3f,
                "holo band world rect off the r188 hand pin");
            Rect b0W = LabsTemporalRules.BlockRect(0);
            Chk(Mathf.Abs(b0W.xMin - (-5.7083f)) < 1e-3f && Mathf.Abs(b0W.yMin - 9.75f) < 1e-3f
                && Mathf.Abs(b0W.xMax - (-5.4167f)) < 1e-3f && Mathf.Abs(b0W.yMax - 10.25f) < 1e-3f,
                "district block0 world rect off the r188 hand pin");
            Rect b1W = LabsTemporalRules.BlockRect(1);
            Chk(Mathf.Abs(b1W.xMin - (-5.375f)) < 1e-3f && Mathf.Abs(b1W.yMin - 9.75f) < 1e-3f
                && Mathf.Abs(b1W.xMax - (-5.0833f)) < 1e-3f && Mathf.Abs(b1W.yMax - 10.375f) < 1e-3f,
                "district block1 world rect off the r188 hand pin");
            // derive laws sanity
            Chk(LabsTemporalRules.DigitCountOf(0, 6) == 1 && LabsTemporalRules.DigitCountOf(9, 6) == 1
                && LabsTemporalRules.DigitCountOf(10, 6) == 2 && LabsTemporalRules.DigitCountOf(10003, 6) == 5
                && LabsTemporalRules.DigitCountOf(1234567, 6) == 6,
                "digit count law broken (incl. the over-cap clamp)");
            Chk(LabsTemporalRules.DigitAt(10003, 5, 0) == 1 && LabsTemporalRules.DigitAt(10003, 5, 1) == 0
                && LabsTemporalRules.DigitAt(10003, 5, 4) == 3, "digit-at law broken");
            Chk(LabsTemporalRules.DigitAt(1234567, 6, 0) == 2 && LabsTemporalRules.DigitAt(1234567, 6, 5) == 7,
                "over-cap must keep the low-order digits");
            Chk(LabsTemporalRules.WallLitCountOf(0) == 0 && LabsTemporalRules.WallLitCountOf(3) == 3
                && LabsTemporalRules.WallLitCountOf(8) == 6 && LabsTemporalRules.WallLitCountOf(15) == 6,
                "wall saturation law broken");

            // ---- F1. digits strip: importer + .meta first import (P-27v) + px truth ----
            Sprite dSp = ForceSprite(LabsTemporalRules.DigitsPath);
            Chk(dSp != null, "digits sprite failed to load");
            Chk(Mathf.Abs(dSp.rect.width - LabsTemporalRules.DigitsPxW) < 0.5f
                && Mathf.Abs(dSp.rect.height - LabsTemporalRules.DigitsPxH) < 0.5f,
                "digits rect != 80x10");
            Chk(Mathf.Abs(dSp.bounds.size.x - LabsTemporalRules.DigitsPxW / LabsTemporalRules.PPU) < 0.01f
                && Mathf.Abs(dSp.bounds.size.y - LabsTemporalRules.DigitsPxH / LabsTemporalRules.PPU) < 0.01f,
                "digits natural bounds != world size");
            Chk(File.Exists(Path.Combine(ProjectRoot, LabsTemporalRules.DigitsPath + ".meta")),
                "digits .meta not generated by the first editor import (P-27v, r140 note 3)");
            Texture2D dtex = new Texture2D(2, 2, TextureFormat.RGBA32, false);
            Chk(dtex.LoadImage(File.ReadAllBytes(Path.Combine(ProjectRoot, LabsTemporalRules.DigitsPath))),
                "digits png byte-load failed (r18 law)");
            Chk(dtex.width == LabsTemporalRules.DigitsPxW && dtex.height == LabsTemporalRules.DigitsPxH,
                "digits png dims off the strip law");
            int[] truth = { 28, 8, 26, 26, 18, 26, 30, 14, 34, 30 };   // r188 bake gate pins
            int[] litCounts = new int[10];
            for (int d = 0; d < 10; d++)
            {
                int lit = 0;
                for (int y = 0; y < LabsTemporalRules.CellH; y++)
                    for (int x = 0; x < LabsTemporalRules.CellW; x++)
                    {
                        Color c = dtex.GetPixel(d * LabsTemporalRules.Pitch + x, y);
                        if (c.a > 0.55f)
                        {
                            lit++;
                            Chk(Mathf.Abs(c.r - LabsTemporalRules.OnColor.r) < 0.02f
                                && Mathf.Abs(c.g - LabsTemporalRules.OnColor.g) < 0.02f
                                && Mathf.Abs(c.b - LabsTemporalRules.OnColor.b) < 0.02f,
                                "lit px off the on color at glyph " + d);
                        }
                        else if (c.a > 0.2f)
                            Chk(Mathf.Abs(c.r - LabsTemporalRules.OffColor.r) < 0.02f
                                && Mathf.Abs(c.g - LabsTemporalRules.OffColor.g) < 0.02f
                                && Mathf.Abs(c.b - LabsTemporalRules.OffColor.b) < 0.02f,
                                "dim px off the off color at glyph " + d);
                    }
                litCounts[d] = lit;
                Chk(lit == truth[d], "glyph " + d + " lit px " + lit + " != r188 pin " + truth[d]);
                for (int y = 0; y < LabsTemporalRules.CellH; y++)
                    Chk(dtex.GetPixel(d * LabsTemporalRules.Pitch + LabsTemporalRules.CellW, y).a < 0.08f,
                        "gap column not transparent at glyph " + d);
            }
            Chk(litCounts[1] != litCounts[7],
                "1 vs 7 must stay asymmetric (r188 mutual-distinction pin)");
            UnityEngine.Object.DestroyImmediate(dtex);

            // ---- F2. adapter root law (persisted by the C save) ----
            CityLabsTemporal tmp = CityLabsTemporal.EnsureRoot();
            Chk(tmp != null, "CityLabsTemporal root missing after the C save");
            Chk(UnityEngine.Object.FindObjectsOfType<CityLabsTemporal>().Length == 1,
                "duplicate temporal roots in the scene");

            // ---- F3. readout census: the LIVE state file drives both rows ----
            TemporalSnapshot live = LabsTemporalRules.LoadStateFile();
            Chk(live != null && live.hasCensus, "live census leg missing (probe r165 face)");
            Chk(live.hasEvolution, "live evolution leg missing (probe r164 face)");
            tmp.ApplyState(live);
            int bn = LabsTemporalRules.DigitCountOf(live.censusTotal, LabsTemporalRules.BirthMaxDigits);
            Chk(tmp.BirthDigits == bn, "birth digit count " + tmp.BirthDigits + " != live total's " + bn);
            Chk(tmp.BirthValue == live.censusTotal,
                "birth value " + tmp.BirthValue + " != live census total " + live.censusTotal);
            Chk(tmp.BirthVisible, "birth readout hidden while census is present");
            Rect bbR = LabsTemporalRules.BackingRectOf(LabsTemporalRules.BirthReadoutCenter, bn);
            Chk(Mathf.Abs(tmp.BirthBackingTap.transform.position.x - bbR.center.x) < 1e-4f
                && Mathf.Abs(tmp.BirthBackingTap.transform.position.y - bbR.center.y) < 1e-4f,
                "birth backing pos != live row center");
            Chk(Mathf.Abs(tmp.BirthBackingTap.transform.position.z - LabsTemporalRules.BackingZ) < 1e-5f,
                "birth backing z off the row law");
            Chk(Mathf.Abs(tmp.BirthBackingTap.transform.localScale.x - bbR.width) < 1e-4f
                && Mathf.Abs(tmp.BirthBackingTap.transform.localScale.y - bbR.height) < 1e-4f,
                "birth backing scale != live row size (dynamic width law)");
            Chk(bbR.xMin >= LabsTemporalRules.BirthCapBacking.xMin - 1e-4f
                && bbR.xMax <= LabsTemporalRules.BirthCapBacking.xMax + 1e-4f
                && bbR.yMin >= LabsTemporalRules.BirthCapBacking.yMin - 1e-4f
                && bbR.yMax <= LabsTemporalRules.BirthCapBacking.yMax + 1e-4f,
                "live birth backing escapes the r188-swept cap rect");
            for (int k = 0; k < bn; k++)
            {
                int dv = LabsTemporalRules.DigitAt(live.censusTotal, bn, k);
                Vector2 dc = LabsTemporalRules.DigitCenterOf(LabsTemporalRules.BirthReadoutCenter, bn, k);
                SpriteRenderer dsr = tmp.BirthDigitTap(k);
                Chk(dsr != null && dsr.enabled, "birth digit " + k + " missing/disabled");
                Chk(dsr.sprite != null
                    && Mathf.Abs(dsr.sprite.rect.x - dv * LabsTemporalRules.Pitch) < 0.5f,
                    "birth digit " + k + " must slice glyph " + dv);
                Chk(Mathf.Abs(dsr.transform.position.x - dc.x) < 1e-4f
                    && Mathf.Abs(dsr.transform.position.y - dc.y) < 1e-4f,
                    "birth digit " + k + " pos off the row law");
                Chk(Mathf.Abs(dsr.transform.position.z - LabsTemporalRules.DigitsZ) < 1e-5f,
                    "birth digit " + k + " z off the row law");
                Chk(dsr.sortingOrder == LabsTemporalRules.OverlayOrder,
                    "birth digit " + k + " sorting order off law");
            }
            int sn = LabsTemporalRules.DigitCountOf(live.openProposals, LabsTemporalRules.SbxMaxDigits);
            Chk(tmp.SbxDigits == sn, "sandbox digit count != live open proposals' count");
            Chk(tmp.SbxValue == live.openProposals,
                "sandbox value " + tmp.SbxValue + " != live open proposals " + live.openProposals);
            Chk(tmp.SbxVisible, "sandbox readout hidden while evolution is present");
            Rect sbR = LabsTemporalRules.BackingRectOf(LabsTemporalRules.SbxReadoutCenter, sn);
            Chk(Mathf.Abs(tmp.SbxBackingTap.transform.position.x - sbR.center.x) < 1e-4f
                && Mathf.Abs(tmp.SbxBackingTap.transform.position.y - sbR.center.y) < 1e-4f,
                "sandbox backing pos != live row center");
            Chk(sbR.xMin >= LabsTemporalRules.SbxCapBacking.xMin - 1e-4f
                && sbR.xMax <= LabsTemporalRules.SbxCapBacking.xMax + 1e-4f,
                "live sandbox backing escapes the swept cap rect");
            for (int k = 0; k < sn; k++)
            {
                int dv = LabsTemporalRules.DigitAt(live.openProposals, sn, k);
                Vector2 dc = LabsTemporalRules.DigitCenterOf(LabsTemporalRules.SbxReadoutCenter, sn, k);
                SpriteRenderer dsr = tmp.SbxDigitTap(k);
                Chk(dsr != null && dsr.enabled, "sandbox digit " + k + " missing/disabled");
                Chk(dsr.sprite != null
                    && Mathf.Abs(dsr.sprite.rect.x - dv * LabsTemporalRules.Pitch) < 0.5f,
                    "sandbox digit " + k + " must slice glyph " + dv);
                Chk(Mathf.Abs(dsr.transform.position.x - dc.x) < 1e-4f
                    && Mathf.Abs(dsr.transform.position.y - dc.y) < 1e-4f,
                    "sandbox digit " + k + " pos off the row law");
            }

            // ---- F4. wall overlay law: live + synthetic saturation + grandfather ----
            int wallLive = live.wallCount;
            Chk(wallLive >= 1, "live census wall empty (r165 top-15 face)");
            int expectLit = LabsTemporalRules.WallLitCountOf(wallLive);
            Chk(tmp.WallLit == expectLit,
                "wall lit " + tmp.WallLit + " != min(6, live wall " + wallLive + ")");
            for (int i = 0; i < LabsTemporalRules.WallSlotCount; i++)
            {
                SpriteRenderer wsr = tmp.WallTap(i);
                Rect wr = LabsTemporalRules.WallSlotRect(i);
                Chk(Mathf.Abs(wsr.transform.position.x - wr.center.x) < 1e-4f
                    && Mathf.Abs(wsr.transform.position.y - wr.center.y) < 1e-4f,
                    "wall slot " + i + " pos off art->world");
                Chk(Mathf.Abs(wsr.transform.localScale.x - wr.width) < 1e-4f
                    && Mathf.Abs(wsr.transform.localScale.y - wr.height) < 1e-4f,
                    "wall slot " + i + " scale off the slot size");
                Chk(Mathf.Abs(wsr.transform.position.z - LabsTemporalRules.OverlayZ) < 1e-5f,
                    "wall slot " + i + " z off law");
                Chk(wsr.sortingOrder == LabsTemporalRules.OverlayOrder,
                    "wall slot " + i + " sorting order off law");
                if (i < expectLit)
                {
                    Chk(wsr.enabled, "wall slot " + i + " must be lit (wall holds " + wallLive + " cards)");
                    float ea = i == 0 ? LabsTemporalRules.WallNewestAlpha : LabsTemporalRules.WallLitAlpha;
                    Chk(Mathf.Abs(wsr.color.a - ea) < 1e-4f,
                        "wall slot " + i + " alpha off the r165 frontier law");
                }
                else Chk(!wsr.enabled, "wall slot " + i + " must stay dark");
            }
            // synthetic saturation + zero value
            TemporalSnapshot syn = new TemporalSnapshot();
            syn.hasCensus = true; syn.censusTotal = 5; syn.wallCount = 3; syn.newestCardId = "C-test";
            syn.hasEvolution = true; syn.openProposals = 0;
            tmp.ApplyState(syn);
            Chk(tmp.WallLit == 3, "synthetic wall 3 must light exactly 3 slots");
            Chk(tmp.WallTap(2).enabled && !tmp.WallTap(3).enabled, "synthetic wall frontier wrong");
            Chk(tmp.BirthDigits == 1, "value 5 must render one glyph");
            Chk(tmp.SbxDigits == 1, "value 0 must render one glyph (live zero, never blank)");
            // grandfather: null -> both faces hidden, wall off, facilities untouched
            tmp.ApplyState(null);
            Chk(!tmp.BirthVisible && !tmp.SbxVisible, "grandfather must hide both readouts");
            Chk(tmp.WallLit == 0, "grandfather must turn the wall off");
            for (int i = 0; i < LabsTemporalRules.WallSlotCount; i++)
                Chk(!tmp.WallTap(i).enabled, "grandfather wall slot " + i + " still lit");
            for (int i = 0; i < LabsRules.Count; i++)
                Chk(GameObject.Find(LabsRules.Name(i)) != null,
                    "grandfather must not touch the facility sprites: " + LabsRules.Name(i));
            tmp.ApplyState(live);
            Chk(tmp.BirthVisible && tmp.SbxVisible && tmp.WallLit == expectLit,
                "live re-apply after the grandfather face");

            // ---- F5. pulse TriggerDirect trio + decay + incubator standby ----
            Chk(!tmp.ChamberTap.sr.enabled && !tmp.BurstTap.sr.enabled
                && !tmp.HoloTap.sr.enabled && !tmp.BlockTap(0).sr.enabled,
                "pulses must start dark");
            tmp.TriggerPulse("LAB_INCUBATE_START");   // reserved -> standby no-op
            Chk(!tmp.ChamberTap.sr.enabled && !tmp.BurstTap.sr.enabled
                && !tmp.HoloTap.sr.enabled && !tmp.BlockTap(0).sr.enabled
                && !tmp.BlockTap(1).sr.enabled,
                "LAB_INCUBATE_START must be a standby no-op (T-FV-104 reservation)");
            tmp.TriggerPulse(LabsTemporalRules.CeremonyEvent);
            Chk(tmp.ChamberTap.sr.enabled, "chamber glow must fire on RESIDENT_BIRTH");
            Chk(Mathf.Abs(tmp.ChamberTap.sr.color.a - LabsTemporalRules.CeremonyPeakAlpha) < 1e-4f,
                "chamber peak alpha off 220");
            Rect chR2 = LabsTemporalRules.ChamberRect();
            Chk(Mathf.Abs(tmp.ChamberTap.sr.transform.position.x - chR2.center.x) < 1e-4f
                && Mathf.Abs(tmp.ChamberTap.sr.transform.position.y - chR2.center.y) < 1e-4f,
                "chamber glow pos off art->world");
            Chk(Mathf.Abs(tmp.ChamberTap.sr.transform.localScale.x - chR2.width) < 1e-4f
                && Mathf.Abs(tmp.ChamberTap.sr.transform.localScale.y - chR2.height) < 1e-4f,
                "chamber glow scale off the art rect");
            Chk(Mathf.Abs(tmp.BurstTap.sr.color.a - LabsTemporalRules.BurstPeakAlpha) < 1e-5f,
                "newest-slot burst alpha off 255");
            Rect sl0 = LabsTemporalRules.WallSlotRect(0);
            Chk(Mathf.Abs(tmp.BurstTap.sr.transform.position.x - sl0.center.x) < 1e-4f
                && Mathf.Abs(tmp.BurstTap.sr.transform.position.y - sl0.center.y) < 1e-4f,
                "the burst must ride the newest wall slot");
            Chk(!tmp.HoloTap.sr.enabled && !tmp.BlockTap(0).sr.enabled,
                "the birth ceremony must not light the sandbox");
            tmp.Step(LabsTemporalRules.CeremonyDuration * 0.5f);
            Chk(Mathf.Abs(tmp.ChamberTap.sr.color.a
                - LabsTemporalRules.CeremonyPeakAlpha * 0.5f) < 0.02f,
                "the fade must be linear (half time -> half alpha)");
            tmp.Step(LabsTemporalRules.CeremonyDuration);
            Chk(!tmp.ChamberTap.sr.enabled && !tmp.BurstTap.sr.enabled,
                "the ceremony must end after its duration");
            tmp.TriggerPulse(LabsTemporalRules.PulseNewEvent);
            Chk(tmp.HoloTap.sr.enabled, "the hologram band must fire on PROPOSAL_NEW");
            Chk(Mathf.Abs(tmp.HoloTap.sr.color.a - LabsTemporalRules.PulseNewPeakAlpha) < 1e-4f,
                "holo peak alpha off 180");
            Rect hoR2 = LabsTemporalRules.HoloRect();
            Chk(Mathf.Abs(tmp.HoloTap.sr.transform.position.x - hoR2.center.x) < 1e-4f
                && Mathf.Abs(tmp.HoloTap.sr.transform.position.y - hoR2.center.y) < 1e-4f,
                "holo band pos off art->world");
            Chk(!tmp.BlockTap(0).sr.enabled, "PROPOSAL_NEW must not light the district blocks");
            tmp.Step(LabsTemporalRules.PulseDuration + 0.01f);
            Chk(!tmp.HoloTap.sr.enabled, "the hologram pulse must end");
            tmp.TriggerPulse(LabsTemporalRules.PulseAppliedEvent);
            Chk(tmp.BlockTap(0).sr.enabled && tmp.BlockTap(1).sr.enabled,
                "both district blocks must fire on PROPOSAL_APPLIED");
            Chk(Mathf.Abs(tmp.BlockTap(0).sr.color.a - LabsTemporalRules.PulseAppliedPeakAlpha) < 1e-4f
                && Mathf.Abs(tmp.BlockTap(1).sr.color.a - LabsTemporalRules.PulseAppliedPeakAlpha) < 1e-4f,
                "district block peak alpha off 160");
            Rect bl0 = LabsTemporalRules.BlockRect(0), bl1 = LabsTemporalRules.BlockRect(1);
            Chk(Mathf.Abs(tmp.BlockTap(0).sr.transform.position.x - bl0.center.x) < 1e-4f
                && Mathf.Abs(tmp.BlockTap(1).sr.transform.position.x - bl1.center.x) < 1e-4f,
                "district block pos off art->world");
            Chk(!tmp.HoloTap.sr.enabled, "PROPOSAL_APPLIED must not re-light the hologram band");
            tmp.Step(LabsTemporalRules.PulseDuration + 0.01f);
            Chk(!tmp.BlockTap(0).sr.enabled && !tmp.BlockTap(1).sr.enabled,
                "the applied pulse must end");
            tmp.TriggerPulse(LabsTemporalRules.CeremonyEvent);
            Chk(tmp.ChamberTap.sr.enabled, "the ceremony must re-fire for every real birth");
            tmp.Step(LabsTemporalRules.CeremonyDuration + 0.01f);
            Chk(!tmp.ChamberTap.sr.enabled, "the re-fired ceremony must end");

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
            int birD = 0, birK = 0, birN = 0, sbxD = 0, sbxK = 0, sbxN = 0;
            float podDuskLum = 0f, podNightLum = 0f, podDayLum = 0f;
            float podDayWarm = 0f, podDuskWarm = 0f;
            float birDuskLum = 0f, birNightLum = 0f, sbxDuskLum = 0f, sbxNightLum = 0f;
            // pod window = pod rect; run window = whole conduit x 3..23; stub window = the pod leg;
            // birth/sandbox windows = their own rects (the r186 1u drops, r187 additions)
            float runCx = 13f, runCy = (LabsRules.BandY0 + LabsRules.BandY1) / 2f;
            float runHw = 10f + 0.4f, runHh = (LabsRules.BandY1 - LabsRules.BandY0) / 2f + 0.4f;
            float stubCx = 22.5f, stubCy = 12.6667f;
            float stubHw = 0.3333f + 0.4f, stubHh = 1f + 0.4f;
            amb.ApplyAmbient(AmbientTier.Day);
            SetLabs(labGos, false);
            Texture2D dayBase = Shot(cam, null);
            SetLabs(labGos, true);
            Texture2D dayOn = Shot(cam, "m1-r187-labs1u-day.png");
            RectWinDelta(dayOn, dayBase, cam, out podD, out podDayLum, out podDayWarm,
                LabsRules.Pos(podIdx).x, LabsRules.Pos(podIdx).y,
                LabsRules.WorldW(podIdx) / 2f + 0.4f, LabsRules.WorldH(podIdx) / 2f + 0.4f);
            float lum; float warm;
            RectWinDelta(dayOn, dayBase, cam, out runD, out lum, out warm, runCx, runCy, runHw, runHh);
            RectWinDelta(dayOn, dayBase, cam, out stubD, out lum, out warm, stubCx, stubCy, stubHw, stubHh);
            RectWinDelta(dayOn, dayBase, cam, out birD, out lum, out warm,
                LabsRules.Pos(birthIdx).x, LabsRules.Pos(birthIdx).y,
                LabsRules.WorldW(birthIdx) / 2f + 0.4f, LabsRules.WorldH(birthIdx) / 2f + 0.4f);
            RectWinDelta(dayOn, dayBase, cam, out sbxD, out lum, out warm,
                LabsRules.Pos(sbxIdx).x, LabsRules.Pos(sbxIdx).y,
                LabsRules.WorldW(sbxIdx) / 2f + 0.4f, LabsRules.WorldH(sbxIdx) / 2f + 0.4f);
            amb.ApplyAmbient(AmbientTier.Dusk);
            SetLabs(labGos, false);
            Texture2D duskBase = Shot(cam, null);
            SetLabs(labGos, true);
            Texture2D duskOn = Shot(cam, "m1-r187-labs1u-dusk.png");
            RectWinDelta(duskOn, duskBase, cam, out podK, out podDuskLum, out podDuskWarm,
                LabsRules.Pos(podIdx).x, LabsRules.Pos(podIdx).y,
                LabsRules.WorldW(podIdx) / 2f + 0.4f, LabsRules.WorldH(podIdx) / 2f + 0.4f);
            RectWinDelta(duskOn, duskBase, cam, out runK, out lum, out warm, runCx, runCy, runHw, runHh);
            RectWinDelta(duskOn, duskBase, cam, out stubK, out lum, out warm, stubCx, stubCy, stubHw, stubHh);
            RectWinDelta(duskOn, duskBase, cam, out birK, out birDuskLum, out warm,
                LabsRules.Pos(birthIdx).x, LabsRules.Pos(birthIdx).y,
                LabsRules.WorldW(birthIdx) / 2f + 0.4f, LabsRules.WorldH(birthIdx) / 2f + 0.4f);
            RectWinDelta(duskOn, duskBase, cam, out sbxK, out sbxDuskLum, out warm,
                LabsRules.Pos(sbxIdx).x, LabsRules.Pos(sbxIdx).y,
                LabsRules.WorldW(sbxIdx) / 2f + 0.4f, LabsRules.WorldH(sbxIdx) / 2f + 0.4f);
            amb.ApplyAmbient(AmbientTier.Night);
            SetLabs(labGos, false);
            Texture2D nightBase = Shot(cam, null);
            SetLabs(labGos, true);
            Texture2D nightOn = Shot(cam, "m1-r187-labs1u-night.png");
            RectWinDelta(nightOn, nightBase, cam, out podN, out podNightLum, out lum,
                LabsRules.Pos(podIdx).x, LabsRules.Pos(podIdx).y,
                LabsRules.WorldW(podIdx) / 2f + 0.4f, LabsRules.WorldH(podIdx) / 2f + 0.4f);
            RectWinDelta(nightOn, nightBase, cam, out runN, out lum, out warm, runCx, runCy, runHw, runHh);
            RectWinDelta(nightOn, nightBase, cam, out stubN, out lum, out warm, stubCx, stubCy, stubHw, stubHh);
            RectWinDelta(nightOn, nightBase, cam, out birN, out birNightLum, out warm,
                LabsRules.Pos(birthIdx).x, LabsRules.Pos(birthIdx).y,
                LabsRules.WorldW(birthIdx) / 2f + 0.4f, LabsRules.WorldH(birthIdx) / 2f + 0.4f);
            RectWinDelta(nightOn, nightBase, cam, out sbxN, out sbxNightLum, out warm,
                LabsRules.Pos(sbxIdx).x, LabsRules.Pos(sbxIdx).y,
                LabsRules.WorldW(sbxIdx) / 2f + 0.4f, LabsRules.WorldH(sbxIdx) / 2f + 0.4f);
            // visibility gates (provisional thresholds; actuals reported for calibration)
            Chk(podD >= 200, "pod invisible in the day L0 frame: " + podD + "px");
            Chk(runD >= 400, "conduit invisible in the day L0 frame: " + runD + "px");
            Chk(stubD >= 30, "stub invisible in the day L0 frame: " + stubD + "px");
            Chk(birD >= 60, "birth-1u invisible in the day L0 frame: " + birD + "px");
            Chk(sbxD >= 40, "sandbox-1u invisible in the day L0 frame: " + sbxD + "px");
            Chk(podK >= 150, "pod invisible at dusk: " + podK + "px");
            Chk(runK >= 300, "conduit invisible at dusk: " + runK + "px");
            Chk(stubK >= 20, "stub invisible at dusk: " + stubK + "px");
            Chk(birK >= 40, "birth-1u invisible at dusk: " + birK + "px");
            Chk(sbxK >= 25, "sandbox-1u invisible at dusk: " + sbxK + "px");
            Chk(podN >= 40, "pod invisible at night: " + podN + "px");
            Chk(runN >= 60, "conduit invisible at night: " + runN + "px");
            Chk(stubN >= 6, "stub invisible at night: " + stubN + "px");
            Chk(birN >= 10, "birth-1u invisible at night: " + birN + "px");
            Chk(sbxN >= 6, "sandbox-1u invisible at night: " + sbxN + "px");
            // atmosphere law: the night tier must sit the glass family under dusk
            Chk(podNightLum < podDuskLum, "pod night must sit under dusk (atmosphere law): "
                + podNightLum.ToString("F3") + " vs " + podDuskLum.ToString("F3"));
            Chk(birNightLum < birDuskLum, "birth-1u night must sit under dusk (atmosphere law): "
                + birNightLum.ToString("F3") + " vs " + birDuskLum.ToString("F3"));
            Chk(sbxNightLum < sbxDuskLum, "sandbox-1u night must sit under dusk (atmosphere law): "
                + sbxNightLum.ToString("F3") + " vs " + sbxDuskLum.ToString("F3"));
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
            Texture2D l1On = Shot(cam, "m1-r187-labs1u-l1-north.png");
            int l1Pod, l1Run, l1Stub, l1Bir;
            RectWinDelta(l1On, l1Base, cam, out l1Pod, out lum, out warm,
                LabsRules.Pos(podIdx).x, LabsRules.Pos(podIdx).y,
                LabsRules.WorldW(podIdx) / 2f + 0.4f, LabsRules.WorldH(podIdx) / 2f + 0.4f);
            RectWinDelta(l1On, l1Base, cam, out l1Run, out lum, out warm, runCx, runCy, runHw, runHh);
            RectWinDelta(l1On, l1Base, cam, out l1Stub, out lum, out warm, stubCx, stubCy, stubHw, stubHh);
            RectWinDelta(l1On, l1Base, cam, out l1Bir, out lum, out warm,
                LabsRules.Pos(birthIdx).x, LabsRules.Pos(birthIdx).y,
                LabsRules.WorldW(birthIdx) / 2f + 0.4f, LabsRules.WorldH(birthIdx) / 2f + 0.4f);
            Chk(l1Pod >= 400, "pod invisible in the L1 labs street view: " + l1Pod + "px");
            Chk(l1Run >= 400, "conduit invisible in the L1 labs street view: " + l1Run + "px");
            Chk(l1Stub >= 60, "stub invisible in the L1 labs street view: " + l1Stub + "px");
            Chk(l1Bir >= 150, "birth-1u invisible in the L1 labs street view: " + l1Bir + "px");
            // sandbox west L1 delta pair (unsaved evidence frame; the S4 piece
            // sits outside the east street frame - cam -5.5,5, same |camX| law)
            cam.transform.position = new Vector3(-5.5f, 5f, origPos.z);
            SetLabs(labGos, false);
            Texture2D wBase = Shot(cam, null);
            SetLabs(labGos, true);
            Texture2D wOn = Shot(cam, null);
            int l1Sbx; float wLum, wWarm;
            RectWinDelta(wOn, wBase, cam, out l1Sbx, out wLum, out wWarm,
                LabsRules.Pos(sbxIdx).x, LabsRules.Pos(sbxIdx).y,
                LabsRules.WorldW(sbxIdx) / 2f + 0.4f, LabsRules.WorldH(sbxIdx) / 2f + 0.4f);
            Chk(l1Sbx >= 100, "sandbox-1u invisible in the west L1 street view: " + l1Sbx + "px");
            UnityEngine.Object.DestroyImmediate(wBase); UnityEngine.Object.DestroyImmediate(wOn);
            // restore the camera (scene was saved in section C; no save after renders)
            cam.orthographicSize = origSize;
            cam.transform.position = origPos;

            // ---- D-temporal (r189): live temporal faces in every L0 tier ----
            // baseline = the grandfather face (ApplyState(null) hides the
            // readouts + wall); ON = the live state. The readouts are
            // constant-alpha emitted light - the ambient tint shades them
            // like every world object, zero tier modulation (D-02).
            CityLabsTemporal tmpR = CityLabsTemporal.EnsureRoot();
            tmpR.ApplyState(null);
            amb.ApplyAmbient(AmbientTier.Day);
            Texture2D tDayOff = Shot(cam, null);
            tmpR.ApplyState(live);
            Texture2D tDayOn = Shot(cam, "m1-r189-temporal-day.png");
            int rBirD, rSbxD; float rl2, rw2;
            RectWinDelta(tDayOn, tDayOff, cam, out rBirD, out rl2, out rw2,
                LabsTemporalRules.BirthReadoutCenter.x, LabsTemporalRules.BirthReadoutCenter.y, 1.14f, 0.36f);
            RectWinDelta(tDayOn, tDayOff, cam, out rSbxD, out rl2, out rw2,
                LabsTemporalRules.SbxReadoutCenter.x, LabsTemporalRules.SbxReadoutCenter.y, 0.62f, 0.36f);
            amb.ApplyAmbient(AmbientTier.Dusk);
            tmpR.ApplyState(null);
            Texture2D tDuskOff = Shot(cam, null);
            tmpR.ApplyState(live);
            Texture2D tDuskOn = Shot(cam, "m1-r189-temporal-dusk.png");
            int rBirK, rSbxK;
            RectWinDelta(tDuskOn, tDuskOff, cam, out rBirK, out rl2, out rw2,
                LabsTemporalRules.BirthReadoutCenter.x, LabsTemporalRules.BirthReadoutCenter.y, 1.14f, 0.36f);
            RectWinDelta(tDuskOn, tDuskOff, cam, out rSbxK, out rl2, out rw2,
                LabsTemporalRules.SbxReadoutCenter.x, LabsTemporalRules.SbxReadoutCenter.y, 0.62f, 0.36f);
            amb.ApplyAmbient(AmbientTier.Night);
            tmpR.ApplyState(null);
            Texture2D tNightOff = Shot(cam, null);
            tmpR.ApplyState(live);
            Texture2D tNightOn = Shot(cam, "m1-r189-temporal-night.png");
            int rBirN, rSbxN;
            RectWinDelta(tNightOn, tNightOff, cam, out rBirN, out rl2, out rw2,
                LabsTemporalRules.BirthReadoutCenter.x, LabsTemporalRules.BirthReadoutCenter.y, 1.14f, 0.36f);
            RectWinDelta(tNightOn, tNightOff, cam, out rSbxN, out rl2, out rw2,
                LabsTemporalRules.SbxReadoutCenter.x, LabsTemporalRules.SbxReadoutCenter.y, 0.62f, 0.36f);
            // the L1 temporal street frame (dusk tier, r44 harmony kin): cam
            // (19,6) - the r187 street view lifted 1u so the floating readout
            // (top y 14.358) sits inside the 18u-tall L1 frame; carries the
            // ceremony TriggerDirect frame (chamber glow + newest burst)
            cam.orthographicSize = RigMath.L1Size;
            cam.transform.position = new Vector3(19f, 6f, origPos.z);
            tmpR.ApplyState(null);
            Texture2D tL1Off = Shot(cam, null);
            tmpR.ApplyState(live);
            tmpR.TriggerPulse(LabsTemporalRules.CeremonyEvent);
            Texture2D tL1On = Shot(cam, "m1-r189-temporal-l1-north.png");
            int rBirL1, rWallL1;
            RectWinDelta(tL1On, tL1Off, cam, out rBirL1, out rl2, out rw2,
                LabsTemporalRules.BirthReadoutCenter.x, LabsTemporalRules.BirthReadoutCenter.y, 1.14f, 0.36f);
            RectWinDelta(tL1On, tL1Off, cam, out rWallL1, out rl2, out rw2, 23.5f, 10.2f, 0.6f, 0.85f);
            Chk(rBirD >= 25, "birth readout invisible in the day L0 frame: " + rBirD + "px");
            Chk(rSbxD >= 8, "sandbox readout invisible in the day L0 frame: " + rSbxD + "px");
            Chk(rBirK >= 20, "birth readout invisible at dusk: " + rBirK + "px");
            Chk(rSbxK >= 6, "sandbox readout invisible at dusk: " + rSbxK + "px");
            Chk(rBirN >= 8, "birth readout invisible at night: " + rBirN + "px");
            Chk(rSbxN >= 3, "sandbox readout invisible at night: " + rSbxN + "px");
            Chk(rBirL1 >= 40, "birth readout invisible in the L1 temporal frame: " + rBirL1 + "px");
            Chk(rWallL1 >= 8, "wall overlays invisible in the L1 temporal frame: " + rWallL1 + "px");
            // restore + save purity (the mounts never reach the disk scene)
            cam.orthographicSize = origSize;
            cam.transform.position = origPos;
            tmpR.Step(LabsTemporalRules.CeremonyDuration + 0.01f);
            tmpR.ReleaseMounts();
            Chk(CountPrefix("LabTmp") == 0, "temporal mounts survived ReleaseMounts (r146 law)");
            UnityEngine.Object.DestroyImmediate(tDayOff); UnityEngine.Object.DestroyImmediate(tDayOn);
            UnityEngine.Object.DestroyImmediate(tDuskOff); UnityEngine.Object.DestroyImmediate(tDuskOn);
            UnityEngine.Object.DestroyImmediate(tNightOff); UnityEngine.Object.DestroyImmediate(tNightOn);
            UnityEngine.Object.DestroyImmediate(tL1Off); UnityEngine.Object.DestroyImmediate(tL1On);

            UnityEngine.Object.DestroyImmediate(dayBase); UnityEngine.Object.DestroyImmediate(dayOn);
            UnityEngine.Object.DestroyImmediate(duskBase); UnityEngine.Object.DestroyImmediate(duskOn);
            UnityEngine.Object.DestroyImmediate(nightBase); UnityEngine.Object.DestroyImmediate(nightOn);
            UnityEngine.Object.DestroyImmediate(l1Base); UnityEngine.Object.DestroyImmediate(l1On);

            return "asserts=" + asserts
                + " table=" + LabsRules.Count + "(pod" + LabsRules.PodCount + "+run" + LabsRules.RunCount
                + "+stub" + LabsRules.StubCount + "+birth" + LabsRules.BirthCount
                + "+sandbox" + LabsRules.SandboxCount + ")"
                + " census(props=" + propCells + ",south_tiles=" + q0 + "/" + g0 + "/" + m0 + ",anchors=4/4)"
                + " scene(saved=" + saved + "," + LabsRules.Count + " persisted,neon" + neonKept
                + "_robot" + robotKept + "_res" + resKept + "_tag" + tagKept + "_veh" + vehKept
                + "_off" + offKept + "_ter" + terKept + ")"
                + " render(day=" + podD + "/" + runD + "/" + stubD + "/" + birD + "/" + sbxD
                + " dusk=" + podK + "/" + runK + "/" + stubK + "/" + birK + "/" + sbxK
                + " night=" + podN + "/" + runN + "/" + stubN + "/" + birN + "/" + sbxN
                + " lum day=" + podDayLum.ToString("F3") + " dusk=" + podDuskLum.ToString("F3")
                + " night=" + podNightLum.ToString("F3")
                + " warm day=" + podDayWarm.ToString("F3") + " dusk=" + podDuskWarm.ToString("F3")
                + " l1=" + l1Pod + "/" + l1Run + "/" + l1Stub + "/" + l1Bir + "/" + l1Sbx + ")"
                + " temporal(live=" + live.censusTotal + "/open" + live.openProposals
                + "/wall" + wallLive + "lit" + expectLit
                + " render day=" + rBirD + "/" + rSbxD + " dusk=" + rBirK + "/" + rSbxK
                + " night=" + rBirN + "/" + rSbxN + " l1=" + rBirL1 + "/" + rWallL1 + ")"
                + " shots=4(+1 unsaved west pair)";
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
            string[] spot = { LabsRules.PodPath, LabsRules.PipeHPath, LabsRules.PipeVPath,
                              LabsRules.BirthPath, LabsRules.SandboxPath };
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
            // r189 temporal reload face: the root survives, the mounts never do
            GameObject tgo = GameObject.Find(CityLabsTemporal.GoName);
            Chk(tgo != null, "CityLabsTemporal root GO lost across the editor restart");
            CityLabsTemporal ttmp = tgo != null ? tgo.GetComponent<CityLabsTemporal>() : null;
            Chk(ttmp != null, "CityLabsTemporal component lost across the editor restart");
            Chk(CountPrefix("LabTmp") == 0,
                "LabTmp runtime mounts persisted across the restart (r146 disk-purity law)");
            TextureImporter dImp = (TextureImporter)TextureImporter.GetAtPath(LabsTemporalRules.DigitsPath);
            Chk(dImp != null && dImp.textureType == TextureImporterType.Sprite, "digits importer type lost");
            Chk(dImp != null && dImp.filterMode == FilterMode.Point, "digits point filter lost");
            Chk(dImp != null && Mathf.Abs(dImp.spritePixelsPerUnit - 24f) < 0.01f, "digits PPU24 lost");
            Chk(dImp != null && !dImp.mipmapEnabled, "digits mips re-enabled");
            TemporalSnapshot rl3 = LabsTemporalRules.LoadStateFile();
            Chk(rl3 != null && rl3.hasCensus && rl3.hasEvolution, "live temporal legs missing at reload");
            if (ttmp != null)
            {
                ttmp.ApplyState(rl3);
                Chk(ttmp.BirthVisible && ttmp.SbxVisible,
                    "temporal readouts failed to re-apply after the restart");
                Chk(ttmp.BirthValue == rl3.censusTotal && ttmp.SbxValue == rl3.openProposals,
                    "temporal live values lost after the restart");
                ttmp.ReleaseMounts();
            }
            return "reload_gate=OK labs=" + CountLabs() + "/" + LabsRules.Count
                + " persisted south_tiles=" + q + "/" + g + "/" + m
                + " importers=sprite+point+ppu24+nemip neon=" + neonKept + "/" + NeonRules.Count
                + " offices=" + offKept + "/" + OfficeRules.Count
                + " terraces=" + terKept + "/" + OfficeRules.GroundCount
                + " residents=" + resKept + "/" + ResidentRules.Count
                + " cam_L0=" + (cam != null ? cam.orthographicSize.ToString("F1") : "?");
        }

        static void CheckPavement(Tilemap ground, Tilemap roads, Tilemap water, int cx, int cy, string what)
        {
            Vector3Int uc = new Vector3Int(cx, cy, 0);
            Chk(ground.GetTile(uc) != null, what + " cell off the pavement at " + uc);
            Chk(roads.GetTile(uc) == null, what + " sits on a road cell at " + uc);
            Chk(water.GetTile(uc) == null, what + " sits on a water cell at " + uc);
        }

        // sweep every root-level Lab* GO (all four name families), then build
        // the 14 from the table (fresh LoadAssetAtPath at every use = r10 law)
        static void BuildLabs()
        {
            foreach (Transform t in UnityEngine.Object.FindObjectsOfType<Transform>())
                if (t.parent == null && LabsRules.IsLabsName(t.name))
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
                if (LabsRules.IsLabsName(sr.name)) c++;
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
