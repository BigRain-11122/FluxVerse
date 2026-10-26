// r678 panel self-check item 11 "face freshness" test (queue main#16).
// Stub DOM, run the inlined panel script from the real build plus patched FACE
// fixtures. Acceptance (queue main#16 judge-three):
//   1. real build -> the row passes and shows an age
//   2. age > 24h fixture -> 注意 and the verdict says 面部陈旧 N 小时
//   3. row count follows the template (old suites must not go red on the new row)
'use strict';
const fs = require('fs');
const vm = require('vm');

function runPanelHtml(html, label) {
  const m = html.match(/<script>([\s\S]*?)<\/script>/);
  if (!m) throw new Error('no inline script in ' + label);

  const els = {};
  const makeEl = (id) => ({
    id: id, textContent: '', innerHTML: '', className: '', style: {},
    children: [], appendChild(c) { this.children.push(c); }
  });
  const document = {
    getElementById(id) { return els[id] || (els[id] = makeEl(id)); },
    createElement() { return makeEl('span'); },
    querySelectorAll() { return []; }
  };
  const sandbox = { document, console, Date, Math, Object, Array, String, Number, isNaN, setTimeout };
  vm.runInNewContext(m[1], sandbox, { filename: label, timeout: 5000 });
  return { els, get: (id) => (els[id] ? els[id] : makeEl(id)) };
}

function faceOf(html) {
  const m = html.match(/const FACE = (\{[\s\S]*?\});\n/);
  if (!m) throw new Error('FACE literal not found');
  return JSON.parse(m[1]);
}

function withFace(html, patch) {
  const cur = faceOf(html);
  const next = Object.assign({}, cur, patch);
  return html.replace(/const FACE = \{[\s\S]*?\};\n/, 'const FACE = ' + JSON.stringify(next) + ';\n');
}

function rowByLabel(run, label) {
  const html = run.get('selfcheck').innerHTML;
  const parts = html.split('<div class="chk">').slice(1);
  const hit = parts.filter(p => p.indexOf('>' + label + '<') >= 0);
  if (!hit.length) return null;
  const p = hit[0];
  return { ok: p.indexOf('<span class="st ok">') >= 0, vd: p };
}

let pass = 0, fail = 0;
function chk(name, cond, detail) {
  if (cond) { pass++; console.log('  OK   ' + name); }
  else { fail++; console.log('  FAIL ' + name + (detail ? ' :: ' + detail : '')); }
}

const realHtml = fs.readFileSync('world-public/city-panel.html', 'utf8');
const tpl = fs.readFileSync('Tools/devloop/city-panel-template.html', 'utf8');
const expectedChecks = (tpl.match(/selfcheck\.push\(/g) || []).length;

// --- 1) real build: row present, passes, shows an age ---
const real = runPanelHtml(realHtml, 'real');
const realRow = rowByLabel(real, '面部新鲜度');
chk('real.row-present', realRow !== null, 'no 面部新鲜度 row');
chk('real.pass', !!realRow && realRow.ok === true, 'vd=' + JSON.stringify(realRow && realRow.vd));
chk('real.shows-age', !!realRow &&
  (/\d+ 分钟前/.test(realRow.vd) || /\d+\.\d+ 小时前/.test(realRow.vd)),
  'vd=' + (realRow && realRow.vd));
chk('real.threshold-note', !!realRow && realRow.vd.indexOf('阈值 24 小时') >= 0,
  'vd=' + (realRow && realRow.vd));

// --- 2) 30h-old face fixture -> 注意 + 面部陈旧 30.0 小时 ---
const oldUtc = new Date(Date.now() - 30 * 3600000).toISOString();
const stale = runPanelHtml(withFace(realHtml, { updated_utc: oldUtc }), 'fixture-stale-face');
const staleRow = rowByLabel(stale, '面部新鲜度');
chk('stale.warn', !!staleRow && staleRow.ok === false, 'vd=' + JSON.stringify(staleRow && staleRow.vd));
chk('stale.verdict', !!staleRow && staleRow.vd.indexOf('面部陈旧 30.0 小时') >= 0,
  'vd=' + (staleRow && staleRow.vd));
chk('stale.sum-warn', /^\d+ 项注意$/.test(stale.get('sc-sum').textContent),
  'sum=' + stale.get('sc-sum').textContent);

// --- 3) 23h-old face stays green (threshold is 24, not "any age") ---
const freshUtc = new Date(Date.now() - 23 * 3600000).toISOString();
const nearly = runPanelHtml(withFace(realHtml, { updated_utc: freshUtc }), 'fixture-23h');
const nearlyRow = rowByLabel(nearly, '面部新鲜度');
chk('23h.pass', !!nearlyRow && nearlyRow.ok === true, 'vd=' + JSON.stringify(nearlyRow && nearlyRow.vd));

// --- 4) missing / unparsable face time must warn, never silently pass ---
const miss = runPanelHtml(withFace(realHtml, { updated_utc: '' }), 'fixture-miss');
const missRow = rowByLabel(miss, '面部新鲜度');
chk('miss.warn', !!missRow && missRow.ok === false, 'vd=' + JSON.stringify(missRow && missRow.vd));
chk('miss.verdict', !!missRow && missRow.vd.indexOf('面部时间缺失') >= 0, 'vd=' + (missRow && missRow.vd));

// --- 5) future stamp (clock/write anomaly) must warn ---
const futureUtc = new Date(Date.now() + 5 * 3600000).toISOString();
const fut = runPanelHtml(withFace(realHtml, { updated_utc: futureUtc }), 'fixture-future');
const futRow = rowByLabel(fut, '面部新鲜度');
chk('future.warn', !!futRow && futRow.ok === false, 'vd=' + JSON.stringify(futRow && futRow.vd));

// --- 6) row count follows the template (no hardcoded total) ---
const rowCount = (real.get('selfcheck').innerHTML.match(/<span class="nm">/g) || []).length;
chk('real.rows=template', rowCount === expectedChecks,
  'rows=' + rowCount + ' expected=' + expectedChecks);

console.log('RESULT pass=' + pass + ' fail=' + fail);
process.exit(fail ? 1 : 0);