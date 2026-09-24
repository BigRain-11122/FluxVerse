# FluxVerse DevLoop r93 part 2: alpha-threshold sweep on the strip sedan (is the
# shadow separable from the body?) + component scan of the 32x32-tier vehicle
# folders (frame-face fact-finding, r91 said do not pre-judge - measure instead).
# ASCII-only per PS5.1 law.
$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.Drawing
$artRoot = "C:\Users\sjs20\Desktop\FluxGroup\gaming\MiniGame\Art Assets"
$a16 = Get-ChildItem $artRoot -Directory -Filter "AA-016*" | Select-Object -First 1
$a02 = Get-ChildItem $a16.FullName -Directory -Filter "AA-016.02*" | Select-Object -First 1

# --- 1. alpha-threshold sweep on the sedan at 17,124 (78x36) in strip 1 ---
$strip = Join-Path $a02.FullName "Modern_Exteriors_16x16\Animated_16x16\Vehicles_16x16\Cars_16x16\Car_2_complete_1.png"
$b = [System.Drawing.Bitmap]::FromFile($strip)
$rect = New-Object System.Drawing.Rectangle (17, 124, 78, 36)
$bd = $b.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::ReadOnly, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$str = $bd.Stride
$bytes = New-Object byte[] ($str * 36)
[System.Runtime.InteropServices.Marshal]::Copy($bd.Scan0, $bytes, 0, $bytes.Length)
$b.UnlockBits($bd); $b.Dispose()
foreach ($th in 16, 60, 100, 140, 180, 220) {
    $minx = 999; $maxx = -1; $miny = 999; $maxy = -1
    for ($y = 0; $y -lt 36; $y++) {
        for ($x = 0; $x -lt 78; $x++) {
            if ($bytes[$y * $str + 4 * $x + 3] -gt $th) {
                if ($x -lt $minx) { $minx = $x }
                if ($x -gt $maxx) { $maxx = $x }
                if ($y -lt $miny) { $miny = $y }
                if ($y -gt $maxy) { $maxy = $y }
            }
        }
    }
    if ($maxx -ge 0) {
        Write-Output ("alpha>" + $th + " body bounds: " + $minx + "," + $miny + " " + ($maxx - $minx + 1) + "x" + ($maxy - $miny + 1))
    } else { Write-Output ("alpha>" + $th + " : nothing") }
}
# per-row alpha profile of the bottom 12 rows (shadow vs body boundary)
for ($y = 24; $y -lt 36; $y++) {
    $n = 0; $mx = 0
    for ($x = 0; $x -lt 78; $x++) { $a = $bytes[$y * $str + 4 * $x + 3]; if ($a -gt 0) { $n++ }; if ($a -gt $mx) { $mx = $a } }
    Write-Output ("row y=" + $y + " opaque_px=" + $n + " max_alpha=" + $mx)
}

# --- 2. component scan of 32x32-tier vehicle folders ---
function Scan-Components($path, $minPx) {
    $b = [System.Drawing.Bitmap]::FromFile($path)
    $W = $b.Width; $H = $b.Height
    $rect = New-Object System.Drawing.Rectangle (0, 0, $W, $H)
    $bd = $b.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::ReadOnly, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $stride = $bd.Stride
    $bytes = New-Object byte[] ($stride * $H)
    [System.Runtime.InteropServices.Marshal]::Copy($bd.Scan0, $bytes, 0, $bytes.Length)
    $b.UnlockBits($bd); $b.Dispose()
    $lab = New-Object 'int[]' ($W * $H)
    $out = New-Object System.Collections.ArrayList
    $qx = New-Object 'System.Collections.Generic.Queue[int]'
    for ($y0 = 0; $y0 -lt $H; $y0++) {
        for ($x0 = 0; $x0 -lt $W; $x0++) {
            $i0 = $y0 * $W + $x0
            if ($lab[$i0] -ne 0) { continue }
            if ($bytes[$y0 * $stride + 4 * $x0 + 3] -le 16) { $lab[$i0] = -1; continue }
            $qx.Clear(); [void]$qx.Enqueue($i0); $lab[$i0] = 1
            $minx = $x0; $maxx = $x0; $miny = $y0; $maxy = $y0; $cnt = 0
            while ($qx.Count -gt 0) {
                $i = $qx.Dequeue(); $cnt++
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
            if ($cnt -ge $minPx) { [void]$out.Add(($minx.ToString() + ',' + $miny.ToString() + ',' + ($maxx - $minx + 1).ToString() + ',' + ($maxy - $miny + 1).ToString() + ' px=' + $cnt)) }
        }
    }
    Write-Output ('== ' + (Split-Path $path -Leaf) + ' ' + $W + 'x' + $H + ' components_ge' + $minPx + '=' + $out.Count)
    foreach ($s in $out) { Write-Output ('  rect: ' + $s) }
}

$v32 = Join-Path $a02.FullName "Modern_Exteriors_32x32\Animated_32x32\Vehicles_32x32"
Get-ChildItem $v32 -Directory | ForEach-Object {
    Get-ChildItem $_.FullName -Filter *.png | Sort-Object Name | Select-Object -First 2 | ForEach-Object {
        Scan-Components $_.FullName 200
    }
}
