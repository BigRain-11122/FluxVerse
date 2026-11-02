# archive-logs.ps1 - zip old log files into <logs>/_archive, never lose bytes.
# Contract: a source file is deleted only after its zip entry is re-opened and
# its uncompressed length matches the original file length exactly.
# Protected from archiving: git-tracked files, code extensions, *.lock, _archive itself.
[CmdletBinding()]
param(
  [int]$Days = 14,
  # Directory size cap (decision D-20261101-05 item 3: keep 14 days, rotate
  # weekly, cap the live file count at 400). Age alone is not a bound: 14 days
  # of ten-minute tick logs is ~2,000 files, so the older-than-N-days rule can
  # never hold the directory down. 0 disables the cap.
  [int]$MaxFiles = 400,
  [switch]$DryRun,
  [string]$LogsDir = '',
  [int]$ChunkMb = 150,
  # Test hook only: pretends every zip entry came back with a wrong length so the
  # "originals are kept, exit 2" branch can be proven without corrupting a zip.
  [switch]$SimulateVerifyMismatch
)

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.IO.Compression | Out-Null
Add-Type -AssemblyName System.IO.Compression.FileSystem | Out-Null

# Resolve the repo that owns a directory without depending on the caller's cwd.
# Two traps this guards against (both were live until r786):
#   * cwd: the scheduler starts the tick outside the repo, so a plain
#     'git rev-parse' asked about C:\Windows\System32 instead of our own tree
#     and the archiver threw on every tick-time run (the sandbox was green
#     only when a human ran it from the repo root).
#   * native stderr: under $ErrorActionPreference='Stop', PS 5.1 turns a
#     native command's stderr into a terminating RemoteException, so
#     'git rev-parse' in a non-repo directory killed the whole archiver
#     instead of returning "not a repo". Redirection does not save it.
function Get-RepoRoot {
  param([string]$Path = '')
  $prev = $ErrorActionPreference
  $ErrorActionPreference = 'Continue'
  try {
    $gitArgs = @()
    if ($Path) { $gitArgs += @('-C', $Path) }
    $gitArgs += @('rev-parse', '--show-toplevel')
    $out = & git @gitArgs 2>$null
    $code = $LASTEXITCODE
  } catch {
    return $null
  } finally {
    $ErrorActionPreference = $prev
  }
  if ($code -ne 0 -or -not $out) { return $null }
  return ((@($out)[0]).Trim() -replace '/', '\')
}

function Remove-EmptyDirs {
  param([string]$Base)
  $dirs = @(Get-ChildItem -LiteralPath $Base -Directory -Recurse -Force | Sort-Object { $_.FullName.Length } -Descending)
  $removed = 0
  foreach ($d in $dirs) {
    if ((Get-ChildItem -LiteralPath $d.FullName -Force | Measure-Object).Count -eq 0) {
      Remove-Item -LiteralPath $d.FullName -Force
      $removed++
    }
  }
  return $removed
}

if (-not $LogsDir) {
  $repoRoot = Get-RepoRoot -Path $PSScriptRoot
  if (-not $repoRoot) { Write-Host 'ARCHIVE FAIL: repo root not found'; exit 2 }
  $LogsDir = Join-Path $repoRoot 'logs'
}
if (-not (Test-Path -LiteralPath $LogsDir)) { Write-Host "ARCHIVE FAIL: logs dir missing: $LogsDir"; exit 2 }
$LogsDir = (Resolve-Path -LiteralPath $LogsDir).Path
$archDir = Join-Path $LogsDir '_archive'

# protected set: git-tracked paths under logs (repo resolved from LogsDir, not cwd)
$repo = Get-RepoRoot -Path $LogsDir
$protected = @{}
if ($repo) {
  $prevEap = $ErrorActionPreference
  $ErrorActionPreference = 'Continue'
  try { $tracked = & git -C $repo ls-files -z -- logs 2>$null } catch { $tracked = $null } finally { $ErrorActionPreference = $prevEap }
  if ($tracked) {
    foreach ($t in ($tracked -split "`0")) {
      if ($t) { $protected[($t -replace '/', '\').ToLower()] = 1 }
    }
  }
}

$keepExt = @('.ps1', '.psm1', '.js', '.py', '.cs', '.sh', '.cmd', '.bat')
$cut = (Get-Date).AddDays(-$Days)
if ($env:FLUXVERSE_ARCHIVE_MAX_FILES) { $MaxFiles = [int]$env:FLUXVERSE_ARCHIVE_MAX_FILES }

# One machine-readable line so callers (verify 2e / log-archive-duty.ps1) never
# have to re-derive the selection rules to report a number.
function Write-ArchiveSummary {
  param([int]$Candidates, [int]$Archived, [int]$RemainArchivable, [string]$Verdict)
  Write-Output ("ARCHIVE SUMMARY: candidates={0} archived={1} remain_archivable={2} verdict={3}" -f $Candidates, $Archived, $RemainArchivable, $Verdict)
}

# single source of truth for the selection rules (age candidates, the cap
# overflow candidates and the post-run "what is left" count must never drift
# apart). -OlderThan is the only knob: the age rule passes the 14-day cutoff,
# the cap rule passes today's midnight so nothing from today can be archived.
function Get-ArchivableFiles {
  param([datetime]$OlderThan = [datetime]::MinValue)
  if ($OlderThan -eq [datetime]::MinValue) { $OlderThan = $cut }
  $found = New-Object System.Collections.ArrayList
  foreach ($f in (Get-ChildItem -LiteralPath $LogsDir -File -Recurse -Force)) {
    if ($f.DirectoryName.ToLower().StartsWith($archDir.ToLower())) { continue }
    if ($f.Name -like '*.lock') { continue }
    if ($keepExt -contains $f.Extension.ToLower()) { continue }
    if ($f.LastWriteTime -ge $OlderThan) { continue }
    if ($repo -and $protected.Count -gt 0) {
      $rel = (($f.FullName.Substring($repo.Length + 1)) -replace '/', '\').ToLower()
      if ($protected.ContainsKey($rel)) { continue }
    }
    [void]$found.Add($f)
  }
  return $found
}

$all = @(Get-ChildItem -LiteralPath $LogsDir -File -Recurse -Force)
$liveNow = @($all | Where-Object { -not $_.DirectoryName.ToLower().StartsWith($archDir.ToLower()) })
$cands = @(Get-ArchivableFiles)
$ageCandCount = $cands.Count
$oldRemaining = @($all | Where-Object { $_.LastWriteTime -lt $cut -and -not $_.DirectoryName.ToLower().StartsWith($archDir.ToLower()) })

$capNeed = 0
$capExtra = 0
if ($MaxFiles -gt 0 -and ($liveNow.Count -gt $MaxFiles)) {
  $capNeed = $liveNow.Count - $MaxFiles
  $have = @{}
  foreach ($c in $cands) { $have[$c.FullName.ToLower()] = 1 }
  $stillNeed = $capNeed - $cands.Count
  if ($stillNeed -gt 0) {
    # today's files are never cap fodder: the running tick log and everything
    # the day is still writing stay put until tomorrow.
    $capFloor = (Get-Date).Date
    $pool = @(Get-ArchivableFiles -OlderThan $capFloor | Where-Object { -not $have.ContainsKey($_.FullName.ToLower()) })
    $extra = @($pool | Sort-Object LastWriteTime, FullName | Select-Object -First $stillNeed)
    if ($extra.Count -gt 0) { $cands = @($cands) + $extra; $capExtra = $extra.Count }
  }
}

$totalBytes = 0
if ($cands.Count -gt 0) { $totalBytes = ($cands | Measure-Object Length -Sum).Sum }

Write-Host ("ARCHIVE ROOT: {0}" -f $LogsDir)
Write-Host ("ARCHIVE CUTOFF: {0} (days={1})" -f $cut.ToString('yyyy-MM-dd HH:mm'), $Days)
if ($MaxFiles -gt 0) {
  Write-Host ("ARCHIVE CAP: live={0} max={1} over={2} age={3} cap_extra={4}" -f $liveNow.Count, $MaxFiles, [Math]::Max(0, ($liveNow.Count - $MaxFiles)), $ageCandCount, $capExtra)
} else {
  Write-Host ("ARCHIVE CAP: live={0} max=off over=0 age={1} cap_extra=0" -f $liveNow.Count, $ageCandCount)
}
Write-Host ("ARCHIVE CANDIDATES: {0} files, {1} bytes" -f $cands.Count, $totalBytes)
# Weekly buckets (decision D-20261101-05: rotate weekly). Deliberately plain
# day-of-year weeks, not ISO 8601: the only job of this label is a stable,
# ordered, human-readable zip name.
$weekOf = { param($d) '{0}-W{1:D2}' -f $d.Year, ([int]([math]::Floor(($d.DayOfYear - 1) / 7)) + 1) }
$weekGroups = @($cands | Group-Object { & $weekOf $_.LastWriteTime } | Sort-Object Name)
foreach ($g in $weekGroups) {
  Write-Host ("ARCHIVE WEEK: {0} files={1} bytes={2}" -f $g.Name, $g.Count, (($g.Group | Measure-Object Length -Sum).Sum))
}

if ($cands.Count -eq 0) {
  Write-Host ("ARCHIVE REMAIN_OLD: {0}" -f $oldRemaining.Count)
  Write-Host 'ARCHIVE REMAIN_ARCHIVABLE: 0'
  # Nothing is moving, so the live count is simply the count we just measured.
  Write-Host ("ARCHIVE LIVE_AFTER: {0}" -f $liveNow.Count)
  Write-Host 'ARCHIVE VERDICT: OK (nothing to do)'
  Write-ArchiveSummary -Candidates 0 -Archived 0 -RemainArchivable 0 -Verdict 'OK'
  exit 0
}

if ($DryRun) {
  Write-Host ("ARCHIVE REMAIN_OLD: {0}" -f $oldRemaining.Count)
  Write-Host ("ARCHIVE REMAIN_ARCHIVABLE: {0}" -f $cands.Count)
  Write-Host ("ARCHIVE LIVE_AFTER: {0}" -f $liveNow.Count)
  Write-Host 'ARCHIVE VERDICT: DRYRUN'
  Write-ArchiveSummary -Candidates $cands.Count -Archived 0 -RemainArchivable $cands.Count -Verdict 'DRYRUN'
  exit 0
}

if (-not (Test-Path -LiteralPath $archDir)) { New-Item -ItemType Directory -Path $archDir | Out-Null }

$stamp = (Get-Date).ToString('yyyyMMdd-HHmmss')
$stampShort = (Get-Date).ToString('yyyyMMdd-HHmm')
$madeZips = New-Object System.Collections.ArrayList
$archived = New-Object System.Collections.ArrayList
$failures = New-Object System.Collections.ArrayList

foreach ($g in $weekGroups) {
  $chunk = New-Object System.Collections.ArrayList
  $chunkBytes = 0
  $chunkNo = 0
  $limit = [int64]$ChunkMb * 1MB

  $flush = {
    param($chunk, $bucket, $chunkNo)
    if ($chunk.Count -eq 0) { return }
    $zipPath = Join-Path $archDir ("logs-{0}-part{1:D2}-{2}.zip" -f $bucket, $chunkNo, $stampShort)
    $n = 2
    while (Test-Path -LiteralPath $zipPath) {
      $zipPath = Join-Path $archDir ("logs-{0}-part{1:D2}-{2}-{3}.zip" -f $bucket, $chunkNo, $stampShort, $n)
      $n++
    }
    $archive = [System.IO.Compression.ZipFile]::Open($zipPath, [System.IO.Compression.ZipArchiveMode]::Create)
    $added = @()
    try {
      foreach ($f in $chunk) {
        $entryName = $f.FullName.Substring($LogsDir.Length + 1) -replace '\\', '/'
        $entry = [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($archive, $f.FullName, $entryName, [System.IO.Compression.CompressionLevel]::Optimal)
        $added += [pscustomobject]@{ File = $f; Name = $entryName; Size = $entry.Length }
      }
    } finally {
      $archive.Dispose()
    }
    # verify every entry by re-opening the zip
    $verify = [System.IO.Compression.ZipFile]::OpenRead($zipPath)
    $okCount = 0
    $bad = @()
    try {
      foreach ($a in $added) {
        $e = $verify.GetEntry($a.Name)
        if ($e -and $e.Length -eq $a.File.Length) { $okCount++ } else { $bad += $a.Name }
      }
    } finally {
      $verify.Dispose()
    }
    if ($SimulateVerifyMismatch -and $bad.Count -eq 0) {
      $bad = @($added | ForEach-Object { $_.Name })
    }
    if ($bad.Count -gt 0) {
      Write-Host ("ARCHIVE FAIL: zip entry mismatch ({0} bad) in {1}" -f $bad.Count, $zipPath)
      foreach ($b in $bad) { Write-Host ("ARCHIVE FAIL FILE: {0}" -f $b) }
      return $false
    }
    [void]$script:madeZips.Add([pscustomobject]@{ Zip = $zipPath; Count = $added.Count; Bytes = (($chunk | Measure-Object Length -Sum).Sum) })
    foreach ($a in $added) {
      Remove-Item -LiteralPath $a.File.FullName -Force
      [void]$script:archived.Add([pscustomobject]@{ Path = $a.Name; Size = $a.File.Length; Mtime = $a.File.LastWriteTime.ToString('o'); Zip = (Split-Path -Leaf $zipPath) })
    }
    Write-Host ("ARCHIVE ZIP OK: {0} files={1}" -f (Split-Path -Leaf $zipPath), $added.Count)
    return $true
  }

  foreach ($f in ($g.Group | Sort-Object FullName)) {
    if (($chunkBytes + $f.Length) -gt $limit -and $chunk.Count -gt 0) {
      if (-not (& $flush $chunk $g.Name $chunkNo)) { [void]$failures.Add($g.Name) }
      $chunk.Clear()
      $chunkBytes = 0
      $chunkNo++
    }
    [void]$chunk.Add($f)
    $chunkBytes += $f.Length
  }
  if ($chunk.Count -gt 0) {
    if (-not (& $flush $chunk $g.Name $chunkNo)) { [void]$failures.Add($g.Name) }
  }
}

$liveAfter = @(Get-ChildItem -LiteralPath $LogsDir -File -Recurse -Force | Where-Object { -not $_.DirectoryName.ToLower().StartsWith($archDir.ToLower()) })

$manifestPath = Join-Path $archDir ("manifest-{0}.json" -f $stamp)
$manifest = [pscustomobject]@{
  stamp = $stamp
  cutoff = $cut.ToString('o')
  days = $Days
  max_files = $MaxFiles
  live_before = $liveNow.Count
  live_after = $liveAfter.Count
  logs_dir = $LogsDir
  zips = $madeZips
  files = $archived
}
if ($archived.Count -gt 0) {
  $manifest | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath $manifestPath -Encoding UTF8
}

$removedDirs = Remove-EmptyDirs -Base $LogsDir
$remainOld = @(Get-ChildItem -LiteralPath $LogsDir -File -Recurse -Force | Where-Object {
    $_.LastWriteTime -lt $cut -and -not $_.DirectoryName.ToLower().StartsWith($archDir.ToLower())
  })
$remainArchivable = @(Get-ArchivableFiles)

Write-Host ("ARCHIVE ZIPS: {0}" -f $madeZips.Count)
Write-Host ("ARCHIVE FILES: {0}" -f $archived.Count)
Write-Host ("ARCHIVE BYTES: {0}" -f (($archived | Measure-Object Size -Sum).Sum))
Write-Host ("ARCHIVE EMPTY_DIRS_REMOVED: {0}" -f $removedDirs)
Write-Host ("ARCHIVE MANIFEST: {0}" -f (Split-Path -Leaf $manifestPath))
Write-Host ("ARCHIVE REMAIN_OLD: {0}" -f $remainOld.Count)
Write-Host ("ARCHIVE REMAIN_ARCHIVABLE: {0}" -f $remainArchivable.Count)
Write-Host ("ARCHIVE LIVE_AFTER: {0}" -f $liveAfter.Count)
if ($MaxFiles -gt 0 -and $liveAfter.Count -gt $MaxFiles) {
  # Honest reading, not a verdict: protected (git-tracked / code / today's)
  # files can keep the directory above the cap and saying so beats pretending.
  Write-Host ("ARCHIVE CAP UNREACHED: live={0} max={1} - protected or same-day files hold the rest" -f $liveAfter.Count, $MaxFiles)
}

if ($failures.Count -gt 0) {
  Write-Host 'ARCHIVE VERDICT: FAIL'
  Write-ArchiveSummary -Candidates $cands.Count -Archived $archived.Count -RemainArchivable $remainArchivable.Count -Verdict 'FAIL'
  exit 2
}
Write-Host 'ARCHIVE VERDICT: OK'
Write-ArchiveSummary -Candidates $cands.Count -Archived $archived.Count -RemainArchivable $remainArchivable.Count -Verdict 'OK'
exit 0