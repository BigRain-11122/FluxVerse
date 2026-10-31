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

function Get-QueueDue
{
    param(
        [string]$Dir,
        [datetime]$Today = (Get-Date).Date,
        [string]$RepoRoot = ''
    )

    $r = [ordered]@{
        exists   = $false
        dir_rel  = ''
        files    = 0
        scanned  = 0
        open     = 0
        dated    = 0
        late     = 0
        max_days = 0
        max_id   = ''
        bad      = 0
        code     = 0
        as_of    = $Today.Date.ToString('yyyy-MM-dd')
        items    = @()
        bad_items = @()
        code_items = @()
    }
    if ([string]::IsNullOrEmpty($Dir)) { return $r }
    if (-not (Test-Path -LiteralPath $Dir)) { return $r }
    $r.exists = $true
    # Ship the directory repo-RELATIVE when it lives under the caller's repo:
    # the same tree spelled D:\... and C:\... must produce identical page bytes
    # (r744 lesson - an absolute path here is churn on every rebuild).
    $full = [IO.Path]::GetFullPath($Dir)
    $rel = $full
    if (-not [string]::IsNullOrEmpty($RepoRoot)) {
        $rootFull = [IO.Path]::GetFullPath($RepoRoot)
        if ($full.StartsWith($rootFull, [StringComparison]::OrdinalIgnoreCase)) {
            $rel = $full.Substring($rootFull.Length)
        }
    }
    $r.dir_rel = $rel.TrimStart('\', '/').Replace('\', '/')

    $items = New-Object System.Collections.ArrayList
    $badItems = New-Object System.Collections.ArrayList
    $codeItems = New-Object System.Collections.ArrayList
    $files = 0
    $rows = 0
    $opens = 0
    $dated = 0

    $found = @()
    try {
        $found = @(Get-ChildItem -LiteralPath $Dir -Filter '*.md' -File -ErrorAction Stop | Sort-Object Name)
    } catch { return $r }

    foreach ($f in $found) {
        $files++
        $txt = ''
        try { $txt = [IO.File]::ReadAllText($f.FullName, [Text.Encoding]::UTF8) } catch { continue }
        foreach ($line in ($txt -split "`r?`n")) {
            $t = $line.Trim()
            if (-not $t.StartsWith('|')) { continue }
            $cells = $t.Split('|')
            if ($cells.Count -lt 5) { continue }
            $idTxt = $cells[1].Trim()
            if ($idTxt -notmatch '^\d+$') { continue }
            $rows++
            # The queue's closed convention is a struck-through subject cell.
            if ($t.Contains('~~')) { continue }
            $opens++

            # Only the remark cell (last cell) declares a marker; every other
            # cell is prose about markers (main#87). $cells has a trailing
            # empty element because the row text ends with '|'. Inline code is
            # masked first so quoted examples are never markers (main#90).
            $masked = Hide-InlineCode $t
            $cellsMasked = $masked.Split('|')
            $remarkIndex = $cells.Count - 2
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

    $r.files = $files
    $r.scanned = $rows
    $r.open = $opens
    $r.dated = $dated
    $r.late = $items.Count
    $r.bad = $badItems.Count
    $r.code = $codeItems.Count
    if ($badItems.Count -gt 0) { $r.bad_items = @($badItems) }
    if ($codeItems.Count -gt 0) { $r.code_items = @($codeItems) }
    if ($items.Count -gt 0) {
        $r.items = @($items | Sort-Object -Property @{ Expression = { $_.days } } -Descending)
    }
    return $r
}