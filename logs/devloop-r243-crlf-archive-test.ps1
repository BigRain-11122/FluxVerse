# devloop-r243-crlf-archive-test.ps1 - CRLF write-path sandbox for archive-section9.ps1
# Context: r230 sandbox used LF-only fixtures; the worktree TECH.md went CRLF after
# keepdown (core.autocrlf=true checkout rewrite, git side stays LF). This exercises
# the real tool's CRLF write path before the first real migration window (2026-10-24).
# Fixture: 3 aged rows (two months: 202608 template-created + 202609 appended),
# 1 in-window row, 1 undated row, existing archive file, HQ-FEEDBACK with rNN token.

$ErrorActionPreference = 'Stop'
$repo = Split-Path -Parent $PSScriptRoot
$tool = Join-Path $repo 'Tools\devloop\archive-section9.ps1'
$fix  = Join-Path $env:TEMP 'fv-r243-crlf-fix'

$pass = 0
$fail = 0
function Chk([bool]$cond, [string]$name) {
  if ($cond) { $script:pass++; Write-Output ('PASS ' + $name) }
  else { $script:fail++; Write-Output ('FAIL ' + $name) }
}

$nl = [string][char]10
$cr = [string][char]13
$crlf = $cr + $nl
$utf8 = New-Object System.Text.UTF8Encoding($false)

if (Test-Path -LiteralPath $fix) { Remove-Item -LiteralPath $fix -Recurse -Force }
New-Item -ItemType Directory -Path (Join-Path $fix 'docs\archive\tech-section9') -Force | Out-Null

$techLines = @(
  '# FIXTURE TECH',
  '',
  '## Nine Backlog (fixture)',
  '- Archive pointer: docs/archive/tech-section9/<YYYYMM>.md (law row, fixture)',
  '- [2026-08-15 r776 FIX ROW AGED ZERO] base row for month 202608',
  '- [2026-09-01 r777 FIX ROW AGED ONE] alpha content',
  '- [2026-09-05 r778 FIX ROW AGED TWO] beta content',
  '- [2026-10-05 FIX ROW IN WINDOW] gamma content stays',
  '- [FIX ROW UNDATED header has no date] delta content stays',
  '',
  '## Ten Tail (fixture)',
  '- tail row stays'
)
$techText = [string]::Join($crlf, $techLines) + $crlf
$techPathFix = Join-Path $fix 'TECH.md'
[System.IO.File]::WriteAllText($techPathFix, $techText, $utf8)

$archExisting = '# ARCHIVE 202609 fixture' + $nl + '- [2026-08-20 EXISTING ROW] prior content' + $nl
$arch9Path = Join-Path $fix 'docs\archive\tech-section9\202609.md'
[System.IO.File]::WriteAllText($arch9Path, $archExisting, $utf8)

[System.IO.File]::WriteAllText((Join-Path $fix 'HQ-FEEDBACK.md'), 'F-20260930-01 fixture ref r777' + $nl, $utf8)

# ---- A0 fixture pre-state ----
$preBytes = [System.IO.File]::ReadAllBytes($techPathFix)
$preLf = 0
$preCrlf = 0
for ($i = 0; $i -lt $preBytes.Length; $i++) {
  if ($preBytes[$i] -eq 10) { $preLf++; if ($i -gt 0 -and $preBytes[$i-1] -eq 13) { $preCrlf++ } }
}
Chk ($preBytes.Length -gt 100) 'a0 fixture tech built'
Chk ($preLf -eq $preCrlf) 'a0 fixture tech all-crlf'
Chk ($preLf -eq $techLines.Count) 'a0 fixture tech line count'
Chk (-not ($preBytes[0] -eq 0xEF -and $preBytes[1] -eq 0xBB -and $preBytes[2] -eq 0xBF)) 'a0 fixture tech no-bom'

# ---- run 1: real tool against CRLF fixture ----
$out1 = @(& powershell -NoProfile -ExecutionPolicy Bypass -File $tool -Root $fix -Today 2026-10-11 2>&1)
$code1 = $LASTEXITCODE
$out1Text = [string]::Join($nl, $out1)
Chk ($code1 -eq 0) 'run1 exit 0'
Chk ($out1Text.Contains('verdict: OK moved=3')) 'run1 verdict moved=3'
Chk ($out1Text.Contains('months=202608,202609')) 'run1 months two buckets'
Chk ($out1Text.Contains('tokens=3 hqfb_hits=1 resolved=3')) 'run1 g3 tokens/hqfb'

# ---- A1 G1 byte math (CRLF eolBytes=2) ----
$postBytes = [System.IO.File]::ReadAllBytes($techPathFix)
$movedRows = @(
  '- [2026-08-15 r776 FIX ROW AGED ZERO] base row for month 202608',
  '- [2026-09-01 r777 FIX ROW AGED ONE] alpha content',
  '- [2026-09-05 r778 FIX ROW AGED TWO] beta content'
)
$movedBytesCalc = 0
foreach ($mr in $movedRows) { $movedBytesCalc += $utf8.GetByteCount($mr) + 2 }
Chk ($postBytes.Length -eq ($preBytes.Length - $movedBytesCalc)) 'g1 byte math exact crlf'

# ---- A2 EOL regime preserved ----
$postLf = 0
$postCrlf = 0
for ($i = 0; $i -lt $postBytes.Length; $i++) {
  if ($postBytes[$i] -eq 10) { $postLf++; if ($i -gt 0 -and $postBytes[$i-1] -eq 13) { $postCrlf++ } }
}
Chk ($postLf -eq $postCrlf) 'post tech all-crlf preserved'
$lb = $postBytes.Length
Chk ($postBytes[$lb-2] -eq 13 -and $postBytes[$lb-1] -eq 10) 'post tech ends-with crlf'
Chk (-not ($postBytes[0] -eq 0xEF -and $postBytes[1] -eq 0xBB -and $postBytes[2] -eq 0xBF)) 'post tech no-bom'

# ---- A3 row placement ----
$postRaw = [System.IO.File]::ReadAllText($techPathFix, [System.Text.Encoding]::UTF8)
Chk (-not $postRaw.Contains('FIX ROW AGED')) 'g2 zero moved-row residual'
Chk ($postRaw.Contains('FIX ROW IN WINDOW')) 'retained in-window row'
Chk ($postRaw.Contains('FIX ROW UNDATED')) 'retained undated row (conservative keep)'
Chk ($postRaw.Contains('tail row stays')) 'retained tail row'

# ---- A4 archive files ----
$arch8Path = Join-Path $fix 'docs\archive\tech-section9\202608.md'
Chk (Test-Path -LiteralPath $arch8Path) 'archive 202608 template-created'
$arch8Text = [System.IO.File]::ReadAllText($arch8Path, [System.Text.Encoding]::UTF8)
Chk ($arch8Text.Contains('FIX ROW AGED ZERO')) 'archive 202608 has aged-zero row'
Chk ($arch8Text.Contains('202608')) 'archive 202608 month rendered'
$arch9Text = [System.IO.File]::ReadAllText($arch9Path, [System.Text.Encoding]::UTF8)
Chk ($arch9Text.Contains('FIX ROW AGED ONE')) 'archive 202609 has aged-one'
Chk ($arch9Text.Contains('FIX ROW AGED TWO')) 'archive 202609 has aged-two'
Chk ($arch9Text.Contains('EXISTING ROW')) 'archive 202609 prior row kept'
$arch9B = [System.IO.File]::ReadAllBytes($arch9Path)
$arch9Crlf = 0
for ($i = 0; $i -lt $arch9B.Length; $i++) { if ($arch9B[$i] -eq 10 -and $i -gt 0 -and $arch9B[$i-1] -eq 13) { $arch9Crlf++ } }
$arch8B = [System.IO.File]::ReadAllBytes($arch8Path)
$arch8Crlf = 0
for ($i = 0; $i -lt $arch8B.Length; $i++) { if ($arch8B[$i] -eq 10 -and $i -gt 0 -and $arch8B[$i-1] -eq 13) { $arch8Crlf++ } }
Chk ($arch9Crlf -eq 0) 'archive 202609 lf-only (append canon)'
Chk ($arch8Crlf -eq 0) 'archive 202608 lf-only (template canon)'

# ---- A5 idempotent run 2 ----
$sha = [System.Security.Cryptography.SHA256]::Create()
$hTech1 = [BitConverter]::ToString($sha.ComputeHash($postBytes))
$hA9r1 = [BitConverter]::ToString($sha.ComputeHash($arch9B))
$hA8r1 = [BitConverter]::ToString($sha.ComputeHash($arch8B))
$out2 = @(& powershell -NoProfile -ExecutionPolicy Bypass -File $tool -Root $fix -Today 2026-10-11 2>&1)
$code2 = $LASTEXITCODE
$out2Text = [string]::Join($nl, $out2)
Chk ($code2 -eq 0) 'run2 exit 0'
Chk ($out2Text.Contains('moved=0 (no rows outside active window)')) 'run2 honest zero-row'
$post2Bytes = [System.IO.File]::ReadAllBytes($techPathFix)
$hTech2 = [BitConverter]::ToString($sha.ComputeHash($post2Bytes))
Chk ($hTech1 -eq $hTech2) 'run2 tech hash-stable'
$hA9r2 = [BitConverter]::ToString($sha.ComputeHash([System.IO.File]::ReadAllBytes($arch9Path)))
$hA8r2 = [BitConverter]::ToString($sha.ComputeHash([System.IO.File]::ReadAllBytes($arch8Path)))
Chk ($hA9r1 -eq $hA9r2) 'run2 archive-202609 hash-stable'
Chk ($hA8r1 -eq $hA8r2) 'run2 archive-202608 hash-stable'

Write-Output ('RESULT pass=' + $pass + ' fail=' + $fail)
if ($fail -gt 0) { exit 1 } else { exit 0 }
