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

console.log('RESULT pass=' + pass + ' fail=' + fail);
if (fail > 0) process.exit(1);