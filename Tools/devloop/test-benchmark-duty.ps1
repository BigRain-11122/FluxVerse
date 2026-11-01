# test-benchmark-duty.ps1 - sandbox proof for the benchmark due-date reading
# (queue main#23; module landed in r785).
#
# The module's only job is to answer "when does the benchmark face say it is due,
# and is that date already behind us?" from the document itself, so the proof is
# about the reading's honesty, not about the wording of the tick line:
#   a) a declared future date reads as days left, never as overdue
#   b) a declared past date reads as overdue, by the right number of days
#   c) a fresh mtime never rescues an old declared date (touching is not a refresh)
#   d) a face that declares nothing falls back to mtime+limit and says basis=mtime
#   e) a missing face is "no reading", never "zero" and never "fresh"
#   f) the last declared row wins over an older row in the same document
#   g) a declared date that is not a real calendar day falls back instead of lying
#   h) wiring: the gate really calls the module, the runner really lists this file,
#      the tick family really protects both - a module nobody calls is not a fix
#   i) the live face reads as declared (this is the reading the CEO sees)
#   j) both new files stay ASCII (group PS5.1 encoding law)
#
# ASCII-only (no CJK typed here; the one anchor is built from code points).

$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$module = Join-Path $repoRoot 'Tools\devloop\benchmark-duty.ps1'
$verify = Join-Path $repoRoot 'Tools\perceptor\verify.ps1'
$runner = Join-Path $repoRoot 'Tools\devloop\run-ps-suites.ps1'
$tick = Join-Path $repoRoot 'Tools\devloop\ps-suites-tick.ps1'

$pass = 0
$fail = 0
function Check([string]$name, [bool]$cond) {
    if ($cond) { Write-Output ('  PASS ' + $name); $script:pass++ }
    else { Write-Output ('  FAIL ' + $name); $script:fail++ }
}

if (-not (Test-Path -LiteralPath $module)) { Write-Output ('setup FAIL: missing ' + $module); exit 1 }
. $module

$senior = ([string][char]0x53F8) + ([string][char]0x7EA7)
$day = ([string][char]0x5929)
$anchor = $senior + ' 7 ' + $day + '='

$sandbox = Join-Path ([System.IO.Path]::GetTempPath()) ('fv-benchmark-' + $PID)
if (Test-Path -LiteralPath $sandbox) { Remove-Item -LiteralPath $sandbox -Recurse -Force }
New-Item -ItemType Directory -Force -Path $sandbox | Out-Null

function New-Face([string]$name, [string[]]$rows) {
    $p = Join-Path $sandbox $name
    $text = (@($rows) -join "`r`n") + "`r`n"
    [System.IO.File]::WriteAllText($p, $text, (New-Object System.Text.UTF8Encoding($false)))
    return $p
}

$now = [datetime]::new(2026, 11, 1, 10, 0, 0, [System.DateTimeKind]::Utc)

# ---------- a: declared future date is days left ----------
$faceA = New-Face 'a.md' @('| 2026-10-20 | v1.3 | ' + $anchor + '**2026-11-08** |')
$rA = Get-BenchmarkReading -Path $faceA -Now $now
Check 'a1 declared basis' ($rA.basis -eq 'declared')
Check 'a2 due echoed as yyyy-MM-dd' ($rA.due -eq '2026-11-08')
Check 'a3 future reads seven days left' ($rA.days_left -eq 7)
Check 'a4 reading is ok and exists' ($rA.ok -and $rA.exists)

# ---------- b: declared past date is overdue by the right count ----------
$faceB = New-Face 'b.md' @('| 2026-10-20 | v1.3 | ' + $anchor + '**2026-10-27** |')
$rB = Get-BenchmarkReading -Path $faceB -Now $now
Check 'b1 past date is overdue' ($rB.days_left -eq -5)
Check 'b2 overdue keeps the declared basis' ($rB.basis -eq 'declared')

# ---------- c: touching the file is not a refresh ----------
$faceC = New-Face 'c.md' @('| 2026-10-20 | v1.3 | ' + $anchor + '**2026-10-27** |')
(Get-Item -LiteralPath $faceC).LastWriteTime = (Get-Date)
$rC = Get-BenchmarkReading -Path $faceC -Now $now
Check 'c1 fresh mtime does not rescue an old declared date' ($rC.days_left -eq -5)
Check 'c2 basis stays declared after a touch' ($rC.basis -eq 'declared')

# ---------- d: no declared date falls back to mtime+limit ----------
$faceD = New-Face 'd.md' @('| 2026-10-20 | no anchor here |')
(Get-Item -LiteralPath $faceD).LastWriteTimeUtc = ([datetime]::new(2026, 10, 1, 0, 0, 0, [System.DateTimeKind]::Utc))
$rD = Get-BenchmarkReading -Path $faceD -LimitDays 7 -Now $now
Check 'd1 fallback basis is mtime' ($rD.basis -eq 'mtime')
Check 'd2 fallback due is mtime plus limit' ($rD.due -eq '2026-10-08')
Check 'd3 fallback can be overdue' ($rD.days_left -eq -24)

# ---------- e: a missing face is no reading ----------
$rE = Get-BenchmarkReading -Path (Join-Path $sandbox 'nope.md') -Now $now
Check 'e1 missing face is not exists' (-not $rE.exists)
Check 'e2 missing face is not ok' (-not $rE.ok)
Check 'e3 missing face basis says missing' ($rE.basis -eq 'missing')

# ---------- f: the last declared row wins ----------
$faceF = New-Face 'f.md' @(
    '| 2026-10-20 | old row | ' + $anchor + '**2026-10-27** |',
    '| 2026-10-27 | newer row | ' + $anchor + '**2026-11-19** |'
)
$rF = Get-BenchmarkReading -Path $faceF -Now $now
Check 'f1 last row wins' ($rF.due -eq '2026-11-19')
Check 'f2 last row gives days left' ($rF.days_left -eq 18)

# ---------- g: an impossible declared date falls back ----------
$faceG = New-Face 'g.md' @('| 2026-10-20 | broken | ' + $anchor + '**2026-13-45** |')
(Get-Item -LiteralPath $faceG).LastWriteTimeUtc = ([datetime]::new(2026, 10, 20, 0, 0, 0, [System.DateTimeKind]::Utc))
$rG = Get-BenchmarkReading -Path $faceG -Now $now
Check 'g1 impossible date does not become the due date' ($rG.due -eq '2026-10-27')
Check 'g2 impossible date falls back to mtime basis' ($rG.basis -eq 'mtime')

# ---------- h: wiring ----------
$verifyText = [System.IO.File]::ReadAllText($verify, [System.Text.Encoding]::UTF8)
$runnerText = [System.IO.File]::ReadAllText($runner, [System.Text.Encoding]::UTF8)
$tickText = [System.IO.File]::ReadAllText($tick, [System.Text.Encoding]::UTF8)
Check 'h1 gate dot-sources the module' ($verifyText.Contains('benchmark-duty.ps1'))
Check 'h2 gate calls the reading' ($verifyText.Contains('Get-BenchmarkReading'))
Check 'h3 gate prints a benchmarks line' ($verifyText.Contains('benchmarks:'))
Check 'h4 runner verify list carries this sandbox' ($runnerText.Contains('test-benchmark-duty.ps1'))
Check 'h5 tick verify family protects the module' ($tickText.Contains('benchmark-duty.ps1'))
Check 'h6 tick verify family protects this sandbox' ($tickText.Contains('test-benchmark-duty.ps1'))
$blockStart = $verifyText.IndexOf('2m benchmark face')
$blockEnd = $verifyText.IndexOf('# The decomposition, printed once')
$block = ''
if ($blockStart -ge 0 -and $blockEnd -gt $blockStart) { $block = $verifyText.Substring($blockStart, $blockEnd - $blockStart) }
Check 'h7 the new block exists' ($block.Length -gt 200)
Check 'h8 the new block carries no red token' (-not $block.Contains('FAIL'))

# ---------- i: the live face reads as declared ----------
$live = Join-Path $repoRoot 'docs\global-benchmarks.md'
$rLive = Get-BenchmarkReading -Path $live
Check 'i1 live face is readable' ($rLive.exists -and $rLive.ok)
Check 'i2 live face answers from its own declared row' ($rLive.basis -eq 'declared')
Check 'i3 live due looks like a date' ($rLive.due -match '^\d{4}-\d{2}-\d{2}$')

# ---------- j: ASCII-only for both new files ----------
$thisFile = Join-Path $PSScriptRoot 'test-benchmark-duty.ps1'
foreach ($pair in @(@('module', $module), @('sandbox', $thisFile))) {
    $bytes = [System.IO.File]::ReadAllBytes($pair[1])
    $non = 0
    foreach ($b in $bytes) { if ($b -gt 127) { $non++ } }
    Check ('j ' + $pair[0] + ' stays ascii (nonascii=' + $non + ')') ($non -eq 0)
}

if (Test-Path -LiteralPath $sandbox) { Remove-Item -LiteralPath $sandbox -Recurse -Force }

Write-Output ('RESULT: pass=' + $pass + ' fail=' + $fail)
if ($fail -gt 0) { exit 1 }
exit 0