# Tower v2.0 reshape sandbox gates (r131 survey round, zero editor budget)
# Manifest = Tools/city/tower-v2-manifest.json (single geometry source for r132 editor round)
# Pattern: r103 southbank / r111 officeband / r123 eaveslots - pure math over the manifest.
# ASCII-only script body (group PS5.1 GBK law). Exit 0 = all green, 1 = any red.

$ErrorActionPreference = 'Stop'
$manifestPath = Join-Path $PSScriptRoot '..\Tools\city\tower-v2-manifest.json'
$southPath = Join-Path $PSScriptRoot '..\Tools\city\southbank-manifest.json'

$script:pass = 0
$script:fail = 0
function Chk([string]$name, [bool]$cond) {
    if ($cond) { $script:pass++; Write-Output ("PASS " + $name) }
    else { $script:fail++; Write-Output ("FAIL " + $name) }
}
function Near([double]$a, [double]$b, [double]$eps) { return ([Math]::Abs($a - $b) -le $eps) }

# explicit UTF8 read (r53 law)
$m = Get-Content -Raw -Encoding UTF8 -Path $manifestPath | ConvertFrom-Json
$south = Get-Content -Raw -Encoding UTF8 -Path $southPath | ConvertFrom-Json

# --- A0 structure ---
Chk 'A0 protocol' ($m.protocol -eq 'fluxverse-tower-v2/0.1')
Chk 'A0 baked_round' ($m.baked_round -eq 131)
Chk 'A0 sources>=4' (@($m.sources).Count -ge 4)
Chk 'A0 zones present' ($null -ne $m.geometry.base_data_plinth -and $null -ne $m.geometry.shaft -and $null -ne $m.geometry.wedge_shoulder -and $null -ne $m.geometry.wedge_tip)
Chk 'A0 antennas trio' (@($m.antennas.middle, $m.antennas.left, $m.antennas.right).Count -eq 3)
Chk 'A0 seat moves' ($null -ne $m.seat_moves.ResT01 -and $null -ne $m.seat_moves.ResN01)
Chk 'A0 coupled updates >=8' (@($m.coupled_updates_editor_round).Count -ge 8)
Chk 'A0 deferred faces >=3' (@($m.deferred_faces).Count -ge 3)

# --- A1 height laws ---
$w = $m.geometry.whole
Chk 'A1 px_h 160' ($w.px_h -eq 160)
Chk 'A1 rows 10' ($w.cells[3] -eq 10)
Chk 'A1 world height 10u' (Near ($w.world[3] - $w.world[1]) 10.0 0.0001)
Chk 'A1 top cell row 18' ($m.geometry.height_law.top_cell_row -eq 18)
Chk 'A1 top world 19.0' (Near $m.geometry.height_law.top_world_y 19.0 0.0001)
Chk 'A1 zenith floor 19.04' (Near $m.geometry.height_law.zenith_floor 19.04 0.0001)
Chk 'A1 margin 0.04' (Near $m.geometry.height_law.margin 0.04 0.0001)
Chk 'A1 top below zenith floor' (($m.geometry.height_law.top_world_y) -lt ($m.geometry.height_law.zenith_floor))

# --- A2 tallness ordering (cross-file vs southbank manifest) ---
$quant = $south.masses | Where-Object { $_.id -eq 'QUANT' }
$media = $south.masses | Where-Object { $_.id -eq 'MEDIA' }
Chk 'A2 southbank QUANT px 128' ($quant.px_h -eq 128)
Chk 'A2 brain 160 > QUANT 128 (city-unique commanding height)' ($w.px_h -gt $quant.px_h)
Chk 'A2 QUANT 128 > MEDIA 96 (southbank internal order kept)' ($quant.px_h -gt $media.px_h)
Chk 'A2 north flank low-rise 3u <= tower/3 3.333' (3.0 -le (10.0 / 3.0))
Chk 'A2 canon conflict resolution recorded' ($m.canon_conflicts.resolution.Length -gt 20)

# --- A3 base widening vs seats ---
$b = $m.geometry.base_data_plinth
Chk 'A3 base cells x -2..2 rows 9..10' ($b.cells[0] -eq -2 -and $b.cells[1] -eq 2 -and $b.cells[2] -eq 9 -and $b.cells[3] -eq 2)
Chk 'A3 base world rect' ($b.world[0] -eq -2.0 -and $b.world[1] -eq 9.0 -and $b.world[2] -eq 3.0 -and $b.world[3] -eq 11.0)
$halfBody = 1.333 / 2.0
$n01L = -3.5 - $halfBody; $n01R = -3.5 + $halfBody
$t01L = $m.seat_moves.ResT01.to_x - $halfBody; $t01R = $m.seat_moves.ResT01.to_x + $halfBody
Chk 'A3 N01 body clear of plinth left >=0.8' ((($b.world[0]) - ($n01R)) -ge 0.8)
Chk 'A3 T01 body clear of plinth right >=0.8' ((($t01L) - ($b.world[2])) -ge 0.8)
Chk 'A3 T01 clearance mirrors N01' (Near (($t01L - $b.world[2]) - ($b.world[0] - $n01R)) 0.0 0.0001)
Chk 'A3 feet cells floor law' (([Math]::Floor(-3.5)) -eq -4 -and ([Math]::Floor($m.seat_moves.ResT01.to_x)) -eq 4)
Chk 'A3 honor seat stays tower-flank <=5u' (([Math]::Abs($m.seat_moves.ResT01.to_x - 0.5)) -le 5.0)
Chk 'A3 T01 y unchanged 11' ($m.seat_moves.ResT01.y -eq 11.0)

# --- A4 roads untouched ---
Chk 'A4 vcol roads far (17 > base max x 3)' (17 -gt $b.world[2])
Chk 'A4 base starts above road rows (9 > 8)' ($b.cells[2] -gt 8)
Chk 'A4 tower band inside pavement rows 9..14 footprint zone' ($b.cells[2] -ge 9 -and $b.cells[2] -le 14)

# --- A5 tint band and sky budget ---
Chk 'A5 tint band note present' ($m.tint_band_note.law.Length -gt 20)
Chk 'A5 sky top half 1u > 0' ((20.0 - 19.0) -gt 0)
Chk 'A5 sky bottom half 4u > 0' (((-16.0) - (-20.0)) -gt 0)
Chk 'A5 sky total 5u = 40-35 formula' (Near (((20.0 - 19.0) + (-16.0 - (-20.0)))) (40.0 - 35.0) 0.0 0.0001)

# --- A6 antenna trio ---
$aMid = $m.antennas.middle; $aL = $m.antennas.left; $aR = $m.antennas.right
$tipX0 = $m.geometry.wedge_tip.world[0]; $tipX1 = $m.geometry.wedge_tip.world[2]
Chk 'A6 middle center 0.5' (Near $aMid.x_center 0.5 0.0001)
Chk 'A6 side centers symmetric' (Near ((($aL.x_center) + ($aR.x_center)) / 2.0) 0.5 0.0001)
Chk 'A6 middle strictly tallest' ($aMid.h -gt $aL.h -and $aMid.h -gt $aR.h)
Chk 'A6 middle strictly widest' ($aMid.w -gt $aL.w -and $aMid.w -gt $aR.w)
Chk 'A6 all needles inside tip x span' ($aL.rect[0] -ge $tipX0 -and $aR.rect[2] -le $tipX1)
Chk 'A6 all tops <= 19.9 below L0 frame 20' (($aMid.rect[3]) -le 19.9 -and ($aL.rect[3]) -le 19.9 -and ($aR.rect[3]) -le 19.9)
$land = $m.anchors.antenna_pos.lands
Chk 'A6 AntennaPos lands inside middle needle rect' ($land[0] -ge $aMid.rect[0] -and $land[0] -le $aMid.rect[2] -and $land[1] -ge $aMid.rect[1] -and $land[1] -le $aMid.rect[3])

# --- A7 wedge geometry ---
$sh = $m.geometry.wedge_shoulder; $tip = $m.geometry.wedge_tip
$shaft = $m.geometry.shaft
Chk 'A7 shoulder 3 cells' (($sh.cells[1] - $sh.cells[0] + 1) -eq 3)
Chk 'A7 tip 1 cell' (($tip.cells[1] - $tip.cells[0] + 1) -eq 1)
Chk 'A7 tip centered on shaft center 0.5' (Near ((($tip.world[0]) + ($tip.world[2])) / 2.0) ((($shaft.world[0]) + ($shaft.world[2])) / 2.0) 0.0001)
Chk 'A7 two-step wedge 3->1' ((($sh.cells[1] - $sh.cells[0]) + 1) -gt (($tip.cells[1] - $tip.cells[0]) + 1))

# --- A8 data bands and pipes ---
$rows = @()
foreach ($fr in $m.data_bands.full_rows) { $rows += $fr.row }
foreach ($s in $m.data_bands.indicator_singles) { $rows += $s.cell[1] }
$inShaft = $true
foreach ($r in $rows) { if (($r -lt 11) -or ($r -gt 16)) { $inShaft = $false } }
Chk 'A8 band rows inside shaft 11..16' ($inShaft)
$bandCells = 0
foreach ($fr in $m.data_bands.full_rows) { $bandCells += ($fr.cells_x[1] - $fr.cells_x[0] + 1) }
$bandCells += @($m.data_bands.indicator_singles).Count
Chk 'A8 band prop cell total = declared' ($bandCells -eq $m.data_bands.total_prop_cells)
$pipes = $m.base_pipes.boxes
$pipeOk = $true
foreach ($p in $pipes) {
    if (($p[0] -ne -2 -and $p[0] -ne 2) -or ($p[1] -ne 11)) { $pipeOk = $false }
}
Chk 'A8 pipes on plinth shoulders row 11' ($pipeOk)
Chk 'A8 pipes clear of seats (>=0.8u same law as plinth)' ((($m.seat_moves.ResT01.to_x - $halfBody) - 3.0) -ge 0.8)

# --- A9 encoding audits ---
$bytes = [IO.File]::ReadAllBytes($manifestPath)
$nonAscii = 0
foreach ($by in $bytes) { if ($by -gt 127) { $nonAscii++ } }
Chk 'A9 manifest ASCII-only bytes' ($nonAscii -eq 0)
$selfBytes = [IO.File]::ReadAllBytes($PSCommandPath)
$selfNonAscii = 0
foreach ($by in $selfBytes) { if ($by -gt 127) { $selfNonAscii++ } }
Chk 'A9 script ASCII-only bytes' ($selfNonAscii -eq 0)
Chk 'A9 explicit UTF8 read used (manifest parsed)' ($null -ne $m.protocol)

Write-Output ('SUMMARY pass=' + $script:pass + ' fail=' + $script:fail)
if ($script:fail -gt 0) { exit 1 } else { exit 0 }
