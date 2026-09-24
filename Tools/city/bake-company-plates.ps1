# FluxVerse City company-plate baker (r38: P-28 warped-city PSD company-name debt
# closure - DESIGN section 9 judge face "neon street signs: FLUX/CPH4/company names").
# ENCODING LAW: ASCII-only script; all plate copy is Latin ASCII brand names.
# WHY PRE-BAKE: Tuanjie has no pixel-font text path for static scene sprites; PS GDI+
# rasterizes once into transparent PNGs the scene mounts like any pack sprite
# (same law as bake-banner-text.ps1 r18/r24).
# FONT: pool FT-016 PressStart2P (OFL 1.1) read from the MiniGame Font Assets pool
# (reference-not-copy channel: the .ttf never enters this repo; baked text renders
# are our own assets - OFL use/embed is free, the Reserved Font Name only binds
# modified-font redistribution, which this pipeline never does).
# r24 bevel law re-applied per plate: glow disk -> shadow -> fill. Pixel fonts use
# SingleBitPerPixelGridFit (hard pixel edges - antialias would blur the pixel grid).
# Plate spec (16-PPU world law):
#   facade plates  : canvas W x 20 px (no legs) - mount flat on a wall face
#   rooftop plates : canvas W x 28 px (20 px body + 8 px legs) - legs 3 px wide at
#                    center +/-12 px, leg tips sink 0.125 u below the roof surface
#   W = len(text) * 8 + 12 (6 px side pad; PressStart2P advance = 8 px at size 8)
# Colors: five-color law placement - FLUX CEO white + superbody-blue glow (tower canon),
# CPH4 deep-layer blue, BIGGAME data cyan, BIGMONEY capital gold, BIGSTREAM flow
# magenta, BIGLIFE warm amber (ambient scenery channel, not a functional light).
# Determinism: same inputs -> byte-identical PNGs; the script re-bakes and compares
# SHA256 before declaring success (r24 idempotence law).
$ErrorActionPreference = "Stop"
$repo = "C:\Users\sjs20\Desktop\FluxGroup\gaming\FluxVerse"
$fontFile = "C:\Users\sjs20\Desktop\FluxGroup\gaming\MiniGame\Font Assets\FT-016_PressStart2P_lat_xiangsu_OFL\PressStart2P-Regular.ttf"
$outDir = Join-Path $repo "City\Assets\ArtPacks\warped-city\ENVIRONMENT\props\company-plates"
if (-not (Test-Path $fontFile)) { Write-Output "MISSING font: $fontFile"; exit 1 }
if (-not (Test-Path $outDir)) { New-Item -ItemType Directory -Path $outDir | Out-Null }

Add-Type -AssemblyName System.Drawing
$pfc = New-Object System.Drawing.Text.PrivateFontCollection
$pfc.AddFontFile($fontFile)
$familyName = $pfc.Families[0].Name
if ($familyName -notmatch "Press") { Write-Output "FONT FAMILY UNEXPECTED: [$familyName]"; exit 1 }

$plates = @(
    @{ id = "flux";      text = "FLUX";      w = 44; roof = $false; core = @(235, 244, 255); glow = @(96, 160, 255) },
    @{ id = "cph4";      text = "CPH4";      w = 44; roof = $false; core = @(200, 240, 255); glow = @(64, 196, 255) },
    @{ id = "biggame";   text = "BIGGAME";   w = 68; roof = $true;  core = @(190, 255, 246); glow = @(36, 224, 200) },
    @{ id = "bigmoney";  text = "BIGMONEY";  w = 76; roof = $false; core = @(255, 240, 196); glow = @(238, 186, 42) },
    @{ id = "bigstream"; text = "BIGSTREAM"; w = 84; roof = $true;  core = @(255, 214, 238); glow = @(236, 64, 152) },
    @{ id = "biglife";   text = "BIGLIFE";   w = 68; roof = $true;  core = @(255, 236, 200); glow = @(248, 164, 56) }
)

function Bake-Plate($p) {
    $W = [int]$p.w
    $H = 28; if (-not $p.roof) { $H = 20 }
    $outFile = Join-Path $outDir ("plate-" + $p.id + ".png")
    $bmp = New-Object System.Drawing.Bitmap($W, $H)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::None
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::SingleBitPerPixelGridFit
    $g.Clear([System.Drawing.Color]::Transparent)

    $font = New-Object System.Drawing.Font($familyName, 8, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    $textW = [int][Math]::Ceiling($g.MeasureString($p.text, $font).Width)
    $expectW = $p.text.Length * 8
    if ($textW -gt $expectW + 2) { throw ("glyph advance off: measured " + $textW + " expected " + $expectW) }
    $tx = [int](($W - $textW) / 2)
    $ty = 6

    # pass 1: glow disk (r=2) around frame + text - SourceOver accumulation builds a
    # soft-falloff halo in the plate hue (r24 law: bright at the tube edge)
    $glowBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(45, $p.glow[0], $p.glow[1], $p.glow[2]))
    $glowPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(45, $p.glow[0], $p.glow[1], $p.glow[2]), [single]1)
    $offs = @(@(0, 0), @(1, 0), @(-1, 0), @(0, 1), @(0, -1), @(1, 1), @(1, -1), @(-1, 1), @(-1, -1), @(2, 0), @(-2, 0), @(0, 2), @(0, -2))
    foreach ($o in $offs) {
        $ox = [int]$o[0]; $oy = [int]$o[1]
        $g.DrawRectangle($glowPen, $ox, $oy, ($W - 1), 19)
        $g.DrawString($p.text, $font, $glowBrush, ($tx + $ox), ($ty + $oy))
    }

    # pass 2: shadow - same frame + text one pixel down in near-black cool (2D depth)
    $shPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(130, 6, 9, 14), [single]1)
    $shBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(130, 6, 9, 14))
    $g.DrawRectangle($shPen, 0, 1, ($W - 1), 19)
    $g.DrawString($p.text, $font, $shBrush, $tx, ($ty + 1))

    # pass 3: fill - frame in the plate hue (tube border), text in the bright core
    $framePen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, $p.glow[0], $p.glow[1], $p.glow[2]), [single]1)
    $coreBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, $p.core[0], $p.core[1], $p.core[2]))
    $g.DrawRectangle($framePen, 0, 0, ($W - 1), 19)
    $g.DrawString($p.text, $font, $coreBrush, $tx, $ty)

    # rooftop legs: dark steel 3x8 px at center +/-12 px (tips sink below the roofline)
    if ($p.roof) {
        $legBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 38, 46, 62))
        $cx = [int]($W / 2)
        $g.FillRectangle($legBrush, ($cx - 13), 20, 3, 8)
        $g.FillRectangle($legBrush, ($cx + 10), 20, 3, 8)
        $legBrush.Dispose()
    }

    $bmp.Save($outFile, [System.Drawing.Imaging.ImageFormat]::Png)
    $font.Dispose(); $glowBrush.Dispose(); $glowPen.Dispose()
    $shPen.Dispose(); $shBrush.Dispose(); $framePen.Dispose(); $coreBrush.Dispose()
    $g.Dispose(); $bmp.Dispose()

    # self-checks on the saved file: size, text lit, halo soft, legs law
    $chk = New-Object System.Drawing.Bitmap($outFile)
    try {
        if ($chk.Width -ne $W -or $chk.Height -ne $H) { throw ("plate size mismatch " + $chk.Width + "x" + $chk.Height) }
        $solid = 0; $soft = 0; $textLit = 0
        for ($y = 0; $y -lt $H; $y++) {
            for ($x = 0; $x -lt $W; $x++) {
                $a = $chk.GetPixel($x, $y).A
                if ($a -ge 200) { $solid++ }
                elseif ($a -gt 0) { $soft++ }
                if ($a -ge 200 -and $y -ge 6 -and $y -le 13) { $textLit++ }
            }
        }
        if ($solid -lt 100) { throw ("solid pixel count too low: " + $solid) }
        if ($soft -lt 40) { throw ("glow/shadow soft pixels too low: " + $soft) }
        if ($textLit -lt 10) { throw ("text band not lit: " + $textLit) }
        $cx2 = [int]($W / 2)
        if ($p.roof) {
            $legPx = $chk.GetPixel(($cx2 - 12), 24)
            if ($legPx.A -ne 255 -or $legPx.R -ge 80) { throw ("rooftop leg missing at cx-12") }
            $legPx2 = $chk.GetPixel(($cx2 + 11), 24)
            if ($legPx2.A -ne 255 -or $legPx2.R -ge 80) { throw ("rooftop leg missing at cx+11") }
        } else {
            # facade plate: canvas is exactly the 20 px body (no legs zone exists by
            # size law) and the frame bottom line must be present
            if ($H -ne 20) { throw ("facade canvas must be 20 px, got " + $H) }
            if ($chk.GetPixel(($W - 1), 19).A -lt 200) { throw ("facade frame bottom missing") }
        }
    } finally { $chk.Dispose() }
    return @{ id = $p.id; w = $W; h = $H; solid = $solid; soft = $soft }
}

function Hash-Plates() {
    $map = @{}
    foreach ($f in (Get-ChildItem -Path $outDir -Filter "plate-*.png" | Sort-Object Name)) {
        $map[$f.Name] = (Get-FileHash -Path $f.FullName -Algorithm SHA256).Hash
    }
    return $map
}

try {
    $results = @()
    foreach ($p in $plates) { $results += ,(Bake-Plate $p) }
    $h1 = Hash-Plates
    foreach ($p in $plates) { Bake-Plate $p | Out-Null }   # determinism re-bake
    $h2 = Hash-Plates
    if ($h1.Count -ne $plates.Count) { throw ("expected " + $plates.Count + " plates, found " + $h1.Count) }
    foreach ($k in $h1.Keys) {
        if ($h1[$k] -ne $h2[$k]) { throw ("non-deterministic bake: " + $k) }
    }
    foreach ($r in $results) {
        Write-Output ("BAKE OK: plate-" + $r.id + ".png " + $r.w + "x" + $r.h + " solid=" + $r.solid + " soft=" + $r.soft)
    }
    Write-Output ("ALL " + $plates.Count + " PLATES BAKED, SHA256 STABLE ACROSS RE-BAKE, family=" + $familyName)
} catch {
    Write-Output ("BAKE FAIL: " + $_.Exception.Message)
    exit 1
}
