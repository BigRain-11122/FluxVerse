// r821 panel test: the framing card and the proof card finally talk to each
// other (debt found this round). The 取景帧 row said "3 frames, newest 3 days
// ago (7-day threshold)" and the 城市证据 row said "code 6c795977" — two
// readings side by side, never compared. A round that lands City3D changes
// without re-shooting therefore leaves a GREEN frame badge over pictures of the
// old code. Live anchor 2026-11-04: newest frame 14:38:02Z vs last City3D
// commit 14:40:46Z = 2m44s, which is normal (the capture round writes frames,
// then commits them). So the page now prints the gap itself and only turns the
// row to warn when the gap leaves that capture window (> 60 min).
//
// Acceptance:
//   1. template + real build compile
//   2. gap inside the capture window => the gap is named, the row stays ok
//   3. gap beyond the window => warn, and the sentence says the frames did not
//      catch up (not just a number)
//   4. frames newer than the commit / no code commit / unparseable either side
//      => no sentence at all (a missing comparison is never a clean claim)
//   5. no shots => still the old "card is empty" wording, no phantom gap
//   6. real page: the row names the live gap and does not cry wolf
//   7. anti-drift: builder really injects code.ts_utc, template really wires it
'use strict';
const fs = require('fs');
const vm = require('vm');

const template = fs.readFileSync('Tools/devloop/city-panel-template.html', 'utf8');
const realHtml = fs.readFileSync('world-public/city-panel.html', 'utf8');

function scriptOf(html, label) {
  const m = html.match(/<script>([\s\S]*?)<\/script>/);
  if (!m) throw new Error('no inline script in ' + label);
  return m[1];
}

function runPanel(script, label) {
  const els = {};
  const makeEl = (id) => ({
    id: id, textContent: '', innerHTML: '', className: '', style: {}, title: '',
    children: [], listeners: {},
    appendChild(c) { this.children.push(c); },
    addEventListener(n, fn) { (this.listeners[n] = this.listeners[n] || []).push(fn); },
    scrollIntoView() {}
  });
  const document = {
    getElementById(id) { return els[id] || (els[id] = makeEl(id)); },
    createElement() { return makeEl('span'); },
    querySelectorAll() { return []; }
  };
  const sandbox = { document, console, Date, Math, Object, Array, String, Number, isNaN, setTimeout };
  vm.runInNewContext(script, sandbox, { filename: label, timeout: 5000 });
  return { get: (id) => els[id] || makeEl('missing-' + id) };
}

// The real page already carries every placeholder filled with live data; only
// the two readings under test are swapped. Both swaps are asserted so a shape
// change upstream fails loudly instead of silently testing nothing.
const realScript = scriptOf(realHtml, 'real');
function pageWith(opt) {
  let s = realScript;
  if (s.indexOf('"code"') < 0) throw new Error('real page has no PROOF.code object');
  s = s.replace(/"code":\{[^}]*\}/, '"code":' + JSON.stringify(opt.code));
  if (s.indexOf('"shot_utc"') < 0) throw new Error('real page has no shot_utc');
  s = s.replace(/"shot_utc":"[^"]*"/g, '"shot_utc":' + JSON.stringify(opt.shot_utc));
  if (opt.emptyShots) {
    // SWAP THE WHOLE CONST, not a fragment: a looser "items" match can swallow
    // the next declaration (caught on the first run - PROOF went undefined).
    const before = s;
    s = s.replace(/const SHOTS = \{[^\n]*\};/, 'const SHOTS = {"items":[]};');
    if (s === before) throw new Error('real page SHOTS const not found on one line');
  }
  return s;
}
// Pull the 取景帧 self-check row out of the rendered block: state, name, text.
function shotRow(html) {
  const m = /<span class="st (ok|warn)">[^<]*<\/span><span class="nm">取景帧<\/span><span class="vd"[^>]*>([^<]*)<\/span>/
    .exec(html);
  return m ? { state: m[1], text: m[2] } : null;
}
const H = 3600000;
const ISO = (t) => new Date(t).toISOString().replace(/\.\d{3}Z$/, 'Z');
const T0 = Date.parse('2026-11-04T06:00:00Z');

let pass = 0, fail = 0;
function chk(name, cond, detail) {
  if (cond) { pass++; console.log('  OK   ' + name); }
  else { fail++; console.log('  FAIL ' + name + (detail ? ' :: ' + detail : '')); }
}

// --- 1) compile ---
['template', 'real'].forEach(k => {
  let ok = true, msg = '';
  try { new vm.Script(scriptOf(k === 'template' ? template : realHtml, k)); }
  catch (e) { ok = false; msg = e.message; }
  chk('compile.' + k, ok, msg);
});

// --- 2) inside the capture window: named, still ok ---
{
  const html = pageWith({
    shot_utc: ISO(T0),
    code: { exists: true, sha: 'abc12345', ts_utc: ISO(T0 + 2 * 60000) }
  });
  const row = shotRow(runPanel(html, 'gap2min').get('selfcheck').innerHTML);
  chk('win.row-found', !!row, 'no 取景帧 row in rendered selfcheck');
  if (row) {
    chk('win.state-ok', row.state === 'ok', row.state);
    chk('win.names-gap', row.text.indexOf('比帧新 2 分') >= 0, row.text);
    chk('win.names-sha', row.text.indexOf('abc12345') >= 0, row.text);
    chk('win.says-window', row.text.indexOf('捕捉窗内') >= 0, row.text);
    chk('win.no-alarm', row.text.indexOf('帧未跟上代码') < 0, row.text);
  }
}

// --- 3) beyond the window: warn and say what it means ---
{
  const html = pageWith({
    shot_utc: ISO(T0),
    code: { exists: true, sha: 'abc12345', ts_utc: ISO(T0 + 3 * H) }
  });
  const row = shotRow(runPanel(html, 'gap3h').get('selfcheck').innerHTML);
  chk('late.row-found', !!row);
  if (row) {
    chk('late.state-warn', row.state === 'warn', row.state);
    chk('late.says-not-caught-up', row.text.indexOf('帧未跟上代码') >= 0, row.text);
    chk('late.names-hours', row.text.indexOf('比帧新 3 小时') >= 0, row.text);
  }
}

// --- 4) no comparison possible => no sentence ---
{
  const cases = [
    ['frames-newer', { shot_utc: ISO(T0), code: { exists: true, sha: 'abc12345', ts_utc: ISO(T0 - H) } }],
    ['no-code', { shot_utc: ISO(T0), code: { exists: false, sha: '', ts_utc: '' } }],
    ['code-ts-empty', { shot_utc: ISO(T0), code: { exists: true, sha: 'abc12345', ts_utc: '' } }],
    ['code-ts-bad', { shot_utc: ISO(T0), code: { exists: true, sha: 'abc12345', ts_utc: 'not-a-date' } }],
    ['shot-ts-bad', { shot_utc: 'nope', code: { exists: true, sha: 'abc12345', ts_utc: ISO(T0 + 3 * H) } }]
  ];
  cases.forEach(function (c) {
    const row = shotRow(runPanel(pageWith(c[1]), c[0]).get('selfcheck').innerHTML);
    chk('silent.' + c[0] + '.row', !!row);
    if (row) chk('silent.' + c[0] + '.no-gap', row.text.indexOf('比帧新') < 0, row.text);
  });
  // A bad shot stamp is already a red row ("time unreadable"); the new clause
  // must not paper over it.
  const bad = shotRow(runPanel(pageWith(cases[4][1]), 'shotbad').get('selfcheck').innerHTML);
  chk('silent.shot-ts-bad.still-warn', bad && bad.state === 'warn', bad && bad.text);
}

// --- 5) no frames at all: old wording, no phantom gap ---
{
  const row = shotRow(runPanel(pageWith({
    emptyShots: true, shot_utc: ISO(T0),
    code: { exists: true, sha: 'abc12345', ts_utc: ISO(T0 + 3 * H) }
  }), 'noshots').get('selfcheck').innerHTML);
  chk('empty.row-found', !!row);
  if (row) {
    chk('empty.old-wording', row.text.indexOf('取景卡为空') >= 0, row.text);
    chk('empty.no-gap', row.text.indexOf('比帧新') < 0, row.text);
  }
}

// --- 6) real page: names the live gap, does not cry wolf ---
{
  const row = shotRow(runPanel(realScript, 'realpage').get('selfcheck').innerHTML);
  chk('live.row-found', !!row);
  if (row) {
    chk('live.names-gap', row.text.indexOf('比帧新') >= 0, row.text);
    chk('live.within-window', row.text.indexOf('捕捉窗内') >= 0, row.text);
    chk('live.state-ok', row.state === 'ok', row.state);
  }
}

// --- 7) anti-drift: both ends of the comparison must really be wired ---
chk('drift.function', /function shotCodeNote\(shotList, code\)/.test(template));
chk('drift.call', /shotCodeNote\(shotList, \(PROOF && PROOF\.code\) \|\| \{\}\)/.test(template));
chk('drift.applied', /if \(sh && shotCode\.note\) \{ sh\.vd = sh\.vd \+ shotCode\.note; \}/.test(template));
const built = fs.readFileSync('Tools/devloop/build-city-panel.ps1', 'utf8');
chk('drift.builder-ships-ts', /ts_utc = Convert-UtcIso -Raw/.test(built));
chk('drift.real-has-code-ts', /"code":\{[^}]*"ts_utc":"\d{4}-\d{2}-\d{2}T/.test(realHtml));

console.log('RESULT: pass=' + pass + ' fail=' + fail);
process.exit(fail ? 1 : 0);