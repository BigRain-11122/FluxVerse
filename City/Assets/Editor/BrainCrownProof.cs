// FluxVerse r177 (T-FV-002 S4, CEO order 09-26 00:10 art rectification):
// brain-tower magnolia-bud crown engine proof - FacadeProof family.
// Law source = Tools/city/landmarks-manifest.json (the r176 sandbox, 95
// assertions green - single geometry source) mirrored by BrainCrownRules.cs;
// the landmark skin swaps (rows 0/3) are cross-checked against FacadeRules
// + facades-manifest (FacadeProof owns that mirror).
//
// pass 1: logs/braincrown.run        -> FluxVerse.BrainCrownProof.BatchRun    -> logs/braincrown.done
// pass 2: logs/braincrown-reload.run -> FluxVerse.BrainCrownProof.ReloadGate  -> logs/braincrown-reload.done
//
// Gates:
//  A0  manifest mirror: crown node (asset/px/rect/pos/order/z/ppu) vs the
//      table + landmark swaps cross-check (LandmarkQUANT == FacadeRules row
//      0, LandmarkMEDIA == row 3, asset/px/rect bitwise) + order chain
//      (crown 3 = facade family < rim 5 < signs 6) + PPU24 + natural size.
//  A1  disk census (pack edit = fail-loud): dims 48x24, near-white == 0,
//      bright>80 == 43 (lit sepal ridges pin), opaque == 602, bud base row
//      span px 6..41 (world -0.25..1.25, the shoulder grounding pin), bud
//      tip row span px 21..26 (world 0.375..0.625), and the side-needle
//      x-bands (px 14..17 / 31..33) TRANSPARENT at the canvas top row
//      (zero needle occlusion of bud pixels).
//  A2  idempotent build x2 + GO gates (root level, sprite resolved, order 3,
//      z 0, pos == rect center, scale 1, natural size 2x1u via sr.bounds).
//  A3  static gates: containment in NeonRules.Buildings[7] (containment IS
//      the gate - tower-ornament identity law), canvas top == tower top
//      19.0 < zenith 19.04 (r131 A10), needles (mid zero canvas overlap;
//      side dip <= 0.01u over transparent columns, x-bands disjoint from
//      the tip span), zero anchor swallow, zero overlap vs every MOBILE/
//      STANDING live source, rim interplay (RimBrainTip band UNCHANGED,
//      shoulders touch-not-overlap at y18, rim order 5 above crown 3; the
//      dusk band-over-bud overlap itself = REPORTED never gated, r169 A4b).
//  B   save + reopen + persisted gates + neighbor regressions (the r104
//      law: our save must keep every earlier serialized wiring) + disk
//      purity (r146: no CityAmbient runtime duplicate after EnsureVisuals).
//  C   render diff census: crown on/off at day/dusk/night L0 - per-tier
//      delta floor (FacadeProof 15% law), day zero-leak OUTSIDE the rect
//      (exact 0) + blade-visible-through-flanks composite face (in-rect
//      unchanged samples), dusk lit-ridge blue-differential census (the
//      Lucy-blue sepal ridges appear only with the crown).
//      Screenshots: m1-r177-landmarks-{day,dusk,night,l1-south}.png (the
//      round's four evidence frames, facades+crown on - r119 law).
// ASCII. No 3D.
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine;
using UnityEngine.SceneManagement;
using UnityEngine.Tilemaps;

namespace FluxVerse
{
    public static class BrainCrownProof
    {
        static string ProjectRoot { get { return Path.GetDirectoryName(Application.dataPath); } }
        static string RepoRoot { get { return Path.GetDirectoryName(ProjectRoot); } }
        static string RunPath { get { return Path.Combine(RepoRoot, "logs", "braincrown.run"); } }
        static string DonePath { get { return Path.Combine(RepoRoot, "logs", "braincrown.done"); } }
        static string ReloadRunPath { get { return Path.Combine(RepoRoot, "logs", "braincrown-reload.run"); } }
        static string ReloadDonePath { get { return Path.Combine(RepoRoot, "logs", "braincrown-reload.done"); } }
        static string ScenePath { get { return "Assets/Scenes/CityScene.unity"; } }
        static int asserts;

        // r104 zone anchors (OfficeProof canon family - point-containment law)
        static readonly Vector2[] AnchorCanon =
        {
            new Vector2(0.5f, 14f),      // BrainTower (tower-v2 visual center)
            new Vector2(-20.5f, -11f),   // Zone_GAME
            new Vector2(0.5f, -12f),     // Zone_QUANT
            new Vector2(22f, -11f),      // Zone_MEDIA
        };

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

        // ---- manifest mirror helpers (LabsProof single-geometry-source law) ----
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
            int open = text.IndexOf('"', k + key.Length);
            int close = text.IndexOf('"', open + 1);
            return text.Substring(open + 1, close - open - 1);
        }

        static float ExtractScalarAfter(string text, int from, string key)
        {
            int k = text.IndexOf(key, from);
            if (k < 0) throw new InvalidOperationException("manifest key missing: " + key);
            int colon = text.IndexOf(':', k);
            int end = colon + 1;
            while (end < text.Length)
            {
                char ch = text[end];
                if (ch == ',' || ch == '}' || ch == '\n' || ch == '\r') break;
                end++;
            }
            string s = text.Substring(colon + 1, end - colon - 1).Trim();
            return float.Parse(s, CultureInfo.InvariantCulture);
        }

        static string Prove()
        {
            // open the city scene FIRST (the r138 OfficeProof order law)
            Scene scene = EditorSceneManager.OpenScene(ScenePath, OpenSceneMode.Single);
            if (!scene.isLoaded) throw new InvalidOperationException("CityScene failed to load");

            // ---- A0. table == landmarks-manifest (crown node + swap cross-check) ----
            string manifest = File.ReadAllText(Path.Combine(RepoRoot, "Tools", "city", "landmarks-manifest.json"));
            Chk(manifest.Length > 1000, "landmarks-manifest.json unreadable");
            int at = manifest.IndexOf("\"id\": \"BrainCrown\"");
            Chk(at >= 0, "manifest crown node missing");
            float[] cr = ExtractFloatsAfter(manifest, at, "\"rect\"", 4);
            Chk(Mathf.Abs(cr[0] - BrainCrownRules.X0) < 1e-4f && Mathf.Abs(cr[1] - BrainCrownRules.Y0) < 1e-4f
                && Mathf.Abs(cr[2] - BrainCrownRules.X1) < 1e-4f && Mathf.Abs(cr[3] - BrainCrownRules.Y1) < 1e-4f,
                "manifest crown rect != table");
            float[] cpx = ExtractFloatsAfter(manifest, at, "\"px\"", 2);
            Chk((int)cpx[0] == BrainCrownRules.PxW && (int)cpx[1] == BrainCrownRules.PxH,
                "manifest crown px != table");
            float[] cpos = ExtractFloatsAfter(manifest, at, "\"pos\"", 2);
            Chk(Mathf.Abs(cpos[0] - BrainCrownRules.PosX) < 1e-4f
                && Mathf.Abs(cpos[1] - BrainCrownRules.PosY) < 1e-4f,
                "manifest crown pos != table");
            string casset = ExtractStringAfter(manifest, at, "\"asset\"");
            Chk(casset == BrainCrownRules.Path, "manifest crown asset != table");
            Chk(BrainCrownRules.Path.StartsWith("Assets/ArtPacks/office-towers/"),
                "crown path outside the office-towers pack");
            float corder = ExtractScalarAfter(manifest, at, "\"order\"");
            Chk(Mathf.Abs(corder - BrainCrownRules.Order) < 1e-4f, "manifest crown order != table");
            float cz = ExtractScalarAfter(manifest, at, "\"z\"");
            Chk(Mathf.Abs(cz - BrainCrownRules.Z) < 1e-4f, "manifest crown z != table");
            float cppu = ExtractScalarAfter(manifest, at, "\"ppu\"");
            Chk(Mathf.Abs(cppu - BrainCrownRules.PPU) < 1e-4f, "manifest crown ppu != PPU24");
            // landmark swaps cross-check (the r176 four-source equality, engine side)
            Chk(FacadeRules.Count == 4, "facade table must hold 4 mounts");
            int sq = manifest.IndexOf("\"id\": \"LandmarkQUANT\"");
            Chk(sq >= 0, "manifest swap LandmarkQUANT missing");
            Chk(ExtractStringAfter(manifest, sq, "\"asset\"") == FacadeRules.Path(0),
                "LandmarkQUANT asset != FacadeRules row 0");
            float[] sqpx = ExtractFloatsAfter(manifest, sq, "\"px\"", 2);
            Chk((int)sqpx[0] == FacadeRules.PxW(0) && (int)sqpx[1] == FacadeRules.PxH(0),
                "LandmarkQUANT px != FacadeRules row 0");
            float[] sqr = ExtractFloatsAfter(manifest, sq, "\"rect\"", 4);
            Chk(Mathf.Abs(sqr[0] - FacadeRules.X0(0)) < 1e-4f && Mathf.Abs(sqr[1] - FacadeRules.Y0(0)) < 1e-4f
                && Mathf.Abs(sqr[2] - FacadeRules.X1(0)) < 1e-4f && Mathf.Abs(sqr[3] - FacadeRules.Y1(0)) < 1e-4f,
                "LandmarkQUANT rect != FacadeRules row 0");
            int sm = manifest.IndexOf("\"id\": \"LandmarkMEDIA\"");
            Chk(sm >= 0, "manifest swap LandmarkMEDIA missing");
            Chk(ExtractStringAfter(manifest, sm, "\"asset\"") == FacadeRules.Path(3),
                "LandmarkMEDIA asset != FacadeRules row 3");
            float[] smpx = ExtractFloatsAfter(manifest, sm, "\"px\"", 2);
            Chk((int)smpx[0] == FacadeRules.PxW(3) && (int)smpx[1] == FacadeRules.PxH(3),
                "LandmarkMEDIA px != FacadeRules row 3");
            float[] smr = ExtractFloatsAfter(manifest, sm, "\"rect\"", 4);
            Chk(Mathf.Abs(smr[0] - FacadeRules.X0(3)) < 1e-4f && Mathf.Abs(smr[1] - FacadeRules.Y0(3)) < 1e-4f
                && Mathf.Abs(smr[2] - FacadeRules.X1(3)) < 1e-4f && Mathf.Abs(smr[3] - FacadeRules.Y1(3)) < 1e-4f,
                "LandmarkMEDIA rect != FacadeRules row 3");
            // family laws: order chain + PPU tier + natural size
            Chk(BrainCrownRules.Order == 3 && BrainCrownRules.Order == LabsRules.PodOrder
                && BrainCrownRules.Order == FacadeRules.Order,
                "crown must ride the building family order 3 (LabsRules.PodOrder law)");
            Chk(BrainCrownRules.Order < RimLightRules.SortOrder && RimLightRules.SortOrder < NeonRules.Order,
                "order chain broken (crown 3 < rim 5 < signs 6)");
            Chk(Mathf.Abs(BrainCrownRules.PPU - FacadeRules.PPU) < 1e-5f, "PPU24 divisor law (r151 importer row)");
            Chk(Mathf.Abs(BrainCrownRules.WorldW() - BrainCrownRules.PxW / BrainCrownRules.PPU) < 5e-4f
                && Mathf.Abs(BrainCrownRules.WorldH() - BrainCrownRules.PxH / BrainCrownRules.PPU) < 5e-4f,
                "world size != px/PPU24");
            Vector2 cp = BrainCrownRules.Pos();
            Chk(Mathf.Abs(cp.x - (BrainCrownRules.X0 + BrainCrownRules.X1) / 2f) < 1e-5f
                && Mathf.Abs(cp.y - (BrainCrownRules.Y0 + BrainCrownRules.Y1) / 2f) < 1e-5f,
                "pos != rect center (pivot center law)");

            // ---- A1. disk census (pack edit = fail-loud) ----
            string abs = Path.Combine(ProjectRoot, BrainCrownRules.Path.Replace('/', Path.DirectorySeparatorChar));
            Texture2D t = LoadPng(abs);
            Chk(t != null, "crown skin unreadable: " + BrainCrownRules.Path);
            Chk(t.width == BrainCrownRules.PxW && t.height == BrainCrownRules.PxH,
                "crown dims drift (pack edit?): " + t.width + "x" + t.height);
            int nearWhite = 0, bright = 0, opaque = 0;
            for (int y = 0; y < t.height; y++)
                for (int x = 0; x < t.width; x++)
                {
                    Color c = t.GetPixel(x, y);
                    if (c.a > 0.5f)
                    {
                        opaque++;
                        float m = Mathf.Min(c.r, Mathf.Min(c.g, c.b));
                        if (m >= 150f / 255f) nearWhite++;
                        if ((c.r + c.g + c.b) / 3f > 80f / 255f) bright++;
                    }
                }
            Chk(nearWhite == 0, "unlit-window law breach: near-white opaque px=" + nearWhite);
            Chk(bright == BrainCrownRules.LitPx, "lit sepal-ridge census drift: bright>80 px=" + bright
                + " (pin " + BrainCrownRules.LitPx + ")");
            Chk(opaque == BrainCrownRules.OpaquePx, "opaque census drift: " + opaque
                + " (pin " + BrainCrownRules.OpaquePx + ")");
            // grounding pin: image bottom row (world y~18.04..18.08) opaque span
            int b0 = -1, b1 = -1;
            for (int x = 0; x < t.width; x++)
                if (t.GetPixel(x, 0).a > 0.5f) { if (b0 < 0) b0 = x; b1 = x; }
            Chk(b0 == BrainCrownRules.BaseRowPx0 && b1 == BrainCrownRules.BaseRowPx1,
                "bud base row span drift: px " + b0 + ".." + b1 + " (pin 6..41 = world -0.25..1.25)");
            // tip pin: image top row (world y~18.96..19) opaque span
            int p0 = -1, p1 = -1;
            int topRow = t.height - 1;
            for (int x = 0; x < t.width; x++)
                if (t.GetPixel(x, topRow).a > 0.5f) { if (p0 < 0) p0 = x; p1 = x; }
            Chk(p0 == BrainCrownRules.TipRowPx0 && p1 == BrainCrownRules.TipRowPx1,
                "bud tip row span drift: px " + p0 + ".." + p1 + " (pin 21..26 = world 0.375..0.625)");
            // needle-band transparency at the canvas top row (sliver law)
            for (int x = 14; x <= 17; x++)
                Chk(t.GetPixel(x, topRow).a <= 0.5f,
                    "left side-needle sliver column px " + x + " opaque at the canvas top row");
            for (int x = 31; x <= 33; x++)
                Chk(t.GetPixel(x, topRow).a <= 0.5f,
                    "right side-needle sliver column px " + x + " opaque at the canvas top row");
            UnityEngine.Object.DestroyImmediate(t);

            // ---- A2. idempotent build + GO gates ----
            int q0 = TileCount("CityQUANT"), g0 = TileCount("CityGAME"), m0 = TileCount("CityMEDIA");
            Chk(q0 == 40 && g0 == 49 && m0 == 54, "south city tile counts off canon pre-build: "
                + q0 + "/" + g0 + "/" + m0);
            BuildCrown();
            BuildCrown();   // idempotency: the second sweep+build must land on exactly Count
            Chk(CountCrowns() == BrainCrownRules.Count, "idempotent rebuild count != table: " + CountCrowns());
            GameObject go = GameObject.Find(BrainCrownRules.Name);
            Chk(go != null, "crown GO missing pre-save");
            Chk(go.transform.parent == null, "crown must be root-level static scenery (NeonSigns law)");
            SpriteRenderer sr = go.GetComponent<SpriteRenderer>();
            Chk(sr != null && sr.sprite != null, "crown sprite unresolved pre-save");
            Chk(sr.sortingOrder == BrainCrownRules.Order, "crown order lost");
            Chk(Mathf.Abs(go.transform.position.x - BrainCrownRules.PosX) < 1e-4f
                && Mathf.Abs(go.transform.position.y - BrainCrownRules.PosY) < 1e-4f
                && Mathf.Abs(go.transform.position.z - BrainCrownRules.Z) < 1e-5f,
                "crown GO pos != rect center at z0");
            Chk(Mathf.Abs(go.transform.localScale.x - 1f) < 1e-5f
                && Mathf.Abs(go.transform.localScale.y - 1f) < 1e-5f,
                "crown scale != 1 (natural size law)");
            Chk(Mathf.Abs(sr.bounds.size.x - BrainCrownRules.WorldW()) < 5e-4f
                && Mathf.Abs(sr.bounds.size.y - BrainCrownRules.WorldH()) < 5e-4f,
                "crown natural size != px/PPU24: " + sr.bounds.size.ToString("F3"));
            Chk(Mathf.Abs(sr.sprite.rect.width - BrainCrownRules.PxW) < 0.5f
                && Mathf.Abs(sr.sprite.rect.height - BrainCrownRules.PxH) < 0.5f,
                "crown sprite px drift");

            // ---- A3. static gates ----
            NeonRules.Building host = NeonRules.BuildingAt(BrainCrownRules.HostBuildingIndex);
            Chk(host.x0 <= BrainCrownRules.X0 && BrainCrownRules.X1 <= host.x1
                && host.y0 <= BrainCrownRules.Y0 && BrainCrownRules.Y1 <= host.y1,
                "containment law: crown rect must sit INSIDE Buildings[7] (tower-ornament identity law)");
            Chk(Mathf.Abs(BrainCrownRules.Y1 - host.y1) < 1e-5f,
                "reshape-only law: canvas top must equal the tower top (19.0)");
            Chk(BrainCrownRules.Y1 < BrainCrownRules.ZenithFloor,
                "zenith law: crown top 19.0 must stay under the 19.04 floor (r131 A10)");
            // needles (NeonTowerAntM/L/R - order 6 above the crown by law)
            NeonRules.Sign mid = FindSign("NeonTowerAntM"), lft = FindSign("NeonTowerAntL"), rgt = FindSign("NeonTowerAntR");
            float midBottom = mid.y - mid.pxH / (mid.ppu * 2f);
            Chk(midBottom >= BrainCrownRules.Y1,
                "mid needle must not dip into the canvas zone: bottom " + midBottom.ToString("F4"));
            float lftBottom = lft.y - lft.pxH / (lft.ppu * 2f);
            float rgtBottom = rgt.y - rgt.pxH / (rgt.ppu * 2f);
            float lftDip = BrainCrownRules.Y1 - lftBottom, rgtDip = BrainCrownRules.Y1 - rgtBottom;
            Chk(lftDip > 0f && lftDip <= 0.01f, "left needle dip out of law: " + lftDip.ToString("F5"));
            Chk(rgtDip > 0f && rgtDip <= 0.01f, "right needle dip out of law: " + rgtDip.ToString("F5"));
            float lftX0 = lft.x - lft.pxW / (lft.ppu * 2f), lftX1 = lft.x + lft.pxW / (lft.ppu * 2f);
            float rgtX0 = rgt.x - rgt.pxW / (rgt.ppu * 2f), rgtX1 = rgt.x + rgt.pxW / (rgt.ppu * 2f);
            float tipX0 = -0.5f + BrainCrownRules.TipRowPx0 / BrainCrownRules.PPU;
            float tipX1 = -0.5f + (BrainCrownRules.TipRowPx1 + 1) / BrainCrownRules.PPU;
            Chk(lftX1 <= tipX0 && rgtX0 >= tipX1,
                "side-needle x-bands must stay disjoint from the bud tip span (zero occlusion)");
            // anchors: the crown must swallow NO zone anchor (r103 canon)
            for (int a = 0; a < AnchorCanon.Length; a++)
                Chk(!ContainsPoint(BrainCrownRules.X0, BrainCrownRules.Y0, BrainCrownRules.X1, BrainCrownRules.Y1,
                    AnchorCanon[a].x, AnchorCanon[a].y), "crown swallows zone anchor " + a);
            // live-source zero-overlap census (FacadeProof CensusMobile family)
            CensusMobile("BrainCrown");
            // rim interplay (r176 verdict: band UNCHANGED, report-not-gate r169 A4b)
            int rimTip = -1;
            for (int i = 0; i < RimLightRules.SegmentCount; i++)
                if (RimLightRules.Id(i) == "RimBrainTip") rimTip = i;
            Chk(rimTip >= 0, "RimBrainTip segment missing from RimLightRules");
            Chk(Mathf.Abs(RimLightRules.X0(rimTip)) < 1e-5f
                && Mathf.Abs(RimLightRules.Y0(rimTip) - 18.875f) < 1e-4f
                && Mathf.Abs(RimLightRules.X1(rimTip) - 1f) < 1e-5f
                && Mathf.Abs(RimLightRules.Y1(rimTip) - 19f) < 1e-5f,
                "RimBrainTip band must stay UNCHANGED [0,18.875,1,19] (r176 verdict)");
            int shW = -1, shE = -1;
            for (int i = 0; i < RimLightRules.SegmentCount; i++)
            {
                if (RimLightRules.Id(i) == "RimBrainShoulderW") shW = i;
                if (RimLightRules.Id(i) == "RimBrainShoulderE") shE = i;
            }
            Chk(shW >= 0 && shE >= 0, "shoulder rim segments missing");
            Chk(RimLightRules.Y1(shW) <= BrainCrownRules.Y0 && RimLightRules.Y1(shE) <= BrainCrownRules.Y0,
                "shoulder rim bands must touch-not-overlap the crown (canvas starts at y18)");
            float rimOverlapW = Mathf.Min(RimLightRules.X1(rimTip), BrainCrownRules.X1)
                - Mathf.Max(RimLightRules.X0(rimTip), BrainCrownRules.X0);
            float rimOverlapH = Mathf.Min(RimLightRules.Y1(rimTip), BrainCrownRules.Y1)
                - Mathf.Max(RimLightRules.Y0(rimTip), BrainCrownRules.Y0);
            string rimReport = "rim_band_over_crown=" + rimOverlapW.ToString("F2") + "x"
                + rimOverlapH.ToString("F3") + "u(intended dusk stacking, reported not gated)";

            // ---- B. save + reopen + persisted gates + neighbor regressions ----
            bool saved = EditorSceneManager.SaveScene(scene);
            Chk(saved, "scene save failed");
            Scene reopened = EditorSceneManager.OpenScene(ScenePath, OpenSceneMode.Single);
            Chk(CountCrowns() == BrainCrownRules.Count, "persisted crown count != table: " + CountCrowns());
            GameObject rg = GameObject.Find(BrainCrownRules.Name);
            Chk(rg != null, "crown missing on disk");
            SpriteRenderer rsr = rg != null ? rg.GetComponent<SpriteRenderer>() : null;
            Chk(rsr != null && rsr.sprite != null, "crown sprite lost on disk");
            Chk(rsr != null && rsr.sortingOrder == BrainCrownRules.Order, "crown order lost on disk");
            Chk(rg != null && Mathf.Abs(rg.transform.position.x - BrainCrownRules.PosX) < 1e-4f
                && Mathf.Abs(rg.transform.position.y - BrainCrownRules.PosY) < 1e-4f,
                "crown position lost on disk");
            int q1 = TileCount("CityQUANT"), g1 = TileCount("CityGAME"), m1 = TileCount("CityMEDIA");
            Chk(q1 == q0 && g1 == g0 && m1 == m0, "no-tilemap-delta law breached by our save: "
                + q1 + "/" + g1 + "/" + m1);
            int facKept = 0, neonKept = 0, robotKept = 0, resKept = 0, tagKept = 0, vehKept = 0, labKept = 0, offKept = 0, terKept = 0;
            foreach (SpriteRenderer s in UnityEngine.Object.FindObjectsOfType<SpriteRenderer>())
            {
                if (s.name.StartsWith(FacadeRules.NamePrefix)) facKept++;
                if (s.name.StartsWith(NeonRules.NamePrefix)) neonKept++;
                if (s.name.StartsWith(RobotRules.NamePrefix)) robotKept++;
                if (s.name.StartsWith(VehicleRules.NamePrefix)) vehKept++;
                if (s.name.StartsWith("NameTag")) tagKept++;
                if (s.name.StartsWith(OfficeRules.NamePrefix)) offKept++;
                if (s.name.StartsWith(OfficeRules.GroundPrefix)) terKept++;
                if (s.name.StartsWith(LabsRules.PipeNamePrefix) || s.name.StartsWith(LabsRules.PodNamePrefix)) labKept++;
            }
            foreach (Transform tr in UnityEngine.Object.FindObjectsOfType<Transform>())
                if (tr.parent == null && tr.name.StartsWith(ResidentRules.NamePrefix)
                    && tr.name.Length == 6) resKept++;
            Chk(facKept == FacadeRules.Count, "facades lost after our save: " + facKept);
            Chk(neonKept == NeonRules.Count, "neon signs lost after our save: " + neonKept);
            Chk(robotKept == RobotRules.Count, "robots lost after our save: " + robotKept);
            Chk(resKept == ResidentRules.Count, "r99 residents lost after our save: " + resKept);
            Chk(tagKept == 0, "world nameplates must stay retired after our save (r179 S5b): " + tagKept);
            Chk(vehKept == VehicleRules.Count, "r93 vehicles lost after our save: " + vehKept);
            Chk(offKept == OfficeRules.Count, "offices lost after our save: " + offKept);
            Chk(terKept == OfficeRules.GroundCount, "terrace lost after our save: " + terKept);
            Chk(labKept == LabsRules.Count, "r142 labs lost after our save: " + labKept);
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
            Chk(UnityEngine.Object.FindObjectsOfType<CityWindowLight>().Length == 1, "r160 windowlight adapter lost after save");
            Chk(UnityEngine.Object.FindObjectsOfType<CityWaterFx>().Length == 1, "r155 waterfx adapter lost after save");
            Chk(UnityEngine.Object.FindObjectsOfType<CityLightFx>().Length == 1, "r158 lightfx adapter lost after save");
            Chk(UnityEngine.Object.FindObjectsOfType<CityStreetBehavior>().Length == 1, "r124 street-behavior adapter lost after save");
            GameObject camGo = GameObject.Find("CityCamera");
            Camera cam = camGo != null ? camGo.GetComponent<Camera>() : null;
            Chk(cam != null && cam.orthographic && Math.Abs(cam.orthographicSize - RigMath.L0Size) < 0.01f,
                "L0 camera broken after save");
            Chk(TileCount("Ground") > 0 && TileCount("Water") > 0 && TileCount("Roads") > 0,
                "base tilemaps emptied by our save");
            Chk(CountPrefix("BarkBubble") == 0, "BarkBubble persisted (runtime-only law)");
            Chk(CountPrefix("IdentCard") == 0, "IdentCard persisted (runtime-only law)");
            Chk(GameObject.Find("SkylineFar") == null && GameObject.Find("AmbientTint") == null,
                "runtime-only visuals persisted into the scene");

            // ---- C. render gates: day/dusk/night L0 + L1-south ----
            amb.EnsureVisuals();
            amb.ApplyWeather("clear", 0f, 0);
            amb.StepWeather(0.1f);
            // r146 disk-purity: the runtime visual machinery must NOT spawn
            // a second crown (the crown is static scene scenery)
            Chk(CountCrowns() == 1, "CityAmbient spawned a duplicate crown (r146 disk-purity law)");
            GameObject crownGo = GameObject.Find(BrainCrownRules.Name);
            Chk(crownGo != null, "crown GO missing for render gate");
            int dayDelta = 0, duskDelta = 0, nightDelta = 0;
            int dayComposite = 0;
            float dayLum = 0f, duskLum = 0f, nightLum = 0f;
            amb.ApplyAmbient(AmbientTier.Day);
            SetCrown(crownGo, false);
            Texture2D dayBase = Shot(cam, null);
            SetCrown(crownGo, true);
            Texture2D dayOn = Shot(cam, null);
            CrownDelta(dayOn, dayBase, cam, out dayDelta, out dayComposite, out dayLum);
            Chk(dayDelta >= CrownFloor(), "crown invisible in the day L0 frame: " + dayDelta
                + "px (floor " + CrownFloor() + ")");
            Chk(dayComposite >= 20, "blade-visible-through-flanks composite face broken at day: "
                + dayComposite + " unchanged samples (min 20)");
            Chk(OutsideDelta(dayOn, dayBase, cam) == 0,
                "day zero-leak law: the crown must change nothing outside its rect");
            amb.ApplyAmbient(AmbientTier.Dusk);
            SetCrown(crownGo, false);
            Texture2D duskBase = Shot(cam, null);
            SetCrown(crownGo, true);
            Texture2D duskOn = Shot(cam, null);
            int duskJunk;
            CrownDelta(duskOn, duskBase, cam, out duskDelta, out duskJunk, out duskLum);
            Chk(duskDelta >= CrownFloor(), "crown invisible at dusk: " + duskDelta
                + "px (floor " + CrownFloor() + ")");
            int ridges = LitRidgeDelta(duskOn, duskBase, cam);
            Chk(ridges >= 15, "dusk lit-ridge census too thin: " + ridges
                + " blue-differential px (min 15 - the Lucy-blue sepal ridges must be visible)");
            amb.ApplyAmbient(AmbientTier.Night);
            SetCrown(crownGo, false);
            Texture2D nightBase = Shot(cam, null);
            SetCrown(crownGo, true);
            Texture2D nightOn = Shot(cam, null);
            int nightJunk;
            CrownDelta(nightOn, nightBase, cam, out nightDelta, out nightJunk, out nightLum);
            Chk(nightDelta >= CrownFloor(), "crown invisible at night: " + nightDelta
                + "px (floor " + CrownFloor() + ")");
            // atmosphere law: the bud must sit under the ambient wheel
            Chk(nightLum < duskLum, "night crown must sit under dusk (atmosphere law): "
                + nightLum.ToString("F3") + " vs " + duskLum.ToString("F3"));

            // the round's four evidence frames (facades + crown on, r119 law)
            amb.ApplyAmbient(AmbientTier.Day);
            Shot(cam, "m1-r177-landmarks-day.png");
            amb.ApplyAmbient(AmbientTier.Dusk);
            Shot(cam, "m1-r177-landmarks-dusk.png");
            amb.ApplyAmbient(AmbientTier.Night);
            Shot(cam, "m1-r177-landmarks-night.png");
            Vector3 origPos = cam.transform.position;
            float origSize = cam.orthographicSize;
            cam.orthographicSize = RigMath.L1Size;
            cam.transform.position = new Vector3(0.5f, -5f, origPos.z);
            Shot(cam, "m1-r177-landmarks-l1-south.png");
            cam.orthographicSize = origSize;
            cam.transform.position = origPos;

            UnityEngine.Object.DestroyImmediate(dayBase); UnityEngine.Object.DestroyImmediate(dayOn);
            UnityEngine.Object.DestroyImmediate(duskBase); UnityEngine.Object.DestroyImmediate(duskOn);
            UnityEngine.Object.DestroyImmediate(nightBase); UnityEngine.Object.DestroyImmediate(nightOn);

            return "asserts=" + asserts
                + " crown=1/" + BrainCrownRules.Count
                + " census(south_tiles=" + q0 + "/" + g0 + "/" + m0
                + ",near_white=0,lit_ridges=" + BrainCrownRules.LitPx + ",opaque=" + BrainCrownRules.OpaquePx + ")"
                + " needles(mid_bottom=" + midBottom.ToString("F4") + ",dips=" + lftDip.ToString("F5")
                + "/" + rgtDip.ToString("F5") + ")"
                + " " + rimReport
                + " scene(saved=" + saved + ",fac" + facKept + "_neon" + neonKept
                + "_robot" + robotKept + "_res" + resKept + "_tag" + tagKept + "_veh" + vehKept
                + "_off" + offKept + "_ter" + terKept + "_lab" + labKept + ")"
                + " render(day_px=" + dayDelta + " composite=" + dayComposite
                + " dusk_px=" + duskDelta + " ridges=" + ridges
                + " night_px=" + nightDelta
                + " lum dusk=" + duskLum.ToString("F3") + " night=" + nightLum.ToString("F3") + ")"
                + " shots=4";
        }

        static string ReloadProve()
        {
            Scene scene = EditorSceneManager.OpenScene(ScenePath, OpenSceneMode.Single);
            if (!scene.isLoaded) throw new InvalidOperationException("CityScene failed to load");
            Chk(CountCrowns() == BrainCrownRules.Count, "crown count after editor restart != table: " + CountCrowns());
            GameObject go = GameObject.Find(BrainCrownRules.Name);
            Chk(go != null, "crown lost across sessions");
            SpriteRenderer sr = go != null ? go.GetComponent<SpriteRenderer>() : null;
            Chk(sr != null && sr.sprite != null, "crown sprite unresolved after restart");
            Chk(sr != null && sr.sortingOrder == BrainCrownRules.Order, "crown order lost across restart");
            Chk(go != null && Mathf.Abs(go.transform.position.x - BrainCrownRules.PosX) < 1e-4f
                && Mathf.Abs(go.transform.position.y - BrainCrownRules.PosY) < 1e-4f,
                "crown position lost across restart");
            TextureImporter imp = (TextureImporter)TextureImporter.GetAtPath(BrainCrownRules.Path);
            Chk(imp != null && imp.textureType == TextureImporterType.Sprite, "importer type lost: " + BrainCrownRules.Path);
            Chk(imp != null && imp.filterMode == FilterMode.Point, "point filter lost: " + BrainCrownRules.Path);
            Chk(imp != null && Mathf.Abs(imp.spritePixelsPerUnit - 24f) < 0.01f, "PPU24 lost: " + BrainCrownRules.Path);
            Chk(imp != null && !imp.mipmapEnabled, "mips re-enabled: " + BrainCrownRules.Path);
            int fac = 0;
            foreach (SpriteRenderer s in UnityEngine.Object.FindObjectsOfType<SpriteRenderer>())
                if (s.name.StartsWith(FacadeRules.NamePrefix)) fac++;
            Chk(fac == FacadeRules.Count, "facades lost across restart: " + fac);
            for (int i = 0; i < FacadeRules.Count; i++)
            {
                TextureImporter fi = (TextureImporter)TextureImporter.GetAtPath(FacadeRules.Path(i));
                Chk(fi != null && fi.textureType == TextureImporterType.Sprite, "facade importer type lost: " + FacadeRules.Path(i));
                Chk(fi != null && Mathf.Abs(fi.spritePixelsPerUnit - 24f) < 0.01f, "facade PPU24 lost: " + FacadeRules.Path(i));
            }
            int neonKept = 0;
            foreach (SpriteRenderer s in UnityEngine.Object.FindObjectsOfType<SpriteRenderer>())
                if (s.name.StartsWith(NeonRules.NamePrefix)) neonKept++;
            Chk(neonKept == NeonRules.Count, "neon signs lost across restart: " + neonKept);
            int q = TileCount("CityQUANT"), g = TileCount("CityGAME"), m = TileCount("CityMEDIA");
            Chk(q == 40 && g == 49 && m == 54, "south city tile counts off canon after restart: " + q + "/" + g + "/" + m);
            return "reload_gate=OK crown=" + CountCrowns() + "/" + BrainCrownRules.Count
                + " facades=" + fac + "/" + FacadeRules.Count
                + " importers=crown+4facades(sprite+ppu24) neon=" + neonKept + "/" + NeonRules.Count
                + " south_tiles=" + q + "/" + g + "/" + m;
        }

        static NeonRules.Sign FindSign(string name)
        {
            for (int i = 0; i < NeonRules.Count; i++)
                if (NeonRules.Name(i) == name) return NeonRules.At(i);
            throw new InvalidOperationException("sign missing from NeonRules: " + name);
        }

        // sweep every root-level BrainCrown* GO, then build 1 from the table
        // (fresh LoadAssetAtPath at every use = r10 fake-null law)
        static void BuildCrown()
        {
            foreach (Transform t in UnityEngine.Object.FindObjectsOfType<Transform>())
                if (t.parent == null && t.name.StartsWith(BrainCrownRules.NamePrefix))
                    UnityEngine.Object.DestroyImmediate(t.gameObject);
            GameObject go = new GameObject(BrainCrownRules.Name);
            go.transform.position = new Vector3(BrainCrownRules.PosX, BrainCrownRules.PosY, BrainCrownRules.Z);
            SpriteRenderer sr = go.AddComponent<SpriteRenderer>();
            sr.sprite = AssetDatabase.LoadAssetAtPath<Sprite>(BrainCrownRules.Path);
            if (sr.sprite == null)
                throw new InvalidOperationException("crown sprite resolve failed: " + BrainCrownRules.Path);
            sr.sortingOrder = BrainCrownRules.Order;
        }

        static int CountCrowns()
        {
            int c = 0;
            foreach (SpriteRenderer sr in UnityEngine.Object.FindObjectsOfType<SpriteRenderer>())
                if (sr.name.StartsWith(BrainCrownRules.NamePrefix)) c++;
            return c;
        }

        static void SetCrown(GameObject go, bool on)
        {
            if (go != null) go.SetActive(on);
        }

        // the crown rect vs every MOBILE/STANDING live source (FacadeProof
        // CensusMobile family). Signs (order 6), rim (order 5) and the light
        // layers ride ABOVE by design - excluded here, reported/gated by
        // their own proofs.
        static void CensusMobile(string id)
        {
            int[] northRows = { 0, 1, 2, 3 };
            for (int n = 0; n < northRows.Length; n++)
            {
                NeonRules.Building b = NeonRules.BuildingAt(northRows[n]);
                Chk(!Overlap(BrainCrownRules.X0, BrainCrownRules.Y0, BrainCrownRules.X1, BrainCrownRules.Y1,
                    b.x0, b.y0, b.x1, b.y1), "crown clips north building row " + northRows[n]);
            }
            for (int s = 0; s < ResidentRules.Count; s++)
            {
                Vector2 c = ResidentRules.Pos(s);
                float half = ResidentRules.WorldW(s) / 2f;
                Chk(!Overlap(BrainCrownRules.X0, BrainCrownRules.Y0, BrainCrownRules.X1, BrainCrownRules.Y1,
                    c.x - half, c.y - half, c.x + half, c.y + half), "crown clips resident " + ResidentRules.Name(s));
            }
            for (int r = 0; r < RobotRules.Count; r++)
            {
                Vector2 c = RobotRules.Pos(r);
                float half = RobotRules.WorldW(r) / 2f;
                Chk(!Overlap(BrainCrownRules.X0, BrainCrownRules.Y0, BrainCrownRules.X1, BrainCrownRules.Y1,
                    c.x - half, c.y - half, c.x + half, c.y + half), "crown clips robot " + RobotRules.Name(r));
            }
            for (int v = 0; v < VehicleRules.Count; v++)
            {
                float vw = VehicleRules.WorldW(v) / 2f, vh = VehicleRules.WorldH(v);
                float vx = VehicleRules.Pos(v).x, gy = VehicleRules.FeetY(v);
                Chk(!Overlap(BrainCrownRules.X0, BrainCrownRules.Y0, BrainCrownRules.X1, BrainCrownRules.Y1,
                    vx - vw, gy, vx + vw, gy + vh), "crown clips vehicle " + VehicleRules.Name(v));
            }
            for (int e = 0; e < StreetBehaviorRules.EaveCount; e++)
            {
                Vector2 ep = StreetBehaviorRules.EavePos(e);
                float eh = ResidentRules.WorldW(0) / 2f;   // seat-class body 1.333u (r123 law)
                Chk(!Overlap(BrainCrownRules.X0, BrainCrownRules.Y0, BrainCrownRules.X1, BrainCrownRules.Y1,
                    ep.x - eh, ep.y - eh, ep.x + eh, ep.y + eh), "crown clips eave slot " + StreetBehaviorRules.Eave(e).id);
            }
            for (int o = 0; o < OfficeRules.Count; o++)
                Chk(!Overlap(BrainCrownRules.X0, BrainCrownRules.Y0, BrainCrownRules.X1, BrainCrownRules.Y1,
                    OfficeRules.X0(o), OfficeRules.Y0(o), OfficeRules.X1(o), OfficeRules.Y1(o)),
                    "crown clips office " + OfficeRules.Name(o));
            for (int tt = 0; tt < OfficeRules.GroundCount; tt++)
            {
                Vector2 tc = OfficeRules.GroundPos(tt);
                float tw = OfficeRules.GroundWorldW(tt) / 2f, th = OfficeRules.GroundWorldH(tt) / 2f;
                Chk(!Overlap(BrainCrownRules.X0, BrainCrownRules.Y0, BrainCrownRules.X1, BrainCrownRules.Y1,
                    tc.x - tw, tc.y - th, tc.x + tw, tc.y + th), "crown clips terrace " + OfficeRules.GroundName(tt));
            }
            for (int l = 0; l < LabsRules.Count; l++)
                Chk(!Overlap(BrainCrownRules.X0, BrainCrownRules.Y0, BrainCrownRules.X1, BrainCrownRules.Y1,
                    LabsRules.X0(l), LabsRules.Y0(l), LabsRules.X1(l), LabsRules.Y1(l)),
                    "crown clips lab mount " + LabsRules.Name(l));
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

        // window rect (crown rect + 0.15u margin) in screen px for a camera
        static void Window(Camera cam, out int px0, out int py0, out int px1, out int py1)
        {
            Vector2 c = BrainCrownRules.Pos();
            float hw = BrainCrownRules.WorldW() / 2f + 0.15f;
            float hh = BrainCrownRules.WorldH() / 2f + 0.15f;
            float halfH = cam.orthographicSize;
            float halfW = halfH * (1920f / 1080f);
            float cx = cam.transform.position.x, cy = cam.transform.position.y;
            px0 = (int)(((c.x - hw - cx) / (2f * halfW) + 0.5f) * 1920f);
            px1 = (int)(((c.x + hw - cx) / (2f * halfW) + 0.5f) * 1920f);
            py0 = (int)(((c.y - hh - cy) / (2f * halfH) + 0.5f) * 1080f);
            py1 = (int)(((c.y + hh - cy) / (2f * halfH) + 0.5f) * 1080f);
            px0 = Math.Max(0, px0); px1 = Math.Min(1919, px1);
            py0 = Math.Max(0, py0); py1 = Math.Min(1079, py1);
        }

        // crown on/off delta in the window (step-3 sampling, WinDelta r111
        // law family): deltaCount = changed samples, unchanged = the
        // blade-visible-through-flanks composite face, avgLum over changed.
        static void CrownDelta(Texture2D on, Texture2D off, Camera cam,
            out int deltaCount, out int unchanged, out float avgLum)
        {
            int px0, py0, px1, py1;
            Window(cam, out px0, out py0, out px1, out py1);
            double lum = 0; int n = 0, u = 0;
            for (int y = py0; y <= py1; y += 3)
                for (int x = px0; x <= px1; x += 3)
                {
                    Color ca = on.GetPixel(x, y);
                    Color cb = off.GetPixel(x, y);
                    float d = Math.Abs(ca.r - cb.r) + Math.Abs(ca.g - cb.g) + Math.Abs(ca.b - cb.b);
                    if (d > 0.06f) { n++; lum += (ca.r + ca.g + ca.b) / 3.0; }
                    else u++;
                }
            deltaCount = n;
            unchanged = u;
            avgLum = n > 0 ? (float)(lum / n) : 0f;
        }

        // dusk lit-ridge census (full-res): screen px in the crown window
        // where the ON frame is BLUER than the OFF frame by a clear margin -
        // the Lucy-blue sepal ridges appear only with the crown (ambient-robust
        // differential: the tint layer rides both frames equally).
        static int LitRidgeDelta(Texture2D on, Texture2D off, Camera cam)
        {
            int px0, py0, px1, py1;
            Window(cam, out px0, out py0, out px1, out py1);
            int n = 0;
            for (int y = py0; y <= py1; y++)
                for (int x = px0; x <= px1; x++)
                {
                    Color ca = on.GetPixel(x, y);
                    Color cb = off.GetPixel(x, y);
                    float dBlue = (ca.b - ca.r) - (cb.b - cb.r);
                    if (dBlue > 0.05f) n++;
                }
            return n;
        }

        // day zero-leak: changed samples OUTSIDE the crown window (step 3)
        static int OutsideDelta(Texture2D on, Texture2D off, Camera cam)
        {
            int px0, py0, px1, py1;
            Window(cam, out px0, out py0, out px1, out py1);
            int n = 0;
            for (int y = 0; y < 1080; y += 3)
                for (int x = 0; x < 1920; x += 3)
                {
                    if (x >= px0 - 3 && x <= px1 + 3 && y >= py0 - 3 && y <= py1 + 3) continue;
                    Color ca = on.GetPixel(x, y);
                    Color cb = off.GetPixel(x, y);
                    float d = Math.Abs(ca.r - cb.r) + Math.Abs(ca.g - cb.g) + Math.Abs(ca.b - cb.b);
                    if (d > 0.06f) n++;
                }
            return n;
        }

        // per-tier floor (FacadeProof 15% law, min 60): the crown must change
        // at least 15% of its tight-rect sample grid vs the tile art beneath
        static int CrownFloor()
        {
            int cols = (int)(BrainCrownRules.WorldW() * 27f / 3f);
            int rows = (int)(BrainCrownRules.WorldH() * 27f / 3f);
            return Math.Max(60, (int)(cols * rows * 0.15f));
        }
    }
}
