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
$vticket = Join-Path $sandbox 'ticket-verify.json'
$v2ticket = Join-Path $sandbox 'ticket-verify2.json'
# main#117: the write side is two families. The sandbox seeds the face half so
# its cases never reach the real 17.8 s suite half.
$w2ticket = Join-Path $sandbox 'ticket-write2.json'

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

# Default runner for the verify family. Never left empty: an unset env var would
# let verify.ps1 fall back to the real 8-suite, ~80 s family inside a sandbox.
$script:vrunner = $runnerGreen
$script:vforce = $false
$script:vtimeout = $null
$script:voff = $false
$script:child = $false
# Case y points the verify family at a second ticket to prove the budget WARN
# end to end; everything else uses the shared one.
$script:vticketpath = $vticket
# Heavy verify family (main#99). Same rules: a fixture runner and a temp ticket,
# never the real 51 s sandbox.
$script:v2runner = $runnerGreen
$script:v2force = $false
$script:v2timeout = $null
$script:v2off = $false
$script:v2ticketpath = $v2ticket
# Face + census half of the write side (main#117). Same rules: fixture runner,
# own temp ticket, never the real suites.
$script:w2runner = $runnerGreen
$script:w2force = $false
$script:w2timeout = $null
$script:w2off = $false
$script:w2ticketpath = $w2ticket

# Seed the verify-family ticket before the write-side cases: those assert that
# a cached tick stays under 3 s, and a due verify run would spend that budget
# on a fixture spawn. The family gets its own cases (k..r) below.
. $module
$null = Invoke-PsSuitesTick -RepoDir $root -Family verify -TicketPath $vticket -RunnerPath $runnerGreen -TimeoutSec 8
$null = Invoke-PsSuitesTick -RepoDir $root -Family verify2 -TicketPath $v2ticket -RunnerPath $runnerGreen -TimeoutSec 8
$null = Invoke-PsSuitesTick -RepoDir $root -Family write2 -TicketPath $w2ticket -RunnerPath $runnerGreen -TimeoutSec 8

function Clear-PsEnv {
    foreach ($k in @('FLUXVERSE_PS_SUITES', 'FLUXVERSE_PS_SUITES_RUNNER', 'FLUXVERSE_PS_SUITES_TICKET',
                     'FLUXVERSE_PS_SUITES_TIMEOUT', 'FLUXVERSE_PS_SUITES_FORCE',
                     'FLUXVERSE_PS_SUITES_VERIFY', 'FLUXVERSE_PS_SUITES_VERIFY_RUNNER',
                     'FLUXVERSE_PS_SUITES_VERIFY_TICKET', 'FLUXVERSE_PS_SUITES_VERIFY_TIMEOUT',
                     'FLUXVERSE_PS_SUITES_VERIFY_FORCE',
                     'FLUXVERSE_PS_SUITES_VERIFY2', 'FLUXVERSE_PS_SUITES_VERIFY2_RUNNER',
                     'FLUXVERSE_PS_SUITES_VERIFY2_TICKET', 'FLUXVERSE_PS_SUITES_VERIFY2_TIMEOUT',
                     'FLUXVERSE_PS_SUITES_VERIFY2_FORCE', 'FLUXVERSE_PS_SUITES_CHILD',
                     'FLUXVERSE_PS_SUITES_WRITE2', 'FLUXVERSE_PS_SUITES_WRITE2_RUNNER',
                     'FLUXVERSE_PS_SUITES_WRITE2_TICKET', 'FLUXVERSE_PS_SUITES_WRITE2_TIMEOUT',
                     'FLUXVERSE_PS_SUITES_WRITE2_FORCE')) {
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
    # The verify family must never reach the real suites from a sandbox: it is
    # an ~80 s run and its suites call this gate themselves. Always point it at
    # a fixture runner and its own temp ticket.
    $env:FLUXVERSE_PS_SUITES_VERIFY_TICKET = $script:vticketpath
    $env:FLUXVERSE_PS_SUITES_VERIFY_RUNNER = $script:vrunner
    if ($script:vtimeout) { $env:FLUXVERSE_PS_SUITES_VERIFY_TIMEOUT = [string]$script:vtimeout }
    if ($script:voff) { $env:FLUXVERSE_PS_SUITES_VERIFY = 'off' }
    if ($script:vforce) { $env:FLUXVERSE_PS_SUITES_VERIFY_FORCE = '1' }
    # Same treatment for the heavy verify sandbox (main#99): it must never reach
    # the real test-verify-ps-suites.ps1 from here, or the sandbox would run
    # itself at ~51 s a pop.
    $env:FLUXVERSE_PS_SUITES_VERIFY2_TICKET = $script:v2ticketpath
    $env:FLUXVERSE_PS_SUITES_VERIFY2_RUNNER = $script:v2runner
    if ($script:v2timeout) { $env:FLUXVERSE_PS_SUITES_VERIFY2_TIMEOUT = [string]$script:v2timeout }
    if ($script:v2off) { $env:FLUXVERSE_PS_SUITES_VERIFY2 = 'off' }
    if ($script:v2force) { $env:FLUXVERSE_PS_SUITES_VERIFY2_FORCE = '1' }
    # Face + census half of the write side (main#117): cached ticket + fixture
    # runner, so a sandbox round never pays the real 17.8 s half.
    $env:FLUXVERSE_PS_SUITES_WRITE2_TICKET = $script:w2ticketpath
    $env:FLUXVERSE_PS_SUITES_WRITE2_RUNNER = $script:w2runner
    if ($script:w2timeout) { $env:FLUXVERSE_PS_SUITES_WRITE2_TIMEOUT = [string]$script:w2timeout }
    if ($script:w2off) { $env:FLUXVERSE_PS_SUITES_WRITE2 = 'off' }
    if ($script:w2force) { $env:FLUXVERSE_PS_SUITES_WRITE2_FORCE = '1' }
    if ($script:child) { $env:FLUXVERSE_PS_SUITES_CHILD = '1' }
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

# The face + census half of the write side (main#117) prints its own label, so
# `ps-suites:` must not pick it up and vice versa.
function Get-Write2Line($out) {
    return @($out.lines | Where-Object { $_ -match '^VERIFY (HEALTH|WARN): ps-suites-write2:' })
}

# The verify family prints its own label, so it can never be mistaken for the
# write-side line (and the write-side assertions above keep their exact shape).
function Get-VerifyLine($out) {
    return @($out.lines | Where-Object { $_ -match '^VERIFY (HEALTH|WARN): ps-suites-verify:' })
}

# The heavy family has its own label; the light-family regex above must never
# swallow it (asserted in case z).
function Get-Verify2Line($out) {
    return @($out.lines | Where-Object { $_ -match '^VERIFY (HEALTH|WARN): ps-suites-verify2:' })
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

# ---------- case k..q: the verify family rides the same tick (main#94) ------
# Two things must both hold: the verify family really runs, and ONE tick never
# pays for both runs (write ~19 s + verify ~80 s would double the round).
$script:runner = $runnerGreen; $script:vrunner = $runnerGreen
$script:timeout = $null; $script:force = $false; $script:vforce = $false
$script:vtimeout = $null; $script:child = $false; $script:off = $false; $script:voff = $false

Remove-Item -LiteralPath $ticket -Force -ErrorAction SilentlyContinue
Remove-Item -LiteralPath $vticket -Force -ErrorAction SilentlyContinue
$rk = Run-Verify
$wk = @(Get-PsLine $rk); $vk = @(Get-VerifyLine $rk)
Check 'k1 one write line and one verify line' ($wk.Count -eq 1 -and $vk.Count -eq 1) ('write=' + $wk.Count + ' verify=' + $vk.Count)
Check 'k2 write family really ran' ("$($wk[0])" -match 'ran=\d+ms') "$($wk[0])"
Check 'k3 verify family deferred instead of running' ("$($vk[0])" -like 'VERIFY HEALTH:*' -and "$($vk[0])" -match 'deferred' -and "$($vk[0])" -notmatch 'ran=\d+ms') "$($vk[0])"
Check 'k4 deferred verify wrote no ticket' (-not (Test-Path -LiteralPath $vticket)) $vticket
Check 'k5 deferral names the reason (write ran this tick)' ("$($vk[0])" -match 'write-side ran \d+ms this tick') "$($vk[0])"
$wt1 = ''
try { $wt1 = [System.IO.File]::ReadAllText($ticket, [System.Text.Encoding]::UTF8) } catch { $wt1 = '' }

# next tick: write is cached, so the verify family takes its turn
$rl = Run-Verify
$wl = @(Get-PsLine $rl); $vl = @(Get-VerifyLine $rl)
Check 'l1 verify family runs on the next tick' ("$($vl[0])" -match 'ran=\d+ms') "$($vl[0])"
Check 'l2 write family cached while verify runs' ("$($wl[0])" -match 'cached=' -and "$($wl[0])" -notmatch 'ran=\d+ms') "$($wl[0])"
Check 'l3 verify ticket written' (Test-Path -LiteralPath $vticket) $vticket
$tv = $null
try { $tv = [System.IO.File]::ReadAllText($vticket, [System.Text.Encoding]::UTF8) | ConvertFrom-Json } catch { $tv = $null }
Check 'l4 verify ticket is parseable and carries a sha' ($null -ne $tv -and "$($tv.sha)" -match '^[0-9a-f]{12}$') ([string]$tv)
$tw = $null
try { $tw = [System.IO.File]::ReadAllText($ticket, [System.Text.Encoding]::UTF8) | ConvertFrom-Json } catch { $tw = $null }
Check 'l5 the two families keep different fingerprints' ($null -ne $tv -and $null -ne $tw -and "$($tv.sha)" -ne "$($tw.sha)") ('verify=' + "$($tv.sha)" + ' write=' + "$($tw.sha)")
$wt2 = ''
try { $wt2 = [System.IO.File]::ReadAllText($ticket, [System.Text.Encoding]::UTF8) } catch { $wt2 = '' }
Check 'l6 a verify run leaves the write ticket untouched' ($wt1 -ne '' -and $wt1 -eq $wt2) ('len ' + $wt1.Length + ' -> ' + $wt2.Length)

# third tick: both cached, zero spawn
$rm = Run-Verify
$wm = @(Get-PsLine $rm); $vm = @(Get-VerifyLine $rm)
Check 'm1 both lines cached on a quiet tick' ("$($wm[0])" -match 'cached=' -and "$($vm[0])" -match 'cached=') "$($wm[0]) | $($vm[0])"
Check 'm2 a fully cached tick stays fast (<4000ms)' ($rm.ms -lt 4000) ('ms=' + $rm.ms)

# ---------- case n: verify-family red is a WARN with the right re-run hint --
$script:vrunner = $runnerRed
$script:vforce = $true
$rn = Run-Verify
$vn = @(Get-VerifyLine $rn)
Check 'n1 verify red is WARN' ("$($vn[0])" -like 'VERIFY WARN:*') "$($vn[0])"
Check 'n2 verify red names red=2' ("$($vn[0])" -match 'red=2') "$($vn[0])"
Check 'n3 verify red hints the -Verify re-run command' ("$($vn[0])" -match 'run-ps-suites\.ps1 -Verify') "$($vn[0])"
Check 'n4 verify red does not fail the gate' ($rn.code -eq 0) ('exit=' + $rn.code)

# ---------- case o: verify-family hang is a timeout, never a verdict --------
$script:vrunner = $runnerSlow; $script:vtimeout = 2; $script:vforce = $true
$ro = Run-Verify
$vo = @(Get-VerifyLine $ro)
Check 'o1 verify hang is WARN' ("$($vo[0])" -like 'VERIFY WARN:*') "$($vo[0])"
Check 'o2 verify hang says timeout 2s' ("$($vo[0])" -match 'did not finish in 2s') "$($vo[0])"
Check 'o3 verify hang never claims a run or a verdict' ("$($vo[0])" -notmatch 'ran=\d+ms' -and "$($vo[0])" -notmatch 'parity=ok') "$($vo[0])"
$script:vtimeout = $null

# ---------- case p: nested sandbox run must not recurse --------------------
$script:vrunner = $runnerGreen; $script:vforce = $false; $script:child = $true
$rp = Run-Verify
$wp = @(Get-PsLine $rp); $vp = @(Get-VerifyLine $rp)
Check 'p1 nested run skips the write family' ("$($wp[0])" -match 'skipped \(nested sandbox run\)') "$($wp[0])"
Check 'p2 nested run skips the verify family' ("$($vp[0])" -match 'skipped \(nested sandbox run\)') "$($vp[0])"
Check 'p3 nested skip spawns nothing (<4000ms)' ($rp.ms -lt 4000) ('ms=' + $rp.ms)
$script:child = $false

# ---------- case q: verify family has its own off switch -------------------
$script:voff = $true
$rq = Run-Verify
$vq = @(Get-VerifyLine $rq)
Check 'q1 verify off switch is explicit' ("$($vq[0])" -match 'disabled by FLUXVERSE_PS_SUITES_VERIFY=off') "$($vq[0])"
$script:voff = $false

# ---------- case r: family defaults + CheckOnly never spawn ---------------
$wDefs = @(Get-PsSuitesTickDefaults -Family write)
$w2Defs = @(Get-PsSuitesTickDefaults -Family write2)
$vDefs = @(Get-PsSuitesTickDefaults -Family verify)
Check 'r1 the state-writer half guards six entries incl. the fixture tree' ($wDefs.Count -eq 6) ('count=' + $wDefs.Count)
Check 'r2 verify family guards the gate it proves' ($vDefs -contains 'Tools\perceptor\verify.ps1') (($vDefs -join ','))
Check 'r3 verify family is wider than the write list' ($vDefs.Count -gt $wDefs.Count) ('verify=' + $vDefs.Count + ' write=' + $wDefs.Count)
$overlap = @($wDefs | Where-Object { $vDefs -contains $_ })
Check 'r4 the two source sets overlap only on the runner and the fixture tree' ($overlap.Count -eq 2 -and ($overlap -contains 'Tools\devloop\run-ps-suites.ps1') -and ($overlap -contains 'Tools\devloop\fixtures\*\*')) (($overlap -join ','))
# main#117: the seven-suite write family (32.0 s = 71% of its 45 s cap, a
# budget WARN every tick) is split by what each suite guards. The two halves
# must not share a single suite, or the split buys nothing.
$wSuites = @(
    'Tools\devloop\test-fastpath-state-live.ps1',
    'logs\devloop-r197-writer-test.ps1',
    'logs\devloop-r271-keep-negcon.ps1'
)
$w2Suites = @(
    'Tools\devloop\test-write-status-face-bare.ps1',
    'logs\devloop-r247-facewriter-test.ps1',
    'Tools\devloop\test-nolivecheck-census.ps1',
    'Tools\devloop\test-qa-rotation.ps1'
)
$leak1 = @($wDefs | Where-Object { $w2Suites -contains $_ })
Check 'r4b the state half carries none of the face suites' ($leak1.Count -eq 0) ($leak1 -join ',')
$leak2 = @($w2Defs | Where-Object { $wSuites -contains $_ })
Check 'r4c the face half carries none of the state suites' ($leak2.Count -eq 0) ($leak2 -join ',')
$missing1 = @($wSuites | Where-Object { -not ($wDefs -contains $_) })
$missing2 = @($w2Suites | Where-Object { -not ($w2Defs -contains $_) })
Check 'r4d every write suite is guarded by exactly one half' ($missing1.Count -eq 0 -and $missing2.Count -eq 0) (($missing1 -join ',') + ' | ' + ($missing2 -join ','))
Check 'r4e the face half keeps its own ticket file' ((Get-PsSuitesFamilyTicketName -Family write2) -eq 'logs\.ps-suites-write2-last.json') (Get-PsSuitesFamilyTicketName -Family write2)
Check 'r4f the face cap stays at the same 45 s as the state half' ((Get-PsSuitesFamilyTimeout -Family write2) -eq 45) ([string](Get-PsSuitesFamilyTimeout -Family write2))
$overlap2 = @($w2Defs | Where-Object { $vDefs -contains $_ })
Check 'r4g the face half overlaps verify only on the runner and the fixture tree' ($overlap2.Count -eq 2 -and ($overlap2 -contains 'Tools\devloop\run-ps-suites.ps1') -and ($overlap2 -contains 'Tools\devloop\fixtures\*\*')) (($overlap2 -join ','))
$chkTicket = Join-Path $sandbox 'chk.json'
$chk1 = Invoke-PsSuitesTick -RepoDir $root -Family verify -TicketPath $chkTicket -RunnerPath $runnerGreen -CheckOnly
Check 'r5 CheckOnly reports a due run without spawning' ($chk1.needs_run -eq $true -and $chk1.status -eq 'stale' -and -not (Test-Path -LiteralPath $chkTicket)) ([string]$chk1.status)
$chk2 = Invoke-PsSuitesTick -RepoDir $root -Family verify -TicketPath $chkTicket -RunnerPath $runnerGreen
$chk3 = Invoke-PsSuitesTick -RepoDir $root -Family verify -TicketPath $chkTicket -RunnerPath $runnerGreen -CheckOnly
Check 'r6 after a run CheckOnly says nothing is due' ($chk2.ran -eq $true -and $chk3.needs_run -eq $false -and "$($chk3.sha)" -eq "$($chk2.sha)") ($chk3.needs_run)
$chk4 = Invoke-PsSuitesTick -RepoDir $root -Family verify -TicketPath $chkTicket -RunnerPath (Join-Path $sandbox 'nope.ps1') -CheckOnly
Check 'r7 CheckOnly still reports a missing runner' ($chk4.status -eq 'missing' -and $chk4.needs_run -eq $true) ([string]$chk4.status)

# ---------- case s: verdict lines stay scanner-safe -----------------------
$allV = @()
foreach ($r in @($rk, $rl, $rm, $rn, $ro, $rp, $rq)) { $allV += @(Get-VerifyLine $r) }
$allV = @($allV | Where-Object { "$_" -ne '' })
Check 's1 verify-family lines exist to judge' ($allV.Count -ge 7) ('count=' + $allV.Count)
$badV = @($allV | Where-Object { "$_" -match '(?i)fail' })
Check 's2 no ps-suites-verify line leaks the red token, any case' ($badV.Count -eq 0) (($badV -join ' | '))
$nonAscii = 0
foreach ($ln in $allV) { foreach ($ch in $ln.ToCharArray()) { if ([int][char]$ch -gt 127) { $nonAscii++ } } }
Check 's3 ps-suites-verify lines are ascii-only' ($nonAscii -eq 0) ('non-ascii=' + $nonAscii)

# ---------- case t: a red run records WHICH suites were red (main#91 r754) --
# r754 found a live verify-family red (red=1) whose identity was gone: the tick
# kept the summary line in the ticket but threw the runner output away, and the
# re-run came back clean. A red nobody can attribute is only half a signal.
$runnerRedNamed = New-Runner 'runner-red-named.ps1' @'
Write-Output 'PASS  suite-a.ps1  exit=0  ALL PASS'
Write-Output 'FAIL  suite-b.ps1  exit=2  some assertion'
Write-Output 'WARN  suite-c.ps1  timeout>40s  no verdict'
Write-Output 'PS SUITES suites=3 assertions=9 counted=2 failing=1 parity=ok'
exit 2
'@
$tTicket = Join-Path $sandbox 't.json'
$tr = Invoke-PsSuitesTick -RepoDir $root -TicketPath $tTicket -RunnerPath $runnerRedNamed -TimeoutSec 8
Check 't1 red run names the red suite' ("$($tr.reds)" -match 'suite-b\.ps1') ("$($tr.reds)")
Check 't2 a hung suite is named with :timeout' ("$($tr.reds)" -match 'suite-c\.ps1:timeout') ("$($tr.reds)")
Check 't3 the ticket keeps the names for later ticks' ((Test-Path -LiteralPath $tTicket) -and ([System.IO.File]::ReadAllText($tTicket, [System.Text.Encoding]::UTF8) -match 'suite-b\.ps1')) $tTicket
$tLine = Format-PsSuitesLine $tr
Check 't4 the printed line carries reds=' ($tLine -match 'reds=suite-b\.ps1,suite-c\.ps1:timeout') $tLine
$tg = Invoke-PsSuitesTick -RepoDir $root -TicketPath (Join-Path $sandbox 't-green.json') -RunnerPath $runnerGreen -TimeoutSec 8
Check 't5 a green run records no reds' ("$($tg.reds)" -eq '') ("$($tg.reds)")
Check 't6 a green line does not carry reds=' ((Format-PsSuitesLine $tg) -notmatch 'reds=') (Format-PsSuitesLine $tg)

# ---------- case ta: a single red also records WHAT it said (main#98) ------
# r754 kept the culprit's name and threw its sentence away, so a live red could
# only be re-run ("it is green now") instead of read. One culprit, one tail: a
# line cannot carry several, and the name list already says who they were.
$longTail = ('boom ' * 60).Trim()
$runnerOneRed = New-Runner 'runner-one-red.ps1' @'
Write-Output 'PASS  suite-a.ps1  exit=0  ALL PASS'
Write-Output 'FAIL  suite-b.ps1  exit=1  RESULT: FAIL (1) :: expected 3 got 4'
Write-Output 'PS SUITES suites=2 assertions=6 counted=2 failing=1 parity=ok'
exit 2
'@
$runnerLongTail = New-Runner 'runner-long-tail.ps1' ("Write-Output 'FAIL  suite-b.ps1  exit=1  " + $longTail + "'`r`nWrite-Output 'PS SUITES suites=1 assertions=1 counted=1 failing=1 parity=ok'`r`nexit 2`r`n")
$runnerTwoRed = New-Runner 'runner-two-red.ps1' @'
Write-Output 'FAIL  suite-a.ps1  exit=2  first assertion'
Write-Output 'FAIL  suite-b.ps1  exit=3  second assertion'
Write-Output 'PS SUITES suites=2 assertions=6 counted=2 failing=2 parity=ok'
exit 2
'@
$taTicket = Join-Path $sandbox 'ta.json'
$ta1 = Invoke-PsSuitesTick -RepoDir $root -TicketPath $taTicket -RunnerPath $runnerOneRed -TimeoutSec 8
Check 'ta1 a single red records the tail sentence' ("$($ta1.redtail)" -match 'expected 3 got 4') ("$($ta1.redtail)")
Check 'ta2 the tail keeps no census red root, any case' ("$($ta1.redtail)" -notmatch '(?i)fail') ("$($ta1.redtail)")
Check 'ta3 the printed line carries redtail=' ((Format-PsSuitesLine $ta1) -match 'redtail=.*expected 3 got 4') (Format-PsSuitesLine $ta1)
$ta2 = Invoke-PsSuitesTick -RepoDir $root -TicketPath $taTicket -RunnerPath $runnerOneRed -TimeoutSec 8
Check 'ta4 a cached red still says what it said' ($ta2.ran -eq $false -and "$($ta2.redtail)" -match 'expected 3 got 4' -and (Format-PsSuitesLine $ta2) -match 'redtail=') (Format-PsSuitesLine $ta2)
$taRaw = ''
if (Test-Path -LiteralPath $taTicket) { $taRaw = [System.IO.File]::ReadAllText($taTicket, [System.Text.Encoding]::UTF8) }
Check 'ta5 the ticket persists the tail for later ticks' ($taRaw -match 'redtail') $taTicket
$ta3 = Invoke-PsSuitesTick -RepoDir $root -TicketPath (Join-Path $sandbox 'ta-long.json') -RunnerPath $runnerLongTail -TimeoutSec 8
Check 'ta6 a runaway tail is cut at 200 chars' ("$($ta3.redtail)".Length -le 200 -and "$($ta3.redtail)".Length -gt 100) ('len=' + "$($ta3.redtail)".Length)
Check 'ta7 the tail never carries a newline' ("$($ta3.redtail)" -notmatch '[\r\n]') ("$($ta3.redtail)")
$taNonAscii = 0
foreach ($ch in "$($ta3.redtail)".ToCharArray()) { if ([int][char]$ch -gt 127) { $taNonAscii++ } }
Check 'ta8 the tail is ascii-only' ($taNonAscii -eq 0) ('non-ascii=' + $taNonAscii)
$ta4 = Invoke-PsSuitesTick -RepoDir $root -TicketPath (Join-Path $sandbox 'ta-two.json') -RunnerPath $runnerTwoRed -TimeoutSec 8
Check 'ta9 two culprits keep the names and drop the tail' ("$($ta4.reds)" -match 'suite-a\.ps1' -and "$($ta4.reds)" -match 'suite-b\.ps1' -and "$($ta4.redtail)" -eq '') ("reds=$($ta4.reds) redtail=$($ta4.redtail)")
$ta5 = Invoke-PsSuitesTick -RepoDir $root -TicketPath (Join-Path $sandbox 'ta-green.json') -RunnerPath $runnerGreen -TimeoutSec 8
Check 'ta10 a green run records no tail' ("$($ta5.redtail)" -eq '' -and (Format-PsSuitesLine $ta5) -notmatch 'redtail=') ("$($ta5.redtail)")

# ---------- case u: a non-pass verdict ages out, a pass never does ----------
# The r754 red was environmental (identical sources re-ran clean), yet the ticket
# was content addressed: only a human with -Force could clear it. Now a non-pass
# ticket re-runs itself after N cached citations.
$uTicket = Join-Path $sandbox 'u.json'
$u1 = Invoke-PsSuitesTick -RepoDir $root -TicketPath $uTicket -RunnerPath $runnerRed -TimeoutSec 8 -AutoRetryAfter 3
Check 'u1 first call really runs the red runner' ($u1.ran -eq $true -and $u1.status -eq 'red') ([string]$u1.status)
$u2 = Invoke-PsSuitesTick -RepoDir $root -TicketPath $uTicket -RunnerPath $runnerRed -TimeoutSec 8 -AutoRetryAfter 3
Check 'u2 first cached citation keeps the verdict and counts' ($u2.ran -eq $false -and $u2.status -eq 'red' -and $u2.tries -eq 1) ([string]$u2.tries)
$u3 = Invoke-PsSuitesTick -RepoDir $root -TicketPath $uTicket -RunnerPath $runnerRed -TimeoutSec 8 -AutoRetryAfter 3
Check 'u3 second cached citation still counts' ($u3.ran -eq $false -and $u3.tries -eq 2) ([string]$u3.tries)
$u4 = Invoke-PsSuitesTick -RepoDir $root -TicketPath $uTicket -RunnerPath $runnerRed -TimeoutSec 8 -AutoRetryAfter 3
Check 'u4 third citation re-runs by itself' ($u4.ran -eq $true) ([string]$u4.ran)
Check 'u5 the self-retry is marked on the result' ($u4.heal -eq $true) ([string]$u4.heal)
Check 'u6 the counter resets after a real run' ($u4.tries -eq 0) ([string]$u4.tries)
$u5 = Invoke-PsSuitesTick -RepoDir $root -TicketPath $uTicket -RunnerPath $runnerGreen -TimeoutSec 8 -AutoRetryAfter 3 -Force
Check 'u7 a forced green run clears the red' ($u5.status -eq 'pass') ([string]$u5.status)
$u6 = Invoke-PsSuitesTick -RepoDir $root -TicketPath $uTicket -RunnerPath $runnerGreen -TimeoutSec 8 -AutoRetryAfter 1
$u7 = Invoke-PsSuitesTick -RepoDir $root -TicketPath $uTicket -RunnerPath $runnerGreen -TimeoutSec 8 -AutoRetryAfter 1
Check 'u8 a passing ticket never ages out (no spawn even at N=1)' ($u6.ran -eq $false -and $u7.ran -eq $false -and $u7.status -eq 'pass') ([string]$u7.status)
$uChk = Invoke-PsSuitesTick -RepoDir $root -TicketPath $uTicket -RunnerPath $runnerGreen -AutoRetryAfter 1 -CheckOnly
Check 'u9 CheckOnly agrees that nothing is due for a green ticket' ($uChk.needs_run -eq $false) ([string]$uChk.needs_run)

# ---------- case w: fixtures are content, not a hash bystander -------------
# The old honest boundary: a suite could read a fixture outside the guarded list
# and rot while the fingerprint stood still. Fixtures now hash as an explicit
# file list, and an empty glob still contributes a marker.
$fxDir = Join-Path $sandbox 'fx'
$fxSub = Join-Path $fxDir 'fxsub'
New-Item -ItemType Directory -Path $fxSub -Force | Out-Null
$w1 = Get-PsSuitesFingerprint -RepoDir $fxDir -Paths @('fxsub\**')
Check 'w1 an empty fixture glob is recorded, not skipped' ($w1 -match '^[0-9a-f]{12}$') $w1
[System.IO.File]::WriteAllText((Join-Path $fxSub 'a.txt'), 'one', $utf8)
$w2 = Get-PsSuitesFingerprint -RepoDir $fxDir -Paths @('fxsub\**')
Check 'w2 adding the first fixture moves the fingerprint' ($w1 -ne $w2) ($w1 + ' vs ' + $w2)
[System.IO.File]::WriteAllText((Join-Path $fxSub 'a.txt'), 'two', $utf8)
$w3 = Get-PsSuitesFingerprint -RepoDir $fxDir -Paths @('fxsub\**')
Check 'w3 editing a fixture moves the fingerprint' ($w2 -ne $w3) ($w2 + ' vs ' + $w3)
$w4 = Get-PsSuitesFingerprint -RepoDir $fxDir -Paths @('fxsub\**')
Check 'w4 the fixture fingerprint is stable across reads' ($w3 -eq $w4) ($w3 + ' vs ' + $w4)
Check 'w5 every family guards the fixture tree' ($wDefs -contains 'Tools\devloop\fixtures\*\*' -and $w2Defs -contains 'Tools\devloop\fixtures\*\*' -and $vDefs -contains 'Tools\devloop\fixtures\*\*') (($wDefs -join ',') + ' | ' + ($w2Defs -join ',') + ' | ' + ($vDefs -join ','))
# NOTE: $root is the Tools dir in this sandbox, so RepoDir must be its parent -
# the first draft of w6 pointed at Tools and expanded to NOFILES (r754).
$repo = Split-Path $root -Parent
$wList = @(Expand-PsSuitesSourceList -RepoDir $repo -Paths @('Tools\devloop\fixtures\*\*'))
Check 'w6 the live fixture glob expands to real files' ($wList.Count -ge 4 -and -not ($wList -match '=NOFILES')) ('files=' + $wList.Count)
$wAll = Get-PsSuitesFingerprint -RepoDir $repo -Paths @('Tools\devloop\fixtures\*\*')
Check 'w7 the live fixture fingerprint is a real hash' ($wAll -match '^[0-9a-f]{12}$') $wAll
$wReal = @(Expand-PsSuitesSourceList -RepoDir $repo -Paths $wDefs)
$wMissing = @($wReal | Where-Object { -not (Test-Path -LiteralPath (Join-Path $repo $_)) })
Check 'w8 every guarded write-side source exists in the real tree' ($wMissing.Count -eq 0 -and $wReal.Count -ge 6) (($wMissing -join ',') + ' of ' + $wReal.Count)
$w2Real = @(Expand-PsSuitesSourceList -RepoDir $repo -Paths $w2Defs)
$w2Missing = @($w2Real | Where-Object { -not (Test-Path -LiteralPath (Join-Path $repo $_)) })
Check 'w8b every guarded face-side source exists in the real tree' ($w2Missing.Count -eq 0 -and $w2Real.Count -ge 11) (($w2Missing -join ',') + ' of ' + $w2Real.Count)

# ---------- case x: the ticket's `exit` is the runner's REAL code (main#97) --
# r754 caught a live ticket reading `failing=1 exit=0` while the runner must have
# exited 2, and only the `failing>0` half of the judge was doing any work: a
# Process object from Start-Process -PassThru reports an empty ExitCode here, so
# `[int]$proc.ExitCode` silently became 0. These cases pin both halves.
$runnerLiar = New-Runner 'runner-liar.ps1' @'
Write-Output 'PS SUITES suites=2 assertions=10 counted=2 failing=0 parity=ok'
Write-Output 'PS SUITES VERDICT: ALL PASS'
exit 2
'@
$runnerNoSummary = New-Runner 'runner-nosummary.ps1' @'
Write-Output 'PS SUITES ERROR: 2 suite file(s) missing'
exit 3
'@
$xLiarTicket = Join-Path $sandbox 'x-liar.json'
$xl = Invoke-PsSuitesTick -RepoDir $root -TicketPath $xLiarTicket -RunnerPath $runnerLiar -TimeoutSec 8
Check 'x1 a green-looking summary with a non-zero exit is not cached as pass' ($xl.status -eq 'red') ([string]$xl.status)
Check 'x2 the ticket records the real exit code' ($xl.exit -eq 2) ('exit=' + $xl.exit)
$xLiarRaw = ''
try { $xLiarRaw = [System.IO.File]::ReadAllText($xLiarTicket, [System.Text.Encoding]::UTF8) } catch { $xLiarRaw = '' }
$xlTk = $null
try { $xlTk = $xLiarRaw | ConvertFrom-Json } catch { $xlTk = $null }
Check 'x3 the persisted ticket carries exit=2, not 0' ($null -ne $xlTk -and [int]$xlTk.exit -eq 2) ([string]$xlTk)

$xGreenTicket = Join-Path $sandbox 'x-green.json'
$xg = Invoke-PsSuitesTick -RepoDir $root -TicketPath $xGreenTicket -RunnerPath $runnerGreen -TimeoutSec 8
Check 'x4 a real pass records exit=0' ($xg.status -eq 'pass' -and $xg.exit -eq 0) ([string]$xg.status + ' exit=' + $xg.exit)

$xNoSumTicket = Join-Path $sandbox 'x-nosummary.json'
$xn = Invoke-PsSuitesTick -RepoDir $root -TicketPath $xNoSumTicket -RunnerPath $runnerNoSummary -TimeoutSec 8
Check 'x5 a runner without a summary is unreadable, not green' ($xn.status -eq 'unreadable') ([string]$xn.status)
Check 'x6 the unreadable ticket keeps the exit code' ($xn.exit -eq 3) ('exit=' + $xn.exit)
Check 'x7 the unreadable note names the exit for humans' ("$($xn.note)" -match 'exit=3') ("$($xn.note)")

$xSlowTicket = Join-Path $sandbox 'x-slow.json'
$xs = Invoke-PsSuitesTick -RepoDir $root -TicketPath $xSlowTicket -RunnerPath $runnerSlow -TimeoutSec 2
Check 'x8 a timeout records exit=-1 (no fake zero)' ($xs.status -eq 'timeout' -and $xs.exit -eq -1) ([string]$xs.status + ' exit=' + $xs.exit)

# Static half of the same fix: the module must get its code from cmd.exe, never
# from a Start-Process -PassThru handle (the shape that read empty for a year).
# Comments may still name the old shape - only executable lines matter.
$tickSrc = [System.IO.File]::ReadAllText($module, [System.Text.Encoding]::UTF8)
$tickCode = @(($tickSrc -split "`r?`n") | Where-Object { -not ($_.TrimStart().StartsWith('#')) })
$tickCodeText = ($tickCode -join "`n")
Check 'x9 module launches the runner through cmd.exe' ($tickSrc -match 'cmd\.exe') 'no cmd.exe in module'
Check 'x10 no live code reads an ExitCode off Start-Process' (-not ($tickCodeText -match 'Start-Process')) 'Start-Process still in executable code'

# ---------- case y: family baseline + budget warning (main#96 r757) ----------
# The verify family grew to 9 suites and 112 s against a 180 s cap (62%) and
# nobody could see that without opening the log. Every real run now appends its
# duration to `runs`, the ticket exposes `base_ms` (mean of the last three) and
# `budget_over` (past 2/3 of the family cap), and a passing-but-heavy family
# turns into a WARN that names the two ways out.
$yDefs = @(Get-PsSuitesTickDefaults -Family verify)
$yTicket = Join-Path $sandbox 'y.json'
$y1 = Invoke-PsSuitesTick -RepoDir $root -Family verify -TicketPath $yTicket -RunnerPath $runnerGreen -TimeoutSec 8
$y1parts = @(("$($y1.runs)" -split ',') | Where-Object { $_ -ne '' })
Check 'y1 a real run records its duration in the history' ($y1parts.Count -eq 1) ("$($y1.runs)")
Check 'y2 the first run yields a baseline equal to it' ([int]$y1.base_ms -eq [int]$y1.ms -and [int]$y1.base_ms -gt 0) ('base=' + $y1.base_ms + ' ms=' + $y1.ms)
$y2 = Invoke-PsSuitesTick -RepoDir $root -Family verify -TicketPath $yTicket -RunnerPath $runnerGreen -TimeoutSec 8 -Force
$y2parts = @(("$($y2.runs)" -split ',') | Where-Object { $_ -ne '' })
Check 'y3 a second real run appends instead of replacing' ($y2parts.Count -eq 2) ("$($y2.runs)")
Check 'y4 the trim helper keeps the last three runs, oldest dropped' ((@(Add-PsSuitesRunHistory -Runs @(1, 2, 3) -NewMs 4) -join ',') -eq '2,3,4') ((@(Add-PsSuitesRunHistory -Runs @(1, 2, 3) -NewMs 4) -join ','))
Check 'y5 the baseline helper averages the recorded runs' ((Get-PsSuitesBaseline -Runs @(60000, 90000, 120000)) -eq 90000) ([string](Get-PsSuitesBaseline -Runs @(60000, 90000, 120000)))
Check 'y6 the baseline helper ignores a zero placeholder' ((Get-PsSuitesBaseline -Runs @(0, 90000)) -eq 90000) ([string](Get-PsSuitesBaseline -Runs @(0, 90000)))
Check 'y7 no history means no baseline, not a zero' ((Get-PsSuitesBaseline -Runs @()) -eq 0) ([string](Get-PsSuitesBaseline -Runs @()))
Check 'y8 past 2/3 of the cap is over budget' ((Test-PsSuitesBudgetOver -BaseMs 121000 -TimeoutSec 180) -eq $true) 'base=121000 cap=180'
Check 'y9 below 2/3 of the cap is not' ((Test-PsSuitesBudgetOver -BaseMs 119000 -TimeoutSec 180) -eq $false) 'base=119000 cap=180'
Check 'y10 the printed line carries the baseline column' ((Format-PsSuitesLine $y1) -match 'base=\d+ms') (Format-PsSuitesLine $y1)
$yRaw = ''
try { $yRaw = [System.IO.File]::ReadAllText($yTicket, [System.Text.Encoding]::UTF8) } catch { $yRaw = '' }
Check 'y11 the persisted ticket carries the history' ($yRaw -match '"runs":"[0-9,]+"') $yRaw
# Seed an overweight history on a fresh (matching-sha) ticket: no spawn, but the
# cached verdict must still report how close the family is to its cap. NOTE: the
# ticket must be seeded against the REAL repo root, because verify.ps1 resolves
# that itself - seeding against $root (this sandbox's Tools dir) produced a
# different fingerprint and the gate legitimately re-ran (first draft of y15).
$yRepo = Split-Path $root -Parent
$ybTicket = Join-Path $sandbox 'y-budget.json'
$null = Invoke-PsSuitesTick -RepoDir $yRepo -Family verify -TicketPath $ybTicket -RunnerPath $runnerGreen -TimeoutSec 8
$ybObj = $null
try { $ybObj = [System.IO.File]::ReadAllText($ybTicket, [System.Text.Encoding]::UTF8) | ConvertFrom-Json } catch { $ybObj = $null }
if ($null -ne $ybObj) {
  $ybObj.runs = '130000,130000,130000'
  [System.IO.File]::WriteAllText($ybTicket, ($ybObj | ConvertTo-Json -Compress), $utf8)
}
$ybChk = Invoke-PsSuitesTick -RepoDir $yRepo -Family verify -TicketPath $ybTicket -RunnerPath $runnerGreen -TimeoutSec 180 -CheckOnly
Check 'y12 a cached ticket still exposes the baseline' ([int]$ybChk.base_ms -eq 130000) ('base=' + $ybChk.base_ms)
Check 'y13 a heavy cached family is flagged over budget' ($ybChk.budget_over -eq $true) ([string]$ybChk.budget_over)
Check 'y14 the budget flag does not turn a cached ticket into a spawn' ($ybChk.needs_run -eq $false) ([string]$ybChk.needs_run)
# End to end through the gate: write family off, verify family cached + heavy.
$script:owner = $script:off
$script:off = $true
$script:vticketpath = $ybTicket
$ry = Run-Verify
$vy = @(Get-VerifyLine $ry)
Check 'y15 a heavy but green family prints WARN, not HEALTH' ("$($vy[0])" -like 'VERIFY WARN:*') "$($vy[0])"
Check 'y16 the WARN says 2/3 of the cap and offers both ways out' ("$($vy[0])" -match 'over 2/3 of the 180s cap' -and "$($vy[0])" -match 'split the family or run it every other tick') "$($vy[0])"
Check 'y17 the budget WARN does not fail the gate' ($ry.code -eq 0) ('exit=' + $ry.code)
$script:off = $script:owner
$script:vticketpath = $vticket

# ---------- case z: the heavy sandbox gets its own family and its own turn ----
# main#99: nine suites in one family measured 121.6 s against a 180 s cap (68%,
# past the 2/3 budget line). The ~51 s gate-of-the-gate sandbox now lives alone
# in `verify2`, and a single tick never pays two families.
$zDefs = @(Get-PsSuitesTickDefaults -Family verify2)
$zLight = @(Get-PsSuitesTickDefaults -Family verify)
Check 'z1 the heavy family guards the sandbox it runs' ($zDefs -contains 'Tools\devloop\test-verify-ps-suites.ps1') ($zDefs -join ',')
Check 'z2 the heavy family is a small, targeted set' ($zDefs.Count -eq 5) ('count=' + $zDefs.Count)
Check 'z3 the light family no longer carries the heavy sandbox' (-not ($zLight -contains 'Tools\devloop\test-verify-ps-suites.ps1')) ($zLight -join ',')
Check 'z4 the heavy family keeps its own ticket file' ((Get-PsSuitesFamilyTicketName -Family verify2) -eq 'logs\.ps-suites-verify2-last.json') (Get-PsSuitesFamilyTicketName -Family verify2)
Check 'z5 the heavy cap is 165 s, under the light 180 s' ((Get-PsSuitesFamilyTimeout -Family verify2) -eq 165) ([string](Get-PsSuitesFamilyTimeout -Family verify2))
# main#105: a cap is a bound on a hang, so it must stay inside the tick it runs
# in. One third of the 600 s tick is the ceiling for any single family.
$zCaps = @(
    (Get-PsSuitesFamilyTimeout -Family write),
    (Get-PsSuitesFamilyTimeout -Family verify),
    (Get-PsSuitesFamilyTimeout -Family verify2)
)
$zCapMax = ($zCaps | Measure-Object -Maximum).Maximum
Check 'z5b no family cap may exceed 1/3 of the 600s tick' ($zCapMax -le 200) ('max=' + $zCapMax)
# ...and the heavy cap must still carry the ~2x headroom it was derived from
# (80.5 s measured at r766), or the number is just a bigger guess.
$zHeavyCap = Get-PsSuitesFamilyTimeout -Family verify2
Check 'z5c the heavy cap keeps at least 2x the measured run' ($zHeavyCap -ge [int][math]::Ceiling(2 * 80.5)) ('cap=' + $zHeavyCap)
Check 'z5d the heavy cap is not padded far past that' ($zHeavyCap -le 170) ('cap=' + $zHeavyCap)
Check 'z6 the two verify labels cannot be mistaken for each other' ((Get-VerifyLine ([pscustomobject]@{ lines = @('VERIFY HEALTH: ps-suites-verify2: x') })).Count -eq 0) 'regex overlap'

# Deterministic three-tick ladder from empty tickets: write runs -> verify runs
# -> verify2 runs, and each verify-side family defers while something else ran.
Remove-Item -LiteralPath $ticket -Force -ErrorAction SilentlyContinue
Remove-Item -LiteralPath $vticket -Force -ErrorAction SilentlyContinue
Remove-Item -LiteralPath $v2ticket -Force -ErrorAction SilentlyContinue
$script:runner = $runnerGreen; $script:vrunner = $runnerGreen; $script:v2runner = $runnerGreen
$script:timeout = $null; $script:force = $false; $script:vforce = $false; $script:v2force = $false
$script:vtimeout = $null; $script:v2timeout = $null
$script:off = $false; $script:voff = $false; $script:v2off = $false; $script:child = $false
$z1 = Run-Verify
$z1w = @(Get-PsLine $z1); $z1v = @(Get-VerifyLine $z1); $z1h = @(Get-Verify2Line $z1)
Check 'z7 a write-side run also defers the heavy verify family' ("$($z1w[0])" -match 'ran=\d+ms' -and "$($z1h[0])" -match 'deferred \(write-side ran \d+ms this tick\)') "$($z1w[0]) | $($z1h[0])"
Check 'z8 the deferred heavy family wrote no ticket' (-not (Test-Path -LiteralPath $v2ticket)) $v2ticket
$z2 = Run-Verify
$z2v = @(Get-VerifyLine $z2); $z2h = @(Get-Verify2Line $z2)
Check 'z9 the light family runs first and defers the heavy one' ("$($z2v[0])" -match 'ran=\d+ms' -and "$($z2h[0])" -match 'deferred \(verify-side ran \d+ms this tick\)') "$($z2v[0]) | $($z2h[0])"
$z3 = Run-Verify
$z3h = @(Get-Verify2Line $z3)
Check 'z10 the heavy family gets its turn once nothing else ran' ("$($z3h[0])" -match 'ran=\d+ms') "$($z3h[0])"
Check 'z11 the heavy ticket is written' (Test-Path -LiteralPath $v2ticket) $v2ticket
$v2obj = $null
try { $v2obj = [System.IO.File]::ReadAllText($v2ticket, [System.Text.Encoding]::UTF8) | ConvertFrom-Json } catch { $v2obj = $null }
Check 'z12 the heavy ticket records its own baseline' ($null -ne $v2obj -and "$($v2obj.runs)" -match '^[0-9]+') ([string]$v2obj)
$z4 = Run-Verify
$z4h = @(Get-Verify2Line $z4)
Check 'z13 a quiet tick caches the heavy family instead of spawning' ("$($z4h[0])" -match 'cached=' -and "$($z4h[0])" -notmatch 'ran=\d+ms') "$($z4h[0])"
Check 'z14 a fully cached tick stays cheap (<4000ms)' ($z4.ms -lt 4000) ('ms=' + $z4.ms)

$script:v2runner = $runnerRed; $script:v2force = $true
$z5 = Run-Verify
$z5h = @(Get-Verify2Line $z5)
Check 'z15 a heavy-family red is WARN with its own re-run hint' ("$($z5h[0])" -like 'VERIFY WARN:*' -and "$($z5h[0])" -match 'test-verify-ps-suites\.ps1') "$($z5h[0])"
Check 'z16 a heavy-family red does not fail the gate' ($z5.code -eq 0) ('exit=' + $z5.code)
$script:v2runner = $runnerSlow; $script:v2timeout = 2; $script:v2force = $true
$z6 = Run-Verify
$z6h = @(Get-Verify2Line $z6)
Check 'z17 a heavy-family hang is a timeout, never a verdict' ("$($z6h[0])" -match 'did not finish in 2s' -and "$($z6h[0])" -notmatch 'parity=ok') "$($z6h[0])"
$script:v2timeout = $null; $script:v2force = $false; $script:v2runner = $runnerGreen
$script:v2off = $true
$z7 = Run-Verify
$z7h = @(Get-Verify2Line $z7)
Check 'z18 the heavy family has its own off switch' ("$($z7h[0])" -match 'disabled by FLUXVERSE_PS_SUITES_VERIFY2=off') "$($z7h[0])"
$script:v2off = $false
$script:child = $true
$z8 = Run-Verify
$z8h = @(Get-Verify2Line $z8)
Check 'z19 a nested run skips the heavy family' ("$($z8h[0])" -match 'skipped \(nested sandbox run\)') "$($z8h[0])"
$script:child = $false
$zLines = @()
foreach ($r in @($z1, $z2, $z3, $z4, $z5, $z6, $z7, $z8)) { $zLines += @(Get-Verify2Line $r) }
$zLines = @($zLines | Where-Object { "$_" -ne '' })
Check 'z20 every heavy-family tick printed exactly one line' ($zLines.Count -eq 8) ('count=' + $zLines.Count)
$zBad = @($zLines | Where-Object { "$_" -match '(?i)fail' })
Check 'z21 no heavy-family line leaks the red token, any case' ($zBad.Count -eq 0) (($zBad -join ' | '))

# The split only holds if each family ASKS the runner for its own suites. A
# `-Verify` here would drag the heavy sandbox back into the light family and
# undo main#99 while every line above still looked right.
$runnerArgs = New-Runner 'runner-args.ps1' @'
[System.IO.File]::WriteAllText($env:FV_ARGS_OUT, ($args -join ' '), (New-Object System.Text.UTF8Encoding($false)))
Write-Output 'PS SUITES suites=1 assertions=1 counted=1 failing=0 parity=skipped'
exit 0
'@
$zArgFile = Join-Path $sandbox 'zargs.txt'
$env:FV_ARGS_OUT = $zArgFile
$null = Invoke-PsSuitesTick -RepoDir $root -Family verify -TicketPath (Join-Path $sandbox 'z-v.json') -RunnerPath $runnerArgs -Force
$zSec = ''
try { $zSec = [System.IO.File]::ReadAllText($zArgFile, [System.Text.Encoding]::UTF8) } catch { $zSec = '' }
Check 'z22 the light family asks for eight suites, never -Verify' ($zSec -match '-Suites' -and $zSec -notmatch '(?:^|\s)-Verify(?:\s|$)' -and @(($zSec -split '[,;\s]+') | Where-Object { $_ -match 'test-.*\.ps1$' }).Count -eq 8) $zSec
$env:FV_ARGS_OUT = $zArgFile
$null = Invoke-PsSuitesTick -RepoDir $root -Family verify2 -TicketPath (Join-Path $sandbox 'z-v2.json') -RunnerPath $runnerArgs -Force
$zSec2 = ''
try { $zSec2 = [System.IO.File]::ReadAllText($zArgFile, [System.Text.Encoding]::UTF8) } catch { $zSec2 = '' }
Check 'z23 the heavy family asks for exactly its one sandbox' ($zSec2 -match '-Suites' -and @(($zSec2 -split '[,;\s]+') | Where-Object { $_ -match 'test-.*\.ps1$' }).Count -eq 1 -and $zSec2 -match 'test-verify-ps-suites\.ps1') $zSec2
$env:FV_ARGS_OUT = $zArgFile
$null = Invoke-PsSuitesTick -RepoDir $root -Family write -TicketPath (Join-Path $sandbox 'z-w.json') -RunnerPath $runnerArgs -Force
$zW = ''
try { $zW = [System.IO.File]::ReadAllText($zArgFile, [System.Text.Encoding]::UTF8) } catch { $zW = '' }
Check 'z30 the state half asks for exactly its three suites' ($zW -match '-Suites' -and @(($zW -split '[,;\s]+') | Where-Object { $_ -match '\.ps1$' }).Count -eq 3 -and $zW -match 'test-fastpath-state-live\.ps1') $zW
$null = Invoke-PsSuitesTick -RepoDir $root -Family write2 -TicketPath (Join-Path $sandbox 'z-w2.json') -RunnerPath $runnerArgs -Force
$zW2 = ''
try { $zW2 = [System.IO.File]::ReadAllText($zArgFile, [System.Text.Encoding]::UTF8) } catch { $zW2 = '' }
Check 'z31 the face half asks for its four suites only' ($zW2 -match '-Suites' -and @(($zW2 -split '[,;\s]+') | Where-Object { $_ -match '\.ps1$' }).Count -eq 4 -and $zW2 -match 'test-qa-rotation\.ps1' -and $zW2 -notmatch 'test-fastpath-state-live\.ps1') $zW2
Remove-Item 'Env:\FV_ARGS_OUT' -ErrorAction SilentlyContinue

# main#117 turn rule: when both write halves are due, the state half runs and
# the face half defers - one round never pays both.
Remove-Item -LiteralPath $ticket -Force -ErrorAction SilentlyContinue
Remove-Item -LiteralPath $w2ticket -Force -ErrorAction SilentlyContinue
$zw1 = Run-Verify
$zw1w = @(Get-PsLine $zw1); $zw1f = @(Get-Write2Line $zw1)
Check 'z32 a write-side run defers the face half' ("$($zw1w[0])" -match 'ran=\d+ms' -and "$($zw1f[0])" -match 'deferred \(write-side ran \d+ms this tick\)') "$($zw1w[0]) | $($zw1f[0])"
$zw2 = Run-Verify
$zw2w = @(Get-PsLine $zw2); $zw2f = @(Get-Write2Line $zw2)
Check 'z33 the face half then takes its own turn' ("$($zw2w[0])" -match 'cached=' -and "$($zw2f[0])" -match 'ran=\d+ms') "$($zw2w[0]) | $($zw2f[0])"

# A family whose suite count changed (main#99: 9 -> 8) must not average the old
# durations into the new baseline, or the budget WARN keeps ringing for three
# runs after the fix that caused it.
$zrRunner = New-Runner 'runner-9suites.ps1' @'
Write-Output 'PS SUITES suites=9 assertions=1 counted=9 failing=0 parity=skipped'
exit 0
'@
$zrTicket = Join-Path $sandbox 'z-reset.json'
$null = Invoke-PsSuitesTick -RepoDir $root -Family verify2 -TicketPath $zrTicket -RunnerPath $zrRunner -Force
$null = Invoke-PsSuitesTick -RepoDir $root -Family verify2 -TicketPath $zrTicket -RunnerPath $zrRunner -Force
$zrThird = Invoke-PsSuitesTick -RepoDir $root -Family verify2 -TicketPath $zrTicket -RunnerPath $runnerGreen -Force
Check 'z24 a changed suite count restarts the baseline' (@(("$($zrThird.runs)" -split ',')).Count -eq 1) ("runs=" + $zrThird.runs)

# r766: a ticket whose last run never produced a summary records suites=0, and
# its duration (330 ms of "1 suite file(s) missing") is not a sample of the
# family. Measured live: the heavy family's baseline read 26.7 s against a real
# 79.5 s run - the exact silence the baseline column exists to break.
$zrBad = New-Runner 'runner-nosummary.ps1' @'
Write-Output 'boom: no summary line'
exit 3
'@
$zrBadTicket = Join-Path $sandbox 'z-reset0.json'
$null = Invoke-PsSuitesTick -RepoDir $root -Family verify2 -TicketPath $zrBadTicket -RunnerPath $zrBad -Force
$zrZero = Get-PsSuitesTicket -Path $zrBadTicket
$zrAfter = Invoke-PsSuitesTick -RepoDir $root -Family verify2 -TicketPath $zrBadTicket -RunnerPath $runnerGreen -Force
Check 'z25 an unreadable run leaves suites=0 in the ticket' ($null -ne $zrZero -and [int]$zrZero.suites -eq 0) ("suites=" + [int]$zrZero.suites)
Check 'z26 a real run after it restarts the baseline' (@(("$($zrAfter.runs)" -split ',')).Count -eq 1) ("runs=" + $zrAfter.runs)

# ---------- za: the round can say where its time went (main#104, r768) ------
# b3 above asserts the cached round stays under 3 s. Without a decomposition that
# number is only actionable as "raise it" - and main#104 forbids raising it. The
# ledger exists so the next budget decision is arithmetic instead of intuition;
# measured r768 it already corrected the intuition hard (shot-census 1.41-1.45 s
# of a 2.10 s round, while the newest per-tick item, the census, was 106 ms).
# Two properties matter: the parts must reconcile with the total, or the numbers
# are decoration, and the line must not look like a section verdict, or it would
# be counted as one by every `^VERIFY (HEALTH|WARN): <section>:` filter above.
$za = Run-Verify
$zaCost = @($za.lines | Where-Object { $_ -like 'VERIFY COST:*' })
Check 'za1 a round prints exactly one cost line' ($zaCost.Count -eq 1) ('count=' + $zaCost.Count)
$zaText = [string]$zaCost[0]
$zaTotalM = [regex]::Match($zaText, 'total=(\d+)ms')
Check 'za2 the line states a total in ms' ($zaTotalM.Success) $zaText
$zaSum = 0
foreach ($m in [regex]::Matches($zaText, '(?:^|\s)([a-z][a-z0-9-]*)=(\d+)ms')) {
    if ($m.Groups[1].Value -eq 'total') { continue }
    $zaSum += [int]$m.Groups[2].Value
}
Check 'za3 the parts reconcile with the total' ($zaTotalM.Success -and $zaSum -eq [int]$zaTotalM.Groups[1].Value) ('sum=' + $zaSum + ' total=' + $zaTotalM.Groups[1].Value)
Check 'za4 the cost line is not a section verdict' (-not ($zaText -like 'VERIFY HEALTH:*') -and -not ($zaText -like 'VERIFY WARN:*')) $zaText
Check 'za5 the sections and their order are named' ($zaText -match 'state=\d+ms' -and $zaText -match 'shot-census=\d+ms' -and $zaText -match 'families=\d+ms' -and $zaText -match 'rest=\d+ms') $zaText
Check 'za6 the cost line never leaks the red token' (-not ($zaText -match '(?i)fail')) $zaText

Remove-Item -LiteralPath $sandbox -Recurse -Force -ErrorAction SilentlyContinue

Write-Output ('RESULT pass=' + ($script:checks - $script:fails) + ' fail=' + $script:fails)
if ($script:fails -gt 0) { exit 1 }
Write-Output 'ALL PASS'
exit 0