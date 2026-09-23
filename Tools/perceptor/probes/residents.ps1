# Probe: resident minds - local Ollama LLM lines grounded in real events (CEO order 2026-09-23)
# Plan: docs/research/R-20260923-resident-ai.md. Local-first law: localhost Ollama,
# zero API, zero tokens. Encoding law: ASCII script; ALL Chinese lives in data files
# (docs/residents/<id>.md cards + residents-prompt.txt template).
# Honesty law: prompt only receives REAL facts (persona card + world-events tail +
# previous world-state time/weather). No fabrication, no event = no line.
# Rate limits: max ONE line per round; per-resident cooldown 45 min; needs >=1 event
# newer than the resident's last line. Ollama down => silent degrade (contract #4).
# Events: RESIDENT_SAY (registered T2 2026-09-23). State: residents = { id: {line,ts} }

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

    # context: previous-round world-state (time / weather), ~10 min stale is fine
    $nowTxt = ''
    $weatherTxt = ''
    $stFile = Join-Path $worldDir 'world-state.json'
    if (Test-Path $stFile) {
      try {
        $st = Get-Content $stFile -Raw -Encoding UTF8 | ConvertFrom-Json
        if ($st.reality) {
          $nowTxt = [string]$st.reality.beijing_hhmm
          $weatherTxt = [string]$st.reality.weather_kind
        }
      } catch {}
    }
    if (-not $nowTxt) { $nowTxt = (Get-Date).ToString('HH:mm') }

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

    # --- pick ONE eligible resident (cooldown + fresh event) ---
    $cooldownMin = 45
    $chosen = $null
    $chosenKey = ''
    $oldest = $null
    foreach ($cf in (Get-ChildItem $cardsDir -Filter *.md | Sort-Object Name)) {
      $rid = $cf.BaseName
      $tsKey = 'res:' + $rid + ':ts'
      $lastTs = ''
      if ($ctx.cursor.ContainsKey($tsKey)) { $lastTs = [string]$ctx.cursor[$tsKey] }
      if ($lastTs -and $newestEvTs -le $lastTs) { continue }        # nothing new to say
      if ($lastTs) {
        try {
          $age = ((Get-Date).ToUniversalTime() - [datetime]::ParseExact($lastTs, 'yyyy-MM-ddTHH:mm:ssZ', [Globalization.CultureInfo]::InvariantCulture)).TotalMinutes
          if ($age -lt $cooldownMin) { continue }
        } catch { }
      } elseif ($oldest -eq $null) {
        # first run: allow, but only the roster rotates one at a time via $oldest logic below
      }
      if ($oldest -eq $null -or ($lastTs -lt $oldest)) { $oldest = $lastTs; $chosen = $cf; $chosenKey = $rid }
    }
    if (-not $chosen) { return @{ state = @{ } } }

    # --- build prompt from data files ---
    $card = [string](Get-Content $chosen.FullName -Raw -Encoding UTF8)
    $tmpl = [string](Get-Content $promptFile -Raw -Encoding UTF8)
    $prompt = $tmpl.Replace('__CARD__', $card).Replace('__EVENTS__', ($facts -join "`n")).Replace('__NOW__', $nowTxt).Replace('__WEATHER__', $weatherTxt)

    # --- call local Ollama (hard timeout, silent degrade) ---
    $line = ''
    try {
      $body = @{ model = 'qwen2.5:7b-instruct'; prompt = $prompt; stream = $false; options = @{ num_predict = 60; temperature = 0.8 } } | ConvertTo-Json -Depth 4
      $resp = Invoke-RestMethod -Uri 'http://127.0.0.1:11434/api/generate' -Method Post -Body ([System.Text.Encoding]::UTF8.GetBytes($body)) -ContentType 'application/json; charset=utf-8' -TimeoutSec 30
      $line = ([string]$resp.response).Trim() -replace "`r`n", ' ' -replace "`n", ' '
    } catch { return @{ state = @{ } } }
    if ($line.Length -eq 0) { return @{ state = @{ } } }
    if ($line.Length -gt 90) { $line = $line.Substring(0, 90) }

    # --- zone by resident id ---
    $zone = 'governance'
    if ($chosenKey -like 'bm-*') { $zone = 'quant' } elseif ($chosenKey -like 'BG-*') { $zone = 'gaming' }
    $repo = 'bigmoney'
    if ($zone -eq 'gaming') { $repo = 'minigame' }

    $sayTs = $ctx.now
    & $ctx.AddEvent 'RESIDENT_SAY' $chosenKey $repo $zone $line
    $ctx.cursor['res:' + $chosenKey + ':ts'] = $sayTs
    $ctx.cursor['res:' + $chosenKey + ':line'] = $line

    # --- state: all residents' latest lines (from cursor memory) ---
    $residents = @{}
    foreach ($cf in (Get-ChildItem $cardsDir -Filter *.md | Sort-Object Name)) {
      $rid = $cf.BaseName
      $kTs = 'res:' + $rid + ':ts'
      $kLine = 'res:' + $rid + ':line'
      if ($ctx.cursor.ContainsKey($kLine)) {
        $residents[$rid] = @{ id = $rid; line = [string]$ctx.cursor[$kLine]; ts = [string]$ctx.cursor[$kTs] }
      }
    }
    return @{ state = @{ residents = $residents } }
  } catch { return $null }
}
