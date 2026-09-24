# FluxVerse r110 offline sandbox: card hit-law re-derivation for the stacked
# r99/r105 street. Replicates ResidentCardRules.HitTest (old first-match vs new
# nearest-covering-center) over the real 32-seat table and runs every CardProof
# A-section gate family. Pure math, zero editor. ASCII only (PS5.1 law).
$ErrorActionPreference = "Stop"

# the live seat table (ResidentRules.Table, r104/r105 moves included)
$seats = @(
    @{n='ResQ01';x=-8.0;y=-12.0}, @{n='ResQ02';x=-3.2;y=-9.0},  @{n='ResQ03';x=4.5;y=-11.0},
    @{n='ResQ04';x=-3.5;y=-12.0}, @{n='ResQ05';x=-6.0;y=-9.0},  @{n='ResQ06';x=6.2;y=-9.0},
    @{n='ResQ07';x=10.0;y=-14.0}, @{n='ResQ08';x=-10.0;y=-13.0},@{n='ResQ09';x=-5.0;y=-14.0},
    @{n='ResG01';x=-24.5;y=-9.0}, @{n='ResG02';x=-12.0;y=-11.0},@{n='ResG03';x=-15.0;y=-14.0},
    @{n='ResG04';x=-14.0;y=-12.0},@{n='ResG05';x=-12.0;y=-14.0},@{n='ResG06';x=-14.5;y=-9.0},
    @{n='ResG07';x=-31.5;y=-13.0},
    @{n='ResM01';x=26.0;y=-14.0}, @{n='ResM02';x=15.5;y=-14.0}, @{n='ResM03';x=28.0;y=-13.0},
    @{n='ResM04';x=27.0;y=-11.0}, @{n='ResM05';x=12.5;y=-11.0}, @{n='ResM06';x=16.0;y=-11.0},
    @{n='ResM07';x=30.0;y=-11.0}, @{n='ResM08';x=29.0;y=-9.0},
    @{n='ResN01';x=-3.5;y=11.0},  @{n='ResN02';x=20.0;y=11.0},  @{n='ResT01';x=3.5;y=11.0},
    @{n='ResV01';x=-10.5;y=-9.0}, @{n='ResV02';x=9.5;y=-9.0},   @{n='ResV03';x=15.0;y=-9.0},
    @{n='ResV04';x=-27.5;y=-9.0}, @{n='ResV05';x=26.0;y=-9.0}
)
$HitHalfW = 1.15; $HitTop = 2.0
# bubble center y offset: tag center y = seat y + 1.4167; tag half h = 0.833/2;
# bubble = tagTop(=tag.y+0.41665) + 0.15 + WorldH(1.5)/2
$BubbleDy = 1.4167 + 0.41665 + 0.15 + 0.75

function Hit-FirstMatch([double]$wx, [double]$wy) {
    for ($i = 0; $i -lt $seats.Count; $i++) {
        $p = $seats[$i]
        if ([Math]::Abs($wx - $p.x) -le $HitHalfW -and $wy -ge ($p.y - 1.0) -and $wy -le ($p.y + $HitTop)) { return $i }
    }
    return -1
}
function Hit-Nearest([double]$wx, [double]$wy) {
    $best = -1; $bd = [double]::MaxValue
    for ($i = 0; $i -lt $seats.Count; $i++) {
        $p = $seats[$i]
        if ([Math]::Abs($wx - $p.x) -le $HitHalfW -and $wy -ge ($p.y - 1.0) -and $wy -le ($p.y + $HitTop)) {
            $d = ($wx - $p.x) * ($wx - $p.x) + ($wy - $p.y) * ($wy - $p.y)
            if ($d -lt $bd) { $bd = $d; $best = $i }
        }
    }
    return $best
}
function Test-Covers([int]$i, [double]$wx, [double]$wy) {
    $p = $seats[$i]
    return ([Math]::Abs($wx - $p.x) -le $HitHalfW -and $wy -ge ($p.y - 1.0) -and $wy -le ($p.y + $HitTop))
}

$oldRed = @(); $newRed = @()
for ($i = 0; $i -lt $seats.Count; $i++) {
    $p = $seats[$i]
    # NEW gate family (r110): center=self; head/plate = own-rect covers + someone
    # answers; x-miss/below-feet/bubble = never self (nearest-covering law)
    $head = @{x=$p.x; y=($p.y + 1.9)}
    $plate = @{x=$p.x; y=($p.y + 1.567)}
    $c = Hit-Nearest $p.x $p.y
    if ($c -ne $i) { $newRed += ($seats[$i].n + ':center->' + $c) }
    foreach ($pt in @($head, $plate)) {
        if (-not (Test-Covers $i $pt.x $pt.y)) { $newRed += ($seats[$i].n + ':covers-fail') }
        $h = Hit-Nearest $pt.x $pt.y
        if ($h -lt 0) { $newRed += ($seats[$i].n + ':column-no-answer') }
    }
    $xm = Hit-Nearest ($p.x + 1.5) $p.y
    if ($xm -eq $i) { $newRed += ($seats[$i].n + ':xmiss->self') }
    $bf = Hit-Nearest $p.x ($p.y - 1.3)
    if ($bf -eq $i) { $newRed += ($seats[$i].n + ':belowfeet->self') }
    $bu = Hit-Nearest $p.x ($p.y + $BubbleDy)
    if ($bu -eq $i) { $newRed += ($seats[$i].n + ':bubble->self') }
    # OLD gate family (first-match, expect -1 outs) for the delta record
    $probes = @(
        @{k='center';    x=$p.x;       y=$p.y;          want='eq'},
        @{k='headtop';   x=$p.x;       y=($p.y + 1.9);  want='eq'},
        @{k='plate';     x=$p.x;       y=($p.y + 1.567);want='eq'},
        @{k='xmiss';     x=($p.x + 1.5); y=$p.y;        want='ne'},
        @{k='belowfeet'; x=$p.x;       y=($p.y - 1.3);  want='ne'},
        @{k='bubble';    x=$p.x;       y=($p.y + $BubbleDy); want='ne'}
    )
    foreach ($pr in $probes) {
        $old = Hit-FirstMatch $pr.x $pr.y
        $oldOk = if ($pr.want -eq 'eq') { $old -eq $i } else { $old -eq -1 }
        if (-not $oldOk) { $oldRed += ($seats[$i].n + ':' + $pr.k + '->' + $old) }
    }
}
# robot slots must hit nobody under BOTH laws
$robots = @(
    @{x=-5.5;y=-11.5}, @{x=5.5;y=-13.5}, @{x=-2.5;y=-15.0}, @{x=-12.5;y=-7.5},
    @{x=12.5;y=-7.5}, @{x=-21.5;y=-8.0}, @{x=18.5;y=-11.5}, @{x=14.5;y=4.5}
)
$r = 0
foreach ($rb in $robots) {
    if ((Hit-FirstMatch $rb.x $rb.y) -ne -1) { $oldRed += ('Robot' + $r + ':hit') }
    if ((Hit-Nearest $rb.x $rb.y) -ne -1) { $newRed += ('Robot' + $r + ':hit') }
    $r++
}
Write-Output ("OLD-LAW (first-match, expect==-1 gates) reds: " + $oldRed.Count)
$oldRed | Select-Object -First 20 | ForEach-Object { Write-Output ("  " + $_) }
Write-Output ("NEW-LAW (nearest-covering, r110 gate family) reds: " + $newRed.Count)
$newRed | ForEach-Object { Write-Output ("  " + $_) }
if ($newRed.Count -eq 0) { Write-Output 'SANDBOX VERDICT: new law + new gates fully green on the live table' } else { Write-Output 'SANDBOX VERDICT: NEW LAW STILL RED - do not patch the proof yet' }
