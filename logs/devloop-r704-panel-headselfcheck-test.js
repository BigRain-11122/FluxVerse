// r704 panel test: self-check verdict rises to the page header (queue main#44).
// r703 pushed the framing card's health into the self-check block, but the
// self-check itself still sits at the page tail: the header showed only
// "快照 N 分钟前", so a reader had to scroll to the bottom to learn the page
// had a warning. Acceptance:
//   1. template + real build compile (vm.Script)
//   2. header carries the badge, and it is inert in markup (no pre-baked green)
//   3. real build: badge count == number of warn rows, class warn, names in title
//   4. all-green fixture: badge reads 自检通过 / class ok / "N 项全部通过"
//   5. clicking the badge scrolls to the self-check card
//   6. missing badge element does not break the render (old builds stay alive)
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

// Stub DOM: elements remember listeners so the click wiring is testable, and
// scrollIntoView records its calls instead of touching a layout engine.
function runPanel(html, label, opts) {
  opts = opts || {};
  const els = {};
  const scrolled = [];
  const makeEl = (id) => ({
    id: id, textContent: '', innerHTML: '', className: '', style: {}, title: '',
    children: [], listeners: {},
    appendChild(c) { this.children.push(c); },
    addEventListener(n, fn) { (this.listeners[n] = this.listeners[n] || []).push(fn); },
    scrollIntoView(a) { scrolled.push({ id: id, arg: a }); }
  });
  const document = {
    getElementById(id) {
      if (opts.dropId && id === opts.dropId) return null;
      return els[id] || (els[id] = makeEl(id));
    },
    createElement() { return makeEl('span'); },
    querySelectorAll() { return []; }
  };
  const sandbox = { document, console, Date, Math, Object, Array, String, Number, isNaN, setTimeout };
  vm.runInNewContext(scriptOf(html, label), sandbox, { filename: label, timeout: 5000 });
  return {
    get: (id) => (els[id] || makeEl(id)),
    has: (id) => !!els[id],
    scrolled,
    click(id) { (this.get(id).listeners.click || []).forEach(function (fn) { fn(); }); }
  };
}

// Inject every template placeholder with synthetic JSON so a fully healthy page
// can be rendered without touching the network or a real snapshot.
function injectAll(obj) {
  let html = template;
  Object.keys(obj).forEach(k => {
    const ph = '__' + k + '_JSON__';
    if (html.indexOf(ph) < 0) throw new Error('missing placeholder ' + ph);
    html = html.split(ph).join(JSON.stringify(obj[k]));
  });
  return html;
}

const nowIso = (h) => new Date(Date.now() - h * 3600000).toISOString().replace(/\.\d{3}Z$/, 'Z');
// Local yyyyMMdd of "today" for the archive-duty fixture: the page derives its
// own "today" from the clock at render time, so a hard-coded stamp would start
// claiming "not run today" the moment the date rolls over.
function YMD(sep) {
  const d = new Date();
  const p2 = (n) => (n < 10 ? '0' + n : String(n));
  return sep ? (d.getFullYear() + '-' + p2(d.getMonth() + 1) + '-' + p2(d.getDate()))
    : ('' + d.getFullYear() + p2(d.getMonth() + 1) + p2(d.getDate()));
}
const TS = nowIso(0.05);
const T1 = nowIso(0.1);
const T2 = nowIso(0.3);

const GREEN = {
  SNAPSHOT: {
    protocol: 'fluxverse-public', ts_utc: TS,
    reality_public: { phase: 'night' },
    city: { commits_total: 10, renders_total: 5, games_active: 1, fleet_online: 2 },
    zones: [{ id: 'gaming' }, { id: 'quant' }],
    events_tail: [
      { ts_utc: T2, type: 'COMMIT', zone: 'quant' },
      { ts_utc: T1, type: 'HEARTBEAT', zone: 'gaming' }
    ]
  },
  FACE: { updated_utc: nowIso(1), act: '本轮测试', art: 'x.png qa/x.png', mile: 'm' },
  ART: {
    paths: 3, missing: 0,
    by: {
      act: { paths: 1, items: [{ text: 'x.png', exists: true, rel: 'qa/x.png', url: 'file:///D:/qa/x.png', size: 10, mtime_utc: T1 }] },
      art: { paths: 1, items: [{ text: 'y.png', exists: true, rel: 'qa/y.png', url: 'file:///D:/qa/y.png', size: 10, mtime_utc: T1 }] },
      mile: { paths: 1, items: [{ text: 'z.md', exists: true, rel: 'docs/z.md', url: 'file:///D:/docs/z.md', size: 10, mtime_utc: T1 }] },
      tick: { paths: 1, items: [{ text: 'tick.log', exists: true, rel: 'logs/tick.log', url: 'file:///D:/logs/tick.log', size: 10, mtime_utc: T1 }] }
    }
  },
  BUILT: '2026-10-28 10:30:00',
  BUILTISO: nowIso(0.01),
  PREV: null,
  HIST: { n: 2, max: 288, first_utc: T2 },
  SERIES: [{ ts: TS, c: 10, r: 5, g: 1, f: 2, e: 2 }],
  TREND: [{ ts: T2, c: 9, r: 4, e: 1 }, { ts: TS, c: 10, r: 5, e: 2 }],
  TICK: { exists: true, read_ok: true, age_min: 3, scan_lines: 12, rounds: 2, file: 'tick.log' },
  SHOTS: { items: [{ name: 'f.png', rel: 'qa/f.png', url: 'file:///D:/qa/f.png', shot_utc: nowIso(1), size: 1000, data: 'data:image/jpeg;base64,AAAA', w: 620, h: 349, bytes: 50000 }] },
  // r708 added the 城市证据 self-check row, which reads PROOF. A healthy page
  // needs healthy proof numbers, otherwise the "green page" fixtures would warn.
  PROOF: {
    build: { exists: true, exit_code: 0, ts_utc: nowIso(400), wall_s: 23, shots_present: 5, shots_expected: 5, rel: 'City3D-staging/r2-ignite.done', url: 'file:///D:/f/r2-ignite.done', report_rel: 'City3D-staging/r2-report.md', report_url: 'file:///D:/f/r2-report.md' },
    soak: { exists: true, fps_avg: 608.5, errors: 0, exceptions: 0, ts_utc: nowIso(41), rel: 'qa/smoke-r680-bm-a-soak.json', url: 'file:///D:/f/soak.json' },
    code: { exists: true, sha: '5a7ae301', ts_utc: nowIso(41) },
    // r717 (main#57): the 街区落位 self-check row reads PROOF.site; a green-page
    // fixture must carry a dry reading or every "all green" case would warn for
    // the right reason (the city is dry here by fixture, not by wish).
    site: {
      ran: true, block_water: 0.0, block_water_text: '0.0', dry_candidates: 12,
      nearest_dry_m: 0, nearest_dry_text: '0', verdict: 'DRY', over_water: false, reason: ''
    }
  },
  // r709 added the duty card ("what did the group order us to do"). A healthy
  // page has a readable decision face and nothing pending.
  DUTY: {
    exists: true, path_rel: 'docs/decisions.md', url: 'file:///D:/g/docs/decisions.md',
    as_of_utc: nowIso(1), scanned: 12, matched: 0, open: 0, late: 0, rows: []
  },
  // r719/r720 added the maintenance row (log-archive duty stamp, queue main#59).
  // A healthy page archived today with nothing left to archive.
  ARCH: {
    exists: true, path_rel: 'logs/.archive-duty-last-run.txt', url: 'file:///D:/l/stamp.txt',
    stamp: YMD(), stamp_day: YMD('-'), today: YMD(), is_today: true, remain: 0, ran_utc: nowIso(1)
  }
};

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

// --- 2) markup: badge present, and inert before the script computes ---
chk('template.badge-el', /<button class="badge sc" id="sc-head" type="button">/.test(template),
  'header badge not found in template');
chk('template.badge-inert', /id="sc-head"[^>]*>自检 —</.test(template),
  'badge must not ship a pre-baked verdict text');
chk('template.card-anchor', /id="selfcheck-card"/.test(template), 'self-check card has no scroll anchor');

// --- 3) real build: count matches warn rows, names in title ---
{
  const run = runPanel(realHtml, 'real');
  const hb = run.get('sc-head');
  const rows = String(run.get('selfcheck').innerHTML || '').split('<div class="chk">').slice(1);
  const warnRows = rows.filter(c => c.indexOf('<span class="st warn">') >= 0);
  const warnNames = warnRows.map(c => (c.match(/<span class="nm">([^<]*)<\/span>/) || [, ''])[1]);
  chk('real.badge-rendered', !!hb.textContent && hb.textContent !== '自检 —', 'text=' + JSON.stringify(hb.textContent));
  const m = /^自检 (\d+) 项注意$/.exec(hb.textContent || '');
  if (warnRows.length) {
    chk('real.warn-shape', !!m, 'text=' + JSON.stringify(hb.textContent));
    chk('real.warn-count', !!m && Number(m[1]) === warnRows.length,
      'badge=' + (m && m[1]) + ' rows=' + warnRows.length);
    chk('real.warn-class', /(^|\s)warn(\s|$)/.test(hb.className), 'class=' + JSON.stringify(hb.className));
    const missing = warnNames.filter(n => (hb.title || '').indexOf(n) < 0);
    chk('real.warn-names', missing.length === 0, 'title=' + JSON.stringify(hb.title) + ' missing=' + missing.join(','));
  } else {
    chk('real.green-text', hb.textContent === '自检通过', 'text=' + JSON.stringify(hb.textContent));
    chk('real.green-class', /(^|\s)ok(\s|$)/.test(hb.className), 'class=' + JSON.stringify(hb.className));
  }
  chk('real.title-hint', (hb.title || '').indexOf('点击跳到数据自检') > 0, 'title=' + JSON.stringify(hb.title));
  chk('real.sc-sum-unchanged', /^\d+ (项注意|项通过)$/.test(run.get('sc-sum').textContent || ''),
    'sc-sum=' + JSON.stringify(run.get('sc-sum').textContent));
}

// --- 4) all-green fixture ---
{
  const greenHtml = injectAll(GREEN);
  let compiled = true;
  try { new vm.Script(scriptOf(greenHtml, 'green')); } catch (e) { compiled = false; console.log('  green compile: ' + e.message); }
  chk('green.compile', compiled);
  const run = runPanel(greenHtml, 'green');
  const hb = run.get('sc-head');
  const rows = String(run.get('selfcheck').innerHTML || '').split('<div class="chk">').slice(1);
  const warnRows = rows.filter(c => c.indexOf('<span class="st warn">') >= 0);
  const names = warnRows.map(c => (c.match(/<span class="nm">([^<]*)<\/span>/) || [, ''])[1]);
  chk('green.no-warn-rows', warnRows.length === 0, 'unexpected warn: ' + names.join(','));
  chk('green.text', hb.textContent === '自检通过', 'text=' + JSON.stringify(hb.textContent));
  chk('green.class', /(^|\s)ok(\s|$)/.test(hb.className), 'class=' + JSON.stringify(hb.className));
  chk('green.all-passed-title', /^\d+ 项全部通过 · 点击跳到数据自检$/.test(hb.title || ''),
    'title=' + JSON.stringify(hb.title));
  chk('green.no-warn-class', !/(^|\s)warn(\s|$)/.test(hb.className), 'class=' + JSON.stringify(hb.className));
}

// --- 5) click wiring scrolls to the self-check card ---
{
  const greenHtml = injectAll(GREEN);
  const run = runPanel(greenHtml, 'click');
  run.click('sc-head');
  const hit = run.scrolled.filter(s => s.id === 'selfcheck-card');
  chk('click.scrolls', hit.length === 1, 'scroll calls=' + JSON.stringify(run.scrolled));
  chk('click.smooth', !!hit.length && hit[0].arg && hit[0].arg.behavior === 'smooth',
    'arg=' + JSON.stringify(hit[0] && hit[0].arg));
}

// --- 6) badge element absent => render survives (older pages / stub DOM) ---
{
  const greenHtml = injectAll(GREEN);
  let err = '';
  let run = null;
  try { run = runPanel(greenHtml, 'nohead', { dropId: 'sc-head' }); } catch (e) { err = e.message; }
  chk('nohead.no-crash', !err, err);
  chk('nohead.still-checks', !!run && (String(run.get('selfcheck').innerHTML || '').match(/<span class="nm">/g) || []).length > 0);
}

console.log('RESULT pass=' + pass + ' fail=' + fail);
process.exit(fail === 0 ? 0 : 1);