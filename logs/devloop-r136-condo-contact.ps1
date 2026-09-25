# FluxVerse DevLoop r136: office-band v1 sprite door survey (Condo_4_24 whole-building sprite).
# Question: does the current office band v1 sprite have an entrance door, and how tall vs the
# 1.5x-of-resident gate? Scales x2 nearest-neighbour. ASCII-only body. Read-only; writes one PNG.
$ErrorActionPreference = 'Stop'
$repo = Split-Path -Parent $PSScriptRoot
$packDir = Join-Path $repo 'City\Assets\ArtPacks\office-ladder'
$outFile = Join-Path $repo 'logs\devloop-r136-condo-contact.png'
Add-Type -AssemblyName System.Drawing

$names = @(
    'ME_Singles_Generic_Building_48x48_Condo_4_24.png',
    'ME_Singles_Generic_Building_48x48_Condo_4_11.png'
)

$scale = 2
$gap = 10
$maxH = 0
$bmps = New-Object System.Collections.ArrayList
foreach ($n in $names)
{
    $src = New-Object System.Drawing.Bitmap((Join-Path $packDir $n))
    [void]$bmps.Add($src)
    if ($src.Height -gt $maxH) { $maxH = $src.Height }
}
$canvasW = 0
foreach ($b in $bmps) { $canvasW += $b.Width * $scale + $gap }
$canvasW += $gap
$canvasH = $maxH * $scale + $gap * 2
$canvas = New-Object System.Drawing.Bitmap($canvasW, $canvasH)
$g = [System.Drawing.Graphics]::FromImage($canvas)
$g.Clear([System.Drawing.Color]::FromArgb(255, 40, 44, 52))
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::NearestNeighbor
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::Half
try
{
    $x = $gap
    foreach ($b in $bmps)
    {
        $destW = $b.Width * $scale; $destH = $b.Height * $scale
        $y = $canvasH - $gap - $destH
        $destRect = New-Object System.Drawing.Rectangle($x, $y, $destW, $destH)
        $g.DrawImage($b, $destRect)
        $x += $destW + $gap
    }
}
finally { $g.Dispose() }
$canvas.Save($outFile, [System.Drawing.Imaging.ImageFormat]::Png)
$canvas.Dispose()
foreach ($b in $bmps) { $b.Dispose() }
"out=$outFile canvas=${canvasW}x${canvasH}"
$raw = [System.IO.File]::ReadAllText($PSCommandPath)
$nonAscii = 0
foreach ($ch in $raw.ToCharArray()) { if ([int]$ch -gt 127) { $nonAscii++ } }
"ascii_audit=$nonAscii"
