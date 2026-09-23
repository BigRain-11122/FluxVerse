# FluxVerse DevLoop r44: AA-016.02 vehicle singles cropper (P-28(3) pool-coverage
# face; P-21 consumption chain - S-library direct-use, license gate pre-cleared
# 2026-09-22, harmony gate = docs/research + TECH sec.9 P-21 row r44 line).
# Source: MiniGame S-library pack AA-016.02 (modern exteriors, 16x16 singles tier -
# native ~48px-class density), resolved by GLOB because the pack path holds CJK
# segments and this script body is ASCII-only per the PS5.1 GBK law (r44 first-run
# mangle). Crops each chosen single to its TIGHT opaque bounds (the singles ship
# with asymmetric transparent padding; tight crop = symmetric pivot so the
# feet-on-ground-line law in VehicleRules is exact, r37 zero-floating law).
# Expected-size manifest fails loud: a variant silhouette drift breaks the bake,
# not the scene. Deterministic derivative of a licensed pack asset; consumption
# provenance rows live in TECH sec.9 (P-21(3) ledger line, r44).
# ASCII-only per PS5.1 encoding law (no CJK anywhere in this body).
$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.Drawing
$repo = "C:\Users\sjs20\Desktop\FluxGroup\gaming\FluxVerse"
$artRoot = "C:\Users\sjs20\Desktop\FluxGroup\gaming\MiniGame\Art Assets"
$framesDir = Join-Path $repo "City\Assets\Art\Vehicles\frames"

# name -> @{ single = source file stem; expect = "WxH" tight bounds }
$manifest = [ordered]@{
    "vehicle-car-l.png"     = @{ single = "Car_Left_5";          expect = "61x37" }
    "vehicle-car-r2.png"   = @{ single = "Car_Right_3";         expect = "61x37" }
    "vehicle-car-r.png"    = @{ single = "Car_Right_1";         expect = "61x37" }
    "vehicle-camper-r.png" = @{ single = "Camper_Right_1";      expect = "94x56" }
    "vehicle-bus-r.png"    = @{ single = "Bus_Right_1";          expect = "111x62" }
    "vehicle-cart-food.png"= @{ single = "Street_Food_Cart_1";  expect = "44x48" }
    "vehicle-cart-fruit.png" = @{ single = "Fruit_Flowers_Cart_1"; expect = "48x55" }
    "vehicle-stop-sign.png"  = @{ single = "Bus_Stop_Sign_1";    expect = "15x37" }
}

# resolve the CJK path segments by glob, never by literal
$a16 = Get-ChildItem $artRoot -Directory -Filter "AA-016*" | Select-Object -First 1
if (-not $a16) { throw "AA-016 pack not found under $artRoot" }
$a02 = Get-ChildItem $a16.FullName -Directory -Filter "AA-016.02*" | Select-Object -First 1
if (-not $a02) { throw "AA-016.02 subpack not found" }
$srcDir = Join-Path $a02.FullName "Modern_Exteriors_16x16\ME_Theme_Sorter_16x16\10_Vehicles_Singles_16x16"
if (-not (Test-Path $srcDir)) { throw "vehicle singles dir not found: $srcDir" }
New-Item -ItemType Directory -Force -Path $framesDir | Out-Null

foreach ($kv in $manifest.GetEnumerator()) {
    $outName = $kv.Key
    $single = $kv.Value.single
    $expect = $kv.Value.expect
    $srcPath = Join-Path $srcDir ("ME_Singles_Vehicles_16x16_$single.png")
    if (-not (Test-Path $srcPath)) { throw "source single missing: $single" }
    $bmp = [System.Drawing.Bitmap]::FromFile($srcPath)
    $minx = 9999; $miny = 9999; $maxx = -1; $maxy = -1
    for ($y = 0; $y -lt $bmp.Height; $y++) {
        for ($x = 0; $x -lt $bmp.Width; $x++) {
            if ($bmp.GetPixel($x, $y).A -gt 16) {
                if ($x -lt $minx) { $minx = $x }
                if ($x -gt $maxx) { $maxx = $x }
                if ($y -lt $miny) { $miny = $y }
                if ($y -gt $maxy) { $maxy = $y }
            }
        }
    }
    if ($maxx -lt 0) { throw "single is fully transparent: $single" }
    $w = $maxx - $minx + 1; $h = $maxy - $miny + 1
    $got = "${w}x${h}"
    if ($got -ne $expect) { throw ("tight bounds drift for $single" + ": got $got, expected $expect (variant silhouette drift - fix the manifest, never the gate)") }
    $frame = New-Object System.Drawing.Bitmap ($w, $h)
    $g = [System.Drawing.Graphics]::FromImage($frame)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::NearestNeighbor
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::Half
    $g.DrawImage($bmp, (New-Object System.Drawing.Rectangle (0, 0, $w, $h)),
        (New-Object System.Drawing.Rectangle ($minx, $miny, $w, $h)),
        [System.Drawing.GraphicsUnit]::Pixel)
    $g.Dispose()
    $outPath = Join-Path $framesDir $outName
    $frame.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $frame.Dispose()
    $bmp.Dispose()
    Write-Output ("$outName <- $single tight=$got")
}
Write-Output ("cropped " + $manifest.Count + " vehicle frames -> $framesDir")
