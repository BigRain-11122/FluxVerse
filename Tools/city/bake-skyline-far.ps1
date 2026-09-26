# FluxVerse DevLoop r207: far-layer Shanghai skyline strip bake (00:10
# art-rectify order batch2, T-FV-122 S3; CEO review 09-26 ~15:20 - the
# distant skyline band reads as featureless uniform blocks with no
# recognizable Shanghai silhouette).
#
# Canvas law (SkylineRules contract, zero engine churn by construction):
#   576x324 @ PPU16 (importer default tier - no PpuFor row, parallax family),
#   first opaque row == 61  -> world y +19.0 exactly (FarContentTopY law,
#   zenith-window bottom is 19.04, so spire tips stay under the r131 A10
#   sky window with 0.04u margin),
#   last opaque row == 234 (band bottom, mirrors the r34 measured pack rows).
#   Generic lot tops are clamped to >=63 so row 61..62 stays landmark-only.
#
# Content law (order item 2 "3-5 recognizable Shanghai outline towers, the
# rest varied blocks"):
#   five named silhouettes embedded at spread x positions:
#     pearl  x~130  twin stacked spheres + column + splayed legs (Oriental Pearl)
#     twist  x~260  tapering kinked-segment spire (Shanghai Tower twist)
#     step   x~380  stepped setback spire
#     bud    x~470  magnolia bud on a stem with sepal slit (brain-crown motif)
#     mast   x~510  radio mast with crossbars (also feeds the right-edge
#                   coverage window the SkylineProof drift gate samples)
#   generic lots: deterministic hash walk (width 10..46, gap 0..3, tall/mid/low
#   tiers 14/45/41) - no regular repetition; peach cap/stripes/antenna/tank
#   toppings hashed per lot.
#
# Palette (ambient scenery, five-color law untouched - pink/purple is a legal
# ambient sky color per DESIGN sec.9): pack native rose (240,147,161) base so
# the FogFar multiply keeps the r34-validated fog math; peach (255,205,186)
# accents; slate (45,28,42) sparse window slits.
#
# Self-gates (fail-loud): corners transparent, row contract 61/234, sparse
# tip row, band coverage windows (proof D-gate margins), landmark recognizers
# (run widths at pinned rows), top-profile variation census, color census,
# double-bake SHA determinism, on-disk byte verify, pack source untouched.
# ASCII only (PS5.1 encoding law). No 3D.
$ErrorActionPreference = 'Stop'
$repo = Split-Path (Split-Path $PSScriptRoot -Parent) -Parent
$destDir = Join-Path $repo 'City\Assets\ArtPacks\skyline-shanghai'
$packDir = Join-Path $repo 'City\Assets\ArtPacks\parallax-skyline'
Add-Type -AssemblyName System.Drawing
$fmt = [System.Drawing.Imaging.PixelFormat]::Format32bppArgb

$script:W = 576
$script:H = 324
$script:ROSE  = @(161, 147, 240)   # B,G,R byte order (SetPx writes c0=B c1=G c2=R)
$script:PEACH = @(186, 205, 255)
$script:SLATE = @(42, 28, 45)

# generic-lot tiers: tall 19% (tops 63..79), mid 42% (77..92), low 39% (94..129)
# r207 first-run red retune: mid tops 80..93 left the 80..90 band too thin
# (0.32 vs the SkylineProof 0.28 render gate) - mid band pushed down to 77..92
# and tall share 14->19 so the distant skyline keeps its wall presence while
# the low tier still leaves sky gaps (variation is the order item 2 point).
$TIER_TALL = 19
$TIER_MID  = 61   # cumulative: <19 tall, <61 mid, else low

function Hash([long]$v) {
    $x = $v
    for ($i = 0; $i -lt 3; $i++) { $x = (($x * 1103515245) + 12345) % 2147483647 }
    if ($x -lt 0) { $x = $x * -1 }
    return $x
}

function SetPx([int]$x, [int]$y, [int[]]$c) {
    if ($x -lt 0 -or $x -ge $script:W -or $y -lt 0 -or $y -ge $script:H) { return }
    $oi = ($y * $script:W * 4) + ($x * 4)
    $script:bytes[$oi] = [byte]$c[0]
    $script:bytes[$oi + 1] = [byte]$c[1]
    $script:bytes[$oi + 2] = [byte]$c[2]
    $script:bytes[$oi + 3] = 255
}

function FillRect([int]$x0, [int]$y0, [int]$x1, [int]$y1, [int[]]$c) {
    for ($y = $y0; $y -le $y1; $y++) {
        for ($x = $x0; $x -le $x1; $x++) { SetPx $x $y $c }
    }
}

function FillDisc([int]$cx, [int]$cy, [int]$rad, [int[]]$c) {
    for ($dy = -$rad; $dy -le $rad; $dy++) {
        $t = ($rad * $rad) - ($dy * $dy)
        $hw = [math]::Floor([math]::Sqrt($t) + 0.5)
        FillRect ($cx - $hw) ($cy + $dy) ($cx + $hw) ($cy + $dy) $c
    }
}

function OpaqueAt([int]$x, [int]$y) {
    if ($x -lt 0 -or $x -ge $script:W -or $y -lt 0 -or $y -ge $script:H) { return $false }
    return ($script:bytes[(($y * $script:W * 4) + ($x * 4) + 3)] -ne 0)
}

function RunWidth([int]$y, [int]$cx) {
    if (-not (OpaqueAt $cx $y)) { return 0 }
    $lo = $cx
    while (($lo - 1 -ge 0) -and (OpaqueAt ($lo - 1) $y)) { $lo = $lo - 1 }
    $hi = $cx
    while (($hi + 1 -lt $script:W) -and (OpaqueAt ($hi + 1) $y)) { $hi = $hi + 1 }
    return ($hi - $lo + 1)
}

# landmark reserved zones (lot walk never builds inside these spans)
$zones = @(
    @{ x0 = 116; x1 = 146 },   # pearl
    @{ x0 = 246; x1 = 276 },   # twist
    @{ x0 = 366; x1 = 396 },   # step
    @{ x0 = 450; x1 = 492 },   # bud
    @{ x0 = 498; x1 = 524 }    # mast
)

function ZoneAt([int]$x) {
    foreach ($z in $zones) { if ($x -ge $z.x0 -and $x -le $z.x1) { return $z } }
    return $null
}

function ZoneAhead([int]$x0, [int]$x1) {
    foreach ($z in $zones) {
        if (($z.x0 -ge $x0) -and ($z.x0 -le $x1)) { return $z }
    }
    return $null
}

function Build-Strip {
    $script:bytes = New-Object byte[] (($script:W * 4) * $script:H)

    # -- base mass: solid distant-city mass rows 120..234 (behind the painted
    #    city below +15; mirrors the pack's solid lower band, zero see-through)
    FillRect 0 120 575 234 $script:ROSE

    # -- generic lot walk (deterministic hash, no regular repetition) --
    $lotCount = 0
    $x = 0
    $i = 0
    while ($x -lt $script:W) {
        $z = ZoneAt $x
        if ($z -ne $null) { $x = $z.x1 + 1; continue }
        $w = 10 + ((Hash (7 * $i + 1)) % 37)
        if (($x + $w) -gt $script:W) { $w = $script:W - $x }
        $z2 = ZoneAhead $x ($x + $w - 1)
        if ($z2 -ne $null) {
            $w = $z2.x0 - $x
            if ($w -lt 6) { $x = $z2.x1 + 1; continue }
        }
        $t = (Hash (7 * $i + 3)) % 100
        if ($t -lt $TIER_TALL) { $top = 63 + ((Hash (7 * $i + 4)) % 17) }
        elseif ($t -lt $TIER_MID) { $top = 77 + ((Hash (7 * $i + 4)) % 16) }
        else { $top = 94 + ((Hash (7 * $i + 4)) % 36) }
        FillRect $x $top ($x + $w - 1) 234 $script:ROSE
        $cxp = $x + [math]::Floor($w / 2)
        # antenna on tall lots (clamped >=63: row 61..62 stays landmark-only)
        if ($top -le 79 -and ((Hash (7 * $i + 5)) % 10) -lt 6) {
            $antH = 3 + ((Hash (7 * $i + 6)) % 5)
            $aTop = $top - $antH
            if ($aTop -lt 63) { $aTop = 63 }
            if ($aTop -lt $top) { FillRect $cxp $aTop $cxp ($top - 1) $script:ROSE }
        }
        # water tank on mid lots
        if ($top -ge 77 -and $top -le 92 -and ((Hash (7 * $i + 9)) % 10) -lt 3) {
            $tTop = $top - 3
            if ($tTop -lt 63) { $tTop = 63 }
            if ($tTop -lt $top) { FillRect ($cxp - 1) $tTop ($cxp + 1) ($top - 1) $script:ROSE }
        }
        # peach cap band
        if (((Hash (7 * $i + 7)) % 10) -lt 4) {
            FillRect $x $top ($x + $w - 1) ($top + 1) $script:PEACH
        }
        # peach window stripes (visible zone only, bounded <=92)
        if (((Hash (7 * $i + 8)) % 10) -lt 5) {
            for ($sy = $top + 2; $sy -le 92; $sy += 3) {
                if (($x + 2) -le ($x + $w - 3)) {
                    FillRect ($x + 2) $sy ($x + $w - 3) $sy $script:PEACH
                }
            }
        }
        # sparse slate window slits on ~1 in 6 lots
        if (((Hash (7 * $i + 10)) % 6) -eq 0) {
            $sy0 = $top + 4
            if ($sy0 -le 90) {
                FillRect ($x + 2) $sy0 ($x + $w - 3) $sy0 $script:SLATE
            }
        }
        $lotCount = $lotCount + 1
        $x = $x + $w + ((Hash (7 * $i + 2)) % 4)
        $i = $i + 1
    }

    # -- landmark 1: pearl (twin stacked spheres + column + legs), cx 130 --
    FillRect 130 61 130 64 $script:ROSE                                # antenna
    FillRect 129 64 131 93 $script:ROSE                                # column
    FillDisc 130 68 4 $script:ROSE                                     # small sphere
    FillDisc 130 82 7 $script:ROSE                                     # big sphere
    FillRect 127 65 133 65 $script:PEACH                               # small-sphere rim
    FillRect 126 76 134 76 $script:PEACH                               # big-sphere rim
    for ($k = 1; $k -le 6; $k++) {                                    # splayed legs
        SetPx (130 - $k) (90 + $k) $script:ROSE
        SetPx (130 + $k) (90 + $k) $script:ROSE
    }
    FillRect 130 90 130 96 $script:ROSE

    # -- landmark 2: twist (tapering kinked-segment spire), cx 260 --
    FillRect 259 61 261 63 $script:ROSE                                # tip
    FillRect 257 64 263 70 $script:ROSE
    FillRect 255 71 265 77 $script:ROSE
    FillRect 252 78 268 84 $script:ROSE
    FillRect 250 85 270 93 $script:ROSE                                # base w21
    FillRect 258 64 262 64 $script:PEACH                               # joint caps
    FillRect 256 71 264 71 $script:PEACH

    # -- landmark 3: step (stepped setback spire), cx 380 --
    FillRect 379 61 381 63 $script:ROSE                                # spire
    FillRect 377 64 383 69 $script:ROSE
    FillRect 374 70 386 76 $script:ROSE
    FillRect 368 77 392 93 $script:ROSE                                # base w25
    FillRect 374 70 386 70 $script:PEACH

    # -- landmark 4: bud (magnolia bud + sepal slit), cx 470 --
    FillRect 470 61 470 61 $script:ROSE                                # tuft tip
    FillRect 469 62 471 63 $script:ROSE
    $hw2 = @(0, 2, 3, 4, 5, 5, 6, 6, 6, 6, 6, 5, 5, 4)                 # rows 64..77
    for ($k = 0; $k -lt 14; $k++) {
        $hwv = $hw2[$k]
        if ($hwv -gt 0) { FillRect (470 - $hwv) (64 + $k) (470 + $hwv) (64 + $k) $script:ROSE }
    }
    FillRect 470 64 470 71 $script:SLATE                               # sepal slit
    FillRect 463 81 466 87 $script:ROSE                               # left leaf (1px gap)
    FillRect 473 84 476 90 $script:ROSE                                # right leaf (1px gap)
    FillRect 466 78 474 79 $script:ROSE                                # calyx flare
    FillRect 468 80 471 93 $script:ROSE                                # stem w4

    # -- landmark 5: mast (radio mast + crossbars), cx 510 --
    FillRect 509 61 511 73 $script:ROSE                                # mast w3
    FillRect 507 66 513 66 $script:ROSE                                # crossbars
    FillRect 507 71 513 71 $script:ROSE
    FillRect 505 74 515 83 $script:ROSE                                # head
    FillRect 500 84 520 93 $script:ROSE                                # base w21
    FillRect 505 74 515 74 $script:PEACH

    return @{ w = $script:W; h = $script:H; stride = ($script:W * 4); bytes = $script:bytes; lots = $lotCount }
}

function Get-FileSha($p) {
    $sha = [System.Security.Cryptography.SHA256]::Create()
    try {
        $fs = [IO.File]::OpenRead($p)
        try { $hash = $sha.ComputeHash($fs) } finally { $fs.Close() }
    } finally { $sha.Clear() }
    return ([BitConverter]::ToString($hash) -replace '-', '')
}

function Write-BmpFromBytes($p, $img) {
    $out = New-Object System.Drawing.Bitmap($img.w, $img.h, $fmt)
    try {
        $rect = New-Object System.Drawing.Rectangle(0, 0, $img.w, $img.h)
        $obd = $out.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::WriteOnly, $fmt)
        try {
            if ($obd.Stride -ne $img.stride) { throw ("stride mismatch: " + $obd.Stride + " vs " + $img.stride) }
            [System.Runtime.InteropServices.Marshal]::Copy($img.bytes, 0, $obd.Scan0, ($img.stride * $img.h))
        } finally { $out.UnlockBits($obd) }
        $out.Save($p, [System.Drawing.Imaging.ImageFormat]::Png)
    } finally { $out.Dispose() }
}

function Verify-Bytes($path, $expected) {
    $bmp = New-Object System.Drawing.Bitmap($path)
    try {
        $rect = New-Object System.Drawing.Rectangle(0, 0, $bmp.Width, $bmp.Height)
        $bd = $bmp.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::ReadOnly, $fmt)
        try {
            if (($bd.Stride * $bmp.Height) -ne ($expected.stride * $expected.h)) { throw "verify stride/size fail" }
            $bytes2 = New-Object byte[] ($bd.Stride * $bmp.Height)
            [System.Runtime.InteropServices.Marshal]::Copy($bd.Scan0, $bytes2, 0, $bytes2.Length)
        } finally { $bmp.UnlockBits($bd) }
    } finally { $bmp.Dispose() }
    $diff = 0
    for ($i = 0; $i -lt $expected.bytes.Length; $i++) {
        if ($bytes2[$i] -cne $expected.bytes[$i]) { $diff++ }
    }
    if ($diff -ne 0) { throw ("verify fail: " + $diff + " bytes differ on disk") }
}

function Install-Asset($tmpA, $tmpB, $dst) {
    $s1 = Get-FileSha $tmpA
    $s2 = Get-FileSha $tmpB
    if ($s1 -ne $s2) { throw "double-bake SHA mismatch: determinism broken" }
    if (Test-Path $dst) {
        $oldSha = Get-FileSha $dst
        if ($oldSha -ne $s1) { throw "existing asset differs from fresh bake: stale file, refusing silent overwrite" }
        Write-Host ("  already-current far-shanghai sha12=" + $s1.Substring(0, 12))
    } else {
        [IO.File]::Copy($tmpA, $dst)
        Write-Host ("  baked far-shanghai sha12=" + $s1.Substring(0, 12))
    }
    Remove-Item $tmpA -Force -ErrorAction SilentlyContinue
    Remove-Item $tmpB -Force -ErrorAction SilentlyContinue
    return $s1
}

# --- self-gates on the built strip (fail-loud, before any write) --------------
function Gate-Strip($img) {
    $script:bytes = $img.bytes
    $b = $img.bytes
    $W4 = $script:W * 4
    # corners transparent
    foreach ($ci in @(0, (($script:W - 1) * 4), ((($script:H - 1) * $W4)), ((($script:H - 1) * $W4) + (($script:W - 1) * 4)))) {
        if ($b[$ci + 3] -ne 0) { throw ("corner not transparent at byte " + $ci) }
    }
    # rows 0..60 fully transparent; row 235..323 fully transparent
    for ($y = 0; $y -le 60; $y++) {
        for ($x = 0; $x -lt $script:W; $x++) {
            if ($b[($y * $W4) + ($x * 4) + 3] -ne 0) { throw ("above-band leak at " + $x + "," + $y) }
        }
    }
    for ($y = 235; $y -lt $script:H; $y++) {
        for ($x = 0; $x -lt $script:W; $x++) {
            if ($b[($y * $W4) + ($x * 4) + 3] -ne 0) { throw ("below-band leak at " + $x + "," + $y) }
        }
    }
    # row 61 sparse landmark tips (>=3, <=12 opaque px: pearl ant 1 + twist 3
    # + step 3 + bud 1 + mast 3 = 11 by construction); row 234 fully opaque
    $tips = 0
    for ($x = 0; $x -lt $script:W; $x++) { if ($b[(61 * $W4) + ($x * 4) + 3] -ne 0) { $tips++ } }
    if ($tips -lt 3 -or $tips -gt 12) { throw ("tip row census fail: " + $tips) }
    for ($x = 0; $x -lt $script:W; $x++) {
        if ($b[(234 * $W4) + ($x * 4) + 3] -eq 0) { throw ("mass bottom hole at " + $x) }
    }
    # band coverage windows (SkylineProof D-gate margins). Two edge metrics:
    # the wide rows 80..90 read and the PROOF window rows 82..89 x 430..534
    # (SkylineProof D3 samples world y 15.4..16.4 at the +2.5 drift extreme,
    # which maps to canvas rows ~82..89 - the direct guard needs >=31.4%).
    $covMain = BandCoverage $img 80 90 96 480
    $covEdge = BandCoverage $img 80 90 430 534
    $covEdgeP = BandCoverage $img 82 89 430 534
    $covFull = BandCoverage $img 80 90 0 575
    Write-Output ("  [bake-gate] coverage main=" + ('{0:N3}' -f $covMain) + " edge=" + ('{0:N3}' -f $covEdge) + " edgeProof=" + ('{0:N3}' -f $covEdgeP) + " full=" + ('{0:N3}' -f $covFull))
    if ($covMain -lt 0.40) { throw ("main band coverage low: " + $covMain) }
    if ($covEdge -lt 0.35) { throw ("edge band coverage low: " + $covEdge) }
    if ($covEdgeP -lt 0.36) { throw ("proof-window edge coverage low: " + $covEdgeP) }
    if ($covFull -lt 0.35) { throw ("full band coverage low: " + $covFull) }
    # landmark recognizers (run widths at pinned rows)
    if ((RunWidth 82 130) -lt 15) { throw ("pearl big-sphere run fail: " + (RunWidth 82 130)) }
    if ((RunWidth 68 130) -lt 9)  { throw ("pearl small-sphere run fail: " + (RunWidth 68 130)) }
    if (-not (OpaqueAt 130 62)) { throw "pearl antenna missing" }
    if ((RunWidth 92 260) -lt 19) { throw ("twist base run fail: " + (RunWidth 92 260)) }
    if ((RunWidth 62 260) -ne 3) { throw ("twist tip run fail: " + (RunWidth 62 260)) }
    if ((RunWidth 72 260) -ne 11) { throw ("twist mid run fail: " + (RunWidth 72 260)) }
    if ((RunWidth 62 380) -ne 3) { throw ("step spire run fail: " + (RunWidth 62 380)) }
    if ((RunWidth 80 380) -ne 25) { throw ("step base run fail: " + (RunWidth 80 380)) }
    if ((RunWidth 72 470) -lt 11) { throw ("bud bulb run fail: " + (RunWidth 72 470)) }
    if ((RunWidth 86 470) -gt 6)  { throw ("bud stem run fail: " + (RunWidth 86 470)) }
    $slitB = $b[((67 * $W4) + (470 * 4))]
    $slitG = $b[((67 * $W4) + (470 * 4) + 1)]
    $slitR = $b[((67 * $W4) + (470 * 4) + 2)]
    if ($slitR -ge 80 -or $slitG -ge 60 -or $slitB -ge 80) { throw "bud sepal slit not slate" }
    if ((RunWidth 62 510) -ne 3) { throw ("mast tip run fail: " + (RunWidth 62 510)) }
    if ((RunWidth 88 510) -lt 21) { throw ("mast base run fail: " + (RunWidth 88 510)) }
    # top-profile variation census (breaks the uniform-block read)
    $tops = @()
    for ($sx = 12; $sx -lt $script:W; $sx += 24) {
        $ty = 0
        for ($y = 61; $y -le 130; $y++) {
            if (OpaqueAt $sx $y) { $ty = $y; break }
        }
        if ($ty -gt 0) { $tops += $ty }
    }
    $distinct = @($tops | Select-Object -Unique)
    if ($distinct.Count -lt 8) { throw ("top-profile variation fail: " + $distinct.Count + " distinct") }
    # color census: rose dominant, peach present, slate sparse
    $nRose = 0; $nPeach = 0; $nSlate = 0; $nOpaque = 0
    for ($y = 61; $y -le 234; $y++) {
        for ($x = 0; $x -lt $script:W; $x++) {
            $oi = ($y * $W4) + ($x * 4)
            if ($b[$oi + 3] -eq 0) { continue }
            $nOpaque++
            if ($b[$oi] -eq 161 -and $b[$oi + 1] -eq 147 -and $b[$oi + 2] -eq 240) { $nRose++ }
            if ($b[$oi] -eq 186 -and $b[$oi + 1] -eq 205 -and $b[$oi + 2] -eq 255) { $nPeach++ }
            if ($b[$oi] -eq 42 -and $b[$oi + 1] -eq 28 -and $b[$oi + 2] -eq 45) { $nSlate++ }
        }
    }
    if ($nRose -lt [math]::Floor($nOpaque * 0.55)) { throw ("rose not dominant: " + $nRose + "/" + $nOpaque) }
    if ($nPeach -lt 200) { throw ("peach accents missing: " + $nPeach) }
    if ($nSlate -lt 4 -or $nSlate -gt [math]::Floor($nOpaque * 0.02)) { throw ("slite census fail: " + $nSlate) }
    return @{ covMain = $covMain; covEdge = $covEdge; covEdgeP = $covEdgeP; covFull = $covFull; tips = $tips;
              distinct = $distinct.Count; lots = $img.lots; nRose = $nRose; nPeach = $nPeach; nSlate = $nSlate }
}

function BandCoverage($img, [int]$y0, [int]$y1, [int]$x0, [int]$x1) {
    $b = $img.bytes
    $W4 = $script:W * 4
    $n = 0; $tot = 0
    for ($y = $y0; $y -le $y1; $y++) {
        for ($x = $x0; $x -le $x1; $x++) {
            $tot++
            if ($b[($y * $W4) + ($x * 4) + 3] -ne 0) { $n++ }
        }
    }
    return ($n / [double]$tot)
}

# --- main --------------------------------------------------------------------
if (-not (Test-Path $destDir)) { New-Item -ItemType Directory -Path $destDir | Out-Null }

$srcPaths = @((Join-Path $packDir 'layer-2.png'), (Join-Path $packDir 'layer-3.png'))
$srcBefore = @()
foreach ($p in $srcPaths) {
    if (-not (Test-Path $p)) { throw ("source missing: " + $p) }
    $fi = Get-Item $p
    $srcBefore += ($p + '|' + $fi.Length + '|' + $fi.LastWriteTimeUtc.Ticks)
}
$packPngCount = (Get-ChildItem -Path $packDir -Filter *.png).Count
if ($packPngCount -ne 8) { throw ("parallax-skyline png census fail: " + $packPngCount) }

$imgA = Build-Strip
$imgB = Build-Strip
if ($imgA.bytes.Length -ne $imgB.bytes.Length) { throw "double-bake length mismatch" }
$byteDiff = 0
for ($i = 0; $i -lt $imgA.bytes.Length; $i++) {
    if ($imgA.bytes[$i] -cne $imgB.bytes[$i]) { $byteDiff++ }
}
if ($byteDiff -ne 0) { throw ("double-bake byte mismatch: " + $byteDiff) }

$stats = Gate-Strip $imgA

$t1 = Join-Path $env:TEMP 'fv-skyline-far-a.png'
$t2 = Join-Path $env:TEMP 'fv-skyline-far-b.png'
Write-BmpFromBytes $t1 $imgA
Write-BmpFromBytes $t2 $imgB
Verify-Bytes $t1 $imgA
Verify-Bytes $t2 $imgB
$dst = Join-Path $destDir 'far-shanghai.png'
$sha = Install-Asset $t1 $t2 $dst

foreach ($p in $srcPaths) {
    $fi = Get-Item $p
    $after = ($p + '|' + $fi.Length + '|' + $fi.LastWriteTimeUtc.Ticks)
    $before = $srcBefore | Where-Object { $_ -like ($p + '|*') }
    if ($before -ne $after) { throw ("source was modified by the bake: " + $p) }
}

Write-Output ("far-layer Shanghai skyline strip 576x324: 5 named silhouettes + hash-varied lots")
Write-Output ("  lots=" + $stats.lots + " tips_row61=" + $stats.tips + " distinct_tops=" + $stats.distinct)
Write-Output ("  coverage main=" + ('{0:N3}' -f $stats.covMain) + " edge=" + ('{0:N3}' -f $stats.covEdge) + " edgeProof=" + ('{0:N3}' -f $stats.covEdgeP) + " full=" + ('{0:N3}' -f $stats.covFull))
Write-Output ("  colors rose=" + $stats.nRose + " peach=" + $stats.nPeach + " slate=" + $stats.nSlate)
Write-Output ("BAKE OK file=far-shanghai.png sha12=" + $sha.Substring(0, 12) + " first_row=61 last_row=234 deterministic=1 pack_untouched=1")
exit 0
