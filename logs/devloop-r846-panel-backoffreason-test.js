// r846 panel test: the tick row has said "last round skipped scan/gate" since
// r813, and "N/M rounds today" since r814 - but never WHY. The reason is written
// on that round's own `backoff:` line ("perceptor stack dirty (in-flight dev
// edits)", "schema in flight", ...), so a page built by a backoff round is most
// of the day reading like a fault when it is actually a developer editing files.
// Method: build the REAL panel against fixture tick logs, then run the produced
// page's own script and read the rendered tags (same harness as r823).
// Cases:
//   A. backoff WITH a reason  -> tag names the reason (row + self-check)
//   B. backoff with the boilerplate tail only -> no dangling colon, old sentence
//   C. clean day (gate)       -> quiet, no backoff tag, no invented reason
//   D. PANEL OK token is a closed vocabulary (stack-dirty / other / none) and can
//      never trip the c1 `(gate|probe).*FAIL` red-scan
//   E. anti-drift: one helper, two call sites; builder emits the key
//   F. older TICK payload (no last_reason) -> exact old sentence
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const vm = require('vm');
const { spawnSync } = require('child_process');

const SKIP = '\u4e0a\u8f6e\u8df3\u8fc7 scan/gate';            // "last round skipped scan/gate"
const OPEN = '\uff08';                                        // full-width "("
const CLOSE = '\uff09';                                       // full-width ")"
const SKIP_FALLBACK = SKIP + OPEN + '\u8f6e\u9996\u9000\u907f' + CLOSE; // "…（轮首退避）"

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'fv-r846-'));
const builder = path.join('Tools', 'devloop', 'build-city-panel.ps1');

function tickLog(rounds) {
  const lines = [];
  rounds.forEach((r, i) => {
    const hh = String(8 + i).padStart(2, '0');
    lines.push('[' + '2026-11-04 ' + hh + ':00:00] FluxVerseTick round start');
    if (r.kind === 'backoff' && r.reason) {
      lines.push('backoff: ' + r.reason + ' - scan+verify skipped this round');
    } else if (r.kind === 'backoff') {
      lines.push('backoff:');
    } else {
      lines.push('scan: perceptor/world rows=2364');
      lines.push('gate: VERIFY HEALTH: qdue: open=202 late=0');
      lines.push('gate: PASS');
      lines.push('pub: pubgate: G1 secrets 0');
    }
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
  return (panel.get('f-tick').children || []).map(c => ({ text: c.textContent || '', cls: c.className || '', title: c.title || '' }));
}
function selfText(panel) { return String(panel.get('selfcheck').innerHTML || ''); }

let pass = 0, fail = 0;
function ck(cond, name, detail) {
  if (cond) { pass++; console.log('  ok   ' + name); }
  else { fail++; console.log('  FAIL ' + name + (detail ? ' :: ' + detail : '')); }
}

const REASON = 'perceptor stack dirty (in-flight dev edits)';
const BOILER = ' - scan+verify skipped this round';

// --- A) the reason makes it onto the page --------------------------------
const A = build('a', [{ kind: 'gate' }, { kind: 'backoff', reason: REASON }]);
ck(A.code === 0, 'A: builder exit 0', 'code=' + A.code + ' out=' + A.out.slice(0, 300));
const aTick = tickOf(A.html);
ck(aTick.last_kind === 'backoff', 'A: last_kind=backoff', String(aTick.last_kind));
ck(aTick.last_reason === REASON, 'A: page carries the reason text', JSON.stringify(aTick.last_reason));
ck(String(aTick.last_reason).indexOf('scan+verify skipped') < 0,
  'A: the boilerplate tail is dropped', JSON.stringify(aTick.last_reason));
const aPanel = runPanel(A.html, 'A');
const aHit = tags(aPanel).filter(t => t.text.indexOf(SKIP) === 0);
ck(aHit.length === 1, 'A: exactly one backoff tag', JSON.stringify(tags(aPanel).map(t => t.text)));
ck(aHit.length === 1 && aHit[0].text === SKIP + OPEN + REASON + CLOSE,
  'A: tag says why it skipped', aHit.length ? aHit[0].text : 'none');
ck(aHit.length === 1 && aHit[0].cls.indexOf('warn') >= 0,
  'A: still a warn tint (a skipped round is not green)', aHit.length ? aHit[0].cls : '');
ck(aHit.length === 1 && aHit[0].title.indexOf(REASON) >= 0,
  'A: title repeats the log text', aHit.length ? aHit[0].title : '');
const aSelf = selfText(runPanel(A.html, 'A2'));
ck(aSelf.indexOf(SKIP + OPEN + REASON + CLOSE) >= 0,
  'A: self-check row says the same thing', aSelf.slice(0, 300));

// --- B) no reason after the colon: old sentence, no dangling bracket -----
const B = build('b', [{ kind: 'gate' }, { kind: 'backoff' }]);
ck(B.code === 0, 'B: builder exit 0', 'code=' + B.code);
const bTick = tickOf(B.html);
ck(bTick.last_kind === 'backoff' && bTick.last_reason === '',
  'B: last_reason is empty, not a placeholder', JSON.stringify(bTick.last_reason));
const bPanel = runPanel(B.html, 'B');
const bHit = tags(bPanel).filter(t => t.text.indexOf(SKIP) === 0);
ck(bHit.length === 1 && bHit[0].text === SKIP,
  'B: row keeps the exact old sentence', bHit.length ? bHit[0].text : 'none');
ck(bHit.length === 1 && bHit[0].text.indexOf(OPEN) < 0,
  'B: no dangling bracket', bHit.length ? bHit[0].text : '');
const bSelf = selfText(runPanel(B.html, 'B2'));
ck(bSelf.indexOf(SKIP_FALLBACK) >= 0,
  'B: self-check keeps its historical phrasing', bSelf.slice(0, 300));

// --- C) a clean day says nothing about backoff ---------------------------
const C = build('c', [{ kind: 'gate' }, { kind: 'gate' }]);
const cPanel = runPanel(C.html, 'C');
ck(tags(cPanel).filter(t => t.text.indexOf(SKIP) === 0).length === 0,
  'C: no backoff tag on a clean day', JSON.stringify(tags(cPanel).map(t => t.text)));
ck(selfText(cPanel).indexOf(SKIP) < 0, 'C: self-check stays quiet too');
ck(/ last_reason=none\b/.test(C.out), 'C: PANEL OK says none, not an empty token',
  (C.out.match(/last_reason=\S+/) || [''])[0]);

// --- D) the machine token is a closed vocabulary --------------------------
ck(/ last_reason=stack-dirty\b/.test(A.out), 'D: known reason maps to stack-dirty',
  (A.out.match(/last_reason=\S+/) || [''])[0]);
ck(/ last_reason=none\b/.test(B.out), 'D: empty reason maps to none',
  (B.out.match(/last_reason=\S+/) || [''])[0]);
const O = build('o', [{ kind: 'gate' }, { kind: 'backoff', reason: 'write failed while saving state' }]);
ck(/ last_reason=other\b/.test(O.out), 'D: an unknown reason maps to other (never inline prose)',
  (O.out.match(/last_reason=\S+/) || [''])[0]);
// The c1 red-scan owns the last 40 lines of the tick log and matches
// `(gate|probe).*FAIL` case-insensitively; the panel summary is part of it.
const okLine = (A.out.match(/PANEL OK.*$/m) || [''])[0];
ck(!/(gate|probe).*FAIL/i.test(okLine),
  'D: the PANEL OK line cannot trip the c1 alarm', okLine.slice(0, 200));
const okLineO = (O.out.match(/PANEL OK.*$/m) || [''])[0];
ck(!/(gate|probe).*FAIL/i.test(okLineO),
  'D: not even for a reason whose prose contains a red word', okLineO.slice(0, 200));

// --- E) anti-drift -------------------------------------------------------
const tpl = fs.readFileSync(path.join('Tools', 'devloop', 'city-panel-template.html'), 'utf8');
ck(/function tickBackoffText\s*\(/.test(tpl), 'E: template defines tickBackoffText once');
ck((tpl.match(/function tickBackoffText\s*\(/g) || []).length === 1,
  'E: it is defined exactly once');
ck((tpl.match(/tickBackoffText\(tk/g) || []).length >= 2,
  'E: both the row and the self-check call it',
  String((tpl.match(/tickBackoffText\(tk/g) || []).length));
const bsrc = fs.readFileSync(builder, 'utf8');
ck(/last_reason\s*=\s*\[string\]\$lastReason/.test(bsrc), 'E: builder emits last_reason');
ck(/'\s*last_reason='\s*\+/.test(bsrc), 'E: builder prints the token on the PANEL OK line');

// --- F) older payloads behave exactly as before --------------------------
const realHtml = fs.readFileSync(path.join('world-public', 'city-panel.html'), 'utf8');
const legacy = realHtml.replace(/const TICK = ([\s\S]*?);\r?\n/, function (m, body) {
  let obj;
  try { obj = JSON.parse(body); } catch (e) { return m; }
  obj.last_kind = 'backoff';
  delete obj.last_reason;
  const lines = Object.keys(obj).map(k => '  ' + k + ': ' + JSON.stringify(obj[k]));
  return 'const TICK = {\n' + lines.join(',\n') + '\n};' + '\n';
});
ck(legacy !== realHtml, 'F: legacy fixture really removed the key');
const fPanel = runPanel(legacy, 'F');
const fHit = tags(fPanel).filter(t => t.text.indexOf(SKIP) === 0);
ck(fHit.length === 1 && fHit[0].text === SKIP,
  'F: old payload keeps the old sentence', fHit.length ? fHit[0].text : 'none');

try { fs.rmSync(tmp, { recursive: true, force: true }); } catch (e) { /* temp only */ }

console.log('');
console.log('RESULT: pass=' + pass + ' fail=' + fail);
if (fail > 0) process.exit(1);