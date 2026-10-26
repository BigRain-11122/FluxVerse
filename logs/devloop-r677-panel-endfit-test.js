// r677 panel trend end-label fit test (queue main#15).
// Stub DOM, run the inlined panel script from the real build plus patched
// TREND fixtures. Acceptance (queue main#15 judge-three):
//   1. 6- and 7-digit end values stay fully inside the 620x228 viewBox
//   2. 3-digit end values keep the previous geometry (right padding 44px)
//   3. baseline build keeps the empirical 44px padding (max 5 digits today)
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
const VIEW_W = 620;

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

// Right padding actually used by the template = viewBox width - last point x.
function rightPad(svg, key) {
  const lp = lastPoint(svg, key);
  return lp === null ? null : VIEW_W - lp.x;
}

// 10px label, digits are <= 6.2px wide in every bundled font -> safe upper bound.
function labelWidth(digits) { return digits * 6.2; }

let pass = 0, fail = 0;
function chk(name, cond, detail) {
  if (cond) { pass++; console.log('PASS ' + name); }
  else { fail++; console.log('FAIL ' + name + ' :: ' + detail); }
}

const realHtml = fs.readFileSync('world-public/city-panel.html', 'utf8');
const data = trendData(realHtml);

// --- baseline: today's build keeps the empirical padding (max 5 digits) ---
const real = runPanelHtml(realHtml, 'real');
const realSvg = real.get('tr-chart').innerHTML;
const maxDigits = KEYS.reduce((acc, k) => {
  const v = data.map(p => Number(p[k]) || 0);
  if (Math.min.apply(null, v) === Math.max.apply(null, v)) return acc;
  return Math.max(acc, String(v[v.length - 1]).length);
}, 0);
chk('baseline.max-digits', maxDigits <= 5, 'maxDigits=' + maxDigits);
KEYS.forEach(k => {
  const pad = rightPad(realSvg, k);
  chk(k + '.baseline-pad-44', pad === 44, 'pad=' + pad);
});

// --- criterion 1: 6- and 7-digit end values stay inside the viewBox ---
function fixtureWithLast(key, value) {
  const arr = data.map(p => Object.assign({}, p));
  const v0 = Number(arr[0][key]) || 0;
  arr[arr.length - 1][key] = value;
  // keep the series non-flat even when the fixture happens to match v0
  if (v0 === value) arr[0][key] = value - 1;
  return arr;
}

[[6, 123456, 51], [7, 1234567, 58]].forEach(([digits, value, expectPad]) => {
  const tag = digits + 'd';
  const html = withTrend(realHtml, fixtureWithLast('c', value));
  const svg = runPanelHtml(html, 'fixture-' + tag).get('tr-chart').innerHTML;
  const pad = rightPad(svg, 'c');
  chk(tag + '.pad-grown', pad === expectPad, 'pad=' + pad + ' expect=' + expectPad);
  const lab = endLabel(svg, 'c');
  chk(tag + '.label-present', lab !== null, 'no data-end label');
  if (!lab) return;
  chk(tag + '.label-value', lab.value === value, 'label=' + lab.value + ' expect=' + value);
  chk(tag + '.label-right-of-last', lab.x > (lastPoint(svg, 'c') || {}).x, 'lab.x=' + lab.x);
  const right = lab.x + labelWidth(digits);
  chk(tag + '.label-inside-viewbox', right <= VIEW_W, 'right=' + right.toFixed(1) + ' view=' + VIEW_W);
  chk(tag + '.label-gap', Math.abs(lab.x - (VIEW_W - pad + 5)) < 0.01, 'lab.x=' + lab.x);
});

// --- criterion 2: 3-digit end values keep the previous geometry ---
[['c', 123], ['r', 456]].forEach(([key, value]) => {
  const arr = fixtureWithLast(key, value);
  const html = withTrend(realHtml, arr);
  const svg = runPanelHtml(html, 'fixture-3d-' + key).get('tr-chart').innerHTML;
  const pad = rightPad(svg, key);
  chk('3d-' + key + '.pad-44', pad === 44, 'pad=' + pad);
  const lp = lastPoint(svg, key);
  chk('3d-' + key + '.last-x-576', lp !== null && lp.x === 576, 'last.x=' + (lp && lp.x));
  const lab = endLabel(svg, key);
  chk('3d-' + key + '.label-x-581', lab !== null && lab.x === 581, 'lab=' + JSON.stringify(lab));
  chk('3d-' + key + '.label-value', lab !== null && lab.value === value, 'lab=' + (lab && lab.value));
});

// --- flat-only trend: no end labels, padding back to the empirical 44 ---
const flatAll = data.map(p => Object.assign({}, p, { c: 7, r: 7, e: 7 }));
const flatSvg = runPanelHtml(withTrend(realHtml, flatAll), 'fixture-flat-all').get('tr-chart').innerHTML;
chk('flatall.no-end', (flatSvg.match(/data-end="/g) || []).length === 0, 'unexpected data-end');
chk('flatall.pad-44', rightPad(flatSvg, 'c') === 44, 'pad=' + rightPad(flatSvg, 'c'));

// --- bottom axis keeps ending at the plot right edge (padding applies to it) ---
const realAxis = /<text class="te-lab" x="([\d.]+)" y="220" text-anchor="end">/.exec(realSvg);
chk('baseline.axis-end-576', !!realAxis && Number(realAxis[1]) === 576,
  'axis.x=' + (realAxis && realAxis[1]));
const sevenSvg = runPanelHtml(withTrend(realHtml, fixtureWithLast('c', 1234567)), 'fixture-axis')
  .get('tr-chart').innerHTML;
const sevenAxis = /<text class="te-lab" x="([\d.]+)" y="220" text-anchor="end">/.exec(sevenSvg);
chk('7d.axis-end-562', !!sevenAxis && Number(sevenAxis[1]) === 562,
  'axis.x=' + (sevenAxis && sevenAxis[1]));

console.log('RESULT pass=' + pass + ' fail=' + fail);
process.exit(fail ? 1 : 0);