#!/usr/bin/env python3
"""Sandbox for the road-band prop census (queue main#65).

The census is the judge for "is a base-plate prop standing on the R2 road
strip?": the street trees carry no colliders, so the street-shot pose solver
(Physics.RaycastAll) never saw them and framed a street whose vanishing point
was a tree trunk. This pins the geometry rules without Unity:

  1. a small prop fully inside the strip counts, named, with its area
  2. the same prop pushed outside the strip counts as zero
  3. props parented under R2_AD-021_District are NOT base-plate props (skip)
  4. layer-sized meshes (Ground512) are not props (span gate)

Synthetic scene = built-in cube meshes only (GUID filter in the checker), so no
vertex data is needed and the fixture stays ~2 KB of text.

Usage: python Tools/devloop/test-road-props.py   (exit 0 = all green)
"""

import importlib.util
import os
import sys
import tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
CHECKER = os.path.join(HERE, "r2-site-check.py")

spec = importlib.util.spec_from_file_location("r2_site_check", CHECKER)
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)

CUBE = "{fileID: 10202, guid: 0000000000000000e000000000000000, type: 0}"

PASS = 0
FAIL = 0


def check(name, cond):
    global PASS, FAIL
    if cond:
        print("  PASS " + name)
        PASS += 1
    else:
        print("  FAIL " + name)
        FAIL += 1


def go(gid, name):
    return "--- !u!1 &%d\nGameObject:\n  m_Name: %s\n" % (gid, name)


def tf(gid, goid, pos, scale, father):
    return ("--- !u!4 &%d\nTransform:\n  m_GameObject: {fileID: %d}\n"
            "  m_LocalRotation: {x: 0, y: 0, z: 0, w: 1}\n"
            "  m_LocalPosition: {x: %s, y: %s, z: %s}\n"
            "  m_LocalScale: {x: %s, y: %s, z: %s}\n"
            "  m_Father: {fileID: %d}\n" % (gid, goid, pos[0], pos[1], pos[2],
                                           scale[0], scale[1], scale[2], father))


def mf(gid, goid):
    return "--- !u!33 &%d\nMeshFilter:\n  m_GameObject: {fileID: %d}\n  m_Mesh: %s\n" % (gid, goid, CUBE)


def scene_text(tree_z):
    out = []
    out.append(go(1000, "City_GAME"))
    out.append(tf(1001, 1000, (0, 0, 0), (1, 1, 1), 0))
    out.append(go(1100, "R2_AD-021_District"))
    out.append(tf(1101, 1100, (0.3, 0, 83.2), (1, 1, 1), 1001))
    out.append(go(1200, "R2_AD-021_Street"))
    out.append(tf(1201, 1200, (0, 0.04, 0), (76, 0.04, 6), 1101))
    out.append(mf(1202, 1200))
    # base-plate tree, 3 x 3 footprint, parented to City_GAME (outside the district)
    out.append(go(1300, "TreeW"))
    out.append(tf(1301, 1300, (0, 1, tree_z), (3, 4, 3), 1001))
    out.append(mf(1302, 1300))
    # a bench far away: never a hit
    out.append(go(1400, "Bench"))
    out.append(tf(1401, 1400, (60, 0.5, -40), (1, 1, 2), 1001))
    out.append(mf(1402, 1400))
    # ground layer: 512 m wide, must be gated out by the span rule
    out.append(go(1500, "Ground512"))
    out.append(tf(1501, 1500, (0, 0, 0), (512, 1, 512), 1001))
    out.append(mf(1502, 1500))
    # district-owned lot sitting on the strip: excluded by the subtree rule
    out.append(go(1600, "R2_AD-021_Lot_Test"))
    out.append(tf(1601, 1600, (0, 0.055, 0), (5, 0.05, 5), 1101))
    out.append(mf(1602, 1600))
    return "\n".join(out)


def census(tree_z):
    txt = scene_text(tree_z)
    fd, path = tempfile.mkstemp(suffix=".unity")
    os.close(fd)
    try:
        with open(path, "w", encoding="utf-8") as f:
            f.write(txt)
        sc = mod.Scene(path)
        band = mod.road_band(sc)
        return band, mod.props_in_road_band(sc, band)
    finally:
        os.remove(path)


def main():
    print("a) tree standing on the strip")
    band, hits = census(83.2)
    check("band found", band is not None)
    if band:
        check("band x span 76 m", abs((band[2] - band[0]) - 76.0) < 0.01)
        check("band z span 6 m", abs((band[3] - band[1]) - 6.0) < 0.01)
    check("exactly one hit", len(hits) == 1)
    if hits:
        check("hit named TreeW", hits[0][0] == "TreeW")
        check("hit area 9 m2", abs(hits[0][2] - 9.0) < 0.01)
    check("ground layer not counted", all(h[0] != "Ground512" for h in hits))
    check("district lot not counted", all(h[0] != "R2_AD-021_Lot_Test" for h in hits))
    check("far bench not counted", all(h[0] != "Bench" for h in hits))

    print("b) tree pushed 14 m north of the strip")
    band2, hits2 = census(97.0)
    check("band still found", band2 is not None)
    check("zero hits after the fix", len(hits2) == 0)

    print("test-road-props: %d passed, %d failed (of %d)" % (PASS, FAIL, PASS + FAIL))
    return 0 if FAIL == 0 else 1


if __name__ == "__main__":
    sys.exit(main())