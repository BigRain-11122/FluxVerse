# Debug why E does not open dialog.
from pathlib import Path
from playwright.sync_api import sync_playwright

DIST = Path(__file__).resolve().parent.parent / "dist"
with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1600, "height": 900})
    page.goto((DIST / "index.html").as_uri())
    page.wait_for_timeout(7000)
    page.evaluate("() => window.__CITY_STREET__ && window.__CITY_STREET__(0)")
    page.wait_for_timeout(2600)
    st = page.evaluate("""() => {
      const talk = window.__CITY_TALK__;
      const pr = document.querySelector('#cw-interact-prompt');
      const cam = window.__cwCamera;
      return {
        talkCount: talk ? talk.interactables.length : -1,
        first3: talk ? talk.interactables.slice(0,3).map(i => ({id:i.id, label:i.label, r:i.radius})) : [],
        promptStyle: pr ? pr.style.opacity + '|' + pr.style.display + '|' + getComputedStyle(pr).opacity : 'no-el',
        promptText: pr ? pr.textContent : '',
        camY: cam ? +cam.position.y.toFixed(1) : -1,
      };
    }""")
    print("state:", st)
    # dispatch a synthetic keydown capture
    fired = page.evaluate("""() => {
      const ev = new KeyboardEvent('keydown', {key:'e', code:'KeyE', bubbles:true, cancelable:true});
      window.dispatchEvent(ev);
      const d = document.querySelector('#cw-dialog');
      return d ? getComputedStyle(d).display : 'no-dialog';
    }""")
    print("after synthetic keydown, dialog display:", fired)
    page.keyboard.press("e")
    page.wait_for_timeout(600)
    print("after real press:", page.evaluate("() => { const d=document.querySelector('#cw-dialog'); return d?getComputedStyle(d).display:'none-el'; }"))
    browser.close()
