# Tools/city/bake-canopies.ps1
# DevLoop r149 - D-20260925-09 route B prefab: crop striped awning bands from
# AA-016.02 Market storefront singles (48px tier) into standalone canopy sprites.
# Deterministic GDI+ bake: clean-subrect crop (zero resample, non-canopy pixels
# at block edges trimmed), whole-stripe edge trim (sub-half stubs dropped) and a
# synthetic 1px frame ring (c1 dimmed 45%) so every colorway ships self-contained.
# ASCII-only body (PS5.1 GBK law); CJK source path via UTF-8 data file (r53 law).
# Sources read-only (L2 direct-use; purchase authorized 2026-09-22; U121 light tier).
# Output: City/Assets/ArtPacks/canopies @ PPU24 (48px-tier divisor law, r37).
# Report: logs/devloop-r149-canopybake.txt (detected rects = drift evidence).

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$toolsDir = $PSScriptRoot
$repoRoot = Split-Path -Parent (Split-Path -Parent $toolsDir)
$srcList  = Join-Path $toolsDir 'canopy-sources.txt'
$outDir   = Join-Path $repoRoot 'City\Assets\ArtPacks\canopies'
$reportF  = Join-Path $repoRoot 'logs\devloop-r149-canopybake.txt'

$srcDir = @((Get-Content -LiteralPath $srcList -Encoding UTF8) | Where-Object { $_.Trim().Length -gt 0 })[0]
if (-not (Test-Path -LiteralPath $srcDir)) { throw ('SRC-DIR-MISSING ' + $srcDir) }

# selected variants: outName|srcName  (colorway pool evidence comes from the full report pass;
# pool = 3 colorways x 2 canvas-offset families, pair-duplicated: green 1-4 / orange 5-8 / brown 9-12)
$selected = @(
    'canopy-green.png|ME_Singles_Shopping_Center_and_Markets_48x48_Market_Small_1.png',
    'canopy-orange.png|ME_Singles_Shopping_Center_and_Markets_48x48_Market_Small_5.png',
    'canopy-brown.png|ME_Singles_Shopping_Center_and_Markets_48x48_Market_Small_9.png'
)

function New-BmpFrom($path) {
    $bytes = [IO.File]::ReadAllBytes($path)
    $ms = New-Object IO.MemoryStream(,$bytes)
    $img = [System.Drawing.Image]::FromStream($ms)
    $bmp = New-Object System.Drawing.Bitmap($img)
    $img.Dispose()
    $ms.Dispose()
    return $bmp
}

function Test-Fam($p, $famList) {
    if ($p.A -lt 16) { return $false }
    foreach ($c in $famList) {
        if (([Math]::Abs($p.R - $c.R) -le 25) -and ([Math]::Abs($p.G - $c.G) -le 25) -and ([Math]::Abs($p.B - $c.B) -le 25)) { return $true }
    }
    return $false
}

function Get-MedianOf($list) {
    $s = @($list | Sort-Object)
    if ($s.Count -eq 0) { return 0 }
    return $s[[int](($s.Count - 1) / 2)]
}

# Row classes: 1=light stripe, 2=saturated stripe, 0=other/transparent.
function Get-PxClass($p) {
    if ($p.A -lt 16) { return 0 }
    if (($p.R -ge 195) -and ($p.G -ge 195) -and ($p.B -ge 175)) { return 1 }
    $mx = [Math]::Max($p.R, [Math]::Max($p.G, $p.B))
    $mn = [Math]::Min($p.R, [Math]::Min($p.G, $p.B))
    if (($mx - $mn) -gt 40) { return 2 }
    return 0
}

function KeyToColor($k) {
    $r = [int]$k.Substring(0, 3)
    $g = [int]$k.Substring(3, 3)
    $b = [int]$k.Substring(6, 3)
    return [System.Drawing.Color]::FromArgb(255, $r, $g, $b)
}

# Detect the striped-awning band and its clean crop rect.
# Pipeline: row gate -> core run -> mid-row transitions (80% dense window)
#   -> color families sampled INSIDE the window (no wall margin pollution)
#   -> column pre-trim over core rows -> good-row block around core mid row
#   -> dark-perimeter outline extension (row-level uniform-dark law)
#   -> final column trim over the kept rows.
function Get-StripeRect($bmp) {
    $w = $bmp.Width; $h = $bmp.Height
    $ok = @{}
    for ($y = 100; $y -lt $h; $y++) {
        $light = 0; $sat = 0; $alt = 0; $prev = 0
        for ($x = 60; $x -lt $w; $x++) {
            $px = $bmp.GetPixel($x, $y)
            $cls = Get-PxClass $px
            if ($cls -eq 1) { $light++ } elseif ($cls -eq 2) { $sat++ }
            if (($cls -ne 0) -and ($prev -ne 0) -and ($cls -ne $prev)) { $alt++ }
            if ($cls -ne 0) { $prev = $cls }
        }
        # stripe-pair law light>=0.5*sat kills brick mortar rows, window streaks, sign rows
        if (($light -ge 20) -and ($sat -ge 20) -and ($alt -ge 10) -and ($light * 2 -ge $sat)) { $ok[$y] = $true }
    }
    if ($ok.Count -lt 15) { return @{ found = $false; why = 'rows<15' } }
    $ys = @($ok.Keys | Sort-Object)
    $bestS = $ys[0]; $bestE = $ys[0]; $curS = $ys[0]; $prevY = $ys[0]
    foreach ($y in $ys) {
        if (($y - $prevY) -gt 3) {
            if (($prevY - $curS) -gt ($bestE - $bestS)) { $bestS = $curS; $bestE = $prevY }
            $curS = $y
        }
        $prevY = $y
    }
    if (($prevY - $curS) -gt ($bestE - $bestS)) { $bestS = $curS; $bestE = $prevY }
    $ry0 = $bestS; $ry1 = $bestE
    if (($ry1 - $ry0 + 1) -lt 15) { return @{ found = $false; why = 'run<15' } }
    $ym = [int](($ry0 + $ry1) / 2)

    # transitions on mid row; densest window holding >=80% of them (drops sign-edge stragglers)
    $txs = New-Object System.Collections.ArrayList
    $prev = 0
    for ($x = 60; $x -lt $w; $x++) {
        $px = $bmp.GetPixel($x, $ym)
        $cls = Get-PxClass $px
        if (($cls -ne 0) -and ($prev -ne 0) -and ($cls -ne $prev)) { [void]$txs.Add($x) }
        if ($cls -ne 0) { $prev = $cls }
    }
    if ($txs.Count -lt 8) { return @{ found = $false; why = 'tx<8' } }
    $n = $txs.Count
    $keep = [int][Math]::Ceiling($n * 0.8)
    if ($keep -lt 8) { $keep = 8 }
    $winS = $txs[0]; $winE = $txs[$n - 1]; $winW = $winE - $winS
    for ($i = 0; ($i + $keep) -le $n; $i++) {
        $j = $i + $keep - 1
        $ww = $txs[$j] - $txs[$i]
        if ($ww -lt $winW) { $winW = $ww; $winS = $txs[$i]; $winE = $txs[$j] }
    }
    $midCol = [int](($winS + $winE) / 2)
    $cx0 = [Math]::Max(1, $winS - 10)
    $cx1 = [Math]::Min(($w - 2), ($winE + 10))
    $fx0 = [Math]::Max(1, $winS - 2)
    $fx1 = [Math]::Min(($w - 2), ($winE + 2))

    # color families, two-pass: pass 1 samples inside the transition window only to
    # bootstrap the column pre-trim; pass 2 re-samples strictly inside the trimmed
    # awning columns x core rows. Single-pass sampling once pulled left-margin wall
    # colors (mauve 165,72,115) into the family set and legitimized wall rows (r149
    # instrumented verdict) - the re-sample excludes wall/window colors structurally.
    $tally = @{}
    $area = 0
    for ($y = $ry0; $y -le $ry1; $y++) {
        for ($x = $fx0; $x -le $fx1; $x++) {
            $p = $bmp.GetPixel($x, $y)
            if ($p.A -lt 16) { continue }
            $area++
            $k = ('{0:D3}{1:D3}{2:D3}' -f $p.R, $p.G, $p.B)
            if ($tally.ContainsKey($k)) { $tally[$k]++ } else { $tally[$k] = 1 }
        }
    }
    if ($area -lt 200) { return @{ found = $false; why = 'area<200' } }
    $fams1 = New-Object System.Collections.ArrayList
    foreach ($e in $tally.GetEnumerator()) {
        if (($e.Value * 33) -ge $area) { [void]$fams1.Add((KeyToColor $e.Key)) }
    }

    # column pre-trim over CORE rows: awning x extent (wall/window margin columns are bad)
    $badColCore = @{}
    for ($x = $cx0; $x -le $cx1; $x++) {
        $bad = 0
        for ($y = $ry0; $y -le $ry1; $y++) {
            $px = $bmp.GetPixel($x, $y)
            $inFam = Test-Fam $px $fams1
            if (-not $inFam) { $bad++ }
        }
        $badColCore[$x] = $bad
    }
    if ($badColCore[$midCol] -gt 2) { return @{ found = $false; why = 'midcol-bad' } }
    $kx0 = $midCol; $kx1 = $midCol
    while (($kx0 -gt $cx0) -and ($badColCore[($kx0 - 1)] -le 2)) { $kx0-- }
    while (($kx1 -lt $cx1) -and ($badColCore[($kx1 + 1)] -le 2)) { $kx1++ }

    # pass 2: re-sample families strictly inside [kx0..kx1] x core rows
    $tally2 = @{}
    $area2 = 0
    for ($y = $ry0; $y -le $ry1; $y++) {
        for ($x = $kx0; $x -le $kx1; $x++) {
            $p = $bmp.GetPixel($x, $y)
            if ($p.A -lt 16) { continue }
            $area2++
            $k = ('{0:D3}{1:D3}{2:D3}' -f $p.R, $p.G, $p.B)
            if ($tally2.ContainsKey($k)) { $tally2[$k]++ } else { $tally2[$k] = 1 }
        }
    }
    if ($area2 -lt 200) { return @{ found = $false; why = 'area2<200' } }
    $fams = New-Object System.Collections.ArrayList
    $c1 = $null; $c1n = 0; $c2 = $null; $c2n = 0
    foreach ($e in $tally2.GetEnumerator()) {
        $col = KeyToColor $e.Key
        if (($e.Value * 33) -ge $area2) { [void]$fams.Add($col) }
        $r = $col.R; $g = $col.G; $b = $col.B
        if (($r -ge 195) -and ($g -ge 195) -and ($b -ge 175)) {
            if ($e.Value -gt $c2n) { $c2n = $e.Value; $c2 = $col }
        } else {
            if ($e.Value -gt $c1n) { $c1n = $e.Value; $c1 = $col }
        }
    }
    if (($null -eq $c1) -or ($null -eq $c2)) { return @{ found = $false; why = 'no-c1c2' } }

    # column re-trim with the strict family set (posts/frame columns survive here)
    $badColCore2 = @{}
    for ($x = $cx0; $x -le $cx1; $x++) {
        $bad = 0
        for ($y = $ry0; $y -le $ry1; $y++) {
            $px = $bmp.GetPixel($x, $y)
            $inFam = Test-Fam $px $fams
            if (-not $inFam) { $bad++ }
        }
        $badColCore2[$x] = $bad
    }
    $kx0 = $midCol; $kx1 = $midCol
    while (($kx0 -gt $cx0) -and ($badColCore2[($kx0 - 1)] -le 2)) { $kx0-- }
    while (($kx1 -lt $cx1) -and ($badColCore2[($kx1 + 1)] -le 2)) { $kx1++ }

    # good-row block around the core mid row, scored over the awning columns only
    $cy0 = [Math]::Max(0, $ry0 - 4)
    $cy1 = [Math]::Min(($h - 1), ($ry1 + 4))
    $badRow = @{}
    for ($y = $cy0; $y -le $cy1; $y++) {
        $bad = 0
        for ($x = $kx0; $x -le $kx1; $x++) {
            $px = $bmp.GetPixel($x, $y)
            $inFam = Test-Fam $px $fams
            if (-not $inFam) { $bad++ }
        }
        $badRow[$y] = $bad
    }
    $goodRows = New-Object System.Collections.ArrayList
    for ($y = $cy0; $y -le $cy1; $y++) { if ($badRow[$y] -le 2) { [void]$goodRows.Add($y) } }
    $y0 = -1; $y1 = -1
    for ($i = 0; $i -lt $goodRows.Count; $i++) {
        if ($goodRows[$i] -ne $ym) { continue }
        $y0 = $goodRows[$i]; $y1 = $goodRows[$i]; $j = $i
        while (($j -gt 0) -and (($goodRows[$j] - $goodRows[($j - 1)]) -le 1)) { $j--; $y0 = $goodRows[$j] }
        $j = $i
        while (($j -lt ($goodRows.Count - 1)) -and (($goodRows[($j + 1)] - $goodRows[$j]) -le 1)) { $j++; $y1 = $goodRows[$j] }
        break
    }
    if ($y0 -lt 0) { return @{ found = $false; why = 'midrow-bad' } }
    if (($y1 - $y0 + 1) -lt 15) { return @{ found = $false; why = 'block<15' } }

    # dark-perimeter outline extension (<=2 rows each side): row must be >=80% one dark
    # color inside the awning columns; wall/window rows are bright or mixed -> stop.
    for ($k = 0; $k -lt 3; $k++) {
        $yy = $y0 - 1
        if ($yy -lt 0) { break }
        $t2 = @{}; $tot = 0
        for ($x = $kx0; $x -le $kx1; $x++) {
            $p = $bmp.GetPixel($x, $yy)
            if ($p.A -lt 16) { continue }
            $tot++
            $k2 = ('{0:D3}{1:D3}{2:D3}' -f $p.R, $p.G, $p.B)
            if ($t2.ContainsKey($k2)) { $t2[$k2]++ } else { $t2[$k2] = 1 }
        }
        $topK = $null; $topN = 0
        foreach ($e2 in $t2.GetEnumerator()) { if ($e2.Value -gt $topN) { $topN = $e2.Value; $topK = $e2.Key } }
        if (($null -eq $topK) -or (($topN * 5) -lt ($tot * 4))) { break }
        $oc = KeyToColor $topK
        $omx = [Math]::Max($oc.R, [Math]::Max($oc.G, $oc.B))
        if ($omx -ge 135) { break }
        $isFam = Test-Fam $oc $fams
        if (-not $isFam) { [void]$fams.Add($oc) }
        $y0 = $yy
    }
    for ($k = 0; $k -lt 3; $k++) {
        $yy = $y1 + 1
        if ($yy -ge $h) { break }
        $t2 = @{}; $tot = 0
        for ($x = $kx0; $x -le $kx1; $x++) {
            $p = $bmp.GetPixel($x, $yy)
            if ($p.A -lt 16) { continue }
            $tot++
            $k2 = ('{0:D3}{1:D3}{2:D3}' -f $p.R, $p.G, $p.B)
            if ($t2.ContainsKey($k2)) { $t2[$k2]++ } else { $t2[$k2] = 1 }
        }
        $topK = $null; $topN = 0
        foreach ($e2 in $t2.GetEnumerator()) { if ($e2.Value -gt $topN) { $topN = $e2.Value; $topK = $e2.Key } }
        if (($null -eq $topK) -or (($topN * 5) -lt ($tot * 4))) { break }
        $oc = KeyToColor $topK
        $omx = [Math]::Max($oc.R, [Math]::Max($oc.G, $oc.B))
        if ($omx -ge 135) { break }
        $isFam = Test-Fam $oc $fams
        if (-not $isFam) { [void]$fams.Add($oc) }
        $y1 = $yy
    }

    # final column trim over the kept rows
    $badCol = @{}
    for ($x = $cx0; $x -le $cx1; $x++) {
        $bad = 0
        for ($y = $y0; $y -le $y1; $y++) {
            $px = $bmp.GetPixel($x, $y)
            $inFam = Test-Fam $px $fams
            if (-not $inFam) { $bad++ }
        }
        $badCol[$x] = $bad
    }
    if ($badCol[$midCol] -gt 2) { return @{ found = $false; why = 'midcol2-bad' } }
    $x0 = $midCol; $x1 = $midCol
    while (($x0 -gt $cx0) -and ($badCol[($x0 - 1)] -le 2)) { $x0-- }
    while (($x1 -lt $cx1) -and ($badCol[($x1 + 1)] -le 2)) { $x1++ }

    $rw = $x1 - $x0 + 1
    $rh = $y1 - $y0 + 1
    return @{
        found = $true; x0 = $x0; y0 = $y0; w = $rw; h = $rh
        c1 = $c1; c2 = $c2; fams = $fams; nTx = $n; coreRows = ($ry1 - $ry0 + 1)
    }
}

# ---- report pass: all Market_Small variants (colorway pool evidence) ----
$rep = New-Object System.Collections.ArrayList
$srcFiles = Get-ChildItem -LiteralPath $srcDir -File -Filter '*Market_Small*' | Sort-Object Name
[void]$rep.Add('src-count=' + $srcFiles.Count)
foreach ($f in $srcFiles) {
    $bmp = New-BmpFrom $f.FullName
    $r = Get-StripeRect $bmp
    if (-not $r.found) {
        [void]$rep.Add($f.Name + '|NO_BAND|' + $r.why)
    } else {
        $line = ($f.Name + '|x={0} y={1} w={2} h={3}|tx={4} core={5}|c1={6},{7},{8}|c2={9},{10},{11}') -f `
            $r.x0, $r.y0, $r.w, $r.h, $r.nTx, $r.coreRows, $r.c1.R, $r.c1.G, $r.c1.B, $r.c2.R, $r.c2.G, $r.c2.B
        [void]$rep.Add($line)
    }
    $bmp.Dispose()
}

# ---- bake pass: selected variants, fail-loud gates + double-crop idempotence ----
if (-not (Test-Path -LiteralPath $outDir)) { New-Item -ItemType Directory -Path $outDir -Force | Out-Null }
$utf8 = New-Object System.Text.UTF8Encoding($false)
$shaSeen = New-Object System.Collections.ArrayList
foreach ($e in $selected) {
    $parts = $e.Split('|')
    $outName = $parts[0]; $srcName = $parts[1]
    $srcPath = Join-Path $srcDir $srcName
    if (-not (Test-Path -LiteralPath $srcPath)) { throw ('SRC-MISSING ' + $srcName) }
    $bmp = New-BmpFrom $srcPath
    $r = Get-StripeRect $bmp
    if (-not $r.found) { throw ('NO-BAND ' + $srcName + ' ' + $r.why) }
    if (($r.w -lt 80) -or ($r.w -gt 170)) { throw ('W-GATE ' + $srcName + ' w=' + $r.w) }
    if (($r.h -lt 16) -or ($r.h -gt 48)) { throw ('H-GATE ' + $srcName + ' h=' + $r.h) }

    # whole-stripe edge trim: mid-row run analysis; drop sub-half-width stripe stubs
    # at both ends (r149 multimodal verdict: half-cut end stripes betray the crop origin
    # and break the stripe pitch when tiled; trim to whole-stripe boundaries).
    $midYsrc = $r.y0 + [int](($r.h - 1) / 2)
    $runCls = New-Object System.Collections.ArrayList
    $runW = New-Object System.Collections.ArrayList
    $prevCls = 0
    for ($i = 0; $i -lt $r.w; $i++) {
        $px = $bmp.GetPixel(($r.x0 + $i), $midYsrc)
        $cls = Get-PxClass $px
        if ($cls -eq 0) { $cls = $prevCls }
        if ($runW.Count -eq 0) { [void]$runCls.Add($cls); [void]$runW.Add(1); $prevCls = $cls }
        elseif ($cls -eq $prevCls) { $runW[($runW.Count - 1)] = $runW[($runW.Count - 1)] + 1 }
        else { [void]$runCls.Add($cls); [void]$runW.Add(1); $prevCls = $cls }
    }
    $l1 = New-Object System.Collections.ArrayList
    $l2 = New-Object System.Collections.ArrayList
    for ($i = 0; $i -lt $runW.Count; $i++) {
        if ($runCls[$i] -eq 1) { [void]$l1.Add($runW[$i]) } elseif ($runCls[$i] -eq 2) { [void]$l2.Add($runW[$i]) }
    }
    $trimPx = 0
    if (($runW.Count -ge 3) -and ($runCls[0] -ne 0)) {
        if ($runCls[0] -eq 1) { $med = Get-MedianOf $l1 } else { $med = Get-MedianOf $l2 }
        if (($med -gt 0) -and (($runW[0] * 2) -lt $med)) { $r.x0 += $runW[0]; $r.w -= $runW[0]; $trimPx += $runW[0] }
    }
    $li = $runW.Count - 1
    if (($runW.Count -ge 3) -and ($runCls[$li] -ne 0)) {
        if ($runCls[$li] -eq 1) { $med = Get-MedianOf $l1 } else { $med = Get-MedianOf $l2 }
        if (($med -gt 0) -and (($runW[$li] * 2) -lt $med)) { $r.w -= $runW[$li]; $trimPx += $runW[$li] }
    }
    if (($r.w -lt 78) -or ($r.h -lt 16)) { throw ('TRIM-GATE ' + $srcName + ' w=' + $r.w + ' h=' + $r.h) }

    $rect = [System.Drawing.Rectangle]::new($r.x0, $r.y0, $r.w, $r.h)
    $crop = $bmp.Clone($rect, $bmp.PixelFormat)
    # post-crop gate: every kept pixel in a canopy family; >=8 alternations on mid row
    $midY = [int](($r.h - 1) / 2)
    $bad = 0
    for ($y = 0; $y -lt $r.h; $y++) {
        for ($x = 0; $x -lt $r.w; $x++) {
            $px = $crop.GetPixel($x, $y)
            $inFam = Test-Fam $px $r.fams
            if (-not $inFam) { $bad++ }
        }
    }
    if (($bad * 200) -gt ($r.w * $r.h)) { throw ('CROP-CONTAM ' + $outName + ' bad=' + $bad) }
    $alt = 0; $prev = 0
    for ($x = 0; $x -lt $r.w; $x++) {
        $px = $crop.GetPixel($x, $midY)
        $cls = Get-PxClass $px
        if (($cls -ne 0) -and ($prev -ne 0) -and ($cls -ne $prev)) { $alt++ }
        if ($cls -ne 0) { $prev = $cls }
    }
    if ($alt -lt 8) { throw ('ALT-GATE ' + $outName + ' alt=' + $alt) }

    # synthetic 1px frame ring (self-baked outline, c1 dimmed to 45%): uniform
    # self-contained canopy sprite (r149 multimodal verdict: unframed slabs melt
    # into light walls; source outlines are inconsistent across colorways).
    $fr = [int]($r.c1.R * 0.45)
    $fgc = [int]($r.c1.G * 0.45)
    $fbc = [int]($r.c1.B * 0.45)
    $frameCol = [System.Drawing.Color]::FromArgb(255, $fr, $fgc, $fbc)
    $fw = $r.w + 2
    $fh = $r.h + 2
    function New-Frame($srcCrop) {
        $bm = New-Object System.Drawing.Bitmap($fw, $fh, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
        $g = [System.Drawing.Graphics]::FromImage($bm)
        $g.Clear([System.Drawing.Color]::Transparent)
        $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::NearestNeighbor
        $brush = New-Object System.Drawing.SolidBrush ($frameCol)
        $g.FillRectangle($brush, 0, 0, $fw, 1)
        $g.FillRectangle($brush, 0, ($fh - 1), $fw, 1)
        $g.FillRectangle($brush, 0, 0, 1, $fh)
        $g.FillRectangle($brush, ($fw - 1), 0, 1, $fh)
        $g.DrawImage($srcCrop, 1, 1)
        $g.Dispose()
        $brush.Dispose()
        return $bm
    }
    $outPath = Join-Path $outDir $outName
    $outBmp = New-Frame $crop
    $outBmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
    # second independent compose+save must be byte-identical (determinism gate)
    $tmpPath = $outPath + '.tmp'
    $outBmp2 = New-Frame $crop
    $outBmp2.Save($tmpPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $sha1 = (Get-FileHash -Algorithm SHA256 $outPath).Hash
    $sha2 = (Get-FileHash -Algorithm SHA256 $tmpPath).Hash
    Remove-Item -LiteralPath $tmpPath -Force
    if ($sha1 -ne $sha2) { throw ('IDEMPOTENCE-FAIL ' + $outName) }
    if ($shaSeen.Contains($sha1)) { throw ('DUPLICATE-OUTPUT ' + $outName) }
    [void]$shaSeen.Add($sha1)
    $line2 = ('BAKED ' + $outName + '|' + $srcName + '|x={0} y={1} w={2} h={3}|out={4}x{5}|alt={6}|bad={7}|trim={8}|sha12={9}') -f `
        $r.x0, $r.y0, $r.w, $r.h, $fw, $fh, $alt, $bad, $trimPx, $sha1.Substring(0, 12)
    [void]$rep.Add($line2)
    $crop.Dispose(); $outBmp.Dispose(); $outBmp2.Dispose()
    $bmp.Dispose()
}

$after = (Get-ChildItem -LiteralPath $srcDir -File -Filter '*Market_Small*').Count
[void]$rep.Add('src-count-after=' + $after)
[void]$rep.Add('END OK')
[IO.File]::WriteAllText($reportF, ($rep -join "`r`n") + "`r`n", $utf8)
Write-Output ('BAKE OK report=' + $reportF)
