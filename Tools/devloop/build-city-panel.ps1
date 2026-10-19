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
# Output : world-public\city-panel.html
#
# Note: this script only READS tick artifacts. It does not write them, so it
# never races the tick exporter.
# ---------------------------------------------------------------------------

param(
    [string]$SnapPath = '',
    [string]$FacePath = '',
    [string]$TemplatePath = '',
    [string]$OutPath = ''
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

foreach ($ph in @('__SNAPSHOT_JSON__','__FACE_JSON__','__BUILT_JSON__')) {
    if ($tpl.IndexOf($ph) -lt 0) { Fail ('template placeholder missing: ' + $ph) }
}

# String.Replace (not regex) => JSON '$' chars stay literal.
$out = $tpl.Replace('__SNAPSHOT_JSON__', $snapJs).Replace('__FACE_JSON__', $faceJs).Replace('__BUILT_JSON__', $builtJs)

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

Write-Output ('PANEL OK bytes=' + $out.Length + ' zones=' + $zonesN + ' events=' + $evsN + ' snapshot_ts=' + [string]$snap.ts_utc + ' built=' + $built + ' path=' + $OutPath)
exit 0