// r671 panel cross-round comparison test: stub DOM, run the inlined panel
// script from three builds (no previous snapshot / previous snapshot with
// deltas / previous snapshot whose counters regressed) and assert the rows.
// No browser, no network.
'use strict';
const fs = require('fs');
const vm = require('vm');

function runPanel(file) {
  const html = fs.readFileSync(file, 'utf8');
  const m = html.match(/<script>([\s\S]*?)<\/script>/);
  if (!m) throw new Error('no inline script in ' + file);

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
  vm.runInNewContext(m[1], sandbox, { filename: file, timeout: 5000 });

  const rows = (els['selfcheck'] ? els['selfcheck'].innerHTML : '').split('<div class="chk">').length - 1;
  return {
    sum: els['sc-sum'] ? els['sc-sum'].textContent : '',
    rows: rows,
    body: els['selfcheck'] ? els['selfcheck'].innerHTML : '',
    prev: els['cv-prev'] ? els['cv-prev'].textContent : '',
    chg: els['chg'] ? els['chg'].innerHTML : '',
    note: els['cv-note'] ? els['cv-note'].textContent : ''
  };
}

let pass = 0, fail = 0;
function chk(name, cond, detail) {
  if (cond) { pass++; console.log('PASS ' + name); }
  else { fail++; console.log('FAIL ' + name + ' :: ' + detail); }
}

// 1) real build: assertions must be re-runnable at any later round, so the
// expected check count comes from the template itself (not a frozen number),
// and the prev/note assertions accept both the "first record" and the
// "records exist" states.
const tpl = fs.readFileSync('Tools/devloop/city-panel-template.html', 'utf8');
const expectedChecks = (tpl.match(/selfcheck\.push\(/g) || []).length;
const realPath = 'world-public/city-panel.html';
const realHtml = fs.readFileSync(realPath, 'utf8');
const histN = Number((realHtml.match(/const HIST = \{[^}]*?"n":(\d+)/) || [])[1] || 0);

const first = runPanel(realPath);
chk('first.rows=template', first.rows === expectedChecks,
  'rows=' + first.rows + ' expected=' + expectedChecks);
chk('first.sum.consistent', first.sum === (expectedChecks + ' 项通过') ||
  /^\d+ 项注意$/.test(first.sum), 'sum=' + JSON.stringify(first.sum));
chk('first.prev.state', first.prev === '无上一条快照' || first.prev.indexOf('对比 ') === 0,
  'prev=' + JSON.stringify(first.prev));
chk('first.note.cumulating', histN > 1
  ? first.note.indexOf('上一条 = 前一次 tick 的快照摘要') >= 0
  : first.note.indexOf('自本次构建开始累积') >= 0, 'note=' + first.note);
chk('first.note.count', histN > 0 && first.note.indexOf('已记录 ' + histN + ' 条') >= 0,
  'note=' + first.note + ' histN=' + histN);
chk('first.chg.rows=5', (first.chg.split('<div class="rowline">').length - 1) === 5,
  'rows=' + (first.chg.split('<div class="rowline">').length - 1));
chk('first.chg.all-have-value', first.chg.indexOf('>—<') < 0, 'chg=' + first.chg);

// 2) fixture history one tick older with lower counters => deltas visible
const prev = runPanel('logs/panel-fixture-prev.html');
// current counters straight from the built panel (snapshot values move every tick)
const snapHtml = fs.readFileSync('logs/panel-fixture-prev.html', 'utf8');
const curCommits = Number((snapHtml.match(/"commits_total":(\d+)/) || [])[1]);
// Fixtures are frozen builds: row count is theirs, and snapshot-age warn
// follows the wall clock, so only the shape is asserted here.
chk('prev.rows>0', prev.rows > 0, 'rows=' + prev.rows);
chk('prev.sum=shape', /^\d+ 项(通过|注意)$/.test(prev.sum), 'sum=' + JSON.stringify(prev.sum));
// NOTE: this fixture is a build frozen on 2026-10-20, so its inlined script is
// older than the template — it can only assert SHAPE here. The current clock
// convention for the comparison anchor is asserted against the live build in
// logs/devloop-r700-panel-trendclock-test.js (queue main#39).
chk('prev.label', prev.prev.indexOf('对比 ') === 0, 'prev=' + JSON.stringify(prev.prev));
chk('prev.gap=5min', prev.prev.indexOf('（5 分钟前）') >= 0, 'prev=' + prev.prev);
chk('prev.delta.commits', prev.chg.indexOf('>+' + (curCommits - 28843) + '<') >= 0,
  'want +' + (curCommits - 28843) + ' in ' + prev.chg);
chk('prev.delta.renders', prev.chg.indexOf('>+1<') >= 0, 'chg=' + prev.chg);
chk('prev.flat.fleet', prev.chg.indexOf('持平') >= 0, 'chg=' + prev.chg);
chk('prev.mono.ok', prev.body.indexOf('未回落') >= 0, 'body=' + prev.body);
chk('prev.note.count', prev.note.indexOf('已记录 2 条') >= 0, 'note=' + prev.note);

// 3) previous counters higher than current => cross-round monotonic WARN
const reg = runPanel('logs/panel-fixture-regress.html');
chk('reg.rows>0', reg.rows > 0, 'rows=' + reg.rows);
chk('reg.sum=warn-shape', /^\d+ 项注意$/.test(reg.sum), 'sum=' + JSON.stringify(reg.sum));
chk('reg.warn.text', reg.body.indexOf('计数回落 commits 99999') >= 0, 'body=' + reg.body);
chk('reg.chg.negative', reg.chg.indexOf('>' + (curCommits - 99999) + '<') >= 0,
  'want ' + (curCommits - 99999) + ' in ' + reg.chg);

console.log('RESULT pass=' + pass + ' fail=' + fail);
process.exit(fail ? 1 : 0);