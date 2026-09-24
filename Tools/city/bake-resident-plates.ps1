# FluxVerse City resident nameplate baker (r40: P-22(2) presentation slice 1 -
# the 12 street residents get their census-name tags, consuming the r39 identity
# pool substrate Assets/Data/residents-identity.json; bigmoney-style interior
# click faces / P-23(2) barks stay later slices).
# ENCODING LAW: ASCII-only script; ALL CJK names live in the UTF-8 data file
# residents-identity.json and are only READ here (PS5.1 GBK law, r18 pattern).
# WHY PRE-BAKE: Tuanjie has no CJK pixel-font text path for static scene sprites;
# PS GDI+ rasterizes once into transparent PNGs the scene mounts like any pack
# sprite (same law as bake-banner-text.ps1 r18/r24 and bake-company-plates.ps1 r38).
# FONT: pool FT-011 Fusion Pixel 12px proportional zh_hans (OFL 1.1) read from the
# MiniGame Font Assets pool (reference-not-copy channel: the .ttf never enters this
# repo; baked text renders are our own assets - OFL use/embed is free, the Reserved
# Font Name only binds modified-font redistribution, which this pipeline never does).
# Hinting: SingleBitPerPixelGridFit - the font is a 12px grid pixel face, hard pixel
# edges are the point (r38 law: antialias would blur the pixel grid).
# Plate spec: uniform 46x20 px canvas. Text = 12 px glyphs at point origin
# (tx, 4) where tx centers the TIGHT measured width (GenericTypographic metrics,
# longest name measures 40 px) inside the canvas - the r38 point-origin law.
# GDI+ TRAP (found the hard way this round): DrawString with a LAYOUT RECT + the
# GenericTypographic format renders ZERO pixels when the font's line box exceeds
# the rect height (12 px rect vs ~15 px line box) - a silent empty bake, not a
# clip. Point-origin drawing is the proven path (r38 + first-run ink probe).
# Colors = moonlight canon annotation channel (P-18 GUIAgent note face): frame dim
# cool steel 86,108,138 / text core pale cool 202,214,230 / glow cool blue 96,152,255
# (ambient scenery, five-color law untouched - tags are info plates, not neon).
# Mounting: PPU 24 -> 1.917x0.833 world units, center = resident center + (0, 1.567)
# = head top + 0.15u gap + half plate (ResidentTagRules derives; this script bakes
# pixels only). Determinism: same data file -> byte-identical PNGs; re-bake SHA256
# compare gate (r24/r38 idempotence law).
# r97 EXTENSION (P-68/P-72 batch1 street pool): a SECOND group of 32 plates is
# baked from Assets/ArtPacks/residents-atlas/manifest.jsonl (the group pipeline's
# census-derived 32-resident batch, fa7d951) as plate-res-b1-00..31.png. CJK
# primary-name law: when the full census name (CJK + latin transliteration)
# overflows the 46px canvas the plate renders the leading CJK run only - the
# latin form is an auxiliary transliteration, the manifest keeps the full name
# (identity data untouched). Five batch1 primary names still exceed the legacy
# 40px drawing area (census names carry generation suffixes - e.g. a CJK middle
# dot or an index dash - honesty law: never abbreviate a registered name), so
# the b1 group bakes on a WIDER uniform canvas 66x20 px (longest primary 57px
# + margins; @PPU24 = 2.75x0.833u). The 12 legacy plates keep baking unchanged
# (46x20) until the r98 seat-table swap retires them (discard-on-record law
# P-21(4)); both groups carry their own determinism re-bake gate.
$ErrorActionPreference = "Stop"
$repo = "C:\Users\sjs20\Desktop\FluxGroup\gaming\FluxVerse"
$fontFile = "C:\Users\sjs20\Desktop\FluxGroup\gaming\MiniGame\Font Assets\FT-011_FusionPixel_fenghe_xiangsu_multilang_OFL\fusion-pixel-12px-proportional-zh_hans.ttf"
$identityFile = Join-Path $repo "City\Assets\Data\residents-identity.json"
$outDir = Join-Path $repo "City\Assets\ArtPacks\residents-crowd\nameplates"
if (-not (Test-Path $fontFile)) { Write-Output "MISSING font: $fontFile"; exit 1 }
if (-not (Test-Path $identityFile)) { Write-Output "MISSING identity data: $identityFile"; exit 1 }
if (-not (Test-Path $outDir)) { New-Item -ItemType Directory -Path $outDir | Out-Null }

# identity load: 12 slots, slot i == ResidentRules index i (r39 law). Only ASCII
# fields are printed; the CJK name flows data -> GDI+, never into script literals.
$identity = ConvertFrom-Json ([System.IO.File]::ReadAllText($identityFile, [System.Text.Encoding]::UTF8))
if ($null -eq $identity.slots) { Write-Output "PARSE FAIL: no slots array"; exit 1 }
if ($identity.slots.Count -ne 12) { Write-Output ("SLOT COUNT != 12: " + $identity.slots.Count); exit 1 }

# r97 batch1 rows: 32 paper-doll residents (group atlas manifest, census-derived).
$b1File = Join-Path $repo "City\Assets\ArtPacks\residents-atlas\manifest.jsonl"
if (-not (Test-Path $b1File)) { Write-Output "MISSING batch1 manifest: $b1File"; exit 1 }
function Get-PrimaryName([string]$full) {
    $lead = [regex]::Match($full, '^[^A-Za-z]+').Value.Trim()
    if ($lead.Length -ge 2) { return $lead }
    return $full.Trim()
}
$b1Rows = New-Object System.Collections.Generic.List[object]
$bi = 0
foreach ($ln in [System.IO.File]::ReadAllLines($b1File, [System.Text.Encoding]::UTF8)) {
    if (-not $ln.Trim()) { continue }
    $r = ConvertFrom-Json $ln
    $b1Rows.Add((New-Object psobject -Property @{ slot = $bi; go = [string]$r.id; name = (Get-PrimaryName ([string]$r.name)) }))
    $bi++
}
if ($b1Rows.Count -ne 32) { Write-Output ("B1 ROW COUNT != 32: " + $b1Rows.Count); exit 1 }

Add-Type -AssemblyName System.Drawing
$pfc = New-Object System.Drawing.Text.PrivateFontCollection
$pfc.AddFontFile($fontFile)
$familyName = $pfc.Families[0].Name
if ($familyName -notmatch "Fusion Pixel") { Write-Output ("FONT FAMILY UNEXPECTED: [" + $familyName + "]"); exit 1 }

$H = 20

function Bake-Plate($slot, $prefix, $cw) {
    $outFile = Join-Path $outDir ($prefix + $slot.slot.ToString("00") + ".png")
    $bmp = New-Object System.Drawing.Bitmap($cw, $H)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::None
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::SingleBitPerPixelGridFit
    $g.Clear([System.Drawing.Color]::Transparent)

    $font = New-Object System.Drawing.Font($familyName, 12, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    # tight metrics for centering math (GenericTypographic is a SHARED static - only
    # used stateless for MeasureString here, never mutated; the empty-render trap
    # only bites the layout-rect DrawString overload, which this pipeline avoids)
    $fmt = [System.Drawing.StringFormat]::GenericTypographic
    $fmtW = [int][Math]::Ceiling($g.MeasureString($slot.name, $font, [System.Drawing.PointF]::Empty, $fmt).Width)
    if ($fmtW -lt 8 -or $fmtW -gt ($cw - 6)) { throw ("tight width out of drawing area: " + $fmtW + " canvas=" + $cw) }
    $tx = [int][Math]::Round((($cw - $fmtW) / 2))    # deterministic banker's round
    $ty = 4

    # pass 1: glow disk (r=2) around frame + text - SourceOver accumulation builds
    # the soft-falloff halo (r24 law: bright at the tube edge, one pass at the rim)
    $glowR = 96; $glowG = 152; $glowB = 255
    $glowBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(40, $glowR, $glowG, $glowB))
    $glowPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(40, $glowR, $glowG, $glowB), [single]1)
    $offs = @(@(0, 0), @(1, 0), @(-1, 0), @(0, 1), @(0, -1), @(1, 1), @(1, -1), @(-1, 1), @(-1, -1), @(2, 0), @(-2, 0), @(0, 2), @(0, -2))
    foreach ($o in $offs) {
        $ox = [int]$o[0]; $oy = [int]$o[1]
        $g.DrawRectangle($glowPen, $ox, $oy, ($cw - 1), 19)
        $g.DrawString($slot.name, $font, $glowBrush, [single]($tx + $ox), [single]($ty + $oy))
    }

    # pass 2: shadow - frame + text one pixel down in near-black cool (2D depth cue)
    $shPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(140, 6, 9, 14), [single]1)
    $shBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(140, 6, 9, 14))
    $g.DrawRectangle($shPen, 0, 1, ($cw - 1), 19)
    $g.DrawString($slot.name, $font, $shBrush, [single]$tx, [single]($ty + 1))

    # pass 3: fill - frame in dim cool steel, text in the pale cool core
    $framePen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 86, 108, 138), [single]1)
    $coreBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 202, 214, 230))
    $g.DrawRectangle($framePen, 0, 0, ($cw - 1), 19)
    $g.DrawString($slot.name, $font, $coreBrush, [single]$tx, [single]$ty)

    $bmp.Save($outFile, [System.Drawing.Imaging.ImageFormat]::Png)
    $font.Dispose()
    $glowBrush.Dispose(); $glowPen.Dispose()
    $shPen.Dispose(); $shBrush.Dispose()
    $framePen.Dispose(); $coreBrush.Dispose()
    $g.Dispose(); $bmp.Dispose()

    # self-checks on the saved file: size, text band lit, frame corners, soft halo
    $chk = New-Object System.Drawing.Bitmap($outFile)
    try {
        if ($chk.Width -ne $cw -or $chk.Height -ne $H) { throw ("plate size mismatch " + $chk.Width + "x" + $chk.Height) }
        $solid = 0; $soft = 0; $textLit = 0
        for ($y = 0; $y -lt $H; $y++) {
            for ($x = 0; $x -lt $cw; $x++) {
                $a = $chk.GetPixel($x, $y).A
                if ($a -ge 200) { $solid++ }
                elseif ($a -gt 0) { $soft++ }
                if ($a -ge 200 -and $y -ge 4 -and $y -le 15) { $textLit++ }
            }
        }
        if ($solid -lt 120) { throw ("solid pixel count too low: " + $solid) }
        if ($soft -lt 40) { throw ("glow/shadow soft pixels too low: " + $soft) }
        if ($textLit -lt 60) { throw ("text band not lit (tofu suspect): " + $textLit) }
        if ($chk.GetPixel(0, 0).A -lt 200) { throw "frame corner TL missing" }
        if ($chk.GetPixel(($cw - 1), 19).A -lt 200) { throw "frame corner BR missing" }
    } finally { $chk.Dispose() }
    return @{ slot = $slot.slot; go = $slot.go; solid = $solid; soft = $soft; textLit = $textLit }
}

function Hash-Plates($rx) {
    $map = @{}
    foreach ($f in (Get-ChildItem -Path $outDir -Filter "plate-res-*.png" | Sort-Object Name | Where-Object { $_.Name -match $rx })) {
        $map[$f.Name] = (Get-FileHash -Path $f.FullName -Algorithm SHA256).Hash
    }
    return $map
}

try {
    $results = @()
    foreach ($s in $identity.slots) { $results += ,(Bake-Plate $s "plate-res-" 46) }
    $b1results = @()
    foreach ($s in $b1Rows) { $b1results += ,(Bake-Plate $s "plate-res-b1-" 66) }
    $h1 = Hash-Plates '^plate-res-\d\d\.png$'
    $b1h1 = Hash-Plates '^plate-res-b1-\d\d\.png$'
    foreach ($s in $identity.slots) { Bake-Plate $s "plate-res-" 46 | Out-Null }   # determinism re-bake
    foreach ($s in $b1Rows) { Bake-Plate $s "plate-res-b1-" 66 | Out-Null }
    $h2 = Hash-Plates '^plate-res-\d\d\.png$'
    $b1h2 = Hash-Plates '^plate-res-b1-\d\d\.png$'
    if ($h1.Count -ne 12) { throw ("expected 12 plates, found " + $h1.Count) }
    if ($b1h1.Count -ne 32) { throw ("expected 32 b1 plates, found " + $b1h1.Count) }
    foreach ($k in $h1.Keys) {
        if ($h1[$k] -ne $h2[$k]) { throw ("non-deterministic bake: " + $k) }
    }
    foreach ($k in $b1h1.Keys) {
        if ($b1h1[$k] -ne $b1h2[$k]) { throw ("non-deterministic bake: " + $k) }
    }
    foreach ($r in $results) {
        Write-Output ("BAKE OK: plate-res-" + $r.slot.ToString("00") + ".png go=" + $r.go + " solid=" + $r.solid + " soft=" + $r.soft + " textLit=" + $r.textLit)
    }
    foreach ($r in $b1results) {
        Write-Output ("BAKE OK: plate-res-b1-" + $r.slot.ToString("00") + ".png go=" + $r.go + " solid=" + $r.solid + " soft=" + $r.soft + " textLit=" + $r.textLit)
    }
    Write-Output ("ALL 12+32 RESIDENT PLATES BAKED, SHA256 STABLE ACROSS RE-BAKE, family=" + $familyName)
} catch {
    Write-Output ("BAKE FAIL: " + $_.Exception.Message)
    exit 1
}
