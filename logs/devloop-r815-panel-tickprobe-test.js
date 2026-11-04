// r815 panel test: the tick row must say what the last round's scan actually
// COVERED, not just how many lines it wrote (r815). "scan N lines" counts log
// lines, so a probe that crashed, degraded or got quarantined still leaves a
// perfectly healthy looking page - the scan's own WARN line only ever reached
// the tick log, which nobody reads.
// Method: build the REAL panel against fixture tick logs and run the produced
// page's own script, then read the rendered tags (same harness as r813/r814).
// Cases:
//   A. 26 probes all OK, quarantined=0     -> "probes=26 probes_bad=0" and tag
//                                             "上轮探针 26 全 OK", muted
//   B. 2 of 4 non-OK + quarantined=3 + WARN -> "上轮探针 2/4（坏 2） · 隔离 3 · 降级 2",
//                                             warn tint
//   C. last round backed off (no scan)     -> probes=0 and NO tag (silence, not 0)
//   D. anti-drift: one helper, both call sites, builder emits the tokens
//   E. older TICK payload (no probe keys)  -> no tag, never an invented 0
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const vm = require('vm');
const { spawnSync } = require('child_process');

const PROBE_LABEL = '\u4e0a\u8f6e\u63a2\u9488 ';      // "last round probes "
const ALL_OK = ' \u5168 OK';                            // " all OK"
const BAD_OPEN = '\uff08\u574f ';                       // "(bad "
const BAD_CLOSE = '\uff09';                             // ")"
const Q_PREFIX = ' \u00b7 \u9694\u79bb ';               // " - quarantined "
const D_PREFIX = ' \u00b7 \u964d\u7ea7 ';               // " - degraded "

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'fv-r815-'));
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
    } else if (kind === 'rich') {
      body = scanLines([
        { name: 'a', status: 'OK' },
        { name: 'b', status: 'FAIL boom' },
        { name: 'c', status: 'OK' },
        { name: 'd', status: 'FAIL timeout' }
      ], { quarantined: 3, degraded: 2 }).concat(['gate: PASS']);
    } else if (kind === 'many') {
      const probes = [];
      for (let k = 0; k < 26; k++) probes.push({ name: 'p' + k, status: 'OK' });
      body = scanLines(probes, { quarantined: 0 }).concat(['gate: PASS']);
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

// --- A) 26 probes, all OK --------------------------------------------------
const A = build('a', ['gate', 'gate', 'many']);
ck(A.code === 0, 'A: builder exit 0', 'code=' + A.code + ' out=' + A.out.slice(0, 400));
ck(/ probes=26\b/.test(A.out), 'A: PANEL OK probes=26', (A.out.match(/tick=[^\r\n]*/) || [''])[0]);
ck(/ probes_bad=0\b/.test(A.out), 'A: PANEL OK probes_bad=0');
ck(/ quarantined=0\b/.test(A.out), 'A: PANEL OK quarantined=0');
ck(/ degraded=0\b/.test(A.out),
  'A: absent WARN line from a round that scanned reads as degraded=0',
  (A.out.match(/degraded=-?\d+/) || [''])[0]);
const aTick = tickOf(A.html);
ck(aTick.probes === 26 && aTick.probes_bad === 0 && aTick.quarantined === 0 && aTick.degraded === 0,
  'A: page carries the four readings', JSON.stringify(aTick));
const aPanel = runPanel(A.html, 'A');
const aTags = tags(aPanel);
const aProbe = aTags.filter(t => t.text.indexOf(PROBE_LABEL) === 0);
ck(aProbe.length === 1, 'A: exactly one probe tag', JSON.stringify(aTags.map(t => t.text)));
ck(aProbe.length === 1 && aProbe[0].text === PROBE_LABEL + '26' + ALL_OK,
  'A: tag reads 26 all OK', aProbe.length ? aProbe[0].text : 'none');
ck(aProbe.length === 1 && aProbe[0].cls.indexOf('warn') < 0,
  'A: healthy probes are muted', aProbe.length ? aProbe[0].cls : '');
ck(aProbe.length === 1 && String(aProbe[0].title).indexOf('26') >= 0,
  'A: title carries the count', aProbe.length ? aProbe[0].title : '');
const aSelf = selfcheckText(runPanel(A.html, 'A2'));
ck(aSelf.indexOf(PROBE_LABEL + '26' + ALL_OK) >= 0, 'A: self-check tick row carries it',
  aSelf.slice(0, 240));

// --- B) two bad probes, quarantine + degrade -------------------------------
const B = build('b', ['rich']);
ck(/ probes=4\b/.test(B.out), 'B: PANEL OK probes=4', (B.out.match(/probes=\d+/) || [''])[0]);
ck(/ probes_bad=2\b/.test(B.out), 'B: PANEL OK probes_bad=2');
ck(/ quarantined=3\b/.test(B.out), 'B: PANEL OK quarantined=3');
ck(/ degraded=2\b/.test(B.out), 'B: PANEL OK degraded=2');
const bTags = tags(runPanel(B.html, 'B'));
const bProbe = bTags.filter(t => t.text.indexOf(PROBE_LABEL) === 0);
ck(bProbe.length === 1, 'B: one probe tag', JSON.stringify(bTags.map(t => t.text)));
const wantB = PROBE_LABEL + '2/4' + BAD_OPEN + '2' + BAD_CLOSE + Q_PREFIX + '3' + D_PREFIX + '2';
ck(bProbe.length === 1 && bProbe[0].text === wantB,
  'B: names the bad count, quarantine and degrade', bProbe.length ? JSON.stringify(bProbe[0].text) : 'none');
ck(bProbe.length === 1 && bProbe[0].cls.indexOf('warn') >= 0,
  'B: a non-OK probe tints the tag warn', bProbe.length ? bProbe[0].cls : '');

// --- C) last round backed off: no scan at all ------------------------------
const C = build('c', ['gate', 'gate', 'backoff']);
ck(/ probes=0\b/.test(C.out), 'C: PANEL OK probes=0 for a backed-off round',
  (C.out.match(/probes=\d+/) || [''])[0]);
ck(/ last=backoff\b/.test(C.out), 'C: last=backoff');
const cTags = tags(runPanel(C.html, 'C'));
ck(cTags.filter(t => t.text.indexOf(PROBE_LABEL) === 0).length === 0,
  'C: no probe tag when the round never scanned', JSON.stringify(cTags.map(t => t.text)));
const cSelf = selfcheckText(runPanel(C.html, 'C2'));
ck(cSelf.indexOf(PROBE_LABEL) < 0, 'C: self-check stays quiet too', cSelf.slice(0, 240));

// --- D) anti-drift --------------------------------------------------------
const tpl = fs.readFileSync(path.join('Tools', 'devloop', 'city-panel-template.html'), 'utf8');
ck(/function tickProbeText\s*\(/.test(tpl), 'D: template defines tickProbeText once');
ck(/function tickProbeWarn\s*\(/.test(tpl), 'D: template defines tickProbeWarn once');
ck((tpl.match(/tickProbeText\(tk\)/g) || []).length >= 2,
  'D: both the row and the self-check call it',
  String((tpl.match(/tickProbeText\(tk\)/g) || []).length));
const bsrc = fs.readFileSync(builder, 'utf8');
ck(/probes\s*=\s*\[int\]\$probeTotal/.test(bsrc) && /' probes='/.test(bsrc),
  'D: builder emits probes and the probes= token');
ck(/probes_bad\s*=\s*\[int\]\$probeBad/.test(bsrc) && /quarantined\s*=\s*\[int\]\$quarantined/.test(bsrc),
  'D: builder emits probes_bad and quarantined');

// --- E) older TICK payload (no probe keys) stays quiet --------------------
const realHtml = fs.readFileSync(path.join('world-public', 'city-panel.html'), 'utf8');
let stripped = false;
const legacy = realHtml.replace(/const TICK = ([\s\S]*?);\r?\n/, function (m, body) {
  let obj;
  try { obj = JSON.parse(body); } catch (e) { return m; }
  delete obj.probes;
  delete obj.probes_bad;
  delete obj.quarantined;
  delete obj.degraded;
  stripped = true;
  const lines = Object.keys(obj).map(k => '  ' + k + ': ' + JSON.stringify(obj[k]));
  return 'const TICK = {\n' + lines.join(',\n') + '\n};\n';
});
ck(stripped && legacy !== realHtml, 'E: legacy fixture really removed the keys');
const eTags = tags(runPanel(legacy, 'E'));
ck(eTags.filter(t => t.text.indexOf(PROBE_LABEL) === 0).length === 0,
  'E: no invented 0 when the log cannot answer', JSON.stringify(eTags.map(t => t.text)));

// --- F) a backed-off round must not inherit the round before it ------------
// Measured defect (r833): the last-round loop matched `quarantined=(\d+)`
// ANYWHERE inside the round block, including the page's own
// `panel: PANEL OK ... quarantined=N ...` echo that the PREVIOUS round wrote at
// its end. A round that never scanned therefore reported the round-before-it's
// number as its own (3 stayed 3, 0 became a fabricated 0), while the comment
// right above those lines promised both stay -1. Anchor = the scan's own
// summary / WARN line, same shape the daily account already uses.
function tickLogEcho(rounds) {
  const lines = [];
  rounds.forEach(function (kind, i) {
    const hh = String(8 + i).padStart(2, '0');
    lines.push('[' + '2026-11-04 ' + hh + ':00:00] FluxVerseTick round start');
    if (kind === 'backoff') {
      lines.push('  backoff: perceptor stack dirty (in-flight dev edits) - scan+verify skipped');
      lines.push('  panel: PANEL OK bytes=1000 tick=1min last=backoff quarantined=3 degraded=2');
    } else if (kind === 'scan3') {
      lines.push('  scan: perceptor v0.7 done: events +8 quarantined=3 fleet=7 tasks=188');
      lines.push('  scan:   probe census: OK');
      lines.push('  scan: perceptor WARN: 2 probe(s) zero-read/degraded -> a; b');
      lines.push('  gate: PASS');
      lines.push('  panel: PANEL OK bytes=1000 tick=1min last=gate quarantined=3 degraded=2');
    }
    lines.push('[' + '2026-11-04 ' + hh + ':00:30] round end');
  });
  return lines.join('\r\n') + '\r\n';
}

function buildRaw(name, text) {
  const logPath = path.join(tmp, name + '-tick.log');
  fs.writeFileSync(logPath, text, 'utf8');
  const outHtml = path.join(tmp, name + '.html');
  const hist = path.join(tmp, name + '-hist.jsonl');
  const r = spawnSync('powershell', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', builder,
    '-TickLogPath', logPath, '-OutPath', outHtml, '-HistoryPath', hist], { encoding: 'utf8' });
  const out = (r.stdout || '') + (r.stderr || '');
  const html = fs.existsSync(outHtml) ? fs.readFileSync(outHtml, 'utf8') : '';
  return { out: out, html: html, code: r.status };
}

const F = buildRaw('f', tickLogEcho(['scan3', 'backoff']));
ck(F.code === 0, 'F: builder exit 0', 'code=' + F.code + ' out=' + F.out.slice(0, 400));
ck(/ last=backoff\b/.test(F.out), 'F: last=backoff', (F.out.match(/last=\S+/) || [''])[0]);
ck(/ quarantined=-1\b/.test(F.out),
  'F: backoff round does not inherit the previous round quarantined=3',
  (F.out.match(/quarantined=-?\d+/) || [''])[0]);
ck(/ degraded=-1\b/.test(F.out),
  'F: backoff round does not inherit the previous round degraded=2',
  (F.out.match(/degraded=-?\d+/) || [''])[0]);
ck(/ probes=0\b/.test(F.out), 'F: probes=0 for a round that never scanned',
  (F.out.match(/probes=\d+/) || [''])[0]);
const fTick = tickOf(F.html);
ck(fTick.quarantined === -1 && fTick.degraded === -1,
  'F: page carries the two unknowns, not the echo', JSON.stringify(fTick));
const fSelf = selfcheckText(runPanel(F.html, 'F2'));
ck(fSelf.indexOf(Q_PREFIX) < 0, 'F: self-check prints no quarantine count',
  fSelf.slice(0, 240));

const G = buildRaw('g', tickLogEcho(['scan3']));
ck(G.code === 0, 'G: builder exit 0', 'code=' + G.code);
ck(/ quarantined=3\b/.test(G.out),
  'G: a round that really scanned still reports its own quarantined=3',
  (G.out.match(/quarantined=-?\d+/) || [''])[0]);
ck(/ degraded=2\b/.test(G.out), 'G: and its own degraded=2',
  (G.out.match(/degraded=-?\d+/) || [''])[0]);

// H) static: both last-round tallies are anchored to the scan's own lines.
ck(bsrc.indexOf('(?:scan|gate):\\s+perceptor v') >= 0,
  'H: last-round quarantined regex anchored to the scan summary line');
ck(bsrc.indexOf('(?:scan|gate):\\s+perceptor WARN') >= 0,
  'H: last-round degraded regex anchored to the scan WARN line');

try { fs.rmSync(tmp, { recursive: true, force: true }); } catch (e) { /* temp only */ }

console.log('');
console.log('RESULT: pass=' + pass + ' fail=' + fail);
if (fail > 0) process.exit(1);