# probes/street_behavior.ps1
# r121: street-resident behavior face - data leg of P-75 M2 engine consumption.
# READ-ONLY consumes BigLife census/export/citizen-behavior.jsonl (deterministic
# snapshot per (time window, weather); R3 regenerable face produced by their
# Tools/behavior.py) and filters it down to the street roster ids (own repo
# City/Assets/Data/residents-street.json). State-only probe: emits NO events
# (zero T2); scan.ps1 assembles the additive state section street_behavior.
# Honesty: ctx (tw/wx window tags) + generated_utc (file mtime -> UTC) are
# forwarded so consumers can judge snapshot freshness themselves.
# Contract: laws 1-8 (read-only / ASCII body / Probe-<name> / try-catch degrade /
# registered in TECH sec.2+9 / no native capture / explicit UTF-8 reads / no
# world\ writes). Failures degrade to $null = section absent (zero consumer
# impact while BigLife export is missing).

function Probe-street_behavior {
  param($ctx)
  try {
    $rosterPath = Join-Path $ctx.root 'gaming\FluxVerse\City\Assets\Data\residents-street.json'
    $behPath = Join-Path $ctx.root 'life\BigLife\census\export\citizen-behavior.jsonl'
    if (-not (Test-Path $rosterPath)) { return $null }
    if (-not (Test-Path $behPath)) { return $null }

    # roster: street seats (r98 fluxverse-street/0.1); emit order = slot ascending
    $roster = Get-Content $rosterPath -Raw -Encoding UTF8 | ConvertFrom-Json
    if (-not $roster.slots) { return $null }
    $byId = @{}
    $order = New-Object System.Collections.ArrayList
    $sorted = @($roster.slots | Sort-Object { if ($null -ne $_.slot) { [int]$_.slot } else { 9999 } })
    foreach ($s in $sorted) {
      if (-not $s.id) { continue }
      if (-not $byId.ContainsKey([string]$s.id)) {
        [void]$order.Add([string]$s.id)
        $byId[[string]$s.id] = $s
      }
    }
    if ($order.Count -eq 0) { return $null }

    # behavior snapshot: cheap regex id pre-filter per line, full JSON parse
    # only for roster hits (10003-line file, <=32 full parses per round)
    $idRe = [regex]'"id":\s*"([A-Z]-\d{5})"'
    $beh = @{}
    $ctxStr = ''
    foreach ($ln in [System.IO.File]::ReadAllLines($behPath)) {
      $m = $idRe.Match($ln)
      if (-not $m.Success) { continue }
      $cid = $m.Groups[1].Value
      if (-not $byId.ContainsKey($cid)) { continue }
      if ($beh.ContainsKey($cid)) { continue }
      try { $o = $ln | ConvertFrom-Json } catch { continue }
      if (-not $ctxStr -and $o.ctx) { $ctxStr = [string]$o.ctx }
      $beh[$cid] = $o
    }

    # seats: roster order; missing ids degrade to state=nodata + visible=1
    # (engine keeps grandfather static presence for nodata seats)
    $seats = New-Object System.Collections.ArrayList
    $nodata = 0
    $visCount = 0
    foreach ($cid in $order) {
      $meta = $byId[$cid]
      if ($beh.ContainsKey($cid)) {
        $o = $beh[$cid]
        $st = [string]$o.state
        if (-not $st) { $st = 'nodata' }
        $v = 0
        try { $v = [int]$o.visible } catch { $v = 0 }
        $q = ''
        if ($o.quirk) { $q = [string]$o.quirk }
        $rec = 0
        try { if ($o.recovering) { $rec = 1 } } catch { $rec = 0 }
        if ($st -eq 'nodata') { $nodata++ }
        if ($v -eq 1) { $visCount++ }
        [void]$seats.Add([ordered]@{ slot = [int]$meta.slot; go = [string]$meta.go; id = $cid; state = $st; visible = $v; quirk = $q; recovering = $rec })
      } else {
        $nodata++
        [void]$seats.Add([ordered]@{ slot = [int]$meta.slot; go = [string]$meta.go; id = $cid; state = 'nodata'; visible = 1; quirk = ''; recovering = 0 })
      }
    }

    $gen = (Get-Item $behPath).LastWriteTime.ToUniversalTime().ToString('yyyy-MM-ddTHH:mm:ss') + 'Z'
    return @{ state = @{
      streetbeh_ctx = $ctxStr
      streetbeh_generated_utc = $gen
      streetbeh_total = [int]$order.Count
      streetbeh_visible = $visCount
      streetbeh_nodata = $nodata
      streetbeh_seats = $seats.ToArray()
    } }
  } catch {
    return $null
  }
}
