# FluxVerse DevLoop r154: water-fx asset bake (P-20260925-09 water & daynight
# CEO order 09-25 ~18:00, spec R-20260925-water-daynight.md W1-W4 bake half).
# Bakes 15 PNGs:
#  (1) face-crop reflections x3 - top-72px crop of the MOUNTED city faces,
#      raw-ARGB vertical flip (r93 zero-resample flip law), darkened 60% (x0.4),
#      roof crown lands on the bank edge (mirror semantics: object edge nearest
#      the water appears at the bank line); r176 re-source: QUANT/MEDIA now
#      crop the r175 landmark silhouettes (quant-twist / media-pearl, the 00:10
#      art-rectify order T-FV-002 swap faces), GAME keeps the r151 facade skin;
#      the re-source is a DELIBERATE regeneration gated by old-derivation
#      sha12 provenance pins (the stale-refuse law stays intact for the other
#      13 assets - a re-sourced piece may only replace a disk file that still
#      IS the r154 derivation, anything else fails loud);
#  (2) brain-tower reflection x1 - composed from the REAL CleanCity tile PNGs
#      per tower-v2-manifest lower 3u (plinth 5 cells x2 rows glass 189 +
#      shaft row with glow band props 132/133 overlay), pre-mirrored layout
#      (plinth at bank edge), darkened x0.4;
#  (3) three-color neon shimmer shards x3 - five-color law family tints
#      (QUANT gold / GAME cyan / MEDIA magenta), deterministic per-column runs;
#  (4) foam edge frames x8 - north (solid row top) / south (solid row bottom),
#      4 frames each, synced to the water frame tick.
# PPU tiers: water-fx/ = default 16; water-fx/facades/ = 24 (PpuFor row r154).
# Self-gates (fail-loud): source pins, saved-file byte verification, double
# bake SHA determinism, idempotent install (stale = refuse), sources
# untouched, foam frames pairwise distinct. ASCII only (PS5.1 encoding law).
$ErrorActionPreference = 'Stop'
$packDir   = Join-Path $PSScriptRoot '..\..\City\Assets\ArtPacks\water-fx'
$facDir    = Join-Path $packDir 'facades'
$towersDir = Join-Path $PSScriptRoot '..\..\City\Assets\ArtPacks\office-towers'
$tilesDir  = Join-Path $PSScriptRoot '..\..\City\Assets\Art\CleanCityv3\Tiles'
Add-Type -AssemblyName System.Drawing
$fmt = [System.Drawing.Imaging.PixelFormat]::Format32bppArgb
$dark = 0.4   # spec W2: darken 60%

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
        $rw = 0; $rh = 0
        $rw = $w; $rh = $h
        $rect = New-Object System.Drawing.Rectangle(0, 0, $rw, $rh)
        $bd = $bmp.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::ReadOnly, $fmt)
        $stride = $bd.Stride
        $len = $stride * $rh
        $bytes = New-Object byte[] $len
        [System.Runtime.InteropServices.Marshal]::Copy($bd.Scan0, $bytes, 0, $len)
        $bmp.UnlockBits($bd)
        return @{ w = $rw; h = $rh; stride = $stride; bytes = $bytes }
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

# --- (1) facade crop + vertical flip + darken -------------------------------
function Bake-ReflFacade($srcPath, $dstPath, $cropH, $pinW, $pinH) {
    $src = Read-BmpBytes $srcPath
    if ($src.w -ne $pinW -or $src.h -ne $pinH) {
        throw ("facade pin fail: " + $src.w + "x" + $src.h + " (expected " + $pinW + "x" + $pinH + ")")
    }
    $stride = $src.stride
    $outBytes = New-Object byte[] ($stride * $cropH)
    for ($y = 0; $y -lt $cropH; $y++) {
        $srow = $y * $stride
        $dy = $cropH - 1 - $y
        $orow = $dy * $stride
        for ($x = 0; $x -lt $src.w; $x++) {
            $si = $srow + ($x * 4)
            $oi = $orow + ($x * 4)
            $outBytes[$oi]     = [byte]([math]::Floor($src.bytes[$si] * $dark))
            $outBytes[$oi + 1] = [byte]([math]::Floor($src.bytes[$si + 1] * $dark))
            $outBytes[$oi + 2] = [byte]([math]::Floor($src.bytes[$si + 2] * $dark))
            $outBytes[$oi + 3] = $src.bytes[$si + 3]
        }
    }
    $img = @{ w = $src.w; h = $cropH; stride = $stride; bytes = $outBytes }
    Write-BmpFromBytes $dstPath $img
    Verify-Bytes $dstPath $img | Out-Null
    # non-identity: the crop must not be vertically symmetric
    $asym = 0
    for ($y = 0; $y -lt $cropH; $y++) {
        $srow = $y * $stride
        $orow = ($cropH - 1 - $y) * $stride
        for ($x = 0; $x -lt $src.w; $x++) {
            $si = $srow + ($x * 4); $oi = $orow + ($x * 4)
            for ($k = 0; $k -lt 4; $k++) {
                if ($src.bytes[$si + $k] -cne $outBytes[$oi + $k]) { $asym++ }
            }
        }
    }
    if ($asym -eq 0) { throw "crop is vertically symmetric: flip would be an identity copy" }
    return $asym
}

# --- (2) tower reflection composed from real tiles --------------------------
function Bake-ReflTower($dstPath) {
    $glass = Read-BmpBytes (Join-Path $tilesDir 'GuttyKreum_CleanCity_189.png')
    $propA  = Read-BmpBytes (Join-Path $tilesDir 'GuttyKreum_CleanCity_132.png')
    $propB  = Read-BmpBytes (Join-Path $tilesDir 'GuttyKreum_CleanCity_133.png')
    if ($glass.w -ne 16 -or $glass.h -ne 16) { throw "glass tile pin fail" }
    if ($propA.w -ne 16 -or $propA.h -ne 16) { throw "propA tile pin fail" }
    if ($propB.w -ne 16 -or $propB.h -ne 16) { throw "propB tile pin fail" }
    $w = 80; $h = 48
    $stride = $w * 4
    $bytes = New-Object byte[] ($stride * $h)
    # pre-mirrored layout, top row = bank edge = plinth base (tower-v2 cells):
    # row0/row1 = plinth 5 cells glass; row2 = shaft 3 cells + glow band overlay
    for ($r = 0; $r -lt 3; $r++) {
        if ($r -lt 2) { $c0 = 0; $c1 = 4 } else { $c0 = 1; $c1 = 3 }
        for ($c = $c0; $c -le $c1; $c++) {
            $dx = $c * 16; $dy = $r * 16
            for ($py = 0; $py -lt 16; $py++) {
                $orow = (($dy + $py) * $stride) + ($dx * 4)
                for ($px = 0; $px -lt 16; $px++) {
                    $si = ($py * $glass.stride) + ($px * 4)
                    $o4 = $orow + ($px * 4)
                    $bytes[$o4]     = $glass.bytes[$si]
                    $bytes[$o4 + 1] = $glass.bytes[$si + 1]
                    $bytes[$o4 + 2] = $glass.bytes[$si + 2]
                    $bytes[$o4 + 3] = $glass.bytes[$si + 3]
                }
            }
        }
    }
    # glow band props on row2 cols 1..3 (propA / propB / propA, family pick law)
    $overlayHits = 0
    $cols = @(1, 2, 3)
    for ($k = 0; $k -lt 3; $k++) {
        $c = $cols[$k]
        if ($k -eq 1) { $t = $propB } else { $t = $propA }
        $dx = $c * 16; $dy = 32
        for ($py = 0; $py -lt 16; $py++) {
            $si = ($py * $t.stride)
            $oi = (($dy + $py) * $stride) + ($dx * 4)
            for ($px = 0; $px -lt 16; $px++) {
                $s4 = $si + ($px * 4); $o4 = $oi + ($px * 4)
                if ($t.bytes[$s4 + 3] -gt 0) {
                    $bytes[$o4]     = $t.bytes[$s4]
                    $bytes[$o4 + 1] = $t.bytes[$s4 + 1]
                    $bytes[$o4 + 2] = $t.bytes[$s4 + 2]
                    $bytes[$o4 + 3] = $t.bytes[$s4 + 3]
                    $overlayHits++
                }
            }
        }
    }
    if ($overlayHits -eq 0) { throw "glow band overlay never fired: props empty" }
    # uniform darken x0.4
    for ($i = 0; $i -lt $bytes.Length; $i += 4) {
        $bytes[$i]     = [byte]([math]::Floor($bytes[$i] * $dark))
        $bytes[$i + 1] = [byte]([math]::Floor($bytes[$i + 1] * $dark))
        $bytes[$i + 2] = [byte]([math]::Floor($bytes[$i + 2] * $dark))
    }
    $img = @{ w = $w; h = $h; stride = $stride; bytes = $bytes }
    Write-BmpFromBytes $dstPath $img
    Verify-Bytes $dstPath $img | Out-Null
    return $overlayHits
}

# --- (3) shimmer shards ------------------------------------------------------
function Bake-Shimmer($dstPath, $fr, $fg, $fb) {
    $w = 24; $h = 40
    $stride = $w * 4
    $bytes = New-Object byte[] ($stride * $h)
    $lit = 0
    for ($c = 0; $c -lt $w; $c++) {
        $seed = ($c * 131 + 7)
        $base = $seed % 30
        $len = 4 + ($seed % 7)
        for ($y = $base; $y -lt ($base + $len); $y++) {
            if ($y -ge 40) { continue }
            $oi = ($y * $stride) + ($c * 4)
            $sparkle = ((($c + $y) % 3) -eq 0)
            if ($sparkle) {
                $rr = $fr + [int]([math]::Floor(((255 - $fr) * 3) / 5))
                $gg = $fg + [int]([math]::Floor(((255 - $fg) * 3) / 5))
                $bb = $fb + [int]([math]::Floor(((255 - $fb) * 3) / 5))
            } else {
                $rr = $fr; $gg = $fg; $bb = $fb
            }
            $bytes[$oi] = [byte]$bb; $bytes[$oi + 1] = [byte]$gg; $bytes[$oi + 2] = [byte]$rr
            $bytes[$oi + 3] = 235
            $lit++
        }
        for ($y = 0; $y -lt $h; $y++) {
            $oi = ($y * $stride) + ($c * 4)
            if ($bytes[$oi + 3] -gt 0) { continue }
            if (((($c * 29 + $y * 11) % 47) -eq 0)) {
                $bytes[$oi] = [byte]$fb; $bytes[$oi + 1] = [byte]$fg; $bytes[$oi + 2] = [byte]$fr
                $bytes[$oi + 3] = 160
                $lit++
            }
        }
    }
    if ($lit -lt 100 -or $lit -gt 400) { throw ("shimmer lit count out of band: " + $lit) }
    $img = @{ w = $w; h = $h; stride = $stride; bytes = $bytes }
    Write-BmpFromBytes $dstPath $img
    Verify-Bytes $dstPath $img | Out-Null
    return $lit
}

# --- (4) foam edge frames ----------------------------------------------------
function Bake-Foam($dstPath, $solidTop, $frame) {
    $w = 1600; $h = 2
    $stride = $w * 4
    $bytes = New-Object byte[] ($stride * $h)
    if ($solidTop) { $solidRow = 0; $sparseRow = 1 } else { $solidRow = 1; $sparseRow = 0 }
    $solidN = 0; $sparseN = 0
    for ($x = 0; $x -lt $w; $x++) {
        $gap = ((($x + ($frame * 37)) % 13) -eq 0)
        if (-not $gap) {
            $oi = ($solidRow * $stride) + ($x * 4)
            $bytes[$oi] = 255; $bytes[$oi + 1] = 245; $bytes[$oi + 2] = 235; $bytes[$oi + 3] = 230
            $solidN++
        }
        if (((($x * 7) + ($frame * 11)) % 17) -eq 0) {
            $oi = ($sparseRow * $stride) + ($x * 4)
            $bytes[$oi] = 252; $bytes[$oi + 1] = 238; $bytes[$oi + 2] = 220; $bytes[$oi + 3] = 150
            $sparseN++
        }
    }
    if ($solidN -lt 1400 -or $sparseN -gt 240) { throw ("foam density fail solid=" + $solidN + " sparse=" + $sparseN) }
    $img = @{ w = $w; h = $h; stride = $stride; bytes = $bytes }
    Write-BmpFromBytes $dstPath $img
    Verify-Bytes $dstPath $img | Out-Null
    return @{ solid = $solidN; sparse = $sparseN }
}

function Install-Asset($tmpA, $tmpB, $dst, $label, $oldPin) {
    $s1 = Get-FileSha $tmpA
    $s2 = Get-FileSha $tmpB
    if ($s1 -ne $s2) { throw ("double-bake SHA mismatch: determinism broken [" + $label + "]") }
    if (Test-Path $dst) {
        $oldSha = Get-FileSha $dst
        if ($oldSha -ne $s1) {
            if ($oldPin -and ($oldSha.Substring(0, 12) -eq $oldPin)) {
                # deliberate re-source (r176): provenance proven, replace + reverify
                [IO.File]::Copy($tmpA, $dst, $true)
                $nowSha = Get-FileSha $dst
                if ($nowSha -ne $s1) { throw ("re-source verify fail on disk [" + $label + "]") }
                Write-Host ("  re-sourced " + $label + " old_sha12=" + $oldPin + " new_sha12=" + $s1.Substring(0, 12))
            } else {
                throw ("existing asset differs from fresh bake: stale file, refusing silent overwrite [" + $label + "]")
            }
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
if (-not (Test-Path $packDir)) { New-Item -ItemType Directory -Path $packDir | Out-Null }
if (-not (Test-Path $facDir))  { New-Item -ItemType Directory -Path $facDir  | Out-Null }

$srcPaths = @(
    (Join-Path $towersDir 'quant-twist.png'),
    (Join-Path $towersDir 'facade-game.png'),
    (Join-Path $towersDir 'media-pearl.png'),
    (Join-Path $tilesDir 'GuttyKreum_CleanCity_189.png'),
    (Join-Path $tilesDir 'GuttyKreum_CleanCity_132.png'),
    (Join-Path $tilesDir 'GuttyKreum_CleanCity_133.png')
)
$srcBefore = @()
foreach ($p in $srcPaths) {
    if (-not (Test-Path $p)) { throw ("source missing: " + $p) }
    $fi = Get-Item $p
    $srcBefore += ($p + '|' + $fi.Length + '|' + $fi.LastWriteTimeUtc.Ticks)
}

$shaList = @()

Write-Output "face-crop reflections (top 72px, v-flip, x0.4; r176: QUANT/MEDIA = landmark silhouettes):"
$facJobs = @(
    @{ n = 'refl-quant'; src = (Join-Path $towersDir 'quant-twist.png'); pw = 120; ph = 192 },
    @{ n = 'refl-game';  src = (Join-Path $towersDir 'facade-game.png');  pw = 120; ph = 120 },
    @{ n = 'refl-media'; src = (Join-Path $towersDir 'media-pearl.png'); pw = 144; ph = 144 }
)
# r176 re-source provenance pins: the disk files these two jobs replace must
# still be the r154 facade-skin derivations (old sha12) - see landmarks-manifest.
$reSourcePin = @{ 'refl-quant' = 'C007613EFAE7'; 'refl-media' = '4BA113444F98' }
foreach ($j in $facJobs) {
    $t1 = Join-Path $env:TEMP ("fv-wfx-" + $j.n + "-a.png")
    $t2 = Join-Path $env:TEMP ("fv-wfx-" + $j.n + "-b.png")
    $a1 = Bake-ReflFacade $j.src $t1 72 $j.pw $j.ph
    $a2 = Bake-ReflFacade $j.src $t2 72 $j.pw $j.ph
    if ($a1 -ne $a2) { throw ("asym count differs: determinism broken [" + $j.n + "]") }
    $dst = Join-Path $facDir ($j.n + '.png')
    $pin = $null
    if ($reSourcePin.ContainsKey($j.n)) { $pin = $reSourcePin[$j.n] }
    $sha = Install-Asset $t1 $t2 $dst ("facades/" + $j.n) $pin
    $shaList += $sha
    Write-Output ("  refl " + $j.n + " 72px-crop asym=" + $a1)
}

Write-Output "brain-tower reflection (real tiles 189/132/133, x0.4):"
$t1 = Join-Path $env:TEMP 'fv-wfx-tower-a.png'
$t2 = Join-Path $env:TEMP 'fv-wfx-tower-b.png'
$ov1 = Bake-ReflTower $t1
$ov2 = Bake-ReflTower $t2
if ($ov1 -ne $ov2) { throw "tower overlay count differs: determinism broken" }
$dst = Join-Path $packDir 'refl-tower.png'
$sha = Install-Asset $t1 $t2 $dst 'refl-tower'
$shaList += $sha
Write-Output ("  refl-tower 80x48 overlay_px=" + $ov1)

Write-Output "shimmer shards (five-color law family tints):"
$shimJobs = @(
    @{ n = 'shimmer-gold';    r = 250; g = 191; b = 51 },
    @{ n = 'shimmer-cyan';    r = 51;  g = 235; b = 219 },
    @{ n = 'shimmer-magenta'; r = 242; g = 82;  b = 168 }
)
foreach ($j in $shimJobs) {
    $t1 = Join-Path $env:TEMP ("fv-wfx-" + $j.n + "-a.png")
    $t2 = Join-Path $env:TEMP ("fv-wfx-" + $j.n + "-b.png")
    $l1 = Bake-Shimmer $t1 $j.r $j.g $j.b
    $l2 = Bake-Shimmer $t2 $j.r $j.g $j.b
    if ($l1 -ne $l2) { throw ("lit count differs: determinism broken [" + $j.n + "]") }
    $dst = Join-Path $packDir ($j.n + '.png')
    $sha = Install-Asset $t1 $t2 $dst $j.n
    $shaList += $sha
    Write-Output ("  " + $j.n + " 24x40 lit=" + $l1)
}

Write-Output "foam edge frames (north/south, 4 frames each):"
$foamShas = @()
for ($side = 0; $side -lt 2; $side++) {
    for ($f = 0; $f -lt 4; $f++) {
        if ($side -eq 0) { $nm = 'foam-n-' + $f; $solidTop = $true } else { $nm = 'foam-s-' + $f; $solidTop = $false }
        $t1 = Join-Path $env:TEMP ("fv-wfx-" + $nm + "-a.png")
        $t2 = Join-Path $env:TEMP ("fv-wfx-" + $nm + "-b.png")
        $d1 = Bake-Foam $t1 $solidTop $f
        $d2 = Bake-Foam $t2 $solidTop $f
        if ($d1.solid -ne $d2.solid -or $d1.sparse -ne $d2.sparse) { throw ("foam counts differ [" + $nm + "]") }
        $dst = Join-Path $packDir ($nm + '.png')
        $sha = Install-Asset $t1 $t2 $dst $nm
        $shaList += $sha
        $foamShas += $sha
        Write-Output ("  " + $nm + " 1600x2 solid=" + $d1.solid + " sparse=" + $d1.sparse)
    }
}
for ($i = 0; $i -lt $foamShas.Count; $i++) {
    for ($k = ($i + 1); $k -lt $foamShas.Count; $k++) {
        if ($foamShas[$i] -eq $foamShas[$k]) { throw ("foam frames " + $i + " and " + $k + " are identical") }
    }
}

foreach ($p in $srcPaths) {
    $fi = Get-Item $p
    $after = ($p + '|' + $fi.Length + '|' + $fi.LastWriteTimeUtc.Ticks)
    $before = $srcBefore | Where-Object { $_ -like ($p + '|*') }
    if ($before -ne $after) { throw ("source was modified by the bake: " + $p) }
}

if ($shaList.Count -ne 15) { throw ("asset count fail: " + $shaList.Count) }
Write-Output ("BAKE OK total=15 src_untouched=1 deterministic=1 foam_frames_distinct=1")
exit 0
