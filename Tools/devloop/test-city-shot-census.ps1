# test-city-shot-census.ps1 - sandbox proof for the city-shot census (main#47)
# ---------------------------------------------------------------------------
# r706 put the city-frame guards (panel name / shape) inside the builder, where
# verify could not see them: a half-page capture saved under an innocent name
# still reached the card and nothing reported it. r707 moved the definition into
# Tools\devloop\city-shot-shape.ps1, added a family registry as the third guard,
# and made Tools\perceptor\verify.ps1 run the same definition as a census.
#
# This sandbox builds six synthetic qa/ images - two real frames, one full-page
# strip, one phone strip, one half page (the case shape alone cannot catch) and
# one panel selfie - then asserts:
#   a) the module's verdict per file (reason + keep),
#   b) the real verify.ps1 run reports the census in its stdout, naming the
#      half-page capture and staying quiet about the registered frames.
# ASCII-only law: no CJK in this file.

$ErrorActionPreference = 'Stop'
$module = Join-Path $PSScriptRoot 'city-shot-shape.ps1'
$verify = Join-Path (Split-Path -Parent $PSScriptRoot) 'perceptor\verify.ps1'
foreach ($p in @($module, $verify)) {
    if (-not (Test-Path -LiteralPath $p)) { Write-Output ('setup FAIL: missing ' + $p); exit 1 }
}
. $module

$sandbox = Join-Path ([System.IO.Path]::GetTempPath()) ('fv-shotcensus-' + $PID)
$shots = Join-Path $sandbox 'qa'
New-Item -ItemType Directory -Path $shots -Force | Out-Null

Add-Type -AssemblyName System.Drawing -ErrorAction Stop
function New-Fixture([string]$name, [int]$w, [int]$h) {
    $bmp = New-Object System.Drawing.Bitmap($w, $h)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    try {
        $g.Clear([System.Drawing.Color]::FromArgb(30, 40, 60))
        $g.FillRectangle([System.Drawing.Brushes]::Teal, 0, 0, [int]($w / 2), [int]($h / 4))
    } finally {
        $g.Dispose()
    }
    try { $bmp.Save((Join-Path $shots $name), [System.Drawing.Imaging.ImageFormat]::Png) }
    finally { $bmp.Dispose() }
}

New-Fixture 'city-normal-a.png'     1400  900   # real landscape frame -> keep
New-Fixture 'city-portrait-a.png'    800 1200   # registered portrait -> keep
New-Fixture 'city-strip-full.png'   1400 4600   # registered but long strip -> shape
New-Fixture '_narrow-before.png'     390 2000   # unregistered phone strip -> unnamed
New-Fixture 'halfpage-20261028.png' 1000 1800   # THE main#47 case -> unnamed + shape ok
New-Fixture 'panel-selfie.png'      1400  900   # panel's own screenshot -> panel

$pass = 0
$fail = 0
function Check([string]$name, [bool]$cond) {
    if ($cond) { Write-Output ('  PASS ' + $name); $script:pass++ }
    else { Write-Output ('  FAIL ' + $name); $script:fail++ }
}

# ---------- a) module verdicts ----------
$rows = @(Get-CityShotAudit -Dir $shots)
function Reason([string]$name) {
    $r = @($rows | Where-Object { $_.name -eq $name }) | Select-Object -First 1
    if ($null -eq $r) { return 'MISSING' }
    return [string]$r.reason
}
Check 'six candidates enumerated' ($rows.Count -eq 6)
Check 'landscape frame kept'      ((Reason 'city-normal-a.png') -eq 'ok')
Check 'portrait frame kept'       ((Reason 'city-portrait-a.png') -eq 'ok')
Check 'long strip rejected'       ((Reason 'city-strip-full.png') -eq 'shape')
Check 'phone strip unregistered'  ((Reason '_narrow-before.png') -eq 'unnamed')
Check 'half page unregistered'    ((Reason 'halfpage-20261028.png') -eq 'unnamed')
Check 'panel selfie rejected'     ((Reason 'panel-selfie.png') -eq 'panel')
$kept = @($rows | Where-Object { $_.keep })
Check 'exactly two frames kept'   ($kept.Count -eq 2)
Check 'kept set is the frames'    (((@($kept | ForEach-Object { $_.name }) | Sort-Object) -join ',') -eq 'city-normal-a.png,city-portrait-a.png')
$half = @($rows | Where-Object { $_.name -eq 'halfpage-20261028.png' })[0]
Check 'half page passes shape'    ($half.shape_ok)
Check 'half page not kept'        (-not $half.keep)

# ---------- b) real verify.ps1 wiring ----------
$env:FLUXVERSE_SHOT_DIR = $shots
try {
    $log = (& powershell -NoProfile -ExecutionPolicy Bypass -File $verify) -join "`n"
} finally {
    Remove-Item Env:\FLUXVERSE_SHOT_DIR -ErrorAction SilentlyContinue
}
Check 'verify emitted census line' ($log -match 'city-shot-census:')
# unregistered counts only images the shape gate would let through: the half
# page (1000x1800). The 390-wide phone strip is already excluded by shape, so
# naming it would be noise.
Check 'census counts match' ($log -match 'city-shot-census: images=6 inlinable=2 panel=1 shape_skipped=1 unreadable=0 unregistered=1')
Check 'census warns (not fails)' ($log -match 'VERIFY WARN: city-shot-census:')
Check 'half page named in warn' ($log -match 'VERIFY WARN: city-shot halfpage-20261028\.png 1000x1800')
Check 'phone strip not named' (-not ($log -match 'VERIFY WARN: city-shot _narrow-before'))
Check 'kept frames not named' (-not ($log -match 'VERIFY WARN: city-shot city-(normal|portrait)-a'))
Check 'census emits no FAIL token' (-not ($log -match 'city-shot.*FAIL'))

# ---------- c) the live qa/ is clean under the same rule ----------
$liveRows = @(Get-CityShotAudit -Dir (Join-Path (Split-Path -Parent (Split-Path -Parent $PSScriptRoot)) 'qa'))
$liveUnreg = @($liveRows | Where-Object { $_.reason -eq 'unnamed' -and $_.shape_ok })
Write-Output ('  note live qa/: images=' + $liveRows.Count + ' inlinable=' + (@($liveRows | Where-Object { $_.keep }).Count) + ' unregistered_shape_ok=' + $liveUnreg.Count)
foreach ($u in $liveUnreg) { Write-Output ('  note live unregistered: ' + $u.name + ' ' + $u.w + 'x' + $u.h) }

Remove-Item -LiteralPath $sandbox -Recurse -Force -ErrorAction SilentlyContinue
Write-Output ('test-city-shot-census: ' + $pass + ' passed, ' + $fail + ' failed (of ' + ($pass + $fail) + ')')
if ($fail -gt 0) { exit 1 }
exit 0