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

// --- 6) the real build ships the row and the counter ----------------------
chk('real.row-present', realHtml.indexOf('id="f-queue"') >= 0);
chk('real.const-present', /const QUEUE = \{/.test(realHtml));
chk('real.no-placeholder', realHtml.indexOf('__QUEUE_JSON__') < 0);

console.log('RESULT pass=' + pass + ' fail=' + fail);
if (fail > 0) process.exit(1);