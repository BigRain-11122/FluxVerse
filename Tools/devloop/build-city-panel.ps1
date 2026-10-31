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
    [string]$TickLogPath = '',
    [string]$ShotDir = 'qa',
    [string]$ProofRoot = '',
    [string]$DecisionsPath = '',
    [string]$ArchiveStatePath = '',
    [switch]$SiteSkip
)

$ErrorActionPreference = 'Stop'

# City-frame guards (panel name / family registry / shape) - one definition,
# shared with Tools\perceptor\verify.ps1's census (queue main#47).
$shotShapeModule = Join-Path $PSScriptRoot 'city-shot-shape.ps1'
if (-not (Test-Path -LiteralPath $shotShapeModule)) {
    Write-Output ('FAIL: city-shot-shape.ps1 missing: ' + $shotShapeModule)
    exit 1
}
. $shotShapeModule

# Same single-definition move for the R2 site verdict (queue main#57): the page
# prints the block-water reading from the checker's own summary lines and uses
# the module's red line, so verify and the panel can never quote different lakes.
$siteVerdictModule = Join-Path $PSScriptRoot 'site-verdict.ps1'
if (-not (Test-Path -LiteralPath $siteVerdictModule)) {
    Write-Output ('FAIL: site-verdict.ps1 missing: ' + $siteVerdictModule)
    exit 1
}
. $siteVerdictModule

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
if ([string]::IsNullOrEmpty($ProofRoot))    { $ProofRoot    = $repoDir }

# --- live group root (shared resolver, D-20261028-04) ----------------------
# Two consumers need it: the duty card (group decisions.md) and artifact links
# (the face legitimately names group-level files such as docs/decisions.md,
# which do not live inside this repo). Counting "..\.." hops lands on the stale
# mirror and silently reads week-old bytes, so it is resolved ONCE here.
$groupRoot = ''
$groupResolver = Join-Path $PSScriptRoot 'resolve-group-root.ps1'
if (Test-Path -LiteralPath $groupResolver) {
    . $groupResolver
    try {
        $groupRoot = Resolve-GroupRoot -RepoRoot $repoDir -LegacyRoot (Join-Path $repoDir '..\..')
    } catch { $groupRoot = '' }
}
if ([string]::IsNullOrEmpty($groupRoot)) {
    $groupRoot = [IO.Path]::GetFullPath((Join-Path $repoDir '..\..'))
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
$artPattern = '[A-Za-z0-9_\-./\\]+\.(?:html|htm|png|jpg|jpeg|svg|md|json|jsonl|ps1|js|log|txt|mp4|webm|csv|yaml|yml|asset|unity|cs|zip)'

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
        # Second home: the group tree. The face prose is allowed to name group
        # files (docs/decisions.md, cph4/evolution-ledger.md); testing them only
        # against the repo painted a red "not found" on a file that exists one
        # level up (r709, art_missing=1 on a live path).
        if (-not $exists -and $norm -notmatch '^[A-Za-z]:/' -and -not $norm.StartsWith('//')) {
            $groupAbs = Join-Path $groupRoot $norm.Replace('/', '\')
            try { if (Test-Path -LiteralPath $groupAbs) { $abs = $groupAbs; $exists = $true } } catch { }
        }
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
$shotDir = $ShotDir
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

# The three guards (panel name / family registry / shape) live in
# city-shot-shape.ps1 so Tools\perceptor\verify.ps1 can run the exact same
# definition in its census (queue main#47). Changing a threshold below would
# change it on both faces silently - edit the module instead.

function Resolve-CityShots
{
    param([string]$Dir, [int]$Max = 3, [int]$Width = 620, [long]$Quality = 76)
    $script:shotsSkipped = 0
    $script:shotsUnnamed = 0
    $out = @()
    if ([string]::IsNullOrWhiteSpace($Dir)) { return @() }
    if (-not (Test-Path -LiteralPath $Dir)) { return @() }
    $cands = @()
    try {
        # The panel's own screenshots are DevLoop evidence of THIS page, not city
        # frames - including them would let the page photograph itself (caught in
        # r702: r665-city-panel-v4.png out-ranked every real frame, so the newest
        # "city view" was a shot of an old panel). Newest first; the cap is
        # applied AFTER the guards so rejected files do not eat one of the three
        # card slots (r706).
        $cands = @(Get-ChildItem -LiteralPath $Dir -File -ErrorAction Stop | Where-Object {
            $_.Extension -match '^\.(png|jpg|jpeg)$'
        } | Sort-Object LastWriteTimeUtc -Descending)
    } catch { return @() }
    foreach ($c in $cands) {
        if ($out.Count -ge $Max) { break }
        $v = Get-CityShotVerdict -Name $c.Name -Path $c.FullName
        if (-not $v.keep) {
            if ($v.reason -eq 'unnamed') { $script:shotsUnnamed++ }
            if ($v.reason -ne 'panel') { $script:shotsSkipped++ }
            continue
        }
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

# --- city proof rows (queue main#48) ----------------------------------------
# The framing card answers "what does the city look like" but not "was it built,
# was it measured, how old is the city code". That evidence already sits on disk
# (City3D-staging build receipt + report, the 10-minute soak receipt, the last
# City3D commit) and used to be reachable only by walking the tree. Parse it
# read-only and ship it beside the frames. Two different facts must never merge:
# "receipt absent" (exists=false) vs "receipt present but unreadable" (exists=true,
# numbers -1). A missing file never blocks the panel; the page says so instead.
function Convert-UtcIso
{
    param([string]$Raw)
    if ([string]::IsNullOrWhiteSpace($Raw)) { return '' }
    try {
        $dto = [DateTimeOffset]::Parse($Raw, [Globalization.CultureInfo]::InvariantCulture)
        return $dto.UtcDateTime.ToString('yyyy-MM-ddTHH:mm:ssZ',
            [Globalization.CultureInfo]::InvariantCulture)
    } catch { return '' }
}

function Get-ProofFileInfo
{
    param([string]$Path)
    $r = New-Object PSObject -Property ([ordered]@{
        exists = $false; rel = ''; url = ''; size = [int64]-1; mtime_utc = '' })
    try {
        if (-not (Test-Path -LiteralPath $Path)) { return $r }
        $it = Get-Item -LiteralPath $Path -ErrorAction Stop
        if ($it.PSIsContainer) { return $r }
        $r.exists = $true
        $r.size = [int64]$it.Length
        $r.mtime_utc = $it.LastWriteTimeUtc.ToString('yyyy-MM-ddTHH:mm:ssZ',
            [Globalization.CultureInfo]::InvariantCulture)
        $full = $it.FullName
        $rel = $full
        if ($rel.StartsWith($repoDir, [StringComparison]::OrdinalIgnoreCase)) {
            $rel = $rel.Substring($repoDir.Length)
        }
        $r.rel = $rel.TrimStart('\', '/').Replace('\', '/')
        $r.url = 'file:///' + $full.Replace('\', '/').Replace(' ', '%20')
    } catch { }
    return $r
}

function Resolve-CityProof
{
    param([string]$Root)

    $build = [ordered]@{
        exists = $false; exit_code = -1; ts_utc = ''; wall_s = -1
        shots_present = -1; shots_expected = -1; rel = ''; url = ''
        report_rel = ''; report_url = ''
    }
    $soak = [ordered]@{
        exists = $false; fps_avg = -1; errors = -1; exceptions = -1
        ts_utc = ''; rel = ''; url = ''
        p95_ms = -1
        baseline_fps = -1; baseline_p95_ms = -1; baseline_rel = ''; baseline_url = ''
        drift_pct = $null; p95_drift_pct = $null
    }
    $code = [ordered]@{ exists = $false; sha = ''; ts_utc = '' }

    # R2 site verdict (queue main#57): the district stands 91.7% over the water
    # mesh and that fact only lived in a hand-run report plus a tick log line.
    # Same checker, same parsing, same red line as verify (site-verdict.ps1) -
    # the builder must never own a second threshold.
    $site = [ordered]@{
        ran = $false; block_water = -1.0; block_water_text = ''
        dry_candidates = -1; nearest_dry_m = -1.0; nearest_dry_text = ''
        verdict = ''; over_water = $false; reason = 'skipped'
    }
    if (-not $SiteSkip) {
        try {
            $sv = Get-SiteVerdict -Root $Root
            foreach ($k in @('ran','block_water','block_water_text','dry_candidates',
                             'nearest_dry_m','nearest_dry_text','verdict','over_water','reason')) {
                $site[$k] = $sv[$k]
            }
        } catch {
            $site.reason = 'site check threw: ' + $_.Exception.Message
        }
    }

    $donePath = Join-Path $Root 'City3D-staging\r2-ignite.done'
    $doneInfo = Get-ProofFileInfo -Path $donePath
    $repInfo  = Get-ProofFileInfo -Path (Join-Path $Root 'City3D-staging\r2-report.md')
    if ($repInfo.exists) {
        $build.report_rel = [string]$repInfo.rel
        $build.report_url = [string]$repInfo.url
    }
    if ($doneInfo.exists) {
        $build.exists = $true
        $build.rel = [string]$doneInfo.rel
        $build.url = [string]$doneInfo.url
        try {
            $dj = ConvertFrom-Json ([IO.File]::ReadAllText($donePath, [Text.Encoding]::UTF8))
            $build.exit_code = [int]$dj.exit_code
            $build.wall_s = [int]$dj.wall_s
            $build.shots_present = [int]$dj.shots_present
            $build.shots_expected = [int]$dj.shots_expected
            $build.ts_utc = Convert-UtcIso -Raw ([string]$dj.ts)
        } catch { $build.exit_code = -1 }
    }

    # Soak evidence = the newest probe output. r2-soak.ps1 writes qa\r2-soak-<stamp>.json;
    # older ad-hoc runs wrote smoke-*-soak.json. Newest wins, so a fresh re-run replaces
    # an old receipt instead of being silently ignored (main#17, r710).
    $soakCands = @()
    foreach ($soakPat in @('r2-soak-*.json', 'smoke-*-soak.json')) {
        $soakCands += @(Get-ChildItem -LiteralPath (Join-Path $Root 'qa') -Filter $soakPat -File -ErrorAction SilentlyContinue)
    }
    $soakFile = $soakCands | Sort-Object LastWriteTimeUtc -Descending | Select-Object -First 1
    $soakPath = if ($soakFile) { $soakFile.FullName } else { Join-Path $Root 'qa\smoke-r680-bm-a-soak.json' }
    $soakInfo = Get-ProofFileInfo -Path $soakPath
    if ($soakInfo.exists) {
        $soak.exists = $true
        $soak.rel = [string]$soakInfo.rel
        $soak.url = [string]$soakInfo.url
        try {
            $sj = ConvertFrom-Json ([IO.File]::ReadAllText($soakPath, [Text.Encoding]::UTF8))
            $soak.ts_utc = Convert-UtcIso -Raw ([string]$sj.ts_utc)
            $soak.errors = [int]$sj.errors
            $soak.exceptions = [int]$sj.exceptions
            if ($null -ne $sj.render) {
                $soak.fps_avg = [double]$sj.render.fps_avg
                if ($null -ne $sj.render.dt_p95_ms) { $soak.p95_ms = [double]$sj.render.dt_p95_ms }
            }
        } catch { $soak.fps_avg = -1 }
    }

    # Baseline (queue main#52): a bare "409.8 fps" says nothing to a human - only
    # the distance from the accepted baseline does. The baseline receipt is the
    # r680 uncapped 10-minute soak that the city perf line was certified against;
    # when the newest receipt IS the baseline the drift is 0 by construction.
    # Both sides are read the same way, so an unreadable baseline yields nulls
    # (page then prints the number without a drift claim - never a fake 0%).
    $basePath = Join-Path $Root 'qa\smoke-r680-bm-a-soak.json'
    $baseInfo = Get-ProofFileInfo -Path $basePath
    if ($baseInfo.exists) {
        $soak.baseline_rel = [string]$baseInfo.rel
        $soak.baseline_url = [string]$baseInfo.url
        try {
            $bj = ConvertFrom-Json ([IO.File]::ReadAllText($basePath, [Text.Encoding]::UTF8))
            if ($null -ne $bj.render) {
                $soak.baseline_fps = [double]$bj.render.fps_avg
                if ($null -ne $bj.render.dt_p95_ms) { $soak.baseline_p95_ms = [double]$bj.render.dt_p95_ms }
            }
        } catch { $soak.baseline_fps = -1 }
    }
    if (($soak.fps_avg -gt 0) -and ($soak.baseline_fps -gt 0)) {
        $soak.drift_pct = [Math]::Round((($soak.fps_avg - $soak.baseline_fps) / $soak.baseline_fps) * 100, 1)
    }
    if (($soak.p95_ms -gt 0) -and ($soak.baseline_p95_ms -gt 0)) {
        $soak.p95_drift_pct = [Math]::Round((($soak.p95_ms - $soak.baseline_p95_ms) / $soak.baseline_p95_ms) * 100, 1)
    }

    # Read-only git lookup: which commit last touched City3D/. A git-less machine
    # (or a fixture root outside any repo) simply yields exists=false.
    try {
        $gitCmd = Get-Command git -ErrorAction Stop
        $raw = & $gitCmd.Source -C $Root log -1 --format='%h|%aI' -- City3D/ 2>$null
        $line = ([string]($raw | Select-Object -First 1)).Trim()
        if ($line -match '^([0-9a-f]{4,40})\|(.+)$') {
            $code.exists = $true
            $code.sha = [string]$Matches[1]
            $code.ts_utc = Convert-UtcIso -Raw ([string]$Matches[2])
        }
    } catch { }

    return [ordered]@{ build = $build; soak = $soak; code = $code; site = $site }
}

# ---------------------------------------------------------------------------
# Duty orders (queue main#50): the group's decision rounds name this company in
# table rows such as "| 2026-10-28 | D-20261028-13 ... | ... | dispatched（...10-31
# 00:00...）|". Until now that duty list was readable only by grepping
# docs\decisions.md, so "what did the group ask of us and when is it due" was
# invisible on the one page a human actually opens.
#
# Read-only, fail-soft, honest:
#  - the file is located through the SHARED live-root resolver (D-20261028-04):
#    counting "..\.." hops silently lands on the stale mirror.
#  - only table rows that (a) mention this repo by name and (b) are still open
#    (status cell carries dispatched/open) become duty rows; executed rows are
#    not work.
#  - a due stamp that cannot be parsed ships due_utc='' and is never counted
#    late - an unreadable deadline is "unknown", not "on time".
#  - missing file => exists=false, never a silent empty list pretending zero duty.
function Resolve-Duty
{
    param([string]$Path)

    $r = [ordered]@{
        exists = $false; path_rel = ''; url = ''; as_of_utc = ''
        scanned = 0; matched = 0; open = 0; late = 0; rows = @()
    }
    if ([string]::IsNullOrEmpty($Path)) { return $r }
    if (-not (Test-Path -LiteralPath $Path)) { return $r }

    $raw = ''
    try { $raw = [IO.File]::ReadAllText($Path, [Text.Encoding]::UTF8) }
    catch { return $r }
    $r.exists = $true

    try {
        $di = Get-Item -LiteralPath $Path -ErrorAction Stop
        $r.as_of_utc = $di.LastWriteTimeUtc.ToString('yyyy-MM-ddTHH:mm:ssZ',
            [Globalization.CultureInfo]::InvariantCulture)
    } catch { }
    $full = [IO.Path]::GetFullPath($Path)
    $rel = $full
    if ($rel.StartsWith($repoDir, [StringComparison]::OrdinalIgnoreCase)) {
        $rel = $rel.Substring($repoDir.Length)
    }
    $r.path_rel = $rel.TrimStart('\', '/').Replace('\', '/')
    $r.url = 'file:///' + $full.Replace('\', '/').Replace(' ', '%20')

    # Only the tail matters (the newest batches live at the end) and a 400KB file
    # split into objects per row would cost more than the panel is worth.
    $lines = $raw -split "`r?`n"
    if ($lines.Count -gt 600) { $lines = $lines[($lines.Count - 600)..($lines.Count - 1)] }

    # Owner tokens live in a UTF-8 data file (ASCII-only law: the script must not
    # carry CJK). "FluxVerse" alone is not enough - a batch dispatched to "四司"
    # names no company explicitly, and that row is still our work.
    $tokens = @('FluxVerse')
    $tokPath = Join-Path $PSScriptRoot 'duty-owners.json'
    if (Test-Path -LiteralPath $tokPath) {
        try {
            $tj = ConvertFrom-Json ([IO.File]::ReadAllText($tokPath, [Text.Encoding]::UTF8))
            $extra = @($tj.tokens | Where-Object { $_ -ne $null -and [string]$_ -ne '' })
            if ($extra.Count -gt 0) { $tokens = @($extra) }
        } catch { }
    }

    # Pre-pass: a later row can park an earlier decision ("suspended（候复产口令）"
# naming D-....). The parked row keeps saying "dispatched" on its own line, so
# without this pass the card bills an order the ledger already suspended - the
# first live build showed D-20261020-05 as 133 hours overdue although D-20261024-07
# had explicitly parked it (r709). Only suspension counts as a closer: an
# "executed" batch row that merely mentions an id is usually evidence, not a
# closure (D-20261028-14 mentions D-20261028-04 as still open).
    $suspended = @{}
    foreach ($pl in $lines) {
        $ps = $pl.Trim()
        if (-not $ps.StartsWith('| 2026-')) { continue }
        $pc = $ps.Trim('|').Split('|')
        if ($pc.Count -lt 6) { continue }
        if (([string]$pc[$pc.Count - 1]).Trim() -notmatch '(?i)\bsuspended\b') { continue }
        foreach ($mm in [regex]::Matches($ps, 'D-20\d{6}-\d{2}')) { $suspended[$mm.Value] = $true }
    }

    $now = [DateTimeOffset]::Now
    $out = New-Object System.Collections.ArrayList
    $scanned = 0
    $matched = 0
    foreach ($ln in $lines) {
        $s = $ln.Trim()
        if (-not $s.StartsWith('| 2026-')) { continue }
        $cells = $s.Trim('|').Split('|')
        if ($cells.Count -lt 6) { continue }
        $scanned++

        # Columns: date | problem | source | basis | decision | grade | status.
        # Only the DECISION cell (who is told to act) and the STATUS cell (who the
        # dispatch was addressed to) may name us. A mention inside problem/source/
        # basis is evidence ABOUT us, not an order TO us - the first draft matched
        # the whole row and shipped four rows of other companies' work (r709).
        $actIdx = $cells.Count - 3
        if ($actIdx -lt 0) { $actIdx = 0 }
        $action = ([string]$cells[$actIdx]).Trim()
        $status = ([string]$cells[$cells.Count - 1]).Trim()

        $ownerHit = $false
        foreach ($tk in $tokens) {
            if ($action.IndexOf($tk, [StringComparison]::OrdinalIgnoreCase) -ge 0 -or
                $status.IndexOf($tk, [StringComparison]::OrdinalIgnoreCase) -ge 0) { $ownerHit = $true; break }
        }
        if (-not $ownerHit) { continue }
        $matched++
        if ($status -notmatch '(?i)\b(dispatched|open)\b') { continue }

        $id = ''
        $mId = [regex]::Match($s, 'D-20\d{6}-\d{2}')
        if ($mId.Success) { $id = $mId.Value }
        if ($id -ne '' -and $suspended.ContainsKey($id)) { continue }

        $subject = ([string]$cells[1]).Trim()
        if ($id -ne '') { $subject = $subject.Replace($id, '').Trim() }
        if ($subject.Length -gt 96) { $subject = $subject.Substring(0, 96) + '...' }
        if ($action.Length -gt 300) { $action = $action.Substring(0, 300) + '...' }

        # Due stamp: ONLY from the status cell - scanning the whole row turned a
        # timestamp quoted in the basis into a bogus deadline (r709: a row's
        # "10-20 21:44" reference made a 10-26 order look a week overdue).
        # Forms seen: "dispatched（四司／10-31 00:00／...）" and "dispatched（@X 24h）".
        $dueTxt = ''
        $dueUtc = ''
        $mDue = [regex]::Match($status, '(?<!\d)(\d{1,2})-(\d{2})\s+(\d{1,2}):(\d{2})(?!\d)')
        if ($mDue.Success) {
            $dueTxt = $mDue.Groups[1].Value + '-' + $mDue.Groups[2].Value + ' ' +
                $mDue.Groups[3].Value + ':' + $mDue.Groups[4].Value
            try {
                $mo = [int]$mDue.Groups[1].Value
                $dy = [int]$mDue.Groups[2].Value
                $hh = [int]$mDue.Groups[3].Value
                $mi = [int]$mDue.Groups[4].Value
                if ($mo -ge 1 -and $mo -le 12 -and $dy -ge 1 -and $dy -le 31 -and
                    $hh -ge 0 -and $hh -le 24 -and $mi -ge 0 -and $mi -le 59 -and
                    -not ($hh -eq 24 -and $mi -ne 0)) {
                    $dt = New-Object DateTime($now.Year, $mo, $dy, 0, 0, 0, [DateTimeKind]::Local)
                    # "10-25 24:00" is a real deadline idiom (end of day) - the
                    # next midnight, not an invalid hour. Rejecting it silently
                    # made an overdue order look undated (r709).
                    $dt = $dt.AddHours($hh).AddMinutes($mi)
                    if ($dt -lt $now.LocalDateTime.AddDays(-200)) {
                        $dt = $dt.AddYears(1)
                    }
                    $dueUtc = $dt.ToUniversalTime().ToString('yyyy-MM-ddTHH:mm:ssZ',
                        [Globalization.CultureInfo]::InvariantCulture)
                }
            } catch { $dueUtc = '' }
        } elseif ($status -match '(?<!\d)(\d{4})-(\d{2})-(\d{2})(?!\d)') {
            # Date-only window ("回访 2026-10-23 治理窗"): the day itself is the
            # deadline, so midnight local. Left unparsed this order showed as
            # "no deadline" although it was a week overdue (r709).
            $dueTxt = $Matches[1] + '-' + $Matches[2] + '-' + $Matches[3]
            try {
                $dt = New-Object DateTime([int]$Matches[1], [int]$Matches[2],
                    [int]$Matches[3], 0, 0, 0, [DateTimeKind]::Local)
                $dueUtc = $dt.ToUniversalTime().ToString('yyyy-MM-ddTHH:mm:ssZ',
                    [Globalization.CultureInfo]::InvariantCulture)
            } catch { $dueUtc = '' }
        } elseif ($status -match '(?<!\d)(\d{1,2})h(?!\w)') {
            # Relative window ("24h"): anchored on the row date, never on "now" -
            # a relative deadline must not slide forward every time the panel
            # rebuilds, or an overdue item would never look overdue.
            $hrs = [int]$Matches[1]
            $rowDate = ([string]$cells[0]).Trim()
            if ($rowDate -match '^(\d{4})-(\d{2})-(\d{2})$') {
                try {
                    $dt = New-Object DateTime([int]$Matches[1], [int]$Matches[2],
                        [int]$Matches[3], 0, 0, 0, [DateTimeKind]::Local)
                    $dt = $dt.AddHours($hrs)
                    $dueTxt = $rowDate + ' + ' + $hrs + 'h'
                    $dueUtc = $dt.ToUniversalTime().ToString('yyyy-MM-ddTHH:mm:ssZ',
                        [Globalization.CultureInfo]::InvariantCulture)
                } catch { $dueUtc = '' }
            }
        }

        $st = 'dispatched'
        if ($status -match '(?i)\bopen\b') { $st = 'open' }
        if ($dueUtc -ne '' -and [DateTimeOffset]::Parse($dueUtc,
                [Globalization.CultureInfo]::InvariantCulture) -lt $now) { $r.late++ }

        [void]$out.Add([ordered]@{
            id = $id; subject = $subject; status = $st
            due_txt = $dueTxt; due_utc = $dueUtc; action = $action
        })
    }

    # Most urgent first; rows without a parsable deadline sink to the bottom
    # (they are "unknown", never "earliest").
    $sorted = @($out | Sort-Object -Property @{ Expression = {
                    $d = [string]$_.due_utc
                    if ($d -eq '') { '9999-12-31' } else { $d } } }, @{ Expression = { [string]$_.id } })
    if ($sorted.Count -gt 8) { $sorted = $sorted[0..7] }

    $r.scanned = $scanned
    $r.matched = $matched
    $r.open = $sorted.Count
    $r.rows = @($sorted)
    return $r
}

# ---------------------------------------------------------------------------
# Archive duty (queue main#59): r719 turned the one-off log sweep into a duty
# that verify.ps1 runs at most once a calendar day, but the only place that
# outcome was readable is the tick log - rewritten every ten minutes and never
# opened by a human. This reads the duty's own day stamp and ships one row:
# "did today's sweep run, how much is still archivable, when was it measured".
# Read-only, fail-soft, honest:
#  - a missing stamp means "has not run (today)", never "zero backlog"
#  - the backlog figure comes from the stamp itself (the archiver's single
#    number source); an older stamp without "remain=" ships -1, and the page
#    says "not recorded" instead of pretending zero
#  - the tick log is deliberately NOT read here: the panel is rebuilt every
#    tick, and racing the tick's own appends would be a self-inflicted flake
function Resolve-ArchiveDuty
{
    param([string]$Path)

    $r = [ordered]@{
        exists = $false; path_rel = ''; url = ''
        stamp = ''; stamp_day = ''; today = (Get-Date).ToString('yyyyMMdd')
        is_today = $false; remain = -1; ran_utc = ''
    }
    if ([string]::IsNullOrEmpty($Path)) { return $r }
    if (-not (Test-Path -LiteralPath $Path)) { return $r }

    $raw = ''
    try { $raw = [IO.File]::ReadAllText($Path, [Text.Encoding]::UTF8) } catch { return $r }
    $r.exists = $true

    $full = [IO.Path]::GetFullPath($Path)
    $rel = $full
    if ($rel.StartsWith($repoDir, [StringComparison]::OrdinalIgnoreCase)) {
        $rel = $rel.Substring($repoDir.Length)
    }
    $r.path_rel = $rel.TrimStart('\', '/').Replace('\', '/')
    $r.url = 'file:///' + $full.Replace('\', '/').Replace(' ', '%20')

    $m = [regex]::Match(($raw -replace '\s', ' '), '(\d{8})(?:\s*remain=(\d+))?')
    if ($m.Success) {
        $r.stamp = $m.Groups[1].Value
        try {
            $r.stamp_day = ([datetime]::ParseExact($r.stamp, 'yyyyMMdd',
                [Globalization.CultureInfo]::InvariantCulture)).ToString('yyyy-MM-dd')
        } catch { $r.stamp_day = '' }
        if ($m.Groups[2].Success) { $r.remain = [int]$m.Groups[2].Value }
    }
    $r.is_today = ($r.stamp -ne '' -and $r.stamp -eq $r.today)

    try {
        $r.ran_utc = (Get-Item -LiteralPath $Path -ErrorAction Stop).LastWriteTimeUtc.ToString(
            'yyyy-MM-ddTHH:mm:ssZ', [Globalization.CultureInfo]::InvariantCulture)
    } catch { }

    return $r
}

if ([string]::IsNullOrEmpty($DecisionsPath)) {
    $DecisionsPath = Join-Path $groupRoot 'docs\decisions.md'
}
$duty = Resolve-Duty -Path $DecisionsPath
$dutyJs = To-JsLiteral -Obj $duty -Label 'duty'

if ([string]::IsNullOrEmpty($ArchiveStatePath)) {
    $ArchiveStatePath = Join-Path $repoDir 'logs\.archive-duty-last-run.txt'
}
$arch = Resolve-ArchiveDuty -Path $ArchiveStatePath
$archJs = To-JsLiteral -Obj $arch -Label 'arch'

$proof = Resolve-CityProof -Root $ProofRoot
$proofJs = To-JsLiteral -Obj $proof -Label 'proof'

# Wrapped in an object: a bare one-element array would lose its brackets in
# ConvertTo-Json (PS5.1) and the page would mis-read it as a single frame.
$shots = @(Resolve-CityShots -Dir $(if ([System.IO.Path]::IsPathRooted($shotDir)) { $shotDir } else { Join-Path $repoDir $shotDir }) -Max $shotMax -Width $shotWidth -Quality $shotQuality)
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

foreach ($ph in @('__SNAPSHOT_JSON__','__FACE_JSON__','__BUILT_JSON__','__BUILTISO_JSON__','__PREV_JSON__','__HIST_JSON__','__SERIES_JSON__','__TREND_JSON__','__TICK_JSON__','__SHOTS_JSON__','__PROOF_JSON__','__DUTY_JSON__','__ARCH_JSON__','__ART_JSON__')) {
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
    '__PROOF_JSON__'    = $proofJs
    '__DUTY_JSON__'     = $dutyJs
    '__ARCH_JSON__'     = $archJs
    '__ART_JSON__'      = $artJs
}
$phRx = New-Object System.Text.RegularExpressions.Regex('__(SNAPSHOT|FACE|BUILT|BUILTISO|PREV|HIST|SERIES|TREND|TICK|SHOTS|PROOF|DUTY|ARCH|ART)_JSON__')
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

Write-Output ('PANEL OK bytes=' + $out.Length + ' zones=' + $zonesN + ' events=' + $evsN + ' snapshot_ts=' + [string]$snap.ts_utc + ' hist=' + [int]$histAll.Count + ' series=' + [int]$seriesArr.Count + ' trend=' + [int]$trendArr.Count + ' prev=' + $(if ($null -ne $prevRec) { [string]$prevRec.ts } else { 'none' }) + ' hist_ok=' + $histOk + ' art=' + [int]$artPaths + ' art_missing=' + [int]$artMiss.Count + ' tick=' + $(if ($tickExists) { [string]$tickAgeMin + 'min scan=' + $scanLines + ' rounds=' + $rounds } else { 'missing' }) + ' tickrow=' + [int]$tickOne.paths + ' tickrow_missing=' + [int]$tickOne.missing + ' shots=' + [int]$shots.Count + ' shots_inlined=' + [int]$shotsInlined + ' shots_skipped=' + [int]$(if ($null -ne $script:shotsSkipped) { $script:shotsSkipped } else { 0 }) + ' shots_unnamed=' + [int]$(if ($null -ne $script:shotsUnnamed) { $script:shotsUnnamed } else { 0 }) + ' shots_kb=' + [int][Math]::Round($shotsBytes / 1024) + ' proof_build=' + $(if ($proof.build.exists) { [string]$proof.build.exit_code } else { 'missing' }) + ' proof_soak=' + $(if ($proof.soak.exists) { 'ok' } else { 'missing' }) + ' proof_code=' + $(if ($proof.code.exists) { [string]$proof.code.sha } else { 'none' }) + ' site=' + $(if ($proof.site.ran) { [string]$proof.site.block_water_text + '%/' + $(if ($proof.site.nearest_dry_text) { [string]$proof.site.nearest_dry_text + 'm' } else { 'none' }) } else { 'missing' }) + ' site_over=' + $(if (Test-SiteOverWater -Verdict $proof.site) { '1' } else { '0' }) + ' duty=' + $(if ($duty.exists) { [string]$duty.open } else { 'missing' }) + ' duty_late=' + [int]$duty.late + ' duty_scanned=' + [int]$duty.scanned + ' arch=' + $(if (-not $arch.exists) { 'missing' } elseif ($arch.is_today) { 'today' } else { 'stale' }) + ' arch_remain=' + [int]$arch.remain + ' built=' + $built + ' path=' + $OutPath)
exit 0