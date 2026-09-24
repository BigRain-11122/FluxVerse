# Probe: group decisions ledger (FluxGroup docs/decisions.md) -> DECISION_MADE /
# DECISION_OVERRULED events (P-2026-09-24-34 slice 2, r64; both types registered
# T2 2026-09-24, veto window to 2026-10-01).
# Source row: | date | problem | origin | basis | decision | tier | status |
# Content-addressed cursor (r6 family law, hqorder:/bgorder: same pattern):
#   decision:<date>/<problem col first 30 chars>
# ('=' stripped from key material - it is the cursor line delimiter). A row is
# seen exactly once wherever it lands (multi-window mid-table inserts safe).
# Migration (first run, zero decision:* keys): TODAY-dated rows that never pulsed
# fire once (catch-up closes the blind spot; dedup authority = the live stream,
# so a same-day cursor wipe also self-limits); rows from PAST dates seed
# silently (no old-history replay). Family law as orders_hq/orders_bg/hq_feedback.
# Zone = owning subsystem taken from the exec-subsidiary designation: the tail
# of the DECISION column after the LAST occurrence of the CJK "executed by"
# marker (built from code points per the ASCII law). Whole-column scanning was
# rejected on day 1: passing mentions miszoned 2 of the 8 real rows (D-04
# "GAME/MEDIA registry line" text -> media while exec=HQ). Rows without the
# marker are group-level -> governance (honest default, first day-1 batch:
# mechanism row). Tail regexes as orders_hq family: BigMoney/fleet->quant,
# BigStream/media->media, MiniGame/Biggame/FluxVerse/gaming->gaming.
# DECISION_OVERRULED honest-silence law: fires ONLY when the row carries an
# explicit overrule marker in its STATUS column ("overrule" or the CJK pair for
# "rejected", built from code points per the ASCII law). The real ledger has no
# such marker today = zero OVERRULED events; the wiring is ready for the
# decision chain's re-report semantics. An in-place status flip on a row that
# already fired stays silent (r46 family law: status flips never re-fire).
# State face: decisions_total / decisions_open -> scan assembles them into
# governance (additive fields; verify only asserts ceo_orders_pending).

function Probe-decisions {
  param($ctx)
  try {
    $f = Join-Path $ctx.root 'docs\decisions.md'
    if (-not (Test-Path $f)) { return @{ state = @{ } } }
    $rows = @()
    foreach ($ln in (Get-Content $f -Encoding UTF8)) {
      if ($ln -match '^\|\s*\d{4}-\d{2}-\d{2}\s*\|') { $rows += $ln }
    }
    $fresh = @($ctx.cursor.Keys | Where-Object { $_ -like 'decision:*' }).Count -eq 0
    $fired = @{}
    if ($fresh -and $ctx.worldDir) {
      $evf = Join-Path $ctx.worldDir 'world-events.jsonl'
      if (Test-Path $evf) {
        foreach ($ev in (Get-Content $evf -Encoding UTF8)) {
          if ($ev -notmatch '"DECISION_') { continue }
          try { $o = $ev | ConvertFrom-Json } catch { continue }
          $t = [string]$o.type
          if (($t -eq 'DECISION_MADE' -or $t -eq 'DECISION_OVERRULED') -and ([string]$o.summary).StartsWith('decision ')) {
            $fired[[string]$o.summary] = $true
          }
        }
      }
    }
    $today = (Get-Date).ToString('yyyy-MM-dd')
    $rej = 'overrule|' + [string][char]0x9A73 + [string][char]0x56DE
    $total = 0
    $open = 0
    foreach ($r in $rows) {
      $c = $r -split '\|'
      if ($c.Count -lt 6) { continue }   # need date/problem/origin/basis/decision at minimum
      $date = $c[1].Trim()
      $prob = $c[2].Trim()
      $dec = $c[5].Trim()
      $status = ''
      if ($c.Count -ge 8) { $status = $c[7].Trim() }
      $total++
      if ($status -match 'pending') { $open++ }
      $execMark = [string][char]0x6267 + [string][char]0x884C + [string][char]0x53F8   # CJK "executed by"
      $zone = 'governance'
      $ei = $dec.LastIndexOf($execMark)
      if ($ei -ge 0) {
        $tail = $dec.Substring($ei)
        if ($tail -match 'BigMoney|fleet|quant') { $zone = 'quant' }
        elseif ($tail -match 'BigStream|media') { $zone = 'media' }
        elseif ($tail -match 'MiniGame|Biggame|FluxVerse|gaming') { $zone = 'gaming' }
      }
      $p30 = $prob -replace '=', ''
      if ($p30.Length -gt 30) { $p30 = $p30.Substring(0,30) }
      $key = 'decision:' + $date + '/' + $p30
      if ($ctx.cursor.ContainsKey($key)) { continue }
      $did = $date
      if ($prob -match '(D-\d{8}-\d{2})') { $did = $Matches[1] }
      $p60 = $prob
      if ($p60.Length -gt 60) { $p60 = $p60.Substring(0,60) + ([string][char]46 + [string][char]46 + [string][char]46) }
      # ledger discipline puts the D-ID at the head of the problem column - never
      # duplicate it into the summary (prefix detection, deterministic)
      $summary = 'decision ' + $p60
      if (-not $prob.StartsWith($did)) { $summary = 'decision ' + $did + ' ' + $p60 }
      $ctx.cursor[$key] = '1'
      $etype = 'DECISION_MADE'
      if ($status -match $rej) { $etype = 'DECISION_OVERRULED' }
      if (-not $fresh) {
        & $ctx.AddEvent $etype $did 'fluxgroup' $zone $summary
      } elseif ($date -eq $today -and -not $fired.ContainsKey($summary)) {
        & $ctx.AddEvent $etype $did 'fluxgroup' $zone $summary
      }
    }
    return @{ state = @{ decisions_total = $total; decisions_open = $open } }
  } catch { return $null }
}
