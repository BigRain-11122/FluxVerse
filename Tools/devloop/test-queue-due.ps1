# test-queue-due.ps1 - sandbox proof for the queue overdue row (queue main#83)
# --------------------------------------------------------------------------
# Two facts motivated this: main#8 and main#23 sat overdue for 13 and 5 days and
# nothing machine-readable knew about it. The fix is a `due=YYYY-MM-DD` marker
# on the queue row plus Tools\devloop\queue-due.ps1 as the single counter.
#
# What this sandbox pins:
#   A) fixture queue: one late, one due-today, one undated, one closed (~~),
#      one with an unparseable date -> late=1, dated=2, open=4
#   B) absent directory -> exists=false (never a comfortable zero)
#   C) live queue -> the counter agrees with an independent recount of the
#      same marker (panel never carries a hand-written number)
#   D) the real builder ships the row: qdue=1 in PANEL OK and id="f-queue"
#      in the page; a missing queue dir still builds (fail-soft) and says so
#   F) bad markers (main#85): a `due` marker that is not `due=YYYY-MM-DD` is
#      counted and named, never silently read as "no deadline"; prose ("due to")
#      and the literal format template are not markers
#   G) marker CELL (main#87): only the remark cell (last cell) declares a
#      marker. Prose in the subject/pointer cells that quotes a broken shape is
#      NOT counted (r747's own row accused itself with 5 hits); a strict valid
#      marker written in another cell is still honoured as a deadline but
#      reported as bad with reason `cell`
# ASCII-only law: fixtures are ASCII; the live CJK rows are only counted.

$ErrorActionPreference = 'Stop'
$here = $PSScriptRoot
$module = Join-Path $here 'queue-due.ps1'
$builder = Join-Path $here 'build-city-panel.ps1'
if (-not (Test-Path -LiteralPath $module)) { Write-Output 'setup FAIL: queue-due.ps1 missing'; exit 1 }
if (-not (Test-Path -LiteralPath $builder)) { Write-Output 'setup FAIL: builder missing'; exit 1 }
. $module

$repoDir = Split-Path -Parent (Split-Path -Parent $here)

$sandbox = Join-Path ([System.IO.Path]::GetTempPath()) ('fv-qdue-' + $PID)
if (Test-Path -LiteralPath $sandbox) { Remove-Item -LiteralPath $sandbox -Recurse -Force }
New-Item -ItemType Directory -Path $sandbox -Force | Out-Null

function Write-TextFile([string]$path, [string]$body) {
    $utf8 = New-Object System.Text.UTF8Encoding($false)
    [IO.File]::WriteAllText($path, $body, $utf8)
}

$today = [datetime]::new(2026, 11, 1)

# --- A) fixture queue -------------------------------------------------------
$qdirA = Join-Path $sandbox 'queueA'
New-Item -ItemType Directory -Path $qdirA -Force | Out-Null
$rowA = @"
# fixture queue

| # | task | ptr | note |
|---|---|---|---|
| 1 | open and late | p | due=2026-10-20 |
| 2 | open and due today | p | due=2026-11-01 |
| 3 | open, no deadline | p | nothing here |
| 4 | ~~closed work~~ **done** | p | due=2026-10-01 |
| 5 | open, unparseable date | p | due=2026-13-45 |
"@
Write-TextFile (Join-Path $qdirA 'queue-a.md') $rowA

# --- B) absent directory ----------------------------------------------------
$qdirB = Join-Path $sandbox 'queueB-missing'

# --- F) bad markers (main#85) ----------------------------------------------
$qdirF = Join-Path $sandbox 'queueF'
New-Item -ItemType Directory -Path $qdirF -Force | Out-Null
$rowF = @"
# fixture queue: bad due forms

| # | task | ptr | note |
|---|---|---|---|
| 1 | strict marker | p | due=2026-12-25 |
| 2 | short month | p | due=2026-1-5 |
| 3 | colon separator | p | due: 2026-01-05 |
| 4 | capital key | p | Due=2026-01-05 |
| 5 | space separator | p | due 2027-06-30 |
| 6 | impossible calendar date | p | due=2026-13-45 |
| 7 | prose, not a marker | p | no due marker; due to weather |
| 8 | format template | p | write it as `due=YYYY-MM-DD` |
"@
Write-TextFile (Join-Path $qdirF 'queue-f.md') $rowF

# --- G) marker cell (main#87) ----------------------------------------------
$qdirG = Join-Path $sandbox 'queueG'
New-Item -ItemType Directory -Path $qdirG -Force | Out-Null
$rowG = @"
# fixture queue: which cell holds a marker

| # | task | ptr | note |
|---|---|---|---|
| 1 | fix the due=2026-1-5 case | p | nothing here |
| 2 | quote of due: 2026-01-05 | p | nothing here |
| 3 | see the due=2026-12-01 row | p | nothing here |
| 4 | plain task | p | due=2026-12-25 |
| 5 | plain task | p | due=2026-1-5 |
"@
Write-TextFile (Join-Path $qdirG 'queue-g.md') $rowG

# --- results ---------------------------------------------------------------
$A = Get-QueueDue -Dir $qdirA -Today $today
$B = Get-QueueDue -Dir $qdirB -Today $today
$QF = Get-QueueDue -Dir $qdirF -Today $today
$QG = Get-QueueDue -Dir $qdirG -Today $today

# --- C) live queue, independent recount ------------------------------------
$qdirLive = Join-Path $repoDir 'state\queue'
$C = Get-QueueDue -Dir $qdirLive -Today $today -RepoRoot $repoDir
$liveOpen = 0
$liveDated = 0
$liveLate = 0
$liveLateIds = @()
foreach ($f in @(Get-ChildItem -LiteralPath $qdirLive -Filter '*.md' -File | Sort-Object Name)) {
    $txt = [IO.File]::ReadAllText($f.FullName, [Text.Encoding]::UTF8)
    foreach ($line in ($txt -split "`r?`n")) {
        $t = $line.Trim()
        if (-not $t.StartsWith('|')) { continue }
        $cells = $t.Split('|')
        if ($cells.Count -lt 5) { continue }
        $id = $cells[1].Trim()
        if ($id -notmatch '^\d+$') { continue }
        if ($t.Contains('~~')) { continue }
        $liveOpen++
        $m = [regex]::Match($t, 'due=(\d{4})-(\d{2})-(\d{2})')
        if (-not $m.Success) { continue }
        $due = $null
        try {
            $due = [datetime]::new([int]$m.Groups[1].Value, [int]$m.Groups[2].Value,
                [int]$m.Groups[3].Value)
        } catch { continue }
        $liveDated++
        if ($due.Date -lt $today.Date) { $liveLate++; $liveLateIds += $id }
    }
}

# --- D) builder integration ------------------------------------------------
$snap = Join-Path $repoDir 'world-public\city-snapshot.json'
$face = Join-Path $repoDir 'state\status-face.json'
foreach ($p in @($snap, $face)) {
    if (-not (Test-Path -LiteralPath $p)) { Write-Output ('setup FAIL: input missing ' + $p); exit 1 }
}

$outD = Join-Path $sandbox 'panel-d.html'
$logD = (& powershell -NoProfile -ExecutionPolicy Bypass -File $builder `
        -ProofRoot $repoDir -QueueDir $qdirA `
        -OutPath $outD -HistoryPath (Join-Path $sandbox 'hist-d.jsonl')) -join "`n"
$htmlD = ''
if (Test-Path -LiteralPath $outD) { $htmlD = [IO.File]::ReadAllText($outD) }

$outE = Join-Path $sandbox 'panel-e.html'
$logE = (& powershell -NoProfile -ExecutionPolicy Bypass -File $builder `
        -ProofRoot $repoDir -QueueDir $qdirB `
        -OutPath $outE -HistoryPath (Join-Path $sandbox 'hist-e.jsonl')) -join "`n"
$htmlE = ''
if (Test-Path -LiteralPath $outE) { $htmlE = [IO.File]::ReadAllText($outE) }

$pass = 0
$fail = 0
function Check([string]$name, [bool]$cond) {
    if ($cond) { Write-Output ('  PASS ' + $name); $script:pass++ }
    else { Write-Output ('  FAIL ' + $name); $script:fail++ }
}

Check 'A: directory read' ($A.exists -eq $true)
Check 'A: five data rows scanned' ($A.scanned -eq 5)
Check 'A: four open rows (closed one excluded)' ($A.open -eq 4)
Check 'A: two dated rows (bad date not dated)' ($A.dated -eq 2)
Check 'A: exactly one late' ($A.late -eq 1)
Check 'A: 12 days late' ($A.max_days -eq 12)
Check 'A: worst row is id 1' ($A.max_id -eq '1')
Check 'A: closed row never ships' (@($A.items | Where-Object { $_.id -eq '4' }).Count -eq 0)
Check 'A: due-today is not late' (@($A.items | Where-Object { $_.id -eq '2' }).Count -eq 0)

Check 'B: absent dir reads as missing' ($B.exists -eq $false)
Check 'B: missing dir is not a zero-late claim' ($B.open -eq 0 -and $B.late -eq 0)

Check 'C: live queue read' ($C.exists -eq $true)
Check 'C: dir ships repo-relative (no drive spelling)' ($C.dir_rel -eq 'state/queue')
Check 'C: open count matches recount' ($C.open -eq $liveOpen)
Check 'C: dated count matches recount' ($C.dated -eq $liveDated)
Check 'C: late count matches recount' ($C.late -eq $liveLate)
Check 'C: live overdue ids match recount' ((@($C.items | ForEach-Object { $_.id }) -join ',') -eq ($liveLateIds -join ','))
Check 'C: max_days is the largest late day count' ($C.max_days -eq (@($C.items | ForEach-Object { $_.days } | Measure-Object -Maximum).Maximum))
Check 'C: bad items agree with the bad count' (@($C.bad_items).Count -eq $C.bad)
Check 'C: no live marker sits outside the remark cell' (@($C.bad_items | Where-Object { $_.reason -eq 'cell' }).Count -eq 0)

Check 'F: eight rows scanned' ($QF.scanned -eq 8)
Check 'F: five bad markers' ($QF.bad -eq 5)
Check 'F: bad items agree with the bad count' (@($QF.bad_items).Count -eq $QF.bad)
Check 'F: bad ids are the five broken rows' (((@($QF.bad_items | ForEach-Object { $_.id }) | Sort-Object -Unique) -join ',') -eq '2,3,4,5,6')
Check 'F: a strict marker is never bad' (@($QF.bad_items | Where-Object { $_.id -eq '1' }).Count -eq 0)
Check 'F: prose is not a marker' (@($QF.bad_items | Where-Object { $_.id -eq '7' }).Count -eq 0)
Check 'F: the format template is not a marker' (@($QF.bad_items | Where-Object { $_.id -eq '8' }).Count -eq 0)
Check 'F: capital key reason' ((@($QF.bad_items | Where-Object { $_.id -eq '4' })[0].reason) -eq 'key')
Check 'F: colon separator reason' ((@($QF.bad_items | Where-Object { $_.id -eq '3' })[0].reason) -eq 'sep')
Check 'F: bare date-shaped marker reason' ((@($QF.bad_items | Where-Object { $_.id -eq '5' })[0].reason) -eq 'sep')
Check 'F: short month reason' ((@($QF.bad_items | Where-Object { $_.id -eq '2' })[0].reason) -eq 'shape')
Check 'F: impossible date reason' ((@($QF.bad_items | Where-Object { $_.id -eq '6' })[0].reason) -eq 'calendar')
Check 'F: only the strict marker is dated' ($QF.dated -eq 1)
Check 'F: tokens keep their original spelling' ((@($QF.bad_items | Where-Object { $_.id -eq '3' })[0].token) -eq 'due:2026-01-05')

Check 'G: five rows scanned' ($QG.scanned -eq 5)
Check 'G: prose in the subject cell is not bad' (@($QG.bad_items | Where-Object { $_.id -eq '1' }).Count -eq 0)
Check 'G: prose in the subject cell never dates the row' ($QG.dated -eq 2)
Check 'G: prose quoting a colon form is not bad' (@($QG.bad_items | Where-Object { $_.id -eq '2' }).Count -eq 0)
Check 'G: only the remark cell declares a marker' (@($QG.bad_items | Where-Object { $_.id -eq '4' }).Count -eq 0)
Check 'G: a strict marker elsewhere is still a deadline' (@($QG.items | Where-Object { $_.id -eq '3' }).Count -eq 0 -and $QG.dated -eq 2)
Check 'G: a strict marker elsewhere is a writing error' ((@($QG.bad_items | Where-Object { $_.id -eq '3' })[0].reason) -eq 'cell')
Check 'G: a broken marker in the remark cell is still bad' ((@($QG.bad_items | Where-Object { $_.id -eq '5' })[0].reason) -eq 'shape')
Check 'G: exactly two bad markers' ($QG.bad -eq 2)

Check 'D: builder reported PANEL OK' ($logD -match 'PANEL OK')
Check 'D: fixture queue reports one late' ($logD -match 'qdue=1(?!\d)')
Check 'D: fixture queue reports 12 days' ($logD -match 'qdue_max=12(?!\d)')
Check 'D: page carries the queue row' ($htmlD.Contains('id="f-queue"'))
Check 'D: page carries the counter' ($htmlD.Contains('const QUEUE ='))
Check 'D: an unreadable date is reported as bad, not dropped' ($logD -match 'qdue_bad=1(?!\d)')

Check 'E: missing queue dir still builds' ($logE -match 'PANEL OK')
Check 'E: missing queue dir says missing, not zero' ($logE -match 'qdue=missing')
Check 'E: missing queue dir says bad=missing too' ($logE -match 'qdue_bad=missing')
Check 'E: page still carries the row element' ($htmlE.Contains('id="f-queue"'))

if (Test-Path -LiteralPath $sandbox) { Remove-Item -LiteralPath $sandbox -Recurse -Force }

Write-Output ('QUEUE-DUE total=' + ($pass + $fail) + ' pass=' + $pass + ' fail=' + $fail)
if ($fail -gt 0) { exit 1 }
Write-Output 'QUEUE-DUE VERDICT: OK'
exit 0