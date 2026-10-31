# log-archive-duty.ps1 - daily gate in front of archive-logs.ps1 (queue main#56)
# ---------------------------------------------------------------------------
# r715 cleared 2,174 stale log files once, by hand. Nothing ran it again, so the
# backlog was guaranteed to grow back: a one-off sweep is not a retention policy.
# This module turns the sweep into a duty that Tools\perceptor\verify.ps1 runs on
# every tick, gated to at most once per calendar day (a full recursive scan every
# ten minutes would cost far more than it saves).
#
# Contract:
#   - the archiver's own ARCHIVE SUMMARY line is the single source of numbers;
#     this module never re-derives candidates (two copies of the selection rules
#     would drift, the same reason 2c/2d share their definition files)
#   - a broken archive is an observation, not a broken city: the caller turns a
#     non-OK verdict into verify's WARN, never into the FAIL token
#   - the day stamp is written only after a run that actually succeeded, so a
#     failed day is retried on the next tick instead of sleeping 24 hours
# ASCII-only (group PS5.1 encoding law).

function Invoke-LogArchiveDuty {
  [CmdletBinding()]
  param(
    [string]$Root = '',
    [string]$ArchiverPath = '',
    [string]$LogsDir = '',
    [string]$StatePath = '',
    [int]$Days = 14,
    [int]$MaxRemainArchivable = 200,
    [datetime]$Now = (Get-Date),
    [switch]$Force,
    [switch]$DryRun,
    [switch]$SimulateVerifyMismatch
  )

  $result = [pscustomobject]@{
    ran = $false
    reason = ''
    candidates = 0
    archived = 0
    remain_archivable = 0
    remain_stale = $false
    verdict = 'SKIP'
    max_remain = $MaxRemainArchivable
    output = @()
  }

  if (-not $Root) { $Root = (Resolve-Path (Join-Path $PSScriptRoot '..\..')).Path }
  if (-not $ArchiverPath) { $ArchiverPath = Join-Path $Root 'Tools\devloop\archive-logs.ps1' }
  if (-not $LogsDir) { $LogsDir = Join-Path $Root 'logs' }
  if (-not $StatePath) { $StatePath = Join-Path $LogsDir '.archive-duty-last-run.txt' }

  if (-not (Test-Path -LiteralPath $ArchiverPath)) {
    $result.reason = 'archiver-missing'
    $result.verdict = 'MISSING'
    return $result
  }
  if (-not (Test-Path -LiteralPath $LogsDir)) {
    $result.reason = 'logs-missing'
    $result.verdict = 'MISSING'
    return $result
  }

  $today = $Now.ToString('yyyyMMdd')
  if (-not $Force) {
    $stamp = ''
    if (Test-Path -LiteralPath $StatePath) {
      try { $stamp = ((Get-Content -LiteralPath $StatePath -Raw -ErrorAction Stop) -replace '\s', ' ') } catch { $stamp = '' }
    }
    $mStamp = [regex]::Match($stamp, '(\d{8})(?:\s*remain=(\d+))?')
    if ($mStamp.Success -and $mStamp.Groups[1].Value -eq $today) {
      # Skip days must stay cheap (no recursive scan every ten minutes), so the
      # backlog figure is the one the last real run measured. It is labelled
      # stale so the caller never presents it as a fresh count.
      $result.reason = 'already-ran-today'
      $result.verdict = 'SKIP'
      $result.remain_stale = $true
      if ($mStamp.Groups[2].Success) { $result.remain_archivable = [int]$mStamp.Groups[2].Value }
      return $result
    }
  }

  $splat = @{ Days = $Days; LogsDir = $LogsDir }
  if ($DryRun) { $splat['DryRun'] = $true }
  if ($SimulateVerifyMismatch) { $splat['SimulateVerifyMismatch'] = $true }

  $lines = @()
  try {
    $lines = @(& $ArchiverPath @splat *>&1 | ForEach-Object { [string]$_ })
  } catch {
    $result.ran = $true
    $result.reason = 'threw'
    $result.verdict = 'ERROR'
    $result.output = @([string]$_.Exception.Message)
    return $result
  }

  $result.ran = $true
  $result.reason = 'run'
  $result.output = $lines

  $summary = @($lines | Where-Object { $_ -like 'ARCHIVE SUMMARY:*' }) | Select-Object -First 1
  if (-not $summary) {
    $result.verdict = 'NOVERDICT'
    return $result
  }
  $mCand = [regex]::Match($summary, 'candidates=(\d+)')
  $mArch = [regex]::Match($summary, 'archived=(\d+)')
  $mRemain = [regex]::Match($summary, 'remain_archivable=(\d+)')
  $mVerdict = [regex]::Match($summary, 'verdict=(\S+)')
  if ($mCand.Success) { $result.candidates = [int]$mCand.Groups[1].Value }
  if ($mArch.Success) { $result.archived = [int]$mArch.Groups[1].Value }
  if ($mRemain.Success) { $result.remain_archivable = [int]$mRemain.Groups[1].Value }

  $verdict = 'NOVERDICT'
  if ($mVerdict.Success) { $verdict = $mVerdict.Groups[1].Value }
  if ($verdict -eq 'FAIL') { $verdict = 'MISMATCH' }
  $result.verdict = $verdict

  if (-not $DryRun -and ($verdict -eq 'OK' -or $verdict -eq 'DRYRUN')) {
    try {
      $parent = Split-Path -Parent $StatePath
      if ($parent -and -not (Test-Path -LiteralPath $parent)) { New-Item -ItemType Directory -Force -Path $parent | Out-Null }
      Set-Content -LiteralPath $StatePath -Value ($today + ' remain=' + $result.remain_archivable) -Encoding ASCII
    } catch {
      # A stamp we cannot write only means the next tick runs again; never fatal.
      $result.reason = 'run'
    }
  }

  return $result
}