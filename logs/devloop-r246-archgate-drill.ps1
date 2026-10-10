# devloop-r246-archgate-drill.ps1 - archive-window drill for tasks-board-check.ps1 (tech queue #2)
# Scenario: the first non-zero sec9 archive window (2026-10-24). archive-section9
# migrates aged rows into docs/archive/tech-section9/<YYYYMM>.md; the board gate
# must (a) still PASS with open rows whose source rows now live only in the
# archive (R2 cross-file), (b) still fire R1 from archive-resident removal
# mentions (R1 cross-file), plus isolated R2/R3 controls and recovery/idempotence.
# Child processes run via .NET Process double-redirect (29th trap law, r244/r245):
# never capture native stderr with 2>&1 under EAP=Stop.
$ErrorActionPreference = 'Stop'
$repo = Split-Path -Parent $PSScriptRoot
$archTool = Join-Path $repo 'Tools\devloop\archive-section9.ps1'
$gateTool = Join-Path $repo 'Tools\devloop\tasks-board-check.ps1'
$fix = Join-Path $env:TEMP 'fv-r246-archgate-fix'

$pass = 0
$fail = 0
function Chk([bool]$cond, [string]$name) {
  if ($cond) { $script:pass++; Write-Output ('PASS ' + $name) }
  else { $script:fail++; Write-Output ('FAIL ' + $name) }
}

# Run-Tool: .NET Process, double redirect, exit code from a held handle (r66 law).
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

# CJK via code points only (PS5.1 GBK law): yi/er section marks, shuang-xing-yi-chu removal words
$nl = [string][char]10
$utf8 = New-Object System.Text.UTF8Encoding($false)
$cYi = [string][char]0x4E00
$cEr = [string][char]0x4E8C
$cDun = [string][char]0x3001
$cDot = [string][char]0x00B7
$cShuangXing = [string][char]0x53CC + [string][char]0x884C
$cYiChu = [string][char]0x79FB + [string][char]0x9664

# ---- real-file fingerprint (drill must never touch them) ----
$realTech = Join-Path $repo 'TECH.md'
$sha = [System.Security.Cryptography.SHA256]::Create()
$realTechHash0 = [BitConverter]::ToString($sha.ComputeHash([System.IO.File]::ReadAllBytes($realTech)))

# ---- A0 build fixture ----
if (Test-Path -LiteralPath $fix) { Remove-Item -LiteralPath $fix -Recurse -Force }
New-Item -ItemType Directory -Path (Join-Path $fix 'tasks') -Force | Out-Null

$agedRow = '- [2026-09-23' + $cDot + 'r777 aged source row] open board row T-FV-150 sources here; closed note: T-FV-112 ' + $cShuangXing + $cYiChu + ' (board-removed)'
$youngRow = '- [2026-10-11' + $cDot + 'young row] open board row T-FV-151 sources here (stays in window)'
$techLines = @(
  '# FIXTURE TECH',
  '',
  '## Nine Backlog (fixture)',
  '- Archive pointer: docs/archive/tech-section9/<YYYYMM>.md (law row, fixture)',
  $agedRow,
  $youngRow,
  '',
  '## Ten Tail (fixture)',
  '- tail row stays'
)
[System.IO.File]::WriteAllText((Join-Path $fix 'TECH.md'), ([string]::Join($nl, $techLines) + $nl), $utf8)
[System.IO.File]::WriteAllText((Join-Path $fix 'HQ-FEEDBACK.md'), 'F-20261024-01 fixture ref r777' + $nl, $utf8)

$boardHead = @(
  '# FIXTURE TASKS',
  ('## ' + $cYi + $cDun + 'open table (fixture)'),
  '| ID | task | ptr | status |',
  '|---|---|---|---|',
  '| T-FV-150 | aged-source open row | archive-after-migration | open |',
  '| T-FV-151 | young-source open row | sec9 | open |',
  ('## ' + $cEr + $cDun + 'blocked table (fixture)'),
  '| ID | item | dep | status |',
  '|---|---|---|---|',
  '| T-FV-160 | blocked row with no source (exempt from R2) | external | blocked-on:x |'
)
$boardPristine = [string]::Join($nl, $boardHead) + $nl
$boardPath = Join-Path $fix 'tasks\TASKS.md'
[System.IO.File]::WriteAllText($boardPath, $boardPristine, $utf8)

Chk ($realTechHash0.Length -gt 0) 'a0 real tech fingerprint taken'

# ---- A1 pre-migration board gate: PASS, archive_files=0, both sources in sec9 ----
$r = Run-Tool -ToolPath $gateTool -ExtraArgs (' -Root "' + $fix + '"')
Chk ($r.code -eq 0) 'a1 pre-migration gate exit 0'
Chk ($r.out.Contains('BOARD-CHECK: PASS')) 'a1 pre-migration PASS'
Chk ($r.out.Contains('archive_files=0')) 'a1 pre-migration archive_files=0'
Chk (-not $r.out.Contains('violation:')) 'a1 pre-migration zero violations'

# ---- A2 simulate the 2026-10-24 window: aged row migrates to 202609.md ----
$r = Run-Tool -ToolPath $archTool -ExtraArgs (' -Root "' + $fix + '" -Today 2026-10-24')
Chk ($r.code -eq 0) 'a2 archive run exit 0'
Chk ($r.out.Contains('verdict: OK moved=1')) 'a2 verdict moved=1'
Chk ($r.out.Contains('months=202609')) 'a2 single month bucket 202609'
Chk ($r.out.Contains('tokens=1 hqfb_hits=1 resolved=1')) 'a2 g3 f-row addressing'
$postTech = [System.IO.File]::ReadAllText((Join-Path $fix 'TECH.md'), [System.Text.Encoding]::UTF8)
Chk (-not $postTech.Contains('T-FV-150')) 'a2 aged row left sec9 (T-FV-150 gone)'
$archPath = Join-Path $fix 'docs\archive\tech-section9\202609.md'
Chk (Test-Path -LiteralPath $archPath) 'a2 archive 202609.md created'
$archText = [System.IO.File]::ReadAllText($archPath, [System.Text.Encoding]::UTF8)
Chk ($archText.Contains('T-FV-150')) 'a2 archive holds aged source row'
Chk ($archText.Contains('T-FV-112')) 'a2 archive holds removal mention'

# ---- A3 post-migration gate: PASS with R2 source resolved from archive ----
$r = Run-Tool -ToolPath $gateTool -ExtraArgs (' -Root "' + $fix + '"')
Chk ($r.code -eq 0) 'a3 post-migration gate exit 0'
Chk ($r.out.Contains('BOARD-CHECK: PASS')) 'a3 post-migration PASS (cross-file R2 source)'
Chk ($r.out.Contains('archive_files=1')) 'a3 archive_files=1'
Chk ($r.out.Contains('open=2')) 'a3 open rows intact'
Chk (-not $r.out.Contains('T-FV-160')) 'a3 blocked row exempt from R2'

# ---- A4 R1 cross-file: closed ID whose removal mention lives ONLY in archive ----
$boardR1 = $boardPristine -replace '\| T-FV-151 \| young-source open row \| sec9 \| open \|', ('| T-FV-151 | young-source open row | sec9 | open |' + $nl + '| T-FV-112 | stale closed row re-added | none | open |')
[System.IO.File]::WriteAllText($boardPath, $boardR1, $utf8)
$r = Run-Tool -ToolPath $gateTool -ExtraArgs (' -Root "' + $fix + '"')
Chk ($r.code -eq 2) 'a4 gate exit 2 (RED)'
Chk ($r.out.Contains('R1-closed-but-on-board: T-FV-112')) 'a4 R1 fired from archive-resident mention'
Chk (-not $r.out.Contains('R2-open-row-no-source: T-FV-112')) 'a4 no R2 for T-FV-112 (mention = token present)'

# ---- A5 R2 control: open row with no source anywhere ----
$boardR2 = $boardPristine -replace '\| T-FV-151 \| young-source open row \| sec9 \| open \|', ('| T-FV-151 | young-source open row | sec9 | open |' + $nl + '| T-FV-999 | ghost row no source | none | open |')
[System.IO.File]::WriteAllText($boardPath, $boardR2, $utf8)
$r = Run-Tool -ToolPath $gateTool -ExtraArgs (' -Root "' + $fix + '"')
Chk ($r.code -eq 2) 'a5 gate exit 2 (RED)'
Chk ($r.out.Contains('R2-open-row-no-source: T-FV-999')) 'a5 R2 fired for ghost row'
Chk (-not $r.out.Contains('R1-closed-but-on-board')) 'a5 no R1 in this control'

# ---- A6 R3 control: duplicate board rows ----
$boardR3 = $boardPristine -replace '\| T-FV-151 \| young-source open row \| sec9 \| open \|', ('| T-FV-151 | dup a | x | open |' + $nl + '| T-FV-151 | dup b | x | open |')
[System.IO.File]::WriteAllText($boardPath, $boardR3, $utf8)
$r = Run-Tool -ToolPath $gateTool -ExtraArgs (' -Root "' + $fix + '"')
Chk ($r.code -eq 2) 'a6 gate exit 2 (RED)'
Chk ($r.out.Contains('R3-duplicate: T-FV-151 x2')) 'a6 R3 fired for duplicate'

# ---- A7 recovery: pristine board passes again ----
[System.IO.File]::WriteAllText($boardPath, $boardPristine, $utf8)
$r = Run-Tool -ToolPath $gateTool -ExtraArgs (' -Root "' + $fix + '"')
Chk ($r.code -eq 0) 'a7 recovery gate exit 0'

# ---- A8 deterministic double run (byte-identical output) ----
$r1 = Run-Tool -ToolPath $gateTool -ExtraArgs (' -Root "' + $fix + '"')
$r2 = Run-Tool -ToolPath $gateTool -ExtraArgs (' -Root "' + $fix + '"')
Chk ($r1.out -eq $r2.out) 'a8 double-run byte-identical'

# ---- A9 real-machine sanity: real gate PASS + real dry-run zero-row + real TECH untouched ----
$r = Run-Tool -ToolPath $gateTool -ExtraArgs ''
Chk ($r.code -eq 0) 'a9 real gate exit 0'
Chk ($r.out.Contains('BOARD-CHECK: PASS')) 'a9 real gate PASS'
$r = Run-Tool -ToolPath $archTool -ExtraArgs ' -DryRun'
Chk ($r.code -eq 0) 'a9 real archive dry-run exit 0'
Chk ($r.out.Contains('verdict: OK')) 'a9 real dry-run verdict OK'
Chk ($r.out.Contains('aged=0')) 'a9 real dry-run aged=0 (window not open yet)'
$realTechHash1 = [BitConverter]::ToString($sha.ComputeHash([System.IO.File]::ReadAllBytes($realTech)))
Chk ($realTechHash0 -eq $realTechHash1) 'a9 real TECH.md untouched by drill'

Write-Output ('RESULT pass=' + $pass + ' fail=' + $fail)
if ($fail -gt 0) { exit 1 } else { exit 0 }
