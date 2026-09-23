# Probe: fleet machines (BigMoney heartbeat) -> fleet entities + HEARTBEAT events
# Events: HEARTBEAT (registered)

function Probe-fleet_machines {
  param($ctx)
  try {
    $fleet = @()
    $machDir = Join-Path $ctx.root 'quant\bigmoney\fleet\machines'
    if (-not (Test-Path $machDir)) { return @{ state = @{ fleet = $fleet } } }
    foreach ($f in (Get-ChildItem $machDir -Filter *.json)) {
      try {
        $m = Get-Content $f.FullName -Raw -Encoding UTF8 | ConvertFrom-Json
      } catch { continue }
      $id = $m.machine_id
      if (-not $id) { $id = $f.BaseName }
      $seenAt = [string]$m.last_seen
      $online = $false
      try {
        $ls = [datetime]::ParseExact($seenAt, 'yyyy-MM-dd HH:mm', $null)
        $online = ((Get-Date) - $ls).TotalMinutes -le 20
      } catch {}
      $task = [string]$m.current_task
      if ($task.Length -gt 120) { $task = $task.Substring(0,120) + '...' }
      $cores = 0
      try { $cores = [int]$m.cpu_cores } catch {}
      $fleet += @{ id = $id; online = $online; last_seen = $seenAt; cores = $cores; current_task = $task }
      $curKey = 'fleet:' + $id
      $curSeen = ''
      if ($ctx.cursor.ContainsKey($curKey)) { $curSeen = $ctx.cursor[$curKey] }
      if ($curSeen -ne $seenAt) {
        & $ctx.AddEvent 'HEARTBEAT' $id 'bigmoney' 'quant' ('last_seen=' + $seenAt + ' online=' + $online)
      }
      $ctx.cursor[$curKey] = $seenAt
    }
    return @{ state = @{ fleet = $fleet } }
  } catch { return $null }
}
