# FluxVerse DevLoop r136: floor-plate band survey (P-69 v2 assembly pre-construction survey).
# Question: are the 63 Floor_Modular sheets single vertical slabs (r111 reading: 2x6u/2x8u/2x12u)
#           or variant sheets of 48x48 floor modules (2x2u @ PPU24 each, per the 48x48 singles family)?
# Method: per-48px-band alpha occupancy + fully-transparent row census + per-band content bbox.
# ASCII-only body (PS5.1 GBK law). Read-only scan; writes one JSON evidence file. No editor, no scene.
$ErrorActionPreference = 'Stop'
$repo = Split-Path -Parent $PSScriptRoot   # logs\ -> repo root
$packDir = Join-Path $repo 'City\Assets\ArtPacks\office-ladder'
$outFile = Join-Path $repo 'logs\devloop-r136-plateband-scan.json'
$utf8 = New-Object System.Text.UTF8Encoding($false)
Add-Type -AssemblyName System.Drawing

function Scan-Plate($full)
{
    $bmp = New-Object System.Drawing.Bitmap($full)
    try
    {
        $w = $bmp.Width; $h = $bmp.Height
        $rect = New-Object System.Drawing.Rectangle(0, 0, $w, $h)
        $fmt = [System.Drawing.Imaging.PixelFormat]::Format32bppArgb
        $bd = $bmp.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::ReadOnly, $fmt)
        $stride = $bd.Stride
        $bytes = New-Object 'byte[]' ($stride * $h)
        [System.Runtime.InteropServices.Marshal]::Copy($bd.Scan0, $bytes, 0, $bytes.Length)
        $bmp.UnlockBits($bd)

        # fully-transparent row census (rows with zero opaque pixels)
        $emptyRows = New-Object 'System.Collections.Generic.List[int]'
        for ($y = 0; $y -lt $h; $y++)
        {
            $rowBase = $y * $stride
            $opaque = 0
            for ($x = 0; $x -lt $w; $x++) { if ($bytes[$rowBase + 4 * $x + 3] -gt 0) { $opaque++ } }
            if ($opaque -eq 0) { [void]$emptyRows.Add($y) }
        }
        # compress empty rows into ranges
        $ranges = New-Object System.Collections.ArrayList
        $i = 0
        while ($i -lt $emptyRows.Count)
        {
            $s = $emptyRows[$i]; $e = $s
            while (($i + 1 -lt $emptyRows.Count) -and ($emptyRows[$i + 1] -eq $e + 1)) { $i++; $e = $emptyRows[$i] }
            [void]$ranges.Add(@{ y0 = $s; y1 = $e; h = ($e - $s + 1) })
            $i++
        }

        # per-48px-band occupancy + bbox (band index -> stats)
        $bands = New-Object System.Collections.ArrayList
        $nBands = [int][Math]::Ceiling($h / 48)
        for ($b = 0; $b -lt $nBands; $b++)
        {
            $by0 = $b * 48; $by1 = [Math]::Min($by0 + 47, $h - 1)
            $bx0 = $w; $bx1 = -1; $opq = 0
            $emptyInside = 0
            for ($y = $by0; $y -le $by1; $y++)
            {
                $rowBase = $y * $stride; $rowO = 0
                for ($x = 0; $x -lt $w; $x++)
                {
                    if ($bytes[$rowBase + 4 * $x + 3] -gt 0)
                    {
                        $opq++; $rowO++
                        if ($x -lt $bx0) { $bx0 = $x }; if ($x -gt $bx1) { $bx1 = $x }
                    }
                }
                if ($rowO -eq 0) { $emptyInside++ }
            }
            [void]$bands.Add([ordered]@{
                band = $b; y = "$by0..$by1"; opaque = $opq; empty_rows = $emptyInside
                bbox_x = "$bx0..$bx1"
            })
        }

        # verdict: variant sheet iff every inter-band boundary has >=1 empty row near it,
        # no empty row cuts through band interiors (interior-empty would mean hollow content).
        $emptyAll = $emptyRows.Count
        $interiorEmpty = 0
        for ($b = 0; $b -lt $nBands; $b++)
        {
            for ($y = ($b * 48 + 1); $y -le ([Math]::Min($b * 48 + 46, $h - 1)); $y++)
            {
                if ($emptyRows.Contains($y)) { $interiorEmpty++ }
            }
        }
        $boundaryEmpty = 0
        for ($b = 0; $b -lt ($nBands - 1); $b++)
        {
            $hasNear = $false
            for ($y = $b * 48 + 44; $y -le [Math]::Min($b * 48 + 51, $h - 1); $y++)
            {
                if ($emptyRows.Contains($y)) { $hasNear = $true }
            }
            if ($hasNear) { $boundaryEmpty++ }
        }
        $variantSheet = ($emptyAll -gt 0 -and $interiorEmpty -eq 0 -and $boundaryEmpty -eq ($nBands - 1))

        return [ordered]@{
            name = [System.IO.Path]::GetFileName($full); w = $w; h = $h
            bands_n = $nBands; empty_rows_total = $emptyAll
            sep_ranges_n = $ranges.Count; interior_empty_rows = $interiorEmpty
            boundary_separators = $boundaryEmpty
            verdict = $(if ($variantSheet) { 'variant_sheet' } else { 'not_variant' })
            band_stats = @($bands)
        }
    }
    finally { $bmp.Dispose() }
}

$results = New-Object System.Collections.ArrayList
$errors = New-Object System.Collections.ArrayList
$pngs = Get-ChildItem -LiteralPath $packDir -File -Filter '*.png' | Sort-Object Name
foreach ($p in $pngs)
{
    if ($p.Name -notmatch 'Floor_Modular') { continue }   # only the 63 plates
    try { [void]$results.Add((Scan-Plate $p.FullName)) }
    catch { [void]$errors.Add(@{ name = $p.Name; err = $_.Exception.Message }) }
}

$summary = New-Object System.Collections.ArrayList
foreach ($fam in @('Ground_Floor_Condo_Modular', 'Middle_Floor_Modular', 'Roof_Modular'))
{
    $grp = @($results | Where-Object { $_.name -match $fam })
    $vs = @($grp | Where-Object { $_.verdict -eq 'variant_sheet' }).Count
    [void]$summary.Add([ordered]@{ family = $fam; n = $grp.Count; variant_sheet = $vs; not_variant = ($grp.Count - $vs) })
}

$payload = [ordered]@{
    tool = 'plateband-scan'; round = 'r136'
    generated_utc = [DateTime]::UtcNow.ToString('o')
    pack = 'City/Assets/ArtPacks/office-ladder'
    files_scanned = $results.Count; summary = @($summary)
    files = $results; errors = $errors
}
$json = ConvertTo-Json -InputObject $payload -Depth 8
[System.IO.File]::WriteAllText($outFile, $json, $utf8)
"scanned=$($results.Count) errors=$($errors.Count)"
foreach ($s in $summary) { "{0}: n={1} variant={2} not={3}" -f $s.family, $s.n, $s.variant_sheet, $s.not_variant }
"---- per-file verdicts ----"
foreach ($r in $results) { "{0}: bands={1} empty={2} interior_empty={3} bsep={4} -> {5}" -f $r.name, $r.bands_n, $r.empty_rows_total, $r.interior_empty_rows, $r.boundary_separators, $r.verdict }
# self-audit: body must be pure ASCII (encoding law)
$raw = [System.IO.File]::ReadAllText($PSCommandPath)
$nonAscii = 0
foreach ($ch in $raw.ToCharArray()) { if ([int]$ch -gt 127) { $nonAscii++ } }
"ascii_audit=$nonAscii"
"out=$outFile"
