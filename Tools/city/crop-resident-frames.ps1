# FluxVerse DevLoop r37: residents-crowd idle-frame cropper (P-28 last wiring face).
# Source: City/Assets/ArtPacks/residents-crowd/<n>/Idle.png (48px-tall horizontal
# strips, CC-BY -> OGA-BY 3.0 CraftPix; credits live in ARTPACKS-LEDGER.md header).
# Resident 1 ships 288x48 = 6 idle frames; residents 2..12 ship 192x48 = 4 each.
# Cuts every idle frame into residents-crowd/frames/resident_<nn>_idle_f<k>.png
# (crop = deterministic derivative of the licensed sheets; ledger row records the
# consumption) and emits a x3 labeled contact sheet logs/r37-contact.png for the
# frame pick. Walk/Special sheets stay unconsumed (M2 walk-animation face debt).
# ASCII-only per PS5.1 encoding law (no CJK anywhere in this body).
$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.Drawing
$repo = "C:\Users\sjs20\Desktop\FluxGroup\gaming\FluxVerse"
$packDir = Join-Path $repo "City\Assets\ArtPacks\residents-crowd"
$framesDir = Join-Path $packDir "frames"
New-Item -ItemType Directory -Force -Path $framesDir | Out-Null

$S = 3                                   # contact-sheet upscale
$cellW = 48 * $S + 14
$cellH = 48 * $S + 20
$cols = 6                                # widest resident row (R1 = 6 frames)
$rows = 12
$total = 0
$pick = @{}                              # resident -> frame count (contact layout)

for ($n = 1; $n -le 12; $n++) {
    $src = Join-Path $packDir ("{0}\Idle.png" -f $n)
    if (-not (Test-Path $src)) { throw "missing Idle sheet for resident $n" }
    $bmp = [System.Drawing.Bitmap]::FromFile($src)
    if ($bmp.Height -ne 48) { $bmp.Dispose(); throw "resident $n Idle height $($bmp.Height), expected 48" }
    if (($bmp.Width % 48) -ne 0) { $bmp.Dispose(); throw "resident $n Idle width $($bmp.Width) not a 48 multiple" }
    $fc = $bmp.Width / 48
    $pick[$n] = $fc
    for ($k = 0; $k -lt $fc; $k++) {
        $frame = New-Object System.Drawing.Bitmap (48, 48)
        $g = [System.Drawing.Graphics]::FromImage($frame)
        $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::NearestNeighbor
        $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::Half
        $g.DrawImage($bmp, (New-Object System.Drawing.Rectangle (0, 0, 48, 48)),
            (New-Object System.Drawing.Rectangle (($k * 48), 0, 48, 48)),
            [System.Drawing.GraphicsUnit]::Pixel)
        $g.Dispose()
        $out = Join-Path $framesDir ("resident_{0:d2}_idle_f{1:d2}.png" -f $n, $k)
        $frame.Save($out, [System.Drawing.Imaging.ImageFormat]::Png)
        $frame.Dispose()
        $total++
    }
    $bmp.Dispose()
}

# contact sheet: one row per resident, frames labeled R<n>.I<k> (pick evidence)
$bmp2 = New-Object System.Drawing.Bitmap (($cellW * $cols + 12), ($cellH * $rows + 12))
$g2 = [System.Drawing.Graphics]::FromImage($bmp2)
$g2.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::NearestNeighbor
$g2.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::Half
$g2.Clear([System.Drawing.Color]::FromArgb(40, 44, 52))
$font = New-Object System.Drawing.Font ("Consolas", 9, [System.Drawing.FontStyle]::Bold)
for ($n = 1; $n -le 12; $n++) {
    $y0 = ($n - 1) * $cellH + 6
    for ($k = 0; $k -lt $pick[$n]; $k++) {
        $x0 = $k * $cellW + 6
        $img = [System.Drawing.Image]::FromFile((Join-Path $framesDir ("resident_{0:d2}_idle_f{1:d2}.png" -f $n, $k)))
        $g2.DrawImage($img, $x0, ($y0 + 16), (48 * $S), (48 * $S))
        $img.Dispose()
        $g2.DrawString(("R{0}.I{1}" -f $n, $k), $font, [System.Drawing.Brushes]::Gold, $x0, $y0)
    }
}
$g2.Dispose()
$out2 = Join-Path $repo "logs\r37-contact.png"
$bmp2.Save($out2, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp2.Dispose()
Write-Output "$total idle frames -> $framesDir"
Write-Output "contact -> $out2"
