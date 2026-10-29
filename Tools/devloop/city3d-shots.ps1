# City3D shot refresh (main#17/main#49). Batchmode capture of the already-built
# CityRebuild_R2 scene via CityRebuildR2.CaptureShots (no rebuild, no scene save),
# then downscale the judge frames into qa/ as JPEG with the registered `city3d-`
# family prefix so the city panel shot card (Resolve-CityShots) can inline them.
# ASCII-only (PS5.1 GBK trap); Chinese content belongs in UTF-8 data files.
param(
  [int]$Width = 1240,
  [int]$Quality = 80,
  [int]$TimeoutMin = 8,
  [switch]$KeepPng
)
$ErrorActionPreference = 'Stop'

$exe  = 'C:\Program Files\Tuanjie\Hub\Editor\2022.3.62t15\Editor\Tuanjie.exe'
$root = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$proj = Join-Path $root 'City3D'
$qa   = Join-Path $root 'qa'
$stg  = Join-Path $root 'City3D-staging'
$shots = Join-Path $stg 'shots'
$log  = Join-Path $stg 'r2-shots.log'

if (-not (Test-Path $exe))  { Write-Output "SHOTS_FAIL missing editor: $exe"; exit 1 }
if (-not (Test-Path $proj)) { Write-Output "SHOTS_FAIL missing project: $proj"; exit 1 }
New-Item -ItemType Directory -Force -Path $qa | Out-Null
New-Item -ItemType Directory -Force -Path $stg | Out-Null
Remove-Item $log -ErrorAction SilentlyContinue

# An open GUI editor on this project holds the lock and makes batchmode exit silently.
$targets = @(Get-CimInstance Win32_Process -Filter "Name='Tuanjie.exe'" | Where-Object {
  $_.CommandLine -and $_.CommandLine -like '*gaming\FluxVerse\City3D*' -and $_.CommandLine -notlike '*batchmode*'
})
if ($targets.Count -gt 0) {
  Write-Output ("SHOTS_ABORT gui_open pid=" + (($targets | ForEach-Object { $_.ProcessId }) -join ','))
  exit 1
}

$runStart = Get-Date
$argList = @('-batchmode','-projectpath',$proj,'-executeMethod','CityRebuildR2.CaptureShots','-quit','-logFile',$log)
$proc = Start-Process -FilePath $exe -ArgumentList $argList -PassThru
if (-not $proc.WaitForExit($TimeoutMin * 60 * 1000)) {
  $proc.Kill()
  Write-Output ("SHOTS_TIMEOUT_${TimeoutMin}MIN")
  exit 1
}

$doneMarker = (Test-Path $log) -and (Select-String -Path $log -Pattern 'CITY3D_SHOTS_DONE' -SimpleMatch -Quiet)
if (-not $doneMarker) {
  Write-Output ("SHOTS_NOT_OK exit=" + $proc.ExitCode + " marker=0")
  if (Test-Path $log) {
    Select-String -Path $log -Pattern 'error CS|CITY3D_SHOTS_FAIL|Exception|Aborting' |
      Select-Object -Last 10 | ForEach-Object { $_.Line }
  }
  exit 1
}

# Only accept frames produced by THIS run (older staging shots must not be reported fresh).
$frames = @(Get-ChildItem -LiteralPath $shots -Filter 'R2_*.png' -ErrorAction SilentlyContinue |
  Where-Object { $_.LastWriteTime -ge $runStart.AddSeconds(-5) } |
  Sort-Object LastWriteTimeUtc -Descending)
if ($frames.Count -eq 0) { Write-Output 'SHOTS_NO_FRESH_PNG'; exit 1 }

. (Join-Path $PSScriptRoot 'city-shot-shape.ps1')
Add-Type -AssemblyName System.Drawing
$jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
  Where-Object { $_.MimeType -eq 'image/jpeg' } | Select-Object -First 1
$stamp = Get-Date -Format 'yyyyMMdd-HHmm'

function Convert-ToQaJpeg {
  param([string]$Png, [int]$W, [int]$Q, [string]$Out)
  $img = [System.Drawing.Image]::FromFile($Png)
  try {
    $h = [int][Math]::Round($img.Height * ($W / $img.Width))
    $bmp = New-Object System.Drawing.Bitmap($W, $h)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    try {
      $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
      $g.DrawImage($img, 0, 0, $W, $h)
    } finally { $g.Dispose() }
    $ep = New-Object System.Drawing.Imaging.EncoderParameters(1)
    try {
      $ep.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter(
        [System.Drawing.Imaging.Encoder]::Quality, [int64]$Q)
      $bmp.Save($Out, $jpegCodec, $ep)
    } finally { $ep.Dispose(); $bmp.Dispose() }
  } finally { $img.Dispose() }
}

$slugs = @{
  'R2_L0_overview.png'        = 'overview'
  'R2_L1_gamedistrict.png'    = 'gamedistrict'
  'R2_L2_street.png'          = 'street'
  'R2_house_front.png'        = 'housefront'
  'R2_showcase_front.png'     = 'showcase'
  'R2_interior_cutaway.png'   = 'cutaway'
}
$written = 0
$skipped = 0
foreach ($f in $frames) {
  $slug = $slugs[$f.Name]
  if (-not $slug) { $slug = [System.IO.Path]::GetFileNameWithoutExtension($f.Name).ToLowerInvariant() }
  $name = 'city3d-shots-' + $stamp + '-bm-a-' + $slug + '.jpg'
  $out  = Join-Path $qa $name
  Convert-ToQaJpeg -Png $f.FullName -W $Width -Q $Quality -Out $out
  $v = Get-CityShotVerdict -Name $name -Path $out
  if (-not $v.keep) {
    Write-Output ("SHOT_SHAPE_REJECT " + $name + " reason=" + $v.reason)
    Remove-Item -LiteralPath $out -ErrorAction SilentlyContinue
    $skipped++
    continue
  }
  $size = (Get-Item $out).Length
  Write-Output ("SHOT " + $name + " " + $v.w + "x" + $v.h + " " + $size + "B")
  $written++
  if (-not $KeepPng) { }
}
Write-Output ("SHOTS_OK fresh_png=" + $frames.Count + " qa_jpg=" + $written + " rejected=" + $skipped)
if ($written -eq 0) { exit 1 }
exit 0