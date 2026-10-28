# test-city-panel-proof.ps1 - sandbox proof for the city proof rows (queue main#48)
# --------------------------------------------------------------------------
# The framing card showed what the city looks like but not whether it had been
# built, measured, or how old its code was. The builder now reads three existing
# receipts (City3D-staging\r2-ignite.done, its report, qa\smoke-r680-bm-a-soak.json)
# plus the last City3D commit and ships them as PROOF.
#
# This sandbox runs the REAL builder against three fixture roots:
#   A) healthy receipts  -> proof_build=0 proof_soak=ok, values flow into the page
#   B) empty root        -> proof_build=missing proof_soak=missing proof_code=none
#   C) exit 7 + errors 2 -> the numbers are carried verbatim (no laundering)
# Every build writes to a temp output so the live panel and history are untouched.
# ASCII-only law: no CJK in this file.

$ErrorActionPreference = 'Stop'
$builder = Join-Path $PSScriptRoot 'build-city-panel.ps1'
if (-not (Test-Path -LiteralPath $builder)) { Write-Output 'setup FAIL: builder missing'; exit 1 }

$repoDir = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$snap = Join-Path $repoDir 'world-public\city-snapshot.json'
$face = Join-Path $repoDir 'state\status-face.json'
$entity = Join-Path $repoDir 'Tools\devloop\city-panel-template.html'
foreach ($p in @($snap, $face, $entity)) {
    if (-not (Test-Path -LiteralPath $p)) { Write-Output ('setup FAIL: input missing ' + $p); exit 1 }
}

$sandbox = Join-Path ([System.IO.Path]::GetTempPath()) ('fv-proof-' + $PID)
if (Test-Path -LiteralPath $sandbox) { Remove-Item -LiteralPath $sandbox -Recurse -Force }
New-Item -ItemType Directory -Path $sandbox -Force | Out-Null

function New-FixtureRoot([string]$name) {
    $root = Join-Path $sandbox $name
    New-Item -ItemType Directory -Path (Join-Path $root 'City3D-staging') -Force | Out-Null
    New-Item -ItemType Directory -Path (Join-Path $root 'qa') -Force | Out-Null
    return $root
}

function Write-TextFile([string]$path, [string]$body) {
    $utf8 = New-Object System.Text.UTF8Encoding($false)
    [IO.File]::WriteAllText($path, $body, $utf8)
}

# --- A) healthy fixture -----------------------------------------------------
$rootA = New-FixtureRoot 'rootA'
Write-TextFile (Join-Path $rootA 'City3D-staging\r2-ignite.done') @'
{
    "ts":  "2026-10-11T00:21:35+08:00",
    "order":  "fixture",
    "exit_code":  0,
    "wall_s":  23,
    "log_done_marker":  true,
    "shots_present":  5,
    "shots_expected":  5
}
'@
Write-TextFile (Join-Path $rootA 'City3D-staging\r2-report.md') "fixture report`r`n"
Write-TextFile (Join-Path $rootA 'qa\smoke-r680-bm-a-soak.json') @'
{
  "probe": "R2SoakProbe",
  "ts_utc": "2026-10-26T10:31:42Z",
  "render": {"frames": 182561, "fps_avg": 608.536},
  "errors": 0,
  "exceptions": 0
}
'@

# --- B) empty fixture -------------------------------------------------------
$rootB = New-FixtureRoot 'rootB'

# --- C) failing fixture -----------------------------------------------------
$rootC = New-FixtureRoot 'rootC'
Write-TextFile (Join-Path $rootC 'City3D-staging\r2-ignite.done') @'
{ "ts": "2026-10-11T00:21:35+08:00", "exit_code": 7, "wall_s": 5, "shots_present": 2, "shots_expected": 5 }
'@
Write-TextFile (Join-Path $rootC 'qa\smoke-r680-bm-a-soak.json') @'
{ "ts_utc": "2026-10-26T10:31:42Z", "render": {"fps_avg": 120.5}, "errors": 2, "exceptions": 1 }
'@

$results = @{}
foreach ($k in @('A', 'B', 'C')) {
    $root = (Get-Variable ('root' + $k)).Value
    $outHtml = Join-Path $sandbox ('panel-' + $k + '.html')
    $hist = Join-Path $sandbox ('hist-' + $k + '.jsonl')
    $log = (& powershell -NoProfile -ExecutionPolicy Bypass -File $builder `
            -ProofRoot $root -OutPath $outHtml -HistoryPath $hist) -join "`n"
    $html = ''
    if (Test-Path -LiteralPath $outHtml) { $html = [IO.File]::ReadAllText($outHtml) }
    $results[$k] = [pscustomobject]@{ log = $log; html = $html }
}

$pass = 0
$fail = 0
function Check([string]$name, [bool]$cond) {
    if ($cond) { Write-Output ('  PASS ' + $name); $script:pass++ }
    else { Write-Output ('  FAIL ' + $name); $script:fail++ }
}

$A = $results['A']; $B = $results['B']; $C = $results['C']

Check 'A: builder reported PANEL OK' ($A.log -match 'PANEL OK')
Check 'A: proof_build=0' ($A.log -match 'proof_build=0(?!\d)')
Check 'A: proof_soak=ok' ($A.log -match 'proof_soak=ok(?![a-z])')
Check 'A: proof_code=none (fixture root is not a repo)' ($A.log -match 'proof_code=none')
Check 'A: build exit/ts in page' ($A.html.Contains('"exit_code":0') -and $A.html.Contains('2026-10-10T16:21:35Z'))
Check 'A: soak fps carried verbatim' ($A.html.Contains('"fps_avg":608.536'))
Check 'A: report link resolved' ($A.html.Contains('r2-report.md'))
Check 'A: no unrendered placeholder left' (-not ($A.html -match '__[A-Z]+_JSON__'))

Check 'B: builder still builds (fail-soft)' ($B.log -match 'PANEL OK')
Check 'B: proof_build=missing' ($B.log -match 'proof_build=missing')
Check 'B: proof_soak=missing' ($B.log -match 'proof_soak=missing')
Check 'B: proof_code=none' ($B.log -match 'proof_code=none')
Check 'B: page carries exists=false' ($B.html.Contains('"exists":false'))

Check 'C: proof_build reports the real exit code' ($C.log -match 'proof_build=7(?!\d)')
Check 'C: exit code surfaces in the page' ($C.html.Contains('"exit_code":7'))
Check 'C: soak errors carried, not laundered' ($C.html.Contains('"errors":2') -and $C.html.Contains('"exceptions":1'))

Check 'no unreadable receipt crashes a build' ((@($A.log, $B.log, $C.log) | Where-Object { $_ -match 'FAIL:' }).Count -eq 0)

try { Remove-Item -LiteralPath $sandbox -Recurse -Force } catch { }

Write-Output ('RESULT: pass=' + $pass + ' fail=' + $fail)
if ($fail -gt 0) { exit 2 }
exit 0