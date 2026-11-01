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
#   G) marker CELL (main#87) + quotation vs declaration (main#90): only the
#      remark cell (last cell) declares a marker. Prose that quotes a marker -
#      broken or valid - is not a marker at all: r747's own row accused itself
#      with 5 hits, and until r760 a prose cell citing someone else's due date
#      handed this row a deadline it never had. A marker alone in the wrong
#      cell is still reported (reason `cell`) - that is a real misplacement.
#   H) inline code (main#90 rule a): backticked spans are quotations in EVERY
#      cell, including the remark cell; an unpaired backtick must not be able
#      to hide a real marker behind it.
#   I) a deadline that walked into a quote (main#101): rule (a) makes it date
#      nothing and report nothing - invisible. A read-only `code` count makes it
#      visible without accusing every row that shows the format template; only
#      strict, calendar-valid markers inside paired backticks in the REMARK cell
#      are counted.
#   J) the last cell is chosen by the row's own shape (main#102): a row that
#      forgot its trailing `|` keeps its marker in the final split element, so
#      the deadline is still counted - and the malformed row is reported as bad
#      with reason `row` instead of being read one cell off in silence.
#   N) duplicate ids (main#112): the same id twice in one queue file is counted
#      and named with its 1-based line, in a third account that never joins
#      `bad` or `long`. The same number in two files is not a collision (the
#      queues number independently), and a row whose first cell is not a plain
#      integer is not a data row at all.
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
| 6 | misplaced deadline | due=2026-10-05 | nothing here |
| 7 | see the due=2026-12-01 row | p | due=2026-10-25 |
"@
Write-TextFile (Join-Path $qdirG 'queue-g.md') $rowG

# --- H) inline code is a quotation (main#90) --------------------------------
# Single-quoted here-string: the backticks must reach the file literally.
$qdirH = Join-Path $sandbox 'queueH'
New-Item -ItemType Directory -Path $qdirH -Force | Out-Null
$rowH = @'
# fixture queue: quoted markers

| # | task | ptr | note |
|---|---|---|---|
| 1 | template in the remark cell | p | write it as `due=2026-12-31` |
| 2 | broken form quoted in the remark cell | p | never write `due=2026-1-5` |
| 3 | quoted date in a prose cell | see `due=2026-12-09` | nothing here |
| 4 | plain deadline | p | due=2026-12-25 |
| 5 | stray backtick before a real marker | p | ` due=2026-10-20 |
'@
Write-TextFile (Join-Path $qdirH 'queue-h.md') $rowH

# --- I) quoted strict deadlines are counted, not judged (main#101) ----------
# A strict marker inside backticks is a citation by rule (main#90a), so it dates
# nothing and reports nothing - i.e. a deadline written that way vanishes in
# silence. The count makes it visible without turning every template example
# into a red mark.
$qdirI = Join-Path $sandbox 'queueI'
New-Item -ItemType Directory -Path $qdirI -Force | Out-Null
$rowI = @'
# fixture queue: deadlines that walked into a quote

| # | task | ptr | note |
|---|---|---|---|
| 1 | quoted real deadline in the remark cell | p | `due=2026-10-20` |
| 2 | plain deadline | p | due=2026-12-25 |
| 3 | quoted broken form | p | `due=2026-1-5` |
| 4 | quoted date in a prose cell | see `due=2026-10-01` | nothing here |
'@
Write-TextFile (Join-Path $qdirI 'queue-i.md') $rowI

# --- J) a row without a trailing pipe (main#102) ----------------------------
# Rows 1 and 2 have no closing `|`: their remark cell is the LAST split element,
# not the second-to-last. Before the fix, their markers were judged against the
# pointer cell and the remark was never scanned - the deadline vanished in
# silence. Row 3 is well-formed and must not change.
$qdirJ = Join-Path $sandbox 'queueJ'
New-Item -ItemType Directory -Path $qdirJ -Force | Out-Null
$rowJ = @"
# fixture queue: rows missing the trailing pipe

| # | task | ptr | note |
|---|---|---|---|
| 1 | late, no trailing pipe | p | due=2026-10-20
| 2 | due today, no trailing pipe | p | due=2026-11-01
| 3 | well formed | p | due=2026-10-25 |
"@
Write-TextFile (Join-Path $qdirJ 'queue-j.md') $rowJ

# --- K) row width (main#110) -------------------------------------------------
# One row is one item, but nothing watched how long a row was: the 45,413
# character monster r773 had to split could grow back one sentence at a time and
# the only machine that would ever notice is the trailing-pipe check, at the very
# end. Rows over the cap are counted (`long`) and named with their length, in an
# account SEPARATE from `bad` (an overlong row is one-item-per-row debt, not a
# mis-written marker). Closed (struck) rows are counted too: a struck 45 KB row
# still wrecks the table.
$qdirK = Join-Path $sandbox 'queueK'
New-Item -ItemType Directory -Path $qdirK -Force | Out-Null
$padK = 'x' * 3500
$rowK = @"
# fixture queue: row width

| # | task | ptr | note |
|---|---|---|---|
| 1 | short row | p | nothing here |
| 2 | long row that is also overdue | p | due=2026-10-20 $padK |
| 3 | ~~closed long row~~ | p | $padK |
| 4 | long but undated row | p | $padK |
"@
Write-TextFile (Join-Path $qdirK 'queue-k.md') $rowK

# Boundary: the cap is a strict `>`, proved by injecting the row's own length
# (exactly at the cap = fine, one character over = long). Never widen the
# production cap to make a fixture pass.
$qdirL = Join-Path $sandbox 'queueL'
New-Item -ItemType Directory -Path $qdirL -Force | Out-Null
$padL = 'y' * 40
$rowL1 = '| 1 | boundary row | p | ' + $padL + ' |'
$lenL = $rowL1.Length
$rowL = "# fixture queue: width boundary`r`n`r`n| # | task | ptr | note |`r`n|---|---|---|---|`r`n" + $rowL1 + "`r`n"
Write-TextFile (Join-Path $qdirL 'queue-l.md') $rowL

# --- N) duplicate ids (main#112) --------------------------------------------
# Ids are numbered by hand, so a collision leaves no trace: r774 saw two `#110`
# rows and "the #110 row already shipped" then vouched for the open one. Two
# files here prove the grouping rule: a number repeated in the SAME file is a
# collision, the same number in ANOTHER file is not (the queues number
# independently). A row whose first cell is not a plain integer is not a data
# row and must not enter the count at all.
$qdirN = Join-Path $sandbox 'queueN'
New-Item -ItemType Directory -Path $qdirN -Force | Out-Null
$rowN1 = @"
# fixture queue: duplicate ids

| # | task | ptr | note |
|---|---|---|---|
| 1 | unique row | p | nothing here |
| 4 | duplicate, still open | p | nothing here |
| 4 | ~~duplicate, already shipped~~ | p | nothing here |
| x | not a data row (non-integer id) | p | nothing here |
"@
Write-TextFile (Join-Path $qdirN 'queue-n1.md') $rowN1
$rowN2 = @"
# fixture queue: second file numbers independently

| # | task | ptr | note |
|---|---|---|---|
| 4 | same number, other file | p | nothing here |
| 5 | duplicate in file two | p | nothing here |
| 5 | duplicate in file two again | p | nothing here |
"@
Write-TextFile (Join-Path $qdirN 'queue-n2.md') $rowN2

# --- results ---------------------------------------------------------------
$A = Get-QueueDue -Dir $qdirA -Today $today
$B = Get-QueueDue -Dir $qdirB -Today $today
$QF = Get-QueueDue -Dir $qdirF -Today $today
$QG = Get-QueueDue -Dir $qdirG -Today $today
$QH = Get-QueueDue -Dir $qdirH -Today $today
$QI = Get-QueueDue -Dir $qdirI -Today $today
$QJ = Get-QueueDue -Dir $qdirJ -Today $today
$QK = Get-QueueDue -Dir $qdirK -Today $today
$QN = Get-QueueDue -Dir $qdirN -Today $today
$QLat = Get-QueueDue -Dir $qdirL -Today $today -MaxRowChars $lenL
$QLover = Get-QueueDue -Dir $qdirL -Today $today -MaxRowChars ($lenL - 1)

# independent recount of the K fixture: which data rows are over the cap
$kExpectIds = @()
$kMaxChars = 0
$kStruckIds = @()
$kLenById = @{}
foreach ($line in ($rowK -split "`r?`n")) {
    $t = $line.Trim()
    if (-not $t.StartsWith('|')) { continue }
    $cells = $t.Split('|')
    if ($cells.Count -lt 5) { continue }
    $id = $cells[1].Trim()
    if ($id -notmatch '^\d+$') { continue }
    $kLenById[$id] = $t.Length
    if ($t.Length -gt $kMaxChars) { $kMaxChars = $t.Length }
    if ($t.Length -gt 3000) { $kExpectIds += $id }
    if ($t.Length -gt 3000 -and $t.Contains('~~')) { $kStruckIds += $id }
}
$kMaxId = (@($kLenById.GetEnumerator() | Sort-Object -Property Value -Descending)[0].Key)

# --- C) live queue, independent recount ------------------------------------
$qdirLive = Join-Path $repoDir 'state\queue'
$C = Get-QueueDue -Dir $qdirLive -Today $today -RepoRoot $repoDir
$liveOpen = 0
$liveDated = 0
$liveLate = 0
$liveLong = 0
$liveLongMax = 0
$liveLateIds = @()
$liveDupeGroups = 0
$liveDupeRows = 0
$liveIdsByFile = @{}
foreach ($f in @(Get-ChildItem -LiteralPath $qdirLive -Filter '*.md' -File | Sort-Object Name)) {
    $txt = [IO.File]::ReadAllText($f.FullName, [Text.Encoding]::UTF8)
    $liveIdsByFile[$f.Name] = @{}
    foreach ($line in ($txt -split "`r?`n")) {
        $t = $line.Trim()
        if (-not $t.StartsWith('|')) { continue }
        $cells = $t.Split('|')
        if ($cells.Count -lt 5) { continue }
        $id = $cells[1].Trim()
        if ($id -notmatch '^\d+$') { continue }
        if ($liveIdsByFile[$f.Name].ContainsKey($id)) { $liveIdsByFile[$f.Name][$id]++ }
        else { $liveIdsByFile[$f.Name][$id] = 1 }
        if ($t.Length -gt $liveLongMax) { $liveLongMax = $t.Length }
        if ($t.Length -gt 3000) { $liveLong++ }
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
foreach ($fn in @($liveIdsByFile.Keys | Sort-Object)) {
    foreach ($cid in @($liveIdsByFile[$fn].Keys)) {
        if ($liveIdsByFile[$fn][$cid] -lt 2) { continue }
        $liveDupeGroups++
        $liveDupeRows += $liveIdsByFile[$fn][$cid]
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

$outI = Join-Path $sandbox 'panel-i.html'
$logI = (& powershell -NoProfile -ExecutionPolicy Bypass -File $builder `
        -ProofRoot $repoDir -QueueDir $qdirI `
        -OutPath $outI -HistoryPath (Join-Path $sandbox 'hist-i.jsonl')) -join "`n"
$htmlI = ''
if (Test-Path -LiteralPath $outI) { $htmlI = [IO.File]::ReadAllText($outI) }

$outK = Join-Path $sandbox 'panel-k.html'
$logK = (& powershell -NoProfile -ExecutionPolicy Bypass -File $builder `
        -ProofRoot $repoDir -QueueDir $qdirK `
        -OutPath $outK -HistoryPath (Join-Path $sandbox 'hist-k.jsonl')) -join "`n"
$htmlK = ''
if (Test-Path -LiteralPath $outK) { $htmlK = [IO.File]::ReadAllText($outK) }

$outN = Join-Path $sandbox 'panel-n.html'
$logN = (& powershell -NoProfile -ExecutionPolicy Bypass -File $builder `
        -ProofRoot $repoDir -QueueDir $qdirN `
        -OutPath $outN -HistoryPath (Join-Path $sandbox 'hist-n.jsonl')) -join "`n"
$htmlN = ''
if (Test-Path -LiteralPath $outN) { $htmlN = [IO.File]::ReadAllText($outN) }

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
Check 'C: long count matches recount' ($C.long -eq $liveLong)
Check 'C: long items agree with the long count' (@($C.long_items).Count -eq $C.long)
Check 'C: long_max matches the longest live row' ($C.long_max -eq $liveLongMax)
Check 'C: the long cap is shipped with the census' ($C.long_limit -eq 3000)
Check 'C: live duplicate groups match recount' ($C.dupe -eq $liveDupeGroups)
Check 'C: live duplicate rows agree with the recount' ($C.dupe_rows -eq $liveDupeRows)
Check 'C: live duplicate items agree with dupe_rows' (@($C.dupe_items).Count -eq $C.dupe_rows)

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

Check 'G: seven rows scanned' ($QG.scanned -eq 7)
Check 'G: prose in the subject cell is not bad' (@($QG.bad_items | Where-Object { $_.id -eq '1' }).Count -eq 0)
Check 'G: a prose citation declares no deadline' ($QG.dated -eq 3)
Check 'G: prose quoting a colon form is not bad' (@($QG.bad_items | Where-Object { $_.id -eq '2' }).Count -eq 0)
Check 'G: the remark cell is not bad when the subject is prose' (@($QG.bad_items | Where-Object { $_.id -eq '3' }).Count -eq 0)
Check 'G: only the remark cell declares a marker' (@($QG.bad_items | Where-Object { $_.id -eq '4' }).Count -eq 0)
Check 'G: a lone marker in a prose cell is a writing error' ((@($QG.bad_items | Where-Object { $_.id -eq '6' })[0].reason) -eq 'cell')
Check 'G: a lone marker in a prose cell still dates the row' ($QG.max_id -eq '6')
Check 'G: a prose citation never shadows the real marker' (@($QG.items | Where-Object { $_.id -eq '7' -and $_.days -eq 7 }).Count -eq 1)
Check 'G: a prose citation before the real marker is not bad' (@($QG.bad_items | Where-Object { $_.id -eq '7' }).Count -eq 0)
Check 'G: a broken marker in the remark cell is still bad' ((@($QG.bad_items | Where-Object { $_.id -eq '5' })[0].reason) -eq 'shape')
Check 'G: exactly two bad markers' ($QG.bad -eq 2)

Check 'H: five rows scanned' ($QH.scanned -eq 5)
Check 'H: quoted template in the remark cell is not a deadline' ($QH.dated -eq 2)
Check 'H: quoted broken form is not bad' ($QH.bad -eq 0)
Check 'H: a quoted date in a prose cell declares nothing' ($QH.max_id -eq '5')
Check 'H: an unpaired backtick cannot hide a real marker' ($QH.late -eq 1 -and $QH.max_days -eq 12)
Check 'H: the plain deadline is still honoured' (@($QH.items | Where-Object { $_.id -eq '5' }).Count -eq 1)
Check 'H: a quoted strict marker in the remark cell is counted' ($QH.code -eq 1)
Check 'H: code items agree with the code count' (@($QH.code_items).Count -eq $QH.code)

Check 'I: four rows scanned' ($QI.scanned -eq 4)
Check 'I: one quoted strict marker counted' ($QI.code -eq 1)
Check 'I: the quoted row is named' (((@($QI.code_items | ForEach-Object { $_.id })) -join ',') -eq '1')
Check 'I: a quoted marker dates nothing' ($QI.dated -eq 1)
Check 'I: a quoted marker is never late' ($QI.late -eq 0)
Check 'I: a quoted broken form is not counted (not strict)' (@($QI.code_items | Where-Object { $_.id -eq '3' }).Count -eq 0)
Check 'I: a quoted date in a prose cell is not counted' (@($QI.code_items | Where-Object { $_.id -eq '4' }).Count -eq 0)
Check 'I: code census never makes a marker bad' ($QI.bad -eq 0)

Check 'J: three rows scanned' ($QJ.scanned -eq 3)
Check 'J: a marker in a tail-less row is still read as its deadline' ($QJ.dated -eq 3)
Check 'J: the tail-less late row is late' ($QJ.late -eq 2 -and $QJ.max_id -eq '1')
Check 'J: the tail-less due-today row is not late' (@($QJ.items | Where-Object { $_.id -eq '2' }).Count -eq 0)
Check 'J: a malformed row is reported, not silent' ($QJ.bad -eq 2)
Check 'J: the malformed rows are named with reason row' (((@($QJ.bad_items | Where-Object { $_.reason -eq 'row' } | ForEach-Object { $_.id }) | Sort-Object) -join ',') -eq '1,2')
Check 'J: the well-formed row is not accused' (@($QJ.bad_items | Where-Object { $_.id -eq '3' }).Count -eq 0)

Check 'K: four rows scanned' ($QK.scanned -eq 4)
Check 'K: three over-cap rows counted (one closed)' ($QK.long -eq 3)
Check 'K: long count matches an independent recount' ($QK.long -eq $kExpectIds.Count)
Check 'K: long ids match an independent recount' (((@($QK.long_items | ForEach-Object { $_.id }) | Sort-Object) -join ',') -eq (($kExpectIds | Sort-Object) -join ','))
Check 'K: long items agree with the long count' (@($QK.long_items).Count -eq $QK.long)
Check 'K: the short row is not long' (@($QK.long_items | Where-Object { $_.id -eq '1' }).Count -eq 0)
Check 'K: long_max is the longest row overall (census agrees with recount)' ($QK.long_max -eq $kMaxChars)
Check 'K: long_max_id names the longest row' ($QK.long_max_id -eq $kMaxId)
Check 'K: a struck over-cap row is counted (a struck monster still wrecks the table)' (((@($QK.long_items | Where-Object { $_.closed } | ForEach-Object { $_.id }) | Sort-Object) -join ',') -eq (($kStruckIds | Sort-Object) -join ','))
Check 'K: a closed over-cap row is still not "open work"' (@($QK.long_items | Where-Object { $_.closed } | Measure-Object).Count -eq 1)
Check 'K: row length in chars is reported per item' (((@($QK.long_items | Where-Object { $_.id -eq '2' })[0].chars) -eq $kLenById['2']) -and ((@($QK.long_items | Where-Object { $_.id -eq '2' })[0].chars) -gt 3000))
Check 'K: long rows never join the bad account' ($QK.bad -eq 0)
Check 'K: a long overdue row is still counted as late' ($QK.late -eq 1 -and $QK.max_id -eq '2')
Check 'K: the default cap is 3000 characters' ($QK.long_limit -eq 3000)
Check 'K: a row exactly at the cap is not long' ($QLat.long -eq 0)
Check 'K: one character over the cap is long' ($QLover.long -eq 1)
Check 'K: the boundary row reports its own length' ((@($QLover.long_items)[0].chars) -eq $lenL)
Check 'K: an injected cap is echoed back' ($QLat.long_limit -eq $lenL)

# N) duplicate ids (main#112): grouped per file, named with 1-based line, and
# kept in their own account. A shared number across two files is NOT a
# collision; a row whose first cell is not an integer is not a data row.
Check 'N: fixture queue read' ($QN.exists -eq $true)
Check 'N: six data rows scanned (the non-integer id is not one)' ($QN.scanned -eq 6)
Check 'N: two duplicate groups (one per file, not merged)' ($QN.dupe -eq 2)
Check 'N: four rows share an id' ($QN.dupe_rows -eq 4)
Check 'N: dupe items agree with dupe_rows' (@($QN.dupe_items).Count -eq $QN.dupe_rows)
Check 'N: a unique id is not named' (@($QN.dupe_items | Where-Object { $_.id -eq '1' }).Count -eq 0)
Check 'N: the same number in another file is not a collision' ((((@($QN.dupe_items | Where-Object { $_.id -eq '4' } | ForEach-Object { $_.file }) | Sort-Object) -join ',')) -eq 'queue-n1.md,queue-n1.md')
Check 'N: a number unique in its own file is never named' (@($QN.dupe_items | Where-Object { $_.id -eq '4' -and $_.file -eq 'queue-n2.md' }).Count -eq 0)
Check 'N: line numbers point at the real rows (1-based)' (((@($QN.dupe_items | Where-Object { $_.id -eq '4' -and $_.file -eq 'queue-n1.md' } | ForEach-Object { $_.line }) | Sort-Object) -join ',') -eq '6,7')
Check 'N: closed flag is per row, not per id' ((@($QN.dupe_items | Where-Object { $_.id -eq '4' -and $_.file -eq 'queue-n1.md' -and $_.closed }).Count -eq 1) -and (@($QN.dupe_items | Where-Object { $_.id -eq '4' -and $_.file -eq 'queue-n1.md' -and -not $_.closed }).Count -eq 1))
Check 'N: duplicate ids never join the bad account' ($QN.bad -eq 0)
Check 'N: duplicate ids never join the long account' ($QN.long -eq 0)
Check 'N: a queue with unique ids reports dupe=0' ($A.dupe -eq 0 -and $A.dupe_rows -eq 0)
Check 'N: dupe items ship in file order, not reversed' (((@($QN.dupe_items | Where-Object { $_.id -eq '4' -and $_.file -eq 'queue-n1.md' } | ForEach-Object { $_.line })) -join ',') -eq '6,7')

Check 'D: builder reported PANEL OK' ($logD -match 'PANEL OK')
Check 'D: fixture queue reports one late' ($logD -match 'qdue=1(?!\d)')
Check 'D: fixture queue reports 12 days' ($logD -match 'qdue_max=12(?!\d)')
Check 'D: page carries the queue row' ($htmlD.Contains('id="f-queue"'))
Check 'D: page carries the counter' ($htmlD.Contains('const QUEUE ='))
Check 'D: an unreadable date is reported as bad, not dropped' ($logD -match 'qdue_bad=1(?!\d)')
Check 'D: a queue with no quoted deadline reports code=0' ($logD -match 'qdue_code=0(?!\d)')
Check 'D: a queue with no over-cap row reports long=0' ($logD -match 'qdue_long=0(?!\d)')
Check 'D: the longest row is reported even when nothing is over the cap' ($logD -match 'qdue_longmax=[1-9]\d*(?!\d)')
Check 'D: a queue with no duplicate id reports dupe=0' ($logD -match 'qdue_dupe=0(?!\d)')

Check 'E: missing queue dir still builds' ($logE -match 'PANEL OK')
Check 'E: missing queue dir says missing, not zero' ($logE -match 'qdue=missing')
Check 'E: missing queue dir says bad=missing too' ($logE -match 'qdue_bad=missing')
Check 'E: missing queue dir says code=missing too' ($logE -match 'qdue_code=missing')
Check 'E: missing queue dir says long=missing too' ($logE -match 'qdue_long=missing')
Check 'E: missing queue dir says longmax=missing too' ($logE -match 'qdue_longmax=missing')
Check 'E: missing queue dir says dupe=missing too' ($logE -match 'qdue_dupe=missing')
Check 'E: page still carries the row element' ($htmlE.Contains('id="f-queue"'))

Check 'I: builder reports the quoted count' ($logI -match 'PANEL OK' -and $logI -match 'qdue_code=1(?!\d)')
Check 'I: the quoted count reaches the page data' ($htmlI.Contains('code_items'))

Check 'K: builder reports the over-cap row count' ($logK -match 'PANEL OK' -and $logK -match ('qdue_long=' + $QK.long + '(?!\d)'))
Check 'K: builder reports the longest row' ($logK -match ('qdue_longmax=' + $kMaxChars + '(?!\d)'))
Check 'K: the over-cap rows reach the page data' ($htmlK.Contains('long_items'))
Check 'K: the page carries the shipped cap' ($htmlK.Contains('"long_limit":3000'))

Check 'N: builder reports the duplicate group count' ($logN -match 'PANEL OK' -and $logN -match 'qdue_dupe=2(?!\d)')
Check 'N: builder reports how many rows share an id' ($logN -match 'qdue_dupe_rows=4(?!\d)')
Check 'N: the duplicate rows reach the page data' ($htmlN.Contains('dupe_items'))
Check 'N: the page ships the line numbers for the fix' ($htmlN.Contains('"line":6'))

if (Test-Path -LiteralPath $sandbox) { Remove-Item -LiteralPath $sandbox -Recurse -Force }

Write-Output ('QUEUE-DUE total=' + ($pass + $fail) + ' pass=' + $pass + ' fail=' + $fail)
if ($fail -gt 0) { exit 1 }
Write-Output 'QUEUE-DUE VERDICT: OK'
exit 0