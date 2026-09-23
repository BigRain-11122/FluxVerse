# Probe: HQ orders ledger (FluxGroup docs/orders.md) -> CEO_ORDER events + pending count
# F2 fix: group audit face was uncovered. Events: CEO_ORDER (registered)
# Consolidated 2026-09-23: any-date row pattern (no hardcoded dates), zone derived
# from the landing-cell keywords (tower pulse needs a direction), row-count cursor
# with backfill suppression on first run.

function Probe-orders_hq {
  param($ctx)
  try {
    $pending = 0
    $f = Join-Path $ctx.root 'docs\orders.md'
    if (-not (Test-Path $f)) { return @{ state = @{ } } }
    $rows = @()
    foreach ($ln in (Get-Content $f -Encoding UTF8)) {
      if ($ln -match '^\|\s*\d{2}-\d{2}\s*~') { $rows += $ln }
    }
    if (-not $ctx.cursor.ContainsKey('ledger_rows')) {
      $ctx.cursor['ledger_rows'] = [string]$rows.Count
    } else {
      $seen = 0
      try { $seen = [int]$ctx.cursor['ledger_rows'] } catch {}
      $i = 0
      foreach ($r in $rows) {
        $i++
        if ($i -le $seen) { continue }
        $c = $r -split '\|'
        if ($c.Count -lt 4) { continue }
        $time = $c[1].Trim()
        $quote = $c[2].Trim()
        $dest = $c[3].Trim()
        $status = ''
        if ($c.Count -ge 5) { $status = $c[4].Trim() }
        if ($status -match 'executing') { $pending++ }
        $zone = 'governance'
        if ($dest -match 'BigMoney|fleet|quant') { $zone = 'quant' }
        elseif ($dest -match 'BigStream|media') { $zone = 'media' }
        elseif ($dest -match 'MiniGame|Biggame|FluxVerse|gaming') { $zone = 'gaming' }
        if ($quote.Length -gt 60) { $quote = $quote.Substring(0,60) + ([string][char]46 + [string][char]46 + [string][char]46) }
        & $ctx.AddEvent 'CEO_ORDER' 'CEO' 'fluxgroup' $zone ('ledger ' + $time + ' ' + $quote)
      }
      $ctx.cursor['ledger_rows'] = [string]$rows.Count
    }
    return @{ state = @{ ceo_orders_hq_rows = $pending } }
  } catch { return $null }
}
