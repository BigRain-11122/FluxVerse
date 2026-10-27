# Probe: Biggame U-order ledger (gaming/MiniGame/Design/configs/GLOBAL/<CJK name>.md)
# -> CEO_ORDER events, gaming face. Group audit P-2026-09-23-13 (P-13) DevLoop
# slice: the audit found the GAME city's CEO-order face uncovered (orders /
# orders_bs / orders_hq cover quant / media / governance); the probe was gated
# on Biggame settling its SINGLE U-order ledger face under its own autonomy.
# Settled 2026-09-24: Design/configs/GLOBAL/ holds THE ledger (their doc-10
# sec.4 authority column cites it as the registry; rows run U001..U176+).
# Row law: table rows of shape | U176 | 2026-09-24 | <quote> | <topic> |
# <status> | - family-range rows (U140-U161) never match; their sec.0 quick
# table never matches (rows start with stage glyphs, not U-tokens).
# Cursor law = r6 content-addressed family (hqorder:/bsorder: pattern):
#   bgorder:<row-date>/<quote first 30 chars>
# '=' stripped from key material (cursor line delimiter). A row is seen exactly
# once wherever it lands; a materially edited row gets a new key and re-fires
# once as a new signal (r46 law); a row landing anywhere (multi-window insert
# displacement) is never lost nor double-fired.
# Migration law (r6/r46/r47/r48 family): first run (no bgorder:* keys) backfills
# only TODAY-dated rows that never pulsed - dedup authority = the live event
# stream (which only ever holds today's events); past-date rows seed their keys
# silently, zero old-history replay. Post-fresh, a new key fires once (new
# registration or material edit).
# ASCII law: the ledger filename is CJK - built from codepoints, never literal.
# Path law (r686, main#24): the 2026-10-04 MiniGame GLOBAL restructuring split
# the flat directory into 正典//台账//档案/ - the ledger moved to
# Design/configs/GLOBAL/<台账>/<用户限制登记簿>.md while the OLD flat path kept a
# 493-byte POINTER STUB under 正典/ (the stub is a pointer, never the ledger).
# The probe kept reading the pre-10-04 flat path, i.e. a file that no longer
# exists anywhere, and reported an empty state that scan printed as "OK".
# Measured 2026-10-28: <台账>/<ledger> = 699,069 B / 363 U-rows.

function Probe-orders_bg {
  param($ctx)
  try {
    # CJK path parts via codepoints (encoding law: no CJK literals in script body)
    $ledgerName = -join @([char]0x7528,[char]0x6237,[char]0x9650,[char]0x5236,[char]0x767B,[char]0x8BB0,[char]0x7C3F)
    $tanName = -join @([char]0x53F0,[char]0x8D26)
    $f = Join-Path $ctx.root ('gaming\MiniGame\Design\configs\GLOBAL\' + $tanName + '\' + $ledgerName + '.md')
    if (-not (Test-Path -LiteralPath $f)) { return @{ state = @{ }; matched = 0; expect_min_rows = 20 } }
    $rows = @()
    foreach ($ln in (Get-Content $f -Encoding UTF8)) {
      if ($ln -match '^\|\s*U\d{3}\s*\|') { $rows += $ln }
    }
    $fresh = @($ctx.cursor.Keys | Where-Object { $_ -like 'bgorder:*' }).Count -eq 0
    # migration only: today's ledger events already fired (dedup authority)
    $fired = @{}
    if ($fresh -and $ctx.worldDir) {
      $evf = Join-Path $ctx.worldDir 'world-events.jsonl'
      if (Test-Path $evf) {
        foreach ($ev in (Get-Content $evf -Encoding UTF8)) {
          if ($ev -notmatch '"CEO_ORDER"') { continue }
          try { $o = $ev | ConvertFrom-Json } catch { continue }
          if ([string]$o.type -eq 'CEO_ORDER' -and ([string]$o.summary).StartsWith('uorder ')) {
            $fired[[string]$o.summary] = $true
          }
        }
      }
    }
    $today = (Get-Date).ToString('yyyy-MM-dd')
    foreach ($r in $rows) {
      $c = $r -split '\|'
      if ($c.Count -lt 4) { continue }                    # malformed row: honest skip
      $unum = $c[1].Trim()
      $date = $c[2].Trim()
      if ($date -notmatch '^\d{4}-\d{2}-\d{2}$') { continue }
      $quote = $c[3].Trim()
      if ($quote.Length -lt 2) { continue }               # degenerate row: honest skip
      $q30 = $quote -replace '=', ''
      if ($q30.Length -gt 30) { $q30 = $q30.Substring(0,30) }
      $key = 'bgorder:' + $date + '/' + $q30
      if ($ctx.cursor.ContainsKey($key)) { continue }
      $quote60 = $quote
      if ($quote60.Length -gt 60) { $quote60 = $quote60.Substring(0,60) + ([string][char]46 + [string][char]46 + [string][char]46) }
      $summary = 'uorder ' + $unum + ' ' + $quote60
      $ctx.cursor[$key] = '1'
      # r686 (main#24): a row never seen before whose date is in the PAST is
      # history we simply never read (this probe's path was dead 10-04..10-28),
      # not a new order. The documented migration law - "past-date rows seed
      # their keys silently, zero old-history replay" - is therefore applied
      # unconditionally: seeding above is enough, only a TODAY-dated row pulses.
      # (Pre-repair code fired unseen past rows; with the path fixed that would
      # have replayed ~59 historical U-orders into today's stream as if CEO had
      # issued them today.)
      if ($date -ne $today) { continue }
      if ($fresh) {
        if (-not $fired.ContainsKey($summary)) {
          # migration: today's row that never pulsed -> backfill the missed event once
          & $ctx.AddEvent 'CEO_ORDER' 'CEO' 'biggame' 'gaming' $summary
        }
      } else {
        & $ctx.AddEvent 'CEO_ORDER' 'CEO' 'biggame' 'gaming' $summary
      }
    }
    return @{ state = @{ bgorder_rows = $rows.Count }; matched = $rows.Count; expect_min_rows = 20 }
  } catch { return $null }
}
