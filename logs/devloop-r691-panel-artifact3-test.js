// r691 panel test: all three face lines (current activity / latest artifact /
// next milestone) render their own clickable paths (queue main#29).
// Acceptance:
//   1. real build -> every line that names files carries its own artlink(s)
//   2. per-line isolation -> the same token can be a live link on one line and
//      an honest "未找到" on another (no cross-line borrowing)
//   3. per-line miss -> only the affected line changes, the others keep links
//   4. a line without any path token stays plain text (no dead links)
//   5. self-check row reports the per-line breakdown
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

function artOf(html) {
  const m = html.match(/const ART = (\{[\s\S]*?\});\n/);
  if (!m) throw new Error('ART literal not found');
  return JSON.parse(m[1]);
}
function faceOf(html) {
  const m = html.match(/const FACE = (\{[\s\S]*?\});\n/);
  if (!m) throw new Error('FACE literal not found');
  return JSON.parse(m[1]);
}
function withArt(html, next) {
  return html.replace(/const ART = \{[\s\S]*?\};\n/, 'const ART = ' + JSON.stringify(next) + ';\n');
}
function rowByLabel(run, label) {
  const html = run.get('selfcheck').innerHTML;
  const parts = html.split('<div class="chk">').slice(1);
  const hit = parts.filter(p => p.indexOf('>' + label + '<') >= 0);
  if (!hit.length) return null;
  const p = hit[0];
  return { ok: p.indexOf('<span class="st ok">') >= 0, vd: p };
}
const links = (html) => (html.match(/<a class="artlink" href="file:\/\/\//g) || []).length;

let pass = 0, fail = 0;
function chk(name, cond, detail) {
  if (cond) { pass++; console.log('  OK   ' + name); }
  else { fail++; console.log('  FAIL ' + name + (detail ? ' :: ' + detail : '')); }
}

const realHtml = fs.readFileSync('world-public/city-panel.html', 'utf8');

// --- 1) real build: each line renders its own links ---
const real = runPanelHtml(realHtml, 'real');
const art = artOf(realHtml);
const face = faceOf(realHtml);
const by = art.by || {};
chk('art.has-by', !!art.by, 'ART.by missing (builder not rebuilt?)');
chk('art.by-keys', ['act', 'art', 'mile'].every(k => !!by[k]), 'keys=' + Object.keys(by).join(','));

const expectLinks = {
  'f-act': Number((by.act || {}).paths || 0),
  'f-art': Number((by.art || {}).paths || 0),
  'f-mile': Number((by.mile || {}).paths || 0)
};
Object.keys(expectLinks).forEach(id => {
  const n = links(real.get(id).innerHTML);
  chk('real.' + id + '.links>0', expectLinks[id] > 0 && n > 0,
    'paths=' + expectLinks[id] + ' links=' + n + ' html=' + real.get(id).innerHTML.slice(0, 120));
  chk('real.' + id + '.links=paths', n === expectLinks[id], 'paths=' + expectLinks[id] + ' links=' + n);
});

// --- 2) per-line isolation: same token, different verdicts per line ---
// Rebuild a synthetic face where the SAME filename sits on two lines, but the
// activity line calls it missing and the milestone line honours the real hit.
const tok = (by.art && by.art.items && by.art.items[0] && by.art.items[0].text) || 'world-public/city-panel.html';
const iso = JSON.parse(JSON.stringify(art));
iso.by.act.items = [{ text: tok, rel: tok, exists: false, url: '', k: 'act' }];
iso.by.act.paths = 1;
iso.by.act.missing = 1;
iso.by.act.miss_names = [tok];
iso.by.mile.items = [{ text: tok, rel: tok, exists: true, url: 'file:///C:/tmp/x', k: 'mile' }];
iso.by.mile.paths = 1;
iso.by.mile.missing = 0;
iso.by.mile.miss_names = [];
iso.by.art.items = [];
iso.by.art.paths = 0;
iso.by.art.missing = 0;
iso.by.art.miss_names = [];
iso.items = iso.by.act.items.concat(iso.by.mile.items);
iso.paths = 2;
iso.missing = 1;
iso.miss_names = [tok];
const isoHtml = withArt(realHtml, iso)
  .replace(/(const FACE = \{[\s\S]*?\});\n/, 'const FACE = ' + JSON.stringify({
    current_activity: '当前 ' + tok + ' 完', artifact: '无路径行', milestone: '里程碑 ' + tok + ' 起',
    artifact_utc: face.artifact_utc, updated_utc: face.updated_utc
  }) + ';\n');
const isoRun = runPanelHtml(isoHtml, 'isolation');
chk('iso.act.miss', isoRun.get('f-act').innerHTML.indexOf('<em>未找到</em>') >= 0,
  'act=' + isoRun.get('f-act').innerHTML.slice(0, 160));
chk('iso.act.no-link', links(isoRun.get('f-act').innerHTML) === 0, 'act wrongly linked');
chk('iso.mile.link', links(isoRun.get('f-mile').innerHTML) === 1, 'mile=' + isoRun.get('f-mile').innerHTML.slice(0, 160));
chk('iso.mile.no-miss', isoRun.get('f-mile').innerHTML.indexOf('未找到') < 0, 'mile wrongly marked');

// --- 3) a miss on one line does not disturb the other two ---
const oneMiss = JSON.parse(JSON.stringify(art));
const victim = oneMiss.by.art.items[0];
victim.exists = false;
victim.url = '';
oneMiss.by.art.missing = Number(oneMiss.by.art.missing || 0) + 1;
oneMiss.by.art.miss_names = (oneMiss.by.art.miss_names || []).concat([victim.rel]);
oneMiss.missing = Number(oneMiss.missing || 0) + 1;
oneMiss.miss_names = (oneMiss.miss_names || []).concat([victim.rel]);
const missRun = runPanelHtml(withArt(realHtml, oneMiss), 'one-miss');
chk('miss.art.marked', missRun.get('f-art').innerHTML.indexOf('<em>未找到</em>') >= 0, 'art not marked');
chk('miss.act.clean', missRun.get('f-act').innerHTML.indexOf('<em>未找到</em>') < 0, 'act polluted');
chk('miss.mile.clean', missRun.get('f-mile').innerHTML.indexOf('<em>未找到</em>') < 0, 'mile polluted');
chk('miss.act.links-kept', links(missRun.get('f-act').innerHTML) === expectLinks['f-act'],
  'act links=' + links(missRun.get('f-act').innerHTML));

// --- 4) line without tokens stays plain text ---
const noPath = withArt(realHtml, art).replace(/(const FACE = \{[\s\S]*?\});\n/,
  'const FACE = ' + JSON.stringify({
    current_activity: '无路径行 A', artifact: '无路径行 B', milestone: '无路径行 C',
    artifact_utc: face.artifact_utc, updated_utc: face.updated_utc
  }) + ';\n');
const npRun = runPanelHtml(noPath, 'no-path');
const plainOk = (el, want) => links(el.innerHTML) === 0 &&
  el.innerHTML.indexOf('未找到') < 0 && el.innerHTML.indexOf(want) >= 0;
chk('np.act.plain', plainOk(npRun.get('f-act'), '无路径行 A'), 'html=' + npRun.get('f-act').innerHTML);
chk('np.mile.plain', plainOk(npRun.get('f-mile'), '无路径行 C'), 'html=' + npRun.get('f-mile').innerHTML);

// --- 5) self-check reports the per-line breakdown ---
const row = rowByLabel(real, '实况路径');
chk('sc.row', !!row, 'no 实况路径 row');
chk('sc.breakdown', !!row && row.vd.indexOf('当前活') >= 0 && row.vd.indexOf('最近实物') >= 0 &&
  row.vd.indexOf('里程碑') >= 0, 'vd=' + (row && row.vd));

console.log('RESULT pass=' + pass + ' fail=' + fail);
process.exit(fail ? 1 : 0);