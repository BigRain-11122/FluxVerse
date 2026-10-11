# logs/devloop-r274-ollamawd-test.ps1 - harness for Tools/watchdog/ollama-orphan-watchdog.ps1 (P-2026-10-11-04)
# Wrapper law 29 (r244): .NET Process with double redirect (no `*>` self-redirect under EAP=Stop).
# Chk law (r191): cond-first. All ASCII. Rationale per case inline.
$ErrorActionPreference = 'Stop'
$repo = Split-Path $PSScriptRoot   # logs\ -> repo root (ONE level; r247 law: depth is per-folder, assert-below proves it)
$wd  = Join-Path $repo 'Tools\watchdog\ollama-orphan-watchdog.ps1'
$stateFile   = Join-Path $repo 'logs\ollama-watchdog-state.txt'
$receiptFile = Join-Path $repo 'logs\ollama-watchdog-receipt.jsonl'
$pass = 0; $fail = 0
function Chk { param([bool]$cond, [string]$name) if ($cond) { $script:pass++ } else { $script:fail++; Write-Output ('FAIL ' + $name) } }
function Run-Tool { param([string]$target, [string]$extra)
    $psi = New-Object System.Diagnostics.ProcessStartInfo
    $psi.FileName = 'powershell.exe'
    $psi.Arguments = '-NoProfile -ExecutionPolicy Bypass -File "' + $target + '"' + $extra
    $psi.UseShellExecute = $false; $psi.CreateNoWindow = $true
    $psi.RedirectStandardOutput = $true; $psi.RedirectStandardError = $true
    $pr = New-Object System.Diagnostics.Process
    $pr.StartInfo = $psi
    $null = $pr.Start()
    $so = $pr.StandardOutput.ReadToEnd()
    $se = $pr.StandardError.ReadToEnd()
    $pr.WaitForExit()
    return @{ code = $pr.ExitCode; out = $so; err = $se }
}
function Count-Receipt { if (Test-Path $receiptFile) { return [IO.File]::ReadAllLines($receiptFile).Count } else { return 0 } }

# ---------- A0 static (ASCII / auto-var / params / root assert) ----------
$bytes = [IO.File]::ReadAllBytes($wd)
$nonAscii = 0; foreach ($b in $bytes) { if ($b -gt 127) { $nonAscii++ } }
Chk ($nonAscii -eq 0) 'a0-ascii-zero-nonascii'
$body = [IO.File]::ReadAllText($wd)
$autoVarHit = 0
foreach ($pat in @('\$pid\s*=', '\$PID\s*=', '\$input\s*=', '\$args\s*=', '\$host\s*=', '\$error\s*=')) { if ($body -match $pat) { $autoVarHit++ } }
Chk ($autoVarHit -eq 0) 'a0-no-auto-var-assignment'
$paramHit = 0
foreach ($pn in @('Ovr503', 'OvrGpu', 'OvrCallers', 'OvrCallersLate', 'SimNowUtc', 'DryRun')) { if ($body -match [regex]::Escape($pn)) { $paramHit++ } }
Chk ($paramHit -eq 6) 'a0-six-params-present'
Chk ($body -match 'repo root not resolved') 'a0-root-assert-fail-loud-line'

# ---------- A1 wrong-depth negative control (r247/r273 same-disease law) ----------
$ngDir = Join-Path $env:TEMP 'r274wd-ng'
$null = New-Item -ItemType Directory -Force -Path $ngDir
Copy-Item $wd (Join-Path $ngDir 'ollama-orphan-watchdog.ps1') -Force
$r1 = Run-Tool (Join-Path $ngDir 'ollama-orphan-watchdog.ps1') ''
Chk ($r1.code -eq 1) 'a1-wrong-depth-exit1'
Chk ($r1.out -match 'root not resolved') 'a1-wrong-depth-message'
Remove-Item $ngDir -Recurse -Force -ErrorAction SilentlyContinue

# ---------- A2 live machine quiet path (real probes, no overrides) ----------
if (Test-Path $stateFile) { [IO.File]::Delete($stateFile) }
$rc0 = Count-Receipt
$r2 = Run-Tool $wd ''
Chk ($r2.code -eq 0) 'a2-live-quiet-exit0'
Chk ($r2.out -match '^WD: quiet') 'a2-live-quiet-output'
Chk ((Count-Receipt) -eq $rc0) 'a2-quiet-no-receipt'
Chk (-not (Test-Path $stateFile)) 'a2-quiet-state-cleared'

# ---------- A3 arm path (full overrides: deterministic, no live probes) ----------
$r3 = Run-Tool $wd ' -Ovr503 y -OvrGpu 0 -OvrCallers n -SimNowUtc 2026-10-11T01:00:00Z'
Chk ($r3.code -eq 0) 'a3-arm-exit0'
$st = ''
if (Test-Path $stateFile) { $st = [IO.File]::ReadAllText($stateFile) }
Chk ($st -eq 'first_seen=2026-10-11T01:00:00Z') 'a3-arm-state-seeded'
$r3b = Run-Tool $wd ' -Ovr503 y -OvrGpu 0 -OvrCallers n -SimNowUtc 2026-10-11T01:00:00Z'
Chk ($r3b.out -match 'WD: armed age_s=0') 'a3-arm-second-run-holds'

# ---------- A4 fire path, dry-run (seed 660s old) ----------
[IO.File]::WriteAllText($stateFile, 'first_seen=2026-10-11T00:49:00Z')
$rc4 = Count-Receipt
$r4 = Run-Tool $wd ' -Ovr503 y -OvrGpu 0 -OvrCallers n -OvrCallersLate n -SimNowUtc 2026-10-11T01:00:00Z -DryRun'
Chk ($r4.code -eq 2) 'a4-dryrun-fire-exit2'
Chk ($r4.out -match 'DRYRUN-RESTART') 'a4-dryrun-message'
$rc4b = Count-Receipt
Chk ($rc4b -eq ($rc4 + 1)) 'a4-receipt-one-line'
$last4 = [IO.File]::ReadAllLines($receiptFile) | Select-Object -Last 1
Chk ($last4 -match '"action":"dryrun-restart"' -and $last4 -match '"dryrun":true') 'a4-receipt-dryrun-marked'
Chk (-not (Test-Path $stateFile)) 'a4-state-cleared-after-fire'

# ---------- A5 disarm path (condition breaks -> state cleared, no receipt) ----------
[IO.File]::WriteAllText($stateFile, 'first_seen=2026-10-11T00:49:00Z')
$rc5 = Count-Receipt
$r5 = Run-Tool $wd ' -Ovr503 y -OvrGpu 0 -OvrCallers y -SimNowUtc 2026-10-11T01:00:00Z'
Chk (($r5.code -eq 0) -and (-not (Test-Path $stateFile)) -and ((Count-Receipt) -eq $rc5)) 'a5-disarm-clears-state-no-receipt'

# ---------- A6 abort path (late caller appears between arm and fire) ----------
[IO.File]::WriteAllText($stateFile, 'first_seen=2026-10-11T00:49:00Z')
$rc6 = Count-Receipt
$r6 = Run-Tool $wd ' -Ovr503 y -OvrGpu 0 -OvrCallers n -OvrCallersLate y -SimNowUtc 2026-10-11T01:00:00Z'
Chk ($r6.code -eq 0) 'a6-abort-exit0'
Chk ($r6.out -match 'WD: abort') 'a6-abort-message'
$last6 = [IO.File]::ReadAllLines($receiptFile) | Select-Object -Last 1
Chk ((($last6) -match '"action":"abort"') -and ((Count-Receipt) -eq ($rc6 + 1))) 'a6-abort-receipt'
Chk (-not (Test-Path $stateFile)) 'a6-state-cleared-after-abort'

# ---------- A7 determinism: double run, byte-identical output ----------
$r7a = Run-Tool $wd ' -Ovr503 n -OvrGpu 0 -OvrCallers y'
$r7b = Run-Tool $wd ' -Ovr503 n -OvrGpu 0 -OvrCallers y'
Chk (($r7a.out -eq $r7b.out) -and ($r7a.code -eq $r7b.code)) 'a7-double-run-byte-identical'

# ---------- A8 garbage state hygiene ----------
[IO.File]::WriteAllText($stateFile, 'first_seen=garbage-line')
$r8 = Run-Tool $wd ' -Ovr503 n -OvrGpu 0 -OvrCallers y'
Chk (($r8.code -eq 0) -and (-not (Test-Path $stateFile))) 'a8-garbage-state-cleaned'

# ---------- A9 receipt line parses as JSON with required keys ----------
$last9 = [IO.File]::ReadAllLines($receiptFile) | Select-Object -Last 1
$j = $null; $okJson = $false
try { $j = $last9 | ConvertFrom-Json; if ($null -ne $j.ts_utc -and $null -ne $j.action -and $null -ne $j.dryrun) { $okJson = $true } } catch { }
Chk $okJson 'a9-receipt-json-parses'

# ---------- cleanup: production task starts with clean state ----------
if (Test-Path $stateFile) { [IO.File]::Delete($stateFile) }
Write-Output ('A2-LIVE-EVIDENCE: ' + ($r2.out.Trim() -replace "`r`n", ' | '))
Write-Output ('SUMMARY r274-ollamawd: pass=' + $pass + ' fail=' + $fail)
if ($fail -gt 0) { exit 1 } else { exit 0 }
