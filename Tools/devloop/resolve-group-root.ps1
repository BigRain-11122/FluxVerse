# resolve-group-root.ps1 - single source for "which FluxGroup root is live?"
# ---------------------------------------------------------------------------
# WHY (r683, measured): this repo can be reached through a mirror path
# (D:\FluxGroup\gaming\FluxVerse) whose sibling group dirs (cph4/, docs/) are a
# STALE copy (ledger mtime 2026-10-20) while the live group tree sits under the
# other mirror (%USERPROFILE%\Desktop\FluxGroup, ledger mtime 2026-10-27).
# Anything resolving the group root by counting "..\.." hops silently reads the
# stale copy and succeeds: the fastpath judge then fires a fake c3/c6/c7 every
# round, and the perceptor probes feed the city week-old orders/decisions.
# The wrong answer never fails loud - that is what makes it dangerous.
#
# RULE: among candidate group roots, pick the one whose
#   cph4\evolution-ledger.md is NEWEST (that is the live governance face).
# Candidates = the caller's legacy ..-hop answer + the same-named dir under
#   %USERPROFILE%\Desktop (accepted only when it actually contains this repo).
# Single-mirror machines: the desktop candidate does not exist -> legacy answer
#   is returned unchanged (zero behavior change).
#
# CONTRACT:
#   . (Join-Path $PSScriptRoot 'resolve-group-root.ps1')
#   $groupRoot = Resolve-GroupRoot -RepoRoot $repoRoot -LegacyRoot $upTwo
# Returns the chosen root (always non-empty; falls back to -LegacyRoot).
# ASCII-only law: no CJK in this file (PS5.1 GBK trap, r64 law family).

function Resolve-GroupRoot {
    param(
        [Parameter(Mandatory = $true)][string]$RepoRoot,
        [Parameter(Mandatory = $true)][string]$LegacyRoot
    )
    $cands = @($LegacyRoot)
    try {
        $leaf = Split-Path -Leaf $LegacyRoot
        if (-not [string]::IsNullOrEmpty($leaf)) {
            $desktop = Join-Path $env:USERPROFILE 'Desktop'
            $mirror = Join-Path $desktop $leaf
            # Same repo, same relative position under the mirror (repo->group suffix).
            # NOTE: no recursive search here - the repo dir may sit behind a junction
            # that Get-ChildItem -Recurse does not descend (measured r683b).
            $suffix = $RepoRoot.TrimEnd('\', '/')
            $legTrim = $LegacyRoot.TrimEnd('\', '/')
            if ($suffix.Length -gt $legTrim.Length) { $suffix = $suffix.Substring($legTrim.Length).TrimStart('\', '/') }
            else { $suffix = '' }
            if (($mirror -ne $LegacyRoot) -and (Test-Path -LiteralPath (Join-Path $mirror $suffix))) { $cands += $mirror }
        }
    } catch { }
    $best = $LegacyRoot
    $bestStamp = [datetime]::MinValue
    foreach ($c in $cands) {
        $lp = Join-Path $c 'cph4\evolution-ledger.md'
        if (-not (Test-Path -LiteralPath $lp)) { continue }
        $st = (Get-Item -LiteralPath $lp).LastWriteTimeUtc
        if ($st -gt $bestStamp) { $bestStamp = $st; $best = $c }
    }
    return $best
}