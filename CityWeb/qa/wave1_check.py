# Swarm wave 1 verification: pedestrians visible at street level + no errors.
# Force weather=clear in the sidecar (copy), capture L1 street view.
import json, shutil, time
from pathlib import Path
from playwright.sync_api import sync_playwright

DIST = Path(r"C:\Users\sjs20\Desktop\FluxGroup\gaming\FluxVerse\_wt-cityweb\CityWeb\dist")
OUT = Path(r"C:\Users\sjs20\Desktop\FluxGroup\gaming\FluxVerse\_wt-cityweb\CityWeb\qa")
OUT.mkdir(exist_ok=True)

errors = []
with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1600, "height": 900})
    page.on("console", lambda m: errors.append(m.text) if m.type == "error" else None)
    page.on("pageerror", lambda e: errors.append(str(e)))
    page.goto((DIST / "index.html").as_uri())
    page.evaluate("() => { try { localStorage.removeItem('cityweb.cam'); } catch (e) {} }")
    page.reload()
    page.wait_for_timeout(5000)
    # District focus 1 (GAME) then zoom in closer for street level
    page.keyboard.press("1")
    page.wait_for_timeout(2200)
    page.evaluate("() => { const c = window.__cwCamera; if (c) { c.position.multiplyScalar(0.55); } }")
    page.wait_for_timeout(1500)
    page.screenshot(path=str(OUT / "v2-l1-street.png"))
    browser.close()

print("ERRORS:", len(errors))
for e in errors[:6]:
    print("  ", e[:200])
print("OK" if not errors else "HAS_ERRORS")
