# Probe: frankfurter.app (ECB reference rates) -> USDCNY for the capital
# avenue flow meter. Zero key. A tick fires only when the rate CHANGES
# (ECB updates ~daily, weekends are static - no spam). First run records
# the cursor only (backfill suppression). Any HTTP/parse failure returns
# null (silent degrade, never blocks the scan).
# Events: FX_TICK (registered T2 2026-09-23). ASCII-only.

function Probe-fx {
  param($ctx)
  try {
    [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
    $u = 'https://api.frankfurter.app/latest?base=USD&symbols=CNY'
    $r = Invoke-RestMethod -Uri $u -TimeoutSec 10 -ErrorAction Stop
    if (-not $r.rates -or -not $r.rates.CNY) { return $null }
    $rate = [string][math]::Round([double]$r.rates.CNY, 4)
    $prev = ''
    if ($ctx.cursor.ContainsKey('fx_usdcny_last')) { $prev = [string]$ctx.cursor['fx_usdcny_last'] }
    if ($prev -ne '' -and $prev -ne $rate) {
      & $ctx.AddEvent 'FX_TICK' 'fx' 'fluxverse' 'quant' ('USDCNY ' + $rate + ' (prev ' + $prev + ')')
    }
    $ctx.cursor['fx_usdcny_last'] = $rate
    return @{ state = @{
      reality_fx_usdcny = $rate
      reality_fx_date = [string]$r.date
    } }
  } catch { return $null }
}
