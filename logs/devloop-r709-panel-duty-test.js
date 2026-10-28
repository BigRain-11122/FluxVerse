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
chk('real build: one rendered row per DUTY row', dutyRows(real).length === rows.length,
  'rendered=' + dutyRows(real).length + ' data=' + rows.length);
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

// 8. no undefined/NaN leaks
const allText = [real, miss, one, none].map(r =>
  String(r.get('duty').innerHTML) + String(r.get('duty-sum').textContent) +
  String(r.get('duty-hint').textContent)).join(' ');
chk('no undefined/NaN in the duty card', allText.indexOf('undefined') < 0 && allText.indexOf('NaN') < 0);

// 9. rendered self-check rows match the template's push count
const pushN = (template.match(/selfcheck\.push\(/g) || []).length;
const chkN = String(real.get('selfcheck').innerHTML).split('<div class="chk">').length - 1;
chk('self-check rows === template push count', chkN === pushN, 'rendered=' + chkN + ' push=' + pushN);

console.log('\nRESULT: pass=' + pass + ' fail=' + fail);
process.exit(fail > 0 ? 2 : 0);