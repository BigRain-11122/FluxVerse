// r742 narrow-shot png test: the file that lands on disk must prove itself
// (queue main#80 atomic replace / main#81 IHDR readback).
//
// Three faces:
//   1. pngSize - reads a real PNG header, rejects anything that is not one.
//   2. judgePng - the frame we measured vs the header on disk: width mismatch,
//      height drift beyond 2px, unreadable header, missing expectation.
//   3. wiring in narrow-shot.js - write to `<out>.part-<pid>`, gate on the
//      part file's own header, and only then rename onto the output path; the
//      direct write to OUT is gone, and a rejected capture deletes its part.
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const zlib = require('zlib');

const { pngSize, judgePng } = require('../Tools/devloop/narrow-shot-verify.js');
const src = fs.readFileSync('Tools/devloop/narrow-shot.js', 'utf8');

let pass = 0, fail = 0;
function chk(name, cond, detail) {
  if (cond) { pass++; console.log('  OK   ' + name); }
  else { fail++; console.log('  FAIL ' + name + (detail ? ' :: ' + detail : '')); }
}

// Build a real 1-row PNG so the header test runs on real bytes, not a mock.
function makePng(w, h) {
  function crc32(buf) {
    let c, crc = 0xffffffff;
    for (let n = 0; n < buf.length; n++) {
      c = (crc ^ buf[n]) & 0xff;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      crc = (crc >>> 8) ^ c;
    }
    return (crc ^ 0xffffffff) >>> 0;
  }
  function chunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(crc32(body), 0);
    return Buffer.concat([len, body, crc]);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8; ihdr[9] = 0; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  const raw = Buffer.alloc((w + 1) * h, 0);
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw)),
    chunk('IEND', Buffer.alloc(0))
  ]);
}

// --- 1) pngSize ---
{
  const png = makePng(390, 6639);
  const s = pngSize(png);
  chk('pngSize.real-header', s && s.w === 390 && s.h === 6639, JSON.stringify(s));
  chk('pngSize.buffer-from-disk', (() => {
    const tmp = path.join(os.tmpdir(), 'r742-png-' + process.pid + '.png');
    fs.writeFileSync(tmp, png);
    const r = pngSize(fs.readFileSync(tmp));
    fs.unlinkSync(tmp);
    return r && r.w === 390 && r.h === 6639;
  })(), 'readback of a written file must parse');
}
chk('pngSize.empty-null', pngSize(Buffer.alloc(0)) === null, 'empty buffer must not pass');
chk('pngSize.short-null', pngSize(Buffer.from([0x89, 0x50, 0x4e])) === null, 'truncated header must not pass');
{
  const bad = makePng(10, 10);
  bad[1] = 0x00;
  chk('pngSize.bad-signature-null', pngSize(bad) === null, 'wrong signature must not pass');
}
{
  // a JPEG-shaped file that happens to be long enough
  const jpg = Buffer.alloc(64, 0xff);
  chk('pngSize.not-a-png-null', pngSize(jpg) === null, 'non-PNG bytes must not pass');
}
chk('pngSize.null-input', pngSize(null) === null, 'null input must not throw');

// --- 2) judgePng ---
const GOODP = { width: 390, expectW: 390, expectH: 6639, pngW: 390, pngH: 6639 };
function jp(over) { return judgePng(Object.assign({}, GOODP, over)); }
chk('judgePng.exact', jp({}).ok === true, JSON.stringify(jp({})));
chk('judgePng.expectW-defaults-to-width', judgePng({ width: 390, expectH: 6639, pngW: 390, pngH: 6639 }).ok === true,
  'expectW should fall back to width');
chk('judgePng.plus-two-ok', jp({ pngH: 6641 }).ok === true, 'pixel rounding of 2 must be tolerated');
chk('judgePng.minus-two-ok', jp({ pngH: 6637 }).ok === true, 'pixel rounding of 2 must be tolerated');
chk('judgePng.height-truncated', jp({ pngH: 844 }).reason === 'png-height-mismatch',
  'a first-screen png must not pass a long-frame expectation');
chk('judgePng.height-plus-three', jp({ pngH: 6642 }).reason === 'png-height-mismatch', '3px drift must fail');
chk('judgePng.width-mismatch', jp({ pngW: 492 }).reason === 'png-width-mismatch', 'wrong width must fail');
chk('judgePng.unreadable', jp({ pngW: null, pngH: null }).reason === 'png-unreadable', 'missing header must fail closed');
chk('judgePng.zero-height', jp({ pngH: 0 }).reason === 'png-unreadable', 'zero height must fail closed');
chk('judgePng.expectH-missing', jp({ expectH: null }).reason === 'png-height-missing',
  'no expectation means we cannot vouch');
chk('judgePng.strings-accepted', judgePng({ width: '390', expectH: '6639', pngW: '390', pngH: '6639' }).ok === true,
  'numeric strings from JSON should parse');

// --- 3) wiring in narrow-shot.js ---
chk('wiring.imports-pngSize', /require\('\.\/narrow-shot-verify'\)/.test(src) && /pngSize/.test(src),
  'pngSize not imported');
chk('wiring.imports-judgePng', /judgePng/.test(src), 'judgePng not imported');
chk('wiring.part-file', /OUT \+ '\.part-' \+ process\.pid/.test(src), 'no per-process part file');
chk('wiring.no-direct-write', !/fs\.writeFileSync\(OUT/.test(src), 'direct write to OUT came back');
chk('wiring.rename-to-out', /fs\.renameSync\(part, OUT\)/.test(src), 'no atomic rename onto OUT');
chk('wiring.part-cleaned-on-reject', /fs\.unlinkSync\(part\)/.test(src), 'rejected capture must delete its part');
{
  // order matters: header gate must sit between the part write and the rename,
  // otherwise a truncated capture lands on disk before anyone looks at it
  const writeAt = src.indexOf("fs.writeFileSync(part");
  const gateAt = src.indexOf('judgePng({');
  const renameAt = src.indexOf('fs.renameSync(part, OUT)');
  chk('wiring.gate-between-write-and-rename',
    writeAt > -1 && gateAt > writeAt && renameAt > gateAt,
    'write=' + writeAt + ' gate=' + gateAt + ' rename=' + renameAt);
}
chk('wiring.head-printed', /pnghead=/.test(src), 'png header not reported');
chk('wiring.json-carries-head', /png_w:\s*head\.w/.test(src), 'json payload lacks png head');
{
  // the SHORT path must not have been opened up: the measured gate still runs
  // before any capture at all
  const gateAt = src.indexOf("NARROW VERDICT: SHORT");
  const shotAt = src.indexOf('Page.captureScreenshot');
  chk('wiring.measure-gate-before-capture', gateAt > -1 && shotAt > gateAt,
    'capture=' + shotAt + ' gate=' + gateAt);
}

console.log('RESULT pass=' + pass + ' fail=' + fail);
process.exit(fail === 0 ? 0 : 1);