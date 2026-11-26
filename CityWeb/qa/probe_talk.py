# probe: residents data + talk registration + prompt visibility
from pathlib import Path
from playwright.sync_api import sync_playwright

DIST = Path(__file__).resolve().parent.parent / "dist"
with sync_playwright() as p:
    b = p.chromium.launch(headless=True)
    pg = b.new_page(viewport={"width": 1600, "height": 900})
    pg.goto((DIST / "index.html").as_uri())
    pg.wait_for_timeout(7000)
    print("residents:", pg.evaluate("() => window.CITY_DATA ? (window.CITY_DATA.residents||[]).length : -1"))
    print("anchors:", pg.evaluate("() => window.__CITY_RESIDENTS__ || null"))
    print("talk:", pg.evaluate("""() => {
      const t = window.__CITY_TALK__;
      if (!t) return null;
      const k = Object.keys(t.interactables || {});
      return { type: typeof t.interactables, n: k.length, sample: k.slice(0, 2) };
    }"""))
    pg.evaluate("() => window.__CITY_STREET__ && window.__CITY_STREET__(0)")
    pg.wait_for_timeout(2600)
    print("prompt:", pg.evaluate("""() => {
      const el = document.querySelector('#cw-interact-prompt');
      if (!el) return 'none';
      return { opacity: el.style.opacity, computed: getComputedStyle(el).opacity, text: el.textContent.slice(0, 40) };
    }"""))
    pg.keyboard.press("e")
    pg.wait_for_timeout(700)
    print("dialog display:", pg.evaluate("() => { const d = document.querySelector('#cw-dialog'); return d ? getComputedStyle(d).display : 'no-el'; }"))
    b.close()
