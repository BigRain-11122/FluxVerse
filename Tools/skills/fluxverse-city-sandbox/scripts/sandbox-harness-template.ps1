# FluxVerse city layout-sandbox harness template (gate family r103..r169).
# Copy to logs/devloop-r<N>-<name>-test.ps1 and fill the FILL sections.
# ASCII law (PS5.1): no CJK literals in this body. CJK paths/content go
# through external UTF-8 data files or codepoint construction. Every read
# of CJK files MUST use -Encoding UTF8 (r53 law). The harness stays in
# logs/ (gitignored, evidence only); the round manifest in Tools/city/
# is the canonical geometry source that enters git.
# Gate constants and derivation laws: see references/gate-family.md.
# PS5.1 trap laws (read BEFORE editing): see references/ps51-traps.md.
# PARAMETER-MODE CALL LAWS -- pinned here because they recurred in r180/r188
# AFTER the reference docs existed (copy-the-template beats read-the-docs):
#  L1 (r159c): helper calls pass two args SPACE-SEPARATED: Chk (<cond>) '<name>'.
#     A comma between the args binds ONE array to the first param, the second
#     stays null, and every check silently fails. Never put a comma between args.
#  L2 (r64/r95): inside @(...), parenthesize every COMPUTED element -- comma
#     binds tighter than binary operators, so bare arithmetic splits or merges
#     elements. Shape: @(($x - $w), ($y - $h), ($x + $w), ($y + $h))

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$pass = 0; $fail = 0

function Chk([bool]$cond, [string]$name) {   # L1 call law (r159c): two space-separated args; a comma between them = silent all-FAIL
    if ($cond) { $script:pass++ } else { $script:fail++; Write-Host ('FAIL: ' + $name) }
}
function Ov($a, $b) {   # strict rect overlap [x0,y0,x1,y1]
    return ($a[0] -lt $b[2]) -and ($b[0] -lt $a[2]) -and ($a[1] -lt $b[3]) -and ($b[1] -lt $a[3])
}
function Near($a, $b) { return ([Math]::Abs($a - $b) -lt 0.0006) }
function PngWH($p) {    # IHDR direct read, no imaging dependency
    $fs = [IO.File]::OpenRead($p); $b = New-Object byte[] 24
    [void]$fs.Read($b, 0, 24); $fs.Close()
    $w = ($b[16] * 16777216) + ($b[17] * 65536) + ($b[18] * 256) + $b[19]
    $h = ($b[20] * 16777216) + ($b[21] * 65536) + ($b[22] * 256) + $b[23]
    return @([int]$w, [int]$h)
}

# ---------- canons: this round's manifest + coupled manifests ----------
# FILL: parse every manifest the census must include, e.g.
#   $m  = Get-Content (Join-Path $root 'Tools\city\<name>-manifest.json') -Raw -Encoding UTF8 | ConvertFrom-Json
# FILL: double-parse determinism gate (parse the round manifest twice, byte-equal) - standard A0 item.

# ---------- live C# tables (r169 parsing laws) ----------
$resTxt  = Get-Content (Join-Path $root 'City\Assets\Scripts\ResidentRules.cs')  -Raw -Encoding UTF8
$robTxt  = Get-Content (Join-Path $root 'City\Assets\Scripts\RobotRules.cs')     -Raw -Encoding UTF8
$vehTxt  = Get-Content (Join-Path $root 'City\Assets\Scripts\VehicleRules.cs')   -Raw -Encoding UTF8
$neonTxt = Get-Content (Join-Path $root 'City\Assets\Scripts\NeonSigns.cs')      -Raw -Encoding UTF8
$offTxt  = Get-Content (Join-Path $root 'City\Assets\Scripts\OfficeRules.cs')    -Raw -Encoding UTF8
$skTxt   = Get-Content (Join-Path $root 'City\Assets\Editor\CitySkeletonBuilder.cs') -Raw -Encoding UTF8

$seats = @()
foreach ($mt in [regex]::Matches($resTxt, 'new\s+Person\s*\{\s*name\s*=\s*"(\w+)",\s*x\s*=\s*(-?[\d.]+)f,\s*y\s*=\s*(-?[\d.]+)f')) {
    $seats += ,@($mt.Groups[1].Value, [double]$mt.Groups[2].Value, [double]$mt.Groups[3].Value)
}
$robots = @()
foreach ($mt in [regex]::Matches($robTxt, 'new\s+Bot\s*\{\s*name\s*=\s*"(\w+)",\s*path\s*=\s*"[^"]+",\s*frame\s*=\s*\d+,\s*x\s*=\s*(-?[\d.]+)f,\s*y\s*=\s*(-?[\d.]+)f')) {
    $robots += ,@($mt.Groups[1].Value, [double]$mt.Groups[2].Value, [double]$mt.Groups[3].Value)
}
$vehs = @()
foreach ($mt in [regex]::Matches($vehTxt, 'new\s+Veh\s*\{\s*name\s*=\s*"(\w+)",\s*path\s*=\s*"[^"]+",\s*pxW\s*=\s*(\d+),\s*pxH\s*=\s*(\d+),\s*x\s*=\s*(-?[\d.]+)f,\s*groundY\s*=\s*(-?[\d.]+)f')) {
    $vehs += ,@($mt.Groups[1].Value, [int]$mt.Groups[2].Value, [int]$mt.Groups[3].Value, [double]$mt.Groups[4].Value, [double]$mt.Groups[5].Value)
}
$nbld = @()
foreach ($mt in [regex]::Matches($neonTxt, 'new\s+Building\s*\{\s*x0\s*=\s*(-?[\d.]+)f,\s*y0\s*=\s*(-?[\d.]+)f,\s*x1\s*=\s*(-?[\d.]+)f,\s*y1\s*=\s*(-?[\d.]+)f')) {
    $nbld += ,@([double]$mt.Groups[1].Value, [double]$mt.Groups[2].Value, [double]$mt.Groups[3].Value, [double]$mt.Groups[4].Value)
}
$nsign = @()
foreach ($mt in [regex]::Matches($neonTxt, 'new\s+Sign\s*\{\s*name\s*=\s*"(\w+)",\s*path\s*=\s*"[^"]+",\s*pxW\s*=\s*(\d+),\s*pxH\s*=\s*(\d+),\s*x\s*=\s*(-?[\d.]+)f,\s*y\s*=\s*(-?[\d.]+)f,\s*ppu\s*=\s*([\d.]+)f')) {
    $nsign += ,@($mt.Groups[1].Value, [int]$mt.Groups[2].Value, [int]$mt.Groups[3].Value, [double]$mt.Groups[4].Value, [double]$mt.Groups[5].Value, [double]$mt.Groups[6].Value)
}
$offs = @()
foreach ($mt in [regex]::Matches($offTxt, 'new\s+Bld\s*\{\s*name\s*=\s*"(\w+)",[^{}]*?x0\s*=\s*(-?[\d.]+)f,\s*y0\s*=\s*(-?[\d.]+)f,\s*x1\s*=\s*(-?[\d.]+)f,\s*y1\s*=\s*(-?[\d.]+)f')) {
    $offs += ,@($mt.Groups[1].Value, [double]$mt.Groups[2].Value, [double]$mt.Groups[3].Value, [double]$mt.Groups[4].Value, [double]$mt.Groups[5].Value)
}
$anchors = @()
foreach ($mt in [regex]::Matches($skTxt, 'MakeAnchor\("(\w+)",\s*(-?[\d.]+)f,\s*(-?[\d.]+)f')) {
    $anchors += ,@($mt.Groups[1].Value, [double]$mt.Groups[2].Value, [double]$mt.Groups[3].Value)
}
$propsCells = @()
foreach ($mt in [regex]::Matches($skTxt, 'props\.SetTile\(new\s+Vector3Int\((-?\d+),\s*(-?\d+),\s*0\)')) {
    $propsCells += ,@([int]$mt.Groups[1].Value, [int]$mt.Groups[2].Value)
}
$vc = [regex]::Match($skTxt, 'vcols\s*=\s*new\s*int\[\]\s*\{\s*(-?\d+),\s*(-?\d+),\s*(-?\d+),\s*(-?\d+)\s*\}')
$vcols = @([int]$vc.Groups[1].Value, [int]$vc.Groups[2].Value, [int]$vc.Groups[3].Value, [int]$vc.Groups[4].Value)

# ---------- A0 anchor census (table drift fails loud here) ----------
Chk ($seats.Count -eq 32) 'A0: 32 seats parsed'
Chk ($robots.Count -eq 8) 'A0: 8 robots parsed'
Chk ($vehs.Count -eq 8) 'A0: 8 vehicles parsed'
Chk ($nsign.Count -eq 21) 'A0: 21 signs parsed'
Chk ($nbld.Count -eq 8) 'A0: 8 neon buildings parsed'
Chk ($offs.Count -eq 6) 'A0: 6 office rows parsed'
Chk ($anchors.Count -eq 5) 'A0: 5 anchor call sites parsed'
Chk (($vcols -join ',') -eq '-18,-17,17,18') 'A0: avenue vcols == -18/-17/17/18'
# FILL: named census anchors for the zone under test (pin 2-3 known rects, e.g.
# ResN01 (-3.5,11), brain tower B7 [-2,9,3,19], VehicleBusN @ (12,8),
# T1 terrace world rect, Paint band rows for the zone).
#   L1 shape: Chk ($m.<field> -eq <n>) 'A0: <name> census'  -- never a comma between the two args.

# ---------- geometry derivations (r141 seat class law) ----------
$half   = 32 / 48.0
$shHW   = 32 / 48.0; $shHH = 8 / 48.0
$drop   = 0.06
$pHW    = 66 / 48.0; $pHH = 20 / 48.0
$pOff   = $half + (8 / 24.0) + $pHH
$robH   = 16 / 32.0
$robShH = 6 / 32.0
function SeatR($x, $y) {
    $b = @(($x - $half), ($y - $half), ($x + $half), ($y + $half))
    $scy = $y - $half - $drop
    $s = @(($x - $shHW), ($scy - $shHH), ($x + $shHW), ($scy + $shHH))
    $pcy = $y + $pOff
    $p = @(($x - $pHW), ($pcy - $pHH), ($x + $pHW), ($pcy + $pHH))
    return @{ b = $b; s = $s; p = $p }
}
$seatR = @{}
foreach ($s in $seats) { $seatR[$s[0]] = SeatR $s[1] $s[2] }
$robR = @{}
foreach ($r in $robots) {
    $b = @(($r[1] - $robH), ($r[2] - $robH), ($r[1] + $robH), ($r[2] + $robH))
    $scy = $r[2] - $robH - $drop
    $s = @(($r[1] - $robH), ($scy - $robShH), ($r[1] + $robH), ($scy + $robShH))
    $robR[$r[0]] = @{ b = $b; s = $s }
}
$vehR = @{}
foreach ($v in $vehs) {
    $w = $v[1] / 24.0; $h = $v[2] / 24.0
    $vehR[$v[0]] = @(($v[3] - $w / 2), $v[4], ($v[3] + $w / 2), ($v[4] + $h))
}
$signR = @{}
foreach ($g in $nsign) {
    $w = $g[1] / $g[5]; $h = $g[2] / $g[5]
    $signR[$g[0]] = @(($g[3] - $w / 2), ($g[4] - $h / 2), ($g[3] + $w / 2), ($g[4] + $h / 2))
}
# FILL: slot/mount rect tables from coupled manifests (eaveslots slots, lightfx
# bloom/wet mounts, rimlight segments...). Light layers are NOT physical gates:
# report overlaps honestly, never enforce (r169 A4b).
#   L2 shape for computed rects: $r = @(($cx - $hw), ($cy - $hh), ($cx + $hw), ($cy + $hh))

# ---------- master obstacle set (r169 composition law) ----------
# 8 neon buildings + 6 office rows + T1 terrace + 2 avenue road bands
# (rows 3..14 => world y 3..15) + every landed manifest placement +
# seats x3 (body/shadow/plate) + eave slots x3 + robots x2 + vehicles + signs.
$obsFull = @()
for ($i = 0; $i -lt 8; $i++) { $obsFull += ,@($nbld[$i]) }
foreach ($o in $offs) { $obsFull += ,@(@([double]$o[1], [double]$o[2], [double]$o[3], [double]$o[4])) }
$obsFull += ,@(@(-18.0, 3.0, -16.0, 15.0))
$obsFull += ,@(@(17.0, 3.0, 19.0, 15.0))
# FILL: append T1 terrace rect + every landed manifest placement; assert the
# master-set count fail-loud (never trust composition by silence):
#   Chk ($obsFull.Count -eq <expected>) 'A0: master set census'
$obsSeats = @()
foreach ($s in $seats) { $rr = $seatR[$s[0]]; $obsSeats += ,@($rr.b); $obsSeats += ,@($rr.s); $obsSeats += ,@($rr.p) }
$obsRobots = @()
foreach ($r in $robots) { $rr = $robR[$r[0]]; $obsRobots += ,@($rr.b); $obsRobots += ,@($rr.s) }
$obsVehs = @()
foreach ($v in $vehs) { $obsVehs += ,@($vehR[$v[0]]) }
$obsSigns = @()
foreach ($g in $nsign) { $obsSigns += ,@($signR[$g[0]]) }
# FILL: swap scenario set (remove a specific piece to re-open its window)
# when the round asks for it; assert swap-set count = full minus removed.

# ---------- gate (edit the band laws for this round's zone) ----------
function Gate([double[]]$r, $obsBlds) {
    if ([Math]::Abs($r[0]) -gt 35.256 -or [Math]::Abs($r[2]) -gt 35.256) { return $false }
    # FILL: zone band laws for THIS round (north top cap 13 / labs cap 12 /
    # south bank rows / water band vcols-under-crossing...), then the
    # invariant checks: feet-cell pavement census + avenue vcols exclusion
    # + 8-building footprint exclusion (see r169 Gate), then:
    foreach ($b in $obsBlds)  { if (Ov $r $b)  { return $false } }
    foreach ($b2 in $obsSeats) { if (Ov $r $b2) { return $false } }
    foreach ($b3 in $obsRobots) { if (Ov $r $b3) { return $false } }
    foreach ($b4 in $obsVehs)  { if (Ov $r $b4) { return $false } }
    foreach ($b5 in $obsSigns) { if (Ov $r $b5) { return $false } }
    foreach ($a in $anchors) {
        $inX = ($a[1] -ge $r[0]) -and ($a[1] -le $r[2]); $inY = ($a[2] -ge $r[1]) -and ($a[2] -le $r[3])
        if ($inX -and $inY) { return $false }
    }
    return $true
}

# ---------- analytic clear-span census FIRST (r169 law), grid sweep second ----------
function GapList($obsAll, [double]$by0, [double]$by1) {
    $iv = @()
    foreach ($o in $obsAll) { if (($o[1] -lt $by1) -and ($by0 -lt $o[3])) { $iv += ,@([double]$o[0], [double]$o[2]) } }
    foreach ($sr in $obsSeats)  { if (($sr[1] -lt $by1) -and ($by0 -lt $sr[3]))  { $iv += ,@([double]$sr[0], [double]$sr[2]) } }
    foreach ($sr2 in $obsRobots) { if (($sr2[1] -lt $by1) -and ($by0 -lt $sr2[3])) { $iv += ,@([double]$sr2[0], [double]$sr2[2]) } }
    foreach ($sr3 in $obsVehs)  { if (($sr3[1] -lt $by1) -and ($by0 -lt $sr3[3])) { $iv += ,@([double]$sr3[0], [double]$sr3[2]) } }
    foreach ($sr4 in $obsSigns) { if (($sr4[1] -lt $by1) -and ($by0 -lt $sr4[3])) { $iv += ,@([double]$sr4[0], [double]$sr4[2]) } }
    $sorted = $iv | Sort-Object { $_[0] }
    $merged = @()
    foreach ($s in $sorted) {
        if ($merged.Count -gt 0) {
            $last = $merged[$merged.Count - 1]
            if ($s[0] -le $last[1]) {
                if ($s[1] -gt $last[1]) { $merged[$merged.Count - 1] = @([double]$last[0], [double]$s[1]) }
            } else { $merged += ,@([double]$s[0], [double]$s[1]) }
        } else { $merged += ,@([double]$s[0], [double]$s[1]) }
    }
    $gaps = @()
    $cursor = -35.256
    foreach ($mm in $merged) {
        if ($mm[0] -gt $cursor) { $gaps += ,@([double]$cursor, [double]$mm[0]) }
        if ($mm[1] -gt $cursor) { $cursor = [double]$mm[1] }
    }
    if (35.256 -gt $cursor) { $gaps += ,@([double]$cursor, 35.256) }
    return $gaps
}
function MaxGapW($gaps) {
    $mx = 0.0
    foreach ($q in $gaps) { $w = $q[1] - $q[0]; if ($w -gt $mx) { $mx = $w } }
    return $mx
}
# FILL: state the max clean span per relevant y-band and assert the verdict
# (< piece width = zero slots; == exact span when one legal zone exists).
#
# FILL: 1/6u grid sweep over the piece vocabulary (mechanical confirmation
# of the analytic verdict; found-set must match).
#   $step = 1.0 / 6.0 ... while ($x0 -le 35.256 - $p.w + eps) { ... Gate ... }

# ---------- negative + positive controls (gate non-vacuous proof) ----------
# FILL: known-illegal rects MUST fire (named blocker probes, one per rejected
# window - r123 firing law); known-clean rects MUST pass. A gate with no
# negative control is unproven.

# ---------- verdict print ----------
Write-Host ''
Write-Host ('<round> <name> sandbox gate: pass=' + $pass + ' fail=' + $fail)
Write-Host 'verdict: FILL - state feasibility honestly (necessary/sufficient,'
Write-Host 'exact spans/counts); spec changes belong to the decision face'
Write-Host '(F-file), never a silent default.'
if ($fail -gt 0) { exit 1 } else { exit 0 }
