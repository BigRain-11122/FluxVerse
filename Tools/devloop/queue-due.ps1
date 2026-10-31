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

function Get-QueueDueBadTokens
{
    param([string]$Text)

    $out = New-Object System.Collections.ArrayList
    if ([string]::IsNullOrEmpty($Text)) { return @() }
    # "due" as its own word (not qdue_*, not overdue), then an optional
    # separator and a value. The value class is deliberately ASCII-only: a due
    # value can never be CJK, and stopping at the first CJK glyph is what keeps
    # `due=2026-10-18（prose）` from swallowing the rest of the cell (first live
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
        as_of    = $Today.Date.ToString('yyyy-MM-dd')
        items    = @()
        bad_items = @()
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

            foreach ($bt in @(Get-QueueDueBadTokens -Text $t)) {
                $null = $badItems.Add([ordered]@{
                    id     = $idTxt
                    file   = $f.Name
                    token  = $bt.token
                    reason = $bt.reason
                })
            }

            $m = [regex]::Match($t, 'due=(\d{4})-(\d{2})-(\d{2})')
            if (-not $m.Success) { continue }
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
    if ($badItems.Count -gt 0) { $r.bad_items = @($badItems) }
    if ($items.Count -gt 0) {
        $r.items = @($items | Sort-Object -Property @{ Expression = { $_.days } } -Descending)
    }
    return $r
}