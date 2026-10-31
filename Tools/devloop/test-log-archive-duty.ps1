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
# plus: archive lines never carry the FAIL token (the tick red-scan keys on it)
# and the verified verify still exits 0 in every case.
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
        [string]$StateFile,
        [int]$MaxRemain = 0,
        [switch]$Force,
        [switch]$SimulateMismatch
    )
    $env:FLUXVERSE_ARCHIVE_DIR = $LogsDir
    $env:FLUXVERSE_ARCHIVE_STATE = $StateFile
    if ($MaxRemain -gt 0) { $env:FLUXVERSE_ARCHIVE_MAX_REMAIN = [string]$MaxRemain } else { Remove-Item Env:\FLUXVERSE_ARCHIVE_MAX_REMAIN -ErrorAction SilentlyContinue }
    if ($Force) { $env:FLUXVERSE_ARCHIVE_FORCE = '1' } else { Remove-Item Env:\FLUXVERSE_ARCHIVE_FORCE -ErrorAction SilentlyContinue }
    if ($SimulateMismatch) { $env:FLUXVERSE_ARCHIVE_SIMULATE_MISMATCH = '1' } else { Remove-Item Env:\FLUXVERSE_ARCHIVE_SIMULATE_MISMATCH -ErrorAction SilentlyContinue }
    try {
        $log = (& powershell -NoProfile -ExecutionPolicy Bypass -File $verify) -join "`n"
        $code = $LASTEXITCODE
    } finally {
        Remove-Item Env:\FLUXVERSE_ARCHIVE_DIR -ErrorAction SilentlyContinue
        Remove-Item Env:\FLUXVERSE_ARCHIVE_STATE -ErrorAction SilentlyContinue
        Remove-Item Env:\FLUXVERSE_ARCHIVE_MAX_REMAIN -ErrorAction SilentlyContinue
        Remove-Item Env:\FLUXVERSE_ARCHIVE_FORCE -ErrorAction SilentlyContinue
        Remove-Item Env:\FLUXVERSE_ARCHIVE_SIMULATE_MISMATCH -ErrorAction SilentlyContinue
    }
    return @{ log = $log; code = $code }
}

# ---------- a) nothing to archive ----------
$aDir = New-Case 'a'
$null = Add-LogFile $aDir 'fresh.log' 0 'fresh'
$a = Invoke-VerifyWithArchive -LogsDir $aDir -StateFile (Join-Path $aDir 'stamp.txt')
Write-Output '--- a) no candidates ---'
Check 'a: verify exits 0'            ($a.code -eq 0)
Check 'a: health line emitted'       ($a.log -match 'VERIFY HEALTH: log-archive: ran candidates=0 archived=0 remain_archivable=0')
Check 'a: fresh file untouched'      ((Test-Path -LiteralPath (Join-Path $aDir 'fresh.log')))
Check 'a: stamp written'             ((Test-Path -LiteralPath (Join-Path $aDir 'stamp.txt')))

# ---------- b) old files get archived ----------
$bDir = New-Case 'b'
for ($i = 1; $i -le 3; $i++) { $null = Add-LogFile $bDir ('old' + $i + '.log') 30 ('payload-' + $i) }
$b = Invoke-VerifyWithArchive -LogsDir $bDir -StateFile (Join-Path $bDir 'stamp.txt')
Write-Output '--- b) old files ---'
Check 'b: verify exits 0'            ($b.code -eq 0)
Check 'b: health line emitted'       ($b.log -match 'VERIFY HEALTH: log-archive: ran candidates=3 archived=3 remain_archivable=0')
$bZips = @(Get-ChildItem -LiteralPath (Join-Path $bDir '_archive') -Filter '*.zip' -ErrorAction SilentlyContinue)
Check 'b: one zip written'           ($bZips.Count -eq 1)
Check 'b: sources deleted'           (-not (Test-Path -LiteralPath (Join-Path $bDir 'old1.log')) -and -not (Test-Path -LiteralPath (Join-Path $bDir 'old3.log')))
$bManifest = @(Get-ChildItem -LiteralPath (Join-Path $bDir '_archive') -Filter 'manifest-*.json' -ErrorAction SilentlyContinue)
Check 'b: manifest written'          ($bManifest.Count -eq 1)

# ---------- c) already ran today -> skip, backlog over budget -> WARN ----------
$cDir = New-Case 'c'
for ($i = 1; $i -le 2; $i++) { $null = Add-LogFile $cDir ('stale' + $i + '.log') 30 ('payload-' + $i) }
$cStamp = Join-Path $cDir 'stamp.txt'
Set-Content -LiteralPath $cStamp -Value ((Get-Date).ToString('yyyyMMdd') + ' remain=2') -Encoding ASCII
$c = Invoke-VerifyWithArchive -LogsDir $cDir -StateFile $cStamp -MaxRemain 1
Write-Output '--- c) skipped + backlog warn ---'
Check 'c: verify exits 0'            ($c.code -eq 0)
Check 'c: skip is reported'          ($c.log -match 'log-archive: skipped\(already-ran-today\)')
Check 'c: backlog carried over'      ($c.log -match 'remain_archivable=2\(last\)')
Check 'c: warn about keeping up'     ($c.log -match 'VERIFY WARN: log-archive: .* not keeping up')
Check 'c: nothing archived'          (-not (Test-Path -LiteralPath (Join-Path $cDir '_archive')))

# ---------- d) zip verify mismatch -> originals kept ----------
$dDir = New-Case 'd'
$null = Add-LogFile $dDir 'keep1.log' 30 'payload-a'
$null = Add-LogFile $dDir 'keep2.log' 30 'payload-b'
$d = Invoke-VerifyWithArchive -LogsDir $dDir -StateFile (Join-Path $dDir 'stamp.txt') -SimulateMismatch
Write-Output '--- d) mismatch keeps originals ---'
Check 'd: verify exits 0'            ($d.code -eq 0)
Check 'd: mismatch warn'             ($d.log -match 'VERIFY WARN: log-archive: .* did not finish \(MISMATCH\)')
Check 'd: originals kept'            ((Test-Path -LiteralPath (Join-Path $dDir 'keep1.log')) -and (Test-Path -LiteralPath (Join-Path $dDir 'keep2.log')))
Check 'd: no stamp after failure'    (-not (Test-Path -LiteralPath (Join-Path $dDir 'stamp.txt')))
$dRetry = Invoke-VerifyWithArchive -LogsDir $dDir -StateFile (Join-Path $dDir 'stamp.txt') -Force
$dRetryArchiveLines = @(($dRetry.log -split "`n") | Where-Object { $_ -match 'log-archive' })
Check 'd: retried on force'          (@($dRetryArchiveLines | Where-Object { $_ -match 'skipped' }).Count -eq 0 -and @($dRetryArchiveLines | Where-Object { $_ -match 'archived=2' }).Count -eq 1)

# ---------- e) token hygiene ----------
Write-Output '--- e) red-scan hygiene ---'
$all = ($a.log + "`n" + $b.log + "`n" + $c.log + "`n" + $d.log) -split "`n"
$archiveLines = @($all | Where-Object { $_ -match 'log-archive' })
Check 'e: archive lines present'     ($archiveLines.Count -ge 4)
Check 'e: archive lines never FAIL'  (@($archiveLines | Where-Object { $_ -match 'FAIL' }).Count -eq 0)
Check 'e: verify never FAIL'         (@($all | Where-Object { $_ -match 'VERIFY FAIL' }).Count -eq 0)

Remove-Item -LiteralPath $sandbox -Recurse -Force -ErrorAction SilentlyContinue
Write-Output ('test-log-archive-duty: ' + $pass + ' passed, ' + $fail + ' failed (of ' + ($pass + $fail) + ')')
if ($fail -gt 0) { exit 1 }
exit 0