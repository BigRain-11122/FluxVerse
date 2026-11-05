// r844 panel sandbox: a 33% soak drift must say WHAT moved.
//
// The city-evidence row has turned red on a >20% fps drift since main#52, and
// r825 made the age part of the verdict. But the drift number alone cannot tell
// "the scene got heavier" from "the machine was busy when we measured": the
// live receipts (10-26 baseline vs 10-28 re-run) sit on the SAME City3D runtime
// tree (a7383446, Editor tooling excluded) while both halves of the frame
// slowed by ~1.5x - a whole-frame slowdown, not a content regression.
//
// The builder now resolves the runtime-side commit current at EACH receipt's
// timestamp plus both per-frame costs. The page has three states, never two:
//   same tree  -> name the tree and, when both halves moved together, say the
//                 evidence points at machine load rather than a heavier scene
//   tree moved -> name both shas and make no causal claim
//   unknown    -> say nothing at all ('' from git is never "unchanged")
//
// Acceptance:
//   1. same tree + both halves moved -> names the sha and the "same machine
//      load, not a heavier scene" reading, and keeps the fps/baseline numbers
//   2. same tree, halves NOT moving together -> names the tree, claims nothing
//      about the cause
//   3. tree moved -> names both sides, no "same tree" claim
//   4. tree unknown (pre-r844 / git silent) -> row is byte-identical to r843
//   5. healthy row (no drift) -> the new sentence never appears
//   6. anti-drift: template guards on `runtime_same === true`, builder prints
//      the three machine tokens and resolves the sha with the Editor excluded
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

function withProof(html, obj) {
  const re = /const PROOF = [\s\S]*?;\n/;
  if (!re.test(html)) throw new Error('cannot locate const PROOF');
  return html.replace(re, () => 'const PROOF = ' + JSON.stringify(obj) + ';\n');
}

const staleTs = '2026-10-28T10:59:22Z';
const baseTs = '2026-10-26T10:31:42Z';

// The live pair, verbatim in shape: 409.8 fps against a 608.5 baseline.
const live = {
  build: { exists: true, exit_code: 0, ts_utc: '2026-11-01T00:00:00Z', shots_present: 6, shots_expected: 6 },
  soak: {
    exists: true, fps_avg: 409.837, errors: 0, exceptions: 0, ts_utc: staleTs,
    baseline_fps: 608.536, baseline_p95_ms: 2.147, p95_ms: 3.35,
    drift_pct: -32.7, p95_drift_pct: 21.5,
    dt_avg_ms: 2.44, logic_dt_avg_ms: 0.246,
    baseline_dt_avg_ms: 1.643, baseline_logic_dt_avg_ms: 0.158,
    code_at: 'a7383446', baseline_code_at: 'a7383446', runtime_same: true,
    render_ratio: 1.49, logic_ratio: 1.56
  },
  code: { exists: true, sha: '6c795977', ts_utc: '2026-10-31T14:40:46Z' },
  site: { ran: false }
};

function proofRow(obj, label) {
  const run = runPanelHtml(withProof(realHtml, obj), label);
  return String(run.get('proof').innerHTML);
}

// ---------- 1) the live shape ----------
console.log('--- same runtime tree, whole frame slowed ---');
const liveRow = proofRow(live, 'live');
check('1 names the unchanged runtime tree', liveRow.indexOf('城市运行时树零变更') >= 0, liveRow.slice(0, 400));
check('1 names the sha it resolved', liveRow.indexOf('a7383446') >= 0);
check('1 both halves reported', liveRow.indexOf('1.56') >= 0 && liveRow.indexOf('1.49') >= 0);
check('1 points at machine load, not a heavier scene',
  liveRow.indexOf('同机负载') >= 0 && liveRow.indexOf('不是场景加重') >= 0);
check('1 keeps the raw numbers (no laundering)',
  liveRow.indexOf('409.8 fps') >= 0 && liveRow.indexOf('-32.7%') >= 0 && liveRow.indexOf('608.5') >= 0);

// ---------- 2) same tree, only the GPU moved ----------
console.log('--- same runtime tree, render-only slowdown ---');
const gpuOnly = JSON.parse(JSON.stringify(live));
gpuOnly.soak.logic_ratio = 1.0;
gpuOnly.soak.render_ratio = 1.6;
const gpuRow = proofRow(gpuOnly, 'gpu-only');
check('2 still names the unchanged tree', gpuRow.indexOf('城市运行时树零变更') >= 0);
check('2 does NOT claim machine load when halves disagree', gpuRow.indexOf('同机负载') < 0, gpuRow.slice(0, 400));

// ---------- 3) the runtime tree moved ----------
console.log('--- runtime tree changed ---');
const moved = JSON.parse(JSON.stringify(live));
moved.soak.baseline_code_at = 'a7383446';
moved.soak.code_at = '6c795977';
moved.soak.runtime_same = false;
const movedRow = proofRow(moved, 'moved');
check('3 names the change and both shas',
  movedRow.indexOf('运行时树已变') >= 0 && movedRow.indexOf('a7383446') >= 0 && movedRow.indexOf('6c795977') >= 0);
check('3 makes no "zero change" claim', movedRow.indexOf('零变更') < 0);
check('3 makes no "machine load" claim', movedRow.indexOf('同机负载') < 0);
check('3 says the drift may come from the scene', movedRow.indexOf('可能来自场景') >= 0);

// ---------- 4) unknown tree (pre-r844 reading / git silent) ----------
console.log('--- unknown ---');
const pre = JSON.parse(JSON.stringify(live));
delete pre.soak.runtime_same;
delete pre.soak.code_at;
delete pre.soak.baseline_code_at;
delete pre.soak.logic_ratio;
delete pre.soak.render_ratio;
const preRow = proofRow(pre, 'pre-r844');
check('4 pre-r844 reading: no tree claim', preRow.indexOf('运行时树') < 0, preRow.slice(0, 400));
check('4 pre-r844 reading: no ratio claim', preRow.indexOf('同机负载') < 0);
check('4 pre-r844 reading: drift still red and visible', preRow.indexOf('-32.7%') >= 0);
check('4 no NaN/undefined in the row', (preRow.match(/NaN|undefined/g) || []).length === 0);

// ---------- 5) a healthy row stays short ----------
console.log('--- healthy ---');
const ok = JSON.parse(JSON.stringify(live));
ok.soak.fps_avg = 610.0;
ok.soak.drift_pct = 0.2;
ok.soak.p95_drift_pct = -0.1;
const okRow = proofRow(ok, 'healthy');
check('5 healthy row says nothing about the tree', okRow.indexOf('运行时树') < 0);
check('5 healthy row still carries fps and baseline',
  okRow.indexOf('610.0 fps') >= 0 && okRow.indexOf('608.5') >= 0);

// ---------- 6) anti-drift wiring ----------
console.log('--- wiring ---');
check('6 template guards on runtime_same === true', template.indexOf("sameCode === true") >= 0);
check('6 template guards on the moved case', template.indexOf("sameCode === false") >= 0);
check('6 builder prints the three machine tokens',
  builder.indexOf("' proof_soak_code_same='") >= 0 &&
  builder.indexOf("' proof_soak_code='") >= 0 &&
  builder.indexOf("' proof_soak_ratio='") >= 0);
check('6 builder resolves the sha with Editor + ProjectSettings excluded',
  builder.indexOf(':(exclude)City3D/Assets/Editor') >= 0 &&
  builder.indexOf(':(exclude)City3D/ProjectSettings') >= 0);
check('6 builder only compares when both timestamps are real',
  builder.indexOf('[string]$soak.ts_utc -ne [string]$soak.baseline_ts_utc') >= 0);

console.log('');
console.log('RESULT: pass=' + pass + ' fail=' + fail);
process.exit(fail > 0 ? 1 : 0);