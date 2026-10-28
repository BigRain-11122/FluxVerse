// r702 panel test: the panel gets a CITY FRAMING card (queue main#42).
// Until now every card was numbers and prose -- scale, zones, events, curves --
// and there was no way to see what the city looks like from this page. The
// builder now hands over the newest City3D evidence frames from qa/, downscaled
// and inlined as JPEG data URIs (page stays self-contained). Acceptance:
//   1. build compiles (vm.Script)
//   2. real build: >=1 frame inlined as data URI
//   3. real build: summary reads "N / N 帧", every frame has a name link + age tag
//   4. no frames at all => honest empty state, hint says there are none
//   5. frame whose encode failed (data='') => falls back to a link, summary warns
//   6. fresh frame => age tag is plain; >7 days old => warn tag (stale is a fact)
//   7. age wording: <1h minutes / <48h hours / >=48h days
//   8. every frame carries an aria-label with the full local clock (year included)
//   9. a file name with markup is escaped (no HTML injection through qa/ names)
'use strict';
const fs = require('fs');
const vm = require('vm');

const realHtml = fs.readFileSync('world-public/city-panel.html', 'utf8');
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

// --- 2) real build has an inlined frame and 3) complete captions ---
{
  const p = runPanelHtml(realHtml, 'real');
  const box = p.get('shots');
  const html = String(box.innerHTML || '');
  const imgs = (html.match(/data:image\/jpeg;base64,/g) || []).length;
  chk('real.inlined', imgs >= 1, 'no data URI in framing card');
  chk('real.img.tag', /<img src="data:image\/jpeg;base64,[^"]+" alt="[^"]*"/.test(html));
  chk('real.sum', /^\d+ \/ \d+ 帧$/.test(String(p.get('shot-sum').textContent || '')),
    'summary=' + p.get('shot-sum').textContent);
  chk('real.link', /<a href="file:\/\/\//.test(html), 'frame name is not a clickable original');
  chk('real.tag', /<span class="tag[^"]*"[^>]*>[^<]*(分钟|小时|天)前<\/span>/.test(html));
  // The page must never photograph itself: r702 first build shipped an OLD
  // panel screenshot (r665-city-panel-v4.png) as the newest "city view".
  chk('real.nopanel', !/[A-Za-z0-9_-]*panel[A-Za-z0-9_-]*\.png/.test(html),
    'panel self-screenshot leaked into the framing card');
  chk('real.stalehint', String(p.get('shot-hint').textContent).indexOf('天前') >= 0 ||
    String(p.get('shot-hint').textContent).indexOf('最新一帧') < 0,
    'hint=' + p.get('shot-hint').textContent);
}

// --- 4) no frames => honest empty state ---
{
  const p = shotsRun([], 'empty');
  const html = String(p.get('shots').innerHTML || '');
  chk('empty.state', html.indexOf('暂无取景帧') >= 0, html.slice(0, 120));
  chk('empty.noimg', html.indexOf('<img') < 0);
  chk('empty.sum', String(p.get('shot-sum').textContent) === '暂无',
    'summary=' + p.get('shot-sum').textContent);
  chk('empty.hint', String(p.get('shot-hint').textContent).indexOf('还没有') >= 0,
    'hint=' + p.get('shot-hint').textContent);
}

// --- 5) encode failure => link fallback, summary warns, never a broken <img> ---
{
  const p = shotsRun([frame({ data: '', w: 0, h: 0, bytes: 0 })], 'noenc');
  const html = String(p.get('shots').innerHTML || '');
  chk('noenc.noimg', html.indexOf('<img') < 0, 'shipped an <img> without data');
  chk('noenc.fallback', html.indexOf('缩图不可用') >= 0);
  chk('noenc.link', /<a href="file:\/\/\/D:\/qa\/frame\.png"/.test(html));
  chk('noenc.warn', /\btag warn\b/.test(String(p.get('shot-sum').className)),
    'className=' + p.get('shot-sum').className);
  chk('noenc.sum', String(p.get('shot-sum').textContent) === '0 / 1 帧',
    'summary=' + p.get('shot-sum').textContent);
}

// --- 6) staleness + 7) age wording ---
{
  const fresh = shotsRun([frame({ shot_utc: hoursAgo(0.2) })], 'fresh');
  const fhtml = String(fresh.get('shots').innerHTML || '');
  chk('age.fresh.minutes', fhtml.indexOf('分钟前') >= 0);
  chk('age.fresh.plain', !/\btag warn\b/.test(fhtml), 'a 12-minute-old frame was flagged stale');

  const hoursOld = shotsRun([frame({ shot_utc: hoursAgo(20) })], 'hours');
  chk('age.hours', String(hoursOld.get('shots').innerHTML).indexOf('小时前') >= 0);

  const stale = shotsRun([frame({ shot_utc: hoursAgo(24 * 17) })], 'stale');
  const shtml = String(stale.get('shots').innerHTML || '');
  chk('age.stale.days', shtml.indexOf('17 天前') >= 0, shtml.slice(0, 200));
  chk('age.stale.warn', /\btag warn\b/.test(shtml), 'stale frame not flagged warn');
  chk('age.stale.hint', String(stale.get('shot-hint').textContent).indexOf('17 天前') >= 0,
    'hint=' + stale.get('shot-hint').textContent);
  chk('age.stale.sumwarn', /\btag warn\b/.test(String(stale.get('shot-sum').className)),
    'summary badge stayed green while every frame is 17 days old');

  const unknown = shotsRun([frame({ shot_utc: 'not-a-time' })], 'unknown');
  chk('age.unknown', String(unknown.get('shots').innerHTML).indexOf('时间未知') >= 0);
}

// --- 8) aria clock + 9) escaping ---
{
  const p = shotsRun([frame({ shot_utc: '2026-10-11T00:21:33Z', name: 'a<b>"c".png' })], 'aria');
  const html = String(p.get('shots').innerHTML || '');
  chk('aria.fullclock', /aria-label="\d{4}-\d{2}-\d{2} \d{2}:\d{2}"/.test(html),
    'no year-complete local clock on the frame age tag');
  chk('esc.name', html.indexOf('a&lt;b&gt;&quot;c&quot;.png') >= 0, 'frame name not escaped');
  chk('esc.no.raw', html.indexOf('a<b>') < 0);
}

console.log('RESULT pass=' + pass + ' fail=' + fail);
process.exit(fail === 0 ? 0 : 1);