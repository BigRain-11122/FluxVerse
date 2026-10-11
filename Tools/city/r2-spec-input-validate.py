#!/usr/bin/env python3
"""R2 SPEC-INPUT jsonschema gate (explore#60 draft, L1 pure-mechanical, no API).

Validates the 38 JSON lines embedded in docs/research/R-20261012-ad022-r2-spec-input.md
against the three draft-07 schemas shipped next to this script:

  r2-spec-input-gen.schema.json      -> section 1 block, 34 GEN node lines (N1/N2/N3)
  r2-spec-input-attach.schema.json   -> section 2 block,  3 N4 attach lines
  r2-spec-input-fill.schema.json     -> section 5 block,  1 FILL plaza line

Extraction is line-verbatim from the markdown fenced blocks, so the gate travels
with the tracked spec file (no gitignored capture dependency). Also re-checks the
r367 final-verify account: domain tally N1=13/N2=18/N3=3, cross-unique=1,
ATTACH verdict=STOP-ADJ, FILL domain/occupied/gateway tally.

Usage:  python Tools/city/r2-spec-input-validate.py [alternate-spec.md]
        (optional argv[1] overrides the spec md path -- used by negative controls)
Exit:   0 = all 38 lines valid + schemas meta-valid + tallies pass
        1 = any failure (fail-loud, full detail listed)
Requires: jsonschema (pip) -- draft-07 validator.
"""
import json
import re
import sys
from pathlib import Path

import jsonschema

HERE = Path(__file__).resolve().parent
REPO = HERE.parents[1]
SPEC_MD_DEFAULT = REPO / "docs" / "research" / "R-20261012-ad022-r2-spec-input.md"

DRAFT7 = "http://json-schema.org/draft-07/schema#"
SCHEMAS = [
    ("GEN", HERE / "r2-spec-input-gen.schema.json", 34),
    ("ATTACH", HERE / "r2-spec-input-attach.schema.json", 3),
    ("FILL", HERE / "r2-spec-input-fill.schema.json", 1),
]
FENCE_RE = re.compile(r"```json\r?\n(.*?)```", re.S)
GEN_TALLY = {"N1": 13, "N2": 18, "N3": 3}


def fail(msg):
    print("FAIL: " + msg)
    sys.exit(1)


def main():
    spec_md = Path(sys.argv[1]) if len(sys.argv) > 1 else SPEC_MD_DEFAULT
    if not spec_md.is_file():
        fail("spec md missing: %s" % spec_md)
    md = spec_md.read_text(encoding="utf-8")
    blocks = FENCE_RE.findall(md)
    if len(blocks) != 3:
        fail("expected 3 json fences in %s, found %d" % (spec_md, len(blocks)))

    failures = []
    parsed = {}
    for (name, schema_path, expect), raw in zip(SCHEMAS, blocks):
        if not schema_path.is_file():
            fail("schema missing: %s" % schema_path)
        schema = json.loads(schema_path.read_text(encoding="utf-8"))
        if schema.get("$schema") != DRAFT7:
            fail("%s schema is not draft-07: %r" % (name, schema.get("$schema")))
        try:
            jsonschema.Draft7Validator.check_schema(schema)
        except jsonschema.SchemaError as exc:
            fail("%s schema fails check_schema: %s" % (name, exc))
        validator = jsonschema.Draft7Validator(schema)

        lines = raw.strip().splitlines()
        if len(lines) != expect:
            failures.append("%s block has %d lines, expected %d" % (name, len(lines), expect))
            continue
        rows = []
        for idx, line in enumerate(lines, 1):
            try:
                obj = json.loads(line)
            except json.JSONDecodeError as exc:
                failures.append("%s line %d: not valid JSON (%s)" % (name, idx, exc))
                continue
            for err in sorted(validator.iter_errors(obj), key=lambda e: list(e.path)):
                loc = "/".join(str(p) for p in err.path) or "<root>"
                failures.append("%s line %d [%s]: %s" % (name, idx, loc, err.message))
            rows.append(obj)
        parsed[name] = rows

    # tally checks (r367 final-verify account)
    gen = parsed.get("GEN", [])
    tally = {}
    for row in gen:
        for d in row.get("domains", []):
            tally[d] = tally.get(d, 0) + 1
    if tally != GEN_TALLY:
        failures.append("GEN domain tally %r != expected %r" % (tally, GEN_TALLY))
    if sum(1 for row in gen if row.get("type") == "cross") != 1:
        failures.append("GEN cross count != 1 (cross-unique law, sole (5,95))")

    att = parsed.get("ATTACH", [])
    if any(row.get("verdict") != "STOP-ADJ" for row in att):
        failures.append("ATTACH verdict not all STOP-ADJ")
    if any(row.get("class") != "N4-attach" for row in att):
        failures.append("ATTACH class not all N4-attach")

    fill = parsed.get("FILL", [])
    if fill:
        row = fill[0]
        if row.get("domain") != "FILL":
            failures.append("FILL domain != FILL")
        if row.get("occupied") != len(row.get("cells", [])):
            failures.append("FILL occupied %r != len(cells) %d" % (row.get("occupied"), len(row.get("cells", []))))
        if row.get("gateway_cells"):
            failures.append("FILL gateway_cells not empty (zero-gateway law)")

    total = sum(len(v) for v in parsed.values())
    if total != 38:
        failures.append("total lines parsed = %d != 38" % total)

    if failures:
        print("FAIL: %d problem(s)" % len(failures))
        for f in failures:
            print(" - " + f)
        sys.exit(1)

    print("PASS: r2-spec-input 38/38 lines valid (GEN 34 + ATTACH 3 + FILL 1)")
    print("PASS: tally N1=13/N2=18/N3=3, cross=1, ATTACH verdict=STOP-ADJ x3, FILL domain/occupied/gateway ok")
    print("PASS: 3 draft-07 schemas meta-valid (check_schema)")


if __name__ == "__main__":
    main()
