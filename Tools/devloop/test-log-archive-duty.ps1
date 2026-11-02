# test-log-archive-duty.ps1 - sandbox proof for the daily log archive duty (main#56)
# ---------------------------------------------------------------------------
# r715 cleared 2,174 stale log files by hand; nothing re-ran the sweep, so the
# backlog was certain to come back. r719 wires Tools\devloop\archive-logs.ps1
# into Tools\perceptor\verify.ps1 as section 2e through log-archive-duty.ps1,
# gated to at most one real run per calendar day.
#
# This sandbox runs the REAL verify.ps1 against four fixtures and asserts:
#   a) no candidates      -> HEALTH line, candidates=0, nothing archived
#   b) old files present  -> HEALTH line, archived=3, REMAIN_ARCHIVABLE=0,
#                            zip written, sources deleted
#   c) already ran today  -> skipped(already-ran-today); with a 1-file budget the
#                            backlog turns into WARN "not keeping up"
#   d) zip mismatch       -> WARN "did not finish (MISMATCH)", originals kept
#   f) foreign cwd        -> same as (b) from a cwd outside the repo; the tick
#                            starts outside the repo, and until r786 a plain
#                            'git rev-parse' there made the archiver throw on
#                            every tick-time run while a human run from the repo
#                            root stayed green (main#120's 8 red assertions).
# plus: archive lines never carry the FAIL token (the tick red-scan keys on it)
# and the verified verify still exits 0 in every case. When a case fails the
# sandbox prints that run's own archive lines, so the next red arrives with the
# evidence that explains it.
# ASCII-only law: no CJK in this file.

$ErrorActionPreference = 'Stop'
$verify = Join-Path (Split-Path -Parent $PSScriptRoot) 'perceptor\verify.ps1'
if (-not (Test-Path -LiteralPath $verify)) { Write-Output ('setup FAIL: missing ' + $verify); exit 1 }

$sandbox = Join-Path ([System.IO.Path]::GetTempPath()) ('fv-log-archive-' + $PID)
if (Test-Path -LiteralPath $sandbox) { Remove-Item -LiteralPath $sandbox -Recurse -Force }
New-Item -ItemType Directory -Force -Path $sandbox | Out-Null

$pass = 0
$fail = 0
function Check([string]$name, [bool]$cond) {
    if ($cond) { Write-Output ('  PASS ' + $name); $script:pass++ }
    else { Write-Output ('  FAIL ' + $name); $script:fail++ }
}

function New-Case([string]$name) {
    $dir = Join-Path $sandbox $name
    New-Item -ItemType Directory -Force -Path $dir | Out-Null
    return $dir
}

function Add-LogFile([string]$dir, [string]$name, [int]$ageDays, [string]$text = 'x') {
    $p = Join-Path $dir $name
    Set-Content -LiteralPath $p -Value $text -Encoding ASCII
    (Get-Item -LiteralPath $p).LastWriteTime = (Get-Date).AddDays(-$ageDays)
    return $p
}

function Invoke-VerifyWithArchive {
    param(
        [string]$LogsDir,
        [Parameter(Mandatory = $true)][string]$StateFile,
        [int]$MaxRemain = 0,
        [switch]$Force,
        [switch]$SimulateMismatch,
        [string]$WorkingDirectory = ''
    )
    # The sandbox log dir has to exist for the run to mean anything; the state
    # file is created by the run itself, so only its argument is required
    # (queue main#128).
    if (-not (Test-Path -LiteralPath $LogsDir)) {
        return @{ log = 'sandbox logs dir missing: ' + $LogsDir; code = 9 }
    }
    $env:FLUXVERSE_ARCHIVE_DIR = $LogsDir
    $env:FLUXVERSE_ARCHIVE_STATE = $StateFile
    if ($MaxRemain -gt 0) { $env:FLUXVERSE_ARCHIVE_MAX_REMAIN = [string]$MaxRemain } else { Remove-Item Env:\FLUXVERSE_ARCHIVE_MAX_REMAIN -ErrorAction SilentlyContinue }
    if ($Force) { $env:FLUXVERSE_ARCHIVE_FORCE = '1' } else { Remove-Item Env:\FLUXVERSE_ARCHIVE_FORCE -ErrorAction SilentlyContinue }
    if ($SimulateMismatch) { $env:FLUXVERSE_ARCHIVE_SIMULATE_MISMATCH = '1' } else { Remove-Item Env:\FLUXVERSE_ARCHIVE_SIMULATE_MISMATCH -ErrorAction SilentlyContinue }
    try {
        if ($WorkingDirectory) { Push-Location -LiteralPath $WorkingDirectory }
        try {
            $log = (& powershell -NoProfile -ExecutionPolicy Bypass -File $verify) -join "`n"
            $code = $LASTEXITCODE
        } finally {
            if ($WorkingDirectory) { Pop-Location }
        }
    } finally {
        Remove-Item Env:\FLUXVERSE_ARCHIVE_DIR -ErrorAction SilentlyContinue
        Remove-Item Env:\FLUXVERSE_ARCHIVE_STATE -ErrorAction SilentlyContinue
        Remove-Item Env:\FLUXVERSE_ARCHIVE_MAX_REMAIN -ErrorAction SilentlyContinue
        Remove-Item Env:\FLUXVERSE_ARCHIVE_FORCE -ErrorAction SilentlyContinue
        Remove-Item Env:\FLUXVERSE_ARCHIVE_SIMULATE_MISMATCH -ErrorAction SilentlyContinue
    }
    return @{ log = $log; code = $code }
}

# A failing case must explain itself: the runner keeps the whole output since
# r784, but a bare 'FAIL a: health line emitted' still leaves the reader to
# guess whether the duty threw, skipped or printed something unexpected.
function Show-ArchiveEvidence([string]$name, [string]$log) {
    Write-Output ('  -- evidence ' + $name + ': archive lines from that verify run --')
    $lines = @(($log -split "`n") | Where-Object { $_ -match 'log-archive|ARCHIVE|VERIFY FAIL' })
    if ($lines.Count -eq 0) { Write-Output '     (none - the section printed nothing at all)' }
    foreach ($l in $lines) { Write-Output ('     ' + $l) }
}

# ---------- a) nothing to archive ----------
$aDir = New-Case 'a'
$null = Add-LogFile $aDir 'fresh.log' 0 'fresh'
$a = Invoke-VerifyWithArchive -LogsDir $aDir -StateFile (Join-Path $aDir 'stamp.txt')
Write-Output '--- a) no candidates ---'
$failA = $fail
Check 'a: verify exits 0'            ($a.code -eq 0)
Check 'a: health line emitted'       ($a.log -match 'VERIFY HEALTH: log-archive: ran candidates=0 archived=0 remain_archivable=0')
Check 'a: fresh file untouched'      ((Test-Path -LiteralPath (Join-Path $aDir 'fresh.log')))
Check 'a: stamp written'             ((Test-Path -LiteralPath (Join-Path $aDir 'stamp.txt')))
if ($fail -gt $failA) { Show-ArchiveEvidence 'a' $a.log }

# ---------- b) old files get archived ----------
$bDir = New-Case 'b'
for ($i = 1; $i -le 3; $i++) { $null = Add-LogFile $bDir ('old' + $i + '.log') 30 ('payload-' + $i) }
$b = Invoke-VerifyWithArchive -LogsDir $bDir -StateFile (Join-Path $bDir 'stamp.txt')
Write-Output '--- b) old files ---'
$failB = $fail
Check 'b: verify exits 0'            ($b.code -eq 0)
Check 'b: health line emitted'       ($b.log -match 'VERIFY HEALTH: log-archive: ran candidates=3 archived=3 remain_archivable=0')
$bZips = @(Get-ChildItem -LiteralPath (Join-Path $bDir '_archive') -Filter '*.zip' -ErrorAction SilentlyContinue)
Check 'b: one zip written'           ($bZips.Count -eq 1)
Check 'b: sources deleted'           (-not (Test-Path -LiteralPath (Join-Path $bDir 'old1.log')) -and -not (Test-Path -LiteralPath (Join-Path $bDir 'old3.log')))
$bManifest = @(Get-ChildItem -LiteralPath (Join-Path $bDir '_archive') -Filter 'manifest-*.json' -ErrorAction SilentlyContinue)
Check 'b: manifest written'          ($bManifest.Count -eq 1)
if ($fail -gt $failB) { Show-ArchiveEvidence 'b' $b.log }

# ---------- c) already ran today -> skip, backlog over budget -> WARN ----------
$cDir = New-Case 'c'
for ($i = 1; $i -le 2; $i++) { $null = Add-LogFile $cDir ('stale' + $i + '.log') 30 ('payload-' + $i) }
$cStamp = Join-Path $cDir 'stamp.txt'
Set-Content -LiteralPath $cStamp -Value ((Get-Date).ToString('yyyyMMdd') + ' remain=2') -Encoding ASCII
$c = Invoke-VerifyWithArchive -LogsDir $cDir -StateFile $cStamp -MaxRemain 1
Write-Output '--- c) skipped + backlog warn ---'
$failC = $fail
Check 'c: verify exits 0'            ($c.code -eq 0)
Check 'c: skip is reported'          ($c.log -match 'log-archive: skipped\(already-ran-today\)')
Check 'c: backlog carried over'      ($c.log -match 'remain_archivable=2\(last\)')
Check 'c: warn about keeping up'     ($c.log -match 'VERIFY WARN: log-archive: .* not keeping up')
Check 'c: nothing archived'          (-not (Test-Path -LiteralPath (Join-Path $cDir '_archive')))
# A skip day never scans, so it must not publish a live count at all: "live=0"
# would read as "the directory is empty" when nobody counted (r799 judgement).
Check 'c: skip day states no live count' ($c.log -notmatch 'live=\d+/cap=')
if ($fail -gt $failC) { Show-ArchiveEvidence 'c' $c.log }

# ---------- d) zip verify mismatch -> originals kept ----------
$dDir = New-Case 'd'
$null = Add-LogFile $dDir 'keep1.log' 30 'payload-a'
$null = Add-LogFile $dDir 'keep2.log' 30 'payload-b'
$d = Invoke-VerifyWithArchive -LogsDir $dDir -StateFile (Join-Path $dDir 'stamp.txt') -SimulateMismatch
Write-Output '--- d) mismatch keeps originals ---'
$failD = $fail
Check 'd: verify exits 0'            ($d.code -eq 0)
Check 'd: mismatch warn'             ($d.log -match 'VERIFY WARN: log-archive: .* did not finish \(MISMATCH\)')
Check 'd: originals kept'            ((Test-Path -LiteralPath (Join-Path $dDir 'keep1.log')) -and (Test-Path -LiteralPath (Join-Path $dDir 'keep2.log')))
Check 'd: no stamp after failure'    (-not (Test-Path -LiteralPath (Join-Path $dDir 'stamp.txt')))
$dRetry = Invoke-VerifyWithArchive -LogsDir $dDir -StateFile (Join-Path $dDir 'stamp.txt') -Force
$dRetryArchiveLines = @(($dRetry.log -split "`n") | Where-Object { $_ -match 'log-archive' })
Check 'd: retried on force'          (@($dRetryArchiveLines | Where-Object { $_ -match 'skipped' }).Count -eq 0 -and @($dRetryArchiveLines | Where-Object { $_ -match 'archived=2' }).Count -eq 1)
if ($fail -gt $failD) { Show-ArchiveEvidence 'd' ($d.log + "`n" + $dRetry.log) }

# ---------- f) the tick starts outside the repo ----------
# r786: the scheduler runs the tick from a cwd that is not the repo, and the
# archiver used to ask git about *that* directory. A human run from the repo
# root stayed green, so the sandbox was green in review and red on every tick.
$fDir = New-Case 'f'
$null = Add-LogFile $fDir 'old9.log' 30 'payload-9'
$foreignCwd = $env:SystemRoot
if (-not $foreignCwd) { $foreignCwd = $sandbox } else { $null = (Get-Item -LiteralPath $foreignCwd -ErrorAction SilentlyContinue) }
$f = Invoke-VerifyWithArchive -LogsDir $fDir -StateFile (Join-Path $fDir 'stamp.txt') -WorkingDirectory $foreignCwd
Write-Output '--- f) verify run from a cwd outside the repo ---'
$failF = $fail
Check 'f: verify exits 0'            ($f.code -eq 0)
Check 'f: health line emitted'       ($f.log -match 'VERIFY HEALTH: log-archive: ran candidates=1 archived=1 remain_archivable=0')
Check 'f: source archived'           (-not (Test-Path -LiteralPath (Join-Path $fDir 'old9.log')))
if ($fail -gt $failF) { Show-ArchiveEvidence 'f' $f.log }

# ---------- g) directory size cap (D-20261101-05 item 3) ----------
# Age alone can never bound the directory: 14 days of ten-minute tick logs is
# ~2,000 files. The cap must archive the oldest eligible files even when they
# are inside the retention window, and it must never touch today's files or
# protected extensions.
$gDir = New-Case 'g'
for ($i = 1; $i -le 5; $i++) { $null = Add-LogFile $gDir ('queue' + $i + '.log') $i ('payload-' + $i) }
$null = Add-LogFile $gDir 'today.log' 0 'today-payload'
$gProt = Join-Path $gDir 'keeper.ps1'
Set-Content -LiteralPath $gProt -Value '# keep me' -Encoding ASCII
$gArchiver = Join-Path (Split-Path -Parent $PSScriptRoot) 'devloop\archive-logs.ps1'
$gLog = (& powershell -NoProfile -ExecutionPolicy Bypass -File $gArchiver -LogsDir $gDir -MaxFiles 2) -join "`n"
$gCode = $LASTEXITCODE
Write-Output '--- g) file-count cap ---'
$failG = $fail
Check 'g: archiver exits 0'          ($gCode -eq 0)
Check 'g: cap line names the overflow' ($gLog -match 'ARCHIVE CAP: live=7 max=2 over=5 age=0 cap_extra=5')
Check 'g: live lands under the cap'  ($gLog -match 'ARCHIVE LIVE_AFTER: 2')
Check 'g: oversize files archived'   (@(Get-ChildItem -LiteralPath $gDir -Filter 'queue*.log' -ErrorAction SilentlyContinue).Count -eq 0)
Check 'g: today file untouched'      (Test-Path -LiteralPath (Join-Path $gDir 'today.log'))
Check 'g: protected ext untouched'   (Test-Path -LiteralPath $gProt)
$gZips = @(Get-ChildItem -LiteralPath (Join-Path $gDir '_archive') -Filter '*.zip' -ErrorAction SilentlyContinue)
Check 'g: weekly zip names'          ($gZips.Count -ge 1 -and @($gZips | Where-Object { $_.Name -match 'logs-\d{4}-W\d{2}-part\d{2}-' }).Count -eq $gZips.Count)
$gEntryCount = 0
if ($gZips.Count -gt 0) {
    Add-Type -AssemblyName System.IO.Compression.FileSystem | Out-Null
    foreach ($gz in $gZips) {
        $gZip = [System.IO.Compression.ZipFile]::OpenRead($gz.FullName)
        try { $gEntryCount += @($gZip.Entries).Count } finally { $gZip.Dispose() }
    }
}
Check 'g: all five bytes kept'       ($gEntryCount -eq 5)
if ($fail -gt $failG) { Write-Output ('  -- evidence g: ' + ($gLog -replace "`n", ' | ')) }

# ---------- e) token hygiene ----------
Write-Output '--- e) red-scan hygiene ---'
$all = ($a.log + "`n" + $b.log + "`n" + $c.log + "`n" + $d.log + "`n" + $f.log + "`n" + $gLog) -split "`n"
$archiveLines = @($all | Where-Object { $_ -match 'log-archive' })
Check 'e: archive lines present'     ($archiveLines.Count -ge 4)
Check 'e: archive lines never FAIL'  (@($archiveLines | Where-Object { $_ -match 'FAIL' }).Count -eq 0)
Check 'e: verify never FAIL'         (@($all | Where-Object { $_ -match 'VERIFY FAIL' }).Count -eq 0)

Remove-Item -LiteralPath $sandbox -Recurse -Force -ErrorAction SilentlyContinue
Write-Output ('test-log-archive-duty: ' + $pass + ' passed, ' + $fail + ' failed (of ' + ($pass + $fail) + ')')
if ($fail -gt 0) { exit 1 }
exit 0