# Probe: BigStream city-bridge outbox face (media/BigStream/output/city-events-outbox.jsonl)
#   -> MEDIA_OUTPUT / CONTENT_PUBLISH events (content x city loop file bridge).
# Mandate: D-20261019-07 / council case C-20261019-01 (CEO order 2026-10-19 15:3x
# "content must really loop back into the city"). BigStream share = media-pool
# schedule ledger + drama/growth event emission probe. Council ruling sec.6.5:
# the emitter belongs to the content side and MUST NOT write world-events.jsonl
# directly (P-43 single-writer law) - BigStream appends events to an outbox
# inside its OWN repo (tools/city_event_register.py, append-only), and THIS
# probe reads that outbox read-only and emits through the perceptor scan, the
# only stream writer. Zero schema change (ruling: reuse registered types):
#   MEDIA_OUTPUT      content production milestone: artifact drop / jman growth
#                     milestone / drama beat happening in the city
#   CONTENT_PUBLISH   reserved - stays zero-emission until a real publish
#                     (honesty law, r47 family: nothing is published yet)
# Cursor law (content-addressed, r6 family): one key per outbox line
# 'bscev:<sha256[0..15]>' so a line is seen exactly once. The register tool is
# append-only (editing a line in place would change its hash and re-fire it;
# that is a writer-side violation the tool refuses, probe stays honest).
# Read-only (sibling repo, never a write). ASCII-only body (encoding law: CJK
# lives only in data). Data-file encoding law (r53): every read carries an
# explicit -Encoding UTF8. Self-limit: any failure returns $null (degrade,
# never block the city scan). Registered 2026-10-19, event types pre-registered
# in schema/events-registry.json (MEDIA_OUTPUT T2 2026-09-24).

function Probe-bigstream_city_events {
  param($ctx)
  try {
    $f = Join-Path $ctx.root 'media\BigStream\output\city-events-outbox.jsonl'
    if (-not (Test-Path $f)) { return @{ state = @{ } } }
    $sha = New-Object System.Security.Cryptography.SHA256CryptoServiceProvider
    $total = 0
    foreach ($line in (Get-Content $f -Encoding UTF8)) {
      if ([string]::IsNullOrWhiteSpace($line)) { continue }
      $total++
      $bytes = [System.Text.Encoding]::UTF8.GetBytes($line.TrimEnd())
      $hex = ($sha.ComputeHash($bytes) | ForEach-Object { $_.ToString('x2') }) -join ''
      $key = 'bscev:' + $hex.Substring(0, 16)
      if ($ctx.cursor.ContainsKey($key)) { continue }
      try { $o = $line | ConvertFrom-Json } catch { continue }
      $t = [string]$o.type
      if ($t -ne 'MEDIA_OUTPUT' -and $t -ne 'CONTENT_PUBLISH') { continue }
      $ctx.cursor[$key] = '1'
      & $ctx.AddEvent $t ([string]$o.actor) ([string]$o.repo) ([string]$o.zone) ([string]$o.summary)
    }
    $sha.Dispose()
    return @{ state = @{ bs_cityevents_total = $total } }
  } catch { return $null }
}
