# FluxVerse CityWatch desktop icon generator (CEO order 2026-09-23 ~21:47: logo, desktop shortcut, fleet-wide).
# ASCII-only body (encoding law: PS5.1 no-BOM UTF-8 body is read as GBK - Chinese lives in data files only).
# Design = logo law "one point radiates flows": white CEO-light core + superbody-blue halo
# (DESIGN.md light-color rule: chao-ti blue belongs to brain-tower halo) + three city flows (cyan/gold/magenta).
# Output: fluxverse.ico - multi-size (16/32/48 BMP entries + 256 PNG entry), pixel-crisp at every scale.

param(
    [string]$OutPath = (Join-Path $PSScriptRoot 'fluxverse.ico')
)

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

# --- master pixel map: 16x16 grid, 0xAABBGGRR stored as 0xAARRGGBB (ARGB), 0 = transparent ---
$W = 16; $H = 16
$grid = New-Object 'UInt32[]' ($W * $H)

function C([string]$hex) { [Convert]::ToUInt32($hex, 16) }   # PS5.1: 0xFFFFFFFF literal overflows int32 - parse instead
$C_WHITE  = C 'FFFFFFFF'   # CEO pure white core (AARRGGBB)
$C_INNER  = C 'FF4DA3FF'   # superbody-blue inner halo
$C_MID    = C 'FF2E7CFF'   # superbody-blue mid halo
$C_DEEP   = C 'FF1B4FB8'   # superbody-blue deep accent
$C_CYAN   = C 'FF22D3EE'   # GAME data-cyan
$C_GOLD   = C 'FFF5C542'   # QUANT gold
$C_MAG    = C 'FFF45BB0'   # MEDIA magenta

function Set-Pix([int]$px, [int]$py, [uint32]$pc) {
    if ($px -ge 0 -and $px -lt $script:W -and $py -ge 0 -and $py -lt $script:H) { $script:grid[$py * $script:W + $px] = $pc }
}
function Set-Rect([int]$rx, [int]$ry, [int]$rw, [int]$rh, [uint32]$rc) {
    for ($i = 0; $i -lt $rw; $i++) { for ($j = 0; $j -lt $rh; $j++) { Set-Pix ($rx + $i) ($ry + $j) $rc } }
}

# deep accents (outer halo, sparse)
Set-Rect 6 3 4 1 $C_DEEP
Set-Pix 4 5 $C_DEEP; Set-Pix 4 6 $C_DEEP; Set-Pix 11 5 $C_DEEP; Set-Pix 11 6 $C_DEEP
Set-Pix 5 8 $C_DEEP; Set-Pix 10 8 $C_DEEP
# mid-blue halo ring around core
Set-Rect 5 4 6 1 $C_MID
Set-Rect 5 5 1 2 $C_MID
Set-Rect 10 5 1 2 $C_MID
Set-Rect 5 7 6 1 $C_MID
# inner-bright ring
Set-Rect 6 4 4 1 $C_INNER
Set-Pix 6 5 $C_INNER; Set-Pix 9 5 $C_INNER; Set-Pix 6 6 $C_INNER; Set-Pix 9 6 $C_INNER
# white core (CEO light)
Set-Rect 7 5 2 2 $C_WHITE
# three flows from under the halo
Set-Rect 7 9 2 6 $C_GOLD                                     # center gold beam rows 9-14 (continuous pillar)
Set-Pix 6 9 $C_CYAN;  Set-Pix 5 10 $C_CYAN;  Set-Pix 4 11 $C_CYAN;  Set-Pix 3 12 $C_CYAN
Set-Rect 1 13 2 2 $C_CYAN                                    # cyan end-dot
Set-Pix 9 9 $C_MAG;   Set-Pix 10 10 $C_MAG;  Set-Pix 11 11 $C_MAG; Set-Pix 12 12 $C_MAG
Set-Rect 13 13 2 2 $C_MAG                                    # magenta end-dot

# --- 32bpp BMP icon entry (bottom-up BGRA + AND mask), scaled by $scale ---
# LAW: PowerShell variables are CASE-INSENSITIVE - never reuse names like $w/$W across scopes.
$SRC_W = 16; $SRC_H = 16
function Get-BmpEntryBytes([int]$scale) {
    $dimW = $SRC_W * $scale; $dimH = $SRC_H * $scale
    $xorStride = $dimW * 4
    $xor = New-Object 'byte[]' ($xorStride * $dimH)
    $andStride = [int][Math]::Ceiling($dimW / 32) * 4
    $and = New-Object 'byte[]' ($andStride * $dimH)
    for ($row = 0; $row -lt $dimH; $row++) {
        $srcRow = [int][Math]::Floor($row / $scale)   # LAW: [int] cast is banker's rounding in PS - Floor is mandatory
        $xorBase = ($dimH - 1 - $row) * $xorStride
        $andBase = ($dimH - 1 - $row) * $andStride
        for ($col = 0; $col -lt $dimW; $col++) {
            $srcCol = [int][Math]::Floor($col / $scale)
            $cell = $script:grid[($srcRow * $SRC_W) + $srcCol]
            $xdi = $xorBase + ($col * 4)
            $xor[$xdi + 0] = [byte]($cell -band 0xFF)
            $xor[$xdi + 1] = [byte](($cell -shr 8) -band 0xFF)
            $xor[$xdi + 2] = [byte](($cell -shr 16) -band 0xFF)
            $xor[$xdi + 3] = [byte](($cell -shr 24) -band 0xFF)
            if (($cell -shr 24) -eq 0) {
                $abi = $andBase + [int][Math]::Floor($col / 8)
                $and[$abi] = [byte]($and[$abi] -bor (1 -shl (7 - ($col % 8))))
            }
        }
    }
    $hdr = New-Object 'byte[]' 40
    [Array]::Copy([BitConverter]::GetBytes([uint32]40), 0, $hdr, 0, 4)     # biSize
    [Array]::Copy([BitConverter]::GetBytes([int32]$dimW), 0, $hdr, 4, 4)     # biWidth
    [Array]::Copy([BitConverter]::GetBytes([int32](2 * $dimH)), 0, $hdr, 8, 4) # biHeight = xor + and
    [Array]::Copy([BitConverter]::GetBytes([uint16]1), 0, $hdr, 12, 2)      # biPlanes
    [Array]::Copy([BitConverter]::GetBytes([uint16]32), 0, $hdr, 14, 2)      # biBitCount
    [Array]::Copy([BitConverter]::GetBytes([uint32]0), 0, $hdr, 16, 4)       # BI_RGB
    [Array]::Copy([BitConverter]::GetBytes([uint32]($xor.Length + $and.Length)), 0, $hdr, 20, 4)
    $out = New-Object 'byte[]' ($hdr.Length + $xor.Length + $and.Length)
    [Array]::Copy($hdr, 0, $out, 0, $hdr.Length)
    [Array]::Copy($xor, 0, $out, $hdr.Length, $xor.Length)
    [Array]::Copy($and, 0, $out, ($hdr.Length + $xor.Length), $and.Length)
    return $out
}

# --- 256px PNG entry (GDI+ render of the same grid) ---
function Get-PngEntryBytes([int]$scale) {
    $dimW = $SRC_W * $scale; $dimH = $SRC_H * $scale
    $bmp = New-Object System.Drawing.Bitmap $dimW, $dimH, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    for ($gy = 0; $gy -lt $SRC_H; $gy++) {
        for ($gx = 0; $gx -lt $SRC_W; $gx++) {
            $cell = $script:grid[($gy * $SRC_W) + $gx]
            if (($cell -shr 24) -eq 0) { continue }
            $col = [System.Drawing.Color]::FromArgb([int](($cell -shr 24) -band 0xFF), [int](($cell -shr 16) -band 0xFF), [int](($cell -shr 8) -band 0xFF), [int]($cell -band 0xFF))
            $br = New-Object System.Drawing.SolidBrush $col
            $g.FillRectangle($br, ($gx * $scale), ($gy * $scale), $scale, $scale)
            $br.Dispose()
        }
    }
    $g.Dispose()
    $ms = New-Object System.IO.MemoryStream
    $bmp.Save($ms, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    return $ms.ToArray()
}

# --- assemble ICO: 16(BMP) 32(BMP) 48(BMP) 256(PNG) ---
$sizes = @(
    @{ dim = 16; data = (Get-BmpEntryBytes 1) },
    @{ dim = 32; data = (Get-BmpEntryBytes 2) },
    @{ dim = 48; data = (Get-BmpEntryBytes 3) },
    @{ dim = 256; data = (Get-PngEntryBytes 16) }
)

$ico = New-Object System.Collections.Generic.List[byte]
$ico.AddRange([BitConverter]::GetBytes([uint16]0))   # reserved
$ico.AddRange([BitConverter]::GetBytes([uint16]1))    # type = icon
$ico.AddRange([BitConverter]::GetBytes([uint16]$sizes.Count))

$offset = 6 + 16 * $sizes.Count
foreach ($e in $sizes) {
    $dimByte = if ($e.dim -ge 256) { [byte]0 } else { [byte]$e.dim }
    $ico.Add($dimByte); $ico.Add($dimByte); $ico.Add([byte]0); $ico.Add([byte]0)
    $ico.AddRange([BitConverter]::GetBytes([uint16]1))     # planes
    $ico.AddRange([BitConverter]::GetBytes([uint16]32))    # bit count
    $ico.AddRange([BitConverter]::GetBytes([uint32]$e.data.Length))
    $ico.AddRange([BitConverter]::GetBytes([uint32]$offset))
    $offset += $e.data.Length
}
foreach ($e in $sizes) { $ico.AddRange([byte[]]$e.data) }

[System.IO.File]::WriteAllBytes($OutPath, $ico.ToArray())

# verify loadable + write a 256px PNG preview (gitignored out/) for visual check
$probe = New-Object System.Drawing.Icon($OutPath)
$probeSize = $probe.Size.Width
$probe.Dispose()

$prevDir = Join-Path (Split-Path -Parent $OutPath) 'out'
New-Item -ItemType Directory -Force -Path $prevDir | Out-Null
$prevPath = Join-Path $prevDir 'icon-preview.png'
[System.IO.File]::WriteAllBytes($prevPath, (Get-PngEntryBytes 16))

$fi = Get-Item $OutPath
Write-Output ("ICON OK: " + $OutPath + " (" + $fi.Length + " bytes, loads " + $probeSize + "px)")
Write-Output ("PREVIEW: " + $prevPath)
