# logs/devloop-r230-archive-test.ps1 - sandbox for Tools/devloop/archive-section9.ps1 (r230)
# ASCII-only harness (r53 law). Chk cond-first (r191 sandbox family law).
$ErrorActionPreference = 'Stop'
$repo = 'C:\Users\sjs20\Desktop\FluxGroup\gaming\FluxVerse'
$tool = Join-Path $repo 'Tools\devloop\archive-section9.ps1'
$tplPath = Join-Path $repo 'Tools\devloop\archive-section9-header.txt'
$realTech = Join-Path $repo 'TECH.md'
$realArchDir = Join-Path $repo 'docs\archive\tech-section9'
$realLanding = Join-Path $realArchDir '202609.md'
$utf8 = New-Object System.Text.UTF8Encoding($false)
$nl = [string][char]10

$pass = 0
$fail = 0
$failList = New-Object System.Collections.Generic.List[string]
function Chk([bool]$c, [string]$name) {
  if ($c) { $script:pass++ } else { $script:fail++; $script:failList.Add($name) }
}
function WriteTxt([string]$path, [string]$text) { [System.IO.File]::WriteAllText($path, $text, $script:utf8) }
function ReadTxt([string]$path) { [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8) }
function Hash([string]$path) {
  $b = [System.IO.File]::ReadAllBytes($path)
  $sha = New-Object System.Security.Cryptography.SHA256Managed
  (($sha.ComputeHash($b) | ForEach-Object { $_.ToString('x2') }) -join '')
}
function RunTool([string[]]$a) {
  $out = @(& powershell.exe -NoProfile -ExecutionPolicy Bypass -File $tool @a 2>&1)
  $code = $LASTEXITCODE
  [PSCustomObject]@{ Text = ($out -join $nl); Code = $code }
}
function NewFx([string]$name) {
  $d = Join-Path $env:TEMP $name
  if (Test-Path -LiteralPath $d) { Remove-Item -LiteralPath $d -Recurse -Force }
  New-Item -ItemType Directory -Path $d -Force | Out-Null
  $d
}
function LineCount([string]$text) {
  $arr = $text -split $script:nl
  $n = $arr.Count
  if ($n -gt 0 -and $arr[$n - 1] -eq '') { $n-- }
  $n
}

# capture real-repo baseline (isolation proof targets)
$h0Tech = Hash $realTech
$h0Landing = Hash $realLanding
$c0Arch = @(Get-ChildItem -LiteralPath $realArchDir -Filter '*.md').Count

# ---------- A0 static (5) ----------
Chk (Test-Path -LiteralPath $tool) 'A0.1 tool exists'
$tb = [System.IO.File]::ReadAllBytes($tool)
$bad = 0
foreach ($b in $tb) { if ($b -ge 0x80) { $bad++ } }
Chk ($bad -eq 0) 'A0.2 tool body pure ASCII'
$tplText = ReadTxt $tplPath
Chk ($tplText.Contains('__MONTH__')) 'A0.3 template has __MONTH__ placeholder'
Chk ($tplText.Contains('__RANGE__')) 'A0.4 template has __RANGE__ placeholder'
$toolText = ReadTxt $tool
Chk ($toolText.Contains('-MinAgeDays') -and $toolText.Contains('-Root') -and $toolText.Contains('-DryRun') -and $toolText.Contains('-Today')) 'A0.5 tool params in place'

# ---------- fixture builder ----------
function FixtureTech([bool]$withPointer) {
  $sb = New-Object System.Text.StringBuilder
  [void]$sb.Append('# fixture tech' + $nl)
  [void]$sb.Append('## one intro' + $nl)
  [void]$sb.Append('## Jiu Backlog test header' + $nl)
  if ($withPointer) { [void]$sb.Append('> pointer line docs/archive/tech-section9/<YYYYMM>.md' + $nl) }
  [void]$sb.Append('- [2026-07-04 r001] julius row body' + $nl)
  [void]$sb.Append($nl)
  [void]$sb.Append('- [2026-08-20 r002] august row body' + $nl)
  [void]$sb.Append('- [2026-08-31 r005] aged edge row' + $nl)
  [void]$sb.Append('- [2026-09-01 r003] edge keep row' + $nl)
  [void]$sb.Append('- [2026-09-15 r004] young keep row' + $nl)
  [void]$sb.Append('- [P1] undated row stays' + $nl)
  [void]$sb.Append($nl)
  [void]$sb.Append('## Shi tail header' + $nl)
  [void]$sb.Append('- tail bullet untouched' + $nl)
  $sb.ToString()
}

# ---------- A1+A2 migration (fx1) ----------
$fx1 = NewFx 'sec9fx1'
WriteTxt (Join-Path $fx1 'TECH.md') (FixtureTech $true)
WriteTxt (Join-Path $fx1 'HQ-FEEDBACK.md') ('| F-1 | row referencing r001 somewhere' + $nl)
$fx1Tech = Join-Path $fx1 'TECH.md'
$fx1Arch = Join-Path $fx1 'docs\archive\tech-section9'
$b1 = [System.IO.File]::ReadAllBytes($fx1Tech).Length
$movedBytesFx1 = $utf8.GetByteCount('- [2026-07-04 r001] julius row body') + 1 + $utf8.GetByteCount('- [2026-08-20 r002] august row body') + 1 + $utf8.GetByteCount('- [2026-08-31 r005] aged edge row') + 1
$r1 = RunTool @('-Root', $fx1, '-Today', '2026-10-01')
Chk ($r1.Code -eq 0) 'A1.1 fx1 run exit 0'
Chk ($r1.Text.Contains('aged=3')) 'A1.2 fx1 aged=3'
Chk ($r1.Text.Contains('months=202607,202608')) 'A1.3 fx1 months list'
$a707 = Join-Path $fx1Arch '202607.md'
$a708 = Join-Path $fx1Arch '202608.md'
Chk ((Test-Path -LiteralPath $a707) -and ((ReadTxt $a707).Contains('julius row body'))) 'A1.4 202607.md has julius row'
$t708 = ''
if (Test-Path -LiteralPath $a708) { $t708 = ReadTxt $a708 }
Chk ($t708.Contains('august row body') -and $t708.Contains('aged edge row')) 'A1.5 202608.md has both august rows'
$t1 = ReadTxt $fx1Tech
Chk ((-not $t1.Contains('julius row body')) -and (-not $t1.Contains('august row body')) -and (-not $t1.Contains('aged edge row'))) 'A1.6 no moved row residual in TECH'
Chk ($t1.Contains('undated row stays') -and $t1.Contains('edge keep row') -and $t1.Contains('young keep row')) 'A1.7 keep-set intact (undated+window rows)'
Chk ($t1.Contains('Jiu Backlog test header') -and $t1.Contains('pointer line docs/archive/tech-section9')) 'A1.8 header+pointer intact'
# A2 reconcile (3)
Chk ((LineCount $t1) -eq 11) 'A2.1 fx1 TECH line count = 14-3'
$b1after = [System.IO.File]::ReadAllBytes($fx1Tech).Length
Chk ($b1after -eq ($b1 - $movedBytesFx1)) 'A2.2 fx1 TECH byte reconcile'
Chk (((LineCount (ReadTxt $a707)) -eq 7) -and ((LineCount $t708) -eq 8)) 'A2.3 archive line counts 7/8 (6-line header + rows)'

# ---------- A3 idempotent run2 (2) ----------
$hTech1 = Hash $fx1Tech
$hA707 = Hash $a707
$hA708 = Hash $a708
$r2 = RunTool @('-Root', $fx1, '-Today', '2026-10-01')
Chk (($r2.Code -eq 0) -and ($r2.Text.Contains('moved=0'))) 'A3.1 second run zero moves'
Chk (((Hash $fx1Tech) -eq $hTech1) -and ((Hash $a707) -eq $hA707) -and ((Hash $a708) -eq $hA708)) 'A3.2 idempotent hashes unchanged'

# ---------- A4 dry-run (fx2) (3) ----------
$fx2 = NewFx 'sec9fx2'
WriteTxt (Join-Path $fx2 'TECH.md') (FixtureTech $true)
$fx2Tech = Join-Path $fx2 'TECH.md'
$h2 = Hash $fx2Tech
$r3 = RunTool @('-Root', $fx2, '-Today', '2026-10-01', '-DryRun')
Chk (($r3.Code -eq 0) -and ($r3.Text.Contains('dry-run') -and $r3.Text.Contains('plan:'))) 'A4.1 dry-run exit 0 with plan lines'
Chk ((Hash $fx2Tech) -eq $h2) 'A4.2 dry-run TECH untouched'
Chk (-not (Test-Path -LiteralPath (Join-Path $fx2 'docs\archive\tech-section9'))) 'A4.3 dry-run creates no archive dir'

# ---------- A5 no-pointer refuse (fx3) (2) ----------
$fx3 = NewFx 'sec9fx3'
WriteTxt (Join-Path $fx3 'TECH.md') (FixtureTech $false)
$fx3Tech = Join-Path $fx3 'TECH.md'
$h3 = Hash $fx3Tech
$r4 = RunTool @('-Root', $fx3, '-Today', '2026-10-01')
Chk (($r4.Code -eq 1) -and ($r4.Text.Contains('FAIL'))) 'A5.1 no-pointer run refused exit 1'
Chk (((Hash $fx3Tech) -eq $h3) -and (-not (Test-Path -LiteralPath (Join-Path $fx3 'docs\archive\tech-section9')))) 'A5.2 refused run wrote nothing'

# ---------- A6 parse forms (fx4) (3) ----------
$fx4 = NewFx 'sec9fx4'
$sb4 = New-Object System.Text.StringBuilder
[void]$sb4.Append('# fixture4' + $nl)
[void]$sb4.Append('## Jiu Backlog forms' + $nl)
[void]$sb4.Append('> pointer docs/archive/tech-section9/x' + $nl)
[void]$sb4.Append('- [T2 mid 2026-08-01 date] mid row body' + $nl)
[void]$sb4.Append('- [x] body 2026-07-15 not in bracket' + $nl)
[void]$sb4.Append('- [future 2099-01-01] future row' + $nl)
[void]$sb4.Append('- [2026-09-05 r009] kept row' + $nl)
[void]$sb4.Append('## Shi tail' + $nl)
WriteTxt (Join-Path $fx4 'TECH.md') $sb4.ToString()
$r5 = RunTool @('-Root', $fx4, '-Today', '2026-10-01')
$t4 = ReadTxt (Join-Path $fx4 'TECH.md')
Chk (($r5.Code -eq 0) -and ($r5.Text.Contains('aged=1')) -and ($r5.Text.Contains('months=202608'))) 'A6.1 bracket-date-only law (aged=1 -> 202608)'
Chk ($t4.Contains('future row') -and $t4.Contains('not in bracket') -and $t4.Contains('kept row')) 'A6.2 future+body-date+young rows kept'
Chk (-not $t4.Contains('mid row body')) 'A6.3 mid-bracket date row migrated'

# ---------- A7 template render (3) ----------
$line1_707 = ((ReadTxt $a707) -split $nl)[0]
$line1_708 = ((ReadTxt $a708) -split $nl)[0]
Chk ($line1_707.Contains('202607')) 'A7.1 202607.md title rendered with month'
Chk ($line1_708.Contains('202608')) 'A7.2 202608.md title rendered with month'
$noPlaceholder = -not ((ReadTxt $a707).Contains('__MONTH__') -or (ReadTxt $a707).Contains('__RANGE__') -or $t708.Contains('__MONTH__') -or $t708.Contains('__RANGE__'))
Chk $noPlaceholder 'A7.3 no raw placeholders left in archives'

# ---------- A8 append path (fx5) (2) ----------
$fx5 = NewFx 'sec9fx5'
$fx5Arch = Join-Path $fx5 'docs\archive\tech-section9'
New-Item -ItemType Directory -Path $fx5Arch -Force | Out-Null
WriteTxt (Join-Path $fx5Arch '202608.md') ('# preexisting 202608 archive' + $nl + '- [2026-08-10 r100] preexisting archived row' + $nl)
$sb5 = New-Object System.Text.StringBuilder
[void]$sb5.Append('# fixture5' + $nl)
[void]$sb5.Append('## Jiu Backlog append' + $nl)
[void]$sb5.Append('> pointer docs/archive/tech-section9/x' + $nl)
[void]$sb5.Append('- [2026-08-25 r101] new aged row' + $nl)
[void]$sb5.Append('## Shi tail' + $nl)
WriteTxt (Join-Path $fx5 'TECH.md') $sb5.ToString()
$r6 = RunTool @('-Root', $fx5, '-Today', '2026-10-01')
$tA8 = ReadTxt (Join-Path $fx5Arch '202608.md')
Chk (($r6.Code -eq 0) -and ($r6.Text.Contains('moved=1'))) 'A8.1 append run exit 0 moved=1'
$oldRow = '- [2026-08-10 r100] preexisting archived row'
$newRow = '- [2026-08-25 r101] new aged row'
Chk ($tA8.Contains($oldRow + $nl + $nl + $newRow)) 'A8.2 appended after existing with separator'

# ---------- A9 production dry-run (real repo, pointer now in place) (4) ----------
$prod = RunTool @('-Today', '2026-09-28', '-DryRun')
Chk ($prod.Code -eq 0) 'A9.1 production dry-run exit 0'
Chk ($prod.Text.Contains('aged=0') -and $prod.Text.Contains('verdict: OK')) 'A9.2 production aged=0 verdict OK'
Chk ((Hash $realTech) -eq $h0Tech) 'A9.3 real TECH untouched by dry-run'
Chk (((Hash $realLanding) -eq $h0Landing) -and (@(Get-ChildItem -LiteralPath $realArchDir -Filter '*.md').Count -eq $c0Arch)) 'A9.4 landing file untouched, archive set unchanged'

# ---------- A10 determinism (1) ----------
$prod2 = RunTool @('-Today', '2026-09-28', '-DryRun')
Chk ($prod.Text -ceq $prod2.Text) 'A10 double-run byte-identical output'

# ---------- A11 real-repo isolation final (1) ----------
Chk ((Hash $realTech) -eq $h0Tech) 'A11 real TECH untouched by whole sandbox'

# ---------- summary ----------
'--- production dry-run report (first run) ---'
$prod.Text
'--- sandbox summary ---'
('PASS=' + $pass + ' FAIL=' + $fail)
foreach ($f in $failList) { ('RED: ' + $f) }
if ($fail -eq 0) { 'VERDICT: OK'; exit 0 } else { 'VERDICT: RED'; exit 1 }
