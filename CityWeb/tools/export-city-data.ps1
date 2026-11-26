# CityWeb data exporter: world/world-state.json + world-public/city-snapshot.json
# -> CityWeb/dist/city-data.js (window.CITY_DATA sidecar).
# Same delivery pattern as MiniGame siliconwatch generate.ps1 (data.js sidecar
# keeps the page fully functional on file:// with zero server).
# Encoding law: [IO.File] read/write with explicit UTF8 only (PS 5.1 safe).
param(
    [string]$CityWebRoot = (Split-Path $PSScriptRoot -Parent),
    [string]$FluxVerseRoot = (Split-Path (Split-Path $PSScriptRoot -Parent) -Parent)
)

$ErrorActionPreference = 'Stop'
$utf8 = New-Object System.Text.UTF8Encoding($false)   # no BOM
$utf8bomlessRead = New-Object System.Text.UTF8Encoding($false)

function Read-Json([string]$path) {
    if (-not (Test-Path $path)) { return $null }
    $raw = [System.IO.File]::ReadAllText($path, $utf8bomlessRead)
    try { return ($raw | ConvertFrom-Json) } catch { return $null }
}

$state = Read-Json (Join-Path $FluxVerseRoot 'world\world-state.json')
if ($null -eq $state) {
    Write-Output "EXPORT SKIP: world-state.json missing or unreadable"
    exit 0
}
$snap = Read-Json (Join-Path $FluxVerseRoot 'world-public\city-snapshot.json')

# Events: last 42 lines of the live stream (oldest first).
$events = @()
$evPath = Join-Path $FluxVerseRoot 'world\world-events.jsonl'
if (Test-Path $evPath) {
    $lines = Get-Content $evPath -Tail 42 -Encoding UTF8
    foreach ($ln in $lines) {
        if ([string]::IsNullOrWhiteSpace($ln)) { continue }
        try {
            $o = $ln | ConvertFrom-Json
            $events += [ordered]@{
                ts_utc = $o.ts_utc
                type   = $o.type
                actor  = $o.actor
                zone   = $o.zone
                summary = $o.summary
            }
        } catch { }
    }
}

$zones = @()
foreach ($z in @($state.zones)) {
    $zones += [ordered]@{ id = $z.id; name = $z.name; status = $z.status; activity = [double]$z.activity }
}
$fleet = @()
foreach ($m in @($state.fleet)) {
    $fleet += [ordered]@{ id = $m.id; cores = [int]$m.cores; online = [bool]$m.online; current_task = $m.current_task }
}

$cityBlock = $null
if ($null -ne $snap) { $cityBlock = $snap.city }

$data = [ordered]@{
    gen_utc     = $state.ts_utc
    zones       = $zones
    fleet       = $fleet
    census_total = [int]$state.census.total
    reality     = [ordered]@{
        city_day_phase = $state.reality.city_day_phase
        beijing_hhmm   = $state.reality.beijing_hhmm
        weather_kind   = $state.reality.weather_kind
        weather_temp_c = $state.reality.weather_temp_c
        season         = $state.reality.season
        weekday        = $state.reality.weekday
    }
    city        = $cityBlock
    events_tail = $events
}

$json = $data | ConvertTo-Json -Depth 6 -Compress
$js = "window.CITY_DATA = $json;"

$dist = Join-Path $CityWebRoot 'dist'
if (-not (Test-Path $dist)) { New-Item -ItemType Directory -Path $dist | Out-Null }
$outPath = Join-Path $dist 'city-data.js'
$tmpPath = "$outPath.tmp"
[System.IO.File]::WriteAllText($tmpPath, $js, $utf8)
Move-Item $tmpPath $outPath -Force

Write-Output ("EXPORT OK: " + $outPath + " zones=" + $zones.Count + " fleet=" + $fleet.Count + " events=" + $events.Count)
