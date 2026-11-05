// r847 panel test (queue main#146): r846 let the page say WHY the LAST round
// skipped scan/gate, but "today 24 rounds backed off" still never said WHICH
// reasons - the reader had to open `logs/tick-<date>.log` to find out what the
// day was actually blocked on. builder now classifies every backoff round by
// its own `backoff:` line in the same per-round pass; the tally is complete or
// withheld (-1), never a partial list posing as "all the reasons" nor a
// fabricated 0 (r799/r810 precedent).
// Method: build the REAL panel against fixture tick logs, run the produced
// page's own script, read the rendered tags (same harness as r823/r846).
// Cases:
//   A. one reason, two rounds  -> 1 class, 2 rounds, tag names it
//   B. two reasons, one round each -> 2 classes, deterministic order
//   C. a backoff round with NO reason -> tally withheld (-1), no tag, PANEL OK
//      says unknown (never "0 classes")
//   D. clean day -> no tag, PANEL OK says none
//   E. anti-drift: one helper, two call sites; builder emits both keys; the
//      PANEL OK token is a closed vocabulary that cannot trip the c1 red-scan
//   F. older payload (no backoff_reason_* keys) -> silence, exact old rows
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const vm = require('vm');
const { spawnSync } = require('child_process');

const SKIP = '\u4e0a\u8f6e\u8df3\u8fc7 scan/gate';              // "last round skipped scan/gate"
const WHY_LABEL = '\u4eca\u65e5\u9000\u907f\u539f\u56e0 ';       // "today's backoff reasons "
const SEP = ' \u00b7 ';                                          // " · "
const TIMES = ' \u00d7';                                         // " ×"
const MORE = ' \u00b7 \u53e6 ';                                  // " · another "
const CLS = ' \u7c7b';                                           // " classes"
const REASON_A = 'perceptor stack dirty (in-flight dev edits)';
const REASON_B = 'schema in flight';

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'fv-r847-'));
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
      lines.push('gate: VERIFY PASS');
      lines.push('gate: PASS');
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
  return { get: (id) => (els[id] || makeEl(id)) };
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

// --- A) one reason, two rounds -------------------------------------------
const A = build('a', [{ kind: 'backoff', reason: REASON_A }, { kind: 'backoff', reason: REASON_A }, { kind: 'gate' }]);
ck(A.code === 0, 'A: builder exit 0', 'code=' + A.code + ' out=' + A.out.slice(0, 300));
const aTick = tickOf(A.html);
ck(aTick.skip_rounds === 2 && aTick.rounds_seen === 3, 'A: two of three rounds backed off',
  JSON.stringify({ s: aTick.skip_rounds, r: aTick.rounds_seen }));
ck(aTick.backoff_reason_classes === 1, 'A: one distinct class, not two rounds',
  JSON.stringify(aTick.backoff_reason_classes));
ck(Array.isArray(aTick.backoff_reason_rows) && aTick.backoff_reason_rows.length === 1 &&
  aTick.backoff_reason_rows[0].reason === REASON_A && aTick.backoff_reason_rows[0].rounds === 2,
  'A: the row carries reason + 2 rounds', JSON.stringify(aTick.backoff_reason_rows));
ck(String(aTick.backoff_reason_rows[0].reason).indexOf('scan+verify skipped') < 0,
  'A: the boilerplate tail is dropped', JSON.stringify(aTick.backoff_reason_rows[0].reason));
const aWhy = tags(runPanel(A.html, 'A')).filter(t => t.text.indexOf(WHY_LABEL) === 0);
ck(aWhy.length === 1, 'A: exactly one why tag', JSON.stringify(tags(runPanel(A.html, 'A2')).map(t => t.text)));
ck(aWhy.length === 1 && aWhy[0].text === WHY_LABEL + REASON_A + TIMES + '2',
  'A: tag reads "reason x2"', aWhy.length ? aWhy[0].text : 'none');
ck(aWhy.length === 1 && aWhy[0].text.indexOf(MORE) < 0,
  'A: no "another N classes" when there is only one', aWhy.length ? aWhy[0].text : '');
ck(aWhy.length === 1 && aWhy[0].title.indexOf('2') >= 0 && aWhy[0].title.indexOf('1') >= 0,
  'A: title carries both the round count and the class count', aWhy.length ? aWhy[0].title : '');
const aSelf = selfText(runPanel(A.html, 'A3'));
ck(aSelf.indexOf(WHY_LABEL + REASON_A + TIMES + '2') >= 0,
  'A: self-check row says the same thing', aSelf.slice(0, 400));

// --- B) two reasons, one round each: deterministic order ------------------
const B = build('b', [{ kind: 'backoff', reason: REASON_B }, { kind: 'backoff', reason: REASON_A }, { kind: 'gate' }]);
ck(B.code === 0, 'B: builder exit 0', 'code=' + B.code);
const bTick = tickOf(B.html);
ck(bTick.backoff_reason_classes === 2, 'B: two classes', JSON.stringify(bTick.backoff_reason_classes));
const bRows = bTick.backoff_reason_rows || [];
ck(bRows.length === 2, 'B: both rows kept', JSON.stringify(bRows));
// Ties on count are ordered by reason ascending -> 'perceptor...' before 'schema...'.
ck(bRows.length === 2 && bRows[0].reason === REASON_A && bRows[1].reason === REASON_B,
  'B: equal counts ordered by reason (byte-stable rebuilds)', JSON.stringify(bRows));
const bWhy = tags(runPanel(B.html, 'B2')).filter(t => t.text.indexOf(WHY_LABEL) === 0);
ck(bWhy.length === 1 && bWhy[0].text === WHY_LABEL + REASON_A + TIMES + '1' + SEP + REASON_B + TIMES + '1',
  'B: tag names both reasons', bWhy.length ? bWhy[0].text : 'none');

// --- C) a round the log could not explain -> withheld, never 0 -----------
const C = build('c', [{ kind: 'backoff', reason: REASON_A }, { kind: 'backoff' }, { kind: 'gate' }]);
ck(C.code === 0, 'C: builder exit 0', 'code=' + C.code);
const cTick = tickOf(C.html);
ck(cTick.skip_rounds === 2, 'C: both rounds still counted as skipped', JSON.stringify(cTick.skip_rounds));
ck(cTick.backoff_reason_classes === -1,
  'C: tally withheld (-1), not a partial "1 class"', JSON.stringify(cTick.backoff_reason_classes));
ck(!Array.isArray(cTick.backoff_reason_rows) || cTick.backoff_reason_rows.length === 0,
  'C: no rows when the set is incomplete', JSON.stringify(cTick.backoff_reason_rows));
const cPanel = runPanel(C.html, 'C2');
ck(tags(cPanel).filter(t => t.text.indexOf(WHY_LABEL) === 0).length === 0,
  'C: no why tag at all', JSON.stringify(tags(cPanel).map(t => t.text)));
ck(selfText(cPanel).indexOf(WHY_LABEL) < 0, 'C: self-check quiet too');
ck(/ backoff_reason=unknown\b/.test(C.out), 'C: PANEL OK says unknown, not 0',
  (C.out.match(/backoff_reason=\S+/) || [''])[0]);

// --- D) a clean day says nothing -----------------------------------------
const D = build('d', [{ kind: 'gate' }, { kind: 'gate' }]);
const dPanel = runPanel(D.html, 'D');
ck(tags(dPanel).filter(t => t.text.indexOf(WHY_LABEL) === 0).length === 0,
  'D: no why tag on a clean day', JSON.stringify(tags(dPanel).map(t => t.text)));
ck(/ backoff_reason=none\b/.test(D.out), 'D: PANEL OK says none, not an empty token',
  (D.out.match(/backoff_reason=\S+/) || [''])[0]);

// --- E) anti-drift + closed vocabulary -----------------------------------
const tpl = fs.readFileSync(path.join('Tools', 'devloop', 'city-panel-template.html'), 'utf8');
ck(/function tickBackoffWhyText\s*\(/.test(tpl), 'E: template defines tickBackoffWhyText');
ck((tpl.match(/function tickBackoffWhyText\s*\(/g) || []).length === 1,
  'E: it is defined exactly once');
ck((tpl.match(/tickBackoffWhyText\(tk\)/g) || []).length >= 2,
  'E: both the row and the self-check call it',
  String((tpl.match(/tickBackoffWhyText\(tk\)/g) || []).length));
const bsrc = fs.readFileSync(builder, 'utf8');
ck(/backoff_reason_classes\s*=\s*\[int\]\$backoffReasonClasses/.test(bsrc),
  'E: builder emits backoff_reason_classes');
ck(/backoff_reason_rows\s*=\s*@\(\$backoffReasonRows\)/.test(bsrc),
  'E: builder emits backoff_reason_rows');
ck(/' backoff_reason='\s*\+\s*\[string\]\$backoffSlugText/.test(bsrc),
  'E: builder prints the token on the PANEL OK line');
// The c1 red-scan owns the last 40 lines of the tick log and matches
// `(gate|probe).*FAIL` case-insensitively; the panel summary is part of it.
const okA = (A.out.match(/PANEL OK.*$/m) || [''])[0];
ck(!/(gate|probe).*FAIL/i.test(okA), 'E: the PANEL OK line cannot trip the c1 alarm', okA.slice(0, 200));
const okB = (B.out.match(/PANEL OK.*$/m) || [''])[0];
ck(!/(gate|probe).*FAIL/i.test(okB), 'E: so is the two-class day', okB.slice(0, 200));
ck(/ backoff_reason=stack-dirty:2\b/.test(A.out), 'E: known reason maps to stack-dirty with its count',
  (A.out.match(/backoff_reason=\S+/) || [''])[0]);
ck(/ backoff_reason=other:1,stack-dirty:1\b/.test(B.out), 'E: mixed day prints both slugs, sorted',
  (B.out.match(/backoff_reason=\S+/) || [''])[0]);
// Reason prose never reaches the machine line.
ck(okA.indexOf(REASON_A) < 0, 'E: the machine line carries slugs only, never the prose');

// --- F) older payloads behave exactly as before --------------------------
const realHtml = fs.readFileSync(path.join('world-public', 'city-panel.html'), 'utf8');
const legacy = realHtml.replace(/const TICK = ([\s\S]*?);\r?\n/, function (m, body) {
  let obj;
  try { obj = JSON.parse(body); } catch (e) { return m; }
  obj.skip_rounds = 3;
  obj.rounds_seen = 5;
  obj.last_kind = 'gate';
  delete obj.backoff_reason_classes;
  delete obj.backoff_reason_rows;
  const lines = Object.keys(obj).map(k => '  ' + k + ': ' + JSON.stringify(obj[k]));
  return 'const TICK = {\n' + lines.join(',\n') + '\n};' + '\n';
});
ck(legacy !== realHtml, 'F: legacy fixture really removed the keys');
const fPanel = runPanel(legacy, 'F');
ck(tags(fPanel).filter(t => t.text.indexOf(WHY_LABEL) === 0).length === 0,
  'F: old payload prints no why tag', JSON.stringify(tags(fPanel).map(t => t.text)));
ck(tags(fPanel).filter(t => t.text.indexOf(SKIP) === 0).length === 0,
  'F: and the skip tag keeps its old shape (last round ran the gate)',
  JSON.stringify(tags(fPanel).map(t => t.text)));

try { fs.rmSync(tmp, { recursive: true, force: true }); } catch (e) { /* temp only */ }

console.log('');
console.log('RESULT: pass=' + pass + ' fail=' + fail);
if (fail > 0) process.exit(1);