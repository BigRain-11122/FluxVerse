# -*- coding: utf-8 -*-
# 离线复算：定位 A2 城批 4 失败门所属 lot 与前缘参数（CitySimShellBuilder.StripLots/GeneralEdge 数学复刻·v2 修 W/E 支路）
import json, io, math

BP = json.load(io.open(r'gaming\FluxVerse\City3D\Assets\CitySim\citysim-blueprint.json', encoding='utf-8-sig'))
LY = json.load(io.open(r'gaming\FluxVerse\Tools\city\r0-v3-layer.json', encoding='utf-8-sig'))

grid, cellM, ox, oz = BP['grid'], BP['cellM'], BP['originX'], BP['originZ']
road = set((x, y) for x, y in zip(BP['roadX'], BP['roadY']))
blocks = {}
for b in range(len(BP['blockId'])):
    bid = BP['blockId'][b]
    s, e = BP['blockCellStart'][b], BP['blockCellStart'][b + 1]
    flat = BP['blockCellFlat']
    blocks[bid] = [(flat[k], flat[k + 1]) for k in range(s, e, 2)]
hint = {h['blockId']: h for h in LY['blockShellHint']}
FAIL = [(-145.0, 16.8), (-33.3, 80.0), (-20.0, 80.0), (-6.7, 80.0)]

def row_road(x0, x1, y): return 0 <= y < grid and any((x, y) in road for x in range(x0, x1 + 1))
def col_road(y0, y1, x): return 0 <= x < grid and any((x, y) in road for y in range(y0, y1 + 1))
def rnd(x): return math.floor(x + 0.5)
def bestn(span, ln):
    n = max(1, rnd(span / ln))
    best = abs(span / (n * ln) - 1.0); bn = n
    for k in range(max(1, n - 1), n + 2):
        d = abs(span / (k * ln) - 1.0)
        if d < best: best, bn = d, k
    return bn

# 门记录（GeneralEdge：n=BestN(span,LongOf(墙件)=2.5)·doorIdx=n//2·门槽中点）
def door_of_lot(lx0, lx1, lz0, lz1, axisZ, posSide, depth):
    if axisZ:
        rx0, rx1 = lx0, lx1
        rz0 = lz1 - depth if posSide else lz0
        rz1 = lz1 if posSide else lz0 + depth
        fA_x, fB_x, line = rx0, rx1, (rz1 if posSide else rz0)
        span2 = rx1 - rx0
    else:
        rz0, rz1 = lz0, lz1
        rx0 = lx1 - depth if posSide else lx0
        rx1 = lx1 if posSide else lx0 + depth
        fA_z, fB_z, line = rz0, rz1, (rx1 if posSide else rx0)
        span2 = rz1 - rz0
    n2 = bestn(span2, 2.5); di = n2 // 2
    t = (di + 0.5) * span2 / n2
    si = (span2 / n2) / 2.5
    if axisZ: return (fA_x + t, line), span2, n2, di, si
    else: return (line, fA_z + t), span2, n2, di, si

out = []
for bid, h in sorted(hint.items()):
    cells = blocks.get(bid)
    if not cells or h['blockFunc'] == 'PUB': continue
    xs = [c[0] for c in cells]; ys = [c[1] for c in cells]
    x0, x1, y0, y1 = min(xs), max(xs), min(ys), max(ys)
    wx0, wx1 = ox + x0 * cellM, ox + (x1 + 1) * cellM
    wz0, wz1 = oz + y0 * cellM, oz + (y1 + 1) * cellM
    hasN = row_road(x0, x1, y1 + 1) or row_road(x0, x1, y1 + 2)
    hasS = row_road(x0, x1, y0 - 1) or row_road(x0, x1, y0 - 2)
    hasW = col_road(y0, y1, x0 - 1) or col_road(y0, y1, x0 - 2)
    hasE = col_road(y0, y1, x1 + 1) or col_road(y0, y1, x1 + 2)
    w, hh = wx1 - wx0, wz1 - wz0
    dNS = min(32.5, hh / 2); dWE = min(32.5, w / 2)
    func = h['blockFunc']
    strips = []
    if hasN: strips.append(('N', wx0, wx1, wz1 - dNS, wz1, True, True, y1, y1 + 1))
    if hasS: strips.append(('S', wx0, wx1, wz0, wz0 + dNS, True, False, y0, y0 - 1))
    midZ0, midZ1 = wz0 + (dNS if hasS else 0), wz1 - (dNS if hasN else 0)
    if hasW and midZ1 - midZ0 >= 20: strips.append(('W', wx0, wx0 + dWE, midZ0, midZ1, False, False, x0, x0 - 1))
    if hasE and midZ1 - midZ0 >= 20: strips.append(('E', wx1 - dWE, wx1, midZ0, midZ1, False, True, x1, x1 + 1))
    for (side, ax0, ax1, bz0, bz1, axisZ, posSide, gc, oc) in strips:
        # C# StripLots：axisZ=沿 X 分（ax=x 范围·bz=z 范围）·!axisZ=沿 Z 分（ax=x 恒定·bz=z 范围）
        lotW = 12.5 if func == 'RES' else 25.0
        span = (ax1 - ax0) if axisZ else (bz1 - bz0)
        n = max(1, rnd(span / lotW))
        for i in range(n):
            l0, l1 = span * i / n, span * (i + 1) / n
            if axisZ:
                lx0, lx1, lz0, lz1 = ax0 + l0, ax0 + l1, bz0, bz1
                midWorld = (l0 + l1) / 2 + ax0
                midCell = rnd(midWorld / cellM - ox / cellM - 0.5)
                gx, gy = midCell, gc
            else:
                lx0, lx1, lz0, lz1 = ax0, ax1, bz0 + l0, bz0 + l1
                midWorld = (l0 + l1) / 2 + bz0
                midCell = rnd(midWorld / cellM - oz / cellM - 0.5)
                gx, gy = gc, midCell
            if (gx, gy) not in set(cells): continue
            stripDepth = (bz1 - bz0) if axisZ else (ax1 - ax0)
            depth = min(16.0, stripDepth) if func == 'RES' else stripDepth
            dm, span2, n2, di, si = door_of_lot(lx0, lx1, lz0, lz1, axisZ, posSide, depth)
            rec = dict(bid=bid, func=func, side=side, i=i, axisZ=axisZ, posSide=posSide,
                       lx=(round(lx0, 2), round(lx1, 2)), lz=(round(lz0, 2), round(lz1, 2)),
                       span2=round(span2, 3), n2=n2, di=di, si=round(si, 4), doorMid=(round(dm[0], 2), round(dm[1], 2)))
            for fpos in FAIL:
                if abs(dm[0] - fpos[0]) < 0.06 and abs(dm[1] - fpos[1]) < 0.06:
                    rec['MATCH'] = fpos
                    out.append(rec)
                    print('MATCH', fpos, '->', rec)

print()
print('--- 全 RES 门 si 分布（失败 4 门应全部 si!=1）---')
for r in out:
    print('bid=%s side=%s i=%s si=%s door=%s' % (r['bid'], r['side'], r['i'], r['si'], r['doorMid']))
