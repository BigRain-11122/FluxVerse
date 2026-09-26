# FluxVerse City resident identity-card baker (r108: r106 work-order slice B,
# P-69 leftover, cards data slice, zero editor budget). The r43 bake source
# (residents-identity.json) is a DELETED file: the street canon
# residents-street.json (r98, 32 seats) is the single identity substrate and
# ALL 32 seats get a card - including the single anchor seat (slot 26,
# C-00001 tower-flank honor seat), whose card carries the P-58 human-source
# disclosure marker (anchor) instead of the narrative marker. Card layout law
# is ZERO-CHANGE (168x136 canvas, rows, bevel law, moonlight palette, PPU 24).
# r106 seat-adaptation laws implemented here:
#   - footer marker derives from the layer field: narrative -> XU SHI CENG
#     (narrative layer, CODEX sec.1, U+53D9 U+4E8B U+5C42) / anchor -> REN
#     YUAN MAO DIAN (human-source anchor, U+4EBA U+6E90 U+951A U+70B9)
#   - age sentinel law: age < 0 (census null, anchor seat) renders the
#     block/age row as BLOCK ONLY - no age is invented for a human anchor
#   - district pass-through: the anchor keeps its census-empty district
#     (raw state, nothing invented); district is manifest-only (never drawn)
# Cards bake into City/CardData/ OUTSIDE Assets/ (the r18 BannerData
# byte-path law: runtime File.ReadAllBytes + LoadImage never touches the
# importer - same family as r42 BubbleData). The engine mounts the UiKit
# GUIAgent glass shell behind this text layer, so the bake owns GLYPHS ONLY -
# transparent margins, no frame, no glass.
# ENCODING LAW: ASCII-only script. ALL CJK content lives in the UTF-8 street
# data file; the four CJK literals the layout itself needs are code-point
# built (SUI U+5C81 / narrative marker / anchor marker). Separators are
# ASCII " / ".
# FONT: pool FT-011 Fusion Pixel 12px proportional zh_hans (OFL 1.1) read from
# the MiniGame Font Assets pool (reference-not-copy channel, r38/r40 law).
# 12px body rows at native size; the name row renders the SAME face at 24px =
# exact 2x integer scale (pixel faces stay crisp, no resampling).
# Hinting SingleBitPerPixelGridFit (r38 law: antialias would blur the pixel
# grid); point-origin DrawString ONLY (r40 GDI+ trap: layout-rect +
# GenericTypographic silently renders ZERO pixels when the font line box
# exceeds the rect).
# BEVEL LAW (r24, adapted): name = warm glow disk (SourceOver accumulation)
# -> near-black cool shadow (+2px) -> warm gold fill (moonlight warm accent,
# like the r38 gold CJK plates). Body rows = +1px shadow -> pale cool core.
# Footer = dim cool steel fill (honesty marker is small print, never a neon
# light).
# Determinism: same street file -> byte-identical PNGs; in-script double-bake
# SHA256 compare gate (r24/r38/r40 idempotence law). Fail-loud self checks per
# card (dims / gold name band / per-row lit / footer lit / transparent
# corners). Roster gates mirror the r107 barks baker: 32 slots in order, C-#####
# ids, exactly ONE anchor seat, all others narrative.
# NAME-ROW MARGIN ADAPTATION (r108, science-judgment note for commit): the r106
# audit estimated the widest name ("Dasheng" mixed-script anchor name) at 24px
# ~138px, but the GDI+ GenericTypographic measure is 156px - over the r43
# aesthetic gate (W-18=150). The zero-change layout law holds (168x136 canvas,
# row y positions, 24px = exact 2x name scale, bevel law all unchanged), so
# the gate for the NAME ROW only relaxes to W-8=160: the physical no-clip
# bound is the r24 glow ring (+-3px) -> text width <= 162, leaving 4px clean
# margins at 156. Body rows keep the r43 W-18=150 aesthetic margin.
$ErrorActionPreference = "Stop"
$repo = Split-Path (Split-Path $PSScriptRoot -Parent) -Parent   # Tools\city -> repo
$group = Split-Path (Split-Path $repo -Parent) -Parent           # -> FluxGroup root
$fontFile = Join-Path $group "gaming\MiniGame\Font Assets\FT-011_FusionPixel_fenghe_xiangsu_multilang_OFL\fusion-pixel-12px-proportional-zh_hans.ttf"
$streetFile = Join-Path $repo "City\Assets\Data\residents-street.json"
$outDir = Join-Path $repo "City\CardData"
if (-not (Test-Path $fontFile)) { Write-Output "MISSING font: $fontFile"; exit 1 }
if (-not (Test-Path $streetFile)) { Write-Output "MISSING street data: $streetFile"; exit 1 }
if (-not (Test-Path $outDir)) { New-Item -ItemType Directory -Path $outDir | Out-Null }

# CJK layout literals via code points (ASCII law)
$sui = [string][char]0x5C81
$narr = [string][char]0x53D9 + [string][char]0x4E8B + [string][char]0x5C42
$anchorMark = [string][char]0x4EBA + [string][char]0x6E90 + [string][char]0x951A + [string][char]0x70B9

$street = ConvertFrom-Json ([System.IO.File]::ReadAllText($streetFile, [System.Text.Encoding]::UTF8))
if ($null -eq $street.slots) { Write-Output "PARSE FAIL: no slots array"; exit 1 }
$slots = @($street.slots)
if ($slots.Count -ne 32) { Write-Output ("SLOT COUNT != 32: " + $slots.Count); exit 1 }
$anchorSeen = 0
for ($i = 0; $i -lt 32; $i++) {
    $e = $slots[$i]
    if ([int]$e.slot -ne $i) { Write-Output ("street slot order drift at " + $i); exit 1 }
    $lay = [string]$e.layer
    if ($lay -eq 'anchor') { $anchorSeen++ }
    elseif ($lay -ne 'narrative') { Write-Output ("street slot " + $i + " unknown layer: " + $lay); exit 1 }
    if ([string]$e.id -notmatch '^C-\d{5}$') { Write-Output ("bad census id at slot " + $i + ": " + $e.id); exit 1 }
}
if ($anchorSeen -ne 1) { Write-Output ("street roster must hold exactly ONE anchor seat, got " + $anchorSeen); exit 1 }

Add-Type -AssemblyName System.Drawing
$pfc = New-Object System.Drawing.Text.PrivateFontCollection
$pfc.AddFontFile($fontFile)
$familyName = $pfc.Families[0].Name
if ($familyName -notmatch "Fusion Pixel") { Write-Output ("FONT FAMILY UNEXPECTED: [" + $familyName + "]"); exit 1 }

$W = 168; $H = 136
$NamePx = 24; $BodyPx = 12
$NameY = 10; $R2Y = 46; $R3Y = 64; $R4Y = 82; $FootY = 112

# glow offset rings (r24 accumulation law): name gets r=1..3, 20 offsets
$offsName = @(
    @(1,0), @(-1,0), @(0,1), @(0,-1),
    @(2,0), @(-2,0), @(0,2), @(0,-2), @(2,2), @(2,-2), @(-2,2), @(-2,-2),
    @(3,0), @(-3,0), @(0,3), @(0,-3), @(3,3), @(3,-3), @(-3,3), @(-3,-3)
)

function Draw-Row($g, $text, $font, $brush, $y, $shadowBrush, $shadowDy, $glowBrush, $offs, $sizePx, $maxW) {
    $fmt = [System.Drawing.StringFormat]::GenericTypographic
    $fmtW = [int][Math]::Ceiling($g.MeasureString($text, $font, [System.Drawing.PointF]::Empty, $fmt).Width)
    if ($fmtW -lt 4 -or $fmtW -gt $maxW) { throw ("row width out of card: " + $fmtW + " (max " + $maxW + ") [" + $text.Length + " chars]") }
    $tx = [int][Math]::Round((($W - $fmtW) / 2))
    if ($null -ne $glowBrush) {
        foreach ($o in $offs) {
            $g.DrawString($text, $font, $glowBrush, [single]($tx + [int]$o[0]), [single]($y + [int]$o[1]))
        }
    }
    if ($null -ne $shadowBrush) {
        $g.DrawString($text, $font, $shadowBrush, [single]$tx, [single]($y + $shadowDy))
    }
    $g.DrawString($text, $font, $brush, [single]$tx, [single]$y)
    return $fmtW
}

function Bake-Card($slot) {
    $outFile = Join-Path $outDir ("card-res-" + $slot.slot.ToString("00") + ".png")
    $bmp = New-Object System.Drawing.Bitmap($W, $H)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::None
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::SingleBitPerPixelGridFit
    $g.Clear([System.Drawing.Color]::Transparent)

    $fontName = New-Object System.Drawing.Font($familyName, $NamePx, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    $fontBody = New-Object System.Drawing.Font($familyName, $BodyPx, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)

    # palette (moonlight canon: cool body, one warm accent - P-18 law)
    $goldBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 234, 194, 90))
    $goldGlow = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(40, 234, 184, 70))
    $shBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(140, 6, 9, 14))
    $coreBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 202, 214, 230))
    $footBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 138, 150, 172))

    # row 1: name - warm glow -> +2px shadow -> gold fill (margin gate W-8, r108)
    # r212: widths discarded ($null =), dead w-vars digested (PSA high-value layer)
    $null = Draw-Row $g $slot.name $fontName $goldBrush $NameY $shBrush 2 $goldGlow $offsName $NamePx ($W - 8)
    # row 2: profession - +1px shadow -> pale cool core
    $null = Draw-Row $g $slot.profession $fontBody $coreBrush $R2Y $shBrush 1 $null $null $BodyPx ($W - 18)
    # row 3: block / age+SUI - age sentinel law (r106): age<0 (census null,
    # anchor seat) renders BLOCK ONLY, no age is invented
    $ageVal = [int]$slot.age
    if ($ageVal -lt 0) {
        $ageLine = [string]$slot.block
    } else {
        $ageLine = [string]$slot.block + " / " + [string]$ageVal + $sui
    }
    $null = Draw-Row $g $ageLine $fontBody $coreBrush $R3Y $shBrush 1 $null $null $BodyPx ($W - 18)
    # row 4: faction / species (ASCII passthrough)
    $fsLine = [string]$slot.faction + " / " + [string]$slot.species
    $null = Draw-Row $g $fsLine $fontBody $coreBrush $R4Y $shBrush 1 $null $null $BodyPx ($W - 18)
    # row 5: census id / layer-derived honesty marker (r106: narrative ->
    # narrative layer, anchor -> human-source anchor; P-58 disclosure on card)
    $mark = $narr
    if ([string]$slot.layer -eq 'anchor') { $mark = $anchorMark }
    $footLine = [string]$slot.id + " / " + $mark
    $null = Draw-Row $g $footLine $fontBody $footBrush $FootY $null 0 $null $null $BodyPx ($W - 18)

    $bmp.Save($outFile, [System.Drawing.Imaging.ImageFormat]::Png)
    $fontName.Dispose(); $fontBody.Dispose()
    $goldBrush.Dispose(); $goldGlow.Dispose(); $shBrush.Dispose()
    $coreBrush.Dispose(); $footBrush.Dispose()
    $g.Dispose(); $bmp.Dispose()

    # fail-loud self checks on the saved file
    $chk = New-Object System.Drawing.Bitmap($outFile)
    try {
        if ($chk.Width -ne $W -or $chk.Height -ne $H) { throw ("card size mismatch " + $chk.Width + "x" + $chk.Height) }
        $gold = 0; $r2 = 0; $r3 = 0; $r4 = 0; $foot = 0; $solid = 0
        for ($y = 0; $y -lt $H; $y++) {
            for ($x = 0; $x -lt $W; $x++) {
                $p = $chk.GetPixel($x, $y)
                if ($p.A -ge 200) {
                    $solid++
                    if ($y -ge $NameY -and $y -le ($NameY + $NamePx) -and $p.R -ge 200 -and ($p.R - $p.B) -ge 60) { $gold++ }
                    if ($y -ge $R2Y -and $y -le ($R2Y + $BodyPx)) { $r2++ }
                    if ($y -ge $R3Y -and $y -le ($R3Y + $BodyPx)) { $r3++ }
                    if ($y -ge $R4Y -and $y -le ($R4Y + $BodyPx)) { $r4++ }
                    if ($y -ge $FootY -and $y -le ($FootY + $BodyPx)) { $foot++ }
                }
            }
        }
        if ($gold -lt 120) { throw ("name gold band too thin (tofu suspect): " + $gold) }
        if ($r2 -lt 16) { throw ("profession row not lit: " + $r2) }
        if ($r3 -lt 16) { throw ("block/age row not lit: " + $r3) }
        if ($r4 -lt 16) { throw ("faction row not lit: " + $r4) }
        if ($foot -lt 14) { throw ("footer not lit (honesty marker suspect): " + $foot) }
        if ($solid -lt 400) { throw ("total solid pixels too low: " + $solid) }
        if ($chk.GetPixel(0, 0).A -ne 0 -or $chk.GetPixel(($W - 1), 0).A -ne 0 -or $chk.GetPixel(0, ($H - 1)).A -ne 0 -or $chk.GetPixel(($W - 1), ($H - 1)).A -ne 0) { throw "corner not transparent" }
    } finally { $chk.Dispose() }
    return @{ slot = $slot.slot; go = $slot.go; layer = [string]$slot.layer; gold = $gold; solid = $solid }
}

function Hash-Cards() {
    $map = @{}
    foreach ($f in (Get-ChildItem -Path $outDir -Filter "card-res-*.png" | Sort-Object Name)) {
        $map[$f.Name] = (Get-FileHash -Path $f.FullName -Algorithm SHA256).Hash
    }
    return $map
}

try {
    $results = @()
    $manifest = @()
    $n = 0
    foreach ($s in $slots) {
        $r = Bake-Card $s
        $results += ,$r
        $manifest += ,@{
            slot = $s.slot; go = $s.go; id = $s.id; name = $s.name
            district = $s.district; block = $s.block; profession = $s.profession
            faction = $s.faction; species = $s.species; age = $s.age; layer = $s.layer
            file = ("card-res-" + $s.slot.ToString("00") + ".png"); w = $W; h = $H
        }
        $n++
        Write-Output ("CARD " + $s.slot.ToString("00") + " OK layer=" + $r.layer + " gold=" + $r.gold + " solid=" + $r.solid)
    }
    $h1 = Hash-Cards
    $n = 0
    foreach ($s in $slots) {
        Bake-Card $s | Out-Null   # determinism re-bake
        $n++
        if (($n % 8) -eq 0) { Write-Output ("REBAKE " + $n + "/32") }
    }
    $h2 = Hash-Cards
    if ($h1.Count -ne 32) { throw ("expected 32 cards, found " + $h1.Count) }
    foreach ($k in $h1.Keys) {
        if ($h1[$k] -ne $h2[$k]) { throw ("non-deterministic bake: " + $k) }
    }
    $anchorCards = 0
    foreach ($r in $results) { if ($r.layer -eq 'anchor') { $anchorCards++ } }
    if ($anchorCards -ne 1) { throw ("manifest must hold exactly ONE anchor card, got " + $anchorCards) }
    $mf = @{
        law = "resident-cards/0.1"; ppu = 24; pxW = $W; pxH = $H
        font = "FT-011 fusion-pixel-12px-proportional-zh_hans (OFL 1.1, reference-not-copy)"
        tier = "moonlight-annotation"; files = $manifest
    }
    [System.IO.File]::WriteAllText((Join-Path $outDir "manifest.json"), (ConvertTo-Json $mf -Depth 4), (New-Object System.Text.UTF8Encoding($false)))

    $mfHash = (Get-FileHash -Path (Join-Path $outDir "manifest.json") -Algorithm SHA256).Hash
    Write-Output ("ALL 32 IDENTITY CARDS BAKED (31 narrative + 1 anchor), SHA256 STABLE ACROSS RE-BAKE, family=" + $familyName + " manifest_sha256=" + $mfHash.Substring(0, 16))
} catch {
    Write-Output ("BAKE FAIL: " + $_.Exception.Message)
    exit 1
}
