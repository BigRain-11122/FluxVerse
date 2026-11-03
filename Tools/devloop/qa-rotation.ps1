# qa-rotation.ps1 - ONE read-only census of the qa/ screenshot pool, plus the
# retention plan that will be applied in a later round (queue main#109).
# ----------------------------------------------------------------------------
# Why: logs/ has archive-logs.ps1 and its own duty line, qa/ has nothing. The
# pool only grows: the shot card inlines the newest 3 frames, while the other
# few hundred images (and the panel's own 80+ renders, which are never inlined)
# sit there forever. main#109 forbids "deleting to make the number smaller":
# the order is (1) count what is there, (2) state a threshold, (3) move - never
# delete, (4) prove the census is still self-consistent afterwards.
#
# Steps 1-2 (census + dry-run plan) shipped in r771. Step 3 (-Apply, r772) moves
# the planned files into <pool>\_archive - never deletes. The archive is a
# sub-directory, so the census (top level only) stops counting what moved and
# the shot card's window is what still lives in the pool. Step 4 (proof the
# census is still self-consistent) is the round's job: run this tool twice.
#
# -Apply is fail-closed in two ways: (a) if ANY planned name already exists in
# the archive, nothing at all is moved (a half-applied plan is the state this
# order forbids); (b) every move is logged to _archive\MOVED.tsv so a manual
# reversal is a copy, not a guess. A no-op apply (plan empty) is success.
#
# Classification reuses the same family registry as city-shot-shape.ps1 so the
# pool and the card cannot disagree about what a "city frame" is. The panel
# token is checked first, exactly like city-shot-shape.ps1: a panel self-shot
# also starts with city-, but it is evidence of the page, not of the city.
# Step 5 (r777, queue main#113): the window numbers were a guess, so the pool
# needed a criterion that is not a guess. The one this repo actually has is
# "a committed document names it": a runbook line or a TECH section that says
# qa/<name> is evidence somebody will try to open later. So a file cited by any
# tracked *.md / *.txt is never planned for a move (class 'cited'), and names
# that are cited but already sit in _archive are reported as dangling - r772
# moved 69 such files and nothing said so. If the citation index cannot be
# built the tool refuses to plan or apply (fail-closed): archiving cited
# evidence is exactly the damage this step exists to stop.
# Step 6 (r778, queue main#114): step 5 could see the damage (69 cited names
# sitting in _archive, every one of them a path a committed document points at)
# but could only report it. A report that never turns into a repair is its own
# kind of silence, so -Restore walks the same dangling list backwards: cited
# names come out of _archive and back into the pool, one ledger line each in
# _archive\RESTORED.tsv. It is fail-closed the same way -Apply is (any name
# missing from the archive, or already present in the pool, and nothing moves at
# all): a half-restored pool is exactly the state this order forbids. A restore
# cannot fight the rotation: restored files are cited by definition, and cited
# files are never planned for a move.
# Step 7 (r782, queue main#116): a citation was a one-way shield - cited files
# never rotate (correct), but nobody ever asked whether the citation still points
# at the same thing. With 69 cited files frozen the whole rotation is a no-op
# (plan moves=0). This step adds a REPORT-ONLY audit, three readings, no new
# moves: (a) stale_cited = cited files older than -StaleDays (default 90);
# (b) superseded_cited = cited files whose capture session is not the newest one
# in its group (a newer frame of the same family already exists in the pool);
# (c) newer_sibling_cited = cited files that share their session with a strictly
# newer file (the "newer frame inside one session" relation, quantified before
# any rule is written). Moving is still a human decision: nothing here changes a
# plan. -Record writes the numbers to logs\.qa-cite-audit.json so a reader (the
# panel) can show them with their own age instead of re-scanning 383 documents
# per tick - the audit costs ~2.4 s and is not a per-tick job.
# Read-only, no network, ASCII-only (PS5.1 GBK law).
[CmdletBinding()]
param(
    # Pool directory. Empty = <repo>/qa.
    [string]$Dir = '',
    # Rolling window per evidence family, counted in SESSIONS (see Get-QaSessionKey).
    [int]$KeepFamily = 3,
    # Rolling window for panel self-shots (never inlined), counted in FILES.
    [int]$KeepPanel = 3,
    # Age line for the cited-evidence audit (queue main#116). A cited file older
    # than this many days is reported as stale - reported, never moved.
    [int]$StaleDays = 90,
    # Margin (minutes) before a newer file in the SAME capture session counts as
    # a re-shoot rather than write order. Measured: the six views of one session
    # land within seconds of each other, so a strict compare counts write order
    # as "replaced" (first cut reported 5 such files, all from one 10-28 capture).
    [int]$SiblingMarginMin = 60,
    # Write the citation audit reading to a small JSON file (empty = no record).
    # Default location = <repo>/logs/.qa-cite-audit.json, which the panel reads
    # as a readout only; nothing rotates on the strength of this record.
    [string]$RecordPath = '',
    # Write the record to the default logs path (shortcut for -RecordPath).
    [switch]$Record,
    # Repo root used to build the citation index (tracked *.md / *.txt).
    # Empty = two levels above this script (the repo root).
    [string]$CiteRoot = '',
    # Explicit citation file list for the sandbox. Passing -CiteFiles with an
    # empty array means "no citations anywhere" (deterministic fixtures); the
    # switch being absent means "ask git for the tracked md/txt files".
    [string[]]$CiteFiles = @(),
    # Print one MOVE line per file the plan would move.
    [switch]$List,
    # Machine-readable one-json-line output (used by the sandbox).
    [switch]$Json,
    # Actually move the planned files into <pool>\_archive (never deletes).
    [switch]$Apply,
    # Move cited names that sit in <pool>\_archive back into the pool (the
    # reverse of -Apply, and the repair for a dangling citation). Never
    # overwrites: a name that already exists in the pool aborts the whole run.
    [switch]$Restore
)

$ErrorActionPreference = 'Stop'

# Same registry as Tools/devloop/city-shot-shape.ps1 (kept as a literal copy on
# purpose: that file dot-sources into the tick path, this one must stay
# standalone so it can be pointed at any directory).
$script:QaFamilies = @('city-', 'city3d-', 'smoke-', 'frame-', 'soak-')
$script:QaPanelToken = 'panel'

function Get-QaGroupName
{
    param([string]$Name)
    if ([string]::IsNullOrWhiteSpace($Name)) { return 'other' }
    if ($Name -match $script:QaPanelToken) { return 'panel' }
    foreach ($f in $script:QaFamilies) {
        if ($Name.StartsWith($f, [StringComparison]::OrdinalIgnoreCase)) { return $f }
    }
    return 'other'
}

function Get-KeepForGroup
{
    param([string]$Group)
    if ($Group -eq 'panel') { return $KeepPanel }
    if ($Group -eq 'other') { return -1 }   # -1 = keep everything
    return $KeepFamily
}

# One capture session = one timestamp token. city3d-shots-<YYYYMMDD-HHMM>-<who>-<view>
# is six files that only make sense together (r733: overview/gamedistrict/street/
# housefront/showcase/cutaway), so a per-file window would decapitate the newest
# surviving set and call it retention. A name with no token is its own session,
# which makes the per-file families behave exactly like a per-file window.
function Get-QaSessionKey
{
    param([string]$Name)
    if ($Name -match '(\d{8}-\d{4})') { return 'ts:' + $Matches[1] }
    return 'name:' + $Name
}

function Get-QaPoolFiles
{
    param([string]$Pool)
    # A hashtable, not a PSObject: property assignment on a PSObject inside a
    # function is easy to get subtly wrong (r777 first cut returned an empty
    # file list and the census printed a calm images=0).
    $out = @{ exists = $false; files = @(); error = '' }
    if ([string]::IsNullOrWhiteSpace($Pool)) { return $out }
    if (-not (Test-Path -LiteralPath $Pool)) { return $out }
    try {
        $list = Get-ChildItem -LiteralPath $Pool -File -ErrorAction Stop |
            Where-Object { $_.Extension -match '^\.(png|jpg|jpeg)$' }
        $out.files = @($list)
        $out.exists = $true
    } catch {
        $out.error = $_.Exception.Message
        $out.files = @()
        $out.exists = $false
    }
    return $out
}

# Citation index: which of the given image names appear in a tracked text file.
# A committed document that names qa/<file> is the only retention criterion this
# repo can prove; a guess at "which sessions matter" is what main#113 objected
# to. Matching is substring on the full file name (Ordinal, ASCII names only),
# so "documented" means "somebody can find the exact string in the repo text".
function Get-QaCitationIndex
{
    param(
        [string]$Root,
        [string[]]$Files,
        [bool]$Explicit,
        [string[]]$Names
    )
    $res = New-Object PSObject -Property ([ordered]@{
        ok = $false; error = ''; mode = 'git'; scanned = 0; skipped = 0
        names = @{}; sources = @{}
    })
    if ($null -eq $Names -or @($Names).Count -eq 0) { $res.ok = $true; return $res }
    $needles = @($Names | Where-Object { -not [string]::IsNullOrWhiteSpace($_) } | Sort-Object -Unique)
    if ($needles.Count -eq 0) { $res.ok = $true; return $res }

    $list = @()
    if ($Explicit) {
        $res.mode = 'explicit'
        $list = @($Files)
    } else {
        if ([string]::IsNullOrWhiteSpace($Root) -or -not (Test-Path -LiteralPath $Root)) {
            $res.error = 'cite root missing: ' + $Root
            return $res
        }
        try {
            $tracked = @(& git -C $Root ls-files 2>$null)
            if ($LASTEXITCODE -ne 0) {
                $res.error = 'git ls-files exit ' + $LASTEXITCODE
                return $res
            }
        } catch {
            $res.error = 'git unavailable: ' + $_.Exception.Message
            return $res
        }
        $list = @($tracked | Where-Object { $_ -match '\.(md|txt)$' })
    }

    foreach ($rel in $list) {
        if ([string]::IsNullOrWhiteSpace($rel)) { continue }
        $p = [string]$rel
        if (-not [System.IO.Path]::IsPathRooted($p)) { $p = Join-Path $Root $p }
        if (-not (Test-Path -LiteralPath $p)) { $res.skipped++; continue }
        try {
            $len = (Get-Item -LiteralPath $p).Length
            # A single document above 8 MB is not a citation face this tool can
            # afford to scan per run; it is skipped and counted, never assumed.
            if ($len -gt 8388608) { $res.skipped++; continue }
            $text = [System.IO.File]::ReadAllText($p)
        } catch {
            $res.skipped++
            continue
        }
        $res.scanned++
        foreach ($n in $needles) {
            if ($text.IndexOf($n, [StringComparison]::Ordinal) -ge 0) {
                if (-not $res.names.ContainsKey($n)) { $res.names[$n] = 0 }
                $res.names[$n] = [int]$res.names[$n] + 1
                if (-not $res.sources.ContainsKey($n)) {
                    $res.sources[$n] = New-Object System.Collections.ArrayList
                }
                [void]$res.sources[$n].Add([string]$rel)
            }
        }
    }
    $res.ok = $true
    return $res
}

function Get-QaPoolCensus
{
    param([string]$Pool, [object[]]$Files = $null, [hashtable]$Cited = @{})
    $res = New-Object PSObject -Property ([ordered]@{
        dir = $Pool; exists = $false; images = 0; bytes = 0; oldest_days = -1
        groups = @(); cited = 0; cited_kept = 0
        stale_cited = 0; stale_cited_bytes = [int64]0
        superseded_cited = 0; newer_sibling_cited = 0
        superseded_by_group = [ordered]@{}
    })
    if ([string]::IsNullOrWhiteSpace($Pool)) { return $res }
    if (-not (Test-Path -LiteralPath $Pool)) { return $res }
    $res.exists = $true
    # NOT $files: PowerShell variable names are case-insensitive, so a local
    # $files and the $Files parameter are the same slot - the first cut reset
    # the caller's list to empty and the census printed a calm images=0.
    $fileList = @()
    if ($null -ne $Files) {
        $fileList = @($Files)
    } else {
        try {
            $fileList = @(Get-ChildItem -LiteralPath $Pool -File -ErrorAction Stop |
                Where-Object { $_.Extension -match '^\.(png|jpg|jpeg)$' })
        } catch {
            $res.exists = $false
            return $res
        }
    }
    $res.images = $fileList.Count
    if ($fileList.Count -eq 0) { return $res }

    $now = (Get-Date).ToUniversalTime()
    $sum = 0
    $oldest = $null
    foreach ($f in $fileList) {
        $sum += [int64]$f.Length
        if ($null -eq $oldest -or $f.LastWriteTimeUtc -lt $oldest) { $oldest = $f.LastWriteTimeUtc }
    }
    $res.bytes = $sum
    if ($oldest) { $res.oldest_days = [int][Math]::Floor(($now - $oldest).TotalDays) }

    $groups = @()
    $byGroup = @{}
    foreach ($f in $fileList) {
        $g = Get-QaGroupName -Name $f.Name
        if (-not $byGroup.ContainsKey($g)) { $byGroup[$g] = New-Object System.Collections.ArrayList }
        [void]$byGroup[$g].Add($f)
    }
    foreach ($k in @($byGroup.Keys | Sort-Object)) {
        # Newest first; name breaks ties so the plan is stable across runs.
        $sorted = @($byGroup[$k] | Sort-Object `
            @{ Expression = 'LastWriteTimeUtc'; Descending = $true }, `
            @{ Expression = 'Name'; Descending = $false })
        $keep = Get-KeepForGroup -Group $k
        $bytes = [int64]0
        foreach ($f in $sorted) { $bytes += [int64]$f.Length }

        # Build sessions (ordered by their newest member, newest session first).
        $sessions = @()
        if ($keep -ge 0) {
            $sessMap = [ordered]@{}
            foreach ($f in $sorted) {
                $sk = Get-QaSessionKey -Name $f.Name
                if (-not $sessMap.Contains($sk)) {
                    $sessMap[$sk] = New-Object PSObject -Property ([ordered]@{
                        key = $sk; newest = $f.LastWriteTimeUtc; bytes = [int64]0
                        names = New-Object System.Collections.ArrayList
                    })
                }
                $s = $sessMap[$sk]
                if ($f.LastWriteTimeUtc -gt $s.newest) { $s.newest = $f.LastWriteTimeUtc }
                $s.bytes += [int64]$f.Length
                [void]$s.names.Add($f.Name)
            }
            $sessions = @($sessMap.Values | Sort-Object `
                @{ Expression = 'newest'; Descending = $true }, `
                @{ Expression = 'key'; Descending = $true })
        }

        $moveList = @()
        $citedNames = @()
        $citedKept = @()
        foreach ($f in $sorted) {
            if ($Cited.ContainsKey([string]$f.Name)) { $citedNames += [string]$f.Name }
        }

        # Citation audit (main#116): independent of the retention window, and
        # computed for every group (including keep=all) so the reading does not
        # depend on where a file happens to sit relative to the window.
        $stampNewest = @{}
        foreach ($f in $sorted) {
            $sk = Get-QaSessionKey -Name $f.Name
            if (-not $stampNewest.ContainsKey($sk) -or $f.LastWriteTimeUtc -gt $stampNewest[$sk]) {
                $stampNewest[$sk] = $f.LastWriteTimeUtc
            }
        }
        $newestStamp = $null
        if ($stampNewest.Count -gt 0) {
            $newestStamp = @($stampNewest.Keys | Sort-Object { $stampNewest[$_] } -Descending)[0]
        }
        $staleNames = @()
        $staleBytes = [int64]0
        $supNames = @()
        $sibNames = @()
        foreach ($n in @($citedNames | Sort-Object)) {
            $fi = @($sorted | Where-Object { [string]$_.Name -eq [string]$n })[0]
            if ($null -eq $fi) { continue }
            if (($now - $fi.LastWriteTimeUtc).TotalDays -gt $StaleDays) {
                $staleNames += [string]$n
                $staleBytes += [int64]$fi.Length
            }
            $sk = Get-QaSessionKey -Name $fi.Name
            if ($null -ne $newestStamp -and $sk -ne $newestStamp) { $supNames += [string]$n }
            $hasNewer = $false
            foreach ($o in $sorted) {
                if ([string]$o.Name -eq [string]$fi.Name) { continue }
                if ((Get-QaSessionKey -Name $o.Name) -ne $sk) { continue }
                if (($o.LastWriteTimeUtc - $fi.LastWriteTimeUtc).TotalMinutes -gt $SiblingMarginMin) { $hasNewer = $true; break }
            }
            if ($hasNewer) { $sibNames += [string]$n }
        }
        if ($keep -ge 0 -and $sessions.Count -gt $keep) {
            foreach ($s in @($sessions[$keep..($sessions.Count - 1)])) {
                foreach ($n in @($s.names | Sort-Object)) {
                    # Cited evidence is outside the retention window's jurisdiction:
                    # a committed document points at this name, so moving it would
                    # leave the document pointing at nothing.
                    if ($Cited.ContainsKey([string]$n)) { $citedKept += [string]$n; continue }
                    $moveList += $n
                }
            }
        }
        $reclaim = [int64]0
        $nameToLen = @{}
        foreach ($f in $sorted) { $nameToLen[$f.Name] = [int64]$f.Length }
        foreach ($n in $moveList) { $reclaim += [int64]$nameToLen[$n] }
        $oldestG = $null
        foreach ($f in $sorted) {
            if ($null -eq $oldestG -or $f.LastWriteTimeUtc -lt $oldestG) { $oldestG = $f.LastWriteTimeUtc }
        }
        $groups += (New-Object PSObject -Property ([ordered]@{
            name = [string]$k
            count = [int]$sorted.Count
            bytes = [int64]$bytes
            keep = [int]$keep
            sessions = [int]$(if ($keep -ge 0) { $sessions.Count } else { 0 })
            move = [int]$moveList.Count
            reclaim = [int64]$reclaim
            oldest_days = $(if ($oldestG) { [int][Math]::Floor(($now - $oldestG).TotalDays) } else { -1 })
            cited = [int]$citedNames.Count
            cited_kept = [int]$citedKept.Count
            cited_names = @($citedNames)
            stale_cited = [int]$staleNames.Count
            stale_cited_bytes = [int64]$staleBytes
            stale_cited_names = @($staleNames)
            superseded_cited = [int]$supNames.Count
            superseded_cited_names = @($supNames)
            newer_sibling_cited = [int]$sibNames.Count
            newer_sibling_cited_names = @($sibNames)
            move_names = @($moveList)
        }))
        $res.cited = [int]$res.cited + $citedNames.Count
        $res.cited_kept = [int]$res.cited_kept + $citedKept.Count
        $res.stale_cited = [int]$res.stale_cited + $staleNames.Count
        $res.stale_cited_bytes = [int64]$res.stale_cited_bytes + $staleBytes
        $res.superseded_cited = [int]$res.superseded_cited + $supNames.Count
        # How the superseded count splits by group. The panel family is almost
        # always its own bucket: every self-shot is named with its own timestamp,
        # so each one IS its own capture session and "a newer frame exists in the
        # same session" is structurally true for all of them (r782 honest edge).
        # Printed as a breakdown so a reader can see that 61 of 72 is the
        # self-shot bucket and not 72 pieces of evidence going stale.
        if ($supNames.Count -gt 0) {
            $gk = ([string]$k).TrimEnd('-')
            $res.superseded_by_group[$gk] = [int]$supNames.Count
        }
        $res.newer_sibling_cited = [int]$res.newer_sibling_cited + $sibNames.Count
    }
    $res.groups = @($groups)
    return $res
}

function Format-QaBytes
{
    param([int64]$Bytes)
    if ($Bytes -ge 1048576) { return ('{0:N1}MB' -f ($Bytes / 1048576.0)) }
    if ($Bytes -ge 1024) { return ('{0:N1}KB' -f ($Bytes / 1024.0)) }
    return ([string]$Bytes + 'B')
}

# ---------------------------------------------------------------------------
# Step 3: apply. Move, never delete. Two-phase on purpose - the pre-flight runs
# over the whole plan before a single file moves, so a conflict cannot leave the
# pool half-rotated (the plan itself is one object, so pre-flight and the move
# phase cannot disagree about what is planned).
# ---------------------------------------------------------------------------
function Invoke-QaApply
{
    param([string]$Pool, [object]$Census)

    $res = New-Object PSObject -Property ([ordered]@{
        archive = (Join-Path $Pool '_archive')
        moved = 0
        bytes = [int64]0
        conflicts = @()
        failed = @()
        ledger_error = ''
        ok = $false
    })

    $plan = @()
    foreach ($g in @($Census.groups)) {
        foreach ($n in @($g.move_names)) {
            $plan += (New-Object PSObject -Property ([ordered]@{ name = [string]$n; group = [string]$g.name }))
        }
    }
    if ($plan.Count -eq 0) { $res.ok = $true; return $res }

    foreach ($p in $plan) {
        if (Test-Path -LiteralPath (Join-Path $res.archive $p.name)) { $res.conflicts += $p.name }
    }
    if ($res.conflicts.Count -gt 0) { return $res }

    if (-not (Test-Path -LiteralPath $res.archive)) {
        New-Item -ItemType Directory -Path $res.archive -Force | Out-Null
    }
    $ledger = Join-Path $res.archive 'MOVED.tsv'
    $utf8 = New-Object System.Text.UTF8Encoding($false)
    if (-not (Test-Path -LiteralPath $ledger)) {
        [System.IO.File]::WriteAllText($ledger, "# utc`tname`tbytes`tmtime_utc`tgroup`r`n", $utf8)
    }

    $now = [DateTime]::UtcNow
    $bytesMoved = [int64]0
    $lines = New-Object System.Collections.ArrayList
    foreach ($p in $plan) {
        $src = Join-Path $Pool $p.name
        $dest = Join-Path $res.archive $p.name
        try {
            $fi = Get-Item -LiteralPath $src -ErrorAction Stop
            $len = [int64]$fi.Length
            $mtime = $fi.LastWriteTimeUtc
            Move-Item -LiteralPath $src -Destination $dest -ErrorAction Stop
            $res.moved++
            $bytesMoved = $bytesMoved + $len
            [void]$lines.Add($now.ToString('yyyy-MM-ddTHH:mm:ssZ') + "`t" + $p.name + "`t" +
                $len + "`t" + $mtime.ToString('yyyy-MM-ddTHH:mm:ssZ') + "`t" + $p.group)
        } catch {
            $res.failed += ($p.name + ' :: ' + $_.Exception.Message)
        }
    }
    $res.bytes = $bytesMoved
    if ($lines.Count -gt 0) {
        try {
            [System.IO.File]::AppendAllText($ledger, (($lines -join "`r`n") + "`r`n"), $utf8)
        } catch {
            # The move already happened; a missing ledger line must not pretend
            # the move failed, but it does mean the run is not clean.
            $res.ledger_error = $_.Exception.Message
        }
    }
    $res.ok = (($res.failed.Count -eq 0) -and ($res.ledger_error -eq ''))
    return $res
}

# ---------------------------------------------------------------------------
# Step 6: the inverse move. Takes the dangling list as its plan (cited names that
# sit in _archive) and puts them back in the pool. Same two-phase shape as
# Invoke-QaApply: pre-flight over the whole plan first, so a missing source or an
# occupied destination leaves the pool untouched rather than half-restored.
# ---------------------------------------------------------------------------
function Invoke-QaRestore
{
    param([string]$Pool, [string[]]$Names)

    $res = New-Object PSObject -Property ([ordered]@{
        archive = (Join-Path $Pool '_archive')
        restored = 0
        bytes = [int64]0
        conflicts = @()
        missing = @()
        failed = @()
        ledger_error = ''
        ok = $false
    })

    $plan = @($Names | Where-Object { -not [string]::IsNullOrWhiteSpace($_) } | Sort-Object)
    if ($plan.Count -eq 0) { $res.ok = $true; return $res }

    foreach ($n in $plan) {
        if (-not (Test-Path -LiteralPath (Join-Path $res.archive $n))) { $res.missing += $n }
        elseif (Test-Path -LiteralPath (Join-Path $Pool $n)) { $res.conflicts += $n }
    }
    if (($res.missing.Count -gt 0) -or ($res.conflicts.Count -gt 0)) { return $res }

    $ledger = Join-Path $res.archive 'RESTORED.tsv'
    $utf8 = New-Object System.Text.UTF8Encoding($false)
    if (-not (Test-Path -LiteralPath $ledger)) {
        [System.IO.File]::WriteAllText($ledger, "# utc`tname`tbytes`tmtime_utc`r`n", $utf8)
    }

    $now = [DateTime]::UtcNow
    $bytesMoved = [int64]0
    $lines = New-Object System.Collections.ArrayList
    foreach ($n in $plan) {
        $src = Join-Path $res.archive $n
        $dest = Join-Path $Pool $n
        try {
            $fi = Get-Item -LiteralPath $src -ErrorAction Stop
            $len = [int64]$fi.Length
            $mtime = $fi.LastWriteTimeUtc
            Move-Item -LiteralPath $src -Destination $dest -ErrorAction Stop
            $res.restored++
            $bytesMoved = $bytesMoved + $len
            [void]$lines.Add($now.ToString('yyyy-MM-ddTHH:mm:ssZ') + "`t" + $n + "`t" + $len + "`t" +
                $mtime.ToString('yyyy-MM-ddTHH:mm:ssZ'))
        } catch {
            $res.failed += ($n + ' :: ' + $_.Exception.Message)
        }
    }
    $res.bytes = $bytesMoved
    if ($lines.Count -gt 0) {
        try {
            [System.IO.File]::AppendAllText($ledger, (($lines -join "`r`n") + "`r`n"), $utf8)
        } catch {
            # The files are back in the pool; the run is still not clean.
            $res.ledger_error = $_.Exception.Message
        }
    }
    $res.ok = (($res.failed.Count -eq 0) -and ($res.ledger_error -eq ''))
    return $res
}

if (-not $Dir) {
    $Dir = Join-Path (Split-Path -Parent (Split-Path -Parent $PSScriptRoot)) 'qa'
}
if (-not $CiteRoot) {
    $CiteRoot = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
}

# One direction per run: -Apply moves out, -Restore moves back. Asking for both
# is a contradiction, not a sequence, so it is refused before anything is read.
if ($Apply -and $Restore) {
    Write-Host 'QA SWITCH FAIL: -Apply and -Restore are mutually exclusive (one moves out, one moves back)'
    exit 2
}
if ($Restore -and $Json) {
    Write-Host 'QA SWITCH FAIL: -Restore is a move, -Json is a read-out; run them separately'
    exit 2
}

$poolFiles = Get-QaPoolFiles -Pool $Dir
if (-not $poolFiles.exists -and -not [string]::IsNullOrWhiteSpace($poolFiles.error)) {
    Write-Host ('QA POOL FAIL: cannot enumerate ' + $Dir + ' :: ' + $poolFiles.error)
    exit 2
}
$poolNames = @()
foreach ($f in @($poolFiles.files)) { $poolNames += [string]$f.Name }

# Archived names are part of the index too: that is how a citation that no
# longer resolves becomes visible instead of silent.
$archiveDir = Join-Path $Dir '_archive'
$archNames = @()
if (Test-Path -LiteralPath $archiveDir) {
    try {
        $archNames = @(Get-ChildItem -LiteralPath $archiveDir -File -ErrorAction Stop |
            Where-Object { $_.Extension -match '^\.(png|jpg|jpeg)$' } |
            ForEach-Object { [string]$_.Name })
    } catch {
        $archNames = @()
    }
}

$citeExplicit = $PSBoundParameters.ContainsKey('CiteFiles')
$cite = Get-QaCitationIndex -Root $CiteRoot -Files $CiteFiles -Explicit $citeExplicit `
    -Names (@($poolNames) + @($archNames))

# Fail-closed: if we cannot tell what the repo cites, we cannot tell what is safe
# to move. The 69 dangling names r772 left behind are the reason this is not a
# warning.
if ($poolFiles.exists -and -not $cite.ok) {
    Write-Host ('QA CITE FAIL: cannot build the citation index (' + $cite.error +
        ') - refusing to plan a move over evidence a document may name')
    exit 2
}

$citedSet = @{}
foreach ($k in @($cite.names.Keys)) { $citedSet[[string]$k] = $true }

$census = Get-QaPoolCensus -Pool $Dir -Files $poolFiles.files -Cited $citedSet

# Compact group breakdown for the superseded count (e.g. "panel:61,city3d:11").
# Computed once here so the record and the console line can never disagree.
$supByCompact = ''
if ($null -ne $census.superseded_by_group -and $census.superseded_by_group.Count -gt 0) {
    $supByCompact = ((@($census.superseded_by_group.Keys) | ForEach-Object {
        [string]$_ + ':' + [string]$census.superseded_by_group[$_] }) -join ',')
}

$dangling = @()
foreach ($n in $archNames) { if ($citedSet.ContainsKey([string]$n)) { $dangling += [string]$n } }

# The audit record: a reader (the panel) shows these numbers with their own age
# instead of rebuilding the citation index on every tick (~2.4 s per run). The
# record is a reading, not a decision - nothing rotates because of it.
if ($Record -and [string]::IsNullOrWhiteSpace($RecordPath)) {
    $RecordPath = Join-Path (Split-Path -Parent (Split-Path -Parent $PSScriptRoot)) 'logs\.qa-cite-audit.json'
}
if (-not [string]::IsNullOrWhiteSpace($RecordPath)) {
    # NOT $record: the -Record switch param and a local $record are the same
    # slot (PowerShell variable names are case-insensitive). First cut assigned
    # the hashtable onto the switch and PS refused to set 'utc' on a
    # SwitchParameter - the same trap as $files/$Files in r777.
    $recObj = [ordered]@{
        utc = [DateTime]::UtcNow.ToString('yyyy-MM-ddTHH:mm:ssZ')
        images = [int]$census.images
        bytes = [int64]$census.bytes
        cited = [int]$census.cited
        stale_days = [int]$StaleDays
        stale_cited = [int]$census.stale_cited
        stale_cited_bytes = [int64]$census.stale_cited_bytes
        superseded_cited = [int]$census.superseded_cited
        superseded_by_group = [string]$supByCompact
        newer_sibling_cited = [int]$census.newer_sibling_cited
        sibling_margin_min = [int]$SiblingMarginMin
        archive_cited = @($dangling).Count
        cite_mode = [string]$cite.mode
        cite_scanned = [int]$cite.scanned
    }
    $recJson = ConvertTo-Json -InputObject $recObj -Depth 4 -Compress
    $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
    $tmp = $RecordPath + '.new-' + $PID
    try {
        $recDir = Split-Path -Parent $RecordPath
        if ($recDir -and -not (Test-Path -LiteralPath $recDir)) { New-Item -ItemType Directory -Path $recDir -Force | Out-Null }
        [System.IO.File]::WriteAllText($tmp, $recJson, $utf8NoBom)
        Move-Item -LiteralPath $tmp -Destination $RecordPath -Force
        if (-not $Json) { Write-Host ('QA RECORD: ' + $RecordPath + ' (reading only; nothing rotated)') }
    } catch {
        if (Test-Path -LiteralPath $tmp) { Remove-Item -LiteralPath $tmp -Force -ErrorAction SilentlyContinue }
        if (-not $Json) {
            Write-Host ('QA RECORD FAIL: ' + $RecordPath + ' :: ' + $_.Exception.Message)
        }
        if (-not $Json) { exit 2 }
    }
}

if ($Json) {
    $payload = [ordered]@{
        exists = $census.exists
        images = $census.images
        bytes = $census.bytes
        oldest_days = $census.oldest_days
        keep_family = $KeepFamily
        keep_panel = $KeepPanel
        cited = $census.cited
        cited_kept = $census.cited_kept
        stale_days = $StaleDays
        stale_cited = $census.stale_cited
        stale_cited_bytes = $census.stale_cited_bytes
        superseded_cited = $census.superseded_cited
        superseded_by_group = [string]$supByCompact
        newer_sibling_cited = $census.newer_sibling_cited
        cite_scanned = $cite.scanned
        cite_mode = $cite.mode
        archive_cited = @($dangling).Count
        groups = @($census.groups | ForEach-Object {
            [ordered]@{
                name = $_.name; count = $_.count; bytes = $_.bytes; keep = $_.keep
                sessions = $_.sessions; move = $_.move; reclaim = $_.reclaim
                oldest_days = $_.oldest_days; move_names = @($_.move_names)
                cited = $_.cited; cited_kept = $_.cited_kept; cited_names = @($_.cited_names)
                stale_cited = $_.stale_cited; superseded_cited = $_.superseded_cited
                newer_sibling_cited = $_.newer_sibling_cited
                stale_cited_names = @($_.stale_cited_names)
                superseded_cited_names = @($_.superseded_cited_names)
            }
        })
    }
    (ConvertTo-Json -InputObject $payload -Depth 5 -Compress)
    if ($census.exists) { exit 0 } else { exit 2 }
}

if (-not $census.exists) {
    Write-Host ("QA POOL FAIL: dir missing or unreadable: " + $Dir)
    exit 2
}

$head = 'QA POOL: images=' + $census.images + ' bytes=' + (Format-QaBytes -Bytes $census.bytes) +
    ' oldest=' + $census.oldest_days + 'd'
Write-Host ($head + ' dir=' + $Dir)
Write-Host ('QA CITE: cited=' + $census.cited + '/' + $census.images + ' in pool, archive_cited=' +
    @($dangling).Count + ' (index=' + $cite.mode + ' scanned=' + $cite.scanned + ' md/txt)')
$supByTok = $(if ($supByCompact) { ' superseded_by=' + $supByCompact } else { '' })
Write-Host ('QA STALE: stale_cited=' + $census.stale_cited + '/' + $census.cited +
    ' older_than=' + $StaleDays + 'd bytes=' + (Format-QaBytes -Bytes $census.stale_cited_bytes) +
    ' superseded_cited=' + $census.superseded_cited + $supByTok +
    ' newer_sibling_cited=' + $census.newer_sibling_cited +
    ' sibling_margin=' + $SiblingMarginMin + 'min' +
    ' (report only: a cited file is never moved)')

$moves = 0
$reclaim = [int64]0
foreach ($g in $census.groups) {
    $keepTxt = $(if ($g.keep -lt 0) { 'all' } else { [string]$g.keep })
    $sessTxt = $(if ($g.keep -lt 0) { 'n/a' } else { [string]$g.sessions })
    $line = '  ' + $g.name.PadRight(7) + ' n=' + $g.count + ' sessions=' + $sessTxt +
        ' bytes=' + (Format-QaBytes -Bytes $g.bytes) +
        ' keep=' + $keepTxt + ' move=' + $g.move + ' reclaim=' + (Format-QaBytes -Bytes $g.reclaim) +
        ' oldest=' + $g.oldest_days + 'd' + ' cited=' + $g.cited + ' stale=' + $g.stale_cited
    Write-Host $line
    $moves += $g.move
    $reclaim += $g.reclaim
    if ($List) {
        foreach ($n in $g.move_names) { Write-Host ('    MOVE ' + $n) }
        foreach ($n in $g.cited_names) {
            $src = ''
            if ($cite.sources.ContainsKey([string]$n)) { $src = (@($cite.sources[[string]$n]) | Select-Object -First 1) }
            Write-Host ('    KEEP ' + $n + ' (cited: ' + $src + ')')
        }
        foreach ($n in @($g.stale_cited_names)) { Write-Host ('    STALE ' + $n) }
        foreach ($n in @($g.superseded_cited_names)) { Write-Host ('    SUPERSEDED ' + $n) }
    }
}
$planTail = $(if ($Apply) { ' (apply follows)' } else { ' (dry-run, nothing touched)' })
Write-Host ('QA PLAN: moves=' + $moves + ' reclaim=' + (Format-QaBytes -Bytes $reclaim) +
    ' keep_sessions=' + $KeepFamily + ' keep_panel=' + $KeepPanel +
    ' cited_kept=' + $census.cited_kept + $planTail)
if (@($dangling).Count -gt 0) {
    Write-Host ('QA DANGLING: ' + @($dangling).Count + ' cited name(s) sit in _archive - ' +
        'a tracked document names a path that is no longer in the pool')
    if ($List) {
        foreach ($n in @($dangling | Sort-Object)) {
            Write-Host ('    DANGLING ' + $n)
        }
    }
}

# ---------------------------------------------------------------------------
# Step 6: repair. The dangling list is the plan; nothing else is touched, and a
# single missing source or occupied destination cancels the whole run.
# ---------------------------------------------------------------------------
if ($Restore) {
    $planCount = @($dangling).Count
    Write-Host ('QA RESTORE PLAN: n=' + $planCount + ' cited name(s) in ' + $archiveDir +
        ' (fail-closed: one missing or occupied name moves nothing)')
    $rs = Invoke-QaRestore -Pool $Dir -Names $dangling
    if ($rs.missing.Count -gt 0) {
        Write-Host ('QA RESTORE FAIL: ' + $rs.missing.Count + ' planned name(s) are not in ' +
            $rs.archive + ' - nothing moved (the plan and the archive disagree)')
        foreach ($n in $rs.missing) { Write-Host ('    MISSING ' + $n) }
        exit 2
    }
    if ($rs.conflicts.Count -gt 0) {
        Write-Host ('QA RESTORE FAIL: ' + $rs.conflicts.Count + ' planned name(s) already exist in ' +
            $Dir + ' - nothing moved (never overwrite the pool copy)')
        foreach ($n in $rs.conflicts) { Write-Host ('    OCCUPIED ' + $n) }
        exit 2
    }
    if ($rs.failed.Count -gt 0) {
        Write-Host ('QA RESTORE FAIL: restored=' + $rs.restored + ' bytes=' +
            (Format-QaBytes -Bytes $rs.bytes) + ' failed=' + $rs.failed.Count)
        foreach ($f in $rs.failed) { Write-Host ('    FAILED ' + $f) }
        exit 2
    }
    if ($rs.ledger_error) {
        Write-Host ('QA RESTORE FAIL: restored=' + $rs.restored +
            ' but the restore ledger could not be written: ' + $rs.ledger_error)
        exit 2
    }
    Write-Host ('QA RESTORE: restored=' + $rs.restored + ' bytes=' + (Format-QaBytes -Bytes $rs.bytes) +
        ' pool=' + $Dir + ' (moved back, nothing overwritten; ledger=RESTORED.tsv)')
    # Re-read the file system instead of doing arithmetic on the plan: the only
    # number worth printing is the one a second, independent read agrees with.
    $afterFiles = Get-QaPoolFiles -Pool $Dir
    $afterCensus = Get-QaPoolCensus -Pool $Dir -Files $afterFiles.files -Cited $citedSet
    Write-Host ('QA POOL: images=' + $afterCensus.images + ' bytes=' +
        (Format-QaBytes -Bytes $afterCensus.bytes) + ' oldest=' + $afterCensus.oldest_days + 'd')
    $stillDangling = @()
    if (Test-Path -LiteralPath $archiveDir) {
        foreach ($f in @(Get-ChildItem -LiteralPath $archiveDir -File -ErrorAction SilentlyContinue |
            Where-Object { $_.Extension -match '^\.(png|jpg|jpeg)$' })) {
            if ($citedSet.ContainsKey([string]$f.Name) -and $citedSet[[string]$f.Name] -and
                -not ($afterFiles.files | Where-Object { $_.Name -eq $f.Name })) {
                $stillDangling += [string]$f.Name
            }
        }
    }
    Write-Host ('QA DANGLING: ' + $stillDangling.Count + ' cited name(s) still sit in _archive')
    foreach ($n in @($stillDangling | Sort-Object)) { Write-Host ('    DANGLING ' + $n) }
    if ($stillDangling.Count -gt 0) { exit 2 }
    exit 0
}

if ($Apply) {
    $ap = Invoke-QaApply -Pool $Dir -Census $census
    if ($ap.conflicts.Count -gt 0) {
        Write-Host ('QA APPLY FAIL: ' + $ap.conflicts.Count + ' planned name(s) already in ' +
            $ap.archive + ' - nothing moved (pool and archive disagree)')
        foreach ($n in $ap.conflicts) { Write-Host ('    CONFLICT ' + $n) }
        exit 2
    }
    if ($ap.failed.Count -gt 0) {
        Write-Host ('QA APPLY FAIL: moved=' + $ap.moved + ' bytes=' + (Format-QaBytes -Bytes $ap.bytes) +
            ' failed=' + $ap.failed.Count)
        foreach ($f in $ap.failed) { Write-Host ('    FAILED ' + $f) }
        exit 2
    }
    if ($ap.ledger_error) {
        Write-Host ('QA APPLY FAIL: moved=' + $ap.moved + ' but the archive ledger could not be written: ' + $ap.ledger_error)
        exit 2
    }
    Write-Host ('QA APPLY: moved=' + $ap.moved + ' bytes=' + (Format-QaBytes -Bytes $ap.bytes) +
        ' archive=' + $ap.archive + ' (moved, not deleted; ledger=MOVED.tsv)')
}
exit 0