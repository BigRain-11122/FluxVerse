# test-qa-rotation.ps1 - sandbox proof for the qa/ retention census (main#109)
# ---------------------------------------------------------------------------
# The plan is only safe if it respects capture SESSIONS. city3d-shots-<stamp>-*
# is six files that only mean something together; a naive "keep newest 5 files"
# window would keep half a set and move the other half, which is worse than
# keeping everything. main#109 also forbids deleting to make the number look
# better, so this sandbox pins three things:
#   1. counts/sizes/oldest come from the files, not from a hand-kept list;
#   2. a session is moved whole or not at all, and the newest sessions survive;
#   3. the run is dry: every fixture file is still on disk afterwards.
# ASCII-only law: no CJK in this file.

$ErrorActionPreference = 'Stop'
$tool = Join-Path $PSScriptRoot 'qa-rotation.ps1'
if (-not (Test-Path -LiteralPath $tool)) { Write-Output 'setup FAIL: qa-rotation.ps1 missing'; exit 1 }

$sandbox = Join-Path ([System.IO.Path]::GetTempPath()) ('fv-qarot-' + $PID)
$pool = Join-Path $sandbox 'qa'
New-Item -ItemType Directory -Path $pool -Force | Out-Null

# Citation fixtures (r777, main#113): the tool will not move a file that a
# tracked document names. The empty one keeps every number in this sandbox
# stable; the cited ones are used by the dedicated groups at the end.
$citeEmpty = Join-Path $sandbox 'cite-empty.md'
[System.IO.File]::WriteAllText($citeEmpty, "# nothing cited here`r`n")

$pass = 0
$fail = 0
function Check([string]$name, [bool]$cond) {
    if ($cond) { Write-Output ('  PASS ' + $name); $script:pass++ }
    else { Write-Output ('  FAIL ' + $name); $script:fail++ }
}

$base = [datetime]::UtcNow.AddDays(-10)
function New-Fix([string]$name, [int]$len, [datetime]$mtime) {
    $path = Join-Path $pool $name
    $bytes = New-Object byte[] $len
    for ($i = 0; $i -lt $len; $i++) { $bytes[$i] = [byte](65 + ($i % 26)) }
    [System.IO.File]::WriteAllBytes($path, $bytes)
    [System.IO.File]::SetLastWriteTimeUtc($path, $mtime)
}

# Absolute-path variant for the second pool (apply-mode fixtures). No mtime is
# set on purpose: every session then ties on time and the name token alone
# decides the window, which is the tie-break the tool documents.
function New-Fix2([string]$path, [int]$len) {
    $bytes = New-Object byte[] $len
    for ($i = 0; $i -lt $len; $i++) { $bytes[$i] = [byte](65 + ($i % 26)) }
    [System.IO.File]::WriteAllBytes($path, $bytes)
}

# Four capture sessions, oldest first. Each session is six views.
$sessions = @('20261001-1000', '20261002-1000', '20261003-1000', '20261004-1000')
$views = @('overview', 'street', 'gamedistrict', 'housefront', 'showcase', 'cutaway')
$d = 0
foreach ($s in $sessions) {
    foreach ($v in $views) {
        New-Fix ('city3d-shots-' + $s + '-bm-a-' + $v + '.jpg') 100 ($base.AddHours($d))
    }
    $d += 1
}
# Panel self-shots: one per round, so the per-file window applies.
for ($i = 0; $i -lt 5; $i++) {
    New-Fix ('city-panel-r' + (700 + $i) + '-bm-a.png') 200 ($base.AddDays($i))
}
# Two tokenless smoke frames: each is its own session (per-file window).
New-Fix 'smoke-a.png' 50 ($base.AddDays(1))
New-Fix 'smoke-b.png' 50 ($base.AddDays(2))
# Non-family image: never rotated.
New-Fix 'notes.png' 30 ($base)
# Non-image: never counted at all.
[System.IO.File]::WriteAllText((Join-Path $pool 'readme.md'), 'not an image')

$log = (& powershell -NoProfile -ExecutionPolicy Bypass -File $tool -Dir $pool -CiteFiles $citeEmpty) -join "`n"
$rc = $LASTEXITCODE

Check 'tool exits 0 on a readable pool' ($rc -eq 0)
Check 'image count is 32 (29 fixtures + 1 note, md excluded)' ($log -match 'QA POOL: images=32\b')
Check 'city3d reports 24 files over 4 sessions' ($log -match 'city3d-\s+n=24 sessions=4\b')
Check 'city3d plan moves exactly one whole session (6 files)' ($log -match 'city3d-.*keep=3 move=6\b')
Check 'panel keeps 3 of 5 files' ($log -match 'panel\s+n=5 sessions=5.*keep=3 move=2\b')
Check 'tokenless smoke frames stay (2 <= 3)' ($log -match 'smoke-\s+n=2 .*move=0\b')
Check 'non-family image is never rotated' ($log -match 'other\s+n=1 .*keep=all move=0\b')
Check 'plan total is 8 moves' ($log -match 'QA PLAN: moves=8\b')
Check 'plan says it is a dry run' ($log -match 'dry-run, nothing touched')

# Per-file listing proves session atomicity: the oldest session is named in
# full, the newest one is not named at all.
$listLog = (& powershell -NoProfile -ExecutionPolicy Bypass -File $tool -Dir $pool -List -CiteFiles $citeEmpty) -join "`n"
$movedOld = 0
foreach ($v in $views) {
    if ($listLog -match ('MOVE city3d-shots-20261001-1000-bm-a-' + $v + '\.jpg')) { $movedOld++ }
}
Check 'every view of the oldest session is listed' ($movedOld -eq 6)
$movedNew = 0
foreach ($v in $views) {
    if ($listLog -match ('MOVE city3d-shots-20261004-1000-bm-a-' + $v + '\.jpg')) { $movedNew++ }
}
Check 'no view of the newest session is listed' ($movedNew -eq 0)
Check 'it lists no md file' (-not ($listLog -match 'MOVE readme\.md'))

# Json mode: totals must agree with the text mode.
$jsonLog = (& powershell -NoProfile -ExecutionPolicy Bypass -File $tool -Dir $pool -Json -CiteFiles $citeEmpty) -join "`n"
$j = $null
try { $j = $jsonLog | ConvertFrom-Json } catch { $j = $null }
Check 'json parses' ($null -ne $j)
if ($j) {
    Check 'json images=32' ([int]$j.images -eq 32)
    $mv = 0
    $rec = [int64]0
    foreach ($g in @($j.groups)) { $mv += [int]$g.move; $rec += [int64]$g.reclaim }
    Check 'json move total is 8' ($mv -eq 8)
    Check 'json reclaim is the 8 moved files (6x100 + 2x200)' ($rec -eq 1000)
}

# Missing directory is a stated failure, not a silent zero.
$missing = Join-Path $sandbox 'nope'
$badLog = (& powershell -NoProfile -ExecutionPolicy Bypass -File $tool -Dir $missing -CiteFiles $citeEmpty) -join "`n"
$badRc = $LASTEXITCODE
Check 'missing dir exits 2' ($badRc -eq 2)
Check 'missing dir is named, not printed as zero images' ($badLog -match 'QA POOL FAIL')

# Dry run: nothing left the pool.
$still = @(Get-ChildItem -LiteralPath $pool -File | Where-Object { $_.Extension -match '^\.(png|jpg|jpeg)$' }).Count
$stillMd = Test-Path -LiteralPath (Join-Path $pool 'readme.md')
Check 'all 32 image fixtures still on disk' ($still -eq 32)
Check 'the non-image fixture was never touched' ($stillMd)

# ASCII-only law for the tool itself.
$nonAscii = 0
foreach ($b in [System.IO.File]::ReadAllBytes($tool)) { if ($b -gt 127) { $nonAscii++ } }
Check 'tool is ASCII-only' ($nonAscii -eq 0)

# ---------------------------------------------------------------------------
# Apply mode (r772): the plan is executed as a MOVE, whole sessions only, and
# the pool that remains is the plan's complement. Everything below re-reads the
# file system - it must not trust the tool's own report.
# ---------------------------------------------------------------------------
$archive = Join-Path $pool '_archive'
$applyLog = (& powershell -NoProfile -ExecutionPolicy Bypass -File $tool -Dir $pool -Apply -CiteFiles $citeEmpty) -join "`n"
$applyRc = $LASTEXITCODE
Check 'apply exits 0' ($applyRc -eq 0)
Check 'apply reports the 8 planned moves and their bytes' ($applyLog -match 'QA APPLY: moved=8 bytes=1000B')
Check 'apply names its archive' ($applyLog -match ('archive=' + [regex]::Escape($archive)))

$poolLeft = @(Get-ChildItem -LiteralPath $pool -File | Where-Object { $_.Extension -match '^\.(png|jpg|jpeg)$' })
$archived = @(Get-ChildItem -LiteralPath $archive -File | Where-Object { $_.Extension -match '^\.(png|jpg|jpeg)$' })
Check 'nothing was deleted: 32 images still exist across pool+archive' (($poolLeft.Count + $archived.Count) -eq 32)
Check 'exactly the 8 planned files left the pool' ($poolLeft.Count -eq 24)
Check 'the archive holds exactly those 8' ($archived.Count -eq 8)
$wholeSession = $true
foreach ($v in $views) {
    $inPool = Test-Path -LiteralPath (Join-Path $pool ('city3d-shots-20261001-1000-bm-a-' + $v + '.jpg'))
    $inArch = Test-Path -LiteralPath (Join-Path $archive ('city3d-shots-20261001-1000-bm-a-' + $v + '.jpg'))
    if ($inPool -or -not $inArch) { $wholeSession = $false }
}
Check 'the moved session arrived whole (all six views in the archive)' $wholeSession
$keepIntact = $true
foreach ($s in @('20261002-1000', '20261003-1000', '20261004-1000')) {
    foreach ($v in $views) {
        if (-not (Test-Path -LiteralPath (Join-Path $pool ('city3d-shots-' + $s + '-bm-a-' + $v + '.jpg')))) { $keepIntact = $false }
    }
}
Check 'every view of the three surviving sessions is still in the pool' $keepIntact
Check 'panel keeps its newest 3 in the pool' (
    (Test-Path -LiteralPath (Join-Path $pool 'city-panel-r704-bm-a.png')) -and
    (Test-Path -LiteralPath (Join-Path $archive 'city-panel-r700-bm-a.png')) -and
    (Test-Path -LiteralPath (Join-Path $archive 'city-panel-r701-bm-a.png')))
Check 'the non-family image never moved' (Test-Path -LiteralPath (Join-Path $pool 'notes.png'))
Check 'the non-image file never moved' (Test-Path -LiteralPath (Join-Path $pool 'readme.md'))

$ledger = Join-Path $archive 'MOVED.tsv'
$ledgerRows = @()
if (Test-Path -LiteralPath $ledger) {
    $ledgerRows = @(Get-Content -LiteralPath $ledger -Encoding UTF8 | Where-Object { $_ -and -not $_.StartsWith('#') })
}
Check 'the archive ledger has one row per moved file' ($ledgerRows.Count -eq 8)
Check 'the ledger records name and size (reversal needs no guessing)' (
    [bool](@($ledgerRows) -match 'city3d-shots-20261001-1000-bm-a-street\.jpg\t100\t'))

# Second apply is a no-op, not a second wave: the surviving pool is inside the
# window, so the plan is empty and the archive must not grow.
$againLog = (& powershell -NoProfile -ExecutionPolicy Bypass -File $tool -Dir $pool -Apply -CiteFiles $citeEmpty) -join "`n"
$againRc = $LASTEXITCODE
$archived2 = @(Get-ChildItem -LiteralPath $archive -File | Where-Object { $_.Extension -match '^\.(png|jpg|jpeg)$' })
Check 're-apply exits 0' ($againRc -eq 0)
Check 're-apply plans zero moves' ($againLog -match 'QA PLAN: moves=0\b')
Check 're-apply moves nothing (archive still 8)' ($archived2.Count -eq 8)

# Fail-closed: a planned name that already sits in the archive means pool and
# archive disagree, so the tool must move NOTHING and say so.
$pool2 = Join-Path $sandbox 'qa2'
New-Item -ItemType Directory -Path $pool2 -Force | Out-Null
foreach ($s in $sessions) {
    foreach ($v in $views) {
        New-Fix2 (Join-Path $pool2 ('city3d-shots-' + $s + '-bm-a-' + $v + '.jpg')) 100
    }
}
$arch2 = Join-Path $pool2 '_archive'
New-Item -ItemType Directory -Path $arch2 -Force | Out-Null
[System.IO.File]::WriteAllBytes((Join-Path $arch2 'city3d-shots-20261001-1000-bm-a-street.jpg'), (New-Object byte[] 7))
$conflLog = (& powershell -NoProfile -ExecutionPolicy Bypass -File $tool -Dir $pool2 -Apply -CiteFiles $citeEmpty) -join "`n"
$conflRc = $LASTEXITCODE
$pool2Left = @(Get-ChildItem -LiteralPath $pool2 -File | Where-Object { $_.Extension -match '^\.(png|jpg|jpeg)$' })
Check 'a conflict exits 2' ($conflRc -eq 2)
Check 'a conflict is named, not silently skipped' ($conflLog -match 'QA APPLY FAIL: 1 planned name\(s\) already in')
Check 'a conflict moves nothing at all (all 24 still in the pool)' ($pool2Left.Count -eq 24)

# ---------------------------------------------------------------------------
# Citation group (r777, main#113): the window numbers were a guess, so the rule
# became "a tracked document names it" - such a file is never planned for a
# move, and a cited name that already sits in _archive is reported as dangling
# instead of vanishing. Everything here re-reads the file system.
# ---------------------------------------------------------------------------
$pool3 = Join-Path $sandbox 'qa3'
New-Item -ItemType Directory -Path $pool3 -Force | Out-Null
foreach ($s in $sessions) {
    foreach ($v in $views) {
        New-Fix2 (Join-Path $pool3 ('city3d-shots-' + $s + '-bm-a-' + $v + '.jpg')) 100
    }
}
# One citation, on ONE view of the oldest session: that file must stay while the
# other five views of the same session still move (a citation is per file, not a
# blanket pardon for the session).
$citeOne = Join-Path $sandbox 'cite-one.md'
[System.IO.File]::WriteAllText($citeOne, "Evidence: qa/city3d-shots-20261001-1000-bm-a-street.jpg`r`n")

$citeLog = (& powershell -NoProfile -ExecutionPolicy Bypass -File $tool -Dir $pool3 -List -CiteFiles $citeOne) -join "`n"
$citeRc = $LASTEXITCODE
Check 'cited run exits 0' ($citeRc -eq 0)
Check 'citation line prints the index readout' ($citeLog -match 'QA CITE: cited=1/24 in pool, archive_cited=0')
Check 'the cited file is reported as kept' ($citeLog -match 'KEEP city3d-shots-20261001-1000-bm-a-street\.jpg \(cited: ')
Check 'the cited file is not planned for a move' (-not ($citeLog -match 'MOVE city3d-shots-20261001-1000-bm-a-street\.jpg'))
Check 'the other five views of that session still move' ($citeLog -match 'QA PLAN: moves=5\b')
Check 'plan counts the move the citation avoided' ($citeLog -match 'cited_kept=1\b')
Check 'no dangling line when pool and archive agree' (-not ($citeLog -match 'QA DANGLING'))

# Apply honours it: the cited file is still in the pool afterwards.
$citeApply = (& powershell -NoProfile -ExecutionPolicy Bypass -File $tool -Dir $pool3 -Apply -CiteFiles $citeOne) -join "`n"
$citeApplyRc = $LASTEXITCODE
Check 'cited apply exits 0' ($citeApplyRc -eq 0)
Check 'cited apply moved exactly five' ($citeApply -match 'QA APPLY: moved=5\b')
Check 'the cited file survived apply in the pool' (
    Test-Path -LiteralPath (Join-Path $pool3 'city3d-shots-20261001-1000-bm-a-street.jpg'))
Check 'the uncited view of the same session is in the archive' (
    Test-Path -LiteralPath (Join-Path $pool3 ('_archive' + [System.IO.Path]::DirectorySeparatorChar +
        'city3d-shots-20261001-1000-bm-a-overview.jpg')))

# Dangling: a cited name that is already archived must be named, not silent.
$citeDang = Join-Path $sandbox 'cite-dangling.md'
[System.IO.File]::WriteAllText($citeDang, "Old receipt: qa/city3d-shots-20261001-1000-bm-a-overview.jpg`r`n")
$dangLog = (& powershell -NoProfile -ExecutionPolicy Bypass -File $tool -Dir $pool3 -List -CiteFiles $citeDang) -join "`n"
Check 'dangling line appears when a cited name lives in the archive' ($dangLog -match 'QA DANGLING: 1 cited name')
Check 'the dangling name is named' ($dangLog -match 'DANGLING city3d-shots-20261001-1000-bm-a-overview\.jpg')

# Fail-closed: no citation index means no plan at all.
$noCiteLog = (& powershell -NoProfile -ExecutionPolicy Bypass -File $tool -Dir $pool3 -CiteRoot (Join-Path $sandbox 'no-such-root')) -join "`n"
$noCiteRc = $LASTEXITCODE
Check 'an unbuildable citation index exits 2' ($noCiteRc -eq 2)
Check 'the refusal names the reason' ($noCiteLog -match 'QA CITE FAIL')
Check 'the refusal moved nothing (19 still in the pool)' (
    @(Get-ChildItem -LiteralPath $pool3 -File | Where-Object { $_.Extension -match '^\.(png|jpg|jpeg)$' }).Count -eq 19)

# Json mirrors the citation fields.
$json3 = (& powershell -NoProfile -ExecutionPolicy Bypass -File $tool -Dir $pool3 -Json -CiteFiles $citeOne) -join "`n"
$j3 = $null
try { $j3 = $json3 | ConvertFrom-Json } catch { $j3 = $null }
Check 'json carries cited and cited_kept' ($null -ne $j3 -and [int]$j3.cited -eq 1 -and [int]$j3.cited_kept -eq 1)
Check 'json carries the archive citation readout' ($null -ne $j3 -and [int]$j3.archive_cited -ge 0)

# ---------------------------------------------------------------------------
# Restore group (r778, main#114): a dangling citation is now repairable. The
# plan is exactly the cited names sitting in _archive; nothing else comes back,
# nothing is overwritten, and one ledger line per restored file makes a second
# reversal a copy rather than a guess. Everything below re-reads the file system.
# ---------------------------------------------------------------------------
Check 'a dangling citation is still dangling without -Restore' (
    Test-Path -LiteralPath (Join-Path $pool3 ('_archive' + [System.IO.Path]::DirectorySeparatorChar +
        'city3d-shots-20261001-1000-bm-a-overview.jpg')))

$restLog = (& powershell -NoProfile -ExecutionPolicy Bypass -File $tool -Dir $pool3 -Restore -CiteFiles $citeDang) -join "`n"
$restRc = $LASTEXITCODE
Check 'restore exits 0' ($restRc -eq 0)
Check 'restore states its plan first' ($restLog -match 'QA RESTORE PLAN: n=1\b')
Check 'restore reports the one file and its bytes' ($restLog -match 'QA RESTORE: restored=1 bytes=100B')
Check 'the cited file is back in the pool' (
    Test-Path -LiteralPath (Join-Path $pool3 'city3d-shots-20261001-1000-bm-a-overview.jpg'))
Check 'the cited file left the archive' (
    -not (Test-Path -LiteralPath (Join-Path $pool3 ('_archive' + [System.IO.Path]::DirectorySeparatorChar +
        'city3d-shots-20261001-1000-bm-a-overview.jpg'))))
Check 'the pool count is re-read, not computed (20 images now)' ($restLog -match 'QA POOL: images=20\b')
Check 'no citation dangles after the repair' ($restLog -match 'QA DANGLING: 0 cited name')
# The four uncited views of the same session must NOT come back: a citation is a
# per-file criterion, not a reason to undo the whole session.
Check 'uncited archived views stay archived' (
    (Test-Path -LiteralPath (Join-Path $pool3 ('_archive' + [System.IO.Path]::DirectorySeparatorChar +
        'city3d-shots-20261001-1000-bm-a-gamedistrict.jpg'))) -and
    -not (Test-Path -LiteralPath (Join-Path $pool3 'city3d-shots-20261001-1000-bm-a-gamedistrict.jpg')))

$restLedger = Join-Path (Join-Path $pool3 '_archive') 'RESTORED.tsv'
$restRows = @()
if (Test-Path -LiteralPath $restLedger) {
    $restRows = @(Get-Content -LiteralPath $restLedger -Encoding UTF8 | Where-Object { $_ -and -not $_.StartsWith('#') })
}
Check 'the restore ledger has one row' ($restRows.Count -eq 1)
Check 'the restore row records name and size' (
    [bool](@($restRows) -match 'city3d-shots-20261001-1000-bm-a-overview\.jpg\t100\t'))

# Second restore is a no-op: nothing dangles any more, so nothing moves.
$rest2 = (& powershell -NoProfile -ExecutionPolicy Bypass -File $tool -Dir $pool3 -Restore -CiteFiles $citeDang) -join "`n"
$rest2Rc = $LASTEXITCODE
Check 're-restore exits 0' ($rest2Rc -eq 0)
Check 're-restore moves zero' ($rest2 -match 'QA RESTORE: restored=0\b')
Check 're-restore adds no ledger row' (
    @(Get-Content -LiteralPath $restLedger -Encoding UTF8 | Where-Object { $_ -and -not $_.StartsWith('#') }).Count -eq 1)

# Fail-closed: the same name present in pool AND archive means pool and archive
# disagree - restore must move nothing and never overwrite the pool copy.
$pool4 = Join-Path $sandbox 'qa4'
New-Item -ItemType Directory -Path $pool4 -Force | Out-Null
$arch4 = Join-Path $pool4 '_archive'
New-Item -ItemType Directory -Path $arch4 -Force | Out-Null
New-Fix2 (Join-Path $pool4 'city-panel-r700-bm-a.png') 300
New-Fix2 (Join-Path $arch4 'city-panel-r700-bm-a.png') 100
$citeConflict = Join-Path $sandbox 'cite-conflict.md'
[System.IO.File]::WriteAllText($citeConflict, "Evidence: qa/city-panel-r700-bm-a.png`r`n")
$cfLog = (& powershell -NoProfile -ExecutionPolicy Bypass -File $tool -Dir $pool4 -Restore -CiteFiles $citeConflict) -join "`n"
$cfRc = $LASTEXITCODE
Check 'an occupied destination exits 2' ($cfRc -eq 2)
Check 'the refusal names the occupied file' ($cfLog -match 'QA RESTORE FAIL: 1 planned name\(s\) already exist in')
Check 'the refusal names the file itself' ($cfLog -match 'OCCUPIED city-panel-r700-bm-a\.png')
Check 'nothing moved (archive copy still 100 bytes)' (
    (Get-Item -LiteralPath (Join-Path $arch4 'city-panel-r700-bm-a.png')).Length -eq 100)
Check 'nothing overwritten (pool copy still 300 bytes)' (
    (Get-Item -LiteralPath (Join-Path $pool4 'city-panel-r700-bm-a.png')).Length -eq 300)

# One direction per run.
$swLog = (& powershell -NoProfile -ExecutionPolicy Bypass -File $tool -Dir $pool4 -Apply -Restore -CiteFiles $citeConflict) -join "`n"
$swRc = $LASTEXITCODE
Check 'apply+restore in one run exits 2' ($swRc -eq 2)
Check 'the contradiction is named' ($swLog -match 'QA SWITCH FAIL')
$swJson = (& powershell -NoProfile -ExecutionPolicy Bypass -File $tool -Dir $pool4 -Restore -Json -CiteFiles $citeConflict) -join "`n"
Check 'restore+json in one run is refused too' ($LASTEXITCODE -eq 2 -and $swJson -match 'QA SWITCH FAIL')

Remove-Item -LiteralPath $sandbox -Recurse -Force -ErrorAction SilentlyContinue
Write-Output ('test-qa-rotation: ' + $pass + ' passed, ' + $fail + ' failed (of ' + ($pass + $fail) + ')')
if ($fail -gt 0) { exit 1 }
exit 0