# End-to-end: street tour -> near resident -> E opens dialog panel.
from pathlib import Path
from playwright.sync_api import sync_playwright

DIST = Path(__file__).resolve().parent.parent / "dist"
OUT = Path(__file__).resolve().parent
errors = []
with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1600, "height": 900})
    page.on("pageerror", lambda e: errors.append(str(e)))
    page.on("console", lambda m: errors.append(m.text) if m.type == "error" else None)
    page.goto((DIST / "index.html").as_uri())
    page.wait_for_timeout(7000)
    # fly to resident 1 via the R-tour API
    ok = page.evaluate("() => { if (window.__CITY_STREET__) { window.__CITY_STREET__(0); return true; } return false; }")
    print("street api:", ok)
    page.wait_for_timeout(2500)
    prompt = page.evaluate("() => document.querySelector('#cw-interact-prompt')?.textContent ?? 'none'")
    print("prompt:", (prompt or "")[:60])
    page.keyboard.press("e")
    page.wait_for_timeout(900)
    dlg = page.evaluate("""() => {
      const d = document.querySelector('#cw-dialog');
      if (!d) return null;
      return { visible: getComputedStyle(d).display !== 'none', title: d.querySelector('.dlg-title')?.textContent ?? d.textContent.slice(0,80) };
    }""")
    print("dialog:", dlg)
    page.screenshot(path=str(OUT / "e2e-dialog.png"))
    browser.close()
print("ERRORS:", len(errors))
for e in errors[:5]:
    print("  ", e[:160])
print("OK" if not errors else "HAS_ERRORS")
