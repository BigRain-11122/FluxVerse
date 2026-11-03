// narrow-shot-verify.js - single source of truth for "is this narrow measurement real?"
//
// Why this exists (queue main#51): narrow-shot.js once reported
// `NARROW VERDICT: OK` for a 390px run that had actually attached to another
// instance's 1400px page (docH=844 vs a real 6679px document), so the shot was
// the first screen only and the gate still passed. A false green here is worse
// than a red: it hides panel breakage behind a "measured" claim.
//
// Two independent readings must agree before we trust a frame:
//   - Emulation width vs document.documentElement.clientWidth (self-check that
//     the viewport override really landed; a mismatch means we are looking at
//     somebody else's page).
//   - Page.getLayoutMetrics contentSize height vs the DOM scrollHeight.
// Plus the "short page that is obviously not short" tell: a content height
// under 800px while the page still has >20 rows of body text.
//
// Second face (queue main#80/main#81): the png that lands on disk is checked by
// its own IHDR header before the write is allowed to become the real file, and
// the write itself is a `part -> rename` replace so a concurrent instance or a
// crashed run can never leave half a png at the output path.
//
// Pure function, no I/O, so the judge itself can be pinned by a sandbox test.
'use strict';

const DEFAULTS = {
  maxDiffRatio: 0.02,   // >2% disagreement between the two height readings
  shortH: 800,          // a "full page" under this is suspicious
  minRows: 20,          // ... only when the body clearly has many rows
  minRowH: 12,          // px per row a page with that many rows cannot go under
  widthTolerance: 1,    // emulation width vs clientWidth rounding
  pngHeightTolerance: 2 // clip height vs IHDR height (pixel rounding)
};

// PNG signature + IHDR header (queue main#81). The measurement above only says
// what the page claimed; the file on disk is the thing a reader will trust, so
// its own header has to agree. Returns null for anything that is not a
// well-formed PNG header - callers treat that as "cannot vouch", never as OK.
const PNG_SIG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

function pngSize(buf) {
  if (!buf || !buf.length || buf.length < 24) return null;
  for (let i = 0; i < PNG_SIG.length; i++) {
    if (buf[i] !== PNG_SIG[i]) return null;
  }
  if (buf.toString('ascii', 12, 16) !== 'IHDR') return null;
  const w = buf.readUInt32BE(16);
  const h = buf.readUInt32BE(20);
  if (!w || !h) return null;
  return { w: w, h: h };
}

// judgePng({ width, expectW, expectH, pngW, pngH }) - does the captured file
// match the frame we measured? A forced clip or a DPR change truncates the
// image silently, which would otherwise ship a short png with an OK verdict.
function judgePng(obs, opts) {
  const o = Object.assign({}, DEFAULTS, opts || {});
  const width = num(obs && obs.width);
  const expectW = num(obs && obs.expectW) === null ? width : num(obs && obs.expectW);
  const expectH = num(obs && obs.expectH);
  const pngW = num(obs && obs.pngW);
  const pngH = num(obs && obs.pngH);

  if (pngW === null || pngH === null || pngW <= 0 || pngH <= 0) {
    return bad('png-unreadable', 'pngW=' + String(obs && obs.pngW) + ' pngH=' + String(obs && obs.pngH));
  }
  if (expectW !== null && Math.abs(pngW - expectW) > o.widthTolerance) {
    return bad('png-width-mismatch', 'pngW=' + pngW + ' expectW=' + expectW);
  }
  if (expectH === null || expectH <= 0) {
    return bad('png-height-missing', 'expectH=' + String(obs && obs.expectH));
  }
  const diff = Math.abs(pngH - expectH);
  const detail = 'png=' + pngW + 'x' + pngH + ' expect=' + String(expectW) + 'x' + expectH + ' diff=' + diff;
  if (diff > o.pngHeightTolerance) return bad('png-height-mismatch', detail);
  return { ok: true, reason: '', detail: detail, diff: diff };
}

function num(v) {
  if (typeof v === 'number') return Number.isFinite(v) ? v : null;
  if (typeof v === 'string' && v.trim() !== '') {
    const n = parseInt(v, 10);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

function bad(reason, detail) {
  return { ok: false, reason: reason, detail: detail, diff: null };
}

function judge(obs, opts) {
  const o = Object.assign({}, DEFAULTS, opts || {});
  const width = num(obs && obs.width);
  const clientW = num(obs && obs.clientW);
  const domH = num(obs && obs.domH);
  const contentH = num(obs && obs.contentH);
  const rowCount = num(obs && obs.rowCount);

  if (width === null || clientW === null) {
    return bad('width-missing', 'width=' + String(obs && obs.width) + ' clientW=' + String(obs && obs.clientW));
  }
  if (Math.abs(clientW - width) > o.widthTolerance) {
    return bad('width-mismatch', 'asked=' + width + ' clientW=' + clientW);
  }
  if (contentH === null || contentH <= 0) {
    return bad('height-missing', 'contentH=' + String(obs && obs.contentH));
  }
  if (domH === null || domH <= 0) {
    return bad('height-missing', 'domH=' + String(obs && obs.domH));
  }
  if (contentH < o.shortH) {
    // Fail closed: under the short threshold we can only clear the reading by
    // proving the page really is short (few rows). An uncountable page is not
    // proven short, so it must not earn an OK badge.
    if (rowCount === null) return bad('rows-missing', 'contentH=' + contentH + ' rows=unknown');
    if (rowCount > o.minRows) return bad('height-too-short', 'contentH=' + contentH + ' rows=' + rowCount);
  }
  // r807: a page that measured ZERO body rows has not rendered its content yet -
  // that is a slow start, not a short page. Live evidence 2026-11-04: right after
  // a rebuild the frame read `domH=844 rows=0` (the next run read 7064px), and
  // 844 clears the absolute floor so nothing above had anything to say. Null rows
  // stay allowed when the page is tall (row count simply does not matter there);
  // a measured zero does not.
  if (rowCount === 0) return bad('rows-zero', 'contentH=' + contentH + ' rows=0');
  // r807: the absolute floor above only covers pages under 800px. A frame that
  // measured 89 rows inside 844px sailed through it and earned an OK badge for a
  // half-rendered page (live observation on 2026-11-04 right after a rebuild;
  // the next run measured 7064px). Row count and height have to be consistent
  // with each other, not just with a magic 800: no row of this page can be
  // thinner than minRowH, so a page claiming many rows must be at least
  // rows*minRowH tall. 12px sits far below the real ~79px/row and far above the
  // broken frame's ~9.5px, so neither a dense redesign nor a slow start passes
  // by accident.
  if (rowCount !== null && rowCount > o.minRows) {
    const implied = rowCount * o.minRowH;
    if (contentH < implied) {
      return bad('rows-implied-short', 'contentH=' + contentH + ' rows=' + rowCount + ' min=' + implied);
    }
  }
  const hi = Math.max(domH, contentH);
  const lo = Math.min(domH, contentH);
  const diff = (hi - lo) / hi;
  const detail = 'domH=' + domH + ' contentH=' + contentH + ' diff=' + diff.toFixed(4);
  if (diff > o.maxDiffRatio) return bad('height-disagree', detail);
  return { ok: true, reason: '', detail: detail, diff: diff };
}

module.exports = { judge: judge, judgePng: judgePng, pngSize: pngSize, DEFAULTS: DEFAULTS };