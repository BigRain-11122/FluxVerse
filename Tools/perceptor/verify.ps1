# FluxVerse verify gate - validates world outputs before they ship to the engine.
# Exit 0 = PASS, 1 = FAIL (tick blocks a FAILed round; previous state is kept).
# ASCII-only (group PS5.1 encoding law).

$repoRoot  = Resolve-Path (Join-Path $PSScriptRoot '..\..')      # -> gaming/FluxVerse
$worldDir  = Join-Path $repoRoot 'world'
$registryFile = Join-Path $repoRoot 'schema\events-registry.json'
$stateFile  = Join-Path $worldDir 'world-state.json'
$eventsFile = Join-Path $worldDir 'world-events.jsonl'
$fail = @()

# ---------- 1. world-state.json ----------
$state = $null
if (Test-Path $stateFile) {
  try { $state = Get-Content $stateFile -Raw -Encoding UTF8 | ConvertFrom-Json } catch { $fail += 'state: not parseable JSON' }
} else { $fail += 'state: file missing' }
if ($state) {
  if (-not $state.protocol) { $fail += 'state: protocol field missing' }
  elseif ($state.protocol -notlike 'fluxverse/*') { $fail += ('state: bad protocol ' + $state.protocol) }
  foreach ($k in @('ts_utc','zones','fleet','tasks','flows','products','governance','history')) {
    if (-not $state.PSObject.Properties[$k]) { $fail += ('state: field missing: ' + $k) }
  }
  if ($state.zones) {
    $needZones = @('gaming','quant','media')
    $haveZones = @($state.zones | ForEach-Object { $_.id })
    foreach ($z in $needZones) { if ($haveZones -notcontains $z) { $fail += ('state: zone missing: ' + $z) } }
  }
}

# ---------- 2. registry + events ----------
$reg = $null
if (Test-Path $registryFile) {
  try { $reg = Get-Content $registryFile -Raw -Encoding UTF8 | ConvertFrom-Json } catch { $fail += 'registry: not parseable' }
} else { $fail += 'registry: file missing' }
$known = @{}
if ($reg -and $reg.events) {
  $reg.events.PSObject.Properties | ForEach-Object { $known[$_.Name] = $true }
}
if ((Test-Path $eventsFile) -and $known.Count -gt 0) {
  $lineNo = 0
  foreach ($ln in (Get-Content $eventsFile -Encoding UTF8)) {
    $lineNo++
    if (-not $ln.Trim()) { continue }
    $e = $null
    try { $e = $ln | ConvertFrom-Json } catch { $fail += ('events: line ' + $lineNo + ' not parseable'); continue }
    if (-not $known.ContainsKey([string]$e.type)) { $fail += ('events: line ' + $lineNo + ' unregistered type: ' + $e.type) }
    if (-not $e.ts_utc) { $fail += ('events: line ' + $lineNo + ' missing ts_utc') }
  }
}

# ---------- verdict ----------
if ($fail.Count -gt 0) {
  $fail | ForEach-Object { Write-Output ('VERIFY FAIL: ' + $_) }
  exit 1
}
Write-Output 'VERIFY PASS'
exit 0
