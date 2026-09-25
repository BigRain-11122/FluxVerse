# FluxVerse DevLoop r136: floor-plate contact sheet for multimodal structure read.
# Crops representative plates (Ground/Middle/Roof x2 variants), scales x2 nearest-neighbour,
# lays out side by side. Question for the reader: per 48px band - complete floor module or
# continuous slab? ASCII-only body (PS5.1 GBK law). Read-only sources; writes one PNG.
$ErrorActionPreference = 'Stop'
$repo = Split-Path -Parent $PSScriptRoot
$packDir = Join-Path $repo 'City\Assets\ArtPacks\office-ladder'
$outFile = Join-Path $repo 'logs\devloop-r136-plate-contact.png'
Add-Type -AssemblyName System.Drawing

$names = @(
    'ME_Singles_Floor_Modular_Building_48x48_Ground_Floor_Condo_Modular_1.png',
    'ME_Singles_Floor_Modular_Building_48x48_Ground_Floor_Condo_Modular_2.png',
    'ME_Singles_Floor_Modular_Building_48x48_Middle_Floor_Modular_1.png',
    'ME_Singles_Floor_Modular_Building_48x48_Middle_Floor_Modular_2.png',
    'ME_Singles_Floor_Modular_Building_48x48_Roof_Modular_1.png',
    'ME_Singles_Floor_Modular_Building_48x48_Roof_Modular_2.png'
)

$scale = 2
$gap = 10
$slotW = 48 * $scale
$maxH = 0
$bmps = New-Object System.Collections.ArrayList
foreach ($n in $names)
{
    $src = New-Object System.Drawing.Bitmap((Join-Path $packDir $n))
    [void]$bmps.Add($src)
    if ($src.Height -gt $maxH) { $maxH = $src.Height }
}
$canvasW = $slotW * $bmps.Count + $gap * ($bmps.Count + 1)
$canvasH = $maxH * $scale + $gap * 2
$canvas = New-Object System.Drawing.Bitmap($canvasW, $canvasH)
$g = [System.Drawing.Graphics]::FromImage($canvas)
$g.Clear([System.Drawing.Color]::FromArgb(255, 40, 44, 52))
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::NearestNeighbor
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::Half
try
{
    for ($i = 0; $i -lt $bmps.Count; $i++)
    {
        $x = $gap + $i * ($slotW + $gap)
        $destW = $bmps[$i].Width * $scale
        $destH = $bmps[$i].Height * $scale
        # bottom-align each strip on the canvas (feet on one ground line)
        $y = $canvasH - $gap - $destH
        $destRect = New-Object System.Drawing.Rectangle($x, $y, $destW, $destH)
        $g.DrawImage($bmps[$i], $destRect)
    }
}
finally { $g.Dispose() }
$canvas.Save($outFile, [System.Drawing.Imaging.ImageFormat]::Png)
$canvas.Dispose()
foreach ($b in $bmps) { $b.Dispose() }
"out=$outFile canvas=${canvasW}x${canvasH}"
# self-audit ASCII
$raw = [System.IO.File]::ReadAllText($PSCommandPath)
$nonAscii = 0
foreach ($ch in $raw.ToCharArray()) { if ([int]$ch -gt 127) { $nonAscii++ } }
"ascii_audit=$nonAscii"
