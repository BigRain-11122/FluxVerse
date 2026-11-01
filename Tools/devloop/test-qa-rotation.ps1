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

$log = (& powershell -NoProfile -ExecutionPolicy Bypass -File $tool -Dir $pool) -join "`n"
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
$listLog = (& powershell -NoProfile -ExecutionPolicy Bypass -File $tool -Dir $pool -List) -join "`n"
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
$jsonLog = (& powershell -NoProfile -ExecutionPolicy Bypass -File $tool -Dir $pool -Json) -join "`n"
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
$badLog = (& powershell -NoProfile -ExecutionPolicy Bypass -File $tool -Dir $missing) -join "`n"
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

Remove-Item -LiteralPath $sandbox -Recurse -Force -ErrorAction SilentlyContinue
Write-Output ('test-qa-rotation: ' + $pass + ' passed, ' + $fail + ' failed (of ' + ($pass + $fail) + ')')
if ($fail -gt 0) { exit 1 }
exit 0