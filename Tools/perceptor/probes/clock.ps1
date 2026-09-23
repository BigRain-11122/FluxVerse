# Probe: local clock -> city day/night phase + Shanghai market session bells
# Reality link M1.5 (DESIGN S15). Pure local, zero key, zero network.
# Sessions (Beijing time): 09:30 am open / 11:30 lunch / 13:00 pm open /
# 15:00 day close. Trading day = real exchange calendar when the
# market-cal.json cache (single writer: market.ps1) is fresh for today;
# stale/missing cache -> Mon-Fri approximation fallback.
# Rank machine: pre=0 am_open=1 lunch=2 pm_open=3 post=4 closed=5(weekend/holiday).
# A skipped scan gap replays every missed boundary in order (day rollover
# finishes yesterday's bells first) - the city never misses a bell.
# Events: MARKET_OPEN / MARKET_CLOSE (registered T2 2026-09-23). ASCII-only.

function Probe-clock {
  param($ctx)
  try {
    # PS5.1 trap: a literal 'Z' in the ParseExact format makes .NET parse the
    # input as UTC and CONVERT TO LOCAL (empirically proven). Strip it, parse
    # the raw UTC value, then add the +8 offset ourselves.
    $s = [string]$ctx.now
    if ($s.EndsWith('Z')) { $s = $s.Substring(0, $s.Length - 1) }
    $utc = [DateTime]::ParseExact($s, 'yyyy-MM-ddTHH:mm:ss', [Globalization.CultureInfo]::InvariantCulture)
    $bj = $utc.AddHours(8)                         # Beijing wall time (UTC+8)
    $wd = [int]$bj.DayOfWeek                      # 0=Sun .. 6=Sat
    $mins = $bj.Hour * 60 + $bj.Minute
    $day = $bj.ToString('yyyy-MM-dd')

    # Trading day check: real exchange calendar when the market.ps1 cache is
    # fresh for today (single writer = market.ps1); stale/missing -> Mon-Fri
    # approximation fallback (holidays approximated only until next refresh).
    $trading = ($wd -ge 1 -and $wd -le 5)
    $calMode = 'weekday-approx'
    try {
      $calFile = Join-Path $ctx.root 'gaming\FluxVerse\world\market-cal.json'
      if (Test-Path $calFile) {
        $cal = Get-Content $calFile -Raw -Encoding UTF8 | ConvertFrom-Json
        if ($cal.as_of -eq $day -and $null -ne $cal.is_trading_day) {
          $trading = [bool]$cal.is_trading_day
          $calMode = 'trade-cal'
        }
      }
    } catch { }
    if (-not $trading) { $rank = 5; $phase = 'closed' }
    elseif ($mins -lt 570)  { $rank = 0; $phase = 'pre' }      # before 09:30
    elseif ($mins -lt 690)  { $rank = 1; $phase = 'am_open' }  # 09:30-11:30
    elseif ($mins -lt 780)  { $rank = 2; $phase = 'lunch' }   # 11:30-13:00
    elseif ($mins -lt 900)  { $rank = 3; $phase = 'pm_open' } # 13:00-15:00
    else                    { $rank = 4; $phase = 'post' }    # after 15:00

    # boundary bell k = entering rank k+1: bounds[k]
    $bounds = @(
      @('MARKET_OPEN',  'SSE morning session open 09:30'),
      @('MARKET_CLOSE', 'SSE lunch break 11:30'),
      @('MARKET_OPEN',  'SSE afternoon session open 13:00'),
      @('MARKET_CLOSE', 'SSE day close 15:00')
    )

    $prevRank = -1; $prevDay = ''
    if ($ctx.cursor.ContainsKey('clock_mkt_rank')) {
      try { $prevRank = [int]$ctx.cursor['clock_mkt_rank'] } catch {}
      if ($ctx.cursor.ContainsKey('clock_mkt_day')) { $prevDay = [string]$ctx.cursor['clock_mkt_day'] }
    }
    if ($prevRank -ge 0 -and $prevDay -le $day) {
      # guard: a cursor day in the future (clock skew / old bug) suppresses
      # bells and just re-arms - never replay bells from a polluted cursor.
      if ($prevDay -eq $day) {
        if ($rank -gt $prevRank) {
          for ($i = $prevRank; $i -lt $rank; $i++) {
            & $ctx.AddEvent $bounds[$i][0] 'clock' 'fluxverse' 'quant' $bounds[$i][1]
          }
        }
      } else {
        for ($i = $prevRank; $i -lt 4; $i++) {          # finish yesterday's missed bells
          & $ctx.AddEvent $bounds[$i][0] 'clock' 'fluxverse' 'quant' $bounds[$i][1]
        }
        if ($trading) {
          for ($i = 0; $i -lt $rank; $i++) {            # today's bells up to now
            & $ctx.AddEvent $bounds[$i][0] 'clock' 'fluxverse' 'quant' $bounds[$i][1]
          }
        }
      }
    }
    $ctx.cursor['clock_mkt_rank'] = [string]$rank
    $ctx.cursor['clock_mkt_day'] = $day

    $h = $bj.Hour
    if ($h -ge 5 -and $h -le 8) { $dp = 'dawn' }
    elseif ($h -ge 9 -and $h -le 16) { $dp = 'day' }
    elseif ($h -ge 17 -and $h -le 19) { $dp = 'dusk' }
    else { $dp = 'night' }

    return @{ state = @{
      reality_city_day_phase = $dp
      reality_beijing_hhmm = $bj.ToString('HH:mm')
      reality_market_phase = $phase
      reality_market_calendar = $calMode
      reality_weekday = [string]($(if ($wd -eq 0) { 7 } else { $wd }))
    } }
  } catch { return $null }
}
