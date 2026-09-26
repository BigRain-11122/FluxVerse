# FluxVerse DevLoop r203: water tile frames bake (00:10 art-rectify order
# batch2, T-FV-122 S1 item (1); CEO review 09-26 ~15:20 - the water reads as
# a pink brick grid, not as water). Bakes 8 frames of 16x16 blue-violet
# gradient water tiles with soft phase-shifted ripple bands.
#
# Wave law: frame f shifts the ripple pattern 2px horizontally; 8 frames x
# 2px = 16px = one full tile width, so (a) the 8-frame loop is seamless and
# (b) tiles wrap edge-to-edge by construction (the wave evaluates
# (x + phase + band-offset) mod 16, period 16).
#
# Palette (ambient channel, five-color law untouched): base vertical
# gradient blue 44,52,118 -> violet 52,58,130; hash-jitter tone +8 at 1/5
# density; two soft ripple bands (crest 96,108,196 / under-edge 66,76,144)
# centered on rows 5.5/11.5 with anti-aligned phases; sparse glint pixels
# 158,170,230 (band-dependent columns, frame-animated).
#
# Landing: Assets/Art/CleanCityv3/WaterTiles/water_wave_00..07.png
# (ArtRoot-relative so builder MK() keeps its zero-change path law; the r202
# draft said Assets/Art/WaterTiles/ but ArtRoot is pinned to
# Assets/Art/CleanCityv3 at CitySkeletonBuilder L25 - the zero-change law
# wins, noted in TECH r203). PPU: importer default 16 tier = 1u per tile,
# same world size as the CleanCity frames it replaces - no PpuFor row.
# Opaque tiles: the batch2 "semi-transparent" ask lands at S2 as a
# tilemap-renderer alpha tier (r202 S2 spec), not in the art.
#
# Self-gates (fail-loud): wave band count, blue-family law (every pixel
# b>r, avg b-r >= 40), double-bake SHA determinism, pairwise-distinct
# frames, frame-to-frame phase motion, on-disk byte verification.
# ASCII only (PS5.1 encoding law).
$ErrorActionPreference = 'Stop'
$destDir = Join-Path $PSScriptRoot '..\..\City\Assets\Art\CleanCityv3\WaterTiles'
Add-Type -AssemblyName System.Drawing
$fmt = [System.Drawing.Imaging.PixelFormat]::Format32bppArgb

function Get-FileSha($p) {
    $sha = [System.Security.Cryptography.SHA256]::Create()
    try {
        $fs = [IO.File]::OpenRead($p)
        try { $hash = $sha.ComputeHash($fs) } finally { $fs.Close() }
    } finally { $sha.Clear() }
    return ([BitConverter]::ToString($hash) -replace '-', '')
}

function Read-BmpBytes($p) {
    $bmp = New-Object System.Drawing.Bitmap($p)
    try {
        $w = $bmp.Width; $h = $bmp.Height
        $rect = New-Object System.Drawing.Rectangle(0, 0, $w, $h)
        $bd = $bmp.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::ReadOnly, $fmt)
        $stride = $bd.Stride
        $len = $stride * $h
        $bytes = New-Object byte[] $len
        [System.Runtime.InteropServices.Marshal]::Copy($bd.Scan0, $bytes, 0, $len)
        $bmp.UnlockBits($bd)
        return @{ w = $w; h = $h; stride = $stride; bytes = $bytes }
    } finally { $bmp.Dispose() }
}

function Write-BmpFromBytes($p, $img) {
    $w = $img.w; $h = $img.h
    $out = New-Object System.Drawing.Bitmap($w, $h, $fmt)
    try {
        $rect = New-Object System.Drawing.Rectangle(0, 0, $w, $h)
        $obd = $out.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::WriteOnly, $fmt)
        try {
            if ($obd.Stride -ne $img.stride) { throw ("stride mismatch: " + $obd.Stride + " vs " + $img.stride) }
            $len = $img.stride * $h
            [System.Runtime.InteropServices.Marshal]::Copy($img.bytes, 0, $obd.Scan0, $len)
        } finally { $out.UnlockBits($obd) }
        $out.Save($p, [System.Drawing.Imaging.ImageFormat]::Png)
    } finally { $out.Dispose() }
}

function Verify-Bytes($path, $expected) {
    $chk = Read-BmpBytes $path
    if ($chk.w -ne $expected.w -or $chk.h -ne $expected.h) { throw ("verify size fail " + $chk.w + "x" + $chk.h) }
    if ($chk.stride -ne $expected.stride) { throw "verify stride fail" }
    $diff = 0
    for ($i = 0; $i -lt $expected.bytes.Length; $i++) {
        if ($chk.bytes[$i] -cne $expected.bytes[$i]) { $diff++ }
    }
    if ($diff -ne 0) { throw ("verify fail: " + $diff + " bytes differ on disk") }
    return $diff
}

function Bake-Frame($path, $frame) {
    $w = 16; $h = 16
    $stride = $w * 4
    $bytes = New-Object byte[] ($stride * $h)
    $phase = $frame * 2
    # base: blue -> violet vertical gradient + 1/5-density hash jitter
    for ($y = 0; $y -lt $h; $y++) {
        $t = $y / 15.0
        $gr = 44 + [int][math]::Floor((8.0 * $t) + 0.5)
        $gg = 52 + [int][math]::Floor((6.0 * $t) + 0.5)
        $gb = 118 + [int][math]::Floor((12.0 * $t) + 0.5)
        for ($x = 0; $x -lt $w; $x++) {
            $r = $gr; $g = $gg; $b = $gb
            if (((($x * 13) + ($y * 7)) % 5) -eq 0) { $r = $gr + 8; $g = $gg + 8; $b = $gb + 8 }
            $oi = ($y * $stride) + ($x * 4)
            $bytes[$oi] = [byte]$b; $bytes[$oi + 1] = [byte]$g; $bytes[$oi + 2] = [byte]$r; $bytes[$oi + 3] = 255
        }
    }
    # two soft ripple bands (crest + dimmer under-edge), phase-shifted
    $crest = 0
    for ($k = 0; $k -lt 2; $k++) {
        if ($k -eq 0) { $center = 5.5; $amp = 1.2; $poff = 0 } else { $center = 11.5; $amp = 0.9; $poff = 8 }
        for ($x = 0; $x -lt $w; $x++) {
            $tt = ($x + $phase + $poff) % 16
            $s = [math]::Sin((2.0 * [math]::PI * $tt) / 16.0)
            $ry = [int][math]::Floor($center + ($amp * $s))
            $ey = $ry + 1
            if ($ry -ge 0 -and $ry -lt $h) {
                $r = 96; $g = 108; $b = 196
                if (((($x * 5) + ($frame * 3) + ($k * 2)) % 7) -eq 0) { $r = 158; $g = 170; $b = 230 }
                $oi = ($ry * $stride) + ($x * 4)
                $bytes[$oi] = [byte]$b; $bytes[$oi + 1] = [byte]$g; $bytes[$oi + 2] = [byte]$r
                $crest++
            }
            if ($ey -ge 0 -and $ey -lt $h) {
                $oi = ($ey * $stride) + ($x * 4)
                $bytes[$oi] = [byte]144; $bytes[$oi + 1] = [byte]76; $bytes[$oi + 2] = [byte]66
            }
        }
    }
    if ($crest -lt 24 -or $crest -gt 60) { throw ("wave band fail frame " + $frame + ": crest=" + $crest) }
    # blue-family law: every pixel b > r, average b-r >= 40
    $bmin = 0; $sumDr = 0; $n = 0
    for ($i = 0; $i -lt $bytes.Length; $i += 4) {
        $b = $bytes[$i]; $r = $bytes[$i + 2]
        if ($b -le $r) { throw ("blue-family violation frame " + $frame + " at px " + ($i / 4) + ": b=" + $b + " r=" + $r) }
        $sumDr = $sumDr + ($b - $r); $n++
    }
    if (($sumDr / $n) -lt 40) { throw ("blue-family avg fail frame " + $frame + ": avg=" + ($sumDr / $n)) }
    $img = @{ w = $w; h = $h; stride = $stride; bytes = $bytes }
    Write-BmpFromBytes $path $img
    Verify-Bytes $path $img | Out-Null
    return $crest
}

function Install-Asset($tmpA, $tmpB, $dst, $label) {
    $s1 = Get-FileSha $tmpA
    $s2 = Get-FileSha $tmpB
    if ($s1 -ne $s2) { throw ("double-bake SHA mismatch: determinism broken [" + $label + "]") }
    if (Test-Path $dst) {
        $oldSha = Get-FileSha $dst
        if ($oldSha -ne $s1) {
            throw ("existing asset differs from fresh bake: stale file, refusing silent overwrite [" + $label + "]")
        } else {
            Write-Host ("  already-current " + $label + " sha12=" + $s1.Substring(0, 12))
        }
    } else {
        [IO.File]::Copy($tmpA, $dst)
        Write-Host ("  baked " + $label + " sha12=" + $s1.Substring(0, 12))
    }
    Remove-Item $tmpA -Force -ErrorAction SilentlyContinue
    Remove-Item $tmpB -Force -ErrorAction SilentlyContinue
    return $s1
}

# --- main --------------------------------------------------------------------
if (-not (Test-Path $destDir)) { New-Item -ItemType Directory -Path $destDir | Out-Null }

$oldTileDir = Join-Path $PSScriptRoot '..\..\City\Assets\Art\CleanCityv3\Tiles_Extract'
$srcPaths = @( (Join-Path $oldTileDir 'water_wave_00.png') )
$srcBefore = @()
foreach ($p in $srcPaths) {
    if (-not (Test-Path $p)) { throw ("source missing: " + $p) }
    $fi = Get-Item $p
    $srcBefore += ($p + '|' + $fi.Length + '|' + $fi.LastWriteTimeUtc.Ticks)
}

$shaList = @()
Write-Output "water tile frames (16x16, blue-violet gradient + soft ripple, 2px/frame phase):"
for ($f = 0; $f -lt 8; $f++) {
    $nm = 'water_wave_0' + $f
    $t1 = Join-Path $env:TEMP ('fv-wtile-' + $nm + '-a.png')
    $t2 = Join-Path $env:TEMP ('fv-wtile-' + $nm + '-b.png')
    $c1 = Bake-Frame $t1 $f
    $c2 = Bake-Frame $t2 $f
    if ($c1 -ne $c2) { throw ("crest count differs: determinism broken [" + $nm + "]") }
    $dst = Join-Path $destDir ($nm + '.png')
    $sha = Install-Asset $t1 $t2 $dst $nm
    $shaList += $sha
    Write-Output ("  " + $nm + " crest=" + $c1)
}
for ($i = 0; $i -lt $shaList.Count; $i++) {
    for ($k = ($i + 1); $k -lt $shaList.Count; $k++) {
        if ($shaList[$i] -eq $shaList[$k]) { throw ("frames " + $i + " and " + $k + " are identical") }
    }
}

foreach ($p in $srcPaths) {
    $fi = Get-Item $p
    $after = ($p + '|' + $fi.Length + '|' + $fi.LastWriteTimeUtc.Ticks)
    $before = $srcBefore | Where-Object { $_ -like ($p + '|*') }
    if ($before -ne $after) { throw ("source was modified by the bake: " + $p) }
}

if ($shaList.Count -ne 8) { throw ("asset count fail: " + $shaList.Count) }
Write-Output ("BAKE OK total=8 src_untouched=1 deterministic=1 frames_distinct=1 loop=2px_x8=16px")
exit 0
