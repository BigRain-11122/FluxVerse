# Probe: BigStream render output face (media/BigStream/output/renders/*.mp4)
#   -> MEDIA_OUTPUT events + state mediaout_* (MEDIA city tower / render pool).
# Backlog line "[P2] MiniGame task panel / BigStream output probe" - BigStream
# half claimed r47. HONESTY LAW: renders are TEST PIECES per BigStream's own
# render ledger (output/renders/README.md, "test piece, not finished product"),
# and their readiness face is honest too (all drafts GATE PENDING, accounts not
# open, nothing published) - so a render drop is real production-line render/TTS
# labor = MEDIA_OUTPUT, NOT a publish; the publish face stays CONTENT_PUBLISH
# (reserved, zero events until BigStream really ships). The mp4 binaries are
# gitignored in BigStream (their ledger README is the account), so COMMIT events
# cannot see render drops - this probe closes that blind spot.
# Scope v0: top-level *.mp4 only. Dot-dirs (.v*-tmp scratch intermediates, the
# ledger declares them non-artifacts) and README.md are not render artifacts.
# Cursor law (r6 content-addressed family): one key per artifact  bsout:<name>
# ('=' stripped - it is the cursor line delimiter), so an artifact is seen
# exactly once; BigStream bumps versions in FILENAMES (v3, v4 ... v10), so a new
# iteration = a new path = a new key = one event; an in-place overwrite of the
# same name keeps the key = silent (a re-run, not a new artifact).
# Migration (first run, no bsout:* keys): TODAY-dated files that never pulsed
# fire once (dedup authority = the live event stream, which only holds today);
# PAST-dated files seed their cursor keys silently - no old-history replay.
# Read-only (sibling repo, never a write). ASCII-only body (encoding law: CJK
# lives only in the data). Self-limit: any failure returns $null (degrade,
# never block the city scan). Event type registered: MEDIA_OUTPUT (T2 2026-09-24).

function Probe-bigstream_output {
  param($ctx)
  try {
    $dir = Join-Path $ctx.root 'media\BigStream\output\renders'
    if (-not (Test-Path $dir)) { return @{ state = @{ } } }
    $fresh = @($ctx.cursor.Keys | Where-Object { $_ -like 'bsout:*' }).Count -eq 0
    # migration only: today's output events already fired (dedup authority)
    $fired = @{}
    if ($fresh -and $ctx.worldDir) {
      $evf = Join-Path $ctx.worldDir 'world-events.jsonl'
      if (Test-Path $evf) {
        foreach ($ev in (Get-Content $evf -Encoding UTF8)) {
          if ($ev -notmatch '"MEDIA_OUTPUT"') { continue }
          try { $o = $ev | ConvertFrom-Json } catch { continue }
          if ([string]$o.type -eq 'MEDIA_OUTPUT') { $fired[[string]$o.summary] = $true }
        }
      }
    }
    $today = (Get-Date).ToString('yyyy-MM-dd')
    $files = @(Get-ChildItem $dir -File -Filter *.mp4 | Sort-Object LastWriteTime)
    $total = $files.Count
    $bytes = [long]0
    $lastName = ''
    $lastUtc = ''
    foreach ($f in $files) {
      $bytes += $f.Length
      $lastName = $f.Name
      $lastUtc = $f.LastWriteTimeUtc.ToString('yyyy-MM-ddTHH:mm:ssZ')
      $kmat = ($f.Name -replace '=', '')
      $key = 'bsout:' + $kmat
      if ($ctx.cursor.ContainsKey($key)) { continue }
      $sum = 'render ' + $f.Name
      $ctx.cursor[$key] = '1'
      if (-not $fresh) {
        & $ctx.AddEvent 'MEDIA_OUTPUT' 'bigstream' 'bigstream' 'media' $sum
      } elseif ($f.LastWriteTime.ToString('yyyy-MM-dd') -eq $today -and -not $fired.ContainsKey($sum)) {
        # migration: today's artifact that never pulsed -> backfill the missed event once
        & $ctx.AddEvent 'MEDIA_OUTPUT' 'bigstream' 'bigstream' 'media' $sum
      }
    }
    return @{ state = @{ mediaout_renders_total = $total; mediaout_renders_bytes = $bytes
                         mediaout_last_render = $lastName; mediaout_last_render_utc = $lastUtc } }
  } catch { return $null }
}
