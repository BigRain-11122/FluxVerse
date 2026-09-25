# FluxVerse r161 (P-09 CEO album): 2x2 contact sheet of the four album
# frames (day/night x water/street). NearestNeighbor only (pixel-art law,
# zero resampling blur), deterministic, fail-loud. ASCII per PS5.1 law.
# Grid: TL=day-water  TR=day-street  BL=night-water  BR=night-street.
$ErrorActionPreference = "Stop"
$repo = "C:\Users\sjs20\Desktop\FluxGroup\gaming\FluxVerse"
Add-Type -AssemblyName System.Drawing

$names = @(
    "m1-r161-album-day-water.png",
    "m1-r161-album-day-street.png",
    "m1-r161-album-night-water.png",
    "m1-r161-album-night-street.png")
$srcs = @()
foreach ($n in $names) {
    $p = Join-Path $repo ("docs\design\" + $n)
    if (-not (Test-Path $p)) { throw ("missing frame: " + $n) }
    $srcs += $p
}

$halfW = 960; $halfH = 540
$bmp = New-Object System.Drawing.Bitmap(($halfW * 2), ($halfH * 2))
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::NearestNeighbor
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::Half
$g.Clear([System.Drawing.Color]::Black)

for ($i = 0; $i -lt 4; $i++) {
    $img = [System.Drawing.Image]::FromFile($srcs[$i])
    try {
        if ($img.Width -ne 1920 -or $img.Height -ne 1080) {
            throw ("frame not 1920x1080: " + $names[$i] + " " + $img.Width + "x" + $img.Height)
        }
        $x = ($i % 2) * $halfW
        $y = [int](($i - ($i % 2)) / 2) * $halfH
        $g.DrawImage($img, $x, $y, $halfW, $halfH)
    } finally { $img.Dispose() }
}
$g.Dispose()

$out = Join-Path $repo "docs\design\m1-r161-album-4x.png"
if (Test-Path $out) { Remove-Item $out -Force }
$bmp.Save($out, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
if (-not (Test-Path $out)) { throw "sheet not written" }
$fi = Get-Item $out
Write-Output ("SHEET OK " + $fi.Name + " bytes=" + $fi.Length + " grid=TL day-water TR day-street BL night-water BR night-street")
