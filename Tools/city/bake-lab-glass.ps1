# FluxVerse r140: bake CPH4 Labs glass facility sprites (P-39(1) static
# pre-bake, r139 four-stage plan stage 2). Self-baked, zero external art.
# Eight deterministic GDI+ sprites under ArtPacks/lab-glass/:
#   lab-pod-tall   48x72 = 2x3u    incubation pod, tall (pod cap 3u, r139)
#   lab-pod-mid    48x48 = 2x2u    incubation pod, low
#   lab-pod-wide   96x48 = 4x2u    incubation pod pair + center strut
#   lab-birth      96x72 = 4x3u    resident birth station (chamber+panels)
#   lab-sandbox    96x48 = 4x2u    city future sandbox table (mini city)
#   lab-pipe-h     48x16 = 2x0.67u data pipe segment, horizontal
#   lab-pipe-v     16x48 = 0.67x2u data pipe segment, vertical
#   lab-pipe-node  16x16           pipe junction box
# r168 2u-wide variants (D-20260926-02 remedy candidate 3, P-39 segment 1;
# east window net width 3.33u rejects all 4u pieces - r141 quota gap):
#   lab-birth-2u   48x72 = 2x3u    compact birth station: glass chamber left
#                                  + 10-slot card wall (3 lit) right
#   lab-sandbox-2u 48x48 = 2x2u    compact sandbox table: 4-block mini city
#                                  + antenna + hologram band
# Visual law (DESIGN 16.3 + r139): silicon-ultimate blue (CPH4 64,196,255
# core spectrum), glass morph = translucent gradient + glow rim + outer
# halo + highlight streak + dark cool plinth; clean-lab cold light only
# (red stays FAIL-lamp semantics, never baked into statics).
# Gates (fail-loud, r97 band-self-check precedent):
#   G1 transparent canvas corners on every sprite
#   G2 blue-lit pixel count per sprite (rim/windows/slots)
#   G3 glass-band alpha 85..150 count on the four glass sprites
#   G4 double-run SHA256 idempotent + all sprites pairwise distinct
# Deterministic: no random, no clock. ASCII-only (PS5.1 GBK law).
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
$dir = Join-Path $PSScriptRoot '..\..\City\Assets\ArtPacks\lab-glass'
New-Item -ItemType Directory -Force -Path $dir | Out-Null

function New-LabBmp($w, $h) { return (New-Object System.Drawing.Bitmap($w, $h)) }

function Set-Px($bmp, $x, $y, $a, $r, $g, $b) {
    if ($x -ge 0 -and $x -lt $bmp.Width -and $y -ge 0 -and $y -lt $bmp.Height) {
        $bmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($a, $r, $g, $b))
    }
}

function Fill-Rect($bmp, $x0, $y0, $x1, $y1, $a, $r, $g, $b) {
    for ($y = $y0; $y -le $y1; $y++) {
        for ($x = $x0; $x -le $x1; $x++) { Set-Px $bmp $x $y $a $r $g $b }
    }
}

function Cut-TopCorners($bmp, $x0, $x1, $y0, $n) {
    for ($i = 0; $i -lt $n; $i++) {
        for ($j = 0; $j -lt ($n - $i); $j++) {
            Set-Px $bmp ($x0 + $i) ($y0 + $j) 0 0 0 0
            Set-Px $bmp ($x1 - $i) ($y0 + $j) 0 0 0 0
        }
    }
}

function Draw-GlassPod($bmp, $x0, $y0, $x1, $y1, $cut) {
    # outer halo ring (1px outside the rect)
    for ($x = ($x0 - 1); $x -le ($x1 + 1); $x++) {
        Set-Px $bmp $x ($y0 - 1) 70 64 196 255
        Set-Px $bmp $x ($y1 + 1) 70 64 196 255
    }
    for ($y = ($y0 - 1); $y -le ($y1 + 1); $y++) {
        Set-Px $bmp ($x0 - 1) $y 70 64 196 255
        Set-Px $bmp ($x1 + 1) $y 70 64 196 255
    }
    # glow rim: 2px border
    for ($x = $x0; $x -le $x1; $x++) {
        Set-Px $bmp $x $y0 235 150 228 255
        Set-Px $bmp $x ($y0 + 1) 235 150 228 255
        Set-Px $bmp $x $y1 235 150 228 255
        Set-Px $bmp $x ($y1 - 1) 235 150 228 255
    }
    for ($y = $y0; $y -le $y1; $y++) {
        Set-Px $bmp $x0 $y 235 150 228 255
        Set-Px $bmp ($x0 + 1) $y 235 150 228 255
        Set-Px $bmp $x1 $y 235 150 228 255
        Set-Px $bmp ($x1 - 1) $y 235 150 228 255
    }
    # interior translucent gradient: top (90,215,255) a95 -> bottom (40,110,175) a140
    $h = $y1 - $y0 - 3
    if ($h -lt 1) { $h = 1 }
    for ($y = ($y0 + 2); $y -le ($y1 - 2); $y++) {
        $t = [int](100 * ($y - $y0 - 2) / $h)
        $r = [int](90 - 50 * $t / 100)
        $g = [int](215 - 105 * $t / 100)
        $b = [int](255 - 80 * $t / 100)
        $a = [int](95 + 45 * $t / 100)
        for ($x = ($x0 + 2); $x -le ($x1 - 2); $x++) { Set-Px $bmp $x $y $a $r $g $b }
    }
    # instrument bands (lab window-grid feel), every 10 rows, 3px tall
    for ($by = ($y0 + 8); $by -le ($y1 - 6); $by += 10) {
        Fill-Rect $bmp ($x0 + 4) $by ($x1 - 4) ($by + 2) 170 30 60 90
    }
    # highlight streaks (glass sheen)
    for ($y = ($y0 + 4); $y -le ($y1 - 4); $y++) {
        Set-Px $bmp ($x0 + 6) $y 120 235 248 255
        Set-Px $bmp ($x0 + 7) $y 120 235 248 255
        Set-Px $bmp ($x1 - 8) $y 70 235 248 255
    }
    # inner glow core column (culture fluid / incubation light)
    $cx0 = [int](($x0 + $x1) / 2) - 2
    Fill-Rect $bmp $cx0 ($y0 + 5) ($cx0 + 3) ($y1 - 5) 125 150 240 255
    # bright data cells (deterministic offsets, clipped to interior)
    $cells = @(8, 8, 18, 20, 6, 34, 24, 40)
    for ($i = 0; $i -lt $cells.Count; $i += 2) {
        $ax = $x0 + 3 + $cells[$i]
        $ay = $y0 + 3 + $cells[$i + 1]
        if ($ax -ge ($x0 + 3) -and $ax -le ($x1 - 4) -and $ay -ge ($y0 + 3) -and $ay -le ($y1 - 4)) {
            Fill-Rect $bmp $ax $ay ($ax + 1) ($ay + 1) 230 210 250 255
        }
    }
    if ($cut -gt 0) { Cut-TopCorners $bmp $x0 $x1 $y0 $cut }
}

function Draw-Plinth($bmp, $x0, $y0, $x1, $y1) {
    Fill-Rect $bmp $x0 $y0 $x1 $y1 255 58 74 92
    for ($x = $x0; $x -le $x1; $x++) {
        Set-Px $bmp $x $y0 255 90 110 130
        Set-Px $bmp $x $y1 255 40 52 66
    }
    for ($x = ($x0 + 6); $x -le ($x1 - 9); $x += 12) {
        Fill-Rect $bmp $x ($y0 + 3) ($x + 3) ($y0 + 4) 255 40 52 66
    }
}

function Build-PodTall($bmp) {
    Draw-GlassPod $bmp 7 6 40 63 4
    Draw-Plinth $bmp 4 64 43 71
}

function Build-PodMid($bmp) {
    Draw-GlassPod $bmp 7 6 40 39 4
    Draw-Plinth $bmp 4 40 43 47
}

function Build-PodWide($bmp) {
    # center strut with flow dots, then two glass cells
    Fill-Rect $bmp 44 10 51 39 255 46 58 74
    $dots = @(16, 24, 32)
    for ($i = 0; $i -lt $dots.Count; $i++) {
        Set-Px $bmp 47 $dots[$i] 230 120 220 255
        Set-Px $bmp 48 $dots[$i] 230 120 220 255
    }
    Draw-GlassPod $bmp 7 6 43 39 4
    Draw-GlassPod $bmp 52 6 88 39 4
    Draw-Plinth $bmp 4 40 91 47
}

function Build-Birth($bmp) {
    Draw-GlassPod $bmp 32 8 63 63 4
    # left instrument panel
    Fill-Rect $bmp 4 24 27 63 255 46 58 74
    for ($x = 4; $x -le 27; $x++) {
        Set-Px $bmp $x 24 255 100 120 140
        Set-Px $bmp $x 63 255 30 40 54
    }
    $wx = @(8, 18)
    $wy = @(30, 38, 46, 54)
    for ($i = 0; $i -lt $wx.Count; $i++) {
        for ($j = 0; $j -lt $wy.Count; $j++) {
            Fill-Rect $bmp $wx[$i] $wy[$j] ($wx[$i] + 4) ($wy[$j] + 3) 225 120 220 255
        }
    }
    # right card wall (birth wall: resident-card slots, 3 lit = latest cards)
    Fill-Rect $bmp 68 16 91 63 255 42 54 70
    for ($x = 68; $x -le 91; $x++) {
        Set-Px $bmp $x 16 255 90 110 130
        Set-Px $bmp $x 63 255 30 40 54
    }
    for ($c = 0; $c -lt 3; $c++) {
        for ($rw = 0; $rw -lt 5; $rw++) {
            $sx = 70 + $c * 8
            $sy = 20 + $rw * 9
            Fill-Rect $bmp $sx $sy ($sx + 5) ($sy + 4) 200 30 42 58
            $litup = (($c -eq 0 -and $rw -eq 0) -or ($c -eq 1 -and $rw -eq 2) -or ($c -eq 2 -and $rw -eq 3))
            if ($litup) {
                Fill-Rect $bmp ($sx + 1) ($sy + 1) ($sx + 4) ($sy + 3) 235 200 240 255
            } else {
                for ($x = $sx; $x -le ($sx + 5); $x++) { Set-Px $bmp $x ($sy + 1) 140 90 110 130 }
            }
        }
    }
    Draw-Plinth $bmp 4 64 91 71
}

function Build-Birth2U($bmp) {
    # compact 2u birth station (r168): chamber left, card wall right
    Draw-GlassPod $bmp 5 8 29 59 3
    # right card wall (birth wall, compact 2x5 slots, 3 lit)
    Fill-Rect $bmp 33 14 44 59 255 42 54 70
    for ($x = 33; $x -le 44; $x++) {
        Set-Px $bmp $x 14 255 90 110 130
        Set-Px $bmp $x 59 255 30 40 54
    }
    for ($c = 0; $c -lt 2; $c++) {
        for ($rw = 0; $rw -lt 5; $rw++) {
            $sx = 34 + $c * 6
            $sy = 18 + $rw * 8
            Fill-Rect $bmp $sx $sy ($sx + 4) ($sy + 3) 200 30 42 58
            $litup = (($c -eq 0 -and $rw -eq 0) -or ($c -eq 1 -and $rw -eq 2) -or ($c -eq 0 -and $rw -eq 3))
            if ($litup) {
                Fill-Rect $bmp ($sx + 1) ($sy + 1) ($sx + 3) ($sy + 2) 235 200 240 255
            } else {
                for ($x = $sx; $x -le ($sx + 4); $x++) { Set-Px $bmp $x ($sy + 1) 140 90 110 130 }
            }
        }
    }
    Draw-Plinth $bmp 4 60 43 71
}

function Build-Sandbox($bmp) {
    # hologram glow band above the mini city (projection light)
    for ($y = 8; $y -le 16; $y++) {
        $a = [int](25 + 50 * ($y - 8) / 8)
        for ($x = 14; $x -le 81; $x++) { Set-Px $bmp $x $y $a 100 210 255 }
    }
    # mini city (flat stride-4 list: x0,y0,x1,y1)
    $bld = @(18, 22, 25, 35, 28, 26, 34, 35, 38, 18, 47, 35, 52, 24, 58, 35, 62, 20, 70, 35, 74, 28, 80, 35)
    for ($i = 0; $i -lt $bld.Count; $i += 4) {
        $bx0 = $bld[$i]; $by0 = $bld[$i + 1]; $bx1 = $bld[$i + 2]; $by1 = $bld[$i + 3]
        Fill-Rect $bmp $bx0 $by0 $bx1 $by1 255 38 52 70
        for ($x = $bx0; $x -le $bx1; $x++) { Set-Px $bmp $x $by0 255 70 95 120 }
        for ($xx = ($bx0 + 2); $xx -le ($bx1 - 1); $xx += 3) {
            for ($yy = ($by0 + 2); $yy -le ($by1 - 1); $yy += 4) { Set-Px $bmp $xx $yy 220 140 220 255 }
        }
    }
    # antenna on the tallest mini tower
    Set-Px $bmp 42 16 255 255 255 255
    Set-Px $bmp 42 15 255 255 255 255
    # tabletop slab + legs
    Fill-Rect $bmp 8 36 87 43 255 52 66 84
    for ($x = 8; $x -le 87; $x++) {
        Set-Px $bmp $x 36 255 96 116 140
        Set-Px $bmp $x 43 255 30 40 54
    }
    Fill-Rect $bmp 12 44 17 47 255 40 52 66
    Fill-Rect $bmp 78 44 83 47 255 40 52 66
}

function Build-Sandbox2U($bmp) {
    # compact 2u sandbox table (r168): hologram band + 4-block mini city
    for ($y = 6; $y -le 13; $y++) {
        $a = [int](25 + 50 * ($y - 6) / 7)
        for ($x = 8; $x -le 39; $x++) { Set-Px $bmp $x $y $a 100 210 255 }
    }
    # mini city (flat stride-4 list: x0,y0,x1,y1), bottoms sit on tabletop
    $bld = @(10, 18, 16, 29, 19, 15, 25, 29, 28, 19, 35, 29, 36, 22, 41, 29)
    for ($i = 0; $i -lt $bld.Count; $i += 4) {
        $bx0 = $bld[$i]; $by0 = $bld[$i + 1]; $bx1 = $bld[$i + 2]; $by1 = $bld[$i + 3]
        Fill-Rect $bmp $bx0 $by0 $bx1 $by1 255 38 52 70
        for ($x = $bx0; $x -le $bx1; $x++) { Set-Px $bmp $x $by0 255 70 95 120 }
        for ($xx = ($bx0 + 2); $xx -le ($bx1 - 1); $xx += 3) {
            for ($yy = ($by0 + 2); $yy -le ($by1 - 1); $yy += 4) { Set-Px $bmp $xx $yy 220 140 220 255 }
        }
    }
    # antenna on the tallest mini tower
    Set-Px $bmp 22 8 255 255 255 255
    Set-Px $bmp 22 9 255 255 255 255
    # tabletop slab + legs
    Fill-Rect $bmp 6 30 41 37 255 52 66 84
    for ($x = 6; $x -le 41; $x++) {
        Set-Px $bmp $x 30 255 96 116 140
        Set-Px $bmp $x 37 255 30 40 54
    }
    Fill-Rect $bmp 10 38 15 43 255 40 52 66
    Fill-Rect $bmp 32 38 37 43 255 40 52 66
}

function Build-PipeH($bmp) {
    Fill-Rect $bmp 0 4 47 11 255 44 58 76
    for ($x = 0; $x -le 47; $x++) {
        Set-Px $bmp $x 4 255 120 140 160
        Set-Px $bmp $x 11 255 28 38 50
    }
    $slots = @(5, 19, 33)
    for ($i = 0; $i -lt $slots.Count; $i++) {
        $sx = $slots[$i]
        Fill-Rect $bmp $sx 6 ($sx + 3) 9 235 120 220 255
    }
    Fill-Rect $bmp 0 3 2 12 255 58 74 92
    Fill-Rect $bmp 45 3 47 12 255 58 74 92
}

function Build-PipeV($bmp) {
    Fill-Rect $bmp 4 0 11 47 255 44 58 76
    for ($y = 0; $y -le 47; $y++) {
        Set-Px $bmp 4 $y 255 120 140 160
        Set-Px $bmp 11 $y 255 28 38 50
    }
    $slots = @(5, 19, 33)
    for ($i = 0; $i -lt $slots.Count; $i++) {
        $sy = $slots[$i]
        Fill-Rect $bmp 6 $sy 9 ($sy + 3) 235 120 220 255
    }
    Fill-Rect $bmp 3 0 12 2 255 58 74 92
    Fill-Rect $bmp 3 45 12 47 255 58 74 92
}

function Build-PipeNode($bmp) {
    Fill-Rect $bmp 2 2 13 13 255 58 74 92
    for ($x = 2; $x -le 13; $x++) {
        Set-Px $bmp $x 2 255 110 130 150
        Set-Px $bmp $x 13 255 36 46 60
    }
    Fill-Rect $bmp 6 6 9 9 240 140 225 255
    Set-Px $bmp 3 3 255 36 46 60
    Set-Px $bmp 12 3 255 36 46 60
    Set-Px $bmp 3 12 255 36 46 60
    Set-Px $bmp 12 12 255 36 46 60
}

function Build-One($name, $w, $h) {
    $bmp = New-LabBmp $w $h
    switch ($name) {
        'lab-pod-tall.png'    { Build-PodTall $bmp }
        'lab-pod-mid.png'     { Build-PodMid $bmp }
        'lab-pod-wide.png'    { Build-PodWide $bmp }
        'lab-birth.png'       { Build-Birth $bmp }
        'lab-sandbox.png'     { Build-Sandbox $bmp }
        'lab-birth-2u.png'    { Build-Birth2U $bmp }
        'lab-sandbox-2u.png'  { Build-Sandbox2U $bmp }
        'lab-pipe-h.png'      { Build-PipeH $bmp }
        'lab-pipe-v.png'      { Build-PipeV $bmp }
        'lab-pipe-node.png'   { Build-PipeNode $bmp }
    }
    return $bmp
}

# gate thresholds (fail-loud; see header for gate law)
$litMin = @{
    'lab-pod-tall.png' = 200; 'lab-pod-mid.png' = 150; 'lab-pod-wide.png' = 300;
    'lab-birth.png' = 350; 'lab-sandbox.png' = 25; 'lab-pipe-h.png' = 30;
    'lab-pipe-v.png' = 30; 'lab-pipe-node.png' = 12;
    'lab-birth-2u.png' = 250; 'lab-sandbox-2u.png' = 12
}
$glassMin = @{
    'lab-pod-tall.png' = 400; 'lab-pod-mid.png' = 250;
    'lab-pod-wide.png' = 400; 'lab-birth.png' = 400; 'lab-birth-2u.png' = 500
}

function Test-Sprite($bmp, $name) {
    $w = $bmp.Width; $h = $bmp.Height
    if ($bmp.GetPixel(0, 0).A -ne 0) { throw ('G1 corner not transparent: ' + $name) }
    if ($bmp.GetPixel($w - 1, 0).A -ne 0) { throw ('G1 corner not transparent: ' + $name) }
    if ($bmp.GetPixel(0, $h - 1).A -ne 0) { throw ('G1 corner not transparent: ' + $name) }
    if ($bmp.GetPixel($w - 1, $h - 1).A -ne 0) { throw ('G1 corner not transparent: ' + $name) }
    $lit = 0; $glass = 0
    for ($y = 0; $y -lt $h; $y++) {
        for ($x = 0; $x -lt $w; $x++) {
            $p = $bmp.GetPixel($x, $y)
            if ($p.A -ge 200 -and $p.B -ge 200 -and ($p.B - $p.G) -ge 20) { $lit++ }
            if ($p.A -ge 85 -and $p.A -le 150) { $glass++ }
        }
    }
    if ($lit -lt $litMin[$name]) { throw ('G2 blue-lit count low: ' + $name + ' lit=' + $lit) }
    if ($glassMin.ContainsKey($name) -and $glass -lt $glassMin[$name]) {
        throw ('G3 glass band count low: ' + $name + ' glass=' + $glass)
    }
    Write-Output ('  ' + $name + ' ' + $w + 'x' + $h + ' lit=' + $lit + ' glass=' + $glass)
}

# flat stride-3 spec list (no nested arrays - PS5.1 flatten law)
$specs = @(
    'lab-pod-tall.png', 48, 72,
    'lab-pod-mid.png', 48, 48,
    'lab-pod-wide.png', 96, 48,
    'lab-birth.png', 96, 72,
    'lab-sandbox.png', 96, 48,
    'lab-pipe-h.png', 48, 16,
    'lab-pipe-v.png', 16, 48,
    'lab-pipe-node.png', 16, 16,
    'lab-birth-2u.png', 48, 72,
    'lab-sandbox-2u.png', 48, 48
)

Write-Output 'pass 1: bake + gates'
$hashes = @{}
for ($i = 0; $i -lt $specs.Count; $i += 3) {
    $name = [string]$specs[$i]
    $w = [int]$specs[$i + 1]
    $h = [int]$specs[$i + 2]
    $bmp = Build-One $name $w $h
    Test-Sprite $bmp $name
    $path = Join-Path $dir $name
    $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    $hashes[$name] = (Get-FileHash -Algorithm SHA256 $path).Hash
}

Write-Output 'pass 2: idempotency re-bake'
for ($i = 0; $i -lt $specs.Count; $i += 3) {
    $name = [string]$specs[$i]
    $w = [int]$specs[$i + 1]
    $h = [int]$specs[$i + 2]
    $bmp = Build-One $name $w $h
    $path = Join-Path $dir $name
    $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    $h2 = (Get-FileHash -Algorithm SHA256 $path).Hash
    if ($hashes[$name] -ne $h2) { throw ('G4 not deterministic: ' + $name) }
}

$vals = @($hashes.Values)
for ($i = 0; $i -lt $vals.Count; $i++) {
    for ($j = ($i + 1); $j -lt $vals.Count; $j++) {
        if ($vals[$i] -eq $vals[$j]) { throw 'G4 duplicate sprite hashes' }
    }
}

$sum = 'BAKE OK ' + ($specs.Count / 3) + ' sprites'
for ($i = 0; $i -lt $specs.Count; $i += 3) {
    $name = [string]$specs[$i]
    $sum = $sum + ' ' + $name + '=' + $hashes[$name].Substring(0, 12)
}
Write-Output $sum
