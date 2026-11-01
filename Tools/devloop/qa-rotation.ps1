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
# This round ships steps 1-2 only: the census and the dry-run plan. Nothing is
# moved or deleted by this script, and -Plan never touches the file system.
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
    [switch]$Json
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
Write-Host ('QA PLAN: moves=' + $moves + ' reclaim=' + (Format-QaBytes -Bytes $reclaim) +
    ' keep_sessions=' + $KeepFamily + ' keep_panel=' + $KeepPanel + ' (dry-run, nothing touched)')
exit 0