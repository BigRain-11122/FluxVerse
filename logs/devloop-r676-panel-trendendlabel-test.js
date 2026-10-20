// r676 panel trend end-value label test (queue main#14).
// Stub DOM, run the inlined panel script from the real build plus patched
// TREND fixtures. Acceptance:
//   1. every non-flat series ends with a data-end label equal to its last value
//   2. flat series are NOT labelled twice (left axis only, no data-end)
//   3. end labels stay inside the 620x228 viewBox and right of the last point
//   4. a changed tail value moves the label to the new value (no stale text)
//   5. assertions are re-runnable from the committed script
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

function withTrend(html, arr) {
  const re = /const TREND = [^;]*;/;
  if (!re.test(html)) throw new Error('TREND literal not found');
  return html.replace(re, 'const TREND = ' + JSON.stringify(arr) + ';');
}

function trendData(html) {
  const m = html.match(/const TREND = (\[[\s\S]*?\]);/);
  if (!m) throw new Error('TREND literal not found');
  return JSON.parse(m[1]);
}

const KEYS = ['c', 'r', 'e'];
const FILL = { c: '#4cc9f0', r: '#ffb703', e: '#f72585' };

function endLabel(svg, key) {
  const re = new RegExp('<text class="te-lab" data-end="' + key + '" x="([\\d.]+)" y="([\\d.]+)" ' +
    'fill="' + FILL[key] + '">(\\d+)</text>');
  const m = svg.match(re);
  if (!m) return null;
  return { x: Number(m[1]), y: Number(m[2]), value: Number(m[3]) };
}

function lastPoint(svg, key) {
  const re = new RegExp('<polyline data-k="' + key + '"[^>]*points="([^"]+)"');
  const m = svg.match(re);
  if (!m) return null;
  const pairs = m[1].trim().split(' ');
  const last = pairs[pairs.length - 1].split(',');
  return { x: Number(last[0]), y: Number(last[1]) };
}

function vals(trend, key) {
  return trend.map(p => Number(p[key]) || 0);
}

// Left-axis numeric labels of one band. Geometry mirrors the template:
// TW=620 TH=228 TPL=62 TPR=44 TPT=10 TPB=26, 3 bands with 8px gaps.
const BAND_H = (228 - 10 - 26 - 16) / 3;
function axisLabels(svg, bandIndex) {
  const top = 10 + bandIndex * (BAND_H + 8);
  const re = /<text class="te-lab" x="56" y="([\d.]+)" text-anchor="end">(\d+)<\/text>/g;
  const out = [];
  let m;
  while ((m = re.exec(svg)) !== null) {
    const y = Number(m[1]);
    if (y > top - 1 && y < top + BAND_H + 1) out.push(Number(m[2]));
  }
  return out;
}

let pass = 0, fail = 0;
function chk(name, cond, detail) {
  if (cond) { pass++; console.log('PASS ' + name); }
  else { fail++; console.log('FAIL ' + name + ' :: ' + detail); }
}

const realHtml = fs.readFileSync('world-public/city-panel.html', 'utf8');
const data = trendData(realHtml);
const real = runPanelHtml(realHtml, 'real');
const svg = real.get('tr-chart').innerHTML;
chk('real.svg-present', svg.length > 0, 'len=' + svg.length);

// 1) every non-flat series carries an end label equal to its last value
let nonFlat = 0;
KEYS.forEach(k => {
  const v = vals(data, k);
  const flat = Math.min.apply(null, v) === Math.max.apply(null, v);
  const lab = endLabel(svg, k);
  const axis = axisLabels(svg, KEYS.indexOf(k));
  if (flat) {
    // 2) flat series: no duplicate end label, value already on the left axis
    chk(k + '.flat-no-end', lab === null, 'lab=' + JSON.stringify(lab));
    chk(k + '.flat-left-axis', axis.length === 1 && axis[0] === v[0],
      'axis=' + JSON.stringify(axis) + ' expect=[' + v[0] + ']');
  } else {
    nonFlat++;
    chk(k + '.end-present', lab !== null, 'no data-end label');
    chk(k + '.axis-minmax', axis.length === 2, 'axis=' + JSON.stringify(axis));
    if (!lab) return;
    chk(k + '.end-value', lab.value === v[v.length - 1], 'label=' + lab.value + ' last=' + v[v.length - 1]);
    const lp = lastPoint(svg, k);
    chk(k + '.end-right-of-last', !!lp && lab.x > lp.x, 'lab.x=' + lab.x + ' last.x=' + (lp && lp.x));
    chk(k + '.end-inside-viewbox', lab.x > 0 && lab.x <= 620, 'lab.x=' + lab.x);
  }
});
chk('real.nonflat-count', nonFlat >= 1, 'nonFlat=' + nonFlat);

// total data-end labels must equal the number of non-flat series
const endCount = (svg.match(/data-end="/g) || []).length;
chk('real.end-count', endCount === nonFlat, 'endCount=' + endCount + ' nonFlat=' + nonFlat);

// 4) tail value change must move the label text with it
const bumped = data.slice();
const lastRec = Object.assign({}, data[data.length - 1]);
lastRec.c = (Number(lastRec.c) || 0) + 5;
bumped[bumped.length - 1] = lastRec;
const bumpRun = runPanelHtml(withTrend(realHtml, bumped), 'fixture-bump-c');
const bumpLab = endLabel(bumpRun.get('tr-chart').innerHTML, 'c');
const expect = (Number(data[data.length - 1].c) || 0) + 5;
chk('bump.end-value', !!bumpLab && bumpLab.value === expect, 'lab=' + JSON.stringify(bumpLab) + ' expect=' + expect);

// 5) constant series -> no end label (fixture), other series unaffected
const flatTrend = data.map((p, i) => {
  const c = vals(data, 'c');
  return Object.assign({}, p, { c: c[0] });
});
const flatRun = runPanelHtml(withTrend(realHtml, flatTrend), 'fixture-flat-c');
const flatSvg = flatRun.get('tr-chart').innerHTML;
chk('flat.no-end-c', endLabel(flatSvg, 'c') === null, 'unexpected data-end for c');
chk('flat.other-series-kept', flatSvg.indexOf('data-end="r"') >= 0 || flatSvg.indexOf('data-end="e"') >= 0,
  'all end labels dropped');

console.log('RESULT pass=' + pass + ' fail=' + fail);
process.exit(fail ? 1 : 0);