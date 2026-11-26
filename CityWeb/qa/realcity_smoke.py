# Real-geography city smoke test.
import json
from pathlib import Path
from playwright.sync_api import sync_playwright

DIST = Path(r"D:\FluxGroup\gaming\FluxVerse\_wt-cityweb\CityWeb\dist")
OUT = Path(r"D:\FluxGroup\gaming\FluxVerse\_wt-cityweb\CityWeb\qa")
OUT.mkdir(exist_ok=True)
errors = []
with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1600, "height": 900})
    page.on("console", lambda m: errors.append(m.text) if m.type == "error" else None)
    page.on("pageerror", lambda e: errors.append(str(e)))
    # no city-data.js in worktree dist -> demo data fallback is fine for visuals
    page.goto((DIST / "index.html").as_uri())
    page.evaluate("() => { try { localStorage.removeItem('cityweb.cam'); } catch (e) {} }")
    page.reload()
    page.wait_for_timeout(6500)
    page.screenshot(path=str(OUT / "realcity-l0.png"))
    info = page.evaluate("() => ({ console: document.querySelector('#cw-h1')?.textContent, demo: !!document.querySelector('#cw-demo') })")
    print("INFO:", json.dumps(info, ensure_ascii=False))
    page.keyboard.press("1")  # Lujiazui/QUANT district
    page.wait_for_timeout(2800)
    page.screenshot(path=str(OUT / "realcity-l1-lujiazui.png"))
    browser.close()
print("ERRORS:", len(errors))
for e in errors[:8]:
    print("  ", e[:250])
print("OK" if not errors else "HAS_ERRORS")
