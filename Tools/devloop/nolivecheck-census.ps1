# nolivecheck-census.ps1 - main#77: the no-live-check switch must never reach production
# ------------------------------------------------------------------------------------
# WHY (r765): Tools\devloop\write-fastpath-state.ps1 v1.2 compares every explicit
# 12-hex input against the LIVE file hash before it touches the state file, because
# a wrong value written there is worse than no value: the next round's c3/c4/c6/c7
# compare state against disk, and a stale-but-plausible value either fires a fake
# FULL-ROUND forever or (worse) matches by accident and silences a real change.
# The writer still owns a sandbox-only escape hatch that skips that comparison.
# Until now the only thing keeping it out of the wrap-up call chain was convention
# (a header comment saying "no production round may pass it"); nothing turned
# "only the writer and its sandboxes may name it" into a checkable fact.
#
# WHAT: a static, read-only census. For every scanned script file (ps1/cmd/bat/vbs
# under the repo, with build/vendor trees pruned) count the lines that name the
# switch, classify each hit as comment or code, and compare the hit set against
# the whitelist. Whitelisted hits are silent; anything else is reported by path
# and line. A whitelisted path with no hit is reported as stale - informational
# only, because retiring a sandbox is legitimate, but the list should not keep
# naming a file that stopped using it (r759: a whitelist that nobody prunes
# quietly becomes a pass-through).
#
# The hit token is assembled from two pieces on purpose: this file must not trip
# its own census, and neither may the sandbox that exercises it.
#
# COST BUDGET (main#104, r768): this census runs inside every tick, so its cost
# is part of the gate's own cached-round budget (3 s, asserted by
# test-verify-ps-suites case b3). r765's first version cost ~0.43 s and pushed
# that round over its line before anybody could see why; the pruning and the
# single-IndexOf pass brought it to ~0.16-0.17 s. The lesson is not "it is fast
# now" but "nobody would notice it getting slow again": the tree grows, and the
# first symptom would be the gate's own b3 going red with no attribution. So the
# run reports its own elapsed milliseconds and judges them against a budget it
# states out loud. Crossing the budget is INFORMATIONAL (exit stays 0) and names
# the sanctioned remedy from main#104 - move the census out of the per-tick
# section (ride check-fastpath.ps1) or shrink the scan. Raising the gate's 3 s
# budget to absorb it is explicitly not the fix.
#
# HONEST BOUNDARY: a text scan cannot prove the switch is *reached* at runtime,
# only that the token is or is not written down. A call assembled from pieces
# would slip through (and the sandbox builds its fixtures that way, which is the
# same hole seen from the other side). It also does not judge whether a hit is a
# sane sandbox use - that stays a reviewer question. The cost figure is this
# process's wall clock for scanning only - it excludes fixing that number.
#
# Usage: powershell -ExecutionPolicy Bypass -File nolivecheck-census.ps1 [-ScanRoot <dir>] [-FailOnUnexpected] [-BudgetMs <int>]
# Exit:  0 = census produced; 2 = unexpected hit(s) AND -FailOnUnexpected given.
# ASCII-only law (PS5.1 GBK trap). No auto-variable locals (r164).

param(
    [string]$ScanRoot = '',
    [switch]$FailOnUnexpected,
    [int]$BudgetMs = 250
)

$ErrorActionPreference = 'Stop'
$costSw = New-Object System.Diagnostics.Stopwatch
$costSw.Start()

$hitText = '-' + 'NoLiveCheck'

# Owner of the switch (defines and guards it) plus the sandboxes that drill it.
# A production call path must never appear here.
$allowList = @(
    'Tools\devloop\write-fastpath-state.ps1',
    'Tools\devloop\test-fastpath-state-live.ps1',
    'logs\devloop-r197-writer-test.ps1',
    'logs\devloop-r271-keep-negcon.ps1'
)

if ([string]::IsNullOrEmpty($ScanRoot)) {
    $toolsDir = Split-Path -Parent $PSScriptRoot
    $ScanRoot = Split-Path -Parent $toolsDir
}
if (-not (Test-Path -LiteralPath $ScanRoot)) {
    Write-Output ('nolivecheck-census: files=0 hits=0 allowed=0 unexpected=0 stale=0 (scan root missing: ' + $ScanRoot + ')')
    exit 1
}
$rootNorm = (Resolve-Path -LiteralPath $ScanRoot).Path.TrimEnd('\')

# Build/vendor trees are pruned at the directory level: recursing into a Unity
# Library or node_modules just to throw the names away would dominate the cost.
$skipNames = @('.git', 'Library', 'Temp', 'obj', 'bin', 'node_modules')
# Unity asset payload trees are pruned by RELATIVE path, and the pruned set is
# printed on every run so the blind spot stays visible instead of silent.
# Measured r765: City3D\Assets+Packages = 447 dirs / 51k files / 0 script files,
# City\Assets = 4.9k files / 0 script files - together 224 ms of the 400 ms the
# census cost per tick, which was enough to push the gate's cached-verify round
# past its own 3 s budget (test-verify-ps-suites case b3 caught it).
$pruneRel = @(
    'City3D\Assets', 'City3D\Packages',
    'City\Assets', 'City\Packages'
)
$scanExts = @('.ps1', '.cmd', '.bat', '.vbs')

$allFiles = New-Object System.Collections.ArrayList
$stack = New-Object System.Collections.Stack
$stack.Push($rootNorm)
while ($stack.Count -gt 0) {
    $dir = [string]$stack.Pop()
    $subs = @()
    try { $subs = @([System.IO.Directory]::GetDirectories($dir)) } catch { $subs = @() }
    foreach ($sub in $subs) {
        $leaf = [System.IO.Path]::GetFileName($sub)
        if ($skipNames -contains $leaf) { continue }
        # Full scratch trees (r743: .codely-cli\tmp holds hand-run throwaway
        # scripts that are never part of a production chain).
        if ($sub -match '\\\.codely-cli\\tmp$') { continue }
        $subRel = $sub.Substring($rootNorm.Length).TrimStart('\')
        $pruned = $false
        foreach ($pr in $pruneRel) {
            if ($subRel -eq $pr -or $subRel.StartsWith($pr + '\')) { $pruned = $true; break }
        }
        if ($pruned) { continue }
        $stack.Push($sub)
    }
    $files = @()
    try { $files = @([System.IO.Directory]::GetFiles($dir)) } catch { $files = @() }
    foreach ($f in $files) {
        $ext = [System.IO.Path]::GetExtension($f).ToLower()
        if ($scanExts -contains $ext) { [void]$allFiles.Add($f) }
    }
}

$allowedRows = New-Object System.Collections.ArrayList
$unexpectedRows = New-Object System.Collections.ArrayList
$hitFiles = @{}
$hitCount = 0

foreach ($f in $allFiles) {
    $rel = $f.Substring($rootNorm.Length).TrimStart('\')
    # Read once as text and ask for the token BEFORE splitting into lines: the
    # overwhelming majority of files do not name the switch at all, and paying a
    # line array plus one IndexOf per line for all of them cost ~0.43 s per run
    # - enough to push the tick's cached-verify round past its own 3 s budget
    # (the gate-of-the-gate sandbox caught it, r765).
    $text = ''
    try { $text = [System.IO.File]::ReadAllText($f, [System.Text.Encoding]::UTF8) } catch { continue }
    if ($text.IndexOf($hitText, [System.StringComparison]::Ordinal) -lt 0) { continue }
    $lines = @($text -split "`r?`n")
    $allowed = $false
    foreach ($a in $allowList) {
        if ($rel -eq $a) { $allowed = $true; break }
    }
    $lineno = 0
    foreach ($ln in $lines) {
        $lineno++
        if ($ln.IndexOf($hitText, [System.StringComparison]::Ordinal) -lt 0) { continue }
        $hitCount++
        $hitFiles[$rel] = $true
        $trimmed = $ln.Trim()
        $kind = 'code'
        if ($trimmed.StartsWith('#')) { $kind = 'comment' }
        if ($trimmed.Length -gt 120) { $trimmed = $trimmed.Substring(0, 120) + '...' }
        $row = [pscustomobject]@{
            Rel = $rel; Line = $lineno; Kind = $kind; Text = $trimmed; Ok = $allowed
        }
        if ($allowed) { [void]$allowedRows.Add($row) } else { [void]$unexpectedRows.Add($row) }
    }
}

$staleRows = New-Object System.Collections.ArrayList
foreach ($a in $allowList) {
    if (-not $hitFiles.ContainsKey($a)) { [void]$staleRows.Add($a) }
}

$costSw.Stop()
$costMs = [int]$costSw.ElapsedMilliseconds
$overBudget = ($costMs -gt $BudgetMs)

Write-Output ('nolivecheck-census: files=' + $allFiles.Count + ' hits=' + $hitCount +
    ' allowed=' + $allowedRows.Count + ' unexpected=' + $unexpectedRows.Count +
    ' stale=' + $staleRows.Count +
    ' ms=' + $costMs + ' budget=' + $BudgetMs)
if ($overBudget) {
    Write-Output ('BUDGET OVER: ' + $costMs + 'ms > ' + $BudgetMs + 'ms - this census runs on every tick, so its cost is part of the gate''s cached-round budget (3 s). Move it out of the per-tick section (ride check-fastpath.ps1) or shrink the scan; do not raise that budget to absorb it.')
}
Write-Output ('scan root: ' + $rootNorm)
Write-Output ('pruned: ' + ($pruneRel -join ', '))
Write-Output ''
foreach ($r in $allowedRows) {
    Write-Output ('  allowed  {0}:{1}  [{2}]  {3}' -f $r.Rel, $r.Line, $r.Kind, $r.Text)
}
foreach ($s in $staleRows) {
    Write-Output ('  stale    ' + $s + '  (whitelisted, names the switch nowhere)')
}
if ($unexpectedRows.Count -gt 0) {
    Write-Output ''
    Write-Output 'UNEXPECTED (must be 0 - the switch skips the live-hash check, so a'
    Write-Output 'production caller would write an unverified signal into the state file):'
    foreach ($r in $unexpectedRows) {
        Write-Output ('  ' + $r.Rel + ':' + $r.Line + '  [' + $r.Kind + ']  ' + $r.Text)
    }
}

if ($FailOnUnexpected -and $unexpectedRows.Count -gt 0) { exit 2 }
exit 0