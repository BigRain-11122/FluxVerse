# FluxVerse DevLoop r101: landmark/office-ladder sheet cell-scan (P-69 pre-construction survey).
# Method = r93 frame-bag survey: per-grid-cell alpha occupancy + 4-neighbour connected components.
# Answers r96 open question: single-sprite vs variant-sheet, and true content boxes (estimates forbidden).
# ASCII-only body (PS5.1 GBK law); CJK paths come from UTF-8 data file (r53 explicit-UTF8-read law).
# Read-only: consumes sources in place, writes one JSON evidence file under logs/. No editor, no scene.
$ErrorActionPreference = 'Stop'
$repo = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)   # Tools\city -> repo root
$dataFile = Join-Path $PSScriptRoot 'landmark-sheets.txt'
$outFile = Join-Path $repo 'logs\devloop-r101-landmark-scan.json'
$utf8 = New-Object System.Text.UTF8Encoding($false)
Add-Type -AssemblyName System.Drawing

function Read-EntryList($path)
{
    $list = New-Object System.Collections.ArrayList
    foreach ($line in [System.IO.File]::ReadAllLines($path, $utf8))
    {
        $t = ($line -replace '\s+$', '')
        if ($t.Length -eq 0 -or $t.StartsWith('#')) { continue }
        $cells = @(48)
        $target = $t
        $pipe = $t.IndexOf('|cells=')
        if ($pipe -ge 0)
        {
            $spec = $t.Substring($pipe + 7)
            $cells = @($spec.Split(',') | ForEach-Object { [int]$_ })
            $target = $t.Substring(0, $pipe)
        }
        if ($target.StartsWith('d:'))
        {
            $dir = [System.IO.Path]::GetFullPath((Join-Path $repo $target.Substring(2)))
            if (-not (Test-Path -LiteralPath $dir)) { [void]$list.Add(@{ kind = 'missing'; full = $dir; cells = $cells }); continue }
            $pngs = Get-ChildItem -LiteralPath $dir -File -Filter '*.png' | Sort-Object Name
            foreach ($p in $pngs) { [void]$list.Add(@{ kind = 'f'; full = $p.FullName; cells = $cells }) }
        }
        elseif ($target.StartsWith('f:'))
        {
            [void]$list.Add(@{ kind = 'f'; full = [System.IO.Path]::GetFullPath((Join-Path $repo $target.Substring(2))); cells = $cells })
        }
    }
    return $list
}

function Get-Components($grid, $cols, $rows)
{
    # grid: bool[] in row-major cell order. 4-neighbour flood fill. Returns component rects (cell coords).
    $visited = New-Object 'bool[]' ($cols * $rows)
    $queue = New-Object 'System.Collections.Generic.Queue[int]'
    $comps = New-Object System.Collections.ArrayList
    for ($i = 0; $i -lt $grid.Length; $i++)
    {
        if (-not $grid[$i] -or $visited[$i]) { continue }
        $queue.Clear()
        $queue.Enqueue($i); $visited[$i] = $true
        $x0 = $cols; $y0 = $rows; $x1 = -1; $y1 = -1; $n = 0
        while ($queue.Count -gt 0)
        {
            $cur = $queue.Dequeue(); $n++
            $cx = $cur % $cols; $cy = [int](($cur - $cx) / $cols)
            if ($cx -lt $x0) { $x0 = $cx }; if ($cx -gt $x1) { $x1 = $cx }
            if ($cy -lt $y0) { $y0 = $cy }; if ($cy -gt $y1) { $y1 = $cy }
            if ($cx -gt 0 -and $grid[$cur - 1] -and -not $visited[$cur - 1]) { $visited[$cur - 1] = $true; $queue.Enqueue($cur - 1) }
            if ($cx -lt $cols - 1 -and $grid[$cur + 1] -and -not $visited[$cur + 1]) { $visited[$cur + 1] = $true; $queue.Enqueue($cur + 1) }
            if ($cy -gt 0 -and $grid[$cur - $cols] -and -not $visited[$cur - $cols]) { $visited[$cur - $cols] = $true; $queue.Enqueue($cur - $cols) }
            if ($cy -lt $rows - 1 -and $grid[$cur + $cols] -and -not $visited[$cur + $cols]) { $visited[$cur + $cols] = $true; $queue.Enqueue($cur + $cols) }
        }
        [void]$comps.Add(@{ x0 = $x0; y0 = $y0; x1 = $x1; y1 = $y1; w = ($x1 - $x0 + 1); h = ($y1 - $y0 + 1); cells = $n })
    }
    return $comps
}

function Scan-SheetBitmap($full, $cellsList)
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

        $bx0 = $w; $by0 = $h; $bx1 = -1; $by1 = -1
        foreach ($cs in $cellsList)
        {
            $cols = [int][Math]::Ceiling($w / $cs); $rowsn = [int][Math]::Ceiling($h / $cs)
            $grid = New-Object 'bool[]' ($cols * $rowsn)
            $occ = 0
            for ($y = 0; $y -lt $h; $y++)
            {
                $rowBase = $y * $stride
                $cy = [int](($y - ($y % $cs)) / $cs)
                $gRow = $cy * $cols
                for ($x = 0; $x -lt $w; $x++)
                {
                    if ($bytes[$rowBase + 4 * $x + 3] -gt 0)
                    {
                        if ($x -lt $bx0) { $bx0 = $x }; if ($x -gt $bx1) { $bx1 = $x }
                        if ($y -lt $by0) { $by0 = $y }; if ($y -gt $by1) { $by1 = $y }
                        $cx = [int](($x - ($x % $cs)) / $cs)
                        if (-not $grid[$gRow + $cx]) { $grid[$gRow + $cx] = $true; $occ++ }
                    }
                }
            }
            # r101 fix: PS function output unrolls ArrayLists; single-component results collapsed to a
            # bare hashtable whose .Count read 7 (key count). Force array wrap at the call site.
            $comps = @(Get-Components $grid $cols $rowsn)
            $top = @($comps | Sort-Object -Property cells -Descending | Select-Object -First 400)
            $record = [ordered]@{
                cell = $cs; cols = $cols; rows = $rowsn; occupied = $occ; comp_count = $comps.Count
                comps = @($top | ForEach-Object { [ordered]@{ x0 = $_.x0; y0 = $_.y0; w = $_.w; h = $_.h; cells = $_.cells } })
            }
            [void]$gridsSink.Add($record)
        }
        return [ordered]@{
            name = [System.IO.Path]::GetFileName($full); w = $w; h = $h
            bbox = @($bx0, $by0, $bx1, $by1); grids = @($gridsSink)
        }
    }
    finally { $bmp.Dispose() }
}

$entries = Read-EntryList $dataFile
$results = New-Object System.Collections.ArrayList
$errors = New-Object System.Collections.ArrayList
$plain48 = 0
$idx = 0
foreach ($e in $entries)
{
    $idx++
    if ($e.kind -eq 'missing') { [void]$errors.Add(@{ name = $e.full; err = 'DIR-MISSING' }); continue }
    if (-not (Test-Path -LiteralPath $e.full)) { [void]$errors.Add(@{ name = $e.full; err = 'FILE-MISSING' }); continue }
    $gridsSink = New-Object System.Collections.ArrayList
    try
    {
        $rec = Scan-SheetBitmap $e.full $e.cells
        [void]$results.Add($rec)
        $isPlain = ($rec.w -eq 48 -and $rec.h -eq 48 -and $rec.grids[0].comp_count -eq 1 -and $rec.grids[0].cols -eq 1 -and $rec.grids[0].rows -eq 1)
        if ($isPlain) { $plain48++ }
        else
        {
            $g = $rec.grids[0]
            $tw = 0; $th = 0
            if ($g.comp_count -gt 0 -and $g.comps.Count -gt 0) { $tw = $g.comps[0].w; $th = $g.comps[0].h }
            "{0,3}: {1}  canvas={2}x{3} bbox=[{4},{5}..{6},{7}] c{8}: occ={9}/{10}x{11} comps={12} top={13}x{14}c" -f `
                $idx, $rec.name, $rec.w, $rec.h, $rec.bbox[0], $rec.bbox[1], $rec.bbox[2], $rec.bbox[3], `
                $g.cell, $g.occupied, $g.cols, $g.rows, $g.comp_count, $tw, $th | Write-Host
        }
    }
    catch
    {
        [void]$errors.Add(@{ name = $e.full; err = $_.Exception.Message })
    }
}

$notable = @($results | Where-Object { -not ($_.w -eq 48 -and $_.h -eq 48 -and $_.grids[0].comp_count -eq 1 -and $_.grids[0].cols -eq 1 -and $_.grids[0].rows -eq 1) })
$payload = [ordered]@{
    tool = 'scan-landmark-sheets'; round = 'r101'
    generated_utc = [DateTime]::UtcNow.ToString('o')
    data_file = 'Tools/city/landmark-sheets.txt'
    files_scanned = $results.Count; plain_48x48_single = $plain48
    notable = $notable
    files = $results; errors = $errors
}
$json = ConvertTo-Json -InputObject $payload -Depth 8
[System.IO.File]::WriteAllText($outFile, $json, $utf8)
"----"
"scanned=$($results.Count) plain48=$plain48 errors=$($errors.Count) out=$outFile"
if ($errors.Count -gt 0) { foreach ($er in $errors) { "ERR: $($er.err)" } }
# self-audit: body must be pure ASCII (encoding law)
$raw = [System.IO.File]::ReadAllText($PSCommandPath)
$nonAscii = 0
foreach ($ch in $raw.ToCharArray()) { if ([int]$ch -gt 127) { $nonAscii++ } }
"ascii_audit=$nonAscii"
