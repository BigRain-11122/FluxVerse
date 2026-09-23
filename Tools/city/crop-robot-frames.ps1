# FluxVerse DevLoop r36: tophat-robot sheet cropper (P-28 remaining wiring face).
# Source: City/Assets/ArtPacks/tophat-robot/robot_sheet_16x16.png (64x64 = 4x4 grid
# of 16x16 animation frames, CC-BY 3.0 Nelson Yiap - credits live in ARTPACKS-LEDGER.md).
# Cuts 16 frames row-major into tophat-robot/frames/robot_f00..f15.png (crop is a
# deterministic derivative of the CC-BY sheet; ledger row records the consumption)
# and emits a x6 labeled contact sheet logs/r36-contact.png for frame picking.
# ASCII-only per PS5.1 encoding law (no CJK anywhere in this body).
$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.Drawing
$repo = "C:\Users\sjs20\Desktop\FluxGroup\gaming\FluxVerse"
$packDir = Join-Path $repo "City\Assets\ArtPacks\tophat-robot"
$framesDir = Join-Path $packDir "frames"
$sheet = Join-Path $packDir "robot_sheet_16x16.png"
New-Item -ItemType Directory -Force -Path $framesDir | Out-Null

$src = [System.Drawing.Bitmap]::FromFile($sheet)
if ($src.Width -ne 64 -or $src.Height -ne 64) { throw "sheet is $($src.Width)x$($src.Height), expected 64x64" }
for ($f = 0; $f -lt 16; $f++) {
    $col = $f % 4; $row = [Math]::Floor($f / 4)
    $frame = New-Object System.Drawing.Bitmap (16, 16)
    $g = [System.Drawing.Graphics]::FromImage($frame)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::NearestNeighbor
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::Half
    $g.DrawImage($src, (New-Object System.Drawing.Rectangle (0, 0, 16, 16)),
        (New-Object System.Drawing.Rectangle (($col * 16), ($row * 16), 16, 16)),
        [System.Drawing.GraphicsUnit]::Pixel)
    $g.Dispose()
    $out = Join-Path $framesDir ("robot_f{0:d2}.png" -f $f)
    $frame.Save($out, [System.Drawing.Imaging.ImageFormat]::Png)
    $frame.Dispose()
}
$src.Dispose()

# contact sheet: 4x4 grid, x6 nearest-neighbor upscale, labels F00..F15
$S = 6; $cell = 16 * $S + 24
$bmp = New-Object System.Drawing.Bitmap (($cell * 4 + 12), ($cell * 4 + 12))
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::NearestNeighbor
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::Half
$g.Clear([System.Drawing.Color]::FromArgb(40, 44, 52))
$font = New-Object System.Drawing.Font ("Consolas", 9, [System.Drawing.FontStyle]::Bold)
for ($f = 0; $f -lt 16; $f++) {
    $col = $f % 4; $row = [Math]::Floor($f / 4)
    $x0 = $col * $cell + 6; $y0 = $row * $cell + 6
    $img = [System.Drawing.Image]::FromFile((Join-Path $framesDir ("robot_f{0:d2}.png" -f $f)))
    $g.DrawImage($img, $x0, ($y0 + 16), (16 * $S), (16 * $S))
    $img.Dispose()
    $g.DrawString(("F{0:d2}" -f $f), $font, [System.Drawing.Brushes]::Gold, $x0, $y0)
}
$g.Dispose()
$out2 = Join-Path $repo "logs\r36-contact.png"
$bmp.Save($out2, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
Write-Output "16 frames -> $framesDir"
Write-Output "contact -> $out2"
