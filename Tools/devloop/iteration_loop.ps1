# FluxVerse dev loop - OS-scheduled headless AI dev round launcher.
# Ported 2026-09-23 from the proven BigMoney pattern (Tools\iteration_loop.ps1).
# Every beat: single-instance guard -> spawn ONE headless codely round
# (Tools\devloop\iteration_prompt.txt driven) -> heartbeat. Budget 25 min;
# overlap prevented by round.lock + task-level MultipleInstances=IgnoreNew.
# Deliberately staggered 5-min off the FluxVerseTick lane (:00-ish lane).
# ENCODING RULE: pure ASCII. Chinese mandate lives in iteration_prompt.txt (UTF-8).
# Self-heal: powershell -NoProfile -ExecutionPolicy Bypass -File Tools\devloop\register_loop_task.ps1
param(
    [string]$Project = (Resolve-Path (Join-Path $PSScriptRoot '..\..')).Path,
    [int]$LockMaxAgeMinutes = 40,
    [int]$RoundTimeoutMinutes = 25
)
$ErrorActionPreference = 'Continue'
Set-Location $Project   # run codely from the REPO root
$logDir = Join-Path $Project 'logs\devloop'
New-Item -ItemType Directory -Force $logDir | Out-Null
$stamp = Get-Date -Format 'yyyyMMdd_HHmmss'
$runLog = Join-Path $logDir "run_$stamp.log"
$roundOut = Join-Path $logDir "round_$stamp.out"
$roundErr = Join-Path $logDir "round_$stamp.err"
$heart = Join-Path $Project 'logs\devloop-heartbeat.txt'

function Log([string]$m) {
    $line = "$(Get-Date -Format 'HH:mm:ss') $m"
    Write-Output $line
    Add-Content -Path $runLog -Value $line -Encoding UTF8
}
function Beat([string]$m) {
    Add-Content -Path $heart -Value "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') devloop: $m" -Encoding UTF8
}

# ---- single-instance guard ----
$lock = Join-Path $logDir 'round.lock'
if (Test-Path $lock) {
    $age = ((Get-Date) - (Get-Item $lock).LastWriteTime).TotalMinutes
    if ($age -lt $LockMaxAgeMinutes) { Log "skip: previous round still running (age=$([int]$age)min)"; Beat 'skip (round in flight)'; exit 0 }
    Log "stale round lock expired (age=$([int]$age)min) - taking over"
}
Set-Content -Path $lock -Value $stamp -Encoding UTF8

try {
    Log "devloop round start $stamp"
    $codelyPath = (Get-Command codely -ErrorAction SilentlyContinue).Source
    if (-not $codelyPath) { Log 'FATAL: codely not on PATH'; Beat 'error codely missing'; exit 2 }

    $promptFile = Join-Path $PSScriptRoot 'iteration_prompt.txt'
    if (-not (Test-Path $promptFile)) { Log 'FATAL: iteration_prompt.txt missing'; Beat 'error prompt file missing'; exit 2 }
    $prompt = (Get-Content -Raw -Encoding UTF8 $promptFile).Trim()
    if ($prompt.Length -lt 50) { Log 'FATAL: iteration_prompt.txt too short'; Beat 'error prompt file empty'; exit 2 }
    if ($prompt.Contains('"')) { $prompt = $prompt.Replace('"', "'") }
    $argLine = '-y -p "' + $prompt + '"'
    Log "spawning headless dev round (budget ${RoundTimeoutMinutes}min, prompt_chars=$($prompt.Length))"
    $p = Start-Process -FilePath $codelyPath -ArgumentList $argLine -WorkingDirectory $Project -PassThru -NoNewWindow -RedirectStandardOutput $roundOut -RedirectStandardError $roundErr
    $null = $p.Handle
    if (-not $p.WaitForExit($RoundTimeoutMinutes * 60 * 1000)) {
        Log "ROUND TIMEOUT after ${RoundTimeoutMinutes}min - killing headless process tree"
        try {
            Get-CimInstance Win32_Process -Filter "ParentProcessId=$($p.Id)" -ErrorAction SilentlyContinue |
                ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }
            Stop-Process -Id $p.Id -Force -ErrorAction SilentlyContinue
        } catch { Log "kill failed: $_" }
        Beat "round timeout killed (over ${RoundTimeoutMinutes}min)"
        exit 3
    }
    $p.Refresh()
    Log "headless dev round finished exit=$($p.ExitCode)"
    Beat "round done exit=$($p.ExitCode)"
    # Group order 2026-09-23 (CEO: publish city progress so every machine can
    # preview). Ref-level push only - never touches the worktree, safe always.
    if ((git -C $Project remote) -match 'origin') {
        git -C $Project push --quiet origin HEAD 2>$null
        Log ("round publish: " + $(if ($LASTEXITCODE -eq 0) {'pushed to origin'} else {'push failed - left for next round'}))
    }
    exit $p.ExitCode
}
finally {
    Remove-Item $lock -Force -ErrorAction SilentlyContinue
}
