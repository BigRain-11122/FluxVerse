# FluxVerse DevLoop r123 eaveslots sandbox gate (ASCII only, PS5.1).
# Validates Tools/city/eaveslots-manifest.json (P-75 slice B step 1: rain
# shelter eave sub-slots, r122 item 3) against the post-r113 live entity
# tables BEFORE the r124 engine round. Gate family = the r99 seat-harness
# laws (seat 2.2 / robot 2.0 / vehicle 2.8 center distances, neon 1.065
# body expansion + tag formulas, tag-tag, underfoot pavement row, body cells
# vs roads/water/buildings, L0 frame, tint band, bubble ceiling) + the eave
# adjacency law (>= 1 stand cell edge-shares a building footprint). Also
# runs the full 14-building x 4-face census: every non-feasible face must
# fire its named blocker at the analytic max-clearance probe (probes assert
# adjacency where the strip is meant to be reachable), the B2-west runner-up
# window is bracketed clean/west/east, and the NORTH quota pick is proven by
# max-min-slack. Exit 0 = all green.

$ErrorActionPreference = 'Stop'
$repo = Split-Path -Parent $PSScriptRoot
$mp = Join-Path $repo 'Tools\city\eaveslots-manifest.json'
if (-not (Test-Path $mp)) { Write-Output 'FATAL manifest missing'; exit 1 }
$m = ConvertFrom-Json ([IO.File]::ReadAllText($mp, (New-Object Text.UTF8Encoding($false))))
$pass = 0; $fail = 0
function OK($cond, $name) {
    if ($cond) { $script:pass++ } else { $script:fail++; Write-Output ('FAIL: ' + $name) }
}

# ---- seat-class constants (r99 family) ----
$Half = 32.0 / 48.0                        # 0.66667 body half extent
$TagW = 66.0 / 24.0                        # 2.75
$TagH = 20.0 / 24.0                        # 0.8333
$OffY = $Half + (8.0 / 24.0) + ($TagH / 2.0)   # 1.4167 tag center above body center
$FrameHalfW = 35.556 - 0.3                 # 35.256
$FrameHalfH = 20.0 - 0.3                   # 19.7
$TintLo = -16.0 + 0.1                      # -15.9
$TintHi = 14.0
$BubK = $OffY + ($TagH / 2.0) + 0.15 + 0.75 + 0.75   # 3.4834 bubble factor

function FloorD([double]$v) { return [math]::Floor($v) }
function CeilD([double]$v) { $r = [math]::Ceiling($v); return $r }
function Rect($x0, $y0, $x1, $y1) { return @([double]$x0, [double]$y0, [double]$x1, [double]$y1) }
function Overlap($a, $b) {
    return ($a[0] -lt $b[2]) -and ($b[0] -lt $a[2]) -and ($a[1] -lt $b[3]) -and ($b[1] -lt $a[3])
}
function RectSlack($a, $b) {
    # -999 when overlapping, else the max axis separation (0.0 = touch)
    if (Overlap $a $b) { return -999.0 }
    $mx = $b[0] - $a[2]
    if (($a[0] - $b[2]) -gt $mx) { $mx = $a[0] - $b[2] }
    if (($b[1] - $a[3]) -gt $mx) { $mx = $b[1] - $a[3] }
    if (($a[1] - $b[3]) -gt $mx) { $mx = $a[1] - $b[3] }
    return $mx
}
function Dist([double]$dx, [double]$dy) { return [math]::Sqrt($dx * $dx + $dy * $dy) }
function FormulaSlack([double]$dx, [double]$dy, [double]$tx, [double]$ty) {
    # r99 two-axis clip formulas: clearance slack on the binding axis
    $s1 = $dx - $tx; $s2 = $dy - $ty
    if ($s1 -ge $s2) { return $s1 } else { return $s2 }
}

# ---- live entity tables (mirrors of the C# single sources, post-r113) ----
$seats = @(
    @('ResQ01', -8.0, -12.0), @('ResQ02', -3.2, -9.0), @('ResQ03', 4.5, -11.0),
    @('ResQ04', -3.5, -12.0), @('ResQ05', -6.0, -9.0), @('ResQ06', 6.2, -9.0),
    @('ResQ07', 10.0, -14.0), @('ResQ08', -10.0, -13.0), @('ResQ09', -5.0, -14.0),
    @('ResG01', -24.5, -9.0), @('ResG02', -12.0, -11.0), @('ResG03', -15.0, -14.0),
    @('ResG04', -14.0, -12.0), @('ResG05', -12.0, -14.0), @('ResG06', -14.5, -9.0),
    @('ResG07', -31.5, -13.0),
    @('ResM01', 26.0, -14.0), @('ResM02', 15.5, -14.0), @('ResM03', 28.0, -13.0),
    @('ResM04', 27.0, -11.0), @('ResM05', 12.5, -11.0), @('ResM06', 16.0, -11.0),
    @('ResM07', 30.0, -11.0), @('ResM08', 29.0, -9.0),
    @('ResN01', -3.5, 11.0), @('ResN02', 20.0, 11.0), @('ResT01', 3.5, 11.0),
    @('ResV01', -10.5, -9.0), @('ResV02', 9.5, -9.0), @('ResV03', 15.0, -9.0),
    @('ResV04', -27.5, -9.0), @('ResV05', 26.0, -9.0)
)
$robots = @(
    @('RobotPlazaW', -5.5, -11.5), @('RobotPlazaE', 5.5, -13.5), @('RobotPlazaS', -2.5, -15.0),
    @('RobotStWest', -12.5, -7.5), @('RobotStEast', 12.5, -7.5), @('RobotGameFr', -21.5, -8.0),
    @('RobotMediaFr', 18.5, -11.5), @('RobotPromE', 14.5, 4.5)
)
# vehicles: name, pxW, pxH, x, groundY (all @PPU24)
$vehicles = @(
    @('VehicleCarW', 78, 36, -26.6, -7.0), @('VehicleCarQE', 78, 36, 5.5, -7.0),
    @('VehicleCarE', 78, 36, 16.0, -7.0), @('VehicleCamperW', 94, 56, -28.5, -13.0),
    @('VehicleBusN', 115, 62, 12.0, 8.0), @('VehicleCartQ', 44, 48, 7.5, -12.5),
    @('VehicleCartG', 48, 55, -25.5, -13.0), @('VehicleStopN', 15, 37, 16.5, 9.0)
)
# signs: name, pxW, pxH, x, y, ppu
$signs = @(
    @('NeonHotel', 68, 35, -26.9, 12.347, 32), @('NeonGameWest', 19, 48, -22.5, -13.5, 32),
    @('NeonGameWest2', 19, 76, -19.7, -13.5, 48), @('NeonMediaEast', 19, 48, 20.2, -11.0, 32),
    @('NeonMediaRoof', 36, 13, 22.4, -7.59375, 16), @('NeonQuantL', 19, 48, -1.45, -12.5, 16),
    @('NeonQuantR', 19, 48, 1.45, -12.5, 16), @('NeonNEScroll', 13, 47, 27.0, 10.3, 32),
    @('NeonNOpen', 14, 44, -8.0, 10.3, 32), @('NeonNMids', 19, 48, 8.0, 10.5, 32),
    @('NeonKiosk', 21, 18, 4.2, -15.0, 16), @('NeonAntenna', 22, 96, 0.0, -6.0, 16),
    @('NeonFlux', 44, 20, 0.5, 12.75, 16), @('NeonCPH4', 44, 20, 0.5, 10.5, 16),
    @('NeonBiggame', 68, 28, -20.5, -10.25, 16), @('NeonBigmoney', 76, 20, 0.5, -10.3, 16),
    @('NeonBigstream', 84, 28, 27.5, 12.3125, 32), @('NeonBiglife', 68, 28, -7.9, 12.3125, 32)
)
# 14 building rects: NeonRules.Buildings (8) + GAME_ANNEX (r103) + offices (r111)
$buildings = @(
    @('B0_NW', -28.0, 9.0, -25.0, 12.0),
    @('B1_NWMID', -9.0, 9.0, -6.0, 12.0),
    @('B2_NEMID', 7.0, 9.0, 10.0, 12.0),
    @('B3_NE', 26.0, 9.0, 29.0, 12.0),
    @('B4_QUANT', -2.0, -16.0, 3.0, -8.0),
    @('GAME_MAIN', -23.0, -16.0, -18.0, -11.0),
    @('B6_MEDIA', 19.0, -14.0, 25.0, -8.0),
    @('B7_BRAIN', -1.0, 9.0, 2.0, 15.0),
    @('GAME_ANNEX', -26.0, -16.0, -24.0, -13.0),
    @('N1_OFFICE', -24.0, 9.0, -18.0, 13.0),
    @('N2_OFFICE', -16.0, 9.0, -10.0, 13.0),
    @('N3_OFFICE', -35.0, 9.0, -29.0, 13.0),
    @('N4_OFFICE', 29.0, 9.0, 35.0, 13.0),
    @('E1_OFFICE', 29.0, -16.0, 35.0, -12.0)
)
$anchors = @(
    @('BrainTower', 0.0, 11.0), @('Zone_GAME', -20.5, -11.0),
    @('Zone_QUANT', 0.5, -12.0), @('Zone_MEDIA', 22.0, -11.0)
)
$propCells = @(
    @(-30, 5), @(-24, 5), @(-12, 5), @(-6, 5), @(6, 5), @(12, 5), @(24, 5), @(30, 5),
    @(-28, -6), @(-22, -6), @(-10, -6), @(-4, -6), @(4, -6), @(10, -6), @(22, -6), @(28, -6),
    @(-28, 3), @(-20, 3), @(-12, 3), @(12, 3), @(20, 3), @(28, 3),
    @(-24, -4), @(-16, -4), @(-8, -4), @(8, -4), @(16, -4), @(24, -4),
    @(-12, 8), @(9, 8), @(-10, -8), @(14, -8)
)
$interior = @(
    @('InteriorQUANT', -2.0, -16.0, 3.0, -8.0),
    @('InteriorGAME', -23.0, -16.0, -18.0, -11.0)
)

# ---- painted-world facts (CitySkeletonBuilder Build(), r99 census) ----
function IsGroundRow([int]$r) {
    if ($r -ge -16 -and $r -le -9) { return $true }
    if ($r -eq -5 -or $r -eq -4) { return $true }
    if ($r -eq 3 -or $r -eq 4) { return $true }
    if ($r -ge 9 -and $r -le 14) { return $true }
    return $false
}
function IsGrassRow([int]$r) { return ($r -eq -6 -or $r -eq 5 -or $r -eq 6) }
function IsRoadCell([int]$cx, [int]$cy) {
    if ($cy -eq 7 -or $cy -eq 8 -or $cy -eq -7 -or $cy -eq -8) { return $true }
    if ($cx -eq -18 -or $cx -eq -17 -or $cx -eq 17 -or $cx -eq 18) {
        if (($cy -ge 3 -and $cy -le 14) -or ($cy -ge -16 -and $cy -le -4)) { return $true }
    }
    return $false
}
function IsWaterRow([int]$r) { return ($r -ge -3 -and $r -le 2) }

function BldRect($b) { return Rect $b[1] $b[2] $b[3] $b[4] }
function IsBldCell([int]$cx, [int]$cy) {
    $cr = Rect $cx $cy ($cx + 1) ($cy + 1)
    foreach ($b in $buildings) { if (Overlap $cr (BldRect $b)) { return $true } }
    return $false
}
function CellEdgeShares([int]$cx, [int]$cy, $b) {
    $ys = ($cy -lt $b[4]) -and ($b[2] -lt ($cy + 1))
    $xs = ($cx -lt $b[3]) -and ($b[1] -lt ($cx + 1))
    if (((($cx + 1) -eq [int]$b[1]) -and $ys)) { return $true }
    if (($cx -eq [int]$b[3]) -and $ys) { return $true }
    if (((($cy + 1) -eq [int]$b[2]) -and $xs)) { return $true }
    if (($cy -eq [int]$b[4]) -and $xs) { return $true }
    return $false
}

# ---- entity rect helpers ----
function BodyRect([double]$x, [double]$y) { return Rect ($x - $Half) ($y - $Half) ($x + $Half) ($y + $Half) }
function ShadowRect([double]$x, [double]$y) {
    $cy = $y - $Half - 0.06
    return Rect ($x - $Half) ($cy - 0.16667) ($x + $Half) ($cy + 0.16667)
}
function TagRect([double]$x, [double]$y) {
    $ty = $y + $OffY
    return Rect ($x - $TagW / 2.0) ($ty - $TagH / 2.0) ($x + $TagW / 2.0) ($ty + $TagH / 2.0)
}
function RobotBody($r) { return Rect ($r[1] - 0.5) ($r[2] - 0.5) ($r[1] + 0.5) ($r[2] + 0.5) }
function RobotShadow($r) {
    return Rect ($r[1] - 0.5) ($r[2] - 0.56 - 0.1875) ($r[1] + 0.5) ($r[2] - 0.56 + 0.1875)
}
function VehRect($v) {
    $w = $v[1] / 24.0; $h = $v[2] / 24.0
    return Rect ($v[3] - $w / 2.0) ($v[4]) ($v[3] + $w / 2.0) ($v[4] + $h)
}
function VehCenterY($v) { return $v[4] + ($v[2] / 24.0) / 2.0 }
function SignW($g) { return $g[1] / $g[5] }
function SignH($g) { return $g[2] / $g[5] }
function SignRect($g) {
    $w = SignW $g; $h = SignH $g
    return Rect ($g[3] - $w / 2.0) ($g[4] - $h / 2.0) ($g[3] + $w / 2.0) ($g[4] + $h / 2.0)
}

# ---- A0 manifest structure ----
OK ($m.protocol -eq 'fluxverse-eaveslots/0.1') 'A0 protocol'
OK ($m.baked_round -eq 123) 'A0 round'
OK (@($m.slots).Count -eq 2) 'A0 slot count 2'
OK ($m.slots[0].id -eq 'EAVE-M01') 'A0 slot0 id'
OK ($m.slots[1].id -eq 'EAVE-N01') 'A0 slot1 id'
OK ($m.slots[0].district -eq 'MEDIA') 'A0 slot0 district'
OK ($m.slots[1].district -eq 'NORTH') 'A0 slot1 district'
OK ($m.runner_up.id -eq 'EAVE-N01RU') 'A0 runner-up id'
OK ($m.quota_ledger.feasible_candidates -eq 3) 'A0 feasible 3'
OK ($m.quota_ledger.selected -eq 2) 'A0 selected 2'
OK ($m.quota_ledger.runner_up_count -eq 1) 'A0 runner-up count 1'
OK ($m.quota_ledger.per_district.QUANT -eq 0) 'A0 QUANT 0'
OK ($m.quota_ledger.per_district.GAME -eq 0) 'A0 GAME 0'
OK ($m.quota_ledger.per_district.MEDIA -eq 1) 'A0 MEDIA 1'
OK ($m.quota_ledger.per_district.NORTH -eq 1) 'A0 NORTH 1'
$asciiBytes = [IO.File]::ReadAllBytes($mp)
OK (@($asciiBytes | Where-Object { $_ -ge 128 }).Count -eq 0) 'A0 manifest pure ASCII'
# survey completeness: 14 buildings x rect match against the live table
OK (@($m.survey).Count -eq 14) 'A0 survey 14 buildings'
foreach ($sv in @($m.survey)) {
    $bx = @($buildings | Where-Object { $_[0] -eq $sv.b })
    OK ($bx.Count -eq 1) ('A0 survey name resolves: ' + $sv.b)
    if ($bx.Count -eq 1) {
        OK ([math]::Abs([double]$sv.rect[0] - $bx[0][1]) -lt 0.0001 -and [math]::Abs([double]$sv.rect[1] - $bx[0][2]) -lt 0.0001 -and [math]::Abs([double]$sv.rect[2] - $bx[0][3]) -lt 0.0001 -and [math]::Abs([double]$sv.rect[3] - $bx[0][4]) -lt 0.0001) ('A0 survey rect match: ' + $sv.b)
    }
    OK ($null -ne $sv.faces.west) ('A0 face west present: ' + $sv.b)
    OK ($null -ne $sv.faces.east) ('A0 face east present: ' + $sv.b)
    OK ($null -ne $sv.faces.north) ('A0 face north present: ' + $sv.b)
    OK ($null -ne $sv.faces.south) ('A0 face south present: ' + $sv.b)
}

# ---- the full gate battery as a violation list (r99 family + adjacency) ----
function Violations([double]$x, [double]$y) {
    $v = New-Object System.Collections.ArrayList
    if (([math]::Abs($x) + $Half) -gt $FrameHalfW) { [void]$v.Add('frame') }
    if (([math]::Abs($y) + $Half) -gt $FrameHalfH) { [void]$v.Add('frame') }
    if (($y - $Half) -lt $TintLo) { [void]$v.Add('tint') }
    if (($y + $Half) -gt $TintHi) { [void]$v.Add('tint') }
    if ([math]::Abs($y - [math]::Round($y)) -gt 0.0001) { [void]$v.Add('int-y') }
    if (($y + $BubK) -gt 15.0) { [void]$v.Add('bubble') }
    if (([math]::Abs($x) + $TagW / 2.0) -gt $FrameHalfW) { [void]$v.Add('tag-frame') }
    $ty0 = $y + $OffY - $TagH / 2.0; $ty1 = $y + $OffY + $TagH / 2.0
    if (($ty0 -lt $TintLo) -or ($ty1 -gt $TintHi)) { [void]$v.Add('tag-tint') }
    # underfoot row (r99 A7: floor(y-Half)-1)
    $feet = FloorD ($y - $Half)
    $uf = [int]$feet - 1
    if (-not (IsGroundRow $uf)) { [void]$v.Add('underfoot') }
    if (IsGrassRow $uf) { [void]$v.Add('underfoot') }
    if (IsWaterRow $uf) { [void]$v.Add('underfoot') }
    # body cell span
    $ca = [int](FloorD ($x - $Half))
    $cbt = CeilD ($x + $Half); $cb = [int]$cbt - 1
    $r0 = [int](FloorD ($y - $Half))
    $r1t = CeilD ($y + $Half); $r1 = [int]$r1t - 1
    for ($cx = $ca; $cx -le $cb; $cx++) {
        if (IsRoadCell $cx $uf) { [void]$v.Add('underfoot') }
        for ($ry = $r0; $ry -le $r1; $ry++) {
            if (IsRoadCell $cx $ry) { [void]$v.Add('body-road') }
            if (IsWaterRow $ry) { [void]$v.Add('body-water') }
            if (IsBldCell $cx $ry) { [void]$v.Add('body-building') }
        }
    }
    # eave adjacency: >= 1 stand cell edge-shares a building footprint
    $adj = $false
    for ($cx = $ca; $cx -le $cb; $cx++) {
        for ($ry = $r0; $ry -le $r1; $ry++) {
            foreach ($b in $buildings) { if (CellEdgeShares $cx $ry $b) { $adj = $true } }
        }
    }
    if (-not $adj) { [void]$v.Add('adjacency') }
    # body + shadow rect census
    $body = BodyRect $x $y
    $sh = ShadowRect $x $y
    foreach ($b in $buildings) {
        if (Overlap $body (BldRect $b)) { [void]$v.Add(('body-building:' + $b[0])) }
        if (Overlap $sh (BldRect $b)) { [void]$v.Add(('shadow-building:' + $b[0])) }
    }
    foreach ($s in $seats) {
        if (Overlap $body (BodyRect $s[1] $s[2])) { [void]$v.Add(('body-seat:' + $s[0])) }
        if (Overlap $body (ShadowRect $s[1] $s[2])) { [void]$v.Add(('body-seatshadow:' + $s[0])) }
        if (Overlap $sh (BodyRect $s[1] $s[2])) { [void]$v.Add(('shadow-seat:' + $s[0])) }
        if (Overlap $sh (ShadowRect $s[1] $s[2])) { [void]$v.Add(('shadow-seatshadow:' + $s[0])) }
    }
    foreach ($r in $robots) {
        if (Overlap $body (RobotBody $r)) { [void]$v.Add(('body-robot:' + $r[0])) }
        if (Overlap $body (RobotShadow $r)) { [void]$v.Add(('body-robotshadow:' + $r[0])) }
        if (Overlap $sh (RobotBody $r)) { [void]$v.Add(('shadow-robot:' + $r[0])) }
        if (Overlap $sh (RobotShadow $r)) { [void]$v.Add(('shadow-robotshadow:' + $r[0])) }
    }
    foreach ($veh in $vehicles) {
        if (Overlap $body (VehRect $veh)) { [void]$v.Add(('body-veh:' + $veh[0])) }
        if (Overlap $sh (VehRect $veh)) { [void]$v.Add(('shadow-veh:' + $veh[0])) }
    }
    foreach ($g in $signs) {
        if (Overlap $body (SignRect $g)) { [void]$v.Add(('body-sign:' + $g[0])) }
        if (Overlap $sh (SignRect $g)) { [void]$v.Add(('shadow-sign:' + $g[0])) }
    }
    foreach ($p in $propCells) {
        $pr = Rect $p[0] $p[1] ($p[0] + 1) ($p[1] + 1)
        if (Overlap $body $pr) { [void]$v.Add('body-prop') }
        if (Overlap $sh $pr) { [void]$v.Add('shadow-prop') }
    }
    foreach ($w in $interior) {
        $wr = Rect $w[1] $w[2] $w[3] $w[4]
        if (Overlap $body $wr) { [void]$v.Add(('body-interior:' + $w[0])) }
        if (Overlap $sh $wr) { [void]$v.Add(('shadow-interior:' + $w[0])) }
    }
    foreach ($a in $anchors) {
        if (($body[0] -lt $a[1]) -and ($a[1] -lt $body[2]) -and ($body[1] -lt $a[2]) -and ($a[2] -lt $body[3])) { [void]$v.Add(('anchor:' + $a[0])) }
    }
    # center-distance gates
    foreach ($s in $seats) {
        $d = Dist ($x - $s[1]) ($y - $s[2])
        if ($d -lt 2.2) { [void]$v.Add(('seat-dist:' + $s[0])) }
    }
    foreach ($r in $robots) {
        $d = Dist ($x - $r[1]) ($y - $r[2])
        if ($d -lt 2.0) { [void]$v.Add(('robot-dist:' + $r[0])) }
    }
    foreach ($veh in $vehicles) {
        $cyc = VehCenterY $veh
        $d = Dist ($x - $veh[3]) ($y - $cyc)
        if ($d -lt 2.8) { [void]$v.Add(('veh-dist:' + $veh[0])) }
    }
    # neon formulas (r99 A6) + tag formulas (A3/A4)
    foreach ($g in $signs) {
        $hw = (SignW $g) / 2.0; $hh = (SignH $g) / 2.0
        $dx = [math]::Abs($x - $g[3]); $dy = [math]::Abs($y - $g[4])
        if (($dx -lt ($hw + 1.065 - 0.0001)) -and ($dy -lt ($hh + 1.065 - 0.0001))) { [void]$v.Add(('sign-body:' + $g[0])) }
        $tdx = [math]::Abs($x - $g[3]); $tdy = [math]::Abs(($y + $OffY) - $g[4])
        if (($tdx -lt (($TagW / 2.0) + $hw - 0.0001)) -and ($tdy -lt (($TagH / 2.0) + $hh - 0.0001))) { [void]$v.Add(('tag-sign:' + $g[0])) }
    }
    foreach ($r in $robots) {
        $tdx = [math]::Abs($x - $r[1]); $tdy = [math]::Abs(($y + $OffY) - $r[2])
        if (($tdx -lt (1.875 - 0.0001)) -and ($tdy -lt (0.91667 - 0.0001))) { [void]$v.Add(('tag-robot:' + $r[0])) }
    }
    foreach ($s in $seats) {
        $tdx = [math]::Abs($x - $s[1]); $tdy = [math]::Abs($y - $s[2])
        if (($tdx -lt ($TagW - 0.0001)) -and ($tdy -lt ($TagH - 0.0001))) { [void]$v.Add(('tag-tag:' + $s[0])) }
    }
    return $v
}

function HasToken($v, $prefix) {
    foreach ($t in $v) { if ($t.StartsWith($prefix)) { return $true } }
    return $false
}

# ---- A1/A2/A3: the two selected slots pass every gate family ----
$badPre = @('frame', 'tint', 'int-y', 'bubble', 'tag-frame', 'tag-tint', 'underfoot',
            'body-', 'shadow-', 'adjacency', 'anchor', 'seat-dist', 'robot-dist',
            'veh-dist', 'sign-body', 'tag-sign', 'tag-robot', 'tag-tag')
foreach ($sl in @($m.slots)) {
    $x = [double]$sl.x; $y = [double]$sl.y
    $vv = Violations $x $y
    foreach ($p in $badPre) {
        OK (-not (HasToken $vv $p)) ('SLOT ' + $sl.id + ' clean of ' + $p)
    }
    OK (@($vv).Count -eq 0) ('SLOT ' + $sl.id + ' zero violations')
    # recompute cols/rows/underfoot/edge cell vs the manifest fields
    $ca = [int](FloorD ($x - $Half)); $cbt = CeilD ($x + $Half); $cb = [int]$cbt - 1
    $r0 = [int](FloorD ($y - $Half)); $r1t = CeilD ($y + $Half); $r1 = [int]$r1t - 1
    $uft = [int](FloorD ($y - $Half)) - 1
    OK ($sl.cols[0] -eq $ca -and $sl.cols[1] -eq $cb) ('SLOT ' + $sl.id + ' cols recompute')
    OK ($sl.rows[0] -eq $r0 -and $sl.rows[1] -eq $r1) ('SLOT ' + $sl.id + ' rows recompute')
    OK ($sl.underfoot_row -eq $uft) ('SLOT ' + $sl.id + ' underfoot recompute')
    # host rect resolves in the live table and the edge cell shares it
    $hb = @($buildings | Where-Object { $_[0] -eq $sl.host })
    OK ($hb.Count -eq 1) ('SLOT ' + $sl.id + ' host resolves')
    if ($hb.Count -eq 1) {
        OK ([math]::Abs([double]$sl.host_rect[0] - $hb[0][1]) -lt 0.0001 -and [math]::Abs([double]$sl.host_rect[2] - $hb[0][3]) -lt 0.0001) ('SLOT ' + $sl.id + ' host rect match')
        OK (CellEdgeShares ([int]$sl.edge_cell[0]) ([int]$sl.edge_cell[1]) $hb[0]) ('SLOT ' + $sl.id + ' edge cell shares host footprint')
    }
    # spot distances for the record
    if ($sl.id -eq 'EAVE-M01') {
        $d = Dist ($x - 30.0) ($y - (-11.0))
        OK ($d -ge 2.2) ('SLOT EAVE-M01 spot dist to ResM07 ' + $d.ToString('F3'))
    }
    if ($sl.id -eq 'EAVE-N01') {
        $d = Dist ($x - 20.0) ($y - 11.0)
        OK ($d -ge 2.2) ('SLOT EAVE-N01 spot dist to ResN02 ' + $d.ToString('F3'))
    }
}

# ---- A4: slot-slot pair ----
$m0 = @($m.slots)[0]; $n0 = @($m.slots)[1]
$pairD = Dist ([double]$m0.x - [double]$n0.x) ([double]$m0.y - [double]$n0.y)
OK ($pairD -ge 2.2) 'A4 pair seat distance'
OK (-not (Overlap (BodyRect ([double]$m0.x) ([double]$m0.y)) (BodyRect ([double]$n0.x) ([double]$n0.y)))) 'A4 pair body disjoint'
OK (-not (Overlap (ShadowRect ([double]$m0.x) ([double]$m0.y)) (ShadowRect ([double]$n0.x) ([double]$n0.y)))) 'A4 pair shadow disjoint'
OK (-not (Overlap (TagRect ([double]$m0.x) ([double]$m0.y)) (TagRect ([double]$n0.x) ([double]$n0.y)))) 'A4 pair tag disjoint'
$ptdx = [math]::Abs([double]$m0.x - [double]$n0.x)
OK ($ptdx -ge $TagW) 'A4 pair tag-tag axis clear'

# ---- A5: max-min-slack pick law (NORTH quota 1 -> B3 west beats B2 west) ----
function WorstSlack([double]$x, [double]$y) {
    $mm = 999.0
    foreach ($s in $seats) {
        $d = Dist ($x - $s[1]) ($y - $s[2]); if (($d - 2.2) -lt $mm) { $mm = $d - 2.2 }
        $fs = FormulaSlack ([math]::Abs($x - $s[1])) ([math]::Abs($y - $s[2])) $TagW $TagH
        if ($fs -lt $mm) { $mm = $fs }
        $t1 = RectSlack (BodyRect $x $y) (BodyRect $s[1] $s[2]); if ($t1 -lt $mm) { $mm = $t1 }
        $t2 = RectSlack (BodyRect $x $y) (ShadowRect $s[1] $s[2]); if ($t2 -lt $mm) { $mm = $t2 }
        $t3 = RectSlack (ShadowRect $x $y) (BodyRect $s[1] $s[2]); if ($t3 -lt $mm) { $mm = $t3 }
        $t4 = RectSlack (ShadowRect $x $y) (ShadowRect $s[1] $s[2]); if ($t4 -lt $mm) { $mm = $t4 }
    }
    foreach ($r in $robots) {
        $d = Dist ($x - $r[1]) ($y - $r[2]); if (($d - 2.0) -lt $mm) { $mm = $d - 2.0 }
        $fs = FormulaSlack ([math]::Abs($x - $r[1])) ([math]::Abs(($y + $OffY) - $r[2])) 1.875 0.91667
        if ($fs -lt $mm) { $mm = $fs }
        $t1 = RectSlack (BodyRect $x $y) (RobotBody $r); if ($t1 -lt $mm) { $mm = $t1 }
        $t2 = RectSlack (BodyRect $x $y) (RobotShadow $r); if ($t2 -lt $mm) { $mm = $t2 }
        $t3 = RectSlack (ShadowRect $x $y) (RobotBody $r); if ($t3 -lt $mm) { $mm = $t3 }
        $t4 = RectSlack (ShadowRect $x $y) (RobotShadow $r); if ($t4 -lt $mm) { $mm = $t4 }
    }
    foreach ($veh in $vehicles) {
        $cyc = VehCenterY $veh
        $d = Dist ($x - $veh[3]) ($y - $cyc); if (($d - 2.8) -lt $mm) { $mm = $d - 2.8 }
        $t1 = RectSlack (BodyRect $x $y) (VehRect $veh); if ($t1 -lt $mm) { $mm = $t1 }
        $t2 = RectSlack (ShadowRect $x $y) (VehRect $veh); if ($t2 -lt $mm) { $mm = $t2 }
    }
    foreach ($g in $signs) {
        $hw = (SignW $g) / 2.0; $hh = (SignH $g) / 2.0
        $fs = FormulaSlack ([math]::Abs($x - $g[3])) ([math]::Abs($y - $g[4])) ($hw + 1.065) ($hh + 1.065)
        if ($fs -lt $mm) { $mm = $fs }
        $fs2 = FormulaSlack ([math]::Abs($x - $g[3])) ([math]::Abs(($y + $OffY) - $g[4])) (($TagW / 2.0) + $hw) (($TagH / 2.0) + $hh)
        if ($fs2 -lt $mm) { $mm = $fs2 }
        $t1 = RectSlack (BodyRect $x $y) (SignRect $g); if ($t1 -lt $mm) { $mm = $t1 }
        $t2 = RectSlack (ShadowRect $x $y) (SignRect $g); if ($t2 -lt $mm) { $mm = $t2 }
    }
    foreach ($b in $buildings) {
        $t1 = RectSlack (BodyRect $x $y) (BldRect $b); if ($t1 -lt $mm) { $mm = $t1 }
        $t2 = RectSlack (ShadowRect $x $y) (BldRect $b); if ($t2 -lt $mm) { $mm = $t2 }
    }
    foreach ($p in $propCells) {
        $pr = Rect $p[0] $p[1] ($p[0] + 1) ($p[1] + 1)
        $t1 = RectSlack (BodyRect $x $y) $pr; if ($t1 -lt $mm) { $mm = $t1 }
        $t2 = RectSlack (ShadowRect $x $y) $pr; if ($t2 -lt $mm) { $mm = $t2 }
    }
    foreach ($w in $interior) {
        $wr = Rect $w[1] $w[2] $w[3] $w[4]
        $t1 = RectSlack (BodyRect $x $y) $wr; if ($t1 -lt $mm) { $mm = $t1 }
        $t2 = RectSlack (ShadowRect $x $y) $wr; if ($t2 -lt $mm) { $mm = $t2 }
    }
    $fs = $FrameHalfW - ([math]::Abs($x) + $Half); if ($fs -lt $mm) { $mm = $fs }
    $fs = $FrameHalfW - ([math]::Abs($x) + $TagW / 2.0); if ($fs -lt $mm) { $mm = $fs }
    return $mm
}
$slackM = WorstSlack ([double]$m0.x) ([double]$m0.y)
$slackN = WorstSlack ([double]$n0.x) ([double]$n0.y)
$slackRU = WorstSlack 6.3333 11.0
$slackRUmid = WorstSlack 6.30 11.0
OK ($slackM -gt 0.05) ('A5 EAVE-M01 worst slack ' + $slackM.ToString('F4'))
OK ($slackN -gt 0.05) ('A5 EAVE-N01 worst slack ' + $slackN.ToString('F4'))
OK ($slackRU -lt 0.001) ('A5 runner-up window east end wall-touch slack ' + $slackRU.ToString('F4'))
OK ($slackN -gt $slackRUmid) ('A5 NORTH pick law: B3 ' + $slackN.ToString('F4') + ' > B2 mid ' + $slackRUmid.ToString('F4'))
OK ([math]::Abs($slackM - [double]$m0.worst_slack) -le 0.01) 'A5 manifest M01 worst_slack matches'
OK ([math]::Abs($slackN - [double]$n0.worst_slack) -le 0.01) 'A5 manifest N01 worst_slack matches'
OK ([math]::Abs([double]$m.runner_up.worst_slack - 0.0) -le 0.001) 'A5 manifest runner-up worst_slack is the touch'

# runner-up window bracket: clean inside, tag-tag west, building east
$vvRuMid = Violations 6.30 11.0
OK (@($vvRuMid).Count -eq 0) 'A5 runner-up window mid clean (6.30, 11)'
$vvRuE = Violations 6.3333 11.0
OK (@($vvRuE).Count -eq 0) 'A5 runner-up window east end clean (6.3333, 11)'
$vvW = Violations 6.20 11.0
OK (HasToken $vvW 'tag-tag') 'A5 runner-up west bound fires tag-tag (6.20, 11)'
$vvE = Violations 6.35 11.0
OK (HasToken $vvE 'body-building') 'A5 runner-up east bound fires body-building (6.35, 11)'

# ---- A6: 14-building face census probes (named blockers fire) ----
$probes = @(
    @{n='B4_w_seatring';   x=-2.6667;  ys=@(-14,-13,-12,-11,-10,-9); want='seat-dist';    adj=$true},
    @{n='B4_e_kioskrow';   x=3.6667;   ys=@(-14);                     want='sign-body';   adj=$true},
    @{n='B4_e_seatring';   x=3.6667;   ys=@(-13,-12,-11,-10,-9);      want='seat-dist';    adj=$true},
    @{n='MAIN_w_alley';    x=-23.5;    ys=@(-14,-13,-12,-11);         want='body-building'; adj=$true},
    @{n='MAIN_n_biggame';  x=-23.5;    ys=@(-10);                     want='sign-body';   adj=$true},
    @{n='MAIN_e_road';     x=-17.3333; ys=@(-14,-13,-12,-11);         want='body-road';    adj=$true},
    @{n='MAIN_e_north_y';  x=-17.3333; ys=@(-10,-9);                  want='body-road';    adj=$false},
    @{n='ANNEX_w_veh';     x=-26.6667; ys=@(-14,-13);                 want='veh-dist';     adj=$true},
    @{n='ANNEX_n_cart';    x=-25.5;    ys=@(-12);                     want='veh-dist';     adj=$true},
    @{n='B6_w_road';       x=18.0;     ys=@(-14,-13,-12,-11,-10,-9);  want='body-road';    adj=$true},
    @{n='B6_e_seatring';   x=25.6667;  ys=@(-14,-13,-12,-11,-10,-9);  want='seat-dist';    adj=$true},
    @{n='B6_n_road';       x=22.0;     ys=@(-7);                      want='body-road';    adj=$true},
    @{n='B6_s_building';   x=22.0;     ys=@(-14);                     want='body-building'; adj=$true},
    @{n='E1_w_m03';        x=28.3333;  ys=@(-14,-13,-12);             want='seat-dist';    adj=$true},
    @{n='E1_e_frame';      x=35.6667;  ys=@(-14,-13,-12);             want='frame';        adj=$true},
    @{n='E1_s_underfoot';  x=32.0;     ys=@(-16);                     want='underfoot';    adj=$true},
    @{n='B0_w_wedge';      x=-28.6667; ys=@(11,10);                   want='body-building'; adj=$true},
    @{n='B0_e_wedge';      x=-24.3333; ys=@(11,10);                   want='body-building'; adj=$true},
    @{n='B0_n_bubble';     x=-26.5;    ys=@(12);                      want='bubble';       adj=$true},
    @{n='B0_s_road';       x=-26.5;    ys=@(8);                       want='body-road';    adj=$true},
    @{n='B1_w_wedge';      x=-9.6667;  ys=@(11,10);                   want='body-building'; adj=$true},
    @{n='B1_e_n01';        x=-5.3333;  ys=@(11,10);                   want='seat-dist';    adj=$true},
    @{n='B1_n_bubble';    x=-7.5;     ys=@(12);                      want='bubble';       adj=$true},
    @{n='B1_s_road';       x=-7.5;     ys=@(8);                       want='body-road';    adj=$true},
    @{n='B2_e_bus';        x=10.6667;  ys=@(11,10);                   want='veh-dist';      adj=$true},
    @{n='B2_n_bubble';     x=8.5;      ys=@(12);                      want='bubble';       adj=$true},
    @{n='B2_s_road';       x=8.5;      ys=@(8);                       want='body-road';    adj=$true},
    @{n='B3_e_wedge';      x=29.6667;  ys=@(11,10);                   want='body-building'; adj=$true},
    @{n='B3_n_bubble';     x=27.5;     ys=@(12);                      want='bubble';       adj=$true},
    @{n='B3_s_road';       x=27.5;     ys=@(8);                       want='body-road';    adj=$true},
    @{n='B7_w_n01';        x=-1.6667;  ys=@(11,10);                   want='seat-dist';    adj=$true},
    @{n='B7_e_t01';        x=2.6667;   ys=@(11,10);                   want='seat-dist';    adj=$true},
    @{n='B7_n_tint';       x=0.5;      ys=@(15);                      want='tint';         adj=$true},
    @{n='B7_s_road';       x=0.5;      ys=@(8);                       want='body-road';    adj=$true},
    @{n='N1_w_wedge';      x=-24.6667; ys=@(11,10);                   want='body-building'; adj=$true},
    @{n='N1_e_road';       x=-17.3333; ys=@(11,10);                   want='body-road';    adj=$true},
    @{n='N1_n_cell';       x=-21.0;    ys=@(13);                      want='body-building'; adj=$true},
    @{n='N1_s_road';       x=-21.0;    ys=@(8);                       want='body-road';    adj=$true},
    @{n='N2_w_road';       x=-16.6667; ys=@(11,10);                   want='body-road';    adj=$true},
    @{n='N2_e_wedge';      x=-9.3333;  ys=@(11,10);                   want='body-building'; adj=$true},
    @{n='N2_n_cell';       x=-13.0;    ys=@(13);                      want='body-building'; adj=$true},
    @{n='N2_s_road';       x=-13.0;    ys=@(8);                       want='body-road';    adj=$true},
    @{n='N3_w_frame';      x=-35.6667; ys=@(11,10);                   want='frame';        adj=$true},
    @{n='N3_e_wedge';      x=-28.3333; ys=@(11,10);                   want='body-building'; adj=$true},
    @{n='N3_n_cell';       x=-32.0;    ys=@(13);                      want='body-building'; adj=$true},
    @{n='N3_s_road';       x=-32.0;    ys=@(8);                       want='body-road';    adj=$true},
    @{n='N4_w_wedge';      x=28.3333;  ys=@(11,10);                   want='body-building'; adj=$true},
    @{n='N4_e_frame';      x=35.6667;  ys=@(11,10);                   want='frame';        adj=$true},
    @{n='N4_n_cell';       x=32.0;     ys=@(13);                      want='body-building'; adj=$true},
    @{n='N4_s_road';       x=32.0;     ys=@(8);                       want='body-road';    adj=$true}
)
foreach ($p in $probes) {
    foreach ($yy in $p.ys) {
        $vp = Violations ([double]$p.x) ([double]$yy)
        OK (HasToken $vp $p.want) ('A6 ' + $p.n + ' y=' + $yy + ' fires ' + $p.want)
        if ($p.adj) {
            OK (-not (HasToken $vp 'adjacency')) ('A6 ' + $p.n + ' y=' + $yy + ' is eave-adjacent')
        }
    }
}

# ---- A7: quota ledger coherence ----
OK ($m.law.capacity -eq 1) 'A7 capacity 1 per slot'
OK ($null -ne $m.law.fallback) 'A7 fallback law present'
OK ($null -ne $m.coupled_updates_r124) 'A7 r124 handover present'
OK ($m.token_gate -like 'L1*') 'A7 token gate L1'

Write-Output ('PASS=' + $pass + ' FAIL=' + $fail)
if ($fail -gt 0) { exit 1 } else { exit 0 }
