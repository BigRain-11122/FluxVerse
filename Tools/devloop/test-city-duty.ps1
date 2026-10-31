# test-city-duty.ps1 - sandbox proof for the duty-orders rows (queue main#50)
# --------------------------------------------------------------------------
# The panel could say what the city looks like and whether it was built, but not
# "what did the group's decision rounds order US to do, and when is it due".
# Those orders live as table rows in <group>\docs\decisions.md. The builder now
# parses them read-only into DUTY.
#
# This sandbox runs the REAL builder against three fixture decision files:
#   A) one open order naming us, far-future deadline -> duty=1, no late
#   B) file absent                                   -> duty=missing (not "zero duty")
#   C) the four traps that made the first draft lie  -> see the fixture comments
# Every build writes to a temp output so the live panel and history are untouched.
# ASCII-only law: no CJK in this file - fixtures build their CJK row text from
# the UTF-8 basic plane through [char] codepoints is NOT needed here: the owner
# token file carries the Chinese, this script only uses the ASCII token.
#
# NOTE: fixture C's "other company" rows are the important half. The first draft
# matched FluxVerse ANYWHERE in a row and shipped four rows of other companies'
# work as our pending orders (r709 live measurement: matched=20, open=8, 4 bogus
# "overdue"). A test that only covers the happy path would have passed that bug.

$ErrorActionPreference = 'Stop'
$builder = Join-Path $PSScriptRoot 'build-city-panel.ps1'
if (-not (Test-Path -LiteralPath $builder)) { Write-Output 'setup FAIL: builder missing'; exit 1 }

$repoDir = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$snap = Join-Path $repoDir 'world-public\city-snapshot.json'
$face = Join-Path $repoDir 'state\status-face.json'
foreach ($p in @($snap, $face)) {
    if (-not (Test-Path -LiteralPath $p)) { Write-Output ('setup FAIL: input missing ' + $p); exit 1 }
}

$sandbox = Join-Path ([System.IO.Path]::GetTempPath()) ('fv-duty-' + $PID)
if (Test-Path -LiteralPath $sandbox) { Remove-Item -LiteralPath $sandbox -Recurse -Force }
New-Item -ItemType Directory -Path $sandbox -Force | Out-Null

function Write-TextFile([string]$path, [string]$body) {
    $utf8 = New-Object System.Text.UTF8Encoding($false)
    [IO.File]::WriteAllText($path, $body, $utf8)
}

$hdr = @"
# fixture decisions

| date | problem | source | basis | decision | grade | status |
|---|---|---|---|---|---|---|
"@

# --- A) one open order, future deadline -------------------------------------
$decA = Join-Path $sandbox 'decA.md'
Write-TextFile $decA ($hdr + "`r`n" +
"| 2026-10-28 | D-20261028-90 fixture alpha order | sandbox | basis text | 1) owner=@FluxVerse does the thing; 2) acceptance = one row | T2 | dispatched(12-31 00:00) |`r`n")

# --- B) absent file ---------------------------------------------------------
$decB = Join-Path $sandbox 'decB-missing.md'

# --- C) the lying cases -----------------------------------------------------
# row 1: we appear only in the BASIS column (evidence about us, not an order to us)
# row 2: relative "24h" window anchored on the row date (future -> not late)
# row 3: an already executed order is not work
# row 4: batch dispatched to the four companies, "10-25 24:00" = end of that day
# row 5: date-only window ("visited 2026-10-23"), no HH:mm at all
$decC = Join-Path $sandbox 'decC.md'
# The batch token (e.g. the second token in duty-owners.json) is Chinese and lives in the UTF-8 owner file -
# this script stays ASCII and injects it.
$tokFile = Join-Path $PSScriptRoot 'duty-owners.json'
$batchTok = ''
try {
    $tj = ConvertFrom-Json ([IO.File]::ReadAllText($tokFile, [Text.Encoding]::UTF8))
    if (@($tj.tokens).Count -gt 1) { $batchTok = [string]@($tj.tokens)[1] }
} catch { }
if ([string]::IsNullOrEmpty($batchTok)) { Write-Output 'setup FAIL: batch owner token missing'; exit 1 }
Write-TextFile $decC ($hdr + "`r`n" +
"| 2026-10-26 | D-20261026-91 other company work | sandbox | FluxVerse measured 12 rows | 1) owner=@HQ fixes it | T2 | dispatched(10-26 12:00) |`r`n" +
"| 2026-12-01 | D-20261201-01 relative window order | sandbox | basis | 1) owner=@FluxVerse replies within 24h | T2 | dispatched(@FluxVerse 24h) |`r`n" +
"| 2026-10-27 | D-20261027-92 already closed order | sandbox | basis | 1) owner=@FluxVerse | T2 | executed(this batch) |`r`n" +
"| 2026-10-24 | D-20261024-93 batch of companies | sandbox | basis | 1) each company self-checks | T2 | dispatched(" + $batchTok + "/10-25 24:00/fail=night) |`r`n" +
"| 2026-10-20 | D-20261020-94 date-only window | sandbox | basis | 1) owner=@FluxVerse reply | T2 | dispatched(visit 2026-10-23 window) |`r`n")

# --- D) a later row parks an earlier order ----------------------------------
# The parked row still reads "dispatched" on its own line, so without the
# suspension pre-pass the card bills an order the ledger already suspended (live
# case r709: D-20261020-05 shown 133h overdue although D-20261024-07 parked it).
$decD = Join-Path $sandbox 'decD.md'
Write-TextFile $decD ($hdr + "`r`n" +
"| 2026-10-20 | D-20261020-96 parked order | sandbox | basis | 1) owner=@FluxVerse | T2 | dispatched(10-21 00:00) |`r`n" +
"| 2026-10-22 | D-20261022-01 suspension batch | sandbox | basis | 1) D-20261020-96 goes back to the parking lot, no violation counted | T2 | suspended(waiting for word) |`r`n")

$results = @{}
foreach ($k in @('A', 'B', 'C', 'D')) {
    $dec = (Get-Variable ('dec' + $k)).Value
    $outHtml = Join-Path $sandbox ('panel-' + $k + '.html')
    $hist = Join-Path $sandbox ('hist-' + $k + '.jsonl')
    $log = (& powershell -NoProfile -ExecutionPolicy Bypass -File $builder `
            -ProofRoot $repoDir -DecisionsPath $dec -OutPath $outHtml -HistoryPath $hist) -join "`n"
    $html = ''
    if (Test-Path -LiteralPath $outHtml) { $html = [IO.File]::ReadAllText($outHtml) }
    $results[$k] = [pscustomobject]@{ log = $log; html = $html }
}

# --- E/F/G/H) archive duty stamp (queue main#59) ----------------------------
# The maintenance row must read the archive duty's OWN day stamp, never the tick
# log: a missing stamp is "not run today" (not "zero backlog"), an older stamp
# still reports the backlog it measured, and a pre-remain= stamp reports
# "not recorded" instead of a fake zero.
$todayStr = (Get-Date).ToString('yyyyMMdd')
$ydayStr = (Get-Date).AddDays(-1).ToString('yyyyMMdd')

$stampE = Join-Path $sandbox 'arch-today.txt'
Set-Content -LiteralPath $stampE -Value ($todayStr + ' remain=7') -Encoding ASCII
$stampF = Join-Path $sandbox 'arch-yday.txt'
Set-Content -LiteralPath $stampF -Value ($ydayStr + ' remain=3') -Encoding ASCII
$stampG = Join-Path $sandbox 'arch-today-plain.txt'
Set-Content -LiteralPath $stampG -Value $todayStr -Encoding ASCII
$stampH = Join-Path $sandbox 'arch-missing.txt'

foreach ($k in @('E', 'F', 'G', 'H')) {
    $st = (Get-Variable ('stamp' + $k)).Value
    $outHtml = Join-Path $sandbox ('panel-' + $k + '.html')
    $hist = Join-Path $sandbox ('hist-' + $k + '.jsonl')
    $log = (& powershell -NoProfile -ExecutionPolicy Bypass -File $builder `
            -ProofRoot $repoDir -DecisionsPath $decA -ArchiveStatePath $st `
            -OutPath $outHtml -HistoryPath $hist) -join "`n"
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

$A = $results['A']; $B = $results['B']; $C = $results['C']; $D = $results['D']
$E = $results['E']; $F = $results['F']; $G = $results['G']; $H = $results['H']

Check 'A: builder reported PANEL OK' ($A.log -match 'PANEL OK')
Check 'A: exactly one open order' ($A.log -match 'duty=1(?!\d)')
Check 'A: nothing late' ($A.log -match 'duty_late=0(?!\d)')
Check 'A: order id shipped into the page' ($A.html.Contains('D-20261028-90'))
Check 'A: deadline shipped as an ISO stamp' ($A.html.Contains('due_utc'))

Check 'B: builder still builds (fail-soft)' ($B.log -match 'PANEL OK')
Check 'B: absent file reads as missing, not as zero orders' ($B.log -match 'duty=missing')
Check 'B: page carries exists=false' ($B.html.Contains('"exists":false'))

Check 'C: only owner-bearing open rows count (3 of 5)' ($C.log -match 'duty=3(?!\d)')
Check 'C: basis-only mention rejected, its id never ships' (-not $C.html.Contains('D-20261026-91'))
Check 'C: executed order rejected' (-not $C.html.Contains('D-20261027-92'))
Check 'C: four-company batch accepted' ($C.html.Contains('D-20261024-93'))
Check 'C: date-only window accepted' ($C.html.Contains('D-20261020-94'))
Check 'C: relative 24h window accepted' ($C.html.Contains('D-20261201-01'))
Check 'C: end-of-day 24:00 parsed, so that order counts late' ($C.log -match 'duty_late=2(?!\d)')
Check 'C: relative window did NOT slide with build time' ($C.html.Contains('"due_txt":"2026-12-01 + 24h"'))
Check 'C: scanned counter counts table rows' ($C.log -match 'duty_scanned=5(?!\d)')

Check 'D: suspended order is not billed as pending' ($D.log -match 'duty=0(?!\d)')
Check 'D: suspended order counts as nothing late' ($D.log -match 'duty_late=0(?!\d)')
Check 'D: suspended id never reaches the page' (-not $D.html.Contains('D-20261020-96'))

Check 'E: today stamp reads as ran-today' ($E.log -match 'arch=today(?!\w)')
Check 'E: backlog number comes from the stamp' ($E.log -match 'arch_remain=7(?!\d)')
Check 'E: stamp and backlog reach the page' ($E.html.Contains('"stamp":"' + $todayStr + '"') -and $E.html.Contains('"remain":7'))
Check 'E: maintenance row exists in the page' ($E.html.Contains('id="f-maint"'))
Check 'E: ARCH placeholder is rendered, never shipped raw' (-not $E.html.Contains('__ARCH_JSON__'))

Check 'F: yesterday stamp reads as stale' ($F.log -match 'arch=stale(?!\w)')
Check 'F: stale stamp keeps its own backlog figure' ($F.log -match 'arch_remain=3(?!\d)')
Check 'F: page carries the stale day for the hint line' ($F.html.Contains('"stamp":"' + $ydayStr + '"'))

Check 'G: stamp without remain= is not a fake zero' ($G.log -match 'arch=today(?!\w)' -and $G.log -match 'arch_remain=-1(?!\d)')

Check 'H: missing stamp reads as missing, not as zero backlog' ($H.log -match 'arch=missing(?!\w)')
Check 'H: missing stamp ships exists=false for that key' ($H.html.Contains('"stamp":""'))

Check 'no fixture crashes a build' ((@($A.log, $B.log, $C.log, $D.log, $E.log, $F.log, $G.log, $H.log) | Where-Object { $_ -match 'FAIL:' }).Count -eq 0)

try { Remove-Item -LiteralPath $sandbox -Recurse -Force } catch { }

Write-Output ('RESULT: pass=' + $pass + ' fail=' + $fail)
if ($fail -gt 0) { exit 2 }
exit 0