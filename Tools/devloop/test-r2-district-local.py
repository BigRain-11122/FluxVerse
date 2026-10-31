#!/usr/bin/env python3
"""test-r2-district-local.py -- sandbox proof for main#54 district placement.

r714/r716 measured the R2 block as if it stood on the City_GAME origin, because
the district did not move. main#54 moved it to the dry anchor, so the checker
has to read the real local position from an artifact instead of assuming zero.
These assertions pin that reader:

  1. a scene carrying the district  -> its Transform.m_LocalPosition
  2. a scene without the district   -> None (caller falls back)
  3. a missing file                 -> None (never throws)
  4. the built scene                -> matches City3D-staging/rehearsal-anchor.txt
  5. a district whose transform is unreadable -> (0, 0), not a crash

ASCII-only: no CJK in this file. Exit 0 = all passed, 1 = a failure.
"""

import importlib.util
import io
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
CHECKER = os.path.join(HERE, "r2-site-check.py")
STUB = os.path.join(HERE, "fixtures", "r2-site", "district-stub.unity")
NO_DISTRICT = os.path.join(HERE, "fixtures", "r2-site", "scene-dry.unity")
MISSING = os.path.join(HERE, "fixtures", "r2-site", "does-not-exist.unity")

fails = []


def check(name, cond):
    if cond:
        print("  PASS " + name)
    else:
        print("  FAIL " + name)
        fails.append(name)


spec = importlib.util.spec_from_file_location("r2site", CHECKER)
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)

# 1) the stub carries the district at (1.5, -7.25)
got = mod.district_local_from_scene(STUB)
check("stub: local position read", got == (1.5, -7.25))

# 2) a scene without the district returns None (caller decides the fallback)
check("no district: None", mod.district_local_from_scene(NO_DISTRICT) is None)

# 3) missing file never throws
try:
    got = mod.district_local_from_scene(MISSING)
    check("missing file: None, no throw", got is None)
except Exception as exc:  # noqa: BLE001 - a throw here is the bug
    check("missing file: None, no throw (%s)" % exc, False)

# 4) the built scene agrees with the anchor decision record
anchor = mod.anchor_local_from_file()
built = mod.district_local_from_scene(mod.BUILT_SCENE)
check("anchor file readable", anchor is not None)
check("built scene matches anchor",
      built is not None and anchor is not None
      and abs(built[0] - anchor[0]) < 0.01 and abs(built[1] - anchor[1]) < 0.01)

# 5) a district GameObject with no Transform line falls back to the origin
tmp = os.path.join(os.environ.get("TEMP", "."), "fv-district-notf-%d.unity" % os.getpid())
io.open(tmp, "w", encoding="utf-8").write(
    "%YAML 1.1\n--- !u!1 &42\nGameObject:\n  m_Name: R2_AD-021_District\n  m_IsActive: 1\n")
try:
    check("district without transform: origin", mod.district_local_from_scene(tmp) == (0.0, 0.0))
finally:
    try:
        os.remove(tmp)
    except OSError:
        pass

print("test-r2-district-local: %d passed, %d failed" % (5 + 1 - len(fails), len(fails)))
sys.exit(1 if fails else 0)