# lane-claim.ps1 - CityWeb multi-machine lane board client (ASCII only).
# Actions: register | claim | release | heartbeat | list
# Board = CityWeb/lane-board.json (git = transport between machines).
# Law: docs/multi-machine-lanes.md (claims carry leases; only open/expired lanes are claimable).
param(
    [Parameter(Mandatory = $true)][ValidateSet('register', 'claim', 'release', 'heartbeat', 'list')]
    [string]$Action,
    [string]$Machine = $env:COMPUTERNAME,
    [string]$Caps = '',
    [string]$Lane = '',
    [string]$Status = 'done',          # release result: done | open
    [int]$LeaseHours = 4,
    [string]$Branch = ''
)

$ErrorActionPreference = 'Stop'
$cityWeb = Split-Path $PSScriptRoot -Parent
$boardPath = Join-Path $cityWeb 'lane-board.json'
$repoRoot = Split-Path $cityWeb -Parent

function Read-Board {
    $raw = [System.IO.File]::ReadAllText($boardPath, (New-Object System.Text.UTF8Encoding($false)))
    return $raw | ConvertFrom-Json
}

function Write-Board([object]$board) {
    $board.updated_utc = (Get-Date).ToUniversalTime().ToString('yyyy-MM-ddTHH:mm:ssZ')
    $json = $board | ConvertTo-Json -Depth 10
    $tmp = "$boardPath.tmp"
    [System.IO.File]::WriteAllText($tmp, $json, (New-Object System.Text.UTF8Encoding($false)))
    Move-Item $tmp $boardPath -Force
}

function Save-And-Push([object]$board, [string]$msg) {
    Write-Board $board
    $rel = 'CityWeb/lane-board.json'
    git -C $repoRoot add $rel
    git -C $repoRoot commit -m $msg 2>$null | Out-Null
    for ($i = 0; $i -lt 3; $i++) {
        git -C $repoRoot push origin HEAD:main 2>$null | Out-Null
        if ($LASTEXITCODE -eq 0) { return $true }
        git -C $repoRoot pull --rebase origin main 2>$null | Out-Null
        # re-read after rebase: merge other machine changes into our intent
        $board = Read-Board
        Write-Board $board
        git -C $repoRoot add $rel 2>$null | Out-Null
        git -C $repoRoot commit -m $msg 2>$null | Out-Null
    }
    return $false
}

$board = Read-Board
$nowUtc = (Get-Date).ToUniversalTime()

switch ($Action) {
    'list' {
        '{0,-4} {1,-9} {2,-10} {3,-18} {4}' -f 'ID', 'DOMAIN', 'STATUS', 'CLAIM', 'TITLE' | Write-Output
        foreach ($l in $board.lanes) {
            $claimTxt = '-'
            if ($l.claim) {
                $exp = ''
                if ($l.claim.lease_until_utc) {
                    $exp = ' [' + $l.claim.machine + ' until ' + $l.claim.lease_until_utc + ']'
                }
                $claimTxt = $l.claim.machine + $exp
            }
            '{0,-4} {1,-9} {2,-10} {3,-18} {4}' -f $l.id, $l.domain, $l.status, $claimTxt, $l.title | Write-Output
        }
    }
    'register' {
        $capList = @()
        if ($Caps) { $capList = ($Caps -split ',') | ForEach-Object { $_.Trim() } | Where-Object { $_ } }
        $me = $board.machines | Where-Object { $_.id -eq $Machine }
        if ($me) {
            $me.caps = $capList
            $me.last_seen_utc = $nowUtc.ToString('yyyy-MM-ddTHH:mm:ssZ')
        } else {
            $board.machines += [pscustomobject]@{
                id = $Machine; host = $env:COMPUTERNAME; caps = $capList
                last_seen_utc = $nowUtc.ToString('yyyy-MM-ddTHH:mm:ssZ')
                repo_present = $true; role = 'POOL-CUSTOM'
            }
        }
        $ok = Save-And-Push $board ("lane-board: register " + $Machine + " caps=" + $Caps)
        Write-Output ("REGISTER " + $(if ($ok) { 'OK' } else { 'PUSH-FAIL' }))
    }
    'claim' {
        if (-not $Lane) { throw 'claim needs -Lane <id>' }
        $l = $board.lanes | Where-Object { $_.id -eq $Lane }
        if (-not $l) { throw ("lane not found: " + $Lane) }
        if ($l.status -eq 'done') { Write-Output ('CLAIM REFUSED: ' + $Lane + ' already done'); exit 2 }
        if ($l.claim) {
            $expired = $true
            if ($l.claim.lease_until_utc) {
                try { $expired = ([datetime]::Parse($l.claim.lease_until_utc, $null, 'RoundtripKind') -lt $nowUtc) } catch { $expired = $true }
            }
            if (-not $expired -and $l.claim.machine -ne $Machine) {
                Write-Output ('CLAIM REFUSED: held by ' + $l.claim.machine + ' until ' + $l.claim.lease_until_utc)
                exit 3
            }
        }
        $br = $Branch
        if (-not $br) { $br = 'lane/' + $Lane }
        $l.status = 'claimed'
        $l.claim = [pscustomobject]@{
            machine = $Machine; host = $env:COMPUTERNAME
            lease_until_utc = $nowUtc.AddHours($LeaseHours).ToString('yyyy-MM-ddTHH:mm:ssZ')
            branch = $br
        }
        $ok = Save-And-Push $board ("lane-board: claim " + $Lane + " by " + $Machine + " (lease " + $LeaseHours + "h)")
        Write-Output ('CLAIM ' + $(if ($ok) { 'OK' } else { 'PUSH-FAIL' }) + ' ' + $Lane + ' lease=' + $LeaseHours + 'h branch=' + $br)
    }
    'release' {
        if (-not $Lane) { throw 'release needs -Lane <id>' }
        $l = $board.lanes | Where-Object { $_.id -eq $Lane }
        if (-not $l) { throw ("lane not found: " + $Lane) }
        if ($l.claim -and $l.claim.machine -ne $Machine) {
            Write-Output ('RELEASE REFUSED: not your lane (' + $l.claim.machine + ')'); exit 3
        }
        $l.status = $Status
        $l.claim = $null
        $ok = Save-And-Push $board ("lane-board: release " + $Lane + " -> " + $Status + " by " + $Machine)
        Write-Output ('RELEASE ' + $(if ($ok) { 'OK' } else { 'PUSH-FAIL' }) + ' ' + $Lane + ' -> ' + $Status)
    }
    'heartbeat' {
        $me = $board.machines | Where-Object { $_.id -eq $Machine }
        if ($me) {
            $me.last_seen_utc = $nowUtc.ToString('yyyy-MM-ddTHH:mm:ssZ')
        } else {
            $board.machines += [pscustomobject]@{ id = $Machine; host = $env:COMPUTERNAME; caps = @(); last_seen_utc = $nowUtc.ToString('yyyy-MM-ddTHH:mm:ssZ'); repo_present = $true; role = 'POOL-CUSTOM' }
        }
        foreach ($l in $board.lanes) {
            if ($l.claim -and $l.claim.machine -eq $Machine) {
                $l.claim.lease_until_utc = $nowUtc.AddHours($LeaseHours).ToString('yyyy-MM-ddTHH:mm:ssZ')
            }
        }
        $ok = Save-And-Push $board ("lane-board: heartbeat " + $Machine)
        Write-Output ('HEARTBEAT ' + $(if ($ok) { 'OK' } else { 'PUSH-FAIL' }) + ' ' + $Machine)
    }
}
