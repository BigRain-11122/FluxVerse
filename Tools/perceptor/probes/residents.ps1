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

function Probe-residents {
  param($ctx)
  try {
    $worldDir = Join-Path (Join-Path $ctx.root 'gaming\FluxVerse') 'world'
    $cardsDir = Join-Path (Join-Path $ctx.root 'gaming\FluxVerse') 'docs\residents'
    $promptFile = Join-Path $PSScriptRoot 'residents-prompt.txt'
    if (-not (Test-Path $cardsDir) -or -not (Test-Path $promptFile)) { return @{ state = @{ } } }

    # --- gather real facts (read-only) ---
    $evLines = @()
    $evFile = Join-Path $worldDir 'world-events.jsonl'
    if (Test-Path $evFile) {
      $all = @(Get-Content $evFile -Encoding UTF8 | ForEach-Object { [string]$_ } | Where-Object { $_.Trim() })
      if ($all.Count -gt 12) { $evLines = @($all | Select-Object -Last 12) } else { $evLines = $all }
    }
    if ($evLines.Count -eq 0) { return @{ state = @{ } } }

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
          $age = ((Get-Date).ToUniversalTime() - [datetime]::ParseExact($lastTs, 'yyyy-MM-ddTHH:mm:ssZ', [Globalization.CultureInfo]::InvariantCulture)).TotalMinutes
          if ($age -lt $cooldownMin) { continue }
        } catch { }
      }
      $eligible += $cf
    }
    if ($eligible.Count -eq 0) { return @{ state = @{ } } }

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
      $selfParts = @()
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
        $body = @{ model = 'qwen2.5:7b-instruct'; prompt = $prompt; stream = $false; options = @{ num_predict = 60; temperature = 0.8 } } | ConvertTo-Json -Depth 4
        $resp = Invoke-RestMethod -Uri 'http://127.0.0.1:11434/api/generate' -Method Post -Body ([System.Text.Encoding]::UTF8.GetBytes($body)) -ContentType 'application/json; charset=utf-8' -TimeoutSec 30
        $line = ([string]$resp.response).Trim() -replace "`r`n", ' ' -replace "`n", ' '
      } catch { break }
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
    $residents = @{}
    foreach ($cf in (Get-ChildItem $cardsDir -Filter *.md | Sort-Object Name)) {
      $rid = $cf.BaseName
      $kLine = 'res:' + $rid + ':line'
      if ($ctx.cursor.ContainsKey($kLine)) {
        $kTs = 'res:' + $rid + ':ts'
        $kLoc = 'res:' + $rid + ':loc'
        $locStr = ''
        if ($ctx.cursor.ContainsKey($kLoc)) {
          $locStr = [string]$ctx.cursor[$kLoc]
          if ($locStr -eq 'ji-dui-su-she') { $locStr = 'sleep' } elseif ($locStr -eq 'night-shift') { $locStr = 'night-shift' } else { $locStr = 'work' }
        }
        $residents[$rid] = @{ id = $rid; line = [string]$ctx.cursor[$kLine]; ts = [string]$ctx.cursor[$kTs]; location = $locStr }
      }
    }
    return @{ state = @{ residents = $residents } }
  } catch { return $null }
}
