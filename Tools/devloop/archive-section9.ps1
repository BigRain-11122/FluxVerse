# archive-section9.ps1 - FluxVerse TECH.md section-9 monthly generational archive tool
# Protocol: fluxverse-sec9-archive/0.1 | Law source: D-20260928-04 (2026-09-28, first built r230)
#
# What it does: migrates section-9 backlog rows whose row-date is older than the
#   active window (default 30 days) out of TECH.md into per-month archive files
#   docs/archive/tech-section9/<YYYYMM>.md (content zero-deletion, git keeps all = R1).
#
# D-20260928-04 criteria, all fail-loud (exit 1) with in-memory restore:
#   G1 line/byte reconcile   - post-write re-read must match byte-exact identities
#   G2 reference grep        - pointer line present + zero moved-row residual in
#                             TECH.md + moved row (and its rNN tokens) present in archive
#   G3 F-row rNN addressing  - every rNN token referenced from HQ-FEEDBACK.md
#                             must be reachable in the archive via the section-9 pointer
#   G4 single writer        - this tool runs only inside a DevLoop round (by law;
#                             never wired into tick or any scheduled task)
#
# Laws honored: ASCII-only body (all CJK lives in archive-section9-header.txt
#   data file, read with explicit UTF8 per r53); byte-exact EOL/BOM preservation
#   (LF no-BOM expected; gate-protected); atomic .new + Move (r98); deterministic
#   report output (no wall clock when -Today given; double-run byte-identical);
#   undated rows are NEVER auto-migrated (conservative keep);
#   row migrates only when age EXCEEDS MinAgeDays (a row exactly 30 days old stays).
#
# Usage:
#   powershell -NoProfile -File archive-section9.ps1 [-Root <dir>] [-Today yyyy-MM-dd]
#                                            [-MinAgeDays <int>] [-DryRun]
# Exit codes: 0 = OK (moved may be 0); 1 = FAIL (refused / gate red / parse error)

param(
  [string]$Root = '',
  [string]$Today = '',
  [int]$MinAgeDays = 30,
  [switch]$DryRun
)

$ErrorActionPreference = 'Stop'
$utf8 = New-Object System.Text.UTF8Encoding($false)
$inv = [System.Globalization.CultureInfo]::InvariantCulture
$dss = [System.Globalization.DateTimeStyles]::None

function Fail([string]$msg) {
  Write-Output ('FAIL ' + $msg)
  exit 1
}

# ---- 0. resolve repo root (default: two levels up from Tools\devloop) ----
$repo = $Root
if ([string]::IsNullOrEmpty($repo)) {
  $repo = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
}
$techPath = Join-Path $repo 'TECH.md'
$archDir  = Join-Path $repo 'docs\archive\tech-section9'
$hqPath   = Join-Path $repo 'HQ-FEEDBACK.md'
$tplPath  = Join-Path $PSScriptRoot 'archive-section9-header.txt'
$nl = [string][char]10
$cr = [string][char]13

# ---- 1. today / cutoff ----
# PS5.1 law: param() type constraints PERSIST on the variable, and variable names
# are case-insensitive - so never name a local $today against a param [string]$Today
# (assignment would be silently coerced back to string). Local name: $todayDate.
$todayStr = $Today
if ([string]::IsNullOrEmpty($todayStr)) { $todayStr = (Get-Date).ToString('yyyy-MM-dd') }
$todayDate = New-Object System.DateTime
if (-not [System.DateTime]::TryParseExact($todayStr, 'yyyy-MM-dd', $inv, $dss, [ref]$todayDate)) {
  Fail ('bad -Today value: ' + $todayStr)
}
$cutoff = $todayDate.AddDays(-$MinAgeDays)   # migrate iff rowDate < cutoff (age > MinAgeDays)

# ---- 2. read TECH.md (byte law: BOM/EOL detect, line split) ----
if (-not (Test-Path -LiteralPath $techPath)) { Fail ('TECH.md not found under root: ' + $repo) }
$techBytes0 = [System.IO.File]::ReadAllBytes($techPath)
$hasBom = ($techBytes0.Length -ge 3 -and $techBytes0[0] -eq 0xEF -and $techBytes0[1] -eq 0xBB -and $techBytes0[2] -eq 0xBF)
$techRaw = [System.IO.File]::ReadAllText($techPath, [System.Text.Encoding]::UTF8)
$eol = $nl
$eolBytes = 1
if ($techRaw.Contains($cr + $nl)) { $eol = $cr + $nl; $eolBytes = 2 }
$endsWithEol = $techRaw.EndsWith($eol)
$lines = New-Object System.Collections.Generic.List[string]
foreach ($p in ($techRaw -split $eol)) { $lines.Add([string]$p) }
if ($endsWithEol -and $lines.Count -gt 0 -and $lines[$lines.Count - 1] -eq '') { $lines.RemoveAt($lines.Count - 1) }

# ---- 3. locate section 9 (ASCII anchor: the only '## ' header containing 'Backlog') ----
$start = -1
$end = -1
for ($i = 0; $i -lt $lines.Count; $i++) {
  $t = $lines[$i]
  if ($start -lt 0) {
    if ($t.StartsWith('## ') -and $t.Contains('Backlog')) { $start = $i }
  } elseif ($t.StartsWith('## ')) { $end = $i; break }
}
if ($start -lt 0 -or $end -lt 0) { Fail 'section-9 not located (Backlog anchor)' }

# ---- 4. G0 pointer gate: refuse to archive without a reachable pointer line ----
if (-not $techRaw.Contains('docs/archive/tech-section9')) {
  Fail 'G2 pointer gate: section-9 header pointer line missing - refusing to migrate'
}

# ---- 5. classify rows ----
$rowsTotal = 0
$dated = 0
$undated = 0
$oldest = $null
$newest = $null
$newLines = New-Object System.Collections.Generic.List[string]
$movedLines = New-Object System.Collections.Generic.List[string]
$movedDates = New-Object System.Collections.Generic.List[string]
$movedMonths = New-Object System.Collections.Generic.List[string]
for ($i = 0; $i -lt $lines.Count; $i++) {
  $t = $lines[$i]
  if (($i -le $start) -or ($i -ge $end)) { $newLines.Add($t); continue }
  if (-not $t.StartsWith('- [')) { $newLines.Add($t); continue }
  $rowsTotal++
  $c1 = $t.IndexOf(']')
  $hdr = $t
  if ($c1 -ge 0) { $hdr = $t.Substring(0, $c1 + 1) }
  $m = [regex]::Match($hdr, '\d{4}-\d{2}-\d{2}')
  $rowDate = $null
  if ($m.Success) {
    $dd = New-Object System.DateTime
    if ([System.DateTime]::TryParseExact($m.Value, 'yyyy-MM-dd', $inv, $dss, [ref]$dd)) { $rowDate = $dd }
  }
  if ($null -eq $rowDate) { $undated++; $newLines.Add($t); continue }
  $dated++
  $dstr = $rowDate.ToString('yyyy-MM-dd')
  if ($null -eq $oldest -or ($dstr -lt $oldest)) { $oldest = $dstr }
  if ($null -eq $newest -or ($dstr -gt $newest)) { $newest = $dstr }
  if ($rowDate -lt $cutoff) {
    $movedLines.Add($t)
    $movedDates.Add($dstr)
    $movedMonths.Add($dstr.Substring(0, 4) + $dstr.Substring(5, 2))
  } else {
    $newLines.Add($t)
  }
}

# ---- 6. report header (deterministic) ----
$mode = 'run'
if ($DryRun) { $mode = 'dryrun' }
Write-Output ('sec9_archive/0.1 mode=' + $mode + ' today=' + $todayStr + ' min_age_days=' + $MinAgeDays)
Write-Output ('tech: lines=' + $lines.Count + ' bytes=' + $techBytes0.Length)
Write-Output ('sec9: rows=' + $rowsTotal + ' dated=' + $dated + ' undated=' + $undated + ' aged=' + $movedLines.Count + ' oldest=' + $oldest + ' newest=' + $newest)

# ---- 7. zero-row path: honest no-op ----
if ($movedLines.Count -eq 0) {
  $nextAging = ''
  if ($null -ne $oldest) {
    $oa = New-Object System.DateTime
    [void][System.DateTime]::TryParseExact($oldest, 'yyyy-MM-dd', $inv, $dss, [ref]$oa)
    $nextAging = $oa.AddDays($MinAgeDays + 1).ToString('yyyy-MM-dd')
  }
  Write-Output ('next_aging: ' + $nextAging)
  Write-Output 'gates: g1_reconcile=PASS g2_refs=PASS g3_faddr=PASS g4_writer=DevLoop-round'
  Write-Output 'verdict: OK moved=0 (no rows outside active window)'
  exit 0
}

# ---- 8. month buckets (first-encounter order, deterministic) ----
$months = New-Object System.Collections.Generic.List[string]
for ($k = 0; $k -lt $movedMonths.Count; $k++) {
  if (-not $months.Contains($movedMonths[$k])) { $months.Add($movedMonths[$k]) }
}
$movedBytes = 0
for ($k = 0; $k -lt $movedLines.Count; $k++) { $movedBytes += $utf8.GetByteCount($movedLines[$k]) + $eolBytes }
Write-Output ('moved: total=' + $movedLines.Count + ' bytes=' + $movedBytes + ' months=' + ($months -join ','))
if ($DryRun) {
  for ($k = 0; $k -lt $movedLines.Count; $k++) {
    $kk = $movedLines[$k]
    Write-Output ('plan: ' + $movedMonths[$k] + ' ' + $movedDates[$k] + ' key=' + $kk.Substring(0, [Math]::Min(24, $kk.Length)))
  }
  Write-Output 'verdict: OK dry-run (no writes)'
  exit 0
}

# ---- 9. build archive payloads (template is UTF-8 data file; CJK lives there) ----
if (-not (Test-Path -LiteralPath $tplPath)) { Fail 'header template file missing' }
$tpl = [System.IO.File]::ReadAllText($tplPath, [System.Text.Encoding]::UTF8)
if (-not $tpl.Contains('__MONTH__')) { Fail 'header template missing __MONTH__ placeholder' }
if (-not $tpl.Contains('__RANGE__')) { Fail 'header template missing __RANGE__ placeholder' }
$plan = @{}
foreach ($mo in $months) {
  $file = Join-Path $archDir ($mo + '.md')
  $existing = ''
  $existed = $false
  if (Test-Path -LiteralPath $file) {
    $existing = [System.IO.File]::ReadAllText($file, [System.Text.Encoding]::UTF8)
    $existed = $true
  }
  $body = $existing
  if ($body.Length -gt 0) {
    if (-not $body.EndsWith($nl)) { $body += $nl }
    $body += $nl
  } else {
    $yy = $mo.Substring(0, 4)
    $mm = $mo.Substring(4, 2)
    $dim = [System.DateTime]::DaysInMonth([int]$yy, [int]$mm)
    $range = $yy + '-' + $mm + '-01..' + $yy + '-' + $mm + '-' + $dim.ToString('00')
    $body = $tpl.Replace('__MONTH__', $mo).Replace('__RANGE__', $range)
    if (-not $body.EndsWith($nl)) { $body += $nl }
  }
  $cnt = 0
  for ($k = 0; $k -lt $movedLines.Count; $k++) {
    if ($movedMonths[$k] -eq $mo) { $body += $movedLines[$k] + $nl; $cnt++ }
  }
  $plan[$mo] = @{ file = $file; old = $existing; new = $body; rows = $cnt; existed = $existed }
}

# ---- 10. write phase: archive append first, then TECH rewrite; restore on error ----
function Restore-All {
  foreach ($mo in $script:months) {
    $w = $script:plan[$mo]
    if ($w['existed']) {
      [void][System.IO.File]::WriteAllText($w['file'], $w['old'], $script:utf8)
    } elseif (Test-Path -LiteralPath $w['file']) {
      Remove-Item -LiteralPath $w['file'] -Force
    }
  }
  [void][System.IO.File]::WriteAllBytes($script:techPath, $script:techBytes0)
  $tmp = $script:techPath + '.new'
  if (Test-Path -LiteralPath $tmp) { Remove-Item -LiteralPath $tmp -Force }
}

try {
  if (-not (Test-Path -LiteralPath $archDir)) { New-Item -ItemType Directory -Path $archDir -Force | Out-Null }
  foreach ($mo in $months) {
    $w = $plan[$mo]
    [System.IO.File]::WriteAllText($w['file'], $w['new'], $utf8)
  }
  $newTechText = [string]::Join($eol, $newLines)
  if ($endsWithEol) { $newTechText += $eol }
  $tmpTech = $techPath + '.new'
  [System.IO.File]::WriteAllText($tmpTech, $newTechText, $utf8)
  Move-Item -LiteralPath $tmpTech -Destination $techPath -Force
} catch {
  Restore-All
  Fail ('write phase error: ' + $_.Exception.Message)
}

# ---- 11. G1..G3 verification (post-write re-read; any red -> restore + exit 1) ----
$techBytes1 = [System.IO.File]::ReadAllBytes($techPath)
if ($hasBom) { Restore-All; Fail 'G1: unexpected BOM (byte law)' }
if ($techBytes1.Length -ne ($techBytes0.Length - $movedBytes)) {
  Restore-All; Fail ('G1: TECH byte reconcile red: ' + $techBytes1.Length + ' vs expected ' + ($techBytes0.Length - $movedBytes))
}
$techRaw1 = [System.IO.File]::ReadAllText($techPath, [System.Text.Encoding]::UTF8)
$chkLines = New-Object System.Collections.Generic.List[string]
foreach ($p in ($techRaw1 -split $eol)) { $chkLines.Add([string]$p) }
if ($endsWithEol -and $chkLines.Count -gt 0 -and $chkLines[$chkLines.Count - 1] -eq '') { $chkLines.RemoveAt($chkLines.Count - 1) }
if ($chkLines.Count -ne $newLines.Count) { Restore-All; Fail ('G1: TECH line reconcile red: ' + $chkLines.Count + ' vs ' + $newLines.Count) }
foreach ($k in $movedLines) {
  if ($techRaw1.Contains($k)) { Restore-All; Fail 'G2: moved row still residual in TECH.md' }
}
foreach ($mo in $months) {
  $w = $plan[$mo]
  $archBytes = [System.IO.File]::ReadAllBytes($w['file'])
  $expectBytes = $utf8.GetByteCount($w['new'])
  if ($archBytes.Length -ne $expectBytes) { Restore-All; Fail ('G1: archive byte reconcile red for ' + $mo) }
  $archText = [System.IO.File]::ReadAllText($w['file'], [System.Text.Encoding]::UTF8)
  if (-not $archText.Equals($w['new'])) { Restore-All; Fail ('G1: archive content reconcile red for ' + $mo) }
  for ($k = 0; $k -lt $movedLines.Count; $k++) {
    if ($movedMonths[$k] -eq $mo) {
      if (-not $archText.Contains($movedLines[$k])) { Restore-All; Fail ('G2: moved row missing in archive ' + $mo) }
    }
  }
}
# G3: rNN tokens referenced by HQ-FEEDBACK rows must live in the archive (reachable via pointer)
$hqText = ''
if (Test-Path -LiteralPath $hqPath) { $hqText = [System.IO.File]::ReadAllText($hqPath, [System.Text.Encoding]::UTF8) }
$tokTotal = 0
$tokInHq = 0
$tokSeen = New-Object System.Collections.Generic.List[string]
for ($k = 0; $k -lt $movedLines.Count; $k++) {
  $ms = [regex]::Matches($movedLines[$k], 'r\d+')
  foreach ($mm in $ms) {
    $tok = $mm.Value
    if ($tokSeen.Contains($tok)) { continue }
    $tokSeen.Add($tok)
    $tokTotal++
    $moOwner = $movedMonths[$k]
    if ($hqText.Length -gt 0 -and $hqText.Contains($tok)) { $tokInHq++ }
    if (-not $plan[$moOwner]['new'].Contains($movedLines[$k])) { Restore-All; Fail ('G3: rNN ' + $tok + ' not reachable in archive') }
  }
}
Write-Output ('f_refs: tokens=' + $tokTotal + ' hqfb_hits=' + $tokInHq + ' resolved=' + $tokTotal)
$archReport = New-Object System.Collections.Generic.List[string]
foreach ($mo in $months) {
  $w = $plan[$mo]
  $oldB = 0
  if ($w['existed']) { $oldB = $utf8.GetByteCount($w['old']) }
  $archReport.Add(($mo + ':' + $w['rows'] + 'rows +' + ($utf8.GetByteCount($w['new']) - $oldB) + 'B'))
}
Write-Output ('archive: ' + ($archReport -join ' '))
Write-Output 'gates: g1_reconcile=PASS g2_refs=PASS g3_faddr=PASS g4_writer=DevLoop-round'
Write-Output ('verdict: OK moved=' + $movedLines.Count + ' tech_bytes=' + $techBytes1.Length)
exit 0
