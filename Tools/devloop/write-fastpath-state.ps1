# write-fastpath-state.ps1 - DevLoop fastpath state writer (enforcement piece, T-FV-116 -> v1.1 T-FV-117)
# ---------------------------------------------------------------------------
# Root cure for state-file write-side breakage (r194 lost 2 keys; r95 write law
# recurred). LAW (mandate v2.1): every wrap-up state write goes through this
# script; hand-writing the state file is FORBIDDEN (TECH section-9 r196 row).
#
# v1.1 (r197, T-FV-117): added -OrdersSha12 (KEEP same law) and the state file
# grew from 3 to 4 lines. The 7th fastpath check (orders.md SHA12 vs
# orders_sha12) closes the orders-only-command blind spot: CEO orders landing
# in docs/orders.md but never in evolution-ledger.md were structurally
# invisible to check-3 and the sentinels (r173: five missed rounds + 12h
# delay on the 00:10 art order).
#
# State file format: exactly 4 ASCII lines, uppercase hex 12 (SHA256 first-12):
#   tech_sha12=<HEX12>      = TECH.md (section-9 board authority face)
#   ledger_sha12=<HEX12>    = cph4/evolution-ledger.md
#   dec_sha12=<HEX12>       = docs/decisions.md
#   orders_sha12=<HEX12>    = docs/orders.md (CEO order ledger)
#
# Params (all optional by binding, mandatory by validation - unattended law:
# missing input must fail loud, never prompt and hang the loop):
#   -TechSha12   <12-hex> or KEEP (KEEP = reuse value already in state file;
#                 carries the v2.0 continuation-wake law and the v2.1 baton
#                 law: no-commit full rounds keep old tech when section-9
#                 still has open claimable rows. KEEP fails loud on a
#                 missing/corrupt state file or a missing tech line).
#   -LedgerSha12 <12-hex>   required
#   -DecSha12    <12-hex>   required
#   -OrdersSha12 <12-hex> or KEEP (KEEP same law as tech, kept for symmetry.
#                 In practice always pass the live hash: this repo NEVER
#                 writes the group orders.md, so there is no self-signal to
#                 suppress - a mismatch can only mean a new group order).
#   -StatePath   optional override (sandbox / production smoke). Default:
#                 <repo>\logs\devloop-fastpath-state.txt (self-located).
#
# v1.2 (r737, main#33): LIVE-CHECK. Until now the writer trusted whatever
# SHA12 the caller handed it. r693 measured the mirror path D:\FluxGroup
# handing four WRONG values in one round; a wrong value written here is worse
# than no value: the next round's c3/c4/c6/c7 compare state against disk,
# find a mismatch and fire a fake FULL-ROUND forever (or, worse, match by
# accident and silence a real change). Every explicit 12-hex input is now
# compared against the SHA256 of the LIVE file before anything touches disk:
#   tech   = <repo>\TECH.md
#   ledger = <live group>\cph4\evolution-ledger.md
#   dec    = <live group>\docs\decisions.md
#   orders = <live group>\docs\orders.md
# "live group" comes from resolve-group-root.ps1 (same resolver the seven-
# check judge uses, so writer and judge can never disagree about which tree
# is authoritative). KEEP is exempt on purpose: the continuation-wake / baton
# laws reuse an OLD value deliberately, and that old value is by definition
# not the live hash. A missing live file fails loud (unattended law: never
# write a signal we cannot verify). -NoLiveCheck exists for sandbox drills
# only; no production round may pass it.
#
# Write path: line list built per-line via List.Add (r95 write law - no @()
# comma-position concat), atomic .new then Move (r98 pattern), full read-back
# assertion of all 4 keys after BOTH the .new write and the move into place.
# Any failure prints "FAIL: ..." and exits 1; target file is never half-written
# (validation happens before any disk write, .new is removed on failure).
#
# ASCII-only body (PS5.1 GBK law). No auto-variable locals ($pid family, r164).
# ---------------------------------------------------------------------------

param(
    [string]$TechSha12 = '',
    [string]$LedgerSha12 = '',
    [string]$DecSha12 = '',
    [string]$OrdersSha12 = '',
    [string]$StatePath = '',
    [string]$RepoRoot = '',
    [string]$GroupRoot = '',
    [string]$TechPath = '',
    [string]$LedgerPath = '',
    [string]$DecPath = '',
    [string]$OrdersPath = '',
    [switch]$NoLiveCheck
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

# --- load existing lines once when any KEEP is requested ---
$oldLines = $null
if (($TechSha12 -eq 'KEEP') -or ($OrdersSha12 -eq 'KEEP')) {
    if (-not (Test-Path -LiteralPath $StatePath)) { Fail ('KEEP requested but state file missing: ' + $StatePath) }
    try { $oldLines = [IO.File]::ReadAllLines($StatePath) }
    catch { Fail ('KEEP read failed: ' + $_.Exception.Message) }
}

function Get-ExistingSha
{
    param([string[]]$Lines, [string]$Key)
    if ($null -eq $Lines) { return '' }
    foreach ($ln in $Lines) {
        $m = [regex]::Match($ln, '^' + $Key + '=([0-9A-Fa-f]{12})\s*$')
        if ($m.Success) { return $m.Groups[1].Value }
    }
    return ''
}

# --- validate inputs (fail-loud; unattended loop: never prompt) ---
$techVal = ''
if ($TechSha12 -eq 'KEEP') {
    $found = Get-ExistingSha -Lines $oldLines -Key 'tech_sha12'
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

$ordVal = ''
if ($OrdersSha12 -eq 'KEEP') {
    $found = Get-ExistingSha -Lines $oldLines -Key 'orders_sha12'
    if ([string]::IsNullOrEmpty($found)) { Fail ('KEEP requested but no valid orders_sha12 line in: ' + $StatePath) }
    $ordVal = $found.ToUpper()
} elseif (Test-ShaHex $OrdersSha12) {
    $ordVal = $OrdersSha12.ToUpper()
} else {
    Fail ('bad -OrdersSha12 (need 12-hex or KEEP): [' + $OrdersSha12 + ']')
}

# --- v1.2 live check: every explicit input must equal the LIVE file hash ---
# Resolver and judge share one notion of "live group" (resolve-group-root.ps1)
# so a mirror path can never inject a stale-but-plausible value here.
function Get-LiveSha12
{
    param([string]$Path)
    if ([string]::IsNullOrEmpty($Path)) { return '' }
    if (-not (Test-Path -LiteralPath $Path)) { return '' }
    try { return (Get-FileHash -LiteralPath $Path -Algorithm SHA256).Hash.Substring(0,12).ToUpper() }
    catch { return '' }
}

$liveChecked = 'off'
if (-not $NoLiveCheck) {
    $liveChecked = 'on'
    if ([string]::IsNullOrEmpty($RepoRoot)) {
        $here = Split-Path -Parent $PSScriptRoot
        $RepoRoot = Split-Path -Parent $here
    }
    if ([string]::IsNullOrEmpty($GroupRoot)) {
        $upTwo = Split-Path -Parent (Split-Path -Parent $RepoRoot)
        $resolver = Join-Path $PSScriptRoot 'resolve-group-root.ps1'
        if (-not (Test-Path -LiteralPath $resolver)) { Fail ('live check: resolver missing: ' + $resolver) }
        . $resolver
        $GroupRoot = Resolve-GroupRoot -RepoRoot $RepoRoot -LegacyRoot $upTwo
    }
    if ([string]::IsNullOrEmpty($TechPath)) { $TechPath = Join-Path $RepoRoot 'TECH.md' }
    if ([string]::IsNullOrEmpty($LedgerPath)) { $LedgerPath = Join-Path $GroupRoot 'cph4\evolution-ledger.md' }
    if ([string]::IsNullOrEmpty($DecPath)) { $DecPath = Join-Path $GroupRoot 'docs\decisions.md' }
    if ([string]::IsNullOrEmpty($OrdersPath)) { $OrdersPath = Join-Path $GroupRoot 'docs\orders.md' }

    # KEEP is deliberately old (continuation-wake v2.0 / baton v2.1 laws):
    # comparing it to the live file would reject the one case it exists for.
    if ($TechSha12 -ne 'KEEP') {
        $liveTech = Get-LiveSha12 -Path $TechPath
        if ([string]::IsNullOrEmpty($liveTech)) { Fail ('live check: tech file missing or unreadable: ' + $TechPath) }
        if ($liveTech -ne $techVal) { Fail ('live check: tech given=' + $techVal + ' live=' + $liveTech + ' (' + $TechPath + ')') }
    }
    $liveLed = Get-LiveSha12 -Path $LedgerPath
    if ([string]::IsNullOrEmpty($liveLed)) { Fail ('live check: ledger file missing or unreadable: ' + $LedgerPath) }
    if ($liveLed -ne $ledVal) { Fail ('live check: ledger given=' + $ledVal + ' live=' + $liveLed + ' (' + $LedgerPath + ')') }

    $liveDec = Get-LiveSha12 -Path $DecPath
    if ([string]::IsNullOrEmpty($liveDec)) { Fail ('live check: dec file missing or unreadable: ' + $DecPath) }
    if ($liveDec -ne $decVal) { Fail ('live check: dec given=' + $decVal + ' live=' + $liveDec + ' (' + $DecPath + ')') }

    if ($OrdersSha12 -ne 'KEEP') {
        $liveOrd = Get-LiveSha12 -Path $OrdersPath
        if ([string]::IsNullOrEmpty($liveOrd)) { Fail ('live check: orders file missing or unreadable: ' + $OrdersPath) }
        if ($liveOrd -ne $ordVal) { Fail ('live check: orders given=' + $ordVal + ' live=' + $liveOrd + ' (' + $OrdersPath + ')') }
    }
}

$stateDir = Split-Path -Parent $StatePath
if (-not (Test-Path -LiteralPath $stateDir)) { Fail ('state dir missing: ' + $stateDir) }

# --- build the 4 lines per-line (r95 write law: no @() comma-position concat) ---
$lines = New-Object System.Collections.Generic.List[string]
$lines.Add('tech_sha12=' + $techVal)
$lines.Add('ledger_sha12=' + $ledVal)
$lines.Add('dec_sha12=' + $decVal)
$lines.Add('orders_sha12=' + $ordVal)

function Assert-StateFile
{
    param([string]$Path, [string]$ExpTech, [string]$ExpLed, [string]$ExpDec, [string]$ExpOrd)
    if (-not (Test-Path -LiteralPath $Path)) { Fail ('assert: file missing: ' + $Path) }
    $back = $null
    try { $back = [IO.File]::ReadAllLines($Path) }
    catch { Fail ('assert: read failed: ' + $_.Exception.Message) }
    if ($back.Count -ne 4) { Fail ('assert: line count ' + $back.Count + ' != 4') }
    $seen = @{}
    for ($i = 0; $i -lt 4; $i++) {
        $bm = [regex]::Match($back[$i], '^(tech_sha12|ledger_sha12|dec_sha12|orders_sha12)=([0-9A-F]{12})$')
        if (-not $bm.Success) { Fail ('assert: bad line ' + $i + ': [' + $back[$i] + ']') }
        $bk = $bm.Groups[1].Value
        if ($seen.ContainsKey($bk)) { Fail ('assert: duplicate key: ' + $bk) }
        $seen[$bk] = $bm.Groups[2].Value
    }
    if (-not $seen.ContainsKey('tech_sha12')) { Fail 'assert: tech_sha12 key missing' }
    if (-not $seen.ContainsKey('ledger_sha12')) { Fail 'assert: ledger_sha12 key missing' }
    if (-not $seen.ContainsKey('dec_sha12')) { Fail 'assert: dec_sha12 key missing' }
    if (-not $seen.ContainsKey('orders_sha12')) { Fail 'assert: orders_sha12 key missing' }
    if ($seen['tech_sha12'] -ne $ExpTech) { Fail ('assert: tech ' + $seen['tech_sha12'] + ' != ' + $ExpTech) }
    if ($seen['ledger_sha12'] -ne $ExpLed) { Fail ('assert: ledger ' + $seen['ledger_sha12'] + ' != ' + $ExpLed) }
    if ($seen['dec_sha12'] -ne $ExpDec) { Fail ('assert: dec ' + $seen['dec_sha12'] + ' != ' + $ExpDec) }
    if ($seen['orders_sha12'] -ne $ExpOrd) { Fail ('assert: orders ' + $seen['orders_sha12'] + ' != ' + $ExpOrd) }
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
Assert-StateFile -Path $tmpPath -ExpTech $techVal -ExpLed $ledVal -ExpDec $decVal -ExpOrd $ordVal

try {
    Move-Item -LiteralPath $tmpPath -Destination $StatePath -Force
} catch {
    if (Test-Path -LiteralPath $tmpPath) { Remove-Item -LiteralPath $tmpPath -Force }
    Fail ('move into place failed: ' + $_.Exception.Message)
}
Assert-StateFile -Path $StatePath -ExpTech $techVal -ExpLed $ledVal -ExpDec $decVal -ExpOrd $ordVal

Write-Output ('STATE OK tech=' + $techVal + ' ledger=' + $ledVal + ' dec=' + $decVal + ' orders=' + $ordVal + ' lines=4 path=' + $StatePath)
exit 0
