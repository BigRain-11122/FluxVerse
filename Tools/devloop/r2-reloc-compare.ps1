# Side-by-side comparison sheet for the R2 relocation rehearsal (main#58 / main#54).
# Top row = the current scene frames (district sits on the lake), bottom row = the
# same district shifted to a candidate dry anchor. Labels are ASCII on purpose
# (PS5.1 GBK trap); the numbers must come from r2-site-check.py, not from here.
param(
  [Parameter(Mandatory = $true)][string]$BeforePrefix,
  [Parameter(Mandatory = $true)][string]$AfterPrefix,
  [Parameter(Mandatory = $true)][string]$Out,
  [string]$BeforeLabel = 'BEFORE',
  [string]$AfterLabel  = 'AFTER',
  [int]$CellWidth = 620
)
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$site = Join-Path $root 'qa'
$siteDir = Join-Path $site 'site'

$slugs = @('overview', 'gamedistrict', 'street')
function Find-Frame {
  param([string]$Prefix, [string]$Slug)
  $p = Join-Path $site ($Prefix + '-' + $Slug + '.jpg')
  if (Test-Path $p) { return $p }
  $p2 = Join-Path $siteDir ($Prefix + '-' + $Slug + '.jpg')
  if (Test-Path $p2) { return $p2 }
  throw "frame not found for $Prefix / $Slug"
}

$frames = @()
foreach ($s in $slugs) { $frames += ,@((Find-Frame -Prefix $BeforePrefix -Slug $s), (Find-Frame -Prefix $AfterPrefix -Slug $s)) }

Add-Type -AssemblyName System.Drawing
$jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
  Where-Object { $_.MimeType -eq 'image/jpeg' } | Select-Object -First 1

$first = [System.Drawing.Image]::FromFile($frames[0][0])
try { $cellH = [int][Math]::Round($first.Height * ($CellWidth / $first.Width)) } finally { $first.Dispose() }
$labelH = 26
$W = $CellWidth * 3
$H = ($cellH + $labelH) * 2
$bmp = New-Object System.Drawing.Bitmap($W, $H)
$g = [System.Drawing.Graphics]::FromImage($bmp)
try {
  $g.Clear([System.Drawing.Color]::FromArgb(24, 24, 28))
  $font = New-Object System.Drawing.Font('Consolas', 13)
  $brush = [System.Drawing.Brushes]::WhiteSmoke
  for ($row = 0; $row -lt 2; $row++) {
    $y = $row * ($cellH + $labelH)
    $label = if ($row -eq 0) { $BeforeLabel } else { $AfterLabel }
    $g.DrawString($label, $font, $brush, 8, $y + 4)
    for ($col = 0; $col -lt 3; $col++) {
      $img = [System.Drawing.Image]::FromFile($frames[$col][$row])
      try {
        $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $g.DrawImage($img, $col * $CellWidth, $y + $labelH, $CellWidth, $cellH)
      } finally { $img.Dispose() }
    }
  }
  $ep = New-Object System.Drawing.Imaging.EncoderParameters(1)
  $ep.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [int64]80)
  $outPath = Join-Path $root $Out
  $dir = Split-Path -Parent $outPath
  if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Force -Path $dir | Out-Null }
  $bmp.Save($outPath, $jpegCodec, $ep)
  $ep.Dispose()
  Write-Output ("COMPARE_OK " + $outPath + " " + $W + "x" + $H + " " + (Get-Item $outPath).Length + "B")
} finally { $g.Dispose(); $bmp.Dispose() }