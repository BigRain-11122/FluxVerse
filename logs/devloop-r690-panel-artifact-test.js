// r690 panel self-check item 13 "artifact paths" test (queue main#28).
// Stub DOM, run the inlined panel script from the real build plus patched ART
// fixtures. Acceptance:
//   1. real build -> the face artifact line renders clickable file:// links and
//      the 实况路径 row passes (paths all hit the disk)
//   2. a missing file -> the row goes 注意 and the text carries 未找到 (no link)
//   3. no path at all -> the row goes 注意 (the promise "clickable" is unmet)
//   4. row count follows the template (old suites must not go red on the new row)
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

let pass = 0, fail = 0;
function chk(name, cond, detail) {
  if (cond) { pass++; console.log('  OK   ' + name); }
  else { fail++; console.log('  FAIL ' + name + (detail ? ' :: ' + detail : '')); }
}

const realHtml = fs.readFileSync('world-public/city-panel.html', 'utf8');
const tpl = fs.readFileSync('Tools/devloop/city-panel-template.html', 'utf8');
const expectedChecks = (tpl.match(/selfcheck\.push\(/g) || []).length;

// --- 1) real build: clickable links + row passes ---
const real = runPanelHtml(realHtml, 'real');
const realRow = rowByLabel(real, '实况路径');
const artHtml = real.get('f-art').innerHTML;
chk('real.row-present', realRow !== null, 'no 实况路径 row');
chk('real.pass', !!realRow && realRow.ok === true, 'vd=' + JSON.stringify(realRow && realRow.vd));
chk('real.links', /<a class="artlink" href="file:\/\/\//.test(artHtml), 'html=' + artHtml.slice(0, 200));
chk('real.no-miss', artHtml.indexOf('未找到') < 0, 'html=' + artHtml.slice(0, 200));
chk('real.md5-hit', !!realRow && realRow.vd.indexOf('全部命中盘面') >= 0,
  'vd=' + (realRow && realRow.vd));

// --- 2) one missing file -> 注意 + 未找到 (and that token is not a link) ---
const art = artOf(realHtml);
chk('fixture.has-items', Array.isArray(art.items) && art.items.length > 0, 'no items to patch');
const broken = JSON.parse(JSON.stringify(art));
const victim = broken.items[0];
victim.exists = false;
victim.url = '';
broken.missing = 1;
broken.miss_names = [victim.rel];
// r691 shape: the page renders per-line sets (ART.by[k].items), so a fixture
// that only breaks the aggregate list no longer reaches the DOM. Mirror the
// same miss into every per-line item with the same rel.
if (broken.by) {
  Object.keys(broken.by).forEach(k => {
    const set = broken.by[k] || {};
    (set.items || []).forEach(it => {
      if (it.rel === victim.rel) { it.exists = false; it.url = ''; }
    });
    if ((set.items || []).some(it => it.rel === victim.rel)) {
      set.missing = Number(set.missing || 0) + 1;
      set.miss_names = (set.miss_names || []).concat([victim.rel]);
    }
  });
}
const miss = runPanelHtml(withArt(realHtml, broken), 'fixture-missing');
const missRow = rowByLabel(miss, '实况路径');
const missHtml = miss.get('f-art').innerHTML;
chk('miss.warn', !!missRow && missRow.ok === false, 'vd=' + JSON.stringify(missRow && missRow.vd));
chk('miss.verdict', !!missRow && missRow.vd.indexOf('未找到') >= 0, 'vd=' + (missRow && missRow.vd));
chk('miss.marked', missHtml.indexOf('<em>未找到</em>') >= 0, 'html=' + missHtml.slice(0, 200));
chk('miss.not-linked', missHtml.indexOf('>' + victim.text + '</a>') < 0, 'victim still linked');
chk('miss.sum-warn', /^\d+ 项注意$/.test(miss.get('sc-sum').textContent),
  'sum=' + miss.get('sc-sum').textContent);

// --- 3) no path tokens at all -> 注意, plain text fallback (no 死链) ---
const empty = { paths: 0, missing: 0, miss_names: [], items: [] };
const none = runPanelHtml(withArt(realHtml, empty), 'fixture-empty');
const noneRow = rowByLabel(none, '实况路径');
chk('none.warn', !!noneRow && noneRow.ok === false, 'vd=' + JSON.stringify(noneRow && noneRow.vd));
chk('none.verdict', !!noneRow && noneRow.vd.indexOf('未含可核路径') >= 0, 'vd=' + (noneRow && noneRow.vd));
chk('none.plain', none.get('f-art').innerHTML === '' && none.get('f-art').textContent.length > 0,
  'html=' + none.get('f-art').innerHTML.slice(0, 80));

// --- 4) row count follows the template ---
const rowCount = (real.get('selfcheck').innerHTML.match(/<span class="nm">/g) || []).length;
chk('real.rows=template', rowCount === expectedChecks,
  'rows=' + rowCount + ' expected=' + expectedChecks);

console.log('RESULT pass=' + pass + ' fail=' + fail);
process.exit(fail ? 1 : 0);