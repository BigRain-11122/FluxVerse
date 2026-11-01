// r745 panel test: the queue-overdue row (queue main#83).
// Why: main#8 and main#23 sat overdue 13 and 5 days because deadlines lived only
// in prose. The builder now ships QUEUE from the rows' own `due=YYYY-MM-DD`
// markers; this suite pins what the PAGE does with it.
// Method: take the REAL built page (already compiled and gated) and swap only
// the one-line `const QUEUE = ...;` for a fixture, so every other row stays as
// shipped - no placeholder enumeration to drift when a later round adds data.
// Cases:
//   1. late rows  -> warn tag, "逾期 N 件", worst id + days, queue size
//   2. no late    -> ok tag, "无逾期", still reports queue size
//   3. unreadable -> warn tag, "队列不可读" (never a comfortable zero)
//   4. empty obj  -> same as unreadable, and the script never throws
//   5. element missing -> render survives (old builds stay alive)
'use strict';
const fs = require('fs');
const vm = require('vm');

const realHtml = fs.readFileSync('world-public/city-panel.html', 'utf8');

function scriptOf(html, label) {
  const m = html.match(/<script>([\s\S]*?)<\/script>/);
  if (!m) throw new Error('no inline script in ' + label);
  return m[1];
}

// Swap ONLY the QUEUE constant; the rest of the page is the real build.
function withQueue(obj) {
  const line = 'const QUEUE = ' + JSON.stringify(obj) + ';';
  const rx = /const QUEUE = .*?;\r?\n/;
  if (!rx.test(realHtml)) throw new Error('QUEUE constant not found in the built page');
  return realHtml.replace(rx, line + '\n');
}

function runPanel(html, label, opts) {
  opts = opts || {};
  const els = {};
  const makeEl = (id) => ({
    id: id, textContent: '', innerHTML: '', className: '', style: {}, title: '',
    children: [],
    appendChild(c) { this.children.push(c); },
    addEventListener() {},
    scrollIntoView() {}
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
  return (id) => els[id] || makeEl(id);
}

let pass = 0, fail = 0;
function chk(name, cond, detail) {
  if (cond) { pass++; console.log('  OK   ' + name); }
  else { fail++; console.log('  FAIL ' + name + (detail ? ' :: ' + detail : '')); }
}

// --- 1) late ---------------------------------------------------------------
const late = {
  exists: true, dir_rel: 'state/queue', files: 2, scanned: 20, open: 9, dated: 3, late: 2,
  max_days: 14, max_id: '3', as_of: '2026-11-01',
  items: [{ id: '3', file: 'main.md', due: '2026-10-18', days: 14 },
          { id: '23', file: 'main.md', due: '2026-10-27', days: 5 }]
};
const g1 = runPanel(withQueue(late), 'late');
const e1 = g1('f-queue');
chk('late.warn-class', e1.innerHTML.indexOf('class="tag warn"') >= 0, e1.innerHTML);
chk('late.count', e1.innerHTML.indexOf('逾期 2 件') >= 0, e1.innerHTML);
chk('late.worst', e1.innerHTML.indexOf('最久 14 天（#3）') >= 0, e1.innerHTML);
chk('late.queue-size', e1.innerHTML.indexOf('在队 9 件（带期限 3）') >= 0, e1.innerHTML);
chk('late.no-ok-tag', e1.innerHTML.indexOf('tag ok') < 0, e1.innerHTML);
// r749 (main#87): the row names which rows are late, not only the worst one.
chk('late.names-rows', e1.innerHTML.indexOf('逾期行 #3 14d · #23 5d') >= 0, e1.innerHTML);
chk('late.names-no-ellipsis-when-all-shown', e1.innerHTML.indexOf('…#') < 0 && e1.innerHTML.indexOf(' …') < 0, e1.innerHTML);
chk('late.single-size-mention', e1.innerHTML.split('在队').length - 1 === 1, e1.innerHTML);
// Seven late rows: print five and say so - a wall of ids is not a reading either.
const many = Object.assign({}, late, {
  late: 7,
  items: [1, 2, 3, 4, 5, 6, 7].map(function (n) {
    return { id: String(n), file: 'main.md', due: '2026-10-01', days: 10 };
  })
});
const e1b = runPanel(withQueue(many), 'many')('f-queue');
chk('late.ellipsis-when-truncated', e1b.innerHTML.indexOf(' …') >= 0, e1b.innerHTML);
chk('late.shows-only-five', e1b.innerHTML.indexOf('#5 10d') >= 0 && e1b.innerHTML.indexOf('#6 10d') < 0, e1b.innerHTML);

// --- 2) nothing late -------------------------------------------------------
const calm = {
  exists: true, dir_rel: 'state/queue', files: 2, scanned: 20, open: 7, dated: 2, late: 0,
  max_days: 0, max_id: '', as_of: '2026-11-01', items: []
};
const e2 = runPanel(withQueue(calm), 'calm')('f-queue');
chk('calm.ok-class', e2.innerHTML.indexOf('class="tag ok"') >= 0, e2.innerHTML);
chk('calm.text', e2.innerHTML.indexOf('无逾期') >= 0, e2.innerHTML);
chk('calm.queue-size', e2.innerHTML.indexOf('在队 7 件（带期限 2）') >= 0, e2.innerHTML);
chk('calm.no-warn-tag', e2.innerHTML.indexOf('tag warn') < 0, e2.innerHTML);

// --- 3) queues unreadable --------------------------------------------------
const e3 = runPanel(withQueue({ exists: false }), 'missing')('f-queue');
chk('missing.warn-class', e3.innerHTML.indexOf('class="tag warn"') >= 0, e3.innerHTML);
chk('missing.text', e3.innerHTML.indexOf('队列不可读') >= 0, e3.innerHTML);
chk('missing.no-zero-claim', e3.innerHTML.indexOf('无逾期') < 0, e3.innerHTML);

// --- 4) empty object (old build / no data) ---------------------------------
let threw = '';
let e4 = null;
try { e4 = runPanel(withQueue({}), 'empty')('f-queue'); } catch (e) { threw = e.message; }
chk('empty.no-throw', threw === '', threw);
chk('empty.says-unreadable', !!(e4 && e4.innerHTML.indexOf('队列不可读') >= 0), e4 && e4.innerHTML);

// --- 5) row element absent -------------------------------------------------
let threw5 = '';
try { runPanel(withQueue(late), 'noel', { dropId: 'f-queue' }); } catch (e) { threw5 = e.message; }
chk('absent.no-crash', threw5 === '', threw5);

// --- 7) bad due markers (queue main#85) -----------------------------------
// A marker written as `due=2026-1-5` / `due: 2026-01-05` / `Due=...` used to
// read as "no deadline". Now it is named on the page - and it must NOT keep the
// green "no overdue" chip, which would vouch for a number that may be hiding a
// deadline.
const badOnly = {
  exists: true, dir_rel: 'state/queue', files: 1, scanned: 8, open: 8, dated: 1, late: 0,
  max_days: 0, max_id: '', bad: 2, as_of: '2026-11-01', items: [],
  bad_items: [{ id: '2', file: 'queue-f.md', token: 'due=2026-1-5', reason: 'shape' },
              { id: '4', file: 'queue-f.md', token: 'Due=2026-01-05', reason: 'key' }]
};
const e7 = runPanel(withQueue(badOnly), 'badonly')('f-queue');
chk('bad.warn-class', e7.innerHTML.indexOf('class="tag warn"') >= 0, e7.innerHTML);
chk('bad.count', e7.innerHTML.indexOf('标记坏 2 处') >= 0, e7.innerHTML);
chk('bad.ids', e7.innerHTML.indexOf('（#2 · #4）') >= 0, e7.innerHTML);
chk('bad.not-counted-as-dated', e7.innerHTML.indexOf('未计入期限') >= 0, e7.innerHTML);
chk('bad.no-ok-tag', e7.innerHTML.indexOf('tag ok') < 0, e7.innerHTML);
chk('bad.still-reports-size', e7.innerHTML.indexOf('在队 8 件（带期限 1）') >= 0, e7.innerHTML);

const lateBad = {
  exists: true, dir_rel: 'state/queue', files: 2, scanned: 20, open: 9, dated: 3, late: 1,
  max_days: 12, max_id: '1', bad: 1, as_of: '2026-11-01',
  items: [{ id: '1', file: 'queue-f.md', due: '2026-10-20', days: 12 }],
  bad_items: [{ id: '2', file: 'queue-f.md', token: 'due=2026-1-5', reason: 'shape' }]
};
const e8 = runPanel(withQueue(lateBad), 'latebad')('f-queue');
chk('latebad.keeps-late', e8.innerHTML.indexOf('逾期 1 件') >= 0, e8.innerHTML);
chk('latebad.keeps-worst', e8.innerHTML.indexOf('最久 12 天（#1）') >= 0, e8.innerHTML);
chk('latebad.adds-bad', e8.innerHTML.indexOf('标记坏 1 处') >= 0, e8.innerHTML);
chk('latebad.single-size', e8.innerHTML.split('在队').length - 1 === 1, e8.innerHTML);

// --- 8) the real build ships the row and the counter ----------------------
chk('real.row-present', realHtml.indexOf('id="f-queue"') >= 0);
chk('real.const-present', /const QUEUE = \{/.test(realHtml));
chk('real.no-placeholder', realHtml.indexOf('__QUEUE_JSON__') < 0);

// --- 9) quoted deadlines (queue main#101) ---------------------------------
// `due=YYYY-MM-DD` inside backticks is a quotation, so it dates nothing - which
// is exactly how a real deadline can vanish. The page shows a read-only count
// and never a warn chip: the number is a question, not a verdict.
const quoted = {
  exists: true, dir_rel: 'state/queue', files: 1, scanned: 4, open: 4, dated: 1, late: 0,
  max_days: 0, max_id: '', bad: 0, code: 1, as_of: '2026-11-01', items: [],
  code_items: [{ id: '1', file: 'queue-i.md', token: 'due=2026-10-20' }]
};
const e9 = runPanel(withQueue(quoted), 'quoted')('f-queue');
chk('code.count-shown', e9.innerHTML.indexOf('引号内期限 1 处') >= 0, e9.innerHTML);
chk('code.ids', e9.innerHTML.indexOf('（#1）') >= 0, e9.innerHTML);
chk('code.says-not-counted', e9.innerHTML.indexOf('不计期限') >= 0, e9.innerHTML);
chk('code.not-a-warn-chip', e9.innerHTML.indexOf('tag warn') < 0, e9.innerHTML);
chk('code.keeps-ok-chip', e9.innerHTML.indexOf('tag ok') >= 0, e9.innerHTML);
const e10 = runPanel(withQueue(calm), 'calm2')('f-queue');
chk('code.absent-when-zero', e10.innerHTML.indexOf('引号内期限') < 0, e10.innerHTML);

// --- 10) a row missing its trailing pipe (queue main#102) ------------------
// A missing `|` used to shift which cell is "the remark", so a marker was judged
// against the pointer cell - silently. The parser now reads the last cell by the
// row's own shape and reports the shape itself; the page must keep the two
// illnesses apart (a wrongly written `due` is not the same as a broken row).
const rowOnly = {
  exists: true, dir_rel: 'state/queue', files: 1, scanned: 1, open: 1, dated: 0, late: 0,
  max_days: 0, max_id: '', bad: 1, code: 0, as_of: '2026-11-01', items: [],
  bad_items: [{ id: '12', file: 'explore.md', token: 'missing-trailing-pipe', reason: 'row' }]
};
const e11 = runPanel(withQueue(rowOnly), 'rowbad')('f-queue');
chk('row.chip', e11.innerHTML.indexOf('行尾缺 | 1 行') >= 0, e11.innerHTML);
chk('row.ids', e11.innerHTML.indexOf('（#12）') >= 0, e11.innerHTML);
chk('row.explains', e11.innerHTML.indexOf('备注格按行自身形状判定') >= 0, e11.innerHTML);
chk('row.not-called-due-shape', e11.innerHTML.indexOf('标记坏') < 0, e11.innerHTML);

const mixed = {
  exists: true, dir_rel: 'state/queue', files: 2, scanned: 2, open: 2, dated: 0, late: 0,
  max_days: 0, max_id: '', bad: 2, code: 0, as_of: '2026-11-01', items: [],
  bad_items: [{ id: '12', file: 'explore.md', token: 'missing-trailing-pipe', reason: 'row' },
    { id: '4', file: 'main.md', token: 'due=2026-1-5', reason: 'shape' }]
};
const e12 = runPanel(withQueue(mixed), 'rowmixed')('f-queue');
chk('row.mixed-splits-counts', e12.innerHTML.indexOf('标记坏 1 处') >= 0 &&
  e12.innerHTML.indexOf('行尾缺 | 1 行') >= 0, e12.innerHTML);
chk('row.mixed-names-both', e12.innerHTML.indexOf('（#4）') >= 0 &&
  e12.innerHTML.indexOf('（#12）') >= 0, e12.innerHTML);

// --- 11) over-cap rows (queue main#110) -----------------------------------
// One row is one item, but nothing watched row LENGTH: the 45,413-character row
// r773 had to split could grow back. The page shows how many rows are past the
// cap, which ones and how long, and keeps that account apart from `bad` (an
// overlong row is structural debt, not a mis-written marker).
const longOnly = {
  exists: true, dir_rel: 'state/queue', files: 1, scanned: 3, open: 3, dated: 0, late: 0,
  max_days: 0, max_id: '', bad: 0, code: 0, long: 1, long_max: 8062, long_max_id: '4',
  long_limit: 3000, as_of: '2026-11-01', items: [],
  long_items: [{ id: '4', file: 'main.md', chars: 8062, closed: false }]
};
const e13 = runPanel(withQueue(longOnly), 'longonly')('f-queue');
chk('long.chip', e13.innerHTML.indexOf('超长行 1 行') >= 0, e13.innerHTML);
chk('long.id-and-chars', e13.innerHTML.indexOf('#4 8062 字符') >= 0, e13.innerHTML);
chk('long.says-cap', e13.innerHTML.indexOf('一行一件（上限 3000 字符）') >= 0, e13.innerHTML);
chk('long.keeps-ok-chip', e13.innerHTML.indexOf('在队 3 件') >= 0, e13.innerHTML);
chk('long.not-called-due-shape', e13.innerHTML.indexOf('标记坏') < 0, e13.innerHTML);

const longLate = {
  exists: true, dir_rel: 'state/queue', files: 1, scanned: 3, open: 3, dated: 1, late: 1,
  max_days: 5, max_id: '23', bad: 0, code: 0, long: 1, long_max: 8062, long_max_id: '4',
  long_limit: 3000, as_of: '2026-11-01',
  items: [{ id: '23', file: 'main.md', due: '2026-10-27', days: 5 }],
  long_items: [{ id: '4', file: 'main.md', chars: 8062, closed: false }]
};
const e14 = runPanel(withQueue(longLate), 'longlate')('f-queue');
chk('long.not-hidden-by-late', e14.innerHTML.indexOf('超长行 1 行') >= 0 &&
  e14.innerHTML.indexOf('逾期 1 件') >= 0, e14.innerHTML);

const e15 = runPanel(withQueue(calm), 'calm3')('f-queue');
chk('long.absent-when-zero', e15.innerHTML.indexOf('超长行') < 0, e15.innerHTML);

// --- 12) duplicate ids (queue main#112) -----------------------------------
// Ids are numbered by hand, so a collision leaves no trace until both rows are
// read - and "the #N row already shipped" then vouches for the open row that
// shares the number. The page names how many ids collide, which ones, how many
// rows they span, and keeps this third account apart from `bad` and `long`.
const dupeOnly = {
  exists: true, dir_rel: 'state/queue', files: 1, scanned: 3, open: 3, dated: 0, late: 0,
  max_days: 0, max_id: '', bad: 0, code: 0, long: 0, long_max: 0, long_max_id: '',
  long_limit: 3000, dupe: 1, dupe_rows: 2, as_of: '2026-11-01', items: [],
  dupe_items: [
    { id: '110', file: 'main.md', line: 91, closed: false },
    { id: '110', file: 'main.md', line: 92, closed: true }
  ]
};
const e16 = runPanel(withQueue(dupeOnly), 'dupeonly')('f-queue');
chk('dupe.chip', e16.innerHTML.indexOf('重复 id 1 组') >= 0, e16.innerHTML);
chk('dupe.names-id', e16.innerHTML.indexOf('#110') >= 0, e16.innerHTML);
chk('dupe.row-count', e16.innerHTML.indexOf('2 行同号') >= 0, e16.innerHTML);
chk('dupe.says-why', e16.innerHTML.indexOf('「#N 已销」不替另一行作保') >= 0, e16.innerHTML);
chk('dupe.keeps-ok-chip', e16.innerHTML.indexOf('在队 3 件') >= 0, e16.innerHTML);
chk('dupe.not-called-long', e16.innerHTML.indexOf('超长行') < 0, e16.innerHTML);
chk('dupe.not-called-bad', e16.innerHTML.indexOf('标记坏') < 0, e16.innerHTML);

const dupeLate = {
  exists: true, dir_rel: 'state/queue', files: 1, scanned: 3, open: 3, dated: 1, late: 1,
  max_days: 5, max_id: '23', bad: 0, code: 0, long: 0, long_max: 0, long_max_id: '',
  long_limit: 3000, dupe: 1, dupe_rows: 2, as_of: '2026-11-01',
  items: [{ id: '23', file: 'main.md', due: '2026-10-27', days: 5 }],
  dupe_items: [
    { id: '110', file: 'main.md', line: 91, closed: false },
    { id: '110', file: 'main.md', line: 92, closed: true }
  ]
};
const e17 = runPanel(withQueue(dupeLate), 'dupellate')('f-queue');
chk('dupe.not-hidden-by-late', e17.innerHTML.indexOf('重复 id 1 组') >= 0 &&
  e17.innerHTML.indexOf('逾期 1 件') >= 0, e17.innerHTML);

const e18 = runPanel(withQueue(calm), 'calm4')('f-queue');
chk('dupe.absent-when-zero', e18.innerHTML.indexOf('重复 id') < 0, e18.innerHTML);

console.log('RESULT pass=' + pass + ' fail=' + fail);
if (fail > 0) process.exit(1);