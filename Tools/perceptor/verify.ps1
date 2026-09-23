# FluxVerse verify gate v2 - aligns with TECH claims (F4), cursor-incremental (S3),
# self-healing quarantine (F1 companion): bad event lines are MOVED OUT of the
# live feed to quarantine-events.jsonl instead of failing forever.
# Exit 0 = PASS, 1 = FAIL. ASCII-only.

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot '..\..')       # -> gaming/FluxVerse
$worldDir = Join-Path $repoRoot 'world'
$registryFile = Join-Path $repoRoot 'schema\events-registry.json'
$stateFile  = Join-Path $worldDir 'world-state.json'
$eventsFile = Join-Path $worldDir 'world-events.jsonl'
$quarFile   = Join-Path $worldDir 'quarantine-events.jsonl'
$vcurFile   = Join-Path $worldDir 'verify-cursor.txt'
$fail = @()

# ---------- registry ----------
$known = @{}
try {
  $reg = Get-Content $registryFile -Raw -Encoding UTF8 | ConvertFrom-Json
  $reg.events.PSObject.Properties | ForEach-Object { $known[$_.Name] = $true }
} catch { $fail += 'registry: not parseable' }

# ---------- 1. world-state.json + inner field checks (F4) ----------
$state = $null
if (Test-Path $stateFile) {
  try { $state = Get-Content $stateFile -Raw -Encoding UTF8 | ConvertFrom-Json } catch { $fail += 'state: not parseable JSON' }
} else { $fail += 'state: file missing' }
if ($state) {
  if (-not $state.protocol) { $fail += 'state: protocol missing' }
  elseif ($state.protocol -notlike 'fluxverse/*') { $fail += ('state: bad protocol ' + $state.protocol) }
  foreach ($k in @('ts_utc','zones','fleet','tasks','flows','products','governance','history')) {
    if (-not $state.PSObject.Properties[$k]) { $fail += ('state: field missing: ' + $k) }
  }
  if ($state.zones) {
    $have = @($state.zones | ForEach-Object { $_.id })
    foreach ($z in @('gaming','quant','media')) { if ($have -notcontains $z) { $fail += ('state: zone missing: ' + $z) } }
    foreach ($z in $state.zones) { if (-not $z.status -or -not $z.activity) { $fail += ('state: zone field hole: ' + $z.id) } }
  }
  foreach ($f in @($state.fleet)) { if ($f -and (-not $f.id -or $null -eq $f.online)) { $fail += ('state: fleet field hole: ' + $f.id) } }
  foreach ($p in @($state.products)) { if ($p -and (-not $p.id -or -not $p.status)) { $fail += ('state: product field hole: ' + $p.id) } }
}

# ---------- 2. events: cursor-incremental scan + self-heal quarantine (F1/S3) ----------
$vcur = 0
if (Test-Path $vcurFile) { $v = (Get-Content $vcurFile -Raw).Trim(); if ($v) { $vcur = [int]$v } }
if (Test-Path $eventsFile) {
  $all = @(Get-Content $eventsFile -Encoding UTF8)
  $total = $all.Count
  $keep = @()
  $quarNew = @()
  for ($i = 0; $i -lt $total; $i++) {
    $ln = $all[$i]
    if ($i -lt $vcur) { $keep += $ln; continue }               # already verified once
    if (-not $ln.Trim()) { continue }
    $e = $null; $bad = $false
    try { $e = $ln | ConvertFrom-Json } catch { $bad = $true }
    if (-not $bad) {
      if (-not $e.ts_utc) { $bad = $true }
      elseif ($known.Count -gt 0 -and -not $known.ContainsKey([string]$e.type)) { $bad = $true }
    }
    if ($bad) { $quarNew += $ln } else { $keep += $ln }
  }
  # renumber: lines may shrink when quarantined -> cursor = kept count
  if ($quarNew.Count -gt 0) {
    $oldQ = ''
    if (Test-Path $quFile) { $oldQ = [System.IO.File]::ReadAllText($quFile) }
    $utf8 = New-Object System.Text.UTF8Encoding($false)
    [System.IO.File]::WriteAllText($quFile, ($oldQ + (($quarNew -join "`n") + "`n")), $utf8)
    [System.IO.File]::WriteAllText($eventsFile, (($keep -join "`n") + "`n"), $utf8)
    $fail += ('self-heal: quarantined ' + $quarNew.Count + ' bad line(s)')
  }
  $newCur = $keep.Count
  [System.IO.File]::WriteAllText($vcurFile, [string]$newCur, (New-Object System.Text.UTF8Encoding($false)))
} else { $fail += 'events: file missing' }

# ---------- verdict ----------
if ($fail.Count -gt 0) {
  $onlyHeal = ($fail | Where-Object { $_ -notlike 'self-heal:*' }).Count -eq 0
  $fail | ForEach-Object { Write-Output ('VERIFY ' + $(if ($_ -like 'self-heal:*') {'HEAL'} else {'FAIL'}) + ': ' + $_) }
  if ($onlyHeal) { Write-Output 'VERIFY PASS (after self-heal)'; exit 0 }
  exit 1
}
Write-Output 'VERIFY PASS'
exit 0
