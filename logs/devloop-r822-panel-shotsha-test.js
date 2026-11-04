// r822 panel test: the framing row can finally name the code revision a frame
// was shot from (queue main#137, left open by r821's own honest boundary: that
// round could only compare TIMES, so "code changed and changed back" or "two
// commits inside one capture window" still read the same).
//
// The capture tool now writes a provenance sidecar per capture session and the
// builder copies its sha onto each frame. The page answers with the sha when
// both sides have one, and falls back to the r821 time sentence when they do
// not - saying out loud that the frame is unbound instead of guessing.
//
// Acceptance:
//   1. same revision => "frame and code are the same build", row stays ok
//   2. different revision => warn, both revisions named, not a time gap
//   3. prefix-compatible short shas count as the same build (>= 7 chars)
//   4. no frame sha => r821 time sentence still works and it SAYS "unbound"
//   5. no code sha => time sentence still works, no version claim
//   6. no code commit at all => no sentence, no version claim
//   7. anti-drift: builder ships the sha, capture tool writes the sidecar
'use strict';
const fs = require('fs');
const vm = require('vm');

const template = fs.readFileSync('Tools/devloop/city-panel-template.html', 'utf8');
const realHtml = fs.readFileSync('world-public/city-panel.html', 'utf8');
const builder = fs.readFileSync('Tools/devloop/build-city-panel.ps1', 'utf8');
const capture = fs.readFileSync('Tools/devloop/city3d-shots.ps1', 'utf8');

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

const realScript = scriptOf(realHtml, 'real');
const SHOTS_RE = /const SHOTS = (\{[^\n]*\});/;

// The real page carries live data URIs; parse the object, drop the payloads
// (the row under test only reads shot_utc / sha) and put a controlled version
// back. Both swaps are asserted so an upstream shape change fails loudly.
function pageWith(opt) {
  const m = SHOTS_RE.exec(realScript);
  if (!m) throw new Error('real page SHOTS const not found on one line');
  const shots = JSON.parse(m[1]);
  if (!Array.isArray(shots.items) || !shots.items.length) {
    throw new Error('real page has no shots; nothing to bind a version to');
  }
  if (!('sha' in shots.items[0])) {
    throw new Error('real page frames carry no sha key; rebuild the panel first');
  }
  shots.items.forEach(it => { delete it.data; });
  shots.items[0].shot_utc = opt.shot_utc;
  if (opt.shot_sha !== undefined) shots.items[0].sha = opt.shot_sha;
  let s = realScript.replace(SHOTS_RE, 'const SHOTS = ' + JSON.stringify(shots) + ';');
  if (s.indexOf('"code"') < 0) throw new Error('real page has no PROOF.code object');
  s = s.replace(/"code":\{[^}]*\}/, '"code":' + JSON.stringify(opt.code));
  return s;
}
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

// --- 1) same revision: version wins over time (code is 3h newer, still same) ---
{
  const row = shotRow(runPanel(pageWith({
    shot_utc: ISO(T0), shot_sha: 'abc12345',
    code: { exists: true, sha: 'abc12345', ts_utc: ISO(T0 + 3 * H) }
  }), 'same').get('selfcheck').innerHTML);
  chk('same.row-found', !!row, 'no 取景帧 row');
  if (row) {
    chk('same.state-ok', row.state === 'ok', row.state);
    chk('same.names-version', row.text.indexOf('帧与代码同版') >= 0, row.text);
    chk('same.names-sha', row.text.indexOf('abc12345') >= 0, row.text);
    chk('same.no-time-gap', row.text.indexOf('比帧新') < 0, row.text);
  }
}

// --- 2) different revision: warn and name both sides ---
{
  const row = shotRow(runPanel(pageWith({
    shot_utc: ISO(T0), shot_sha: 'aaa1111',
    code: { exists: true, sha: 'bbb2222', ts_utc: ISO(T0 + 2 * 60000) }
  }), 'diff').get('selfcheck').innerHTML);
  chk('diff.row-found', !!row);
  if (row) {
    chk('diff.state-warn', row.state === 'warn', row.state);
    chk('diff.says-not-caught-up', row.text.indexOf('帧未跟上') >= 0, row.text);
    chk('diff.names-frame-sha', row.text.indexOf('@aaa1111') >= 0, row.text);
    chk('diff.names-code-sha', row.text.indexOf('@bbb2222') >= 0, row.text);
    chk('diff.no-window-language', row.text.indexOf('捕捉窗内') < 0, row.text);
  }
}

// --- 3) prefix-compatible short shas are the same build ---
{
  const row = shotRow(runPanel(pageWith({
    shot_utc: ISO(T0), shot_sha: '6c795977',
    code: { exists: true, sha: '6c79597', ts_utc: ISO(T0 + 5 * 60000) }
  }), 'prefix').get('selfcheck').innerHTML);
  chk('prefix.row-found', !!row);
  if (row) {
    chk('prefix.state-ok', row.state === 'ok', row.state);
    chk('prefix.same-build', row.text.indexOf('帧与代码同版') >= 0, row.text);
  }
}

// --- 4) no frame sha: r821 sentence still works, and it says UNBOUND ---
{
  const row = shotRow(runPanel(pageWith({
    shot_utc: ISO(T0), shot_sha: '',
    code: { exists: true, sha: 'abc12345', ts_utc: ISO(T0 + 2 * 60000) }
  }), 'unbound').get('selfcheck').innerHTML);
  chk('unbound.row-found', !!row);
  if (row) {
    chk('unbound.state-ok', row.state === 'ok', row.state);
    chk('unbound.time-sentence', row.text.indexOf('比帧新 2 分') >= 0, row.text);
    chk('unbound.says-unbound', row.text.indexOf('帧未绑定版本') >= 0, row.text);
    chk('unbound.no-version-claim', row.text.indexOf('帧与代码同版') < 0, row.text);
  }
}

// --- 5) no code sha: time sentence, never a version claim ---
{
  const row = shotRow(runPanel(pageWith({
    shot_utc: ISO(T0), shot_sha: 'abc12345',
    code: { exists: true, sha: '', ts_utc: ISO(T0 + 3 * H) }
  }), 'nocodesha').get('selfcheck').innerHTML);
  chk('nocodesha.row-found', !!row);
  if (row) {
    chk('nocodesha.state-warn', row.state === 'warn', row.state);
    chk('nocodesha.no-version-claim', row.text.indexOf('帧与代码同版') < 0, row.text);
    chk('nocodesha.no-frame-sha-claim', row.text.indexOf('@abc12345') < 0, row.text);
  }
}

// --- 6) no code commit at all: silence, not a clean claim ---
{
  const row = shotRow(runPanel(pageWith({
    shot_utc: ISO(T0), shot_sha: 'abc12345',
    code: { exists: false, sha: '', ts_utc: '' }
  }), 'nocode').get('selfcheck').innerHTML);
  chk('nocode.row-found', !!row);
  if (row) {
    chk('nocode.silent', row.text.indexOf('比帧新') < 0 && row.text.indexOf('同版') < 0, row.text);
  }
}

// --- 7) anti-drift: all three ends of the binding must be wired ---
chk('drift.template-sha-keys', /function shotShaKey\(v\)/.test(template));
chk('drift.template-sha-same', /function shotShaSame\(a, b\)/.test(template));
chk('drift.template-reads-shot-sha', /shotShaKey\(shotList\[0\] && shotList\[0\]\.sha\)/.test(template));
chk('drift.builder-reads-sidecar', /\.provenance\.json/.test(builder));
chk('drift.builder-ships-sha', /^\s*sha\s+= \[string\]\$sha/m.test(builder));
chk('drift.capture-writes-sidecar', /provenance\.json/.test(capture));
chk('drift.capture-queries-code', /git -C \$root log -1 --format=%h -- City3D/.test(capture));

console.log('RESULT: pass=' + pass + ' fail=' + fail);
process.exit(fail ? 1 : 0);