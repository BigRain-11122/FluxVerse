# rebuild-panel-fixtures.ps1 - regenerate the frozen panel fixtures (queue main#40)
# ---------------------------------------------------------------------------
# WHY (r736, measured): logs\panel-fixture-prev.html and -regress.html were built
# on 2026-10-20. Their inline <script> is that day's template, so
# logs\devloop-r671-panel-history-test.js was asserting SHAPE against 8-day-old
# code while pretending to test today's history card. Two ways out: keep the
# fixtures frozen (test decays) or rebuild them from the CURRENT template over
# the SAME fixture data. This script is the second way, made repeatable.
#
# FIXTURE CONTRACT (keep in sync with logs\devloop-r671-panel-history-test.js):
#   frozen snapshot : logs\panel-fixture-snap.json (copy of a real snapshot)
#   prev    history : [prev(ts-5min, c-65, r-1, g-1, f, e), current(ts, c, r, g, f, e)]
#                     => deltas +N / +1 / flat fleet, note "2 records", gap 5 min
#   regress history : [prev(ts-5min, c=99999, r-1, g, f, e), current(ts, c, r, g, f, e)]
#                     => live regression row (commits 99999 -> c)
# The LAST history record always carries the snapshot's own ts, so the builder
# does not append a third record. The rebuilt pages are NOT byte-identical across
# runs (the builder stamps its own build time and tick age), so the idempotence
# gate here is on the DATA: the history logs must still hold exactly two records
# with the snapshot ts last (checked after the builds below).
#
# USAGE
#   powershell -File Tools\devloop\rebuild-panel-fixtures.ps1 [-Refresh]
#   -Refresh re-freezes logs\panel-fixture-snap.json from world-public\city-snapshot.json
#   (default: reuse the existing frozen copy so the fixtures stay reproducible)
#
# ASCII-only law: no CJK in this file (PS5.1 GBK trap).
param([switch]$Refresh)

$ErrorActionPreference = 'Stop'
$here = $PSScriptRoot
$repoDir = Split-Path -Parent (Split-Path -Parent $here)
$logs = Join-Path $repoDir 'logs'
$builder = Join-Path $here 'build-city-panel.ps1'
$template = Join-Path $here 'city-panel-template.html'
$liveSnap = Join-Path $repoDir 'world-public\city-snapshot.json'
$frozen = Join-Path $logs 'panel-fixture-snap.json'
$inv = [Globalization.CultureInfo]::InvariantCulture

if (-not (Test-Path -LiteralPath $builder)) { Write-Output 'FIXTURE FAIL: builder missing'; exit 1 }
if (-not (Test-Path -LiteralPath $template)) { Write-Output 'FIXTURE FAIL: template missing'; exit 1 }
if (-not (Test-Path -LiteralPath $logs)) { New-Item -ItemType Directory -Path $logs -Force | Out-Null }

if ($Refresh -or -not (Test-Path -LiteralPath $frozen)) {
    if (-not (Test-Path -LiteralPath $liveSnap)) { Write-Output 'FIXTURE FAIL: live snapshot missing'; exit 1 }
    Copy-Item -LiteralPath $liveSnap -Destination $frozen -Force
    Write-Output ('FROZEN refresh <- ' + $liveSnap)
} else {
    Write-Output ('FROZEN reuse ' + $frozen)
}

$snap = [IO.File]::ReadAllText($frozen, [Text.Encoding]::UTF8) | ConvertFrom-Json
$ts = [string]$snap.ts_utc
if ([string]::IsNullOrWhiteSpace($ts)) { Write-Output 'FIXTURE FAIL: snapshot ts_utc empty'; exit 1 }
$dto = [DateTimeOffset]::Parse($ts, $inv)
$prevTs = $dto.ToUniversalTime().AddMinutes(-5).ToString("yyyy-MM-dd'T'HH:mm:ss'Z'", $inv)
$c = [int]$snap.city.commits_total
$r = [int]$snap.city.renders_total
$g = [int]$snap.city.games_active
$f = [int]$snap.city.fleet_online
$e = [int](@($snap.events_tail).Count)
if ($c -le 0) { Write-Output 'FIXTURE FAIL: snapshot commits_total <= 0 (partial export)'; exit 1 }

function New-HistRec {
    param([string]$Sv, [int]$C, [int]$R, [int]$G, [int]$F, [int]$E)
    return ('{"ts":"' + $Sv + '","c":' + $C + ',"r":' + $R + ',"g":' + $G + ',"f":' + $F + ',"e":' + $E + '}')
}

$utf8 = New-Object System.Text.UTF8Encoding($false)
$prevHist = Join-Path $logs 'panel-fixture-prev-hist.jsonl'
$regHist = Join-Path $logs 'panel-fixture-regress-hist.jsonl'
$rLow = [Math]::Max(0, $r - 1)
$gLow = [Math]::Max(0, $g - 1)

$prevBody = (New-HistRec -Sv $prevTs -C ($c - 65) -R $rLow -G $gLow -F $f -E $e) + "`n" +
            (New-HistRec -Sv $ts -C $c -R $r -G $g -F $f -E $e) + "`n"
$regBody  = (New-HistRec -Sv $prevTs -C 99999 -R $rLow -G $g -F $f -E $e) + "`n" +
            (New-HistRec -Sv $ts -C $c -R $r -G $g -F $f -E $e) + "`n"
[IO.File]::WriteAllText($prevHist, $prevBody, $utf8)
[IO.File]::WriteAllText($regHist, $regBody, $utf8)
Write-Output ('HIST prev=' + $prevHist + ' | regress=' + $regHist)
Write-Output ('DATA ts=' + $ts + ' c=' + $c + ' r=' + $r + ' g=' + $g + ' f=' + $f + ' e=' + $e + ' prev_ts=' + $prevTs)

$targets = @(
    @{ Tag = 'prev';    Hist = $prevHist; Out = (Join-Path $logs 'panel-fixture-prev.html') },
    @{ Tag = 'regress'; Hist = $regHist;  Out = (Join-Path $logs 'panel-fixture-regress.html') }
)

foreach ($t in $targets) {
    $log = (& $builder -SnapPath $frozen -HistoryPath $t.Hist -OutPath $t.Out) -join "`n"
    if ($log -notmatch 'PANEL OK') {
        Write-Output ('BUILD ' + $t.Tag + ' FAIL')
        Write-Output $log
        exit 1
    }
    Write-Output ('BUILD ' + $t.Tag + ' OK')
}

# Gate: the inline script must be the current template, not a stale build.
# checks = number of selfcheck.push() calls (same metric the r671 test uses);
# leftover placeholders = builder failed to substitute.
$tplText = [IO.File]::ReadAllText($template, [Text.Encoding]::UTF8)
$tplChecks = ([regex]::Matches($tplText, 'selfcheck\.push\(')).Count
$bad = 0
foreach ($t in $targets) {
    $html = [IO.File]::ReadAllText($t.Out, [Text.Encoding]::UTF8)
    $m = [regex]::Match($html, '<script>([\s\S]*?)</script>')
    if (-not $m.Success) { Write-Output ('VERIFY ' + $t.Tag + ' FAIL: no inline script'); $bad++; continue }
    $inline = $m.Groups[1].Value
    $got = ([regex]::Matches($inline, 'selfcheck\.push\(')).Count
    $leftover = ([regex]::Matches($inline, '__[A-Z]+_JSON__')).Count
    $okFlag = ($got -eq $tplChecks) -and ($leftover -eq 0)
    Write-Output ('VERIFY ' + $t.Tag + ' checks=' + $got + '/' + $tplChecks + ' leftover=' + $leftover + ' bytes=' + $html.Length + ' ' + $(if ($okFlag) { 'OK' } else { 'FAIL' }))
    if (-not $okFlag) { $bad++ }
}

# Gate: the builder must not have appended a third record (that would break the
# "2 records" contract the r671 test asserts and make rebuilds non-reproducible).
foreach ($t in $targets) {
    $lines = @([IO.File]::ReadAllLines($t.Hist, [Text.Encoding]::UTF8) | Where-Object { $_.Trim() -ne '' })
    $lastTs = ''
    if ($lines.Count -gt 0) {
        try { $lastTs = [string](ConvertFrom-Json $lines[$lines.Count - 1]).ts } catch { $lastTs = '' }
    }
    $histOk = ($lines.Count -eq 2) -and ($lastTs -eq $ts)
    Write-Output ('VERIFY ' + $t.Tag + '.hist rows=' + $lines.Count + ' last_ts=' + $lastTs + ' ' + $(if ($histOk) { 'OK' } else { 'FAIL' }))
    if (-not $histOk) { $bad++ }
}

if ($bad -gt 0) { Write-Output 'FIXTURES FAIL'; exit 1 }
Write-Output 'FIXTURES OK'