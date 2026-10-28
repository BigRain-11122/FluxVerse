# test-city-shot-shape.ps1 - sandbox proof for the city-shot shape filter
# ------------------------------------------------------------------------
# Queue main#46: Resolve-CityShots used to exclude page screenshots only by
# filename ("panel" anywhere). r705 proved that too brittle - a phone-viewport
# capture (_narrow-before.png, 390 wide) was inlined as a "city frame" and grew
# the panel from 157KB to 533KB. The fix adds a shape test: width < 421 and
# aspect taller than 2:1 are page evidence, not city frames.
#
# This sandbox builds five synthetic images - a normal landscape frame, a phone
# strip, a full-page long strip, a portrait frame and a panel selfie - then runs
# the real builder against them and asserts only the two real city frames
# survive, the two strips are counted as skipped, and no rejected filename leaks
# into the output HTML.
# ASCII-only law: no CJK in this file.

$ErrorActionPreference = 'Stop'
$builder = Join-Path $PSScriptRoot 'build-city-panel.ps1'
if (-not (Test-Path -LiteralPath $builder)) { Write-Output 'setup FAIL: builder missing'; exit 1 }

$repoDir = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$snap = Join-Path $repoDir 'world-public\city-snapshot.json'
$face = Join-Path $repoDir 'state\status-face.json'
foreach ($p in @($snap, $face)) {
    if (-not (Test-Path -LiteralPath $p)) { Write-Output ('setup FAIL: input missing ' + $p); exit 1 }
}

$sandbox = Join-Path ([System.IO.Path]::GetTempPath()) ('fv-shotshape-' + $PID)
$shots = Join-Path $sandbox 'shots'
New-Item -ItemType Directory -Path $shots -Force | Out-Null
$outHtml = Join-Path $sandbox 'panel.html'

Add-Type -AssemblyName System.Drawing -ErrorAction Stop

function New-Fixture([string]$name, [int]$w, [int]$h, [datetime]$mtime) {
    $bmp = New-Object System.Drawing.Bitmap($w, $h)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    try {
        $g.Clear([System.Drawing.Color]::FromArgb(30, 40, 60))
        $g.FillRectangle([System.Drawing.Brushes]::Teal, 0, 0, [int]($w / 2), [int]($h / 2))
    } finally {
        $g.Dispose()
        $bmp.Dispose()
    }
    # Save through a stream so System.Drawing releases the bitmap first.
    $bmp2 = New-Object System.Drawing.Bitmap($w, $h)
    $path = Join-Path $shots $name
    $bmp2.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp2.Dispose()
    [System.IO.File]::SetLastWriteTimeUtc($path, $mtime)
}

$base = [datetime]::UtcNow.AddHours(-1)
# Oldest -> newest: rejected ones are NEWER so name-only ordering would have
# picked them first (that is exactly the r705 failure).
New-Fixture 'city-normal-a.png'    1400  900 $base
New-Fixture 'city-portrait-a.png'   800 1200 $base.AddMinutes(1)
New-Fixture 'city-panel-selfie.png' 1400  900 $base.AddMinutes(2)
New-Fixture 'city-strip-full.png'   1400 4600 $base.AddMinutes(3)
New-Fixture '_narrow-before.png'     390 2000 $base.AddMinutes(4)

$log = (& powershell -NoProfile -ExecutionPolicy Bypass -File $builder `
        -ShotDir $shots -OutPath $outHtml) -join "`n"

$pass = 0
$fail = 0
function Check([string]$name, [bool]$cond) {
    if ($cond) { Write-Output ('  PASS ' + $name); $script:pass++ }
    else { Write-Output ('  FAIL ' + $name); $script:fail++ }
}

Check 'builder reported PANEL OK' ($log -match 'PANEL OK')
Check 'two real city frames kept' ($log -match 'shots=2(?!\d)')
Check 'both kept frames inlined' ($log -match 'shots_inlined=2(?!\d)')
Check 'two strips counted as skipped' ($log -match 'shots_skipped=2(?!\d)')
Check 'kept payload stays small' ($log -match 'shots_kb=(\d+)' -and [int]$Matches[1] -le 40)

$html = ''
if (Test-Path -LiteralPath $outHtml) { $html = [System.IO.File]::ReadAllText($outHtml) }
Check 'output html written' ($html.Length -gt 1000)
Check 'normal frame present in the page' ($html.Contains('city-normal-a.png'))
Check 'portrait frame present in the page' ($html.Contains('city-portrait-a.png'))
Check 'phone strip never inlined' (-not $html.Contains('_narrow-before.png'))
Check 'long strip never inlined' (-not $html.Contains('city-strip-full.png'))
Check 'panel selfie never inlined' (-not $html.Contains('city-panel-selfie.png'))

Remove-Item -LiteralPath $sandbox -Recurse -Force -ErrorAction SilentlyContinue
Write-Output ('test-city-shot-shape: ' + $pass + ' passed, ' + $fail + ' failed (of ' + ($pass + $fail) + ')')
if ($fail -gt 0) { exit 1 }
exit 0