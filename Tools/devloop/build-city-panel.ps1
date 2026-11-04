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
    # Internal engine state (world\world-state.json). Read-only, and ONLY for the
    # per-repo commit counts that the public snapshot does not expose (queue
    # main#131): the monotonic card can then say WHICH repo fell, not just that
    # the sum did. Absent/unreadable = the card keeps its old wording.
    [string]$StatePath = '',
    [string]$FacePath = '',
    [string]$TemplatePath = '',
    [string]$OutPath = '',
    [string]$HistoryPath = '',
    [string]$TickLogPath = '',
    [string]$ShotDir = 'qa',
    [string]$ProofRoot = '',
    [string]$DecisionsPath = '',
    # Our own receipt ledger (./HQ-FEEDBACK.md). A group order stays "dispatched"
    # on the group ledger until the group's intake flips it, and this company may
    # not write that ledger - so the ONLY closure channel we own is a receipt line
    # citing the decision id. Without this the duty card reads "N overdue" and
    # cannot tell "we did nothing" from "we replied, the ledger has not caught up".
    [string]$FeedbackPath = '',
    [string]$ArchiveStatePath = '',
    # Citation audit reading written by qa-rotation.ps1 -Record (queue main#116).
    [string]$QaCiteAuditPath = '',
    # How old the citation-audit reading may be before the page stops presenting
    # its numbers as a statement about today (queue main#119). The reading is
    # refreshed by a once-a-day duty in verify.ps1, so 24 h is the normal age and
    # 48 h means the refresh has missed at least a whole day.
    [double]$QaCiteMaxAgeHours = 48,
    # Clock injection for the age line, so a sandbox can pin it. A STRING (ISO
    # 8601, UTC) on purpose: a [datetime] argument handed to a child process loses
    # its Kind and shifts by the local offset (measured: a 120 h fixture arrived
    # as 112 h), which would make the age assertion depend on the machine's zone.
    [string]$QaCiteNowUtc = '',
    [string]$QueueDir = '',
    # Content-addressed cache for the bare-parameter census (parsing every *.ps1
    # costs ~560 ms; the answer only changes when one of those files changes).
    [string]$SimpleParamCachePath = '',
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

# Queue overdue counter (queue main#83): the self-drive queues declare deadlines
# as `due=YYYY-MM-DD` on the row itself, and this module is the ONLY place that
# turns those markers into a number. Same single-definition law as the two
# modules above - the page never recomputes "days late" of its own.
$queueDueModule = Join-Path $PSScriptRoot 'queue-due.ps1'
if (-not (Test-Path -LiteralPath $queueDueModule)) {
    Write-Output ('FAIL: queue-due.ps1 missing: ' + $queueDueModule)
    exit 1
}
. $queueDueModule

# Bare-parameter census (queue main#128, landed r795/r796): which plain
# functions take a REQUIRED path parameter that nothing validates - the shape
# that made `-QueueDir` return "open=0" instead of complaining (r792). The page
# shows that count so a regression is visible on the CEO face, not only when
# somebody remembers to run the tool.
$simpleParamModule = Join-Path $PSScriptRoot 'simple-param-census.ps1'
if (-not (Test-Path -LiteralPath $simpleParamModule)) {
    Write-Output ('FAIL: simple-param-census.ps1 missing: ' + $simpleParamModule)
    exit 1
}
. $simpleParamModule

function Fail
{
    param([string]$Msg)
    Write-Output ('FAIL: ' + $Msg)
    exit 1
}

# --- self-locate: this script sits at <repo>\Tools\devloop\ ---
$repoDir = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
if ([string]::IsNullOrEmpty($SnapPath))     { $SnapPath     = Join-Path $repoDir 'world-public\city-snapshot.json' }
if ([string]::IsNullOrEmpty($StatePath))    { $StatePath    = Join-Path $repoDir 'world\world-state.json' }
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

# --- artifact link shape (queue main#82, r744) -----------------------------
# Repo files are linked RELATIVE to the panel (world-public\city-panel.html), so
# the same HEAD rebuilt from another drive or another spelling of the same tree
# produces identical links instead of ~13 rewritten lines per tick. Group files
# keep an absolute url - they sit outside the repo, and resolve-group-root has
# already canonicalised that root. Fail-soft: no module, old behaviour.
$panelUrlModule = Join-Path $PSScriptRoot 'panel-url.ps1'
if (Test-Path -LiteralPath $panelUrlModule) { . $panelUrlModule }
$panelDir = ''
try { $panelDir = [IO.Path]::GetFullPath((Split-Path -Parent $OutPath)) } catch { $panelDir = '' }

function Get-PanelUrl
{
    param([string]$Full)
    if ([string]::IsNullOrWhiteSpace($Full)) { return '' }
    if (Get-Command New-PanelUrl -ErrorAction SilentlyContinue) {
        return (New-PanelUrl -Full $Full -PanelDir $panelDir -RepoDir $repoDir)
    }
    return ('file:///' + $Full.Replace('\', '/').Replace(' ', '%20'))
}

foreach ($p in @($SnapPath, $FacePath, $TemplatePath)) {
    if (-not (Test-Path -LiteralPath $p)) { Fail ('input missing: ' + $p) }
}

function Read-JsonFile
{
    # An omitted or mistyped path used to reach ReadAllText and surface as a
    # generic read error; name the missing file instead (queue main#128).
    param([Parameter(Mandatory = $true)][string]$Path, [string]$Label)
    if (-not (Test-Path -LiteralPath $Path)) { Fail ($Label + ' missing: ' + $Path) }
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
# Alternation is leftmost-first, so a longer extension MUST come before its own
# prefix: with `json|jsonl` a token ending in `.jsonl` matched `.json` and the
# face counted `./logs/panel-history.jsonl` as a MISSING artifact (r803 measured
# art_missing=2 on two such paths). Keep every prefix pair in that order.
$artPattern = '[A-Za-z0-9_\-./\\]+\.(?:jsonl|json|html|htm|png|jpg|jpeg|svg|md|ps1|py|js|log|txt|mp4|webm|csv|yaml|yml|asset|unity|cs|zip)'

function Resolve-ArtItems
{
    param([string]$Raw, [int]$Max = 24)
    $items = @()
    $seen = @{}
    $miss = @()
    $bare = @()
    $paths = 0
    $missN = 0
    if ([string]::IsNullOrWhiteSpace($Raw)) {
        return (New-Object PSObject -Property ([ordered]@{
            paths = 0; missing = 0; miss_names = @(); bare = 0; bare_names = @(); items = @()
        }))
    }
    $ms = [regex]::Matches($Raw, $artPattern)
    foreach ($m in $ms) {
        $tok = $m.Value
        if ([string]::IsNullOrWhiteSpace($tok)) { continue }
        $norm = $tok.Replace('\', '/')
        $isAbs = ($norm -match '^[A-Za-z]:/' -or $norm.StartsWith('//'))
        # A token with no directory separator is a bare file name, not a path
        # (queue main#75). The pattern only demanded an extension, so prose like
        # "-regress.html" became a "real path", painted art_missing=1 and turned
        # the self-check amber for a file the author never claimed existed. Face
        # lines must carry a relative path; bare names are counted and dropped,
        # even when a file with that name happens to exist somewhere.
        if (-not $isAbs -and $norm.IndexOf('/') -lt 0) {
            if (-not $seen.ContainsKey($norm)) { $seen[$norm] = $true; $bare += $norm }
            continue
        }
        if ($isAbs) { $abs = $norm }
        else { $abs = Join-Path $repoDir $norm.Replace('/', '\') }
        $exists = $false
        try { $exists = Test-Path -LiteralPath $abs } catch { $exists = $false }
        # Second home: the group tree. The face prose is allowed to name group
        # files (docs/decisions.md, cph4/evolution-ledger.md); testing them only
        # against the repo painted a red "not found" on a file that exists one
        # level up (r709, art_missing=1 on a live path).
        if (-not $exists -and -not $isAbs) {
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
            $url = Get-PanelUrl $full
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
        # Counted per MENTION, not per distinct name (r813): the page renders one
        # link (or one "未找到" mark) for every occurrence, so a line that names
        # the same file twice ships two links. Counting distinct names made the
        # builder say paths=3 while the DOM had 4 links, and r691's invariant
        # (links == paths) went red the first tick after such a face was written.
        # `miss_names` stays deduped - it is a list of files, not of mentions.
        $paths++
        if (-not $exists) {
            $missN++
            if (-not $seen.ContainsKey($norm)) { $miss += $norm }
        }
        if (-not $seen.ContainsKey($norm)) { $seen[$norm] = $true }
        if ($items.Count -ge $Max) { break }
    }
    return (New-Object PSObject -Property ([ordered]@{
        paths = [int]$paths; missing = [int]$missN; miss_names = @($miss)
        bare = [int]$bare.Count; bare_names = @($bare); items = @($items)
    }))
}

$faceKeyMap = [ordered]@{ act = 'current_activity'; art = 'artifact'; mile = 'milestone' }
$artBy = [ordered]@{}
$artItems = @()
$artMiss = @()
$artBare = @()
$artBareSeen = @{}
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
        miss_names = @($one.miss_names); bare = [int]$one.bare
        bare_names = @($one.bare_names); items = @($tagged)
    }))
    $artItems += $tagged
    $artPaths += [int]$one.paths
    $artMiss += @($one.miss_names)
    # Distinct names only: the same bare token often shows up on two lines, and
    # a WARN that lists "TECH.md, TECH.md" reads like a bug in the reporter.
    foreach ($bn in @($one.bare_names)) {
        if (-not $artBareSeen.ContainsKey([string]$bn)) {
            $artBareSeen[[string]$bn] = $true
            $artBare += [string]$bn
        }
    }
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

# Say it out loud instead of hiding it (queue main#75): a bare name is not a
# path, and the whole point of the fix is that the panel stops pretending it is.
if ($artBare.Count -gt 0) {
    Write-Output ('PANEL WARN: bare-artifact-names=' + [int]$artBare.Count + ' ignored (' + ($artBare -join ', ') + '); face lines must carry a relative path')
}

$artMeta = New-Object PSObject -Property ([ordered]@{
    paths      = [int]$artPaths
    missing    = [int]$artMiss.Count
    miss_names = @($artMiss)
    bare       = [int]$artBare.Count
    bare_names = @($artBare)
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
# Per-repo commit counts (queue main#131): commits_total is a SUM, so a drop
# tells "something went back" and nothing else. Read the internal state's
# history section and stamp it onto this round's record; a drop between two
# stamped records can then be attributed to a repo instead of guessed at.
# Missing/unparseable state = empty map = records keep the old shape (the card
# must never invent an attribution it did not measure).
$repoCommits = @{}
try {
    if (Test-Path -LiteralPath $StatePath) {
        $ws = ConvertFrom-Json ([IO.File]::ReadAllText($StatePath, [Text.Encoding]::UTF8))
        if ($null -ne $ws.history -and $null -ne $ws.history.commits_by_repo) {
            foreach ($p in $ws.history.commits_by_repo.PSObject.Properties) {
                $n = 0
                if ([int]::TryParse([string]$p.Value, [ref]$n)) { $repoCommits[[string]$p.Name] = $n }
            }
        }
    }
} catch { $repoCommits = @{} }
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
    if ($repoCommits.Count -gt 0) {
        $cr = [ordered]@{}
        foreach ($k in @($repoCommits.Keys | Sort-Object)) { $cr[[string]$k] = [int]$repoCommits[$k] }
        $rec | Add-Member -NotePropertyName cr -NotePropertyValue ([PSCustomObject]$cr)
    }

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
$roundsSeen = 0
$skipRounds = 0
$probesAll = 0
$probeBadAll = 0
$probeBadRounds = 0
$probeBadFirst = ''
$probeBadLast = ''
# Every bad round's own clock, in order (r818). r817 printed first-last with an
# en dash, which reads as "bad from 08:00 to 10:00" even when the rounds in
# between were clean - a false claim of continuity. Keep the full list here and
# let the page decide: name them all when few, otherwise first/last + the count.
$probeBadStampsAll = New-Object System.Collections.ArrayList
$probeBadStamps = @()
$lastRoundStart = -1
$lastKind = 'none'
# The last round's gate VERDICT, not just "it produced one" (r823). tick.ps1 writes
# `gate: PASS` or `gate: FAIL` from verify's exit code, and r813 collapsed both into
# the single token `gate` - so a round whose verify failed looked exactly like a
# healthy round on the page. Keep the verdict itself, and count today's red rounds
# in the same read pass the skip/probe accounts already use (no extra scan, no
# state file). Values are `ok`/`red`/'' rather than the obvious word because the c1
# red-scan matches `(gate|probe).*FAIL` case-insensitively over the tick log, and
# this panel's own summary line is part of that log.
$lastGate = ''
$gateRounds = 0
$gateRedRounds = 0
$probeTotal = 0
$probeBad = 0
$quarantined = -1
$degraded = -1
# Today's cumulative scan account (debt r818). quarantined= and the perceptor
# WARN count are per-ROUND readings; summed over every round that really ran a
# scan they answer "did anything get quarantined or degraded today". A round
# that backed off has no scan at all, so it contributes nothing; when NO round
# scanned, both totals stay -1 (unmeasured) instead of a fabricated 0.
$quarantinedAll = 0
$degradedAll = 0
$scanRounds = 0
# Distinct degraded probes (queue main#136): the sum above answers "how many
# readings", which counts the same probe once per round. Track names separately
# so the page can say "N probes over M rounds". -1 = not answerable from this
# log (an older WARN shape, or a line that could not be split) - never a
# fabricated 0, same contract as the totals (r799/r810).
$degNamesAll = @{}
$degRounds = 0
$degParseOk = $true
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
        $tickAllLines = [IO.File]::ReadAllLines($TickLogPath, [Text.Encoding]::UTF8)
        foreach ($ln in $tickAllLines) {
            if ($ln -match '^\s*scan:') { $scanLines++ }
            if ($ln -match 'round end') { $rounds++ }
        }
        # Age answers "when did the log last move", NOT "did the gate run". A
        # backoff round still starts, still exports the snapshot and still
        # rebuilds this panel, so a skipped gate looks exactly as fresh as a
        # healthy one (r813). Read the LAST round's own lines and name which of
        # the two it was; no marker at all => running (a round in flight), and a
        # log with no round at all => none. Never guess a disposition.
        for ($ti = $tickAllLines.Count - 1; $ti -ge 0; $ti--) {
            if ($tickAllLines[$ti] -match 'round start') { $lastRoundStart = $ti; break }
        }
        if ($lastRoundStart -ge 0) {
            $lastKind = 'running'
            for ($tj = $lastRoundStart; $tj -lt $tickAllLines.Count; $tj++) {
                if ($tickAllLines[$tj] -match '^\s*backoff:') { $lastKind = 'backoff'; break }
                # End-anchored: every verify output line is echoed as `gate: <line>`
                # too, so only the bare verdict counts. `gate: VERIFY WARN: ...` is
                # not a verdict and must not be read as one.
                if ($tickAllLines[$tj] -match '^\s*gate:\s+(PASS|FAIL)\s*$') {
                    $lastKind = 'gate'
                    if ($Matches[1] -eq 'PASS') { $lastGate = 'ok' } else { $lastGate = 'red' }
                }
            }
        }
        # How many rounds today were skipped (queue main#134): last_kind answers
        # only "what did the LAST round do", so two consecutive backoffs look like
        # one isolated event in history. Count per round block from its own start
        # marker to the next one; a round counts as skipped when a `backoff:` line
        # sits inside it. Same read pass as last_kind, no extra scan, no state file.
        $roundStarts = New-Object System.Collections.ArrayList
        for ($ri = 0; $ri -lt $tickAllLines.Count; $ri++) {
            if ($tickAllLines[$ri] -match 'round start') { [void]$roundStarts.Add($ri) }
        }
        $roundsSeen = [int]$roundStarts.Count
        for ($bk = 0; $bk -lt $roundStarts.Count; $bk++) {
            $from = [int]$roundStarts[$bk]
            if ($bk + 1 -lt $roundStarts.Count) { $to = [int]$roundStarts[$bk + 1] - 1 }
            else { $to = $tickAllLines.Count - 1 }
            # The round's own clock, read off its start line (queue main#135).
            # A count alone ("2 spots in 1 round") still makes the reader open
            # the 100+ round log to find WHICH round; the start line already
            # carries the timestamp, so take it here. No stamp => empty string
            # and the page omits the when-clause rather than invent one.
            $roundStamp = ''
            if ($tickAllLines[$from] -match '^\[\d{4}-\d{2}-\d{2}\s+(\d{2}:\d{2})') { $roundStamp = $Matches[1] }
            $roundBackoff = $false
            $roundGate = ''
            $roundProbes = 0
            $roundBad = 0
            $roundScan = $false
            $roundQuar = 0
            $roundDeg = -1
            $roundDegWarned = $false
            for ($bj = $from; $bj -le $to; $bj++) {
                if (-not $roundBackoff -and $tickAllLines[$bj] -match '^\s*backoff:') { $roundBackoff = $true }
                # This round's own gate verdict (r823). Same anchoring rule as the
                # last-round read above: only the bare `gate: PASS|FAIL` line is a
                # verdict, never one of the echoed verify lines. First one wins -
                # a round writes exactly one, and a later echo cannot overwrite it.
                if ($roundGate -eq '' -and $tickAllLines[$bj] -match '^\s*gate:\s+(PASS|FAIL)\s*$') {
                    if ($Matches[1] -eq 'PASS') { $roundGate = 'ok' } else { $roundGate = 'red' }
                }
                # Today's cumulative probe account (r816): the last-round reading
                # above answers only "is it fine right now". A probe that broke
                # for two rounds and healed itself leaves a page that says "26
                # all OK" and nothing else - true, and useless for "did anything
                # go wrong today". Same read pass, no extra scan, no state file.
                if ($tickAllLines[$bj] -match '^\s*scan:\s+probe \S+:\s*(\S.*)$') {
                    $roundProbes++
                    if ($Matches[1] -notmatch '^OK') { $roundBad++ }
                }
                # Same pass, same round block (debt r818): the round's own scan
                # verdict. Anchor on the "done:" line so a quarantine tally
                # echoed by something else cannot be counted twice. The WARN
                # line is only printed when the count is > 0, so a round that
                # scanned and printed no WARN contributed zero degraded probes.
                if ($tickAllLines[$bj] -match '^\s*scan:\s+perceptor v[\d.]+ done:.*quarantined=(\d+)') {
                    $roundScan = $true
                    $roundQuar += [int]$Matches[1]
                }
                if ($tickAllLines[$bj] -match '^\s*scan:\s+perceptor WARN:\s*(\d+) probe\(s\) zero-read/degraded -> (.+)$') {
                    $roundDeg = [int]$Matches[1]
                    # WHICH probes, not just how many (queue main#136). The tally
                    # is a per-round SUM, so one probe degrading in three rounds
                    # reads as "3 things went wrong today" when it was one thing.
                    # The WARN line already names each probe as `name=<reason>`,
                    # so collect the names here in the same read pass. Any line
                    # we cannot split leaves the name account at -1: a partial
                    # set would claim a dedupe it never did.
                    if ($roundDeg -gt 0) {
                        $roundDegWarned = $true
                        $parts = $Matches[2].Split(';')
                        foreach ($part in $parts) {
                            $nm = ($part.Trim())
                            $eq = $nm.IndexOf('=')
                            if ($eq -gt 0) { $nm = $nm.Substring(0, $eq).Trim() }
                            if ($nm -eq '') { $degParseOk = $false }
                            else { $degNamesAll[$nm] = $true }
                        }
                        if ($parts.Count -ne $roundDeg) { $degParseOk = $false }
                    }
                } elseif ($tickAllLines[$bj] -match '^\s*scan:\s+perceptor WARN:\s*(\d+) probe') {
                    # Older WARN shape (no name list): keep the sum, refuse to
                    # claim a dedupe that the log cannot support.
                    $roundDeg = [int]$Matches[1]
                    if ($roundDeg -gt 0) { $roundDegWarned = $true; $degParseOk = $false }
                }
            }
            if ($roundBackoff) { $skipRounds++ }
            # Today's gate account (r823): a backed-off round produces no verdict
            # at all, so it neither counts as green nor as red - it is simply not
            # measured, exactly like the probe account above.
            if ($roundGate -ne '') {
                $gateRounds++
                if ($roundGate -eq 'red') { $gateRedRounds++ }
            }
            if ($roundScan) {
                $scanRounds++
                $quarantinedAll += $roundQuar
                if ($roundDeg -ge 0) { $degradedAll += $roundDeg }
            }
            # Rounds that degraded at least one probe, counted once each so the
            # page can say "in M rounds" rather than re-deriving it from the sum.
            if ($roundDegWarned) { $degRounds++ }
            $probesAll += $roundProbes
            $probeBadAll += $roundBad
            if ($roundBad -gt 0) {
                $probeBadRounds++
                if ($roundStamp -ne '') {
                    if ($probeBadFirst -eq '') { $probeBadFirst = $roundStamp }
                    $probeBadLast = $roundStamp
                    [void]$probeBadStampsAll.Add($roundStamp)
                }
            }
        }
        # Name the bad rounds themselves (r818). Only when EVERY bad round
        # carries a stamp - a partial list would let the page claim "these are
        # the rounds" while silently dropping the ones the log never stamped.
        # Up to three are named individually; beyond that only the ends, because
        # a long list would push the sentence off a 390px screen.
        if ($probeBadRounds -gt 0 -and $probeBadStampsAll.Count -eq $probeBadRounds) {
            if ($probeBadStampsAll.Count -le 3) {
                $probeBadStamps = @($probeBadStampsAll)
            } else {
                $probeBadStamps = @($probeBadStampsAll[0], $probeBadStampsAll[$probeBadStampsAll.Count - 1])
            }
        }
        # Unmeasured is not zero (r799/r810 precedent): no round scanned today =>
        # no reading to sum, so both totals stay -1 and the page says nothing.
        if ($scanRounds -eq 0) { $quarantinedAll = -1; $degradedAll = -1 }
        # Distinct probe count, only when every round's WARN line could be split
        # into names (queue main#136). A partial name set would let the page say
        # "1 probe" while a second one stays invisible, so the half-answer is
        # withheld entirely and the template falls back to the raw sum.
        $degProbes = -1
        $degNames = @()
        if ($scanRounds -gt 0 -and $degParseOk) {
            $degProbes = [int]$degNamesAll.Count
            $degNames = @($degNamesAll.Keys | Sort-Object)
            if ($degNames.Count -gt 3) { $degNames = @($degNames[0], $degNames[1], $degNames[2]) }
        }
        # What the last round's scan actually covered (r815): the row above prints
        # "scan N lines", which counts LOG LINES - a probe that crashed or degraded
        # still leaves a perfectly healthy looking page. Count that round's own
        # `probe <name>: <status>` lines plus the scan's own quarantined=/degraded=
        # tallies. A round that backed off has no scan at all => probes=0 and both
        # tallies stay -1, which the page renders as silence, never as a zero.
        if ($lastRoundStart -ge 0) {
            for ($pj = $lastRoundStart; $pj -lt $tickAllLines.Count; $pj++) {
                if ($tickAllLines[$pj] -match '^\s*scan:\s+probe \S+:\s*(\S.*)$') {
                    $probeTotal++
                    if ($Matches[1] -notmatch '^OK') { $probeBad++ }
                }
                if ($tickAllLines[$pj] -match 'quarantined=(\d+)') { $quarantined = [int]$Matches[1] }
                if ($tickAllLines[$pj] -match 'perceptor WARN:\s*(\d+) probe') { $degraded = [int]$Matches[1] }
            }
            # scan.ps1 only prints that WARN line when the count is > 0, so for a
            # round that really scanned, a missing line means zero - not unknown.
            if ($degraded -lt 0 -and $probeTotal -gt 0) { $degraded = 0 }
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
    rounds_seen = [int]$roundsSeen
    skip_rounds = [int]$skipRounds
    probes     = [int]$probeTotal
    probes_bad = [int]$probeBad
    probes_all = [int]$probesAll
    probes_bad_all = [int]$probeBadAll
    probe_bad_rounds = [int]$probeBadRounds
    probe_bad_first = [string]$probeBadFirst
    probe_bad_last = [string]$probeBadLast
    probe_bad_stamps = @($probeBadStamps)
    quarantined = [int]$quarantined
    degraded   = [int]$degraded
    quarantined_all = [int]$quarantinedAll
    degraded_all    = [int]$degradedAll
    degraded_probes = [int]$degProbes
    degraded_rounds = [int]$degRounds
    degraded_names  = @($degNames)
    last_kind  = [string]$lastKind
    last_gate  = [string]$lastGate
    gate_rounds = [int]$gateRounds
    gate_red_rounds = [int]$gateRedRounds
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
    # Missing or unreadable candidate = no picture, not a crash: the page then
    # prints a plain link. Probing existence first keeps the exception path for
    # real decode faults (queue main#128).
    if ([string]::IsNullOrWhiteSpace($Path) -or -not (Test-Path -LiteralPath $Path)) { return $res }
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
    $script:shotsSha = 0
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
        $url = Get-PanelUrl $full
        # Version binding (queue main#137). The capture tool writes a sidecar
        # named after the capture session (`city3d-shots-<stamp>-<who>` minus
        # the trailing view slug). Only that file can tell which code revision
        # the frame shows; a frame without one keeps sha='' and the page falls
        # back to the time-only sentence instead of guessing a version.
        $sha = ''
        $session = [System.IO.Path]::GetFileNameWithoutExtension($c.Name)
        $dash = $session.LastIndexOf('-')
        if ($dash -gt 0) { $session = $session.Substring(0, $dash) }
        if (-not [string]::IsNullOrWhiteSpace($session)) {
            $provPath = Join-Path $c.DirectoryName ($session + '.provenance.json')
            if (Test-Path -LiteralPath $provPath) {
                try {
                    $provRaw = Get-Content -LiteralPath $provPath -Raw -Encoding UTF8
                    if (-not [string]::IsNullOrWhiteSpace($provRaw)) {
                        $rawProv = [string]($provRaw | ConvertFrom-Json).sha
                        if ($rawProv -match '^[0-9a-fA-F]{6,40}$') {
                            $sha = $rawProv.ToLowerInvariant()
                            $script:shotsSha++
                        }
                    }
                } catch { $sha = '' }
            }
        }
        $out += (New-Object PSObject -Property ([ordered]@{
            name     = [string]$c.Name
            rel      = [string]$rel
            url      = [string]$url
            shot_utc = $c.LastWriteTimeUtc.ToString('yyyy-MM-ddTHH:mm:ssZ',
                [Globalization.CultureInfo]::InvariantCulture)
            sha      = [string]$sha
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
        $r.url = Get-PanelUrl $full
    } catch { }
    return $r
}

function Resolve-CityProof
{
    # Mandatory: an omitted root used to produce an all-empty proof block that
    # read exactly like "nothing has been built yet" (queue main#128).
    param([Parameter(Mandatory = $true)][string]$Root)

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
        props_in_road = -1; props_in_road_text = 'n/a'
        # main#71: street camera prop coverage, parsed from r2-shots.md by the
        # same module verify uses. 'n/a' = no report line, never a clean zero.
        prop_cover = -1.0; prop_cover_text = 'n/a'; prop_cover_high = $false
        # main#79: the scale study's A2 advice (qa\site\r2-scale-*.md), parsed
        # by the same module verify uses. 'n/a' = no study on record.
        scale_found = $false; scale_a2_text = 'n/a'; scale_a2_area_text = 'n/a'
        scale_a3_text = 'n/a'; scale_a3_area_text = 'n/a'
        verdict = ''; over_water = $false; reason = 'skipped'
    }
    if (-not $SiteSkip) {
        try {
            $sv = Get-SiteVerdict -Root $Root
            foreach ($k in @('ran','block_water','block_water_text','dry_candidates',
                             'nearest_dry_m','nearest_dry_text','props_in_road','props_in_road_text',
                             'verdict','over_water','reason')) {
                $site[$k] = $sv[$k]
            }
            $pose = Get-StreetPose -Root $Root
            foreach ($k in @('prop_cover','prop_cover_text','prop_cover_high')) {
                $site[$k] = $pose[$k]
            }
            $scale = Get-ScaleStudy -Root $Root
            $site.scale_found = $scale.found
            $site.scale_a2_text = $scale.a2_text
            $site.scale_a2_area_text = $scale.a2_area_text
            $site.scale_a3_text = $scale.a3_text
            $site.scale_a3_area_text = $scale.a3_area_text
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
#
# Duty receipts: the group ledger keeps an order "dispatched" until the group's
# own intake flips it, and this repo may not write that ledger (D-20260924-05) -
# our only closure channel is a receipt line in ./HQ-FEEDBACK.md citing the
# decision id. So "3 overdue" on the duty card used to be indistinguishable from
# "we ignored them", even when the receipts were already filed. Same shape as
# r709's undated deadline: a number that cannot be read correctly is a lie.
#  - only lines carrying BOTH an F-<date>-<nn> and a D-<date>-<nn> count as a
#    receipt; a bare mention of a decision id is not a reply to it.
#  - FIRST receipt wins: the earliest reply is the one that discharged it, and
#    later rows are usually evidence, not new closure.
#  - missing file => exists=false and the page says "回执未知", never "未回执"
#    (an unreadable ledger is unknown, not zero).
function Resolve-DutyReceipts
{
    param([string]$Path)

    $r = [ordered]@{ exists = $false; path_rel = ''; count = 0; index = @{} }
    if ([string]::IsNullOrEmpty($Path)) { return $r }
    if (-not (Test-Path -LiteralPath $Path)) { return $r }

    $raw = ''
    try { $raw = [IO.File]::ReadAllText($Path, [Text.Encoding]::UTF8) }
    catch { return $r }
    $r.exists = $true

    $full = [IO.Path]::GetFullPath($Path)
    $rel = $full
    if ($rel.StartsWith($repoDir, [StringComparison]::OrdinalIgnoreCase)) {
        $rel = $rel.Substring($repoDir.Length)
    }
    $r.path_rel = $rel.TrimStart('\', '/').Replace('\', '/')

    $idx = @{}
    foreach ($ln in ($raw -split "`r?`n")) {
        $s = $ln.Trim()
        $mF = [regex]::Match($s, 'F-20\d{6}-\d{2}')
        if (-not $mF.Success) { continue }
        foreach ($mD in [regex]::Matches($s, 'D-20\d{6}-\d{2}')) {
            if (-not $idx.ContainsKey($mD.Value)) { $idx[$mD.Value] = $mF.Value }
        }
    }
    $r.index = $idx
    $r.count = $idx.Count
    return $r
}

function Resolve-Duty
{
    param([string]$Path, [string]$Feedback)

    $r = [ordered]@{
        exists = $false; path_rel = ''; url = ''; as_of_utc = ''
        scanned = 0; matched = 0; open = 0; late = 0; rows = @()
        receipts_exists = $false; receipts_path_rel = ''; receipts_count = 0; receipted = 0
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
    $r.url = Get-PanelUrl $full

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

    # Our receipts (see Resolve-DutyReceipts) are indexed once per build.
    $rec = Resolve-DutyReceipts -Path $Feedback
    $r.receipts_exists = $rec.exists
    $r.receipts_path_rel = $rec.path_rel
    $r.receipts_count = $rec.count

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

        # Did WE already reply to this order? Unknown (no receipt file) stays
        # empty so the page can say "回执未知" instead of accusing us.
        $receiptF = ''
        if ($id -ne '' -and $rec.index.ContainsKey($id)) { $receiptF = [string]$rec.index[$id] }

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
            receipt_f = $receiptF
        })
        if ($receiptF -ne '') { $r.receipted++ }
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
    $r.url = Get-PanelUrl $full

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

# ---------------------------------------------------------------------------
# Citation audit (queue main#116): qa-rotation.ps1 can now say whether a frozen
# citation still points at something current, but that reading costs ~2.4 s
# (it indexes 383 tracked documents) and the panel is rebuilt every ten minutes.
# So the tool writes the numbers once with its own UTC stamp (-Record) and this
# reads them back: the page shows the reading WITH its age. Honest edges: a
# missing record means "not recorded", never "zero stale"; a malformed record
# means "unreadable", never zero; nothing on this page rotates a file.
function Resolve-QaCiteAudit
{
    param(
        [string]$Path,
        [double]$MaxAgeHours = 48,
        [datetime]$Now = [DateTime]::MinValue
    )

    $r = [ordered]@{
        exists = $false; path_rel = ''; url = ''; error = ''
        utc = ''; images = -1; cited = -1; stale_days = -1
        stale_cited = -1; superseded_cited = -1; newer_sibling_cited = -1
        superseded_by_group = ''
        age_hours = -1.0; max_age_hours = $MaxAgeHours; overdue = $false
    }
    if ([string]::IsNullOrEmpty($Path)) { return $r }
    if (-not (Test-Path -LiteralPath $Path)) { return $r }

    $raw = ''
    try { $raw = [IO.File]::ReadAllText($Path, [Text.Encoding]::UTF8) } catch {
        $r.error = 'unreadable'
        return $r
    }
    $o = $null
    try { $o = $raw | ConvertFrom-Json } catch { $o = $null }
    if ($null -eq $o) { $r.error = 'unparsable'; return $r }

    $r.exists = $true
    $r.utc = [string]$o.utc
    foreach ($k in @('images', 'cited', 'stale_days', 'stale_cited', 'superseded_cited', 'newer_sibling_cited')) {
        $v = $o.PSObject.Properties[$k]
        if ($null -ne $v -and $null -ne $v.Value) { $r[$k] = [int]$v.Value }
    }
    # Group breakdown of the superseded count ("panel:61,city3d:11"). A string,
    # not a number: the record is the single source and the page only renders it.
    $vb = $o.PSObject.Properties['superseded_by_group']
    if ($null -ne $vb -and $null -ne $vb.Value) { $r.superseded_by_group = [string]$vb.Value }

    # How old the reading is (queue main#119). This is the one part of the row
    # that decides whether the numbers above are a statement about today: the
    # refresh only runs once a day, so a reading far past one day means the duty
    # stopped. Still a reading, never a rotation - nothing moves here.
    $t = [DateTime]::MinValue
    $parsed = $false
    if ($r.utc) {
        try {
            $t = [DateTime]::Parse($r.utc, [Globalization.CultureInfo]::InvariantCulture)
            $parsed = $true
        } catch { $parsed = $false }
    }
    if ($parsed) {
        if ($t.Kind -eq [DateTimeKind]::Unspecified) { $t = [DateTime]::SpecifyKind($t, [DateTimeKind]::Utc) }
        if ($Now -eq [DateTime]::MinValue) { $Now = [DateTime]::UtcNow }
        $age = (($Now).ToUniversalTime() - $t.ToUniversalTime()).TotalHours
        if ($age -lt 0) { $age = 0.0 }
        $r.age_hours = [math]::Round($age, 2)
        $r.overdue = ($r.age_hours -gt $MaxAgeHours)
    }

    $full = [IO.Path]::GetFullPath($Path)
    $rel = $full
    if ($rel.StartsWith($repoDir, [StringComparison]::OrdinalIgnoreCase)) {
        $rel = $rel.Substring($repoDir.Length)
    }
    $r.path_rel = $rel.TrimStart('\', '/').Replace('\', '/')
    $r.url = Get-PanelUrl $full
    return $r
}

if ([string]::IsNullOrEmpty($DecisionsPath)) {
    $DecisionsPath = Join-Path $groupRoot 'docs\decisions.md'
}

if ([string]::IsNullOrEmpty($FeedbackPath)) {
    $FeedbackPath = Join-Path $repoDir 'HQ-FEEDBACK.md'
}

if ([string]::IsNullOrEmpty($QaCiteAuditPath)) {
    $QaCiteAuditPath = Join-Path $repoDir 'logs\.qa-cite-audit.json'
}
$qaCiteNow = [DateTime]::MinValue
if (-not [string]::IsNullOrWhiteSpace($QaCiteNowUtc)) {
    try {
        $qaCiteNow = [DateTime]::Parse($QaCiteNowUtc, [Globalization.CultureInfo]::InvariantCulture,
            [Globalization.DateTimeStyles]::AdjustToUniversal -bor [Globalization.DateTimeStyles]::AssumeUniversal)
    } catch {
        $qaCiteNow = [DateTime]::MinValue
    }
}
$qacite = Resolve-QaCiteAudit -Path $QaCiteAuditPath -MaxAgeHours $QaCiteMaxAgeHours -Now $qaCiteNow
$qaciteJs = To-JsLiteral -Obj $qacite -Label 'qacite'

if ([string]::IsNullOrEmpty($SimpleParamCachePath)) {
    $SimpleParamCachePath = Join-Path $repoDir 'logs\.simple-param-census-cache.json'
}
$sparam = Get-SimpleParamCensusCached -Root $PSScriptRoot -RepoDir $repoDir `
    -CachePath $SimpleParamCachePath -ModulePath $simpleParamModule
$sparamJs = To-JsLiteral -Obj $sparam -Label 'sparam'

$duty = Resolve-Duty -Path $DecisionsPath -Feedback $FeedbackPath
$dutyJs = To-JsLiteral -Obj $duty -Label 'duty'

if ([string]::IsNullOrEmpty($ArchiveStatePath)) {
    $ArchiveStatePath = Join-Path $repoDir 'logs\.archive-duty-last-run.txt'
}
$arch = Resolve-ArchiveDuty -Path $ArchiveStatePath
$archJs = To-JsLiteral -Obj $arch -Label 'arch'

if ([string]::IsNullOrEmpty($QueueDir)) {
    $QueueDir = Join-Path $repoDir 'state\queue'
} elseif (-not [System.IO.Path]::IsPathRooted($QueueDir)) {
    # A relative queue dir has to resolve against the repo, not against whatever
    # cwd the builder was started from (r766's trap, same shape): otherwise the
    # shipped dir_rel comes out absolute and the same tree rebuilt from another
    # cwd names a different path for the same missing directory.
    $QueueDir = Join-Path $repoDir $QueueDir
}
$qdue = Get-QueueDue -Dir $QueueDir -RepoRoot $repoDir
$qdueJs = To-JsLiteral -Obj $qdue -Label 'qdue'

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

foreach ($ph in @('__SNAPSHOT_JSON__','__FACE_JSON__','__BUILT_JSON__','__BUILTISO_JSON__','__PREV_JSON__','__HIST_JSON__','__SERIES_JSON__','__TREND_JSON__','__TICK_JSON__','__SHOTS_JSON__','__PROOF_JSON__','__DUTY_JSON__','__ARCH_JSON__','__QACITE_JSON__','__QUEUE_JSON__','__ART_JSON__')) {
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
    '__QACITE_JSON__'   = $qaciteJs
    '__SPARAM_JSON__'   = $sparamJs
    '__QUEUE_JSON__'    = $qdueJs
    '__ART_JSON__'      = $artJs
}
$phRx = New-Object System.Text.RegularExpressions.Regex('__(SNAPSHOT|FACE|BUILT|BUILTISO|PREV|HIST|SERIES|TREND|TICK|SHOTS|PROOF|DUTY|ARCH|QACITE|SPARAM|QUEUE|ART)_JSON__')
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

# 队列「在队」数的构成（machine form; the page renders the human form from
# QUEUE.by_file). `open` sums three queues whose rows mean very different
# things - the main line's handful of slots and the research corpus add up to
# one number that reads as "N things pending". `missing` when the directory is
# unreadable, `none` when it exists but holds no data rows - never an empty
# string standing in for either.
$qdueSplit = $(if ($qdue.exists) { 'none' } else { 'missing' })
if ($qdue.exists) {
    $parts = @(@($qdue.by_file) | ForEach-Object { [string]$_.name + ':' + [string]$_.open })
    if ($parts.Count -gt 0) { $qdueSplit = ($parts -join ',') }
}

Write-Output ('PANEL OK bytes=' + $out.Length + ' zones=' + $zonesN + ' events=' + $evsN + ' snapshot_ts=' + [string]$snap.ts_utc + ' hist=' + [int]$histAll.Count + ' series=' + [int]$seriesArr.Count + ' trend=' + [int]$trendArr.Count + ' prev=' + $(if ($null -ne $prevRec) { [string]$prevRec.ts } else { 'none' }) + ' hist_ok=' + $histOk + ' art=' + [int]$artPaths + ' art_missing=' + [int]$artMiss.Count + ' art_bare=' + [int]$artBare.Count + ' tick=' + $(if ($tickExists) { [string]$tickAgeMin + 'min scan=' + $scanLines + ' rounds=' + $rounds + ' last=' + $lastKind + ' last_gate=' + $(if ([string]::IsNullOrEmpty($lastGate)) { 'none' } else { [string]$lastGate }) + ' gate_red=' + [int]$gateRedRounds + '/' + [int]$gateRounds + ' skip=' + [int]$skipRounds + '/' + [int]$roundsSeen + ' probes=' + [int]$probeTotal + ' probes_bad=' + [int]$probeBad + ' probes_all=' + [int]$probesAll + ' probes_bad_all=' + [int]$probeBadAll + ' probe_bad_rounds=' + [int]$probeBadRounds + ' probe_bad_first=' + $(if ([string]::IsNullOrEmpty($probeBadFirst)) { 'none' } else { [string]$probeBadFirst }) + ' probe_bad_last=' + $(if ([string]::IsNullOrEmpty($probeBadLast)) { 'none' } else { [string]$probeBadLast }) + ' probe_bad_stamps=' + $(if ($probeBadStamps.Count -eq 0) { 'none' } else { ($probeBadStamps -join ',') }) + ' quarantined=' + [int]$quarantined + ' degraded=' + [int]$degraded + ' quarantined_all=' + [int]$quarantinedAll + ' degraded_all=' + [int]$degradedAll + ' degraded_probes=' + [int]$degProbes + ' degraded_rounds=' + [int]$degRounds } else { 'missing' }) + ' tickrow=' + [int]$tickOne.paths + ' tickrow_missing=' + [int]$tickOne.missing + ' shots=' + [int]$shots.Count + ' shots_inlined=' + [int]$shotsInlined + ' shots_skipped=' + [int]$(if ($null -ne $script:shotsSkipped) { $script:shotsSkipped } else { 0 }) + ' shots_unnamed=' + [int]$(if ($null -ne $script:shotsUnnamed) { $script:shotsUnnamed } else { 0 }) + ' shots_kb=' + [int][Math]::Round($shotsBytes / 1024) + ' shots_sha=' + [int]$(if ($null -ne $script:shotsSha) { $script:shotsSha } else { 0 }) + ' proof_build=' + $(if ($proof.build.exists) { [string]$proof.build.exit_code } else { 'missing' }) + ' proof_soak=' + $(if ($proof.soak.exists) { 'ok' } else { 'missing' }) + ' proof_code=' + $(if ($proof.code.exists) { [string]$proof.code.sha } else { 'none' }) + ' site=' + $(if ($proof.site.ran) { [string]$proof.site.block_water_text + '%/' + $(if ($proof.site.nearest_dry_text) { [string]$proof.site.nearest_dry_text + 'm' } else { 'none' }) } else { 'missing' }) + ' site_over=' + $(if (Test-SiteOverWater -Verdict $proof.site) { '1' } else { '0' }) + ' site_props=' + [string]$proof.site.props_in_road_text + ' site_scale=' + [string]$proof.site.scale_a2_text + '/' + [string]$proof.site.scale_a2_area_text + ' duty=' + $(if ($duty.exists) { [string]$duty.open } else { 'missing' }) + ' duty_late=' + [int]$duty.late + ' duty_scanned=' + [int]$duty.scanned + ' duty_receipted=' + [int]$duty.receipted + ' duty_receipts=' + $(if ($duty.receipts_exists) { [string]$duty.receipts_count } else { 'missing' }) + ' arch=' + $(if (-not $arch.exists) { 'missing' } elseif ($arch.is_today) { 'today' } else { 'stale' }) + ' arch_remain=' + [int]$arch.remain + ' qacite=' + $(if ($qacite.exists) { 'ok' } elseif ($qacite.error) { $qacite.error } else { 'missing' }) + ' qacite_stale=' + $(if ($qacite.exists) { [string]$qacite.stale_cited } else { 'missing' }) + ' qacite_cited=' + $(if ($qacite.exists) { [string]$qacite.cited } else { 'missing' }) + ' qacite_age=' + $(if ($qacite.exists) { [string]$qacite.age_hours } else { 'missing' }) + ' qacite_overdue=' + $(if ($qacite.exists) { if ($qacite.overdue) { '1' } else { '0' } } else { 'missing' }) + ' sparam_risky=' + $(if ($sparam.reason -eq 'no-dir') { 'missing' } else { [string]$sparam.risky }) + ' sparam_cached=' + $(if ($sparam.cached) { '1' } else { '0' }) + ' sparam_note=' + $(if ([string]::IsNullOrEmpty($sparam.reason)) { 'none' } else { $sparam.reason }) + ' qdue=' + $(if ($qdue.exists) { [string]$qdue.late } else { 'missing' }) + ' qdue_note=' + $(if ([string]::IsNullOrEmpty($qdue.note)) { 'none' } else { [string]$qdue.note }) + ' qdue_bad=' + $(if ($qdue.exists) { [string]$qdue.bad } else { 'missing' }) + ' qdue_code=' + $(if ($qdue.exists) { [string]$qdue.code } else { 'missing' }) + ' qdue_long=' + $(if ($qdue.exists) { [string]$qdue.long } else { 'missing' }) + ' qdue_longmax=' + $(if ($qdue.exists) { [string]$qdue.long_max } else { 'missing' }) + ' qdue_dupe=' + $(if ($qdue.exists) { [string]$qdue.dupe } else { 'missing' }) + ' qdue_dupe_rows=' + $(if ($qdue.exists) { [string]$qdue.dupe_rows } else { 'missing' }) + ' qdue_split=' + $qdueSplit + ' qdue_next=' + $(if (-not $qdue.exists) { 'missing' } elseif ([string]::IsNullOrEmpty([string]$qdue.next_due)) { 'none' } else { [string]$qdue.next_due + '/' + [string]$qdue.next_days_left + 'd/#' + [string]$qdue.next_id }) + ' qdue_max=' + [int]$qdue.max_days + ' qdue_open=' + [int]$qdue.open + ' qdue_dated=' + [int]$qdue.dated + ' built=' + $built + ' path=' + $OutPath)
exit 0