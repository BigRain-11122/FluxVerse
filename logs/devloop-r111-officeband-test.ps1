# FluxVerse DevLoop r111 officeband sandbox gate (ASCII only, PS5.1).
# Validates Tools/city/officeband-manifest.json against the coupled live
# entity tables (post-r105 state: 32 seats / 8 robots / 8 vehicles / 18 signs /
# 8 mounting buildings / 4 anchors / props / interior rects) BEFORE the r112
# editor round. Laws: zero-move zero-encroachment, north low-rise cap 13 <
# brain 15, south top <= -8, frame +-35.256, vcol/river protected, IdentityProof
# sprite-family protection, detector positive controls. Exit 0 = all green.

$ErrorActionPreference = 'Stop'
$repo = Split-Path -Parent $PSScriptRoot
$mp = Join-Path $repo 'Tools\city\officeband-manifest.json'
if (-not (Test-Path $mp)) { Write-Output 'FATAL manifest missing'; exit 1 }
$m = ConvertFrom-Json ([IO.File]::ReadAllText($mp, (New-Object Text.UTF8Encoding($false))))
$eps = 0.0001
$pass = 0; $fail = 0
function OK($cond, $name) {
    if ($cond) { $script:pass++ } else { $script:fail++; Write-Output ('FAIL: ' + $name) }
}
function Rect($x0, $y0, $x1, $y1) { return @([double]$x0, [double]$y0, [double]$x1, [double]$y1) }
function Overlap($a, $b) {
    return ($a[0] -lt $b[2]) -and ($b[0] -lt $a[2]) -and ($a[1] -lt $b[3]) -and ($b[1] -lt $a[3])
}
function NEQ($a, $b) { return ([math]::Abs([double]$a - [double]$b) -gt $eps) }

# --- A0 manifest structure + ASCII audit ---
OK ($m.protocol -eq 'fluxverse-officeband/0.1') 'A0 protocol'
OK ($m.baked_round -eq 111) 'A0 round'
OK ($m.placements.Count -eq 5) 'A0 five placements'
$names = @($m.placements | ForEach-Object { $_.name })
OK (($names | Select-Object -Unique).Count -eq 5) 'A0 names unique'
foreach ($n in $names) { OK ($n -match '^Office0[1-5]$') ('A0 name pattern ' + $n) }
$asciiBytes = [IO.File]::ReadAllBytes($mp)
OK (@($asciiBytes | Where-Object { $_ -ge 128 }).Count -eq 0) 'A0 manifest pure ASCII'

# --- live entity tables (mirrors of the C# single sources, post-r105) ---
# NeonRules.Buildings (world rects, the mounting-building canon)
$buildings = @(
    @( 'B0_NW',      -28.0, 9.0,  -25.0, 12.0),
    @( 'B1_NWmid',    -9.0, 9.0,   -6.0, 12.0),
    @( 'B2_NEmid',     7.0, 9.0,   10.0, 12.0),
    @( 'B3_NE',       26.0, 9.0,   29.0, 12.0),
    @( 'B4_QUANT',    -2.0, -16.0,  3.0, -8.0),
    @( 'B5_GAMEMAIN', -23.0, -16.0, -18.0, -11.0),
    @( 'B6_MEDIA',    19.0, -14.0, 25.0, -8.0),
    @( 'B7_BRAIN',    -1.0, 9.0,    2.0, 15.0)
)
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
$vehicles = @(
    @('VehicleCarW', 78, 36, -26.6, -7.0), @('VehicleCarQE', 78, 36, 5.5, -7.0),
    @('VehicleCarE', 78, 36, 16.0, -7.0), @('VehicleCamperW', 94, 56, -28.5, -13.0),
    @('VehicleBusN', 115, 62, 12.0, 8.0), @('VehicleCartQ', 44, 48, 7.5, -12.5),
    @('VehicleCartG', 48, 55, -25.5, -13.0), @('VehicleStopN', 15, 37, 16.5, 9.0)
)
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
$anchors = @(
    @('BrainTower', 0.0, 11.0), @('Zone_GAME', -20.5, -11.0),
    @('Zone_QUANT', 0.5, -12.0), @('Zone_MEDIA', 22.0, -11.0)
)
# CitySkeletonBuilder props cells (x, y) -> 1u cell rects
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
function SeatRect($s) { return Rect ($s[1] - 0.66667) ($s[2] - 0.66667) ($s[1] + 0.66667) ($s[2] + 0.66667) }
function SeatShadowRect($s) { return Rect ($s[1] - 0.66667) ($s[2] - 0.7267 - 0.16667) ($s[1] + 0.66667) ($s[2] - 0.7267 + 0.16667) }
function SeatPlateRect($s) { return Rect ($s[1] - 1.375) ($s[2] + 1.4167 - 0.41667) ($s[1] + 1.375) ($s[2] + 1.4167 + 0.41667) }
function RobotRect($r) { return Rect ($r[1] - 0.5) ($r[2] - 0.5) ($r[1] + 0.5) ($r[2] + 0.5) }
function RobotShadowRect($r) { return Rect ($r[1] - 0.5) ($r[2] - 0.56 - 0.1875) ($r[1] + 0.5) ($r[2] - 0.56 + 0.1875) }
function VehRect($v) {
    $w = $v[1] / 24.0; $h = $v[2] / 24.0
    return Rect ($v[3] - $w / 2.0) ($v[4]) ($v[3] + $w / 2.0) ($v[4] + $h)
}
function SignRect($g) {
    $w = $g[1] / $g[5]; $h = $g[2] / $g[5]
    return Rect ($g[3] - $w / 2.0) ($g[4] - $h / 2.0) ($g[3] + $w / 2.0) ($g[4] + $h / 2.0)
}
function CellRect($c) { return Rect $c[0] $c[1] ($c[0] + 1) ($c[1] + 1) }

# --- placements from manifest ---
$pl = @{}
foreach ($p in $m.placements) { $pl[$p.id] = Rect $p.world[0] $p.world[1] $p.world[2] $p.world[3] }
$plCells = @{}
foreach ($p in $m.placements) { $plCells[$p.id] = $p.cells }
$ids = @('E1', 'N3', 'N1', 'N2', 'N4')

# --- A1 geometry + band + frame + protected surfaces ---
foreach ($p in $m.placements) {
    $id = $p.id; $r = $pl[$id]; $c = $plCells[$id]
    OK (-not (NEQ $r[0] ([double]$c[0]))) ('A1 cells->world x0 ' + $id)
    OK (-not (NEQ $r[1] ([double]$c[2]))) ('A1 cells->world y0 ' + $id)
    OK (-not (NEQ $r[2] ([double]$c[1] + 1))) ('A1 cells->world x1 ' + $id)
    OK (-not (NEQ $r[3] ([double]$c[3] + 1))) ('A1 cells->world y1 ' + $id)
    OK (-not (NEQ ($r[2] - $r[0]) ($p.px[0] / $p.ppu))) ('A1 px->world width ' + $id)
    OK (-not (NEQ ($r[3] - $r[1]) ($p.px[1] / $p.ppu))) ('A1 px->world height ' + $id)
    OK ($r[1] -ge -16.0 - $eps) ('A1 tint/band floor ' + $id)
    OK ($r[3] -le 15.0 + $eps) ('A1 tint band ceiling ' + $id)
    if ($p.bank -eq 'south') {
        OK ($r[1] -ge -16.0 - $eps) ('A1 south band floor ' + $id)
        OK ($r[3] -le -8.0 + $eps) ('A1 south top edge <= -8 ' + $id)
    } else {
        OK ($r[1] -ge 9.0 - $eps) ('A1 north walkway floor ' + $id)
        OK ($r[3] -le 13.0 + $eps) ('A1 north cap top <= 13 ' + $id)
    }
    OK (([math]::Abs($r[0]) -le 35.256 + $eps) -and ([math]::Abs($r[2]) -le 35.256 + $eps)) ('A1 static L0 frame ' + $id)
    OK (-not (Overlap $r (Rect -18 -50 -16 50))) ('A1 vcol-west clear ' + $id)
    OK (-not (Overlap $r (Rect 16 -50 18 50))) ('A1 vcol-east clear ' + $id)
    OK (-not (Overlap $r (Rect -50 -3 50 3))) ('A1 river clear ' + $id)
}

# --- A2 mutual non-overlap (10 pairs) ---
for ($i = 0; $i -lt $ids.Count; $i++) {
    for ($j = $i + 1; $j -lt $ids.Count; $j++) {
        OK (-not (Overlap $pl[$ids[$i]] $pl[$ids[$j]])) ('A2 disjoint ' + $ids[$i] + '/' + $ids[$j])
    }
}
# registered side adjacency: N4 west face touches NeonRules.Buildings[3] east face at x=29
$b3 = Rect 26.0 9.0 29.0 12.0
OK (-not (Overlap $pl['N4'] $b3)) 'A2 N4/B3 no overlap (touch allowed)'
OK (-not (NEQ $pl['N4'][0] $b3[2])) 'A2 N4/B3 registered zero-gap touch at x=29'

# --- A3 zero-encroachment census vs every live entity ---
foreach ($p in $m.placements) {
    $id = $p.id; $r = $pl[$id]
    foreach ($b in $buildings) {
        OK (-not (Overlap $r (Rect $b[1] $b[2] $b[3] $b[4]))) ('A3 building ' + $id + '/' + $b[0])
    }
    foreach ($s in $seats) {
        OK (-not (Overlap $r (SeatRect $s))) ('A3 seat ' + $id + '/' + $s[0])
        OK (-not (Overlap $r (SeatShadowRect $s))) ('A3 seat-shadow ' + $id + '/' + $s[0])
        OK (-not (Overlap $r (SeatPlateRect $s))) ('A3 plate ' + $id + '/' + $s[0])
    }
    foreach ($rb in $robots) {
        OK (-not (Overlap $r (RobotRect $rb))) ('A3 robot ' + $id + '/' + $rb[0])
        OK (-not (Overlap $r (RobotShadowRect $rb))) ('A3 robot-shadow ' + $id + '/' + $rb[0])
    }
    foreach ($v in $vehicles) {
        OK (-not (Overlap $r (VehRect $v))) ('A3 vehicle ' + $id + '/' + $v[0])
    }
    foreach ($g in $signs) {
        OK (-not (Overlap $r (SignRect $g))) ('A3 sign ' + $id + '/' + $g[0])
    }
    foreach ($a in $anchors) {
        $inside = ($r[0] -lt $a[1]) -and ($a[1] -lt $r[2]) -and ($r[1] -lt $a[2]) -and ($a[2] -lt $r[3])
        OK (-not $inside) ('A3 anchor ' + $id + '/' + $a[0])
    }
    foreach ($c in $propCells) {
        OK (-not (Overlap $r (CellRect $c))) ('A3 prop ' + $id + '/(' + $c[0] + ',' + $c[1] + ')')
    }
    foreach ($w in $interior) {
        OK (-not (Overlap $r (Rect $w[1] $w[2] $w[3] $w[4]))) ('A3 interior ' + $id + '/' + $w[0])
    }
}

# --- A4 hierarchy + landmark competition ---
foreach ($p in $m.placements) {
    $r = $pl[$p.id]
    OK (-not (NEQ ($r[3] - $r[1]) 4.0)) ('A4 office height 4u ' + $p.id)
    OK (($r[3] - $r[1]) -lt 6.0) ('A4 below MEDIA/brain 6u ' + $p.id)
    OK (($r[3] - $r[1]) -lt 8.0) ('A4 below QUANT 8u ' + $p.id)
}
foreach ($p in $m.placements) {
    if ($p.bank -eq 'north') {
        OK ($pl[$p.id][3] -lt 15.0) ('A4 brain sole north commanding ' + $p.id)
    }
}

# --- A5 on-disk assets + survey cross-check + provenance ---
$cityRoot = Join-Path $repo 'City'
foreach ($p in $m.placements) {
    $ap = Join-Path $cityRoot ($p.asset -replace '/', '\')
    OK (Test-Path $ap) ('A5 asset on disk ' + $p.id)
}
$scan = ConvertFrom-Json ([IO.File]::ReadAllText((Join-Path $repo 'logs\devloop-r101-landmark-scan.json'), (New-Object Text.UTF8Encoding($false))))
foreach ($p in $m.placements) {
    $base = [IO.Path]::GetFileName($p.asset)
    $entry = @($scan.files | Where-Object { $_.name -eq $base })[0]
    OK ($null -ne $entry) ('A5 survey entry ' + $p.id)
    if ($null -ne $entry) {
        OK ($entry.w -eq $p.px[0]) ('A5 survey px_w ' + $p.id)
        OK ($entry.h -eq $p.px[1]) ('A5 survey px_h ' + $p.id)
        $g48 = @($entry.grids | Where-Object { $_.cell -eq 48 })[0]
        OK ($null -ne $g48) ('A5 48px grid entry ' + $p.id)
        if ($null -ne $g48) {
            OK ($g48.comp_count -eq 1) ('A5 single-component ' + $p.id)
            OK (($g48.cols -eq 3) -and ($g48.rows -eq 2)) ('A5 3x2 cell block ' + $p.id)
        }
    }
}
$packDir = Join-Path $cityRoot 'Assets\ArtPacks\office-ladder'
$pngCount = (Get-ChildItem $packDir -Filter '*.png' -ErrorAction SilentlyContinue).Count
# r112: 74 stock (r102 record) + 1 pre-baked pixel-exact mirror (bake-office-mirror.ps1)
OK ($pngCount -eq 75) 'A5 pack 75 png (74 stock r102 + 1 r112 mirror)'
$ledgerPath = Join-Path $cityRoot 'Assets\ArtPacks\ARTPACKS-LEDGER.md'
$ledgerHit = @(Get-Content $ledgerPath -Encoding UTF8 | Where-Object { $_ -match 'office-ladder' })
OK ($ledgerHit.Count -ge 1) 'A5 ledger office-ladder section'

# --- A6 detector positive controls (rejected windows genuinely blocked) ---
$g07 = SeatRect @('ResG07', -31.5, -13.0)
$w1old = Rect -35.0 -16.0 -29.0 -12.0
OK (Overlap $w1old $g07) 'A6 west-outer south rejected by G07 (detector fires)'
$bus = VehRect @('VehicleBusN', 115, 62, 12.0, 8.0)
$n3old = Rect 11.0 9.0 17.0 13.0
OK (Overlap $n3old $bus) 'A6 east-central north rejected by bus body (detector fires)'
$kiosk = SignRect @('NeonKiosk', 21, 18, 4.2, -15.0, 16)
$centralOld = Rect 3.0 -16.0 9.0 -12.0
OK (Overlap $centralOld $kiosk) 'A6 south-central rejected by kiosk (detector fires)'

# --- A7 AmbientProof far-shore strip re-derivation (north top edge) ---
# rows 925..938 of 1080 -> world y +14.26..+14.74; px x 300..1600 of 1920 -> x -24.44..+23.70
$farShore = Rect -24.44 14.26 23.70 14.74
$farHits = 0
foreach ($p in $m.placements) {
    if (Overlap $pl[$p.id] $farShore) { $farHits++ }
}
OK ($farHits -eq 0) 'A7 far-shore strip untouched by every placement'

Write-Output ('PASS=' + $pass + ' FAIL=' + $fail)
if ($fail -gt 0) { exit 1 } else { exit 0 }
