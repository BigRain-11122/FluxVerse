# test-city-panel-null-reading.ps1 - a missing reading must not kill the page
# ---------------------------------------------------------------------------
# Measured defect (2026-11-05 03:21:01, one ordinary backoff round):
#   panel: FAIL: residents_meta re-serialize returned empty
#   panel: build exit=1 (last-good kept, round health unchanged)
# The builder already had every consumer written for a missing reading - the
# template prints "not recorded", the machine face prints "(no readings in
# world state)". But To-JsLiteral guarded emptiness for EVERY label, and PS 5.1
# ConvertTo-Json emits nothing for $null, so the documented "ship null" contract
# became a hard build failure: one unreadable or mid-rewrite world-state file
# froze the CEO page for a whole round, visible only inside the tick log.
#
# This sandbox drives the REAL builder three ways:
#   A) world-state with NO residents_meta -> exit 0, page ships RESIDENTS = null
#   B) world-state WITH residents_meta    -> exit 0, values flow into the page
#   C) snapshot missing                   -> fail-loud preserved (still exit!=0,
#                                            and the target is left untouched)
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

$sandbox = Join-Path ([System.IO.Path]::GetTempPath()) ('fv-nullread-' + $PID)
if (Test-Path -LiteralPath $sandbox) { Remove-Item -LiteralPath $sandbox -Recurse -Force }
New-Item -ItemType Directory -Path $sandbox -Force | Out-Null

function Write-TextFile([string]$path, [string]$body) {
    $utf8 = New-Object System.Text.UTF8Encoding($false)
    [IO.File]::WriteAllText($path, $body, $utf8)
}

# --- fixture states --------------------------------------------------------
# A: the shape that broke it - a valid world state whose resident probe has
# published nothing yet (or was never promoted). No residents_meta key at all.
$stateA = Join-Path $sandbox 'state-no-meta.json'
Write-TextFile $stateA '{"ts_utc":"2026-01-01T00:00:00Z","git":{"commits_total":10}}'

# B: the healthy shape. Two speakers out of three residents, one age in hours.
$stateB = Join-Path $sandbox 'state-with-meta.json'
Write-TextFile $stateB @'
{
  "ts_utc": "2026-01-01T00:00:00Z",
  "git": {"commits_total": 10},
  "residents_meta": {
    "model": "fixture-model",
    "model_present": true,
    "model_known": true,
    "models_n": 3,
    "residents_n": 3,
    "speakers_n": 2,
    "never_n": 1,
    "stale_n": 0,
    "silent_n": 1,
    "backfilled_n": 0,
    "backfill_scanned": 0,
    "backfill_files_n": -1,
    "backfill_complete_n": -1,
    "backfill_gap_n": -1,
    "last_say_utc": "2026-01-01T00:00:00Z",
    "last_say_age_h": 1.5
  }
}
'@

# C: a snapshot path that does not exist (fail-loud control).
$missingSnap = Join-Path $sandbox 'no-such-snapshot.json'

function Invoke-Build([string]$outName, [string]$statePath, [string]$snapPath) {
    $outHtml = Join-Path $sandbox ($outName + '.html')
    $hist = Join-Path $sandbox ($outName + '.jsonl')
    $text = ''
    if ([string]::IsNullOrEmpty($snapPath)) {
        $text = (& powershell -NoProfile -ExecutionPolicy Bypass -File $builder `
                -StatePath $statePath -OutPath $outHtml -HistoryPath $hist -SiteSkip) -join "`n"
    } else {
        $text = (& powershell -NoProfile -ExecutionPolicy Bypass -File $builder `
                -SnapPath $snapPath -StatePath $statePath -OutPath $outHtml -HistoryPath $hist -SiteSkip) -join "`n"
    }
    $code = $LASTEXITCODE
    $html = ''
    if (Test-Path -LiteralPath $outHtml) { $html = [IO.File]::ReadAllText($outHtml) }
    return [pscustomobject]@{ log = $text; html = $html; code = $code; out = $outHtml }
}

$A = Invoke-Build 'panelA' $stateA ''
$B = Invoke-Build 'panelB' $stateB ''
$C = Invoke-Build 'panelC' $stateA $missingSnap

$pass = 0
$fail = 0
function Check([string]$name, [bool]$cond) {
    if ($cond) { Write-Output ('  PASS ' + $name); $script:pass++ }
    else { Write-Output ('  FAIL ' + $name); $script:fail++ }
}

# --- A: the missing reading ships as JSON null, the build survives ---------
Check 'A: build exits 0 with no resident reading' ($A.code -eq 0)
Check 'A: no FAIL line for the null reading' (-not ($A.log -match 'FAIL: residents_meta'))
Check 'A: summary still printed' ($A.log -match 'PANEL OK')
Check 'A: machine face says no readings' ($A.log -match 'PANEL RESIDENTS: model=none[^\r\n]*no readings in world state')
Check 'A: page ships RESIDENTS = null' ($A.html -match 'const RESIDENTS = null;')
Check 'A: page keeps the roster face alive' ($A.html -match 'const ROSTER = ')
Check 'A: no unrendered placeholder left' (-not ($A.html -match '__[A-Z]+_JSON__'))
Check 'A: no literal double-null text leaked' (-not ($A.html -match 'const RESIDENTS = nullnull'))
Check 'A: null is the JSON literal, not the string "null"' (-not ($A.html -match 'const RESIDENTS = "null"'))

# --- B: a real reading is untouched by the null branch ---------------------
Check 'B: build exits 0 with a reading' ($B.code -eq 0)
Check 'B: page ships RESIDENTS = object' ($B.html -match 'const RESIDENTS = \{')
Check 'B: the reading is carried verbatim' ($B.html.Contains('"speakers_n":2') -and $B.html.Contains('"model":"fixture-model"'))
Check 'B: null never leaked into a populated face' (-not ($B.html -match 'const RESIDENTS = null;'))
Check 'B: machine face names the model' ($B.log -match 'PANEL RESIDENTS: model=fixture-model')

# --- C: fail-loud is not weakened for REQUIRED inputs ----------------------
Check 'C: missing snapshot still fails' ($C.code -ne 0)
Check 'C: failure names the input' (($C.log -match 'FAIL: .*missing') -and $C.log.Contains('no-such-snapshot.json'))
Check 'C: target left untouched on failure' (-not (Test-Path -LiteralPath $C.out))

# --- source contract ------------------------------------------------------
$src = [IO.File]::ReadAllText($builder, [Text.Encoding]::UTF8)
Check 'source: null is returned before ConvertTo-Json' ($src -match "if \(\`$null -eq \`$Obj\) \{ return 'null' \}")
Check 'source: ConvertTo-Json guard still fails loud' ($src -match 're-serialize returned empty')
# Scope the ASCII check to the function this round touched: the builder carries
# older CJK in comments elsewhere (49 bytes), so a whole-file check would be a
# false alarm rather than a contract.
$fnStart = $src.IndexOf('function To-JsLiteral')
$fnBody = ''
if ($fnStart -ge 0) {
    $fnEnd = $src.IndexOf("`n}", $fnStart)
    if ($fnEnd -gt $fnStart) { $fnBody = $src.Substring($fnStart, $fnEnd - $fnStart) }
}
Check 'source: To-JsLiteral body is ASCII-only' (($fnBody -ne '') -and (([regex]::Matches($fnBody, '[^\x00-\x7F]')).Count -eq 0))

try { Remove-Item -LiteralPath $sandbox -Recurse -Force } catch { }

Write-Output ('RESULT: pass=' + $pass + ' fail=' + $fail)
if ($fail -gt 0) { exit 2 }
exit 0