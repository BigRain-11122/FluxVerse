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
    'logs\devloop-r271-keep-negcon.ps1'
)
foreach ($rel in $defRel) { Write-Fixture (Join-Path $repo2 $rel) $green }
$rh = Invoke-Runner @('-RepoDir', $repo2)
Check 'h: exit 0'                ($rh.code -eq 0)
Check 'h: five default suites'   ($rh.out -match 'PS SUITES suites=5 ')
Check 'h: r247 in default set'   ($rh.out -match 'devloop-r247-facewriter-test\.ps1')
Check 'h: r271 in default set'   ($rh.out -match 'devloop-r271-keep-negcon\.ps1')

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