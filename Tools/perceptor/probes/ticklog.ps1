# Probe: own-repo tick log (FluxVerseTick rounds) -> OS_TICK_START / OS_TICK_DONE
# / GATE_PASS / GATE_BLOCK (P-12 slices 1+2, r94; types registered 2026-09-23,
# desc flipped to emitting r94; build unlocked by decision D-20260925-02).
# Source: logs/tick-<today>.log, written by Tools/tick/tick.ps1 at round step 3,
# i.e. AFTER scan+verify of that round - so this probe always lags one round.
# That is the deliberate path-A architecture (decided r94, slice 1): scan reads
# what the previous tick round wrote; nobody but scan ever writes the world
# stream (P-43 single-writer law, zero new writer). The competing path B
# (tick/verify dropping batch files into this repo's inbox/ for probe inbox.ps1)
# was rejected: it adds a second ingestion route for self-events and needs the
# inbox-live.flag go-live gate as a prerequisite chain - more moving parts for
# the same 10-min latency.
# Block model: one round = lines from '[stamp] FluxVerseTick round start' up to
# the next marker / EOF. A block fires only when COMPLETE - it carries a
# terminal line: 'round end' (tick v1.6+), a 'backoff:' line (deliberate skip
# rounds), or a final 'gate: PASS|FAIL' verdict line (legacy blocks written
# before v1.6). A torn tail block (tick rewrites the log non-atomically; a
# devloop round can run scan mid-write) simply waits for the next scan - the
# cursor never advances past an incomplete block.
# Cursor (content-addressed, r6 family law - hqorder:/decision: same pattern):
#   ticklog:<YYYYMMDD> = start-stamp of the last FIRED block. New day = new key
# and a new log file (tick names files by local date); yesterday's rounds are
# never replayed. Fresh-run migration (decisions.ps1 family law): today's
# complete blocks fire once, deduped against the live stream by type+summary,
# so a same-day cursor wipe stays self-limiting.
# ts honesty (r65 Add-WorldEvent optional ts): every event carries the round's
# own log stamp converted to UTC - a backfilled block stays honest about when
# it actually beat, not when the scan noticed it.
# Zone: governance (city-core loop + city verify gate = brain-tower
# heartbeat; the registry hints zone 'any'/'quant' date from the BigMoney
# gatechain reading of GATE events - when BigMoney G1'/G2 gate events ever
# land via their own emitter they stay zone=quant per the hint).
# Contract: read-only, ASCII body, try/catch -> $null degrade (template laws).

function Probe-ticklog {
  param($ctx)
  try {
    $repoRoot = Split-Path $ctx.worldDir -Parent          # world\ -> repo root
    $logsDir = Join-Path $repoRoot 'logs'
    $today = (Get-Date).ToString('yyyyMMdd')
    $logFile = Join-Path $logsDir ('tick-' + $today + '.log')
    if (-not (Test-Path $logFile)) { return @{ state = @{ } } }
    $curKey = 'ticklog:' + $today
    $lastStamp = ''
    if ($ctx.cursor.ContainsKey($curKey)) { $lastStamp = [string]$ctx.cursor[$curKey] }
    $fresh = ($lastStamp -eq '')

    # fresh-run dedup: what the live stream already pulsed stays silent
    $fired = @{}
    if ($fresh) {
      $evf = Join-Path $ctx.worldDir 'world-events.jsonl'
      if (Test-Path $evf) {
        foreach ($ev in (Get-Content $evf -Encoding UTF8)) {
          if ($ev -notmatch 'OS_TICK|GATE_') { continue }
          try { $o = $ev | ConvertFrom-Json } catch { continue }
          $t = [string]$o.type
          if ($t -eq 'OS_TICK_START' -or $t -eq 'OS_TICK_DONE' -or $t -eq 'GATE_PASS' -or $t -eq 'GATE_BLOCK') {
            $fired[($t + '|' + [string]$o.summary)] = $true
          }
        }
      }
    }

    # parse round blocks off today's log (explicit UTF8 - template law 7/8)
    $blocks = @()
    $cur = $null
    foreach ($ln in (Get-Content $logFile -Encoding UTF8)) {
      if ($ln -match '^\[(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})\] FluxVerseTick round start') {
        if ($cur) { $blocks += $cur }
        $cur = @{ stamp = $Matches[1]; end = $false; backoff = $false; gate = '' }
      } elseif ($cur) {
        if ($ln -match '\] round end\s*$') { $cur.end = $true }
        if ($ln -match 'backoff:') { $cur.backoff = $true; $cur.end = $true }
        if ($ln -match '^\s*gate: (PASS|FAIL)\s*$') { $cur.gate = $Matches[1]; $cur.end = $true }
      }
    }
    if ($cur) { $blocks += $cur }

    $newLast = $lastStamp
    foreach ($b in $blocks) {
      if ($lastStamp -ne '' -and [string]::CompareOrdinal($b.stamp, $lastStamp) -le 0) { continue }
      if (-not $b.end) { continue }   # torn block: mid-write tail waits for the
                                      # next scan (cursor not advanced); a dead
                                      # torn block from a crashed round must not
                                      # stall every LATER round - continue, and
                                      # the cursor jump past it seals it honestly
      # ts honesty: local log stamp -> UTC (fallback = scan now)
      $ts = $ctx.now
      try {
        $lts = [datetime]::ParseExact($b.stamp, 'yyyy-MM-dd HH:mm:ss', $null)
        $ts = $lts.ToUniversalTime().ToString('yyyy-MM-ddTHH:mm:ssZ')
      } catch {}
      $sStart = 'tick round ' + $b.stamp + ' start'
      if (-not $fresh -or -not $fired.ContainsKey(('OS_TICK_START|' + $sStart))) {
        & $ctx.AddEvent 'OS_TICK_START' 'FluxVerseTick' 'fluxverse' 'governance' $sStart $ts
      }
      if ($b.backoff) {
        $sDone = 'tick round ' + $b.stamp + ' done (backoff)'
        if (-not $fresh -or -not $fired.ContainsKey(('OS_TICK_DONE|' + $sDone))) {
          & $ctx.AddEvent 'OS_TICK_DONE' 'FluxVerseTick' 'fluxverse' 'governance' $sDone $ts
        }
      } else {
        if ($b.gate) {
          $gType = 'GATE_PASS'
          $gWord = 'PASS'
          if ($b.gate -eq 'FAIL') { $gType = 'GATE_BLOCK'; $gWord = 'FAIL' }
          $sGate = 'tick round ' + $b.stamp + ' gate ' + $gWord
          if (-not $fresh -or -not $fired.ContainsKey(($gType + '|' + $sGate))) {
            & $ctx.AddEvent $gType 'verify' 'fluxverse' 'governance' $sGate $ts
          }
        }
        $sDone = 'tick round ' + $b.stamp + ' done (gate ' + $b.gate + ')'
        if (-not $fresh -or -not $fired.ContainsKey(('OS_TICK_DONE|' + $sDone))) {
          & $ctx.AddEvent 'OS_TICK_DONE' 'FluxVerseTick' 'fluxverse' 'governance' $sDone $ts
        }
      }
      $newLast = $b.stamp
    }
    if ($newLast -ne $lastStamp) { $ctx.cursor[$curKey] = $newLast }
    return @{ state = @{ } }
  } catch { return $null }
}
