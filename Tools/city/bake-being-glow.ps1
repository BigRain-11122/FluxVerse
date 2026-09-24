# FluxVerse City being-glow baker (r97: P-68/P-72 batch1 street-resident pool -
# the two sprite-species residents compose from the 'being' aura cell of the
# group atlas. That atlas cell carries OPAQUE gray bands (group pipeline law:
# no alpha inside the atlas, alpha is injected at remap time), but a plain
# SpriteRenderer tint cannot remap gray LEVELS to ALPHAS - so this companion
# asset bakes the band structure ONCE as white RGB carrying the reference
# alphas (70/150/225/245); the engine slice then tints it with the per-resident
# core color and every band lands at its exact reference alpha. Sparks bake at
# their reference near-white #F5EFFF opaque; under the engine tint they pick up
# a faint core cast - 5 pixels on a 1.33u street body, sub-pixel at L0 zoom
# (documented deviation, honesty law).
# Pixel law: per-pixel band table (LockBits, later band wins overlaps = the
# opaque replacement order of the group baker atlas-residents.ps1); fully
# deterministic: same inputs -> byte-identical PNG; re-bake SHA256 gate
# (r24/r38/r87 idempotence law). ENCODING LAW: ASCII-only (PS5.1 GBK law).
# No 3D.
$ErrorActionPreference = "Stop"
$repo = "C:\Users\sjs20\Desktop\FluxGroup\gaming\FluxVerse"
$outFile = Join-Path $repo "City\Assets\ArtPacks\residents-atlas\being-glow.png"
Add-Type -AssemblyName System.Drawing
$W = 32; $H = 32

# band table: px rects in reference draw order (later wins), (x, y, w, h, r, g, b, a)
# - 16px-logical reference rects x2 like the group baker; alphas = the remap
#   targets of the gray levels 50/120/200/230 in Make-AttrsGlow.
$bands = @(
    @(8,  6, 16, 16, 255, 255, 255, 70),
    @(10, 8, 12, 12, 255, 255, 255, 150),
    @(12, 10, 8,  8,  255, 255, 255, 225),
    @(10, 12, 12, 6,  255, 255, 255, 225),
    @(14, 12, 4,  4,  255, 255, 255, 245)
)
$sparks = @(@(10, 26), @(20, 24), @(24, 18))   # 2x2 px each, near-white opaque

function Bake-Glow
{
    $bmp = New-Object System.Drawing.Bitmap($W, $H, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $rect = New-Object System.Drawing.Rectangle(0, 0, $W, $H)
    $data = $bmp.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::WriteOnly, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $stride = $data.Stride
    $bytes = New-Object byte[] ($stride * $H)
    for ($y = 0; $y -lt $H; $y++)
    {
        for ($x = 0; $x -lt $W; $x++)
        {
            $r = 0; $g = 0; $b = 0; $a = 0
            foreach ($band in $bands)
            {
                if ($x -ge $band[0] -and $x -lt ($band[0] + $band[2]) -and $y -ge $band[1] -and $y -lt ($band[1] + $band[3]))
                {
                    $r = $band[4]; $g = $band[5]; $b = $band[6]; $a = $band[7]
                }
            }
            foreach ($s in $sparks)
            {
                if ($x -ge $s[0] -and $x -lt ($s[0] + 2) -and $y -ge $s[1] -and $y -lt ($s[1] + 2)) { $r = 245; $g = 239; $b = 255; $a = 255 }
            }
            $off = $y * $stride + $x * 4
            $bytes[$off] = $b; $bytes[$off + 1] = $g; $bytes[$off + 2] = $r; $bytes[$off + 3] = $a
        }
    }
    [System.Runtime.InteropServices.Marshal]::Copy($bytes, 0, $data.Scan0, $bytes.Length)
    $bmp.UnlockBits($data)
    $bmp.Save($outFile, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
}

Bake-Glow
$sha1 = (Get-FileHash -Algorithm SHA256 $outFile).Hash
Bake-Glow
$sha2 = (Get-FileHash -Algorithm SHA256 $outFile).Hash
if ($sha1 -ne $sha2) { Write-Output "FAIL non-deterministic bake"; exit 1 }

$chk = New-Object System.Drawing.Bitmap($outFile)
try
{
    if ($chk.Width -ne $W -or $chk.Height -ne $H) { Write-Output ("FAIL size " + $chk.Width + "x" + $chk.Height); exit 1 }
    $inner = $chk.GetPixel(15, 13)      # inner core: white @ 245
    if ($inner.A -ne 245 -or $inner.R -ne 255) { Write-Output ("FAIL inner core " + $inner.A + "/" + $inner.R); exit 1 }
    $aura = $chk.GetPixel(9, 7)         # outer aura only: white @ 70
    if ($aura.A -ne 70 -or $aura.R -ne 255) { Write-Output ("FAIL outer aura " + $aura.A + "/" + $aura.R); exit 1 }
    $corner = $chk.GetPixel(0, 0)      # empty cell corner
    if ($corner.A -ne 0) { Write-Output ("FAIL corner not transparent " + $corner.A); exit 1 }
    $spark = $chk.GetPixel(10, 26)     # spark: near-white opaque
    if ($spark.A -ne 255 -or $spark.R -ne 245 -or $spark.G -ne 239 -or $spark.B -ne 255) { Write-Output ("FAIL spark " + $spark.A + "/" + $spark.R); exit 1 }
    $lit = 0
    for ($y = 0; $y -lt $H; $y++) { for ($x = 0; $x -lt $W; $x++) { if ($chk.GetPixel($x, $y).A -gt 0) { $lit++ } } }
    if ($lit -lt 200) { Write-Output ("FAIL lit pixel count too low: " + $lit); exit 1 }
    Write-Output ("BAKED being-glow.png 32x32 lit=$lit innerA=245 auraA=70 sparkA=255 sha12=" + $sha1.Substring(0, 12))
}
finally { $chk.Dispose() }
Write-Output "BEING-GLOW-BAKED-OK"
