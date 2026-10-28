// r695 panel test: every relative age ("N minutes ago") that has an absolute
// timestamp behind it now carries a hover title with the local clock time plus
// the ISO stamp (queue main#34). A relative age is frozen at build time; a panel
// opened hours later reads wrong unless the reader can recover the real moment.
// Acceptance:
//   1. build compiles (vm.Script, not a regex/clip check)
//   2. real build: badge / artifact-row tag / render counter / selfcheck rows
//      ("snapshot age", "face freshness") all carry a title with their ISO stamp
//   3. titles carry a local-clock form and never "Invalid"/"NaN"
//   4. visible text is unchanged - the title text never leaks into textContent
//   5. unparseable/missing stamps -> no title at all (no invented data)
//   6. rows/tags without a timestamp get no title attribute
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

function boot(name, html) {
  const m = html.match(new RegExp('const ' + name + ' = (\\{[\\s\\S]*?\\});\\n'));
  if (!m) return null;
  try { return JSON.parse(m[1]); } catch (e) { return null; }
}
function withBoot(name, html, obj) {
  const re = new RegExp('const ' + name + ' = \\{[\\s\\S]*?\\};\\n');
  return html.replace(re, () => 'const ' + name + ' = ' + JSON.stringify(obj) + ';\n');
}
const tagOf = (run, id) => (run.get(id).children || []).filter(c => c.className === 'tag');
// one selfcheck row block by its label
function scRow(html, nm) {
  const rows = String(html).split('<div class="chk">');
  return rows.filter(r => r.indexOf('>' + nm + '<') >= 0)[0] || '';
}

let pass = 0, fail = 0;
function chk(name, cond, detail) {
  if (cond) { pass++; console.log('  OK   ' + name); }
  else { fail++; console.log('  FAIL ' + name + (detail ? ' :: ' + detail : '')); }
}
const CLOCK = /\d{4}-\d{2}-\d{2} \d{2}:\d{2}/;

const SNAP = boot('SNAP', realHtml) || {};
const FACE = boot('FACE', realHtml) || {};
const city = SNAP.city || {};

// --- 1) compile ---
let compiled = true;
try { new vm.Script(src); } catch (e) { compiled = false; console.log('  compile error: ' + e.message); }
chk('compile.ok', compiled);

// --- 2) real build: hover titles on every relative age that has a stamp ---
const real = runPanelHtml(realHtml, 'real');
const badge = real.get('age');
chk('real.badge.title-iso', !!SNAP.ts_utc && String(badge.title).indexOf(SNAP.ts_utc) >= 0,
  'title=' + badge.title);
chk('real.badge.title-clock', CLOCK.test(String(badge.title)), 'title=' + badge.title);

const artTags = tagOf(real, 'f-art');
const artTtl = artTags.length ? String(artTags[0].title) : '';
chk('real.artifact-row.tag', artTags.length === 1, 'tags=' + artTags.length);
chk('real.artifact-row.title-iso',
  !!FACE.artifact_utc && artTtl.indexOf(String(FACE.artifact_utc)) >= 0, 'title=' + artTtl);

const rendTtl = String(real.get('c-renders').title);
chk('real.renders.title-iso',
  !!city.last_render_utc && rendTtl.indexOf(String(city.last_render_utc)) >= 0, 'title=' + rendTtl);

const scHtml = String(real.get('selfcheck').innerHTML);
const rowSnap = scRow(scHtml, '快照龄');
const rowFace = scRow(scHtml, '面部新鲜度');
chk('real.selfcheck.snapshot-age.title',
  !!SNAP.ts_utc && rowSnap.indexOf('title="') >= 0 && rowSnap.indexOf(String(SNAP.ts_utc)) >= 0,
  'row=' + rowSnap);
chk('real.selfcheck.face-fresh.title',
  !!FACE.updated_utc && rowFace.indexOf('title="') >= 0 && rowFace.indexOf(String(FACE.updated_utc)) >= 0,
  'row=' + rowFace);

// --- 3) no fake values anywhere in a title ---
const allTitles = [badge.title, artTtl, rendTtl, String(badge.title)]
  .concat(scHtml.split('title="').slice(1).map(s => s.split('"')[0]));
const badTitles = allTitles.filter(t => /Invalid|NaN|undefined|null/.test(String(t)));
chk('titles.no-invalid', badTitles.length === 0, 'bad=' + JSON.stringify(badTitles.slice(0, 3)));

// --- 4) visible text unchanged (title text must not leak into the label) ---
chk('badge.text-clean',
  String(badge.textContent).indexOf('（') < 0 && String(badge.textContent).indexOf(SNAP.ts_utc || '@@') < 0,
  'txt=' + badge.textContent);
chk('renders.text-clean', String(real.get('c-renders').textContent).indexOf(city.last_render_utc || '@@') < 0,
  'txt=' + real.get('c-renders').textContent);

// --- 5) unparseable / missing stamps -> no title (no invented data) ---
// Row-based (not a fixed title count): only these rows are fed a timestamp by
// the builder, so any OTHER row showing a title is inventing data. Counting
// titles broke every time a self-check row was added (r703, r708); the r675
// lesson says derive instead of hardcoding.
const TITLED_ROWS = ['快照龄', '面部新鲜度', '取景帧', '城市证据', '应办令'];
function titledRows(html) {
  return String(html).split('<div class="chk">').slice(1).map(c => ({
    nm: (c.match(/<span class="nm">([\s\S]*?)<\/span>/) || [, ''])[1],
    has: c.indexOf('title="') >= 0
  })).filter(r => r.nm);
}
function extraTitles(html) {
  return titledRows(html).filter(r => r.has && TITLED_ROWS.indexOf(r.nm) < 0).map(r => r.nm);
}
const noSnap = runPanelHtml(withBoot('SNAP', realHtml, Object.assign({}, SNAP, {
  ts_utc: 'not-a-stamp',
  city: Object.assign({}, city, { last_render_utc: '' })
})), 'no-stamp');
chk('nodata.badge.no-title', !noSnap.get('age').title, 'title=' + noSnap.get('age').title);
chk('nodata.renders.no-title', !noSnap.get('c-renders').title, 'title=' + noSnap.get('c-renders').title);
// r703 added the 取景帧 row (SHOTS-driven) and r708 the 城市证据 row (PROOF-driven):
// both carry titles from builder data, not from the snapshot/face, so a build with
// no snapshot stamp can still show those rows hoverable. Assert by row identity.
chk('nodata.selfcheck.no-extra-titles', extraTitles(noSnap.get('selfcheck').innerHTML).length === 0,
  'extra=' + JSON.stringify(extraTitles(noSnap.get('selfcheck').innerHTML)));

const noFace = runPanelHtml(withBoot('FACE', realHtml, Object.assign({}, FACE, {
  updated_utc: ''
})), 'no-face-stamp');
chk('noface.row-no-title', scRow(String(noFace.get('selfcheck').innerHTML), '面部新鲜度').indexOf('title="') < 0,
  'row=' + scRow(String(noFace.get('selfcheck').innerHTML), '面部新鲜度'));

// --- 6) rows without a timestamp get no title attribute ---
chk('real.selfcheck.only-known-titles', extraTitles(scHtml).length === 0,
  'extra=' + JSON.stringify(extraTitles(scHtml)));
{
  const named = titledRows(scHtml).filter(r => r.has).map(r => r.nm);
  const want = ['快照龄', '面部新鲜度', '取景帧', '城市证据'];
  chk('real.selfcheck.titled-present', want.every(n => named.indexOf(n) >= 0),
    'titled=' + JSON.stringify(named));
}
chk('real.act-row.no-tag', tagOf(real, 'f-act').length === 0, 'tags=' + tagOf(real, 'f-act').length);
chk('real.mile-row.no-tag', tagOf(real, 'f-mile').length === 0, 'tags=' + tagOf(real, 'f-mile').length);

console.log('RESULT pass=' + pass + ' fail=' + fail);
process.exit(fail ? 1 : 0);