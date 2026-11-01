# test-qa-cite-duty.ps1 - sandbox proof for the citation-audit refresh duty
# (queue main#119; the reading it refreshes is main#116 / r782).
# ---------------------------------------------------------------------------
# r782 made the citation audit writable (-Record) but nothing ever ran it, so the
# number the page renders would stay frozen forever. r783 attaches the refresh to
# verify as section 2l through Tools\devloop\qa-cite-duty.ps1, gated by the
# record's own age (once a day, no extra state file, retries by itself).
#
# What this sandbox proves:
#   a) age reader   - the age comes from the record's own utc stamp; a copied old
#                     record still reads old (mtime is only the fallback), a
#                     future stamp clamps to 0, junk reads as no-answer
#   b) due test     - no reading is due; the boundary hour is due; a fresh
#                     reading is not
#   c) skips        - a fresh record does not run the recorder at all
#   d) refreshes    - a stale or missing record does, and the verdict is only OK
#                     when a recent record is actually on disk afterwards
#   e) fail-closed  - recorder missing / throws / writes nothing / writes an old
#                     stamp are four distinct non-OK verdicts, never OK
#   f) switches     - -DryRun never writes; -Force runs on a fresh record
#   g) integration  - the REAL qa-rotation.ps1 writes the record through this
#                     duty, and the REAL verify.ps1 prints exactly one qa-cite
#                     line, never carrying the tick red-scan token
# ASCII-only law: no CJK in this file.
# ---------------------------------------------------------------------------

$ErrorActionPreference = 'Stop'

$duty = Join-Path $PSScriptRoot 'qa-cite-duty.ps1'
$rotation = Join-Path $PSScriptRoot 'qa-rotation.ps1'
$verify = Join-Path (Split-Path -Parent $PSScriptRoot) 'perceptor\verify.ps1'
foreach ($need in @($duty, $rotation, $verify)) {
    if (-not (Test-Path -LiteralPath $need)) { Write-Output ('setup FAIL: missing ' + $need); exit 1 }
}
. $duty

$sandbox = Join-Path ([System.IO.Path]::GetTempPath()) ('fv-qa-cite-' + $PID)
if (Test-Path -LiteralPath $sandbox) { Remove-Item -LiteralPath $sandbox -Recurse -Force }
New-Item -ItemType Directory -Force -Path $sandbox | Out-Null

$pass = 0
$fail = 0
function Check([string]$name, [bool]$cond) {
    if ($cond) { Write-Output ('  PASS ' + $name); $script:pass++ }
    else { Write-Output ('  FAIL ' + $name); $script:fail++ }
}

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
function Write-Record {
    param([string]$Path, [datetime]$Utc, [hashtable]$Extra = @{})
    $obj = [ordered]@{
        utc = $Utc.ToUniversalTime().ToString('yyyy-MM-ddTHH:mm:ssZ')
        images = 93; cited = 74; stale_days = 90
        stale_cited = 0; superseded_cited = 0; newer_sibling_cited = 0
    }
    foreach ($k in $Extra.Keys) { $obj[$k] = $Extra[$k] }
    $dir = Split-Path -Parent $Path
    if ($dir -and -not (Test-Path -LiteralPath $dir)) { New-Item -ItemType Directory -Force -Path $dir | Out-Null }
    [System.IO.File]::WriteAllText($Path, ($obj | ConvertTo-Json -Depth 4 -Compress), $utf8NoBom)
}

$now = [DateTime]::UtcNow

# ---------- a) age reader ----------
Write-Output '--- a) age reader ---'
$missPath = Join-Path $sandbox 'a\nope.json'
$a1 = Get-QaCiteReadingAge -Path $missPath -Now $now
Check 'a1 missing: not exists'        (-not $a1.exists)
Check 'a2 missing: ok=false'          (-not $a1.ok)
Check 'a3 missing: age=-1'            ($a1.age_hours -eq -1)
Check 'a4 missing: basis=missing'     ($a1.basis -eq 'missing')

$freshPath = Join-Path $sandbox 'a\fresh.json'
Write-Record -Path $freshPath -Utc $now.AddHours(-2)
$a5 = Get-QaCiteReadingAge -Path $freshPath -Now $now
Check 'a5 utc: ok'                    ($a5.ok)
Check 'a6 utc: basis=utc'             ($a5.basis -eq 'utc')
Check 'a7 utc: age about 2h'          ([math]::Abs($a5.age_hours - 2.0) -lt 0.05)

# a copied old record: the file is brand new, the stamp inside is not. The age
# must follow the stamp - "freshly copied" must not read as "freshly measured".
$copyPath = Join-Path $sandbox 'a\copied.json'
$oldObj = @{ utc = $now.AddDays(-9).ToString('yyyy-MM-ddTHH:mm:ssZ'); cited = 74 }
[System.IO.File]::WriteAllText($copyPath, (($oldObj | ConvertTo-Json -Compress)), $utf8NoBom)
$a8 = Get-QaCiteReadingAge -Path $copyPath -Now $now
Check 'a8 copied: fresh file, old stamp' ([math]::Abs($a8.age_hours - 216.0) -lt 1.0)
Check 'a9 copied: basis=utc'          ($a8.basis -eq 'utc')

$futurePath = Join-Path $sandbox 'a\future.json'
Write-Record -Path $futurePath -Utc $now.AddHours(6)
$a10 = Get-QaCiteReadingAge -Path $futurePath -Now $now
Check 'a10 future stamp clamps to 0'  ($a10.age_hours -eq 0 -and $a10.ok)

$junkPath = Join-Path $sandbox 'a\junk.json'
[System.IO.File]::WriteAllText($junkPath, '{not json', $utf8NoBom)
$a11 = Get-QaCiteReadingAge -Path $junkPath -Now $now
Check 'a11 junk: ok=false'            (-not $a11.ok)
Check 'a12 junk: basis=unparsable'    ($a11.basis -eq 'unparsable')

# no utc inside, but the file has an mtime: fall back and say so.
$noStampPath = Join-Path $sandbox 'a\nostamp.json'
[System.IO.File]::WriteAllText($noStampPath, '{"cited":74}', $utf8NoBom)
[System.IO.File]::SetLastWriteTimeUtc($noStampPath, $now.AddHours(-5))
$a13 = Get-QaCiteReadingAge -Path $noStampPath -Now $now
Check 'a13 no stamp: basis=mtime'     ($a13.basis -eq 'mtime')
Check 'a14 no stamp: age about 5h'    ([math]::Abs($a13.age_hours - 5.0) -lt 0.1)

# ---------- b) due test ----------
Write-Output '--- b) due test ---'
Check 'b1 no reading is due'          (Test-QaCiteRefreshDue -AgeHours -1 -MaxAgeHours 24)
Check 'b2 fresh is not due'           (-not (Test-QaCiteRefreshDue -AgeHours 2 -MaxAgeHours 24))
Check 'b3 just under is not due'      (-not (Test-QaCiteRefreshDue -AgeHours 23.9 -MaxAgeHours 24))
Check 'b4 boundary hour is due'       (Test-QaCiteRefreshDue -AgeHours 24 -MaxAgeHours 24)
Check 'b5 far past is due'            (Test-QaCiteRefreshDue -AgeHours 47 -MaxAgeHours 24)
Check 'b6 zero is not due'            (-not (Test-QaCiteRefreshDue -AgeHours 0 -MaxAgeHours 24))

# ---------- c) a fresh record does not buy a refresh ----------
Write-Output '--- c) skips when fresh ---'
$stubLog = Join-Path $sandbox 'c\stub-ran.txt'
$stub = Join-Path $sandbox 'c\stub.ps1'
New-Item -ItemType Directory -Force -Path (Join-Path $sandbox 'c') | Out-Null
@'
param([string]$RecordPath = '')
Set-Content -LiteralPath (Join-Path (Split-Path -Parent $PSCommandPath) 'stub-ran.txt') -Value 'ran' -Encoding ASCII
[System.IO.File]::WriteAllText($RecordPath, ('{"utc":"' + [DateTime]::UtcNow.ToString('yyyy-MM-ddTHH:mm:ssZ') + '","cited":74}'))
'@ | Set-Content -LiteralPath $stub -Encoding ASCII

$cRec = Join-Path $sandbox 'c\rec.json'
Write-Record -Path $cRec -Utc $now.AddHours(-1)
$c = Invoke-QaCiteDuty -Root $sandbox -RecordPath $cRec -RecorderPath $stub -Now $now
Check 'c1 verdict SKIP'               ($c.verdict -eq 'SKIP')
Check 'c2 reason fresh'               ($c.reason -eq 'fresh')
Check 'c3 ran=false'                  (-not $c.ran)
Check 'c4 recorder never invoked'     (-not (Test-Path -LiteralPath $stubLog))
Check 'c5 age_before reported'        ([math]::Abs($c.age_before_hours - 1.0) -lt 0.05)

# ---------- d) stale and missing records do refresh ----------
Write-Output '--- d) refreshes when old or absent ---'
$dRec = Join-Path $sandbox 'd\rec.json'
New-Item -ItemType Directory -Force -Path (Join-Path $sandbox 'd') | Out-Null
Write-Record -Path $dRec -Utc $now.AddDays(-4)
$d = Invoke-QaCiteDuty -Root $sandbox -RecordPath $dRec -RecorderPath $stub -Now $now
Check 'd1 verdict OK'                 ($d.verdict -eq 'OK')
Check 'd2 ran=true'                   ($d.ran)
Check 'd3 age_before about 96h'       ([math]::Abs($d.age_before_hours - 96.0) -lt 1.0)
Check 'd4 age_after about 0'          ($d.age_after_hours -lt 0.1)
$dOnDisk = Get-QaCiteReadingAge -Path $dRec -Now $now
Check 'd5 record on disk is fresh'    ($dOnDisk.ok -and $dOnDisk.age_hours -lt 0.1)

$dMissing = Join-Path $sandbox 'd\absent.json'
$d2 = Invoke-QaCiteDuty -Root $sandbox -RecordPath $dMissing -RecorderPath $stub -Now $now
Check 'd6 missing record is refreshed' ($d2.verdict -eq 'OK' -and $d2.ran)
Check 'd7 age_before=none when absent' ($d2.age_before_hours -eq -1)

# ---------- e) fail-closed: four ways a refresh must not claim success ----------
Write-Output '--- e) fail-closed ---'
$eDir = Join-Path $sandbox 'e'
New-Item -ItemType Directory -Force -Path $eDir | Out-Null

$e1 = Invoke-QaCiteDuty -Root $sandbox -RecordPath (Join-Path $eDir 'r.json') -RecorderPath (Join-Path $eDir 'nope.ps1') -Now $now
Check 'e1 recorder missing: MISSING'  ($e1.verdict -eq 'MISSING' -and -not $e1.ran)

$throwStub = Join-Path $eDir 'throw.ps1'
'throw "boom"' | Set-Content -LiteralPath $throwStub -Encoding ASCII
$e2 = Invoke-QaCiteDuty -Root $sandbox -RecordPath (Join-Path $eDir 'r2.json') -RecorderPath $throwStub -Now $now
Check 'e2 recorder throws: THROW'     ($e2.verdict -eq 'THROW')

# the trap this exists for: the tool was called, printed nothing useful, and no
# record appeared. "I ran it" must never be reported as a fresh reading.
$noopStub = Join-Path $eDir 'noop.ps1'
'Write-Output "QA RECORD: pretend"' | Set-Content -LiteralPath $noopStub -Encoding ASCII
$e3 = Invoke-QaCiteDuty -Root $sandbox -RecordPath (Join-Path $eDir 'r3.json') -RecorderPath $noopStub -Now $now
Check 'e3 no record written: NOTWRITTEN' ($e3.verdict -eq 'NOTWRITTEN')
Check 'e4 reason no-record-after'     ($e3.reason -eq 'no-record-after')

$oldStub = Join-Path $eDir 'old.ps1'
@'
param([string]$RecordPath = '')
[System.IO.File]::WriteAllText($RecordPath, ('{"utc":"' + [DateTime]::UtcNow.AddDays(-5).ToString('yyyy-MM-ddTHH:mm:ssZ') + '","cited":74}'))
'@ | Set-Content -LiteralPath $oldStub -Encoding ASCII
$e5 = Invoke-QaCiteDuty -Root $sandbox -RecordPath (Join-Path $eDir 'r4.json') -RecorderPath $oldStub -Now $now
Check 'e5 old stamp written: NOTWRITTEN' ($e5.verdict -eq 'NOTWRITTEN')
Check 'e6 reason record-not-freshened' ($e5.reason -eq 'record-not-freshened')

# ---------- f) switches ----------
Write-Output '--- f) switches ---'
$fRec = Join-Path $sandbox 'f\rec.json'
New-Item -ItemType Directory -Force -Path (Join-Path $sandbox 'f') | Out-Null
Write-Record -Path $fRec -Utc $now.AddDays(-6)
$fBefore = [System.IO.File]::ReadAllText($fRec)
$f1 = Invoke-QaCiteDuty -Root $sandbox -RecordPath $fRec -RecorderPath $stub -Now $now -DryRun
Check 'f1 dry-run: DRYRUN'            ($f1.verdict -eq 'DRYRUN')
Check 'f2 dry-run: record untouched'  ([System.IO.File]::ReadAllText($fRec) -eq $fBefore)

$fFresh = Join-Path $sandbox 'f\fresh.json'
Write-Record -Path $fFresh -Utc $now.AddHours(-1)
$f3 = Invoke-QaCiteDuty -Root $sandbox -RecordPath $fFresh -RecorderPath $stub -Now $now -Force
Check 'f3 force: runs on a fresh record' ($f3.verdict -eq 'OK' -and $f3.ran)

# ---------- g) integration with the real recorder and the real gate ----------
Write-Output '--- g) real qa-rotation + real verify ---'
$pool = Join-Path $sandbox 'g\pool'
New-Item -ItemType Directory -Force -Path $pool | Out-Null
# two tiny PNG-shaped files are enough for the census; the citation index is fed
# an empty explicit list so the sandbox does not depend on this repo's git state.
foreach ($n in @('city-demo-20260101-0000-bm-a-overview.png', 'panel-demo-20260101-0000-bm-a.png')) {
    [System.IO.File]::WriteAllBytes((Join-Path $pool $n), [byte[]](1..40))
}
$gRec = Join-Path $sandbox 'g\rec.json'
& $rotation -Dir $pool -RecordPath $gRec -CiteFiles @() | Out-Null
$gWritten = Get-QaCiteReadingAge -Path $gRec -Now $now
Check 'g1 real rotation wrote a record' ($gWritten.ok)
Check 'g2 real record is fresh'       ($gWritten.age_hours -lt 0.1)
$gJson = [System.IO.File]::ReadAllText($gRec) | ConvertFrom-Json
Check 'g3 record carries the census'  ($null -ne $gJson.PSObject.Properties['cited'] -and $null -ne $gJson.PSObject.Properties['stale_cited'])

# the duty driving the real recorder end to end, over an aged record
Write-Record -Path $gRec -Utc $now.AddDays(-3)
$g = Invoke-QaCiteDuty -Root $sandbox -RecordPath $gRec -RecorderPath $rotation -Now $now
Check 'g4 duty+real recorder: OK'     ($g.verdict -eq 'OK')
$gAfter = Get-QaCiteReadingAge -Path $gRec -Now $now
Check 'g5 record freshened on disk'   ($gAfter.ok -and $gAfter.age_hours -lt 0.1)

$gVerifyRec = Join-Path $sandbox 'g\verify-rec.json'
$env:FLUXVERSE_QACITE_RECORD = $gVerifyRec
$env:FLUXVERSE_PS_SUITES_CHILD = '1'
try {
    $gLog = (& powershell -NoProfile -ExecutionPolicy Bypass -File $verify) -join "`n"
    $gCode = $LASTEXITCODE
} finally {
    Remove-Item Env:\FLUXVERSE_QACITE_RECORD -ErrorAction SilentlyContinue
    Remove-Item Env:\FLUXVERSE_PS_SUITES_CHILD -ErrorAction SilentlyContinue
}
$gLines = @(($gLog -split "`n") | Where-Object { $_ -match 'qa-cite:' })
Check 'g6 verify prints one qa-cite line' ($gLines.Count -eq 1)
Check 'g7 qa-cite line is HEALTH'     ($gLines.Count -eq 1 -and $gLines[0] -match 'VERIFY HEALTH: qa-cite:')
Check 'g8 qa-cite line never FAIL token' (@($gLines | Where-Object { $_ -match 'FAIL' }).Count -eq 0)
Check 'g9 verify exits 0'             ($gCode -eq 0)
Check 'g10 verify refreshed the record' (Test-Path -LiteralPath $gVerifyRec)

# ---------- h) the page's own verdict on an old reading ----------
# The duty keeps the reading young; this group proves the page notices when it is
# not. The builder decides (single source, pinned clock), the template renders.
Write-Output '--- h) page verdict on an aged reading ---'
$builder = Join-Path $PSScriptRoot 'build-city-panel.ps1'
# The clock crosses a process boundary, so it travels as an ISO string: a
# [datetime] argument loses its Kind and shifts by the local offset (measured in
# this sandbox: a 120 h fixture arrived as 112 h on a +08 machine).
$hNow = [DateTime]::SpecifyKind([DateTime]::Parse('2026-11-01T12:00:00Z'), [DateTimeKind]::Utc)
$hNowUtc = $hNow.ToString('yyyy-MM-ddTHH:mm:ssZ')
function Invoke-PanelBuild {
    param([string]$AuditPath, [string]$Tag)
    $outHtml = Join-Path $sandbox ('h\panel-' + $Tag + '.html')
    $hist = Join-Path $sandbox ('h\hist-' + $Tag + '.jsonl')
    $hdir = Join-Path $sandbox 'h'
    if (-not (Test-Path -LiteralPath $hdir)) { New-Item -ItemType Directory -Force -Path $hdir | Out-Null }
    $log = (& powershell -NoProfile -ExecutionPolicy Bypass -File $builder `
            -QaCiteAuditPath $AuditPath -QaCiteNowUtc $hNowUtc -OutPath $outHtml -HistoryPath $hist -SiteSkip) -join "`n"
    $html = ''
    if (Test-Path -LiteralPath $outHtml) { $html = [System.IO.File]::ReadAllText($outHtml) }
    return [pscustomobject]@{ log = $log; html = $html }
}

# Only the builder's verdict is asserted here: the row itself is rendered in the
# browser, so a text assertion on the built file would be reading the template's
# source strings, not what a reader sees. The rendered wording is proven by
# logs/devloop-r704-panel-headselfcheck-test.js (qacite.overdue-* cases).
$hOld = Join-Path $sandbox 'h\old.json'
Write-Record -Path $hOld -Utc $hNow.AddDays(-5)
$hOldBuild = Invoke-PanelBuild -AuditPath $hOld -Tag 'old'
Check 'h1 old reading: builder says overdue' ($hOldBuild.log -match 'qacite_overdue=1')
Check 'h2 old reading: age carried'          ($hOldBuild.log -match 'qacite_age=120')

$hFresh = Join-Path $sandbox 'h\fresh.json'
Write-Record -Path $hFresh -Utc $hNow.AddHours(-2)
$hFreshBuild = Invoke-PanelBuild -AuditPath $hFresh -Tag 'fresh'
Check 'h3 fresh reading: not overdue'        ($hFreshBuild.log -match 'qacite_overdue=0')
Check 'h4 fresh reading: age carried'        ($hFreshBuild.log -match 'qacite_age=2')

$hMissingBuild = Invoke-PanelBuild -AuditPath (Join-Path $sandbox 'h\absent.json') -Tag 'absent'
Check 'h5 missing reading: overdue=missing'  ($hMissingBuild.log -match 'qacite_overdue=missing')
Check 'h6 missing reading: age=missing'      ($hMissingBuild.log -match 'qacite_age=missing')

# The threshold is the builder's, and 48 h is a deliberate choice rather than a
# default nobody can see: one daily refresh keeps the age under 24 h, so 48 h
# means a whole day of refreshes did not happen.
$hBoundary = Join-Path $sandbox 'h\boundary.json'
Write-Record -Path $hBoundary -Utc $hNow.AddHours(-47)
$hBoundaryBuild = Invoke-PanelBuild -AuditPath $hBoundary -Tag 'boundary'
Check 'h7 under the line: not overdue'       ($hBoundaryBuild.log -match 'qacite_overdue=0')

$hOver = Join-Path $sandbox 'h\over.json'
Write-Record -Path $hOver -Utc $hNow.AddHours(-49)
$hOverBuild = Invoke-PanelBuild -AuditPath $hOver -Tag 'over'
Check 'h8 over the line: overdue'            ($hOverBuild.log -match 'qacite_overdue=1')

$src = [System.IO.File]::ReadAllText($duty)
$nonAscii = 0
foreach ($ch in $src.ToCharArray()) { if ([int][char]$ch -gt 127) { $nonAscii++ } }
Check 'g11 duty module is ASCII-only' ($nonAscii -eq 0)

Remove-Item -LiteralPath $sandbox -Recurse -Force -ErrorAction SilentlyContinue
Write-Output ('test-qa-cite-duty: ' + $pass + ' passed, ' + $fail + ' failed (of ' + ($pass + $fail) + ')')
if ($fail -gt 0) { exit 1 }
exit 0