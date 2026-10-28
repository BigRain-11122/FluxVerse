# city-shot-shape.ps1 - ONE definition of "is this qa/ image a city frame?"
# ----------------------------------------------------------------------------
# Queue main#46 (r706) + main#47 (r707).
# Why: the public panel inlines the newest qa/ images as its "city view" card.
# Page evidence must never reach it - r705 inlined a 390-wide panel screenshot,
# grew the page 157KB -> 533KB and showed the panel its own narrow render.
# Three guards, cheapest first:
#   1. panel  - the panel's own screenshots carry "panel" in the name (r702);
#   2. family - the name must start with a registered evidence family (r707).
#               Shape alone cannot separate a 1400x900 city render from a
#               1000x1800 half-page capture, so the registry carries the
#               meaning the pixels cannot prove;
#   3. shape  - width < 421 (phone viewport) or aspect taller than 2:1
#               (full-page strip) is page evidence (r706).
# build-city-panel.ps1 and Tools\perceptor\verify.ps1 both dot-source this file,
# so the page and the census can never drift apart (main#47: the guards used to
# live only in the builder, where verify could not see them).
# Read-only, no network, ASCII-only (PS5.1 GBK law).

$script:CityShotMinWidth   = 421
$script:CityShotMaxAspect  = 2.0
$script:CityShotPanelToken = 'panel'

# Registered evidence families. Growing this list is deliberately a one-line
# edit: an unknown family is skipped by the builder (counted in shots_unnamed=)
# and named by the verify census, so a new capture tool surfaces as an
# observation instead of silently taking a card slot.
$script:CityShotFamilies = @('city-', 'city3d-', 'smoke-', 'frame-', 'soak-')

# Header-only size probe: Image.FromFile reads the header and does not decode
# pixels, so running it over every candidate is cheap.
function Get-ShotSize
{
    param([string]$Path)
    $img = $null
    $res = New-Object PSObject -Property ([ordered]@{ ok = $false; w = 0; h = 0 })
    try {
        Add-Type -AssemblyName System.Drawing -ErrorAction Stop
        $img = [System.Drawing.Image]::FromFile($Path)
        $res.w = [int]$img.Width
        $res.h = [int]$img.Height
        $res.ok = (($res.w -ge 1) -and ($res.h -ge 1))
    } catch {
        $res.ok = $false; $res.w = 0; $res.h = 0
    } finally {
        if ($img) { try { $img.Dispose() } catch { } }
    }
    return $res
}

function Test-CityShotShape
{
    param([int]$W, [int]$H, [int]$MinWidth = 421, [double]$MaxAspect = 2.0)
    if ($W -lt $MinWidth) { return $false }
    if ($H -le 0) { return $false }
    if (($H / [double]$W) -gt $MaxAspect) { return $false }
    return $true
}

function Test-CityShotFamily
{
    param([string]$Name)
    if ([string]::IsNullOrWhiteSpace($Name)) { return $false }
    foreach ($f in $script:CityShotFamilies) {
        if ($Name.StartsWith($f, [StringComparison]::OrdinalIgnoreCase)) { return $true }
    }
    return $false
}

# One row per candidate: why it is kept or dropped. reason is the first guard
# that rejects it, so a report never has to re-derive the verdict.
function Get-CityShotVerdict
{
    param([string]$Name, [string]$Path)
    $row = New-Object PSObject -Property ([ordered]@{
        name = [string]$Name; path = [string]$Path
        panel = $false; family_ok = $false; shape_ok = $false
        keep = $false; reason = ''; w = 0; h = 0
    })
    if ($Name -match $script:CityShotPanelToken) { $row.panel = $true }
    $row.family_ok = (Test-CityShotFamily -Name $Name)
    $size = Get-ShotSize -Path $Path
    $row.w = [int]$size.w
    $row.h = [int]$size.h
    if ($size.ok) { $row.shape_ok = (Test-CityShotShape -W $size.w -H $size.h) }

    if ($row.panel)          { $row.reason = 'panel' }
    elseif (-not $row.family_ok) { $row.reason = 'unnamed' }
    elseif (-not $size.ok)   { $row.reason = 'unreadable' }
    elseif (-not $row.shape_ok) { $row.reason = 'shape' }
    else                     { $row.reason = 'ok'; $row.keep = $true }
    return $row
}

# Newest first - the card shows the newest frames, and the builder applies its
# cap AFTER filtering so rejected strips cannot eat a slot.
function Get-CityShotAudit
{
    param([string]$Dir)
    $out = @()
    if ([string]::IsNullOrWhiteSpace($Dir)) { return @() }
    if (-not (Test-Path -LiteralPath $Dir)) { return @() }
    $files = @()
    try {
        $files = @(Get-ChildItem -LiteralPath $Dir -File -ErrorAction Stop |
            Where-Object { $_.Extension -match '^\.(png|jpg|jpeg)$' } |
            Sort-Object LastWriteTimeUtc -Descending)
    } catch { return @() }
    foreach ($f in $files) { $out += (Get-CityShotVerdict -Name $f.Name -Path $f.FullName) }
    return @($out)
}