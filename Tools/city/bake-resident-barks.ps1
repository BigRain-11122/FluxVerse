# FluxVerse DevLoop r41 / P-23(2) M2 barks data slice: bake the engine-side
# resident-bark pool from BigLife cognition/pools.json (read-only sibling-repo
# consumption - the cognition README layer-2 contract).
#
# Law source (BigLife Tools/draw.py, byte-mirrored here and in ResidentBarks.cs):
#   - bucket routing: carbon citizen -> pools.axes[<citizen axis>][ctx]
#     (draw.py falls back to the yanhuo axis when a bucket is empty; the bake
#     instead FAILS LOUD on any empty/missing bucket - the committed pool must
#     be complete, the fallback stays a C# runtime defense only)
#   - pick law (barks tier, day-granular): seed = md5("id|date|ctx"),
#     index = int(first 8 hex chars, 16) % len(bucket) -> byte-identical line
#     for the same (id, date, ctx) forever, across PS / python / C#.
#   - context canon (12, draw.py CONTEXTS order):
#     morning dusk night weekend rain typhoon heatwave coldsnap
#     market_open market_close ceo_order festival
#
# Outputs (deterministic, SHA256 recorded):
#   City/Assets/Data/residents-barks.json         - 6 used axes x 12 contexts
#     x 8 lines + the 12-resident id->axis roster (coupled to the r39 identity
#     file: the bark roster IS the identity roster, orphan-face law)
#   City/Assets/Data/residents-barks-vectors.json - 120 precomputed law vectors
#     (12 residents x 5 contexts x 2 dates) for the C# cross-implementation
#     proof gate: ResidentBarks.Pick must return these strings byte-for-byte
#   logs/r41-barks-bake.txt                       - bake report + SHA256
#
# Gates (all fail-loud): pool parses; every used axis has exactly the 12 canon
# contexts; every bucket 4..12 lines; every line 4..24 chars / zero [0-9] /
# non-blank; whole-bake line uniqueness (pool audit zero-dup contract);
# identity roster 12 unique C-##### ids with axes present in the pool; two
# builds byte-identical; round-trip parse of both outputs.
# ASCII-only script body (PS5.1 GBK law); CJK lives only in the data. No 3D.
$ErrorActionPreference = "Stop"

$repo   = Split-Path (Split-Path $PSScriptRoot -Parent) -Parent   # Tools\city -> repo
$group  = Split-Path (Split-Path $repo -Parent) -Parent           # -> FluxGroup root
$pool   = Join-Path $group "life\BigLife\cognition\pools.json"
$ident  = Join-Path $repo "City\Assets\Data\residents-identity.json"
$out    = Join-Path $repo "City\Assets\Data\residents-barks.json"
$outVec = Join-Path $repo "City\Assets\Data\residents-barks-vectors.json"
$report = Join-Path $repo "logs\r41-barks-bake.txt"

if (-not (Test-Path -LiteralPath $pool))  { throw "pools.json not found: $pool" }
if (-not (Test-Path -LiteralPath $ident)) { throw "identity file not found: $ident" }

# draw.py CONTEXTS canon order (engine contract - never reorder)
$contexts = @('morning','dusk','night','weekend','rain','typhoon','heatwave','coldsnap','market_open','market_close','ceo_order','festival')
# vector coverage: clock ctx (morning/night/weekend) + weather ctx (rain) + event ctx (ceo_order) x near/far dates
$vecCtxs  = @('morning','night','rain','ceo_order','weekend')
$vecDates = @('2026-09-24','2027-01-01')
if ($contexts.Count -ne 12) { throw "context canon must hold 12" }

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

# ---- load pool + identity (read-only) ----
$pools = [System.IO.File]::ReadAllText($pool, [System.Text.Encoding]::UTF8) | ConvertFrom-Json
if ($null -eq $pools.axes) { throw "pools.json has no axes face" }
$axMap = @{}
foreach ($p in $pools.axes.PSObject.Properties) { $axMap[$p.Name] = $p.Value }

$identObj = [System.IO.File]::ReadAllText($ident, [System.Text.Encoding]::UTF8) | ConvertFrom-Json
$slots = @($identObj.slots)
if ($slots.Count -ne 12) { throw "identity roster must hold 12 slots, got $($slots.Count)" }

# roster: the bark roster IS the identity roster (orphan-face law)
$roster = @()
for ($i = 0; $i -lt 12; $i++) {
    $e = $slots[$i]
    if ([int]$e.slot -ne $i) { throw "identity slot order drift at $i" }
    if ($e.axis -eq $null -or $e.axis.Length -eq 0) { throw "identity slot $i has empty axis" }
    if (-not $axMap.ContainsKey($e.axis)) { throw "identity slot $i axis not in pool: $($e.axis)" }
    $roster += @{ slot = [int]$e.slot; id = [string]$e.id; axis = [string]$e.axis }
}
$seenId = @{}
foreach ($r in $roster) {
    if ($r.id -notmatch '^C-\d{5}$') { throw "bad census id: $($r.id)" }
    if ($seenId.ContainsKey($r.id)) { throw "duplicate roster id: $($r.id)" }
    $seenId[$r.id] = $true
}

# used axes = the roster's axes, ordinal-sorted for a stable file layout
$usedAxes = @($roster | ForEach-Object { $_.axis } | Select-Object -Unique)
[Array]::Sort($usedAxes, [System.StringComparer]::Ordinal)

# ---- gates over the used axes buckets ----
$bucketOf = @{}   # "axis\u001Fctx" -> string[] (bake copy)
$globalSeen = @{}
$totalLines = 0
foreach ($ax in $usedAxes) {
    $axVal = $axMap[$ax]
    $ctxProps = @($axVal.PSObject.Properties)
    if ($ctxProps.Count -ne 12) { throw "axis bucket must hold exactly 12 contexts, axis=$ax count=$($ctxProps.Count)" }
    foreach ($ctx in $contexts) {
        $cp = $axVal.PSObject.Properties[$ctx]
        if ($null -eq $cp) { throw "axis $ax missing canon context: $ctx" }
        $lines = @($cp.Value)
        if ($lines.Count -lt 4 -or $lines.Count -gt 12) { throw "bucket size out of 4..12: axis=$ax ctx=$ctx n=$($lines.Count)" }
        $clean = @()
        foreach ($ln in $lines) {
            $s = [string]$ln
            if ($s.Trim().Length -eq 0) { throw "blank line: axis=$ax ctx=$ctx" }
            if ($s.Length -lt 4 -or $s.Length -gt 24) { throw "line length out of 4..24: axis=$ax ctx=$ctx len=$($s.Length)" }
            if ($s -cmatch '[0-9]') { throw "digit in pool line (zero-number law): axis=$ax ctx=$ctx" }
            if ($globalSeen.ContainsKey($s)) { throw "duplicate pool line (zero-dup law): axis=$ax ctx=$ctx" }
            $globalSeen[$s] = $true
            $clean += $s
            $totalLines++
        }
        $bucketOf[($ax + [char]31 + $ctx)] = $clean
    }
}
if ($totalLines -lt 100) { throw "suspiciously small bake: $totalLines lines" }

# ---- PS md5 pick law (draw.py byte-mirror) ----
function Pick-Index([string]$key, [int]$len) {
    $md5 = [System.Security.Cryptography.MD5]::Create()
    try {
        $h = $md5.ComputeHash([System.Text.Encoding]::UTF8.GetBytes($key))
    } finally { $md5.Dispose() }
    $hex = -join ($h[0..3] | ForEach-Object { $_.ToString('x2') })
    $v = [Convert]::ToUInt32($hex, 16)
    return [int]($v % [uint32]$len)
}

# ---- deterministic JSON builders ----
function Build-Pool() {
    $sb = New-Object System.Text.StringBuilder
    [void]$sb.Append("{`n`"axes`": [`n")
    for ($a = 0; $a -lt $usedAxes.Count; $a++) {
        $ax = $usedAxes[$a]
        [void]$sb.Append('{"axis":"' + (JsonEsc $ax) + '","contexts":[')
        for ($c = 0; $c -lt 12; $c++) {
            $ctx = $contexts[$c]
            $lines = $bucketOf[($ax + [char]31 + $ctx)]
            [void]$sb.Append('{"ctx":"' + $ctx + '","lines":[')
            for ($l = 0; $l -lt $lines.Count; $l++) {
                [void]$sb.Append('"' + (JsonEsc $lines[$l]) + '"')
                if ($l -lt $lines.Count - 1) { [void]$sb.Append(',') }
            }
            [void]$sb.Append(']}')
            if ($c -lt 11) { [void]$sb.Append(',') }
        }
        [void]$sb.Append(']}')
        if ($a -lt $usedAxes.Count - 1) { [void]$sb.Append(',') }
        [void]$sb.Append("`n")
    }
    [void]$sb.Append("],`n`"residents`": [`n")
    for ($i = 0; $i -lt 12; $i++) {
        $r = $roster[$i]
        [void]$sb.Append('{"slot":' + $r.slot + ',"id":"' + $r.id + '","axis":"' + (JsonEsc $r.axis) + '"}')
        if ($i -lt 11) { [void]$sb.Append(',') }
        [void]$sb.Append("`n")
    }
    [void]$sb.Append("]`n}`n")
    return $sb.ToString()
}

function Build-Vectors() {
    $sb = New-Object System.Text.StringBuilder
    [void]$sb.Append("{`n`"vectors`": [`n")
    $rows = New-Object 'System.Collections.Generic.List[string]'
    for ($i = 0; $i -lt 12; $i++) {
        $r = $roster[$i]
        foreach ($ctx in $vecCtxs) {
            $bucket = $bucketOf[($r.axis + [char]31 + $ctx)]
            foreach ($date in $vecDates) {
                $key = $r.id + '|' + $date + '|' + $ctx
                $idx = Pick-Index $key $bucket.Count
                $line = $bucket[$idx]
                [void]$rows.Add('{"id":"' + $r.id + '","date":"' + $date + '","ctx":"' + $ctx + '","line":"' + (JsonEsc $line) + '"}')
            }
        }
    }
    for ($k = 0; $k -lt $rows.Count; $k++) {
        [void]$sb.Append($rows[$k])
        if ($k -lt $rows.Count - 1) { [void]$sb.Append(',') }
        [void]$sb.Append("`n")
    }
    [void]$sb.Append("]`n}`n")
    return $sb.ToString()
}

$poolJson1 = Build-Pool
$poolJson2 = Build-Pool
if ($poolJson1 -ne $poolJson2) { throw "pool bake is not deterministic - two builds differ" }
$vecJson1 = Build-Vectors
$vecJson2 = Build-Vectors
if ($vecJson1 -ne $vecJson2) { throw "vector bake is not deterministic - two builds differ" }

# ---- round-trip parse + vector-vs-pool consistency ----
$rt = $poolJson1 | ConvertFrom-Json
if (@($rt.axes).Count -ne $usedAxes.Count) { throw "round-trip axis count drift" }
if (@($rt.residents).Count -ne 12) { throw "round-trip roster count drift" }
$rtv = $vecJson1 | ConvertFrom-Json
$vecRows = @($rtv.vectors)
if ($vecRows.Count -ne 120) { throw "vector count must be 120, got $($vecRows.Count)" }
$vecSeen = @{}
foreach ($v in $vecRows) {
    $k = $v.id + '|' + $v.date + '|' + $v.ctx
    if ($vecSeen.ContainsKey($k)) { throw "duplicate vector key: $k" }
    $vecSeen[$k] = $true
    $r = $roster | Where-Object { $_.id -eq $v.id } | Select-Object -First 1
    $bucket = $bucketOf[($r.axis + [char]31 + $v.ctx)]
    if (-not ($bucket -contains $v.line)) { throw "vector line not in its bucket: $k" }
    $idx = Pick-Index ($v.id + '|' + $v.date + '|' + $v.ctx) $bucket.Count
    if ($bucket[$idx] -cne $v.line) { throw "vector law replay drift: $k" }
}

# ---- write + report ----
[System.IO.File]::WriteAllText($out,    $poolJson1, (New-Object System.Text.UTF8Encoding $false))
[System.IO.File]::WriteAllText($outVec, $vecJson1, (New-Object System.Text.UTF8Encoding $false))
$shaP = (Get-FileHash -LiteralPath $out    -Algorithm SHA256).Hash
$shaV = (Get-FileHash -LiteralPath $outVec -Algorithm SHA256).Hash

$rl = New-Object 'System.Collections.Generic.List[string]'
$rl.Add("axes=$($usedAxes.Count) contexts=12 lines_total=$totalLines vectors=$($vecRows.Count)")
$rl.Add("pool_sha256=$shaP")
$rl.Add("vectors_sha256=$shaV")
foreach ($ax in $usedAxes) { $rl.Add("axis=" + $ax) }
[System.IO.File]::WriteAllLines($report, $rl, (New-Object System.Text.UTF8Encoding $false))

Write-Output ("BAKE OK axes=" + $usedAxes.Count + " lines=" + $totalLines + " vectors=" + $vecRows.Count)
Write-Output ("pool_sha256=" + $shaP)
Write-Output ("vectors_sha256=" + $shaV)
Write-Output ("out=" + $out)
Write-Output ("outVec=" + $outVec)
