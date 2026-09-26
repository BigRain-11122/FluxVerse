# FluxVerse City resident UI-label baker (r178: 00:10 art-fix order T-FV-002 slice S5,
# item 4 - resident nameplates migrate from the world layer to the UI shell layer).
# ENCODING LAW: ASCII-only script; ALL CJK names live in the UTF-8 data file
# residents-street.json and are only READ here (PS5.1 GBK law, r18/r53 pattern).
# WHY PRE-BAKE: Tuanjie has no CJK pixel-font text path (r40 law) - PS GDI+
# rasterizes each resident's name ONCE into a transparent PNG the uGUI label
# pool mounts as an Image sprite (S5b engine round builds the canvas + pool).
# STYLE CANON: P-18 GUIAgent operation-layer moonlight family (r22 UiKit five
# atoms, all 2D programmatic): dark-glass gradient body + thin cool-blue stroke
# + blue-violet outer glow + slanted highlight streak + bottom inner shadow.
# Text = same three-pass bevel law as the world plates (r24/r97: glow -> shadow
# -> fill), 12 px glyphs at point origin (r38/r97 layout-rect trap avoided).
# CANVAS: uniform 80x26 px; capsule frame inset (2,2)-(77,23) = 76x22, radius 11
# (perfect capsule); longest roster plateName measures 57 px (r97 law) so
# tx = Floor((80-w)+0.5)/2 keeps >= 8 px margin both sides. UI sprites mount
# 1:1 canvas px (PpuFor row resident-labels -> 100; world PPU law does not
# apply to UI shell sprites).
# DETERMINISM: same data file -> byte-identical PNGs; in-script re-bake SHA256
# compare + inter-file distinctness (32 unique names, roster verified) + source
# read-only proof (roster + font size/mtime unchanged across the bake).
$ErrorActionPreference = "Stop"
$repo = "C:\Users\sjs20\Desktop\FluxGroup\gaming\FluxVerse"
$rosterFile = Join-Path $repo "City\Assets\Data\residents-street.json"
$fontFile = "C:\Users\sjs20\Desktop\FluxGroup\gaming\MiniGame\Font Assets\FT-011_FusionPixel_fenghe_xiangsu_multilang_OFL\fusion-pixel-12px-proportional-zh_hans.ttf"
$outDir = Join-Path $repo "City\Assets\ArtPacks\resident-labels"
if (-not (Test-Path $fontFile)) { Write-Output "MISSING font: $fontFile"; exit 1 }
if (-not (Test-Path $rosterFile)) { Write-Output "MISSING roster: $rosterFile"; exit 1 }
$rosterBefore = Get-Item $rosterFile
$fontBefore = Get-Item $fontFile

$roster = ConvertFrom-Json ([System.IO.File]::ReadAllText($rosterFile, [System.Text.Encoding]::UTF8))
$slots = @($roster.slots)
if ($slots.Count -ne 32) { Write-Output ("SLOT COUNT != 32: " + $slots.Count); exit 1 }
$piSet = @($slots | ForEach-Object { [int]$_.plateIndex } | Sort-Object)
for ($ix = 0; $ix -lt 32; $ix++) {
    if ($piSet[$ix] -ne $ix) { Write-Output ("plateIndex NOT a 0..31 bijection at " + $ix); exit 1 }
}
if (-not (Test-Path $outDir)) { New-Item -ItemType Directory -Path $outDir | Out-Null }

Add-Type -AssemblyName System.Drawing
$pfc = New-Object System.Drawing.Text.PrivateFontCollection
$pfc.AddFontFile($fontFile)
$familyName = $pfc.Families[0].Name
if ($familyName -notmatch "Fusion Pixel") { Write-Output ("FONT FAMILY UNEXPECTED: [" + $familyName + "]"); exit 1 }

$W = 80
$H = 26
# capsule geometry: inset 2,2 size 76x22, radius 11
$capX = 2; $capY = 2; $capW = 76; $capH = 22; $capR = 11

function New-CapsulePath {
    $p = New-Object System.Drawing.Drawing2D.GraphicsPath
    $d = 2 * $capR
    $p.AddArc($capX, $capY, $d, $d, 180, 90)
    $p.AddArc(($capX + $capW - $d), $capY, $d, $d, 270, 90)
    $p.AddArc(($capX + $capW - $d), ($capY + $capH - $d), $d, $d, 0, 90)
    $p.AddArc($capX, ($capY + $capH - $d), $d, $d, 90, 90)
    $p.CloseFigure()
    return $p
}
# glow offset family (r97 plates law: 13 offsets accumulate the soft falloff halo)
$offs = @(@(0, 0), @(1, 0), @(-1, 0), @(0, 1), @(0, -1), @(1, 1), @(1, -1), @(-1, 1), @(-1, -1), @(2, 0), @(-2, 0), @(0, 2), @(0, -2))

function Bake-Label($seat) {
    $name = [string]$seat.plateName
    if ($name.Trim().Length -lt 2) { throw ("plateName too short: " + $seat.go) }
    $pi2 = ([int]$seat.plateIndex).ToString("00")
    $outFile = Join-Path $outDir ("label-res-" + $pi2 + ".png")

    $bmp = New-Object System.Drawing.Bitmap($W, $H)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::None
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::SingleBitPerPixelGridFit
    $g.Clear([System.Drawing.Color]::Transparent)

    $font = New-Object System.Drawing.Font($familyName, 12, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    $fmt = [System.Drawing.StringFormat]::GenericTypographic
    $fmtW = [int][Math]::Ceiling($g.MeasureString($name, $font, [System.Drawing.PointF]::Empty, $fmt).Width)
    if ($fmtW -lt 10 -or $fmtW -gt 62) { throw ("tight width out of pill drawing area: " + $fmtW + " name-w canvas=" + $W) }
    $tx = [int][Math]::Floor((($W - $fmtW) / 2) + 0.5)    # r157 round-half-up primitive
    $ty = 7

    # pass 1: frame glow - capsule outline stroked at 13 offsets, blue-violet low alpha
    $glowPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(38, 120, 140, 255), [single]1)
    foreach ($o in $offs) {
        $ox = [int]$o[0]; $oy = [int]$o[1]
        $g.TranslateTransform([single]$ox, [single]$oy)
        $g.DrawPath($glowPen, (New-CapsulePath))
        $g.TranslateTransform([single](-$ox), [single](-$oy))
    }

    # pass 2: glass body - vertical dark-glass gradient inside the capsule (r22 atom 1)
    $bodyRect = New-Object System.Drawing.Rectangle($capX, $capY, $capW, $capH)
    $glassTop = [System.Drawing.Color]::FromArgb(200, 14, 20, 38)
    $glassBot = [System.Drawing.Color]::FromArgb(200, 24, 34, 58)
    $gb = New-Object System.Drawing.Drawing2D.LinearGradientBrush($bodyRect, $glassTop, $glassBot, [System.Drawing.Drawing2D.LinearGradientMode]::Vertical)
    $g.FillPath($gb, (New-CapsulePath))

    # pass 3: bottom inner shadow + slanted highlight streak, clipped to the capsule
    $g.SetClip((New-CapsulePath))
    $shadowBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(150, 8, 12, 24))
    $g.FillRectangle($shadowBrush, 3, 19, 74, 3)
    $streakPts = New-Object System.Drawing.Point[] 4
    $streakPts[0] = New-Object System.Drawing.Point(14, 3)
    $streakPts[1] = New-Object System.Drawing.Point(58, 3)
    $streakPts[2] = New-Object System.Drawing.Point(50, 12)
    $streakPts[3] = New-Object System.Drawing.Point(6, 12)
    $streakBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(60, 190, 214, 246))
    $g.FillPolygon($streakBrush, $streakPts)
    $g.ResetClip()

    # pass 4: capsule stroke - thin bright cool-blue rim (r22 atom 2)
    $strokePen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(235, 108, 160, 255), [single]1)
    $g.DrawPath($strokePen, (New-CapsulePath))

    # pass 5: text bevel three-pass (r24/r97 law) - glow -> shadow -> fill
    $tGlowBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(40, 120, 140, 255))
    foreach ($o in $offs) {
        $g.DrawString($name, $font, $tGlowBrush, [single]($tx + [int]$o[0]), [single]($ty + [int]$o[1]))
    }
    $tShBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(140, 6, 9, 14))
    $g.DrawString($name, $font, $tShBrush, [single]$tx, [single]($ty + 1))
    $tFillBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 202, 214, 230))
    $g.DrawString($name, $font, $tFillBrush, [single]$tx, [single]$ty)

    $bmp.Save($outFile, [System.Drawing.Imaging.ImageFormat]::Png)
    $font.Dispose(); $glowPen.Dispose(); $gb.Dispose(); $shadowBrush.Dispose()
    $streakBrush.Dispose(); $strokePen.Dispose(); $tGlowBrush.Dispose(); $tShBrush.Dispose(); $tFillBrush.Dispose()
    $g.Dispose(); $bmp.Dispose()

    # self-checks on the saved file (fail-loud, r168 law)
    $chk = New-Object System.Drawing.Bitmap($outFile)
    try {
        if ($chk.Width -ne $W -or $chk.Height -ne $H) { throw ("label size mismatch " + $chk.Width + "x" + $chk.Height) }
        if ($chk.GetPixel(0, 0).A -ne 0) { throw "corner TL not transparent" }
        if ($chk.GetPixel(($W - 1), 0).A -ne 0) { throw "corner TR not transparent" }
        if ($chk.GetPixel(0, ($H - 1)).A -ne 0) { throw "corner BL not transparent" }
        if ($chk.GetPixel(($W - 1), ($H - 1)).A -ne 0) { throw "corner BR not transparent" }
        $glass = 0; $stroke = 0; $glowRing = 0; $textLit = 0
        for ($y = 0; $y -lt $H; $y++) {
            for ($x = 0; $x -lt $W; $x++) {
                $a = $chk.GetPixel($x, $y).A
                $inside = ($x -ge 4 -and $x -le 75 -and $y -ge 4 -and $y -le 21)
                $outside = ($x -lt 2 -or $x -gt 77 -or $y -lt 2 -or $y -gt 23)
                if ($inside -and $a -ge 140 -and $a -le 230) { $glass++ }
                if ($a -ge 225) { $stroke++ }
                if ($outside -and $a -gt 0 -and $a -lt 120) { $glowRing++ }
                if ($inside -and $y -ge 6 -and $y -le 19 -and $a -ge 250) { $textLit++ }
            }
        }
        if ($glass -lt 300) { throw ("glass body band too low: " + $glass) }
        if ($stroke -lt 140) { throw ("stroke census too low: " + $stroke) }
        if ($glowRing -lt 60) { throw ("outer glow ring too low: " + $glowRing) }
        if ($textLit -lt 60) { throw ("text fill not lit (tofu suspect): " + $textLit) }
    } finally { $chk.Dispose() }
    return @{ go = [string]$seat.go; pi = [int]$seat.plateIndex; w = $fmtW; glass = $glass; stroke = $stroke; glow = $glowRing; textLit = $textLit }
}

function Hash-Labels {
    $map = @{}
    foreach ($f in (Get-ChildItem -Path $outDir -Filter "label-res-*.png" | Sort-Object Name)) {
        $map[$f.Name] = (Get-FileHash -Path $f.FullName -Algorithm SHA256).Hash
    }
    return $map
}

try {
    $report = @()
    foreach ($s in $slots) { $report += ,(Bake-Label $s) }
    $h1 = Hash-Labels
    foreach ($s in $slots) { Bake-Label $s | Out-Null }   # determinism re-bake
    $h2 = Hash-Labels
    if ($h1.Count -ne 32) { throw ("expected 32 labels, found " + $h1.Count) }
    if ($h2.Count -ne 32) { throw ("expected 32 labels on re-bake, found " + $h2.Count) }
    foreach ($k in $h1.Keys) {
        if ($h1[$k] -ne $h2[$k]) { throw ("non-deterministic bake: " + $k) }
    }
    $uniq = @($h1.Values | Sort-Object -Unique)
    if ($uniq.Count -ne 32) { throw ("label SHAs not distinct: " + $uniq.Count) }
    # source read-only proof
    $rosterAfter = Get-Item $rosterFile
    $fontAfter = Get-Item $fontFile
    if ($rosterAfter.Length -ne $rosterBefore.Length -or $rosterAfter.LastWriteTimeUtc -ne $rosterBefore.LastWriteTimeUtc) { throw "roster file mutated during bake" }
    if ($fontAfter.Length -ne $fontBefore.Length -or $fontAfter.LastWriteTimeUtc -ne $fontBefore.LastWriteTimeUtc) { throw "font file mutated during bake" }
    foreach ($r in ($report | Sort-Object { $_.pi })) {
        Write-Output ("BAKE OK: label-res-" + $r.pi.ToString("00") + ".png go=" + $r.go + " name-w=" + $r.w + " glass=" + $r.glass + " stroke=" + $r.stroke + " glow=" + $r.glow + " textLit=" + $r.textLit)
    }
    foreach ($k in ($h1.Keys | Sort-Object)) {
        Write-Output ("SHA12 " + $k + "=" + $h1[$k].Substring(0, 12))
    }
    Write-Output ("ALL 32 RESIDENT UI LABELS BAKED, SHA256 STABLE ACROSS RE-BAKE, 32 DISTINCT, family=" + $familyName)
} catch {
    Write-Output ("BAKE FAIL: " + $_.Exception.Message)
    exit 1
}
