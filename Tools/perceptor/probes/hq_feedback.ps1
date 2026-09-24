# Probe: HQ feedback face (own-repo root HQ-FEEDBACK.md) -> HQ_FEEDBACK events
#   + governance.hq_feedback_open (open feedback rows pending group intake).
# Backlog line "[P2] HQ-FEEDBACK perception probe" closed r46. The feedback face
# is the city->group up-channel (evolution.md sec.7 face format: one row per
# receipt, "| F-<date>-<NN> | urgency | phenomenon | evidence | suggest | status |").
# Group audit P-2026-09-23-10 law (r6): the cursor is CONTENT-ADDRESSED, one key
# per row  hqfb:<F-ID>/<first 30 chars of the phenomenon column>  ('=' stripped -
# it is the cursor line delimiter), so a row is seen exactly once wherever it
# lands in the table (multi-window mid-table inserts can never skip or re-fire).
# A materially edited row (phenomenon changed) gets a new key = one re-fire; a
# status flip alone (open->done) keeps the key = no re-fire, only the open count
# moves. Migration (first run, no hqfb:* keys): TODAY-dated rows that never pulsed
# fire once (dedup authority = the live event stream, which only holds today);
# rows from PAST dates seed their cursor keys silently - no old-history replay.
# Read-only (own repo file, never a sibling). ASCII-only body (encoding law:
# CJK lives only in the data). Self-limit: any failure returns null (degrade,
# never block the city scan). Event type registered: HQ_FEEDBACK (T2 2026-09-24).

function Probe-hq_feedback {
  param($ctx)
  try {
    $repoDir = Split-Path $ctx.worldDir -Parent      # world/ -> repo root
    $f = Join-Path $repoDir 'HQ-FEEDBACK.md'
    if (-not (Test-Path $f)) { return @{ state = @{ } } }
    $rows = @()
    foreach ($ln in (Get-Content $f -Encoding UTF8)) {
      if ($ln -match '^\|\s*F-\d{8}-\d{2}\s*\|') { $rows += $ln }
    }
    $fresh = @($ctx.cursor.Keys | Where-Object { $_ -like 'hqfb:*' }).Count -eq 0
    # migration only: today's feedback events already fired (dedup authority)
    $fired = @{}
    if ($fresh -and $ctx.worldDir) {
      $evf = Join-Path $ctx.worldDir 'world-events.jsonl'
      if (Test-Path $evf) {
        foreach ($ev in (Get-Content $evf -Encoding UTF8)) {
          if ($ev -notmatch '"HQ_FEEDBACK"') { continue }
          try { $o = $ev | ConvertFrom-Json } catch { continue }
          if ([string]$o.type -eq 'HQ_FEEDBACK') { $fired[[string]$o.summary] = $true }
        }
      }
    }
    $today = 'F-' + (Get-Date).ToString('yyyyMMdd')   # F-ID format: F-YYYYMMDD-NN
    $open = 0
    foreach ($r in $rows) {
      $c = $r -split '\|'
      if ($c.Count -lt 7) { continue }              # malformed row: skip, never count
      $id = $c[1].Trim()
      $urg = $c[2].Trim()
      $phen = $c[3].Trim()
      $status = $c[6].Trim()
      if ($status -match 'open') { $open++ }
      $p30 = $phen -replace '=', ''
      if ($p30.Length -gt 30) { $p30 = $p30.Substring(0, 30) }
      $key = 'hqfb:' + $id + '/' + $p30
      if ($ctx.cursor.ContainsKey($key)) { continue }
      $s60 = $phen
      if ($s60.Length -gt 60) { $s60 = $s60.Substring(0, 60) + '...' }
      $summary = $id + ' ' + $urg + ' ' + $s60
      $ctx.cursor[$key] = '1'
      if (-not $fresh) {
        & $ctx.AddEvent 'HQ_FEEDBACK' 'fluxverse' 'fluxverse' 'governance' $summary
      } elseif ($id.StartsWith($today) -and -not $fired.ContainsKey($summary)) {
        # migration: today's row that never pulsed -> backfill the missed event once
        & $ctx.AddEvent 'HQ_FEEDBACK' 'fluxverse' 'fluxverse' 'governance' $summary
      }
    }
    return @{ state = @{ hq_feedback_open = $open } }
  } catch { return $null }
}
