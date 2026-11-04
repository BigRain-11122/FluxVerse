// r835 panel test: the city names its residents.
//
// Before this round the reality-anchor card printed "5 名居民" and never named
// one of them; the roster existed only as docs/residents/*.md plus per-id
// entries in world/internal state. The builder now resolves a ROSTER payload
// (id / name / place / age_h, no speech) and the page renders one row per
// resident. Acceptance:
//   1. the real page compiles (vm.Script) and renders one row per resident
//   2. every real row carries its id and a word-age word (minutes/hours/days/
//      未开口) - never NaN / undefined / an empty line
//   3. ROSTER null  -> "未记录（居民卡目录不可读）"  (absence is not "0 residents")
//   4. exists=false -> same wording (missing cards dir is not an empty city)
//   5. exists=true, rows empty -> "未记录（名册为空）"
//   6. a row without a name prints the id alone (no invented name, no " · ")
//   7. a row with age_h null prints 未开口, never "0 分钟前"
//   8. every place slug the probe can emit has a label in the page map
//   9. rows flattened to a single object by PS5.1 ConvertTo-Json -> still 1 row
//  10. anti-drift: builder injects the placeholder and prints PANEL ROSTER;
//      the template declares const ROSTER = __ROSTER_JSON__
'use strict';
const fs = require('fs');
const vm = require('vm');

const realHtml = fs.readFileSync('world-public/city-panel.html', 'utf8');
const template = fs.readFileSync('Tools/devloop/city-panel-template.html', 'utf8');
const builder = fs.readFileSync('Tools/devloop/build-city-panel.ps1', 'utf8');
const probe = fs.readFileSync('Tools/perceptor/probes/residents.ps1', 'utf8');

let pass = 0;
let fail = 0;
function check(name, ok, detail) {
  if (ok) { pass++; console.log('ok   ' + name); }
  else { fail++; console.log('FAIL ' + name + (detail ? ' :: ' + detail : '')); }
}

function runPanelHtml(html, label) {
  const m = html.match(/<script>([\s\S]*?)<\/script>/);
  if (!m) throw new Error('no inline script in ' + label);
  const els = {};
  const makeEl = (id) => ({
    id: id, textContent: '', innerHTML: '', className: '', style: {}, title: '',
    children: [], appendChild(c) { this.children.push(c); }
  });
  const document = {
    getElementById(id) { return els[id] || (els[id] = makeEl(id)); },
    createElement() { return makeEl('span'); },
    querySelectorAll() { return []; }
  };
  const sandbox = { document, console, Date, Math, Object, Array, String, Number, isNaN, setTimeout };
  vm.runInNewContext(m[1], sandbox, { filename: label, timeout: 5000 });
  return { els, get: (id) => (els[id] ? els[id] : makeEl(id)) };
}

function withRoster(html, obj) {
  const re = /const ROSTER = [\s\S]*?;\n/;
  if (!re.test(html)) throw new Error('cannot locate const ROSTER');
  return html.replace(re, () => 'const ROSTER = ' + JSON.stringify(obj) + ';\n');
}

function rows(run) {
  const box = run.get('r-roster');
  const kids = Array.isArray(box.children) ? box.children : [];
  return kids.map(k => ({
    nm: String((k.children && k.children[0] && k.children[0].textContent) || ''),
    v: String((k.children && k.children[1] && k.children[1].textContent) || '')
  }));
}

// ---------- 1/2) the real build ----------
console.log('--- real build ---');
let real = null;
try { real = runPanelHtml(realHtml, 'real-panel'); check('1 real page compiles', true); }
catch (e) { check('1 real page compiles', false, e.message); }
if (real) {
  const rr = rows(real);
  check('1 one row per resident (5)', rr.length === 5, 'rows=' + rr.length);
  const ids = ['BG-A', 'BG-B', 'BG-C', 'bm-a', 'bm-b'];
  const seen = ids.every(id => rr.some(r => (r.nm === id) || (r.v.indexOf(id) >= 0)));
  check('2 every resident named on the page', seen, JSON.stringify(rr));
  const ageOk = rr.every(r => /分钟前|小时前|天前|未开口/.test(r.v));
  check('2 every row carries a word-age', ageOk, JSON.stringify(rr));
  const dirty = (JSON.stringify(rr).match(/NaN|undefined/g) || []).length;
  check('2 no NaN/undefined in the roster block', dirty === 0, 'hits=' + dirty);
  const blanks = rr.filter(r => !r.nm || !r.v).length;
  check('2 no blank cell', blanks === 0, JSON.stringify(rr));
}

// ---------- 3/4/5) absence is never zero ----------
console.log('--- absence ---');
const nullRun = runPanelHtml(withRoster(realHtml, null), 'roster-null');
check('3 null roster -> 未记录', String(nullRun.get('r-roster').textContent).indexOf('未记录') === 0,
  nullRun.get('r-roster').textContent);
check('3 null roster says nothing about 0', String(nullRun.get('r-roster').textContent).indexOf('0 名') < 0,
  nullRun.get('r-roster').textContent);

const missRun = runPanelHtml(withRoster(realHtml, { exists: false, rows: [], n: 0, talked_n: 0 }), 'roster-missing');
check('4 exists=false -> 未记录', String(missRun.get('r-roster').textContent).indexOf('未记录') === 0,
  missRun.get('r-roster').textContent);

const emptyRun = runPanelHtml(withRoster(realHtml, { exists: true, rows: [], n: 0, talked_n: 0 }), 'roster-empty');
check('5 empty roster -> 名册为空', String(emptyRun.get('r-roster').textContent).indexOf('名册为空') >= 0,
  emptyRun.get('r-roster').textContent);

// ---------- 6/7) row shapes ----------
console.log('--- row shapes ---');
const shapeRun = runPanelHtml(withRoster(realHtml, {
  exists: true, n: 3, talked_n: 2,
  rows: [
    { id: 'X-1', name: '', place: 'night-shift', age_h: 0.4, talked: true },
    { id: 'X-2', name: '名字二', place: '', age_h: null, talked: false },
    { id: 'X-3', name: '名字三', place: 'made-up-place', age_h: 30, talked: true },
    { id: 'X-4', name: '名字四', place: 'game-city-studio', age_h: 5, talked: true }
  ]
}), 'roster-shapes');
const sr = rows(shapeRun);
check('6 nameless row prints the id alone', sr.length === 4 && sr[0].nm === 'X-1', JSON.stringify(sr));
check('6 nameless row does not repeat the id', sr.length === 4 && sr[0].v.indexOf('X-1') < 0, JSON.stringify(sr));
check('7 null age -> 未开口', sr.length === 4 && sr[1].v.indexOf('未开口') >= 0, JSON.stringify(sr));
check('6 known place slug -> 夜班', sr.length === 4 && sr[0].v.indexOf('夜班') >= 0, JSON.stringify(sr));
check('6 unknown place slug prints as-is', sr.length === 4 && sr[2].v.indexOf('made-up-place') >= 0, JSON.stringify(sr));
check('6 empty place adds no stray separator', sr.length === 4 && sr[1].v.indexOf('· ·') < 0, JSON.stringify(sr));
check('6 hours format above 1h', sr.length === 4 && sr[3].v.indexOf('5 小时前') >= 0, JSON.stringify(sr));
check('6 over a day switches to days', sr.length === 4 && sr[2].v.indexOf('1 天前') >= 0, JSON.stringify(sr));

// ---------- 8) place vocabulary coverage ----------
console.log('--- place vocabulary ---');
const slugs = (probe.match(/return '([a-z-]+)'/g) || [])
  .map(s => s.replace(/^return '/, '').replace(/'$/, ''))
  .filter(s => s.indexOf('-') > 0);
check('8 probe emits at least 4 routine place slugs', slugs.length >= 4, slugs.join(','));
const mapBody = (template.match(/const ROSTER_PLACES = \{[\s\S]*?\};/) || [''])[0];
const missing = slugs.filter(s => mapBody.indexOf("'" + s + "'") < 0);
check('8 every probe slug has a page label', missing.length === 0, missing.join(','));

// ---------- 9) PS5.1 single-row flattening ----------
console.log('--- payload shapes ---');
const flatRun = runPanelHtml(withRoster(realHtml, {
  exists: true, n: 1, talked_n: 1,
  rows: { id: 'Y-1', name: '独行', place: 'quant-computing-tower', age_h: 1.5, talked: true }
}), 'roster-flat');
const fr = rows(flatRun);
check('9 flattened single row -> 1 row', fr.length === 1, JSON.stringify(fr));
check('9 flattened row keeps its name', fr.length === 1 && fr[0].nm === '独行', JSON.stringify(fr));

// ---------- 10) anti-drift wiring ----------
console.log('--- wiring ---');
check('10 template declares const ROSTER', /const ROSTER = __ROSTER_JSON__;/.test(template));
check('10 builder injects __ROSTER_JSON__', builder.indexOf("'__ROSTER_JSON__'") >= 0);
check('10 builder placeholder regex covers ROSTER', /RESIDENTS\|ROSTER/.test(builder));
check('10 builder prints PANEL ROSTER', builder.indexOf('PANEL ROSTER:') >= 0);
check('10 template has the roster container', template.indexOf('id="r-roster"') >= 0);
check('10 builder resolves cards from docs\\residents', /docs\\residents/.test(builder));
check('10 page never prints resident speech', template.indexOf('line') >= 0 && !/r\.line/.test(template));

console.log('');
console.log('RESULT: pass=' + pass + ' fail=' + fail);
process.exit(fail > 0 ? 1 : 0);