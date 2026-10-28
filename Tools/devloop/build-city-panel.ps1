# build-city-panel.ps1 - FluxVerse public city panel builder (r665)
# ---------------------------------------------------------------------------
# Why: the DevLoop "process-visible face" (mandate item 5: current activity /
# latest artifact / next milestone) lived only as raw JSON + tick logs. This
# builds ONE self-contained HTML panel so a human can open it with file:// and
# see the face plus the public snapshot. No server, no CDN, no external links.
#
# Design laws honoured:
#  - file:// must work => data is INLINED (fetch() is blocked on file://).
#  - ASCII-only script body (PS5.1 GBK law); all CJK lives in the UTF-8
#    template data file Tools\devloop\city-panel-template.html.
#  - Fail loud, never prompt: missing/invalid inputs -> FAIL + exit 1, target
#    output left untouched (write .new then move, r98 pattern).
#  - Honest staleness: the panel never hides a stale snapshot; the browser
#    computes age from snapshot ts_utc and paints it red past 2h.
#
# Inputs : world-public\city-snapshot.json  (tick exporter, read-only)
#          state\status-face.json           (DevLoop face writer, read-only)
#          Tools\devloop\city-panel-template.html
#          logs\panel-history.jsonl         (this script's own cross-round log;
#                                            gitignored, best-effort)
# Output : world-public\city-panel.html
#
# Note: this script only READS tick artifacts. It does not write them, so it
# never races the tick exporter.
# ---------------------------------------------------------------------------

param(
    [string]$SnapPath = '',
    [string]$FacePath = '',
    [string]$TemplatePath = '',
    [string]$OutPath = '',
    [string]$HistoryPath = '',
    [string]$TickLogPath = ''
)

$ErrorActionPreference = 'Stop'

function Fail
{
    param([string]$Msg)
    Write-Output ('FAIL: ' + $Msg)
    exit 1
}

# --- self-locate: this script sits at <repo>\Tools\devloop\ ---
$repoDir = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
if ([string]::IsNullOrEmpty($SnapPath))     { $SnapPath     = Join-Path $repoDir 'world-public\city-snapshot.json' }
if ([string]::IsNullOrEmpty($FacePath))     { $FacePath     = Join-Path $repoDir 'state\status-face.json' }
if ([string]::IsNullOrEmpty($TemplatePath)) { $TemplatePath = Join-Path $PSScriptRoot 'city-panel-template.html' }
if ([string]::IsNullOrEmpty($OutPath))      { $OutPath      = Join-Path $repoDir 'world-public\city-panel.html' }
if ([string]::IsNullOrEmpty($HistoryPath))  { $HistoryPath  = Join-Path $repoDir 'logs\panel-history.jsonl' }
if ([string]::IsNullOrEmpty($TickLogPath))  {
    $TickLogPath = Join-Path $repoDir ('logs\tick-' + (Get-Date).ToString('yyyyMMdd') + '.log')
}

foreach ($p in @($SnapPath, $FacePath, $TemplatePath)) {
    if (-not (Test-Path -LiteralPath $p)) { Fail ('input missing: ' + $p) }
}

function Read-JsonFile
{
    param([string]$Path, [string]$Label)
    $raw = ''
    try { $raw = [IO.File]::ReadAllText($Path, [Text.Encoding]::UTF8) }
    catch { Fail ($Label + ' read failed: ' + $_.Exception.Message) }
    if ([string]::IsNullOrWhiteSpace($raw)) { Fail ($Label + ' is empty: ' + $Path) }
    $obj = $null
    try { $obj = ConvertFrom-Json $raw } catch { Fail ($Label + ' is not valid JSON: ' + $_.Exception.Message) }
    if ($null -eq $obj) { Fail ($Label + ' parsed to null') }
    return $obj
}

$snap = Read-JsonFile -Path $SnapPath -Label 'snapshot'
$face = Read-JsonFile -Path $FacePath -Label 'status-face'

foreach ($k in @('current_activity','artifact','milestone')) {
    $v = ''
    try { $v = [string]$face.$k } catch { $v = '' }
    if ([string]::IsNullOrWhiteSpace($v)) { Fail ('status-face key missing/empty: ' + $k) }
}

# --- inline JSON (compact). Guard against a literal </script> breakout. ---
function To-JsLiteral
{
    param($Obj, [string]$Label)
    $json = $null
    try { $json = ConvertTo-Json $Obj -Depth 20 -Compress } catch { Fail ($Label + ' re-serialize failed: ' + $_.Exception.Message) }
    if ([string]::IsNullOrWhiteSpace($json)) { Fail ($Label + ' re-serialize returned empty') }
    return ([string]$json).Replace('</', '<\/')
}

$snapJs = To-JsLiteral -Obj $snap -Label 'snapshot'
$faceJs = To-JsLiteral -Obj $face -Label 'status-face'

# --- artifact path resolution (queue main#28, r690) -------------------------
# The face's "latest artifact" line is prose that names real files (panel html,
# qa screenshots, edited scripts). The page must never guess a path: every
# path-like token is resolved HERE (Test-Path + absolute file:// url) and the
# verdict is shipped with the page. Missing tokens are shipped too, so the page
# prints an honest "not found" instead of a dead link. Read-only and fail-soft:
# a broken artifact line degrades to zero items, it never blocks the panel.
# All three face lines ("current activity", "latest artifact", "next milestone")
# name real files, so all three get the same treatment (queue main#29). Each line
# keeps its OWN item list -- merging them into one list would let a token from
# one line link up text in another line, and the page could not tell which line
# a miss belongs to.
$artPattern = '[A-Za-z0-9_\-./\\]+\.(?:html|htm|png|jpg|jpeg|svg|md|json|jsonl|ps1|js|log|txt|mp4|webm|csv|yaml|yml|asset|unity|cs)'

function Resolve-ArtItems
{
    param([string]$Raw, [int]$Max = 24)
    $items = @()
    $seen = @{}
    $miss = @()
    $paths = 0
    if ([string]::IsNullOrWhiteSpace($Raw)) {
        return (New-Object PSObject -Property ([ordered]@{
            paths = 0; missing = 0; miss_names = @(); items = @()
        }))
    }
    $ms = [regex]::Matches($Raw, $artPattern)
    foreach ($m in $ms) {
        $tok = $m.Value
        if ([string]::IsNullOrWhiteSpace($tok)) { continue }
        $norm = $tok.Replace('\', '/')
        if ($norm -match '^[A-Za-z]:/' -or $norm.StartsWith('//')) { $abs = $norm }
        else { $abs = Join-Path $repoDir $norm.Replace('/', '\') }
        $exists = $false
        try { $exists = Test-Path -LiteralPath $abs } catch { $exists = $false }
        $url = ''
        # Size + last-write stamp of the real file (queue main#36): a link alone
        # tells the reader nothing about whether the thing is fresh or three days
        # old. Both are best effort -- a directory or an unreadable file simply
        # ships size=-1 / mtime='' and the page omits that half of the title.
        $size = -1
        $mtimeUtc = ''
        if ($exists) {
            $full = $abs
            try { $full = (Resolve-Path -LiteralPath $abs).ProviderPath } catch { $full = $abs }
            $url = 'file:///' + $full.Replace('\', '/').Replace(' ', '%20')
            try {
                $fi = Get-Item -LiteralPath $full -ErrorAction Stop
                if ($fi -and -not $fi.PSIsContainer) {
                    $size = [int64]$fi.Length
                    $mtimeUtc = $fi.LastWriteTimeUtc.ToString('yyyy-MM-ddTHH:mm:ssZ',
                        [Globalization.CultureInfo]::InvariantCulture)
                }
            } catch { $size = -1; $mtimeUtc = '' }
        }
        $items += (New-Object PSObject -Property ([ordered]@{
            text      = [string]$tok
            rel       = [string]$norm
            exists    = [bool]$exists
            url       = [string]$url
            size      = [int64]$size
            mtime_utc = [string]$mtimeUtc
        }))
        if (-not $seen.ContainsKey($norm)) {
            $seen[$norm] = $true
            $paths++
            if (-not $exists) { $miss += $norm }
        }
        if ($items.Count -ge $Max) { break }
    }
    return (New-Object PSObject -Property ([ordered]@{
        paths = [int]$paths; missing = [int]$miss.Count; miss_names = @($miss); items = @($items)
    }))
}

$faceKeyMap = [ordered]@{ act = 'current_activity'; art = 'artifact'; mile = 'milestone' }
$artBy = [ordered]@{}
$artItems = @()
$artMiss = @()
$artPaths = 0
foreach ($k in $faceKeyMap.Keys) {
    $raw = ''
    try { $raw = [string]$face.($faceKeyMap[$k]) } catch { $raw = '' }
    $one = Resolve-ArtItems -Raw $raw
    # tag every item with its line so the page can never cross-link two lines
    $tagged = @()
    foreach ($it in @($one.items)) {
        $tagged += (New-Object PSObject -Property ([ordered]@{
            text = [string]$it.text; rel = [string]$it.rel
            exists = [bool]$it.exists; url = [string]$it.url; k = [string]$k
            size = [int64]$it.size; mtime_utc = [string]$it.mtime_utc
        }))
    }
    $artBy[$k] = (New-Object PSObject -Property ([ordered]@{
        paths = [int]$one.paths; missing = [int]$one.missing
        miss_names = @($one.miss_names); items = @($tagged)
    }))
    $artItems += $tagged
    $artPaths += [int]$one.paths
    $artMiss += @($one.miss_names)
}
# --- 4th row: today's tick log as a clickable anchor (queue main#30) ---------
# The CEO should be able to open TODAY's tick log from the panel in one click.
# Same law as the face lines: the builder decides existence and the file:// url
# on disk, the page only renders. This row is deliberately kept OUT of the
# three-line aggregate (paths/missing): "three lines are clickable" is the face
# promise, while a missing tick log is already covered by self-check #9
# ("tick coverage"), so it must not turn the path row red at a midnight first
# run. A miss is still drawn honestly as "not found".
$tickRel = [string]$TickLogPath
if ($tickRel.StartsWith($repoDir, [StringComparison]::OrdinalIgnoreCase)) {
    $tickRel = $tickRel.Substring($repoDir.Length).TrimStart('\', '/').Replace('\', '/')
} else {
    $tickRel = $tickRel.Replace('\', '/')
}
$tickOne = Resolve-ArtItems -Raw $tickRel -Max 1
$tickTagged = @()
foreach ($it in @($tickOne.items)) {
    $tickTagged += (New-Object PSObject -Property ([ordered]@{
        text = [string]$it.text; rel = [string]$it.rel
        exists = [bool]$it.exists; url = [string]$it.url; k = 'tick'
        size = [int64]$it.size; mtime_utc = [string]$it.mtime_utc
    }))
}
$artBy['tick'] = (New-Object PSObject -Property ([ordered]@{
    paths      = [int]$tickOne.paths
    missing    = [int]$tickOne.missing
    miss_names = @($tickOne.miss_names)
    items      = @($tickTagged)
}))

$artMeta = New-Object PSObject -Property ([ordered]@{
    paths      = [int]$artPaths
    missing    = [int]$artMiss.Count
    miss_names = @($artMiss)
    items      = @($artItems)
    by         = $artBy
})
$artJs = To-JsLiteral -Obj $artMeta -Label 'artifact-paths'

# --- cross-round history (best effort; never breaks the panel) ---------------
# One compact record per DISTINCT snapshot ts, appended to a gitignored local
# log, so the panel can show "what changed since the previous tick" instead of
# one frozen frame. Failure here only drops the comparison card (PREV=null) --
# it must never stop the panel itself from being rebuilt.
$HistoryMax = 288
$prevRec = $null
$histAll = @()
$histOk = $true
# A history record whose counters are missing (commits/renders = 0 while the
# repo obviously has thousands) is not a data point, it is a bad write: drawn
# as-is it turns the 24h curve into a fake 0 -> 31k cliff and it silently
# poisons the page's "min/max" labels. Root fix = never append such a record
# (validated below); tolerance fix = drop already-written ones at read time and
# COUNT them, so the page can say so instead of hiding the loss.
$histDropped = 0
try {
    $rec = New-Object PSObject -Property ([ordered]@{
        ts = [string]$snap.ts_utc
        c  = [int]0; r = [int]0; g = [int]0; f = [int]0; e = [int]0
    })
    try { $rec.c = [int]$snap.city.commits_total } catch { $rec.c = 0 }
    try { $rec.r = [int]$snap.city.renders_total } catch { $rec.r = 0 }
    try { $rec.g = [int]$snap.city.games_active } catch { $rec.g = 0 }
    try { $rec.f = [int]$snap.city.fleet_online } catch { $rec.f = 0 }
    try { $rec.e = [int](@($snap.events_tail).Count) } catch { $rec.e = 0 }

    if (Test-Path -LiteralPath $HistoryPath) {
        foreach ($line in [IO.File]::ReadAllLines($HistoryPath, [Text.Encoding]::UTF8)) {
            if ([string]::IsNullOrWhiteSpace($line)) { continue }
            $o = $null
            try { $o = ConvertFrom-Json $line } catch { continue }
            if ($null -eq $o -or $null -eq $o.ts) { continue }
            # validity gate: counters must be present and positive (c>0), ts
            # must parse. Anything else is a bad write -> drop + count.
            $okRec = $false
            try {
                $cNum = [double]$o.c
                $rNum = [double]$o.r
                $tNum = [DateTimeOffset]::Parse([string]$o.ts, [Globalization.CultureInfo]::InvariantCulture)
                if ($cNum -gt 0 -and $rNum -ge 0) { $okRec = $true }
            } catch { $okRec = $false }
            if ($okRec) { $histAll += $o } else { $histDropped++ }
        }
    }

    $last = $null
    if ($histAll.Count -gt 0) { $last = $histAll[$histAll.Count - 1] }
    $append = $true
    if ([int]$rec.c -le 0) {
        # write-side gate: a snapshot with no commits_total is a partial export,
        # not a city state. Recording it is what produced the 0 -> 31k cliff.
        $append = $false
        $histDropped++
        $prevRec = $last
    } elseif ($null -ne $last -and ([string]$last.ts -eq [string]$rec.ts)) {
        # Same snapshot already recorded (panel rebuilt inside one tick window)
        $append = $false
        if ($histAll.Count -gt 1) { $prevRec = $histAll[$histAll.Count - 2] }
    } else {
        $prevRec = $last
    }

    if ($append) {
        $histAll += $rec
        if ($histAll.Count -gt $HistoryMax) {
            $histAll = $histAll[($histAll.Count - $HistoryMax)..($histAll.Count - 1)]
        }
        $sb = New-Object System.Text.StringBuilder
        foreach ($h in $histAll) {
            [void]$sb.Append((ConvertTo-Json $h -Compress))
            [void]$sb.Append("`n")
        }
        $histDir = Split-Path -Parent $HistoryPath
        if (-not (Test-Path -LiteralPath $histDir)) { New-Item -ItemType Directory -Path $histDir -Force | Out-Null }
        [IO.File]::WriteAllText($HistoryPath, $sb.ToString(), (New-Object System.Text.UTF8Encoding($false)))
    }
} catch {
    $histOk = $false
    $prevRec = $null
    $histAll = @()
}

$histMeta = New-Object PSObject -Property ([ordered]@{
    n    = [int]$histAll.Count
    max  = [int]$HistoryMax
    ok   = [bool]$histOk
    dropped = [int]$histDropped
})
if ($histAll.Count -gt 0) { $histMeta | Add-Member -NotePropertyName first_utc -NotePropertyValue ([string]$histAll[0].ts) }
else { $histMeta | Add-Member -NotePropertyName first_utc -NotePropertyValue '' }

$prevJs = 'null'
if ($null -ne $prevRec) { $prevJs = To-JsLiteral -Obj $prevRec -Label 'prev-record' }
$histJs = To-JsLiteral -Obj $histMeta -Label 'history-meta'

# --- series: tail slice of the same local log (newest last, <= 12) ----------
# The panel draws the last few ticks as a short trajectory. Same fail-soft
# contract as PREV: no history => empty array => the panel says "not enough".
$SeriesCount = 12
$seriesArr = @()
if ($histAll.Count -gt 0) {
    $from = [Math]::Max(0, $histAll.Count - $SeriesCount)
    for ($i = $from; $i -lt $histAll.Count; $i++) { $seriesArr += $histAll[$i] }
}
if ($seriesArr.Count -eq 0) { $seriesJs = '[]' }
else { $seriesJs = To-JsLiteral -Obj @($seriesArr) -Label 'series' }

# --- 24h trend: whole local log inside a 24h window (newest last) -----------
# The trajectory card above shows at most 12 ticks, which hides a multi-hour
# gap. The trend curve needs the whole day, so it gets its own injection.
# Same fail-soft contract: no usable history => empty array => "no history" state.
$TrendHours = 24
$trendArr = @()
$anchorTs = [DateTimeOffset]::UtcNow
try { $anchorTs = [DateTimeOffset]::Parse([string]$snap.ts_utc, [Globalization.CultureInfo]::InvariantCulture) } catch { }
$cutTs = $anchorTs.AddHours(-$TrendHours)
foreach ($h in $histAll) {
    $t = [DateTimeOffset]::MinValue
    try { $t = [DateTimeOffset]::Parse([string]$h.ts, [Globalization.CultureInfo]::InvariantCulture) } catch { continue }
    if ($t -ge $cutTs -and $t -le $anchorTs.AddMinutes(5)) { $trendArr += $h }
}
if ($trendArr.Count -eq 0) { $trendJs = '[]' }
else { $trendJs = To-JsLiteral -Obj @($trendArr) -Label 'trend' }

# --- tick log coverage (self-check #9) --------------------------------------
# A missing or stalled tick log is the quietest failure this panel can have:
# the panel is produced BY that tick, so a stale build still looks normal until
# you check the file itself. Read-only and fail-soft: an unreadable log yields
# read_ok=false and the page shows a WARN instead of inventing a number.
$tickExists = $false
$tickSize = 0
$tickAgeMin = -1
$tickMtime = ''
$scanLines = 0
$rounds = 0
$readOk = $true
try {
    if (Test-Path -LiteralPath $TickLogPath) {
        $tickExists = $true
        $tickItem = Get-Item -LiteralPath $TickLogPath
        $tickSize = [int]$tickItem.Length
        # Absolute last-write stamp (queue main#32). age_min is frozen at build
        # time, so a reader opening an old panel cannot recover the real moment;
        # this lets the page show the clock time behind "N minutes ago".
        $tickMtime = $tickItem.LastWriteTimeUtc.ToString('yyyy-MM-ddTHH:mm:ssZ',
            [Globalization.CultureInfo]::InvariantCulture)
        $ageSec = ([DateTime]::UtcNow - $tickItem.LastWriteTimeUtc).TotalSeconds
        if ($ageSec -lt 0) { $ageSec = 0 }
        $tickAgeMin = [int][Math]::Floor($ageSec / 60)
        foreach ($ln in [IO.File]::ReadAllLines($TickLogPath, [Text.Encoding]::UTF8)) {
            if ($ln -match '^\s*scan:') { $scanLines++ }
            if ($ln -match 'round end') { $rounds++ }
        }
    }
} catch {
    $readOk = $false
}
$tickMeta = New-Object PSObject -Property ([ordered]@{
    exists     = [bool]$tickExists
    file       = [string](Split-Path -Leaf $TickLogPath)
    size       = [int]$tickSize
    mtime_utc  = [string]$tickMtime
    age_min    = [int]$tickAgeMin
    scan_lines = [int]$scanLines
    rounds     = [int]$rounds
    read_ok    = [bool]$readOk
})
$tickJs = To-JsLiteral -Obj $tickMeta -Label 'tick-meta'

# --- city framing card (queue main#42) --------------------------------------
# The panel is all numbers and prose - the CEO cannot see what the city looks
# like. qa/ holds the real City3D evidence frames (whitebox captures). Pick the
# newest few, shrink them to card width and inline them as JPEG data URIs so the
# page stays ONE self-contained file (zero external refs, zero server).
# Fail-soft everywhere: no frames => empty list and the page says so; a resize
# or encode failure keeps the item with its file:// url but data='' and the page
# falls back to a plain link. Never invent a picture, never drop a real one.
$shotDir = 'qa'
$shotMax = 3
$shotWidth = 620
$shotQuality = 76

function Get-ShotDataUri
{
    param([string]$Path, [int]$Width = 620, [long]$Quality = 76)
    $img = $null; $bmp = $null; $g = $null; $ms = $null; $ps = $null; $codec = $null
    $res = New-Object PSObject -Property ([ordered]@{ ok = $false; uri = ''; w = 0; h = 0; bytes = [int64]0 })
    try {
        Add-Type -AssemblyName System.Drawing -ErrorAction Stop
        $img = [System.Drawing.Image]::FromFile($Path)
        $w = [int]$img.Width
        $h = [int]$img.Height
        if ($w -lt 1 -or $h -lt 1) { return $res }
        if ($w -gt $Width) {
            $h = [int][Math]::Round(($h * $Width) / $w)
            $w = $Width
        }
        if ($h -lt 1) { return $res }
        foreach ($ci in [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders()) {
            if ($ci.MimeType -eq 'image/jpeg') { $codec = $ci; break }
        }
        if ($null -eq $codec) { return $res }
        $bmp = New-Object System.Drawing.Bitmap($w, $h)
        $g = [System.Drawing.Graphics]::FromImage($bmp)
        $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
        $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
        $g.DrawImage($img, 0, 0, $w, $h)
        $ms = New-Object System.IO.MemoryStream
        $ps = New-Object System.Drawing.Imaging.EncoderParameters(1)
        $ps.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter(
            [System.Drawing.Imaging.Encoder]::Quality, [long]$Quality)
        $bmp.Save($ms, $codec, $ps)
        $bytes = $ms.ToArray()
        if ($null -eq $bytes -or $bytes.Length -lt 256) { return $res }
        $res.ok = $true
        $res.uri = 'data:image/jpeg;base64,' + [Convert]::ToBase64String($bytes)
        $res.w = [int]$w
        $res.h = [int]$h
        $res.bytes = [int64]$bytes.Length
    } catch {
        $res.ok = $false; $res.uri = ''; $res.w = 0; $res.h = 0; $res.bytes = [int64]0
    } finally {
        if ($ps)  { try { $ps.Dispose() }  catch { } }
        if ($ms)  { try { $ms.Dispose() }  catch { } }
        if ($g)   { try { $g.Dispose() }   catch { } }
        if ($bmp) { try { $bmp.Dispose() } catch { } }
        if ($img) { try { $img.Dispose() } catch { } }
    }
    return $res
}

function Resolve-CityShots
{
    param([string]$Dir, [int]$Max = 3, [int]$Width = 620, [long]$Quality = 76)
    $out = @()
    if ([string]::IsNullOrWhiteSpace($Dir)) { return @() }
    if (-not (Test-Path -LiteralPath $Dir)) { return @() }
    $cands = @()
    try {
        # The panel's own screenshots are DevLoop evidence of THIS page, not city
        # frames - including them would let the page photograph itself (caught in
        # r702: r665-city-panel-v4.png out-ranked every real frame, so the newest
        # "city view" was a shot of an old panel). Match "panel" anywhere in the
        # name. Newest first, fixed cap so the page weight stays bounded.
        $cands = @(Get-ChildItem -LiteralPath $Dir -File -ErrorAction Stop | Where-Object {
            ($_.Extension -match '^\.(png|jpg|jpeg)$') -and ($_.BaseName -notmatch 'panel')
        } | Sort-Object LastWriteTimeUtc -Descending | Select-Object -First $Max)
    } catch { return @() }
    foreach ($c in $cands) {
        $enc = Get-ShotDataUri -Path $c.FullName -Width $Width -Quality $Quality
        $full = $c.FullName
        $rel = $full
        if ($rel.StartsWith($repoDir, [StringComparison]::OrdinalIgnoreCase)) {
            $rel = $rel.Substring($repoDir.Length)
        }
        $rel = $rel.TrimStart('\', '/').Replace('\', '/')
        $url = 'file:///' + $full.Replace('\', '/').Replace(' ', '%20')
        $out += (New-Object PSObject -Property ([ordered]@{
            name     = [string]$c.Name
            rel      = [string]$rel
            url      = [string]$url
            shot_utc = $c.LastWriteTimeUtc.ToString('yyyy-MM-ddTHH:mm:ssZ',
                [Globalization.CultureInfo]::InvariantCulture)
            size     = [int64]$c.Length
            data     = [string]$enc.uri
            w        = [int]$enc.w
            h        = [int]$enc.h
            bytes    = [int64]$enc.bytes
        }))
    }
    return @($out)
}

# Wrapped in an object: a bare one-element array would lose its brackets in
# ConvertTo-Json (PS5.1) and the page would mis-read it as a single frame.
$shots = @(Resolve-CityShots -Dir (Join-Path $repoDir $shotDir) -Max $shotMax -Width $shotWidth -Quality $shotQuality)
$shotsInlined = 0
$shotsBytes = [int64]0
foreach ($s in $shots) {
    if ($s.data) { $shotsInlined++ }
    $shotsBytes += [int64]$s.bytes
}
$shotsJs = To-JsLiteral -Obj ([ordered]@{ items = @($shots) }) -Label 'shots'

# Built moment captured ONCE so the human-readable local string and the
# machine-readable ISO stamp can never disagree (queue main#35).
$builtAt = [DateTimeOffset]::Now
$built = $builtAt.ToString('yyyy-MM-dd HH:mm:ss (zzz)',
    [Globalization.CultureInfo]::InvariantCulture)
# Round-trip ISO stamp for the page's own age computation. The pretty local
# string above is NOT reliably parseable by Date.parse, so the footer age is
# derived from this one and degrades to "no number" if it is missing.
$builtIsoJs = '"' + $builtAt.ToString('o', [Globalization.CultureInfo]::InvariantCulture).Replace('\', '\\').Replace('"', '\"') + '"'
# Inject the INNER text only: the template already supplies the surrounding
# double quotes (const BUILT = /*__BUILT__*/"";). Adding quotes here once
# produced "..."\"\" which is a hard JS syntax error - the whole panel then
# rendered as an empty state (r665 first build, caught by the screenshot gate).
$builtJs = '"' + $built.Replace('\', '\\').Replace('"', '\"') + '"'

# --- template ---
$tpl = ''
try { $tpl = [IO.File]::ReadAllText($TemplatePath, [Text.Encoding]::UTF8) }
catch { Fail ('template read failed: ' + $_.Exception.Message) }

foreach ($ph in @('__SNAPSHOT_JSON__','__FACE_JSON__','__BUILT_JSON__','__BUILTISO_JSON__','__PREV_JSON__','__HIST_JSON__','__SERIES_JSON__','__TREND_JSON__','__TICK_JSON__','__SHOTS_JSON__','__ART_JSON__')) {
    if ($tpl.IndexOf($ph) -lt 0) { Fail ('template placeholder missing: ' + $ph) }
}

# String.Replace (not regex) => JSON '$' chars stay literal. SINGLE PASS: the
# template is scanned once and each placeholder is swapped for its already-built
# value, so injected content is never re-scanned. A chained .Replace() re-scanned
# earlier output and broke the page in r696: the face prose happened to contain
# the literal token of a later placeholder, which then got replaced INSIDE an
# already-embedded JSON string -> syntax error, empty panel. Same class as the
# r665 duplicate-quote incident: injected content must never be re-interpreted.
$phMap = @{
    '__SNAPSHOT_JSON__' = $snapJs
    '__FACE_JSON__'     = $faceJs
    '__BUILT_JSON__'    = $builtJs
    '__BUILTISO_JSON__' = $builtIsoJs
    '__PREV_JSON__'     = $prevJs
    '__HIST_JSON__'     = $histJs
    '__SERIES_JSON__'   = $seriesJs
    '__TREND_JSON__'    = $trendJs
    '__TICK_JSON__'     = $tickJs
    '__SHOTS_JSON__'    = $shotsJs
    '__ART_JSON__'      = $artJs
}
$phRx = New-Object System.Text.RegularExpressions.Regex('__(SNAPSHOT|FACE|BUILT|BUILTISO|PREV|HIST|SERIES|TREND|TICK|SHOTS|ART)_JSON__')
$evaluator = [System.Text.RegularExpressions.MatchEvaluator]{
    param($m)
    if (-not $phMap.ContainsKey($m.Value)) { return $m.Value }
    return [string]$phMap[$m.Value]
}
$out = $phRx.Replace($tpl, $evaluator)

# Fail loud on any placeholder-shaped token left in the output: an unrendered
# placeholder in a shipped page is a silent lie (the page would print it).
if ($phRx.IsMatch($out)) {
    $left = ($phRx.Matches($out) | ForEach-Object { $_.Value } | Select-Object -Unique) -join ','
    Fail ('placeholder still present after build: ' + $left)
}
if ($out.Length -lt 4000) { Fail ('output suspiciously small: ' + $out.Length + ' bytes') }

# --- atomic write: .new, read-back assert, move (r98 pattern) ---
$outDir = Split-Path -Parent $OutPath
if (-not (Test-Path -LiteralPath $outDir)) { Fail ('output dir missing: ' + $outDir) }
$tmpPath = $OutPath + '.new'
if (Test-Path -LiteralPath $tmpPath) { Remove-Item -LiteralPath $tmpPath -Force }
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
try { [IO.File]::WriteAllText($tmpPath, $out, $utf8NoBom) } catch {
    if (Test-Path -LiteralPath $tmpPath) { Remove-Item -LiteralPath $tmpPath -Force }
    Fail ('write .new failed: ' + $_.Exception.Message)
}

$back = ''
try { $back = [IO.File]::ReadAllText($tmpPath, [Text.Encoding]::UTF8) }
catch { Fail ('read-back failed: ' + $_.Exception.Message) }
if ($back.Length -ne $out.Length) { Fail ('read-back length mismatch: ' + $back.Length + ' != ' + $out.Length) }
if ($back.IndexOf('<html') -lt 0) { Fail 'read-back: no html root' }
if ($back.IndexOf('const SNAP = {}') -ge 0) { Fail 'read-back: SNAP inlined as empty object' }

try { Move-Item -LiteralPath $tmpPath -Destination $OutPath -Force } catch {
    if (Test-Path -LiteralPath $tmpPath) { Remove-Item -LiteralPath $tmpPath -Force }
    Fail ('move into place failed: ' + $_.Exception.Message)
}

$zonesN = 0
try { $zonesN = @($snap.zones).Count } catch { $zonesN = 0 }
$evsN = 0
try { $evsN = @($snap.events_tail).Count } catch { $evsN = 0 }

Write-Output ('PANEL OK bytes=' + $out.Length + ' zones=' + $zonesN + ' events=' + $evsN + ' snapshot_ts=' + [string]$snap.ts_utc + ' hist=' + [int]$histAll.Count + ' series=' + [int]$seriesArr.Count + ' trend=' + [int]$trendArr.Count + ' prev=' + $(if ($null -ne $prevRec) { [string]$prevRec.ts } else { 'none' }) + ' hist_ok=' + $histOk + ' art=' + [int]$artPaths + ' art_missing=' + [int]$artMiss.Count + ' tick=' + $(if ($tickExists) { [string]$tickAgeMin + 'min scan=' + $scanLines + ' rounds=' + $rounds } else { 'missing' }) + ' tickrow=' + [int]$tickOne.paths + ' tickrow_missing=' + [int]$tickOne.missing + ' shots=' + [int]$shots.Count + ' shots_inlined=' + [int]$shotsInlined + ' shots_kb=' + [int][Math]::Round($shotsBytes / 1024) + ' built=' + $built + ' path=' + $OutPath)
exit 0