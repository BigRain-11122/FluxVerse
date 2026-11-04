// r839 panel sandbox: "no row in the backfill window" is not "never spoke".
//
// The probe rebuilds the resident roster from the cursor; when the cursor is
// lost it reads a BOUNDED number of event files (MaxFiles=8). A resident whose
// last line is older than that window has no row, and the page used to print
// the same words as a resident that has never spoken at all. The census is not
// massaged - `never=` still counts those residents - but the page must say
// which case it is.
//
// Acceptance:
//   1. gap fixture (scanned=1, gap>0) -> the page names the window and says it
//      is not the same as "never spoke"
//   2. the never count is printed unchanged next to it (no re-write of history)
//   3. complete scan (scanned=1, gap=0) -> no window segment
//   4. unscanned round (scanned=0, gap=-1) -> no window segment
//   5. a pre-r839 reading (no keys at all) -> no window segment
//   6. anti-drift: the template guards on both keys, the builder prints the gap
'use strict';
const fs = require('fs');
const vm = require('vm');

const realHtml = fs.readFileSync('world-public/city-panel.html', 'utf8');
const template = fs.readFileSync('Tools/devloop/city-panel-template.html', 'utf8');
const builder = fs.readFileSync('Tools/devloop/build-city-panel.ps1', 'utf8');

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

function withResidents(html, obj) {
  const re = /const RESIDENTS = [\s\S]*?;\n/;
  if (!re.test(html)) throw new Error('cannot locate const RESIDENTS');
  return html.replace(re, () => 'const RESIDENTS = ' + JSON.stringify(obj) + ';\n');
}

function residentLine(obj, label) {
  const run = runPanelHtml(withResidents(realHtml, obj), label);
  return String(run.get('r-residents').textContent);
}

const base = {
  model: 'qwen3:4b-instruct', model_present: true, model_known: true,
  residents_n: 5, speakers_n: 3, never_n: 2, stale_n: 0, models_n: 4,
  backfilled_n: 1, last_say_utc: '2026-11-05T01:00:00Z', last_say_age_h: 0.4
};

// ---------- 1/2) a real gap ----------
console.log('--- gap ---');
const gapLine = residentLine(Object.assign({}, base, {
  backfill_scanned: 1, backfill_files_n: 8, backfill_complete_n: 0, backfill_gap_n: 2
}), 'gap');
check('1 page names the window gap', gapLine.indexOf('2 人超出回填窗口') >= 0, gapLine);
check('1 page says it is not never-spoke', gapLine.indexOf('不等于从未开口') >= 0, gapLine);
check('2 never count printed unchanged', gapLine.indexOf('2 人从未开口') >= 0, gapLine);
check('2 backfill count still printed', gapLine.indexOf('1 人读数由事件流回填') >= 0, gapLine);
const dirty = (gapLine.match(/NaN|undefined|null/g) || []).length;
check('2 no NaN/undefined/null in the line', dirty === 0, gapLine);

// ---------- 3/4/5) nothing to say ----------
console.log('--- silence ---');
const completeLine = residentLine(Object.assign({}, base, {
  backfill_scanned: 1, backfill_files_n: 8, backfill_complete_n: 1, backfill_gap_n: 0
}), 'complete');
check('3 complete scan -> no window segment', completeLine.indexOf('超出回填窗口') < 0, completeLine);
check('3 complete scan keeps the rest', completeLine.indexOf('5 名居民') >= 0, completeLine);

const unscannedLine = residentLine(Object.assign({}, base, {
  backfill_scanned: 0, backfill_files_n: -1, backfill_complete_n: -1, backfill_gap_n: -1
}), 'unscanned');
check('4 unscanned round -> no window segment', unscannedLine.indexOf('超出回填窗口') < 0, unscannedLine);

const preLine = residentLine({
  model: 'qwen3:4b-instruct', model_present: true, model_known: true,
  residents_n: 5, speakers_n: 3, never_n: 2, stale_n: 0, models_n: 4,
  last_say_utc: '2026-11-05T01:00:00Z', last_say_age_h: 0.4
}, 'pre-r839');
check('5 pre-r839 reading -> no window segment', preLine.indexOf('超出回填窗口') < 0, preLine);
check('5 pre-r839 line keeps its shape', preLine.indexOf('5 名居民') >= 0 && preLine.indexOf('2 人从未开口') >= 0, preLine);

// ---------- 6) anti-drift ----------
console.log('--- wiring ---');
check('6 template guards on both keys',
  template.indexOf('backfill_scanned === 1') >= 0 && template.indexOf('backfill_gap_n > 0') >= 0);
check('6 builder machine line prints the gap', builder.indexOf("backfill_gap='") >= 0);
check('6 builder reads the probe reading', builder.indexOf("['backfill_gap_n']") >= 0);

console.log('');
console.log('RESULT: pass=' + pass + ' fail=' + fail);
process.exit(fail > 0 ? 1 : 0);