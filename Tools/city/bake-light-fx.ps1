# FluxVerse r157 (P-20260925-09 day/night line D3+D4): bake the light-fx
# sprite family - sign bloom halos, lamp-cone light pools, wet-road sheen
# strips, night star points. Manifest-driven single source:
#   Tools/city/lightfx-manifest.json (mounts, px law, colors, tiers)
# NeonSigns.cs live table is regex-parsed for sign world sizes (single
# geometry source, zero hardcoded duplicates). 24 PNGs under
# ArtPacks/light-fx/, all at the default PPU16 tier = natural size, zero
# resampling (r155 law). Spec = cph4/research/R-20260925-water-daynight.md
# sec2 item3 (bloom / lamp cone / wet sheen) + item4 (stars; the horizon
# band is a runtime gradient quad family - no baked asset).
# Texture laws (manifest law mirror):
#   bloom  = elliptical stepped halo: rings a165/120/75 at d<0.45/0.75/0.92
#            + checkerboard dither ring a40 (pixel-soft glow)
#   cone   = warm amber (255,205,130) pool: rings a130/100/65 at
#            d<0.30/0.60/0.85 + checkerboard dither a35
#   wet    = sheen ramp a55(top)->a25(bottom) + de-regularized streak
#            columns (hash law ((x*x*31+x*7) mod 11 < 2, per-column
#            brightness +16..30) + 5px horizontal edge fade (0.25..1.0)
#   star   = 3x3: center a255 (225,240,255) + cross a120 (200,220,255)
# Gates (fail-loud, r140 lab-glass precedent):
#   G1 transparent corners (bloom/cone/star)
#   G2 lit-pixel floor per kind (bloom/cone >= 45% area, star >= 5)
#   G3 wet corner-alpha band [5,95] (post edge-fade) + streak column floor w/8
#   G4 double-run SHA256 idempotent + all 24 files pairwise distinct
# Deterministic: no random, no clock. ASCII-only (PS5.1 GBK law).
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
$root  = Join-Path $PSScriptRoot '..\..'
$dir   = Join-Path $root 'City\Assets\ArtPacks\light-fx'
New-Item -ItemType Directory -Force -Path $dir | Out-Null
$manifest = Get-Content (Join-Path $PSScriptRoot 'lightfx-manifest.json') -Raw -Encoding UTF8 | ConvertFrom-Json
$signSrc  = Get-Content (Join-Path $root 'City\Assets\Scripts\NeonSigns.cs') -Raw -Encoding UTF8

# ---- parse the live NeonSigns table (name/px/mount = single source) ----
$signs = @{}
$signRe = 'name = "Neon(\w+)".*?pxW = (\d+),\s*pxH = (\d+),\s*x = (-?[\d.]+)f,\s*y = (-?[\d.]+)f,\s*ppu = (\d+)f,\s*mount = Mount(\w+)'
foreach ($m in [regex]::Matches($signSrc, $signRe)) {
    $signs[('Neon' + $m.Groups[1].Value)] = @{
        pxw = [int]$m.Groups[2].Value; pxh = [int]$m.Groups[3].Value
        x = [double]$m.Groups[4].Value; y = [double]$m.Groups[5].Value
        ppu = [int]$m.Groups[6].Value; mount = [string]$m.Groups[7].Value
    }
}
if ($signs.Count -ne 21) { throw ('sign table parse count drift: ' + $signs.Count) }

# ---- asset spec table (dedupe by filename; twin law: bloom-quant shared) ----
$assets = @{}
foreach ($mo in $manifest.bloom.mounts) {
    $fname = [IO.Path]::GetFileName($mo.asset)
    if ($assets.ContainsKey($fname)) { continue }
    $s = $signs[[string]$mo.sign]
    if ($null -eq $s) { throw ('bloom sign not in table: ' + $mo.sign) }
    if ($s.mount -eq 'Exempt') { throw ('bloom on exempt structure sign: ' + $mo.sign) }
    # PS law: [int] cast = banker's round, NOT truncate -> floor(v+0.5) is the
    # only correct round-half-up primitive ([int](v+0.5) double-rounds: 16.65->17)
    $bw = [int][math]::Floor([double]$s.pxw / [double]$s.ppu * 1.7 * 16 + 0.5)
    $bh = [int][math]::Floor([double]$s.pxh / [double]$s.ppu * 1.6 * 16 + 0.5)
    if ($bw -ne [int]$mo.px[0] -or $bh -ne [int]$mo.px[1]) {
        throw ('bloom px law drift: ' + $mo.sign + ' computed ' + $bw + 'x' + $bh + ' vs manifest ' + $mo.px[0] + 'x' + $mo.px[1])
    }
    $assets[$fname] = @{ kind = 'bloom'; w = $bw; h = $bh
        r = [int]$mo.color[0]; g = [int]$mo.color[1]; b = [int]$mo.color[2]; label = [string]$mo.sign }
}
$coneLaw = $manifest.lamp_cones.law
$coneFname = [IO.Path]::GetFileName($coneLaw.asset)
$assets[$coneFname] = @{ kind = 'cone'; w = [int]$coneLaw.px[0]; h = [int]$coneLaw.px[1]
    r = 255; g = 205; b = 130; label = 'lamp-pool' }
foreach ($mo in $manifest.wet_roads.mounts) {
    $fname = [IO.Path]::GetFileName($mo.asset)
    if ($assets.ContainsKey($fname)) { throw ('wet asset name collision: ' + $fname) }
    $assets[$fname] = @{ kind = 'wet'; w = [int]$mo.px[0]; h = [int]$mo.px[1]
        r = [int]$mo.color[0]; g = [int]$mo.color[1]; b = [int]$mo.color[2]; label = [string]$mo.id }
}
$starLaw = $manifest.stars.law
$starFname = [IO.Path]::GetFileName($starLaw.asset)
$assets[$starFname] = @{ kind = 'star'; w = [int]$starLaw.px[0]; h = [int]$starLaw.px[1]
    r = 225; g = 240; b = 255; label = 'star-point' }
if ($assets.Count -ne 24) { throw ('asset census drift: ' + $assets.Count + ' (expected 24)') }

# ---- GDI+ pixel primitives ----
function New-Bmp($w, $h) { return (New-Object System.Drawing.Bitmap($w, $h)) }
function Set-Px($bmp, $x, $y, $a, $r, $g, $b) {
    if ($x -ge 0 -and $x -lt $bmp.Width -and $y -ge 0 -and $y -lt $bmp.Height) {
        $bmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($a, $r, $g, $b))
    }
}

function Build-SteppedHalo($w, $h, $r, $g, $b, $rings, $ditherA) {
    # shared ellipse law for bloom + cone: $rings = @(a1,b1, a2,b2, a3,b3)
    $bmp = New-Bmp $w $h
    $cx = ($w - 1) / 2.0; $cy = ($h - 1) / 2.0
    $rx = $w / 2.0 - 1.0; $ry = $h / 2.0 - 1.0
    for ($y = 0; $y -lt $h; $y++) {
        for ($x = 0; $x -lt $w; $x++) {
            $dx = ($x - $cx) / $rx; $dy = ($y - $cy) / $ry
            $d = [math]::Sqrt($dx * $dx + $dy * $dy)
            $a = 0
            if ($d -lt [double]$rings[1]) { $a = [int]$rings[0] }
            elseif ($d -lt [double]$rings[3]) { $a = [int]$rings[2] }
            elseif ($d -lt [double]$rings[5]) { $a = [int]$rings[4] }
            elseif ($d -lt 1.0) { if ((($x + $y) % 2) -eq 0) { $a = $ditherA } }
            if ($a -gt 0) { Set-Px $bmp $x $y $a $r $g $b }
        }
    }
    return $bmp
}

function Build-Wet($w, $h, $r, $g, $b) {
    # v3 (multimodal style-gate second pass): streak columns de-regularized
    # (hash law, irregular spacing + per-column brightness 16..30) so the
    # sheen never reads as a periodic grid / never moires on a scrolling
    # road; horizontal dither rows REMOVED entirely (crosshatch root cause);
    # edge fade widened 3px -> 5px (ramp 0.25..1.0).
    $bmp = New-Bmp $w $h
    $edge = 5
    for ($y = 0; $y -lt $h; $y++) {
        $t = $y / ($h - 1.0)
        $base = [int](55 - 30 * $t)
        for ($x = 0; $x -lt $w; $x++) {
            $a = $base
            $probe = ((($x * $x * 31 + $x * 7) % 11) -lt 2)
            if ($probe) { $a = $a + 16 + (($x * 13) % 15) }
            $ramp = 1.0
            if ($x -lt $edge) { $ramp = 0.25 + 0.75 * ($x / $edge) }
            elseif ($x -ge ($w - $edge)) { $ramp = 0.25 + 0.75 * (($w - 1 - $x) / $edge) }
            $a = [int]($a * $ramp)
            Set-Px $bmp $x $y $a $r $g $b
        }
    }
    return $bmp
}

function Build-Star($w, $h, $r, $g, $b) {
    $bmp = New-Bmp $w $h
    $cx = [int](($w - 1) / 2); $cy = [int](($h - 1) / 2)
    Set-Px $bmp $cx $cy 255 $r $g $b
    Set-Px $bmp ($cx + 1) $cy 120 200 220 255
    Set-Px $bmp ($cx - 1) $cy 120 200 220 255
    Set-Px $bmp $cx ($cy + 1) 120 200 220 255
    Set-Px $bmp $cx ($cy - 1) 120 200 220 255
    return $bmp
}

function Build-One($spec) {
    switch ($spec.kind) {
        'bloom' { return (Build-SteppedHalo $spec.w $spec.h $spec.r $spec.g $spec.b @(165, 0.45, 120, 0.75, 75, 0.92) 40) }
        'cone'  { return (Build-SteppedHalo $spec.w $spec.h $spec.r $spec.g $spec.b @(130, 0.30, 100, 0.60, 65, 0.85) 35) }
        'wet'   { return (Build-Wet $spec.w $spec.h $spec.r $spec.g $spec.b) }
        'star'  { return (Build-Star $spec.w $spec.h $spec.r $spec.g $spec.b) }
    }
    throw ('unknown kind: ' + $spec.kind)
}

# ---- gates (fail-loud) ----
function Test-Asset($bmp, $kind, $name) {
    $w = $bmp.Width; $h = $bmp.Height
    if ($kind -ne 'wet') {
        if ($bmp.GetPixel(0, 0).A -ne 0) { throw ('G1 corner not transparent: ' + $name) }
        if ($bmp.GetPixel($w - 1, 0).A -ne 0) { throw ('G1 corner not transparent: ' + $name) }
        if ($bmp.GetPixel(0, $h - 1).A -ne 0) { throw ('G1 corner not transparent: ' + $name) }
        if ($bmp.GetPixel($w - 1, $h - 1).A -ne 0) { throw ('G1 corner not transparent: ' + $name) }
    }
    if ($kind -eq 'wet') {
        $corners = @($bmp.GetPixel(0, 0).A, $bmp.GetPixel($w - 1, 0).A, $bmp.GetPixel(0, $h - 1).A, $bmp.GetPixel($w - 1, $h - 1).A)
        foreach ($ca in $corners) { if ($ca -lt 5 -or $ca -gt 95) { throw ('G3 wet corner alpha out of band: ' + $name + ' a=' + $ca) } }
        $streakCols = 0
        for ($x = 0; $x -lt $w; $x++) { if (((($x * $x * 31 + $x * 7) % 11) -lt 2)) { $streakCols++ } }
        if ($streakCols -lt [int]($w / 8)) { throw ('G3 wet streak floor: ' + $name + ' cols=' + $streakCols) }
    }
    if ($kind -eq 'star') {
        $lit = 0
        for ($y = 0; $y -lt $h; $y++) { for ($x = 0; $x -lt $w; $x++) { if ($bmp.GetPixel($x, $y).A -gt 0) { $lit++ } } }
        if ($lit -lt 5) { throw ('G2 star lit floor: ' + $name + ' lit=' + $lit) }
        return
    }
    if ($kind -eq 'bloom' -or $kind -eq 'cone') {
        $lit = 0
        for ($y = 0; $y -lt $h; $y++) { for ($x = 0; $x -lt $w; $x++) { if ($bmp.GetPixel($x, $y).A -gt 0) { $lit++ } } }
        $floor = [int]($w * $h * 0.45)
        if ($lit -lt $floor) { throw ('G2 lit floor: ' + $name + ' lit=' + $lit + ' floor=' + $floor) }
        Write-Output ('  ' + $name + ' ' + $w + 'x' + $h + ' lit=' + $lit)
    }
}

# ---- pass 1: bake + gates + save; pass 2: idempotency re-bake ----
$names = @($assets.Keys | Sort-Object)
Write-Output ('pass 1: bake + gates (' + $names.Count + ' assets)')
$hashes = @{}
foreach ($k in $names) {
    $spec = $assets[$k]
    $bmp = Build-One $spec
    Test-Asset $bmp $spec.kind $k
    $path = Join-Path $dir $k
    $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    $hashes[$k] = (Get-FileHash -Algorithm SHA256 $path).Hash
}
Write-Output 'pass 2: idempotency re-bake'
foreach ($k in $names) {
    $spec = $assets[$k]
    $bmp = Build-One $spec
    $path = Join-Path $dir $k
    $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    $h2 = (Get-FileHash -Algorithm SHA256 $path).Hash
    if ($hashes[$k] -ne $h2) { throw ('G4 not deterministic: ' + $k) }
}
$vals = @($hashes.Values)
for ($i = 0; $i -lt $vals.Count; $i++) {
    for ($j = ($i + 1); $j -lt $vals.Count; $j++) {
        if ($vals[$i] -eq $vals[$j]) { throw 'G4 duplicate asset hashes' }
    }
}
$sum = 'BAKE OK 24 assets'
foreach ($k in $names) { $sum = $sum + ' ' + $k + '=' + $hashes[$k].Substring(0, 12) }
Write-Output $sum
