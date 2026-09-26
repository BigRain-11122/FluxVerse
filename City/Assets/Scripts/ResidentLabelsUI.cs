// FluxVerse T-FV-002 S5b (r179): ResidentLabelsUI - the play-mode uGUI
// adapter of the resident name labels. SEPARATE FILE LAW (r14): the component
// class must live in <ClassName>.cs or the saved scene reference dies across
// editor sessions. The pure faces stay split: ResidentLabelRules (headless
// core: projection/budget/head law). This adapter only WIRES:
//
//  - a runtime ScreenSpaceOverlay canvas (r16 batch law: uGUI is a play-mode
//    interaction face - the canvas is BUILT in Awake and DESTROYED in
//    OnDestroy; it is NEVER saved. The persisted scene carries only this
//    component's root GO (CityStreetBehavior precedent, zero serialized
//    fields); the proof gates Find(CanvasName) == null on disk).
//  - the 32 pill sprites byte-path loaded (r18 BannerData law:
//    File.ReadAllBytes + LoadImage, point filter - no importer dependency;
//    owned-lifetime r23 law: every texture dies in Release).
//  - the per-tick apply: street tier -> project the heads through the pure
//    core -> budget <= 6 -> mount; L0 panorama -> all hidden (zero text -
//    the order's own words). A hidden seat (visible == 0, r124) shows NO
//    label - the UI face inherits the world trio law.
//
// CACHE LAW (r34): GameObject.Find skips inactive seats, so the 32 seat
// roots resolve ONCE on the first tick while the scene holds every seat
// scene-default active; a seat the street behavior hides later still reads
// activeSelf through the cached root. Missing pieces (no camera / no state /
// missing sprite) = honest silence - the PROOF fails loud instead.
// Pure 2D (uGUI flat images over an ortho render). ASCII. No 3D.
using System.Collections.Generic;
using System.IO;
using UnityEngine;
using UnityEngine.UI;

namespace FluxVerse
{
    public class ResidentLabelsUI : MonoBehaviour
    {
        public const string GoName = ResidentLabelRules.AdapterName;
        public const float TickIntervalSec = 0.25f;   // camera tween is 1.2s - 0.25s tracks it

        GameObject canvas;
        readonly Image[] pills = new Image[ResidentLabelRules.Count];
        readonly GameObject[] seats = new GameObject[ResidentLabelRules.Count];
        readonly Dictionary<int, Sprite> spriteCache = new Dictionary<int, Sprite>();
        float tickTimer = 999f;      // tick on first Update

        public int VisibleCount { get; private set; }

        void Awake() { BuildCanvas(); }

        void Update()
        {
            tickTimer += Time.deltaTime;
            if (tickTimer < TickIntervalSec) return;
            tickTimer = 0f;
            ApplyTick();
        }

        void OnDestroy() { Release(); }

        // the shared apply path: play-mode ticks and any future proof driver
        // both land here. null camera / panorama tier -> all hidden.
        public void ApplyTick()
        {
            GameObject camGo = GameObject.Find("CityCamera");
            Camera cam = camGo != null ? camGo.GetComponent<Camera>() : Camera.main;
            if (cam == null || !cam.orthographic
                || !ResidentLabelRules.StreetTier(cam.orthographicSize))
            {
                SetAllHidden();
                return;
            }
            EnsureSeats();
            float screenW = cam.pixelWidth > 0 ? cam.pixelWidth : 1920f;
            float screenH = cam.pixelHeight > 0 ? cam.pixelHeight : 1080f;
            float aspect = screenW / screenH;
            Vector2 camPos = cam.transform.position;
            Vector2[] anchors = new Vector2[ResidentLabelRules.Count];
            bool[] active = new bool[ResidentLabelRules.Count];
            for (int i = 0; i < ResidentLabelRules.Count; i++)
            {
                active[i] = seats[i] != null && seats[i].activeSelf;
                if (!active[i]) continue;
                Vector2 head = ResidentLabelRules.HeadWorld(i);
                Vector2 sp = ResidentLabelRules.ScreenPos(head, camPos,
                    cam.orthographicSize, aspect, screenW, screenH);
                anchors[i] = ResidentLabelRules.Anchor(sp);
            }
            int[] picks = ResidentLabelRules.PickBudgeted(anchors, active, screenW, screenH);
            HashSet<int> picked = new HashSet<int>(picks);
            int shown = 0;
            for (int i = 0; i < ResidentLabelRules.Count; i++)
            {
                Image pill = pills[i];
                if (pill == null) continue;
                if (!picked.Contains(i)) { pill.enabled = false; continue; }
                Sprite sp = SpriteFor(i);
                if (sp == null) { pill.enabled = false; continue; }   // honest silence
                pill.sprite = sp;
                pill.SetNativeSize();   // 80x26 canvas px, the r178 1:1 UI tier
                pill.rectTransform.anchoredPosition = anchors[i];   // y-up (bottom-left anchor)
                pill.enabled = true;
                shown++;
            }
            VisibleCount = shown;
        }

        // destroy the canvas + every cached texture (r23 owned-lifetime law)
        public void Release()
        {
            if (canvas != null)
            {
                DestroyGO(canvas);
                canvas = null;
            }
            foreach (Sprite s in spriteCache.Values) if (s != null) Kill(s.texture);
            spriteCache.Clear();
            for (int i = 0; i < pills.Length; i++) pills[i] = null;
        }

        // the UI sprite pool: byte-path load by roster plateIndex (orphan-face
        // law - a label exists only over a live roster identity)
        Sprite SpriteFor(int slot)
        {
            ResidentIdentityEntry e = ResidentIdentity.At(slot);
            if (e == null) return null;
            int pi = e.plateIndex;
            Sprite cached;
            if (spriteCache.TryGetValue(pi, out cached)) return cached;
            Sprite sp = LoadLabelSprite(pi);
            if (sp == null) return null;
            spriteCache[pi] = sp;
            return sp;
        }

        // byte-path loader (r18 law): batch proofs and play mode load
        // identical pixels; null on any absence (probe contract).
        public static Sprite LoadLabelSprite(int plateIndex)
        {
            string rel = ResidentLabelRules.SpritePath(plateIndex);
            string path = Path.Combine(Application.dataPath, rel.Substring("Assets/".Length));
            if (!File.Exists(path)) return null;
            Texture2D tex = new Texture2D(2, 2, TextureFormat.RGBA32, false);
            if (!tex.LoadImage(File.ReadAllBytes(path)))
            {
                Kill(tex);
                return null;
            }
            tex.filterMode = FilterMode.Point;
            tex.Apply(false, false);
            return Sprite.Create(tex, new Rect(0, 0, tex.width, tex.height),
                new Vector2(0.5f, 0.5f), ResidentLabelRules.PPU);
        }

        void BuildCanvas()
        {
            canvas = new GameObject(ResidentLabelRules.CanvasName);
            Canvas c = canvas.AddComponent<Canvas>();
            c.renderMode = RenderMode.ScreenSpaceOverlay;
            c.sortingOrder = 100;   // the UI shell rides above the world stack
            for (int i = 0; i < ResidentLabelRules.Count; i++)
            {
                GameObject g = new GameObject(ResidentLabelRules.Name(i));
                g.transform.SetParent(canvas.transform, false);
                RectTransform rt = g.AddComponent<RectTransform>();
                rt.anchorMin = rt.anchorMax = new Vector2(0f, 0f);   // bottom-left
                rt.pivot = new Vector2(0.5f, 0.5f);
                rt.sizeDelta = new Vector2(ResidentLabelRules.PxW, ResidentLabelRules.PxH);
                Image img = g.AddComponent<Image>();
                img.enabled = false;
                img.sprite = null;
                pills[i] = img;
            }
            VisibleCount = 0;
        }

        void SetAllHidden()
        {
            for (int i = 0; i < pills.Length; i++)
                if (pills[i] != null) pills[i].enabled = false;
            VisibleCount = 0;
        }

        // resolve the 32 seat roots once (cache law - see file header)
        void EnsureSeats()
        {
            if (seats[0] != null) return;
            for (int i = 0; i < ResidentLabelRules.Count; i++)
                seats[i] = GameObject.Find(ResidentRules.Name(i));
        }

        static void DestroyGO(GameObject go)
        {
            if (go == null) return;
            if (Application.isPlaying) Object.Destroy(go);
            else Object.DestroyImmediate(go);
        }

        static void Kill(Object o)
        {
            if (o == null) return;
            if (Application.isPlaying) Object.Destroy(o);
            else Object.DestroyImmediate(o);
        }
    }
}
