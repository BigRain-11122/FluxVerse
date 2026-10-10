# devloop-r229-midnight-test.ps1 - sandbox for the c1 midnight
# pre-first-tick window fallback (T-FV-137). ASCII-only body. Chk cond-first
# (sandbox family law, r192). Child exit codes via powershell.exe -File +
# $LASTEXITCODE (r66 native exit law). Fixtures live in $env:TEMP; the
# checker writes nothing anywhere (read-only law re-proven in A0).
# Fixture dates are FIXED (not the real today) so the fallback filename is
# deterministic: missing "today" = tick-20991231.log, fallback =
# tick-20991230.log. The real-clock branch is exercised by the r229
# production round itself (00:05:16 trigger observed live).

$ErrorActionPreference = 'Stop'

$repoDir = Split-Path -Parent $PSScriptRoot
$checker = Join-Path $repoDir 'Tools\devloop\check-fastpath.ps1'
$sbDir   = Join-Path $env:TEMP 'fv-r229-midnight-sandbox'

if (Test-Path -LiteralPath $sbDir) { Remove-Item -LiteralPath $sbDir -Recurse -Force }
New-Item -ItemType Directory -Path $sbDir | Out-Null

$script:pass = 0
$script:fail = 0
function Chk
{
    param([bool]$Cond, [string]$Name)
    if ($Cond) { $script:pass++ } else { $script:fail++; Write-Output ('  FAIL: ' + $Name) }
}
function Get-Hash12 { param([string]$P) (Get-FileHash -LiteralPath $P -Algorithm SHA256).Hash.Substring(0,12).ToUpper() }

function Invoke-Ck
{
    param([string]$RootParam, [string]$TickPathParam, [string]$SimParam)
    $out = & powershell.exe -NoProfile -ExecutionPolicy Bypass -File $checker -Root $RootParam -TickPath $TickPathParam -SimNowHHmm $SimParam
    return @{ Exit = $LASTEXITCODE; Lines = @($out) }
}

$D1 = '20991231'   # fixture "today" (missing in window cases)
$D0 = '20991230'   # fixture "yesterday" (fallback)

function New-TickOk
{
    $l = New-Object System.Collections.Generic.List[string]
    for ($i = 1; $i -le 10; $i++) {
        $l.Add('[2099-12-30 10:00:00] FluxVerseTick round start')
        $l.Add('  scan: perceptor v0.7 done: events +67 quarantined=0 fleet=6 tasks=82')
        $l.Add('  gate: VERIFY PASS')
        $l.Add('  gate: PASS')
        $l.Add('[2099-12-30 10:00:10] round end')
    }
    return $l.ToArray()
}

function New-HbOk
{
    $l = New-Object System.Collections.Generic.List[string]
    for ($i = 1; $i -le 5; $i++) {
        $l.Add('2099-12-30 10:' + $i.ToString('00') + ':00 devloop: round done exit=0')
    }
    return $l.ToArray()
}

function Build-Fixture
{
    # layout: <case>\{cph4,docs,media} + <case>\x\repo -> upTwo derivation
    # lands on <case> (same as r198 harness). Tick files are written by the
    # caller because the name decides today/yesterday roles.
    param([string]$Name)
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
    [IO.File]::WriteAllLines((Join-Path $logs 'devloop-heartbeat.txt'), (New-HbOk))
    $st = New-Object System.Collections.Generic.List[string]
    $st.Add('tech_sha12='   + (Get-Hash12 (Join-Path $repo 'TECH.md')))
    $st.Add('ledger_sha12=' + (Get-Hash12 (Join-Path $case 'cph4\evolution-ledger.md')))
    $st.Add('dec_sha12='    + (Get-Hash12 (Join-Path $case 'docs\decisions.md')))
    $st.Add('orders_sha12=' + (Get-Hash12 (Join-Path $case 'docs\orders.md')))
    [IO.File]::WriteAllLines((Join-Path $logs 'devloop-fastpath-state.txt'), $st.ToArray())
    # throwaway git repo: .gitignore hides /logs/ and /TECH.md so fixture
    # tick mutations never dirty c2.
    [IO.File]::WriteAllText((Join-Path $repo '.gitignore'), "/logs/`r`n/TECH.md`r`n")
    [IO.File]::WriteAllText((Join-Path $repo 'tracked.txt'), 'v1')
    & git -C $repo init | Out-Null
    if ($LASTEXITCODE -ne 0) { throw 'fixture git init failed' }
    & git -C $repo add .gitignore tracked.txt | Out-Null
    if ($LASTEXITCODE -ne 0) { throw 'fixture git add failed' }
    & git -C $repo -c user.name=sb -c user.email=sb@local commit -m init | Out-Null
    if ($LASTEXITCODE -ne 0) { throw 'fixture git commit failed' }
    return @{ Case = $case; Repo = $repo; Logs = $logs }
}

function Write-Tick
{
    param([string]$LogsDir, [string]$Date, [string[]]$Lines)
    [IO.File]::WriteAllLines((Join-Path $LogsDir ('tick-' + $Date + '.log')), $Lines)
}

# ---------------- A0 static ----------------
Write-Output 'A0 static'
Chk (Test-Path -LiteralPath $checker) 'A0.1 checker exists'
$src = [IO.File]::ReadAllText($checker)
$bytes = [IO.File]::ReadAllBytes($checker)
$nonAscii = @($bytes | Where-Object { $_ -gt 127 }).Count
Chk ($nonAscii -eq 0) ('A0.2 checker pure ASCII (non-ascii bytes=' + $nonAscii + ')')
Chk ($src -match [regex]::Escape('SimNowHHmm')) 'A0.3 SimNowHHmm param present'
Chk ($src -match [regex]::Escape('pre-tick-window')) 'A0.4 fallback note marker present'
$writeHit = @('Set-Content','Out-File','Add-Content','New-Item','Remove-Item','Move-Item','Copy-Item','Clear-Content','Tee-Object','WriteAllText','WriteAllLines') | Where-Object { $src -match [regex]::Escape($_) }
Chk (@($writeHit).Count -eq 0) ('A0.5 read-only: zero write-family cmdlets (hits=' + (@($writeHit).Count) + ')')
$autoHit = @('pid','args','input','host','error') | Where-Object { $src -match ('\$' + $_ + '\s*=') }
Chk (@($autoHit).Count -eq 0) ('A0.6 no auto-variable assignment (hits=' + (@($autoHit).Count) + ')')

# ---------------- M1: window fallback healthy yesterday = quiet ----------------
Write-Output 'M1 window fallback healthy'
$f = Build-Fixture -Name 'm1-quiet'
Write-Tick -LogsDir $f.Logs -Date $D0 -Lines (New-TickOk)
$r = Invoke-Ck -RootParam $f.Repo -TickPathParam (Join-Path $f.Logs ('tick-' + $D1 + '.log')) -SimParam '0005'
Chk ($r.Exit -eq 0) ('M1.1 exit 0 (exit=' + $r.Exit + ')')
Chk ($r.Lines[0] -eq ('c1-red: QUIET fails=0 qmax=0 hb_streak=0 pre-tick-window scanned=' + $D0)) ('M1.2 c1 line [' + $r.Lines[0] + ']')
Chk ($r.Lines[8] -eq 'VERDICT: FASTPATH all-quiet') ('M1.3 verdict [' + $r.Lines[8] + ']')

# ---------------- M2: fallback yesterday red (gate FAIL) still triggers ----------------
Write-Output 'M2 fallback yesterday red'
$t = New-Object System.Collections.Generic.List[string]
foreach ($x in (New-TickOk)) { $t.Add($x) }
$t.Add('  gate: FAIL')
$f = Build-Fixture -Name 'm2-yest-red'
Write-Tick -LogsDir $f.Logs -Date $D0 -Lines $t.ToArray()
$r = Invoke-Ck -RootParam $f.Repo -TickPathParam (Join-Path $f.Logs ('tick-' + $D1 + '.log')) -SimParam '0005'
Chk ($r.Exit -eq 2) ('M2.1 exit 2 (exit=' + $r.Exit + ')')
Chk ($r.Lines[0] -eq ('c1-red: TRIGGER gate-probe-fail=1 pre-tick-window scanned=' + $D0)) ('M2.2 c1 line [' + $r.Lines[0] + ']')

# ---------------- M3: fallback yesterday quarantined>0 still triggers ----------------
Write-Output 'M3 fallback yesterday quarantine'
$t = New-Object System.Collections.Generic.List[string]
foreach ($x in (New-TickOk)) { $t.Add($x) }
$t.Add('  scan: perceptor done: events +5 quarantined=2 fleet=2 tasks=4')
$f = Build-Fixture -Name 'm3-yest-q'
Write-Tick -LogsDir $f.Logs -Date $D0 -Lines $t.ToArray()
$r = Invoke-Ck -RootParam $f.Repo -TickPathParam (Join-Path $f.Logs ('tick-' + $D1 + '.log')) -SimParam '0005'
Chk ($r.Lines[0] -eq ('c1-red: TRIGGER quarantined=2 pre-tick-window scanned=' + $D0)) ('M3.1 c1 line [' + $r.Lines[0] + ']')

# ---------------- M4: window + yesterday missing = trigger (fail-closed) ----------------
Write-Output 'M4 window yesterday missing'
$f = Build-Fixture -Name 'm4-yest-absent'
$r = Invoke-Ck -RootParam $f.Repo -TickPathParam (Join-Path $f.Logs ('tick-' + $D1 + '.log')) -SimParam '0005'
Chk ($r.Exit -eq 2) ('M4.1 exit 2 (exit=' + $r.Exit + ')')
Chk ($r.Lines[0] -eq 'c1-red: TRIGGER ticklog-missing') ('M4.2 c1 line [' + $r.Lines[0] + ']')

# ---------------- M5: outside window (0015) healthy yesterday = trigger ----------------
Write-Output 'M5 outside window'
$f = Build-Fixture -Name 'm5-late'
Write-Tick -LogsDir $f.Logs -Date $D0 -Lines (New-TickOk)
$r = Invoke-Ck -RootParam $f.Repo -TickPathParam (Join-Path $f.Logs ('tick-' + $D1 + '.log')) -SimParam '0015'
Chk ($r.Lines[0] -eq 'c1-red: TRIGGER ticklog-missing') ('M5.1 c1 line [' + $r.Lines[0] + ']')
Chk ($r.Exit -eq 2) ('M5.2 exit 2 (exit=' + $r.Exit + ')')

# ---------------- M6/M7/M8: window edges 0000/0006 in, 0007 out ----------------
Write-Output 'M6/M7/M8 window edges'
$f = Build-Fixture -Name 'm6-edge0'
Write-Tick -LogsDir $f.Logs -Date $D0 -Lines (New-TickOk)
$r = Invoke-Ck -RootParam $f.Repo -TickPathParam (Join-Path $f.Logs ('tick-' + $D1 + '.log')) -SimParam '0000'
Chk ($r.Lines[0] -match 'pre-tick-window') ('M6.1 0000 in window [' + $r.Lines[0] + ']')
$f = Build-Fixture -Name 'm7-edge6'
Write-Tick -LogsDir $f.Logs -Date $D0 -Lines (New-TickOk)
$r = Invoke-Ck -RootParam $f.Repo -TickPathParam (Join-Path $f.Logs ('tick-' + $D1 + '.log')) -SimParam '0006'
Chk ($r.Lines[0] -match 'pre-tick-window') ('M7.1 0006 in window [' + $r.Lines[0] + ']')
$f = Build-Fixture -Name 'm8-edge7'
Write-Tick -LogsDir $f.Logs -Date $D0 -Lines (New-TickOk)
$r = Invoke-Ck -RootParam $f.Repo -TickPathParam (Join-Path $f.Logs ('tick-' + $D1 + '.log')) -SimParam '0007'
Chk ($r.Lines[0] -eq 'c1-red: TRIGGER ticklog-missing') ('M8.1 0007 out of window [' + $r.Lines[0] + ']')

# ---------------- M9: today present = normal scan, fallback never used ----------------
Write-Output 'M9 today present normal path'
$t = New-Object System.Collections.Generic.List[string]
foreach ($x in (New-TickOk)) { $t.Add($x) }
$t.Add('  gate: FAIL')
$f = Build-Fixture -Name 'm9-today-present'
Write-Tick -LogsDir $f.Logs -Date $D0 -Lines (New-TickOk)
Write-Tick -LogsDir $f.Logs -Date $D1 -Lines $t.ToArray()
$r = Invoke-Ck -RootParam $f.Repo -TickPathParam (Join-Path $f.Logs ('tick-' + $D1 + '.log')) -SimParam '0005'
Chk ($r.Lines[0] -eq 'c1-red: TRIGGER gate-probe-fail=1') ('M9.1 today scanned, no fallback note [' + $r.Lines[0] + ']')

# ---------------- M10: fallback + heartbeat streak still enforced ----------------
Write-Output 'M10 fallback + hb streak'
$h = New-Object System.Collections.Generic.List[string]
for ($i = 1; $i -le 4; $i++) { $h.Add('2099-12-30 11:' + $i.ToString('00') + ':00 devloop: round done exit=0') }
$h.Add('2099-12-30 11:05:00 devloop: round done exit=1')
$h.Add('2099-12-30 11:06:00 devloop: round done timeout')
$f = Build-Fixture -Name 'm10-hb-streak'
Write-Tick -LogsDir $f.Logs -Date $D0 -Lines (New-TickOk)
[IO.File]::WriteAllLines((Join-Path $f.Logs 'devloop-heartbeat.txt'), $h.ToArray())
$r = Invoke-Ck -RootParam $f.Repo -TickPathParam (Join-Path $f.Logs ('tick-' + $D1 + '.log')) -SimParam '0005'
Chk ($r.Lines[0] -eq ('c1-red: TRIGGER hb-bad-streak=2 pre-tick-window scanned=' + $D0)) ('M10.1 c1 line [' + $r.Lines[0] + ']')

# ---------------- M11: garbage / out-of-range sims = outside window (fail-closed) ----------------
Write-Output 'M11 sim garbage fail-closed'
foreach ($sim in @('99xx','2599','9999','7')) {
    $f = Build-Fixture -Name ('m11-sim-' + $sim)
    Write-Tick -LogsDir $f.Logs -Date $D0 -Lines (New-TickOk)
    $r = Invoke-Ck -RootParam $f.Repo -TickPathParam (Join-Path $f.Logs ('tick-' + $D1 + '.log')) -SimParam $sim
    Chk ($r.Lines[0] -eq 'c1-red: TRIGGER ticklog-missing') ('M11 sim=' + $sim + ' out of window [' + $r.Lines[0] + ']')
}

# ---------------- M12: double-run byte comparability ----------------
Write-Output 'M12 double-run byte equal'
$f = Build-Fixture -Name 'm12-dbl'
Write-Tick -LogsDir $f.Logs -Date $D0 -Lines (New-TickOk)
$tp = Join-Path $f.Logs ('tick-' + $D1 + '.log')
$r1 = Invoke-Ck -RootParam $f.Repo -TickPathParam $tp -SimParam '0005'
$r2 = Invoke-Ck -RootParam $f.Repo -TickPathParam $tp -SimParam '0005'
Chk ((($r1.Lines -join "`r`n") -eq ($r2.Lines -join "`r`n")) -and ($r1.Exit -eq $r2.Exit)) 'M12.1 two runs byte-identical'

# ---------------- M13: year-boundary date derivation (21000101 -> 20991231) ----------------
Write-Output 'M13 year boundary'
$f = Build-Fixture -Name 'm13-yearbound'
Write-Tick -LogsDir $f.Logs -Date '20991231' -Lines (New-TickOk)
$r = Invoke-Ck -RootParam $f.Repo -TickPathParam (Join-Path $f.Logs 'tick-21000101.log') -SimParam '0003'
Chk ($r.Lines[0] -eq 'c1-red: QUIET fails=0 qmax=0 hb_streak=0 pre-tick-window scanned=20991231') ('M13.1 year-boundary fallback [' + $r.Lines[0] + ']')

# ---------------- M14: real-machine wiring smoke ----------------
# Production self-locate (no -Root), explicit missing "tomorrow" tick path
# + sim 0005 -> falls back to today's real log (must be on disk + healthy).
# NOTE: the checker itself is tracked and mid-edit this round, so c2 is
# legitimately dirty and the verdict may be FULL-ROUND - the assertions
# target the c1 line and the trigger label list only, never exit code.
Write-Output 'M14 real-machine smoke'
$realTickTomorrow = Join-Path $repoDir ('logs\tick-' + (Get-Date).AddDays(1).ToString('yyyyMMdd') + '.log')
$out = & powershell.exe -NoProfile -ExecutionPolicy Bypass -File $checker -TickPath $realTickTomorrow -SimNowHHmm '0005'
$rexit = $LASTEXITCODE
$rlines = @($out)
$ydayTag = 'pre-tick-window scanned=' + (Get-Date).ToString('yyyyMMdd')
Chk ($rlines[0] -eq ('c1-red: QUIET fails=0 qmax=0 hb_streak=0 ' + $ydayTag)) ('M14.1 real c1 line [' + $rlines[0] + ']')
$verdictLine = ''
foreach ($vl in $rlines) { if ($vl -match '^VERDICT:') { $verdictLine = $vl } }
Chk ((-not ($verdictLine -match 'c1-red')) -and ($verdictLine.Length -gt 0)) ('M14.2 c1-red not in trigger labels [' + $verdictLine + ']')

# ---------------- summary ----------------
Write-Output ('PASS=' + $script:pass + ' FAIL=' + $script:fail)
if ($script:fail -gt 0) { exit 1 }
exit 0
