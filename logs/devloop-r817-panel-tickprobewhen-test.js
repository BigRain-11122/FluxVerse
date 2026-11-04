// r817 panel test (contract re-judged in r818): the cumulative probe tag must
// say WHICH rounds were bad, not just how many (queue main#135).
// r817 named the first and last bad round with an en dash - honest only if the
// badness was continuous. Measured counter-example: 'rich, clean, rich' printed
// "08:00–10:00", which reads as "bad from 8 to 10" while 09:00 was clean.
// r818 ships the stamps themselves: every bad round when there are three or
// fewer, else the two ends plus the count.
// Method: build the REAL panel against fixture tick logs and run the produced
// page's own script, then read the rendered tags (same harness as r813-r817).
// Cases:
//   A. bad, clean, bad  -> BOTH stamps named, no en dash (the r818 fix)
//   B. one bad round    -> a single stamp, no dash
//   C. clean day        -> no tag at all (regression of r816 behaviour)
//   D. anti-drift       -> one helper, stamps emitted by the builder
//   E. older payload (no stamps key) -> exactly the r816 sentence, no clock
//   F. four bad rounds  -> first/last plus the count, never a bare range
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const vm = require('vm');
const { spawnSync } = require('child_process');

const TOTAL_LABEL = '\u4eca\u65e5\u63a2\u9488\u574f ';    // "today probes bad "
const KAI = '\uff08';                                      // "("
const BI = '\uff09';                                       // ")"
const WEN = '\u5904';                                      // " spots"
const MEI = ' \u679a';                                     // " probes"
const DASH = '\u2013';                                     // en dash
const SEP = '\u3001';                                      // "、"
const SHOU = '\u9996';                                     // "first"
const MO = '\u672b';                                       // "last"
const GONG = '\u5171';                                     // "total"

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'fv-r818-'));
const builder = path.join('Tools', 'devloop', 'build-city-panel.ps1');

function scanLines(probes) {
  const lines = ['scan: perceptor v0.7 done: events +8 quarantined=0 fleet=7 tasks=188'];
  probes.forEach(p => lines.push('scan:   probe ' + p.name + ': ' + p.status));
  return lines;
}

function manyProbes() {
  const probes = [];
  for (let k = 0; k < 26; k++) probes.push({ name: 'p' + k, status: 'OK' });
  return probes;
}

function richProbes() {
  return [
    { name: 'a', status: 'OK' },
    { name: 'b', status: 'FAIL boom' },
    { name: 'c', status: 'OK' },
    { name: 'd', status: 'FAIL timeout' }
  ];
}

function tickLog(rounds) {
  const lines = [];
  rounds.forEach((kind, i) => {
    const hh = String(8 + i).padStart(2, '0');
    lines.push('[' + '2026-11-04 ' + hh + ':00:00] FluxVerseTick round start');
    let body = [];
    if (kind === 'gate') {
      body = scanLines([{ name: 'census', status: 'OK' }]).concat(['gate: PASS']);
    } else if (kind === 'many') {
      body = scanLines(manyProbes()).concat(['gate: PASS']);
    } else if (kind === 'rich') {
      body = scanLines(richProbes()).concat(['gate: PASS']);
    }
    body.forEach(l => lines.push('  ' + l));
    lines.push('[' + '2026-11-04 ' + hh + ':00:30] round end');
  });
  return lines.join('\r\n') + '\r\n';
}

function build(name, rounds) {
  const logPath = path.join(tmp, name + '-tick.log');
  fs.writeFileSync(logPath, tickLog(rounds), 'utf8');
  const outHtml = path.join(tmp, name + '.html');
  const hist = path.join(tmp, name + '-hist.jsonl');
  const r = spawnSync('powershell', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', builder,
    '-TickLogPath', logPath, '-OutPath', outHtml, '-HistoryPath', hist], { encoding: 'utf8' });
  const out = (r.stdout || '') + (r.stderr || '');
  const html = fs.existsSync(outHtml) ? fs.readFileSync(outHtml, 'utf8') : '';
  return { out: out, html: html, code: r.status };
}

function scriptOf(html, label) {
  const m = html.match(/<script>([\s\S]*?)<\/script>/);
  if (!m) throw new Error('no inline script in ' + label);
  return m[1];
}

function runPanel(html, label) {
  const els = {};
  const makeEl = (id) => ({
    id: id, textContent: '', innerHTML: '', className: '', style: {}, title: '',
    children: [],
    appendChild(c) { this.children.push(c); },
    addEventListener() {},
    scrollIntoView() {}
  });
  const document = {
    getElementById(id) { return els[id] || (els[id] = makeEl(id)); },
    createElement() { return makeEl('span'); },
    querySelectorAll() { return []; }
  };
  const sandbox = { document, console, Date, Math, Object, Array, String, Number, isNaN, setTimeout };
  vm.runInNewContext(scriptOf(html, label), sandbox, { filename: label, timeout: 5000 });
  return { get: (id) => (els[id] || makeEl(id)), has: (id) => !!els[id] };
}

function tickOf(html) {
  const m = html.match(/const TICK = ([\s\S]*?);\r?\n/);
  if (!m) throw new Error('TICK constant not found');
  return JSON.parse(m[1]);
}

function tags(panel) {
  const el = panel.get('f-tick');
  return (el.children || []).map(c => ({ text: c.textContent || '', cls: c.className || '', title: c.title || '' }));
}

function selfcheckText(panel) {
  return String(panel.get('selfcheck').innerHTML || '');
}

let pass = 0, fail = 0;
function ck(cond, name, detail) {
  if (cond) { pass++; console.log('  ok   ' + name); }
  else { fail++; console.log('  FAIL ' + name + (detail ? ' :: ' + detail : '')); }
}

// --- A) bad, clean, bad -> BOTH stamps named, no dash ----------------------
const A = build('a', ['rich', 'gate', 'rich']);
ck(A.code === 0, 'A: builder exit 0', 'code=' + A.code + ' out=' + A.out.slice(0, 400));
ck(/ probe_bad_rounds=2\b/.test(A.out), 'A: PANEL OK probe_bad_rounds=2',
  (A.out.match(/probes_bad_all=[^\r\n]*/) || [''])[0]);
ck(/ probe_bad_stamps=08:00,10:00\b/.test(A.out), 'A: PANEL OK names both bad rounds',
  (A.out.match(/probe_bad_stamps=[^\s]*/) || [''])[0]);
const aTick = tickOf(A.html);
ck(Array.isArray(aTick.probe_bad_stamps) && aTick.probe_bad_stamps.length === 2 &&
  aTick.probe_bad_stamps[0] === '08:00' && aTick.probe_bad_stamps[1] === '10:00',
  'A: page carries the stamp list', JSON.stringify(aTick.probe_bad_stamps));
const aTot = tags(runPanel(A.html, 'A')).filter(t => t.text.indexOf(TOTAL_LABEL) === 0);
const aWant = TOTAL_LABEL + '4 ' + WEN + KAI + '9' + MEI + ' \u00b7 2 \u8f6e' +
  ' \u00b7 08:00' + SEP + '10:00' + BI;
ck(aTot.length === 1 && aTot[0].text === aWant,
  'A: names both rounds instead of a first-last span', aTot.length ? aTot[0].text : 'none');
ck(aTot.length === 1 && aTot[0].text.indexOf(DASH) < 0,
  'A: no en dash (it read as "bad from 8 to 10")', aTot.length ? aTot[0].text : 'none');
const aSelf = selfcheckText(runPanel(A.html, 'A2'));
ck(aSelf.indexOf('08:00') >= 0 && aSelf.indexOf('10:00') >= 0,
  'A: self-check row carries the same stamps', aSelf.slice(0, 400));

// --- B) one bad round -> a single stamp, no dash ---------------------------
const B = build('b', ['rich', 'gate', 'many']);
ck(/ probe_bad_rounds=1\b/.test(B.out), 'B: PANEL OK probe_bad_rounds=1',
  (B.out.match(/probe_bad_rounds=\d+/) || [''])[0]);
ck(/ probe_bad_stamps=08:00\b/.test(B.out), 'B: PANEL OK carries the single stamp',
  (B.out.match(/probe_bad_stamps=[^\s]*/) || [''])[0]);
const bTot = tags(runPanel(B.html, 'B')).filter(t => t.text.indexOf(TOTAL_LABEL) === 0);
const bWant = TOTAL_LABEL + '2 ' + WEN + KAI + '31' + MEI + ' \u00b7 1 \u8f6e' + ' \u00b7 08:00' + BI;
ck(bTot.length === 1 && bTot[0].text === bWant,
  'B: one bad round prints its stamp once (no dash)', bTot.length ? bTot[0].text : 'none');
ck(bTot.length === 1 && bTot[0].text.indexOf(DASH) < 0,
  'B: no en dash for a single round', bTot.length ? bTot[0].text : 'none');

// --- C) clean day: no tag at all (r816 regression) -------------------------
const C = build('c', ['gate', 'many']);
ck(/ probes_bad_all=0\b/.test(C.out), 'C: PANEL OK probes_bad_all=0',
  (C.out.match(/probes_bad_all=\d+/) || [''])[0]);
ck(/ probe_bad_stamps=none\b/.test(C.out),
  'C: no stamps on a clean day (none, not an empty clock)',
  (C.out.match(/probe_bad_stamps=[^\s]*/) || [''])[0]);
ck(tags(runPanel(C.html, 'C')).filter(t => t.text.indexOf(TOTAL_LABEL) === 0).length === 0,
  'C: no cumulative tag on a clean day');

// --- D) anti-drift --------------------------------------------------------
const tpl = fs.readFileSync(path.join('Tools', 'devloop', 'city-panel-template.html'), 'utf8');
ck((tpl.match(/function tickProbeTotalText\s*\(/g) || []).length === 1,
  'D: template still defines tickProbeTotalText once');
ck((tpl.match(/function tickProbeWhen\s*\(/g) || []).length === 1,
  'D: exactly one helper decides which rounds to name');
ck(/probe_bad_stamps/.test(tpl), 'D: template reads the stamp list');
ck((tpl.match(/tickProbeTotalText\(tk\)/g) || []).length >= 2,
  'D: both the row and the self-check call it',
  String((tpl.match(/tickProbeTotalText\(tk\)/g) || []).length));
const bsrc = fs.readFileSync(builder, 'utf8');
ck(/probe_bad_stamps\s*=\s*@\(\$probeBadStamps\)/.test(bsrc),
  'D: builder emits the stamp list into the TICK payload');
ck(/' probe_bad_stamps='/.test(bsrc), 'D: builder prints the token on PANEL OK');

// --- E) older payload without the stamps -> the r816 sentence -------------
// Built from case A (which really had bad rounds), so this is the "count known,
// clock unknown" shape rather than a clean day that would print nothing anyway.
const strippedHtml = A.html.replace(/const TICK = ([\s\S]*?);\r?\n/, function (m, body) {
  let obj;
  try { obj = JSON.parse(body); } catch (e) { return m; }
  delete obj.probe_bad_stamps;
  const lines = Object.keys(obj).map(k => '  ' + JSON.stringify(k) + ': ' + JSON.stringify(obj[k]));
  return 'const TICK = {\n' + lines.join(',\n') + '\n};\n';
});
ck(strippedHtml !== A.html, 'E: legacy fixture really removed the stamps');
const eTick = (function () {
  const m = strippedHtml.match(/const TICK = ([\s\S]*?);\r?\n/);
  return m ? JSON.parse(m[1]) : {};
})();
ck(eTick.probes_bad_all === 4 && !('probe_bad_stamps' in eTick),
  'E: fixture keeps the count and drops the stamps', JSON.stringify(eTick.probes_bad_all));
const eTot = tags(runPanel(strippedHtml, 'E')).filter(t => t.text.indexOf(TOTAL_LABEL) === 0);
const eWant = TOTAL_LABEL + '4 ' + WEN + KAI + '9' + MEI + ' \u00b7 2 \u8f6e' + BI;
ck(eTot.length === 1 && eTot[0].text === eWant,
  'E: falls back to the r816 sentence, no invented clock',
  eTot.length ? eTot[0].text : 'none');
ck(eTot.length === 1 && !/\d{2}:\d{2}/.test(eTot[0].text) && eTot[0].text.indexOf(DASH) < 0,
  'E: no clock and no dash when the log cannot answer');

// --- F) four bad rounds -> first/last + count, never a bare range ---------
const F = build('f', ['rich', 'gate', 'rich', 'gate', 'rich', 'gate', 'rich']);
ck(/ probe_bad_rounds=4\b/.test(F.out), 'F: PANEL OK probe_bad_rounds=4',
  (F.out.match(/probe_bad_rounds=\d+/) || [''])[0]);
ck(/ probe_bad_stamps=08:00,14:00\b/.test(F.out),
  'F: PANEL OK keeps only the two ends when four rounds were bad',
  (F.out.match(/probe_bad_stamps=[^\s]*/) || [''])[0]);
const fTot = tags(runPanel(F.html, 'F')).filter(t => t.text.indexOf(TOTAL_LABEL) === 0);
const fWant = TOTAL_LABEL + '8 ' + WEN + KAI + '19' + MEI + ' \u00b7 4 \u8f6e' +
  ' \u00b7 ' + SHOU + ' 08:00 / ' + MO + ' 14:00' + KAI + GONG + ' 4 \u8f6e' + BI + BI;
ck(fTot.length === 1 && fTot[0].text === fWant,
  'F: says first/last and the count of named-or-not rounds',
  fTot.length ? fTot[0].text : 'none');
ck(fTot.length === 1 && fTot[0].text.indexOf(DASH) < 0,
  'F: four bad rounds still do not print a bare range',
  fTot.length ? fTot[0].text : 'none');

try { fs.rmSync(tmp, { recursive: true, force: true }); } catch (e) { /* temp only */ }

console.log('');
console.log('RESULT: pass=' + pass + ' fail=' + fail);
if (fail > 0) process.exit(1);