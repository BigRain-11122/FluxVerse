# FluxVerse verify gate v0.4 - validates world outputs before they ship to the engine.
# Exit 0 = PASS, 1 = FAIL.
# Consolidated 2026-09-23 (CEO audit fix, dual-session merge - single executor):
#   - Two-phase state: scan writes world-state.json.new; on PASS it is promoted to
#     world-state.json; on FAIL the OLD state is kept and .new discarded.
#   - Events self-heal: bad lines (unparseable / unregistered type / missing ts)
#     are moved to world-events.quarantine.jsonl and removed from the live
#     stream. The gate heals - it never deadlocks on a bad line (F1).
#   - Delta cursor: only lines past the last verified count are checked
#     (world/verify-state.txt), so verify cost stays O(new lines) (S3).
#   - Cursor self-check (r3, v0.4): a cursor past EOF (stream rotated/truncated)
#     or an unreadable cursor file is REPORTED and rebased to a full verify -
#     a bad cursor is never silently trusted.
#   - Inner-field checks: zones/fleet/tasks/flows/products/governance/history (F4).
# ASCII-only (group PS5.1 encoding law).

$repoRoot  = Resolve-Path (Join-Path $PSScriptRoot '..\..')      # -> gaming/FluxVerse
$worldDir  = Join-Path $repoRoot 'world'
$registryFile = Join-Path $repoRoot 'schema\events-registry.json'
$stateFile  = Join-Path $worldDir 'world-state.json'
$newStateFile = Join-Path $worldDir 'world-state.json.new'
$eventsFile = Join-Path $worldDir 'world-events.jsonl'
$quarFile   = Join-Path $worldDir 'world-events.quarantine.jsonl'
$verifyState = Join-Path $worldDir 'verify-state.txt'
$utf8 = New-Object System.Text.UTF8Encoding($false)
$fail = @()
$healed = 0

# ---------- 1. state (candidate = .new if present, else current) ----------
$promote = (Test-Path $newStateFile)
$cand = $null
if ($promote) { $cand = $newStateFile } elseif (Test-Path $stateFile) { $cand = $stateFile }
if (-not $cand) {
  $fail += 'state: file missing'
} else {
  $state = $null
  try { $state = Get-Content $cand -Raw -Encoding UTF8 | ConvertFrom-Json } catch { $fail += 'state: not parseable JSON' }
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
      foreach ($z in @($state.zones)) {
        foreach ($f in @('id','name','status','activity')) {
          if (-not $z.PSObject.Properties[$f]) { $fail += ('state: zone[' + $z.id + '] missing field: ' + $f) }
        }
      }
    }
    foreach ($m in @($state.fleet)) {
      if ($m) {
        foreach ($f in @('id','online','last_seen','cores','current_task')) {
          if (-not $m.PSObject.Properties[$f]) { $fail += ('state: fleet[' + $m.id + '] missing field: ' + $f) }
        }
      }
    }
    foreach ($t in @($state.tasks)) {
      if ($t) {
        foreach ($f in @('id','zone','owner','status')) {
          if (-not $t.PSObject.Properties[$f]) { $fail += ('state: task[' + $t.id + '] missing field: ' + $f) }
        }
      }
    }
    foreach ($fl in @($state.flows)) {
      if ($fl) {
        foreach ($f in @('id','zone')) {
          if (-not $fl.PSObject.Properties[$f]) { $fail += 'state: flow missing field: ' + $f }
        }
      }
    }
    if ($state.products) {
      $needProd = @('minigame','bigmoney','bigstream')
      $haveProd = @($state.products | ForEach-Object { $_.id })
      foreach ($p in $needProd) { if ($haveProd -notcontains $p) { $fail += ('state: product missing: ' + $p) } }
      foreach ($p in @($state.products)) {
        foreach ($f in @('id','line','status')) {
          if (-not $p.PSObject.Properties[$f]) { $fail += ('state: product[' + $p.id + '] missing field: ' + $f) }
        }
      }
    }
    if ($state.governance -and -not $state.governance.PSObject.Properties['ceo_orders_pending']) { $fail += 'state: governance.ceo_orders_pending missing' }
    if ($state.history) {
      foreach ($f in @('commits_total','last_commit_ts')) {
        if (-not $state.history.PSObject.Properties[$f]) { $fail += ('state: history missing field: ' + $f) }
      }
    }
  }
}

# ---------- 2. registry + events self-heal (delta from cursor) ----------
$reg = $null
if (Test-Path $registryFile) {
  try { $reg = Get-Content $registryFile -Raw -Encoding UTF8 | ConvertFrom-Json } catch { $fail += 'registry: not parseable' }
} else { $fail += 'registry: file missing' }
$known = @{}
if ($reg -and $reg.events) {
  $reg.events.PSObject.Properties | ForEach-Object { $known[$_.Name] = $true }
}

if ((Test-Path $eventsFile) -and $known.Count -gt 0) {
  $verified = -1
  if (Test-Path $verifyState) {
    foreach ($ln in (Get-Content $verifyState -Encoding UTF8)) {
      if ($ln -match '^events_verified=(\d+)') { $verified = [int]$Matches[1] }
    }
  }
  $lines = @(Get-Content $eventsFile -Encoding UTF8)
  # r3 cursor self-check: anomaly = cursor past EOF (rotated/truncated stream)
  # or unreadable cursor file -> report and rebase to full verify
  $start = 0
  if ($verified -lt 0) {
    if (Test-Path $verifyState) { Write-Output 'VERIFY WARN: cursor unreadable - full verify' }
  } elseif ($verified -gt $lines.Count) {
    Write-Output ('VERIFY WARN: cursor anomaly events_verified=' + $verified + ' > lines=' + $lines.Count + ' (rotated/truncated) - rebasing to 0')
  } else {
    $start = $verified
  }
  $clean = @()
  if ($start -gt 0) { $clean = @($lines[0..($start-1)]) }
  $bad = @()
  for ($i = $start; $i -lt $lines.Count; $i++) {
    $ln = $lines[$i]
    if (-not $ln.Trim()) { continue }
    $ok = $false
    try {
      $e = $ln | ConvertFrom-Json
      if ($known.ContainsKey([string]$e.type) -and $e.ts_utc) { $ok = $true }
    } catch { }
    if ($ok) { $clean += $ln } else { $bad += $ln }
  }
  if ($bad.Count -gt 0) {
    $healed = $bad.Count
    [System.IO.File]::WriteAllText($eventsFile, (($clean -join "`n") + "`n"), $utf8)
    foreach ($b in $bad) { [System.IO.File]::AppendAllText($quarFile, ($b + "`n"), $utf8) }
  }
  [System.IO.File]::WriteAllText($verifyState, ('events_verified=' + $clean.Count + "`n"), $utf8)
}

# ---------- verdict ----------
if ($fail.Count -gt 0) {
  $fail | ForEach-Object { Write-Output ('VERIFY FAIL: ' + $_) }
  if ($promote) {
    Remove-Item $newStateFile -Force -ErrorAction SilentlyContinue
    Write-Output 'VERIFY FAIL: .new state discarded, old world-state.json kept'
  }
  exit 1
}
if ($promote) { Move-Item -Force $newStateFile $stateFile }
if ($healed -gt 0) {
  Write-Output ('VERIFY PASS (healed ' + $healed + ' bad event line(s) -> quarantine)')
} else {
  Write-Output 'VERIFY PASS'
}
exit 0
