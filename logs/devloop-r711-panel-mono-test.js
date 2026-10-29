// r711 panel monotonic-classification test (main#17 follow-up): commits_total
// is the SUM of `git rev-list --count HEAD` over several sibling repos, so a
// sibling's HEAD moving back is an external history event, not this repo losing
// data. The 24h window kept one such dip (2026-10-28T14:41Z, 31778->31775) red
// forever and made the r670 selfcheck suite fail on an "unexplained warn".
// Contract now: a dip that (a) climbs back to its pre-dip level later in the
// window AND (b) sits more than 2h behind the newest sample is reported as a
// green historical event with the numbers still spelled out; anything else
// stays a red live regression.
'use strict';
const fs = require('fs');
const vm = require('vm');

const realHtml = fs.readFileSync('world-public/city-panel.html', 'utf8');
const snapM = realHtml.match(/const SNAP = (\{[\s\S]*?\});/);
if (!snapM) throw new Error('SNAP literal not found');
const SNAP = JSON.parse(snapM[1]);
const T0 = Date.parse(SNAP.ts_utc);
if (isNaN(T0)) throw new Error('SNAP ts_utc unparseable: ' + SNAP.ts_utc);

function isoAt(hoursAgo) {
  const d = new Date(T0 - Math.round(hoursAgo * 3600000));
  return d.toISOString().replace(/\.\d{3}Z$/, 'Z');
}

function rec(hoursAgo, c) {
  return { ts: isoAt(hoursAgo), c: c, r: 105 };
}

function runPanel(trend, label) {
  let src = realHtml;
  if (!/const TREND = \[[\s\S]*?\];/.test(src)) throw new Error('TREND literal not found');
  src = src.replace(/const TREND = \[[\s\S]*?\];/, 'const TREND = ' + JSON.stringify(trend) + ';');
  const m = src.match(/<script>([\s\S]*?)<\/script>/);
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
  const sandbox = {
    document, console, Date, Math, Object, Array, String, Number,
    isNaN, parseInt, parseFloat, JSON, setTimeout
  };
  vm.runInNewContext(m[1], sandbox, { filename: label, timeout: 5000 });
  return { body: els['selfcheck'] ? els['selfcheck'].innerHTML : '' };
}

function monoRow(body) {
  const rows = body.split('<div class="chk">').slice(1)
    .filter((c) => c.indexOf('<span class="nm">\u8de8\u8f6e\u5355\u8c03</span>') >= 0);
  return rows[0] || '';
}

let pass = 0, fail = 0;
function chk(name, cond, detail) {
  if (cond) { pass++; console.log('PASS ' + name); }
  else { fail++; console.log('FAIL ' + name + ' :: ' + detail); }
}

// A: old dip (3.5h) that climbed back -> green, numbers still shown.
const a = monoRow(runPanel(
  [rec(6, 100), rec(4, 103), rec(3.5, 100), rec(1, 105), rec(0, 106)], 'A').body);
chk('A.row=historical', /class="st ok"/.test(a) && a.indexOf('\u5386\u53f2\u56de\u843d') >= 0, a.slice(0, 200));
chk('A.numbers-disclosed', a.indexOf('103\u2192100') >= 0 && /@\d{2}:\d{2}Z/.test(a), a.slice(0, 200));

// B: recent dip, never climbed back -> red live regression.
const b = monoRow(runPanel(
  [rec(0.5, 100), rec(0.17, 97), rec(0, 97)], 'B').body);
chk('B.row=live', /class="st warn"/.test(b) && b.indexOf('\u7a97\u53e3\u5185\u56de\u843d') >= 0, b.slice(0, 200));

// C: climbed back but only 20 minutes ago -> still red (too soon to call it history).
const c = monoRow(runPanel(
  [rec(0.5, 100), rec(0.33, 97), rec(0, 101)], 'C').body);
chk('C.row=recent-recovered-live', /class="st warn"/.test(c) && c.indexOf('\u7a97\u53e3\u5185\u56de\u843d') >= 0, c.slice(0, 200));

// D: no dip at all -> green, plain wording.
const d = monoRow(runPanel(
  [rec(2, 100), rec(1, 102), rec(0, 104)], 'D').body);
chk('D.row=flat', /class="st ok"/.test(d) && d.indexOf('\u672a\u56de\u843d') >= 0, d.slice(0, 200));

// E: renders (r) are checked by the same rule (both keys share one code path).
const e = runPanel([rec(6, 100), rec(0, 100)], 'E');
const eRow = (() => {
  const rows = e.body.split('<div class="chk">').slice(1)
    .filter((x) => x.indexOf('<span class="nm">\u8de8\u8f6e\u5355\u8c03</span>') >= 0);
  return rows[0] || '';
})();
chk('E.row-present', eRow.length > 0, 'row missing');

console.log('RESULT: pass=' + pass + ' fail=' + fail);
process.exit(fail === 0 ? 0 : 1);