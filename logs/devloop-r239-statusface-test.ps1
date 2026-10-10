# devloop-r239-statusface-test.ps1 - regression harness for the v0.2
# status_face section of export-public-snapshot.ps1 (r239, Executive
# Protocol v1.1 no.3). Self-contained: builds fixtures in a temp dir, runs
# the exporter per case via -StatusFile/-OutDir/-NoGit, asserts the
# status_face= note on the export line. Fail-soft law: every case must
# exit 0 (a bad status file never blocks the public snapshot).
# ASCII-only script (encoding law); CJK fixture words via code points.
$ErrorActionPreference = 'Stop'
$exporter = Join-Path $PSScriptRoot '..\Tools\tick\export-public-snapshot.ps1'
$tmp = Join-Path ([System.IO.Path]::GetTempPath()) ('fv-sf-test-' + $PID)
New-Item -ItemType Directory -Path $tmp | Out-Null
$outDir = Join-Path $tmp 'out'
New-Item -ItemType Directory -Path $outDir | Out-Null
$CJKjing = [string][char]0x51C0 + [string][char]0x503C   # jing-zhi (forbidden CJK word)
function CJK {
  param([int[]]$cps)
  $s = ''
  foreach ($c in $cps) { $s += [char]$c }
  $s
}
$pass = 0; $fail = 0
function Write-Fixture {
  param([string]$path, [string]$body)
  [System.IO.File]::WriteAllText($path, $body, (New-Object System.Text.UTF8Encoding($false)))
}
function Run-Case {
  param([string]$name, [string]$statusFile, [string]$expectedNote)
  $argsList = @('-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', $exporter, '-OutDir', $outDir, '-NoGit')
  if ($statusFile) { $argsList += @('-StatusFile', $statusFile) }
  $out = & powershell @argsList 2>$null
  $code = $LASTEXITCODE
  $line = ''
  foreach ($l in $out) { if ($l -match 'status_face=') { $line = [string]$l } }
  $ok = ($code -eq 0) -and ($line -match ('status_face=' + $expectedNote + '(|\s)'))
  if ($ok) { $script:pass++; Write-Output ('PASS ' + $name + ' -> ' + $expectedNote + ' exit=' + $code) }
  else { $script:fail++; Write-Output ('FAIL ' + $name + ' -> line=[' + $line + '] exit=' + $code) }
}
# fixtures
$goodBody = '{"updated_utc":"2026-01-01T00:00:00Z","current_activity":"harness good","artifact":"docs/x.png","artifact_utc":"2026-01-01T00:00:00Z","milestone":"m","milestone_eta_utc":"2026-01-02T00:00:00Z"}'
Write-Fixture (Join-Path $tmp 'good.json') $goodBody
Write-Fixture (Join-Path $tmp 'missing.json') '{"updated_utc":"2026-01-01T00:00:00Z","current_activity":"partial"}'
Write-Fixture (Join-Path $tmp 'malformed.json') '{ not json'
$g1Body = '{"updated_utc":"2026-01-01T00:00:00Z","current_activity":"probe ghp_ABCDEFGHIJKLMNOPQRSTUVWX","artifact":"docs/x.png","artifact_utc":"2026-01-01T00:00:00Z","milestone":"m","milestone_eta_utc":"2026-01-02T00:00:00Z"}'
Write-Fixture (Join-Path $tmp 'g1.json') $g1Body
$g5Body = '{"updated_utc":"2026-01-01T00:00:00Z","current_activity":"probe C:\\Users\\xx","artifact":"docs/x.png","artifact_utc":"2026-01-01T00:00:00Z","milestone":"m","milestone_eta_utc":"2026-01-02T00:00:00Z"}'
Write-Fixture (Join-Path $tmp 'g5.json') $g5Body
$g3Body = '{"updated_utc":"2026-01-01T00:00:00Z","current_activity":"probe ' + $CJKjing + '","artifact":"docs/x.png","artifact_utc":"2026-01-01T00:00:00Z","milestone":"m","milestone_eta_utc":"2026-01-02T00:00:00Z"}'
Write-Fixture (Join-Path $tmp 'g3cjk.json') $g3Body
$badtsBody = '{"updated_utc":"2026-01-01T00:00:00Z","current_activity":"ts probe","artifact":"docs/x.png","artifact_utc":"yesterday","milestone":"m","milestone_eta_utc":"2026-01-02T00:00:00Z"}'
Write-Fixture (Join-Path $tmp 'badts.json') $badtsBody
# cases (absent = nonexistent path; included runs LAST so the final promoted
# snapshot in $outDir is the included one for the section-keys assertion)
Run-Case 'absent'    (Join-Path $tmp 'nope.json') 'absent'
Run-Case 'missing'   (Join-Path $tmp 'missing.json') 'skip'
Run-Case 'malformed' (Join-Path $tmp 'malformed.json') 'skip-malformed'
Run-Case 'g1'        (Join-Path $tmp 'g1.json') 'skip-G1'
Run-Case 'g5'        (Join-Path $tmp 'g5.json') 'skip-G5'
Run-Case 'g3cjk'     (Join-Path $tmp 'g3cjk.json') 'skip-G3cjk'
Run-Case 'badts'     (Join-Path $tmp 'badts.json') 'skip'
Run-Case 'included'  (Join-Path $tmp 'good.json') 'included'
# included snapshot must actually carry the six-key section (G2 walk passed)
$snapText = [System.IO.File]::ReadAllText((Join-Path $outDir 'city-snapshot.json'), [System.Text.Encoding]::UTF8)
$sixKeys = @('"updated_utc"','"current_activity"','"artifact"','"artifact_utc"','"milestone"','"milestone_eta_utc"')
$keysOk = $true
foreach ($k in $sixKeys) { if (-not $snapText.Contains($k)) { $keysOk = $false } }
if ($keysOk -and $snapText.Contains('"status_face"')) { $pass++; Write-Output 'PASS section-keys six keys in included snapshot' }
else { $fail++; Write-Output 'FAIL section-keys in included snapshot' }
Remove-Item -Recurse -Force $tmp -ErrorAction SilentlyContinue
Write-Output ('SUMMARY pass=' + $pass + ' fail=' + $fail)
if ($fail -gt 0) { exit 2 } else { exit 0 }
