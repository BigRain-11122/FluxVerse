#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""PROBLEM-REGISTRY census for the FluxVerse city-construction line.

Reads the group problem registry (read-only), classifies entries, checks the
six mandatory fields, tallies status/recurrence, and keeps a machine block in
an annex markdown file fresh.

Usage:
  python Tools/devloop/problem-registry-census.py            # print block
  python Tools/devloop/problem-registry-census.py --write    # refresh annex block
  python Tools/devloop/problem-registry-census.py --check    # exit 1 on drift
  python Tools/devloop/problem-registry-census.py --self-check

Never writes to the group repo. --write only touches the annex inside this repo.
"""

import argparse
import os
import re
import subprocess
import sys

# City-construction (FluxVerse) tokens. "城市" alone is NOT enough: the BigLife
# resident-line annex is also filed under "城市线" and its escalation notes would
# false-positive. Tokens below only appear when the text is about the city build.
CITY_TOKENS = (
    "FluxVerse",
    "超体宇宙",
    "City3D",
    "模块壳",
    "街区",
    "取景",
    "场景",
)

REQUIRED_FIELDS = (
    "来源",
    "复发史",
    "出生地闸",
    "验证证据",
    "复发计数",
    "状态",
)

KNOWN_STATUS = ("open", "armed", "closed", "open-CEO")

BLOCK_BEGIN = "<!-- CENSUS:BEGIN -->"
BLOCK_END = "<!-- CENSUS:END -->"

ENTRY_RE = re.compile(r"^###\s+(PR-\d{8}-\d{2})\s*(.*)$")


def repo_root():
    here = os.path.dirname(os.path.abspath(__file__))
    try:
        out = subprocess.run(
            ["git", "-C", here, "rev-parse", "--show-toplevel"],
            capture_output=True, text=True, timeout=30,
        )
        if out.returncode == 0 and out.stdout.strip():
            return out.stdout.strip().replace("/", os.sep)
    except Exception:
        pass
    return os.path.abspath(os.path.join(here, "..", ".."))


def resolve_group_root(root):
    """Pick the LIVE group root (mirror of Tools/devloop/resolve-group-root.ps1).

    This repo can be opened through a mirror path whose sibling group dirs are a
    stale copy (measured r683: D:\\FluxGroup ledger 2026-10-20 vs live desktop
    mirror 2026-10-27). Reading the stale copy never fails loud, so the registry
    census would silently drop entries. Rule: newest cph4/evolution-ledger.md
    wins; the legacy "..\\.." answer is the fallback.
    """
    legacy = os.path.abspath(os.path.join(root, "..", ".."))
    cands = [legacy]
    leaf = os.path.basename(legacy.rstrip("\\/"))
    profile = os.environ.get("USERPROFILE", "")
    if leaf and profile:
        mirror = os.path.join(profile, "Desktop", leaf)
        suffix = root[len(legacy):].strip("\\/") if len(root) > len(legacy) else ""
        mirror_repo = os.path.join(mirror, suffix) if suffix else mirror
        if os.path.abspath(mirror) != legacy and os.path.isdir(mirror_repo):
            cands.append(mirror)
    best, best_stamp = legacy, None
    for cand in cands:
        ledger = os.path.join(cand, "cph4", "evolution-ledger.md")
        if not os.path.isfile(ledger):
            continue
        stamp = os.path.getmtime(ledger)
        if best_stamp is None or stamp > best_stamp:
            best, best_stamp = cand, stamp
    source = "legacy" if os.path.abspath(best) == legacy else "desktop-mirror"
    return os.path.abspath(best), source


def default_registry_path(root):
    group, _ = resolve_group_root(root)
    return os.path.join(group, "cph4", "fleet", "PROBLEM-REGISTRY.md")


def read_text(path):
    with open(path, "rb") as fh:
        raw = fh.read()
    for enc in ("utf-8-sig", "utf-8", "gbk"):
        try:
            return raw.decode(enc)
        except UnicodeDecodeError:
            continue
    return raw.decode("utf-8", "replace")


def parse_entries(text):
    entries = []
    cur = None
    for line in text.splitlines():
        m = ENTRY_RE.match(line.strip())
        if m:
            cur = {"id": m.group(1), "title": m.group(2).strip(), "fields": {}, "raw": []}
            entries.append(cur)
            continue
        if cur is None:
            continue
        s = line.strip()
        cur["raw"].append(line)
        if s.startswith("- "):
            body = s[2:]
            if ":" in body:
                key, val = body.split(":", 1)
                cur["fields"][key.strip()] = val.strip()
    return entries


def field_of(entry, prefix):
    for key, val in entry["fields"].items():
        if key.startswith(prefix):
            return val
    return None


def has_field(entry, prefix):
    return field_of(entry, prefix) is not None


def recurrence(entry):
    val = field_of(entry, "复发计数")
    if val is None:
        return None
    m = re.search(r"\d+", val)
    return int(m.group(0)) if m else None


def status_of(entry):
    val = field_of(entry, "状态")
    if val is None:
        return None
    tok = val.split()[0].strip()
    return tok


def is_city(entry):
    blob = entry["title"] + "\n" + "\n".join(entry["raw"])
    return any(tok in blob for tok in CITY_TOKENS)


def city_tokens_hit(entry):
    blob = entry["title"] + "\n" + "\n".join(entry["raw"])
    return [tok for tok in CITY_TOKENS if tok in blob]


def census(entries):
    rows = []
    gaps = []
    unknown = []
    status_tally = {}
    for e in entries:
        st = status_of(e)
        rec = recurrence(e)
        missing = [f for f in REQUIRED_FIELDS if not has_field(e, f)]
        if st is None:
            missing.append("状态")
        if st is not None and st not in KNOWN_STATUS:
            unknown.append((e["id"], st))
        if st is not None:
            status_tally[st] = status_tally.get(st, 0) + 1
        if missing:
            gaps.append((e["id"], sorted(set(missing))))
        rows.append({
            "id": e["id"],
            "title": e["title"],
            "status": st or "?",
            "recur": rec if rec is not None else -1,
            "city": is_city(e),
            "city_tokens": city_tokens_hit(e),
            "gate": field_of(e, "出生地闸") or "",
            "evidence": field_of(e, "验证证据") or "",
            "blocker": field_of(e, "阻塞") or "",
        })
    city_rows = [r for r in rows if r["city"]]
    recs = [r["recur"] for r in rows if r["recur"] >= 0]
    return {
        "rows": rows,
        "city_rows": city_rows,
        "gaps": gaps,
        "unknown": unknown,
        "status_tally": status_tally,
        "entries": len(rows),
        "city": len(city_rows),
        "max_recur": max(recs) if recs else 0,
        "recur_ge2": sum(1 for r in recs if r >= 2),
        "armed_no_evidence": [
            r["id"] for r in rows
            if r["status"] in ("armed", "closed") and not r["evidence"].strip()
        ],
        "armed_no_gate": [
            r["id"] for r in rows
            if r["status"] in ("armed", "closed") and not r["gate"].strip()
        ],
    }


def summary_line(c):
    t = c["status_tally"]
    return (
        "CITY_REGISTRY_SUMMARY: entries={e} city={c} open={op} armed={ar} closed={cl} "
        "open_ceo={oc} max_recur={mx} recur_ge2={g2} field_gaps={fg} unknown_status={us}"
    ).format(
        e=c["entries"], c=c["city"],
        op=t.get("open", 0), ar=t.get("armed", 0), cl=t.get("closed", 0),
        oc=t.get("open-CEO", 0), mx=c["max_recur"], g2=c["recur_ge2"],
        fg=len(c["gaps"]), us=len(c["unknown"]),
    )


def render_block(c, registry_rel, provenance=""):
    out = []
    out.append(BLOCK_BEGIN)
    out.append("### 机器直数（`Tools/devloop/problem-registry-census.py`）")
    out.append("")
    out.append("数据源：`" + registry_rel + "`（集团正身·只读）")
    if provenance:
        out.append("")
        out.append(provenance)
    out.append("")
    out.append("```")
    out.append(summary_line(c))
    out.append("```")
    out.append("")
    out.append("全部条目（status · 复发计数 · 城市城建侧命中）：")
    out.append("")
    out.append("| 条目 | 标题 | 状态 | 复发 | 城建侧 | 出生地闸 |")
    out.append("|---|---|---|---|---|---|")
    for r in c["rows"]:
        out.append("| {id} | {title} | {st} | {rc} | {city} | {gate} |".format(
            id=r["id"],
            title=r["title"].replace("|", "/"),
            st=r["status"],
            rc=("-" if r["recur"] < 0 else str(r["recur"])),
            city=("是（" + ",".join(r["city_tokens"]) + "）") if r["city"] else "否",
            gate=("有" if r["gate"].strip() else "**缺**"),
        ))
    out.append("")
    out.append("机械校验：")
    out.append("")
    out.append("- 六字段缺项：" + ("无" if not c["gaps"] else "；".join(
        "{0} 缺 {1}".format(i, "/".join(f)) for i, f in c["gaps"])))
    out.append("- 未知状态值：" + ("无" if not c["unknown"] else "；".join(
        "{0}={1}".format(i, s) for i, s in c["unknown"])))
    out.append("- armed/closed 缺验证证据：" + ("无" if not c["armed_no_evidence"] else "、".join(c["armed_no_evidence"])))
    out.append("- armed/closed 缺出生地闸：" + ("无" if not c["armed_no_gate"] else "、".join(c["armed_no_gate"])))
    out.append("")
    if c["city"] == 0:
        out.append("城建侧在册 0 条：FluxVerse 城建线的问题目前记在本仓 TECH §九（发现债/勘注行）"
                   "与轮内判例里，未进集团 PR 正身——即「零入册」，不是「零问题」。")
        out.append("")
    out.append(BLOCK_END)
    return "\n".join(out)


def extract_block(text):
    i = text.find(BLOCK_BEGIN)
    j = text.find(BLOCK_END)
    if i < 0 or j < 0 or j < i:
        return None
    return text[i:j + len(BLOCK_END)]


def write_block(path, block):
    text = read_text(path)
    cur = extract_block(text)
    if cur is None:
        raise SystemExit("FAIL: annex has no CENSUS markers: " + path)
    new = text.replace(cur, block)
    if new == text:
        return False
    tmp = path + ".part"
    with open(tmp, "w", encoding="utf-8", newline="\n") as fh:
        fh.write(new)
    os.replace(tmp, path)
    return True


def self_check():
    fails = 0
    total = 0

    def ok(name, cond):
        nonlocal fails, total
        total += 1
        if not cond:
            fails += 1
            print("FAIL: " + name)

    fixture = """
### PR-20261101-01 城建侧样例（FluxVerse）
- 来源: 轮内实证
- 复发史·根因: 首录
- 出生地闸: 执行环节
- 验证证据: r742
- 复发计数: 2
- 状态: armed

### PR-20261101-02 居民侧样例
- 来源: BigLife 年轮
- 复发史·根因: 四连
- 出生地闸: 呈报环节（十环节 #5）
- 验证证据: R1506
- 复发计数: 4
- 状态: armed
- 升格记录: 2026-10-17 城市线附卷立册

### PR-20261101-03 缺字段样例
- 来源: 只写一半
- 复发计数: 1
- 状态: open-CEO
"""
    entries = parse_entries(fixture)
    ok("parse count", len(entries) == 3)
    ok("id parse", [e["id"] for e in entries] == [
        "PR-20261101-01", "PR-20261101-02", "PR-20261101-03"])
    c = census(entries)
    ok("city hit only token entry", [r["id"] for r in c["city_rows"]] == ["PR-20261101-01"])
    ok("biglife city-line note not matched",
       not any(r["id"] == "PR-20261101-02" for r in c["city_rows"]))
    ok("recurrence parse", [r["recur"] for r in c["rows"]] == [2, 4, 1])
    ok("status tally", c["status_tally"] == {"armed": 2, "open-CEO": 1})
    ok("gap detected", [i for i, _ in c["gaps"]] == ["PR-20261101-03"])
    ok("max recur", c["max_recur"] == 4)
    ok("recur_ge2", c["recur_ge2"] == 2)
    ok("armed evidence all present", c["armed_no_evidence"] == [])

    line = summary_line(c)
    ok("summary shape", line.startswith("CITY_REGISTRY_SUMMARY: entries=3 city=1 "))

    block = render_block(c, "cph4/fleet/PROBLEM-REGISTRY.md")
    ok("block markers", extract_block(block) == block)
    ok("block has no crash token", "报错" not in block)

    # unknown status + missing evidence
    bad = parse_entries("""
### PR-20261101-09 怪状态
- 来源: x
- 复发史·根因: y
- 出生地闸: z
- 复发计数: 1
- 状态: pending

### PR-20261101-10 armed 无证据
- 来源: x
- 复发史·根因: y
- 出生地闸: z
- 复发计数: 5
- 状态: armed
""")
    cb = census(bad)
    ok("unknown status flagged", cb["unknown"] == [("PR-20261101-09", "pending")])
    ok("armed without evidence flagged", cb["armed_no_evidence"] == ["PR-20261101-10"])
    ok("city zero on non-city text", cb["city"] == 0)
    ok("city-zero note present", "城建侧在册 0 条" in render_block(cb, "r.md"))

    # round trip: extract_block over a markdown wrapper
    wrapper = "# x\n\n" + block + "\n\ntail\n"
    ok("extract inside markdown", extract_block(wrapper) == block)
    ok("no block in plain md", extract_block("# y\n") is None)

    # group-root resolver: live desktop mirror must beat the stale legacy copy
    import tempfile, shutil
    tmp = tempfile.mkdtemp(prefix="census-selfcheck-")
    try:
        legacy = os.path.join(tmp, "legacy")
        legacy_repo = os.path.join(legacy, "gaming", "FluxVerse")
        os.makedirs(os.path.join(legacy, "cph4"), exist_ok=True)
        os.makedirs(legacy_repo, exist_ok=True)
        old_ledger = os.path.join(legacy, "cph4", "evolution-ledger.md")
        with open(old_ledger, "w", encoding="utf-8") as fh:
            fh.write("old\n")
        os.utime(old_ledger, (1000000000, 1000000000))

        prof = os.path.join(tmp, "profile")
        mirror = os.path.join(prof, "Desktop", "legacy")
        mirror_repo = os.path.join(mirror, "gaming", "FluxVerse")
        os.makedirs(os.path.join(mirror, "cph4"), exist_ok=True)
        os.makedirs(mirror_repo, exist_ok=True)
        new_ledger = os.path.join(mirror, "cph4", "evolution-ledger.md")
        with open(new_ledger, "w", encoding="utf-8") as fh:
            fh.write("new\n")

        saved = os.environ.get("USERPROFILE")
        os.environ["USERPROFILE"] = prof
        try:
            got, src = resolve_group_root(legacy_repo)
            ok("resolver picks live mirror", (got, src) == (os.path.abspath(mirror), "desktop-mirror"))
            os.utime(new_ledger, (500000000, 500000000))
            got, src = resolve_group_root(legacy_repo)
            ok("resolver falls back to legacy", (got, src) == (os.path.abspath(legacy), "legacy"))
            shutil.rmtree(mirror, ignore_errors=True)
            got, src = resolve_group_root(legacy_repo)
            ok("resolver without mirror", (got, src) == (os.path.abspath(legacy), "legacy"))
            ok("registry path follows live mirror",
               default_registry_path(legacy_repo).startswith(os.path.abspath(legacy)))
        finally:
            if saved is None:
                os.environ.pop("USERPROFILE", None)
            else:
                os.environ["USERPROFILE"] = saved
    finally:
        shutil.rmtree(tmp, ignore_errors=True)

    print("SELF_CHECK {0} {1}/{2}".format("OK" if fails == 0 else "FAIL", total - fails, total))
    return 0 if fails == 0 else 1


def main(argv):
    ap = argparse.ArgumentParser()
    ap.add_argument("--registry", default="")
    ap.add_argument("--annex", default=os.path.join("docs", "city-problem-registry-annex.md"))
    ap.add_argument("--write", action="store_true")
    ap.add_argument("--check", action="store_true")
    ap.add_argument("--self-check", action="store_true")
    args = ap.parse_args(argv)

    if args.self_check:
        return self_check()

    root = repo_root()
    registry = args.registry or os.environ.get("FLUXVERSE_PROBLEM_REGISTRY") or default_registry_path(root)
    if not os.path.isfile(registry):
        print("FAIL: registry not found: " + registry)
        return 2

    text = read_text(registry)
    entries = parse_entries(text)
    if not entries:
        print("FAIL: no PR entries parsed from " + registry)
        return 2
    c = census(entries)

    try:
        rel = os.path.relpath(registry, root).replace(os.sep, "/")
    except ValueError:
        rel = registry

    group, group_src = resolve_group_root(root)
    prov = ("组根：`{g}`（{s}；判据=cph4/evolution-ledger.md 最新）").format(
        g=group.replace(os.sep, "/"), s=("活树 desktop 镜像" if group_src == "desktop-mirror" else "legacy ..\\.. 路径"))
    block = render_block(c, rel, prov)
    annex = args.annex if os.path.isabs(args.annex) else os.path.join(root, args.annex)

    if args.write:
        changed = write_block(annex, block)
        print("ANNEX " + ("UPDATED" if changed else "UNCHANGED") + " " + os.path.basename(annex))
        print(summary_line(c))
        return 0

    if args.check:
        if not os.path.isfile(annex):
            print("FAIL: annex missing: " + annex)
            return 1
        cur = extract_block(read_text(annex))
        if cur is None:
            print("FAIL: annex has no CENSUS markers")
            return 1
        if cur != block:
            print("FAIL: annex census block is stale (run --write)")
            print(summary_line(c))
            return 1
        print("ANNEX FRESH " + os.path.basename(annex))
        print(summary_line(c))
        return 0

    print(block)
    print(summary_line(c))
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))