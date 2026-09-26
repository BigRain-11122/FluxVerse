# FluxVerse r188: bake the lab-digits seven-segment counter strip (P-39
# temporal wiring stage, T-FV-003 data-display asset half; D-20260926-06).
# One deterministic GDI+ strip under ArtPacks/lab-glass/:
#   lab-digits.png  80x10 = 10 cells of 7x10 px (pitch 8, 1px inter-digit
#                   gap), seven-segment glyphs 0-9.
# World law: lab-glass folder tier = PPU24 (PpuFor row in force) -> digit
# cell 7x10 art px = 0.292 x 0.417u; runtime slices one sprite per digit
# (Sprite.Create, residents-atlas r99 precedent); the readout row is
# center-anchored and its width derives from the LIVE digit count.
# Segment map (cell-local coords, 7 wide x 10 tall):
#   a: x2..4 y0..1   f: x0..1 y2..3   b: x5..6 y2..3
#   g: x2..4 y4..5   e: x0..1 y6..7   c: x5..6 y6..7
#   d: x2..4 y8..9
# Style law (lab-glass family, r140 CPH4 spectrum): ON segments = lit core
# (200,240,255 a235) = chamber-window / lit-slot family color; OFF segments
# = faint powered-display grid (50,90,140 a70) - the counter reads as a
# live device, never dead pixels.
# Honesty law (D-02): digits are a DISPLAY (emitted light, sign family) -
# constant alpha, no tier modulation; values are live-derived at runtime
# from world-state (never baked numbers - the strip carries glyphs only).
# Gates (fail-loud, r97 band-self-check precedent):
#   G1 strip IHDR 80x10 + all four corners transparent
#   G2 per-digit ON px count == seven-segment truth table
#   G3 per-digit OFF px count == 34 - ON (uniform faint grid)
#   G4 gap columns (x = 7 + 8k) fully transparent
#   G5 double-run SHA256 idempotent + 10 cells pairwise distinct
# Deterministic: no random, no clock. ASCII-only (PS5.1 GBK law).
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
$dir  = Join-Path $PSScriptRoot '..\..\City\Assets\ArtPacks\lab-glass'
New-Item -ItemType Directory -Force -Path $dir | Out-Null
$path = Join-Path $dir 'lab-digits.png'

# segment rects (cell-local, inclusive x0,y0,x1,y1)
$seg = @{
    a = @(2, 0, 4, 1); f = @(0, 2, 1, 3); b = @(5, 2, 6, 3)
    g = @(2, 4, 4, 5); e = @(0, 6, 1, 7); c = @(5, 6, 6, 7)
    d = @(2, 8, 4, 9)
}
# seven-segment truth table 0..9
$truth = @(
    @('a','b','c','d','e','f'),
    @('b','c'),
    @('a','b','d','e','g'),
    @('a','b','c','d','g'),
    @('b','c','f','g'),
    @('a','c','d','f','g'),
    @('a','c','d','e','f','g'),
    @('a','b','c'),
    @('a','b','c','d','e','f','g'),
    @('a','b','c','d','f','g')
)
$ON_A = 235; $ON_R = 200; $ON_G = 240; $ON_B = 255
$OFF_A = 70; $OFF_R = 50; $OFF_G = 90; $OFF_B = 140

function New-Strip() {
    $bmp = New-Object System.Drawing.Bitmap(80, 10)
    for ($dg = 0; $dg -lt 10; $dg++) {
        $cx0 = $dg * 8
        foreach ($key in @('a','b','c','d','e','f','g')) {
            $r = $seg[$key]
            $isOn = $truth[$dg] -contains $key
            $a = $OFF_A; $rr = $OFF_R; $gg = $OFF_G; $bb = $OFF_B
            if ($isOn) { $a = $ON_A; $rr = $ON_R; $gg = $ON_G; $bb = $ON_B }
            for ($y = $r[1]; $y -le $r[3]; $y++) {
                for ($x = $r[0]; $x -le $r[2]; $x++) {
                    $bmp.SetPixel(($cx0 + $x), $y, [System.Drawing.Color]::FromArgb($a, $rr, $gg, $bb))
                }
            }
        }
    }
    return $bmp
}

function Test-Strip($bmp) {
    if ($bmp.Width -ne 80 -or $bmp.Height -ne 10) { throw 'G1 strip is not 80x10' }
    foreach ($c in @(@(0,0), @(79,0), @(0,9), @(79,9))) {
        if ($bmp.GetPixel($c[0], $c[1]).A -ne 0) { throw ('G1 corner not transparent: ' + ($c -join ',')) }
    }
    $expectOn = @(28, 8, 26, 26, 18, 26, 30, 14, 34, 30)
    $cellHash = @{}
    for ($dg = 0; $dg -lt 10; $dg++) {
        $onC = 0; $offC = 0; $sb = New-Object System.Text.StringBuilder
        for ($y = 0; $y -lt 10; $y++) {
            for ($x = 0; $x -lt 7; $x++) {
                $p = $bmp.GetPixel(($dg * 8 + $x), $y)
                [void]$sb.Append($p.A.ToString('X2')).Append($p.R).Append(',').Append($p.G).Append(',').Append($p.B).Append(';')
                if ($p.A -eq $ON_A) { $onC++ }
                elseif ($p.A -eq $OFF_A) { $offC++ }
                elseif ($p.A -ne 0) { throw ('G2 unknown alpha in digit cell ' + $dg) }
            }
        }
        if ($onC -ne $expectOn[$dg]) { throw ('G2 digit ' + $dg + ' ON count ' + $onC + ' != truth ' + $expectOn[$dg]) }
        if ($offC -ne (34 - $expectOn[$dg])) { throw ('G3 digit ' + $dg + ' OFF count ' + $offC + ' != ' + (34 - $expectOn[$dg])) }
        $cellHash[$dg] = $sb.ToString()
    }
    for ($i = 0; $i -lt 10; $i++) {
        for ($j = ($i + 1); $j -lt 10; $j++) {
            if ($cellHash[$i] -eq $cellHash[$j]) { throw ('G5 digit cells ' + $i + ' and ' + $j + ' are identical') }
        }
    }
    for ($gx = 7; $gx -lt 80; $gx += 8) {
        for ($y = 0; $y -lt 10; $y++) {
            if ($bmp.GetPixel($gx, $y).A -ne 0) { throw ('G4 gap column ' + $gx + ' is not transparent') }
        }
    }
}

$bmp1 = New-Strip
Test-Strip $bmp1
$bmp1.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp1.Dispose()
$h1 = (Get-FileHash -Algorithm SHA256 $path).Hash

$bmp2 = New-Strip
Test-Strip $bmp2
$bmp2.Dispose()
$bak = ($path + '.new')
$bmp3 = New-Strip
$bmp3.Save($bak, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp3.Dispose()
$h2 = (Get-FileHash -Algorithm SHA256 $bak).Hash
Remove-Item $bak -Force
if ($h1 -ne $h2) { throw 'G5 double-run SHA mismatch (non-deterministic bake)' }

Write-Output ('BAKE OK lab-digits.png 80x10 sha12=' + $h1.Substring(0, 12))
