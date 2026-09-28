#!/usr/bin/env python3
# TD anime map v2 - organic street layout generator.
# CEO order 2026-09-28 (~14:xx): city plan must NOT be a rigid H/V grid
# ("do not go horizontal-flat vertical-straight"), camera must zoom.
# This tool authors the new 64x64 layout and emits every downstream artifact.
# World coords: x = east (0..63), y = north (0..63). Image row 0 = north.
# Outputs:
#   Tools/city/td-layout-v2-base.png      2048x2048 flat-color layout base (img2img input)
#   Tools/city/td-organic-data.txt         ASCII data: road cells, starts, player, shots
#   Tools/city/td-roadcells-snippet.cs     generated TDWalkLib.RoadCells() body
#   City/Assets/Art/TDArt/char-shadow.png  soft ellipse shadow sprite (ppu 32)
# Fail-loud: BFS connectivity, road count, bridge count, max straight-run bounds.
import math
import os
import random
import sys
from collections import deque

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))  # FluxVerse repo root
try:
    from PIL import Image, ImageDraw
except ImportError:
    print("FAIL: PIL missing")
    sys.exit(1)

N = 64
PX = 32


def inb(c):
    return 0 <= c[0] < N and 0 <= c[1] < N


def catmull_rom(pts, seg=22):
    out = []
    P = [pts[0]] + list(pts) + [pts[-1]]
    for i in range(1, len(P) - 2):
        p0, p1, p2, p3 = P[i - 1], P[i], P[i + 1], P[i + 2]
        for j in range(seg):
            t = j / seg
            t2 = t * t
            t3 = t2 * t
            x = 0.5 * ((2 * p1[0]) + (-p0[0] + p2[0]) * t +
                       (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 +
                       (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3)
            y = 0.5 * ((2 * p1[1]) + (-p0[1] + p2[1]) * t +
                       (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 +
                       (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3)
            out.append((x, y))
    out.append(tuple(pts[-1]))
    return out


def quad(p0, c, p1):
    d = math.hypot(p1[0] - p0[0], p1[1] - p0[1])
    seg = max(8, int(d * 3))
    return [((1 - t) ** 2 * p0[0] + 2 * (1 - t) * t * c[0] + t ** 2 * p1[0],
             (1 - t) ** 2 * p0[1] + 2 * (1 - t) * t * c[1] + t ** 2 * p1[1])
            for t in (i / seg for i in range(seg + 1))]


def stamp(s, pts, r):
    for (x, y) in pts:
        ix, iy = int(round(x)), int(round(y))
        for dx in range(-r, r + 1):
            for dy in range(-r, r + 1):
                if dx * dx + dy * dy <= r * r + 0.6:
                    c = (ix + dx, iy + dy)
                    if inb(c):
                        s.add(c)


def near(samples, tx, ty):
    return min(samples, key=lambda p: (p[0] - tx) ** 2 + (p[1] - ty) ** 2)


def bfs(s, start):
    q = deque([start])
    seen = {start}
    while q:
        x, y = q.popleft()
        for d in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            c = (x + d[0], y + d[1])
            if c in s and c not in seen:
                seen.add(c)
                q.append(c)
    return seen


def max_run(cells, axis):
    lines = {}
    for (x, y) in cells:
        k = y if axis == 'h' else x
        v = x if axis == 'h' else y
        lines.setdefault(k, []).append(v)
    best = 0
    for vs in lines.values():
        vs.sort()
        run = 1
        for i in range(1, len(vs)):
            run = run + 1 if vs[i] == vs[i - 1] + 1 else 1
            best = max(best, run)
        best = max(best, min(1, len(vs)))
    return best


water = set()
road_paint = set()
plaza = set()
park = set()
trees = set()
landmark = set()

# --- river: high-frequency snake meander (every arm slope >= 0.67 - no flat
# arms anywhere, so no straight parallel quays can form)
river = catmull_rom([(0, 27), (7, 22), (13, 28), (19, 23), (25, 29), (31, 25),
                     (37, 31), (43, 27), (49, 33), (55, 29), (63, 36)])
stamp(water, river, 3)

def offset_path(pts, side):
    # parallel offset with wave + fold-trim: at convex bends the naive offset
    # backtracks onto itself and smears one row/column; drop backtracking points.
    out = []
    for i in range(1, len(pts)):
        ax, ay = pts[i - 1]
        bx, by = pts[i]
        tx, ty = bx - ax, by - ay
        tl = math.hypot(tx, ty)
        if tl < 1e-6:
            continue
        nx, ny = -ty / tl, tx / tl
        if ny * side < 0:
            nx, ny = -nx, -ny
        mx, my = (ax + bx) / 2.0, (ay + by) / 2.0
        dist = 5.6 + 0.9 * math.sin(2 * math.pi * 4.0 * i / len(pts))
        out.append((mx + dist * nx, my + dist * ny, tx, ty))
    keep = []
    for p in out:
        if keep:
            dx, dy = p[0] - keep[-1][0], p[1] - keep[-1][1]
            if dx * p[2] + dy * p[3] < 0:
                continue
        keep.append(p)
    return [(p[0], p[1]) for p in keep]


emb = offset_path(river, +1)
stamp(road_paint, emb, 1)
prom = [(x, y) for (x, y) in offset_path(river, -1) if 34 <= x <= 56]
stamp(road_paint, prom, 1)

# --- round plaza + spiral boulevard: a closed ring always grows a flat top and
# vertical flanks (tangent hits H/V at the extremes); a 1-turn outward spiral
# with a wavy radius never holds one row/column for long.
PC = (24, 45)
stamp(plaza, [PC], 5)
spiral = []
deg0, deg1 = 200.0, 560.0
d = deg0
while d <= deg1:
    t = (d - deg0) / 360.0
    r = 6.0 + 4.0 * t + 0.9 * math.sin(4 * math.radians(d))
    a = math.radians(d)
    spiral.append((PC[0] + r * math.cos(a), PC[1] + r * math.sin(a)))
    d += 2.0
stamp(road_paint, spiral, 1)

# --- organic spokes and lanes (all curved, chained junctions)
A = quad(near(spiral, 24, 54), (22, 60), (29, 63))   # north exit
B = quad(near(spiral, 33, 48), (46, 40), (63, 26))   # NE diagonal, bridges the river
C = quad(near(spiral, 16, 42), (6, 37), (0, 34))     # west exit (starts at spiral end)
D1 = quad(near(spiral, 28, 37), (14, 29), (31, 21))  # south, bridges the river (east of spiral bottom)
D2 = quad((31, 21), (38, 13), (46, 0))               # chained: continues to south edge
E = quad(near(spiral, 16, 50), (3, 54), (14, 63))   # NNW exit
F = quad(near(D2, 39, 11), (48, 7), (54, 0))         # SE exit (junction on D2)
G = quad(near(D2, 33, 19), (12, 13), (6, 0))         # SW exit (junction on D2)
H = quad((62, 27), (57, 21), (49, 1))                # east-bank lane off B's exit
for pts in (A, B, C, D1, D2, E, F, G, H):
    stamp(road_paint, pts, 1)

# --- landmark (clock tower base) inside plaza
for dx in (0, 1):
    for dy in (0, 1):
        landmark.add((23 + dx, 44 + dy))

# --- parks + scattered street trees
stamp(park, [(14, 54)], 4)
stamp(park, [(38, 9)], 3)
rng = random.Random(20260928)
occ = water | road_paint | plaza | park | landmark
cand = []
for c in road_paint:
    for dx in (-2, -1, 0, 1, 2):
        for dy in (-2, -1, 0, 1, 2):
            c2 = (c[0] + dx, c[1] + dy)
            if inb(c2) and c2 not in occ and c2 not in trees:
                cand.append(c2)
rng.shuffle(cand)
for c in cand[:55]:
    trees.add(c)

# --- walkable network: BFS from player spawn, drop orphans (visual paint keeps all)
player = min(road_paint, key=lambda c: (c[0] - 20) ** 2 + (c[1] - 51) ** 2)
reach = bfs(road_paint, player)
road_walk = reach
dropped = len(road_paint) - len(road_walk)

# --- bridges = road over water
bridges = road_paint & water

# --- 8 walker starts spread over the network
srt = sorted(road_walk)
starts = []
for f in (0.06, 0.18, 0.30, 0.42, 0.55, 0.67, 0.80, 0.93):
    idx = int(f * (len(srt) - 1))
    c = srt[idx]
    guard = 0
    while (c == player or c in starts) and guard < 40:
        idx = (idx + 7) % len(srt)
        c = srt[idx]
        guard += 1
    starts.append(c)

# --- shot anchors
shot_plaza = (24.5, 45.5)
sc = min(road_paint, key=lambda c: (c[0] - 15) ** 2 + (c[1] - 30) ** 2)
shot_street = (sc[0] + 0.5, sc[1] + 0.5)
sb = min(bridges, key=lambda c: (c[0] - 23) ** 2 + (c[1] - 30) ** 2)
shot_bridge = (sb[0] + 0.5, sb[1] + 0.5)

# ---------------- paint the 2048x2048 layout base ----------------
COL = {
    'water': (79, 143, 212),
    'sand': (234, 217, 168),
    'road': (110, 110, 120),
    'bridge': (164, 113, 78),
    'plaza': (242, 232, 201),
    'landmark': (200, 84, 80),
    'park': (124, 191, 104),
    'tree': (79, 140, 70),
    'land': (220, 200, 168),
}
img = Image.new('RGB', (N * PX, N * PX), COL['land'])
dr = ImageDraw.Draw(img)


def cell_rect(c):
    x0 = c[0] * PX
    y0 = (N - 1 - c[1]) * PX
    return [x0, y0, x0 + PX, y0 + PX]


occw = water | road_paint | plaza | park | trees | landmark
sand = set()
for (x, y) in water:
    for dx in (-1, 0, 1):
        for dy in (-1, 0, 1):
            c = (x + dx, y + dy)
            if inb(c) and c not in occw:
                sand.add(c)

for c in water:
    dr.rectangle(cell_rect(c), fill=COL['water'])
for c in sand:
    dr.rectangle(cell_rect(c), fill=COL['sand'])
for c in park:
    dr.rectangle(cell_rect(c), fill=COL['park'])
for c in trees:
    dr.rectangle(cell_rect(c), fill=COL['tree'])
for c in plaza:
    dr.rectangle(cell_rect(c), fill=COL['plaza'])
for c in landmark:
    dr.rectangle(cell_rect(c), fill=COL['landmark'])
for c in road_paint:
    dr.rectangle(cell_rect(c), fill=(COL['bridge'] if c in water else COL['road']))

base_png = os.path.join(ROOT, 'Tools', 'city', 'td-layout-v2-base.png')
img.save(base_png)

# ---------------- soft ellipse shadow sprite ----------------
W, Hh = 96, 48
sh = Image.new('RGBA', (W, Hh), (0, 0, 0, 0))
pxs = sh.load()
for j in range(Hh):
    for i in range(W):
        r = math.hypot((i - 47.5) / 47.5, (j - 23.5) / 23.5)
        a = max(0.0, 1.0 - r) ** 1.5
        pxs[i, j] = (255, 255, 255, int(a * 255))
shadow_png = os.path.join(ROOT, 'City', 'Assets', 'Art', 'TDArt', 'char-shadow.png')
sh.save(shadow_png)

# ---------------- generated C# RoadCells body ----------------
cells_str = ' '.join('%d,%d' % c for c in srt)
snippet = (
    "    // tileless mode (anime v2 organic street network, CEO order 2026-09-28 ~14:xx)\n"
    "    public static HashSet<Vector3Int> RoadCells()\n"
    "    {\n"
    "        var set = new HashSet<Vector3Int>();\n"
    "        const string DATA = \"" + cells_str + "\";\n"
    "        foreach (var tok in DATA.Split(' '))\n"
    "        {\n"
    "            var p = tok.Split(',');\n"
    "            set.Add(new Vector3Int(int.Parse(p[0]), int.Parse(p[1]), 0));\n"
    "        }\n"
    "        return set;\n"
    "    }\n"
)
snippet_path = os.path.join(ROOT, 'Tools', 'city', 'td-roadcells-snippet.cs')
with open(snippet_path, 'w', encoding='utf-8', newline='\n') as f:
    f.write(snippet)

# ---------------- ASCII data file ----------------
data_path = os.path.join(ROOT, 'Tools', 'city', 'td-organic-data.txt')
with open(data_path, 'w', encoding='utf-8', newline='\n') as f:
    f.write('ROAD_COUNT %d\n' % len(srt))
    f.write('ROAD ' + ' '.join('%d,%d' % c for c in srt) + '\n')
    f.write('STARTS ' + ' '.join('%d,%d' % c for c in starts) + '\n')
    f.write('PLAYER %d,%d\n' % player)
    f.write('BRIDGES %d %s\n' % (len(bridges), ' '.join('%d,%d' % c for c in sorted(bridges))))
    f.write('WATER %d %s\n' % (len(water), ' '.join('%d,%d' % c for c in sorted(water))))
    f.write('SAND %d %s\n' % (len(sand), ' '.join('%d,%d' % c for c in sorted(sand))))
    f.write('PLAZA %d %s\n' % (len(plaza), ' '.join('%d,%d' % c for c in sorted(plaza))))
    f.write('PARK %d %s\n' % (len(park), ' '.join('%d,%d' % c for c in sorted(park))))
    f.write('TREES %d %s\n' % (len(trees), ' '.join('%d,%d' % c for c in sorted(trees))))
    f.write('SHOT_PLAZA %.1f %.1f\n' % shot_plaza)
    f.write('SHOT_STREET %.1f %.1f\n' % shot_street)
    f.write('SHOT_BRIDGE %.1f %.1f\n' % shot_bridge)

run_h = max_run(road_paint, 'h')
run_v = max_run(road_paint, 'v')
ok = (len(road_walk) >= 300 and run_h <= 14 and run_v <= 14
      and len(bridges) >= 9 and len(starts) == 8)
print("road_paint=%d road_walk=%d dropped=%d water=%d sand=%d bridges=%d trees=%d plaza=%d park=%d"
      % (len(road_paint), len(road_walk), dropped, len(water), len(sand),
         len(bridges), len(trees), len(plaza), len(park)))
print("player=%s starts=%s" % (player, starts))
print("runH=%d runV=%d shots: plaza=%s street=%s bridge=%s"
      % (run_h, run_v, shot_plaza, shot_street, shot_bridge))
print("PASS" if ok else "FAIL")
sys.exit(0 if ok else 1)
