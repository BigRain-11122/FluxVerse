# archive-logs.ps1 - zip old log files into <logs>/_archive, never lose bytes.
# Contract: a source file is deleted only after its zip entry is re-opened and
# its uncompressed length matches the original file length exactly.
# Protected from archiving: git-tracked files, code extensions, *.lock, _archive itself.
[CmdletBinding()]
param(
  [int]$Days = 14,
  [switch]$DryRun,
  [string]$LogsDir = '',
  [int]$ChunkMb = 150
)

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.IO.Compression | Out-Null
Add-Type -AssemblyName System.IO.Compression.FileSystem | Out-Null

function Get-RepoRoot {
  $out = & git rev-parse --show-toplevel 2>$null
  if ($LASTEXITCODE -ne 0 -or -not $out) { return $null }
  return (($out | Select-Object -First 1).Trim() -replace '/', '\')
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
  $repoRoot = Get-RepoRoot
  if (-not $repoRoot) { Write-Host 'ARCHIVE FAIL: repo root not found'; exit 2 }
  $LogsDir = Join-Path $repoRoot 'logs'
}
if (-not (Test-Path -LiteralPath $LogsDir)) { Write-Host "ARCHIVE FAIL: logs dir missing: $LogsDir"; exit 2 }
$LogsDir = (Resolve-Path -LiteralPath $LogsDir).Path
$archDir = Join-Path $LogsDir '_archive'

# protected set: git-tracked paths under logs (repo root required)
$repo = Get-RepoRoot
$protected = @{}
if ($repo) {
  Push-Location -LiteralPath $repo
  try { $tracked = & git ls-files -z -- logs 2>$null } finally { Pop-Location }
  if ($tracked) {
    foreach ($t in ($tracked -split "`0")) {
      if ($t) { $protected[($t -replace '/', '\').ToLower()] = 1 }
    }
  }
}

$keepExt = @('.ps1', '.psm1', '.js', '.py', '.cs', '.sh', '.cmd', '.bat')
$cut = (Get-Date).AddDays(-$Days)

# single source of truth for the selection rules (candidates and the post-run
# "what is left" count must never drift apart)
function Get-ArchivableFiles {
  $found = New-Object System.Collections.ArrayList
  foreach ($f in (Get-ChildItem -LiteralPath $LogsDir -File -Recurse -Force)) {
    if ($f.DirectoryName.ToLower().StartsWith($archDir.ToLower())) { continue }
    if ($f.Name -like '*.lock') { continue }
    if ($keepExt -contains $f.Extension.ToLower()) { continue }
    if ($f.LastWriteTime -ge $cut) { continue }
    if ($repo -and $protected.Count -gt 0) {
      $rel = (($f.FullName.Substring($repo.Length + 1)) -replace '/', '\').ToLower()
      if ($protected.ContainsKey($rel)) { continue }
    }
    [void]$found.Add($f)
  }
  return $found
}

$all = @(Get-ChildItem -LiteralPath $LogsDir -File -Recurse -Force)
$cands = Get-ArchivableFiles
$oldRemaining = @($all | Where-Object { $_.LastWriteTime -lt $cut -and -not $_.DirectoryName.ToLower().StartsWith($archDir.ToLower()) })

$totalBytes = 0
if ($cands.Count -gt 0) { $totalBytes = ($cands | Measure-Object Length -Sum).Sum }

Write-Host ("ARCHIVE ROOT: {0}" -f $LogsDir)
Write-Host ("ARCHIVE CUTOFF: {0} (days={1})" -f $cut.ToString('yyyy-MM-dd HH:mm'), $Days)
Write-Host ("ARCHIVE CANDIDATES: {0} files, {1} bytes" -f $cands.Count, $totalBytes)
$monthGroups = @($cands | Group-Object { $_.LastWriteTime.ToString('yyyyMM') } | Sort-Object Name)
foreach ($g in $monthGroups) {
  Write-Host ("ARCHIVE MONTH: {0} files={1} bytes={2}" -f $g.Name, $g.Count, (($g.Group | Measure-Object Length -Sum).Sum))
}

if ($cands.Count -eq 0) {
  Write-Host ("ARCHIVE REMAIN_OLD: {0}" -f $oldRemaining.Count)
  Write-Host 'ARCHIVE REMAIN_ARCHIVABLE: 0'
  Write-Host 'ARCHIVE VERDICT: OK (nothing to do)'
  exit 0
}

if ($DryRun) {
  Write-Host ("ARCHIVE REMAIN_OLD: {0}" -f $oldRemaining.Count)
  Write-Host ("ARCHIVE REMAIN_ARCHIVABLE: {0}" -f $cands.Count)
  Write-Host 'ARCHIVE VERDICT: DRYRUN'
  exit 0
}

if (-not (Test-Path -LiteralPath $archDir)) { New-Item -ItemType Directory -Path $archDir | Out-Null }

$stamp = (Get-Date).ToString('yyyyMMdd-HHmmss')
$stampShort = (Get-Date).ToString('yyyyMMdd-HHmm')
$madeZips = New-Object System.Collections.ArrayList
$archived = New-Object System.Collections.ArrayList
$failures = New-Object System.Collections.ArrayList

foreach ($g in $monthGroups) {
  $chunk = New-Object System.Collections.ArrayList
  $chunkBytes = 0
  $chunkNo = 0
  $limit = [int64]$ChunkMb * 1MB

  $flush = {
    param($chunk, $month, $chunkNo)
    if ($chunk.Count -eq 0) { return }
    $zipPath = Join-Path $archDir ("logs-{0}-part{1:D2}-{2}.zip" -f $month, $chunkNo, $stampShort)
    $n = 2
    while (Test-Path -LiteralPath $zipPath) {
      $zipPath = Join-Path $archDir ("logs-{0}-part{1:D2}-{2}-{3}.zip" -f $month, $chunkNo, $stampShort, $n)
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

$manifestPath = Join-Path $archDir ("manifest-{0}.json" -f $stamp)
$manifest = [pscustomobject]@{
  stamp = $stamp
  cutoff = $cut.ToString('o')
  days = $Days
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

if ($failures.Count -gt 0) {
  Write-Host 'ARCHIVE VERDICT: FAIL'
  exit 2
}
Write-Host 'ARCHIVE VERDICT: OK'
exit 0