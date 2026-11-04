// r819 panel test: the tick row must say whether ANY round today quarantined an
// event or saw a degraded probe - not just what the LAST round happened to
// report (debt r818). r815 gave the row "上轮探针 26 全 OK" plus that round's
// quarantine/degrade tallies; a probe quarantined at 09:00 and released by
// 09:10 leaves the page claiming a clean day. builder sums the two per-round
// tallies over every round that really ran a scan (a backed-off round has none
// and contributes nothing), and leaves both at -1 when nothing was measured.
// Method: build the REAL panel against fixture tick logs and run the produced
// page's own script, then read the rendered tags (same harness as r813-r817).
// Cases:
//   A. a clean day                 -> quarantined_all=0 degraded_all=0 and NO tag
//   B. two dirty rounds, last clean-> totals summed over rounds; warn tag names them
//   C. every round backed off      -> totals -1 and no tag, never a fabricated 0
//   D. anti-drift: one helper, both call sites, builder emits the tokens
//   E. older TICK payload (no keys) -> no tag, never an invented 0
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const vm = require('vm');
const { spawnSync } = require('child_process');

const PROBE_LABEL = '\u4e0a\u8f6e\u63a2\u9488 ';          // "last round probes "
const ALL_OK = ' \u5168 OK';                                // " all OK"
const TOTAL_LABEL = '\u4eca\u65e5\u63a2\u9488\u574f ';      // "today probes bad "
const SCAN_LABEL = '\u4eca\u65e5 scan ';                    // "today scan "
const QUAR = '\u9694\u79bb ';                               // "quarantined "
const EVENTS = ' \u6761\u4e8b\u4ef6';                       // " event(s)"
const DOT = ' \u00b7 ';                                     // " . "
const DEG = '\u63a2\u9488\u964d\u7ea7 ';                    // "probe degraded "
const TIMES = ' \u6b21';                                    // " time(s)"

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'fv-r819-'));
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
    const names = Array.isArray(o.degradedNames) ? o.degradedNames : ['x', 'y'];
    lines.push('scan: perceptor WARN: ' + o.degraded + ' probe(s) zero-read/degraded -> ' +
      names.map(n => n + '=null-result (probe degraded, no state returned)').join('; '));
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
    } else if (kind === 'quar') {
      body = scanLines([{ name: 'a', status: 'OK' }], { quarantined: 2, degraded: 1 })
        .concat(['gate: PASS']);
    } else if (kind === 'quar2') {
      body = scanLines([{ name: 'a', status: 'OK' }], { quarantined: 1, degraded: 0 })
        .concat(['gate: PASS']);
    } else if (kind === 'degFx') {
      body = scanLines([{ name: 'a', status: 'OK' }], { quarantined: 0, degraded: 1, degradedNames: ['fx'] })
        .concat(['gate: PASS']);
    } else if (kind === 'degGh') {
      body = scanLines([{ name: 'a', status: 'OK' }],
        { quarantined: 0, degraded: 1, degradedNames: ['github_events'] }).concat(['gate: PASS']);
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

// --- A) a clean day: measured zero, and the page stays quiet ----------------
const A = build('a', ['gate', 'many', 'many']);
ck(A.code === 0, 'A: builder exit 0', 'code=' + A.code + ' out=' + A.out.slice(0, 400));
ck(/ quarantined_all=0\b/.test(A.out), 'A: PANEL OK quarantined_all=0',
  (A.out.match(/tick=[^\r\n]*/) || [''])[0]);
ck(/ degraded_all=0\b/.test(A.out), 'A: PANEL OK degraded_all=0');
const aTick = tickOf(A.html);
ck(aTick.quarantined_all === 0 && aTick.degraded_all === 0,
  'A: page carries both readings as 0', JSON.stringify(aTick));
const aTags = tags(runPanel(A.html, 'A'));
ck(aTags.filter(t => t.text.indexOf(SCAN_LABEL) === 0).length === 0,
  'A: no scan tag on a clean day', JSON.stringify(aTags.map(t => t.text)));
ck(aTags.filter(t => t.text.indexOf(PROBE_LABEL) === 0).length === 1,
  'A: the last-round sentence still shows', JSON.stringify(aTags.map(t => t.text)));

// --- B) two dirty rounds earlier, the last round clean ---------------------
// The row alone would read "26 all OK" and the per-round tallies would read 0.
const B = build('b', ['quar', 'quar2', 'many']);
ck(/ quarantined_all=3\b/.test(B.out), 'B: PANEL OK quarantined_all=3 (summed over rounds)',
  (B.out.match(/quarantined_all=\d+/) || [''])[0]);
ck(/ degraded_all=1\b/.test(B.out), 'B: PANEL OK degraded_all=1 (summed over rounds)',
  (B.out.match(/degraded_all=\d+/) || [''])[0]);
const bTick = tickOf(B.html);
ck(bTick.quarantined === 0 && bTick.degraded === 0,
  'B: the LAST round alone is clean (0/0)',
  JSON.stringify({ q: bTick.quarantined, d: bTick.degraded }));
const bTags = tags(runPanel(B.html, 'B'));
const bLast = bTags.filter(t => t.text.indexOf(PROBE_LABEL) === 0);
ck(bLast.length === 1 && bLast[0].text.indexOf(ALL_OK) > 0,
  'B: last-round sentence is unchanged', bLast.length ? bLast[0].text : 'none');
const bScan = bTags.filter(t => t.text.indexOf(SCAN_LABEL) === 0);
ck(bScan.length === 1, 'B: exactly one scan tag', JSON.stringify(bTags.map(t => t.text)));
const bWant = SCAN_LABEL + QUAR + '3' + EVENTS + DOT + DEG + '1' + TIMES;
ck(bScan.length === 1 && bScan[0].text === bWant,
  'B: tag reads 3 events quarantined, 1 degraded reading',
  bScan.length ? JSON.stringify(bScan[0].text) : 'none');
ck(bScan.length === 1 && bScan[0].cls.indexOf('warn') >= 0,
  'B: a day that really quarantined something is a warn tint',
  bScan.length ? bScan[0].cls : '');
ck(bScan.length === 1 && String(bScan[0].title).indexOf('3') >= 0 &&
  String(bScan[0].title).indexOf('1') >= 0,
  'B: title carries both counts', bScan.length ? bScan[0].title : '');
const bSelf = selfcheckText(runPanel(B.html, 'B2'));
ck(bSelf.indexOf(bWant) >= 0, 'B: self-check tick row carries it', bSelf.slice(0, 300));

// --- C) every round backed off: nothing scanned => no tag ------------------
const C = build('c', ['backoff', 'backoff']);
ck(/ quarantined_all=-1\b/.test(C.out), 'C: PANEL OK quarantined_all=-1 (unmeasured)',
  (C.out.match(/quarantined_all=-?\d+/) || [''])[0]);
ck(/ degraded_all=-1\b/.test(C.out), 'C: PANEL OK degraded_all=-1 (unmeasured)');
const cTags = tags(runPanel(C.html, 'C'));
ck(cTags.filter(t => t.text.indexOf(SCAN_LABEL) === 0).length === 0,
  'C: no scan tag when nothing was scanned (never a fabricated 0)',
  JSON.stringify(cTags.map(t => t.text)));
const cSelf = selfcheckText(runPanel(C.html, 'C2'));
ck(cSelf.indexOf(SCAN_LABEL) < 0, 'C: self-check stays quiet too', cSelf.slice(0, 300));

// --- D) anti-drift --------------------------------------------------------
const tpl = fs.readFileSync(path.join('Tools', 'devloop', 'city-panel-template.html'), 'utf8');
ck((tpl.match(/function tickScanTotalText\s*\(/g) || []).length === 1,
  'D: template defines tickScanTotalText exactly once',
  String((tpl.match(/function tickScanTotalText\s*\(/g) || []).length));
ck((tpl.match(/tickScanTotalText\(tk\)/g) || []).length >= 2,
  'D: both the row and the self-check call it',
  String((tpl.match(/tickScanTotalText\(tk\)/g) || []).length));
const bsrc = fs.readFileSync(builder, 'utf8');
ck(/quarantined_all\s*=\s*\[int\]\$quarantinedAll/.test(bsrc) &&
  /degraded_all\s*=\s*\[int\]\$degradedAll/.test(bsrc),
  'D: builder emits quarantined_all and degraded_all');
ck(/' quarantined_all='/.test(bsrc) && /' degraded_all='/.test(bsrc),
  'D: builder prints both tokens on PANEL OK');
ck(/degraded_probes\s*=\s*\[int\]\$degProbes/.test(bsrc) &&
  /degraded_rounds\s*=\s*\[int\]\$degRounds/.test(bsrc),
  'D: builder ships the deduped counts in TICK');
ck(/' degraded_probes='/.test(bsrc) && /' degraded_rounds='/.test(bsrc),
  'D: builder prints them on PANEL OK too');
ck((tpl.match(/function tickDegradedText\s*\(/g) || []).length === 1,
  'D: template defines tickDegradedText exactly once');
ck((tpl.match(/function degNameNote\s*\(/g) || []).length === 1,
  'D: template defines degNameNote exactly once');

// --- F) the same probe degrading twice is ONE probe, not two readings ------
// (queue main#136) `degraded_all` is a per-round sum: one probe bad in two
// rounds reads as "2 times", which a reader takes as "two things went wrong".
const F1 = build('f1', ['degFx', 'degFx', 'many']);
ck(/ degraded_all=2\b/.test(F1.out), 'F1: PANEL OK degraded_all=2 (sum unchanged)',
  (F1.out.match(/degraded_all=-?\d+/) || [''])[0]);
ck(/ degraded_probes=1\b/.test(F1.out), 'F1: PANEL OK degraded_probes=1 (deduped by name)',
  (F1.out.match(/degraded_probes=-?\d+/) || [''])[0]);
ck(/ degraded_rounds=2\b/.test(F1.out), 'F1: PANEL OK degraded_rounds=2',
  (F1.out.match(/degraded_rounds=-?\d+/) || [''])[0]);
const f1Tick = tickOf(F1.html);
ck(f1Tick.degraded_probes === 1 && f1Tick.degraded_rounds === 2,
  'F1: page carries the deduped counts', JSON.stringify({ p: f1Tick.degraded_probes, r: f1Tick.degraded_rounds }));
const f1Scan = tags(runPanel(F1.html, 'F1')).filter(t => t.text.indexOf(SCAN_LABEL) === 0);
const f1Want = SCAN_LABEL + DEG + '1 \u679a\uff082 \u8f6e\uff09';   // "probe degraded 1 (2 rounds)"
ck(f1Scan.length === 1 && f1Scan[0].text === f1Want,
  'F1: tag says 1 probe over 2 rounds, not 2 readings',
  f1Scan.length ? JSON.stringify(f1Scan[0].text) : 'none');
ck(f1Scan.length === 1 && f1Scan[0].text.indexOf(TIMES) < 0,
  'F1: the per-reading 次 count is gone when names are known',
  f1Scan.length ? f1Scan[0].text : '');
ck(f1Scan.length === 1 && String(f1Scan[0].title).indexOf('fx') >= 0,
  'F1: title names the probe', f1Scan.length ? f1Scan[0].title : '');

// --- F2) two different probes, one round each = two probes ----------------
const F2 = build('f2', ['degFx', 'degGh', 'many']);
ck(/ degraded_all=2\b/.test(F2.out), 'F2: sum is still 2 readings');
ck(/ degraded_probes=2\b/.test(F2.out) && / degraded_rounds=2\b/.test(F2.out),
  'F2: two distinct probes over two rounds', (F2.out.match(/degraded_probes=-?\d+/) || [''])[0]);
const f2Scan = tags(runPanel(F2.html, 'F2')).filter(t => t.text.indexOf(SCAN_LABEL) === 0);
const f2Want = SCAN_LABEL + DEG + '2 \u679a\uff082 \u8f6e\uff09';
ck(f2Scan.length === 1 && f2Scan[0].text === f2Want,
  'F2: tag reads 2 probes, 2 rounds', f2Scan.length ? JSON.stringify(f2Scan[0].text) : 'none');

// --- F3) a WARN line the builder cannot split => keep the raw sum ----------
// B's fixture is exactly that shape (claims 1 probe, lists two). It must not
// silently become "1 probe" - the sum is the only thing the log supports.
ck(/ degraded_probes=-1\b/.test(B.out), 'F3: unsplittable WARN leaves the name account at -1',
  (B.out.match(/degraded_probes=-?\d+/) || [''])[0]);
const f3Scan = tags(runPanel(B.html, 'F3')).filter(t => t.text.indexOf(SCAN_LABEL) === 0);
ck(f3Scan.length === 1 && f3Scan[0].text.indexOf(TIMES) > 0,
  'F3: falls back to the per-reading count', f3Scan.length ? f3Scan[0].text : 'none');

// --- E) older TICK payload (no scan-total keys) stays quiet ---------------
const realHtml = fs.readFileSync(path.join('world-public', 'city-panel.html'), 'utf8');
let stripped = false;
const legacy = realHtml.replace(/const TICK = ([\s\S]*?);\r?\n/, function (m, body) {
  let obj;
  try { obj = JSON.parse(body); } catch (e) { return m; }
  delete obj.quarantined_all;
  delete obj.degraded_all;
  stripped = true;
  const lines = Object.keys(obj).map(k => '  ' + k + ': ' + JSON.stringify(obj[k]));
  return 'const TICK = {\n' + lines.join(',\n') + '\n};\n';
});
ck(stripped && legacy !== realHtml, 'E: legacy fixture really removed the keys');
const eTags = tags(runPanel(legacy, 'E'));
ck(eTags.filter(t => t.text.indexOf(SCAN_LABEL) === 0).length === 0,
  'E: no invented 0 when the log cannot answer', JSON.stringify(eTags.map(t => t.text)));

// --- E2) a TICK written before the name account existed: sum only ----------
// Same debt shape as r818 would be for older logs - the page must fall back to
// the per-reading count instead of claiming a dedupe it never ran.
let stripped2 = false;
const legacy2 = realHtml.replace(/const TICK = ([\s\S]*?);\r?\n/, function (m, body) {
  let obj;
  try { obj = JSON.parse(body); } catch (e) { return m; }
  delete obj.degraded_probes;
  delete obj.degraded_rounds;
  delete obj.degraded_names;
  if (typeof obj.degraded_all !== 'number' || obj.degraded_all <= 0) return m;
  stripped2 = true;
  const lines = Object.keys(obj).map(k => '  ' + k + ': ' + JSON.stringify(obj[k]));
  return 'const TICK = {\n' + lines.join(',\n') + '\n};\n';
});
if (stripped2) {
  const e2Tags = tags(runPanel(legacy2, 'E2')).filter(t => t.text.indexOf(SCAN_LABEL) === 0);
  ck(e2Tags.length === 1 && e2Tags[0].text.indexOf(TIMES) > 0,
    'E2: older payload falls back to the per-reading count',
    e2Tags.length ? e2Tags[0].text : 'none');
} else {
  ck(true, 'E2: skipped (live log has no degraded reading to strip)');
}

try { fs.rmSync(tmp, { recursive: true, force: true }); } catch (e) { /* temp only */ }

console.log('');
console.log('RESULT: pass=' + pass + ' fail=' + fail);
if (fail > 0) process.exit(1);