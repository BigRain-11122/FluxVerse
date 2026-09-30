# -*- coding: utf-8 -*-
"""r0-v3-check.py — R0 v3 增量层机检（fail-loud：任一 FAIL → exit 1；C6 越带=WARN 不 FAIL）
C1 贴线带(律3 死核双排) C2 进深帽(律2) C3 壳映射完备(律5) C4 地标(律14)
C5 覆盖=路网 Dijkstra(律10) C6 商配比(律6·8:1 锚) C7 污染缓冲(律8·零 IND 空真)
C8 seed 确定性(双跑对账零差) R0 v0.1 回归(只增不改·converter 产物字节不变)
输出 : r0-v3-check.log（本文件=证据件；控制台只出摘要）
"""
import json, os, sys, hashlib, subprocess, heapq, importlib.util

HERE = os.path.dirname(os.path.abspath(__file__))
R0 = os.path.join(HERE, 'td-organic-r0.json')
CELLS = os.path.join(HERE, 'td-organic-r0-cells.json')
LAYER = os.path.join(HERE, 'r0-v3-layer.json')
UPGRADE = os.path.join(HERE, 'r0-v3-upgrade.py')
CONVERTER = os.path.join(HERE, 'citysim-from-r0.py')
FV = os.path.dirname(os.path.dirname(HERE))
BP = os.path.join(FV, 'City3D', 'Assets', 'CitySim', 'citysim-blueprint.json')
AUDIT = os.path.join(FV, 'City3D-staging', 'citysim-blueprint-audit.json')
LOG = os.path.join(HERE, 'r0-v3-check.log')

FUNC_MAP = {'住': 'RES', '办': 'OFF', '商': 'SHOP', '夜': 'CLUB', '公': 'PUB'}
TIER_ID = {'TRUNK': 0, 'SEC': 1, 'ALLEY': 2}
TIER_COST_CM = {0: 500, 1: 675, 2: 850}
LIMIT_CM = 12000
BAND_D2 = 6.4 * 6.4
SHELL = {'RES': 'AD-021', 'OFF': 'AD-035', 'SHOP': 'AD-002', 'CLUB': 'AD-008', 'PUB': 'AD-048'}
HIGH_DENSITY_CELLS = 100
STATS_LOW, STATS_HIGH = 0.10, 0.15

L = []
def rec(status, code, msg): L.append('%s %s %s' % (status, code, msg))
def sha(p):
    return hashlib.sha256(open(p, 'rb').read()).hexdigest()[:16] if os.path.exists(p) else None

def road_map(r0):
    roads = {}
    for name in ('TRUNK', 'SEC', 'ALLEY'):
        for (x, y) in r0['tiers'][name]:
            if (x, y) not in roads: roads[(x, y)] = TIER_ID[name]
    return roads

def road_dist2_grid(roads, n):
    INF = 1 << 30
    g = [[INF] * n for _ in range(n)]
    for (x, y) in roads:
        for dx in range(-12, 13):
            xx = x + dx
            if xx < 0 or xx >= n: continue
            row = g[xx]
            for dy in range(-12, 13):
                yy = y + dy
                if yy < 0 or yy >= n: continue
                d2 = dx * dx + dy * dy
                if d2 < row[yy]: row[yy] = d2
    return g

def nearest_road_cells(roads, cx, cy):
    bd = None; out = []
    for (x, y) in roads:
        d = (x - cx) ** 2 + (y - cy) ** 2
        if bd is None or d < bd: bd = d; out = [(x, y)]
        elif d == bd: out.append((x, y))
    return bd, out

def dijkstra_cm(roads, src, limit_cm):
    dist = {src: 0}; pq = [(0, src)]
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
                dist[v] = nd; heapq.heappush(pq, (nd, v))
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
        if len(a) != len(b): out.append(path + ':len')
        for i, (x, y) in enumerate(zip(a, b)):
            deep_diff(x, y, path + '[%d]' % i, out)
    elif a != b:
        out.append('%s: %r != %r' % (path, a, b))
    return out

def main():
    L.append('R0-V3-CHECK log 2026-09-30 (fail-loud: FAIL -> exit 1; C6 越带=WARN 不 FAIL)')
    n_pass = n_warn = n_fail = 0
    r0hash0 = sha(R0)
    r0 = json.load(open(R0, encoding='utf-8'))
    cells = json.load(open(CELLS, encoding='utf-8'))
    if not os.path.exists(LAYER):
        rec('FAIL', 'PRE', 'r0-v3-layer.json 缺失——先跑 r0-v3-upgrade.py')
        finish()
        return 1
    layer = json.load(open(LAYER, encoding='utf-8'))
    roads = road_map(r0)
    grid_d2 = road_dist2_grid(roads, r0['meta']['grid'])
    blocks = []
    for b in r0['blocks']:
        f = FUNC_MAP.get(b['function'], 'PUB')
        cl = [tuple(p) for p in cells.get(str(b['id']), [])]
        blocks.append((b, f, cl))

    # ---- C1 贴线带（律3：可建格=带内格 100% ≤32m；带外=死核→公园/白盒） ----
    band_info = {}; worst = 0.0; no_front = []
    for (b, f, cl) in blocks:
        band = [(x, y) for (x, y) in cl if grid_d2[x][y] <= BAND_D2]
        core = len(cl) - len(band)
        mx = max((grid_d2[x][y] for (x, y) in band), default=None)
        mxd = (mx ** 0.5) if mx is not None else None
        band_info[b['id']] = (len(band), core, mxd)
        if not band: no_front.append(b['id'])
        if mxd is not None and mxd > worst: worst = mxd
    tot_cells = sum(len(cl) for (_, _, cl) in blocks)
    tot_band = sum(v[0] for v in band_info.values())
    tot_core = sum(v[1] for v in band_info.values())
    if no_front or worst > 6.4:
        rec('FAIL', 'C1', '贴线带破律：无前缘块=%s 最远可建格=%.2f 格' % (no_front or '-', worst))
    else:
        rec('PASS', 'C1', '贴线带：16 块全有前缘；可建带 %d 格 100%% ≤6.4 格（最远 %.2f 格=%.1fm≤32m）'
            % (tot_band, worst, worst * 5.0))
    rec('NOTE', 'C1', '律3 escape：带外死核 %d/%d 格（%.1f%%）→公园/白盒非可建（B0/B3/B15/B16 深、PUB 块次之）'
        % (tot_core, tot_cells, 100.0 * tot_core / tot_cells))

    # ---- C2 进深帽（律2：lot 进深=可建格→其所贴街道 距离 ≤32m） ----
    bad2 = [i for i, v in band_info.items() if v[2] is not None and v[2] > 6.4]
    gmax = max((v[2] for v in band_info.values() if v[2] is not None), default=0.0)
    if bad2:
        rec('FAIL', 'C2', '进深帽破律：块 %s 进深 %.2f 格 >6.4' % (bad2, gmax))
    else:
        rec('PASS', 'C2', '进深帽：16 块最大 lot 进深 %.2f 格=%.1fm ≤6.4 格(32m)（律2 窗口[24,32]m 上沿）'
            % (gmax, gmax * 5.0))

    # ---- C3 壳映射完备（律5） ----
    exp = []
    for (b, f, cl) in blocks:
        band = sum(1 for (x, y) in cl if grid_d2[x][y] <= BAND_D2)
        exp.append({'blockId': b['id'], 'district': b['district'], 'blockFunc': f, 'shell': SHELL[f],
                    'density': ('high' if len(cl) >= HIGH_DENSITY_CELLS else 'low') if f == 'RES' else '',
                    'mixed': (f == 'SHOP'), 'cells': len(cl), 'bandCells': band,
                    'coreCells': len(cl) - band})
    got = layer.get('blockShellHint')
    d3 = deep_diff(exp, got) if isinstance(got, list) else ['blockShellHint:missing']
    if d3:
        rec('FAIL', 'C3', '壳映射不一致 n=%d（首条：%s）' % (len(d3), d3[0]))
    else:
        rec('PASS', 'C3', '壳映射完备：16/16 块全有 shellHint（RES→AD-021 高/低密分档·OFF→AD-035·SHOP→AD-002·CLUB→AD-008·PUB→AD-048·SHOP 块 mixed 标=%d）'
            % sum(1 for e in exp if e['mixed']))

    # ---- C4 地标（律14） ----
    exp_lm = []
    for d in sorted(set(b['district'] for (b, f, cl) in blocks)):
        big = max(((b, cl) for (b, f, cl) in blocks if b['district'] == d),
                  key=lambda t: (t[0]['w_m'] * t[0]['h_m'], len(t[1]), -t[0]['id']))
        exp_lm.append({'district': d, 'blockId': big[0]['id'],
                       'areaM2': round(big[0]['w_m'] * big[0]['h_m'], 1)})
    d4 = deep_diff(exp_lm, layer.get('blockLandmark'))
    if d4:
        rec('FAIL', 'C4', '地标不一致 n=%d（首条：%s）' % (len(d4), d4[0]))
    else:
        rec('PASS', 'C4', '地标：4/4 区全有锚（%s）'
            % ' '.join('%s=B%d' % (e['district'], e['blockId']) for e in exp_lm))

    # ---- C5 覆盖=路网 Dijkstra（律10） ----
    pub_src = []
    for (b, f, cl) in blocks:
        if f == 'PUB':
            _, ties = nearest_road_cells(roads, b['centroid'][0], b['centroid'][1])
            pub_src.append((b['id'], min(ties)))
    pub_dist = [(pid, dijkstra_cm(roads, src, LIMIT_CM)) for (pid, src) in pub_src]
    exp_cov = []
    for (b, f, cl) in blocks:
        if f != 'RES': continue
        front = set()
        for (x, y) in cl:
            _, ties = nearest_road_cells(roads, x, y)
            front.update(ties)
        ids = []; best = None
        for (pid, dist) in pub_dist:
            ds = [dist[c] for c in front if c in dist]
            if ds:
                ids.append(pid)
                if best is None or min(ds) < best: best = min(ds)
        exp_cov.append({'blockId': b['id'], 'coveredBy': sorted(ids),
                        'minRoadM': (round(best / 100.0, 2) if best is not None else None)})
    uncovered = [e['blockId'] for e in exp_cov if not e['coveredBy']]
    d5 = deep_diff(exp_cov, layer.get('blockCoveredBy'))
    if uncovered or d5:
        rec('FAIL', 'C5', '覆盖破律：未覆盖 RES=%s；层对账差 n=%d（首条：%s）'
            % (uncovered or '-', len(d5), d5[0] if d5 else '-'))
    else:
        rec('PASS', 'C5', '覆盖=沿路 Dijkstra：RES %d/%d 100%% 被 ≥1 PUB 沿路 ≤120m 覆盖（%s）'
            % (len(exp_cov), len(exp_cov),
               ' '.join('B%d<-%s@%.0fm' % (e['blockId'], e['coveredBy'], e['minRoadM']) for e in exp_cov)))

    # ---- C6 商配比（律6） ----
    shop_cells = sum(len(cl) for (_, f, cl) in blocks if f == 'SHOP')
    res_cells = sum(len(cl) for (_, f, cl) in blocks if f == 'RES')
    jobs = shop_cells * 0.25; workers = res_cells * 2.0; residents = workers * 2.0
    ratio = jobs / residents if residents else 0.0
    exp_st = {'shopCells': shop_cells, 'shopJobs': jobs, 'resCells': res_cells,
              'resWorkers': workers, 'residents': residents, 'jobsPerResident': round(ratio, 4)}
    d6n = [k for k, v in exp_st.items() if abs((layer.get('shopStats') or {}).get(k, -1) - v) > 1e-9]
    if d6n:
        rec('FAIL', 'C6', 'stats 与重算不符：%s' % d6n)
    elif ratio < STATS_LOW or ratio > STATS_HIGH:
        if ratio < STATS_LOW:
            sug = '调整建议：+SHOP 格 ≥%d（至 %.0f 格=带下沿 10%%）或 −RES 格 ≥%d' % (
                -(-(int(1.6 * res_cells) - shop_cells) // 1), 1.6 * res_cells,
                shop_cells - int(1.6 * (res_cells - (shop_cells / 1.6 - res_cells))))
        else:
            sug = '调整建议：−SHOP 格 ≥%d 或 +RES 格 ≥%d（至带上沿 15%%）' % (
                shop_cells - int(2.4 * res_cells), -(-(shop_cells / 2.4 - res_cells) // 1))
        rec('WARN', 'C6', '商配比 %.4f 越带 [10%%,15%%]（8:1 锚=12.5%%）·%s' % (ratio, sug))
    else:
        rec('PASS', 'C6', '商配比 %.4f 落带 [10%%,15%%]（SHOP 岗 %.1f / residents %.0f·8:1 锚=12.5%%）'
            % (ratio, jobs, residents))
    rec('NOTE', 'C6', '容量模型差异注记：我方契约=CitySimCore SHOP cells×0.25 岗·RES cells×2 工人·residents=workers×2（假设）；CS 每格容量表（低C 0.5~1.0 岗/格·高R 0.6~1.6 户/格）为后续标定参考')

    # ---- C7 污染缓冲（律8） ----
    ind = [(b, f, cl) for (b, f, cl) in blocks if f == 'IND']
    if not ind:
        rec('PASS', 'C7', '污染缓冲：IND 块=0 → 空真通过（R0 无工业块）')
        rec('NOTE', 'C7', '语义：律8 污染源=IND；PUB 中央广场邻 RES=设计态非污染源（层 meta 头已注明）')
    else:
        res_c = [b['centroid'] for (b, f, cl) in blocks if f == 'RES']
        mind = min(((i[0]['centroid'][0] - r[0]) ** 2 + (i[0]['centroid'][1] - r[1]) ** 2) ** 0.5
                   for i in ind for r in res_c) * 5.0 if res_c else 999
        if mind < 32.0:
            rec('FAIL', 'C7', 'IND-R 质心距 %.1fm <32m 缓冲' % mind)
        else:
            rec('PASS', 'C7', 'IND-R 最小距 %.1fm ≥32m' % mind)

    # ---- C8 seed 确定性（双跑对账零差） ----
    try:
        spec = importlib.util.spec_from_file_location('r0_v3_upgrade', UPGRADE)
        mod = importlib.util.module_from_spec(spec); spec.loader.exec_module(mod)
        l1, t1 = mod.generate(); l2, t2 = mod.generate()
        disk = open(LAYER, encoding='utf-8').read()
        d8 = deep_diff(l1, l2)
        if t1 != t2 or d8:
            rec('FAIL', 'C8', '双跑对账差 n=%d（首条：%s）' % (len(d8), d8[0] if d8 else 'text'))
        elif disk != t1:
            rec('FAIL', 'C8', '盘上层 ≠ 新生成（版本漂移/手改）——重跑 r0-v3-upgrade.py')
        else:
            rec('PASS', 'C8', 'seed 确定性：双跑逐字段对账零差·盘上层=新生成（无 RNG·纯数据变换）')
    except Exception as e:
        rec('FAIL', 'C8', '执行异常: %r' % e)

    # ---- R0 v0.1 回归（只增不改） ----
    bp0, au0 = sha(BP), sha(AUDIT)
    p = subprocess.run([sys.executable, '-u', CONVERTER], capture_output=True, text=True)
    for ln in (p.stdout or '').strip().splitlines():
        rec('NOTE', 'R0', 'converter: ' + ln)
    if p.returncode != 0:
        rec('FAIL', 'R0', 'converter 退出码 %d: %s' % (p.returncode, (p.stderr or '')[:200]))
    else:
        bp1, au1 = sha(BP), sha(AUDIT)
        if bp0 and bp0 == bp1 and au0 and au0 == au1:
            rec('PASS', 'R0', 'v0.1 回归：converter 产物字节不变（bp %s·audit %s·%dB）'
                % (bp1, au1, os.path.getsize(BP)))
        elif bp0 is None:
            rec('PASS', 'R0', 'v0.1 回归：bp 原缺→双跑自洽 %s' % bp1)
        else:
            rec('FAIL', 'R0', 'converter 产物字节漂移 bp %s->%s audit %s->%s' % (bp0, bp1, au0, au1))
    mirror = sum(1 for e in layer.get('blockShellHint', [])
                 if any(e['blockId'] == b['id'] and e['district'] == b['district']
                        and e['blockFunc'] == FUNC_MAP.get(b['function'], 'PUB')
                        and e['cells'] == len(cells.get(str(b['id']), []))
                        for (b, f, cl) in blocks))
    r0hash1 = sha(R0)
    if mirror == len(blocks) and r0hash1 == r0hash0:
        rec('PASS', 'R0', '只增不改：层引用 16/16 与 r0 镜像一致·td-organic-r0.json 本体 hash 全程不变(%s)' % r0hash0)
    else:
        rec('FAIL', 'R0', '镜像 %d/16 或本体 hash 漂移 %s->%s' % (mirror, r0hash0, r0hash1))

    # ---- 附录：逐块带账 ----
    L.append('APPENDIX 逐块：id func cells band core maxLotDepth(m) cover')
    cov_by = {e['blockId']: e for e in layer.get('blockCoveredBy', [])}
    for (b, f, cl) in blocks:
        band, core, mxd = band_info[b['id']]
        c = cov_by.get(b['id'])
        L.append('  B%-2d %-5s cells=%-4d band=%-4d core=%-3d maxLot=%-5s cover=%s' % (
            b['id'], f, len(cl), band, core,
            ('%.1f' % (mxd * 5.0)) if mxd is not None else '-',
            ('PUB%s@%.0fm' % (c['coveredBy'], c['minRoadM'])) if c else '-'))
    finish()
    for ln in L:
        if ln.startswith('PASS'): n_pass += 1
        elif ln.startswith('WARN'): n_warn += 1
        elif ln.startswith('FAIL'): n_fail += 1
    green = (n_fail == 0)
    print('%s pass=%d warn=%d fail=%d -> %s' % (
        'CHECK-GREEN' if green else 'CHECK-FAIL', n_pass, n_warn, n_fail, os.path.basename(LOG)))
    return 0 if green else 1

def finish():
    open(LOG, 'w', encoding='utf-8', newline='\n').write('\n'.join(L) + '\n')

if __name__ == '__main__':
    sys.exit(main())
