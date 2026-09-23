# FluxVerseTick v1.1 - the city heartbeat (10-min OS loop)
# v1.1: S1 single-instance lock (evolution-tick pattern, group-standard).
# Round: lock -> perceptor -> verify gate -> log -> rotate (7d). Exit = gate.

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot '..\..')       # -> gaming/FluxVerse
$perceptor = Join-Path $repoRoot 'Tools\perceptor'
$logsDir = Join-Path $repoRoot 'logs'
if (-not (Test-Path $logsDir)) { New-Item -ItemType Directory -Path $logsDir | Out-Null }

# ---- S1 single-instance lock (stale after 15 min) ----
$lock = Join-Path $repoRoot '.codely-cli\fv-tick.lock'
if (Test-Path $lock) {
  $age = ((Get-Date) - (Get-Item $lock).LastWriteTime).TotalMinutes
  if ($age -lt 15) { exit 0 }
}
New-Item -ItemType Directory -Path (Join-Path $repoRoot '.codely-cli') -Force -ErrorAction SilentlyContinue | Out-Null
New-Item -ItemType File -Path $lock -Force | Out-Null
try {
  $stamp = (Get-Date).ToString('yyyy-MM-dd HH:mm:ss')
  $logFile = Join-Path $logsDir ('tick-' + (Get-Date).ToString('yyyyMMdd') + '.log')
  $lines = @()
  $lines += ('[' + $stamp + '] FluxVerseTick round start')

  $scanOut = & powershell -NoProfile -ExecutionPolicy Bypass -File (Join-Path $perceptor 'scan.ps1')
  foreach ($l in $scanOut) { $lines += ('  scan: ' + $l) }

  & powershell -NoProfile -ExecutionPolicy Bypass -File (Join-Path $perceptor 'verify.ps1')
  $gate = $LASTEXITCODE
  $lines += ('  gate: ' + $(if ($gate -eq 0) { 'PASS' } else { 'FAIL' }))

  $utf8 = New-Object System.Text.UTF8Encoding($false)
  $old = ''
  if (Test-Path $logFile) { $old = [System.IO.File]::ReadAllText($logFile) }
  [System.IO.File]::WriteAllText($logFile, ($old + (($lines -join "`r`n") + "`r`n")), $utf8)

  Get-ChildItem $logsDir -Filter 'tick-*.log' | Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-7) } | Remove-Item -Force -ErrorAction SilentlyContinue

  Write-Output ('FluxVerseTick: gate=' + $(if ($gate -eq 0) { 'PASS' } else { 'FAIL' }))
  exit $gate
} finally {
  Remove-Item $lock -Force -ErrorAction SilentlyContinue
}
