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
# Read-only, no network, ASCII-only (PS5.1 GBK law).
[CmdletBinding()]
param(
    # Pool directory. Empty = <repo>/qa.
    [string]$Dir = '',
    # Rolling window per evidence family, counted in SESSIONS (see Get-QaSessionKey).
    [int]$KeepFamily = 3,
    # Rolling window for panel self-shots (never inlined), counted in FILES.
    [int]$KeepPanel = 3,
    # Print one MOVE line per file the plan would move.
    [switch]$List,
    # Machine-readable one-json-line output (used by the sandbox).
    [switch]$Json,
    # Actually move the planned files into <pool>\_archive (never deletes).
    [switch]$Apply
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

function Get-QaPoolCensus
{
    param([string]$Pool)
    $res = New-Object PSObject -Property ([ordered]@{
        dir = $Pool; exists = $false; images = 0; bytes = 0; oldest_days = -1
        groups = @()
    })
    if ([string]::IsNullOrWhiteSpace($Pool)) { return $res }
    if (-not (Test-Path -LiteralPath $Pool)) { return $res }
    $res.exists = $true
    $files = @()
    try {
        $files = @(Get-ChildItem -LiteralPath $Pool -File -ErrorAction Stop |
            Where-Object { $_.Extension -match '^\.(png|jpg|jpeg)$' })
    } catch {
        $res.exists = $false
        return $res
    }
    $res.images = $files.Count
    if ($files.Count -eq 0) { return $res }

    $now = (Get-Date).ToUniversalTime()
    $sum = 0
    $oldest = $null
    foreach ($f in $files) {
        $sum += [int64]$f.Length
        if ($null -eq $oldest -or $f.LastWriteTimeUtc -lt $oldest) { $oldest = $f.LastWriteTimeUtc }
    }
    $res.bytes = $sum
    if ($oldest) { $res.oldest_days = [int][Math]::Floor(($now - $oldest).TotalDays) }

    $groups = @()
    $byGroup = @{}
    foreach ($f in $files) {
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
        if ($keep -ge 0 -and $sessions.Count -gt $keep) {
            foreach ($s in @($sessions[$keep..($sessions.Count - 1)])) {
                foreach ($n in @($s.names | Sort-Object)) { $moveList += $n }
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
            move_names = @($moveList)
        }))
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

if (-not $Dir) {
    $Dir = Join-Path (Split-Path -Parent (Split-Path -Parent $PSScriptRoot)) 'qa'
}

$census = Get-QaPoolCensus -Pool $Dir

if ($Json) {
    $payload = [ordered]@{
        exists = $census.exists
        images = $census.images
        bytes = $census.bytes
        oldest_days = $census.oldest_days
        keep_family = $KeepFamily
        keep_panel = $KeepPanel
        groups = @($census.groups | ForEach-Object {
            [ordered]@{
                name = $_.name; count = $_.count; bytes = $_.bytes; keep = $_.keep
                sessions = $_.sessions; move = $_.move; reclaim = $_.reclaim
                oldest_days = $_.oldest_days; move_names = @($_.move_names)
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

$moves = 0
$reclaim = [int64]0
foreach ($g in $census.groups) {
    $keepTxt = $(if ($g.keep -lt 0) { 'all' } else { [string]$g.keep })
    $sessTxt = $(if ($g.keep -lt 0) { 'n/a' } else { [string]$g.sessions })
    $line = '  ' + $g.name.PadRight(7) + ' n=' + $g.count + ' sessions=' + $sessTxt +
        ' bytes=' + (Format-QaBytes -Bytes $g.bytes) +
        ' keep=' + $keepTxt + ' move=' + $g.move + ' reclaim=' + (Format-QaBytes -Bytes $g.reclaim) +
        ' oldest=' + $g.oldest_days + 'd'
    Write-Host $line
    $moves += $g.move
    $reclaim += $g.reclaim
    if ($List) {
        foreach ($n in $g.move_names) { Write-Host ('    MOVE ' + $n) }
    }
}
$planTail = $(if ($Apply) { ' (apply follows)' } else { ' (dry-run, nothing touched)' })
Write-Host ('QA PLAN: moves=' + $moves + ' reclaim=' + (Format-QaBytes -Bytes $reclaim) +
    ' keep_sessions=' + $KeepFamily + ' keep_panel=' + $KeepPanel + $planTail)

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