// FluxVerse T-FV-002 S5b (r179): resident name labels - UI-shell pure rules.
// The 00:10 art-fix order moves the nameplates OUT of the world layer (the
// world layer shows only the resident bodies) into the GUIAgent UI shell
// (P-18 lineage): pre-baked glass pills (r178 S5a, Tools/city/
// bake-resident-ui-labels.ps1 -> Assets/ArtPacks/resident-labels/) mounted on
// a runtime ScreenSpaceOverlay canvas (r16 batch law: uGUI is a play-mode
// face - batch renders never show it; the PROOF gates the pure logic in
// this file, the play visuals are the CEO review face, r25 audio precedent).
//
// The 32 pills couple to the SAME street roster (Assets/Data/
// residents-street.json) the retired world plates did - orphan-face law: a
// label may only exist over a live roster identity; the file index == the
// roster's plateIndex (atlas-row order, r97/r178 law), NEVER the slot.
//
// Attention budget (r42 rationing family): street tier only (L0 panorama =
// zero text), at most MaxOnScreen labels, ranked by SCREEN distance to the
// view center ascending, ties broken by roster slot ascending (deterministic
// - never the frame's spawn order). A hidden seat (street-behavior
// visible == 0, r124) shows NO label - the trio law inherited by the UI
// face: the body is gone, so its label is gone too.
//
// Head law (city-core sec.8, migrated): the label bottom hovers a constant
// HeadGapPx above the 1.333u body top - now in screen px: the projected head
// point + the gap + half the pill height. ASCII. Pure 2D. No 3D.
using System;
using System.Collections.Generic;
using UnityEngine;

namespace FluxVerse
{
    public static class ResidentLabelRules
    {
        public const int Count = 32;                 // == ResidentRules.Count
        public const int PxW = 80;                   // r178 uniform canvas
        public const int PxH = 26;
        public const float PPU = 100f;                // UI 1:1 canvas-px tier (r178 importer row)
        public const float HeadGapPx = 8f;            // sec.8 baseline law, screen-space form
        public const int MaxOnScreen = 6;            // attention budget (r42 family)
        public const float ScreenMarginPx = 4f;       // labels never kiss the frame edge
        // street tier only (r14): L0 20 <-> L1 9; the strict < keeps the label
        // face off the panorama and off the exact mid-transition frame
        public const float L1Threshold = 14.5f;

        public const string CanvasName = "ResidentLabelsCanvas";
        public const string AdapterName = "CityLabelsUI";

        public static bool StreetTier(float orthoSize) { return orthoSize < L1Threshold; }

        public static string Name(int i) { return "ResLabel" + i.ToString("00"); }

        // pill file by the roster's plateIndex (orphan-face law; the proof
        // resolves it via ResidentIdentity so this file carries no per-person
        // copy - same law the retired world plates followed)
        public static string SpritePath(int plateIndex)
        {
            return "Assets/ArtPacks/resident-labels/label-res-"
                + plateIndex.ToString("00") + ".png";
        }

        // head line = body top of the 1.333u seat (the sec.8 anchor)
        public static Vector2 HeadWorld(int i)
        {
            Vector2 r = ResidentRules.Pos(i);
            return new Vector2(r.x, r.y + ResidentRules.HalfSide);
        }

        // ortho world -> screen px (y-up from the bottom edge): the
        // headless form of Camera.WorldToScreenPoint for an ortho camera -
        // the proof cross-checks the two laws against each other.
        public static Vector2 ScreenPos(Vector2 world, Vector2 camPos,
            float orthoSize, float aspect, float screenW, float screenH)
        {
            float halfW = orthoSize * aspect, halfH = orthoSize;
            float nx = (world.x - camPos.x) / (2f * halfW) + 0.5f;
            float ny = (world.y - camPos.y) / (2f * halfH) + 0.5f;
            return new Vector2(nx * screenW, ny * screenH);
        }

        // label anchor from the projected head point (screen px, y-up)
        public static Vector2 Anchor(Vector2 headScreen)
        {
            return new Vector2(headScreen.x, headScreen.y + HeadGapPx + PxH / 2f);
        }

        // whole-pill-on-frame test (with margin) - a half-clipped pill is a
        // defect, not a face: off-frame candidates simply do not exist
        public static bool FitsScreen(Vector2 anchor, float screenW, float screenH)
        {
            return anchor.x - PxW / 2f >= ScreenMarginPx
                && anchor.x + PxW / 2f <= screenW - ScreenMarginPx
                && anchor.y - PxH / 2f >= ScreenMarginPx
                && anchor.y + PxH / 2f <= screenH - ScreenMarginPx;
        }

        // the budget: active seats whose pill fits, ranked by screen distance
        // to the view center ascending, ties by roster slot ascending, cut at
        // MaxOnScreen. Inactive seats NEVER show (r124 trio law inherited).
        // Deterministic: same inputs, same output - the R3 law's UI dual.
        public static int[] PickBudgeted(Vector2[] anchors, bool[] active,
            float screenW, float screenH)
        {
            if (anchors == null || active == null)
                throw new InvalidOperationException("PickBudgeted needs anchor+active arrays");
            if (anchors.Length != Count || active.Length != Count)
                throw new InvalidOperationException("PickBudgeted arrays must hold exactly "
                    + Count + " seats: " + anchors.Length + "/" + active.Length);
            float cx = screenW / 2f, cy = screenH / 2f;
            List<int> cand = new List<int>();
            for (int i = 0; i < Count; i++)
            {
                if (!active[i]) continue;
                if (!FitsScreen(anchors[i], screenW, screenH)) continue;
                cand.Add(i);
            }
            cand.Sort(delegate (int a, int b)
            {
                Vector2 va = anchors[a], vb = anchors[b];
                float da = (va.x - cx) * (va.x - cx) + (va.y - cy) * (va.y - cy);
                float db = (vb.x - cx) * (vb.x - cx) + (vb.y - cy) * (vb.y - cy);
                int byDist = da.CompareTo(db);
                return byDist != 0 ? byDist : a.CompareTo(b);
            });
            if (cand.Count > MaxOnScreen) cand.RemoveRange(MaxOnScreen, cand.Count - MaxOnScreen);
            return cand.ToArray();
        }
    }
}
