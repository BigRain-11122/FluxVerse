# -*- coding: utf-8 -*-
"""r0-v3-upgrade.py — R0 v3 增量层生成器（CS 15 律数据层预计算·CEO 令 2026-09-30「做到都市天际线程度」）
律源=cph4/research/R-20260930-cs-01-mechanics.md：律2 进深帽/律3 死核双排/律5 密度分轨壳映射/
     律6 8:1 商配/律10 沿路覆盖/律13 混合地块/律14 区级地标。
输入 : td-organic-r0.json + td-organic-r0-cells.json（只读·v0.1 本体零改·既有字段值零改）
输出 : r0-v3-layer.json（v3 增量层·只增不改·数组节供后续 C# 批经 JsonUtility 消费）
用法 : python -u r0-v3-upgrade.py [--verify]   # --verify=同输入双跑逐字段对账
确定性：无 RNG·纯数据变换；双跑零差（C8）。文件不含时间戳。
"""
import json, os, sys, heapq

HERE = os.path.dirname(os.path.abspath(__file__))
R0 = os.path.join(HERE, 'td-organic-r0.json')
CELLS = os.path.join(HERE, 'td-organic-r0-cells.json')
OUT = os.path.join(HERE, 'r0-v3-layer.json')

FUNC_MAP = {'住': 'RES', '办': 'OFF', '商': 'SHOP', '夜': 'CLUB', '公': 'PUB'}
TIER_ID = {'TRUNK': 0, 'SEC': 1, 'ALLEY': 2}
TIER_COST_CM = {0: 500, 1: 675, 2: 850}     # 律10：入格 cost = cellM(5m)×tier 系数 TRUNK1.0/SEC1.35/ALLEY1.7（整数厘米）
COVERAGE_LIMIT_CM = 12000                   # CitySimCore COVERAGE_RADIUS_M=120 的沿路版（律10 覆盖=沿路距离非直线）
BAND_D2 = 6.4 * 6.4                         # 律3：可建带 = 距最近路格(格心直线) ≤6.4 格=32m；>32m=死核→公园/白盒
SHELL = {'RES': 'AD-021', 'OFF': 'AD-035', 'SHOP': 'AD-002', 'CLUB': 'AD-008', 'PUB': 'AD-048'}  # 律5 密度分轨
HIGH_DENSITY_CELLS = 100                     # 律5：RES cells ≥100 → 高密楼壳，否则低密独栋
STATS_ANCHOR, STATS_LOW, STATS_HIGH = 0.125, 0.10, 0.15  # 律6：8:1 锚=12.5%·工程带 [10%,15%]

# ---------------- 数据加载 ----------------
def load():
    r0 = json.load(open(R0, encoding='utf-8'))
    cells = json.load(open(CELLS, encoding='utf-8'))
    return r0, cells

def road_map(r0):
    """路格→tier（TRUNK>SEC>ALLEY 去重优先级，与 citysim-from-r0.py 同构）。"""
    roads = {}
    for name in ('TRUNK', 'SEC', 'ALLEY'):
        for (x, y) in r0['tiers'][name]:
            if (x, y) not in roads:
                roads[(x, y)] = TIER_ID[name]
    return roads

def road_dist2_grid(roads, n):
    """全城格→最近路格距离²（格单位）。半径 12 格内精确。"""
    INF = 1 << 30
    g = [[INF] * n for _ in range(n)]
    R = 12
    for (x, y) in roads:
        for dx in range(-R, R + 1):
            xx = x + dx
            if xx < 0 or xx >= n: continue
            row = g[xx]
            for dy in range(-R, R + 1):
                yy = y + dy
                if yy < 0 or yy >= n: continue
                d2 = dx * dx + dy * dy
                if d2 < row[yy]: row[yy] = d2
    return g

def nearest_road_cells(roads, cx, cy):
    """(d², 全部并列最近路格)——并列全收，确定性（不依赖遍历序）。"""
    bd = None; out = []
    for (x, y) in roads:
        d = (x - cx) ** 2 + (y - cy) ** 2
        if bd is None or d < bd: bd = d; out = [(x, y)]
        elif d == bd: out.append((x, y))
    return bd, out

def dijkstra_cm(roads, src, limit_cm):
    """沿路 Dijkstra：4 向邻接；入格 cost=TIER_COST_CM[tier]（源格不计费）；整数厘米精确。"""
    dist = {src: 0}
    pq = [(0, src)]
    while pq:
        d, u = heapq.heappop(pq)
        if d > dist.get(u, 1 << 62): continue
        ux, uy = u
        for v in ((ux + 1, uy), (ux - 1, uy), (ux, uy + 1), (ux, uy - 1)):
            t = roads.get(v)
            if t is None: continue
            nd = d + TIER_COST_CM[t]
            if nd > limit_cm: continue
            if nd < dist.get(v, 1 << 62):
                dist[v] = nd
                heapq.heappush(pq, (nd, v))
    return dist

def deep_diff(a, b, path='', out=None):
    if out is None: out = []
    if type(a) is not type(b):
        out.append(path + ':type'); return out
    if isinstance(a, dict):
        for k in sorted(set(a) | set(b)):
            if k not in a: out.append(path + '/' + str(k) + ':only-b')
            elif k not in b: out.append(path + '/' + str(k) + ':only-a')
            else: deep_diff(a[k], b[k], path + '/' + str(k), out)
    elif isinstance(a, list):
        if len(a) != len(b): out.append(path + ':len %d!=%d' % (len(a), len(b)))
        for i, (x, y) in enumerate(zip(a, b)):
            deep_diff(x, y, path + '[%d]' % i, out)
    elif a != b:
        out.append('%s: %r != %r' % (path, a, b))
    return out

# ---------------- 层生成 ----------------
def generate():
    r0, cells = load()
    meta0 = r0['meta']
    n = meta0['grid']
    roads = road_map(r0)
    grid_d2 = road_dist2_grid(roads, n)
    blocks = []
    for b in r0['blocks']:
        f = FUNC_MAP.get(b['function'], 'PUB')  # 与转换器同构的兜底
        cl = [tuple(p) for p in cells.get(str(b['id']), [])]
        blocks.append((b, f, cl))

    # 律5/律13：壳映射 + 密度分档 + SHOP 可 mixed；律3：可建带/死核分账
    shell_hint = []
    band_map = {}
    for (b, f, cl) in blocks:
        band = sum(1 for (x, y) in cl if grid_d2[x][y] <= BAND_D2)
        core = len(cl) - band
        band_map[b['id']] = (band, core)
        shell_hint.append({
            'blockId': b['id'], 'district': b['district'], 'blockFunc': f,
            'shell': SHELL[f],
            'density': ('high' if len(cl) >= HIGH_DENSITY_CELLS else 'low') if f == 'RES' else '',
            'mixed': (f == 'SHOP'),
            'cells': len(cl), 'bandCells': band, 'coreCells': core,
        })

    # 律14：区级地标 = 该区面积最大块（w_m×h_m，并列依次比 cells、小 id——确定性）
    landmark = []
    for d in sorted(set(b['district'] for (b, f, cl) in blocks)):
        big = max(((b, cl) for (b, f, cl) in blocks if b['district'] == d),
                  key=lambda t: (t[0]['w_m'] * t[0]['h_m'], len(t[1]), -t[0]['id']))
        landmark.append({'district': d, 'blockId': big[0]['id'],
                        'areaM2': round(big[0]['w_m'] * big[0]['h_m'], 1)})

    # 律10：覆盖=沿路 Dijkstra ≤120m。源=PUB 质心最近路格（并列取最小序）；
    #       目标=RES 块前缘路格集（块内每可建格之全部并列最近路格）——门面即服务接入点
    #       （B9 质心路格沿路不可达而前缘可达，实证取前缘语义）。
    pub_src = []
    for (b, f, cl) in blocks:
        if f == 'PUB':
            _, ties = nearest_road_cells(roads, b['centroid'][0], b['centroid'][1])
            pub_src.append((b['id'], min(ties)))
    pub_dist = [(pid, dijkstra_cm(roads, src, COVERAGE_LIMIT_CM)) for (pid, src) in pub_src]
    covered = []
    for (b, f, cl) in blocks:
        if f != 'RES': continue
        front = set()
        for (x, y) in cl:
            _, ties = nearest_road_cells(roads, x, y)
            front.update(ties)
        ids = []; best_cm = None
        for (pid, dist) in pub_dist:
            ds = [dist[c] for c in front if c in dist]
            if ds:
                ids.append(pid)
                m = min(ds)
                if best_cm is None or m < best_cm: best_cm = m
        covered.append({'blockId': b['id'], 'coveredBy': sorted(ids),
                        'minRoadM': (round(best_cm / 100.0, 2) if best_cm is not None else None)})

    # 律6：商配比（全城）——假设 residents = workers × 2（CitySimCore：RES cells×2 工人）
    shop_cells = sum(bc for (b, f, cl) in blocks if f == 'SHOP' for bc in [len(cl)])
    res_cells = sum(bc for (b, f, cl) in blocks if f == 'RES' for bc in [len(cl)])
    shop_jobs = shop_cells * 0.25            # CitySimCore：SHOP cells×0.25 岗
    res_workers = res_cells * 2.0
    residents = res_workers * 2.0            # 头注假设
    stats = {
        'shopCells': shop_cells, 'shopJobs': shop_jobs,
        'resCells': res_cells, 'resWorkers': res_workers, 'residents': residents,
        'jobsPerResident': round(shop_jobs / residents, 4) if residents else 0.0,
        'anchor': STATS_ANCHOR, 'bandLow': STATS_LOW, 'bandHigh': STATS_HIGH,
    }

    core_total = sum(v[1] for v in band_map.values())
    layer = {
        'meta': {
            'layer': 'r0-v3', 'generator': 'r0-v3-upgrade.py',
            'source': 'td-organic-r0.json + td-organic-r0-cells.json (read-only, v0.1 untouched)',
            'mode': meta0.get('mode', ''),
            'laws': 'cph4/research/R-20260930-cs-01-mechanics.md (CS15: 2/3/5/6/10/13/14)',
            'assumptions': [
                'residents = workers x 2; workers = RES cells x 2 (CitySimCore capacity contract)',
            ],
            'semantics': {
                'band': '可建带 cell := 距最近路格(格心直线) <= 6.4格(32m, 律3)；coreCells(>32m)=死核 -> 公园/白盒(律3 escape)，非可建；R0 core 共 %d 格' % core_total,
                'coverage': 'blockCoveredBy = PUB->RES 沿路 Dijkstra <= 120m；source=PUB质心最近路格(并列取最小序)；target=RES块前缘路格集(每可建格之全部并列最近路格)；入格cost=cellM(5m)xtier系数(TRUNK1.0/SEC1.35/ALLEY1.7)；4向邻接；整数厘米；取代 CitySimCore COVERAGE_RADIUS_M=120 直线版(律10)，C# 后续批消费',
                'pollutionBuffer': 'R0 零 IND 块 -> C7 空真；PUB 中央广场邻 RES=设计态，非污染源(律8 只针对 IND)',
                'mixed': 'SHOP 块 mixed=true -> 律13 混合地块(AD-002 首层商 + AD-021 上部住)',
                'landmark': '区地标 = 该区 w_m x h_m 最大块(律14)',
                'shellMap': 'RES->AD-021 / OFF->AD-035 / SHOP->AD-002 / CLUB->AD-008 / PUB->AD-048；RES cells>=100 -> 高密(律5)',
            },
            'costPerCellCm': {'TRUNK': 500, 'SEC': 675, 'ALLEY': 850},
            'coverageLimitM': 120.0,
            'consumedBy': 'C# 后续批：blockShellHint/blockLandmark/blockCoveredBy/shopStats 为 JsonUtility 可映射数组节；meta 为文档节',
        },
        'blockShellHint': shell_hint,
        'blockLandmark': landmark,
        'blockCoveredBy': covered,
        'shopStats': stats,
    }
    text = json.dumps(layer, ensure_ascii=False, indent=1)
    return layer, text

def main(argv):
    layer, text = generate()
    if '--verify' in argv:
        layer2, text2 = generate()
        diffs = deep_diff(layer, layer2)
        if text != text2 or diffs:
            print('V3-VERIFY DIFF n=%d' % len(diffs))
            for p in diffs[:20]: print('  DIFF', p)
            return 1
        print('V3-VERIFY OK double-run identical (0 diff)')
    open(OUT, 'w', encoding='utf-8', newline='\n').write(text)
    st = layer['shopStats']; cov = layer['blockCoveredBy']
    print('V3-OK shell=%d landmark=%d covered=%d/%d min=%.1fm ratio=%.4f core=%d -> %s' % (
        len(layer['blockShellHint']), len(layer['blockLandmark']),
        sum(1 for c in cov if c['coveredBy']), len(cov),
        min((c['minRoadM'] for c in cov if c['minRoadM'] is not None), default=0.0),
        st['jobsPerResident'],
        sum(s['coreCells'] for s in layer['blockShellHint']), os.path.basename(OUT)))
    return 0

if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
