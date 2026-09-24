# FluxVerse DevLoop r44/r45: AA-016.02 vehicle singles cropper (P-28(3) pool-coverage
# face; P-21 consumption chain - S-library direct-use, license gate pre-cleared
# 2026-09-22, harmony gate = docs/research + TECH sec.9 P-21 row r44 line).
# r45 adds the two vertical-avenue facings (Car_Up_2 / Car_Down_4 - colors kept
# distinct from the r44 set {1,3,5}; the Up/Down singles are rear/front views,
# 32x57 tight, parked on the two 2-wide vertical avenues cols 17/18 and -18/-17).
# Source: MiniGame S-library pack AA-016.02 (modern exteriors, 16x16 singles tier -
# native ~48px-class density), resolved by GLOB because the pack path holds CJK
# segments and this script body is ASCII-only per the PS5.1 GBK law (r44 first-run
# mangle). Crops each chosen single to its TIGHT opaque bounds (the singles ship
# with asymmetric transparent padding; tight crop = symmetric pivot so the
# feet-on-ground-line law in VehicleRules is exact, r37 zero-floating law).
# Expected-size manifest fails loud: a variant silhouette drift breaks the bake,
# not the scene. Deterministic derivative of a licensed pack asset; consumption
# provenance rows live in TECH sec.9 (P-21(3) ledger line, r44).
# r93 adds the animated-strip tier (P-69 slice-1 vehicle systematization face,
# TECH sec.9 P-69 row r93): the singles-tier sedan frames (61x37, 1.65:1 =
# the R-20260924-m1-visual-fix "short and tall" defect) are retired from the
# scene in favor of the 3/4-view strip sedans (tight 78x36 incl. the pack's
# baked opaque ground-shadow band, 2.17:1, wheels verified) plus the animated
# bus row sprite (115x62, pure side elevation, tires+hubcaps verified). The
# r91 survey estimate "65x20 / 125x65" does not survive component-level
# measurement (78x36 / 115x62 actual) - manifest pins the measured rects and
# fails loud on drift. Mirrored west-facing sedan = pixel-exact horizontal
# flip (NearestNeighbor, negative dest width), a standard pack-asset transform.
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
    "vehicle-car-up.png"     = @{ single = "Car_Up_2";          expect = "32x57" }
    "vehicle-car-down.png"   = @{ single = "Car_Down_4";        expect = "32x57" }
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

# ---- r93: animated-strip tier (P-69 slice-1 vehicle face) ----
# name -> @{ sheet = strip file stem; dir = subfolder; rect = "x,y,w,h"; mirror = bool }
# rects = measured component bounds (logs/devloop-r93-vehicleframescan.ps1);
# any pack revision that drifts the sprite layout breaks the bake, not the scene.
$stripManifest = [ordered]@{
    "vehicle-car2-w.png"  = @{ sheet = "Car_2_complete_1"; dir = "Cars_16x16";  rect = "17,124,78,36";  mirror = $true }
    "vehicle-car2-qe.png" = @{ sheet = "Car_2_complete_3"; dir = "Cars_16x16";  rect = "17,124,78,36";  mirror = $false }
    "vehicle-car2-e.png"  = @{ sheet = "Car_2_complete_5"; dir = "Cars_16x16";  rect = "17,124,78,36";  mirror = $false }
    "vehicle-bus2-r.png"  = @{ sheet = "Buses_1";          dir = "Buses_16x16"; rect = "157,114,115,62"; mirror = $false }
}
$animDir = Join-Path $a02.FullName "Modern_Exteriors_16x16\Animated_16x16\Vehicles_16x16"
if (-not (Test-Path $animDir)) { throw "animated vehicles dir not found: $animDir" }

foreach ($kv in $stripManifest.GetEnumerator()) {
    $outName = $kv.Key
    $sheet = $kv.Value.sheet
    $sub = $kv.Value.dir
    $rxry = $kv.Value.rect.Split(',')
    $rx = [int]$rxry[0]; $ry = [int]$rxry[1]; $rw = [int]$rxry[2]; $rh = [int]$rxry[3]
    $mirror = [bool]$kv.Value.mirror
    $srcPath = Join-Path (Join-Path $animDir $sub) ($sheet + ".png")
    if (-not (Test-Path $srcPath)) { throw "strip sheet missing: $sheet" }
    $bmp = [System.Drawing.Bitmap]::FromFile($srcPath)
    $frame = New-Object System.Drawing.Bitmap ($rw, $rh)
    $g = [System.Drawing.Graphics]::FromImage($frame)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::NearestNeighbor
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::Half
    $srcRect = New-Object System.Drawing.Rectangle ($rx, $ry, $rw, $rh)
    if ($mirror) {
        # pixel-exact horizontal flip: negative dest width (right edge -> 0)
        $dstRect = New-Object System.Drawing.Rectangle ($rw, 0, -$rw, $rh)
    } else {
        $dstRect = New-Object System.Drawing.Rectangle (0, 0, $rw, $rh)
    }
    $g.DrawImage($bmp, $dstRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
    $g.Dispose()
    # tight-bounds verify: the crop must be exactly opaque-edge to opaque-edge
    $minx = 9999; $miny = 9999; $maxx = -1; $maxy = -1
    for ($y = 0; $y -lt $frame.Height; $y++) {
        for ($x = 0; $x -lt $frame.Width; $x++) {
            if ($frame.GetPixel($x, $y).A -gt 16) {
                if ($x -lt $minx) { $minx = $x }
                if ($x -gt $maxx) { $maxx = $x }
                if ($y -lt $miny) { $miny = $y }
                if ($y -gt $maxy) { $maxy = $y }
            }
        }
    }
    if ($minx -ne 0 -or $miny -ne 0 -or $maxx -ne ($rw - 1) -or $maxy -ne ($rh - 1)) {
        throw ("strip rect not tight for " + $sheet + ": opaque " + $minx + "," + $miny + " " + ($maxx - $minx + 1) + "x" + ($maxy - $miny + 1) + " vs rect " + $rw + "x" + $rh + " - pack layout drifted, fix the manifest")
    }
    $outPath = Join-Path $framesDir $outName
    $frame.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $frame.Dispose()
    $bmp.Dispose()
    Write-Output ("$outName <- $sheet rect=$rx,$ry ${rw}x${rh} mirror=$mirror tight=ok")
}
Write-Output ("cropped " + $stripManifest.Count + " strip-tier frames -> $framesDir")
