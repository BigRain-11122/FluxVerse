// r705 panel test: the panel has to survive a phone width (queue main#45).
// r704 left the layout desktop-only: fixed min-widths on the zone name, the
// delta label and the event type pushed the zone tag past the card edge, and
// .scroller clipped it, so readers saw "gami…"/"gove…" instead of the zone.
// The CSS side is verified by Tools/devloop/narrow-shot.js (real CDP viewport);
// this suite pins the structural part a DOM shim can prove:
//   1. template + real build compile (vm.Script)
//   2. a narrow-screen media query exists and releases every fixed width
//   3. those three widths live in classes (inline style would beat the query)
//   4. rendered rows carry the classes and no inline min-width
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
function styleOf(html) {
  const m = html.match(/<style>([\s\S]*?)<\/style>/);
  if (!m) throw new Error('no inline style block');
  return m[1];
}

function runPanel(html, label) {
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
  vm.runInNewContext(scriptOf(html, label), sandbox, { filename: label, timeout: 5000 });
  return { get: (id) => els[id] || makeEl('missing-' + id) };
}

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
// Local yyyyMMdd "today" for the archive-duty fixture: the page derives today
// from the clock at render time, so a hard-coded stamp would claim "not run
// today" as soon as the date rolls over and skew this layout measurement.
function YMD(sep) {
  const d = new Date();
  const p2 = (n) => (n < 10 ? '0' + n : String(n));
  return sep ? (d.getFullYear() + '-' + p2(d.getMonth() + 1) + '-' + p2(d.getDate()))
    : ('' + d.getFullYear() + p2(d.getMonth() + 1) + p2(d.getDate()));
}
const TS = nowIso(0.05);
const FIXTURE = {
  SNAPSHOT: {
    protocol: 'fluxverse-public', ts_utc: TS,
    reality_public: { phase: 'night' },
    city: { commits_total: 10, renders_total: 5, games_active: 1, fleet_online: 2 },
    zones: [{ id: 'gaming', name: 'FLUX Gaming', status: 'active', activity: 1 }],
    events_tail: [{ ts_utc: TS, type: 'GAME_STAGE', zone: 'governance' }]
  },
  FACE: { updated_utc: nowIso(1), act: '本轮测试', art: 'x.png qa/x.png', mile: 'm' },
  ART: {
    paths: 0, missing: 0,
    by: { act: { paths: 0, items: [] }, art: { paths: 0, items: [] }, mile: { paths: 0, items: [] }, tick: { paths: 0, items: [] } }
  },
  BUILT: '2026-10-28 10:30:00',
  BUILTISO: nowIso(0.01),
  PREV: null,
  HIST: { n: 1, max: 288, first_utc: TS },
  SERIES: [{ ts: TS, c: 10, r: 5, g: 1, f: 2, e: 1 }],
  TREND: [{ ts: TS, c: 10, r: 5, e: 1 }],
  TICK: { exists: true, read_ok: true, age_min: 3, scan_lines: 12, rounds: 2, file: 'tick.log' },
  SHOTS: { items: [] },
  // r708 added the 城市证据 self-check row (reads PROOF); feed it healthy
  // numbers so this layout suite keeps testing layout, not proof freshness.
  PROOF: {
    build: { exists: true, exit_code: 0, ts_utc: nowIso(400), wall_s: 23, shots_present: 5, shots_expected: 5, rel: 'City3D-staging/r2-ignite.done', url: 'file:///D:/f/r2-ignite.done', report_rel: '', report_url: '' },
    soak: { exists: true, fps_avg: 608.5, errors: 0, exceptions: 0, ts_utc: nowIso(41), rel: 'qa/smoke-r680-bm-a-soak.json', url: 'file:///D:/f/soak.json' },
    code: { exists: true, sha: '5a7ae301', ts_utc: nowIso(41) }
  },
  // r709 added the duty card; this suite measures layout, so keep it calm.
  DUTY: {
    exists: true, path_rel: 'docs/decisions.md', url: 'file:///D:/g/docs/decisions.md',
    as_of_utc: nowIso(1), scanned: 12, matched: 0, open: 0, late: 0, rows: []
  },
  // r720 added the maintenance row (log-archive duty stamp, queue main#59);
  // a calm fixture = archived today, nothing left over.
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
[['template', template], ['real', realHtml]].forEach(([k, html]) => {
  let ok = true, msg = '';
  try { new vm.Script(scriptOf(html, k)); } catch (e) { ok = false; msg = e.message; }
  chk('compile.' + k, ok, msg);
});

// --- 2) media query releases every fixed width ---
const css = styleOf(template);
chk('css.media-query', /@media\s*\(max-width:\s*520px\)/.test(css), 'no phone-width media query');
chk('css.pad-shrinks', /@media[^{]*\{\s*[\s\S]*?\.wrap\{padding:16px 12px/.test(css), 'wrap padding not reduced on narrow');
chk('css.time-col-unpinned', /\.t\{min-width:0\}/.test(css), '.t stays pinned on narrow');
chk('css.rows-unpinned', /\.zname,\.rowline \.nm,\.evtype\{min-width:0\}/.test(css), 'row widths stay pinned on narrow');
chk('css.rows-wrap', /\.rowline\{flex-wrap:wrap/.test(css), 'rows cannot wrap on narrow');
chk('css.check-value-own-line', /\.chk \.vd\{flex:1 1 100%\}/.test(css), 'self-check value still squeezes beside the name');

// --- 3) widths are classes, not inline styles (inline beats the query) ---
const script = scriptOf(template, 'template');
['120px', '130px', '104px'].forEach(w => {
  chk('script.no-inline-' + w, script.indexOf('style="min-width:' + w) < 0,
    'inline min-width:' + w + ' in row markup defeats the media query');
});
chk('css.class-zname', /\.zname\{min-width:120px\}/.test(css), 'zone name has no base class width');
chk('css.class-rowline-nm', /\.rowline \.nm\{min-width:104px/.test(css), 'delta label has no base class width');
chk('css.class-evtype', /\.evtype\{min-width:130px\}/.test(css), 'event type has no base class width');

// --- 4) rendered rows use the classes and carry no inline width ---
{
  const run = runPanel(injectAll(FIXTURE), 'fixture');
  const zones = String(run.get('zones').innerHTML || '');
  const events = String(run.get('events').innerHTML || '');
  const chg = String(run.get('chg').innerHTML || '');

  chk('render.zone-class', zones.indexOf('<span class="zname">') >= 0, zones.slice(0, 120));
  chk('render.event-type-class', events.indexOf('<span class="evtype">') >= 0, events.slice(0, 160));
  chk('render.delta-class', chg.indexOf('<span class="nm">') >= 0, chg.slice(0, 160));
  [['zones', zones], ['events', events], ['chg', chg]].forEach(([k, html]) => {
    chk('render.no-inline-width.' + k, html.indexOf('min-width') < 0,
      'inline width came back in ' + k);
  });
  chk('render.zone-tag-kept', zones.indexOf('<span class="tag">active</span>') >= 0, 'zone tag lost');
  chk('render.event-tag-kept', events.indexOf('<span class="tag">governance</span>') >= 0, 'zone tag lost');
}

console.log('RESULT pass=' + pass + ' fail=' + fail);
process.exit(fail === 0 ? 0 : 1);