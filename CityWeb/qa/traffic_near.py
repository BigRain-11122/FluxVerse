# Low-altitude near-frame check for vehicle tail lights (review follow-up).
from pathlib import Path
from playwright.sync_api import sync_playwright

DIST = Path(__file__).resolve().parent.parent / "dist"
OUT = Path(__file__).resolve().parent
errors = []
with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1600, "height": 900})
    page.on("console", lambda m: errors.append(m.text) if m.type == "error" else None)
    page.on("pageerror", lambda e: errors.append(str(e)))
    page.goto((DIST / "index.html").as_uri())
    page.wait_for_timeout(5000)
    # street-level near frame along a light bridge: camera low over the deck
    page.evaluate("""() => {
      const cam = window.__cwCamera;
      const t = cam ? {x: 0, y: 60, z: 0} : null;
      if (cam) { cam.position.set(620, 40, 780); cam.lookAt(0, 20, 0); }
    }""")
    page.wait_for_timeout(2000)
    page.screenshot(path=str(OUT / "wave2-traffic-near.png"))
    browser.close()
print("ERRORS:", len(errors))
for e in errors[:6]:
    print("  ", e[:200])
print("OK" if not errors else "HAS_ERRORS")
