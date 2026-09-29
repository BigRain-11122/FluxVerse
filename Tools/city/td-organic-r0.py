# -*- coding: utf-8 -*-
"""td-organic-r0.py — R0 版式定版生成器 v2（合成模式·City 3D 重构主线）

v1 lesson (kept as case law): the 2D-inherited organic road network FAILS the
citycraft-law machine checks (trunk disconnected / circuity 1.71 > 1.4 /
edge seal 10.5% < 60% / flood-fill yields 17 mega-blocks — organic roads are
not street walls). Per the rebuild authorization (O-2026-0929-019) the street
SYSTEM is now SYNTHESIZED per citycraft-law A①-⑤, keeping organ anchors:

  TRUNK : outer ring r/c in {2,61} (perimeter sensor-loop) + brain ring
          r/c in {16,47} + N-S / E-W spines through centre (messenger axes)
  SEC   : quartering lines of the four band regions (rows/cols 23,42)
  ALLEY : deferred to R2 dress (intra-quarter service lanes on demand)
  WATER : inherited river kept as organ (黄浦江) — bridges where roads cross
  SEAL  : outer band (rows/cols 0..1, 62..63) filled water(river side) /
          park(other sides) — ≥60% sealing by construction
  BLOCKS: 16 quarters (12 outer 65x90..100m + 4 brain-ring 75x75m CORE)
  QUOTA : 住/办/商/夜/公 by 120° district sectors (GAME/QUANT/MEDIA) + CORE

Emits td-organic-r0.json (+ td-organic-r0-cells.json) and prints checks.
Law: lowpoly3d-citycraft-law.md A①-⑤ + lowpoly3d-city-rebuild-plan.md R0.
Honest note: AD-022 road modules are fixed 5x5m — tiers map to piece types
(Lines/Median=TRUNK, Road_01=SEC, Road_Bare=ALLEY) at uniform 5m width.
"""
import json, math, os, random
from collections import deque

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, "td-organic-data.txt")
OUT = os.path.join(HERE, "td-organic-r0.json")
CELLS_OUT = os.path.join(HERE, "td-organic-r0-cells.json")
N = 64
CELL_M = 5
CXC = CYC = (N - 1) / 2.0
R_OUT, R_BRAIN, R_SEC = 2, 16, (23, 42)
GATES = [(2, 23), (2, 32), (2, 42), (61, 23), (61, 32), (61, 42),
         (23, 2), (32, 2), (42, 2), (23, 61), (32, 61), (42, 61)]


def load_legacy():
    """Parse only the organ anchors we keep (river cells, trees, shot anchors)."""
    water, trees = set(), set()
    for line in open(SRC, encoding="utf-8"):
        t = line.strip()
        if t.startswith("WATER "):
            water |= {tuple(int(v) for v in p.split(",")) for p in t.split()[1:] if "," in p}
        elif t.startswith("TREES "):
            trees |= {tuple(int(v) for v in p.split(",")) for p in t.split()[1:] if "," in p}
    return water, trees


def main():
    legacy_water, legacy_trees = load_legacy()

    # ---------- synthesize street system ----------
    trunk, sec, alley = set(), set(), set()
    def hline(r, c0, c1, s):
        for c in range(c0, c1 + 1): s.add((r, c))
    def vline(c, r0, r1, s):
        for r in range(r0, r1 + 1): s.add((r, c))
    # outer ring (sensor loop)
    hline(R_OUT, R_OUT, N - 1 - R_OUT, trunk); hline(N - 1 - R_OUT, R_OUT, N - 1 - R_OUT, trunk)
    vline(R_OUT, R_OUT, N - 1 - R_OUT, trunk); vline(N - 1 - R_OUT, R_OUT, N - 1 - R_OUT, trunk)
    # brain ring
    B = N - 1 - R_BRAIN  # 47
    hline(R_BRAIN, R_BRAIN, B, trunk); hline(B, R_BRAIN, B, trunk)
    vline(R_BRAIN, R_BRAIN, B, trunk); vline(B, R_BRAIN, B, trunk)
    # spines (messenger axes) full length
    hline(32, R_OUT, N - 1 - R_OUT, trunk); vline(32, R_OUT, N - 1 - R_OUT, trunk)
    # secondary: quarter the four bands
    for r in R_SEC:                      # top band rows 3..15 / bottom band rows 48..60
        vline(r, R_OUT + 1, R_BRAIN - 1, sec)
        vline(r, B + 1, N - 1 - R_OUT - 1, sec)
    for c in R_SEC:                      # left band cols 3..15 / right band cols 48..60
        hline(c, R_OUT + 1, R_BRAIN - 1, sec)
        hline(c, B + 1, N - 1 - R_OUT - 1, sec)
    roads = trunk | sec | alley

    # bridges: road cells crossing the inherited river
    bridges = roads & legacy_water
    water = set(legacy_water)
    # outer sealing band: rows/cols 0..1, 62..63 -> water on river sides (S/W), park elsewhere
    park = set()
    for r in range(N):
        for c in range(N):
            if (r, c) in roads:
                continue
            edge_band = r <= 1 or r >= N - 2 or c <= 1 or c >= N - 2
            if edge_band and (r, c) not in water:
                if r >= N - 20 or c <= 12:      # extend river to south/west edges
                    water.add((r, c))
                else:
                    park.add((r, c))

    def nbrs(c):
        r, c_ = c
        for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            if (r + dr, c_ + dc) in roads:
                yield (r + dr, c_ + dc)

    # ---------- district / function ----------
    def district(r, c_):
        rad = max(abs(r - CXC), abs(c_ - CYC))
        if rad <= 15: return "CORE"
        ang = math.degrees(math.atan2(-(r - CYC), (c_ - CXC)))
        if ang < 0: ang += 360
        if ang < 120: return "GAME"
        if ang < 240: return "QUANT"
        return "MEDIA"

    def quota(d, size, touching_water, has_park):
        if d == "CORE": return "公", "AD-022 Path/Plaza+AD-018 LandingPad（脑环广场）"
        if touching_water or has_park: return "公", "AD-022 WaterEdge+AD-015+AD-023（滨水/公园带）"
        if d == "GAME": return ("商", "AD-002 店面+AD-022 Shop") if size >= 150 else ("住", "AD-021 House+AD-022 Apartment")
        if d == "QUANT": return ("办", "AD-035 办公+AD-022 Office") if size >= 100 else ("住", "AD-022 Apartment+AD-021")
        return ("夜", "AD-008 夜店+AD-029 霓虹") if size >= 100 else ("商", "AD-002+AD-018 Sign")

    # ---------- blocks (inside outer ring only — sealing band is belt, not quarters) ----------
    walkable = {(r, c) for r in range(R_OUT + 1, N - 1 - R_OUT)
                for c in range(R_OUT + 1, N - 1 - R_OUT)
                if (r, c) not in roads and (r, c) not in water}
    blocks, seen = [], set()
    for cell in sorted(walkable):
        if cell in seen: continue
        comp, q = set(), deque([cell]); seen.add(cell)
        while q:
            u = q.popleft(); comp.add(u)
            for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1), (1, 1), (1, -1), (-1, 1), (-1, -1)):
                v = (u[0] + dr, u[1] + dc)
                if v in walkable and v not in seen:
                    seen.add(v); q.append(v)
        rs = [p[0] for p in comp]; cs = [p[1] for p in comp]
        r0, r1, c0, c1 = min(rs), max(rs), min(cs), max(cs)
        dcount = {}
        for p in comp: dcount[district(*p)] = dcount.get(district(*p), 0) + 1
        d = max(dcount, key=dcount.get)
        size = len(comp)
        tw = any((p[0] + dr, p[1] + dc) in water for p in comp for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)))
        hp = bool(park & comp)
        fn, pk = quota(d, size, tw, hp)

        def edge_tier(cells):
            ts = [2 if x in trunk else 1 if x in sec else 0 for x in cells if x in roads]
            return ["ALLEY", "SEC", "TRUNK"][max(ts)] if ts else "NONE"
        streets = {"N": edge_tier([(r0 - 1, c) for c in range(c0, c1 + 1)]),
                   "S": edge_tier([(r1 + 1, c) for c in range(c0, c1 + 1)]),
                   "W": edge_tier([(r, c0 - 1) for r in range(r0, r1 + 1)]),
                   "E": edge_tier([(r, c1 + 1) for r in range(r0, r1 + 1)])}
        blocks.append(dict(id=len(blocks), cells=sorted(comp), size=size,
                           bbox=[r0, c0, r1, c1], w_m=(c1 - c0 + 1) * CELL_M, h_m=(r1 - r0 + 1) * CELL_M,
                           district=d, function=fn, pack=pk, streets=streets,
                           centroid=[round(sum(p[0] for p in comp) / size, 1), round(sum(p[1] for p in comp) / size, 1)]))

    # merge slivers (<30 cells) split by the river into their largest water-adjacent neighbour
    changed = True
    while changed:
        changed = False
        by_id = {b["id"]: b for b in blocks}
        # water-adjacency pairs: water cell touching two different blocks
        pairs = {}
        for (r, c) in water:
            nbs = set()
            for dr in (-2, -1, 0, 1, 2):
                for dc in (-2, -1, 0, 1, 2):
                    v = (r + dr, c + dc)
                    for b in blocks:
                        if v in b["cells"]:
                            nbs.add(b["id"]); break
            nbs = sorted(nbs)
            for i in range(len(nbs)):
                for j in range(i + 1, len(nbs)):
                    k = (nbs[i], nbs[j])
                    pairs[k] = pairs.get(k, 0) + 1
        small = [b for b in blocks if b["size"] < 30]
        if not small:
            break
        s = min(small, key=lambda b: b["size"])
        cands = [o for (a, b_), n in pairs.items() if s["id"] in (a, b_) and n >= 2 for o in (a, b_) if o != s["id"]]
        if not cands:
            cands = [b["id"] for b in blocks if b["id"] != s["id"] and max(abs(b["centroid"][0] - s["centroid"][0]), abs(b["centroid"][1] - s["centroid"][1])) < 12]
        if not cands:
            break
        tgt = by_id[max(cands, key=lambda i: by_id[i]["size"])]
        tgt["cells"] = sorted(set(tgt["cells"]) | set(s["cells"])); tgt["size"] = len(tgt["cells"])
        rs = [p[0] for p in tgt["cells"]]; cs = [p[1] for p in tgt["cells"]]
        tgt["bbox"] = [min(rs), min(cs), max(rs), max(cs)]
        tgt["w_m"] = (tgt["bbox"][2] - tgt["bbox"][0] + 1) * CELL_M
        tgt["h_m"] = (tgt["bbox"][3] - tgt["bbox"][1] + 1) * CELL_M
        tgt["centroid"] = [round(sum(p[0] for p in tgt["cells"]) / tgt["size"], 1), round(sum(p[1] for p in tgt["cells"]) / tgt["size"], 1)]
        dc_ = {}
        for p in tgt["cells"]: dd = district(*p); dc_[dd] = dc_.get(dd, 0) + 1
        tgt["district"] = max(dc_, key=dc_.get)
        blocks = [b for b in blocks if b["id"] != s["id"]]
        changed = True
    # recompute per-block derived fields after merges
    for b in blocks:
        r0, c0, r1, c1 = b["bbox"]
        tw = any((p[0] + dr, p[1] + dc) in water for p in b["cells"] for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)))
        hp = bool(park & set(b["cells"]))
        outer = (r0 < R_BRAIN or r1 > B or c0 < R_BRAIN or c1 > B)  # outside brain-ring box
        if b["district"] == "CORE":
            fn, pk = "公", "AD-022 Path/Plaza+AD-018 LandingPad（脑环广场）"
        elif hp:
            fn, pk = "公", "AD-015+AD-023（公园带）"
        elif b["district"] == "GAME":
            fn, pk = ("商", "AD-002 店面+AD-022 Shop") if b["size"] >= 150 else ("住", "AD-021 House+AD-022 Apartment")
        elif b["district"] == "QUANT":
            fn, pk = ("办", "AD-035 办公+AD-022 Office") if b["size"] >= 100 else ("住", "AD-022 Apartment+AD-021")
        else:
            fn, pk = ("夜", "AD-008 夜店+AD-029 霓虹") if b["size"] >= 100 else ("商", "AD-002+AD-018 Sign")
        b["function"], b["pack"] = fn, pk
        b["waterfront"] = tw  # builder hint: river-facing facade -> WaterEdge props/滨水街面

        def edge_tier(cells):
            ts = [2 if x in trunk else 1 if x in sec else 0 for x in cells if x in roads]
            return ["ALLEY", "SEC", "TRUNK"][max(ts)] if ts else "NONE"
        b["streets"] = {"N": edge_tier([(r0 - 1, c) for c in range(c0, c1 + 1)]),
                        "S": edge_tier([(r1 + 1, c) for c in range(c0, c1 + 1)]),
                        "W": edge_tier([(r, c0 - 1) for r in range(r0, r1 + 1)]),
                        "E": edge_tier([(r, c1 + 1) for r in range(r0, r1 + 1)])}
    def components(s):
        seen, comps = set(), []
        for c in s:
            if c in seen: continue
            comp, q = set(), deque([c]); seen.add(c)
            while q:
                u = q.popleft(); comp.add(u)
                for v in nbrs(u):
                    if v in s and v not in seen: seen.add(v); q.append(v)
            comps.append(comp)
        return comps
    tcomps = components(trunk)
    trunk_connected = len(tcomps) == 1
    trunk_edges = sum(sum(1 for _ in nbrs(c)) for c in trunk) // 2
    trunk_ring = trunk_edges > len(trunk) - 1 if trunk_connected else False

    # circuity: BFS from sampled block-road-snapped centroids
    def bfs(src):
        prev = {src: None}; q = deque([src])
        while q:
            u = q.popleft()
            for v in nbrs(u):
                if v not in prev: prev[v] = u; q.append(v)
        return prev
    rng = random.Random(42)
    pool = [b for b in blocks if b["size"] >= 40]
    sample = rng.sample(pool, min(12, len(pool)))
    srcs = []
    for b in sample:
        s0 = (int(b["centroid"][0]), int(b["centroid"][1]))
        if s0 not in roads:
            s0 = min(roads, key=lambda c: (c[0] - s0[0]) ** 2 + (c[1] - s0[1]) ** 2)
        srcs.append(s0)
    graphs = [bfs(s0) for s0 in srcs]
    circs = []
    for i in range(min(6, len(graphs))):
        for j in range(i + 1, min(6, len(graphs))):
            pa = graphs[i]; a = srcs[i]; b = srcs[j]
            if b in pa:
                plen, u = 0, b
                while pa[u] is not None: plen += 1; u = pa[u]
                eu = math.hypot(a[0] - b[0], a[1] - b[1]) * CELL_M
                if eu > 40: circs.append(round(plen * CELL_M / eu, 3))
    circity_avg = round(sum(circs) / len(circs), 3) if circs else None
    circity_bad = [c for c in circs if c > 1.4]

    band = [(r, c) for r in range(N) for c in range(N)
            if (r <= 1 or r >= N - 2 or c <= 1 or c >= N - 2) and (r, c) not in roads]
    sealed = sum(1 for p in band if p in water or p in park)
    seal_pct = round(100.0 * sealed / len(band), 1)
    in_band = [b for b in blocks if 61 <= max(b["w_m"], b["h_m"]) <= 150]
    band_ok = round(100.0 * len(in_band) / max(1, len(blocks)), 1)

    tiers = {"TRUNK": sorted(trunk), "SEC": sorted(sec), "ALLEY": sorted(alley)}
    out = dict(
        meta=dict(grid=N, cell_m=CELL_M, city_m=N * CELL_M, mode="synthesize-v2",
                  law="lowpoly3d-citycraft-law.md A①-⑤ + lowpoly3d-city-rebuild-plan.md R0",
                  v1_case="继承有机路网机检判负（主干断/circuity 1.71/封边 10.5%/17 巨块）→ 按重构授权改合成模式",
                  honest_note="AD-022 路件固定 5x5m：三级=件型分级（Lines/Median=TRUNK·Road_01=SEC·Road_Bare=ALLEY 待 R2）·物理宽 5m；ALLEY R0 空置=支路随 R2 街坊内装需求生成"),
        tiers=tiers, tier_counts={k: len(v) for k, v in tiers.items()},
        bridges=sorted(bridges), gates=[list(g) for g in GATES],
        blocks=[{k: v for k, v in b.items() if k != "cells"} | {"cells_n": b["size"]} for b in blocks],
        checks=dict(trunk_connected=trunk_connected, trunk_components=len(tcomps), trunk_ring=trunk_ring,
                    circity_avg=circity_avg, circity_bad=circity_bad, circity_n=len(circs),
                    edge_seal_pct=seal_pct, walkable_band_pct=band_ok,
                    blocks_total=len(blocks), quarters_61_150=len(in_band)),
        anchors=dict(center=[32, 32], brain_ring=[R_BRAIN, B],
                     legacy_water_cells=len(legacy_water), trees_scattered=len(legacy_trees)),
    )
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=1)
    with open(CELLS_OUT, "w", encoding="utf-8") as f:
        json.dump({str(b["id"]): b["cells"] for b in blocks}, f, ensure_ascii=False)
    c = out["checks"]
    print("tiers:", out["tier_counts"], "bridges:", len(bridges))
    print("blocks:", c["blocks_total"], "quarters_61_150m:", c["quarters_61_150"], "walkable_band_pct:", c["walkable_band_pct"])
    print("trunk_connected:", c["trunk_connected"], "trunk_ring:", c["trunk_ring"])
    print("circity_avg:", c["circity_avg"], "bad:", c["circity_bad"], "n:", c["circity_n"])
    print("edge_seal_pct:", c["edge_seal_pct"])
    from collections import Counter
    print("quota:", dict(Counter(b["function"] for b in blocks)))
    print("districts:", dict(Counter(b["district"] for b in blocks)))
    print("OUT:", OUT)


if __name__ == "__main__":
    main()
