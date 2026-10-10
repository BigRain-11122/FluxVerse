# devloop-r266-a3root-v2-test.ps1 - A3 ghost negative-control root-fix v2 (tech queue #12, r266)
# Structural disease (r259 rows 2/5): a negative-control sandbox that hardcodes
# its ghost id self-destructs once the section-9 closing row names that id
# (two proven cases: 999 via the r233 closing row, 899 via the r258 closing row).
# The mention gives the ghost id a "source" in the gate's search domain, so the
# gate's R2 stops firing for it and the control is permanently exempt.
# v2 root fix: NO literal ghost id anywhere. The id is derived at runtime by
# scanning the gate's own search domain (TECH section-9 slice + monthly archive
# files) and selecting the first zero-mention id in the 900..999 candidate band.
# Both historical rotted ids are mentioned in section-9, so the filter skips
# them by construction; candidate exhaustion returns null (fail-loud, no silent
# fallback to a mentioned id). Rot-proofness is proven structurally in A4: a
# simulated future closing-row mention of the selected id shifts selection to
# the next zero-mention id, and a fixture-ledger run reproduces the historical
# rot mechanically (mentioned id exempt + new id still fires R2).
# Read-only vs real files (fixtures in TEMP only). Child processes via .NET
# Process double-redirect (law 29 / r244). ASCII-only body (PS5.1 GBK law).
$ErrorActionPreference = 'Stop'
$repo = Split-Path -Parent $PSScriptRoot
$gate = Join-Path $repo 'Tools\devloop\tasks-board-check.ps1'
$utf8 = New-Object System.Text.UTF8Encoding($false)
$pass = 0
$fail = 0
function Chk([bool]$cond, [string]$name) {
  if ($cond) { $script:pass++; Write-Output ('PASS ' + $name) }
  else { $script:fail++; Write-Output ('FAIL ' + $name) }
}
function Run-Tool {
  param([string]$ToolPath, [string]$ExtraArgs)
  $psi = New-Object System.Diagnostics.ProcessStartInfo
  $psi.FileName = 'powershell.exe'
  $psi.Arguments = '-NoProfile -ExecutionPolicy Bypass -File "' + $ToolPath + '"' + $ExtraArgs
  $psi.UseShellExecute = $false
  $psi.RedirectStandardOutput = $true
  $psi.RedirectStandardError = $true
  $psi.CreateNoWindow = $true
  $p = [System.Diagnostics.Process]::Start($psi)
  $so = $p.StandardOutput.ReadToEnd()
  $se = $p.StandardError.ReadToEnd()
  $p.WaitForExit()
  $code = $p.ExitCode
  $p.Dispose()
  return @{ code = $code; out = $so; err = $se }
}

# ---- A0 static audit of this sandbox (self rot-proofing proof) ----
$selfBody = [System.IO.File]::ReadAllText($PSCommandPath)
$selfBytes = [System.IO.File]::ReadAllBytes($PSCommandPath)
$nonAscii = 0
foreach ($b in $selfBytes) { if ($b -gt 127) { $nonAscii++ } }
Chk ($nonAscii -eq 0) ('a0-self-ascii non_ascii=' + $nonAscii)
$hard = [regex]::Matches($selfBody, 'T-FV-[0-9]{3,}')
Chk ($hard.Count -eq 0) ('a0-no-literal-ghost-id literals=' + $hard.Count)
Chk (Test-Path -LiteralPath $gate) 'a0-gate-exists'
Chk ($selfBody.Contains('RedirectStandardOutput') -and $selfBody.Contains('RedirectStandardError') -and $selfBody.Contains('CreateNoWindow')) 'a0-child-double-redirect'
$autoVar = [regex]::Matches($selfBody, '(?m)\$(pid|input|args|host)\s*=')
Chk ($autoVar.Count -eq 0) ('a0-no-auto-var-assign hits=' + $autoVar.Count)

# ---- A1 domain scan + dynamic ghost id selection (the v2 core) ----
$techLines = [System.IO.File]::ReadAllLines((Join-Path $repo 'TECH.md'), $utf8)
$secStart = -1
for ($i = 0; $i -lt $techLines.Count; $i++) {
  if ($techLines[$i] -match '^## .*Backlog') { $secStart = $i; break }
}
Chk ($secStart -ge 0) 'a1-sec9-anchor-found'
$secEnd = $techLines.Count
for ($i = $secStart + 1; $i -lt $techLines.Count; $i++) {
  if ($techLines[$i] -match '^## ') { $secEnd = $i; break }
}
$dom = New-Object System.Collections.Generic.List[string]
for ($i = $secStart; $i -lt $secEnd; $i++) { $dom.Add($techLines[$i]) }
$archDir = Join-Path $repo 'docs\archive\tech-section9'
if (Test-Path -LiteralPath $archDir) {
  foreach ($af in (Get-ChildItem -LiteralPath $archDir -Filter '*.md' -File)) {
    foreach ($ln in [System.IO.File]::ReadAllLines($af.FullName, $utf8)) { $dom.Add($ln) }
  }
}
Chk ($dom.Count -gt 0) ('a1-domain-nonempty lines=' + $dom.Count)

function Select-GhostId {
  param($DomainLines)
  $used = @{}
  foreach ($ln in $DomainLines) {
    foreach ($mm in [regex]::Matches($ln, 'T-FV-(\d+)')) { $used[[int]$mm.Groups[1].Value] = $true }
  }
  for ($n = 900; $n -le 999; $n++) {
    if (-not $used.ContainsKey($n)) { return ('T-FV-' + [string]$n) }
  }
  return $null
}
$ghost = Select-GhostId -DomainLines $dom
Chk ($null -ne $ghost) 'a1-ghost-selected'
Chk ([regex]::IsMatch($ghost, '^T-FV-[0-9]{3}$')) 'a1-selected-format'
$ghostNum = $ghost.Substring(5)
$rxGhost = 'T-FV-' + $ghostNum + '(?!\d)'
$mentions = 0
foreach ($ln in $dom) { if ($ln -match $rxGhost) { $mentions++ } }
Chk ($mentions -eq 0) ('a1-zero-mention-by-construction mentions=' + $mentions)
$ghost2 = Select-GhostId -DomainLines $dom
Chk ($ghost -eq $ghost2) 'a1-selection-deterministic'
$allMention = New-Object System.Text.StringBuilder
for ($n = 900; $n -le 999; $n++) { [void]$allMention.Append(' T-FV-'); [void]$allMention.Append([string]$n) }
$exhaust = Select-GhostId -DomainLines @($allMention.ToString())
Chk ($null -eq $exhaust) 'a1-filter-exhaustion-null'

# ---- A2 real gate health (board/section-9 ledger unchanged by this fix) ----
$r1 = Run-Tool -ToolPath $gate -ExtraArgs ''
Chk ($r1.code -eq 0) ('a2-real-exit0 code=' + $r1.code)
Chk ($r1.out.Contains('BOARD-CHECK: PASS') -and -not $r1.out.Contains('violation:')) 'a2-real-pass-zero-viol'
$mRm = [regex]::Match($r1.out, 's9_removed=(\d+)')
Chk ($mRm.Success -and [int]$mRm.Groups[1].Value -gt 0) ('a2-removed-parseable v=' + $mRm.Groups[1].Value)
$r2 = Run-Tool -ToolPath $gate -ExtraArgs ''
Chk ($r1.out -eq $r2.out) 'a2-double-run-identical'

# ---- A3 rot-proof ghost negative control at real-ledger level ----
$fxDir = Join-Path $env:TEMP ('r266-fx-' + [guid]::NewGuid().ToString('N'))
New-Item -ItemType Directory -Path $fxDir | Out-Null
$fxTasks = Join-Path $fxDir 'TASKS.md'
$lines = [System.IO.File]::ReadAllLines((Join-Path $repo 'tasks\TASKS.md'), $utf8)
$buf = New-Object System.Collections.Generic.List[string]
$inserted = $false
foreach ($ln in $lines) {
  if (-not $inserted -and $ln -match '^\|\s*T-FV-') { $buf.Add('| ' + $ghost + ' | fx-ghost-rotproof-v2 | none | open |'); $inserted = $true }
  $buf.Add($ln)
}
Chk ($inserted) 'a3-ghost-row-inserted'
[System.IO.File]::WriteAllLines($fxTasks, $buf, $utf8)
$r3 = Run-Tool -ToolPath $gate -ExtraArgs (' -TasksPath "' + $fxTasks + '" -TechPath "' + (Join-Path $repo 'TECH.md') + '"')
Chk ($r3.code -eq 2) ('a3-ghost-exit2 code=' + $r3.code)
Chk ($r3.out.Contains('R2-open-row-no-source: ' + $ghost)) 'a3-r2-fired-for-selected-ghost'
Remove-Item -LiteralPath $fxDir -Recurse -Force
Chk (-not (Test-Path -LiteralPath $fxDir)) 'a3-fixture-cleaned'

# ---- A4 rot simulation: future closing-row mention shifts id; historical rot reproduced ----
$rotLine = 'sim-future-closing-row mentions ' + $ghost + ' (fixture rot simulation only)'
$domRot = New-Object System.Collections.Generic.List[string]
foreach ($ln in $dom) { $domRot.Add($ln) }
$domRot.Add($rotLine)
$ghostRot = Select-GhostId -DomainLines $domRot
Chk ($null -ne $ghostRot) 'a4-next-id-selected'
Chk ($ghostRot -ne $ghost) 'a4-id-shifted-away-from-rotted'
$rotNum = $ghostRot.Substring(5)
$rxRot = 'T-FV-' + $rotNum + '(?!\d)'
$rotMentions = 0
foreach ($ln in $domRot) { if ($ln -match $rxRot) { $rotMentions++ } }
Chk ($rotMentions -eq 0) ('a4-new-id-zero-mention mentions=' + $rotMentions)
$fxDir2 = Join-Path $env:TEMP ('r266-rot-' + [guid]::NewGuid().ToString('N'))
New-Item -ItemType Directory -Path $fxDir2 | Out-Null
$fxTasks2 = Join-Path $fxDir2 'TASKS.md'
$fxTech2 = Join-Path $fxDir2 'TECH.md'
$tbuf = New-Object System.Collections.Generic.List[string]
$inserted2 = $false
foreach ($ln in $lines) {
  if (-not $inserted2 -and $ln -match '^\|\s*T-FV-') {
    $tbuf.Add('| ' + $ghost + ' | fx-rot-old | none | open |')
    $tbuf.Add('| ' + $ghostRot + ' | fx-rot-new | none | open |')
    $inserted2 = $true
  }
  $tbuf.Add($ln)
}
Chk ($inserted2) 'a4-two-ghost-rows-inserted'
[System.IO.File]::WriteAllLines($fxTasks2, $tbuf, $utf8)
$xcopy = New-Object System.Collections.Generic.List[string]
for ($i = 0; $i -lt $techLines.Count; $i++) {
  $xcopy.Add($techLines[$i])
  if ($i -eq $secStart) { $xcopy.Add($rotLine) }
}
[System.IO.File]::WriteAllLines($fxTech2, $xcopy, $utf8)
$r4 = Run-Tool -ToolPath $gate -ExtraArgs (' -TasksPath "' + $fxTasks2 + '" -TechPath "' + $fxTech2 + '"')
Chk ($r4.code -eq 2) ('a4-fixture-exit2 code=' + $r4.code)
Chk ($r4.out.Contains('R2-open-row-no-source: ' + $ghostRot)) 'a4-new-id-r2-fired'
Chk (-not $r4.out.Contains('R2-open-row-no-source: ' + $ghost)) 'a4-old-id-exempt-rot-reproduced'
Remove-Item -LiteralPath $fxDir2 -Recurse -Force
Chk (-not (Test-Path -LiteralPath $fxDir2)) 'a4-fixture-cleaned'

Write-Output ('r266-a3root-v2-test: PASS=' + $pass + ' FAIL=' + $fail)
if ($fail -gt 0) { exit 1 } else { exit 0 }
