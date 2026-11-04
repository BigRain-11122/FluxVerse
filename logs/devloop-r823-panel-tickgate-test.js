// r823 panel test: the tick row must say WHICH WAY the gate went, not just that
// a verdict exists. tick.ps1 writes `gate: PASS` or `gate: FAIL` from verify's
// exit code, and r813 folded both into the single token `gate` - so a round whose
// verify failed read exactly like a healthy round, and "the loop is running fine"
// and "the loop is running and failing" were the same page.
// Method: build the REAL panel against fixture tick logs, then run the produced
// page's own script and read the rendered tags.
// Cases:
//   A. pass,red,pass        -> last_gate=ok, gate_red=1/3, tag "today 1/3 rounds"
//   B. pass,pass,red        -> last_gate=red, tag "last round failed" + 1/3 tally
//   C. pass,pass,pass       -> gate_red=0/3 and NO gate tag at all (quiet)
//   D. backoff,red,backoff  -> last=running gate_red=1/1 (backoff has no verdict)
//   E. echoed verify lines are not verdicts (only bare `gate: PASS|FAIL` counts)
//   F. anti-drift: one helper, two call sites; builder emits both tokens
//   G. older TICK payload (no gate keys) -> no tag, never an invented 0
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const vm = require('vm');
const { spawnSync } = require('child_process');

const TODAY_LABEL = '\u4eca\u65e5\u95e8\u5931\u8d25 '; // "today gate failed "
const TODAY_TAIL = ' \u8f6e';                            // " rounds"
const LAST_LABEL = '\u4e0a\u8f6e\u95e8\u5931\u8d25';      // "last round gate failed"

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'fv-r823-'));
const builder = path.join('Tools', 'devloop', 'build-city-panel.ps1');

function tickLog(rounds) {
  const lines = [];
  rounds.forEach((kind, i) => {
    const hh = String(8 + i).padStart(2, '0');
    lines.push('[' + '2026-11-04 ' + hh + ':00:00] FluxVerseTick round start');
    if (kind === 'backoff') {
      lines.push('backoff: perceptor stack dirty (in-flight dev edits) - scan+verify skipped');
    } else if (kind === 'gate') {
      lines.push('scan: perceptor/world rows=2364');
      lines.push('gate: VERIFY HEALTH: qdue: open=202 late=0');
      lines.push('gate: PASS');
      lines.push('pub: pubgate: G1 secrets 0');
    } else if (kind === 'red') {
      lines.push('scan: perceptor/world rows=2364');
      lines.push('gate: VERIFY FAIL: world state promote failed');
      lines.push('gate: FAIL');
      lines.push('pub: pubgate: G1 secrets 0');
    } else if (kind === 'echoonly') {
      // A round whose only `gate:` lines are echoed verify output: no verdict at
      // all, so it must count as neither green nor red.
      lines.push('gate: VERIFY FAIL: state-promote module missing');
    }
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
  return (el.children || []).map(c => ({ text: c.textContent || '', cls: c.className || '' }));
}

function selfcheckText(panel) {
  return String(panel.get('selfcheck').innerHTML || '');
}

let pass = 0, fail = 0;
function ck(cond, name, detail) {
  if (cond) { pass++; console.log('  ok   ' + name); }
  else { fail++; console.log('  FAIL ' + name + (detail ? ' :: ' + detail : '')); }
}

// --- A) one red round among three, last one green -------------------------
const A = build('a', ['gate', 'red', 'gate']);
ck(A.code === 0, 'A: builder exit 0', 'code=' + A.code + ' out=' + A.out.slice(0, 300));
ck(/ last=gate\b/.test(A.out), 'A: last=gate');
ck(/ last_gate=ok\b/.test(A.out), 'A: PANEL OK last_gate=ok',
  (A.out.match(/last=\S+ last_gate=\S+ gate_red=\S+/) || [''])[0]);
ck(/ gate_red=1\/3\b/.test(A.out), 'A: PANEL OK gate_red=1/3',
  (A.out.match(/gate_red=\S+/) || [''])[0]);
const aTick = tickOf(A.html);
ck(aTick.gate_red_rounds === 1 && aTick.gate_rounds === 3,
  'A: page carries gate_red_rounds=1 gate_rounds=3',
  JSON.stringify({ r: aTick.gate_red_rounds, g: aTick.gate_rounds }));
const aTags = tags(runPanel(A.html, 'A'));
const aRed = aTags.filter(t => t.text.indexOf(TODAY_LABEL) === 0);
ck(aRed.length === 1, 'A: exactly one today-gate tag', JSON.stringify(aTags.map(t => t.text)));
ck(aRed.length === 1 && aRed[0].text === TODAY_LABEL + '1/3' + TODAY_TAIL,
  'A: tag reads 1/3 of 3', aRed.length ? aRed[0].text : 'none');
ck(aRed.length === 1 && aRed[0].cls.indexOf('warn') >= 0,
  'A: tally tag is a warn tint', aRed.length ? aRed[0].cls : '');
ck(aTags.filter(t => t.text === LAST_LABEL).length === 0,
  'A: no last-round tag when the last round passed',
  JSON.stringify(aTags.map(t => t.text)));
const aSelf = selfcheckText(runPanel(A.html, 'A2'));
ck(aSelf.indexOf(TODAY_LABEL + '1/3' + TODAY_TAIL) >= 0,
  'A: self-check tick row carries 1/3', aSelf.slice(0, 240));
ck(aSelf.indexOf(LAST_LABEL) < 0, 'A: self-check does not claim the last round failed');

// --- B) the last round is the red one -------------------------------------
const B = build('b', ['gate', 'gate', 'red']);
ck(/ last=gate\b/.test(B.out), 'B: last=gate');
ck(/ last_gate=red\b/.test(B.out), 'B: PANEL OK last_gate=red',
  (B.out.match(/last=\S+ last_gate=\S+ gate_red=\S+/) || [''])[0]);
ck(/ gate_red=1\/3\b/.test(B.out), 'B: PANEL OK gate_red=1/3',
  (B.out.match(/gate_red=\S+/) || [''])[0]);
const bTags = tags(runPanel(B.html, 'B'));
ck(bTags.filter(t => t.text === LAST_LABEL).length === 1,
  'B: last-round tag appears once', JSON.stringify(bTags.map(t => t.text)));
ck(bTags.filter(t => t.text.indexOf(TODAY_LABEL) === 0).length === 1,
  'B: tally tag coexists with the last-round tag',
  JSON.stringify(bTags.map(t => t.text)));
const bSelf = selfcheckText(runPanel(B.html, 'B2'));
ck(bSelf.indexOf(LAST_LABEL) >= 0, 'B: self-check says the last round failed', bSelf.slice(0, 240));

// --- C) a clean day stays quiet -------------------------------------------
const C = build('c', ['gate', 'gate', 'gate']);
ck(/ last_gate=ok\b/.test(C.out), 'C: PANEL OK last_gate=ok');
ck(/ gate_red=0\/3\b/.test(C.out), 'C: PANEL OK gate_red=0/3',
  (C.out.match(/gate_red=\S+/) || [''])[0]);
const cTags = tags(runPanel(C.html, 'C'));
ck(cTags.filter(t => t.text.indexOf(TODAY_LABEL) === 0).length === 0,
  'C: no tally tag on a clean day', JSON.stringify(cTags.map(t => t.text)));
ck(cTags.filter(t => t.text === LAST_LABEL).length === 0,
  'C: no last-round tag on a clean day', JSON.stringify(cTags.map(t => t.text)));
const cSelf = selfcheckText(runPanel(C.html, 'C2'));
ck(cSelf.indexOf(TODAY_LABEL) < 0 && cSelf.indexOf(LAST_LABEL) < 0,
  'C: self-check stays quiet too', cSelf.slice(0, 240));

// --- D) a backed-off round has no verdict and counts as neither -----------
const D = build('d', ['backoff', 'red', 'backoff']);
ck(/ last=backoff\b/.test(D.out), 'D: last=backoff (the only verdict sits in the middle)',
  (D.out.match(/last=\S+ last_gate=\S+/) || [''])[0]);
ck(/ last_gate=none\b/.test(D.out), 'D: PANEL OK last_gate=none',
  (D.out.match(/last_gate=\S+/) || [''])[0]);
ck(/ gate_red=1\/1\b/.test(D.out), 'D: backed-off rounds are not in the denominator',
  (D.out.match(/gate_red=\S+/) || [''])[0]);
const dTags = tags(runPanel(D.html, 'D'));
ck(dTags.filter(t => t.text === LAST_LABEL).length === 0,
  'D: no last-round tag without a verdict', JSON.stringify(dTags.map(t => t.text)));
ck(dTags.filter(t => t.text === TODAY_LABEL + '1/1' + TODAY_TAIL).length === 1,
  'D: the one real red round is still named', JSON.stringify(dTags.map(t => t.text)));

// --- E) echoed verify lines are not verdicts ------------------------------
const E = build('e', ['echoonly']);
ck(/ last=running\b/.test(E.out), 'E: a round with only echoed verify lines has no verdict',
  (E.out.match(/last=\S+ last_gate=\S+ gate_red=\S+/) || [''])[0]);
ck(/ gate_red=0\/0\b/.test(E.out), 'E: echoed lines do not make a green round either',
  (E.out.match(/gate_red=\S+/) || [''])[0]);
const eTags = tags(runPanel(E.html, 'E'));
ck(eTags.filter(t => t.text.indexOf(TODAY_LABEL) === 0).length === 0 &&
  eTags.filter(t => t.text === LAST_LABEL).length === 0,
  'E: page invents nothing from echoed lines', JSON.stringify(eTags.map(t => t.text)));

// --- F) anti-drift: one helper, two call sites ----------------------------
const tpl = fs.readFileSync(path.join('Tools', 'devloop', 'city-panel-template.html'), 'utf8');
ck(/function tickGateRedText\s*\(/.test(tpl), 'F: template defines tickGateRedText once');
ck((tpl.match(/function tickGateRedText\s*\(/g) || []).length === 1,
  'F: it is defined exactly once');
ck((tpl.match(/tickGateRedText\(tk\)/g) || []).length >= 2,
  'F: both the row and the self-check call it',
  String((tpl.match(/tickGateRedText\(tk\)/g) || []).length));
ck(/tk\.last_gate === 'red'/.test(tpl), 'F: the row reads tk.last_gate for the last-round tag');
const bsrc = fs.readFileSync(builder, 'utf8');
ck(/last_gate\s*=\s*\[string\]\$lastGate/.test(bsrc) && /gate_red_rounds\s*=\s*\[int\]\$gateRedRounds/.test(bsrc),
  'F: builder emits last_gate and gate_red_rounds');
ck(/'\s*last_gate='\s*\+/.test(bsrc) && /' gate_red='/.test(bsrc),
  'F: builder prints both tokens on the PANEL OK line');
// The c1 red-scan matches `(gate|probe).*FAIL` case-insensitively over the tick
// log, and the panel summary is part of that log: the new tokens must not be
// able to trip their own alarm.
ck(!/gate_red=[^']*FAIL/i.test(bsrc) && !/last_gate=\S*FAIL/i.test(bsrc),
  'F: new tokens cannot match the c1 gate/probe FAIL pattern');

// --- G) older TICK payload (no gate keys) stays quiet --------------------
const realHtml = fs.readFileSync(path.join('world-public', 'city-panel.html'), 'utf8');
const legacy = realHtml.replace(/const TICK = ([\s\S]*?);\r?\n/, function (m, body) {
  let obj;
  try { obj = JSON.parse(body); } catch (e) { return m; }
  delete obj.last_gate;
  delete obj.gate_rounds;
  delete obj.gate_red_rounds;
  const lines = Object.keys(obj).map(k => '  ' + k + ': ' + JSON.stringify(obj[k]));
  return 'const TICK = {\n' + lines.join(',\n') + '\n};\n';
});
ck(legacy !== realHtml, 'G: legacy fixture really removed the keys');
const gTags = tags(runPanel(legacy, 'G'));
ck(gTags.filter(t => t.text.indexOf(TODAY_LABEL) === 0).length === 0,
  'G: no invented count when the log cannot answer', JSON.stringify(gTags.map(t => t.text)));

try { fs.rmSync(tmp, { recursive: true, force: true }); } catch (e) { /* temp only */ }

console.log('');
console.log('RESULT: pass=' + pass + ' fail=' + fail);
if (fail > 0) process.exit(1);