# test-rebuild-panel-fixtures-bad.ps1 - sandbox for the bad self-check fixture
# ---------------------------------------------------------------------------
# WHY (queue main#130): logs\devloop-r670-panel-selfcheck-test.js drives a build
# whose event tail is faulty and asserts three rendered WARN rows ("1 bad
# timestamp" / "1 out of order" / "1 later than the snapshot"). The file had no
# generator: r764's guard told the reader to run rebuild-panel-fixtures.ps1, and
# that script only produced prev/regress -- so once logs\ was pruned the suite
# could only exit 3 (cannot judge) forever, and "run the command it names" was a
# fix that could not work.
#
# WHAT THIS ASSERTS: the generator really does write a bad build whose faults
# are exactly one of each shape, that the inlined script is the current template,
# and that it refuses an unusable snapshot instead of writing a half fixture.
# Every scenario runs in a temp -LogsDir, so the real logs\ tree is fingerprinted
# before/after and must not move by a byte.
#
# HONEST BOUNDARY: this does not re-run r670 (it reads logs/ relative to the repo
# root and cannot be redirected), so "exit 3 -> exit 0" was proven by hand this
# round, not by this sandbox. What is mechanical here is the three fault counts
# r670's assertions read, which is the part that silently rots.
#
# ASCII-only law: no CJK in this file (PS5.1 GBK trap).
$ErrorActionPreference = 'Stop'
$inv = [Globalization.CultureInfo]::InvariantCulture
$here = $PSScriptRoot
$repo = Split-Path -Parent (Split-Path -Parent $here)
$script = Join-Path $here 'rebuild-panel-fixtures.ps1'
$tpl = Join-Path $here 'city-panel-template.html'
$liveSnap = Join-Path $repo 'world-public\city-snapshot.json'
$realLogs = Join-Path $repo 'logs'
$utf8 = New-Object System.Text.UTF8Encoding($false)
$TsUnparsable = [long]::MinValue

$pass = 0
$fail = 0
function Chk {
    param([string]$Name, [bool]$Cond, [string]$Detail)
    if ($Cond) { $script:pass++; Write-Output ('PASS ' + $Name) }
    else { $script:fail++; Write-Output ('FAIL ' + $Name + ' :: ' + $Detail) }
}
function Get-TsMs {
    param([string]$Raw)
    $dto = [DateTimeOffset]::MinValue
    if ([DateTimeOffset]::TryParse($Raw, $inv, [Globalization.DateTimeStyles]::AssumeUniversal, [ref]$dto)) { return $dto.ToUnixTimeMilliseconds() }
    return $TsUnparsable
}
function Get-AnchorMs {
    param([string]$Path)
    # r796 law: a path in, or a named failure out -- never a silent empty read.
    if (-not (Test-Path -LiteralPath $Path)) { throw ('snapshot missing: ' + $Path) }
    $o = [IO.File]::ReadAllText($Path, [Text.Encoding]::UTF8) | ConvertFrom-Json
    $dto = [DateTimeOffset]::MinValue
    [void][DateTimeOffset]::TryParse([string]$o.ts_utc, $inv, [Globalization.DateTimeStyles]::AssumeUniversal, [ref]$dto)
    return $dto.ToUnixTimeMilliseconds()
}
# Count the three shapes the way the panel counts them: NaN removed first, then
# descending pairs over the survivors, then anything past anchor + 5 min.
function Get-FaultCounts {
    param([string]$SnapPath)
    if (-not (Test-Path -LiteralPath $SnapPath)) { throw ('bad snapshot missing: ' + $SnapPath) }
    $o = [IO.File]::ReadAllText($SnapPath, [Text.Encoding]::UTF8) | ConvertFrom-Json
    $anch = Get-AnchorMs $SnapPath
    $ms = @()
    foreach ($ev in @($o.events_tail)) { $ms += (Get-TsMs ([string]$ev.ts_utc)) }
    $good = @($ms | Where-Object { $_ -ne $TsUnparsable })
    $back = 0
    for ($i = 1; $i -lt $good.Count; $i++) { if ($good[$i] -lt $good[$i - 1]) { $back++ } }
    return [pscustomobject]@{
        nan    = @($ms | Where-Object { $_ -eq $TsUnparsable }).Count
        back   = $back
        future = @($good | Where-Object { $_ -gt ($anch + 300000) }).Count
        n      = $ms.Count
    }
}
function Get-Fingerprint {
    param([string[]]$Paths)
    $out = @()
    foreach ($p in $Paths) {
        if (Test-Path -LiteralPath $p) {
            $f = Get-Item -LiteralPath $p
            $out += ($f.Name + '=' + $f.Length + '@' + $f.LastWriteTimeUtc.Ticks)
        } else { $out += ([IO.Path]::GetFileName($p) + '=missing') }
    }
    return ($out -join ';')
}

if (-not (Test-Path -LiteralPath $script)) { Write-Output 'RESULT: FAIL (generator missing)'; exit 1 }
if (-not (Test-Path -LiteralPath $liveSnap)) { Write-Output 'RESULT: FAIL (live snapshot missing)'; exit 1 }
$tplChecks = ([regex]::Matches([IO.File]::ReadAllText($tpl, [Text.Encoding]::UTF8), 'selfcheck\.push\(')).Count

$realFiles = @(
    (Join-Path $realLogs 'panel-fixture-bad.html'),
    (Join-Path $realLogs 'panel-fixture-bad-snap.json'),
    (Join-Path $realLogs 'panel-fixture-prev.html'),
    (Join-Path $realLogs 'panel-fixture-regress.html')
)
$realBefore = Get-Fingerprint $realFiles

$tmpRoot = Join-Path ([IO.Path]::GetTempPath()) ('fv-badfix-' + [guid]::NewGuid().ToString('N').Substring(0, 8))
New-Item -ItemType Directory -Path $tmpRoot -Force | Out-Null
try {
    # ---- a: live snapshot, bad-only build ------------------------------------
    $a = Join-Path $tmpRoot 'a'
    New-Item -ItemType Directory -Path $a -Force | Out-Null
    $outA = (& $script -LogsDir $a -BadOnly) -join "`n"
    $codeA = $LASTEXITCODE
    Chk 'a.exit=0' ($codeA -eq 0) ('exit=' + $codeA + ' :: ' + $outA)
    Chk 'a.verdict=FIXTURES OK' ($outA -match 'FIXTURES OK') 'no FIXTURES OK line'
    $badHtmlA = Join-Path $a 'panel-fixture-bad.html'
    $badSnapA = Join-Path $a 'panel-fixture-bad-snap.json'
    Chk 'a.bad.html written' (Test-Path -LiteralPath $badHtmlA) 'missing bad.html'
    Chk 'a.bad.snap written' (Test-Path -LiteralPath $badSnapA) 'missing bad-snap.json'
    Chk 'a.no prev build (-BadOnly)' (-not (Test-Path -LiteralPath (Join-Path $a 'panel-fixture-prev.html'))) 'prev.html appeared'
    if (Test-Path -LiteralPath $badSnapA) {
        $fa = Get-FaultCounts $badSnapA
        Chk 'a.faults nan=1' ($fa.nan -eq 1) ('nan=' + $fa.nan)
        Chk 'a.faults back=1' ($fa.back -eq 1) ('back=' + $fa.back)
        Chk 'a.faults future=1' ($fa.future -eq 1) ('future=' + $fa.future)
        Chk 'a.tail length kept' ($fa.n -gt 4) ('n=' + $fa.n)
    }
    if (Test-Path -LiteralPath $badHtmlA) {
        $htmlA = [IO.File]::ReadAllText($badHtmlA, [Text.Encoding]::UTF8)
        $im = [regex]::Match($htmlA, '<script>([\s\S]*?)</script>')
        Chk 'a.inline script present' $im.Success 'no inline script'
        if ($im.Success) {
            $gotA = ([regex]::Matches($im.Groups[1].Value, 'selfcheck\.push\(')).Count
            $leftA = ([regex]::Matches($im.Groups[1].Value, '__[A-Z]+_JSON__')).Count
            Chk 'a.inline=current template' ($gotA -eq $tplChecks) ('checks=' + $gotA + '/' + $tplChecks)
            Chk 'a.no leftover placeholder' ($leftA -eq 0) ('leftover=' + $leftA)
        }
    }

    # ---- b: flat tail (every stamp identical) --------------------------------
    # Real snapshots are non-decreasing but can be flat for a whole window; the
    # swap branch then has nothing to swap, so the head must be moved ahead of
    # the tail instead -- and the count must STILL be exactly one of each.
    $b = Join-Path $tmpRoot 'b'
    New-Item -ItemType Directory -Path $b -Force | Out-Null
    $flatObj = [IO.File]::ReadAllText($liveSnap, [Text.Encoding]::UTF8) | ConvertFrom-Json
    $flatTail = @($flatObj.events_tail)
    if ($flatTail.Count -lt 4) {
        Chk 'b.fixture has >=4 events' $false ('n=' + $flatTail.Count)
    } else {
        $flatStamp = [string]$flatTail[0].ts_utc
        foreach ($ev in $flatTail) { $ev.ts_utc = $flatStamp }
        $flatObj.events_tail = $flatTail
        [IO.File]::WriteAllText((Join-Path $b 'panel-fixture-snap.json'), ($flatObj | ConvertTo-Json -Depth 32), $utf8)
        $outB = (& $script -LogsDir $b -BadOnly) -join "`n"
        Chk 'b.exit=0' ($LASTEXITCODE -eq 0) ('exit=' + $LASTEXITCODE + ' :: ' + $outB)
        $badSnapB = Join-Path $b 'panel-fixture-bad-snap.json'
        if (Test-Path -LiteralPath $badSnapB) {
            $fb = Get-FaultCounts $badSnapB
            Chk 'b.flat-tail still nan=1' ($fb.nan -eq 1) ('nan=' + $fb.nan)
            Chk 'b.flat-tail still back=1' ($fb.back -eq 1) ('back=' + $fb.back)
            Chk 'b.flat-tail still future=1' ($fb.future -eq 1) ('future=' + $fb.future)
        } else { Chk 'b.bad.snap written' $false 'missing bad-snap.json' }
    }

    # ---- c: unusable snapshot must fail loud, not write a half fixture ------
    $c = Join-Path $tmpRoot 'c'
    New-Item -ItemType Directory -Path $c -Force | Out-Null
    $shortObj = [IO.File]::ReadAllText($liveSnap, [Text.Encoding]::UTF8) | ConvertFrom-Json
    $shortObj.events_tail = @((@($shortObj.events_tail) | Select-Object -First 2))
    [IO.File]::WriteAllText((Join-Path $c 'panel-fixture-snap.json'), ($shortObj | ConvertTo-Json -Depth 32), $utf8)
    $outC = (& $script -LogsDir $c -BadOnly) -join "`n"
    $codeC = $LASTEXITCODE
    Chk 'c.short tail exit=1' ($codeC -eq 1) ('exit=' + $codeC)
    Chk 'c.short tail names the reason' ($outC -match 'events_tail') 'no events_tail line'
    Chk 'c.short tail writes no bad.html' (-not (Test-Path -LiteralPath (Join-Path $c 'panel-fixture-bad.html'))) 'bad.html was written'
    Chk 'c.short tail writes no bad snap' (-not (Test-Path -LiteralPath (Join-Path $c 'panel-fixture-bad-snap.json'))) 'bad-snap.json was written'

    # ---- d: the real logs\ tree must not move -------------------------------
    $realAfter = Get-Fingerprint $realFiles
    Chk 'd.real logs untouched' ($realBefore -eq $realAfter) ('before=' + $realBefore + ' after=' + $realAfter)
}
finally {
    if (Test-Path -LiteralPath $tmpRoot) { Remove-Item -LiteralPath $tmpRoot -Recurse -Force -ErrorAction SilentlyContinue }
}

Write-Output ('pass=' + $pass + ' fail=' + $fail)
if ($fail -gt 0) { Write-Output ('RESULT: FAIL (' + $fail + ')'); exit 1 }
Write-Output 'RESULT: PASS'
exit 0