# FluxVerse perceptor v0.1.1 - read-only group scanner (PS 5.1 compatible)
# Encoding law: ASCII-only script (group PS5.1 rule).
# Output: world/world-state.json + world/world-events.jsonl (UTF-8 no BOM)
# Cursor : world/perceptor-state.txt  (plain line format, PS5.1-safe)
# All source scans are READ-ONLY (never writes to sibling repos).
# Usage: powershell -ExecutionPolicy Bypass -File scan.ps1

$root = Resolve-Path (Join-Path $PSScriptRoot '..\..\..\..')  # -> FluxGroup root
$worldDir = Join-Path (Split-Path $PSScriptRoot -Parent) '..\world'
if (-not (Test-Path $worldDir)) { New-Item -ItemType Directory -Path $worldDir | Out-Null }
$cursorFile = Join-Path $worldDir 'perceptor-state.txt'
$eventsFile = Join-Path $worldDir 'world-events.jsonl'
$outFile    = Join-Path $worldDir 'world-state.json'

$now = (Get-Date).ToUniversalTime().ToString('yyyy-MM-ddTHH:mm:ssZ')
$events = @()
$debug  = @()

function Add-Event([string]$type,[string]$actor,[string]$repo,[string]$zone,[string]$summary) {
  $script:events += ('{"ts_utc":"' + $now + '","type":"' + $type + '","actor":"' + $actor +
    '","repo":"' + $repo + '","zone":"' + $zone + '","summary":' +
    (ConvertTo-Json ([string]$summary)) + '}')
}

# ---------- cursor (plain lines: repo:name:hash / fleet:id:seen / order:file) ----------
$curRepo = @{}; $curFleet = @{}; $curOrder = @{}
if (Test-Path $cursorFile) {
  foreach ($ln in (Get-Content $cursorFile -Encoding UTF8)) {
    if (-not $ln) { continue }
    $p = $ln -split ':', 3
    if     ($p[0] -eq 'repo')  { $curRepo[$p[1]] = $p[2] }
    elseif ($p[0] -eq 'fleet') { $curFleet[$p[1]] = $p[2] }
    elseif ($p[0] -eq 'order') { $curOrder[$p[1]] = $true }
  }
}

# ---------- 1. git scan (5 repos) ----------
$repoDirs = @{
  'fluxgroup' = @{ dir = $root.Path;                                  zone = 'governance' }
  'minigame'  = @{ dir = (Join-Path $root 'gaming\MiniGame');        zone = 'gaming' }
  'bigmoney'  = @{ dir = (Join-Path $root 'quant\bigmoney');         zone = 'quant' }
  'bigstream' = @{ dir = (Join-Path $root 'media\BigStream');        zone = 'media' }
  'fluxverse' = @{ dir = (Join-Path $root 'gaming\FluxVerse');       zone = 'governance' }
}
$commitStats = @{}
$lastCommits = @{}
$newCurRepo = @{}
foreach ($name in @($repoDirs.Keys)) {
  $r = $repoDirs[$name]; $d = $r.dir
  if (-not (Test-Path (Join-Path $d '.git'))) { $debug += "repo ${name}: no .git, skip"; continue }
  $cnt = 0
  $out = & git -C $d rev-list --count HEAD 2>$null
  if ($LASTEXITCODE -eq 0 -and $out) { $cnt = [int]$out }
  $commitStats[$name] = $cnt
  $lines = @(& git -C $d log -50 --pretty='%H|%aI|%s' 2>$null)
  $fresh = @()
  foreach ($ln in $lines) {
    if (-not $ln) { continue }
    $p = $ln -split '\|', 3
    if ($p.Count -lt 3) { continue }
    $fresh += ,@($p[0], $p[1], $p[2])
  }
  $newSeen = $false
  foreach ($f in $fresh) {
    if ($curRepo.ContainsKey($name) -and $curRepo[$name] -eq $f[0]) { $newSeen = $true; break }
  }
  if (-not $newSeen -and $fresh.Count -gt 0) {
    foreach ($f in $fresh) {
      if ($curRepo.ContainsKey($name) -and $curRepo[$name] -eq $f[0]) { break }
      Add-Event 'COMMIT' $name $name $r.zone ($f[1] + ' ' + $f[2])
    }
    $newSeen = $true
  }
  if ($fresh.Count -gt 0) {
    $lastCommits[$name] = $fresh[0][1]
    $newCurRepo[$name] = $fresh[0][0]
  }
  $debug += ("repo " + $name + ": total=" + $cnt + " fresh=" + $fresh.Count)
}

# zone activity: commits in last 24h, capped 0..1
$zoneActivity = @{ gaming = 0.0; quant = 0.0; media = 0.0 }
$iso24 = (Get-Date).ToUniversalTime().AddHours(-24).ToString('yyyy-MM-ddTHH:mm:ss')
foreach ($name in @($repoDirs.Keys)) {
  $r = $repoDirs[$name]; $z = $r.zone
  if (-not $zoneActivity.ContainsKey($z)) { continue }
  $d = $r.dir
  $n24 = 0
  $out = & git -C $d rev-list --count --since="$iso24" HEAD 2>$null
  if ($LASTEXITCODE -eq 0 -and $out) { $n24 = [int]$out }
  $a = [math]::Min(1.0, $n24 / 10.0)
  if ($a -gt $zoneActivity[$z]) { $zoneActivity[$z] = $a }
}

# ---------- 2. fleet heartbeat (BigMoney machines) ----------
$fleet = @()
$machDir = Join-Path $root 'quant\bigmoney\fleet\machines'
if (Test-Path $machDir) {
  foreach ($f in (Get-ChildItem $machDir -Filter *.json)) {
    try {
      $m = Get-Content $f.FullName -Raw -Encoding UTF8 | ConvertFrom-Json
    } catch { $debug += ("machine parse fail: " + $f.Name); continue }
    $id = $m.machine_id
    if (-not $id) { $id = $f.BaseName }
    $seenAt = [string]$m.last_seen
    $online = $false
    try {
      $ls = [datetime]::ParseExact($seenAt, 'yyyy-MM-dd HH:mm', $null)
      $online = ((Get-Date) - $ls).TotalMinutes -le 20
    } catch {}
    $task = [string]$m.current_task
    if ($task.Length -gt 120) { $task = $task.Substring(0,120) + '...' }
    $cores = 0
    try { $cores = [int]$m.cpu_cores } catch {}
    $fleet += @{ id = $id; online = $online; last_seen = $seenAt; cores = $cores; current_task = $task }
    if (-not $curFleet.ContainsKey($id) -or $curFleet[$id] -ne $seenAt) {
      Add-Event 'HEARTBEAT' $id 'bigmoney' 'quant' ('last_seen=' + $seenAt + ' online=' + $online)
      $curFleet[$id] = $seenAt
    }
  }
  $debug += ("fleet machines found: " + $fleet.Count)
} else { $debug += "machines dir missing" }

# ---------- 3. fleet tasks ----------
$tasks = @()
$taskDir = Join-Path $root 'quant\bigmoney\fleet\tasks'
if (Test-Path $taskDir) {
  foreach ($f in (Get-ChildItem $taskDir -Filter *.json)) {
    $tid = $f.BaseName; $st = 'unknown'; $ow = ''
    try {
      $t = Get-Content $f.FullName -Raw -Encoding UTF8 | ConvertFrom-Json
      if ($t.id) { $tid = [string]$t.id }
      if ($t.status) { $st = [string]$t.status }
      if ($t.owner) { $ow = [string]$t.owner }
      elseif ($t.claimed_by) { $ow = [string]$t.claimed_by }
    } catch {}
    $tasks += @{ id = $tid; zone = 'quant'; owner = $ow; status = $st }
  }
  $debug += ("fleet tasks found: " + $tasks.Count)
}

# ---------- 4. CEO orders (fleet/orders dir listing) ----------
$ordersDir = Join-Path $root 'quant\bigmoney\fleet\orders'
$ordersPending = @()
if (Test-Path $ordersDir) {
  foreach ($f in (Get-ChildItem $ordersDir -Filter *.md)) {
    if ($f.Name -eq 'README.md') { continue }   # dir doc, not an order
    $ordersPending += $f.BaseName
    if (-not $curOrder.ContainsKey($f.BaseName)) {
      Add-Event 'CEO_ORDER' 'CEO' 'bigmoney' 'quant' ('order ' + $f.BaseName)
      $curOrder[$f.BaseName] = $true
    }
  }
}

# ---------- 5. MiniGame snapshot freshness ----------
$snap = Join-Path $root 'gaming\MiniGame\自动化快照.md'
if (Test-Path $snap) {
  $age = ((Get-Date) - (Get-Item $snap).LastWriteTime).TotalMinutes
  if ($age -le 30 -and $zoneActivity['gaming'] -lt 0.6) { $zoneActivity['gaming'] = 0.6 }
  $debug += ("minigame snapshot age_min=" + [math]::Round($age,1))
}

# ---------- 6. governance / evolution ----------
$evolutionOpen = 0
$ledger = Join-Path $root 'cph4\evolution-ledger.md'
if (Test-Path $ledger) {
  $raw = Get-Content $ledger -Raw -Encoding UTF8
  $evolutionOpen = ([regex]::Matches($raw, 'open')).Count
}

# ---------- 7. assemble world-state ----------
$totalCommits = 0
foreach ($v in $commitStats.Values) { $totalCommits += $v }
$lastAny = ''
foreach ($v in $lastCommits.Values) { if ($v -gt $lastAny) { $lastAny = $v } }

$state = [ordered]@{
  protocol = 'fluxverse/0.1'
  ts_utc = $now
  zones = @(
    @{ id = 'gaming'; name = 'FLUX Gaming'; status = 'active';     activity = [math]::Round($zoneActivity['gaming'], 2) }
    @{ id = 'quant';  name = 'FLUX Quant';  status = 'active';     activity = [math]::Round($zoneActivity['quant'], 2) }
    @{ id = 'media';  name = 'FLUX Media';  status = 'onboarding'; activity = [math]::Round($zoneActivity['media'], 2) }
  )
  fleet = $fleet
  tasks = $tasks
  flows = @(
    @{ id = 'data';    zone = 'gaming' }
    @{ id = 'capital'; zone = 'quant' }
    @{ id = 'traffic'; zone = 'media' }
  )
  products = @(
    @{ id = 'minigame';  line = 'gaming'; status = 'active' }
    @{ id = 'bigmoney';  line = 'quant';  status = 'active' }
    @{ id = 'bigstream'; line = 'media';  status = 'onboarding' }
    @{ id = 'fluxverse'; line = 'gaming'; status = 'onboarding' }
  )
  governance = @{
    ceo_orders_pending = $ordersPending
    evolution = @{ next_tick = 'SUN 09:17'; open_proposals = $evolutionOpen }
  }
  history = @{ commits_total = $totalCommits; last_commit_ts = $lastAny }
}

# ---------- 8. write outputs (UTF-8 no BOM) ----------
$utf8 = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($outFile, ($state | ConvertTo-Json -Depth 6), $utf8)
if ($events.Count -gt 0) {
  $old = ''
  if (Test-Path $eventsFile) { $old = [System.IO.File]::ReadAllText($eventsFile) }
  [System.IO.File]::WriteAllText($eventsFile, ($old + (($events -join "`n") + "`n")), $utf8)
}
$curLines = @()
foreach ($k in $newCurRepo.Keys) { $curLines += ('repo:' + $k + ':' + $newCurRepo[$k]) }
foreach ($k in $curFleet.Keys)   { $curLines += ('fleet:' + $k + ':' + $curFleet[$k]) }
foreach ($k in $curOrder.Keys)   { $curLines += ('order:' + $k + ':1') }
[System.IO.File]::WriteAllText($cursorFile, ($curLines -join "`n") + "`n", $utf8)

Write-Output ('perceptor v0.1.1 done: events +' + $events.Count + ' fleet=' + $fleet.Count + ' tasks=' + $tasks.Count)
$debug | ForEach-Object { Write-Output ('  ' + $_) }
