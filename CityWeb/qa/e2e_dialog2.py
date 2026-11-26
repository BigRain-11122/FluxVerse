# E2E v2: place camera at resident anchor, press E, expect dialog.
from pathlib import Path
from playwright.sync_api import sync_playwright

DIST = Path(__file__).resolve().parent.parent / "dist"
OUT = Path(__file__).resolve().parent
with sync_playwright() as p:
    b = p.chromium.launch(headless=True)
    pg = b.new_page(viewport={"width": 1600, "height": 900})
    pg.goto((DIST / "index.html").as_uri())
    pg.wait_for_timeout(7000)
    a = pg.evaluate("""() => {
      const list = window.__CITY_ANCHORS__;
      if (!list || !list.length) return null;
      const a = list[0];
      const cam = window.__cwCamera;
      cam.position.set(a.pos.x + 3, 1.8, a.pos.z + 3);
      cam.lookAt(a.pos.x, 1.6, a.pos.z);
      if (window.__cityDebug && window.__cityDebug.rig) window.__cityDebug.rig.controls.target.set(a.pos.x, 1.6, a.pos.z);
      return { name: a.name, pos: [Math.round(a.pos.x), Math.round(a.pos.z)] };
    }""")
    print("anchor:", a)
    pg.wait_for_timeout(1200)
    pr = pg.evaluate("() => { const el = document.querySelector('#cw-interact-prompt'); return el ? { op: el.style.opacity, txt: el.textContent.slice(0,30) } : null; }")
    print("prompt:", pr)
    pg.keyboard.press("e")
    pg.wait_for_timeout(900)
    dlg = pg.evaluate("""() => {
      const d = document.querySelector('#cw-dialog');
      if (!d) return null;
      return { display: getComputedStyle(d).display, text: d.textContent.replace(/\\s+/g, ' ').slice(0, 120) };
    }""")
    print("dialog:", dlg)
    pg.screenshot(path=str(OUT / "e2e-dialog2.png"))
    b.close()
