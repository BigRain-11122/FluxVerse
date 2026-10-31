#!/usr/bin/env python3
"""r2-site-check.py -- is the R2 district standing on dry ground?

Reads the City3D whitebox scene as text (no Unity needed) and answers:
  1. where is the water mesh really (exact triangles, not just an AABB)
  2. where does the R2_AD-021 block really sit (house grid from CityRebuildR2.cs
     constants + the district's own local position read from the built scene)
  3. how much of the block hangs over water
  4. which nearby square patches of the same size are fully dry

Outputs a console summary, an SVG map and a markdown table under qa/.
Deterministic and read-only: it never touches the scene or the assets.

Usage:
  python Tools/devloop/r2-site-check.py [--stamp YYYYMMDD-HHMM] [--out-dir qa]
                                       [--no-artifacts] [--scene PATH] [--rebuild PATH]

--no-artifacts prints only the summary lines (no PNG / MD, no Pillow needed):
that is the mode Tools/perceptor/verify.ps1 calls once per tick, so a check
every ten minutes does not bury qa/site under 144 maps a day.
--scene / --rebuild point the checker at fixture copies; the default targets
are the live City3D scene and its rebuild script.
"""

import io
import math
import os
import re
import sys
import datetime

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SCENE = os.path.join(ROOT, "City3D", "Assets", "Scenes", "CityWhitebox.unity")
REBUILD = os.path.join(ROOT, "City3D", "Assets", "Editor", "CityRebuild", "CityRebuildR2.cs")
# main#54: the district no longer stands on the City_GAME origin, so its local
# position has to come from an artifact, not from an assumption. The built
# scene is the truth (it is what the frames are taken from); the anchor file is
# the decision record and the fallback when no built scene is on disk.
BUILT_SCENE = os.path.join(ROOT, "City3D", "Assets", "Scenes", "CityRebuild_R2.unity")
ANCHOR_FILE = os.path.join(ROOT, "City3D-staging", "rehearsal-anchor.txt")
PLATE_CELL = 1.0          # metres per sampling cell
ANCHOR_STEP = 2.0         # metres between candidate anchors
PLATE_MARGIN = 8.0        # keep candidate rects this far inside the ground plate
BUILTIN_CUBE_GUIDS = ("0000000000000000e000000000000000",
                      "0000000000000000f000000000000000")


def die(msg):
    sys.stderr.write("SITE_CHECK FAIL: " + msg + "\n")
    sys.exit(2)


# ---------------------------------------------------------------- scene text
def load_docs(path):
    text = io.open(path, encoding="utf-8", errors="replace").read()
    parts = re.split(r"^--- !u!(\d+) &(\d+)([^\n]*)$", text, flags=re.M)
    docs = []
    i = 1
    while i + 3 <= len(parts):
        docs.append((parts[i], parts[i + 1], parts[i + 3]))
        i += 4
    return text, docs


def fnum(body, key, default=None):
    m = re.search(key + r": \{x: (-?[-\d.eE+]+), y: (-?[-\d.eE+]+), z: (-?[-\d.eE+]+), w: (-?[-\d.eE+]+)\}", body)
    if m:
        return tuple(float(v) for v in m.groups())
    m = re.search(key + r": \{x: (-?[-\d.eE+]+), y: (-?[-\d.eE+]+), z: (-?[-\d.eE+]+)\}", body)
    if m:
        return tuple(float(v) for v in m.groups())
    return default


def mat_mul(a, b):
    return [[sum(a[r][k] * b[k][c] for k in range(4)) for c in range(4)] for r in range(4)]


def trs(pos, rot, scl):
    x, y, z, w = rot
    n = x * x + y * y + z * z + w * w
    if n < 1e-12:
        x = y = z = 0.0
        w = 1.0
    else:
        s = 2.0 / n
        x, y, z, w = x * s, y * s, z * s, w * s
    m = [[1 - (y * y + z * z), x * y - z * w, x * z + y * w, 0.0],
         [x * y + z * w, 1 - (x * x + z * z), y * z - x * w, 0.0],
         [x * z - y * w, y * z + x * w, 1 - (x * x + y * y), 0.0],
         [0.0, 0.0, 0.0, 1.0]]
    for r in range(3):
        for c in range(3):
            m[r][c] *= scl[c]
    m[0][3], m[1][3], m[2][3] = pos
    return m


def apply(m, p):
    x, y, z = p
    return (m[0][0] * x + m[0][1] * y + m[0][2] * z + m[0][3],
            m[1][0] * x + m[1][1] * y + m[1][2] * z + m[1][3],
            m[2][0] * x + m[2][1] * y + m[2][2] * z + m[2][3])


class Scene(object):
    def __init__(self, path):
        self.text, docs = load_docs(path)
        self.names = {}
        self.transforms = {}
        self.meshes = {}
        self.filters = {}
        for cls, fid, body in docs:
            if cls == "1":
                m = re.search(r"m_Name: (.*)", body)
                self.names[fid] = m.group(1).strip() if m else ""
            elif cls == "4":
                m = re.search(r"m_GameObject: \{fileID: (\d+)\}", body)
                if m:
                    self.transforms[m.group(1)] = (fid, body)
            elif cls == "43":
                self.meshes[fid] = body
            elif cls == "33":
                m = re.search(r"m_GameObject: \{fileID: (\d+)\}", body)
                if m:
                    self.filters[m.group(1)] = body
        self._world = {}

    def go_id(self, name):
        for gid, nm in self.names.items():
            if nm == name:
                return gid
        return None

    def world(self, gid, depth=0):
        if gid in self._world:
            return self._world[gid]
        if depth > 32:
            die("transform chain too deep at " + str(gid))
        if gid not in self.transforms:
            self._world[gid] = [[1.0 if r == c else 0.0 for c in range(4)] for r in range(4)]
            return self._world[gid]
        _, body = self.transforms[gid]
        pos = fnum(body, "m_LocalPosition", (0.0, 0.0, 0.0))
        rot = fnum(body, "m_LocalRotation", (0.0, 0.0, 0.0, 1.0))
        scl = fnum(body, "m_LocalScale", (1.0, 1.0, 1.0))
        local = trs(pos, rot, scl)
        father = re.search(r"m_Father: \{fileID: (-?\d+)\}", body)
        parent_id = father.group(1) if father else "0"
        if parent_id == "0":
            world = local
        else:
            owner = None
            for gid2, (tfid, _b) in self.transforms.items():
                if tfid == parent_id:
                    owner = gid2
                    break
            world = mat_mul(self.world(owner, depth + 1) if owner else [[1.0 if r == c else 0.0 for c in range(4)] for r in range(4)], local)
        self._world[gid] = world
        return world

    def mesh_triangles(self, gid, scale_y_zero=True):
        """World-space XZ triangles for the mesh attached to GameObject gid."""
        body = self.filters.get(gid)
        if body is None:
            return [], None
        mref = re.search(r"m_Mesh: \{fileID: (-?\d+)(?:, guid: (\w+))?", body)
        if mref is None:
            return [], None
        mesh_id, guid = mref.group(1), mref.group(2) or ""
        w = self.world(gid)
        if guid in BUILTIN_CUBE_GUIDS:
            # unit cube centred on the object origin
            corners = [(x, y, z) for x in (-0.5, 0.5) for y in (-0.5, 0.5) for z in (-0.5, 0.5)]
            pts = [apply(w, c) for c in corners]
            aabb = (min(p[0] for p in pts), min(p[2] for p in pts),
                    max(p[0] for p in pts), max(p[2] for p in pts))
            return [], aabb
        mbody = self.meshes.get(mesh_id)
        if mbody is None:
            return [], None
        verts = decode_vertices(mbody)
        idx = decode_indices(mbody)
        if not verts or not idx:
            m = re.search(r"m_Center: \{x: (-?[\d.eE+-]+), y: (-?[\d.eE+-]+), z: (-?[\d.eE+-]+)\}", mbody)
            e = re.search(r"m_Extent: \{x: (-?[\d.eE+-]+), y: (-?[\d.eE+-]+), z: (-?[\d.eE+-]+)\}", mbody)
            if not (m and e):
                return [], None
            c = [float(v) for v in m.groups()]
            x = [float(v) for v in e.groups()]
            p0 = apply(w, (c[0] - x[0], c[1], c[2] - x[2]))
            p1 = apply(w, (c[0] + x[0], c[1], c[2] + x[2]))
            return [], (min(p0[0], p1[0]), min(p0[2], p1[2]), max(p0[0], p1[0]), max(p0[2], p1[2]))
        wp = [apply(w, v) for v in verts]
        tris = []
        for i in range(0, len(idx) - 2, 3):
            a, b, c = idx[i], idx[i + 1], idx[i + 2]
            if a >= len(wp) or b >= len(wp) or c >= len(wp):
                continue
            tris.append((wp[a], wp[b], wp[c]))
        aabb = (min(p[0] for p in wp), min(p[2] for p in wp),
                max(p[0] for p in wp), max(p[2] for p in wp))
        return tris, aabb


def decode_vertices(mbody):
    m = re.search(r"m_VertexCount: (\d+)", mbody)
    if not m:
        return []
    count = int(m.group(1))
    ch = mbody.find("m_Channels:")
    if ch < 0:
        return []
    chan = mbody[ch:ch + 2000]
    offs = [int(v) for v in re.findall(r"offset: (\d+)", chan)[:8]]
    fmts = [int(v) for v in re.findall(r"format: (\d+)", chan)[:8]]
    dims = [int(v) for v in re.findall(r"dimension: (\d+)", chan)[:8]]
    size = re.search(r"m_DataSize: (\d+)", mbody)
    d = mbody.find("_typelessdata:", mbody.find("m_DataSize:"))
    if d < 0 or not size:
        return []
    start = d + len("_typelessdata:")
    hexs = re.sub(r"[^0-9a-fA-F]", "", mbody[start:start + int(size.group(1)) * 3])
    raw = bytearray.fromhex(hexs[: (len(hexs) // 2) * 2])
    if count == 0 or not offs or offs[0] != 0 or fmts[0] != 0 or dims[0] < 3:
        return []
    stride = len(raw) // count
    if stride <= 0:
        return []
    out = []
    import struct
    for i in range(count):
        base = i * stride
        if base + 12 > len(raw):
            break
        x, y, z = struct.unpack_from("<fff", raw, base)
        out.append((x, y, z))
    return out


def decode_indices(mbody):
    d = mbody.find("m_IndexBuffer:")
    if d < 0:
        return []
    m = re.search(r"m_IndexFormat: (\d+)", mbody[:d])
    wide = bool(m and m.group(1) == "1")
    chunk = mbody[d + len("m_IndexBuffer:"):].split("\n  m_")[0]
    hexs = re.sub(r"[^0-9a-fA-F]", "", chunk)
    raw = bytearray.fromhex(hexs[: (len(hexs) // 2) * 2])
    import struct
    if wide:
        n = len(raw) // 4
        return list(struct.unpack_from("<" + "I" * n, raw, 0))
    n = len(raw) // 2
    return list(struct.unpack_from("<" + "H" * n, raw, 0))


# ---------------------------------------------------------------- rebuild cs
def parse_block(path):
    src = io.open(path, encoding="utf-8", errors="replace").read()
    gx = re.search(r"float\[\] gx = \{([^}]*)\}", src)
    gz = re.search(r"float\[\] gz = \{([^}]*)\}", src)
    if not (gx and gz):
        die("cannot parse gx/gz house grid from CityRebuildR2.cs")
    xs = [float(v.replace("f", "")) for v in gx.group(1).split(",") if v.strip()]
    zs = [float(v.replace("f", "")) for v in gz.group(1).split(",") if v.strip()]
    show = re.search(r"BuildShowcase\(r2root\.transform, new Vector3\(([-\d.]+)f, ([-\d.]+)f, ([-\d.]+)f\)\)", src)
    showcase_z = float(show.group(3)) if show else max(zs)
    lot = re.search(r"b\.size\.x \+ ([\d.]+)f", src)
    lot_pad = float(lot.group(1)) if lot else 2.4
    return xs, zs, showcase_z, lot_pad


# ---------------------------------------------------------- district placement
DOC_RE = re.compile(r"^--- !u!(\d+) &(-?\d+)\n", re.M)


def district_local_from_scene(path):
    """R2_AD-021_District's Transform.m_LocalPosition in a saved scene, or None.

    Text parse of the Unity YAML (no editor): the district is a plain GameObject
    with one Transform, so its id -> component id -> local position is enough.
    Returns (x, z); None when the scene is absent or holds no such GameObject.
    """
    if not path or not os.path.isfile(path):
        return None
    txt = io.open(path, encoding="utf-8", errors="replace").read()
    marks = list(DOC_RE.finditer(txt))
    docs = {}
    for i, m in enumerate(marks):
        end = marks[i + 1].start() if i + 1 < len(marks) else len(txt)
        docs[m.group(2)] = (m.group(1), txt[m.end():end])
    for _, (cls, body) in docs.items():
        if cls != "1":
            continue
        if not re.search(r"^  m_Name: R2_AD-021_District\s*$", body, re.M):
            continue
        for comp in re.findall(r"- component: \{fileID: (-?\d+)\}", body):
            got = docs.get(comp)
            if not got or got[0] != "4":
                continue
            pos = re.search(r"m_LocalPosition: \{x: ([-\d.eE+]+), y: ([-\d.eE+]+), z: ([-\d.eE+]+)\}", got[1])
            if pos:
                return (float(pos.group(1)), float(pos.group(3)))
        return (0.0, 0.0)  # district present but transform unreadable -> origin
    return None


def anchor_local_from_file():
    """City3D-staging/rehearsal-anchor.txt first line 'x,z[,tag]' -> (x, z)."""
    try:
        if not os.path.isfile(ANCHOR_FILE):
            return None
        first = io.open(ANCHOR_FILE, encoding="ascii", errors="replace").read().splitlines()[0]
        parts = first.split(",")
        return (float(parts[0]), float(parts[1]))
    except Exception:
        return None


# ---------------------------------------------------------------- raster
class Raster(object):
    def __init__(self, x0, z0, x1, z1, cell):
        self.x0, self.z0, self.cell = x0, z0, cell
        self.nx = int(math.ceil((x1 - x0) / cell))
        self.nz = int(math.ceil((z1 - z0) / cell))
        self.rows = [[0] * (self.nx + 1) for _ in range(self.nz + 1)]

    def mark_triangle(self, a, b, c):
        xs = [a[0], b[0], c[0]]
        zs = [a[2], b[2], c[2]]
        i0 = max(0, int((min(xs) - self.x0) / self.cell))
        i1 = min(self.nx - 1, int((max(xs) - self.x0) / self.cell))
        j0 = max(0, int((min(zs) - self.z0) / self.cell))
        j1 = min(self.nz - 1, int((max(zs) - self.z0) / self.cell))
        if i1 < i0 or j1 < j0:
            return
        d = (b[2] - c[2]) * (a[0] - c[0]) + (c[0] - b[0]) * (a[2] - c[2])
        if abs(d) < 1e-9:
            return
        for j in range(j0, j1 + 1):
            pz = self.z0 + (j + 0.5) * self.cell
            for i in range(i0, i1 + 1):
                px = self.x0 + (i + 0.5) * self.cell
                l1 = ((b[2] - c[2]) * (px - c[0]) + (c[0] - b[0]) * (pz - c[2])) / d
                l2 = ((c[2] - a[2]) * (px - c[0]) + (a[0] - c[0]) * (pz - c[2])) / d
                l3 = 1.0 - l1 - l2
                if l1 >= -1e-9 and l2 >= -1e-9 and l3 >= -1e-9:
                    self.rows[j][i] = 1

    def build_sum(self):
        self.sum = [[0] * (self.nx + 1) for _ in range(self.nz + 1)]
        for j in range(self.nz):
            run = 0
            for i in range(self.nx):
                run += self.rows[j][i]
                self.sum[j + 1][i + 1] = self.sum[j][i + 1] + run

    def covered(self, x0, z0, x1, z1):
        i0 = max(0, int(round((x0 - self.x0) / self.cell)))
        i1 = min(self.nx, int(round((x1 - self.x0) / self.cell)))
        j0 = max(0, int(round((z0 - self.z0) / self.cell)))
        j1 = min(self.nz, int(round((z1 - self.z0) / self.cell)))
        if i1 <= i0 or j1 <= j0:
            return 0.0
        s = self.sum
        hit = s[j1][i1] - s[j0][i1] - s[j1][i0] + s[j0][i0]
        return float(hit) / float((i1 - i0) * (j1 - j0))

    def rect_blocked(self, x0, z0, x1, z1):
        return self.covered(x0, z0, x1, z1) > 0.0


# ---------------------------------------------------------------- verdict
def report_verdict(cur_cov, top, drift):
    if drift > 5.0:
        print("SITE_VERDICT=INCONSISTENT raster-vs-exact drift %.1fpp" % drift)
        return 1
    print("SITE_VERDICT=%s block_water=%.1f%% nearest_dry=%s"
          % ("OVER_WATER" if cur_cov > 0.5 else "DRY", cur_cov * 100.0,
             ("%.0fm" % top[0][0]) if top else "none"))
    return 0


# ---------------------------------------------------------------- main
def main(argv):
    stamp = datetime.datetime.now().strftime("%Y%m%d-%H%M")
    out_dir = os.path.join(ROOT, "qa")
    scene_path = SCENE
    rebuild_path = REBUILD
    artifacts = True
    offset = (0.0, 0.0)
    scene_overridden = False
    for i, a in enumerate(argv):
        if a == "--stamp" and i + 1 < len(argv):
            stamp = argv[i + 1]
        elif a == "--out-dir" and i + 1 < len(argv):
            out_dir = os.path.join(ROOT, argv[i + 1])
        elif a == "--no-artifacts":
            artifacts = False
        elif a == "--scene" and i + 1 < len(argv):
            scene_path = os.path.abspath(os.path.join(ROOT, argv[i + 1]))
            scene_overridden = True
        elif a == "--rebuild" and i + 1 < len(argv):
            rebuild_path = os.path.abspath(os.path.join(ROOT, argv[i + 1]))
        elif a == "--offset" and i + 1 < len(argv):
            # rehearsal probe (main#58): measure the block as if the R2 district were
            # shifted by this city-local delta, without writing any scene to disk.
            parts = argv[i + 1].split(",")
            if len(parts) != 2:
                die("--offset wants dx,dz")
            offset = (float(parts[0]), float(parts[1]))
    if not os.path.isfile(scene_path):
        die("scene not found: " + scene_path)
    if not os.path.isfile(rebuild_path):
        die("rebuild script not found: " + rebuild_path)
    if artifacts and not os.path.isdir(out_dir):
        die("out dir missing: " + out_dir)

    sc = Scene(scene_path)
    tris, water_aabb = [], None
    water_names = []
    for gid, nm in sorted(sc.names.items()):
        if nm and ("Water" in nm or nm.upper().startswith("L_WATER")):
            t, bb = sc.mesh_triangles(gid)
            if bb is None:
                continue
            water_names.append(nm)
            tris.extend(t)
            water_aabb = bb if water_aabb is None else (min(water_aabb[0], bb[0]), min(water_aabb[1], bb[1]),
                                                        max(water_aabb[2], bb[2]), max(water_aabb[3], bb[3]))
    if water_aabb is None:
        die("no water mesh found in scene (expected L_Water)")
    if not tris:
        die("water mesh has no decodable triangles; only AABB available")

    plate_id = sc.go_id("Ground512")
    if plate_id is None:
        die("Ground512 plate not found")
    _, plate_aabb = sc.mesh_triangles(plate_id)
    if plate_aabb is None:
        die("Ground512 bounds unreadable")

    xs, zs, showcase_z, lot_pad = parse_block(rebuild_path)
    city_id = sc.go_id("City_GAME")
    if city_id is None:
        die("City_GAME not found")
    cw = sc.world(city_id)
    origin = (cw[0][3], cw[2][3])

    house_span = 13.9  # widest preset measured in r2-report.md (Preset_03)
    hx = house_span * 0.5 + lot_pad
    # main#54: district placement. The measured scene carries the district when it
    # is the built one; the live CityWhitebox does not, so fall back to the built
    # scene (what the frames come from) and then to the anchor decision record.
    # A fixture scene (--scene) that has no district keeps the historical origin.
    dl, dsrc = (0.0, 0.0), "origin"
    got = district_local_from_scene(scene_path)
    if got is not None:
        dl, dsrc = got, "scene"
    elif not scene_overridden:
        got = district_local_from_scene(BUILT_SCENE)
        if got is not None:
            dl, dsrc = got, "built-scene"
        else:
            got = anchor_local_from_file()
            if got is not None:
                dl, dsrc = got, "anchor-file"
    bxo = origin[0] + dl[0]
    bzo = origin[1] + dl[1]
    bx0 = bxo + min(xs) - hx + offset[0]
    bx1 = bxo + max(xs) + hx + offset[0]
    bz0 = bzo + min(zs) - hx + offset[1]
    bz1 = bzo + max(showcase_z, max(zs)) + hx + offset[1]

    # obstruction raster: water + standing towers + pavement pad
    ras = Raster(min(plate_aabb[0], bx0) - 4, min(plate_aabb[1], bz0) - 4,
                 max(plate_aabb[2], bx1) + 4, max(plate_aabb[3], bz1) + 4, PLATE_CELL)
    for a, b, c in tris:
        ras.mark_triangle(a, b, c)
    obst = []
    city_tf = sc.transforms.get(city_id, (None, ""))[0]
    for gid, nm in sorted(sc.names.items()):
        if not re.match(r"^B\d$", nm or ""):
            continue
        tf = sc.transforms.get(gid)
        father = re.search(r"m_Father: \{fileID: (-?\d+)\}", tf[1]) if tf else None
        if not father or father.group(1) != city_tf:
            continue  # other district copies of the same tower name
        t, bb = sc.mesh_triangles(gid)
        if bb:
            obst.append((nm, bb))
            for j in range(int((bb[1] - ras.z0) / ras.cell), int((bb[3] - ras.z0) / ras.cell) + 1):
                for i in range(int((bb[0] - ras.x0) / ras.cell), int((bb[2] - ras.x0) / ras.cell) + 1):
                    if 0 <= j < ras.nz and 0 <= i < ras.nx:
                        ras.rows[j][i] = 1
    ras.build_sum()

    width, depth = bx1 - bx0, bz1 - bz0
    cur_cov = ras.covered(bx0, bz0, bx1, bz1)

    # independent cross-check: exact point-in-triangle sampling (no raster)
    def in_tri(px, pz, a, b, c):
        d = (b[2] - c[2]) * (a[0] - c[0]) + (c[0] - b[0]) * (a[2] - c[2])
        if abs(d) < 1e-9:
            return False
        l1 = ((b[2] - c[2]) * (px - c[0]) + (c[0] - b[0]) * (pz - c[2])) / d
        if l1 < -1e-9:
            return False
        l2 = ((c[2] - a[2]) * (px - c[0]) + (a[0] - c[0]) * (pz - c[2])) / d
        if l2 < -1e-9:
            return False
        return (1.0 - l1 - l2) >= -1e-9

    buckets = {}
    for t in tris:
        key = (int(min(t[0][0], t[1][0], t[2][0]) // 16), int(min(t[0][2], t[1][2], t[2][2]) // 16))
        buckets.setdefault(key, []).append(t)
    check = 0
    hit_exact = 0
    step = 2.0
    zz = bz0 + step * 0.5
    while zz < bz1:
        xx = bx0 + step * 0.5
        while xx < bx1:
            check += 1
            found = False
            for dx in (0, -1, 1):
                for dz in (0, -1, 1):
                    for t in buckets.get((int(xx // 16) + dx, int(zz // 16) + dz), ()):
                        if in_tri(xx, zz, t[0], t[1], t[2]):
                            found = True
                            break
                    if found:
                        break
                if found:
                    break
            if found:
                hit_exact += 1
            xx += step
        zz += step
    exact_cov = float(hit_exact) / float(check) if check else 0.0
    drift = abs(exact_cov - cur_cov) * 100.0

    # candidate anchors: fully dry, inside plate, away from towers
    cands = []
    lo_x, hi_x = plate_aabb[0] + PLATE_MARGIN, plate_aabb[2] - PLATE_MARGIN
    lo_z, hi_z = plate_aabb[1] + PLATE_MARGIN, plate_aabb[3] - PLATE_MARGIN
    cx_cur, cz_cur = (bx0 + bx1) * 0.5, (bz0 + bz1) * 0.5
    x = lo_x
    while x + width <= hi_x:
        z = lo_z
        while z + depth <= hi_z:
            if ras.covered(x, z, x + width, z + depth) == 0.0:
                cands.append((math.hypot(x + width * 0.5 - cx_cur, z + depth * 0.5 - cz_cur), x, z))
            z += ANCHOR_STEP
        x += ANCHOR_STEP
    cands.sort()
    top = cands[:3]

    print("SITE_CHECK scene=%s" % os.path.basename(scene_path))
    if offset != (0.0, 0.0):
        print("offset=%.2f,%.2f (rehearsal probe: scene on disk is untouched)" % offset)
    print("water objects=%s aabb=x[%.1f..%.1f] z[%.1f..%.1f] tris=%d"
          % (",".join(water_names), water_aabb[0], water_aabb[2], water_aabb[1], water_aabb[3], len(tris)))
    print("plate aabb=x[%.1f..%.1f] z[%.1f..%.1f]" % (plate_aabb[0], plate_aabb[2], plate_aabb[1], plate_aabb[3]))
    print("district_local=(%.2f,%.2f) src=%s" % (dl[0], dl[1], dsrc))
    print("city_origin=(%.2f,%.2f) block=%.1fx%.1fm world=x[%.1f..%.1f] z[%.1f..%.1f]"
          % (origin[0], origin[1], width, depth, bx0, bx1, bz0, bz1))
    print("block_water_coverage=%.1f%%" % (cur_cov * 100.0))
    print("cross_check exact=%.1f%% samples=%d drift=%.1fpp" % (exact_cov * 100.0, check, drift))
    print("dry_candidates=%d" % len(cands))
    for dist, x, z in top:
        print("  cand dist=%.1fm world_center=(%.1f,%.1f) local=(%.1f,%.1f) coverage=0%%"
              % (dist, x + width * 0.5, z + depth * 0.5,
                 x + width * 0.5 - origin[0], z + depth * 0.5 - origin[1]))

    # ------------------------------------------------------------- png map
    if not artifacts:
        return report_verdict(cur_cov, top, drift)
    try:
        from PIL import Image, ImageDraw, ImageFont
    except Exception as exc:
        die("Pillow is required for the map: " + str(exc))
    pad = 12.0
    vx0, vz0 = plate_aabb[0] - pad, plate_aabb[1] - pad
    vx1, vz1 = plate_aabb[2] + pad, plate_aabb[3] + pad
    scale = 900.0 / (vx1 - vx0)
    W = 900
    H = int((vz1 - vz0) * scale)

    def px(v):
        return int(round((v - vx0) * scale))

    def pz(v):
        return int(round((vz1 - v) * scale))

    img = Image.new("RGB", (W, H), (16, 20, 24))
    dr = ImageDraw.Draw(img, "RGBA")
    dr.rectangle([px(plate_aabb[0]), pz(plate_aabb[3]), px(plate_aabb[2]), pz(plate_aabb[1])],
                 fill=(42, 47, 54), outline=(74, 82, 92))
    # water at 1 m resolution straight from the triangle raster
    for j in range(ras.nz):
        row = ras.rows[j]
        i = 0
        while i < ras.nx:
            if row[i]:
                start = i
                while i < ras.nx and row[i]:
                    i += 1
                x0w = ras.x0 + start * ras.cell
                x1w = ras.x0 + i * ras.cell
                z0w = ras.z0 + j * ras.cell
                dr.rectangle([px(x0w), pz(z0w + ras.cell), px(x1w), pz(z0w)],
                             fill=(47, 111, 208, 217))
            else:
                i += 1
    for nm, bb in obst:
        dr.rectangle([px(bb[0]), pz(bb[3]), px(bb[2]), pz(bb[1])], fill=(11, 13, 16, 230), outline=(107, 116, 128))
        dr.text((px(bb[0]) + 3, pz(bb[3]) + 3), nm, fill=(154, 163, 173))
    dr.rectangle([px(bx0), pz(bz1), px(bx1), pz(bz0)], fill=(224, 74, 74, 72), outline=(255, 92, 92))
    dr.text((px(bx0), max(0, pz(bz1) - 14)),
            "R2 block now: %.0f%% over water" % (cur_cov * 100.0), fill=(255, 138, 138))
    for k, (dist, x, z) in enumerate(top):
        dr.rectangle([px(x), pz(z + depth), px(x + width), pz(z)], outline=(67, 209, 124))
        dr.text((px(x) + 4, max(0, pz(z + depth) - 14)),
                "A%d dry, %.0fm away" % (k + 1, dist), fill=(120, 235, 165))
    dr.text((12, H - 18),
            "FluxVerse City3D - R2 district site check - %s - blue = L_Water mesh, grey = Ground512" % stamp,
            fill=(141, 151, 163))
    site_dir = os.path.join(out_dir, "site")
    if not os.path.isdir(site_dir):
        os.makedirs(site_dir)
    png_path = os.path.join(site_dir, "r2-site-%s-bm-a.png" % stamp)
    img.save(png_path)

    md_path = os.path.join(site_dir, "r2-site-%s-bm-a.md" % stamp)
    md = ["# R2 街区落位核验（%s）" % stamp, "",
          "| 项 | 值 |", "|---|---|",
          "| 水面网格 | %s，AABB x[%.1f..%.1f] z[%.1f..%.1f]，三角 %d |"
          % (", ".join(water_names), water_aabb[0], water_aabb[2], water_aabb[1], water_aabb[3], len(tris)),
          "| 地面板 Ground512 | x[%.1f..%.1f] z[%.1f..%.1f] |"
          % (plate_aabb[0], plate_aabb[2], plate_aabb[1], plate_aabb[3]),
          "| 街区范围 | %.1f × %.1f m，世界 x[%.1f..%.1f] z[%.1f..%.1f] |"
          % (width, depth, bx0, bx1, bz0, bz1),
          "| **压水比例** | **%.1f%%** |" % (cur_cov * 100.0),
          "| 全干候选锚点 | %d 处（1 m 栅格、2 m 步长） |" % len(cands), "",
          "## 最近的三个全干落位（城市坐标 = 相对 City_GAME 原点）", "",
          "| 名 | 世界中心 | 城市局部中心 | 距现位 |", "|---|---|---|---|"]
    for k, (dist, x, z) in enumerate(top):
        md.append("| A%d | (%.1f, %.1f) | (%.1f, %.1f) | %.1f m |"
                  % (k + 1, x + width * 0.5, z + depth * 0.5,
                     x + width * 0.5 - origin[0], z + depth * 0.5 - origin[1], dist))
    md += ["", "地图：`%s`" % os.path.relpath(png_path, ROOT).replace("\\", "/"), ""]
    io.open(md_path, "w", encoding="utf-8").write("\n".join(md))

    print("map=" + os.path.relpath(png_path, ROOT).replace("\\", "/"))
    print("md=" + os.path.relpath(md_path, ROOT).replace("\\", "/"))
    return report_verdict(cur_cov, top, drift)


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))