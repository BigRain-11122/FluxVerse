// r848 panel sandbox: the page can say what the city is doing right now.
//
// The world state has carried one seat per resident for a while (state /
// visible / no-data, produced by the BigLife behavior side). The page only ever
// printed how many residents EXIST, so reading the CEO page felt like a roster
// rather than a living city. The builder normalises `street_behavior` and the
// page only words those numbers.
//
// Acceptance:
//   1. a missing reading says so; it never prints "0 residents"
//   2. a real reading prints the total, the visible count and every state
//   3. an unknown state name is printed verbatim (never folded into "other")
//   4. no-data count is printed only when it is > 0
//   5. an empty seat list is "no residents on the seats", not "0 residents"
//   6. the page keeps the payload order (the builder sorts, the page does not)
//   7. anti-drift: template ships the constant, builder prints the machine line
'use strict';
const fs = require('fs');
const vm = require('vm');

const realHtml = fs.readFileSync('world-public/city-panel.html', 'utf8');
const template = fs.readFileSync('Tools/devloop/city-panel-template.html', 'utf8');
const builder = fs.readFileSync('Tools/devloop/build-city-panel.ps1', 'utf8');

let pass = 0;
let fail = 0;
function check(name, ok, detail) {
  if (ok) { pass++; console.log('ok   ' + name); }
  else { fail++; console.log('FAIL ' + name + (detail ? ' :: ' + detail : '')); }
}

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

function withStreet(html, obj) {
  const re = /const STREET = [\s\S]*?;\n/;
  if (!re.test(html)) throw new Error('cannot locate const STREET');
  return html.replace(re, () => 'const STREET = ' + JSON.stringify(obj) + ';\n');
}

function streetLine(obj, label) {
  const run = runPanelHtml(withStreet(realHtml, obj), label);
  return String(run.get('r-street').textContent);
}

const live = {
  total: 32, visible: 1, nodata: 0, seats_n: 32,
  states: [
    { name: 'work', count: 21, visible: 0 },
    { name: 'home', count: 5, visible: 0 },
    { name: 'charge', count: 2, visible: 0 },
    { name: 'slump', count: 2, visible: 0 },
    { name: 'leisure_park', count: 1, visible: 1 },
    { name: 'school', count: 1, visible: 0 }
  ]
};

// ---------- 1) missing reading ----------
console.log('--- missing ---');
const noneLine = streetLine(null, 'null-street');
check('1 null reading says not-recorded', noneLine.indexOf('未记录') >= 0, noneLine);
check('1 null reading never says zero residents', noneLine.indexOf('0 名') < 0, noneLine);
const dirtyNone = (noneLine.match(/NaN|undefined|null/g) || []).length;
check('1 null reading prints no NaN/undefined/null', dirtyNone === 0, noneLine);

// ---------- 2) a real reading ----------
console.log('--- live ---');
const liveLine = streetLine(live, 'live-street');
// r849 (main#147): the seats are no longer worded as "residents", because the
// same card already counts AI resident cards; two populations must not read as
// one contradictory number.
check('2 total is printed', liveLine.indexOf('32 个街面席位在册') >= 0, liveLine);
check('2 visible count is printed', liveLine.indexOf('街上可见 1') >= 0, liveLine);
check('2 work count is translated', liveLine.indexOf('工作 21') >= 0, liveLine);
check('2 home count is translated', liveLine.indexOf('在家 5') >= 0, liveLine);
check('2 leisure state is translated', liveLine.indexOf('公园散步 1') >= 0, liveLine);
check('2 school state is translated', liveLine.indexOf('上学 1') >= 0, liveLine);
check('2 no zero-valued no-data segment', liveLine.indexOf('无读数') < 0, liveLine);
const dirtyLive = (liveLine.match(/NaN|undefined|null/g) || []).length;
check('2 live line prints no NaN/undefined/null', dirtyLive === 0, liveLine);

// ---------- 3) an unknown state is never swallowed ----------
console.log('--- unknown state ---');
const oddLine = streetLine({
  total: 4, visible: 2, nodata: 1, seats_n: 4,
  states: [{ name: 'work', count: 1 }, { name: 'hologram', count: 2 }, { name: 'unknown', count: 1 }]
}, 'unknown-state');
check('3 unknown state name is printed verbatim', oddLine.indexOf('hologram 2') >= 0, oddLine);
check('3 unknown state is not folded into "other"', oddLine.toLowerCase().indexOf('other') < 0, oddLine);
check('3 placeholder state maps to its words', oddLine.indexOf('状态未知 1') >= 0, oddLine);
check('3 no-data count is printed when > 0', oddLine.indexOf('无读数 1') >= 0, oddLine);

// ---------- 5) empty seats ----------
console.log('--- empty ---');
const emptyLine = streetLine({ total: 0, visible: 0, nodata: 0, seats_n: 0, states: [] }, 'empty-street');
check('5 empty seat list says so', emptyLine.indexOf('街面席位上没有居民') >= 0, emptyLine);
check('5 empty seat list never says zero residents', emptyLine.indexOf('0 名') < 0, emptyLine);

// ---------- 6) order is the builder's, not the page's ----------
console.log('--- order ---');
const revLine = streetLine({
  total: 6, visible: 0, nodata: 0, seats_n: 6,
  states: [{ name: 'school', count: 5 }, { name: 'work', count: 1 }]
}, 'order');
check('6 page keeps the given order', revLine.indexOf('上学 5 · 工作 1') >= 0, revLine);
check('6 page does not re-sort by count', revLine.indexOf('工作 1 · 上学 5') < 0, revLine);

// ---------- 7) anti-drift ----------
console.log('--- wiring ---');
check('7 template ships the street constant', template.indexOf('const STREET = __STREET_JSON__;') >= 0);
check('7 template renders into the street row', template.indexOf("$('r-street')") >= 0);
check('7 builder prints the street machine line', builder.indexOf('PANEL STREET:') >= 0);
check('7 builder reads street_behavior', builder.indexOf("PSObject.Properties['street_behavior']") >= 0);
check('7 builder declares the reading optional', builder.indexOf("-Label 'street_behavior' -Optional") >= 0);
check('7 builder sorts count desc then name asc',
  builder.indexOf('Expression = { [int]$_.count }; Descending = $true') >= 0 &&
  builder.indexOf('Expression = { [string]$_.name }; Descending = $false') >= 0);
check('7 placeholder is registered in the residual list', builder.indexOf("'__STREET_JSON__'") >= 0);

console.log('');
console.log('RESULT: pass=' + pass + ' fail=' + fail);
process.exit(fail > 0 ? 1 : 0);