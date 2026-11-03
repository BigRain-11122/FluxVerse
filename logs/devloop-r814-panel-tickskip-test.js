// r814 panel test: the tick row must say HOW MANY of today's rounds bailed at
// the round head, not just what the LAST round did (queue main#134). r813 made
// the row name the last round; two consecutive backoffs still read as one
// isolated event because nothing counted them.
// Method: build the REAL panel three times against fixture tick logs (3 rounds
// with 2 backoffs / 3 rounds with none / 3 rounds with the last one in flight),
// then run the produced page's own script and read the rendered tags.
// Cases:
//   A. 3 rounds, 2 backoff  -> PANEL OK skip=2/3, page tag "今日退避 2/3 轮"
//   B. 3 rounds, 0 backoff   -> skip=0/3 and NO skip tag (quiet when nothing skipped)
//   C. last round in flight  -> last=running, skip=1/3 both surfaces
//   D. anti-drift: template defines tickSkipText and both call sites use it
//   E. older TICK (no count keys) -> no tag, never an invented 0
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const vm = require('vm');
const { spawnSync } = require('child_process');

const SKIP_LABEL = '\u4eca\u65e5\u9000\u907f '; // "today's backoff "
const ROUND = ' \u8f6e'; // " rounds"

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'fv-r814-'));
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
      lines.push('gate: PASS');
      lines.push('pub: pubgate: G1 secrets 0');
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

// --- A) three rounds, two of them backed off -------------------------------
const A = build('a', ['backoff', 'backoff', 'gate']);
ck(A.code === 0, 'A: builder exit 0', 'code=' + A.code + ' out=' + A.out.slice(0, 300));
ck(/ skip=2\/3\b/.test(A.out), 'A: PANEL OK skip=2/3', (A.out.match(/tick=[^ ]*.*/) || [''])[0]);
ck(/ last=gate\b/.test(A.out), 'A: last=gate (the last round really ran)');
const aTick = tickOf(A.html);
ck(aTick.skip_rounds === 2 && aTick.rounds_seen === 3, 'A: page carries skip_rounds=2 rounds_seen=3',
  JSON.stringify({ s: aTick.skip_rounds, r: aTick.rounds_seen }));
const aTags = tags(runPanel(A.html, 'A'));
const aSkip = aTags.filter(t => t.text.indexOf(SKIP_LABEL) === 0);
ck(aSkip.length === 1, 'A: exactly one skip tag', JSON.stringify(aTags.map(t => t.text)));
ck(aSkip.length === 1 && aSkip[0].text === SKIP_LABEL + '2/3' + ROUND,
  'A: tag reads 2/3 of 3', aSkip.length ? aSkip[0].text : 'none');
ck(aSkip.length === 1 && aSkip[0].cls.indexOf('warn') < 0,
  'A: skip tag is muted when the last round ran the gate', aSkip.length ? aSkip[0].cls : '');
const aSelf = selfcheckText(runPanel(A.html, 'A2'));
ck(aSelf.indexOf(SKIP_LABEL + '2/3' + ROUND) >= 0, 'A: self-check tick row carries 2/3',
  aSelf.slice(0, 200));

// --- B) three rounds, none backed off --------------------------------------
const B = build('b', ['gate', 'gate', 'gate']);
ck(/ skip=0\/3\b/.test(B.out), 'B: PANEL OK skip=0/3', (B.out.match(/tick=[^ ]*.*/) || [''])[0]);
const bTags = tags(runPanel(B.html, 'B'));
ck(bTags.filter(t => t.text.indexOf(SKIP_LABEL) === 0).length === 0,
  'B: no skip tag when nothing was skipped', JSON.stringify(bTags.map(t => t.text)));
const bSelf = selfcheckText(runPanel(B.html, 'B2'));
ck(bSelf.indexOf(SKIP_LABEL) < 0, 'B: self-check stays quiet too', bSelf.slice(0, 200));

// --- C) last round still in flight ----------------------------------------
const C = build('c', ['backoff', 'gate', 'running']);
ck(/ skip=1\/3\b/.test(C.out), 'C: PANEL OK skip=1/3', (C.out.match(/tick=[^ ]*.*/) || [''])[0]);
ck(/ last=running\b/.test(C.out), 'C: last=running for the in-flight round');
const cTags = tags(runPanel(C.html, 'C'));
ck(cTags.filter(t => t.text === SKIP_LABEL + '1/3' + ROUND).length === 1,
  'C: counts still reported while the last round has no verdict',
  JSON.stringify(cTags.map(t => t.text)));

// --- D) anti-drift: one helper, two call sites ----------------------------
const tpl = fs.readFileSync(path.join('Tools', 'devloop', 'city-panel-template.html'), 'utf8');
ck(/function tickSkipText\s*\(/.test(tpl), 'D: template defines tickSkipText once');
ck((tpl.match(/tickSkipText\(tk\)/g) || []).length >= 2,
  'D: both the row and the self-check call it',
  String((tpl.match(/tickSkipText\(tk\)/g) || []).length));
const bsrc = fs.readFileSync(builder, 'utf8');
ck(/skip_rounds\s*=\s*\[int\]\$skipRounds/.test(bsrc) && /' skip='/.test(bsrc),
  'D: builder emits skip_rounds and the skip= token');

// --- E) older TICK payload (no count keys) stays quiet --------------------
const realHtml = fs.readFileSync(path.join('world-public', 'city-panel.html'), 'utf8');
const legacy = realHtml.replace(/const TICK = ([\s\S]*?);\r?\n/, function (m, body) {
  let obj;
  try { obj = JSON.parse(body); } catch (e) { return m; }
  delete obj.skip_rounds;
  delete obj.rounds_seen;
  const lines = Object.keys(obj).map(k => '  ' + k + ': ' + JSON.stringify(obj[k]));
  return 'const TICK = {\n' + lines.join(',\n') + '\n};\n';
});
ck(legacy !== realHtml, 'E: legacy fixture really removed the keys');
const eTags = tags(runPanel(legacy, 'E'));
ck(eTags.filter(t => t.text.indexOf(SKIP_LABEL) === 0).length === 0,
  'E: no invented 0 when the log cannot answer', JSON.stringify(eTags.map(t => t.text)));

try { fs.rmSync(tmp, { recursive: true, force: true }); } catch (e) { /* temp only */ }

console.log('');
console.log('RESULT: pass=' + pass + ' fail=' + fail);
if (fail > 0) process.exit(1);