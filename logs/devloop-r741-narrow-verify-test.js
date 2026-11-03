// r741 narrow-shot verify test: a narrow measurement must be proven before it
// earns an OK badge (queue main#51).
//
// Two faces are pinned here:
//   1. the judge itself - the four ways a reading can lie (viewport width not
//      applied / two height readings disagree / obviously-short page / garbage)
//      plus the cases that must stay green (tolerance, a genuinely short page
//      with few rows).
//   2. the wiring in narrow-shot.js - the judge is actually consulted, retries
//      are bounded at 3, the default debug port no longer collides between
//      concurrent instances, and no png is written before the gate passes.
'use strict';
const fs = require('fs');

const { judge } = require('../Tools/devloop/narrow-shot-verify.js');
const src = fs.readFileSync('Tools/devloop/narrow-shot.js', 'utf8');

let pass = 0, fail = 0;
function chk(name, cond, detail) {
  if (cond) { pass++; console.log('  OK   ' + name); }
  else { fail++; console.log('  FAIL ' + name + (detail ? ' :: ' + detail : '')); }
}

const GOOD = { width: 390, clientW: 390, domH: 6679, contentH: 6679, rowCount: 60 };

function j(over) { return judge(Object.assign({}, GOOD, over)); }

// --- 1) healthy readings ---
{
  const r = j({});
  chk('judge.healthy', r.ok === true, JSON.stringify(r));
  chk('judge.healthy-diff-zero', r.diff === 0, 'diff=' + r.diff);
}
chk('judge.width-off-by-one-tolerated', j({ clientW: 391 }).ok === true, 'rounding should not fail a shot');
chk('judge.within-two-percent', j({ domH: 6679, contentH: 6700 }).ok === true, 'sub-2% disagreement is normal');
chk('judge.short-page-few-rows-ok', j({ contentH: 700, domH: 700, rowCount: 5 }).ok === true,
  'a genuinely short page with few rows must still pass');
chk('judge.strings-accepted', j({ clientW: '390', contentH: '6679', domH: '6679', rowCount: '60' }).ok === true,
  'numeric strings from JSON payloads should parse');

// --- 2) the four lies ---
{
  const r = j({ clientW: 1400, domH: 4539, contentH: 4539, rowCount: 60 });
  chk('judge.width-mismatch', r.ok === false && r.reason === 'width-mismatch', JSON.stringify(r));
}
{
  // the r709/r725 signature: first-screen height reported for a long document
  const r = j({ domH: 844, contentH: 6679 });
  chk('judge.height-disagree', r.ok === false && r.reason === 'height-disagree', JSON.stringify(r));
}
{
  const r = j({ domH: 700, contentH: 700 });
  chk('judge.height-too-short', r.ok === false && r.reason === 'height-too-short', JSON.stringify(r));
}
{
  const r = j({ domH: 6679, contentH: 6820 });
  chk('judge.just-over-two-percent', r.ok === false && r.reason === 'height-disagree', JSON.stringify(r));
}
chk('judge.width-missing', j({ clientW: undefined }).reason === 'width-missing', 'missing clientW must not pass');
chk('judge.height-missing', j({ contentH: undefined }).reason === 'height-missing', 'missing contentH must not pass');
chk('judge.rowcount-null-tolerated', j({ contentH: 700, domH: 700, rowCount: undefined }).reason === 'rows-missing',
  'unknown row count under the short threshold must fail closed');
chk('judge.rowcount-null-fine-when-tall', j({ rowCount: undefined }).ok === true,
  'row count is irrelevant once the page is clearly long');

// --- 2b) r807: rows and height must agree with each other, not just with 800 ---
// Live evidence 2026-11-04: right after a rebuild, narrow-shot read
// `domH=844 contentH=844 rows=89` and printed VERDICT: OK (the next run read
// 7064px). 844 clears the absolute 800 floor, so the old rule had nothing to say.
{
  const r = j({ domH: 844, contentH: 844, rowCount: 89 });
  chk('judge.rows-implied-short', r.ok === false && r.reason === 'rows-implied-short', JSON.stringify(r));
}
chk('judge.rows-implied-real-page-ok', j({ domH: 7064, contentH: 7064, rowCount: 89 }).ok === true,
  'the real full page must keep passing');
chk('judge.rows-implied-exact-floor-ok', j({ domH: 240, contentH: 240, rowCount: 20 }).ok === true,
  'rowCount == minRows is not "many rows" and must not be failed by the implied floor');
chk('judge.rows-implied-boundary', j({ domH: 1080, contentH: 1080, rowCount: 90 }).ok === true &&
  j({ domH: 1079, contentH: 1079, rowCount: 90 }).ok === false,
  '90 rows at 12px/row: 1080 passes, 1079 does not');
chk('judge.rows-implied-ignores-null-rows', j({ domH: 900, contentH: 900, rowCount: undefined }).ok === true,
  'an uncountable row count must not invent a floor (that is rows-missing territory)');

// --- 2c) r807: an unrendered frame must not earn the badge ---
// Second live observation the same round: right after a rebuild the frame read
// `domH=844 contentH=844 rows=0` (the next run read 7064px / 89 rows). Zero rows
// is a slow start, not a short page, and 844 cleared the 800 floor.
{
  const r = j({ domH: 844, contentH: 844, rowCount: 0 });
  chk('judge.rows-zero', r.ok === false && r.reason === 'rows-zero', JSON.stringify(r));
}
chk('judge.rows-zero-even-when-tall', j({ domH: 7064, contentH: 7064, rowCount: 0 }).reason === 'rows-zero',
  'a tall frame with zero body rows is still unrendered');

// --- 2d) wiring: wait for the body to have rows before measuring (r807) ---
chk('wiring.settle-poll', /payload\.rowCount > 0\) break/.test(src),
  'narrow-shot must poll until the body has rows before measuring');

// --- 3) wiring in narrow-shot.js ---
chk('wiring.require-judge', /require\('\.\/narrow-shot-verify'\)/.test(src), 'judge not imported');
chk('wiring.retries-capped', /MAX_ATTEMPTS\s*=\s*3/.test(src), 'retry count is not pinned at 3');
chk('wiring.short-verdict', src.indexOf("NARROW VERDICT: SHORT") >= 0, 'no SHORT verdict line');
chk('wiring.row-count-measured', /rowCount:\s*document\.querySelectorAll/.test(src), 'row count not measured');
chk('wiring.port-per-process', /String\(9300 \+ \(process\.pid % 400\)\)/.test(src),
  'default debug port still collides between concurrent instances');
chk('wiring.no-9337-default', !/'9337'/.test(src), 'hardcoded 9337 default came back');
{
  // the png write must sit after the gate, otherwise a suspect frame lands on
  // disk anyway and the next reader trusts the stale file. r742 moved the write
  // to `<out>.part-<pid>` (atomic replace / IHDR readback, queue main#80/81),
  // so the anchor follows the part file and the intent is unchanged.
  const gateAt = src.indexOf("NARROW VERDICT: SHORT");
  const writeAt = src.indexOf('fs.writeFileSync(part');
  chk('wiring.gate-before-write', gateAt > -1 && writeAt > gateAt,
    'png write at ' + writeAt + ' vs gate at ' + gateAt);
}
chk('wiring.skip-note', /png=skipped/.test(src), 'no note that the old png was left in place');

console.log('RESULT pass=' + pass + ' fail=' + fail);
process.exit(fail === 0 ? 0 : 1);