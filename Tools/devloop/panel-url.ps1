# panel-url.ps1 - single definition of how the city panel links to a file
# -----------------------------------------------------------------------
# Queue main#82 (r744). The panel sits at world-public\city-panel.html and used
# to ship every link as an absolute 'file:///' url. The same HEAD rebuilt from
# D:\FluxGroup\gaming\FluxVerse and from
# C:\Users\sjs20\Desktop\FluxGroup\gaming\FluxVerse (the same repo, two
# spellings) therefore produced two different urls for the SAME file: every tick
# rewrote ~13 lines of the panel, and moving the tree to another drive killed
# every link.
#
# Repo files now ship as a path RELATIVE to the panel's own directory, so the
# bytes do not depend on where the tree is mounted. A file outside the repo
# (group docs, a receipt on another drive) keeps the absolute url: there is no
# relative anchor that survives copying the panel elsewhere, and the group root
# is already canonicalised by resolve-group-root.ps1.
#
# ASCII-only law: no CJK in this file.

function ConvertTo-RelPanelPath
{
    # Pure path math: no filesystem calls, so a sandbox can pin it against
    # synthetic trees (D:\a\b fixtures). r831 split this out because the r796
    # existence guard below made the whole function answer '' for every
    # synthetic anchor - eight assertions in test-panel-url had been red for
    # ten rounds with nobody watching (no family ran that suite).
    #
    # Empty input is a caller bug here, not a fallback: the attributes say so,
    # and the production wrapper Get-RelPanelPath keeps answering '' for an
    # absent anchor. (simple-param-census flags a dir-named parameter with no
    # guard; the attributes are the guard.)
    param(
        [Parameter(Mandatory = $true)][ValidateNotNullOrEmpty()][string]$BaseDir,
        [Parameter(Mandatory = $true)][ValidateNotNullOrEmpty()][string]$TargetFull
    )
    $b = $BaseDir.Replace('/', '\')
    $t = $TargetFull.Replace('/', '\')
    $bRoot = ''
    $tRoot = ''
    try { $bRoot = [IO.Path]::GetPathRoot($b) } catch { return '' }
    try { $tRoot = [IO.Path]::GetPathRoot($t) } catch { return '' }
    if ([string]::IsNullOrEmpty($bRoot) -or [string]::IsNullOrEmpty($tRoot)) { return '' }
    # Different drive roots have no relative form that stays valid.
    if (-not $bRoot.Equals($tRoot, [StringComparison]::OrdinalIgnoreCase)) { return '' }
    $bs = @($b.Substring($bRoot.Length).Split('\') | Where-Object { $_ -ne '' })
    $ts = @($t.Substring($tRoot.Length).Split('\') | Where-Object { $_ -ne '' })
    if ($ts.Count -eq 0) { return '' }
    # Common prefix, but never swallow the last target segment: the result has
    # to end in the file name, otherwise the link points at a directory.
    $i = 0
    while ($i -lt $bs.Count -and $i -lt ($ts.Count - 1) -and
        $bs[$i].Equals($ts[$i], [StringComparison]::OrdinalIgnoreCase)) { $i++ }
    $parts = New-Object System.Collections.ArrayList
    for ($j = $i; $j -lt $bs.Count; $j++) { [void]$parts.Add('..') }
    for ($j = $i; $j -lt $ts.Count; $j++) { [void]$parts.Add($ts[$j]) }
    if ($parts.Count -eq 0) { return '' }
    return (($parts -join '/').Replace(' ', '%20'))
}

function Get-RelPanelPath
{
    # Production entry point: the relative link is anchored at the panel's real
    # directory, and a missing anchor cannot be re-checked by the reader, so
    # answer '' and let the caller fall back to the absolute url (main#128).
    # The math itself lives in ConvertTo-RelPanelPath so it stays testable.
    param([string]$BaseDir, [string]$TargetFull)
    if ([string]::IsNullOrWhiteSpace($BaseDir) -or [string]::IsNullOrWhiteSpace($TargetFull)) { return '' }
    if (-not (Test-Path -LiteralPath $BaseDir)) { return '' }
    return (ConvertTo-RelPanelPath -BaseDir $BaseDir -TargetFull $TargetFull)
}

function New-PanelUrl
{
    param([string]$Full, [string]$PanelDir, [string]$RepoDir)
    if ([string]::IsNullOrWhiteSpace($Full)) { return '' }
    $f = $Full.Replace('/', '\')
    # Both anchors have to exist for a relative link to mean anything. An absent
    # anchor (including the deliberate "no repo anchor" empty request) still has
    # a correct answer: the absolute url (queue main#128).
    $panelOk = (-not [string]::IsNullOrWhiteSpace($PanelDir)) -and (Test-Path -LiteralPath $PanelDir)
    $repoOk = (-not [string]::IsNullOrWhiteSpace($RepoDir)) -and (Test-Path -LiteralPath $RepoDir)
    if ($panelOk -and $repoOk) {
        $rr = $RepoDir.Replace('/', '\')
        if (-not $rr.EndsWith('\')) { $rr = $rr + '\' }
        $inRepo = ($f.Length -gt $rr.Length -and
            $f.Substring(0, $rr.Length).Equals($rr, [StringComparison]::OrdinalIgnoreCase))
        if ($inRepo) {
            $rel = Get-RelPanelPath -BaseDir $PanelDir -TargetFull $f
            if (-not [string]::IsNullOrWhiteSpace($rel)) { return $rel }
        }
    }
    return ('file:///' + $f.Replace('\', '/').Replace(' ', '%20'))
}