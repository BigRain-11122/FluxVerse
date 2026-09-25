# FluxVerse r151: bake P-38(2) micro-window facade skins (r150 route-2
# verdict C: QUANT/GAME/ANNEX have no whole-piece fit -> programmatic skins,
# r140 bake-lab-glass paradigm). Regular micro-window grid 2x3 px windows,
# floor bands 6-10 px, district functional-color accent crown line (QUANT
# gold / GAME cyan, five-color law), dark plinth base band. Windows are
# NEUTRAL UNLIT glass (no static lit windows - decor ban law; lit-rate
# belongs to the P-38(3) heat line). Sizes: quant 120x192 = 5x8u,
# game 120x120 = 5x5u, annex 48x72 = 2x3u @PPU24. Deterministic double-run
# SHA gate + pixel-class census. ASCII-only (PS5.1 GBK law).
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
$root = Join-Path $PSScriptRoot '..\..'
$outDir = Join-Path $root 'City\Assets\ArtPacks\office-towers'
New-Item -ItemType Directory -Force -Path $outDir | Out-Null
$report = Join-Path $root 'logs\devloop-r151-skinbake.txt'
$rep = New-Object System.Collections.ArrayList

# palette (documented constants; r151 preview FAIL->re-bake v2: anchor-family
# indigo bases. The dusk tint floor pins r>=56 on any base, so near-black bases
# structurally cannot reach the anchor's violet masses - the skin carries the
# anchor's own unlit-mass family (empirical bins 40,40,80 / 48,48,88 / 56,56,104
# sampled from art-target-dusk) so the warm overlay lands it in the mauve-violet
# ramp; windows stay unlit (no lit cells - decor ban law, P-38(3) owns lit-rate)
$BODY   = @{r=44;  g=44;  b=84}   # anchor indigo glass body (48,48,88 family)
$LINE   = @{r=34;  g=34;  b=64}   # floor separator line (darker band)
$WIN    = @{r=58;  g=58;  b=106}  # neutral unlit window glass (56,56,104 bin)
$PLINTH = @{r=26;  g=26;  b=50}   # base band (darker = grounding read)
$CROWN  = @{r=40;  g=40;  b=76}   # top cap
$GOLD   = @{r=196; g=150; b=44}   # QUANT accent (muted five-color gold)
$CYAN   = @{r=44;  g=168; b=192}  # GAME accent (muted five-color cyan)

function Class-At($x, $y, $w, $h, $plinthH) {
    # crown: rows 0-1 cap, row 2 accent line
    if ($y -le 1) { return 'CROWN' }
    if ($y -eq 2) { return 'ACCENT' }
    # plinth band: bottom plinthH rows, 1px line edge on top of it
    if ($y -ge ($h - $plinthH)) { return 'PLINTH' }
    if ($y -eq ($h - $plinthH - 1)) { return 'LINE' }
    # window zone: 8px floor cycle = 1px line + 3px window + 4px wall
    $cyc = $y % 8
    if ($cyc -eq 0) { return 'LINE' }
    if ($cyc -ge 1 -and $cyc -le 3) {
        $cx = $x % 4
        if ($cx -eq 1 -or $cx -eq 2) { return 'WIN' }
    }
    return 'BODY'
}

function Color-Of($cls, $accent) {
    switch ($cls) {
        'CROWN'  { return $CROWN }
        'ACCENT' { return $accent }
        'LINE'   { return $LINE }
        'WIN'    { return $WIN }
        'PLINTH' { return $PLINTH }
        default  { return $BODY }
    }
}

function Bake-Skin($name, $w, $h, $plinthH, $accent) {
    $path = Join-Path $outDir ($name + '.png')
    $bmp = New-Object System.Drawing.Bitmap($w, $h)
    $census = @{}
    for ($y = 0; $y -lt $h; $y++) {
        for ($x = 0; $x -lt $w; $x++) {
            $cls = Class-At $x $y $w $h $plinthH
            $c = Color-Of $cls $accent
            $bmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(255, $c.r, $c.g, $c.b))
            if ($census.ContainsKey($cls)) { $census[$cls]++ } else { $census[$cls] = 1 }
        }
    }
    $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    # census gates: accent only in the crown line, windows only in grid cells
    if ($census['ACCENT'] -ne $w) { throw ('FATAL: ' + $name + ' accent census ' + $census['ACCENT'] + ' != ' + $w) }
    if ($census['CROWN'] -ne (2 * $w)) { throw ('FATAL: ' + $name + ' crown census') }
    if ($census['PLINTH'] -ne ($plinthH * $w)) { throw ('FATAL: ' + $name + ' plinth census') }
    # unlit law gate: only the district accent crown line may read bright
    $bright = 0
    $bmp2 = New-Object System.Drawing.Bitmap($path)
    for ($y = 0; $y -lt $h; $y++) {
        for ($x = 0; $x -lt $w; $x++) {
            $p = $bmp2.GetPixel($x, $y)
            if ($p.A -ne 255) { throw ('FATAL: ' + $name + ' non-opaque pixel') }
            if ((($p.R + $p.G + $p.B) / 3) -gt 80) { $bright++ }
        }
    }
    $bmp2.Dispose()
    if ($bright -ne $census['ACCENT']) { throw ('FATAL: ' + $name + ' unlit law violated: bright=' + $bright + ' want accent-only ' + $census['ACCENT']) }
    $sha = (Get-FileHash -Algorithm SHA256 -LiteralPath $path).Hash
    [void]$rep.Add($name + ' ' + $w + 'x' + $h + ' accentpx=' + $census['ACCENT'] + ' winpx=' + $census['WIN'] + ' linepx=' + $census['LINE'] + ' bodypx=' + $census['BODY'] + ' sha12=' + $sha.Substring(0,12))
    return $sha
}

$shaQ = Bake-Skin 'facade-quant' 120 192 8 $GOLD
$shaG = Bake-Skin 'facade-game'  120 120 8 $CYAN
$shaA = Bake-Skin 'facade-annex'  48  72 6 $CYAN

# double-run idempotency: re-bake all three, byte-identical required
$shaQ2 = Bake-Skin 'facade-quant' 120 192 8 $GOLD
$shaG2 = Bake-Skin 'facade-game'  120 120 8 $CYAN
$shaA2 = Bake-Skin 'facade-annex'  48  72 6 $CYAN
if ($shaQ -ne $shaQ2 -or $shaG -ne $shaG2 -or $shaA -ne $shaA2) { throw 'FATAL: bake not deterministic' }
if (($shaQ -eq $shaG) -or ($shaQ -eq $shaA) -or ($shaG -eq $shaA)) { throw 'FATAL: skins must differ' }

[void]$rep.Add('BAKE OK pieces=3 deterministic=PASS unlit_law=PASS opaque=PASS')
[IO.File]::WriteAllLines($report, $rep)
$rep | ForEach-Object { Write-Output $_ }
