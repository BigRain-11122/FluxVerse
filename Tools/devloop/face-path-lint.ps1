# face-path-lint.ps1 - single source for the face-line artifact path rule (r746)
# ---------------------------------------------------------------------------
# Why this file exists (queue main#84): builder already counts bare file names
# (`PANEL WARN: bare-artifact-names=N`) but the moment the face is WRITTEN no
# one stops you. r743 wrote `TECH.md` and r744 wrote `test-panel-url.ps1` in
# prose, each time costing a red suite round to find out. The cure is to run
# the SAME rule on the write side, from ONE definition, so the two sides can
# never drift apart.
#
# Contract:
#   $script:FaceArtPattern  must stay byte-equal to build-city-panel.ps1's
#                           `$artPattern` literal; test-write-status-face-bare
#                           fails loudly if they diverge.
#   Get-FaceArtTokens       all artifact-looking tokens (may repeat).
#   Get-FaceBareNames       distinct tokens that are NOT a path: not absolute
#                           (`C:/`, `//`) and carrying no directory separator.
#                           A bare name is a defect even when a file with that
#                           name exists somewhere - the face must say where.
# ASCII-only body (PS5.1 GBK law). No auto-variable locals ($pid family, r164).
# ---------------------------------------------------------------------------

# Alternation is leftmost-first: a longer extension must precede its own prefix
# or the token gets truncated (`json|jsonl` reads `.jsonl` as `.json`). r803
# found that on the reader side (two live `.jsonl` artifacts counted missing);
# this literal must stay byte-equal to the builder's, so the order is fixed here
# too and pinned by test-write-status-face-bare group l.
$script:FaceArtPattern = '[A-Za-z0-9_\-./\\]+\.(?:jsonl|json|html|htm|png|jpg|jpeg|svg|md|ps1|py|js|log|txt|mp4|webm|csv|yaml|yml|asset|unity|cs|zip)'

function Get-FaceArtTokens
{
    param([string]$Raw)
    $out = @()
    if ([string]::IsNullOrWhiteSpace($Raw)) { return $out }
    $ms = [regex]::Matches($Raw, $script:FaceArtPattern)
    foreach ($m in $ms) {
        $tok = $m.Value
        if ([string]::IsNullOrWhiteSpace($tok)) { continue }
        $out += $tok
    }
    return $out
}

function Get-FaceBareNames
{
    param([string]$Raw)
    $seen = @{}
    $bare = @()
    foreach ($tok in @(Get-FaceArtTokens -Raw $Raw)) {
        $norm = ([string]$tok).Replace('\', '/')
        $isAbs = ($norm -match '^[A-Za-z]:/' -or $norm.StartsWith('//'))
        if ($isAbs) { continue }
        if ($norm.IndexOf('/') -ge 0) { continue }
        if ($seen.ContainsKey($norm)) { continue }
        $seen[$norm] = $true
        $bare += $norm
    }
    return $bare
}