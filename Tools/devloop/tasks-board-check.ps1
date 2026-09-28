# tasks-board-check.ps1 - TASKS board vs TECH.md section-9 double-ledger consistency gate
# P3-001 / T-FV-140 (r233). Proposal source: TECH.md sec-9 r232 row. Four rules:
#   R1 sec9-closed row still present on board       (r193-type drift: closing claimed but board not flipped)
#   R2 open row without sec9 source or standing-anchor note
#   R3 duplicate board rows                        (r210-type drift: double rows)
#   R4 self-executable table empty                 (standing rule: keep >=1 open row)
# Read-only. Zero new daemon (DevLoop in-round single writer, r198/psa-advisor family).
# Exit codes: 0=PASS / 1=input missing or sec9 anchor absent / 2=RED (violations listed).
param(
  [string]$Root = '',
  [string]$TasksPath = '',
  [string]$TechPath = ''
)
$ErrorActionPreference = 'Stop'
if ($Root -eq '') { $Root = (Split-Path (Split-Path $PSScriptRoot -Parent) -Parent) }
if ($TasksPath -eq '') { $TasksPath = Join-Path $Root 'tasks\TASKS.md' }
if ($TechPath -eq '') { $TechPath = Join-Path $Root 'TECH.md' }
foreach ($p in @($TasksPath, $TechPath)) {
  if (-not (Test-Path -LiteralPath $p)) {
    Write-Output ('board-check: INPUT-MISSING ' + $p)
    exit 1
  }
}
$utf8 = New-Object System.Text.UTF8Encoding($false)
$techLines = [System.IO.File]::ReadAllLines($TechPath, $utf8)
$taskLines = [System.IO.File]::ReadAllLines($TasksPath, $utf8)

# --- section-9 slice (anchor = the only '## ' header containing 'Backlog', r230 audit) ---
$secStart = -1
for ($i = 0; $i -lt $techLines.Count; $i++) {
  if ($techLines[$i] -match '^## .*Backlog') { $secStart = $i; break }
}
if ($secStart -lt 0) {
  Write-Output 'board-check: SEC9-ANCHOR-MISSING'
  exit 1
}
$secEnd = $techLines.Count
for ($i = $secStart + 1; $i -lt $techLines.Count; $i++) {
  if ($techLines[$i] -match '^## ') { $secEnd = $i; break }
}
$s9Lines = @($techLines[$secStart..($secEnd - 1)])

# --- monthly archive files = section-9 historical body (D-20260928-04 cross-file addressing) ---
$archDir = Join-Path $Root 'docs\archive\tech-section9'
$archLines = @()
$archFileCount = 0
if (Test-Path -LiteralPath $archDir) {
  $archFiles = @(Get-ChildItem -LiteralPath $archDir -Filter '*.md' -File | Sort-Object Name)
  $archFileCount = $archFiles.Count
  foreach ($af in $archFiles) {
    $archLines += [System.IO.File]::ReadAllLines($af.FullName, $utf8)
  }
}

# --- R1 material: closed-row mentions in sec9 + archives ---
# CJK via code points only (PS5.1 GBK law): yi-chu = remove, shuang/yi = pair/row modifiers
$yiChu = [string][char]0x79FB + [string][char]0x9664
$rxRemove = 'T-FV-(\d+)[\s' + [string][char]0x53CC + [string][char]0x884C + ']{0,4}' + $yiChu
$removedSet = @{}
foreach ($ln in $s9Lines) {
  foreach ($mm in [regex]::Matches($ln, $rxRemove)) { $removedSet['T-FV-' + $mm.Groups[1].Value] = $true }
}
foreach ($ln in $archLines) {
  foreach ($mm in [regex]::Matches($ln, $rxRemove)) { $removedSet['T-FV-' + $mm.Groups[1].Value] = $true }
}

# --- board parse: table rows '| T-FV-<n> | ...', section by preceding '## ' header ---
$secOpenMark = [string][char]0x4E00    # yi (section one marker)
$secBlockedMark = [string][char]0x4E8C  # er (section two marker)
$changShe = [string][char]0x5E38 + [string][char]0x8BBE  # standing-anchor note mark
$rxRow = '^\|\s*(T-FV-(\d+))\s*\|'
$idCount = @{}
$rowLineById = @{}
$openIds = @()
$blockedIds = @()
$curSec = ''
foreach ($ln in $taskLines) {
  if ($ln -match '^## ') { $curSec = $ln; continue }
  $mm = [regex]::Match($ln, $rxRow)
  if (-not $mm.Success) { continue }
  $id = $mm.Groups[1].Value
  if (-not $idCount.ContainsKey($id)) { $idCount[$id] = 0; $rowLineById[$id] = $ln }
  $idCount[$id] = $idCount[$id] + 1
  if ($curSec.Contains($secOpenMark)) { $openIds += $id }
  elseif ($curSec.Contains($secBlockedMark)) { $blockedIds += $id }
}

function Test-TokenPresent {
  param([string]$Num, $S9, $Arch)
  $rx = 'T-FV-' + $Num + '(?!\d)'
  foreach ($ln in $S9) { if ($ln -match $rx) { return $true } }
  foreach ($ln in $Arch) { if ($ln -match $rx) { return $true } }
  return $false
}

# --- four rules ---
$viol = New-Object System.Collections.Generic.List[string]
foreach ($k in @($idCount.Keys | Sort-Object)) {
  if ($idCount[$k] -gt 1) { $viol.Add('R3-duplicate: ' + $k + ' x' + $idCount[$k]) }
}
if ($openIds.Count -lt 1) { $viol.Add('R4-no-open-rows: self-executable table empty') }
foreach ($k in @($removedSet.Keys | Sort-Object)) {
  if ($idCount.ContainsKey($k)) { $viol.Add('R1-closed-but-on-board: ' + $k) }
}
foreach ($id in $openIds) {
  $num = $id.Substring(5)
  $present = Test-TokenPresent -Num $num -S9 $s9Lines -Arch $archLines
  $anchorNote = $rowLineById[$id].Contains($changShe)
  if (-not $present -and -not $anchorNote) { $viol.Add('R2-open-row-no-source: ' + $id) }
}

# --- deterministic report (no timestamps, byte-comparable across runs) ---
Write-Output ('board-check: rows=' + $idCount.Count + ' open=' + $openIds.Count + ' blocked=' + $blockedIds.Count + ' s9_lines=' + $s9Lines.Count + ' s9_removed=' + $removedSet.Count + ' archive_files=' + $archFileCount)
foreach ($v in $viol) { Write-Output ('violation: ' + $v) }
if ($viol.Count -gt 0) {
  Write-Output ('BOARD-CHECK: RED violations=' + $viol.Count)
  exit 2
}
Write-Output 'BOARD-CHECK: PASS violations=0'
exit 0
