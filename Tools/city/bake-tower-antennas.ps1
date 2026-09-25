# FluxVerse r132: bake tower-v2 antenna needle sprites (self-baked, zero
# external art; tower-v2-manifest antennas law - middle CEO throne pin pure
# white always-on, flanks fleet heartbeat pins). Mid 4x14 px, side 2x9 px,
# pure white core with soft side edges -> 0.25x0.875u / 0.125x0.5625u @ the
# default 16ppu tier (CityImportPostprocessor default, no PpuFor row needed).
# Deterministic: double-run SHA256 must match. ASCII-only (PS5.1 GBK law).
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
$dir = Join-Path $PSScriptRoot '..\..\City\Assets\ArtPacks\tower-antennas'
New-Item -ItemType Directory -Force -Path $dir | Out-Null

function Bake-Needle($path, $w, $h, $edgeAlpha, $coreAlpha) {
    $bmp = New-Object System.Drawing.Bitmap($w, $h)
    for ($y = 0; $y -lt $h; $y++) {
        for ($x = 0; $x -lt $w; $x++) {
            $a = $coreAlpha
            if ($x -eq 0 -or $x -eq ($w - 1)) { $a = $edgeAlpha }
            $bmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($a, 255, 255, 255))
        }
    }
    $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
}

$mid = Join-Path $dir 'tower-antenna-mid.png'
$side = Join-Path $dir 'tower-antenna-side.png'
Bake-Needle $mid 4 14 110 255
Bake-Needle $side 2 9 160 255
$h1 = (Get-FileHash -Algorithm SHA256 $mid).Hash
$h2 = (Get-FileHash -Algorithm SHA256 $side).Hash
# idempotency gate: re-bake must land byte-identical sprites
Bake-Needle $mid 4 14 110 255
Bake-Needle $side 2 9 160 255
$h1b = (Get-FileHash -Algorithm SHA256 $mid).Hash
$h2b = (Get-FileHash -Algorithm SHA256 $side).Hash
if ($h1 -ne $h1b -or $h2 -ne $h2b) { throw 'BAKE NOT DETERMINISTIC' }
if ($h1 -eq $h2) { throw 'mid and side sprites must differ' }
Write-Output ('BAKE OK mid=4x14 sha12=' + $h1.Substring(0,12) + ' side=2x9 sha12=' + $h2.Substring(0,12))
