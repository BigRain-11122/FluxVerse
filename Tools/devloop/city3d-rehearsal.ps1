# R2 relocation rehearsal (main#58). Moves the whole R2_AD-021_District to a
# candidate anchor computed by r2-site-check.py, captures three comparison frames,
# and NEVER saves the scene -- the move/no-move decision belongs to main#54.
# Frames land in qa/site/ (NOT the registered city3d- family): a rehearsal is a
# preview of a layout we have not adopted, so it must never impersonate a real
# city frame on the product panel (r714 family-registry rule).
# ASCII-only (PS5.1 GBK trap); Chinese content belongs in UTF-8 data files.
param(
  [Parameter(Mandatory = $true)][double]$AnchorX,
  [Parameter(Mandatory = $true)][double]$AnchorZ,
  [string]$Tag = 'A1',
  [int]$Width = 1240,
  [int]$Quality = 80,
  [int]$TimeoutMin = 8
)
$ErrorActionPreference = 'Stop'

$exe  = 'C:\Program Files\Tuanjie\Hub\Editor\2022.3.62t15\Editor\Tuanjie.exe'
$root = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$proj = Join-Path $root 'City3D'
$site = Join-Path $root 'qa\site'
$stg  = Join-Path $root 'City3D-staging'
$shots = Join-Path $stg 'shots'
$log  = Join-Path $stg 'r2-rehearsal.log'
$anchorFile = Join-Path $stg 'rehearsal-anchor.txt'

if (-not (Test-Path $exe))  { Write-Output "REH_FAIL missing editor: $exe"; exit 1 }
if (-not (Test-Path $proj)) { Write-Output "REH_FAIL missing project: $proj"; exit 1 }
New-Item -ItemType Directory -Force -Path $site | Out-Null
New-Item -ItemType Directory -Force -Path $stg | Out-Null
New-Item -ItemType Directory -Force -Path $shots | Out-Null
Remove-Item $log -ErrorAction SilentlyContinue

$inv = [System.Globalization.CultureInfo]::InvariantCulture
$line = $AnchorX.ToString('F2', $inv) + ',' + $AnchorZ.ToString('F2', $inv) + ',' + $Tag
Set-Content -LiteralPath $anchorFile -Value $line -Encoding ASCII

# An open GUI editor on this project holds the lock and makes batchmode exit silently.
$targets = @(Get-CimInstance Win32_Process -Filter "Name='Tuanjie.exe'" | Where-Object {
  $_.CommandLine -and $_.CommandLine -like '*gaming\FluxVerse\City3D*' -and $_.CommandLine -notlike '*batchmode*'
})
if ($targets.Count -gt 0) {
  Write-Output ("REH_ABORT gui_open pid=" + (($targets | ForEach-Object { $_.ProcessId }) -join ','))
  exit 1
}

$runStart = Get-Date
$argList = @('-batchmode','-projectpath',$proj,'-executeMethod','CityRebuildR2.RehearsalShots','-quit','-logFile',$log)
$proc = Start-Process -FilePath $exe -ArgumentList $argList -PassThru
if (-not $proc.WaitForExit($TimeoutMin * 60 * 1000)) {
  $proc.Kill()
  Write-Output ("REH_TIMEOUT_${TimeoutMin}MIN")
  exit 1
}

$doneMarker = (Test-Path $log) -and (Select-String -Path $log -Pattern 'CITY3D_REHEARSAL_DONE' -SimpleMatch -Quiet)
if (-not $doneMarker) {
  Write-Output ("REH_NOT_OK exit=" + $proc.ExitCode + " marker=0")
  if (Test-Path $log) {
    Select-String -Path $log -Pattern 'error CS|CITY3D_REHEARSAL_FAIL|Exception|Aborting' |
      Select-Object -Last 10 | ForEach-Object { $_.Line }
  }
  exit 1
}

# Only accept frames produced by THIS run (older rehearsal frames must not be reported fresh).
$frames = @(Get-ChildItem -LiteralPath $shots -Filter ('R2R_' + $Tag + '_*.png') -ErrorAction SilentlyContinue |
  Where-Object { $_.LastWriteTime -ge $runStart.AddSeconds(-5) } |
  Sort-Object LastWriteTimeUtc -Descending)
if ($frames.Count -eq 0) { Write-Output 'REH_NO_FRESH_PNG'; exit 1 }

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
  ('R2R_' + $Tag + '_L0_overview.png')       = 'overview'
  ('R2R_' + $Tag + '_L1_gamedistrict.png')   = 'gamedistrict'
  ('R2R_' + $Tag + '_L2_street.png')         = 'street'
}
$written = 0
foreach ($f in $frames) {
  $slug = $slugs[$f.Name]
  if (-not $slug) { $slug = [System.IO.Path]::GetFileNameWithoutExtension($f.Name).ToLowerInvariant() }
  $name = 'r2-reloc-' + $Tag + '-' + $stamp + '-bm-a-' + $slug + '.jpg'
  $out  = Join-Path $site $name
  Convert-ToQaJpeg -Png $f.FullName -W $Width -Q $Quality -Out $out
  $size = (Get-Item $out).Length
  Write-Output ("REH_SHOT " + $name + " " + $size + "B")
  $written++
}
Write-Output ("REH_OK tag=" + $Tag + " anchor=(" + $AnchorX.ToString('F1', $inv) + "," + $AnchorZ.ToString('F1', $inv) + ") fresh_png=" + $frames.Count + " qa_jpg=" + $written + " scene_saved=0")
if ($written -lt 3) { exit 1 }
exit 0