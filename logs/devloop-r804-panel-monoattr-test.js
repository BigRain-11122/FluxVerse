// r804 panel test: attributing a commit-count drop to a repo (queue main#131).
// Why: commits_total is a rev-list SUM over the five repos the git probe reads.
// When a sibling repo rewrites history the sum falls, and the panel's monotonic
// card could only say "提交 36207→36189" - true, unactionable, and it stayed red
// for the 2 h window with nobody able to tell that this repo did nothing wrong.
// Method: take the REAL built page, swap only the one-line `const TREND = ...`,
// and read the rendered self-check row. No builder run, no fixtures to rebuild.
// Cases:
//   1. both records carry cr, one repo fell -> the text names it
//   2. no cr on either side -> old wording, nothing invented
//   3. cr present but no repo fell     -> no attribution (sum moved alone)
//   4. cr on one side only             -> no attribution
//   5. renders fall with cr present    -> no attribution (only commits can be)
'use strict';
const fs = require('fs');
const vm = require('vm');

const realHtml = fs.readFileSync('world-public/city-panel.html', 'utf8');

function scriptOf(html, label) {
  const m = html.match(/<script>([\s\S]*?)<\/script>/);
  if (!m) throw new Error('no inline script in ' + label);
  return m[1];
}

// Replace ONLY the TREND constant; every other row stays exactly as shipped.
function withTrend(arr) {
  const line = 'const TREND = ' + JSON.stringify(arr) + ';';
  const rx = /const TREND = .*?;\n/;
  if (!rx.test(realHtml)) throw new Error('TREND constant not found in the built page');
  return realHtml.replace(rx, line + '\n');
}

function runPanel(html, label) {
  const els = {};
  const makeEl = (id) => ({
    id: id, textContent: '', innerHTML: '', className: '', style: {}, title: '',
    children: [], appendChild(c) { this.children.push(c); },
    addEventListener() {}, scrollIntoView() {}
  });
  const document = {
    getElementById(id) { return els[id] || (els[id] = makeEl(id)); },
    createElement() { return makeEl('span'); },
    querySelectorAll() { return []; }
  };
  const sandbox = { document, console, Date, Math, Object, Array, String, Number, isNaN, setTimeout };
  vm.runInNewContext(scriptOf(html, label), sandbox, { filename: label, timeout: 5000 });
  const body = els['selfcheck'] ? els['selfcheck'].innerHTML : '';
  const rows = body.split('<div class="chk">').slice(1);
  const mono = rows.filter((r) => r.indexOf('<span class="nm">跨轮单调</span>') >= 0);
  const vd = mono.length ? ((mono[0].match(/vd">([^<]*)</) || [])[1] || '') : '';
  return { body: body, monoRows: mono.length, vd: vd };
}

let pass = 0, fail = 0;
function chk(name, cond, detail) {
  if (cond) { pass++; console.log('PASS ' + name); }
  else { fail++; console.log('FAIL ' + name + ' :: ' + detail); }
}

const T1 = '2026-11-04T01:00:00Z';
const T2 = '2026-11-04T01:05:00Z';
const rec = (ts, c, r, cr) => {
  const o = { ts: ts, c: c, r: r, g: 9, f: 1, e: 50 };
  if (cr) o.cr = cr;
  return o;
};

// --- 1) a repo fell, both sides carry the map -------------------------------
const one = runPanel(withTrend([
  rec(T1, 36340, 105, { fluxgroup: 36000, minigame: 300, fluxverse: 40 }),
  rec(T2, 36335, 105, { fluxgroup: 35995, minigame: 300, fluxverse: 40 })
]), 'attr');
chk('attr.warn-row', one.monoRows >= 1, 'rows=' + one.monoRows);
chk('attr.drop-text', /^窗口内回落 1 处：提交 36340→36335 @01:05Z/.test(one.vd), 'vd=' + JSON.stringify(one.vd));
chk('attr.names-repo', one.vd.indexOf('（fluxgroup 36000→35995）') >= 0, 'vd=' + JSON.stringify(one.vd));
chk('attr.not-names-flat', one.vd.indexOf('minigame') < 0, 'vd=' + JSON.stringify(one.vd));

// --- 2) no map on either side -> old wording exactly ------------------------
const two = runPanel(withTrend([
  rec(T1, 36340, 105),
  rec(T2, 36335, 105)
]), 'nomap');
chk('nomap.no-paren', two.vd.indexOf('（') < 0, 'vd=' + JSON.stringify(two.vd));
chk('nomap.keeps-values', /^窗口内回落 1 处：提交 36340→36335 @01:05Z$/.test(two.vd), 'vd=' + JSON.stringify(two.vd));

// --- 3) sum fell but every repo is flat (or climbed) -----------------------
// The card must not blame a repo it did not see fall: an empty attribution is
// the honest answer when the map does not explain the sum.
const three = runPanel(withTrend([
  rec(T1, 36340, 105, { fluxgroup: 36000, minigame: 340 }),
  rec(T2, 36335, 105, { fluxgroup: 36000, minigame: 345 })
]), 'flatmap');
chk('flatmap.no-paren', three.vd.indexOf('（') < 0, 'vd=' + JSON.stringify(three.vd));
chk('flatmap.still-warn', three.vd.indexOf('窗口内回落 1 处') === 0, 'vd=' + JSON.stringify(three.vd));

// --- 4) map on one side only ----------------------------------------------
const four = runPanel(withTrend([
  rec(T1, 36340, 105, { fluxgroup: 36000 }),
  rec(T2, 36335, 105)
]), 'halpmap');
chk('halfmap.no-paren', four.vd.indexOf('（') < 0, 'vd=' + JSON.stringify(four.vd));

// --- 5) renders fell (not commits) ----------------------------------------
const five = runPanel(withTrend([
  rec(T1, 36340, 110, { fluxgroup: 36000 }),
  rec(T2, 36340, 105, { fluxgroup: 36000 })
]), 'renders');
chk('renders.names-render', /^窗口内回落 1 处：渲染 110→105 @01:05Z/.test(five.vd), 'vd=' + JSON.stringify(five.vd));
chk('renders.no-attr', five.vd.indexOf('（') < 0, 'vd=' + JSON.stringify(five.vd));

// --- 6) two repos fell -> both named, in key order -------------------------
const six = runPanel(withTrend([
  rec(T1, 36340, 105, { fluxgroup: 36000, minigame: 300, fluxverse: 40 }),
  rec(T2, 36320, 105, { fluxgroup: 35990, minigame: 290, fluxverse: 40 })
]), 'two');
chk('two.names-both', six.vd.indexOf('（fluxgroup 36000→35990、minigame 300→290）') >= 0, 'vd=' + JSON.stringify(six.vd));

// --- 7) fell and already climbed back, but under 2 h -----------------------
// The row used to report this as 窗口内回落 (red, "still falling") for two
// hours after the counters had recovered. Green, and it says it came back.
const seven = runPanel(withTrend([
  rec('2026-11-04T01:00:00Z', 36340, 105),
  rec('2026-11-04T01:05:00Z', 36335, 105),
  rec('2026-11-04T01:10:00Z', 36345, 105)
]), 'fresh');
chk('fresh.not-warn', seven.vd.indexOf('窗口内回落') < 0, 'vd=' + JSON.stringify(seven.vd));
chk('fresh.says-back', /^回落 1 处已涨回（未满 2h，暂不判历史）：提交 36340→36335 @01:05Z/.test(seven.vd), 'vd=' + JSON.stringify(seven.vd));

// --- 8) same shape, but the drop is older than 2 h ------------------------
// Unchanged behaviour: promoted to the historical wording.
const eight = runPanel(withTrend([
  rec('2026-11-04T01:00:00Z', 36340, 105),
  rec('2026-11-04T01:05:00Z', 36335, 105),
  rec('2026-11-04T04:30:00Z', 36345, 105)
]), 'old');
chk('old.historical', /^历史回落 1 处已恢复（外部计数事件）：提交 36340→36335 @01:05Z/.test(eight.vd), 'vd=' + JSON.stringify(eight.vd));

// --- 9) one still down + one recovered: the red line stays, and only the
//        still-down one is listed there (the recovered one is not "falling").
const nine = runPanel(withTrend([
  rec('2026-11-04T01:00:00Z', 36340, 105),
  rec('2026-11-04T01:05:00Z', 36335, 105),
  rec('2026-11-04T01:10:00Z', 36345, 105),
  rec('2026-11-04T01:15:00Z', 36340, 105)
]), 'mixed');
chk('mixed.still-warn', /^窗口内回落 1 处：提交 36345→36340 @01:15Z$/.test(nine.vd), 'vd=' + JSON.stringify(nine.vd));

console.log('RESULT pass=' + pass + ' fail=' + fail);
process.exit(fail ? 1 : 0);