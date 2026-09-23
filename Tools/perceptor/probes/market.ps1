# Probe: real market link for QUANT city - trading calendar + CSI300 ETF kline.
# Reality link M1.5 (DESIGN S15). Same-source law: akshare + flagship 510300
# CSI300ETF = BigMoney universe head (regime/evolve/strategies target).
# Owns world/market-cal.json + world/market-etf.json (single writer); clock.ps1
# READS the calendar cache to fix its Mon-Fri holiday approximation.
# Cache TTLs: calendar = daily (as_of), ETF = 30 min - the 10-min tick never
# hammers sources. Fetcher = market_fetch.py under a hard 45s process cap
# (BigMoney law: akshare endpoints have no built-in timeout and can hang 5min+).
# Any failure returns null (silent degrade, never blocks the scan).
# No events: MARKET bells stay owned by clock.ps1 (registry actor = clock).
# ASCII-only (group PS5.1 GBK encoding law).

function Probe-market {
  param($ctx)
  try {
    $worldDir = Join-Path $ctx.root 'gaming\FluxVerse\world'
    if (-not (Test-Path $worldDir)) { return $null }
    $calFile = Join-Path $worldDir 'market-cal.json'
    $etfFile = Join-Path $worldDir 'market-etf.json'

    # Beijing today (same UTC+8 math as clock.ps1 - PS5.1 'Z' trap law:
    # strip Z, ParseExact raw, add the offset ourselves)
    $s = [string]$ctx.now
    if ($s.EndsWith('Z')) { $s = $s.Substring(0, $s.Length - 1) }
    $utc = [DateTime]::ParseExact($s, 'yyyy-MM-ddTHH:mm:ss', [Globalization.CultureInfo]::InvariantCulture)
    $today = $utc.AddHours(8).ToString('yyyy-MM-dd')

    $cal = $null; $etf = $null
    if (Test-Path $calFile) { try { $cal = Get-Content $calFile -Raw -Encoding UTF8 | ConvertFrom-Json } catch {} }
    if (Test-Path $etfFile) { try { $etf = Get-Content $etfFile -Raw -Encoding UTF8 | ConvertFrom-Json } catch {} }

    $etfFresh = $false
    if ($etf -and $etf.fetched_utc) {
      try {
        $fs = [string]$etf.fetched_utc
        if ($fs.EndsWith('Z')) { $fs = $fs.Substring(0, $fs.Length - 1) }
        $fu = [DateTime]::ParseExact($fs, 'yyyy-MM-ddTHH:mm:ss', [Globalization.CultureInfo]::InvariantCulture)
        if ((([DateTime]::UtcNow) - $fu).TotalMinutes -lt 35) { $etfFresh = $true }
      } catch {}
    }
    # PS gate 35min > fetcher TTL 30min: when PS triggers, the fetcher always
    # agrees the cache is stale - the two layers can never thrash.
    $calFresh = ($cal -and $cal.as_of -eq $today)

    if (-not $calFresh -or -not $etfFresh) {
      $py = Join-Path $PSScriptRoot 'market_fetch.py'
      if (Test-Path $py) {
        # hard cap: a hung source must never hang the whole city scan
        $so = Join-Path $worldDir 'market-fetch.log'
        $se = Join-Path $worldDir 'market-fetch.err.log'
        $p = Start-Process -FilePath 'python' -ArgumentList @($py, $worldDir, $today) -NoNewWindow -PassThru -RedirectStandardOutput $so -RedirectStandardError $se
        if (-not $p.WaitForExit(45000)) { try { $p.Kill() } catch {} }
      }
      if (Test-Path $calFile) { try { $cal = Get-Content $calFile -Raw -Encoding UTF8 | ConvertFrom-Json } catch {} }
      if (Test-Path $etfFile) { try { $etf = Get-Content $etfFile -Raw -Encoding UTF8 | ConvertFrom-Json } catch {} }
      $calFresh = ($cal -and $cal.as_of -eq $today)
    }

    # state fragment -> state.reality.market (scan.ps1 assembler whitelist)
    $m = [ordered]@{}
    if ($calFresh) {
      $m['is_trading_day'] = [bool]$cal.is_trading_day
      $m['cal_next_trade_date'] = [string]$cal.next_trade_date
    }
    if ($etf -and $etf.bars) {
      $m['etf_symbol'] = [string]$etf.symbol
      $m['etf_name'] = [string]$etf.name
      $m['etf_last_date'] = [string]$etf.last_date
      $m['etf_last_close'] = [double]$etf.last_close
      $m['etf_change_pct'] = [double]$etf.change_pct
      $m['etf_fetched_utc'] = [string]$etf.fetched_utc
      # bars = [date,o,h,l,c] flat arrays (scalar leaves - stays well inside
      # scan's ConvertTo-Json -Depth 6; arrays-of-objects would risk nulls)
      $m['bars'] = @($etf.bars)
    }
    if ($m.Count -eq 0) { return $null }
    return @{ state = @{ reality_market = $m } }
  } catch { return $null }
}
