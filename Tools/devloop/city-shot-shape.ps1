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

# ---------- content-addressed census cache (queue main#107, r769) ----------
# r768's cost ledger finally named the biggest bill on a cached tick: the shot
# census over 235 qa/ images cost 1407-1449 ms of a 2100 ms round (68%), because
# it opens the header of every candidate on every tick to learn something that
# only changes when a file changes. main#104 forbids raising the 3 s budget, so
# the census itself has to stop re-reading unchanged files.
#
# The key is the thing the verdicts depend on: the exact (name, length, mtime)
# set of the image files, plus the identity of this module (a threshold edit
# must invalidate every cached row, otherwise the cache would keep serving
# verdicts the new rule would no longer give). Directory path is part of the
# key too, so two sandboxes pointing at different dirs never share rows.
# A stale/corrupt/missing cache is never an error: it just means "recompute",
# and the fresh run rewrites it (fail-open - the census keeps working on a
# read-only or unwritable tree, it is only slower).
function Get-CityShotSha12
{
    param([string]$Text)
    try {
        $sha = [System.Security.Cryptography.SHA256]::Create()
        try { $bytes = $sha.ComputeHash([System.Text.Encoding]::UTF8.GetBytes([string]$Text)) }
        finally { $sha.Dispose() }
        $sb = New-Object System.Text.StringBuilder
        for ($i = 0; $i -lt 6; $i++) { [void]$sb.Append($bytes[$i].ToString('x2')) }
        return $sb.ToString()
    } catch { return '' }
}

function Get-CityShotFingerprint
{
    param([string]$Dir, [string]$ModulePath = '')
    if ([string]::IsNullOrWhiteSpace($Dir)) { return '' }
    if (-not (Test-Path -LiteralPath $Dir)) { return '' }
    $files = @()
    try {
        $files = @(Get-ChildItem -LiteralPath $Dir -File -ErrorAction Stop |
            Where-Object { $_.Extension -match '^\.(png|jpg|jpeg)$' } |
            Sort-Object Name)
    } catch { return '' }
    $parts = New-Object System.Collections.ArrayList
    [void]$parts.Add([string]$Dir)
    foreach ($f in $files) {
        [void]$parts.Add($f.Name + '|' + $f.Length + '|' + $f.LastWriteTimeUtc.Ticks)
    }
    if (-not [string]::IsNullOrWhiteSpace($ModulePath)) {
        try {
            $mb = [System.IO.File]::ReadAllBytes($ModulePath)
            [void]$parts.Add('module|' + $mb.Length + '|' + (Get-CityShotSha12 -Text ([System.Text.Encoding]::UTF8.GetString($mb))))
        } catch { [void]$parts.Add('module|?') }
    }
    return (Get-CityShotSha12 -Text ($parts -join "`n"))
}

# Returns rows (same shape as Get-CityShotAudit) plus how they were obtained.
# cached=$true means NOT ONE image header was opened this run.
#
# reason (queue main#108, r770) says WHY the cache did not answer, so the tick
# line can tell "the key never matches" from "the cache was never written" -
# two states that used to look identical. Empty reason = key hit, or a genuine
# first run (nothing to explain yet). The vocabulary is deliberately safe to
# print on a VERIFY line: 'fail' is a banned word root there (r750), which is
# why the unwritable case is 'unwritable' rather than 'write-failed'.
function Get-CityShotAuditCached
{
    param([string]$Dir, [string]$CachePath, [string]$ModulePath = '', [switch]$NoWrite)
    $res = New-Object PSObject -Property ([ordered]@{
        rows = @(); cached = $false; fp = ''; wrote = $false; reason = ''
    })
    $fp = Get-CityShotFingerprint -Dir $Dir -ModulePath $ModulePath
    $res.fp = $fp
    if ($fp -and -not [string]::IsNullOrWhiteSpace($CachePath) -and (Test-Path -LiteralPath $CachePath)) {
        try {
            $cache = Get-Content -LiteralPath $CachePath -Raw -Encoding UTF8 | ConvertFrom-Json
            if ($cache -and $cache.PSObject.Properties['rows'] -and ([string]$cache.fingerprint -eq $fp)) {
                $res.rows = @($cache.rows)
                $res.cached = $true
                return $res
            }
            $res.reason = 'stale'
        } catch { $res.reason = 'unreadable' }
    } elseif (-not $fp) {
        $res.reason = 'no-dir'
    }
    $res.rows = @(Get-CityShotAudit -Dir $Dir)
    if ((-not $NoWrite) -and $fp -and -not [string]::IsNullOrWhiteSpace($CachePath)) {
        $tmp = ''
        try {
            $parent = Split-Path -Parent $CachePath
            if ($parent -and -not (Test-Path -LiteralPath $parent)) { New-Item -ItemType Directory -Path $parent -Force | Out-Null }
            $payload = [ordered]@{
                fingerprint = $fp
                written_utc = [DateTime]::UtcNow.ToString('yyyy-MM-ddTHH:mm:ssZ')
                rows = @($res.rows)
            }
            $json = ConvertTo-Json -InputObject $payload -Depth 5 -Compress
            $tmp = $CachePath + '.new'
            [System.IO.File]::WriteAllText($tmp, $json, (New-Object System.Text.UTF8Encoding($false)))
            Move-Item -LiteralPath $tmp -Destination $CachePath -Force
            $res.wrote = $true
        } catch {
            $res.reason = 'unwritable'
            if ($tmp) { try { Remove-Item -LiteralPath $tmp -Force -ErrorAction SilentlyContinue } catch { } }
        }
    }
    return $res
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