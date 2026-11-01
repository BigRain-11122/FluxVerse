# queue-due.ps1 - machine-visible overdue count for the self-drive queues
# (queue main#83).
# ---------------------------------------------------------------------------
# Why: queue rows carry real deadlines, but they lived as free prose inside the
# remark cell ("10-27 due", "deadline 10-19, 13 days late"). main#8 and main#23
# only surfaced 13 and 5 days AFTER they were due, because nothing machine-read
# them. The fix is not "write the number by hand" (that is a lie with a delay):
# a row declares its deadline ONCE as a machine marker `due=YYYY-MM-DD`, and
# this module counts what is actually late.
#
# Contract:
#  - a row is a table data row whose FIRST cell is a plain integer id
#  - a struck-through row (`~~...~~`, the queue's own "closed" convention) is
#    NOT work and is never counted
#  - no `due=` marker  -> the row has no deadline (not "on time", just undated)
#  - `due=` that does not parse (e.g. due=2026-13-45) -> dated, but never late:
#    an unreadable deadline is unknown, not satisfied
#  - days late is calendar days against the caller's "today", so a test can
#    pin the clock instead of sleeping
#  - a `due` marker written in any other shape is BAD, not "undated" (main#85):
#    before this, `due=2026-1-5`, `due: 2026-01-05`, `Due=2026-01-05`,
#    `due 2027-06-30` and `due=2026-13-45` all fell through the strict match and
#    the row silently became "no deadline" - the same lie that let main#8 sit
#    13 days late. Bad markers are counted per token with a reason
#    (key/sep/shape/calendar) and reported, never silently dropped.
#    Not a marker, therefore not counted: a bare word with no value (prose such
#    as "no due= marker"), a bare word followed by non-date prose ("due to"),
#    and the literal format template `due=YYYY-MM-DD`.
#  - WHERE a marker may be written (main#87): the remark cell, i.e. the LAST
#    cell of the row, is the only declaration cell. Before this, the whole row
#    was scanned, so an open row whose subject cell described a past bug
#    ("fix the due=2026-1-5 case") accused itself: r747 counted 5 such hits on
#    its own main#85 row and they only vanished when that row was struck.
#    Prose is ABOUT markers; the remark cell is where one is MADE.
#  - QUOTATION vs DECLARATION (main#90). r749 still reported a strict valid
#    `due=YYYY-MM-DD` sitting in another cell as bad (`reason=cell`) and still
#    read it as that row's deadline, so a row whose prose merely POINTS at
#    another row's date ("see the due=2026-12-01 row") carried a deadline it
#    never had. Two rules close that:
#      a) inline code (`...` spans) is a citation, never a marker - the repo
#         writes examples and templates in backticks;
#      b) outside the remark cell a marker only declares if the cell is
#         ESSENTIALLY JUST THAT MARKER (nothing left once decoration is
#         stripped). Prose about a date declares nothing and is not bad; a
#         lone date sitting in the wrong cell is still reported as `cell`
#         (that is a real misplacement the next reader must fix).
#    Fail-closed on the other side: an unpaired backtick does not swallow the
#    rest of a cell - only paired spans are masked.
#  - QUOTED DEADLINES ARE COUNTED, NOT JUDGED (main#101). Rule (a) above means a
#    real deadline written inside backticks becomes invisible: it neither dates
#    the row nor reports as bad - it just disappears, which is the opposite of
#    main#85's "never silently drop a deadline". Counting it as bad would accuse
#    every row that shows the format template, so the fix is a read-only census:
#    `code` = number of STRICT (due=YYYY-MM-DD, real calendar day) markers hidden
#    inside a paired backtick span in the REMARK cell. Zero is the normal state;
#    a non-zero number is not a verdict, it is the queue saying "these dates are
#    quoted, look at them yourself". Quoted markers in other cells stay silent -
#    they are citations by construction, and every doc row would be a hit.
#  - ROW WIDTH (main#110). Nothing watched how LONG a row was, so the 45,413
#    character monster that r773 had to split could grow back one "let me append
#    one more sentence" at a time, and the only machine that would ever notice is
#    the trailing-pipe check - at the very end, after the damage. A row longer
#    than MaxRowChars (default 3000 = about three screens; deliberately far below
#    45,413 so growth gets caught early, not at the wall) is counted in `long`
#    and named with its character count. `long` is NOT `bad`: a long row is a
#    structural debt (one row is supposed to be one item), not a mis-written
#    marker, so the two accounts stay separate. Closed (struck) rows are counted
#    too and carry `closed=true` - a struck 45 KB row still breaks the table.
#  - DUPLICATE IDS (main#112). Ids are numbered by hand, and a collision leaves
#    no trace: r774 saw two `#110` rows, and the closed one's "already shipped"
#    reading silently vouched for the open one. This module now counts, PER FILE
#    (the three queues number independently, so main#112 and tech#16 are not a
#    collision), every id that appears more than once: `dupe` = number of such
#    ids, `dupe_rows` = how many rows they span, `dupe_items` = one entry per row
#    of every duplicated group ({id,file,line,closed}, `line` is 1-based within
#    the file, so a reader can jump straight to it). Only DATA rows count (the
#    same shape test as every other account: a `|`-led row whose first cell is a
#    plain integer) - an example table pasted into prose is not the queue.
#    `dupe` is NOT `bad` and NOT `long`: a duplicate id is a numbering debt, not a
#    mis-written marker and not an overlong row, so it keeps its own account and
#    never turns the gate red.
#  - WHICH CELL IS LAST (main#102). "The remark cell is the last cell" assumed a
#    trailing `|`, so a row that forgot it had its marker judged against the
#    POINTER cell and the remark cell was never scanned - silently (main#100
#    carried a deadline for days under that bug). The last cell is now chosen by
#    the row's own shape: with a trailing `|` it is the second-to-last split
#    element, without one it is the last. A missing trailing `|` is still a
#    malformed row, so it is reported as bad with reason `row` (token
#    `missing-trailing-pipe`) - visible on the panel, never a silent read.
# Read-only, fail-soft: a missing/empty directory ships exists=false and the
# page says so instead of printing a comfortable zero.
# ASCII-only (PS 5.1 GBK law): the CJK rows live in the UTF-8 queue files.

function Test-DueValueShape([string]$Value)
{
    if ($Value -notmatch '^\d{4}-\d{2}-\d{2}$') { return $false }
    try { $null = [datetime]::new([int]$Value.Substring(0, 4), [int]$Value.Substring(5, 2),
            [int]$Value.Substring(8, 2)) } catch { return $false }
    return $true
}

# Inline code is a citation, not a declaration (main#90): mask every PAIRED
# `...` span with spaces. Masking (not deleting) keeps the string length, so a
# regex match index here still maps to the same cell of the un-masked row.
# An unpaired backtick is left as-is: a stray quote must not be able to hide a
# real marker for the rest of the cell.
function Hide-InlineCode([string]$Text)
{
    if ([string]::IsNullOrEmpty($Text)) { return '' }
    $rx = New-Object System.Text.RegularExpressions.Regex('`[^`]*`')
    $ms = $rx.Matches($Text)
    if ($ms.Count -eq 0) { return $Text }
    $sb = New-Object System.Text.StringBuilder
    $pos = 0
    foreach ($m in $ms) {
        if ($m.Index -gt $pos) { $null = $sb.Append($Text.Substring($pos, $m.Index - $pos)) }
        $null = $sb.Append((' ' * $m.Length))
        $pos = $m.Index + $m.Length
    }
    if ($pos -lt $Text.Length) { $null = $sb.Append($Text.Substring($pos)) }
    return $sb.ToString()
}

# Does this cell declare the marker, or merely mention it? A declaration cell
# holds nothing but the marker and its markdown decoration; anything else is
# prose ABOUT some date (main#90 rule b).
function Test-CellDeclaresMarker([string]$Cell, [string]$Marker)
{
    if ([string]::IsNullOrEmpty($Cell)) { return $false }
    $rest = $Cell
    if (-not [string]::IsNullOrEmpty($Marker)) { $rest = $Cell.Replace($Marker, ' ') }
    $rest = $rest -replace '[`\*_~\-\.\,\:\;\(\)\[\]\s]', ''
    return ($rest.Length -eq 0)
}

function Get-QueueDueBadTokens
{
    param([string]$Text)

    $out = New-Object System.Collections.ArrayList
    if ([string]::IsNullOrEmpty($Text)) { return @() }
    # Backticked examples are quotations, never markers (main#90 rule a).
    $Text = Hide-InlineCode $Text
    # "due" as its own word (not qdue_*, not overdue), then an optional
    # separator and a value. The value class is deliberately ASCII-only: a due
    # value can never be CJK, and stopping at the first CJK glyph is what keeps
    # `due=2026-10-18(prose)` from swallowing the rest of the cell (first live
    # run read a whole CJK sentence as the token and reported a false bad).
    $rx = New-Object System.Text.RegularExpressions.Regex(
        '(?<![A-Za-z0-9_])(?<key>[Dd][Uu][Ee])(?![A-Za-z0-9_])\s*(?<sep>[=:]?)\s*(?<val>[A-Za-z0-9:/\-_+]+)')
    foreach ($m in $rx.Matches($Text)) {
        $key = $m.Groups['key'].Value
        $sep = $m.Groups['sep'].Value
        $val = $m.Groups['val'].Value
        if ([string]::IsNullOrEmpty($val)) { continue }
        if ($val -ceq 'YYYY-MM-DD') { continue }
        # No separator and no date-looking value is English prose ("due to").
        if ([string]::IsNullOrEmpty($sep) -and $val -notmatch '^\d{4}[-/.]\d{1,2}') { continue }
        $reason = ''
        if ($key -cne 'due') { $reason = 'key' }
        elseif ($sep -cne '=') { $reason = 'sep' }
        elseif (-not (Test-DueValueShape $val)) {
            if ($val -match '^\d{4}-\d{2}-\d{2}$') { $reason = 'calendar' } else { $reason = 'shape' }
        }
        if ([string]::IsNullOrEmpty($reason)) { continue }
        $null = $out.Add([ordered]@{ token = ($key + $sep + $val); reason = $reason })
    }
    return @($out)
}

# PARAMETER REACH (main#125). Get-QueueDue is a plain (non-advanced) function,
# and such a function does NOT reject an unknown named parameter: PowerShell
# parks the pair in $args, the real parameter stays empty, and the caller gets
# `exists=false files=0 open=0` - byte-identical to "the queue has no work".
# r792 lost a round to exactly this: `-QueueDir` (the builder's own spelling)
# read open=0, and `-Dir` read open=204 on the same directory. Two fixes, both
# cheap: the alias below makes the natural spelling bind, and this helper names
# what was actually typed when nothing bound, so the reading can never be a
# silent zero again.
function Get-QueueDuePathNote
{
    # NOTE: the parameter is NOT named $Args - PowerShell's automatic $args
    # wins over a bound parameter of that name and the list would read empty.
    param([object[]]$ArgList)
    $names = @()
    foreach ($a in @($ArgList)) {
        $s = [string]$a
        if ($s.Length -gt 1 -and $s.StartsWith('-') -and $s -notmatch '^-?\d') { $names += $s }
    }
    if ($names.Count -gt 0) {
        return ('no path: unbound named parameter ' + ($names -join ',') + ' (accepted: -Dir or -QueueDir)')
    }
    return 'no path given (accepted: -Dir or -QueueDir)'
}

function Get-QueueDue
{
    param(
        [Alias('QueueDir')]
        [string]$Dir,
        [datetime]$Today = (Get-Date).Date,
        [string]$RepoRoot = '',
        [int]$MaxRowChars = 3000
    )

    $r = [ordered]@{
        exists   = $false
        dir_rel  = ''
        note     = ''
        files    = 0
        scanned  = 0
        open     = 0
        dated    = 0
        late     = 0
        max_days = 0
        max_id   = ''
        bad      = 0
        code     = 0
        long     = 0
        long_max = 0
        long_max_id = ''
        long_limit = $MaxRowChars
        dupe     = 0
        dupe_rows = 0
        as_of    = $Today.Date.ToString('yyyy-MM-dd')
        items    = @()
        bad_items = @()
        code_items = @()
        long_items = @()
        dupe_items = @()
    }
    if ([string]::IsNullOrEmpty($Dir)) {
        # No path ever arrived. Say which parameter was rejected instead of
        # shipping a zero that reads as "no work" (main#125).
        $r.dir_rel = '<unresolved>'
        $r.note = Get-QueueDuePathNote -ArgList $args
        return $r
    }
    # Ship the directory repo-RELATIVE when it lives under the caller's repo:
    # the same tree spelled D:\... and C:\... must produce identical page bytes
    # (r744 lesson - an absolute path here is churn on every rebuild).
    # Work out the shipped spelling BEFORE the existence test: a path that is
    # simply not there must still be named in the tick line (main#125).
    $full = $Dir
    try { $full = [IO.Path]::GetFullPath($Dir) } catch { $full = $Dir }
    $rel = $full
    if (-not [string]::IsNullOrEmpty($RepoRoot)) {
        $rootFull = $RepoRoot
        try { $rootFull = [IO.Path]::GetFullPath($RepoRoot) } catch { }
        if ($full.StartsWith($rootFull, [StringComparison]::OrdinalIgnoreCase)) {
            $rel = $full.Substring($rootFull.Length)
        }
    }
    $r.dir_rel = $rel.TrimStart('\', '/').Replace('\', '/')
    if (-not (Test-Path -LiteralPath $Dir)) {
        $r.note = 'not-found'
        return $r
    }
    $r.exists = $true

    $items = New-Object System.Collections.ArrayList
    $badItems = New-Object System.Collections.ArrayList
    $codeItems = New-Object System.Collections.ArrayList
    $longItems = New-Object System.Collections.ArrayList
    $rowRecs = New-Object System.Collections.ArrayList
    $files = 0
    $rows = 0
    $opens = 0
    $dated = 0
    $longMax = 0
    $longMaxId = ''

    $found = @()
    try {
        $found = @(Get-ChildItem -LiteralPath $Dir -Filter '*.md' -File -ErrorAction Stop | Sort-Object Name)
    } catch { return $r }

    foreach ($f in $found) {
        $files++
        $txt = ''
        try { $txt = [IO.File]::ReadAllText($f.FullName, [Text.Encoding]::UTF8) } catch { continue }
        $lineNo = 0
        foreach ($line in ($txt -split "`r?`n")) {
            $lineNo++
            $t = $line.Trim()
            if (-not $t.StartsWith('|')) { continue }
            $cells = $t.Split('|')
            if ($cells.Count -lt 5) { continue }
            $idTxt = $cells[1].Trim()
            if ($idTxt -notmatch '^\d+$') { continue }
            $rows++
            # Every data row is recorded for the duplicate-id account (main#112):
            # the row's own file, its 1-based line, and whether it is closed.
            $null = $rowRecs.Add([ordered]@{
                id     = $idTxt
                file   = $f.Name
                line   = $lineNo
                closed = [bool]$t.Contains('~~')
            })
            # Row width (main#110): measured on EVERY data row, closed ones
            # included - a struck 45 KB row still wrecks the table - and before
            # the closed-row skip so a finished monster cannot hide.
            if ($t.Length -gt $longMax) { $longMax = $t.Length; $longMaxId = $idTxt }
            if ($t.Length -gt $MaxRowChars) {
                $null = $longItems.Add([ordered]@{
                    id     = $idTxt
                    file   = $f.Name
                    chars  = $t.Length
                    closed = [bool]$t.Contains('~~')
                })
            }
            # The queue's closed convention is a struck-through subject cell.
            if ($t.Contains('~~')) { continue }
            $opens++

            # Only the remark cell (last cell) declares a marker; every other
            # cell is prose about markers (main#87). Inline code is masked
            # first so quoted examples are never markers (main#90). Which
            # element is last depends on the row's own shape (main#102): a
            # row that ends with '|' has a trailing empty element, one that
            # does not keeps its remark in the final element.
            $masked = Hide-InlineCode $t
            $cellsMasked = $masked.Split('|')
            $hasTail = $t.EndsWith('|')
            $remarkIndex = $cellsMasked.Count - 1
            if ($hasTail) { $remarkIndex = $cellsMasked.Count - 2 }
            if (-not $hasTail) {
                $null = $badItems.Add([ordered]@{
                    id     = $idTxt
                    file   = $f.Name
                    token  = 'missing-trailing-pipe'
                    reason = 'row'
                })
            }
            $remark = ''
            if ($remarkIndex -ge 0 -and $remarkIndex -lt $cellsMasked.Count) {
                $remark = $cellsMasked[$remarkIndex]
            }
            foreach ($bt in @(Get-QueueDueBadTokens -Text $remark)) {
                $null = $badItems.Add([ordered]@{
                    id     = $idTxt
                    file   = $f.Name
                    token  = $bt.token
                    reason = $bt.reason
                })
            }

            # Quoted deadlines in the remark cell (main#101): a strict marker
            # that sits inside a paired backtick span is invisible by design
            # (main#90 rule a) - count it so a deadline that walked into a quote
            # is at least seen. Masking keeps offsets, so "the same span is
            # blank in the masked row" is exactly "this marker was quoted".
            foreach ($cm in [regex]::Matches($t, 'due=(\d{4})-(\d{2})-(\d{2})')) {
                if ($cm.Index + $cm.Length -gt $masked.Length) { continue }
                $cmCell = ($t.Substring(0, $cm.Index).Split('|')).Count - 1
                if ($cmCell -ne $remarkIndex) { continue }
                $cmVal = $cm.Groups[1].Value + '-' + $cm.Groups[2].Value + '-' + $cm.Groups[3].Value
                if (-not (Test-DueValueShape $cmVal)) { continue }
                if ($masked.Substring($cm.Index, $cm.Length).Trim().Length -gt 0) { continue }
                $null = $codeItems.Add([ordered]@{
                    id    = $idTxt
                    file  = $f.Name
                    token = $cm.Value
                })
            }

            # A marker outside the remark cell only declares if that cell IS
            # the marker - otherwise the cell is prose pointing at some other
            # date and this row has no deadline at all (main#90). A lone
            # marker in the wrong cell stays bad with reason `cell`.
            # EVERY marker is classified here, not just the first one: a row
            # whose prose cites a date before its own remark marker must still
            # keep the real deadline (a first-match scan silently lost it).
            $pick = $null
            $pickMisplaced = $null
            foreach ($mm in [regex]::Matches($masked, 'due=(\d{4})-(\d{2})-(\d{2})')) {
                $cellIndex = ($masked.Substring(0, $mm.Index).Split('|')).Count - 1
                if ($cellIndex -eq $remarkIndex) {
                    if ($null -eq $pick) { $pick = $mm }
                    continue
                }
                if ($cellIndex -ge $cells.Count) { continue }
                if (-not (Test-CellDeclaresMarker -Cell $cells[$cellIndex] -Marker $mm.Value)) { continue }
                $null = $badItems.Add([ordered]@{
                    id     = $idTxt
                    file   = $f.Name
                    token  = $mm.Value
                    reason = 'cell'
                })
                if ($null -eq $pickMisplaced) { $pickMisplaced = $mm }
            }
            if ($null -eq $pick) { $pick = $pickMisplaced }
            if ($null -eq $pick) { continue }
            $m = $pick
            $due = $null
            try {
                $due = [datetime]::new([int]$m.Groups[1].Value, [int]$m.Groups[2].Value,
                    [int]$m.Groups[3].Value)
            } catch { continue }
            $dated++

            $days = [int]([math]::Floor(($Today.Date - $due.Date).TotalDays))
            if ($days -le 0) { continue }
            $null = $items.Add([ordered]@{
                id   = $idTxt
                file = $f.Name
                due  = $due.ToString('yyyy-MM-dd')
                days = $days
            })
            if ($days -gt [int]$r.max_days) { $r.max_days = $days; $r.max_id = $idTxt }
        }
    }

    # Duplicate ids, per file (main#112). Ids are numbered by hand and a
    # collision is invisible until someone reads both rows: `#N already
    # shipped` then vouches for an open row that shares the number. Group by
    # (file,id), keep every group with more than one row, and name each row
    # with its 1-based line so the fix is a jump, not a hunt.
    $dupeItems = New-Object System.Collections.ArrayList
    $byFileId = @{}
    foreach ($rec in $rowRecs) {
        $key = [string]$rec.file + '|' + [string]$rec.id
        if (-not $byFileId.ContainsKey($key)) {
            $byFileId[$key] = New-Object System.Collections.ArrayList
        }
        $null = $byFileId[$key].Add($rec)
    }
    $dupeGroups = 0
    foreach ($key in @($byFileId.Keys | Sort-Object)) {
        $grp = $byFileId[$key]
        if ($grp.Count -lt 2) { continue }
        $dupeGroups++
        foreach ($rec in @($grp | Sort-Object -Property @{ Expression = { [int]$_.line } })) {
            $null = $dupeItems.Add([ordered]@{
                id     = $rec.id
                file   = $rec.file
                line   = $rec.line
                closed = $rec.closed
            })
        }
    }
    $r.dupe = $dupeGroups
    $r.dupe_rows = $dupeItems.Count
    if ($dupeItems.Count -gt 0) { $r.dupe_items = @($dupeItems) }

    $r.files = $files
    $r.scanned = $rows
    $r.open = $opens
    $r.dated = $dated
    $r.late = $items.Count
    $r.bad = $badItems.Count
    $r.code = $codeItems.Count
    $r.long = $longItems.Count
    $r.long_max = $longMax
    $r.long_max_id = $longMaxId
    if ($badItems.Count -gt 0) { $r.bad_items = @($badItems) }
    if ($longItems.Count -gt 0) { $r.long_items = @($longItems) }
    if ($codeItems.Count -gt 0) { $r.code_items = @($codeItems) }
    if ($items.Count -gt 0) {
        $r.items = @($items | Sort-Object -Property @{ Expression = { $_.days } } -Descending)
    }
    return $r
}