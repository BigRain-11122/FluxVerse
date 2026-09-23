# FluxVerse DevLoop r39 / P-22(2) engine identity pool v0: bake the 12 street
# residents' census identities from BigLife citizens-light.jsonl (read-only
# sibling-repo consumption - the CODEX sec.12 contracted export face).
#
# Selection law (deterministic, mirrors watch/city-watch.ps1 family):
#   - slot -> home district law (CODEX sec.3 spatial canon; the engine proof
#     re-derives it from the LIVE city tilemaps, this bake carries the copy):
#       slots 0-2 QUANT plaza -> QT | 3-4 GAME front plaza -> GM
#       5-6 MEDIA front plaza -> MD | 7 south street west -> GM | 8 -> QT
#       9-10 north promenade + 11 north street -> NS (north governance shore)
#     RV (river/bridge) and OR (outer perception ring) have NO street slots in
#     the visible frame - river is a pure water band, outer ring is off-frame;
#     they join the pool when their visuals land (honest, never invented).
#   - carbon-only filter (CODEX sec.2: the 12 human sprites are carbon forms;
#     silicon = the robot/fleet face, sprites = future pixel-sprite face).
#     AGE FORMAT LAW (surveyed 2026-09-24): the census ships two serializations -
#     15 v1.1 anchor cards write a bare int ("age": 68), the 7485 v1.2 main
#     population writes "NN sui" as a quoted string ("age": "37 ..."). The
#     extractor accepts BOTH and stores the bare int (the number is the fact,
#     the unit marker is serialization dressing - mirroring the digits is not
#     rewriting). age:null sits only on 5 non-carbon reserved seats; the age
#     gate on carbon lines stays as a fail-loud defense anyway.
#   - per district: ids sorted ORDINAL ascending, pick index
#     (Seed + slot*Stride) % count, Seed=20260924 (P-22(2) window-open date,
#     fixed - a committed roster must not churn daily; re-bake is explicit),
#     Stride=1999 (the CityWatch voice-face prime)
#   - layer:"narrative" marker rides every entry (CODEX sec.1 honesty law:
#     census citizens are the narrative layer, never the machine-anchor layer)
#
# Self-checks before writing: full round-trip parse, 12 unique ids, district /
# species / layer gates, in-memory determinism (two builds byte-identical).
# ASCII-only script body (PS5.1 GBK law); CJK lives only in the data. No 3D.
$ErrorActionPreference = "Stop"

$repo   = Split-Path (Split-Path $PSScriptRoot -Parent) -Parent   # Tools\city -> repo
$group  = Split-Path (Split-Path $repo -Parent) -Parent           # -> FluxGroup root
$census = Join-Path $group "life\BigLife\census\export\citizens-light.jsonl"
$out    = Join-Path $repo "City\Assets\Data\residents-identity.json"
$roster = Join-Path $repo "logs\r39-roster.txt"

if (-not (Test-Path -LiteralPath $census)) { throw "census export not found: $census" }

# slot law (index 0..11) - must mirror ResidentRules.Name() + ResidentIdentity.DistrictOf()
$districts = @('QT','QT','QT','GM','GM','MD','MD','GM','QT','NS','NS','NS')
$goNames    = @('ResQPlazaA','ResQPlazaB','ResQPlazaC','ResGameFrA','ResGameFrB',
                'ResMediaFrA','ResMediaFrB','ResStWest','ResStEast','ResPromW','ResPromC','ResNorthSt')
$seed   = 20260924
$stride = 1999
if ($districts.Count -ne 12 -or $goNames.Count -ne 12) { throw "slot tables must hold 12" }

$rxId    = [regex]'"id":\s*"(C-\d{5})"'
$rxDist  = [regex]'"district":\s*"([^"]*)"'
$rxSpec  = [regex]'"species":\s*"([^"]*)"'
$rxName  = [regex]'"name":\s*"([^"]*)"'
$rxGen   = [regex]'"gender":\s*"([^"]*)"'
$rxAge   = [regex]'"age":\s*"?\s*(\d+)'   # dual-format law: 68 and "37 sui" both -> digits
$rxFac   = [regex]'"faction":\s*"([^"]*)"'
$rxBlock = [regex]'"block":\s*"([^"]*)"'
$rxProf  = [regex]'"profession":\s*"([^"]*)"'
$rxAxis  = [regex]'"axis":\s*"([^"]*)"'
$rxCreed = [regex]'"creed":\s*"([^"]*)"'

function Field([string]$line, [regex]$rx, [string]$what) {
    $m = $rx.Match($line)
    if (-not $m.Success) { throw "census field missing: $what" }
    $v = $m.Groups[1].Value
    if ($v.IndexOf('\') -ge 0) { throw "escaped char in census field $what - extend the extractor first" }
    return $v
}
function FieldSoft([string]$line, [regex]$rx) {
    $m = $rx.Match($line)
    if ($m.Success) {
        $v = $m.Groups[1].Value
        if ($v.IndexOf('\') -ge 0) { throw "escaped char in soft census field - extend the extractor first" }
        return $v
    }
    return ''
}
function JsonEsc([string]$s) {
    $sb = New-Object System.Text.StringBuilder
    foreach ($ch in $s.ToCharArray()) {
        $c = [int]$ch
        if ($ch -eq '"') { [void]$sb.Append('\"') }
        elseif ($ch -eq '\') { [void]$sb.Append('\\') }
        elseif ($c -lt 32) { [void]$sb.Append('\u' + $c.ToString('x4')) }
        else { [void]$sb.Append($ch) }
    }
    return $sb.ToString()
}

# ---- pass 1: filter carbon citizens of the four used districts ----
$lines = [System.IO.File]::ReadAllLines($census, [System.Text.Encoding]::UTF8)
if ($lines.Count -lt 9990) { throw "census unexpectedly small: $($lines.Count) lines" }

$bucket = @{}
foreach ($d in @('QT','GM','MD','NS')) {
    $bucket[$d] = @{ ids = New-Object 'System.Collections.Generic.List[string]'; byId = @{} }
}
$carbonSeen = 0
$ageNullSkipped = 0
foreach ($ln in $lines) {
    if (-not $rxSpec.Match($ln).Success) { continue }
    if ($rxSpec.Match($ln).Groups[1].Value -ne 'carbon') { continue }
    $carbonSeen++
    if (-not $rxAge.Match($ln).Success) { $ageNullSkipped++; continue }   # age gate (defense: nulls are non-carbon reserved seats)
    $m = $rxDist.Match($ln)
    if (-not $m.Success) { continue }
    $d = $m.Groups[1].Value
    if (-not $bucket.ContainsKey($d)) { continue }
    $mi = $rxId.Match($ln)
    if (-not $mi.Success) { continue }
    $id = $mi.Groups[1].Value
    if ($bucket[$d].byId.ContainsKey($id)) { throw "duplicate census id in district ${d}: $id" }
    $bucket[$d].ids.Add($id)
    $bucket[$d].byId[$id] = $ln
}
if ($carbonSeen -lt 6000) { throw "carbon filter caught only $carbonSeen citizens - regex drift?" }
foreach ($d in @('QT','GM','MD','NS')) {
    if ($bucket[$d].ids.Count -lt 100) { throw "district $d carbon count suspiciously low: $($bucket[$d].ids.Count)" }
    $bucket[$d].ids.Sort([System.StringComparer]::Ordinal)
}

# ---- pass 2: deterministic picks + JSON build (pure function of the census) ----
function Build-All() {
    $sb = New-Object System.Text.StringBuilder
    [void]$sb.Append("{`n`"slots`": [`n")
    $rows = New-Object 'System.Collections.Generic.List[string]'
    for ($i = 0; $i -lt 12; $i++) {
        $d = $districts[$i]
        $ids = $bucket[$d].ids
        $idx = [int](($seed + $i * $stride) % $ids.Count)
        $ln = $bucket[$d].byId[$ids[$idx]]

        # defense in depth: the picked line must really be what we filtered on
        if ($rxDist.Match($ln).Groups[1].Value -ne $d) { throw "pick $i lost its district" }
        if ($rxSpec.Match($ln).Groups[1].Value -ne 'carbon') { throw "pick $i lost its species" }

        $id   = Field $ln $rxId 'id'
        $name = Field $ln $rxName 'name'
        $gen  = Field $ln $rxGen 'gender'
        $age  = [int](Field $ln $rxAge 'age')
        $fac  = Field $ln $rxFac 'faction'
        $blk  = Field $ln $rxBlock 'block'
        $prof = Field $ln $rxProf 'profession'
        $axis = FieldSoft $ln $rxAxis
        $cred = FieldSoft $ln $rxCreed
        if ($name.Length -eq 0) { throw "empty name at slot $i ($id)" }
        if ($gen.Length -eq 0) { throw "empty gender at slot $i ($id)" }
        if ($age -lt 1 -or $age -gt 120) { throw "implausible age at slot ${i}: $age" }
        if ($prof.Length -eq 0 -or $fac.Length -eq 0 -or $blk.Length -eq 0) { throw "empty core field at slot $i ($id)" }

        $json = '{"slot":' + $i + ',"go":"' + (JsonEsc $goNames[$i]) + '","district":"' + $d +
                '","id":"' + $id + '","name":"' + (JsonEsc $name) + '","species":"carbon","gender":"' +
                (JsonEsc $gen) + '","age":' + $age + ',"faction":"' + (JsonEsc $fac) + '","block":"' +
                (JsonEsc $blk) + '","profession":"' + (JsonEsc $prof) + '","axis":"' + (JsonEsc $axis) +
                '","creed":"' + (JsonEsc $cred) + '","layer":"narrative"}'
        [void]$rows.Add($json)
    }
    $seen = @{}
    foreach ($j in $rows) {
        $cid = $rxId.Match($j).Groups[1].Value
        if ($seen.ContainsKey($cid)) { throw "identity collision across slots: $cid (stride law broke)" }
        $seen[$cid] = $true
    }
    for ($k = 0; $k -lt 12; $k++) {
        [void]$sb.Append($rows[$k])
        if ($k -lt 11) { [void]$sb.Append(',') }
        [void]$sb.Append("`n")
    }
    [void]$sb.Append("]`n}`n")
    return $sb.ToString()
}

$json1 = Build-All
$json2 = Build-All
if ($json1 -ne $json2) { throw "bake is not deterministic - two builds differ" }

# ---- self-check: round-trip parse must reproduce the picked fields ----
$parsed = $json1 | ConvertFrom-Json
if ($parsed.slots.Count -ne 12) { throw "round-trip parse count != 12" }
for ($i = 0; $i -lt 12; $i++) {
    $e = $parsed.slots[$i]
    $d = $districts[$i]
    $ids = $bucket[$d].ids
    $ln = $bucket[$d].byId[$ids[[int](($seed + $i * $stride) % $ids.Count)]]
    if ($e.id -ne (Field $ln $rxId 'id')) { throw "round-trip id drift at $i" }
    if ($e.name -ne (Field $ln $rxName 'name')) { throw "round-trip name drift at $i" }
    if ($e.profession -ne (Field $ln $rxProf 'profession')) { throw "round-trip profession drift at $i" }
    if ($e.gender -ne (Field $ln $rxGen 'gender')) { throw "round-trip gender drift at $i" }
    if ([int]$e.age -ne [int](Field $ln $rxAge 'age')) { throw "round-trip age drift at $i" }
    if ($e.district -ne $d) { throw "round-trip district drift at $i" }
    if ($e.species -ne 'carbon') { throw "round-trip species drift at $i" }
    if ($e.layer -ne 'narrative') { throw "round-trip layer drift at $i" }
    if ($e.go -ne $goNames[$i]) { throw "round-trip go-name drift at $i" }
}

# ---- write + roster ----
$dir = Split-Path $out -Parent
if (-not (Test-Path -LiteralPath $dir)) { throw "data dir missing: $dir" }
$changed = $true
if (Test-Path -LiteralPath $out) { $changed = (([System.IO.File]::ReadAllText($out, [System.Text.Encoding]::UTF8)) -ne $json1) }
[System.IO.File]::WriteAllText($out, $json1, (New-Object System.Text.UTF8Encoding $false))
$sha = (Get-FileHash -LiteralPath $out -Algorithm SHA256).Hash

$rl = New-Object 'System.Collections.Generic.List[string]'
$rl.Add("seed=$seed stride=$stride carbon_seen=$carbonSeen age_null_skipped=$ageNullSkipped sha256=$sha changed=$changed")
for ($i = 0; $i -lt 12; $i++) {
    $e = $parsed.slots[$i]
    $rl.Add(("slot={0:d2} go={1} district={2} id={3} name={4} profession={5} age={6}" -f $i, $e.go, $e.district, $e.id, $e.name, $e.profession, $e.age))
}
[System.IO.File]::WriteAllLines($roster, $rl, (New-Object System.Text.UTF8Encoding $false))

Write-Output ("BAKE OK slots=12 carbon_seen=" + $carbonSeen + " age_null_skipped=" + $ageNullSkipped + " changed=" + $changed)
Write-Output ("sha256=" + $sha)
Write-Output ("census=" + $census)
Write-Output ("out=" + $out)
