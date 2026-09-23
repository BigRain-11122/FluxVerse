# FluxVerse City resident bark-bubble baker (r42: P-23(2) render slice - the last
# open face of the cognition wiring; consumes the r41 barks pool substrate).
# WHAT: every UNIQUE pool line (residents-barks.json holds 6 axes x 12 contexts
# x 8 lines = 576, zero duplicates by the r41 bake gate) is rasterized ONCE into
# a speech-bubble PNG. The engine cannot rasterize CJK at runtime (no font asset
# - r18 law), and the pick law is day-granular (any bucket line may surface on
# any future date), so the ONLY complete set is per-line, not per-(resident,ctx):
# 576 textures cover every sentence the md5 law can ever pick. Line->texture is
# keyed by KEY LAW = md5(UTF8(line)) first 4 digest bytes as 8 lowercase hex -
# the SAME law as C# ResidentBarks.LineKey (single source; the proof gates all
# 576 keys byte-for-byte against the C# side - dual-implementation, r39 law).
# OUTPUT PATH: City/BubbleData/ OUTSIDE Assets/ on purpose - the BannerData
# byte-path precedent (r18): runtime File.ReadAllBytes + LoadImage never touches
# the importer, so the bake must not grow an imported twin under Assets/ (meta
# noise). manifest.json = the dual-impl face (line, key, file, w, chars) the
# editor proof re-derives keys from; also the width table for mount-overlap math.
# ENCODING LAW: ASCII-only script; ALL CJK lives in the UTF-8 data file and is
# only READ here (PS5.1 GBK law, r18/r40 pattern). Font = pool FT-011 Fusion
# Pixel 12px proportional zh_hans (OFL 1.1, reference-not-copy - the .ttf never
# enters this repo; same channel as the r40 nameplates).
# CANVAS LAW: uniform height 36 px (body 0..27 + tail 27..35), width = tight text
# width + 2x12 pad, floored at 64 (min readable bubble). PPU 24 -> the 12 px CJK
# glyphs render 0.5 u tall, byte-identical in size to the r40 nameplate glyphs
# (same font, same divisor - one street type system). Colors = moonlight
# annotation canon (P-18/r40): frame dim cool steel 86,108,138 / text core pale
# cool 202,214,230 / glow cool blue 96,152,255 a40 / shadow near-black cool
# 6,9,14 a140 / interior dark glass 12,18,28 a150 (ambient info plate, five-color
# law untouched, never a functional light). Draw passes = r24/r38/r40 law:
# glow disk (13 offsets) -> shadow (+1 px) -> fill (interior, frame, text, tail).
# Pixel checks use LockBits (576 files x GetPixel loops would take minutes in
# PS; byte-array sampling keeps the fail-loud gates affordable). Determinism:
# re-bake SHA256 map + manifest bytes identical (r24/r38/r40 idempotence law).
$ErrorActionPreference = "Stop"
$repo = "C:\Users\sjs20\Desktop\FluxGroup\gaming\FluxVerse"
$fontFile = "C:\Users\sjs20\Desktop\FluxGroup\gaming\MiniGame\Font Assets\FT-011_FusionPixel_fenghe_xiangsu_multilang_OFL\fusion-pixel-12px-proportional-zh_hans.ttf"
$barksFile = Join-Path $repo "City\Assets\Data\residents-barks.json"
$outDir = Join-Path $repo "City\BubbleData"
$manifestFile = Join-Path $outDir "manifest.json"
if (-not (Test-Path $fontFile)) { Write-Output "MISSING font: $fontFile"; exit 1 }
if (-not (Test-Path $barksFile)) { Write-Output "MISSING barks data: $barksFile"; exit 1 }
if (-not (Test-Path $outDir)) { New-Item -ItemType Directory -Path $outDir | Out-Null }

$barks = ConvertFrom-Json ([System.IO.File]::ReadAllText($barksFile, [System.Text.Encoding]::UTF8))
if ($null -eq $barks.axes -or $null -eq $barks.residents) { Write-Output "PARSE FAIL: barks json shape"; exit 1 }

# collect unique lines; zero-dup is an r41 bake gate, re-asserted here because
# this bake's file count law depends on it (a dup would double-bake one texture)
$lineMap = @{}   # line -> key
$keyMap = @{}    # key -> line (collision gate)
$total = 0
foreach ($a in $barks.axes) {
    foreach ($c in $a.contexts) {
        foreach ($l in $c.lines) {
            $total++
            $md5 = [System.Security.Cryptography.MD5]::Create()
            $h = $md5.ComputeHash([System.Text.Encoding]::UTF8.GetBytes($l))
            $key = ([System.BitConverter]::ToString($h, 0, 4)).Replace("-", "").ToLower()
            if ($keyMap.ContainsKey($key) -and $keyMap[$key] -ne $l) { throw ("KEY COLLISION: " + $key) }
            if (-not $lineMap.ContainsKey($l)) { $lineMap[$l] = $key; $keyMap[$key] = $l }
        }
    }
}
if ($total -ne 576) { throw ("pool line count != 576: " + $total) }
if ($lineMap.Count -ne $total) { throw ("duplicate lines in pool: " + $lineMap.Count + " unique of " + $total) }
foreach ($l in $lineMap.Keys) {
    $chars = $l.Length
    if ($chars -lt 4 -or $chars -gt 24) { throw ("line char law broken: [" + $chars + "]") }
    if ($l -match "[0-9]") { throw ("digit in pool line (honesty law)") }
}

Add-Type -AssemblyName System.Drawing
$pfc = New-Object System.Drawing.Text.PrivateFontCollection
$pfc.AddFontFile($fontFile)
$familyName = $pfc.Families[0].Name
if ($familyName -notmatch "Fusion Pixel") { Write-Output ("FONT FAMILY UNEXPECTED: [" + $familyName + "]"); exit 1 }

$H = 36        # uniform canvas height: body 0..27, tail 27..35
$padX = 12
$font = New-Object System.Drawing.Font($familyName, 12, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
$fmt = [System.Drawing.StringFormat]::GenericTypographic

$steel = [System.Drawing.Color]::FromArgb(255, 86, 108, 138)
$core = [System.Drawing.Color]::FromArgb(255, 202, 214, 230)
$glowC = [System.Drawing.Color]::FromArgb(40, 96, 152, 255)
$shadowC = [System.Drawing.Color]::FromArgb(140, 6, 9, 14)
$glass = [System.Drawing.Color]::FromArgb(150, 12, 18, 28)
$offs = @(@(0, 0), @(1, 0), @(-1, 0), @(0, 1), @(0, -1), @(1, 1), @(1, -1), @(-1, 1), @(-1, -1), @(2, 0), @(-2, 0), @(0, 2), @(0, -2))

function Make-Poly($pts) {
    $arr = New-Object System.Drawing.Point[] ($pts.Count)
    for ($i = 0; $i -lt $pts.Count; $i++) {
        $arr[$i] = New-Object System.Drawing.Point -ArgumentList ([int]$pts[$i][0]), ([int]$pts[$i][1])
    }
    return $arr
}

function Bake-One($line, $key) {
    $probe = [System.Drawing.Graphics]::FromImage((New-Object System.Drawing.Bitmap(4, 4)))
    $fmtW = [int][Math]::Ceiling($probe.MeasureString($line, $font, [System.Drawing.PointF]::Empty, $fmt).Width)
    $probe.Dispose()
    if ($fmtW -lt 8 -or $fmtW -gt 320) { throw ("tight width out of law: " + $fmtW) }
    $W = $fmtW + (2 * $padX)
    if ($W -lt 64) { $W = 64 }
    $tx = [int][Math]::Round((($W - $fmtW) / 2))
    $ty = 7
    $cx = [int][Math]::Round($W / 2)
    $outFile = Join-Path $outDir ("bark-" + $key + ".png")

    $bmp = New-Object System.Drawing.Bitmap($W, $H)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::None
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::SingleBitPerPixelGridFit
    $g.Clear([System.Drawing.Color]::Transparent)

    $glowBrush = New-Object System.Drawing.SolidBrush($glowC)
    $glowPen = New-Object System.Drawing.Pen($glowC, [single]1)
    $shBrush = New-Object System.Drawing.SolidBrush($shadowC)
    $shPen = New-Object System.Drawing.Pen($shadowC, [single]1)
    $framePen = New-Object System.Drawing.Pen($steel, [single]1)
    $coreBrush = New-Object System.Drawing.SolidBrush($core)
    $glassBrush = New-Object System.Drawing.SolidBrush($glass)
    $tailSteel = Make-Poly @(@(($cx - 6), 27), @(($cx + 6), 27), @($cx, 35))
    $tailGlass = Make-Poly @(@(($cx - 5), 28), @(($cx + 5), 28), @($cx, 34))

    # pass 1: glow disk (r=2) around frame + tail + text - SourceOver accumulation
    foreach ($o in $offs) {
        $ox = [int]$o[0]; $oy = [int]$o[1]
        $g.DrawRectangle($glowPen, $ox, $oy, ($W - 1), 27)
        $g.FillPolygon($glowBrush, (Make-Poly @(@(($cx - 6 + $ox), (27 + $oy)), @(($cx + 6 + $ox), (27 + $oy)), @(($cx + $ox), (35 + $oy)))))
        $g.DrawString($line, $font, $glowBrush, [single]($tx + $ox), [single]($ty + $oy))
    }
    # pass 2: shadow - frame + tail + text one pixel down (2D depth cue)
    $g.DrawRectangle($shPen, 0, 1, ($W - 1), 27)
    $g.FillPolygon($shBrush, (Make-Poly @(@(($cx - 6), 28), @(($cx + 6), 28), @($cx, 36))))
    $g.DrawString($line, $font, $shBrush, [single]$tx, [single]($ty + 1))
    # pass 3: fill - dark glass interior, steel frame, core text, tail over the frame base
    $g.FillRectangle($glassBrush, 1, 1, ($W - 2), 26)
    $g.DrawRectangle($framePen, 0, 0, ($W - 1), 27)
    $g.DrawString($line, $font, $coreBrush, [single]$tx, [single]$ty)
    $g.FillPolygon($framePen.Brush, $tailSteel)
    $g.FillPolygon($glassBrush, $tailGlass)

    $bmp.Save($outFile, [System.Drawing.Imaging.ImageFormat]::Png)
    $glowBrush.Dispose(); $glowPen.Dispose(); $shBrush.Dispose(); $shPen.Dispose()
    $framePen.Dispose(); $coreBrush.Dispose(); $glassBrush.Dispose()
    $g.Dispose(); $bmp.Dispose()
    return @{ line = $line; key = $key; w = $W; chars = $line.Length }
}

# LockBits byte sampling: alpha at (x,y) = bytes[y*stride + x*4 + 3] (BGRA)
function Check-One($entry) {
    $path = Join-Path $outDir $entry.file
    $bmp = New-Object System.Drawing.Bitmap($path)
    try {
        if ($bmp.Width -ne $entry.w -or $bmp.Height -ne $H) { throw ("size mismatch " + $bmp.Width + "x" + $bmp.Height + " want " + $entry.w + "x" + $H) }
        $rect = New-Object System.Drawing.Rectangle(0, 0, $bmp.Width, $bmp.Height)
        $d = $bmp.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::ReadOnly, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
        $bytes = New-Object byte[] ($d.Stride * $d.Height)
        [System.Runtime.InteropServices.Marshal]::Copy($d.Scan0, $bytes, 0, $bytes.Length)
        $stride = $d.Stride
        $bmp.UnlockBits($d)
        $cx = [int][Math]::Round($entry.w / 2)
        # frame corners solid
        foreach ($p in @(@(0, 0), @(($entry.w - 1), 0), @(0, 27), @(($entry.w - 1), 27))) {
            if ($bytes[($p[1] * $stride) + ($p[0] * 4) + 3] -lt 200) { throw ("frame corner missing: " + $p[0] + "," + $p[1]) }
        }
        # outside the bubble stays transparent (below body, away from tail)
        if ($bytes[(30 * $stride) + (0 * 4) + 3] -ne 0) { throw "non-bubble area not transparent" }
        # text band lit (tofu guard): sample 4 rows x every 4th px
        $lit = 0
        foreach ($y in @(8, 10, 12, 14)) {
            for ($x = 2; $x -lt ($entry.w - 2); $x += 4) {
                if ($bytes[($y * $stride) + ($x * 4) + 3] -ge 200) { $lit++ }
            }
        }
        if ($lit -lt 8) { throw ("text band not lit (tofu suspect): " + $lit) }
        # tail column: the speech tail reaches down toward the nameplate
        $tail = 0
        for ($y = 29; $y -le 34; $y++) {
            if ($bytes[($y * $stride) + ($cx * 4) + 3] -ge 100) { $tail++ }
        }
        if ($tail -lt 3) { throw ("tail missing at cx=" + $cx + ": " + $tail) }
        # dark-glass interior present under the text band
        if ($bytes[(20 * $stride) + (3 * 4) + 3] -lt 100) { throw "interior glass missing" }
    } finally { $bmp.Dispose() }
}

try {
    # stale sweep: pool lines removed upstream must not leave orphan textures
    $keep = @{}
    foreach ($l in $lineMap.Keys) { $keep[("bark-" + $lineMap[$l] + ".png")] = $true }
    foreach ($f in (Get-ChildItem -Path $outDir -Filter "bark-*.png")) {
        if (-not $keep.ContainsKey($f.Name)) { Remove-Item -LiteralPath $f.FullName; Write-Output ("STALE REMOVED: " + $f.Name) }
    }

    $entries = New-Object System.Collections.ArrayList
    foreach ($l in $lineMap.Keys) { [void]$entries.Add((Bake-One $l $lineMap[$l])) }
    $sorted = @($entries | Sort-Object key)
    if ($sorted.Count -ne 576) { throw ("baked file count != 576: " + $sorted.Count) }

    $manifest = [PSCustomObject]@{
        law   = "resident-bubble-bake/1"
        ppu   = 24
        pxH   = $H
        padX  = $padX
        font  = "FT-011 fusion-pixel-12px-proportional-zh_hans"
        files = @($sorted | ForEach-Object { [PSCustomObject]@{ key = $_.key; file = ("bark-" + $_.key + ".png"); w = $_.w; chars = $_.chars; line = $_.line } })
    }
    $mjson = ConvertTo-Json $manifest -Depth 4
    [System.IO.File]::WriteAllText($manifestFile, $mjson, (New-Object System.Text.UTF8Encoding($false)))

    # pixel self-checks (LockBits sampling) on every baked file - fail-loud
    foreach ($e in $sorted) {
        $map = @{ line = $e.line; key = $e.key; w = $e.w; chars = $e.chars; file = ("bark-" + $e.key + ".png") }
        Check-One $map
    }

    # determinism: re-bake the whole set, SHA256 map + manifest bytes must hold
    $h1 = @{}
    foreach ($f in (Get-ChildItem -Path $outDir -Filter "bark-*.png" | Sort-Object Name)) { $h1[$f.Name] = (Get-FileHash -Path $f.FullName -Algorithm SHA256).Hash }
    $m1 = [System.IO.File]::ReadAllText($manifestFile, [System.Text.Encoding]::UTF8)
    foreach ($l in $lineMap.Keys) { Bake-One $l $lineMap[$l] | Out-Null }
    $h2 = @{}
    foreach ($f in (Get-ChildItem -Path $outDir -Filter "bark-*.png" | Sort-Object Name)) { $h2[$f.Name] = (Get-FileHash -Path $f.FullName -Algorithm SHA256).Hash }
    [System.IO.File]::WriteAllText($manifestFile, $mjson, (New-Object System.Text.UTF8Encoding($false)))
    $m2 = [System.IO.File]::ReadAllText($manifestFile, [System.Text.Encoding]::UTF8)
    if ($h1.Count -ne 576) { throw ("expected 576 textures, found " + $h1.Count) }
    foreach ($k in $h1.Keys) { if ($h1[$k] -ne $h2[$k]) { throw ("non-deterministic bake: " + $k) } }
    if ($m1 -ne $m2) { throw "manifest bytes not stable across re-bake" }

    $maniSha = (Get-FileHash -Path $manifestFile -Algorithm SHA256).Hash
    Write-Output ("BAKE OK: 576 bubble textures + manifest, SHA256 stable across re-bake")
    Write-Output ("manifest sha256=" + $maniSha)
    Write-Output ("font family=" + $familyName + " pxH=" + $H + " ppu=24")
} catch {
    Write-Output ("BAKE FAIL: " + $_.Exception.Message)
    exit 1
}
