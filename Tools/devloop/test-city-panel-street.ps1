# test-city-panel-street.ps1 - the street pulse is normalised once, by the builder
# ---------------------------------------------------------------------------
# r848. The world state carries one seat per resident (state / visible), but the
# page only ever printed how many residents EXIST. The builder now normalises
# `street_behavior` into {total, visible, nodata, seats_n, states[]} so the
# machine line and the page cannot say different things.
#
# This sandbox drives the REAL builder twice:
#   A) world state with NO street_behavior -> "unknown", page ships STREET = null
#   B) world state WITH seats              -> totals kept, states aggregated
#                                             count-desc / name-asc, and an
#                                             unrecognised state kept verbatim
# ASCII-only law: no CJK in this file.

$ErrorActionPreference = 'Stop'
$builder = Join-Path $PSScriptRoot 'build-city-panel.ps1'
if (-not (Test-Path -LiteralPath $builder)) { Write-Output 'setup FAIL: builder missing'; exit 1 }

$repoDir = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$snap = Join-Path $repoDir 'world-public\city-snapshot.json'
$face = Join-Path $repoDir 'state\status-face.json'
foreach ($p in @($snap, $face)) {
    if (-not (Test-Path -LiteralPath $p)) { Write-Output ('setup FAIL: input missing ' + $p); exit 1 }
}

$sandbox = Join-Path ([System.IO.Path]::GetTempPath()) ('fv-street-' + $PID)
if (Test-Path -LiteralPath $sandbox) { Remove-Item -LiteralPath $sandbox -Recurse -Force }
New-Item -ItemType Directory -Path $sandbox -Force | Out-Null

function Write-TextFile([string]$path, [string]$body) {
    $utf8 = New-Object System.Text.UTF8Encoding($false)
    [IO.File]::WriteAllText($path, $body, $utf8)
}

# A: the probe has published nothing about the street yet.
$stateA = Join-Path $sandbox 'state-no-street.json'
Write-TextFile $stateA '{"ts_utc":"2026-01-01T00:00:00Z","git":{"commits_total":10}}'

# B: three seats. total/visible/nodata are deliberately NOT the sum of the
# states (a hidden resident can be counted in total but have no state row), so
# a builder that recomputes the total from `states` is caught.
$stateB = Join-Path $sandbox 'state-street.json'
Write-TextFile $stateB @'
{
  "ts_utc": "2026-01-01T00:00:00Z",
  "git": {"commits_total": 10},
  "street_behavior": {
    "total": 5,
    "visible": 2,
    "nodata": 2,
    "seats": [
      {"slot": 0, "go": "ResA01", "id": "C-00001", "state": "work", "visible": 1},
      {"slot": 1, "go": "ResA02", "id": "C-00002", "state": "home", "visible": 0},
      {"slot": 2, "go": "ResA03", "id": "C-00003", "state": "work", "visible": 1},
      {"slot": 3, "go": "ResA04", "id": "C-00004", "state": "hologram", "visible": 0},
      {"slot": 4, "go": "ResA05", "id": "C-00005", "state": "", "visible": 0}
    ]
  }
}
'@

function Invoke-Build([string]$outName, [string]$statePath) {
    $outHtml = Join-Path $sandbox ($outName + '.html')
    $hist = Join-Path $sandbox ($outName + '.jsonl')
    $text = (& powershell -NoProfile -ExecutionPolicy Bypass -File $builder `
            -StatePath $statePath -OutPath $outHtml -HistoryPath $hist -SiteSkip) -join "`n"
    $code = $LASTEXITCODE
    $html = ''
    if (Test-Path -LiteralPath $outHtml) { $html = [IO.File]::ReadAllText($outHtml) }
    return [pscustomobject]@{ log = $text; html = $html; code = $code; out = $outHtml }
}

$A = Invoke-Build 'panelA' $stateA
$B = Invoke-Build 'panelB' $stateB

$pass = 0
$fail = 0
function Check([string]$name, [bool]$cond) {
    if ($cond) { Write-Output ('  PASS ' + $name); $script:pass++ }
    else { Write-Output ('  FAIL ' + $name); $script:fail++ }
}

# --- A: no reading is "unknown", never a zero nobody measured --------------
Check 'A: build exits 0 without a street reading' ($A.code -eq 0)
Check 'A: machine face says unknown' ($A.log -match 'PANEL STREET: unknown')
Check 'A: machine face never prints a totals line' (-not ($A.log -match 'PANEL STREET: total='))
Check 'A: page ships STREET = null' ($A.html -match 'const STREET = null;')
Check 'A: no unrendered placeholder left' (-not ($A.html -match '__[A-Z]+_JSON__'))
Check 'A: null is the JSON literal, not the string "null"' (-not ($A.html -match 'const STREET = "null"'))

# --- B: a real reading ----------------------------------------------------
Check 'B: build exits 0 with a reading' ($B.code -eq 0)
Check 'B: totals are carried, not recomputed from seats' ($B.log -match 'PANEL STREET: total=5 visible=2 nodata=2 seats=5')
# count desc, then name asc: work 2, then the 1-count group by name
# (hologram < home < unknown)
Check 'B: states aggregate count-desc then name-asc' ($B.log -match 'states=work:2,hologram:1,home:1,unknown:1')
Check 'B: an unrecognised state is kept verbatim' ($B.log -match 'hologram:1')
Check 'B: an empty state name becomes "unknown"' ($B.log -match 'unknown:1')
Check 'B: page ships the object' ($B.html -match 'const STREET = \{')
Check 'B: page carries the total' ($B.html.Contains('"total":5'))
Check 'B: page carries the seat count' ($B.html.Contains('"seats_n":5'))
Check 'B: page keeps the builder order' ($B.html.Contains('"name":"work","count":2') -and $B.html.Contains('"name":"hologram","count":1'))
Check 'B: null never leaked into a populated face' (-not ($B.html -match 'const STREET = null;'))
Check 'B: no unrendered placeholder left' (-not ($B.html -match '__[A-Z]+_JSON__'))

# --- source contracts -----------------------------------------------------
$src = [IO.File]::ReadAllText($builder, [Text.Encoding]::UTF8)
Check 'source: reading is optional so a missing one cannot kill the page' ($src -match "To-JsLiteral -Obj \`$street -Label 'street_behavior' -Optional")
Check 'source: total falls back to the seat count' ($src -match '\$total = \$seats\.Count')
Check 'source: empty total is not invented' ($src -match 'if \(\$null -eq \$Raw\) \{ return \$null \}')
$fnStart = $src.IndexOf('function Get-StreetPulse')
$fnBody = ''
if ($fnStart -ge 0) {
    $fnEnd = $src.IndexOf("`n}", $fnStart)
    if ($fnEnd -gt $fnStart) { $fnBody = $src.Substring($fnStart, $fnEnd - $fnStart) }
}
Check 'source: Get-StreetPulse exists' ($fnStart -ge 0)
Check 'source: Get-StreetPulse body is ASCII-only' (($fnBody -ne '') -and (([regex]::Matches($fnBody, '[^\x00-\x7F]')).Count -eq 0))

try { Remove-Item -LiteralPath $sandbox -Recurse -Force } catch { }

Write-Output ('RESULT: pass=' + $pass + ' fail=' + $fail)
if ($fail -gt 0) { exit 2 }
exit 0