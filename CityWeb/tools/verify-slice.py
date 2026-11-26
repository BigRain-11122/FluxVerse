#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
CityWeb - slice verifier  (lane A1)

Reads the emitted self-registering slice, pulls the JSON back out with a
brace-balanced scan (not a fragile regex), and validates the stage-1 contract:

  * classic-script, self-registering, NO network paths (file:// law)
  * JSON parses; count == len(buildings)
  * bbox present and equal to the three-region union
  * per building: n/h/r shape, h in 3..700, r has >= 3 unique int points
  * every ring centroid inside a declared region (strict)
  * every coordinate inside the union bbox + a documented edge margin
    (Overpass returns a way if ANY node is in the box, so an edge building's
    ring can legitimately poke out by ~200 m; we bound and report that)

Usage:
    python tools/verify-slice.py [path]

Exit code 0 = PASS, 1 = FAIL.
"""

import json
import re
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent
DEFAULT_SLICE = ROOT / "data" / "slices" / "shanghai-core-stage1.js"

# Independent copy of the contract (deliberately not imported from the builder:
# a verifier that shares the producer's constants cannot catch the producer).
REGIONS = [
    ("lujiazui", 31.2290, 121.4940, 31.2490, 121.5260),
    ("northbund", 31.2380, 121.4740, 31.2660, 121.4990),
    ("bund_edge", 31.2290, 121.4800, 31.2450, 121.4950),
]
SLICE_ID = "core"
H_MIN, H_MAX = 3.0, 700.0
EDGE_MARGIN = 0.004          # degrees, for rings that overhang the query box
CENTROID_TOL = 1.5e-4        # degrees, absorbs the E5 quantization of a centroid
MAX_REPORTED = 6             # sample size for each failure bucket

FORBIDDEN = [
    ("fetch(", "network fetch (blocked on file://)"),
    ("XMLHttpRequest", "XHR (blocked on file://)"),
    ("importScripts", "worker import (blocked on file://)"),
    ("new Worker", "worker (blocked on file://)"),
    ("import(", "dynamic import (blocked on file://)"),
]

TAIL_RE = re.compile(
    r'if\s*\(\s*window\.__citySlice\s*\)\s*window\.__citySlice\(\s*"'
    + SLICE_ID +
    r'"\s*,\s*d\s*\)\s*;?\s*else\s*\(\s*window\.__citySlices\s*=\s*window\.__citySlices\s*\|\|\s*\{\s*\}\s*\)'
    r'\s*\[\s*"' + SLICE_ID + r'"\s*\]\s*=\s*d\s*;'
)


class Checker:
    def __init__(self):
        self.fails = []

    def check(self, ok, label, detail=""):
        if not ok:
            self.fails.append((label, detail))
        return ok


def union_bbox():
    s = min(r[1] for r in REGIONS)
    w = min(r[2] for r in REGIONS)
    n = max(r[3] for r in REGIONS)
    e = max(r[4] for r in REGIONS)
    return [s, w, n, e]


def extract_json(js):
    """Brace-balanced scan of `var d={...};` -> str or (None, reason)."""
    m = re.search(r"var\s+d\s*=\s*\{", js)
    if not m:
        return None, "anchor `var d={` not found"
    start = js.index("{", m.start())
    depth = 0
    in_str = False
    esc = False
    for i in range(start, len(js)):
        ch = js[i]
        if in_str:
            if esc:
                esc = False
            elif ch == "\\":
                esc = True
            elif ch == '"':
                in_str = False
            continue
        if ch == '"':
            in_str = True
        elif ch == "{":
            depth += 1
        elif ch == "}":
            depth -= 1
            if depth == 0:
                return js[start:i + 1], None
    return None, "unbalanced braces (string never closed?)"


def strip_comments(s):
    """Remove /* */ and // comments, leaving code + string literals intact.

    The slice's own header says "no fetch()" -- a naive substring scan would
    flag the documentation. Scan the code, not the prose.
    """
    out = []
    i, n = 0, len(s)
    in_str = esc = False
    while i < n:
        ch = s[i]
        if in_str:
            out.append(ch)
            if esc:
                esc = False
            elif ch == "\\":
                esc = True
            elif ch == '"':
                in_str = False
            i += 1
            continue
        if ch == '"':
            in_str = True
            out.append(ch)
            i += 1
            continue
        if s.startswith("/*", i):
            j = s.find("*/", i + 2)
            i = n if j < 0 else j + 2
            continue
        if s.startswith("//", i):
            j = s.find("\n", i)
            i = n if j < 0 else j
            continue
        out.append(ch)
        i += 1
    return "".join(out)


def in_box(lat, lon, box, tol=0.0):
    s, w, n, e = box
    return (s - tol) <= lat <= (n + tol) and (w - tol) <= lon <= (e + tol)


def region_of(lat, lon, tol=CENTROID_TOL):
    for r in REGIONS:
        if in_box(lat, lon, (r[1], r[2], r[3], r[4]), tol):
            return r[0]
    return None


def is_int(v):
    return isinstance(v, int) and not isinstance(v, bool)


def main(argv):
    path = Path(argv[1]) if len(argv) > 1 else DEFAULT_SLICE
    ck = Checker()

    print("verify-slice: %s" % path)
    if not ck.check(path.exists(), "file exists", str(path)):
        print("FAIL  file exists -> %s" % path)
        return 1

    raw = path.read_bytes()
    js = raw.decode("utf-8", "replace")
    print("  bytes           : %d (%.2f MB)" % (len(raw), len(raw) / 1048576.0))

    # ---- 1. file:// law -----------------------------------------------------
    code = strip_comments(js)
    for token, why in FORBIDDEN:
        hit = code.find(token)
        ck.check(hit < 0, "no `%s`" % token,
                 "found at offset %d (%s)" % (hit, why) if hit >= 0 else "")

    # ---- 2. self-registering tail -------------------------------------------
    tail_ok = TAIL_RE.search(js) is not None
    ck.check(tail_ok, "self-registering tail",
             "expected: if(window.__citySlice)window.__citySlice(\"core\",d);"
             "else(window.__citySlices=window.__citySlices||{})[\"core\"]=d;")
    ck.check(js.lstrip().startswith("/*") or js.lstrip().startswith(";("),
             "classic script (no ESM export/import)")

    # ---- 3. JSON payload ----------------------------------------------------
    blob, err = extract_json(js)
    if not ck.check(blob is not None, "JSON extractable", err or ""):
        print("FAIL  JSON extractable -> %s" % err)
        return 1

    try:
        data = json.loads(blob)
        parsed = True
    except Exception as ex:                            # noqa: BLE001
        parsed = False
        data = {}
        ck.check(False, "JSON parses", str(ex))
    if not parsed:
        print("FAIL  JSON parses")
        return 1

    ck.check(isinstance(data, dict), "payload is an object")
    for key in ("gen_utc", "bbox", "count", "buildings"):
        ck.check(key in data, "key `%s` present" % key)

    gen = data.get("gen_utc", "")
    ck.check(isinstance(gen, str) and re.match(r"^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$", gen or ""),
             "gen_utc is ISO-8601 UTC", repr(gen))

    # ---- 4. bbox matches the three-region union -----------------------------
    want = union_bbox()
    got = data.get("bbox")
    bbox_ok = (isinstance(got, list) and len(got) == 4
               and all(isinstance(v, (int, float)) for v in got)
               and all(abs(float(a) - b) <= 1e-5 for a, b in zip(got, want)))
    ck.check(bbox_ok, "bbox == union of 3 regions",
             "want %s got %s" % (want, got))

    # ---- 5. buildings -------------------------------------------------------
    bs = data.get("buildings")
    if not ck.check(isinstance(bs, list), "buildings is a list"):
        print("FAIL  buildings is a list")
        return 1
    ck.check(data.get("count") == len(bs), "count matches buildings length",
             "count=%r len=%d" % (data.get("count"), len(bs)))
    ck.check(len(bs) > 0, "non-empty slice")

    bad_h, bad_r, bad_pt, bad_centroid, outside = [], [], [], [], []
    uniq = set()
    worst_over = 0.0
    named = 0
    hmax = 0.0
    ub = (want[0] - EDGE_MARGIN, want[1] - EDGE_MARGIN,
          want[2] + EDGE_MARGIN, want[3] + EDGE_MARGIN)

    for i, b in enumerate(bs):
        if not isinstance(b, dict):
            bad_r.append((i, "record is not an object"))
            continue
        n = b.get("n", "")
        if n:
            named += 1
            if not isinstance(n, str) or len(n) > 200:
                bad_r.append((i, "bad name %r" % (n,)))
        h = b.get("h")
        if not isinstance(h, (int, float)) or isinstance(h, bool):
            bad_h.append((i, "h not numeric: %r" % (h,)))
        elif not (H_MIN <= float(h) <= H_MAX):
            bad_h.append((i, "h=%.2f out of [%.0f,%.0f]" % (h, H_MIN, H_MAX)))
        else:
            hmax = max(hmax, float(h))

        r = b.get("r")
        if not isinstance(r, list) or len(r) < 3:
            bad_r.append((i, "ring len=%r" % (len(r) if isinstance(r, list) else r,)))
            continue
        pts = []
        ok_pts = True
        prev = None
        for p in r:
            if (not isinstance(p, list) or len(p) != 2
                    or not is_int(p[0]) or not is_int(p[1])):
                bad_pt.append((i, "non-int pair %r" % (p,)))
                ok_pts = False
                continue
            if prev is not None and (p[0], p[1]) == prev:
                bad_pt.append((i, "consecutive duplicate %r" % (p,)))
                ok_pts = False
            prev = (p[0], p[1])
            pts.append((p[0] / 1e5, p[1] / 1e5))
        if not ok_pts or len(pts) < 3:
            continue
        if not in_box(pts[0][0], pts[0][1], ub):
            outside.append((i, "first point %.6f,%.6f" % pts[0]))

        clat = sum(p[0] for p in pts) / len(pts)
        clon = sum(p[1] for p in pts) / len(pts)
        if region_of(clat, clon) is None:
            bad_centroid.append((i, "centroid %.6f,%.6f" % (clat, clon)))
        for lat, lon in pts:
            if not in_box(lat, lon, ub):
                over = max(ub[0] - lat, ub[1] - lon, lat - ub[2], lon - ub[3])
                worst_over = max(worst_over, over)

        key = (b.get("h"), len(r), r[0][0], r[0][1], len(pts))
        uniq.add((key, clat, clon))

    ck.check(not bad_h, "all heights in 3..700",
             "%d bad, e.g. %s" % (len(bad_h), bad_h[:MAX_REPORTED]) if bad_h else "")
    ck.check(not bad_r, "all rings valid (>=3 pts)",
             "%d bad, e.g. %s" % (len(bad_r), bad_r[:MAX_REPORTED]) if bad_r else "")
    ck.check(not bad_pt, "all coords are int E5 pairs, no dupes",
             "%d bad, e.g. %s" % (len(bad_pt), bad_pt[:MAX_REPORTED]) if bad_pt else "")
    ck.check(not bad_centroid, "all centroids inside a declared region",
             "%d bad, e.g. %s" % (len(bad_centroid), bad_centroid[:MAX_REPORTED]) if bad_centroid else "")
    ck.check(not outside, "all ring points inside bbox + %.3f deg margin" % EDGE_MARGIN,
             "%d bad, e.g. %s (worst overshoot %.6f)"
             % (len(outside), outside[:MAX_REPORTED], worst_over) if outside else "")

    # ---- 6. report ----------------------------------------------------------
    print("  buildings       : %d" % len(bs))
    print("  named           : %d (%.1f%%)" % (named, 100.0 * named / max(1, len(bs))))
    print("  tallest         : %.1f m" % hmax)
    print("  bbox            : %s" % (got,))
    print("  gen_utc         : %s" % gen)
    print("")

    if ck.fails:
        print("FAIL  %d check(s) failed:" % len(ck.fails))
        for label, detail in ck.fails:
            print("  - %s" % label + (("  :: " + detail) if detail else ""))
        return 1

    print("PASS  %d buildings, %d bytes, all checks green" % (len(bs), len(raw)))
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
