# statusface-freshness.ps1 - DevLoop status-face freshness gate (r240)
# ---------------------------------------------------------------------------
# Executive Protocol v1.1-4 freshness line, self-reported by this repo
# (main queue #6 survey-first law: the inspection consumer stays untouched).
# WHY: state/status-face.json is the DevLoop single-writer status face
# (three-line law, r239); the DevLoop round-end duty refreshes it (runbook
# standing step). A face gone >24h stale = the DevLoop lane is silent -
# exactly the all-zero-commit empty-round verdict the protocol's 24h rule
# watches for. This gate makes the staleness mechanically visible with ZERO
# new contracts: one log line per tick round, and the stale line carries
# 'gate: FAIL', which the check-fastpath c1 red-scan pattern
# '(gate|probe).*FAIL' already counts (case-insensitive -match) - a stale
# face fires c1-red at the next round start (FULL-ROUND, fix-red-first).
# check-fastpath.ps1 and the fastpath-state contract are NOT modified.
#
# Output (exactly one line, ASCII, deterministic under -SimNowUtc):
#   statusface: fresh age_h=<n> updated_utc=<ts>
#   statusface: gate: FAIL age_h=<n> updated_utc=<ts> stale_h=<s>
#   statusface: gate: FAIL missing
#   statusface: gate: FAIL unparseable
#   statusface: gate: FAIL future-ts updated_utc=<ts>
# Exit 0 = fresh; 2 = stale/missing/unparseable/future (2 = needs-attention,
# same convention as check-fastpath FULL-ROUND). The tick caller logs the
# line and never propagates this exit into the round exit (fail-soft: the
# round's health stays the verify gate).
#
# Boundary law: the gate compares TotalHours > StaleHours (NOT the floored
# display value) - a 24.01h-old face FAILs even though age_h displays 24.
# A future timestamp (negative age) is a broken face: surfaced, never
# certified fresh (r163 fail-closed law).
# ASCII-only body (PS5.1 GBK law). No auto-variable locals ($pid family).
# ---------------------------------------------------------------------------

param(
    [string]$FacePath = '',
    [string]$SimNowUtc = '',
    [int]$StaleHours = 24
)

$ErrorActionPreference = 'Continue'

if ([string]::IsNullOrEmpty($FacePath)) {
    $repoRoot = Resolve-Path (Join-Path $PSScriptRoot '..\..')
    $FacePath = Join-Path $repoRoot 'state\status-face.json'
}

# now: sandbox clock override keeps fixture ages byte-deterministic
$nowUtc = [DateTimeOffset]::MinValue
if ([string]::IsNullOrEmpty($SimNowUtc)) {
    $nowUtc = [DateTimeOffset]::UtcNow
} else {
    if (-not [DateTimeOffset]::TryParse($SimNowUtc, [ref]$nowUtc)) {
        Write-Output 'statusface: gate: FAIL unparseable'
        exit 2
    }
}

if (-not (Test-Path -LiteralPath $FacePath)) {
    Write-Output 'statusface: gate: FAIL missing'
    exit 2
}

$raw = ''
try { $raw = [IO.File]::ReadAllText($FacePath) } catch {
    Write-Output 'statusface: gate: FAIL unparseable'
    exit 2
}

$ts = ''
try {
    $obj = ConvertFrom-Json $raw
    if ($null -ne $obj) { $ts = [string]$obj.updated_utc }
} catch {
    $ts = ''
}
if ([string]::IsNullOrEmpty($ts)) {
    Write-Output 'statusface: gate: FAIL unparseable'
    exit 2
}

$faceUtc = [DateTimeOffset]::MinValue
if (-not [DateTimeOffset]::TryParse($ts, [ref]$faceUtc)) {
    Write-Output 'statusface: gate: FAIL unparseable'
    exit 2
}

$ageTotal = ($nowUtc - $faceUtc).TotalHours
$ageH = [Math]::Floor($ageTotal)

if ($ageTotal -gt $StaleHours) {
    Write-Output ('statusface: gate: FAIL age_h=' + $ageH + ' updated_utc=' + $ts + ' stale_h=' + $StaleHours)
    exit 2
}
if ($ageTotal -lt 0) {
    Write-Output ('statusface: gate: FAIL future-ts updated_utc=' + $ts)
    exit 2
}
Write-Output ('statusface: fresh age_h=' + $ageH + ' updated_utc=' + $ts)
exit 0
