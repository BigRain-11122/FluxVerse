# FluxVerse City grounding-shadow baker (r87: P-69 slice 3 - the P-69/CEO fix
# law "NPC grounding with a contact shadow / landing mark" needs a small dark
# ellipse under every street resident and robot; the r34/r45 screenshots
# showed the whole cast floating for lack of one).
# ENCODING LAW: ASCII-only script; no CJK anywhere (PS5.1 GBK law, r18 pattern).
# WHY PRE-BAKE: scene-persisted sprites must reference SAVED assets (r14 lesson:
# runtime-created textures do not survive a save/reload); PS GDI+ bakes the two
# ellipses once into transparent PNGs the proofs mount like any pack sprite
# (same channel as bake-resident-plates.ps1 r40).
# SPEC (R-20260924-m1-visual-fix sec.2-3 / city-core-design sec.8):
#   shadow-res.png  48x12 px @ PPU24 -> exactly 2.0 x 0.5 world units, native
#                  under the 2u residents, scale stays 1 = zero resampling
#                  (r37 divisor law; importer table: residents-crowd/ -> 24).
#   shadow-res32.png 32x8  px @ PPU24 -> 1.33 x 0.33 world units, native under
#                  the 1.33u batch1 paper-doll bodies (r97: the r96 survey
#                  flagged the 48x12 blob oversized for the 32px class; same
#                  proportions scaled 2/3 - the 48x12 original stays on disc
#                  for the legacy 2u seats until the r98 table swap retires
#                  them, discard-on-record law P-21(4)).
#   shadow-bot.png  16x6  px @ PPU16 -> exactly 1.0 x 0.375 world units, native
#                  under the 1u robots (tophat-robot/ -> PPU16 by table default).
# PIXEL LAW: per-pixel radial falloff (pure math, no GDI+ pen/brush), alpha
# center 105 -> edge 0 over the last ~2 px, fully deterministic: same inputs ->
# byte-identical PNGs; re-bake SHA256 compare gate (r24/r38 idempotence law).
# PLACEMENT (derives in ResidentRules/RobotRules; proofs gate the mount):
#   shadow center = feet line - 0.10u (residents) / -0.06u (robots): the blob
#   reads as a puddle the feet stand IN; the top sliver hides behind the
#   character sprite (street order 7 draws over shadow order 5), the rest
#   spills south of the feet line onto the tile in front.
# Sorting: shadow order 5 = above Props 4, below signs 6 (five-color law
# untouched: black ambient occlusion, not a functional light). No 3D.
$ErrorActionPreference = "Stop"
$repo = "C:\Users\sjs20\Desktop\FluxGroup\gaming\FluxVerse"
$resDir = Join-Path $repo "City\Assets\ArtPacks\residents-crowd\shadows"
$botDir = Join-Path $repo "City\Assets\ArtPacks\tophat-robot\shadows"
if (-not (Test-Path $resDir)) { New-Item -ItemType Directory -Path $resDir | Out-Null }
if (-not (Test-Path $botDir)) { New-Item -ItemType Directory -Path $botDir | Out-Null }
Add-Type -AssemblyName System.Drawing

function Bake-Shadow($path, $w, $h, $rx, $ry, $maxA)
{
    $bmp = New-Object System.Drawing.Bitmap($w, $h, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $rect = New-Object System.Drawing.Rectangle(0, 0, $w, $h)
    $data = $bmp.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::WriteOnly, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $stride = $data.Stride
    $bytes = New-Object byte[] ($stride * $h)
    [System.Runtime.InteropServices.Marshal]::Copy($data.Scan0, $bytes, 0, $bytes.Length)
    $cx = ($w - 1) / 2.0
    $cy = ($h - 1) / 2.0
    for ($y = 0; $y -lt $h; $y++)
    {
        for ($x = 0; $x -lt $w; $x++)
        {
            # normalized radial distance inside the ellipse (1.0 = rim)
            $nx = ($x - $cx) / $rx
            $ny = ($y - $cy) / $ry
            $d = [Math]::Sqrt($nx * $nx + $ny * $ny)
            $a = 0
            if ($d -lt 1.0)
            {
                $core = 1.0 - $d           # 1 at center -> 0 at rim
                $a = [int]([Math]::Round($maxA * [Math]::Pow($core, 1.4)))
                if ($a -gt 255) { $a = 255 }
                if ($a -lt 0) { $a = 0 }
                if ($a -eq 0 -and $d -lt 0.75) { $a = 1 }   # inner area never fully empty
            }
            $off = $y * $stride + $x * 4
            $bytes[$off] = 0        # B
            $bytes[$off + 1] = 0    # G
            $bytes[$off + 2] = 0    # R (black shadow)
            $bytes[$off + 3] = $a   # A
        }
    }
    [System.Runtime.InteropServices.Marshal]::Copy($bytes, 0, $data.Scan0, $bytes.Length)
    $bmp.UnlockBits($data)
    $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
}

$resPath = Join-Path $resDir "shadow-res.png"
$res32Path = Join-Path $resDir "shadow-res32.png"
$botPath = Join-Path $botDir "shadow-bot.png"
Bake-Shadow $resPath 48 12 22.0 4.6 125
Bake-Shadow $res32Path 32 8 14.5 3.0 125
Bake-Shadow $botPath 16 6 7.0 2.2 125

# verify + report (sizes, alpha center/rim, determinism SHA256)
foreach ($p in @($resPath, $res32Path, $botPath))
{
    $probe = New-Object System.Drawing.Bitmap($p)
    $cw = $probe.Width; $ch = $probe.Height
    $centerA = $probe.GetPixel([int](($cw - 1) / 2), [int](($ch - 1) / 2)).A
    $cornerA = $probe.GetPixel(0, 0).A
    if ($centerA -lt 80) { Write-Output "FAIL center alpha too low: $p ($centerA)"; exit 1 }
    if ($cornerA -ne 0) { Write-Output "FAIL corner not transparent: $p ($cornerA)"; exit 1 }
    $probe.Dispose()
    $sha = (Get-FileHash -Algorithm SHA256 $p).Hash
    Write-Output ("BAKED {0} {1}x{2} centerA={3} cornerA=0 sha12={4}" -f (Split-Path $p -Leaf), $cw, $ch, $centerA, $sha.Substring(0, 12))
}
Write-Output "SHADOWS-BAKED-OK"
