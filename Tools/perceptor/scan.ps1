# FluxVerse perceptor v0.6 - probe architecture + WRITE-SIDE gate + derived status
# v0.6 2026-09-23 (r7, group audit P-14): quarantine 7-day lifecycle (retention.md
#   R4, garbage class) - a file untouched for 7+ days is cleared whole; otherwise
#   rows with a parseable ts_utc older than 7d are dropped. Fail-keep: a row we
#   cannot age is never silently destroyed (forensic bias).
# v0.5 2026-09-23 (r6, group audit P-11): single-writer lock (tick S1 pattern
#   plus PID liveness) - the OS tick and a devloop round both call scan; the
#   17:37/17:42 window proved two scans can race the same stream. A live lock
#   (<15 min, owner PID alive) makes the late caller skip; a dead owner PID or
#   a corrupt/overage lock is taken over at once (fail-open, never deadlocks).
# v0.4 2026-09-23 (r3): daily rotation of the live event stream - yesterday's file
#   is archived whole as world/world-events-<YYYYMMDD>.jsonl (chronicle stays on
#   disk for engine L2 replay); the live stream only ever holds today's events.
#   verify.ps1 cursor self-check detects the shrink and rebases events_verified.
# v0.6.1 2026-09-24 (r62, group transfer P-43 P0): chronicle backup - the daily
#   rotation now git-stages the archive right where it happens (targeted add,
#   fail-soft; .gitignore whitelist-inverts so world-events-*.jsonl archives
#   are tracked while the live stream / state / cursors stay ignored). The
#   archive is the tower-base chronicle: commit/push = cloud backup.
# v0.7 2026-09-24 (r65, group transfer P-43 case 2): fleet inbox ingest - probes/
#   inbox.ps1 read-only consolidates multi-machine spontaneous events from each
#   repo's inbox/ batch files through the same registry gate. Add-WorldEvent
#   gains an optional event ts so an emitter's own timestamp survives (scan
#   stamps now when the line carries none). Day-1 observe window: while the
#   tracked flag Tools/perceptor/inbox-live.flag is absent the probe only
#   counts (no stream writes, no cursor stamps); a later round commits the
#   flag to go live. The cursor key inbox:<repo>/<file> is the consumption
#   ledger - the brief's move-to-processed step is left to emitter-side hygiene
#   on purpose: a scan-side move writes the sibling repo and dirties its tree
#   (ledger P-2026-09-23-09 pull-lane disease).
# Consolidated 2026-09-23 (CEO audit fix F1/F2/F3/S2, dual-session merge - single executor):
#   - F1: unregistered/malformed events are QUARANTINED at write time
#     (world-events.quarantine.jsonl, forensic trail kept), never into the live stream;
#     state goes to world-state.json.new - verify.ps1 promotes on PASS only.
#   - F2: probes per surface (orders_hq / orders_bs / fleet_minigame / ...).
#   - F3: product & zone status DERIVED from live repo activity (no hardcode).
#   - S2: every event field JSON-escaped via ConvertTo-Json -Compress.
# ASCII-only (encoding law). All scans READ-ONLY.
# Usage: powershell -ExecutionPolicy Bypass -File scan.ps1

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot '..\..')   # -> gaming/FluxVerse
$root = Resolve-Path (Join-Path $PSScriptRoot '..\..\..\..') # -> FluxGroup root
$worldDir = Join-Path $repoRoot 'world'
if (-not (Test-Path $worldDir)) { New-Item -ItemType Directory -Path $worldDir | Out-Null }
$cursorFile = Join-Path $worldDir 'perceptor-state.txt'
$eventsFile = Join-Path $worldDir 'world-events.jsonl'
$quarFile   = Join-Path $worldDir 'world-events.quarantine.jsonl'
$outFile    = Join-Path $worldDir 'world-state.json'        # promoted by verify.ps1
$newFile    = Join-Path $worldDir 'world-state.json.new'    # scan target (pre-gate)
$registryFile = Join-Path $repoRoot 'schema\events-registry.json'

# ---------- single-writer lock (P-11 + r65 atomic acquire): one scan at a time
# owns the stream. The v0.5 check-then-act (Test-Path then Set-Content) let two
# same-second launches BOTH pass the check and race the round (r65 AC-A live
# proof: both scans ran, one lost its .new write; 185 exact duplicate rows had
# already accumulated in the stream from earlier windows). CreateNew is the
# atomic gate: the kernel allows exactly one creator per path. Loser re-checks
# liveness and skips. PID + age semantics preserved: live owner <15min -> skip;
# dead PID -> instant takeover; live but >15min hung -> overage takeover (no
# handle is kept on the lock, so the unlink always succeeds). LAW: the owner
# handle is CLOSED right after the PID write - [IO.File]::ReadAllText hardcodes
# FileShare.Read, which cannot read a file held open for Write, so a lingering
# owner handle made every challenger's read throw -> read as empty -> the
# empty-takeover path fired on a healthy owner (isolated repro r65: second
# acquirer at iter=6 while the owner held). An empty/unreadable lock gets a
# few beats before being treated as a crashed creator - a healthy creator
# writes+flushes+closes its PID microseconds after CreateNew, so 6 empty
# sightings over ~1.5s means the creator died.
$lockFile = Join-Path $worldDir 'scan.lock'
$lockFs = $null
$acquired = $false
$emptySeen = 0
for ($i = 0; $i -lt 60 -and -not $acquired; $i++) {
  if (Test-Path $lockFile) {
    $lockPid = ''
    try { $lockPid = [string]([System.IO.File]::ReadAllText($lockFile)).Trim() } catch {}
    if ($lockPid -match '^\d+$') {
      $lockAge = ((Get-Date) - (Get-Item $lockFile).LastWriteTime).TotalMinutes
      $alive = $false
      if (Get-Process -Id ([int]$lockPid) -ErrorAction SilentlyContinue) { $alive = $true }
      if ($alive -and $lockAge -lt 15) {
        Write-Output 'perceptor: scan lock held by a live scan, skip (single writer)'
        exit 0
      }
      # dead PID or overage (>15min hung round) -> fail-open takeover
      Remove-Item $lockFile -Force -ErrorAction SilentlyContinue
    } else {
      $emptySeen++
      if ($emptySeen -ge 6) { Remove-Item $lockFile -Force -ErrorAction SilentlyContinue }
    }
    Start-Sleep -Milliseconds 250
  }
  try {
    $lockFs = [System.IO.File]::Open($lockFile, [System.IO.FileMode]::CreateNew, [System.IO.FileAccess]::Write, ([System.IO.FileShare]::Read -bor [System.IO.FileShare]::Delete))
    $pidBytes = [System.Text.Encoding]::ASCII.GetBytes(([string]$PID))
    $lockFs.Write($pidBytes, 0, $pidBytes.Length)
    $lockFs.Flush()
    $lockFs.Close()
    $lockFs = $null
    $acquired = $true
  } catch { Start-Sleep -Milliseconds 250 }
}
if (-not $acquired) {
  Write-Output 'perceptor: scan lock not acquirable this round, skip (single writer)'
  exit 0
}

$now = (Get-Date).ToUniversalTime().ToString('yyyy-MM-ddTHH:mm:ssZ')
$events = @()
$blocked = 0
$debug = @()
$utf8 = New-Object System.Text.UTF8Encoding($false)

# ---------- load event registry (write-side gate authority; fail-safe empty) ----------
$knownTypes = @{}
try {
  $reg = Get-Content $registryFile -Raw -Encoding UTF8 | ConvertFrom-Json
  $reg.events.PSObject.Properties | ForEach-Object { $knownTypes[$_.Name] = $true }
} catch { $debug += 'registry load FAIL' }
if ($knownTypes.Count -eq 0) { $debug += 'registry EMPTY - all events quarantined (fail-safe)' }

# F1+S2: gate at the outlet; quarantine (not drop) so forensics survive
# r65: optional 6th param ts - fleet inbox lines keep the emitter's own timestamp
# (R-20260924-infra-2 single-writer consolidation); absent/malformed -> scan now.
function Add-WorldEvent([string]$type,[string]$actor,[string]$repo,[string]$zone,[string]$summary,[string]$ts) {
  if (-not $ts) { $ts = $script:now }
  if (-not $script:knownTypes.ContainsKey($type)) {
    $script:blocked++
    [System.IO.File]::AppendAllText($script:quarFile, ('{"ts_utc":"' + $ts + '","type":"' + $type + '","reason":"unregistered"}' + "`n"), $script:utf8)
    $script:debug += ('QUARANTINED unregistered event: ' + $type)
    return
  }
  $e = [ordered]@{ ts_utc=$ts; type=$type; actor=$actor; repo=$repo; zone=$zone; summary=$summary }
  $script:events += ($e | ConvertTo-Json -Compress)
}

# ---------- cursor (key=value lines) ----------
$cursor = @{}
if (Test-Path $cursorFile) {
  foreach ($ln in (Get-Content $cursorFile -Encoding UTF8)) {
    if (-not $ln) { continue }
    $p = $ln -split '=', 2
    if ($p.Count -eq 2) { $cursor[$p[0]] = $p[1] }
  }
}

# ---------- probe context ----------
$ctx = @{ root = $root.Path; now = $now; cursor = $cursor; worldDir = $worldDir;
  AddEvent = { param($type,$actor,$repo,$zone,$summary,$ts) Add-WorldEvent $type $actor $repo $zone $summary $ts } }

# ---------- load + run probes ----------
$stateParts = @{}
$newCur = @{}
$probeFiles = @(Get-ChildItem (Join-Path $PSScriptRoot 'probes') -Filter *.ps1 | Sort-Object Name)
foreach ($pf in $probeFiles) {
  if ($pf.Name -like '_*') { continue }
  . $pf.FullName
  $fn = 'Probe-' + $pf.BaseName
  try {
    $res = & $fn $ctx
    if ($res -and $res.state) { foreach ($k in $res.state.Keys) { $stateParts[$k] = $res.state[$k] } }
    if ($res -and $res.newcur) { foreach ($k in $res.newcur.Keys) { $newCur[$k] = $res.newcur[$k] } }
    $debug += ('probe ' + $pf.BaseName + ': OK')
  } catch { $debug += ('probe ' + $pf.BaseName + ': FAIL ' + $_.Exception.Message) }
}

# ---------- F3: derive product status from live repo activity (never hardcode) ----------
function Get-ProductStatus([string]$dir) {
  if (-not (Test-Path (Join-Path $dir '.git'))) { return 'missing' }
  $iso7 = (Get-Date).ToUniversalTime().AddDays(-7).ToString('yyyy-MM-ddTHH:mm:ss')
  $n7 = 0
  $out = & git -C $dir rev-list --count --since="$iso7" HEAD 2>$null
  if ($LASTEXITCODE -eq 0 -and $out) { $n7 = [int]$out }
  if ($n7 -gt 0) { return 'active' }                 # commits in last 7d = working line
  $rem = & git -C $dir remote 2>$null
  if ($rem -and @($rem).Count -gt 0) { return 'dormant' }   # remote live but quiet
  return 'onboarding'                                # local-only and quiet
}
$minigameDir = Join-Path $root 'gaming\MiniGame'
$bigmoneyDir = Join-Path $root 'quant\bigmoney'
$bigstreamDir = Join-Path $root 'media\BigStream'
$fluxverseDir = Join-Path $root 'gaming\FluxVerse'

# ---------- assemble world-state ----------
$za = @{ gaming = 0.0; quant = 0.0; media = 0.0 }
if ($stateParts.ContainsKey('zones_activity')) {
  foreach ($k in @($za.Keys)) { if ($stateParts.zones_activity.ContainsKey($k)) { $za[$k] = [double]$stateParts.zones_activity[$k] } }
}
foreach ($k in @($za.Keys)) {
  foreach ($pk in @(('pulse_' + $k), ($k + '_pulse'))) {   # pulse_<zone> (new) and gaming_pulse (legacy probe key)
    if ($stateParts.ContainsKey($pk)) { $p = [double]$stateParts[$pk]; if ($p -gt $za[$k]) { $za[$k] = $p } }
  }
}
$ordersPending = @(); if ($stateParts.ContainsKey('ceo_orders_pending')) { $ordersPending = $stateParts.ceo_orders_pending }
$evOpen = 0; if ($stateParts.ContainsKey('evolution_open')) { $evOpen = [int]$stateParts.evolution_open }
$hqfbOpen = 0; if ($stateParts.ContainsKey('hq_feedback_open')) { $hqfbOpen = [int]$stateParts.hq_feedback_open }   # r46: HQ feedback face (probe hq_feedback)
$decTotal = 0; if ($stateParts.ContainsKey('decisions_total')) { $decTotal = [int]$stateParts.decisions_total }   # r64: group decision ledger face (probe decisions)
$decOpen = 0; if ($stateParts.ContainsKey('decisions_open')) { $decOpen = [int]$stateParts.decisions_open }
$fleet = @(); if ($stateParts.ContainsKey('fleet')) { $fleet = $stateParts.fleet }
if ($stateParts.ContainsKey('fleet_biggame')) { $fleet += $stateParts.fleet_biggame }   # F2: biggame machines join the city
$tasks = @(); if ($stateParts.ContainsKey('tasks')) { $tasks = $stateParts.tasks }
$total = 0; if ($stateParts.ContainsKey('commits_total')) { $total = [int]$stateParts.commits_total }
$lastC = ''; if ($stateParts.ContainsKey('last_commit_ts')) { $lastC = [string]$stateParts.last_commit_ts }
# gaming pulse: any biggame machine online = city awake
if ($stateParts.ContainsKey('fleet_biggame')) {
  $anyOn = $false
  foreach ($m in $stateParts.fleet_biggame) { if ($m.online) { $anyOn = $true } }
  if ($anyOn -and $za['gaming'] -lt 0.5) { $za['gaming'] = 0.5 }
}
# media pulse: BigStream orders activity
if ($stateParts.ContainsKey('ceo_orders_bs')) {
  if (@($stateParts.ceo_orders_bs).Count -gt 0 -and $za['media'] -lt 0.4) { $za['media'] = 0.4 }
}
$zoneStatus = @{ gaming = (Get-ProductStatus $minigameDir); quant = (Get-ProductStatus $bigmoneyDir); media = (Get-ProductStatus $bigstreamDir) }

# M1.5 reality link: clock/weather/fx/github/market state fragments -> one
# state section (protocol 0.1: additive fields are free; engine ignores
# what it does not map)
$reality = @{}
foreach ($rk in @('city_day_phase','beijing_hhmm','market_phase','market_calendar','weekday',
                  'weather_kind','weather_code','weather_temp_c','weather_wind_ms',
                  'fx_usdcny','fx_date','github_pulse','market')) {
  if ($stateParts.ContainsKey('reality_' + $rk)) { $reality[$rk] = $stateParts['reality_' + $rk] }
}

# r47: BigStream render output face (probe bigstream_output) - additive section
# (protocol 0.1: adding fields are free, engine ignores what it does not map)
$mediaOut = @{}
foreach ($mk in @('renders_total','renders_bytes','last_render','last_render_utc')) {
  if ($stateParts.ContainsKey('mediaout_' + $mk)) { $mediaOut[$mk] = $stateParts['mediaout_' + $mk] }
}

# r48: MiniGame live task panel (probe minigame_tasks) - additive section
# (protocol 0.1: adding fields is free, engine ignores what it does not map)
$gameTasks = @{}
if ($stateParts.ContainsKey('gametasks_items')) {
  $gameTasks['items'] = $stateParts['gametasks_items']
  foreach ($gk in @('total','active','review','blocked')) {
    if ($stateParts.ContainsKey('gametasks_' + $gk)) { $gameTasks[$gk] = $stateParts['gametasks_' + $gk] }
  }
}

# r121: street resident behavior face (probe street_behavior, P-75 M2 data leg)
# - additive section; ctx/generated_utc forwarded for snapshot-freshness honesty
$streetBeh = @{}
foreach ($sk in @('ctx','generated_utc','total','visible','nodata','seats')) {
  if ($stateParts.ContainsKey('streetbeh_' + $sk)) { $streetBeh[$sk] = $stateParts['streetbeh_' + $sk] }
}

# resident minds (probe residents.ps1): latest AI line per resident -> state.residents
$residents = @{}
if ($stateParts.ContainsKey('residents')) { $residents = $stateParts.residents }

# r65: fleet inbox ingest face (probe inbox, P-43 case 2) - additive counters
$inboxSec = @{}
foreach ($ik in @('mode','batches','files','lines','events','bad_lines','replayed')) {
  if ($stateParts.ContainsKey('inbox_' + $ik)) { $inboxSec[$ik] = $stateParts['inbox_' + $ik] }
}

$state = [ordered]@{
  protocol = 'fluxverse/0.1'
  ts_utc = $now
  zones = @(
    @{ id = 'gaming'; name = 'FLUX Gaming'; status = $zoneStatus['gaming']; activity = [math]::Round($za['gaming'], 2) }
    @{ id = 'quant';  name = 'FLUX Quant';  status = $zoneStatus['quant'];  activity = [math]::Round($za['quant'], 2) }
    @{ id = 'media';  name = 'FLUX Media';  status = $zoneStatus['media'];  activity = [math]::Round($za['media'], 2) }
  )
  fleet = $fleet
  tasks = $tasks
  flows = @(
    @{ id = 'data';    zone = 'gaming' }
    @{ id = 'capital'; zone = 'quant' }
    @{ id = 'traffic'; zone = 'media' }
  )
  products = @(
    @{ id = 'minigame';  line = 'gaming'; status = (Get-ProductStatus $minigameDir) }
    @{ id = 'bigmoney';  line = 'quant';  status = (Get-ProductStatus $bigmoneyDir) }
    @{ id = 'bigstream'; line = 'media';  status = (Get-ProductStatus $bigstreamDir) }
    @{ id = 'fluxverse'; line = 'gaming'; status = (Get-ProductStatus $fluxverseDir) }
  )
  governance = @{
    ceo_orders_pending = $ordersPending
    hq_feedback_open = $hqfbOpen
    decisions_total = $decTotal
    decisions_open = $decOpen
    evolution = @{ next_tick = 'SUN 09:17'; open_proposals = $evOpen }
  }
  history = @{ commits_total = $total; last_commit_ts = $lastC }
  reality = $reality
  media_outputs = $mediaOut
  game_tasks = $gameTasks
  residents = $residents
}
# r65: fleet inbox ingest face - additive section; absent entirely while no repo
# carries an inbox/ dir (zero consumer impact when the feature is idle)
if ($inboxSec.Count -gt 0) { $state['inbox'] = $inboxSec }

# r121: street resident behavior face - additive section; absent entirely while
# the BigLife behavior export is missing (zero consumer impact when idle)
if ($streetBeh.Count -gt 0) { $state['street_behavior'] = $streetBeh }

# ---------- write outputs (state -> .new, verify promotes on PASS) ----------
[System.IO.File]::WriteAllText($newFile, ($state | ConvertTo-Json -Depth 6), $utf8)
# F1: malformed event lines are quarantined too (registered types already gated at the outlet)
$goodEvents = @()
foreach ($ev in $events) {
  $ok = $false
  try { $eo = $ev | ConvertFrom-Json; if ($knownTypes.ContainsKey([string]$eo.type)) { $ok = $true } } catch {}
  if ($ok) { $goodEvents += $ev }
  else {
    $blocked++
    [System.IO.File]::AppendAllText($quarFile, ($ev + "`n"), $script:utf8)
    $debug += 'QUARANTINED malformed event line'
  }
}
# r3: daily rotation keeps the live stream bounded; archive keeps the chronicle
if (Test-Path $eventsFile) {
  $evItem = Get-Item $eventsFile
  if ($evItem.Length -gt 0 -and $evItem.LastWriteTime.Date -lt (Get-Date).Date) {
    $archive = Join-Path $worldDir ('world-events-' + $evItem.LastWriteTime.ToString('yyyyMMdd') + '.jsonl')
    if (Test-Path $archive) {
      # clock-jump safety: append-merge into an existing archive, never overwrite it
      if (-not ([System.IO.File]::ReadAllText($archive)).EndsWith("`n")) { [System.IO.File]::AppendAllText($archive, "`n", $utf8) }
      [System.IO.File]::AppendAllText($archive, [System.IO.File]::ReadAllText($eventsFile), $utf8)
      Remove-Item $eventsFile -Force
    } else {
      Move-Item $eventsFile $archive
    }
    $debug += ('rotation: live stream archived to ' + [System.IO.Path]::GetFileName($archive))
    # P-43 chronicle backup (r62): the archive is the city chronicle - stage it
    # right here (targeted add, never -A) so the next commit carries it into
    # git history. Fail-soft: a git hiccup must never kill the scan round; the
    # archive stays on disk, the next rotation/round retries the pickup.
    try {
      & git -C $repoRoot add -- $archive 2>$null
      if ($LASTEXITCODE -eq 0) { $debug += ('chronicle backup: staged ' + [System.IO.Path]::GetFileName($archive)) }
      else { $debug += 'chronicle backup: git add failed (fail-soft)' }
    } catch { $debug += 'chronicle backup: git add error (fail-soft)' }
  }
}
# r7/P-14: quarantine 7-day lifecycle (retention.md R4 - expired rows are garbage)
if (Test-Path $quarFile) {
  $qItem = Get-Item $quarFile
  $qCutoff = (Get-Date).ToUniversalTime().AddDays(-7)
  if ($qItem.LastWriteTimeUtc -lt $qCutoff) {
    [System.IO.File]::WriteAllText($quarFile, '', $utf8)
    $debug += 'quarantine retention: file stale 7d+ untouched, cleared whole (retention R4)'
  } else {
    $qKeep = @()
    $qExpired = 0
    foreach ($ql in [System.IO.File]::ReadAllLines($quarFile)) {
      if (-not $ql) { continue }
      $qDrop = $false
      try {
        $qo = $ql | ConvertFrom-Json
        # PS5.1 'Z' trap law: strip the literal Z, parse the rest as UTC
        $qts = [datetime]::ParseExact(([string]$qo.ts_utc).TrimEnd('Z'), 'yyyy-MM-ddTHH:mm:ss', $null)
        if ($qts -lt $qCutoff) { $qDrop = $true }
      } catch { $qDrop = $false }
      if ($qDrop) { $qExpired++ } else { $qKeep += $ql }
    }
    if ($qExpired -gt 0) {
      $qOut = ''
      if ($qKeep.Count -gt 0) { $qOut = ($qKeep -join "`n") + "`n" }
      [System.IO.File]::WriteAllText($quarFile, $qOut, $utf8)
      $debug += ('quarantine retention: cleared ' + $qExpired + ' expired row(s) (retention R4, 7d)')
    }
  }
}
if ($goodEvents.Count -gt 0) {
  [System.IO.File]::AppendAllText($eventsFile, (($goodEvents -join "`n") + "`n"), $utf8)
}
foreach ($k in $newCur.Keys) { $cursor[$k] = $newCur[$k] }
$curLines = @()
foreach ($k in $cursor.Keys) { $curLines += ($k + '=' + $cursor[$k]) }
[System.IO.File]::WriteAllText($cursorFile, ($curLines -join "`n") + "`n", $utf8)

# release (r65): unlink only if the lock on disk is still ours - an overage
# takeover may have unlinked/replaced it mid-round; the old unconditional
# remove would have deleted a successor's lock
try {
  $ownLockPid = [string]([System.IO.File]::ReadAllText($lockFile)).Trim()
  if ($ownLockPid -eq ([string]$PID)) { Remove-Item $lockFile -Force -ErrorAction SilentlyContinue }
} catch {}
Write-Output ('perceptor v0.7 done: events +' + $goodEvents.Count + ' quarantined=' + $blocked + ' fleet=' + $fleet.Count + ' tasks=' + $tasks.Count)
$debug | ForEach-Object { Write-Output ('  ' + $_) }
