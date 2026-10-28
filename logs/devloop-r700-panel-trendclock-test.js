// r700 panel trend-clock test (queue main#39): the cross-round trend list, the
// "flat N records" fold line, the comparison anchor and the event stream all
// used to print raw ISO stamps (UTC) while the chart axes above them had just
// been moved to local clock — two clocks on one page. Contract now: visible
// text is LOCAL MM-DD HH:MM, the absolute clock + raw ISO live in the hover
// title. Proven twice: on the real build, and in a sandbox whose Date reports
// UTC+05:30 so the assertion cannot pass on a machine that happens to run UTC.
'use strict';
const fs = require('fs');
const vm = require('vm');

const realHtml = fs.readFileSync('world-public/city-panel.html', 'utf8');

function p2(n) { return n < 10 ? '0' + n : String(n); }

function shiftedDateClass(offsetMin) {
  const Real = Date;
  class ShiftDate extends Real {
    getFullYear() { return new Real(this.getTime() + offsetMin * 60000).getUTCFullYear(); }
    getMonth() { return new Real(this.getTime() + offsetMin * 60000).getUTCMonth(); }
    getDate() { return new Real(this.getTime() + offsetMin * 60000).getUTCDate(); }
    getHours() { return new Real(this.getTime() + offsetMin * 60000).getUTCHours(); }
    getMinutes() { return new Real(this.getTime() + offsetMin * 60000).getUTCMinutes(); }
  }
  return ShiftDate;
}

function runPanel(html, label, DateImpl, seriesOverride, prevOverride) {
  let src = html;
  if (seriesOverride !== undefined) {
    if (!/const SERIES = \[[\s\S]*?\];/.test(src)) throw new Error('SERIES literal not found');
    src = src.replace(/const SERIES = \[[\s\S]*?\];/, 'const SERIES = ' + JSON.stringify(seriesOverride) + ';');
  }
  if (prevOverride !== undefined) {
    if (!/const PREV = [^;]*;/.test(src)) throw new Error('PREV literal not found');
    src = src.replace(/const PREV = [^;]*;/, 'const PREV = ' + JSON.stringify(prevOverride) + ';');
  }
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
    document, console, Date: DateImpl || Date, Math, Object, Array, String, Number,
    isNaN, parseInt, parseFloat, JSON, setTimeout
  };
  vm.runInNewContext(m[1], sandbox, { filename: label, timeout: 5000 });
  return { get: (id) => (els[id] ? els[id] : makeEl(id)) };
}

function seriesOf(html) {
  const m = html.match(/const SERIES = (\[[\s\S]*?\]);/);
  if (!m) throw new Error('SERIES literal not found');
  return JSON.parse(m[1]);
}

function snapOf(html) {
  const m = html.match(/const SNAP = (\{[\s\S]*?\});/);
  if (!m) return {};
  return JSON.parse(m[1]);
}

// Visible text only: drop tags and title/class/style attributes, so hover-only
// raw ISO does not count as "printed".
function visibleText(html) {
  return html.replace(/\s(title|class|style)="[^"]*"/g, '').replace(/<[^>]*>/g, '');
}

// Normal rows: <span class="t" title="...">MM-DD HH:MM</span>
function normalRows(html) {
  const out = [];
  const re = /<span class="t"(?: title="([^"]*)")?>([^<]*)<\/span>/g;
  let g;
  while ((g = re.exec(html)) !== null) {
    if (g[2] === '…') continue;
    out.push({ text: g[2], title: g[1] || '' });
  }
  return out;
}

// Flat fold rows: <span class="tag" title="...">MM-DD HH:MM → MM-DD HH:MM</span>
function flatRows(html) {
  const out = [];
  const re = /<span class="tag"(?: title="([^"]*)")?>([^<]*→[^<]*)<\/span>/g;
  let g;
  while ((g = re.exec(html)) !== null) out.push({ text: g[2], title: g[1] || '' });
  return out;
}

// Local clock the page is expected to print. No offset => the host timezone
// (what a reader of this build actually sees); offset => a sandbox whose local
// clock is UTC+offset.
function wantLocal(ts, offsetMin) {
  if (!offsetMin) {
    const d = new Date(Date.parse(ts));
    return p2(d.getMonth() + 1) + '-' + p2(d.getDate()) + ' ' +
      p2(d.getHours()) + ':' + p2(d.getMinutes());
  }
  const d = new Date(Date.parse(ts) + offsetMin * 60000);
  return p2(d.getUTCMonth() + 1) + '-' + p2(d.getUTCDate()) + ' ' +
    p2(d.getUTCHours()) + ':' + p2(d.getUTCMinutes());
}

// Same but as the absolute-clock title prefix (YYYY-MM-DD HH:MM).
function wantLocalFull(ts, offsetMin) {
  const d = new Date(Date.parse(ts) + (offsetMin || 0) * 60000);
  const y = offsetMin ? d.getUTCFullYear() : d.getFullYear();
  const mo = offsetMin ? d.getUTCMonth() + 1 : d.getMonth() + 1;
  const da = offsetMin ? d.getUTCDate() : d.getDate();
  const h = offsetMin ? d.getUTCHours() : d.getHours();
  const mi = offsetMin ? d.getUTCMinutes() : d.getMinutes();
  return y + '-' + p2(mo) + '-' + p2(da) + ' ' + p2(h) + ':' + p2(mi);
}

let pass = 0, fail = 0;
function chk(name, cond, detail) {
  if (cond) { pass++; console.log('PASS ' + name); }
  else { fail++; console.log('FAIL ' + name + ' :: ' + detail); }
}

// ---------- 1) real build, host timezone: trend list ----------
const data = seriesOf(realHtml).slice(-12);
const real = runPanel(realHtml, 'real');
const rowsHtml = real.get('cv-trend').innerHTML;
const rows = normalRows(rowsHtml);
const flats = flatRows(rowsHtml);

chk('real.rows.present', rows.length >= 1, 'n=' + rows.length);
chk('real.rows.local-shape', rows.length >= 1 && rows.every(r => /^\d\d-\d\d \d\d:\d\d$/.test(r.text)),
  JSON.stringify(rows.map(r => r.text)));
chk('real.rows.title-absolute', rows.length >= 1 && rows.every(r => /^\d{4}-\d\d-\d\d \d\d:\d\d（/.test(r.title)),
  JSON.stringify(rows.map(r => r.title)));
chk('real.rows.first-matches-series', rows.length >= 1 && rows[0].text === wantLocal(data[0].ts),
  'text=' + (rows[0] && rows[0].text) + ' want=' + wantLocal(data[0].ts));
chk('real.rows.no-utc-in-visible', rowsHtml.indexOf(' UTC') < 0,
  'found UTC in ' + rowsHtml.slice(0, 200));
chk('real.rows.no-raw-iso-visible', visibleText(rowsHtml).indexOf('T00:') < 0 &&
  !/\d\d:\d\d:\d\d/.test(visibleText(rowsHtml)),
  'visible=' + visibleText(rowsHtml).slice(0, 160));

// ---------- 2) +05:30 sandbox: row text must follow the local clock ----------
const shift = 330;
const Shifted = shiftedDateClass(shift);
const sRun = runPanel(realHtml, 'shifted', Shifted);
const sRows = normalRows(sRun.get('cv-trend').innerHTML);
chk('shift.rows.present', sRows.length >= 1, 'n=' + sRows.length);
chk('shift.rows.follow-local', sRows.length >= 1 && sRows[0].text === wantLocal(data[0].ts, shift),
  'text=' + (sRows[0] && sRows[0].text) + ' want=' + wantLocal(data[0].ts, shift));
chk('shift.rows.differ-from-utc', sRows.length >= 1 && sRows[0].text !== wantLocal(data[0].ts),
  'local=' + (sRows[0] && sRows[0].text) + ' utc=' + wantLocal(data[0].ts));
chk('shift.rows.title-follows-local', sRows.length >= 1 &&
  sRows[0].title.indexOf(wantLocalFull(data[0].ts, shift)) === 0,
  'title=' + (sRows[0] && sRows[0].title) + ' want-prefix=' + wantLocalFull(data[0].ts, shift));

// ---------- 3) fold line: local span, both absolute clocks in title ----------
// Fixture: record 1 differs, records 2-3 identical to record 1, record 4 differs.
const fx = [
  { ts: '2026-10-20T00:00:00Z', c: 10, r: 100, g: 5, f: 5, e: 50 },
  { ts: '2026-10-20T00:10:00Z', c: 10, r: 100, g: 5, f: 5, e: 50 },
  { ts: '2026-10-20T00:20:00Z', c: 10, r: 100, g: 5, f: 5, e: 50 },
  { ts: '2026-10-20T00:30:00Z', c: 12, r: 100, g: 5, f: 5, e: 50 }
];
const fxRun = runPanel(realHtml, 'fixture-flat', Date, fx);
const fxRows = normalRows(fxRun.get('cv-trend').innerHTML);
const fxFlats = flatRows(fxRun.get('cv-trend').innerHTML);
chk('flat.one-fold-line', fxFlats.length === 1, 'n=' + fxFlats.length);
chk('flat.fold-count-2', /持平 2 条/.test(fxRun.get('cv-trend').innerHTML),
  'visible=' + visibleText(fxRun.get('cv-trend').innerHTML));
chk('flat.fold-span-local', fxFlats.length === 1 &&
  fxFlats[0].text === wantLocal('2026-10-20T00:10:00Z') + ' → ' + wantLocal('2026-10-20T00:20:00Z'),
  'text=' + (fxFlats[0] && fxFlats[0].text));
chk('flat.fold-title-both-stamps', fxFlats.length === 1 &&
  fxFlats[0].title.indexOf('T00:10:00Z') > 0 && fxFlats[0].title.indexOf('T00:20:00Z') > 0,
  'title=' + (fxFlats[0] && fxFlats[0].title));
chk('flat.shown-plus-folded', fxRows.length >= 2, 'shown=' + fxRows.length);

// ---------- 4) same fixture under +05:30: fold span must shift too ----------
const fxShift = runPanel(realHtml, 'fixture-flat-shifted', Shifted, fx);
const fxSFlats = flatRows(fxShift.get('cv-trend').innerHTML);
chk('flat.shift.local', fxSFlats.length === 1 &&
  fxSFlats[0].text === wantLocal('2026-10-20T00:10:00Z', shift) + ' → ' +
    wantLocal('2026-10-20T00:20:00Z', shift),
  'text=' + (fxSFlats[0] && fxSFlats[0].text));

// ---------- 5) comparison anchor (same card, same disease) ----------
const pv = { ts: '2026-10-20T00:11:03Z', c: 100, r: 50, g: 5, f: 3, e: 40 };
const pvRun = runPanel(realHtml, 'fixture-prev', Date, undefined, pv);
const pvText = pvRun.get('cv-prev').textContent;
const pvTitle = pvRun.get('cv-prev').title;
chk('prev.local-clock', pvText.indexOf('对比 ' + wantLocal(pv.ts)) === 0,
  'text=' + JSON.stringify(pvText) + ' want=' + wantLocal(pv.ts));
chk('prev.no-raw-iso-visible', pvText.indexOf('T00:11:03') < 0 && pvText.indexOf(' UTC') < 0,
  'text=' + JSON.stringify(pvText));
chk('prev.title-absolute', pvTitle.indexOf(wantLocalFull(pv.ts)) === 0 && pvTitle.indexOf(pv.ts) > 0,
  'title=' + JSON.stringify(pvTitle));
const pvShift = runPanel(realHtml, 'fixture-prev-shifted', Shifted, undefined, pv);
chk('prev.shift-follows-local',
  pvShift.get('cv-prev').textContent.indexOf('对比 ' + wantLocal(pv.ts, shift)) === 0,
  'text=' + JSON.stringify(pvShift.get('cv-prev').textContent));
const pvNone = runPanel(realHtml, 'fixture-noprev', Date, undefined, null);
chk('prev.none-no-title', pvNone.get('cv-prev').textContent === '无上一条快照' &&
  pvNone.get('cv-prev').title === '',
  'text=' + JSON.stringify(pvNone.get('cv-prev').textContent) +
  ' title=' + JSON.stringify(pvNone.get('cv-prev').title));

// ---------- 6) event stream rows (third card, same disease) ----------
const evHtml = real.get('events').innerHTML;
const evRows = normalRows(evHtml);
const evList = (snapOf(realHtml).events_tail || []).slice();
const evLast = evList.length ? evList[evList.length - 1] : null; // list renders newest first
chk('events.rows>0', evRows.length > 0, 'n=' + evRows.length);
chk('events.local-shape', evRows.length > 0 && evRows.every(r => /^\d\d-\d\d \d\d:\d\d$/.test(r.text)),
  JSON.stringify(evRows.slice(0, 3).map(r => r.text)));
chk('events.first-matches', !!evLast && evRows.length > 0 &&
  evRows[0].text === wantLocal(evLast.ts_utc),
  'text=' + (evRows[0] && evRows[0].text) + ' want=' + (evLast && wantLocal(evLast.ts_utc)));
chk('events.title-absolute', evRows.length > 0 && evRows.every(r => /^\d{4}-\d\d-\d\d \d\d:\d\d（/.test(r.title)),
  JSON.stringify(evRows.slice(0, 2).map(r => r.title)));
chk('events.no-raw-iso-visible',
  visibleText(evHtml).indexOf('UTC') < 0 && !/\d\d:\d\d:\d\d/.test(visibleText(evHtml)),
  'visible=' + visibleText(evHtml).slice(0, 160));
const evShift = runPanel(realHtml, 'events-shifted', Shifted);
const evShiftRows = normalRows(evShift.get('events').innerHTML);
chk('events.shift-follows-local', !!evLast && evShiftRows.length > 0 &&
  evShiftRows[0].text === wantLocal(evLast.ts_utc, shift),
  'text=' + (evShiftRows[0] && evShiftRows[0].text) +
  ' want=' + (evLast && wantLocal(evLast.ts_utc, shift)));

// ---------- 7) bad stamp must not blow up or invent a clock ----------
const badRun = runPanel(realHtml, 'fixture-bad', Date, [
  { ts: 'not-a-time', c: 1, r: 1, g: 1, f: 1, e: 1 },
  { ts: '2026-10-20T00:30:00Z', c: 2, r: 1, g: 1, f: 1, e: 1 }
]);
chk('bad.no-throw', true);
chk('bad.keeps-raw-text', badRun.get('cv-trend').innerHTML.indexOf('not-a-time') >= 0,
  'html=' + badRun.get('cv-trend').innerHTML.slice(0, 200));
chk('bad.no-empty-title', badRun.get('cv-trend').innerHTML.indexOf('title=""') < 0);

console.log('RESULT pass=' + pass + ' fail=' + fail);
process.exit(fail ? 1 : 0);