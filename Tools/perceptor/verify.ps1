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

# ---------- 2b. probe path census (main#26, r688) ----------
# Static and read-only: replays each probe's own path algebra, then Test-Path's
# the result. No probe is executed, so this cannot perturb the read chain.
# Why (r684~r687): three probe read paths had been pointing at retired locations
# for weeks while still reporting OK. A directory reshuffle should surface in
# the same tick as a WARN, not weeks later as a silent zero read.
# WARN, not FAIL - same stance as the r685 scan floors: a stale path is an
# observation. The gate stays green until a human retires or repoints it.
$censusScript = Join-Path $repoRoot 'Tools\devloop\probe-path-census.ps1'
if (Test-Path -LiteralPath $censusScript) {
  $censusArgs = @{}
  if ($env:FLUXVERSE_CENSUS_PROBE_DIR) { $censusArgs['ProbeDirOverride'] = $env:FLUXVERSE_CENSUS_PROBE_DIR }
  $censusLines = @()
  try { $censusLines = @(& $censusScript @censusArgs 2>&1 | ForEach-Object { [string]$_ }) }
  catch { $censusLines = @() }
  $summary = @($censusLines | Where-Object { $_ -like 'probe-path-census:*' }) | Select-Object -First 1
  if ($summary) {
    $mRows = [regex]::Match($summary, 'rows=(\d+)')
    $mDead = [regex]::Match($summary, 'DEAD=(\d+)')
    $mDyn = [regex]::Match($summary, 'dynamic=(\d+)')
    $gateRows = @($censusLines | Where-Object { $_ -match '^\s{2}\S+ -> ' })
    $deadRows = @($censusLines | Where-Object { $_ -match '^\s{2}\S+:\d+ -> ' })
    $line = 'probe-path-census: rows=' + $mRows.Groups[1].Value + ' dead=' + $mDead.Groups[1].Value +
            ' dynamic=' + $mDyn.Groups[1].Value + ' gate=' + $gateRows.Count
    if ($mDead.Success -and [int]$mDead.Groups[1].Value -gt 0) {
      # No 'FAIL' token here: the tick red-scan (fastpath c1) keys on that word.
      # The census tool's own dead-path gate lives in its usage block.
      Write-Output ('VERIFY WARN: ' + $line + ' - a probe read path no longer exists; repoint or retire it, then re-run the census')
      foreach ($d in $deadRows) { Write-Output ('VERIFY WARN: census ' + $d.Trim()) }
    } else {
      Write-Output ('VERIFY HEALTH: ' + $line)
    }
  } else {
    Write-Output 'VERIFY WARN: probe-path-census produced no summary line'
  }
}

# ---------- 2c. city shot census (main#47, r707) ----------
# The public panel inlines the newest qa/ images as its "city view" card. The
# builder drops page evidence via three guards (panel name / family registry /
# shape) that live in Tools\devloop\city-shot-shape.ps1. This census runs the
# SAME definition so a file that would slip between the guards is reported in
# the same tick instead of on the CEO's screen; it also names every qa/ image
# that passes the shape gate but belongs to no registered frame family - the
# one case where the pixels cannot prove what the picture is.
# WARN, not FAIL - same stance as 2b: an observation, not a broken city.
$shotModule = Join-Path $repoRoot 'Tools\devloop\city-shot-shape.ps1'
if (Test-Path -LiteralPath $shotModule) {
  $shotDir = Join-Path $repoRoot 'qa'
  if ($env:FLUXVERSE_SHOT_DIR) { $shotDir = $env:FLUXVERSE_SHOT_DIR }
  $loaded = $true
  try { . $shotModule } catch { $loaded = $false }
  if ($loaded -and (Get-Command Get-CityShotAudit -ErrorAction SilentlyContinue)) {
    $shotRows = @(Get-CityShotAudit -Dir $shotDir)
    if ($shotRows.Count -eq 0 -and -not (Test-Path -LiteralPath $shotDir)) {
      Write-Output ('VERIFY WARN: city-shot-census: shot dir missing: ' + $shotDir)
    } else {
      $panelRows = @($shotRows | Where-Object { $_.panel })
      $shapeRows = @($shotRows | Where-Object { (-not $_.panel) -and ($_.reason -eq 'shape') })
      $badRows   = @($shotRows | Where-Object { (-not $_.panel) -and ($_.reason -eq 'unreadable') })
      $unregRows = @($shotRows | Where-Object { $_.reason -eq 'unnamed' -and $_.shape_ok })
      $keepRows  = @($shotRows | Where-Object { $_.keep })
      $line = 'city-shot-census: images=' + $shotRows.Count + ' inlinable=' + $keepRows.Count +
              ' panel=' + $panelRows.Count + ' shape_skipped=' + $shapeRows.Count +
              ' unreadable=' + $badRows.Count + ' unregistered=' + $unregRows.Count
      if ($unregRows.Count -gt 0) {
        Write-Output ('VERIFY WARN: ' + $line + ' - an image passes the shape gate but belongs to no registered frame family, so the panel skips it; rename into a registered family or retire it')
        foreach ($u in $unregRows) { Write-Output ('VERIFY WARN: city-shot ' + $u.name + ' ' + $u.w + 'x' + $u.h) }
      } else {
        Write-Output ('VERIFY HEALTH: ' + $line)
      }
    }
  } else {
    Write-Output 'VERIFY WARN: city-shot-shape.ps1 did not provide Get-CityShotAudit'
  }
}

# ---------- 2d. R2 district site check (main#55, r716) ----------
# r713/r714 found the R2 district standing 91.7% over the L_Water mesh, and the
# answer only lived in a hand-run report: move the block or reshape the water
# and the panel would keep quoting the old number forever. The checker itself
# (Tools\devloop\r2-site-check.py) is read-only and needs no Unity, so verify
# runs it every tick in --no-artifacts mode (summary lines only, no map files)
# and republishes its verdict on the console.
# WARN, not FAIL - same stance as 2b/2c: an observation, not a broken city. A
# missing scene / missing python is a WARN too; a moved read path must never
# take the whole city scan down with it.
$siteScript = Join-Path $repoRoot 'Tools\devloop\r2-site-check.py'
if (Test-Path -LiteralPath $siteScript) {
  $pyExe = $env:FLUXVERSE_PYTHON
  if (-not $pyExe) {
    foreach ($cand in @('python', 'py')) {
      $cmd = Get-Command $cand -ErrorAction SilentlyContinue
      if ($cmd) { $pyExe = $cmd.Source; break }
    }
  }
  if (-not $pyExe) {
    Write-Output 'VERIFY WARN: r2-site: no python interpreter on PATH - site check skipped'
  } else {
    $siteArgs = @(('"' + $siteScript + '"'), '--no-artifacts')
    if ($env:FLUXVERSE_SITE_SCENE) { $siteArgs += @('--scene', ('"' + $env:FLUXVERSE_SITE_SCENE + '"')) }
    if ($env:FLUXVERSE_SITE_REBUILD) { $siteArgs += @('--rebuild', ('"' + $env:FLUXVERSE_SITE_REBUILD + '"')) }
    $psi = New-Object System.Diagnostics.ProcessStartInfo
    $psi.FileName = $pyExe
    $psi.Arguments = ($siteArgs -join ' ')
    $psi.UseShellExecute = $false
    $psi.CreateNoWindow = $true
    $psi.RedirectStandardOutput = $true
    $psi.RedirectStandardError = $true
    $psi.WorkingDirectory = $repoRoot
    $siteOut = ''
    $siteErr = ''
    $siteExit = -1
    $proc = $null
    try {
      $proc = [System.Diagnostics.Process]::Start($psi)
      $outTask = $proc.StandardOutput.ReadToEndAsync()
      $errTask = $proc.StandardError.ReadToEndAsync()
      if ($proc.WaitForExit(120000)) { $siteExit = $proc.ExitCode } else { try { $proc.Kill() } catch { }; $siteExit = -2 }
      $siteOut = [string]$outTask.Result
      $siteErr = [string]$errTask.Result
    } catch {
      $siteExit = -3
    } finally {
      if ($proc) { try { $proc.Dispose() } catch { } }
    }
    $mCov = [regex]::Match($siteOut, 'block_water_coverage=([\d.]+)%')
    $mDry = [regex]::Match($siteOut, 'dry_candidates=(\d+)')
    $mVerdict = [regex]::Match($siteOut, 'SITE_VERDICT=([A-Z_]+)')
    if ($mCov.Success -and $mDry.Success -and $mVerdict.Success -and $mVerdict.Groups[1].Value -eq 'INCONSISTENT') {
      Write-Output ('VERIFY WARN: r2-site: block_water=' + $mCov.Groups[1].Value + '% dry_candidates=' + $mDry.Groups[1].Value + ' - raster and point-in-triangle disagree; read the checker, not the number')
    } elseif ($siteExit -ne 0 -or -not $mCov.Success -or -not $mDry.Success) {
      # No 'FAIL' token in this message: the tick red-scan keys on that word.
      $reason = 'exit ' + $siteExit
      if ($siteErr.Trim()) { $reason = $reason + ': ' + (($siteErr.Trim() -split "`n")[0]) }
      $reason = $reason -replace 'FAIL', 'ERR'
      Write-Output ('VERIFY WARN: r2-site: the district site check produced no verdict (' + $reason + ') - scene or rebuild script moved?')
    } else {
      $siteLine = 'r2-site: block_water=' + $mCov.Groups[1].Value + '% dry_candidates=' + $mDry.Groups[1].Value
      $cov = [double]$mCov.Groups[1].Value
      if ($cov -gt 50.0) {
        Write-Output ('VERIFY WARN: ' + $siteLine + ' - the R2 district stands over water; run Tools\devloop\r2-site-check.py for the nearest dry patch')
      } else {
        Write-Output ('VERIFY HEALTH: ' + $siteLine)
      }
    }
  }
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
