# test-verify-ps-suites.ps1 - sandbox proof for the r750 tick wiring (main#88)
# ---------------------------------------------------------------------------
# WHY: r748 gave the PowerShell write-side sandboxes one entry, r749 wired the
# queue census into the gate - but nothing ever ran the sandboxes. This proves
# the tick now DOES run them, and that it does so without paying for a child
# process on every 5-minute round:
#   1. fingerprint unchanged  -> no spawn, the last ticket is quoted as cached
#   2. fingerprint changed    -> runner runs once, ticket overwritten
#   3. a red run stays red-honest WITHOUT failing the gate (WARN, no FAIL word)
#   4. a hung runner is reported as `timeout`, never as a verdict
#   5. an unreadable runner / missing runner / off switch never silently reads
#      as "all green"
#
# Boundary: verify.ps1 is executed for real (read-only on world state); the
# sandboxes never touch the live ticket because every case points
# FLUXVERSE_PS_SUITES_TICKET at its own temp file, and the runner is a fixture.
# ASCII-only law: no CJK in this file (PS5.1 GBK trap).

$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
$verify = Join-Path $root 'perceptor\verify.ps1'
$module = Join-Path $PSScriptRoot 'ps-suites-tick.ps1'
foreach ($p in @($verify, $module)) {
    if (-not (Test-Path -LiteralPath $p)) { throw ('missing: ' + $p) }
}

$script:fails = 0
$script:checks = 0
function Check([string]$name, [bool]$ok, [string]$detail) {
    $script:checks++
    if ($ok) { Write-Output ('PASS ' + $name) }
    else { $script:fails++; Write-Output ('FAIL ' + $name + ' :: ' + $detail) }
}

$sandbox = Join-Path ([System.IO.Path]::GetTempPath()) ('fv-pssuites-' + $PID)
if (Test-Path -LiteralPath $sandbox) { Remove-Item -LiteralPath $sandbox -Recurse -Force }
New-Item -ItemType Directory -Path $sandbox -Force | Out-Null
$utf8 = New-Object System.Text.UTF8Encoding($false)
$ticket = Join-Path $sandbox 'ticket.json'

function New-Runner([string]$name, [string]$body) {
    $p = Join-Path $sandbox $name
    [System.IO.File]::WriteAllText($p, $body, $utf8)
    return $p
}

$runnerGreen = New-Runner 'runner-green.ps1' @'
Write-Output 'PASS  suite-a  exit=0  ALL PASS'
Write-Output 'PASS  suite-b  exit=0  ALL PASS'
Write-Output 'PS SUITES suites=2 assertions=10 counted=2 failing=0 parity=ok'
Write-Output 'PS SUITES VERDICT: ALL PASS'
exit 0
'@
$runnerRed = New-Runner 'runner-red.ps1' @'
Write-Output 'suite-a red: 1/3'
Write-Output 'PS SUITES suites=2 assertions=10 counted=2 failing=2 parity=FAIL'
exit 2
'@
$runnerSlow = New-Runner 'runner-slow.ps1' @'
Start-Sleep -Seconds 20
Write-Output 'PS SUITES suites=2 assertions=10 counted=2 failing=0 parity=ok'
exit 0
'@
$runnerNoise = New-Runner 'runner-noise.ps1' @'
Write-Output 'something went sideways'
exit 0
'@

function Clear-PsEnv {
    foreach ($k in @('FLUXVERSE_PS_SUITES', 'FLUXVERSE_PS_SUITES_RUNNER', 'FLUXVERSE_PS_SUITES_TICKET',
                     'FLUXVERSE_PS_SUITES_TIMEOUT', 'FLUXVERSE_PS_SUITES_FORCE')) {
        Remove-Item ('Env:\' + $k) -ErrorAction SilentlyContinue
    }
}

function Run-Verify {
    Clear-PsEnv
    $env:FLUXVERSE_PS_SUITES_TICKET = $ticket
    if ($script:runner) { $env:FLUXVERSE_PS_SUITES_RUNNER = $script:runner }
    if ($script:timeout) { $env:FLUXVERSE_PS_SUITES_TIMEOUT = [string]$script:timeout }
    if ($script:off) { $env:FLUXVERSE_PS_SUITES = 'off' }
    if ($script:force) { $env:FLUXVERSE_PS_SUITES_FORCE = '1' }
    $sw = New-Object System.Diagnostics.Stopwatch
    $sw.Start()
    $out = @(& $verify 2>&1 | ForEach-Object { [string]$_ })
    $sw.Stop()
    $code = $LASTEXITCODE
    Clear-PsEnv
    return [pscustomobject]@{ lines = $out; code = $code; ms = $sw.ElapsedMilliseconds }
}

# NOTE: always wrap in @() - a one-line result degenerates to a string and
# $x[0] would hand back a single character (r749 lesson, re-hit here).
function Get-PsLine($out) {
    return @($out.lines | Where-Object { $_ -match '^VERIFY (HEALTH|WARN): ps-suites:' })
}

# ---------- case a: green runner runs, ticket written ------------------------
$script:runner = $runnerGreen; $script:timeout = $null; $script:off = $false; $script:force = $false
Remove-Item -LiteralPath $ticket -Force -ErrorAction SilentlyContinue
$r1 = Run-Verify
$l1 = @(Get-PsLine $r1)
Check 'a1 exactly one ps-suites line' ($l1.Count -eq 1) ('count=' + $l1.Count)
Check 'a2 green is HEALTH' ("$($l1[0])" -like 'VERIFY HEALTH:*') "$($l1[0])"
Check 'a3 green quotes red=0 parity=ok' ("$($l1[0])" -match 'red=0' -and "$($l1[0])" -match 'parity=ok') "$($l1[0])"
Check 'a4 first run says ran=' ("$($l1[0])" -match 'ran=\d+ms') "$($l1[0])"
Check 'a5 verify still exits 0' ($r1.code -eq 0) ('exit=' + $r1.code)
Check 'a6 ticket written' (Test-Path -LiteralPath $ticket) $ticket
$tk = $null
try { $tk = [System.IO.File]::ReadAllText($ticket, [System.Text.Encoding]::UTF8) | ConvertFrom-Json } catch { $tk = $null }
Check 'a7 ticket is parseable json with a sha' ($null -ne $tk -and "$($tk.sha)" -match '^[0-9a-f]{12}$') ([string]$tk)

# ---------- case b: unchanged fingerprint = no spawn -------------------------
$r2 = Run-Verify
$l2 = @(Get-PsLine $r2)
Check 'b1 second run is HEALTH' ("$($l2[0])" -like 'VERIFY HEALTH:*') "$($l2[0])"
Check 'b2 second run quotes cached=, not ran=' ("$($l2[0])" -match 'cached=' -and "$($l2[0])" -notmatch 'ran=\d+ms') "$($l2[0])"
Check 'b3 cached run is fast (<3000ms total verify)' ($r2.ms -lt 3000) ('ms=' + $r2.ms)
Check 'b4 cached run did not rewrite the sha' ("$($l2[0])" -match ('sha=' + $tk.sha)) "$($l2[0])"

# ---------- case c: fingerprint is content addressed ------------------------
. $module
$fpDir = Join-Path $sandbox 'fp'
New-Item -ItemType Directory -Path $fpDir -Force | Out-Null
[System.IO.File]::WriteAllText((Join-Path $fpDir 'a.txt'), 'one', $utf8)
$fp1 = Get-PsSuitesFingerprint -RepoDir $fpDir -Paths @('a.txt')
[System.IO.File]::WriteAllText((Join-Path $fpDir 'a.txt'), 'two', $utf8)
$fp2 = Get-PsSuitesFingerprint -RepoDir $fpDir -Paths @('a.txt')
Check 'c1 fingerprint moves when a guarded file changes' ($fp1 -ne $fp2) ($fp1 + ' vs ' + $fp2)
$fp3 = Get-PsSuitesFingerprint -RepoDir $fpDir -Paths @('a.txt')
Check 'c2 fingerprint is stable across reads' ($fp2 -eq $fp3) ($fp2 + ' vs ' + $fp3)
$fpm = Get-PsSuitesFingerprint -RepoDir $fpDir -Paths @('missing.txt')
Check 'c3 missing file is recorded, not skipped' ($fpm -match '^[0-9a-f]{12}$') $fpm

# ---------- case d: red runner goes WARN, gate still exits 0 ----------------
# The ticket is content addressed, so a different runner alone would be a cache
# hit - the red case therefore forces a real run (same lever a sandbox owner has).
$script:runner = $runnerRed; $script:force = $true
$r3 = Run-Verify
$l3 = @(Get-PsLine $r3)
Check 'd1 red run is WARN' ("$($l3[0])" -like 'VERIFY WARN:*') "$($l3[0])"
Check 'd2 red run names red=2 parity=drift' ("$($l3[0])" -match 'red=2' -and "$($l3[0])" -match 'parity=drift') "$($l3[0])"
Check 'd3 red run tells you the re-run command' ("$($l3[0])" -match 'run-ps-suites\.ps1') "$($l3[0])"
Check 'd4 red run does not fail the gate' ($r3.code -eq 0) ('exit=' + $r3.code)
$script:force = $false
$r4 = Run-Verify
$l4 = @(Get-PsLine $r4)
Check 'd5 red result stays visible on the next tick (cached)' ("$($l4[0])" -like 'VERIFY WARN:*' -and "$($l4[0])" -match 'cached=') "$($l4[0])"

# ---------- case e: hung runner = timeout, never a verdict ------------------
$script:runner = $runnerSlow; $script:timeout = 2; $script:force = $true
$r5 = Run-Verify
$l5 = @(Get-PsLine $r5)
Check 'e1 hung runner is WARN' ("$($l5[0])" -like 'VERIFY WARN:*') "$($l5[0])"
Check 'e2 hung runner says timeout' ("$($l5[0])" -match 'did not finish in 2s') "$($l5[0])"
Check 'e3 timeout never claims parity=ok' (-not ("$($l5[0])" -match 'parity=ok')) "$($l5[0])"
Check 'e4 timeout does not fail the gate' ($r5.code -eq 0) ('exit=' + $r5.code)
$script:timeout = $null

# ---------- case f: unreadable + missing runner ----------------------------
$script:runner = $runnerNoise
Remove-Item -LiteralPath $ticket -Force -ErrorAction SilentlyContinue
$r6 = Run-Verify
$l6 = @(Get-PsLine $r6)
Check 'f1 runner without a summary line is WARN' ("$($l6[0])" -like 'VERIFY WARN:*') "$($l6[0])"
Check 'f2 it says the summary line was not found' ("$($l6[0])" -match 'summary line not found') "$($l6[0])"
Check 'f3 it quotes the last output for humans' ("$($l6[0])" -match 'went sideways') "$($l6[0])"

$script:runner = (Join-Path $sandbox 'does-not-exist.ps1')
$r7 = Run-Verify
$l7 = @(Get-PsLine $r7)
Check 'f4 missing runner is WARN' ("$($l7[0])" -like 'VERIFY WARN:*') "$($l7[0])"
Check 'f5 missing runner says runner not found' ("$($l7[0])" -match 'runner not found') "$($l7[0])"
$script:runner = $null

# ---------- case g: off switch is explicit --------------------------------
$script:off = $true
$r8 = Run-Verify
$l8 = @(Get-PsLine $r8)
Check 'g1 off switch is HEALTH and says disabled' ("$($l8[0])" -match 'disabled by FLUXVERSE_PS_SUITES=off') "$($l8[0])"
$script:off = $false

# ---------- case h: no line may carry the red-scan word -------------------
$allLines = @()
foreach ($r in @($r1, $r2, $r3, $r4, $r5, $r6, $r7, $r8)) { $allLines += @(Get-PsLine $r) }
$allLines = @($allLines | Where-Object { "$_" -ne '' })
Check 'h1 ps-suites lines exist to judge' ($allLines.Count -ge 8) ('count=' + $allLines.Count)
# Case-insensitive on purpose: the census sandboxes rule out the bare token in
$bad = @($allLines | Where-Object { "$_" -match '(?i)fail' })
Check 'h2 no ps-suites line leaks the red token, any case' ($bad.Count -eq 0) (($bad -join ' | '))
$gateWord = @($allLines | Where-Object { "$_" -match '(?i)gate.*FAIL' })
Check 'h3 no ps-suites line matches the c1 red-scan shape' ($gateWord.Count -eq 0) (($gateWord -join ' | '))
$ascii = 0
foreach ($ln in $allLines) { foreach ($ch in $ln.ToCharArray()) { if ([int][char]$ch -gt 127) { $ascii++ } } }
Check 'h4 ps-suites lines are ascii-only' ($ascii -eq 0) ('non-ascii=' + $ascii)

# ---------- case i: module callable without verify -----------------------
$direct = Invoke-PsSuitesTick -RepoDir $root -TicketPath (Join-Path $sandbox 'direct.json') -RunnerPath $runnerGreen -TimeoutSec 8
Check 'i1 direct call runs and passes' ($direct.status -eq 'pass' -and $direct.failing -eq 0) ([string]$direct.status)
$again = Invoke-PsSuitesTick -RepoDir $root -TicketPath (Join-Path $sandbox 'direct.json') -RunnerPath $runnerGreen -TimeoutSec 8
Check 'i2 direct call reuses the ticket' ($again.ran -eq $false) ([string]$again.ran)
$forced = Invoke-PsSuitesTick -RepoDir $root -TicketPath (Join-Path $sandbox 'direct.json') -RunnerPath $runnerGreen -TimeoutSec 8 -Force
Check 'i3 -Force overrides the cache' ($forced.ran -eq $true) ([string]$forced.ran)

# ---------- case j: two verify instances must not fight over the ticket ---
# r751: the ticket used a fixed `<path>.new` side file, so when the 5-minute tick
# and a sandbox ran verify at the same time the loser died on Move-Item
# PathNotFound - an exit 1 that looked like a real gate failure. Six concurrent
# writers on one ticket path: every one must return quietly and the surviving
# file must still be a complete ticket with no side-file residue.
$raceTicket = Join-Path $sandbox 'race.json'
$jobs = @()
foreach ($n in 1..6) {
  $jobs += Start-Job -ScriptBlock {
    param($modPath, $ticketPath, $idx)
    # Capture the error stream too: Move-Item failures are non-terminating, so a
    # bare try/catch would report OK while the writer shouted into the stream.
    $out = & {
      . $modPath
      try {
        $r = [pscustomobject]@{
          sha = ('0123456789ab'); status = 'pass'; suites = $idx; assertions = $idx
          failing = 0; parity = 'ok'; exit = 0; ms = $idx; ts_utc = '2026-01-01T00:00:00Z'
        }
        Write-PsSuitesTicket -Path $ticketPath -Result $r
        'OK'
      } catch { 'ERR ' + $_.Exception.GetType().Name }
    } 2>&1
    ($out | ForEach-Object { "$_" }) -join '|'
  } -ArgumentList $module, $raceTicket, $n
}
$null = Wait-Job -Job $jobs -Timeout 90
$raceResults = @($jobs | Receive-Job)
Remove-Job -Job $jobs -Force -ErrorAction SilentlyContinue

$raceErr = @($raceResults | Where-Object { "$_" -ne 'OK' })
Check 'j1 six concurrent ticket writers all quiet' ($raceErr.Count -eq 0) (($raceErr -join ' | '))
$tkRace = $null
try { $tkRace = [System.IO.File]::ReadAllText($raceTicket, [System.Text.Encoding]::UTF8) | ConvertFrom-Json } catch { $tkRace = $null }
Check 'j2 surviving ticket is complete json' ($null -ne $tkRace -and "$($tkRace.sha)" -match '^[0-9a-f]{12}$') ([string]$tkRace)
Check 'j3 surviving ticket carries a suites count' ($null -ne $tkRace -and [int]$tkRace.suites -ge 1 -and [int]$tkRace.suites -le 6) ([string]$tkRace)
$leftovers = @(Get-ChildItem -Path $sandbox -Filter 'race.json.new*' -File -ErrorAction SilentlyContinue)
Check 'j4 no side-file residue' ($leftovers.Count -eq 0) (($leftovers | ForEach-Object { $_.Name }) -join ',')

Remove-Item -LiteralPath $sandbox -Recurse -Force -ErrorAction SilentlyContinue

Write-Output ('RESULT pass=' + ($script:checks - $script:fails) + ' fail=' + $script:fails)
if ($script:fails -gt 0) { exit 1 }
Write-Output 'ALL PASS'
exit 0