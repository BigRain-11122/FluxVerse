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
#   bad snapshot    : logs\panel-fixture-bad-snap.json (frozen copy + 3 ts faults)
#   bad build       : logs\panel-fixture-bad.html -> logs\devloop-r670-panel-selfcheck-test.js
#                     (queue main#130: without this branch the guard told the reader to
#                     run this script, and this script produced nothing for that suite,
#                     so after logs\ was pruned it could only ever exit 3)
# The LAST history record always carries the snapshot's own ts, so the builder
# does not append a third record. The rebuilt pages are NOT byte-identical across
# runs (the builder stamps its own build time and tick age), so the idempotence
# gate here is on the DATA: the history logs must still hold exactly two records
# with the snapshot ts last (checked after the builds below).
#
# USAGE
#   powershell -File Tools\devloop\rebuild-panel-fixtures.ps1 [-Refresh] [-LogsDir <dir>]
#   -Refresh re-freezes logs\panel-fixture-snap.json from world-public\city-snapshot.json
#   (default: reuse the existing frozen copy so the fixtures stay reproducible)
#   -LogsDir redirects every fixture in/out to another directory (relative to the
#   repo root, or absolute). It exists so the generator itself can be sandboxed
#   without touching the real logs\ tree; production never passes it.
#   -BadOnly builds just the bad self-check fixture (the two history fixtures
#   need a build each; the sandbox only cares about the bad one).
#
# ASCII-only law: no CJK in this file (PS5.1 GBK trap).
param([switch]$Refresh, [string]$LogsDir = '', [switch]$BadOnly)

$ErrorActionPreference = 'Stop'
$here = $PSScriptRoot
$repoDir = Split-Path -Parent (Split-Path -Parent $here)
if ([string]::IsNullOrWhiteSpace($LogsDir)) {
    $logs = Join-Path $repoDir 'logs'
} elseif ([IO.Path]::IsPathRooted($LogsDir)) {
    $logs = $LogsDir
} else {
    $logs = Join-Path $repoDir $LogsDir
}
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

# Epoch ms for an ISO stamp; $TsUnparsable is the sentinel for "cannot parse".
# The bad fixture counts exactly these three shapes, so the sentinel must be
# impossible to reach from a real stamp (long.MinValue = year 1).
$TsUnparsable = [long]::MinValue
function Get-TsMs {
    param([string]$Raw)
    $dto = [DateTimeOffset]::MinValue
    $styles = [Globalization.DateTimeStyles]::AssumeUniversal
    if ([DateTimeOffset]::TryParse($Raw, $inv, $styles, [ref]$dto)) { return $dto.ToUnixTimeMilliseconds() }
    return $TsUnparsable
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
    if ($BadOnly) { Write-Output ('BUILD ' + $t.Tag + ' SKIP (-BadOnly)'); continue }
    $log = (& $builder -SnapPath $frozen -HistoryPath $t.Hist -OutPath $t.Out) -join "`n"
    if ($log -notmatch 'PANEL OK') {
        Write-Output ('BUILD ' + $t.Tag + ' FAIL')
        Write-Output $log
        exit 1
    }
    Write-Output ('BUILD ' + $t.Tag + ' OK')
}

# ---- bad self-check build (queue main#130) --------------------------------
# The self-check suite needs a build whose OWN event tail is faulty, and asserts
# three rendered WARN rows: "1 bad timestamp", "1 out of order", "1 later than
# the snapshot (+5 min)". Same frozen snapshot, three ts_utc faults injected:
#   [u]           unparseable stamp          -> exactly one NaN
#   [0] <-> [b]   swap inside a non-decreasing tail -> exactly one descending pair
#   [last]        anchor + 30 min            -> exactly one future stamp
# Placing the future stamp LAST is what keeps the count at one: nothing follows
# it, so it cannot manufacture a second descending pair. The swap moves two real
# timestamps rather than inventing one, so the window/span stays plausible and
# the page cannot go red for a reason other than the three injected faults.
$poisonSnap = Join-Path $logs 'panel-fixture-bad-snap.json'
$poisonOut  = Join-Path $logs 'panel-fixture-bad.html'
# A fixture build must NOT append to the live cross-round history. Without this
# the builder falls back to logs\panel-history.jsonl and writes the FROZEN
# snapshot's record into the production series -- which is what r802 shipped and
# caught: two rows of 05:56:03Z sitting between 09:21 and 09:26, rendered as
# "2 out of order" on the panel's own track-consistency row. Fixture history is a
# throwaway next to the fixture (it is a build product, like the html).
$poisonHist = Join-Path $logs 'panel-fixture-bad-hist.jsonl'
$poisonObj = [IO.File]::ReadAllText($frozen, [Text.Encoding]::UTF8) | ConvertFrom-Json
$poisonTail = @($poisonObj.events_tail)
if ($poisonTail.Count -lt 4) {
    Write-Output ('FIXTURE FAIL: frozen snapshot events_tail=' + $poisonTail.Count + ' (< 4, cannot inject 3 faults)')
    exit 1
}
$origMs = @()
foreach ($ev in $poisonTail) { $origMs += (Get-TsMs ([string]$ev.ts_utc)) }
$uIdx = 1
$bIdx = -1
for ($i = 2; $i -le ($poisonTail.Count - 2); $i++) {
    if (($origMs[$i] -ne $TsUnparsable) -and ($origMs[0] -ne $TsUnparsable) -and ($origMs[$i] -gt $origMs[0])) { $bIdx = $i; break }
}
if ($bIdx -lt 1) {
    # Every stamp is equal (a whole window can be flat: measured 50/50 at the
    # same second), so there is no strictly-increasing pair to swap. Move the
    # head to anchor+4min: strictly greater than the flat tail, still inside the
    # anchor+5min window the panel uses for "future", so the only reading that
    # changes is the ordering one. (Using anchor itself does nothing here -- the
    # whole tail already IS anchor, which shipped a back=0 fixture in r802.)
    $poisonTail[0].ts_utc = $dto.ToUniversalTime().AddMinutes(4).ToString("yyyy-MM-dd'T'HH:mm:ss'Z'", $inv)
} else {
    $swap = [string]$poisonTail[0].ts_utc
    $poisonTail[0].ts_utc = [string]$poisonTail[$bIdx].ts_utc
    $poisonTail[$bIdx].ts_utc = $swap
}
$poisonTail[$uIdx].ts_utc = 'not-a-timestamp'
$poisonTail[$poisonTail.Count - 1].ts_utc = $dto.ToUniversalTime().AddMinutes(30).ToString("yyyy-MM-dd'T'HH:mm:ss'Z'", $inv)
$poisonObj.events_tail = $poisonTail
[IO.File]::WriteAllText($poisonSnap, ($poisonObj | ConvertTo-Json -Depth 32), $utf8)
Write-Output ('POISON ' + $poisonSnap + ' tail=' + $poisonTail.Count + ' faults=ts@' + $uIdx + ',swap0@' + $bIdx + ',future@' + ($poisonTail.Count - 1))

$log = (& $builder -SnapPath $poisonSnap -HistoryPath $poisonHist -OutPath $poisonOut) -join "`n"
if ($log -notmatch 'PANEL OK') {
    Write-Output 'BUILD bad FAIL'
    Write-Output $log
    exit 1
}
Write-Output 'BUILD bad OK'

# Gate: the inline script must be the current template, not a stale build.
# checks = number of selfcheck.push() calls (same metric the r671 test uses);
# leftover placeholders = builder failed to substitute.
$tplText = [IO.File]::ReadAllText($template, [Text.Encoding]::UTF8)
$tplChecks = ([regex]::Matches($tplText, 'selfcheck\.push\(')).Count
$bad = 0
if (-not $BadOnly) {
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
}  # end -not $BadOnly

# Gate (bad build): current template inlined, and the file on disk really does
# carry exactly one fault of each shape. This is the generator's own proof --
# the suite only renders WARN text, so a silent mis-injection here would show up
# as "0 bad stamps" on the page and the suite would go red instead of this script.
$badHtml = [IO.File]::ReadAllText($poisonOut, [Text.Encoding]::UTF8)
$bm = [regex]::Match($badHtml, '<script>([\s\S]*?)</script>')
if (-not $bm.Success) {
    Write-Output 'VERIFY bad FAIL: no inline script'
    $bad++
} else {
    $bGot = ([regex]::Matches($bm.Groups[1].Value, 'selfcheck\.push\(')).Count
    $bLeft = ([regex]::Matches($bm.Groups[1].Value, '__[A-Z]+_JSON__')).Count
    $bFlag = ($bGot -eq $tplChecks) -and ($bLeft -eq 0)
    Write-Output ('VERIFY bad checks=' + $bGot + '/' + $tplChecks + ' leftover=' + $bLeft + ' bytes=' + $badHtml.Length + ' ' + $(if ($bFlag) { 'OK' } else { 'FAIL' }))
    if (-not $bFlag) { $bad++ }
}
# Re-read from disk: the gate must judge the written artifact, not our variables.
$diskTail = @((([IO.File]::ReadAllText($poisonSnap, [Text.Encoding]::UTF8)) | ConvertFrom-Json).events_tail)
$diskMs = @()
foreach ($ev in $diskTail) { $diskMs += (Get-TsMs ([string]$ev.ts_utc)) }
$nNan = @($diskMs | Where-Object { $_ -eq $TsUnparsable }).Count
$nGood = @($diskMs | Where-Object { $_ -ne $TsUnparsable })
$nBack = 0
for ($i = 1; $i -lt $nGood.Count; $i++) { if ($nGood[$i] -lt $nGood[$i - 1]) { $nBack++ } }
$nFut = @($nGood | Where-Object { $_ -gt ($dto.ToUnixTimeMilliseconds() + 300000) }).Count
$faultOk = ($nNan -eq 1) -and ($nBack -eq 1) -and ($nFut -eq 1)
Write-Output ('VERIFY bad faults nan=' + $nNan + ' back=' + $nBack + ' future=' + $nFut + ' (each must be 1) ' + $(if ($faultOk) { 'OK' } else { 'FAIL' }))
if (-not $faultOk) { $bad++ }

if ($bad -gt 0) { Write-Output 'FIXTURES FAIL'; exit 1 }
Write-Output 'FIXTURES OK'