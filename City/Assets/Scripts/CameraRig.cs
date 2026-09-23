// FluxVerse P-17 r14: dual-mode camera pure cores (CEO order 18:40, ledger
// P-2026-09-23-17). Spec (TECH section 9 P-17): ortho camera, PPU 16 tiles;
// L0 panorama size 20 (view 71x40 tiles, whole river-band city, slow drift) <->
// L1 street size 9 (view 32x18 tiles, building faces / robots / interior
// windows). Switch is a 1.2 s eased interpolation of BOTH size and position -
// hard cuts are forbidden. Split: this file holds the headless-testable cores
// (RigMath easing+clamping, RigTween simulation); the MonoBehaviour adapter
// CityCameraRig lives in CityCameraRig.cs (SEPARATE FILE LAW, r14: a component
// class must match its .cs file name or the saved scene reference dies across
// editor sessions). Pure 2D, no 3D.
using System;
using UnityEngine;

namespace FluxVerse
{
    public enum CamLevel { L0Panorama, L1Street }

    // pure logic: constants + easing + band clamping (headless-testable)
    public static class RigMath
    {
        public const float L0Size = 20f;              // panorama: 71x40 tile view
        public const float L1Size = 9f;               // street: 32x18 tile view
        public const float SwitchSeconds = 1.2f;      // CEO spec: eased, no hard cut
        public const float Aspect = 16f / 9f;        // render target aspect (r13 RT 1920x1080)

        // painted city band (mirror of CitySkeletonBuilder: ground rows -16..14, x -50..50)
        public const float BandYMin = -16f, BandYMax = 14f;
        public const float BandXHalf = 34f;           // keeps the 32-wide L1 view inside painted x

        public const float DriftAmpX = 2.5f, DriftAmpY = 1.0f;     // gentle L0 wander
        public const float DriftPeriodX = 48f, DriftPeriodY = 37f; // non-synced = organic

        public static float EaseInOut(float t)   // smoothstep: zero velocity at both ends
        {
            float k = Mathf.Clamp01(t);
            return k * k * (3f - 2f * k);
        }

        // L1 focus point -> camera center so the view stays inside the painted band
        public static Vector2 ClampFocus(Vector2 p, float halfH, float halfW)
        {
            float y = Mathf.Clamp(p.y, BandYMin + halfH, BandYMax - halfH);
            float x = Mathf.Clamp(p.x, -BandXHalf, BandXHalf);
            return new Vector2(x, y);
        }

        public static Vector2 DriftOffset(float t)   // L0 panorama slow drift, t in seconds
        {
            return new Vector2(Mathf.Sin(t * 6.2831853f / DriftPeriodX) * DriftAmpX,
                               Mathf.Sin(t * 6.2831853f / DriftPeriodY) * DriftAmpY);
        }
    }

    // pure simulation: camera center + ortho size over time (headless-testable).
    // Target may move while the tween runs (L0 drift is a live target): Step
    // interpolates from the frozen start toward the CURRENT target, so landing
    // on a moving target is seamless - that is how hard cuts stay impossible.
    public class RigTween
    {
        public Vector2 Pos { get; private set; }
        public float Size { get; private set; }
        public Vector2 FromPos, ToPos;   // ToPos/ToSize mutable = moving-target support
        public float FromSize, ToSize;

        float elapsed, duration;
        bool moving;

        public bool Moving { get { return moving; } }

        public void Snap(Vector2 pos, float size)
        {
            Pos = pos; Size = size; moving = false;
        }

        public void MoveTo(Vector2 toPos, float toSize, float seconds)
        {
            FromPos = Pos; FromSize = Size;
            ToPos = toPos; ToSize = toSize;
            elapsed = 0f; duration = Mathf.Max(0.0001f, seconds);
            moving = true;
        }

        public void Step(float dt)
        {
            if (!moving) return;
            elapsed += dt;
            float e = RigMath.EaseInOut(elapsed / duration);
            Pos = Vector2.Lerp(FromPos, ToPos, e);
            Size = Mathf.Lerp(FromSize, ToSize, e);
            if (elapsed >= duration) { Pos = ToPos; Size = ToSize; moving = false; }
        }
    }

    // scene adapter CityCameraRig lives in CityCameraRig.cs (SEPARATE FILE LAW, r14)
}
