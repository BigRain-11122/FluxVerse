# Perf HUD probe: read draw/tri/fps from the live page.
from pathlib import Path
from playwright.sync_api import sync_playwright

DIST = Path(__file__).resolve().parent.parent / "dist"
OUT = Path(__file__).resolve().parent
errors = []
with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1600, "height": 900})
    page.on("pageerror", lambda e: errors.append(str(e)))
    page.goto((DIST / "index.html").as_uri())
    page.wait_for_timeout(6500)
    perf = page.evaluate("() => document.querySelector('#cw-perf')?.textContent")
    print("PERF HUD:", perf)
    page.screenshot(path=str(OUT / "perf-l0.png"))
    browser.close()
print("ERRORS:", len(errors))
for e in errors[:4]:
    print("  ", e[:160])
print("OK" if not errors else "HAS_ERRORS")
