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

# Seed the verify-family ticket before the write-side cases: those assert that
# a cached tick stays under 3 s, and a due verify run would spend that budget
# on a fixture spawn. The family gets its own cases (k..r) below.
. $module
$null = Invoke-PsSuitesTick -RepoDir $root -Family verify -TicketPath $vticket -RunnerPath $runnerGreen -TimeoutSec 8

function Clear-PsEnv {
    foreach ($k in @('FLUXVERSE_PS_SUITES', 'FLUXVERSE_PS_SUITES_RUNNER', 'FLUXVERSE_PS_SUITES_TICKET',
                     'FLUXVERSE_PS_SUITES_TIMEOUT', 'FLUXVERSE_PS_SUITES_FORCE',
                     'FLUXVERSE_PS_SUITES_VERIFY', 'FLUXVERSE_PS_SUITES_VERIFY_RUNNER',
                     'FLUXVERSE_PS_SUITES_VERIFY_TICKET', 'FLUXVERSE_PS_SUITES_VERIFY_TIMEOUT',
                     'FLUXVERSE_PS_SUITES_VERIFY_FORCE', 'FLUXVERSE_PS_SUITES_CHILD')) {
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
    $env:FLUXVERSE_PS_SUITES_VERIFY_TICKET = $vticket
    $env:FLUXVERSE_PS_SUITES_VERIFY_RUNNER = $script:vrunner
    if ($script:vtimeout) { $env:FLUXVERSE_PS_SUITES_VERIFY_TIMEOUT = [string]$script:vtimeout }
    if ($script:voff) { $env:FLUXVERSE_PS_SUITES_VERIFY = 'off' }
    if ($script:vforce) { $env:FLUXVERSE_PS_SUITES_VERIFY_FORCE = '1' }
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

# The verify family prints its own label, so it can never be mistaken for the
# write-side line (and the write-side assertions above keep their exact shape).
function Get-VerifyLine($out) {
    return @($out.lines | Where-Object { $_ -match '^VERIFY (HEALTH|WARN): ps-suites-verify:' })
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
$vDefs = @(Get-PsSuitesTickDefaults -Family verify)
Check 'r1 write family still guards its ten sources' ($wDefs.Count -eq 10) ('count=' + $wDefs.Count)
Check 'r2 verify family guards the gate it proves' ($vDefs -contains 'Tools\perceptor\verify.ps1') (($vDefs -join ','))
Check 'r3 verify family is wider than the write list' ($vDefs.Count -gt $wDefs.Count) ('verify=' + $vDefs.Count + ' write=' + $wDefs.Count)
$overlap = @($wDefs | Where-Object { $vDefs -contains $_ })
Check 'r4 the two source sets overlap only on the shared runner' ($overlap.Count -eq 1 -and $overlap[0] -eq 'Tools\devloop\run-ps-suites.ps1') (($overlap -join ','))
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

Remove-Item -LiteralPath $sandbox -Recurse -Force -ErrorAction SilentlyContinue

Write-Output ('RESULT pass=' + ($script:checks - $script:fails) + ' fail=' + $script:fails)
if ($script:fails -gt 0) { exit 1 }
Write-Output 'ALL PASS'
exit 0