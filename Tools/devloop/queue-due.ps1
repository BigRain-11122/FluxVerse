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
# Read-only, fail-soft: a missing/empty directory ships exists=false and the
# page says so instead of printing a comfortable zero.
# ASCII-only (PS 5.1 GBK law): the CJK rows live in the UTF-8 queue files.

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
        as_of    = $Today.Date.ToString('yyyy-MM-dd')
        items    = @()
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
    if ($items.Count -gt 0) {
        $r.items = @($items | Sort-Object -Property @{ Expression = { $_.days } } -Descending)
    }
    return $r
}