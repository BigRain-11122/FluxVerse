// r668 panel filter harness: run the built panel's inline JS against a stub DOM
// and assert the zone chips really filter the event tail.
const fs = require('fs');
const vm = require('vm');
const path = require('path');

const panel = path.join(__dirname, '..', 'world-public', 'city-panel.html');
const html = fs.readFileSync(panel, 'utf8');
const m = html.match(/<script>([\s\S]*?)<\/script>/);
if (!m) { console.log('FAIL: no inline script'); process.exit(1); }

const els = {};
function mkEl(id) {
  return {
    id, textContent: '', innerHTML: '', className: '', style: {},
    appendChild() {}, addEventListener(ev, fn) { this._handlers = this._handlers || {}; this._handlers[ev] = fn; },
    getAttribute(k) { return this._attrs ? this._attrs[k] : null; }
  };
}
const document = {
  getElementById(id) { if (!els[id]) els[id] = mkEl(id); return els[id]; },
  createElement() { return mkEl('tmp'); },
  querySelectorAll(sel) {
    if (sel === '#ev-chips .chip') {
      const html = els['ev-chips'] ? els['ev-chips'].innerHTML : '';
      // Reuse the same stub objects so handlers registered by the panel script
      // are still attached when the test clicks a chip later.
      if (this._chipCache && this._chipCache.html === html) return this._chipCache.list;
      const out = [];
      const re = /data-z="([^"]*)"/g;
      let g;
      while ((g = re.exec(html)) !== null) {
        const el = mkEl('chip');
        el._attrs = { 'data-z': g[1] };
        out.push(el);
      }
      this._chipCache = { html, list: out };
      return out;
    }
    return [];
  }
};

const sandbox = { document, console, Date, Math, Object, Array, String, Number, JSON, isNaN, parseInt, parseFloat };
vm.createContext(sandbox);
try {
  vm.runInContext(m[1], sandbox, { timeout: 5000 });
} catch (e) {
  console.log('FAIL: script threw: ' + e.message);
  process.exit(1);
}

let pass = 0, fail = 0;
function check(name, cond, extra) {
  if (cond) { pass++; } else { fail++; console.log('FAIL: ' + name + (extra ? ' :: ' + extra : '')); }
}

const total = els['dist-total'].textContent;
check('dist-total is 50', String(total) === '50', 'got ' + total);

const zHtml = els['dist-zones'].innerHTML || '';
check('zone bars rendered', /barrow/.test(zHtml) && /barval/.test(zHtml), 'len=' + zHtml.length);
const tHtml = els['dist-types'].innerHTML || '';
check('type bars rendered', /barrow/.test(tHtml) && /barval/.test(tHtml), 'len=' + tHtml.length);

const chipsHtml = els['ev-chips'].innerHTML || '';
check('chips contain 全部', chipsHtml.indexOf('全部') >= 0);
check('chips carry data-z zones', /data-z="gaming"/.test(chipsHtml));

// Baseline: no filter => 50 events, ev-count = "50"
check('baseline ev-count 50', els['ev-count'].textContent === '50', 'got ' + els['ev-count'].textContent);

// Click the gaming chip
const chips = document.querySelectorAll('#ev-chips .chip');
let gamingChip = null;
for (const c of chips) { if (c.getAttribute('data-z') === 'gaming') { gamingChip = c; break; } }
check('gaming chip found', !!gamingChip);
if (gamingChip) {
  gamingChip._handlers.click();
  const cnt = els['ev-count'].textContent;
  check('filtered count format N / 50', /^\d+ \/ 50$/.test(cnt), 'got ' + cnt);
  const evHtml = els['events'].innerHTML || '';
  const tags = (evHtml.match(/class="tag">([^<]*)</g) || []).map(s => s.replace(/class="tag">|</g, ''));
  check('filtered rows exist', tags.length > 0, 'rows=' + tags.length);
  check('filtered rows all gaming', tags.every(t => t === 'gaming'), 'tags=' + JSON.stringify([...new Set(tags)]));
  check('filtered count matches rows', parseInt(cnt) === tags.length, cnt + ' vs ' + tags.length);
}

console.log('RESULT pass=' + pass + ' fail=' + fail);
process.exit(fail === 0 ? 0 : 1);