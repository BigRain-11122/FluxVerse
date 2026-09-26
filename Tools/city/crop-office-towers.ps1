# FluxVerse r151: crop P-38(2) hi-bit 3x3 tower facades (11 pieces, r150
# verdict B list = k31-k37 glass towers + k39-k42 three-bay mids) from
# AA-016 16_Office_48x48.png into City/Assets/ArtPacks/office-towers/.
# Zero-resample crop; tight-frame trim law (r93 - no empty alpha border);
# source read-only gate (size+mtime); double-run SHA idempotency; 11 files
# mutually distinct. ASCII-only script (PS5.1 GBK law); CJK source path
# comes from UTF-8 data file Tools/city/landmark-sheets.txt (r53 law).
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
$root = Join-Path $PSScriptRoot '..\..'
$outDir = Join-Path $root 'City\Assets\ArtPacks\office-towers'
New-Item -ItemType Directory -Force -Path $outDir | Out-Null
$report = Join-Path $root 'logs\devloop-r151-towercrop.txt'
$rep = New-Object System.Collections.ArrayList

# resolve source path from UTF-8 data file (explicit encoding, r53 law)
# r212: scriptblock-outer-var assignment retired (PSA dead-var false-positive
# family, r171 scriptblock lesson) - the block only OUTPUTS candidate paths,
# the assignment happens outside; Select -Last 1 keeps the r151 last-match-wins
# behavior, empty list -> $null -> the -not check throws (behavior identical)
$dataFile = Join-Path $PSScriptRoot 'landmark-sheets.txt'
$srcPath = @(Get-Content -LiteralPath $dataFile -Encoding UTF8 | ForEach-Object {
    $t = $_.Trim()
    if ($t.StartsWith('f:')) {
        $rel = ($t.Substring(2) -split '\|')[0]
        if ([IO.Path]::GetFileName($rel) -eq '16_Office_48x48.png') {
            [IO.Path]::GetFullPath((Join-Path $root $rel))
        }
    }
}) | Select-Object -Last 1
if (-not $srcPath) { throw 'FATAL: 16_Office_48x48.png not found in landmark-sheets.txt' }
if (-not (Test-Path -LiteralPath $srcPath)) { throw 'FATAL: source missing on disk' }
$fi = Get-Item -LiteralPath $srcPath
$sizeBefore = $fi.Length
$mtimeBefore = $fi.LastWriteTimeUtc

# piece table: name k-index cellx celly (all 3x3 cells = 144x144 px @48px grid)
# k-numbering = r150 landmark-scale filtered candidate table (r150 row authority)
$tableTxt = @"
tower-glass-31 31 18 36
tower-glass-32 32 22 36
tower-glass-33 33 9 36
tower-glass-34 34 13 36
tower-glass-35 35 4 36
tower-glass-36 36 0 36
tower-glass-37 37 4 56
tower-mid-39 39 23 8
tower-mid-40 40 13 8
tower-mid-41 41 3 19
tower-mid-42 42 13 19
"@
$rows = @()
foreach ($line in ($tableTxt -split "`n")) {
    $p = $line.Trim() -split '\s+'
    if ($p.Count -eq 4) {
        $row = New-Object PSObject -Property @{ name=$p[0]; k=$p[1]; cx=[int]$p[2]; cy=[int]$p[3] }
        $rows += $row
    }
}
if ($rows.Count -ne 11) { throw ('FATAL: piece table parsed ' + $rows.Count + ' rows, want 11') }

$CELL = 48
$src = [System.Drawing.Image]::FromFile($srcPath)
try {
    $shas = @{}
    foreach ($r in $rows) {
        $px = $r.cx * $CELL; $py = $r.cy * $CELL
        $rect = New-Object System.Drawing.Rectangle($px, $py, 144, 144)
        $bmp = New-Object System.Drawing.Bitmap(144, 144)
        $g = [System.Drawing.Graphics]::FromImage($bmp)
        $g.DrawImage($src, (New-Object System.Drawing.Rectangle(0,0,144,144)), $rect, [System.Drawing.GraphicsUnit]::Pixel)
        $g.Dispose()
        # tight-frame census (r93 law): find alpha bbox, occupied ratio
        $minX = 999; $minY = 999; $maxX = -1; $maxY = -1; $occ = 0
        for ($y = 0; $y -lt 144; $y++) {
            for ($x = 0; $x -lt 144; $x++) {
                if ($bmp.GetPixel($x, $y).A -gt 0) {
                    $occ++
                    if ($x -lt $minX) { $minX = $x }
                    if ($y -lt $minY) { $minY = $y }
                    if ($x -gt $maxX) { $maxX = $x }
                    if ($y -gt $maxY) { $maxY = $y }
                }
            }
        }
        if ($maxX -lt 0) { throw ('FATAL: ' + $r.name + ' empty crop') }
        $ratio = $occ / 20736.0
        if ($ratio -lt 0.5) { throw ('FATAL: ' + $r.name + ' occupied ratio ' + $ratio + ' < 0.5') }
        $w = $maxX - $minX + 1; $h = $maxY - $minY + 1
        $trimmed = ($minX -ne 0) -or ($minY -ne 0) -or ($maxX -ne 143) -or ($maxY -ne 143)
        if ($trimmed) {
            $cut = $bmp.Clone((New-Object System.Drawing.Rectangle($minX, $minY, $w, $h)), $bmp.PixelFormat)
            $bmp.Dispose(); $bmp = $cut
        } else { $w = 144; $h = 144 }
        $outPath = Join-Path $outDir ($r.name + '.png')
        $bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
        $bmp.Dispose()
        # PNG magic gate
        $magic = [IO.File]::ReadAllBytes($outPath)[0..3]
        if (($magic[0] -ne 0x89) -or ($magic[1] -ne 0x50)) { throw ('FATAL: ' + $r.name + ' not a PNG') }
        $sha = (Get-FileHash -Algorithm SHA256 -LiteralPath $outPath).Hash
        $dupNote = ''
        if ($shas.ContainsKey($sha)) {
            # source-sheet exact duplicate (r149 pair-dup precedent): census, not fatal
            $dupNote = ' DUP_OF=' + $shas[$sha]
        } else { $shas[$sha] = $r.name }
        [void]$rep.Add(($r.name + ' k' + $r.k + ' src=[' + $px + ',' + $py + ' 144x144] out=' + $w + 'x' + $h + ' trim=' + $trimmed + ' occ=' + [math]::Round($ratio,3) + ' sha12=' + $sha.Substring(0,12) + $dupNote))
    }
    # sanity: at least 9 of 11 distinct (glass family must stay mutually distinct)
    if ($shas.Count -lt 9) { throw ('FATAL: only ' + $shas.Count + ' distinct pieces, dup ratio implausible') }
} finally { $src.Dispose() }

# double-run idempotency: re-crop one probe piece (k37) and compare hash
$probe = $rows | Where-Object { $_.k -eq '37' }
$px = $probe.cx * $CELL; $py = $probe.cy * $CELL
$src = [System.Drawing.Image]::FromFile($srcPath)
try {
    $bmp = New-Object System.Drawing.Bitmap(144, 144)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.DrawImage($src, (New-Object System.Drawing.Rectangle(0,0,144,144)), (New-Object System.Drawing.Rectangle($px,$py,144,144)), [System.Drawing.GraphicsUnit]::Pixel)
    $g.Dispose()
    $minX=999;$minY=999;$maxX=-1;$maxY=-1
    for ($y=0; $y -lt 144; $y++) { for ($x=0; $x -lt 144; $x++) { if ($bmp.GetPixel($x,$y).A -gt 0) { if ($x -lt $minX){$minX=$x}; if ($y -lt $minY){$minY=$y}; if ($x -gt $maxX){$maxX=$x}; if ($y -gt $maxY){$maxY=$y} } } }
    if (($minX -ne 0) -or ($minY -ne 0) -or ($maxX -ne 143) -or ($maxY -ne 143)) {
        $cut = $bmp.Clone((New-Object System.Drawing.Rectangle($minX,$minY,($maxX-$minX+1),($maxY-$minY+1))), $bmp.PixelFormat)
        $bmp.Dispose(); $bmp = $cut
    }
    $tmpPath = Join-Path $env:TEMP ('fv-r151-probe-' + $probe.name + '.png')
    $bmp.Save($tmpPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
} finally { $src.Dispose() }
$shaProbe = (Get-FileHash -Algorithm SHA256 -LiteralPath $tmpPath).Hash
$shaDisk  = (Get-FileHash -Algorithm SHA256 -LiteralPath (Join-Path $outDir ($probe.name + '.png'))).Hash
Remove-Item -LiteralPath $tmpPath -Force
if ($shaProbe -ne $shaDisk) { throw 'FATAL: double-run idempotency failed for probe k37' }

# source read-only gate
$fi2 = Get-Item -LiteralPath $srcPath
if ($fi2.Length -ne $sizeBefore -or $fi2.LastWriteTimeUtc -ne $mtimeBefore) { throw 'FATAL: source file was modified' }

# count gate (r212 re-scoped: office-towers is a SHARED dir - r152 facade skins
# and r175 landmark silhouettes landed here after r151; census only this
# cropper's own pieces so the stale "dir has 11 png" face cannot re-fire)
$files = @(Get-ChildItem -LiteralPath $outDir -Filter *.png | Where-Object { $_.Name -match '^tower-(glass|mid)-' })
if ($files.Count -ne 11) { throw ('FATAL: cropper pieces in shared dir = ' + $files.Count + ', want 11') }

[void]$rep.Add('CROP OK pieces=11 distinct_sha=' + $shas.Count + ' double_run=PASS source_readonly=PASS')
[IO.File]::WriteAllLines($report, $rep)
$rep | ForEach-Object { Write-Output $_ }
