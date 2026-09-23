# Probe: GitHub public activity of the group account (ecosystem pulse on the
# data avenue). Zero key, public endpoint, unauthenticated rate limit 60/h is
# plenty for one call per 10-min scan. Cursor = newest event id seen; a scan
# emits only NEW events (chronological order, capped at 10 so a long offline
# gap cannot flood the stream). First run records the cursor only (backfill
# suppression). Any HTTP/rate-limit failure returns null (silent degrade).
# Events: GITHUB_EVENT (registered T2 2026-09-23). ASCII-only.

function Probe-github_events {
  param($ctx)
  try {
    [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
    $u = 'https://api.github.com/users/BigRain-11122/events/public'
    $h = @{ 'User-Agent' = 'FluxVerse-perceptor' }
    $r = Invoke-RestMethod -Uri $u -Headers $h -TimeoutSec 15 -ErrorAction Stop
    if (-not $r) { return $null }
    $evs = @($r | Sort-Object { [double]$_.id })
    if ($evs.Count -eq 0) { return $null }
    $newest = [string]$evs[$evs.Count - 1].id

    $emitted = 0
    $prevId = ''
    if ($ctx.cursor.ContainsKey('github_last_id')) { $prevId = [string]$ctx.cursor['github_last_id'] }
    if ($prevId -eq '') {
      $ctx.cursor['github_last_id'] = $newest          # first run: cursor only
    } else {
      $fresh = @($evs | Where-Object { [double]$_.id -gt [double]$prevId })
      if ($fresh.Count -gt 10) { $fresh = @($fresh | Select-Object -Last 10) }
      foreach ($e in $fresh) {
        $rn = [string]$e.repo.name
        $short = $rn
        if ($short -like '*/*') { $short = $short.Substring($short.LastIndexOf('/') + 1) }
        $zone = 'governance'
        if ($short -match 'MiniGame|Biggame|FluxVerse') { $zone = 'gaming' }
        elseif ($short -match 'BigMoney|bigmoney') { $zone = 'quant' }
        elseif ($short -match 'BigStream|Stream') { $zone = 'media' }
        & $ctx.AddEvent 'GITHUB_EVENT' 'github' $short $zone ([string]$e.type + ' ' + $short)
        $emitted++
      }
      $ctx.cursor['github_last_id'] = $newest
    }
    return @{ state = @{ reality_github_pulse = [string]$emitted } }
  } catch { return $null }
}
