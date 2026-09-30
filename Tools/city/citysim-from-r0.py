# -*- coding: utf-8 -*-
"""citysim-from-r0.py — R0 版式数据 -> CitySim 功能城市蓝图 JSON（层1->层2 数据契约）
溯源=CEO 令 2026-09-30「你自己决定，我只要结果。减少成本，提高效率，本地化能力体系建设」
输入 : td-organic-r0.json (tiers/bridges/blocks) + td-organic-r0-cells.json (每块格点)
输出 : City3D/Assets/CitySim/citysim-blueprint.json  (Unity JsonUtility 可读的平铺数组)
       City3D-staging/citysim-blueprint-audit.json    (审计副本)
契约 : 功能=A 档物理投影层（CEO 委托 T1 代决 2026-09-30）——地块实体+车道图输入，不做经营闭环。
"""
import json, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))  # -> FluxVerse
R0   = os.path.join(ROOT, 'Tools', 'city', 'td-organic-r0.json')
CELLS= os.path.join(ROOT, 'Tools', 'city', 'td-organic-r0-cells.json')
OUT  = os.path.join(ROOT, 'City3D', 'Assets', 'CitySim', 'citysim-blueprint.json')
AUDIT= os.path.join(ROOT, 'City3D-staging', 'citysim-blueprint-audit.json')

FUNC_MAP = {'住': 'RES', '办': 'OFF', '商': 'SHOP', '夜': 'CLUB', '公': 'PUB'}
TIER_ID  = {'TRUNK': 0, 'SEC': 1, 'ALLEY': 2}

def main():
    r0 = json.load(open(R0, encoding='utf-8'))
    cells = json.load(open(CELLS, encoding='utf-8'))
    meta = r0['meta']; grid = meta['grid']; cell_m = meta['cell_m']
    origin = -grid * cell_m / 2.0  # 城居中于世界原点

    roadX, roadY, roadTier, roadBridge = [], [], [], []
    bridge_set = {(b[0], b[1]) for b in r0['bridges']}
    seen = set()
    for name in ('TRUNK', 'SEC', 'ALLEY'):
        for (x, y) in r0['tiers'][name]:
            if (x, y) in seen: continue
            seen.add((x, y))
            roadX.append(x); roadY.append(y); roadTier.append(TIER_ID[name])
            roadBridge.append(1 if (x, y) in bridge_set else 0)

    bId, bDist, bFunc = [], [], []
    bCx, bCy, bWm, bHm, bWater = [], [], [], [], []
    cellFlat, cellStart = [], [0]
    unknown = 0
    for b in r0['blocks']:
        f = FUNC_MAP.get(b['function'])
        if f is None: unknown += 1
        bId.append(b['id']); bDist.append(b['district']); bFunc.append(f or 'PUB')
        c = b['centroid']; bCx.append(float(c[0])); bCy.append(float(c[1]))
        bWm.append(float(b['w_m'])); bHm.append(float(b['h_m']))
        bWater.append(1 if b['waterfront'] else 0)
        cl = cells.get(str(b['id']), [])
        for (x, y) in cl: cellFlat.extend((x, y))
        cellStart.append(len(cellFlat))

    anc = r0['anchors']
    bp = {
        'grid': grid, 'cellM': float(cell_m), 'originX': origin, 'originZ': origin,
        'anchorCenterX': anc['center'][0], 'anchorCenterY': anc['center'][1],
        'roadX': roadX, 'roadY': roadY, 'roadTier': roadTier, 'roadBridge': roadBridge,
        'blockId': bId, 'blockDistrict': bDist, 'blockFunc': bFunc,
        'blockCx': bCx, 'blockCy': bCy, 'blockWm': bWm, 'blockHm': bHm, 'blockWater': bWater,
        'blockCellFlat': cellFlat, 'blockCellStart': cellStart,
    }
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    s = json.dumps(bp, ensure_ascii=True, separators=(',', ':'))
    open(OUT, 'w', encoding='utf-8', newline='\n').write(s)
    open(AUDIT, 'w', encoding='utf-8', newline='\n').write(s)

    res_cells = sum(len(cells.get(str(b['id']), [])) for b, f in zip(r0['blocks'], bFunc) if f == 'RES')
    off_cells = sum(len(cells.get(str(b['id']), [])) for b, f in zip(r0['blocks'], bFunc) if f == 'OFF')
    print('BP-OK roads=%d(blocks-bridges=%d) blocks=%d cells=%d unknown-func=%d' % (
        len(roadX), sum(roadBridge), len(bId), len(cellFlat), unknown))
    print('BP-CAP res_cells=%d off_cells=%d origin=%.1f grid=%d cellM=%d' % (res_cells, off_cells, origin, grid, cell_m))

if __name__ == '__main__':
    main()
