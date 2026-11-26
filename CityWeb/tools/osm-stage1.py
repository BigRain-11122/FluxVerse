#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
CityWeb - OSM stage-1 full pipeline  (lane A1 / POOL-CPU)

Pulls EVERY OSM building footprint in the Lujiazui + North Bund + Bund-edge
boxes (the same three boxes the incumbent 504-building puller used), quantizes
the rings to int degrees x 1e5, and emits ONE *self-registering* classic-script
slice so the WebGL2 viewer can load it from file:// (opaque origin).

Why self-registering: on file:// every fetch/XHR/module/Worker path is blocked
by CORS. A plain <script> is not. So the slice is a classic script whose only
job is to call window.__citySlice("core", data) -- or to park the payload on
window.__citySlices["core"] if the runtime is not listening yet.

Stdlib only (urllib). No third-party deps.

Usage:
    python tools/osm-stage1.py                # full run, reuses cached tiles
    python tools/osm-stage1.py --force        # ignore tile cache, refetch all
    python tools/osm-stage1.py --max-tiles 8  # incremental (network-limited) run
    python tools/osm-stage1.py --no-infer-default
                                              # strict: drop building if it has
                                              # neither height nor levels tag

Output: data/slices/shanghai-core-stage1.js
Cache : data/slices/_tiles/*.json   (idempotent: existing tiles are reused)
"""

import argparse
import datetime
import json
import math
import os
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

# ---------------------------------------------------------------- paths ----
HERE = Path(__file__).resolve().parent          # CityWeb/tools
ROOT = HERE.parent                              # CityWeb
SLICE_DIR = ROOT / "data" / "slices"
TILE_DIR = SLICE_DIR / "_tiles"
OUT_FILE = SLICE_DIR / "shanghai-core-stage1.js"

SLICE_ID = "core"

# --------------------------------------------------------------- config ----
# (name, south, west, north, east) -- identical to the incumbent puller's boxes.
REGIONS = [
    ("lujiazui", 31.2315, 121.4940, 31.2470, 121.5140),
    ("northbund", 31.2400, 121.4775, 31.2570, 121.4985),
    ("bund_edge", 31.2300, 121.4820, 31.2440, 121.4940),
]

# maps.mail.ru first (only mirror that answered consistently from CN, per the
# 2026-11-26 roadmap card), overpass-api.de as the fallback.
ENDPOINTS = [
    "https://maps.mail.ru/osm/tools/overpass/api/interpreter",
    "https://overpass-api.de/api/interpreter",
]

TILE_DEG = 0.006          # <= 0.006 x 0.006 grid, fetched sequentially
HTTP_TIMEOUT = 120        # seconds
HTTP_RETRIES = 2          # 2 retries => 3 attempts, rotating endpoints
TILE_SLEEP = 1.5          # seconds between network fetches

LEVEL_M = 3.2             # floor-to-floor metres, per the roadmap card
H_MIN = 3.0               # verify-slice.py accepts 3..700
H_MAX = 700.0

USER_AGENT = "FluxVerse-CityWeb-OSM-stage1/1.0 (+file:// city slice builder)"

# Roadmap fallback tiers (only used when --infer-default is on, i.e. the tile
# has no height and no levels tag). CBD core is tall, old town is low-rise,
# workers' new villages are mid-rise.
INFER_TIERS = [
    # (south, west, north, east, metres)
    (31.2315, 121.4980, 31.2470, 121.5140, 96.0),   # Lujiazui CBD core
    (31.2400, 121.4775, 31.2570, 121.4985, 42.0),   # North Bund
    (31.2300, 121.4820, 31.2440, 121.4940, 22.0),   # Bund edge / old town
]
INFER_DEFAULT_M = 18.0                               # last resort, low-rise

NUM_RE = re.compile(r"\d+(?:\.\d+)?")
FLOOR_RE = re.compile(r"-?\d+(?:\.\d+)?")

# ------------------------------------------------------------- geometry ----
def tile_intersects(box, region):
    s1, w1, n1, e1 = box
    s2, w2, n2, e2 = region
    return not (n1 <= s2 or s1 >= n2 or e1 <= w2 or w1 >= e2)


def build_tiles(step=TILE_DEG):
    """Deduplicated tile grid covering exactly the three region boxes."""
    seen = {}
    for _name, s, w, n, e in REGIONS:
        lat = math.floor(s / step) * step
        while lat < n - 1e-12:
            lon = math.floor(w / step) * step
            while lon < e - 1e-12:
                box = (round(lat, 6), round(lon, 6),
                       round(lat + step, 6), round(lon + step, 6))
                if tile_intersects(box, (s, w, n, e)):
                    key = (box[0], box[1])
                    seen.setdefault(key, box)
                lon = round(lon + step, 6)
            lat = round(lat + step, 6)
    return sorted(seen.values(), key=lambda b: (b[0], b[1]))


def union_bbox():
    s = min(r[1] for r in REGIONS)
    w = min(r[2] for r in REGIONS)
    n = max(r[3] for r in REGIONS)
    e = max(r[4] for r in REGIONS)
    return [round(s, 6), round(w, 6), round(n, 6), round(e, 6)]


def in_region(lat, lon, region):
    return region[1] <= lat <= region[3] and region[2] <= lon <= region[4]


def region_of(lat, lon):
    for r in REGIONS:
        if in_region(lat, lon, r):
            return r[0]
    return None


def infer_height(lat, lon):
    for s, w, n, e, h in INFER_TIERS:
        if s <= lat <= n and w <= lon <= e:
            return h
    return INFER_DEFAULT_M


# --------------------------------------------------------------- heights ----
def _to_metres(raw):
    """'492' / '492 m' / '1614 ft' / '12-15' / '~18,5' -> float or None."""
    if raw is None:
        return None
    s = str(raw).strip().lower()
    if not s:
        return None
    m = NUM_RE.search(s.replace(",", "."))
    if not m:
        return None
    try:
        val = float(m.group(0))
    except ValueError:
        return None
    if "ft" in s or "'" in s:
        val *= 0.3048
    return val if val > 0 else None


def _to_levels(raw):
    if raw is None:
        return None
    m = FLOOR_RE.search(str(raw))
    if not m:
        return None
    try:
        val = float(m.group(0))
    except ValueError:
        return None
    return val if val > 0 else None


def resolve_height(tags, lat, lon, infer_default):
    """(height, source) -- source is one of height/building:height/levels/infer."""
    for key in ("height", "building:height"):
        h = _to_metres(tags.get(key))
        if h:
            return h, key
    lv = _to_levels(tags.get("building:levels"))
    if not lv:
        lv = _to_levels(tags.get("building:levels:aboveground"))
    if lv:
        return lv * LEVEL_M, "levels"
    if infer_default:
        return infer_height(lat, lon), "infer"
    return None, None


# ---------------------------------------------------------------- rings ----
def quantize_ring(geom):
    """Overpass `geometry` -> [[latE5, lonE5], ...] closed ring, or None."""
    pts = []
    for node in geom:
        lat = node.get("lat")
        lon = node.get("lon")
        if lat is None or lon is None:
            return None
        q = (int(round(lat * 1e5)), int(round(lon * 1e5)))
        if not pts or pts[-1] != q:
            pts.append(q)
    if len(pts) >= 2 and pts[0] == pts[-1]:
        pts.pop()
    if len(pts) < 3:
        return None
    # Knuth-ish shoelace in E5 units; a zero area ring renders nothing.
    area2 = 0
    for i in range(len(pts)):
        x1, y1 = pts[i]
        x2, y2 = pts[(i + 1) % len(pts)]
        area2 += x1 * y2 - x2 * y1
    if area2 == 0:
        return None
    return [[p[0], p[1]] for p in pts]


# ---------------------------------------------------------------- HTTP ----
def _decode_json(raw):
    text = raw.decode("utf-8", "replace").lstrip("\ufeff \r\n\t")
    if not text.startswith("{"):
        raise RuntimeError("non-JSON body: %r" % text[:120])
    doc = json.loads(text)
    if "remark" in doc and "elements" not in doc:
        raise RuntimeError("overpass remark: %s" % str(doc["remark"])[:160])
    return doc


def _http(url, query, timeout):
    body = urllib.parse.urlencode({"data": query}).encode("utf-8")
    req = urllib.request.Request(url, data=body, headers={
        "User-Agent": USER_AGENT,
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept": "application/json",
    })
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            return _decode_json(resp.read())
    except (urllib.error.HTTPError, urllib.error.URLError, OSError):
        # Some mirrors only accept GET for small bodies; one GET retry here.
        get_url = url + "?" + urllib.parse.urlencode({"data": query})
        req = urllib.request.Request(get_url, headers={"User-Agent": USER_AGENT})
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            return _decode_json(resp.read())


def overpass(query, timeout=HTTP_TIMEOUT, retries=HTTP_RETRIES, log=print):
    last = None
    for attempt in range(retries + 1):
        ep = ENDPOINTS[attempt % len(ENDPOINTS)]
        host = urllib.parse.urlsplit(ep).netloc
        try:
            t0 = time.time()
            doc = _http(ep, query, timeout)
            log("      via %s  %.1fs" % (host, time.time() - t0))
            return doc
        except Exception as ex:                       # noqa: BLE001 - rotate on any failure
            last = ex
            log("      attempt %d/%d failed on %s: %s"
                % (attempt + 1, retries + 1, host, str(ex)[:120]))
            if attempt < retries:
                time.sleep(2.0 + attempt * 2.0)
    raise RuntimeError("all attempts failed: %s" % last)


def tile_query(box):
    s, w, n, e = box
    return (
        '[out:json][timeout:%d];\n'
        'way["building"](%.6f,%.6f,%.6f,%.6f);\n'
        'out geom;\n' % (HTTP_TIMEOUT, s, w, n, e)
    )


def tile_path(box):
    # all four coords in the name: a different --tile size must not reuse
    # a cache file that covers a different area.
    s, w, n, e = box
    return TILE_DIR / ("t_%.6f_%.6f_%.6f_%.6f.json" % (s, w, n, e))


# ----------------------------------------------------------------- main ----
def main(argv=None):
    ap = argparse.ArgumentParser(description="OSM stage-1 full pipeline -> self-registering city slice")
    ap.add_argument("--force", action="store_true", help="ignore the tile cache and refetch")
    ap.add_argument("--max-tiles", type=int, default=0, help="stop after N network fetches (0 = all)")
    ap.add_argument("--tile", type=float, default=TILE_DEG, help="tile size in degrees (max 0.006)")
    ap.add_argument("--no-infer-default", action="store_true",
                    help="strict: skip buildings with no height and no levels tag")
    ap.add_argument("--out", default=str(OUT_FILE), help="output slice path")
    args = ap.parse_args(argv)

    step = min(args.tile, TILE_DEG)
    infer_default = not args.no_infer_default

    TILE_DIR.mkdir(parents=True, exist_ok=True)
    tiles = build_tiles(step)
    ub = union_bbox()

    print("OSM stage-1 pipeline")
    print("  regions : %d  (lujiazui / northbund / bund_edge)" % len(REGIONS))
    print("  bbox    : %s" % (ub,))
    print("  tiles   : %d @ %.3f deg  (<= %.3f)" % (len(tiles), step, TILE_DEG))
    print("  height  : height > building:height > levels*%.1f%s"
          % (LEVEL_M, " > district tier" if infer_default else " > SKIP"))
    print("  cache   : %s" % TILE_DIR)
    print("")

    stats = {"cached": 0, "fetched": 0, "empty": 0, "failed": 0}
    failed_tiles = []
    fetched_now = 0
    t_start = time.time()

    for idx, box in enumerate(tiles, 1):
        path = tile_path(box)
        tag = "[%2d/%2d] %s" % (idx, len(tiles), "/".join("%.3f" % v for v in box))
        if path.exists() and not args.force:
            stats["cached"] += 1
            print("%s  cached (%d B)" % (tag, path.stat().st_size))
            continue
        if args.max_tiles and fetched_now >= args.max_tiles:
            print("%s  skipped (--max-tiles %d reached)" % (tag, args.max_tiles))
            continue
        if stats["fetched"] and TILE_SLEEP:
            time.sleep(TILE_SLEEP)
        print("%s  fetching ..." % tag)
        try:
            doc = overpass(tile_query(box))
        except Exception as ex:                       # noqa: BLE001 - keep going
            stats["failed"] += 1
            failed_tiles.append(box)
            print("%s  FAILED: %s" % (tag, str(ex)[:160]))
            continue
        path.write_text(json.dumps(doc, ensure_ascii=False), encoding="utf-8")
        n_el = len(doc.get("elements", []))
        stats["fetched"] += 1
        fetched_now += 1
        if n_el == 0:
            stats["empty"] += 1
            print("%s  ok, 0 ways" % tag)
        else:
            print("%s  ok, %d ways -> %d B" % (tag, n_el, path.stat().st_size))

    # ---- merge cached tiles -------------------------------------------------
    print("")
    print("merging %d cached tiles ..." % (stats["cached"] + stats["fetched"]))

    seen_ids = set()
    buildings = []
    per_region = {r[0]: 0 for r in REGIONS}
    skipped_no_height = 0
    skipped_geometry = 0
    skipped_outside = 0
    skipped_dup = 0
    clamped = 0
    src_count = {"height": 0, "building:height": 0, "levels": 0, "infer": 0}

    for box in tiles:
        path = tile_path(box)
        if not path.exists():
            continue
        try:
            doc = json.loads(path.read_text(encoding="utf-8"))
        except Exception as ex:                       # noqa: BLE001 - corrupt cache
            print("  WARN unreadable tile %s: %s" % (path.name, ex))
            stats["failed"] += 1
            failed_tiles.append(box)
            continue
        for el in doc.get("elements", []):
            if el.get("type") != "way":
                continue
            wid = el.get("id")
            if wid in seen_ids:
                skipped_dup += 1
                continue
            tags = el.get("tags") or {}
            if not tags.get("building") or tags.get("building") == "no":
                continue
            geom = el.get("geometry")
            if not geom:
                skipped_geometry += 1
                continue
            ring = quantize_ring(geom)
            if ring is None:
                skipped_geometry += 1
                continue
            # centroid decides region ownership (first region hit wins)
            clat = sum(p[0] for p in ring) / len(ring) / 1e5
            clon = sum(p[1] for p in ring) / len(ring) / 1e5
            reg = region_of(clat, clon)
            if reg is None:
                skipped_outside += 1
                continue
            h, src = resolve_height(tags, clat, clon, infer_default)
            if h is None:
                skipped_no_height += 1
                continue
            if h < H_MIN:
                h, clamped = H_MIN, clamped + 1
            elif h > H_MAX:
                h, clamped = H_MAX, clamped + 1
            seen_ids.add(wid)
            name = (tags.get("name") or tags.get("name:en") or "").strip()
            # key order is the on-the-wire order: n, h, r (r = [[latE5, lonE5]])
            rec = {"n": name, "h": round(h, 1), "r": ring} if name \
                else {"h": round(h, 1), "r": ring}
            buildings.append((reg, rec))
            per_region[reg] += 1
            src_count[src] = src_count.get(src, 0) + 1

    order = {r[0]: i for i, r in enumerate(REGIONS)}
    buildings.sort(key=lambda x: (order[x[0]], -x[1]["h"], x[1].get("n", "")))
    recs = [b[1] for b in buildings]

    data = {
        "gen_utc": datetime.datetime.now(datetime.timezone.utc)
                   .strftime("%Y-%m-%dT%H:%M:%SZ"),
        "bbox": ub,
        "count": len(recs),
        "buildings": recs,
    }
    payload = json.dumps(data, ensure_ascii=False, separators=(",", ":"))

    js = (
        "/* CityWeb OSM stage-1 slice -- Lujiazui + North Bund + Bund edge.\n"
        " * generated: " + data["gen_utc"] + "  buildings: " + str(data["count"]) + "\n"
        " * Self-registering classic script (JSONP style). Load it with a plain\n"
        " * <script src> tag: file:// blocks fetch/XHR/modules, but not scripts.\n"
        " * No network calls, no fetch(), no imports.\n"
        " */\n"
        ";(function(){var d=" + payload + ";"
        "if(window.__citySlice)window.__citySlice(\"" + SLICE_ID + "\",d);"
        "else(window.__citySlices=window.__citySlices||{})[\"" + SLICE_ID + "\"]=d;"
        "})();\n"
    )

    out_path = Path(args.out)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(js, encoding="utf-8")
    nbytes = out_path.stat().st_size

    # ---- summary ------------------------------------------------------------
    dur = time.time() - t_start
    print("")
    print("=" * 62)
    print("SUMMARY")
    print("=" * 62)
    print("  buildings emitted : %d" % data["count"])
    print("  payload bytes     : %d  (%.2f MB)  -> %s"
          % (nbytes, nbytes / 1048576.0, out_path))
    print("  bytes per building: %.1f" % (nbytes / max(1, data["count"])))
    for name, _s, _w, _n, _e in REGIONS:
        print("  region %-10s : %d" % (name, per_region[name]))
    print("  height sources    : %s" % ", ".join("%s=%d" % (k, v) for k, v in src_count.items() if v))
    print("  tiles             : %d total | %d fetched now | %d cached | %d empty | %d FAILED"
          % (len(tiles), stats["fetched"], stats["cached"], stats["empty"], stats["failed"]))
    print("  skipped           : no-height=%d geometry=%d outside-bbox=%d duplicate=%d"
          % (skipped_no_height, skipped_geometry, skipped_outside, skipped_dup))
    print("  clamped 3..700    : %d" % clamped)
    print("  elapsed           : %.1f s" % dur)
    if failed_tiles:
        print("  failed tile boxes :")
        for b in failed_tiles:
            print("    %s" % ("/".join("%.3f" % v for v in b),))
    print("")
    print("  next: python tools/verify-slice.py")
    return 0 if not failed_tiles else 2


if __name__ == "__main__":
    sys.exit(main())
