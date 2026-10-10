# write-status-face.ps1 - DevLoop status-face writer (enforcement piece, r247)
# ---------------------------------------------------------------------------
# Root cure for the r246 hand-written-face future-ts red (tick 03:06 round:
#   statusface: gate: FAIL future-ts updated_utc=2026-10-10T19:12:40Z
# while the file mtime was 19:03:18Z - a ~9m22s-future stamp).
#
# LAW (r239 three-line law + r196 write-side enforcement family): the
# round-end status-face refresh goes through this script; hand-writing
# state/status-face.json is FORBIDDEN (TECH section-9 r247 row). Same cure
# class as write-fastpath-state.ps1 (r194/r196): a hand-written state file
# broke twice before it got an enforcement writer; the face broke once.
#
# Why a writer at all: an LLM-authored face stamps wall-clock times by
# guessing. This script makes the timestamp non-guessable:
#   - updated_utc is ALWAYS machine-stamped from the system clock. Any value
#     in the content file for this key is IGNORED - the hallucination vector
#     is structurally removed.
#   - artifact_utc keeps a provided value only when it parses as ISO AND is
#     not in the future (> now+60s -> replaced by the machine stamp).
#   - milestone_eta_utc must parse as ISO (exporter contract, r239: the three
#     ts fields are validated BY NAME).
#
# Content input: UTF-8 JSON data file with the six face keys (CJK allowed -
# the ASCII-only law applies to script bodies, not data files). Default:
# <repo>\logs\devloop-face-content.json (gitignored scratch). The session
# writes this file (UTF-8, no BOM) with updated_utc / artifact_utc left empty
# for machine stamping, then runs this script.
#
# Params (all optional by binding, mandatory by validation - unattended law):
#   -ContentPath <file>  optional override (sandbox)
#   -FacePath    <file>  optional override (sandbox)
#   -SimNowUtc   <iso>   sandbox clock override; empty = real clock.
#                        PRODUCTION RUNS MUST LEAVE IT EMPTY.
#
# Output: 'FACE OK ...' + exit 0, or 'FAIL: ...' + exit 1 (fail loud, never
# prompt). Write path: validate-then-write, .new file, full read-back
# assertion of all six keys, then Move into place (r98 pattern). Any failure
# leaves the target face untouched.
# ASCII-only body (PS5.1 GBK law). No auto-variable locals ($pid family, r164).
# ---------------------------------------------------------------------------

param(
    [string]$ContentPath = '',
    [string]$FacePath = '',
    [string]$SimNowUtc = ''
)

$ErrorActionPreference = 'Stop'

function Fail
{
    param([string]$Msg)
    Write-Output ('FAIL: ' + $Msg)
    exit 1
}

function Assert-Face
{
    param([string]$Path, [string]$ExpUpdated)
    if (-not (Test-Path -LiteralPath $Path)) { Fail ('assert: file missing: ' + $Path) }
    $back = ''
    try { $back = [IO.File]::ReadAllText($Path, [Text.Encoding]::UTF8) }
    catch { Fail ('assert: read failed: ' + $_.Exception.Message) }
    $bobj = $null
    try { $bobj = ConvertFrom-Json $back } catch { Fail 'assert: face not valid JSON after write' }
    if ($null -eq $bobj) { Fail 'assert: face parsed to null' }
    $seen = @{}
    foreach ($k in @('updated_utc','current_activity','artifact','artifact_utc','milestone','milestone_eta_utc')) {
        $v = ''
        try { $v = [string]$bobj.$k } catch { $v = '' }
        if ([string]::IsNullOrWhiteSpace($v)) { Fail ('assert: face key missing/empty: ' + $k) }
        $seen[$k] = $v
    }
    if ($seen.Count -ne 6) { Fail ('assert: face key count ' + $seen.Count + ' != 6') }
    if ($seen['updated_utc'] -ne $ExpUpdated) { Fail ('assert: updated_utc ' + $seen['updated_utc'] + ' != ' + $ExpUpdated) }
    foreach ($tk in @('updated_utc','artifact_utc','milestone_eta_utc')) {
        $d = [DateTimeOffset]::MinValue
        if (-not [DateTimeOffset]::TryParse($seen[$tk], [ref]$d)) { Fail ('assert: ts not ISO: ' + $tk + '=' + $seen[$tk]) }
    }
}

# --- resolve paths (self-locate: this script at <repo>\Tools\devloop\) ---
$toolsDir = Split-Path -Parent $PSScriptRoot
$repoDir  = Split-Path -Parent $toolsDir
if ([string]::IsNullOrEmpty($ContentPath)) { $ContentPath = Join-Path $repoDir 'logs\devloop-face-content.json' }
if ([string]::IsNullOrEmpty($FacePath))    { $FacePath    = Join-Path $repoDir 'state\status-face.json' }

# --- clock: sandbox override keeps fixtures deterministic (r240 same law) ---
$nowUtc = [DateTimeOffset]::MinValue
if ([string]::IsNullOrEmpty($SimNowUtc)) {
    $nowUtc = [DateTimeOffset]::UtcNow
} else {
    if (-not [DateTimeOffset]::TryParse($SimNowUtc, [ref]$nowUtc)) { Fail 'bad -SimNowUtc (need ISO)' }
}
$inv = [Globalization.CultureInfo]::InvariantCulture
$nowIso = $nowUtc.UtcDateTime.ToString('yyyy-MM-ddTHH:mm:ssZ', $inv)

# --- read content file (explicit UTF8, r53 law) ---
if (-not (Test-Path -LiteralPath $ContentPath)) { Fail ('content file missing: ' + $ContentPath) }
$raw = ''
try { $raw = [IO.File]::ReadAllText($ContentPath, [Text.Encoding]::UTF8) }
catch { Fail ('content read failed: ' + $_.Exception.Message) }
$obj = $null
try { $obj = ConvertFrom-Json $raw } catch { Fail ('content not valid JSON: ' + $_.Exception.Message) }
if ($null -eq $obj) { Fail 'content parsed to null' }

# --- required non-empty text keys ---
foreach ($k in @('current_activity','artifact','milestone')) {
    $v = ''
    try { $v = [string]$obj.$k } catch { $v = '' }
    if ([string]::IsNullOrWhiteSpace($v)) { Fail ('content key missing/empty: ' + $k) }
}

# --- milestone_eta_utc must parse (exporter three-ts by-name contract) ---
$eta = ''
try { $eta = [string]$obj.milestone_eta_utc } catch { $eta = '' }
$etaDto = [DateTimeOffset]::MinValue
if (-not [DateTimeOffset]::TryParse($eta, [ref]$etaDto)) { Fail ('milestone_eta_utc not ISO: [' + $eta + ']') }

# --- artifact_utc: keep only a valid past stamp; future -> machine stamp ---
$art = ''
try { $art = [string]$obj.artifact_utc } catch { $art = '' }
$artDto = [DateTimeOffset]::MinValue
$artOut  = $nowIso
$artNote = 'stamped-now'
if ((-not [string]::IsNullOrWhiteSpace($art)) -and [DateTimeOffset]::TryParse($art, [ref]$artDto)) {
    if ($artDto.UtcDateTime -le $nowUtc.UtcDateTime.AddSeconds(60)) {
        $artOut  = $artDto.UtcDateTime.ToString('yyyy-MM-ddTHH:mm:ssZ', $inv)
        $artNote = 'kept'
    } else {
        $artNote = 'future-replaced'
    }
}

# --- build face: updated_utc ALWAYS machine-stamped (root cure) ---
$faceObj = New-Object System.Collections.Specialized.OrderedDictionary
$faceObj.Add('updated_utc', $nowIso)
$faceObj.Add('current_activity', [string]$obj.current_activity)
$faceObj.Add('artifact', [string]$obj.artifact)
$faceObj.Add('artifact_utc', $artOut)
$faceObj.Add('milestone', [string]$obj.milestone)
$faceObj.Add('milestone_eta_utc', $eta)

$json = ConvertTo-Json $faceObj -Depth 4
if ([string]::IsNullOrEmpty($json)) { Fail 'ConvertTo-Json returned empty' }

# --- atomic write: .new, assert, move into place (r98 pattern) ---
$faceDir = Split-Path -Parent $FacePath
if (-not (Test-Path -LiteralPath $faceDir)) { Fail ('face dir missing: ' + $faceDir) }
$tmpPath = $FacePath + '.new'
if (Test-Path -LiteralPath $tmpPath) { Remove-Item -LiteralPath $tmpPath -Force }
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
try { [IO.File]::WriteAllText($tmpPath, $json, $utf8NoBom) } catch {
    if (Test-Path -LiteralPath $tmpPath) { Remove-Item -LiteralPath $tmpPath -Force }
    Fail ('write .new failed: ' + $_.Exception.Message)
}
Assert-Face -Path $tmpPath -ExpUpdated $nowIso

try { Move-Item -LiteralPath $tmpPath -Destination $FacePath -Force } catch {
    if (Test-Path -LiteralPath $tmpPath) { Remove-Item -LiteralPath $tmpPath -Force }
    Fail ('move into place failed: ' + $_.Exception.Message)
}
Assert-Face -Path $FacePath -ExpUpdated $nowIso

Write-Output ('FACE OK updated_utc=' + $nowIso + ' artifact_utc=' + $artOut + ' (' + $artNote + ') eta=' + $eta + ' path=' + $FacePath)
exit 0
