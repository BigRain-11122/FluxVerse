// r703 panel test: the framing card's frame count / frame age become
// self-check item 14 (queue main#43). r702 shipped the city framing card, but
// its health only showed up on the card badge -- the self-check block, which is
// where a reader looks to ask "is this page honest right now", could not see it.
// Acceptance:
//   1. build compiles (vm.Script)
//   2. real build: the '取景帧' row exists and row count == template pushes (14)
//   3. real build: the row's warn state matches the newest registered frame's age
//   4. fresh frame => row passes and reports count + age
//   5. no frames at all => row warns ('取景卡为空'), never silently green
//   6. unparseable frame time => row warns instead of pretending it is fresh
//   7. row hover title carries the newest frame's full local clock (year included)
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

// Pull one self-check row out of the rendered HTML by its visible name.
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

let pass = 0, fail = 0;
function chk(name, cond, detail) {
  if (cond) { pass++; console.log('  OK   ' + name); }
  else { fail++; console.log('  FAIL ' + name + (detail ? ' :: ' + detail : '')); }
}

const MINI = 'data:image/jpeg;base64,AAAA';
const hoursAgo = (h) => new Date(Date.now() - h * 3600000).toISOString().replace(/\.\d{3}Z$/, 'Z');
const frame = (o) => Object.assign({
  name: 'frame.png', rel: 'qa/frame.png', url: 'file:///D:/qa/frame.png',
  shot_utc: hoursAgo(1), size: 1000, data: MINI, w: 620, h: 349, bytes: 50000
}, o || {});
const shotsRun = (items, label) => runPanelHtml(withJson(realHtml, 'SHOTS', { items: items }), label);

// --- 1) compile ---
let compiled = true;
try { new vm.Script(src); } catch (e) { compiled = false; console.log('  compile error: ' + e.message); }
chk('compile.ok', compiled);

// --- 2) the row exists and the tally matches the template ---
const expectedChecks = (template.match(/selfcheck\.push\(/g) || []).length;
{
  const real = runPanelHtml(realHtml, 'real');
  const row = rowOf(real, '取景帧');
  chk('real.row-present', !!row, 'no 取景帧 row in self-check');
  const rows = (String(real.get('selfcheck').innerHTML || '').match(/<span class="nm">/g) || []).length;
  chk('real.rows=template', rows === expectedChecks, 'rows=' + rows + ' expected=' + expectedChecks);
  // Lower bound, not an exact count: this suite guards the 取景帧 row (main#43),
  // not the total. r708 added a 城市证据 row, so a fixed 14 would go red for
  // reasons unrelated to framing (r675 lesson: derive, never hardcode).
  chk('real.count>=14', expectedChecks >= 14, 'template self-check count=' + expectedChecks + ' (>=14 since main#43)');
  // r710: frames are refreshable on demand (CityRebuildR2.CaptureShots +
  // city3d-shots.ps1), so the row must follow the data on disk instead of being
  // pinned to "stale". Derive the newest registered frame's age from qa/ and
  // assert the row's warn state matches the 7-day threshold.
  const FAM = /^(city-|city3d-|smoke-|frame-|soak-)/i;
  const frames = fs.readdirSync('qa')
    .filter((n) => /\.(png|jpe?g)$/i.test(n) && FAM.test(n))
    .map((n) => ({ n, t: fs.statSync('qa/' + n).mtimeMs }))
    .sort((a, b) => b.t - a.t);
  const ageDays = frames.length ? (Date.now() - frames[0].t) / 86400000 : Infinity;
  const expectWarn = !(ageDays <= 7);
  chk('real.freshness-warn', !!row && row.warn === expectWarn,
    (row ? 'vd=' + row.vd : 'no row') + ' ageDays=' + ageDays.toFixed(2) +
    ' expect=' + expectWarn + ' newest=' + (frames[0] ? frames[0].n : 'none'));
  chk('real.freshness-text', !!row && /\d+ (分钟|小时|天)前/.test(row.vd),
    row ? 'vd=' + row.vd : 'no row');
}

// --- 4) fresh frames => pass with count + age ---
{
  const p = shotsRun([frame({ shot_utc: hoursAgo(1) }), frame({ name: 'b.png', shot_utc: hoursAgo(2) }),
    frame({ name: 'c.png', shot_utc: hoursAgo(3) })], 'fresh');
  const row = rowOf(p, '取景帧');
  chk('fresh.ok', !!row && row.ok, row ? 'vd=' + row.vd : 'no row');
  chk('fresh.count', !!row && row.vd.indexOf('3 帧') >= 0, row ? 'vd=' + row.vd : 'no row');
  chk('fresh.age', !!row && /最新 1(\.\d)? 小时/.test(row.vd), row ? 'vd=' + row.vd : 'no row');
  chk('fresh.inlined', !!row && row.vd.indexOf('内联 3') >= 0, row ? 'vd=' + row.vd : 'no row');
}

// --- 5) no frames => warn, never silently green ---
{
  const p = shotsRun([], 'empty');
  const row = rowOf(p, '取景帧');
  chk('empty.warn', !!row && row.warn, row ? 'row was green: ' + row.vd : 'no row');
  chk('empty.words', !!row && row.vd.indexOf('取景卡为空') >= 0, row ? 'vd=' + row.vd : 'no row');
}

// --- 6) unparseable time => warn ---
{
  const p = shotsRun([frame({ shot_utc: 'not-a-time' })], 'badtime');
  const row = rowOf(p, '取景帧');
  chk('badtime.warn', !!row && row.warn, row ? 'row was green: ' + row.vd : 'no row');
  chk('badtime.words', !!row && row.vd.indexOf('不可解析') >= 0, row ? 'vd=' + row.vd : 'no row');
}

// --- 7) hover title gives the newest frame's absolute local clock ---
{
  const p = shotsRun([frame({ shot_utc: '2026-10-11T00:21:33Z' }), frame({ name: 'b.png', shot_utc: hoursAgo(2) })], 'title');
  const row = rowOf(p, '取景帧');
  chk('title.absclock', !!row && /\d{4}-\d{2}-\d{2} \d{2}:\d{2}/.test(row.title),
    row ? 'title=' + row.title : 'no row');
  // Newest-first list: the title must be the FIRST frame's clock, not the tail's.
  chk('title.newest', !!row && row.title.indexOf('2026-10-11') >= 0, row ? 'title=' + row.title : 'no row');
  const badtime = rowOf(shotsRun([frame({ shot_utc: 'not-a-time' })], 'title-bad'), '取景帧');
  chk('title.absent-when-unknown', !!badtime && badtime.title === '', badtime ? 'title=' + badtime.title : 'no row');
}

console.log('RESULT pass=' + pass + ' fail=' + fail);
process.exit(fail === 0 ? 0 : 1);