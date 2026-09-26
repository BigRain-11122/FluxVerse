# FluxVerse s7-album-sheet.ps1 (T-FV-002 S7, rectification order item 5):
# the CEO side-by-side review sheet - art-target-dusk.png (the CEO anchor)
# against the coherent dusk hero frame (AlbumShot law). NearestNeighbor only
# (pixel-art law), deterministic, fail-loud. ASCII per the PS5.1 encoding law.
# Panes: LEFT = TARGET (2730x1536 drawn at /2 = 1365x768), RIGHT = the
# FluxVerse dusk hero (1920x1080 drawn at the SAME 1365x768 display size =
# same visual scale, same 16:9 aspect, honest A/B). 44px label strip.
# Output: docs/design/m1-r183-s7-side-by-side.png
$ErrorActionPreference = "Stop"
$repo = "C:\Users\sjs20\Desktop\FluxGroup\gaming\FluxVerse"
Add-Type -AssemblyName System.Drawing

$target = Join-Path $repo "docs\design\art-target-dusk.png"
$hero   = Join-Path $repo "docs\design\m1-r181-dusk-water.png"
foreach ($p in @($target, $hero)) {
    if (-not (Test-Path $p)) { throw ("missing frame: " + $p) }
}

$paneW = 1365; $paneH = 768; $strip = 44
$bmp = New-Object System.Drawing.Bitmap (($paneW * 2), ($paneH + $strip))
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::NearestNeighbor
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::Half
$g.Clear([System.Drawing.Color]::Black)

$img = [System.Drawing.Image]::FromFile($target)
try {
    if ($img.Width -ne 2730 -or $img.Height -ne 1536) {
        throw ("target not 2730x1536: " + $img.Width + "x" + $img.Height)
    }
    $g.DrawImage($img, 0, $strip, $paneW, $paneH)
} finally { $img.Dispose() }

$img = [System.Drawing.Image]::FromFile($hero)
try {
    if ($img.Width -ne 1920 -or $img.Height -ne 1080) {
        throw ("hero not 1920x1080: " + $img.Width + "x" + $img.Height)
    }
    $g.DrawImage($img, $paneW, $strip, $paneW, $paneH)
} finally { $img.Dispose() }

$font = New-Object System.Drawing.Font ("Consolas", 20, [System.Drawing.FontStyle]::Bold)
$brush = [System.Drawing.Brushes]::White
$g.DrawString("TARGET  art-target-dusk.png", $font, $brush, 12, 8)
$g.DrawString("FLUXVERSE  dusk hero r184 (fog a25 + band a85 + windows v2)", $font, $brush, ($paneW + 12), 8)
$font.Dispose()
$g.Dispose()

$out = Join-Path $repo "docs\design\m1-r183-s7-side-by-side.png"
$ms = New-Object System.IO.MemoryStream
$bmp.Save($ms, [System.Drawing.Imaging.ImageFormat]::Png)
[IO.File]::WriteAllBytes($out, $ms.ToArray())
$ms.Dispose()
$bmp.Dispose()

$sha = (Get-FileHash $out -Algorithm SHA256).Hash.Substring(0, 12)
Write-Output ("S7 SHEET OK " + $out + " sha12=" + $sha)
