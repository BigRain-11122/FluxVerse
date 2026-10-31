# test-fastpath-state-live.ps1 - sandbox proof for the live-hash guard (main#33)
# ---------------------------------------------------------------------------
# WHY (r693, measured): the writer used to accept whatever sha the caller
# handed it. Reading through the mirror path D:\FluxGroup produced four WRONG
# values in a single round; writing those into the state file makes the next
# round's c3/c4/c6/c7 fire (or, worse, agree by accident) forever.
#
# v1.2 of Tools\devloop\write-fastpath-state.ps1 now compares every explicit
# 12-hex input against the SHA256 of the LIVE file before touching disk:
#   tech   = <repo>\TECH.md
#   ledger = <live group>\cph4\evolution-ledger.md
#   dec    = <live group>\docs\decisions.md
#   orders = <live group>\docs\orders.md
# where "live group" is whatever resolve-group-root.ps1 picks (same resolver
# as the seven-check judge, so writer and judge cannot disagree).
#
# This sandbox runs the REAL writer against fixtures and asserts:
#   a) all four correct        -> exit 0, STATE OK, 4 lines written
#   b) each key wrong in turn  -> exit 1, names the key, file untouched
#   c) KEEP with stale value   -> exit 0 (deliberate carry-over exempt)
#   d) missing live file       -> exit 1, nothing written
#   e) production smoke        -> default resolution writes the live hashes
#                                 to a throwaway path, real state untouched
# ASCII-only law: no CJK in this file.
# ---------------------------------------------------------------------------

$ErrorActionPreference = 'Stop'
$writer = Join-Path $PSScriptRoot 'write-fastpath-state.ps1'
if (-not (Test-Path -LiteralPath $writer)) { Write-Output ('setup FAIL: missing ' + $writer); exit 1 }

$pass = 0
$fail = 0
function Check([string]$name, [bool]$cond) {
    if ($cond) { Write-Output ('  PASS ' + $name); $script:pass++ }
    else { Write-Output ('  FAIL ' + $name); $script:fail++ }
}

$utf8 = New-Object System.Text.UTF8Encoding($false)
$sbDir = Join-Path ([System.IO.Path]::GetTempPath()) ('fv-state-live-' + $PID)
if (Test-Path -LiteralPath $sbDir) { Remove-Item -LiteralPath $sbDir -Recurse -Force }
$null = New-Item -ItemType Directory -Path $sbDir

function Get-Sha12([string]$p) { return (Get-FileHash -LiteralPath $p -Algorithm SHA256).Hash.Substring(0,12).ToUpper() }
function Write-Fixture([string]$p, [string]$body) { [System.IO.File]::WriteAllText($p, $body, $utf8) }

function Invoke-Writer {
    param([string[]]$ArgList)
    $out = & powershell.exe -NoProfile -ExecutionPolicy Bypass -File $writer @ArgList
    return @{ code = $LASTEXITCODE; out = ($out -join ' | ') }
}

# ---------- fixtures ----------
$fTech = Join-Path $sbDir 'TECH.md'
$fLed  = Join-Path $sbDir 'evolution-ledger.md'
$fDec  = Join-Path $sbDir 'decisions.md'
$fOrd  = Join-Path $sbDir 'orders.md'
Write-Fixture $fTech '# tech fixture one'
Write-Fixture $fLed  '# ledger fixture one'
Write-Fixture $fDec  '# dec fixture one'
Write-Fixture $fOrd  '# orders fixture one'
$shaTech = Get-Sha12 $fTech
$shaLed  = Get-Sha12 $fLed
$shaDec  = Get-Sha12 $fDec
$shaOrd  = Get-Sha12 $fOrd

function ArgSet([string]$tech, [string]$led, [string]$dec, [string]$ord, [string]$st) {
    return @('-TechSha12', $tech, '-LedgerSha12', $led, '-DecSha12', $dec, '-OrdersSha12', $ord,
             '-TechPath', $fTech, '-LedgerPath', $fLed, '-DecPath', $fDec, '-OrdersPath', $fOrd,
             '-StatePath', $st)
}

# ---------- a) all four correct ----------
Write-Output '--- a) all correct ---'
$stA = Join-Path $sbDir 'a-state.txt'
$a = Invoke-Writer (ArgSet $shaTech $shaLed $shaDec $shaOrd $stA)
Check 'a: exit 0'                      ($a.code -eq 0)
Check 'a: STATE OK reported'           ($a.out -match 'STATE OK')
Check 'a: file written'                (Test-Path -LiteralPath $stA)
if (Test-Path -LiteralPath $stA) {
    $aLines = [System.IO.File]::ReadAllLines($stA)
    Check 'a: exactly 4 lines'         (@($aLines).Count -eq 4)
    Check 'a: tech line matches live'  ($aLines[0] -eq ('tech_sha12=' + $shaTech))
    Check 'a: ledger line matches'     ($aLines[1] -eq ('ledger_sha12=' + $shaLed))
    Check 'a: dec line matches'        ($aLines[2] -eq ('dec_sha12=' + $shaDec))
    Check 'a: orders line matches'     ($aLines[3] -eq ('orders_sha12=' + $shaOrd))
}
Check 'a: no .new leftover'            (-not (Test-Path -LiteralPath ($stA + '.new')))

# ---------- b) each key wrong in turn ----------
Write-Output '--- b) wrong hash per key ---'
$seedB = @(
    'tech_sha12=111111111111',
    'ledger_sha12=222222222222',
    'dec_sha12=333333333333',
    'orders_sha12=444444444444'
)
$bad = 'ABCDEF012345'
$cases = @(
    @{ name = 'tech';   args = $null },
    @{ name = 'ledger'; args = $null },
    @{ name = 'dec';    args = $null },
    @{ name = 'orders'; args = $null }
)
foreach ($c in $cases) {
    $st = Join-Path $sbDir ('b-' + $c.name + '-state.txt')
    [System.IO.File]::WriteAllLines($st, $seedB, $utf8)
    $before = [System.IO.File]::ReadAllBytes($st)
    $t = $script:shaTech; $l = $script:shaLed; $d = $script:shaDec; $o = $script:shaOrd
    switch ($c.name) {
        'tech'   { $t = $bad }
        'ledger' { $l = $bad }
        'dec'    { $d = $bad }
        'orders' { $o = $bad }
    }
    $r = Invoke-Writer (ArgSet $t $l $d $o $st)
    Check ('b-' + $c.name + ': exit != 0')              ($r.code -ne 0)
    Check ('b-' + $c.name + ': names the key')          ($r.out -match ('live check: ' + $c.name))
    $after = [System.IO.File]::ReadAllBytes($st)
    Check ('b-' + $c.name + ': state file untouched')   (-not (Compare-Object -ReferenceObject $before -DifferenceObject $after))
    Check ('b-' + $c.name + ': no .new leftover')       (-not (Test-Path -LiteralPath ($st + '.new')))
}

# ---------- c) KEEP exempts the live comparison ----------
Write-Output '--- c) KEEP is exempt ---'
$stC = Join-Path $sbDir 'c-state.txt'
[System.IO.File]::WriteAllLines($stC, $seedB, $utf8)
$c = Invoke-Writer (ArgSet 'KEEP' $shaLed $shaDec $shaOrd $stC)
Check 'c: exit 0 with stale KEEP tech'  ($c.code -eq 0)
if ($c.code -eq 0) {
    $cLines = [System.IO.File]::ReadAllLines($stC)
    Check 'c: KEEP kept the old tech'   ($cLines[0] -eq 'tech_sha12=111111111111')
    Check 'c: live ledger written'      ($cLines[1] -eq ('ledger_sha12=' + $shaLed))
}
$stC2 = Join-Path $sbDir 'c2-state.txt'
[System.IO.File]::WriteAllLines($stC2, $seedB, $utf8)
$c2 = Invoke-Writer (ArgSet $shaTech $shaLed $shaDec 'KEEP' $stC2)
Check 'c2: exit 0 with stale KEEP orders' ($c2.code -eq 0)
if ($c2.code -eq 0) {
    $c2Lines = [System.IO.File]::ReadAllLines($stC2)
    Check 'c2: KEEP kept the old orders' ($c2Lines[3] -eq 'orders_sha12=444444444444')
}

# ---------- d) missing live file ----------
Write-Output '--- d) missing live file ---'
$stD = Join-Path $sbDir 'd-state.txt'
$gone = Join-Path $sbDir 'does-not-exist.md'
$d = Invoke-Writer @('-TechSha12', $shaTech, '-LedgerSha12', $shaLed, '-DecSha12', $shaDec, '-OrdersSha12', $shaOrd,
                     '-TechPath', $gone, '-LedgerPath', $fLed, '-DecPath', $fDec, '-OrdersPath', $fOrd,
                     '-StatePath', $stD)
Check 'd: exit != 0'                   ($d.code -ne 0)
Check 'd: names tech file'             ($d.out -match 'live check: tech file missing')
Check 'd: nothing written'             (-not (Test-Path -LiteralPath $stD))
Check 'd: no .new leftover'            (-not (Test-Path -LiteralPath ($stD + '.new')))

# ---------- e) production smoke with default resolution ----------
Write-Output '--- e) production smoke (default resolver) ---'
$repoRoot = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$upTwo = Split-Path -Parent (Split-Path -Parent $repoRoot)
$resolver = Join-Path $PSScriptRoot 'resolve-group-root.ps1'
. $resolver
$groupRoot = Resolve-GroupRoot -RepoRoot $repoRoot -LegacyRoot $upTwo
$liveTech = Join-Path $repoRoot 'TECH.md'
$liveLed  = Join-Path $groupRoot 'cph4\evolution-ledger.md'
$liveDec  = Join-Path $groupRoot 'docs\decisions.md'
$liveOrd  = Join-Path $groupRoot 'docs\orders.md'
$liveOk = (Test-Path -LiteralPath $liveTech) -and (Test-Path -LiteralPath $liveLed) -and (Test-Path -LiteralPath $liveDec) -and (Test-Path -LiteralPath $liveOrd)
Check 'e: live files present'          $liveOk
if ($liveOk) {
    $tSha = Get-Sha12 $liveTech
    $lSha = Get-Sha12 $liveLed
    $dSha = Get-Sha12 $liveDec
    $oSha = Get-Sha12 $liveOrd
    $realState = Join-Path $repoRoot 'logs\devloop-fastpath-state.txt'
    $realBefore = $null
    if (Test-Path -LiteralPath $realState) { $realBefore = [System.IO.File]::ReadAllBytes($realState) }
    $stE = Join-Path $sbDir 'e-state.txt'
    $e = Invoke-Writer @('-TechSha12', $tSha, '-LedgerSha12', $lSha, '-DecSha12', $dSha, '-OrdersSha12', $oSha, '-StatePath', $stE)
    Check 'e: live values accepted'    ($e.code -eq 0)
    Check 'e: STATE OK'                ($e.out -match 'STATE OK')
    if (Test-Path -LiteralPath $stE) {
        $eLines = [System.IO.File]::ReadAllLines($stE)
        Check 'e: tech = live TECH.md'     ($eLines[0] -eq ('tech_sha12=' + $tSha))
        Check 'e: ledger = live ledger'    ($eLines[1] -eq ('ledger_sha12=' + $lSha))
    }
    $realAfter = $null
    if (Test-Path -LiteralPath $realState) { $realAfter = [System.IO.File]::ReadAllBytes($realState) }
    $same = ($null -eq $realBefore -and $null -eq $realAfter)
    if (-not $same -and $null -ne $realBefore -and $null -ne $realAfter) {
        $same = -not (Compare-Object -ReferenceObject $realBefore -DifferenceObject $realAfter)
    }
    Check 'e: real state file untouched' $same

    # stale-but-plausible value (mirror trap) must be rejected against live
    $mirrorTrap = $tSha
    if ($mirrorTrap -eq '000000000000') { $mirrorTrap = '111111111111' } else { $mirrorTrap = '000000000000' }
    $stE2 = Join-Path $sbDir 'e2-state.txt'
    $e2 = Invoke-Writer @('-TechSha12', $mirrorTrap, '-LedgerSha12', $lSha, '-DecSha12', $dSha, '-OrdersSha12', $oSha, '-StatePath', $stE2)
    Check 'e2: mirror-trap value rejected' ($e2.code -ne 0)
    Check 'e2: rejection names tech'       ($e2.out -match 'live check: tech')
    Check 'e2: nothing written'            (-not (Test-Path -LiteralPath $stE2))
}

Remove-Item -LiteralPath $sbDir -Recurse -Force -ErrorAction SilentlyContinue

Write-Output ''
Write-Output ('TOTAL pass=' + $pass + ' fail=' + $fail)
if ($fail -gt 0) { Write-Output 'VERDICT: FAIL'; exit 1 }
Write-Output 'VERDICT: PASS'
exit 0