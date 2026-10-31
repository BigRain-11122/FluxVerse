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
# The checker call, its parsing and its red line now live in ONE module that the
# panel builder dot-sources too (queue main#57) - two copies of the threshold
# would let the page and the tick disagree about the same lake.
$siteScript = Join-Path $repoRoot 'Tools\devloop\r2-site-check.py'
$siteMod = Join-Path $repoRoot 'Tools\devloop\site-verdict.ps1'
if ((-not (Test-Path -LiteralPath $siteScript)) -or (-not (Test-Path -LiteralPath $siteMod))) {
  Write-Output 'VERIFY WARN: r2-site: checker or site-verdict.ps1 missing - site check skipped'
} else {
  $siteLoaded = $true
  try { . $siteMod } catch { $siteLoaded = $false }
  if ($siteLoaded -and (Get-Command Get-SiteVerdict -ErrorAction SilentlyContinue)) {
    $sv = Get-SiteVerdict -Root $repoRoot
    if (-not $sv.ran) {
      if (-not (Get-SitePython)) {
        Write-Output 'VERIFY WARN: r2-site: no python interpreter on PATH - site check skipped'
      } else {
        # No 'FAIL' token in this message: the tick red-scan keys on that word.
        Write-Output ('VERIFY WARN: r2-site: the district site check produced no verdict (' + $sv.reason + ') - scene or rebuild script moved?')
      }
    } elseif ($sv.verdict -eq 'INCONSISTENT') {
      Write-Output ('VERIFY WARN: r2-site: block_water=' + $sv.block_water_text + '% dry_candidates=' + $sv.dry_candidates_text + ' - raster and point-in-triangle disagree; read the checker, not the number')
    } else {
      # main#71: the street camera's prop coverage (r730) is part of the same
      # "is this pose usable?" question, so it rides the same line. A report
      # without a street_pose line prints n/a and never fails the tick; only a
      # real reading above the red line warns.
      $pose = Get-StreetPose -Root $repoRoot
      $siteLine = 'r2-site: block_water=' + $sv.block_water_text + '% dry_candidates=' + $sv.dry_candidates_text + ' props_in_road=' + $sv.props_in_road_text + ' prop_cover=' + $pose.prop_cover_text
      if (Test-SiteOverWater -Verdict $sv) {
        Write-Output ('VERIFY WARN: ' + $siteLine + ' - the R2 district stands over water; run Tools\devloop\r2-site-check.py for the nearest dry patch')
      } elseif (Test-SitePropsInRoad -Verdict $sv) {
        Write-Output ('VERIFY WARN: ' + $siteLine + ' - base-plate props stand on the road strip; run Tools\devloop\r2-site-check.py for their names (main#65)')
      } elseif (Test-SitePropCoverHigh -Pose $pose) {
        Write-Output ('VERIFY WARN: ' + $siteLine + ' - the street camera shoots through props (over 15%); re-solve the pose with Tools\devloop\city3d-shots.ps1 (main#71)')
      } else {
        Write-Output ('VERIFY HEALTH: ' + $siteLine)
      }
    }
  } else {
    Write-Output 'VERIFY WARN: site-verdict.ps1 did not provide Get-SiteVerdict'
  }
}

# ---------- 2e. daily log archive duty (main#56, r719) ----------
# r715 archived 2,174 stale log files by hand and nothing ran it again, so the
# backlog could only grow back. The archiver itself is unchanged and keeps its
# own dry run; what was missing is a schedule. This runs it through
# Tools\devloop\log-archive-duty.ps1, which gates to at most one real run per
# calendar day (a full recursive scan every ten minutes costs more than it saves)
# and reports the archiver's own ARCHIVE SUMMARY line rather than re-deriving it.
# WARN, not FAIL - same stance as 2b/2c/2d: a log retention problem must never
# take the whole city scan down with it. No 'FAIL' token in these messages (the
# tick red-scan keys on that word).
$archiveDuty = Join-Path $repoRoot 'Tools\devloop\log-archive-duty.ps1'
if (-not (Test-Path -LiteralPath $archiveDuty)) {
  Write-Output 'VERIFY WARN: log-archive: log-archive-duty.ps1 missing - archive duty skipped'
} else {
  $adLoaded = $true
  try { . $archiveDuty } catch { $adLoaded = $false }
  if ($adLoaded -and (Get-Command Invoke-LogArchiveDuty -ErrorAction SilentlyContinue)) {
    $adArgs = @{ Root = $repoRoot }
    if ($env:FLUXVERSE_ARCHIVE_DIR) { $adArgs['LogsDir'] = $env:FLUXVERSE_ARCHIVE_DIR }
    if ($env:FLUXVERSE_ARCHIVE_STATE) { $adArgs['StatePath'] = $env:FLUXVERSE_ARCHIVE_STATE }
    if ($env:FLUXVERSE_ARCHIVE_DAYS) { $adArgs['Days'] = [int]$env:FLUXVERSE_ARCHIVE_DAYS }
    if ($env:FLUXVERSE_ARCHIVE_MAX_REMAIN) { $adArgs['MaxRemainArchivable'] = [int]$env:FLUXVERSE_ARCHIVE_MAX_REMAIN }
    if ($env:FLUXVERSE_ARCHIVE_FORCE) { $adArgs['Force'] = $true }
    if ($env:FLUXVERSE_ARCHIVE_SIMULATE_MISMATCH) { $adArgs['SimulateVerifyMismatch'] = $true }
    $ad = $null
    try { $ad = Invoke-LogArchiveDuty @adArgs } catch { $ad = $null }
    if (-not $ad) {
      Write-Output 'VERIFY WARN: log-archive: duty module threw - archive duty skipped this tick'
    } else {
      $adParts = @('log-archive:')
      if ($ad.ran) { $adParts += 'ran' } else { $adParts += ('skipped(' + $ad.reason + ')') }
      $adParts += ('candidates=' + $ad.candidates)
      $adParts += ('archived=' + $ad.archived)
      if ($ad.remain_stale) {
        $adParts += ('remain_archivable=' + $ad.remain_archivable + '(last)')
      } else {
        $adParts += ('remain_archivable=' + $ad.remain_archivable)
      }
      $adLine = ($adParts -join ' ')
      if ($ad.verdict -ne 'OK' -and $ad.verdict -ne 'SKIP' -and $ad.verdict -ne 'DRYRUN') {
        Write-Output ('VERIFY WARN: ' + $adLine + ' - the log archiver did not finish (' + $ad.verdict + '); originals are kept and the next tick retries')
      } elseif ($ad.remain_archivable -gt $ad.max_remain) {
        if ($ad.remain_stale) {
          Write-Output ('VERIFY WARN: ' + $adLine + ' - the last archived run left more than ' + $ad.max_remain + ' log files past the cutoff; the daily run is not keeping up')
        } else {
          Write-Output ('VERIFY WARN: ' + $adLine + ' - more than ' + $ad.max_remain + ' log files are past the cutoff, the daily run is not keeping up')
        }
      } else {
        Write-Output ('VERIFY HEALTH: ' + $adLine)
      }
    }
  } else {
    Write-Output 'VERIFY WARN: log-archive-duty.ps1 did not provide Invoke-LogArchiveDuty'
  }
}

# ---------- 2f. R2 ambient baseline (main#63, r725) ----------
# r722 fixed the street frame's black right wall by giving the scene a Trilight
# ambient plus a probe refresh, but that only runs inside the three build entries
# (CityRebuildR2.NormalizeAmbient()). A scene opened or imported anywhere else
# keeps ambientMode=Skybox with a probe that was never generated - zero indirect
# light on back-lit surfaces, invisible until a shot comes back black.
# The parse and its red line live in ONE module (Tools\devloop\ambient-verdict.ps1)
# so the tick cannot drift from any other reader of the same scene.
# WARN, not FAIL - same stance as 2b/2c/2d/2e: an observation, not a broken city.
# Missing scene / unreadable head is a WARN too. No 'FAIL' token in these messages
# (the tick red-scan keys on that word).
$ambMod = Join-Path $repoRoot 'Tools\devloop\ambient-verdict.ps1'
if (-not (Test-Path -LiteralPath $ambMod)) {
  Write-Output 'VERIFY WARN: ambient: ambient-verdict.ps1 missing - ambient baseline not read'
} else {
  $ambLoaded = $true
  try { . $ambMod } catch { $ambLoaded = $false }
  if ($ambLoaded -and (Get-Command Get-AmbientVerdict -ErrorAction SilentlyContinue)) {
    $ambArgs = @{ Root = $repoRoot }
    if ($env:FLUXVERSE_AMBIENT_SCENE) { $ambArgs['Scene'] = $env:FLUXVERSE_AMBIENT_SCENE }
    $amb = $null
    try { $amb = Get-AmbientVerdict @ambArgs } catch { $amb = $null }
    if ($null -eq $amb) {
      Write-Output 'VERIFY WARN: ambient: verdict module threw - ambient baseline not read this tick'
    } else {
      $ambLine = Format-AmbientLine $amb
      if (-not $amb.ran) {
        Write-Output ('VERIFY WARN: ' + $ambLine + ' - could not read the R2 scene ambient block; scene or its RenderSettings moved?')
      } elseif (Test-AmbientHealthy $amb) {
        Write-Output ('VERIFY HEALTH: ' + $ambLine)
      } else {
        Write-Output ('VERIFY WARN: ' + $ambLine + ' - ' + $amb.reason + '; run CityRebuildR2 (NormalizeAmbient) after opening the scene')
      }
    }
  } else {
    Write-Output 'VERIFY WARN: ambient-verdict.ps1 did not provide Get-AmbientVerdict'
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
