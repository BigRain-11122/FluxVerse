// FluxVerse P-69 slice (r112): batch proof for the street office band v1
// (office-ladder consumption, law = Tools/city/officeband-manifest.json r111
// sandbox, 1072 assertions; provenance = TECH sec.9 P-69 r110/r111 rows).
// r138 extension: the Ground terrace family (law = Tools/city/
// terraces-manifest.json, the r137 939-assertion sandbox) - A2 table gates
// (door law / north ban / 6u MEDIA tier hierarchy), census + eave-slot
// protection, ground asset gate, build/persist + reload survival, render
// gates + the L1 west street-front door view (m1-r138-terrace-* set).
// Sentinel pattern (r35..r110 style):
//   pass 1: logs/office.run         -> FluxVerse.OfficeProof.BatchRun   -> logs/office.done
//   pass 2: logs/office-reload.run -> FluxVerse.OfficeProof.ReloadGate -> logs/office-reload.done
// Sections (C# proof-mirror law r103: every gate mirrors the r111 sandbox):
//  A pure-core gates (headless): 5-entry table, office-ladder paths, mirror
//    flag<->path law, 144x96 px pin, world==px/PPU24 (6x4u), integer cell
//    boundaries, band laws (south rows -16..-13 top<=-8, north rows 9..12
//    cap 13 < brain 15), static L0 frame +-35.256, vcol/river protected,
//    tint band, 10-pair mutual non-overlap, N4/Buildings[3] registered
//    zero-gap side touch, hierarchy (4u < 6u MEDIA/brain < 8u QUANT),
//    zero-encroachment census vs the live single sources (NeonRules 8
//    mounting buildings + 18 signs, ResidentRules 32 seats x body/shadow/
//    plate rects, RobotRules 8 x body/shadow, VehicleRules 8, InteriorWindow
//    registry, 4 anchor canon points), detector positive controls (the three
//    r111 rejected windows genuinely fire), AmbientProof far-shore strip
//    re-derivation (A7), asset on-disk pins.
//  B asset gate: Sprite+Single+Point+PPU24+no-mips forced on BOTH files (the
//    r34 importer-default disease law), rect==manifest px, natural bounds
//    == world size, mirror byte-law spot check vs the source sprite.
//  C CityScene wiring: live props-tilemap census (32 cells) + live anchor GOs
//    == canon, south city tile counts 40/31/36 (no-tilemap-delta law - the
//    band is a SPRITE family, city tilemaps are never painted), stale Office*
//    sweep -> 5 GOs from the table (fresh LoadAssetAtPath, r10 law) ->
//    idempotent second build -> GO pos==rect center, localScale 1, order 3 ->
//    save -> disk round-trip -> neighbor regressions (r35 neon, r36 robots,
//    r99 residents/tags, r93 vehicles, r42/r43 adapters, r31 bed, r34
//    skyline, r17 interior, r14 rig, runtime-only laws).
//  D render gates (dusk anchor + night + day tint law + two L1 street views):
//    per-office window delta vs offices-hidden baselines (clean attribution),
//    dusk/night visibility, atmosphere law night<dusk, and the mechanical face
//    of the r44 harmony gate: dayLum > duskLum > nightLum (the AA-016
//    daytime-flat family must sit under the ambient tint, never raw).
//    Screenshots: docs/design/m1-r112-officeband-{day,dusk,night,l1-south,
//    l1-north}.png (the dusk shot is the r44 harmony evidence; the L1 pair
//    feeds the R- sec.3 door-face rescan).
//  E pass 2: everything survives an editor restart (persisted GOs, importer
//    settings, exactly 5, zero duplicates, neighbors intact).
// Fail-loud: any broken assumption throws into the .done report. ASCII only. No 3D.
using System;
using System.Collections.Generic;
using System.IO;
using UnityEngine;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine.SceneManagement;
using UnityEngine.Tilemaps;

namespace FluxVerse
{
    public static class OfficeProof
    {
        static string ProjectRoot { get { return Path.GetDirectoryName(Application.dataPath); } }
        static string RepoRoot { get { return Path.GetDirectoryName(ProjectRoot); } }
        static string RunPath { get { return Path.Combine(RepoRoot, "logs", "office.run"); } }
        static string DonePath { get { return Path.Combine(RepoRoot, "logs", "office.done"); } }
        static string ReloadRunPath { get { return Path.Combine(RepoRoot, "logs", "office-reload.run"); } }
        static string ReloadDonePath { get { return Path.Combine(RepoRoot, "logs", "office-reload.done"); } }
        static string ScenePath { get { return "Assets/Scenes/CityScene.unity"; } }
        static int asserts;

        // r111 anchor canon (CitySkeletonBuilder MakeAnchor calls - live-checked in C).
        // r133 fix: BrainTower (0,11) -> (0.5,14) per tower-v2 manifest item 5 -
        // the r132 re-anchor updated the builder but missed this canon (office
        // pass red). Zone anchors unmoved.
        static readonly Vector2[] AnchorCanon =
        {
            new Vector2(0.5f, 14f),     // BrainTower (tower-v2 visual center)
            new Vector2(-20.5f, -11f), // Zone_GAME
            new Vector2(0.5f, -12f),   // Zone_QUANT
            new Vector2(22f, -11f),    // Zone_MEDIA
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

        // does the open rect (x0,y0,x1,y1) contain the point? (strict, r111 law)
        static bool ContainsPoint(float x0, float y0, float x1, float y1, float px, float py)
        {
            return x0 < px && px < x1 && y0 < py && py < y1;
        }

        static string Prove()
        {
            // ---- A. pure-core gates on the table (r111 sandbox mirror) ----
            Chk(OfficeRules.Count == 5, "manifest must hold 5 offices");
            Chk(OfficeRules.Order == 3, "building layer order must be 3 (base tilemaps <= 3 < props 4)");
            Chk(OfficeRules.PPU == 24f, "PPU24 divisor law (r102 office-ladder importer row)");
            for (int i = 0; i < OfficeRules.Count; i++)
            {
                string id = OfficeRules.Name(i);
                Chk(id != null && id.StartsWith(OfficeRules.NamePrefix), "bad GO name at " + i);
                Chk(OfficeRules.Path(i).StartsWith("Assets/ArtPacks/office-ladder/"),
                    "office path outside the office-ladder pack: " + OfficeRules.Path(i));
                // mirror flag <-> resolved path law (r93 pixel-exact mirror)
                Chk(OfficeRules.IsMirror(i) ? OfficeRules.Path(i) == OfficeRules.MirrorPath
                                            : OfficeRules.Path(i) == OfficeRules.SrcPath,
                    "mirror flag does not match the resolved path at " + id);
                Chk(OfficeRules.PxW(i) == 144 && OfficeRules.PxH(i) == 96,
                    "condo frame drift (pack layout changed): " + id + " "
                    + OfficeRules.PxW(i) + "x" + OfficeRules.PxH(i));
                Chk(Math.Abs(OfficeRules.WorldW(i) - OfficeRules.PxW(i) / OfficeRules.PPU) < 1e-5f
                    && Math.Abs(OfficeRules.WorldH(i) - OfficeRules.PxH(i) / OfficeRules.PPU) < 1e-5f,
                    "world size != px/PPU24 at " + id);
                // integer cell boundaries (cells -> world law)
                float x0 = OfficeRules.X0(i), y0 = OfficeRules.Y0(i), x1 = OfficeRules.X1(i), y1 = OfficeRules.Y1(i);
                Chk(Math.Abs(x0 - Mathf.Round(x0)) < 1e-5f && Math.Abs(y0 - Mathf.Round(y0)) < 1e-5f
                    && Math.Abs(x1 - Mathf.Round(x1)) < 1e-5f && Math.Abs(y1 - Mathf.Round(y1)) < 1e-5f,
                    "non-integer cell boundary at " + id);
                // bank laws
                if (OfficeRules.IsNorth(i))
                {
                    Chk(y0 >= 9f - 1e-5f, "north office below the walkway floor: " + id);
                    Chk(y1 <= OfficeRules.NorthCapTop + 1e-5f, "north cap breach (top <= 13): " + id);
                    Chk(y1 < OfficeRules.BrainTop, "north office challenges the brain tower (sole commanding): " + id);
                }
                else
                {
                    Chk(Math.Abs(y0 - OfficeRules.TintFloorY) < 1e-5f, "south office must sit on the band floor -16: " + id);
                    Chk(y1 <= OfficeRules.SouthTopMax + 1e-5f, "south top edge breach (<= -8): " + id);
                }
                // frame / tint / protected surfaces
                Chk(OfficeRules.InFrame(i), "office escapes the static L0 frame: " + id);
                Chk(OfficeRules.InTintBand(i), "office escapes the tint band (r22 edge-band kin): " + id);
                Chk(!Overlap(x0, y0, x1, y1, -18f, -50f, -16f, 50f), "vcol-west road encroached: " + id);
                Chk(!Overlap(x0, y0, x1, y1, 16f, -50f, 18f, 50f), "vcol-east road encroached: " + id);
                Chk(!Overlap(x0, y0, x1, y1, -50f, -3f, 50f, 3f), "river rows encroached: " + id);
                // hierarchy: office 4u never competes with landmarks
                float hgt = y1 - y0;
                Chk(Math.Abs(hgt - 4f) < 1e-5f, "office height must be the 4u low tier: " + id);
                Chk(hgt < 6f, "office towers over MEDIA/brain 6u: " + id);
                Chk(hgt < 8f, "office towers over QUANT 8u: " + id);
            }
            // names unique + Office01..05 pattern
            for (int i = 0; i < OfficeRules.Count; i++)
                for (int j = i + 1; j < OfficeRules.Count; j++)
                    Chk(OfficeRules.Name(i) != OfficeRules.Name(j), "duplicate GO name in the office table");
            // mutual non-overlap (10 pairs)
            for (int i = 0; i < OfficeRules.Count; i++)
                for (int j = i + 1; j < OfficeRules.Count; j++)
                    Chk(!Overlap(OfficeRules.X0(i), OfficeRules.Y0(i), OfficeRules.X1(i), OfficeRules.Y1(i),
                                 OfficeRules.X0(j), OfficeRules.Y0(j), OfficeRules.X1(j), OfficeRules.Y1(j)),
                        "two offices overlap: " + OfficeRules.Name(i) + "<->" + OfficeRules.Name(j));
            // registered side adjacency: N4 west face touches Buildings[3] east face at x=29
            NeonRules.Building b3 = NeonRules.BuildingAt(3);
            int n4 = -1;
            for (int i = 0; i < OfficeRules.Count; i++) if (OfficeRules.Name(i) == "Office05") n4 = i;
            Chk(n4 >= 0, "Office05 (N4) missing from the table");
            Chk(!Overlap(OfficeRules.X0(n4), OfficeRules.Y0(n4), OfficeRules.X1(n4), OfficeRules.Y1(n4),
                         b3.x0, b3.y0, b3.x1, b3.y1), "N4/Buildings[3] must touch, never overlap");
            Chk(Math.Abs(OfficeRules.X0(n4) - b3.x1) < 1e-5f,
                "N4/Buildings[3] registered zero-gap touch must sit exactly at x=" + b3.x1);

            // ---- A2. ground terrace gates (r137 sandbox mirror, Tools/city/terraces-manifest.json) ----
            Chk(OfficeRules.GroundCount >= 1, "ground terrace table empty (r138 law)");
            for (int g = 0; g < OfficeRules.GroundCount; g++)
            {
                string gid = OfficeRules.GroundName(g);
                Chk(gid != null && gid.StartsWith(OfficeRules.GroundPrefix), "bad terrace GO name: " + gid);
                Chk(OfficeRules.GroundPath(g).StartsWith("Assets/ArtPacks/office-ladder/"),
                    "terrace path outside the office-ladder pack: " + OfficeRules.GroundPath(g));
                Chk(OfficeRules.GroundPxW(g) == 48 && OfficeRules.GroundPxH(g) == 144,
                    "ground slab frame drift (pack layout changed): " + gid + " "
                    + OfficeRules.GroundPxW(g) + "x" + OfficeRules.GroundPxH(g));
                Chk(Math.Abs(OfficeRules.GroundWorldW(g) - OfficeRules.GroundPxW(g) / OfficeRules.PPU) < 1e-5f
                    && Math.Abs(OfficeRules.GroundWorldH(g) - OfficeRules.GroundPxH(g) / OfficeRules.PPU) < 1e-5f,
                    "world size != px/PPU24 at " + gid);
                float gx0 = OfficeRules.GroundX0(g), gy0 = OfficeRules.GroundY0(g);
                float gx1 = OfficeRules.GroundX1(g), gy1 = OfficeRules.GroundY1(g);
                Chk(Math.Abs(gx0 - Mathf.Round(gx0)) < 1e-5f && Math.Abs(gy0 - Mathf.Round(gy0)) < 1e-5f
                    && Math.Abs(gx1 - Mathf.Round(gx1)) < 1e-5f && Math.Abs(gy1 - Mathf.Round(gy1)) < 1e-5f,
                    "non-integer cell boundary at " + gid);
                // the Ground family is river-north BANNED (law.north_ban)
                Chk(!OfficeRules.GroundIsNorth(g), "Ground module north of the river (6u breaches the 2-4u cap): " + gid);
                Chk(Math.Abs(gy0 - OfficeRules.TintFloorY) < 1e-5f, "terrace must sit on the band floor -16: " + gid);
                Chk(gy1 <= OfficeRules.SouthTopMax + 1e-5f, "terrace top edge breach (<= -8): " + gid);
                // hierarchy: 6u = the MEDIA storefront tier; top -10 < MEDIA -8 < QUANT 128px < brain 160px
                float gh = gy1 - gy0;
                Chk(Math.Abs(gh - 6f) < 1e-5f, "terrace height must be the 6u storefront tier: " + gid);
                Chk(gh < 8f, "terrace towers over QUANT 8u: " + gid);
                Chk(gy1 < OfficeRules.SouthTopMax - 1e-5f,
                    "terrace top must clear the canopy line strictly (hierarchy -10 < -8): " + gid);
                // door law (r136 census): the Ground family door >= 1.5x the resident line
                Chk(OfficeRules.DoorHeightPx / OfficeRules.PPU >= 1.5f * ResidentRules.WorldW(0) - 1e-5f,
                    "terrace door below the 1.5x law: " + (OfficeRules.DoorHeightPx / OfficeRules.PPU).ToString("F2")
                    + "u vs resident " + ResidentRules.WorldW(0).ToString("F2") + "u");
                Chk(OfficeRules.GroundInFrame(g), "terrace escapes the static L0 frame: " + gid);
                Chk(OfficeRules.GroundInTintBand(g), "terrace escapes the tint band: " + gid);
                Chk(!Overlap(gx0, gy0, gx1, gy1, -18f, -50f, -16f, 50f), "vcol-west road encroached: " + gid);
                Chk(!Overlap(gx0, gy0, gx1, gy1, 16f, -50f, 18f, 50f), "vcol-east road encroached: " + gid);
                Chk(!Overlap(gx0, gy0, gx1, gy1, -50f, -3f, 50f, 3f), "river rows encroached: " + gid);
            }
            // office <-> terrace mutual non-overlap
            for (int i = 0; i < OfficeRules.Count; i++)
                for (int g = 0; g < OfficeRules.GroundCount; g++)
                    Chk(!Overlap(OfficeRules.X0(i), OfficeRules.Y0(i), OfficeRules.X1(i), OfficeRules.Y1(i),
                                 OfficeRules.GroundX0(g), OfficeRules.GroundY0(g), OfficeRules.GroundX1(g), OfficeRules.GroundY1(g)),
                        "terrace clips office: " + OfficeRules.Name(i) + "<->" + OfficeRules.GroundName(g));

            // zero-encroachment census vs every live single source (r111 A3;
            // r138: the terraces join the census and the 2 eave slots join the
            // protected stand positions - manifest coupled_updates census)
            for (int i = 0; i < OfficeRules.Count; i++)
                CensusOne(OfficeRules.X0(i), OfficeRules.Y0(i), OfficeRules.X1(i), OfficeRules.Y1(i), OfficeRules.Name(i));
            for (int g = 0; g < OfficeRules.GroundCount; g++)
                CensusOne(OfficeRules.GroundX0(g), OfficeRules.GroundY0(g), OfficeRules.GroundX1(g), OfficeRules.GroundY1(g),
                          OfficeRules.GroundName(g));
            // detector positive controls (the r111 rejected windows genuinely fire)
            int g07 = -1, bus = -1, kiosk = -1;
            for (int s = 0; s < ResidentRules.Count; s++) if (ResidentRules.Name(s) == "ResG07") g07 = s;
            for (int v = 0; v < VehicleRules.Count; v++) if (VehicleRules.Name(v) == "VehicleBusN") bus = v;
            for (int g = 0; g < NeonRules.Count; g++) if (NeonRules.Name(g) == "NeonKiosk") kiosk = g;
            Chk(g07 >= 0 && bus >= 0 && kiosk >= 0, "detector fixtures missing from the live tables");
            Vector2 g7 = ResidentRules.Pos(g07); float g7h = ResidentRules.WorldW(g07) / 2f;
            Chk(Overlap(-35f, -16f, -29f, -12f, g7.x - g7h, g7.y - g7h, g7.x + g7h, g7.y + g7h),
                "west-outer south window must be blocked by ResG07 (detector positive)");
            float bw = VehicleRules.WorldW(bus) / 2f, bh = VehicleRules.WorldH(bus);
            float bx = VehicleRules.Pos(bus).x, by = VehicleRules.FeetY(bus);
            Chk(Overlap(11f, 9f, 17f, 13f, bx - bw, by, bx + bw, by + bh),
                "north east-central window must be blocked by the bus (detector positive)");
            Vector2 kc = NeonRules.Pos(kiosk);
            float kw = NeonRules.WorldW(kiosk) / 2f, kh = NeonRules.WorldH(kiosk) / 2f;
            Chk(Overlap(3f, -16f, 9f, -12f, kc.x - kw, kc.y - kh, kc.x + kw, kc.y + kh),
                "south-central window must be blocked by the kiosk (detector positive)");
            // A7: AmbientProof far-shore strip re-derivation (r51 disease site)
            int farHits = 0;
            for (int i = 0; i < OfficeRules.Count; i++)
                if (Overlap(OfficeRules.X0(i), OfficeRules.Y0(i), OfficeRules.X1(i), OfficeRules.Y1(i),
                           -24.44f, 14.26f, 23.70f, 14.74f)) farHits++;
            Chk(farHits == 0, "far-shore strip window touched by a placement (A7)");
            // asset pins on disk
            Chk(File.Exists(Path.Combine(ProjectRoot, OfficeRules.SrcPath)), "source condo missing on disk");
            Chk(File.Exists(Path.Combine(ProjectRoot, OfficeRules.MirrorPath)), "mirror condo missing on disk");
            Chk(File.Exists(Path.Combine(ProjectRoot, OfficeRules.GroundSrcPath)), "ground slab missing on disk");

            // ---- B. asset gate: importer laws on both files (idempotent) ----
            for (int f = 0; f < 2; f++)
            {
                string path = f == 0 ? OfficeRules.SrcPath : OfficeRules.MirrorPath;
                Sprite sp = ForceSprite(path);
                Chk(sp != null, "sprite failed to load: " + path);
                Chk(Math.Abs(sp.rect.width - 144f) < 0.5f && Math.Abs(sp.rect.height - 96f) < 0.5f,
                    "rect != 144x96 at " + path + ": " + sp.rect.width + "x" + sp.rect.height);
                Chk(Math.Abs(sp.bounds.size.x - 6f) < 0.01f && Math.Abs(sp.bounds.size.y - 4f) < 0.01f,
                    "natural bounds != 6x4u at " + path);
            }
            // mirror byte-law spot check: mirror(x,y) == src(143-x,y) at 24 samples
            Texture2D srcTex = LoadPng(Path.Combine(ProjectRoot, OfficeRules.SrcPath));
            Texture2D mirTex = LoadPng(Path.Combine(ProjectRoot, OfficeRules.MirrorPath));
            Chk(srcTex != null && mirTex != null, "png load failed for the mirror law check");
            Chk(srcTex.width == 144 && srcTex.height == 96 && mirTex.width == 144 && mirTex.height == 96,
                "mirror law check dims wrong: " + srcTex.width + "x" + srcTex.height + " vs " + mirTex.width + "x" + mirTex.height);
            int samples = 0;
            for (int k = 0; k < 24; k++)
            {
                int x = (k * 29) % 144, y = (k * 37) % 96;
                Color a = srcTex.GetPixel(143 - x, y);
                Color b = mirTex.GetPixel(x, y);
                Chk(Math.Abs(a.r - b.r) < 0.004f && Math.Abs(a.g - b.g) < 0.004f
                    && Math.Abs(a.b - b.b) < 0.004f && Math.Abs(a.a - b.a) < 0.004f,
                    "mirror byte law violated at (" + x + "," + y + ")");
                samples++;
            }
            Chk(samples == 24, "mirror spot check did not run");
            UnityEngine.Object.DestroyImmediate(srcTex);
            UnityEngine.Object.DestroyImmediate(mirTex);

            // ground slab asset gate (r138): same importer law family, 48x144 pin
            Sprite gsp = ForceSprite(OfficeRules.GroundSrcPath);
            Chk(gsp != null, "ground slab sprite failed to load: " + OfficeRules.GroundSrcPath);
            Chk(Math.Abs(gsp.rect.width - 48f) < 0.5f && Math.Abs(gsp.rect.height - 144f) < 0.5f,
                "ground rect != 48x144: " + gsp.rect.width + "x" + gsp.rect.height);
            Chk(Math.Abs(gsp.bounds.size.x - 2f) < 0.01f && Math.Abs(gsp.bounds.size.y - 6f) < 0.01f,
                "ground natural bounds != 2x6u: " + gsp.bounds.size.x.ToString("F2") + "x" + gsp.bounds.size.y.ToString("F2"));

            // ---- C. CityScene wiring: live census -> sweep -> build -> idempotent -> save ----
            Scene scene = EditorSceneManager.OpenScene(ScenePath, OpenSceneMode.Single);
            Chk(scene.isLoaded, "CityScene failed to open");
            // live props census (the Props tilemap IS the props single source)
            Tilemap props = TilemapByName("Props");
            Chk(props != null, "Props tilemap missing");
            int propCells = 0;
            List<Vector3Int> cells = new List<Vector3Int>();
            foreach (Vector3Int p in props.cellBounds.allPositionsWithin)
                if (props.GetTile(p) != null) { propCells++; cells.Add(p); }
            // r132 tower-v2: +12 data-band/pipe cells on the Props layer (6 band
            // cells rows 11/16 + 4 indicator singles + 2 plinth pipe boxes,
            // tower-v2-manifest data_bands law) -> r111 canon 32 + 12 = 44
            Chk(propCells == 44, "props cell census != 44 (r111 canon 32 + tower-v2 12): " + propCells);
            for (int i = 0; i < OfficeRules.Count; i++)
                for (int c = 0; c < cells.Count; c++)
                    Chk(!Overlap(OfficeRules.X0(i), OfficeRules.Y0(i), OfficeRules.X1(i), OfficeRules.Y1(i),
                                 cells[c].x, cells[c].y, cells[c].x + 1, cells[c].y + 1),
                        "office " + OfficeRules.Name(i) + " clips props cell (" + cells[c].x + "," + cells[c].y + ")");
            for (int g = 0; g < OfficeRules.GroundCount; g++)
                for (int c = 0; c < cells.Count; c++)
                    Chk(!Overlap(OfficeRules.GroundX0(g), OfficeRules.GroundY0(g), OfficeRules.GroundX1(g), OfficeRules.GroundY1(g),
                                 cells[c].x, cells[c].y, cells[c].x + 1, cells[c].y + 1),
                        "terrace " + OfficeRules.GroundName(g) + " clips props cell (" + cells[c].x + "," + cells[c].y + ")");
            // live anchor GOs == canon (BrainTower anchor = the non-tilemap GO of the two)
            for (int a = 1; a <= 3; a++)
            {
                string nm = a == 1 ? "Zone_GAME" : a == 2 ? "Zone_QUANT" : "Zone_MEDIA";
                GameObject go = GameObject.Find(nm);
                Chk(go != null, "anchor GO missing: " + nm);
                if (go != null)
                    Chk(Math.Abs(go.transform.position.x - AnchorCanon[a].x) < 1e-4f
                        && Math.Abs(go.transform.position.y - AnchorCanon[a].y) < 1e-4f,
                        "anchor GO off canon: " + nm + " " + go.transform.position.ToString("F2"));
            }
            GameObject brainAnchor = null;
            foreach (GameObject root in scene.GetRootGameObjects())
                if (root.name == "BrainTower" && root.GetComponent<Tilemap>() == null) brainAnchor = root;
            Chk(brainAnchor != null, "BrainTower anchor GO missing (the non-tilemap one)");
            if (brainAnchor != null)
                Chk(Math.Abs(brainAnchor.transform.position.x - AnchorCanon[0].x) < 1e-4f
                    && Math.Abs(brainAnchor.transform.position.y - AnchorCanon[0].y) < 1e-4f,
                    "BrainTower anchor off canon: " + brainAnchor.transform.position.ToString("F2"));
            // south city tile counts = the no-tilemap-delta law (sprite family,
            // never painted). Canon re-derived live at r112: full-layer truth is
            // 40/49/54 - the r105 row's "40/31/36" was the REPAINT batch tally,
            // not the whole-layer counts (manifest authoring slip, honest note).
            int q0 = TileCount("CityQUANT"), g0 = TileCount("CityGAME"), m0 = TileCount("CityMEDIA");
            Chk(q0 == 40 && g0 == 49 && m0 == 54, "south city tile counts off canon pre-build: "
                + q0 + "/" + g0 + "/" + m0);
            BuildOffices();
            BuildOffices();   // idempotency: the second sweep+build must land on exactly Count
            Chk(CountOffices() == OfficeRules.Count, "idempotent rebuild count != table: " + CountOffices());
            for (int i = 0; i < OfficeRules.Count; i++)
            {
                GameObject go = GameObject.Find(OfficeRules.Name(i));
                Chk(go != null, "office GO missing pre-save: " + OfficeRules.Name(i));
                SpriteRenderer sr = go.GetComponent<SpriteRenderer>();
                Chk(sr != null && sr.sprite != null, "office sprite unresolved pre-save: " + OfficeRules.Name(i));
                Chk(sr.sortingOrder == OfficeRules.Order, "office order lost: " + OfficeRules.Name(i));
                Vector2 p = OfficeRules.Pos(i);
                Chk(Math.Abs(go.transform.position.x - p.x) < 1e-4f
                    && Math.Abs(go.transform.position.y - p.y) < 1e-4f,
                    "office GO pos != rect center: " + OfficeRules.Name(i));
                Chk(Math.Abs(go.transform.localScale.x - 1f) < 1e-5f
                    && Math.Abs(go.transform.localScale.y - 1f) < 1e-5f,
                    "office scale != 1 (sprite-family law): " + OfficeRules.Name(i));
            }
            // r138: terraces join the build (fresh LoadAssetAtPath, r10 law)
            BuildTerraces();
            BuildTerraces();   // idempotency: the second sweep+build must land on exactly GroundCount
            Chk(CountTerraces() == OfficeRules.GroundCount,
                "idempotent terrace rebuild count != table: " + CountTerraces());
            for (int g = 0; g < OfficeRules.GroundCount; g++)
            {
                GameObject go = GameObject.Find(OfficeRules.GroundName(g));
                Chk(go != null, "terrace GO missing pre-save: " + OfficeRules.GroundName(g));
                SpriteRenderer sr = go.GetComponent<SpriteRenderer>();
                Chk(sr != null && sr.sprite != null, "terrace sprite unresolved pre-save: " + OfficeRules.GroundName(g));
                Chk(sr.sortingOrder == OfficeRules.Order, "terrace order lost: " + OfficeRules.GroundName(g));
                Vector2 p = OfficeRules.GroundPos(g);
                Chk(Math.Abs(go.transform.position.x - p.x) < 1e-4f
                    && Math.Abs(go.transform.position.y - p.y) < 1e-4f,
                    "terrace GO pos != rect center: " + OfficeRules.GroundName(g));
                Chk(Math.Abs(go.transform.localScale.x - 1f) < 1e-5f
                    && Math.Abs(go.transform.localScale.y - 1f) < 1e-5f,
                    "terrace scale != 1 (sprite-family law): " + OfficeRules.GroundName(g));
            }
            bool saved = EditorSceneManager.SaveScene(scene);
            Chk(saved, "scene save failed");

            Scene reopened = EditorSceneManager.OpenScene(ScenePath, OpenSceneMode.Single);
            Chk(CountOffices() == OfficeRules.Count, "persisted office count != table: " + CountOffices());
            int q1 = TileCount("CityQUANT"), g1 = TileCount("CityGAME"), m1 = TileCount("CityMEDIA");
            Chk(q1 == q0 && g1 == g0 && m1 == m0, "no-tilemap-delta law breached by our save: "
                + q1 + "/" + g1 + "/" + m1);
            for (int i = 0; i < OfficeRules.Count; i++)
            {
                GameObject go = GameObject.Find(OfficeRules.Name(i));
                Chk(go != null, "office missing on disk: " + OfficeRules.Name(i));
                SpriteRenderer sr = go != null ? go.GetComponent<SpriteRenderer>() : null;
                Chk(sr != null && sr.sprite != null, "office sprite lost on disk: " + OfficeRules.Name(i));
                Chk(sr.sortingOrder == OfficeRules.Order, "office order lost on disk: " + OfficeRules.Name(i));
                Vector2 p = OfficeRules.Pos(i);
                Chk(Math.Abs(go.transform.position.x - p.x) < 1e-4f
                    && Math.Abs(go.transform.position.y - p.y) < 1e-4f,
                    "office position lost on disk: " + OfficeRules.Name(i));
                Chk(Math.Abs(sr.sprite.rect.width - 144f) < 0.5f
                    && Math.Abs(sr.sprite.rect.height - 96f) < 0.5f,
                    "persisted sprite rect drift: " + OfficeRules.Name(i));
            }
            // r138: terraces persisted on disk
            Chk(CountTerraces() == OfficeRules.GroundCount,
                "persisted terrace count != table: " + CountTerraces());
            for (int g = 0; g < OfficeRules.GroundCount; g++)
            {
                GameObject go = GameObject.Find(OfficeRules.GroundName(g));
                Chk(go != null, "terrace missing on disk: " + OfficeRules.GroundName(g));
                SpriteRenderer sr = go != null ? go.GetComponent<SpriteRenderer>() : null;
                Chk(sr != null && sr.sprite != null, "terrace sprite lost on disk: " + OfficeRules.GroundName(g));
                Chk(sr.sortingOrder == OfficeRules.Order, "terrace order lost on disk: " + OfficeRules.GroundName(g));
                Vector2 p = OfficeRules.GroundPos(g);
                Chk(Math.Abs(go.transform.position.x - p.x) < 1e-4f
                    && Math.Abs(go.transform.position.y - p.y) < 1e-4f,
                    "terrace position lost on disk: " + OfficeRules.GroundName(g));
                Chk(Math.Abs(sr.sprite.rect.width - 48f) < 0.5f
                    && Math.Abs(sr.sprite.rect.height - 144f) < 0.5f,
                    "persisted terrace sprite rect drift: " + OfficeRules.GroundName(g));
            }
            // neighbor regressions (our save must not drop earlier serialized wiring)
            int neonKept = 0, robotKept = 0, resKept = 0, tagKept = 0, vehKept = 0;
            foreach (SpriteRenderer sr in UnityEngine.Object.FindObjectsOfType<SpriteRenderer>())
            {
                if (sr.name.StartsWith(NeonRules.NamePrefix)) neonKept++;
                if (sr.name.StartsWith(RobotRules.NamePrefix)) robotKept++;
                if (sr.name.StartsWith(VehicleRules.NamePrefix)) vehKept++;
                if (sr.name.StartsWith("NameTag")) tagKept++;
            }
            foreach (Transform t in UnityEngine.Object.FindObjectsOfType<Transform>())
                if (t.parent == null && t.name.StartsWith(ResidentRules.NamePrefix)
                    && t.name.Length == 6) resKept++;
            Chk(neonKept == NeonRules.Count, "r35+r38 neon signs lost after our save: " + neonKept);
            Chk(robotKept == RobotRules.Count, "r36 robots lost after our save: " + robotKept);
            Chk(resKept == ResidentRules.Count, "r99 residents lost after our save: " + resKept);
            Chk(tagKept == 0, "world nameplates must stay retired after our save (r179 S5b): " + tagKept);
            Chk(vehKept == VehicleRules.Count, "r93 vehicles lost after our save: " + vehKept);
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
            Chk(cam != null && cam.orthographic && Math.Abs(cam.orthographicSize - RigMath.L0Size) < 0.01f,
                "L0 camera broken after save");
            Chk(TileCount("Ground") > 0 && TileCount("Water") > 0 && TileCount("Roads") > 0,
                "base tilemaps emptied by our save");
            Chk(CountPrefix("BarkBubble") == 0, "BarkBubble persisted (runtime-only law)");
            Chk(CountPrefix("IdentCard") == 0, "IdentCard persisted (runtime-only law)");
            Chk(GameObject.Find("SkylineFar") == null && GameObject.Find("AmbientTintS") == null
                && GameObject.Find("AmbientTintN") == null && GameObject.Find("AmbientTintRiver") == null,
                "runtime-only visuals persisted into the scene");

            // ---- D. render gates: day/dusk/night L0 + L1 street pair ----
            amb.EnsureVisuals();
            amb.ApplyWeather("clear", 0f, 0);
            amb.StepWeather(0.1f);
            GameObject[] officeGos = new GameObject[OfficeRules.Count];
            for (int i = 0; i < OfficeRules.Count; i++)
            {
                officeGos[i] = GameObject.Find(OfficeRules.Name(i));
                Chk(officeGos[i] != null, "office GO missing for render gate: " + OfficeRules.Name(i));
            }
            GameObject[] terraceGos = new GameObject[OfficeRules.GroundCount];
            for (int g = 0; g < OfficeRules.GroundCount; g++)
            {
                terraceGos[g] = GameObject.Find(OfficeRules.GroundName(g));
                Chk(terraceGos[g] != null, "terrace GO missing for render gate: " + OfficeRules.GroundName(g));
            }
            float dayLum = 0f, duskLum = 0f, nightLum = 0f;
            float dayWarm = 0f, duskWarm = 0f;
            // r209 bank split (T-FV-122 S4 blue-fog re-anchor): the r208 depth
            // fog wash is a DUSK-ONLY overlay on the north walkway band y8..14,
            // mandated by batch-2 order 4 (far rows bluer, foggier). The 4 north
            // offices legitimately cool at dusk, so one flat warm aggregate can
            // no longer carry the r44 harmony law - south keeps the full warm
            // gate, north proves the mandated fog is actually over it.
            float dayWarmS = 0f, duskWarmS = 0f, dayWarmN = 0f, duskWarmN = 0f;
            int dayTotS = 0, duskTotS = 0, dayTotN = 0, duskTotN = 0;
            int dayTot = 0, duskTot = 0, nightTot = 0;
            int duskMin = int.MaxValue, nightMin = int.MaxValue;
            string duskWorst = "", nightWorst = "";
            amb.ApplyAmbient(AmbientTier.Day);
            SetOffices(officeGos, false);
            Texture2D dayBase = Shot(cam, null);
            SetOffices(officeGos, true);
            Texture2D dayOn = Shot(cam, "m1-r112-officeband-day.png");
            for (int i = 0; i < OfficeRules.Count; i++)
            {
                int n; float lum, warm;
                WinDelta(dayOn, dayBase, cam, i, out n, out lum, out warm);
                dayTot += n; dayLum += lum * n; dayWarm += warm * n;
                if (OfficeRules.IsNorth(i)) { dayTotN += n; dayWarmN += warm * n; }
                else { dayTotS += n; dayWarmS += warm * n; }
            }
            dayLum = dayTot > 0 ? dayLum / dayTot : 0f;
            dayWarm = dayTot > 0 ? dayWarm / dayTot : 0f;
            dayWarmS = dayTotS > 0 ? dayWarmS / dayTotS : 0f;
            dayWarmN = dayTotN > 0 ? dayWarmN / dayTotN : 0f;
            // r138 terrace day pair (offices stay on in both frames - clean
            // attribution); the m1-r138-terrace-day frame = the dayOn bytes
            SetTerraces(terraceGos, false);
            Texture2D terraceDayBase = Shot(cam, null);
            SetTerraces(terraceGos, true);
            int terraceDayN; float terraceDayLum, terraceDayWarm;
            GroundWinDelta(dayOn, terraceDayBase, cam, 0, out terraceDayN, out terraceDayLum, out terraceDayWarm);
            Chk(terraceDayN >= 150, "terrace invisible in the day L0 frame: " + terraceDayN + "px");
            File.Copy(Path.Combine(RepoRoot, "docs", "design", "m1-r112-officeband-day.png"),
                      Path.Combine(RepoRoot, "docs", "design", "m1-r138-terrace-day.png"), true);
            amb.ApplyAmbient(AmbientTier.Dusk);
            SetOffices(officeGos, false);
            Texture2D duskBase = Shot(cam, null);
            SetOffices(officeGos, true);
            Texture2D duskOn = Shot(cam, "m1-r112-officeband-dusk.png");
            for (int i = 0; i < OfficeRules.Count; i++)
            {
                int n; float lum, warm;
                WinDelta(duskOn, duskBase, cam, i, out n, out lum, out warm);
                duskTot += n; duskLum += lum * n; duskWarm += warm * n;
                if (OfficeRules.IsNorth(i)) { duskTotN += n; duskWarmN += warm * n; }
                else { duskTotS += n; duskWarmS += warm * n; }
                if (n < duskMin) { duskMin = n; duskWorst = OfficeRules.Name(i); }
            }
            duskLum = duskTot > 0 ? duskLum / duskTot : 0f;
            duskWarm = duskTot > 0 ? duskWarm / duskTot : 0f;
            duskWarmS = duskTotS > 0 ? duskWarmS / duskTotS : 0f;
            duskWarmN = duskTotN > 0 ? duskWarmN / duskTotN : 0f;
            // r138 terrace dusk pair + the m1-r138-terrace-dusk frame
            SetTerraces(terraceGos, false);
            Texture2D terraceDuskBase = Shot(cam, null);
            SetTerraces(terraceGos, true);
            int terraceDuskN; float terraceDuskLum, terraceDuskWarm;
            GroundWinDelta(duskOn, terraceDuskBase, cam, 0, out terraceDuskN, out terraceDuskLum, out terraceDuskWarm);
            Chk(terraceDuskN >= 200, "terrace invisible at dusk: " + terraceDuskN + "px");
            File.Copy(Path.Combine(RepoRoot, "docs", "design", "m1-r112-officeband-dusk.png"),
                      Path.Combine(RepoRoot, "docs", "design", "m1-r138-terrace-dusk.png"), true);
            amb.ApplyAmbient(AmbientTier.Night);
            SetOffices(officeGos, false);
            Texture2D nightBase = Shot(cam, null);
            SetOffices(officeGos, true);
            Texture2D nightOn = Shot(cam, "m1-r112-officeband-night.png");
            for (int i = 0; i < OfficeRules.Count; i++)
            {
                int n; float lum, warm;
                WinDelta(nightOn, nightBase, cam, i, out n, out lum, out warm);
                nightTot += n; nightLum += lum * n;
                if (n < nightMin) { nightMin = n; nightWorst = OfficeRules.Name(i); }
            }
            nightLum = nightTot > 0 ? nightLum / nightTot : 0f;
            // r138 terrace night pair + the m1-r138-terrace-night frame + the
            // r44 harmony/atmosphere laws for the storefront family
            SetTerraces(terraceGos, false);
            Texture2D terraceNightBase = Shot(cam, null);
            SetTerraces(terraceGos, true);
            int terraceNightN; float terraceNightLum, terraceNightWarm;
            GroundWinDelta(nightOn, terraceNightBase, cam, 0, out terraceNightN, out terraceNightLum, out terraceNightWarm);
            Chk(terraceNightN >= 50, "terrace invisible at night: " + terraceNightN + "px");
            File.Copy(Path.Combine(RepoRoot, "docs", "design", "m1-r112-officeband-night.png"),
                      Path.Combine(RepoRoot, "docs", "design", "m1-r138-terrace-night.png"), true);
            Chk(terraceDuskWarm > terraceDayWarm + 0.02f, "terrace harmony law: dusk must warm the storefront (r-b "
                + terraceDayWarm.ToString("F3") + " -> " + terraceDuskWarm.ToString("F3") + ")");
            Chk(terraceNightLum < terraceDuskLum, "terrace night must sit under dusk (atmosphere law): "
                + terraceNightLum.ToString("F3") + " vs " + terraceDuskLum.ToString("F3"));
            Chk(duskTot >= 2000, "dusk office delta too sparse: " + duskTot + "px");
            Chk(duskMin >= 400, "dusk invisible office " + duskWorst + ": " + duskMin + "px");
            Chk(nightTot >= 300, "night office delta too sparse: " + nightTot + "px");
            Chk(nightMin >= 50, "night invisible office " + nightWorst + ": " + nightMin + "px");
            // r44 harmony gates, mechanical face (AA-016 daytime-flat family must
            // sit UNDER the ambient wheel like the city does - "city warms, I
            // warm; city darkens, I darken", never raw):
            //  1. the dusk overlay is a warm-gold ALPHA GLOW (alpha 0.22, NOT a
            //     darkening multiply) - so day-vs-dusk LUMINANCE ordering is not a
            //     law; the law is the WARMTH shift (r-b must rise at dusk);
            //  2. night is the dark tier: offices must sit well below dusk.
            // r209 bank-scoped re-anchor (r51 drift law): batch-2 order 4 made
            // the north walkway fog dusk-blue, so the warm gate lives on the
            // fog-free SOUTH bank at the original +0.02 (no cut), while the
            // NORTH bank must prove the mandated fog is over it - its dusk r-b
            // shift sits at least 0.02 BELOW the south shift (fog cooling at
            // least as visible as the warm gate itself). The delta-census and
            // atmosphere gates still carry "never raw" for every office on
            // both banks.
            Chk(duskWarmS > dayWarmS + 0.02f, "south office harmony law: dusk must warm the fog-free bank (r-b "
                + dayWarmS.ToString("F3") + " -> " + duskWarmS.ToString("F3") + ")");
            Chk((duskWarmN - dayWarmN) < (duskWarmS - dayWarmS) - 0.02f,
                "north office fog law: the blue depth fog must cool the north bank below the south shift "
                + "(north shift " + (duskWarmN - dayWarmN).ToString("F3") + " vs south shift "
                + (duskWarmS - dayWarmS).ToString("F3") + ")");
            Chk(nightLum < duskLum, "night offices must sit under dusk (atmosphere law): "
                + nightLum.ToString("F3") + " vs " + duskLum.ToString("F3"));

            // L1 street pair (r111 proof_window_rederivations): E1 closes the
            // east frame below MEDIA; N3/N1/N2 line the north walkway west.
            Vector3 origPos = cam.transform.position;
            float origSize = cam.orthographicSize;
            cam.orthographicSize = RigMath.L1Size;
            cam.transform.position = new Vector3(30f, -7f, origPos.z);
            SetOffices(officeGos, false);
            Texture2D l1sBase = Shot(cam, null);
            SetOffices(officeGos, true);
            Texture2D l1sOn = Shot(cam, "m1-r112-officeband-l1-south.png");
            int e1 = -1;
            for (int i = 0; i < OfficeRules.Count; i++) if (OfficeRules.Name(i) == "Office01") e1 = i;
            int l1sN; float l1sL, l1sW;
            WinDelta(l1sOn, l1sBase, cam, e1, out l1sN, out l1sL, out l1sW);
            Chk(l1sN >= 800, "E1 invisible in the L1-south street view: " + l1sN + "px");
            cam.transform.position = new Vector3(-20f, 5f, origPos.z);
            SetOffices(officeGos, false);
            Texture2D l1nBase = Shot(cam, null);
            SetOffices(officeGos, true);
            Texture2D l1nOn = Shot(cam, "m1-r112-officeband-l1-north.png");
            for (int i = 1; i <= 3; i++)   // Office02 N3, Office03 N1, Office04 N2
            {
                int n; float lum, warm;
                WinDelta(l1nOn, l1nBase, cam, i, out n, out lum, out warm);
                Chk(n >= 800, OfficeRules.Name(i) + " invisible in the L1-north street view: " + n + "px");
            }
            int n4n; float n4l, n4w;
            WinDelta(l1nOn, l1nBase, cam, n4, out n4n, out n4l, out n4w);
            Chk(n4n == 0, "N4 must sit outside the L1-north frame (east-outer): " + n4n + "px");
            // r138: the terrace's own L1 south-bank street view - the
            // street-front DOOR face read (the m1-r138-terrace set closes with
            // this frame; door >= 1.5x law asserted in A2). Camera law: the L1
            // street family rides |camX| <= 30 (the E1 precedent rides the
            // tint's +46 edge exactly) - camX -34 would expose the untinted
            // 4u sliver west of the AmbientTint's -46 west edge as a false
            // "overlay band" in evidence frames (r138 first-shot census).
            cam.transform.position = new Vector3(-30f, -7f, origPos.z);
            SetTerraces(terraceGos, false);
            Texture2D l1wBase = Shot(cam, null);
            SetTerraces(terraceGos, true);
            Texture2D l1wOn = Shot(cam, "m1-r138-terrace-l1-west.png");
            int l1wN; float l1wL, l1wW;
            GroundWinDelta(l1wOn, l1wBase, cam, 0, out l1wN, out l1wL, out l1wW);
            Chk(l1wN >= 800, "terrace street front invisible in the L1 west view: " + l1wN + "px");
            // restore the camera (scene was saved in section C; no save after renders)
            cam.orthographicSize = origSize;
            cam.transform.position = origPos;

            UnityEngine.Object.DestroyImmediate(dayBase); UnityEngine.Object.DestroyImmediate(dayOn);
            UnityEngine.Object.DestroyImmediate(duskBase); UnityEngine.Object.DestroyImmediate(duskOn);
            UnityEngine.Object.DestroyImmediate(nightBase); UnityEngine.Object.DestroyImmediate(nightOn);
            UnityEngine.Object.DestroyImmediate(l1sBase); UnityEngine.Object.DestroyImmediate(l1sOn);
            UnityEngine.Object.DestroyImmediate(l1nBase); UnityEngine.Object.DestroyImmediate(l1nOn);
            UnityEngine.Object.DestroyImmediate(terraceDayBase);
            UnityEngine.Object.DestroyImmediate(terraceDuskBase);
            UnityEngine.Object.DestroyImmediate(terraceNightBase);
            UnityEngine.Object.DestroyImmediate(l1wBase); UnityEngine.Object.DestroyImmediate(l1wOn);

            return "asserts=" + asserts
                + " table=" + OfficeRules.Count
                + " census(props=" + propCells + ",south_tiles=" + q0 + "/" + g0 + "/" + m0 + ",anchors=4/4)"
                + " scene(saved=" + saved + "," + OfficeRules.Count + " persisted,neon" + neonKept
                + "_robot" + robotKept + "_res" + resKept + "_tag" + tagKept + "_veh" + vehKept + ")"
                + " render(day_px=" + dayTot + " dusk_px=" + duskTot + " worst=" + duskWorst + ":" + duskMin
                + " night_px=" + nightTot + " worst=" + nightWorst + ":" + nightMin
                + " lum day=" + dayLum.ToString("F3") + " dusk=" + duskLum.ToString("F3")
                + " night=" + nightLum.ToString("F3")
                + " warm day=" + dayWarm.ToString("F3") + " dusk=" + duskWarm.ToString("F3")
                + " l1south_e1=" + l1sN + ")"
                + " terrace(day=" + terraceDayN + " dusk=" + terraceDuskN + " night=" + terraceNightN
                + " l1west=" + l1wN + " warm day->dusk=" + terraceDayWarm.ToString("F3")
                + "->" + terraceDuskWarm.ToString("F3") + " lum dusk=" + terraceDuskLum.ToString("F3")
                + " night=" + terraceNightLum.ToString("F3") + ")"
                + " shots=6+3copy";
        }

        static string ReloadProve()
        {
            Scene scene = EditorSceneManager.OpenScene(ScenePath, OpenSceneMode.Single);
            if (!scene.isLoaded) throw new InvalidOperationException("CityScene failed to load");
            Chk(CountOffices() == OfficeRules.Count, "office count after editor restart != table: " + CountOffices());
            for (int i = 0; i < OfficeRules.Count; i++)
            {
                GameObject go = GameObject.Find(OfficeRules.Name(i));
                Chk(go != null, "office lost across sessions: " + OfficeRules.Name(i));
                SpriteRenderer sr = go != null ? go.GetComponent<SpriteRenderer>() : null;
                Chk(sr != null && sr.sprite != null, "office sprite unresolved after restart: " + OfficeRules.Name(i));
                Chk(sr.sortingOrder == OfficeRules.Order, "office order lost after restart: " + OfficeRules.Name(i));
                Vector2 p = OfficeRules.Pos(i);
                Chk(Math.Abs(go.transform.position.x - p.x) < 1e-4f
                    && Math.Abs(go.transform.position.y - p.y) < 1e-4f,
                    "office position lost across restart: " + OfficeRules.Name(i));
            }
            // r138: terraces survive the editor restart
            Chk(CountTerraces() == OfficeRules.GroundCount,
                "terrace count after editor restart != table: " + CountTerraces());
            for (int tg = 0; tg < OfficeRules.GroundCount; tg++)
            {
                GameObject go = GameObject.Find(OfficeRules.GroundName(tg));
                Chk(go != null, "terrace lost across sessions: " + OfficeRules.GroundName(tg));
                SpriteRenderer sr = go != null ? go.GetComponent<SpriteRenderer>() : null;
                Chk(sr != null && sr.sprite != null, "terrace sprite unresolved after restart: " + OfficeRules.GroundName(tg));
                Chk(sr.sortingOrder == OfficeRules.Order, "terrace order lost after restart: " + OfficeRules.GroundName(tg));
                Vector2 p = OfficeRules.GroundPos(tg);
                Chk(Math.Abs(go.transform.position.x - p.x) < 1e-4f
                    && Math.Abs(go.transform.position.y - p.y) < 1e-4f,
                    "terrace position lost across restart: " + OfficeRules.GroundName(tg));
            }
            int q = TileCount("CityQUANT"), g = TileCount("CityGAME"), m = TileCount("CityMEDIA");
            Chk(q == 40 && g == 49 && m == 54, "south city tile counts off canon after restart: " + q + "/" + g + "/" + m);
            string[] spot = { OfficeRules.SrcPath, OfficeRules.MirrorPath, OfficeRules.GroundSrcPath };
            foreach (string p in spot)
            {
                TextureImporter imp = (TextureImporter)TextureImporter.GetAtPath(p);
                Chk(imp != null && imp.textureType == TextureImporterType.Sprite, "importer type lost: " + p);
                Chk(imp.filterMode == FilterMode.Point, "point filter lost: " + p);
                Chk(Math.Abs(imp.spritePixelsPerUnit - 24f) < 0.01f, "PPU24 lost: " + p);
                Chk(!imp.mipmapEnabled, "mips re-enabled: " + p);
            }
            int neonKept = 0;
            foreach (SpriteRenderer sr in UnityEngine.Object.FindObjectsOfType<SpriteRenderer>())
                if (sr.name.StartsWith(NeonRules.NamePrefix)) neonKept++;
            Chk(neonKept == NeonRules.Count, "neon signs lost across restart: " + neonKept);
            GameObject ambGo = GameObject.Find("CityAmbient");
            CityAmbient amb = ambGo != null ? ambGo.GetComponent<CityAmbient>() : null;
            Chk(amb != null && amb.skylineFar != null && amb.skylineNear != null, "r34 skyline lost after restart");
            Chk(UnityEngine.Object.FindObjectsOfType<CityInterior>().Length >= 1, "CityInterior unresolved after restart");
            Chk(UnityEngine.Object.FindObjectsOfType<CityCameraRig>().Length >= 1, "CityCameraRig unresolved after restart");
            Chk(UnityEngine.Object.FindObjectsOfType<CityBubbles>().Length == 1, "r42 bubbles adapter unresolved after restart");
            Chk(UnityEngine.Object.FindObjectsOfType<CityResidentCard>().Length == 1, "r43 card adapter unresolved after restart");
            GameObject camGo = GameObject.Find("CityCamera");
            Camera cam = camGo != null ? camGo.GetComponent<Camera>() : null;
            Chk(cam != null && Math.Abs(cam.orthographicSize - RigMath.L0Size) < 0.01f, "L0 camera broken after restart");
            return "reload_gate=OK offices=" + CountOffices() + "/" + OfficeRules.Count
                + " terraces=" + CountTerraces() + "/" + OfficeRules.GroundCount
                + " persisted south_tiles=" + q + "/" + g + "/" + m
                + " importers=sprite+point+ppu24+nemip neon=" + neonKept + "/" + NeonRules.Count
                + " neighbors=6 cam_L0=" + (cam != null ? cam.orthographicSize.ToString("F1") : "?");
        }

        // sweep every root-level Office* GO, then build the 5 from the table
        // (fresh LoadAssetAtPath at every use = r10 fake-null law)
        static void BuildOffices()
        {
            foreach (Transform t in UnityEngine.Object.FindObjectsOfType<Transform>())
                if (t.parent == null && t.name.StartsWith(OfficeRules.NamePrefix))
                    UnityEngine.Object.DestroyImmediate(t.gameObject);
            for (int i = 0; i < OfficeRules.Count; i++)
            {
                GameObject go = new GameObject(OfficeRules.Name(i));
                Vector2 p = OfficeRules.Pos(i);
                go.transform.position = new Vector3(p.x, p.y, 0f);
                SpriteRenderer sr = go.AddComponent<SpriteRenderer>();
                sr.sprite = AssetDatabase.LoadAssetAtPath<Sprite>(OfficeRules.Path(i));
                if (sr.sprite == null)
                    throw new InvalidOperationException("office sprite resolve failed: " + OfficeRules.Path(i));
                sr.sortingOrder = OfficeRules.Order;
            }
        }

        static int CountOffices()
        {
            int c = 0;
            foreach (SpriteRenderer sr in UnityEngine.Object.FindObjectsOfType<SpriteRenderer>())
                if (sr.name.StartsWith(OfficeRules.NamePrefix)) c++;
            return c;
        }

        // r138: sweep every root-level Terrace* GO, then build from the ground
        // table (fresh LoadAssetAtPath at every use = r10 fake-null law)
        static void BuildTerraces()
        {
            foreach (Transform t in UnityEngine.Object.FindObjectsOfType<Transform>())
                if (t.parent == null && t.name.StartsWith(OfficeRules.GroundPrefix))
                    UnityEngine.Object.DestroyImmediate(t.gameObject);
            for (int g = 0; g < OfficeRules.GroundCount; g++)
            {
                GameObject go = new GameObject(OfficeRules.GroundName(g));
                Vector2 p = OfficeRules.GroundPos(g);
                go.transform.position = new Vector3(p.x, p.y, 0f);
                SpriteRenderer sr = go.AddComponent<SpriteRenderer>();
                sr.sprite = AssetDatabase.LoadAssetAtPath<Sprite>(OfficeRules.GroundPath(g));
                if (sr.sprite == null)
                    throw new InvalidOperationException("terrace sprite resolve failed: " + OfficeRules.GroundPath(g));
                sr.sortingOrder = OfficeRules.Order;
            }
        }

        static int CountTerraces()
        {
            int c = 0;
            foreach (SpriteRenderer sr in UnityEngine.Object.FindObjectsOfType<SpriteRenderer>())
                if (sr.name.StartsWith(OfficeRules.GroundPrefix)) c++;
            return c;
        }

        static void SetTerraces(GameObject[] gos, bool on)
        {
            foreach (GameObject go in gos) if (go != null) go.SetActive(on);
        }

        // one building rect vs every live single source (r111 A3 census law;
        // r138: the 2 eave slots join the protected stand positions - the
        // r137 manifest coupled_updates census)
        static void CensusOne(float x0, float y0, float x1, float y1, string id)
        {
            for (int b = 0; b < 8; b++)
            {
                NeonRules.Building bb = NeonRules.BuildingAt(b);
                Chk(!Overlap(x0, y0, x1, y1, bb.x0, bb.y0, bb.x1, bb.y1),
                    "building " + id + " clips mounting building " + b);
            }
            for (int s = 0; s < ResidentRules.Count; s++)
            {
                Vector2 c = ResidentRules.Pos(s);
                float half = ResidentRules.WorldW(s) / 2f;
                Chk(!Overlap(x0, y0, x1, y1, c.x - half, c.y - half, c.x + half, c.y + half),
                    "building " + id + " clips resident " + ResidentRules.Name(s));
                Vector2 sc = ResidentRules.ShadowPos(s);
                float shw = ResidentRules.ShadowWorldW / 2f, shh = ResidentRules.ShadowWorldH / 2f;
                Chk(!Overlap(x0, y0, x1, y1, sc.x - shw, sc.y - shh, sc.x + shw, sc.y + shh),
                    "building " + id + " clips resident shadow " + ResidentRules.Name(s));
                Chk(!Overlap(x0, y0, x1, y1, c.x - PlateHalfW, c.y + PlateOffsetY - PlateHalfH,
                             c.x + PlateHalfW, c.y + PlateOffsetY + PlateHalfH),
                    "building " + id + " clips nameplate " + ResidentRules.Name(s));
            }
            for (int r = 0; r < RobotRules.Count; r++)
            {
                Vector2 c = RobotRules.Pos(r);
                float half = RobotRules.WorldW(r) / 2f;
                Chk(!Overlap(x0, y0, x1, y1, c.x - half, c.y - half, c.x + half, c.y + half),
                    "building " + id + " clips robot " + RobotRules.Name(r));
                Vector2 sc = RobotRules.ShadowPos(r);
                float shw = RobotRules.ShadowWorldW / 2f, shh = RobotRules.ShadowWorldH / 2f;
                Chk(!Overlap(x0, y0, x1, y1, sc.x - shw, sc.y - shh, sc.x + shw, sc.y + shh),
                    "building " + id + " clips robot shadow " + RobotRules.Name(r));
            }
            for (int v = 0; v < VehicleRules.Count; v++)
            {
                float vw = VehicleRules.WorldW(v) / 2f, vh = VehicleRules.WorldH(v);
                float vx = VehicleRules.Pos(v).x, gy = VehicleRules.FeetY(v);
                Chk(!Overlap(x0, y0, x1, y1, vx - vw, gy, vx + vw, gy + vh),
                    "building " + id + " clips vehicle " + VehicleRules.Name(v));
            }
            for (int g = 0; g < NeonRules.Count; g++)
            {
                Vector2 c = NeonRules.Pos(g);
                float gw = NeonRules.WorldW(g) / 2f, gh = NeonRules.WorldH(g) / 2f;
                Chk(!Overlap(x0, y0, x1, y1, c.x - gw, c.y - gh, c.x + gw, c.y + gh),
                    "building " + id + " clips neon sign " + NeonRules.Name(g));
            }
            List<InteriorTarget> reg = InteriorRouter.DefaultRegistry();
            for (int w = 0; w < reg.Count; w++)
            {
                Rect rr = reg[w].bounds;
                Chk(!Overlap(x0, y0, x1, y1, rr.xMin, rr.yMin, rr.xMax, rr.yMax),
                    "building " + id + " clips interior hit rect " + reg[w].zone);
            }
            for (int a = 0; a < AnchorCanon.Length; a++)
                Chk(!ContainsPoint(x0, y0, x1, y1, AnchorCanon[a].x, AnchorCanon[a].y),
                    "building " + id + " swallows anchor " + a);
            for (int e = 0; e < StreetBehaviorRules.EaveCount; e++)
            {
                Vector2 ep = StreetBehaviorRules.EavePos(e);
                float eh = ResidentRules.WorldW(0) / 2f;   // seat-class body 1.333u (r123 law)
                Chk(!Overlap(x0, y0, x1, y1, ep.x - eh, ep.y - eh, ep.x + eh, ep.y + eh),
                    "building " + id + " clips eave slot " + StreetBehaviorRules.Eave(e).id);
            }
        }

        static int CountPrefix(string prefix)
        {
            int c = 0;
            foreach (Transform t in UnityEngine.Object.FindObjectsOfType<Transform>())
                if (t.name.StartsWith(prefix)) c++;
            return c;
        }

        static void SetOffices(GameObject[] gos, bool on)
        {
            foreach (GameObject go in gos) if (go != null) go.SetActive(on);
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
                || Math.Abs(imp.spritePixelsPerUnit - 24f) > 0.01f)
            {
                imp.textureType = TextureImporterType.Sprite;
                imp.spriteImportMode = SpriteImportMode.Single;
                imp.filterMode = FilterMode.Point;
                imp.mipmapEnabled = false;
                imp.spritePixelsPerUnit = 24f;
                imp.SaveAndReimport();
            }
            if (imp.textureType != TextureImporterType.Sprite || imp.filterMode != FilterMode.Point
                || Math.Abs(imp.spritePixelsPerUnit - 24f) > 0.01f)
                throw new InvalidOperationException("importer fix did not stick: " + path);
            return AssetDatabase.LoadAssetAtPath<Sprite>(path);
        }

        static Texture2D LoadPng(string absPath)
        {
            byte[] bytes = File.ReadAllBytes(absPath);
            Texture2D t = new Texture2D(2, 2, TextureFormat.RGBA32, false);
            if (!t.LoadImage(bytes)) { UnityEngine.Object.DestroyImmediate(t); return null; }
            return t;
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

        // per-office window metric: pixels in the office rect (+0.4u margin)
        // that differ from the offices-hidden baseline. y=0 is the image BOTTOM
        // row (r13 law); windows are clipped to the frame (out-of-frame = 0).
        // avgWarm = average (r-b) over the delta pixels (tier-shift evidence).
        static void WinDelta(Texture2D on, Texture2D off, Camera cam, int i,
            out int deltaCount, out float avgLum, out float avgWarm)
        {
            Vector2 c = OfficeRules.Pos(i);
            float hw = OfficeRules.WorldW(i) / 2f + 0.4f;
            float hh = OfficeRules.WorldH(i) / 2f + 0.4f;
            float halfH = cam.orthographicSize;
            float halfW = halfH * (1920f / 1080f);
            float cx = cam.transform.position.x, cy = cam.transform.position.y;
            int px0 = (int)(((c.x - hw - cx) / (2f * halfW) + 0.5f) * 1920f);
            int px1 = (int)(((c.x + hw - cx) / (2f * halfW) + 0.5f) * 1920f);
            int py0 = (int)(((c.y - hh - cy) / (2f * halfH) + 0.5f) * 1080f);
            int py1 = (int)(((c.y + hh - cy) / (2f * halfH) + 0.5f) * 1080f);
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

        // r138: per-terrace window metric (GroundWinDelta = WinDelta's ground
        // family mirror; same +0.4u margin, same 3px sampling, same laws)
        static void GroundWinDelta(Texture2D on, Texture2D off, Camera cam, int g,
            out int deltaCount, out float avgLum, out float avgWarm)
        {
            Vector2 c = OfficeRules.GroundPos(g);
            float hw = OfficeRules.GroundWorldW(g) / 2f + 0.4f;
            float hh = OfficeRules.GroundWorldH(g) / 2f + 0.4f;
            float halfH = cam.orthographicSize;
            float halfW = halfH * (1920f / 1080f);
            float cx = cam.transform.position.x, cy = cam.transform.position.y;
            int px0 = (int)(((c.x - hw - cx) / (2f * halfW) + 0.5f) * 1920f);
            int px1 = (int)(((c.x + hw - cx) / (2f * halfW) + 0.5f) * 1920f);
            int py0 = (int)(((c.y - hh - cy) / (2f * halfH) + 0.5f) * 1080f);
            int py1 = (int)(((c.y + hh - cy) / (2f * halfH) + 0.5f) * 1080f);
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
