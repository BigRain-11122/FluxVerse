# write-fastpath-state.ps1 - DevLoop fastpath state writer (enforcement piece, T-FV-116)
# ---------------------------------------------------------------------------
# Root cure for state-file write-side breakage (r194 lost 2 keys; r95 write law
# recurred). LAW (mandate v2.1): every wrap-up state write goes through this
# script; hand-writing the state file is FORBIDDEN (TECH section-9 r196 row).
#
# State file format: exactly 3 ASCII lines, uppercase hex 12 (SHA256 first-12):
#   tech_sha12=<HEX12>      = TECH.md (section-9 board authority face)
#   ledger_sha12=<HEX12>    = cph4/evolution-ledger.md
#   dec_sha12=<HEX12>       = docs/decisions.md
#
# Params (all optional by binding, mandatory by validation - unattended law:
# missing input must fail loud, never prompt and hang the loop):
#   -TechSha12   <12-hex> or KEEP (KEEP = reuse value already in state file;
#                 carries the v2.0 continuation-wake law and the v2.1 baton
#                 law: no-commit full rounds keep old tech when section-9
#                 still has open claimable rows. KEEP fails loud on a
#                 missing/corrupt state file).
#   -LedgerSha12 <12-hex>   required
#   -DecSha12    <12-hex>   required
#   -StatePath   optional override (sandbox / production smoke). Default:
#                 <repo>\logs\devloop-fastpath-state.txt (self-located).
#
# Write path: line list built per-line via List.Add (r95 write law - no @()
# comma-position concat), atomic .new then Move (r98 pattern), full read-back
# assertion of all 3 keys after BOTH the .new write and the move into place.
# Any failure prints "FAIL: ..." and exits 1; target file is never half-written
# (validation happens before any disk write, .new is removed on failure).
#
# ASCII-only body (PS5.1 GBK law). No auto-variable locals ($pid family, r164).
# ---------------------------------------------------------------------------

param(
    [string]$TechSha12 = '',
    [string]$LedgerSha12 = '',
    [string]$DecSha12 = '',
    [string]$StatePath = ''
)

$ErrorActionPreference = 'Stop'

function Fail
{
    param([string]$Msg)
    Write-Output ('FAIL: ' + $Msg)
    exit 1
}

function Test-ShaHex
{
    param([string]$V)
    if ([string]::IsNullOrEmpty($V)) { return $false }
    return ([regex]::IsMatch($V, '^[0-9A-Fa-f]{12}$'))
}

# --- resolve target path (self-locate: this script at <repo>\Tools\devloop\) ---
if ([string]::IsNullOrEmpty($StatePath)) {
    $toolsDir = Split-Path -Parent $PSScriptRoot
    $repoDir  = Split-Path -Parent $toolsDir
    $StatePath = Join-Path $repoDir 'logs\devloop-fastpath-state.txt'
}

# --- validate inputs (fail-loud; unattended loop: never prompt) ---
$techVal = ''
if ($TechSha12 -eq 'KEEP') {
    if (-not (Test-Path -LiteralPath $StatePath)) { Fail ('KEEP requested but state file missing: ' + $StatePath) }
    $oldLines = $null
    try { $oldLines = [IO.File]::ReadAllLines($StatePath) }
    catch { Fail ('KEEP read failed: ' + $_.Exception.Message) }
    $found = ''
    foreach ($ol in $oldLines) {
        $om = [regex]::Match($ol, '^tech_sha12=([0-9A-Fa-f]{12})\s*$')
        if ($om.Success) { $found = $om.Groups[1].Value }
    }
    if ([string]::IsNullOrEmpty($found)) { Fail ('KEEP requested but no valid tech_sha12 line in: ' + $StatePath) }
    $techVal = $found.ToUpper()
} elseif (Test-ShaHex $TechSha12) {
    $techVal = $TechSha12.ToUpper()
} else {
    Fail ('bad -TechSha12 (need 12-hex or KEEP): [' + $TechSha12 + ']')
}

if (-not (Test-ShaHex $LedgerSha12)) { Fail ('bad -LedgerSha12 (need 12-hex): [' + $LedgerSha12 + ']') }
$ledVal = $LedgerSha12.ToUpper()

if (-not (Test-ShaHex $DecSha12)) { Fail ('bad -DecSha12 (need 12-hex): [' + $DecSha12 + ']') }
$decVal = $DecSha12.ToUpper()

$stateDir = Split-Path -Parent $StatePath
if (-not (Test-Path -LiteralPath $stateDir)) { Fail ('state dir missing: ' + $stateDir) }

# --- build the 3 lines per-line (r95 write law: no @() comma-position concat) ---
$lines = New-Object System.Collections.Generic.List[string]
$lines.Add('tech_sha12=' + $techVal)
$lines.Add('ledger_sha12=' + $ledVal)
$lines.Add('dec_sha12=' + $decVal)

function Assert-StateFile
{
    param([string]$Path, [string]$ExpTech, [string]$ExpLed, [string]$ExpDec)
    if (-not (Test-Path -LiteralPath $Path)) { Fail ('assert: file missing: ' + $Path) }
    $back = $null
    try { $back = [IO.File]::ReadAllLines($Path) }
    catch { Fail ('assert: read failed: ' + $_.Exception.Message) }
    if ($back.Count -ne 3) { Fail ('assert: line count ' + $back.Count + ' != 3') }
    $seen = @{}
    for ($i = 0; $i -lt 3; $i++) {
        $bm = [regex]::Match($back[$i], '^(tech_sha12|ledger_sha12|dec_sha12)=([0-9A-F]{12})$')
        if (-not $bm.Success) { Fail ('assert: bad line ' + $i + ': [' + $back[$i] + ']') }
        $bk = $bm.Groups[1].Value
        if ($seen.ContainsKey($bk)) { Fail ('assert: duplicate key: ' + $bk) }
        $seen[$bk] = $bm.Groups[2].Value
    }
    if (-not $seen.ContainsKey('tech_sha12')) { Fail 'assert: tech_sha12 key missing' }
    if (-not $seen.ContainsKey('ledger_sha12')) { Fail 'assert: ledger_sha12 key missing' }
    if (-not $seen.ContainsKey('dec_sha12')) { Fail 'assert: dec_sha12 key missing' }
    if ($seen['tech_sha12'] -ne $ExpTech) { Fail ('assert: tech ' + $seen['tech_sha12'] + ' != ' + $ExpTech) }
    if ($seen['ledger_sha12'] -ne $ExpLed) { Fail ('assert: ledger ' + $seen['ledger_sha12'] + ' != ' + $ExpLed) }
    if ($seen['dec_sha12'] -ne $ExpDec) { Fail ('assert: dec ' + $seen['dec_sha12'] + ' != ' + $ExpDec) }
}

# --- atomic-ish write: .new first, assert, then move into place (r98 pattern) ---
$tmpPath = $StatePath + '.new'
if (Test-Path -LiteralPath $tmpPath) { Remove-Item -LiteralPath $tmpPath -Force }
try {
    [IO.File]::WriteAllLines($tmpPath, $lines.ToArray())
} catch {
    if (Test-Path -LiteralPath $tmpPath) { Remove-Item -LiteralPath $tmpPath -Force }
    Fail ('write .new failed: ' + $_.Exception.Message)
}
Assert-StateFile -Path $tmpPath -ExpTech $techVal -ExpLed $ledVal -ExpDec $decVal

try {
    Move-Item -LiteralPath $tmpPath -Destination $StatePath -Force
} catch {
    if (Test-Path -LiteralPath $tmpPath) { Remove-Item -LiteralPath $tmpPath -Force }
    Fail ('move into place failed: ' + $_.Exception.Message)
}
Assert-StateFile -Path $StatePath -ExpTech $techVal -ExpLed $ledVal -ExpDec $decVal

Write-Output ('STATE OK tech=' + $techVal + ' ledger=' + $ledVal + ' dec=' + $decVal + ' lines=3 path=' + $StatePath)
exit 0
