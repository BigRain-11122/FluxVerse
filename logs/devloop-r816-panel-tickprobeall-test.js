// r816 panel test: the tick row must say whether ANY round today had a broken
// probe, not just whether the LAST one did (r816). r815 gave the row "上轮探针
// 26 全 OK"; a probe that broke for two rounds and healed itself leaves that
// sentence intact and nothing else - true, and useless for "did anything go
// wrong today". builder accumulates every round's own `probe <name>: <status>`
// lines in the same read pass it already uses for skip_rounds.
// Method: build the REAL panel against fixture tick logs and run the produced
// page's own script, then read the rendered tags (same harness as r813-r815).
// Cases:
//   A. three clean rounds                  -> probes_all=53 probes_bad_all=0 and
//                                             NO cumulative tag (a warn tag on a
//                                             clean day is noise)
//   B. one bad round earlier, last clean   -> last-round tag says all OK, plus a
//                                             warn tag "今日探针坏 2 处(31 枚 · 1 轮)"
//   C. every round backed off (no scan)    -> probes_all=0 and no tag, never a 0
//   D. anti-drift: one helper, both call sites, builder emits the tokens
//   E. older TICK payload (no cumulative keys) -> no tag, never an invented 0
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const vm = require('vm');
const { spawnSync } = require('child_process');

const PROBE_LABEL = '\u4e0a\u8f6e\u63a2\u9488 ';        // "last round probes "
const ALL_OK = ' \u5168 OK';                              // " all OK"
const TOTAL_LABEL = '\u4eca\u65e5\u63a2\u9488\u574f ';    // "today probes bad "
const WEN = '\u5904';                                     // " spots"
const MEI = ' \u679a';                                    // " probes"

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'fv-r816-'));
const builder = path.join('Tools', 'devloop', 'build-city-panel.ps1');

function scanLines(probes, opts) {
  const o = opts || {};
  const lines = [];
  lines.push('scan: perceptor v0.7 done: events +8 quarantined=' + (o.quarantined || 0) +
    ' fleet=7 tasks=188');
  probes.forEach(p => {
    lines.push('scan:   probe ' + p.name + ': ' + p.status);
  });
  if (o.degraded > 0) {
    lines.push('scan: perceptor WARN: ' + o.degraded + ' probe(s) zero-read/degraded -> x; y');
  }
  return lines;
}

function manyProbes() {
  const probes = [];
  for (let k = 0; k < 26; k++) probes.push({ name: 'p' + k, status: 'OK' });
  return probes;
}

function tickLog(rounds) {
  const lines = [];
  rounds.forEach((kind, i) => {
    const hh = String(8 + i).padStart(2, '0');
    lines.push('[' + '2026-11-04 ' + hh + ':00:00] FluxVerseTick round start');
    let body;
    if (kind === 'backoff') {
      body = ['backoff: perceptor stack dirty (in-flight dev edits) - scan+verify skipped'];
    } else if (kind === 'gate') {
      body = scanLines([{ name: 'census', status: 'OK' }], {}).concat(['gate: PASS']);
    } else if (kind === 'many') {
      body = scanLines(manyProbes(), { quarantined: 0 }).concat(['gate: PASS']);
    } else if (kind === 'rich') {
      body = scanLines([
        { name: 'a', status: 'OK' },
        { name: 'b', status: 'FAIL boom' },
        { name: 'c', status: 'OK' },
        { name: 'd', status: 'FAIL timeout' }
      ], { quarantined: 0 }).concat(['gate: PASS']);
    } else {
      body = [];
    }
    body.forEach(l => lines.push('  ' + l));
    if (kind !== 'running') lines.push('[' + '2026-11-04 ' + hh + ':00:30] round end');
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

// --- A) three clean rounds: cumulative account exists but stays silent ------
const A = build('a', ['gate', 'many', 'many']);
ck(A.code === 0, 'A: builder exit 0', 'code=' + A.code + ' out=' + A.out.slice(0, 400));
ck(/ probes_all=53\b/.test(A.out), 'A: PANEL OK probes_all=53',
  (A.out.match(/tick=[^\r\n]*/) || [''])[0]);
ck(/ probes_bad_all=0\b/.test(A.out), 'A: PANEL OK probes_bad_all=0');
ck(/ probe_bad_rounds=0\b/.test(A.out), 'A: PANEL OK probe_bad_rounds=0');
const aTick = tickOf(A.html);
ck(aTick.probes_all === 53 && aTick.probes_bad_all === 0 && aTick.probe_bad_rounds === 0,
  'A: page carries the three cumulative readings', JSON.stringify(aTick));
const aTags = tags(runPanel(A.html, 'A'));
ck(aTags.filter(t => t.text.indexOf(TOTAL_LABEL) === 0).length === 0,
  'A: no cumulative tag on a clean day (a warn tag here is noise)',
  JSON.stringify(aTags.map(t => t.text)));
ck(aTags.filter(t => t.text.indexOf(PROBE_LABEL) === 0).length === 1,
  'A: the last-round sentence still shows', JSON.stringify(aTags.map(t => t.text)));

// --- B) one bad round earlier, the last round clean -------------------------
// This is the whole point: the row alone would read "26 all OK".
const B = build('b', ['rich', 'gate', 'many']);
ck(/ probes_all=31\b/.test(B.out), 'B: PANEL OK probes_all=31',
  (B.out.match(/probes_all=\d+/) || [''])[0]);
ck(/ probes_bad_all=2\b/.test(B.out), 'B: PANEL OK probes_bad_all=2');
ck(/ probe_bad_rounds=1\b/.test(B.out), 'B: PANEL OK probe_bad_rounds=1');
const bTick = tickOf(B.html);
ck(bTick.probes === 26 && bTick.probes_bad === 0,
  'B: the LAST round alone is clean (26/0)', JSON.stringify({ p: bTick.probes, b: bTick.probes_bad }));
const bTags = tags(runPanel(B.html, 'B'));
const bLast = bTags.filter(t => t.text.indexOf(PROBE_LABEL) === 0);
ck(bLast.length === 1 && bLast[0].text === PROBE_LABEL + '26' + ALL_OK,
  'B: last-round sentence is unchanged', bLast.length ? bLast[0].text : 'none');
const bTot = bTags.filter(t => t.text.indexOf(TOTAL_LABEL) === 0);
ck(bTot.length === 1, 'B: exactly one cumulative tag', JSON.stringify(bTags.map(t => t.text)));
const bWant = TOTAL_LABEL + '2 ' + WEN + '\uff08' + '31' + MEI + ' \u00b7 1 \u8f6e';
ck(bTot.length === 1 && bTot[0].text.indexOf(bWant) === 0,
  'B: tag reads 2 spots of 31 probes in 1 round',
  bTot.length ? bTot[0].text : 'none');
// r817 widened this sentence with the first/last bad-round stamp; the count
// contract pinned here is the prefix, and r817 owns the clock shape.
ck(bTot.length === 1 && bTot[0].text.indexOf('\u679a') > 0 && bTot[0].text.indexOf('\u5904') > 0,
  'B: tag keeps the count words after the r817 widening', bTot.length ? bTot[0].text : 'none');
ck(bTot.length === 1 && bTot[0].cls.indexOf('warn') >= 0,
  'B: a day that really had a broken probe is a warn tint', bTot.length ? bTot[0].cls : '');
ck(bTot.length === 1 && String(bTot[0].title).indexOf('2') >= 0,
  'B: title carries the count', bTot.length ? bTot[0].title : '');
const bSelf = selfcheckText(runPanel(B.html, 'B2'));
ck(bSelf.indexOf(TOTAL_LABEL + '2') >= 0, 'B: self-check tick row carries it', bSelf.slice(0, 300));

// --- C) every round backed off: nothing scanned => no tag ------------------
const C = build('c', ['backoff', 'backoff']);
ck(/ probes_all=0\b/.test(C.out), 'C: PANEL OK probes_all=0',
  (C.out.match(/probes_all=\d+/) || [''])[0]);
ck(/ probes_bad_all=0\b/.test(C.out), 'C: PANEL OK probes_bad_all=0');
const cTags = tags(runPanel(C.html, 'C'));
ck(cTags.filter(t => t.text.indexOf(TOTAL_LABEL) === 0).length === 0,
  'C: no cumulative tag when nothing was scanned (never a fabricated 0)',
  JSON.stringify(cTags.map(t => t.text)));
const cSelf = selfcheckText(runPanel(C.html, 'C2'));
ck(cSelf.indexOf(TOTAL_LABEL) < 0, 'C: self-check stays quiet too', cSelf.slice(0, 300));

// --- D) anti-drift --------------------------------------------------------
const tpl = fs.readFileSync(path.join('Tools', 'devloop', 'city-panel-template.html'), 'utf8');
ck(/function tickProbeTotalText\s*\(/.test(tpl), 'D: template defines tickProbeTotalText once');
ck((tpl.match(/tickProbeTotalText\(tk\)/g) || []).length >= 2,
  'D: both the row and the self-check call it',
  String((tpl.match(/tickProbeTotalText\(tk\)/g) || []).length));
const bsrc = fs.readFileSync(builder, 'utf8');
ck(/probes_all\s*=\s*\[int\]\$probesAll/.test(bsrc) && /' probes_all='/.test(bsrc),
  'D: builder emits probes_all and the probes_all= token');
ck(/probes_bad_all\s*=\s*\[int\]\$probeBadAll/.test(bsrc) &&
  /probe_bad_rounds\s*=\s*\[int\]\$probeBadRounds/.test(bsrc),
  'D: builder emits probes_bad_all and probe_bad_rounds');

// --- E) older TICK payload (no cumulative keys) stays quiet ---------------
const realHtml = fs.readFileSync(path.join('world-public', 'city-panel.html'), 'utf8');
let stripped = false;
const legacy = realHtml.replace(/const TICK = ([\s\S]*?);\r?\n/, function (m, body) {
  let obj;
  try { obj = JSON.parse(body); } catch (e) { return m; }
  delete obj.probes_all;
  delete obj.probes_bad_all;
  delete obj.probe_bad_rounds;
  stripped = true;
  const lines = Object.keys(obj).map(k => '  ' + k + ': ' + JSON.stringify(obj[k]));
  return 'const TICK = {\n' + lines.join(',\n') + '\n};\n';
});
ck(stripped && legacy !== realHtml, 'E: legacy fixture really removed the keys');
const eTags = tags(runPanel(legacy, 'E'));
ck(eTags.filter(t => t.text.indexOf(TOTAL_LABEL) === 0).length === 0,
  'E: no invented 0 when the log cannot answer', JSON.stringify(eTags.map(t => t.text)));

try { fs.rmSync(tmp, { recursive: true, force: true }); } catch (e) { /* temp only */ }

console.log('');
console.log('RESULT: pass=' + pass + ' fail=' + fail);
if (fail > 0) process.exit(1);