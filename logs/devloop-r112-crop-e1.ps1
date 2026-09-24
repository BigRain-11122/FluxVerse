# FluxVerse DevLoop r112: exact-rect crop of E1 in the l1-south PNG for an
# open-ended multimodal read (no leading). E1 world 29..35 x -16..-12,
# cam (30,-7) size 9 -> PNG cols 900..1260 rows 839..1079. Add margin.
# ASCII only.
$ErrorActionPreference = 'Stop'
$repo = Split-Path -Parent $PSScriptRoot
Add-Type -AssemblyName System.Drawing
$src = Join-Path $repo 'docs\design\m1-r112-officeband-l1-south.png'
$out = Join-Path $env:TEMP 'fv-e1-crop3.png'
$bmp = New-Object System.Drawing.Bitmap($src)
try {
    $crop = New-Object System.Drawing.Bitmap(560, 380)
    $g = [System.Drawing.Graphics]::FromImage($crop)
    $g.DrawImage($bmp, (New-Object System.Drawing.Rectangle(0, 0, 560, 380)),
        (New-Object System.Drawing.Rectangle(840, 700, 560, 380)), [System.Drawing.GraphicsUnit]::Pixel)
    $g.Dispose()
    $crop.Save($out, [System.Drawing.Imaging.ImageFormat]::Png)
    $crop.Dispose()
    Write-Output ("CROPPED " + $out)
} finally { $bmp.Dispose() }
exit 0
