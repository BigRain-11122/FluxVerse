# QA smoke — r688 (bm-a): probe path census wired into the verify health line

- Round: DevLoop r688, 2026-10-28 (FULL-ROUND, triggers c4 传棒 + c6/c7 live-group decision-batch dedup)
- Claim (main#26): a probe whose read path stops existing must show up in the **same 10-minute tick**
  instead of weeks later as a silent zero read.
- Judge criteria: (1) healthy line carries the counts (2) an injected dead path flips it to a WARN
  (3) a zero-DEAD machine produces no warning noise. Plus: the WARN must not fail the gate, and the
  census must run in-process (no console child).

## 1. Sandbox — Tools/devloop/test-verify-path-census.ps1

```
PASS real machine prints a health line
PASS health line carries rows=
PASS health line carries dead=
PASS health line carries dynamic=
PASS health line carries gate=
PASS real machine dead=0
PASS real machine emits no census WARN
PASS gate still passes with census wired
PASS dead path flips the health line to WARN
PASS WARN reports dead=1
PASS WARN names the offending probe row
PASS no health line when dead paths exist
PASS WARN does not fail the gate
PASS WARN text contains no FAIL token
PASS census is called in-process (no powershell child)
RESULT: PASS
```

15/15. The injected fixture is three synthetic probes (live / dead `/docs/no-such-file-r688.md` /
runtime-composed name); the dead one must be reported and named, the dynamic tail must not be
mistaken for a dead file.

## 2. Real machine — verify

```
VERIFY HEALTH: probe-path-census: rows=55 dead=0 dynamic=2 gate=1
VERIFY PASS
```

## 3. Real machine — scan (perception chain unchanged)

26 probes, zero WARN, 3 quiet (inbox / ticklog / transfers = designed idle), events flowing,
`quarantined=0`.

## 4. Defects this round found in its own work (recorded, not hidden)

1. **Self-inflicted red scan.** v1 of the WARN text quoted the census switch `-FailOnDead`. The token
   `FAIL` is exactly what the tick red scan (fastpath c1) keys on, so the warning about dead paths
   would have manufactured a red. Reworded; a sandbox assertion now forbids `FAIL` in the WARN text.
2. **False green in the harness.** `$fails++` inside the `Check` function incremented a function-scope
   copy, so one failing assertion still printed `RESULT: PASS`. Switched to `$script:fails`; the run
   now reports the real count.

## 5. Honest boundary

- The census proves a path **exists**, not that its contents parse. Table-shape drift is still covered
  by each probe's `expect_min_rows` floor (main#22, r685).
- Runtime-composed variables (the r684 empty-`ctx.root` class) cannot be replayed statically; those stay
  covered by the scan WARN floors.
- Cost: +26 file reads and 55 `Test-Path` calls per verify, i.e. every 10 minutes — negligible.
- **No new CEO-visible web artifact this round** (perception-chain reliability work).
- T-FV-134 benchmark refresh still not carried = 6 days overdue, recorded honestly.