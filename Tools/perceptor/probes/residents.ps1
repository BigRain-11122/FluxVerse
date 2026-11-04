# Probe: resident minds - local Ollama LLM lines grounded in real events
# v1.5 (CEO order: study open-world game NPC AI) upgrades over v1:
#   - Daily-routine location states (RDR2 schedules / Skyrim Radiant AI adapted):
#     location derived from REAL status + REAL Beijing time (work post / dorm /
#     night shift). No fake wandering (decoration ban).
#   - Self-memory: last 3 own lines fed back into prompt (anti-repeat continuity).
#   - Resident-to-resident chat: every 4th round, two eligible residents hold a
#     2-line exchange (v2 feature pulled forward, cheap: 2 LLM calls).
# Local-first law: localhost Ollama only, zero API tokens. Encoding law: ASCII
# script; Chinese lives in data files (cards + prompt templates).
# Honesty law: only REAL facts are fed. No new events => silence. Cooldown 45min.
# Events: RESIDENT_SAY. State: residents = { id: {line, ts, location} }

function Get-ResidentLocation([string]$rid, [bool]$online, [int]$hourBeijing) {
  if (-not $online) { return 'ji-dui-su-she' }              # dorm (offline, lights out)
  $isNight = ($hourBeijing -ge 22 -or $hourBeijing -lt 7)
  if ($isNight) { return 'night-shift' }                    # on duty at night
  if ($rid -like 'bm-*') { return 'quant-computing-tower' } # at QUANT tower desk
  return 'game-city-studio'                                 # at GAME city studio
}

# --- voice-face helpers (main#138, r828) -------------------------------------
# r826 swapped the dead model name and revived the voices, but the face still
# read "probe residents: OK" the whole three weeks they were silent. The probe
# contract has no WARN channel, so the honest split is: the probe records
# READINGS (which model, was it on disk, whose last line was when) and verify
# says the warning. Both halves need the same facts, so they live here as pure
# functions and are unit-testable without an Ollama server.
function Get-ResidentModelRoster {
  # Returns @{ ok = $true/$false; names = @() }.
  # ok=$false means "the roster could not be read" (Ollama down / wrong port),
  # which is NOT the same fact as "the model is not installed".
  param([string]$BaseUri)
  try {
    $r = Invoke-RestMethod -Uri ($BaseUri.TrimEnd('/') + '/api/tags') -TimeoutSec 5
    $names = @()
    foreach ($m in @($r.models)) {
      if ($null -ne $m -and $null -ne $m.PSObject.Properties['name']) { $names += [string]$m.name }
    }
    return @{ ok = $true; names = $names }
  } catch { return @{ ok = $false; names = @() } }
}

function Get-ResidentModelStatus {
  # Three states, never two: installed / not installed / unknown. A two-state
  # reading would print "not installed" when Ollama is merely down.
  param([string]$Model, $Roster)
  if ($null -eq $Roster -or $Roster.ok -ne $true) { return @{ present = $null; known = $false } }
  $hit = $false
  foreach ($n in @($Roster.names)) { if ($n -eq $Model) { $hit = $true; break } }
  return @{ present = $hit; known = $true }
}

# --- event-stream backfill (main#141, r838) ---------------------------------
# The roster is rebuilt every round from the perceptor cursor
# (world\perceptor-state.txt). When that file is rotated or lost, every card
# loses its `res:<id>:line` key and BOTH faces fall back to "never spoke" --
# while world\world-events*.jsonl still holds their RESIDENT_SAY rows. That is
# the same one-city-two-answers shape r830/r837 removed inside a single round,
# just across a file boundary.
# Bounded on purpose:
#   - only called when at least one card has no cursor line, so a healthy quiet
#     round pays nothing;
#   - newest event files first, stop as soon as every card is covered;
#   - a resident with no event row stays absent (never fabricated).
function Get-ResidentEventIndex {
  param([string]$WorldDir, [string[]]$ResidentIds, [int]$MaxFiles = 8)
  $index = @{}
  $want = @{}
  foreach ($rid in @($ResidentIds)) { if ($rid) { $want[[string]$rid] = $true } }
  if ($want.Count -eq 0 -or [string]::IsNullOrEmpty($WorldDir) -or -not (Test-Path -LiteralPath $WorldDir)) {
    return @{ index = $index; files_read = 0; complete = ($want.Count -eq 0) }
  }
  $files = @()
  $live = Join-Path $WorldDir 'world-events.jsonl'
  if (Test-Path -LiteralPath $live) { $files += $live }
  foreach ($f in @(Get-ChildItem -LiteralPath $WorldDir -Filter 'world-events-*.jsonl' -File -ErrorAction SilentlyContinue | Sort-Object Name -Descending)) {
    if ($files.Count -ge $MaxFiles) { break }
    $files += $f.FullName
  }
  $read = 0
  foreach ($fp in $files) {
    $read++
    try {
      foreach ($ln in @(Get-Content -LiteralPath $fp -Encoding UTF8)) {
        if ([string]::IsNullOrEmpty($ln)) { continue }
        # cheap pre-filter: most lines in a day file are not resident speech
        if ($ln.IndexOf('RESIDENT_SAY') -lt 0) { continue }
        try { $e = $ln | ConvertFrom-Json } catch { continue }
        if ([string]$e.type -ne 'RESIDENT_SAY') { continue }
        $rid = [string]$e.actor
        if (-not $want.ContainsKey($rid)) { continue }
        $ts = [string]$e.ts_utc
        if ([string]::IsNullOrEmpty($ts)) { continue }
        if ($index.ContainsKey($rid) -and [string]$index[$rid].ts -ge $ts) { continue }
        $index[$rid] = @{ ts = $ts; line = [string]$e.summary }
      }
    } catch { }
    $covered = $true
    foreach ($rid in @($want.Keys)) { if (-not $index.ContainsKey($rid)) { $covered = $false; break } }
    if ($covered) { break }
  }
  $complete = $true
  foreach ($rid in @($want.Keys)) { if (-not $index.ContainsKey($rid)) { $complete = $false; break } }
  return @{ index = $index; files_read = $read; complete = $complete }
}

function Get-ResidentVoiceMeta {
  # Readings only. `last_say_age_h` = $null means "never spoke / timestamp
  # unreadable", never 0.
  # main#141 (r838): `EventIndex` is the event-stream backfill. It is consulted
  # ONLY where the cursor has no stamp, so the two faces (roster rows and this
  # reading) can never disagree about who spoke -- the failure r830/r837 fixed
  # inside one round would otherwise reappear across a lost cursor file.
  # `backfilled_n` counts the residents whose stamp came from the event stream;
  # 0 means "the cursor answered everything" and is a real reading, not a guess.
  # r830: `silent_n` used to mix two different facts (never spoke + line older
  # than 24h) while `speakers_n` counted every resident that ever spoke, so
  # "say=5 silent=2" could exceed the card count and no reader could reconcile
  # the line. Now split: `never_n` (no line at all) + `stale_n` (spoke, but the
  # line is older than 24h) - `say + never = residents` always holds, and
  # stale is a subset of say. `silent_n` is kept for older consumers.
  # r829: `RosterN` counts the OLLAMA MODEL ROSTER (`/api/tags` names), while
  # the city's own roster is the resident CARD count. Both are readings, but a
  # line that printed only the model count next to `say=` read as "4 residents
  # spoke 5 times" - impossible on its face. Both numbers are published under
  # names that cannot be confused: models_n vs residents_n.
  param($Cursor, [string[]]$ResidentIds, [string]$Model, $ModelState, [int]$ModelN, $EventIndex = $null)
  $nowUtc = (Get-Date).ToUniversalTime()
  $sayN = 0
  $lastUtc = ''
  $never = 0
  $stale = 0
  $backfilled = 0
  foreach ($rid in @($ResidentIds)) {
    $k = 'res:' + $rid + ':ts'
    $t = ''
    if ($Cursor.ContainsKey($k)) { $t = [string]$Cursor[$k] }
    if ([string]::IsNullOrEmpty($t) -and $null -ne $EventIndex -and $EventIndex.ContainsKey($rid)) {
      $t = [string]$EventIndex[$rid].ts
      if (-not [string]::IsNullOrEmpty($t)) { $backfilled++ }
    }
    if ([string]::IsNullOrEmpty($t)) { $never++; continue }
    $sayN++
    if ($t -gt $lastUtc) { $lastUtc = $t }
    try {
      # r828: the trailing Z is a LITERAL in ParseExact, so the old two-arg call
      # produced a Kind=Local DateTime (11:10Z read as 11:10 local) and every age
      # was off by the host offset (+8 here). datetimeoffset parses the stamp as
      # the UTC instant it names.
      $dt = [datetimeoffset]::ParseExact($t, 'yyyy-MM-ddTHH:mm:ssZ', [Globalization.CultureInfo]::InvariantCulture)
      $age = ($nowUtc - $dt.UtcDateTime).TotalHours
      if ($age -gt 24) { $stale++ }
    } catch { $stale++ }
  }
  # `silent_n` keeps the old meaning (never + stale) for older consumers.
  $silent = $never + $stale
  $ageH = $null
  if ($lastUtc) {
    try {
      $dtL = [datetimeoffset]::ParseExact($lastUtc, 'yyyy-MM-ddTHH:mm:ssZ', [Globalization.CultureInfo]::InvariantCulture)
      $ageH = [math]::Round(($nowUtc - $dtL.UtcDateTime).TotalHours, 1)
    } catch { $ageH = $null }
  }
  return [ordered]@{
    model          = $Model
    model_present  = $ModelState.present
    model_known    = $ModelState.known
    models_n       = $ModelN
    residents_n    = @($ResidentIds).Count
    speakers_n     = $sayN
    never_n        = $never
    stale_n        = $stale
    silent_n       = $silent
    backfilled_n   = $backfilled
    last_say_utc   = $lastUtc
    last_say_age_h = $ageH
  }
}

function New-ResidentState {
  param($Residents, $Meta)
  return @{ state = @{ residents = $Residents; residents_meta = $Meta } }
}

# --- state snapshot from cursor memory (r837) --------------------------------
# scan.ps1 merges probe state by REPLACING each key (stateParts[k] = res.state[k]),
# so whatever this probe returns becomes world-state.residents wholesale. The
# early returns (no events / nobody eligible to speak) used to carry @{} -- which
# wiped the promoted map every quiet round. The page then named nobody: the
# roster printed talked=0 ("nobody ever spoke") while residents_meta, computed
# from the SAME cursor, said say=5. One probe, two faces, opposite answers.
# Now every return path carries the last known line/location per resident.
function Get-ResidentSnapshot {
  # main#141 (r838): `EventIndex` is the same backfill the voice reading uses.
  # A row built from it carries src='events' and NO routine place (the event
  # line records where the resident works, not where it slept), so the page can
  # say "rebuilt from the event stream" instead of silently claiming a place.
  param($ctx, [string]$CardsDir, $EventIndex = $null)
  $residents = @{}
  if ([string]::IsNullOrEmpty($CardsDir) -or -not (Test-Path -LiteralPath $CardsDir)) { return $residents }
  foreach ($cf in (Get-ChildItem -LiteralPath $CardsDir -Filter *.md -File -ErrorAction SilentlyContinue | Sort-Object Name)) {
    $rid = $cf.BaseName
    $kLine = 'res:' + $rid + ':line'
    $line = ''
    $ts = ''
    $src = ''
    if ($ctx.cursor.ContainsKey($kLine)) {
      $line = [string]$ctx.cursor[$kLine]
      $ts = [string]$ctx.cursor['res:' + $rid + ':ts']
      $src = 'cursor'
    } elseif ($null -ne $EventIndex -and $EventIndex.ContainsKey($rid)) {
      $line = [string]$EventIndex[$rid].line
      $ts = [string]$EventIndex[$rid].ts
      $src = 'events'
    }
    if ($src) {
      $locStr = ''
      if ($src -eq 'cursor') {
        $kLoc = 'res:' + $rid + ':loc'
        if ($ctx.cursor.ContainsKey($kLoc)) {
          $locStr = [string]$ctx.cursor[$kLoc]
          if ($locStr -eq 'ji-dui-su-she') { $locStr = 'sleep' } elseif ($locStr -eq 'night-shift') { $locStr = 'night-shift' } else { $locStr = 'work' }
        }
      }
      $residents[$rid] = @{ id = $rid; line = $line; ts = $ts; location = $locStr; src = $src }
    }
  }
  return $residents
}

function Probe-residents {
  param($ctx)
  try {
    $worldDir = Join-Path (Join-Path $ctx.root 'gaming\FluxVerse') 'world'
    $cardsDir = Join-Path (Join-Path $ctx.root 'gaming\FluxVerse') 'docs\residents'
    $promptFile = Join-Path $PSScriptRoot 'residents-prompt.txt'
    if (-not (Test-Path $cardsDir) -or -not (Test-Path $promptFile)) { return @{ state = @{ } } }

    # r828: model + roster are resolved once, before any early return, so a
    # quiet round still carries "which model, is it installed" to the page.
    $residentModel = 'qwen3:4b-instruct'
    if ($env:FLUXVERSE_RESIDENT_MODEL) { $residentModel = [string]$env:FLUXVERSE_RESIDENT_MODEL }
    $ollamaBase = 'http://127.0.0.1:11434'
    if ($env:FLUXVERSE_OLLAMA_BASE) { $ollamaBase = [string]$env:FLUXVERSE_OLLAMA_BASE }
    $roster = Get-ResidentModelRoster $ollamaBase
    $modelState = Get-ResidentModelStatus $residentModel $roster
    $cardIds = @(Get-ChildItem $cardsDir -Filter *.md | Sort-Object Name | ForEach-Object { $_.BaseName })
    # main#141 (r838): the cursor is the primary memory; the event stream is the
    # backup. Scan it only when at least one card has lost its cursor line, so a
    # healthy round pays nothing and a lost cursor stops reading as "nobody ever
    # spoke in this city".
    $eventIndex = $null
    $cursorGaps = 0
    foreach ($rid in @($cardIds)) {
      if (-not $ctx.cursor.ContainsKey('res:' + $rid + ':line')) { $cursorGaps++ }
    }
    if ($cursorGaps -gt 0) {
      $evBackfill = Get-ResidentEventIndex $worldDir $cardIds
      if (@($evBackfill.index.Keys).Count -gt 0) { $eventIndex = $evBackfill.index }
    }
    $voiceMeta = Get-ResidentVoiceMeta $ctx.cursor $cardIds $residentModel $modelState @($roster.names).Count $eventIndex
    $sayError = ''

    # --- gather real facts (read-only) ---
    $evLines = @()
    $evFile = Join-Path $worldDir 'world-events.jsonl'
    if (Test-Path $evFile) {
      $all = @(Get-Content $evFile -Encoding UTF8 | ForEach-Object { [string]$_ } | Where-Object { $_.Trim() })
      if ($all.Count -gt 12) { $evLines = @($all | Select-Object -Last 12) } else { $evLines = $all }
    }
    if ($evLines.Count -eq 0) { return (New-ResidentState (Get-ResidentSnapshot $ctx $cardsDir $eventIndex) $voiceMeta) }

    # context: previous-round world-state (time / weather / fleet online states)
    $nowTxt = ''
    $weatherTxt = ''
    $fleetOnline = @{}
    $stFile = Join-Path $worldDir 'world-state.json'
    if (Test-Path $stFile) {
      try {
        $st = Get-Content $stFile -Raw -Encoding UTF8 | ConvertFrom-Json
        if ($st.reality) {
          $nowTxt = [string]$st.reality.beijing_hhmm
          $weatherTxt = [string]$st.reality.weather_kind
        }
        if ($st.fleet) { foreach ($m in @($st.fleet)) { $fleetOnline[[string]$m.id] = [bool]$m.online } }
      } catch {}
    }
    if (-not $nowTxt) { $nowTxt = (Get-Date).ToString('HH:mm') }
    $hourBj = 0
    try { $hourBj = [int]$nowTxt.Substring(0, 2) } catch { $hourBj = (Get-Date).Hour }

    # newest event ts (freshness gate)
    $newestEvTs = ''
    $facts = @()
    foreach ($ln in $evLines) {
      try {
        $e = $ln | ConvertFrom-Json
        $facts += ('- [' + [string]$e.type + '] ' + [string]$e.summary)
        if ([string]$e.ts_utc -gt $newestEvTs) { $newestEvTs = [string]$e.ts_utc }
      } catch {}
    }

    # --- eligible residents (cooldown + fresh event) ---
    $cooldownMin = 45
    $eligible = @()
    foreach ($cf in (Get-ChildItem $cardsDir -Filter *.md | Sort-Object Name)) {
      $rid = $cf.BaseName
      $tsKey = 'res:' + $rid + ':ts'
      $lastTs = ''
      if ($ctx.cursor.ContainsKey($tsKey)) { $lastTs = [string]$ctx.cursor[$tsKey] }
      if ($lastTs -and $newestEvTs -le $lastTs) { continue }
      if ($lastTs) {
        try {
          # r828: same literal-Z trap as the meta helper - ParseExact read the
          # stamp as local time, so the 45 min cooldown was really 45 min minus
          # the host offset (zero on this +8 host): every round was eligible.
          $dtLast = [datetimeoffset]::ParseExact($lastTs, 'yyyy-MM-ddTHH:mm:ssZ', [Globalization.CultureInfo]::InvariantCulture)
          $age = ((Get-Date).ToUniversalTime() - $dtLast.UtcDateTime).TotalMinutes
          if ($age -lt $cooldownMin) { continue }
        } catch { }
      }
      $eligible += $cf
    }
    if ($eligible.Count -eq 0) { return (New-ResidentState (Get-ResidentSnapshot $ctx $cardsDir $eventIndex) $voiceMeta) }

    # --- chat mode: every 4th speaking round, two residents talk (v2 pulled forward) ---
    $chatCount = 0
    if ($ctx.cursor.ContainsKey('res:chat:count')) { try { $chatCount = [int]$ctx.cursor['res:chat:count'] } catch {} }
    $isChat = ($chatCount % 4 -eq 3 -and $eligible.Count -ge 2)
    $ctx.cursor['res:chat:count'] = [string]($chatCount + 1)

    $speakers = @()
    if ($isChat) { $speakers = @($eligible | Select-Object -First 2) }
    else { $speakers = @($eligible | Select-Object -First 1) }

    # --- generate lines ---
    $tmpl = [string](Get-Content $promptFile -Raw -Encoding UTF8)
    $locCn = @{ 'quant-computing-tower' = 'QUANT suan-li-lou gang-wei-gong-zuo-zhong'; 'game-city-studio' = 'GAME cheng gong-fang gang-wei-gong-zuo-zhong'; 'ji-dui-su-she' = 'ji-dui su-she xiu-mian-zhong'; 'night-shift' = 'zhi-ye-gang' }
    $said = @()
    $prevLine = ''
    foreach ($chosen in $speakers) {
      $rid = $chosen.BaseName
      $card = [string](Get-Content $chosen.FullName -Raw -Encoding UTF8)

      # v1.6 needs system (Sims/Pals pattern, honest form): real resource levels
      # from the machine's OWN fleet heartbeat json - needs = reading meters,
      # never fabricating motives. Plus real location (RDR2 routine).
      $onlineNow = ($fleetOnline.ContainsKey($rid) -and $fleetOnline[$rid])
      $locRaw = Get-ResidentLocation $rid $onlineNow $hourBj
      $locKey = ''
      if ($locCn.ContainsKey($locRaw)) { $locKey = $locCn[$locRaw] }
      $needsFact = ''
      if ($rid -like 'BG-*') {
        try {
          $mf = Join-Path (Join-Path $ctx.root 'gaming\MiniGame\Design\configs\GLOBAL\fleet') ([string]($rid -replace '^BG-', '') + '.json')
          if (Test-Path $mf) {
            $mj = Get-Content $mf -Raw -Encoding UTF8 | ConvertFrom-Json
            $vramGb = [math]::Round([double]$mj.gpu.vram_free_mb / 1024, 1)
            $ramPct = [math]::Round([double]$mj.ram.free_pct, 0)
            $vramTotGb = [math]::Round([double]$mj.gpu.vram_total_mb / 1024, 0)
            $needsFact = 'xian-cun ' + $vramGb + 'GB ke-yong (zong ' + $vramTotGb + 'GB), nei-cun ' + $ramPct + '% ke-yong'
          }
        } catch {}
      }
      # self facts text (Chinese lives in the CARD + template; here ASCII tokens
      # are replaced by script-built Chinese via codepoints to keep this file ASCII)
      $cn = ''
      if ($locKey -eq 'quant-computing-tower') { $cn = [char]0x5728 + [string][char]0x0051 + [string][char]0x0055 + [string][char]0x0041 + [string][char]0x004E + [string][char]0x0054 + ([string][char]0x7B97 + [string][char]0x529B + [string][char]0x697C) + ([string][char]0x5C97 + [string][char]0x4F4D + [string][char]0x5DE5 + [string][char]0x4F5C + [string][char]0x4E2D) }
      elseif ($locKey -eq 'game-city-studio') { $cn = [char]0x5728 + [string][char]0x0047 + [string][char]0x0041 + [string][char]0x004D + [string][char]0x0045 + ([string][char]0x57CE + [string][char]0x5DE5 + [string][char]0x574A) + ([string][char]0x5C97 + [string][char]0x4F4D + [string][char]0x5DE5 + [string][char]0x4F5C + [string][char]0x4E2D) }
      elseif ($locKey -eq 'ji-dui-su-she') { $cn = [string][char]0x5728 + ([string][char]0x673A + [string][char]0x961F + [string][char]0x5BBF + [string][char]0x820D) + ([string][char]0x4F11 + [string][char]0x7720 + [string][char]0x4E2D) }
      else { $cn = [string][char]0x5728 + ([string][char]0x503C + [string][char]0x591C + [string][char]0x5C97) }
      $selfTxt = $cn
      if ($needsFact) {
        $needsCn = ([string][char]0x663E + [string][char]0x5B58 + [string][char]0x0031 + [string][char]0x0032 + [string][char]0x0033)
        $needsCn = ''
      }
      if ($needsFact) {
        # needs fact line: Chinese via codepoints (ASCII law)
        $needsCn = ([string][char]0x8D44 + [string][char]0x6E90 + [string][char]0x6C34 + [string][char]0x4F4D + [string][char]0xFF1A) + ($needsFact -replace 'xian-cun', ([string][char]0x663E + [string][char]0x5B58) -replace 'ke-yong', ([string][char]0x53EF + [string][char]0x7528) -replace 'zong', ([string][char]0x603B) -replace 'nei-cun', ([string][char]0x5185 + [string][char]0x5B58))
        $selfTxt = $selfTxt + [string][char]0xFF0C + $needsCn
      }

      # self-memory: last 3 own lines (anti-repeat continuity)
      $memKey = 'res:' + $rid + ':mem'
      $memTxt = ''
      if ($ctx.cursor.ContainsKey($memKey)) { $memTxt = [string]$ctx.cursor[$memKey] }
      $extraFacts = $facts
      if ($memTxt) { $extraFacts = @('note: you recently said (do not repeat yourself): ' + $memTxt) + $facts }
      if ($isChat -and $prevLine) { $extraFacts = @(($speakers[0].BaseName) + ' just said to you: ' + $prevLine) + $extraFacts }
      $prompt = $tmpl.Replace('__CARD__', $card).Replace('__SELF__', $selfTxt).Replace('__EVENTS__', ($extraFacts -join "`n")).Replace('__NOW__', $nowTxt).Replace('__WEATHER__', $weatherTxt)

      $line = ''
      try {
        # r826: the host model roster drifted (qwen2.5:7b-instruct no longer pulled),
        # and because the call sits inside try/catch every round 404'd silently --
        # residents stopped speaking on 2026-10-14 and nobody saw a red line.
        # r828: model/base resolved once at the top; a failure now records WHY
        # on the meta face instead of vanishing into `break`.
        $body = @{ model = $residentModel; prompt = $prompt; stream = $false; options = @{ num_predict = 60; temperature = 0.8 } } | ConvertTo-Json -Depth 4
        $resp = Invoke-RestMethod -Uri ($ollamaBase.TrimEnd('/') + '/api/generate') -Method Post -Body ([System.Text.Encoding]::UTF8.GetBytes($body)) -ContentType 'application/json; charset=utf-8' -TimeoutSec 30
        $line = ([string]$resp.response).Trim() -replace "`r`n", ' ' -replace "`n", ' '
      } catch {
        $sayError = 'generate: ' + ([string]$_.Exception.Message -replace '[\r\n]+', ' ')
        break
      }
      if ($line.Length -eq 0) { break }
      if ($line.Length -gt 90) { $line = $line.Substring(0, 90) }

      $zone = 'governance'
      if ($rid -like 'bm-*') { $zone = 'quant' } elseif ($rid -like 'BG-*') { $zone = 'gaming' }
      $repo = 'bigmoney'
      if ($zone -eq 'gaming') { $repo = 'minigame' }
      & $ctx.AddEvent 'RESIDENT_SAY' $rid $repo $zone $line

      $ctx.cursor['res:' + $rid + ':ts'] = $ctx.now
      $ctx.cursor['res:' + $rid + ':line'] = $line
      $ctx.cursor['res:' + $rid + ':loc'] = $locRaw
      # rolling self-memory: keep last 3 lines, | separated
      $newMem = $line
      if ($memTxt) { $parts = @($memTxt -split '\|') + $line; if ($parts.Count -gt 3) { $parts = @($parts | Select-Object -Last 3) }; $newMem = ($parts -join '|') }
      $ctx.cursor['res:' + $rid + ':mem'] = $newMem

      $prevLine = $line
      $said += $rid
    }

    # --- state: all residents' latest lines + locations (from cursor memory) ---
    # r837: same builder as the early returns, so the quiet rounds and the
    # speaking rounds publish the identical shape.
    $residents = Get-ResidentSnapshot $ctx $cardsDir $eventIndex
    # Recompute the voice readings AFTER speaking: this round's lines move both
    # the speaker count and the last-say age.
    $voiceMeta = Get-ResidentVoiceMeta $ctx.cursor $cardIds $residentModel $modelState @($roster.names).Count $eventIndex
    if ($sayError) { $voiceMeta['last_error'] = $sayError }
    return (New-ResidentState $residents $voiceMeta)
  } catch { return $null }
}
