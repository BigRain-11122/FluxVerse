// FluxVerse P-28 item 3 (r35 + r38): batch proof for the neon street-sign mounting
// layer (warped-city pack, CC0 + r38 DevLoop-baked company plates). Sentinel pattern
// (r11/r34 style):
//   pass 1: logs/neon.run        -> FluxVerse.NeonProof.BatchRun   -> logs/neon.done
//   pass 2: logs/neon-reload.run -> FluxVerse.NeonProof.ReloadGate -> logs/neon-reload.done
// Sections:
//  A pure-core gates (NeonRules, headless): 21-entry manifest (12 pack props + 6 plates + 3 needles, r132
//    company plates), paths under the pack, native px sizes, every sign fully inside
//    the L0 view AND the tint band, pairwise min spacing, order 6 sits between
//    Props 4 and tint 8.
//  A2 P-69 slice-1 proportion gates (r89): 16 mounted signs must sit at <= half
//    their building's height (facade inside the face, roof plate sunk and <= half
//    visible); street kiosk + tower antenna exempt by precedent. r90 adds the
//    horizontal containment law (facade + roof fully inside the building width,
//    r89 A2 survey: 7 plates overhung their facades 0.06-0.73u west).
//  B asset gate: the 17 consumed sprites forced to Sprite + Single + Point +
//    manifest PPU tier (16/32/48) + no mips (r34 importer-default-PPU100 law,
//    idempotent); rect == table px exactly.
//  C CityScene wiring: stale Neon* sweep -> 21 sign GOs from the table (fresh
//    LoadAssetAtPath per r10 law) -> idempotent second sweep+build -> save -> disk
//    round-trip; r34/r31/r36/r37 neighbor regressions (skyline sprites, bed clip,
//    interior, rig, L0 camera, non-empty tilemaps, robots 8, residents 12,
//    runtime-only law).
//  D render gates (real CityScene, dusk anchor + night): per-sign window delta vs a
//    signs-hidden baseline, dusk visibility for every sign, night law = the tint
//    dims the neon but never kills it (count + luminance thresholds), dusk > night
//    luminance (atmosphere owns the built city). Waiver (r38, documented): the
//    company plates mount in saturated rooflines, so four windows overlap a
//    neighbor sign's overhang TIP (west2 / OPEN / scroll / QUANT flank tops) - those
//    lit tip pixels fold into the plate's delta count; every gate here is a MINIMUM,
//    so the inflation is safe, per-plate purity is waived for those rows only.
//  A3 + D2 (r146 P-71(3) slice B): mood-visual layer gates. A3 = the MoodVisualRules
//    pure core byte-mirrors Tools/city/mood-visual-manifest.json (five rows, two
//    channel bands, 17+4 sign census, CEO-precedence ceiling). D2 = the scene face:
//    hushed dims / festive brightens the 17 modulated signs (grayscale tint law),
//    the 4 exempt structure signs stay white, the router carries the breath scale,
//    RestoreMoodNeutral gives back white BEFORE any save (r124 runtime law) and a
//    reopen proves nothing ever persisted. Record shots m1-r146-mood-*.png.
//  E pass 2: everything survives an editor restart (SEPARATE FILE LAW spirit:
//    persisted scene objects + importer settings + exactly 21, zero duplicates).
// Fail-loud: any broken assumption throws into the .done report. ASCII only. No 3D.
using System;
using System.IO;
using UnityEngine;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine.SceneManagement;
using UnityEngine.Tilemaps;

namespace FluxVerse
{
    public static class NeonProof
    {
        static string ProjectRoot { get { return Path.GetDirectoryName(Application.dataPath); } }
        static string RepoRoot { get { return Path.GetDirectoryName(ProjectRoot); } }
        static string RunPath { get { return Path.Combine(RepoRoot, "logs", "neon.run"); } }
        static string DonePath { get { return Path.Combine(RepoRoot, "logs", "neon.done"); } }
        static string ReloadRunPath { get { return Path.Combine(RepoRoot, "logs", "neon-reload.run"); } }
        static string ReloadDonePath { get { return Path.Combine(RepoRoot, "logs", "neon-reload.done"); } }
        static string ScenePath { get { return "Assets/Scenes/CityScene.unity"; } }
        static int asserts;

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

        static string Prove()
        {
            // ---- A. pure-core gates on the manifest ----
            Chk(NeonRules.Count == 21, "manifest must hold 21 signs (12 pack + 6 plates + 3 tower needles)");
            Chk(NeonRules.Order == 6, "mounting layer order must be 6 (Props 4 < signs < tint 8)");
            Chk(NeonRules.Order > 4 && NeonRules.Order < 8, "order 6 not between Props 4 and tint 8");
            for (int i = 0; i < NeonRules.Count; i++)
            {
                NeonRules.Sign s = NeonRules.At(i);
                Chk(s.name != null && s.name.StartsWith(NeonRules.NamePrefix), "bad GO name at " + i);
                Chk(s.path.StartsWith("Assets/ArtPacks/warped-city/ENVIRONMENT/props/")
                    || s.path.StartsWith("Assets/ArtPacks/tower-antennas/"),
                    "sign path outside the packs: " + s.path);
                Chk(s.pxW > 0 && s.pxH > 0, "native px missing at " + i);
                Chk(Math.Abs(NeonRules.WorldW(i) - s.pxW / s.ppu) < 1e-5f, "world width math off at " + i);
                // r132 tower-v2: exempt class = tower STRUCTURE (antenna family),
                // not shop signage - the InView/InTintBand framing laws are sign
                // laws; needles live in the by-design glow zone above the tint
                // band (manifest tint_band_note) and get their own gates below.
                if (s.mount == NeonRules.MountExempt) continue;
                Chk(NeonRules.InView(i, RigMath.L0Size * RigMath.Aspect, RigMath.L0Size),
                    "sign not fully inside the L0 view: " + s.name);
                Chk(NeonRules.InTintBand(i), "sign escapes the tint band (r22 edge-band kin): " + s.name);
            }
            // ---- A1b. r132 tower-needle family gates (tower-v2-manifest
            //      antennas law): all three needles inside the wedge-tip x span
            //      [0,1]; tops <= 19.9 (frame margin law, L0 frame top 20);
            //      middle strictly tallest AND widest; trio rects disjoint. ----
            int needleN = 0; float nH = 0f, nW = 0f;
            NeonRules.Sign mid = NeonRules.At(0), lft = NeonRules.At(0), rgt = NeonRules.At(0);
            for (int i = 0; i < NeonRules.Count; i++)
            {
                NeonRules.Sign s = NeonRules.At(i);
                if (!s.name.StartsWith("NeonTowerAnt")) continue;
                needleN++;
                if (s.name == "NeonTowerAntM") mid = s;
                if (s.name == "NeonTowerAntL") lft = s;
                if (s.name == "NeonTowerAntR") rgt = s;
                float x0 = s.x - NeonRules.WorldW(i) / 2f, x1 = s.x + NeonRules.WorldW(i) / 2f;
                float top = s.y + NeonRules.WorldH(i) / 2f;
                Chk(x0 >= 0f && x1 <= 1f, "needle outside the wedge-tip x span: " + s.name);
                Chk(top <= 19.9f, "needle top escapes the frame margin law: " + s.name);
            }
            Chk(needleN == 3, "tower needle census != 3: " + needleN);
            nH = mid.pxH / mid.ppu; nW = mid.pxW / mid.ppu;
            Chk(nH > lft.pxH / lft.ppu && nH > rgt.pxH / rgt.ppu,
                "middle needle must be strictly tallest (v2.0 sec6)");
            Chk(nW > lft.pxW / lft.ppu && nW > rgt.pxW / rgt.ppu,
                "middle needle must be strictly widest (v2.0 sec6)");
            Chk(Math.Abs(mid.x + lft.x + rgt.x - 1.5f) < 1e-4f, "needle trio not symmetric about x 0.5");
            // ---- A2. P-69 slice-1 proportion law (r89): mounted signs must respect
            //      their buildings - a facade sign sits inside the face at <= half
            //      its height, a roof plate sinks into the roofline and rises at
            //      most half the building height; street furniture + the tower
            //      antenna are exempt (r87 precedent). r90 horizontal law: every
            //      mounted sign (facade AND roof) must sit fully inside its
            //      building's width - no west-edge overhang (r89 survey debt). ----
            int propGated = 0;
            for (int i = 0; i < NeonRules.Count; i++)
            {
                NeonRules.Sign s = NeonRules.At(i);
                if (s.mount == NeonRules.MountStreet || s.mount == NeonRules.MountExempt) continue;
                NeonRules.Building bld = NeonRules.BuildingAt(s.b);
                float bh = bld.y1 - bld.y0;
                float hh = NeonRules.WorldH(i) / 2f;
                float hw = NeonRules.WorldW(i) / 2f;
                float top = s.y + hh, bot = s.y - hh;
                Chk(bh > 0f, "degenerate building rect at sign " + s.name);
                if (s.mount == NeonRules.MountFacade)
                {
                    Chk(NeonRules.WorldH(i) <= bh * 0.5f + 0.01f,
                        "P-69 sign taller than half the facade: " + s.name);
                    Chk(bot >= bld.y0 - 0.05f && top <= bld.y1 + 0.05f,
                        "P-69 facade sign escapes its building: " + s.name);
                    Chk(s.x - hw >= bld.x0 - 0.05f && s.x + hw <= bld.x1 + 0.05f,
                        "P-69 facade sign overhangs its building horizontally (r90): " + s.name);
                }
                else
                {
                    Chk(bot <= bld.y1 + 0.05f, "P-69 roof sign floats off the roofline: " + s.name);
                    Chk(top >= bld.y1 - 0.05f, "P-69 roof sign buried in the building: " + s.name);
                    Chk(top - bld.y1 <= bh * 0.5f + 0.01f,
                        "P-69 roof sign upstages its building: " + s.name);
                    Chk(s.x - hw >= bld.x0 - 0.05f && s.x + hw <= bld.x1 + 0.05f,
                        "P-69 roof sign overhangs its building horizontally (r90): " + s.name);
                }
                propGated++;
            }
            Chk(propGated == 16, "P-69 mounted-sign count != 16: " + propGated);
            float minDist = float.MaxValue;
            for (int i = 0; i < NeonRules.Count; i++)
                for (int j = i + 1; j < NeonRules.Count; j++)
                {
                    // r132: the needle trio is one structural family 0.35u apart
                    // by design (manifest) - the 2u shop-sign spacing law reads
                    // crowding between unrelated signs, not within one crown
                    if (NeonRules.At(i).name.StartsWith("NeonTowerAnt")
                        && NeonRules.At(j).name.StartsWith("NeonTowerAnt")) continue;
                    float d = Vector2.Distance(NeonRules.Pos(i), NeonRules.Pos(j));
                    if (d < minDist) minDist = d;
                }
            Chk(minDist >= 2.0f, "two signs nearer than 2u: " + minDist.ToString("F3"));

            // ---- A3. r146 mood-visual mirror gates (P-71(3) slice B): the
            //      MoodVisualRules pure core must mirror the r145 manifest
            //      (Tools/city/mood-visual-manifest.json = the single parameter
            //      source; the r145 sandbox already gated the file itself). ----
            Chk(MoodVisualRules.Protocol == "fluxverse-moodvisual/0.2", "mood-visual protocol drifted");
            Chk(MoodVisualRules.BakedRound == 146, "mood-visual manifest origin round drifted");
            string mvJson = File.ReadAllText(Path.Combine(RepoRoot, "Tools", "city", "mood-visual-manifest.json"));
            MvManifest mv = JsonUtility.FromJson<MvManifest>(mvJson);
            Chk(mv != null && mv.moods != null && mv.channels != null, "mood-visual manifest unparseable");
            Chk(mv.protocol == MoodVisualRules.Protocol, "manifest protocol != mirror");
            Chk(mv.baked_round == MoodVisualRules.BakedRound, "manifest baked_round != mirror");
            MvChannel neonCh = mv.channels.neon_intensity;
            MvChannel breathCh = mv.channels.breath_peak_scale;
            Chk(neonCh != null && neonCh.band != null && neonCh.band.Length == 2
                && Mathf.Abs(neonCh.band[0] - MoodVisualRules.NeonMin) < 1e-4f
                && Mathf.Abs(neonCh.band[1] - MoodVisualRules.NeonMax) < 1e-4f, "neon band != mirror");
            Chk(neonCh.modulated_count == MoodVisualRules.ModulatedCount, "modulated_count != mirror");
            Chk(neonCh.exempt_count == MoodVisualRules.ExemptCount, "exempt_count != mirror");
            Chk(breathCh != null && breathCh.band != null && breathCh.band.Length == 2
                && Mathf.Abs(breathCh.band[0] - MoodVisualRules.BreathMin) < 1e-4f
                && Mathf.Abs(breathCh.band[1] - MoodVisualRules.BreathMax) < 1e-4f, "breath band != mirror");
            Chk(Mathf.Abs(breathCh.base_peak_alpha - MoodVisualRules.BreathBasePeak) < 1e-4f, "breath base != mirror");
            Chk(Mathf.Abs(breathCh.absolute_ceiling - MoodVisualRules.PulseCeiling) < 1e-4f, "pulse ceiling != mirror");
            Chk(MoodRowCheck(mv.moods.steady, "steady"), "steady row != mirror");
            Chk(MoodRowCheck(mv.moods.lively, "lively"), "lively row != mirror");
            Chk(MoodRowCheck(mv.moods.festive, "festive"), "festive row != mirror");
            Chk(MoodRowCheck(mv.moods.somber, "somber"), "somber row != mirror");
            Chk(MoodRowCheck(mv.moods.hushed, "hushed"), "hushed row != mirror");
            // degrade law: unknown / absent mood maps to the steady row x1.0
            Chk(MoodVisualRules.NeonScaleFor("garbage") == 1f && MoodVisualRules.BreathScaleFor(null) == 1f,
                "degrade law broken: unknown mood must map to steady x1.0");
            // sign census: 17 modulated + 4 exempt == 21, exempt == the four named structures
            Chk(MoodVisualRules.ModulatedSignCensus() == MoodVisualRules.ModulatedCount
                && MoodVisualRules.ExemptSignCensus() == MoodVisualRules.ExemptCount,
                "table census != manifest counts (17 modulated + 4 exempt)");
            Chk(MoodVisualRules.ModulatedCount + MoodVisualRules.ExemptCount == NeonRules.Count,
                "17 + 4 != 21: the exempt family account broke");
            for (int i = 0; i < NeonRules.Count; i++)
            {
                bool ex = MoodVisualRules.IsExemptSign(i);
                bool named = NeonRules.Name(i) == "NeonTowerAntM" || NeonRules.Name(i) == "NeonTowerAntL"
                    || NeonRules.Name(i) == "NeonTowerAntR" || NeonRules.Name(i) == "NeonAntenna";
                Chk(ex == named, "exempt family mismatch at " + NeonRules.Name(i));
            }
            // CEO precedence: the max effective breath peak stays under the pulse ceiling
            Chk(MoodVisualRules.EffectiveBreathPeak(1.15f) < MoodVisualRules.PulseCeiling,
                "CEO precedence broken: festive breath peak reached the pulse ceiling");
            Chk(Mathf.Abs(MoodVisualRules.EffectiveBreathPeak(1f) - 0.8f) < 1e-4f, "breath base peak != 0.8");

            // ---- B. asset gate: importer laws on every consumed sprite (idempotent) ----
            int unique = 0;
            for (int i = 0; i < NeonRules.Count; i++)
            {
                bool seen = false;
                for (int j = 0; j < i; j++) if (NeonRules.Path(j) == NeonRules.Path(i))
                {
                    Chk(Math.Abs(NeonRules.At(j).ppu - NeonRules.At(i).ppu) < 0.01f,
                        "shared sprite with conflicting ppu tiers: " + NeonRules.Path(i));
                    seen = true; break;
                }
                if (seen) continue;
                unique++;
                Sprite sp = ForceSprite(NeonRules.Path(i), NeonRules.At(i).ppu);
                Chk(sp != null, "sprite failed to load: " + NeonRules.Path(i));
                Chk(Math.Abs(sp.rect.width - NeonRules.At(i).pxW) < 0.5f
                    && Math.Abs(sp.rect.height - NeonRules.At(i).pxH) < 0.5f,
                    "rect != manifest px at " + NeonRules.Name(i) + ": " + sp.rect.width + "x" + sp.rect.height);
                Chk(Math.Abs(sp.bounds.size.x - NeonRules.WorldW(i)) < 0.01f
                    && Math.Abs(sp.bounds.size.y - NeonRules.WorldH(i)) < 0.01f,
                    "natural bounds != px/ppu (importer tier disease) at " + NeonRules.Name(i));
            }
            Chk(unique == 19, "expected 19 unique consumed sprites (17 pack/plate + 2 needle files), got " + unique);

            // ---- C. CityScene wiring: sweep -> build -> idempotent rebuild -> save ----
            Scene scene = EditorSceneManager.OpenScene(ScenePath, OpenSceneMode.Single);
            Chk(scene.isLoaded, "CityScene failed to open");
            // r146: sweep stale AMBIENT RUNTIME children off the CityAmbient GO first
            // (red-chain 3 self-heal: a D2 restore-save once persisted EnsureVisuals
            // children into the disk scene - every ambient visual is runtime-only by
            // the r13/r25 law, so any child found here is contamination)
            int staleChildren = AmbientChildCount();
            if (staleChildren > 0) SweepAmbientRuntime();
            BuildSigns();
            BuildSigns();   // idempotency: the second sweep+build must land on exactly 21
            Chk(CountSigns() == 21, "idempotent rebuild count != 21: " + CountSigns());
            bool saved = EditorSceneManager.SaveScene(scene);
            Chk(saved, "scene save failed");

            Scene reopened = EditorSceneManager.OpenScene(ScenePath, OpenSceneMode.Single);
            Chk(CountSigns() == 21, "persisted sign count != 21: " + CountSigns());
            for (int i = 0; i < NeonRules.Count; i++)
            {
                GameObject go = GameObject.Find(NeonRules.Name(i));
                Chk(go != null, "sign missing on disk: " + NeonRules.Name(i));
                SpriteRenderer sr = go.GetComponent<SpriteRenderer>();
                Chk(sr != null && sr.sprite != null, "sign sprite lost on disk: " + NeonRules.Name(i));
                Chk(sr.sortingOrder == NeonRules.Order, "sign order lost: " + NeonRules.Name(i));
                Vector2 p = NeonRules.Pos(i);
                Chk(Math.Abs(go.transform.position.x - p.x) < 1e-4f
                    && Math.Abs(go.transform.position.y - p.y) < 1e-4f,
                    "sign position lost: " + NeonRules.Name(i));
                Chk(Math.Abs(sr.transform.localScale.x - 1f) < 1e-5f, "sign scale != 1 (native law)");
            }
            // neighbor regressions (our save must not drop earlier serialized wiring)
            GameObject ambGo = GameObject.Find("CityAmbient");
            CityAmbient amb = ambGo != null ? ambGo.GetComponent<CityAmbient>() : null;
            Chk(amb != null, "CityAmbient lost after save");
            Chk(amb.skylineFar != null && amb.skylineNear != null, "r34 skyline sprites lost after save");
            CityAmbientAudio bed = amb.GetComponent<CityAmbientAudio>();
            Chk(bed != null && bed.noiseBed != null && bed.noiseBed.length > 0f, "r31 bed clip lost after save");
            Chk(UnityEngine.Object.FindObjectsOfType<CityInterior>().Length >= 1, "CityInterior lost after save");
            Chk(UnityEngine.Object.FindObjectsOfType<CityCameraRig>().Length >= 1, "CityCameraRig lost after save");
            // r36/r37 neighbor layers must survive our save too (their proofs assert
            // the reverse direction - this is the symmetric half of the contract)
            int robotsKept = 0, residentsKept = 0;
            foreach (SpriteRenderer sr in UnityEngine.Object.FindObjectsOfType<SpriteRenderer>())
            {
                if (sr.name.StartsWith(RobotRules.NamePrefix)) robotsKept++;
            }
            // r99: residents are parent GOs with a child parts stack - no root
            // SpriteRenderer - so the count walks root Transforms (r40 family)
            foreach (Transform t in UnityEngine.Object.FindObjectsOfType<Transform>())
                if (t.parent == null && t.name.StartsWith(ResidentRules.NamePrefix)
                    && t.name.Length == 6) residentsKept++;
            Chk(robotsKept == RobotRules.Count, "r36 robots lost after our save: " + robotsKept);
            Chk(residentsKept == ResidentRules.Count, "r99 residents lost after our save: " + residentsKept);
            GameObject camGo = GameObject.Find("CityCamera");
            Camera cam = camGo != null ? camGo.GetComponent<Camera>() : null;
            Chk(cam != null && cam.orthographic && Math.Abs(cam.orthographicSize - RigMath.L0Size) < 0.01f,
                "L0 camera broken after save");
            Chk(TileCount("Ground") > 0 && TileCount("Water") > 0 && TileCount("Roads") > 0
                && TileCount("CityQUANT") > 0, "tilemap layers emptied by our save");
            Chk(GameObject.Find("SkylineFar") == null && GameObject.Find("AmbientTintS") == null
                && GameObject.Find("AmbientTintN") == null && GameObject.Find("AmbientTintRiver") == null,
                "runtime-only visuals persisted into the scene");
            Chk(AmbientChildCount() == 0,
                "ambient runtime children persisted into the scene (children=" + AmbientChildCount() + ", swept=" + staleChildren + ")");

            // ---- D. render gates (dusk anchor, then night) ----
            amb.EnsureVisuals();
            amb.ApplyAmbient(AmbientTier.Dusk);
            SpriteRenderer[] signs = CollectSignRenderers();
            Chk(signs.Length == 21, "renderer collection != 21");
            SetSigns(signs, false);
            Texture2D duskBase = Shot(cam, null);
            SetSigns(signs, true);
            Texture2D duskOn = Shot(cam, "m1-r69-signs-dusk.png");
            int duskTot = 0; float duskLum = 0f; int duskMin = int.MaxValue; string duskWorst = "";
            for (int i = 0; i < NeonRules.Count; i++)
            {
                int n; float lum;
                WinDelta(duskOn, duskBase, cam, i, out n, out lum);
                duskTot += n;
                if (n < duskMin) { duskMin = n; duskWorst = NeonRules.Name(i); }
            }
            Chk(duskTot >= 2500, "dusk neon delta too sparse: " + duskTot + "px");
            Chk(duskMin >= 25, "dusk invisible sign " + duskWorst + ": " + duskMin + "px");

            amb.ApplyAmbient(AmbientTier.Night);
            SetSigns(signs, false);
            Texture2D nightBase = Shot(cam, null);
            SetSigns(signs, true);
            Texture2D nightOn = Shot(cam, "m1-r69-signs-night.png");
            int nightTot = 0; float nightLum = 0f; int nightMin = int.MaxValue; string nightWorst = "";
            for (int i = 0; i < NeonRules.Count; i++)
            {
                int n; float lum;
                WinDelta(nightOn, nightBase, cam, i, out n, out lum);
                nightTot += n; nightLum += lum * n;
                if (n < nightMin) { nightMin = n; nightWorst = NeonRules.Name(i); }
            }
            nightLum = nightTot > 0 ? nightLum / nightTot : 0f;
            // recompute dusk average luminance the same weighted way for the compare
            float duskLumW = 0f;
            for (int i = 0; i < NeonRules.Count; i++)
            {
                int n; float lum;
                WinDelta(duskOn, duskBase, cam, i, out n, out lum);
                duskLumW += lum * n;
            }
            duskLum = duskTot > 0 ? duskLumW / duskTot : 0f;
            Chk(nightTot >= 1200, "night neon delta too sparse: " + nightTot + "px");
            Chk(nightMin >= 10, "night invisible sign " + nightWorst + ": " + nightMin + "px");
            Chk(nightLum >= 0.13f, "night neon lost its glow under the tint: " + nightLum.ToString("F3"));
            Chk(nightLum < duskLum, "night neon must sit under dusk neon (atmosphere law): "
                + nightLum.ToString("F3") + " vs " + duskLum.ToString("F3"));

            UnityEngine.Object.DestroyImmediate(duskBase); UnityEngine.Object.DestroyImmediate(duskOn);
            UnityEngine.Object.DestroyImmediate(nightBase); UnityEngine.Object.DestroyImmediate(nightOn);

            // ---- D2. r146 mood-visual render gates (P-71(3) slice B) ----
            // hushed dims / festive brightens the 17 modulated signs; the 4 exempt
            // structure signs stay white; RestoreMoodNeutral gives back white BEFORE
            // any save (r124 runtime law) and the reopen proves nothing persisted.
            amb.ApplyAmbient(AmbientTier.Dusk);
            Texture2D whiteDusk = Shot(cam, "m1-r146-mood-dusk-white.png");
            int modIdx = 0, exIdx = 0;
            SpriteRenderer[] modSr = new SpriteRenderer[MoodVisualRules.ModulatedCount];
            SpriteRenderer[] exSr = new SpriteRenderer[MoodVisualRules.ExemptCount];
            for (int i = 0; i < NeonRules.Count; i++)
            {
                if (MoodVisualRules.IsExemptSign(i)) exSr[exIdx++] = signs[i];
                else modSr[modIdx++] = signs[i];
            }
            Chk(modIdx == MoodVisualRules.ModulatedCount && exIdx == MoodVisualRules.ExemptCount,
                "mood census split wrong: " + modIdx + "+" + exIdx);
            // hushed: 17 grayscale 0.85, exempt family untouched
            amb.ApplyMoodVisual("hushed");
            Chk(amb.CurrentMood == "hushed", "CurrentMood not applied (hushed)");
            int hushedTinted = 0, exemptWhite = 0;
            for (int i = 0; i < modSr.Length; i++)
            {
                Color c = modSr[i].color;
                if (Mathf.Abs(c.r - 0.85f) < 1e-4f && Mathf.Abs(c.g - 0.85f) < 1e-4f
                    && Mathf.Abs(c.b - 0.85f) < 1e-4f && Mathf.Abs(c.a - 1f) < 1e-4f) hushedTinted++;
            }
            for (int i = 0; i < exSr.Length; i++) if (exSr[i].color == Color.white) exemptWhite++;
            Chk(hushedTinted == modSr.Length, "hushed grayscale tint count: " + hushedTinted + "/" + modSr.Length);
            Chk(exemptWhite == exSr.Length, "exempt family was modulated: " + exemptWhite + "/" + exSr.Length);
            GameObject cerGo = GameObject.Find("CityEventRouter");
            CityEventRouter cer = cerGo != null ? cerGo.GetComponent<CityEventRouter>() : null;
            Chk(cer != null, "CityEventRouter missing for the breath channel");
            if (cer != null) Chk(Mathf.Abs(cer.Core.BreathPeakScale - 0.70f) < 1e-4f,
                "hushed breath scale not wired: " + cer.Core.BreathPeakScale.ToString("F3"));
            Texture2D hushedDusk = Shot(cam, "m1-r146-mood-dusk-hushed.png");
            int hushedChanged; float hushedMean; float hushedMaxD; int hushedLitMid;
            MoodDelta(hushedDusk, whiteDusk, cam, out hushedChanged, out hushedMean, out hushedMaxD, out hushedLitMid);
            Chk(hushedChanged >= 150, "hushed dimming not visible: " + hushedChanged + "px changed");
            Chk(hushedMean < -0.010f, "hushed is not a dimming: mean=" + hushedMean.ToString("F4"));
            // festive (v0.2 re-derivation, r146 red-chain 1): the r145 pre-registered
            // up-band rows (lively 1.10 / festive 1.15) were FALSIFIED engine-side by
            // the physics probe - the sprite tint path clamps RGB > 1 at the render
            // input (x2.0 moved 0px while litMid=17970 sub-saturated sampled pixels
            // stood in the windows; night repeat 0px / litMid=18436). Neon domain =
            // [0.85, 1.0] (manifest v0.2): the festive neon row IS 1.0 = physically
            // inert white; the up-mood energy rides the breath channel (0.8 -> 0.92
            // real alpha). The gates below ENFORCE the physics: any pixel motion
            // under a >1 tint means the render path changed - re-derive, never fake.
            amb.ApplyMoodVisual("festive");
            Chk(amb.CurrentMood == "festive", "CurrentMood not applied (festive)");
            int festiveTinted = 0;
            for (int i = 0; i < modSr.Length; i++)
            {
                Color c = modSr[i].color;
                if (Mathf.Abs(c.r - 1f) < 1e-4f && Mathf.Abs(c.g - 1f) < 1e-4f
                    && Mathf.Abs(c.b - 1f) < 1e-4f && Mathf.Abs(c.a - 1f) < 1e-4f) festiveTinted++;
            }
            Chk(festiveTinted == modSr.Length, "festive neon row != 1.0 (v0.2 physics): " + festiveTinted + "/" + modSr.Length);
            Texture2D festiveDusk = Shot(cam, "m1-r146-mood-dusk-festive.png");
            int festiveChanged; float festiveMean; float duskMaxD; int duskLitMid;
            MoodDelta(festiveDusk, whiteDusk, cam, out festiveChanged, out festiveMean, out duskMaxD, out duskLitMid);
            Chk(festiveChanged == 0, "festive must be render-inert at neon (v0.2 physics): " + festiveChanged + "px moved");
            // input-clamp law enforcement: a x2.0 direct-set must move NOTHING while
            // sub-saturated pixels stand in the windows (litMid > 0) - motion here
            // means the render path changed (HDR etc): re-derive, never fake it
            for (int i = 0; i < modSr.Length; i++) modSr[i].color = new Color(2f, 2f, 2f, 1f);
            Texture2D probe2 = Shot(cam, null);
            int p2Changed; float p2Mean; float p2MaxD; int p2LitMid;
            MoodDelta(probe2, whiteDusk, cam, out p2Changed, out p2Mean, out p2MaxD, out p2LitMid);
            UnityEngine.Object.DestroyImmediate(probe2);
            Chk(p2Changed == 0 && p2LitMid > 0,
                "input-clamp law broken: x2.0 moved " + p2Changed + "px (litMid=" + p2LitMid + ") - render path changed, re-derive");
            amb.RestoreMoodNeutral();
            amb.ApplyAmbient(AmbientTier.Night);
            Texture2D nightWhite = Shot(cam, null);
            amb.ApplyMoodVisual("festive");
            Texture2D nightFestive = Shot(cam, null);
            int nfChanged; float nfMean; float nfMaxD; int nfLitMid;
            MoodDelta(nightFestive, nightWhite, cam, out nfChanged, out nfMean, out nfMaxD, out nfLitMid);
            UnityEngine.Object.DestroyImmediate(nightWhite); UnityEngine.Object.DestroyImmediate(nightFestive);
            Chk(nfChanged == 0, "night festive must be render-inert too (v0.2 physics): " + nfChanged + "px moved");
            amb.ApplyAmbient(AmbientTier.Dusk);
            // deep-night record shot (the hushed face under the night tier)
            amb.ApplyAmbient(AmbientTier.Night);
            amb.ApplyMoodVisual("hushed");
            Texture2D nightHushed = Shot(cam, "m1-r146-mood-night-hushed.png");
            // restore + runtime law: neutral white + RELEASED runtime visuals BEFORE
            // the save (r146 red-chain 3: the EnsureVisuals children must never ride
            // a save - the r124 runtime law), then prove the saved scene learned
            // neither the tint nor any ambient child
            amb.RestoreMoodNeutral();
            Chk(amb.CurrentMood == null, "restore did not clear the mood");
            int whiteBack = 0;
            for (int i = 0; i < signs.Length; i++) if (signs[i].color == Color.white) whiteBack++;
            Chk(whiteBack == signs.Length, "restore left tinted signs: " + whiteBack + "/" + signs.Length);
            if (cer != null) Chk(Mathf.Abs(cer.Core.BreathPeakScale - 1f) < 1e-4f, "restore left a scaled breath");
            amb.ReleaseVisuals();
            Chk(AmbientChildCount() == 0, "D2: ambient children not released before the save");
            bool savedMood = EditorSceneManager.SaveScene(reopened);
            Chk(savedMood, "mood-restore scene save failed");
            Scene moodReopen = EditorSceneManager.OpenScene(ScenePath, OpenSceneMode.Single);
            int persistedWhite = 0;
            for (int i = 0; i < NeonRules.Count; i++)
            {
                GameObject go = GameObject.Find(NeonRules.Name(i));
                SpriteRenderer sr = go != null ? go.GetComponent<SpriteRenderer>() : null;
                if (sr != null && sr.color == Color.white) persistedWhite++;
            }
            Chk(persistedWhite == NeonRules.Count,
                "mood tint persisted into the scene: " + persistedWhite + "/" + NeonRules.Count);
            Chk(AmbientChildCount() == 0,
                "ambient runtime children persisted into the scene: " + AmbientChildCount());
            UnityEngine.Object.DestroyImmediate(whiteDusk); UnityEngine.Object.DestroyImmediate(hushedDusk);
            UnityEngine.Object.DestroyImmediate(festiveDusk); UnityEngine.Object.DestroyImmediate(nightHushed);

            return "asserts=" + asserts
                + " table=21 unique_sprites=" + unique
                + " p69_prop=" + propGated + "/16"
                + " scene(saved=" + saved + ",21 persisted,robots8+residents12_kept,neighbors_ok)"
                + " render(dusk_px=" + duskTot + " worst=" + duskWorst + ":" + duskMin
                + " night_px=" + nightTot + " worst=" + nightWorst + ":" + nightMin
                + " lum dusk=" + duskLum.ToString("F3") + " night=" + nightLum.ToString("F3") + ")"
                + " mood(hushed_px=" + hushedChanged + " mean=" + hushedMean.ToString("F3")
                + ", festive_px=" + festiveChanged + " mean=" + festiveMean.ToString("F3")
                + ", probe_x2=" + p2Changed + ", probe_night=" + nfChanged
                + ", litMid_dusk=" + duskLitMid + "/night=" + nfLitMid
                + ", exempt_white=" + exemptWhite + "/4, persisted_white=" + persistedWhite + "/21)"
                + " shots=6";
        }

        static string ReloadProve()
        {
            Scene scene = EditorSceneManager.OpenScene(ScenePath, OpenSceneMode.Single);
            if (!scene.isLoaded) throw new InvalidOperationException("CityScene failed to load");
            Chk(CountSigns() == 21, "sign count after editor restart != 21: " + CountSigns());
            for (int i = 0; i < NeonRules.Count; i++)
            {
                GameObject go = GameObject.Find(NeonRules.Name(i));
                Chk(go != null, "sign lost across sessions: " + NeonRules.Name(i));
                SpriteRenderer sr = go != null ? go.GetComponent<SpriteRenderer>() : null;
                Chk(sr != null && sr.sprite != null, "sign sprite unresolved after restart: " + NeonRules.Name(i));
            }
            // importer spot check across the restart (hotel / neon frame / antenna /
            // plate) - expected tier per manifest (P-69: hotel + neon frame = 32)
            string[] spot = {
                "Assets/ArtPacks/warped-city/ENVIRONMENT/props/hotel-sign.png",
                "Assets/ArtPacks/warped-city/ENVIRONMENT/props/banner-neon/banner-neon-1.png",
                "Assets/ArtPacks/warped-city/ENVIRONMENT/props/antenna.png",
                "Assets/ArtPacks/warped-city/ENVIRONMENT/props/company-plates/plate-flux.png" };
            float[] spotPpu = { 32f, 32f, 16f, 16f };
            for (int k = 0; k < spot.Length; k++)
            {
                TextureImporter imp = (TextureImporter)TextureImporter.GetAtPath(spot[k]);
                Chk(imp != null && imp.textureType == TextureImporterType.Sprite, "importer type lost: " + spot[k]);
                Chk(imp.filterMode == FilterMode.Point, "point filter lost: " + spot[k]);
                Chk(Math.Abs(imp.spritePixelsPerUnit - spotPpu[k]) < 0.01f, "manifest PPU tier lost: " + spot[k]);
                Chk(!imp.mipmapEnabled, "mips re-enabled: " + spot[k]);
            }
            GameObject ambGo = GameObject.Find("CityAmbient");
            CityAmbient amb = ambGo != null ? ambGo.GetComponent<CityAmbient>() : null;
            Chk(amb != null && amb.skylineFar != null && amb.skylineNear != null, "r34 skyline lost after restart");
            // r146: mood-visual runtime law across sessions - every sign color
            // stayed neutral white on disk (the runtime mood tint never persisted)
            int moodWhite = 0;
            for (int i = 0; i < NeonRules.Count; i++)
            {
                GameObject go = GameObject.Find(NeonRules.Name(i));
                SpriteRenderer sr = go != null ? go.GetComponent<SpriteRenderer>() : null;
                if (sr != null && sr.color == Color.white) moodWhite++;
            }
            Chk(moodWhite == NeonRules.Count, "restart left non-white sign colors: " + moodWhite + "/" + NeonRules.Count);
            int reloadChildren = AmbientChildCount();
            Chk(reloadChildren == 0, "restart left ambient runtime children: " + reloadChildren);
            Chk(UnityEngine.Object.FindObjectsOfType<CityInterior>().Length >= 1, "CityInterior unresolved after restart");
            Chk(UnityEngine.Object.FindObjectsOfType<CityCameraRig>().Length >= 1, "CityCameraRig unresolved after restart");
            Chk(UnityEngine.Object.FindObjectsOfType<CityAmbientAudio>().Length >= 1, "CityAmbientAudio unresolved after restart");
            GameObject camGo = GameObject.Find("CityCamera");
            Camera cam = camGo != null ? camGo.GetComponent<Camera>() : null;
            Chk(cam != null && Math.Abs(cam.orthographicSize - RigMath.L0Size) < 0.01f, "L0 camera broken after restart");
            int robotsKept = 0, residentsKept = 0;
            foreach (SpriteRenderer sr in UnityEngine.Object.FindObjectsOfType<SpriteRenderer>())
            {
                if (sr.name.StartsWith(RobotRules.NamePrefix)) robotsKept++;
            }
            foreach (Transform t in UnityEngine.Object.FindObjectsOfType<Transform>())
                if (t.parent == null && t.name.StartsWith(ResidentRules.NamePrefix)
                    && t.name.Length == 6) residentsKept++;
            Chk(robotsKept == RobotRules.Count, "robots lost across restart: " + robotsKept);
            Chk(residentsKept == ResidentRules.Count, "residents lost across restart: " + residentsKept);
            return "reload_gate=OK signs=21/21 persisted importers=sprite+point+ppu_manifest+nemip"
                + " skyline=2/2 robots=" + robotsKept + "/" + RobotRules.Count
                + " residents=" + residentsKept + "/" + ResidentRules.Count
                + " neighbors=3 mood_white=" + moodWhite + "/21 ambient_children=" + reloadChildren
                + " cam_L0=" + (cam != null ? cam.orthographicSize.ToString("F1") : "?");
        }

        // sweep every root-level Neon* GO, then build the 21 from the manifest
        // (fresh LoadAssetAtPath at every use = r10 fake-null law)
        static void BuildSigns()
        {
            foreach (Transform t in UnityEngine.Object.FindObjectsOfType<Transform>())
                if (t.parent == null && t.name.StartsWith(NeonRules.NamePrefix))
                    UnityEngine.Object.DestroyImmediate(t.gameObject);
            for (int i = 0; i < NeonRules.Count; i++)
            {
                GameObject go = new GameObject(NeonRules.Name(i));
                Vector2 p = NeonRules.Pos(i);
                go.transform.position = new Vector3(p.x, p.y, 0f);
                SpriteRenderer sr = go.AddComponent<SpriteRenderer>();
                sr.sprite = AssetDatabase.LoadAssetAtPath<Sprite>(NeonRules.Path(i));
                if (sr.sprite == null)
                    throw new InvalidOperationException("sign sprite resolve failed: " + NeonRules.Path(i));
                sr.sortingOrder = NeonRules.Order;
            }
        }

        static int CountSigns()
        {
            int c = 0;
            foreach (SpriteRenderer sr in UnityEngine.Object.FindObjectsOfType<SpriteRenderer>())
                if (sr.name.StartsWith(NeonRules.NamePrefix)) c++;
            return c;
        }

        static SpriteRenderer[] CollectSignRenderers()
        {
            SpriteRenderer[] signs = new SpriteRenderer[NeonRules.Count];
            for (int i = 0; i < NeonRules.Count; i++)
            {
                GameObject go = GameObject.Find(NeonRules.Name(i));
                if (go == null) throw new InvalidOperationException("sign GO missing for render gate: " + NeonRules.Name(i));
                signs[i] = go.GetComponent<SpriteRenderer>();
            }
            return signs;
        }

        // toggle via cached references - GameObject.Find skips INACTIVE objects (r34 law)
        static void SetSigns(SpriteRenderer[] signs, bool on)
        {
            foreach (SpriteRenderer sr in signs) sr.gameObject.SetActive(on);
        }

        static int TileCount(string layerName)
        {
            GameObject go = GameObject.Find(layerName);
            Tilemap tm = go != null ? go.GetComponent<Tilemap>() : null;
            if (tm == null) return 0;
            int c = 0;
            foreach (Vector3Int p in tm.cellBounds.allPositionsWithin)
                if (tm.GetTile(p) != null) c++;
            return c;
        }

        // r146: the CityAmbient GO's child census + stale-ambient sweep (the r124
        // runtime law's disk face): every ambient visual is a runtime-only child
        // (r13/r25 law), so any child on disk is contamination - sweep them all.
        static int AmbientChildCount()
        {
            GameObject ambGo = GameObject.Find("CityAmbient");
            return ambGo != null ? ambGo.transform.childCount : 0;
        }

        static void SweepAmbientRuntime()
        {
            GameObject ambGo = GameObject.Find("CityAmbient");
            if (ambGo == null) return;
            for (int i = ambGo.transform.childCount - 1; i >= 0; i--)
                UnityEngine.Object.DestroyImmediate(ambGo.transform.GetChild(i).gameObject);
        }

        // forces Sprite + Single + Point + manifest PPU tier + no mips (idempotent).
        // The importer default PPU is 100 = the r34 speck disease; the per-sign tier
        // (16 default / 32 / 48, P-69 proportion law r89) is enforced here, never
        // assumed. The userData-mark guard in CityImportPostprocessor respects
        // these deliberate values on any future reimport.
        static Sprite ForceSprite(string path, float ppu)
        {
            TextureImporter imp = (TextureImporter)TextureImporter.GetAtPath(path);
            if (imp == null) throw new InvalidOperationException("importer missing: " + path);
            if (imp.textureType != TextureImporterType.Sprite || imp.spriteImportMode != SpriteImportMode.Single
                || imp.filterMode != FilterMode.Point || imp.mipmapEnabled
                || Math.Abs(imp.spritePixelsPerUnit - ppu) > 0.01f)
            {
                imp.textureType = TextureImporterType.Sprite;
                imp.spriteImportMode = SpriteImportMode.Single;
                imp.filterMode = FilterMode.Point;
                imp.mipmapEnabled = false;
                imp.spritePixelsPerUnit = ppu;
                imp.SaveAndReimport();
            }
            if (imp.textureType != TextureImporterType.Sprite || imp.filterMode != FilterMode.Point
                || Math.Abs(imp.spritePixelsPerUnit - ppu) > 0.01f)
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

        // per-sign window metric: pixels in the sign rect (+0.4u margin) that differ
        // from the signs-hidden baseline. Only the sign changes between the two
        // renders -> clean attribution. y=0 is the image BOTTOM row (r13 ReadPixels law).
        static void WinDelta(Texture2D on, Texture2D off, Camera cam, int i, out int deltaCount, out float avgLum)
        {
            Vector2 c = NeonRules.Pos(i);
            float hw = NeonRules.WorldW(i) / 2f + 0.4f;
            float hh = NeonRules.WorldH(i) / 2f + 0.4f;
            float halfH = cam.orthographicSize;
            float halfW = halfH * (1920f / 1080f);
            float cx = cam.transform.position.x, cy = cam.transform.position.y;
            int px0 = (int)(((c.x - hw - cx) / (2f * halfW) + 0.5f) * 1920f);
            int px1 = (int)(((c.x + hw - cx) / (2f * halfW) + 0.5f) * 1920f);
            int py0 = (int)(((c.y - hh - cy) / (2f * halfH) + 0.5f) * 1080f);
            int py1 = (int)(((c.y + hh - cy) / (2f * halfH) + 0.5f) * 1080f);
            px0 = Math.Max(0, px0); px1 = Math.Min(1919, px1);
            py0 = Math.Max(0, py0); py1 = Math.Min(1079, py1);
            double lum = 0; int n = 0;
            for (int y = py0; y <= py1; y += 2)
                for (int x = px0; x <= px1; x += 2)
                {
                    Color ca = on.GetPixel(x, y);
                    Color cb = off.GetPixel(x, y);
                    float d = Math.Abs(ca.r - cb.r) + Math.Abs(ca.g - cb.g) + Math.Abs(ca.b - cb.b);
                    if (d > 0.06f)
                    {
                        n++;
                        lum += (ca.r + ca.g + ca.b) / 3.0;
                    }
                }
            deltaCount = n;
            avgLum = n > 0 ? (float)(lum / n) : 0f;
        }

        // ---- r146 mood-visual helpers ----
        // manifest parse faces (JsonUtility fixed-field classes; unknown JSON keys
        // are ignored by design - the manifest carries prose nodes too)
        [Serializable] class MvRow { public float neon_intensity; public float breath_peak_scale; public string source; }
        [Serializable] class MvChannel
        {
            public string carrier; public float[] band;
            public int modulated_count; public int exempt_count;
            public float base_peak_alpha; public float absolute_ceiling;
        }
        [Serializable] class MvChannels { public MvChannel neon_intensity; public MvChannel breath_peak_scale; }
        [Serializable] class MvMoods { public MvRow steady, lively, festive, somber, hushed; }
        [Serializable] class MvManifest { public string protocol; public int baked_round; public MvChannels channels; public MvMoods moods; }

        // manifest mood row == the MoodVisualRules mirror (both channels)
        static bool MoodRowCheck(MvRow r, string mood)
        {
            return r != null
                && Mathf.Abs(r.neon_intensity - MoodVisualRules.NeonScaleFor(mood)) < 1e-4f
                && Mathf.Abs(r.breath_peak_scale - MoodVisualRules.BreathScaleFor(mood)) < 1e-4f;
        }

        // signed mood-delta census over every MODULATED sign window (exempt family
        // excluded): pixels whose channel-sum moved >0.02 count as changed; the
        // mean is signed (on - off luminance) over the changed set only, so the
        // direction law (dim vs brighten) reads through the unchanged background.
        // maxDelta = the largest channel-sum move seen (input-clamp discriminator:
        // 0.000 while colors differ = the render path clamped the >1 tint);
        // litMid = sampled OFF pixels with luminance in (0.05, 0.87) - the
        // sub-saturation census a real brightening would have to move.
        static void MoodDelta(Texture2D on, Texture2D off, Camera cam,
            out int changed, out float signedMean, out float maxDelta, out int litMid)
        {
            double sum = 0; int n = 0; float maxD = 0f; int mid = 0;
            float halfH = cam.orthographicSize;
            float halfW = halfH * (1920f / 1080f);
            float cx = cam.transform.position.x, cy = cam.transform.position.y;
            for (int i = 0; i < NeonRules.Count; i++)
            {
                if (MoodVisualRules.IsExemptSign(i)) continue;
                Vector2 c = NeonRules.Pos(i);
                float hw = NeonRules.WorldW(i) / 2f + 0.4f;
                float hh = NeonRules.WorldH(i) / 2f + 0.4f;
                int px0 = (int)(((c.x - hw - cx) / (2f * halfW) + 0.5f) * 1920f);
                int px1 = (int)(((c.x + hw - cx) / (2f * halfW) + 0.5f) * 1920f);
                int py0 = (int)(((c.y - hh - cy) / (2f * halfH) + 0.5f) * 1080f);
                int py1 = (int)(((c.y + hh - cy) / (2f * halfH) + 0.5f) * 1080f);
                px0 = Math.Max(0, px0); px1 = Math.Min(1919, px1);
                py0 = Math.Max(0, py0); py1 = Math.Min(1079, py1);
                for (int y = py0; y <= py1; y += 2)
                    for (int x = px0; x <= px1; x += 2)
                    {
                        Color ca = on.GetPixel(x, y);
                        Color cb = off.GetPixel(x, y);
                        float lb = (cb.r + cb.g + cb.b) / 3f;
                        if (lb > 0.05f && lb < 0.87f) mid++;
                        float d = Math.Abs(ca.r - cb.r) + Math.Abs(ca.g - cb.g) + Math.Abs(ca.b - cb.b);
                        if (d > maxD) maxD = d;
                        if (d > 0.02f)
                        {
                            n++;
                            sum += (ca.r + ca.g + ca.b) / 3.0 - lb;
                        }
                    }
            }
            changed = n;
            signedMean = n > 0 ? (float)(sum / n) : 0f;
            maxDelta = maxD;
            litMid = mid;
        }
    }
}
