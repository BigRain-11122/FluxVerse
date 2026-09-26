# FluxVerse r175: bake 00:10 art-rectify order S2 landmark silhouettes
# (T-FV-002, TECH sec9 r174 construction order). Three skyline pieces
# per the order's Shanghai-skyline clause (magnolia bud / Shanghai Center
# twist / Oriental Pearl double spheres), facade-family alpha-sprite
# overlay route (r151 bake-facade-skin paradigm, order-3 persisted mounts,
# rect envelopes byte-equal to facades-manifest: quant 120x192 = 5x8u,
# media 144x144 = 6x6u @PPU24; crown 48x24 = 2x1u inside tip zone
# world y18..19, no added height per r174 note 5a).
# Piece recipes:
#   quant-twist 120x192: base-wide top-narrow taper (edge arcs), two gold
#     spiral seams twisting up (five-color QUANT gold, muted 196,150,44 -
#     cyan-white hero glow stays brain-tower-CEO-exclusive, r174 note 5b),
#     2x3 micro-window grid, dark plinth. Unlit law: avg>80 = gold only.
#   media-pearl 144x144: vertical axis, tripod splayed legs, big lower
#     sphere r34, small upper sphere r16, antenna rod, sphere micro-windows,
#     magenta equator deck rings (five-color MEDIA, 196,72,152).
#   brain-crown 48x24: magnolia bud crown in anchor-indigo glass, two
#     converging sepal ridges lit in Lucy-blue glow family (96,160,255,
#     r140 lab-glass spectral anchor), dark base band.
# Palette = r151 anchor-family bins (dusk tint a0.22 hard-floor law: bases
# carry the anchor violet-mass family; near-black bases can never reach it).
# Deterministic: no random, no clock; double-run SHA256 must match; all
# three SHAs must differ. Existing facade pngs hashed before/after (a
# change is FATAL - baker writes only the three new files).
# ASCII-only (PS5.1 GBK law). Pixel law: [math]::Floor(v+0.5) only.
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
$root = Join-Path $PSScriptRoot '..\..'
$outDir = Join-Path $root 'City\Assets\ArtPacks\office-towers'
New-Item -ItemType Directory -Force -Path $outDir | Out-Null
$report = Join-Path $root 'logs\devloop-r175-landmark.txt'
$rep = New-Object System.Collections.ArrayList

# anchor-family palette (r151 constants, proven under dusk anchor)
$BODY    = @{ r = 44;  g = 44;  b = 84 }   # anchor indigo glass body
$LINE    = @{ r = 34;  g = 34;  b = 64 }   # floor separator / structural dark
$EDGE    = @{ r = 34;  g = 34;  b = 64 }   # silhouette rim / steel frame
$WIN     = @{ r = 58;  g = 58;  b = 106 } # neutral unlit window glass
$PLINTH  = @{ r = 26;  g = 26;  b = 50 }   # base band
$CAP     = @{ r = 40;  g = 40;  b = 76 }   # top cap rows
$GOLD    = @{ r = 196; g = 150; b = 44 }   # QUANT accent (muted five-color)
$MAGENTA = @{ r = 196; g = 72;  b = 152 } # MEDIA accent (muted five-color)
$BLIT    = @{ r = 96;  g = 160; b = 255 } # Lucy-blue lit (r140 spectral anchor)

function Px($bmp, $x, $y, $c) {
  $bmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(255, $c.r, $c.g, $c.b))
}
function AddC($census, $cls) {
  if ($census.ContainsKey($cls)) { $census[$cls] = $census[$cls] + 1 }
  else { $census[$cls] = 1 }
}
function HalfUp($v) { return [math]::Floor($v + 0.5) }

# ---- existing-facade guard: hash the four committed skins, re-check at end
$guardFiles = @('facade-quant.png', 'facade-game.png', 'facade-annex.png', 'facade-media.png')
$guardBefore = @{}
foreach ($gf in $guardFiles) {
  $gp = Join-Path $outDir $gf
  if (-not (Test-Path $gp)) { throw ('FATAL: missing existing facade ' + $gf) }
  $guardBefore[$gf] = (Get-FileHash -Algorithm SHA256 -LiteralPath $gp).Hash
}

# ============ piece 1: quant-twist 120x192 ============
function Bake-Twist($path) {
  $w = 120; $h = 192
  $bmp = New-Object System.Drawing.Bitmap($w, $h)
  $census = @{}
  $prevHw = -1
  $monotone = $true
  for ($y = 0; $y -lt $h; $y++) {
    $u = $y / 191.0
    $hw = HalfUp (12 + 48 * [math]::Pow($u, 0.85))
    if ($hw -lt $prevHw) { $monotone = $false }
    $prevHw = $hw
    $lx = 60 - $hw
    $rx = 59 + $hw
    # v2 helix pair (style-gate round 1 -> 2): mirror-symmetric seams read as
    # pleats, not twist - offset the pair phase by 2.2 rad so the two seams
    # travel opposite directions and cross mid-height = rotating helix read
    $ph = (1.0 - $u) * 2.6
    $amp = $hw - 6
    $s0 = HalfUp (59.5 + $amp * [math]::Cos($ph))
    $s1 = HalfUp (59.5 + $amp * [math]::Cos($ph + 2.2))
    for ($x = 0; $x -lt $w; $x++) {
      if ($x -lt $lx -or $x -gt $rx) { continue }
      $cls = 'BODY'
      if ($y -ge 184) { $cls = 'PLINTH' }
      elseif ($y -eq 183) { $cls = 'LINE' }
      elseif ($y -le 1) { $cls = 'CAP' }
      elseif ($x -eq $s0 -or $x -eq $s1) { $cls = 'GOLD' }
      elseif ($x -eq $lx -or $x -eq $rx) { $cls = 'EDGE' }
      elseif (($y % 8) -eq 0) { $cls = 'LINE' }
      elseif ((($y % 8) -ge 1) -and (($y % 8) -le 3) -and (($x % 4) -eq 1 -or ($x % 4) -eq 2)) { $cls = 'WIN' }
      $c = $BODY
      switch ($cls) {
        'PLINTH' { $c = $PLINTH }
        'LINE'   { $c = $LINE }
        'CAP'    { $c = $CAP }
        'GOLD'   { $c = $GOLD }
        'EDGE'   { $c = $EDGE }
        'WIN'    { $c = $WIN }
        default  { $c = $BODY }
      }
      Px $bmp $x $y $c
      AddC $census $cls
    }
  }
  $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
  $bmp.Dispose()
  # fail-loud gates (analytic laws first, pinned census checked by caller)
  if (-not $monotone) { throw 'FATAL: twist taper not monotone' }
  $chk = New-Object System.Drawing.Bitmap($path)
  if ($chk.GetPixel(0, 0).A -ne 0 -or $chk.GetPixel(119, 0).A -ne 0) { throw 'FATAL: twist top corners must be transparent' }
  if ($chk.GetPixel(0, 191).A -ne 255 -or $chk.GetPixel(119, 191).A -ne 255) { throw 'FATAL: twist bottom corners must be grounded opaque' }
  $bright = 0
  for ($y = 0; $y -lt 192; $y++) {
    for ($x = 0; $x -lt 120; $x++) {
      $p = $chk.GetPixel($x, $y)
      if ((($p.R + $p.G + $p.B) / 3) -gt 80) { $bright++ }
    }
  }
  $chk.Dispose()
  if ($bright -ne $census['GOLD']) { throw ('FATAL: twist unlit law: bright=' + $bright + ' want gold-only ' + $census['GOLD']) }
  # pinned census (r140 law: exact-count gates fail loud on any recipe drift)
  $pin = @{ GOLD = 359; EDGE = 362; WIN = 2379; LINE = 1669; BODY = 8803; PLINTH = 950; CAP = 50 }
  foreach ($k in $pin.Keys) {
    if ($census[$k] -ne $pin[$k]) {
      $dump = ($census.Keys | Sort-Object | ForEach-Object { $_ + '=' + $census[$_] }) -join ' '
      throw ('FATAL: twist census ' + $k + '=' + $census[$k] + ' != pin ' + $pin[$k] + ' | full: ' + $dump)
    }
  }
  return $census
}

# ============ piece 2: media-pearl 144x144 ============
function Bake-Pearl($path) {
  $w = 144; $h = 144
  $bmp = New-Object System.Drawing.Bitmap($w, $h)
  $census = @{}
  $legPairs = @(
    @{ gx = 48; ax = 58 },
    @{ gx = 72; ax = 72 },
    @{ gx = 96; ax = 86 }
  )
  for ($y = 0; $y -lt $h; $y++) {
    for ($x = 0; $x -lt $w; $x++) {
      $dBig = [math]::Sqrt([math]::Pow($x - 72, 2) + [math]::Pow($y - 96, 2))
      $dSmall = [math]::Sqrt([math]::Pow($x - 72, 2) + [math]::Pow($y - 36, 2))
      $cls = $null
      # magenta equator deck rings (precedence: over everything in their rows)
      if (($y -eq 96) -and ($dBig -le 32)) { $cls = 'MAGENTA' }
      elseif (($y -eq 36) -and ($dSmall -le 14)) { $cls = 'MAGENTA' }
      # antenna rod above the small sphere
      elseif (($x -ge 70) -and ($x -le 73) -and ($y -ge 4) -and ($y -le 19)) { $cls = 'FRAME' }
      # axis column visible between the two spheres
      elseif (($x -ge 70) -and ($x -le 73) -and ($y -ge 53) -and ($y -le 61)) { $cls = 'FRAME' }
      # tripod splayed legs below the big sphere
      elseif ($y -ge 131) {
        $t = (143 - $y) / 12.0
        $inLeg = $false
        foreach ($lp in $legPairs) {
          $xc = HalfUp ($lp.gx + ($lp.ax - $lp.gx) * $t)
          if (($x -ge ($xc - 2)) -and ($x -le ($xc + 1))) { $inLeg = $true }
        }
        if ($inLeg) { $cls = 'FRAME' }
      }
      # sphere surfaces (overdraw legs/axis where they meet) - membership
      # is per-sphere: a big-sphere pixel measured against the small-sphere
      # center is always far, so rim/win tests must never mix the two radii
      if ($null -eq $cls) {
        if ($dBig -le 34) {
          if ($dBig -gt 31) { $cls = 'RIM' }
          elseif ((($x % 6) -eq 2 -or ($x % 6) -eq 3) -and (($y % 6) -eq 2 -or ($y % 6) -eq 3)) { $cls = 'WIN' }
          else { $cls = 'BODY' }
        }
        elseif ($dSmall -le 16) {
          if ($dSmall -gt 13) { $cls = 'RIM' }
          elseif ((($x % 6) -eq 2 -or ($x % 6) -eq 3) -and (($y % 6) -eq 2 -or ($y % 6) -eq 3)) { $cls = 'WIN' }
          else { $cls = 'BODY' }
        }
      }
      if ($null -eq $cls) { continue }
      $c = $BODY
      switch ($cls) {
        'MAGENTA' { $c = $MAGENTA }
        'FRAME'   { $c = $EDGE }
        'RIM'     { $c = $EDGE }
        'WIN'     { $c = $WIN }
        default   { $c = $BODY }
      }
      Px $bmp $x $y $c
      AddC $census $cls
    }
  }
  $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
  $bmp.Dispose()
  # fail-loud gates
  $chk = New-Object System.Drawing.Bitmap($path)
  if ($chk.GetPixel(0, 0).A -ne 0 -or $chk.GetPixel(143, 0).A -ne 0 -or $chk.GetPixel(0, 143).A -ne 0 -or $chk.GetPixel(143, 143).A -ne 0) { throw 'FATAL: pearl corners must be transparent' }
  $groundPx = 0
  $bright = 0
  for ($y = 0; $y -lt 144; $y++) {
    for ($x = 0; $x -lt 144; $x++) {
      $p = $chk.GetPixel($x, $y)
      if ((($p.R + $p.G + $p.B) / 3) -gt 80) { $bright++ }
      if (($y -eq 143) -and ($p.A -eq 255)) { $groundPx++ }
    }
  }
  $chk.Dispose()
  if ($census['MAGENTA'] -ne 94) { throw ('FATAL: pearl magenta census ' + $census['MAGENTA'] + ' != 94') }
  if ($bright -ne 94) { throw ('FATAL: pearl unlit law: bright=' + $bright + ' want magenta-only 94') }
  if ($census['FRAME'] -ne 256) { throw ('FATAL: pearl frame census ' + $census['FRAME'] + ' != 256 (rod 64 + axis 36 + legs 156)') }
  if ($groundPx -ne 12) { throw ('FATAL: pearl grounded law: bottom-row px ' + $groundPx + ' != 12 (3 legs x 4)') }
  if ($census['RIM'] -ne 888) { throw ('FATAL: pearl rim census ' + $census['RIM'] + ' != 888') }
  if ($census['WIN'] -ne 398) { throw ('FATAL: pearl win census ' + $census['WIN'] + ' != 398') }
  if ($census['BODY'] -ne 3042) { throw ('FATAL: pearl body census ' + $census['BODY'] + ' != 3042') }
  return $census
}

# ============ piece 3: brain-crown 48x24 ============
function Bake-Crown($path) {
  $w = 48; $h = 24
  $bmp = New-Object System.Drawing.Bitmap($w, $h)
  $census = @{}
  $prevHw = -1
  $monotone = $true
  for ($y = 0; $y -lt $h; $y++) {
    $v = $y / 23.0
    $hw = HalfUp (3 + 15 * [math]::Pow($v, 0.55))
    if ($hw -lt $prevHw) { $monotone = $false }
    $prevHw = $hw
    $lx = 24 - $hw
    $rx = 23 + $hw
    $off = HalfUp (($hw - 3) * 0.55)
    if ($off -lt 1) { $off = 0 }
    $litL = 24 - $off
    $litR = 23 + $off
    if ($off -eq 0) { $litL = 24; $litR = 24 }
    for ($x = 0; $x -lt $w; $x++) {
      if ($x -lt $lx -or $x -gt $rx) { continue }
      $cls = 'BODY'
      if ($y -ge 22) { $cls = 'PLINTH' }
      elseif ($x -eq $litL -or $x -eq $litR) { $cls = 'LIT' }
      elseif ($x -eq $lx -or $x -eq $rx) { $cls = 'EDGE' }
      $c = $BODY
      switch ($cls) {
        'PLINTH' { $c = $PLINTH }
        'LIT'    { $c = $BLIT }
        'EDGE'   { $c = $EDGE }
        default  { $c = $BODY }
      }
      Px $bmp $x $y $c
      AddC $census $cls
    }
  }
  $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
  $bmp.Dispose()
  # fail-loud gates
  if (-not $monotone) { throw 'FATAL: crown bud not monotone' }
  $chk = New-Object System.Drawing.Bitmap($path)
  if ($chk.GetPixel(0, 0).A -ne 0 -or $chk.GetPixel(47, 0).A -ne 0 -or $chk.GetPixel(0, 23).A -ne 0 -or $chk.GetPixel(47, 23).A -ne 0) { throw 'FATAL: crown corners must be transparent' }
  $bright = 0
  for ($y = 0; $y -lt 24; $y++) {
    for ($x = 0; $x -lt 48; $x++) {
      $p = $chk.GetPixel($x, $y)
      if ((($p.R + $p.G + $p.B) / 3) -gt 80) { $bright++ }
    }
  }
  $chk.Dispose()
  if ($census['PLINTH'] -ne 72) { throw ('FATAL: crown plinth census ' + $census['PLINTH'] + ' != 72') }
  if ($bright -ne $census['LIT']) { throw ('FATAL: crown bright law: bright=' + $bright + ' want lit-only ' + $census['LIT']) }
  if (($census['LIT'] -lt 36) -or ($census['LIT'] -gt 60)) { throw ('FATAL: crown lit census out of band: ' + $census['LIT']) }
  $pin = @{ LIT = 43; EDGE = 44; BODY = 443; PLINTH = 72 }
  foreach ($k in $pin.Keys) {
    if ($census[$k] -ne $pin[$k]) { throw ('FATAL: crown census ' + $k + '=' + $census[$k] + ' != pin ' + $pin[$k]) }
  }
  return $census
}

# ============ bake pass ============
function Bake-All($tag) {
  $cTwist = Bake-Twist (Join-Path $outDir 'quant-twist.png')
  $cPearl = Bake-Pearl (Join-Path $outDir 'media-pearl.png')
  $cCrown = Bake-Crown (Join-Path $outDir 'brain-crown.png')
  $shaT = (Get-FileHash -Algorithm SHA256 -LiteralPath (Join-Path $outDir 'quant-twist.png')).Hash
  $shaP = (Get-FileHash -Algorithm SHA256 -LiteralPath (Join-Path $outDir 'media-pearl.png')).Hash
  $shaC = (Get-FileHash -Algorithm SHA256 -LiteralPath (Join-Path $outDir 'brain-crown.png')).Hash
  [void]$rep.Add('[' + $tag + '] twist 120x192 gold=' + $cTwist['GOLD'] + ' edge=' + $cTwist['EDGE'] + ' win=' + $cTwist['WIN'] + ' line=' + $cTwist['LINE'] + ' body=' + $cTwist['BODY'] + ' plinth=' + $cTwist['PLINTH'] + ' cap=' + $cTwist['CAP'] + ' sha12=' + $shaT.Substring(0, 12))
  [void]$rep.Add('[' + $tag + '] pearl 144x144 magenta=' + $cPearl['MAGENTA'] + ' frame=' + $cPearl['FRAME'] + ' rim=' + $cPearl['RIM'] + ' win=' + $cPearl['WIN'] + ' body=' + $cPearl['BODY'] + ' sha12=' + $shaP.Substring(0, 12))
  [void]$rep.Add('[' + $tag + '] crown 48x24 lit=' + $cCrown['LIT'] + ' edge=' + $cCrown['EDGE'] + ' body=' + $cCrown['BODY'] + ' plinth=' + $cCrown['PLINTH'] + ' sha12=' + $shaC.Substring(0, 12))
  return @{ t = $shaT; p = $shaP; c = $shaC }
}

$run1 = Bake-All 'run1'
$run2 = Bake-All 'run2'
if (($run1.t -ne $run2.t) -or ($run1.p -ne $run2.p) -or ($run1.c -ne $run2.c)) { throw 'FATAL: bake not deterministic (double-run SHA mismatch)' }
if (($run1.t -eq $run1.p) -or ($run1.t -eq $run1.c) -or ($run1.p -eq $run1.c)) { throw 'FATAL: pieces must differ' }

# existing-facade guard re-check
foreach ($gf in $guardFiles) {
  $now = (Get-FileHash -Algorithm SHA256 -LiteralPath (Join-Path $outDir $gf)).Hash
  if ($now -ne $guardBefore[$gf]) { throw ('FATAL: existing facade modified: ' + $gf) }
}

[void]$rep.Add('BAKE OK pieces=3 deterministic=PASS distinct=PASS existing-facades=UNTOUCHED')
[IO.File]::WriteAllLines($report, $rep)
$rep | ForEach-Object { Write-Output $_ }
