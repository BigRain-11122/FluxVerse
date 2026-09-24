# Probe: fleet inbox ingest (group transfer P-43 case 2, R-20260924-infra-2 3.2)
# Multi-machine spontaneous events ("beyond probe derivation") travel as batch
# files each machine commits to its OWN repo's inbox/ dir (write domain = the
# machine, git zero-conflict, 10min control-plane SLA). This probe is the
# single-writer consolidation step: it READ-ONLY enumerates the local clones'
# inbox dirs and routes every well-formed line through the same registry gate
# ($ctx.AddEvent) - registered types join the single stream, unregistered types
# land in quarantine (the gate does the routing; the probe never bypasses it).
# Emitter contract (each repo adopts its own emit helper; documented here):
#   - batch file = inbox/*.jsonl, one JSON object per line, six core fields
#     ts_utc/type/actor/repo/zone/summary (ts_utc optional; a well-formed
#     emitter ts survives, else scan stamps its own now)
#   - a batch file is IMMUTABLE once written: more events = a NEW file (a
#     consumed key is never re-read, so appending to a consumed file is lost)
#   - registry two-step law: a NEW event type must land in THIS repo's
#     schema/events-registry.json first (machines pull), only then may emitters
#     write it - an early emit lands in quarantine (forensic, manual replay)
# Dedup / consumption ledger: content-addressed cursor key
#   inbox:<repo>/<file> ('=' stripped - cursor line delimiter). The key IS the
#   processed/ ledger. Deviation from the brief's move-to-processed step, on
#   purpose: scan moving a sibling-repo file would break the read-only probe
#   law and dirty that repo's local clone tree (ledger P-2026-09-23-09
#   pull-lane disease). Batch archival to processed/ = emitter-side hygiene.
# Day-1 observation window (brief migration step 2): while the tracked flag
#   Tools/perceptor/inbox-live.flag is ABSENT the probe only counts batches/
#   files/lines (no stream writes, no cursor stamps - the first live pass must
#   still see every batch). A later round commits the flag to go live (step 3).
# Unreadable batch: counted bad, NOT stamped -> retried next round (transient
# locks self-heal; a permanently dead file costs one failed read per round).
# Encoding law: batch files are UTF-8; reads use .NET ReadAllLines (UTF-8
# detection = the r53/r63 safe face). Read-only (sibling repos, never a write).
# ASCII-only body. Self-limit: any failure returns $null (degrade, never block).

function Probe-inbox {
  param($ctx)
  try {
    $root = $ctx.root
    $flagPath = Join-Path $PSScriptRoot '..\inbox-live.flag'
    if ($ctx.ContainsKey('inbox_flag')) { $flagPath = $ctx['inbox_flag'] }
    $live = Test-Path -LiteralPath $flagPath
    $repos = [ordered]@{
      'fluxgroup'  = ''
      'minigame'   = 'gaming\MiniGame'
      'fluxverse'  = 'gaming\FluxVerse'
      'biglife'    = 'life\BigLife'
      'bigdomain'  = 'domain\BigDomain'
      'bigcompute' = 'compute\BigCompute'
      'bigmoney'   = 'quant\bigmoney'
      'bigstream'  = 'media\BigStream'
    }
    $batches = 0; $files = 0; $lines = 0; $routed = 0; $bad = 0; $replay = 0
    $newcur = @{}
    foreach ($rk in @($repos.Keys)) {
      $rel = $repos[$rk]
      $inb = $root
      if ($rel) { $inb = Join-Path $root $rel }
      $inb = Join-Path $inb 'inbox'
      if (-not (Test-Path -LiteralPath $inb)) { continue }
      $fl = @(Get-ChildItem -LiteralPath $inb -Filter '*.jsonl' -File -ErrorAction SilentlyContinue | Sort-Object Name)
      if ($fl.Count -eq 0) { continue }
      $batches++
      foreach ($f in $fl) {
        $key = 'inbox:' + $rk + '/' + ($f.Name -replace '=', '')
        if ($ctx.cursor.ContainsKey($key)) { $replay++; continue }
        if (-not $live) {
          # observe window: count only - no stream writes, no cursor stamps
          $files++
          try { $lines += @([System.IO.File]::ReadAllLines($f.FullName)).Count } catch { $bad++ }
          continue
        }
        $files++
        $lns = @()
        $readOk = $true
        try { $lns = [System.IO.File]::ReadAllLines($f.FullName) } catch { $bad++; $readOk = $false }
        if ($readOk) {
          foreach ($ln in $lns) {
            if (-not $ln) { continue }
            $lines++
            $o = $null
            try { $o = $ln | ConvertFrom-Json } catch { $bad++; continue }
            $t = ''
            if ($o) { $t = [string]$o.type }
            if (-not $t) { $bad++; continue }
            $ts = [string]$o.ts_utc
            if ($ts -notmatch '^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}Z$') { $ts = $ctx.now }
            & $ctx.AddEvent $t ([string]$o.actor) ([string]$o.repo) ([string]$o.zone) ([string]$o.summary) $ts
            $routed++
          }
          $newcur[$key] = 'done'
        }
      }
    }
    if ($batches -eq 0 -and $files -eq 0 -and $replay -eq 0) { return @{ state = @{} } }
    $st = @{ inbox_mode = 'live'; inbox_batches = $batches; inbox_files = $files
             inbox_lines = $lines; inbox_events = $routed; inbox_bad_lines = $bad
             inbox_replayed = $replay }
    if (-not $live) {
      # observe window: never stamp cursors (the first live pass must see these)
      $st = @{ inbox_mode = 'observe'; inbox_batches = $batches; inbox_files = $files
               inbox_lines = $lines; inbox_bad_lines = $bad }
      return @{ state = $st }
    }
    return @{ state = $st; newcur = $newcur }
  } catch { return $null }
}
