// r696 panel test: the footer now says how old the page itself is (queue main#35).
// The footer used to show only the absolute build moment, so a reader could not
// tell whether the file was built two minutes or two days ago. A relative age is
// added next to it, and past 30 minutes it turns warn and tells the reader to
// reload. Acceptance:
//   1. build compiles (vm.Script, not a regex/clip check)
//   2. real build: footer span #builtage exists, carries a "N minutes ago" number
//      and a hover title with the ISO build stamp; fresh => no warn class
//   3. built 3h ago => warn class + "按 F5 取最新" hint
//   4. unparseable/empty BUILT_UTC => no number, no class, no crash
//   5. the absolute build string is still rendered verbatim (no regression)
'use strict';
const fs = require('fs');
const vm = require('vm');

const realHtml = fs.readFileSync('world-public/city-panel.html', 'utf8');
const src = (() => {
  const m = realHtml.match(/<script>([\s\S]*?)<\/script>/);
  if (!m) throw new Error('no inline script in panel html');
  return m[1];
})();

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

function withBuiltUtc(html, iso) {
  return html.replace(/const BUILT_UTC = [^;]*;/, () => 'const BUILT_UTC = ' + JSON.stringify(iso) + ';');
}

let pass = 0, fail = 0;
function chk(name, cond, detail) {
  if (cond) { pass++; console.log('  OK   ' + name); }
  else { fail++; console.log('  FAIL ' + name + (detail ? ' :: ' + detail : '')); }
}
const CLOCK = /\d{4}-\d{2}-\d{2} \d{2}:\d{2}/;
const MINUTES = /^\d+ 分钟前/;

// --- 1) compile ---
let compiled = true;
try { new vm.Script(src); } catch (e) { compiled = false; console.log('  compile error: ' + e.message); }
chk('compile.ok', compiled);

// --- 1b) substitution must be single-pass (r696 landmine) ---
// The builder used to chain String.Replace calls, so a face text that happened to
// contain a later placeholder's literal token got replaced INSIDE the embedded
// JSON string and broke the whole page. Single pass + this guard.
chk('html.no-placeholder-tokens', !/__(SNAPSHOT|FACE|BUILT|BUILTISO|PREV|HIST|SERIES|TREND|TICK|ART)_JSON__/.test(realHtml));
chk('html.single-built-utc',
  (realHtml.match(/const BUILT_UTC = /g) || []).length === 1,
  'count=' + (realHtml.match(/const BUILT_UTC = /g) || []).length);

// --- 2) real build ---
chk('html.footer-span', /<span id="builtage" class="tag"><\/span>/.test(realHtml));
const real = runPanelHtml(realHtml, 'real');
const fresh = real.get('builtage');
chk('real.age.number', MINUTES.test(String(fresh.textContent)), 'txt=' + fresh.textContent);
chk('real.age.no-warn', String(fresh.className).indexOf('warn') < 0, 'cls=' + fresh.className);
chk('real.age.title-clock', CLOCK.test(String(fresh.title)), 'title=' + fresh.title);
chk('real.age.title-iso', String(fresh.title).indexOf('T') > 0, 'title=' + fresh.title);
// 5) absolute build string untouched
const builtEl = real.get('built');
chk('real.built.abs-text', String(builtEl.textContent).length > 8 &&
  String(builtEl.textContent).indexOf('(') > 0, 'txt=' + builtEl.textContent);

// --- 3) stale => warn + reload hint ---
const threeHoursAgo = new Date(Date.now() - 3 * 3600 * 1000).toISOString();
const stale = runPanelHtml(withBuiltUtc(realHtml, threeHoursAgo), 'stale');
const old = stale.get('builtage');
chk('stale.warn-class', String(old.className).indexOf('warn') >= 0, 'cls=' + old.className);
chk('stale.reload-hint', String(old.textContent).indexOf('按 F5 取最新') >= 0, 'txt=' + old.textContent);
chk('stale.minutes-180', /18\d 分钟前/.test(String(old.textContent)), 'txt=' + old.textContent);

// --- 4) bad / missing stamp => no number, no class, no crash ---
[['empty', ''], ['garbage', 'not-a-stamp']].forEach(([tag, val]) => {
  let run = null, threw = null;
  try { run = runPanelHtml(withBuiltUtc(realHtml, val), 'bad-' + tag); }
  catch (e) { threw = e; }
  chk('bad.' + tag + '.no-crash', !threw, threw ? threw.message : '');
  if (!run) return;
  const el = run.get('builtage');
  chk('bad.' + tag + '.no-number', String(el.textContent).indexOf('分钟前') < 0, 'txt=' + el.textContent);
  chk('bad.' + tag + '.no-class', String(el.className) === '', 'cls=' + el.className);
});

// --- regression guards: the r695 hover titles still hold ---
chk('regress.badge-title', !!real.get('age').title, 'title=' + real.get('age').title);
// Row identity, not a fixed count: only these rows are fed timestamps by the
// builder. Counting titles broke whenever a self-check row was added (r703,
// r708); derive from the data instead (r675 lesson).
{
  const TITLED_ROWS = ['快照龄', '面部新鲜度', '取景帧', '城市证据', '应办令'];
  const rows = String(real.get('selfcheck').innerHTML).split('<div class="chk">').slice(1)
    .map(c => ({
      nm: (c.match(/<span class="nm">([\s\S]*?)<\/span>/) || [, ''])[1],
      has: c.indexOf('title="') >= 0
    })).filter(r => r.nm);
  const extra = rows.filter(r => r.has && TITLED_ROWS.indexOf(r.nm) < 0).map(r => r.nm);
  chk('regress.selfcheck-known-titles', extra.length === 0, 'extra=' + JSON.stringify(extra));
}

console.log('RESULT pass=' + pass + ' fail=' + fail);
process.exit(fail ? 1 : 0);