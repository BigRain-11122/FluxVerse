// FluxVerse P-22(2) r43: batch proof for the click-spotlight identity card (the
// L1 drill face closing the r40 nameplate window). Sentinel pattern (r42 style):
//   pass 1: logs/cards.run         -> FluxVerse.ResidentCardProof.BatchRun   -> logs/cards.done
//   pass 2: logs/cards-reload.run  -> FluxVerse.ResidentCardProof.ReloadGate -> logs/cards-reload.done
// Sections:
//  A pure-rule gates: canvas law (168x136 @PPU24 = 7x5.6667u), UI-band orders
//    (40<41<42<43, above the banner band 20..23), prefix sweep-isolation (NOT
//    Res/NameTag/BarkBubble/Robot/Neon), hit law (r110 nearest-covering on the
//    stacked street: center = self; head/plate columns covered by my rect and
//    answered by SOMEONE - an upstairs neighbor may legitimately win; x-miss /
//    below-feet / bubble zones never hit SELF; robot slots hit nobody),
//    CardPos camera-anchor math, life 8s.
//  B manifest-identity coupling: manifest parses (32 entries, ppu24,
//    168x136); every entry's slot/go/id/name/district/block/profession/faction/
//    species/age/layer is BYTE-EQUAL to ResidentIdentity (the street canon
//    residents-street.json is the single source; the bake copies, agreement
//    proves no invented content); layer law = "narrative" on every slot except
//    EXACTLY ONE anchor card at slot 26 (P-58 human-origin disclosure).
//  C byte-path gates: all 32 textures load via CityResidentCard.LoadCardSprite
//    (r18 bytes law), natural bounds 7x5.6667, point filter; deep pixel spots
//    on two cards under the PNG ROW-FLIP law (r42: GetPixel y=0 = image
//    bottom, the GDI+ name band lives at tex y 101..125): gold name band,
//    pale body rows, lit honesty footer, transparent corners. Degrade: bogus
//    dir / out-of-range slot -> null.
//  D adapter gates (real CityScene, edit mode): idempotent wiring on the camera
//    GO; Show -> 4 SpriteRenderers with the exact order table; mounted text
//    pixel-equal to a fresh byte load; position == CardPos(live cam); swap
//    (no orphan roots); Dismiss; timer law (7.9s alive, +0.2s auto-dismiss);
//    camera-hug law under a moved camera (restored before any save); the
//    shared ClickWorld path (resident -> show, robot -> dismiss, far -> dismiss).
//  E scene save + disk round-trip + neighbor regressions (r31..r42 sweeps).
//  F render gates (dusk + night): card window delta vs released baseline,
//    full-res warm-gold name count, night lum < dusk, release-clean back to
//    the NIGHT baseline (r42 lesson), zero persisted IdentCard* after reopen;
//    screenshots for the multimodal face.
//  G (folded into C) degrade gates.
// Fail-loud: any broken assumption throws into the .done report. ASCII. No 3D.
using System;
using System.Collections.Generic;
using System.IO;
using System.Security.Cryptography;
using UnityEngine;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine.SceneManagement;
using UnityEngine.Tilemaps;

namespace FluxVerse
{
    [Serializable] class CardManifestEntry
    {
        public int slot; public string go; public string id; public string name;
        public string district; public string block; public string profession;
        public string faction; public string species; public int age; public string layer;
        public string file; public int w; public int h;
    }
    [Serializable] class CardManifest
    {
        public string law; public int ppu; public int pxW; public int pxH;
        public string font; public string tier; public CardManifestEntry[] files;
    }

    public static class ResidentCardProof
    {
        static string ProjectRoot { get { return Path.GetDirectoryName(Application.dataPath); } }
        static string RepoRoot { get { return Path.GetDirectoryName(ProjectRoot); } }
        static string RunPath { get { return Path.Combine(RepoRoot, "logs", "cards.run"); } }
        static string DonePath { get { return Path.Combine(RepoRoot, "logs", "cards.done"); } }
        static string ReloadRunPath { get { return Path.Combine(RepoRoot, "logs", "cards-reload.run"); } }
        static string ReloadDonePath { get { return Path.Combine(RepoRoot, "logs", "cards-reload.done"); } }
        static string ShaPath { get { return Path.Combine(RepoRoot, "logs", "cards-sha.txt"); } }
        static string ScenePath { get { return "Assets/Scenes/CityScene.unity"; } }
        static string CardDir { get { return Path.Combine(ProjectRoot, "CardData"); } }
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
            // ---- A. pure-rule gates ----
            Chk(Mathf.Abs(ResidentCardRules.WorldW - 7.0f) < 1e-4f, "WorldW law 168/24");
            Chk(Mathf.Abs(ResidentCardRules.WorldH - 136f / 24f) < 1e-4f, "WorldH law 136/24");
            Chk(ResidentCardRules.OrderGlow == 40 && ResidentCardRules.OrderRim == 41
                && ResidentCardRules.OrderGlass == 42 && ResidentCardRules.OrderText == 43, "order table law");
            Chk(ResidentCardRules.OrderGlow > 23, "UI band must sit above the banner band");
            Chk(Mathf.Abs(ResidentCardRules.LifeSec - 8f) < 1e-5f, "life law 8s");
            Chk(!ResidentCardRules.Prefix.StartsWith(ResidentRules.NamePrefix)
                && ResidentCardRules.Prefix != ResidentTagRules.NamePrefix
                && ResidentCardRules.Prefix != ResidentBubbleRules.Prefix
                && ResidentCardRules.Prefix != RobotRules.NamePrefix
                && ResidentCardRules.Prefix != NeonRules.NamePrefix, "prefix sweep-isolation law");
            for (int i = 0; i < ResidentRules.Count; i++)
            {
                Vector2 p = ResidentRules.Pos(i);
                // center: nearest-covering is always self (nothing beats distance 0)
                Chk(ResidentCardRules.HitTest(p) == i, "center hit " + i);
                // r110 stacked street: the head/nameplate COLUMN of seat i is
                // covered by i's own rect (the click-zone law), but an upstairs
                // neighbor may stand nearer that exact point and legitimately
                // win the nearest-covering contest - so the column gates are
                // "my rect covers" + "someone answers", not "the answer is me".
                Vector2 head = new Vector2(p.x, p.y + 1.9f);
                Chk(ResidentCardRules.Covers(i, head), "head column must cover " + i);
                Chk(ResidentCardRules.HitTest(head) >= 0, "head column click must answer " + i);
                Vector2 plate = new Vector2(p.x, p.y + 1.567f);
                Chk(ResidentCardRules.Covers(i, plate), "plate column must cover " + i);
                Chk(ResidentCardRules.HitTest(plate) >= 0, "plate column click must answer " + i);
                // self-exclusion family: probes clearly OUTSIDE my rect never
                // pop MY card (a different covering seat answering is correct)
                Chk(ResidentCardRules.HitTest(new Vector2(p.x + 1.5f, p.y)) != i, "x-miss must not hit " + i);
                Chk(ResidentCardRules.HitTest(new Vector2(p.x, p.y - 1.3f)) != i, "below-feet must not hit " + i);
                Chk(ResidentCardRules.HitTest(ResidentBubbleRules.Pos(i)) != i, "bubble zone must not hit " + i);
            }
            for (int r = 0; r < RobotRules.Count; r++)
                Chk(ResidentCardRules.HitTest(RobotRules.Pos(r)) == -1, "robot slot must not pop a card " + r);
            Vector2 cp0 = ResidentCardRules.CardPos(Vector2.zero, 20f);
            Chk(Mathf.Abs(cp0.x) < 1e-5f && Mathf.Abs(cp0.y - (20f - 0.5f - 136f / 48f)) < 1e-4f, "CardPos L0 law");
            Vector2 cp1 = ResidentCardRules.CardPos(new Vector2(5f, -3f), 9f);
            Chk(Mathf.Abs(cp1.x - 5f) < 1e-5f && Mathf.Abs(cp1.y - (-3f + 9f - 0.5f - 136f / 48f)) < 1e-4f, "CardPos L1 law");

            // ---- B. manifest-identity coupling (single source, r39 file) ----
            string mpath = Path.Combine(CardDir, ResidentCardRules.ManifestName);
            Chk(File.Exists(mpath), "manifest missing");
            CardManifest m = JsonUtility.FromJson<CardManifest>(File.ReadAllText(mpath, System.Text.Encoding.UTF8));
            Chk(m != null && m.files != null && m.files.Length == ResidentIdentity.Count,
                "manifest must hold all street seats: " + (m == null || m.files == null ? -1 : m.files.Length));
            Chk(m.law == "resident-cards/0.1", "manifest law tag");
            Chk(m.ppu == 24 && m.pxW == 168 && m.pxH == 136, "manifest geometry");
            ResidentIdentityEntry[] ids = ResidentIdentity.Load(true);
            Chk(ids != null && ids.Length == ResidentIdentity.Count, "identity file loads");
            int anchorCards = 0;
            for (int i = 0; i < m.files.Length; i++)
            {
                CardManifestEntry e = m.files[i];
                ResidentIdentityEntry d = ids[i];
                Chk(e != null && d != null && e.slot == d.slot && e.slot == i, "manifest slot order " + i);
                Chk(e.go == d.go && e.id == d.id && e.name == d.name, "manifest identity core " + i);
                Chk(e.district == d.district && e.block == d.block && e.profession == d.profession, "manifest identity rows " + i);
                Chk(e.faction == d.faction && e.species == d.species && e.age == d.age, "manifest identity ascii " + i);
                Chk(e.layer == d.layer && (e.layer == ResidentIdentity.NarrativeLayer
                    || e.layer == ResidentIdentity.AnchorLayer), "layer law on " + i);
                if (e.layer == ResidentIdentity.AnchorLayer) anchorCards++;
                Chk(e.file == ResidentCardRules.FileName(i), "manifest file name " + i);
                Chk(File.Exists(Path.Combine(CardDir, e.file)), "card file on disk " + i);
            }
            Chk(anchorCards == 1 && m.files[ResidentIdentity.AnchorSlot].layer == ResidentIdentity.AnchorLayer,
                "exactly one anchor card, at street slot " + ResidentIdentity.AnchorSlot + " (P-58 law): " + anchorCards);

            // ---- C. byte-path loads + deep pixel spots + degrade ----
            int loaded = 0;
            for (int i = 0; i < ResidentIdentity.Count; i++)
            {
                Sprite sp = CityResidentCard.LoadCardSprite(CardDir, i);
                if (sp == null) throw new InvalidOperationException("card load fail " + i);
                Chk(Mathf.Abs(sp.bounds.size.x - 7.0f) < 1e-3f && Mathf.Abs(sp.bounds.size.y - 136f / 24f) < 1e-3f,
                    "card natural bounds " + i);
                Chk(sp.texture.filterMode == FilterMode.Point, "point filter " + i);
                loaded++;
                UnityEngine.Object.DestroyImmediate(sp.texture);
            }
            Chk(loaded == ResidentIdentity.Count, "all street cards byte-loaded: " + loaded);
            for (int i = 0; i < ResidentIdentity.Count; i += 9)   // spots 0/9/18/27 (narrative seats): name band gold px
            {
                Sprite sp = CityResidentCard.LoadCardSprite(CardDir, i);
                Texture2D t = sp.texture;
                int gold = 0, footLit = 0, bodyLit = 0;
                for (int y = 101; y <= 125; y++)          // PNG row-flip: name band y 10..34
                    for (int x = 0; x < t.width; x++)
                    {
                        Color p = t.GetPixel(x, y);
                        if (p.a > 0.5f && p.r >= 0.72f && (p.r - p.b) >= 0.2f) gold++;
                    }
                for (int y = 11; y <= 23; y++)           // footer band (top 112..124)
                    for (int x = 0; x < t.width; x++)
                        if (t.GetPixel(x, y).a > 0.5f && (t.GetPixel(x, y).r + t.GetPixel(x, y).g + t.GetPixel(x, y).b) / 3f > 0.3f) footLit++;
                for (int y = 75; y <= 87; y++)           // profession row (top 46..58)
                    for (int x = 0; x < t.width; x++)
                        if (t.GetPixel(x, y).a > 0.5f) bodyLit++;
                Chk(gold >= 120, "gold name band slot " + i + ": " + gold);
                Chk(footLit >= 14, "honesty footer lit slot " + i + ": " + footLit);
                Chk(bodyLit >= 16, "profession row lit slot " + i + ": " + bodyLit);
                Chk(t.GetPixel(0, 0).a < 0.02f && t.GetPixel(t.width - 1, 0).a < 0.02f
                    && t.GetPixel(0, t.height - 1).a < 0.02f, "corners transparent slot " + i);
                UnityEngine.Object.DestroyImmediate(t);
            }
            Chk(CityResidentCard.LoadCardSprite(Path.Combine(CardDir, "no-such-dir"), 0) == null, "bogus dir degrade");
            Chk(CityResidentCard.LoadCardSprite(CardDir, 99) == null, "out-of-range slot degrade");
            Chk(CityResidentCard.LoadCardSprite(CardDir, -1) == null, "negative slot degrade");

            // ---- D. adapter gates on the real scene (edit mode) ----
            Scene scene = EditorSceneManager.OpenScene(ScenePath, OpenSceneMode.Single);
            Chk(scene.isLoaded, "CityScene failed to open");
            GameObject camGo = GameObject.Find("CityCamera");
            Chk(camGo != null, "CityCamera GO missing");
            Camera cam = camGo.GetComponent<Camera>();
            Chk(cam != null && Math.Abs(cam.orthographicSize - RigMath.L0Size) < 0.01f, "L0 camera expected");
            Vector3 camPos0 = cam.transform.position; float camSize0 = cam.orthographicSize;

            EnsureWired();
            EnsureWired();   // idempotency
            CityResidentCard cc = UnityEngine.Object.FindObjectsOfType<CityResidentCard>()[0];
            Chk(UnityEngine.Object.FindObjectsOfType<CityResidentCard>().Length == 1, "card adapter count 1");
            Chk(cc.GetComponent<Camera>() != null, "adapter lives on the camera GO");

            cc.Show(0);
            Chk(cc.CardVisible && cc.CurrentSlot == 0, "Show(0)");
            GameObject root0 = cc.CardRoot;
            Chk(root0 != null && root0.name == "IdentCard00", "card root name law");
            SpriteRenderer[] srs = root0.GetComponentsInChildren<SpriteRenderer>(true);
            Chk(srs.Length == 4, "4 sprite layers (shell 3 + text): " + srs.Length);
            int oGlow = 0, oRim = 0, oGlass = 0, oText = 0;
            foreach (SpriteRenderer sr in srs)
            {
                if (sr.name == "Glow") oGlow = sr.sortingOrder;
                else if (sr.name == "Rim") oRim = sr.sortingOrder;
                else if (sr.name == "Glass") oGlass = sr.sortingOrder;
                else if (sr.name == "Text") oText = sr.sortingOrder;
            }
            Chk(oGlow == 40 && oRim == 41 && oGlass == 42 && oText == 43, "mounted order table");

            // mounted text == fresh byte load of slot 0 (pixel spot law)
            Sprite fresh = CityResidentCard.LoadCardSprite(CardDir, 0);
            Texture2D ft = null, mt = null;
            foreach (SpriteRenderer sr in srs) if (sr.name == "Text") mt = sr.sprite.texture;
            ft = fresh.texture;
            int[] sx = { 10, 84, 150, 0, 167 };
            int[] sy = { 10, 68, 125, 0, 135 };
            bool pixEq = true;
            for (int k = 0; k < sx.Length; k++)
                if (ft.GetPixel(sx[k], sy[k]) != mt.GetPixel(sx[k], sy[k])) { pixEq = false; break; }
            Chk(pixEq, "mounted text pixel-equal to fresh load");
            UnityEngine.Object.DestroyImmediate(ft);

            Vector2 expPos = ResidentCardRules.CardPos(new Vector2(camPos0.x, camPos0.y), camSize0);
            Chk(Mathf.Abs(root0.transform.position.x - expPos.x) < 1e-3f
                && Mathf.Abs(root0.transform.position.y - expPos.y) < 1e-3f
                && Mathf.Abs(root0.transform.position.z - UiKit.Depth) < 1e-3f, "card position == CardPos(live cam)");
            // shell anchor law (r43 first-render bug): BuildGlassPanel pins the
            // shell GO's WORLD position from the center param - a zero center
            // parks the glass at the city origin while the text floats alone at
            // the anchor. The shell must sit AT the card, local (0,0,0).
            Transform shellT = root0.transform.Find("Shell");
            Chk(shellT != null, "shell child present");
            Chk(Mathf.Abs(shellT.position.x - root0.transform.position.x) < 1e-3f
                && Mathf.Abs(shellT.position.y - root0.transform.position.y) < 1e-3f
                && Mathf.Abs(shellT.position.z - UiKit.Depth) < 1e-3f, "shell anchored to the card (world-pos law)");

            cc.Show(5);   // swap law
            Chk(cc.CurrentSlot == 5 && cc.CardRoot.name == "IdentCard05", "swap to slot 5");
            Chk(cc.CardRoot.GetComponentsInChildren<SpriteRenderer>(true).Length == 4, "swap keeps 4 layers");
            Chk(CountPrefix(ResidentCardRules.Prefix) == 1, "swap leaked no orphan roots");
            cc.Dismiss();
            Chk(!cc.CardVisible && CountPrefix(ResidentCardRules.Prefix) == 0, "dismiss clean");

            cc.ClickWorld(ResidentRules.Pos(2));   // shared click path
            Chk(cc.CardVisible && cc.CurrentSlot == 2, "ClickWorld resident shows card");
            cc.ClickWorld(RobotRules.Pos(0));
            Chk(!cc.CardVisible, "ClickWorld robot dismisses (robots never pop cards)");
            cc.ClickWorld(new Vector2(50f, 50f));
            Chk(!cc.CardVisible, "ClickWorld far dismisses");

            cc.Show(2);
            cc.StepCard(7.9f);
            Chk(cc.CardVisible, "life 7.9s still alive");
            cc.StepCard(0.2f);
            Chk(!cc.CardVisible, "life 8.1s auto-dismissed");

            cc.Show(1);   // camera-hug law (camera restored before any save)
            cam.transform.position = new Vector3(5f, 3f, camPos0.z);
            cam.orthographicSize = 9f;
            cc.StepCard(0.01f);
            Vector2 hug = ResidentCardRules.CardPos(new Vector2(5f, 3f), 9f);
            Chk(Mathf.Abs(cc.CardRoot.transform.position.x - hug.x) < 1e-3f
                && Mathf.Abs(cc.CardRoot.transform.position.y - hug.y) < 1e-3f, "card hugs the moved camera");
            cam.transform.position = camPos0;
            cam.orthographicSize = camSize0;
            cc.StepCard(0.01f);
            Chk(Mathf.Abs(cc.CardRoot.transform.position.x - expPos.x) < 1e-3f
                && Mathf.Abs(cc.CardRoot.transform.position.y - expPos.y) < 1e-3f, "card returns with the camera");
            cc.Dismiss();

            // ---- E. save + disk round-trip + neighbors ----
            bool saved = EditorSceneManager.SaveScene(scene);
            Chk(saved, "scene save failed");
            Scene reopened = EditorSceneManager.OpenScene(ScenePath, OpenSceneMode.Single);
            CityResidentCard cc2 = UnityEngine.Object.FindObjectsOfType<CityResidentCard>().Length > 0
                ? UnityEngine.Object.FindObjectsOfType<CityResidentCard>()[0] : null;
            Chk(cc2 != null && cc2.GetComponent<Camera>() != null, "card adapter survives disk round-trip (SEPARATE FILE LAW)");
            Chk(CountPrefix(ResidentCardRules.Prefix) == 0, "IdentCard persisted into the saved scene (runtime-only law)");
            Camera camR = GameObject.Find("CityCamera").GetComponent<Camera>();
            Chk(Mathf.Abs(camR.orthographicSize - RigMath.L0Size) < 0.01f, "camera profile preserved through save");
            NeighborRegressions();

            // ---- F. render gates (dusk + night) ----
            CityResidentCard cc3 = UnityEngine.Object.FindObjectsOfType<CityResidentCard>()[0];
            GameObject ambGo = GameObject.Find("CityAmbient");
            CityAmbient amb = ambGo != null ? ambGo.GetComponent<CityAmbient>() : null;
            Chk(amb != null, "CityAmbient missing for render gates");
            amb.EnsureVisuals();
            Camera camF = GameObject.Find("CityCamera").GetComponent<Camera>();
            Vector2 camNow = new Vector2(camF.transform.position.x, camF.transform.position.y);
            float halfH = camF.orthographicSize;
            Vector2 cardC = ResidentCardRules.CardPos(camNow, halfH);

            amb.ApplyAmbient(AmbientTier.Dusk);
            cc3.Dismiss();
            Texture2D duskBase = Shot(camF, null);
            cc3.Show(0);
            Texture2D duskOn = Shot(camF, "m1-r110-card-dusk.png");
            int duskN; float duskLum;
            WinDelta(duskOn, duskBase, camF, cardC, ResidentCardRules.WorldW, ResidentCardRules.WorldH, out duskN, out duskLum);
            // threshold note: with the shell anchored the glass body dominates
            // the window delta; 700 still splits "card missing" (0) and
            // "text-only, shell parked elsewhere" (~1000, the r43 first render).
            Chk(duskN >= 700, "dusk card delta too sparse: " + duskN);
            int duskGold = WarmGold(duskOn, camF, cardC);
            Chk(duskGold >= 250, "dusk gold name too thin: " + duskGold);
            // glass-interior probe (r43 bug gate): a blank zone between the name
            // band and row 2 must DARKEN once the card mounts - text-only proofs
            // pass while the glass sits at the city origin; this point does not.
            Vector2 glassProbe = cardC + new Vector2(0f, 1.13f);
            float gDusk = ProbeDelta(duskOn, duskBase, camF, glassProbe);
            Chk(gDusk >= 0.05f, "dusk glass interior missing at anchor: " + gDusk.ToString("F3"));

            amb.ApplyAmbient(AmbientTier.Night);
            cc3.Dismiss();
            Texture2D nightBase = Shot(camF, null);
            cc3.Show(0);
            Texture2D nightOn = Shot(camF, "m1-r110-card-night.png");
            int nightN; float nightLum;
            WinDelta(nightOn, nightBase, camF, cardC, ResidentCardRules.WorldW, ResidentCardRules.WorldH, out nightN, out nightLum);
            Chk(nightN >= 600, "night card delta too sparse: " + nightN);
            int nightGold = WarmGold(nightOn, camF, cardC);
            Chk(nightGold >= 200, "night gold name too thin: " + nightGold);
            float gNight = ProbeDelta(nightOn, nightBase, camF, glassProbe);
            Chk(gNight >= 0.05f, "night glass interior missing at anchor: " + gNight.ToString("F3"));
            Chk(nightLum < duskLum, "night card window must sit under dusk (atmosphere law): "
                + nightLum.ToString("F3") + " vs " + duskLum.ToString("F3"));

            cc3.Dismiss();   // release-clean vs the NIGHT baseline (r42 lesson)
            Texture2D clean = Shot(camF, null);
            int cleanN; float cleanL;
            WinDelta(clean, nightBase, camF, cardC, ResidentCardRules.WorldW, ResidentCardRules.WorldH, out cleanN, out cleanL);
            Chk(cleanN <= 40, "release-clean residual delta: " + cleanN);
            UnityEngine.Object.DestroyImmediate(duskBase); UnityEngine.Object.DestroyImmediate(duskOn);
            UnityEngine.Object.DestroyImmediate(nightBase); UnityEngine.Object.DestroyImmediate(nightOn);
            UnityEngine.Object.DestroyImmediate(clean);

            Scene finalScene = EditorSceneManager.OpenScene(ScenePath, OpenSceneMode.Single);
            Chk(finalScene.isLoaded, "final reopen failed");
            Chk(CountPrefix(ResidentCardRules.Prefix) == 0, "IdentCard leaked into the saved scene after renders");
            Chk(UnityEngine.Object.FindObjectsOfType<CityResidentCard>().Length == 1, "card adapter lost after renders");

            File.WriteAllText(ShaPath, Sha256File(mpath));
            return "asserts=" + asserts + " manifest=" + m.files.Length + " anchor_cards=" + anchorCards
                + " identity_coupling=" + m.files.Length + "/" + ids.Length + " bytes_loaded=" + loaded
                + " hit(pos=" + ResidentRules.Count + " head=" + ResidentRules.Count
                + " robot_neg=" + RobotRules.Count + " bubble_neg=" + ResidentRules.Count + ")"
                + " mount(orders=40..43 shell_anchor=law swap=clean timer=8s hug=law)"
                + " render(dusk=" + duskN + " gold=" + duskGold + " glass=" + gDusk.ToString("F3")
                + " night=" + nightN + " gold_n=" + nightGold + " glass_n=" + gNight.ToString("F3")
                + " lum_dusk=" + duskLum.ToString("F3") + " lum_night=" + nightLum.ToString("F3")
                + " clean=" + cleanN + ") shots=2 manifest_sha256=" + Sha256File(mpath).Substring(0, 16);
        }

        static string ReloadProve()
        {
            Scene scene = EditorSceneManager.OpenScene(ScenePath, OpenSceneMode.Single);
            Chk(scene.isLoaded, "reload: CityScene failed to open");
            CityResidentCard cc = UnityEngine.Object.FindObjectsOfType<CityResidentCard>().Length > 0
                ? UnityEngine.Object.FindObjectsOfType<CityResidentCard>()[0] : null;
            Chk(cc != null && cc.GetComponent<Camera>() != null, "reload: adapter resolves (SEPARATE FILE LAW)");
            Chk(CountPrefix(ResidentCardRules.Prefix) == 0, "reload: zero persisted IdentCard");

            string mpath = Path.Combine(CardDir, ResidentCardRules.ManifestName);
            string sha = Sha256File(mpath);
            Chk(File.Exists(ShaPath) && File.ReadAllText(ShaPath).Trim() == sha, "reload: manifest SHA drift across sessions");
            CardManifest m = JsonUtility.FromJson<CardManifest>(File.ReadAllText(mpath, System.Text.Encoding.UTF8));
            Chk(m != null && m.files != null && m.files.Length == ResidentIdentity.Count, "reload: manifest count");
            int loaded = 0;
            for (int i = 0; i < ResidentIdentity.Count; i++)
            {
                Sprite sp = CityResidentCard.LoadCardSprite(CardDir, i);
                if (sp == null) throw new InvalidOperationException("reload card load fail " + i);
                UnityEngine.Object.DestroyImmediate(sp.texture);
                loaded++;
            }
            Chk(loaded == ResidentIdentity.Count, "reload: textures re-load: " + loaded);

            cc.Show(3);
            Chk(cc.CardVisible && cc.CurrentSlot == 3, "reload: Show(3) works after restart");
            Camera cam = GameObject.Find("CityCamera").GetComponent<Camera>();
            Vector2 exp = ResidentCardRules.CardPos(new Vector2(cam.transform.position.x, cam.transform.position.y), cam.orthographicSize);
            Chk(Mathf.Abs(cc.CardRoot.transform.position.x - exp.x) < 1e-3f
                && Mathf.Abs(cc.CardRoot.transform.position.y - exp.y) < 1e-3f, "reload: card position law");
            cc.StepCard(8.6f);
            Chk(!cc.CardVisible, "reload: timer dismisses after restart");
            cc.Dismiss();

            int tagsKept = 0;
            foreach (SpriteRenderer sr in UnityEngine.Object.FindObjectsOfType<SpriteRenderer>())
                if (sr.name.StartsWith(ResidentTagRules.NamePrefix)) tagsKept++;
            Chk(tagsKept == ResidentTagRules.Count, "reload: nameplates kept");
            Chk(UnityEngine.Object.FindObjectsOfType<CityBubbles>().Length == 1, "reload: CityBubbles kept");
            Chk(UnityEngine.Object.FindObjectsOfType<CityResidentCard>().Length == 1, "reload: adapter kept");
            Chk(Mathf.Abs(cam.orthographicSize - RigMath.L0Size) < 0.01f, "reload: cam L0");
            return "reload_gate=OK asserts=" + asserts + " adapter_resolved sha_stable bytes_loaded=" + loaded
                + " show_after_restart=slot3 timer_ok cam_L0=" + cam.orthographicSize.ToString("F1");
        }

        // ---- wiring + neighbors ----

        static void EnsureWired()
        {
            if (UnityEngine.Object.FindObjectsOfType<CityResidentCard>().Length > 0) return;
            GameObject camGo = GameObject.Find("CityCamera");
            if (camGo == null) throw new InvalidOperationException("CityCamera GO missing at wiring");
            camGo.AddComponent<CityResidentCard>();
        }

        static int CountPrefix(string prefix)
        {
            int c = 0;
            foreach (Transform t in UnityEngine.Object.FindObjectsOfType<Transform>())
                if (t.name.StartsWith(prefix)) c++;
            return c;
        }

        static void NeighborRegressions()
        {
            int folkKept = 0;
            foreach (Transform t in UnityEngine.Object.FindObjectsOfType<Transform>())
                if (t.parent == null && t.name.StartsWith(ResidentRules.NamePrefix) && t.name.Length == 6) folkKept++;
            Chk(folkKept == ResidentRules.Count, "r99 residents lost: " + folkKept);
            int robotsKept = 0;
            foreach (SpriteRenderer sr in UnityEngine.Object.FindObjectsOfType<SpriteRenderer>())
                if (sr.name.StartsWith(RobotRules.NamePrefix)) robotsKept++;
            Chk(robotsKept == 8, "r36 street robots lost: " + robotsKept);
            int neonKept = 0;
            foreach (SpriteRenderer sr in UnityEngine.Object.FindObjectsOfType<SpriteRenderer>())
                if (sr.name.StartsWith(NeonRules.NamePrefix)) neonKept++;
            Chk(neonKept == NeonRules.Count, "r35+r38 neon signs lost: " + neonKept);
            int tagsKept = 0;
            foreach (SpriteRenderer sr in UnityEngine.Object.FindObjectsOfType<SpriteRenderer>())
                if (sr.name.StartsWith(ResidentTagRules.NamePrefix)) tagsKept++;
            Chk(tagsKept == ResidentTagRules.Count, "r40 nameplates lost: " + tagsKept);
            GameObject ambGo = GameObject.Find("CityAmbient");
            CityAmbient amb = ambGo != null ? ambGo.GetComponent<CityAmbient>() : null;
            Chk(amb != null, "CityAmbient lost");
            Chk(amb.skylineFar != null && amb.skylineNear != null, "r34 skyline sprites lost");
            CityAmbientAudio bed = amb.GetComponent<CityAmbientAudio>();
            Chk(bed != null && bed.noiseBed != null && bed.noiseBed.length > 0f, "r31 bed clip lost");
            Chk(UnityEngine.Object.FindObjectsOfType<CityBubbles>().Length == 1, "r42 CityBubbles lost");
            Chk(UnityEngine.Object.FindObjectsOfType<CityInterior>().Length >= 1, "CityInterior lost");
            Chk(UnityEngine.Object.FindObjectsOfType<CityCameraRig>().Length >= 1, "CityCameraRig lost");
            GameObject camGo = GameObject.Find("CityCamera");
            Camera cam = camGo != null ? camGo.GetComponent<Camera>() : null;
            Chk(cam != null && cam.orthographic && Math.Abs(cam.orthographicSize - RigMath.L0Size) < 0.01f,
                "L0 camera broken");
            Chk(TileCount("Ground") > 0 && TileCount("Water") > 0 && TileCount("Roads") > 0
                && TileCount("CityQUANT") > 0, "tilemap layers emptied");
            Chk(GameObject.Find("SkylineFar") == null && GameObject.Find("AmbientTint") == null,
                "runtime-only visuals persisted into the scene");
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

        // ---- render helpers (r40/r42 law: RT shot + window delta) ----

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

        static void WinDelta(Texture2D on, Texture2D off, Camera cam, Vector2 c, float w, float h,
            out int deltaCount, out float avgLum)
        {
            float hw = w / 2f + 0.3f, hh = h / 2f + 0.3f;
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

        // full-resolution warm-gold count inside the card window (the baked name
        // row is the only warm channel in a cool UI shell - the strongest
        // "the right content mounted" signal a pixel gate can read)
        static int WarmGold(Texture2D on, Camera cam, Vector2 c)
        {
            float hw = ResidentCardRules.WorldW / 2f, hh = ResidentCardRules.WorldH / 2f;
            float halfH = cam.orthographicSize;
            float halfW = halfH * (1920f / 1080f);
            float cx = cam.transform.position.x, cy = cam.transform.position.y;
            int px0 = (int)(((c.x - hw - cx) / (2f * halfW) + 0.5f) * 1920f);
            int px1 = (int)(((c.x + hw - cx) / (2f * halfW) + 0.5f) * 1920f);
            int py0 = (int)(((c.y - hh - cy) / (2f * halfH) + 0.5f) * 1080f);
            int py1 = (int)(((c.y + hh - cy) / (2f * halfH) + 0.5f) * 1080f);
            px0 = Math.Max(0, px0); px1 = Math.Min(1919, px1);
            py0 = Math.Max(0, py0); py1 = Math.Min(1079, py1);
            int gold = 0;
            for (int y = py0; y <= py1; y++)
                for (int x = px0; x <= px1; x++)
                {
                    Color p = on.GetPixel(x, y);
                    if (p.r >= 0.62f && (p.r - p.b) >= 0.15f && p.g > p.b) gold++;
                }
            return gold;
        }

        // single-point channel-sum delta at a world location (glass-interior
        // presence probe - the shell must visibly change its own anchor zone)
        static float ProbeDelta(Texture2D on, Texture2D off, Camera cam, Vector2 w)
        {
            float halfH = cam.orthographicSize;
            float halfW = halfH * (1920f / 1080f);
            float cx = cam.transform.position.x, cy = cam.transform.position.y;
            int px = (int)(((w.x - cx) / (2f * halfW) + 0.5f) * 1920f);
            int py = (int)(((w.y - cy) / (2f * halfH) + 0.5f) * 1080f);
            px = Math.Max(0, Math.Min(1919, px));
            py = Math.Max(0, Math.Min(1079, py));
            Color a = on.GetPixel(px, py);
            Color b = off.GetPixel(px, py);
            return Math.Abs(a.r - b.r) + Math.Abs(a.g - b.g) + Math.Abs(a.b - b.b);
        }

        static string Sha256File(string path)
        {
            using (SHA256 s = SHA256.Create())
                return BitConverter.ToString(s.ComputeHash(File.ReadAllBytes(path))).Replace("-", "").ToLower();
        }
    }
}
