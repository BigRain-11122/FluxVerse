# Probe: CPH4 evolution ledger -> proposal counts + PROPOSAL_NEW / PROPOSAL_APPLIED
# events (P-2026-09-24-39 city-future sandbox data leg, r164; both types were
# registered T2 2026-09-25, veto window to 2026-10-02 - first-register law was
# satisfied at registration, desc flips reserved -> emitting with this landing).
# Source row: | ID | date | phenomenon | evidence | advice | tier | status |
# ID-addressed cursors (r6 content-addressed family; the ledger's own number-
# occupation law keeps P-IDs unique, key material is pure ASCII):
#   prop:<P-ID>    row entered the ledger     -> PROPOSAL_NEW (fires once per
#                  row wherever it lands; a renumbered retwork row = new row =
#                  new fire - honest under the append-only ledger discipline)
#   propap:<P-ID>  row reached closure state -> PROPOSAL_APPLIED (in-place
#                  status flips never re-fire NEW, r46 family law)
# ('=' stripped from key material - it is the cursor-line delimiter).
# Migration (first run of a family, zero keys): TODAY-dated rows that never
# pulsed fire once (dedup authority = the live stream, so a same-day cursor
# wipe also self-limits); PAST rows seed silently (no old-history replay).
# Same family law as decisions:/orders_hq:/bgorder:.
# Closure honesty (narrow law, DECISION_OVERRULED same shape): APPLIED fires
# ONLY on the ledger's own closure vocabulary as the head token of the status
# cell (leading markdown '*' noise trimmed): applied|executed|self-healed|
# fixed|resolved|done. NOT fired: open|executing|transferred|rejected (handed
# off is not landed - execution truth lives in the receipt chain) and prose
# states outside the declared vocabulary (honest silence, no guessing).
# Zone: governance for both types - the evolution ledger is a group-governance
# artifact and the registered city face (city-future sandbox) is a governance
# facility; per-subsidiary execution routing already belongs to the
# DECISION/CEO_ORDER families. Actor = the P-ID (transfers id honesty law).
# State face: evolution_open (kept, now a precise open-row count - the old raw
# substring census over-counted header/noise text) + proposals_total +
# proposals_applied -> scan assembles them into governance.evolution
# (additive fields; verify only asserts ceo_orders_pending).

function Probe-evolution {
  param($ctx)
  try {
    $ledger = Join-Path $ctx.root 'cph4\evolution-ledger.md'
    if (-not (Test-Path $ledger)) { return @{ state = @{ } } }
    $rows = @()
    foreach ($ln in (Get-Content $ledger -Encoding UTF8)) {
      if ($ln -match '^\|\s*(P-\d{4}-\d{2}-\d{2}-\d{2,3})\s*\|') { $rows += $ln }
    }
    $freshNew = @($ctx.cursor.Keys | Where-Object { $_ -like 'prop:*' }).Count -eq 0
    $freshAp  = @($ctx.cursor.Keys | Where-Object { $_ -like 'propap:*' }).Count -eq 0
    $fired = @{}
    if (($freshNew -or $freshAp) -and $ctx.worldDir) {
      $evf = Join-Path $ctx.worldDir 'world-events.jsonl'
      if (Test-Path $evf) {
        foreach ($ev in (Get-Content $evf -Encoding UTF8)) {
          if ($ev -notmatch '"PROPOSAL_') { continue }
          try { $o = $ev | ConvertFrom-Json } catch { continue }
          $t = [string]$o.type
          if (($t -eq 'PROPOSAL_NEW' -or $t -eq 'PROPOSAL_APPLIED') -and ([string]$o.summary).StartsWith('proposal ')) {
            $fired[[string]$o.summary] = $true
          }
        }
      }
    }
    $today = (Get-Date).ToString('yyyy-MM-dd')
    $fwPo = [string][char]0xFF08                    # fullwidth '(' opening CJK status notes
    $dots = [string][char]0x2E + [string][char]0x2E + [string][char]0x2E   # '...'
    $total = 0; $open = 0; $applied = 0
    foreach ($r in $rows) {
      $c = $r -split '\|'
      if ($c.Count -lt 8) { continue }               # need ID..status cells
      $prow = $c[1].Trim()
      if ($prow -notmatch '^P-\d{4}-\d{2}-\d{2}-') { continue }
      $prowDate = ''
      if ($prow -match '^P-(\d{4}-\d{2}-\d{2})-') { $prowDate = $Matches[1] }
      $phen = $c[3].Trim()
      $status = $c[7].Trim()
      $total++
      $head = (($status.Trim('*')) -split ('[()' + $fwPo + '\s]'))[0]
      if ($head -eq 'open') { $open++ }
      $isClosed = ($head -eq 'applied' -or $head -eq 'executed' -or $head -eq 'self-healed' -or $head -eq 'fixed' -or $head -eq 'resolved' -or $head -eq 'done')
      if ($isClosed) { $applied++ }
      $p60 = $phen
      if ($p60.Length -gt 60) { $p60 = $p60.Substring(0,60) + $dots }
      $pkey = 'prop:' + ($prow -replace '=', '')
      if (-not $ctx.cursor.ContainsKey($pkey)) {
        $ctx.cursor[$pkey] = '1'
        $nsum = 'proposal ' + $prow + ' ' + $p60
        if (-not $freshNew) {
          & $ctx.AddEvent 'PROPOSAL_NEW' $prow 'fluxgroup' 'governance' $nsum
        } elseif ($prowDate -eq $today -and -not $fired.ContainsKey($nsum)) {
          & $ctx.AddEvent 'PROPOSAL_NEW' $prow 'fluxgroup' 'governance' $nsum
        }
      }
      if ($isClosed) {
        $akey = 'propap:' + ($prow -replace '=', '')
        if (-not $ctx.cursor.ContainsKey($akey)) {
          $ctx.cursor[$akey] = '1'
          $asum = 'proposal applied ' + $prow + ' ' + $p60
          if (-not $freshAp) {
            & $ctx.AddEvent 'PROPOSAL_APPLIED' $prow 'fluxgroup' 'governance' $asum
          } elseif ($prowDate -eq $today -and -not $fired.ContainsKey($asum)) {
            & $ctx.AddEvent 'PROPOSAL_APPLIED' $prow 'fluxgroup' 'governance' $asum
          }
        }
      }
    }
    return @{ state = @{ evolution_open = $open; proposals_total = $total; proposals_applied = $applied } }
  } catch { return $null }
}
