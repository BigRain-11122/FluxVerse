# Probe: BigMoney fleet transfers (quant\bigmoney\fleet\transfers) -> TRANSFER
# (P-12 slice 3, r95; type registered 2026-09-23 reserved, desc flipped to
# emitting r95; build unlocked by decision D-20260925-02).
# Face: paired write-once manifests from the fleet data-shipping tool
# transfer_manifest.ps1 v1.0 - '<transfer-id>-sender.json' (source side) and
# '<transfer-id>-receiver.json' (destination side), each { tool, path,
# file_count, total_bytes, full_hash, sampled[], files[] }. A transfer act is
# one pair; each leg is its own real registration fact (one face one event,
# orders family law), so a pair fires two TRANSFER events (shipment departs /
# shipment landed) - slice 4 can key its animation on the shared actor id.
# PS5.1 2MB trap: ConvertFrom-Json (JavaScriptSerializer) throws above ~2MB
# and the big manifests are 2.35MB - so this probe NEVER full-parses. It reads
# the head lines only (-TotalCount 40, explicit UTF8, template law 7/8) and
# regexes the scalar fields; the huge files[] tail is never loaded. Cost per
# round is 40 lines x 8 files regardless of manifest size.
# Actor honesty: the registry hint says 'machine id' but the face as built
# carries NO machine id (fields: tool/path/file_count/total_bytes/full_hash/
# sampled/files only) - so actor = the transfer id from the filename (stable
# per shipment). GATE family precedent r94: hint 'gate id', emitted actor
# 'verify' - the hint yields to the honest data-backed name. Zone = quant
# (fleet family: fleet_machines / fleet_tasks both emit zone quant).
# Cursor (content-addressed, r6 family law): transfer:<filename> = '<length>|
# <sha256-16 of head 40 lines>'. Same content re-copied (mtime touch) = same
# fingerprint = no refire; head or length edit = refire. '=' is stripped from
# key material (cursor lines are k=v).
# Fresh-run migration (decisions/ticklog family law): with no transfer:* keys
# at all, every manifest fires once, deduped against the live stream by
# type|summary - a same-day cursor wipe stays self-limiting. The existing
# historical manifests fire once at first landing (bounded backfill of real
# completed transfers - TRANSFER is event-sparse and slice 4 needs real rows
# in the stream); after that the cursor seals them, old history never replays.
# ts honesty (r65 Add-WorldEvent optional ts): the manifest has no time
# field; the file mtime (when the artifact landed on this face) converts to
# UTC - fallback scan now.
# Torn-write tolerance (ticklog law): a file with no tool AND no file_count
# line in its head is skipped silently and left UNSTAMPED - it retries every
# round and fires once the manifest completes.
# Contract: read-only, ASCII body, try/catch -> $null degrade (template laws).

function Probe-transfers {
  param($ctx)
  try {
    $dir = Join-Path $ctx.root 'quant\bigmoney\fleet\transfers'
    if (-not (Test-Path $dir)) { return @{ state = @{ } } }
    $files = @(Get-ChildItem $dir -Filter *.json | Sort-Object Name)
    if ($files.Count -eq 0) { return @{ state = @{ } } }

    # fresh-run = no transfer:* cursor key at all (decisions family law)
    $fresh = $true
    foreach ($k in @($ctx.cursor.Keys)) { if ($k -like 'transfer:*') { $fresh = $false; break } }

    # fresh-run dedup: what the live stream already pulsed stays silent
    $fired = @{}
    if ($fresh) {
      $evf = Join-Path $ctx.worldDir 'world-events.jsonl'
      if (Test-Path $evf) {
        foreach ($ev in (Get-Content $evf -Encoding UTF8)) {
          if ($ev -notmatch '"TRANSFER"') { continue }
          try { $o = $ev | ConvertFrom-Json } catch { continue }
          if ([string]$o.type -eq 'TRANSFER') { $fired[[string]$o.summary] = $true }
        }
      }
    }

    foreach ($f in $files) {
      $curKey = 'transfer:' + (($f.Name) -replace '=', '')
      $head = @(Get-Content $f.FullName -TotalCount 40 -Encoding UTF8)
      $fp = ''
      try {
        $sha = [System.Security.Cryptography.SHA256]::Create()
        try {
          $hb = [System.Text.Encoding]::UTF8.GetBytes(($head -join "`n"))
          $hex = [System.BitConverter]::ToString($sha.ComputeHash($hb)).Replace('-','').ToLowerInvariant()
        } finally { $sha.Dispose() }
        $fp = [string]$f.Length + '|' + $hex.Substring(0, 16)
      } catch { $fp = [string]$f.Length }
      if ($ctx.cursor.ContainsKey($curKey) -and [string]$ctx.cursor[$curKey] -eq $fp) { continue }

      # scalar fields off the head lines only (never full-parse: 2MB trap)
      $tool = ''; $pathRaw = ''; $count = -1; $bytes = -1; $hashWord = '?'
      foreach ($ln in $head) {
        if ($tool -eq '' -and $ln -match '^\s*"tool":\s*"([^"]*)"') { $tool = $Matches[1] }
        if ($pathRaw -eq '' -and $ln -match '^\s*"path":\s*"(.*)"\s*,?\s*$') { $pathRaw = $Matches[1] }
        if ($count -lt 0 -and $ln -match '^\s*"file_count":\s*([0-9]+)') { $count = [long]$Matches[1] }
        if ($bytes -lt 0 -and $ln -match '^\s*"total_bytes":\s*([0-9]+)') { $bytes = [long]$Matches[1] }
        if ($hashWord -eq '?' -and $ln -match '^\s*"full_hash":\s*(true|false)') { $hashWord = $Matches[1] }
      }
      if ($tool -eq '' -and $count -lt 0) { continue }   # not a manifest (yet): skip, unstamped

      # identity: '<transfer-id>-<side>.json' grammar; tolerance = whole basename
      $id = $f.BaseName; $side = 'unknown'
      if ($f.BaseName -match '^(.*)-(sender|receiver)$') { $id = $Matches[1]; $side = $Matches[2] }

      # payload flavor: last path segment (JSON backslash pairs unescaped)
      $what = ''
      if ($pathRaw -ne '') {
        $unescaped = $pathRaw -replace '\\\\', '\'
        $segs = @($unescaped -split '[\\/]')
        $what = [string]$segs[$segs.Count - 1]
      }
      if ($count -lt 0) { $count = 0 }
      if ($bytes -lt 0) { $bytes = 0 }
      $mb = [math]::Round($bytes / 1MB, 1)
      $sum = $id + ' ' + $side + ' ' + $count + ' files ' + $mb + 'MB hash=' + $hashWord + ' ' + $what

      # ts honesty: file mtime -> UTC (manifest carries no time field)
      $ts = $ctx.now
      try { $ts = $f.LastWriteTime.ToUniversalTime().ToString('yyyy-MM-ddTHH:mm:ssZ') } catch {}

      if (-not $fresh -or -not $fired.ContainsKey($sum)) {
        & $ctx.AddEvent 'TRANSFER' $id 'bigmoney' 'quant' $sum $ts
      }
      $ctx.cursor[$curKey] = $fp
    }
    return @{ state = @{ } }
  } catch { return $null }
}
