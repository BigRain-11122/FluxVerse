# resolve-repo.ps1 - single-source repo self-location common piece (tech#10)
# ---------------------------------------------------------------------
# WHY (three live incidents, same disease): hand-written $PSScriptRoot
# level arithmetic (Split-Path nesting / '..\..' Join-Path chains) jumped
# one level too far or too few in r247 (logs\ harness did ..\.. -> landed
# in gaming\, scattered a stray logs fixture into the wrong domain), r273
# (famwrap wrapper: needed 1 hop, wrote 3 -> child started in FluxGroup
# domain, WriteAllText would land in FluxGroup\logs), r274 (harness needed
# 1 hop, wrote 2 -> read the wrong root). The wrong arithmetic SUCCEEDS
# silently - that is what makes it dangerous.
# FIX: anchor the search on the .git marker instead of on level counting.
# The walk-up stops at the FIRST .git found, so it is immune to both
# over-jump and under-jump; if nothing is found within -MaxDepth it fails
# LOUD (throw / exit 1), never silently returns a wrong domain.
#
# CONTRACT - one line for new wrappers / per-round sandboxes:
#   . (Join-Path (Split-Path -Parent $PSCommandPath) 'Tools\devloop\resolve-repo.ps1')
#   $repoRoot = Resolve-RepoRoot -From $PSCommandPath      # throws fail-loud
# (wrappers living deeper than repo root adjust the single hop to the tool
#  file itself; a wrong hop fails LOUD - file not found - so the adoption
#  line cannot silently land in a wrong domain.)
#
# DIRECT MODE (subprocess):  resolve-repo.ps1 -From <dir-or-file> [-MaxDepth N] [-Marker file]
#   success: prints the repo root path, exit 0
#   failure: 'resolve-repo: <reason>' on stderr, exit 1
# DOT-SOURCE MODE (no -From): only defines Resolve-RepoRoot in caller scope.
#
# -From     : directory OR file path (a file is reduced to its directory)
# -Marker   : optional repo-identity tripwire - the discovered root MUST
#             contain this file or the resolve fails (guards against a
#             wrapper run from a nested checkout landing on the PARENT repo)
# -MaxDepth : walk cap, default 10; a no-git tree fails fast instead of
#             walking to the drive root
# ASCII-only law: no CJK in this file (PS5.1 GBK trap, r64 law family).

param(
    [string]$From = '',
    [int]$MaxDepth = 10,
    [string]$Marker = ''
)

function Resolve-RepoRoot {
    param(
        [Parameter(Mandatory = $true)][string]$From,
        [int]$MaxDepth = 10,
        [string]$Marker = ''
    )
    if ([string]::IsNullOrWhiteSpace($From)) {
        throw 'resolve-repo: -From is empty'
    }
    if (Test-Path -LiteralPath $From -PathType Leaf) {
        $From = Split-Path -Parent $From
    }
    if (-not (Test-Path -LiteralPath $From -PathType Container)) {
        throw ("resolve-repo: -From path not found: " + $From)
    }
    $cur = (Resolve-Path -LiteralPath $From).Path
    for ($i = 0; $i -le $MaxDepth; $i++) {
        if (Test-Path -LiteralPath (Join-Path $cur '.git')) {
            if ($Marker -ne '' -and -not (Test-Path -LiteralPath (Join-Path $cur $Marker))) {
                throw ("resolve-repo: root found but marker '" + $Marker + "' missing (wrong repo?): " + $cur)
            }
            return $cur
        }
        $parent = Split-Path -Parent $cur
        if ([string]::IsNullOrEmpty($parent) -or $parent -eq $cur) { break }
        $cur = $parent
    }
    throw ("resolve-repo: no .git within " + $MaxDepth + " levels above: " + $From)
}

if ($From -ne '') {
    # direct mode: resolve once, print root, explicit exit codes
    try {
        $root = Resolve-RepoRoot -From $From -MaxDepth $MaxDepth -Marker $Marker
        Write-Output $root
        exit 0
    } catch {
        [Console]::Error.WriteLine($_.Exception.Message)
        exit 1
    }
}
# dot-source mode: Resolve-RepoRoot is now defined in the caller scope
