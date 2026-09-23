# FluxVerse perceptor v0.2 - probe plugin architecture
# Fixed orchestrator: cursor + event outlet + assembly + output.
# New data source = drop a file into probes/ (see probes/_template.ps1). Zero edits here.
# Encoding law: ASCII-only script. All scans are READ-ONLY.
# Usage: powershell -ExecutionPolicy Bypass -File scan.ps1

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot '..\..')   # -> gaming/FluxVerse
$root = Resolve-Path (Join-Path $PSScriptRoot '..\..\..\..') # -> FluxGroup root
$worldDir = Join-Path $repoRoot 'world'
if (-not (Test-Path $worldDir)) { New-Item -ItemType Directory -Path $worldDir | Out-Null }
$cursorFile = Join-Path $worldDir 'perceptor-state.txt'
$eventsFile = Join-Path $worldDir 'world-events.jsonl'
$outFile    = Join-Path $worldDir 'world-state.json'

$now = (Get-Date).ToUniversalTime().ToString('yyyy-MM-ddTHH:mm:ssZ')
$events = @()
$debug  = @()

function Add-WorldEvent([string]$type,[string]$actor,[string]$repo,[string]$zone,[string]$summary) {
  $script:events += ('{"ts_utc":"' + $script:now + '","type":"' + $type + '","actor":"' + $actor +
    '","repo":"' + $repo + '","zone":"' + $zone + '","summary":' + (ConvertTo-Json ([string]$summary)) + '}')
}

# ---------- cursor (plain lines: key:value, shared across probes) ----------
$cursor = @{}
if (Test-Path $cursorFile) {
  foreach ($ln in (Get-Content $cursorFile -Encoding UTF8)) {
    if (-not $ln) { continue }
    $p = $ln -split '=', 2
    if ($p.Count -eq 2) { $cursor[$p[0]] = $p[1] }
  }
}

# ---------- probe context ----------
$ctx = @{
  root = $root.Path
  now = $now
  cursor = $cursor
  AddEvent = { param($type,$actor,$repo,$zone,$summary) Add-WorldEvent $type $actor $repo $zone $summary }
}

# ---------- load + run probes (sorted; _template skipped) ----------
$stateParts = @{}
$newCur = @{}
$probeFiles = @(Get-ChildItem (Join-Path $PSScriptRoot 'probes') -Filter *.ps1 | Sort-Object Name)
foreach ($pf in $probeFiles) {
  if ($pf.Name -like '_*') { continue }
  . $pf.FullName
  $fn = 'Probe-' + $pf.BaseName
  try {
    $res = & $fn $ctx
    if ($res -and $res.state) {
      foreach ($k in $res.state.Keys) { $stateParts[$k] = $res.state[$k] }
    }
    if ($res -and $res.newcur) {
      foreach ($k in $res.newcur.Keys) { $newCur[$k] = $res.newcur[$k] }
    }
    $debug += ('probe ' + $pf.BaseName + ': OK')
  } catch {
    $debug += ('probe ' + $pf.BaseName + ': FAIL ' + $_.Exception.Message)
  }
}

# ---------- assemble world-state (city assembly logic lives here, stable) ----------
$za = @{ gaming = 0.0; quant = 0.0; media = 0.0 }
if ($stateParts.ContainsKey('zones_activity')) {
  foreach ($k in @($za.Keys)) { if ($stateParts.zones_activity.ContainsKey($k)) { $za[$k] = [double]$stateParts.zones_activity[$k] } }
}
if ($stateParts.ContainsKey('gaming_pulse')) {
  $p = [double]$stateParts.gaming_pulse
  if ($p -gt $za['gaming']) { $za['gaming'] = $p }
}
$ordersPending = @()
if ($stateParts.ContainsKey('ceo_orders_pending')) { $ordersPending = $stateParts.ceo_orders_pending }
$evOpen = 0
if ($stateParts.ContainsKey('evolution_open')) { $evOpen = [int]$stateParts.evolution_open }
$fleet = @(); if ($stateParts.ContainsKey('fleet')) { $fleet = $stateParts.fleet }
$tasks = @(); if ($stateParts.ContainsKey('tasks')) { $tasks = $stateParts.tasks }
$total = 0; if ($stateParts.ContainsKey('commits_total')) { $total = [int]$stateParts.commits_total }
$lastC = ''; if ($stateParts.ContainsKey('last_commit_ts')) { $lastC = [string]$stateParts.last_commit_ts }

$state = [ordered]@{
  protocol = 'fluxverse/0.1'
  ts_utc = $now
  zones = @(
    @{ id = 'gaming'; name = 'FLUX Gaming'; status = 'active';     activity = [math]::Round($za['gaming'], 2) }
    @{ id = 'quant';  name = 'FLUX Quant';  status = 'active';     activity = [math]::Round($za['quant'], 2) }
    @{ id = 'media';  name = 'FLUX Media';  status = 'onboarding'; activity = [math]::Round($za['media'], 2) }
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
    evolution = @{ next_tick = 'SUN 09:17'; open_proposals = $evOpen }
  }
  history = @{ commits_total = $total; last_commit_ts = $lastC }
}

# ---------- write outputs (UTF-8 no BOM) ----------
$utf8 = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($outFile, ($state | ConvertTo-Json -Depth 6), $utf8)
if ($events.Count -gt 0) {
  $old = ''
  if (Test-Path $eventsFile) { $old = [System.IO.File]::ReadAllText($eventsFile) }
  [System.IO.File]::WriteAllText($eventsFile, ($old + (($events -join "`n") + "`n")), $utf8)
}
# persist cursor: probes' inline updates + git probe's newcur
$curLines = @()
foreach ($k in $newCur.Keys) { $cursor[$k] = $newCur[$k] }
foreach ($k in $cursor.Keys) { $curLines += ($k + '=' + $cursor[$k]) }
[System.IO.File]::WriteAllText($cursorFile, ($curLines -join "`n") + "`n", $utf8)

Write-Output ('perceptor v0.2 done: events +' + $events.Count + ' fleet=' + $fleet.Count + ' tasks=' + $tasks.Count)
$debug | ForEach-Object { Write-Output ('  ' + $_) }
