# test-panel-url.ps1 - sandbox proof for the panel's artifact link shape
# ----------------------------------------------------------------------
# Queue main#82 (r744): the panel shipped every artifact as an absolute
# 'file:///' url, so the SAME HEAD rebuilt from D:\FluxGroup\gaming\FluxVerse
# and from C:\Users\sjs20\Desktop\FluxGroup\gaming\FluxVerse wrote different
# bytes for the same file (~13 rewritten lines per tick) and any move to another
# drive killed the links.
#
# This sandbox pins the rule at its two boundaries: a file INSIDE the repo gets a
# path relative to the panel (identical no matter how the tree is spelled), a
# file OUTSIDE the repo keeps the absolute url (there is no anchor that survives
# copying the panel). It also re-reads the live panel and fails if any link that
# points back into this repo is absolute - the exact regression class.
# ASCII-only law: no CJK in this file.

$ErrorActionPreference = 'Stop'
$pass = 0
$fail = 0
function Check([string]$name, [bool]$cond) {
    if ($cond) { Write-Output ('  PASS ' + $name); $script:pass++ }
    else { Write-Output ('  FAIL ' + $name); $script:fail++ }
}

$mod = Join-Path $PSScriptRoot 'panel-url.ps1'
if (-not (Test-Path -LiteralPath $mod)) { Write-Output 'setup FAIL: panel-url.ps1 missing'; exit 1 }
. $mod

$newCmd = Get-Command New-PanelUrl -ErrorAction SilentlyContinue
$relCmd = Get-Command Get-RelPanelPath -ErrorAction SilentlyContinue
Check 'module exports New-PanelUrl' ($null -ne $newCmd)
Check 'module exports Get-RelPanelPath' ($null -ne $relCmd)
if ($null -eq $newCmd -or $null -eq $relCmd) {
    Write-Output ('test-panel-url: ' + $pass + ' passed, ' + $fail + ' failed')
    exit 1
}

# --- 1. the two spellings of the same repo must land on the same link -------
# This is the literal r743 churn: same file, two mounts, two urls.
$uD = New-PanelUrl -Full 'D:\FluxGroup\gaming\FluxVerse\qa\city-panel-r742.png' `
    -PanelDir 'D:\FluxGroup\gaming\FluxVerse\world-public' -RepoDir 'D:\FluxGroup\gaming\FluxVerse'
$uC = New-PanelUrl -Full 'C:\Users\sjs20\Desktop\FluxGroup\gaming\FluxVerse\qa\city-panel-r742.png' `
    -PanelDir 'C:\Users\sjs20\Desktop\FluxGroup\gaming\FluxVerse\world-public' `
    -RepoDir 'C:\Users\sjs20\Desktop\FluxGroup\gaming\FluxVerse'
Check 'repo file inside panel dir tree -> relative upwards' ($uD -eq '../qa/city-panel-r742.png')
Check 'two spellings of one repo produce ONE url' ($uD -eq $uC)
Check 'relative url carries no drive letter' ($uD -notmatch '^[A-Za-z]:/')

# --- 2. depth, trailing separators, case --------------------------------
Check 'two levels up is still correct' (
    (New-PanelUrl -Full 'D:\a\b\qa\x.md' -PanelDir 'D:\a\b\world-public' -RepoDir 'D:\a\b') -eq '../qa/x.md')
Check 'deeper nesting adds a hop' (
    (New-PanelUrl -Full 'D:\a\b\qa\x.md' -PanelDir 'D:\a\b\c\world-public' -RepoDir 'D:\a\b') -eq '../../qa/x.md')
Check 'trailing separator on PanelDir is harmless' (
    (Get-RelPanelPath -BaseDir 'D:\a\b\world-public\' -TargetFull 'D:\a\b\qa\x.md') -eq '../qa/x.md')
Check 'drive case does not matter' (
    (Get-RelPanelPath -BaseDir 'd:\a\b\world-public' -TargetFull 'D:\a\b\qa\x.md') -eq '../qa/x.md')
Check 'path segment case does not matter' (
    (Get-RelPanelPath -BaseDir 'D:\A\B\World-Public' -TargetFull 'd:\a\b\qa\x.md') -eq '../qa/x.md')
Check 'file sitting right in the panel dir is a bare name' (
    (Get-RelPanelPath -BaseDir 'D:\a\b\world-public' -TargetFull 'D:\a\b\world-public\x.png') -eq 'x.png')
Check 'file at the repo root one level up' (
    (Get-RelPanelPath -BaseDir 'D:\a\b\world-public' -TargetFull 'D:\a\b\TECH.md') -eq '../TECH.md')

# --- 3. escaping ---------------------------------------------------------
Check 'spaces are percent-encoded' (
    (Get-RelPanelPath -BaseDir 'D:\a\b\world-public' -TargetFull 'D:\a\b\qa\two words.md') -eq '../qa/two%20words.md')
Check 'absolute fallback escapes spaces too' (
    (New-PanelUrl -Full 'E:\my shots\x.png' -PanelDir 'D:\a\world-public' -RepoDir 'D:\a') -eq 'file:///E:/my%20shots/x.png')

# --- 4. when a relative link must NOT be used ---------------------------
Check 'group file outside the repo stays absolute' (
    (New-PanelUrl -Full 'C:\Users\sjs20\Desktop\FluxGroup\docs\decisions.md' `
        -PanelDir 'C:\Users\sjs20\Desktop\FluxGroup\gaming\FluxVerse\world-public' `
        -RepoDir 'C:\Users\sjs20\Desktop\FluxGroup\gaming\FluxVerse') -eq
    'file:///C:/Users/sjs20/Desktop/FluxGroup/docs/decisions.md')
Check 'other drive has no relative form' (
    (Get-RelPanelPath -BaseDir 'D:\a\b' -TargetFull 'E:\a\b\x.md') -eq '')
Check 'other drive falls back to absolute' (
    (New-PanelUrl -Full 'E:\a\b\x.md' -PanelDir 'D:\a\b' -RepoDir 'E:\a\b') -eq 'file:///E:/a/b/x.md')
Check 'no PanelDir -> absolute' (
    (New-PanelUrl -Full 'D:\a\b\qa\x.md' -PanelDir '' -RepoDir 'D:\a\b') -eq 'file:///D:/a/b/qa/x.md')
Check 'no RepoDir -> absolute' (
    (New-PanelUrl -Full 'D:\a\b\qa\x.md' -PanelDir 'D:\a\b\world-public' -RepoDir '') -eq 'file:///D:/a/b/qa/x.md')
Check 'empty path -> empty url' ((New-PanelUrl -Full '' -PanelDir 'D:\a' -RepoDir 'D:\a') -eq '')

# --- 5. the live panel: no absolute link may point back into this repo ----
# Permanent invariant for the regression class itself, not just the unit rule.
$repoDir = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$live = Join-Path $repoDir 'world-public\city-panel.html'
if (Test-Path -LiteralPath $live) {
    $html = ''
    try { $html = [IO.File]::ReadAllText($live, [Text.Encoding]::UTF8) } catch { $html = '' }
    Check 'live panel readable' ($html.Length -gt 1000)
    $abs = [regex]::Matches($html, 'file:///[A-Za-z]:/[^"'']*')
    $repoUrlPrefix = 'file:///' + ($repoDir.Replace('\', '/').Replace(' ', '%20')) + '/'
    $leak = 0
    foreach ($m in $abs) {
        if ($m.Value.StartsWith($repoUrlPrefix, [StringComparison]::OrdinalIgnoreCase)) { $leak++ }
    }
    Check ('no absolute link into the repo (found ' + $leak + ')') ($leak -eq 0)
    # urls are shipped inside the inlined JSON and turned into href at runtime,
    # so the marker is the JSON field, not an href attribute.
    $relLinks = [regex]::Matches($html, '"url":"(?:\.\./|\./)')
    Check ('relative urls present (' + $relLinks.Count + ')') ($relLinks.Count -gt 0)
} else {
    Write-Output '  SKIP live panel missing (build it first: Tools\devloop\build-city-panel.ps1)'
}

Write-Output ('test-panel-url: ' + $pass + ' passed, ' + $fail + ' failed (of ' + ($pass + $fail) + ')')
if ($fail -gt 0) { exit 1 }
exit 0