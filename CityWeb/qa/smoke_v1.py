# CityWeb visual smoke test: open dist/index.html via file:// (real delivery
# mode), wait for render, capture L0/L1 frames + console errors.
import sys, time, json
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
    page.wait_for_timeout(6000)  # let scene settle, replay start
    page.screenshot(path=str(OUT / "v1-l0-overview.png"))

    page.keyboard.press("1")
    page.wait_for_timeout(2600)  # tween 1.4s + settle
    page.screenshot(path=str(OUT / "v1-l1-game.png"))

    page.keyboard.press("2")
    page.wait_for_timeout(2600)
    page.screenshot(path=str(OUT / "v1-l1-quant.png"))

    # HUD presence checks
    hud = page.evaluate("() => ({ title: document.querySelector('#cw-h1')?.textContent, clock: document.querySelector('#cw-clock')?.textContent, demo: !!document.querySelector('#cw-demo'), events: document.querySelectorAll('#cw-events .ev').length })")
    print("HUD:", json.dumps(hud, ensure_ascii=False))

    browser.close()

print("CONSOLE_ERRORS:", len(errors))
for e in errors[:10]:
    print("  ERR:", e[:300])
print("OK" if not errors else "HAS_ERRORS")
