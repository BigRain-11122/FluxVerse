#!/usr/bin/env python3
# Quality-sample tile extension for the FluxVerse tile city (CEO order 2026-09-28
# ~15:3x research wave -> the 32x32 sample block proves the prescriptions:
# shore foam+wet rings (craft-B), calmer solid-road markings (craft-B/GTA-RCR),
# additive glow fx sprites (craft-C Built-in route). Deterministic, no RNG.
# v2: stronger contrast bands (3px foam, darker wet band) after first-pass
# multi-modal review found the v1 rings sub-pixel at far zoom.
import os
from PIL import Image, ImageDraw

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
OUT = os.path.join(ROOT, 'City', 'Assets', 'Art', 'TDTiles')
os.makedirs(OUT, exist_ok=True)
S = 32

C = {
    'sand': (234, 215, 164, 255), 'sandd': (214, 191, 133, 255),
    'sandw': (184, 157, 104, 255),
    'water': (79, 143, 212, 255), 'waterl': (111, 168, 226, 255),
    'waterf': (222, 238, 252, 255),
    'asph': (91, 91, 104, 255), 'asphh': (126, 126, 140, 255),
    'outl': (62, 62, 73, 255), 'dash': (236, 234, 218, 255),
}

MANIFEST = []


def save(name, im):
    im.save(os.path.join(OUT, name + '.png'))
    MANIFEST.append(name)


def base_water():
    im = Image.new('RGBA', (S, S), C['water'])
    dr = ImageDraw.Draw(im)
    for y in (9, 23):
        dr.rectangle((0, y, 31, y + 1), fill=C['waterl'])
    for (x, y) in ((5, 5), (18, 17), (27, 2)):
        dr.point((x, y), fill=C['waterf'])
    return im


def base_sand():
    im = Image.new('RGBA', (S, S), C['sand'])
    dr = ImageDraw.Draw(im)
    for (x, y) in ((7, 8), (19, 12), (27, 24), (12, 22), (23, 4), (5, 17)):
        dr.point((x, y), fill=C['sandd'])
        dr.point((x + 1, y), fill=C['sandd'])
    return im


# --- foam ring: on WATER tiles, band faces the LAND side (foam_N = land above) ---
# v2: 3px solid band + broken rhythm + sparse dots row -> survives far zoom.

def foam_edge(side):
    im = base_water()
    dr = ImageDraw.Draw(im)
    if side == 'N':
        dr.rectangle((0, 0, 31, 2), fill=C['waterf'])
        dr.rectangle((11, 0, 12, 2), fill=C['water'])   # broken rhythm (2px gaps)
        dr.rectangle((24, 0, 25, 2), fill=C['water'])
        for x in (2, 7, 15, 20, 28):
            dr.point((x, 3), fill=C['waterf'])
        dr.rectangle((0, 4, 31, 4), fill=C['waterl'])
    if side == 'S':
        dr.rectangle((0, 29, 31, 31), fill=C['waterf'])
        dr.rectangle((11, 29, 12, 31), fill=C['water'])
        dr.rectangle((24, 29, 25, 31), fill=C['water'])
        for x in (2, 7, 15, 20, 28):
            dr.point((x, 28), fill=C['waterf'])
        dr.rectangle((0, 27, 31, 27), fill=C['waterl'])
    if side == 'E':
        dr.rectangle((29, 0, 31, 31), fill=C['waterf'])
        dr.rectangle((29, 11, 31, 12), fill=C['water'])
        dr.rectangle((29, 24, 31, 25), fill=C['water'])
        for y in (2, 7, 15, 20, 28):
            dr.point((28, y), fill=C['waterf'])
        dr.rectangle((27, 0, 27, 31), fill=C['waterl'])
    if side == 'W':
        dr.rectangle((0, 0, 2, 31), fill=C['waterf'])
        dr.rectangle((0, 11, 2, 12), fill=C['water'])
        dr.rectangle((0, 24, 2, 25), fill=C['water'])
        for y in (2, 7, 15, 20, 28):
            dr.point((3, y), fill=C['waterf'])
        dr.rectangle((4, 0, 4, 31), fill=C['waterl'])
    return im


def foam_corner(bands, name):
    im = foam_edge(bands[0])
    dr = ImageDraw.Draw(im)
    # overlay the second edge band + solid corner patch
    side = bands[1]
    if side == 'N':
        dr.rectangle((0, 0, 31, 2), fill=C['waterf'])
        dr.rectangle((11, 0, 12, 2), fill=C['water'])
        dr.rectangle((24, 0, 25, 2), fill=C['water'])
    if side == 'S':
        dr.rectangle((0, 29, 31, 31), fill=C['waterf'])
        dr.rectangle((11, 29, 12, 31), fill=C['water'])
        dr.rectangle((24, 29, 25, 31), fill=C['water'])
    if side == 'E':
        dr.rectangle((29, 0, 31, 31), fill=C['waterf'])
        dr.rectangle((29, 11, 31, 12), fill=C['water'])
        dr.rectangle((29, 24, 31, 25), fill=C['water'])
    if side == 'W':
        dr.rectangle((0, 0, 2, 31), fill=C['waterf'])
        dr.rectangle((0, 11, 2, 12), fill=C['water'])
        dr.rectangle((0, 24, 2, 25), fill=C['water'])
    # solid corner patch where the two bands meet
    if 'N' in bands and 'W' in bands:
        dr.rectangle((0, 0, 3, 3), fill=C['waterf'])
    if 'N' in bands and 'E' in bands:
        dr.rectangle((28, 0, 31, 3), fill=C['waterf'])
    if 'S' in bands and 'W' in bands:
        dr.rectangle((0, 28, 3, 31), fill=C['waterf'])
    if 'S' in bands and 'E' in bands:
        dr.rectangle((28, 28, 31, 31), fill=C['waterf'])
    save(name, im)


save('foam_N', foam_edge('N'))
save('foam_S', foam_edge('S'))
save('foam_E', foam_edge('E'))
save('foam_W', foam_edge('W'))
foam_corner(('N', 'W'), 'foam_c_NW')
foam_corner(('N', 'E'), 'foam_c_NE')
foam_corner(('S', 'E'), 'foam_c_SE')
foam_corner(('S', 'W'), 'foam_c_SW')


# --- wet ring: on SAND tiles, band faces the WATER side (wet_N = water above) ---
# v2: 3px dark wet band (sandw) + 2 dither rows -> readable at mid zoom.

def wet_edge(bands, name):
    im = base_sand()
    dr = ImageDraw.Draw(im)

    def band_n():
        dr.rectangle((0, 0, 31, 2), fill=C['sandw'])
        for y in (3, 4):
            for x in range(32):
                if (x + y) & 1 == 0:
                    dr.point((x, y), fill=C['sandw'])
        for x in range(1, 32, 4):
            dr.point((x, 5), fill=C['sandw'])

    def band_s():
        dr.rectangle((0, 29, 31, 31), fill=C['sandw'])
        for y in (27, 28):
            for x in range(32):
                if (x + y) & 1 == 0:
                    dr.point((x, y), fill=C['sandw'])
        for x in range(1, 32, 4):
            dr.point((x, 26), fill=C['sandw'])

    def band_w():
        for x in (0, 1, 2):
            dr.rectangle((x, 0, x, 31), fill=C['sandw'])
        for x in (3, 4):
            for y in range(32):
                if (x + y) & 1 == 0:
                    dr.point((x, y), fill=C['sandw'])
        for y in range(1, 32, 4):
            dr.point((5, y), fill=C['sandw'])

    def band_e():
        for x in (29, 30, 31):
            dr.rectangle((x, 0, x, 31), fill=C['sandw'])
        for x in (27, 28):
            for y in range(32):
                if (x + y) & 1 == 0:
                    dr.point((x, y), fill=C['sandw'])
        for y in range(1, 32, 4):
            dr.point((26, y), fill=C['sandw'])

    if 'N' in bands: band_n()
    if 'S' in bands: band_s()
    if 'W' in bands: band_w()
    if 'E' in bands: band_e()
    if 'N' in bands and 'W' in bands: dr.rectangle((0, 0, 4, 4), fill=C['sandw'])
    if 'N' in bands and 'E' in bands: dr.rectangle((27, 0, 31, 4), fill=C['sandw'])
    if 'S' in bands and 'W' in bands: dr.rectangle((0, 27, 4, 31), fill=C['sandw'])
    if 'S' in bands and 'E' in bands: dr.rectangle((27, 27, 31, 31), fill=C['sandw'])
    save(name, im)


wet_edge('N', 'wet_N')
wet_edge('S', 'wet_S')
wet_edge('E', 'wet_E')
wet_edge('W', 'wet_W')
wet_edge('NW', 'wet_c_NW')
wet_edge('NE', 'wet_c_NE')
wet_edge('SE', 'wet_c_SE')
wet_edge('SW', 'wet_c_SW')


# --- solid-road variants (calmer rhythm: 3px-tall dashes, fewer segments; curves outline-only) ---

def road_solid_h():
    im = Image.new('RGBA', (S, S), (0, 0, 0, 0))
    dr = ImageDraw.Draw(im)
    dr.rectangle((0, 4, 31, 28), fill=C['outl'])
    dr.rectangle((0, 6, 31, 26), fill=C['asph'])
    dr.rectangle((5, 14, 13, 16), fill=C['dash'])
    dr.rectangle((21, 14, 26, 16), fill=C['dash'])
    return im


def road_solid_v():
    im = Image.new('RGBA', (S, S), (0, 0, 0, 0))
    dr = ImageDraw.Draw(im)
    dr.rectangle((4, 0, 28, 31), fill=C['outl'])
    dr.rectangle((6, 0, 26, 31), fill=C['asph'])
    dr.rectangle((14, 5, 16, 13), fill=C['dash'])
    dr.rectangle((14, 21, 16, 26), fill=C['dash'])
    return im


def road_solid_cross():
    im = road_solid_h()
    dr = ImageDraw.Draw(im)
    dr.rectangle((4, 0, 28, 31), fill=C['outl'])
    dr.rectangle((6, 0, 26, 31), fill=C['asph'])
    dr.rectangle((14, 4, 16, 9), fill=C['dash'])
    dr.rectangle((14, 23, 16, 28), fill=C['dash'])
    dr.rectangle((4, 14, 9, 16), fill=C['dash'])
    dr.rectangle((23, 14, 28, 16), fill=C['dash'])
    return im


def road_solid_curve_ne():
    im = Image.new('RGBA', (S, S), (0, 0, 0, 0))
    dr = ImageDraw.Draw(im)
    dr.arc((32 - 28, 0 - 28, 32 + 28, 0 + 28), 90, 180, fill=C['outl'], width=24)
    dr.arc((32 - 26, 0 - 26, 32 + 26, 0 + 26), 90, 180, fill=C['asph'], width=20)
    return im


save('roadS_H', road_solid_h())
save('roadS_V', road_solid_v())
save('roadS_cross', road_solid_cross())
save('roadS_c_NE', road_solid_curve_ne())


# --- fx sprites (plain sprites, NOT tiles; loaded by the sample build) ---

def fx_winlight():
    im = Image.new('RGBA', (16, 16), (0, 0, 0, 0))
    dr = ImageDraw.Draw(im)
    dr.rectangle((2, 3, 13, 12), fill=(255, 160, 90, 30))
    dr.rectangle((3, 4, 12, 11), fill=(255, 180, 100, 70))
    dr.rectangle((4, 5, 11, 10), fill=(255, 200, 120, 160))
    dr.rectangle((5, 6, 10, 9), fill=(255, 228, 160, 255))
    im.save(os.path.join(OUT, 'winlight.png'))
    return im


def fx_glow(rgb):
    im = Image.new('RGBA', (32, 32), (0, 0, 0, 0))
    dr = ImageDraw.Draw(im)
    for (rad, a) in ((22, 25), (16, 60), (11, 120), (6, 200)):
        dr.ellipse((16 - rad, 16 - rad, 16 + rad, 16 + rad), fill=(rgb[0], rgb[1], rgb[2], a))
    dr.ellipse((13, 13, 19, 19), fill=(rgb[0], rgb[1], rgb[2], 235))
    return im


fx_winlight()
im = fx_glow((255, 90, 210))
im.save(os.path.join(OUT, 'glow_magenta.png'))
im = fx_glow((120, 230, 255))
im.save(os.path.join(OUT, 'glow_cyan.png'))

im = Image.new('RGBA', (8, 8), (255, 255, 255, 255))
im.save(os.path.join(OUT, 'tint_white.png'))

with open(os.path.join(ROOT, 'Tools', 'city', 'td-quality-manifest.txt'), 'w', encoding='utf-8', newline='\n') as f:
    f.write('\n'.join(MANIFEST) + '\n')
print('tiles=%d -> %s' % (len(MANIFEST), OUT))
print('OK')
