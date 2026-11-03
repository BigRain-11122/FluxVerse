// r813 panel test: the tick row must say whether the LAST round actually ran
// the gate (r812 family work left a real instance: two consecutive rounds were
// `backoff: perceptor stack dirty`, yet the row read "4 minutes ago" - a
// skipped gate looked exactly as fresh as a healthy one).
// Method: take the REAL built page and swap only the one-line `const TICK = ...;`
// so every other row stays as shipped.
// Cases:
//   1. last_kind='backoff' -> warn tag "上轮跳过 scan/gate" next to the age
//   2. last_kind='gate'    -> no extra tag (healthy rounds stay quiet)
//   3. last_kind='running' -> muted "上轮尚无门结论", never a warn
//   4. last_kind missing   -> no extra tag (older builds stay alive)
//   5. self-check row carries the same fact (backoff / running)
//   6. stalled + backoff   -> "停走" AND the backoff note (two separate truths)
//   7. anti-drift: the shipped page really reads tk.last_kind
'use strict';
const fs = require('fs');
const vm = require('vm');

const realHtml = fs.readFileSync('world-public/city-panel.html', 'utf8');

function scriptOf(html, label) {
  const m = html.match(/<script>([\s\S]*?)<\/script>/);
  if (!m) throw new Error('no inline script in ' + label);
  return m[1];
}

function withTick(obj) {
  const lines = [];
  for (const k of Object.keys(obj)) {
    const v = obj[k];
    lines.push('  ' + k + ': ' + JSON.stringify(v));
  }
  const line = 'const TICK = {\n' + lines.join(',\n') + '\n};';
  const rx = /const TICK = .*?;\r?\n/;
  if (!rx.test(realHtml)) throw new Error('TICK constant not found in the built page');
  return realHtml.replace(rx, line + '\n');
}

function runPanel(html, label) {
  const els = {};
  const makeEl = (id) => ({
    id: id, textContent: '', innerHTML: '', className: '', style: {}, title: '',
    children: [],
    appendChild(c) { this.children.push(c); },
    addEventListener() {},
    scrollIntoView() {}
  });
  const document = {
    getElementById(id) { return els[id] || (els[id] = makeEl(id)); },
    createElement() { return makeEl('span'); },
    querySelectorAll() { return []; }
  };
  const sandbox = { document, console, Date, Math, Object, Array, String, Number, isNaN, setTimeout };
  vm.runInNewContext(scriptOf(html, label), sandbox, { filename: label, timeout: 5000 });
  return { get: (id) => (els[id] || makeEl(id)), has: (id) => !!els[id] };
}

let pass = 0, fail = 0;
function ck(cond, name, detail) {
  if (cond) { pass++; console.log('  ok   ' + name); }
  else { fail++; console.log('  RED  ' + name + (detail ? ' :: ' + detail : '')); }
}

function tickObj(age, lastKind) {
  const o = {
    exists: true, file: 'tick-20261104.log', size: 4096,
    mtime_utc: '2026-11-04T06:41:02Z', age_min: age,
    scan_lines: 10, rounds: 5, read_ok: true
  };
  if (lastKind !== undefined) o.last_kind = lastKind;
  return o;
}

function tickTags(tk, label) {
  const page = runPanel(withTick(tk), label);
  const kids = page.get('f-tick').children || [];
  return { page: page, tags: kids.filter(c => c.id !== 'f-tick') };
}

const SKIP = '上轮跳过 scan/gate';
const RUN = '上轮尚无门结论';

// 1. backoff -> warn tag beside the age
(function () {
  const t = tickTags(tickObj(4, 'backoff'), 'tick-backoff');
  const hit = t.tags.filter(c => c.textContent === SKIP);
  ck(hit.length === 1, 'backoff: 年龄旁挂一枚跳过标', JSON.stringify(t.tags.map(c => c.textContent)));
  ck(hit.length === 1 && /warn/.test(hit[0].className), 'backoff: 该标是 warn 级',
    hit.length ? hit[0].className : 'no tag');
  // 年龄那一行本身照旧（24 分钟前仍然是真的）
  const ageTag = t.tags.filter(c => /分钟前/.test(c.textContent));
  ck(ageTag.length === 1, 'backoff: 年龄行未被吞掉', JSON.stringify(t.tags.map(c => c.textContent)));
})();

// 2. gate -> quiet
(function () {
  const t = tickTags(tickObj(4, 'gate'), 'tick-gate');
  ck(t.tags.filter(c => c.textContent === SKIP).length === 0, 'gate: 不挂跳过标');
  ck(t.tags.filter(c => c.textContent === RUN).length === 0, 'gate: 不挂结论缺失标');
  ck(t.tags.length === 1, 'gate: 只剩年龄行', JSON.stringify(t.tags.map(c => c.textContent)));
})();

// 3. running -> muted, never warn
(function () {
  const t = tickTags(tickObj(1, 'running'), 'tick-running');
  const hit = t.tags.filter(c => c.textContent === RUN);
  ck(hit.length === 1, 'running: 说「上轮尚无门结论」');
  ck(hit.length === 1 && !/warn/.test(hit[0].className), 'running: 不是 warn（没结论不是错）',
    hit.length ? hit[0].className : 'no tag');
})();

// 4. missing key -> old builds behave exactly as before
(function () {
  const t = tickTags(tickObj(4, undefined), 'tick-compat');
  ck(t.tags.length === 1, '无 last_kind: 旧形态不变', JSON.stringify(t.tags.map(c => c.textContent)));
})();

// 5/6. self-check row says the same thing, and stalled+backoff keeps both facts
(function () {
  const b = tickTags(tickObj(4, 'backoff'), 'tick-self-backoff');
  const html = b.page.get('selfcheck').innerHTML;
  ck(/tick 覆盖/.test(html), 'selfcheck: tick 覆盖行在', String(html).slice(0, 120));
  ck(html.indexOf('上轮跳过 scan/gate（轮首退避）') >= 0, 'selfcheck: backoff 判词带退避说明');

  const r = tickTags(tickObj(4, 'running'), 'tick-self-running');
  ck(r.page.get('selfcheck').innerHTML.indexOf(RUN) >= 0, 'selfcheck: running 判词带「尚无门结论」');

  const g = tickTags(tickObj(4, 'gate'), 'tick-self-gate');
  const gHtml = g.page.get('selfcheck').innerHTML;
  ck(gHtml.indexOf('上轮跳过') < 0 && gHtml.indexOf(RUN) < 0, 'selfcheck: gate 不多说一个字');

  const st = tickTags(tickObj(40, 'backoff'), 'tick-stalled-backoff');
  const stHtml = st.page.get('selfcheck').innerHTML;
  ck(/停走/.test(stHtml), '停走: 仍然点名超时');
  ck(stHtml.indexOf('上轮跳过 scan/gate（轮首退避）') >= 0, '停走 + 退避: 两件事分开说');
})();

// 7. anti-drift: the shipped page reads the key (a template edit that does not
// reach the build would otherwise be invisible)
ck(realHtml.indexOf('tk.last_kind') >= 0, 'anti-drift: 出厂页面确实读 tk.last_kind');
ck(/"last_kind"/.test(realHtml), 'anti-drift: 出厂页面 TICK 已带 last_kind（builder 接线在役）');

console.log('RESULT: ' + pass + ' passed, ' + fail + ' reded (of ' + (pass + fail) + ')');
if (fail > 0) process.exit(1);