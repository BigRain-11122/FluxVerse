# devloop-r198-fastcheck-test.ps1 - sandbox for check-fastpath.ps1 (T-FV-118)
# ASCII-only body. Chk cond-first (sandbox family law, r192). Child exit codes
# via powershell.exe -File + $LASTEXITCODE (r66 native exit law). Fixtures and
# throwaway git repos live in $env:TEMP; production files are never written by
# the checker (read-only law asserted in A0 and proven by A5 real runs).

$ErrorActionPreference = 'Stop'

$repoDir = Split-Path -Parent $PSScriptRoot
$checker = Join-Path $repoDir 'Tools\devloop\check-fastpath.ps1'
$sbDir   = Join-Path $env:TEMP 'fv-r198-check-sandbox'
$today   = Get-Date -Format 'yyyyMMdd'

if (Test-Path -LiteralPath $sbDir) { Remove-Item -LiteralPath $sbDir -Recurse -Force }
New-Item -ItemType Directory -Path $sbDir | Out-Null

$script:pass = 0
$script:fail = 0
function Chk
{
    param([bool]$Cond, [string]$Name)
    if ($Cond) { $script:pass++ } else { $script:fail++; Write-Output ('  FAIL: ' + $Name) }
}

function Invoke-Check
{
    # '' = no -Root at all (production self-locate); else fixture repo root.
    param([string]$RootParam)
    if ([string]::IsNullOrEmpty($RootParam)) {
        $out = & powershell.exe -NoProfile -ExecutionPolicy Bypass -File $checker
    } else {
        $out = & powershell.exe -NoProfile -ExecutionPolicy Bypass -File $checker -Root $RootParam
    }
    return @{ Exit = $LASTEXITCODE; Lines = @($out) }
}

function Invoke-CheckRepoRoot
{
    param([string]$RootParam, [string]$RepoRootParam)
    $out = & powershell.exe -NoProfile -ExecutionPolicy Bypass -File $checker -Root $RootParam -RepoRoot $RepoRootParam
    return @{ Exit = $LASTEXITCODE; Lines = @($out) }
}

function Get-Hash12 { param([string]$P) (Get-FileHash -LiteralPath $P -Algorithm SHA256).Hash.Substring(0,12).ToUpper() }

function New-TickOk
{
    $l = New-Object System.Collections.Generic.List[string]
    for ($i = 1; $i -le 45; $i++) {
        $l.Add('[2026-09-26 10:00:00] FluxVerseTick round start')
        $l.Add('  scan: perceptor v0.7 done: events +67 quarantined=0 fleet=6 tasks=82')
        $l.Add('  scan:   probe census: OK')
        $l.Add('  gate: VERIFY PASS')
        $l.Add('  gate: PASS')
        $l.Add('[2026-09-26 10:00:10] round end')
    }
    return $l.ToArray()
}

function New-HbOk
{
    $l = New-Object System.Collections.Generic.List[string]
    for ($i = 1; $i -le 6; $i++) {
        $l.Add('2026-09-26 10:' + $i.ToString('00') + ':00 devloop: round done exit=0')
    }
    return $l.ToArray()
}

function Build-Fixture
{
    # layout: <case>\{cph4,docs,media} + <case>\x\repo -> upTwo derivation
    # (Split-Path parent of parent of repo) lands on <case>, so passing ONLY
    # -Root exercises every default-path derivation at once.
    param([string[]]$TickLines, [string[]]$HbLines, [string[]]$StateExtra, [string]$Name)
    $case = Join-Path $sbDir $Name
    $repo = Join-Path $case 'x\repo'
    $logs = Join-Path $repo 'logs'
    New-Item -ItemType Directory -Path (Join-Path $case 'cph4') -Force | Out-Null
    New-Item -ItemType Directory -Path (Join-Path $case 'docs') -Force | Out-Null
    New-Item -ItemType Directory -Path (Join-Path $case 'media\BigStream') -Force | Out-Null
    New-Item -ItemType Directory -Path $logs -Force | Out-Null
    [IO.File]::WriteAllText((Join-Path $repo 'TECH.md'), "TECH fixture body`r`nsecond line")
    [IO.File]::WriteAllText((Join-Path $case 'cph4\evolution-ledger.md'), "LEDGER fixture body`r`n")
    [IO.File]::WriteAllText((Join-Path $case 'docs\decisions.md'), "DEC fixture body`r`n")
    [IO.File]::WriteAllText((Join-Path $case 'docs\orders.md'), "ORDERS fixture body`r`n")
    [IO.File]::WriteAllText((Join-Path $case 'media\BigStream\notes.txt'), 'not html')
    [IO.File]::WriteAllLines((Join-Path $logs ('tick-' + $today + '.log')), $TickLines)
    [IO.File]::WriteAllLines((Join-Path $logs 'devloop-heartbeat.txt'), $HbLines)
    $st = New-Object System.Collections.Generic.List[string]
    $st.Add('tech_sha12='     + (Get-Hash12 (Join-Path $repo 'TECH.md')))
    $st.Add('ledger_sha12='   + (Get-Hash12 (Join-Path $case 'cph4\evolution-ledger.md')))
    $st.Add('dec_sha12='      + (Get-Hash12 (Join-Path $case 'docs\decisions.md')))
    $st.Add('orders_sha12='   + (Get-Hash12 (Join-Path $case 'docs\orders.md')))
    foreach ($xl in $StateExtra) { $st.Add($xl) }
    [IO.File]::WriteAllLines((Join-Path $logs 'devloop-fastpath-state.txt'), $st.ToArray())
    # throwaway git repo: .gitignore hides /logs/ and /TECH.md so fixture
    # mutations never dirty c2 (only tracked.txt does, for the dirty tests).
    [IO.File]::WriteAllText((Join-Path $repo '.gitignore'), "/logs/`r`n/TECH.md`r`n")
    [IO.File]::WriteAllText((Join-Path $repo 'tracked.txt'), 'v1')
    & git -C $repo init | Out-Null
    if ($LASTEXITCODE -ne 0) { throw 'fixture git init failed' }
    & git -C $repo add .gitignore tracked.txt | Out-Null
    if ($LASTEXITCODE -ne 0) { throw 'fixture git add failed' }
    & git -C $repo -c user.name=sb -c user.email=sb@local commit -m init | Out-Null
    if ($LASTEXITCODE -ne 0) { throw 'fixture git commit failed' }
    return @{ Case = $case; Repo = $repo }
}

# ---------------- A0 static ----------------
Write-Output 'A0 static'
Chk (Test-Path -LiteralPath $checker) 'A0.1 checker exists'
$src = [IO.File]::ReadAllText($checker)
$bytes = [IO.File]::ReadAllBytes($checker)
$nonAscii = @($bytes | Where-Object { $_ -gt 127 }).Count
Chk ($nonAscii -eq 0) ('A0.2 checker pure ASCII (non-ascii bytes=' + $nonAscii + ')')
foreach ($pn in @('Root','StatePath','TickPath','HeartbeatPath','TechPath','LedgerPath','DecPath','OrdersPath','P16Dir','RepoRoot')) {
    Chk ($src -match [regex]::Escape($pn)) ('A0.3 param present: ' + $pn)
}
Chk ($src -match [regex]::Escape(':(exclude)world-public')) 'A0.4 r69 exemption pathspec built in'
$writeHit = @('Set-Content','Out-File','Add-Content','New-Item','Remove-Item','Move-Item','Copy-Item','Clear-Content','Tee-Object','WriteAllText','WriteAllLines') | Where-Object { $src -match [regex]::Escape($_) }
Chk (@($writeHit).Count -eq 0) ('A0.5 read-only: zero write-family cmdlets (hits=' + (@($writeHit).Count) + ' ' + ((@($writeHit) -join ',') ) + ')')
$autoHit = @('pid','args','input','host','error') | Where-Object { $src -match ('\$' + $_ + '\s*=') }
Chk (@($autoHit).Count -eq 0) ('A0.6 no auto-variable assignment (hits=' + (@($autoHit).Count) + ')')

# ---------------- A1 all-quiet fixture (all defaults via -Root only) ----------------
Write-Output 'A1 all-quiet'
$f = Build-Fixture -Name 'a1-quiet' -TickLines (New-TickOk) -HbLines (New-HbOk) -StateExtra @('junk fifth line tolerated=1')
if ($null -eq $f) { throw 'a1 fixture build failed' }
$tech12 = Get-Hash12 (Join-Path $f.Repo 'TECH.md')
$led12  = Get-Hash12 (Join-Path $f.Case 'cph4\evolution-ledger.md')
$dec12  = Get-Hash12 (Join-Path $f.Case 'docs\decisions.md')
$ord12  = Get-Hash12 (Join-Path $f.Case 'docs\orders.md')
$r = Invoke-Check -RootParam $f.Repo
Chk ($r.Exit -eq 0) ('A1.1 exit 0 (exit=' + $r.Exit + ')')
Chk ($r.Lines.Count -eq 9) ('A1.2 nine lines (count=' + $r.Lines.Count + ')')
Chk ($r.Lines[0] -eq 'c1-red: QUIET fails=0 qmax=0 hb_streak=0') ('A1.3 c1 line [' + $r.Lines[0] + ']')
Chk ($r.Lines[1] -eq 'c2-tree: QUIET dirty=0') ('A1.4 c2 line [' + $r.Lines[1] + ']')
Chk ($r.Lines[2] -eq ('c3-ledger: QUIET sha=' + $led12)) ('A1.5 c3 line [' + $r.Lines[2] + ']')
Chk ($r.Lines[3] -eq ('c4-tech: QUIET sha=' + $tech12)) ('A1.6 c4 line [' + $r.Lines[3] + ']')
Chk ($r.Lines[4] -eq 'c5-p16: QUIET html=0') ('A1.7 c5 line [' + $r.Lines[4] + ']')
Chk ($r.Lines[5] -eq ('c6-dec: QUIET sha=' + $dec12)) ('A1.8 c6 line [' + $r.Lines[5] + ']')
Chk ($r.Lines[6] -eq ('c7-orders: QUIET sha=' + $ord12)) ('A1.9 c7 line [' + $r.Lines[6] + ']')
Chk ($r.Lines[7] -eq 'state: OK') ('A1.10 state line [' + $r.Lines[7] + ']')
Chk ($r.Lines[8] -eq 'VERDICT: FASTPATH all-quiet') ('A1.11 verdict [' + $r.Lines[8] + ']')

# ---------------- A2 red family (fresh fixture per case) ----------------
Write-Output 'A2 red family'

# A2.1 tick log missing
$f = Build-Fixture -Name 'a21-tick-missing' -TickLines (New-TickOk) -HbLines (New-HbOk)
Remove-Item -LiteralPath (Join-Path $f.Repo ('logs\tick-' + $today + '.log')) -Force
$r = Invoke-Check -RootParam $f.Repo
Chk ($r.Exit -eq 2) ('A2.1a exit 2 (exit=' + $r.Exit + ')')
Chk ($r.Lines[0] -eq 'c1-red: TRIGGER ticklog-missing') ('A2.1b c1 line [' + $r.Lines[0] + ']')
Chk ($r.Lines[8] -match 'c1-red') 'A2.1c verdict lists c1-red'

# A2.2 gate FAIL + quarantined>0 in tail
$t = New-Object System.Collections.Generic.List[string]
foreach ($x in (New-TickOk)) { $t.Add($x) }
$t.Add('  gate: FAIL')
$t.Add('  scan: perceptor done: events +5 quarantined=3 fleet=2 tasks=4')
$f = Build-Fixture -Name 'a22-gate-fail' -TickLines $t.ToArray() -HbLines (New-HbOk)
$r = Invoke-Check -RootParam $f.Repo
Chk ($r.Lines[0] -eq 'c1-red: TRIGGER gate-probe-fail=1 quarantined=3') ('A2.2 c1 line [' + $r.Lines[0] + ']')

# A2.3 probe FAIL
$t = New-Object System.Collections.Generic.List[string]
foreach ($x in (New-TickOk)) { $t.Add($x) }
$t.Add('  scan:   probe census: FAIL')
$f = Build-Fixture -Name 'a23-probe-fail' -TickLines $t.ToArray() -HbLines (New-HbOk)
$r = Invoke-Check -RootParam $f.Repo
Chk ($r.Lines[0] -eq 'c1-red: TRIGGER gate-probe-fail=1') ('A2.3 c1 line [' + $r.Lines[0] + ']')

# A2.4 tail-40 boundary: FAIL 55 lines from end = out of scope; FAIL 36 from end = in scope
$t = New-Object System.Collections.Generic.List[string]
for ($i = 1; $i -le 60; $i++) { $t.Add('line ' + $i + ' ok quarantined=0') }
$t[4]  = 'gate: FAIL'       # index 4 of 60 -> 55 from end -> outside tail 40
$t[24] = 'probe census: FAIL'  # index 24 of 60 -> 36 from end -> inside tail 40
$f = Build-Fixture -Name 'a24-tail-boundary' -TickLines $t.ToArray() -HbLines (New-HbOk)
$r = Invoke-Check -RootParam $f.Repo
Chk ($r.Lines[0] -eq 'c1-red: TRIGGER gate-probe-fail=1') ('A2.4 boundary counts only inside-tail FAIL [' + $r.Lines[0] + ']')

# A2.5 heartbeat trailing streak of 2 non-zero exits = trigger
$h = New-Object System.Collections.Generic.List[string]
for ($i = 1; $i -le 4; $i++) { $h.Add('2026-09-26 11:' + $i.ToString('00') + ':00 devloop: round done exit=0') }
$h.Add('2026-09-26 11:05:00 devloop: round done exit=1')
$h.Add('2026-09-26 11:06:00 devloop: round done exit=1')
$f = Build-Fixture -Name 'a25-hb-streak2' -TickLines (New-TickOk) -HbLines $h.ToArray()
$r = Invoke-Check -RootParam $f.Repo
Chk ($r.Lines[0] -eq 'c1-red: TRIGGER hb-bad-streak=2') ('A2.5 c1 line [' + $r.Lines[0] + ']')

# A2.6 heartbeat single bad entry = NOT a streak = quiet (r162/r181 precedent)
$h = New-Object System.Collections.Generic.List[string]
for ($i = 1; $i -le 5; $i++) { $h.Add('2026-09-26 11:' + $i.ToString('00') + ':00 devloop: round done exit=0') }
$h.Add('2026-09-26 11:06:00 devloop: round done exit=1')
$f = Build-Fixture -Name 'a26-hb-single' -TickLines (New-TickOk) -HbLines $h.ToArray()
$r = Invoke-Check -RootParam $f.Repo
Chk ($r.Lines[0] -eq 'c1-red: QUIET fails=0 qmax=0 hb_streak=1') ('A2.6 single bad = quiet with visible streak [' + $r.Lines[0] + ']')

# A2.7 heartbeat timeout words, streak of 2
$h = New-Object System.Collections.Generic.List[string]
for ($i = 1; $i -le 3; $i++) { $h.Add('2026-09-26 12:' + $i.ToString('00') + ':00 devloop: round done exit=0') }
$h.Add('2026-09-26 12:04:00 devloop: round timeout killed')
$h.Add('2026-09-26 12:05:00 devloop: round timeout killed')
$f = Build-Fixture -Name 'a27-hb-timeout' -TickLines (New-TickOk) -HbLines $h.ToArray()
$r = Invoke-Check -RootParam $f.Repo
Chk ($r.Lines[0] -eq 'c1-red: TRIGGER hb-bad-streak=2') ('A2.7 timeout streak [' + $r.Lines[0] + ']')

# A2.8 legacy 3-line state (no orders key) -> c0 BAD + four SHA lines state-bad
$f = Build-Fixture -Name 'a28-legacy-state' -TickLines (New-TickOk) -HbLines (New-HbOk)
$stP = Join-Path $f.Repo 'logs\devloop-fastpath-state.txt'
$st3 = New-Object System.Collections.Generic.List[string]
$st3.Add('tech_sha12='   + (Get-Hash12 (Join-Path $f.Repo 'TECH.md')))
$st3.Add('ledger_sha12=' + (Get-Hash12 (Join-Path $f.Case 'cph4\evolution-ledger.md')))
$st3.Add('dec_sha12='    + (Get-Hash12 (Join-Path $f.Case 'docs\decisions.md')))
[IO.File]::WriteAllLines($stP, $st3.ToArray())
$r = Invoke-Check -RootParam $f.Repo
Chk ($r.Exit -eq 2) ('A2.8a exit 2 (exit=' + $r.Exit + ')')
Chk ($r.Lines[7] -eq 'state: BAD state-missing-key:orders_sha12') ('A2.8b state line [' + $r.Lines[7] + ']')
Chk ($r.Lines[2] -eq 'c3-ledger: TRIGGER state-bad') ('A2.8c c3 state-bad [' + $r.Lines[2] + ']')
Chk ($r.Lines[3] -eq 'c4-tech: TRIGGER state-bad') 'A2.8d c4 state-bad'
Chk ($r.Lines[4] -eq 'c5-p16: QUIET html=0') 'A2.8e c5 independent of state (stays quiet)'
Chk ($r.Lines[5] -eq 'c6-dec: TRIGGER state-bad') 'A2.8f c6 state-bad'
Chk ($r.Lines[6] -eq 'c7-orders: TRIGGER state-bad') 'A2.8g c7 state-bad'
Chk ($r.Lines[8] -eq 'VERDICT: FULL-ROUND triggers=5 (c0-state,c3-ledger,c4-tech,c6-dec,c7-orders)') ('A2.8h verdict [' + $r.Lines[8] + ']')

# A2.9 state file missing entirely
$f = Build-Fixture -Name 'a29-state-missing' -TickLines (New-TickOk) -HbLines (New-HbOk)
Remove-Item -LiteralPath (Join-Path $f.Repo 'logs\devloop-fastpath-state.txt') -Force
$r = Invoke-Check -RootParam $f.Repo
Chk ($r.Lines[7] -eq 'state: BAD state-missing') ('A2.9 state line [' + $r.Lines[7] + ']')

# A2.10 bad state value (11 hex) -> key treated missing
$f = Build-Fixture -Name 'a210-bad-value' -TickLines (New-TickOk) -HbLines (New-HbOk)
$stP = Join-Path $f.Repo 'logs\devloop-fastpath-state.txt'
[IO.File]::WriteAllText($stP, "tech_sha12=ABCDEF01234`r`nledger_sha12=222222222222`r`ndec_sha12=333333333333`r`norders_sha12=444444444444")
$r = Invoke-Check -RootParam $f.Repo
Chk ($r.Lines[7] -eq 'state: BAD state-missing-key:tech_sha12') ('A2.10 state line [' + $r.Lines[7] + ']')

# A2.11 TECH.md disk change -> exact c4 mismatch line, others quiet
$f = Build-Fixture -Name 'a211-tech-mismatch' -TickLines (New-TickOk) -HbLines (New-HbOk)
$techP = Join-Path $f.Repo 'TECH.md'
$techOld = Get-Hash12 $techP
[IO.File]::WriteAllText($techP, "TECH fixture body`r`nsecond line`r`nEDITED")
$techNew = Get-Hash12 $techP
$r = Invoke-Check -RootParam $f.Repo
Chk ($r.Lines[3] -eq ('c4-tech: TRIGGER state=' + $techOld + ' disk=' + $techNew)) ('A2.11a c4 exact line [' + $r.Lines[3] + ']')
Chk ($r.Lines[2] -match '^c3-ledger: QUIET') 'A2.11b c3 still quiet'
Chk ($r.Exit -eq 2) 'A2.11c exit 2'

# A2.12 ledger/dec/orders sequential mismatch + restore
$f = Build-Fixture -Name 'a212-sha-family' -TickLines (New-TickOk) -HbLines (New-HbOk)
$ledP  = Join-Path $f.Case 'cph4\evolution-ledger.md'
$decP  = Join-Path $f.Case 'docs\decisions.md'
$ordP  = Join-Path $f.Case 'docs\orders.md'
$ledO = [IO.File]::ReadAllText($ledP)
[IO.File]::WriteAllText($ledP, $ledO + 'extra')
$r = Invoke-Check -RootParam $f.Repo
Chk ($r.Lines[2] -match ('^c3-ledger: TRIGGER state=' + $led12 + ' disk=[0-9A-F]{12}$')) ('A2.12a ledger mismatch triggers [' + $r.Lines[2] + ']')
[IO.File]::WriteAllText($ledP, $ledO)
$decO = [IO.File]::ReadAllText($decP)
[IO.File]::WriteAllText($decP, $decO + 'extra')
$r = Invoke-Check -RootParam $f.Repo
Chk ($r.Lines[5] -match '^c6-dec: TRIGGER') 'A2.12b dec mismatch triggers'
Chk ($r.Lines[2] -match '^c3-ledger: QUIET') 'A2.12c ledger restored quiet'
[IO.File]::WriteAllText($decP, $decO)
$ordO = [IO.File]::ReadAllText($ordP)
[IO.File]::WriteAllText($ordP, $ordO + 'extra')
$r = Invoke-Check -RootParam $f.Repo
Chk ($r.Lines[6] -match '^c7-orders: TRIGGER') 'A2.12d orders mismatch triggers'
[IO.File]::WriteAllText($ordP, $ordO)
$r = Invoke-Check -RootParam $f.Repo
Chk ($r.Exit -eq 0) ('A2.12e all restored -> FASTPATH again (exit=' + $r.Exit + ')')

# A2.13 TECH.md missing on disk -> disk-missing
$f = Build-Fixture -Name 'a213-disk-missing' -TickLines (New-TickOk) -HbLines (New-HbOk)
Remove-Item -LiteralPath (Join-Path $f.Repo 'TECH.md') -Force
$r = Invoke-Check -RootParam $f.Repo
Chk ($r.Lines[3] -eq 'c4-tech: TRIGGER disk-missing') ('A2.13 c4 disk-missing [' + $r.Lines[3] + ']')

# A2.14 c5 unlock: html appears -> trigger
$f = Build-Fixture -Name 'a214-p16-unlock' -TickLines (New-TickOk) -HbLines (New-HbOk)
[IO.File]::WriteAllText((Join-Path $f.Case 'media\BigStream\panel.html'), '<html></html>')
New-Item -ItemType Directory -Path (Join-Path $f.Case 'media\BigStream\output\sub') -Force | Out-Null
[IO.File]::WriteAllText((Join-Path $f.Case 'media\BigStream\output\sub\deep.html'), '<html></html>')
$r = Invoke-Check -RootParam $f.Repo
Chk ($r.Lines[4] -eq 'c5-p16: TRIGGER p16-unlock html=2') ('A2.14a recursive html count [' + $r.Lines[4] + ']')
Chk ($r.Exit -eq 2) 'A2.14b exit 2'

# A2.15 BigStream dir absent -> quiet no-dir
$f = Build-Fixture -Name 'a215-p16-nodir' -TickLines (New-TickOk) -HbLines (New-HbOk)
Remove-Item -LiteralPath (Join-Path $f.Case 'media\BigStream') -Recurse -Force
$r = Invoke-Check -RootParam $f.Repo
Chk ($r.Lines[4] -eq 'c5-p16: QUIET no-dir') ('A2.15 c5 no-dir [' + $r.Lines[4] + ']')

# ---------------- A3 tree semantics (r69 exemption proof) ----------------
Write-Output 'A3 tree semantics'
$f = Build-Fixture -Name 'a31-exemption' -TickLines (New-TickOk) -HbLines (New-HbOk)
$wpDir = Join-Path $f.Repo 'world-public'
New-Item -ItemType Directory -Path $wpDir -Force | Out-Null
[IO.File]::WriteAllText((Join-Path $wpDir 'city-snapshot.json'), '{"changed":true}')
$raw = & git -C $f.Repo status --porcelain
Chk ((@($raw).Count -gt 0) -and ("$raw" -match 'world-public')) ('A3.1a raw status DOES list world-public (exemption has real work) [' + ("$raw") + ']')
$r = Invoke-Check -RootParam $f.Repo
Chk ($r.Lines[1] -eq 'c2-tree: QUIET dirty=0') ('A3.1b c2 exempts world-public [' + $r.Lines[1] + ']')
Chk ($r.Exit -eq 0) ('A3.1c whole verdict stays FASTPATH (exit=' + $r.Exit + ')')
[IO.File]::WriteAllText((Join-Path $f.Repo 'tracked.txt'), 'v2')
$r = Invoke-Check -RootParam $f.Repo
Chk ($r.Lines[1] -eq 'c2-tree: TRIGGER dirty=1') ('A3.2 tracked dirt triggers [' + $r.Lines[1] + ']')
Chk ($r.Exit -eq 2) 'A3.2b exit 2'
$r = Invoke-CheckRepoRoot -RootParam $f.Repo -RepoRootParam $f.Case
Chk ($r.Lines[1] -match '^c2-tree: TRIGGER git-exit=') ('A3.3 non-repo RepoRoot -> git fail trigger [' + $r.Lines[1] + ']')

# ---------------- A4 determinism (fixture double-run) ----------------
Write-Output 'A4 determinism'
$f = Build-Fixture -Name 'a4-determinism' -TickLines (New-TickOk) -HbLines (New-HbOk)
$r1 = Invoke-Check -RootParam $f.Repo
$r2 = Invoke-Check -RootParam $f.Repo
Chk ($r1.Exit -eq $r2.Exit) 'A4.1 same exit code'
Chk ((($r1.Lines -join "`n") -eq ($r2.Lines -join "`n"))) 'A4.2 byte-identical output lines'

# ---------------- A5 production real-machine dual-run (no params) ----------------
Write-Output 'A5 production real runs'
$grp = Split-Path -Parent (Split-Path -Parent $repoDir)
$realTech = Get-Hash12 (Join-Path $repoDir 'TECH.md')
$realLed  = Get-Hash12 (Join-Path $grp 'cph4\evolution-ledger.md')
$realDec  = Get-Hash12 (Join-Path $grp 'docs\decisions.md')
$realOrd  = Get-Hash12 (Join-Path $grp 'docs\orders.md')
$p1 = Invoke-Check -RootParam ''
$p2 = Invoke-Check -RootParam ''
Write-Output 'A5 real-run lines (round-start comparison evidence):'
foreach ($ln in $p1.Lines) { Write-Output ('  | ' + $ln) }
Chk ((($p1.Exit -eq 0) -or ($p1.Exit -eq 2))) ('A5.1 real exit in {0,2} (exit=' + $p1.Exit + ')')
Chk ($p1.Exit -eq $p2.Exit) 'A5.2 double-run same exit'
Chk ((($p1.Lines -join "`n") -eq ($p2.Lines -join "`n"))) 'A5.3 double-run byte-identical'
Chk ($p1.Lines.Count -eq 9) ('A5.4 nine lines (count=' + $p1.Lines.Count + ')')
Chk ($p1.Lines[0] -match '^c1-red: (QUIET|TRIGGER)') 'A5.5 c1 label format'
Chk ($p1.Lines[1] -match '^c2-tree: (QUIET|TRIGGER)') 'A5.6 c2 label format'
Chk ($p1.Lines[2] -match '^c3-ledger: (QUIET|TRIGGER)') 'A5.7 c3 label format'
Chk ($p1.Lines[3] -match ('^c4-tech: (QUIET sha=' + [regex]::Escape($realTech) + '|TRIGGER (state-bad|disk-missing|state=[0-9A-F]{12} disk=' + [regex]::Escape($realTech) + '))')) 'A5.8 c4 line carries live TECH.md hash'
Chk ($p1.Lines[2] -match [regex]::Escape($realLed)) 'A5.9 c3 line carries live ledger hash'
Chk ($p1.Lines[5] -match [regex]::Escape($realDec)) 'A5.10 c6 line carries live decisions hash'
Chk ($p1.Lines[6] -match [regex]::Escape($realOrd)) 'A5.11 c7 line carries live orders hash'
Chk ($p1.Lines[7] -match '^state: (OK|BAD )') 'A5.12 state line format'
Chk (($p1.Lines[8] -eq 'VERDICT: FASTPATH all-quiet') -or ($p1.Lines[8] -match '^VERDICT: FULL-ROUND triggers=\d+ \(c[0-9a-z-]+(,c[0-9a-z-]+)*\)$')) 'A5.13 verdict format'
Chk ((($p1.Exit -eq 0) -and ($p1.Lines[8] -eq 'VERDICT: FASTPATH all-quiet')) -or (($p1.Exit -eq 2) -and ($p1.Lines[8] -match '^VERDICT: FULL-ROUND'))) 'A5.14 verdict/exit consistency'

Write-Output ('PASS=' + $script:pass + ' FAIL=' + $script:fail)
if ($script:fail -eq 0) { Write-Output 'ALL GREEN'; exit 0 } else { Write-Output 'HAS RED'; exit 1 }
