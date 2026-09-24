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
# v1.3 (2026-09-24 r63, group infra-2 P-43 F-B): PID liveness joins the lock
# test (scan.lock pattern): a lock only blocks while its owner PID is alive
# AND fresh (<15 min). A crashed round (dead PID) is taken over at once - no
# lost round; a hung-but-alive round is still taken over after 15 min.
# v1.4 (2026-09-24 r66, P-43 residue / lock-atomicity law port): the v1.3
# acquire was still check-then-act (Test-Path then Set-Content) - two
# same-second launches could BOTH pass the check and double-run the round
# (r65 AC-A live proof on scan.lock, same shape; bad case = a doubled tick
# round, the stream itself already guarded by the atomic scan lock). Acquire
# is now atomic (scan v0.7 law, verbatim port): CreateNew is the gate, the
# PID is written+flushed+closed at once (LAW: no held handle - a lingering
# write handle makes challengers' ReadAllText throw and read empty, firing
# the takeover path on a healthy owner), the loser re-checks liveness and
# skips, an empty/unreadable lock gets 6 beats (~1.5s) before crash-takeover,
# and the release unlinks only if the on-disk PID is still ours (an overage
# takeover may have replaced the lock mid-round).
# v1.6 (2026-09-25 r94, P-12 slices 1+2 / D-20260925-02): the '[stamp] round
#   end' marker was appended to $lines AFTER WriteAllText - it never reached the
#   log file (harmless legacy bug, caught while wiring OS_TICK_DONE emission).
#   The marker now lands in the file right before the log write: the perceptor
#   probe ticklog.ps1 (new, same round) reads complete round blocks off this
#   log on the NEXT scan (10-min delayed, zero new stream writer - P-43
#   single-writer law). No round-order change; exit semantics untouched.
# v1.5 (2026-09-24 r69, P-2026-09-24-52 slice 3a): new round-end step - the
# public snapshot export (export-public-snapshot.ps1): whitelist-sanitized
# city snapshot for the visitor read API over the git read-only channel.
# Runs even on backoff rounds (it reads the last-good state, never the
# half-edited stack). Fail-soft by design: an export problem logs 'pub:'
# lines and never fails the round; an AC-5 gate FAIL keeps the last-good
# snapshot on disk (two-phase promote inside the exporter).
# Round: 1) perceptor (state -> .new)  2) verify gate (promotes on PASS)
#        2.5) public snapshot export  3) log  4) rotate logs (7 days)
# Exit 0 = healthy round (or backoff skip); 1 = gate FAIL (old world-state kept).

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot '..\..')       # -> gaming/FluxVerse
$perceptor = Join-Path $repoRoot 'Tools\perceptor'
$logsDir = Join-Path $repoRoot 'logs'
if (-not (Test-Path $logsDir)) { New-Item -ItemType Directory -Path $logsDir | Out-Null }

$lockFile = Join-Path $logsDir 'tick.lock'
$lockFs = $null
$acquired = $false
$emptySeen = 0
for ($i = 0; $i -lt 60 -and -not $acquired; $i++) {
  if (Test-Path $lockFile) {
    $lockPid = ''
    try { $lockPid = [string]([System.IO.File]::ReadAllText($lockFile)).Trim() } catch {}
    if ($lockPid -match '^\d+$') {
      $lockAge = ((Get-Date) - (Get-Item $lockFile).LastWriteTime).TotalMinutes
      $alive = $false
      if (Get-Process -Id ([int]$lockPid) -ErrorAction SilentlyContinue) { $alive = $true }
      if ($alive -and $lockAge -lt 15) { Write-Output 'FluxVerseTick: lock held by a live round, skip'; exit 0 }
      # dead PID or overage (>15min hung round) -> fail-open takeover
      Remove-Item $lockFile -Force -ErrorAction SilentlyContinue
    } else {
      $emptySeen++
      if ($emptySeen -ge 6) { Remove-Item $lockFile -Force -ErrorAction SilentlyContinue }
    }
    Start-Sleep -Milliseconds 250
  }
  try {
    $lockFs = [System.IO.File]::Open($lockFile, [System.IO.FileMode]::CreateNew, [System.IO.FileAccess]::Write, ([System.IO.FileShare]::Read -bor [System.IO.FileShare]::Delete))
    $pidBytes = [System.Text.Encoding]::ASCII.GetBytes(([string]$PID))
    $lockFs.Write($pidBytes, 0, $pidBytes.Length)
    $lockFs.Flush()
    $lockFs.Close()
    $lockFs = $null
    $acquired = $true
  } catch { Start-Sleep -Milliseconds 250 }
}
if (-not $acquired) { Write-Output 'FluxVerseTick: lock not acquirable this round, skip'; exit 0 }

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

  # 2.5 public snapshot export (r69, P-52 slice 3a): visitor-face package for
  #     the server read API. Fail-soft: the round's health stays the verify
  #     gate; the exporter keeps the last-good snapshot on any AC-5 FAIL.
  try {
    $expOut = & powershell -NoProfile -ExecutionPolicy Bypass -File (Join-Path $PSScriptRoot 'export-public-snapshot.ps1') 2>&1
    foreach ($l in $expOut) { $lines += ('  pub: ' + ([string]$l)) }
  } catch { $lines += ('  pub: export crashed (fail-soft): ' + ($_.Exception.Message -replace "[\r\n]", ' ')) }

  # 2.6 round-end marker (v1.6, r94): stamp the block end BEFORE the log write
  #     so the marker actually lands in the file (old code appended it after
  #     WriteAllText = never written; the ticklog probe reads blocks by it)
  $lines += ('[' + (Get-Date).ToString('yyyy-MM-dd HH:mm:ss') + '] round end')

  # 3. write log (UTF-8 no BOM)
  $utf8 = New-Object System.Text.UTF8Encoding($false)
  $old = ''
  if (Test-Path $logFile) { $old = [System.IO.File]::ReadAllText($logFile) }
  [System.IO.File]::WriteAllText($logFile, ($old + (($lines -join "`r`n") + "`r`n")), $utf8)

  # 4. rotate logs older than 7 days
  Get-ChildItem $logsDir -Filter 'tick-*.log' | Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-7) } | Remove-Item -Force -ErrorAction SilentlyContinue
  if ($skip) {
    Write-Output 'FluxVerseTick: backoff (perceptor tree dirty), round skipped'
    exit 0
  }
  Write-Output ('FluxVerseTick: gate=' + $(if ($gate -eq 0) { 'PASS' } else { 'FAIL' }))
  exit $gate
} finally {
  # r66 release law: unlink only if the lock on disk is still ours - an
  # overage takeover may have unlinked/replaced it mid-round; the old
  # unconditional remove would have deleted a successor's lock
  try {
    $ownLockPid = [string]([System.IO.File]::ReadAllText($lockFile)).Trim()
    if ($ownLockPid -eq ([string]$PID)) { Remove-Item $lockFile -Force -ErrorAction SilentlyContinue }
  } catch {}
}
