# bake-resident-street.ps1 - P-68/P-72/P-69(1) street roster bake (r98 data slice).
# The group pipeline (cph4 sprites fa7d951) fixed the 32-resident street pool:
# parts atlas colors (residents-atlas/manifest.jsonl) + district/gender
# (batch1/manifest.json) + census identity fields (citizens-light.jsonl).
# This bake joins all three (READ-ONLY) into ONE engine-side data file:
#   City/Assets/Data/residents-street.json  {"protocol":"fluxverse-street/0.1","slots":[...]}
# The NEXT round's engine slice consumes it: ResidentRules 32-seat table +
# parts stack (pant->skin->cloth->badge->hair->eyes; sprite species = being only)
# + b1 nameplate wiring (plateIndex = atlas manifest row order, r97 bake law).
# Seat-zone law (r96/r97): slot 0-8 QUANT(QT) / 9-15 GAME(GM) / 16-23 MEDIA(MD)
# / 24-25 NORTH(NS) / 26 TOWER(honor seat, district "") / 27-31 VISITOR(RV+OR
# cross-city guests on the south street - seat != identity claim, r96 law).
# Composition law mirrors the group generator exactly (atlas-residents.ps1):
# hair: gender-run codepoint 0x5973 -> hair-long else hair-short; eyes:
# silicon -> eyes-led, carbon -> eyes-dot, sprite -> being(only part); pantC
# fixed per species; sprite core = P_SPRITE[HashInt(id+'s')] (byte-exact mirror).
# Honesty: layer = "anchor" for census anchor rows (honor seat = human-source
# disclosure, P-58), "narrative" for generated citizens (CODEX sec.1);
# age -1 = undisclosed (honor seat census null). ASCII-only body (encoding
# law); CJK lives in data. Deterministic: same inputs -> byte-identical file.
$ErrorActionPreference = 'Stop'
$repo = Split-Path (Split-Path $PSScriptRoot)          # Tools/city -> repo root
$group = Split-Path (Split-Path $repo)                 # repo -> FluxGroup root
$atlasFile = Join-Path $repo 'City\Assets\ArtPacks\residents-atlas\manifest.jsonl'
$batchFile = Join-Path $group 'cph4\research\sprites-20260924\batch1\manifest.json'
$censusFile = Join-Path $group 'life\BigLife\census\export\citizens-light.jsonl'
$outFile = Join-Path $repo 'City\Assets\Data\residents-street.json'
$utf8 = New-Object System.Text.UTF8Encoding($false)
foreach ($p in @($atlasFile, $batchFile, $censusFile)) {
    if (-not (Test-Path $p)) { Write-Output ("MISSING SOURCE: " + $p); exit 1 }
}

# --- read the three sources (explicit UTF-8, r53 law) ---
$atlasRows = New-Object System.Collections.Generic.List[object]
$ai = 0
foreach ($ln in [System.IO.File]::ReadAllLines($atlasFile, [System.Text.Encoding]::UTF8)) {
    if (-not $ln.Trim()) { continue }
    $r = ConvertFrom-Json $ln
    $atlasRows.Add((New-Object psobject -Property @{ idx = $ai; id = [string]$r.id; name = [string]$r.name
        species = [string]$r.species; skin = [string]$r.skin; hair = [string]$r.hair
        cloth = [string]$r.cloth; eye = [string]$r.eye; badge = [string]$r.badge }))
    $ai++
}
if ($atlasRows.Count -ne 32) { Write-Output ("ATLAS ROWS != 32: " + $atlasRows.Count); exit 1 }
$batchRows = ConvertFrom-Json ([System.IO.File]::ReadAllText($batchFile, [System.Text.Encoding]::UTF8))
if (@($batchRows).Count -ne 32) { Write-Output ("BATCH ROWS != 32: " + @($batchRows).Count); exit 1 }
$batch = @{}
foreach ($b in $batchRows) { $batch[[string]$b.id] = $b }
$census = @{}
foreach ($ln in [System.IO.File]::ReadAllLines($censusFile, [System.Text.Encoding]::UTF8)) {
    if (-not $ln.Trim()) { continue }
    $c = ConvertFrom-Json $ln
    $census[[string]$c.id] = $c
}

# --- quota table: zone, district, count, GO prefix (r97 seat law) ---
$zones = @(
    @('QUANT', 'QT', 9, 'Q'),
    @('GAME',   'GM', 7, 'G'),
    @('MEDIA',  'MD', 8, 'M'),
    @('NORTH',  'NS', 2, 'N'),
    @('TOWER',  '',   1, 'T'),
    @('VISITOR','OR', 4, 'V'),
    @('VISITOR','RV', 1, 'V')
)
$hexOk = '^[#][0-9A-F]{6}$'
$chNv = [string][char]0x5973                     # gender run codepoint (law: never a literal)
$P_SPRITE = @('#5EEAD4', '#A78BFA', '#60A5FA', '#F472B6', '#4ADE80')   # group generator pool (mirror)
function HashInt {
    param([string]$s, [int]$mod)
    $sha = [System.Security.Cryptography.SHA256]::Create()
    $h = $sha.ComputeHash([System.Text.Encoding]::UTF8.GetBytes($s))
    $v = [int]$h[0] + (([int]$h[1]) -shl 8) + (([int]$h[2]) -shl 16)
    if ($v -lt 0) { $v = -$v }
    return ($v % $mod)
}
function Get-Age([object]$c) {
    if ($null -ne $c.age) {
        if ($c.age -is [int]) { return [int]$c.age }
        $m = [regex]::Match([string]$c.age, '\d+')
        if ($m.Success) { return [int]$m.Value }
    }
    return -1                                # honor seat: undisclosed (honesty law)
}
function Get-PlateName([string]$full) {
    $lead = [regex]::Match($full, '^[^A-Za-z]+').Value.Trim()
    if ($lead.Length -ge 2) { return $lead }
    return $full.Trim()
}

$slots = @()
$slot = 0
$seqByLetter = @{}                      # per-prefix counter: visitors span two district groups
foreach ($z in $zones) {
    $zoneName = $z[0]; $dist = $z[1]; $n = [int]$z[2]; $letter = $z[3]
    $pick = @($batchRows | Where-Object { [string]$_.district -eq $dist } | Sort-Object id)
    if ($pick.Count -ne $n) {
        Write-Output ("QUOTA FAIL: zone " + $zoneName + " district [" + $dist + "] want " + $n + " got " + $pick.Count); exit 1
    }
    foreach ($b in $pick) {
        $id = [string]$b.id
        if (-not $census.ContainsKey($id)) { Write-Output ("CENSUS JOIN MISS: " + $id); exit 1 }
        $a = $null
        foreach ($row in $atlasRows) { if ($row.id -eq $id) { $a = $row; break } }
        if ($null -eq $a) { Write-Output ("ATLAS JOIN MISS: " + $id); exit 1 }
        $c = $census[$id]
        $sp = [string]$a.species
        if ($sp -ne 'carbon' -and $sp -ne 'silicon' -and $sp -ne 'sprite') { Write-Output ("BAD SPECIES: " + $id); exit 1 }
        $g = [string]$b.gender
        if (-not $seqByLetter.ContainsKey($letter)) { $seqByLetter[$letter] = 0 }
        $seqByLetter[$letter] = [int]$seqByLetter[$letter] + 1
        $seq = [int]$seqByLetter[$letter]
        $hairPart = 'hair-short'; if ($g.Contains($chNv)) { $hairPart = 'hair-long' }
        $eyePart = 'eyes-dot'
        if ($sp -eq 'silicon') { $eyePart = 'eyes-led' }
        if ($sp -eq 'sprite') { $eyePart = 'being' }
        $pantC = ''
        if ($sp -eq 'carbon') { $pantC = '#3A3440' }
        if ($sp -eq 'silicon') { $pantC = '#3D4A5C' }
        $coreC = ''
        if ($sp -eq 'sprite') { $coreC = $P_SPRITE[(HashInt ($id + 's') $P_SPRITE.Count)] }
        # mount contract: sprite rows mount the being part ONLY - unmounted part
        # colors stay empty here (the recorded palette lives on in the atlas
        # manifest itself; this file is the mount palette, not the provenance)
        $skinC = [string]$a.skin; $hairC = [string]$a.hair; $clothC = [string]$a.cloth
        $badgeC = [string]$a.badge; $eyeC = [string]$a.eye
        if ($sp -eq 'sprite') { $skinC = ''; $hairC = ''; $clothC = ''; $badgeC = ''; $eyeC = '' }
        $layer = 'narrative'
        if ($c.anchor) { $layer = 'anchor' }
        $e = [ordered]@{
            slot = $slot; go = ('Res' + $letter + $seq.ToString('00')); zone = $zoneName
            id = $id; name = [string]$a.name; species = $sp; gender = $g
            district = [string]$b.district; age = (Get-Age $c)
            faction = [string]$c.faction; block = [string]$c.block
            profession = [string]$b.profession; axis = [string]$c.axis
            creed = [string]$c.creed; layer = $layer
            hairPart = $hairPart; eyePart = $eyePart; pantC = $pantC
            skinC = $skinC; hairC = $hairC; clothC = $clothC
            badgeC = $badgeC; eyeC = $eyeC; coreC = $coreC
            plateIndex = $a.idx; plateName = (Get-PlateName ([string]$a.name))
        }
        if ($sp -ne 'sprite') {
            foreach ($ck in @('skinC', 'hairC', 'clothC', 'badgeC', 'eyeC')) {
                if ($e[$ck] -notmatch $hexOk) { Write-Output ("BAD COLOR " + $ck + " at " + $id); exit 1 }
            }
        }
        $slots += $e
        $slot++
    }
}
if ($slots.Count -ne 32) { Write-Output ("SLOT COUNT != 32: " + $slots.Count); exit 1 }
$goSeen = @{}
foreach ($s in $slots) {
    if ($goSeen.ContainsKey($s.go)) { Write-Output ("DUP GO: " + $s.go); exit 1 }
    $goSeen[$s.go] = $true
}

$doc = [ordered]@{ protocol = 'fluxverse-street/0.1'; slots = $slots }
$json = ConvertTo-Json $doc -Depth 5
if ($json.Length -lt 2000) { Write-Output ("JSON SUSPICIOUSLY SHORT: " + $json.Length); exit 1 }
$tmp = $outFile + '.new'
[System.IO.File]::WriteAllText($tmp, $json, $utf8)
Move-Item -LiteralPath $tmp -Destination $outFile -Force
$sha = (Get-FileHash -Algorithm SHA256 $outFile).Hash
Write-Output ("STREET_BAKED slots=32 file=" + [System.IO.Path]::GetFileName($outFile) + " bytes=" + (Get-Item $outFile).Length + " sha256=" + $sha)
