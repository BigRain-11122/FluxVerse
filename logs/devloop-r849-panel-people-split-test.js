// r849 panel sandbox (main#147): the reality-anchor card prints two population
// counts from two different sources - the AI resident cards under
// ./docs/residents/ (residents probe) and the street seats published from the
// City scene roster with behaviour from the BigLife census snapshot. They are
// not supposed to match, but the page never said so: "5 名居民" next to a street
// count of 32 read like a contradiction.
//
// This round: the street row stops calling its seats "residents", and one
// sentence names the difference - but only when BOTH numbers are real and
// unequal.
//
// Acceptance:
//   1. street row words its count as seats, not residents
//   2. both real and different -> the sentence appears and names both counts
//   3. an unknown side (missing resident reading / missing street reading) ->
//      no sentence at all (unknown is not a difference)
//   4. equal counts -> no sentence
//   5. a zero/absent street total -> no sentence, never "0 个席位"
//   6. the sentence never invents numbers and prints no NaN/undefined/null
//   7. anti-drift: template ships the function and wires it to the hint element
'use strict';
const fs = require('fs');
const vm = require('vm');

const realHtml = fs.readFileSync('world-public/city-panel.html', 'utf8');
const template = fs.readFileSync('Tools/devloop/city-panel-template.html', 'utf8');

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

function withConsts(html, residents, street) {
  let out = html;
  const reR = /const RESIDENTS = [^\n]*;\n/;
  const reS = /const STREET = [^\n]*;\n/;
  if (!reR.test(out)) throw new Error('cannot locate const RESIDENTS');
  if (!reS.test(out)) throw new Error('cannot locate const STREET');
  out = out.replace(reR, () => 'const RESIDENTS = ' + JSON.stringify(residents) + ';\n');
  out = out.replace(reS, () => 'const STREET = ' + JSON.stringify(street) + ';\n');
  return out;
}

function render(residents, street, label) {
  const run = runPanelHtml(withConsts(realHtml, residents, street), label);
  return {
    hint: String(run.get('r-people-hint').textContent),
    streetLine: String(run.get('r-street').textContent),
    residentsLine: String(run.get('r-residents').textContent)
  };
}

const FIVE = { model: 'qwen3:4b-instruct', model_known: true, model_present: true, residents_n: 5, speakers_n: 5, never_n: 0, stale_n: 0, last_say_age_h: 0 };
const THIRTYTWO = { total: 32, visible: 1, nodata: 0, seats_n: 32, states: [{ name: 'work', count: 21 }, { name: 'home', count: 5 }] };

// ---------- 1) the street row no longer says "residents" ----------
console.log('--- wording ---');
const live = render(FIVE, THIRTYTWO, 'live');
check('1 street row words the count as seats', live.streetLine.indexOf('32 个街面席位在册') >= 0, live.streetLine);
check('1 street row never calls the seats residents', live.streetLine.indexOf('名居民在册') < 0, live.streetLine);

// ---------- 2) both real and different ----------
console.log('--- both real, different ---');
check('2 hint appears when both sides are real and unequal', live.hint.length > 0, live.hint);
check('2 hint names the resident count', live.hint.indexOf('5 名 AI 居民') >= 0, live.hint);
check('2 hint names the seat count', live.hint.indexOf('32 个街面席位') >= 0, live.hint);
check('2 hint names both sources', live.hint.indexOf('BigLife') >= 0 && live.hint.indexOf('居民卡') >= 0, live.hint);

// ---------- 3) an unknown side is not a difference ----------
console.log('--- unknowns ---');
const noResidents = render(null, THIRTYTWO, 'no-residents');
check('3 missing resident reading -> no hint', noResidents.hint === '', noResidents.hint);
const noStreet = render(FIVE, null, 'no-street');
check('3 missing street reading -> no hint', noStreet.hint === '', noStreet.hint);
const legacyResidents = render({ model: 'x' }, THIRTYTWO, 'legacy-residents');
check('3 resident reading without residents_n -> no hint', legacyResidents.hint === '', legacyResidents.hint);
const dirtyStreet = render(FIVE, { total: 'abc', states: [] }, 'dirty-street');
check('3 unparseable seat total -> no hint', dirtyStreet.hint === '', dirtyStreet.hint);

// ---------- 3b) zero seats is "unknown", not a difference ----------
const zeroSeats = render(FIVE, { total: 0, visible: 0, nodata: 0, seats_n: 0, states: [] }, 'zero-seats');
check('3b zero seat total -> no hint', zeroSeats.hint === '', zeroSeats.hint);
check('3b zero seat total never prints "0 个"', zeroSeats.hint.indexOf('0 个') < 0, zeroSeats.hint);

// ---------- 4) equal counts need no explanation ----------
console.log('--- equal ---');
const equal = render({ model: 'x', residents_n: 32 }, { total: 32, states: [] }, 'equal');
check('4 equal counts -> no hint', equal.hint === '', equal.hint);

// ---------- 6) no invented numbers ----------
console.log('--- hygiene ---');
const all = [live.hint, noResidents.hint, noStreet.hint, equal.hint, zeroSeats.hint].join(' | ');
check('6 no NaN/undefined/null in any hint', (all.match(/NaN|undefined|null/g) || []).length === 0, all);
const dirtyLive = (live.hint.match(/NaN|undefined|null/g) || []).length;
check('6 live hint is clean', dirtyLive === 0, live.hint);

// ---------- 7) anti-drift ----------
console.log('--- wiring ---');
check('7 template ships the split hint function', template.indexOf('function peopleSplitHint(') >= 0);
check('7 template has the hint element', template.indexOf('id="r-people-hint"') >= 0);
check('7 template renders into the hint element', template.indexOf("$('r-people-hint')") >= 0);
check('7 template calls the function with both readings',
  template.indexOf('peopleSplitHint(RESIDENTS, STREET)') >= 0);

console.log('');
console.log('RESULT: pass=' + pass + ' fail=' + fail);
process.exit(fail > 0 ? 1 : 0);