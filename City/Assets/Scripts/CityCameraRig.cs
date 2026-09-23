// FluxVerse P-17 r14: CityCameraRig - thin MonoBehaviour adapter of the dual-mode camera.
// SEPARATE FILE LAW (r14): MonoBehaviour classes must live in a <ClassName>.cs file or the
// serialized scene reference breaks (Tuanjie writes embedded class-name stubs for
// mismatched names which do not re-resolve across editor sessions - GetComponent returns
// null on reload; r12/r13 wiring died this way, r13's fallback stacked 5 ghost objects).
// Pure cores (RigMath / RigTween / CamLevel) stay in CameraRig.cs; this file holds ONLY
// the scene component. Pure 2D, no 3D.
using UnityEngine;

namespace FluxVerse
{
    // scene component: input + drives the tween into the CityCamera
    public class CityCameraRig : MonoBehaviour
    {
        readonly RigTween tween = new RigTween();
        Camera cam;
        float driftTime;
        CamLevel level = CamLevel.L0Panorama;
        bool snapped;   // first Advance adopts the persisted camera state

        public CamLevel Level { get { return level; } }
        public float SizeNow { get { return EnsureCam() == null ? 0f : cam.orthographicSize; } }
        public Vector2 PosNow
        {
            get
            {
                if (EnsureCam() == null) return Vector2.zero;
                return new Vector2(cam.transform.position.x, cam.transform.position.y);
            }
        }
        public float DriftTimeNow { get { return driftTime; } }
        public Vector2 DriftTargetNow { get { return RigMath.DriftOffset(driftTime); } }

        void Update()
        {
            if (Application.isPlaying) HandleInput();
            Advance(Time.deltaTime);
        }

        void HandleInput()
        {
            if (Input.GetMouseButtonDown(0))
            {
                if (EnsureCam() == null) return;
                Vector3 p = cam.ScreenToWorldPoint(Input.mousePosition);
                FocusOn(new Vector2(p.x, p.y));
            }
            else if (Input.GetMouseButtonDown(1) || Input.GetKeyDown(KeyCode.Escape))
            {
                BackToL0();
            }
        }

        // left-click target: zoom to that world point at street level
        public void FocusOn(Vector2 worldPoint)
        {
            if (EnsureCam() == null) return;
            level = CamLevel.L1Street;
            Vector2 target = RigMath.ClampFocus(worldPoint, RigMath.L1Size, RigMath.L1Size * RigMath.Aspect);
            StartTween(target, RigMath.L1Size);
        }

        public void BackToL0()
        {
            if (EnsureCam() == null) return;
            level = CamLevel.L0Panorama;
            StartTween(RigMath.DriftOffset(driftTime), RigMath.L0Size);   // chased live each Advance
        }

        void StartTween(Vector2 toPos, float toSize)
        {
            EnsureInit();
            tween.MoveTo(toPos, toSize, RigMath.SwitchSeconds);
        }

        // core step - play mode (Update) and batch proofs (StepNow) share it
        public void Advance(float dt)
        {
            if (EnsureCam() == null) return;
            driftTime += dt;
            EnsureInit();
            if (level == CamLevel.L0Panorama)
            {
                if (tween.Moving) tween.ToPos = RigMath.DriftOffset(driftTime);   // live target
                else tween.Snap(RigMath.DriftOffset(driftTime), RigMath.L0Size);   // idle drift
            }
            tween.Step(dt);
            Vector3 p = cam.transform.position;   // z untouched (-10)
            cam.transform.position = new Vector3(tween.Pos.x, tween.Pos.y, p.z);
            cam.orthographicSize = tween.Size;
        }

        public void StepNow(float dt) { Advance(dt); }   // explicit edit-mode alias for proofs

        void EnsureInit()
        {
            if (snapped) return;
            tween.Snap(PosNow, SizeNow);   // adopt persisted camera profile (L0 size 20)
            snapped = true;
        }

        Camera EnsureCam()
        {
            if (cam == null) cam = GetComponent<Camera>();
            return cam;
        }
    }
}
