// r709 panel test: the panel gains a duty card (queue main#50).
// The group's decision rounds order work by name ("D-.... dispatched（... 10-31 00:00）")
// but that list was only reachable by grepping docs/decisions.md. The builder now
// parses it read-only into DUTY and the page renders it below the framing card.
// Acceptance:
//   1. the real page compiles (vm.Script)
//   2. real build: the card renders exactly one row per DUTY row
//   3. real build: an overdue row is marked late (warn tag + "已逾期")
//   4. real build: self-check has a "应办令" row and it warns while anything is late
//   5. missing file => card says missing (never "no duty")
//   6. rows flattened to a single object by PS5.1 ConvertTo-Json => still 1 row
//   7. rows serialised as "" (empty array flattening) => "no duty", no crash
//   8. no undefined/NaN leaks into the duty card
//   9. rendered self-check rows === selfcheck.push count in the template
'use strict';
const fs = require('fs');
const vm = require('vm');

const realHtml = fs.readFileSync('world-public/city-panel.html', 'utf8');
const template = fs.readFileSync('Tools/devloop/city-panel-template.html', 'utf8');
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

function withDuty(html, obj) {
  const re = /const DUTY = \{[\s\S]*?\};\n/;
  if (!re.test(html)) throw new Error('cannot locate const DUTY');
  return html.replace(re, () => 'const DUTY = ' + JSON.stringify(obj) + ';\n');
}

function dutyRows(run) {
  const body = String(run.get('duty').innerHTML || '');
  return body.split('<div class="prow">').slice(1).map(c => ({
    warn: c.indexOf('class="tag warn"') >= 0 || c.indexOf('class="pv warn"') >= 0,
    text: c.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim(),
    raw: c
  }));
}

function rowOf(run, nm) {
  const body = String(run.get('selfcheck').innerHTML || '');
  const chunks = body.split('<div class="chk">').slice(1);
  for (const c of chunks) {
    if (c.indexOf('<span class="nm">' + nm + '</span>') >= 0) {
      return {
        ok: c.indexOf('<span class="st ok">') >= 0,
        warn: c.indexOf('<span class="st warn">') >= 0,
        vd: (c.match(/<span class="vd"[^>]*>([\s\S]*?)<\/span>/) || [, ''])[1],
        raw: c
      };
    }
  }
  return null;
}

let pass = 0, fail = 0;
function chk(name, cond, detail) {
  if (cond) { pass++; console.log('  OK   ' + name); }
  else { fail++; console.log('  FAIL ' + name + (detail ? '  [' + detail + ']' : '')); }
}

// 1. the real inline script compiles
let compiled = true;
try { new vm.Script(src); } catch (e) { compiled = false; }
chk('real page inline script compiles', compiled);

const real = runPanelHtml(realHtml, 'ledger-panel');
const duty = (() => {
  const m = realHtml.match(/const DUTY = (\{[\s\S]*?\});\n/);
  return m ? JSON.parse(m[1]) : null;
})();
chk('real page ships a DUTY object', !!duty && duty.exists === true);
const rows = Array.isArray(duty.rows) ? duty.rows : (duty.rows ? [duty.rows] : []);
// r848: the live duty list can be genuinely EMPTY (no group decision round names
// this company right now), and then the page renders exactly one empty-state
// row. Comparing "rendered rows" to "data rows" made this suite a calendar
// bomb: it went red the day the list emptied, with code unchanged. The contract
// is the same in both directions - rows present => one row each; rows absent =>
// one honest empty-state row and no invented data row.
if (rows.length === 0) {
  const shown = dutyRows(real);
  chk('real build: empty duty list renders the empty-state row only',
    shown.length === 1 && shown[0].text.indexOf('\u5f85\u529e\u4ee4') >= 0,
    'rendered=' + shown.length + (shown[0] ? ' text=' + shown[0].text : ''));
} else {
  chk('real build: one rendered row per DUTY row', dutyRows(real).length === rows.length,
    'rendered=' + dutyRows(real).length + ' data=' + rows.length);
}
chk('real build: every row shows its decision id',
  rows.every(r => dutyRows(real).some(x => x.text.indexOf(r.id) >= 0)));
chk('real build: overdue rows are marked late',
  rows.filter(r => Date.parse(r.due_utc) < Date.now()).every(r =>
    dutyRows(real).some(x => x.text.indexOf(r.id) >= 0 && x.warn && x.text.indexOf('逾期') >= 0)));

// 4. self-check row exists and follows the late count
const scDuty = rowOf(real, '应办令');
chk('real build: self-check has a duty row', !!scDuty);
const lateN = rows.filter(r => Date.parse(r.due_utc) < Date.now()).length;
chk('real build: duty self-check warns iff something is late',
  !!scDuty && (lateN > 0 ? (scDuty.warn && scDuty.vd.indexOf(String(lateN)) >= 0) : scDuty.ok),
  'late=' + lateN + ' vd=' + (scDuty && scDuty.vd));

// 4b. r807: the summary line itself must not read the same whether we still owe
// work or already answered and are waiting on the group ledger. Data-driven so
// the assertion survives a new unanswered order arriving.
{
  const lateRowsReal = rows.filter(r => Date.parse(r.due_utc) < Date.now());
  const allAnswered = lateRowsReal.length > 0 && lateRowsReal.every(r => !!r.receipt_f);
  const anyAnswered = lateRowsReal.some(r => !!r.receipt_f);
  const rsum = String(real.get('duty-sum').textContent);
  chk('real build: summary matches the real receipt state',
    allAnswered ? rsum.indexOf('逾期项均已回执') >= 0
      : (anyAnswered ? (rsum.indexOf('其中') >= 0 && rsum.indexOf('均已回执') < 0)
        : rsum.indexOf('均已回执') < 0),
    'late=' + lateRowsReal.length + ' answered=' + lateRowsReal.filter(r => !!r.receipt_f).length + ' sum=' + rsum);
}

// 5. missing decision file must not masquerade as "nothing to do"
const miss = runPanelHtml(withDuty(realHtml, {
  exists: false, path_rel: '', url: '', as_of_utc: '', scanned: 0, matched: 0, open: 0, late: 0, rows: []
}), 'duty-missing');
chk('missing file: card says missing', String(miss.get('duty').innerHTML).indexOf('不在盘') >= 0);
chk('missing file: summary tag says missing', String(miss.get('duty-sum').textContent).indexOf('缺失') >= 0);
chk('missing file: self-check warns', (rowOf(miss, '应办令') || {}).warn === true);

// 6. PS5.1 flattens single-element arrays into a bare object
const one = runPanelHtml(withDuty(realHtml, {
  exists: true, path_rel: 'x', url: '', as_of_utc: '2026-10-28T04:00:00Z',
  scanned: 3, matched: 1, open: 1, late: 0,
  rows: { id: 'D-20261028-99', subject: 'single row fixture', status: 'dispatched', due_txt: '', due_utc: '', action: '' }
}), 'duty-single');
chk('flattened single row still renders one row', dutyRows(one).length === 1);
chk('flattened single row keeps its id', String(one.get('duty').innerHTML).indexOf('D-20261028-99') >= 0);
chk('row without a deadline is not called late', dutyRows(one)[0].warn === false);

// 7. empty array flattened to "" must read as "no duty", not crash
const none = runPanelHtml(withDuty(realHtml, {
  exists: true, path_rel: 'x', url: '', as_of_utc: '', scanned: 7, matched: 0, open: 0, late: 0, rows: ''
}), 'duty-empty');
chk('empty rows string renders the no-duty line', String(none.get('duty').innerHTML).indexOf('无点名本司') >= 0);
chk('empty rows: summary says none', String(none.get('duty-sum').textContent).indexOf('无待办') >= 0);
chk('empty rows: self-check passes', (rowOf(none, '应办令') || {}).ok === true);

// 7b. receipts: an order the group ledger still lists as dispatched, and that we
// already answered with an F- line in ./HQ-FEEDBACK.md, must not read as an
// ignored order. Three states, three different words - never two.
const rc = runPanelHtml(withDuty(realHtml, {
  exists: true, path_rel: 'x', url: '', as_of_utc: '2026-10-31T04:00:00Z',
  scanned: 4, matched: 3, open: 3, late: 2, receipted: 2, receipts_exists: true, receipts_count: 45,
  rows: [
    { id: 'D-20261028-04', subject: 'replied and late', status: 'dispatched',
      due_txt: '10-31 00:00', due_utc: '2026-10-30T16:00:00Z', action: '', receipt_f: 'F-20261028-01' },
    { id: 'D-20261028-11', subject: 'replied and late two', status: 'dispatched',
      due_txt: '10-31 00:00', due_utc: '2026-10-30T16:00:00Z', action: '', receipt_f: 'F-20261028-03' },
    { id: 'D-20261101-05', subject: 'not replied yet', status: 'dispatched',
      due_txt: '', due_utc: '', action: '', receipt_f: '' }
  ]
}), 'duty-receipts');
{
  const rendered = dutyRows(rc);
  chk('receipts: one rendered row per data row', rendered.length === 3, 'rendered=' + rendered.length);
  const repliedRows = rendered.filter(x => x.text.indexOf('已回执') >= 0);
  chk('receipts: replied rows show the F id', repliedRows.length === 2 &&
    repliedRows.some(x => x.text.indexOf('F-20261028-01') >= 0) &&
    repliedRows.some(x => x.text.indexOf('F-20261028-03') >= 0),
    'replied=' + repliedRows.length);
  chk('receipts: the unanswered row says 未回执 exactly once',
    rendered.filter(x => x.text.indexOf('未回执') >= 0).length === 1);
  chk('receipts: a replied overdue row still reads as overdue',
    rendered.find(x => x.text.indexOf('D-20261028-04') >= 0).warn === true);
  chk('receipts: summary carries the replied count',
    String(rc.get('duty-sum').textContent).indexOf('已回执 2') >= 0,
    'sum=' + String(rc.get('duty-sum').textContent));
}

// 7b2. r807: the summary must tell "we still owe work" from "we answered, the
// group ledger has not flipped it". Both late rows answered => say so; only
// some answered => say how many; receipts unknown => claim nothing.
{
  const rcAll = String(rc.get('duty-sum').textContent);
  chk('r807 summary: all late rows answered => says so',
    rcAll.indexOf('逾期项均已回执') >= 0 && rcAll.indexOf('等集团台账翻面') >= 0, 'sum=' + rcAll);
  chk('r807 summary: still warns (late is still true)',
    String(rc.get('duty-sum').className).indexOf('warn') >= 0,
    'cls=' + String(rc.get('duty-sum').className));

  const partial = runPanelHtml(withDuty(realHtml, {
    exists: true, path_rel: 'x', url: '', as_of_utc: '', scanned: 5, matched: 3, open: 3, late: 2,
    receipted: 1, receipts_exists: true, receipts_count: 45,
    rows: [
      { id: 'D-20261028-04', subject: 'replied late', status: 'dispatched',
        due_txt: '10-31 00:00', due_utc: '2026-10-30T16:00:00Z', action: '', receipt_f: 'F-20261028-01' },
      { id: 'D-20261028-11', subject: 'silent late', status: 'dispatched',
        due_txt: '10-31 00:00', due_utc: '2026-10-30T16:00:00Z', action: '', receipt_f: '' },
      { id: 'D-20261101-05', subject: 'not due yet', status: 'dispatched',
        due_txt: '', due_utc: '', action: '', receipt_f: '' }
    ]
  }), 'duty-receipts-partial');
  const pSum = String(partial.get('duty-sum').textContent);
  chk('r807 summary: partial answers are named as a count', pSum.indexOf('其中 1 已回执') >= 0, 'sum=' + pSum);
  chk('r807 summary: partial never claims all answered', pSum.indexOf('均已回执') < 0, 'sum=' + pSum);

  const noneLate = runPanelHtml(withDuty(realHtml, {
    exists: true, path_rel: 'x', url: '', as_of_utc: '', scanned: 2, matched: 1, open: 1, late: 0,
    receipted: 1, receipts_exists: true, receipts_count: 45,
    rows: [{ id: 'D-20261102-09', subject: 'answered, not due', status: 'dispatched',
      due_txt: '', due_utc: '', action: '', receipt_f: 'F-20261102-01' }]
  }), 'duty-receipts-nolate');
  const nSum = String(noneLate.get('duty-sum').textContent);
  chk('r807 summary: no late rows => no overdue sentence',
    nSum.indexOf('逾期项均已回执') < 0 && nSum.indexOf('其中') < 0, 'sum=' + nSum);
}

// 7c. missing receipt ledger: "unknown" must not be dressed up as "unanswered"
const rcUnknown = runPanelHtml(withDuty(realHtml, {
  exists: true, path_rel: 'x', url: '', as_of_utc: '', scanned: 2, matched: 1, open: 1, late: 0,
  receipted: 0, receipts_exists: false, receipts_count: 0,
  rows: [{ id: 'D-20261028-77', subject: 'receipts unreadable', status: 'dispatched',
    due_txt: '', due_utc: '', action: '', receipt_f: '' }]
}), 'duty-receipts-missing');
{
  const rendered = dutyRows(rcUnknown);
  chk('unknown receipts: row says 回执未知', rendered.length === 1 && rendered[0].text.indexOf('回执未知') >= 0);
  chk('unknown receipts: row never says 未回执', rendered[0].text.indexOf('未回执') < 0);
  chk('unknown receipts: hint explains the unknown',
    String(rcUnknown.get('duty-hint').textContent).indexOf('回执状态未知') >= 0);
  chk('unknown receipts: summary never invents a replied count',
    String(rcUnknown.get('duty-sum').textContent).indexOf('已回执') < 0);
}

// 8. no undefined/NaN leaks
const allText = [real, miss, one, none, rc, rcUnknown].map(r =>
  String(r.get('duty-hint').textContent)).join(' ');
chk('no undefined/NaN in the duty card', allText.indexOf('undefined') < 0 && allText.indexOf('NaN') < 0);

// 9. rendered self-check rows match the template's push count
const pushN = (template.match(/selfcheck\.push\(/g) || []).length;
const chkN = String(real.get('selfcheck').innerHTML).split('<div class="chk">').length - 1;
chk('self-check rows === template push count', chkN === pushN, 'rendered=' + chkN + ' push=' + pushN);

// 10. 「最近到期」must be the EARLIEST due date, not the first dated row (r808)
// The row order is decisions.md's writing order, which has nothing to do with
// how soon something is due, so `find(r => r.due_utc)` only told the truth by
// accident. Two future dates, the later one written first: the self-check must
// name the earlier one. Dates are relative to now so this cannot rot into a
// red on a future calendar day.
const stampOf = (iso) => {
  const d = new Date(Date.parse(iso));
  const p2 = (n) => (n < 10 ? '0' + n : String(n));
  return p2(d.getMonth() + 1) + '-' + p2(d.getDate()) + ' ' +
    p2(d.getHours()) + ':' + p2(d.getMinutes());
};
const soonIso = new Date(Date.now() + 3 * 86400000).toISOString();
const laterIso = new Date(Date.now() + 9 * 86400000).toISOString();
const near = runPanelHtml(withDuty(realHtml, {
  exists: true, path_rel: 'x', url: '', as_of_utc: '2026-11-01T00:00:00Z',
  scanned: 90, matched: 2, open: 2, late: 0, receipts_exists: true, receipts_count: 1,
  rows: [
    { id: 'D-LATER-01', subject: 'written first, due last', status: 'dispatched', due_txt: '', due_utc: laterIso, action: '' },
    { id: 'D-SOON-02', subject: 'written second, due first', status: 'dispatched', due_txt: '', due_utc: soonIso, action: '' }
  ]
}), 'duty-nearest');
const nearRow = rowOf(near, '应办令') || { vd: '' };
chk('nearest-due: names the earliest date, not the first row',
  nearRow.vd.indexOf(stampOf(soonIso)) >= 0 && nearRow.vd.indexOf(stampOf(laterIso)) < 0, nearRow.vd);
chk('nearest-due: still a clean (green) row when nothing is late', nearRow.ok === true, nearRow.vd);

// An unparseable due time cannot be ranked - it must not be shown as "soon",
// and if it is the only dated row the parenthetical disappears entirely.
const unparseable = runPanelHtml(withDuty(realHtml, {
  exists: true, path_rel: 'x', url: '', as_of_utc: '2026-11-01T00:00:00Z',
  scanned: 90, matched: 1, open: 1, late: 0, receipts_exists: true, receipts_count: 1,
  rows: [{ id: 'D-BAD-03', subject: 'broken time', status: 'dispatched', due_txt: 'not-a-date', due_utc: 'not-a-date', action: '' }]
}), 'duty-unparseable');
const badRow = rowOf(unparseable, '应办令') || { vd: '' };
chk('nearest-due: an unrankable time is not shown as the nearest',
  badRow.vd.indexOf('最近到期') < 0 && badRow.ok === true, badRow.vd);

console.log('\nRESULT: pass=' + pass + ' fail=' + fail);
process.exit(fail > 0 ? 2 : 0);