# build-city-panel.ps1 - FluxVerse public city panel builder (r665)
# ---------------------------------------------------------------------------
# Why: the DevLoop "process-visible face" (mandate item 5: current activity /
# latest artifact / next milestone) lived only as raw JSON + tick logs. This
# builds ONE self-contained HTML panel so a human can open it with file:// and
# see the face plus the public snapshot. No server, no CDN, no external links.
#
# Design laws honoured:
#  - file:// must work => data is INLINED (fetch() is blocked on file://).
#  - ASCII-only script body (PS5.1 GBK law); all CJK lives in the UTF-8
#    template data file Tools\devloop\city-panel-template.html.
#  - Fail loud, never prompt: missing/invalid inputs -> FAIL + exit 1, target
#    output left untouched (write .new then move, r98 pattern).
#  - Honest staleness: the panel never hides a stale snapshot; the browser
#    computes age from snapshot ts_utc and paints it red past 2h.
#
# Inputs : world-public\city-snapshot.json  (tick exporter, read-only)
#          state\status-face.json           (DevLoop face writer, read-only)
#          Tools\devloop\city-panel-template.html
#          logs\panel-history.jsonl         (this script's own cross-round log;
#                                            gitignored, best-effort)
# Output : world-public\city-panel.html
#
# Note: this script only READS tick artifacts. It does not write them, so it
# never races the tick exporter.
# ---------------------------------------------------------------------------

param(
    [string]$SnapPath = '',
    [string]$FacePath = '',
    [string]$TemplatePath = '',
    [string]$OutPath = '',
    [string]$HistoryPath = ''
)

$ErrorActionPreference = 'Stop'

function Fail
{
    param([string]$Msg)
    Write-Output ('FAIL: ' + $Msg)
    exit 1
}

# --- self-locate: this script sits at <repo>\Tools\devloop\ ---
$repoDir = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
if ([string]::IsNullOrEmpty($SnapPath))     { $SnapPath     = Join-Path $repoDir 'world-public\city-snapshot.json' }
if ([string]::IsNullOrEmpty($FacePath))     { $FacePath     = Join-Path $repoDir 'state\status-face.json' }
if ([string]::IsNullOrEmpty($TemplatePath)) { $TemplatePath = Join-Path $PSScriptRoot 'city-panel-template.html' }
if ([string]::IsNullOrEmpty($OutPath))      { $OutPath      = Join-Path $repoDir 'world-public\city-panel.html' }
if ([string]::IsNullOrEmpty($HistoryPath))  { $HistoryPath  = Join-Path $repoDir 'logs\panel-history.jsonl' }

foreach ($p in @($SnapPath, $FacePath, $TemplatePath)) {
    if (-not (Test-Path -LiteralPath $p)) { Fail ('input missing: ' + $p) }
}

function Read-JsonFile
{
    param([string]$Path, [string]$Label)
    $raw = ''
    try { $raw = [IO.File]::ReadAllText($Path, [Text.Encoding]::UTF8) }
    catch { Fail ($Label + ' read failed: ' + $_.Exception.Message) }
    if ([string]::IsNullOrWhiteSpace($raw)) { Fail ($Label + ' is empty: ' + $Path) }
    $obj = $null
    try { $obj = ConvertFrom-Json $raw } catch { Fail ($Label + ' is not valid JSON: ' + $_.Exception.Message) }
    if ($null -eq $obj) { Fail ($Label + ' parsed to null') }
    return $obj
}

$snap = Read-JsonFile -Path $SnapPath -Label 'snapshot'
$face = Read-JsonFile -Path $FacePath -Label 'status-face'

foreach ($k in @('current_activity','artifact','milestone')) {
    $v = ''
    try { $v = [string]$face.$k } catch { $v = '' }
    if ([string]::IsNullOrWhiteSpace($v)) { Fail ('status-face key missing/empty: ' + $k) }
}

# --- inline JSON (compact). Guard against a literal </script> breakout. ---
function To-JsLiteral
{
    param($Obj, [string]$Label)
    $json = $null
    try { $json = ConvertTo-Json $Obj -Depth 20 -Compress } catch { Fail ($Label + ' re-serialize failed: ' + $_.Exception.Message) }
    if ([string]::IsNullOrWhiteSpace($json)) { Fail ($Label + ' re-serialize returned empty') }
    return ([string]$json).Replace('</', '<\/')
}

$snapJs = To-JsLiteral -Obj $snap -Label 'snapshot'
$faceJs = To-JsLiteral -Obj $face -Label 'status-face'

# --- cross-round history (best effort; never breaks the panel) ---------------
# One compact record per DISTINCT snapshot ts, appended to a gitignored local
# log, so the panel can show "what changed since the previous tick" instead of
# one frozen frame. Failure here only drops the comparison card (PREV=null) --
# it must never stop the panel itself from being rebuilt.
$HistoryMax = 288
$prevRec = $null
$histAll = @()
$histOk = $true
try {
    $rec = New-Object PSObject -Property ([ordered]@{
        ts = [string]$snap.ts_utc
        c  = [int]0; r = [int]0; g = [int]0; f = [int]0; e = [int]0
    })
    try { $rec.c = [int]$snap.city.commits_total } catch { $rec.c = 0 }
    try { $rec.r = [int]$snap.city.renders_total } catch { $rec.r = 0 }
    try { $rec.g = [int]$snap.city.games_active } catch { $rec.g = 0 }
    try { $rec.f = [int]$snap.city.fleet_online } catch { $rec.f = 0 }
    try { $rec.e = [int](@($snap.events_tail).Count) } catch { $rec.e = 0 }

    if (Test-Path -LiteralPath $HistoryPath) {
        foreach ($line in [IO.File]::ReadAllLines($HistoryPath, [Text.Encoding]::UTF8)) {
            if ([string]::IsNullOrWhiteSpace($line)) { continue }
            $o = $null
            try { $o = ConvertFrom-Json $line } catch { continue }
            if ($null -ne $o -and $null -ne $o.ts) { $histAll += $o }
        }
    }

    $last = $null
    if ($histAll.Count -gt 0) { $last = $histAll[$histAll.Count - 1] }
    $append = $true
    if ($null -ne $last -and ([string]$last.ts -eq [string]$rec.ts)) {
        # Same snapshot already recorded (panel rebuilt inside one tick window)
        $append = $false
        if ($histAll.Count -gt 1) { $prevRec = $histAll[$histAll.Count - 2] }
    } else {
        $prevRec = $last
    }

    if ($append) {
        $histAll += $rec
        if ($histAll.Count -gt $HistoryMax) {
            $histAll = $histAll[($histAll.Count - $HistoryMax)..($histAll.Count - 1)]
        }
        $sb = New-Object System.Text.StringBuilder
        foreach ($h in $histAll) {
            [void]$sb.Append((ConvertTo-Json $h -Compress))
            [void]$sb.Append("`n")
        }
        $histDir = Split-Path -Parent $HistoryPath
        if (-not (Test-Path -LiteralPath $histDir)) { New-Item -ItemType Directory -Path $histDir -Force | Out-Null }
        [IO.File]::WriteAllText($HistoryPath, $sb.ToString(), (New-Object System.Text.UTF8Encoding($false)))
    }
} catch {
    $histOk = $false
    $prevRec = $null
    $histAll = @()
}

$histMeta = New-Object PSObject -Property ([ordered]@{
    n    = [int]$histAll.Count
    max  = [int]$HistoryMax
    ok   = [bool]$histOk
})
if ($histAll.Count -gt 0) { $histMeta | Add-Member -NotePropertyName first_utc -NotePropertyValue ([string]$histAll[0].ts) }
else { $histMeta | Add-Member -NotePropertyName first_utc -NotePropertyValue '' }

$prevJs = 'null'
if ($null -ne $prevRec) { $prevJs = To-JsLiteral -Obj $prevRec -Label 'prev-record' }
$histJs = To-JsLiteral -Obj $histMeta -Label 'history-meta'

$built = [DateTimeOffset]::Now.ToString('yyyy-MM-dd HH:mm:ss (zzz)',
    [Globalization.CultureInfo]::InvariantCulture)
# Inject the INNER text only: the template already supplies the surrounding
# double quotes (const BUILT = /*__BUILT__*/"";). Adding quotes here once
# produced "..."\"\" which is a hard JS syntax error - the whole panel then
# rendered as an empty state (r665 first build, caught by the screenshot gate).
$builtJs = '"' + $built.Replace('\', '\\').Replace('"', '\"') + '"'

# --- template ---
$tpl = ''
try { $tpl = [IO.File]::ReadAllText($TemplatePath, [Text.Encoding]::UTF8) }
catch { Fail ('template read failed: ' + $_.Exception.Message) }

foreach ($ph in @('__SNAPSHOT_JSON__','__FACE_JSON__','__BUILT_JSON__','__PREV_JSON__','__HIST_JSON__')) {
    if ($tpl.IndexOf($ph) -lt 0) { Fail ('template placeholder missing: ' + $ph) }
}

# String.Replace (not regex) => JSON '$' chars stay literal.
$out = $tpl.Replace('__SNAPSHOT_JSON__', $snapJs).Replace('__FACE_JSON__', $faceJs).Replace('__BUILT_JSON__', $builtJs).Replace('__PREV_JSON__', $prevJs).Replace('__HIST_JSON__', $histJs)

if ($out.IndexOf('__SNAPSHOT_JSON__') -ge 0) { Fail 'placeholder __SNAPSHOT_JSON__ still present after build' }
if ($out.Length -lt 4000) { Fail ('output suspiciously small: ' + $out.Length + ' bytes') }

# --- atomic write: .new, read-back assert, move (r98 pattern) ---
$outDir = Split-Path -Parent $OutPath
if (-not (Test-Path -LiteralPath $outDir)) { Fail ('output dir missing: ' + $outDir) }
$tmpPath = $OutPath + '.new'
if (Test-Path -LiteralPath $tmpPath) { Remove-Item -LiteralPath $tmpPath -Force }
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
try { [IO.File]::WriteAllText($tmpPath, $out, $utf8NoBom) } catch {
    if (Test-Path -LiteralPath $tmpPath) { Remove-Item -LiteralPath $tmpPath -Force }
    Fail ('write .new failed: ' + $_.Exception.Message)
}

$back = ''
try { $back = [IO.File]::ReadAllText($tmpPath, [Text.Encoding]::UTF8) }
catch { Fail ('read-back failed: ' + $_.Exception.Message) }
if ($back.Length -ne $out.Length) { Fail ('read-back length mismatch: ' + $back.Length + ' != ' + $out.Length) }
if ($back.IndexOf('<html') -lt 0) { Fail 'read-back: no html root' }
if ($back.IndexOf('const SNAP = {}') -ge 0) { Fail 'read-back: SNAP inlined as empty object' }

try { Move-Item -LiteralPath $tmpPath -Destination $OutPath -Force } catch {
    if (Test-Path -LiteralPath $tmpPath) { Remove-Item -LiteralPath $tmpPath -Force }
    Fail ('move into place failed: ' + $_.Exception.Message)
}

$zonesN = 0
try { $zonesN = @($snap.zones).Count } catch { $zonesN = 0 }
$evsN = 0
try { $evsN = @($snap.events_tail).Count } catch { $evsN = 0 }

Write-Output ('PANEL OK bytes=' + $out.Length + ' zones=' + $zonesN + ' events=' + $evsN + ' snapshot_ts=' + [string]$snap.ts_utc + ' hist=' + [int]$histAll.Count + ' prev=' + $(if ($null -ne $prevRec) { [string]$prevRec.ts } else { 'none' }) + ' hist_ok=' + $histOk + ' built=' + $built + ' path=' + $OutPath)
exit 0