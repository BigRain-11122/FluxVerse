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

# --- BigLife 桥（2026-11-26 融合）：32 席挂牌居民年轮 + 观察流传播边 ---
# 数据源=life/BigLife/Tools/city_bridge_export.py（pump 收尾面自动重建；年轮
# 按 id 直读卡面）。此处只读不写（居民生活事实=BigLife 唯一源）。缺文件静默
# 降级（residents/echoes 字段缺省），页面照常渲染其余面。
$bridgePath = Join-Path $FluxVerseRoot 'world-public\city-bridge.json'
$bridge = Read-Json $bridgePath
$residents = @()
$echoes = @()
if ($null -ne $bridge -and $null -ne $bridge.slots) {
    foreach ($s in @($bridge.slots)) {
        $residents += [ordered]@{
            id = $s.id; name = $s.name; district = $s.district
            profession = $s.profession; ring = $s.ring
            goal_done = if ($null -ne $s.goal) { [int]$s.goal.done } else { $null }
            goal_total = if ($null -ne $s.goal) { [int]$s.goal.total } else { $null }
            # 外形特征（2026-11-26 CEO「每个人都要有自己的特征」）：全部来自卡面
            # 契约的六 hex 换装位 + 性别/年龄/发型/瞳型，three.js 侧按数据搭几何。
            gender = $s.gender; age = $s.age
            hair_part = $s.hair_part; eye_part = $s.eye_part
            skin_c = $s.skin_c; hair_c = $s.hair_c
            cloth_c = $s.cloth_c; pant_c = $s.pant_c
            badge_c = $s.badge_c; eye_c = $s.eye_c
            faction = $s.faction
            # 行为层（共用技术底座 v1 · cph4/city-foundation.md §三）：语义在 BigLife，
            # 本仓只透传，坐标由 residents.ts 按 place 映射——不许在这里重算位置。
            place = $s.place; act = $s.act; act_label = $s.act_label; with = $s.with
        }
    }
    foreach ($e in @($bridge.echoes)) {
        $echoes += [ordered]@{ owner = $e.owner; by = $e.by; day = $e.day; frag = $e.frag;
                               owner_d = $e.owner_d; by_d = $e.by_d }
    }
}

$data = [ordered]@{
    gen_utc     = $state.ts_utc
    zones       = $zones
    fleet       = $fleet
    census_total = [int]$state.census.total
    residents   = $residents
    echoes      = $echoes
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
