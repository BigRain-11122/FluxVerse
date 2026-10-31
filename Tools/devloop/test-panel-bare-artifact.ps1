# --------------------------------------------------------------------------
# A bare file name is not a path (queue main#75).
#
# The artifact resolver only demanded an extension, so prose like
# "-regress.html" turned into a "real path": art_missing=1, an amber
# self-check, and a dead link for a file the author never claimed existed.
# r736 already fixed the opposite mistake (paths written as bare names); r739
# established that the three face lines MUST carry a path. This suite pins the
# resolver side: a token without a directory separator is counted as a bare
# name, dropped from the path list, and printed as a WARN.
#
#   A) bare name that does NOT exist -> ignored, art=1 (only the real path)
#   B) bare name that DOES exist      -> still ignored (existence is not a pass)
#   C) the live face                  -> art_bare=0, no WARN line
#   D) page A                         -> ART.bare=2, bare names never become items
# ASCII-only law: no CJK in this file.

$ErrorActionPreference = 'Stop'
$builder = Join-Path $PSScriptRoot 'build-city-panel.ps1'
if (-not (Test-Path -LiteralPath $builder)) { Write-Output 'setup FAIL: builder missing'; exit 1 }

$repoDir = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$snap = Join-Path $repoDir 'world-public\city-snapshot.json'
$liveFace = Join-Path $repoDir 'state\status-face.json'
$template = Join-Path $PSScriptRoot 'city-panel-template.html'
foreach ($p in @($snap, $liveFace, $template)) {
    if (-not (Test-Path -LiteralPath $p)) { Write-Output ('setup FAIL: input missing ' + $p); exit 1 }
}

$sandbox = Join-Path ([System.IO.Path]::GetTempPath()) ('fv-bare-' + $PID)
if (Test-Path -LiteralPath $sandbox) { Remove-Item -LiteralPath $sandbox -Recurse -Force }
New-Item -ItemType Directory -Path $sandbox -Force | Out-Null

function Write-TextFile([string]$path, [string]$body) {
    $utf8 = New-Object System.Text.UTF8Encoding($false)
    [IO.File]::WriteAllText($path, $body, $utf8)
}

function New-Face([string]$name, [string]$act, [string]$art, [string]$mile) {
    $path = Join-Path $sandbox ($name + '.json')
    $obj = [ordered]@{
        updated_utc = ''
        current_activity = $act
        artifact = $art
        artifact_utc = ''
        milestone = $mile
        milestone_eta_utc = ''
    }
    Write-TextFile $path ($obj | ConvertTo-Json)
    return $path
}

function Invoke-Build([string]$facePath, [string]$outName) {
    $out = Join-Path $sandbox $outName
    $hist = Join-Path $sandbox ($outName + '.jsonl')
    $log = (& powershell -NoProfile -ExecutionPolicy Bypass -File $builder `
            -FacePath $facePath -OutPath $out -HistoryPath $hist -TickLogPath (Join-Path $repoDir ('logs\tick-' + (Get-Date).ToString('yyyyMMdd') + '.log')) `
            -SiteSkip) -join "`n"
    $html = ''
    if (Test-Path -LiteralPath $out) { $html = [IO.File]::ReadAllText($out) }
    return [pscustomobject]@{ log = $log; html = $html; path = $out }
}

function Get-ArtLiteral([string]$html) {
    $m = [regex]::Match($html, 'const ART = (\{[\s\S]*?\});\r?\n')
    if (-not $m.Success) { return $null }
    try { return (ConvertFrom-Json $m.Groups[1].Value) } catch { return $null }
}

function Get-Metric([string]$log, [string]$key) {
    $m = [regex]::Match($log, [regex]::Escape($key) + '=([^\s]+)')
    if ($m.Success) { return $m.Groups[1].Value }
    return ''
}

# --- A) bare name that does not exist --------------------------------------
$faceA = New-Face 'faceA' 'r740 repaired -regress.html locally' 'world-public/city-panel.html' 'next foo.html pass'
$A = Invoke-Build $faceA 'panel-a.html'

# --- B) bare name that really exists in the repo root ----------------------
$faceB = New-Face 'faceB' 'see TECH.md for the rules' 'none' 'see TECH.md again'
$B = Invoke-Build $faceB 'panel-b.html'

# --- C) the live face ------------------------------------------------------
$C = Invoke-Build $liveFace 'panel-live.html'

$pass = 0
$fail = 0
function Check([string]$name, [bool]$cond, [string]$detail) {
    if ($cond) { Write-Output ('  PASS ' + $name); $script:pass++ }
    else { Write-Output ('  FAIL ' + $name + $(if ($detail) { ' :: ' + $detail } else { '' })); $script:fail++ }
}

# A: only the real path counts; the two bare names are counted separately.
Check 'A: builder still reports PANEL OK' ($A.log -match 'PANEL OK') $A.log
Check 'A: art=1 (real path only)' ((Get-Metric $A.log 'art') -eq '1') ('art=' + (Get-Metric $A.log 'art'))
Check 'A: art_missing=0' ((Get-Metric $A.log 'art_missing') -eq '0') ('art_missing=' + (Get-Metric $A.log 'art_missing'))
Check 'A: art_bare=2' ((Get-Metric $A.log 'art_bare') -eq '2') ('art_bare=' + (Get-Metric $A.log 'art_bare'))
Check 'A: WARN names both bare tokens' ($A.log -match 'PANEL WARN: bare-artifact-names=2' -and
    $A.log.Contains('-regress.html') -and $A.log.Contains('foo.html')) $A.log

# B: existence on disk must NOT rescue a bare name.
Check 'B: art=0 (bare existing name is not a path)' ((Get-Metric $B.log 'art') -eq '0') ('art=' + (Get-Metric $B.log 'art'))
Check 'B: art_missing=0 (and not reported as missing either)' ((Get-Metric $B.log 'art_missing') -eq '0') ('art_missing=' + (Get-Metric $B.log 'art_missing'))
Check 'B: art_bare=1' ((Get-Metric $B.log 'art_bare') -eq '1') ('art_bare=' + (Get-Metric $B.log 'art_bare'))
Check 'B: WARN names TECH.md' ($B.log -match 'bare-artifact-names=1' -and $B.log.Contains('TECH.md')) $B.log

# C: the live face is clean, and no WARN is printed for it.
Check 'C: art_missing=0' ((Get-Metric $C.log 'art_missing') -eq '0') ('art_missing=' + (Get-Metric $C.log 'art_missing'))
Check 'C: art_bare=0' ((Get-Metric $C.log 'art_bare') -eq '0') ('art_bare=' + (Get-Metric $C.log 'art_bare'))
Check 'C: no bare WARN line' (-not ($C.log -match 'bare-artifact-names')) $C.log

# D: the page ships the bare count, and no bare token became a real item.
$artA = Get-ArtLiteral $A.html
Check 'D: ART literal parsed' ($null -ne $artA) 'ART literal missing from panel A'
if ($null -ne $artA) {
    Check 'D: ART.bare=2' ([int]$artA.bare -eq 2) ('bare=' + $artA.bare)
    Check 'D: ART.bare_names has 2 entries' (@($artA.bare_names).Count -eq 2) (@($artA.bare_names) -join ',')
    $rels = @($artA.items | ForEach-Object { [string]$_.rel })
    Check 'D: items carry no bare token' (-not ($rels | Where-Object { $_ -eq '-regress.html' -or $_ -eq 'foo.html' })) ($rels -join ',')
    Check 'D: items carry the real path' (@($rels | Where-Object { $_ -eq 'world-public/city-panel.html' }).Count -eq 1) ($rels -join ',')
}
Check 'D: page has no artlink for the bare token' (-not $A.html.Contains('">foo.html<')) 'bare token rendered as a link'

if ($fail -eq 0) {
    Write-Output ('BARE-ARTIFACT OK ' + $pass + '/' + $pass)
    Remove-Item -LiteralPath $sandbox -Recurse -Force -ErrorAction SilentlyContinue
    exit 0
}
Write-Output ('BARE-ARTIFACT FAIL pass=' + $pass + ' fail=' + $fail)
exit 1