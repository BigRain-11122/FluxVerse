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
# World dir is injectable so the gate ITSELF can be proven end to end
# (queue main#95): FLUXVERSE_WORLD_DIR lets a sandbox run this whole file
# against a temp directory and watch "PASS publishes the candidate / FAIL
# discards it", instead of trusting only the state-promote module in isolation.
# Unset = the live world/ directory, i.e. previous behaviour byte for byte.
# Read-only knob: it selects WHERE this run reads and writes world state; it
# never changes what the gate decides.
$worldDir  = $env:FLUXVERSE_WORLD_DIR
if ([string]::IsNullOrWhiteSpace($worldDir)) { $worldDir = Join-Path $repoRoot 'world' }
$registryFile = Join-Path $repoRoot 'schema\events-registry.json'
$stateFile  = Join-Path $worldDir 'world-state.json'
$newStateFile = Join-Path $worldDir 'world-state.json.new'
$eventsFile = Join-Path $worldDir 'world-events.jsonl'
$quarFile   = Join-Path $worldDir 'world-events.quarantine.jsonl'
$verifyState = Join-Path $worldDir 'verify-state.txt'
$utf8 = New-Object System.Text.UTF8Encoding($false)
$fail = @()
$healed = 0

# ---------- cost ledger (queue main#104, r768) ----------
# This gate runs on every tick, and its cached round has a 3 s budget that
# test-verify-ps-suites case b3 asserts. Measured r768 on an idle-ish machine:
# 2205 / 2292 / 2371 / 2467 / 2746 / 2762 / 3119 ms - i.e. the budget is not
# comfortable, it is a coin flip, and one sample already crossed the assertion
# line. The reason that was alarming rather than actionable is that nobody could
# say WHERE the time went: only the ps-suites families print their own cost
# because they are expected to be expensive, and everything else (shot census
# over 235 images, the r2-site python call, the queue scan) was a single opaque
# residue. A budget you cannot decompose cannot be defended, only raised - and
# main#104 forbids raising it. So each section marks the stopwatch when it hands
# over, and the run prints one `VERIFY COST:` line with the whole decomposition.
# Observation only: nothing is judged here, and the line deliberately does not
# start with "VERIFY HEALTH:"/"VERIFY WARN:" so the per-section assertions stay
# exactly as they were.
$costSw = New-Object System.Diagnostics.Stopwatch
$costSw.Start()
$costLast = 0
$costParts = New-Object System.Collections.ArrayList
function Set-CostMark([string]$Name) {
  $now = $costSw.ElapsedMilliseconds
  [void]$costParts.Add([pscustomobject]@{ Name = $Name; Ms = [int]($now - $script:costLast) })
  $script:costLast = $now
}

# Two-phase promotion lives in one module so a sandbox can drive every branch
# (queue main#93). Missing module = the gate cannot keep its promise on FAIL.
$statePromoteMod = Join-Path $repoRoot 'Tools\devloop\state-promote.ps1'
if (-not (Test-Path -LiteralPath $statePromoteMod)) {
  Write-Output ('VERIFY FAIL: state-promote module missing: ' + $statePromoteMod)
  exit 1
}
. $statePromoteMod

Set-CostMark 'boot'

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

Set-CostMark 'state'

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

Set-CostMark 'registry'

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

Set-CostMark 'probe-census'

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
    # main#107 (r769): the census is content-addressed, not re-read. On a cached
    # tick nothing changes in qa/, so opening 235 image headers to learn the same
    # numbers cost 68% of the whole round (r768 cost ledger) - and main#104
    # forbids paying for that by raising the 3 s gate budget. The cache key is
    # the verdict's own input (name/length/mtime of every image + this module's
    # identity), so any added/changed/removed frame, or any threshold edit,
    # invalidates it and the next tick recomputes with byte-identical readings.
    # Cache file is gitignored (logs/) and unwritable-tree safe: a failed write
    # only means the next tick pays full price again, never a wrong verdict.
    $shotCachePath = Join-Path $repoRoot 'logs\.city-shot-census-cache.json'
    if ($env:FLUXVERSE_SHOT_CACHE) { $shotCachePath = $env:FLUXVERSE_SHOT_CACHE }
    $shotRows = @()
    $shotCached = $false
    $shotReason = ''
    if (Get-Command Get-CityShotAuditCached -ErrorAction SilentlyContinue) {
      $shotRes = $null
      try { $shotRes = Get-CityShotAuditCached -Dir $shotDir -CachePath $shotCachePath -ModulePath $shotModule } catch { $shotRes = $null }
      if ($shotRes) { $shotRows = @($shotRes.rows); $shotCached = [bool]$shotRes.cached; $shotReason = [string]$shotRes.reason }
      else { $shotRows = @(Get-CityShotAudit -Dir $shotDir) }
    } else {
      $shotRows = @(Get-CityShotAudit -Dir $shotDir)
    }
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
              ' unreadable=' + $badRows.Count + ' unregistered=' + $unregRows.Count +
              ' cached=' + ([int]$shotCached)
      # main#108 (r770): a miss says why. A key hit and a genuine first run stay
      # bare - there is nothing to explain, and a head word on every tick would
      # turn a real signal into noise.
      if ((-not $shotCached) -and -not [string]::IsNullOrWhiteSpace($shotReason)) {
        $line = $line + '(' + $shotReason + ')'
      }
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

Set-CostMark 'shot-census'

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
      # main#79: the scale study's A2 advice (r723) had no face outside its own
      # markdown; it rides this line as advisory tokens, never a red line.
      $scale = Get-ScaleStudy -Root $repoRoot
      $siteLine = 'r2-site: block_water=' + $sv.block_water_text + '% dry_candidates=' + $sv.dry_candidates_text + ' props_in_road=' + $sv.props_in_road_text + ' prop_cover=' + $pose.prop_cover_text + ' ' + (Format-ScaleTokens -Scale $scale)
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

Set-CostMark 'r2-site'

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

Set-CostMark 'archive'

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

Set-CostMark 'ambient'

# ---------- 2g. queue due-marker census (main#87) ----------
# r745 put the overdue count on the page and r747 made a badly written `due`
# marker visible instead of silently reading as "no deadline" - but both only
# ever reached the page, so the tick, the one thing that runs every ten
# minutes, could not see a queue full of broken markers. This republishes the
# same counter from Tools\devloop\queue-due.ps1 (one copy of the rules, no
# second threshold to drift).
# WARN, not FAIL - same stance as 2b..2f: an observation, not a broken city.
# A missing queue directory is a WARN too, and says "unknown", never zero.
# No 'FAIL' token in these messages (the tick red-scan keys on that word).
$qdueMod = Join-Path $repoRoot 'Tools\devloop\queue-due.ps1'
if (-not (Test-Path -LiteralPath $qdueMod)) {
  Write-Output 'VERIFY WARN: qdue: queue-due.ps1 missing - queue marker census skipped'
} else {
  $qLoaded = $true
  try { . $qdueMod } catch { $qLoaded = $false }
  if ($qLoaded -and (Get-Command Get-QueueDue -ErrorAction SilentlyContinue)) {
    $qdir = Join-Path $repoRoot 'state\queue'
    if ($env:FLUXVERSE_QUEUE_DIR) { $qdir = $env:FLUXVERSE_QUEUE_DIR }
    $qd = $null
    try { $qd = Get-QueueDue -Dir $qdir -RepoRoot $repoRoot } catch { $qd = $null }
    if ($null -eq $qd) {
      Write-Output 'VERIFY WARN: qdue: queue-due.ps1 threw - queue marker census skipped this tick'
    } elseif (-not $qd.exists) {
      Write-Output ('VERIFY WARN: qdue: queue dir not readable (' + $qdir + ') - open/late/bad unknown, not zero')
    } else {
      $qLine = 'qdue: open=' + $qd.open + ' dated=' + $qd.dated + ' late=' + $qd.late + ' max=' + $qd.max_days + 'd bad=' + $qd.bad + ' code=' + $qd.code + ' long=' + $qd.long + ' longmax=' + $qd.long_max + ' dupe=' + $qd.dupe + ' duperows=' + $qd.dupe_rows
      # Duplicate ids (main#112): ids are numbered by hand, so a collision is
      # invisible until both rows are read - and "the #N row already shipped"
      # then vouches for the open row that shares the number. This is a third
      # account (not bad, not long) and it stays a READOUT: a queue whose only
      # defect is a duplicate id keeps its HEALTH line, the hint just says where.
      $qDupeHint = ''
      if ($qd.dupe -gt 0) {
        $qDupeIds = @($qd.dupe_items | ForEach-Object { '#' + $_.id + '@' + $_.file + ':' + $_.line })
        $qDupeHint = '; duplicate queue ids in the same file (numbering debt, "shipped" does not vouch for the other row): ' + ($qDupeIds -join ', ')
      }
      # Row width (main#110): a row longer than the module's cap is structural
      # debt ("one row is one item"), NOT a mis-written marker - it never joins
      # the bad account. The suffix is printed whenever it exists, so an overdue
      # or badly-written row cannot hide it, and it never turns the gate red.
      $qLongHint = ''
      if ($qd.long -gt 0) {
        $qLongIds = @($qd.long_items | ForEach-Object { '#' + $_.id + ' ' + $_.chars })
        $qLongHint = '; overlong queue rows (' + $qd.long_limit + ' char cap, one row is one item): ' + ($qLongIds -join ', ')
      }
      if ($qd.bad -gt 0) {
        $qBad = @($qd.bad_items | ForEach-Object { '#' + $_.id + '(' + $_.token + ' ' + $_.reason + ')' })
        $qHint = '; the remark cell wants due=YYYY-MM-DD'
        if (@($qd.bad_items | Where-Object { $_.reason -eq 'row' }).Count -gt 0) {
          $qHint = $qHint + '; a row missing its trailing | mis-shifts which cell is last'
        }
        Write-Output ('VERIFY WARN: ' + $qLine + ' - badly written due markers: ' + ($qBad -join ', ') + $qHint + $qLongHint + $qDupeHint)
      } elseif ($qd.late -gt 0) {
        $qLate = @($qd.items | ForEach-Object { '#' + $_.id + ' ' + $_.days + 'd' })
        Write-Output ('VERIFY WARN: ' + $qLine + ' - overdue queue rows: ' + ($qLate -join ', ') + $qLongHint + $qDupeHint)
      } elseif ($qd.long -gt 0) {
        Write-Output ('VERIFY WARN: ' + $qLine + $qLongHint + $qDupeHint)
      } else {
        Write-Output ('VERIFY HEALTH: ' + $qLine + $qDupeHint)
      }
    }
  } else {
    Write-Output 'VERIFY WARN: queue-due.ps1 did not provide Get-QueueDue'
  }
}

Set-CostMark 'qdue'

# ---------- 2h/2i. sandbox families actually run (main#88 r750, main#94 r752) ----------
# r748 built one entry for the PowerShell sandboxes (run-ps-suites.ps1), r750
# armed the write-side family, r751 gave the verify-side family its own -Verify
# list - and r752 connects the two to the tick without paying for both at once.
# Content-addressed: an unchanged source set costs one hash and no child
# process, a changed set runs the runner once as a child (suites end with
# `exit N`, so they can never run in-process). Each family keeps its own
# fingerprint and its own ticket (logs\.ps-suites-last.json vs
# logs\.ps-suites-verify-last.json), so a write-side red cannot overwrite a
# verify-side verdict and vice versa.
# WALL CLOCK: write ~19 s, verify ~70 s, verify2 ~51 s. One round must not pay
# two of them, so each verify-side family asks `-CheckOnly` first and defers to
# the next tick when something already really ran this round. Deferral costs at
# most one 5-minute tick and is printed, never silent.
# main#99 split the old nine-suite verify family (121.6 s = 68% of the 180 s cap,
# past the 2/3 budget line) into verify (eight light suites) and verify2 (the one
# ~51 s sandbox that boots this gate). The heavy one takes its turn only on a
# tick where neither the write family nor the light verify family ran.
# NESTED: a sandbox that runs this gate in process must not spawn another
# family run, so the runner's children carry FLUXVERSE_PS_SUITES_CHILD=1.
# WARN, not FAIL - same stance as 2b..2g: an observation, not a broken city.
# No 'FAIL' token in these messages (the tick red-scan keys on that word).
$psWriteRan = $false
$psWriteMs = 0
# main#117: the write side is two families now (state writer / face + census),
# so the deferral ladder needs to know about the second one too.
$psWrite2Ran = $false
$psWrite2Ms = 0
$psVerifyRan = $false
$psVerifyMs = 0

function Write-PsSuitesVerdict {
  param([string]$Label, $Res, [string]$Rerun)
  if ($null -eq $Res) {
    Write-Output ('VERIFY WARN: ' + $Label + ': ps-suites-tick.ps1 threw - sandboxes not measured this tick')
    return
  }
  $line = Format-PsSuitesLine $Res
  $line = $line -replace '^ps-suites:', ($Label + ':')
  if (Test-PsSuitesHealthy $Res) {
    # A passing family can still be eating most of the tick budget (main#96):
    # say so, and say what to do about it, before the first timeout says it.
    if ($Res.budget_over -eq $true) {
      $capNs = Get-PsSuitesFamilyTimeout -Family ([string]$Res.family)
      Write-Output ('VERIFY WARN: ' + $line + ' - family baseline over 2/3 of the ' + $capNs + 's cap; split the family or run it every other tick')
    } else {
      Write-Output ('VERIFY HEALTH: ' + $line)
    }
  } elseif ($Res.status -eq 'timeout') {
    Write-Output ('VERIFY WARN: ' + $line + ' - ' + $Res.note + '; re-run: ' + $Rerun)
  } elseif ($Res.status -eq 'missing' -or $Res.status -eq 'unreadable') {
    Write-Output ('VERIFY WARN: ' + $line + ' - ' + $Res.note)
  } else {
    Write-Output ('VERIFY WARN: ' + $line + ' - sandbox red; re-run: ' + $Rerun)
  }
}

if ($env:FLUXVERSE_PS_SUITES_CHILD -eq '1') {
  Write-Output 'VERIFY HEALTH: ps-suites: skipped (nested sandbox run)'
  Write-Output 'VERIFY HEALTH: ps-suites-write2: skipped (nested sandbox run)'
  Write-Output 'VERIFY HEALTH: ps-suites-verify: skipped (nested sandbox run)'
  Write-Output 'VERIFY HEALTH: ps-suites-verify2: skipped (nested sandbox run)'
} else {
  $psMod = Join-Path $repoRoot 'Tools\devloop\ps-suites-tick.ps1'
  if (-not (Test-Path -LiteralPath $psMod)) {
    Write-Output 'VERIFY WARN: ps-suites: ps-suites-tick.ps1 missing - write-side sandboxes not run this tick'
    Write-Output 'VERIFY WARN: ps-suites-write2: ps-suites-tick.ps1 missing - face-side sandboxes not run this tick'
    Write-Output 'VERIFY WARN: ps-suites-verify: ps-suites-tick.ps1 missing - verify-side sandboxes not run this tick'
    Write-Output 'VERIFY WARN: ps-suites-verify2: ps-suites-tick.ps1 missing - heavy verify sandbox not run this tick'
  } else {
    $psLoaded = $true
    try { . $psMod } catch { $psLoaded = $false }
    if ($psLoaded -and (Get-Command Invoke-PsSuitesTick -ErrorAction SilentlyContinue)) {
      # ---- 2h. write-side family ----
      if ($env:FLUXVERSE_PS_SUITES -eq 'off') {
        Write-Output 'VERIFY HEALTH: ps-suites: disabled by FLUXVERSE_PS_SUITES=off'
      } else {
        $psArgs = @{ RepoDir = $repoRoot; Family = 'write' }
        if ($env:FLUXVERSE_PS_SUITES_RUNNER) { $psArgs['RunnerPath'] = $env:FLUXVERSE_PS_SUITES_RUNNER }
        if ($env:FLUXVERSE_PS_SUITES_TICKET) { $psArgs['TicketPath'] = $env:FLUXVERSE_PS_SUITES_TICKET }
        if ($env:FLUXVERSE_PS_SUITES_TIMEOUT) {
          $psTo = 0
          if ([int]::TryParse($env:FLUXVERSE_PS_SUITES_TIMEOUT, [ref]$psTo) -and $psTo -gt 0) { $psArgs['TimeoutSec'] = $psTo }
        }
        if ($env:FLUXVERSE_PS_SUITES_FORCE -eq '1') { $psArgs['Force'] = $true }
        $psRes = $null
        try { $psRes = Invoke-PsSuitesTick @psArgs } catch { $psRes = $null }
        if ($null -ne $psRes -and $psRes.ran) { $psWriteRan = $true; $psWriteMs = [int]$psRes.ms }
        Write-PsSuitesVerdict -Label 'ps-suites' -Res $psRes -Rerun 'Tools\devloop\run-ps-suites.ps1'
      }

      # ---- 2h2. face + census half of the write side (main#117) ----
      # The seven-suite write family measured 32.0 s = 71% of its 45 s cap, so
      # every tick printed a budget WARN. Timed one at a time the seven were
      # 3.4/3.6/4.0/4.3/3.7/3.2/7.2 s - no single hog, just seven PowerShell
      # starts - so the split is by what each suite guards. This half (face
      # writer + the two census tools) measured 17.8 s, the state-writer half
      # 11.6 s. Same turn rule as the verify side: ask -CheckOnly first, defer
      # when something already really ran this round, so no tick pays two.
      if ($env:FLUXVERSE_PS_SUITES_WRITE2 -eq 'off') {
        Write-Output 'VERIFY HEALTH: ps-suites-write2: disabled by FLUXVERSE_PS_SUITES_WRITE2=off'
      } else {
        $w2Args = @{ RepoDir = $repoRoot; Family = 'write2' }
        if ($env:FLUXVERSE_PS_SUITES_WRITE2_RUNNER) { $w2Args['RunnerPath'] = $env:FLUXVERSE_PS_SUITES_WRITE2_RUNNER }
        if ($env:FLUXVERSE_PS_SUITES_WRITE2_TICKET) { $w2Args['TicketPath'] = $env:FLUXVERSE_PS_SUITES_WRITE2_TICKET }
        if ($env:FLUXVERSE_PS_SUITES_WRITE2_TIMEOUT) {
          $w2To = 0
          if ([int]::TryParse($env:FLUXVERSE_PS_SUITES_WRITE2_TIMEOUT, [ref]$w2To) -and $w2To -gt 0) { $w2Args['TimeoutSec'] = $w2To }
        }
        if ($env:FLUXVERSE_PS_SUITES_WRITE2_FORCE -eq '1') { $w2Args['Force'] = $true }
        $w2Chk = $null
        try { $w2Chk = Invoke-PsSuitesTick @w2Args -CheckOnly } catch { $w2Chk = $null }
        if ($null -eq $w2Chk) {
          Write-Output 'VERIFY WARN: ps-suites-write2: ps-suites-tick.ps1 threw - face-side sandboxes not measured this tick'
        } elseif (-not $w2Chk.needs_run) {
          $w2Res = $null
          try { $w2Res = Invoke-PsSuitesTick @w2Args } catch { $w2Res = $null }
          Write-PsSuitesVerdict -Label 'ps-suites-write2' -Res $w2Res -Rerun 'Tools\devloop\run-ps-suites.ps1 -Suites Tools\devloop\test-write-status-face-bare.ps1,logs\devloop-r247-facewriter-test.ps1,Tools\devloop\test-nolivecheck-census.ps1,Tools\devloop\test-qa-rotation.ps1'
        } elseif ($psWriteRan) {
          $deferW2 = 'VERIFY HEALTH: ps-suites-write2: deferred (write-side ran ' + $psWriteMs + 'ms this tick) sha=' + $w2Chk.sha
          if ([int]$w2Chk.base_ms -gt 0) { $deferW2 = $deferW2 + ' base=' + [int]$w2Chk.base_ms + 'ms' }
          Write-Output $deferW2
        } else {
          $w2Res = $null
          try { $w2Res = Invoke-PsSuitesTick @w2Args } catch { $w2Res = $null }
          if ($null -ne $w2Res -and $w2Res.ran) { $psWrite2Ran = $true; $psWrite2Ms = [int]$w2Res.ms }
          Write-PsSuitesVerdict -Label 'ps-suites-write2' -Res $w2Res -Rerun 'Tools\devloop\run-ps-suites.ps1 -Suites Tools\devloop\test-write-status-face-bare.ps1,logs\devloop-r247-facewriter-test.ps1,Tools\devloop\test-nolivecheck-census.ps1,Tools\devloop\test-qa-rotation.ps1'
        }
      }

      # ---- 2i. verify-side family (same rules, own ticket, one heavy run per tick) ----
      if ($env:FLUXVERSE_PS_SUITES_VERIFY -eq 'off') {
        Write-Output 'VERIFY HEALTH: ps-suites-verify: disabled by FLUXVERSE_PS_SUITES_VERIFY=off'
      } else {
        $vArgs = @{ RepoDir = $repoRoot; Family = 'verify' }
        if ($env:FLUXVERSE_PS_SUITES_VERIFY_RUNNER) { $vArgs['RunnerPath'] = $env:FLUXVERSE_PS_SUITES_VERIFY_RUNNER }
        if ($env:FLUXVERSE_PS_SUITES_VERIFY_TICKET) { $vArgs['TicketPath'] = $env:FLUXVERSE_PS_SUITES_VERIFY_TICKET }
        if ($env:FLUXVERSE_PS_SUITES_VERIFY_TIMEOUT) {
          $vTo = 0
          if ([int]::TryParse($env:FLUXVERSE_PS_SUITES_VERIFY_TIMEOUT, [ref]$vTo) -and $vTo -gt 0) { $vArgs['TimeoutSec'] = $vTo }
        }
        if ($env:FLUXVERSE_PS_SUITES_VERIFY_FORCE -eq '1') { $vArgs['Force'] = $true }
        $vChk = $null
        try { $vChk = Invoke-PsSuitesTick @vArgs -CheckOnly } catch { $vChk = $null }
        if ($null -eq $vChk) {
          Write-Output 'VERIFY WARN: ps-suites-verify: ps-suites-tick.ps1 threw - verify-side sandboxes not measured this tick'
        } elseif (-not $vChk.needs_run) {
          $vRes = $null
          try { $vRes = Invoke-PsSuitesTick @vArgs } catch { $vRes = $null }
          if ($null -ne $vRes -and $vRes.ran) { $psVerifyRan = $true; $psVerifyMs = [int]$vRes.ms }
          Write-PsSuitesVerdict -Label 'ps-suites-verify' -Res $vRes -Rerun 'Tools\devloop\run-ps-suites.ps1 -Verify'
        } elseif ($psWriteRan -or $psWrite2Ran) {
          $why = 'write-side ran ' + $psWriteMs + 'ms'
          if (-not $psWriteRan) { $why = 'face-side ran ' + $psWrite2Ms + 'ms' }
          $deferLine = 'VERIFY HEALTH: ps-suites-verify: deferred (' + $why + ' this tick) sha=' + $vChk.sha
          if ([int]$vChk.base_ms -gt 0) { $deferLine = $deferLine + ' base=' + [int]$vChk.base_ms + 'ms' }
          Write-Output $deferLine
        } else {
          $vRes = $null
          try { $vRes = Invoke-PsSuitesTick @vArgs } catch { $vRes = $null }
          if ($null -ne $vRes -and $vRes.ran) { $psVerifyRan = $true; $psVerifyMs = [int]$vRes.ms }
          Write-PsSuitesVerdict -Label 'ps-suites-verify' -Res $vRes -Rerun 'Tools\devloop\run-ps-suites.ps1 -Verify'
        }
      }

      # ---- 2j. heavy verify sandbox (main#99: own family, own turn) ----
      # test-verify-ps-suites.ps1 boots this whole gate and measured ~51 s; the
      # eight light verify suites ~70 s. Sharing one family made a single round
      # pay 121.6 s (68% of the cap) and every edit to this module bought it.
      if ($env:FLUXVERSE_PS_SUITES_VERIFY2 -eq 'off') {
        Write-Output 'VERIFY HEALTH: ps-suites-verify2: disabled by FLUXVERSE_PS_SUITES_VERIFY2=off'
      } else {
        $v2Args = @{ RepoDir = $repoRoot; Family = 'verify2' }
        if ($env:FLUXVERSE_PS_SUITES_VERIFY2_RUNNER) { $v2Args['RunnerPath'] = $env:FLUXVERSE_PS_SUITES_VERIFY2_RUNNER }
        if ($env:FLUXVERSE_PS_SUITES_VERIFY2_TICKET) { $v2Args['TicketPath'] = $env:FLUXVERSE_PS_SUITES_VERIFY2_TICKET }
        if ($env:FLUXVERSE_PS_SUITES_VERIFY2_TIMEOUT) {
          $v2To = 0
          if ([int]::TryParse($env:FLUXVERSE_PS_SUITES_VERIFY2_TIMEOUT, [ref]$v2To) -and $v2To -gt 0) { $v2Args['TimeoutSec'] = $v2To }
        }
        if ($env:FLUXVERSE_PS_SUITES_VERIFY2_FORCE -eq '1') { $v2Args['Force'] = $true }
        $v2Chk = $null
        try { $v2Chk = Invoke-PsSuitesTick @v2Args -CheckOnly } catch { $v2Chk = $null }
        if ($null -eq $v2Chk) {
          Write-Output 'VERIFY WARN: ps-suites-verify2: ps-suites-tick.ps1 threw - heavy verify sandbox not measured this tick'
        } elseif (-not $v2Chk.needs_run) {
          $v2Res = $null
          try { $v2Res = Invoke-PsSuitesTick @v2Args } catch { $v2Res = $null }
          Write-PsSuitesVerdict -Label 'ps-suites-verify2' -Res $v2Res -Rerun 'Tools\devloop\run-ps-suites.ps1 -Suites Tools\devloop\test-verify-ps-suites.ps1'
        } elseif ($psWriteRan -or $psWrite2Ran -or $psVerifyRan) {
          $why = 'write-side ran ' + $psWriteMs + 'ms'
          if (-not $psWriteRan) {
            if ($psWrite2Ran) { $why = 'face-side ran ' + $psWrite2Ms + 'ms' }
            else { $why = 'verify-side ran ' + $psVerifyMs + 'ms' }
          }
          $deferLine2 = 'VERIFY HEALTH: ps-suites-verify2: deferred (' + $why + ' this tick) sha=' + $v2Chk.sha
          if ([int]$v2Chk.base_ms -gt 0) { $deferLine2 = $deferLine2 + ' base=' + [int]$v2Chk.base_ms + 'ms' }
          Write-Output $deferLine2
        } else {
          $v2Res = $null
          try { $v2Res = Invoke-PsSuitesTick @v2Args } catch { $v2Res = $null }
          Write-PsSuitesVerdict -Label 'ps-suites-verify2' -Res $v2Res -Rerun 'Tools\devloop\run-ps-suites.ps1 -Suites Tools\devloop\test-verify-ps-suites.ps1'
        }
      }
    } else {
      Write-Output 'VERIFY WARN: ps-suites-tick.ps1 did not provide Invoke-PsSuitesTick'
    }
  }
}

Set-CostMark 'families'

# ---------- 2k. no-live-check census (main#77, r765) ----------
# write-fastpath-state.ps1 v1.2 refuses to write a 12-hex value it cannot verify
# against the live file, because a wrong value there either fires a fake
# FULL-ROUND forever or (worse) matches by accident and silences a real change.
# The only thing that can skip that check is a drill switch the writer keeps for
# its sandboxes. Until r765 the barrier between that switch and the production
# wrap-up chain was a header comment; now the census scans every script in the
# tree and names any file outside the whitelist that spells it.
# WARN, not FAIL - same stance as 2b..2j: an observation, not a broken city.
$nlcScript = Join-Path $repoRoot 'Tools\devloop\nolivecheck-census.ps1'
if (Test-Path -LiteralPath $nlcScript) {
  $nlcLines = @()
  try { $nlcLines = @(& $nlcScript 2>&1 | ForEach-Object { [string]$_ }) } catch { $nlcLines = @() }
  $nlcSum = @($nlcLines | Where-Object { $_ -like 'nolivecheck-census:*' }) | Select-Object -First 1
  if ($nlcSum) {
    $mNlcFiles = [regex]::Match($nlcSum, 'files=(\d+)')
    $mNlcHits = [regex]::Match($nlcSum, 'hits=(\d+)')
    $mNlcUnexp = [regex]::Match($nlcSum, 'unexpected=(\d+)')
    $mNlcStale = [regex]::Match($nlcSum, 'stale=(\d+)')
    $mNlcMs = [regex]::Match($nlcSum, 'ms=(\d+)')
    $mNlcBudget = [regex]::Match($nlcSum, 'budget=(\d+)')
    $nlcLine = 'nolivecheck-census: files=' + $mNlcFiles.Groups[1].Value + ' hits=' + $mNlcHits.Groups[1].Value +
               ' unexpected=' + $mNlcUnexp.Groups[1].Value + ' stale=' + $mNlcStale.Groups[1].Value
    if ($mNlcMs.Success) { $nlcLine = $nlcLine + ' ms=' + $mNlcMs.Groups[1].Value }
    if ($mNlcBudget.Success) { $nlcLine = $nlcLine + ' budget=' + $mNlcBudget.Groups[1].Value }
    $nlcOver = $false
    if ($mNlcMs.Success -and $mNlcBudget.Success) {
      $nlcOver = ([int]$mNlcMs.Groups[1].Value -gt [int]$mNlcBudget.Groups[1].Value)
    }
    if ($mNlcUnexp.Success -and [int]$mNlcUnexp.Groups[1].Value -gt 0) {
      Write-Output ('VERIFY WARN: ' + $nlcLine + ' - a script outside the whitelist names the state-writer drill switch; that switch skips the live-hash comparison, so keep it out of any production chain')
      foreach ($u in @($nlcLines | Where-Object { $_ -match '^\s{2}\S+\.(ps1|cmd|bat|vbs):\d+\s' })) {
        Write-Output ('VERIFY WARN: nlc ' + $u.Trim())
      }
    } elseif ($nlcOver) {
      # main#104: the census cost is a slice of this tick's own budget, so it
      # gets its own line before the gate as a whole goes red with no culprit.
      Write-Output ('VERIFY WARN: ' + $nlcLine + ' - census cost is over its own budget; it runs every tick, so move it out of the per-tick section (ride check-fastpath.ps1) or shrink the scan rather than raising the gate budget')
    } else {
      Write-Output ('VERIFY HEALTH: ' + $nlcLine)
    }
  } else {
    Write-Output 'VERIFY WARN: nolivecheck-census produced no summary line'
  }
}

# The decomposition, printed once, right before the verdict (queue main#104).
# Sum of the parts is the measured round; the tail between the last mark and
# here is added as 'rest' so the numbers reconcile with wall clock instead of
# quietly leaving a gap that nobody can explain later.
$costTail = [int]($costSw.ElapsedMilliseconds - $costLast)
[void]$costParts.Add([pscustomobject]@{ Name = 'rest'; Ms = $costTail })
$costTotal = 0
foreach ($cp in $costParts) { $costTotal += [int]$cp.Ms }
$costText = (@($costParts | ForEach-Object { $_.Name + '=' + $_.Ms + 'ms' }) -join ' ')
Write-Output ('VERIFY COST: total=' + $costTotal + 'ms ' + $costText)

# ---------- verdict ----------
if ($fail.Count -gt 0) {
  $fail | ForEach-Object { Write-Output ('VERIFY FAIL: ' + $_) }
  if ($promote) {
    [void](Clear-StateCandidate -NewPath $newStateFile)
    Write-Output 'VERIFY FAIL: .new state discarded, old world-state.json kept'
  }
  exit 1
}
# Promote the candidate state. The decision itself lives in
# Tools/devloop/state-promote.ps1 (queue main#93) so a sandbox can prove every
# branch: promoted / lost-race (source already published by the other
# instance) / failed (source survived a failed move = stay loud) / no-candidate.
if ($promote) {
  $spRes = Invoke-StatePromotion -NewPath $newStateFile -StatePath $stateFile
  if ($spRes.Status -eq 'failed') {
    Write-Output ('VERIFY FAIL: state promote failed, candidate kept: ' + $spRes.Detail)
    exit 1
  }
}
if ($healed -gt 0) {
  Write-Output ('VERIFY PASS (healed ' + $healed + ' bad event line(s) -> quarantine)')
} else {
  Write-Output 'VERIFY PASS'
}
exit 0
