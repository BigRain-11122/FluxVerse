# Probe: HQ orders ledger (FluxGroup docs/orders.md) -> CEO_ORDER events + pending count
# F2 fix: group audit face was uncovered. Events: CEO_ORDER (registered)
# Group audit P-2026-09-23-10 (r6): the old row-count position cursor lost rows
# inserted ABOVE the cursor line (multi-window mid-table inserts -> 4 of 7 CEO
# orders never pulsed + one double-fire). Now content-addressed, same pattern
# as the bsorder:/order: keys: one cursor key per row
#   hqorder:<time>/<quote first 30 chars>
# so a row is seen exactly once wherever it lands. Migration (first run, no
# hqorder:* keys yet): every TODAY-dated row that never pulsed fires its event
# once - a one-time catch-up that closes the audit blind spot and completes
# the day-1 chronicle (the city itself was born today; no engine consumes
# the stream yet, so there is no live flash-burst to worry about). Dedup
# authority = the live event stream, which only ever holds today's events:
# already-pulsed rows stay silent, so re-migration after a cursor wipe also
# self-limits. Rows from PAST dates seed silently (no old-history replay).
# Note: '=' is stripped from the key material - it is the cursor line delimiter.

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
    $fresh = @($ctx.cursor.Keys | Where-Object { $_ -like 'hqorder:*' }).Count -eq 0
    # migration only: today's ledger events already fired (dedup authority)
    $fired = @{}
    if ($fresh -and $ctx.worldDir) {
      $evf = Join-Path $ctx.worldDir 'world-events.jsonl'
      if (Test-Path $evf) {
        foreach ($ev in (Get-Content $evf -Encoding UTF8)) {
          if ($ev -notmatch '"CEO_ORDER"') { continue }
          try { $o = $ev | ConvertFrom-Json } catch { continue }
          if ([string]$o.type -eq 'CEO_ORDER' -and ([string]$o.summary).StartsWith('ledger ')) {
            $fired[[string]$o.summary] = $true
          }
        }
      }
      if ($ctx.cursor.ContainsKey('ledger_rows')) { $ctx.cursor.Remove('ledger_rows') }  # retire the position cursor
    }
    $today = (Get-Date).ToString('MM-dd')
    foreach ($r in $rows) {
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
      $q30 = $quote -replace '=', ''
      if ($q30.Length -gt 30) { $q30 = $q30.Substring(0,30) }
      $key = 'hqorder:' + $time + '/' + $q30
      if ($ctx.cursor.ContainsKey($key)) { continue }
      $quote60 = $quote
      if ($quote60.Length -gt 60) { $quote60 = $quote60.Substring(0,60) + ([string][char]46 + [string][char]46 + [string][char]46) }
      $summary = 'ledger ' + $time + ' ' + $quote60
      $ctx.cursor[$key] = '1'
      if (-not $fresh) {
        & $ctx.AddEvent 'CEO_ORDER' 'CEO' 'fluxgroup' $zone $summary
      } elseif ($time.StartsWith($today) -and -not $fired.ContainsKey($summary)) {
        # migration: today's row that never pulsed -> backfill the missed event once
        & $ctx.AddEvent 'CEO_ORDER' 'CEO' 'fluxgroup' $zone $summary
      }
    }
    return @{ state = @{ ceo_orders_hq_rows = $pending } }
  } catch { return $null }
}
