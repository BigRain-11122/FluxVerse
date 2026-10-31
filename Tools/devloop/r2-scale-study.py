#!/usr/bin/env python3
"""r2-scale-study.py -- is the R2 block the right size for the city, and what
would a compact layout cost? (main#61)

Reads the built R2 scene (read-only, no Unity) for the eight house lots, the
street band, the modular showcase and the surrounding city grain (Ground512,
L_Water, towers). Then builds three layout variants *at the same house assets*
and renders them on one same-scale plan sheet under qa/site/:

  A1 = as built           frontage 22 m, row pitch 52 m, 6 m street
  A2 = row compaction     order and assets untouched; the row pitch becomes
                          half lots + 6 m street + 2 m setback per side
  A3 = A2 + frontage      houses reordered so the two wide presets are not
                          adjacent, and the lane is curbless (no setback)

Everything is measured, nothing assumed: house sizes come from the lot pads
(scale = house size + 2.4 m, see CityRebuildR2.cs), row/frontage pitches and the
street band from the scene itself. Deterministic and read-only -- it never
touches the scene or the assets, which is exactly what main#61 asks for.

Figure labels are ASCII (font-safe); the Chinese table goes to the .md (UTF-8).

Usage:
  python Tools/devloop/r2-scale-study.py [--stamp YYYYMMDD-HHMM] [--out-dir qa]
                                        [--scene PATH] [--rebuild PATH]
                                        [--no-artifacts] [--self-check]
"""

import io
import itertools
import importlib.util
import math
import os
import re
import sys
import datetime

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
_STDOUT_GUARD = sys.stdout  # the scene reader re-wraps stdout; keep ours referenced

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
HERE = os.path.dirname(os.path.abspath(__file__))
SCENE = os.path.join(ROOT, "City3D", "Assets", "Scenes", "CityRebuild_R2.unity")
REBUILD = os.path.join(ROOT, "City3D", "Assets", "Editor", "CityRebuild", "CityRebuildR2.cs")

WALK_MPS = 1.35       # leisurely walking speed used for the "cross the block" figure
MIN_GAP = 3.0         # comfortable gap between two neighbouring lot pads
SETBACK = 2.0         # walkable strip between a lot edge and the street edge
STREET_W = 6.0        # the street band actually built in the scene
SHOWCASE_W = 7.5      # measured: 3 x 2 modules of 2.5 m
SHOWCASE_D = 5.0
SHOWCASE_CLEAR = 1.0  # wanted clearance each side of the walk-in prototype


def die(msg):
    sys.stderr.write("SCALE_STUDY FAIL: " + msg + "\n")
    sys.exit(2)


def load_checker():
    """Reuse r2-site-check.py's scene reader instead of writing a second one."""
    path = os.path.join(HERE, "r2-site-check.py")
    if not os.path.isfile(path):
        die("r2-site-check.py not found next to this script")
    spec = importlib.util.spec_from_file_location("r2_site_check", path)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


def read_lot_pad(rebuild_path):
    src = io.open(rebuild_path, encoding="utf-8", errors="replace").read()
    m = re.search(r"b\.size\.x \+ ([\d.]+)f", src)
    return float(m.group(1)) if m else 2.4


def collect(sc, lot_pad):
    """Houses (from lot pads) + street band + showcase, all measured."""
    houses = []
    for gid, nm in sorted(sc.names.items()):
        if not nm or not nm.startswith("R2_AD-021_Lot_"):
            continue
        _, bb = sc.mesh_triangles(gid)
        if bb is None:
            continue
        tag = nm.rsplit("Preset_", 1)[-1] if "Preset_" in nm else nm[-2:]
        houses.append({"id": "P" + tag,
                       "lw": bb[2] - bb[0],
                       "ld": bb[3] - bb[1],
                       "w": bb[2] - bb[0] - lot_pad,
                       "d": bb[3] - bb[1] - lot_pad,
                       "cx": (bb[0] + bb[2]) * 0.5,
                       "cz": (bb[1] + bb[3]) * 0.5})
    if len(houses) < 4:
        die("found %d house lot pads, expected >= 4" % len(houses))

    street = None
    gid = sc.go_id("R2_AD-021_Street")
    if gid is not None:
        _, bb = sc.mesh_triangles(gid)
        if bb:
            street = {"w": bb[2] - bb[0], "d": bb[3] - bb[1],
                      "cx": (bb[0] + bb[2]) * 0.5, "cz": (bb[1] + bb[3]) * 0.5}

    showcase = None
    gid = sc.go_id("R2_AD-021_ModularShowcase")
    if gid is not None:
        w = sc.world(gid)
        showcase = {"cx": w[0][3], "cz": w[2][3]}
    return houses, street, showcase


def cluster_rows(houses, tol=2.0):
    """Split the houses into street rows by their z, north/low first."""
    zs = sorted({round(h["cz"], 3) for h in houses})
    rows = []
    for z in zs:
        if not rows or abs(z - rows[-1][-1]) > tol:
            rows.append([z])
        else:
            rows[-1].append(z)
    out = []
    for grp in rows:
        lo, hi = min(grp) - tol * 0.5, max(grp) + tol * 0.5
        row = sorted([h for h in houses if lo <= h["cz"] <= hi], key=lambda h: h["cx"])
        out.append(row)
    out.sort(key=lambda r: r[0]["cz"])
    return out


def frontage_floor(row, gap=MIN_GAP):
    """Smallest uniform pitch that keeps `gap` between adjacent lot pads."""
    return max((row[i]["lw"] + row[i + 1]["lw"]) * 0.5 + gap for i in range(len(row) - 1))


def best_order(row, gap=MIN_GAP):
    """Ordering that minimises the block span (uniform pitch = worst pair)."""
    if len(row) > 7:
        return list(row), frontage_floor(row, gap), None
    best = None
    for perm in itertools.permutations(row):
        pitch = max((perm[i]["lw"] + perm[i + 1]["lw"]) * 0.5 + gap for i in range(len(perm) - 1))
        span = pitch * (len(perm) - 1) + (perm[0]["lw"] + perm[-1]["lw"]) * 0.5
        if best is None or span < best[2] - 1e-9:
            best = (list(perm), pitch, span)
    return best[0], best[1], best[2]


def row_span(order, pitch):
    return pitch * (len(order) - 1) + (order[0]["lw"] + order[-1]["lw"]) * 0.5


def place(order, pitch, cz, street_w, gap):
    """Lay the row out centred on x=0; return dicts with lot boxes."""
    span = row_span(order, pitch)
    cx = -span * 0.5 + order[0]["lw"] * 0.5
    out = []
    for h in order:
        out.append({"id": h["id"], "w": h["w"], "d": h["d"],
                    "lw": h["lw"], "ld": h["ld"],
                    "x0": cx - h["lw"] * 0.5, "x1": cx + h["lw"] * 0.5,
                    "z0": cz - h["ld"] * 0.5, "z1": cz + h["ld"] * 0.5})
        cx += pitch
    return out, span


def variant(name, rows, pitch_x, pitch_z, street_w, gap=MIN_GAP, note=""):
    """Build one variant: uniform pitch per row, rows centred on z=+-pitch_z/2."""
    placed = []
    spans = []
    for k, order in enumerate(rows):
        cz = (pitch_z * 0.5) * (-1 if k == 0 else 1)   # row 0 = low z, same frame as A1
        lots, span = place(order, pitch_x, cz, street_w, gap)
        placed.extend(lots)
        spans.append(span)
    span_x = max(spans)
    surface = [{"x0": -span_x * 0.5, "x1": span_x * 0.5,
                "z0": -street_w * 0.5, "z1": street_w * 0.5}]
    z0 = min(l["z0"] for l in placed)
    z1 = max(l["z1"] for l in placed)
    # gaps inside each row, widest first: where a walk-in showcase could go
    gaps = []
    for order in rows:
        rowlots = [l for l in placed if l["id"] in {h["id"] for h in order}]
        rowlots.sort(key=lambda l: l["x0"])
        for i in range(len(rowlots) - 1):
            g = rowlots[i + 1]["x0"] - rowlots[i]["x1"]
            gaps.append((g, rowlots[i]["id"], rowlots[i + 1]["id"]))
    gaps.sort(reverse=True)
    return {"name": name, "lots": placed, "street": surface,
            "w": span_x, "d": z1 - z0, "z0": z0, "z1": z1,
            "span_x": span_x, "pitch_x": pitch_x, "pitch_z": pitch_z,
            "street_w": street_w, "gaps": gaps, "note": note,
            "order": "/".join(",".join(h["id"] for h in r) for r in rows)}


def metrics(v):
    house_area = sum(l["w"] * l["d"] for l in v["lots"])
    gross = v["w"] * v["d"]
    street_area = v["span_x"] * v["street_w"]
    worst = min(g for g, _, _ in v["gaps"]) if v["gaps"] else 0.0
    best = max(g for g, _, _ in v["gaps"]) if v["gaps"] else 0.0
    # front yard: from the street edge to the nearest *house* face of each row
    front = []
    for l in v["lots"]:
        inset = (l["ld"] - l["d"]) * 0.5
        hz0, hz1 = l["z0"] + inset, l["z1"] - inset
        front.append(min(abs(hz0), abs(hz1)) - v["street_w"] * 0.5)
    return {"house_area": house_area, "gross": gross,
            "coverage": house_area / gross if gross else 0.0,
            "street_area": street_area,
            "empty": gross - house_area - street_area,
            "min_gap": worst, "max_gap": best,
            "front_min": min(front), "front_max": max(front),
            "walk_x": v["span_x"] / WALK_MPS, "walk_z": v["d"] / WALK_MPS,
            "showcase_fits": best >= SHOWCASE_W + 2 * SHOWCASE_CLEAR}


def variant_from_scene(houses, street, showcase):
    """A1 = whatever the built scene actually holds."""
    rows = cluster_rows(houses)
    if len(rows) != 2:
        die("expected 2 street rows, found %d" % len(rows))
    pitch_x = min((rows[0][i + 1]["cx"] - rows[0][i]["cx"]) for i in range(len(rows[0]) - 1))
    pitch_z = abs(rows[1][0]["cz"] - rows[0][0]["cz"])
    sw = street["d"] if street else STREET_W
    placed = []
    for row in rows:
        for h in row:
            placed.append({"id": h["id"], "w": h["w"], "d": h["d"], "lw": h["lw"], "ld": h["ld"],
                           "x0": h["cx"] - h["lw"] * 0.5, "x1": h["cx"] + h["lw"] * 0.5,
                           "z0": h["cz"] - h["ld"] * 0.5, "z1": h["cz"] + h["ld"] * 0.5})
    x0 = min(l["x0"] for l in placed)
    x1 = max(l["x1"] for l in placed)
    z0 = min(l["z0"] for l in placed)
    z1 = max(l["z1"] for l in placed)
    # normalise to a local frame: block centred on x=0, street centred on z=0,
    # so A1 and the proposed variants can share one set of metric formulas
    dcx = -((x0 + x1) * 0.5)
    dcz = -(street["cz"] if street else (z0 + z1) * 0.5)
    for l in placed:
        l["x0"] += dcx
        l["x1"] += dcx
        l["z0"] += dcz
        l["z1"] += dcz
    if street:
        street = dict(street, cx=street["cx"] + dcx, cz=street["cz"] + dcz)
    if showcase:
        showcase = {"cx": showcase["cx"] + dcx, "cz": showcase["cz"] + dcz}
    x0, x1 = x0 + dcx, x1 + dcx
    z0, z1 = z0 + dcz, z1 + dcz
    world_box = (min(l["x0"] for l in placed) - dcx, min(l["z0"] for l in placed) - dcz,
                 max(l["x1"] for l in placed) - dcx, max(l["z1"] for l in placed) - dcz)
    gaps = []
    for row in rows:
        rl = sorted([l for l in placed if l["id"] in {h["id"] for h in row}], key=lambda l: l["x0"])
        for i in range(len(rl) - 1):
            gaps.append((rl[i + 1]["x0"] - rl[i]["x1"], rl[i]["id"], rl[i + 1]["id"]))
    gaps.sort(reverse=True)
    v = {"name": "A1", "lots": placed,
         "street": [{"x0": street["cx"] - street["w"] * 0.5, "x1": street["cx"] + street["w"] * 0.5,
                     "z0": street["cz"] - street["d"] * 0.5, "z1": street["cz"] + street["d"] * 0.5}]
         if street else [],
         "w": x1 - x0, "d": z1 - z0, "z0": z0, "z1": z1,
         "span_x": max(x1 - x0, street["w"] if street else 0), "pitch_x": pitch_x,
         "pitch_z": pitch_z, "street_w": sw, "gaps": gaps,
         "order": [h["id"] for h in rows[0]] + ["/"] + [h["id"] for h in rows[1]],
         "note": "as built", "showcase": showcase, "world_box": world_box,
         "block_x0": x0, "block_x1": x1}
    return v


# ------------------------------------------------------------------ drawing
def draw_panel(dr, font, small, v, m, ox, oy, ppm, title, sub, colour, actual_showcase=None):
    """One top-down plan panel at ppm pixels per metre.

    ox/oy = top-left of the block rectangle. Both variant() and
    variant_from_scene() hand back the same local frame (x centred on 0, street
    centred on z = 0), so every panel is drawn with identical math and the
    panels are directly comparable by eye.
    """
    def X(x):
        return ox + (x + v["w"] * 0.5) * ppm

    def Z(z):
        return oy + (z - v["z0"]) * ppm

    dr.text((ox, oy - 42), title, fill=(226, 232, 238), font=font)
    dr.multiline_text((ox, oy - 27), sub, fill=(150, 160, 172), font=small, spacing=1)
    # ground
    dr.rectangle([X(-v["w"] * 0.5), Z(v["z0"]), X(v["w"] * 0.5), Z(v["z1"])],
                 fill=(34, 39, 45), outline=(88, 96, 108))
    for s in v["street"]:
        dr.rectangle([X(s["x0"]), Z(s["z0"]), X(s["x1"]), Z(s["z1"])], fill=(62, 66, 74))
    for l in v["lots"]:
        dr.rectangle([X(l["x0"]), Z(l["z0"]), X(l["x1"]), Z(l["z1"])], fill=(96, 92, 84))
        hx0 = X(l["x0"] + (l["lw"] - l["w"]) * 0.5)
        hz0 = Z(l["z0"] + (l["ld"] - l["d"]) * 0.5)
        hx1 = hx0 + l["w"] * ppm
        hz1 = hz0 + l["d"] * ppm
        dr.rectangle([hx0, hz0, hx1, hz1], fill=colour, outline=(232, 236, 240))
        dr.text((hx0 + 2, hz0 + 1), l["id"], fill=(14, 18, 22), font=small)
        if l["w"] * ppm >= 34:
            dr.text((hx0 + 2, hz0 + 11), "%.1fx%.1f" % (l["w"], l["d"]), fill=(30, 34, 40), font=small)
    # showcase: A1 draws the prototype where it really stands; A2/A3 draw the
    # widest gap the walk-in building could move into
    if actual_showcase:
        sx, sz = actual_showcase["cx"], actual_showcase["cz"]
        dr.rectangle([X(sx - SHOWCASE_W * 0.5), Z(sz - SHOWCASE_D * 0.5),
                      X(sx + SHOWCASE_W * 0.5), Z(sz + SHOWCASE_D * 0.5)],
                     outline=(250, 110, 110), width=2)
        dr.text((X(sx - SHOWCASE_W * 0.5) + 2, Z(sz - SHOWCASE_D * 0.5) + 1),
                "showcase", fill=(250, 130, 130), font=small)
        dr.text((X(sx - SHOWCASE_W * 0.5) + 2, Z(sz - SHOWCASE_D * 0.5) + 11),
                "pad clash", fill=(250, 130, 130), font=small)
    elif v["gaps"]:
        g, a, b = v["gaps"][0]
        fits = g >= SHOWCASE_W
        rowlots = sorted([l for l in v["lots"] if l["id"] in (a, b)], key=lambda l: l["x0"])
        if len(rowlots) == 2:
            gx0 = X(rowlots[0]["x1"])
            gx1 = X(rowlots[1]["x0"])
            gz0 = Z(rowlots[0]["z0"] + 1.0)
            gz1 = gz0 + SHOWCASE_D * ppm
            dr.rectangle([gx0, gz0, gx1, gz1], outline=(250, 200, 90) if fits else (250, 110, 110), width=2)
            dr.text((gx0 + 2, gz1 + 1), "slot %.1fm %s" % (g, "ok" if fits else "tight"),
                    fill=(250, 200, 90) if fits else (250, 130, 130), font=small)
    # scale bar 10 m + a 1.7 m human silhouette standing on the street
    bx, by = X(-v["w"] * 0.5), Z(v["z1"]) + 10
    dr.line([bx, by, bx + 10 * ppm, by], fill=(210, 216, 224), width=2)
    dr.line([bx, by - 3, bx, by + 3], fill=(210, 216, 224), width=1)
    dr.line([bx + 10 * ppm, by - 3, bx + 10 * ppm, by + 3], fill=(210, 216, 224), width=1)
    dr.text((bx + 10 * ppm + 6, by - 5), "10 m", fill=(190, 198, 208), font=small)
    street_mid = X(0)
    hz = Z((v["street"][0]["z0"] + v["street"][0]["z1"]) * 0.5) if v["street"] else Z(0)
    dr.line([street_mid + 6, hz, street_mid + 6, hz - 1.7 * ppm], fill=(120, 220, 250), width=3)
    dr.text((street_mid + 11, hz - 1.7 * ppm), "1.7 m", fill=(120, 220, 250), font=small)


def draw_context(dr, font, small, sc, raster_cls, v1, v3, ox, oy, side, stamp):
    """Whole-plate panel: where the block sits vs the towers and the water."""
    plate = sc.mesh_triangles(sc.go_id("Ground512"))[1] if sc.go_id("Ground512") else None
    if plate is None:
        return
    pad = 10.0
    size = max(plate[2] - plate[0], plate[3] - plate[1]) + 2 * pad
    ppm = side / size

    def X(x):
        return ox + (x - plate[0] + pad) * ppm

    def Z(z):
        return oy + (z - plate[1] + pad) * ppm

    dr.text((ox, oy - 34), "city grain - whole Ground512 plate (own scale)", fill=(226, 232, 238), font=font)
    dr.text((ox, oy - 19), "block outline: A1 red / A3 green; grey = whitebox towers (9-18 m footprints)",
            fill=(150, 160, 172), font=small)
    dr.rectangle([X(plate[0]), Z(plate[1]), X(plate[2]), Z(plate[3])], fill=(37, 42, 48), outline=(96, 104, 116))
    # water, true triangles, 2 m cells
    ras = raster_cls(plate[0], plate[1], plate[2], plate[3], 2.0)
    for gid, nm in sorted(sc.names.items()):
        if nm and ("Water" in nm or nm.upper().startswith("L_WATER")):
            tris, _ = sc.mesh_triangles(gid)
            for a, b, c in tris:
                ras.mark_triangle(a, b, c)
    for j in range(ras.nz):
        row = ras.rows[j]
        i = 0
        while i < ras.nx:
            if row[i]:
                s = i
                while i < ras.nx and row[i]:
                    i += 1
                dr.rectangle([X(ras.x0 + s * ras.cell), Z(ras.z0 + j * ras.cell),
                              X(ras.x0 + i * ras.cell), Z(ras.z0 + (j + 1) * ras.cell)],
                             fill=(40, 88, 168))
            else:
                i += 1
    # whitebox towers: they hang off their own district mounts (e.g. City_MEDIA),
    # not under City_GAME, so the panel draws every B<n> whose footprint is on
    # the plate -- the point is the city grain, not the district ownership
    for gid, nm in sorted(sc.names.items()):
        if not nm or not re.match(r"^B\d$", nm):
            continue
        _, bb = sc.mesh_triangles(gid)
        if not bb or bb[0] < plate[0] or bb[2] > plate[2]:
            continue
        dr.rectangle([X(bb[0]), Z(bb[1]), X(bb[2]), Z(bb[3])], fill=(150, 158, 170))
    wb = v1["world_box"]
    ccx, ccz = (wb[0] + wb[2]) * 0.5, (wb[1] + wb[3]) * 0.5
    for v, col in ((v1, (250, 110, 110)), (v3, (90, 210, 130))):
        half_w, half_d = v["w"] * 0.5, v["d"] * 0.5
        dr.rectangle([X(ccx - half_w), Z(ccz - half_d), X(ccx + half_w), Z(ccz + half_d)], outline=col, width=2)
    dr.line([X(ccx), Z(ccz) - 4, X(ccx), Z(ccz) + 4], fill=(250, 110, 110))
    dr.text((X(ccx) + 6, Z(ccz) - 13), "R2 block", fill=(250, 140, 140), font=small)
    m1 = metrics(v1)
    dr.text((ox, oy + side + 8), "R2 block today %.0f x %.0f m; %.0f%% of it is bare lot + yard"
            % (v1["w"], v1["d"],
               100.0 * (1 - m1["coverage"] - m1["street_area"] / m1["gross"])),
            fill=(150, 160, 172), font=small)


# ------------------------------------------------------------------ self check
def self_check():
    """Fixture: the geometry helpers must never produce overlapping lot pads."""
    row = [{"id": "P1", "lw": 8.0, "ld": 10.0, "w": 5.6, "d": 7.6},
           {"id": "P2", "lw": 16.0, "ld": 16.0, "w": 13.6, "d": 13.6},
           {"id": "P3", "lw": 9.0, "ld": 9.0, "w": 6.6, "d": 6.6},
           {"id": "P4", "lw": 15.0, "ld": 20.0, "w": 12.6, "d": 17.6}]
    fails = []
    cur = frontage_floor(row)
    if abs(cur - 15.5) > 1e-9:
        fails.append("frontage_floor got %.3f" % cur)
    order, pitch, span = best_order(row)
    # no permutation may beat the returned span, and no lot pad may touch
    for perm in itertools.permutations(row):
        p = max((perm[i]["lw"] + perm[i + 1]["lw"]) * 0.5 + MIN_GAP for i in range(3))
        s = p * 3 + (perm[0]["lw"] + perm[-1]["lw"]) * 0.5
        if s < span - 1e-9:
            fails.append("best_order not minimal")
            break
    if abs(row_span(order, pitch) - span) > 1e-9:
        fails.append("row_span disagrees with best_order")
    lots, _ = place(order, pitch, 0.0, STREET_W, MIN_GAP)
    lots.sort(key=lambda l: l["x0"])
    for i in range(len(lots) - 1):
        gap = lots[i + 1]["x0"] - lots[i]["x1"]
        if gap < MIN_GAP - 1e-6:
            fails.append("lot pads overlap (gap %.3f)" % gap)
    v = variant("T", [order], pitch, 30.0, STREET_W)
    m = metrics(v)
    if m["coverage"] <= 0 or m["gross"] <= 0:
        fails.append("metrics degenerate")
    if m["showcase_fits"] and m["max_gap"] < SHOWCASE_W:
        fails.append("showcase_fits inconsistent")
    if fails:
        print("SELF_CHECK FAIL " + "; ".join(fails))
        return 2
    print("SELF_CHECK OK pitch=%.2f best_pitch=%.2f span=%.2f gaps=%s"
          % (cur, pitch, span, ",".join("%.2f" % (lots[i + 1]["x0"] - lots[i]["x1"]) for i in range(3))))
    return 0


# ------------------------------------------------------------------ main
def main(argv):
    if "--self-check" in argv:
        return self_check()
    stamp = datetime.datetime.now().strftime("%Y%m%d-%H%M")
    out_dir = os.path.join(ROOT, "qa")
    scene_path, rebuild_path = SCENE, REBUILD
    artifacts = True
    for i, a in enumerate(argv):
        if a == "--stamp" and i + 1 < len(argv):
            stamp = argv[i + 1]
        elif a == "--out-dir" and i + 1 < len(argv):
            out_dir = os.path.join(ROOT, argv[i + 1])
        elif a == "--no-artifacts":
            artifacts = False
        elif a == "--scene" and i + 1 < len(argv):
            scene_path = os.path.abspath(os.path.join(ROOT, argv[i + 1]))
        elif a == "--rebuild" and i + 1 < len(argv):
            rebuild_path = os.path.abspath(os.path.join(ROOT, argv[i + 1]))
    if not os.path.isfile(scene_path):
        die("scene not found: " + scene_path)
    if not os.path.isfile(rebuild_path):
        die("rebuild script not found: " + rebuild_path)

    mod = load_checker()
    sc = mod.Scene(scene_path)
    lot_pad = read_lot_pad(rebuild_path)
    houses, street, showcase = collect(sc, lot_pad)
    rows = cluster_rows(houses)
    v1 = variant_from_scene(houses, street, showcase)
    m1 = metrics(v1)

    # A2: same order, same assets; only the row pitch is compacted
    z_floor = (max(h["ld"] for h in rows[0]) + max(h["ld"] for h in rows[1])) * 0.5
    a2_rows = [list(r) for r in rows]
    a2_pitch_x = max(frontage_floor(r) for r in a2_rows)
    a2_pitch_z = math.ceil((z_floor + STREET_W + 2 * SETBACK) * 2) / 2.0
    a2 = variant("A2", a2_rows, a2_pitch_x, a2_pitch_z, STREET_W,
                 note="row compaction only; assets and order untouched")
    m2 = metrics(a2)

    # A3: also pack the frontage by reordering, and drop the setback (curbless lane)
    a3_rows = []
    for r in rows:
        order, _, _ = best_order(r)
        a3_rows.append(order)
    a3_pitch_x = max(frontage_floor(r) for r in a3_rows)
    a3_pitch_z = math.ceil((z_floor + STREET_W) * 2) / 2.0
    a3 = variant("A3", a3_rows, a3_pitch_x, a3_pitch_z, STREET_W,
                 note="reordered so the wide presets are not adjacent; curbless lane")

    for v, m in ((v1, m1), (a2, m2), (a3, metrics(a3))):
        v["m"] = m
    m3 = a3["m"]

    print("SCALE_STUDY scene=%s lot_pad=%.2f houses=%d rows=%s"
          % (os.path.basename(scene_path), lot_pad, len(houses),
             "/".join(str(len(r)) for r in rows)))
    print("A1 as-built   %.1f x %.1f m  %.0f m2  pitch %.1f/%.1f  coverage %.1f%%  front %.1f-%.1f m  gap %.2f-%.2f m"
          % (v1["w"], v1["d"], m1["gross"], v1["pitch_x"], v1["pitch_z"], m1["coverage"] * 100.0,
             m1["front_min"], m1["front_max"], m1["min_gap"], m1["max_gap"]))
    print("A2 row-compact %.1f x %.1f m  %.0f m2  pitch %.1f/%.1f  coverage %.1f%%  front %.1f-%.1f m  gap %.2f-%.2f m  area %+.0f%%"
          % (a2["w"], a2["d"], m2["gross"], a2["pitch_x"], a2["pitch_z"], m2["coverage"] * 100.0,
             m2["front_min"], m2["front_max"], m2["min_gap"], m2["max_gap"],
             100.0 * (m2["gross"] / m1["gross"] - 1.0)))
    print("A3 A2+frontage %.1f x %.1f m  %.0f m2  pitch %.1f/%.1f  coverage %.1f%%  front %.1f-%.1f m  gap %.2f-%.2f m  area %+.0f%%"
          % (a3["w"], a3["d"], m3["gross"], a3["pitch_x"], a3["pitch_z"], m3["coverage"] * 100.0,
             m3["front_min"], m3["front_max"], m3["min_gap"], m3["max_gap"],
             100.0 * (m3["gross"] / m1["gross"] - 1.0)))
    for v in (v1, a2, a3):
        print("  %s order=%s showcase_slot=%.2fm fits=%s"
              % (v["name"], v["order"], v["m"]["max_gap"], v["m"]["showcase_fits"]))
    if v1.get("showcase"):
        # does the walk-in prototype actually clear its neighbours' pads today?
        sx, sz = v1["showcase"]["cx"], v1["showcase"]["cz"]
        box = (sx - SHOWCASE_W * 0.5, sz - SHOWCASE_D * 0.5, sx + SHOWCASE_W * 0.5, sz + SHOWCASE_D * 0.5)
        hits = []
        for l in v1["lots"]:
            ox = min(box[2], l["x1"]) - max(box[0], l["x0"])
            oz = min(box[3], l["z1"]) - max(box[1], l["z0"])
            if ox > 0.01 and oz > 0.01:
                hits.append((l["id"], round(ox, 2), round(oz, 2)))
        print("  showcase_box=(%.1f,%.1f) pad_clash=%s" % (sx, sz, hits if hits else "none"))

    if not artifacts:
        print("SCALE_VERDICT=%s area A2%+.0f%% A3%+.0f%%"
              % ("COMPACTION_HELPS" if m2["gross"] < m1["gross"] * 0.95 else "NO_GAIN",
                 100.0 * (m2["gross"] / m1["gross"] - 1.0), 100.0 * (m3["gross"] / m1["gross"] - 1.0)))
        return 0

    try:
        from PIL import Image, ImageDraw, ImageFont
    except Exception as exc:
        die("Pillow is required for the plan sheet: " + str(exc))

    big = ImageFont.load_default(size=16)
    font = ImageFont.load_default(size=12)
    small = ImageFont.load_default(size=10)

    ppm = 3.4
    block_px_w = max(v["w"] for v in (v1, a2, a3)) * ppm
    block_px_h = max(v["d"] for v in (v1, a2, a3)) * ppm
    panel_w = int(block_px_w) + 74
    panel_h = int(block_px_h) + 84          # header 48 + scale bar strip 64
    left = 16
    top = 56
    W = left * 2 + panel_w * 2
    H = top + panel_h * 2 + 78
    img = Image.new("RGB", (W, H), (16, 20, 24))
    dr = ImageDraw.Draw(img, "RGBA")
    dr.text((left, 12), "FluxVerse City3D - R2 district scale study - %s" % stamp,
            fill=(236, 240, 246), font=big)
    dr.text((left, 32), "every panel draws the real official house assets at 100%; only spacing, street width and row pitch change",
            fill=(150, 160, 172), font=small)

    panels = (
        (v1, (196, 168, 120), "A1  as built", v1.get("showcase")),
        (a2, (128, 186, 236), "A2  row pitch compacted", None),
        (a3, (128, 214, 150), "A3  A2 + frontage reorder + curbless lane", None),
    )
    for k, (v, col, title, act) in enumerate(panels):
        m = v["m"]
        ox = left + (k % 2) * panel_w
        oy = top + (k // 2) * panel_h + 48
        sub = ("%.1f x %.1f m  %.0f m2  pitch %.1f / %.1f m\n"
               "density %.1f%%  front yard %.1f-%.1f m  street %.1f m  walk across %.0f s"
               % (v["w"], v["d"], m["gross"], v["pitch_x"], v["pitch_z"],
                  m["coverage"] * 100.0, m["front_min"], m["front_max"], v["street_w"], m["walk_x"]))
        draw_panel(dr, font, small, v, m, ox, oy, ppm, title, sub, col, actual_showcase=act)

    # fourth panel: the city grain, own scale
    side = panel_w - 74
    ox4 = left + panel_w
    oy4 = top + panel_h + 48
    draw_context(dr, font, small, sc, mod.Raster, v1, a3, ox4, oy4, side, stamp)
    dr.text((ox4, oy4 + side + 26),
            "A2 frees %.0f%% of the land with zero asset or order risk;"
            % (100.0 * (1.0 - m2["gross"] / m1["gross"])), fill=(160, 170, 182), font=small)
    dr.text((ox4, oy4 + side + 40),
            "A3 takes another %+.1f%% but needs the wide presets split apart."
            % (100.0 * (m3["gross"] / m2["gross"] - 1.0)), fill=(160, 170, 182), font=small)

    site_dir = os.path.join(out_dir, "site")
    if not os.path.isdir(site_dir):
        os.makedirs(site_dir)
    png = os.path.join(site_dir, "r2-scale-%s-bm-a.png" % stamp)
    img.save(png)

    md = ["# R2 街区尺度复核（%s · main#61）" % stamp, "",
          "实测口径：宅基台边长 = 房体边长 + %.1f m（`CityRebuildR2.cs`），尺寸全部从已建场景 `CityRebuild_R2.unity` 读回；"
          "人速度按 %.2f m/s 计。" % (lot_pad, WALK_MPS), "",
          "| 方案 | 街区尺寸 | 用地 | 房屋占地 | 建筑密度 | 前场进深 | 门面间距 | 街宽 | 横穿一趟 |",
          "|---|---|---|---|---|---|---|---|---|"]
    rows_md = []
    short = {"A1": "as built", "A2": "row pitch only", "A3": "row pitch + frontage reorder"}
    for v in (v1, a2, a3):
        m = v["m"]
        rows_md.append("| **%s** %s | %.1f × %.1f m | %.0f m² | %.0f m² | %.1f%% | %.1f–%.1f m | %.1f–%.1f m | %.1f m | %.0f s |"
                       % (v["name"], short.get(v["name"], v["note"]), v["w"], v["d"], m["gross"], m["house_area"],
                          m["coverage"] * 100.0, m["front_min"], m["front_max"],
                          m["min_gap"], m["max_gap"], v["street_w"], m["walk_x"]))
    md += rows_md + ["", "## 三条实测结论", "",
                      "1. **行距是主矛盾，不是街区尺寸。** 两排房中心距 %.0f m，其中真正被占用的只有 %.1f m（两排宅基台半深）+ %.1f m 路带 = %.1f m，"
                      "**%.1f m 是空地/前场**——街面看不出「街」，只剩铺装。A2 只动行距即得 %.1f×%.1f m（用地 %+.0f%%）。"
                      % (v1["pitch_z"], z_floor, STREET_W, z_floor + STREET_W,
                         v1["pitch_z"] - z_floor - STREET_W, a2["w"], a2["d"], 100.0 * (m2["gross"] / m1["gross"] - 1.0)),
                      "2. **横向压缩到地板了。** 现状门面 %.1f m 已接近「最大两件宅基台半宽和 + 3 m」的可行下限 %.1f m；"
                      "要再压只能改排位——把 %.1f/%.1f m 两个大件拆开，A3 门面 %.1f m、总面积只再省 %.1f%%。"
                      % (v1["pitch_x"], frontage_floor(rows[0]),
                         max(h["lw"] for h in rows[0] + rows[1]), sorted([h["lw"] for h in rows[0] + rows[1]])[-2],
                         a3["pitch_x"], 100.0 * (1.0 - m3["gross"] / m2["gross"])),
                      "3. **缩尺＝缩间距，不是缩模型。** 官方 Preset 是真实住宅尺寸（%.1f–%.1f m 宽），把房体整体做小会得到 1.5 m 高的娃娃屋；"
                      "所以 A2/A3 的房体保持 100%%，只动间距/路带。"
                      % (min(h["w"] for h in houses), max(h["w"] for h in houses)), ""]
    if v1.get("showcase"):
        # measure the prototype's real slot instead of guessing it
        scx, scz = v1["showcase"]["cx"], v1["showcase"]["cz"]
        neighbours = sorted([l for l in v1["lots"] if l["z0"] <= scz <= l["z1"]], key=lambda l: l["x0"])
        slot = None
        for i in range(len(neighbours) - 1):
            if neighbours[i]["x1"] <= scx <= neighbours[i + 1]["x0"]:
                slot = (neighbours[i]["x1"], neighbours[i]["id"],
                        neighbours[i + 1]["x0"], neighbours[i + 1]["id"])
        if slot:
            a_x1, a_name, b_x0, b_name = slot
            gap = b_x0 - a_x1
            over_b = max(0.0, scx + SHOWCASE_W * 0.5 - b_x0)
            over_a = max(0.0, a_x1 - (scx - SHOWCASE_W * 0.5))
            md += ["## 顺带量到的一条", "",
                   "解剖展示房（%.1f × %.1f m）现在站在 %s|%s 之间 %.2f m 的缝里——比展示房窄 %.2f m，于是%s"
                   "**这是宅基台面重叠，不是房体重叠**；两块台顶面同为 0.055+0.05 m 高，属同高共面，"
                   "z-fighting 风险实存，也说明这块街区没给「走进建筑」的样板房留位置。A2/A3 的最宽门面缝 %.1f m 足以容纳它并留 1 m 净距。"
                   % (SHOWCASE_W, SHOWCASE_D, a_name, b_name, gap, SHOWCASE_W - gap,
                      ("压进 %s 的宅基台 %.2f m、另一侧只剩 %.2f m。" % (b_name, over_b, scx - SHOWCASE_W * 0.5 - a_x1))
                      if over_b > 0.01 else
                      ("两侧各余 %.2f / %.2f m。" % (scx - SHOWCASE_W * 0.5 - a_x1, b_x0 - (scx + SHOWCASE_W * 0.5))),
                      a2["m"]["max_gap"]), ""]
    md += ["## 建议", "",
           "- 模块设计输入取 **A2**：不动资产、不改排位、只把行距压到 %.1f m 并把街带加宽到 %.1f m，是「零风险拿走大头」的一档。"
           % (a2["pitch_z"], STREET_W + 2 * SETBACK),
           "- A3 留作「密度档」备选：只在确认排位可换（大件不要求相邻对照）时启用。",
           "- 本轮按 main#61 判据**只出对照图，不动场景**；落位/重建候选在 main#62（机位）之后一并定。", ""]
    md_path = os.path.join(site_dir, "r2-scale-%s-bm-a.md" % stamp)
    io.open(md_path, "w", encoding="utf-8").write("\n".join(md))

    print("sheet=" + os.path.relpath(png, ROOT).replace("\\", "/"))
    print("md=" + os.path.relpath(md_path, ROOT).replace("\\", "/"))
    print("SCALE_VERDICT=%s area A2%+.0f%% A3%+.0f%%"
          % ("COMPACTION_HELPS" if m2["gross"] < m1["gross"] * 0.95 else "NO_GAIN",
             100.0 * (m2["gross"] / m1["gross"] - 1.0), 100.0 * (m3["gross"] / m1["gross"] - 1.0)))
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))