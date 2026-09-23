# FluxVerse City banner text baker (P-16 r18 debt: CJK banner copy layer;
# P-18 r24 slice 3: 2D beveled text - disk glow + drop shadow passes).
# ENCODING LAW: this script is ASCII-only; ALL CJK copy lives in the UTF-8 data
# file City/Assets/Data/interior-strings.txt and is only READ here (PS5.1 GBK law).
# WHY PRE-BAKE: Tuanjie has no CJK font asset in the City project and no in-engine
# text path for runtime-only sprites; PS GDI+ rasterizes the glyphs once into a
# transparent PNG that CityInterior.cs loads at runtime (File.ReadAllBytes +
# Texture2D.LoadImage - no asset import dependency, batch == play).
# OUTPUT: City/BannerData/interior-banner-text.png, 1000x130 px @ 50 px per world
# unit -> 20x2.6 world units at sprite ppu 50, exactly matching the banner glass.
# The PNG lives OUTSIDE Assets/ on purpose (r18): anything under Assets/ gets
# TextureImporter'd by the editor, and the runtime bytes path (File.ReadAllBytes
# in CityInterior) must not share a path with an imported twin of the same image.
# Deterministic + idempotent: same strings file -> same PNG (safe to re-run).
$ErrorActionPreference = "Stop"
$repo = "C:\Users\sjs20\Desktop\FluxGroup\gaming\FluxVerse"
$outDir = Join-Path $repo "City\BannerData"
$stringsFile = Join-Path $repo "City\Assets\Data\interior-strings.txt"
$outFile = Join-Path $outDir "interior-banner-text.png"
if (-not (Test-Path $outDir)) { New-Item -ItemType Directory -Path $outDir | Out-Null }

if (-not (Test-Path $stringsFile)) { Write-Output "MISSING $stringsFile"; exit 1 }
$title = $null; $note = $null
foreach ($line in [System.IO.File]::ReadAllLines($stringsFile, [System.Text.Encoding]::UTF8)) {
    if ($line -match '^banner_QUANT_title=(.+)$') { $title = $Matches[1].Trim() }
    if ($line -match '^banner_QUANT_note=(.+)$')  { $note  = $Matches[1].Trim() }
}
if (-not $title) { Write-Output "PARSE FAIL: banner_QUANT_title missing"; exit 1 }
if (-not $note)  { Write-Output "PARSE FAIL: banner_QUANT_note missing";  exit 1 }

Add-Type -AssemblyName System.Drawing
$installed = @([System.Drawing.FontFamily]::Families | ForEach-Object { $_.Name })
$family = "Microsoft YaHei"
if ($installed -notcontains $family) { $family = "SimHei" }
if ($installed -notcontains $family) { Write-Output "NO CJK FONT (Microsoft YaHei / SimHei both missing)"; exit 1 }

$W = 1000; $H = 130
$bmp = New-Object System.Drawing.Bitmap($W, $H)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::None
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
$g.Clear([System.Drawing.Color]::Transparent)

function New-FittedFont($graphics, $text, $familyName, $startSize, [bool]$bold, $maxW) {
    $size = $startSize
    $f = $null
    while ($true) {
        $style = [System.Drawing.FontStyle]::Regular
        if ($bold) { $style = [System.Drawing.FontStyle]::Bold }
        if ($f) { $f.Dispose() }
        $f = New-Object System.Drawing.Font($familyName, $size, $style, [System.Drawing.GraphicsUnit]::Pixel)
        $w = $graphics.MeasureString($text, $f).Width
        if ($w -le $maxW -or $size -le 14) { return $f }
        $size -= 2
    }
}

$fmt = New-Object System.Drawing.StringFormat
$fmt.Alignment = [System.Drawing.StringAlignment]::Center
$fmt.LineAlignment = [System.Drawing.StringAlignment]::Center

# title: warm GUIAgent gold (matches the banner rim/halo accents), note: cool pale
$titleBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 246, 208, 112))
$noteBrush  = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(230, 198, 208, 224))

$titleFont = New-FittedFont $g $title $family 46 $true 960
$noteFont  = New-FittedFont $g $note  $family 24 $false 940

# r24 (P-18 slice 3): 2D beveled text behind the fill. Glow = one DrawString per
# offset in a pixel disk around the glyph body - SourceOver accumulation builds a
# soft-falloff halo (bright at the glyph edge, one pass at the rim). Shadow =
# the same glyphs offset down in near-black cool (2D depth cue). Moonlight LUT:
# the gold title emits warm, the pale note emits cool blue. Layer order per
# line: glow -> shadow -> fill. Deterministic, all GDI+, same input = same PNG.
function Draw-BevelText($graphics, $text, $font, $rect, $fmt,
    $glowR, $glowG, $glowB, $glowAlphaPerPass, $glowRadius,
    $shadowDx, $shadowDy, $shadowAlpha, $fillBrush) {
    $glowBrush = New-Object System.Drawing.SolidBrush(
        [System.Drawing.Color]::FromArgb($glowAlphaPerPass, $glowR, $glowG, $glowB))
    $rr2 = $glowRadius * $glowRadius
    for ($oy = -$glowRadius; $oy -le $glowRadius; $oy++) {
        for ($ox = -$glowRadius; $ox -le $glowRadius; $ox++) {
            if ($ox * $ox + $oy * $oy -gt $rr2) { continue }
            $gr = New-Object System.Drawing.RectangleF(
                ($rect.X + $ox), ($rect.Y + $oy), $rect.Width, $rect.Height)
            $graphics.DrawString($text, $font, $glowBrush, $gr, $fmt)
        }
    }
    $glowBrush.Dispose()
    $shadowBrush = New-Object System.Drawing.SolidBrush(
        [System.Drawing.Color]::FromArgb($shadowAlpha, 6, 9, 14))
    $sr = New-Object System.Drawing.RectangleF(
        ($rect.X + $shadowDx), ($rect.Y + $shadowDy), $rect.Width, $rect.Height)
    $graphics.DrawString($text, $font, $shadowBrush, $sr, $fmt)
    $shadowBrush.Dispose()
    $graphics.DrawString($text, $font, $fillBrush, $rect, $fmt)
}

$titleRect = New-Object System.Drawing.RectangleF(0, 6, $W, 62)
$noteRect  = New-Object System.Drawing.RectangleF(0, 68, $W, 56)
Draw-BevelText $g $title $titleFont $titleRect $fmt 255 196 96 18 3 0 3 205 $titleBrush
Draw-BevelText $g $note  $noteFont  $noteRect  $fmt 148 190 255 14 2 0 2 190 $noteBrush

$bmp.Save($outFile, [System.Drawing.Imaging.ImageFormat]::Png)
$kb = [math]::Round((Get-Item $outFile).Length / 1KB, 1)
Write-Output "BAKE OK: $outFile (${W}x${H}, ${kb}KB, family=$family, fx=glow+shadow, title_px=$(($titleFont.Size))($(($title.Length)) chars), note_px=$(($noteFont.Size))($(($note.Length)) chars))"
$titleFont.Dispose(); $noteFont.Dispose()
$titleBrush.Dispose(); $noteBrush.Dispose()
$fmt.Dispose(); $g.Dispose(); $bmp.Dispose()
