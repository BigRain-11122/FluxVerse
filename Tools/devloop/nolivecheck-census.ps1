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
# ONE SAMPLE IS NOT A TREND (main#118, r780): on 2026-11-01 this line read
# ms=2854 against budget=250 while the 24 ticks around it read 93-191 ms and a
# hand run in the same minute read 103-106 ms - the disk was busy, nothing had
# changed, and the gate turned that into "somebody must decide this" every tick.
# So a first sample over the budget now buys exactly one re-measure and the run
# is judged on the lower of the two (census-cost.ps1); the discarded sample is
# still printed as ms1= so the spike stays a reading rather than a decision.
# A genuine regression reproduces in both passes and still warns; the budget
# itself is untouched, and the common under-budget tick pays nothing extra.
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

# The cost judgement lives in its own module (r780): whether this run's
# milliseconds are evidence or noise is a policy question, and a policy that can
# only be observed through a wall-clock sample cannot be tested.
$costModule = Join-Path $PSScriptRoot 'census-cost.ps1'
if (-not (Test-Path -LiteralPath $costModule)) {
    Write-Output ('nolivecheck-census: files=0 hits=0 allowed=0 unexpected=0 stale=0 (cost module missing: ' + $costModule + ')')
    exit 1
}
. $costModule

$hitText = '-' + 'NoLiveCheck'

# Owner of the switch (defines and guards it) plus the sandboxes that drill it.
# A production call path must never appear here.
# r800: Tools\devloop\test-fastpath-state-live.ps1 was listed from r737 but has
# named the switch nowhere since the writer's live check became its own suite -
# it drills the check itself, so bypassing it is exactly what it cannot do. The
# entry read 'stale' on every tick for 60+ rounds (r789 recorded it as a known
# leftover); a list entry nobody prunes is the r759 disease seen from the other
# side, so it is gone rather than tolerated.
$allowList = @(
    'Tools\devloop\write-fastpath-state.ps1',
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

# One measuring pass = walk + classify. It is a function rather than inline code
# because a sample that looks expensive gets re-measured (r780); both passes run
# the identical read-only work and the second is thrown away if the first was
# already inside the budget, so the common tick pays nothing for this.
function Invoke-CensusPass {
    param(
        [string]$RootDir,
        [string]$TokenText,
        [string[]]$Allow,
        [string[]]$Skips,
        [string[]]$Prune,
        [string[]]$Exts
    )
    # An empty pass is the honest answer for a root that does not exist; walking
    # a missing root used to return files=0 with no way to tell it from an empty
    # tree (queue main#128).
    if ([string]::IsNullOrWhiteSpace($RootDir) -or -not (Test-Path -LiteralPath $RootDir)) {
        return [pscustomobject]@{
            Files = 0; Hits = 0; Allowed = @(); Unexpected = @(); Stale = @(); Ms = 0
        }
    }
    $passSw = New-Object System.Diagnostics.Stopwatch
    $passSw.Start()

    $fileList = New-Object System.Collections.ArrayList
    $dirStack = New-Object System.Collections.Stack
    $dirStack.Push($RootDir)
    while ($dirStack.Count -gt 0) {
        $dir = [string]$dirStack.Pop()
        $subs = @()
        try { $subs = @([System.IO.Directory]::GetDirectories($dir)) } catch { $subs = @() }
        foreach ($sub in $subs) {
            $leaf = [System.IO.Path]::GetFileName($sub)
            if ($Skips -contains $leaf) { continue }
            # Full scratch trees (r743: .codely-cli\tmp holds hand-run throwaway
            # scripts that are never part of a production chain).
            if ($sub -match '\\\.codely-cli\\tmp$') { continue }
            $subRel = $sub.Substring($RootDir.Length).TrimStart('\')
            $pruned = $false
            foreach ($pr in $Prune) {
                if ($subRel -eq $pr -or $subRel.StartsWith($pr + '\')) { $pruned = $true; break }
            }
            if ($pruned) { continue }
            $dirStack.Push($sub)
        }
        $files = @()
        try { $files = @([System.IO.Directory]::GetFiles($dir)) } catch { $files = @() }
        foreach ($f in $files) {
            $ext = [System.IO.Path]::GetExtension($f).ToLower()
            if ($Exts -contains $ext) { [void]$fileList.Add($f) }
        }
    }

    $allowedOut = New-Object System.Collections.ArrayList
    $unexOut = New-Object System.Collections.ArrayList
    $seenFiles = @{}
    $hitTotal = 0

    foreach ($f in $fileList) {
        $rel = $f.Substring($RootDir.Length).TrimStart('\')
        # Read once as text and ask for the token BEFORE splitting into lines: the
        # overwhelming majority of files do not name the switch at all, and paying a
        # line array plus one IndexOf per line for all of them cost ~0.43 s per run
        # - enough to push the tick's cached-verify round past its own 3 s budget
        # (the gate-of-the-gate sandbox caught it, r765).
        $text = ''
        try { $text = [System.IO.File]::ReadAllText($f, [System.Text.Encoding]::UTF8) } catch { continue }
        if ($text.IndexOf($TokenText, [System.StringComparison]::Ordinal) -lt 0) { continue }
        $lines = @($text -split "`r?`n")
        $isAllowed = $false
        foreach ($a in $Allow) {
            if ($rel -eq $a) { $isAllowed = $true; break }
        }
        $lineno = 0
        foreach ($ln in $lines) {
            $lineno++
            if ($ln.IndexOf($TokenText, [System.StringComparison]::Ordinal) -lt 0) { continue }
            $hitTotal++
            $seenFiles[$rel] = $true
            $trimmed = $ln.Trim()
            $kind = 'code'
            if ($trimmed.StartsWith('#')) { $kind = 'comment' }
            if ($trimmed.Length -gt 120) { $trimmed = $trimmed.Substring(0, 120) + '...' }
            $row = [pscustomobject]@{
                Rel = $rel; Line = $lineno; Kind = $kind; Text = $trimmed; Ok = $isAllowed
            }
            if ($isAllowed) { [void]$allowedOut.Add($row) } else { [void]$unexOut.Add($row) }
        }
    }

    $staleOut = New-Object System.Collections.ArrayList
    foreach ($a in $Allow) {
        if (-not $seenFiles.ContainsKey($a)) { [void]$staleOut.Add($a) }
    }

    $passSw.Stop()
    return [pscustomobject]@{
        Files = $fileList.Count
        Hits = $hitTotal
        Allowed = $allowedOut
        Unexpected = $unexOut
        Stale = $staleOut
        Ms = [int]$passSw.ElapsedMilliseconds
    }
}

$passOne = Invoke-CensusPass -RootDir $rootNorm -TokenText $hitText -Allow $allowList -Skips $skipNames -Prune $pruneRel -Exts $scanExts
$costSamples = @([int]$passOne.Ms)
$passFinal = $passOne
# One spike is not a trend: r780 found a lone ms=2854 among 24 ticks at 93-191 ms.
# A first sample over the line buys exactly one re-measure (cost policy lives in
# census-cost.ps1 so it can be drilled directly instead of observed by luck).
if (Test-CensusCostRetry -Ms $passOne.Ms -BudgetMs $BudgetMs) {
    $passTwo = Invoke-CensusPass -RootDir $rootNorm -TokenText $hitText -Allow $allowList -Skips $skipNames -Prune $pruneRel -Exts $scanExts
    $costSamples += [int]$passTwo.Ms
    $passFinal = $passTwo
}
$costVerdict = Get-CensusCostVerdict -Samples $costSamples -BudgetMs $BudgetMs

$summary = 'nolivecheck-census: files=' + $passFinal.Files + ' hits=' + $passFinal.Hits +
    ' allowed=' + $passFinal.Allowed.Count + ' unexpected=' + $passFinal.Unexpected.Count +
    ' stale=' + $passFinal.Stale.Count +
    ' ms=' + $costVerdict.Ms + ' budget=' + $costVerdict.BudgetMs
if ($costVerdict.Retried) {
    # The discarded sample still travels: the spike is a reading, not a verdict.
    $summary = $summary + ' retry=1 ms1=' + $costVerdict.FirstMs
}
Write-Output $summary
if ($costVerdict.Over) {
    Write-Output ('BUDGET OVER: ' + $costVerdict.Ms + 'ms > ' + $costVerdict.BudgetMs + 'ms - this census runs on every tick, so its cost is part of the gate''s cached-round budget (3 s). Move it out of the per-tick section (ride check-fastpath.ps1) or shrink the scan; do not raise that budget to absorb it.')
}
Write-Output ('scan root: ' + $rootNorm)
Write-Output ('pruned: ' + ($pruneRel -join ', '))
Write-Output ''
foreach ($r in $passFinal.Allowed) {
    Write-Output ('  allowed  {0}:{1}  [{2}]  {3}' -f $r.Rel, $r.Line, $r.Kind, $r.Text)
}
foreach ($s in $passFinal.Stale) {
    Write-Output ('  stale    ' + $s + '  (whitelisted, names the switch nowhere)')
}
if ($passFinal.Unexpected.Count -gt 0) {
    Write-Output ''
    Write-Output 'UNEXPECTED (must be 0 - the switch skips the live-hash check, so a'
    Write-Output 'production caller would write an unverified signal into the state file):'
    foreach ($r in $passFinal.Unexpected) {
        Write-Output ('  ' + $r.Rel + ':' + $r.Line + '  [' + $r.Kind + ']  ' + $r.Text)
    }
}

if ($FailOnUnexpected -and $passFinal.Unexpected.Count -gt 0) { exit 2 }
exit 0