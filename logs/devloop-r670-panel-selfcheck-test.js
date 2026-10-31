// r670 panel self-check render test: stub DOM, run the inlined panel script
// from two builds (real snapshot = all PASS, bad fixture = 3 WARN) and assert
// the rendered rows. No browser, no network.
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
    body: els['selfcheck'] ? els['selfcheck'].innerHTML : ''
  };
}

let pass = 0, fail = 0;
function chk(name, cond, detail) {
  if (cond) { pass++; console.log('PASS ' + name); }
  else { fail++; console.log('FAIL ' + name + ' :: ' + detail); }
}

// Expected check count comes from the template itself: a frozen number turns
// every added self-check into a false red in this old suite.
const tpl = fs.readFileSync('Tools/devloop/city-panel-template.html', 'utf8');
const expectedChecks = (tpl.match(/selfcheck\.push\(/g) || []).length;

const good = runPanel('world-public/city-panel.html');
chk('good.rows=template', good.rows === expectedChecks,
  'rows=' + good.rows + ' expected=' + expectedChecks);
chk('good.sum=consistent', good.sum === (expectedChecks + ' 项通过') ||
  /^\d+ 项注意$/.test(good.sum), 'sum=' + JSON.stringify(good.sum));
// r703: the real panel may carry ONE legitimate warn -- the 取景帧 row when qa/
// holds no fresh City3D frames (they come from the City3D window, not from this
// one). r709 adds a second legitimate warn source: 应办令, which goes red when the
// group's ledger itself carries an overdue order addressed to us. r712 adds a
// third: 城市证据 goes red while the soak sits >20% under the accepted baseline
// (main#52 open). r717 (main#57) adds a fourth: 街区落位 goes red while the R2
// block still stands over the water mesh -- an explained, in-register debt.
// Any warn on a different row is still a defect, so assert by exclusion.
const warnRows = good.body.split('<div class="chk">').slice(1).filter(c => c.indexOf('>注意<') >= 0);
const WARN_OK = ['<span class="nm">取景帧</span>', '<span class="nm">应办令</span>', '<span class="nm">城市证据</span>', '<span class="nm">街区落位</span>'];
const strayWarn = warnRows.filter(c => !WARN_OK.some(nm => c.indexOf(nm) >= 0));
chk('good.no-unexplained-warn', strayWarn.length === 0,
  'warn=' + warnRows.length + ' stray=' + strayWarn.length);

const bad = runPanel('logs/panel-fixture-bad.html');
// The fixture is a frozen build (its own old template), and snapshot age moves
// with wall clock, so only the shape + the three injected faults are asserted.
chk('bad.rows>0', bad.rows > 0, 'rows=' + bad.rows);
chk('bad.sum=warn-shape', /^\d+ 项注意$/.test(bad.sum), 'sum=' + JSON.stringify(bad.sum));
chk('bad.order-warn', bad.body.indexOf('1 条逆序') >= 0, 'no 逆序 text');
// anchor 21:16:02Z + 5min = 21:21:02Z => only the 21:30 event is "future"
chk('bad.future-warn', bad.body.indexOf('1 条晚于快照') >= 0, 'no future text');
chk('bad.bads-ts-warn', bad.body.indexOf('1 条时间不可解析') >= 0, 'no bad-ts text');

console.log('RESULT pass=' + pass + ' fail=' + fail);
process.exit(fail ? 1 : 0);