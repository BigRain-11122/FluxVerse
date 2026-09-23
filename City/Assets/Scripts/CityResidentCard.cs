// FluxVerse P-22(2) r43: CityResidentCard - thin MonoBehaviour adapter of the
// click-spotlight identity card. SEPARATE FILE LAW (r14): the component class
// must live in <ClassName>.cs or the saved scene reference dies across editor
// sessions. Pure core (ResidentCardRules) owns the hit law + geometry; this
// adapter only WIRES: play mode reads the left click, routes it through the
// shared ClickWorld law, and mounts/dismountes the card. Lives on the camera
// GO (CityInterior precedent) so EnsureCam is GetComponent<Camera>.
//
// CLICK COORDINATION (interior precedent): CityCameraRig also consumes the same
// left click (FocusOn -> L1 street). That is the DESIRED drill: clicking a
// resident zooms the camera to them AND pops their identity card - the card is
// UI chrome at orders 40..43 and hugs the camera, so it stays readable through
// the tween. A miss click dismisses the card and falls through to the rig.
//
// RUNTIME-ONLY LAW (r13/r25): every card GO and every loaded texture is a
// runtime child of this component - NEVER saved into the scene (the proof
// gates zero persisted IdentCard*). Rebuild-per-show: UiKit.Release owns the
// whole stack (shell procedural textures + the byte-loaded text texture,
// r23 owned-lifetime law) - a slot swap never leaks.
//
// Honesty degrade (probe contract): missing CardData texture -> the card stays
// silent; the PROOF fails loud instead. Edit mode is silent (r25 AudioRouter
// law): proofs drive Show/ClickWorld/StepCard explicitly. Pure 2D. ASCII.
using System.IO;
using UnityEngine;

namespace FluxVerse
{
    public class CityResidentCard : MonoBehaviour
    {
        GameObject card;
        int slot = -1;
        float lifeLeft;
        Camera cam;

        public int CurrentSlot { get { return slot; } }
        public bool CardVisible { get { return card != null; } }

        void Update()
        {
            if (Application.isPlaying && Input.GetMouseButtonDown(0))
            {
                Camera c = EnsureCam();
                if (c == null) return;
                Vector3 p = c.ScreenToWorldPoint(Input.mousePosition);
                ClickWorld(new Vector2(p.x, p.y));
            }
            StepCard(Time.deltaTime);
        }

        // shared click law: play input and proofs walk the same path
        public void ClickWorld(Vector2 w)
        {
            int hit = ResidentCardRules.HitTest(w);
            if (hit >= 0) Show(hit);
            else Dismiss();
        }

        // mount the card for slot s; rebuild-per-show (UiKit.Release owns every
        // texture, r23 law). Silent when the bake is absent (proof fails loud).
        public void Show(int s)
        {
            if (s < 0 || s >= ResidentRules.Count) return;
            Dismiss();
            Camera c = EnsureCam();
            if (c == null) return;
            Sprite text = LoadCardSprite(CardDir(), s);
            if (text == null) return;
            Vector2 center = ResidentCardRules.CardPos(
                new Vector2(c.transform.position.x, c.transform.position.y), c.orthographicSize);
            card = new GameObject(ResidentCardRules.Prefix + s.ToString("00"));
            card.transform.SetParent(transform, false);
            card.transform.position = new Vector3(center.x, center.y, UiKit.Depth);
            // BUG LAW (found r43 first render, the r16 family): BuildGlassPanel
            // sets the shell GO's WORLD position from the center param - passing
            // zero pins the shell at the city origin while the text (correctly
            // parented) floats alone at the camera-top anchor. Pass the real
            // center so shell local == (0,0,0) under the card and the whole
            // stack follows the camera hug.
            UiKit.BuildGlassPanel(card.transform, "Shell", center,
                new Vector2(ResidentCardRules.WorldW, ResidentCardRules.WorldH),
                ResidentCardRules.OrderGlow, ResidentCardRules.OrderGlass, ResidentCardRules.OrderRim);
            GameObject tgo = new GameObject("Text");
            tgo.transform.SetParent(card.transform, false);
            SpriteRenderer sr = tgo.AddComponent<SpriteRenderer>();
            sr.sprite = text;
            sr.sortingOrder = ResidentCardRules.OrderText;
            tgo.transform.localScale = Vector3.one;   // natural 7x5.6667 via bake PPU24
            slot = s;
            lifeLeft = ResidentCardRules.LifeSec;
        }

        // destroy the card GO and every texture the stack owns (r23 law)
        public void Dismiss()
        {
            if (card == null) return;
            UiKit.Release(card);
            card = null;
            slot = -1;
        }

        // life countdown + camera hug (banner StepBanner pattern); explicit
        // edit-mode alias for proofs (same Advance/StepNow pattern as the rig)
        public void StepCard(float dt)
        {
            if (card == null) return;
            lifeLeft -= dt;
            Camera c = EnsureCam();
            if (c != null)
            {
                Vector2 center = ResidentCardRules.CardPos(
                    new Vector2(c.transform.position.x, c.transform.position.y), c.orthographicSize);
                card.transform.position = new Vector3(center.x, center.y, UiKit.Depth);
            }
            if (lifeLeft <= 0f) Dismiss();
        }

        public GameObject CardRoot { get { return card; } }

        // byte-path loader (r18 BannerData law / r42 bubble loader): bytes +
        // LoadImage, point filter, explicit Apply - batch proofs and play mode
        // load identical pixels, no importer dependency. Null on any absence.
        public static Sprite LoadCardSprite(string dir, int s)
        {
            if (string.IsNullOrEmpty(dir) || s < 0 || s >= ResidentRules.Count) return null;
            string path = Path.Combine(dir, ResidentCardRules.FileName(s));
            if (!File.Exists(path)) return null;
            Texture2D tex = new Texture2D(2, 2, TextureFormat.RGBA32, false);
            if (!tex.LoadImage(File.ReadAllBytes(path)))
            {
                UnityEngine.Object.DestroyImmediate(tex);
                return null;
            }
            tex.filterMode = FilterMode.Point;
            tex.Apply(false, false);
            return Sprite.Create(tex, new Rect(0, 0, tex.width, tex.height),
                new Vector2(0.5f, 0.5f), ResidentCardRules.PPU);
        }

        static string CardDir()
        {
            return Path.Combine(Path.GetDirectoryName(Application.dataPath), ResidentCardRules.DirName);
        }

        Camera EnsureCam()
        {
            if (cam == null) cam = GetComponent<Camera>();
            return cam;
        }
    }
}
