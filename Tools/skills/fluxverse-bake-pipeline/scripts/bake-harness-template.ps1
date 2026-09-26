# bake-harness-template.ps1 -- FluxVerse bake-pipeline verification harness (v1, r171)
# Six faces A0-A5 (r168 order): ASCII audit / disk census+IHDR / SHA pin / double-run+distinct /
#   corner transparency / independent recount (non-trusting baker print).
# ASCII-only (GBK law). Copy to logs/devloop-r<N>-<name>-test.ps1 and replace FILL 1-8.
# Out-of-box = sample mode: bakes deterministic sample PNGs and gates them (machinery proof).
# PARAMETER-MODE CALL LAWS -- pinned here because they recurred in r180/r188
# AFTER the reference docs existed (this harness takes name FIRST):
#  L1 (r159c): Chk 'name' (cond) -- two args SPACE-SEPARATED. A comma between
#     the args binds ONE array to $name and leaves $cond null = silent all-FAIL.
#  L2 (r64/r95): inside @(...), parenthesize every COMPUTED element -- comma
#     binds tighter than binary operators. k=v tables build line by line
#     ($h[$k1] = <v1>; $h[$k2] = <v2>), never @() with embedded concatenation.
$ErrorActionPreference = 'Stop'
$script:PASS = 0
$script:FAIL = 0

function Chk($name, $cond) {   # L1 call law (r159c): Chk 'name' (cond) -- space-separated; comma between args = one array into $name, $cond null
  if ($cond) { $script:PASS = $script:PASS + 1; Write-Output ('PASS ' + $name) }
  else { $script:FAIL = $script:FAIL + 1; Write-Output ('FAIL ' + $name) }
}
function Sha12($path) { (Get-FileHash -Algorithm SHA256 -Path $path).Hash.Substring(0, 12) }
function PngWH($path) {
  $b = [IO.File]::ReadAllBytes($path)
  if ($b.Length -lt 24) { throw ('bad png header: ' + $path) }
  $w = ([int]$b[16] * 16777216) + ([int]$b[17] * 65536) + ([int]$b[18] * 256) + [int]$b[19]
  $h = ([int]$b[20] * 16777216) + ([int]$b[21] * 65536) + ([int]$b[22] * 256) + [int]$b[23]
  @{ w = $w; h = $h }
}
function IsAsciiFile($path) {
  $bytes = [IO.File]::ReadAllBytes($path)
  foreach ($x in $bytes) { if ($x -gt 127) { return $false } }
  return $true
}
function CountAlpha($path, $lo, $hi) {
  # independent recount: parameters, never a closure over caller locals (r164 silent-null family)
  $bmp = New-Object System.Drawing.Bitmap($path)
  $n = 0
  for ($y = 0; $y -lt $bmp.Height; $y++) {
    for ($x = 0; $x -lt $bmp.Width; $x++) {
      $a = $bmp.GetPixel($x, $y).A
      if (($a -ge $lo) -and ($a -le $hi)) { $n = $n + 1 }
    }
  }
  $bmp.Dispose()
  return $n
}

# Deterministic sample baker (sample mode only -- round mode: FILL 6 invokes the real baker).
# 24x12: fully transparent; rows 2..4 opaque band (alpha 255); rows 6..8 translucent band
#   (alpha 128, hue-variant); corners stay transparent.
function Bake-Sample($dir, $hue) {
  if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir | Out-Null }
  $bmp = New-Object System.Drawing.Bitmap(24, 12)
  $cOpaque = [System.Drawing.Color]::FromArgb(255, 30, 40, 50)
  $cGlass = [System.Drawing.Color]::FromArgb(128, $hue, 196, 255)
  for ($y = 0; $y -lt 12; $y++) {
    for ($x = 0; $x -lt 24; $x++) {
      $c = [System.Drawing.Color]::FromArgb(0, 0, 0, 0)
      if (($y -ge 2) -and ($y -le 4)) { $c = $cOpaque }
      if (($y -ge 6) -and ($y -le 8)) { $c = $cGlass }
      $bmp.SetPixel($x, $y, $c)
    }
  }
  $p = Join-Path $dir 'sample.png'
  $bmp.Save($p, [System.Drawing.Imaging.ImageFormat]::Png)
  $bmp.Dispose()
  return $p
}

Add-Type -AssemblyName System.Drawing

# ============ FILL 1-8: round inputs (defaults = sample mode) ============
$BakerPath = ''   # FILL 1: Tools/city/bake-<name>.ps1 under test ('' = audit this template)
$RunDir = Join-Path $env:TEMP 'fv-bake-harness-run1'    # FILL 2: baked output dir (round: real dir)
$RunDir2 = Join-Path $env:TEMP 'fv-bake-harness-run2'   # FILL 3a: double-run dir (byte-compare)
$RunDir3 = Join-Path $env:TEMP 'fv-bake-harness-run3'   # FILL 3b: variant dir (inter-different gate)
# FILL 4: expected files @{p,w,h} -- round mode lists real baked files
$Files = @(
  @{ p = (Join-Path $RunDir 'sample.png');  w = 24; h = 12 },
  @{ p = (Join-Path $RunDir2 'sample.png'); w = 24; h = 12 },
  @{ p = (Join-Path $RunDir3 'sample.png'); w = 24; h = 12 }
)
# FILL 5: pinned SHA12 per file path (round: committed/stable values; sample: pinned at runtime)
#   k=v build law (r95): line by line -- $ShaPins[$p1] = '<sha12>'; $ShaPins[$p2] = '<sha12>'
#   (never @() with embedded + concatenation: comma splits or merges elements silently)
$ShaPins = @{}
# FILL 6: bake invocation (round: invoke real baker twice into RunDir/RunDir2 + variant for distinct)
if (Test-Path $RunDir)  { Remove-Item $RunDir  -Recurse -Force }
if (Test-Path $RunDir2) { Remove-Item $RunDir2 -Recurse -Force }
if (Test-Path $RunDir3) { Remove-Item $RunDir3 -Recurse -Force }
Bake-Sample $RunDir 64 | Out-Null
Bake-Sample $RunDir2 64 | Out-Null
Bake-Sample $RunDir3 160 | Out-Null
# FILL 7: corner transparency files (round: real files whose corners must be alpha 0)
$CornerFiles = @((Join-Path $RunDir 'sample.png'), (Join-Path $RunDir2 'sample.png'))
# FILL 8: independent recount expectations (band alpha lo/hi + expected count per file)
$BandSpec = @(
  @{ p = (Join-Path $RunDir 'sample.png'); lo = 250; hi = 255; want = 72 },
  @{ p = (Join-Path $RunDir 'sample.png'); lo = 120; hi = 136; want = 72 }
)
# ========================================================================

Write-Output ('== bake harness: ' + $Files.Count + ' file(s) under gate ==')

# A0 ASCII audit (GBK law): baker body must be pure ASCII
$a0Target = $BakerPath
if ($a0Target -eq '') { $a0Target = $PSCommandPath }
Chk 'A0 baker ASCII' (IsAsciiFile $a0Target)

# A0b PSScriptAnalyzer advisor seat (T-FV-125, oss-harvest P-08): high-value
# rule subset only (auto-variable assignment / null-side comparison / BOM-less
# non-ASCII). Style/noise layer grandfather-excluded (declared at
# OH-20260926-fluxverse.md). Round mode gates the REAL baker; sample mode
# gates this template. Module missing = seat degrades with a VISIBLE note.
$psaClean = $true
if (Get-Module -ListAvailable -Name PSScriptAnalyzer) {
  $psaRules = @('PSAvoidAssignmentToAutomaticVariable', 'PSPossibleIncorrectComparisonWithNull', 'PSUseBOMForUnicodeEncodedFile')
  $psaHits = @(Invoke-ScriptAnalyzer -Path $a0Target -IncludeRule $psaRules -ErrorAction SilentlyContinue)
  foreach ($ph in $psaHits) { Write-Output ('  psa ' + $ph.RuleName + ' ' + $ph.ScriptName + ':' + $ph.Line + ' ' + $ph.Message) }
  $psaClean = ($psaHits.Count -eq 0)
} else {
  Write-Output '  note: PSScriptAnalyzer not installed - A0b advisor seat skipped (Install-Module PSScriptAnalyzer -Scope CurrentUser)'
}
Chk 'A0b PSA high-value subset clean' ($psaClean)

# A1 disk census + IHDR (no path guessing: read PNG header directly)
foreach ($f in $Files) {
  Chk ('A1 exists ' + (Split-Path $f.p -Leaf)) (Test-Path $f.p)
  if (Test-Path $f.p) {
    $dim = PngWH $f.p
    Chk ('A1 IHDR ' + (Split-Path $f.p -Leaf)) (($dim.w -eq $f.w) -and ($dim.h -eq $f.h))
  }
}

# A2 SHA pins (stale refuse face: pinned values must reproduce byte-identical)
if ($ShaPins.Count -gt 0) {
  foreach ($k in $ShaPins.Keys) {
    Chk ('A2 pin ' + (Split-Path $k -Leaf)) ((Sha12 $k) -eq $ShaPins[$k])
  }
} else {
  Write-Output '  note: sample mode pins at runtime (round mode: pin committed SHA12 in FILL 5)'
  $k0 = $Files[0].p
  $pin = Sha12 $k0
  Chk 'A2 runtime pin re-read stable' ((Sha12 $k0) -eq $pin)
}

# A3 double-run idempotence (determinism iron law: two independent bakes byte-identical)
Chk 'A3 double-run byte-identical' ((Sha12 $Files[0].p) -eq (Sha12 $Files[1].p))
Chk 'A3 double-run is a true second bake' ((Resolve-Path $Files[0].p).Path -ne (Resolve-Path $Files[1].p).Path)
Chk 'A3 variant inter-different' ((Sha12 $Files[0].p) -ne (Sha12 $Files[2].p))

# A4 corner transparency (independent read: GetPixel, not baker print)
foreach ($cf in $CornerFiles) {
  $bmp = New-Object System.Drawing.Bitmap($cf)
  $tl = $bmp.GetPixel(0, 0).A
  $tr = $bmp.GetPixel($bmp.Width - 1, 0).A
  $bl = $bmp.GetPixel(0, $bmp.Height - 1).A
  $br = $bmp.GetPixel($bmp.Width - 1, $bmp.Height - 1).A
  $bmp.Dispose()
  Chk ('A4 corners transparent ' + (Split-Path $cf -Leaf)) (($tl -eq 0) -and ($tr -eq 0) -and ($bl -eq 0) -and ($br -eq 0))
}

# A5 independent recount (non-trusting baker print: re-derive counts from disk pixels)
foreach ($b in $BandSpec) {
  $n = CountAlpha $b.p $b.lo $b.hi
  Chk ('A5 recount alpha ' + $b.lo + '..' + $b.hi + ' ' + (Split-Path $b.p -Leaf)) ($n -eq $b.want)
}

Write-Output ('== verdict: PASS=' + $script:PASS + ' FAIL=' + $script:FAIL + ' ==')
if ($script:FAIL -gt 0) { Write-Output 'VERDICT: RED'; exit 1 }
Write-Output 'VERDICT: ALL GREEN'
exit 0
