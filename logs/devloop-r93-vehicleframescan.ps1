# FluxVerse DevLoop r93: connected-component scan of AA-016.02 animated vehicle
# strips/sheets (P-69 slice-1 vehicle face, r91 survey follow-up). Locates the
# tight opaque bounding box of every sprite island so the cropper manifest can
# pin exact rects (deterministic, fail-loud). ASCII-only per PS5.1 law.
$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.Drawing

function Scan-Components($path, $minPx) {
    $b = [System.Drawing.Bitmap]::FromFile($path)
    $W = $b.Width; $H = $b.Height
    $rect = New-Object System.Drawing.Rectangle (0, 0, $W, $H)
    $bd = $b.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::ReadOnly, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $stride = $bd.Stride
    $bytes = New-Object byte[] ($stride * $H)
    [System.Runtime.InteropServices.Marshal]::Copy($bd.Scan0, $bytes, 0, $bytes.Length)
    $b.UnlockBits($bd)
    $b.Dispose()
    $lab = New-Object 'int[]' ($W * $H)
    $out = New-Object System.Collections.ArrayList
    $qx = New-Object 'System.Collections.Generic.Queue[int]'
    $totalOpaque = 0
    for ($y0 = 0; $y0 -lt $H; $y0++) {
        for ($x0 = 0; $x0 -lt $W; $x0++) {
            $i0 = $y0 * $W + $x0
            if ($lab[$i0] -ne 0) { continue }
            if ($bytes[$y0 * $stride + 4 * $x0 + 3] -le 16) { $lab[$i0] = -1; continue }
            $qx.Clear()
            [void]$qx.Enqueue($i0)
            $lab[$i0] = 1
            $minx = $x0; $maxx = $x0; $miny = $y0; $maxy = $y0; $cnt = 0
            while ($qx.Count -gt 0) {
                $i = $qx.Dequeue()
                $cnt++
                $x = $i % $W; $y = [int]($i / $W)
                if ($x -lt $minx) { $minx = $x }
                if ($x -gt $maxx) { $maxx = $x }
                if ($y -lt $miny) { $miny = $y }
                if ($y -gt $maxy) { $maxy = $y }
                if ($x -gt 0) { $j = $i - 1; $px = $y * $stride + 4 * ($x - 1) + 3; if ($lab[$j] -eq 0 -and $bytes[$px] -gt 16) { $lab[$j] = 1; [void]$qx.Enqueue($j) } }
                if ($x -lt ($W - 1)) { $j = $i + 1; $px = $y * $stride + 4 * ($x + 1) + 3; if ($lab[$j] -eq 0 -and $bytes[$px] -gt 16) { $lab[$j] = 1; [void]$qx.Enqueue($j) } }
                if ($y -gt 0) { $j = $i - $W; $px = ($y - 1) * $stride + 4 * $x + 3; if ($lab[$j] -eq 0 -and $bytes[$px] -gt 16) { $lab[$j] = 1; [void]$qx.Enqueue($j) } }
                if ($y -lt ($H - 1)) { $j = $i + $W; $px = ($y + 1) * $stride + 4 * $x + 3; if ($lab[$j] -eq 0 -and $bytes[$px] -gt 16) { $lab[$j] = 1; [void]$qx.Enqueue($j) } }
            }
            $totalOpaque += $cnt
            if ($cnt -ge $minPx) {
                [void]$out.Add(($minx.ToString() + ',' + $miny.ToString() + ',' + ($maxx - $minx + 1).ToString() + ',' + ($maxy - $miny + 1).ToString() + ' px=' + $cnt))
            }
        }
    }
    Write-Output ('== ' + (Split-Path $path -Leaf) + ' ' + $W + 'x' + $H + ' opaque_px=' + $totalOpaque + ' components_ge' + $minPx + 'px=' + $out.Count)
    foreach ($s in $out) { Write-Output ('  rect x,y,w,h: ' + $s) }
}

$artRoot = "C:\Users\sjs20\Desktop\FluxGroup\gaming\MiniGame\Art Assets"
$a16 = Get-ChildItem $artRoot -Directory -Filter "AA-016*" | Select-Object -First 1
if (-not $a16) { throw "AA-016 pack not found" }
$a02 = Get-ChildItem $a16.FullName -Directory -Filter "AA-016.02*" | Select-Object -First 1
if (-not $a02) { throw "AA-016.02 subpack not found" }
$base = Join-Path $a02.FullName "Modern_Exteriors_16x16\Animated_16x16\Vehicles_16x16"
Scan-Components (Join-Path $base 'Cars_16x16\Car_2_complete_1.png') 60
Scan-Components (Join-Path $base 'Cars_16x16\Car_2_complete_3.png') 60
Scan-Components (Join-Path $base 'Cars_16x16\Car_2_complete_5.png') 60
Scan-Components (Join-Path $base 'Buses_16x16\Buses_1.png') 300
