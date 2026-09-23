# FluxVerseTick v1.2 - the city heartbeat (10-min OS loop, group-standard mechanism)
# ASCII-only script (encoding law). Chinese mandate lives in mandate.txt (UTF-8).
# v1.1 (CEO audit fix S1 2026-09-23, dual-session merge): single-instance lock
# (logs/tick.lock, stale takeover after 15 min, try/finally cleanup) - a slow
# round can no longer collide with the next.
# v1.2 (group audit P-11 2026-09-23 r6): dirty-tree backoff - if Tools/perceptor
# or schema/ is mid-edit (a devloop round's in-flight probe/registry changes),
# running the half-done stack produced false gate FAILs (16:57 precedent: a
# probe file renamed mid-round). Such rounds skip scan+verify, log the reason,
# exit 0 (deliberate skip, not a failure). Fail-open: git errors -> run.
# Round: 1) perceptor (state -> .new)  2) verify gate (promotes on PASS)
#        3) log  4) rotate logs (7 days)
# Exit 0 = healthy round (or backoff skip); 1 = gate FAIL (old world-state kept).

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot '..\..')       # -> gaming/FluxVerse
$perceptor = Join-Path $repoRoot 'Tools\perceptor'
$logsDir = Join-Path $repoRoot 'logs'
if (-not (Test-Path $logsDir)) { New-Item -ItemType Directory -Path $logsDir | Out-Null }

$lockFile = Join-Path $logsDir 'tick.lock'
if (Test-Path $lockFile) {
  $lockAge = ((Get-Date) - (Get-Item $lockFile).LastWriteTime).TotalMinutes
  if ($lockAge -lt 15) { Write-Output 'FluxVerseTick: lock held by another round, skip'; exit 0 }
}
Set-Content -Path $lockFile -Value ([string]$PID)

try {
  $stamp = (Get-Date).ToString('yyyy-MM-dd HH:mm:ss')
  $logFile = Join-Path $logsDir ('tick-' + (Get-Date).ToString('yyyyMMdd') + '.log')
  $lines = @()
  $lines += ('[' + $stamp + '] FluxVerseTick round start')

  # 0. dirty-tree backoff (P-11): never run a half-edited perceptor stack
  $skip = $false
  $dirty = @(& git -C $repoRoot status --porcelain -- Tools/perceptor schema 2>$null)
  if ($LASTEXITCODE -eq 0 -and $dirty.Count -gt 0) {
    $skip = $true
    $lines += '  backoff: perceptor stack dirty (in-flight dev edits) - scan+verify skipped this round'
  }

  $gate = 0
  if (-not $skip) {
    # 1. perceptor
    $scanOut = & powershell -NoProfile -ExecutionPolicy Bypass -File (Join-Path $perceptor 'scan.ps1')
    foreach ($l in $scanOut) { $lines += ('  scan: ' + $l) }

    # 2. verify gate (two-phase promote inside)
    $verifyOut = & powershell -NoProfile -ExecutionPolicy Bypass -File (Join-Path $perceptor 'verify.ps1')
    $gate = $LASTEXITCODE
    foreach ($l in $verifyOut) { $lines += ('  gate: ' + $l) }
    $lines += ('  gate: ' + $(if ($gate -eq 0) { 'PASS' } else { 'FAIL' }))
  }

  # 3. write log (UTF-8 no BOM)
  $utf8 = New-Object System.Text.UTF8Encoding($false)
  $old = ''
  if (Test-Path $logFile) { $old = [System.IO.File]::ReadAllText($logFile) }
  [System.IO.File]::WriteAllText($logFile, ($old + (($lines -join "`r`n") + "`r`n")), $utf8)

  # 4. rotate logs older than 7 days
  Get-ChildItem $logsDir -Filter 'tick-*.log' | Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-7) } | Remove-Item -Force -ErrorAction SilentlyContinue

  $lines += ('[' + (Get-Date).ToString('yyyy-MM-dd HH:mm:ss') + '] round end')
  if ($skip) {
    Write-Output 'FluxVerseTick: backoff (perceptor tree dirty), round skipped'
    exit 0
  }
  Write-Output ('FluxVerseTick: gate=' + $(if ($gate -eq 0) { 'PASS' } else { 'FAIL' }))
  exit $gate
} finally {
  Remove-Item $lockFile -Force -ErrorAction SilentlyContinue
}
