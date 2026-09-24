# FluxVerse DevLoop r112: office-band mirror bake (P-69 slice: street office
# band v1, r111 officeband-manifest law). The manifest pins mirror variety via
# the r93 pixel-exact mirror law (NearestNeighbor negative-width flip, zero
# resampling): N2/N4 consume a pre-baked horizontal mirror of the Condo_4_24
# condo, because the sprite-family law forbids localScale flips (GO pos =
# rect center, localScale 1). This baker mirrors the raw ARGB bytes column by
# column - a true zero-resampling flip, not a DrawImage scale.
# Self-gates (fail-loud): 144x96 source pin, mirror non-identity, saved-file
# full byte verification vs the mirrored source bytes, double-bake SHA256
# determinism, source file untouched. ASCII only per PS5.1 encoding law.
$ErrorActionPreference = 'Stop'
$packDir = Join-Path $PSScriptRoot '..\..\City\Assets\ArtPacks\office-ladder'
$srcPath = Join-Path $packDir 'ME_Singles_Generic_Building_48x48_Condo_4_24.png'
$dstPath = Join-Path $packDir 'ME_Singles_Generic_Building_48x48_Condo_4_24_mirror.png'
Add-Type -AssemblyName System.Drawing

function Get-FileSha($p) {
    $sha = [System.Security.Cryptography.SHA256]::Create()
    try {
        $fs = [IO.File]::OpenRead($p)
        try { $hash = $sha.ComputeHash($fs) } finally { $fs.Close() }
    } finally { $sha.Clear() }
    return ([BitConverter]::ToString($hash) -replace '-', '')
}

function Bake-Mirror($src, $dst) {
    $bmp = New-Object System.Drawing.Bitmap($src)
    try {
        if ($bmp.Width -ne 144 -or $bmp.Height -ne 96) {
            throw ("source pin fail: " + $bmp.Width + "x" + $bmp.Height + " (expected 144x96)")
        }
        $fmt = [System.Drawing.Imaging.PixelFormat]::Format32bppArgb
        $rect = New-Object System.Drawing.Rectangle(0, 0, $bmp.Width, $bmp.Height)
        $bd = $bmp.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::ReadOnly, $fmt)
        $stride = $bd.Stride
        $w = $bmp.Width; $h = $bmp.Height
        $srcBytes = New-Object byte[] ($stride * $h)
        [System.Runtime.InteropServices.Marshal]::Copy($bd.Scan0, $srcBytes, 0, $srcBytes.Length)
        $bmp.UnlockBits($bd)
        $out = New-Object System.Drawing.Bitmap($w, $h, $fmt)
        try {
            $obd = $out.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::WriteOnly, $fmt)
            try {
                if ($obd.Stride -ne $stride) { throw ("stride mismatch: " + $stride + " vs " + $obd.Stride) }
                $outBytes = New-Object byte[] ($stride * $h)
                for ($y = 0; $y -lt $h; $y++) {
                    $srow = $y * $stride; $orow = $y * $stride
                    for ($x = 0; $x -lt $w; $x++) {
                        $si = $srow + ($x * 4); $oi = $orow + (($w - 1 - $x) * 4)
                        $outBytes[$oi] = $srcBytes[$si]
                        $outBytes[$oi + 1] = $srcBytes[$si + 1]
                        $outBytes[$oi + 2] = $srcBytes[$si + 2]
                        $outBytes[$oi + 3] = $srcBytes[$si + 3]
                    }
                }
                [System.Runtime.InteropServices.Marshal]::Copy($outBytes, 0, $obd.Scan0, $outBytes.Length)
            } finally { $out.UnlockBits($obd) }
        } finally { }
        $out.Save($dst, [System.Drawing.Imaging.ImageFormat]::Png)
    } finally { $bmp.Dispose() }
    # verify the SAVED file byte-for-byte against the mirrored source bytes
    $chk = New-Object System.Drawing.Bitmap($dst)
    try {
        $fmt2 = [System.Drawing.Imaging.PixelFormat]::Format32bppArgb
        $rect2 = New-Object System.Drawing.Rectangle(0, 0, $chk.Width, $chk.Height)
        $cbd = $chk.LockBits($rect2, [System.Drawing.Imaging.ImageLockMode]::ReadOnly, $fmt2)
        $stride2 = $cbd.Stride
        $h2 = $chk.Height; $w2 = $chk.Width
        $dstBytes = New-Object byte[] ($stride2 * $h2)
        [System.Runtime.InteropServices.Marshal]::Copy($cbd.Scan0, $dstBytes, 0, $dstBytes.Length)
        $chk.UnlockBits($cbd)
        if ($stride2 -ne $stride) { throw ("verify stride mismatch") }
        $diff = 0
        for ($y = 0; $y -lt $h2; $y++) {
            $row = $y * $stride2
            for ($x = 0; $x -lt $w2; $x++) {
                $si = $row + ($x * 4); $oi = $row + (($w2 - 1 - $x) * 4)
                for ($k = 0; $k -lt 4; $k++) {
                    if ($srcBytes[$si + $k] -cne $dstBytes[$oi + $k]) { $diff++ }
                }
            }
        }
        if ($diff -ne 0) { throw ("verify fail: " + $diff + " bytes differ from the exact mirror") }
        # non-identity: the source must not be mirror-symmetric
        $ident = 0
        for ($y = 0; $y -lt $h2; $y++) {
            $row = $y * $stride2
            for ($x = 0; $x -lt ($w2 / 2); $x++) {
                $li = $row + ($x * 4); $ri = $row + (($w2 - 1 - $x) * 4)
                for ($k = 0; $k -lt 4; $k++) { if ($srcBytes[$li + $k] -cne $srcBytes[$ri + $k]) { $ident++ } }
            }
        }
        if ($ident -eq 0) { throw "source is mirror-symmetric: the mirror bake would be an identity copy" }
        return $ident
    } finally { $chk.Dispose() }
}

if (-not (Test-Path $srcPath)) { throw "source condo png missing"; exit 1 }
$srcShaBefore = Get-FileSha $srcPath
$tmp1 = Join-Path $env:TEMP 'fv-office-mirror-a.png'
$tmp2 = Join-Path $env:TEMP 'fv-office-mirror-b.png'
if (Test-Path $tmp1) { Remove-Item $tmp1 -Force }
if (Test-Path $tmp2) { Remove-Item $tmp2 -Force }
$asym1 = Bake-Mirror $srcPath $tmp1
$asym2 = Bake-Mirror $srcPath $tmp2
if ($asym1 -ne $asym2) { throw "double-bake asymmetry count differs: determinism broken" }
$sha1 = Get-FileSha $tmp1
$sha2 = Get-FileSha $tmp2
if ($sha1 -ne $sha2) { throw "double-bake SHA mismatch: determinism broken" }
if (Test-Path $dstPath) {
    $oldSha = Get-FileSha $dstPath
    if ($oldSha -ne $sha1) { throw "existing mirror differs from fresh bake: stale file, refusing silent overwrite" }
    Write-Output ("MIRROR ALREADY CURRENT sha12=" + $sha1.Substring(0, 12))
} else {
    [IO.File]::Copy($tmp1, $dstPath)
    Write-Output ("MIRROR BAKED sha12=" + $sha1.Substring(0, 12))
}
$srcShaAfter = Get-FileSha $srcPath
if ($srcShaBefore -cne $srcShaAfter) { throw "source file was modified by the bake" }
Remove-Item $tmp1 -Force -ErrorAction SilentlyContinue
Remove-Item $tmp2 -Force -ErrorAction SilentlyContinue
Write-Output ("BAKE OK 144x96 asym_bytes=" + $asym1 + " src_untouched=1 deterministic=1")
exit 0
