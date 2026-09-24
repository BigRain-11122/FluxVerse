// FluxVerse P-16 r15: interior window pure logic core - zone hit-test + panel URL
// resolution + open dispatch, headless-testable. CEO order ~18:30 (ledger
// P-2026-09-23-16): company panels join the metaverse as L1 interiors - click a
// building in the city, the interior window opens showing that company's live
// panel. REFERENCE-NOT-COPY iron law: the panel file is opened AT ITS SOURCE
// LOCATION in the sibling repo (file:/// URL) - never re-drawn, never rebuilt,
// never copied into City/ (that is asserted by the proof). Selection verdict
// (M1 engineering proof, this round): Tuanjie 1.10.3 has NO built-in WebView
// API for the Windows standalone target (managed assemblies scanned - only
// com.unity.modules.androidappview exists, Android-only), so v0 equivalent =
// open the OS default browser window on the real file (Application.OpenURL);
// the in-engine side shows the GUIAgent-glass banner shell. A native WebView2
// embed would be the v1 upgrade (recorded in TECH as debt). Pure 2D, no 3D.
using System;
using System.Collections.Generic;
using System.IO;
using UnityEngine;

namespace FluxVerse
{
    // one company's interior registration: zone -> live panel at its source repo
    public class InteriorTarget
    {
        public string zone;          // "QUANT"
        public string company;        // "BigMoney"
        public string panelRelPath;  // relative to the GROUP root, e.g. "quant/bigmoney/bigmoney.html"
        public Rect bounds;           // world-space clickable building block
    }

    // pure core: hit-test the city blocks, resolve the panel URL, dispatch the open.
    // No MonoBehaviour, no Application.* - the adapter injects the opener action.
    public class InteriorRouter
    {
        public const float DefaultCooldownSec = 8f;

        readonly string groupRoot;                 // FluxGroup root (panels live in sibling repos)
        readonly Action<string> opener;            // injected: Application.OpenURL in play mode
        readonly float cooldownSec;
        readonly List<InteriorTarget> targets = new List<InteriorTarget>();
        readonly Dictionary<string, float> lastOpenAt = new Dictionary<string, float>();

        public int OpenCount { get; private set; }
        public string LastUrl { get; private set; }

        public InteriorRouter(string groupRoot, Action<string> opener, float cooldownSec)
        {
            this.groupRoot = groupRoot ?? "";
            this.opener = opener;
            this.cooldownSec = cooldownSec;
        }

        // registry v1 (P-16 debt, r20): GAME city joins - the Biggame pixel-town
        // board AT ITS SOURCE REPO (reference-not-copy). U175 retired the town LINE
        // but archives this board on purpose; it stays the registered v0 face until
        // the BoardForge game-company board lands (then only the path line below
        // changes). CJK filename is built from code points (script ASCII law).
        // MEDIA row waits until a real BigStream panel exists on disk (today the
        // whole BigStream repo has no html panel - register nothing, guess no path).
        // r104 southbank: both south hit rects mirror the CitySkeletonBuilder south
        // blocks they must follow (QUANT cells x -2..2, rows y -16..-9 -> world
        // [-2..3]x[-16..-8]; GAME_MAIN cells x -23..-19, rows y -16..-12 -> world
        // [-23..-18]x[-16..-11]). The r103 manifest coupled-list named only the
        // QUANT rect, but the GAME block moved with it - leaving the GAME row at
        // its old cell would strand the interior row over empty road and open a
        // false-positive road-click zone (science-judgment extension, see TECH
        // sec9 r104 row).
        public static List<InteriorTarget> DefaultRegistry()
        {
            List<InteriorTarget> list = new List<InteriorTarget>();
            list.Add(new InteriorTarget
            {
                zone = "QUANT",
                company = "BigMoney",
                panelRelPath = "quant/bigmoney/bigmoney.html",
                bounds = new Rect(-2f, -16f, 5f, 8f)
            });
            list.Add(new InteriorTarget
            {
                zone = "GAME",
                company = "Biggame",
                panelRelPath = "gaming/MiniGame/\u50CF\u7D20\u5C0F\u9547\u770B\u677F.html",
                bounds = new Rect(-23f, -16f, 5f, 5f)
            });
            return list;
        }

        public void AddTarget(InteriorTarget t) { targets.Add(t); }

        public void AddDefaultRegistry()
        {
            foreach (InteriorTarget t in DefaultRegistry()) AddTarget(t);
        }

        // which registered building block does this world point land on? null = none
        public InteriorTarget Hit(Vector2 worldPoint)
        {
            for (int i = 0; i < targets.Count; i++)
                if (targets[i].bounds.Contains(worldPoint)) return targets[i];
            return null;
        }

        // resolve the file:/// URL of a target's panel at its SOURCE location.
        // null + silent no-op when the file is absent (sibling repo moved etc).
        public string ResolveUrl(InteriorTarget t)
        {
            if (t == null) return null;
            string abs = Path.Combine(groupRoot, t.panelRelPath.Replace('/', Path.DirectorySeparatorChar));
            if (!File.Exists(abs)) return null;
            // browsers want forward slashes AND percent-encoded UTF-8 (the r20 GAME
            // row has a CJK panel filename); System.Uri gives both. For pure-ASCII
            // paths the result is byte-identical to the old manual "file:///" build.
            return new Uri(abs).AbsoluteUri;
        }

        // full click chain: hit -> resolve -> cooldown gate -> dispatch. True = opened.
        // nowSec is injected (Time.realtimeSinceStartup live / explicit values in proofs).
        public bool Open(Vector2 worldPoint, float nowSec)
        {
            InteriorTarget t = Hit(worldPoint);
            if (t == null) return false;
            float at;
            if (lastOpenAt.TryGetValue(t.zone, out at) && nowSec - at < cooldownSec) return false;
            string url = ResolveUrl(t);
            if (url == null) return false;                 // silent degrade, never throws
            lastOpenAt[t.zone] = nowSec;
            LastUrl = url;
            OpenCount++;
            if (opener != null) opener(url);
            return true;
        }
    }

    // scene adapter CityInterior lives in CityInterior.cs (SEPARATE FILE LAW, r14)
}
