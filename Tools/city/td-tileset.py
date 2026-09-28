#!/usr/bin/env python3
# Cel-style tileset for the FluxVerse tile city (CEO order 2026-09-28 ~15:00:
# assemble the 2D map IN UNITY with real tiles - not a baked image).
# 24 tiles at 32px (1 world unit at PPU 32). Ground tiles are opaque; road and
# bridge tiles are transparent outside their band so the ground layer beneath
# shows through (proper two-layer tilemap look).
import os
from PIL import Image, ImageDraw

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
OUT = os.path.join(ROOT, 'City', 'Assets', 'Art', 'TDTiles')
os.makedirs(OUT, exist_ok=True)

S = 32

C = {
    'grass1': (143, 202, 114, 255),
    'grass1a': (122, 187, 96, 255),
    'grass1b': (162, 217, 138, 255),
    'grass2': (134, 196, 107, 255),
    'park': (116, 184, 92, 255),
    'parkd': (98, 163, 76, 255),
    'sand': (234, 215, 164, 255),
    'sandd': (214, 191, 133, 255),
    'plaza': (241, 229, 195, 255),
    'plazag': (217, 201, 160, 255),
    'water': (79, 143, 212, 255),
    'waterl': (111, 168, 226, 255),
    'waterf': (222, 238, 252, 255),
    'asph': (91, 91, 104, 255),
    'asphh': (126, 126, 140, 255),
    'outl': (62, 62, 73, 255),
    'dash': (236, 234, 218, 255),
    'wood': (164, 113, 78, 255),
    'woodp': (138, 92, 62, 255),
    'rail': (107, 70, 48, 255),
    'raild': (74, 50, 34, 255),
}

MANIFEST = []


def save(name, im):
    im.save(os.path.join(OUT, name + '.png'))
    MANIFEST.append(name)


# --- ground tiles (opaque) ---
def tile_grass(base, dash_color, dot_color):
    im = Image.new('RGBA', (S, S), base)
    dr = ImageDraw.Draw(im)
    for (x, y) in ((6, 9), (17, 13), (26, 21), (10, 25), (21, 5), (13, 18)):
        dr.line((x, y, x + 2, y), fill=dash_color)
    for (x, y) in ((9, 15), (23, 27), (28, 11), (4, 4)):
        dr.point((x, y), fill=dot_color)
    return im


save('grass1', tile_grass(C['grass1'], C['grass1a'], C['grass1b']))
save('grass2', tile_grass(C['grass2'], C['grass1a'], C['grass1b']))
save('parkgrass', tile_grass(C['park'], C['parkd'], C['grass1b']))

im = Image.new('RGBA', (S, S), C['sand'])
dr = ImageDraw.Draw(im)
for (x, y) in ((7, 8), (19, 12), (27, 24), (12, 22), (23, 4), (5, 17)):
    dr.point((x, y), fill=C['sandd'])
    dr.point((x + 1, y), fill=C['sandd'])
save('sand', im)

im = Image.new('RGBA', (S, S), C['plaza'])
dr = ImageDraw.Draw(im)
dr.rectangle((0, 0, 1, 31), fill=C['plazag'])
dr.rectangle((0, 0, 31, 1), fill=C['plazag'])
dr.rectangle((15, 15, 17, 17), outline=C['plazag'])
save('plaza', im)


def tile_water(variant):
    im = Image.new('RGBA', (S, S), C['water'])
    dr = ImageDraw.Draw(im)
    ys = (9, 23) if variant == 0 else (13, 27)
    for y in ys:
        dr.rectangle((0, y, 31, y + 1), fill=C['waterl'])
    for (x, y) in ((5, 5), (18, 17), (27, 2)):
        dr.point((x, y), fill=C['waterf'])
    return im


save('water1', tile_water(0))
save('water2', tile_water(1))

# --- road tiles (transparent outside band; mask bits N=1 E=2 S=4 W=8) ---
CURVES = {3: (32, 0, 90, 180), 9: (0, 0, 0, 90), 6: (32, 32, 180, 270), 12: (0, 32, 270, 360)}


def road_tile(mask):
    im = Image.new('RGBA', (S, S), (0, 0, 0, 0))
    dr = ImageDraw.Draw(im)
    if mask in CURVES:
        cx, cy, a0, a1 = CURVES[mask]
        dr.arc((cx - 28, cy - 28, cx + 28, cy + 28), a0, a1, fill=C['outl'], width=24)
        dr.arc((cx - 26, cy - 26, cx + 26, cy + 26), a0, a1, fill=C['asph'], width=20)
        dr.arc((cx - 17, cy - 17, cx + 17, cy + 17), a0 + 10, a1 - 10, fill=C['dash'], width=2)
        return im
    arms = []
    if mask & 1:
        arms.append(((4, 0, 28, 20), (6, 0, 26, 18)))
    if mask & 2:
        arms.append(((12, 4, 32, 28), (14, 6, 32, 26)))
    if mask & 4:
        arms.append(((4, 12, 28, 32), (6, 14, 26, 32)))
    if mask & 8:
        arms.append(((0, 4, 20, 28), (0, 6, 18, 26)))
    for o, a in arms:
        dr.rectangle(o, fill=C['outl'])
    for o, a in arms:
        dr.rectangle(a, fill=C['asph'])
    if mask == 0:
        dr.ellipse((4, 4, 28, 28), fill=C['outl'])
        dr.ellipse((6, 6, 26, 26), fill=C['asph'])
    if mask in (1, 2, 4, 8):
        dr.ellipse((4, 4, 28, 28), fill=C['outl'])
        dr.ellipse((6, 6, 26, 26), fill=C['asph'])
    if mask == 10:
        dr.line((0, 7, 32, 7), fill=C['asphh'])
        dr.rectangle((3, 15, 10, 16), fill=C['dash'])
        dr.rectangle((19, 15, 26, 16), fill=C['dash'])
    if mask == 5:
        dr.line((25, 0, 25, 32), fill=C['asphh'])
        dr.rectangle((15, 3, 16, 10), fill=C['dash'])
        dr.rectangle((15, 19, 16, 26), fill=C['dash'])
    return im


save('road_dot', road_tile(0))
save('road_end_N', road_tile(1))
save('road_end_E', road_tile(2))
save('road_end_S', road_tile(4))
save('road_end_W', road_tile(8))
save('road_c_NE', road_tile(3))
save('road_c_SE', road_tile(6))
save('road_c_SW', road_tile(12))
save('road_c_NW', road_tile(9))
save('road_H', road_tile(10))
save('road_V', road_tile(5))
save('road_T_W', road_tile(7))
save('road_T_S', road_tile(11))
save('road_T_E', road_tile(13))
save('road_T_N', road_tile(14))
save('road_cross', road_tile(15))


# --- bridge tiles (deck matches road band, rails flank it) ---
def bridge_tile(horizontal):
    im = Image.new('RGBA', (S, S), (0, 0, 0, 0))
    dr = ImageDraw.Draw(im)
    if horizontal:
        dr.rectangle((0, 2, 32, 6), fill=C['rail'])
        dr.rectangle((0, 26, 32, 30), fill=C['rail'])
        dr.rectangle((0, 6, 32, 26), fill=C['wood'])
        for x in (7, 15, 23):
            dr.line((x, 6, x, 26), fill=C['woodp'])
        dr.line((0, 7, 32, 7), fill=C['asphh'])
        for x in (3, 11, 19, 27):
            dr.rectangle((x, 3, x, 5), fill=C['raild'])
            dr.rectangle((x, 27, x, 29), fill=C['raild'])
    else:
        dr.rectangle((2, 0, 6, 32), fill=C['rail'])
        dr.rectangle((26, 0, 30, 32), fill=C['rail'])
        dr.rectangle((6, 0, 26, 32), fill=C['wood'])
        for y in (7, 15, 23):
            dr.line((6, y, 26, y), fill=C['woodp'])
        dr.line((25, 0, 25, 32), fill=C['asphh'])
        for y in (3, 11, 19, 27):
            dr.rectangle((3, y, 5, y), fill=C['raild'])
            dr.rectangle((27, y, 29, y), fill=C['raild'])
    return im


save('bridge_H', bridge_tile(True))
save('bridge_V', bridge_tile(False))

with open(os.path.join(ROOT, 'Tools', 'city', 'td-tileset-manifest.txt'), 'w', encoding='utf-8', newline='\n') as f:
    f.write('\n'.join(MANIFEST) + '\n')
print('tiles=%d -> %s' % (len(MANIFEST), OUT))
print('OK')
