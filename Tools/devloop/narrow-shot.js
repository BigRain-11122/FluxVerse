// narrow-shot.js - render the public city panel in a true phone viewport.
//
// Why this exists: --window-size cannot go below Edge's 500px minimum window
// width, so a "390px screenshot" from plain headless Edge is really ~492px and
// media queries never see phone widths. Driving Edge over CDP lets us set an
// exact device viewport (Emulation.setDeviceMetricsOverride), then both measure
// real layout (horizontal overflow offenders) and capture a full-page shot.
//
// No dependencies: uses Node's global fetch + WebSocket (Node 22+).
//
// usage: node Tools/devloop/narrow-shot.js [--width 390] [--height 844]
//          [--out <png>] [--url file:///...] [--json <out.json>]
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawn } = require('child_process');

function argOf(name, dflt) {
  const i = process.argv.indexOf('--' + name);
  return i > -1 && process.argv[i + 1] ? process.argv[i + 1] : dflt;
}

const WIDTH = parseInt(argOf('width', '390'), 10);
const HEIGHT = parseInt(argOf('height', '844'), 10);
const repoDir = path.resolve(__dirname, '..', '..');
const URL_ARG = argOf('url', 'file:///' + path.join(repoDir, 'world-public', 'city-panel.html').replace(/\\/g, '/'));
const OUT = argOf('out', path.join(repoDir, 'qa', 'city-panel-narrow.png'));
const JSON_OUT = argOf('json', '');
const PORT = parseInt(argOf('port', '9337'), 10);

const EDGE_CANDIDATES = [
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe'
];
const edge = EDGE_CANDIDATES.find((p) => fs.existsSync(p));
if (!edge) {
  console.error('NARROW ERROR: msedge.exe not found');
  process.exit(3);
}

const profile = path.join(os.tmpdir(), 'narrow-cdp-' + process.pid + '-' + Date.now());
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const MEASURE = `(() => {
  const w = document.documentElement.clientWidth;
  const offenders = [];
  const nodes = document.querySelectorAll('.wrap *');
  for (let i = 0; i < nodes.length; i++) {
    const e = nodes[i];
    const r = e.getBoundingClientRect();
    if (r.width > 0 && r.right > w + 1) {
      const id = e.id ? '#' + e.id : '';
      let cls = '';
      if (e.className && typeof e.className === 'string' && e.className.trim()) {
        cls = '.' + e.className.trim().split(/\\s+/).join('.');
      }
      offenders.push({
        t: e.tagName.toLowerCase() + id + cls,
        right: Math.round(r.right),
        w: Math.round(r.width),
        txt: (e.textContent || '').trim().slice(0, 30)
      });
      if (offenders.length >= 15) break;
    }
  }
  return JSON.stringify({
    clientW: w,
    scrollW: document.documentElement.scrollWidth,
    docH: document.documentElement.scrollHeight,
    offenders
  });
})()`;

async function main() {
  const child = spawn(edge, [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    '--no-first-run',
    '--no-default-browser-check',
    '--remote-debugging-port=' + PORT,
    '--user-data-dir=' + profile,
    URL_ARG
  ], { stdio: 'ignore' });

  let target = null;
  for (let i = 0; i < 60 && !target; i++) {
    await sleep(250);
    try {
      const list = await (await fetch('http://127.0.0.1:' + PORT + '/json/list')).json();
      target = list.find((t) => t.type === 'page' && t.webSocketDebuggerUrl) || null;
    } catch (e) { /* not up yet */ }
  }
  if (!target) {
    child.kill();
    console.error('NARROW ERROR: devtools endpoint never came up');
    process.exit(4);
  }

  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });

  let seq = 0;
  const pending = new Map();
  ws.onmessage = (ev) => {
    const m = JSON.parse(ev.data);
    if (m.id && pending.has(m.id)) {
      const { res, rej } = pending.get(m.id);
      pending.delete(m.id);
      if (m.error) rej(new Error(JSON.stringify(m.error))); else res(m.result);
    }
  };
  const send = (method, params) => new Promise((res, rej) => {
    const id = ++seq;
    pending.set(id, { res, rej });
    ws.send(JSON.stringify({ id, method, params: params || {} }));
  });

  await send('Page.enable');
  await send('Emulation.setDeviceMetricsOverride', {
    width: WIDTH, height: HEIGHT, deviceScaleFactor: 1, mobile: true
  });
  // Re-run the layout at the phone width (media queries key off the viewport).
  await send('Page.navigate', { url: URL_ARG });
  await sleep(1200);

  const measured = await send('Runtime.evaluate', { expression: MEASURE, returnByValue: true });
  const payload = JSON.parse(measured.result.value);

  const metrics = await send('Page.getLayoutMetrics');
  const contentH = Math.ceil((metrics.cssContentSize || metrics.contentSize).height);

  const shot = await send('Page.captureScreenshot', {
    format: 'png',
    captureBeyondViewport: true,
    clip: { x: 0, y: 0, width: WIDTH, height: contentH, scale: 1 }
  });
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, Buffer.from(shot.data, 'base64'));

  const overflow = payload.scrollW - payload.clientW;
  console.log('NARROW width=' + WIDTH + ' clientW=' + payload.clientW +
    ' scrollW=' + payload.scrollW + ' overflow=' + overflow +
    ' docH=' + contentH + ' png=' + path.basename(OUT) + ' bytes=' + fs.statSync(OUT).size);
  if (payload.offenders.length === 0) {
    console.log('NARROW offenders=0');
  } else {
    console.log('NARROW offenders=' + payload.offenders.length);
    payload.offenders.forEach((o) => {
      console.log('  - ' + o.t + ' right=' + o.right + ' w=' + o.w + ' | ' + o.txt);
    });
  }
  const verdict = (overflow > 0 || payload.offenders.length > 0) ? 'OVERFLOW' : 'OK';
  console.log('NARROW VERDICT: ' + verdict);
  if (JSON_OUT) {
    fs.writeFileSync(JSON_OUT, JSON.stringify(Object.assign({ width: WIDTH, overflow, verdict }, payload), null, 2));
  }

  try { ws.close(); } catch (e) { /* ignore */ }
  child.kill();
  await sleep(200);
  try { fs.rmSync(profile, { recursive: true, force: true }); } catch (e) { /* ignore */ }
  process.exit(verdict === 'OK' ? 0 : 2);
}

main().catch((e) => {
  console.error('NARROW ERROR: ' + (e && e.stack || e));
  process.exit(5);
});