// r708 panel test: the framing card grows three evidence rows (queue main#48).
// The card answered "what does the city look like" but nothing answered "was it
// built, was it measured, how old is the city code" -- that evidence already sat
// in City3D-staging and qa/ and was reachable only by walking the tree.
// Acceptance:
//   1. build compiles (vm.Script)
//   2. real build: exactly three proof rows, in order (R2 build / soak / code)
//   3. real build: values are carried verbatim (exit 0, 5/5 frames, 608.5 fps, sha)
//   4. real build: self-check row '城市证据' exists and passes inside the 48h window
//   5. missing build receipt => row warns and the self-check row names it
//   6. exit != 0 => row warns with the real code, self-check warns too
//   7. soak errors != 0 => self-check warns with the numbers
//   8. soak older than 48h => self-check warns and states how far past the window
//   9. row count still equals the template's selfcheck.push count (15 today)
//  10. no undefined/NaN leaks into the rendered rows
'use strict';
const fs = require('fs');
const vm = require('vm');

const realHtml = fs.readFileSync('world-public/city-panel.html', 'utf8');
const template = fs.readFileSync('Tools/devloop/city-panel-template.html', 'utf8');
const src = (() => {
  const m = realHtml.match(/<script>([\s\S]*?)<\/script>/);
  if (!m) throw new Error('no inline script in panel html');
  return m[1];
})();

function runPanelHtml(html, label) {
  const m = html.match(/<script>([\s\S]*?)<\/script>/);
  if (!m) throw new Error('no inline script in ' + label);
  const els = {};
  const makeEl = (id) => ({
    id: id, textContent: '', innerHTML: '', className: '', style: {}, title: '',
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

function withJson(html, name, obj) {
  const re = new RegExp('const ' + name + ' = \\{[\\s\\S]*?\\};\\n');
  if (!re.test(html)) throw new Error('cannot locate const ' + name);
  return html.replace(re, () => 'const ' + name + ' = ' + JSON.stringify(obj) + ';\n');
}

function rowOf(run, nm) {
  const body = String(run.get('selfcheck').innerHTML || '');
  const chunks = body.split('<div class="chk">').slice(1);
  for (const c of chunks) {
    if (c.indexOf('<span class="nm">' + nm + '</span>') >= 0) {
      return {
        ok: c.indexOf('<span class="st ok">') >= 0,
        warn: c.indexOf('<span class="st warn">') >= 0,
        vd: (c.match(/<span class="vd"[^>]*>([\s\S]*?)<\/span>/) || [, ''])[1],
        title: (c.match(/title="([^"]*)"/) || [, ''])[1],
        raw: c
      };
    }
  }
  return null;
}

function proofRows(run) {
  const body = String(run.get('proof').innerHTML || '');
  return body.split('<div class="prow">').slice(1).map(c => ({
    warn: c.indexOf('<span class="tag warn">') >= 0,
    text: c.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim(),
    raw: c
  }));
}

let pass = 0, fail = 0;
function chk(name, cond, detail) {
  if (cond) { pass++; console.log('  OK   ' + name); }
  else { fail++; console.log('  FAIL ' + name + (detail ? ' :: ' + detail : '')); }
}

const hoursAgo = (h) => new Date(Date.now() - h * 3600000).toISOString().replace(/\.\d{3}Z$/, 'Z');

function proof(o) {
  return Object.assign({
    build: {
      exists: true, exit_code: 0, ts_utc: hoursAgo(400), wall_s: 23,
      shots_present: 5, shots_expected: 5, rel: 'City3D-staging/r2-ignite.done',
      url: 'file:///D:/f/r2-ignite.done',
      report_rel: 'City3D-staging/r2-report.md', report_url: 'file:///D:/f/r2-report.md'
    },
    soak: {
      exists: true, fps_avg: 608.536, errors: 0, exceptions: 0,
      ts_utc: hoursAgo(41), rel: 'qa/smoke-r680-bm-a-soak.json', url: 'file:///D:/f/soak.json'
    },
    code: { exists: true, sha: '5a7ae301', ts_utc: hoursAgo(41) }
  }, o || {});
}

const runProof = (p, label) => runPanelHtml(withJson(realHtml, 'PROOF', p), label);

// --- 1) compile ---
let compiled = true;
try { new vm.Script(src); } catch (e) { compiled = false; console.log('  compile error: ' + e.message); }
chk('compile.ok', compiled);

// --- 2/3) real build rows ---
{
  const real = runPanelHtml(realHtml, 'real');
  const rows = proofRows(real);
  chk('real.row-count=3', rows.length === 3, 'rows=' + rows.length);
  chk('real.order', rows.length === 3 &&
    rows[0].text.indexOf('R2 批建') >= 0 && rows[1].text.indexOf('10 分钟浸泡') >= 0 &&
    rows[2].text.indexOf('城市代码') >= 0, JSON.stringify(rows.map(r => r.text)));
  chk('real.build-numbers', rows.length === 3 &&
    /exit 0 · 帧 5\/5/.test(rows[0].text), rows[0] ? rows[0].text : 'no row');
  // r710: the soak is re-runnable (main#17 window), so the expected numbers come
  // from the newest probe output on disk -- a pinned receipt would go red on every
  // honest re-run.
  const soakCands = fs.readdirSync('qa')
    .filter((n) => /^r2-soak-.*\.json$/.test(n) || /^smoke-.*-soak\.json$/.test(n))
    .map((n) => ({ n, t: fs.statSync('qa/' + n).mtimeMs }))
    .sort((a, b) => b.t - a.t);
  const soakName = soakCands.length ? soakCands[0].n : 'smoke-r680-bm-a-soak.json';
  const soakJson = JSON.parse(fs.readFileSync('qa/' + soakName, 'utf8'));
  const soakFps = soakJson && soakJson.render ? Number(soakJson.render.fps_avg) : NaN;
  const soakErr = soakJson && typeof soakJson.errors === 'number' ? soakJson.errors : 0;
  const fpsRe = new RegExp('render ' + (isFinite(soakFps) ? soakFps.toFixed(1) : '?') + ' fps \\u00b7 \\u9519\\u8bef ' + soakErr);
  chk('real.soak-numbers', rows.length === 3 && fpsRe.test(rows[1].text),
    (rows[1] ? rows[1].text : 'no row') + ' from ' + soakName);
  chk('real.code-sha', rows.length === 3 &&
    rows[2].text.indexOf(require('child_process').execSync('git log -1 --format=%h -- City3D/',
      { encoding: 'utf8' }).trim()) >= 0,
    rows[2] ? rows[2].text : 'no row');
  // main#52: the soak row now states the accepted baseline and the drift, and a
  // >20% drop is a real warn. The expectation is therefore computed from the two
  // receipts on disk, not hard-coded to "all green".
  const baseJson = JSON.parse(fs.readFileSync('qa/smoke-r680-bm-a-soak.json', 'utf8'));
  const baseFps = baseJson && baseJson.render ? Number(baseJson.render.fps_avg) : NaN;
  const driftPct = (isFinite(soakFps) && isFinite(baseFps) && baseFps > 0)
    ? ((soakFps - baseFps) / baseFps) * 100 : null;
  const badDrift = driftPct !== null && driftPct <= -20;
  const soakWarn = soakErr !== 0 || badDrift;
  chk('real.all-green', rows.length === 3 && !rows[0].warn && !rows[2].warn &&
    rows[1].warn === soakWarn, JSON.stringify(rows.map(r => r.warn)) + ' drift=' + driftPct);
  chk('real.soak-drift', rows.length === 3 && (!isFinite(baseFps) ||
    (rows[1].text.indexOf('基线 ' + Number(baseFps).toFixed(1)) >= 0 &&
     rows[1].text.indexOf(Number(driftPct).toFixed(1) + '%') >= 0)) &&
    rows[1].text.indexOf('p95 ') >= 0, rows[1] ? rows[1].text : 'no row');
  chk('real.no-nan', rows.every(r => !/undefined|NaN/.test(r.raw)));
  chk('real.has-links', rows.length === 3 && rows[0].raw.indexOf('r2-report.md') >= 0 &&
    rows[1].raw.indexOf(soakName) >= 0);

  // --- 4) self-check row inside the 48h window ---
  const row = rowOf(real, '城市证据');
  chk('real.sc-present', !!row, 'no 城市证据 row');
  chk('real.sc-ok', !!row && row.ok === !badDrift,
    (row ? 'vd=' + row.vd : 'no row') + ' badDrift=' + badDrift);
  chk('real.sc-text', !!row &&
    (badDrift ? (/漂移/.test(row.vd) && /main#52/.test(row.vd))
              : (row.vd.indexOf('批建 exit 0') >= 0 && /48 小时/.test(row.vd))),
    row ? 'vd=' + row.vd : 'no row');

  // --- 9) row count matches the template ---
  const expected = (template.match(/selfcheck\.push\(/g) || []).length;
  const rows2 = (String(real.get('selfcheck').innerHTML || '').match(/<span class="nm">/g) || []).length;
  chk('real.rows=template', rows2 === expected, 'rows=' + rows2 + ' expected=' + expected);
  chk('real.rows-at-least-15', expected >= 15, 'template count=' + expected);
}

// --- 5) missing build receipt ---
{
  const p = runProof(proof({ build: { exists: false, exit_code: -1, ts_utc: '', wall_s: -1, shots_present: -1, shots_expected: -1, rel: '', url: '', report_rel: '', report_url: '' } }), 'nobuild');
  const rows = proofRows(p);
  chk('nobuild.row-warns', rows.length === 3 && rows[0].warn, JSON.stringify(rows.map(r => r.warn)));
  chk('nobuild.row-text', rows.length === 3 && rows[0].text.indexOf('收据缺失') >= 0, rows[0].text);
  const row = rowOf(p, '城市证据');
  chk('nobuild.sc-warns', !!row && row.warn, row ? 'vd=' + row.vd : 'no row');
  chk('nobuild.sc-names-receipt', !!row && row.vd.indexOf('r2-ignite.done') >= 0, row ? 'vd=' + row.vd : 'no row');
}

// --- 6) build exit != 0 ---
{
  const p = runProof(proof({
    build: {
      exists: true, exit_code: 7, ts_utc: hoursAgo(400), wall_s: 5,
      shots_present: 2, shots_expected: 5, rel: 'r', url: 'file:///D:/f/r',
      report_rel: '', report_url: ''
    }
  }), 'exit7');
  const rows = proofRows(p);
  chk('exit7.row-warns', rows.length === 3 && rows[0].warn, JSON.stringify(rows.map(r => r.warn)));
  chk('exit7.row-code', rows.length === 3 && /exit 7 · 帧 2\/5/.test(rows[0].text), rows[0].text);
  const row = rowOf(p, '城市证据');
  chk('exit7.sc-warns', !!row && row.warn, row ? 'vd=' + row.vd : 'no row');
  chk('exit7.sc-code', !!row && row.vd.indexOf('exit 7') >= 0, row ? 'vd=' + row.vd : 'no row');
}

// --- 7) soak errors ---
{
  const p = runProof(proof({
    soak: { exists: true, fps_avg: 120.5, errors: 2, exceptions: 1, ts_utc: hoursAgo(41), rel: 's', url: 'file:///D:/f/s' }
  }), 'soakerr');
  const rows = proofRows(p);
  chk('soakerr.row-warns', rows.length === 3 && rows[1].warn, JSON.stringify(rows.map(r => r.warn)));
  const row = rowOf(p, '城市证据');
  chk('soakerr.sc-warns', !!row && row.warn, row ? 'vd=' + row.vd : 'no row');
  chk('soakerr.sc-numbers', !!row && row.vd.indexOf('errors=2') >= 0 && row.vd.indexOf('exceptions=1') >= 0,
    row ? 'vd=' + row.vd : 'no row');
}

// --- 8) soak past the 48h rerun window ---
{
  const p = runProof(proof({
    soak: { exists: true, fps_avg: 608.5, errors: 0, exceptions: 0, ts_utc: hoursAgo(60), rel: 's', url: 'file:///D:/f/s' }
  }), 'soakstale');
  const row = rowOf(p, '城市证据');
  chk('soakstale.sc-warns', !!row && row.warn, row ? 'vd=' + row.vd : 'no row');
  chk('soakstale.sc-delta', !!row && /已过 48 小时复跑窗 1[12] 小时/.test(row.vd), row ? 'vd=' + row.vd : 'no row');
  chk('soakstale.sc-names-main17', !!row && row.vd.indexOf('main#17') >= 0, row ? 'vd=' + row.vd : 'no row');
}

// --- unreadable receipt (present, numbers -1) is its own fact ---
{
  const p = runProof(proof({
    build: {
      exists: true, exit_code: -1, ts_utc: '', wall_s: -1, shots_present: -1, shots_expected: -1,
      rel: 'r', url: 'file:///D:/f/r', report_rel: '', report_url: ''
    }
  }), 'unreadable');
  const rows = proofRows(p);
  chk('unreadable.row-warns', rows.length === 3 && rows[0].warn, JSON.stringify(rows.map(r => r.warn)));
  chk('unreadable.row-text', rows.length === 3 && rows[0].text.indexOf('不可解析') >= 0, rows[0].text);
}

console.log('');
console.log('RESULT: pass=' + pass + ' fail=' + fail);
if (fail > 0) process.exit(2);