# test-run-ps-suites.ps1 - sandbox for the PS suite runner (queue main#86)
# ---------------------------------------------------------------------------
# WHY (r748): the write-side PowerShell sandboxes had no per-round entry point,
# so the "builder $artPattern == face-path-lint pattern" anti-drift assertion
# was never armed. Tools\devloop\run-ps-suites.ps1 is that entry point. This
# sandbox pins its contract:
#   a) one green suite            -> exit 0, assertions counted, ALL PASS
#   b) green + red suite          -> exit 2, failing=1, red check named
#   c) suite that crashes (exit 3)-> counted as failing (no silent pass)
#   d) suite without counts       -> still PASS, counted=0 (unknown != red)
#   e) artPattern drift           -> PARITY FAIL named, exit 2
#   f) -SkipParity                -> no PARITY line, drift not fatal
#   g) missing suite file         -> exit 3 (setup error, not a red suite)
#   h) default list wiring        -> the five write-side suites by name
#   i) runner body is ASCII-only
#   v) per-line `PASS <name>` / `FAIL <name>` suites are counted (main#100):
#      lines only -> counted, summary+lines -> summary wins (no double),
#      lone marker -> not a list, FAIL line under exit 0 -> red
#   w) a relative -Suites entry resolves against -RepoDir, not the caller's cwd
# ASCII-only law: no CJK in this file.
# ---------------------------------------------------------------------------

$ErrorActionPreference = 'Stop'
$runner = Join-Path $PSScriptRoot 'run-ps-suites.ps1'
if (-not (Test-Path -LiteralPath $runner)) { Write-Output ('setup FAIL: missing ' + $runner); exit 1 }

$pass = 0
$fail = 0
function Check([string]$name, [bool]$cond) {
    if ($cond) { Write-Output ('  PASS ' + $name); $script:pass++ }
    else { Write-Output ('  FAIL ' + $name); $script:fail++ }
}

$utf8 = New-Object System.Text.UTF8Encoding($false)
$sbDir = Join-Path ([System.IO.Path]::GetTempPath()) ('fv-runps-' + $PID)
if (Test-Path -LiteralPath $sbDir) { Remove-Item -LiteralPath $sbDir -Recurse -Force }
$null = New-Item -ItemType Directory -Path $sbDir

function Write-Fixture([string]$p, [string]$body) {
    $d = Split-Path -Parent $p
    if (-not (Test-Path -LiteralPath $d)) { $null = New-Item -ItemType Directory -Path $d -Force }
    [System.IO.File]::WriteAllText($p, $body, $utf8)
}

$pattern = 'X[A-Za-z0-9_\-./\\]+\.(?:html|md)'
$builderBody = "`$artPattern = '" + $pattern + "'`r`n"
$lintBody = "`$script:FaceArtPattern = '" + $pattern + "'`r`n"

# ---------- repo1: one driftable parity pair + fixture suites ----------
$repo1 = Join-Path $sbDir 'repo1'
Write-Fixture (Join-Path $repo1 'Tools\devloop\build-city-panel.ps1') $builderBody
Write-Fixture (Join-Path $repo1 'Tools\devloop\face-path-lint.ps1') $lintBody

$green = Join-Path $repo1 'Tools\devloop\test-green.ps1'
$red = Join-Path $repo1 'Tools\devloop\test-red.ps1'
$crash = Join-Path $repo1 'Tools\devloop\test-crash.ps1'
$nocount = Join-Path $repo1 'Tools\devloop\test-nocount.ps1'

Write-Fixture $green ("Write-Output '  PASS a'`r`nWrite-Output '  PASS b'`r`nWrite-Output '  PASS c'`r`nWrite-Output 'RESULT pass=3 fail=0'`r`nexit 0`r`n")
Write-Fixture $red ("Write-Output '  PASS a'`r`nWrite-Output '  PASS b'`r`nWrite-Output '  FAIL c named-check'`r`nWrite-Output 'RESULT pass=2 fail=1'`r`nexit 2`r`n")
Write-Fixture $crash ("Write-Output 'boom: unhandled'`r`nexit 3`r`n")
Write-Fixture $nocount ("Write-Output 'VERDICT: PASS'`r`nexit 0`r`n")

function Invoke-Runner([string[]]$argv) {
    $out = & powershell.exe -NoProfile -ExecutionPolicy Bypass -File $runner @argv 2>&1 | Out-String
    return @{ code = $LASTEXITCODE; out = $out }
}

# ---------- a) one green suite ----------
Write-Output '--- a) green suite ---'
$ra = Invoke-Runner @('-RepoDir', $repo1, '-Suites', $green)
Check 'a: exit 0'                ($ra.code -eq 0)
Check 'a: parity ok printed'     ($ra.out -match 'PARITY artPattern ok')
Check 'a: assertions counted'    ($ra.out -match 'PS SUITES suites=1 assertions=3 counted=1 failing=0 parity=ok')
Check 'a: ALL PASS'              ($ra.out -match 'PS SUITES VERDICT: ALL PASS')
Check 'a: suite line PASS'       ($ra.out -match 'PASS  test-green\.ps1  exit=0')

# ---------- b) green + red ----------
Write-Output '--- b) green + red ---'
$rb = Invoke-Runner @('-RepoDir', $repo1, '-Suites', ($green + ',' + $red))
Check 'b: exit 2'                ($rb.code -eq 2)
Check 'b: failing=1'             ($rb.out -match 'PS SUITES suites=2 .*failing=1')
Check 'b: red suite named'       ($rb.out -match 'FAIL  test-red\.ps1  exit=2')
Check 'b: red check echoed'      ($rb.out -match 'FAIL c named-check')
Check 'b: no ALL PASS'           (-not ($rb.out -match 'PS SUITES VERDICT: ALL PASS'))

# ---------- c) crashing suite ----------
Write-Output '--- c) crashing suite ---'
$rc = Invoke-Runner @('-RepoDir', $repo1, '-Suites', $crash)
Check 'c: exit 2'                ($rc.code -eq 2)
Check 'c: failing=1'             ($rc.out -match 'failing=1')
Check 'c: exit=3 shown'          ($rc.out -match 'FAIL  test-crash\.ps1  exit=3')

# ---------- d) no counts ----------
Write-Output '--- d) no counts ---'
$rd = Invoke-Runner @('-RepoDir', $repo1, '-Suites', $nocount)
Check 'd: exit 0'                ($rd.code -eq 0)
Check 'd: counted=0'             ($rd.out -match 'assertions=0 counted=0 failing=0')

# ---------- e) artPattern drift ----------
Write-Output '--- e) artPattern drift ---'
$drifted = $builderBody.Replace('X[A-Za-z0-9_', 'X[A-Za-z0-9-')
Write-Fixture (Join-Path $repo1 'Tools\devloop\build-city-panel.ps1') $drifted
$re = Invoke-Runner @('-RepoDir', $repo1, '-Suites', $green)
Check 'e: exit 2'                ($re.code -eq 2)
Check 'e: PARITY FAIL named'     ($re.out -match 'PARITY FAIL: artPattern drift')
Check 'e: summary parity=FAIL'   ($re.out -match 'parity=FAIL')
Check 'e: suite itself was run'  ($re.out -match 'PASS  test-green\.ps1')
Write-Fixture (Join-Path $repo1 'Tools\devloop\build-city-panel.ps1') $builderBody

# ---------- f) -SkipParity ----------
Write-Output '--- f) -SkipParity ---'
Write-Fixture (Join-Path $repo1 'Tools\devloop\build-city-panel.ps1') $drifted
$rf = Invoke-Runner @('-RepoDir', $repo1, '-Suites', $green, '-SkipParity')
Check 'f: exit 0'                ($rf.code -eq 0)
Check 'f: no PARITY line'        (-not ($rf.out -cmatch 'PARITY'))
Check 'f: parity=skipped'        ($rf.out -match 'parity=skipped')
Write-Fixture (Join-Path $repo1 'Tools\devloop\build-city-panel.ps1') $builderBody

# ---------- g) missing suite ----------
Write-Output '--- g) missing suite ---'
$rg = Invoke-Runner @('-RepoDir', $repo1, '-Suites', (Join-Path $repo1 'Tools\devloop\test-nope.ps1'))
Check 'g: exit 3'                ($rg.code -eq 3)
Check 'g: names missing count'   ($rg.out -match 'PS SUITES ERROR: 1 suite file\(s\) missing')

# ---------- h) default list wiring ----------
Write-Output '--- h) default list ---'
$repo2 = Join-Path $sbDir 'repo2'
Write-Fixture (Join-Path $repo2 'Tools\devloop\build-city-panel.ps1') $builderBody
Write-Fixture (Join-Path $repo2 'Tools\devloop\face-path-lint.ps1') $lintBody
$defRel = @(
    'Tools\devloop\test-write-status-face-bare.ps1',
    'Tools\devloop\test-fastpath-state-live.ps1',
    'logs\devloop-r247-facewriter-test.ps1',
    'logs\devloop-r197-writer-test.ps1',
    'logs\devloop-r271-keep-negcon.ps1',
    'Tools\devloop\test-nolivecheck-census.ps1',
    'Tools\devloop\test-qa-rotation.ps1',
    'Tools\devloop\test-runbook-sync.ps1'
)
foreach ($rel in $defRel) { Write-Fixture (Join-Path $repo2 $rel) $green }
$rh = Invoke-Runner @('-RepoDir', $repo2)
Check 'h: exit 0'                ($rh.code -eq 0)
Check 'h: eight default suites'  ($rh.out -match 'PS SUITES suites=8 ')
Check 'h: r247 in default set'   ($rh.out -match 'devloop-r247-facewriter-test\.ps1')
Check 'h: r271 in default set'   ($rh.out -match 'devloop-r271-keep-negcon\.ps1')
Check 'h: nlc census in default set' ($rh.out -match 'test-nolivecheck-census\.ps1')

# ---------- j..m) verify-side family (-Verify, main#89) ----------
# The verify family is a different list with different rules: no parity (that
# assertion is about build-city-panel.ps1's regex), a per-suite time cap, and a
# timeout that reports WARN + timeouts= instead of a verdict.
$repo3 = Join-Path $sbDir 'repo3'
$verifyRel = @(
    'Tools\devloop\test-verify-r2-site.ps1',
    'Tools\devloop\test-verify-ambient.ps1',
    'Tools\devloop\test-verify-path-census.ps1',
    'Tools\devloop\test-verify-queue-due.ps1',
    'Tools\devloop\test-queue-due.ps1',
    'Tools\devloop\test-log-archive-duty.ps1',
    'Tools\devloop\test-verify-ps-suites.ps1',
    'Tools\devloop\test-probe-path-census.ps1',
    'Tools\devloop\test-state-promote.ps1'
)
$counted = "Write-Output 'RESULT: 30 passed, 0 failed (of 30)'`r`nexit 0`r`n"
foreach ($rel in $verifyRel) { Write-Fixture (Join-Path $repo3 $rel) $counted }

Write-Output '--- j) -Verify list ---'
$rj = Invoke-Runner @('-RepoDir', $repo3, '-Verify')
Check 'j: exit 0'                  ($rj.code -eq 0)
Check 'j: nine verify suites'     ($rj.out -match 'PS SUITES suites=9 ')
Check 'j: mode=verify printed'     ($rj.out -match 'mode=verify timeouts=0')
Check 'j: parity skipped'          ($rj.out -match 'parity=skipped')
Check 'j: no PARITY line'          (-not ($rj.out -cmatch 'PARITY'))
Check 'j: verify verdict'          ($rj.out -match 'PS SUITES VERIFY VERDICT: ALL PASS')
Check 'j: "N passed" dialect counted' ($rj.out -match 'assertions=270 counted=9')
Check 'j: names a verify suite'    ($rj.out -match 'PASS  test-verify-r2-site\.ps1')

Write-Output '--- k) -Verify missing file ---'
$rjMissing = Join-Path $repo3 'Tools\devloop\test-verify-ambient.ps1'
$saved = [System.IO.File]::ReadAllText($rjMissing)
Remove-Item -LiteralPath $rjMissing -Force
$rk = Invoke-Runner @('-RepoDir', $repo3, '-Verify')
Check 'k: exit 3'                  ($rk.code -eq 3)
Check 'k: names one missing'       ($rk.out -match 'PS SUITES ERROR: 1 suite file\(s\) missing')
Write-Fixture $rjMissing $counted

Write-Output '--- l) verify suite over the cap ---'
$slowRel = 'Tools\devloop\test-verify-ps-suites.ps1'
$slowPath = Join-Path $repo3 $slowRel
Write-Fixture $slowPath ("Write-Output 'starting'`r`nStart-Sleep -Seconds 5`r`n" + $counted)
$rl = Invoke-Runner @('-RepoDir', $repo3, '-Verify', '-TimeoutSec', '1')
Check 'l: timeout is not a red'    ($rl.code -eq 0)
Check 'l: WARN names the timeout'  ($rl.out -match 'WARN  test-verify-ps-suites\.ps1  timeout>1s')
Check 'l: timeouts=1 counted'      ($rl.out -match 'timeouts=1')
Check 'l: failing stays 0'         ($rl.out -match 'failing=0')
Check 'l: cap warn line'           ($rl.out -match 'PS SUITES WARN: 1 suite\(s\) hit the 1s cap')
Write-Fixture $slowPath $counted

Write-Output '--- m) red suite under the cap ---'
Write-Fixture $slowPath ("Write-Output '  PASS a'`r`nWrite-Output '  FAIL b named-check'`r`nWrite-Output 'RESULT: 1 passed, 1 failed'`r`nexit 1`r`n")
$rm = Invoke-Runner @('-RepoDir', $repo3, '-Verify', '-TimeoutSec', '20')
Check 'm: exit 2'                  ($rm.code -eq 2)
Check 'm: failing=1'               ($rm.out -match 'failing=1')
Check 'm: red suite named'         ($rm.out -match 'FAIL  test-verify-ps-suites\.ps1  exit=1')
Check 'm: no ALL PASS'             (-not ($rm.out -match 'VERIFY VERDICT: ALL PASS'))
Check 'm: no timeout instead'      ($rm.out -match 'timeouts=0')
Write-Fixture $slowPath $counted

# ---------- n) nested-run marker (r752, queue main#94) ----------
# The gate now owns a sandbox family per side, and suites run the gate in
# process. A child must carry FLUXVERSE_PS_SUITES_CHILD=1 so the nested gate
# skips the families (otherwise a direct -Verify run recursed one level and
# took minutes). The runner must also restore its own environment afterwards.
Write-Output '--- n) nested-run marker ---'
$markerSuite = Join-Path $repo1 'Tools\devloop\test-marker.ps1'
Write-Fixture $markerSuite ("Write-Output 'starting'`r`nWrite-Output ('RESULT pass=1 fail=0 marker=' + `$env:FLUXVERSE_PS_SUITES_CHILD)`r`nexit 0`r`n")
$rn = Invoke-Runner @('-RepoDir', $repo1, '-Suites', $markerSuite)
Check 'n: child sees the marker'   ($rn.out -match 'marker=1')
Check 'n: suite still passes'      ($rn.code -eq 0)
Check 'n: parent env restored'     ([string]::IsNullOrEmpty($env:FLUXVERSE_PS_SUITES_CHILD))
$env:FLUXVERSE_PS_SUITES_CHILD = 'keep'
$null = Invoke-Runner @('-RepoDir', $repo1, '-Suites', $markerSuite)
Check 'n: pre-set marker restored' ($env:FLUXVERSE_PS_SUITES_CHILD -eq 'keep')
Remove-Item ('Env:\FLUXVERSE_PS_SUITES_CHILD') -ErrorAction SilentlyContinue

# ---------- v) third count dialect (queue main#100) ----------
# Suites that print one line per check and never summarise in `pass=N` or
# `N passed` form used to land as counted=0 assertions=0 - honest arithmetic
# silently lost. The runner now counts those lines, with two guard rails:
# never mix with a summary dialect, and never treat a lone marker as a list.
Write-Output '--- v) per-line dialect ---'
$linesOnly = Join-Path $repo1 'Tools\devloop\test-lines-only.ps1'
Write-Fixture $linesOnly ("Write-Output '  PASS alpha'`r`nWrite-Output '  PASS beta'`r`nWrite-Output '  PASS gamma'`r`nWrite-Output '  PASS delta'`r`nexit 0`r`n")
$rv1 = Invoke-Runner @('-RepoDir', $repo1, '-Suites', $linesOnly)
Check 'v1: exit 0'                 ($rv1.code -eq 0)
Check 'v1: four lines counted'     ($rv1.out -match 'assertions=4 counted=1 failing=0')
Check 'v1: suite still named PASS' ($rv1.out -match 'PASS  test-lines-only\.ps1  exit=0')

$both = Join-Path $repo1 'Tools\devloop\test-lines-and-summary.ps1'
Write-Fixture $both ("Write-Output '  PASS alpha'`r`nWrite-Output '  PASS beta'`r`nWrite-Output 'RESULT pass=2 fail=0'`r`nexit 0`r`n")
$rv2 = Invoke-Runner @('-RepoDir', $repo1, '-Suites', $both)
Check 'v2: summary wins, no double' ($rv2.out -match 'assertions=2 counted=1 failing=0')

$lone = Join-Path $repo1 'Tools\devloop\test-lone-marker.ps1'
Write-Fixture $lone ("Write-Output 'PASS looks like a log line'`r`nexit 0`r`n")
$rv3 = Invoke-Runner @('-RepoDir', $repo1, '-Suites', $lone)
Check 'v3: lone marker not a list'  ($rv3.out -match 'assertions=0 counted=0 failing=0')

$lineRed = Join-Path $repo1 'Tools\devloop\test-lines-red.ps1'
Write-Fixture $lineRed ("Write-Output '  PASS alpha'`r`nWrite-Output '  FAIL beta named-check'`r`nexit 0`r`n")
$rv4 = Invoke-Runner @('-RepoDir', $repo1, '-Suites', $lineRed)
Check 'v4: FAIL line beats exit 0'  ($rv4.code -eq 2)
Check 'v4: failing=1'               ($rv4.out -match 'failing=1')
Check 'v4: both lines counted'      ($rv4.out -match 'assertions=2 counted=1')
Check 'v4: red check echoed'        ($rv4.out -match 'FAIL beta named-check')

# ---------- w) relative -Suites entries resolve against -RepoDir (r766) ----------
# The tick spawns the runner with `-Suites Tools\devloop\test-verify-ps-suites.ps1`
# from a scheduler-chosen working directory. Measured live: with cwd
# C:\Windows\System32 that suite list arrived as "1 suite file(s) missing",
# exit 3, 330 ms - the ticket said `unreadable` and the heavy sandbox had not
# run at all, while the same command from the repo root passed. A relative
# entry now means "relative to the repo", never to the caller.
Write-Output '--- w) relative suite path ---'
Push-Location ([System.IO.Path]::GetTempPath())
try {
    $rw = Invoke-Runner @('-RepoDir', $repo1, '-Suites', 'Tools\devloop\test-green.ps1')
} finally { Pop-Location }
Check 'w1: exit 0 from foreign cwd' ($rw.code -eq 0)
Check 'w1: counted, not missing'    ($rw.out -match 'PS SUITES suites=1 assertions=3 counted=1')
Check 'w1: no missing error'        (-not ($rw.out -match 'suite file\(s\) missing'))

# ---------- i) ASCII-only body ----------
Write-Output '--- i) ASCII-only body ---'
$bad = 0
foreach ($b in [System.IO.File]::ReadAllBytes($runner)) { if ($b -gt 127) { $bad++ } }
Check 'i: runner ascii=0'        ($bad -eq 0)

# ---------- cleanup ----------
Remove-Item -LiteralPath $sbDir -Recurse -Force -ErrorAction SilentlyContinue

Write-Output ('SUITES total=' + ($pass + $fail) + ' pass=' + $pass + ' fail=' + $fail)
if ($fail -gt 0) { exit 1 }
Write-Output 'ALL PASS'
exit 0