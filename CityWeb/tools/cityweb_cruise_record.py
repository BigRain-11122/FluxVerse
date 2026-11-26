# CityWeb cruise recorder -> absolute-path MP4 (CEO delivery convention).
# Route 2 (in-page MediaRecorder on the WebGL canvas only - no DOM HUD),
# then a single ffmpeg transcode close-out. See docs/perf-record-card.md.
import argparse
import base64
import os
import subprocess
import sys
import tempfile
from playwright.sync_api import sync_playwright

CRUISE_JS = r"""
async ([durSec, fps]) => {
  const D = window.__cityDebug;
  if (!D || !D.renderer) { return { ok: false, err: "no __cityDebug" }; }
  const { renderer, composer, scene, camera, rig, THREE } = D;
  if (!THREE) { return { ok: false, err: "no THREE in debug handle" }; }
  if (rig) { rig.controls.enabled = false; } // orbit overwrite precedent

  // City bbox ring cruise: expand 1.25x, height = 0.18 * size.
  const bb = new THREE.Box3().setFromObject(scene);
  const c = bb.getCenter(new THREE.Vector3());
  const r = bb.getSize(new THREE.Vector3()).length() * 0.75;
  const pts = Array.from({ length: 8 }, (_, i) => {
    const a = (i / 8) * Math.PI * 2;
    return c.clone().add(new THREE.Vector3(Math.cos(a) * r, r * 0.18, Math.sin(a) * r));
  });
  const curve = new THREE.CatmullRomCurve3(pts, true, "catmullrom", 0.5);

  const mime = ["video/webm;codecs=vp9", "video/webm;codecs=vp8"]
    .find((m) => MediaRecorder.isTypeSupported(m));
  const stream = renderer.domElement.captureStream(fps);
  const rec = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 16000000 });
  rec.ondataavailable = (e) => {
    if (!e.data || !e.data.size) return;
    const fr = new FileReader();
    fr.onload = () => window.__onChunk(String(fr.result).split(",")[1]);
    fr.readAsDataURL(e.data);
  };

  const t0 = performance.now();
  await new Promise((done) => {
    rec.start(500);
    (function step() {
      const t = Math.min(1, (performance.now() - t0) / (durSec * 1000));
      const p = curve.getPointAt(t);
      const tan = curve.getTangentAt(t);
      camera.position.copy(p);
      camera.lookAt(p.clone().addScaledVector(tan, 30));
      composer ? composer.render() : renderer.render(scene, camera);
      if (t < 1) requestAnimationFrame(step);
      else { rec.stop(); done(); }
    })();
  });
  if (rig) { rig.controls.enabled = true; }
  return { ok: true };
}
"""


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--url", required=True)
    ap.add_argument("--out", required=True)
    ap.add_argument("--dur", type=float, default=60)
    ap.add_argument("--fps", type=int, default=30)
    ap.add_argument("--headed", action="store_true", help="real GPU via system Chrome")
    a = ap.parse_args()

    webm = tempfile.mktemp(suffix=".webm")
    chunks = []
    with sync_playwright() as p:
        browser = (
            p.chromium.launch(channel="chrome", headless=False)
            if a.headed
            else p.chromium.launch()
        )
        ctx = browser.new_context(viewport={"width": 1600, "height": 900})
        page = ctx.new_page()
        page.expose_function("__onChunk", lambda b64: chunks.append(base64.b64decode(b64)))
        page.goto(a.url)
        page.wait_for_function("() => window.__cityDebug && window.__cityDebug.renderer")
        res = page.evaluate(CRUISE_JS, [a.dur, a.fps])
        browser.close()
        if not res.get("ok"):
            print("CRUISE FAIL:", res)
            sys.exit(2)

    with open(webm, "wb") as f:
        f.write(b"".join(chunks))

    os.makedirs(os.path.dirname(os.path.abspath(a.out)), exist_ok=True)
    subprocess.run(
        [
            "ffmpeg", "-y", "-i", webm,
            "-vf", "fps=30",
            "-c:v", "libx264", "-preset", "slow", "-crf", "18",
            "-pix_fmt", "yuv420p", "-profile:v", "high",
            "-movflags", "+faststart", "-an", a.out,
        ],
        check=True,
    )
    print("MP4 =>", os.path.abspath(a.out))


if __name__ == "__main__":
    main()
