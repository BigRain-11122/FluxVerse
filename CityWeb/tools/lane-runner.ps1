# lane-runner.ps1 - CityWeb lane package builder (ASCII only).
# One invocation = prepare ONE lane for an executor (AI session) on this machine.
# Steps: sync -> pick open lane matching caps -> claim (lease) -> worktree -> PROMPT.md
#        -> [optional] run executor -> gates (tsc/build) -> commit lane branch -> push.
# Without -Execute the runner only PREPARES the package (safe default; no AI spend).
param(
    [string]$Machine = $env:COMPUTERNAME,
    [string]$LaneId = '',                 # empty = auto-pick first open matching lane
    [string]$Caps = '',                   # e.g. "node,tsc" (empty = read from board machines)
    [switch]$Execute,                     # actually invoke the executor
    [string]$Executor = 'codely',         # executor command (must accept -p <promptFile>)
    [switch]$FullGate,                    # also run playwright smoke (slow)
    [int]$LeaseHours = 4,
    [string]$WorktreeRoot = ''
)

$ErrorActionPreference = 'Stop'
$cityWeb = Split-Path $PSScriptRoot -Parent
$repoRoot = Split-Path $cityWeb -Parent
$boardPath = Join-Path $cityWeb 'lane-board.json'
$claimScript = Join-Path $PSScriptRoot 'lane-claim.ps1'
if (-not $WorktreeRoot) { $WorktreeRoot = Join-Path $repoRoot '_lane' }

function Get-Board {
    $raw = [System.IO.File]::ReadAllText($boardPath, (New-Object System.Text.UTF8Encoding($false)))
    return $raw | ConvertFrom-Json
}

# ---- 1. sync ----
git -C $repoRoot fetch origin 2>$null | Out-Null
git -C $repoRoot pull --rebase origin main 2>$null | Out-Null
$board = Get-Board

# ---- 2. caps ----
$capList = @()
if ($Caps) {
    $capList = ($Caps -split ',') | ForEach-Object { $_.Trim() } | Where-Object { $_ }
} else {
    $me = $board.machines | Where-Object { $_.id -eq $Machine }
    if ($me) { $capList = @($me.caps) }
}
if ($capList.Count -eq 0) {
    Write-Output 'RUNNER: no caps known; pass -Caps "node,tsc"'
    exit 2
}

# ---- 3. pick lane ----
$nowUtc = (Get-Date).ToUniversalTime()
$pickable = $board.lanes | Where-Object {
    $_.status -eq 'open' -and -not $_.claim
} | Where-Object {
    $need = @($_.caps)
    $ok = $true
    foreach ($c in $need) { if ($capList -notcontains $c) { $ok = $false; break } }
    $ok
} | Sort-Object { [int]$_.priority }

if ($LaneId) { $pickable = $pickable | Where-Object { $_.id -eq $LaneId } }
$lane = $pickable | Select-Object -First 1
if (-not $lane) {
    Write-Output ('RUNNER: no open lane matches caps [' + ($capList -join ',') + ']')
    exit 0
}

# ---- 4. claim ----
& powershell -NoProfile -ExecutionPolicy Bypass -File $claimScript -Action claim -Machine $Machine -Lane $lane.id -LeaseHours $LeaseHours
if ($LASTEXITCODE -ne 0) { Write-Output 'RUNNER: claim failed'; exit 3 }

# ---- 5. worktree ----
$wtPath = Join-Path $WorktreeRoot $lane.id
$branch = 'lane/' + $lane.id
if (Test-Path $wtPath) { git -C $repoRoot worktree remove $wtPath --force 2>$null | Out-Null }
git -C $repoRoot worktree add $wtPath -b $branch HEAD 2>$null | Out-Null
if (-not (Test-Path $wtPath)) {
    # branch exists already -> attach
    git -C $repoRoot worktree add $wtPath $branch 2>$null | Out-Null
}
if (-not (Test-Path $wtPath)) { Write-Output 'RUNNER: worktree failed'; exit 4 }

# ---- 6. PROMPT.md (lane contract template) ----
$scope = ($lane.fileScope -join '`n- ')
$prompt = @"
# LANE $($lane.id) — $($lane.title)

You are the executor for CityWeb lane $($lane.id) on machine $Machine.
Work ONLY inside this worktree: $wtPath

## Hard laws (docs/multi-machine-lanes.md)
1. Only create/modify files under your scope:
- $scope
2. Never edit main.ts / registry.ts / package.json / tsconfig (coordinator-only).
3. Verify before push: npx tsc --noEmit (must be zero) then node tools/build-static.mjs (must succeed).
4. Commit: git -C "$wtPath" add <your files>; commit -m "lane $($lane.id): <what>".
5. Do NOT push to main. Coordinator merges your branch $branch.

## Deliverable
Implement the lane per its title with matching repo conventions (English why-comments,
shared module-level geometry, deterministic seeds, no external assets).
Write a short .notes.md next to your main file listing: contract, decisions, verify output.
"@
[System.IO.File]::WriteAllText((Join-Path $wtPath "PROMPT-$($lane.id).md"), $prompt, (New-Object System.Text.UTF8Encoding($false)))
Write-Output ('RUNNER: prepared lane ' + $lane.id + ' at ' + $wtPath)

if (-not $Execute) {
    Write-Output ('RUNNER: dry-prepare only. Execute manually: ' + $Executor + ' -p "' + (Join-Path $wtPath ('PROMPT-' + $lane.id + '.md')) + '"')
    exit 0
}

# ---- 7. execute (optional) ----
Set-Location (Join-Path $wtPath 'CityWeb')
& $Executor -p (Join-Path $wtPath ('PROMPT-' + $lane.id + '.md')) --yolo 2>&1 | Write-Output
$execRc = $LASTEXITCODE

# ---- 8. gates ----
$gateOk = $true
npx tsc --noEmit 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) { $gateOk = $false; Write-Output 'GATE: tsc FAIL' }
node tools/build-static.mjs 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) { $gateOk = $false; Write-Output 'GATE: build FAIL' }
if ($FullGate) {
    if (Test-Path 'qa\perf_probe.py') {
        python qa\perf_probe.py 2>&1 | Out-Null
        if ($LASTEXITCODE -ne 0) { $gateOk = $false; Write-Output 'GATE: smoke FAIL' }
    }
}

# ---- 9. commit + push branch ----
git -C $wtPath add -A 2>$null | Out-Null
git -C $wtPath commit -m ("lane " + $lane.id + ": executor output") 2>$null | Out-Null
git -C $wtPath push origin HEAD:refs/heads/$branch 2>$null | Out-Null
$pushOk = ($LASTEXITCODE -eq 0)

# ---- 10. release ----
if ($gateOk -and $pushOk) {
    & powershell -NoProfile -ExecutionPolicy Bypass -File $claimScript -Action release -Machine $Machine -Lane $lane.id -Status 'claimed' | Out-Null
    Write-Output ('RUNNER: lane ' + $lane.id + ' pushed to ' + $branch + ' (waiting coordinator merge)')
} else {
    Write-Output ('RUNNER: gates=' + $gateOk + ' push=' + $pushOk + ' — lane kept claimed for retry')
}
Write-Output ('RUNNER: executor rc=' + $execRc)
